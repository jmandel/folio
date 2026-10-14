import { test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

type Row = Record<string, unknown>;
const JAN = "2024-01-01T12:00:00-06:00";
const END = "2025-12-31";
function item(id: string, payload: Record<string, Row>, recorded = JAN, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "lakeview", patient: "patient", effective: recorded,
    recorded, narrative: "", payload, ...extra };
}
function lab(id: string, result: Row = {}, order: Row = {}, req: Row = {}, recorded = JAN): FolioItem {
  return item(id, {
    req: { type: "LAB_REQ", REQ_ID: `req-${id}`, COLLECTED_AT: JAN, ...req },
    order: { type: "LAB_ORDER", ORDER_ID: `order-${id}`, REQ_ID: `req-${id}`, ORDER_STATUS: 4,
      ACCESSION: `tube-${id}`, SPECIMEN_COND: "OK", ...order },
    result: { type: "LAB_RESULT", RESULT_ID: `result-${id}`, ORDER_ID: `order-${id}`,
      TEST_CODE: "LK-K", VALUE_TEXT: "4.2", VALUE_NUM: 4.2, UNIT_CODE: "mmol/L", RESULT_STATUS: "F", RESULTED_AT: JAN, ...result },
  }, recorded);
}
function clinic(id: string, rows: Record<string, Row> = {}, at = JAN, visit: Row = {}): FolioItem {
  return item(id, { visit: { type: "CLINIC_VISIT", VISIT_ID: id, VISIT_AT: at, VISIT_TYPE: "FU", ...visit },
    ...Object.fromEntries(Object.entries(rows).map(([key, row]) => [key, { VISIT_ID: id, ...row }])) }, at);
}
function rx(id: string, name = "finerenone 10 mg tablet", extra: Row = {}): Row {
  return { type: "MED_ORDER", RX_ID: id, LV_DRUG_ID: name, DRUG_NAME: name, MED_STATUS: 1,
    START_DATE: "2024-01-01", DOSE_QTY: 10, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", ...extra };
}
function history(id: string, status: number, at: string, extra: Row = {}): Row {
  return { type: "MED_STATUS_HIST", HIST_ID: `${id}-${at}`, RX_ID: id, NEW_STATUS: status, CHANGED_AT: at, ...extra };
}
function dx(code: string, name: string, status = "A"): Row {
  return { type: "VISIT_DX", ICD10CM: code, DX_TEXT: name, DX_STATUS: status, DX_RANK: 1 };
}
function vital(code: string, value: number, no = 1, at = JAN): Row {
  return { type: "VITAL", VITAL_CODE: code, VALUE_NUM: value, READING_NO: no, TAKEN_AT: at,
    UNIT_CODE: code === "WT" ? "kg" : code === "HR" ? "/min" : "mmHg" };
}

test("samples: withdrawn K stays absent, hold persists, CKD is one current stage, no narrative labs", async () => {
  const [{ items }] = await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).json();
  const rows = transform(items, END);
  expect(rows.labs).toHaveLength(4);
  expect(rows.labs.some(x => x.analyte === "potassium")).toBe(false);
  expect(rows.medications[0]).toMatchObject({ ingredient: "finerenone", status: "held", status_since: "2021-10-08" });
  expect(rows.problems).toHaveLength(3);
  expect(rows.problems.find(x => x.icd10cm?.startsWith("N18"))).toMatchObject({ icd10cm: "N18.31", ckd_stage: "G3a", albuminuria: "A3" });
  expect(rows.vitals).toHaveLength(6);
  expect(rows.allergies).toEqual([]);
  expect(transform(items, "2021-10-07").medications[0].status).toBe("active");
  expect(transform(items, "2021-07-10").labs).toEqual([]);
  const reversed = [...items].reverse().map(i => ({ ...i, payload: Object.fromEntries(Object.entries(i.payload).reverse()) }));
  expect(transform(reversed, END)).toEqual(rows);
});

test("recorded-day cutoffs use Chicago in winter and summer, not effective dates or UTC dates", () => {
  for (const [asOf, before, after] of [
    ["2024-01-01", "2024-01-02T05:59:59.999Z", "2024-01-02T06:00:00Z"],
    ["2024-07-01", "2024-07-02T04:59:59.999Z", "2024-07-02T05:00:00Z"],
    ["2024-03-10", "2024-03-11T04:59:59Z", "2024-03-11T05:00:00Z"],
    ["2024-11-03", "2024-11-04T05:59:59Z", "2024-11-04T06:00:00Z"],
  ]) {
    const a = lab("a", {}, {}, {}, before), b = lab("b", {}, {}, {}, after);
    a.effective = b.effective = "2010-01-01";
    expect(transform([a, b], asOf).labs).toHaveLength(1);
  }
});

test("correction chains and retraction do not resurrect earlier items; out-of-scope corrections do nothing", () => {
  const a = lab("a");
  const b = { ...lab("b", { VALUE_TEXT: "4.5" }, {}, {}, "2024-01-02T12:00:00-06:00"), supersedes: ["a"] };
  const c = item("c", {}, "2024-01-03T12:00:00-06:00", { retracts: ["b"] });
  expect(transform([c, a, b], "2024-01-01").labs[0].value).toBe(4.2);
  expect(transform([c, a, b], "2024-01-02").labs[0].value).toBe(4.5);
  expect(transform([c, a, b], "2024-01-03").labs).toEqual([]);
  const other = { ...lab("a"), issuer: "other" };
  expect(transform([c, a, b, other], END).labs).toHaveLength(1);
});

test("VALUE_TEXT controls numeric values and comparators, never the sentinel or an arbitrary numeric prefix", () => {
  const cases = [
    lab("gt", { VALUE_TEXT: ">60", VALUE_NUM: 9999999 }),
    lab("le", { VALUE_TEXT: "<= 0.1", VALUE_NUM: 9999999 }),
    lab("decimal", { VALUE_TEXT: ".7", VALUE_NUM: 999 }),
    lab("text", { VALUE_TEXT: "See comment", VALUE_NUM: 999 }),
    lab("suffix", { VALUE_TEXT: "4.2 unknown", VALUE_NUM: 4.2 }),
  ];
  const rows = transform(cases, END).labs;
  expect(rows).toHaveLength(3);
  expect(rows.map(x => [x.value, x.comparator])).toEqual(expect.arrayContaining([[60, ">"], [0.1, "<="], [0.7, undefined]]));
});

test("all documented analytes, correct thousands/uL units, and no invented LOINC", () => {
  const specs = [
    ["LK-CREAT", "mg/dL", "creatinine", "mg/dL"], ["LK-EGFR09N", "mL/min/1.73m2", "egfr", "mL/min/1.73m2"],
    ["LK-EGFR21", "mL/min/1.73m2", "egfr", "mL/min/1.73m2"], ["LK-NA", "mmol/L", "sodium", "mmol/L"],
    ["LK-K", "mmol/L", "potassium", "mmol/L"], ["LK-GLU", "mg/dL", "glucose", "mg/dL"],
    ["LK-A1C", "%", "a1c", "%"], ["LK-UACR", "mg/g", "uacr", "mg/g"],
    ["LK-WBC", "K/uL", "wbc", "10*3/uL"], ["LK-HGB", "g/dL", "hemoglobin", "g/dL"],
    ["LK-PLT", "K/uL", "platelets", "10*3/uL"], ["LK-CHOL", "mg/dL", "cholesterol", "mg/dL"],
    ["LK-TRIG", "mg/dL", "triglycerides", "mg/dL"], ["LK-HDL", "mg/dL", "hdl", "mg/dL"], ["LK-LDLC", "mg/dL", "ldl", "mg/dL"],
  ];
  for (const [code, unit, analyte, target] of specs) {
    expect(transform([lab(code, { TEST_CODE: code, UNIT_CODE: unit, VALUE_TEXT: "212" })], END).labs[0])
      .toMatchObject({ analyte, unit: target, value: 212 });
  }
  expect(transform([lab("platelets", { TEST_CODE: "LK-PLT", UNIT_CODE: "K/uL" })], END).labs[0].loinc).toBeUndefined();
  expect(transform([lab("unknown", { TEST_CODE: "LK-CBC" }), lab("bad-unit", { UNIT_CODE: "mg/dL" })], END).labs).toEqual([]);
});

test("eGFR excludes race coefficient; method note overrides codes and historical LOINC", () => {
  const base = { UNIT_CODE: "mL/min/1.73m2", LOINC: "48642-3" };
  const rows = transform([
    lab("n", { ...base, TEST_CODE: "LK-EGFR09N", COMMENT_TEXT: "Calculated by CKD-EPI 2009." }),
    lab("a", { ...base, TEST_CODE: "LK-EGFR09A" }),
    lab("mdrd", { ...base, TEST_CODE: "LK-EGFR21", COMMENT_TEXT: "Calculated by MDRD." }),
    lab("2021", { ...base, TEST_CODE: "LK-EGFR09N", COMMENT_TEXT: "Calculated by CKD-EPI 2021. Not MDRD." }),
  ], END).labs;
  expect(rows).toHaveLength(3);
  expect(rows.map(x => x.egfr_equation).sort()).toEqual(["ckd-epi-2009", "ckd-epi-2021", "mdrd"]);
});

test("independent order and result validity, including preliminary and hemolyzed-but-valid values", () => {
  const items: FolioItem[] = [];
  for (const status of ["P", "F", "A", "C", "X"]) {
    for (const order of [3, 4, 5, 9]) items.push(lab(`${status}-${order}`, { RESULT_STATUS: status }, { ORDER_STATUS: order, SPECIMEN_COND: "HEM" }));
  }
  const rows = transform(items, END).labs;
  expect(rows).toHaveLength(6);
  expect(rows.filter(x => x.status === "preliminary")).toHaveLength(2);
});

test("copies use the most advanced status; distinct confirmation repeats both survive", () => {
  const a = lab("a", { RESULT_ID: "same", RESULT_STATUS: "P", VALUE_TEXT: "4.3" });
  const b = lab("b", { RESULT_ID: "same", RESULT_STATUS: "A", VALUE_TEXT: "4.4" });
  const c = lab("c", { RESULT_ID: "same", RESULT_STATUS: "F", VALUE_TEXT: "4.5" });
  expect(transform([a, b, c], END).labs.map(x => x.value)).toEqual([4.4]);
  const repeat = lab("repeat", {}, { REPEAT_OF_ORDER_ID: "order-a", REPEAT_REASON: "CONF", ACCESSION: "tube-a" });
  expect(transform([a, repeat], END).labs).toHaveLength(2);
});

test("medication events persist, holds do not expire, and resumption has its own date/evidence", () => {
  const a = clinic("a", { rx: rx("rx") });
  const b = clinic("b", { hold: history("rx", 3, "2024-02-01T13:00:00-06:00", { REVIEW_DATE: "2024-02-08", COMMENT_TEXT: "K elevated", REASON_CODE: "LAB" }) }, "2024-02-01T14:00:00-06:00");
  const c = clinic("c", { resume: history("rx", 1, "2024-04-01T13:00:00-05:00") }, "2024-04-01T14:00:00-05:00");
  const empty = clinic("empty", {}, "2024-03-01T12:00:00-06:00");
  const held = transform([c, empty, b, a], "2024-03-15").medications[0];
  expect(held).toMatchObject({ status: "held", status_since: "2024-02-01", status_reason_text: "K elevated", dose: { value: 10, unit: "mg" } });
  expect(held.stop_reason).toBeUndefined();
  expect(held.evidence).toEqual(expect.arrayContaining([{ item_id: "a", entry_id: "rx" }, { item_id: "b", entry_id: "hold" }]));
  expect(transform([a, b, c], END).medications[0]).toMatchObject({ status: "active", status_since: "2024-04-01" });
});

test("latest event per ingredient wins, while void orders and void histories cannot hide a real prescription", () => {
  const a = clinic("a", { rx: rx("old") });
  const b = clinic("b", { rx: rx("new", "Kerendia 20 mg tablet", { DOSE_QTY: 20 }) }, "2024-02-01T12:00:00-06:00");
  const c = clinic("c", { hold: history("old", 3, "2024-03-01T12:00:00-06:00") }, "2024-03-01T12:00:00-06:00");
  const d = clinic("d", { rx: rx("void", "finerenone 40 mg tablet", { MED_STATUS: 9 }) }, "2024-04-01T12:00:00-05:00");
  expect(transform([d, c, b, a], END).medications[0]).toMatchObject({ status: "held", dose: { value: 10 } });
  const e = clinic("e", { void: history("old", 9, "2024-05-01T12:00:00-05:00") }, "2024-05-01T12:00:00-05:00");
  expect(transform([e, d, c, b, a], END).medications[0]).toMatchObject({ status: "active", dose: { value: 20 } });
});

test("stopped prescriptions retain dose and coded stop reasons; product RxNorm is not an ingredient CUI", () => {
  for (const [code, reason] of [["ADR", "adverse_reaction"], ["PT", "patient_choice"], ["LAB", "other"]]) {
    const a = clinic("a", { rx: rx("rx", "losartan potassium 50 MG Oral Tablet", { DOSE_QTY: 50, RXNORM: "product-cui" }) });
    const b = clinic("b", { stop: history("rx", 2, "2024-02-01T12:00:00-06:00", { REASON_CODE: code, COMMENT_TEXT: "As documented" }) }, "2024-02-01T12:00:00-06:00");
    const row = transform([a, b], END).medications[0];
    expect(row).toMatchObject({ ingredient: "losartan", status: "stopped", stop_reason: reason, status_since: "2024-02-01", dose: { value: 50, unit: "mg" } });
    expect(row.rxnorm_ingredient).toBeUndefined();
  }
});

test("drug normalization handles brand, insulin units, and combination ingredients; IV excluded", () => {
  const rows = transform([clinic("a", {
    insulin: rx("i", "Lantus 100 unit/mL solution", { DOSE_QTY: 20, DOSE_UNIT: "unit", ROUTE: "SC", FREQ_CODE: "QHS" }),
    combo: rx("combo", "losartan/hydrochlorothiazide 50/12.5 mg tablet"),
    iv: rx("iv", "furosemide 20 mg injection", { ROUTE: "IV" }),
  })], END).medications;
  expect(rows).toHaveLength(3);
  expect(rows.find(x => x.ingredient === "insulin glargine")).toMatchObject({ dose: { value: 20, unit: "units" }, frequency: "QHS" });
  expect(rows.find(x => x.ingredient === "losartan")?.dose).toBeUndefined();
  expect(rows.some(x => x.ingredient === "hydrochlorothiazide")).toBe(true);
});

test("CKD restages to one condition; latest diagnoses, confirmed/history only, no onset invented", () => {
  const a = clinic("a", { ckd: dx("N18.2", "CKD stage 2"), ruled: dx("E87.5", "Hyperkalemia"), hist: dx("N17.9", "Acute kidney injury", "H") }, JAN, { CKD_G: "G2", CKD_A: "A2" });
  const b = clinic("b", { ckd: dx("N18.32", "CKD stage 3b"), ruled: dx("E87.5", "Hyperkalemia", "R"), prov: dx("I50.9", "Heart failure", "P") }, "2024-02-01T12:00:00-06:00", { CKD_G: "G3b" });
  const rows = transform([b, a], END).problems;
  expect(rows).toHaveLength(2);
  expect(rows.find(x => x.icd10cm === "N18.32")).toMatchObject({ ckd_stage: "G3b", albuminuria: "A2", status: "active" });
  expect(rows.find(x => x.icd10cm === "N17.9")).toMatchObject({ status: "resolved" });
  expect(rows.every(x => x.onset === undefined)).toBe(true);
  expect(transform([lab("low-egfr", { TEST_CODE: "LK-EGFR21", UNIT_CODE: "mL/min/1.73m2", VALUE_TEXT: "15" })], END).problems).toEqual([]);
});

test("latest clinician category wins over a conflicting code or lab and carries its evidence", () => {
  const a = clinic("a", { ckd: dx("N18.32", "CKD stage 3b") }, JAN, { CKD_G: "G3a", CKD_A: "A3" });
  const b = clinic("b", {}, "2024-02-01T12:00:00-06:00", { CKD_G: "G4" });
  const row = transform([a, b], END).problems[0];
  expect(row).toMatchObject({ icd10cm: "N18.32", ckd_stage: "G4", albuminuria: "A3" });
  expect(row.evidence).toContainEqual({ item_id: "b", entry_id: "visit" });
});

test("a later unstaged CKD entry preserves the most recently recorded category and its evidence", () => {
  const a = clinic("a", { ckd: dx("N18.32", "CKD stage 3b") });
  const b = clinic("b", { ckd: dx("N18.9", "Chronic kidney disease") }, "2024-02-01T12:00:00-06:00");
  const row = transform([b, a], END).problems[0];
  expect(row).toMatchObject({ icd10cm: "N18.9", ckd_stage: "G3b" });
  expect(row.evidence).toContainEqual({ item_id: "a", entry_id: "ckd" });
});

test("vitals use first BP time, pair READING_NO, keep final repeat, round weight, and localize UTC", () => {
  const rows = transform([clinic("a", {
    weight: vital("WT", 81.26, 1, "2024-01-01T17:58:00Z"),
    sys: vital("BPS", 150, 1, "2024-01-01T18:00:00Z"), dia: vital("BPD", 90, 1, "2024-01-01T18:00:00Z"),
    pulse: vital("HR", 78, 1, "2024-01-01T18:00:00Z"),
    sys2: vital("BPS", 140, 2, "2024-01-01T18:05:00Z"), dia2: vital("BPD", 85, 2, "2024-01-01T18:05:00Z"),
    sys3: vital("BPS", 132, 3, "2024-01-01T18:10:00Z"), dia3: vital("BPD", 80, 3, "2024-01-01T18:10:00Z"),
  })], END).vitals;
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({ local_time: "2024-01-01T12:00", systolic_mmhg: 150, diastolic_mmhg: 90,
    repeat_systolic_mmhg: 132, repeat_diastolic_mmhg: 80, pulse_bpm: 78, weight_kg: 81.3 });
});

test("offset-free times are retained as Chicago wall clocks, including scope at midnight", () => {
  const a = clinic("a", { pulse: vital("HR", 72, 1, "2024-07-01T23:58:30") }, "2024-07-01T23:59:00");
  const b = clinic("b", { pulse: vital("HR", 73, 1, "2024-07-02T00:00:00") }, "2024-07-02T00:00:00");
  expect(transform([a, b], "2024-07-01").vitals.map(x => x.local_time)).toEqual(["2024-07-01T23:58"]);
});

test("drug-attributed diagnoses yield adverse reactions, class resolves only with one same-item drug", () => {
  const a = clinic("a", {
    dka: dx("E11.10", "SGLT2 inhibitor-associated ketoacidosis"),
    rx: rx("rx", "Jardiance 10 mg tablet"),
    ace: dx("T78.3XXA", "ACE inhibitor-associated angioedema", "H"),
  });
  const rows = transform([a], END);
  expect(rows.problems).toHaveLength(2);
  expect(rows.allergies).toEqual(expect.arrayContaining([
    expect.objectContaining({ substance: "empagliflozin", reaction: "ketoacidosis", reaction_type: "serious_adverse_event", mechanism: "non_immune", criticality: "high" }),
    expect.objectContaining({ substance: "ACE inhibitor", reaction_type: "hypersensitivity", mechanism: "non_immune" }),
  ]));
  a.payload.rx2 = { ...rx("rx2", "Farxiga 10 mg tablet"), VISIT_ID: "a" };
  expect(transform([a], END).allergies.some(x => x.substance === "SGLT2 inhibitor")).toBe(true);
});

test("non-drug causal diagnoses and a medication hold for labs are not allergies", () => {
  const a = clinic("a", { dx: dx("N17.9", "Acute kidney injury due to dehydration"), rx: rx("rx") });
  const b = clinic("b", { hold: history("rx", 3, JAN, { REASON_CODE: "LAB", COMMENT_TEXT: "K elevated" }) });
  expect(transform([a, b], END).allergies).toEqual([]);
});

test("unreadable payloads, invalid dates and orphan rows do not throw or create facts", () => {
  const bad = [null, 0, "text", {}, { id: "a", issuer: "x", recorded: "not-a-date" },
    item("a", { unknown: { type: "unknown" }, orphan: { type: "LAB_RESULT", VALUE_TEXT: "2" } }),
    { ...clinic("x"), payload: { x: null, y: [], z: false } },
    lab("bad", {}, {}, { COLLECTED_AT: "2024-02-30T12:00:00-06:00" }),
  ] as FolioItem[];
  expect(transform(bad, END)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  expect(transform(null as unknown as FolioItem[], END).labs).toEqual([]);
  expect(transform([], null as unknown as string).labs).toEqual([]);
});
