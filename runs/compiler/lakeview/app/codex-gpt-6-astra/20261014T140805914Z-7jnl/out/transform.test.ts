import { test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";
import samples from "../in/samples/samples.json";

type Payload = Record<string, any>;
const stamp = (date: string) => `${date}T10:00:00-06:00`;
function item(id: string, date: string, payload: Payload, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "lakeview", patient: "p", effective: stamp(date), recorded: stamp(date), narrative: "", payload, ...extra };
}
function clinic(id: string, date: string, payload: Payload = {}, extra: Partial<FolioItem> = {}): FolioItem {
  const visit = { type: "CLINIC_VISIT", VISIT_ID: id, VISIT_TYPE: "FU", VISIT_AT: stamp(date), PROVIDER_NPI: "1234567890" };
  return item(id, date, { visit, ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, { VISIT_ID: id, ...v }])) }, extra);
}
function rx(id: string, name = "finerenone 10 mg tablet", more: Payload = {}): Payload {
  return { type: "MED_ORDER", RX_ID: id, LV_DRUG_ID: name, DRUG_NAME: name, DOSE_QTY: 10, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2024-01-01", PRESCRIBER_NPI: "1234567890", ...more };
}
function hist(rx: string, status: number, date: string, more: Payload = {}): Payload {
  return { type: "MED_STATUS_HIST", HIST_ID: `${rx}-${date}`, RX_ID: rx, OLD_STATUS: 1, NEW_STATUS: status, CHANGED_AT: stamp(date), REASON_CODE: "LAB", ...more };
}
function dx(code: string, text: string, status = "A"): Payload {
  return { type: "VISIT_DX", ICD10CM: code, DX_TEXT: text, DX_STATUS: status, DX_RANK: 1 };
}
function lab(id: string, date: string, code = "LK-K", value = "5.0", more: Payload = {}, extra: Partial<FolioItem> = {}): FolioItem {
  return item(id, date, {
    req: { type: "LAB_REQ", REQ_ID: `q-${id}`, CLIENT_CODE: "OTHER", CLIENT_NAME: "Outside practice", COLLECTED_AT: stamp(date), RECEIVED_AT: stamp(date), FASTING: "U" },
    order: { type: "LAB_ORDER", ORDER_ID: `o-${id}`, REQ_ID: `q-${id}`, ORDER_CODE: code, ORDER_NAME: code, ACCESSION: `a-${id}`, SPECIMEN_TYPE: "SER", SPECIMEN_COND: "OK", ORDER_STATUS: 4, STATUS_AT: stamp(date) },
    result: { type: "LAB_RESULT", RESULT_ID: `r-${id}`, ORDER_ID: `o-${id}`, TEST_CODE: code, TEST_NAME: code, VALUE_TEXT: value, VALUE_NUM: 9999999, UNIT_CODE: "mmol/L", RESULT_STATUS: "F", RESULTED_AT: stamp(date), ...more },
  }, extra);
}
function vital(code: string, value: number, n: number, at: string): Payload {
  return { type: "VITAL", VITAL_CODE: code, VALUE_NUM: value, UNIT_CODE: code === "WT" ? "kg" : code === "HR" ? "/min" : "mmHg", READING_NO: n, TAKEN_AT: at };
}
const run = (items: FolioItem[], date = "2026-10-13") => transform(items, date);

test("samples: persisted hold, CKD restaging, no narrative-only labs, corrected potassium absent", () => {
  const rows = run(samples[0].items as FolioItem[]);
  expect(rows.medications).toHaveLength(1);
  expect(rows.medications[0]).toMatchObject({ ingredient: "finerenone", status: "held", status_since: "2021-10-08", dose: { value: 10, unit: "mg" } });
  expect(rows.problems).toHaveLength(3);
  expect(rows.problems.find(p => p.icd10cm === "N18.31")).toMatchObject({ ckd_stage: "G3a", albuminuria: "A3" });
  expect(rows.problems.find(p => p.icd10cm === "E11.22")?.onset).toEqual({ value: "2015", precision: "year" });
  expect(rows.problems.find(p => p.icd10cm === "I12.9")?.onset).toEqual({ value: "2010-11", precision: "month" });
  expect(rows.labs).toHaveLength(4);
  expect(rows.labs.some(l => l.analyte === "potassium")).toBe(false);
  expect(rows.vitals).toHaveLength(6);
  expect(rows.vitals[0].local_time).toBe("2021-09-07T09:34");
  expect(rows.allergies).toEqual([]);
});

test("sample historical state is not overwritten by later contacts", () => {
  const items = samples[0].items as FolioItem[];
  expect(run(items, "2021-09-08").medications[0].status).toBe("active");
  expect(run(items, "2021-10-08").medications[0].status).toBe("held");
  expect(run(items, "2022-06-24").problems.find(p => p.icd10cm?.startsWith("N18"))?.ckd_stage).toBe("G2");
  expect(run(items, "2021-07-10").labs).toEqual([]);
});

test("Chicago recorded cutoff handles both DST seasons and offset-free wall clocks", () => {
  for (const [date, inside, outside] of [
    ["2024-01-01", "2024-01-02T05:59:59.999Z", "2024-01-02T06:00:00Z"],
    ["2024-07-01", "2024-07-02T04:59:59.999Z", "2024-07-02T05:00:00Z"],
    ["2024-03-10", "2024-03-11T04:59:59Z", "2024-03-11T05:00:00Z"],
    ["2024-11-03", "2024-11-04T05:59:59Z", "2024-11-04T06:00:00Z"],
  ]) {
    expect(run([lab("a", date, "LK-K", "5", {}, { recorded: inside })], date).labs).toHaveLength(1);
    expect(run([lab("a", date, "LK-K", "5", {}, { recorded: outside })], date).labs).toHaveLength(0);
  }
  expect(run([lab("a", "2024-01-01", "LK-K", "5", {}, { recorded: "2024-01-01T23:59:59" })], "2024-01-01").labs).toHaveLength(1);
});

test("corrections are scoped by recorded time and transitive after retraction", () => {
  const a = lab("a", "2024-01-01");
  const b = structuredClone(a); b.id = "b"; b.recorded = stamp("2024-01-02"); b.supersedes = ["a"]; b.payload.result.VALUE_TEXT = "4.1";
  const c = item("c", "2024-01-03", {}, { retracts: ["b"] });
  expect(run([c, a, b], "2024-01-01").labs[0].value).toBe(5);
  expect(run([c, a, b], "2024-01-02").labs[0].value).toBe(4.1);
  expect(run([c, a, b], "2024-01-03").labs).toEqual([]);
  c.issuer = "someone-else";
  expect(run([a, b, c]).labs[0].value).toBe(4.1);
});

test("result status and order status are independent; hemolysis alone does not withdraw a result", () => {
  const a = lab("a", "2024-01-01", "LK-K", "6.5"); a.payload.order.SPECIMEN_COND = "HEM";
  const b = lab("b", "2024-01-01", "LK-K", "6.7", { RESULT_STATUS: "C" });
  const c = lab("c", "2024-01-01", "LK-K", "4.1"); c.payload.order.ORDER_STATUS = 9;
  const d = lab("d", "2024-01-01", "LK-K", "4.2", { RESULT_STATUS: "A" });
  const e = lab("e", "2024-01-01", "LK-K", "4.3", { RESULT_STATUS: "P" }); e.payload.order.ORDER_STATUS = 3;
  const f = lab("f", "2024-01-01", "LK-K", "Not done: QNS", { RESULT_STATUS: "X", VALUE_NUM: null });
  expect(run([a, b, c, d, e, f]).labs.map(l => [l.value, l.status])).toEqual([[6.5, "final"], [4.2, "final"], [4.3, "preliminary"]]);
});

test("confirmation repeats and shared tubes remain separate results", () => {
  const a = lab("a", "2024-01-01", "LK-K", "5.6");
  const b = lab("b", "2024-01-02", "LK-K", "5.5");
  b.payload.order.REPEAT_OF_ORDER_ID = "o-a"; b.payload.order.REPEAT_REASON = "CONF";
  b.payload.order.ACCESSION = a.payload.order.ACCESSION;
  expect(run([b, a]).labs.map(l => l.value)).toEqual([5.6, 5.5]);
});

test("VALUE_TEXT is authoritative, comparator sentinels are not values, and nonnumeric results are skipped", () => {
  const items = [lab("a", "2024-01-01", "LK-K", "<0.1"), lab("b", "2024-01-01", "LK-K", "See comment"), lab("c", "2024-01-01", "LK-K", "4.2", { VALUE_NUM: 7.8 })];
  const labs = run(items).labs;
  expect(labs).toHaveLength(2);
  expect(labs[0]).toMatchObject({ value: 0.1, comparator: "<" });
  expect(labs[1].value).toBe(4.2);
});

test("all supported component codes map using their source units, without invented LOINC", () => {
  const codes = [
    ["LK-CREAT", "creatinine", "mg/dL", "mg/dL"], ["LK-NA", "sodium", "mmol/L", "mmol/L"],
    ["LK-K", "potassium", "mmol/L", "mmol/L"], ["LK-GLU", "glucose", "mg/dL", "mg/dL"],
    ["LK-A1C", "a1c", "%", "%"], ["LK-UACR", "uacr", "mg/g", "mg/g"],
    ["LK-WBC", "wbc", "K/uL", "10*3/uL"], ["LK-HGB", "hemoglobin", "g/dL", "g/dL"],
    ["LK-PLT", "platelets", "K/uL", "10*3/uL"], ["LK-CHOL", "cholesterol", "mg/dL", "mg/dL"],
    ["LK-TRIG", "triglycerides", "mg/dL", "mg/dL"], ["LK-HDL", "hdl", "mg/dL", "mg/dL"],
    ["LK-LDLC", "ldl", "mg/dL", "mg/dL"],
  ];
  for (const [code, analyte, sourceUnit, unit] of codes) {
    const result = run([lab(code, "2024-01-01", code, "212", { UNIT_CODE: sourceUnit })]).labs[0];
    expect(result).toMatchObject({ analyte, value: 212, unit });
    expect(result.loinc).toBeUndefined();
  }
});

test("eGFR uses the non-race variant, joins old and new codes, and trusts the method note", () => {
  const old = lab("a", "2021-01-01", "LK-EGFR09N", ">60", { UNIT_CODE: "mL/min/1.73m2", LOINC: "48642-3", COMMENT_TEXT: "Calculated by CKD-EPI 2009." });
  const race = lab("b", "2021-01-01", "LK-EGFR09A", ">60", { UNIT_CODE: "mL/min/1.73m2" });
  const newer = lab("c", "2024-01-01", "LK-EGFR21", ">90", { UNIT_CODE: "mL/min/1.73m2" });
  const override = lab("d", "2024-01-01", "LK-EGFR21", "40", { UNIT_CODE: "mL/min/1.73m2", COMMENT_TEXT: "Calculated by MDRD." });
  const labs = run([old, race, newer, override]).labs;
  expect(labs.map(l => [l.value, l.egfr_equation])).toEqual([[60, "ckd-epi-2009"], [90, "ckd-epi-2021"], [40, "mdrd"]]);
});

test("repeated result copies prefer final over preliminary", () => {
  const a = lab("a", "2024-01-01", "LK-K", "4.9");
  const b = lab("b", "2024-01-02", "LK-K", "5.0", { RESULT_ID: "r-a", RESULT_STATUS: "P" });
  expect(run([a, b]).labs.map(l => l.value)).toEqual([4.9]);
});

test("medication hold remains after review date and resumption has the actual change date", () => {
  const a = clinic("a", "2024-01-01", { rx: rx("rx") });
  const b = clinic("b", "2024-01-02", { hold: hist("rx", 3, "2024-01-02", { REVIEW_DATE: "2024-01-04", COMMENT_TEXT: "Potassium elevated" }) });
  const c = clinic("c", "2024-01-05", { resume: hist("rx", 1, "2024-01-05") });
  expect(run([a, b, c], "2024-01-04").medications[0]).toMatchObject({ status: "held", status_since: "2024-01-02", status_reason_text: "Potassium elevated" });
  const resumed = run([c, b, a]).medications[0];
  expect(resumed).toMatchObject({ status: "active", status_since: "2024-01-05" });
  expect(resumed.status_reason_text).toBeUndefined();
  expect(resumed.evidence).toContainEqual({ item_id: "c", entry_id: "resume" });
});

test("same-ingredient selection uses each prescription's latest event; voids do not displace valid lines", () => {
  const a = clinic("a", "2024-01-01", { rx: rx("old") });
  const b = clinic("b", "2024-01-02", { rx: rx("new", "Kerendia 20 mg tablet", { DOSE_QTY: 20, START_DATE: "2024-01-02" }) });
  const c = clinic("c", "2024-01-03", { hold: hist("old", 3, "2024-01-03") });
  expect(run([a, b, c]).medications[0]).toMatchObject({ status: "held", dose: { value: 10 } });
  const d = clinic("d", "2024-01-04", { void: hist("old", 9, "2024-01-04", { REASON_CODE: "ERR" }) });
  expect(run([a, b, c, d]).medications[0]).toMatchObject({ status: "active", dose: { value: 20 } });
  const e = clinic("e", "2024-01-05", { rx: rx("error", "finerenone 40 mg tablet", { MED_STATUS: 9 }) });
  expect(run([a, b, c, d, e]).medications[0].dose?.value).toBe(20);
});

test("stopped meds preserve reasons, product RxNorm is not an ingredient code, and unit is normalized", () => {
  const a = clinic("a", "2024-01-01", { rx: rx("rx", "Lantus 100 unit/mL injection", { DOSE_QTY: 16, DOSE_UNIT: "unit", ROUTE: "SC", RXNORM: "product-code" }) });
  const b = clinic("b", "2024-01-02", { stop: hist("rx", 2, "2024-01-02", { REASON_CODE: "PT", COMMENT_TEXT: "Patient requested discontinuation" }) });
  const med = run([a, b]).medications[0];
  expect(med).toMatchObject({ ingredient: "insulin glargine", status: "stopped", stop_reason: "patient_choice", dose: { value: 16, unit: "units" } });
  expect(med.rxnorm_ingredient).toBeUndefined();
});

test("retracted history does not change the prescription, and a retracted prescription cannot be resurrected by history", () => {
  const a = clinic("a", "2024-01-01", { rx: rx("rx") });
  const b = clinic("b", "2024-01-02", { hold: hist("rx", 3, "2024-01-02") });
  expect(run([a, b, item("c", "2024-01-03", {}, { retracts: ["b"] })]).medications[0].status).toBe("active");
  expect(run([a, b, item("c", "2024-01-03", {}, { retracts: ["a"] })]).medications).toEqual([]);
});

test("CKD restaging merges codes and carries forward independently recorded categories", () => {
  const a = clinic("a", "2024-01-01", { ckd: dx("N18.2", "Chronic kidney disease, stage 2") });
  a.payload.visit.CKD_G = "G2"; a.payload.visit.CKD_A = "A3";
  const b = clinic("b", "2024-01-02", { ckd: dx("N18.32", "Chronic kidney disease, stage 3b") });
  const c = clinic("c", "2024-01-03"); c.payload.visit.CKD_G = "G4";
  const problems = run([a, b, c]).problems;
  expect(problems).toHaveLength(1);
  expect(problems[0]).toMatchObject({ icd10cm: "N18.32", ckd_stage: "G4", albuminuria: "A3" });
  expect(problems[0].onset).toBeUndefined();
  expect(problems[0].evidence).toContainEqual({ item_id: "c", entry_id: "visit" });
  expect(problems[0].evidence).toContainEqual({ item_id: "a", entry_id: "visit" });
});

test("provisional-only and ruled-out diagnoses are omitted; confirmed historical conditions are resolved", () => {
  const a = clinic("a", "2024-01-01", { provisional: dx("N17.9", "Acute kidney injury", "P"), confirmed: dx("E87.5", "Hyperkalemia") });
  const b = clinic("b", "2024-01-02", { historical: dx("E87.5", "Hyperkalemia", "H"), ruled: dx("N17.9", "Acute kidney injury", "R") });
  expect(run([a, b]).problems.map(p => [p.condition, p.status])).toEqual([["Hyperkalemia", "resolved"]]);
});

test("sensitive diagnoses are retained and marked", () => {
  const a = clinic("a", "2024-01-01", { mental: dx("F32.9", "Depression"), hiv: dx("B20", "HIV disease") });
  expect(run([a]).problems.map(p => p.sensitivity)).toEqual([["hiv-sti"], ["mental-health"]]);
});

test("clinic vitals pair repeats by reading number, use first BP time, and round kg", () => {
  const a = clinic("a", "2024-01-01", {
    wt: vital("WT", 80.16, 1, "2024-01-01T09:58:00"),
    sys: vital("BPS", 160, 1, "2024-01-01T10:00:00"), dia: vital("BPD", 90, 1, "2024-01-01T10:00:00"),
    sys2: vital("BPS", 140, 2, "2024-01-01T10:10:00"), dia2: vital("BPD", 80, 2, "2024-01-01T10:10:00"),
    pulse: vital("HR", 70, 1, "2024-01-01T10:01:00"),
  });
  expect(run([a]).vitals[0]).toMatchObject({ setting: "clinic", local_time: "2024-01-01T10:00", systolic_mmhg: 160, diastolic_mmhg: 90, repeat_systolic_mmhg: 140, repeat_diastolic_mmhg: 80, pulse_bpm: 70, weight_kg: 80.2 });
  delete a.payload.sys; delete a.payload.dia; delete a.payload.sys2; delete a.payload.dia2;
  expect(run([a]).vitals[0].local_time).toBe("2024-01-01T09:58");
});

test("drug-caused diagnoses produce problems and drug avoidance with class resolution", () => {
  const a = clinic("a", "2024-01-01", { reaction: dx("E11.10", "SGLT2 inhibitor-associated ketoacidosis"), rx: rx("rx", "Jardiance 10 mg tablet", { MED_STATUS: 2 }) });
  const rows = run([a]);
  expect(rows.problems).toHaveLength(1);
  expect(rows.allergies[0]).toMatchObject({ substance: "empagliflozin", reaction_type: "serious_adverse_event", mechanism: "non_immune", criticality: "high" });
  a.payload.rx2 = { ...a.payload.rx, RX_ID: "rx2", DRUG_NAME: "dapagliflozin 10 mg tablet" };
  expect(run([a]).allergies[0].substance).toBe("SGLT2 inhibitor");
});

test("ACE inhibitor angioedema is hypersensitivity-type but non-immune", () => {
  const a = clinic("a", "2024-01-01", { reaction: dx("T78.3XXA", "lisinopril-induced angioedema") });
  expect(run([a]).allergies[0]).toMatchObject({ substance: "lisinopril", reaction_type: "hypersensitivity", mechanism: "non_immune", criticality: "high" });
});

test("an adverse-effect T-code alone is not a problem and can use a co-recorded reaction", () => {
  const a = clinic("a", "2024-01-01", { adverse: dx("T46.4X5A", "Adverse effect of ACE inhibitors, initial encounter"), reaction: dx("T78.3XXA", "Angioedema"), rx: rx("rx", "lisinopril 10 mg tablet", { MED_STATUS: 2 }) });
  const rows = run([a]);
  expect(rows.problems.map(p => p.condition)).toEqual(["Angioedema"]);
  expect(rows.allergies[0]).toMatchObject({ substance: "lisinopril", reaction: "Angioedema" });
});

test("input and payload order do not matter; transform does not mutate input", () => {
  const input = structuredClone(samples[0].items) as FolioItem[];
  const before = JSON.stringify(input);
  const expected = run(input);
  const reordered = [...input].reverse().map(i => ({ ...i, payload: Object.fromEntries(Object.entries(i.payload).reverse()) }));
  expect(run(reordered)).toEqual(expected);
  expect(JSON.stringify(input)).toBe(before);
});

test("malformed inputs are skipped without throwing or inventing values", () => {
  const garbage = [null, 42, "item", [], {}, { id: "x", issuer: "s", recorded: "invalid" }, { id: "x", issuer: "s", recorded: "2024-02-30T10:00:00Z" }, { id: "ok", issuer: "s", recorded: stamp("2024-01-01"), payload: { a: null, b: [], c: { type: "LAB_RESULT", TEST_CODE: "__proto__" } } }];
  expect(() => run(garbage as any)).not.toThrow();
  expect(run(garbage as any)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  expect(run(null as any)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  expect(run([], "invalid").labs).toEqual([]);
});

test("unreadable status rows are skipped and cannot destroy an otherwise valid medication", () => {
  const a = clinic("a", "2024-01-01", { rx: rx("rx") });
  const b = clinic("b", "2024-01-02", { bad: hist("rx", 88, "2024-01-02") });
  expect(run([a, b]).medications[0].status).toBe("active");
  const malformed = lab("bad", "2024-01-01");
  malformed.payload.order.ORDER_STATUS = { toString: null, valueOf: null };
  expect(() => run([malformed])).not.toThrow();
  expect(run([malformed]).labs).toEqual([]);
});

test("specific drug attribution wins over class and medication omission is not an adverse effect", () => {
  const a = clinic("a", "2024-01-01", { reaction: dx("T78.3XXA", "lisinopril (ACE inhibitor)-associated angioedema") });
  expect(run([a]).allergies[0].substance).toBe("lisinopril");
  const b = clinic("b", "2024-01-01", { reaction: dx("E10.10", "Ketoacidosis due to missed insulin") });
  expect(run([b]).allergies).toEqual([]);
  const c = clinic("c", "2024-01-01", { reaction: dx("E87.2", "metformin-associated lactic acidosis while taking lisinopril") });
  expect(run([c]).allergies[0].substance).toBe("metformin");
});

test("ingredient normalization preserves mineral ingredients and removes drug salts", () => {
  const a = clinic("a", "2024-01-01", {
    a: rx("a", "losartan potassium 50 mg tablet"), b: rx("b", "potassium chloride 10 mg tablet"),
    c: rx("c", "ferrous fumarate 10 mg tablet"), d: rx("d", "sevelamer carbonate 800 mg tablet"),
  });
  expect(run([a]).medications.map(m => m.ingredient)).toEqual(["ferrous fumarate", "losartan", "potassium chloride", "sevelamer"]);
});

test("ruling out one CKD stage does not erase another confirmed stage", () => {
  const a = clinic("a", "2024-01-01", { old: dx("N18.2", "Chronic kidney disease, stage 2") });
  const b = clinic("b", "2024-01-02", { new_stage: dx("N18.31", "Chronic kidney disease, stage 3a"), old_stage: dx("N18.2", "Chronic kidney disease, stage 2", "R") });
  const problems = run([a, b]).problems;
  expect(problems).toHaveLength(1);
  expect(problems[0]).toMatchObject({ icd10cm: "N18.31", ckd_stage: "G3a", status: "active" });
});
