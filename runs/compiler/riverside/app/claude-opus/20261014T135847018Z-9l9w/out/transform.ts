// Mapper: Riverside Regional Hospital signed clinical documents (riverside-doc-v1) -> consumer views v2.
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

// ───────────────────────────── helpers: time ─────────────────────────────

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
      hourCycle: "h23",
    });
  }
  return dtf;
}

function ms(s: unknown): number | null {
  if (typeof s !== "string" || !s) return null;
  // A date-time without offset is local wall-clock time; it is handled separately where it matters.
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : null;
}

function hasOffset(s: string): boolean {
  return /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i.test(s);
}

/** Local wall-clock `YYYY-MM-DDTHH:MM` in America/Chicago, or null. */
function localDateTime(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const str = s.trim();
  const naive = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(:\d{2}(\.\d+)?)?$/.exec(str);
  if (naive) return `${naive[1]}T${naive[2]}`;
  if (!hasOffset(str)) return null;
  const t = ms(str);
  if (t === null) return null;
  try {
    const parts = fmt().formatToParts(new Date(t));
    const get = (k: string) => parts.find((p) => p.type === k)?.value ?? "";
    let hh = get("hour");
    if (hh === "24") hh = "00";
    return `${get("year")}-${get("month")}-${get("day")}T${hh}:${get("minute")}`;
  } catch {
    return null;
  }
}

/** Local date `YYYY-MM-DD` (or the partial date as written), or null. */
function localDate(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const str = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(str)) return str;
  const ldt = localDateTime(str);
  return ldt ? ldt.slice(0, 10) : null;
}

// ───────────────────────────── helpers: misc ─────────────────────────────

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}
function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}
function isObj(v: unknown): v is Record<string, any> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function round(v: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function pushEv(ev: Evidence, item_id: string, entry_id?: string) {
  if (!ev.some((e) => e.item_id === item_id && e.entry_id === entry_id)) ev.push(entry_id ? { item_id, entry_id } : { item_id });
}

// ───────────────────────────── documents ─────────────────────────────

interface Doc {
  item: FolioItem;
  encId: string;
  kind: string;
  enc: Record<string, any> | null;
  encStart: number;
  recorded: number;
  /** Time of this document's decisions (discharge time for discharge summaries). */
  eventTime: string;
  entries: [string, Record<string, any>][];
  order: number;
}

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const valid = (Array.isArray(items) ? items : []).filter(
    (i) => isObj(i) && typeof i.id === "string" && typeof i.recorded === "string",
  );
  const inScope = valid.filter((i) => {
    const d = localDate(i.recorded);
    return d !== null && d.length === 10 && d <= asOf;
  });
  const byKey = new Map<string, FolioItem>();
  for (const i of valid) byKey.set(`${i.issuer}|${i.id}`, i);
  const dead = new Set<string>();
  const kill = (issuer: string, id: string, seen: Set<string>) => {
    const k = `${issuer}|${id}`;
    if (seen.has(k)) return;
    seen.add(k);
    dead.add(k);
    const target = byKey.get(k);
    // Supersession is transitive: what the replaced item replaced stays replaced.
    if (target && Array.isArray(target.supersedes)) for (const s of target.supersedes) if (typeof s === "string") kill(issuer, s, seen);
  };
  for (const i of inScope) {
    for (const s of Array.isArray(i.supersedes) ? i.supersedes : []) if (typeof s === "string") kill(i.issuer, s, new Set());
    for (const s of Array.isArray(i.retracts) ? i.retracts : []) if (typeof s === "string") kill(i.issuer, s, new Set());
  }
  return inScope.filter((i) => !dead.has(`${i.issuer}|${i.id}`));
}

function buildDocs(items: FolioItem[]): Doc[] {
  const docs: Doc[] = [];
  for (const item of items) {
    const payload = isObj(item.payload) ? item.payload : {};
    const entries: [string, Record<string, any>][] = [];
    for (const k of Object.keys(payload)) {
      const e = payload[k];
      if (isObj(e) && typeof e.type === "string") entries.push([k, e]);
    }
    const encE = entries.find(([, e]) => e.type === "encounter");
    const enc = encE ? encE[1] : null;
    const kind = str(enc?.document_kind) ?? "";
    const encId = str(enc?.encounter_id) ?? `item:${item.id}`;
    const start = ms(enc?.arrived) ?? ms(enc?.admitted) ?? ms(item.effective) ?? ms(item.recorded) ?? 0;
    const eventTime =
      kind === "discharge_summary"
        ? str(enc?.discharged) ?? str(item.effective_end) ?? item.recorded
        : str(item.effective) ?? item.recorded;
    docs.push({ item, encId, kind, enc, encStart: start, recorded: ms(item.recorded) ?? 0, eventTime, entries, order: 0 });
  }
  // Encounters in order of their start; within one, the discharge summary is the final word.
  const encStart = new Map<string, number>();
  for (const d of docs) encStart.set(d.encId, Math.min(encStart.get(d.encId) ?? Infinity, d.encStart));
  docs.sort((a, b) => {
    const ea = encStart.get(a.encId)!, eb = encStart.get(b.encId)!;
    if (ea !== eb) return ea - eb;
    if (a.encId !== b.encId) return a.encId < b.encId ? -1 : 1;
    const da = a.kind === "discharge_summary" ? 1 : 0, db = b.kind === "discharge_summary" ? 1 : 0;
    if (da !== db) return da - db;
    if (a.recorded !== b.recorded) return a.recorded - b.recorded;
    return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0;
  });
  docs.forEach((d, i) => (d.order = i));
  return docs;
}

// ───────────────────────────── drug vocabulary ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro",
  novolog: "insulin aspart", cozaar: "losartan", diovan: "valsartan", zestril: "lisinopril", prinivil: "lisinopril",
  vasotec: "enalapril", altace: "ramipril", lasix: "furosemide", ozempic: "semaglutide", wegovy: "semaglutide",
  rybelsus: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide",
  januvia: "sitagliptin", tradjenta: "linagliptin", lipitor: "atorvastatin", crestor: "rosuvastatin",
  zocor: "simvastatin", norvasc: "amlodipine", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin",
  synthroid: "levothyroxine", aleve: "naproxen", advil: "ibuprofen", motrin: "ibuprofen", tylenol: "acetaminophen",
  zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine", microzide: "hydrochlorothiazide",
  glucotrol: "glipizide", amaryl: "glimepiride", toprol: "metoprolol", lopressor: "metoprolol", coreg: "carvedilol",
};

const CLASSES: { re: RegExp; label: string; members: string[]; tcode?: string[] }[] = [
  { re: /\bsglt[- ]?2(?:\s*inhibitors?|i)?\b|\bgliflozins?\b/i, label: "SGLT2 inhibitor",
    members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin", "bexagliflozin"] },
  { re: /\bace[- ]?(?:inhibitors?|i)\b|\bangiotensin[- ]converting[- ]enzyme inhibitors?\b/i, label: "ACE inhibitor",
    members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"],
    tcode: ["T46.4"] },
  { re: /\barbs?\b|\bangiotensin(?: ii)? receptor blockers?\b/i, label: "ARB",
    members: ["losartan", "valsartan", "irbesartan", "olmesartan", "candesartan", "telmisartan", "azilsartan", "eprosartan"] },
  { re: /\bnsaids?\b|\bnon-?steroidal anti-?inflammatory\b/i, label: "NSAID",
    members: ["naproxen", "ibuprofen", "diclofenac", "meloxicam", "celecoxib", "ketorolac", "indomethacin", "nabumetone", "etodolac"],
    tcode: ["T39.39", "T39.31"] },
  { re: /\bstatins?\b|\bhmg-?coa reductase inhibitors?\b/i, label: "statin",
    members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"] },
  { re: /\bthiazides?(?: diuretics?)?\b/i, label: "thiazide diuretic",
    members: ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone"] },
  { re: /\bloop diuretics?\b/i, label: "loop diuretic", members: ["furosemide", "bumetanide", "torsemide"] },
  { re: /\bsulfonylureas?\b/i, label: "sulfonylurea", members: ["glipizide", "glyburide", "glimepiride"] },
  { re: /\bglp-?1(?: receptor agonists?| ras?)?\b/i, label: "GLP-1 receptor agonist",
    members: ["semaglutide", "liraglutide", "dulaglutide", "exenatide", "tirzepatide", "lixisenatide"] },
  { re: /\bdpp-?4 inhibitors?\b|\bgliptins?\b/i, label: "DPP-4 inhibitor", members: ["sitagliptin", "linagliptin", "saxagliptin", "alogliptin"] },
  { re: /\bbiguanides?\b/i, label: "biguanide", members: ["metformin"] },
  { re: /\bbeta[- ]?blockers?\b/i, label: "beta blocker", members: ["metoprolol", "carvedilol", "atenolol", "propranolol", "bisoprolol", "labetalol", "nebivolol"] },
  { re: /\bpenicillins?\b/i, label: "penicillins", members: ["penicillin", "amoxicillin", "ampicillin", "piperacillin", "dicloxacillin", "nafcillin"] },
  { re: /\bsulfonamides?\b|\bsulfa drugs?\b/i, label: "sulfonamides", members: ["sulfamethoxazole"] },
  { re: /\bfluoroquinolones?\b/i, label: "fluoroquinolones", members: ["ciprofloxacin", "levofloxacin", "moxifloxacin"] },
  { re: /\bcephalosporins?\b/i, label: "cephalosporins", members: ["cephalexin", "cefazolin", "ceftriaxone", "cefdinir", "cefuroxime", "cefepime"] },
  { re: /\bopioids?\b/i, label: "opioids", members: ["morphine", "oxycodone", "hydrocodone", "hydromorphone", "fentanyl", "tramadol", "codeine"] },
  { re: /\binsulins?\b/i, label: "insulin", members: ["insulin glargine", "insulin lispro", "insulin aspart", "insulin detemir", "insulin degludec", "insulin regular", "insulin nph"] },
];

/** T-code (adverse effect) prefixes for drug classes, when the code is all that names the drug. */
const TCODE_CLASS: { prefix: string; cls: string }[] = [
  { prefix: "T46.4", cls: "ACE inhibitor" },
  { prefix: "T39.39", cls: "NSAID" },
  { prefix: "T39.31", cls: "NSAID" },
  { prefix: "T36.0", cls: "penicillins" },
  { prefix: "T36.1", cls: "cephalosporins" },
  { prefix: "T40.2", cls: "opioids" },
  { prefix: "T38.3", cls: "" }, // insulin and oral hypoglycemics: too broad to name a class
];

const KNOWN_DRUGS: string[] = (() => {
  const s = new Set<string>();
  for (const c of CLASSES) for (const m of c.members) s.add(m);
  for (const v of Object.values(BRANDS)) s.add(v);
  for (const d of ["metformin", "warfarin", "amlodipine", "allopurinol", "lithium", "digoxin", "spironolactone", "trimethoprim", "vancomycin", "heparin", "contrast", "iodinated contrast", "aspirin", "acetaminophen", "pioglitazone", "levothyroxine", "prednisone", "clopidogrel", "gabapentin", "valproate", "carbamazepine", "phenytoin", "lamotrigine"]) s.add(d);
  return [...s].sort((a, b) => b.length - a.length);
})();

const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "er", "xr", "xl", "sr", "dr", "ec", "ir", "la",
  "extended", "release", "delayed", "immediate", "oral", "solution", "suspension", "injection", "injectable", "pen", "pens",
  "inhaler", "patch", "cream", "ointment", "chewable", "odt", "film", "coated", "prefilled", "syringe", "vial", "kwikpen",
  "flexpen", "flextouch", "solostar", "hfa", "subcutaneous", "subq", "sc", "iv", "po", "liquid", "drops", "spray", "gel",
  "topical", "nasal", "ophthalmic", "powder", "packet", "u-100", "u100", "u-200", "u-300",
]);
const SALT_WORDS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "besylate", "succinate", "tartrate", "maleate", "mesylate", "fumarate",
  "calcium", "magnesium", "sulfate", "acetate", "bromide", "monohydrate", "dihydrate", "hyclate", "bitartrate", "propionate",
  "furoate", "dipropionate", "citrate", "phosphate", "trihydrate", "anhydrous",
]);

function cleanIngredientPart(part: string): string | undefined {
  let words = part.toLowerCase().replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  const cut = words.findIndex((w) => /\d/.test(w) && !/^u-?\d+$/.test(w) && !/^glp-?1$|^sglt-?2$/.test(w));
  if (cut >= 0) words = words.slice(0, cut);
  words = words.filter((w) => !FORM_WORDS.has(w));
  // Salts are dropped only after the first word ("potassium chloride" stays a drug name).
  while (words.length > 1 && SALT_WORDS.has(words[words.length - 1])) words.pop();
  if (words.length === 0) return undefined;
  if (BRANDS[words[0]]) return BRANDS[words[0]];
  return words.join(" ");
}

function ingredientFromName(name: string): string | undefined {
  const n = name.trim();
  if (!n) return undefined;
  const lower = n.toLowerCase();
  for (const b of Object.keys(BRANDS)) if (new RegExp(`^${b}\\b`).test(lower)) return BRANDS[b];
  if (n.includes("/")) {
    const head = n.split(/\s\d/)[0];
    const parts = head.split("/").map((p) => cleanIngredientPart(p)).filter((p): p is string => !!p);
    return parts.length ? parts.join(" / ") : undefined;
  }
  return cleanIngredientPart(n);
}

// ───────────────────────────── sensitivity ─────────────────────────────

function sensitivityForCondition(label: string, icd?: string): Sensitivity[] | undefined {
  const out = new Set<Sensitivity>();
  const c = (icd ?? "").toUpperCase();
  const l = label.toLowerCase();
  if (/^F1[0-9]/.test(c) || /\b(alcohol use|opioid use|substance use|cocaine|methamphetamine|cannabis use|alcohol dependence|opioid dependence|alcohol withdrawal)\b/.test(l)) out.add("substance-use");
  else if (/^F/.test(c) || /\b(depress|anxiety|bipolar|schizo|psychos|ptsd|post-traumatic|suicid|panic disorder|eating disorder|anorexia nervosa|bulimia|adhd)/.test(l)) out.add("mental-health");
  if (/^(B20|Z21|A5[0-9]|A6[0-4]|Z20\.6)/.test(c) || /\b(hiv|syphilis|gonorrh|chlamydia|herpes simplex genital|trichomon)/.test(l)) out.add("hiv-sti");
  if (/^(O|Z3[0-9]|Z3A)/.test(c) || /\b(pregnan|contracept|miscarriage|abortion|infertility)/.test(l)) out.add("sexual-reproductive-health");
  if (/^Q/.test(c) && /\b(syndrome|genetic|chromosom)/.test(l)) out.add("genetic");
  return out.size ? [...out] : undefined;
}

const MH_DRUGS = ["sertraline", "escitalopram", "citalopram", "fluoxetine", "paroxetine", "venlafaxine", "duloxetine", "bupropion", "mirtazapine", "trazodone", "quetiapine", "olanzapine", "risperidone", "aripiprazole", "haloperidol", "lithium", "lurasidone", "ziprasidone", "clozapine", "lamotrigine"];
const SU_DRUGS = ["buprenorphine", "methadone", "naltrexone", "disulfiram", "acamprosate", "varenicline"];
const SRH_DRUGS = ["ethinyl estradiol", "norethindrone", "levonorgestrel", "drospirenone", "medroxyprogesterone", "etonogestrel"];
const HIV_DRUGS = ["emtricitabine", "tenofovir", "bictegravir", "dolutegravir", "raltegravir", "efavirenz", "rilpivirine", "darunavir", "abacavir", "lamivudine", "zidovudine"];

function sensitivityForDrug(name: string): Sensitivity[] | undefined {
  const l = name.toLowerCase();
  const out: Sensitivity[] = [];
  if (SU_DRUGS.some((d) => l.includes(d))) out.push("substance-use");
  if (MH_DRUGS.some((d) => l.includes(d))) out.push("mental-health");
  if (SRH_DRUGS.some((d) => l.includes(d))) out.push("sexual-reproductive-health");
  if (HIV_DRUGS.some((d) => l.includes(d))) out.push("hiv-sti");
  return out.length ? out : undefined;
}

// ───────────────────────────── medications ─────────────────────────────

interface MedLine {
  doc: Doc;
  key: string;
  entryId: string;
  e: Record<string, any>;
  ingredient?: string;
  mapped: MedicationRow["status"];
  dose: string;
}

function mapMedStatus(s: unknown): MedicationRow["status"] | null {
  switch (s) {
    case "not_reconciled": return "unknown";
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
    default: return null;
  }
}

const STATUS_PRIORITY: Record<string, number> = { active: 4, held: 3, unknown: 2, stopped: 1 };

function medLines(doc: Doc): MedLine[] {
  const out: MedLine[] = [];
  for (const [id, e] of doc.entries) {
    if (e.type !== "home_med") continue;
    const name = str(e.drug_name);
    const mapped = mapMedStatus(e.status);
    if (!name || !mapped) continue;
    const ingredient = ingredientFromName(name);
    const rx = str(e.rxnorm_ingredient);
    const key = rx ? `rx:${rx}` : ingredient ? `in:${ingredient}` : `nm:${norm(name)}`;
    out.push({ doc, key, entryId: id, e, ingredient, mapped, dose: norm(str(e.dose_text) ?? "") });
  }
  return out;
}

function parseDose(doseText: string | undefined, drugName: string): MedicationRow["dose"] {
  if (!doseText) return undefined;
  const t = doseText.toLowerCase().trim();
  if (/\d\s*(-|–|to|or)\s*\d/.test(t) || /sliding|scale|per protocol|variable/.test(t)) return undefined;
  const m = /^(\d+(?:\.\d+)?|\.\d+)\s*([a-z\[\]]+)?/.exec(t);
  if (!m) return undefined;
  const v = parseFloat(m[1]);
  if (!Number.isFinite(v)) return undefined;
  const u = (m[2] ?? "").replace(/[\[\]]/g, "");
  if (u === "mg") return { value: v, unit: "mg" };
  if (u === "g" || u === "gm" || u === "gram" || u === "grams") return { value: round(v * 1000, 3), unit: "mg" };
  if (u === "mcg" || u === "ug" || u === "microgram" || u === "micrograms") return { value: v, unit: "mcg" };
  if (/^(units?|unt|iu|u)$/.test(u)) return { value: v, unit: "units" };
  if (u === "ml") return { value: v, unit: "mL" };
  if (/^(tabs?|tablets?|caps?|capsules?)$/.test(u)) {
    const s = /(\d+(?:\.\d+)?)\s*(mg|mcg)\b/i.exec(drugName);
    if (s && !/\d\s*(mg|mcg)?\s*[-\/]\s*\d/.test(drugName)) {
      const unit = s[2].toLowerCase() as "mg" | "mcg";
      return { value: round(v * parseFloat(s[1]), 3), unit };
    }
    return { value: v, unit: "tablet" };
  }
  return undefined;
}

function parseFreq(sig: string | undefined): MedicationRow["frequency"] {
  if (!sig) return undefined;
  const s = ` ${sig.toLowerCase()} `;
  if (/\bprn\b|as needed|when needed|if needed/.test(s)) return "PRN";
  if (/\bqhs\b|\bhs\b|at bedtime|nightly|at night|every night|before bed/.test(s)) return "QHS";
  if (/\bbid\b|twice (a |per )?da(y|ily)|two times (a |per )?day|every 12 h|q12h/.test(s)) return "BID";
  if (/\btid\b|three times (a |per )?day|every 8 h|q8h/.test(s)) return "TID";
  if (/\bqw\b|weekly|once a week|every week|per week/.test(s)) return "QW";
  if (/\bqid\b|four times|every \d+ h|q\d+h|every other day|\bqod\b|monthly|twice weekly/.test(s)) return "other";
  if (/\bqd\b|\bdaily\b|once a day|once daily|every day|every morning|\bqam\b|in the morning|each morning|every 24 h|q24h/.test(s)) return "QD";
  return "other";
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] {
  if (!text) return undefined;
  const t = text.toLowerCase();
  if (/adverse|side effect|reaction|intoleran|allerg|ketoacidosis|\bdka\b|angioedema|lactic acidosis|hyperkalemia|kidney injury|\baki\b|caused|associated/.test(t)) return "adverse_reaction";
  if (/ineffective|not effective|not working|inadequate response|uncontrolled/.test(t)) return "ineffective";
  if (/replaced|switch|changed to|instead|in place of|transition(ed)? to/.test(t)) return "therapy_changed";
  if (/course complete|completed course|course finished|finished course|completed/.test(t)) return "course_complete";
  if (/patient (declined|refused|prefer|request|chose|wish)|patient's (choice|preference|request)/.test(t)) return "patient_choice";
  return undefined;
}

function mapMedications(docs: Doc[]): MedicationRow[] {
  const snaps = docs.map((d) => ({ doc: d, lines: medLines(d) })).filter((s) => s.lines.length > 0);
  if (snaps.length === 0) return [];
  // The latest encounter's list; within it, the latest discharge summary if there is one (docs are ordered so).
  const latest = snaps[snaps.length - 1];
  const byKey = new Map<string, MedLine>();
  for (const l of latest.lines) {
    const prev = byKey.get(l.key);
    if (!prev || STATUS_PRIORITY[l.mapped] > STATUS_PRIORITY[prev.mapped]) byKey.set(l.key, l);
  }
  const rows: MedicationRow[] = [];
  for (const line of byKey.values()) {
    const e = line.e;
    const drugName = str(e.drug_name)!;
    const row: MedicationRow = { drug_name: drugName, status: line.mapped, patient_reported: false, evidence: [] };
    if (line.ingredient) row.ingredient = line.ingredient;
    const rx = str(e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;

    // Trace back through earlier snapshots while the same line keeps the same status.
    const idx = snaps.indexOf(latest);
    let runStart: MedLine = line;
    const run: MedLine[] = [line];
    let before: MedLine | null = null;
    for (let i = idx - 1; i >= 0; i--) {
      const prevLines = snaps[i].lines.filter((l) => l.key === line.key);
      if (prevLines.length === 0) break;
      const same = prevLines.find((l) => l.mapped === line.mapped && l.dose === line.dose);
      if (!same) {
        before = prevLines.find((l) => l.mapped !== "unknown") ?? prevLines[0];
        break;
      }
      runStart = same;
      run.push(same);
    }
    const sinceDate = localDate(runStart.doc.eventTime);
    if (line.mapped === "held" || line.mapped === "stopped") {
      if (sinceDate) row.status_since = sinceDate;
    } else if (line.mapped === "active") {
      const startStatus = runStart.e.status;
      const resumed = before !== null && before.mapped !== "unknown";
      if ((startStatus === "new" || startStatus === "changed" || resumed) && sinceDate) row.status_since = sinceDate;
    }

    const dose = parseDose(str(e.dose_text), drugName);
    if (dose) row.dose = dose;
    const freq = parseFreq(str(e.sig));
    if (freq) row.frequency = freq;
    // The reason for a hold or stop is often written only where it began.
    const instrLine = run.find((l) => str(l.e.instructions));
    const instr = instrLine ? str(instrLine.e.instructions) : undefined;
    if (line.mapped === "held" || line.mapped === "stopped") {
      if (instr) {
        row.status_reason_text = instr;
        if (instrLine && instrLine !== line && instrLine !== runStart) pushEv(row.evidence, instrLine.doc.item.id, instrLine.entryId);
      }
      if (line.mapped === "stopped") {
        const r = stopReason(instr);
        if (r) row.stop_reason = r;
      }
    }
    const sens = sensitivityForDrug(`${drugName} ${line.ingredient ?? ""}`);
    if (sens) row.sensitivity = sens;
    pushEv(row.evidence, line.doc.item.id, line.entryId);
    if (runStart !== line) pushEv(row.evidence, runStart.doc.item.id, runStart.entryId);
    rows.push(row);
  }
  return rows;
}

// ───────────────────────────── problems & drug-caused reactions ─────────────────────────────

interface CondEntry {
  doc: Doc;
  entryId: string;
  kind: "diagnosis" | "history";
  label: string;
  icd?: string;
  rdx?: string;
  rdxName?: string;
  status: string; // diagnosis status, or 'history'
  onsetText?: string;
}

function fixIcd(c: string | undefined): string | undefined {
  if (!c) return undefined;
  const s = c.trim().toUpperCase();
  if (/^[A-Z]\d[0-9A-Z]\.[0-9A-Z]{1,4}$/.test(s) || /^[A-Z]\d[0-9A-Z]$/.test(s)) return s;
  if (/^[A-Z]\d[0-9A-Z][0-9A-Z]{1,4}$/.test(s)) return `${s.slice(0, 3)}.${s.slice(3)}`;
  return s;
}

function isCkd(label: string, icd?: string): boolean {
  return (icd ?? "").startsWith("N18") || /\bchronic kidney disease\b|\bckd\b|\bchronic renal (insufficiency|failure|disease)\b/i.test(label);
}

function ckdStage(label: string, icd?: string): ProblemRow["ckd_stage"] {
  const l = label.toLowerCase();
  let m = /\bg(1|2|3a|3b|4|5)\b/.exec(l);
  if (m) return `G${m[1]}` as ProblemRow["ckd_stage"];
  m = /\bstage\s*(1|2|3a|3b|4|5|i{1,3}a|i{1,3}b|iv|v|i{1,2})\b/.exec(l);
  if (m) {
    const roman: Record<string, string> = { i: "1", ii: "2", iiia: "3a", iiib: "3b", iv: "4", v: "5" };
    const v = roman[m[1]] ?? m[1];
    if (["1", "2", "3a", "3b", "4", "5"].includes(v)) return `G${v}` as ProblemRow["ckd_stage"];
  }
  if (/\b(esrd|end[- ]stage renal|end[- ]stage kidney)\b/.test(l)) return "G5";
  const c = icd ?? "";
  const map: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
  return map[c];
}

function albuminuria(label: string): ProblemRow["albuminuria"] {
  const m = /\bA([123])\b/.exec(label);
  return m ? (`A${m[1]}` as ProblemRow["albuminuria"]) : undefined;
}

function parseOnset(t: string | undefined): ProblemRow["onset"] {
  if (!t) return undefined;
  const s = t.trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return { value: s, precision: "day" };
  m = /^(\d{4})-(\d{2})$/.exec(s);
  if (m) return { value: s, precision: "month" };
  m = /^(?:in\s+)?(\d{4})$/i.exec(s);
  if (m) return { value: m[1], precision: "year" };
  m = /^(\d{1,2})\/(\d{4})$/.exec(s);
  if (m && +m[1] >= 1 && +m[1] <= 12) return { value: `${m[2]}-${m[1].padStart(2, "0")}`, precision: "month" };
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (m && +m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31)
    return { value: `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`, precision: "day" };
  return undefined;
}

function historyResolved(label: string): boolean {
  return /\b(history of|h\/o|s\/p|status post|resolved|remote|childhood|prior|previous|past)\b/i.test(label);
}

interface Attribution {
  substance: string; // display substance (lower-case generic for a drug, class as written otherwise)
  rx?: string;
  isClass: boolean;
}

function homeMedsOf(doc: Doc): { ing: string; rx?: string }[] {
  return medLines(doc)
    .filter((l) => l.ingredient)
    .map((l) => ({ ing: l.ingredient!, rx: str(l.e.rxnorm_ingredient) }));
}

/** The drug (or drug class) a diagnosis attributes the condition to, or null. */
function attribution(ce: CondEntry, docsForMeds: Doc[]): Attribution | null {
  const texts = [ce.label, ce.rdxName ?? ""].filter(Boolean);
  const icd = ce.icd ?? "";
  const isTAdverse = /^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/.test(icd) || /^T(3[6-9]|4\d|50)\.\d5/.test(icd);
  const attribRe = /(associated|induced|related|due to|secondary to|caused by|from|adverse (effect|reaction)|toxicity|intoleran|reaction to|allergy to)/i;
  let phrase: string | null = null;
  for (const t of texts) if (attribRe.test(t)) { phrase = t; break; }
  if (!phrase && !isTAdverse) return null;
  const hay = (phrase ?? texts.join(" ")).toLowerCase();

  // A specific drug named.
  for (const d of KNOWN_DRUGS) {
    if (new RegExp(`\\b${d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(hay)) return resolveDrug(d, docsForMeds);
  }
  for (const b of Object.keys(BRANDS)) if (new RegExp(`\\b${b}\\b`).test(hay)) return resolveDrug(BRANDS[b], docsForMeds);
  for (const doc of docsForMeds) for (const m of homeMedsOf(doc)) {
    if (m.ing.length > 3 && new RegExp(`\\b${m.ing.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(hay)) return { substance: m.ing, rx: m.rx, isClass: false };
  }
  // A drug class named.
  for (const t of phrase ? [phrase] : texts) {
    for (const c of CLASSES) {
      const m = c.re.exec(t);
      if (m) return resolveClass(c.label, m[0].trim(), c.members, docsForMeds);
    }
  }
  if (isTAdverse) {
    for (const tc of TCODE_CLASS) {
      if (icd.startsWith(tc.prefix) && tc.cls) {
        const c = CLASSES.find((x) => x.label === tc.cls)!;
        return resolveClass(c.label, c.label, c.members, docsForMeds);
      }
    }
  }
  return null;
}

function resolveDrug(d: string, docs: Doc[]): Attribution {
  for (const doc of docs) for (const m of homeMedsOf(doc)) if (m.ing === d && m.rx) return { substance: d, rx: m.rx, isClass: false };
  return { substance: d, isClass: false };
}

function resolveClass(_label: string, asWritten: string, members: string[], docs: Doc[]): Attribution {
  // The one drug of the class on the medication list in the same item, if exactly one.
  const doc = docs[0];
  if (doc) {
    const found = new Map<string, string | undefined>();
    for (const m of homeMedsOf(doc)) if (members.includes(m.ing)) found.set(m.ing, m.rx);
    if (found.size === 1) {
      const [ing, rx] = [...found.entries()][0];
      return rx ? { substance: ing, rx, isClass: false } : { substance: ing, isClass: false };
    }
  }
  return { substance: asWritten.replace(/\binhibitors\b/i, "inhibitor"), isClass: true };
}

/** Diagnosis entry that only names an adverse effect (no condition). */
function adverseEffectOnly(ce: CondEntry): boolean {
  return /^T(3[6-9]|4\d|50)\./.test(ce.icd ?? "") && /^\s*(adverse (effect|reaction|drug reaction)|allergy|allergic reaction|intolerance|drug intolerance|reaction)\b/i.test(ce.label)
    && !/\b(ketoacidosis|angioedema|anaphylaxis|kidney|renal|hyperkalemia|acidosis|rash|urticaria|hives|cough|pancreatitis)\b/i.test(ce.label);
}

function classifyReaction(text: string, substance: string): { type: AllergyIntoleranceRow["reaction_type"]; mech: AllergyIntoleranceRow["mechanism"] } | null {
  const t = text.toLowerCase();
  const isAce = CLASSES[1].members.includes(substance.toLowerCase()) || /\bace\b/i.test(substance);
  if (/anaphyla|angioedema|urticaria|hives|rash|bronchospasm|wheez|swelling|stevens|sjs|\bten\b|toxic epidermal|dress|itch|prurit|hypersensitivity|exanthem/.test(t)) {
    return { type: "hypersensitivity", mech: isAce && /angioedema/.test(t) ? "non_immune" : "unknown" };
  }
  if (/ketoacidosis|\bdka\b|lactic acidosis|hyperkalemia|kidney injury|\baki\b|renal failure|pancreatitis|hypoglycemi|bleed|hemorrhag|agranulocytosis|neutropenia|thrombocytopenia|rhabdo|liver injury|hepatotox|hepatitis|qt prolong|arrhythm|seizure|hyponatremia|serotonin syndrome|neuroleptic/.test(t)) {
    const nonImmune = /ketoacidosis|\bdka\b|lactic acidosis|hyperkalemia|hypoglycemi/.test(t);
    return { type: "serious_adverse_event", mech: nonImmune ? "non_immune" : "unknown" };
  }
  if (/cough|nausea|vomit|diarrh|gi upset|stomach|dyspepsia|constipation|myalgia|muscle (ache|pain)|headache|dizz|fatigue|drowsi|flushing|edema|swollen ankles|insomnia|dry mouth|taste|gas|bloat|intoleran/.test(t)) {
    return { type: "side_effect", mech: isAce && /cough/.test(t) ? "non_immune" : "unknown" };
  }
  return null;
}

interface ProblemsOut {
  problems: ProblemRow[];
  drugAllergies: AllergyIntoleranceRow[];
}

function mapProblems(docs: Doc[]): ProblemsOut {
  const entries: CondEntry[] = [];
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      if (e.type === "diagnosis") {
        const label = str(e.label);
        const status = str(e.status);
        if (!label || !status || !["working", "ruled_out", "active", "resolved"].includes(status)) continue;
        const rdx = isObj(e.riverside_dx) ? e.riverside_dx : null;
        entries.push({ doc, entryId: id, kind: "diagnosis", label, icd: fixIcd(str(e.icd10cm)), rdx: str(rdx?.code), rdxName: str(rdx?.name), status });
      } else if (e.type === "history") {
        const label = str(e.condition);
        if (!label) continue;
        entries.push({ doc, entryId: id, kind: "history", label, icd: fixIcd(str(e.icd10cm)), status: "history", onsetText: str(e.onset_text) });
      }
    }
  }

  // Group entries that describe one condition.
  const keyOf = (ce: CondEntry): string => {
    if (isCkd(ce.label, ce.icd)) return "ckd";
    if (ce.rdx) return `rdx:${ce.rdx}`;
    if (ce.icd) return `icd:${ce.icd}`;
    return `lbl:${norm(ce.label.replace(/^(r\/o|rule out|history of|h\/o)\s+/i, ""))}`;
  };
  const groups = new Map<string, CondEntry[]>();
  for (const ce of entries) {
    const k = keyOf(ce);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(ce);
  }
  // An ICD-only entry joins a Riverside-coded condition with the same ICD code in the same encounter.
  for (const [k, list] of [...groups.entries()]) {
    if (!k.startsWith("icd:")) continue;
    const icd = k.slice(4);
    const targets = [...groups.entries()].filter(([k2, l2]) => k2.startsWith("rdx:") && l2.some((x) => x.icd === icd));
    const remaining: CondEntry[] = [];
    for (const ce of list) {
      const t = targets.filter(([, l2]) => l2.some((x) => x.icd === icd && x.doc.encId === ce.doc.encId));
      if (t.length === 1) t[0][1].push(ce);
      else remaining.push(ce);
    }
    if (remaining.length) groups.set(k, remaining);
    else groups.delete(k);
  }
  // Same-label groups: a free-text entry joins a coded group whose latest label matches.
  for (const [k, list] of [...groups.entries()]) {
    if (!k.startsWith("lbl:")) continue;
    const lbl = k.slice(4);
    const targets = [...groups.entries()].filter(([k2, l2]) => !k2.startsWith("lbl:") && l2.some((x) => norm(x.label) === lbl));
    if (targets.length === 1) {
      targets[0][1].push(...list);
      groups.delete(k);
    }
  }

  const problems: ProblemRow[] = [];
  const drugAllergies: AllergyIntoleranceRow[] = [];
  for (const list0 of groups.values()) {
    const list = [...list0].sort((a, b) => a.doc.order - b.doc.order);
    const dx = list.filter((x) => x.kind === "diagnosis");
    const hx = list.filter((x) => x.kind === "history");

    // Each encounter's conclusion is its last non-working diagnosis entry.
    const conclusions: CondEntry[] = [];
    const encs: string[] = [];
    for (const x of dx) if (!encs.includes(x.doc.encId)) encs.push(x.doc.encId);
    for (const enc of encs) {
      const inEnc = dx.filter((x) => x.doc.encId === enc && x.status !== "working");
      if (inEnc.length) conclusions.push(inEnc[inEnc.length - 1]);
    }
    let state: CondEntry | null = null;
    let status: ProblemRow["status"] | null = null;
    if (conclusions.length) {
      const last = conclusions[conclusions.length - 1];
      if (last.status === "ruled_out") {
        const earlier = [...conclusions].reverse().find((c) => c.status === "active" || c.status === "resolved");
        if (earlier) {
          state = earlier;
          status = "resolved"; // had it before; excluded at a later stay
        }
      } else {
        state = last;
        status = last.status === "resolved" ? "resolved" : "active";
      }
    }
    if (!state && hx.length && !(conclusions.length && conclusions[conclusions.length - 1].status === "ruled_out" && conclusions[conclusions.length - 1].doc.order > hx[hx.length - 1].doc.order)) {
      state = hx[hx.length - 1];
      status = historyResolved(state.label) ? "resolved" : "active";
    }
    if (!state || !status) continue;

    const confirmed = list.filter((x) => x.kind === "history" || x.status === "active" || x.status === "resolved");
    // Latest wording and code among confirmed entries up to the state entry (or later history).
    const describing = confirmed.filter((x) => x.doc.order <= state!.doc.order || x.kind === "history");
    const latest = describing.length ? describing[describing.length - 1] : state;

    // Drug-caused diagnosis -> allergy/intolerance row.
    const dxConfirmed = confirmed.filter((x) => x.kind === "diagnosis");
    let attr: Attribution | null = null;
    let attrEntry: CondEntry | null = null;
    for (const x of [...dxConfirmed].reverse()) {
      attr = attribution(x, [x.doc]);
      if (attr) { attrEntry = x; break; }
    }
    let effectOnly = false;
    if (attr && attrEntry) {
      effectOnly = dxConfirmed.every((x) => adverseEffectOnly(x)) && hx.length === 0;
      const reactionText = attrEntry.label;
      const known = classifyReaction(`${attrEntry.label} ${attrEntry.rdxName ?? ""}`, attr.substance);
      // A diagnosis coded as drug-caused with no recognizable reaction: harm attributed to the drug, severity not derivable.
      const cls = known ?? { type: "serious_adverse_event" as const, mech: "unknown" as const };
      const first = dxConfirmed[0];
      const onsetDate = localDate(first.doc.enc?.arrived ?? first.doc.enc?.admitted ?? first.doc.item.effective);
      const row: AllergyIntoleranceRow = {
        substance: attr.substance,
        reaction_type: cls.type,
        mechanism: cls.mech,
        reaction: reactionText,
        criticality: !known ? "unknown" : cls.type === "side_effect" ? "low" : cls.type === "serious_adverse_event" ? "high" : /anaphyla|angioedema|stevens|toxic epidermal|bronchospasm/i.test(reactionText) ? "high" : "unknown",
        evidence: [],
      };
      if (attr.rx) row.rxnorm_ingredient = attr.rx;
      if (onsetDate && onsetDate.length === 10) row.onset = { value: onsetDate, precision: "day" };
      pushEv(row.evidence, attrEntry.doc.item.id, attrEntry.entryId);
      if (state !== attrEntry) pushEv(row.evidence, state.doc.item.id, state.entryId);
      drugAllergies.push(row);
    }
    if (effectOnly) continue;

    const row: ProblemRow = { condition: latest.label, status, evidence: [] };
    const icd = [...describing].reverse().find((x) => x.icd)?.icd;
    if (icd) row.icd10cm = icd;
    const onsetSrc = [...hx].reverse().find((x) => parseOnset(x.onsetText));
    if (onsetSrc) row.onset = parseOnset(onsetSrc.onsetText);
    if (list.some((x) => isCkd(x.label, x.icd))) {
      const st = [...confirmed].reverse().map((x) => ckdStage(x.label, x.icd)).find((s) => s);
      if (st) row.ckd_stage = st;
      const al = [...confirmed].reverse().map((x) => albuminuria(x.label)).find((s) => s);
      if (al) row.albuminuria = al;
    }
    const sens = new Set<Sensitivity>();
    for (const x of confirmed) for (const s of sensitivityForCondition(x.label, x.icd) ?? []) sens.add(s);
    if (sens.size) row.sensitivity = [...sens];
    pushEv(row.evidence, state.doc.item.id, state.entryId);
    if (latest !== state) pushEv(row.evidence, latest.doc.item.id, latest.entryId);
    problems.push(row);
  }
  return { problems, drugAllergies };
}

// ───────────────────────────── allergies ─────────────────────────────

const CRIT_RANK: Record<string, number> = { high: 3, unknown: 2, low: 1 };
const TYPE_RANK: Record<string, number> = { serious_adverse_event: 3, hypersensitivity: 2, side_effect: 1 };

function mapAllergies(docs: Doc[], fromDx: AllergyIntoleranceRow[]): AllergyIntoleranceRow[] {
  const snaps = docs.map((d) => ({ doc: d, list: d.entries.filter(([, e]) => e.type === "allergy" && str(e.substance)) })).filter((s) => s.list.length > 0);
  const rows: AllergyIntoleranceRow[] = [];
  if (snaps.length) {
    const latest = snaps[snaps.length - 1];
    for (const [id, e] of latest.list) {
      const substanceRaw = str(e.substance)!;
      if (/^(nkda|nka|no known (drug )?allergies|none)$/i.test(substanceRaw)) continue;
      const rx = str(e.rxnorm_ingredient);
      const ing = rx ? ingredientFromName(substanceRaw) ?? substanceRaw.toLowerCase() : substanceRaw;
      const substance = rx ? ing : BRANDS[substanceRaw.toLowerCase()] ?? substanceRaw;
      const reaction = str(e.reaction);
      const sev = str(e.severity);
      const cls = reaction ? classifyReaction(reaction, substance) : null;
      let type: AllergyIntoleranceRow["reaction_type"];
      let mech: AllergyIntoleranceRow["mechanism"] = "unknown";
      if (cls) { type = cls.type; mech = cls.mech; }
      else if (sev === "mild") type = "side_effect";
      else type = "hypersensitivity";
      const criticality: AllergyIntoleranceRow["criticality"] = sev === "mild" ? "low" : sev === "severe" ? "high" : "unknown";
      const row: AllergyIntoleranceRow = { substance, reaction_type: type, mechanism: mech, criticality, evidence: [] };
      if (rx) row.rxnorm_ingredient = rx;
      if (reaction) row.reaction = reaction;
      pushEv(row.evidence, latest.doc.item.id, id);
      rows.push(row);
    }
  }
  const keyOf = (r: AllergyIntoleranceRow) => (r.rxnorm_ingredient ? `rx:${r.rxnorm_ingredient}` : `s:${r.substance.toLowerCase()}`);
  for (const r of fromDx) {
    const existing = rows.find((x) => keyOf(x) === keyOf(r) || x.substance.toLowerCase() === r.substance.toLowerCase());
    if (!existing) { rows.push(r); continue; }
    const reactions = [existing.reaction, r.reaction].filter((x): x is string => !!x);
    const uniq = [...new Set(reactions)];
    if (uniq.length) existing.reaction = uniq.join("; ");
    if (TYPE_RANK[r.reaction_type] > TYPE_RANK[existing.reaction_type]) {
      existing.reaction_type = r.reaction_type;
      existing.mechanism = r.mechanism;
    }
    if (CRIT_RANK[r.criticality] > CRIT_RANK[existing.criticality]) existing.criticality = r.criticality;
    if (!existing.onset && r.onset) existing.onset = r.onset;
    if (!existing.rxnorm_ingredient && r.rxnorm_ingredient) existing.rxnorm_ingredient = r.rxnorm_ingredient;
    for (const ev of r.evidence) pushEv(existing.evidence, ev.item_id, ev.entry_id);
  }
  // Merge duplicate drug-caused rows for one substance.
  const out: AllergyIntoleranceRow[] = [];
  for (const r of rows) {
    const ex = out.find((x) => keyOf(x) === keyOf(r));
    if (!ex) { out.push(r); continue; }
    const uniq = [...new Set([ex.reaction, r.reaction].filter((x): x is string => !!x))];
    if (uniq.length) ex.reaction = uniq.join("; ");
    if (TYPE_RANK[r.reaction_type] > TYPE_RANK[ex.reaction_type]) { ex.reaction_type = r.reaction_type; ex.mechanism = r.mechanism; }
    if (CRIT_RANK[r.criticality] > CRIT_RANK[ex.criticality]) ex.criticality = r.criticality;
    for (const ev of r.evidence) pushEv(ex.evidence, ev.item_id, ev.entry_id);
  }
  return out;
}

// ───────────────────────────── labs ─────────────────────────────

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "14682-9": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr", "88293-6": "egfr", "88294-4": "egfr", "50044-7": "egfr", "77147-7": "egfr", "69405-9": "egfr", "94677-2": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "39789-3": "potassium",
  "2951-2": "sodium", "2947-0": "sodium", "39791-9": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "14937-7": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "14749-6": "glucose", "1558-6": "glucose", "15074-8": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "14958-3": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "804-5": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin", "30350-3": "hemoglobin",
  "53060-9": "bhb", "33428-4": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2745-8": "ph", "19213-8": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "2020-6": "pco2",
  "3040-3": "lipase", "1798-8": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin", "16255-2": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "69419-0": "ldl",
};

const LOCAL_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", CREA: "creatinine",
  EGFR: "egfr",
  K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", GLUC: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", ACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", PH: "ph", VPH: "ph", APH: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2",
  LIPASE: "lipase", LIP: "lipase", TROPI: "troponin", TNI: "troponin", TROP: "troponin", TROPONIN: "troponin",
  CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

const ANALYTE_UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L",
  troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function analyteOf(test: Record<string, any>, specimen: string): Analyte | null {
  const loinc = str(test.loinc);
  const code = (str(test.local_code) ?? "").toUpperCase();
  const name = (str(test.name) ?? "").toLowerCase();
  let a: Analyte | null = (loinc && LOINC_ANALYTE[loinc]) || LOCAL_ANALYTE[code] || null;
  if (!a && /^EGFR/.test(code)) a = "egfr";
  if (!a && /^(troponin i|troponin-i|hs troponin i|high[- ]sensitivity troponin i)/.test(name)) a = "troponin";
  if (!a) return null;
  if (loinc && !LOINC_ANALYTE[loinc] && LOCAL_ANALYTE[code]) {
    // Local code matched but LOINC unknown: guard against urine/other specimens for serum analytes.
  }
  const sp = specimen.toLowerCase();
  if ((a === "creatinine" || a === "glucose" || a === "potassium" || a === "sodium" || a === "chloride" || a === "bun") && /urine|csf|fluid/.test(sp + " " + name)) return null;
  if (a === "glucose" && (/whole blood|capillary|fingerstick|point[- ]of[- ]care|poc|meter/.test(sp + " " + name))) return null;
  if (a === "troponin" && /troponin t\b|tnt/.test(name)) return null;
  if (a === "uacr" && !/urine/.test(sp) && sp !== "" && !/albumin/.test(name)) return null;
  return a;
}

function convert(a: Analyte, v: number, unitRaw: string | undefined): number | null {
  const u = (unitRaw ?? "").trim().replace(/\s+/g, "").toLowerCase();
  switch (a) {
    case "ph": return u === "" || u === "[ph]" || u === "ph" ? v : null;
    case "creatinine":
      if (u === "mg/dl") return v;
      if (u === "umol/l" || u === "µmol/l") return round(v / 88.42, 2);
      return null;
    case "egfr":
      return /^ml\/min(\/1\.73m2|\/1\.73\s*m2|\/{1\.73_m2})?$/.test(u) || u === "ml/min/1.73m^2" ? v : null;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      return u === "mmol/l" || u === "meq/l" ? v : null;
    case "bun":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return round(v * 2.801, 1);
      return null;
    case "glucose":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 18.016);
      return null;
    case "a1c":
      if (u === "%") return v;
      if (u === "mmol/mol") return round(v / 10.929 + 2.15, 1);
      return null;
    case "uacr":
      if (u === "mg/g" || u === "ug/mg" || u === "mg/g{creat}" || u === "mg/g creat") return v;
      if (u === "mg/mmol") return round(v * 8.84, 1);
      return null;
    case "platelets": case "wbc":
      if (u === "10*3/ul" || u === "k/ul" || u === "10^3/ul" || u === "x10e3/ul" || u === "10*9/l" || u === "10^9/l" || u === "thou/ul") return v;
      if (u === "/ul" || u === "cells/ul") return round(v / 1000, 3);
      return null;
    case "hemoglobin":
      if (u === "g/dl") return v;
      if (u === "g/l") return round(v / 10, 1);
      return null;
    case "pco2": return u === "mmhg" || u === "mm[hg]" ? v : null;
    case "lipase": return u === "u/l" || u === "iu/l" ? v : null;
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

function egfrEquation(test: Record<string, any>, collected: string): LabResultRow["egfr_equation"] {
  const name = (str(test.name) ?? "").toLowerCase();
  if (/2021|race[- ]free/.test(name)) return "ckd-epi-2021";
  if (/2009/.test(name)) return "ckd-epi-2009";
  if (/mdrd/.test(name)) return "mdrd";
  const l = str(test.loinc);
  if (l === "98979-8") return "ckd-epi-2021";
  if (l === "62238-1" || l === "88293-6" || l === "88294-4") return "ckd-epi-2009";
  if (l === "33914-3" || l === "48642-3" || l === "48643-1") return "mdrd";
  // Riverside documents eGFR as CKD-EPI 2021 for all results since 2023.
  const t = ms(collected);
  if (t !== null && t >= Date.parse("2023-01-01T06:00:00Z")) return "ckd-epi-2021";
  return "unknown";
}

function raceVariant(test: Record<string, any>): "race" | "nonrace" | null {
  const n = (str(test.name) ?? "").toLowerCase();
  const l = str(test.loinc);
  if (/non[- ]?(african|black)|not (african|black)/.test(n) || l === "48642-3" || l === "88294-4") return "nonrace";
  if (/african|black|\baa\b/.test(n) || l === "48643-1" || l === "88293-6") return "race";
  return null;
}

const STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

interface LabCopy {
  doc: Doc;
  entryId: string;
  accession: string;
  collected: string;
  specimen: string;
  status: string;
  rv: Record<string, any>;
}

function mapLabs(docs: Doc[]): LabResultRow[] {
  const best = new Map<string, LabCopy>();
  const copies = new Map<string, LabCopy[]>();
  const keyOf = (c: LabCopy) => `${c.accession}|${str(c.rv.test?.local_code) ?? str(c.rv.test?.loinc) ?? str(c.rv.test?.name) ?? ""}`;
  const consider = (c: LabCopy) => {
    const key = keyOf(c);
    if (!copies.has(key)) copies.set(key, []);
    copies.get(key)!.push(c);
    const prev = best.get(key);
    if (!prev) { best.set(key, c); return; }
    const rp = STATUS_RANK[prev.status] ?? 0, rc = STATUS_RANK[c.status] ?? 0;
    if (rc > rp || (rc === rp && c.doc.recorded > prev.doc.recorded)) best.set(key, c);
  };
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      if (e.type === "result" && isObj(e.test)) {
        const acc = str(e.accession), col = str(e.collected), st = str(e.status);
        if (!acc || !col || !st || !STATUS_RANK[st]) continue;
        consider({ doc, entryId: id, accession: acc, collected: col, specimen: str(e.specimen) ?? "", status: st, rv: e });
      } else if (e.type === "panel" && Array.isArray(e.components)) {
        const acc = str(e.accession), col = str(e.collected), st = str(e.status);
        if (!acc || !col || !st || !STATUS_RANK[st]) continue;
        for (const comp of e.components) {
          if (!isObj(comp) || !isObj(comp.test)) continue;
          consider({ doc, entryId: id, accession: acc, collected: col, specimen: str(e.specimen) ?? "", status: st, rv: comp });
        }
      }
    }
  }
  const rows: (LabResultRow & { _acc: string; _race: "race" | "nonrace" | null; _eq?: string })[] = [];
  for (const c of best.values()) {
    const a = analyteOf(c.rv.test, c.specimen);
    if (!a) continue;
    const raw = typeof c.rv.value === "number" ? String(c.rv.value) : str(c.rv.value);
    if (!raw) continue;
    const m = /^(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)$/.exec(raw.replace(/,/g, "").trim());
    if (!m) continue;
    const v = convert(a, parseFloat(m[2]), str(c.rv.unit));
    if (v === null || !Number.isFinite(v)) continue;
    if (!hasOffset(c.collected) && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(c.collected)) continue;
    const row: LabResultRow & { _acc: string; _race: "race" | "nonrace" | null; _eq?: string } = {
      analyte: a,
      value: v,
      unit: ANALYTE_UNIT[a],
      collected: c.collected,
      status: c.status === "preliminary" ? "preliminary" : "final",
      evidence: [{ item_id: c.doc.item.id, entry_id: c.entryId }],
      _acc: c.accession,
      _race: null,
    };
    for (const o of copies.get(keyOf(c)) ?? []) pushEv(row.evidence, o.doc.item.id, o.entryId);
    const cmp = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1];
    if (cmp) row.comparator = cmp as LabResultRow["comparator"];
    if (a === "egfr") {
      row.egfr_equation = egfrEquation(c.rv.test, c.collected);
      row._race = raceVariant(c.rv.test);
      row._eq = row.egfr_equation;
    }
    const loinc = str(c.rv.test.loinc);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  // eGFR: drop a race-coefficient variant when the race-free variant of the same calculation is reported.
  const out: LabResultRow[] = [];
  for (const r of rows) {
    if (r.analyte === "egfr" && r._race === "race") {
      const twin = rows.some((x) => x !== r && x.analyte === "egfr" && x._acc === r._acc && x._eq === r._eq && x._race === "nonrace");
      if (twin) continue;
    }
    const { _acc, _race, _eq, ...clean } = r;
    out.push(clean);
  }
  out.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
  return out;
}

// ───────────────────────────── vitals ─────────────────────────────

function mapVitals(docs: Doc[]): VitalRow[] {
  interface V { doc: Doc; id: string; t: number; local: string; e: Record<string, any> }
  const seen = new Map<string, V>();
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      if (e.type !== "vitals") continue;
      const taken = str(e.taken);
      const local = localDateTime(taken);
      if (!taken || !local) continue;
      const t = ms(hasOffset(taken) ? taken : `${taken}Z`) ?? 0;
      const sig = JSON.stringify([e.bp?.systolic_mmhg, e.bp?.diastolic_mmhg, e.heart_rate_bpm, e.weight_kg]);
      const key = `${local}|${sig}`;
      const prev = seen.get(key);
      // The same set copied into several documents is one measurement; cite the earliest copy.
      if (!prev || doc.recorded < prev.doc.recorded) seen.set(key, { doc, id, t, local, e });
    }
  }
  const sets = [...seen.values()].sort((a, b) => a.t - b.t || (a.local < b.local ? -1 : 1));
  const rows: VitalRow[] = [];
  let cur: { row: VitalRow; t0: number; enc: string } | null = null;
  for (const v of sets) {
    const sys = num(v.e.bp?.systolic_mmhg), dia = num(v.e.bp?.diastolic_mmhg);
    const hr = num(v.e.heart_rate_bpm), wt = num(v.e.weight_kg);
    if (sys === undefined && dia === undefined && hr === undefined && wt === undefined) continue;
    // Another set within a few minutes at the same stay belongs to the same set (repeat BP).
    if (cur && cur.enc === v.doc.encId && v.t - cur.t0 <= 15 * 60000 && v.t !== cur.t0) {
      const r = cur.row;
      if (sys !== undefined && dia !== undefined) {
        if (r.systolic_mmhg === undefined) { r.systolic_mmhg = sys; r.diastolic_mmhg = dia; r.local_time = v.local; }
        else if (r.repeat_systolic_mmhg === undefined) { r.repeat_systolic_mmhg = sys; r.repeat_diastolic_mmhg = dia; }
      }
      if (r.pulse_bpm === undefined && hr !== undefined) r.pulse_bpm = hr;
      if (r.weight_kg === undefined && wt !== undefined) r.weight_kg = round(wt, 1);
      pushEv(r.evidence, v.doc.item.id, v.id);
      continue;
    }
    const row: VitalRow = { setting: "hospital", local_time: v.local, evidence: [{ item_id: v.doc.item.id, entry_id: v.id }] };
    if (sys !== undefined && dia !== undefined) { row.systolic_mmhg = sys; row.diastolic_mmhg = dia; }
    if (hr !== undefined) row.pulse_bpm = hr;
    if (wt !== undefined) row.weight_kg = round(wt, 1);
    rows.push(row);
    cur = { row, t0: v.t, enc: v.doc.encId };
  }
  return rows;
}

// ───────────────────────────── entry point ─────────────────────────────

function safe<T>(f: () => T[]): T[] {
  try { return f(); } catch { return []; }
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return empty;
  let docs: Doc[];
  try {
    docs = buildDocs(currentItems(items, asOf));
  } catch {
    return empty;
  }
  let probs: ProblemsOut = { problems: [], drugAllergies: [] };
  try { probs = mapProblems(docs); } catch { /* skip */ }
  return {
    medications: safe(() => mapMedications(docs)),
    problems: probs.problems,
    allergies: safe(() => mapAllergies(docs, probs.drugAllergies)),
    labs: safe(() => mapLabs(docs)),
    vitals: safe(() => mapVitals(docs)),
  };
}
