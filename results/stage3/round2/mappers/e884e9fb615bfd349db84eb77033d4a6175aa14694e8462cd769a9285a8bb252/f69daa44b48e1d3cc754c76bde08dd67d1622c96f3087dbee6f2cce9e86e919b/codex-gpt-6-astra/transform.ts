import type { FolioItem, UsCoreRows, MedicationRequest, Observation, Quantity, CodeableConcept } from "../in/views/uscore";
import type { Analyte } from "../in/views/views";

type Row = Record<string, unknown>;
type Time = { ms: number; day: string; fhir: string };
type Item = { id: string; issuer: string; patient: string; recorded: Time; raw: Row };
type Entry = { item: Item; id: string; row: Row };
type Event = { entry: Entry; time: number };
type Equation = NonNullable<Observation["method"]>["text"];

const UCUM = "http://unitsofmeasure.org" as const;
const RXNORM = "http://www.nlm.nih.gov/research/umls/rxnorm";
const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function object(value: unknown): Row | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Row : undefined;
}
function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
function cmp(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function key(...values: string[]): string { return JSON.stringify(values); }
function local(ms: number): string {
  const parts: Record<string, string> = {};
  for (const part of chicago.formatToParts(ms)) parts[part.type] = part.value;
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}
function day(value: unknown): string | undefined {
  const s = str(value);
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const ms = Date.parse(`${s}T00:00:00Z`);
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === s ? s : undefined;
}
function partialDate(value: unknown): string | undefined {
  const s = str(value);
  if (!s) return undefined;
  if (/^\d{4}$/.test(s)) return s;
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(s)) return s;
  return day(s);
}
function time(value: unknown): Time | undefined {
  const s = str(value);
  if (!s) return undefined;
  const m = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(\.\d+)?)?(Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?$/i.exec(s);
  if (!m || !day(m[1])) return undefined;
  const wall = `${m[1]}T${m[2]}:${m[3]}:${m[4] ?? "00"}${m[5] ?? ""}`;
  let fhir: string;
  if (m[6]) {
    fhir = wall + m[6].toUpperCase();
  } else {
    // Unzoned wall clocks are Chicago clocks, never the process's local zone.
    // At the repeated autumn hour, consistently choose the earlier occurrence.
    const offset = ["-05:00", "-06:00"].find(o => local(Date.parse(wall + o)) === wall.slice(0, 19));
    fhir = wall + (offset ?? "-06:00");
  }
  const ms = Date.parse(fhir);
  if (!Number.isFinite(ms)) return undefined;
  return { ms, day: m[6] ? local(ms).slice(0, 10) : m[1], fhir };
}
function compareEntries(a: Entry, b: Entry): number {
  return a.item.recorded.ms - b.item.recorded.ms || cmp(a.item.id, b.item.id) || cmp(a.id, b.id);
}
function compareEvents(a: Event, b: Event): number {
  return a.time - b.time || compareEntries(a.entry, b.entry);
}
function entries(item: Item): Entry[] {
  const payload = object(item.raw.payload);
  if (!payload) return [];
  return Object.keys(payload).sort(cmp).flatMap(id => {
    const row = object(payload[id]);
    return row ? [{ item, id, row }] : [];
  });
}
function currentItems(input: FolioItem[], asOf: string): Item[] {
  if (!Array.isArray(input) || !day(asOf)) return [];
  const scoped: Item[] = [];
  for (const value of input) {
    const raw = object(value);
    if (!raw) continue;
    const id = str(raw.id), issuer = str(raw.issuer), patient = str(raw.patient), recorded = time(raw.recorded);
    if (id && issuer && patient && recorded && recorded.day <= asOf) scoped.push({ id, issuer, patient, recorded, raw });
  }
  // All in-scope links apply, including links in subsequently replaced items.
  // Thus A <- B <- C suppresses both A and B, and retracting B cannot revive A.
  const removed = new Set<string>();
  for (const item of scoped) for (const field of ["supersedes", "retracts"]) {
    const refs = item.raw[field];
    if (Array.isArray(refs)) for (const ref of refs) {
      const id = str(ref);
      if (id) removed.add(key(item.issuer, id));
    }
  }
  return scoped.filter(i => !removed.has(key(i.issuer, i.id)))
    .sort((a, b) => a.recorded.ms - b.recorded.ms || cmp(a.issuer, b.issuer) || cmp(a.id, b.id));
}

type Test = { analyte: Analyte; sourceUnit: string; unit: string; loinc: string; equation?: Equation };
// Only result codes documented by lakeview-v1. Panels and the race-adjusted eGFR
// variant deliberately have no mapping. A shared accession is not a result id.
const tests = new Map<string, Test>([
  ["LK-CREAT", { analyte: "creatinine", sourceUnit: "mg/dL", unit: "mg/dL", loinc: "2160-0" }],
  ["LK-EGFR09N", { analyte: "egfr", sourceUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2", loinc: "98979-8", equation: "ckd-epi-2009" }],
  ["LK-EGFR21", { analyte: "egfr", sourceUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2", loinc: "98979-8", equation: "ckd-epi-2021" }],
  ["LK-NA", { analyte: "sodium", sourceUnit: "mmol/L", unit: "mmol/L", loinc: "2951-2" }],
  ["LK-K", { analyte: "potassium", sourceUnit: "mmol/L", unit: "mmol/L", loinc: "2823-3" }],
  ["LK-GLU", { analyte: "glucose", sourceUnit: "mg/dL", unit: "mg/dL", loinc: "2345-7" }],
  ["LK-A1C", { analyte: "a1c", sourceUnit: "%", unit: "%", loinc: "4548-4" }],
  ["LK-UACR", { analyte: "uacr", sourceUnit: "mg/g", unit: "mg/g", loinc: "9318-7" }],
  ["LK-WBC", { analyte: "wbc", sourceUnit: "K/uL", unit: "10*3/uL", loinc: "6690-2" }],
  ["LK-HGB", { analyte: "hemoglobin", sourceUnit: "g/dL", unit: "g/dL", loinc: "718-7" }],
  ["LK-PLT", { analyte: "platelets", sourceUnit: "K/uL", unit: "10*3/uL", loinc: "777-3" }],
  ["LK-CHOL", { analyte: "cholesterol", sourceUnit: "mg/dL", unit: "mg/dL", loinc: "2093-3" }],
  ["LK-TRIG", { analyte: "triglycerides", sourceUnit: "mg/dL", unit: "mg/dL", loinc: "2571-8" }],
  ["LK-HDL", { analyte: "hdl", sourceUnit: "mg/dL", unit: "mg/dL", loinc: "2085-9" }],
  ["LK-LDLC", { analyte: "ldl", sourceUnit: "mg/dL", unit: "mg/dL", loinc: "13457-7" }],
]);
function numeric(value: unknown): { value: number; comparator?: Quantity["comparator"] } | undefined {
  const s = str(value)?.replace(/≤/g, "<=").replace(/≥/g, ">=");
  if (!s) return undefined;
  const m = /^(<=|>=|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(s);
  if (!m) return undefined;
  const n = Number(m[2]);
  if (!Number.isFinite(n)) return undefined;
  return m[1] ? { value: n, comparator: m[1] as Quantity["comparator"] } : { value: n };
}
function equation(row: Row, fallback: Equation): Equation {
  const note = str(row.COMMENT_TEXT) ?? "";
  const pattern = /CKD[\s\-–]*EPI\s*[-(]?\s*(2009|2021)|\bMDRD\b/ig;
  // Prefer an explicit method statement over incidental mentions of older methods.
  const explicit = /(?:calculated|computed|estimated)\s+(?:by|with|using)\s+(?:the\s+)?(.+)/i.exec(note);
  const match = pattern.exec(explicit?.[1] ?? note);
  if (match) return match[1] === "2021" ? "ckd-epi-2021" : match[1] === "2009" ? "ckd-epi-2009" : "mdrd";
  return fallback;
}

type Lab = { entry: Entry; order?: Entry; req?: Entry };
function labRank(lab: Lab): number {
  if (lab.order?.row.ORDER_STATUS === 9 || lab.order?.row.ORDER_STATUS === 5) return 6;
  switch (lab.entry.row.RESULT_STATUS) {
    case "C": case "X": return 5;
    case "A": return 3;
    case "F": return 2;
    case "P": return 1;
    default: return 0;
  }
}
function labTime(lab: Lab): number {
  return time(lab.entry.row.STATUS_CHANGED_AT)?.ms ?? time(lab.entry.row.RESULTED_AT)?.ms ?? lab.entry.item.recorded.ms;
}
function observations(all: Entry[], idFor: (prefix: string, entry: Entry, sourceId: string) => string): Observation[] {
  const reqs = new Map<string, Entry>(), orders = new Map<string, Entry>();
  const inItem = (entry: Entry, id: string) => key(entry.item.issuer, entry.item.id, id);
  for (const entry of all) {
    const field = entry.row.type === "LAB_REQ" ? "REQ_ID" : entry.row.type === "LAB_ORDER" ? "ORDER_ID" : undefined;
    const id = field && str(entry.row[field]);
    if (id) (field === "REQ_ID" ? reqs : orders).set(inItem(entry, id), entry);
  }
  const results = new Map<string, Lab>();
  for (const entry of all) {
    if (entry.row.type !== "LAB_RESULT") continue;
    const id = str(entry.row.RESULT_ID), orderId = str(entry.row.ORDER_ID);
    if (!id || !orderId) continue;
    const order = orders.get(inItem(entry, orderId));
    const reqId = str(order?.row.REQ_ID);
    const lab: Lab = { entry, order, req: reqId ? reqs.get(inItem(entry, reqId)) : undefined };
    const k = key(entry.item.issuer, entry.item.patient, id), old = results.get(k);
    if (!old || (labRank(lab) - labRank(old) || labTime(lab) - labTime(old) || compareEntries(entry, old.entry)) > 0) results.set(k, lab);
  }
  const output: Observation[] = [];
  for (const [_, lab] of [...results].sort(([a], [b]) => cmp(a, b))) {
    const { entry, order, req } = lab, row = entry.row;
    if (!order || !req || ![1, 2, 3, 4].includes(order.row.ORDER_STATUS as number)) continue;
    if (row.RESULT_STATUS !== "F" && row.RESULT_STATUS !== "A" && row.RESULT_STATUS !== "P") continue;
    const code = str(row.TEST_CODE), test = code ? tests.get(code) : undefined;
    const value = numeric(row.VALUE_TEXT), collected = time(req.row.COLLECTED_AT);
    if (!code || !test || !value || !collected || row.UNIT_CODE !== test.sourceUnit) continue;
    const observation: Observation = {
      resourceType: "Observation",
      id: idFor("lab", entry, str(row.RESULT_ID)!),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab"] },
      status: row.RESULT_STATUS === "P" ? "preliminary" : "final",
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
      code: { text: test.analyte, coding: [
        { system: "http://loinc.org", code: str(row.LOINC) ?? test.loinc },
        { system: "urn:lakeview:test-code", code },
      ] },
      subject: { reference: `Patient/${entry.item.patient}` },
      effectiveDateTime: collected.fhir,
      valueQuantity: { ...value, unit: test.unit, system: UCUM, code: test.analyte === "egfr" ? "mL/min/{1.73_m2}" : test.unit },
    };
    if (test.analyte === "egfr") observation.method = { text: equation(row, test.equation ?? "unknown") };
    output.push(observation);
  }
  return output.sort((a, b) => (time(a.effectiveDateTime)!.ms - time(b.effectiveDateTime)!.ms) || cmp(a.id, b.id));
}

// These aliases identify names only; no RxNorm ingredient codes are inferred
// from Lakeview's product-level CUIs. Otherwise normalize the written generic.
const brands = new Map<string, string>([
  ["kerendia", "finerenone"], ["jardiance", "empagliflozin"], ["farxiga", "dapagliflozin"],
  ["invokana", "canagliflozin"], ["cozaar", "losartan"], ["diovan", "valsartan"],
  ["zestril", "lisinopril"], ["prinivil", "lisinopril"], ["norvasc", "amlodipine"],
  ["lasix", "furosemide"], ["bumex", "bumetanide"], ["demadex", "torsemide"],
  ["aldactone", "spironolactone"], ["inspra", "eplerenone"], ["glucophage", "metformin"],
  ["lantus", "insulin glargine"], ["basaglar", "insulin glargine"], ["toujeo", "insulin glargine"],
  ["humalog", "insulin lispro"], ["novolog", "insulin aspart"], ["tresiba", "insulin degludec"],
  ["ozempic", "semaglutide"], ["rybelsus", "semaglutide"], ["wegovy", "semaglutide"],
  ["trulicity", "dulaglutide"], ["victoza", "liraglutide"], ["mounjaro", "tirzepatide"],
  ["lipitor", "atorvastatin"], ["crestor", "rosuvastatin"], ["zocor", "simvastatin"],
  ["lokelma", "sodium zirconium cyclosilicate"], ["veltassa", "patiromer"],
  ["renvela", "sevelamer"], ["renagel", "sevelamer"], ["rocaltrol", "calcitriol"],
]);
function ingredient(name: string): string | undefined {
  let s = name.toLowerCase().replace(/[®™]/g, "").trim();
  const brand = brands.get(s.split(/[\s(]/)[0]);
  if (brand) return brand;
  if (/^(?:unknown|unspecified|water pill|medication|drug)(?:\s|$)/.test(s)) return undefined;
  s = s.replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|ug|g|units?|iu|meq|mmol|ml|%)(?:\s*\/\s*(?:\d+(?:\.\d+)?\s*)?(?:ml|l))?\b/gi, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|sustained[ -]release|film[ -]coated|enteric[ -]coated|oral|subcutaneous|intravenous|tablets?|capsules?|solution|suspension|injection|injectable|vials?|pens?|prefilled|er|xr|sr|dr)\b/g, " ")
    .replace(/\s+/g, " ").trim();
  const components = s.split(/\s*(?:\/|\+|\band\b)\s*/).map(part => part.trim()
    .replace(/\s+(?:potassium|sodium|hydrochloride|hcl|hydrobromide|succinate|tartrate|besylate|maleate|mesylate|fumarate|carbonate)$/g, "").trim()).filter(Boolean);
  if (!components.length || components.some(p => !/[a-z]/.test(p) || /\d/.test(p))) return undefined;
  return [...new Set(components)].sort(cmp).join(" / ");
}

type Medication = Event & { history?: Event; status: MedicationRequest["status"]; ingredient?: string; name: string; rx: string; drugId?: string };
function stopReason(row: Row): string | undefined {
  const reason = str(row.REASON_CODE), text = str(row.COMMENT_TEXT) ?? "";
  if (reason === "ADR") return "adverse_reaction";
  if (reason === "PT") return "patient_choice";
  if (reason === "OTH" || !reason) {
    if (/\b(?:ineffective|not effective|lack of efficacy|no benefit)\b/i.test(text)) return "ineffective";
    if (/\b(?:switched to|replaced (?:by|with)|changed to)\b/i.test(text)) return "therapy_changed";
    if (/\b(?:course|therapy|treatment) (?:is )?(?:complete|completed|finished)\b/i.test(text)) return "course_complete";
    if (/\bpatient (?:requested|declined|refused)\b/i.test(text)) return "patient_choice";
    if (/\b(?:adverse reaction|side effects?)\b/i.test(text)) return "adverse_reaction";
  }
  return reason || text ? "other" : undefined;
}
function medicationRequests(all: Entry[], idFor: (prefix: string, entry: Entry, sourceId: string) => string): MedicationRequest[] {
  const visits = new Map<string, Entry>(), orders = new Map<string, Entry>(), histories = new Map<string, Event>();
  const rxKey = (entry: Entry, rx: string) => key(entry.item.issuer, entry.item.patient, rx);
  for (const entry of all) {
    const row = entry.row;
    if (row.type === "CLINIC_VISIT" && str(row.VISIT_ID)) visits.set(key(entry.item.issuer, entry.item.id, str(row.VISIT_ID)!), entry);
    const rx = str(row.RX_ID);
    if (!rx) continue;
    const k = rxKey(entry, rx);
    if (row.type === "MED_ORDER") {
      const old = orders.get(k);
      if (!old || compareEntries(entry, old) > 0) orders.set(k, entry);
    } else if (row.type === "MED_STATUS_HIST" && [1, 2, 3, 9].includes(row.NEW_STATUS as number)) {
      const changed = time(row.CHANGED_AT);
      if (!changed) continue;
      const event = { entry, time: changed.ms }, old = histories.get(k);
      if (!old || compareEvents(event, old) > 0) histories.set(k, event);
    }
  }
  const candidates: Medication[] = [];
  for (const [k, entry] of orders) {
    const row = entry.row, history = histories.get(k);
    const statusCode = history ? history.entry.row.NEW_STATUS : row.MED_STATUS;
    // Void prescriptions never participate in ingredient deduplication.
    if (row.MED_STATUS === 9 || statusCode === 9 || row.ROUTE === "IV") continue;
    const status = statusCode === 1 ? "active" : statusCode === 2 ? "stopped" : statusCode === 3 ? "on-hold" : undefined;
    const name = str(row.DRUG_NAME), rx = str(row.RX_ID);
    if (!status || !name || !rx) continue;
    const visitId = str(row.VISIT_ID);
    const visit = visitId ? visits.get(key(entry.item.issuer, entry.item.id, visitId)) : undefined;
    const began = time(visit?.row.VISIT_AT)?.ms ?? time(entry.item.raw.effective)?.ms
      ?? time(`${day(row.START_DATE)}T00:00:00`)?.ms ?? entry.item.recorded.ms;
    candidates.push({ entry, history, time: Math.max(began, history?.time ?? began), status, name, rx,
      ingredient: ingredient(name), drugId: str(row.LV_DRUG_ID) });
  }
  // Link either identical ingredients (different strengths/formulary entries) or
  // the same stable formulary id (display wording changed over time).
  const parents = new Map<string, string>();
  const root = (value: string): string => {
    let r = value;
    while (parents.has(r) && parents.get(r) !== r) r = parents.get(r)!;
    return r;
  };
  const identity = (med: Medication) => key(med.entry.item.issuer, med.entry.item.patient,
    med.ingredient ? `ingredient:${med.ingredient}` : med.drugId ? `formulary:${med.drugId}` : `rx:${med.rx}`);
  for (const med of candidates) {
    if (!med.drugId) continue;
    const a = root(identity(med)), b = root(key(med.entry.item.issuer, med.entry.item.patient, `formulary:${med.drugId}`));
    if (a !== b) parents.set(cmp(a, b) > 0 ? a : b, cmp(a, b) > 0 ? b : a);
  }
  const latest = new Map<string, Medication>();
  for (const med of candidates) {
    const k = root(identity(med)), old = latest.get(k);
    const event = { entry: med.history?.entry ?? med.entry, time: med.time };
    const oldEvent = old ? { entry: old.history?.entry ?? old.entry, time: old.time } : undefined;
    if (!old || !oldEvent || (compareEvents(event, oldEvent) || cmp(med.rx, old.rx)) > 0) latest.set(k, med);
  }
  const output: MedicationRequest[] = [];
  for (const [_, med] of [...latest].sort(([a], [b]) => cmp(a, b))) {
    const { entry, history } = med, row = entry.row;
    const rxnorm = str(row.RXNORM);
    const concept: CodeableConcept = rxnorm
      ? { text: med.name, coding: [{ system: RXNORM, code: rxnorm }] }
      : { text: med.name + (med.ingredient ? ` (${med.ingredient})` : "") };
    const request: MedicationRequest = {
      resourceType: "MedicationRequest", id: idFor("med", entry, med.rx),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
      status: med.status, intent: "order", reportedBoolean: false,
      medicationCodeableConcept: concept, subject: { reference: `Patient/${entry.item.patient}` },
    };
    const prescriber = str(row.PRESCRIBER_NPI), author = object(entry.item.raw.author);
    const authorName = str(author?.name), authorId = str(author?.id);
    request.requester = prescriber && authorName && (authorId === `npi:${prescriber}` || authorId === prescriber)
      ? { display: authorName }
      : prescriber ? { identifier: { system: "http://hl7.org/fhir/sid/us-npi", value: prescriber } }
      : { display: "Lakeview Labs & Kidney Care" };
    const began = partialDate(row.START_DATE);
    const authored = med.status === "active" && history ? time(history.entry.row.CHANGED_AT)?.day : began;
    if (authored ?? began) request.authoredOn = authored ?? began;
    if ((med.status === "stopped" || med.status === "on-hold") && history) {
      const text = str(history.entry.row.COMMENT_TEXT);
      const reason = med.status === "stopped" ? stopReason(history.entry.row) : undefined;
      if (text || reason) request.statusReason = {
        ...(text ? { text } : {}),
        ...(reason ? { coding: [{ system: "urn:folio:stop-reason", code: reason }] } : {}),
      };
    }
    const dosage: NonNullable<MedicationRequest["dosageInstruction"]>[number] = {};
    const freq = str(row.FREQ_CODE);
    if (freq) dosage.timing = { code: { text: (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(freq) ? freq : "other") as NonNullable<typeof dosage.timing>["code"]["text"] } };
    const doseUnit = str(row.DOSE_UNIT);
    const units = new Map([["mg", ["mg", "mg"]], ["mcg", ["mcg", "ug"]], ["unit", ["units", "[iU]"]], ["mL", ["mL", "mL"]]]);
    const unit = doseUnit ? units.get(doseUnit) : undefined;
    if (finite(row.DOSE_QTY) && row.DOSE_QTY >= 0 && unit) dosage.doseAndRate = [{ doseQuantity: { value: row.DOSE_QTY, unit: unit[0], system: UCUM, code: unit[1] } }];
    if (dosage.timing || dosage.doseAndRate) request.dosageInstruction = [dosage];
    output.push(request);
  }
  return output;
}

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const all = currentItems(items, asOf).flatMap(entries);
  const usedIds = new Set<string>();
  const idFor = (prefix: string, entry: Entry, sourceId: string): string => {
    // Source ids remain recognizable. A namespaced hash prevents truncation or
    // punctuation normalization from silently conflating ids; also resolve collisions.
    let hash = 14695981039346656037n;
    for (const char of key(entry.item.issuer, entry.item.patient, sourceId)) {
      hash = BigInt.asUintN(64, (hash ^ BigInt(char.codePointAt(0)!)) * 1099511628211n);
    }
    const base = `${prefix}-${sourceId.replace(/[^A-Za-z0-9.-]/g, "-").slice(0, 40)}-${hash.toString(16).padStart(16, "0")}`;
    let id = base, suffix = 1;
    while (usedIds.has(id)) {
      const tail = `-${suffix++}`;
      id = base.slice(0, 64 - tail.length) + tail;
    }
    usedIds.add(id);
    return id;
  };
  return { medicationRequests: medicationRequests(all, idFor), observations: observations(all, idFor) };
}
