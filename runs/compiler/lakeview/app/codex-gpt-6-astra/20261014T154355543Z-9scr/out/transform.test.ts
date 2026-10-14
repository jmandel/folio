import { describe, expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const date = "2025-01-01T10:00:00-06:00";
function item(id: string, payload: Record<string, any>, recorded = date, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "lakeview", patient: "p", effective: recorded, recorded, narrative: "", payload, ...extra };
}
function lab(id: string, code = "LK-K", value = "5.1", unit = "mmol/L", changes: Record<string, any> = {}): FolioItem {
  return item(id, {
    req: { type: "LAB_REQ", REQ_ID: `q-${id}`, COLLECTED_AT: date },
    order: { type: "LAB_ORDER", ORDER_ID: `o-${id}`, REQ_ID: `q-${id}`, ORDER_STATUS: 4, SPECIMEN_COND: "OK" },
    result: { type: "LAB_RESULT", RESULT_ID: `r-${id}`, ORDER_ID: `o-${id}`, TEST_CODE: code, VALUE_TEXT: value,
      VALUE_NUM: 9999999, UNIT_CODE: unit, RESULT_STATUS: "F", RESULTED_AT: date, ...changes },
  });
}
function clinic(id: string, payload: Record<string, any> = {}, at = date, visit: Record<string, any> = {}): FolioItem {
  return item(id, { visit: { type: "CLINIC_VISIT", VISIT_ID: id, VISIT_TYPE: "FU", VISIT_AT: at, ...visit },
    ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, { VISIT_ID: id, ...v }])) }, at);
}
function med(rx = "rx", overrides: Record<string, any> = {}): Record<string, any> {
  return { type: "MED_ORDER", RX_ID: rx, LV_DRUG_ID: "drug", DRUG_NAME: "finerenone 10 mg tablet", MED_STATUS: 1,
    START_DATE: "2025-01-01", DOSE_QTY: 10, DOSE_UNIT: "mg", FREQ_CODE: "QD", ROUTE: "PO", ...overrides };
}
function hist(status: number, at: string, overrides: Record<string, any> = {}): Record<string, any> {
  return { type: "MED_STATUS_HIST", HIST_ID: `h-${at}`, RX_ID: "rx", OLD_STATUS: 1, NEW_STATUS: status,
    CHANGED_AT: at, REASON_CODE: "LAB", ...overrides };
}
function dx(code: string, text: string, status = "A"): Record<string, any> {
  return { type: "VISIT_DX", ICD10CM: code, DX_TEXT: text, DX_STATUS: status, DX_RANK: 1 };
}
const run = (items: FolioItem[], asOf = "2026-10-13") => transform(items, asOf);

describe("item visibility and time", () => {
  test("Chicago end-of-day boundary and local timestamps", () => {
    const a = lab("a"), b = lab("b"), c = lab("c"), d = lab("d");
    a.recorded = "2025-01-02T05:59:59.999Z";
    b.recorded = "2025-01-02T06:00:00Z";
    c.recorded = "2025-01-01T23:59:59.999";
    d.recorded = "2025-01-02T00:00:00";
    expect(run([a, b, c, d], "2025-01-01").labs).toHaveLength(2);
    a.recorded = "2025-07-02T04:59:59.999Z";
    b.recorded = "2025-07-02T05:00:00Z";
    expect(run([a, b], "2025-07-01").labs).toHaveLength(1);
  });
  test("supersessions and retractions are transitive and do not resurrect history", () => {
    const a = lab("a"), b = lab("b"), c = lab("c");
    b.recorded = "2025-01-02T10:00:00-06:00"; b.supersedes = ["a"];
    c.recorded = "2025-01-03T10:00:00-06:00"; c.supersedes = ["b"];
    const r = item("retract", {}, "2025-01-04T10:00:00-06:00", { retracts: ["c"] });
    expect(run([r, c, a, b], "2025-01-01").labs[0].evidence.some(e => e.item_id === "a")).toBe(true);
    expect(run([r, c, a, b], "2025-01-02").labs[0].evidence.some(e => e.item_id === "b")).toBe(true);
    expect(run([r, c, a, b], "2025-01-03").labs).toHaveLength(1);
    expect(run([r, c, a, b], "2025-01-04").labs).toHaveLength(0);
  });
  test("clinical time does not determine publication visibility", () => {
    const a = lab("a"); a.effective = "2020-01-01"; a.recorded = "2025-02-01T00:00:00";
    expect(run([a], "2025-01-31").labs).toHaveLength(0);
    expect(run([a], "2025-02-01").labs).toHaveLength(1);
  });
  test("collection times gain the correct offset without moving wall time", () => {
    const a = lab("a"), b = lab("b");
    a.payload.req.COLLECTED_AT = "2025-01-01T08:30";
    b.payload.req.COLLECTED_AT = "2025-07-01T08:30:15";
    expect(run([a, b]).labs.map(l => l.collected)).toEqual(["2025-01-01T08:30:00-06:00", "2025-07-01T08:30:15-05:00"]);
  });
});

describe("lab semantics", () => {
  test("result and order statuses are independent", () => {
    const data = ["P", "F", "A", "C", "X"].map(s => lab(s, "LK-K", "5.2", "mmol/L", { RESULT_STATUS: s }));
    const voided = lab("void"); voided.payload.order.ORDER_STATUS = 9;
    const cancelled = lab("cancelled"); cancelled.payload.order.ORDER_STATUS = 5;
    const rows = run([...data, voided, cancelled]).labs;
    expect(rows).toHaveLength(3);
    expect(rows.filter(l => l.status === "preliminary")).toHaveLength(1);
  });
  test("VALUE_TEXT is authoritative, preserving comparator and no numeric fallback", () => {
    const a = lab("a", "LK-EGFR21", ">90", "mL/min/1.73m2");
    const b = lab("b", "LK-K", "< 0.1");
    const c = lab("c", "LK-K", "See comment");
    const rows = run([a, b, c]).labs;
    expect(rows).toHaveLength(2);
    expect(rows.find(l => l.analyte === "egfr")).toMatchObject({ value: 90, comparator: ">", egfr_equation: "ckd-epi-2021" });
    expect(rows.find(l => l.analyte === "potassium")).toMatchObject({ value: 0.1, comparator: "<" });
    expect(rows.every(l => l.loinc === undefined)).toBe(true);
  });
  test("2009 equation comes from the lab, despite its MDRD LOINC", () => {
    const n = lab("n", "LK-EGFR09N", "61", "mL/min/1.73m2", { LOINC: "48642-3", COMMENT_TEXT: "Calculated by CKD-EPI 2009." });
    const a = lab("a", "LK-EGFR09A", "70", "mL/min/1.73m2");
    expect(run([n, a]).labs).toHaveLength(1);
    expect(run([n, a]).labs[0]).toMatchObject({ value: 61, loinc: "48642-3", egfr_equation: "ckd-epi-2009" });
  });
  test("CBC count units and lipid components are mapped without recomputation", () => {
    const definitions = [
      ["LK-PLT", "212", "K/uL", "platelets", "10*3/uL"],
      ["LK-WBC", "6.4", "K/uL", "wbc", "10*3/uL"],
      ["LK-HGB", "12.7", "g/dL", "hemoglobin", "g/dL"],
      ["LK-CHOL", "210", "mg/dL", "cholesterol", "mg/dL"],
      ["LK-TRIG", "390", "mg/dL", "triglycerides", "mg/dL"],
      ["LK-HDL", "35", "mg/dL", "hdl", "mg/dL"],
      ["LK-LDLC", "97", "mg/dL", "ldl", "mg/dL"],
      ["LK-UACR", "790", "mg/g", "uacr", "mg/g"],
    ];
    const rows = run(definitions.map(([c, v, u]) => lab(c, c, v, u))).labs;
    for (const [c, v, u, analyte, unit] of definitions) expect(rows.find(r => r.analyte === analyte)).toMatchObject({ value: +v, unit });
  });
  test("confirmation repeats and hemolyzed but valid results remain separate", () => {
    const a = lab("a"), b = lab("b");
    a.payload.order.SPECIMEN_COND = "HEM";
    b.payload.order.REPEAT_OF_ORDER_ID = a.payload.order.ORDER_ID; b.payload.order.REPEAT_REASON = "CONF";
    expect(run([a, b]).labs).toHaveLength(2);
    a.payload.result.RESULT_STATUS = "C";
    expect(run([a, b]).labs).toHaveLength(1);
  });
  test("copies use advanced status and retain evidence; retracted results disappear", () => {
    const p = lab("p", "LK-K", "5.0", "mmol/L", { RESULT_STATUS: "P" });
    const f = structuredClone(p); f.id = "f"; f.payload.result.RESULT_STATUS = "F"; f.payload.result.VALUE_TEXT = "5.1";
    const rows = run([f, p]).labs;
    expect(rows).toHaveLength(1); expect(rows[0]).toMatchObject({ value: 5.1, status: "final" });
    expect(new Set(rows[0].evidence.map(e => e.item_id)).size).toBe(2);
    const c = structuredClone(f); c.id = "c"; c.payload.result.RESULT_STATUS = "C";
    expect(run([p, f, c]).labs).toHaveLength(0);
  });
});

describe("medication state", () => {
  test("a hold persists beyond its review date; a resume must be explicit", () => {
    const start = clinic("start", { rx: med() });
    const hold = clinic("hold", { history: hist(3, "2025-02-01T16:00:00-06:00", { REVIEW_DATE: "2025-02-10", COMMENT_TEXT: "Hold for K" }) }, "2025-02-01T17:00:00-06:00");
    expect(run([hold, start]).medications[0]).toMatchObject({ ingredient: "finerenone", status: "held", status_since: "2025-02-01", status_reason_text: "Hold for K", dose: { value: 10, unit: "mg" } });
    const resume = clinic("resume", { history: hist(1, "2025-03-01T12:00:00-06:00") }, "2025-03-01T13:00:00-06:00");
    expect(run([resume, hold, start]).medications[0]).toMatchObject({ status: "active", status_since: "2025-03-01" });
    expect(run([resume, hold, start], "2025-02-20").medications[0].status).toBe("held");
  });
  test("latest event on an older prescription can win across same-ingredient orders", () => {
    const start = clinic("start", { rx: med() });
    const newer = clinic("new", { rx: med("new-rx", { START_DATE: "2025-02-01", DOSE_QTY: 20, DRUG_NAME: "finerenone 20 mg tablet" }) }, "2025-02-01T10:00:00-06:00");
    const hold = clinic("hold", { history: hist(3, "2025-03-01T12:00:00-06:00") }, "2025-03-01T13:00:00-06:00");
    expect(run([newer, hold, start]).medications).toHaveLength(1);
    expect(run([newer, hold, start]).medications[0]).toMatchObject({ status: "held", dose: { value: 10, unit: "mg" } });
  });
  test("void prescription never existed and an orphan history creates no medicine", () => {
    const start = clinic("start", { rx: med() });
    const change = clinic("void", { history: hist(9, "2025-03-01T12:00:00-06:00", { REASON_CODE: "ERR" }) }, "2025-03-01T13:00:00-06:00");
    expect(run([start, change]).medications).toHaveLength(0);
    expect(run([change]).medications).toHaveLength(0);
  });
  test("stopped rows keep dose and coded reason without implying an allergy", () => {
    const a = clinic("a", { rx: med() });
    const b = clinic("b", { history: hist(2, "2025-02-01T12:00:00-06:00", { REASON_CODE: "ADR", COMMENT_TEXT: "Dizziness" }) }, "2025-02-01T13:00:00-06:00");
    const rows = run([a, b]);
    expect(rows.medications[0]).toMatchObject({ status: "stopped", stop_reason: "adverse_reaction", status_reason_text: "Dizziness" });
    expect(rows.allergies).toHaveLength(0);
  });
  test("partial dates, dose units, salt normalization, and product RxNorm", () => {
    const a = clinic("a", { rx: med("a", { DRUG_NAME: "metformin hydrochloride 500 mg tablet", RXNORM: "product-cui", START_DATE: "2019-06" }),
      insulin: med("b", { LV_DRUG_ID: "insulin", DRUG_NAME: "insulin glargine 100 unit/mL injection", DOSE_QTY: 12, DOSE_UNIT: "unit", ROUTE: "SC", FREQ_CODE: "QHS" }) });
    const rows = run([a]).medications;
    expect(rows.find(m => m.ingredient === "metformin")).toMatchObject({ status_since: "2019-06" });
    expect(rows.every(m => m.rxnorm_ingredient === undefined)).toBe(true);
    expect(rows.find(m => m.ingredient === "insulin glargine")).toMatchObject({ dose: { value: 12, unit: "units" }, frequency: "QHS" });
  });
  test("salt normalization preserves electrolyte ingredients and avoids inferring indications", () => {
    const a = clinic("a", {
      albuterol: med("a", { DRUG_NAME: "albuterol sulfate 90 mcg/actuation inhaler", DOSE_QTY: 180, DOSE_UNIT: "mcg" }),
      potassium: med("b", { DRUG_NAME: "potassium chloride 10 mg tablet" }),
      sildenafil: med("c", { DRUG_NAME: "sildenafil 20 mg tablet" }),
    });
    const rows = run([a]).medications;
    expect(rows.map(m => m.ingredient)).toEqual(["albuterol", "potassium chloride", "sildenafil"]);
    expect(rows.find(m => m.ingredient === "sildenafil")?.sensitivity).toBeUndefined();
  });
});

describe("conditions and vitals", () => {
  test("CKD restaging merges and carries forward the last assessed albumin category", () => {
    const a = clinic("a", { dx: dx("N18.2", "Chronic kidney disease, stage 2") }, date, { CKD_G: "G2", CKD_A: "A3" });
    const b = clinic("b", { dx: dx("N18.32", "Chronic kidney disease, stage 3b") }, "2025-02-01T10:00:00-06:00");
    const c = clinic("c", {}, "2025-03-01T10:00:00-06:00", { VISIT_TYPE: "TEL" });
    const rows = run([b, a, c]).problems;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ icd10cm: "N18.32", ckd_stage: "G3b", albuminuria: "A3" });
    expect(rows[0].onset).toBeUndefined();
    expect(new Set(rows[0].evidence.map(e => e.item_id))).toEqual(new Set(["a", "b"]));
  });
  test("provisional, ruled-out and history diagnoses differ", () => {
    const a = clinic("a", { provisional: dx("N17.9", "Acute kidney injury", "P"), ruled: dx("I50.9", "Heart failure", "R"),
      history: dx("N20.0", "Kidney stone", "H"), mental: dx("F31.9", "Bipolar disorder"), dm: dx("E11.22", "Type 2 diabetes with diabetic CKD") });
    const rows = run([a]).problems;
    expect(rows).toHaveLength(3);
    expect(rows.find(r => r.icd10cm === "N20.0")?.status).toBe("resolved");
    expect(rows.find(r => r.icd10cm === "F31.9")?.sensitivity).toEqual(["mental-health"]);
    expect(rows.find(r => r.icd10cm === "E11.22")?.ckd_stage).toBeUndefined();
  });
  test("a new provisional entry does not revive a refuted diagnosis", () => {
    const a = clinic("a", { dx: dx("N17.9", "Acute kidney injury") });
    const b = clinic("b", { dx: dx("N17.9", "Acute kidney injury", "R") }, "2025-02-01T10:00:00-06:00");
    const c = clinic("c", { dx: dx("N17.9", "Acute kidney injury", "P") }, "2025-03-01T10:00:00-06:00");
    expect(run([a, c, b]).problems).toHaveLength(0);
  });
  test("CKD categories explicitly written in a diagnosis are retained", () => {
    const a = clinic("a", { dx: dx("N18.9", "CKD G3b A2") });
    expect(run([a]).problems[0]).toMatchObject({ ckd_stage: "G3b", albuminuria: "A2" });
  });
  test("drug-attributed diagnosis adds an allergy, without inventing immune mechanism", () => {
    const a = clinic("a", { dx: dx("L50.0", "Urticaria due to amoxicillin") });
    const rows = run([a]);
    expect(rows.problems).toHaveLength(1);
    expect(rows.allergies[0]).toMatchObject({ substance: "amoxicillin", reaction_type: "hypersensitivity", mechanism: "unknown", reaction: "Urticaria" });
  });
  test("an adverse-effect-only code uses the unique same-item drug of the named class", () => {
    const a = clinic("a", { dx: dx("T36.0X5A", "Adverse effect of penicillins, initial encounter"), rx: med("a", { DRUG_NAME: "amoxicillin 500 mg capsule" }) });
    const rows = run([a]);
    expect(rows.problems).toHaveLength(0);
    expect(rows.allergies[0].substance).toBe("amoxicillin");
  });
  test("vitals anchor on first BP, preserve pairs, and select last repeat", () => {
    const vital = (code: string, n: number, value: number, at: string) => ({ type: "VITAL", VITAL_CODE: code, READING_NO: n, VALUE_NUM: value, UNIT_CODE: code === "WT" ? "kg" : code === "HR" ? "/min" : "mmHg", TAKEN_AT: at });
    const a = clinic("a", { wt: vital("WT", 1, 85.16, "2025-01-02T03:28:00Z"),
      s: vital("BPS", 1, 155, "2025-01-02T03:30:00Z"), d: vital("BPD", 1, 91, "2025-01-02T03:30:00Z"),
      s2: vital("BPS", 2, 145, "2025-01-02T03:35:00Z"), d2: vital("BPD", 2, 85, "2025-01-02T03:35:00Z"),
      s3: vital("BPS", 3, 135, "2025-01-02T03:40:00Z"), d3: vital("BPD", 3, 81, "2025-01-02T03:40:00Z"),
      hr: vital("HR", 1, 70, "2025-01-02T03:30:00Z") });
    expect(run([a]).vitals[0]).toMatchObject({ local_time: "2025-01-01T21:30", systolic_mmhg: 155, diastolic_mmhg: 91,
      repeat_systolic_mmhg: 135, repeat_diastolic_mmhg: 81, pulse_bpm: 70, weight_kg: 85.2 });
  });
  test("no-BP sets use first measurement and local unzoned times are preserved", () => {
    const a = clinic("a", { wt: { type: "VITAL", VITAL_CODE: "WT", VALUE_NUM: 72.4, UNIT_CODE: "kg", READING_NO: 1, TAKEN_AT: "2025-07-01T08:15" },
      hr: { type: "VITAL", VITAL_CODE: "HR", VALUE_NUM: 70, UNIT_CODE: "/min", READING_NO: 1, TAKEN_AT: "2025-07-01T08:16" } });
    expect(run([a]).vitals[0]).toMatchObject({ local_time: "2025-07-01T08:15", weight_kg: 72.4, pulse_bpm: 70 });
  });
});

test("samples, deterministic ordering, no input mutation, and malformed inputs", async () => {
  const [sample] = await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).json();
  const original = JSON.stringify(sample.items);
  const rows = run(sample.items);
  expect(rows.labs).toHaveLength(4); expect(rows.vitals).toHaveLength(6); expect(rows.problems).toHaveLength(3);
  expect(rows.medications[0].status).toBe("held");
  expect(run([...sample.items].reverse())).toEqual(rows);
  expect(JSON.stringify(sample.items)).toBe(original);
  for (const malformed of [null, {}, [null, 5, "bad"], [item("bad", { a: null, b: [], c: 10, d: { type: "LAB_RESULT", RESULT_ID: "x", TEST_CODE: "toString" } })]]) {
    expect(() => run(malformed as any)).not.toThrow();
  }
  expect(run(sample.items, "not-a-date")).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});
