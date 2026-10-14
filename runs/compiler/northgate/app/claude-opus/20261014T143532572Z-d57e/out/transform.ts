import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Evidence, Sensitivity, Analyte, PartialDate,
} from "../in/views/views";

// Mapper for Northgate Family Medicine (northgate-chart-v1 ChartEvent payloads) into consumer views v2.

const TZ = "America/Chicago";

// ───────────────────────────── time helpers ─────────────────────────────

const OFFSET_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i;
const LOCAL_DT_RE = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/;
const DATE_RE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

let fmt: Intl.DateTimeFormat | null = null;
function chicagoFormatter(): Intl.DateTimeFormat {
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  }
  return fmt;
}

interface Wall { y: number; mo: number; d: number; h: number; mi: number; s: number }

function wallAt(ms: number): Wall {
  const parts = chicagoFormatter().formatToParts(new Date(ms));
  const get = (t: string) => Number(parts.find(p => p.type === t)?.value ?? "0");
  return { y: get("year"), mo: get("month"), d: get("day"), h: get("hour") % 24, mi: get("minute"), s: get("second") };
}

/** Offset of Chicago from UTC at an instant, in ms (negative). */
function offsetAt(ms: number): number {
  const w = wallAt(ms);
  return Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, w.s) - Math.floor(ms / 1000) * 1000;
}

/** Instant of a Chicago wall-clock time. */
function chicagoWallToMs(y: number, mo: number, d: number, h: number, mi: number, s: number): number {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  let ms = guess - offsetAt(guess);
  ms = guess - offsetAt(ms);
  return ms;
}

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

/** Instant (ms) of a date-time string; a no-offset date-time is Chicago local; a date is Chicago midnight. */
function toMs(s: unknown): number | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (OFFSET_RE.test(t)) { const v = Date.parse(t); return isNaN(v) ? null : v; }
  let m = LOCAL_DT_RE.exec(t);
  if (m) return chicagoWallToMs(+m[1], +m[2], +m[3], +m[4], +m[5], +(m[6] ?? 0));
  m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(t);
  if (m) return chicagoWallToMs(+m[1], +(m[2] ?? 1), +(m[3] ?? 1), 0, 0, 0);
  return null;
}

/** Local Chicago wall clock "YYYY-MM-DDTHH:MM" for a date-time; null for dates or unreadable. */
function localTime(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (OFFSET_RE.test(t)) {
    const v = Date.parse(t);
    if (isNaN(v)) return null;
    const w = wallAt(v);
    return `${w.y}-${pad(w.mo)}-${pad(w.d)}T${pad(w.h)}:${pad(w.mi)}`;
  }
  const m = LOCAL_DT_RE.exec(t);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
  return null;
}

/** Local Chicago date (keeping a partial date's precision). */
function localDate(s: unknown): PartialDate | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (DATE_RE.test(t)) return t;
  const lt = localTime(t);
  return lt ? lt.slice(0, 10) : undefined;
}

/** RFC 3339 with offset; a no-offset date-time is taken as Chicago local and given its offset. */
function withOffset(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (OFFSET_RE.test(t)) return isNaN(Date.parse(t)) ? null : t;
  const m = LOCAL_DT_RE.exec(t);
  if (m) {
    const ms = chicagoWallToMs(+m[1], +m[2], +m[3], +m[4], +m[5], +(m[6] ?? 0));
    const off = Math.round(offsetAt(ms) / 60000);
    const sign = off < 0 ? "-" : "+";
    const a = Math.abs(off);
    return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? "00"}${sign}${pad(Math.floor(a / 60))}:${pad(a % 60)}`;
  }
  return null;
}

function fuzzy(o: any): { value: PartialDate; precision: 'year' | 'month' | 'day' } | undefined {
  if (!o || typeof o !== "object" || typeof o.date !== "string") return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(o.date.trim());
  if (!m) return undefined;
  let p: 'year' | 'month' | 'day' = o.precision === "year" || o.precision === "month" || o.precision === "day" ? o.precision : "day";
  if (p === "day" && !m[3]) p = m[2] ? "month" : "year";
  if (p === "month" && !m[2]) p = "year";
  const value = p === "year" ? m[1] : p === "month" ? `${m[1]}-${m[2]}` : `${m[1]}-${m[2]}-${m[3]}`;
  return { value, precision: p };
}

// ───────────────────────────── entries & ordering ─────────────────────────────

interface Entry { item: FolioItem; id: string; e: any; seq: number }

/** Clinical ordering: by effective (at the coarser precision when one side is a date), then recorded. */
function cmpEntries(a: Entry, b: Entry): number {
  const ea = String(a.item.effective ?? ""), eb = String(b.item.effective ?? "");
  const aDate = DATE_RE.test(ea), bDate = DATE_RE.test(eb);
  let c = 0;
  if (aDate || bDate) {
    const da = localDate(ea) ?? "", db = localDate(eb) ?? "";
    const n = Math.min(da.length, db.length);
    c = da.slice(0, n) < db.slice(0, n) ? -1 : da.slice(0, n) > db.slice(0, n) ? 1 : 0;
  } else {
    const ma = toMs(ea), mb = toMs(eb);
    if (ma !== null && mb !== null) c = ma - mb;
  }
  if (c !== 0) return c;
  const ra = toMs(a.item.recorded) ?? 0, rb = toMs(b.item.recorded) ?? 0;
  if (ra !== rb) return ra - rb;
  return a.seq - b.seq;
}

const ev = (x: Entry) => ({ item_id: x.item.id, entry_id: x.id });

function evidenceOf(list: Entry[]): Evidence {
  const out: Evidence = [];
  const seen = new Set<string>();
  for (const x of list) {
    const k = x.item.id + "\u0000" + x.id;
    if (!seen.has(k)) { seen.add(k); out.push(ev(x)); }
  }
  return out;
}

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const num = (v: unknown): number | undefined => (typeof v === "number" && isFinite(v) ? v : undefined);
const round = (v: number, d: number) => { const f = Math.pow(10, d); return Math.round(v * f) / f; };

function restrictedSens(e: any): Sensitivity[] {
  return e && e.restricted === "BH" ? ["mental-health"] : [];
}

function icdSens(code: string | undefined): Sensitivity[] {
  if (!code) return [];
  const c = code.toUpperCase();
  if (/^F1[0-9]/.test(c)) return ["substance-use"];
  if (/^F/.test(c)) return ["mental-health"];
  if (/^(B20|Z21|B97\.35|A5[0-9]|A6[0-4])/.test(c)) return ["hiv-sti"];
  if (/^(O|Z3[0-9])/.test(c)) return ["sexual-reproductive-health"];
  return [];
}

function uniqSens(...lists: Sensitivity[][]): Sensitivity[] | undefined {
  const s = Array.from(new Set(lists.flat()));
  return s.length ? s : undefined;
}

// ───────────────────────────── drugs ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  glucophage: "metformin", januvia: "sitagliptin", tradjenta: "linagliptin", ozempic: "semaglutide",
  rybelsus: "semaglutide", wegovy: "semaglutide", victoza: "liraglutide", trulicity: "dulaglutide",
  mounjaro: "tirzepatide", zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril",
  altace: "ramipril", lotensin: "benazepril", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan",
  avapro: "irbesartan", micardis: "telmisartan", norvasc: "amlodipine", lipitor: "atorvastatin",
  crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin", lasix: "furosemide",
  microzide: "hydrochlorothiazide", aldactone: "spironolactone", kerendia: "finerenone",
  toprol: "metoprolol", lopressor: "metoprolol", coreg: "carvedilol", zoloft: "sertraline",
  lexapro: "escitalopram", prozac: "fluoxetine", wellbutrin: "bupropion", synthroid: "levothyroxine",
  eliquis: "apixaban", xarelto: "rivaroxaban", plavix: "clopidogrel", glucotrol: "glipizide",
  amaryl: "glimepiride", actos: "pioglitazone", zyloprim: "allopurinol", uloric: "febuxostat",
  prilosec: "omeprazole", protonix: "pantoprazole", tylenol: "acetaminophen", advil: "ibuprofen",
  motrin: "ibuprofen", aleve: "naproxen", neurontin: "gabapentin", flomax: "tamsulosin",
};

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "succinate", "tartrate", "calcium",
  "mesylate", "fumarate", "citrate", "sulfate", "acetate", "bromide", "dihydrate", "monohydrate",
  "hyclate", "magnesium", "phosphate", "propionate", "furoate", "medoxomil", "hydrobromide", "bitartrate",
  "trihydrate", "anhydrous", "disodium", "dipropionate", "xinafoate", "monosodium",
]);

const FORM_WORDS = /\b(oral|tablet|tablets|tab|tabs|capsule|capsules|cap|caps|extended|delayed|release|er|xr|xl|sr|dr|ec|odt|solution|suspension|injection|injectable|pen|injector|prefilled|syringe|cartridge|topical|cream|ointment|patch|inhaler|chewable|film|coated|disintegrating|kwikpen|flexpen|flextouch|solostar|auto-injector|vial)\b.*$/;

const PREFIX_QTY = /^(\d+(\.\d+)?\s*(ml|hr|actuat|day|unt|mg)\s+)+/;

function ingredientOne(raw: string): string | undefined {
  let s = raw.toLowerCase().replace(/\[[^\]]*\]/g, " ").replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  s = s.replace(PREFIX_QTY, "");
  const m = /^(.*?)(?:\s+\d[\d.,]*\s*(?:mg|mcg|ug|g|unt|units?|iu|ml|meq|%|mg\/ml|unt\/ml)?\b.*)?$/.exec(s);
  if (m) s = m[1].trim();
  s = s.replace(FORM_WORDS, "").trim();
  if (!s) return undefined;
  const words = s.split(" ").filter(Boolean);
  if (words.length > 1 && !SALTS.has(words[0])) {
    while (words.length > 1 && SALTS.has(words[words.length - 1])) words.pop();
  }
  s = words.join(" ");
  if (BRANDS[s]) return BRANDS[s];
  if (BRANDS[words[0]]) return BRANDS[words[0]];
  if (!/[a-z]/.test(s)) return undefined;
  return s;
}

function ingredientOf(name: string): string | undefined {
  const brand = /\[([^\]]+)\]/.exec(name);
  const parts = name.replace(/\[[^\]]*\]/g, " ").split(/\s+\/\s+|\s+and\s+/i);
  const ings: string[] = [];
  for (const p of parts) {
    const i = ingredientOne(p);
    if (i) ings.push(i);
  }
  if (!ings.length && brand) { const b = BRANDS[brand[1].trim().toLowerCase()]; if (b) ings.push(b); }
  if (!ings.length) return undefined;
  return Array.from(new Set(ings)).join(" / ");
}

/** Ingredient-level RxNorm CUIs (IN) for common ingredients; a code not here may be a product code. */
const RX_IN: Record<string, string> = {
  "29046": "lisinopril", "3827": "enalapril", "35296": "ramipril", "18867": "benazepril", "1998": "captopril",
  "52175": "losartan", "69749": "valsartan", "321064": "olmesartan", "83818": "irbesartan", "73494": "telmisartan",
  "17767": "amlodipine", "6809": "metformin", "274783": "insulin glargine", "1545653": "empagliflozin",
  "1488564": "dapagliflozin", "1373458": "canagliflozin", "83367": "atorvastatin", "301542": "rosuvastatin",
  "36567": "simvastatin", "42463": "pravastatin", "4603": "furosemide", "5487": "hydrochlorothiazide",
  "9997": "spironolactone", "6918": "metoprolol", "20352": "carvedilol", "593411": "sitagliptin",
  "1991302": "semaglutide", "475968": "liraglutide", "1551291": "dulaglutide", "4815": "glipizide",
  "25789": "glimepiride", "1191": "aspirin", "161": "acetaminophen", "5640": "ibuprofen", "7258": "naproxen",
  "10582": "levothyroxine", "36437": "sertraline", "321988": "escitalopram", "4493": "fluoxetine",
  "42347": "bupropion", "25480": "gabapentin", "519": "allopurinol", "7646": "omeprazole", "40790": "pantoprazole",
  "1364430": "apixaban", "1114195": "rivaroxaban", "32968": "clopidogrel", "2562811": "finerenone",
  "8591": "potassium chloride", "7052": "morphine", "1202": "atenolol", "3443": "diltiazem", "11170": "verapamil",
  "2599543": "tirzepatide", "1100699": "linagliptin", "33738": "pioglitazone", "86009": "insulin lispro",
  "51428": "insulin aspart", "1670007": "insulin degludec", "139825": "insulin detemir",
};

const CLASSES: { re: RegExp; label: string; members: string[] }[] = [
  { re: /\bace[- ]?inhibitors?\b|\bacei\b|angiotensin[- ]converting[- ]enzyme inhibitors?/i, label: "ACE inhibitor",
    members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"] },
  { re: /\bsglt-?2\s*(inhibitors?)?\b|sodium[- ]glucose co-?transporter[- ]2 inhibitors?/i, label: "SGLT2 inhibitor",
    members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin", "bexagliflozin"] },
  { re: /\b(arbs?|angiotensin (ii )?receptor blockers?)\b/i, label: "ARB",
    members: ["losartan", "valsartan", "olmesartan", "irbesartan", "telmisartan", "candesartan", "azilsartan"] },
  { re: /\bstatins?\b|hmg-?coa reductase inhibitors?/i, label: "statin",
    members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"] },
  { re: /\bglp-?1\s*(receptor agonists?|ras?)?\b/i, label: "GLP-1 receptor agonist",
    members: ["semaglutide", "liraglutide", "dulaglutide", "exenatide", "tirzepatide", "lixisenatide"] },
  { re: /\bdpp-?4\s*(inhibitors?)?\b/i, label: "DPP-4 inhibitor",
    members: ["sitagliptin", "linagliptin", "saxagliptin", "alogliptin"] },
  { re: /\bsulfonylureas?\b/i, label: "sulfonylurea", members: ["glipizide", "glimepiride", "glyburide"] },
  { re: /\bnsaids?\b/i, label: "NSAID", members: ["ibuprofen", "naproxen", "meloxicam", "diclofenac", "celecoxib", "ketorolac"] },
  { re: /\b(thiazides?|thiazide diuretics?)\b/i, label: "thiazide diuretic", members: ["hydrochlorothiazide", "chlorthalidone", "indapamide"] },
  { re: /\bloop diuretics?\b/i, label: "loop diuretic", members: ["furosemide", "bumetanide", "torsemide"] },
  { re: /\bpenicillins?\b/i, label: "penicillin", members: ["penicillin", "amoxicillin", "ampicillin", "dicloxacillin"] },
  { re: /\bsulfonamides?\b|\bsulfa\b/i, label: "sulfonamide", members: ["sulfamethoxazole"] },
  { re: /\binsulins?\b/i, label: "insulin", members: ["insulin glargine", "insulin lispro", "insulin aspart", "insulin degludec", "insulin detemir", "insulin regular", "insulin nph", "insulin isophane"] },
];

const KNOWN_DRUGS = new Set<string>([...Object.values(BRANDS), ...Object.values(RX_IN), ...CLASSES.flatMap(c => c.members)]);

/** ICD-10-CM adverse-effect T-code (T36–T50, 6th char 5) and the class it names, if known. */
function tcodeClass(code: string | undefined): { isAE: boolean; label?: string } {
  if (!code) return { isAE: false };
  const c = code.toUpperCase().replace(/\s/g, "");
  const m = /^T(3[6-9]|4[0-9]|50)\.?([0-9A-Z])([0-9A-Z])5/.exec(c);
  if (!m) return { isAE: false };
  const k = `T${m[1]}.${m[2]}`;
  const map: Record<string, string> = {
    "T46.4": "ACE inhibitor", "T38.3": "insulin and oral hypoglycemic drugs", "T46.6": "antihyperlipidemic drug",
    "T39.3": "NSAID", "T36.0": "penicillin", "T50.1": "loop diuretic", "T50.2": "thiazide diuretic",
  };
  return { isAE: true, label: map[k] };
}

const HYPERSENS = /\b(hives|urticaria|rash|angioedema|anaphyla\w*|bronchospasm|wheez\w*|swelling|pruritus|itch\w*|stevens|sjs|toxic epidermal|dress|lip swelling|tongue swelling|throat swelling|exanthem\w*|blister\w*)\b/i;
const SERIOUS = /\b(ketoacidosis|dka|lactic acidosis|hyperkalemia|acute kidney injury|aki|renal failure|pancreatitis|hypoglycemia|rhabdomyolysis|agranulocytosis|neutropenia|hepatotoxicity|liver injury|hepatitis|bleed\w*|hemorrhage|torsade\w*|qt prolongation|syncope|seizure\w*|fournier\w*|gangrene)\b/i;
const SIDE = /\b(cough|nausea|vomit\w*|diarrh\w*|gi upset|upset stomach|dyspepsia|myalgia\w*|muscle (aches?|pain)|headache|dizz\w*|fatigue|constipation|edema|ankle swelling|flushing|insomnia|drowsiness|somnolence|dry mouth|yeast infection|mycotic|urinary frequency)\b/i;

function isAceInhibitor(sub: string): boolean {
  return CLASSES[0].members.includes(sub) || /ace inhibitor/i.test(sub);
}

function classifyReaction(text: string, sub: string, sourceType?: string, severity?: string):
  { type: AllergyIntoleranceRow["reaction_type"]; mech: AllergyIntoleranceRow["mechanism"] } {
  const ace = isAceInhibitor(sub);
  if (/angioedema/i.test(text)) return { type: "hypersensitivity", mech: ace ? "non_immune" : "unknown" };
  if (HYPERSENS.test(text)) return { type: "hypersensitivity", mech: "unknown" };
  if (/\b(ketoacidosis|dka)\b/i.test(text)) return { type: "serious_adverse_event", mech: "non_immune" };
  if (SERIOUS.test(text)) return { type: "serious_adverse_event", mech: "unknown" };
  if (/\bcough\b/i.test(text)) return { type: "side_effect", mech: ace ? "non_immune" : "unknown" };
  if (SIDE.test(text)) return { type: "side_effect", mech: "unknown" };
  if (sourceType === "allergy") return { type: "hypersensitivity", mech: "unknown" };
  if (sourceType === "intolerance") return { type: "side_effect", mech: "unknown" };
  if (sourceType === "adverse_reaction") return { type: severity === "high" ? "serious_adverse_event" : "side_effect", mech: "unknown" };
  return { type: "serious_adverse_event", mech: "unknown" };
}

// ───────────────────────────── labs ─────────────────────────────

const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const LOINC: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "14682-9": "creatinine",
  "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr",
  "98979-8": "egfr", "50044-7": "egfr", "69405-9": "egfr", "77147-7": "egfr", "50210-4": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate",
  "33037-3": "anion_gap", "41276-7": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin",
  "20509-6": "hemoglobin", "53060-9": "bhb", "48357-8": "bhb", "2744-1": "ph", "2753-2": "ph", "11558-4": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "3040-3": "lipase", "1798-8": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

const NFM: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate",
  HCO3: "bicarbonate", TCO2: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", ANIONGAP: "anion_gap", BUN: "bun",
  GLU: "glucose", GLUC: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", ACR: "uacr", PLT: "platelets",
  WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase",
  LIP: "lipase", TROP: "troponin", TNI: "troponin", TROPI: "troponin", CHOL: "cholesterol", TC: "cholesterol",
  TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

function analyteOf(t: any): Analyte | undefined {
  const name = String(t?.name ?? "").toLowerCase();
  const code = String(t?.nfm_code ?? "").toUpperCase();
  const loinc = String(t?.loinc ?? "");
  if (/urine|\bur\b|random urine/.test(name) && !/albumin|microalb|acr/.test(name)) return undefined;
  if (/point of care|poc |meter|fingerstick/.test(name) && /glucose/.test(name)) return undefined;
  if (code.startsWith("EGFR") || /\begfr\b|glomerular/.test(name)) return "egfr";
  if (LOINC[loinc]) return LOINC[loinc];
  if (NFM[code]) return NFM[code];
  const c2 = code.replace(/[^A-Z0-9]/g, "");
  if (NFM[c2]) return NFM[c2];
  if (/albumin.*creatinine|microalb.*creat|\buacr\b/.test(name)) return "uacr";
  if (/creatinine/.test(name)) return "creatinine";
  if (/potassium/.test(name)) return "potassium";
  if (/sodium/.test(name)) return "sodium";
  if (/chloride/.test(name)) return "chloride";
  if (/bicarbonate|co2, total|total co2|carbon dioxide/.test(name)) return "bicarbonate";
  if (/anion gap/.test(name)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(name)) return "bun";
  if (/a1c|glycated h|glycohemoglobin/.test(name)) return "a1c";
  if (/glucose/.test(name)) return "glucose";
  if (/platelet/.test(name)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(name)) return "wbc";
  if (/hemoglobin|\bhgb\b/.test(name)) return "hemoglobin";
  if (/hydroxybutyrate/.test(name)) return "bhb";
  if (/\bph\b/.test(name)) return "ph";
  if (/pco2/.test(name)) return "pco2";
  if (/lipase/.test(name)) return "lipase";
  if (/troponin/.test(name) && !/troponin t/.test(name)) return "troponin";
  if (/\bhdl\b/.test(name)) return "hdl";
  if (/\bldl\b/.test(name)) return "ldl";
  if (/triglyceride/.test(name)) return "triglycerides";
  if (/cholesterol/.test(name)) return "cholesterol";
  return undefined;
}

function normUnit(u: string): string {
  return u.trim().toLowerCase().replace(/\s+/g, "").replace(/µ|μ/g, "u");
}

/** Convert value into the analyte's unit; null when the unit is not understood. */
function convert(a: Analyte, v: number, unitRaw: string): number | null {
  const u = normUnit(unitRaw);
  const thousands = ["10*3/ul", "10^3/ul", "x10e3/ul", "x10^3/ul", "k/ul", "thou/ul", "10*9/l", "10^9/l", "x10e9/l", "x10^9/l", "10e3/ul", "k/mm3", "10*3/mm3", "x10(3)/ul"];
  switch (a) {
    case "creatinine":
      if (u === "mg/dl") return v;
      if (u === "umol/l") return round(v / 88.42, 2);
      return null;
    case "egfr":
      if (["ml/min/1.73m2", "ml/min/{1.73_m2}", "ml/min/1.73m^2", "ml/min/1.73", "ml/min"].includes(u)) return v;
      return null;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      if (u === "mmol/l" || u === "meq/l") return v;
      if (a === "bhb" && u === "mg/dl") return round(v / 10.41, 2);
      return null;
    case "bun":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return round(v * 2.801, 1);
      return null;
    case "glucose":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 18.016);
      return null;
    case "a1c":
      if (u === "%" || u === "%hba1c" || u === "%ofhgb" || u === "%oftotalhgb") return v;
      if (u === "mmol/mol") return round(v / 10.929 + 2.15, 1);
      return null;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "mg/g{creat}" || u === "ug/mg" || u === "ug/mgcreat" || u === "mg/gcr") return v;
      if (u === "mg/mmol" || u === "mg/mmolcreat") return round(v * 8.84, 1);
      return null;
    case "platelets": case "wbc":
      if (thousands.includes(u)) return v;
      if (u === "/ul" || u === "cells/ul" || u === "/mm3") return round(v / 1000, 3);
      return null;
    case "hemoglobin":
      if (u === "g/dl") return v;
      if (u === "g/l") return round(v / 10, 1);
      return null;
    case "ph":
      if (u === "[ph]" || u === "ph" || u === "" || u === "units") return v;
      return null;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return v;
      if (u === "kpa") return round(v * 7.50062, 1);
      return null;
    case "lipase":
      if (u === "u/l" || u === "iu/l") return v;
      return null;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return round(v / 1000, 4);
      return null;
    case "cholesterol": case "hdl": case "ldl":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 38.67);
      return null;
    case "triglycerides":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 88.57);
      return null;
  }
  return null;
}

function egfrEquation(t: any, comment: string): LabResultRow["egfr_equation"] {
  const txt = `${comment} ${t?.name ?? ""}`.toLowerCase();
  if (/ckd[- ]?epi[^.]*2021|2021[^.]*ckd[- ]?epi|race[- ]free/.test(txt)) return "ckd-epi-2021";
  if (/ckd[- ]?epi[^.]*2009|2009[^.]*ckd[- ]?epi/.test(txt)) return "ckd-epi-2009";
  if (/\bmdrd\b/.test(txt)) return "mdrd";
  if (/ckd[- ]?epi/.test(txt)) return "unknown";
  const l = String(t?.loinc ?? "");
  if (l === "98979-8") return "ckd-epi-2021";
  if (l === "62238-1" || l === "88293-6" || l === "88294-4") return "ckd-epi-2009";
  if (l === "33914-3" || l === "48642-3" || l === "48643-1") return "mdrd";
  return "unknown";
}

function isRaceVariant(t: any, comment: string): boolean {
  const name = String(t?.name ?? "").toLowerCase();
  const code = String(t?.nfm_code ?? "").toUpperCase();
  const loinc = String(t?.loinc ?? "");
  if (/non[- ]?(african|black)/.test(name) || /-NAA$|NONAA|NON-AA/.test(code)) return false;
  if (/african|black/.test(name) || /-AA$/.test(code)) return true;
  if (loinc === "48643-1" || loinc === "88293-6") return true;
  void comment;
  return false;
}

const INVALID_TEXT = /\b(invalidated|not performed|cancel+ed|test not done|qns|quantity not sufficient|wrong patient|disregard|specimen rejected|entered in error)\b/i;

// ───────────────────────────── main ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    run(items, asOf, out);
  } catch {
    // never throw; return what was built
  }
  return out;
}

function run(itemsIn: FolioItem[], asOf: string, out: ViewRows): void {
  const items = (Array.isArray(itemsIn) ? itemsIn : []).filter(i => i && typeof i === "object" && typeof i.id === "string");
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(asOf ?? "").trim());
  const cutoff = m ? chicagoWallToMs(+m[1], +m[2], +m[3] + 1, 0, 0, 0) : Infinity;

  const inScope = items.filter(i => { const r = toMs(i.recorded); return r !== null && r < cutoff; });

  // Correction rules: envelope supersedes/retracts (same issuer) from any in-scope item.
  const dead = new Set<string>();
  const key = (issuer: string, id: string) => `${issuer}\u0000${id}`;
  for (const i of inScope) {
    for (const ref of [...(Array.isArray(i.supersedes) ? i.supersedes : []), ...(Array.isArray(i.retracts) ? i.retracts : [])]) {
      if (typeof ref === "string" && ref !== i.id) dead.add(key(i.issuer, ref));
    }
  }
  // Chart corrections (voided items) in current items void too.
  for (const i of inScope) {
    if (dead.has(key(i.issuer, i.id))) continue;
    for (const e of Object.values(i.payload ?? {})) {
      if (e && (e as any).type === "chart_correction" && Array.isArray((e as any).voided_items)) {
        for (const ref of (e as any).voided_items) if (typeof ref === "string" && ref !== i.id) dead.add(key(i.issuer, ref));
      }
    }
  }
  const current = inScope.filter(i => !dead.has(key(i.issuer, i.id)));
  current.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const entries: Entry[] = [];
  let seq = 0;
  for (const i of current) {
    const p = i.payload && typeof i.payload === "object" ? i.payload : {};
    for (const id of Object.keys(p).sort()) {
      const e = p[id];
      if (e && typeof e === "object" && typeof e.type === "string") entries.push({ item: i, id, e, seq: seq++ });
    }
  }
  const byType = (t: string) => entries.filter(x => x.e.type === t).sort(cmpEntries);

  const safe = (f: () => void) => { try { f(); } catch { /* skip */ } };
  const medEntries = byType("med_event");
  safe(() => mapMeds(medEntries, out));
  safe(() => mapProblemsAndAllergies(byType("problem_event"), byType("allergy_event"), medEntries,
    [...byType("billing_dx"), ...byType("referral_dx")], out));
  safe(() => mapLabs(byType("imported_result"), out));
  safe(() => mapVitals(byType("vital_set"), out));
}

// ───────────────────────────── medications ─────────────────────────────

const HOSPITAL_ONLY = /\b(intravenous|infusion|iv piggyback|ivpb|premix|in 0\.9 ?% sodium chloride|in dextrose|epidural|intrathecal)\b|\bsodium chloride 0\.9 ?%|\blactated ringer|\bdextrose 5 ?%/i;

function normDose(d: any, drugName: string): MedicationRow["dose"] | undefined {
  const v = num(d?.value);
  const u0 = str(d?.unit);
  if (v === undefined || !u0 || v <= 0) return undefined;
  const u = u0.toLowerCase().replace(/[\s.]/g, "");
  if (["mg", "milligram", "milligrams"].includes(u)) return { value: v, unit: "mg" };
  if (["mcg", "ug", "µg", "microgram", "micrograms"].includes(u)) return { value: v, unit: "mcg" };
  if (u === "g" || u === "gram" || u === "grams") return { value: round(v * 1000, 3), unit: "mg" };
  if (["unit", "units", "unt", "u", "iu", "[iu]", "[iu]s"].includes(u)) return { value: v, unit: "units" };
  if (["ml", "milliliter", "milliliters"].includes(u)) return { value: v, unit: "mL" };
  if (["tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "{tablet}", "{tbl}", "{capsule}"].includes(u)) {
    if (!/\s\/\s/.test(drugName)) {
      const s = /(\d+(?:\.\d+)?)\s*(MG|MCG)\b(?!\s*\/\s*(ML|ACTUAT|HR))/i.exec(drugName);
      if (s && /tablet|capsule|tab\b|cap\b/i.test(drugName + " " + u)) {
        const val = round(parseFloat(s[1]) * v, 4);
        return { value: val, unit: s[2].toLowerCase() === "mg" ? "mg" : "mcg" };
      }
    }
    return { value: v, unit: "tablet" };
  }
  return undefined;
}

function normFreq(f: unknown): MedicationRow["frequency"] | undefined {
  switch (f) {
    case "QD": case "BID": case "TID": case "QHS": case "PRN": return f;
    case "OTHER": return "other";
    default: return undefined;
  }
}

function mapMeds(meds: Entry[], out: ViewRows): void {
  const lines = new Map<string, Entry[]>();
  for (const x of meds) {
    const id = str(x.e.med_id);
    if (!id) continue;
    if (!lines.has(id)) lines.set(id, []);
    lines.get(id)!.push(x);
  }
  interface Built { row: MedicationRow; last: Entry; group: string }
  const built: Built[] = [];
  for (const [medId, evs] of lines) {
    evs.sort(cmpEntries);
    const last = evs[evs.length - 1];
    let drugName: string | undefined;
    let rx: string | undefined;
    for (const x of evs) { const n = str(x.e.drug?.name); if (n) drugName = n; const r = str(x.e.drug?.rxnorm); if (r) rx = r; }
    if (!drugName) continue;
    if (HOSPITAL_ONLY.test(drugName)) continue;
    const act = last.e.action;
    const status: MedicationRow["status"] =
      act === "stop" ? "stopped" : act === "hold" ? "held" : act === "start" || act === "resume" || act === "change" ? "active" : "unknown";
    let ingredient = ingredientOf(drugName);
    if (rx && RX_IN[rx]) ingredient = RX_IN[rx];
    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: evidenceOf(evs) };
    if (ingredient) row.ingredient = ingredient;
    if (rx && RX_IN[rx]) row.rxnorm_ingredient = rx;

    if (status === "active") {
      let since: string | undefined;
      for (const x of evs) if (x.e.action === "start" || x.e.action === "resume") since = localDate(x.item.effective);
      if (!since) since = localDate(evs[0].item.effective);
      if (since) row.status_since = since;
    } else if (status !== "unknown") {
      const d = localDate(last.item.effective);
      if (d) row.status_since = d;
    }
    let dose: MedicationRow["dose"] | undefined;
    let freq: MedicationRow["frequency"] | undefined;
    for (const x of evs) {
      if (x.e.dose !== undefined) dose = normDose(x.e.dose, drugName);
      const f = normFreq(x.e.frequency);
      if (f) freq = f;
    }
    if (dose) row.dose = dose;
    if (freq) row.frequency = freq;
    if (status === "stopped") {
      const r = last.e.stop_reason;
      if (["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(r)) row.stop_reason = r;
    }
    if (status === "stopped" || status === "held") {
      const t = str(last.e.reason_text);
      if (t) row.status_reason_text = t;
    }
    const sens = uniqSens(...evs.map(x => restrictedSens(x.e)));
    if (sens) row.sensitivity = sens;
    built.push({ row, last, group: ingredient ? `i:${ingredient}` : `m:${medId}` });
  }
  const best = new Map<string, Built>();
  for (const b of built) {
    const cur = best.get(b.group);
    if (!cur || cmpEntries(cur.last, b.last) < 0) best.set(b.group, b);
  }
  out.medications = Array.from(best.values()).map(b => b.row);
}

// ───────────────────────────── problems & allergies ─────────────────────────────

const RULED_OUT = /^\s*(r\/o\b|rule[sd]? out|ruled out|suspected|possible|probable|presumed|query|questionable|\?)/i;

function ckdFromCode(code: string | undefined): ProblemRow["ckd_stage"] | undefined {
  if (!code) return undefined;
  const c = code.toUpperCase().replace(/\s/g, "");
  const map: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  return map[c];
}

function ckdFromText(t: string): ProblemRow["ckd_stage"] | undefined {
  const s = t.toLowerCase();
  let m = /\bg(1|2|3a|3b|4|5)\b/.exec(s);
  if (m) return (`G${m[1]}`) as ProblemRow["ckd_stage"];
  m = /stage\s*(1|2|3a|3b|4|5|i{1,3}a?|i{1,3}b|iv|v)\b/.exec(s);
  if (m) {
    const r: Record<string, string> = { "1": "G1", "i": "G1", "2": "G2", "ii": "G2", "3a": "G3a", "iiia": "G3a", "3b": "G3b", "iiib": "G3b", "4": "G4", "iv": "G4", "5": "G5", "v": "G5" };
    return r[m[1]] as ProblemRow["ckd_stage"] | undefined;
  }
  if (/end[- ]stage renal|esrd|eskd/.test(s)) return "G5";
  return undefined;
}

const isCkd = (code: string | undefined, text: string) =>
  /^N18/i.test(code ?? "") || /chronic kidney disease|\bckd\b|chronic renal (insufficiency|disease|failure)/i.test(text);

function albuminuriaOf(t: string): ProblemRow["albuminuria"] | undefined {
  const m = /\bA([123])\b/.exec(t);
  return m ? (`A${m[1]}` as ProblemRow["albuminuria"]) : undefined;
}

/** Resolve a drug or class phrase to a substance. */
function resolveSubstance(phrase: string, sameItemIngredients: string[]): string | undefined {
  const p = phrase.trim().toLowerCase().replace(/[-\s]+$/, "");
  if (!p) return undefined;
  for (const d of KNOWN_DRUGS) if (new RegExp(`\\b${d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(p)) return d;
  for (const [b, g] of Object.entries(BRANDS)) if (new RegExp(`\\b${b}\\b`).test(p)) return g;
  for (const c of CLASSES) {
    if (c.re.test(p)) {
      const on = Array.from(new Set(sameItemIngredients.filter(i => c.members.includes(i))));
      return on.length === 1 ? on[0] : c.label;
    }
  }
  for (const i of sameItemIngredients) if (p.includes(i)) return i;
  return undefined;
}

interface DrugCause { substance: string; reaction: string; problemToo: boolean }

function drugCause(desc: string, code: string | undefined, sameItemIngredients: string[]): DrugCause | null {
  const t = tcodeClass(code);
  const aeOf = /^\s*(?:adverse (?:effect|reaction|drug reaction)|intolerance|allergy) (?:of|to)\s+(.+?)\s*(?:,.*)?$/i.exec(desc);
  if (aeOf) {
    const sub = resolveSubstance(aeOf[1], sameItemIngredients) ?? (t.label ?? aeOf[1].trim().toLowerCase());
    return { substance: sub, reaction: desc, problemToo: false };
  }
  const assoc = /^\s*(.+?)[\s-]+(?:associated|induced|related|-induced)\s+(.+?)\s*$/i.exec(desc);
  if (assoc) {
    const sub = resolveSubstance(assoc[1], sameItemIngredients);
    if (sub) return { substance: sub, reaction: assoc[2], problemToo: true };
  }
  const due = /^\s*(.+?)\s+(?:due to|secondary to|caused by|from)\s+(.+?)\s*$/i.exec(desc);
  if (due) {
    const sub = resolveSubstance(due[2], sameItemIngredients);
    if (sub) return { substance: sub, reaction: due[1], problemToo: true };
  }
  if (t.isAE) {
    const sub = resolveSubstance(desc, sameItemIngredients) ?? t.label ?? desc.toLowerCase();
    const namesCondition = !/^\s*adverse effect/i.test(desc);
    return { substance: sub, reaction: desc, problemToo: namesCondition };
  }
  return null;
}

function mapProblemsAndAllergies(probs: Entry[], allergies: Entry[], meds: Entry[], dxCodes: Entry[], out: ViewRows): void {
  // Latest CKD stage/albuminuria recorded by a clinician anywhere in this source's record.
  let ckdStage: ProblemRow["ckd_stage"] | undefined;
  let alb: ProblemRow["albuminuria"] | undefined;
  for (const x of [...probs, ...dxCodes].sort(cmpEntries)) {
    if (x.e.type === "problem_event" && x.e.action === "remove") continue;
    const code = str(x.e.icd10cm);
    const text = String(x.e.description ?? x.e.display ?? "");
    if (!isCkd(code, text)) continue;
    const s = ckdFromCode(code) ?? ckdFromText(text);
    if (s) ckdStage = s;
    const a = albuminuriaOf(text);
    if (a) alb = a;
  }

  const ingredientsInItem = (itemId: string) =>
    meds.filter(x => x.item.id === itemId).map(x => ingredientOf(String(x.e.drug?.name ?? ""))).filter((s): s is string => !!s);

  const groups = new Map<string, Entry[]>();
  for (const x of probs) {
    const id = str(x.e.problem_id);
    if (!id) continue;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id)!.push(x);
  }
  interface PB { row: ProblemRow; last: Entry; code?: string }
  const pbs: PB[] = [];
  const allergyRows: { row: AllergyIntoleranceRow; key: string }[] = [];

  for (const evs of groups.values()) {
    evs.sort(cmpEntries);
    const last = evs[evs.length - 1];
    if (last.e.action === "remove") continue;
    const desc = str(last.e.description);
    if (!desc) continue;
    if (RULED_OUT.test(desc) || /^Z03/i.test(str(last.e.icd10cm) ?? "")) continue;
    const code = str(last.e.icd10cm);
    const status: ProblemRow["status"] = last.e.action === "resolve" ? "resolved" : "active";
    let onset: ProblemRow["onset"];
    for (const x of evs) { const o = fuzzy(x.e.onset); if (o) onset = o; }
    const sens = uniqSens(...evs.map(x => restrictedSens(x.e)), icdSens(code));

    const dc = drugCause(desc, code, ingredientsInItem(last.item.id));
    if (dc) {
      const { type, mech } = classifyReaction(dc.reaction + " " + desc, dc.substance);
      // A bare "adverse effect of X" names no reaction: type is a default, criticality not derivable.
      const known = HYPERSENS.test(desc) || SERIOUS.test(desc) || SIDE.test(desc);
      const crit: AllergyIntoleranceRow["criticality"] = !known ? "unknown"
        : type === "serious_adverse_event" || /anaphyla|angioedema/i.test(desc) ? "high" : type === "side_effect" ? "low" : "unknown";
      const arow: AllergyIntoleranceRow = {
        substance: dc.substance, reaction_type: type, mechanism: mech, criticality: crit,
        evidence: evidenceOf(evs),
      };
      if (known) arow.reaction = dc.reaction;
      const rxIn = Object.entries(RX_IN).find(([, n]) => n === dc.substance);
      if (rxIn) arow.rxnorm_ingredient = rxIn[0];
      if (onset) arow.onset = onset;
      if (sens) arow.sensitivity = sens;
      allergyRows.push({ row: arow, key: dc.substance.toLowerCase() });
      if (!dc.problemToo) continue;
    }

    const row: ProblemRow = { condition: desc, status, evidence: evidenceOf(evs) };
    if (code) row.icd10cm = code;
    const sn = str(last.e.snomed);
    if (sn) row.snomed = sn;
    if (onset) row.onset = onset;
    if (isCkd(code, desc)) {
      if (ckdStage) row.ckd_stage = ckdStage;
      if (alb) row.albuminuria = alb;
    }
    if (sens) row.sensitivity = sens;
    pbs.push({ row, last, code });
  }
  // Same condition under several problem ids: one row, latest wins.
  const byCode = new Map<string, PB>();
  const rows: PB[] = [];
  for (const p of pbs) {
    const k = p.code ? `c:${p.code.toUpperCase()}` : `d:${p.row.condition.toLowerCase()}`;
    const cur = byCode.get(k);
    if (!cur) { byCode.set(k, p); rows.push(p); continue; }
    const [older, newer] = cmpEntries(cur.last, p.last) <= 0 ? [cur, p] : [p, cur];
    newer.row.evidence = [...older.row.evidence, ...newer.row.evidence];
    if (!newer.row.onset && older.row.onset) newer.row.onset = older.row.onset;
    byCode.set(k, newer);
    rows[rows.indexOf(cur)] = newer;
  }
  out.problems = rows.map(p => p.row);

  // Allergy list entries.
  const agroups = new Map<string, Entry[]>();
  for (const x of allergies) {
    const id = str(x.e.allergy_id);
    if (!id) continue;
    if (!agroups.has(id)) agroups.set(id, []);
    agroups.get(id)!.push(x);
  }
  const listRows: { row: AllergyIntoleranceRow; key: string }[] = [];
  for (const evs of agroups.values()) {
    evs.sort(cmpEntries);
    const last = evs[evs.length - 1];
    if (last.e.action === "inactivate") continue;
    const name = str(last.e.substance?.name);
    if (!name) continue;
    if (/^(nkda|nka|no known (drug )?allergies)/i.test(name)) continue;
    const rx = str(last.e.substance?.rxnorm);
    let substance = name.toLowerCase();
    if (rx && RX_IN[rx]) substance = RX_IN[rx];
    else { const ing = KNOWN_DRUGS.has(substance) ? substance : BRANDS[substance] ?? ingredientOf(name); if (ing && KNOWN_DRUGS.has(ing)) substance = ing; }
    const reactions = Array.isArray(last.e.reactions) ? last.e.reactions.filter((r: unknown) => typeof r === "string" && r.trim()).map((r: string) => r.trim()) : [];
    const reaction = reactions.join("; ");
    const { type, mech } = classifyReaction(reaction, substance, last.e.reaction_type, last.e.severity);
    const crit: AllergyIntoleranceRow["criticality"] = last.e.severity === "low" ? "low" : last.e.severity === "high" ? "high" : "unknown";
    const row: AllergyIntoleranceRow = { substance, reaction_type: type, mechanism: mech, criticality: crit, evidence: evidenceOf(evs) };
    if (rx) row.rxnorm_ingredient = rx;
    if (reaction) row.reaction = reaction;
    let onset: AllergyIntoleranceRow["onset"];
    for (const x of evs) { const o = fuzzy(x.e.onset); if (o) onset = o; }
    if (onset) row.onset = onset;
    listRows.push({ row, key: substance });
  }
  // Merge drug-caused diagnosis rows into a list entry for the same substance.
  const result = [...listRows];
  for (const a of allergyRows) {
    const hit = result.find(r => r.key === a.key);
    if (hit) {
      hit.row.evidence = [...hit.row.evidence, ...a.row.evidence];
      if (a.row.sensitivity) hit.row.sensitivity = uniqSens(hit.row.sensitivity ?? [], a.row.sensitivity);
    } else result.push(a);
  }
  out.allergies = result.map(r => r.row);
}

// ───────────────────────────── labs ─────────────────────────────

function mapLabs(results: Entry[], out: ViewRows): void {
  const rank = (s: unknown) => (s === "C" ? 3 : s === "F" ? 2 : s === "P" ? 1 : 0);
  const best = new Map<string, Entry>();
  for (const x of results) {
    const r = x.e.external_ref ?? {};
    const k = str(r.accession) && str(r.result_code)
      ? `${r.lab ?? ""}|${r.accession}|${r.result_code}`
      : `${x.item.id}|${x.id}`;
    const cur = best.get(k);
    if (!cur) { best.set(k, x); continue; }
    const dr = rank(x.e.result_status) - rank(cur.e.result_status);
    const later = (toMs(x.e.resulted) ?? 0) - (toMs(cur.e.resulted) ?? 0);
    if (dr > 0 || (dr === 0 && (later > 0 || (later === 0 && cmpEntries(cur, x) < 0)))) best.set(k, x);
  }
  const rows: LabResultRow[] = [];
  for (const x of best.values()) {
    const e = x.e;
    const analyte = analyteOf(e.test);
    if (!analyte) continue;
    const comment = String(e.comment ?? "");
    const vraw = typeof e.value === "number" ? String(e.value) : str(e.value);
    if (!vraw) continue;
    const vm = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(vraw);
    if (!vm) continue;
    if (e.result_status === "C" && INVALID_TEXT.test(comment) && /corrected[^.]*(invalidated|not performed|cancel|disregard)/i.test(comment)) continue;
    if (analyte === "egfr" && isRaceVariant(e.test, comment)) continue;
    const v = convert(analyte, parseFloat(vm[2]), String(e.unit ?? ""));
    if (v === null) continue;
    const collected = withOffset(e.collected) ?? withOffset(x.item.effective);
    if (!collected) continue;
    const row: LabResultRow = {
      analyte, value: v, unit: UNIT[analyte], collected,
      status: e.result_status === "P" ? "preliminary" : "final",
      evidence: [ev(x)],
    };
    const cmp = vm[1] === "≤" ? "<=" : vm[1] === "≥" ? ">=" : vm[1];
    if (cmp) row.comparator = cmp as LabResultRow["comparator"];
    if (analyte === "egfr") row.egfr_equation = egfrEquation(e.test, comment);
    const loinc = str(e.test?.loinc);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  rows.sort((a, b) => ((toMs(a.collected) ?? 0) - (toMs(b.collected) ?? 0)) || (a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
  out.labs = rows;
}

// ───────────────────────────── vitals ─────────────────────────────

function parseBp(s: unknown): [number, number] | null {
  if (typeof s !== "string") return null;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(s);
  return m ? [+m[1], +m[2]] : null;
}

function mapVitals(sets: Entry[], out: ViewRows): void {
  const rows: VitalRow[] = [];
  const seen = new Set<string>();
  for (const x of sets) {
    const e = x.e;
    const lt = localTime(x.item.effective) ?? localTime(x.item.recorded);
    if (!lt) continue;
    const row: VitalRow = { setting: "clinic", local_time: lt, evidence: [ev(x)] };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const rep = parseBp(e.bp_repeat);
    if (rep) { row.repeat_systolic_mmhg = rep[0]; row.repeat_diastolic_mmhg = rep[1]; }
    const p = num(e.pulse_bpm);
    if (p !== undefined) row.pulse_bpm = p;
    const w = num(e.weight_lb);
    if (w !== undefined && w > 0) row.weight_kg = round(w * 0.45359237, 1);
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    const k = JSON.stringify([row.local_time, row.systolic_mmhg, row.diastolic_mmhg, row.repeat_systolic_mmhg, row.pulse_bpm, row.weight_kg]);
    if (seen.has(k)) continue;
    seen.add(k);
    rows.push(row);
  }
  out.vitals = rows;
}
