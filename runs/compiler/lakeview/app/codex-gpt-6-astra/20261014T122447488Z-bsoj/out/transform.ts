import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow,
  AllergyIntoleranceRow, LabResultRow, VitalRow, Analyte,
} from "../in/views/views";

// Payloads are checked at the boundary, rather than asserted to match the schema.
type Data = Record<string, unknown>;
type Item = { id: string; issuer: string; recorded: number; data: Data; entries: Entry[] };
type Entry = { item: Item; id: string; data: Data };
type ContactEntry = { entry: Entry; visit: Entry; time: number };
const object = (v: unknown): v is Data => v !== null && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown): string | undefined => typeof v === "string" && v.trim() ? v.trim() : undefined;
const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (...parts: string[]): string => JSON.stringify(parts);
const scoped = (e: Entry, id: string): string => key(e.item.issuer, id);

function dateOnly(v: unknown): string | undefined {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return;
  const n = Date.parse(v + "T00:00:00Z");
  if (Number.isFinite(n) && new Date(n).toISOString().slice(0, 10) === v) return v;
}

function instant(v: unknown): number | undefined {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(v)) return;
  if (!dateOnly(v.slice(0, 10)) || +v.slice(11, 13) > 23 || +v.slice(14, 16) > 59 || +v.slice(17, 19) > 59) return;
  const n = Date.parse(v);
  return Number.isFinite(n) ? n : undefined;
}

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});
function local(n: number): string {
  const parts = chicago.formatToParts(n);
  const part = (type: string): string => parts.find(p => p.type === type)?.value ?? "";
  return `${part("year").padStart(4, "0")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

function entryCompare(a: Entry, b: Entry): number {
  return a.item.recorded - b.item.recorded || compare(a.item.issuer, b.item.issuer)
    || compare(a.item.id, b.item.id) || compare(a.id, b.id);
}
function contactCompare(a: ContactEntry, b: ContactEntry): number {
  return a.time - b.time || entryCompare(a.entry, b.entry);
}
function evidence(...entries: (Entry | undefined)[]): Evidence {
  const unique = new Map<string, { item_id: string; entry_id: string }>();
  for (const e of entries) if (e) unique.set(key(e.item.id, e.id), { item_id: e.item.id, entry_id: e.id });
  return [...unique.values()].sort((a, b) => compare(a.item_id, b.item_id) || compare(a.entry_id, b.entry_id));
}
function strings(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function currentItems(input: FolioItem[], asOf: string): Item[] {
  const items: Item[] = [];
  if (!Array.isArray(input)) return items;
  for (const raw of input as unknown[]) {
    if (!object(raw)) continue;
    const id = str(raw.id), issuer = str(raw.issuer), recorded = instant(raw.recorded);
    if (!id || !issuer || recorded === undefined || local(recorded).slice(0, 10) > asOf) continue;
    const item: Item = { id, issuer, recorded, data: raw, entries: [] };
    if (object(raw.payload)) {
      for (const entryId of Object.keys(raw.payload).sort(compare)) {
        const data = raw.payload[entryId];
        if (object(data) && str(data.type)) item.entries.push({ item, id: entryId, data });
      }
    }
    items.push(item);
  }
  // Use edges from ALL in-scope items, including ones themselves superseded or
  // retracted. This closes chains transitively and never resurrects an ancestor.
  const removed = new Set<string>();
  for (const item of items) {
    for (const id of [...strings(item.data.supersedes), ...strings(item.data.retracts)]) {
      removed.add(key(item.issuer, id));
    }
  }
  return items.filter(i => !removed.has(key(i.issuer, i.id)))
    .sort((a, b) => a.recorded - b.recorded || compare(a.issuer, b.issuer) || compare(a.id, b.id));
}

function index(entries: Entry[], type: string, field: string): Map<string, Entry> {
  const result = new Map<string, Entry>();
  for (const e of entries) {
    const id = str(e.data[field]);
    if (e.data.type !== type || !id) continue;
    const prior = result.get(id);
    if (!prior || entryCompare(e, prior) > 0) result.set(id, e);
  }
  return result;
}

type LabSpec = { analyte: Analyte; sourceUnit: string; unit: string };
const labCodes = new Map<string, LabSpec>([
  ["LK-CREAT", { analyte: "creatinine", sourceUnit: "mg/dL", unit: "mg/dL" }],
  ["LK-EGFR09N", { analyte: "egfr", sourceUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2" }],
  ["LK-EGFR21", { analyte: "egfr", sourceUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2" }],
  ["LK-NA", { analyte: "sodium", sourceUnit: "mmol/L", unit: "mmol/L" }],
  ["LK-K", { analyte: "potassium", sourceUnit: "mmol/L", unit: "mmol/L" }],
  ["LK-GLU", { analyte: "glucose", sourceUnit: "mg/dL", unit: "mg/dL" }],
  ["LK-A1C", { analyte: "a1c", sourceUnit: "%", unit: "%" }],
  ["LK-UACR", { analyte: "uacr", sourceUnit: "mg/g", unit: "mg/g" }],
  ["LK-WBC", { analyte: "wbc", sourceUnit: "K/uL", unit: "10*3/uL" }],
  ["LK-HGB", { analyte: "hemoglobin", sourceUnit: "g/dL", unit: "g/dL" }],
  ["LK-PLT", { analyte: "platelets", sourceUnit: "K/uL", unit: "10*3/uL" }],
  ["LK-CHOL", { analyte: "cholesterol", sourceUnit: "mg/dL", unit: "mg/dL" }],
  ["LK-TRIG", { analyte: "triglycerides", sourceUnit: "mg/dL", unit: "mg/dL" }],
  ["LK-HDL", { analyte: "hdl", sourceUnit: "mg/dL", unit: "mg/dL" }],
  ["LK-LDLC", { analyte: "ldl", sourceUnit: "mg/dL", unit: "mg/dL" }],
]);

function numericText(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof v !== "string") return;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(v);
  if (!m) return;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return;
  const comparator = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1];
  return comparator ? { value, comparator: comparator as LabResultRow["comparator"] } : { value };
}

function equation(e: Entry): LabResultRow["egfr_equation"] {
  const note = str(e.data.COMMENT_TEXT) ?? "";
  // Method notes outrank both the test code and Lakeview's historical, incorrect
  // MDRD LOINC mapping. Never recompute the printed eGFR.
  const method = /\bCKD[\s-]*EPI\s*(?:equation\s*)?\(?\s*(2009|2021)\b|\bMDRD\b/i.exec(note);
  if (method) return method[1] === "2021" ? "ckd-epi-2021" : method[1] === "2009" ? "ckd-epi-2009" : "mdrd";
  return e.data.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : "ckd-epi-2009";
}

function labs(items: Item[]): LabResultRow[] {
  type Copy = { result: Entry; order?: Entry; req?: Entry };
  const copies = new Map<string, Copy>();
  const rank = (s: unknown): number => s === "C" || s === "X" ? 4 : s === "A" ? 3 : s === "F" ? 2 : s === "P" ? 1 : 0;
  const voidOrders = new Set<string>();
  for (const item of items) {
    const reqs = index(item.entries, "LAB_REQ", "REQ_ID");
    const orders = index(item.entries, "LAB_ORDER", "ORDER_ID");
    for (const [id, order] of orders) if (order.data.ORDER_STATUS === 9) voidOrders.add(scoped(order, id));
    for (const result of item.entries) {
      const r = result.data, id = str(r.RESULT_ID), orderId = str(r.ORDER_ID);
      if (r.type !== "LAB_RESULT" || !id || !orderId || !rank(r.RESULT_STATUS)) continue;
      const order = orders.get(orderId), reqId = order && str(order.data.REQ_ID);
      const copy: Copy = { result, order, req: reqId ? reqs.get(reqId) : undefined };
      const k = scoped(result, id), prev = copies.get(k);
      if (!prev || rank(r.RESULT_STATUS) > rank(prev.result.data.RESULT_STATUS)
        || (rank(r.RESULT_STATUS) === rank(prev.result.data.RESULT_STATUS) && entryCompare(result, prev.result) > 0)) copies.set(k, copy);
    }
  }
  const rows: LabResultRow[] = [];
  for (const { result, order, req } of copies.values()) {
    const r = result.data;
    if (!order || !req || voidOrders.has(scoped(result, String(r.ORDER_ID)))) continue;
    if (![1, 2, 3, 4].includes(order.data.ORDER_STATUS as number)) continue;
    if (r.RESULT_STATUS !== "P" && r.RESULT_STATUS !== "F" && r.RESULT_STATUS !== "A") continue;
    // LK-EGFR09A is deliberately absent: keep only the non-race-coefficient variant.
    const spec = labCodes.get(str(r.TEST_CODE) ?? "");
    const value = numericText(r.VALUE_TEXT), collected = str(req.data.COLLECTED_AT);
    if (!spec || !value || r.UNIT_CODE !== spec.sourceUnit || !collected || instant(collected) === undefined) continue;
    const row: LabResultRow = {
      analyte: spec.analyte, ...value, unit: spec.unit, collected,
      status: r.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: evidence(result, order, req),
    };
    if (spec.analyte === "egfr") row.egfr_equation = equation(result);
    const loinc = str(r.LOINC);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  return rows.sort((a, b) => Date.parse(a.collected) - Date.parse(b.collected)
    || compare(a.analyte, b.analyte) || compare(JSON.stringify(a), JSON.stringify(b)));
}

function contacts(items: Item[]): { visits: Entry[]; rows: ContactEntry[] } {
  const visits: Entry[] = [], rows: ContactEntry[] = [];
  for (const item of items) {
    const byId = index(item.entries, "CLINIC_VISIT", "VISIT_ID");
    for (const visit of byId.values()) {
      if (instant(visit.data.VISIT_AT) !== undefined) visits.push(visit);
    }
    for (const entry of item.entries) {
      const id = str(entry.data.VISIT_ID), visit = id ? byId.get(id) : undefined;
      const time = visit && instant(visit.data.VISIT_AT);
      if (visit && time !== undefined) rows.push({ entry, visit, time });
    }
  }
  return { visits, rows: rows.sort(contactCompare) };
}

const brandIngredients = new Map<string, string>([
  ["jardiance", "empagliflozin"], ["farxiga", "dapagliflozin"], ["kerendia", "finerenone"],
  ["invokana", "canagliflozin"], ["cozaar", "losartan"], ["glucophage", "metformin"],
  ["glucophage xr", "metformin"], ["lantus", "insulin glargine"], ["basaglar", "insulin glargine"],
  ["toujeo", "insulin glargine"], ["semglee", "insulin glargine"], ["humalog", "insulin lispro"],
  ["novolog", "insulin aspart"], ["levemir", "insulin detemir"], ["tresiba", "insulin degludec"],
  ["ozempic", "semaglutide"], ["rybelsus", "semaglutide"], ["wegovy", "semaglutide"],
  ["mounjaro", "tirzepatide"], ["trulicity", "dulaglutide"], ["victoza", "liraglutide"],
  ["januvia", "sitagliptin"], ["tradjenta", "linagliptin"], ["lasix", "furosemide"],
  ["aldactone", "spironolactone"], ["inspra", "eplerenone"], ["zestril", "lisinopril"],
  ["prinivil", "lisinopril"], ["norvasc", "amlodipine"], ["lipitor", "atorvastatin"],
  ["crestor", "rosuvastatin"], ["lopressor", "metoprolol"], ["toprol-xl", "metoprolol"],
  ["hyzaar", "losartan / hydrochlorothiazide"], ["entresto", "sacubitril / valsartan"],
  ["synjardy", "empagliflozin / metformin"], ["janumet", "sitagliptin / metformin"],
  ["xigduo", "dapagliflozin / metformin"],
]);
function ingredient(name: string): string | undefined {
  let n = name.toLowerCase().trim().replace(/[®™]/g, "");
  if (/^(?:unknown|unspecified|water pill|blood pressure pill|medication)(?:\b|$)/.test(n)) return;
  // Formulary names carry the strength after the ingredient. Match a unit so
  // numbers within an ingredient name (e.g. vitamin B12) are not truncated.
  n = n.replace(/\s+\d+(?:\.\d+)?(?:\s*[/+-]\s*\d+(?:\.\d+)?)*\s*(?:mg|mcg|g|units?|iu|ml|%)(?:\b|(?<=%)).*$/i, "");
  n = n.replace(/\s+(?:(?:oral|extended[- ]release|delayed[- ]release|film[- ]coated)\s+)*(?:tablets?|capsules?|injection|solution|suspension|pen|cream|ointment)(?:\b.*)?$/, "").trim();
  n = n.replace(/\s+(?:er|xr|xl|sr|cr|dr|extended[- ]release|delayed[- ]release)$/, "");
  const brand = brandIngredients.get(n);
  if (brand) return brand;
  // For mineral compounds the counterion is part of the ingredient's identity:
  // calcium acetate is not interchangeable with calcium carbonate.
  if (!/^(?:sodium|potassium|calcium|magnesium|ferrous|ferric|zinc|lithium)\b/.test(n)) {
    n = n.replace(/\s+(?:hydrochloride|hydrobromide|hcl|potassium|sodium|calcium|besylate|maleate|tartrate|succinate|fumarate|mesylate|acetate|phosphate|sulfate|carbonate|citrate)$/, "");
  }
  return n || undefined;
}

function ingredients(name: string): string[] {
  // Split named components, not the slash within a concentration or strength.
  const pieces = name.split(/\s*(?:\/(?!\s*(?:ml|dl|l|min)\b)(?=\s*[a-z])|\+|\band\b)\s*/i);
  const result = new Set<string>();
  for (const piece of pieces) {
    const normalized = ingredient(piece);
    if (normalized) for (const component of normalized.split(" / ")) result.add(component);
  }
  return [...result].sort(compare);
}

function stopReason(data: Data): MedicationRow["stop_reason"] {
  if (data.REASON_CODE === "ADR") return "adverse_reaction";
  if (data.REASON_CODE === "PT") return "patient_choice";
  const comment = str(data.COMMENT_TEXT) ?? "";
  if (/\b(?:ineffective|not working|not effective|no benefit|lack of efficacy)\b/i.test(comment)) return "ineffective";
  if (/\b(?:course|treatment|therapy)\s+(?:is\s+)?(?:complete|completed|finished)\b/i.test(comment)) return "course_complete";
  if (/\b(?:switched|switching|replaced)\s+(?:to|with|by)\b/i.test(comment)) return "therapy_changed";
  if (/\b(?:patient (?:declined|requested|refused)|at patient(?:'s)? request)\b/i.test(comment)) return "patient_choice";
  if (/\b(?:adverse reaction|side effects?)\b/i.test(comment)) return "adverse_reaction";
  return str(data.REASON_CODE) || comment ? "other" : undefined;
}

type MedicationState = { order: ContactEntry; history?: ContactEntry; status: MedicationRow["status"]; time: number; ingredient?: string; combination: boolean };
function medicationStates(entries: ContactEntry[]): MedicationState[] {
  const orders = new Map<string, ContactEntry>(), histories = new Map<string, ContactEntry>();
  for (const c of entries) {
    const e = c.entry, r = e.data, id = str(r.RX_ID);
    if (!id) continue;
    const k = scoped(e, id);
    if (r.type === "MED_ORDER") {
      const prev = orders.get(k);
      if (!prev || entryCompare(e, prev.entry) > 0) orders.set(k, c);
    } else if (r.type === "MED_STATUS_HIST") {
      const time = instant(r.CHANGED_AT);
      if (time === undefined || ![1, 2, 3, 9].includes(r.NEW_STATUS as number)) continue;
      const hist = { ...c, time }, prev = histories.get(k);
      if (!prev || contactCompare(hist, prev) > 0) histories.set(k, hist);
    }
  }
  const states: MedicationState[] = [];
  for (const [k, order] of orders) {
    const r = order.entry.data, name = str(r.DRUG_NAME), history = histories.get(k);
    if (!name || r.MED_STATUS === 9) continue;
    const status = history ? history.entry.data.NEW_STATUS : r.MED_STATUS;
    if (status !== 1 && status !== 2 && status !== 3) continue;
    const names = ingredients(name);
    for (const name of names.length ? names : [undefined]) states.push({ order, history, ingredient: name, combination: names.length > 1,
      status: status === 1 ? "active" : status === 2 ? "stopped" : "held", time: history?.time ?? order.time });
  }
  return states;
}

function medications(states: MedicationState[]): MedicationRow[] {
  const selected = new Map<string, MedicationState>();
  for (const s of states) {
    const r = s.order.entry.data;
    // The export has clinic prescriptions; IV administrations are not home medications.
    if (r.ROUTE !== "PO" && r.ROUTE !== "SC") continue;
    const k = s.ingredient ?? str(r.LV_DRUG_ID) ?? String(r.DRUG_NAME);
    const prev = selected.get(k);
    const event = s.history?.entry ?? s.order.entry;
    if (!prev || s.time > prev.time || (s.time === prev.time && entryCompare(event, prev.history?.entry ?? prev.order.entry) > 0)) selected.set(k, s);
  }
  const output: MedicationRow[] = [];
  for (const s of selected.values()) {
    const order = s.order.entry, hist = s.history?.entry, r = order.data;
    const row: MedicationRow = { drug_name: String(r.DRUG_NAME), status: s.status,
      patient_reported: false, evidence: evidence(order, hist) };
    if (s.ingredient) row.ingredient = s.ingredient;
    // RXNORM on MED_ORDER is a product CUI, never an ingredient CUI.
    const since = hist ? local(s.time).slice(0, 10) : s.status === "active" ? dateOnly(r.START_DATE) : undefined;
    if (since) row.status_since = since;
    // DOSE_QTY has no component linkage for combination products. Do not assign
    // the product's single amount to each constituent ingredient.
    if (!s.combination && finite(r.DOSE_QTY) && r.DOSE_QTY >= 0) {
      const u = r.DOSE_UNIT;
      if (u === "mg" || u === "mcg" || u === "mL" || u === "unit") row.dose = { value: r.DOSE_QTY, unit: u === "unit" ? "units" : u };
    }
    const f = str(r.FREQ_CODE);
    if (f) row.frequency = ["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(f) ? f as MedicationRow["frequency"] : "other";
    if (hist && (s.status === "held" || s.status === "stopped")) {
      const text = str(hist.data.COMMENT_TEXT);
      if (text) row.status_reason_text = text;
      if (s.status === "stopped") {
        const reason = stopReason(hist.data);
        if (reason) row.stop_reason = reason;
      }
    }
    output.push(row);
  }
  return output.sort((a, b) => compare(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name));
}

function adverseDx(r: Data): boolean {
  const code = (str(r.ICD10CM) ?? "").replace(/\./g, "").toUpperCase();
  const category = Number(code.slice(1, 3));
  return (code.startsWith("T") && category >= 36 && category <= 50 && code[5] === "5")
    || /\badverse (?:effect|reaction)\b/i.test(str(r.DX_TEXT) ?? "");
}

function ckdStage(code: string, text: string): ProblemRow["ckd_stage"] {
  const codes = new Map<string, ProblemRow["ckd_stage"]>([
    ["N18.1", "G1"], ["N18.2", "G2"], ["N18.31", "G3a"], ["N18.32", "G3b"], ["N18.4", "G4"], ["N18.5", "G5"],
  ]);
  const known = codes.get(code);
  if (known) return known;
  const match = /\b(?:stage\s*|G)(3a|3b|[1245])\b/i.exec(text);
  return match ? `G${match[1].toLowerCase()}` as ProblemRow["ckd_stage"] : undefined;
}

// Read only spans explicitly attached to this payload entry. Neither the entry
// id's spelling nor unlinked prose can identify a diagnosis or establish onset.
function refTexts(e: Entry): string[] {
  const note = str(e.item.data.narrative);
  if (!note) return [];
  const refs = /<ref\b([^>]*)>([\s\S]*?)<\/ref\s*>/gi;
  const texts: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = refs.exec(note))) {
    const id = /(?:^|\s)id\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(match[1]);
    if ((id?.[1] ?? id?.[2]) !== e.id) continue;
    const text = match[2].replace(/<[^>]*>/g, " ").replace(/[*_`]/g, "")
      .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
    if (text) texts.push(text);
  }
  return texts;
}

// History codes can name a broad category rather than the actual illness. The
// attached ref may supply that name, but H still establishes the historical
// status and ICD10CM remains exactly the code the source recorded. Ambiguous,
// negated, family-history and planning language do not replace the coded label.
function historyCondition(e: Entry): string | undefined {
  if (e.data.DX_STATUS !== "H" || !/^(?:personal\s+)?history\s+of\b/i.test(str(e.data.DX_TEXT) ?? "")) return;
  const candidates = new Map<string, string>();
  for (const ref of refTexts(e)) {
    if (/\b(?:no|not|denies?|denied|possible|possibly|suspected|suspect|risk|family|mother|father|sister|brother|ruled? out|rule out|negative for|concern for)\b/i.test(ref)) return;
    let text = ref.replace(/[.;:,\s]+$/, "");
    // Remove history framing, not clinical qualifiers such as "euglycemic".
    const prefix = /^(?:(?:the\s+)?(?:earlier|prior|previous|past|remote|resolved)\s+|(?:(?:personal|past medical)\s+)?history\s+of\s+|hx\s+of\s+)/i;
    while (prefix.test(text)) text = text.replace(prefix, "");
    text = text.replace(/\s+history$/i, "").replace(/\s+\(resolved\)$/i, "")
      .replace(/\s+since\s+\d{4}(?:-\d{2}(?:-\d{2})?)?$/i, "").trim();
    if (!text || /[;!?]|\b(?:reviewed|discussed|remains|continue|return|plan|will)\b/i.test(text)
      || /^(?:history|condition|illness|disease|problem|other|unspecified)(?:\b|$)/i.test(text)) return;
    // DKA is expanded only when explicitly named. Drug context qualifies the
    // illness; it does not create a separate adverse-reaction/allergy entry.
    const dka = /^(euglycemic\s+)?(?:DKA|diabetic ketoacidosis)(?:\s+(?:on|due to|associated with|from)\s+.+)?$/i.exec(text);
    if (dka) text = dka[1] ? "Euglycemic diabetic ketoacidosis" : "Diabetic ketoacidosis";
    else text = text[0].toUpperCase() + text.slice(1);
    candidates.set(text.toLowerCase(), text);
  }
  return candidates.size === 1 ? [...candidates.values()][0] : undefined;
}

function diagnosisCondition(e: Entry): string {
  return historyCondition(e) ?? String(e.data.DX_TEXT);
}

function conditionIdentity(e: Entry): string {
  const text = diagnosisCondition(e);
  // An explicit DKA history is the same illness as an earlier DKA diagnosis,
  // even when it is subsequently represented by a general history code. Do not
  // merge the patient's underlying diabetes or the drug's adverse-effect code.
  if (!adverseDx(e.data) && !/\b(?:no|without)\s+(?:diabetic\s+)?ketoacidosis\b/i.test(text)
    && (/\b(?:DKA|diabetic ketoacidosis)\b/i.test(text)
      || /\bdiabetes(?:\s+mellitus)?\b[^.;]*\bwith\s+ketoacidosis\b/i.test(text))) return "diabetic ketoacidosis";
  return text.toLowerCase().replace(/^(?:personal\s+)?history\s+of\s+/, "").replace(/[\s,]+/g, " ").trim();
}

// Only an explicit "since <date>" inside that diagnosis's ref is an onset.
function onset(e: Entry): ProblemRow["onset"] {
  for (const text of refTexts(e)) {
    const date = /\bsince\s+(\d{4}(?:-\d{2}(?:-\d{2})?)?)(?![\d-])/i.exec(text)?.[1];
    if (!date) continue;
    if (date.length === 10 && dateOnly(date)) return { value: date, precision: "day" };
    if (date.length === 7 && +date.slice(5) >= 1 && +date.slice(5) <= 12) return { value: date, precision: "month" };
    if (date.length === 4) return { value: date, precision: "year" };
  }
}

function diagnosisGroups(entries: ContactEntry[]): ContactEntry[][] {
  const dx = entries.filter(c => c.entry.data.type === "VISIT_DX" && str(c.entry.data.ICD10CM) && str(c.entry.data.DX_TEXT));
  // Same code is the source's problem-list identity. CKD stages are explicitly
  // restagings of one condition. Explicit condition names also permit re-coding.
  const aliases = new Map<string, string>();
  const root = (k: string): string => {
    while (aliases.has(k)) k = aliases.get(k)!;
    return k;
  };
  const seenText = new Map<string, string>();
  const codeKey = (c: ContactEntry): string => {
    const code = String(c.entry.data.ICD10CM).toUpperCase();
    return key(c.entry.item.issuer, /^N18(?:\.|$)/.test(code) ? "CKD" : code);
  };
  for (const c of dx) {
    const k = codeKey(c), textKey = key(c.entry.item.issuer, adverseDx(c.entry.data) ? "adverse" : "condition", conditionIdentity(c.entry));
    const other = seenText.get(textKey);
    if (other && root(other) !== root(k)) aliases.set(root(k), root(other));
    seenText.set(textKey, k);
  }
  const groups = new Map<string, ContactEntry[]>();
  for (const c of dx) {
    const k = root(codeKey(c)), group = groups.get(k) ?? [];
    group.push(c);
    groups.set(k, group);
  }
  return [...groups.values()];
}

function confirmed(group: ContactEntry[]): ContactEntry | undefined {
  let selected: ContactEntry | undefined;
  for (const c of group) {
    const status = c.entry.data.DX_STATUS;
    if (status === "R") selected = undefined;
    else if (status === "A" || status === "H") selected = c;
    // A provisional entry cannot establish a condition or undo a prior confirmation.
  }
  return selected;
}

function problems(groups: ContactEntry[][], visits: Entry[]): ProblemRow[] {
  const rows: ProblemRow[] = [];
  for (const group of groups) {
    const selected = confirmed(group);
    if (!selected || adverseDx(selected.entry.data)) continue;
    const e = selected.entry, r = e.data, code = String(r.ICD10CM);
    const used: Entry[] = [e];
    const row: ProblemRow = { condition: diagnosisCondition(e), icd10cm: code,
      status: r.DX_STATUS === "H" ? "resolved" : "active", evidence: [] };
    for (const c of group) {
      if (c.entry.data.DX_STATUS !== "A" && c.entry.data.DX_STATUS !== "H") continue;
      const start = onset(c.entry);
      if (start) {
        row.onset = start;
      }
    }
    if (row.onset) {
      const source = [...group].reverse().find(c => {
        const start = onset(c.entry);
        return (c.entry.data.DX_STATUS === "A" || c.entry.data.DX_STATUS === "H") && start?.value === row.onset?.value;
      });
      if (source) used.push(source.entry);
    }
    if (/^N18(?:\.|$)/i.test(code)) {
      const stages: { time: number; entry: Entry; value: NonNullable<ProblemRow["ckd_stage"]>; explicit: boolean }[] = [];
      for (const c of group) {
        if (c.entry.data.DX_STATUS !== "A" && c.entry.data.DX_STATUS !== "H") continue;
        const value = ckdStage(String(c.entry.data.ICD10CM), String(c.entry.data.DX_TEXT));
        if (value) stages.push({ time: c.time, entry: c.entry, value, explicit: false });
      }
      const albumin: { time: number; entry: Entry; value: NonNullable<ProblemRow["albuminuria"]> }[] = [];
      for (const visit of visits) {
        if (visit.item.issuer !== e.item.issuer) continue;
        const time = instant(visit.data.VISIT_AT)!;
        const g = visit.data.CKD_G, a = visit.data.CKD_A;
        if (typeof g === "string" && ["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(g)) stages.push({ time, entry: visit, value: g as NonNullable<ProblemRow["ckd_stage"]>, explicit: true });
        if (a === "A1" || a === "A2" || a === "A3") albumin.push({ time, entry: visit, value: a });
      }
      stages.sort((a, b) => a.time - b.time || a.entry.item.recorded - b.entry.item.recorded || Number(a.explicit) - Number(b.explicit) || entryCompare(a.entry, b.entry));
      albumin.sort((a, b) => a.time - b.time || entryCompare(a.entry, b.entry));
      const stage = stages.at(-1), a = albumin.at(-1);
      if (stage) { row.ckd_stage = stage.value; used.push(stage.entry); }
      if (a) { row.albuminuria = a.value; used.push(a.entry); }
    }
    row.evidence = evidence(...used);
    rows.push(row);
  }
  return rows.sort((a, b) => compare(a.icd10cm ?? a.condition, b.icd10cm ?? b.condition));
}

function allergies(groups: ContactEntry[][], states: MedicationState[]): AllergyIntoleranceRow[] {
  const rows = new Map<string, { time: number; row: AllergyIntoleranceRow }>();
  const add = (substance: string, reaction: string | undefined, time: number, used: Entry[], forceAdverse = false): void => {
    const text = reaction ?? "";
    const type: AllergyIntoleranceRow["type"] = forceAdverse ? "adverse_reaction"
      : /\b(?:hives|rash|angioedema|anaphylaxis|bronchospasm|urticaria)\b/i.test(text) ? "allergy"
      : /\b(?:cough|nausea|diarrhea|gi upset|gastrointestinal upset)\b/i.test(text) ? "intolerance" : "adverse_reaction";
    const criticality: AllergyIntoleranceRow["criticality"] = /\b(?:severe|life[- ]threatening|anaphylaxis|angioedema|ketoacidosis|lactic acidosis)\b/i.test(text) ? "high"
      : /\bmild\b/i.test(text) ? "low" : "unknown";
    const row: AllergyIntoleranceRow = { substance, type, criticality, evidence: evidence(...used) };
    if (reaction) row.reaction = reaction;
    const old = rows.get(substance);
    if (!old || time >= old.time) rows.set(substance, { time, row });
  };
  for (const group of groups) {
    const c = confirmed(group);
    if (!c || c.entry.data.DX_STATUS !== "A" || !adverseDx(c.entry.data)) continue;
    const text = String(c.entry.data.DX_TEXT);
    const named = /\badverse (?:effect|reaction)\s+(?:of|to)\s+(.+?)(?:,\s*(?:initial|subsequent|sequela)\b|$)/i.exec(text)?.[1];
    const substance = named && ingredient(named);
    if (substance) add(substance, text, c.time, [c.entry], true);
  }
  // A current explicit ADR status is structured evidence of a reaction to the
  // referenced prescription. LAB holds alone never imply an allergy/intolerance.
  for (const s of states) {
    if (s.status === "active" || !s.ingredient || s.history?.entry.data.REASON_CODE !== "ADR") continue;
    add(s.ingredient, str(s.history.entry.data.COMMENT_TEXT), s.time, [s.order.entry, s.history.entry]);
  }
  return [...rows.values()].map(x => x.row).sort((a, b) => compare(a.substance, b.substance));
}

function vitals(visits: Entry[], entries: ContactEntry[]): VitalRow[] {
  const selected = new Map<string, Entry>();
  for (const v of visits) {
    const id = str(v.data.VISIT_ID)!;
    const k = scoped(v, id), prev = selected.get(k);
    if (!prev || entryCompare(v, prev) > 0) selected.set(k, v);
  }
  const rows: VitalRow[] = [];
  for (const visit of selected.values()) {
    if (visit.data.VISIT_TYPE !== "NP" && visit.data.VISIT_TYPE !== "FU") continue;
    const readings = entries.filter(c => c.visit === visit && c.entry.data.type === "VITAL").map(c => c.entry).filter(e => {
      const r = e.data, n = r.READING_NO, code = r.VITAL_CODE;
      const unit = code === "BPS" || code === "BPD" ? "mmHg" : code === "HR" ? "/min" : code === "WT" ? "kg" : undefined;
      return unit !== undefined && unit === r.UNIT_CODE && finite(r.VALUE_NUM) && finite(n) && Number.isInteger(n) && n >= 1 && instant(r.TAKEN_AT) !== undefined;
    }).sort((a, b) => Number(a.data.READING_NO) - Number(b.data.READING_NO)
      || instant(a.data.TAKEN_AT)! - instant(b.data.TAKEN_AT)! || entryCompare(a, b));
    if (!readings.length) continue;
    const bp = readings.filter(e => e.data.VITAL_CODE === "BPS" || e.data.VITAL_CODE === "BPD");
    const firstNo = bp[0]?.data.READING_NO, lastNo = bp.at(-1)?.data.READING_NO;
    const first = bp.filter(e => e.data.READING_NO === firstNo);
    const firstTime = (first.length ? first : readings).reduce((time, e) => Math.min(time, instant(e.data.TAKEN_AT)!), Infinity);
    const row: VitalRow = { setting: "clinic", local_time: local(firstTime), evidence: [] };
    const used: Entry[] = [visit];
    const take = (code: string, readingNo?: unknown): Entry | undefined => readings.find(e => e.data.VITAL_CODE === code && (readingNo === undefined || e.data.READING_NO === readingNo));
    const assign = (field: "systolic_mmhg" | "diastolic_mmhg" | "repeat_systolic_mmhg" | "repeat_diastolic_mmhg" | "pulse_bpm" | "weight_kg", e?: Entry): void => {
      if (!e) return;
      const n = e.data.VALUE_NUM as number;
      row[field] = field === "weight_kg" ? Math.round(n * 10) / 10 : n;
      used.push(e);
    };
    if (firstNo !== undefined) {
      assign("systolic_mmhg", take("BPS", firstNo));
      assign("diastolic_mmhg", take("BPD", firstNo));
      // The target has one repeat slot: retain the last repeat when there are several.
      if (lastNo !== firstNo) {
        assign("repeat_systolic_mmhg", take("BPS", lastNo));
        assign("repeat_diastolic_mmhg", take("BPD", lastNo));
      }
    }
    assign("pulse_bpm", take("HR"));
    assign("weight_kg", take("WT"));
    row.evidence = evidence(...used);
    rows.push(row);
  }
  return rows.sort((a, b) => compare(a.local_time, b.local_time) || compare(JSON.stringify(a), JSON.stringify(b)));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!dateOnly(asOf)) return empty;
  const current = currentItems(items, asOf);
  const clinic = contacts(current);
  const states = medicationStates(clinic.rows), groups = diagnosisGroups(clinic.rows);
  return {
    medications: medications(states), problems: problems(groups, clinic.visits),
    allergies: allergies(groups, states), labs: labs(current), vitals: vitals(clinic.visits, clinic.rows),
  };
}
