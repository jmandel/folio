import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  ProblemRow,
  AllergyIntoleranceRow,
  LabResultRow,
  VitalRow,
  Evidence,
  Sensitivity,
  Analyte,
} from "../in/views/views";

// ---------------------------------------------------------------------------
// Time helpers (America/Chicago)
// ---------------------------------------------------------------------------

const TZ = "America/Chicago";
let fmt: Intl.DateTimeFormat | null = null;
function getFmt(): Intl.DateTimeFormat {
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  return fmt;
}

interface LocalParts { y: string; mo: string; d: string; h: string; mi: string; s: string }

function partsAt(ms: number): LocalParts {
  const p: Record<string, string> = {};
  for (const x of getFmt().formatToParts(new Date(ms))) p[x.type] = x.value;
  return { y: p.year, mo: p.month, d: p.day, h: p.hour === "24" ? "00" : p.hour, mi: p.minute, s: p.second };
}

function hasZone(s: string): boolean {
  return /([zZ]|[+-]\d{2}:?\d{2})$/.test(s.trim());
}

/** Instant in ms for a zoned date-time; null otherwise. */
function zonedMs(s: unknown): number | null {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(s) || !hasZone(s)) return null;
  const ms = Date.parse(s);
  return isNaN(ms) ? null : ms;
}

/** Offset (minutes) of Chicago local time from UTC at the instant ms. */
function offsetAt(ms: number): number {
  const p = partsAt(ms);
  const asUtc = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +p.mi, +p.s);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

/** Local date (YYYY-MM-DD or partial) of a source date/date-time. */
function localDate(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  const ms = zonedMs(t);
  if (ms !== null) {
    const p = partsAt(ms);
    return `${p.y}-${p.mo}-${p.d}`;
  }
  const m = /^(\d{4}(?:-\d{2}(?:-\d{2})?)?)/.exec(t);
  return m ? m[1] : null;
}

/** Local wall-clock YYYY-MM-DDTHH:MM. */
function localMinute(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  const ms = zonedMs(t);
  if (ms !== null) {
    const p = partsAt(ms);
    return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}`;
  }
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(t);
  return m ? `${m[1]}T${m[2]}` : null;
}

function fmtOffset(min: number): string {
  const sign = min < 0 ? "-" : "+";
  const a = Math.abs(min);
  return `${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

/** RFC 3339 with Chicago offset. */
function rfc3339Local(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  const ms = zonedMs(t);
  if (ms !== null) {
    const p = partsAt(ms);
    return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}:${p.s}${fmtOffset(offsetAt(ms))}`;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(t);
  if (!m) return null;
  const naive = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], m[6] ? +m[6] : 0);
  let off = offsetAt(naive - 6 * 3600000);
  off = offsetAt(naive - off * 60000);
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? "00"}${fmtOffset(off)}`;
}

/** Sortable key for a time value: ms for zoned, naive-as-Chicago for unzoned. */
function timeKey(s: unknown): number {
  if (typeof s !== "string") return -Infinity;
  const z = zonedMs(s);
  if (z !== null) return z;
  const r = rfc3339Local(s);
  if (r) {
    const ms = Date.parse(r);
    if (!isNaN(ms)) return ms;
  }
  const d = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(s.trim());
  if (d) return Date.UTC(+d[1], d[2] ? +d[2] - 1 : 0, d[3] ? +d[3] : 1, 12);
  return -Infinity;
}

// ---------------------------------------------------------------------------
// Item selection
// ---------------------------------------------------------------------------

interface Doc {
  item: FolioItem;
  recordedKey: number;
  effectiveKey: number;
  enc: any | null;
  kind: string;
  encId: string;
  encStart: number;
  entries: [string, any][];
}

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = items.filter((it) => {
    if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
    const d = localDate(it.recorded);
    return d !== null && d.length === 10 && d <= asOf;
  });
  const byId = new Map<string, FolioItem>();
  for (const it of inScope) byId.set(it.id, it);
  const removed = new Set<string>();
  for (const it of inScope) {
    if (Array.isArray(it.retracts)) for (const r of it.retracts) if (typeof r === "string") removed.add(r);
  }
  // Supersession is transitive: a counting item replaces its targets, which in turn no longer count
  // (and their own targets are replaced too, since supersedes chains).
  const superseded = new Set<string>();
  const visit = (id: string, seen: Set<string>) => {
    const it = byId.get(id);
    if (!it || !Array.isArray(it.supersedes)) return;
    for (const s of it.supersedes) {
      if (typeof s !== "string" || seen.has(s)) continue;
      seen.add(s);
      superseded.add(s);
      visit(s, seen);
    }
  };
  for (const it of inScope) if (!removed.has(it.id)) visit(it.id, new Set([it.id]));
  return inScope.filter((it) => !removed.has(it.id) && !superseded.has(it.id));
}

function toDoc(item: FolioItem): Doc {
  const payload = item.payload && typeof item.payload === "object" ? item.payload : {};
  const entries: [string, any][] = [];
  for (const k of Object.keys(payload)) {
    const v = (payload as any)[k];
    if (v && typeof v === "object" && typeof v.type === "string") entries.push([k, v]);
  }
  const encEntry = entries.find(([, v]) => v.type === "encounter");
  const enc = encEntry ? encEntry[1] : null;
  const effectiveKey = timeKey(item.effective);
  let encStart = effectiveKey;
  if (enc) {
    const a = timeKey(enc.arrived);
    const b = timeKey(enc.admitted);
    if (a > -Infinity) encStart = a;
    else if (b > -Infinity) encStart = b;
  }
  return {
    item,
    recordedKey: timeKey(item.recorded),
    effectiveKey,
    enc,
    kind: enc && typeof enc.document_kind === "string" ? enc.document_kind : "",
    encId: enc && typeof enc.encounter_id === "string" ? enc.encounter_id : `item:${item.id}`,
    encStart,
    entries,
  };
}

function docCmp(a: Doc, b: Doc): number {
  if (a.recordedKey !== b.recordedKey) return a.recordedKey - b.recordedKey;
  if (a.effectiveKey !== b.effectiveKey) return a.effectiveKey - b.effectiveKey;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0;
}

/** The date a document's statuses take effect: discharge for discharge summaries, else effective. */
function docEventDate(d: Doc): string | null {
  if (d.kind === "discharge_summary") {
    const dd = localDate(d.enc?.discharged) ?? localDate(d.item.effective_end);
    if (dd) return dd;
  }
  return localDate(d.item.effective);
}

// ---------------------------------------------------------------------------
// Drug names
// ---------------------------------------------------------------------------

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", victoza: "liraglutide", trulicity: "dulaglutide",
  mounjaro: "tirzepatide", januvia: "sitagliptin", tradjenta: "linagliptin", cozaar: "losartan", diovan: "valsartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", norvasc: "amlodipine", lipitor: "atorvastatin",
  crestor: "rosuvastatin", zocor: "simvastatin", lasix: "furosemide", coumadin: "warfarin", eliquis: "apixaban",
  xarelto: "rivaroxaban", plavix: "clopidogrel", synthroid: "levothyroxine", prilosec: "omeprazole",
  protonix: "pantoprazole", zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine",
  seroquel: "quetiapine", abilify: "aripiprazole", wellbutrin: "bupropion", suboxone: "buprenorphine / naloxone",
  subutex: "buprenorphine", ventolin: "albuterol", proair: "albuterol", keflex: "cephalexin", amoxil: "amoxicillin",
  augmentin: "amoxicillin / clavulanate", zyrtec: "cetirizine", claritin: "loratadine", advil: "ibuprofen",
  motrin: "ibuprofen", aleve: "naproxen", tylenol: "acetaminophen", glucotrol: "glipizide", amaryl: "glimepiride",
  toprol: "metoprolol", lopressor: "metoprolol", microzide: "hydrochlorothiazide", aldactone: "spironolactone",
  neurontin: "gabapentin", lyrica: "pregabalin", truvada: "emtricitabine / tenofovir disoproxil",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", descovy: "emtricitabine / tenofovir alafenamide",
};

const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "er", "xr", "sr", "dr", "xl", "cr", "ir",
  "extended-release", "delayed-release", "immediate-release", "extended", "delayed", "release", "oral", "solution",
  "suspension", "injection", "injectable", "pen", "pens", "inhaler", "hfa", "cream", "ointment", "patch", "chewable",
  "odt", "kwikpen", "flexpen", "flextouch", "solostar", "vial", "syrup", "drops", "spray", "powder", "packet", "liquid",
  "softgel", "gel", "film", "subq", "subcutaneous", "iv", "po", "prefilled", "syringe", "auto-injector", "autoinjector",
  "concentrate", "elixir", "lozenge", "nasal", "ophthalmic", "topical", "transdermal", "enteric", "coated", "ec",
]);
const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "hydrobromide", "sodium", "potassium", "calcium", "magnesium", "maleate", "mesylate",
  "besylate", "besilate", "succinate", "tartrate", "fumarate", "citrate", "sulfate", "acetate", "phosphate",
  "trihydrate", "monohydrate", "dihydrate", "bromide", "chloride", "hyclate", "propionate", "dipropionate",
  "furoate", "valerate", "disoproxil", "medoxomil", "bitartrate", "carbonate",
]);

function ingredientName(drugName: string): string | undefined {
  let s = drugName.toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[®™,]/g, " ").trim();
  if (!s) return undefined;
  const tokens = s.split(/\s+/);
  const out: string[] = [];
  for (const t of tokens) {
    if (/\d/.test(t)) break;
    if (FORM_WORDS.has(t)) break;
    out.push(t);
  }
  if (out.length === 0) return undefined;
  // Brand translation
  const first = out[0].replace(/[^a-z-]/g, "");
  if (BRANDS[first]) return BRANDS[first];
  const kept: string[] = [out[0]];
  for (let i = 1; i < out.length; i++) {
    if (SALT_WORDS.has(out[i])) continue;
    if (out[i] === "insulin") continue;
    kept.push(out[i]);
  }
  // "carbonate" on calcium carbonate etc. is the ingredient itself
  if (kept.length === 1 && ["calcium", "magnesium", "sodium", "potassium"].includes(kept[0]) && out.length > 1) {
    return out.slice(0, 2).join(" ");
  }
  return kept.join(" ").trim() || undefined;
}

// Drug classes for drug-attributed diagnoses.
interface DrugClass { re: RegExp; label: string; member: (ingredient: string) => boolean }
const DRUG_CLASSES: DrugClass[] = [
  { re: /sglt-?2|gliflozin/i, label: "SGLT2 inhibitors", member: (i) => /gliflozin$/.test(i) },
  { re: /\bace[- ]?inhibitor|\bacei\b|angiotensin[- ]converting/i, label: "ACE inhibitors", member: (i) => /pril$/.test(i) },
  { re: /\barbs?\b|angiotensin (ii )?receptor/i, label: "Angiotensin receptor blockers", member: (i) => /sartan$/.test(i) },
  { re: /statin/i, label: "Statins", member: (i) => /statin$/.test(i) },
  { re: /penicillin/i, label: "Penicillins", member: (i) => /cillin$/.test(i) },
  { re: /cephalosporin/i, label: "Cephalosporins", member: (i) => /^(cef|ceph)/.test(i) },
  { re: /fluoroquinolone|quinolone/i, label: "Fluoroquinolones", member: (i) => /floxacin$/.test(i) },
  { re: /nsaid|non-?steroidal/i, label: "NSAIDs", member: (i) => /^(ibuprofen|naproxen|ketorolac|diclofenac|meloxicam|celecoxib|indomethacin|nabumetone|etodolac|piroxicam|aspirin)$/.test(i) },
  { re: /thiazide/i, label: "Thiazide diuretics", member: (i) => /(thiazide|chlorthalidone|indapamide|metolazone)$/.test(i) },
  { re: /loop diuretic/i, label: "Loop diuretics", member: (i) => /^(furosemide|bumetanide|torsemide)$/.test(i) },
  { re: /sulfonylurea/i, label: "Sulfonylureas", member: (i) => /^(glipizide|glyburide|glimepiride)$/.test(i) },
  { re: /dpp-?4|gliptin/i, label: "DPP-4 inhibitors", member: (i) => /gliptin$/.test(i) },
  { re: /glp-?1/i, label: "GLP-1 receptor agonists", member: (i) => /(glutide|exenatide|tirzepatide)$/.test(i) },
  { re: /beta[- ]?blocker/i, label: "Beta blockers", member: (i) => /olol$/.test(i) },
  { re: /\bopioid|opiate/i, label: "Opioids", member: (i) => /^(oxycodone|hydrocodone|morphine|hydromorphone|fentanyl|tramadol|codeine|methadone|tapentadol|buprenorphine)$/.test(i) },
  { re: /\binsulin\b/i, label: "Insulins", member: (i) => /^insulin/.test(i) },
  { re: /sulfonamide|sulfa\b/i, label: "Sulfonamides", member: (i) => /^sulfa/.test(i) },
  { re: /anticoagulant/i, label: "Anticoagulants", member: (i) => /^(warfarin|apixaban|rivaroxaban|dabigatran|edoxaban|heparin|enoxaparin)$/.test(i) },
  { re: /ssri|serotonin reuptake/i, label: "SSRIs", member: (i) => /^(sertraline|fluoxetine|citalopram|escitalopram|paroxetine|fluvoxamine)$/.test(i) },
];

// ICD-10-CM T-code adverse-effect categories (first four characters) -> class wording / regex.
const TCODE_CLASSES: Record<string, string> = {
  "T36.0": "Penicillins", "T36.1": "Cephalosporins", "T36.8": "Fluoroquinolones", "T37.0": "Sulfonamides",
  "T38.3": "Insulin and oral hypoglycemic drugs", "T39.3": "NSAIDs", "T39.0": "Salicylates", "T39.1": "Acetaminophen",
  "T40.2": "Opioids", "T45.5": "Anticoagulants", "T46.4": "ACE inhibitors", "T46.5": "Antihypertensive drugs",
  "T46.6": "Antihyperlipidemic drugs", "T50.1": "Loop diuretics", "T50.2": "Diuretics", "T44.7": "Beta blockers",
  "T43.2": "Antidepressants", "T43.5": "Antipsychotics", "T42.4": "Benzodiazepines", "T38.0": "Glucocorticoids",
};
const TCODE_MEMBER: Record<string, (i: string) => boolean> = {
  "T36.0": (i) => /cillin$/.test(i), "T36.1": (i) => /^(cef|ceph)/.test(i), "T36.8": (i) => /floxacin$/.test(i),
  "T38.3": (i) => /^insulin|gliflozin$|gliptin$|^metformin$|^(glipizide|glyburide|glimepiride)$|glitazone$/.test(i),
  "T39.3": (i) => /^(ibuprofen|naproxen|ketorolac|diclofenac|meloxicam|celecoxib|indomethacin|nabumetone)$/.test(i),
  "T46.4": (i) => /pril$/.test(i), "T46.6": (i) => /statin$|^ezetimibe$/.test(i),
  "T50.1": (i) => /^(furosemide|bumetanide|torsemide)$/.test(i),
  "T50.2": (i) => /thiazide$|^(chlorthalidone|spironolactone|eplerenone)$/.test(i),
  "T44.7": (i) => /olol$/.test(i),
};

function isAdverseTCode(code: string | undefined): boolean {
  return !!code && /^T(3[6-9]|4\d|50)\.[0-9A-Z]{1,2}5/i.test(code.replace(/X/gi, "X"));
}

// ---------------------------------------------------------------------------
// Sensitivity
// ---------------------------------------------------------------------------

const MH_DRUGS = /\b(quetiapine|olanzapine|risperidone|aripiprazole|haloperidol|clozapine|ziprasidone|lurasidone|paliperidone|lithium|lamotrigine|valproate|divalproex|sertraline|fluoxetine|citalopram|escitalopram|paroxetine|fluvoxamine|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|amitriptyline|nortriptyline|buspirone|lorazepam|alprazolam|clonazepam|diazepam|methylphenidate|amphetamine|lisdexamfetamine|atomoxetine)\b/;
const SU_DRUGS = /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|varenicline|nicotine)\b/;
const HIV_DRUGS = /\b(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|efavirenz|rilpivirine|darunavir|atazanavir|ritonavir|cobicistat|abacavir|lamivudine|zidovudine|cabotegravir|lenacapavir|elvitegravir|nevirapine)\b/;
const SRH_DRUGS = /\b(norethindrone|levonorgestrel|ethinyl estradiol|drospirenone|desogestrel|norgestimate|etonogestrel|medroxyprogesterone|ulipristal|mifepristone|misoprostol|clomiphene|letrozole for fertility|sildenafil|tadalafil|progesterone)\b/;

function drugSensitivity(name: string): Sensitivity[] | undefined {
  const s = name.toLowerCase();
  const out: Sensitivity[] = [];
  if (MH_DRUGS.test(s)) out.push("mental-health");
  if (SU_DRUGS.test(s)) out.push("substance-use");
  if (HIV_DRUGS.test(s)) out.push("hiv-sti");
  if (SRH_DRUGS.test(s)) out.push("sexual-reproductive-health");
  return out.length ? out : undefined;
}

function conditionSensitivity(label: string, icd: string | undefined): Sensitivity[] | undefined {
  const s = label.toLowerCase();
  const c = (icd ?? "").toUpperCase();
  const out = new Set<Sensitivity>();
  if (/^F1\d/.test(c) || /alcohol (use|abuse|dependence)|opioid (use|abuse|dependence)|substance (use|abuse)|drug (abuse|dependence)|cocaine|methamphetamine|cannabis use|tobacco use disorder|nicotine dependence|withdrawal/.test(s)) out.add("substance-use");
  if (/^F([02-9]\d)/.test(c) || /depress|bipolar|schizo|anxiety|panic disorder|ptsd|post-traumatic|psychos|adhd|attention[- ]deficit|obsessive|eating disorder|anorexia nervosa|bulimia|suicid|self-harm|personality disorder|mental/.test(s)) {
    if (!/^F1\d/.test(c)) out.add("mental-health");
  }
  if (/^(B20|Z21|A5[0-9]|A6[0-4]|B97\.35|Z20\.6)/.test(c) || /\bhiv\b|human immunodeficiency|chlamydia|gonorrh|syphilis|herpes genital|genital herpes|trichomon|hpv|\bsti\b|sexually transmitted/.test(s)) out.add("hiv-sti");
  if (/^(O\d|Z3[0-9]|N97|Z31)/.test(c) || /pregnan|contracept|infertil|miscarriage|abortion|gestation|postpartum|erectile/.test(s)) out.add("sexual-reproductive-health");
  if (/^Z15|^Z14/.test(c) || /brca|genetic|hereditary|lynch syndrome|cystic fibrosis|sickle cell|huntington/.test(s)) out.add("genetic");
  return out.size ? [...out] : undefined;
}

// ---------------------------------------------------------------------------
// Medications
// ---------------------------------------------------------------------------

const UNIT_MAP: Record<string, "mg" | "mcg" | "units" | "mL" | "tablet"> = {
  mg: "mg", milligram: "mg", milligrams: "mg", mgs: "mg",
  mcg: "mcg", "µg": "mcg", ug: "mcg", microgram: "mcg", micrograms: "mcg",
  u: "units", iu: "units", unit: "units", units: "units",
  ml: "mL", cc: "mL", milliliter: "mL", milliliters: "mL",
  tab: "tablet", tabs: "tablet", tablet: "tablet", tablets: "tablet",
};

function parseStrength(drugName: string): { value: number; unit: "mg" | "mcg" | "units" | "mL" } | null {
  const m = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|units?|iu|u)\b(?!\s*\/)/i.exec(drugName);
  if (!m) return null;
  const u = UNIT_MAP[m[2].toLowerCase()];
  if (!u || u === "tablet") return null;
  return { value: parseFloat(m[1]), unit: u };
}

function parseDose(doseText: unknown, drugName: string, sig: unknown): MedicationRow["dose"] | undefined {
  if (typeof doseText !== "string") return undefined;
  const t = doseText.trim().toLowerCase();
  if (!t) return undefined;
  if (/(\d)\s*(-|–|to|or)\s*\d/.test(t) || /sliding|scale|per protocol|titrat|as directed|variable|if |prn/.test(t)) return undefined;
  const m = /^(\d+(?:\.\d+)?|\d*\.\d+)\s*([a-zµ]+)\.?$/.exec(t);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  const unit = UNIT_MAP[m[2]];
  if (!unit || !isFinite(n)) return undefined;
  if (unit === "tablet" || /^(cap|caps|capsule|capsules)$/.test(m[2])) {
    const st = parseStrength(drugName);
    if (st) return { value: round(n * st.value, 4), unit: st.unit };
    return { value: n, unit: "tablet" };
  }
  return { value: n, unit };
}

function parseFrequency(sig: unknown): MedicationRow["frequency"] | undefined {
  if (typeof sig !== "string") return undefined;
  const s = " " + sig.toLowerCase().replace(/[.,;]/g, " ") + " ";
  if (/\bprn\b|as needed|as-needed|when needed|if needed/.test(s)) return "PRN";
  if (/every other day|\bqod\b|alternate days|taper|monthly|every \d+ (weeks|months)|\bq\d+ ?(wk|week|month)/.test(s)) return "other";
  if (/\bqid\b|four times|4 times|every 6 hours|\bq6h?\b|every 4 hours|\bq4h?\b|five times|every 3 hours/.test(s)) return "other";
  if (/\btid\b|three times|3 times|every 8 hours|\bq8h?\b/.test(s)) return "TID";
  if (/\bbid\b|twice|2 times|two times|every 12 hours|\bq12h?\b/.test(s)) return "BID";
  if (/\bqw\b|weekly|once a week|every week|once per week|\bq ?week\b/.test(s)) return "QW";
  if (/\bqhs\b|at bedtime|bedtime|nightly|at night|\bhs\b/.test(s)) return "QHS";
  if (/\bqd\b|\bdaily\b|once a day|once daily|every day|each day|every morning|in the morning|every evening|in the evening|\bq24h?\b|every 24 hours|\bqam\b|\bqpm\b|once\b/.test(s)) return "QD";
  return undefined;
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] | undefined {
  if (!text) return undefined;
  const s = text.toLowerCase();
  if (/ineffective|not effective|no (benefit|response|improvement)|inadequate (response|control)|failed|not working|did not work/.test(s)) return "ineffective";
  if (/switch|replac|changed to|change to|instead|in favou?r of|substitut|transition(ed)? to/.test(s)) return "therapy_changed";
  if (/course (complete|completed|finished)|completed (the )?course|end of course|finished (the )?course/.test(s)) return "course_complete";
  if (/patient (prefer|declin|choice|chose|wish|request|decided|refus)/.test(s)) return "patient_choice";
  if (/adverse|side effect|reaction|intoleran|allerg|rash|hives|caus|associated|induced|due to|ketoacidosis|\bdka\b|toxicity|angioedema|injury|hypoglyc|hyperkal|lactic acidosis|pancreatitis/.test(s)) return "adverse_reaction";
  return undefined;
}

interface MedLine { doc: Doc; key: string; e: any; ingr: string; rx?: string }

function medStatus(e: any): MedicationRow["status"] {
  switch (e.status) {
    case "continue":
    case "new":
    case "changed":
      return "active";
    case "held":
      return "held";
    case "stopped":
      return "stopped";
    default:
      return "unknown";
  }
}

function medLines(d: Doc): MedLine[] {
  const out: MedLine[] = [];
  for (const [k, e] of d.entries) {
    if (e.type !== "home_med" || typeof e.drug_name !== "string") continue;
    const ingr = ingredientName(e.drug_name) ?? "";
    const rx = typeof e.rxnorm_ingredient === "string" && e.rxnorm_ingredient ? e.rxnorm_ingredient : undefined;
    out.push({ doc: d, key: k, e, ingr, rx });
  }
  return out;
}

function lineId(l: MedLine): string {
  return l.rx ? `rx:${l.rx}` : `nm:${l.ingr || l.e.drug_name.toLowerCase().trim()}`;
}

function buildMedications(docs: Doc[]): MedicationRow[] {
  const withMeds = docs.filter((d) => d.entries.some(([, e]) => e.type === "home_med"));
  if (withMeds.length === 0) return [];
  // Latest encounter (by start), then its latest discharge summary, else its latest document.
  let latestEnc = withMeds[0];
  for (const d of withMeds) {
    if (d.encStart > latestEnc.encStart || (d.encStart === latestEnc.encStart && docCmp(d, latestEnc) > 0)) latestEnc = d;
  }
  const encDocs = withMeds.filter((d) => d.encId === latestEnc.encId).sort(docCmp);
  const dcs = encDocs.filter((d) => d.kind === "discharge_summary");
  const snap = dcs.length ? dcs[dcs.length - 1] : encDocs[encDocs.length - 1];

  const rank: Record<string, number> = { active: 3, held: 2, stopped: 1, unknown: 0 };
  const chosen = new Map<string, MedLine>();
  for (const l of medLines(snap)) {
    const id = lineId(l);
    const prev = chosen.get(id);
    if (!prev || rank[medStatus(l.e)] > rank[medStatus(prev.e)]) chosen.set(id, l);
  }

  const rows: MedicationRow[] = [];
  for (const [id, l] of chosen) {
    const status = medStatus(l.e);
    const evidence: Evidence = [{ item_id: l.doc.item.id, entry_id: l.key }];
    // History of this line within the encounter, for status_since.
    const hist: MedLine[] = [];
    for (const d of encDocs) {
      if (docCmp(d, snap) > 0) continue;
      const ls = medLines(d).filter((x) => lineId(x) === id);
      if (!ls.length) continue;
      const exact = ls.find((x) => x.e.dose_text === l.e.dose_text);
      hist.push(exact ?? ls[0]);
    }
    if (!hist.length || hist[hist.length - 1].doc !== snap) hist.push(l);
    let i = hist.length - 1;
    while (i > 0 && medStatus(hist[i - 1].e) === status && hist[i - 1].e.status !== "not_reconciled") i--;
    const runStart = hist[i];
    let since: string | undefined;
    if (status === "held" || status === "stopped") {
      since = docEventDate(runStart.doc) ?? undefined;
    } else if (status === "active") {
      const resumed = i > 0 && (medStatus(hist[i - 1].e) === "held" || medStatus(hist[i - 1].e) === "stopped");
      if (resumed || runStart.e.status === "new" || runStart.e.status === "changed") {
        since = docEventDate(runStart.doc) ?? undefined;
      }
    }
    if (since && runStart.doc !== l.doc) evidence.unshift({ item_id: runStart.doc.item.id, entry_id: runStart.key });

    const row: MedicationRow = {
      drug_name: l.e.drug_name,
      status,
      patient_reported: false,
      evidence,
    };
    if (l.ingr) row.ingredient = l.ingr;
    if (l.rx) row.rxnorm_ingredient = l.rx;
    if (since) row.status_since = since;
    const dose = parseDose(l.e.dose_text, l.e.drug_name, l.e.sig);
    if (dose) row.dose = dose;
    const freq = parseFrequency(l.e.sig);
    if (freq) row.frequency = freq;
    const instr = typeof l.e.instructions === "string" && l.e.instructions.trim() ? l.e.instructions.trim() : undefined;
    if (instr && status !== "unknown") row.status_reason_text = instr;
    if (status === "stopped") {
      const r = stopReason(instr);
      if (r) row.stop_reason = r;
    }
    const sens = drugSensitivity(`${l.ingr} ${l.e.drug_name}`);
    if (sens) row.sensitivity = sens;
    rows.push(row);
  }
  rows.sort((a, b) => (a.ingredient ?? a.drug_name).localeCompare(b.ingredient ?? b.drug_name));
  return rows;
}

// ---------------------------------------------------------------------------
// Problems and drug-attributed allergies
// ---------------------------------------------------------------------------

interface DxEntry { doc: Doc; key: string; e: any; kind: "diagnosis" | "history"; label: string; icd?: string; rrh?: string }

function normLabel(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isCkd(label: string, icd?: string): boolean {
  return (!!icd && /^N18/i.test(icd)) || /chronic kidney disease|\bckd\b/i.test(label);
}

function ckdStage(label: string, icd?: string): ProblemRow["ckd_stage"] | undefined {
  const s = label.toLowerCase();
  let m = /\bg([1-5])([ab])?\b/.exec(s) ?? /stage\s*([1-5])\s*([ab])?\b/.exec(s) ?? /\bckd\s*([1-5])([ab])?\b/.exec(s);
  if (m) {
    const n = m[1];
    if (n === "3") return m[2] === "a" ? "G3a" : m[2] === "b" ? "G3b" : undefined;
    return (`G${n}`) as ProblemRow["ckd_stage"];
  }
  if (/end[- ]stage|esrd|eskd/.test(s)) return "G5";
  const c = (icd ?? "").toUpperCase();
  const map: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
  return map[c];
}

function albuminuria(label: string): ProblemRow["albuminuria"] | undefined {
  const m = /\ba([123])\b/i.exec(label);
  if (m) return (`A${m[1]}`) as ProblemRow["albuminuria"];
  if (/severely increased albuminuria|macroalbuminuria/i.test(label)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria/i.test(label)) return "A2";
  return undefined;
}

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

function parseOnset(t: unknown): ProblemRow["onset"] | undefined {
  if (typeof t !== "string") return undefined;
  const s = t.trim();
  let m = /^(\d{4})$/.exec(s);
  if (m) return { value: m[1], precision: "year" };
  m = /^(\d{4})-(\d{2})$/.exec(s);
  if (m) return { value: s, precision: "month" };
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return { value: s, precision: "day" };
  m = /^([a-z]{3})[a-z]*\.?\s+(\d{4})$/i.exec(s);
  if (m && MONTHS[m[1].toLowerCase()]) return { value: `${m[2]}-${MONTHS[m[1].toLowerCase()]}`, precision: "month" };
  return undefined;
}

const ATTRIB_RE = /(?:[,;]?\s*(?:due to|secondary to|caused by|induced by|associated with|attributed to|from)\s+(.+)$)|(?:[,;]?\s*([a-z0-9 \-/]+?)[- ](?:associated|induced|related)\b.*$)/i;

interface Attribution { drugText: string; condition: string | null }

/** Detect a drug attribution in a diagnosis; returns the drug phrase and the remaining condition. */
function drugAttribution(dx: DxEntry, knownDrugs: string[]): Attribution | null {
  const texts = [dx.label, dx.e?.riverside_dx?.name].filter((x): x is string => typeof x === "string");
  const adverseOnly = /^(adverse (drug )?(effect|reaction)s?|side effects?|intolerance|allergic reaction|drug allergy)\s+(of|to|from)\s+(.+)$/i;
  for (const t of texts) {
    const m0 = adverseOnly.exec(t.trim());
    if (m0) return { drugText: m0[5], condition: null };
  }
  for (const t of texts) {
    const m = ATTRIB_RE.exec(t);
    if (!m) continue;
    const drugText = (m[1] ?? m[2] ?? "").trim();
    if (!drugText) continue;
    const isDrug = DRUG_CLASSES.some((c) => c.re.test(drugText)) || knownDrugs.some((d) => d && new RegExp(`\\b${escapeRe(d)}\\b`, "i").test(drugText)) || /drug|medication|\b[a-z]+(pril|sartan|statin|cillin|floxacin|gliflozin|gliptin|glutide|olol|azole|mycin|cycline|formin|thiazide)\b/i.test(drugText);
    if (!isDrug) continue;
    const condition = t.slice(0, m.index).replace(/[\s,;:-]+$/, "").trim();
    // "Statin-associated myopathy": the condition follows the attribution; keep the whole label.
    return { drugText, condition: condition || t.trim() };
  }
  if (isAdverseTCode(dx.icd)) {
    return { drugText: "", condition: dx.label };
  }
  return null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface Group { entries: DxEntry[] }

function buildProblems(docs: Doc[], allergyOut: Map<string, AllergyIntoleranceRow>): ProblemRow[] {
  const all: DxEntry[] = [];
  for (const d of docs) {
    for (const [k, e] of d.entries) {
      if (e.type === "diagnosis" && typeof e.label === "string") {
        all.push({ doc: d, key: k, e, kind: "diagnosis", label: e.label, icd: typeof e.icd10cm === "string" ? e.icd10cm : undefined, rrh: typeof e.riverside_dx?.code === "string" ? e.riverside_dx.code : undefined });
      } else if (e.type === "history" && typeof e.condition === "string") {
        all.push({ doc: d, key: k, e, kind: "history", label: e.condition, icd: typeof e.icd10cm === "string" ? e.icd10cm : undefined });
      }
    }
  }
  // Grouping: Riverside code, then CKD, then ICD-10-CM, then label.
  const groups: Group[] = [];
  const byRrh = new Map<string, Group>();
  const byIcd = new Map<string, Group[]>();
  const byLabel = new Map<string, Group>();
  const addIndex = (g: Group, x: DxEntry) => {
    if (x.icd) {
      const arr = byIcd.get(x.icd.toUpperCase()) ?? [];
      if (!arr.includes(g)) arr.push(g);
      byIcd.set(x.icd.toUpperCase(), arr);
    }
    byLabel.set(normLabel(x.label), g);
  };
  let ckdGroup: Group | null = null;
  const sorted = [...all].sort((a, b) => (a.rrh ? 0 : 1) - (b.rrh ? 0 : 1) || docCmp(a.doc, b.doc));
  for (const x of sorted) {
    let g: Group | undefined;
    if (x.rrh) g = byRrh.get(x.rrh);
    if (!g && isCkd(x.label, x.icd)) g = ckdGroup ?? undefined;
    if (!g && !x.rrh && x.icd) {
      const arr = byIcd.get(x.icd.toUpperCase());
      if (arr && arr.length === 1) g = arr[0];
    }
    if (!g) {
      const lg = byLabel.get(normLabel(x.label));
      if (lg) {
        const lgRrh = lg.entries.find((y) => y.rrh)?.rrh;
        if (!x.rrh || !lgRrh || lgRrh === x.rrh) g = lg;
      }
    }
    if (!g) {
      g = { entries: [] };
      groups.push(g);
    }
    g.entries.push(x);
    if (x.rrh && !byRrh.has(x.rrh)) byRrh.set(x.rrh, g);
    if (isCkd(x.label, x.icd) && !ckdGroup) ckdGroup = g;
    addIndex(g, x);
  }

  const rows: ProblemRow[] = [];
  for (const g of groups) {
    const ents = [...g.entries].sort((a, b) => docCmp(a.doc, b.doc));
    const dxs = ents.filter((x) => x.kind === "diagnosis");
    const hist = ents.filter((x) => x.kind === "history");
    // Latest decisive diagnosis status.
    const decisive = dxs.filter((x) => x.e.status === "active" || x.e.status === "resolved" || x.e.status === "ruled_out");
    let latest: DxEntry | undefined;
    let status: ProblemRow["status"];
    if (decisive.length) {
      latest = decisive[decisive.length - 1];
      if (latest.e.status === "ruled_out") continue;
      status = latest.e.status === "resolved" ? "resolved" : "active";
    } else if (dxs.length) {
      // Only working diagnoses: not a row.
      continue;
    } else if (hist.length) {
      latest = hist[hist.length - 1];
      status = "active";
    } else continue;

    // Drug attribution: from the latest entry, else the most recent present entry that states one.
    let attr: Attribution | null = null;
    let attrEntry: DxEntry = latest;
    const present = latest.kind === "diagnosis" ? decisive.filter((x) => x.e.status !== "ruled_out") : [];
    for (let i = present.length - 1; i >= 0 && !attr; i--) {
      const known = medLines(present[i].doc).map((l) => l.ingr).filter((x) => !!x);
      attr = drugAttribution(present[i], known);
      if (attr) attrEntry = present[i];
    }
    if (attr) addDrugAllergy(attrEntry, attr, allergyOut);
    if (attr && attr.condition === null && attrEntry === latest) continue;

    const row: ProblemRow = { condition: latest.label, status, evidence: [{ item_id: latest.doc.item.id, entry_id: latest.key }] };
    if (latest.icd) row.icd10cm = latest.icd;
    // Onset: history lines carry free-text onset.
    for (let i = hist.length - 1; i >= 0; i--) {
      const o = parseOnset(hist[i].e.onset_text);
      if (o) {
        row.onset = o;
        if (hist[i] !== latest) row.evidence.push({ item_id: hist[i].doc.item.id, entry_id: hist[i].key });
        break;
      }
    }
    if (isCkd(latest.label, latest.icd) || ents.some((x) => isCkd(x.label, x.icd))) {
      // Clinician-assessed diagnoses take precedence over unverified history lines.
      const ordered = [...hist, ...dxs.filter((x) => x.e.status !== "ruled_out" && x.e.status !== "working")];
      for (let i = ordered.length - 1; i >= 0; i--) {
        const st = ckdStage(ordered[i].label, ordered[i].icd);
        if (st) { row.ckd_stage = st; break; }
      }
      for (let i = ordered.length - 1; i >= 0; i--) {
        const a = albuminuria(ordered[i].label);
        if (a) { row.albuminuria = a; break; }
      }
    }
    const sens = conditionSensitivity(latest.label, latest.icd);
    if (sens) row.sensitivity = sens;
    rows.push(row);
  }
  rows.sort((a, b) => a.condition.localeCompare(b.condition));
  return rows;
}

const HYPERSENS_RE = /hives|urticaria|rash|swelling|angioedema|anaphyla|bronchospasm|wheez|itch|prurit|stevens|sjs|toxic epidermal|dress|exanthem|flushing|throat (tight|closing)|lip|tongue|face swelling|facial swelling|hypersensitivity|allergic/i;
const SERIOUS_RE = /ketoacidosis|\bdka\b|liver|hepat|pancreatitis|kidney injury|renal failure|\baki\b|nephrotox|agranulocytosis|neutropenia|thrombocytopenia|aplastic|qt prolong|torsade|arrhythm|seizure|rhabdo|lactic acidosis|hyperkal|bleed|hemorrhag|serotonin syndrome|neuroleptic malignant|tendon rupture|myopathy|interstitial|hypoglycemi[ac] (seizure|coma)|coma|severe/i;
const NONIMMUNE_RE = /cough|nausea|vomit|gi upset|stomach|dyspepsia|diarrh|constipat|drows|sedat|dizz|headache|myalgia|muscle (ache|pain)|fatigue|insomnia|hypoglyc|ketoacidosis|\bdka\b|lactic acidosis|hyperkal|edema|ankle swelling|bradycard|hypotension|kidney injury|\baki\b|flushing on niacin/i;

function classifyReaction(reaction: string | undefined): AllergyIntoleranceRow["reaction_type"] {
  if (!reaction) return "hypersensitivity";
  if (/ankle swelling|leg swelling|peripheral edema/i.test(reaction)) return "side_effect";
  if (HYPERSENS_RE.test(reaction)) return "hypersensitivity";
  if (SERIOUS_RE.test(reaction)) return "serious_adverse_event";
  return "side_effect";
}

function classifyMechanism(reaction: string | undefined, type: AllergyIntoleranceRow["reaction_type"]): AllergyIntoleranceRow["mechanism"] {
  if (!reaction) return "unknown";
  if (/ige[- ]mediated|immune[- ]mediated|positive (skin|patch|allergy) test|confirmed (by )?(skin|allergy) test/i.test(reaction)) return "immune";
  if (type !== "hypersensitivity" && NONIMMUNE_RE.test(reaction)) return "non_immune";
  return "unknown";
}

function addDrugAllergy(dx: DxEntry, attr: Attribution, out: Map<string, AllergyIntoleranceRow>) {
  const lines = medLines(dx.doc);
  const evidence: Evidence = [{ item_id: dx.doc.item.id, entry_id: dx.key }];
  let substance: string | null = null;
  let rx: string | undefined;
  const drugText = attr.drugText;
  // Named single drug among the item's medication list or in the text.
  if (drugText) {
    for (const l of lines) {
      if (l.ingr && new RegExp(`\\b${escapeRe(l.ingr)}\\b`, "i").test(drugText)) {
        substance = l.ingr; rx = l.rx; evidence.push({ item_id: l.doc.item.id, entry_id: l.key }); break;
      }
    }
    if (!substance) {
      const cls = DRUG_CLASSES.find((c) => c.re.test(drugText));
      if (cls) {
        const members = uniqueBy(lines.filter((l) => l.ingr && cls.member(l.ingr)), (l) => l.ingr);
        if (members.length === 1) {
          substance = members[0].ingr; rx = members[0].rx;
          evidence.push({ item_id: members[0].doc.item.id, entry_id: members[0].key });
        } else {
          substance = drugText.replace(/^(an?|the)\s+/i, "");
        }
      } else {
        const single = /^[a-z]+$/i.test(drugText.trim()) ? drugText.trim().toLowerCase() : null;
        substance = single ? (BRANDS[single] ?? single) : drugText.trim();
      }
    }
  } else if (dx.icd) {
    const cat = dx.icd.toUpperCase().slice(0, 5);
    const member = TCODE_MEMBER[cat];
    if (member) {
      const members = uniqueBy(lines.filter((l) => l.ingr && member(l.ingr)), (l) => l.ingr);
      if (members.length === 1) {
        substance = members[0].ingr; rx = members[0].rx;
        evidence.push({ item_id: members[0].doc.item.id, entry_id: members[0].key });
      }
    }
    if (!substance) substance = TCODE_CLASSES[cat] ?? null;
  }
  if (!substance) return;
  const reaction = attr.condition ?? undefined;
  const type = classifyReaction(reaction);
  const row: AllergyIntoleranceRow = {
    substance,
    reaction_type: type,
    mechanism: classifyMechanism(reaction, type),
    criticality:
      type === "serious_adverse_event" || (reaction && /anaphyla|angioedema/i.test(reaction)) ? "high" : "unknown",
    evidence,
  };
  if (rx) row.rxnorm_ingredient = rx;
  if (reaction) row.reaction = reaction;
  const sens = drugSensitivity(substance);
  if (sens) row.sensitivity = sens;
  mergeAllergy(out, row);
}

function uniqueBy<T>(arr: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>();
  return arr.filter((x) => (seen.has(key(x)) ? false : (seen.add(key(x)), true)));
}

function mergeAllergy(out: Map<string, AllergyIntoleranceRow>, row: AllergyIntoleranceRow) {
  const k = row.rxnorm_ingredient ? `rx:${row.rxnorm_ingredient}` : `s:${row.substance.toLowerCase()}`;
  let existing = out.get(k);
  if (!existing) {
    for (const v of out.values()) if (v.substance.toLowerCase() === row.substance.toLowerCase()) existing = v;
  }
  if (!existing) {
    out.set(k, row);
    return;
  }
  for (const e of row.evidence) {
    if (!existing.evidence.some((x) => x.item_id === e.item_id && x.entry_id === e.entry_id)) existing.evidence.push(e);
  }
  if (row.reaction && existing.reaction && !existing.reaction.toLowerCase().includes(row.reaction.toLowerCase())) {
    existing.reaction = `${existing.reaction}; ${row.reaction}`;
    const sev: Record<string, number> = { hypersensitivity: 2, serious_adverse_event: 3, side_effect: 1 };
    if (sev[row.reaction_type] > sev[existing.reaction_type]) existing.reaction_type = row.reaction_type;
    if (row.criticality === "high") existing.criticality = "high";
  }
}

function buildAllergyList(docs: Doc[], out: Map<string, AllergyIntoleranceRow>) {
  const withAlg = docs.filter((d) => d.entries.some(([, e]) => e.type === "allergy"));
  if (!withAlg.length) return;
  const snap = [...withAlg].sort(docCmp)[withAlg.length - 1];
  for (const [k, e] of snap.entries) {
    if (e.type !== "allergy" || typeof e.substance !== "string") continue;
    const sub = e.substance.trim();
    if (!sub || /^(nkda|nka|no known (drug )?allergies)$/i.test(sub)) continue;
    const rx = typeof e.rxnorm_ingredient === "string" && e.rxnorm_ingredient ? e.rxnorm_ingredient : undefined;
    const substance = rx ? (ingredientName(sub) ?? sub.toLowerCase()) : sub;
    const reaction = typeof e.reaction === "string" && e.reaction.trim() ? e.reaction.trim() : undefined;
    const type = classifyReaction(reaction);
    const crit: AllergyIntoleranceRow["criticality"] =
      e.severity === "severe" ? "high" : e.severity === "mild" || e.severity === "moderate" ? "low" : "unknown";
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: type,
      mechanism: classifyMechanism(reaction, type),
      criticality: crit,
      evidence: [{ item_id: snap.item.id, entry_id: k }],
    };
    if (rx) row.rxnorm_ingredient = rx;
    if (reaction) row.reaction = reaction.split(/\s*[,;]\s*/).filter(Boolean).join("; ");
    const sens = drugSensitivity(substance);
    if (sens) row.sensitivity = sens;
    mergeAllergy(out, row);
  }
}

// ---------------------------------------------------------------------------
// Labs
// ---------------------------------------------------------------------------

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "88293-6": "egfr", "88294-4": "egfr", "50044-7": "egfr", "69405-9": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose", "41653-7": "glucose", "1547-9": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "30313-1": "hemoglobin",
  "53060-9": "bhb", "2746-6": "ph", "2744-1": "ph", "2753-2": "ph", "11558-4": "ph", "2021-4": "pco2", "2019-8": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "1798-8": "lipase", "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

const LOCAL_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc",
  HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", PH: "ph", VPH: "ph", APH: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2",
  LIPASE: "lipase", TROPI: "troponin", TNI: "troponin", HSTNI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides",
  HDL: "hdl", LDL: "ldl", LDLC: "ldl", LDLD: "ldl",
};

const NAME_ANALYTE: [RegExp, Analyte][] = [
  [/albumin.*creatinine|\buacr\b|\bacr\b/i, "uacr"],
  [/\begfr\b|glomerular filtration/i, "egfr"],
  [/creatinine/i, "creatinine"],
  [/potassium/i, "potassium"],
  [/sodium/i, "sodium"],
  [/chloride/i, "chloride"],
  [/anion gap/i, "anion_gap"],
  [/bicarbonate|total co2|\bco2\b(?!.*partial)/i, "bicarbonate"],
  [/urea nitrogen|\bbun\b/i, "bun"],
  [/a1c|glycated h[ae]moglobin|glycohemoglobin/i, "a1c"],
  [/glucose/i, "glucose"],
  [/platelet/i, "platelets"],
  [/white blood|\bwbc\b|leukocyte/i, "wbc"],
  [/h[ae]moglobin|\bhgb\b/i, "hemoglobin"],
  [/hydroxybutyrate|\bbhb\b/i, "bhb"],
  [/^p\s?h\b|\bph\b/i, "ph"],
  [/pco2|partial pressure of (carbon dioxide|co2)/i, "pco2"],
  [/lipase/i, "lipase"],
  [/troponin\s*i\b|troponin i\b|\btni\b/i, "troponin"],
  [/hdl/i, "hdl"],
  [/ldl/i, "ldl"],
  [/triglyceride/i, "triglycerides"],
  [/cholesterol/i, "cholesterol"],
];

const UNIT_OF: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L", bicarbonate: "mmol/L",
  anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL",
  hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL",
  triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function analyteOf(test: any, specimen: string): Analyte | null {
  if (!test || typeof test !== "object") return null;
  const name = typeof test.name === "string" ? test.name : "";
  const code = typeof test.local_code === "string" ? test.local_code.toUpperCase() : "";
  const loinc = typeof test.loinc === "string" ? test.loinc : "";
  const spec = `${specimen} ${name}`.toLowerCase();
  if (/troponin\s*t\b|tnt\b/i.test(name)) return null;
  let a: Analyte | null = LOINC_ANALYTE[loinc] ?? LOCAL_ANALYTE[code] ?? null;
  if (!a) for (const [re, an] of NAME_ANALYTE) if (re.test(name)) { a = an; break; }
  if (!a) return null;
  const urine = /urine|\bur\b|csf|cerebrospinal|fluid|pleural|peritoneal|stool|dialysate/.test(spec);
  if (a === "uacr") return /urine|\bur\b|albumin/.test(spec) || loinc ? a : a;
  if (urine) return null;
  return a;
}

function convert(a: Analyte, v: number, unitRaw: string | undefined): number | null {
  const target = UNIT_OF[a];
  const u = (unitRaw ?? "").trim();
  const ul = u.toLowerCase().replace(/\s+/g, "");
  if (a === "ph") return v;
  if (ul === target.toLowerCase().replace(/\s+/g, "")) return v;
  switch (a) {
    case "creatinine":
      if (ul === "umol/l" || ul === "µmol/l") return v / 88.42;
      if (ul === "mg/dl") return v;
      return null;
    case "egfr":
      if (/^ml\/min(\/1\.73m2|\/1\.73m\^2|\/1\.73\s?m2|\/{1\.73_m2})?$/.test(ul) || ul.startsWith("ml/min")) return v;
      return null;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      if (ul === "meq/l" || ul === "mmol/l") return v;
      return null;
    case "bun":
      if (ul === "mmol/l") return v * 2.801;
      return null;
    case "glucose":
      if (ul === "mmol/l") return v * 18.016;
      return null;
    case "a1c":
      if (ul === "%" || ul === "%hb" || ul === "%ofhb") return v;
      if (ul === "mmol/mol") return v / 10.929 + 2.15;
      return null;
    case "uacr":
      if (ul === "mg/g" || ul === "ug/mg" || ul === "mcg/mg" || ul === "mg/gcreat" || ul === "mg/g{creat}") return v;
      if (ul === "mg/mmol") return v * 8.84;
      return null;
    case "platelets": case "wbc":
      if (ul === "10*3/ul" || ul === "k/ul" || ul === "10^3/ul" || ul === "x10*3/ul" || ul === "10*9/l" || ul === "10^9/l" || ul === "thou/ul" || ul === "k/mm3" || ul === "10*3/mm3") return v;
      if (ul === "/ul" || ul === "cells/ul" || ul === "/mm3") return v / 1000;
      return null;
    case "hemoglobin":
      if (ul === "g/dl") return v;
      if (ul === "g/l") return v / 10;
      if (ul === "mmol/l") return v * 1.611;
      return null;
    case "bhb":
      if (ul === "mmol/l") return v;
      if (ul === "mg/dl") return v / 10.41;
      return null;
    case "pco2":
      if (ul === "mmhg" || ul === "mm[hg]") return v;
      if (ul === "kpa") return v * 7.50062;
      return null;
    case "lipase":
      if (ul === "u/l" || ul === "iu/l") return v;
      return null;
    case "troponin":
      if (ul === "ng/ml" || ul === "ug/l") return v;
      if (ul === "ng/l" || ul === "pg/ml") return v / 1000;
      return null;
    case "cholesterol": case "hdl": case "ldl":
      if (ul === "mg/dl") return v;
      if (ul === "mmol/l") return v * 38.67;
      return null;
    case "triglycerides":
      if (ul === "mg/dl") return v;
      if (ul === "mmol/l") return v * 88.57;
      return null;
  }
  return null;
}

function round(v: number, digits: number): number {
  const f = Math.pow(10, digits);
  return Math.round(v * f) / f;
}

function parseLabValue(s: unknown): { v: number; cmp?: LabResultRow["comparator"]; decimals: number } | null {
  if (typeof s !== "string" && typeof s !== "number") return null;
  const t = String(s).trim().replace(/,/g, "");
  const m = /^(<=|>=|≤|≥|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/.exec(t);
  if (!m) return null;
  const v = parseFloat(m[2]);
  if (!isFinite(v)) return null;
  let cmp: LabResultRow["comparator"] | undefined;
  if (m[1]) cmp = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as LabResultRow["comparator"]);
  const dec = m[2].includes(".") ? m[2].split(".")[1].length : 0;
  return { v, cmp, decimals: dec };
}

function egfrEquation(test: any, collected: string): LabResultRow["egfr_equation"] {
  const name = `${test?.name ?? ""} ${test?.local_code ?? ""}`.toLowerCase();
  const loinc = test?.loinc ?? "";
  if (/2021/.test(name) || loinc === "98979-8") return "ckd-epi-2021";
  if (/2009/.test(name) || loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  if (/mdrd/.test(name) || loinc === "48642-3" || loinc === "48643-1" || loinc === "33914-3") return "mdrd";
  if (/ckd-?epi/.test(name)) {
    const d = localDate(collected);
    if (d && d >= "2023") return "ckd-epi-2021";
    return "unknown";
  }
  const d = localDate(collected);
  if (d && d >= "2023") return "ckd-epi-2021";
  return "unknown";
}

function isRaceVariant(test: any): boolean {
  const name = String(test?.name ?? "").toLowerCase();
  const loinc = test?.loinc ?? "";
  if (loinc === "48643-1" || loinc === "88293-6") return true;
  if (/non[- ]?(african|black|aa)/.test(name)) return false;
  return /african|black|\baa\b/.test(name);
}

interface LabCopy { doc: Doc; key: string; status: string; rv: any; collected: string; specimen: string }

function buildLabs(docs: Doc[]): LabResultRow[] {
  const copies = new Map<string, LabCopy[]>();
  const push = (c: LabCopy, accession: string) => {
    const code = String(c.rv?.test?.local_code ?? c.rv?.test?.loinc ?? c.rv?.test?.name ?? "");
    const k = `${accession}|${code}`;
    const arr = copies.get(k) ?? [];
    arr.push(c);
    copies.set(k, arr);
  };
  for (const d of docs) {
    for (const [k, e] of d.entries) {
      if (e.type === "result" && e.test && typeof e.accession === "string") {
        push({ doc: d, key: k, status: String(e.status ?? ""), rv: e, collected: e.collected, specimen: String(e.specimen ?? "") }, e.accession);
      } else if (e.type === "panel" && Array.isArray(e.components) && typeof e.accession === "string") {
        for (const comp of e.components) {
          if (!comp || typeof comp !== "object" || !comp.test) continue;
          push({ doc: d, key: k, status: String(e.status ?? ""), rv: comp, collected: e.collected, specimen: String(e.specimen ?? "") }, e.accession);
        }
      }
    }
  }
  const statusRank: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };
  const rows: LabResultRow[] = [];
  for (const [, arr] of copies) {
    const valid = arr.filter((c) => statusRank[c.status] !== undefined);
    if (!valid.length) continue;
    let best = valid[0];
    for (const c of valid) {
      const r = statusRank[c.status] - statusRank[best.status];
      if (r > 0 || (r === 0 && docCmp(c.doc, best.doc) > 0)) best = c;
    }
    const a = analyteOf(best.rv.test, best.specimen);
    if (!a) continue;
    if (a === "egfr" && isRaceVariant(best.rv.test)) continue;
    const pv = parseLabValue(best.rv.value);
    if (!pv) continue;
    const unitRaw = typeof best.rv.unit === "string" ? best.rv.unit : undefined;
    const conv = convert(a, pv.v, unitRaw);
    if (conv === null) continue;
    const collected = rfc3339Local(best.collected);
    if (!collected) continue;
    const converted = conv !== pv.v;
    const value = converted ? (Math.abs(conv) >= 100 ? Math.round(conv) : Math.abs(conv) >= 10 ? round(conv, 1) : Number(conv.toPrecision(3))) : pv.v;
    const evidence: Evidence = [];
    const sortedCopies = [...valid].sort((x, y) => docCmp(x.doc, y.doc));
    evidence.push({ item_id: best.doc.item.id, entry_id: best.key });
    for (const c of sortedCopies) {
      if (c === best) continue;
      if (c.status !== best.status || String(c.rv.value) !== String(best.rv.value)) continue;
      if (!evidence.some((e) => e.item_id === c.doc.item.id && e.entry_id === c.key)) evidence.push({ item_id: c.doc.item.id, entry_id: c.key });
    }
    const row: LabResultRow = {
      analyte: a,
      value,
      unit: UNIT_OF[a],
      collected,
      status: best.status === "preliminary" ? "preliminary" : "final",
      evidence,
    };
    if (pv.cmp) row.comparator = pv.cmp;
    if (a === "egfr") row.egfr_equation = egfrEquation(best.rv.test, best.collected);
    if (typeof best.rv.test.loinc === "string" && best.rv.test.loinc) row.loinc = best.rv.test.loinc;
    rows.push(row);
  }
  rows.sort((x, y) => (x.collected < y.collected ? -1 : x.collected > y.collected ? 1 : x.analyte.localeCompare(y.analyte)));
  return rows;
}

// ---------------------------------------------------------------------------
// Vitals
// ---------------------------------------------------------------------------

function num(v: unknown): number | undefined {
  return typeof v === "number" && isFinite(v) ? v : undefined;
}

function buildVitals(docs: Doc[]): VitalRow[] {
  interface V { doc: Doc; key: string; e: any; t: number; local: string; encId: string }
  const all: V[] = [];
  for (const d of docs) {
    for (const [k, e] of d.entries) {
      if (e.type !== "vitals") continue;
      const local = localMinute(e.taken);
      if (!local) continue;
      all.push({ doc: d, key: k, e, t: timeKey(e.taken), local, encId: d.encId });
    }
  }
  all.sort((a, b) => a.t - b.t || docCmp(a.doc, b.doc));
  const sig = (e: any) => JSON.stringify([e.bp?.systolic_mmhg, e.bp?.diastolic_mmhg, e.heart_rate_bpm, e.weight_kg, e.resp_rate_per_min, e.temp_f, e.spo2_pct]);
  const rows: VitalRow[] = [];
  const rowMeta: { t: number; encId: string; sig: string; hasRepeat: boolean; doc: Doc }[] = [];
  for (const v of all) {
    const sys = num(v.e.bp?.systolic_mmhg);
    const dia = num(v.e.bp?.diastolic_mmhg);
    const pulse = num(v.e.heart_rate_bpm);
    const wt = num(v.e.weight_kg);
    const s = sig(v.e);
    // Duplicate copy of the same set (same time, same values).
    const dupIdx = rowMeta.findIndex((m) => m.t === v.t && m.sig === s);
    if (dupIdx >= 0) {
      const ev = rows[dupIdx].evidence;
      if (!ev.some((x) => x.item_id === v.doc.item.id && x.entry_id === v.key)) ev.push({ item_id: v.doc.item.id, entry_id: v.key });
      continue;
    }
    // Repeat BP within the same visit shortly after a set, recorded in the same document, BP only.
    const onlyBp = sys !== undefined && pulse === undefined && wt === undefined && num(v.e.resp_rate_per_min) === undefined && num(v.e.temp_f) === undefined && num(v.e.spo2_pct) === undefined;
    if (onlyBp && rows.length) {
      const i = rows.length - 1;
      const m = rowMeta[i];
      if (m.doc === v.doc && m.encId === v.encId && !m.hasRepeat && v.t - m.t > 0 && v.t - m.t <= 60 * 60000 && rows[i].systolic_mmhg !== undefined) {
        rows[i].repeat_systolic_mmhg = sys;
        if (dia !== undefined) rows[i].repeat_diastolic_mmhg = dia;
        rows[i].evidence.push({ item_id: v.doc.item.id, entry_id: v.key });
        m.hasRepeat = true;
        continue;
      }
    }
    if (sys === undefined && dia === undefined && pulse === undefined && wt === undefined) continue;
    const row: VitalRow = { setting: "hospital", local_time: v.local, evidence: [{ item_id: v.doc.item.id, entry_id: v.key }] };
    if (sys !== undefined) row.systolic_mmhg = sys;
    if (dia !== undefined) row.diastolic_mmhg = dia;
    if (pulse !== undefined) row.pulse_bpm = pulse;
    if (wt !== undefined) row.weight_kg = round(wt, 1);
    rows.push(row);
    rowMeta.push({ t: v.t, encId: v.encId, sig: s, hasRepeat: false, doc: v.doc });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return empty;
  let docs: Doc[];
  try {
    docs = countingItems(items, asOf).map(toDoc).sort(docCmp);
  } catch {
    return empty;
  }
  const safe = <T>(f: () => T[]): T[] => {
    try {
      return f();
    } catch {
      return [];
    }
  };
  const allergyMap = new Map<string, AllergyIntoleranceRow>();
  safe(() => (buildAllergyList(docs, allergyMap), []));
  const problems = safe(() => buildProblems(docs, allergyMap));
  return {
    medications: safe(() => buildMedications(docs)),
    problems,
    allergies: [...allergyMap.values()],
    labs: safe(() => buildLabs(docs)),
    vitals: safe(() => buildVitals(docs)),
  };
}
