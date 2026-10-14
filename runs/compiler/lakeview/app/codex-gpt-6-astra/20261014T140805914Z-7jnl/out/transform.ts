import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// Payloads are deliberately read as unknown: an unfamiliar or malformed entry is not clinical data.
type Data = Record<string, unknown>;
type Entry = { item: FolioItem; id: string; data: Data; recorded: number };
type Time = { instant: number; local: string };
const zone = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
const object = (x: unknown): x is Data => x !== null && typeof x === "object" && !Array.isArray(x);
const str = (x: unknown): string => typeof x === "string" ? x.trim() : "";
const num = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (...parts: string[]): string => JSON.stringify(parts);
function day(x: unknown): string | undefined {
  const s = str(x);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return;
  const t = Date.parse(s + "T12:00:00Z");
  if (Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === s) return s;
}
function localAt(instant: number): string {
  const parts = zone.formatToParts(new Date(instant));
  const get = (name: string) => parts.find(p => p.type === name)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}
function time(x: unknown): Time | undefined {
  const s = str(x);
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/.exec(s);
  if (!m || !day(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] ?? 0) > 59) return;
  const wall = `${m[1]}T${m[2]}:${m[3]}:${m[4] ?? "00"}${m[5] ?? ""}`;
  if (m[6]) {
    const instant = Date.parse(wall + m[6]);
    if (Number.isFinite(instant)) return { instant, local: localAt(instant) };
    return;
  }
  // Offset-free timestamps are Chicago wall clocks, never the runtime's local zone.
  const naive = Date.parse(wall + "Z");
  let instant = naive + 6 * 3600000;
  for (let i = 0; i < 3; i++) {
    const delta = naive - Date.parse(localAt(instant) + "Z");
    if (!delta) break;
    instant += delta;
  }
  return { instant, local: wall.slice(0, 19) };
}
function eventTime(e: Entry, field: string): number {
  return time(e.data[field])?.instant ?? e.recorded;
}
function compareEntry(a: Entry, b: Entry): number {
  return a.recorded - b.recorded || cmp(a.item.issuer, b.item.issuer) ||
    cmp(a.item.id, b.item.id) || cmp(a.id, b.id);
}
function evidence(...entries: (Entry | undefined)[]): Evidence {
  const result: Evidence = [];
  const seen = new Set<string>();
  for (const e of entries) if (e) {
    const k = key(e.item.id, e.id);
    if (!seen.has(k)) { seen.add(k); result.push({ item_id: e.item.id, entry_id: e.id }); }
  }
  return result;
}
function currentItems(input: FolioItem[], asOf: string): FolioItem[] {
  if (!Array.isArray(input)) return [];
  const scoped = input.filter((i): i is FolioItem => {
    if (!object(i) || !str(i.id) || !str(i.issuer)) return false;
    const t = time(i.recorded);
    return !!t && t.local.slice(0, 10) <= asOf;
  });
  const removed = new Set<string>();
  // Read edges from ALL in-scope items, including ones subsequently superseded/retracted.
  // Thus A <- B <- C never revives A, even if B is no longer current.
  for (const i of scoped) for (const list of [i.supersedes, i.retracts]) {
    if (Array.isArray(list)) for (const id of list) if (typeof id === "string") removed.add(key(i.issuer, id));
  }
  return scoped.filter(i => !removed.has(key(i.issuer, i.id))).sort((a, b) =>
    time(a.recorded)!.instant - time(b.recorded)!.instant || cmp(a.issuer, b.issuer) || cmp(a.id, b.id));
}
function entriesOf(items: FolioItem[]): Entry[] {
  const entries: Entry[] = [];
  for (const item of items) if (object(item.payload)) {
    for (const id of Object.keys(item.payload).sort(cmp)) {
      const data: unknown = item.payload[id];
      if (object(data) && str(data.type)) entries.push({ item, id, data, recorded: time(item.recorded)!.instant });
    }
  }
  return entries;
}
function index(entries: Entry[], type: string, field: string, local = false): Map<string, Entry> {
  const result = new Map<string, Entry>();
  for (const e of entries) if (e.data.type === type && str(e.data[field])) {
    const k = local ? key(e.item.issuer, e.item.id, str(e.data[field])) : key(e.item.issuer, str(e.data[field]));
    const old = result.get(k);
    if (!old || compareEntry(e, old) > 0) result.set(k, e);
  }
  return result;
}
function linked(e: Entry, index: Map<string, Entry>, field: string): Entry | undefined {
  return index.get(key(e.item.issuer, e.item.id, str(e.data[field])));
}
function scopedEvent(e: Entry, field: string, asOf: string): boolean {
  const t = time(e.data[field]);
  return !!t && t.local.slice(0, 10) <= asOf;
}

const tests: Record<string, { analyte: Analyte; sourceUnit: string; unit: string }> = {
  "LK-CREAT": { analyte: "creatinine", sourceUnit: "mg/dL", unit: "mg/dL" },
  "LK-EGFR09N": { analyte: "egfr", sourceUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2" },
  "LK-EGFR21": { analyte: "egfr", sourceUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2" },
  "LK-NA": { analyte: "sodium", sourceUnit: "mmol/L", unit: "mmol/L" },
  "LK-K": { analyte: "potassium", sourceUnit: "mmol/L", unit: "mmol/L" },
  "LK-GLU": { analyte: "glucose", sourceUnit: "mg/dL", unit: "mg/dL" },
  "LK-A1C": { analyte: "a1c", sourceUnit: "%", unit: "%" },
  "LK-UACR": { analyte: "uacr", sourceUnit: "mg/g", unit: "mg/g" },
  "LK-WBC": { analyte: "wbc", sourceUnit: "K/uL", unit: "10*3/uL" },
  "LK-HGB": { analyte: "hemoglobin", sourceUnit: "g/dL", unit: "g/dL" },
  "LK-PLT": { analyte: "platelets", sourceUnit: "K/uL", unit: "10*3/uL" },
  "LK-CHOL": { analyte: "cholesterol", sourceUnit: "mg/dL", unit: "mg/dL" },
  "LK-TRIG": { analyte: "triglycerides", sourceUnit: "mg/dL", unit: "mg/dL" },
  "LK-HDL": { analyte: "hdl", sourceUnit: "mg/dL", unit: "mg/dL" },
  "LK-LDLC": { analyte: "ldl", sourceUnit: "mg/dL", unit: "mg/dL" },
};
function printedValue(x: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const m = /^(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(str(x));
  if (!m) return;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return;
  const comparator = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1];
  return comparator ? { value, comparator: comparator as LabResultRow["comparator"] } : { value };
}
function equation(e: Entry): LabResultRow["egfr_equation"] {
  const note = str(e.data.COMMENT_TEXT);
  // Prefer a method statement over the code; the historical LOINC mapping is misleading.
  const methods = [...note.matchAll(/\b(?:CKD[\s‐‑–-]*EPI\s*[-:]?\s*(2009|2021)|MDRD)\b/gi)];
  if (methods.length) {
    const m = methods[0];
    return /MDRD/i.test(m[0]) ? "mdrd" : m[1] === "2021" ? "ckd-epi-2021" : "ckd-epi-2009";
  }
  return e.data.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : "ckd-epi-2009";
}
function labs(entries: Entry[], asOf: string): LabResultRow[] {
  const reqs = index(entries, "LAB_REQ", "REQ_ID", true);
  const orders = index(entries, "LAB_ORDER", "ORDER_ID", true);
  const results = new Map<string, Entry>();
  const rank = (e: Entry): number => ({ P: 1, F: 2, A: 3, C: 4, X: 4 }[str(e.data.RESULT_STATUS)] ?? 0);
  for (const e of entries) if (e.data.type === "LAB_RESULT" && str(e.data.RESULT_ID)) {
    const k = key(e.item.issuer, str(e.data.RESULT_ID));
    const old = results.get(k);
    if (!old || rank(e) > rank(old) || (rank(e) === rank(old) && compareEntry(e, old) > 0)) results.set(k, e);
  }
  const rows: LabResultRow[] = [];
  for (const e of results.values()) {
    const d = e.data;
    const code = str(d.TEST_CODE);
    const spec = Object.hasOwn(tests, code) ? tests[code] : undefined;
    if (!spec || !["P", "F", "A"].includes(str(d.RESULT_STATUS))) continue;
    const order = linked(e, orders, "ORDER_ID");
    if (!order || !num(order.data.ORDER_STATUS) || ![1, 2, 3, 4].includes(order.data.ORDER_STATUS)) continue;
    const req = linked(order, reqs, "REQ_ID");
    if (!req || !scopedEvent(req, "COLLECTED_AT", asOf) || !scopedEvent(e, "RESULTED_AT", asOf)) continue;
    if (d.UNIT_CODE !== spec.sourceUnit) continue;
    const value = printedValue(d.VALUE_TEXT);
    if (!value) continue;
    let collected = str(req.data.COLLECTED_AT);
    if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(collected)) collected = new Date(time(collected)!.instant).toISOString();
    const row: LabResultRow = {
      analyte: spec.analyte, ...value, unit: spec.unit, collected,
      status: d.RESULT_STATUS === "P" ? "preliminary" : "final", evidence: evidence(e, order, req),
    };
    if (spec.analyte === "egfr") row.egfr_equation = equation(e);
    if (str(d.LOINC)) row.loinc = str(d.LOINC);
    rows.push(row);
  }
  return rows.sort((a, b) => Date.parse(a.collected) - Date.parse(b.collected) || cmp(a.analyte, b.analyte) ||
    cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

// The formulary has no ingredient-level RxNorm field. Product CUIs are never copied to one.
const brands: Record<string, string> = {
  kerendia: "finerenone", jardiance: "empagliflozin", farxiga: "dapagliflozin", forxiga: "dapagliflozin",
  invokana: "canagliflozin", steglatro: "ertugliflozin", cozaar: "losartan", diovan: "valsartan",
  avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan", atacand: "candesartan",
  prinivil: "lisinopril", zestril: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  norvasc: "amlodipine", lasix: "furosemide", demadex: "torsemide", bumex: "bumetanide",
  aldactone: "spironolactone", inspra: "eplerenone", glucophage: "metformin", fortamet: "metformin",
  glumetza: "metformin", ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  humalog: "insulin lispro", novolog: "insulin aspart", novorapid: "insulin aspart",
  levemir: "insulin detemir", tresiba: "insulin degludec", januvia: "sitagliptin", tradjenta: "linagliptin",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", zetia: "ezetimibe",
  veltassa: "patiromer", lokelma: "sodium zirconium cyclosilicate", renvela: "sevelamer",
  renagel: "sevelamer", phoslo: "calcium acetate", rocaltrol: "calcitriol", sensipar: "cinacalcet",
};
function ingredient(name: string): string | undefined {
  let s = name.toLowerCase().trim();
  if (!s || /^(?:unknown|unspecified|water pill|blood pressure pill|medication)\b/.test(s)) return;
  for (const brand of Object.keys(brands)) if (new RegExp(`\\b${brand}\\b`).test(s)) return brands[brand];
  // Names are formulary names, normally an ingredient followed by strength and dosage form.
  s = s.replace(/\([^)]*\)/g, " ").replace(/\s+\d.*$/, "");
  s = s.replace(/\b(?:oral|subcutaneous|intravenous|extended[- ]release|delayed[- ]release|immediate[- ]release|tablet|capsule|solution|suspension|injection|pen|cream|ointment|patch|er|xr|sr|dr)\b.*$/, "");
  if (!/^ferrous\b/.test(s)) {
    s = s.replace(/\s+(?:hydrochloride|hcl|hydrobromide|besylate|besilate|maleate|tartrate|succinate|fumarate|mesylate|medoxomil|cilexetil)\b/g, "");
  }
  // Do not strip sodium/potassium from ingredients such as potassium chloride or sodium bicarbonate.
  s = s.replace(/^(losartan) potassium\b/, "$1").replace(/^(pravastatin|diclofenac|levothyroxine) sodium\b/, "$1")
    .replace(/^(atorvastatin|rosuvastatin) calcium\b/, "$1")
    .replace(/^(sevelamer) carbonate\b/, "$1").replace(/^(patiromer) sorbitex calcium\b/, "$1");
  s = s.replace(/\s+/g, " ").trim();
  return s || undefined;
}
function stopReason(reason: string, comment: string): MedicationRow["stop_reason"] {
  if (reason === "ADR") return "adverse_reaction";
  if (reason === "PT") return "patient_choice";
  if (/\b(?:ineffective|not (?:working|effective)|lack of (?:effect|benefit))\b/i.test(comment)) return "ineffective";
  if (/\b(?:replaced (?:by|with)|switched to|changed to)\b/i.test(comment)) return "therapy_changed";
  if (/\b(?:course|therapy|treatment) (?:complete[ds]?|finished)\b/i.test(comment)) return "course_complete";
  if (/\b(?:adverse reaction|side effect|intoleran(?:ce|t))\b/i.test(comment)) return "adverse_reaction";
  return reason || comment ? "other" : undefined;
}
function medications(entries: Entry[], visits: Map<string, Entry>, asOf: string): MedicationRow[] {
  const orders = index(entries, "MED_ORDER", "RX_ID");
  const histories = new Map<string, Entry[]>();
  for (const e of entries) if (e.data.type === "MED_STATUS_HIST" && str(e.data.RX_ID) &&
      num(e.data.NEW_STATUS) && [1, 2, 3, 9].includes(e.data.NEW_STATUS) &&
      scopedEvent(e, "CHANGED_AT", asOf) && linked(e, visits, "VISIT_ID")) {
    const k = key(e.item.issuer, str(e.data.RX_ID));
    const list = histories.get(k) ?? [];
    list.push(e); histories.set(k, list);
  }
  const latest = new Map<string, { row: MedicationRow; at: number; state: Entry }>();
  for (const [k, e] of orders) {
    const d = e.data;
    const visit = linked(e, visits, "VISIT_ID");
    if (!visit || !str(d.DRUG_NAME) || d.ROUTE === "IV") continue;
    const hist = (histories.get(k) ?? []).sort((a, b) => eventTime(a, "CHANGED_AT") - eventTime(b, "CHANGED_AT") || compareEntry(a, b));
    // A void prescription never existed and cannot displace another prescription of the same drug.
    if (d.MED_STATUS === 9 || hist.some(h => h.data.NEW_STATUS === 9)) continue;
    const h = hist[hist.length - 1];
    const state = h ?? e;
    const status = h ? h.data.NEW_STATUS : d.MED_STATUS;
    if (status !== 1 && status !== 2 && status !== 3) continue;
    const row: MedicationRow = {
      drug_name: str(d.DRUG_NAME), status: status === 1 ? "active" : status === 3 ? "held" : "stopped",
      patient_reported: false, evidence: evidence(e, h),
    };
    const ing = ingredient(row.drug_name);
    if (ing) row.ingredient = ing;
    const since = h ? time(h.data.CHANGED_AT)?.local.slice(0, 10) : status === 1 ? day(d.START_DATE) : undefined;
    if (since) row.status_since = since;
    if (num(d.DOSE_QTY) && ["mg", "mcg", "unit", "mL"].includes(str(d.DOSE_UNIT))) {
      row.dose = { value: d.DOSE_QTY, unit: d.DOSE_UNIT === "unit" ? "units" : d.DOSE_UNIT as "mg" | "mcg" | "mL" };
    }
    if (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(str(d.FREQ_CODE))) row.frequency = d.FREQ_CODE as MedicationRow["frequency"];
    if (h && status !== 1) {
      const comment = str(h.data.COMMENT_TEXT);
      if (comment) row.status_reason_text = comment;
      if (status === 2) {
        const reason = stopReason(str(h.data.REASON_CODE), comment);
        if (reason) row.stop_reason = reason;
      }
    }
    const at = h ? eventTime(h, "CHANGED_AT") : eventTime(visit, "VISIT_AT");
    const group = key(e.item.issuer, ing ?? (str(d.LV_DRUG_ID) || str(d.RX_ID)));
    const old = latest.get(group);
    if (!old || at > old.at || (at === old.at && compareEntry(state, old.state) > 0)) latest.set(group, { row, at, state });
  }
  return [...latest.values()].map(x => x.row).sort((a, b) => cmp(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name));
}

function vitals(entries: Entry[], visits: Map<string, Entry>, asOf: string): VitalRow[] {
  const groups = new Map<string, Entry[]>();
  for (const e of entries) if (e.data.type === "VITAL") {
    const d = e.data;
    const visit = linked(e, visits, "VISIT_ID");
    if (!visit || !["NP", "FU"].includes(str(visit.data.VISIT_TYPE)) || !num(d.VALUE_NUM) ||
        !num(d.READING_NO) || d.READING_NO < 1 || !Number.isInteger(d.READING_NO) || !scopedEvent(e, "TAKEN_AT", asOf)) continue;
    const unit = d.VITAL_CODE === "WT" ? "kg" : d.VITAL_CODE === "HR" ? "/min" :
      d.VITAL_CODE === "BPS" || d.VITAL_CODE === "BPD" ? "mmHg" : undefined;
    if (!unit || unit !== d.UNIT_CODE) continue;
    const k = key(e.item.issuer, str(d.VISIT_ID));
    const g = groups.get(k) ?? [];
    g.push(e); groups.set(k, g);
  }
  const rows: VitalRow[] = [];
  for (const group of groups.values()) {
    const dedup = new Map<string, Entry>();
    for (const e of group) {
      const k = key(str(e.data.VITAL_CODE), String(e.data.READING_NO));
      const old = dedup.get(k);
      if (!old || compareEntry(e, old) > 0) dedup.set(k, e);
    }
    const measurements = [...dedup.values()].sort((a, b) => eventTime(a, "TAKEN_AT") - eventTime(b, "TAKEN_AT") || compareEntry(a, b));
    const bp = measurements.filter(e => e.data.VITAL_CODE === "BPS" || e.data.VITAL_CODE === "BPD");
    const readingNumbers = [...new Set(bp.map(e => e.data.READING_NO as number))].sort((a, b) => a - b);
    const first = readingNumbers[0];
    // The view has room for one repeat: retain the last repeat, linked by READING_NO.
    const repeat = readingNumbers.length > 1 ? readingNumbers[readingNumbers.length - 1] : undefined;
    const selected: Entry[] = [];
    const row: VitalRow = { setting: "clinic", local_time: time((bp[0] ?? measurements[0]).data.TAKEN_AT)!.local.slice(0, 16), evidence: [] };
    for (const [code, field, reading] of [
      ["BPS", "systolic_mmhg", first], ["BPD", "diastolic_mmhg", first],
      ["BPS", "repeat_systolic_mmhg", repeat], ["BPD", "repeat_diastolic_mmhg", repeat],
    ] as const) {
      const e = reading === undefined ? undefined : bp.find(e => e.data.VITAL_CODE === code && e.data.READING_NO === reading);
      if (e) { row[field] = e.data.VALUE_NUM as number; selected.push(e); }
    }
    const hr = measurements.find(e => e.data.VITAL_CODE === "HR");
    const wt = measurements.find(e => e.data.VITAL_CODE === "WT");
    if (hr) { row.pulse_bpm = hr.data.VALUE_NUM as number; selected.push(hr); }
    if (wt) { row.weight_kg = Math.round((wt.data.VALUE_NUM as number) * 10) / 10; selected.push(wt); }
    row.evidence = evidence(...selected);
    if (row.evidence.length) rows.push(row);
  }
  return rows.sort((a, b) => cmp(a.local_time, b.local_time) || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

function refText(e: Entry): string {
  if (typeof e.item.narrative !== "string") return "";
  const texts: string[] = [];
  for (const m of e.item.narrative.matchAll(/<ref\s+id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/ref>/g)) {
    if (m[1] === e.id) texts.push(m[2].replace(/<[^>]+>/g, ""));
  }
  return texts.join("; ");
}
function onset(e: Entry): ProblemRow["onset"] {
  // Narrative can qualify an existing diagnosis, but never creates one. Do not use first visit as onset.
  const m = /\b(?:since|diagnosed(?:\s+in)?|onset(?:\s+in)?)\s+(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}|\d{1,2}\/\d{4}|\d{4})\b/i.exec(str(e.data.DX_TEXT) + "; " + refText(e));
  if (!m) return;
  let value = m[1];
  if (/^\d{1,2}\/\d{4}$/.test(value)) {
    const [month, year] = value.split("/");
    value = `${year}-${month.padStart(2, "0")}`;
  }
  if (value.length === 10 && !day(value)) return;
  if (value.length === 7 && (+value.slice(5) < 1 || +value.slice(5) > 12)) return;
  return { value, precision: value.length === 4 ? "year" : value.length === 7 ? "month" : "day" };
}
function sensitivity(code: string, name: string): Sensitivity[] | undefined {
  const categories: Sensitivity[] = [];
  if (/^F1\d/.test(code) || /\b(?:alcohol|opioid|substance|cannabis|cocaine) (?:use disorder|dependence|abuse)\b/i.test(name)) categories.push("substance-use");
  else if (/^F\d/.test(code)) categories.push("mental-health");
  if (/^(?:B20|Z21|A5\d|A6\d)/.test(code) || /\b(?:HIV|human immunodeficiency|syphilis|gonorrhea|chlamydia)\b/i.test(name)) categories.push("hiv-sti");
  if (/^(?:O\d|Z3[2-9]|Z30)/.test(code)) categories.push("sexual-reproductive-health");
  if (/\b(?:genetic|hereditary|autosomal|polycystic kidney disease|Alport)\b/i.test(name)) categories.push("genetic");
  return categories.length ? categories : undefined;
}
function isCKD(e: Entry): boolean {
  return /^N18(?:\.|$)/i.test(str(e.data.ICD10CM)) || /^(?:chronic kidney disease|CKD)\b/i.test(str(e.data.DX_TEXT));
}
function conditionKey(e: Entry): string {
  const code = str(e.data.ICD10CM).toUpperCase();
  if (isCKD(e)) return "ckd";
  if (/^(?:I10|I12(?:\.|$))/.test(code)) return "hypertension";
  // Preserve distinct complications (e.g. ketoacidosis) rather than folding every diabetes code together.
  if (/^E11\.(?:9|21|22)$/.test(code)) return "type-2-diabetes";
  if (/^E10\.(?:9|21|22)$/.test(code)) return "type-1-diabetes";
  return code || str(e.data.DX_TEXT).toLowerCase();
}
function codeStage(e: Entry): ProblemRow["ckd_stage"] {
  const stages: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  const code = str(e.data.ICD10CM).toUpperCase();
  if (Object.hasOwn(stages, code)) return stages[code];
  const m = /\b(?:stage\s*|G)(1|2|3a|3b|4|5)\b/i.exec(str(e.data.DX_TEXT));
  return m ? `G${m[1].toLowerCase()}` as ProblemRow["ckd_stage"] : undefined;
}

// Recognize explicit drug attribution in structured diagnosis text. A lab-related medication hold
// by itself is not an allergy, and a drug product's RxNorm CUI is not an ingredient CUI.
const drugClasses: { pattern: RegExp; members: RegExp }[] = [
  { pattern: /\bSGLT[- ]?2(?: inhibitor)?s?\b/i, members: /\b(?:empagliflozin|dapagliflozin|canagliflozin|ertugliflozin|bexagliflozin|sotagliflozin)\b/ },
  { pattern: /\b(?:ACE[- ]?inhibitors?|angiotensin[- ]converting[- ]enzyme inhibitors?)\b/i, members: /\b(?:lisinopril|enalapril|ramipril|benazepril|captopril|fosinopril|quinapril|perindopril|trandolapril|moexipril)\b/ },
  { pattern: /\b(?:ARBs?|angiotensin(?: II)? receptor blockers?)\b/i, members: /\b(?:losartan|valsartan|irbesartan|olmesartan|telmisartan|candesartan|azilsartan|eprosartan)\b/ },
  { pattern: /\bstatins?\b/i, members: /\b(?:atorvastatin|rosuvastatin|simvastatin|pravastatin|lovastatin|fluvastatin|pitavastatin)\b/ },
  { pattern: /\b(?:NSAIDs?|nonsteroidal anti-inflammatory drugs?)\b/i, members: /\b(?:ibuprofen|naproxen|diclofenac|indomethacin|meloxicam|celecoxib|ketorolac)\b/ },
];
function reactionDetails(text: string, substance: string): Pick<AllergyIntoleranceRow, "reaction_type" | "mechanism" | "criticality"> | undefined {
  const hypersensitive = /\b(?:hives|urticaria|rash|angioedema|anaphylaxis|anaphylactic|bronchospasm)\b/i.test(text);
  const serious = /\b(?:ketoacidosis|lactic acidosis|(?:severe|life-threatening) hyperkalemia|pancreatitis|agranulocytosis|acute kidney (?:injury|failure)|Stevens.Johnson|toxic epidermal necrolysis)\b/i.test(text);
  const side = /\b(?:cough|GI upset|gastrointestinal upset|nausea|vomiting|diarrhea|myalgia|muscle aches|edema|dizziness)\b/i.test(text);
  if (!hypersensitive && !serious && !side) return;
  const ace = drugClasses[1].pattern.test(substance) || drugClasses[1].members.test(substance);
  const immune = /\b(?:IgE|T.cell|immune.mediated|allergy test positive)\b/i.test(text) && !/non[- ]immune/i.test(text);
  return {
    reaction_type: hypersensitive ? "hypersensitivity" : serious ? "serious_adverse_event" : "side_effect",
    mechanism: /non[- ]immune|bradykinin/i.test(text) || ace && /cough|angioedema/i.test(text) || /ketoacidosis|lactic acidosis/i.test(text)
      ? "non_immune" : immune ? "immune" : "unknown",
    criticality: serious || /anaphyl|angioedema|bronchospasm|\bsevere\b|life-threatening/i.test(text) ? "high" : side || /\bmild\b/i.test(text) ? "low" : "unknown",
  };
}
function attributedDrug(e: Entry, entries: Entry[]): { substance: string; meds: Entry[] } | undefined {
  const text = str(e.data.DX_TEXT);
  if (!/adverse (?:effect|reaction)|(?:associated|induced|related)|due to|caused by|secondary to/i.test(text)) return;
  const before = /^(.+?)[- ](?:associated|induced|related)\b/i.exec(text);
  const after = /\b(?:due to|caused by|induced by|secondary to|adverse (?:effect|reaction) (?:of|to))\s+(.+?)(?:[,;:]|$)/i.exec(text);
  const cause = str(before?.[1] ?? after?.[1]);
  if (/\b(?:missed|lack of|withdrawal of|nonadherence|noncompliance)\b/i.test(cause)) return;
  const localMeds = entries.filter(m => m.item === e.item && m.data.type === "MED_ORDER" && m.data.MED_STATUS !== 9);
  // A specifically named drug takes priority even if the diagnosis also names its class.
  let named = localMeds.filter(m => {
    const ing = ingredient(str(m.data.DRUG_NAME));
    return !!ing && text.toLowerCase().includes(ing);
  });
  const namedCause = named.filter(m => cause.toLowerCase().includes(ingredient(str(m.data.DRUG_NAME))!));
  if (namedCause.length) named = namedCause;
  const namedIngredients = [...new Set(named.map(m => ingredient(str(m.data.DRUG_NAME))!))];
  if (namedIngredients.length === 1) return { substance: namedIngredients[0], meds: named };
  // Also recognize an explicit generic ingredient absent from this contact's medication list.
  const names = [...new Set([...Object.keys(brands), ...Object.values(brands)])];
  for (const wording of [cause, text]) {
    const matches = [...new Set(names.filter(name => new RegExp(`\\b${name}\\b`, "i").test(wording)).map(name => brands[name] ?? name))];
    if (matches.length === 1) return { substance: matches[0], meds: [] };
  }
  for (const drugClass of drugClasses) {
    const match = drugClass.pattern.exec(text);
    if (!match) continue;
    const matches = localMeds.filter(m => drugClass.members.test(ingredient(str(m.data.DRUG_NAME)) ?? ""));
    const ingredients = [...new Set(matches.map(m => ingredient(str(m.data.DRUG_NAME))!))];
    return ingredients.length === 1 ? { substance: ingredients[0], meds: matches } : { substance: match[0], meds: [] };
  }
  let name = cause;
  name = name.replace(/^(?:history of|drug[- ]induced)\s+/i, "").replace(/\s+(?:causing|with|resulting in)\b.*$/i, "");
  if (!name || /^(?:drug|medication|diabetes|hypertension|unknown|unspecified|missed|lack of|withdrawal of)\b/i.test(name)) return;
  const ing = ingredient(name);
  return ing ? { substance: ing, meds: [] } : undefined;
}
function diagnoses(entries: Entry[], visits: Map<string, Entry>, asOf: string): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const dx = entries.filter(e => e.data.type === "VISIT_DX" && str(e.data.DX_TEXT) && str(e.data.ICD10CM) &&
    ["A", "P", "R", "H"].includes(str(e.data.DX_STATUS)) && !!linked(e, visits, "VISIT_ID"));
  const at = (e: Entry) => eventTime(linked(e, visits, "VISIT_ID")!, "VISIT_AT");
  const chronological = (a: Entry, b: Entry) => at(a) - at(b) || compareEntry(a, b);
  const groups = new Map<string, Entry[]>();
  for (const e of dx) {
    const k = key(e.item.issuer, conditionKey(e));
    const g = groups.get(k) ?? []; g.push(e); groups.set(k, g);
  }
  const problems: ProblemRow[] = [];
  const allergyCandidates: { row: AllergyIntoleranceRow; at: number; e: Entry }[] = [];
  for (const group of groups.values()) {
    group.sort(chronological);
    // Resolve the source's list per ICD code before merging restagings. Ruling out the old
    // stage's code must not erase a separately confirmed new stage in the same contact.
    const byCode = new Map<string, Entry[]>();
    for (const entry of group) {
      const code = str(entry.data.ICD10CM).toUpperCase();
      const history = byCode.get(code) ?? [];
      history.push(entry); byCode.set(code, history);
    }
    const confirmed: { e: Entry; latest: Entry }[] = [];
    for (const history of byCode.values()) {
      const latest = history[history.length - 1];
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].data.DX_STATUS === "R") break;
        if (["A", "H"].includes(str(history[i].data.DX_STATUS))) {
          confirmed.push({ e: history[i], latest }); break;
        }
      }
    }
    confirmed.sort((a, b) => at(a.e) - at(b.e) ||
      Number(a.e.data.DX_STATUS === "A") - Number(b.e.data.DX_STATUS === "A") ||
      compareEntry(a.e, b.e));
    const chosen = confirmed[confirmed.length - 1];
    if (!chosen) continue; // Never-confirmed working diagnoses are not problems.
    const { e, latest } = chosen;
    const d = e.data;
    const code = str(d.ICD10CM);
    const condition = str(d.DX_TEXT);
    const refs: Entry[] = [e];
    if (e !== latest) refs.push(latest);
    const row: ProblemRow = { condition, icd10cm: code, status: d.DX_STATUS === "H" ? "resolved" : "active", evidence: [] };
    const sens = sensitivity(code, condition);
    if (sens) row.sensitivity = sens;
    // Preserve a dated onset already explicitly supplied for the same condition.
    for (const older of [...group].reverse()) if (["A", "H"].includes(str(older.data.DX_STATUS))) {
      const start = onset(older);
      if (start) { row.onset = start; refs.push(older); break; }
    }
    if (isCKD(e)) {
      const stages: { value: NonNullable<ProblemRow["ckd_stage"]>; e: Entry; at: number; priority: number }[] = [];
      const albums: { value: NonNullable<ProblemRow["albuminuria"]>; e: Entry; at: number }[] = [];
      for (const { e: entry } of confirmed) {
        const stage = codeStage(entry);
        if (stage) stages.push({ value: stage, e: entry, at: at(entry), priority: 0 });
      }
      for (const visit of visits.values()) if (visit.item.issuer === e.item.issuer && scopedEvent(visit, "VISIT_AT", asOf)) {
        if (["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(str(visit.data.CKD_G))) {
          stages.push({ value: visit.data.CKD_G as NonNullable<ProblemRow["ckd_stage"]>, e: visit, at: eventTime(visit, "VISIT_AT"), priority: 1 });
        }
        if (["A1", "A2", "A3"].includes(str(visit.data.CKD_A))) {
          albums.push({ value: visit.data.CKD_A as NonNullable<ProblemRow["albuminuria"]>, e: visit, at: eventTime(visit, "VISIT_AT") });
        }
      }
      stages.sort((a, b) => a.at - b.at || a.priority - b.priority || compareEntry(a.e, b.e));
      albums.sort((a, b) => a.at - b.at || compareEntry(a.e, b.e));
      const stage = stages[stages.length - 1]; const album = albums[albums.length - 1];
      if (stage) { row.ckd_stage = stage.value; refs.push(stage.e); }
      if (album) { row.albuminuria = album.value; refs.push(album.e); }
    }
    const attribution = attributedDrug(e, entries);
    let reaction = condition;
    const adverseCodeOnly = /^T(?:3[6-9]|[45]\d)/i.test(code) && /^adverse (?:effect|reaction)/i.test(condition) &&
      !reactionDetails(condition, attribution?.substance ?? "");
    if (attribution) {
      const allergyRefs: Entry[] = [e, ...attribution.meds];
      if (adverseCodeOnly) {
        const reactions = dx.filter(other => other.item === e!.item && other !== e && ["A", "H"].includes(str(other.data.DX_STATUS)) &&
          reactionDetails(str(other.data.DX_TEXT), attribution.substance));
        if (reactions.length === 1) { reaction = str(reactions[0].data.DX_TEXT); allergyRefs.push(reactions[0]); }
      }
      const details = reactionDetails(reaction, attribution.substance);
      if (details) {
        const allergy: AllergyIntoleranceRow = { substance: attribution.substance, ...details, reaction, evidence: evidence(...allergyRefs) };
        if (row.onset) { allergy.onset = row.onset; allergy.evidence = evidence(...allergyRefs, ...refs); }
        if (sens) allergy.sensitivity = sens;
        allergyCandidates.push({ row: allergy, at: at(e), e });
      }
    }
    row.evidence = evidence(...refs);
    if (!adverseCodeOnly) problems.push(row);
  }
  const bySubstance = new Map<string, { row: AllergyIntoleranceRow; at: number; e: Entry }>();
  for (const candidate of allergyCandidates.sort((a, b) => a.at - b.at || compareEntry(a.e, b.e))) {
    const k = candidate.row.substance.toLowerCase();
    const old = bySubstance.get(k);
    if (old) {
      const reactions = [...new Set([...(old.row.reaction ?? "").split("; "), candidate.row.reaction ?? ""].filter(Boolean))];
      candidate.row.reaction = reactions.join("; ");
      candidate.row.evidence = [...old.row.evidence, ...candidate.row.evidence].filter((v, i, all) =>
        all.findIndex(o => o.item_id === v.item_id && o.entry_id === v.entry_id) === i);
      if (old.row.criticality === "high") candidate.row.criticality = "high";
    }
    bySubstance.set(k, candidate);
  }
  return {
    problems: problems.sort((a, b) => cmp(a.icd10cm ?? a.condition, b.icd10cm ?? b.condition)),
    allergies: [...bySubstance.values()].map(x => x.row).sort((a, b) => cmp(a.substance, b.substance)),
  };
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!day(asOf)) return empty;
  const entries = entriesOf(currentItems(items, asOf));
  const visits = index(entries.filter(e => e.data.type !== "CLINIC_VISIT" || scopedEvent(e, "VISIT_AT", asOf)), "CLINIC_VISIT", "VISIT_ID", true);
  const clinical = diagnoses(entries, visits, asOf);
  return {
    medications: medications(entries, visits, asOf), ...clinical,
    labs: labs(entries, asOf), vitals: vitals(entries, visits, asOf),
  };
}
