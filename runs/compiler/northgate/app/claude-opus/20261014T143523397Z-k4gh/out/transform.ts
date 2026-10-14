import type {
  AllergyIntoleranceRow,
  Analyte,
  Evidence,
  FolioItem,
  LabResultRow,
  MedicationRow,
  ProblemRow,
  Sensitivity,
  ViewRows,
  VitalRow,
} from "../in/views/views";

// ─────────────────────────────────────────────────────────────────────────────
// Time helpers (America/Chicago)
// ─────────────────────────────────────────────────────────────────────────────

const TZ = "America/Chicago";
let fmt: Intl.DateTimeFormat | null = null;

function chicagoParts(ms: number): { date: string; time: string } | null {
  if (!isFinite(ms)) return null;
  try {
    if (!fmt) {
      fmt = new Intl.DateTimeFormat("en-US", {
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
    const p: Record<string, string> = {};
    for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
    const hh = p.hour === "24" ? "00" : p.hour;
    return { date: `${p.year}-${p.month}-${p.day}`, time: `${hh}:${p.minute}:${p.second}` };
  } catch {
    return null;
  }
}

const DATE_ONLY = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;
const LOCAL_DT = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/;

/** Local (Chicago) wall-clock view of a FOLIO date/date-time string. */
interface LocalTime {
  date: string; // YYYY-MM-DD (or partial)
  time?: string; // HH:MM:SS
}

function toLocal(s: unknown): LocalTime | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (DATE_ONLY.test(t)) return { date: t };
  const m = LOCAL_DT.exec(t);
  if (m && !HAS_ZONE.test(t)) return { date: m[1], time: `${m[2]}:${m[3]}:${m[4] ?? "00"}` };
  const ms = Date.parse(t);
  const p = chicagoParts(ms);
  return p ? { date: p.date, time: p.time } : null;
}

function localDate(s: unknown): string | undefined {
  const l = toLocal(s);
  return l ? l.date : undefined;
}

function instant(s: unknown): number {
  if (typeof s !== "string") return NaN;
  const t = s.trim();
  if (HAS_ZONE.test(t)) return Date.parse(t);
  const l = toLocal(t);
  if (!l) return NaN;
  return wallToInstant(l.date.length === 10 ? l.date : (l.date + "-01-01").slice(0, 10), l.time ?? "00:00:00");
}

/** Instant (ms) for a Chicago wall-clock time. */
function wallToInstant(date: string, time: string): number {
  const base = Date.parse(`${date}T${time}Z`);
  if (!isFinite(base)) return NaN;
  for (const off of [5, 6]) {
    const ms = base + off * 3600000;
    const p = chicagoParts(ms);
    if (p && p.date === date && p.time.slice(0, 5) === time.slice(0, 5)) return ms;
  }
  return base + 6 * 3600000;
}

/** RFC 3339 with offset; strings without zone are taken as Chicago wall time. */
function withOffset(s: string): string {
  const t = s.trim();
  if (HAS_ZONE.test(t)) return t;
  const m = LOCAL_DT.exec(t);
  if (!m) return t;
  const time = `${m[2]}:${m[3]}:${m[4] ?? "00"}`;
  const ms = wallToInstant(m[1], time);
  const base = Date.parse(`${m[1]}T${time}Z`);
  const offH = Math.round((ms - base) / 3600000);
  return `${m[1]}T${time}-${String(offH).padStart(2, "0")}:00`;
}

/** Compare two clinical times: by local date, then local time when both have one. */
function cmpLocal(a: LocalTime | null, b: LocalTime | null): number {
  if (!a || !b) return a ? 1 : b ? -1 : 0;
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  if (a.time && b.time && a.time !== b.time) return a.time < b.time ? -1 : 1;
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic helpers
// ─────────────────────────────────────────────────────────────────────────────

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
function round(v: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(v * f) / f;
}
function addSens(list: Sensitivity[], s: Sensitivity) {
  if (!list.includes(s)) list.push(s);
}
function pushEv(ev: Evidence, item_id: string, entry_id: string) {
  if (!ev.some((e) => e.item_id === item_id && e.entry_id === entry_id)) ev.push({ item_id, entry_id });
}

function fuzzy(v: unknown): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!isObj(v)) return undefined;
  const d = str(v.date);
  if (!d) return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(d);
  if (!m) return undefined;
  let precision: "year" | "month" | "day" =
    v.precision === "year" || v.precision === "month" || v.precision === "day" ? v.precision : m[3] ? "day" : m[2] ? "month" : "year";
  if (precision === "day" && !m[3]) precision = m[2] ? "month" : "year";
  if (precision === "month" && !m[2]) precision = "year";
  const value = precision === "year" ? m[1] : precision === "month" ? `${m[1]}-${m[2]}` : `${m[1]}-${m[2]}-${m[3]}`;
  return { value, precision };
}

// ─────────────────────────────────────────────────────────────────────────────
// Drug name handling
// ─────────────────────────────────────────────────────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide", byetta: "exenatide",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin",
  glucophage: "metformin", glucotrol: "glipizide", amaryl: "glimepiride", actos: "pioglitazone",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril",
  norvasc: "amlodipine", procardia: "nifedipine", cardizem: "diltiazem",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin", zetia: "ezetimibe",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide",
  aldactone: "spironolactone", inspra: "eplerenone", kerendia: "finerenone",
  coreg: "carvedilol", toprol: "metoprolol", "toprol xl": "metoprolol", lopressor: "metoprolol", tenormin: "atenolol",
  synthroid: "levothyroxine", levoxyl: "levothyroxine",
  zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine", paxil: "paroxetine",
  wellbutrin: "bupropion", effexor: "venlafaxine", cymbalta: "duloxetine", trazodone: "trazodone",
  seroquel: "quetiapine", abilify: "aripiprazole", lamictal: "lamotrigine", buspar: "buspirone",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", plavix: "clopidogrel",
  advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", tylenol: "acetaminophen", celebrex: "celecoxib",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", pepcid: "famotidine",
  neurontin: "gabapentin", lyrica: "pregabalin", zyloprim: "allopurinol", uloric: "febuxostat",
  flomax: "tamsulosin", proscar: "finasteride", viagra: "sildenafil", cialis: "tadalafil",
  suboxone: "buprenorphine / naloxone", subutex: "buprenorphine", vivitrol: "naltrexone",
  ventolin: "albuterol", proair: "albuterol", flonase: "fluticasone", claritin: "loratadine", zyrtec: "cetirizine",
  "k-dur": "potassium chloride", "klor-con": "potassium chloride", veltassa: "patiromer", lokelma: "sodium zirconium cyclosilicate",
};

const SALTS = new Set([
  "potassium", "sodium", "calcium", "magnesium", "hydrochloride", "hcl", "dihydrochloride", "besylate", "maleate",
  "succinate", "tartrate", "citrate", "sulfate", "mesylate", "fumarate", "bromide", "hydrobromide", "acetate",
  "phosphate", "monohydrate", "dihydrate", "trihydrate", "anhydrous", "hyclate", "propionate", "furoate", "dipropionate",
  "bitartrate", "medoxomil", "cilexetil", "hemifumarate", "disodium", "trometamol", "tromethamine", "lactate", "gluconate",
]);

const FORM_WORDS = new Set([
  "oral", "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "extended", "delayed", "release",
  "solution", "suspension", "injection", "injectable", "pen", "injector", "prefilled", "syringe", "auto-injector",
  "topical", "cream", "ointment", "patch", "transdermal", "film", "coated", "chewable", "disintegrating", "er", "xl",
  "xr", "sr", "dr", "cr", "la", "ec", "inhaler", "inhalation", "nasal", "spray", "powder", "metered", "dose",
  "ophthalmic", "drops", "kwikpen", "flextouch", "solostar", "vial", "cartridge", "product", "pack",
]);

const VAGUE = /\b(pill|pills|medicine|medication|meds|supplement|unknown)\b/i;

function stripSalts(words: string[]): string[] {
  // Strip salt words after the first word (keeps "potassium chloride", "sodium bicarbonate" intact).
  if (isKeep(words)) return words;
  return words.filter((w, i) => i === 0 || !SALTS.has(w));
}
function isKeep(words: string[]): boolean {
  const j = words.join(" ");
  return /^(potassium|sodium|calcium|magnesium) (chloride|bicarbonate|citrate|carbonate|acetate|phosphate|oxide|gluconate)$/.test(j);
}

function ingredientPart(part: string): string | undefined {
  let s = part.toLowerCase().replace(/\[[^\]]*\]/g, " ").replace(/\([^)]*\)/g, " ").trim();
  // leading quantities such as "3 ML", "24 HR", "0.5 ML"
  for (;;) {
    const m = /^\d+(\.\d+)?\s*(ml|hr|actuat|mg|unt|units?)\s+/.exec(s);
    if (!m) break;
    s = s.slice(m[0].length);
  }
  const dig = s.search(/\d/);
  if (dig >= 0) s = s.slice(0, dig);
  let words = s.split(/[\s,]+/).filter((w) => w !== "");
  while (words.length && FORM_WORDS.has(words[words.length - 1])) words.pop();
  words = words.filter((w) => !FORM_WORDS.has(w) || words.length === 1);
  words = stripSalts(words);
  if (!words.length) return undefined;
  const joined = words.join(" ");
  if (BRANDS[joined]) return BRANDS[joined];
  if (BRANDS[words[0]]) return BRANDS[words[0]];
  return joined;
}

function ingredientOf(name: string | undefined): string | undefined {
  if (!name) return undefined;
  if (VAGUE.test(name) && !/\d/.test(name)) return undefined;
  const brack = /\[([^\]]+)\]/.exec(name);
  const parts = name.split(/\s+\/\s+|\s+and\s+/i);
  const ings: string[] = [];
  for (const p of parts) {
    const i = ingredientPart(p);
    if (i && !ings.includes(i)) ings.push(i);
  }
  if (!ings.length && brack) {
    const b = BRANDS[brack[1].trim().toLowerCase()];
    if (b) return b;
  }
  if (!ings.length) return undefined;
  return ings.sort().join(" / ");
}

/** Strength in mg per tablet/capsule, when the product name gives exactly one. */
function strengthMg(name: string): number | undefined {
  if (!/(tablet|capsule|\btab\b|\bcap\b)/i.test(name)) return undefined;
  const re = /(\d+(?:\.\d+)?)\s*(mg|mcg|ug|g)\b(?!\s*\/\s*(ml|actuat))/gi;
  const found: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(name))) {
    const v = Number(m[1]);
    const u = m[2].toLowerCase();
    found.push(u === "g" ? v * 1000 : u === "mcg" || u === "ug" ? v / 1000 : v);
  }
  return found.length === 1 ? found[0] : undefined;
}

function strengthMcg(name: string): number | undefined {
  if (!/(tablet|capsule|\btab\b|\bcap\b)/i.test(name)) return undefined;
  const all = name.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|ug|g)\b/gi) ?? [];
  if (all.length !== 1) return undefined;
  const m = /(\d+(?:\.\d+)?)\s*(mcg|ug)\b/i.exec(all[0]);
  return m ? Number(m[1]) : undefined;
}

function normDose(dose: unknown, drugName: string): MedicationRow["dose"] | undefined {
  if (!isObj(dose)) return undefined;
  const v = num(dose.value);
  const u = str(dose.unit)?.toLowerCase().replace(/[.\s]/g, "");
  if (v === undefined || !u || v <= 0) return undefined;
  if (["unit", "units", "unt", "u", "[iu]", "iu", "intlunits", "[iu]s"].includes(u)) return { value: v, unit: "units" };
  if (["mg", "milligram", "milligrams"].includes(u)) return { value: v, unit: "mg" };
  if (["g", "gram", "grams"].includes(u)) return { value: round(v * 1000, 6), unit: "mg" };
  if (["mcg", "ug", "µg", "microgram", "micrograms"].includes(u)) return { value: v, unit: "mcg" };
  if (["ml", "milliliter", "milliliters", "millilitre"].includes(u)) return { value: v, unit: "mL" };
  if (/^(tab|tabs|tablet|tablets|cap|caps|capsule|capsules|\{tbl\}|\{tablet\}|\{capsule\})$/.test(u)) {
    const mcg = strengthMcg(drugName);
    if (mcg !== undefined) return { value: round(v * mcg, 6), unit: "mcg" };
    const mg = strengthMg(drugName);
    if (mg !== undefined) return { value: round(v * mg, 6), unit: "mg" };
    return { value: v, unit: "tablet" };
  }
  return undefined;
}

const HOSPITAL_ONLY = /\b(iv|ivpb|intravenous|infusion|piggyback|premix|in sodium chloride|in dextrose|lactated ringer|0\.9 ?% sodium chloride|dextrose \d+ ?%|heparin sodium.*units\/ml injectable|epidural)\b/i;

// Drug classes, for drug-caused diagnoses.
const CLASSES: { re: RegExp; member: RegExp }[] = [
  { re: /\b(ace[- ]?i\b|ace[- ]inhibitors?|angiotensin[- ]converting[- ]enzyme inhibitors?)/i, member: /pril$/ },
  { re: /\b(arbs?\b|angiotensin (ii )?receptor blockers?)/i, member: /sartan$/ },
  { re: /\bsglt-?2( inhibitors?)?\b|sodium[- ]glucose co-?transporter/i, member: /gliflozin$/ },
  { re: /\bstatins?\b|hmg-?coa/i, member: /statin$/ },
  { re: /\bglp-?1\b/i, member: /(glutide|tirzepatide|exenatide)$/ },
  { re: /\bdpp-?4\b/i, member: /gliptin$/ },
  { re: /\bsulfonylureas?\b/i, member: /^(glipizide|glyburide|glimepiride|gliclazide)$/ },
  { re: /\bthiazides?\b/i, member: /^(hydrochlorothiazide|chlorthalidone|indapamide|metolazone)$/ },
  { re: /\bbeta[- ]blockers?\b/i, member: /(olol|carvedilol|labetalol)$/ },
  { re: /\bloop diuretics?\b/i, member: /^(furosemide|bumetanide|torsemide)$/ },
  { re: /\b(nsaids?|non-?steroidal)/i, member: /^(ibuprofen|naproxen|meloxicam|diclofenac|celecoxib|indomethacin|ketorolac)$/ },
  { re: /\b(mras?|mineralocorticoid)/i, member: /^(spironolactone|eplerenone|finerenone)$/ },
  { re: /\binsulins?\b/i, member: /^insulin/ },
  { re: /\bpenicillins?\b/i, member: /^(penicillin|amoxicillin|ampicillin|dicloxacillin|piperacillin)/ },
  { re: /\bsulfonamides?\b|\bsulfa\b/i, member: /^sulfamethoxazole/ },
  { re: /\bopioids?\b/i, member: /^(oxycodone|hydrocodone|morphine|codeine|tramadol|hydromorphone)/ },
];

const DRUGLIKE = /(pril|sartan|gliflozin|statin|glutide|gliptin|olol|dipine|thiazide|semide|mycin|cillin|floxacin|azole|prazole|parin|xaban|tidine|formin|zepam|oxetine|aline|triptan)$/;

function classOf(text: string): RegExp | undefined {
  for (const c of CLASSES) if (c.re.test(text)) return c.member;
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reaction classification
// ─────────────────────────────────────────────────────────────────────────────

const HYPERSENS = /anaphyla|angioedema|angio-edema|urticaria|hives|rash|bronchospasm|wheez|stevens|\bsjs\b|toxic epidermal|\bdress\b|exanthem|pruritus|itch|(lip|tongue|throat|face|facial|airway).*swell|swell.*(lip|tongue|throat|face)|throat (closing|tightness)|serum sickness/i;
const SERIOUS = /ketoacidosis|\bdka\b|lactic acidosis|hyperkalemi|acute kidney|kidney injury|renal failure|\baki\b|pancreatitis|rhabdomyolysis|agranulocytosis|neutropenia|hepatotox|liver (injury|failure)|hepatitis|bleed|hemorrhag|torsade|qt prolong|seizure|hyponatremi|severe hypoglyc|fournier|gangrene/i;
const SIDE = /cough|nausea|vomit|diarrh|constipat|\bgi\b|stomach|dyspep|myalgia|muscle|ache|headache|dizz|fatigue|edema|flushing|insomnia|drows|somnol|taste|dry mouth|yeast|mycotic|urinary|cramp|palpitation|tremor|anxiety|sexual/i;

function classifyReaction(text: string, sourceType?: string, severity?: string): AllergyIntoleranceRow["reaction_type"] {
  if (HYPERSENS.test(text)) return "hypersensitivity";
  if (SERIOUS.test(text)) return "serious_adverse_event";
  if (SIDE.test(text)) return "side_effect";
  if (sourceType === "allergy") return "hypersensitivity";
  if (sourceType === "adverse_reaction" && severity === "high") return "serious_adverse_event";
  return "side_effect";
}

function mechanismFor(substance: string, text: string, kind: AllergyIntoleranceRow["reaction_type"]): AllergyIntoleranceRow["mechanism"] {
  const isAce = /pril$/.test(substance) || /\bace\b|angiotensin[- ]converting/i.test(substance);
  if (isAce && /cough|angioedema|angio-edema|swell/i.test(text)) return "non_immune";
  if (/ketoacidosis|\bdka\b|lactic acidosis|hyperkalemi/i.test(text)) return "non_immune";
  if (kind === "side_effect" && SIDE.test(text)) return "non_immune";
  return "unknown";
}

// ─────────────────────────────────────────────────────────────────────────────
// Labs
// ─────────────────────────────────────────────────────────────────────────────

const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L",
  troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const LOINC: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "14682-9": "creatinine",
  "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr",
  "98979-8": "egfr", "50044-7": "egfr", "50210-4": "egfr", "69405-9": "egfr", "77147-7": "egfr", "94677-2": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "14958-3": "uacr", "13705-9": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "778-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "804-5": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin", "30350-3": "hemoglobin",
  "53060-9": "bhb", "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "49563-0": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "69419-0": "ldl",
};

const NFM: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate",
  HCO3: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", GLUC: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase", TROP: "troponin", TNI: "troponin",
  TROPI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl",
};

function analyteOf(code: string, name: string, loinc: string | undefined): Analyte | undefined {
  const n = name.toLowerCase();
  if (/troponin t\b|tnt\b/.test(n)) return undefined;
  if (/point[- ]of[- ]care|glucometer|meter|\bpoc\b|fingerstick/i.test(n) && /glucose/.test(n)) return undefined;
  if (loinc && LOINC[loinc]) return LOINC[loinc];
  const c = code.toUpperCase();
  if (c.startsWith("EGFR")) return "egfr";
  if (NFM[c]) return NFM[c];
  if (/glomerular|\begfr\b/.test(n)) return "egfr";
  if (/albumin.*creatinine|\buacr\b|\bacr\b|microalb.*creat/.test(n)) return "uacr";
  if (/urine|urinary|\bur\b/.test(n)) return undefined;
  if (/\bcreatinine\b/.test(n) && !/clearance|kinase/.test(n)) return "creatinine";
  if (/a1c|glycated h|glycohemoglobin/.test(n)) return "a1c";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/potassium/.test(n)) return "potassium";
  if (/sodium/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/bicarbonate|total co2|carbon dioxide|\bco2\b/.test(n) && !/pco2|partial/.test(n)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/hydroxybutyr|\bbhb\b/.test(n)) return "bhb";
  if (/glucose/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/white blood|leukocyte|\bwbc\b/.test(n)) return "wbc";
  if (/hemoglobin|\bhgb\b/.test(n)) return "hemoglobin";
  if (/\bpco2\b|partial pressure of carbon dioxide/.test(n)) return "pco2";
  if (/\bph\b/.test(n)) return "ph";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n)) return "troponin";
  if (/\bhdl\b/.test(n)) return "hdl";
  if (/\bldl\b/.test(n)) return "ldl";
  if (/triglycer/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n) && !/hdl|ldl|vldl|non-hdl|ratio/.test(n)) return "cholesterol";
  return undefined;
}

function convertLab(a: Analyte, v: number, unitRaw: string): number | undefined {
  const u = unitRaw.trim().toLowerCase().replace(/\s+/g, "").replace("µ", "u").replace("μ", "u");
  const target = UNIT[a].toLowerCase();
  if (u === target) return v;
  const mmol = u === "mmol/l" || u === "meq/l";
  switch (a) {
    case "creatinine":
      if (u === "umol/l") return round(v / 88.42, 2);
      if (u === "mg/dl") return v;
      return undefined;
    case "egfr":
      if (/^ml\/min(\/1\.73(m2|m\^2|sqm|m²)?)?$/.test(u) || u === "ml/min/{1.73_m2}" || u === "ml/min/1.73_m2") return v;
      return undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      return mmol ? v : undefined;
    case "bun":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return round(v * 2.801, 1);
      return undefined;
    case "glucose":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 18.016);
      return undefined;
    case "a1c":
      if (u === "%" || u === "%hba1c" || u === "%{hba1c}") return v;
      if (u === "mmol/mol") return round(0.09148 * v + 2.152, 1);
      return undefined;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "mg/g{creat}" || u === "ug/mg" || u === "ug/mgcreat") return v;
      if (u === "mg/mmol") return round(v * 8.84, 1);
      return undefined;
    case "platelets": case "wbc":
      if (["10*3/ul", "10^3/ul", "x10e3/ul", "k/ul", "thou/ul", "10*9/l", "10^9/l", "x10e9/l", "k/mm3", "10*3/mm3", "x10^3/ul", "x10^9/l"].includes(u)) return v;
      if (u === "/ul" || u === "cells/ul" || u === "/mm3") return round(v / 1000, 3);
      return undefined;
    case "hemoglobin":
      if (u === "g/dl") return v;
      if (u === "g/l") return round(v / 10, 1);
      return undefined;
    case "ph":
      return u === "" || u === "[ph]" || u === "ph" ? v : undefined;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return v;
      if (u === "kpa") return round(v * 7.50062, 1);
      return undefined;
    case "lipase":
      return u === "u/l" || u === "iu/l" ? v : undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return round(v / 1000, 4);
      return undefined;
    case "cholesterol": case "hdl": case "ldl":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 38.67);
      return undefined;
    case "triglycerides":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 88.57);
      return undefined;
  }
  return undefined;
}

function egfrEquation(comment: string, name: string, loinc: string | undefined): LabResultRow["egfr_equation"] {
  const fromText = (t: string): LabResultRow["egfr_equation"] | undefined => {
    if (/ckd[- ]?epi[^.;]*2021|2021[^.;]*ckd[- ]?epi|race[- ]free|without race/i.test(t)) return "ckd-epi-2021";
    if (/ckd[- ]?epi[^.;]*2009|2009[^.;]*ckd[- ]?epi/i.test(t)) return "ckd-epi-2009";
    if (/\bmdrd\b/i.test(t)) return "mdrd";
    return undefined;
  };
  const note = fromText(comment);
  if (note) return note;
  const nm = fromText(name);
  if (nm) return nm;
  if (loinc === "98979-8") return "ckd-epi-2021";
  if (loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  if (loinc === "33914-3" || loinc === "48642-3" || loinc === "48643-1" || loinc === "50044-7" || loinc === "50210-4") return "mdrd";
  return "unknown";
}

function isRaceVariant(code: string, name: string, loinc: string | undefined): boolean {
  if (/^EGFR-?AA$/i.test(code) || /-AA$/i.test(code)) return true;
  if (loinc === "48643-1" || loinc === "88294-4") return true;
  return /african[- ]american|\bblack\b/i.test(name) && !/non[- ]?(african|black)/i.test(name);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

interface Entry {
  item: FolioItem;
  id: string;
  e: Record<string, any>;
  eff: LocalTime | null;
  rec: number;
  idx: number;
}

function cmpEntry(a: Entry, b: Entry): number {
  const c = cmpLocal(a.eff, b.eff);
  if (c) return c;
  if (a.rec !== b.rec) return a.rec < b.rec ? -1 : 1;
  return a.idx - b.idx;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    run(Array.isArray(items) ? items : [], typeof asOf === "string" ? asOf.trim() : "", out);
  } catch {
    // never throw
  }
  return out;
}

function run(items: FolioItem[], asOf: string, out: ViewRows) {
  // ── Scope in time
  const inScope: FolioItem[] = [];
  for (const it of items) {
    if (!isObj(it) || typeof it.id !== "string") continue;
    const d = localDate(it.recorded);
    if (!d || d.length !== 10) continue;
    if (asOf && d > asOf) continue;
    inScope.push(it);
  }

  // ── Corrections (supersedes/retracts and chart_correction voids, same issuer)
  const key = (issuer: unknown, id: string) => `${String(issuer)}|${id}`;
  const notCurrent = new Set<string>();
  const voided = new Set<string>(); // retracted / voided: never existed
  for (const it of inScope) {
    for (const s of Array.isArray(it.supersedes) ? it.supersedes : []) if (typeof s === "string") notCurrent.add(key(it.issuer, s));
    for (const s of Array.isArray(it.retracts) ? it.retracts : []) if (typeof s === "string") { notCurrent.add(key(it.issuer, s)); voided.add(key(it.issuer, s)); }
    if (isObj(it.payload)) {
      for (const e of Object.values(it.payload)) {
        if (isObj(e) && e.type === "chart_correction" && Array.isArray(e.voided_items)) {
          for (const s of e.voided_items) if (typeof s === "string") { notCurrent.add(key(it.issuer, s)); voided.add(key(it.issuer, s)); }
        }
      }
    }
  }
  const current = inScope.filter((it) => !notCurrent.has(key(it.issuer, it.id)));

  const entries: Entry[] = [];
  const voidedEntries: Entry[] = [];
  let idx = 0;
  for (const it of inScope) {
    if (!isObj(it.payload)) continue;
    const isCur = !notCurrent.has(key(it.issuer, it.id));
    const isVoid = voided.has(key(it.issuer, it.id));
    if (!isCur && !isVoid) continue;
    const eff = toLocal(it.effective) ?? toLocal(it.recorded);
    const rec = instant(it.recorded);
    for (const [id, e] of Object.entries(it.payload)) {
      if (!isObj(e) || typeof e.type !== "string") continue;
      const en: Entry = { item: it, id, e, eff, rec, idx: idx++ };
      (isCur ? entries : voidedEntries).push(en);
    }
  }
  void current;
  const byType = (t: string) => entries.filter((x) => x.e.type === t).sort(cmpEntry);

  const visits = new Map<string, string>();
  for (const v of byType("visit")) if (str(v.e.visit_id)) visits.set(v.e.visit_id, String(v.e.visit_type));

  // ── Medications
  const medEvents = byType("med_event");
  const voidedStarts = new Set<string>();
  for (const v of voidedEntries) if (v.e.type === "med_event" && v.e.action === "start" && str(v.e.med_id)) voidedStarts.add(v.e.med_id);
  const medLines = new Map<string, Entry[]>();
  for (const m of medEvents) {
    const mid = str(m.e.med_id);
    if (!mid || voidedStarts.has(mid)) continue;
    if (!medLines.has(mid)) medLines.set(mid, []);
    medLines.get(mid)!.push(m);
  }
  const medIngredient = new Map<string, string>(); // med_id -> ingredient (for class lookups)
  const bestByIngredient = new Map<string, { row: MedicationRow; last: Entry }>();
  for (const [mid, evs] of medLines) {
    let status: MedicationRow["status"] | undefined;
    let since: string | undefined;
    let dose: MedicationRow["dose"] | undefined;
    let freq: MedicationRow["frequency"] | undefined;
    let stopReason: MedicationRow["stop_reason"] | undefined;
    let reasonText: string | undefined;
    let drugName: string | undefined;
    let rxnorm: string | undefined;
    let hospital = false;
    const sens: Sensitivity[] = [];
    const ev: Evidence = [];
    for (const m of evs) {
      const e = m.e;
      const action = e.action;
      const d = m.eff?.date;
      const name = isObj(e.drug) ? str(e.drug.name) : undefined;
      if (name) { drugName = name; rxnorm = str(e.drug.rxnorm); }
      const dn = drugName ?? "";
      const nd = normDose(e.dose, dn);
      const hasDose = isObj(e.dose);
      const fq = normFreq(e.frequency, e.sig);
      if (e.restricted === "BH") addSens(sens, "mental-health");
      if (name && HOSPITAL_ONLY.test(name)) hospital = true;
      pushEv(ev, m.item.id, m.id);
      if (action === "start") {
        status = "active"; since = d; stopReason = undefined; reasonText = undefined;
        dose = nd; freq = fq;
      } else if (action === "change") {
        if (!status || status === "stopped") { status = "active"; since = d; }
        if (hasDose) dose = nd;
        if (fq) freq = fq;
      } else if (action === "hold") {
        status = "held"; since = d; stopReason = undefined; reasonText = str(e.reason_text);
        if (hasDose) dose = nd;
        if (fq) freq = fq;
      } else if (action === "resume") {
        status = "active"; since = d; stopReason = undefined; reasonText = undefined;
        if (hasDose) dose = nd;
        if (fq) freq = fq;
      } else if (action === "stop") {
        status = "stopped"; since = d;
        const sr = e.stop_reason;
        stopReason = ["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(sr) ? sr : undefined;
        reasonText = str(e.reason_text);
      }
    }
    if (!status || !drugName || hospital) continue;
    const ingredient = ingredientOf(drugName);
    if (ingredient) medIngredient.set(mid, ingredient);
    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: ev };
    if (ingredient) row.ingredient = ingredient;
    if (rxnorm && ingredient && drugName.trim().toLowerCase() === ingredient && !/\d/.test(drugName)) row.rxnorm_ingredient = rxnorm;
    if (since) row.status_since = since;
    if (dose) row.dose = dose;
    if (freq) row.frequency = freq;
    if (status === "stopped" && stopReason) row.stop_reason = stopReason;
    if ((status === "stopped" || status === "held") && reasonText) row.status_reason_text = reasonText;
    if (ingredient && /^(buprenorphine|methadone|naltrexone|disulfiram|acamprosate)/.test(ingredient)) addSens(sens, "substance-use");
    if (sens.length) row.sensitivity = sens;
    const k = ingredient ?? `med:${mid}`;
    const last = evs[evs.length - 1];
    const prev = bestByIngredient.get(k);
    if (!prev || cmpEntry(prev.last, last) < 0) bestByIngredient.set(k, { row, last });
  }
  out.medications = [...bestByIngredient.values()].map((x) => x.row);

  // ── Allergies (allergy events)
  const allergyMap = new Map<string, AllergyIntoleranceRow>();
  const allergyLines = new Map<string, Entry[]>();
  for (const a of byType("allergy_event")) {
    const aid = str(a.e.allergy_id) ?? `${a.item.id}#${a.id}`;
    if (!allergyLines.has(aid)) allergyLines.set(aid, []);
    allergyLines.get(aid)!.push(a);
  }
  for (const [, evs] of allergyLines) {
    const last = evs[evs.length - 1];
    if (last.e.action === "inactivate") continue;
    let latest: Entry | undefined;
    for (let i = evs.length - 1; i >= 0; i--) if (isObj(evs[i].e.substance) && str(evs[i].e.substance.name)) { latest = evs[i]; break; }
    if (!latest) continue;
    const e = latest.e;
    const sname = str(e.substance.name)!;
    const substance = drugSubstance(sname);
    const reactions = Array.isArray(e.reactions) ? e.reactions.filter((r: unknown) => typeof r === "string" && r.trim()).map((r: string) => r.trim()) : [];
    const rtext = reactions.join("; ");
    const kind = classifyReaction(rtext, e.reaction_type, e.severity);
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: kind,
      mechanism: mechanismFor(substance, rtext, kind),
      criticality: e.severity === "low" ? "low" : e.severity === "high" ? "high" : "unknown",
      evidence: [],
    };
    const rx = str(e.substance.rxnorm);
    if (rx && !/\d/.test(sname)) row.rxnorm_ingredient = rx;
    if (rtext) row.reaction = rtext;
    let onset: ReturnType<typeof fuzzy>;
    for (let i = evs.length - 1; i >= 0 && !onset; i--) onset = fuzzy(evs[i].e.onset);
    if (onset) row.onset = onset;
    for (const x of evs) pushEv(row.evidence, x.item.id, x.id);
    mergeAllergy(allergyMap, row);
  }

  // ── Problems
  const probLines = new Map<string, Entry[]>();
  for (const p of byType("problem_event")) {
    const pid = str(p.e.problem_id) ?? `${p.item.id}#${p.id}`;
    if (!probLines.has(pid)) probLines.set(pid, []);
    probLines.get(pid)!.push(p);
  }
  const probRows: { row: ProblemRow; last: Entry }[] = [];
  for (const [, evs] of probLines) {
    let status: ProblemRow["status"] | "removed" | undefined;
    let onset: ReturnType<typeof fuzzy>;
    let latest: Entry | undefined;
    const sens: Sensitivity[] = [];
    const ev: Evidence = [];
    for (const p of evs) {
      const a = p.e.action;
      if (a === "add") status = "active";
      else if (a === "resolve") status = "resolved";
      else if (a === "remove") status = "removed";
      else if (a === "update") { if (!status || status === "removed") status = "active"; }
      else continue;
      if (str(p.e.description) || str(p.e.icd10cm)) latest = p;
      const o = fuzzy(p.e.onset);
      if (o) onset = o;
      if (p.e.restricted === "BH") addSens(sens, "mental-health");
      pushEv(ev, p.item.id, p.id);
    }
    if (!latest || !status || status === "removed") continue;
    const e = latest.e;
    const desc = str(e.description) ?? str(e.icd10cm)!;
    if (/^\s*(suspected|possible|probable|presumed|rule out|r\/o|ruled out|query|\?)\b/i.test(desc) || /\bruled out\b/i.test(desc)) continue;
    const icd = str(e.icd10cm);
    icdSensitivity(icd, desc, sens);

    // Drug-caused diagnoses
    const drugDx = drugCause(desc, icd);
    if (drugDx) {
      const sub = resolveSubstance(drugDx.drug, latest, entries, medIngredient);
      const reactionText = drugDx.condition ?? undefined;
      const kind = classifyReaction(reactionText ?? desc);
      const arow: AllergyIntoleranceRow = {
        substance: sub,
        reaction_type: kind,
        mechanism: mechanismFor(sub, reactionText ?? desc, kind),
        criticality: kind === "serious_adverse_event" || /anaphyla|angioedema|bronchospasm|stevens|toxic epidermal/i.test(reactionText ?? desc)
          ? "high"
          : kind === "side_effect" && reactionText && SIDE.test(reactionText) ? "low" : "unknown",
        evidence: ev.slice(),
      };
      if (reactionText) arow.reaction = reactionText;
      if (onset) arow.onset = onset;
      if (sens.length) arow.sensitivity = sens.slice();
      mergeAllergy(allergyMap, arow);
      if (!drugDx.condition) continue; // T-code naming only the adverse effect
    }

    const row: ProblemRow = { condition: desc, status, evidence: ev };
    if (icd) row.icd10cm = icd;
    const sn = str(e.snomed);
    if (sn) row.snomed = sn;
    if (onset) row.onset = onset;
    if (sens.length) row.sensitivity = sens;
    probRows.push({ row, last: evs[evs.length - 1] });
  }
  // Merge rows for the same condition code (re-listed under another id): latest wins.
  const probByKey = new Map<string, { row: ProblemRow; last: Entry }>();
  for (const pr of probRows) {
    const k = pr.row.icd10cm ? `icd:${pr.row.icd10cm.toUpperCase()}` : `txt:${pr.row.condition.toLowerCase()}`;
    const prev = probByKey.get(k);
    if (!prev) { probByKey.set(k, pr); continue; }
    const [older, newer] = cmpEntry(prev.last, pr.last) <= 0 ? [prev, pr] : [pr, prev];
    for (const x of older.row.evidence) if (!newer.row.evidence.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id)) newer.row.evidence.push(x);
    if (!newer.row.onset && older.row.onset) newer.row.onset = older.row.onset;
    probByKey.set(k, newer);
  }
  // CKD staging: most recent clinician-recorded stage (problem list, visit or referral diagnoses).
  let ckd: { stage?: ProblemRow["ckd_stage"]; alb?: ProblemRow["albuminuria"]; at: Entry } | undefined;
  let alb: { alb: ProblemRow["albuminuria"]; at: Entry } | undefined;
  for (const x of entries) {
    if (x.e.type !== "problem_event" && x.e.type !== "billing_dx" && x.e.type !== "referral_dx") continue;
    if (x.e.type === "problem_event" && x.e.action === "remove") continue;
    const text = `${str(x.e.description) ?? ""} ${str(x.e.display) ?? ""}`;
    const st = ckdStage(str(x.e.icd10cm), text);
    if (st && (!ckd || cmpEntry(ckd.at, x) < 0)) ckd = { stage: st, at: x };
    const a = albCat(text);
    if (a && (!alb || cmpEntry(alb.at, x) < 0)) alb = { alb: a, at: x };
  }
  for (const { row } of probByKey.values()) {
    if (!isCkd(row.icd10cm, row.condition)) continue;
    if (ckd?.stage) {
      row.ckd_stage = ckd.stage;
      pushEv(row.evidence, ckd.at.item.id, ckd.at.id);
    }
    if (alb?.alb) {
      row.albuminuria = alb.alb;
      pushEv(row.evidence, alb.at.item.id, alb.at.id);
    }
  }
  out.problems = [...probByKey.values()].map((x) => x.row);
  out.allergies = [...allergyMap.values()];

  // ── Labs
  const labBest = new Map<string, Entry>();
  const rank = (s: unknown) => (s === "C" ? 3 : s === "F" ? 2 : s === "P" ? 1 : 0);
  for (const l of byType("imported_result")) {
    const e = l.e;
    if (!isObj(e.test)) continue;
    const ref = isObj(e.external_ref) ? e.external_ref : {};
    const k = str(ref.accession) && str(ref.result_code)
      ? `${ref.lab}|${ref.accession}|${ref.result_code}`
      : `${e.test.nfm_code}|${e.collected}|${e.test.name}`;
    const prev = labBest.get(k);
    if (!prev) { labBest.set(k, l); continue; }
    const rp = rank(prev.e.result_status), rn = rank(e.result_status);
    const later = instant(e.resulted) > instant(prev.e.resulted) || (instant(e.resulted) === instant(prev.e.resulted) && cmpEntry(prev, l) < 0);
    if (rn > rp || (rn === rp && later)) labBest.set(k, l);
  }
  for (const l of labBest.values()) {
    const e = l.e;
    if (rank(e.result_status) === 0) continue;
    const code = str(e.test.nfm_code) ?? "";
    const name = str(e.test.name) ?? "";
    const loinc = str(e.test.loinc);
    const comment = str(e.comment) ?? "";
    const analyte = analyteOf(code, name, loinc);
    if (!analyte) continue;
    if (/\b(result )?invalidated\b|entered in error|wrong patient|disregard|not performed|cancell?ed/i.test(String(e.value))) continue;
    if (e.result_status === "C" && /result (was )?invalidated|entered in error|wrong patient|disregard (this|previous)? ?result/i.test(comment.split(/CORRECTED/i).slice(1).join(" "))) continue;
    const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(e.value));
    if (!m) continue;
    if (analyte === "egfr" && isRaceVariant(code, name, loinc)) continue;
    const v = convertLab(analyte, Number(m[2]), str(e.unit) ?? "");
    if (v === undefined) continue;
    const collected = str(e.collected) ?? str(l.item.effective);
    if (!collected || !/T\d{2}:\d{2}/.test(collected)) continue;
    const row: LabResultRow = {
      analyte,
      value: v,
      unit: UNIT[analyte],
      collected: withOffset(collected),
      status: e.result_status === "P" ? "preliminary" : "final",
      evidence: [{ item_id: l.item.id, entry_id: l.id }],
    };
    if (m[1]) row.comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as LabResultRow["comparator"];
    if (analyte === "egfr") row.egfr_equation = egfrEquation(comment, name, loinc);
    if (loinc) row.loinc = loinc;
    out.labs.push(row);
  }

  // ── Vitals
  for (const v of byType("vital_set")) {
    const e = v.e;
    const vt = str(e.visit_id) ? visits.get(e.visit_id) : undefined;
    const setting: VitalRow["setting"] = vt === "telehealth" || vt === "phone" ? "home" : "clinic";
    const lt = v.eff && v.eff.time ? v.eff : toLocal(v.item.recorded);
    if (!lt || lt.date.length !== 10) continue;
    const row: VitalRow = { setting, local_time: `${lt.date}T${(lt.time ?? "00:00").slice(0, 5)}`, evidence: [{ item_id: v.item.id, entry_id: v.id }] };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const bp2 = parseBp(e.bp_repeat);
    if (bp2) { row.repeat_systolic_mmhg = bp2[0]; row.repeat_diastolic_mmhg = bp2[1]; }
    const p = num(e.pulse_bpm);
    if (p !== undefined && p > 0) row.pulse_bpm = p;
    const w = num(e.weight_lb);
    if (w !== undefined && w > 0) row.weight_kg = round(w * 0.45359237, 1);
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined && row.repeat_systolic_mmhg === undefined) continue;
    out.vitals.push(row);
  }
}

function normFreq(f: unknown, sig: unknown): MedicationRow["frequency"] | undefined {
  if (f === "QD" || f === "BID" || f === "TID" || f === "QHS" || f === "PRN") return f;
  if (f === "OTHER") {
    const s = typeof sig === "string" ? sig : "";
    if (/\b(once (a |per )?week|weekly|every week|q ?week|qw(k)?)\b/i.test(s)) return "QW";
    return "other";
  }
  return undefined;
}

function parseBp(v: unknown): [number, number] | undefined {
  if (typeof v !== "string") return undefined;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\b/.exec(v);
  return m ? [Number(m[1]), Number(m[2])] : undefined;
}

function drugSubstance(name: string): string {
  if (classOf(name)) return name.trim();
  return ingredientOf(name) ?? name.trim();
}

function mergeAllergy(map: Map<string, AllergyIntoleranceRow>, row: AllergyIntoleranceRow) {
  const k = row.substance.toLowerCase();
  const prev = map.get(k);
  if (!prev) { map.set(k, row); return; }
  for (const x of row.evidence) pushEv(prev.evidence, x.item_id, x.entry_id ?? "");
  if (!prev.reaction && row.reaction) prev.reaction = row.reaction;
  else if (prev.reaction && row.reaction && !prev.reaction.toLowerCase().includes(row.reaction.toLowerCase())) prev.reaction = `${prev.reaction}; ${row.reaction}`;
  const sev = { side_effect: 0, hypersensitivity: 1, serious_adverse_event: 2 } as const;
  if (sev[row.reaction_type] > sev[prev.reaction_type]) prev.reaction_type = row.reaction_type;
  if (row.criticality === "high" || prev.criticality === "unknown") prev.criticality = row.criticality === "unknown" ? prev.criticality : row.criticality;
  if (!prev.onset && row.onset) prev.onset = row.onset;
  if (row.sensitivity) for (const s of row.sensitivity) { prev.sensitivity = prev.sensitivity ?? []; addSens(prev.sensitivity, s); }
}

/** A diagnosis attributed to a drug: drug text and the condition (null for a bare T-code adverse effect). */
function drugCause(desc: string, icd: string | undefined): { drug: string; condition: string | null } | undefined {
  const tcode = !!icd && /^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/i.test(icd);
  const ae = /^\s*adverse effect of\s+(.+?)(?:,\s*(?:initial|subsequent|sequela).*)?\s*$/i.exec(desc);
  if (ae) return { drug: ae[1].trim(), condition: null };
  let m = /^(.+?)[- ](?:associated|induced|related)\s+(.+)$/i.exec(desc);
  if (m && plausibleDrug(m[1])) return { drug: m[1].trim(), condition: desc.trim() };
  m = /^(.+?)\s+(?:due to|secondary to|caused by|from|attributed to)\s+(.+)$/i.exec(desc);
  if (m && plausibleDrug(m[2])) return { drug: m[2].replace(/\s*(use|therapy|treatment)$/i, "").trim(), condition: desc.trim() };
  if (tcode) {
    const cls = TCODE_CLASS.find((t) => icd!.toUpperCase().startsWith(t[0]));
    return { drug: cls ? cls[1] : desc, condition: /adverse effect/i.test(desc) ? null : desc };
  }
  return undefined;
}

const TCODE_CLASS: [string, string][] = [
  ["T46.4", "ACE inhibitor"], ["T38.3", "insulin and oral hypoglycemic drugs"], ["T46.5", "antihypertensive drugs"],
  ["T50.1", "loop diuretics"], ["T50.2", "thiazide diuretics"], ["T46.6", "antihyperlipidemic drugs"],
  ["T39.3", "NSAID"], ["T36.0", "penicillins"], ["T37.0", "sulfonamides"], ["T40.2", "opioids"],
];

function plausibleDrug(t: string): boolean {
  const s = t.trim().toLowerCase().replace(/\s*(use|therapy|treatment)$/, "");
  if (!s || /^(drug|medication|medicine|alcohol|alcoholic|diabetes|diabetic|hypertensive|smoking|tobacco)$/.test(s)) return false;
  if (classOf(s)) return true;
  const ing = ingredientOf(s);
  if (!ing) return false;
  return !!BRANDS[s] || Object.values(BRANDS).includes(ing) || DRUGLIKE.test(ing) || /^insulin\b/.test(ing);
}

function resolveSubstance(drug: string, at: Entry, entries: Entry[], medIngredient: Map<string, string>): string {
  const member = classOf(drug);
  if (!member) return ingredientOf(drug) ?? drug.trim();
  const found = new Set<string>();
  for (const x of entries) {
    if (x.item !== at.item) continue;
    if (x.e.type === "med_event" && isObj(x.e.drug)) {
      const ing = ingredientOf(str(x.e.drug.name));
      if (ing && member.test(ing)) found.add(ing);
    }
    if (x.e.type === "list_reviewed" && x.e.list === "medications" && Array.isArray(x.e.lines_on_list)) {
      for (const mid of x.e.lines_on_list) {
        const ing = typeof mid === "string" ? medIngredient.get(mid) : undefined;
        if (ing && member.test(ing)) found.add(ing);
      }
    }
  }
  if (found.size === 1) return [...found][0];
  return drug.trim();
}

function isCkd(icd: string | undefined, text: string): boolean {
  return (!!icd && /^N18/i.test(icd)) || /chronic kidney disease|\bckd\b/i.test(text);
}

function ckdStage(icd: string | undefined, text: string): ProblemRow["ckd_stage"] | undefined {
  if (!isCkd(icd, text) && !/\bG[1-5]\b|G3[ab]/.test(text)) return undefined;
  const c = (icd ?? "").toUpperCase();
  const byCode: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
  if (byCode[c]) return byCode[c];
  if (!isCkd(icd, text)) return undefined;
  const g = /\bG(1|2|3a|3b|4|5)\b/i.exec(text);
  if (g) return (`G${g[1].toLowerCase()}`) as ProblemRow["ckd_stage"];
  const s = /stage\s*(1|2|3a|3b|4|5|i{1,3}a?|i{1,3}b?|iv|v)\b/i.exec(text);
  if (s) {
    const m: Record<string, ProblemRow["ckd_stage"]> = { "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5", i: "G1", ii: "G2", iiia: "G3a", iiib: "G3b", iv: "G4", v: "G5" };
    return m[s[1].toLowerCase()];
  }
  if (/end[- ]stage/i.test(text)) return "G5";
  return undefined;
}

function albCat(text: string): ProblemRow["albuminuria"] | undefined {
  if (!/chronic kidney disease|\bckd\b|albuminuria|G[1-5]/i.test(text)) return undefined;
  const m = /\bA([123])\b/.exec(text);
  return m ? (`A${m[1]}` as ProblemRow["albuminuria"]) : undefined;
}

function icdSensitivity(icd: string | undefined, desc: string, sens: Sensitivity[]) {
  const c = (icd ?? "").toUpperCase();
  if (/^F1[0-9]/.test(c) && !/^F17/.test(c)) addSens(sens, "substance-use");
  else if (/^F/.test(c)) addSens(sens, "mental-health");
  if (/^(B20|Z21|B97\.35|A5[0-9]|A6[0-4]|Z20\.6)/.test(c) || /\bhiv\b/i.test(desc)) addSens(sens, "hiv-sti");
  if (/^(O\d|Z3[0-9]\.|Z30|N97)/.test(c)) addSens(sens, "sexual-reproductive-health");
}
