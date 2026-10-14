import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

type RecordData = Record<string, unknown>;
type Time = { local: string; instant: number; rfc3339: string };
type Item = { id: string; issuer: string; recorded: Time; data: RecordData; entries: Entry[] };
type Entry = { item: Item; id: string; data: RecordData };
type ContactEntry = { entry: Entry; visit: Entry; time: Time };

const object = (x: unknown): x is RecordData => x !== null && typeof x === "object" && !Array.isArray(x);
const string = (x: unknown): string | undefined => typeof x === "string" && x.trim() ? x.trim() : undefined;
const number = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (...parts: string[]): string => JSON.stringify(parts);
const oneOf = <T extends string>(x: unknown, choices: readonly T[]): x is T =>
  typeof x === "string" && (choices as readonly string[]).includes(x);

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function localAt(instant: number): string {
  const p: Record<string, string> = {};
  for (const part of chicago.formatToParts(new Date(instant))) p[part.type] = part.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}

function partialDate(x: unknown): string | undefined {
  const s = string(x);
  if (!s || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(s)) return undefined;
  const padded = s.length === 4 ? `${s}-01-01` : s.length === 7 ? `${s}-01` : s;
  const ms = Date.parse(`${padded}T00:00:00Z`);
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === padded ? s : undefined;
}

function time(x: unknown): Time | undefined {
  const s = string(x);
  if (!s) return undefined;
  const m = /^(\d{4}-\d{2}-\d{2})[Tt ](\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?([Zz]|[+-]\d{2}:\d{2})?$/.exec(s);
  if (!m || partialDate(m[1]) !== m[1] || +m[2] > 23 || +m[3] > 59 || +(m[4] || 0) > 59) return undefined;
  const wall = `${m[1]}T${m[2]}:${m[3]}:${m[4] || "00"}`;
  const full = wall + (m[5] || "");
  if (m[6]) {
    const rfc3339 = full + m[6].toUpperCase();
    const instant = Date.parse(rfc3339);
    return Number.isFinite(instant) ? { instant, local: localAt(instant), rfc3339 } : undefined;
  }
  // Offset-free timestamps are wall clocks in Chicago, never the process's time zone.
  // Prefer the first occurrence in the autumn overlap. Preserve a spring-gap wall clock too.
  for (const offset of ["-05:00", "-06:00"]) {
    const rfc3339 = full + offset;
    const instant = Date.parse(rfc3339);
    if (localAt(instant) === wall) return { instant, local: wall, rfc3339 };
  }
  return { instant: Date.parse(full + "-06:00"), local: wall, rfc3339: full + "-06:00" };
}

function entryCompare(a: Entry, b: Entry): number {
  return a.item.recorded.instant - b.item.recorded.instant || compare(a.item.issuer, b.item.issuer) ||
    compare(a.item.id, b.item.id) || compare(a.id, b.id);
}

function contactCompare(a: ContactEntry, b: ContactEntry): number {
  return a.time.instant - b.time.instant || entryCompare(a.entry, b.entry);
}

function evidence(...entries: (Entry | undefined)[]): Evidence {
  const refs = new Map<string, Evidence[number]>();
  for (const e of entries) if (e) refs.set(key(e.item.id, e.id), { item_id: e.item.id, entry_id: e.id });
  return [...refs.values()].sort((a, b) => compare(a.item_id, b.item_id) || compare(a.entry_id || "", b.entry_id || ""));
}

function currentItems(input: FolioItem[], asOf: string): Item[] {
  if (!Array.isArray(input) || typeof asOf !== "string" || partialDate(asOf) !== asOf || asOf.length !== 10) return [];
  const scoped: Item[] = [];
  for (const data of input as unknown[]) {
    if (!object(data)) continue;
    const id = string(data.id), issuer = string(data.issuer), recorded = time(data.recorded);
    if (!id || !issuer || !recorded || recorded.local.slice(0, 10) > asOf) continue;
    const item: Item = { id, issuer, recorded, data, entries: [] };
    if (object(data.payload)) {
      for (const id of Object.keys(data.payload).sort(compare)) {
        const row = data.payload[id];
        if (object(row) && string(row.type)) item.entries.push({ item, id, data: row });
      }
    }
    scoped.push(item);
  }
  // All in-scope assertions apply, including assertions in an item that was itself
  // replaced or retracted. This also removes every link in a supersession chain;
  // retracting a replacement must not resurrect its predecessor.
  const removed = new Set<string>();
  for (const item of scoped) for (const field of ["supersedes", "retracts"]) {
    const targets = item.data[field];
    if (Array.isArray(targets)) for (const id of targets) {
      if (typeof id === "string") removed.add(key(item.issuer, id));
    }
  }
  const unique = new Map<string, Item>();
  for (const item of scoped.sort((a, b) => a.recorded.instant - b.recorded.instant || compare(a.id, b.id))) {
    if (!removed.has(key(item.issuer, item.id))) unique.set(key(item.issuer, item.id), item);
  }
  return [...unique.values()];
}

function index(entries: Entry[], type: string, field: string): Map<string, Entry> {
  const result = new Map<string, Entry>();
  for (const e of entries) {
    const id = string(e.data[field]);
    if (e.data.type === type && id) result.set(id, e);
  }
  return result;
}

function contacts(items: Item[], type: string): ContactEntry[] {
  const result: ContactEntry[] = [];
  for (const item of items) {
    const visits = index(item.entries, "CLINIC_VISIT", "VISIT_ID");
    for (const entry of item.entries) {
      if (entry.data.type !== type) continue;
      const visitId = string(entry.data.VISIT_ID);
      const visit = visitId ? visits.get(visitId) : undefined;
      const at = visit && time(visit.data.VISIT_AT);
      if (visit && at) result.push({ entry, visit, time: at });
    }
  }
  return result.sort(contactCompare);
}

const tests: Record<string, { analyte: Analyte; unit: string; sourceUnit?: string; equation?: LabResultRow["egfr_equation"] }> = {
  "LK-CREAT": { analyte: "creatinine", unit: "mg/dL" },
  "LK-EGFR09N": { analyte: "egfr", unit: "mL/min/1.73m2", equation: "ckd-epi-2009" },
  "LK-EGFR21": { analyte: "egfr", unit: "mL/min/1.73m2", equation: "ckd-epi-2021" },
  "LK-NA": { analyte: "sodium", unit: "mmol/L" },
  "LK-K": { analyte: "potassium", unit: "mmol/L" },
  "LK-GLU": { analyte: "glucose", unit: "mg/dL" },
  "LK-A1C": { analyte: "a1c", unit: "%" },
  "LK-UACR": { analyte: "uacr", unit: "mg/g" },
  "LK-WBC": { analyte: "wbc", unit: "10*3/uL", sourceUnit: "K/uL" },
  "LK-HGB": { analyte: "hemoglobin", unit: "g/dL" },
  "LK-PLT": { analyte: "platelets", unit: "10*3/uL", sourceUnit: "K/uL" },
  "LK-CHOL": { analyte: "cholesterol", unit: "mg/dL" },
  "LK-TRIG": { analyte: "triglycerides", unit: "mg/dL" },
  "LK-HDL": { analyte: "hdl", unit: "mg/dL" },
  "LK-LDLC": { analyte: "ldl", unit: "mg/dL" },
};

function reportedNumber(x: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const s = string(x)?.replace(/^≤/, "<=").replace(/^≥/, ">=");
  const m = s && /^(<=|>=|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(s);
  if (!m || !Number.isFinite(Number(m[2]))) return undefined;
  const result: { value: number; comparator?: LabResultRow["comparator"] } = { value: Number(m[2]) };
  if (oneOf(m[1], ["<", ">", "<=", ">="] as const)) result.comparator = m[1];
  return result;
}

function equation(comment: unknown, fallback: LabResultRow["egfr_equation"]): LabResultRow["egfr_equation"] {
  const text = string(comment) || "";
  // The method note outranks both the test code and Lakeview's legacy MDRD LOINCs.
  const named = /\b(?:(?:(2009|2021)\s+)?CKD[\s\u2010-\u2015-]*EPI(?:[^.;\d]{0,40}(2009|2021))?|MDRD)\b/i.exec(text);
  if (named) {
    if (/MDRD/i.test(named[0])) return "mdrd";
    const year = named[1] || named[2];
    if (year) return year === "2009" ? "ckd-epi-2009" : "ckd-epi-2021";
  }
  return fallback || "unknown";
}

function labs(items: Item[]): LabResultRow[] {
  type Candidate = { entry: Entry; order?: Entry; req?: Entry; rank: number; at: number };
  const results = new Map<string, Candidate>();
  for (const item of items) {
    const reqs = index(item.entries, "LAB_REQ", "REQ_ID");
    const orders = index(item.entries, "LAB_ORDER", "ORDER_ID");
    for (const entry of item.entries) {
      const d = entry.data, id = string(d.RESULT_ID), orderId = string(d.ORDER_ID);
      if (d.type !== "LAB_RESULT" || !id) continue;
      const order = orderId ? orders.get(orderId) : undefined;
      const reqId = order && string(order.data.REQ_ID), req = reqId ? reqs.get(reqId) : undefined;
      const rank = order?.data.ORDER_STATUS === 9 || order?.data.ORDER_STATUS === 5 || d.RESULT_STATUS === "C" || d.RESULT_STATUS === "X"
        ? 5 : d.RESULT_STATUS === "A" ? 4 : d.RESULT_STATUS === "F" ? 3 : d.RESULT_STATUS === "P" ? 2 : 0;
      const candidate: Candidate = { entry, order, req, rank,
        at: time(d.STATUS_CHANGED_AT)?.instant ?? time(d.RESULTED_AT)?.instant ?? item.recorded.instant };
      const k = key(item.issuer, id), old = results.get(k);
      if (!old || rank > old.rank || (rank === old.rank && (candidate.at - old.at || entryCompare(entry, old.entry)) > 0)) {
        results.set(k, candidate);
      }
    }
  }
  const rows: LabResultRow[] = [];
  for (const { entry, order, req, rank } of results.values()) {
    const d = entry.data, code = string(d.TEST_CODE);
    const test = code && Object.hasOwn(tests, code) ? tests[code] : undefined;
    const value = reportedNumber(d.VALUE_TEXT), collected = req && time(req.data.COLLECTED_AT);
    if (!test || !value || !order || !req || !collected || rank < 2 || rank > 4 ||
        !number(order.data.ORDER_STATUS) || ![1, 2, 3, 4].includes(order.data.ORDER_STATUS) ||
        d.UNIT_CODE !== (test.sourceUnit || test.unit)) continue;
    const row: LabResultRow = { analyte: test.analyte, ...value, unit: test.unit,
      collected: collected.rfc3339, status: d.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: evidence(entry, order, req) };
    if (test.analyte === "egfr") row.egfr_equation = equation(d.COMMENT_TEXT, test.equation);
    const loinc = string(d.LOINC);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  return rows.sort((a, b) => (time(a.collected)!.instant - time(b.collected)!.instant) ||
    compare(a.analyte, b.analyte) || compare(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

// Product CUIs are deliberately never promoted to ingredient CUIs. Names supply
// ingredients; these aliases only translate names, not identifiers or indications.
const aliases: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  kerendia: "finerenone", cozaar: "losartan", zestril: "lisinopril", prinivil: "lisinopril",
  vasotec: "enalapril", altace: "ramipril", diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan",
  micardis: "telmisartan", atacand: "candesartan", norvasc: "amlodipine", lasix: "furosemide",
  bumex: "bumetanide", demadex: "torsemide", aldactone: "spironolactone", inspra: "eplerenone",
  glucophage: "metformin", glucotrol: "glipizide", januvia: "sitagliptin", tradjenta: "linagliptin",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", lantus: "insulin glargine", basaglar: "insulin glargine",
  toujeo: "insulin glargine", humalog: "insulin lispro", novolog: "insulin aspart", tresiba: "insulin degludec",
  levemir: "insulin detemir", lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  lopressor: "metoprolol", toprol: "metoprolol", "toprol xl": "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  renvela: "sevelamer", renagel: "sevelamer", rocaltrol: "calcitriol", sensipar: "cinacalcet",
  synthroid: "levothyroxine", zyloprim: "allopurinol", uloric: "febuxostat", flomax: "tamsulosin",
  hyzaar: "losartan / hydrochlorothiazide", entresto: "sacubitril / valsartan",
  janumet: "sitagliptin / metformin", synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin",
};

function ingredients(name: string): string[] {
  let s = name.toLowerCase().trim().replace(/[®™]/g, "");
  // Prefer an explicit generic in parentheses to a brand when supplied.
  const generic = /\(([^()]*)\)/.exec(s);
  if (generic && Object.hasOwn(aliases, s.split(/[ (]/)[0])) s = generic[1];
  s = s.replace(/\s+\d+(?:\.\d+)?(?:\s*[-/]\s*\d+(?:\.\d+)?)*(?:\s*(?:mg|mcg|g|units?|unt|iu|ml|%)\b)?.*$/i, "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\b(?:oral|subcutaneous|intravenous|extended[ -]release|delayed[ -]release|immediate[ -]release|tablets?|capsules?|solution|injection|suspension|pen|vial|xr|er|sr|xl)\b/g, " ")
    .replace(/\s+/g, " ").trim();
  if (Object.hasOwn(aliases, s)) s = aliases[s];
  if (!s || /^(?:unknown|unspecified|water pill|blood pressure (?:pill|medicine)|medication|drug)$/.test(s)) return [];
  return [...new Set(s.split(/\s*(?:\/|\s\+\s|\s+and\s+|-(?=hydrochlorothiazide\b))\s*/).map(part => {
    if (Object.hasOwn(aliases, part)) part = aliases[part];
    // Retain salts which are themselves named ingredients (e.g. potassium chloride).
    if (!/^(?:sodium|potassium|calcium|magnesium|ferrous|ferric|lithium)\b/.test(part)) {
      part = part.replace(/\s+(?:potassium|sodium|hydrochloride|hcl|succinate|tartrate|besylate|besilate|maleate|fumarate|phosphate|calcium|citrate|mesylate|medoxomil|cilexetil)$/, "");
    }
    return part.trim();
  }).filter(Boolean))];
}

function stopReason(code: unknown, comment: unknown): MedicationRow["stop_reason"] {
  if (code === "ADR") return "adverse_reaction";
  if (code === "PT") return "patient_choice";
  const s = string(comment) || "";
  if (/\b(?:ineffective|not effective|not working|lack of (?:effect|efficacy))\b/i.test(s)) return "ineffective";
  if (/\b(?:course|therapy|treatment) (?:complete|completed|finished)\b/i.test(s)) return "course_complete";
  if (/\b(?:switched to|replaced (?:by|with)|changed to)\b/i.test(s)) return "therapy_changed";
  if (/\b(?:adverse reaction|side effects?|intoleran(?:t|ce))\b/i.test(s)) return "adverse_reaction";
  if (/\b(?:patient (?:request|declin)|patient's request)/i.test(s)) return "patient_choice";
  return string(code) || s ? "other" : undefined;
}

function medications(items: Item[]): MedicationRow[] {
  const orders = new Map<string, ContactEntry>();
  for (const c of contacts(items, "MED_ORDER")) {
    const id = string(c.entry.data.RX_ID);
    if (id) orders.set(key(c.entry.item.issuer, id), c);
  }
  const histories = new Map<string, { entry: Entry; time: Time }>();
  const voided = new Set<string>();
  for (const c of contacts(items, "MED_STATUS_HIST")) {
    const d = c.entry.data, id = string(d.RX_ID), at = time(d.CHANGED_AT);
    if (!id || !at || !number(d.NEW_STATUS) || ![1, 2, 3, 9].includes(d.NEW_STATUS)) continue;
    const k = key(c.entry.item.issuer, id), previous = histories.get(k);
    if (d.NEW_STATUS === 9) voided.add(k);
    if (!previous || (at.instant - previous.time.instant || entryCompare(c.entry, previous.entry)) > 0) {
      histories.set(k, { entry: c.entry, time: at });
    }
  }
  const byIngredient = new Map<string, { row: MedicationRow; event: number; entry: Entry }>();
  for (const [rx, c] of orders) {
    const d = c.entry.data, name = string(d.DRUG_NAME), history = histories.get(rx);
    const status = history ? history.entry.data.NEW_STATUS : d.MED_STATUS;
    if (!name || d.MED_STATUS === 9 || voided.has(rx) || d.ROUTE === "IV" || ![1, 2, 3].includes(status as number)) continue;
    const row: MedicationRow = { drug_name: name, status: status === 1 ? "active" : status === 3 ? "held" : "stopped",
      patient_reported: false, evidence: evidence(c.entry, history?.entry) };
    const since = history ? history.time.local.slice(0, 10) : status === 1 ? partialDate(d.START_DATE) : undefined;
    if (since) row.status_since = since;
    if (number(d.DOSE_QTY) && d.DOSE_QTY >= 0 && oneOf(d.DOSE_UNIT, ["mg", "mcg", "unit", "mL"] as const)) {
      row.dose = { value: d.DOSE_QTY, unit: d.DOSE_UNIT === "unit" ? "units" : d.DOSE_UNIT };
    }
    if (oneOf(d.FREQ_CODE, ["QD", "BID", "TID", "QHS", "QW", "PRN"] as const)) row.frequency = d.FREQ_CODE;
    if (history && status !== 1) {
      const comment = string(history.entry.data.COMMENT_TEXT);
      if (comment) row.status_reason_text = comment;
      const reason = stopReason(history.entry.data.REASON_CODE, comment);
      if (status === 2 && reason) row.stop_reason = reason;
    }
    const names = ingredients(name);
    for (const ingredient of names.length ? names : [undefined]) {
      const copy = { ...row };
      if (ingredient) copy.ingredient = ingredient;
      // A combination's total dose cannot be assigned to each of its ingredients.
      if (names.length > 1) delete copy.dose;
      const k = ingredient ? key("ingredient", ingredient) : key("drug", string(d.LV_DRUG_ID) || name);
      const event = history?.time.instant ?? c.time.instant, entry = history?.entry ?? c.entry;
      const old = byIngredient.get(k);
      if (!old || (event - old.event || entryCompare(entry, old.entry)) > 0) byIngredient.set(k, { row: copy, event, entry });
    }
  }
  return [...byIngredient.values()].map(v => v.row).sort((a, b) => compare(a.ingredient || a.drug_name, b.ingredient || b.drug_name));
}

function sensitivity(code: string, description: string): Sensitivity[] | undefined {
  if (/^F1\d/.test(code) || /\b(?:alcohol|opioid|substance|cocaine) (?:use disorder|dependence|abuse)\b/i.test(description)) return ["substance-use"];
  if (/^F\d/.test(code) || /\b(?:depression|bipolar disorder|schizophrenia|anxiety disorder)\b/i.test(description)) return ["mental-health"];
  if (/^(?:B20|Z21|A5\d|A6[0-4])(?:\.|$)/.test(code) || /\b(?:HIV|AIDS|syphilis|gonorrhea|chlamydia)\b/i.test(description)) return ["hiv-sti"];
  if (/^O\d/.test(code) || /\b(?:pregnancy|contraception|infertility)\b/i.test(description)) return ["sexual-reproductive-health"];
  if (/\b(?:genetic mutation|pathogenic variant)\b/i.test(description)) return ["genetic"];
  return undefined;
}

const stages: Record<string, NonNullable<ProblemRow["ckd_stage"]>> = {
  "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
};
const gCategories = ["G1", "G2", "G3a", "G3b", "G4", "G5"] as const;

function isCKD(code: string): boolean { return /^N18(?:\.|$)/.test(code); }

function recordedStage(d: RecordData): ProblemRow["ckd_stage"] {
  const code = string(d.ICD10CM);
  if (code && Object.hasOwn(stages, code)) return stages[code];
  const text = string(d.DX_TEXT) || "";
  const m = /\b(?:stage\s*|G)(1|2|3a|3b|4|5)\b/i.exec(text);
  const stage = m && `G${m[1].toLowerCase()}`;
  return oneOf(stage, gCategories) ? stage : undefined;
}

function conditionKey(code: string, text: string): string {
  if (isCKD(code)) return "ckd";
  // A change from uncomplicated diabetes/hypertension to a code mentioning CKD
  // does not create a second instance of the underlying chronic condition.
  if (/^E(?:08|09|10|11|13)(?:\.|$)/.test(code) && /^(?:type [12] )?diabetes\b/i.test(text)) return `diabetes:${code.split(".")[0]}`;
  if (/^I1[0-3](?:\.|$)/.test(code) && /hypertens/i.test(text)) return "hypertension";
  // Standalone acute complications (including drug-induced ketoacidosis) retain
  // their own identity; other unrelated diagnoses are never merged by code prefix.
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() || code;
}

const drugClasses: { pattern: RegExp; members: string[] }[] = [
  { pattern: /\b(?:SGLT[ -]?2|sodium[ -]glucose (?:co[ -]?)?transporter[ -]?2)\b/i,
    members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "bexagliflozin", "sotagliflozin"] },
  { pattern: /\b(?:ACE|angiotensin[ -]converting[ -]enzyme)\b/i,
    members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "fosinopril", "perindopril", "quinapril", "trandolapril", "moexipril"] },
  { pattern: /\b(?:ARB|angiotensin (?:II )?receptor blocker)\b/i,
    members: ["losartan", "valsartan", "irbesartan", "olmesartan", "telmisartan", "candesartan", "azilsartan", "eprosartan"] },
  { pattern: /\b(?:mineralocorticoid receptor antagonist|MRA)\b/i,
    members: ["finerenone", "spironolactone", "eplerenone"] },
  { pattern: /\bstatins?\b/i,
    members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "fluvastatin", "pitavastatin"] },
];

function drugReaction(c: ContactEntry, knownDrugs: Set<string>, confirmation?: Entry): AllergyIntoleranceRow | undefined {
  const text = string(c.entry.data.DX_TEXT);
  if (!text) return undefined;
  let substance: string | undefined, reaction: string | undefined;
  let m = /^(.+?)[ -](?:associated|induced|related)\s+(.+)$/i.exec(text);
  if (m) { substance = m[1]; reaction = m[2]; }
  if (!substance) {
    m = /^(.+?)\s+(?:due to|caused by|secondary to|attributed to|from)\s+(.+)$/i.exec(text);
    if (m) { reaction = m[1]; substance = m[2]; }
  }
  if (!substance) {
    m = /^(?:adverse (?:effect|reaction)(?:s)? (?:of|to)|allergy to|intolerance to)\s+(.+?)(?:\s*[:;(]\s*(.+?)[)]?)?$/i.exec(text);
    if (m) { substance = m[1]; reaction = m[2]; }
  }
  if (!substance) return undefined;
  substance = substance.replace(/,?\s*(?:initial|subsequent) encounter\b.*$/i, "").replace(/[,.;\s]+$/, "").trim();
  if (/^(?:drug|medication|unknown|unspecified)s?$/i.test(substance)) return undefined;
  const group = drugClasses.find(g => g.pattern.test(substance!));
  const named = ingredients(substance);
  const specific = named.length === 1 && knownDrugs.has(named[0]) ? named[0] :
    [...knownDrugs].sort((a, b) => b.length - a.length || compare(a, b)).find(drug =>
      (` ${substance!.toLowerCase().replace(/[^a-z0-9 ]/g, " ")} `).includes(` ${drug} `));
  const supporting: Entry[] = [];
  if (specific) substance = specific;
  else if (group) {
    const matches = new Map<string, Entry[]>();
    for (const e of c.entry.item.entries) {
      if (e.data.type !== "MED_ORDER" || e.data.MED_STATUS === 9) continue;
      const name = string(e.data.DRUG_NAME);
      if (!name) continue;
      for (const ingredient of ingredients(name)) if (group.members.includes(ingredient)) {
        matches.set(ingredient, [...(matches.get(ingredient) || []), e]);
      }
    }
    if (matches.size === 1) {
      const [ingredient, entries] = [...matches.entries()][0];
      substance = ingredient;
      supporting.push(...entries);
    }
  } else return undefined; // A non-drug cause (e.g. dehydration) is not a drug intolerance.
  const description = reaction || text;
  let reactionType: AllergyIntoleranceRow["reaction_type"];
  if (/\b(?:hives|urticaria|rash|angioedema|anaphylaxis|anaphylactic|bronchospasm)\b/i.test(description)) reactionType = "hypersensitivity";
  else if (/\b(?:ketoacidosis|lactic acidosis|hyperkalemia|hypoglycemia|acute kidney injury|renal failure|pancreatitis|rhabdomyolysis|hepatotoxicity|severe bleeding)\b/i.test(description)) reactionType = "serious_adverse_event";
  else if (/\b(?:cough|nausea|vomiting|diarrhea|GI upset|gastrointestinal|myalgia|dizziness|edema|constipation|headache)\b/i.test(description)) reactionType = "side_effect";
  else return undefined; // The target has no unknown reaction type; do not invent a clinical reaction.
  const ace = drugClasses[1].pattern.test(substance) || drugClasses[1].members.includes(substance);
  const mechanism: AllergyIntoleranceRow["mechanism"] = /\b(?:non[ -]immune|bradykinin)\b/i.test(text) ||
    (ace && /\b(?:angioedema|cough)\b/i.test(description)) || /\b(?:ketoacidosis|lactic acidosis|hyperkalemia|hypoglycemia)\b/i.test(description)
    ? "non_immune" : /\b(?:IgE|T[ -]cell|immune[ -]mediated|confirmed allergy test)\b/i.test(text) ? "immune" : "unknown";
  const row: AllergyIntoleranceRow = { substance, reaction_type: reactionType, mechanism,
    criticality: /\b(?:severe|life[ -]threatening|anaphylaxis|anaphylactic|angioedema|bronchospasm)\b/i.test(description) || reactionType === "serious_adverse_event"
      ? "high" : /\bmild\b/i.test(description) || reactionType === "side_effect" ? "low" : "unknown",
    evidence: evidence(c.entry, confirmation, ...supporting) };
  if (reaction) row.reaction = reaction.replace(/[)]$/, "").trim();
  return row;
}

function problemsAndAllergies(items: Item[]): Pick<ViewRows, "problems" | "allergies"> {
  const dx = contacts(items, "VISIT_DX").filter(c => string(c.entry.data.ICD10CM) && string(c.entry.data.DX_TEXT) &&
    oneOf(c.entry.data.DX_STATUS, ["A", "P", "R", "H"] as const));
  // The source's list is the latest row PER CODE. Keep history solely to establish
  // whether a subsequent provisional entry was ever confirmed, not to revive R rows.
  const byCode = new Map<string, ContactEntry[]>();
  for (const c of dx) {
    const k = string(c.entry.data.ICD10CM)!;
    byCode.set(k, [...(byCode.get(k) || []), c]);
  }
  const grouped = new Map<string, ContactEntry[]>();
  for (const history of byCode.values()) {
    const latest = history[history.length - 1], d = latest.entry.data;
    const k = conditionKey(string(d.ICD10CM)!, string(d.DX_TEXT)!);
    grouped.set(k, [...(grouped.get(k) || []), ...history]);
  }
  type Category<T> = { value: T; time: number; entry: Entry; priority: number };
  let stage: Category<NonNullable<ProblemRow["ckd_stage"]>> | undefined;
  let albuminuria: Category<NonNullable<ProblemRow["albuminuria"]>> | undefined;
  for (const c of dx) {
    if (!isCKD(string(c.entry.data.ICD10CM)!) || !["A", "H"].includes(c.entry.data.DX_STATUS as string)) continue;
    const value = recordedStage(c.entry.data);
    if (value && (!stage || (c.time.instant - stage.time || entryCompare(c.entry, stage.entry)) > 0)) {
      stage = { value, time: c.time.instant, entry: c.entry, priority: 0 };
    }
  }
  for (const item of items) for (const entry of item.entries) {
    if (entry.data.type !== "CLINIC_VISIT") continue;
    const at = time(entry.data.VISIT_AT);
    if (!at) continue;
    if (oneOf(entry.data.CKD_G, gCategories) && (!stage || at.instant > stage.time ||
      (at.instant === stage.time && (stage.priority === 0 || entryCompare(entry, stage.entry) > 0)))) {
      stage = { value: entry.data.CKD_G, time: at.instant, entry, priority: 1 };
    }
    if (oneOf(entry.data.CKD_A, ["A1", "A2", "A3"] as const) && (!albuminuria ||
      (at.instant - albuminuria.time || entryCompare(entry, albuminuria.entry)) > 0)) {
      albuminuria = { value: entry.data.CKD_A, time: at.instant, entry, priority: 1 };
    }
  }
  const knownDrugs = new Set([...Object.values(aliases).flatMap(name => name.split(" / ")), ...drugClasses.flatMap(g => g.members)]);
  for (const item of items) for (const entry of item.entries) {
    const name = entry.data.type === "MED_ORDER" && string(entry.data.DRUG_NAME);
    if (name) for (const ingredient of ingredients(name)) knownDrugs.add(ingredient);
  }
  const problems: ProblemRow[] = [], allergies = new Map<string, AllergyIntoleranceRow>();
  const groups = [...grouped.entries()].map(([group, history]) => ({ group, history: history.sort(contactCompare) }))
    .sort((a, b) => contactCompare(a.history[a.history.length - 1], b.history[b.history.length - 1]));
  for (const { group, history } of groups) {
    const latest = history[history.length - 1], d = latest.entry.data;
    if (d.DX_STATUS === "R") continue;
    let confirmed: ContactEntry | undefined;
    for (let i = history.length - 1; i >= 0; i--) {
      const status = history[i].entry.data.DX_STATUS;
      if (status === "R") break;
      if (status === "A" || status === "H") { confirmed = history[i]; break; }
    }
    if (!confirmed) continue;
    const code = string(d.ICD10CM)!, condition = string(d.DX_TEXT)!;
    const allergy = drugReaction(latest, knownDrugs, confirmed.entry);
    if (allergy) {
      const old = allergies.get(allergy.substance);
      if (old) {
        allergy.evidence = [...new Map([...old.evidence, ...allergy.evidence].map(e => [key(e.item_id, e.entry_id || ""), e])).values()]
          .sort((a, b) => compare(a.item_id, b.item_id) || compare(a.entry_id || "", b.entry_id || ""));
        const reactions = [...new Set([old.reaction, allergy.reaction].filter((v): v is string => !!v))];
        if (reactions.length) allergy.reaction = reactions.join("; ");
        if (old.criticality === "high") allergy.criticality = "high";
      }
      allergies.set(allergy.substance, allergy);
    }
    // A bare T-code adverse-effect label is not itself a disease. A T-code that
    // explicitly names the caused condition retains that condition as a problem.
    const bareAdverseEffect = /^T\d/.test(code) && /^(?:adverse effect|adverse reaction|poisoning by)\b/i.test(condition) &&
      !/\b(?:ketoacidosis|acidosis|hyperkalemia|angioedema|cough|rash|anaphylaxis|myalgia|pancreatitis|kidney injury)\b/i.test(condition);
    if (bareAdverseEffect) continue;
    const row: ProblemRow = { condition, icd10cm: code,
      status: confirmed.entry.data.DX_STATUS === "H" ? "resolved" : "active",
      evidence: evidence(latest.entry, confirmed.entry) };
    if (group === "ckd") {
      if (stage) row.ckd_stage = stage.value;
      if (albuminuria) row.albuminuria = albuminuria.value;
      row.evidence = evidence(latest.entry, confirmed.entry, stage?.entry, albuminuria?.entry);
    }
    const sensitive = sensitivity(code, condition);
    if (sensitive) { row.sensitivity = sensitive; if (allergy) allergy.sensitivity = sensitive; }
    problems.push(row);
  }
  return {
    problems: problems.sort((a, b) => compare(a.icd10cm || "", b.icd10cm || "") || compare(a.condition, b.condition)),
    allergies: [...allergies.values()].sort((a, b) => compare(a.substance, b.substance)),
  };
}

function vitals(items: Item[]): VitalRow[] {
  const byVisit = new Map<string, ContactEntry[]>();
  for (const c of contacts(items, "VITAL")) {
    const d = c.entry.data;
    if (!oneOf(d.VITAL_CODE, ["BPS", "BPD", "HR", "WT"] as const) || !number(d.VALUE_NUM) ||
        !number(d.READING_NO) || !Number.isInteger(d.READING_NO) || d.READING_NO < 1 || !time(d.TAKEN_AT) ||
        d.UNIT_CODE !== (d.VITAL_CODE === "WT" ? "kg" : d.VITAL_CODE === "HR" ? "/min" : "mmHg")) continue;
    const k = key(c.entry.item.issuer, string(d.VISIT_ID)!);
    byVisit.set(k, [...(byVisit.get(k) || []), c]);
  }
  const rows: VitalRow[] = [];
  for (const values of byVisit.values()) {
    // READING_NO pairs the pressure components; never pair across repetitions.
    values.sort((a, b) => (a.entry.data.READING_NO as number) - (b.entry.data.READING_NO as number) ||
      time(a.entry.data.TAKEN_AT)!.instant - time(b.entry.data.TAKEN_AT)!.instant || entryCompare(a.entry, b.entry));
    const pressure = values.filter(c => c.entry.data.VITAL_CODE === "BPS" || c.entry.data.VITAL_CODE === "BPD");
    const readings = [...new Set(pressure.map(c => c.entry.data.READING_NO as number))];
    const first = pressure.length ? pressure.filter(c => c.entry.data.READING_NO === readings[0]) : values;
    const at = first.map(c => time(c.entry.data.TAKEN_AT)!).sort((a, b) => a.instant - b.instant)[0];
    const row: VitalRow = { setting: "clinic", local_time: at.local.slice(0, 16), evidence: [] };
    const used: Entry[] = [];
    const assign = (code: string, reading: number | undefined, field: "systolic_mmhg" | "diastolic_mmhg" | "repeat_systolic_mmhg" | "repeat_diastolic_mmhg" | "pulse_bpm" | "weight_kg") => {
      const c = values.find(c => c.entry.data.VITAL_CODE === code && (reading === undefined || c.entry.data.READING_NO === reading));
      if (!c) return;
      const value = c.entry.data.VALUE_NUM as number;
      row[field] = field === "weight_kg" ? Math.round(value * 10) / 10 : value;
      used.push(c.entry);
    };
    if (readings.length) {
      assign("BPS", readings[0], "systolic_mmhg"); assign("BPD", readings[0], "diastolic_mmhg");
      // The view has room for one repeat: use the last documented repetition.
      if (readings.length > 1) {
        assign("BPS", readings[readings.length - 1], "repeat_systolic_mmhg");
        assign("BPD", readings[readings.length - 1], "repeat_diastolic_mmhg");
      }
    }
    assign("HR", undefined, "pulse_bpm"); assign("WT", undefined, "weight_kg");
    row.evidence = evidence(...used);
    rows.push(row);
  }
  return rows.sort((a, b) => compare(a.local_time, b.local_time) || compare(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const current = currentItems(items, asOf);
  return { medications: medications(current), ...problemsAndAllergies(current), labs: labs(current), vitals: vitals(current) };
}
