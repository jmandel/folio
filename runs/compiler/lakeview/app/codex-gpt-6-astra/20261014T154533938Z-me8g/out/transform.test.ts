import { test, expect } from "bun:test";
import { transform } from "./transform";
import samples from "../in/samples/samples.json";
import type { FolioItem } from "../in/views/views";

type Payload = Record<string, any>;
function item(id: string, recorded: string, payload: Payload, extra: Payload = {}): FolioItem {
  return { folio: "0.1", id, issuer: "lakeview", patient: "p", effective: recorded, recorded, narrative: "", payload, ...extra };
}
function visit(id: string, date: string, rest: Payload = {}): Payload {
  return { type: "CLINIC_VISIT", VISIT_ID: id, VISIT_TYPE: "FU", VISIT_AT: date, ...rest };
}
function dx(id: string, code: string, text: string, status = "A"): Payload {
  return { type: "VISIT_DX", VISIT_ID: id, ICD10CM: code, DX_TEXT: text, DX_STATUS: status, DX_RANK: 1 };
}
function lab(id: string, date: string, options: Payload = {}): FolioItem {
  return item(id, date, {
    req: { type: "LAB_REQ", REQ_ID: id, COLLECTED_AT: date },
    order: { type: "LAB_ORDER", ORDER_ID: id, REQ_ID: id, ORDER_STATUS: 4, SPECIMEN_COND: "OK", ...options.order },
    result: { type: "LAB_RESULT", RESULT_ID: id, ORDER_ID: id, TEST_CODE: "LK-K", RESULT_STATUS: "F", VALUE_TEXT: "4.8", VALUE_NUM: 4.8, UNIT_CODE: "mmol/L", RESULTED_AT: date, ...options.result },
  }, options.envelope);
}
function rx(id: string, drug: string, start: string, rest: Payload = {}): Payload {
  return { type: "MED_ORDER", VISIT_ID: id, RX_ID: id, LV_DRUG_ID: drug.split(" ")[0], DRUG_NAME: drug,
    MED_STATUS: 1, DOSE_QTY: 10, DOSE_UNIT: "mg", FREQ_CODE: "QD", START_DATE: start, ROUTE: "PO", ...rest };
}
function hist(id: string, prescription: string, date: string, status: number, rest: Payload = {}): FolioItem {
  return item(id, date, { change: { type: "MED_STATUS_HIST", RX_ID: prescription, HIST_ID: id, CHANGED_AT: date, NEW_STATUS: status, ...rest } });
}
const all = (items: FolioItem[]) => transform(items, "2030-12-31");

test("sample rows use corrected data, persistent hold, clinician stage and linked onset", () => {
  const result = all(samples[0].items as FolioItem[]);
  expect(result.labs.map(r => r.analyte).sort()).toEqual(["a1c", "creatinine", "egfr", "sodium"]);
  expect(result.labs.find(r => r.analyte === "egfr")?.egfr_equation).toBe("ckd-epi-2009");
  expect(result.medications[0]).toMatchObject({ ingredient: "finerenone", status: "held", status_since: "2021-10-08", dose: { value: 10, unit: "mg" } });
  expect(result.medications[0].stop_reason).toBeUndefined();
  expect(result.problems).toHaveLength(3);
  expect(result.problems.find(r => r.icd10cm === "N18.31")).toMatchObject({ ckd_stage: "G3a", albuminuria: "A3" });
  expect(result.problems.find(r => r.icd10cm === "I12.9")?.onset).toEqual({ value: "2010-11", precision: "month" });
  expect(result.vitals).toHaveLength(6);
  expect(result.allergies).toEqual([]);
});

test("all sample cutoffs ignore incoming order and do not mutate input", () => {
  const items = samples[0].items as FolioItem[];
  const original = JSON.stringify(items);
  for (const asOf of ["2021-07-10", "2021-07-11", "2021-09-07", "2021-10-08", "2022-10-26", "2026-10-13"]) {
    expect(transform(items, asOf)).toEqual(transform(items.toReversed(), asOf));
    expect(transform(items, asOf)).toEqual(transform(items.map(x => ({ ...x, payload: Object.fromEntries(Object.entries(x.payload).reverse()) })), asOf));
  }
  expect(JSON.stringify(items)).toBe(original);
});

test("Chicago end of day, including subsecond and offset-free recorded times", () => {
  const a = lab("a", "2025-07-02T04:59:59.999Z");
  const b = lab("b", "2025-07-02T05:00:00Z");
  const c = lab("c", "2025-07-01T23:59:59.999");
  expect(transform([a, b, c], "2025-07-01").labs).toHaveLength(2);
  expect(transform([lab("d", "2025-01-02T05:59:59Z")], "2025-01-01").labs).toHaveLength(1);
});

test("recorded controls availability, not effective or collection", () => {
  const l = lab("a", "2025-02-02T11:00:00-06:00", { envelope: { effective: "2020-01-01" } });
  l.payload.req.COLLECTED_AT = "2020-01-01T10:00:00-06:00";
  expect(transform([l], "2025-02-01").labs).toHaveLength(0);
  expect(transform([l], "2025-02-02").labs[0].collected).toBe("2020-01-01T10:00:00-06:00");
});

test("supersession chains and future retractions", () => {
  const a = lab("a", "2025-01-01");
  const b = lab("b", "2025-01-02", { envelope: { supersedes: ["a"] } });
  const c = lab("c", "2025-01-03", { envelope: { supersedes: ["b"] } });
  const r = item("r", "2025-01-04", {}, { retracts: ["c"] });
  expect(transform([r, c, a, b], "2025-01-02").labs[0].evidence.some(e => e.item_id === "b")).toBe(true);
  expect(transform([r, c, a, b], "2025-01-03").labs).toHaveLength(1);
  expect(all([r, c, a, b]).labs).toHaveLength(0);
});

test("Lakeview result validity is independent of order workflow and hemolysis", () => {
  const cases = [
    lab("a", "2025-01-01", { order: { ORDER_STATUS: 4 }, result: { RESULT_STATUS: "C" } }),
    lab("b", "2025-01-01", { order: { ORDER_STATUS: 9 }, result: { RESULT_STATUS: "F" } }),
    lab("c", "2025-01-01", { result: { RESULT_STATUS: "X" } }),
    lab("d", "2025-01-01", { order: { ORDER_STATUS: 3 }, result: { RESULT_STATUS: "P" } }),
    lab("e", "2025-01-01", { result: { RESULT_STATUS: "A" } }),
    lab("f", "2025-01-01", { order: { SPECIMEN_COND: "HEM" } }),
  ];
  expect(all(cases).labs.map(r => r.status).sort()).toEqual(["final", "final", "preliminary"]);
});

test("VALUE_TEXT takes precedence, including sentinel comparator and nonnumeric text", () => {
  const cases = [
    lab("a", "2025-01-01", { result: { TEST_CODE: "LK-EGFR09N", VALUE_TEXT: ">60", VALUE_NUM: 9999999, UNIT_CODE: "mL/min/1.73m2", LOINC: "48642-3" } }),
    lab("b", "2025-01-01", { result: { VALUE_TEXT: "< 0.1", VALUE_NUM: 9999999 } }),
    lab("c", "2025-01-01", { result: { VALUE_TEXT: "See comment", VALUE_NUM: 99 } }),
    lab("d", "2025-01-01", { result: { VALUE_TEXT: "5.2", VALUE_NUM: 1 } }),
  ];
  const rows = all(cases).labs;
  expect(rows).toHaveLength(3);
  expect(rows.find(r => r.analyte === "egfr")).toMatchObject({ value: 60, comparator: ">", egfr_equation: "ckd-epi-2009", loinc: "48642-3" });
  expect(rows.some(r => r.value === 0.1 && r.comparator === "<")).toBe(true);
  expect(rows.some(r => r.value === 5.2)).toBe(true);
});

test("eGFR codes bridge equation transition without race variant or LOINC inference", () => {
  const cases = ["LK-EGFR09N", "LK-EGFR09A", "LK-EGFR21"].map((code, i) => lab(String(i), "2025-01-01", { result: { TEST_CODE: code, UNIT_CODE: "mL/min/1.73m2" } }));
  const rows = all(cases).labs;
  expect(rows).toHaveLength(2);
  expect(rows.map(r => r.egfr_equation).sort()).toEqual(["ckd-epi-2009", "ckd-epi-2021"]);
  expect(rows.every(r => r.loinc === undefined)).toBe(true);
});

test("all documented analyte codes map and thousands per microlitre do not scale", () => {
  const codes = { "LK-CREAT": "mg/dL", "LK-NA": "mmol/L", "LK-K": "mmol/L", "LK-GLU": "mg/dL", "LK-A1C": "%", "LK-UACR": "mg/g", "LK-WBC": "K/uL", "LK-HGB": "g/dL", "LK-PLT": "K/uL", "LK-CHOL": "mg/dL", "LK-TRIG": "mg/dL", "LK-HDL": "mg/dL", "LK-LDLC": "mg/dL" };
  const rows = all(Object.entries(codes).map(([code, unit]) => lab(code, "2025-01-01", { result: { TEST_CODE: code, UNIT_CODE: unit, VALUE_TEXT: "212" } }))).labs;
  expect(rows).toHaveLength(13);
  expect(rows.find(r => r.analyte === "platelets")).toMatchObject({ value: 212, unit: "10*3/uL" });
});

test("confirmation repeats stand, while copies share one result", () => {
  const a = lab("a", "2025-01-01", { result: { RESULT_STATUS: "P" } });
  const b = lab("b", "2025-01-02", { result: { RESULT_ID: "a", RESULT_STATUS: "F" } });
  const c = lab("c", "2025-01-03", { order: { REPEAT_OF_ORDER_ID: "a", REPEAT_REASON: "CONF" } });
  const rows = all([c, b, a]).labs;
  expect(rows).toHaveLength(2);
  expect(rows[0].status).toBe("final");
  expect(rows[0].evidence.some(e => e.item_id === "a")).toBe(true);
  expect(rows[0].evidence.some(e => e.item_id === "b")).toBe(true);
});

test("offset-free collection receives Chicago seasonal offset", () => {
  const winter = all([lab("w", "2025-01-01T10:00:00")]).labs[0];
  const summer = all([lab("s", "2025-07-01T10:00:00")]).labs[0];
  expect(winter.collected).toBe("2025-01-01T10:00:00-06:00");
  expect(summer.collected).toBe("2025-07-01T10:00:00-05:00");
});

test("hold review date does not resume; status events use CHANGED_AT ordering", () => {
  const order = item("rx", "2025-01-01", { rx: rx("r", "finerenone 10 mg tablet", "2025-01-01") });
  const held = hist("hold", "r", "2025-02-01T03:30:00Z", 3, { REVIEW_DATE: "2025-02-05", COMMENT_TEXT: "High potassium", REASON_CODE: "LAB" });
  expect(all([held, order]).medications[0]).toMatchObject({ status: "held", status_since: "2025-01-31", status_reason_text: "High potassium" });
  const resume = hist("resume", "r", "2025-03-01", 1);
  expect(all([resume, held, order]).medications[0]).toMatchObject({ status: "active", status_since: "2025-03-01" });
  expect(all([resume, held, order]).medications[0].status_reason_text).toBeUndefined();
});

test("stops, entered-in-error lines, and latest event per ingredient", () => {
  const old = item("old", "2025-01-01", { rx: rx("r1", "losartan potassium 25 mg tablet", "2025-01-01", { RXNORM: "product-cui", DOSE_QTY: 25 }) });
  const newer = item("new", "2025-02-01", { rx: rx("r2", "losartan 50 mg tablet", "2025-02-01", { DOSE_QTY: 50 }) });
  const stop = hist("stop", "r1", "2025-03-01", 2, { REASON_CODE: "ADR", COMMENT_TEXT: "Rash" });
  const erroneous = item("bad", "2025-04-01", { rx: rx("r3", "losartan 100 mg tablet", "2025-04-01", { MED_STATUS: 9 }) });
  const rows = all([erroneous, newer, old, stop]).medications;
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({ ingredient: "losartan", dose: { value: 25, unit: "mg" }, status: "stopped", stop_reason: "adverse_reaction" });
  expect(rows[0].rxnorm_ingredient).toBeUndefined();
  expect(all([old, hist("error", "r1", "2025-02-01", 9)]).medications).toHaveLength(0);
});

test("retracted status change restores the earlier medication event", () => {
  const order = item("rx", "2025-01-01", { rx: rx("r", "finerenone 10 mg tablet", "2025-01-01") });
  const hold = hist("hold", "r", "2025-02-01", 3);
  const retract = item("retract", "2025-03-01", {}, { retracts: ["hold"] });
  expect(all([order, hold, retract]).medications[0].status).toBe("active");
});

test("CKD restaging is one problem and latest explicit categories persist through unassessed visits", () => {
  const a = item("a", "2025-01-01", { visit: visit("a", "2025-01-01", { CKD_G: "G3a", CKD_A: "A2" }), dx: dx("a", "N18.31", "Chronic kidney disease, stage 3a") });
  const b = item("b", "2025-02-01", { visit: visit("b", "2025-02-01", { CKD_G: "G3b" }), dx: dx("b", "N18.32", "Chronic kidney disease, stage 3b") });
  const c = item("c", "2025-03-01", { visit: visit("c", "2025-03-01", { VISIT_TYPE: "TEL" }) });
  const row = all([c, a, b]).problems;
  expect(row).toHaveLength(1);
  expect(row[0]).toMatchObject({ icd10cm: "N18.32", ckd_stage: "G3b", albuminuria: "A2" });
});

test("unconfirmed and ruled-out diagnoses are absent, historical diagnoses resolved", () => {
  const a = item("a", "2025-01-01", { visit: visit("a", "2025-01-01"), provisional: dx("a", "N04.9", "Nephrotic syndrome", "P"), prior: dx("a", "E87.5", "Hyperkalemia"), historical: dx("a", "N17.9", "Acute kidney injury", "H") });
  const b = item("b", "2025-02-01", { visit: visit("b", "2025-02-01"), ruled: dx("b", "E87.5", "Hyperkalemia", "R") });
  expect(all([a, b]).problems).toEqual([expect.objectContaining({ condition: "Acute kidney injury", status: "resolved" })]);
});

test("labs and diagnoses absent from structured payload are not generated from narrative", () => {
  const a = item("a", "2025-01-01", {}, { narrative: "CKD G4, eGFR 20, K 7, allergy to amoxicillin. Take losartan." });
  expect(all([a])).toEqual({ problems: [], medications: [], labs: [], allergies: [], vitals: [] });
});

test("blood pressure components pair by reading number; repeat and time use BP", () => {
  const v = (code: string, value: number, n: number, date: string, unit = "mmHg") => ({ type: "VITAL", VISIT_ID: "v", VITAL_CODE: code, VALUE_NUM: value, READING_NO: n, TAKEN_AT: date, UNIT_CODE: unit });
  const a = item("a", "2025-07-01", {
    weight: v("WT", 80.16, 1, "2025-07-01T13:00:00Z", "kg"),
    sys: v("BPS", 160, 1, "2025-07-01T13:02:00Z"), dia: v("BPD", 90, 1, "2025-07-01T13:02:00Z"),
    sys2: v("BPS", 140, 2, "2025-07-01T13:12:00Z"), dia2: v("BPD", 80, 2, "2025-07-01T13:12:00Z"),
  });
  expect(all([a]).vitals[0]).toMatchObject({ local_time: "2025-07-01T08:02", systolic_mmhg: 160, diastolic_mmhg: 90, repeat_systolic_mmhg: 140, repeat_diastolic_mmhg: 80, weight_kg: 80.2 });
});

test("vitals without BP use first measurement and preserve local timestamps", () => {
  const a = item("a", "2025-01-01", { hr: { type: "VITAL", VISIT_ID: "v", VITAL_CODE: "HR", VALUE_NUM: 70, UNIT_CODE: "/min", READING_NO: 1, TAKEN_AT: "2025-01-01T09:00:00" } });
  expect(all([a]).vitals[0]).toMatchObject({ local_time: "2025-01-01T09:00", pulse_bpm: 70 });
});

test("drug-attributed diagnoses yield reaction and condition with no guessed ingredient code", () => {
  const a = item("a", "2025-01-01", { visit: visit("a", "2025-01-01"), dx: dx("a", "L50.0", "Urticaria due to amoxicillin") });
  const rows = all([a]);
  expect(rows.problems).toHaveLength(1);
  expect(rows.allergies[0]).toMatchObject({ substance: "amoxicillin", reaction_type: "hypersensitivity", mechanism: "unknown" });
  expect(rows.allergies[0].rxnorm_ingredient).toBeUndefined();
});

test("sensitive diagnoses are retained and tagged", () => {
  const a = item("a", "2025-01-01", { visit: visit("a", "2025-01-01"), dx: dx("a", "F31.9", "Bipolar disorder"), rx: rx("a", "quetiapine 25 mg tablet", "2025-01-01") });
  expect(all([a]).problems[0].sensitivity).toEqual(["mental-health"]);
  expect(all([a]).medications[0].sensitivity).toEqual(["mental-health"]);
});

test("malformed JSON-shaped input skips unreadable entries without throwing", () => {
  for (const input of [null, {}, [null, 1, "text"], [{ id: "x", issuer: "y", recorded: "bad" }], [item("bad", "2025-02-30", {})], [item("a", "2025-01-01", { x: null, y: [], z: { type: "VITAL", VALUE_NUM: "not a number" } })]]) {
    expect(() => transform(input as any, "2025-01-01")).not.toThrow();
  }
  expect(transform(samples[0].items as FolioItem[], "bad-date").labs).toEqual([]);
  const unknown = lab("unknown", "2025-01-01", { result: { TEST_CODE: "UNKNOWN" } });
  expect(all([unknown]).labs).toEqual([]);
});

test("backfilled medication history follows clinical event time, not publication time", () => {
  const order = item("rx", "2025-01-01", { rx: rx("r", "finerenone 10 mg tablet", "2025-01-01") });
  const hold = hist("hold", "r", "2025-04-01", 3);
  hold.payload.change.CHANGED_AT = "2025-02-01T10:00:00-06:00";
  const resumed = hist("resume", "r", "2025-03-01", 1);
  expect(all([order, hold, resumed]).medications[0]).toMatchObject({ status: "active", status_since: "2025-03-01" });
});

test("unit doses are normalized and a strength is not multiplied into the prescribed amount", () => {
  const a = item("a", "2025-01-01", { rx: rx("a", "Lantus 100 unit/mL injection", "2025-01-01", { DOSE_QTY: 12, DOSE_UNIT: "unit", FREQ_CODE: "QHS" }) });
  expect(all([a]).medications[0]).toMatchObject({ ingredient: "insulin glargine", dose: { value: 12, unit: "units" }, frequency: "QHS" });
});

test("DST change days use local midnight for the publication cutoff", () => {
  expect(transform([lab("a", "2025-03-10T04:59:59Z"), lab("b", "2025-03-10T05:00:00Z")], "2025-03-09").labs).toHaveLength(1);
  expect(transform([lab("a", "2025-11-03T05:59:59Z"), lab("b", "2025-11-03T06:00:00Z")], "2025-11-02").labs).toHaveLength(1);
});
