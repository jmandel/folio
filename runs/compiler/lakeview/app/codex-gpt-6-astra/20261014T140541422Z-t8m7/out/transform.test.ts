import { describe, test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const day = "2024-01-10";
function item(id: string, payload: Record<string, any>, recorded = `${day}T18:00:00-06:00`, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "lakeview", patient: "p", effective: `${day}T09:00:00-06:00`, recorded, narrative: "", payload, ...extra };
}
function clinic(id: string, date: string, rows: Record<string, any> = {}, fields: Record<string, any> = {}): FolioItem {
  return item(id, {
    visit: { type: "CLINIC_VISIT", VISIT_ID: id, VISIT_TYPE: "FU", VISIT_AT: `${date}T09:00:00-06:00`, ...fields },
    ...Object.fromEntries(Object.entries(rows).map(([k, r]) => [k, { VISIT_ID: id, ...r }])),
  }, `${date}T18:00:00-06:00`);
}
function rx(id: string, fields: Record<string, any> = {}) {
  return { type: "MED_ORDER", RX_ID: id, LV_DRUG_ID: "drug", DRUG_NAME: "finerenone 10 mg tablet", MED_STATUS: 1,
    DOSE_QTY: 10, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", START_DATE: "2024-01-01", ...fields };
}
function hist(rxid: string, date: string, status: number, fields: Record<string, any> = {}) {
  return { type: "MED_STATUS_HIST", HIST_ID: `${date}-${status}`, RX_ID: rxid,
    OLD_STATUS: 1, NEW_STATUS: status, CHANGED_AT: `${date}T10:00:00-06:00`, REASON_CODE: "LAB", ...fields };
}
function dx(code: string, name: string, status = "A") {
  return { type: "VISIT_DX", DX_RANK: 1, ICD10CM: code, DX_TEXT: name, DX_STATUS: status };
}
function lab(id: string, rows: Record<string, any>, fields: Record<string, any> = {}): FolioItem {
  return item(id, {
    req: { type: "LAB_REQ", REQ_ID: `q-${id}`, COLLECTED_AT: `${day}T08:00:00-06:00` },
    order: { type: "LAB_ORDER", ORDER_ID: `o-${id}`, REQ_ID: `q-${id}`, ORDER_STATUS: 4, SPECIMEN_COND: "OK", ...fields },
    ...Object.fromEntries(Object.entries(rows).map(([k, r]) => [k, { ORDER_ID: `o-${id}`, ...r }])),
  });
}
function result(id: string, code = "LK-K", fields: Record<string, any> = {}) {
  return { type: "LAB_RESULT", RESULT_ID: id, TEST_CODE: code, RESULT_STATUS: "F", VALUE_TEXT: "4.2",
    VALUE_NUM: 4.2, UNIT_CODE: "mmol/L", RESULTED_AT: `${day}T10:00:00-06:00`, ...fields };
}

describe("publication scope and corrections", () => {
  test("recorded cutoff is Chicago midnight, including a delayed correction", () => {
    const original = lab("old", { r: result("r") });
    const corrected = lab("new", { r: result("r", "LK-K", { RESULT_STATUS: "C" }) });
    corrected.supersedes = ["old"];
    corrected.recorded = "2024-01-11T06:00:00Z";
    expect(transform([corrected, original], day).labs).toHaveLength(1);
    expect(transform([original, corrected], "2024-01-11").labs).toHaveLength(0);
    corrected.recorded = "2024-01-11T05:59:59.999Z";
    expect(transform([corrected, original], day).labs).toHaveLength(0);
  });
  test("transitive supersession and retraction never resurrect an old version", () => {
    const a = lab("a", { r: result("r") });
    const b = { ...a, id: "b", supersedes: ["a"] };
    const c = { ...a, id: "c", supersedes: ["b"] };
    const r = item("r", {}, undefined, { retracts: ["c"] });
    expect(transform([r, b, a, c], day).labs).toEqual([]);
  });
  test("correction IDs are scoped by issuer", () => {
    const a = lab("a", { r: result("r") });
    const other = item("r", {}, undefined, { issuer: "other", retracts: ["a"] });
    expect(transform([other, a], day).labs).toHaveLength(1);
  });
  test("summer and winter UTC boundaries use their respective offsets", () => {
    const a = lab("a", { r: result("r") });
    a.recorded = "2024-07-11T04:59:59Z";
    expect(transform([a], "2024-07-10").labs).toHaveLength(1);
    a.recorded = "2024-07-11T05:00:00Z";
    expect(transform([a], "2024-07-10").labs).toHaveLength(0);
  });
});

describe("laboratory semantics", () => {
  test("withdrawn, not performed, void and cancelled orders do not yield values", () => {
    const items = [
      lab("c", { c: result("c", "LK-K", { RESULT_STATUS: "C" }) }),
      lab("x", { x: result("x", "LK-K", { RESULT_STATUS: "X" }) }),
      lab("void", { v: result("v") }, { ORDER_STATUS: 9 }),
      lab("cancel", { v: result("cancel") }, { ORDER_STATUS: 5 }),
      lab("a", { a: result("a", "LK-K", { RESULT_STATUS: "A", VALUE_TEXT: "4.7" }) }),
      lab("p", { p: result("p", "LK-K", { RESULT_STATUS: "P" }) }, { ORDER_STATUS: 3 }),
    ];
    const rows = transform(items, day).labs;
    expect(rows.map(r => [r.value, r.status])).toEqual([[4.7, "final"], [4.2, "preliminary"]]);
  });
  test("VALUE_TEXT controls numeric values, comparator sentinels and nonnumeric values", () => {
    const rows = transform([lab("a", {
      a: result("a", "LK-EGFR09N", { VALUE_TEXT: ">60", VALUE_NUM: 9999999, UNIT_CODE: "mL/min/1.73m2", LOINC: "48642-3", COMMENT_TEXT: "Calculated by CKD-EPI 2009." }),
      b: result("b", "LK-EGFR09A", { VALUE_TEXT: ">60", VALUE_NUM: 9999999, UNIT_CODE: "mL/min/1.73m2" }),
      c: result("c", "LK-K", { VALUE_TEXT: "<= 0.5", VALUE_NUM: 9999999 }),
      d: result("d", "LK-K", { VALUE_TEXT: "See comment", VALUE_NUM: 1 }),
      e: result("e", "LK-PLT", { VALUE_TEXT: "212", VALUE_NUM: 999, UNIT_CODE: "K/uL" }),
    })], day).labs;
    expect(rows.map(r => [r.analyte, r.value, r.comparator, r.unit])).toEqual([
      ["egfr", 60, ">", "mL/min/1.73m2"], ["platelets", 212, undefined, "10*3/uL"], ["potassium", 0.5, "<=", "mmol/L"],
    ]);
    expect(rows[0].egfr_equation).toBe("ckd-epi-2009");
    expect(rows[2].loinc).toBeUndefined();
  });
  test("eGFR follows the method note and the actual printed value", () => {
    const rows = transform([lab("a", {
      a: result("a", "LK-EGFR21", { VALUE_TEXT: "53", UNIT_CODE: "mL/min/1.73m2", COMMENT_TEXT: "Calculated with MDRD equation." }),
      b: result("b", "LK-EGFR09N", { VALUE_TEXT: "52", UNIT_CODE: "mL/min/1.73m2", LOINC: "48642-3" }),
    })], day).labs;
    expect(rows.map(r => [r.value, r.egfr_equation])).toEqual([[53, "mdrd"], [52, "ckd-epi-2009"]]);
  });
  test("a confirmation repeat and hemolyzed-but-still-final result both stand", () => {
    const a = lab("a", { a: result("a") }, { SPECIMEN_COND: "HEM" });
    const b = lab("b", { b: result("b") }, { REPEAT_OF_ORDER_ID: "o-a", REPEAT_REASON: "CONF" });
    expect(transform([a, b], day).labs).toHaveLength(2);
  });
  test("duplicate result identity prefers final over preliminary regardless of input order", () => {
    const p = lab("p", { r: result("same", "LK-K", { RESULT_STATUS: "P", VALUE_TEXT: "4.1" }) });
    const f = lab("f", { r: result("same", "LK-K", { VALUE_TEXT: "4.4" }) });
    for (const items of [[p, f], [f, p]]) expect(transform(items, day).labs.map(r => r.value)).toEqual([4.4]);
  });
  test("all source component codes map, while panel codes and unknown codes do not", () => {
    const units = {
      "LK-CREAT": "mg/dL", "LK-NA": "mmol/L", "LK-GLU": "mg/dL", "LK-A1C": "%", "LK-UACR": "mg/g",
      "LK-WBC": "K/uL", "LK-HGB": "g/dL", "LK-CHOL": "mg/dL", "LK-TRIG": "mg/dL", "LK-HDL": "mg/dL", "LK-LDLC": "mg/dL",
    };
    const payload = Object.fromEntries(Object.entries(units).map(([code, unit]) => [code, result(code, code, { UNIT_CODE: unit })]));
    payload.panel = result("panel", "LK-CBC");
    payload.unknown = result("unknown", "LK-NOT-A-CODE");
    const rows = transform([lab("a", payload)], day).labs;
    expect(rows).toHaveLength(11);
    expect(rows.find(r => r.analyte === "wbc")?.unit).toBe("10*3/uL");
  });
});

describe("medication events", () => {
  const start = clinic("start", "2024-01-01", { rx: rx("rx") });
  const hold = clinic("hold", "2024-01-02", { hold: hist("rx", "2024-01-02", 3, { REVIEW_DATE: "2024-01-03", COMMENT_TEXT: "K elevated" }) });
  test("hold persists past review date and unrelated visits; resume is explicit", () => {
    const held = transform([hold, start, clinic("later", "2024-01-09")], day).medications[0];
    expect(held).toMatchObject({ ingredient: "finerenone", status: "held", status_since: "2024-01-02", status_reason_text: "K elevated", dose: { value: 10, unit: "mg" } });
    expect(held.stop_reason).toBeUndefined();
    expect(held.rxnorm_ingredient).toBeUndefined();
    expect(held.evidence).toContainEqual({ item_id: "hold", entry_id: "hold" });
    const resume = clinic("resume", "2024-01-05", { resume: hist("rx", "2024-01-05", 1) });
    expect(transform([hold, resume, start], day).medications[0]).toMatchObject({ status: "active", status_since: "2024-01-05" });
    expect(transform([hold, resume, start], day).medications[0].status_reason_text).toBeUndefined();
  });
  test("an old prescription's later status event wins over a newer prescription", () => {
    const newer = clinic("new", "2024-01-03", { rx: rx("rx-new", { DOSE_QTY: 20 }) });
    const stopped = clinic("stop", "2024-01-05", { stop: hist("rx", "2024-01-05", 2, { REASON_CODE: "ADR", COMMENT_TEXT: "Adverse reaction" }) });
    expect(transform([start, newer, stopped], day).medications[0]).toMatchObject({ status: "stopped", dose: { value: 10, unit: "mg" }, stop_reason: "adverse_reaction", status_since: "2024-01-05" });
  });
  test("void histories and void base orders cannot hide another prescription", () => {
    const newer = clinic("new", "2024-01-03", { rx: rx("rx-new", { DOSE_QTY: 20 }) });
    const error = clinic("error", "2024-01-05", { error: hist("rx-new", "2024-01-05", 9) });
    const baseError = clinic("base-error", "2024-01-06", { rx: rx("bad", { MED_STATUS: 9 }) });
    expect(transform([start, newer, error, baseError], day).medications[0]).toMatchObject({ status: "active", dose: { value: 10, unit: "mg" } });
  });
  test("retracting a status contact restores the surviving base state, not the deleted event", () => {
    const retract = item("retract", {}, undefined, { retracts: ["hold"] });
    expect(transform([start, hold, retract], day).medications[0].status).toBe("active");
    retract.retracts = ["start"];
    expect(transform([start, hold, retract], day).medications).toHaveLength(0);
  });
  test("names, units and codes are normalized without promoting product RxNorm codes", () => {
    const source = clinic("a", "2024-01-02", {
      brand: rx("one", { DRUG_NAME: "Jardiance 10 mg tablet", RXNORM: "product", LV_DRUG_ID: "one" }),
      salt: rx("two", { DRUG_NAME: "losartan potassium 50 mg tablet", DOSE_QTY: 50, LV_DRUG_ID: "two", FREQ_CODE: "BID" }),
      insulin: rx("three", { DRUG_NAME: "insulin glargine 100 unit/mL injection", DOSE_QTY: 20, DOSE_UNIT: "unit", ROUTE: "SC", FREQ_CODE: "QHS", LV_DRUG_ID: "three" }),
      iv: rx("four", { DRUG_NAME: "iron sucrose", ROUTE: "IV" }),
    });
    const rows = transform([source], day).medications;
    expect(rows.map(r => r.ingredient)).toEqual(["empagliflozin", "insulin glargine", "losartan"]);
    expect(rows[1].dose).toEqual({ value: 20, unit: "units" });
    expect(rows[0].rxnorm_ingredient).toBeUndefined();
  });
  test("a new order is in the record even when its prescribed start is tomorrow", () => {
    const source = clinic("a", "2024-01-01", { rx: rx("r", { START_DATE: "2024-01-02" }) });
    expect(transform([source], "2024-01-01").medications[0]).toMatchObject({ status: "active", status_since: "2024-01-02" });
  });
});

describe("conditions and drug reactions", () => {
  test("CKD stages coalesce; later absent assessments retain the last recorded categories", () => {
    const a = clinic("a", "2024-01-01", { dx: dx("N18.2", "CKD stage 2") }, { CKD_G: "G2", CKD_A: "A2" });
    const b = clinic("b", "2024-01-02", { dx: dx("N18.31", "CKD stage 3a") }, { CKD_G: "G3b", CKD_A: "A3" });
    const c = clinic("c", "2024-01-03", { dx: dx("N18.9", "Chronic kidney disease, unspecified") });
    const rows = transform([c, b, a], day).problems;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ icd10cm: "N18.9", ckd_stage: "G3b", albuminuria: "A3" });
    expect(rows[0].onset).toBeUndefined();
    expect(rows[0].evidence).toContainEqual({ item_id: "b", entry_id: "visit" });
  });
  test("a new staged diagnosis outranks an older category; no laboratory stage inference", () => {
    const a = clinic("a", "2024-01-01", { dx: dx("N18.2", "CKD stage 2") }, { CKD_G: "G2" });
    const b = clinic("b", "2024-01-02", { dx: dx("N18.4", "CKD stage 4") });
    const l = lab("l", { r: result("egfr", "LK-EGFR21", { VALUE_TEXT: "80", UNIT_CODE: "mL/min/1.73m2" }) });
    expect(transform([a, b, l], day).problems[0].ckd_stage).toBe("G4");
  });
  test("recoding diabetes and hypertension does not duplicate either condition", () => {
    const a = clinic("a", "2024-01-01", {
      dm: dx("E11.9", "Type 2 diabetes mellitus without complications"), ht: dx("I10", "Essential (primary) hypertension"),
    });
    const b = clinic("b", "2024-01-02", {
      dm: dx("E11.22", "Type 2 diabetes mellitus with diabetic chronic kidney disease"),
      ht: dx("I12.9", "Hypertensive chronic kidney disease"),
      acute: dx("E11.10", "SGLT2 inhibitor-associated ketoacidosis"),
    });
    expect(transform([a, b], day).problems.map(p => p.icd10cm)).toEqual(["E11.10", "E11.22", "I12.9"]);
  });
  test("latest per-code statuses exclude ruled-out and never-confirmed problems", () => {
    const a = clinic("a", "2024-01-01", { one: dx("A", "one"), two: dx("B", "two", "P"), three: dx("C", "three", "H") });
    const b = clinic("b", "2024-01-02", { one: dx("A", "one", "R") });
    expect(transform([a, b], day).problems.map(r => [r.condition, r.status])).toEqual([["three", "resolved"]]);
  });
  test("a prior confirmation supports a later working entry until explicitly ruled out", () => {
    const a = clinic("a", "2024-01-01", { dx: dx("Z", "condition") });
    const b = clinic("b", "2024-01-02", { dx: dx("Z", "condition", "P") });
    expect(transform([a, b], day).problems).toHaveLength(1);
    const r = clinic("r", "2024-01-03", { dx: dx("Z", "condition", "R") });
    const p = clinic("p", "2024-01-04", { dx: dx("Z", "condition", "P") });
    expect(transform([a, b, r, p], day).problems).toHaveLength(0);
  });
  test("an attributed diagnosis yields a problem and reaction, resolving a class only within its item", () => {
    const a = clinic("a", "2024-01-01", {
      dx: dx("E11.10", "SGLT2 inhibitor-associated ketoacidosis"),
      rx: rx("r", { DRUG_NAME: "Jardiance 10 mg tablet", MED_STATUS: 2 }),
    });
    const rows = transform([a], day);
    expect(rows.problems).toHaveLength(1);
    expect(rows.allergies[0]).toMatchObject({ substance: "empagliflozin", reaction: "ketoacidosis", reaction_type: "serious_adverse_event", mechanism: "non_immune", criticality: "high" });
    a.payload.second = { ...a.payload.rx, RX_ID: "another", DRUG_NAME: "dapagliflozin 10 mg tablet" };
    expect(transform([a], day).allergies[0].substance).toBe("SGLT2 inhibitor");
  });
  test("ACE angioedema is hypersensitivity-type but non-immune; non-drug causes are not allergies", () => {
    const a = clinic("a", "2024-01-01", {
      dx: dx("T78.3", "lisinopril-induced angioedema"),
      renal: dx("N17.9", "Acute kidney injury due to dehydration"),
    });
    expect(transform([a], day).allergies).toHaveLength(1);
    expect(transform([a], day).allergies[0]).toMatchObject({ substance: "lisinopril", reaction_type: "hypersensitivity", mechanism: "non_immune", criticality: "high" });
  });
});

describe("vital sets and robustness", () => {
  function vital(code: string, value: number, reading: number, at: string) {
    return { type: "VITAL", VITAL_CODE: code, VALUE_NUM: value, READING_NO: reading,
      UNIT_CODE: code === "WT" ? "kg" : code === "HR" ? "/min" : "mmHg", TAKEN_AT: at };
  }
  test("one visit yields paired first and last BP, pulse and rounded weight; BP sets the time", () => {
    const a = clinic("a", "2024-01-01", {
      wt: vital("WT", 83.456, 1, "2024-01-01T08:58:00-06:00"),
      sys: vital("BPS", 150, 1, "2024-01-01T09:00:00-06:00"),
      dia: vital("BPD", 88, 1, "2024-01-01T09:00:00-06:00"),
      pulse: vital("HR", 60, 1, "2024-01-01T09:01:00-06:00"),
      rsys: vital("BPS", 130, 2, "2024-01-01T09:10:00-06:00"),
      rdia: vital("BPD", 80, 2, "2024-01-01T09:10:00-06:00"),
    });
    const rows = transform([a], day).vitals;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ local_time: "2024-01-01T09:00", systolic_mmhg: 150, diastolic_mmhg: 88,
      repeat_systolic_mmhg: 130, repeat_diastolic_mmhg: 80, pulse_bpm: 60, weight_kg: 83.5 });
    expect(rows[0].evidence).toHaveLength(6);
  });
  test("offset-free timestamps retain their written Chicago wall time", () => {
    const a = clinic("a", "2024-01-01", { pulse: vital("HR", 60, 1, "2024-07-01T09:01:00") });
    a.recorded = "2024-07-01T23:59:00";
    expect(transform([a], "2024-07-01").vitals[0].local_time).toBe("2024-07-01T09:01");
    expect(transform([a], "2024-06-30").vitals).toHaveLength(0);
  });
  test("unpaired BP readings stay separate instead of forming an invented pair", () => {
    const a = clinic("a", "2024-01-01", {
      sys: vital("BPS", 150, 1, "2024-01-01T09:00:00-06:00"),
      dia: vital("BPD", 80, 2, "2024-01-01T09:10:00-06:00"),
    });
    const row = transform([a], day).vitals[0];
    expect(row.systolic_mmhg).toBe(150);
    expect(row.diastolic_mmhg).toBeUndefined();
    expect(row.repeat_systolic_mmhg).toBeUndefined();
    expect(row.repeat_diastolic_mmhg).toBe(80);
  });
  test("malformed data are skipped without throwing or mutating input", () => {
    const malformed: any[] = [null, 3, "x", {}, { id: "a", issuer: "x", recorded: "invalid" }, item("ok", { a: null, b: [], c: { type: "LAB_RESULT", RESULT_ID: "r" }, d: { type: "VITAL" } })];
    expect(transform(malformed, day)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
    expect(transform(undefined as any, undefined as any)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
    expect(transform([], undefined as any)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
    const valid = clinic("a", "2024-01-01", { rx: rx("r") });
    const before = JSON.stringify(valid);
    transform([valid], day);
    expect(JSON.stringify(valid)).toBe(before);
  });
  test("input item order and payload entry order do not change the output", async () => {
    const [{ items }] = await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).json();
    const expected = transform(items, "2026-10-13");
    for (let n = 0; n < items.length; n++) {
      const order = [...items.slice(n), ...items.slice(0, n)].reverse().map(i => ({ ...i, payload: Object.fromEntries(Object.entries(i.payload).reverse()) }));
      expect(transform(order, "2026-10-13")).toEqual(expected);
    }
    expect(expected.medications[0].status).toBe("held");
    expect(expected.labs).toHaveLength(4);
    expect(expected.vitals).toHaveLength(6);
    expect(expected.problems).toHaveLength(3);
  });
});
