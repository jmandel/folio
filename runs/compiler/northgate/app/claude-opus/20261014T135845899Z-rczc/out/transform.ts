// Northgate Family Medicine (northgate-chart-v1) -> consumer views v2.
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

// ───────────────────────────── time helpers ─────────────────────────────

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;
const DATE_ONLY = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const LOCAL_DT = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/;

let fmt: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number): { date: string; time: string } | null {
  try {
    if (!fmt) {
      fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      });
    }
    const p: Record<string, string> = {};
    for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = part.value;
    const hour = p.hour === "24" ? "00" : p.hour;
    return { date: `${p.year}-${p.month}-${p.day}`, time: `${hour}:${p.minute}` };
  } catch {
    return null;
  }
}

/** Local (Chicago) date of a timestamp or date string; partial dates are returned as written. */
function localDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (DATE_ONLY.test(t)) return t;
  if (HAS_ZONE.test(t)) {
    const ms = Date.parse(t);
    if (isNaN(ms)) return undefined;
    return chicagoParts(ms)?.date;
  }
  const m = LOCAL_DT.exec(t);
  return m ? m[1] : undefined;
}

/** Local (Chicago) wall-clock `YYYY-MM-DDTHH:MM`; zone-less date-times are reported as written. */
function localDateTime(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (HAS_ZONE.test(t)) {
    const ms = Date.parse(t);
    if (isNaN(ms)) return undefined;
    const p = chicagoParts(ms);
    return p ? `${p.date}T${p.time}` : undefined;
  }
  const m = LOCAL_DT.exec(t);
  return m ? `${m[1]}T${m[2]}:${m[3]}` : undefined;
}

/** Approximate instant for ordering. Zone-less values are taken as Chicago standard time. */
function instant(s: unknown): number {
  if (typeof s !== "string") return NaN;
  const t = s.trim();
  if (HAS_ZONE.test(t)) return Date.parse(t);
  if (DATE_ONLY.test(t)) {
    const full = t.length === 4 ? `${t}-01-01` : t.length === 7 ? `${t}-01` : t;
    return Date.parse(`${full}T00:00:00-06:00`);
  }
  const m = LOCAL_DT.exec(t);
  return m ? Date.parse(`${m[1]}T${m[2]}:${m[3]}:00-06:00`) : NaN;
}

function hasTime(s: unknown): boolean {
  return typeof s === "string" && /T\d{2}:\d{2}/.test(s);
}

// ───────────────────────────── generic helpers ─────────────────────────────

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}
function num(v: unknown): number | undefined {
  return typeof v === "number" && isFinite(v) ? v : undefined;
}
function clean(n: number): number {
  return parseFloat(n.toPrecision(12));
}
function round(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}

function partialFromFuzzy(f: unknown): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f !== "object") return undefined;
  const o = f as Record<string, unknown>;
  const d = str(o.date);
  if (!d || !/^\d{4}(-\d{2}(-\d{2})?)?/.test(d)) return undefined;
  const p = o.precision;
  if (p === "year") return { value: d.slice(0, 4), precision: "year" };
  if (p === "month" && d.length >= 7) return { value: d.slice(0, 7), precision: "month" };
  if (p === "day" && d.length >= 10) return { value: d.slice(0, 10), precision: "day" };
  // Unknown precision: keep what the string itself carries.
  const v = d.slice(0, 10);
  return { value: v, precision: v.length === 4 ? "year" : v.length === 7 ? "month" : "day" };
}

function restrictionSensitivity(r: unknown): Sensitivity[] {
  return r === "BH" ? ["mental-health"] : [];
}

function icdSensitivity(icd: string | undefined): Sensitivity[] {
  if (!icd) return [];
  const c = icd.toUpperCase();
  const out: Sensitivity[] = [];
  if (/^F1[0-9]/.test(c)) out.push("substance-use");
  else if (/^F(0[4-9]|[2-9])/.test(c)) out.push("mental-health");
  if (/^(B2[0-4]|Z21|A5[0-9]|A6[0-4])/.test(c)) out.push("hiv-sti");
  if (/^(O|Z3[0-9])/.test(c)) out.push("sexual-reproductive-health");
  return out;
}

function uniqSens(list: Sensitivity[]): Sensitivity[] | undefined {
  const s = Array.from(new Set(list)).sort();
  return s.length ? s : undefined;
}

interface Ev {
  item: FolioItem;
  entryId: string;
  entry: Record<string, any>;
}

/** Order events by `effective` (local date, then time when both have one), then `recorded`, then id. */
function cmpEv(a: Ev, b: Ev): number {
  const da = localDate(a.item.effective) ?? "";
  const db = localDate(b.item.effective) ?? "";
  if (da !== db) return da < db ? -1 : 1;
  if (hasTime(a.item.effective) && hasTime(b.item.effective)) {
    const ia = instant(a.item.effective);
    const ib = instant(b.item.effective);
    if (!isNaN(ia) && !isNaN(ib) && ia !== ib) return ia - ib;
  }
  const ra = instant(a.item.recorded);
  const rb = instant(b.item.recorded);
  if (!isNaN(ra) && !isNaN(rb) && ra !== rb) return ra - rb;
  if (a.item.id !== b.item.id) return a.item.id < b.item.id ? -1 : 1;
  return a.entryId < b.entryId ? -1 : a.entryId > b.entryId ? 1 : 0;
}

function evidenceOf(evs: Ev[]): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const e of evs) {
    const k = e.item.id + "\u0000" + e.entryId;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: e.item.id, entry_id: e.entryId });
  }
  return out;
}

// ───────────────────────────── drug names ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  steglatro: "ertugliflozin",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  semglee: "insulin glargine",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  humalog: "insulin lispro",
  admelog: "insulin lispro",
  lyumjev: "insulin lispro",
  novolog: "insulin aspart",
  fiasp: "insulin aspart",
  apidra: "insulin glulisine",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  trulicity: "dulaglutide",
  victoza: "liraglutide",
  saxenda: "liraglutide",
  mounjaro: "tirzepatide",
  zepbound: "tirzepatide",
  byetta: "exenatide",
  januvia: "sitagliptin",
  tradjenta: "linagliptin",
  glucophage: "metformin",
  glucotrol: "glipizide",
  amaryl: "glimepiride",
  actos: "pioglitazone",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  zocor: "simvastatin",
  pravachol: "pravastatin",
  zetia: "ezetimibe",
  cozaar: "losartan",
  diovan: "valsartan",
  benicar: "olmesartan",
  avapro: "irbesartan",
  micardis: "telmisartan",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  vasotec: "enalapril",
  altace: "ramipril",
  lotensin: "benazepril",
  norvasc: "amlodipine",
  lasix: "furosemide",
  bumex: "bumetanide",
  demadex: "torsemide",
  microzide: "hydrochlorothiazide",
  aldactone: "spironolactone",
  inspra: "eplerenone",
  kerendia: "finerenone",
  entresto: "sacubitril / valsartan",
  toprol: "metoprolol",
  "toprol-xl": "metoprolol",
  lopressor: "metoprolol",
  coreg: "carvedilol",
  tenormin: "atenolol",
  synthroid: "levothyroxine",
  levoxyl: "levothyroxine",
  zoloft: "sertraline",
  lexapro: "escitalopram",
  celexa: "citalopram",
  prozac: "fluoxetine",
  paxil: "paroxetine",
  wellbutrin: "bupropion",
  effexor: "venlafaxine",
  cymbalta: "duloxetine",
  remeron: "mirtazapine",
  trazodone: "trazodone",
  eliquis: "apixaban",
  xarelto: "rivaroxaban",
  coumadin: "warfarin",
  plavix: "clopidogrel",
  neurontin: "gabapentin",
  lyrica: "pregabalin",
  flomax: "tamsulosin",
  prilosec: "omeprazole",
  protonix: "pantoprazole",
  nexium: "esomeprazole",
  zyloprim: "allopurinol",
  uloric: "febuxostat",
  tylenol: "acetaminophen",
  advil: "ibuprofen",
  motrin: "ibuprofen",
  aleve: "naproxen",
  veltassa: "patiromer",
  lokelma: "sodium zirconium cyclosilicate",
};

const SALT_WORDS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "succinate", "tartrate",
  "calcium", "magnesium", "mesylate", "fumarate", "citrate", "sulfate", "acetate", "bromide",
  "monohydrate", "dihydrate", "trihydrate", "anhydrous", "hyclate", "bitartrate", "phosphate",
  "disodium", "dipotassium", "hydrobromide", "propionate", "furoate", "xinafoate", "decanoate",
  "medoxomil", "camsylate", "estolate", "stearate", "lactate", "gluconate", "carbonate",
]);

const FORM_WORDS = /\b(oral|tablet|tablets|capsule|capsules|extended|release|delayed|chewable|solution|suspension|injection|injectable|pen|injector|prefilled|syringe|cartridge|topical|cream|ointment|patch|inhaler|inhalation|nasal|spray|ophthalmic|drops|er|xr|sr|dr|ec|odt)\b.*$/i;

function stripSalts(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return name;
  // Keep the first word always (e.g. "potassium chloride", "sodium bicarbonate").
  let end = words.length;
  while (end > 1 && SALT_WORDS.has(words[end - 1])) end--;
  return words.slice(0, end).join(" ");
}

function ingredientPart(part: string): string | undefined {
  let s = part.toLowerCase().trim();
  s = s.replace(/^\d+(\.\d+)?\s*(ml|mg|actuat|hr)\s+/, ""); // leading quantity, e.g. "3 ML ..."
  s = s.replace(/\(.*?\)/g, " ").replace(/\[.*?\]/g, " ");
  const numAt = s.search(/\s\d|^\d/);
  if (numAt >= 0) s = s.slice(0, numAt);
  s = s.replace(FORM_WORDS, "").replace(/[,;:]+$/, "").replace(/\s+/g, " ").trim();
  if (!s) return undefined;
  const brand = BRANDS[s] ?? BRANDS[s.split(" ")[0]];
  if (brand) return brand;
  return stripSalts(s);
}

/** Generic ingredient, lower case, from a display name. */
function ingredientFromName(name: string): string | undefined {
  // SBD form "generic 10 MG Oral Tablet [Brand]": the generic is in front.
  const parts = name.split(/\s\/\s/);
  const ings = parts.map(ingredientPart).filter((x): x is string => !!x);
  if (!ings.length) {
    const br = /\[([^\]]+)\]/.exec(name);
    if (br) {
      const b = BRANDS[br[1].toLowerCase().trim()];
      if (b) return b;
    }
    return undefined;
  }
  return Array.from(new Set(ings)).join(" / ");
}

// ───────────────────────────── drug classes (for drug-caused diagnoses) ─────────────────────────────

const CLASSES: { re: RegExp; members: string[] }[] = [
  { re: /\bsglt-?2\b|sodium[- ]glucose co-?transporter/i, members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin"] },
  { re: /\bace[- ]?inhibitor|\bacei\b|angiotensin[- ]converting[- ]enzyme/i, members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"] },
  { re: /\barbs?\b|angiotensin (ii )?receptor blocker/i, members: ["losartan", "valsartan", "olmesartan", "irbesartan", "telmisartan", "candesartan", "azilsartan"] },
  { re: /\bstatins?\b|hmg-?coa/i, members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"] },
  { re: /\bglp-?1\b/i, members: ["semaglutide", "dulaglutide", "liraglutide", "exenatide", "tirzepatide"] },
  { re: /\bnsaids?\b|non-?steroidal/i, members: ["ibuprofen", "naproxen", "meloxicam", "diclofenac", "celecoxib", "indomethacin", "ketorolac"] },
  { re: /\bsulfonylureas?\b/i, members: ["glipizide", "glimepiride", "glyburide"] },
  { re: /\bthiazides?\b/i, members: ["hydrochlorothiazide", "chlorthalidone", "indapamide"] },
  { re: /\bpenicillins?\b/i, members: ["penicillin", "amoxicillin", "ampicillin"] },
  { re: /\bsulfonamides?\b|\bsulfa\b/i, members: ["sulfamethoxazole"] },
];

const KNOWN_DRUGS = new Set<string>([
  ...Object.values(BRANDS),
  ...CLASSES.flatMap((c) => c.members),
  "metformin", "insulin", "furosemide", "spironolactone", "amlodipine", "trimethoprim", "allopurinol",
  "lithium", "warfarin", "heparin", "codeine", "morphine", "contrast",
]);

interface DrugRef {
  substance: string;
  isClass: boolean;
  classMembers?: string[];
}

function resolveDrugPhrase(phrase: string): DrugRef | undefined {
  const p = phrase.trim().replace(/^(the|an?)\s+/i, "");
  if (!p) return undefined;
  const lower = p.toLowerCase();
  const ing = ingredientPart(lower);
  if (ing && (KNOWN_DRUGS.has(ing) || BRANDS[lower])) return { substance: ing, isClass: false };
  for (const w of lower.split(/[\s-]+/)) {
    if (BRANDS[w]) return { substance: BRANDS[w], isClass: false };
    if (KNOWN_DRUGS.has(w)) return { substance: w, isClass: false };
  }
  for (const c of CLASSES) if (c.re.test(p)) return { substance: p, isClass: true, classMembers: c.members };
  return undefined;
}

interface DrugCause {
  drug: DrugRef;
  condition: string;
  /** True when the entry names only the adverse effect, no condition. */
  effectOnly: boolean;
}

function drugCause(description: string, icd: string | undefined): DrugCause | undefined {
  const d = description.trim();
  const tcode = !!icd && /^T(3[6-9]|4\d|50)\.?\w{2}5/i.test(icd.replace(/\s/g, ""));
  const ae = /^(?:adverse (?:effect|reaction)|allerg(?:y|ic reaction)|intolerance)\s+(?:of|to)\s+(.+?)(?:\s*,\s*(.+))?$/i.exec(d);
  if (ae) {
    const drug = resolveDrugPhrase(ae[1]);
    if (drug) return { drug, condition: ae[2]?.trim() || d, effectOnly: !ae[2] };
    if (tcode) return { drug: { substance: ae[1].trim(), isClass: false }, condition: d, effectOnly: true };
  }
  const assoc = /^(.*?)[\s-]+(?:associated|induced|related)\s*(.*)$/i.exec(d);
  if (assoc) {
    const before = assoc[1];
    const after = assoc[2].trim();
    const lastClause = before.split(/[,;(]/).pop() ?? before;
    const drug = resolveDrugPhrase(lastClause);
    if (drug) {
      const cond = after || before.slice(0, before.length - lastClause.length).replace(/[,;(\s]+$/, "").trim() || d;
      return { drug, condition: cond, effectOnly: false };
    }
  }
  const due = /^(.*?)\s+(?:due to|secondary to|caused by|from)\s+(.+?)\)?$/i.exec(d);
  if (due) {
    const drug = resolveDrugPhrase(due[2].replace(/\b(use|therapy|treatment)\b.*$/i, ""));
    if (drug) return { drug, condition: due[1].trim() || d, effectOnly: false };
  }
  if (tcode) {
    // T-code adverse effect without a recognizable phrase: keep the code's text as the substance hint.
    const m = /\bof\s+(.+)$/i.exec(d);
    if (m) {
      const drug = resolveDrugPhrase(m[1]) ?? { substance: m[1].trim(), isClass: false };
      return { drug, condition: d, effectOnly: /^adverse effect/i.test(d) };
    }
  }
  return undefined;
}

const HYPERSENSITIVITY = /\b(hives|urticaria|rash|angioedema|anaphyla\w*|bronchospasm|wheez\w*|throat (swelling|tightness)|swelling of (the )?(lips?|tongue|face|throat)|lip swelling|tongue swelling|facial swelling|stevens|sjs|toxic epidermal|dress|pruritus|itch\w*|exanthem\w*|erythema multiforme|serum sickness)\b/i;
const SERIOUS = /\b(ketoacidosis|acidosis|hyperkalemia|kidney injury|renal failure|\baki\b|pancreatitis|rhabdomyolysis|agranulocytosis|neutropenia|thrombocytopenia|hepatotoxicity|liver injury|hepatitis|hypoglycemia|bleed\w*|hemorrhage|qt prolongation|torsade\w*|seizure\w*|fournier|gangrene|necrotizing)\b/i;
const SIDE_EFFECT = /\b(cough|myalgia|muscle (aches?|pain)|nausea|vomiting|diarrh\w*|gi upset|upset stomach|dyspepsia|constipation|headache|dizz\w*|fatigue|edema|flushing|insomnia|drowsiness|somnolence|yeast|mycotic|genital infection|uti)\b/i;

function reactionTypeFromText(text: string): AllergyIntoleranceRow["reaction_type"] | undefined {
  if (HYPERSENSITIVITY.test(text)) return "hypersensitivity";
  if (SERIOUS.test(text)) return "serious_adverse_event";
  if (SIDE_EFFECT.test(text)) return "side_effect";
  return undefined;
}

function isAceInhibitor(substance: string): boolean {
  const s = substance.toLowerCase();
  return CLASSES[1].re.test(s) || CLASSES[1].members.some((m) => s.includes(m));
}

function mechanismFor(substance: string, text: string, sourceType: string | undefined): AllergyIntoleranceRow["mechanism"] {
  if (isAceInhibitor(substance) && /\b(cough|angioedema|swelling)\b/i.test(text)) return "non_immune";
  if (/\b(ketoacidosis|lactic acidosis|hyperkalemia)\b/i.test(text)) return "non_immune";
  if (sourceType === "intolerance" || sourceType === "adverse_reaction") return "non_immune";
  if (sourceType === "allergy") return "immune";
  return "unknown";
}

// ───────────────────────────── labs ─────────────────────────────

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "62238-1": "egfr", "88293-6": "egfr",
  "88294-4": "egfr", "98979-8": "egfr", "50044-7": "egfr", "69405-9": "egfr", "77147-7": "egfr",
  "50210-4": "egfr", "50384-7": "egfr", "76633-7": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "39789-3": "potassium",
  "2951-2": "sodium", "2947-0": "sodium", "39791-9": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap",
  "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose", "41653-7": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "62388-4": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "13705-9": "uacr", "14958-3": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "804-5": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin",
  "53060-9": "bhb", "33428-4": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2753-2": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "2020-6": "pco2",
  "3040-3": "lipase", "1990-2": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin", "16255-2": "troponin",
  "2093-3": "cholesterol",
  "2571-8": "triglycerides",
  "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "96259-7": "ldl",
};

const CODE_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", CREA: "creatinine",
  K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", HCO3: "bicarbonate", BICARB: "bicarbonate", TCO2: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", ANGAP: "anion_gap",
  BUN: "bun", UREAN: "bun",
  GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose",
  A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", MALBCR: "uacr", "MALB-CR": "uacr", ALBCR: "uacr",
  PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase",
  TROP: "troponin", TROPI: "troponin", TNI: "troponin", TROPONIN: "troponin",
  CHOL: "cholesterol", TCHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides",
  HDL: "hdl", LDL: "ldl", LDLC: "ldl", "LDL-C": "ldl", HDLC: "hdl", "HDL-C": "hdl",
};

function analyteFromName(name: string): Analyte | undefined {
  const n = name.toLowerCase();
  if (/\begfr\b|glomerular filtration/.test(n)) return "egfr";
  if (/albumin.*creat|\buacr\b|\bacr\b|microalb/.test(n)) return "uacr";
  if (/\ba1c\b|glycated|glycosylated/.test(n)) return "a1c";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/creatinine/.test(n)) return "creatinine";
  if (/potassium/.test(n)) return "potassium";
  if (/sodium/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/bicarbonate|\bco2\b|carbon dioxide/.test(n) && !/pco2|partial/.test(n)) return "bicarbonate";
  if (/pco2|partial pressure.*carbon/.test(n)) return "pco2";
  if (/hydroxybutyrate|\bbhb\b/.test(n)) return "bhb";
  if (/\bph\b/.test(n)) return "ph";
  if (/glucose/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/white (blood )?cell|\bwbc\b|leukocyte/.test(n)) return "wbc";
  if (/hemoglobin|\bhgb\b/.test(n)) return "hemoglobin";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n)) return "troponin";
  if (/\bhdl\b/.test(n)) return "hdl";
  if (/\bldl\b/.test(n)) return "ldl";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n)) return "cholesterol";
  return undefined;
}

const ANALYTE_UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

/** Factor that converts a value in `unit` to the analyte's target unit, or undefined if unknown. */
function unitFactor(analyte: Analyte, unitRaw: string): number | undefined {
  const u = unitRaw.toLowerCase().replace(/\s+/g, "").replace(/µ|μ/g, "u");
  const mmol = u === "mmol/l" || u === "meq/l";
  switch (analyte) {
    case "creatinine":
      if (u === "mg/dl") return 1;
      if (u === "umol/l") return 1 / 88.42;
      return undefined;
    case "egfr":
      return u.startsWith("ml/min") ? 1 : undefined;
    case "potassium":
    case "sodium":
    case "chloride":
    case "bicarbonate":
    case "anion_gap":
    case "bhb":
      return mmol ? 1 : undefined;
    case "bun":
      if (u === "mg/dl") return 1;
      if (u === "mmol/l") return 2.801;
      return undefined;
    case "glucose":
      if (u === "mg/dl") return 1;
      if (u === "mmol/l") return 18.016;
      return undefined;
    case "a1c":
      return u === "%" || u.startsWith("%of") || u === "%hba1c" ? 1 : undefined;
    case "uacr":
      return u.startsWith("mg/g") || u === "ug/mg" || u === "mcg/mg" ? 1 : undefined;
    case "platelets":
    case "wbc":
      if (/^(cells|cell)\/(ul|mm3)$/.test(u) || u === "/ul" || u === "/mm3") return 1 / 1000;
      if (/^(k|thou|10\*3|10\^3|x10e3|x10\^3|10e3|x10\*3|10x3)\/(ul|mm3)$/.test(u)) return 1;
      if (/^(10\*9|10\^9|x10e9|x10\^9|10e9)\/l$/.test(u)) return 1;
      return undefined;
    case "hemoglobin":
      if (u === "g/dl") return 1;
      if (u === "g/l") return 0.1;
      return undefined;
    case "ph":
      return u === "" || u === "ph" || u === "[ph]" ? 1 : undefined;
    case "pco2":
      return u === "mmhg" || u === "mm[hg]" ? 1 : undefined;
    case "lipase":
      return u === "u/l" || u === "iu/l" ? 1 : undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return 1;
      if (u === "ng/l" || u === "pg/ml") return 1 / 1000;
      return undefined;
    case "cholesterol":
    case "hdl":
    case "ldl":
      if (u === "mg/dl") return 1;
      if (u === "mmol/l") return 38.67;
      return undefined;
    case "triglycerides":
      if (u === "mg/dl") return 1;
      if (u === "mmol/l") return 88.57;
      return undefined;
  }
  return undefined;
}

function parseResultValue(v: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  if (typeof v === "number" && isFinite(v)) return { value: v };
  if (typeof v !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(v);
  if (!m) return undefined;
  const value = parseFloat(m[2]);
  if (!isFinite(value)) return undefined;
  return m[1] ? { value, comparator: m[1] as "<" | ">" | "<=" | ">=" } : { value };
}

function egfrEquation(e: Record<string, any>): LabResultRow["egfr_equation"] {
  const fromText = (t: unknown): LabResultRow["egfr_equation"] | undefined => {
    if (typeof t !== "string") return undefined;
    const s = t.toLowerCase();
    if (/ckd[- ]?epi[^.;]*2021|2021[^.;]*ckd[- ]?epi|race[- ]free/.test(s)) return "ckd-epi-2021";
    if (/ckd[- ]?epi[^.;]*2009|2009[^.;]*ckd[- ]?epi/.test(s)) return "ckd-epi-2009";
    if (/\bmdrd\b/.test(s)) return "mdrd";
    return undefined;
  };
  const test = e.test ?? {};
  const fromComment = fromText(e.comment);
  if (fromComment) return fromComment;
  const fromName = fromText(test.name);
  if (fromName) return fromName;
  const rc = String(e.external_ref?.result_code ?? "").toUpperCase();
  if (/EGFR09/.test(rc)) return "ckd-epi-2009";
  if (/EGFR21/.test(rc)) return "ckd-epi-2021";
  const code = String(test.nfm_code ?? "").toUpperCase();
  if (/(09|2009)/.test(code)) return "ckd-epi-2009";
  if (/(21|2021)/.test(code)) return "ckd-epi-2021";
  if (/MDRD/.test(code)) return "mdrd";
  const loinc = String(test.loinc ?? "");
  if (loinc === "98979-8") return "ckd-epi-2021";
  if (loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  if (loinc === "48642-3" || loinc === "48643-1" || loinc === "33914-3") return "mdrd";
  return "unknown";
}

/** True for the race-specific "African American / Black" eGFR variant. */
function isRaceVariant(e: Record<string, any>): boolean {
  const test = e.test ?? {};
  const name = String(test.name ?? "").toLowerCase();
  const code = String(test.nfm_code ?? "").toUpperCase();
  const rc = String(e.external_ref?.result_code ?? "").toUpperCase();
  const loinc = String(test.loinc ?? "");
  if (/non[- ]?(african|black)/.test(name)) return false;
  if (/african|black/.test(name)) return true;
  if (code === "EGFR-AA" || /-AA$/.test(code)) return true;
  if (loinc === "48643-1" || loinc === "88293-6") return true;
  if (/EGFR\d*A$/.test(rc)) return true;
  return false;
}

function isUrineOrPoc(name: string, analyte: Analyte): boolean {
  const n = name.toLowerCase();
  if (analyte === "uacr") return false;
  if (/\burine\b|\bur\b|\bcsf\b|fluid/.test(n)) return true;
  if (analyte === "glucose" && /\bpoc\b|point[- ]of[- ]care|meter|fingerstick/.test(n)) return true;
  return false;
}

// ───────────────────────────── the transform ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items)) return out;

  // Scope: recorded on or before the end of asOf (Chicago).
  const inScope: FolioItem[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const rd = localDate(it.recorded);
    if (!rd || rd.length < 10) continue;
    if (typeof asOf === "string" && /^\d{4}-\d{2}-\d{2}$/.test(asOf) && rd > asOf) continue;
    inScope.push(it);
  }

  // Corrections: supersedes / retracts (and the void entry's own list), same issuer.
  const dead = new Set<string>();
  for (const it of inScope) {
    const key = (id: unknown) => {
      if (typeof id === "string") dead.add(it.issuer + "\u0000" + id);
    };
    if (Array.isArray(it.supersedes)) it.supersedes.forEach(key);
    if (Array.isArray(it.retracts)) it.retracts.forEach(key);
    const pl = it.payload && typeof it.payload === "object" ? it.payload : {};
    for (const e of Object.values(pl)) {
      if (e && typeof e === "object" && (e as any).type === "chart_correction" && Array.isArray((e as any).voided_items)) {
        (e as any).voided_items.forEach(key);
      }
    }
  }
  const current = inScope.filter((it) => !dead.has(it.issuer + "\u0000" + it.id));

  const byType: Record<string, Ev[]> = {};
  for (const it of current) {
    const pl = it.payload && typeof it.payload === "object" ? it.payload : {};
    for (const [entryId, entry] of Object.entries(pl)) {
      if (!entry || typeof entry !== "object") continue;
      const t = (entry as any).type;
      if (typeof t !== "string") continue;
      (byType[t] ??= []).push({ item: it, entryId, entry: entry as Record<string, any> });
    }
  }

  try {
    out.medications = mapMedications(byType["med_event"] ?? []);
  } catch {
    out.medications = [];
  }
  let derivedAllergies: { row: AllergyIntoleranceRow; key: string }[] = [];
  try {
    const r = mapProblems(byType["problem_event"] ?? [], byType);
    out.problems = r.problems;
    derivedAllergies = r.allergies;
  } catch {
    out.problems = [];
  }
  try {
    out.allergies = mapAllergies(byType["allergy_event"] ?? [], derivedAllergies);
  } catch {
    out.allergies = [];
  }
  try {
    out.labs = mapLabs(byType["imported_result"] ?? []);
  } catch {
    out.labs = [];
  }
  try {
    out.vitals = mapVitals(byType["vital_set"] ?? []);
  } catch {
    out.vitals = [];
  }
  return out;
}

// ───────────────────────────── medications ─────────────────────────────

const FREQ: Record<string, MedicationRow["frequency"]> = {
  QD: "QD", BID: "BID", TID: "TID", QHS: "QHS", PRN: "PRN", QW: "QW",
};

function medDose(e: Record<string, any>, name: string): MedicationRow["dose"] | undefined {
  const d = e.dose;
  if (!d || typeof d !== "object") return undefined;
  const value = num(d.value);
  const unitRaw = str(d.unit)?.toLowerCase();
  if (value === undefined || !unitRaw) return undefined;
  if (unitRaw === "mg") return { value, unit: "mg" };
  if (unitRaw === "mcg" || unitRaw === "ug" || unitRaw === "µg") return { value, unit: "mcg" };
  if (/^(units?|unt|u|iu|\[iu\])$/.test(unitRaw)) return { value, unit: "units" };
  if (unitRaw === "ml") return { value, unit: "mL" };
  if (/^(tab|tabs|tablet|tablets|cap|caps|capsule|capsules)$/.test(unitRaw)) {
    // Single-ingredient solid with one stated strength -> express as mass.
    if (!/\s\/\s/.test(name) && /(tablet|capsule)/i.test(name)) {
      const strengths = Array.from(name.matchAll(/(\d+(?:\.\d+)?)\s*(MG|MCG)\b(?!\s*\/)/gi));
      if (strengths.length === 1) {
        const s = parseFloat(strengths[0][1]);
        const u = strengths[0][2].toLowerCase() === "mg" ? "mg" : "mcg";
        if (isFinite(s)) return { value: clean(value * s), unit: u };
      }
    }
    return { value, unit: "tablet" };
  }
  return undefined;
}

function medFrequency(e: Record<string, any>): MedicationRow["frequency"] | undefined {
  const f = str(e.frequency)?.toUpperCase();
  if (!f) return undefined;
  if (FREQ[f]) return FREQ[f];
  if (f === "OTHER") {
    const sig = str(e.sig)?.toLowerCase() ?? "";
    if (/\b(once (a|per|every) week|weekly|every week|every 7 days|q ?week|qw(k)?)\b/.test(sig)) return "QW";
    return "other";
  }
  return undefined;
}

function isHospitalOnly(e: Record<string, any>): boolean {
  const name = String(e.drug?.name ?? "");
  const sig = String(e.sig ?? "");
  return /\b(intravenous(ly)?|iv (infusion|push|piggyback)|infusion|\bIVPB\b)\b/i.test(sig) || /\bIV\b|infusion|in 0\.9 ?% sodium chloride|IVPB/i.test(name) || /^\s*(sodium chloride 0\.9|lactated ringer|dextrose \d+ ?%)/i.test(name);
}

function mapMedications(events: Ev[]): MedicationRow[] {
  const lines = new Map<string, Ev[]>();
  for (const ev of events) {
    const id = str(ev.entry.med_id);
    if (!id) continue;
    if (!lines.has(id)) lines.set(id, []);
    lines.get(id)!.push(ev);
  }

  interface Built {
    row: MedicationRow;
    last: Ev;
    key: string;
  }
  const built: Built[] = [];
  for (const [, evs] of lines) {
    evs.sort(cmpEv);
    let status: MedicationRow["status"] | undefined;
    let since: string | undefined;
    for (const ev of evs) {
      const a = ev.entry.action;
      const d = localDate(ev.item.effective);
      if (a === "start") {
        status = "active";
        since = d;
      } else if (a === "resume") {
        status = "active";
        since = d;
      } else if (a === "hold") {
        status = "held";
        since = d;
      } else if (a === "stop") {
        status = "stopped";
        since = d;
      } else if (a === "change") {
        // A change does not end a hold; on a line whose start we never saw, the line is active.
        if (status === undefined) {
          status = "active";
          since = undefined;
        }
      }
    }
    if (!status) continue;
    const last = evs[evs.length - 1];
    // Drug details from the latest event that restates the line (every event does).
    const e = last.entry;
    const name = str(e.drug?.name);
    if (!name) continue;
    if (isHospitalOnly(e)) continue;
    const ingredient = ingredientFromName(name);
    const row: MedicationRow = {
      ...(ingredient ? { ingredient } : {}),
      drug_name: name,
      status,
      ...(since ? { status_since: since } : {}),
      patient_reported: false,
      evidence: evidenceOf(evs),
    };
    const dose = medDose(e, name);
    if (dose) row.dose = dose;
    const freq = medFrequency(e);
    if (freq) row.frequency = freq;
    if (status === "stopped") {
      const sr = e.stop_reason;
      if (["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(sr)) {
        row.stop_reason = sr;
      }
    }
    if (status === "stopped" || status === "held") {
      // Reason text from the event that set the current status.
      const setter = [...evs].reverse().find((x) => x.entry.action === (status === "stopped" ? "stop" : "hold"));
      const rt = str(setter?.entry.reason_text) ?? str(e.reason_text);
      if (rt) row.status_reason_text = rt;
    }
    const sens = uniqSens(evs.flatMap((x) => restrictionSensitivity(x.entry.restricted)));
    if (sens) row.sensitivity = sens;
    built.push({ row, last, key: ingredient ?? name.toLowerCase() });
  }

  // One row per ingredient: the line whose own latest event is latest.
  const best = new Map<string, Built>();
  for (const b of built) {
    const cur = best.get(b.key);
    if (!cur || cmpEv(cur.last, b.last) < 0) best.set(b.key, b);
  }
  return Array.from(best.values())
    .map((b) => b.row)
    .sort((a, b) => (a.ingredient ?? a.drug_name).localeCompare(b.ingredient ?? b.drug_name));
}

// ───────────────────────────── problems ─────────────────────────────

function ckdStage(desc: string, icd: string | undefined): ProblemRow["ckd_stage"] | undefined {
  const d = desc.toLowerCase();
  let m = /\bg(1|2|3a|3b|4|5)\b/.exec(d) ?? /stage\s*(1|2|3a|3b|4|5|i{1,3}a|i{1,3}b|iv|v)\b/.exec(d);
  if (m) {
    const s = m[1];
    const roman: Record<string, string> = { i: "1", ii: "2", iiia: "3a", iiib: "3b", iv: "4", v: "5" };
    const v = roman[s] ?? s;
    const map: Record<string, ProblemRow["ckd_stage"]> = { "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5" };
    if (map[v]) return map[v];
  }
  if (/end[- ]stage|\besrd\b|\beskd\b/.test(d)) return "G5";
  const c = (icd ?? "").toUpperCase();
  const byCode: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  return byCode[c];
}

function albuminuria(desc: string): ProblemRow["albuminuria"] | undefined {
  const m = /\b(?:g(?:1|2|3a|3b|4|5)\s*\/?\s*|albuminuria\s*(?:category\s*)?|,\s*|\s)a([123])\b/i.exec(desc);
  if (m) return ("A" + m[1]) as ProblemRow["albuminuria"];
  return undefined;
}

function isCkd(desc: string, icd: string | undefined): boolean {
  return /^N18/i.test(icd ?? "") || /chronic kidney disease|\bckd\b/i.test(desc);
}

function mapProblems(
  events: Ev[],
  byType: Record<string, Ev[]>,
): { problems: ProblemRow[]; allergies: { row: AllergyIntoleranceRow; key: string }[] } {
  const lines = new Map<string, Ev[]>();
  for (const ev of events) {
    const id = str(ev.entry.problem_id);
    if (!id) continue;
    if (!lines.has(id)) lines.set(id, []);
    lines.get(id)!.push(ev);
  }

  interface Built {
    row: ProblemRow | null;
    last: Ev;
    evs: Ev[];
    key: string;
  }
  const built: Built[] = [];
  const allergies: { row: AllergyIntoleranceRow; key: string }[] = [];

  for (const [, evs] of lines) {
    evs.sort(cmpEv);
    let status: ProblemRow["status"] | "removed" | undefined;
    for (const ev of evs) {
      const a = ev.entry.action;
      if (a === "add") status = "active";
      else if (a === "resolve") status = "resolved";
      else if (a === "remove") status = "removed";
      else if (a === "update" && status === undefined) status = "active";
    }
    if (!status || status === "removed") continue;
    const last = evs[evs.length - 1];
    const e = last.entry;
    const desc = str(e.description);
    if (!desc) continue;
    const icd = str(e.icd10cm);
    const snomed = str(e.snomed);
    const sens = uniqSens([
      ...evs.flatMap((x) => restrictionSensitivity(x.entry.restricted)),
      ...icdSensitivity(icd),
    ]);

    const cause = drugCause(desc, icd);
    let row: ProblemRow | null = null;
    if (!cause || !cause.effectOnly) {
      row = { condition: desc, status, evidence: evidenceOf(evs) };
      if (icd) row.icd10cm = icd;
      if (snomed) row.snomed = snomed;
      const onset = partialFromFuzzy(e.onset);
      if (onset) row.onset = onset;
      if (isCkd(desc, icd)) {
        const st = ckdStage(desc, icd);
        if (st) row.ckd_stage = st;
        const al = albuminuria(desc);
        if (al) row.albuminuria = al;
      }
      if (sens) row.sensitivity = sens;
    }
    built.push({ row, last, evs, key: icd ? "icd:" + icd.toUpperCase() : "desc:" + desc.toLowerCase() });

    if (cause) {
      let substance = cause.drug.substance;
      if (cause.drug.isClass && cause.drug.classMembers) {
        // The one drug of that class on a medication entry in the same item, if exactly one.
        const sameItem = (byType["med_event"] ?? []).filter((m) => m.item.id === last.item.id);
        const found = new Set<string>();
        for (const m of sameItem) {
          const ing = ingredientFromName(String(m.entry.drug?.name ?? ""));
          if (ing && cause.drug.classMembers.includes(ing)) found.add(ing);
        }
        if (found.size === 1) substance = Array.from(found)[0];
      }
      const text = cause.condition;
      const rt = reactionTypeFromText(text) ?? reactionTypeFromText(desc) ?? "serious_adverse_event";
      const arow: AllergyIntoleranceRow = {
        substance,
        reaction_type: rt,
        mechanism: mechanismFor(substance, desc, undefined),
        ...(cause.effectOnly ? {} : { reaction: text }),
        criticality: "unknown",
        evidence: evidenceOf(evs),
      };
      const onset = partialFromFuzzy(e.onset);
      if (onset) arow.onset = onset;
      const asens = uniqSens(evs.flatMap((x) => restrictionSensitivity(x.entry.restricted)));
      if (asens) arow.sensitivity = asens;
      allergies.push({ row: arow, key: substance.toLowerCase() });
    }
  }

  // Merge lines describing the same condition (same code): latest line wins.
  const best = new Map<string, Built>();
  const evMerged = new Map<string, Ev[]>();
  for (const b of built) {
    if (!b.row) continue;
    const cur = best.get(b.key);
    evMerged.set(b.key, [...(evMerged.get(b.key) ?? []), ...b.evs]);
    if (!cur || cmpEv(cur.last, b.last) < 0) best.set(b.key, b);
  }
  const problems: ProblemRow[] = [];
  for (const [k, b] of best) {
    const row = b.row!;
    const all = evMerged.get(k)!;
    if (all.length !== b.evs.length) {
      const ownIds = new Set(b.evs.map((x) => x.item.id + "\u0000" + x.entryId));
      row.evidence = evidenceOf([...b.evs, ...all.filter((x) => !ownIds.has(x.item.id + "\u0000" + x.entryId)).sort(cmpEv)]);
    }
    problems.push(row);
  }
  problems.sort((a, b) => a.condition.localeCompare(b.condition));
  return { problems, allergies };
}

// ───────────────────────────── allergies ─────────────────────────────

function mapAllergies(events: Ev[], derived: { row: AllergyIntoleranceRow; key: string }[]): AllergyIntoleranceRow[] {
  const lines = new Map<string, Ev[]>();
  for (const ev of events) {
    const id = str(ev.entry.allergy_id);
    if (!id) continue;
    if (!lines.has(id)) lines.set(id, []);
    lines.get(id)!.push(ev);
  }
  const rows = new Map<string, { row: AllergyIntoleranceRow; last?: Ev }>();
  for (const [, evs] of lines) {
    evs.sort(cmpEv);
    let active: boolean | undefined;
    for (const ev of evs) {
      const a = ev.entry.action;
      if (a === "add") active = true;
      else if (a === "inactivate") active = false;
      else if (a === "update" && active === undefined) active = true;
    }
    if (!active) continue;
    const last = evs[evs.length - 1];
    const e = last.entry;
    const sname = str(e.substance?.name);
    if (!sname) continue;
    const rx = str(e.substance?.rxnorm);
    const substance = rx ? ingredientFromName(sname) ?? sname.toLowerCase() : sname;
    const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.filter((r: unknown) => typeof r === "string" && r.trim()) : [];
    const rtext = reactions.join("; ");
    const srcType = str(e.reaction_type);
    const rt =
      reactionTypeFromText(rtext) ??
      (srcType === "allergy" ? "hypersensitivity" : srcType === "intolerance" ? "side_effect" : srcType === "adverse_reaction" ? "serious_adverse_event" : "hypersensitivity");
    const sev = e.severity;
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: rt,
      mechanism: mechanismFor(substance, rtext, srcType),
      criticality: sev === "high" || sev === "low" ? sev : "unknown",
      evidence: evidenceOf(evs),
    };
    if (rx) row.rxnorm_ingredient = rx;
    if (rtext) row.reaction = rtext;
    const onset = partialFromFuzzy(e.onset);
    if (onset) row.onset = onset;
    const key = substance.toLowerCase();
    const cur = rows.get(key);
    if (!cur || (cur.last && cmpEv(cur.last, last) < 0)) {
      if (cur) row.evidence = [...row.evidence, ...cur.row.evidence.filter((x) => !row.evidence.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id))];
      rows.set(key, { row, last });
    } else {
      cur.row.evidence.push(...row.evidence.filter((x) => !cur.row.evidence.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id)));
    }
  }
  // Drug-caused diagnoses: add a row unless the allergy list already holds the substance.
  for (const d of derived) {
    const cur = rows.get(d.key);
    if (cur) {
      cur.row.evidence.push(...d.row.evidence.filter((x) => !cur.row.evidence.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id)));
    } else {
      rows.set(d.key, { row: d.row });
    }
  }
  return Array.from(rows.values())
    .map((r) => r.row)
    .sort((a, b) => a.substance.localeCompare(b.substance));
}

// ───────────────────────────── labs ─────────────────────────────

const STATUS_RANK: Record<string, number> = { P: 0, F: 1, C: 2 };

function mapLabs(events: Ev[]): LabResultRow[] {
  interface Cand {
    ev: Ev;
    row: LabResultRow;
    rank: number;
    accession: string;
    race: boolean;
    key: string;
  }
  const cands: Cand[] = [];
  for (const ev of events) {
    const e = ev.entry;
    const test = e.test && typeof e.test === "object" ? e.test : {};
    const name = String(test.name ?? "");
    const loinc = str(test.loinc);
    const code = String(test.nfm_code ?? "").toUpperCase();
    let analyte: Analyte | undefined = (loinc && LOINC_ANALYTE[loinc]) || undefined;
    if (!analyte) analyte = CODE_ANALYTE[code] ?? (/^EGFR/.test(code) ? "egfr" : undefined);
    if (!analyte) analyte = analyteFromName(name);
    if (!analyte) continue;
    if (isUrineOrPoc(name, analyte)) continue;
    const pv = parseResultValue(e.value);
    if (!pv) continue; // withdrawn, invalidated or non-numeric
    const factor = unitFactor(analyte, typeof e.unit === "string" ? e.unit : "");
    if (factor === undefined) continue;
    const collected = str(e.collected) ?? str(ev.item.effective);
    if (!collected) continue;
    const st = str(e.result_status)?.toUpperCase() ?? "F";
    let value = factor === 1 ? pv.value : clean(pv.value * factor);
    if (analyte === "glucose" && factor !== 1) value = Math.round(value);
    const row: LabResultRow = {
      analyte,
      value,
      unit: ANALYTE_UNIT[analyte],
      collected,
      status: st === "P" ? "preliminary" : "final",
      evidence: [{ item_id: ev.item.id, entry_id: ev.entryId }],
    };
    if (pv.comparator) row.comparator = pv.comparator;
    if (analyte === "egfr") row.egfr_equation = egfrEquation(e);
    if (loinc) row.loinc = loinc;
    const accession = String(e.external_ref?.accession ?? `${ev.item.id}`);
    const comp = String(e.external_ref?.result_code ?? code ?? ev.entryId) || ev.entryId;
    cands.push({
      ev,
      row,
      rank: STATUS_RANK[st] ?? 1,
      accession,
      race: analyte === "egfr" && isRaceVariant(e),
      key: accession + "\u0000" + comp + "\u0000" + code,
    });
  }

  // Same result shown more than once: keep the copy with the most advanced status (then latest recorded).
  const best = new Map<string, Cand>();
  for (const c of cands) {
    const cur = best.get(c.key);
    if (
      !cur ||
      c.rank > cur.rank ||
      (c.rank === cur.rank && instant(c.ev.item.recorded) > instant(cur.ev.item.recorded))
    ) {
      best.set(c.key, c);
    }
  }
  const kept = Array.from(best.values());
  // eGFR: drop race-coefficient variants when the race-free variant of the same specimen is reported.
  const hasNonRace = new Set(kept.filter((c) => c.row.analyte === "egfr" && !c.race).map((c) => c.accession + "\u0000" + c.row.egfr_equation));
  const rows = kept
    .filter((c) => !(c.race && hasNonRace.has(c.accession + "\u0000" + c.row.egfr_equation)))
    .map((c) => c.row);
  rows.sort((a, b) => {
    const ia = instant(a.collected);
    const ib = instant(b.collected);
    if (ia !== ib && !isNaN(ia) && !isNaN(ib)) return ia - ib;
    return a.analyte.localeCompare(b.analyte);
  });
  return rows;
}

// ───────────────────────────── vitals ─────────────────────────────

function parseBp(v: unknown): [number, number] | undefined {
  if (typeof v !== "string") return undefined;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(v);
  if (!m) return undefined;
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

function mapVitals(events: Ev[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const ev of events) {
    const e = ev.entry;
    const eff = ev.item.effective;
    const local = hasTime(eff) ? localDateTime(eff) : localDateTime(ev.item.recorded);
    if (!local) continue;
    const row: VitalRow = { setting: "clinic", local_time: local, evidence: [{ item_id: ev.item.id, entry_id: ev.entryId }] };
    let any = false;
    const bp = parseBp(e.bp);
    if (bp) {
      row.systolic_mmhg = bp[0];
      row.diastolic_mmhg = bp[1];
      any = true;
    }
    const rep = parseBp(e.bp_repeat);
    if (rep) {
      row.repeat_systolic_mmhg = rep[0];
      row.repeat_diastolic_mmhg = rep[1];
      any = true;
    }
    const pulse = num(e.pulse_bpm);
    if (pulse !== undefined) {
      row.pulse_bpm = pulse;
      any = true;
    }
    const lb = num(e.weight_lb);
    if (lb !== undefined) {
      row.weight_kg = round(lb * 0.45359237, 1);
      any = true;
    }
    if (any) rows.push(row);
  }
  rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return rows;
}
