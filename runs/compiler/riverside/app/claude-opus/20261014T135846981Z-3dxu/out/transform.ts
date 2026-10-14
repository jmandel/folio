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

// Riverside Regional Hospital signed documents -> consumer views.

const TZ = "America/Chicago";

// ───────────────────────────── generic helpers ─────────────────────────────

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x : undefined;
}
function num(x: unknown): number | undefined {
  return typeof x === "number" && Number.isFinite(x) ? x : undefined;
}

let fmt: Intl.DateTimeFormat | undefined;
function chicagoFormatter(): Intl.DateTimeFormat {
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  }
  return fmt;
}

/** Local (America/Chicago) wall-clock `YYYY-MM-DDTHH:MM` for a date-time; undefined if unreadable. */
function localDateTime(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  // Date-time without offset: already local wall-clock time.
  const naive = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(:\d{2}(\.\d+)?)?$/.exec(t);
  if (naive) return `${naive[1]}T${naive[2]}`;
  if (!/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(t)) return undefined;
  const ms = Date.parse(t);
  if (!Number.isFinite(ms)) return undefined;
  try {
    const parts: Record<string, string> = {};
    for (const p of chicagoFormatter().formatToParts(new Date(ms))) parts[p.type] = p.value;
    const hour = parts.hour === "24" ? "00" : parts.hour;
    return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}`;
  } catch {
    return undefined;
  }
}

/** Local date (or partial date as given) for an envelope/payload time. */
function localDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  const dt = localDateTime(t);
  return dt ? dt.slice(0, 10) : undefined;
}

function ms(s: unknown): number {
  if (typeof s !== "string") return NaN;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : NaN;
}

function cmpNum(a: number, b: number): number {
  const an = Number.isFinite(a) ? a : -Infinity;
  const bn = Number.isFinite(b) ? b : -Infinity;
  return an < bn ? -1 : an > bn ? 1 : 0;
}

function precisionOf(d: string): "year" | "month" | "day" {
  return d.length === 4 ? "year" : d.length === 7 ? "month" : "day";
}

function pushEv(ev: Evidence, item_id: string, entry_id?: string): void {
  if (!ev.some((e) => e.item_id === item_id && e.entry_id === entry_id)) {
    ev.push(entry_id === undefined ? { item_id } : { item_id, entry_id });
  }
}

// ───────────────────────────── documents ─────────────────────────────

interface Doc {
  item: FolioItem;
  enc: Record<string, any> | undefined;
  kind: string;
  encId: string;
  encStart: number;
  recorded: number;
  isDS: boolean;
  /** Local date of this document's medication decisions. */
  decisionDate?: string;
  entries: [string, Record<string, any>][];
}

function buildDocs(items: FolioItem[], asOf: string): Doc[] {
  const inScope: FolioItem[] = [];
  for (const it of items) {
    if (!isObj(it) || typeof it.id !== "string") continue;
    const rec = localDate(it.recorded);
    if (!rec || rec.length !== 10) continue;
    if (rec > asOf) continue;
    inScope.push(it);
  }
  // FOLIO correction rules: anything superseded or retracted by an in-scope item (same issuer).
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const list of [it.supersedes, it.retracts]) {
      if (!Array.isArray(list)) continue;
      for (const id of list) if (typeof id === "string") dead.add(`${it.issuer}\u0000${id}`);
    }
  }
  const docs: Doc[] = [];
  for (const it of inScope) {
    if (dead.has(`${it.issuer}\u0000${it.id}`)) continue;
    const payload = isObj(it.payload) ? it.payload : {};
    const entries: [string, Record<string, any>][] = [];
    let enc: Record<string, any> | undefined;
    for (const [k, v] of Object.entries(payload)) {
      if (!isObj(v) || typeof v.type !== "string") continue;
      entries.push([k, v]);
      if (v.type === "encounter" && !enc) enc = v;
    }
    const kind = str(enc?.document_kind) ?? "";
    const isDS = kind === "discharge_summary";
    let encStart = ms(enc?.arrived);
    if (!Number.isFinite(encStart)) encStart = ms(enc?.admitted);
    if (!Number.isFinite(encStart)) encStart = ms(it.effective);
    const decisionDate = isDS
      ? localDate(enc?.discharged) ?? localDate(it.effective_end) ?? localDate(it.effective)
      : localDate(it.effective);
    docs.push({
      item: it,
      enc,
      kind,
      encId: str(enc?.encounter_id) ?? `item:${it.id}`,
      encStart,
      recorded: ms(it.recorded),
      isDS,
      decisionDate,
      entries,
    });
  }
  // Chronological order of the record: by encounter, discharge summaries last in their encounter,
  // then by signing time.
  docs.sort(
    (a, b) =>
      cmpNum(a.encStart, b.encStart) ||
      (a.encId < b.encId ? -1 : a.encId > b.encId ? 1 : 0) ||
      (a.isDS === b.isDS ? 0 : a.isDS ? 1 : -1) ||
      cmpNum(a.recorded, b.recorded) ||
      (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0),
  );
  return docs;
}

// ───────────────────────────── drug names ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  steglatro: "ertugliflozin",
  glucophage: "metformin",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  semglee: "insulin glargine",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  humalog: "insulin lispro",
  admelog: "insulin lispro",
  novolog: "insulin aspart",
  fiasp: "insulin aspart",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  trulicity: "dulaglutide",
  victoza: "liraglutide",
  mounjaro: "tirzepatide",
  januvia: "sitagliptin",
  tradjenta: "linagliptin",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  zocor: "simvastatin",
  pravachol: "pravastatin",
  cozaar: "losartan",
  diovan: "valsartan",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  vasotec: "enalapril",
  altace: "ramipril",
  norvasc: "amlodipine",
  lasix: "furosemide",
  microzide: "hydrochlorothiazide",
  aldactone: "spironolactone",
  eliquis: "apixaban",
  xarelto: "rivaroxaban",
  coumadin: "warfarin",
  jantoven: "warfarin",
  synthroid: "levothyroxine",
  levoxyl: "levothyroxine",
  aleve: "naproxen",
  naprosyn: "naproxen",
  advil: "ibuprofen",
  motrin: "ibuprofen",
  tylenol: "acetaminophen",
  plavix: "clopidogrel",
  toprol: "metoprolol",
  lopressor: "metoprolol",
  coreg: "carvedilol",
  zoloft: "sertraline",
  lexapro: "escitalopram",
  prozac: "fluoxetine",
  wellbutrin: "bupropion",
  prilosec: "omeprazole",
  protonix: "pantoprazole",
  neurontin: "gabapentin",
  glucotrol: "glipizide",
  amaryl: "glimepiride",
  flomax: "tamsulosin",
  zyloprim: "allopurinol",
  kerendia: "finerenone",
  entresto: "sacubitril / valsartan",
};

const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "oral", "solution",
  "suspension", "injection", "injectable", "pen", "pens", "er", "xr", "sr", "xl", "cr", "la", "dr", "ec",
  "extended", "release", "extended-release", "delayed", "delayed-release", "chewable", "patch", "cream",
  "ointment", "inhaler", "subq", "po", "film", "coated", "film-coated", "vial", "prefilled", "syringe",
  "kwikpen", "flexpen", "flextouch", "solostar", "liquid", "drops", "spray", "nasal", "topical", "gel",
  "odt", "disintegrating", "orally", "powder", "packet", "iv", "infusion", "human", "regular",
]);
const SALT_WORDS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "calcium", "besylate", "maleate", "succinate",
  "tartrate", "mesylate", "citrate", "sulfate", "fumarate", "magnesium", "bromide", "hyclate",
  "monohydrate", "dihydrate", "acetate", "phosphate", "disodium", "dipropionate", "propionate",
  "furoate", "xinafoate", "bitartrate", "hydrobromide", "trihydrate", "anhydrous",
]);

/** Generic ingredient name, lower case, without salt or form. */
function genericName(drugName: string): string | undefined {
  let s = drugName.toLowerCase();
  // Brand in parentheses or as the name.
  const words0 = s.replace(/[(),®™]/g, " ").split(/\s+/).filter(Boolean);
  for (const w of words0) if (BRANDS[w]) return BRANDS[w];
  s = s.replace(/\([^)]*\)/g, " ");
  // Drop strength and everything after it.
  const m = /^(.*?)(\d|\s\d)/.exec(s);
  if (m && m[1].trim() !== "") s = m[1];
  s = s.replace(/[,;]/g, " ");
  let words = s.split(/\s+/).filter(Boolean);
  // "insulin regular (human)" keeps "regular"; only drop form words for non-insulin names.
  const keepRegular = words[0] === "insulin";
  words = words.filter((w) => !FORM_WORDS.has(w) || (keepRegular && (w === "regular" || w === "human")));
  if (keepRegular) words = words.filter((w) => w !== "human");
  if (words.length > 1) words = [words[0], ...words.slice(1).filter((w) => !SALT_WORDS.has(w))];
  const out = words.join(" ").trim();
  return out === "" ? undefined : out;
}

// ───────────────────────────── drug classes ─────────────────────────────

interface DrugClass {
  re: RegExp;
  member: (ingredient: string) => boolean;
}
const DRUG_CLASSES: DrugClass[] = [
  { re: /sglt-?2(\s+inhibitor)?s?|gliflozins?/i, member: (g) => /gliflozin$/.test(g) },
  { re: /ace[\s-]?inhibitors?|\bacei\b|angiotensin[\s-]converting[\s-]enzyme inhibitors?/i, member: (g) => /pril$/.test(g) },
  { re: /\barbs?\b|angiotensin (ii )?receptor blockers?/i, member: (g) => /sartan$/.test(g) },
  { re: /\bstatins?\b|hmg-?coa reductase inhibitors?/i, member: (g) => /statin$/.test(g) },
  { re: /\bnsaids?\b|non-?steroidal anti-?inflammatory/i, member: (g) => /^(naproxen|ibuprofen|diclofenac|meloxicam|celecoxib|indomethacin|ketorolac|aspirin|nabumetone|etodolac|piroxicam|sulindac)$/.test(g) },
  { re: /biguanides?/i, member: (g) => g === "metformin" },
  { re: /sulfonylureas?/i, member: (g) => /^(glipizide|glyburide|glimepiride|gliclazide)$/.test(g) },
  { re: /dpp-?4 inhibitors?|gliptins?/i, member: (g) => /gliptin$/.test(g) },
  { re: /glp-?1( receptor agonists?| ras?)?/i, member: (g) => /glutide$|^exenatide$|^tirzepatide$/.test(g) },
  { re: /beta[\s-]?blockers?/i, member: (g) => /olol$|^carvedilol$|^labetalol$/.test(g) },
  { re: /thiazides?( diuretics?)?/i, member: (g) => /thiazide$|^chlorthalidone$|^indapamide$|^metolazone$/.test(g) },
  { re: /loop diuretics?/i, member: (g) => /^(furosemide|bumetanide|torsemide|ethacrynic acid)$/.test(g) },
  { re: /mineralocorticoid receptor antagonists?|\bmras?\b/i, member: (g) => /^(spironolactone|eplerenone|finerenone)$/.test(g) },
  { re: /calcium channel blockers?|\bccbs?\b/i, member: (g) => /dipine$|^diltiazem$|^verapamil$/.test(g) },
  { re: /\binsulins?\b/i, member: (g) => /^insulin/.test(g) },
  { re: /penicillins?/i, member: (g) => /cillin$/.test(g) },
  { re: /cephalosporins?/i, member: (g) => /^cef|^ceph/.test(g) },
  { re: /fluoroquinolones?|quinolones?/i, member: (g) => /floxacin$/.test(g) },
  { re: /sulfonamides?|sulfa drugs?/i, member: (g) => /^sulfa/.test(g) },
  { re: /opioids?|opiates?/i, member: (g) => /^(morphine|oxycodone|hydrocodone|hydromorphone|fentanyl|codeine|tramadol|methadone|tapentadol)$/.test(g) },
  { re: /anticoagulants?|\bdoacs?\b/i, member: (g) => /^(warfarin|apixaban|rivaroxaban|dabigatran|edoxaban|heparin|enoxaparin)$/.test(g) },
];

// ───────────────────────────── sensitivity ─────────────────────────────

function sensitivityForCode(icd?: string): Sensitivity[] {
  if (!icd) return [];
  const c = icd.toUpperCase();
  if (/^F1[0-9]/.test(c)) return ["substance-use"];
  if (/^F/.test(c)) return ["mental-health"];
  if (/^(B20|Z21|B97\.35|A5[0-9]|A6[0-4])/.test(c)) return ["hiv-sti"];
  if (/^(O|Z3[0-9]|N96|N97|Z30)/.test(c)) return ["sexual-reproductive-health"];
  return [];
}
function sensitivityForText(text: string): Sensitivity[] {
  const t = text.toLowerCase();
  if (/\b(alcohol use|opioid use|substance use|cocaine|methamphetamine|cannabis use|alcohol dependence|opioid dependence)\b/.test(t)) return ["substance-use"];
  if (/\b(hiv|chlamydia|gonorrh|syphilis|herpes simplex genital|trichomon)/.test(t)) return ["hiv-sti"];
  if (/\b(depress|anxiety|bipolar|schizo|ptsd|psychos|adhd|panic disorder|eating disorder|anorexia nervosa|bulimia)/.test(t)) return ["mental-health"];
  if (/\b(pregnan|contracept|infertility|abortion|miscarriage)/.test(t)) return ["sexual-reproductive-health"];
  return [];
}
const MED_SENS: [RegExp, Sensitivity][] = [
  [/^(buprenorphine|naltrexone|methadone|disulfiram|acamprosate|naloxone|varenicline)$/, "substance-use"],
  [/^(sertraline|escitalopram|citalopram|fluoxetine|paroxetine|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|lithium|quetiapine|olanzapine|risperidone|aripiprazole|ziprasidone|lurasidone|haloperidol|clozapine|lamotrigine|buspirone|methylphenidate|amphetamine|lisdexamfetamine|atomoxetine|amitriptyline|nortriptyline|vortioxetine|vilazodone)$/, "mental-health"],
  [/^(bictegravir|dolutegravir|emtricitabine|tenofovir|abacavir|lamivudine|raltegravir|darunavir|rilpivirine|efavirenz|cabotegravir)/, "hiv-sti"],
  [/^(ethinyl estradiol|norethindrone|levonorgestrel|drospirenone|etonogestrel|medroxyprogesterone|norgestimate|desogestrel)/, "sexual-reproductive-health"],
];
function sensitivityForMed(ingredient?: string): Sensitivity[] {
  if (!ingredient) return [];
  for (const [re, s] of MED_SENS) if (re.test(ingredient)) return [s];
  return [];
}

// ───────────────────────────── medications ─────────────────────────────

type MedStatus = MedicationRow["status"];

function mapMedStatus(s: unknown): MedStatus | undefined {
  switch (s) {
    case "continue":
    case "new":
    case "changed":
      return "active";
    case "held":
      return "held";
    case "stopped":
      return "stopped";
    case "not_reconciled":
      return "unknown";
    default:
      return undefined;
  }
}

function normText(s: unknown): string {
  return typeof s === "string" ? s.toLowerCase().replace(/\s+/g, " ").trim() : "";
}

/** Line identity across documents: rxnorm ingredient + dose text (drug name when no rxnorm). */
function lineKey(m: Record<string, any>): string {
  const rx = str(m.rxnorm_ingredient);
  return `${rx ? "rx:" + rx.trim() : "nm:" + normText(m.drug_name)}|${normText(m.dose_text)}`;
}
/** Ingredient identity: one row per drug ingredient. */
function ingredientKey(m: Record<string, any>): string {
  const rx = str(m.rxnorm_ingredient);
  if (rx) return "rx:" + rx.trim();
  const g = typeof m.drug_name === "string" ? genericName(m.drug_name) : undefined;
  return "nm:" + (g ?? normText(m.drug_name));
}

function normUnit(u: string): "mg" | "mcg" | "units" | "mL" | "tablet" | undefined {
  const x = u.toLowerCase();
  if (x === "mg" || x === "milligram" || x === "milligrams") return "mg";
  if (x === "mcg" || x === "ug" || x === "µg" || x === "microgram" || x === "micrograms") return "mcg";
  if (x === "unit" || x === "units" || x === "u" || x === "iu" || x === "[iu]" || x === "unt" || x === "[iu]s") return "units";
  if (x === "ml" || x === "milliliter" || x === "milliliters") return "mL";
  if (/^(tab|tabs|tablet|tablets|cap|caps|capsule|capsules)$/.test(x)) return "tablet";
  return undefined;
}

function strengthPerTablet(drugName: string): { value: number; unit: "mg" | "mcg" } | undefined {
  // Only single-strength products ("500 mg tablet"); combos ("5-325 mg") are not usable.
  const all = drugName.match(/\d[\d,.]*\s*(mg|mcg)\b/gi) ?? [];
  if (all.length !== 1) return undefined;
  if (/\d\s*[-\/]\s*\d/.test(drugName)) return undefined;
  const m = /(\d[\d,]*(?:\.\d+)?)\s*(mg|mcg)\b/i.exec(drugName);
  if (!m) return undefined;
  if (!/(tab|cap)/i.test(drugName)) return undefined;
  const v = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(v)) return undefined;
  return { value: v, unit: m[2].toLowerCase() as "mg" | "mcg" };
}

function parseDose(doseText: unknown, drugName: string): MedicationRow["dose"] | undefined {
  if (typeof doseText !== "string") return undefined;
  const t = doseText.trim().replace(/(\d),(\d{3})/g, "$1$2");
  const m = /^(\d+(?:\.\d+)?|\.\d+)\s*([a-zA-Zµ\[\]]+)\.?$/.exec(t);
  if (!m) return undefined;
  const value = Number(m[1]);
  const unit = normUnit(m[2]);
  if (!Number.isFinite(value) || !unit) return undefined;
  if (unit === "tablet") {
    const st = strengthPerTablet(drugName);
    if (st) return { value: Math.round(value * st.value * 1000) / 1000, unit: st.unit };
  }
  return { value, unit };
}

function parseFrequency(sig: unknown): MedicationRow["frequency"] | undefined {
  if (typeof sig !== "string" || sig.trim() === "") return undefined;
  const s = sig.toLowerCase();
  if (/\bprn\b|as needed|as-needed|when needed/.test(s)) return "PRN";
  if (/\bqid\b|four times|4 times|\bq\s?\d+\s?h\b|every \d+ hours|\bq\d+hr?\b/.test(s)) return "other";
  if (/\btid\b|three times|3 times a day|3 times daily/.test(s)) return "TID";
  if (/\bbid\b|twice (a )?da(y|ily)|two times|2 times a day|2 times daily|\bq12h\b|every 12 hours/.test(s)) return "BID";
  if (/\bqhs\b|at bedtime|\bnightly\b|every night|\bhs\b/.test(s)) return "QHS";
  if (/\bqw(k|eek)?\b|once (a |per |every )?week|\bweekly\b|every week/.test(s)) return "QW";
  if (/\bevery other day|\bqod\b|monthly|every \d+ (days|weeks)/.test(s)) return "other";
  if (/\bdaily\b|\bqd\b|once a day|once daily|every day|\bqam\b|every morning|in the morning|\bq24h\b|every evening|\bqpm\b/.test(s)) return "QD";
  return undefined;
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] | undefined {
  if (!text) return undefined;
  const t = text.toLowerCase();
  if (/adverse|side effect|reaction|intoleran|allerg|associated|induced|toxicity|caused/.test(t) || SERIOUS_RE.test(t) || HYPERSENS_RE.test(t)) {
    return "adverse_reaction";
  }
  if (/ineffective|not effective|not working|inadequate (response|control)|lack of efficacy|failed/.test(t)) return "ineffective";
  if (/replaced|switch|changed to|in place of|instead|substitut/.test(t)) return "therapy_changed";
  if (/course (complete|completed|finished)|completed (the )?course|finished (the )?course/.test(t)) return "course_complete";
  if (/patient (declined|refused|preference|request|chose|choice|wishes)|per patient/.test(t)) return "patient_choice";
  return undefined;
}

function buildMedications(docs: Doc[], drugCausedIngredients: Set<string>): MedicationRow[] {
  const medDocs = docs.filter((d) => d.entries.some(([, e]) => e.type === "home_med"));
  if (medDocs.length === 0) return [];
  // The latest snapshot: latest encounter, its latest discharge summary if any, else its latest document.
  const snap = medDocs[medDocs.length - 1];
  const snapIdx = medDocs.indexOf(snap);

  // Per document: line key -> [entry id, entry]
  const docLines = medDocs.map((d) => {
    const m = new Map<string, [string, Record<string, any>]>();
    for (const [k, e] of d.entries) {
      if (e.type !== "home_med" || typeof e.drug_name !== "string") continue;
      if (!m.has(lineKey(e))) m.set(lineKey(e), [k, e]);
    }
    return m;
  });

  // Group the snapshot's lines by ingredient; prefer the line whose status reflects current intent.
  const rank: Record<MedStatus, number> = { active: 3, held: 2, unknown: 1, stopped: 0 };
  const byIng = new Map<string, [string, Record<string, any>, MedStatus]>();
  for (const [k, e] of snap.entries) {
    if (e.type !== "home_med" || typeof e.drug_name !== "string") continue;
    const st = mapMedStatus(e.status);
    if (!st) continue;
    const ik = ingredientKey(e);
    const prev = byIng.get(ik);
    if (!prev || rank[st] > rank[prev[2]]) byIng.set(ik, [k, e, st]);
  }

  const rows: MedicationRow[] = [];
  for (const [, [entryId, e, status]] of byIng) {
    const lk = lineKey(e);
    const evidence: Evidence = [];
    pushEv(evidence, snap.item.id, entryId);

    // Walk back through earlier snapshots while the same line had the same status.
    let runStart = snapIdx;
    for (let i = snapIdx - 1; i >= 0; i--) {
      const l = docLines[i].get(lk);
      if (!l || mapMedStatus(l[1].status) !== status) break;
      runStart = i;
    }
    const before = runStart > 0 ? docLines[runStart - 1].get(lk) : undefined;
    const startLine = docLines[runStart].get(lk);
    let since: string | undefined;
    if (status === "held" || status === "stopped") {
      since = medDocs[runStart].decisionDate;
    } else if (status === "active") {
      const startStatus = startLine?.[1].status;
      const prevStatus = before ? mapMedStatus(before[1].status) : undefined;
      if (startStatus === "new" || startStatus === "changed" || prevStatus === "held" || prevStatus === "stopped") {
        since = medDocs[runStart].decisionDate;
      }
    }
    // Free-text reason for a hold/stop: the latest instruction within the run.
    let reasonText: string | undefined;
    if (status === "held" || status === "stopped") {
      for (let i = snapIdx; i >= runStart; i--) {
        const l = docLines[i].get(lk);
        const ins = l ? str(l[1].instructions) : undefined;
        if (ins) {
          reasonText = ins.trim();
          if (i !== snapIdx) pushEv(evidence, medDocs[i].item.id, l![0]);
          break;
        }
      }
    }
    if (runStart !== snapIdx && since) {
      const l = docLines[runStart].get(lk);
      if (l) pushEv(evidence, medDocs[runStart].item.id, l[0]);
    }

    const drugName: string = e.drug_name;
    const ingredient = genericName(drugName);
    const row: MedicationRow = {
      drug_name: drugName,
      status,
      patient_reported: false,
      evidence,
    };
    if (ingredient) row.ingredient = ingredient;
    const rx = str(e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx.trim();
    if (since) row.status_since = since;
    const dose = parseDose(e.dose_text, drugName);
    if (dose) row.dose = dose;
    const freq = parseFrequency(e.sig);
    if (freq) row.frequency = freq;
    if (status === "stopped") {
      let sr = stopReason(reasonText);
      if (!sr && ((rx && drugCausedIngredients.has("rx:" + rx.trim())) || (ingredient && drugCausedIngredients.has("nm:" + ingredient)))) {
        sr = "adverse_reaction";
      }
      if (sr) row.stop_reason = sr;
    }
    if (reasonText) row.status_reason_text = reasonText;
    const sens = sensitivityForMed(ingredient);
    if (sens.length) row.sensitivity = sens;
    rows.push(row);
  }
  return rows;
}

// ───────────────────────────── problems ─────────────────────────────

interface CondEntry {
  doc: Doc;
  entryId: string;
  e: Record<string, any>;
  isDx: boolean;
  text: string;
  icd?: string;
}

function normLabel(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isCkd(text: string, icd?: string): boolean {
  if (icd && /^N18/i.test(icd)) return true;
  return /chronic kidney disease|\bckd\b/i.test(text);
}

function ckdStageOf(text: string, icd?: string): ProblemRow["ckd_stage"] | undefined {
  const m = /\b(?:stage|g)\s*(1|2|3a|3b|4|5)\b/i.exec(text);
  if (m) return ("G" + m[1].toLowerCase()) as ProblemRow["ckd_stage"];
  if (icd) {
    const c = icd.toUpperCase();
    const map: Record<string, ProblemRow["ckd_stage"]> = {
      "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
    };
    if (map[c]) return map[c];
  }
  if (/\b(esrd|end[\s-]stage renal|end[\s-]stage kidney)\b/i.test(text)) return "G5";
  return undefined;
}
function albuminuriaOf(text: string): ProblemRow["albuminuria"] | undefined {
  const m = /\bA([123])\b/.exec(text);
  return m ? (("A" + m[1]) as ProblemRow["albuminuria"]) : undefined;
}

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};
function parseOnsetText(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  let m = /^(\d{1,2})\/(\d{4})$/.exec(t);
  if (m && Number(m[1]) >= 1 && Number(m[1]) <= 12) return `${m[2]}-${m[1].padStart(2, "0")}`;
  m = /^([A-Za-z]{3,9})\.?\s+(\d{4})$/.exec(t);
  if (m) {
    const mo = MONTHS[m[1].slice(0, 3).toLowerCase()];
    if (mo) return `${m[2]}-${mo}`;
  }
  m = /^(\d{4})-(\d{2})-(\d{2})T/.exec(t);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return undefined;
}

function isAdverseTCode(icd?: string): boolean {
  if (!icd) return false;
  return /^T(3[6-9]|4[0-9]|50)\.[0-9A-Z]{2}5/i.test(icd) || /^T88\.7/i.test(icd);
}

interface Groups {
  /** group key -> entries in chronological order */
  groups: Map<string, CondEntry[]>;
}

function groupConditions(docs: Doc[]): Groups {
  const all: CondEntry[] = [];
  for (const d of docs) {
    for (const [k, e] of d.entries) {
      if (e.type === "diagnosis" && typeof e.label === "string") {
        all.push({ doc: d, entryId: k, e, isDx: true, text: e.label, icd: str(e.icd10cm)?.trim() });
      } else if (e.type === "history" && typeof e.condition === "string") {
        all.push({ doc: d, entryId: k, e, isDx: false, text: e.condition, icd: str(e.icd10cm)?.trim() });
      }
    }
  }
  // icd -> riverside codes seen with it
  const icdToRdx = new Map<string, Set<string>>();
  for (const c of all) {
    const rdx = isObj(c.e.riverside_dx) ? str(c.e.riverside_dx.code) : undefined;
    if (rdx && c.icd) {
      const s = icdToRdx.get(c.icd.toUpperCase()) ?? new Set<string>();
      s.add(rdx);
      icdToRdx.set(c.icd.toUpperCase(), s);
    }
  }
  const groups = new Map<string, CondEntry[]>();
  for (const c of all) {
    let key: string;
    const rdx = isObj(c.e.riverside_dx) ? str(c.e.riverside_dx.code) : undefined;
    if (isCkd(c.text, c.icd)) key = "ckd";
    else if (rdx) key = "rdx:" + rdx;
    else if (c.icd) {
      const s = icdToRdx.get(c.icd.toUpperCase());
      key = s && s.size === 1 ? "rdx:" + [...s][0] : "icd:" + c.icd.toUpperCase();
    } else key = "lbl:" + normLabel(c.text);
    const g = groups.get(key) ?? [];
    g.push(c);
    groups.set(key, g);
  }
  return { groups };
}

/** Final asserted status of a condition group, or undefined if never confirmed / ruled out. */
function groupStatus(g: CondEntry[]): { status: "active" | "resolved"; rep: CondEntry } | undefined {
  let dxState: "active" | "resolved" | "ruled_out" | undefined;
  let dxRep: CondEntry | undefined;
  for (const c of g) {
    if (!c.isDx) continue;
    const s = c.e.status;
    if (s === "active" || s === "resolved" || s === "ruled_out") {
      dxState = s;
      dxRep = c;
    }
  }
  if (dxState === "ruled_out") return undefined;
  if (dxState && dxRep) return { status: dxState, rep: dxRep };
  const hist = g.filter((c) => !c.isDx);
  if (hist.length === 0) return undefined;
  const rep = hist[hist.length - 1];
  const resolved = /\b(history of|h\/o|resolved|remote|s\/p|status post|prior|past)\b/i.test(rep.text);
  return { status: resolved ? "resolved" : "active", rep };
}

/** A diagnosis that names only the adverse effect of a drug and no condition. */
function isPureAdverseEffect(c: CondEntry): boolean {
  if (!isAdverseTCode(c.icd)) return false;
  return /^\s*(adverse (drug )?(effect|reaction)s? (of|to|from)|drug (side effect|adverse effect))/i.test(c.text);
}

function buildProblems(docs: Doc[], groups: Groups): ProblemRow[] {
  const rows: ProblemRow[] = [];
  for (const [key, g] of groups.groups) {
    const st = groupStatus(g);
    if (!st) continue;
    const rep = st.rep;
    if (rep.isDx && isPureAdverseEffect(rep)) continue;
    const evidence: Evidence = [];
    pushEv(evidence, rep.doc.item.id, rep.entryId);
    for (let i = g.length - 1; i >= 0; i--) {
      const c = g[i];
      if (c.isDx && c.e.status !== "active" && c.e.status !== "resolved") continue;
      pushEv(evidence, c.doc.item.id, c.entryId);
    }
    const row: ProblemRow = { condition: rep.text.trim(), status: st.status, evidence };
    // Latest ICD code: from the representative entry, else the latest entry that has one.
    let icd = rep.icd;
    if (!icd) {
      const pool = rep.isDx ? g.filter((c) => c.isDx) : g;
      for (let i = pool.length - 1; i >= 0; i--) if (pool[i].icd) { icd = pool[i].icd; break; }
    }
    if (icd) row.icd10cm = icd;
    // Onset: only as written in a history line.
    for (let i = g.length - 1; i >= 0; i--) {
      if (g[i].isDx) continue;
      const o = parseOnsetText(g[i].e.onset_text);
      if (o) {
        row.onset = { value: o, precision: precisionOf(o) };
        pushEv(evidence, g[i].doc.item.id, g[i].entryId);
        break;
      }
    }
    if (key === "ckd") {
      // Most recently recorded stage: diagnoses first (history lines are not re-verified).
      const ordered = [...g.filter((c) => !c.isDx), ...g.filter((c) => c.isDx && c.e.status !== "ruled_out" && c.e.status !== "working")];
      for (let i = ordered.length - 1; i >= 0; i--) {
        const s = ckdStageOf(ordered[i].text, ordered[i].icd);
        if (s) { row.ckd_stage = s; break; }
      }
      for (let i = ordered.length - 1; i >= 0; i--) {
        const a = albuminuriaOf(ordered[i].text);
        if (a) { row.albuminuria = a; break; }
      }
    }
    const sens = [...new Set([...sensitivityForCode(icd), ...sensitivityForText(rep.text)])];
    if (sens.length) row.sensitivity = sens;
    rows.push(row);
  }
  return rows;
}

// ───────────────────────────── allergies ─────────────────────────────

type ReactionType = AllergyIntoleranceRow["reaction_type"];

const HYPERSENS_RE = /hives|urticaria|rash|angioedema|anaphyla|swelling|bronchospasm|wheez|itch|prurit|stevens|sjs|toxic epidermal|\bten\b|dress|throat|lip swelling|tongue|blister|exanthem|eruption|hypersensitiv|flushing|shortness of breath|dyspnea/i;
const SERIOUS_RE = /ketoacidosis|\bdka\b|lactic acidosis|hyperkalemia|kidney injury|\baki\b|renal failure|pancreatitis|agranulocytosis|neutropenia|thrombocytopenia|hepatotox|liver injury|hepatitis|rhabdo|bleed|hemorrhag|hypoglyc|qt prolong|arrhythm|seizure|serotonin syndrome|neuroleptic malignant|aplastic|hyponatremia|torsade/i;
const SIDE_RE = /cough|gi upset|stomach|nausea|vomit|diarrh|constipat|myalgia|muscle (ache|pain)|dizz|headache|fatigue|drows|somnolen|insomnia|edema|ankle swelling|dyspepsia|heartburn|bloating|gas|taste|dry mouth|yeast|urinary|frequency|tremor|palpitation|sweat|weight gain|cramp|jitter|upset/i;

function classifyReaction(text: string | undefined, severity: string | undefined): ReactionType {
  const t = text ?? "";
  if (SERIOUS_RE.test(t)) return "serious_adverse_event";
  if (/ankle swelling|leg swelling|peripheral edema/i.test(t)) return "side_effect";
  if (HYPERSENS_RE.test(t)) return "hypersensitivity";
  if (SIDE_RE.test(t)) return "side_effect";
  if (severity === "mild") return "side_effect";
  return "hypersensitivity";
}

function isAceInhibitor(sub: string): boolean {
  return /pril$/.test(sub) || /ace[\s-]?inhibitor/i.test(sub);
}

function mechanismFor(sub: string, type: ReactionType, reaction: string | undefined): AllergyIntoleranceRow["mechanism"] {
  const r = reaction ?? "";
  if (isAceInhibitor(sub) && /cough|angioedema|swelling/i.test(r)) return "non_immune";
  if (type === "serious_adverse_event" && /ketoacidosis|\bdka\b|lactic acidosis|hyperkalemia|hypoglyc/i.test(r)) return "non_immune";
  if (type === "side_effect" && /cough/i.test(r) && isAceInhibitor(sub)) return "non_immune";
  return "unknown";
}

function substanceName(s: string, hasRx: boolean): string {
  const t = s.trim();
  if (hasRx) return genericName(t) ?? t.toLowerCase();
  const g = BRANDS[t.toLowerCase()];
  if (g) return g;
  return t;
}

interface DrugCause {
  substance: string;
  rx?: string;
}

/** Drug the diagnosis attributes the condition to, if any. */
function drugCauseOf(c: CondEntry, homeMeds: Record<string, any>[]): DrugCause | undefined {
  const texts = [c.text];
  if (isObj(c.e.riverside_dx) && typeof c.e.riverside_dx.name === "string") texts.push(c.e.riverside_dx.name);
  const joined = texts.join(" | ");
  const attributive = /associated|induced|related|due to|secondary to|caused by|adverse (drug )?(effect|reaction)|toxicity|from\s/i.test(joined);
  const tcode = isAdverseTCode(c.icd);
  if (!attributive && !tcode) return undefined;
  const lower = joined.toLowerCase();
  // 1. A specific drug named: a home medication of this item, or a known brand.
  for (const m of homeMeds) {
    const g = typeof m.drug_name === "string" ? genericName(m.drug_name) : undefined;
    if (g && g.length > 3 && lower.includes(g)) return { substance: g, rx: str(m.rxnorm_ingredient)?.trim() };
  }
  for (const [b, g] of Object.entries(BRANDS)) {
    if (new RegExp(`\\b${b}\\b`).test(lower) || new RegExp(`\\b${g.replace(/[/]/g, "\\/")}\\b`).test(lower)) return { substance: g };
  }
  // 2. A drug class: the one drug of that class on this item's medication list, else the class as written.
  for (const cls of DRUG_CLASSES) {
    const m = cls.re.exec(joined);
    if (!m) continue;
    const members: Record<string, any>[] = [];
    const seen = new Set<string>();
    for (const hm of homeMeds) {
      const g = typeof hm.drug_name === "string" ? genericName(hm.drug_name) : undefined;
      if (g && cls.member(g) && !seen.has(g)) { seen.add(g); members.push(hm); }
    }
    if (members.length === 1) {
      const g = genericName(members[0].drug_name)!;
      return { substance: g, rx: str(members[0].rxnorm_ingredient)?.trim() };
    }
    // Class as written in the label, without a trailing "-associated" etc.
    let cw = m[0].trim();
    if (/^sglt-?2$/i.test(cw)) cw = cw + " inhibitor";
    return { substance: cw };
  }
  // 3. T-code "adverse effect of X" with X unrecognized: X as written.
  if (tcode) {
    const m = /adverse (?:drug )?(?:effect|reaction)s? (?:of|to|from)\s+(.+?)\s*$/i.exec(c.text);
    if (m && m[1]) return { substance: m[1].replace(/[.,;]+$/, "").trim() };
  }
  return undefined;
}

function buildAllergies(docs: Doc[], groups: Groups): { rows: AllergyIntoleranceRow[]; drugCaused: Set<string> } {
  const rows: AllergyIntoleranceRow[] = [];
  const drugCaused = new Set<string>();
  const index = new Map<string, AllergyIntoleranceRow>();
  const keyOf = (sub: string, rx?: string) => (rx ? "rx:" + rx : "nm:" + sub.toLowerCase());

  const add = (row: AllergyIntoleranceRow) => {
    const k1 = keyOf(row.substance, row.rxnorm_ingredient);
    const k2 = "nm:" + row.substance.toLowerCase();
    const prev = index.get(k1) ?? index.get(k2);
    if (!prev) {
      rows.push(row);
      index.set(k1, row);
      index.set(k2, row);
      return;
    }
    // Merge: same substance from the allergy list and from a drug-caused diagnosis.
    const order: ReactionType[] = ["side_effect", "hypersensitivity", "serious_adverse_event"];
    if (order.indexOf(row.reaction_type) > order.indexOf(prev.reaction_type)) {
      prev.reaction_type = row.reaction_type;
      prev.mechanism = row.mechanism;
    }
    if (row.reaction) {
      const parts = prev.reaction ? prev.reaction.split("; ") : [];
      if (!parts.includes(row.reaction)) parts.push(row.reaction);
      prev.reaction = parts.join("; ");
    }
    if (row.criticality === "high" || (prev.criticality === "unknown" && row.criticality === "low")) prev.criticality = row.criticality;
    if (!prev.rxnorm_ingredient && row.rxnorm_ingredient) prev.rxnorm_ingredient = row.rxnorm_ingredient;
    if (!prev.onset && row.onset) prev.onset = row.onset;
    for (const e of row.evidence) pushEv(prev.evidence, e.item_id, e.entry_id);
  };

  // 1. The allergy list: the latest document that carries one.
  let listDoc: Doc | undefined;
  for (const d of docs) {
    if (d.entries.some(([, e]) => e.type === "allergy")) {
      if (!listDoc || cmpNum(d.recorded, listDoc.recorded) >= 0) listDoc = d;
    }
  }
  if (listDoc) {
    for (const [k, e] of listDoc.entries) {
      if (e.type !== "allergy" || typeof e.substance !== "string") continue;
      const raw = e.substance.trim();
      if (raw === "" || /^(nkda|nka|nkma|no known (drug )?allergies)$/i.test(raw)) continue;
      const rx = str(e.rxnorm_ingredient)?.trim();
      const substance = substanceName(raw, !!rx);
      const reaction = str(e.reaction)?.trim();
      const severity = str(e.severity);
      const type = classifyReaction(reaction, severity);
      let criticality: AllergyIntoleranceRow["criticality"] =
        severity === "mild" ? "low" : severity === "severe" ? "high" : "unknown";
      if (reaction && /anaphyla|angioedema|stevens|toxic epidermal|throat/i.test(reaction)) criticality = "high";
      const row: AllergyIntoleranceRow = {
        substance,
        reaction_type: type,
        mechanism: mechanismFor(substance, type, reaction),
        criticality,
        evidence: [{ item_id: listDoc.item.id, entry_id: k }],
      };
      if (rx) row.rxnorm_ingredient = rx;
      if (reaction) row.reaction = reaction;
      add(row);
    }
  }

  // 2. Diagnoses the source attributes to a drug.
  for (const [, g] of groups.groups) {
    const st = groupStatus(g);
    if (!st) continue;
    // Earliest local date the condition appears in a current document.
    let onset: string | undefined;
    for (const c of g) {
      const d = localDate(c.doc.item.effective);
      if (d && d.length === 10 && (!onset || d < onset)) onset = d;
    }
    const seenSubs = new Set<string>();
    for (let i = g.length - 1; i >= 0; i--) {
      const c = g[i];
      if (!c.isDx || (c.e.status !== "active" && c.e.status !== "resolved")) continue;
      const homeMeds = c.doc.entries.filter(([, e]) => e.type === "home_med").map(([, e]) => e);
      const cause = drugCauseOf(c, homeMeds);
      if (!cause) continue;
      const sk = cause.substance.toLowerCase();
      if (seenSubs.has(sk)) {
        const r = index.get(keyOf(cause.substance, cause.rx)) ?? index.get("nm:" + sk);
        if (r) pushEv(r.evidence, c.doc.item.id, c.entryId);
        continue;
      }
      seenSubs.add(sk);
      const reactionText = c.text.trim();
      const pure = isPureAdverseEffect(c);
      const named = SERIOUS_RE.test(reactionText) || HYPERSENS_RE.test(reactionText) || SIDE_RE.test(reactionText);
      // A condition the hospital diagnosed and attributed to a drug is serious unless it names a
      // milder reaction; a bare "adverse effect of X" entry says nothing about the harm.
      let type: ReactionType = named ? classifyReaction(reactionText, undefined) : pure ? "side_effect" : "serious_adverse_event";
      const criticality: AllergyIntoleranceRow["criticality"] =
        (type === "serious_adverse_event" && !pure) || /anaphyla|angioedema/i.test(reactionText) ? "high" : "unknown";
      let mechanism = mechanismFor(cause.substance, type, reactionText);
      if (/angioedema|cough/i.test(reactionText) && /ace[\s-]?inhibitor|pril\b/i.test(reactionText + " " + cause.substance)) mechanism = "non_immune";
      const row: AllergyIntoleranceRow = {
        substance: cause.substance,
        reaction_type: type,
        mechanism,
        reaction: reactionText,
        criticality,
        evidence: [{ item_id: c.doc.item.id, entry_id: c.entryId }],
      };
      if (cause.rx) row.rxnorm_ingredient = cause.rx;
      if (onset) row.onset = { value: onset, precision: "day" };
      add(row);
      if (cause.rx) drugCaused.add("rx:" + cause.rx);
      drugCaused.add("nm:" + sk);
    }
  }
  return { rows, drugCaused };
}

// ───────────────────────────── labs ─────────────────────────────

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "98980-6": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr",
  "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr", "50044-7": "egfr", "50210-4": "egfr", "69405-9": "egfr",
  "2823-3": "potassium", "6298-4": "potassium",
  "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "14627-4": "bicarbonate",
  "33037-3": "anion_gap", "41276-7": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "41995-2": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "33256-9": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin",
  "53060-9": "bhb", "48633-2": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2753-2": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2",
  "3040-3": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "49563-0": "troponin",
  "2093-3": "cholesterol",
  "2571-8": "triglycerides",
  "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};
const LOCAL_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", HCO3: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", PH: "ph", VPH: "ph", APH: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2", LIPASE: "lipase",
  TROPI: "troponin", TNI: "troponin", HSTNI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides",
  HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

function analyteByName(name: string): Analyte | undefined {
  const n = name.toLowerCase();
  if (/ratio|clearance|urine|24 ?h/.test(n) && !/albumin\/creatinine|albumin-creatinine|albumin creatinine|uacr|acr/.test(n)) {
    return undefined;
  }
  if (/albumin.{0,3}creatinine|uacr|\bacr\b/.test(n)) return "uacr";
  if (/egfr|glomerular filtration/.test(n)) return "egfr";
  if (/creatinine/.test(n)) return "creatinine";
  if (/potassium/.test(n)) return "potassium";
  if (/sodium/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/bicarbonate|total co2|\bco2\b(?!.*partial)/.test(n) && !/pco2/.test(n)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/a1c|glycated h|glycohemoglobin/.test(n)) return "a1c";
  if (/glucose/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(n)) return "wbc";
  if (/hemoglobin|\bhgb\b/.test(n)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b/.test(n)) return "bhb";
  if (/\bpco2\b/.test(n)) return "pco2";
  if (/\bph\b/.test(n)) return "ph";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n)) return /troponin\s*t\b|tnt/.test(n) ? undefined : "troponin";
  if (/hdl/.test(n)) return "hdl";
  if (/ldl/.test(n)) return "ldl";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n)) return "cholesterol";
  return undefined;
}

function analyteOf(test: Record<string, any>): Analyte | undefined {
  const name = str(test.name) ?? "";
  // Name contradictions that LOINC/local codes might hide.
  if (/troponin\s*t\b/i.test(name)) return undefined;
  const loinc = str(test.loinc)?.trim();
  if (loinc && LOINC_ANALYTE[loinc]) return LOINC_ANALYTE[loinc];
  const lc = str(test.local_code)?.trim().toUpperCase();
  if (lc && LOCAL_ANALYTE[lc]) {
    const byName = name ? analyteByName(name) : undefined;
    if (name && byName && byName !== LOCAL_ANALYTE[lc]) return byName;
    return LOCAL_ANALYTE[lc];
  }
  return name ? analyteByName(name) : undefined;
}

const UNIT_OF: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

/** Factor converting a value in `unit` to the analyte's unit, or undefined if not convertible. */
function unitFactor(a: Analyte, unit: string | undefined): number | undefined {
  const u = (unit ?? "").trim().replace(/\s+/g, "").toLowerCase();
  const target = UNIT_OF[a].toLowerCase();
  if (a === "ph") return u === "" || u === "[ph]" || u === "ph" ? 1 : undefined;
  if (u === target) return 1;
  switch (a) {
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      return u === "meq/l" || u === "mmol/l" ? 1 : undefined;
    case "bhb":
      return u === "mmol/l" ? 1 : undefined;
    case "creatinine":
      if (u === "umol/l" || u === "µmol/l") return 1 / 88.42;
      return undefined;
    case "egfr":
      return /^ml\/min(\/1\.73m2|\/1\.73m\^2|\/\{1\.73_m2\}|\/1\.73)$/.test(u) ? 1 : undefined;
    case "glucose":
      if (u === "mmol/l") return 18.016;
      return undefined;
    case "bun":
      return undefined;
    case "a1c":
      return u === "%" || u === "%hb" || u === "%{hb}" ? 1 : undefined;
    case "uacr":
      if (u === "mg/g" || u === "mg/g{creat}" || u === "ug/mg" || u === "mcg/mg") return 1;
      if (u === "mg/mmol" || u === "mg/mmol{creat}") return 8.84;
      return undefined;
    case "platelets": case "wbc":
      return /^(10\*3\/ul|10\^3\/ul|k\/ul|x10e3\/ul|10\*9\/l|10\^9\/l|x10\^9\/l|thou\/ul|10e3\/ul)$/.test(u) ? 1 : undefined;
    case "hemoglobin":
      if (u === "g/dl") return 1;
      if (u === "g/l") return 0.1;
      return undefined;
    case "pco2":
      return u === "mmhg" || u === "mm[hg]" ? 1 : undefined;
    case "lipase":
      return u === "u/l" || u === "iu/l" ? 1 : undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return 1;
      if (u === "ng/l" || u === "pg/ml") return 0.001;
      return undefined;
    case "cholesterol": case "hdl": case "ldl":
      if (u === "mmol/l") return 38.67;
      return undefined;
    case "triglycerides":
      if (u === "mmol/l") return 88.57;
      return undefined;
  }
  return undefined;
}

function parseLabValue(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return { value: v };
  if (typeof v !== "string") return undefined;
  const m = /^\s*(<=|>=|≤|≥|<|>)?\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*$/.exec(v);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return undefined;
  const c = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as LabResultRow["comparator"] | undefined);
  return c ? { value, comparator: c } : { value };
}

function egfrEquation(test: Record<string, any>, collected: string): LabResultRow["egfr_equation"] {
  const name = (str(test.name) ?? "").toLowerCase();
  if (/2021|race[\s-]?free|without race/.test(name)) return "ckd-epi-2021";
  if (/mdrd/.test(name)) return "mdrd";
  if (/2009/.test(name)) return "ckd-epi-2009";
  const loinc = str(test.loinc)?.trim();
  if (loinc === "98979-8" || loinc === "98980-6") return "ckd-epi-2021";
  if (loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  if (loinc === "33914-3" || loinc === "48642-3" || loinc === "48643-1" || loinc === "50044-7" || loinc === "50210-4") return "mdrd";
  // Riverside: eGFR is CKD-EPI 2021 (race-free) for all results since 2023.
  const d = localDate(collected);
  if (d && d >= "2023-01-01") return "ckd-epi-2021";
  return "unknown";
}

function isRaceVariant(test: Record<string, any>): boolean {
  const name = (str(test.name) ?? "").toLowerCase();
  const loinc = str(test.loinc)?.trim();
  if (loinc === "48643-1" || loinc === "88293-6") return true;
  if (/non[\s-]?(african|black|aa\b)/.test(name)) return false;
  return /african|black|\baa\b/.test(name);
}

const STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

interface LabCopy {
  doc: Doc;
  entryId: string;
  rv: Record<string, any>;
  collected: string;
  specimen: string;
  status: string;
  analyte: Analyte;
}

function buildLabs(docs: Doc[]): LabResultRow[] {
  const byKey = new Map<string, LabCopy[]>();
  const order: string[] = [];
  const addCopy = (key: string, c: LabCopy) => {
    let l = byKey.get(key);
    if (!l) { l = []; byKey.set(key, l); order.push(key); }
    l.push(c);
  };
  for (const d of docs) {
    for (const [k, e] of d.entries) {
      if (e.type === "result") {
        if (!isObj(e.test)) continue;
        const a = analyteOf(e.test);
        if (!a) continue;
        const acc = str(e.accession) ?? `${d.item.id}/${k}`;
        const code = str(e.test.local_code) ?? str(e.test.loinc) ?? str(e.test.name) ?? "";
        addCopy(`${acc}\u0000${code}`, {
          doc: d, entryId: k, rv: e, collected: str(e.collected) ?? "", specimen: str(e.specimen) ?? "",
          status: str(e.status) ?? "", analyte: a,
        });
      } else if (e.type === "panel") {
        if (!Array.isArray(e.components)) continue;
        const acc = str(e.accession) ?? `${d.item.id}/${k}`;
        const seen = new Map<string, number>();
        for (const comp of e.components) {
          if (!isObj(comp) || !isObj(comp.test)) continue;
          const a = analyteOf(comp.test);
          if (!a) continue;
          const code = str(comp.test.local_code) ?? str(comp.test.loinc) ?? str(comp.test.name) ?? "";
          const n = (seen.get(code) ?? 0) + 1;
          seen.set(code, n);
          addCopy(`${acc}\u0000${code}\u0000${n}`, {
            doc: d, entryId: k, rv: comp, collected: str(e.collected) ?? "", specimen: str(e.specimen) ?? "",
            status: str(e.status) ?? "", analyte: a,
          });
        }
      }
    }
  }
  // Results that were not part of a panel and panel components share the accession + test code identity.
  // Merge "acc|code" (result) with "acc|code|1" (first panel component).
  const merged = new Map<string, LabCopy[]>();
  const mergedOrder: string[] = [];
  for (const key of order) {
    const parts = key.split("\u0000");
    const base = parts.length === 3 && parts[2] === "1" ? `${parts[0]}\u0000${parts[1]}` : key;
    let l = merged.get(base);
    if (!l) { l = []; merged.set(base, l); mergedOrder.push(base); }
    l.push(...byKey.get(key)!);
  }

  const rows: LabResultRow[] = [];
  for (const key of mergedOrder) {
    const copies = merged.get(key)!;
    let best: LabCopy | undefined;
    for (const c of copies) {
      const r = STATUS_RANK[c.status] ?? 0;
      if (r === 0) continue;
      if (!best) { best = c; continue; }
      const br = STATUS_RANK[best.status] ?? 0;
      if (r > br || (r === br && cmpNum(c.doc.recorded, best.doc.recorded) >= 0)) best = c;
    }
    if (!best) continue;
    const a = best.analyte;
    const test = best.rv.test as Record<string, any>;
    const spec = best.specimen.toLowerCase();
    if (a === "creatinine" && /urine/.test(spec)) continue;
    if (a === "glucose" && /urine|capillary|finger|poc|meter|csf/.test(spec + " " + (str(test.name) ?? "").toLowerCase())) continue;
    if (a === "egfr" && isRaceVariant(test)) continue;
    const pv = parseLabValue(best.rv.value);
    if (!pv) continue;
    const f = unitFactor(a, str(best.rv.unit));
    if (f === undefined) continue;
    if (!Number.isFinite(ms(best.collected))) continue;
    let value = pv.value * f;
    if (f !== 1) value = Math.round(value * 100) / 100;
    if (a === "glucose" && f !== 1) value = Math.round(value);
    const evidence: Evidence = [];
    pushEv(evidence, best.doc.item.id, best.entryId);
    for (const c of copies) pushEv(evidence, c.doc.item.id, c.entryId);
    const row: LabResultRow = {
      analyte: a,
      value,
      unit: UNIT_OF[a],
      collected: best.collected,
      status: best.status === "preliminary" ? "preliminary" : "final",
      evidence,
    };
    if (pv.comparator) row.comparator = pv.comparator;
    if (a === "egfr") row.egfr_equation = egfrEquation(test, best.collected);
    const loinc = str(test.loinc)?.trim();
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  return rows;
}

// ───────────────────────────── vitals ─────────────────────────────

function buildVitals(docs: Doc[]): VitalRow[] {
  interface V { doc: Doc; entryId: string; e: Record<string, any>; t: number; local: string }
  const seen = new Map<string, V>();
  const dupEvidence = new Map<string, Evidence>();
  for (const d of docs) {
    for (const [k, e] of d.entries) {
      if (e.type !== "vitals") continue;
      const t = ms(e.taken);
      const local = localDateTime(e.taken);
      if (!local || !Number.isFinite(t)) continue;
      const bp = isObj(e.bp) ? e.bp : undefined;
      const sig = JSON.stringify([
        t, num(bp?.systolic_mmhg), num(bp?.diastolic_mmhg), num(e.heart_rate_bpm), num(e.weight_kg),
      ]);
      if (seen.has(sig)) {
        pushEv(dupEvidence.get(sig)!, d.item.id, k);
        continue;
      }
      seen.set(sig, { doc: d, entryId: k, e, t, local });
      dupEvidence.set(sig, [{ item_id: d.item.id, entry_id: k }]);
    }
  }
  const sets = [...seen.entries()].sort((a, b) => cmpNum(a[1].t, b[1].t));
  const rows: VitalRow[] = [];
  let last: { row: VitalRow; t: number; encId: string } | undefined;
  for (const [sig, v] of sets) {
    const bp = isObj(v.e.bp) ? v.e.bp : undefined;
    const sys = num(bp?.systolic_mmhg);
    const dia = num(bp?.diastolic_mmhg);
    const hr = num(v.e.heart_rate_bpm);
    const wt = num(v.e.weight_kg);
    const ev = dupEvidence.get(sig)!;
    // A repeat BP a few minutes after a set in the same encounter goes on that set.
    if (
      last && v.doc.encId === last.encId && v.t - last.t <= 15 * 60 * 1000 && sys !== undefined && dia !== undefined &&
      last.row.systolic_mmhg !== undefined && last.row.repeat_systolic_mmhg === undefined &&
      hr === undefined && wt === undefined
    ) {
      last.row.repeat_systolic_mmhg = sys;
      last.row.repeat_diastolic_mmhg = dia;
      for (const x of ev) pushEv(last.row.evidence, x.item_id, x.entry_id);
      continue;
    }
    if (sys === undefined && hr === undefined && wt === undefined) continue;
    const row: VitalRow = { setting: "hospital", local_time: v.local, evidence: [...ev] };
    if (sys !== undefined && dia !== undefined) {
      row.systolic_mmhg = sys;
      row.diastolic_mmhg = dia;
    }
    if (hr !== undefined) row.pulse_bpm = hr;
    if (wt !== undefined) row.weight_kg = Math.round(wt * 10) / 10;
    rows.push(row);
    last = { row, t: v.t, encId: v.doc.encId };
  }
  return rows;
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return empty;
  const docs = buildDocs(items, asOf);
  const out: ViewRows = { ...empty };
  const groups = safe(() => groupConditions(docs), { groups: new Map() } as Groups);
  out.problems = safe(() => buildProblems(docs, groups), []);
  const allergies = safe(() => buildAllergies(docs, groups), { rows: [], drugCaused: new Set<string>() });
  out.allergies = allergies.rows;
  out.medications = safe(() => buildMedications(docs, allergies.drugCaused), []);
  out.labs = safe(() => buildLabs(docs), []);
  out.vitals = safe(() => buildVitals(docs), []);
  return out;
}

function safe<T>(f: () => T, fallback: T): T {
  try {
    return f();
  } catch {
    return fallback;
  }
}
