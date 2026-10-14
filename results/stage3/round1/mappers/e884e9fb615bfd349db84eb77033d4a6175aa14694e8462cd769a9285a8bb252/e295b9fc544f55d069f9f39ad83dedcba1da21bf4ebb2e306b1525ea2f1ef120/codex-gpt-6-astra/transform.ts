import type {
  FolioItem, UsCoreRows, MedicationRequest, Observation, Quantity, CodeableConcept,
} from "../in/views/uscore";
import type { Analyte, MedicationRow } from "../in/views/views";

type Row = Record<string, unknown>;
type Item = {
  id: string;
  issuer: string;
  patient: string;
  recorded: number;
  effective?: string;
  envelope: Row;
  entries: Entry[];
};
type Entry = { row: Row; item: Item; entryId: string };
type LabCopy = { result: Entry; order: Entry; req: Entry };
type MedState = {
  order: Entry;
  history?: Entry;
  ingredient?: string;
  status: MedicationRequest["status"];
  eventTime: number;
};

const UCUM = "http://unitsofmeasure.org";
const RXNORM = "http://www.nlm.nih.gov/research/umls/rxnorm";
const LOINC = "http://loinc.org";
const LAB_CATEGORY = "http://terminology.hl7.org/CodeSystem/observation-category";
const MED_PROFILE = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest";
const LAB_PROFILE = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab";

function object(value: unknown): value is Row {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function key(...parts: string[]): string {
  return JSON.stringify(parts);
}

function date(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
  const time = Date.parse(value + "T00:00:00Z");
  if (Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value) return value;
}

function timestamp(value: unknown): number | undefined {
  if (typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ||
      !date(value.slice(0, 10))) return;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : undefined;
}

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function localStamp(time: number): string {
  const parts = chicago.formatToParts(time);
  const part = (name: string) => parts.find(p => p.type === name)?.value ?? "";
  return `${part("year").padStart(4, "0")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}:${part("second")}`;
}

// Date-only event times denote local midnight, including during daylight time.
function eventTime(value: unknown): number | undefined {
  const instant = timestamp(value);
  if (instant !== undefined) return instant;
  const day = date(value);
  if (!day) return;
  const midnight = Date.parse(day + "T00:00:00Z");
  let guess = midnight;
  for (let i = 0; i < 3; i++) {
    guess += midnight - Date.parse(localStamp(guess) + "Z");
  }
  return Number.isFinite(guess) ? guess : undefined;
}

// Source rows are flat. This final tie-breaker is independent of property order,
// and deliberately ignores malformed nested values (including cyclic objects).
function rowKey(row: Row): string {
  return JSON.stringify(Object.keys(row).sort().flatMap(k => {
    const v = row[k];
    return v === null || typeof v === "string" || typeof v === "boolean" || finite(v)
      ? [[k, v]] : [];
  }));
}

function compareEntries(a: Entry, b: Entry): number {
  return a.item.recorded - b.item.recorded || compare(a.item.id, b.item.id) ||
    compare(a.entryId, b.entryId) || compare(rowKey(a.row), rowKey(b.row));
}

function rowId(entry: Entry, field: string): string | undefined {
  const id = string(entry.row[field]);
  return id ? key(entry.item.issuer, entry.item.patient, id) : undefined;
}

function currentItems(input: FolioItem[], asOf: string): Item[] {
  const scoped: Item[] = [];
  for (const raw of input as unknown[]) {
    if (!object(raw)) continue;
    const id = string(raw.id), issuer = string(raw.issuer), patient = string(raw.patient);
    const recorded = timestamp(raw.recorded);
    if (!id || !issuer || !patient || recorded === undefined || localStamp(recorded).slice(0, 10) > asOf) continue;
    const item: Item = { id, issuer, patient, recorded, effective: string(raw.effective), envelope: raw, entries: [] };
    if (object(raw.payload)) {
      for (const entryId of Object.keys(raw.payload).sort()) {
        const row: unknown = raw.payload[entryId];
        if (object(row) && string(row.type)) item.entries.push({ row, entryId, item });
      }
    }
    scoped.push(item);
  }

  const removed = new Set<string>();
  // Consult *all* in-scope envelopes, including ones themselves replaced or
  // retracted. Thus A <- B <- C removes A and B; withdrawing C never revives A.
  for (const item of scoped) {
    for (const field of ["supersedes", "retracts"]) {
      const links = item.envelope[field];
      if (!Array.isArray(links)) continue;
      for (const id of links) if (string(id)) removed.add(key(item.issuer, id));
    }
  }
  return scoped.filter(i => !removed.has(key(i.issuer, i.id))).sort((a, b) =>
    compare(a.issuer, b.issuer) || compare(a.patient, b.patient) ||
    a.recorded - b.recorded || compare(a.id, b.id));
}

function indexRows(entries: Entry[], type: string, field: string): Map<string, Entry> {
  const result = new Map<string, Entry>();
  for (const e of entries) {
    if (e.row.type !== type) continue;
    const id = string(e.row[field]);
    if (!id) continue;
    const previous = result.get(id);
    if (!previous || compareEntries(e, previous) > 0) result.set(id, e);
  }
  return result;
}

type Test = { analyte: Analyte; sourceUnit: string; unit: string; code: string; loinc: string };
function test(analyte: Analyte, unit: string, loinc: string, sourceUnit = unit, code = unit): Test {
  return { analyte, sourceUnit, unit, code, loinc };
}

// Only result codes documented in lakeview-v1 are interpreted. Panel order
// codes and the race-coefficient eGFR variant intentionally have no entry.
const TESTS = new Map<string, Test>([
  ["LK-CREAT", test("creatinine", "mg/dL", "2160-0")],
  ["LK-EGFR09N", test("egfr", "mL/min/1.73m2", "98979-8", "mL/min/1.73m2", "mL/min/{1.73_m2}")],
  ["LK-EGFR21", test("egfr", "mL/min/1.73m2", "98979-8", "mL/min/1.73m2", "mL/min/{1.73_m2}")],
  ["LK-NA", test("sodium", "mmol/L", "2951-2")],
  ["LK-K", test("potassium", "mmol/L", "2823-3")],
  ["LK-GLU", test("glucose", "mg/dL", "2345-7")],
  ["LK-A1C", test("a1c", "%", "4548-4")],
  ["LK-UACR", test("uacr", "mg/g", "9318-7")],
  ["LK-WBC", test("wbc", "10*3/uL", "6690-2", "K/uL")],
  ["LK-HGB", test("hemoglobin", "g/dL", "718-7")],
  ["LK-PLT", test("platelets", "10*3/uL", "777-3", "K/uL")],
  ["LK-CHOL", test("cholesterol", "mg/dL", "2093-3")],
  ["LK-TRIG", test("triglycerides", "mg/dL", "2571-8")],
  ["LK-HDL", test("hdl", "mg/dL", "2085-9")],
  ["LK-LDLC", test("ldl", "mg/dL", "13457-7")],
]);

function reportedNumber(value: unknown): { value: number; comparator?: Quantity["comparator"] } | undefined {
  if (typeof value !== "string") return;
  const match = /^(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(value.trim());
  if (!match) return;
  const number = Number(match[2]);
  if (!Number.isFinite(number)) return;
  const comparator = match[1] === "≤" ? "<=" : match[1] === "≥" ? ">=" : match[1];
  return comparator ? { value: number, comparator: comparator as Quantity["comparator"] } : { value: number };
}

function equation(row: Row): NonNullable<Observation["method"]>["text"] {
  const note = string(row.COMMENT_TEXT) ?? "";
  // Method notes take precedence over both the local code and a misleading LOINC.
  if (/\bCKD[\s‐‑–-]*EPI\b[^.;\n]*\b2021\b/i.test(note)) return "ckd-epi-2021";
  if (/\bCKD[\s‐‑–-]*EPI\b[^.;\n]*\b2009\b/i.test(note)) return "ckd-epi-2009";
  if (/\bMDRD\b/i.test(note)) return "mdrd";
  if (row.TEST_CODE === "LK-EGFR21") return "ckd-epi-2021";
  if (row.TEST_CODE === "LK-EGFR09N") return "ckd-epi-2009";
  return "unknown";
}

function resultRank(copy: LabCopy): number {
  if (copy.order.row.ORDER_STATUS === 9 || copy.order.row.ORDER_STATUS === 5) return 6;
  switch (copy.result.row.RESULT_STATUS) {
    case "C": return 5;
    case "X": return 4;
    case "A": return 3;
    case "F": return 2;
    case "P": return 1;
    default: return 0;
  }
}

function compareLabs(a: LabCopy, b: LabCopy): number {
  const statusTime = (e: Entry) => timestamp(e.row.STATUS_CHANGED_AT) ?? timestamp(e.row.RESULTED_AT) ?? e.item.recorded;
  return resultRank(a) - resultRank(b) || statusTime(a.result) - statusTime(b.result) ||
    compareEntries(a.result, b.result) || compareEntries(a.order, b.order) || compareEntries(a.req, b.req);
}

function labCopies(items: Item[]): Map<string, LabCopy> {
  const copies = new Map<string, LabCopy>();
  for (const item of items) {
    const requests = indexRows(item.entries, "LAB_REQ", "REQ_ID");
    const orders = indexRows(item.entries, "LAB_ORDER", "ORDER_ID");
    for (const result of item.entries) {
      if (result.row.type !== "LAB_RESULT") continue;
      const id = rowId(result, "RESULT_ID"), orderId = string(result.row.ORDER_ID);
      if (!id || !orderId) continue;
      const order = orders.get(orderId);
      const reqId = order && string(order.row.REQ_ID);
      const req = reqId ? requests.get(reqId) : undefined;
      if (!order || !req) continue;
      const copy = { result, order, req };
      const previous = copies.get(id);
      if (!previous || compareLabs(copy, previous) > 0) copies.set(id, copy);
    }
  }
  return copies;
}

// The schema has no ingredient-level RxNorm column or drug-id code table.
// Normalize the stated name, never infer an ingredient CUI from a product CUI.
const BRANDS = new Map<string, string>([
  ["kerendia", "finerenone"], ["jardiance", "empagliflozin"], ["farxiga", "dapagliflozin"],
  ["invokana", "canagliflozin"], ["cozaar", "losartan"], ["diovan", "valsartan"],
  ["avapro", "irbesartan"], ["benicar", "olmesartan"], ["micardis", "telmisartan"],
  ["zestril", "lisinopril"], ["prinivil", "lisinopril"], ["norvasc", "amlodipine"],
  ["lasix", "furosemide"], ["bumex", "bumetanide"], ["demadex", "torsemide"],
  ["aldactone", "spironolactone"], ["inspra", "eplerenone"], ["glucophage", "metformin"],
  ["glucophage xr", "metformin"], ["lantus", "insulin glargine"], ["basaglar", "insulin glargine"],
  ["toujeo", "insulin glargine"], ["semglee", "insulin glargine"], ["humalog", "insulin lispro"],
  ["novolog", "insulin aspart"], ["tresiba", "insulin degludec"], ["ozempic", "semaglutide"],
  ["rybelsus", "semaglutide"], ["trulicity", "dulaglutide"], ["victoza", "liraglutide"],
  ["lipitor", "atorvastatin"], ["crestor", "rosuvastatin"], ["zocor", "simvastatin"],
  ["toprol xl", "metoprolol"], ["lopressor", "metoprolol"], ["coreg", "carvedilol"],
  ["synthroid", "levothyroxine"], ["rocaltrol", "calcitriol"], ["renvela", "sevelamer"],
  ["renagel", "sevelamer"], ["phoslo", "calcium acetate"], ["veltassa", "patiromer"],
  ["lokelma", "sodium zirconium cyclosilicate"],
]);

function ingredient(name: string): string | undefined {
  let value = name.toLowerCase().replace(/[®™]/g, "").replace(/\s+/g, " ").trim();
  // Strength begins the formulation portion of Lakeview's formulary display.
  value = value.replace(/\s+\d+(?:\.\d+)?\s*(?:mg|mcg|ug|g|ml|units?|iu|%|meq)\b.*$/i, "");
  value = value.replace(/\s+u-?\d+\b.*$/i, "");
  value = value.replace(/\s+(?:(?:oral|subcutaneous|intravenous|extended[ -]release|delayed[ -]release|film[ -]coated)\s+)*(?:tablets?|capsules?|solution|suspension|injection|injectable|pen|vial|powder)\b.*$/i, "");
  const fullBrand = BRANDS.get(value);
  if (fullBrand) return fullBrand;
  value = value.replace(/\s+(?:er|xr|xl|sr|cr|dr)$/, "").trim();
  const brand = BRANDS.get(value);
  if (brand) return brand;
  // Strip trailing counterions, preserving named mineral drugs such as calcium
  // acetate, potassium chloride and sodium bicarbonate.
  if (!/^(?:sodium|potassium|calcium|magnesium|ferrous|ferric|zinc)\b/.test(value)) {
    value = value.replace(/\s+(?:hydrochloride|hcl|potassium|sodium|calcium|succinate|tartrate|besylate|besilate|maleate|fumarate|mesylate|phosphate|sulfate|sulphate|carbonate|bromide|acetate)(?:\s+(?:monohydrate|dihydrate|trihydrate|anhydrous))?$/, "");
  }
  if (!value || /^(?:unknown|unspecified|unidentified|water pill|blood pressure pill|medication|drug)(?:\b|$)/.test(value)) return;
  return value;
}

function medStatus(value: unknown): MedicationRequest["status"] | undefined {
  switch (value) {
    case 1: return "active";
    case 2: return "stopped";
    case 3: return "on-hold";
    default: return undefined;
  }
}

function compareHistories(a: Entry, b: Entry): number {
  return (timestamp(a.row.CHANGED_AT) ?? -Infinity) - (timestamp(b.row.CHANGED_AT) ?? -Infinity) || compareEntries(a, b);
}

function medicationStates(items: Item[]): Map<string, MedState> {
  const orders = new Map<string, Entry>(), historiesById = new Map<string, Entry>();
  const visitTimes = new Map<Entry, number>();
  for (const item of items) {
    const visits = indexRows(item.entries, "CLINIC_VISIT", "VISIT_ID");
    for (const entry of item.entries) {
      const row = entry.row;
      if (row.type === "MED_ORDER") {
        const id = rowId(entry, "RX_ID");
        if (!id) continue;
        const old = orders.get(id);
        if (!old || compareEntries(entry, old) > 0) orders.set(id, entry);
        const visit = visits.get(string(row.VISIT_ID) ?? "");
        const time = timestamp(visit?.row.VISIT_AT) ?? eventTime(item.effective) ?? eventTime(row.START_DATE) ?? item.recorded;
        visitTimes.set(entry, time);
      } else if (row.type === "MED_STATUS_HIST") {
        const id = rowId(entry, "HIST_ID");
        if (!id) continue;
        const old = historiesById.get(id);
        if (!old || compareEntries(entry, old) > 0) historiesById.set(id, entry);
      }
    }
  }
  const histories = new Map<string, Entry>();
  const voided = new Set<string>();
  for (const entry of historiesById.values()) {
    const id = rowId(entry, "RX_ID");
    if (!id) continue;
    if (entry.row.NEW_STATUS === 9) voided.add(id);
    if ((!medStatus(entry.row.NEW_STATUS) && entry.row.NEW_STATUS !== 9) || timestamp(entry.row.CHANGED_AT) === undefined) continue;
    const old = histories.get(id);
    if (!old || compareHistories(entry, old) > 0) histories.set(id, entry);
  }

  const ingredients = new Map<string, MedState>();
  for (const [id, order] of orders) {
    const row = order.row, name = string(row.DRUG_NAME);
    // Treat clinic IV administrations as infusions, outside home-medication scope.
    if (!name || (row.ROUTE !== "PO" && row.ROUTE !== "SC") || row.MED_STATUS === 9 || voided.has(id)) continue;
    const history = histories.get(id);
    const status = medStatus(history ? history.row.NEW_STATUS : row.MED_STATUS);
    if (!status) continue;
    const generic = ingredient(name);
    const group = key(order.item.issuer, order.item.patient,
      generic ? "ingredient:" + generic : "local:" + (string(row.LV_DRUG_ID) ?? string(row.RX_ID)!));
    const latestEvent = Math.max(visitTimes.get(order) ?? order.item.recorded,
      history ? timestamp(history.row.CHANGED_AT)! : -Infinity);
    const state: MedState = { order, history, ingredient: generic, status, eventTime: latestEvent };
    const old = ingredients.get(group);
    if (!old || state.eventTime > old.eventTime || (state.eventTime === old.eventTime &&
        (compareEntries(state.history ?? state.order, old.history ?? old.order) || compareEntries(state.order, old.order)) > 0)) {
      ingredients.set(group, state);
    }
  }
  return ingredients;
}

function stopReason(row: Row): MedicationRow["stop_reason"] {
  if (row.REASON_CODE === "ADR") return "adverse_reaction";
  if (row.REASON_CODE === "PT") return "patient_choice";
  const text = string(row.COMMENT_TEXT) ?? "";
  if (/\b(?:ineffective|not (?:working|effective)|lack of (?:effect|efficacy)|no benefit)\b/i.test(text)) return "ineffective";
  if (/\b(?:switched to|replaced (?:by|with)|therapy changed)\b/i.test(text)) return "therapy_changed";
  if (/\b(?:course (?:is )?(?:complete|completed|finished)|completed (?:the )?(?:course|therapy))\b/i.test(text)) return "course_complete";
  if (/\b(?:adverse (?:drug )?reaction|side effects?)\b/i.test(text)) return "adverse_reaction";
  if (/\b(?:patient (?:request|choice|declined)|declines (?:the )?(?:drug|medication|therapy))\b/i.test(text)) return "patient_choice";
  return string(row.REASON_CODE) || text ? "other" : undefined;
}

function medication(state: MedState, id: string): MedicationRequest {
  const { order, history, status } = state;
  const row = order.row, name = string(row.DRUG_NAME)!;
  const rxnorm = string(row.RXNORM);
  const drug: CodeableConcept = rxnorm
    ? { text: name, coding: [{ system: RXNORM, code: rxnorm }] }
    : { text: state.ingredient ? `${name} (${state.ingredient})` : name };
  const result: MedicationRequest = {
    resourceType: "MedicationRequest", id, meta: { profile: [MED_PROFILE] },
    status, intent: "order", reportedBoolean: false,
    medicationCodeableConcept: drug, subject: { reference: "Patient/" + order.item.patient },
  };
  const start = date(row.START_DATE);
  const authoredOn = status === "active" && history
    ? localStamp(timestamp(history.row.CHANGED_AT)!).slice(0, 10) : start;
  if (authoredOn) result.authoredOn = authoredOn;
  if ((status === "on-hold" || status === "stopped") && history) {
    const text = string(history.row.COMMENT_TEXT);
    const reason = status === "stopped" ? stopReason(history.row) : undefined;
    if (text || reason) {
      const concept: CodeableConcept = {};
      if (text) concept.text = text;
      if (reason) concept.coding = [{ system: "urn:folio:stop-reason", code: reason }];
      result.statusReason = [concept];
    }
  }
  const doseUnits = new Map([
    ["mg", ["mg", "mg"]], ["mcg", ["mcg", "ug"]],
    ["unit", ["units", "[iU]"]], ["mL", ["mL", "mL"]],
  ]);
  const unit = doseUnits.get(string(row.DOSE_UNIT) ?? "");
  const sig: NonNullable<MedicationRequest["dosageInstruction"]>[number] = {};
  if (unit && finite(row.DOSE_QTY)) {
    sig.doseAndRate = [{ doseQuantity: { value: row.DOSE_QTY, unit: unit[0], system: UCUM, code: unit[1] } }];
  }
  const frequency = string(row.FREQ_CODE);
  if (frequency) {
    const code = ["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(frequency)
      ? frequency as NonNullable<MedicationRow["frequency"]> : "other";
    sig.timing = { code: { text: code } };
  }
  // No free-text sig is recorded in this schema; do not manufacture one.
  if (sig.doseAndRate || sig.timing) result.dosageInstruction = [sig];
  return result;
}

// Source ids normally already meet FHIR's syntax. Sorted callers plus collision
// suffixes also handle long ids and distinct ids that sanitize to the same text.
function resourceId(prefix: string, sourceId: string, used: Set<string>): string {
  const base = (prefix + sourceId.replace(/[^A-Za-z0-9.-]/g, "-")).slice(0, 64);
  let id = base, suffix = 1;
  while (used.has(id)) {
    const tail = "." + suffix++;
    id = base.slice(0, 64 - tail.length) + tail;
  }
  used.add(id);
  return id;
}

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const output: UsCoreRows = { medicationRequests: [], observations: [] };
  if (!Array.isArray(items) || !date(asOf)) return output;
  const current = currentItems(items, asOf);
  const used = new Set<string>();

  for (const [, state] of [...medicationStates(current)].sort((a, b) => compare(a[0], b[0]))) {
    output.medicationRequests.push(medication(state, resourceId("med-", string(state.order.row.RX_ID)!, used)));
  }
  for (const [, copy] of [...labCopies(current)].sort((a, b) => compare(a[0], b[0]))) {
    const { result, order, req } = copy;
    const row = result.row;
    if (![1, 2, 3, 4].includes(order.row.ORDER_STATUS as number) ||
        !["P", "F", "A"].includes(row.RESULT_STATUS as string)) continue;
    const code = string(row.TEST_CODE), spec = code ? TESTS.get(code) : undefined;
    const value = reportedNumber(row.VALUE_TEXT);
    const collected = string(req.row.COLLECTED_AT);
    if (!code || !spec || row.UNIT_CODE !== spec.sourceUnit || !value || !collected || timestamp(collected) === undefined) continue;
    const observation: Observation = {
      resourceType: "Observation", id: resourceId("obs-", string(row.RESULT_ID)!, used),
      meta: { profile: [LAB_PROFILE] }, status: row.RESULT_STATUS === "P" ? "preliminary" : "final",
      category: [{ coding: [{ system: LAB_CATEGORY, code: "laboratory" }] }],
      code: { text: spec.analyte, coding: [
        { system: LOINC, code: string(row.LOINC) ?? spec.loinc },
        { system: "urn:lakeview:test-code", code },
      ] },
      subject: { reference: "Patient/" + result.item.patient }, effectiveDateTime: collected,
      valueQuantity: { ...value, unit: spec.unit, system: UCUM, code: spec.code },
    };
    if (spec.analyte === "egfr") observation.method = { text: equation(row) };
    output.observations.push(observation);
  }
  return output;
}
