// Mapper: Riverside Regional Hospital signed clinical documents (riverside-doc-v1) -> consumer views.
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

const TZ = "America/Chicago";

// ---------------------------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------------------------

let dtf: Intl.DateTimeFormat | null = null;
function fmt(): Intl.DateTimeFormat {
  if (!dtf) {
    dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
  }
  return dtf;
}

interface Wall { y: number; mo: number; d: number; h: number; mi: number; s: number }

function wallOf(ms: number): Wall {
  const parts = fmt().formatToParts(new Date(ms));
  const get = (t: string) => {
    const p = parts.find((x) => x.type === t);
    return p ? parseInt(p.value, 10) : 0;
  };
  let h = get("hour");
  if (h === 24) h = 0;
  return { y: get("year"), mo: get("month"), d: get("day"), h, mi: get("minute"), s: get("second") };
}

/** Offset of America/Chicago from UTC at instant `ms`, in minutes (e.g. -300). */
function offsetAt(ms: number): number {
  const w = wallOf(ms);
  const asUtc = Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, w.s);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

/** UTC ms of a local wall-clock time in America/Chicago. */
function localWallToMs(y: number, mo: number, d: number, h: number, mi: number, s: number): number {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  let ms = guess - offsetAt(guess) * 60000;
  ms = guess - offsetAt(ms) * 60000;
  return ms;
}

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;
const LOCAL_DT = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/;

/** Parse a date-time to UTC ms. Strings without offset are local wall-clock time. */
function toMs(s: unknown): number | null {
  if (typeof s !== "string" || !s) return null;
  const t = s.trim();
  if (HAS_ZONE.test(t) && t.includes("T")) {
    const v = Date.parse(t);
    return isNaN(v) ? null : v;
  }
  const m = LOCAL_DT.exec(t);
  if (m) return localWallToMs(+m[1], +m[2], +m[3], +m[4], +m[5], m[6] ? +m[6] : 0);
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (dm) return localWallToMs(+dm[1], +dm[2], +dm[3], 0, 0, 0);
  const v = Date.parse(t);
  return isNaN(v) ? null : v;
}

/** Local date (source precision) of a date or date-time string. */
function localDate(s: unknown): string | undefined {
  if (typeof s !== "string" || !s) return undefined;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  if (HAS_ZONE.test(t) && t.includes("T")) {
    const ms = toMs(t);
    if (ms === null) return undefined;
    const w = wallOf(ms);
    return `${w.y}-${pad(w.mo)}-${pad(w.d)}`;
  }
  const m = /^(\d{4}-\d{2}-\d{2})[T ]/.exec(t);
  if (m) return m[1];
  return undefined;
}

/** Local wall time YYYY-MM-DDTHH:MM. */
function localMinute(s: unknown): string | undefined {
  if (typeof s !== "string" || !s) return undefined;
  const t = s.trim();
  if (!(HAS_ZONE.test(t) && t.includes("T"))) {
    const m = LOCAL_DT.exec(t);
    if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
    return undefined;
  }
  const ms = toMs(t);
  if (ms === null) return undefined;
  const w = wallOf(ms);
  return `${w.y}-${pad(w.mo)}-${pad(w.d)}T${pad(w.h)}:${pad(w.mi)}`;
}

/** RFC 3339 with America/Chicago offset. */
function localRfc3339(s: unknown): string | undefined {
  if (typeof s !== "string" || !s) return undefined;
  const ms = toMs(s);
  if (ms === null) return undefined;
  const t = s.trim();
  let wallStr: string;
  if (HAS_ZONE.test(t) && t.includes("T")) {
    const w = wallOf(ms);
    wallStr = `${w.y}-${pad(w.mo)}-${pad(w.d)}T${pad(w.h)}:${pad(w.mi)}:${pad(w.s)}`;
  } else {
    const m = LOCAL_DT.exec(t);
    if (!m) return undefined;
    wallStr = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? "00"}`;
  }
  const off = offsetAt(ms);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  return `${wallStr}${sign}${pad(Math.floor(a / 60))}:${pad(a % 60)}`;
}

function endOfLocalDay(asOf: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(asOf || "");
  if (!m) return Number.POSITIVE_INFINITY;
  // start of the next local day
  const next = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + 1));
  return localWallToMs(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), 0, 0, 0);
}

// ---------------------------------------------------------------------------------------------
// Item selection (as-of, supersession, retraction)
// ---------------------------------------------------------------------------------------------

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const cutoff = endOfLocalDay(asOf);
  const inTime = items.filter((it) => {
    if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
    const r = toMs(it.recorded);
    return r !== null && r < cutoff;
  });
  const retracted = new Set<string>();
  for (const it of inTime) for (const id of arr(it.retracts)) if (typeof id === "string") retracted.add(id);
  const superseded = new Set<string>();
  for (const it of inTime) {
    if (retracted.has(it.id)) continue;
    for (const id of arr(it.supersedes)) if (typeof id === "string") superseded.add(id);
  }
  return inTime.filter((it) => !retracted.has(it.id) && !superseded.has(it.id));
}

function arr(x: unknown): unknown[] {
  return Array.isArray(x) ? x : [];
}

// ---------------------------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------------------------

interface Entry { key: string; e: any }
interface Doc {
  item: FolioItem;
  kind: string;
  encId: string;
  encStart: number;
  clinical: number; // time the document's statements refer to
  clinicalStr: string;
  recorded: number;
  entries: Entry[];
}

function buildDoc(item: FolioItem): Doc | null {
  const payload = item.payload;
  if (!payload || typeof payload !== "object") return null;
  const entries: Entry[] = [];
  let enc: any = null;
  for (const key of Object.keys(payload)) {
    const e = (payload as any)[key];
    if (!e || typeof e !== "object" || typeof e.type !== "string") continue;
    if (e.type === "encounter" && !enc) enc = e;
    entries.push({ key, e });
  }
  const kind = enc && typeof enc.document_kind === "string" ? enc.document_kind : "";
  const encId = enc && typeof enc.encounter_id === "string" ? enc.encounter_id : `item:${item.id}`;
  const eff = toMs(item.effective);
  const recorded = toMs(item.recorded) ?? 0;
  let clinicalStr: string = item.effective;
  if (kind === "discharge_summary") {
    const end = (enc && typeof enc.discharged === "string" && enc.discharged) || item.effective_end;
    if (typeof end === "string" && toMs(end) !== null) clinicalStr = end;
  }
  const clinical = toMs(clinicalStr) ?? eff ?? recorded;
  if (toMs(clinicalStr) === null) clinicalStr = item.recorded;
  const starts = [enc?.arrived, enc?.admitted, item.effective].map(toMs).filter((x): x is number => x !== null);
  const encStart = starts.length ? Math.min(...starts) : clinical;
  return { item, kind, encId, encStart, clinical, clinicalStr, recorded, entries };
}

function byClinical(a: Doc, b: Doc): number {
  return a.clinical - b.clinical || a.recorded - b.recorded || (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0);
}

// ---------------------------------------------------------------------------------------------
// Drug names
// ---------------------------------------------------------------------------------------------

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", januvia: "sitagliptin", glipizide: "glipizide",
  zestril: "lisinopril", prinivil: "lisinopril", cozaar: "losartan", diovan: "valsartan", norvasc: "amlodipine",
  lasix: "furosemide", microzide: "hydrochlorothiazide", lipitor: "atorvastatin", crestor: "rosuvastatin",
  zocor: "simvastatin", coumadin: "warfarin", eliquis: "apixaban", xarelto: "rivaroxaban", plavix: "clopidogrel",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", prilosec: "omeprazole", nexium: "esomeprazole",
  protonix: "pantoprazole", pepcid: "famotidine", zantac: "ranitidine", tylenol: "acetaminophen",
  advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", naprosyn: "naproxen", keflex: "cephalexin",
  amoxil: "amoxicillin", augmentin: "amoxicillin/clavulanate", zithromax: "azithromycin", bactrim: "sulfamethoxazole/trimethoprim",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", zyrtec: "cetirizine", claritin: "loratadine",
  seroquel: "quetiapine", zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram",
  wellbutrin: "bupropion", abilify: "aripiprazole", risperdal: "risperidone", zyprexa: "olanzapine",
  suboxone: "buprenorphine/naloxone", subutex: "buprenorphine", lyrica: "pregabalin", neurontin: "gabapentin",
  toprol: "metoprolol", lopressor: "metoprolol", coreg: "carvedilol", aldactone: "spironolactone",
  flomax: "tamsulosin", kayexalate: "sodium polystyrene sulfonate", lokelma: "sodium zirconium cyclosilicate",
};

const SALTS = new Set([
  "hydrochloride", "hcl", "hydrobromide", "sodium", "potassium", "calcium", "magnesium", "succinate", "tartrate",
  "besylate", "maleate", "mesylate", "trihydrate", "monohydrate", "dihydrate", "sulfate", "citrate", "fumarate",
  "bromide", "acetate", "phosphate", "hyclate", "propionate", "furoate", "dipropionate", "xinafoate", "bitartrate",
  "disodium", "monosodium", "anhydrous", "medoxomil", "axetil", "pivoxil",
]);
const INORGANIC_HEAD = new Set(["ferrous", "potassium", "calcium", "magnesium", "sodium", "zinc", "lithium", "aluminum"]);
const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "oral", "solution", "suspension",
  "injection", "injectable", "pen", "prefilled", "syringe", "inhaler", "hfa", "er", "xr", "sr", "xl", "dr", "ec", "cr",
  "extended-release", "delayed-release", "extended", "release", "delayed", "chewable", "odt", "film", "coated",
  "cream", "ointment", "gel", "patch", "drops", "spray", "nasal", "ophthalmic", "topical", "subq", "iv", "po",
  "kwikpen", "flexpen", "flextouch", "solostar", "vial", "liquid", "elixir", "syrup", "powder", "packet",
  "(human)", "human", "u-100", "u100", "u-500",
]);

/** Generic ingredient name, lower case, from a drug name as written. */
function ingredientName(drugName: unknown): string | undefined {
  if (typeof drugName !== "string") return undefined;
  let s = drugName.toLowerCase().replace(/[®™]/g, "").trim();
  if (!s) return undefined;
  const toks = s.split(/\s+/);
  const out: string[] = [];
  for (const t of toks) {
    if (/^[\d.]/.test(t)) break;
    if (/^\d/.test(t) || /^\(?\d/.test(t)) break;
    out.push(t.replace(/[,;:]$/, ""));
  }
  while (out.length > 1 && FORM_WORDS.has(out[out.length - 1])) out.pop();
  const head = out[0];
  if (head && BRANDS[head]) return BRANDS[head];
  while (out.length > 1 && SALTS.has(out[out.length - 1]) && !INORGANIC_HEAD.has(out[0])) out.pop();
  while (out.length > 1 && FORM_WORDS.has(out[out.length - 1])) out.pop();
  const name = out.join(" ").trim();
  if (!name) return undefined;
  if (BRANDS[name]) return BRANDS[name];
  return name;
}

// ---------------------------------------------------------------------------------------------
// Sensitivity
// ---------------------------------------------------------------------------------------------

const MH_DRUGS = /\b(quetiapine|olanzapine|risperidone|aripiprazole|ziprasidone|lurasidone|haloperidol|clozapine|paliperidone|lithium|lamotrigine|valproate|divalproex|sertraline|fluoxetine|paroxetine|citalopram|escitalopram|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|vortioxetine|vilazodone|amitriptyline|nortriptyline|imipramine|clomipramine|buspirone|lorazepam|alprazolam|clonazepam|diazepam|hydroxyzine pamoate|methylphenidate|amphetamine|lisdexamfetamine|atomoxetine|guanfacine er)\b/;
const SU_DRUGS = /\b(buprenorphine|methadone|naltrexone|acamprosate|disulfiram|naloxone|varenicline|nicotine)\b/;
const HIV_DRUGS = /\b(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|elvitegravir|efavirenz|rilpivirine|darunavir|atazanavir|ritonavir|cobicistat|abacavir|lamivudine|zidovudine|nevirapine|cabotegravir|lenacapavir|maraviroc|doravirine)\b/;
const SRH_DRUGS = /\b(levonorgestrel|norethindrone|norgestimate|desogestrel|drospirenone|etonogestrel|ethinyl estradiol|medroxyprogesterone acetate inj|ulipristal|mifepristone|misoprostol|clomiphene|letrozole for ovulation|sildenafil|tadalafil|prenatal)\b/;

function drugSensitivity(name: string): Sensitivity[] | undefined {
  const s = name.toLowerCase();
  const out: Sensitivity[] = [];
  if (MH_DRUGS.test(s)) out.push("mental-health");
  if (SU_DRUGS.test(s)) out.push("substance-use");
  if (HIV_DRUGS.test(s)) out.push("hiv-sti");
  if (SRH_DRUGS.test(s)) out.push("sexual-reproductive-health");
  return out.length ? out : undefined;
}

function conditionSensitivity(label: string, icd?: string): Sensitivity[] | undefined {
  const s = label.toLowerCase();
  const c = (icd || "").toUpperCase();
  const out = new Set<Sensitivity>();
  if (/^F1\d/.test(c) || /\b(alcohol (use|abuse|dependence|withdrawal)|opioid (use|dependence|abuse|withdrawal)|substance (use|abuse)|cocaine|methamphetamine|cannabis use|drug abuse|alcoholism|tobacco use disorder|overdose)\b/.test(s)) out.add("substance-use");
  if ((/^F(0[4-9]|[2-9]\d)/.test(c) && !/^F1\d/.test(c)) || /\b(depress|bipolar|schizo|anxiety|panic disorder|ptsd|post-traumatic|psychos|psychotic|adhd|attention.deficit|obsessive|ocd|eating disorder|anorexia nervosa|bulimia|suicid|self-harm|personality disorder|mental)\b/.test(s)) out.add("mental-health");
  if (/^(B2[0-4]|Z21|A5[0-9]|A6[0-4]|B97\.35|Z20\.6)/.test(c) || /\b(hiv|aids|syphilis|gonorrh|chlamydia|trichomon|genital herpes|herpes simplex genital|hpv|human papilloma|sexually transmitted)\b/.test(s)) out.add("hiv-sti");
  if (/^(O\d|Z3[0-9]|N97|N96)/.test(c) || /\b(pregnan|contracept|infertil|miscarriage|abortion|gestation|postpartum|erectile)\b/.test(s)) out.add("sexual-reproductive-health");
  if (/^Q\d/.test(c) || /\b(brca|lynch syndrome|genetic|hereditary|cystic fibrosis|sickle cell disease|huntington|factor v leiden)\b/.test(s)) out.add("genetic");
  return out.size ? [...out] : undefined;
}

// ---------------------------------------------------------------------------------------------
// Medications
// ---------------------------------------------------------------------------------------------

interface MedLine { doc: Doc; key: string; e: any; ingKey: string; ingredient?: string }

function medLines(doc: Doc): MedLine[] {
  const out: MedLine[] = [];
  for (const { key, e } of doc.entries) {
    if (e.type !== "home_med") continue;
    if (typeof e.drug_name !== "string" || !e.drug_name.trim()) continue;
    const ingredient = ingredientName(e.drug_name);
    const rx = typeof e.rxnorm_ingredient === "string" && e.rxnorm_ingredient ? e.rxnorm_ingredient : undefined;
    const ingKey = rx ? `rx:${rx}` : `name:${ingredient ?? e.drug_name.toLowerCase().trim()}`;
    out.push({ doc, key, e, ingKey, ingredient });
  }
  return out;
}

function mapMedStatus(s: unknown): MedicationRow["status"] {
  switch (s) {
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

const STATUS_PREF: Record<string, number> = { active: 0, held: 1, stopped: 2, unknown: 3 };

type DoseUnit = NonNullable<MedicationRow["dose"]>["unit"];

function normUnit(u: string): DoseUnit | null {
  const s = u.toLowerCase().replace(/\.$/, "");
  if (["mg", "milligram", "milligrams"].includes(s)) return "mg";
  if (["mcg", "µg", "μg", "ug", "microgram", "micrograms"].includes(s)) return "mcg";
  if (["u", "iu", "unit", "units", "intl unit", "international units"].includes(s)) return "units";
  if (["ml", "cc", "milliliter", "milliliters"].includes(s)) return "mL";
  if (["tab", "tabs", "tablet", "tablets"].includes(s)) return "tablet";
  return null;
}

const COUNT_UNITS = /^(tab|tabs|tablet|tablets|cap|caps|capsule|capsules|puff|puffs|spray|sprays|actuation|actuations|inhalation|inhalations|patch|patches|lozenge|lozenges|drop|drops)$/i;

function strengthFromName(name: string): { value: number; unit: "mg" | "mcg" | "units" | "mL" } | null {
  const m = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|μg|units?|iu|u)\b(?!\s*\/\s*(ml|g)\b)/i.exec(name);
  if (!m) return null;
  const u = normUnit(m[2]);
  if (!u || u === "tablet") return null;
  return { value: parseFloat(m[1]), unit: u };
}

function round(v: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function parseDose(e: any): MedicationRow["dose"] | undefined {
  const doseText = typeof e.dose_text === "string" ? e.dose_text.trim() : "";
  const sig = typeof e.sig === "string" ? e.sig : "";
  const name = typeof e.drug_name === "string" ? e.drug_name : "";
  if (/sliding scale|per scale|correction scale|as directed|per protocol|titrat|taper/i.test(doseText + " " + sig)) return undefined;
  if (/\d\s*(-|–|to|or)\s*\d/i.test(doseText)) return undefined;
  const m = /^(\d+(?:\.\d+)?)\s*([a-zµμ.]+(?:\s+units?)?)?\s*$/i.exec(doseText);
  if (m) {
    const val = parseFloat(m[1]);
    const unitRaw = (m[2] || "").trim();
    if (unitRaw === "g" || unitRaw === "gram" || unitRaw === "grams") return { value: round(val * 1000, 3), unit: "mg" };
    if (COUNT_UNITS.test(unitRaw)) {
      const st = strengthFromName(name);
      if (st) return { value: round(val * st.value, 3), unit: st.unit };
      if (/^(tab|tabs|tablet|tablets)$/i.test(unitRaw)) return { value: val, unit: "tablet" };
      return undefined;
    }
    const u = unitRaw ? normUnit(unitRaw) : null;
    if (u) return { value: val, unit: u };
    return undefined;
  }
  // Fallback: count in sig x strength in name.
  if (!doseText) {
    if (/\d\s*(-|–|to|or)\s*\d/i.test(sig)) return undefined;
    const cm = /^\s*(\d+(?:\.\d+)?)\s*(tab|tabs|tablet|tablets|cap|caps|capsule|capsules|puffs?)\b/i.exec(sig);
    const st = strengthFromName(name);
    if (cm && st) return { value: round(parseFloat(cm[1]) * st.value, 3), unit: st.unit };
  }
  return undefined;
}

function parseFrequency(sig: unknown): MedicationRow["frequency"] | undefined {
  if (typeof sig !== "string" || !sig.trim()) return undefined;
  const s = " " + sig.toLowerCase() + " ";
  if (/\bprn\b|as needed|if needed|when needed/.test(s)) return "PRN";
  if (/taper|every other day|\bqod\b|monthly|every \d+ (weeks|months)|\bq\s?(2|3|4)\s?w(ee)?ks?\b|four times|\bqid\b|\bq\s?[1-6]\s?h\b|every [1-6] hours|five times|\bq\s?48\s?h|every 48 hours|twice weekly|twice a week|three times (a|per) week/.test(s)) return "other";
  if (/\bbid\b|twice (daily|a day)|two times (daily|a day)|\bq\s?12\s?h|every 12 hours/.test(s)) return "BID";
  if (/\btid\b|three times (daily|a day)|\bq\s?8\s?h|every 8 hours/.test(s)) return "TID";
  if (/\bqhs\b|at bedtime|\bhs\b|nightly|at night/.test(s)) return "QHS";
  if (/\bqw\b|weekly|once a week|every week|\bq\s?week|\bq7d\b/.test(s)) return "QW";
  if (/\bqd\b|\bdaily\b|once a day|every day|every morning|each morning|\bqam\b|\bq\s?24\s?h|every 24 hours|every evening|in the evening|in the morning|\bqpm\b/.test(s)) return "QD";
  return "other";
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] | undefined {
  if (!text) return undefined;
  const s = text.toLowerCase();
  if (/adverse|side effect|reaction|allerg|intoleran|caused|associated|induced|toxicity|ketoacidosis|\bdka\b|hyperkalemia|kidney injury|\baki\b|rash|angioedema/.test(s)) return "adverse_reaction";
  if (HYPER.test(s) || SERIOUS.test(s) || NONIMMUNE.test(s)) return "adverse_reaction";
  if (/ineffective|not effective|no benefit|did not work|inadequate response|failed/.test(s)) return "ineffective";
  if (/replaced|switched|switch to|changed to|in favor of|instead|transition(ed)? to/.test(s)) return "therapy_changed";
  if (/course complete|completed course|course finished|completed therapy|end of course/.test(s)) return "course_complete";
  if (/patient (choice|preference|declined|decided|refused|wishes)|per patient/.test(s)) return "patient_choice";
  return undefined;
}

function mapMedications(docs: Doc[]): MedicationRow[] {
  const snaps = docs.filter((d) => d.entries.some((x) => x.e.type === "home_med")).sort(byClinical);
  if (!snaps.length) return [];
  // Latest encounter; within it, its latest discharge summary is the final word, else the latest document.
  const encStart = new Map<string, number>();
  for (const d of snaps) encStart.set(d.encId, Math.min(encStart.get(d.encId) ?? Infinity, d.encStart));
  // snaps is in clinical order, so on equal starts the encounter with the later document wins.
  let latestEnc = snaps[0].encId;
  for (const d of snaps) {
    if ((encStart.get(d.encId) ?? -Infinity) >= (encStart.get(latestEnc) ?? -Infinity)) latestEnc = d.encId;
  }
  const encDocs = snaps.filter((d) => d.encId === latestEnc);
  const ds = encDocs.filter((d) => d.kind === "discharge_summary");
  const current = ds.length ? ds[ds.length - 1] : encDocs[encDocs.length - 1];
  const currentIdx = snaps.indexOf(current);
  const linesByDoc = new Map<Doc, MedLine[]>();
  for (const d of snaps) linesByDoc.set(d, medLines(d));

  // One line per ingredient in the current snapshot.
  const chosen = new Map<string, MedLine>();
  for (const l of linesByDoc.get(current) ?? []) {
    const prev = chosen.get(l.ingKey);
    if (!prev || STATUS_PREF[mapMedStatus(l.e.status)] < STATUS_PREF[mapMedStatus(prev.e.status)]) chosen.set(l.ingKey, l);
  }

  const findLine = (d: Doc, ingKey: string): MedLine | undefined => {
    const ls = (linesByDoc.get(d) ?? []).filter((x) => x.ingKey === ingKey);
    if (!ls.length) return undefined;
    return ls.sort((a, b) => STATUS_PREF[mapMedStatus(a.e.status)] - STATUS_PREF[mapMedStatus(b.e.status)])[0];
  };
  const docDate = (d: Doc) => localDate(d.clinicalStr);

  const rows: MedicationRow[] = [];
  for (const l of chosen.values()) {
    const status = mapMedStatus(l.e.status);
    const raw = l.e.status;
    // Walk back over earlier snapshots while the line keeps the same state.
    const run: MedLine[] = [l];
    let before: MedLine | undefined;
    for (let j = currentIdx - 1; j >= 0; j--) {
      const pl = findLine(snaps[j], l.ingKey);
      if (!pl) break;
      const ps = mapMedStatus(pl.e.status);
      let same = ps === status;
      if (same && (raw === "new" || raw === "changed")) same = pl.e.status === raw && String(pl.e.dose_text) === String(l.e.dose_text);
      if (same && status === "active" && run[run.length - 1].e.status === "new" && pl.e.status !== "new") same = false;
      if (!same) {
        before = pl;
        break;
      }
      run.push(pl);
    }
    const first = run[run.length - 1];
    let since: string | undefined;
    if (status === "held" || status === "stopped") since = docDate(first.doc);
    else if (status === "active") {
      if (first.e.status === "new" || first.e.status === "changed") since = docDate(first.doc);
      else if (before && (mapMedStatus(before.e.status) === "held" || mapMedStatus(before.e.status) === "stopped")) since = docDate(first.doc);
    }
    let reasonText: string | undefined;
    if (status !== "unknown") {
      for (const r of run) {
        if (typeof r.e.instructions === "string" && r.e.instructions.trim()) {
          reasonText = r.e.instructions.trim();
          break;
        }
      }
    }
    const row: MedicationRow = {
      drug_name: l.e.drug_name,
      status,
      patient_reported: false,
      evidence: [],
    };
    if (l.ingredient) row.ingredient = l.ingredient;
    if (typeof l.e.rxnorm_ingredient === "string" && l.e.rxnorm_ingredient) row.rxnorm_ingredient = l.e.rxnorm_ingredient;
    if (since) row.status_since = since;
    const dose = parseDose(l.e);
    if (dose) row.dose = dose;
    const freq = parseFrequency(l.e.sig);
    if (freq) row.frequency = freq;
    if (status === "stopped") {
      const sr = stopReason(reasonText);
      if (sr) row.stop_reason = sr;
    }
    if (reasonText) row.status_reason_text = reasonText;
    const sens = drugSensitivity(`${l.e.drug_name} ${l.ingredient ?? ""}`);
    if (sens) row.sensitivity = sens;
    const ev: Evidence = [{ item_id: l.doc.item.id, entry_id: l.key }];
    if (first !== l) ev.push({ item_id: first.doc.item.id, entry_id: first.key });
    row.evidence = ev;
    rows.push(row);
  }
  rows.sort((a, b) => (a.ingredient ?? a.drug_name).localeCompare(b.ingredient ?? b.drug_name));
  return rows;
}

// ---------------------------------------------------------------------------------------------
// Drug attribution (diagnoses) and allergies
// ---------------------------------------------------------------------------------------------

const DRUG_CLASSES: { re: RegExp; members: string[] }[] = [
  { re: /\bsglt-?2( inhibitors?)?\b|\bgliflozins?\b/i, members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin", "bexagliflozin"] },
  { re: /\bace[- ]?inhibitors?\b|\bacei\b|angiotensin[- ]converting enzyme inhibitors?/i, members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"] },
  { re: /\barbs?\b|angiotensin (ii )?receptor blockers?/i, members: ["losartan", "valsartan", "irbesartan", "olmesartan", "candesartan", "telmisartan", "azilsartan", "eprosartan"] },
  { re: /\bnsaids?\b|non-?steroidal anti-?inflammatory/i, members: ["naproxen", "ibuprofen", "diclofenac", "meloxicam", "celecoxib", "indomethacin", "ketorolac", "etodolac", "nabumetone", "aspirin"] },
  { re: /\bthiazides?( diuretics?)?\b/i, members: ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone"] },
  { re: /\bloop diuretics?\b/i, members: ["furosemide", "bumetanide", "torsemide"] },
  { re: /\bstatins?\b|hmg-?coa reductase inhibitors?/i, members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin"] },
  { re: /\bpenicillins?\b/i, members: ["amoxicillin", "penicillin", "ampicillin", "dicloxacillin", "piperacillin", "nafcillin"] },
  { re: /\bcephalosporins?\b/i, members: ["cephalexin", "cefazolin", "ceftriaxone", "cefdinir", "cefuroxime", "cefepime", "cefpodoxime"] },
  { re: /\bsulfonylureas?\b/i, members: ["glipizide", "glyburide", "glimepiride"] },
  { re: /\bopioids?\b/i, members: ["oxycodone", "hydrocodone", "morphine", "hydromorphone", "tramadol", "codeine", "fentanyl"] },
  { re: /\bbeta[- ]?blockers?\b/i, members: ["metoprolol", "atenolol", "carvedilol", "propranolol", "bisoprolol", "nebivolol", "labetalol"] },
  { re: /\bglp-?1( receptor agonists?)?\b/i, members: ["semaglutide", "liraglutide", "dulaglutide", "exenatide", "tirzepatide"] },
  { re: /\bdpp-?4 inhibitors?\b/i, members: ["sitagliptin", "linagliptin", "saxagliptin", "alogliptin"] },
  { re: /\bfluoroquinolones?\b/i, members: ["ciprofloxacin", "levofloxacin", "moxifloxacin"] },
  { re: /\bsulfonamides?\b|\bsulfa\b/i, members: ["sulfamethoxazole"] },
];

const KNOWN_DRUGS = /\b(empagliflozin|dapagliflozin|canagliflozin|ertugliflozin|metformin|lisinopril|enalapril|ramipril|losartan|valsartan|irbesartan|naproxen|ibuprofen|diclofenac|meloxicam|celecoxib|ketorolac|aspirin|hydrochlorothiazide|chlorthalidone|furosemide|bumetanide|torsemide|spironolactone|atorvastatin|rosuvastatin|simvastatin|pravastatin|amoxicillin|penicillin|ampicillin|cephalexin|ceftriaxone|glipizide|glyburide|glimepiride|insulin|warfarin|apixaban|rivaroxaban|heparin|enoxaparin|clopidogrel|amlodipine|metoprolol|carvedilol|digoxin|lithium|valproate|valproic acid|isoniazid|allopurinol|vancomycin|trimethoprim|sulfamethoxazole|nitrofurantoin|ciprofloxacin|levofloxacin|semaglutide|liraglutide|dulaglutide|tirzepatide|pioglitazone|amiodarone|phenytoin|carbamazepine|lamotrigine|prednisone|methotrexate|statin|contrast)\b/i;

const ATTRIB = /(associated|induced|related|due to|secondary to|caused by|adverse effect of|adverse reaction to|toxicity|from)\b/i;

/** Adverse-effect T-code (T36-T50 with 5 as the sixth character). */
function isAdverseEffectCode(icd: string | undefined): boolean {
  if (!icd) return false;
  return /^T(3[6-9]|4[0-9]|50)\.[0-9A-Z]{1,2}5/i.test(icd.replace(/\s/g, "")) || /^T(3[6-9]|4\d|50)\.\w{2}5/i.test(icd);
}

interface Attribution { substance: string; rxnorm?: string; classOnly: boolean }

function attributeDrug(text: string, doc: Doc, adverseCode: boolean): Attribution | null {
  const lower = text.toLowerCase();
  if (!adverseCode && !ATTRIB.test(lower)) return null;
  const homeLines = medLines(doc);
  // A specific drug named in the text.
  const named = KNOWN_DRUGS.exec(lower);
  for (const l of homeLines) {
    if (l.ingredient && l.ingredient.length > 3 && lower.includes(l.ingredient)) {
      return { substance: l.ingredient, rxnorm: typeof l.e.rxnorm_ingredient === "string" ? l.e.rxnorm_ingredient : undefined, classOnly: false };
    }
  }
  for (const c of DRUG_CLASSES) {
    const m = c.re.exec(text);
    if (!m) continue;
    const onList = new Map<string, MedLine>();
    for (const l of homeLines) if (l.ingredient && c.members.includes(l.ingredient)) onList.set(l.ingredient, l);
    if (onList.size === 1) {
      const l = [...onList.values()][0];
      return { substance: l.ingredient!, rxnorm: typeof l.e.rxnorm_ingredient === "string" ? l.e.rxnorm_ingredient : undefined, classOnly: false };
    }
    let cls = m[0].trim();
    if (/^sglt-?2$/i.test(cls)) cls = `${cls} inhibitor`;
    return { substance: cls, classOnly: true };
  }
  if (named && named[1] !== "statin" && named[1] !== "contrast") return { substance: named[1].toLowerCase(), classOnly: false };
  if (adverseCode) {
    const m = /adverse (?:effect|reaction) (?:of|to) (.+)$/i.exec(text);
    if (m) {
      const s = m[1].replace(/[,.;].*$/, "").trim();
      if (s) return { substance: s, classOnly: true };
    }
  }
  return null;
}

/** Condition wording without the drug attribution part. */
function stripAttribution(label: string): string {
  let s = label;
  s = s.replace(/,?\s*[\w\s/-]*?\b(associated|induced|related)\b\s*$/i, "");
  s = s.replace(/\s*\b(due to|secondary to|caused by|from)\b.*$/i, "");
  s = s.replace(/^\s*[\w\s/-]+?-(associated|induced|related)\s+/i, "");
  return s.trim() || label;
}

type RxType = AllergyIntoleranceRow["reaction_type"];

const HYPER = /hive|urticaria|rash|exanthem|swelling|angioedema|anaphyla|bronchospasm|wheez|itch|prurit|stevens|sjs|ten\b|toxic epidermal|dress|blister|throat (tight|closing)|lip|tongue|facial edema|serum sickness|hypersensitiv|allergic/i;
const SERIOUS = /ketoacidosis|\bdka\b|pancreatitis|hepatotox|liver (injury|failure|damage)|hepatitis|kidney injury|\baki\b|renal failure|nephrotox|agranulocytosis|neutropenia|thrombocytopenia|aplastic|rhabdo|myopathy|lactic acidosis|qt prolong|torsade|arrhythmia|seizure|bleed|hemorrhage|hyperkalemia|hyponatremia|hypoglycemi|tendon rupture|c\.? ?diff|colitis|serotonin syndrome|neuroleptic malignant|osteonecrosis|interstitial lung|pneumonitis|heart failure|syncope/i;
const NONIMMUNE = /cough|nausea|vomit|stomach|gi upset|upset stomach|diarrh|constipat|drows|sedat|dizz|headache|myalgia|muscle (ache|pain)|flushing|edema|ankle swelling|fatigue|insomnia|dry mouth|ketoacidosis|\bdka\b|hyperkalemia|hypoglycemi|bleed|lactic acidosis/i;

function classifyReaction(reaction: string | undefined): RxType {
  if (!reaction) return "hypersensitivity";
  if (HYPER.test(reaction) && !/ankle swelling|leg swelling|peripheral edema/i.test(reaction)) return "hypersensitivity";
  if (SERIOUS.test(reaction)) return "serious_adverse_event";
  return "side_effect";
}

function mechanismFor(type: RxType, reaction: string | undefined): AllergyIntoleranceRow["mechanism"] {
  if (type === "hypersensitivity") return "unknown";
  if (reaction && NONIMMUNE.test(reaction)) return "non_immune";
  return "unknown";
}

function isNoAllergy(s: string): boolean {
  return /^\s*(nkda|nka|nkfa|no known (drug )?allergies|none|no allergies)\s*\.?$/i.test(s);
}

function mapAllergies(docs: Doc[], derived: DerivedAllergy[]): AllergyIntoleranceRow[] {
  const rows: AllergyIntoleranceRow[] = [];
  const snaps = docs.filter((d) => d.entries.some((x) => x.e.type === "allergy")).sort(byClinical);
  const keyOf = (substance: string, rx?: string) => (rx ? `rx:${rx}` : `s:${substance.toLowerCase()}`);
  const byKey = new Map<string, AllergyIntoleranceRow>();
  if (snaps.length) {
    const cur = snaps[snaps.length - 1];
    for (const { key, e } of cur.entries) {
      if (e.type !== "allergy" || typeof e.substance !== "string" || !e.substance.trim()) continue;
      if (isNoAllergy(e.substance)) continue;
      const rx = typeof e.rxnorm_ingredient === "string" && e.rxnorm_ingredient ? e.rxnorm_ingredient : undefined;
      const substance = rx ? ingredientName(e.substance) ?? e.substance.trim() : e.substance.trim();
      const reaction = typeof e.reaction === "string" && e.reaction.trim() ? e.reaction.trim() : undefined;
      const type = classifyReaction(reaction);
      const crit: AllergyIntoleranceRow["criticality"] =
        e.severity === "severe" ? "high" : e.severity === "mild" || e.severity === "moderate" ? "low" : "unknown";
      const row: AllergyIntoleranceRow = {
        substance,
        reaction_type: type,
        mechanism: mechanismFor(type, reaction),
        criticality: /anaphyla|angioedema|stevens|toxic epidermal|throat/i.test(reaction ?? "") ? "high" : crit,
        evidence: [{ item_id: cur.item.id, entry_id: key }],
      };
      if (rx) row.rxnorm_ingredient = rx;
      if (reaction) row.reaction = reaction.split(/\s*[,;]\s*|\s+and\s+/).filter(Boolean).join("; ");
      const sens = drugSensitivity(substance);
      if (sens) row.sensitivity = sens;
      const k = keyOf(substance, rx);
      if (!byKey.has(k)) {
        byKey.set(k, row);
        rows.push(row);
      }
    }
  }
  for (const d of derived) {
    const k = keyOf(d.substance, d.rxnorm);
    const k2 = `s:${d.substance.toLowerCase()}`;
    const existing = byKey.get(k) ?? byKey.get(k2) ?? rows.find((r) => r.substance.toLowerCase() === d.substance.toLowerCase());
    if (existing) {
      for (const ev of d.evidence) if (!existing.evidence.some((x) => x.item_id === ev.item_id && x.entry_id === ev.entry_id)) existing.evidence.push(ev);
      continue;
    }
    const type = d.reaction ? classifyReaction(d.reaction) : "side_effect";
    const row: AllergyIntoleranceRow = {
      substance: d.substance,
      reaction_type: type,
      mechanism: mechanismFor(type, d.reaction),
      criticality: type === "serious_adverse_event" || type === "hypersensitivity" ? "high" : d.reaction ? "low" : "unknown",
      evidence: d.evidence,
    };
    if (type === "hypersensitivity" && !/anaphyla|angioedema|stevens|toxic epidermal/i.test(d.reaction ?? "")) row.criticality = "unknown";
    if (d.rxnorm) row.rxnorm_ingredient = d.rxnorm;
    if (d.reaction) row.reaction = d.reaction;
    if (d.onset) row.onset = { value: d.onset, precision: "day" };
    const sens = drugSensitivity(d.substance);
    if (sens) row.sensitivity = sens;
    byKey.set(k, row);
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------------------------

interface DerivedAllergy { substance: string; rxnorm?: string; reaction?: string; onset?: string; evidence: Evidence }

interface CondEntry {
  doc: Doc;
  key: string;
  kind: "dx" | "hx";
  label: string;
  icd?: string;
  rrh?: string;
  status: string; // working | ruled_out | active | resolved
  onsetText?: string;
  group?: string;
  problem: boolean; // false for adverse-effect-only codes
}

function normLabel(s: string): string {
  return s
    .toLowerCase()
    .replace(/^(history of|h\/o|hx of|known)\s+/, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function conceptKey(label: string, icd?: string): string | undefined {
  const c = (icd || "").toUpperCase();
  const s = label.toLowerCase();
  if (/^N18/.test(c) || /\bckd\b|chronic kidney disease|chronic renal (disease|insufficiency)/.test(s)) return "concept:ckd";
  if (/^I1[0-3]/.test(c) && !/^I1[1-3]/.test(c)) return "concept:htn";
  if (!c && /^(essential )?(hypertension|htn)$/.test(normLabel(s))) return "concept:htn";
  if (/^E11\.(9|8|65|69)$/.test(c) || (!c && /^(type 2 diabetes|type ii diabetes|t2dm|dm2|dm type 2|diabetes mellitus type 2|type 2 diabetes mellitus|diabetes mellitus type ii|diabetes)( mellitus)?( without complications)?$/.test(normLabel(s))))
    return "concept:t2dm";
  if (/^E78\.(5|4|49|2|0|00)$/.test(c) || (!c && /^(hyperlipidemia|dyslipidemia|hypercholesterolemia|mixed hyperlipidemia)$/.test(normLabel(s)))) return "concept:lipid";
  return undefined;
}

function ckdStage(label: string, icd?: string): ProblemRow["ckd_stage"] | undefined {
  const c = (icd || "").toUpperCase();
  const map: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  const s = label.toLowerCase();
  let m = /\bg(1|2|3a|3b|4|5)\b/.exec(s);
  if (m) return ("G" + m[1]) as ProblemRow["ckd_stage"];
  m = /stage\s*(1|2|3a|3b|4|5|i{1,3}a|i{1,3}b|iv|v|i{1,2})\b/.exec(s);
  if (m) {
    const r: Record<string, ProblemRow["ckd_stage"]> = {
      "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5",
      i: "G1", ii: "G2", iiia: "G3a", iiib: "G3b", iv: "G4", v: "G5",
    };
    if (r[m[1]]) return r[m[1]];
  }
  if (/end[- ]stage (renal|kidney)|\besrd\b|\beskd\b/.test(s)) return "G5";
  if (map[c]) return map[c];
  return undefined;
}

function albuminuria(label: string): ProblemRow["albuminuria"] | undefined {
  const s = label.toLowerCase();
  const m = /\ba(1|2|3)\b/.exec(s);
  if (m && /ckd|kidney|albumin|g[1-5]/.test(s)) return ("A" + m[1]) as ProblemRow["albuminuria"];
  if (/severely increased albuminuria|macroalbuminuria|nephrotic[- ]range/.test(s)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria/.test(s)) return "A2";
  if (/normal to mildly increased albuminuria|normoalbuminuria/.test(s)) return "A1";
  return undefined;
}

function parseOnset(t: string | undefined): ProblemRow["onset"] | undefined {
  if (!t) return undefined;
  const s = t.trim();
  let m = /^(\d{4})$/.exec(s);
  if (m) return { value: m[1], precision: "year" };
  m = /^(\d{4})-(\d{2})$/.exec(s);
  if (m) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return { value: s, precision: "day" };
  m = /^(\d{1,2})\/(\d{4})$/.exec(s);
  if (m && +m[1] >= 1 && +m[1] <= 12) return { value: `${m[2]}-${pad(+m[1])}`, precision: "month" };
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (m && +m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31) return { value: `${m[3]}-${pad(+m[1])}-${pad(+m[2])}`, precision: "day" };
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  m = /^([a-z]+)\.?\s+(\d{4})$/i.exec(s);
  if (m) {
    const idx = months.findIndex((x) => x.startsWith(m![1].toLowerCase()) && m![1].length >= 3);
    if (idx >= 0) return { value: `${m[2]}-${pad(idx + 1)}`, precision: "month" };
  }
  return undefined;
}

function mapProblems(docs: Doc[]): { problems: ProblemRow[]; derived: DerivedAllergy[] } {
  const sorted = [...docs].sort(byClinical);
  const entries: CondEntry[] = [];
  const derivedMap = new Map<string, DerivedAllergy & { first: number }>();

  for (const d of sorted) {
    for (const { key, e } of d.entries) {
      try {
        if (e.type === "diagnosis") {
          if (typeof e.label !== "string" || !e.label.trim()) continue;
          const icd = typeof e.icd10cm === "string" && e.icd10cm.trim() ? e.icd10cm.trim() : undefined;
          const rrh = e.riverside_dx && typeof e.riverside_dx.code === "string" ? e.riverside_dx.code : undefined;
          const status = typeof e.status === "string" ? e.status : "";
          const adverse = isAdverseEffectCode(icd);
          const adverseLabelOnly = /^\s*adverse (effect|reaction) (of|to)\b/i.test(e.label);
          entries.push({ doc: d, key, kind: "dx", label: e.label.trim(), icd, rrh, status, problem: !(adverse || adverseLabelOnly) });
          if (status === "active" || status === "resolved") {
            const texts = [e.label, e.riverside_dx?.name].filter((x): x is string => typeof x === "string");
            let at: Attribution | null = null;
            for (const t of texts) {
              at = attributeDrug(t, d, adverse || adverseLabelOnly);
              if (at) break;
            }
            if (at) {
              const k = at.rxnorm ? `rx:${at.rxnorm}` : `s:${at.substance.toLowerCase()}`;
              const reaction = adverse || adverseLabelOnly ? undefined : stripAttribution(e.label.trim());
              const enc = d.entries.find((x) => x.e.type === "encounter")?.e;
              const onset = localDate((enc && (enc.arrived || enc.admitted)) || d.item.effective);
              const prev = derivedMap.get(k);
              if (!prev) {
                derivedMap.set(k, { substance: at.substance, rxnorm: at.rxnorm, reaction, onset, evidence: [{ item_id: d.item.id, entry_id: key }], first: d.clinical });
              } else {
                prev.evidence.unshift({ item_id: d.item.id, entry_id: key });
                if (reaction) prev.reaction = reaction;
              }
            }
          }
        } else if (e.type === "history") {
          if (typeof e.condition !== "string" || !e.condition.trim()) continue;
          const icd = typeof e.icd10cm === "string" && e.icd10cm.trim() ? e.icd10cm.trim() : undefined;
          const resolved = /\b(resolved|remote|in remission|childhood|s\/p)\b/i.test(e.condition) && !/\bckd\b|chronic/i.test(e.condition);
          entries.push({
            doc: d,
            key,
            kind: "hx",
            label: e.condition.trim(),
            icd,
            status: resolved ? "resolved" : "active",
            onsetText: typeof e.onset_text === "string" ? e.onset_text : undefined,
            problem: !isAdverseEffectCode(icd),
          });
        }
      } catch {
        // skip unreadable entry
      }
    }
  }

  // Group entries into conditions.
  for (const ce of entries) {
    if (ce.rrh) ce.group = `rrh:${ce.rrh}`;
  }
  for (const ce of entries) {
    if (ce.group) continue;
    const concept = conceptKey(ce.label, ce.icd);
    if (concept) {
      ce.group = concept;
      continue;
    }
    if (ce.icd) {
      // Same encounter, same ICD, exactly one Riverside code: same condition.
      const codes = new Set(entries.filter((x) => x.rrh && x.icd === ce.icd && x.doc.encId === ce.doc.encId).map((x) => x.group!));
      ce.group = codes.size === 1 ? [...codes][0] : `icd:${ce.icd.toUpperCase()}`;
      continue;
    }
  }
  for (const ce of entries) {
    if (ce.group) continue;
    const nl = normLabel(ce.label);
    const match = entries.find((x) => x.group && x !== ce && normLabel(x.label) === nl);
    ce.group = match ? match.group : `label:${nl}`;
  }
  // Pull a riverside code group into a concept group if both share entries' ICD in the same encounter (CKD restaging etc. handled by concept).

  const groups = new Map<string, CondEntry[]>();
  for (const ce of entries) {
    if (!ce.problem) continue;
    const g = groups.get(ce.group!) ?? [];
    g.push(ce);
    groups.set(ce.group!, g);
  }

  const problems: ProblemRow[] = [];
  for (const g of groups.values()) {
    const dx = g.filter((x) => x.kind === "dx" && x.status !== "working");
    const hx = g.filter((x) => x.kind === "hx");
    let latest: CondEntry | undefined;
    if (dx.length) {
      latest = dx[dx.length - 1];
      if (latest.status === "ruled_out") continue;
    } else if (hx.length) latest = hx[hx.length - 1];
    if (!latest) continue; // only working diagnoses
    if (latest.status !== "active" && latest.status !== "resolved") continue;
    const row: ProblemRow = {
      condition: latest.label,
      status: latest.status === "resolved" ? "resolved" : "active",
      evidence: [],
    };
    if (latest.icd) row.icd10cm = latest.icd;
    for (let i = g.length - 1; i >= 0; i--) {
      const o = parseOnset(g[i].onsetText);
      if (o) {
        row.onset = o;
        break;
      }
    }
    const isCkd = g.some((x) => conceptKey(x.label, x.icd) === "concept:ckd");
    if (isCkd) {
      const ordered = [...hx, ...dx.filter((x) => x.status !== "ruled_out")]; // diagnoses outrank history
      for (let i = ordered.length - 1; i >= 0; i--) {
        const st = ckdStage(ordered[i].label, ordered[i].icd);
        if (st) {
          row.ckd_stage = st;
          break;
        }
      }
      for (let i = ordered.length - 1; i >= 0; i--) {
        const a = albuminuria(ordered[i].label);
        if (a) {
          row.albuminuria = a;
          break;
        }
      }
    }
    const sens = conditionSensitivity(latest.label, latest.icd);
    if (sens) row.sensitivity = sens;
    const ev: Evidence = [{ item_id: latest.doc.item.id, entry_id: latest.key }];
    for (let i = g.length - 1; i >= 0; i--) {
      const x = g[i];
      if (x.status === "working" || x.status === "ruled_out") continue;
      if (!ev.some((y) => y.item_id === x.doc.item.id && y.entry_id === x.key)) ev.push({ item_id: x.doc.item.id, entry_id: x.key });
    }
    row.evidence = ev;
    problems.push(row);
  }
  problems.sort((a, b) => a.condition.localeCompare(b.condition));
  const derived = [...derivedMap.values()].sort((a, b) => a.first - b.first).map(({ first, ...rest }) => rest);
  return { problems, derived };
}

// ---------------------------------------------------------------------------------------------
// Labs
// ---------------------------------------------------------------------------------------------

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "35203-9": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr", "88293-6": "egfr",
  "88294-4": "egfr", "50044-7": "egfr", "50210-4": "egfr", "77147-7": "egfr", "69405-9": "egfr", "98980-6": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "39789-3": "potassium",
  "2951-2": "sodium", "2947-0": "sodium", "39791-9": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "14937-7": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "41653-7": "glucose", "1558-6": "glucose", "14749-6": "glucose", "2341-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "14958-3": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "804-5": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin", "30350-3": "hemoglobin", "30351-1": "hemoglobin",
  "53060-9": "bhb", "47546-5": "bhb", "27941-4": "bhb",
  "2746-6": "ph", "2744-1": "ph", "11558-4": "ph", "2753-2": "ph", "19213-8": "ph",
  "2021-4": "pco2", "2019-8": "pco2", "11557-6": "pco2", "2020-6": "pco2",
  "3040-3": "lipase", "1990-1": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "49563-0": "troponin", "76399-9": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "39469-2": "ldl", "69419-0": "ldl",
};

const LOCAL_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", CREA: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun",
  GLU: "glucose", GLUC: "glucose", POCGLU: "glucose", A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c", UACR: "uacr",
  MALB: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", VPH: "ph", APH: "ph",
  PH: "ph", VPCO2: "pco2", APCO2: "pco2", PCO2: "pco2", LIPASE: "lipase", TROPI: "troponin", TNI: "troponin",
  HSTNI: "troponin", TROP: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl",
  LDL: "ldl", LDLC: "ldl", LDLD: "ldl",
};

const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L",
  troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function analyteOf(test: any, specimen: string): Analyte | null {
  if (!test || typeof test !== "object") return null;
  const name = typeof test.name === "string" ? test.name.toLowerCase() : "";
  const spec = specimen.toLowerCase();
  let a: Analyte | null = null;
  if (typeof test.loinc === "string" && LOINC_ANALYTE[test.loinc.trim()]) a = LOINC_ANALYTE[test.loinc.trim()];
  if (!a && typeof test.local_code === "string" && LOCAL_ANALYTE[test.local_code.trim().toUpperCase()]) a = LOCAL_ANALYTE[test.local_code.trim().toUpperCase()];
  if (!a && name) {
    if (/albumin.*creatinine|\buacr\b|microalbumin\/creat/.test(name)) a = "uacr";
    else if (/\begfr\b|glomerular filtration/.test(name)) a = "egfr";
    else if (/^creatinine\b/.test(name)) a = "creatinine";
    else if (/^potassium\b/.test(name)) a = "potassium";
    else if (/^sodium\b/.test(name)) a = "sodium";
    else if (/^chloride\b/.test(name)) a = "chloride";
    else if (/total co2|^bicarbonate|^co2\b/.test(name)) a = "bicarbonate";
    else if (/anion gap/.test(name)) a = "anion_gap";
    else if (/urea nitrogen|\bbun\b/.test(name)) a = "bun";
    else if (/^glucose\b/.test(name)) a = "glucose";
    else if (/a1c|glycated hemoglobin|glycohemoglobin/.test(name)) a = "a1c";
    else if (/^platelet/.test(name)) a = "platelets";
    else if (/^(wbc|white blood cell|leukocyte)/.test(name)) a = "wbc";
    else if (/^(hemoglobin|hgb)\b/.test(name)) a = "hemoglobin";
    else if (/hydroxybutyrate/.test(name)) a = "bhb";
    else if (/^ph\b/.test(name)) a = "ph";
    else if (/^p ?co2\b/.test(name)) a = "pco2";
    else if (/^lipase/.test(name)) a = "lipase";
    else if (/troponin i\b|troponin-i|\btni\b/.test(name)) a = "troponin";
    else if (/^(total )?cholesterol\b(?!.*(hdl|ldl))/.test(name)) a = "cholesterol";
    else if (/^triglyceride/.test(name)) a = "triglycerides";
    else if (/\bhdl\b/.test(name)) a = "hdl";
    else if (/\bldl\b/.test(name)) a = "ldl";
  }
  if (!a) return null;
  if (a === "troponin" && /troponin t\b|tnt/.test(name)) return null;
  if (/urine/.test(spec) && a !== "uacr") return null;
  if (a === "uacr" && spec && !/urine/.test(spec) && !/urine|albumin/.test(name)) return null;
  if (a === "bicarbonate" && /calc|gas|hco3,? (venous|arterial)|standard/.test(name)) return null;
  return a;
}

function convert(a: Analyte, v: number, unitRaw: string | undefined): number | null {
  const u = (unitRaw ?? "").trim().toLowerCase().replace(/µ|μ/g, "u");
  const target = UNITS[a].toLowerCase();
  if (a === "ph") return v;
  if (!u) return v;
  if (u === target) return v;
  switch (a) {
    case "creatinine":
      if (u === "umol/l") return round(v / 88.42, 2);
      if (u === "mg/dl") return v;
      return null;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      if (u === "meq/l" || u === "mmol/l") return v;
      if (a === "bhb" && u === "mg/dl") return round(v / 10.41, 2);
      return null;
    case "bun":
      if (u === "mmol/l") return round(v * 2.801, 1);
      return null;
    case "glucose":
      if (u === "mmol/l") return Math.round(v * 18.016);
      return null;
    case "a1c":
      if (u === "mmol/mol") return round(v / 10.929 + 2.15, 1);
      return null;
    case "uacr":
      if (u === "mg/g creat" || u === "mg/g{creat}" || u === "ug/mg" || u === "mcg/mg") return v;
      if (u === "mg/mmol") return round(v * 8.84, 1);
      return null;
    case "platelets": case "wbc":
      if (["10*3/ul", "k/ul", "10^3/ul", "x10e3/ul", "thou/ul", "10*9/l", "10^9/l", "x10^9/l", "x10e9/l", "k/mm3", "10*3/mm3"].includes(u)) return v;
      if (u === "/ul" || u === "cells/ul") return round(v / 1000, 1);
      return null;
    case "hemoglobin":
      if (u === "g/l") return round(v / 10, 1);
      if (u === "mmol/l") return round(v * 1.611, 1);
      return null;
    case "pco2":
      if (u === "mm hg" || u === "mmhg") return v;
      if (u === "kpa") return round(v * 7.50062, 1);
      return null;
    case "lipase":
      if (u === "iu/l" || u === "u/l") return v;
      return null;
    case "troponin":
      if (u === "ng/l" || u === "pg/ml") return round(v / 1000, 4);
      if (u === "ug/l") return v;
      return null;
    case "cholesterol": case "hdl": case "ldl":
      if (u === "mmol/l") return Math.round(v * 38.67);
      return null;
    case "triglycerides":
      if (u === "mmol/l") return Math.round(v * 88.57);
      return null;
    case "egfr":
      if (/^ml\/min\/1\.73\s?m(2|\^2|²)$/.test(u) || u === "ml/min/{1.73_m2}") return v;
      return null;
  }
  return null;
}

interface LabCopy {
  doc: Doc;
  entryKey: string;
  accession: string;
  code: string;
  test: any;
  value: string;
  unit?: string;
  collected: string;
  specimen: string;
  status: string;
}

const STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

function egfrEquation(name: string, loinc: string | undefined, collected: string): LabResultRow["egfr_equation"] {
  const n = name.toLowerCase();
  if (/2021|race[- ]free/.test(n) || loinc === "98979-8" || loinc === "98980-6") return "ckd-epi-2021";
  if (/2009/.test(n) || loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4" || loinc === "48642-3" && false) return "ckd-epi-2009";
  if (/mdrd/.test(n) || loinc === "33914-3" || loinc === "48642-3" || loinc === "48643-1" || loinc === "77147-7") return "mdrd";
  if (/ckd-?epi/.test(n) && /race|black|african/.test(n)) return "ckd-epi-2009";
  // Riverside: CKD-EPI 2021 (race-free) for all results since 2023.
  const d = localDate(collected);
  if (d && d >= "2023-01-01") return "ckd-epi-2021";
  return "unknown";
}

function isRaceVariant(name: string, loinc?: string): boolean {
  return /african|black|\baa\b|non-?african|non-?black|race/.test(name.toLowerCase()) && !/race[- ]free/.test(name.toLowerCase()) || loinc === "48643-1" || loinc === "88293-6" || loinc === "48642-3" || loinc === "88294-4";
}
function isRaceCoefficient(name: string, loinc?: string): boolean {
  const n = name.toLowerCase();
  if (/race[- ]free/.test(n)) return false;
  if (/non-?african|non-?black/.test(n)) return false;
  return /african|black|\baa\b/.test(n) || loinc === "48643-1" || loinc === "88293-6";
}

function mapLabs(docs: Doc[]): LabResultRow[] {
  const copies = new Map<string, LabCopy[]>();
  const add = (c: LabCopy) => {
    const k = `${c.accession}|${c.code}`;
    const l = copies.get(k) ?? [];
    l.push(c);
    copies.set(k, l);
  };
  for (const d of docs) {
    for (const { key, e } of d.entries) {
      try {
        if (e.type === "result") {
          if (!e.test || typeof e.test !== "object") continue;
          const code = String(e.test.local_code ?? e.test.loinc ?? e.test.name ?? "");
          add({
            doc: d, entryKey: key, accession: String(e.accession ?? `${d.item.id}:${key}`), code, test: e.test,
            value: String(e.value ?? ""), unit: typeof e.unit === "string" ? e.unit : undefined,
            collected: String(e.collected ?? ""), specimen: String(e.specimen ?? ""), status: String(e.status ?? ""),
          });
        } else if (e.type === "panel") {
          for (const comp of arr(e.components) as any[]) {
            if (!comp || typeof comp !== "object" || !comp.test) continue;
            const code = String(comp.test.local_code ?? comp.test.loinc ?? comp.test.name ?? "");
            add({
              doc: d, entryKey: key, accession: String(e.accession ?? `${d.item.id}:${key}`), code, test: comp.test,
              value: String(comp.value ?? ""), unit: typeof comp.unit === "string" ? comp.unit : undefined,
              collected: String(e.collected ?? ""), specimen: String(e.specimen ?? ""), status: String(e.status ?? ""),
            });
          }
        }
      } catch {
        // skip
      }
    }
  }

  const rows: (LabResultRow & { _acc: string; _race: boolean; _sort: number })[] = [];
  for (const list of copies.values()) {
    const sorted = [...list].sort(
      (a, b) => (STATUS_RANK[b.status] ?? 0) - (STATUS_RANK[a.status] ?? 0) || b.doc.recorded - a.doc.recorded || byClinical(b.doc, a.doc),
    );
    const best = sorted[0];
    if (!(best.status in STATUS_RANK)) continue;
    const a = analyteOf(best.test, best.specimen);
    if (!a) continue;
    const m = /^\s*(<=|>=|≤|≥|<|>)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(best.value);
    if (!m) continue;
    const num = parseFloat(m[2]);
    if (!isFinite(num)) continue;
    const conv = convert(a, num, best.unit);
    if (conv === null) continue;
    const collected = localRfc3339(best.collected);
    if (!collected) continue;
    const row: LabResultRow & { _acc: string; _race: boolean; _sort: number } = {
      analyte: a,
      value: conv,
      unit: UNITS[a],
      collected,
      status: best.status === "preliminary" ? "preliminary" : "final",
      evidence: [],
      _acc: best.accession,
      _race: false,
      _sort: toMs(best.collected) ?? 0,
    };
    let comp = m[1];
    if (comp === "≤") comp = "<=";
    if (comp === "≥") comp = ">=";
    if (comp) row.comparator = comp as LabResultRow["comparator"];
    const tname = typeof best.test.name === "string" ? best.test.name : "";
    const loinc = typeof best.test.loinc === "string" && best.test.loinc ? best.test.loinc : undefined;
    if (a === "egfr") {
      row.egfr_equation = egfrEquation(tname, loinc, best.collected);
      row._race = isRaceCoefficient(tname, loinc);
    }
    if (loinc) row.loinc = loinc;
    const ev: Evidence = [{ item_id: best.doc.item.id, entry_id: best.entryKey }];
    for (const c of sorted) {
      if (c === best) continue;
      if (c.status !== best.status || c.value !== best.value) continue;
      if (!ev.some((x) => x.item_id === c.doc.item.id && x.entry_id === c.entryKey)) ev.push({ item_id: c.doc.item.id, entry_id: c.entryKey });
    }
    row.evidence = ev;
    rows.push(row);
  }
  // Drop race-coefficient eGFR variants when a race-free one exists for the same specimen.
  const out = rows.filter((r) => !(r.analyte === "egfr" && r._race && rows.some((o) => o !== r && o.analyte === "egfr" && !o._race && o._acc === r._acc)));
  out.sort((x, y) => x._sort - y._sort || x.analyte.localeCompare(y.analyte));
  return out.map(({ _acc, _race, _sort, ...r }) => r);
}

// ---------------------------------------------------------------------------------------------
// Vitals
// ---------------------------------------------------------------------------------------------

function num(x: unknown): number | undefined {
  return typeof x === "number" && isFinite(x) ? x : undefined;
}

function mapVitals(docs: Doc[]): VitalRow[] {
  interface V { doc: Doc; key: string; ms: number; taken: string; e: any }
  const rows: (VitalRow & { _ms: number; _sig: string })[] = [];
  for (const d of docs) {
    const vs: V[] = [];
    for (const { key, e } of d.entries) {
      if (e.type !== "vitals") continue;
      const ms = toMs(e.taken);
      if (ms === null || typeof e.taken !== "string") continue;
      vs.push({ doc: d, key, ms, taken: e.taken, e });
    }
    vs.sort((a, b) => a.ms - b.ms);
    // Sets within one document taken within a few minutes are one set.
    const sets: V[][] = [];
    for (const v of vs) {
      const last = sets[sets.length - 1];
      if (last && v.ms - last[0].ms <= 15 * 60000) last.push(v);
      else sets.push([v]);
    }
    for (const set of sets) {
      let row: VitalRow | null = null;
      let firstMs = set[0].ms;
      let timeStr = set[0].taken;
      const bpEntries = set.filter((v) => v.e.bp && num(v.e.bp.systolic_mmhg) !== undefined && num(v.e.bp.diastolic_mmhg) !== undefined);
      if (bpEntries.length) {
        firstMs = bpEntries[0].ms;
        timeStr = bpEntries[0].taken;
      }
      const lt = localMinute(timeStr);
      if (!lt) continue;
      row = { setting: "hospital", local_time: lt, evidence: [] };
      if (bpEntries.length) {
        row.systolic_mmhg = bpEntries[0].e.bp.systolic_mmhg;
        row.diastolic_mmhg = bpEntries[0].e.bp.diastolic_mmhg;
        if (bpEntries.length > 1) {
          row.repeat_systolic_mmhg = bpEntries[1].e.bp.systolic_mmhg;
          row.repeat_diastolic_mmhg = bpEntries[1].e.bp.diastolic_mmhg;
        }
      }
      let any = bpEntries.length > 0;
      for (const v of set) {
        const hr = num(v.e.heart_rate_bpm);
        if (hr !== undefined && row.pulse_bpm === undefined) row.pulse_bpm = hr;
        const w = num(v.e.weight_kg);
        if (w !== undefined && row.weight_kg === undefined) row.weight_kg = round(w, 1);
        if (hr !== undefined || w !== undefined || num(v.e.temp_f) !== undefined || num(v.e.spo2_pct) !== undefined || num(v.e.resp_rate_per_min) !== undefined) any = true;
        row.evidence.push({ item_id: v.doc.item.id, entry_id: v.key });
      }
      if (!any) continue;
      const sig = JSON.stringify([row.systolic_mmhg, row.diastolic_mmhg, row.pulse_bpm, row.weight_kg]);
      // Same set copied into several documents: one row.
      const dup = rows.find((r) => r._ms === firstMs && r._sig === sig);
      if (dup) {
        for (const ev of row.evidence) if (!dup.evidence.some((x) => x.item_id === ev.item_id && x.entry_id === ev.entry_id)) dup.evidence.push(ev);
        continue;
      }
      rows.push({ ...row, _ms: firstMs, _sig: sig });
    }
  }
  rows.sort((a, b) => a._ms - b._ms);
  return rows.map(({ _ms, _sig, ...r }) => r);
}

// ---------------------------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------------------------

function safe<T>(f: () => T, fallback: T): T {
  try {
    return f();
  } catch {
    return fallback;
  }
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items)) return empty;
  const counting = safe(() => countingItems(items, asOf), [] as FolioItem[]);
  const docs: Doc[] = [];
  for (const it of counting) {
    const d = safe(() => buildDoc(it), null);
    if (d) docs.push(d);
  }
  docs.sort(byClinical);
  const pr = safe(() => mapProblems(docs), { problems: [] as ProblemRow[], derived: [] as DerivedAllergy[] });
  return {
    medications: safe(() => mapMedications(docs), [] as MedicationRow[]),
    problems: pr.problems,
    allergies: safe(() => mapAllergies(docs, pr.derived), [] as AllergyIntoleranceRow[]),
    labs: safe(() => mapLabs(docs), [] as LabResultRow[]),
    vitals: safe(() => mapVitals(docs), [] as VitalRow[]),
  };
}
