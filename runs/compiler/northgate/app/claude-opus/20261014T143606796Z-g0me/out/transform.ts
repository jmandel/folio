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

// Northgate Family Medicine (northgate-chart-v1) -> consumer views.

const TZ = "America/Chicago";

// ───────────────────────────── time helpers ─────────────────────────────

const HAS_OFFSET = /(Z|[+-]\d{2}:?\d{2})$/i;
const DATE_ONLY = /^\d{4}(-\d{2}(-\d{2})?)?$/;

let fmtCache: Intl.DateTimeFormat | undefined;
function chicagoParts(ms: number): { date: string; time: string } | undefined {
  try {
    if (!fmtCache) {
      fmtCache = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      });
    }
    const parts: Record<string, string> = {};
    for (const p of fmtCache.formatToParts(new Date(ms))) parts[p.type] = p.value;
    const hour = parts.hour === "24" ? "00" : parts.hour;
    return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${hour}:${parts.minute}` };
  } catch {
    return undefined;
  }
}

/** Local (Chicago) date and time of a FOLIO date/date-time string. time is undefined for dates. */
function localOf(s: unknown): { date: string; time?: string } | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (DATE_ONLY.test(t)) return { date: t };
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/.exec(t);
  if (!m) return undefined;
  if (!HAS_OFFSET.test(t)) return { date: m[1], time: `${m[2]}:${m[3]}` }; // wall clock: as written
  const ms = Date.parse(t);
  if (isNaN(ms)) return undefined;
  return chicagoParts(ms);
}

/** Sort key for an item: local effective date, then recorded instant. */
function itemKey(it: FolioItem): [string, number] {
  const eff = localOf(it.effective);
  const effKey = eff ? eff.date + (eff.time ? "T" + eff.time : "") : "";
  let rec = Date.parse(it.recorded);
  if (isNaN(rec)) rec = 0;
  return [effKey, rec];
}

function cmpKey(a: [string, number], b: [string, number]): number {
  // compare dates first (date-only effective sorts by its day only), then time when both have one
  const ad = a[0].slice(0, 10), bd = b[0].slice(0, 10);
  if (ad !== bd) return ad < bd ? -1 : 1;
  if (a[0].length > 10 && b[0].length > 10 && a[0] !== b[0]) return a[0] < b[0] ? -1 : 1;
  return a[1] - b[1];
}

// ───────────────────────────── generic helpers ─────────────────────────────

function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x.trim() : undefined;
}
function num(x: unknown): number | undefined {
  if (typeof x === "number" && isFinite(x)) return x;
  if (typeof x === "string" && /^\s*-?\d+(\.\d+)?\s*$/.test(x)) return parseFloat(x);
  return undefined;
}
function round(v: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function partialFromFuzzy(f: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f !== "object") return undefined;
  const d = str(f.date);
  if (!d) return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(d);
  if (!m) return undefined;
  let precision: "year" | "month" | "day" =
    f.precision === "year" || f.precision === "month" || f.precision === "day"
      ? f.precision
      : m[3] ? "day" : m[2] ? "month" : "year";
  if (precision === "day" && !m[3]) precision = m[2] ? "month" : "year";
  if (precision === "month" && !m[2]) precision = "year";
  const value = precision === "year" ? m[1] : precision === "month" ? `${m[1]}-${m[2]}` : `${m[1]}-${m[2]}-${m[3]}`;
  return { value, precision };
}

function addSens(list: Sensitivity[], s: Sensitivity | undefined) {
  if (s && !list.includes(s)) list.push(s);
}
function restrictionSens(r: unknown): Sensitivity | undefined {
  if (r === "BH") return "mental-health";
  return undefined;
}

function icdSens(icd: string | undefined): Sensitivity | undefined {
  if (!icd) return undefined;
  const c = icd.toUpperCase();
  if (/^F1\d/.test(c)) return "substance-use";
  if (/^F\d/.test(c)) return "mental-health";
  if (/^(B2[0-4]|Z21|A5\d|A6[0-4])/.test(c)) return "hiv-sti";
  if (/^(O\d|Z3[0-6]|Z3A|Z30)/.test(c)) return "sexual-reproductive-health";
  return undefined;
}

interface Ev {
  item: FolioItem;
  entryId: string;
  entry: any;
  key: [string, number];
  idx: number;
}

function sortEvents(evs: Ev[]): Ev[] {
  return evs.slice().sort((a, b) => cmpKey(a.key, b.key) || a.idx - b.idx);
}

function evidenceOf(evs: Ev[]): Evidence {
  const out: Evidence = [];
  const seen = new Set<string>();
  for (const e of evs) {
    const k = e.item.id + "#" + e.entryId;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: e.item.id, entry_id: e.entryId });
  }
  return out;
}

// ───────────────────────────── drug names ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", victoza: "liraglutide",
  trulicity: "dulaglutide", mounjaro: "tirzepatide", byetta: "exenatide",
  januvia: "sitagliptin", tradjenta: "linagliptin", glucophage: "metformin",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan",
  norvasc: "amlodipine", lasix: "furosemide", bumex: "bumetanide", aldactone: "spironolactone",
  kerendia: "finerenone", entresto: "sacubitril", toprol: "metoprolol", lopressor: "metoprolol", coreg: "carvedilol",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine", paxil: "paroxetine",
  wellbutrin: "bupropion", effexor: "venlafaxine", cymbalta: "duloxetine", trazodone: "trazodone",
  abilify: "aripiprazole", seroquel: "quetiapine", zyprexa: "olanzapine", lamictal: "lamotrigine",
  suboxone: "buprenorphine", subutex: "buprenorphine", vivitrol: "naltrexone",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", prilosec: "omeprazole", nexium: "esomeprazole",
  protonix: "pantoprazole", zyrtec: "cetirizine", claritin: "loratadine", tylenol: "acetaminophen",
  advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", neurontin: "gabapentin", eliquis: "apixaban",
  xarelto: "rivaroxaban", coumadin: "warfarin", plavix: "clopidogrel", zetia: "ezetimibe", flomax: "tamsulosin",
};

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "mesylate", "succinate", "tartrate",
  "calcium", "magnesium", "citrate", "fumarate", "sulfate", "phosphate", "acetate", "bromide", "monohydrate",
  "dihydrate", "hyclate", "propionate", "furoate", "disodium", "dipropionate", "hydrobromide", "trihydrate",
  "anhydrous", "medoxomil", "camsylate", "bitartrate", "xinafoate",
]);

const FORM_WORDS = /\b(oral|tablet|tablets|capsule|capsules|solution|suspension|injection|injectable|pen|injector|prefilled|syringe|extended|delayed|release|er|xr|sr|dr|chewable|disintegrating|film|coated|topical|cream|ointment|patch|inhaler|metered|dose|auto-injector|cartridge|vial|kwikpen|flexpen|solostar)\b/g;

const KNOWN_GENERIC = /\b(insulin (glargine|detemir|degludec|lispro|aspart|glulisine|regular|nph|isophane)|[a-z]+(pril|sartan|statin|gliflozin|glutide|gliptin|olol|dipine|azole|prazole|tidine|cycline|micin|floxacin|oxetine|aline|pram)|metformin|furosemide|bumetanide|torsemide|hydrochlorothiazide|chlorthalidone|spironolactone|eplerenone|finerenone|tirzepatide|glipizide|glimepiride|glyburide|pioglitazone|aspirin|acetaminophen|ibuprofen|naproxen|levothyroxine|gabapentin|warfarin|apixaban|rivaroxaban|clopidogrel|ezetimibe|tamsulosin|sertraline|bupropion|trazodone|buprenorphine|naltrexone|allopurinol|colchicine|prednisone|amoxicillin|potassium chloride|sodium bicarbonate|cholecalciferol|vitamin d\d?|ergocalciferol)\b/;

/** Generic ingredient (lower case) from a drug display name, or undefined when not identifiable. */
function ingredientOf(name: string): string | undefined {
  const lower = name.toLowerCase();
  const br = /\[([^\]]+)\]/.exec(lower);
  for (const cand of [br ? br[1] : "", lower]) {
    for (const w of cand.split(/[^a-z]+/)) if (w && BRANDS[w]) return BRANDS[w];
  }
  let s = lower.replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ");
  // leading package quantity, e.g. "3 ML insulin glargine ..." or "24 HR metoprolol ..."
  s = s.replace(/^\s*\d+(\.\d+)?\s*(ml|hr|actuat|day|mg)?\s+/, "");
  const hasStrength = /\d/.test(s);
  let head = s.split(/\d/)[0];
  head = head.replace(/[\/,(]+\s*$/, "").replace(FORM_WORDS, " ").replace(/\s+/g, " ").trim();
  if (!head) return undefined;
  const words = head.split(" ");
  while (words.length > 1 && SALTS.has(words[words.length - 1])) words.pop();
  const ing = words.join(" ");
  if (hasStrength) return ing; // RxNorm-style "<ingredient> <strength> <form>"
  const k = KNOWN_GENERIC.exec(ing);
  if (k) return k[0];
  return undefined;
}

/** Known ingredient-level RxNorm CUIs (IN), used only to recognise a code the source gives as ingredient-level. */
const RXNORM_IN: Record<string, string> = {
  "29046": "lisinopril", "52175": "losartan", "6809": "metformin", "274783": "insulin glargine",
  "1545653": "empagliflozin", "1488564": "dapagliflozin", "1373458": "canagliflozin", "17767": "amlodipine",
  "4603": "furosemide", "83367": "atorvastatin", "301542": "rosuvastatin", "36567": "simvastatin",
  "5487": "hydrochlorothiazide", "2409": "chlorthalidone", "9997": "spironolactone", "1991302": "semaglutide",
  "475968": "liraglutide", "1551291": "dulaglutide", "2601723": "tirzepatide", "593411": "sitagliptin",
  "4815": "glipizide", "25789": "glimepiride", "3827": "enalapril", "35296": "ramipril", "18867": "benazepril",
  "69749": "valsartan", "321064": "olmesartan", "83818": "irbesartan", "73494": "telmisartan",
  "2551112": "finerenone", "36437": "sertraline", "42347": "bupropion", "1191": "aspirin", "161": "acetaminophen",
  "5640": "ibuprofen", "10582": "levothyroxine", "6918": "metoprolol", "20352": "carvedilol",
  "8629": "potassium chloride", "1514": "betamethasone", "723": "amoxicillin", "7646": "omeprazole",
  "86009": "insulin detemir", "1670007": "insulin degludec", "86002": "insulin lispro", "51428": "insulin aspart",
  "1819": "buprenorphine", "7243": "naltrexone", "10689": "tramadol", "25480": "gabapentin",
  "4441": "fenofibrate", "341248": "ezetimibe", "1364430": "apixaban", "1114195": "rivaroxaban", "11289": "warfarin",
};

const DRUG_CLASSES: { re: RegExp; member: RegExp }[] = [
  { re: /sglt-?2/i, member: /gliflozin$/ },
  { re: /\bace[- ]?i\b|ace inhibitor|angiotensin[- ]converting/i, member: /pril$/ },
  { re: /\barb\b|angiotensin (ii )?receptor/i, member: /sartan$/ },
  { re: /statin/i, member: /statin$/ },
  { re: /glp-?1/i, member: /(glutide|tide|exenatide)$/ },
  { re: /dpp-?4/i, member: /gliptin$/ },
  { re: /sulfonylurea/i, member: /^(glipizide|glimepiride|glyburide)$/ },
  { re: /thiazide/i, member: /(thiazide|chlorthalidone|indapamide)$/ },
  { re: /loop diuretic/i, member: /^(furosemide|bumetanide|torsemide)$/ },
  { re: /beta[- ]?blocker/i, member: /olol$/ },
  { re: /nsaid/i, member: /^(ibuprofen|naproxen|meloxicam|diclofenac|celecoxib)$/ },
];

function hospitalOnly(name: string, sig: string | undefined): boolean {
  const t = (name + " " + (sig ?? "")).toLowerCase();
  return /\b(intravenous|infusion|iv piggyback|ivpb|iv bolus|iv push|\biv\b|drip)\b/.test(t);
}

function normUnit(u: unknown): "mg" | "mcg" | "units" | "mL" | "tablet" | "g" | undefined {
  const s = typeof u === "string" ? u.trim().toLowerCase() : "";
  if (/^(mg|milligrams?)$/.test(s)) return "mg";
  if (/^(mcg|ug|µg|micrograms?)$/.test(s)) return "mcg";
  if (/^(units?|unt|u|iu|\[iu\]|\{units?\})$/.test(s)) return "units";
  if (/^(ml|milliliters?)$/.test(s)) return "mL";
  if (/^(tab|tabs|tablets?|caps?|capsules?|\{tbl\}|\{tab\})$/.test(s)) return "tablet";
  if (/^(g|grams?)$/.test(s)) return "g";
  return undefined;
}

function doseOf(d: any, drugName: string): MedicationRow["dose"] {
  if (!d || typeof d !== "object") return undefined;
  const v = num(d.value);
  const u = normUnit(d.unit);
  if (v === undefined || !u) return undefined;
  if (u === "g") return { value: round(v * 1000, 4), unit: "mg" };
  if (u === "tablet") {
    const strengths = drugName.match(/(\d+(?:\.\d+)?)\s*(mg|mcg)\b(?!\s*\/\s*(ml|actuat))/gi) ?? [];
    if (strengths.length === 1 && !/\/\s*\d/.test(drugName)) {
      const m = /(\d+(?:\.\d+)?)\s*(mg|mcg)/i.exec(strengths[0])!;
      return { value: round(v * parseFloat(m[1]), 4), unit: m[2].toLowerCase() as "mg" | "mcg" };
    }
    return { value: v, unit: "tablet" };
  }
  return { value: v, unit: u };
}

function freqOf(f: unknown, sig: string | undefined): MedicationRow["frequency"] {
  if (f === "QD" || f === "BID" || f === "TID" || f === "QHS" || f === "PRN") return f;
  if (f === "OTHER") {
    if (sig && /\b(once (a |per )?week|weekly|every week|q ?week|qwk)\b/i.test(sig)) return "QW";
    return "other";
  }
  return undefined;
}

// ───────────────────────────── main ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    run(items, asOf, out);
  } catch {
    // never throw; return whatever was built
  }
  return out;
}

function run(itemsIn: FolioItem[], asOf: string, out: ViewRows) {
  const items = (Array.isArray(itemsIn) ? itemsIn : []).filter(
    (it) => it && typeof it === "object" && typeof it.id === "string" && typeof it.recorded === "string",
  );

  // Scope: recorded on or before end of asOf (Chicago).
  const inScope = items.filter((it) => {
    const l = localOf(it.recorded);
    return !!l && l.date <= asOf;
  });

  // FOLIO corrections (same issuer); supersession is transitive via the union.
  const dead = new Set<string>();
  const key = (iss: string, id: string) => iss + "\u0000" + id;
  for (const it of inScope) {
    for (const r of [...(Array.isArray(it.supersedes) ? it.supersedes : []), ...(Array.isArray(it.retracts) ? it.retracts : [])]) {
      if (typeof r === "string") dead.add(key(it.issuer, r));
    }
  }
  // Source-level voids (chart_correction), applied only from current correction items, to fixpoint.
  for (let changed = true; changed; ) {
    changed = false;
    for (const it of inScope) {
      if (dead.has(key(it.issuer, it.id))) continue;
      for (const e of Object.values(it.payload ?? {})) {
        if (!e || e.type !== "chart_correction" || !Array.isArray(e.voided_items)) continue;
        for (const v of e.voided_items) {
          if (typeof v === "string" && !dead.has(key(it.issuer, v))) {
            dead.add(key(it.issuer, v));
            changed = true;
          }
        }
      }
    }
  }
  const current = inScope.filter((it) => !dead.has(key(it.issuer, it.id)));

  // Collect entries by type.
  const byType: Record<string, Ev[]> = {};
  let idx = 0;
  for (const it of current) {
    const p = it.payload && typeof it.payload === "object" ? it.payload : {};
    const k = itemKey(it);
    for (const [entryId, entry] of Object.entries(p)) {
      if (!entry || typeof entry !== "object" || typeof (entry as any).type !== "string") continue;
      (byType[(entry as any).type] ??= []).push({ item: it, entryId, entry, key: k, idx: idx++ });
    }
  }
  const of = (t: string) => sortEvents(byType[t] ?? []);

  const safe = (f: () => void) => {
    try {
      f();
    } catch {
      /* skip */
    }
  };
  safe(() => medications(of("med_event"), out));
  const drugCaused: AllergyIntoleranceRow[] = [];
  safe(() => problems(of("problem_event"), [...of("billing_dx"), ...of("referral_dx")], byType["med_event"] ?? [], out, drugCaused));
  safe(() => allergies(of("allergy_event"), drugCaused, out));
  safe(() => labs(of("imported_result"), out));
  safe(() => vitals(of("vital_set"), of("visit"), out));
}

// ───────────────────────────── medications ─────────────────────────────

function medications(evs: Ev[], out: ViewRows) {
  const lines = new Map<string, Ev[]>();
  for (const e of evs) {
    const id = str(e.entry.med_id);
    if (!id) continue;
    if (!lines.has(id)) lines.set(id, []);
    lines.get(id)!.push(e);
  }
  const candidates: { ing: string | undefined; row: MedicationRow; last: Ev }[] = [];
  for (const [, lev] of lines) {
    try {
      const last = lev[lev.length - 1];
      const action = last.entry.action;
      let status: MedicationRow["status"];
      if (action === "start" || action === "change" || action === "resume") status = "active";
      else if (action === "hold") status = "held";
      else if (action === "stop") status = "stopped";
      else continue;

      // latest known drug name, dose, frequency, sig (carried forward)
      let drugName: string | undefined, drugObj: any, doseRaw: any, freqRaw: any, sig: string | undefined;
      let rxnorm: string | undefined;
      for (const e of lev) {
        const d = e.entry.drug;
        if (d && str(d.name)) {
          drugName = str(d.name);
          drugObj = d;
          rxnorm = str(d.rxnorm);
        }
        if (e.entry.dose) doseRaw = e.entry.dose;
        if (e.entry.frequency) freqRaw = e.entry.frequency;
        if (str(e.entry.sig)) sig = str(e.entry.sig);
      }
      if (!drugName) continue;
      if (hospitalOnly(drugName, sig)) continue;

      const ing = ingredientOf(drugName);
      const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [] };
      if (ing) row.ingredient = ing;
      if (rxnorm && RXNORM_IN[rxnorm] && (!ing || RXNORM_IN[rxnorm] === ing)) row.rxnorm_ingredient = rxnorm;
      void drugObj;

      let since: Ev | undefined;
      if (status === "active") {
        for (const e of lev) if (e.entry.action === "start" || e.entry.action === "resume") since = e;
      } else since = last;
      const sd = since ? localOf(since.item.effective) : undefined;
      if (sd) row.status_since = sd.date;

      const dose = doseOf(doseRaw, drugName);
      if (dose) row.dose = dose;
      const fq = freqOf(freqRaw, sig);
      if (fq) row.frequency = fq;

      if (status === "stopped") {
        const r = last.entry.stop_reason;
        if (["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(r)) row.stop_reason = r;
      }
      if (status !== "active" && str(last.entry.reason_text)) row.status_reason_text = str(last.entry.reason_text);

      const sens: Sensitivity[] = [];
      for (const e of lev) addSens(sens, restrictionSens(e.entry.restricted));
      if (ing && /^(buprenorphine|naltrexone|methadone|disulfiram|acamprosate)$/.test(ing)) addSens(sens, "substance-use");
      if (sens.length) row.sensitivity = sens;

      row.evidence = evidenceOf(lev);
      candidates.push({ ing, row, last });
    } catch {
      /* skip line */
    }
  }
  // One row per ingredient: the line whose own latest event is latest.
  const best = new Map<string, { row: MedicationRow; last: Ev }>();
  const rows: MedicationRow[] = [];
  for (const c of candidates) {
    const k = c.ing ?? "\u0000name:" + c.row.drug_name.toLowerCase();
    const prev = best.get(k);
    if (!prev || cmpKey(prev.last.key, c.last.key) < 0 || (cmpKey(prev.last.key, c.last.key) === 0 && prev.last.idx < c.last.idx)) {
      best.set(k, { row: c.row, last: c.last });
    }
  }
  for (const [, v] of best) rows.push(v.row);
  out.medications.push(...rows);
}

// ───────────────────────────── problems ─────────────────────────────

const CKD_STAGE_BY_ICD: Record<string, ProblemRow["ckd_stage"]> = {
  "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
};

function ckdStageOf(icd: string | undefined, text: string | undefined): ProblemRow["ckd_stage"] | undefined {
  const t = (text ?? "").toLowerCase();
  const g = /\bg(1|2|3a|3b|4|5)\b/.exec(t) || /\bstage\s*(1|2|3a|3b|4|5)\b/.exec(t);
  if (g) return ("G" + g[1].replace("a", "a").replace("b", "b")) as ProblemRow["ckd_stage"];
  if (icd && CKD_STAGE_BY_ICD[icd.toUpperCase()]) return CKD_STAGE_BY_ICD[icd.toUpperCase()];
  if (/end[- ]stage renal|esrd|eskd/.test(t)) return "G5";
  return undefined;
}

function isCkd(icd: string | undefined, text: string | undefined): boolean {
  return (!!icd && /^N18/i.test(icd)) || /chronic kidney disease|\bckd\b/i.test(text ?? "");
}

function isAdverseEffectTCode(icd: string | undefined): boolean {
  return !!icd && /^T(3[6-9]|4\d|50)\.[0-9A-Z]{1,2}X?5/i.test(icd.replace(/\s/g, ""));
}

/** Drug or class named as the cause in a diagnosis text, if any. */
function isDrugish(s: string): boolean {
  const t = s.toLowerCase();
  if (DRUG_CLASSES.some((c) => c.re.test(t))) return true;
  if (/\b(drug|medication|medicine|inhibitor|blocker|antibiotic|diuretic)\b/.test(t)) return true;
  if (KNOWN_GENERIC.test(t)) return true;
  return t.split(/[^a-z]+/).some((w) => !!BRANDS[w]);
}

function causeOf(desc: string): string | undefined {
  let m = /adverse (?:effect|reaction) (?:of|to|from)\s+(.+?)(?:,|\s*\(|$)/i.exec(desc);
  if (m) return m[1].trim();
  m = /(?:due to|caused by|secondary to|induced by|from)\s+(.+?)(?:,|\s*\(|$)/i.exec(desc);
  if (m && isDrugish(m[1])) return m[1].trim();
  m = /^(.+?)[- ](?:associated|induced|related)\b/i.exec(desc);
  if (m && isDrugish(m[1])) return m[1].trim();
  return undefined;
}

function classifyReaction(text: string, substance: string): {
  reaction_type: AllergyIntoleranceRow["reaction_type"];
  mechanism: AllergyIntoleranceRow["mechanism"];
  serious: boolean;
} {
  const t = text.toLowerCase();
  const ace = /pril\b|ace[- ]?inhibitor|\bacei?\b/i.test(substance);
  if (/angioedema/.test(t)) return { reaction_type: "hypersensitivity", mechanism: ace ? "non_immune" : "unknown", serious: true };
  if (/anaphyla|hives|urticaria|rash|bronchospasm|wheez|swelling|stevens|sjs|ten\b|exanthem|pruritus|itch|dress/.test(t))
    return { reaction_type: "hypersensitivity", mechanism: "unknown", serious: /anaphyla|stevens|sjs|bronchospasm|dress|toxic epidermal/.test(t) };
  if (/ketoacidosis|\bdka\b/.test(t)) return { reaction_type: "serious_adverse_event", mechanism: "non_immune", serious: true };
  if (/lactic acidosis|hyperkalemia|pancreatitis|rhabdo|acute kidney|aki\b|agranulocytosis|hepatotox|liver injury|hypoglycemi|bleed|hemorrhag|torsade|qt prolong|syncope|seizure/.test(t))
    return { reaction_type: "serious_adverse_event", mechanism: "unknown", serious: true };
  if (/cough/.test(t)) return { reaction_type: "side_effect", mechanism: ace ? "non_immune" : "unknown", serious: false };
  return { reaction_type: "side_effect", mechanism: "unknown", serious: false };
}

function substanceFromCause(cause: string, sameItemMeds: Ev[]): string {
  const ing = ingredientOf(cause) ?? (KNOWN_GENERIC.exec(cause.toLowerCase())?.[0]);
  const cls = DRUG_CLASSES.find((c) => c.re.test(cause));
  if (ing && !cls) return ing;
  if (cls) {
    const members = new Set<string>();
    for (const e of sameItemMeds) {
      const n = e.entry.drug && str(e.entry.drug.name);
      const i = n ? ingredientOf(n) : undefined;
      if (i && cls.member.test(i)) members.add(i);
    }
    if (members.size === 1) return [...members][0];
    return cause.replace(/\s+/g, " ").trim();
  }
  return cause.toLowerCase();
}

function problems(evs: Ev[], dxEvs: Ev[], medEvs: Ev[], out: ViewRows, drugCaused: AllergyIntoleranceRow[]) {
  const byId = new Map<string, Ev[]>();
  for (const e of evs) {
    const id = str(e.entry.problem_id);
    if (!id) continue;
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id)!.push(e);
  }
  // Merge problem lines that are the same condition: same ICD-10 code, or any CKD (restaged).
  type Group = { evs: Ev[] };
  const groups: Group[] = [];
  const groupKey = new Map<string, Group>();
  for (const [, lev] of byId) {
    const keys = new Set<string>();
    for (const e of lev) {
      const icd = str(e.entry.icd10cm)?.toUpperCase();
      const desc = str(e.entry.description);
      if (isCkd(icd, desc)) keys.add("CKD");
      else if (icd) keys.add("ICD:" + icd);
    }
    let g: Group | undefined;
    for (const k of keys) if (groupKey.has(k)) g = groupKey.get(k);
    if (!g) {
      g = { evs: [] };
      groups.push(g);
    }
    // a line whose latest is 'remove' should not resurrect/merge; handle per-line below
    g.evs.push(...lev);
    for (const k of keys) groupKey.set(k, g);
  }

  // Latest CKD stage recorded for the patient anywhere in the chart (problem, billing or referral dx).
  let ckdLatest: { stage: ProblemRow["ckd_stage"]; ev: Ev } | undefined;
  for (const e of sortEvents([...evs, ...dxEvs])) {
    const icd = str(e.entry.icd10cm);
    const text = str(e.entry.description) ?? str(e.entry.display);
    if (!isCkd(icd, text)) continue;
    const st = ckdStageOf(icd, text);
    if (st) ckdLatest = { stage: st, ev: e };
  }

  for (const g of groups) {
    try {
      const gev = sortEvents(g.evs);
      // per problem_id state; group is represented by the problem line with the latest event that is not removed
      const perLine = new Map<string, Ev[]>();
      for (const e of gev) {
        const id = e.entry.problem_id;
        if (!perLine.has(id)) perLine.set(id, []);
        perLine.get(id)!.push(e);
      }
      let chosen: Ev[] | undefined;
      let chosenLast: Ev | undefined;
      for (const [, lev] of perLine) {
        const last = lev[lev.length - 1];
        if (last.entry.action === "remove") continue;
        if (!chosenLast || cmpKey(chosenLast.key, last.key) < 0 || (cmpKey(chosenLast.key, last.key) === 0 && chosenLast.idx < last.idx)) {
          chosen = lev;
          chosenLast = last;
        }
      }
      if (!chosen || !chosenLast) continue;
      const action = chosenLast.entry.action;
      let status: ProblemRow["status"];
      if (action === "add" || action === "update") status = "active";
      else if (action === "resolve") status = "resolved";
      else continue;

      // latest values, carrying forward fields an update leaves out
      let desc: string | undefined, icd: string | undefined, snomed: string | undefined, onset: any;
      for (const e of chosen) {
        if (str(e.entry.description)) desc = str(e.entry.description);
        if (str(e.entry.icd10cm)) icd = str(e.entry.icd10cm);
        if (str(e.entry.snomed)) snomed = str(e.entry.snomed);
        if (e.entry.onset) onset = e.entry.onset;
      }
      if (!desc) continue;

      const sens: Sensitivity[] = [];
      for (const e of chosen) addSens(sens, restrictionSens(e.entry.restricted));
      addSens(sens, icdSens(icd));

      // drug-caused diagnoses
      const tcode = isAdverseEffectTCode(icd);
      const cause = causeOf(desc);
      if (tcode || cause) {
        const sameItemMeds = medEvs.filter((m) => m.item.id === chosenLast!.item.id);
        const substance = substanceFromCause(cause ?? desc, sameItemMeds);
        const cl = classifyReaction(desc, substance + " " + desc);
        const a: AllergyIntoleranceRow = {
          substance,
          reaction_type: cl.reaction_type,
          mechanism: cl.mechanism,
          criticality: cl.serious ? "high" : cause && /\bcough\b/i.test(desc) ? "low" : "unknown",
          evidence: evidenceOf([chosenLast]),
        };
        const rx = Object.entries(RXNORM_IN).find(([, v]) => v === substance);
        void rx; // not stated by the source: do not set
        const reactionText = tcode && /^adverse effect/i.test(desc) ? undefined : desc;
        if (reactionText) a.reaction = reactionText;
        const on = partialFromFuzzy(onset);
        if (on) a.onset = on;
        if (sens.length) a.sensitivity = sens.slice();
        drugCaused.push(a);
        if (tcode && /^(adverse effect|adverse reaction|.*adverse effect of)/i.test(desc) && !/\bwith\b|\bdue to\b/i.test(desc)) continue;
      }

      const row: ProblemRow = { condition: desc, status, evidence: evidenceOf(chosen) };
      if (icd) row.icd10cm = icd;
      if (snomed) row.snomed = snomed;
      const on = partialFromFuzzy(onset);
      if (on) row.onset = on;
      if (isCkd(icd, desc)) {
        const st = ckdLatest?.stage ?? ckdStageOf(icd, desc);
        if (st) {
          row.ckd_stage = st;
          if (ckdLatest && !row.evidence.some((x) => x.item_id === ckdLatest!.ev.item.id && x.entry_id === ckdLatest!.ev.entryId))
            row.evidence.push({ item_id: ckdLatest.ev.item.id, entry_id: ckdLatest.ev.entryId });
        }
        for (const e of chosen) {
          const a = /\bA([123])\b/.exec(str(e.entry.description) ?? "");
          if (a) row.albuminuria = ("A" + a[1]) as ProblemRow["albuminuria"];
        }
      }
      if (sens.length) row.sensitivity = sens;
      out.problems.push(row);
    } catch {
      /* skip */
    }
  }
}

// ───────────────────────────── allergies ─────────────────────────────

function allergies(evs: Ev[], drugCaused: AllergyIntoleranceRow[], out: ViewRows) {
  const byId = new Map<string, Ev[]>();
  for (const e of evs) {
    const id = str(e.entry.allergy_id);
    if (!id) continue;
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id)!.push(e);
  }
  const rows: AllergyIntoleranceRow[] = [];
  for (const [, lev] of byId) {
    try {
      const last = lev[lev.length - 1];
      if (last.entry.action !== "add" && last.entry.action !== "update") continue;
      const sub = last.entry.substance ?? {};
      const name = str(sub.name);
      if (!name) continue;
      if (/^(nkda|no known (drug )?allergies)/i.test(name)) continue;
      const substance = ingredientOf(name) ?? name.toLowerCase();
      const reactions: string[] = Array.isArray(last.entry.reactions) ? last.entry.reactions.filter((r: unknown) => typeof r === "string" && r.trim()) : [];
      const rtext = reactions.join("; ");
      const srcType = last.entry.reaction_type;
      let cl = classifyReaction(rtext, substance);
      if (!rtext) {
        cl = {
          reaction_type: srcType === "allergy" ? "hypersensitivity" : "side_effect",
          mechanism: "unknown",
          serious: false,
        };
      }
      const sev = last.entry.severity;
      const row: AllergyIntoleranceRow = {
        substance,
        reaction_type: cl.reaction_type,
        mechanism: cl.mechanism,
        criticality: sev === "low" ? "low" : sev === "high" ? "high" : "unknown",
        evidence: evidenceOf(lev),
      };
      const rx = str(sub.rxnorm);
      if (rx) row.rxnorm_ingredient = rx;
      if (rtext) row.reaction = rtext;
      const on = partialFromFuzzy(last.entry.onset);
      if (on) row.onset = on;
      rows.push(row);
    } catch {
      /* skip */
    }
  }
  for (const d of drugCaused) {
    const same = rows.find((r) => r.substance === d.substance);
    if (same) {
      for (const ev of d.evidence) if (!same.evidence.some((x) => x.item_id === ev.item_id && x.entry_id === ev.entry_id)) same.evidence.push(ev);
      if (d.sensitivity) {
        const s = same.sensitivity ?? [];
        for (const x of d.sensitivity) addSens(s, x);
        same.sensitivity = s;
      }
    } else rows.push(d);
  }
  out.allergies.push(...rows);
}

// ───────────────────────────── labs ─────────────────────────────

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr", "98979-8": "egfr", "50044-7": "egfr", "77147-7": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "17856-6": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin", "53060-9": "bhb", "47596-8": "bhb", "2744-1": "ph", "2753-2": "ph", "11558-4": "ph", "2019-8": "pco2", "2021-4": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "2093-3": "cholesterol", "2571-8": "triglycerides",
  "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

const CODE_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", "EGFR-NAA": "egfr", "EGFR-AA": "egfr", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", HCO3: "bicarbonate", AGAP: "anion_gap", BUN: "bun", GLU: "glucose", A1C: "a1c", HBA1C: "a1c",
  UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase",
  TROPI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", HDL: "hdl", LDL: "ldl",
};

function analyteOfName(n: string): Analyte | undefined {
  const t = n.toLowerCase();
  if (/urine|ur\b/.test(t) && /albumin.*creat|acr|microalb/.test(t)) return "uacr";
  if (/albumin\s*\/\s*creat|albumin-creatinine|\buacr\b/.test(t)) return "uacr";
  if (/egfr|glomerular filtration/.test(t)) return "egfr";
  if (/creatinine/.test(t) && !/urine|clearance/.test(t)) return "creatinine";
  if (/a1c|glycated|glycosylated/.test(t)) return "a1c";
  if (/potassium/.test(t)) return "potassium";
  if (/sodium/.test(t) && !/urine/.test(t)) return "sodium";
  if (/chloride/.test(t) && !/urine/.test(t)) return "chloride";
  if (/anion gap/.test(t)) return "anion_gap";
  if (/bicarbonate|\bco2\b|carbon dioxide/.test(t) && !/pco2|partial/.test(t)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(t)) return "bun";
  if (/glucose/.test(t) && !/urine|meter|poc|fingerstick|capillary/.test(t)) return "glucose";
  if (/platelet/.test(t)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(t) && !/urine/.test(t)) return "wbc";
  if (/hemoglobin|\bhgb\b/.test(t)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b/.test(t)) return "bhb";
  if (/pco2/.test(t)) return "pco2";
  if (/\bph\b/.test(t) && !/urine/.test(t)) return "ph";
  if (/lipase/.test(t)) return "lipase";
  if (/troponin/.test(t) && !/troponin t/.test(t)) return "troponin";
  if (/\bhdl\b/.test(t)) return "hdl";
  if (/\bldl\b/.test(t)) return "ldl";
  if (/triglyceride/.test(t)) return "triglycerides";
  if (/cholesterol/.test(t)) return "cholesterol";
  return undefined;
}

const UNIT_OF: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L", bicarbonate: "mmol/L",
  anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL",
  hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL",
  triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

/** Factor to convert a source unit to the analyte's unit, or undefined if not convertible. */
function unitFactor(a: Analyte, unitRaw: string): number | undefined {
  const u = unitRaw.replace(/\s+/g, "").toLowerCase().replace("µ", "u").replace("μ", "u");
  const target = UNIT_OF[a].toLowerCase();
  if (u === target) return 1;
  switch (a) {
    case "creatinine":
      if (u === "umol/l") return 1 / 88.42;
      return undefined;
    case "egfr":
      return /^ml\/min(\/1\.73(m2|m\^2|sq\.?m|m²)?|\/\{1\.73_m2\}|\/1\.73)?$/.test(u) ? 1 : undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      return u === "meq/l" || u === "mmol/l" ? 1 : undefined;
    case "bun":
      return u === "mg/dl" ? 1 : u === "mmol/l" ? 2.8 : undefined;
    case "glucose": case "cholesterol": case "hdl": case "ldl":
      if (u === "mg/dl") return 1;
      if (u === "mmol/l") return a === "glucose" ? 18.016 : 38.67;
      return undefined;
    case "triglycerides":
      return u === "mg/dl" ? 1 : u === "mmol/l" ? 88.57 : undefined;
    case "a1c":
      return u === "%" || u === "%hba1c" || u === "%ofhgb" || u === "%oftotalhgb" ? 1 : undefined;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "ug/mg" || u === "mcg/mg" || u === "mg/g{creat}") return 1;
      if (u === "mg/mmol") return 8.84;
      return undefined;
    case "platelets": case "wbc":
      if (/^(10\*3\/ul|10\^3\/ul|x10e3\/ul|k\/ul|thou\/ul|10\*9\/l|10\^9\/l|x10e9\/l|k\/mm3|10\*3\/mm3)$/.test(u)) return 1;
      if (/^(\/ul|cells\/ul|\/mm3|cells\/mm3)$/.test(u)) return 1 / 1000;
      return undefined;
    case "hemoglobin":
      return u === "g/dl" ? 1 : u === "g/l" ? 0.1 : undefined;
    case "ph":
      return u === "" || u === "ph" || u === "[ph]" ? 1 : undefined;
    case "pco2":
      return u === "mmhg" || u === "mm[hg]" ? 1 : u === "kpa" ? 7.50062 : undefined;
    case "lipase":
      return u === "u/l" || u === "iu/l" ? 1 : undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return 1;
      if (u === "ng/l" || u === "pg/ml") return 0.001;
      return undefined;
  }
  return undefined;
}

function egfrEquation(e: any): LabResultRow["egfr_equation"] {
  const note = (str(e.comment) ?? "").toLowerCase();
  const name = (str(e.test?.name) ?? "").toLowerCase();
  for (const t of [note, name]) {
    if (/ckd[- ]?epi[^.]*2021|2021[^.]*ckd[- ]?epi|race[- ]free/.test(t)) return "ckd-epi-2021";
    if (/ckd[- ]?epi[^.]*2009|2009[^.]*ckd[- ]?epi/.test(t)) return "ckd-epi-2009";
    if (/mdrd/.test(t)) return "mdrd";
  }
  for (const t of [note, name]) if (/ckd[- ]?epi/.test(t)) return "unknown";
  const loinc = str(e.test?.loinc);
  if (loinc === "98979-8") return "ckd-epi-2021";
  if (loinc === "88293-6" || loinc === "88294-4" || loinc === "62238-1") return "ckd-epi-2009";
  if (loinc === "33914-3") return "mdrd";
  return "unknown";
}

function isRaceVariant(e: any): boolean {
  const code = (str(e.test?.nfm_code) ?? "").toUpperCase();
  const name = (str(e.test?.name) ?? "").toLowerCase();
  const loinc = str(e.test?.loinc);
  if (code === "EGFR-AA") return true;
  if (/non[- ]?(african|black)/.test(name)) return false;
  if (/african|\bblack\b/.test(name)) return true;
  return loinc === "48643-1" || loinc === "88293-6";
}

const STATUS_RANK: Record<string, number> = { P: 1, F: 2, C: 3 };

function labs(evs: Ev[], out: ViewRows) {
  // group copies of the same result
  const groups = new Map<string, Ev[]>();
  for (const e of evs) {
    const x = e.entry;
    const ref = x.external_ref ?? {};
    const code = str(ref.result_code) ?? str(x.test?.nfm_code) ?? str(x.test?.name) ?? "";
    const k = str(ref.accession)
      ? `${str(ref.lab) ?? ""}|${str(ref.accession)}|${code}`
      : `noacc|${str(x.collected) ?? ""}|${code}|${e.item.id}|${e.entryId}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(e);
  }
  for (const [, g] of groups) {
    try {
      let best: Ev | undefined;
      for (const e of g) {
        const r = STATUS_RANK[e.entry.result_status] ?? 0;
        if (!best) { best = e; continue; }
        const br = STATUS_RANK[best.entry.result_status] ?? 0;
        const rt = Date.parse(e.entry.resulted), bt = Date.parse(best.entry.resulted);
        if (r > br || (r === br && ((rt || 0) > (bt || 0) || ((rt || 0) === (bt || 0) && cmpKey(best.key, e.key) <= 0)))) best = e;
      }
      if (!best) continue;
      const x = best.entry;
      const rs = x.result_status;
      if (rs !== "P" && rs !== "F" && rs !== "C") continue;
      const test = x.test ?? {};
      const code = (str(test.nfm_code) ?? "").toUpperCase();
      const loinc = str(test.loinc);
      const analyte: Analyte | undefined = CODE_ANALYTE[code] ?? (loinc ? LOINC_ANALYTE[loinc] : undefined) ?? analyteOfName(str(test.name) ?? "");
      if (!analyte) continue;
      if (analyte === "egfr" && isRaceVariant(x)) continue;
      const comment = (str(x.comment) ?? "").toLowerCase();
      if (/\b(invalidated|not performed|cancel+ed|result removed|disregard)\b/.test(comment) && rs === "C") {
        // a corrected copy that withdraws the result; only keep if it still carries a number
      }
      const vm = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(x.value ?? ""));
      if (!vm) continue;
      const unitRaw = str(x.unit) ?? (analyte === "ph" ? "" : undefined);
      if (unitRaw === undefined) continue;
      const f = unitFactor(analyte, unitRaw);
      if (f === undefined) continue;
      const collected = str(x.collected);
      if (!collected) continue;
      let value = parseFloat(vm[2]) * f;
      if (f !== 1) value = round(value, analyte === "ph" ? 3 : 2);
      const row: LabResultRow = {
        analyte,
        value,
        unit: UNIT_OF[analyte],
        collected,
        status: rs === "P" ? "preliminary" : "final",
        evidence: [{ item_id: best.item.id, entry_id: best.entryId }],
      };
      if (vm[1]) row.comparator = vm[1] as LabResultRow["comparator"];
      if (analyte === "egfr") row.egfr_equation = egfrEquation(x);
      if (loinc) row.loinc = loinc;
      out.labs.push(row);
    } catch {
      /* skip */
    }
  }
}

// ───────────────────────────── vitals ─────────────────────────────

function parseBp(s: unknown): [number, number] | undefined {
  if (typeof s !== "string") return undefined;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(s);
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : undefined;
}

function vitals(evs: Ev[], visits: Ev[], out: ViewRows) {
  const visitType = new Map<string, string>();
  for (const v of visits) {
    const id = str(v.entry.visit_id);
    if (id && typeof v.entry.visit_type === "string") visitType.set(id, v.entry.visit_type);
  }
  const rows: { row: VitalRow; ev: Ev }[] = [];
  for (const e of evs) {
    try {
      const x = e.entry;
      let lt = localOf(e.item.effective);
      if (!lt || !lt.time) {
        const r = localOf(e.item.recorded);
        if (lt && r && r.date === lt.date) lt = r;
      }
      if (!lt || !lt.time) continue;
      const vt = str(x.visit_id) ? visitType.get(x.visit_id) : undefined;
      const setting: VitalRow["setting"] = vt === "telehealth" || vt === "phone" ? "home" : "clinic";
      const row: VitalRow = { setting, local_time: `${lt.date}T${lt.time}`, evidence: [{ item_id: e.item.id, entry_id: e.entryId }] };
      const bp = parseBp(x.bp);
      if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
      const rb = parseBp(x.bp_repeat);
      if (rb) {
        if (bp) { row.repeat_systolic_mmhg = rb[0]; row.repeat_diastolic_mmhg = rb[1]; }
        else { row.systolic_mmhg = rb[0]; row.diastolic_mmhg = rb[1]; }
      }
      const p = num(x.pulse_bpm);
      if (p !== undefined) row.pulse_bpm = p;
      const w = num(x.weight_lb);
      if (w !== undefined) row.weight_kg = round(w * 0.45359237, 1);
      if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
      rows.push({ row, ev: e });
    } catch {
      /* skip */
    }
  }
  // drop exact duplicates of the same measurement (same values within 2 minutes)
  const kept: { row: VitalRow; ev: Ev }[] = [];
  const sig = (r: VitalRow) => JSON.stringify([r.setting, r.systolic_mmhg, r.diastolic_mmhg, r.repeat_systolic_mmhg, r.repeat_diastolic_mmhg, r.pulse_bpm, r.weight_kg]);
  const mins = (t: string) => Date.parse(t + ":00Z") / 60000;
  for (const r of rows) {
    const dup = kept.find((k) => sig(k.row) === sig(r.row) && Math.abs(mins(k.row.local_time) - mins(r.row.local_time)) <= 2);
    if (dup) {
      dup.row.evidence.push(...r.row.evidence);
      continue;
    }
    kept.push(r);
  }
  out.vitals.push(...kept.map((k) => k.row));
}
