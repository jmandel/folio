// Northgate Family Medicine (northgate-chart-v1) -> consumer app views v2.
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

type Entry = Record<string, any>;
interface Ev {
  item: FolioItem;
  entryId: string;
  e: Entry;
  sortKey: number;
  recKey: number;
}

const TZ = "America/Chicago";

// ───────────────────────────── time helpers ─────────────────────────────

const OFFSET_RE = /(Z|[+-]\d{2}:?\d{2})$/i;
const DT_RE = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/;

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

/** Local (Chicago) date and HH:MM of a date-time; wall-clock strings without offset are taken as written. */
function localDateTime(s: unknown): { date: string; time?: string } | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  const m = DT_RE.exec(t);
  if (m) {
    if (!OFFSET_RE.test(t)) return { date: m[1], time: `${m[2]}:${m[3]}` };
    const ms = Date.parse(t);
    if (isNaN(ms)) return null;
    return chicagoParts(ms);
  }
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return { date: t };
  return null;
}

/** Local partial date of a FOLIO time value (keeps precision of date-only values). */
function localDate(s: unknown): string | undefined {
  return localDateTime(s)?.date;
}

/** Sort key (ms) for a time value; date-only and wall-clock values are approximated as Chicago standard time. */
function timeKey(s: unknown): number {
  if (typeof s !== "string") return NaN;
  const t = s.trim();
  if (DT_RE.test(t)) {
    if (OFFSET_RE.test(t)) return Date.parse(t);
    return Date.parse(t.replace(" ", "T") + (t.length === 16 ? ":00" : "") + "-06:00");
  }
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(t);
  if (m) return Date.parse(`${m[1]}-${m[2] ?? "01"}-${m[3] ?? "01"}T00:00:00-06:00`);
  return NaN;
}

function cmpNum(a: number, b: number): number {
  const an = isNaN(a), bn = isNaN(b);
  if (an && bn) return 0;
  if (an) return -1;
  if (bn) return 1;
  return a - b;
}

function cmpEv(a: Ev, b: Ev): number {
  return (
    cmpNum(a.sortKey, b.sortKey) ||
    cmpNum(a.recKey, b.recKey) ||
    (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0) ||
    (a.entryId < b.entryId ? -1 : a.entryId > b.entryId ? 1 : 0)
  );
}

function fuzzy(f: unknown): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f !== "object") return undefined;
  const d = (f as any).date;
  const p = (f as any).precision;
  if (typeof d !== "string") return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(d);
  if (!m) return undefined;
  if (p === "year") return { value: m[1], precision: "year" };
  if (p === "month" && m[2]) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  if (m[2] && m[3]) return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
  if (m[2]) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  return { value: m[1], precision: "year" };
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

function sensitivityOf(restricted: unknown): Sensitivity[] | undefined {
  if (restricted === "BH") return ["mental-health"];
  return undefined;
}

function evidenceOf(evs: Ev[]): Evidence {
  const out: Evidence = [];
  const seen = new Set<string>();
  for (const v of evs) {
    const k = v.item.id + "\u0000" + v.entryId;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: v.item.id, entry_id: v.entryId });
  }
  return out;
}

// ───────────────────────────── drug names ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  steglatro: "ertugliflozin",
  januvia: "sitagliptin",
  tradjenta: "linagliptin",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  trulicity: "dulaglutide",
  victoza: "liraglutide",
  mounjaro: "tirzepatide",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  semglee: "insulin glargine",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  humalog: "insulin lispro",
  admelog: "insulin lispro",
  novolog: "insulin aspart",
  glucophage: "metformin",
  glucotrol: "glipizide",
  amaryl: "glimepiride",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  zocor: "simvastatin",
  pravachol: "pravastatin",
  norvasc: "amlodipine",
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
  lasix: "furosemide",
  bumex: "bumetanide",
  microzide: "hydrochlorothiazide",
  hctz: "hydrochlorothiazide",
  aldactone: "spironolactone",
  kerendia: "finerenone",
  coreg: "carvedilol",
  toprol: "metoprolol",
  lopressor: "metoprolol",
  tenormin: "atenolol",
  eliquis: "apixaban",
  xarelto: "rivaroxaban",
  coumadin: "warfarin",
  plavix: "clopidogrel",
  synthroid: "levothyroxine",
  zoloft: "sertraline",
  lexapro: "escitalopram",
  celexa: "citalopram",
  prozac: "fluoxetine",
  wellbutrin: "bupropion",
  effexor: "venlafaxine",
  cymbalta: "duloxetine",
  desyrel: "trazodone",
  zyloprim: "allopurinol",
  uloric: "febuxostat",
  neurontin: "gabapentin",
  prilosec: "omeprazole",
  protonix: "pantoprazole",
  tylenol: "acetaminophen",
  advil: "ibuprofen",
  motrin: "ibuprofen",
  aleve: "naproxen",
  zyrtec: "cetirizine",
  claritin: "loratadine",
};

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "succinate", "tartrate",
  "mesylate", "fumarate", "calcium", "magnesium", "bitartrate", "sulfate", "monohydrate", "dihydrate",
  "trihydrate", "acetate", "phosphate", "hyclate", "disodium", "dipotassium", "hydrobromide",
  "bromide", "citrate", "anhydrous", "propionate", "dipropionate", "furoate", "lactate", "valerate",
]);

const PREFIX_WORDS = new Set(["hr", "hour", "day", "ml", "actuat", "unt"]);

/** Generic ingredient name of one component ("losartan potassium 50 MG" -> "losartan"). */
function ingredientOfPart(part: string): string | undefined {
  let words = part
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w !== "");
  // Leading quantity prefixes in RxNorm names: "24 HR", "3 ML", "0.5 ML".
  while (words.length >= 2 && /^\d/.test(words[0]) && PREFIX_WORDS.has(words[1].toLowerCase())) words = words.slice(2);
  const name: string[] = [];
  for (const w of words) {
    if (/^\d/.test(w) || /^[.,]?\d/.test(w)) break;
    name.push(w.toLowerCase().replace(/[,;:]+$/, ""));
  }
  if (name.length === 0) return undefined;
  const joined = name.join(" ");
  if (BRANDS[joined]) return BRANDS[joined];
  if (BRANDS[name[0]]) return BRANDS[name[0]];
  const kept = [name[0], ...name.slice(1).filter((w) => !SALTS.has(w))];
  // Drop dose-form words that some outside names carry without a strength ("furosemide tablet").
  const FORM = /^(oral|tablet|tablets|tab|tabs|capsule|capsules|cap|caps|solution|suspension|injection|pen|injector|er|xr|sr|dr|extended|release|delayed|chewable|topical|cream|ointment|patch|inhaler|po|daily|mg|mcg)$/;
  while (kept.length > 1 && FORM.test(kept[kept.length - 1])) kept.pop();
  const out = kept.join(" ").trim();
  return out || undefined;
}

function bracketBrand(name: string): string | undefined {
  const m = /\[([^\]]+)\]/.exec(name);
  if (!m) return undefined;
  return BRANDS[m[1].trim().toLowerCase()];
}

function ingredientOf(name: string): string | undefined {
  const parts = name.split(/\s+\/\s+/);
  const ings: string[] = [];
  for (const p of parts) {
    const ing = ingredientOfPart(p);
    if (ing) ings.push(ing);
  }
  if (ings.length === 0) return bracketBrand(name);
  if (ings.length === 1 && parts.length === 1) {
    const bb = bracketBrand(name);
    if (bb && !ings[0]) return bb;
  }
  return ings.join(" / ");
}

/** Strength per tablet/capsule from a single-ingredient product name, e.g. "500 MG Oral Tablet". */
function unitStrength(name: string): { value: number; unit: "mg" | "mcg" } | undefined {
  if (/\s\/\s/.test(name)) return undefined;
  if (!/(tablet|capsule|\btab\b|\bcap\b)/i.test(name)) return undefined;
  const re = /(\d+(?:\.\d+)?)\s*(MG|MCG)\b(?!\s*\/)/gi;
  const found: { value: number; unit: "mg" | "mcg" }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(name))) found.push({ value: parseFloat(m[1]), unit: m[2].toLowerCase() === "mcg" ? "mcg" : "mg" });
  if (found.length !== 1 || !isFinite(found[0].value)) return undefined;
  return found[0];
}

function roundN(v: number, digits = 6): number {
  return parseFloat(v.toFixed(digits));
}

function medDose(e: Entry, name: string): MedicationRow["dose"] | undefined {
  const d = e.dose;
  if (!d || typeof d !== "object") return undefined;
  const value = typeof d.value === "number" ? d.value : parseFloat(d.value);
  if (!isFinite(value) || value <= 0) return undefined;
  const u = String(d.unit ?? "").trim().toLowerCase();
  if (u === "mg") return { value, unit: "mg" };
  if (u === "mcg" || u === "ug" || u === "µg") return { value, unit: "mcg" };
  if (u === "units" || u === "unit" || u === "unt" || u === "u" || u === "[iu]" || u === "iu") return { value, unit: "units" };
  if (u === "ml") return { value, unit: "mL" };
  if (u === "tab" || u === "tabs" || u === "tablet" || u === "tablets" || u === "cap" || u === "caps" || u === "capsule" || u === "capsules") {
    const s = unitStrength(name);
    if (s) return { value: roundN(value * s.value), unit: s.unit };
    return { value, unit: "tablet" };
  }
  return undefined;
}

function medFrequency(e: Entry): MedicationRow["frequency"] | undefined {
  switch (e.frequency) {
    case "QD":
    case "BID":
    case "TID":
    case "QHS":
    case "PRN":
      return e.frequency;
    case "OTHER": {
      const sig = String(e.sig ?? "");
      if (/\b(once (a |per )?week(ly)?|every week|weekly|q\s?week|qw)\b/i.test(sig)) return "QW";
      return "other";
    }
  }
  return undefined;
}

const STOP_REASONS = new Set(["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"]);

function isHospitalOnly(name: string): boolean {
  return /\b(infusion|intravenous|iv piggyback|iv bolus|premix)\b/i.test(name);
}

// ───────────────────────────── labs ─────────────────────────────

const ANALYTE_UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "62238-1": "egfr", "88293-6": "egfr",
  "88294-4": "egfr", "98979-8": "egfr", "50044-7": "egfr", "69405-9": "egfr",
  "2823-3": "potassium", "6298-4": "potassium",
  "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap",
  "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets",
  "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin",
  "53060-9": "bhb", "47575-8": "bhb",
  "2744-1": "ph", "11558-4": "ph",
  "2019-8": "pco2", "11557-6": "pco2",
  "3040-3": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol",
  "2571-8": "triglycerides",
  "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

const CODE_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", SCR: "creatinine",
  K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", HCO3: "bicarbonate", TCO2: "bicarbonate", BICARB: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", ANIONGAP: "anion_gap",
  BUN: "bun", UREAN: "bun",
  GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose",
  A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", MALBCR: "uacr", MALB_CR: "uacr", "MALB-CR": "uacr", "ALB-CR": "uacr", ALBCR: "uacr",
  PLT: "platelets", PLATELETS: "platelets",
  WBC: "wbc",
  HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb",
  PH: "ph",
  PCO2: "pco2",
  LIPASE: "lipase", LIP: "lipase",
  TROP: "troponin", TNI: "troponin", TROPI: "troponin", TROPONIN: "troponin",
  CHOL: "cholesterol", TCHOL: "cholesterol",
  TRIG: "triglycerides", TG: "triglycerides",
  HDL: "hdl",
  LDL: "ldl", LDLC: "ldl", "LDL-C": "ldl", "LDL-CALC": "ldl", LDLCALC: "ldl", "LDL-DIRECT": "ldl",
};

function classifyLab(test: Entry, ext: Entry | undefined, unit: string): Analyte | undefined {
  const loinc = str(test?.loinc);
  const code = String(test?.nfm_code ?? "").trim().toUpperCase();
  const rcode = String(ext?.result_code ?? "").trim().toUpperCase().replace(/^LK-/, "");
  const name = String(test?.name ?? "").toLowerCase();
  // Urine / non-serum specimens of serum analytes are not the tracked analyte.
  const urine = /\burine\b|\bur\b|\bu-/.test(name) && !/albumin.*creatinine|creatinine.*albumin|\bacr\b|uacr/.test(name);
  if (/^EGFR|^GFR/.test(code) || /^EGFR|^GFR/.test(rcode) || /\begfr\b|glomerular filtration/.test(name)) return "egfr";
  if (loinc && LOINC_ANALYTE[loinc]) return LOINC_ANALYTE[loinc];
  if (CODE_ANALYTE[code] && !(urine && CODE_ANALYTE[code] !== "uacr")) return CODE_ANALYTE[code];
  if (CODE_ANALYTE[rcode] && !(urine && CODE_ANALYTE[rcode] !== "uacr")) return CODE_ANALYTE[rcode];
  if (/albumin.*creatinine|creatinine.*albumin|\buacr\b|microalbumin\/creat/.test(name)) return "uacr";
  if (urine) return undefined;
  if (/\bpoc\b|meter|fingerstick|point of care/.test(name)) return undefined;
  if (/^creatinine/.test(name)) return "creatinine";
  if (/^potassium/.test(name)) return "potassium";
  if (/^sodium/.test(name)) return "sodium";
  if (/^chloride/.test(name)) return "chloride";
  if (/^(bicarbonate|co2|carbon dioxide|total co2)/.test(name)) return "bicarbonate";
  if (/anion gap/.test(name)) return "anion_gap";
  if (/^(bun|urea nitrogen|blood urea nitrogen)/.test(name)) return "bun";
  if (/^glucose/.test(name)) return "glucose";
  if (/a1c|glycated hemoglobin|glycohemoglobin/.test(name)) return "a1c";
  if (/^platelet/.test(name)) return "platelets";
  if (/^(wbc|white blood cell|leukocyte)/.test(name)) return "wbc";
  if (/^(hemoglobin|hgb)\b/.test(name)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b/.test(name)) return "bhb";
  if (/^ph\b/.test(name)) return "ph";
  if (/^pco2|carbon dioxide partial/.test(name)) return "pco2";
  if (/^lipase/.test(name)) return "lipase";
  if (/troponin/.test(name) && !/troponin t/.test(name)) return "troponin";
  if (/^cholesterol, total|^total cholesterol|^cholesterol$/.test(name)) return "cholesterol";
  if (/^triglyceride/.test(name)) return "triglycerides";
  if (/^hdl/.test(name)) return "hdl";
  if (/^ldl/.test(name)) return "ldl";
  return undefined;
}

function normUnit(u: string): string {
  return u.trim().toLowerCase().replace(/\s+/g, "").replace(/µ/g, "u").replace(/μ/g, "u");
}

/** Convert a value in the filed unit to the analyte's unit; undefined if the unit is not understood. */
function convertLab(analyte: Analyte, value: number, unitRaw: string): number | undefined {
  const u = normUnit(unitRaw);
  switch (analyte) {
    case "creatinine":
    case "bun":
    case "glucose":
    case "cholesterol":
    case "triglycerides":
    case "hdl":
    case "ldl":
      if (u === "mg/dl") return value;
      return undefined;
    case "egfr":
      if (/^ml\/min(\/|per)?(\{?1\.73_?m2\}?|1\.73m\^?2|1\.73sq\.?m)$/.test(u) || u === "ml/min/1.73m2") return value;
      return undefined;
    case "potassium":
    case "sodium":
    case "chloride":
    case "bicarbonate":
    case "anion_gap":
      if (u === "mmol/l" || u === "meq/l") return value;
      return undefined;
    case "bhb":
      if (u === "mmol/l") return value;
      return undefined;
    case "a1c":
      if (u === "%" || u === "%hba1c" || u === "%ofhgb" || u === "%oftotalhgb") return value;
      return undefined;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "mg/g{creat}" || u === "ug/mgcreat" || u === "ug/mg" || u === "mcg/mgcreat" || u === "mcg/mg") return value;
      return undefined;
    case "platelets":
    case "wbc":
      if (u === "cells/ul" || u === "/ul" || u === "cells/mm3" || u === "/mm3") return roundN(value / 1000);
      if (u === "k/ul" || u === "10*3/ul" || u === "10^3/ul" || u === "x10e3/ul" || u === "thou/ul" || u === "10e3/ul" || u === "x10^3/ul" || u === "10*9/l" || u === "x10e9/l" || u === "10^9/l") return value;
      return undefined;
    case "hemoglobin":
      if (u === "g/dl") return value;
      if (u === "g/l") return roundN(value / 10);
      return undefined;
    case "ph":
      if (u === "" || u === "[ph]" || u === "ph" || u === "units") return value;
      return undefined;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return value;
      return undefined;
    case "lipase":
      if (u === "u/l" || u === "iu/l") return value;
      return undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return value;
      if (u === "ng/l" || u === "pg/ml") return roundN(value / 1000);
      return undefined;
  }
  return undefined;
}

function parseLabValue(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof v === "number") return isFinite(v) ? { value: v } : undefined;
  if (typeof v !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(v);
  if (!m) return undefined;
  const value = parseFloat(m[2]);
  if (!isFinite(value)) return undefined;
  let c = m[1] as string | undefined;
  if (c === "≤") c = "<=";
  if (c === "≥") c = ">=";
  return c ? { value, comparator: c as LabResultRow["comparator"] } : { value };
}

function egfrEquation(e: Entry): NonNullable<LabResultRow["egfr_equation"]> {
  const comment = String(e.comment ?? "").toLowerCase();
  const fromText = (t: string): LabResultRow["egfr_equation"] | undefined => {
    if (/ckd[- ]?epi[^.;]*?2021|2021[^.;]*?ckd[- ]?epi|race[- ]free/.test(t)) return "ckd-epi-2021";
    if (/ckd[- ]?epi[^.;]*?2009|2009[^.;]*?ckd[- ]?epi/.test(t)) return "ckd-epi-2009";
    if (/\bmdrd\b/.test(t)) return "mdrd";
    return undefined;
  };
  const c = fromText(comment);
  if (c) return c;
  const rcode = String(e.external_ref?.result_code ?? "").toUpperCase();
  if (/EGFR09|GFR09|EGFR2009/.test(rcode)) return "ckd-epi-2009";
  if (/EGFR21|GFR21|EGFR2021/.test(rcode)) return "ckd-epi-2021";
  const name = String(e.test?.name ?? "").toLowerCase();
  const n = fromText(name);
  if (n) return n;
  const code = String(e.test?.nfm_code ?? "").toUpperCase();
  if (/09/.test(code)) return "ckd-epi-2009";
  if (/21/.test(code)) return "ckd-epi-2021";
  if (/MDRD/.test(code)) return "mdrd";
  const loinc = String(e.test?.loinc ?? "");
  if (loinc === "98979-8") return "ckd-epi-2021";
  if (loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  if (loinc === "48642-3" || loinc === "48643-1" || loinc === "33914-3") return "mdrd";
  return "unknown";
}

/** 'aa' for the race-coefficient (African American) variant, 'naa' for the non-AA variant, undefined otherwise. */
function egfrRaceVariant(e: Entry): "aa" | "naa" | undefined {
  const code = String(e.test?.nfm_code ?? "").toUpperCase();
  const rcode = String(e.external_ref?.result_code ?? "").toUpperCase();
  const name = String(e.test?.name ?? "").toLowerCase();
  const loinc = String(e.test?.loinc ?? "");
  if (/NAA|NON-?AA|NONAA/.test(code) || /non[- ]?african|non[- ]?black|non[- ]?aa\b/.test(name) || loinc === "48642-3" || loinc === "88294-4") return "naa";
  if (/(^|[-_])AA($|[-_])/.test(code) || /african american|\bblack\b/.test(name) || loinc === "48643-1" || loinc === "88293-6") return "aa";
  if (/EGFR\d*A$/.test(rcode)) return "aa";
  if (/EGFR\d*N$/.test(rcode)) return "naa";
  return undefined;
}

// ───────────────────────────── allergies ─────────────────────────────

const HYPERSENS = /hives|urticaria|rash|angioedema|swelling|anaphyla|bronchospasm|wheez|pruritus|itch|stevens|johnson|toxic epidermal|dress\b|throat (tightness|closing)|lip swelling|tongue swelling|shortness of breath|dyspnea|flushing|hypotension|blister|exanthem|erythema/i;
const SERIOUS = /ketoacidosis|lactic acidosis|hyperkalemia|acute kidney injury|\baki\b|renal failure|pancreatitis|hypoglycemi|agranulocytosis|neutropenia|thrombocytopenia|hepatotoxic|liver injury|hepatitis|rhabdomyolysis|bleeding|hemorrhage|seizure|qt prolongation|arrhythmia|syncope|hyponatremia/i;
const SIDE = /cough|nausea|vomit|diarrh|gi upset|upset stomach|dyspepsia|abdominal|constipation|myalgia|muscle (ache|pain)|dizz|lightheaded|headache|fatigue|drowsi|somnolence|insomnia|edema|ankle swelling|leg swelling|flatulence|bloating|taste|dry mouth|palpitation|frequent urination|yeast|genital/i;

const ACE_INHIBITORS = ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"];

const DRUG_CLASSES: { re: RegExp; label: string; members: string[] }[] = [
  { re: /sglt-?2 inhibitor|sglt2i?\b|sodium[- ]glucose co-?transporter/i, label: "SGLT2 inhibitor", members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin", "bexagliflozin"] },
  { re: /ace[- ]inhibitor|ace-?i\b|angiotensin[- ]converting enzyme inhibitor/i, label: "ACE inhibitor", members: ACE_INHIBITORS },
  { re: /\barb\b|angiotensin (ii )?receptor blocker/i, label: "ARB", members: ["losartan", "valsartan", "irbesartan", "olmesartan", "telmisartan", "candesartan", "azilsartan"] },
  { re: /statin\b/i, label: "statin", members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"] },
  { re: /glp-?1/i, label: "GLP-1 receptor agonist", members: ["semaglutide", "liraglutide", "dulaglutide", "exenatide", "tirzepatide"] },
  { re: /sulfonylurea/i, label: "sulfonylurea", members: ["glipizide", "glyburide", "glimepiride"] },
  { re: /\bnsaids?\b|non-?steroidal anti-?inflammatory/i, label: "NSAID", members: ["ibuprofen", "naproxen", "meloxicam", "diclofenac", "celecoxib", "ketorolac"] },
  { re: /thiazide/i, label: "thiazide diuretic", members: ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone"] },
  { re: /loop diuretic/i, label: "loop diuretic", members: ["furosemide", "bumetanide", "torsemide"] },
  { re: /penicillin/i, label: "penicillin", members: [] },
  { re: /sulfonamide|sulfa\b/i, label: "sulfonamide", members: [] },
];

const KNOWN_DRUGS = new Set<string>([
  ...ACE_INHIBITORS,
  ...DRUG_CLASSES.flatMap((c) => c.members),
  ...Object.values(BRANDS),
  "metformin", "insulin", "spironolactone", "finerenone", "amlodipine", "allopurinol", "warfarin",
  "heparin", "amiodarone", "trimethoprim", "sulfamethoxazole", "amoxicillin", "lithium", "valproate",
  "carbamazepine", "phenytoin", "pioglitazone", "colchicine", "clopidogrel", "apixaban", "rivaroxaban",
]);

function isAce(substance: string): boolean {
  return ACE_INHIBITORS.some((a) => substance.includes(a)) || /ace[- ]inhibitor/i.test(substance);
}

function allergyReactionType(sourceType: unknown, reactionText: string): AllergyIntoleranceRow["reaction_type"] {
  if (HYPERSENS.test(reactionText) && !/ankle swelling|leg swelling/i.test(reactionText)) return "hypersensitivity";
  if (SERIOUS.test(reactionText)) return "serious_adverse_event";
  if (SIDE.test(reactionText)) return "side_effect";
  if (sourceType === "intolerance") return "side_effect";
  if (sourceType === "adverse_reaction") return "serious_adverse_event";
  return "hypersensitivity";
}

function allergyMechanism(sourceType: unknown, substance: string, reactionText: string): AllergyIntoleranceRow["mechanism"] {
  if (isAce(substance) && /cough|angioedema|swelling/i.test(reactionText)) return "non_immune";
  if (/ketoacidosis|lactic acidosis|hyperkalemia/i.test(reactionText)) return "non_immune";
  if (sourceType === "intolerance" || sourceType === "adverse_reaction") return "non_immune";
  return "unknown";
}

// ───────────────────────────── main ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items)) return out;
  const asOfDate = typeof asOf === "string" && /^\d{4}-\d{2}-\d{2}$/.test(asOf.trim()) ? asOf.trim() : undefined;

  // Scope: recorded on or before the end of asOf (Chicago).
  const inScope: FolioItem[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const rd = localDate(it.recorded);
    if (!rd) continue;
    if (asOfDate && rd.slice(0, 10) > asOfDate) continue;
    inScope.push(it);
  }

  // Corrections: superseded or retracted (same issuer), transitive by construction.
  const dead = new Set<string>();
  const key = (iss: string, id: string) => iss + "\u0000" + id;
  for (const it of inScope) {
    const lists: unknown[] = [];
    if (Array.isArray(it.supersedes)) lists.push(...it.supersedes);
    if (Array.isArray(it.retracts)) lists.push(...it.retracts);
    for (const e of Object.values(it.payload ?? {})) {
      if (e && typeof e === "object" && (e as any).type === "chart_correction" && Array.isArray((e as any).voided_items)) {
        lists.push(...(e as any).voided_items);
      }
    }
    for (const id of lists) if (typeof id === "string") dead.add(key(it.issuer, id));
  }
  const current = inScope.filter((it) => !dead.has(key(it.issuer, it.id)));

  // Flatten entries.
  const byType: Record<string, Ev[]> = {};
  for (const it of current) {
    const payload = it.payload;
    if (!payload || typeof payload !== "object") continue;
    for (const [entryId, e] of Object.entries(payload)) {
      if (!e || typeof e !== "object" || typeof (e as any).type !== "string") continue;
      const ev: Ev = { item: it, entryId, e: e as Entry, sortKey: timeKey(it.effective), recKey: timeKey(it.recorded) };
      (byType[(e as any).type] ??= []).push(ev);
    }
  }
  const evs = (t: string) => byType[t] ?? [];

  try { out.medications = mapMedications(evs("med_event")); } catch { out.medications = []; }
  let problemAllergies: PendingAllergy[] = [];
  try {
    const r = mapProblems(evs("problem_event"), evs("med_event"));
    out.problems = r.rows;
    problemAllergies = r.allergies;
  } catch { out.problems = []; }
  try { out.allergies = mapAllergies(evs("allergy_event"), problemAllergies); } catch { out.allergies = []; }
  try { out.labs = mapLabs(evs("imported_result")); } catch { out.labs = []; }
  try { out.vitals = mapVitals(evs("vital_set")); } catch { out.vitals = []; }
  return out;
}

function groupBy(list: Ev[], idField: string): Map<string, Ev[]> {
  const m = new Map<string, Ev[]>();
  for (const v of list) {
    const id = v.e[idField];
    if (typeof id !== "string" || id === "") continue;
    let arr = m.get(id);
    if (!arr) m.set(id, (arr = []));
    arr.push(v);
  }
  for (const arr of m.values()) arr.sort(cmpEv);
  return m;
}

// ───────────────────────────── medications ─────────────────────────────

function mapMedications(list: Ev[]): MedicationRow[] {
  const lines = groupBy(list, "med_id");
  const best = new Map<string, { row: MedicationRow; last: Ev }>();
  for (const [medId, events] of lines) {
    const valid = events.filter((v) => ["start", "change", "hold", "resume", "stop"].includes(v.e.action));
    if (valid.length === 0) continue;
    const last = valid[valid.length - 1];
    const e = last.e;
    const name = str(e.drug?.name);
    if (!name) continue;
    if (isHospitalOnly(name)) continue;

    let status: MedicationRow["status"];
    let sinceEv: Ev = last;
    if (e.action === "stop") {
      status = "stopped";
    } else if (e.action === "hold") {
      status = "held";
      // The hold began at the first hold of the current run of holds (changes while held keep it held).
      for (let i = valid.length - 1; i >= 0; i--) {
        const a = valid[i].e.action;
        if (a === "hold") sinceEv = valid[i];
        else break;
      }
    } else {
      status = "active";
      for (let i = valid.length - 1; i >= 0; i--) {
        const a = valid[i].e.action;
        if (a === "start" || a === "resume") { sinceEv = valid[i]; break; }
        if (i === 0) sinceEv = valid[0];
      }
    }
    const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: [] };
    const ing = ingredientOf(name);
    if (ing) row.ingredient = ing;
    const since = localDate(sinceEv.item.effective);
    if (since) row.status_since = since;
    const dose = medDose(e, name);
    if (dose) row.dose = dose;
    const freq = medFrequency(e);
    if (freq) row.frequency = freq;
    if (status === "stopped") {
      if (typeof e.stop_reason === "string" && STOP_REASONS.has(e.stop_reason)) row.stop_reason = e.stop_reason as MedicationRow["stop_reason"];
      else if (str(e.reason_text)) row.stop_reason = "other";
    }
    if (status === "stopped" || status === "held") {
      const rt = str(e.reason_text) ?? str(sinceEv.e.reason_text);
      if (rt) row.status_reason_text = rt;
    }
    if (events.some((v) => v.e.restricted === "BH")) row.sensitivity = ["mental-health"];
    row.evidence = evidenceOf(events);

    const groupKey = ing ?? name.toLowerCase() + "\u0000" + medId;
    const prev = best.get(groupKey);
    if (!prev || cmpEv(prev.last, last) < 0) best.set(groupKey, { row, last });
  }
  return [...best.values()]
    .sort((a, b) => cmpEv(a.last, b.last))
    .map((x) => x.row);
}

// ───────────────────────────── problems ─────────────────────────────

interface PendingAllergy {
  row: AllergyIntoleranceRow;
  classLabel?: string;
  classMembers?: string[];
  last: Ev;
}

const T_ADVERSE = /^T(3[6-9]|4\d|50)\.[0-9A-Z]{1,2}X?5[A-Z]?$|^T(3[6-9]|4\d|50)\.\w*5[ADS]?$/i;

function isCkd(icd: string | undefined, desc: string): boolean {
  if (icd && /^N18(\.|$)/i.test(icd)) return true;
  return /^(chronic kidney disease|ckd)\b/i.test(desc.trim());
}

function ckdStage(icd: string | undefined, desc: string): ProblemRow["ckd_stage"] | undefined {
  const d = desc.toLowerCase();
  let m = /\bg(1|2|3a|3b|4|5)\b/.exec(d);
  if (m) return ("G" + m[1]) as ProblemRow["ckd_stage"];
  m = /stage\s*(1|2|3a|3b|4|5|i{1,3}a?|i{2,3}b|iv|v)\b/.exec(d);
  if (m) {
    const s = m[1];
    const roman: Record<string, string> = { i: "1", ii: "2", iiia: "3a", iiib: "3b", iv: "4", v: "5" };
    const k = roman[s] ?? s;
    if (["1", "2", "3a", "3b", "4", "5"].includes(k)) return ("G" + k) as ProblemRow["ckd_stage"];
  }
  if (/end[- ]stage|\besrd\b|\beskd\b/.test(d)) return "G5";
  switch ((icd ?? "").toUpperCase()) {
    case "N18.1": return "G1";
    case "N18.2": return "G2";
    case "N18.31": return "G3a";
    case "N18.32": return "G3b";
    case "N18.4": return "G4";
    case "N18.5": return "G5";
    case "N18.6": return "G5";
  }
  return undefined;
}

function albuminuria(desc: string): ProblemRow["albuminuria"] | undefined {
  const d = desc.toLowerCase();
  const m = /\ba([123])\b/.exec(d);
  if (m) return ("A" + m[1]) as ProblemRow["albuminuria"];
  if (/severely increased albuminuria|macroalbuminuria/.test(d)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria/.test(d)) return "A2";
  if (/normal to mildly increased albuminuria/.test(d)) return "A1";
  return undefined;
}

/** Drug or drug class a problem description attributes the condition to, if any. */
function drugCause(desc: string, icd: string | undefined): { phrase: string; condition: boolean } | undefined {
  const d = desc.trim();
  const tcode = !!icd && T_ADVERSE.test(icd.toUpperCase());
  let phrase: string | undefined;
  let m = /^(.+?)[- ](?:associated|induced|related)\b/i.exec(d);
  if (m) phrase = m[1];
  if (!phrase) {
    m = /\b(?:due to|caused by|secondary to|from|associated with|induced by)\s+(.+)$/i.exec(d);
    if (m && (KNOWN_DRUGS_IN(m[1]) || DRUG_CLASSES.some((c) => c.re.test(m![1])) || tcode)) phrase = m[1];
  }
  if (!phrase) {
    m = /adverse (?:effect|reaction)s? (?:of|to)\s+(.+)$/i.exec(d);
    if (m) phrase = m[1];
  }
  if (!phrase) return undefined;
  const isDrug = KNOWN_DRUGS_IN(phrase) || DRUG_CLASSES.some((c) => c.re.test(phrase!)) || tcode;
  if (!isDrug) return undefined;
  const onlyEffect = /^\s*adverse (effect|reaction)s? (of|to)\b/i.test(d);
  return { phrase, condition: !onlyEffect };
}

function KNOWN_DRUGS_IN(s: string): boolean {
  const l = s.toLowerCase();
  for (const d of KNOWN_DRUGS) if (new RegExp("\\b" + d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b").test(l)) return true;
  for (const b of Object.keys(BRANDS)) if (new RegExp("\\b" + b + "\\b").test(l)) return true;
  return false;
}

function mapProblems(list: Ev[], meds: Ev[]): { rows: ProblemRow[]; allergies: PendingAllergy[] } {
  const lines = groupBy(list, "problem_id");
  const byCondition = new Map<string, { row: ProblemRow; last: Ev; evs: Ev[] }>();
  const allergies: PendingAllergy[] = [];

  for (const [pid, events] of lines) {
    const valid = events.filter((v) => ["add", "update", "resolve", "remove"].includes(v.e.action));
    if (valid.length === 0) continue;
    let status: "active" | "resolved" | "removed" = "active";
    for (const v of valid) {
      if (v.e.action === "add") status = "active";
      else if (v.e.action === "resolve") status = "resolved";
      else if (v.e.action === "remove") status = "removed";
      else if (v.e.action === "update" && status === "removed") status = "active";
    }
    if (status === "removed") continue;
    const last = valid[valid.length - 1];
    const e = last.e;
    const desc = str(e.description);
    if (!desc) continue;
    if (/^(rule out|r\/o\b|suspected|possible|probable|query|\?)/i.test(desc) || /\bruled out\b/i.test(desc)) continue;
    const icd = str(e.icd10cm);
    const restricted = valid.some((v) => v.e.restricted === "BH");

    // Drug-caused diagnoses also yield an allergy row.
    const cause = drugCause(desc, icd);
    if (cause) {
      const pa = drugAllergyFromProblem(cause.phrase, desc, last, meds);
      if (pa) {
        pa.row.evidence = evidenceOf(valid);
        if (restricted) pa.row.sensitivity = ["mental-health"];
        allergies.push(pa);
      }
      if (!cause.condition) continue;
    }

    const row: ProblemRow = { condition: desc, status: status, evidence: [] };
    if (icd) row.icd10cm = icd;
    const snomed = str(e.snomed);
    if (snomed) row.snomed = snomed;
    const onset = fuzzy(e.onset) ?? (() => {
      for (let i = valid.length - 1; i >= 0; i--) { const f = fuzzy(valid[i].e.onset); if (f) return f; }
      return undefined;
    })();
    if (onset) row.onset = onset;
    const ckd = isCkd(icd, desc);
    if (ckd) {
      const st = ckdStage(icd, desc);
      if (st) row.ckd_stage = st;
      const al = albuminuria(desc);
      if (al) row.albuminuria = al;
    }
    if (restricted) row.sensitivity = ["mental-health"];

    const condKey = ckd ? "CKD" : icd ? "ICD:" + icd.toUpperCase() : "DESC:" + desc.toLowerCase() + "\u0000" + pid;
    const prev = byCondition.get(condKey);
    if (!prev) {
      row.evidence = evidenceOf(valid);
      byCondition.set(condKey, { row, last, evs: [...valid] });
    } else {
      const evsAll = [...prev.evs, ...valid].sort(cmpEv);
      const winner = cmpEv(prev.last, last) < 0 ? { row, last } : { row: prev.row, last: prev.last };
      // Active beats resolved when two lines record the same condition.
      if (prev.row.status !== row.status) {
        const act = prev.row.status === "active" ? prev : { row, last };
        winner.row = act.row;
        winner.last = act.last;
      }
      if (ckd) {
        // Stage/albuminuria: most recently recorded across the lines.
        const newer = cmpEv(prev.last, last) < 0 ? row : prev.row;
        const older = newer === row ? prev.row : row;
        const st = newer.ckd_stage ?? older.ckd_stage;
        const al = newer.albuminuria ?? older.albuminuria;
        if (st) winner.row.ckd_stage = st;
        if (al) winner.row.albuminuria = al;
      }
      if (prev.row.sensitivity || row.sensitivity) winner.row.sensitivity = ["mental-health"];
      winner.row.evidence = evidenceOf(evsAll);
      byCondition.set(condKey, { row: winner.row, last: winner.last, evs: evsAll });
    }
  }
  const rows = [...byCondition.values()].sort((a, b) => cmpEv(a.last, b.last)).map((x) => x.row);
  return { rows, allergies };
}

function drugAllergyFromProblem(phrase: string, desc: string, last: Ev, meds: Ev[]): PendingAllergy | undefined {
  const p = phrase.toLowerCase();
  let substance: string | undefined;
  for (const d of KNOWN_DRUGS) {
    if (new RegExp("\\b" + d + "\\b").test(p)) { substance = d; break; }
  }
  if (!substance) for (const [b, g] of Object.entries(BRANDS)) if (new RegExp("\\b" + b + "\\b").test(p)) { substance = g; break; }
  let classLabel: string | undefined;
  let classMembers: string[] | undefined;
  if (!substance) {
    const cls = DRUG_CLASSES.find((c) => c.re.test(phrase));
    if (cls) {
      classLabel = cls.label;
      classMembers = cls.members;
      // The one drug of that class on the medication list in the same item, if exactly one.
      const sameItem = new Set<string>();
      for (const m of meds) {
        if (m.item.id !== last.item.id) continue;
        const ing = ingredientOf(String(m.e.drug?.name ?? ""));
        if (ing && cls.members.includes(ing)) sameItem.add(ing);
      }
      if (sameItem.size === 1) substance = [...sameItem][0];
    }
  }
  if (!substance) substance = phrase.trim().replace(/\s+/g, " ");
  if (!substance) return undefined;
  const condText = desc;
  let reaction_type: AllergyIntoleranceRow["reaction_type"];
  if (/angioedema|anaphyla|urticaria|hives|rash|bronchospasm/i.test(condText)) reaction_type = "hypersensitivity";
  else if (SERIOUS.test(condText)) reaction_type = "serious_adverse_event";
  else if (SIDE.test(condText)) reaction_type = "side_effect";
  else reaction_type = "serious_adverse_event";
  let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
  if (/ketoacidosis|lactic acidosis|hyperkalemia/i.test(condText)) mechanism = "non_immune";
  else if ((isAce(substance) || classLabel === "ACE inhibitor") && /cough|angioedema/i.test(condText)) mechanism = "non_immune";
  const row: AllergyIntoleranceRow = { substance, reaction_type, mechanism, criticality: "unknown", evidence: [] };
  const reaction = desc.replace(/^\s*adverse (effect|reaction)s? (of|to)\s+.+$/i, "").trim();
  if (reaction) row.reaction = reaction;
  const onset = fuzzy(last.e.onset);
  if (onset) row.onset = onset;
  return { row, classLabel: classMembers && substance === phrase.trim() ? classLabel : undefined, classMembers, last };
}

// ───────────────────────────── allergies ─────────────────────────────

function mapAllergies(list: Ev[], fromProblems: PendingAllergy[]): AllergyIntoleranceRow[] {
  const lines = groupBy(list, "allergy_id");
  const bySubstance = new Map<string, { row: AllergyIntoleranceRow; last: Ev; evs: Ev[] }>();
  for (const [, events] of lines) {
    const valid = events.filter((v) => ["add", "update", "inactivate"].includes(v.e.action));
    if (valid.length === 0) continue;
    const last = valid[valid.length - 1];
    if (last.e.action === "inactivate") continue;
    const e = last.e;
    const sname = str(e.substance?.name);
    if (!sname) continue;
    const rx = str(e.substance?.rxnorm);
    const substance = rx ? (ingredientOf(sname) ?? sname.toLowerCase()) : sname;
    const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.filter((r: unknown) => typeof r === "string" && r.trim() !== "").map((r: string) => r.trim()) : [];
    const rtext = reactions.join("; ");
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: allergyReactionType(e.reaction_type, rtext),
      mechanism: allergyMechanism(e.reaction_type, substance.toLowerCase(), rtext),
      criticality: e.severity === "high" ? "high" : e.severity === "low" ? "low" : "unknown",
      evidence: evidenceOf(valid),
    };
    if (rx) row.rxnorm_ingredient = rx;
    if (rtext) row.reaction = rtext;
    const onset = fuzzy(e.onset);
    if (onset) row.onset = onset;
    if (valid.some((v) => v.e.restricted === "BH")) row.sensitivity = ["mental-health"];
    const k = substance.toLowerCase();
    const prev = bySubstance.get(k);
    if (!prev || cmpEv(prev.last, last) < 0) {
      if (prev) row.evidence = evidenceOf([...prev.evs, ...valid].sort(cmpEv));
      bySubstance.set(k, { row, last, evs: prev ? [...prev.evs, ...valid] : valid });
    } else {
      prev.row.evidence = evidenceOf([...prev.evs, ...valid].sort(cmpEv));
      prev.evs.push(...valid);
    }
  }

  for (const pa of fromProblems) {
    let k = pa.row.substance.toLowerCase();
    // A class-only row merges into the list's single entry for a drug of that class.
    if (pa.classMembers && pa.classLabel) {
      const hits = [...bySubstance.keys()].filter((s) => pa.classMembers!.includes(s));
      if (hits.length === 1) k = hits[0];
    }
    const prev = bySubstance.get(k);
    if (prev) {
      prev.row.evidence = [...prev.row.evidence, ...pa.row.evidence.filter((x) => !prev.row.evidence.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id))];
      if (pa.row.sensitivity && !prev.row.sensitivity) prev.row.sensitivity = pa.row.sensitivity;
    } else {
      bySubstance.set(k, { row: pa.row, last: pa.last, evs: [] });
    }
  }
  return [...bySubstance.values()].sort((a, b) => cmpEv(a.last, b.last)).map((x) => x.row);
}

// ───────────────────────────── labs ─────────────────────────────

function mapLabs(list: Ev[]): LabResultRow[] {
  const STATUS_RANK: Record<string, number> = { P: 1, F: 2, C: 3 };
  // Race-variant siblings: (item, accession) groups that carry a non-race eGFR.
  const hasNaa = new Set<string>();
  for (const v of list) {
    if (egfrRaceVariant(v.e) === "naa") hasNaa.add(v.item.id + "\u0000" + String(v.e.external_ref?.accession ?? ""));
  }
  const best = new Map<string, { row: LabResultRow; v: Ev; rank: number }>();
  for (const v of list) {
    const e = v.e;
    const unit = typeof e.unit === "string" ? e.unit : "";
    const analyte = classifyLab(e.test ?? {}, e.external_ref, unit);
    if (!analyte) continue;
    const status = e.result_status;
    if (status !== "P" && status !== "F" && status !== "C") continue;
    const parsed = parseLabValue(e.value);
    if (!parsed) continue;
    if (analyte === "egfr") {
      const rv = egfrRaceVariant(e);
      if (rv === "aa" && hasNaa.has(v.item.id + "\u0000" + String(e.external_ref?.accession ?? ""))) continue;
    }
    const value = convertLab(analyte, parsed.value, unit);
    if (value === undefined || !isFinite(value)) continue;
    const collected = str(e.collected) ?? str(v.item.effective);
    if (!collected) continue;
    const row: LabResultRow = {
      analyte,
      value,
      unit: ANALYTE_UNIT[analyte],
      collected,
      status: status === "P" ? "preliminary" : "final",
      evidence: [{ item_id: v.item.id, entry_id: v.entryId }],
    };
    if (parsed.comparator) row.comparator = parsed.comparator;
    if (analyte === "egfr") row.egfr_equation = egfrEquation(e);
    const loinc = str(e.test?.loinc);
    if (loinc) row.loinc = loinc;

    const acc = str(e.external_ref?.accession);
    const comp = str(e.external_ref?.result_code) ?? str(e.test?.nfm_code) ?? v.entryId;
    const k = acc ? `${acc}\u0000${comp}` : `${v.item.id}\u0000${v.entryId}`;
    const rank = STATUS_RANK[status] ?? 0;
    const prev = best.get(k);
    if (!prev || rank > prev.rank || (rank === prev.rank && cmpNum(prev.v.recKey, v.recKey) < 0)) best.set(k, { row, v, rank });
  }
  // A withdrawn component (non-numeric corrected value) in a current item cancels other copies of it.
  for (const v of list) {
    if (v.e.result_status !== "C") continue;
    if (parseLabValue(v.e.value)) continue;
    const acc = str(v.e.external_ref?.accession);
    const comp = str(v.e.external_ref?.result_code) ?? str(v.e.test?.nfm_code);
    if (!acc || !comp) continue;
    const k = `${acc}\u0000${comp}`;
    const prev = best.get(k);
    if (prev && cmpNum(prev.v.recKey, v.recKey) <= 0) best.delete(k);
  }
  return [...best.values()]
    .sort((a, b) => cmpNum(timeKey(a.row.collected), timeKey(b.row.collected)) || cmpEv(a.v, b.v))
    .map((x) => x.row);
}

// ───────────────────────────── vitals ─────────────────────────────

function parseBp(s: unknown): { sys: number; dia: number } | undefined {
  if (typeof s !== "string") return undefined;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(s);
  if (!m) return undefined;
  const sys = parseInt(m[1], 10), dia = parseInt(m[2], 10);
  if (!(sys > 0 && dia > 0)) return undefined;
  return { sys, dia };
}

function mapVitals(list: Ev[]): VitalRow[] {
  const rows: { row: VitalRow; v: Ev }[] = [];
  for (const v of list) {
    const e = v.e;
    const lt = localDateTime(v.item.effective);
    const ltr = lt && lt.time ? lt : localDateTime(v.item.recorded);
    if (!ltr || !ltr.time || ltr.date.length !== 10) continue;
    const row: VitalRow = { setting: "clinic", local_time: `${ltr.date}T${ltr.time}`, evidence: [{ item_id: v.item.id, entry_id: v.entryId }] };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp.sys; row.diastolic_mmhg = bp.dia; }
    const rep = parseBp(e.bp_repeat);
    if (rep) {
      if (bp) { row.repeat_systolic_mmhg = rep.sys; row.repeat_diastolic_mmhg = rep.dia; }
      else { row.systolic_mmhg = rep.sys; row.diastolic_mmhg = rep.dia; }
    }
    if (typeof e.pulse_bpm === "number" && isFinite(e.pulse_bpm) && e.pulse_bpm > 0) row.pulse_bpm = e.pulse_bpm;
    if (typeof e.weight_lb === "number" && isFinite(e.weight_lb) && e.weight_lb > 0) row.weight_kg = Math.round(e.weight_lb * 0.45359237 * 10) / 10;
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    rows.push({ row, v });
  }
  return rows.sort((a, b) => cmpEv(a.v, b.v)).map((x) => x.row);
}
