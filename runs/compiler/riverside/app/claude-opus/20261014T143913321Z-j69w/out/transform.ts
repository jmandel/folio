import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  ProblemRow,
  AllergyIntoleranceRow,
  LabResultRow,
  VitalRow,
  Evidence,
  Analyte,
  Sensitivity,
  PartialDate,
} from "../in/views/views";

// Mapper for Riverside Regional (riverside-doc-v1) document items.
// Each item is one clinical document (ED note, H&P, progress note, consult, discharge summary) whose
// payload restates the encounter, vitals, diagnoses, allergies, home medication list and results.

const TZ = "America/Chicago";

// ───────────────────────────── small helpers ─────────────────────────────

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

function num(v: unknown): number | undefined {
  if (typeof v === "number" && isFinite(v)) return v;
  if (typeof v === "string" && /^\s*-?\d+(\.\d+)?\s*$/.test(v)) return Number(v);
  return undefined;
}

function isObj(v: unknown): v is Record<string, any> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const OFFSET_RE = /(Z|[+-]\d{2}:?\d{2})$/i;
const NAIVE_DT_RE = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/;
const DATE_RE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

let fmtCache: Intl.DateTimeFormat | undefined;
function fmt(): Intl.DateTimeFormat {
  if (!fmtCache) {
    fmtCache = new Intl.DateTimeFormat("en-US", {
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
  return fmtCache;
}

/** Chicago wall-clock parts of an instant. */
function chicagoParts(ms: number): { y: string; mo: string; d: string; h: string; mi: string; s: string } {
  const parts: Record<string, string> = {};
  for (const p of fmt().formatToParts(new Date(ms))) parts[p.type] = p.value;
  const h = parts.hour === "24" ? "00" : parts.hour;
  return { y: parts.year, mo: parts.month, d: parts.day, h, mi: parts.minute, s: parts.second };
}

/** Offset (minutes east of UTC) of Chicago at the given instant. */
function chicagoOffsetMin(ms: number): number {
  const p = chicagoParts(ms);
  const asUtc = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +p.mi, +p.s);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

/** Instant for a Chicago wall-clock time. */
function chicagoWallToMs(y: number, mo: number, d: number, h: number, mi: number, s: number): number {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  let off = chicagoOffsetMin(guess);
  let ms = guess - off * 60000;
  const off2 = chicagoOffsetMin(ms);
  if (off2 !== off) ms = guess - off2 * 60000;
  return ms;
}

/** Parse a date-time / date to an instant (ms). Naive times and dates are Chicago local. NaN if unreadable. */
function toMs(s: unknown): number {
  const v = str(s);
  if (!v) return NaN;
  if (OFFSET_RE.test(v) && /T|\s\d/.test(v)) {
    const ms = Date.parse(v);
    return isNaN(ms) ? NaN : ms;
  }
  let m = NAIVE_DT_RE.exec(v);
  if (m) return chicagoWallToMs(+m[1], +m[2], +m[3], +m[4], +m[5], m[6] ? +m[6] : 0);
  m = DATE_RE.exec(v);
  if (m) return chicagoWallToMs(+m[1], m[2] ? +m[2] : 1, m[3] ? +m[3] : 1, 0, 0, 0);
  return NaN;
}

/** Local (Chicago) date string at the precision the source has. */
function localDate(s: unknown): PartialDate | undefined {
  const v = str(s);
  if (!v) return undefined;
  if (DATE_RE.test(v)) return v;
  const m = NAIVE_DT_RE.exec(v);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const ms = toMs(v);
  if (isNaN(ms)) return undefined;
  const p = chicagoParts(ms);
  return `${p.y}-${p.mo}-${p.d}`;
}

/** Local (Chicago) wall-clock `YYYY-MM-DDTHH:MM`. */
function localTime(s: unknown): string | undefined {
  const v = str(s);
  if (!v) return undefined;
  const m = NAIVE_DT_RE.exec(v);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
  if (!OFFSET_RE.test(v)) return undefined;
  const ms = toMs(v);
  if (isNaN(ms)) return undefined;
  const p = chicagoParts(ms);
  return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}`;
}

/** RFC 3339 with offset; a naive local time gets its Chicago offset. */
function rfc3339(s: unknown): string | undefined {
  const v = str(s);
  if (!v) return undefined;
  if (OFFSET_RE.test(v) && !isNaN(Date.parse(v))) return v;
  const m = NAIVE_DT_RE.exec(v);
  if (!m) return undefined;
  const ms = toMs(v);
  if (isNaN(ms)) return undefined;
  const off = chicagoOffsetMin(ms);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  const hh = String(Math.floor(a / 60)).padStart(2, "0");
  const mm = String(a % 60).padStart(2, "0");
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? "00"}${sign}${hh}:${mm}`;
}

function precisionOf(d: PartialDate): "year" | "month" | "day" {
  return d.length <= 4 ? "year" : d.length <= 7 ? "month" : "day";
}

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

/** Read an onset text into a partial date, only when it states a calendar date/month/year. */
function parsePartialDate(text: unknown): PartialDate | undefined {
  const v = str(text);
  if (!v) return undefined;
  let m = /^(?:in\s+|since\s+|circa\s+|~\s*)?(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/i.exec(v);
  if (m) return m[3] ? `${m[1]}-${m[2]}-${m[3]}` : m[2] ? `${m[1]}-${m[2]}` : m[1];
  m = /^(?:in\s+|since\s+)?(\d{1,2})\/(\d{4})$/.exec(v);
  if (m && +m[1] >= 1 && +m[1] <= 12) return `${m[2]}-${m[1].padStart(2, "0")}`;
  m = /^(?:in\s+|since\s+)?(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(v);
  if (m && +m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31)
    return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  m = /^(?:in\s+|since\s+)?([a-z]{3})[a-z]*\.?\s+(\d{4})$/i.exec(v);
  if (m && MONTHS[m[1].toLowerCase()]) return `${m[2]}-${MONTHS[m[1].toLowerCase()]}`;
  m = /^(?:in\s+|since\s+)?([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})$/i.exec(v);
  if (m && MONTHS[m[1].toLowerCase()]) return `${m[3]}-${MONTHS[m[1].toLowerCase()]}-${m[2].padStart(2, "0")}`;
  return undefined;
}

function addEvidence(ev: Evidence, item_id: string, entry_id?: string): void {
  if (!ev.some((e) => e.item_id === item_id && e.entry_id === entry_id)) ev.push(entry_id ? { item_id, entry_id } : { item_id });
}

// ───────────────────────────── items in scope ─────────────────────────────

interface Doc {
  item: FolioItem;
  /** Clinical time of the document's content, for ordering snapshots. */
  t: number;
  recorded: number;
  entries: [string, Record<string, any>][];
  encounter?: Record<string, any>;
}

/** Local date of a document's clinical time. */
function docDate(d: Doc): PartialDate | undefined {
  const p = chicagoParts(d.t);
  return `${p.y}-${p.mo}-${p.d}`;
}

function docTime(item: FolioItem, enc: Record<string, any> | undefined): number {
  const cands = [toMs(item.effective), toMs(item.effective_end)];
  if (enc && enc.document_kind === "discharge_summary") cands.push(toMs(enc.discharged));
  let best = NaN;
  for (const c of cands) if (!isNaN(c) && (isNaN(best) || c > best)) best = c;
  if (isNaN(best)) best = toMs(item.recorded);
  return isNaN(best) ? 0 : best;
}

function currentDocs(items: FolioItem[], asOf: string): Doc[] {
  const inScope: FolioItem[] = [];
  for (const it of Array.isArray(items) ? items : []) {
    if (!isObj(it) || typeof it.id !== "string") continue;
    const rd = localDate(it.recorded);
    if (!rd || rd.length !== 10 || rd > asOf) continue;
    inScope.push(it);
  }
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const k of ["supersedes", "retracts"] as const) {
      const list = (it as any)[k];
      if (Array.isArray(list)) for (const id of list) if (typeof id === "string") dead.add(`${it.issuer}\u0000${id}`);
    }
  }
  const docs: Doc[] = [];
  for (const it of inScope) {
    if (dead.has(`${it.issuer}\u0000${it.id}`)) continue;
    const entries: [string, Record<string, any>][] = [];
    if (isObj(it.payload)) for (const [k, v] of Object.entries(it.payload)) if (isObj(v) && typeof v.type === "string") entries.push([k, v]);
    const enc = entries.find(([, e]) => e.type === "encounter")?.[1];
    docs.push({ item: it, t: docTime(it, enc), recorded: toMs(it.recorded) || 0, entries, encounter: enc });
  }
  docs.sort((a, b) => a.t - b.t || a.recorded - b.recorded || (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0));
  return docs;
}

// ───────────────────────────── drugs ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  brenzavvy: "bexagliflozin", inpefa: "sotagliflozin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  rezvoglar: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", admelog: "insulin lispro", lyumjev: "insulin lispro", novolog: "insulin aspart",
  fiasp: "insulin aspart", apidra: "insulin glulisine", humulin: "insulin human", novolin: "insulin human",
  glucophage: "metformin", glumetza: "metformin", fortamet: "metformin", cozaar: "losartan", diovan: "valsartan",
  benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan", atacand: "candesartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril",
  norvasc: "amlodipine", lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  pravachol: "pravastatin", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide",
  microzide: "hydrochlorothiazide", aldactone: "spironolactone", kerendia: "finerenone",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide", januvia: "sitagliptin",
  tradjenta: "linagliptin", amaryl: "glimepiride", glucotrol: "glipizide", actos: "pioglitazone",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", plavix: "clopidogrel", aleve: "naproxen", naprosyn: "naproxen", advil: "ibuprofen",
  motrin: "ibuprofen", tylenol: "acetaminophen", toprol: "metoprolol", lopressor: "metoprolol",
  coreg: "carvedilol", zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine",
  wellbutrin: "bupropion", seroquel: "quetiapine", abilify: "aripiprazole", suboxone: "buprenorphine",
  protonix: "pantoprazole", prilosec: "omeprazole", zyloprim: "allopurinol", neurontin: "gabapentin",
};

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "calcium", "magnesium", "succinate", "tartrate", "besylate",
  "maleate", "mesylate", "citrate", "sulfate", "fumarate", "acetate", "bromide", "hyclate", "monohydrate",
  "dihydrate", "phosphate", "medoxomil", "propanediol", "er", "xr", "sr", "dr", "xl", "la", "cr", "ir", "ec",
]);

const FORMS = /\b(oral|tablets?|tabs?|capsules?|caps?|solution|suspension|injection|injectable|pen|vial|cream|ointment|patch|inhaler|syrup|extended|delayed|release|chewable|film|coated|subcutaneous|sc|po|iv|kwikpen|flexpen|flextouch|solostar|prefilled|syringe)\b.*$/i;

/** Generic ingredient, lower case, without salt or form; undefined if not identifiable. */
function ingredientOf(drugName: string): string | undefined {
  let s = drugName.toLowerCase().replace(/[®™]/g, "").trim();
  // cut at first strength / number
  s = s.replace(/\s*\(.*?\)\s*/g, " ");
  const numIdx = s.search(/\d/);
  if (numIdx > 0) s = s.slice(0, numIdx);
  s = s.replace(FORMS, "").trim();
  s = s.replace(/[,;:-]+$/, "").trim();
  if (!s) return undefined;
  const words = s.split(/\s+/);
  if (BRANDS[words[0]]) return BRANDS[words[0]];
  while (words.length > 1 && SALTS.has(words[words.length - 1])) words.pop();
  const out = words.join(" ");
  if (/^(water pill|blood pressure pill|sugar pill|vitamin|unknown|other)$/.test(out)) return undefined;
  return out || undefined;
}

const DRUG_CLASSES: { re: RegExp; label: string; members: string[] }[] = [
  { re: /\bsglt-?2\b|sodium[- ]glucose co-?transporter/i, label: "SGLT2 inhibitor",
    members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "bexagliflozin", "sotagliflozin"] },
  { re: /\bace[- ]?(inhibitor|i)\b|angiotensin[- ]converting/i, label: "ACE inhibitor",
    members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"] },
  { re: /\barbs?\b|angiotensin (ii )?receptor blocker/i, label: "ARB",
    members: ["losartan", "valsartan", "irbesartan", "olmesartan", "telmisartan", "candesartan", "azilsartan", "eprosartan"] },
  { re: /\bnsaids?\b|non-?steroidal/i, label: "NSAID",
    members: ["naproxen", "ibuprofen", "diclofenac", "meloxicam", "celecoxib", "indomethacin", "ketorolac", "aspirin"] },
  { re: /\bstatins?\b/i, label: "statin",
    members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"] },
  { re: /\bthiazide/i, label: "thiazide diuretic", members: ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone"] },
  { re: /\bsulfonylurea/i, label: "sulfonylurea", members: ["glipizide", "glyburide", "glimepiride"] },
  { re: /\bglp-?1\b/i, label: "GLP-1 receptor agonist", members: ["semaglutide", "dulaglutide", "liraglutide", "exenatide", "tirzepatide"] },
  { re: /\bdpp-?4\b/i, label: "DPP-4 inhibitor", members: ["sitagliptin", "linagliptin", "saxagliptin", "alogliptin"] },
  { re: /\bopioid/i, label: "opioid", members: ["oxycodone", "hydrocodone", "morphine", "hydromorphone", "tramadol", "fentanyl", "codeine"] },
  { re: /\bbeta[- ]?blocker/i, label: "beta blocker", members: ["metoprolol", "carvedilol", "atenolol", "propranolol", "bisoprolol", "nebivolol", "labetalol"] },
  { re: /\bpenicillins?\b/i, label: "penicillin", members: ["penicillin", "amoxicillin", "ampicillin"] },
  { re: /\bsulfa\b|sulfonamide/i, label: "sulfonamide", members: ["sulfamethoxazole"] },
];

const KNOWN_DRUGS: string[] = (() => {
  const s = new Set<string>(Object.values(BRANDS));
  for (const c of DRUG_CLASSES) for (const m of c.members) s.add(m);
  for (const d of ["metformin", "insulin", "lithium", "warfarin", "heparin", "vancomycin", "contrast", "iodinated contrast",
    "allopurinol", "amiodarone", "spironolactone", "furosemide", "gabapentin", "amlodipine", "trimethoprim", "digoxin"]) s.add(d);
  return [...s].sort((a, b) => b.length - a.length);
})();

const MENTAL_DRUGS = /\b(sertraline|escitalopram|citalopram|fluoxetine|paroxetine|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|quetiapine|olanzapine|risperidone|aripiprazole|ziprasidone|lurasidone|haloperidol|clozapine|lithium|lamotrigine|lorazepam|alprazolam|clonazepam|diazepam|buspirone|methylphenidate|amphetamine|lisdexamfetamine|atomoxetine)\b/i;
const SUBSTANCE_DRUGS = /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|varenicline|nicotine)\b/i;
const HIV_DRUGS = /\b(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|efavirenz|rilpivirine|darunavir|atazanavir|lamivudine|abacavir|zidovudine|cabotegravir|lenacapavir)\b/i;
const REPRO_DRUGS = /\b(levonorgestrel|norethindrone|ethinyl estradiol|drospirenone|etonogestrel|medroxyprogesterone|norgestimate|desogestrel|ulipristal|mifepristone|misoprostol|prenatal)\b/i;

function drugSensitivity(text: string): Sensitivity[] | undefined {
  const out: Sensitivity[] = [];
  if (MENTAL_DRUGS.test(text)) out.push("mental-health");
  if (SUBSTANCE_DRUGS.test(text)) out.push("substance-use");
  if (HIV_DRUGS.test(text)) out.push("hiv-sti");
  if (REPRO_DRUGS.test(text)) out.push("sexual-reproductive-health");
  return out.length ? out : undefined;
}

function conditionSensitivity(label: string, icd?: string): Sensitivity[] | undefined {
  const out = new Set<Sensitivity>();
  const code = (icd ?? "").toUpperCase();
  if (/^F1\d/.test(code) || /\b(alcohol|opioid|cannabis|cocaine|stimulant|substance|tobacco|nicotine) (use|dependence|abuse|use disorder)|\baddiction\b|\boverdose\b/i.test(label))
    out.add("substance-use");
  else if (/^F\d/.test(code) || /\b(depress|anxiety|bipolar|schizo|psychos|ptsd|post-traumatic|panic disorder|adhd|attention[- ]deficit|eating disorder|anorexia nervosa|bulimia|suicid|obsessive|personality disorder|mental)/i.test(label))
    out.add("mental-health");
  if (/^(B20|Z21|A5[0-9]|A6[0-4]|B97\.35|Z20\.6)/.test(code) || /\bhiv\b|syphilis|gonorrh|chlamydia|herpes simplex genital|genital herpes|trichomon|\bsti\b|sexually transmitted/i.test(label))
    out.add("hiv-sti");
  if (/^(O\d|Z3[0-9]|N96|N97)/.test(code) || /\bpregnan|contracept|infertil|miscarriage|abortion|postpartum|gestational/i.test(label))
    out.add("sexual-reproductive-health");
  if (/\bgenetic|hereditary|brca|lynch syndrome|cystic fibrosis|sickle cell disease|huntington/i.test(label)) out.add("genetic");
  return out.size ? [...out] : undefined;
}

// ───────────────────────────── medications ─────────────────────────────

type MedStatus = MedicationRow["status"];

function medStatus(s: unknown): MedStatus | undefined {
  switch (s) {
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
    case "not_reconciled": return "unknown";
  }
  return undefined;
}

const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5, "1/2": 0.5, "one-half": 0.5 };

function normUnit(u: string): "mg" | "mcg" | "units" | "mL" | "g" | undefined {
  const x = u.toLowerCase();
  if (x === "mg") return "mg";
  if (x === "mcg" || x === "µg" || x === "ug") return "mcg";
  if (x === "unit" || x === "units" || x === "unt" || x === "u" || x === "iu" || x === "[iu]") return "units";
  if (x === "ml") return "mL";
  if (x === "g" || x === "gm" || x === "gram" || x === "grams") return "g";
  return undefined;
}

function parseDose(drugName: string, doseText: string | undefined, sig: string | undefined): MedicationRow["dose"] {
  const rangeRe = /\d\s*(-|–|to|or)\s*\d|sliding|scale|per protocol|titrat|variable/i;
  // tablet count from the sig
  let count: number | undefined;
  let countRange = false;
  if (sig) {
    const m = /^(?:take\s+|inject\s+|give\s+)?(\d+(?:\.\d+)?|one-half|one|two|three|four|half|1\/2)\s*(?:x\s*)?(tabs?|tablets?|caps?|capsules?)\b/i.exec(sig);
    if (m) count = WORD_NUM[m[1].toLowerCase()] ?? Number(m[1]);
    if (/^(?:take\s+)?\d+(?:\.\d+)?\s*(-|to|or)\s*\d/i.test(sig)) countRange = true;
  }
  if (countRange) return undefined;
  // single strength per tablet from the drug name
  let strength: { value: number; unit: "mg" | "mcg" } | undefined;
  const strengths = [...drugName.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg|µg)\b(?!\s*\/\s*(ml|h|kg))/gi)];
  if (strengths.length === 1 && !/\//.test(drugName.replace(/\d+\s*(mg|mcg)\s*\/\s*ml/gi, ""))) {
    const u = normUnit(strengths[0][2]);
    if (u === "mg" || u === "mcg") strength = { value: Number(strengths[0][1]), unit: u };
  }
  const isTabForm = /\b(tab|tablet|cap|capsule)s?\b/i.test(drugName) || count !== undefined;
  if (count !== undefined && strength && isTabForm) {
    return { value: Math.round(count * strength.value * 1000) / 1000, unit: strength.unit };
  }
  if (doseText && !rangeRe.test(doseText)) {
    const m = /^(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|units?|unt|iu|\[iu\]|ml|g|gm)\b/i.exec(doseText.replace(/,/g, ""));
    if (m) {
      const u = normUnit(m[2]);
      const v = Number(m[1]);
      if (u === "g") return { value: v * 1000, unit: "mg" };
      if (u) return { value: v, unit: u };
    }
    const t = /^(\d+(?:\.\d+)?|one|two|three|half)\s*(tabs?|tablets?|caps?|capsules?)\b/i.exec(doseText);
    if (t) {
      const c = WORD_NUM[t[1].toLowerCase()] ?? Number(t[1]);
      if (strength) return { value: c * strength.value, unit: strength.unit };
      return { value: c, unit: "tablet" };
    }
  }
  if (count !== undefined && !strength) return { value: count, unit: "tablet" };
  return undefined;
}

function parseFrequency(sig: string | undefined): MedicationRow["frequency"] {
  if (!sig) return undefined;
  const s = sig.toLowerCase();
  if (/\bprn\b|as needed|as-needed|when needed|if needed/.test(s)) return "PRN";
  if (/\bqhs\b|\bhs\b|at bedtime|nightly|every night|before bed/.test(s)) return "QHS";
  if (/\btid\b|three times (a |per )?day|three times daily|\bq8h?\b|every 8 hours/.test(s)) return "TID";
  if (/\bbid\b|twice (a |per )?day|twice daily|two times (a |per )?day|\bq12h?\b|every 12 hours/.test(s)) return "BID";
  if (/\bqw\b|\bqwk\b|weekly|once a week|every week|once per week/.test(s)) return "QW";
  if (/\bqid\b|four times|\bq6h?\b|\bq4h?\b|every other day|\bqod\b|monthly|every \d+ (hours|days|weeks)/.test(s)) return "other";
  if (/\bqd\b|\bdaily\b|once a day|once daily|every day|every morning|\bqam\b|\bq24h\b|each morning|in the morning|every evening|\bqpm\b/.test(s)) return "QD";
  return undefined;
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] {
  if (!text) return undefined;
  const t = text.toLowerCase();
  if (/adverse|side effect|reaction|intoleran|allerg|angioedema|rash|hives|cough|ketoacidosis|\bdka\b|lactic acidosis|hyperkalemia|hypoglycemi|angioedema|pancreatitis|kidney injury|\baki\b|toxicity|caused|associated|induced/.test(t)) return "adverse_reaction";
  if (/ineffective|not effective|not working|inadequate|insufficient|failed|no benefit|uncontrolled/.test(t)) return "ineffective";
  if (/switch|replac|changed to|change to|instead|transition(ed)? to|in favor of|substitut/.test(t)) return "therapy_changed";
  if (/course (complete|finished|done)|completed|finished|end of course/.test(t)) return "course_complete";
  if (/patient (declin|refus|prefer|chose|request|wish|decided)|declined|refused|patient choice|patient preference/.test(t)) return "patient_choice";
  return "other";
}

function medKey(e: Record<string, any>): string | undefined {
  const name = str(e.drug_name);
  const ing = name ? ingredientOf(name) : undefined;
  if (ing) return `ing:${ing}`;
  const rx = str(e.rxnorm_ingredient);
  if (rx) return `rx:${rx}`;
  return name ? `name:${name.toLowerCase()}` : undefined;
}

function buildMedications(docs: Doc[]): MedicationRow[] {
  const snaps = docs
    .map((d) => ({ doc: d, meds: d.entries.filter(([, e]) => e.type === "home_med" && str(e.drug_name)) }))
    .filter((s) => s.meds.length > 0);
  if (!snaps.length) return [];
  const byKey = (s: (typeof snaps)[number], key: string): [string, Record<string, any>] | undefined => {
    const hits = s.meds.filter(([, e]) => medKey(e) === key);
    if (!hits.length) return undefined;
    const rank = (e: Record<string, any>) => ({ active: 3, held: 2, unknown: 1, stopped: 0 }[medStatus(e.status) ?? "unknown"]);
    return hits.reduce((a, b) => (rank(b[1]) >= rank(a[1]) ? b : a));
  };
  const latestIdx = snaps.length - 1;
  // Walking back to date a status stays within the latest snapshot's encounter.
  const encOf = (i: number) => (snaps[i].doc.encounter ? str(snaps[i].doc.encounter!.encounter_id) : undefined);
  const sameEnc = (i: number) => {
    const a = encOf(i);
    const b = encOf(latestIdx);
    return !a || !b || a === b;
  };
  const latest = snaps[latestIdx];
  const rows: MedicationRow[] = [];
  const seen = new Set<string>();
  for (const [, e] of latest.meds) {
    const key = medKey(e);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const [curId, cur] = byKey(latest, key)!;
    const status = medStatus(cur.status) ?? "unknown";
    const drugName = str(cur.drug_name)!;
    const evidence: Evidence = [];
    addEvidence(evidence, latest.doc.item.id, curId);

    // Walk back through earlier snapshots to date the current status and find its stated reason.
    let since: PartialDate | undefined;
    let reasonText: string | undefined = status === "held" || status === "stopped" ? str(cur.instructions) : undefined;
    let reasonFrom: [string, string] | undefined;
    if (status === "held" || status === "stopped") {
      let runStart = latestIdx;
      for (let i = latestIdx - 1; i >= 0 && sameEnc(i); i--) {
        const hit = byKey(snaps[i], key);
        if (!hit || medStatus(hit[1].status) !== status) break;
        runStart = i;
        if (!reasonText && str(hit[1].instructions)) {
          reasonText = str(hit[1].instructions);
          reasonFrom = [snaps[i].doc.item.id, hit[0]];
        }
      }
      since = docDate(snaps[runStart].doc);
      if (runStart !== latestIdx) addEvidence(evidence, snaps[runStart].doc.item.id, byKey(snaps[runStart], key)![0]);
    } else if (status === "active") {
      for (let i = latestIdx; i >= 0 && sameEnc(i); i--) {
        const hit = byKey(snaps[i], key);
        if (!hit || medStatus(hit[1].status) !== "active") break;
        if (hit[1].status === "new" || hit[1].status === "changed") {
          since = docDate(snaps[i].doc);
          addEvidence(evidence, snaps[i].doc.item.id, hit[0]);
          break;
        }
        const prev = i > 0 && sameEnc(i - 1) ? byKey(snaps[i - 1], key) : undefined;
        const ps = prev ? medStatus(prev[1].status) : undefined;
        if (ps === "held" || ps === "stopped") {
          since = docDate(snaps[i].doc);
          addEvidence(evidence, snaps[i].doc.item.id, hit[0]);
          break;
        }
      }
    }
    if (reasonFrom) addEvidence(evidence, reasonFrom[0], reasonFrom[1]);

    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence };
    const ing = ingredientOf(drugName);
    if (ing) row.ingredient = ing;
    const rx = str(cur.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;
    if (since) row.status_since = since;
    const dose = parseDose(drugName, str(cur.dose_text), str(cur.sig));
    if (dose) row.dose = dose;
    const freq = parseFrequency(str(cur.sig));
    if (freq) row.frequency = freq;
    if (status === "stopped") {
      const r = stopReason(reasonText);
      if (r) row.stop_reason = r;
    }
    if (reasonText && (status === "held" || status === "stopped")) row.status_reason_text = reasonText;
    const sens = drugSensitivity(`${drugName} ${ing ?? ""}`);
    if (sens) row.sensitivity = sens;
    rows.push(row);
  }
  return rows;
}

// ───────────────────────────── problems & drug-caused reactions ─────────────────────────────

function normLabel(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function ckdStage(label: string, icd?: string): ProblemRow["ckd_stage"] {
  const c = (icd ?? "").toUpperCase();
  const byCode: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  if (byCode[c]) return byCode[c];
  const m = /\b(?:stage|g)\s*(1|2|3a|3b|4|5)\b/i.exec(label) ?? /\bG(1|2|3a|3b|4|5)\b/i.exec(label);
  if (m) {
    const v = m[1].toLowerCase();
    return v === "3a" ? "G3a" : v === "3b" ? "G3b" : (`G${v}` as ProblemRow["ckd_stage"]);
  }
  if (/end[- ]stage renal|\besrd\b|\beskd\b/i.test(label)) return "G5";
  return undefined;
}

function isCkd(label: string, icd?: string): boolean {
  return /^N18/i.test(icd ?? "") || /chronic kidney disease|\bckd\b|chronic renal (failure|insufficiency)|\besrd\b|\beskd\b/i.test(label);
}

function isAdverseEffectTCode(icd?: string): boolean {
  return !!icd && /^T(3[6-9]|4[0-9]|50)\.[0-9A-Z]{1,2}5/i.test(icd.replace(/X/gi, "X"));
}

interface DrugCause {
  substance: string;
  rxnorm?: string;
}

/** If a diagnosis attributes its condition to a drug, the drug (or class); else undefined. */
function drugCause(text: string, icd: string | undefined, itemMeds: Record<string, any>[]): DrugCause | undefined {
  const t = text.toLowerCase();
  const attributed =
    /(associated|induced|related|caused|due to|secondary to|from|adverse effect|adverse reaction|toxicity|intolerance)/.test(t) ||
    isAdverseEffectTCode(icd);
  if (!attributed) return undefined;
  const medsWithIng = itemMeds
    .map((m) => ({ m, ing: str(m.drug_name) ? ingredientOf(str(m.drug_name)!) : undefined }))
    .filter((x) => x.ing);
  // specific drug named in the text
  for (const x of medsWithIng) {
    if (x.ing && new RegExp(`\\b${x.ing.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(t)) {
      return { substance: x.ing, rxnorm: str(x.m.rxnorm_ingredient) };
    }
  }
  const words = t.split(/[^a-z0-9-]+/);
  for (const w of words) if (BRANDS[w]) return { substance: BRANDS[w] };
  for (const d of KNOWN_DRUGS) {
    if (new RegExp(`\\b${d}\\b`).test(t)) {
      const med = medsWithIng.find((x) => x.ing === d);
      return { substance: d, rxnorm: med ? str(med.m.rxnorm_ingredient) : undefined };
    }
  }
  for (const c of DRUG_CLASSES) {
    if (c.re.test(text)) {
      const onList = medsWithIng.filter((x) => c.members.includes(x.ing!));
      const distinct = [...new Set(onList.map((x) => x.ing!))];
      if (distinct.length === 1) {
        const x = onList[0];
        return { substance: distinct[0], rxnorm: str(x.m.rxnorm_ingredient) };
      }
      const m = new RegExp(c.re.source, "i").exec(text);
      return { substance: m ? m[0] : c.label };
    }
  }
  if (isAdverseEffectTCode(icd)) {
    const m = /adverse (?:effect|reaction) (?:of|to)\s+(.+?)(?:,|;|$)/i.exec(text);
    if (m) {
      const ing = ingredientOf(m[1]);
      return { substance: ing ?? m[1].trim() };
    }
  }
  return undefined;
}

function reactionType(text: string): AllergyIntoleranceRow["reaction_type"] {
  const t = text.toLowerCase();
  if (/anaphyla|angioedema|urticaria|hives|rash|bronchospasm|wheez|swelling|itch|pruritus|stevens|sjs|ten\b|dress|exanthem|hypersensitivity/.test(t)) return "hypersensitivity";
  if (/ketoacidosis|\bdka\b|lactic acidosis|hyperkalemia|kidney injury|\baki\b|renal failure|pancreatitis|hypoglycemi|bleed|hemorrhage|agranulocytosis|neutropenia|hepatotox|liver injury|rhabdo|seizure|arrhythmia|qt prolong|serious|life-threatening/.test(t)) return "serious_adverse_event";
  return "side_effect";
}

function mechanism(substance: string, text: string, rType: AllergyIntoleranceRow["reaction_type"]): AllergyIntoleranceRow["mechanism"] {
  const t = text.toLowerCase();
  if (/\bige\b|immune-mediated|t-cell|positive (skin|patch) test|confirmed allerg/.test(t)) return "immune";
  const aceMembers = DRUG_CLASSES[1].members;
  const isAce = aceMembers.includes(substance.toLowerCase()) || DRUG_CLASSES[1].re.test(substance);
  if (isAce && /cough|angioedema/.test(t)) return "non_immune";
  if (/ketoacidosis|\bdka\b|lactic acidosis/.test(t)) return "non_immune";
  if (rType === "serious_adverse_event" && /hyperkalemia|hypoglycemi/.test(t)) return "non_immune";
  return "unknown";
}

function criticality(severity: unknown, text: string, rType: AllergyIntoleranceRow["reaction_type"]): AllergyIntoleranceRow["criticality"] {
  if (severity === "severe") return "high";
  if (/anaphyla|angioedema|stevens|toxic epidermal|life-threatening/i.test(text)) return "high";
  if (severity === "mild") return "low";
  if (severity === undefined && rType === "serious_adverse_event") return "high";
  return "unknown";
}

interface ProblemGroup {
  icds: Set<string>;
  labels: Set<string>;
  dxCodes: Set<string>;
  entries: { doc: Doc; id: string; e: Record<string, any>; kind: "diagnosis" | "history" }[];
}

interface AllergyAcc {
  row: AllergyIntoleranceRow;
  t: number;
  explicit: boolean;
}

function buildProblemsAndReactions(docs: Doc[]): { problems: ProblemRow[]; reactions: AllergyAcc[] } {
  const groups: ProblemGroup[] = [];
  const reactions: AllergyAcc[] = [];
  for (const doc of docs) {
    const itemMeds = doc.entries.filter(([, e]) => e.type === "home_med" || e.type === "inpatient_med").map(([, e]) => e);
    for (const [id, e] of doc.entries) {
      if (e.type !== "diagnosis" && e.type !== "history") continue;
      const label = str(e.type === "diagnosis" ? e.label : e.condition);
      if (!label) continue;
      const icd = str(e.icd10cm);
      const dxCode = isObj(e.riverside_dx) ? str(e.riverside_dx.code) : undefined;
      const nl = normLabel(label);
      let g = groups.find(
        (g) => (icd && g.icds.has(icd.toUpperCase())) || g.labels.has(nl) || (dxCode && g.dxCodes.has(dxCode)),
      );
      if (!g) {
        g = { icds: new Set(), labels: new Set(), dxCodes: new Set(), entries: [] };
        groups.push(g);
      }
      if (icd) g.icds.add(icd.toUpperCase());
      g.labels.add(nl);
      if (dxCode) g.dxCodes.add(dxCode);
      g.entries.push({ doc, id, e, kind: e.type });
    }
  }

  const problems: ProblemRow[] = [];
  for (const g of groups) {
    // latest entry that states a definite status
    const ordered = g.entries; // docs are already in time order
    const last = ordered[ordered.length - 1];
    if (last.kind === "diagnosis" && last.e.status === "ruled_out") continue;
    let cur: (typeof ordered)[number] | undefined;
    for (let i = ordered.length - 1; i >= 0; i--) {
      const x = ordered[i];
      if (x.kind === "history" || x.e.status === "active" || x.e.status === "resolved") {
        cur = x;
        break;
      }
    }
    if (!cur) continue;
    const label = str(cur.kind === "diagnosis" ? cur.e.label : cur.e.condition)!;
    const icd = str(cur.e.icd10cm);
    let status: ProblemRow["status"];
    if (cur.kind === "diagnosis") status = cur.e.status === "resolved" ? "resolved" : "active";
    else status = /\b(history of|h\/o|s\/p|status post|resolved|remote|childhood|prior|previous|past)\b/i.test(label) || /^Z8[67]/i.test(icd ?? "") ? "resolved" : "active";

    const allText = (x: (typeof ordered)[number]) =>
      `${str(x.kind === "diagnosis" ? x.e.label : x.e.condition) ?? ""} ${isObj(x.e.riverside_dx) ? str(x.e.riverside_dx.name) ?? "" : ""}`;
    const curText = allText(cur);

    // Drug-caused diagnosis: reaction row for the drug (cause looked up in the latest entry that names one).
    let cause: DrugCause | undefined;
    let causeEntry: (typeof ordered)[number] | undefined;
    for (let i = ordered.length - 1; i >= 0 && !cause; i--) {
      const x = ordered[i];
      if (x.kind === "diagnosis" && x.e.status !== "active" && x.e.status !== "resolved") continue;
      const meds = x.doc.entries.filter(([, e]) => e.type === "home_med" || e.type === "inpatient_med").map(([, e]) => e);
      cause = drugCause(allText(x), str(x.e.icd10cm), meds);
      if (cause) causeEntry = x;
    }
    const tOnly = isAdverseEffectTCode(icd) && /^\s*(adverse (effect|reaction)|drug (reaction|intolerance))/i.test(label);

    const evidence: Evidence = [];
    addEvidence(evidence, cur.doc.item.id, cur.id);
    for (const x of ordered)
      if (x.kind === "history" || x.e.status === "active" || x.e.status === "resolved") addEvidence(evidence, x.doc.item.id, x.id);

    if (cause && causeEntry) {
      const reactText = label;
      const rType = reactionType(curText);
      const first = ordered.find((x) => x.kind === "history" || x.e.status === "active" || x.e.status === "resolved") ?? cur;
      const onsetStr = first.doc.encounter ? localDate(first.doc.encounter.arrived) ?? localDate(first.doc.item.effective) : localDate(first.doc.item.effective);
      const row: AllergyIntoleranceRow = {
        substance: cause.substance,
        reaction_type: rType,
        mechanism: mechanism(cause.substance, curText, rType),
        reaction: reactText,
        criticality: rType === "serious_adverse_event" || /anaphyla|angioedema/i.test(curText) ? "high" : "unknown",
        evidence: [...evidence],
      };
      if (cause.rxnorm) row.rxnorm_ingredient = cause.rxnorm;
      if (onsetStr) row.onset = { value: onsetStr, precision: precisionOf(onsetStr) };
      reactions.push({ row, t: causeEntry.doc.t, explicit: false });
    }
    if (tOnly && cause) continue;

    const row: ProblemRow = { condition: label, status, evidence };
    if (icd) row.icd10cm = icd;
    // onset: latest history entry with a readable onset
    for (let i = ordered.length - 1; i >= 0; i--) {
      const x = ordered[i];
      if (x.kind !== "history") continue;
      const d = parsePartialDate(x.e.onset_text);
      if (d) {
        row.onset = { value: d, precision: precisionOf(d) };
        addEvidence(evidence, x.doc.item.id, x.id);
        break;
      }
    }
    if (isCkd(label, icd) || ordered.some((x) => isCkd(allText(x), str(x.e.icd10cm)))) {
      for (let i = ordered.length - 1; i >= 0; i--) {
        const x = ordered[i];
        const st = ckdStage(allText(x), str(x.e.icd10cm));
        if (st) {
          row.ckd_stage = st;
          break;
        }
      }
      for (let i = ordered.length - 1; i >= 0; i--) {
        const m = /\bA([123])\b/.exec(allText(ordered[i]));
        if (m) {
          row.albuminuria = `A${m[1]}` as ProblemRow["albuminuria"];
          break;
        }
      }
    }
    const sens = conditionSensitivity(curText, icd);
    if (sens) row.sensitivity = sens;
    problems.push(row);
  }
  return { problems, reactions };
}

// ───────────────────────────── allergies ─────────────────────────────

function buildAllergies(docs: Doc[], reactions: AllergyAcc[]): AllergyIntoleranceRow[] {
  const acc = new Map<string, AllergyAcc>();
  const keyOf = (substance: string) => substance.toLowerCase().trim();
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      if (e.type !== "allergy") continue;
      const raw = str(e.substance);
      if (!raw) continue;
      if (/^(nkda|nka|no known (drug )?allergies|none)$/i.test(raw)) continue;
      const ing = ingredientOf(raw);
      const substance = ing && (KNOWN_DRUGS.includes(ing) || str(e.rxnorm_ingredient)) ? ing : raw;
      const reaction = str(e.reaction);
      const text = `${reaction ?? ""}`;
      const rType = reactionType(text);
      const row: AllergyIntoleranceRow = {
        substance,
        reaction_type: rType,
        mechanism: mechanism(substance, text, rType),
        criticality: criticality(e.severity, text, rType),
        evidence: [{ item_id: doc.item.id, entry_id: id }],
      };
      if (str(e.rxnorm_ingredient)) row.rxnorm_ingredient = str(e.rxnorm_ingredient);
      if (reaction) row.reaction = reaction;
      const k = keyOf(substance);
      const prev = acc.get(k);
      if (prev) for (const ev of prev.row.evidence) if (!row.evidence.some((x) => x.item_id === ev.item_id && x.entry_id === ev.entry_id)) row.evidence.push(ev);
      acc.set(k, { row, t: doc.t, explicit: true });
    }
  }
  for (const r of reactions) {
    const k = keyOf(r.row.substance);
    const prev = acc.get(k);
    if (!prev) {
      acc.set(k, r);
      continue;
    }
    if (prev.explicit) {
      for (const ev of r.row.evidence) addEvidence(prev.row.evidence, ev.item_id, ev.entry_id);
      if (!prev.row.reaction) prev.row.reaction = r.row.reaction;
      else if (r.row.reaction && !prev.row.reaction.toLowerCase().includes(r.row.reaction.toLowerCase())) prev.row.reaction += `; ${r.row.reaction}`;
    } else {
      const keep = r.t >= prev.t ? r : prev;
      const other = keep === r ? prev : r;
      for (const ev of other.row.evidence) addEvidence(keep.row.evidence, ev.item_id, ev.entry_id);
      if (keep.row.reaction && other.row.reaction && !keep.row.reaction.includes(other.row.reaction)) keep.row.reaction += `; ${other.row.reaction}`;
      acc.set(k, keep);
    }
  }
  return [...acc.values()].map((a) => a.row);
}

// ───────────────────────────── labs ─────────────────────────────

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "98980-6": "egfr", "62238-1": "egfr", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr",
  "88293-6": "egfr", "88294-4": "egfr", "50044-7": "egfr", "50210-4": "egfr", "69405-9": "egfr", "77147-7": "egfr", "70969-1": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "77142-8": "potassium",
  "2951-2": "sodium", "2947-0": "sodium", "77139-4": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap",
  "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose", "74774-1": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "14958-3": "uacr", "13705-9": "uacr", "30000-4": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "804-5": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin", "55782-7": "hemoglobin",
  "53060-9": "bhb", "47689-8": "bhb", "49290-0": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "33254-4": "ph", "19213-6": "ph", "2745-8": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "2020-6": "pco2",
  "3040-3": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin", "16255-2": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

const LOCAL_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", GFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", HCO3: "bicarbonate", TCO2: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun",
  GLU: "glucose", A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc",
  HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", VPH: "ph", APH: "ph", PH: "ph", VPCO2: "pco2", APCO2: "pco2",
  PCO2: "pco2", LIPASE: "lipase", TNI: "troponin", TROPI: "troponin", HSTNI: "troponin", CHOL: "cholesterol",
  TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl",
};

function analyteByName(name: string): Analyte | undefined {
  const n = name.toLowerCase();
  if (/\bpoc\b|point[- ]of[- ]care|meter|fingerstick|capillary/.test(n)) return undefined;
  if (/a1c|glycated|glycosylated/.test(n)) return "a1c";
  if (/egfr|glomerular filtration/.test(n)) return "egfr";
  if (/albumin.*creatinine|\buacr\b|\bacr\b/.test(n)) return "uacr";
  if (/^creatinine\b(?!.*urine)/.test(n)) return "creatinine";
  if (/beta[- ]?hydroxybut|\bbhb\b|ketone.*hydroxy/.test(n)) return "bhb";
  if (/\bph\b/.test(n) && !/urine/.test(n)) return "ph";
  if (/\bpco2\b/.test(n)) return "pco2";
  if (/^potassium/.test(n)) return "potassium";
  if (/^sodium/.test(n)) return "sodium";
  if (/^chloride/.test(n)) return "chloride";
  if (/^bicarbonate|total co2|^co2\b|carbon dioxide/.test(n)) return "bicarbonate";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/^glucose/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(n)) return "wbc";
  if (/^hemoglobin\b|^hgb\b/.test(n)) return "hemoglobin";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin i\b|troponin-i|\btni\b/.test(n)) return "troponin";
  if (/^(total )?cholesterol(, total)?$/.test(n)) return "cholesterol";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/\bhdl\b/.test(n)) return "hdl";
  if (/\bldl\b/.test(n)) return "ldl";
  return undefined;
}

const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function canonUnit(u: string): string {
  return u.toLowerCase().replace(/\s+/g, "").replace(/µ/g, "u").replace(/\^/g, "*").replace(/×/g, "x");
}

/** Convert to the analyte's unit; undefined if the unit cannot be read. */
function convert(a: Analyte, v: number, unit: string | undefined): number | undefined {
  if (a === "ph") return unit === undefined || /^(\[ph\]|ph|units?|)$/i.test(unit.trim()) ? v : undefined;
  if (unit === undefined) return undefined;
  const u = canonUnit(unit);
  const same = canonUnit(UNIT[a]);
  if (u === same) return v;
  switch (a) {
    case "creatinine":
      if (u === "umol/l") return Math.round((v / 88.42) * 100) / 100;
      if (u === "mg/dl") return v;
      break;
    case "egfr":
      if (/^ml\/min(\/1\.73m\*?2|\/1\.73\s*m2|\/{1\.73_m2}|\/1\.73)?$/.test(u) || u === "ml/min/1.73m²") return v;
      break;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      if (u === "meq/l" || u === "mmol/l") return v;
      break;
    case "bhb":
      if (u === "mmol/l") return v;
      if (u === "mg/dl") return Math.round((v / 10.41) * 100) / 100;
      break;
    case "bun":
      if (u === "mmol/l") return Math.round(v * 2.8 * 10) / 10;
      break;
    case "glucose": case "cholesterol": case "hdl": case "ldl":
      if (u === "mmol/l") {
        const f = a === "glucose" ? 18.016 : 38.67;
        return Math.round(v * f);
      }
      break;
    case "triglycerides":
      if (u === "mmol/l") return Math.round(v * 88.57);
      break;
    case "a1c":
      if (u === "%" || u === "%hb" || u === "%{hb}") return v;
      if (u === "mmol/mol") return Math.round((v / 10.929 + 2.15) * 10) / 10;
      break;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "mg/g{creat}" || u === "ug/mg" || u === "mcg/mg") return v;
      if (u === "mg/mmol" || u === "mg/mmolcreat") return Math.round(v * 8.84 * 10) / 10;
      break;
    case "platelets": case "wbc":
      if (/^(10\*3|x10\*3|x10e3|10e3|k|thou|thousand|x1000)\/(ul|mm\*?3|cumm)$/.test(u)) return v;
      if (/^(10\*9|x10\*9|x10e9|10e9|g)\/l$/.test(u)) return v;
      if (/^(cells\/ul|\/ul|\/mm\*?3|cells\/mm\*?3)$/.test(u)) return Math.round((v / 1000) * 1000) / 1000;
      break;
    case "hemoglobin":
      if (u === "g/dl") return v;
      if (u === "g/l") return Math.round((v / 10) * 10) / 10;
      if (u === "mmol/l") return Math.round(v * 1.611 * 10) / 10;
      break;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return v;
      if (u === "kpa") return Math.round(v * 7.50062 * 10) / 10;
      break;
    case "lipase":
      if (u === "u/l" || u === "iu/l" || u === "units/l") return v;
      break;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return Math.round((v / 1000) * 100000) / 100000;
      break;
  }
  return undefined;
}

function specimenOk(a: Analyte, specimen: string, testName: string): boolean {
  const s = specimen.toLowerCase();
  const n = testName.toLowerCase();
  const urine = /urine/.test(s) || /urine|\bur\b/.test(n);
  if (a === "uacr") return urine || s === "";
  if (urine) return false;
  if (/csf|cerebrospinal|pleural|peritoneal|ascit|synovial|fluid|stool|dialysate|drain/.test(s)) return false;
  if (a === "glucose" && (/capillary|fingerstick|poc/.test(s) || /\bpoc\b|meter|fingerstick|point[- ]of[- ]care/.test(n))) return false;
  return true;
}

function egfrEquation(name: string, loinc?: string): LabResultRow["egfr_equation"] {
  const n = name.toLowerCase();
  if (/ckd[- ]?epi/.test(n) && /2021|race[- ]free|without race/.test(n)) return "ckd-epi-2021";
  if (/ckd[- ]?epi/.test(n) && /2009/.test(n)) return "ckd-epi-2009";
  if (/mdrd/.test(n)) return "mdrd";
  if (/ckd[- ]?epi/.test(n)) {
    if (loinc === "98979-8" || loinc === "98980-6") return "ckd-epi-2021";
    return "ckd-epi-2009";
  }
  if (/cockcroft|schwartz/.test(n)) return "unknown";
  switch (loinc) {
    case "98979-8": case "98980-6": return "ckd-epi-2021";
    case "62238-1": case "88293-6": case "88294-4": case "50044-7": case "50210-4": return "ckd-epi-2009";
    case "33914-3": case "48642-3": case "48643-1": case "69405-9": case "70969-1": return "mdrd";
  }
  return "unknown";
}

function isRaceVariant(name: string, loinc?: string): boolean {
  const n = name.toLowerCase();
  if (/non[- ]?(african|black|aa\b)|not (african|black)/.test(n)) return false;
  if (/african|black|\baa\b|afr am/.test(n)) return true;
  return loinc === "48643-1" || loinc === "88293-6";
}

interface LabAcc {
  row: LabResultRow;
  rank: number;
  t: number;
}

function buildLabs(docs: Doc[]): LabResultRow[] {
  const acc = new Map<string, LabAcc>();
  const statusRank = (s: unknown) => (s === "corrected" ? 3 : s === "final" ? 2 : s === "preliminary" ? 1 : 0);
  const take = (doc: Doc, entryId: string, rv: Record<string, any>, header: Record<string, any>) => {
    const rank = statusRank(header.status);
    if (!rank) return;
    const test = isObj(rv.test) ? rv.test : undefined;
    if (!test) return;
    const loinc = str(test.loinc);
    const name = str(test.name) ?? "";
    const local = str(test.local_code)?.toUpperCase();
    let a: Analyte | undefined = loinc ? LOINC_ANALYTE[loinc] : undefined;
    if (!a && !loinc && local) a = LOCAL_ANALYTE[local];
    if (!a) a = analyteByName(name);
    if (!a) return;
    if (!specimenOk(a, str(header.specimen) ?? "", name)) return;
    if (a === "egfr" && isRaceVariant(name, loinc)) return;
    const raw = typeof rv.value === "number" ? String(rv.value) : str(rv.value);
    if (!raw) return;
    const m = /^(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?)$/.exec(raw.replace(/,/g, ""));
    if (!m) return;
    const comparator = m[1] ? (({ "≤": "<=", "≥": ">=" } as Record<string, string>)[m[1]] ?? m[1]) : undefined;
    const value = convert(a, Number(m[2]), str(rv.unit));
    if (value === undefined) return;
    const collected = rfc3339(header.collected);
    if (!collected) return;
    const accession = str(header.accession) ?? "";
    const testKey = local ?? loinc ?? name.toLowerCase();
    const key = accession ? `${accession}|${testKey}` : `${collected}|${testKey}|${raw}`;
    const row: LabResultRow = {
      analyte: a,
      value,
      unit: UNIT[a],
      collected,
      status: rank >= 2 ? "final" : "preliminary",
      evidence: [{ item_id: doc.item.id, entry_id: entryId }],
    };
    if (comparator) row.comparator = comparator as LabResultRow["comparator"];
    if (a === "egfr") row.egfr_equation = egfrEquation(name, loinc);
    if (loinc) row.loinc = loinc;
    const prev = acc.get(key);
    if (!prev || rank > prev.rank || (rank === prev.rank && doc.t >= prev.t)) {
      if (prev) for (const ev of prev.row.evidence) if (!row.evidence.some((x) => x.item_id === ev.item_id && x.entry_id === ev.entry_id)) row.evidence.push(ev);
      acc.set(key, { row, rank, t: doc.t });
    } else {
      addEvidence(prev.row.evidence, doc.item.id, entryId);
    }
  };
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      if (e.type === "result") take(doc, id, e, e);
      else if (e.type === "panel" && Array.isArray(e.components)) {
        for (const c of e.components) if (isObj(c)) take(doc, id, c, e);
      }
    }
  }
  return [...acc.values()].map((x) => x.row);
}

// ───────────────────────────── vitals ─────────────────────────────

function buildVitals(docs: Doc[]): VitalRow[] {
  const rows = new Map<string, { row: VitalRow; ms: number }>();
  for (const doc of docs) {
    const sets = doc.entries
      .filter(([, e]) => e.type === "vitals")
      .map(([id, e]) => ({ id, e, ms: toMs(e.taken), lt: localTime(e.taken) }))
      .filter((x) => x.lt && !isNaN(x.ms))
      .sort((a, b) => a.ms - b.ms);
    let open: { row: VitalRow; ms: number; key: string } | undefined;
    for (const s of sets) {
      const e = s.e;
      const sys = isObj(e.bp) ? num(e.bp.systolic_mmhg) : undefined;
      const dia = isObj(e.bp) ? num(e.bp.diastolic_mmhg) : undefined;
      const hasBp = sys !== undefined && dia !== undefined;
      const pulse = num(e.heart_rate_bpm);
      const wt = num(e.weight_kg);
      if (!hasBp && pulse === undefined && wt === undefined) continue;
      // A later BP-only reading at the same visit (same document, within an hour) is a repeat.
      if (
        open && hasBp && pulse === undefined && wt === undefined &&
        open.row.systolic_mmhg !== undefined && open.row.repeat_systolic_mmhg === undefined &&
        s.ms - open.ms <= 60 * 60000 && s.ms > open.ms
      ) {
        open.row.repeat_systolic_mmhg = sys;
        open.row.repeat_diastolic_mmhg = dia;
        addEvidence(open.row.evidence, doc.item.id, s.id);
        continue;
      }
      const key = `${s.ms}|${sys ?? ""}|${dia ?? ""}|${pulse ?? ""}|${wt ?? ""}`;
      const existing = rows.get(key);
      if (existing) {
        addEvidence(existing.row.evidence, doc.item.id, s.id);
        open = undefined;
        continue;
      }
      const row: VitalRow = { setting: "hospital", local_time: s.lt!, evidence: [{ item_id: doc.item.id, entry_id: s.id }] };
      if (hasBp) {
        row.systolic_mmhg = sys;
        row.diastolic_mmhg = dia;
      }
      if (pulse !== undefined) row.pulse_bpm = pulse;
      if (wt !== undefined) row.weight_kg = Math.round(wt * 10) / 10;
      rows.set(key, { row, ms: s.ms });
      open = { row, ms: s.ms, key };
    }
  }
  return [...rows.values()].sort((a, b) => a.ms - b.ms).map((x) => x.row);
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return out;
  let docs: Doc[];
  try {
    docs = currentDocs(items, asOf);
  } catch {
    return out;
  }
  const safe = <T>(f: () => T, d: T): T => {
    try {
      return f();
    } catch {
      return d;
    }
  };
  out.medications = safe(() => buildMedications(docs), []);
  const pr = safe(() => buildProblemsAndReactions(docs), { problems: [] as ProblemRow[], reactions: [] as AllergyAcc[] });
  out.problems = pr.problems;
  out.allergies = safe(() => buildAllergies(docs, pr.reactions), []);
  out.labs = safe(() => buildLabs(docs), []);
  out.vitals = safe(() => buildVitals(docs), []);
  return out;
}
