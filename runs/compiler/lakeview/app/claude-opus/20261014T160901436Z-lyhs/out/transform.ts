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

// Mapper for Lakeview (lakeview-v1): lab reports (LAB_REQ / LAB_ORDER / LAB_RESULT) and nephrology clinic
// records (CLINIC_VISIT / VISIT_DX / VITAL / MED_ORDER / MED_STATUS_HIST).
//
// Code readings (the schema carries no docs; these are inferred from the samples and usual conventions):
// - MED_STATUS: 1 active, 2 discontinued, 3 on hold (sample: "Hold finerenone" -> 3), 9 entered in error.
// - RESULT_STATUS: P preliminary, F final, A amended (stands), C corrected away / invalidated
//   (sample: "result invalidated", with REPLACED_BY_RESULT_ID), X cancelled / not performed.
// - ORDER_STATUS 9: voided / entered in error.
// - DX_STATUS: A active, P provisional, R ruled out, H historical (-> resolved).

const TZ = "America/Chicago";

// ---------------------------------------------------------------- time helpers

interface DT {
  y: number; mo: number; d: number; h: number; mi: number; s: number; ms: number;
  offsetMin: number | null; // null: no offset/zone given (already local)
}

const DT_RE = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?\s*(Z|[+-]\d{2}:?\d{2})?$/i;

function parseDT(s: unknown): DT | null {
  if (typeof s !== "string") return null;
  const m = DT_RE.exec(s.trim());
  if (!m) return null;
  let offsetMin: number | null = null;
  if (m[8]) {
    if (m[8].toUpperCase() === "Z") offsetMin = 0;
    else {
      const sign = m[8][0] === "-" ? -1 : 1;
      const digits = m[8].slice(1).replace(":", "");
      offsetMin = sign * (Number(digits.slice(0, 2)) * 60 + Number(digits.slice(2, 4)));
    }
  }
  return {
    y: +m[1], mo: +m[2], d: +m[3], h: +m[4], mi: +m[5], s: m[6] ? +m[6] : 0,
    ms: m[7] ? Math.round(Number("0." + m[7]) * 1000) : 0, offsetMin,
  };
}

let fmtCache: Intl.DateTimeFormat | null = null;
function fmt(): Intl.DateTimeFormat {
  if (!fmtCache) {
    fmtCache = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  }
  return fmtCache;
}

interface Local { y: number; mo: number; d: number; h: number; mi: number; s: number }

function chicagoOf(utcMs: number): Local {
  const parts = fmt().formatToParts(new Date(utcMs));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  return { y: get("year"), mo: get("month"), d: get("day"), h: get("hour") % 24, mi: get("minute"), s: get("second") };
}

/** Offset (minutes) of Chicago at a given UTC instant. */
function chicagoOffsetAt(utcMs: number): number {
  const l = chicagoOf(utcMs);
  const asUtc = Date.UTC(l.y, l.mo - 1, l.d, l.h, l.mi, l.s);
  return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / 60000);
}

/** UTC ms of a parsed date-time; local (no offset) values are taken as Chicago wall-clock. */
function utcMs(dt: DT): number {
  const wall = Date.UTC(dt.y, dt.mo - 1, dt.d, dt.h, dt.mi, dt.s, dt.ms);
  if (dt.offsetMin !== null) return wall - dt.offsetMin * 60000;
  let guess = wall + 6 * 3600000;
  for (let i = 0; i < 3; i++) {
    const off = chicagoOffsetAt(guess);
    guess = wall - off * 60000;
  }
  return guess;
}

const p2 = (n: number) => String(n).padStart(2, "0");
const p4 = (n: number) => String(n).padStart(4, "0");

/** Chicago wall clock for a date-time; as written when no offset. */
function localWall(dt: DT): Local {
  if (dt.offsetMin === null) return { y: dt.y, mo: dt.mo, d: dt.d, h: dt.h, mi: dt.mi, s: dt.s };
  return chicagoOf(utcMs(dt));
}

/** Sortable time key (ms) for date or date-time strings; partial dates sort at their start. */
function timeKey(s: unknown): number {
  const dt = parseDT(s);
  if (dt) return utcMs(dt);
  if (typeof s === "string") {
    const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(s.trim());
    if (m) return utcMs({ y: +m[1], mo: m[2] ? +m[2] : 1, d: m[3] ? +m[3] : 1, h: 0, mi: 0, s: 0, ms: 0, offsetMin: null });
  }
  return NaN;
}

/** Local date (source precision) for a date or date-time string. */
function localDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  const dt = parseDT(t);
  if (!dt) return undefined;
  const l = localWall(dt);
  return `${p4(l.y)}-${p2(l.mo)}-${p2(l.d)}`;
}

function localMinute(s: unknown): string | undefined {
  const dt = parseDT(s);
  if (!dt) return undefined;
  const l = localWall(dt);
  return `${p4(l.y)}-${p2(l.mo)}-${p2(l.d)}T${p2(l.h)}:${p2(l.mi)}`;
}

/** RFC 3339 with the Chicago offset in effect. */
function rfc3339Chicago(s: unknown): string | undefined {
  const dt = parseDT(s);
  if (!dt) {
    if (typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s.trim())) return s.trim();
    return undefined;
  }
  const ms = utcMs(dt);
  const l = localWall(dt);
  const off = chicagoOffsetAt(ms);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  return `${p4(l.y)}-${p2(l.mo)}-${p2(l.d)}T${p2(l.h)}:${p2(l.mi)}:${p2(l.s)}${sign}${p2(Math.floor(a / 60))}:${p2(a % 60)}`;
}

// ---------------------------------------------------------------- generic helpers

const isObj = (v: unknown): v is Record<string, any> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() !== "" ? v.trim() : undefined);
const num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const round = (v: number, dp: number) => {
  const f = Math.pow(10, dp);
  return Math.round(v * f) / f;
};

interface Entry { item: FolioItem; key: string; e: Record<string, any>; order: number }

function itemKey(it: FolioItem): [number, number, string] {
  const eff = timeKey(it.effective);
  const rec = timeKey(it.recorded);
  return [Number.isNaN(eff) ? (Number.isNaN(rec) ? 0 : rec) : eff, Number.isNaN(rec) ? 0 : rec, String(it.id)];
}

function cmpItems(a: FolioItem, b: FolioItem): number {
  const ka = itemKey(a), kb = itemKey(b);
  if (ka[0] !== kb[0]) return ka[0] - kb[0];
  if (ka[1] !== kb[1]) return ka[1] - kb[1];
  return ka[2] < kb[2] ? -1 : ka[2] > kb[2] ? 1 : 0;
}

/** Items counting at the end of asOf (local), after supersession and retraction. */
function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inWindow = items.filter((it) => {
    if (!isObj(it) || typeof it.id !== "string") return false;
    const d = localDate(it.recorded);
    return d !== undefined && d.length === 10 && d <= asOf;
  });
  // Retractions from items that are not themselves retracted (iterate to a fixpoint).
  let retracted = new Set<string>();
  for (let i = 0; i < 10; i++) {
    const next = new Set<string>();
    for (const it of inWindow) {
      if (retracted.has(it.id)) continue;
      if (Array.isArray(it.retracts)) for (const r of it.retracts) if (typeof r === "string") next.add(r);
    }
    const same = next.size === retracted.size && [...next].every((x) => retracted.has(x));
    retracted = next;
    if (same) break;
  }
  const superseded = new Set<string>();
  for (const it of inWindow) {
    if (retracted.has(it.id)) continue;
    if (Array.isArray(it.supersedes)) for (const s of it.supersedes) if (typeof s === "string") superseded.add(s);
  }
  return inWindow.filter((it) => !retracted.has(it.id) && !superseded.has(it.id)).sort(cmpItems);
}

function entriesOf(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  items.forEach((item, idx) => {
    if (!isObj(item.payload)) return;
    for (const [key, e] of Object.entries(item.payload)) {
      if (isObj(e) && e.type === type) out.push({ item, key, e, order: idx });
    }
  });
  return out;
}

// ---------------------------------------------------------------- drug knowledge

const BRANDS: Record<string, string> = {
  kerendia: "finerenone", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", lasix: "furosemide", bumex: "bumetanide",
  demadex: "torsemide", norvasc: "amlodipine", cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan",
  benicar: "olmesartan", micardis: "telmisartan", atacand: "candesartan", zestril: "lisinopril",
  prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  glucophage: "metformin", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", novolog: "insulin aspart", lokelma: "sodium zirconium cyclosilicate",
  veltassa: "patiromer", renvela: "sevelamer", renagel: "sevelamer", phoslo: "calcium acetate",
  sensipar: "cinacalcet", aranesp: "darbepoetin alfa", epogen: "epoetin alfa", procrit: "epoetin alfa",
  retacrit: "epoetin alfa", zyloprim: "allopurinol", uloric: "febuxostat", synthroid: "levothyroxine",
  levoxyl: "levothyroxine", coreg: "carvedilol", toprol: "metoprolol", lopressor: "metoprolol",
  aldactone: "spironolactone", inspra: "eplerenone", microzide: "hydrochlorothiazide", hygroton: "chlorthalidone",
  tenormin: "atenolol", catapres: "clonidine", apresoline: "hydralazine", cardizem: "diltiazem",
  procardia: "nifedipine", januvia: "sitagliptin", tradjenta: "linagliptin", amaryl: "glimepiride",
  glucotrol: "glipizide", plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", prilosec: "omeprazole", protonix: "pantoprazole", pepcid: "famotidine",
  zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine", seroquel: "quetiapine",
  wellbutrin: "bupropion", suboxone: "buprenorphine", subutex: "buprenorphine", neurontin: "gabapentin",
  lyrica: "pregabalin", "k-dur": "potassium chloride", "klor-con": "potassium chloride", calcitriol: "calcitriol",
  rocaltrol: "calcitriol", zemplar: "paricalcitol", hectorol: "doxercalciferol", venofer: "iron sucrose",
  keflex: "cephalexin", amoxil: "amoxicillin", bactrim: "sulfamethoxazole / trimethoprim",
  motrin: "ibuprofen", advil: "ibuprofen", aleve: "naproxen", celebrex: "celecoxib", tylenol: "acetaminophen",
};

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "magnesium", "maleate", "besylate", "tartrate",
  "succinate", "mesylate", "citrate", "sulfate", "phosphate", "fumarate", "acetate", "bromide", "chloride",
  "hyclate", "monohydrate", "trihydrate", "dihydrate", "anhydrous", "dipropionate", "propionate", "medoxomil",
  "cilexetil", "bisulfate", "hydrobromide", "erbumine", "mononitrate", "xinafoate", "disodium", "sesquihydrate",
]);
const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "oral", "solution", "suspension",
  "injection", "injectable", "pen", "inj", "er", "xr", "sr", "dr", "xl", "la", "cr", "ec", "odt", "chewable",
  "extended", "delayed", "release", "film", "coated", "subcutaneous", "prefilled", "syringe", "vial", "patch",
  "cream", "ointment", "gel", "inhaler", "hfa", "powder", "packet", "liquid", "drops", "kwikpen", "flextouch",
  "solostar", "pump", "spray",
]);
const MINERAL_FIRST = new Set(["potassium", "sodium", "calcium", "magnesium", "ferrous", "iron", "zinc", "lithium", "aluminum"]);

function ingredientOf(name: string | undefined): string | undefined {
  if (!name) return undefined;
  let s = name.toLowerCase().replace(/[®™]/g, " ");
  // cut at first strength / number
  s = s.split(/\s\d|\(\s*\d|^\d/)[0];
  s = s.replace(/[(),]/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return undefined;
  let words = s.split(" ").filter((w) => w && !FORM_WORDS.has(w));
  if (words.length === 0) return undefined;
  const brand = BRANDS[words[0]];
  if (brand) return brand;
  if (!MINERAL_FIRST.has(words[0])) {
    while (words.length > 1 && SALTS.has(words[words.length - 1])) words = words.slice(0, -1);
  }
  const joined = words.join(" ").replace(/\s*\/\s*/g, " / ").trim();
  return joined || undefined;
}

/** Drug classes named by ICD-10-CM T36-T50 adverse-effect codes and their members. */
const CLASSES: { code: string; name: string; members: string[] }[] = [
  { code: "T36.0", name: "penicillins", members: ["amoxicillin", "ampicillin", "penicillin", "piperacillin", "dicloxacillin", "nafcillin", "oxacillin", "amoxicillin / clavulanate"] },
  { code: "T36.1", name: "cephalosporins and other beta-lactam antibiotics", members: ["cephalexin", "cefazolin", "cefuroxime", "ceftriaxone", "cefdinir", "cefpodoxime", "cefadroxil", "cefepime"] },
  { code: "T36.3", name: "macrolides", members: ["azithromycin", "clarithromycin", "erythromycin"] },
  { code: "T36.4", name: "tetracyclines", members: ["doxycycline", "minocycline", "tetracycline"] },
  { code: "T37.0", name: "sulfonamides", members: ["sulfamethoxazole", "sulfamethoxazole / trimethoprim", "sulfasalazine"] },
  { code: "T38.0", name: "glucocorticoids and synthetic analogues", members: ["prednisone", "prednisolone", "methylprednisolone", "dexamethasone", "hydrocortisone"] },
  { code: "T38.1", name: "thyroid hormones and substitutes", members: ["levothyroxine", "liothyronine"] },
  { code: "T38.3", name: "insulin and oral hypoglycemic [antidiabetic] drugs", members: ["metformin", "empagliflozin", "dapagliflozin", "canagliflozin", "glipizide", "glimepiride", "glyburide", "sitagliptin", "linagliptin", "pioglitazone", "insulin glargine", "insulin lispro", "insulin aspart", "insulin detemir", "insulin degludec", "semaglutide", "dulaglutide", "liraglutide", "tirzepatide"] },
  { code: "T39.1", name: "4-aminophenol derivatives", members: ["acetaminophen"] },
  { code: "T39.3", name: "other nonsteroidal anti-inflammatory drugs [NSAID]", members: ["ibuprofen", "naproxen", "celecoxib", "diclofenac", "meloxicam", "indomethacin", "ketorolac"] },
  { code: "T40.2", name: "other opioids", members: ["oxycodone", "hydrocodone", "morphine", "tramadol", "codeine"] },
  { code: "T45.51", name: "anticoagulants", members: ["warfarin", "apixaban", "rivaroxaban", "dabigatran", "heparin", "enoxaparin"] },
  { code: "T46.1", name: "calcium-channel blockers", members: ["amlodipine", "nifedipine", "diltiazem", "verapamil", "felodipine"] },
  { code: "T46.4", name: "angiotensin-converting-enzyme inhibitors", members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril"] },
  { code: "T46.5", name: "other antihypertensive drugs", members: ["losartan", "valsartan", "irbesartan", "olmesartan", "telmisartan", "candesartan", "hydralazine", "clonidine", "minoxidil"] },
  { code: "T46.6", name: "antihyperlipidemic and antiarteriosclerotic drugs", members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "ezetimibe", "fenofibrate", "gemfibrozil"] },
  { code: "T44.7", name: "beta-adrenoreceptor antagonists", members: ["metoprolol", "carvedilol", "atenolol", "propranolol", "bisoprolol", "labetalol", "nebivolol"] },
  { code: "T50.0", name: "mineralocorticoids and their antagonists", members: ["spironolactone", "eplerenone", "finerenone", "fludrocortisone"] },
  { code: "T50.1", name: "loop [high-ceiling] diuretics", members: ["furosemide", "bumetanide", "torsemide"] },
  { code: "T50.2", name: "carbonic-anhydrase inhibitors, benzothiadiazides and other diuretics", members: ["hydrochlorothiazide", "chlorthalidone", "acetazolamide", "metolazone", "indapamide"] },
  { code: "T50.3", name: "electrolytic, caloric and water-balance agents", members: ["potassium chloride", "sodium bicarbonate", "patiromer", "sodium zirconium cyclosilicate"] },
  { code: "T45.4", name: "iron and its compounds", members: ["iron sucrose", "ferrous sulfate", "ferric citrate"] },
];

const KNOWN_DRUGS = new Set<string>([...Object.values(BRANDS), ...CLASSES.flatMap((c) => c.members)]);

const MED_SENS: [RegExp, Sensitivity][] = [
  [/\b(quetiapine|olanzapine|risperidone|aripiprazole|haloperidol|lithium|lamotrigine|sertraline|escitalopram|citalopram|fluoxetine|paroxetine|venlafaxine|duloxetine|bupropion|mirtazapine|trazodone|clozapine|ziprasidone|lurasidone|buspirone)\b/, "mental-health"],
  [/\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|varenicline)\b/, "substance-use"],
  [/\b(tenofovir|emtricitabine|efavirenz|dolutegravir|bictegravir|raltegravir|abacavir|lamivudine|zidovudine|darunavir|ritonavir|rilpivirine)\b/, "hiv-sti"],
  [/\b(levonorgestrel|norethindrone|ethinyl estradiol|medroxyprogesterone|etonogestrel|drospirenone|norgestimate|sildenafil|tadalafil|clomiphene)\b/, "sexual-reproductive-health"],
];

function medSensitivity(text: string): Sensitivity[] | undefined {
  const t = text.toLowerCase();
  const out: Sensitivity[] = [];
  for (const [re, s] of MED_SENS) if (re.test(t) && !out.includes(s)) out.push(s);
  return out.length ? out : undefined;
}

function dxSensitivity(icd: string | undefined, text: string): Sensitivity[] | undefined {
  const out: Sensitivity[] = [];
  const c = (icd ?? "").toUpperCase();
  const t = text.toLowerCase();
  const add = (s: Sensitivity) => { if (!out.includes(s)) out.push(s); };
  if (/^F1\d/.test(c) || /\b(alcohol|opioid|cocaine|cannabis|substance) (use|abuse|dependence)/.test(t)) add("substance-use");
  else if (/^F\d/.test(c) || /\b(depress|bipolar|schizo|anxiety|psychosis|ptsd)/.test(t)) add("mental-health");
  if (/^(B2[0-4]|Z21|A5\d|A6[0-4])/.test(c) || /\bhiv\b|chlamydia|gonorrh|syphilis/.test(t)) add("hiv-sti");
  if (/^(O\d|Z3[0-9]|N97)/.test(c) || /pregnan|contracept|infertil/.test(t)) add("sexual-reproductive-health");
  return out.length ? out : undefined;
}

// ---------------------------------------------------------------- medications

const MED_STATUS: Record<number, MedicationRow["status"]> = { 1: "active", 2: "stopped", 3: "held" };

interface MedEvent {
  time: number;
  status: number;
  since?: string;
  entry: Entry;
  hist: boolean;
}

function mapMedications(items: FolioItem[]): { rows: MedicationRow[]; rxDrug: Map<string, string> } {
  const orders = entriesOf(items, "MED_ORDER");
  const hists = entriesOf(items, "MED_STATUS_HIST");
  const byRx = new Map<string, { copies: Entry[]; events: MedEvent[]; error: boolean }>();
  const get = (rx: string) => {
    let g = byRx.get(rx);
    if (!g) { g = { copies: [], events: [], error: false }; byRx.set(rx, g); }
    return g;
  };
  for (const o of orders) {
    const rx = str(o.e.RX_ID);
    if (!rx) continue;
    const g = get(rx);
    g.copies.push(o);
    const st = num(o.e.MED_STATUS);
    if (st === 9) g.error = true;
    // an active order counts from its start; status changes arrive as MED_STATUS_HIST events
    const start = timeKey(o.e.START_DATE);
    const t = st === 1 && !Number.isNaN(start) ? Math.min(start, itemKey(o.item)[0]) : itemKey(o.item)[0];
    if (st !== undefined) g.events.push({ time: t, status: st, since: st === 1 ? localDate(o.e.START_DATE) : undefined, entry: o, hist: false });
  }
  for (const h of hists) {
    const rx = str(h.e.RX_ID);
    if (!rx) continue;
    const g = get(rx);
    const st = num(h.e.NEW_STATUS);
    if (st === 9 || h.e.REASON_CODE === "ERR") g.error = true;
    let t = timeKey(h.e.CHANGED_AT);
    if (Number.isNaN(t)) t = itemKey(h.item)[0];
    if (st !== undefined) g.events.push({ time: t, status: st, since: localDate(h.e.CHANGED_AT) ?? localDate(h.item.effective), entry: h, hist: true });
  }

  const rxDrug = new Map<string, string>();
  interface Cand { row: MedicationRow; latest: number; key: string }
  const byIngredient = new Map<string, Cand>();

  for (const [rx, g] of byRx) {
    if (g.error || g.copies.length === 0) continue;
    g.copies.sort((a, b) => cmpItems(a.item, b.item) || a.order - b.order);
    const order = g.copies[g.copies.length - 1];
    const drugName = str(order.e.DRUG_NAME);
    if (!drugName) continue;
    const ingredient = ingredientOf(drugName);
    if (ingredient) rxDrug.set(rx, ingredient);
    if (order.e.ROUTE === "IV") continue; // clinic infusions are not home medicines

    // latest event decides; on equal times a status-history event outranks an order copy
    const events = g.events.slice().sort((a, b) => a.time - b.time || Number(a.hist) - Number(b.hist));
    const last = events[events.length - 1];
    if (!last) continue;
    const status = MED_STATUS[last.status];
    if (!status) continue;

    let since: string | undefined;
    let deciding: MedEvent | undefined;
    for (let i = events.length - 1; i >= 0; i--) {
      const ev = events[i];
      if (ev.status !== last.status) break;
      if (ev.hist) { deciding = ev; break; }
    }
    if (deciding) since = deciding.since;
    else if (status === "active") since = localDate(order.e.START_DATE);

    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [] };
    if (ingredient) row.ingredient = ingredient;
    if (since) row.status_since = since;

    const qty = num(order.e.DOSE_QTY);
    const unitMap: Record<string, "mg" | "mcg" | "units" | "mL"> = { mg: "mg", mcg: "mcg", unit: "units", units: "units", mL: "mL", ml: "mL" };
    const unit = typeof order.e.DOSE_UNIT === "string" ? unitMap[order.e.DOSE_UNIT] : undefined;
    if (qty !== undefined && unit) row.dose = { value: qty, unit };
    const freq = order.e.FREQ_CODE;
    if (typeof freq === "string" && ["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(freq)) row.frequency = freq as MedicationRow["frequency"];
    else if (typeof freq === "string" && freq.trim()) row.frequency = "other";

    if (deciding && status !== "active") {
      const comment = str(deciding.entry.e.COMMENT_TEXT);
      if (comment) row.status_reason_text = comment;
      if (status === "stopped") {
        const rc = deciding.entry.e.REASON_CODE;
        const c = (comment ?? "").toLowerCase();
        if (rc === "ADR") row.stop_reason = "adverse_reaction";
        else if (rc === "PT") row.stop_reason = "patient_choice";
        else if (rc === "LAB" || rc === "PROC") row.stop_reason = "other";
        else if (rc === "OTH") {
          if (/switch|changed to|replac|instead|transition/.test(c)) row.stop_reason = "therapy_changed";
          else if (/ineffective|not effective|no (benefit|response|effect)|did not work/.test(c)) row.stop_reason = "ineffective";
          else if (/course (complete|finished)|completed course/.test(c)) row.stop_reason = "course_complete";
          else row.stop_reason = "other";
        }
      }
    } else if (deciding && status === "active") {
      const comment = str(deciding.entry.e.COMMENT_TEXT);
      if (comment) row.status_reason_text = comment;
    }

    const sens = medSensitivity(drugName + " " + (ingredient ?? ""));
    if (sens) row.sensitivity = sens;

    const ev: Evidence = [];
    const seen = new Set<string>();
    const push = (e: Entry) => {
      const k = e.item.id + "\u0000" + e.key;
      if (seen.has(k)) return;
      seen.add(k);
      ev.push({ item_id: e.item.id, entry_id: e.key });
    };
    push(order);
    if (deciding) push(deciding.entry);
    if (last.entry !== order && last.entry !== deciding?.entry) push(last.entry);
    row.evidence = ev;

    const key = ingredient ?? (str(order.e.LV_DRUG_ID) ?? drugName.toLowerCase());
    const prev = byIngredient.get(key);
    if (!prev || last.time > prev.latest || (last.time === prev.latest && rx > prev.key)) {
      byIngredient.set(key, { row, latest: last.time, key: rx });
    }
  }
  const rows = [...byIngredient.values()].sort((a, b) => a.latest - b.latest).map((c) => c.row);
  return { rows, rxDrug };
}

// ---------------------------------------------------------------- problems & allergies

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function refText(item: FolioItem, entryId: string): string | undefined {
  if (typeof item.narrative !== "string") return undefined;
  const re = /<ref\s+id="([^"]*)"\s*>([\s\S]*?)<\/ref>/g;
  let m: RegExpExecArray | null;
  const parts: string[] = [];
  while ((m = re.exec(item.narrative))) if (m[1] === entryId) parts.push(m[2]);
  return parts.length ? parts.join(" ") : undefined;
}

function onsetFromText(text: string): ProblemRow["onset"] | undefined {
  const t = text.toLowerCase();
  const lead = String.raw`(?:since|diagnosed(?:\s+in)?|dx(?:'d)?(?:\s+in)?|onset(?:\s+in)?)\s+`;
  let m = new RegExp(lead + String.raw`(\d{1,2})/(\d{1,2})/(\d{4})\b`).exec(t);
  if (m) return { value: `${m[3]}-${p2(+m[1])}-${p2(+m[2])}`, precision: "day" };
  m = new RegExp(lead + String.raw`(\d{4})-(\d{2})-(\d{2})\b`).exec(t);
  if (m) return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
  m = new RegExp(lead + String.raw`(\d{4})-(\d{2})\b`).exec(t);
  if (m) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  m = new RegExp(lead + String.raw`(\d{1,2})/(\d{4})\b`).exec(t);
  if (m && +m[1] >= 1 && +m[1] <= 12) return { value: `${m[2]}-${p2(+m[1])}`, precision: "month" };
  m = new RegExp(lead + String.raw`([a-z]{3})[a-z]*\.?\s+(\d{4})\b`).exec(t);
  if (m && MONTHS[m[1]]) return { value: `${m[2]}-${p2(MONTHS[m[1]])}`, precision: "month" };
  m = new RegExp(lead + String.raw`(\d{4})\b`).exec(t);
  if (m) return { value: m[1], precision: "year" };
  return undefined;
}

function conditionKey(icd: string | undefined, text: string): string {
  const c = (icd ?? "").toUpperCase().replace(/\s/g, "");
  if (c) {
    if (/^N18/.test(c)) return "CKD";
    if (/^I1[0-6]/.test(c)) return "HTN";
    if (/^E11/.test(c)) return "T2DM";
    if (/^E10/.test(c)) return "T1DM";
    if (/^J45/.test(c)) return "ASTHMA";
    if (/^E78/.test(c)) return "LIPID";
    return c;
  }
  return "TXT:" + text.toLowerCase().replace(/\s+/g, " ").trim();
}

const CKD_G_FROM_ICD: Record<string, ProblemRow["ckd_stage"]> = {
  "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
};

const AE_CODE = /^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/i;

interface DrugAttribution { substance: string; reaction?: string; adverseOnly: boolean }

function classOfCode(icd: string): (typeof CLASSES)[number] | undefined {
  const c = icd.toUpperCase();
  let best: (typeof CLASSES)[number] | undefined;
  for (const k of CLASSES) {
    if (c.startsWith(k.code) && (!best || k.code.length > best.code.length)) best = k;
  }
  return best;
}

function resolveSubstance(named: string, itemDrugs: string[]): string | undefined {
  const n = named.toLowerCase().trim().replace(/[.;,]+$/, "");
  if (!n) return undefined;
  // a single named drug (generic or brand)
  const ing = ingredientOf(n);
  if (ing && (KNOWN_DRUGS.has(ing) || itemDrugs.includes(ing))) return ing;
  for (const d of itemDrugs) if (n === d || n.startsWith(d + " ")) return d;
  // a class
  const cls = CLASSES.find((k) => {
    const kn = k.name.toLowerCase();
    return n === kn || n.includes(kn) || kn.includes(n);
  });
  if (cls) {
    const inItem = [...new Set(itemDrugs.filter((d) => cls.members.includes(d)))];
    if (inItem.length === 1) return inItem[0];
    return named.trim();
  }
  return undefined;
}

function drugAttribution(icd: string | undefined, text: string, itemDrugs: string[]): DrugAttribution | undefined {
  if (icd && AE_CODE.test(icd)) {
    const m = /adverse effect of (.+?)(?:,\s*(?:initial|subsequent|sequela).*)?$/i.exec(text);
    const cls = classOfCode(icd);
    let substance: string | undefined;
    if (m) substance = resolveSubstance(m[1], itemDrugs) ?? m[1].trim();
    if (!substance && cls) {
      const inItem = [...new Set(itemDrugs.filter((d) => cls.members.includes(d)))];
      substance = inItem.length === 1 ? inItem[0] : cls.name;
    }
    if (substance && cls && !m) {
      // keep the class wording when no drug of it is on the list
    }
    if (!substance) return undefined;
    return { substance, adverseOnly: true };
  }
  const m = /^(.*?)\s*\b(?:due to|caused by|induced by|secondary to|from)\s+(.+?)(?:\s+(?:therapy|use|treatment))?\s*$/i.exec(text);
  if (m) {
    const sub = resolveSubstance(m[2], itemDrugs);
    if (sub) return { substance: sub, reaction: m[1].trim() || undefined, adverseOnly: false };
  }
  const m2 = /\b([a-z]+)[- ]induced\s+(.+)$/i.exec(text);
  if (m2) {
    const sub = resolveSubstance(m2[1], itemDrugs);
    if (sub) return { substance: sub, reaction: m2[2].trim(), adverseOnly: false };
  }
  return undefined;
}

const HYPERSENS = /urticari|hives|rash|angioedema|swelling|anaphyla|bronchospasm|wheez|dermatitis|exanthem|pruritus|itch|stevens|steven-johnson|toxic epidermal|allergic/i;
const SERIOUS = /hepat|liver|pancreatit|agranulocyt|neutropeni|aplastic|rhabdomyol|acute kidney|renal failure|lactic acidosis|ketoacidosis|qt prolong|arrhythm|bleed|hemorrh|seizure|interstitial nephritis/i;
const NON_IMMUNE = /cough|hyperkal|nausea|vomit|upset|dyspeps|diarrh|constipat|drowsi|somnolen|dizz|hypotens|hypoglyc|edema|myalg|headache|gynecomast|fatigue/i;

function classifyReaction(reaction: string | undefined): Pick<AllergyIntoleranceRow, "reaction_type" | "mechanism" | "criticality"> {
  const r = reaction ?? "";
  if (HYPERSENS.test(r)) {
    const high = /anaphyla|angioedema|bronchospasm|stevens|toxic epidermal|throat|tongue|airway/i.test(r);
    return { reaction_type: "hypersensitivity", mechanism: "unknown", criticality: high ? "high" : "unknown" };
  }
  if (SERIOUS.test(r)) return { reaction_type: "serious_adverse_event", mechanism: "unknown", criticality: "high" };
  if (NON_IMMUNE.test(r)) return { reaction_type: "side_effect", mechanism: "non_immune", criticality: "unknown" };
  return { reaction_type: "side_effect", mechanism: "unknown", criticality: "unknown" };
}

function mapProblems(items: FolioItem[], rxDrug: Map<string, string>): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const dxs = entriesOf(items, "VISIT_DX");
  const visits = entriesOf(items, "CLINIC_VISIT");

  interface Ctx { entry: Entry; icd?: string; text: string; status: string; rank: number }
  const ctxs: Ctx[] = [];
  for (const d of dxs) {
    const text = str(d.e.DX_TEXT) ?? str(d.e.ICD10CM);
    if (!text) continue;
    const status = typeof d.e.DX_STATUS === "string" ? d.e.DX_STATUS : "";
    ctxs.push({ entry: d, icd: str(d.e.ICD10CM), text, status, rank: num(d.e.DX_RANK) ?? 999 });
  }
  ctxs.sort((a, b) => cmpItems(a.entry.item, b.entry.item) || a.rank - b.rank || a.entry.order - b.entry.order);

  const itemDrugsCache = new Map<string, string[]>();
  const itemDrugs = (it: FolioItem): string[] => {
    let v = itemDrugsCache.get(it.id);
    if (v) return v;
    v = [];
    if (isObj(it.payload)) {
      for (const e of Object.values(it.payload)) {
        if (!isObj(e)) continue;
        if (e.type === "MED_ORDER") {
          const ing = ingredientOf(str(e.DRUG_NAME));
          if (ing) v.push(ing);
        } else if (e.type === "MED_STATUS_HIST") {
          const ing = typeof e.RX_ID === "string" ? rxDrug.get(e.RX_ID) : undefined;
          if (ing) v.push(ing);
        }
      }
    }
    itemDrugsCache.set(it.id, v);
    return v;
  };

  // problem groups
  interface Group { entries: Ctx[] }
  const groups = new Map<string, Group>();
  const allergyMap = new Map<string, { row: AllergyIntoleranceRow; time: number }>();

  for (const c of ctxs) {
    const attr = drugAttribution(c.icd, c.text, itemDrugs(c.entry.item));
    if (attr) {
      const current = c.status === "A" || c.status === "H";
      const key = attr.substance.toLowerCase();
      if (current) {
        let reaction = attr.reaction;
        if (attr.adverseOnly && !reaction) {
          // the manifestation coded alongside, ranked just before the adverse-effect code
          const sibling = ctxs
            .filter((o) => o.entry.item === c.entry.item && o.rank < c.rank && !(o.icd && AE_CODE.test(o.icd)))
            .sort((a, b) => b.rank - a.rank)[0];
          if (sibling && (HYPERSENS.test(sibling.text) || SERIOUS.test(sibling.text) || NON_IMMUNE.test(sibling.text))) reaction = sibling.text;
        }
        const cls = classifyReaction(reaction);
        const row: AllergyIntoleranceRow = { substance: attr.substance, ...cls, evidence: [{ item_id: c.entry.item.id, entry_id: c.entry.key }] };
        if (reaction) row.reaction = reaction;
        const sens = medSensitivity(attr.substance);
        if (sens) row.sensitivity = sens;
        allergyMap.set(key, { row, time: itemKey(c.entry.item)[0] });
      } else if (c.status === "R") {
        allergyMap.delete(key);
      }
      if (attr.adverseOnly) continue;
    }
    const key = conditionKey(c.icd, c.text);
    let g = groups.get(key);
    if (!g) { g = { entries: [] }; groups.set(key, g); }
    g.entries.push(c);
  }

  // CKD categories recorded on visits, by item
  const visitByItem = new Map<string, Entry[]>();
  for (const v of visits) {
    const arr = visitByItem.get(v.item.id) ?? [];
    arr.push(v);
    visitByItem.set(v.item.id, arr);
  }

  const problems: { row: ProblemRow; time: number }[] = [];
  for (const [key, g] of groups) {
    // latest decided entry (A / H / R); provisional entries never make a row on their own
    const decided = g.entries.filter((c) => c.status === "A" || c.status === "H" || c.status === "R");
    const latest = decided[decided.length - 1];
    if (!latest || latest.status === "R") continue;
    const row: ProblemRow = {
      condition: latest.text,
      status: latest.status === "H" ? "resolved" : "active",
      evidence: [],
    };
    if (latest.icd) row.icd10cm = latest.icd;

    // onset: narrative wording on any of the group's entries, latest stating it wins
    for (const c of g.entries) {
      const t = refText(c.entry.item, c.entry.key);
      const o = t ? onsetFromText(t) : undefined;
      if (o) row.onset = o;
    }

    if (key === "CKD") {
      let stage: ProblemRow["ckd_stage"];
      let alb: ProblemRow["albuminuria"];
      const seenItems: FolioItem[] = [];
      for (const c of g.entries) if (!seenItems.includes(c.entry.item)) seenItems.push(c.entry.item);
      for (const v of visits) if (!seenItems.includes(v.item)) seenItems.push(v.item);
      seenItems.sort(cmpItems);
      for (const it of seenItems) {
        let gItem: ProblemRow["ckd_stage"];
        let aItem: ProblemRow["albuminuria"];
        for (const v of visitByItem.get(it.id) ?? []) {
          if (["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(v.e.CKD_G)) gItem = v.e.CKD_G;
          if (["A1", "A2", "A3"].includes(v.e.CKD_A)) aItem = v.e.CKD_A;
        }
        if (!gItem) {
          for (const c of g.entries) {
            if (c.entry.item !== it || (c.status !== "A" && c.status !== "H")) continue;
            const code = (c.icd ?? "").toUpperCase();
            if (CKD_G_FROM_ICD[code]) gItem = CKD_G_FROM_ICD[code];
          }
        }
        if (gItem) stage = gItem;
        if (aItem) alb = aItem;
      }
      if (stage) row.ckd_stage = stage;
      if (alb) row.albuminuria = alb;
    }

    const sens = dxSensitivity(latest.icd, latest.text);
    if (sens) row.sensitivity = sens;

    const ev: Evidence = [{ item_id: latest.entry.item.id, entry_id: latest.entry.key }];
    for (const c of g.entries) {
      if (c === latest) continue;
      ev.push({ item_id: c.entry.item.id, entry_id: c.entry.key });
    }
    if (key === "CKD") {
      for (const v of visitByItem.get(latest.entry.item.id) ?? []) ev.push({ item_id: v.item.id, entry_id: v.key });
    }
    row.evidence = ev;
    problems.push({ row, time: itemKey(g.entries[0].entry.item)[0] + g.entries[0].rank });
  }
  problems.sort((a, b) => a.time - b.time);
  const allergies = [...allergyMap.values()].sort((a, b) => a.time - b.time).map((x) => x.row);
  return { problems: problems.map((p) => p.row), allergies };
}

// ---------------------------------------------------------------- labs

const TEST_ANALYTE: Record<string, Analyte> = {
  "LK-CREAT": "creatinine", "LK-EGFR09N": "egfr", "LK-EGFR21": "egfr", "LK-NA": "sodium", "LK-K": "potassium",
  "LK-GLU": "glucose", "LK-A1C": "a1c", "LK-UACR": "uacr", "LK-WBC": "wbc", "LK-HGB": "hemoglobin",
  "LK-PLT": "platelets", "LK-CHOL": "cholesterol", "LK-TRIG": "triglycerides", "LK-HDL": "hdl", "LK-LDLC": "ldl",
};

const ANALYTE_UNIT: Partial<Record<Analyte, string>> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", glucose: "mg/dL", a1c: "%",
  uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", cholesterol: "mg/dL",
  triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

/** Convert a value in the source unit to the analyte's unit; undefined when not convertible. */
function convert(analyte: Analyte, unit: string | null | undefined, v: number): number | undefined {
  const target = ANALYTE_UNIT[analyte];
  if (!target) return undefined;
  if (unit === null || unit === undefined || unit === "") return v;
  const u = unit.trim();
  if (u === target) return v;
  if ((analyte === "platelets" || analyte === "wbc") && /^(K\/uL|10\*3\/uL|10\^3\/uL|x10E3\/uL|10\*9\/L)$/i.test(u)) return v;
  if (analyte === "egfr" && /^mL\/min\/1\.73\s?m(2|²)$/i.test(u)) return v;
  if (u === "mmol/L") {
    if (analyte === "glucose") return Math.round(v * 18.016);
    if (analyte === "cholesterol" || analyte === "hdl" || analyte === "ldl") return Math.round(v * 38.67);
    if (analyte === "triglycerides") return Math.round(v * 88.57);
  }
  if (u === "mEq/L" && (analyte === "sodium" || analyte === "potassium")) return v;
  if (analyte === "hemoglobin" && u === "g/L") return round(v / 10, 1);
  if (analyte === "creatinine" && /^(umol\/L|µmol\/L)$/.test(u)) return round(v / 88.42, 2);
  return undefined;
}

const RESULT_RANK: Record<string, number> = { P: 1, F: 2, A: 3, C: 4, X: 4 };

function mapLabs(items: FolioItem[]): LabResultRow[] {
  const reqs = entriesOf(items, "LAB_REQ");
  const orders = entriesOf(items, "LAB_ORDER");
  const results = entriesOf(items, "LAB_RESULT");

  const findIn = <T extends Entry>(list: T[], field: string, id: string, item: FolioItem): T | undefined => {
    const same = list.filter((x) => x.e[field] === id && x.item === item);
    if (same.length) return same[same.length - 1];
    const any = list.filter((x) => x.e[field] === id);
    return any.length ? any[any.length - 1] : undefined; // lists are in item order
  };

  // a voided order anywhere among counting items voids its results
  const voided = new Set<string>();
  for (const o of orders) if (num(o.e.ORDER_STATUS) === 9 && typeof o.e.ORDER_ID === "string") voided.add(o.e.ORDER_ID);

  const byId = new Map<string, Entry[]>();
  results.forEach((r, i) => {
    const id = str(r.e.RESULT_ID) ?? `${r.item.id}#${r.key}#${i}`;
    const arr = byId.get(id) ?? [];
    arr.push(r);
    byId.set(id, arr);
  });

  const rows: { row: LabResultRow; t: number; id: string }[] = [];
  for (const [id, copies] of byId) {
    const ranked = copies
      .filter((c) => typeof c.e.RESULT_STATUS === "string" && RESULT_RANK[c.e.RESULT_STATUS] !== undefined)
      .sort((a, b) => RESULT_RANK[a.e.RESULT_STATUS] - RESULT_RANK[b.e.RESULT_STATUS] || cmpItems(a.item, b.item) || a.order - b.order);
    const best = ranked[ranked.length - 1];
    if (!best) continue;
    const r = best.e;
    if (r.RESULT_STATUS === "C" || r.RESULT_STATUS === "X") continue;
    if (str(r.REPLACED_BY_RESULT_ID)) continue;
    const orderId = str(r.ORDER_ID);
    if (orderId && voided.has(orderId)) continue;

    const code = str(r.TEST_CODE);
    const analyte = code ? TEST_ANALYTE[code] : undefined;
    if (!analyte) continue;

    let comparator: LabResultRow["comparator"];
    let value: number | undefined;
    const text = typeof r.VALUE_TEXT === "string" ? r.VALUE_TEXT.trim() : "";
    const cm = /^(<=|>=|<|>|≤|≥)\s*(-?\d+(?:\.\d+)?)$/.exec(text);
    if (cm) {
      comparator = (cm[1] === "≤" ? "<=" : cm[1] === "≥" ? ">=" : cm[1]) as LabResultRow["comparator"];
      value = num(r.VALUE_NUM) ?? Number(cm[2]);
    } else {
      value = num(r.VALUE_NUM);
      if (value === undefined && /^-?\d+(\.\d+)?$/.test(text)) value = Number(text);
    }
    if (value === undefined) continue;
    const conv = convert(analyte, r.UNIT_CODE, value);
    if (conv === undefined) continue;

    const order = orderId ? findIn(orders, "ORDER_ID", orderId, best.item) : undefined;
    const reqId = order ? str(order.e.REQ_ID) : undefined;
    const req = reqId ? findIn(reqs, "REQ_ID", reqId, best.item) : undefined;
    const collected = rfc3339Chicago(req?.e.COLLECTED_AT) ?? rfc3339Chicago(best.item.effective);
    if (!collected) continue;

    const row: LabResultRow = {
      analyte,
      value: conv,
      unit: ANALYTE_UNIT[analyte] as string,
      collected,
      status: r.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: [],
    };
    if (comparator) row.comparator = comparator;
    if (analyte === "egfr") {
      const c = String(r.COMMENT_TEXT ?? "") + " " + String(r.TEST_NAME ?? "");
      if (code === "LK-EGFR21") row.egfr_equation = "ckd-epi-2021";
      else if (code === "LK-EGFR09N") row.egfr_equation = "ckd-epi-2009";
      else if (/MDRD/i.test(c)) row.egfr_equation = "mdrd";
      else row.egfr_equation = "unknown";
    }
    const loinc = str(r.LOINC);
    if (loinc) row.loinc = loinc;

    const ev: Evidence = [{ item_id: best.item.id, entry_id: best.key }];
    for (const c of copies) {
      if (c === best) continue;
      if (c.e.RESULT_STATUS === "C" || c.e.RESULT_STATUS === "X") continue;
      ev.push({ item_id: c.item.id, entry_id: c.key });
    }
    row.evidence = ev;
    rows.push({ row, t: timeKey(collected), id });
  }
  rows.sort((a, b) => a.t - b.t || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return rows.map((x) => x.row);
}

// ---------------------------------------------------------------- vitals

function mapVitals(items: FolioItem[]): VitalRow[] {
  const vitals = entriesOf(items, "VITAL");
  const visits = entriesOf(items, "CLINIC_VISIT");
  const visitType = new Map<string, string>();
  for (const v of visits) if (typeof v.e.VISIT_ID === "string" && typeof v.e.VISIT_TYPE === "string") visitType.set(v.e.VISIT_ID, v.e.VISIT_TYPE);

  // per visit, per (code, reading) keep the latest copy
  const byVisit = new Map<string, Map<string, Entry>>();
  for (const v of vitals) {
    const code = v.e.VITAL_CODE;
    if (!["BPS", "BPD", "HR", "WT"].includes(code)) continue;
    if (num(v.e.VALUE_NUM) === undefined) continue;
    const visitId = str(v.e.VISIT_ID) ?? `item:${v.item.id}`;
    const m = byVisit.get(visitId) ?? new Map<string, Entry>();
    m.set(`${code}#${num(v.e.READING_NO) ?? 1}`, v);
    byVisit.set(visitId, m);
  }

  const rows: { row: VitalRow; t: number }[] = [];
  for (const [visitId, m] of byVisit) {
    const list = [...m.values()];
    const home = visitType.get(visitId) === "TEL";
    const readingOf = (e: Entry) => num(e.e.READING_NO) ?? 1;
    const tOf = (e: Entry) => {
      const t = timeKey(e.e.TAKEN_AT);
      return Number.isNaN(t) ? itemKey(e.item)[0] : t;
    };

    const build = (group: Entry[], allowRepeat: boolean): { row: VitalRow; t: number } | undefined => {
      const sorted = group.slice().sort((a, b) => readingOf(a) - readingOf(b) || tOf(a) - tOf(b));
      const of = (code: string) => sorted.filter((e) => e.e.VITAL_CODE === code);
      const bpReadings = [...new Set([...of("BPS"), ...of("BPD")].map(readingOf))].sort((a, b) => a - b);
      const bpAt = (n: number, code: string) => of(code).find((e) => readingOf(e) === n);
      const row: VitalRow = { setting: home ? "home" : "clinic", local_time: "", evidence: [] };
      let timeSrc: Entry | undefined;
      if (bpReadings.length) {
        const first = bpReadings[0];
        const s = bpAt(first, "BPS"), d = bpAt(first, "BPD");
        if (s) row.systolic_mmhg = num(s.e.VALUE_NUM);
        if (d) row.diastolic_mmhg = num(d.e.VALUE_NUM);
        timeSrc = s ?? d;
        if (allowRepeat && bpReadings.length > 1) {
          const rep = bpReadings[bpReadings.length - 1];
          const rs = bpAt(rep, "BPS"), rd = bpAt(rep, "BPD");
          if (rs) row.repeat_systolic_mmhg = num(rs.e.VALUE_NUM);
          if (rd) row.repeat_diastolic_mmhg = num(rd.e.VALUE_NUM);
        }
      }
      const hr = of("HR")[0];
      if (hr) row.pulse_bpm = num(hr.e.VALUE_NUM);
      const wt = of("WT")[0];
      if (wt) {
        const v = num(wt.e.VALUE_NUM) as number;
        const u = String(wt.e.UNIT_CODE ?? "kg").toLowerCase();
        if (u === "kg") row.weight_kg = round(v, 1);
        else if (u === "lb" || u === "lbs") row.weight_kg = round(v * 0.45359237, 1);
        else if (u === "g") row.weight_kg = round(v / 1000, 1);
      }
      if (!timeSrc) timeSrc = sorted.slice().sort((a, b) => tOf(a) - tOf(b))[0];
      const lt = timeSrc ? localMinute(timeSrc.e.TAKEN_AT) ?? localMinute(timeSrc.item.effective) : undefined;
      if (!lt) return undefined;
      row.local_time = lt;
      if (row.systolic_mmhg === undefined && row.diastolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) return undefined;
      const used = sorted.filter((e) => {
        if (e === hr || e === wt) return true;
        if (e.e.VITAL_CODE === "BPS" || e.e.VITAL_CODE === "BPD") {
          const n = readingOf(e);
          return n === bpReadings[0] || (allowRepeat && bpReadings.length > 1 && n === bpReadings[bpReadings.length - 1]);
        }
        return false;
      });
      const ev: Evidence = [];
      const seen = new Set<string>();
      for (const e of used) {
        const k = e.item.id + "\u0000" + e.key;
        if (!seen.has(k)) { seen.add(k); ev.push({ item_id: e.item.id, entry_id: e.key }); }
      }
      row.evidence = ev;
      return { row, t: timeSrc ? tOf(timeSrc) : 0 };
    };

    if (home) {
      // each home reading (by reading number) is its own row
      const readings = [...new Set(list.map(readingOf))].sort((a, b) => a - b);
      for (const n of readings) {
        const r = build(list.filter((e) => readingOf(e) === n), false);
        if (r) rows.push(r);
      }
    } else {
      const r = build(list, true);
      if (r) rows.push(r);
    }
  }
  rows.sort((a, b) => a.t - b.t);
  return rows.map((x) => x.row);
}

// ---------------------------------------------------------------- entry point

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return empty;
  const counting = countingItems(items, asOf);

  const safe = <T>(f: () => T, fallback: T): T => {
    try { return f(); } catch { return fallback; }
  };
  const med = safe(() => mapMedications(counting), { rows: [] as MedicationRow[], rxDrug: new Map<string, string>() });
  const pa = safe(() => mapProblems(counting, med.rxDrug), { problems: [] as ProblemRow[], allergies: [] as AllergyIntoleranceRow[] });
  return {
    medications: med.rows,
    problems: pa.problems,
    allergies: pa.allergies,
    labs: safe(() => mapLabs(counting), [] as LabResultRow[]),
    vitals: safe(() => mapVitals(counting), [] as VitalRow[]),
  };
}
