import { test, expect } from "bun:test";
import { transform } from "./transform";
import samples from "../in/samples/samples.json";
import type { FolioItem } from "../in/views/views";

function item(id: string, date: string, payload: Record<string, any>, extra: Record<string, any> = {}): FolioItem {
  return { folio: "0.1", issuer: "lakeview", patient: "patient", id, effective: date, recorded: date, narrative: "", payload, ...extra };
}
function clinic(id: string, date: string, rows: Record<string, any>, extra: Record<string, any> = {}) {
  return item(id, date, { visit: { type: "CLINIC_VISIT", VISIT_ID: id, VISIT_AT: date, VISIT_TYPE: "FU" },
    ...Object.fromEntries(Object.entries(rows).map(([k, row]) => [k, { VISIT_ID: id, ...row }])) }, extra);
}
function lab(id: string, date: string, result: Record<string, any> = {}, order: Record<string, any> = {}, extra: Record<string, any> = {}) {
  return item(id, date, {
    req: { type: "LAB_REQ", REQ_ID: id + "-req", COLLECTED_AT: date },
    order: { type: "LAB_ORDER", REQ_ID: id + "-req", ORDER_ID: id + "-order", ORDER_STATUS: 4,
      STATUS_AT: date, SPECIMEN_COND: "OK", ACCESSION: id + "-tube", ...order },
    result: { type: "LAB_RESULT", RESULT_ID: id + "-result", ORDER_ID: id + "-order", TEST_CODE: "LK-K", VALUE_TEXT: "4.7",
      VALUE_NUM: 4.7, UNIT_CODE: "mmol/L", RESULT_STATUS: "F", RESULTED_AT: date, ...result },
  }, extra);
}
const rx = (id: string, name = "finerenone 10 mg tablet", extra: Record<string, any> = {}) => ({
  type: "MED_ORDER", RX_ID: id, LV_DRUG_ID: name, DRUG_NAME: name, DOSE_QTY: 10, DOSE_UNIT: "mg", ROUTE: "PO",
  FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2024-01-01", RXNORM: "product-not-ingredient", ...extra,
});
const hist = (rx: string, date: string, status: number, extra: Record<string, any> = {}) => ({
  type: "MED_STATUS_HIST", RX_ID: rx, HIST_ID: date, CHANGED_AT: date, OLD_STATUS: 1, NEW_STATUS: status, ...extra,
});
const dx = (code: string, text: string, status = "A") => ({ type: "VISIT_DX", ICD10CM: code, DX_TEXT: text, DX_STATUS: status, DX_RANK: 1 });
const at = (items: FolioItem[], date = "2026-10-13") => transform(items, date);

test("samples: structured labs only, durable hold, one restaged CKD and partial onsets", () => {
  const rows = at(samples[0].items);
  expect(rows.labs).toHaveLength(4);
  expect(rows.labs.find(x => x.analyte === "potassium")).toBeUndefined();
  expect(rows.labs.find(x => x.analyte === "egfr")).toMatchObject({ value: 61, egfr_equation: "ckd-epi-2009", loinc: "48642-3" });
  expect(rows.medications[0]).toMatchObject({ ingredient: "finerenone", status: "held", status_since: "2021-10-08" });
  expect(rows.problems).toHaveLength(3);
  expect(rows.problems.find(x => x.icd10cm === "N18.31")).toMatchObject({ ckd_stage: "G3a", albuminuria: "A3" });
  expect(rows.problems.find(x => x.icd10cm === "E11.22")?.onset).toEqual({ value: "2015", precision: "year" });
  expect(rows.problems.find(x => x.icd10cm === "I12.9")?.onset).toEqual({ value: "2010-11", precision: "month" });
  expect(rows.allergies).toEqual([]);
  expect(rows.vitals).toHaveLength(6);
  expect(at(samples[0].items, "2021-09-07").medications[0]).toMatchObject({ status: "active", status_since: "2021-09-08" });
  expect(at(samples[0].items, "2021-07-10")).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});

test("as-of uses Chicago recorded date, including DST and offsetless dates", () => {
  const a = lab("a", "2024-07-02T04:59:59.999Z");
  const b = lab("b", "2024-07-02T05:00:00Z");
  const c = lab("c", "2024-07-01T23:59:59.999");
  expect(at([a, b, c], "2024-07-01").labs).toHaveLength(2);
  expect(at([lab("d", "2024-01-02T05:59:59Z"), lab("e", "2024-01-02T06:00:00Z")], "2024-01-01").labs).toHaveLength(1);
  const offsetless = at([c]).labs[0];
  expect(offsetless.collected).toBe("2024-07-01T23:59:59.999-05:00");
  expect(at([lab("spring", "2024-03-10T03:30:00")]).labs[0].collected).toBe("2024-03-10T03:30:00-05:00");
  expect(at([lab("winter", "2024-01-01T08:00")]).labs[0].collected).toBe("2024-01-01T08:00:00-06:00");
});

test("supersession chains, retractions, future corrections, and issuer boundaries", () => {
  const a = lab("a", "2024-01-01T10:00-06:00");
  const b = lab("b", "2024-01-02T10:00-06:00", { VALUE_TEXT: "5" }, {}, { supersedes: ["a"] });
  const c = item("c", "2024-01-03T10:00-06:00", {}, { supersedes: ["b"] });
  const d = item("d", "2024-01-02T11:00-06:00", {}, { retracts: ["a"], issuer: "other" });
  expect(at([a, b, c, d], "2024-01-01").labs[0].value).toBe(4.7);
  expect(at([a, b, c, d], "2024-01-02").labs[0].value).toBe(5);
  expect(at([a, b, c, d], "2024-01-03").labs).toHaveLength(0);
  expect(at([a, d]).labs).toHaveLength(1);
  expect(at([a, item("retract", "2024-01-04", {}, { retracts: ["a"] })]).labs).toHaveLength(0);
});

test("result and order validity are independent; hemolysis alone is not withdrawal", () => {
  const date = "2024-01-01T10:00-06:00";
  const rows = at([
    lab("valid", date, {}, { SPECIMEN_COND: "HEM" }),
    lab("void", date, {}, { ORDER_STATUS: 9 }),
    lab("cancelled", date, {}, { ORDER_STATUS: 5 }),
    lab("withdrawn", date, { RESULT_STATUS: "C" }),
    lab("not-performed", date, { RESULT_STATUS: "X", VALUE_TEXT: "Not done: QNS", VALUE_NUM: null }),
    lab("amended", date, { RESULT_STATUS: "A", VALUE_TEXT: "5.1" }),
    lab("preliminary", date, { RESULT_STATUS: "P" }, { ORDER_STATUS: 3 }),
    lab("comment-only", date, { VALUE_TEXT: "See comment", VALUE_NUM: 5 }),
  ]).labs;
  expect(rows).toHaveLength(3);
  expect(rows.filter(x => x.status === "preliminary")).toHaveLength(1);
  expect(rows.some(x => x.value === 5.1 && x.status === "final")).toBe(true);
});

test("every reportable Lakeview code, units, sentinels, and historical LOINCs", () => {
  const codes = ["CREAT", "EGFR09N", "EGFR09A", "EGFR21", "K", "NA", "GLU", "A1C", "UACR", "PLT", "WBC", "HGB", "CHOL", "TRIG", "HDL", "LDLC"];
  const units = ["mg/dL", "mL/min/1.73m2", "mL/min/1.73m2", "mL/min/1.73m2", "mmol/L", "mmol/L", "mg/dL", "%", "mg/g", "K/uL", "K/uL", "g/dL", "mg/dL", "mg/dL", "mg/dL", "mg/dL"];
  const input = codes.map((code, i) => lab(code, "2024-01-01T10:00-06:00", {
    TEST_CODE: "LK-" + code, UNIT_CODE: units[i], VALUE_TEXT: code.startsWith("EGFR") ? ">90" : "212", VALUE_NUM: 9999999,
  }));
  const rows = at(input).labs;
  expect(rows).toHaveLength(15);
  expect(rows.filter(x => x.analyte === "egfr").map(x => [x.value, x.comparator])).toEqual([[90, ">"], [90, ">"]]);
  expect(rows.find(x => x.analyte === "platelets")).toMatchObject({ value: 212, unit: "10*3/uL" });
  expect(rows.every(x => !x.loinc)).toBe(true);
  expect(at([lab("u", "2024-01-01", { VALUE_TEXT: "<= 0.1" })]).labs[0]).toMatchObject({ value: 0.1, comparator: "<=" });
});

test("confirmation repeats remain separate; repeated copies prefer final and combine evidence", () => {
  const a = lab("a", "2024-01-01T10:00-06:00");
  const b = lab("b", "2024-01-01T12:00-06:00", {}, { REPEAT_OF_ORDER_ID: "a-order", REPEAT_REASON: "CONF" });
  const p = lab("p", "2024-01-01T10:00-06:00", { RESULT_ID: "shared", RESULT_STATUS: "P" });
  const f = lab("f", "2024-01-01T11:00-06:00", { RESULT_ID: "shared", RESULT_STATUS: "F", VALUE_TEXT: "4.8" });
  const rows = at([b, p, a, f]).labs;
  expect(rows).toHaveLength(3);
  const final = rows.find(x => x.value === 4.8)!;
  expect(final.status).toBe("final");
  expect(final.evidence.some(e => e.item_id === "p")).toBe(true);
  expect(final.evidence.some(e => e.item_id === "f")).toBe(true);
});

test("medication history is chronological, persistent, and does not expose product RxNorm as ingredient", () => {
  const start = clinic("start", "2024-01-01", { rx: rx("rx") });
  const hold = clinic("hold", "2024-02-01", { h: hist("rx", "2024-02-01T03:30:00Z", 3, { REVIEW_DATE: "2024-02-10", REASON_CODE: "LAB", COMMENT_TEXT: "high potassium" }) });
  const resume = clinic("resume", "2024-03-01", { h: hist("rx", "2024-03-01T12:00-06:00", 1) });
  expect(at([resume, start, hold], "2024-02-28").medications[0]).toMatchObject({ status: "held", status_since: "2024-01-31", status_reason_text: "high potassium" });
  const resumed = at([resume, hold, start]).medications[0];
  expect(resumed).toMatchObject({ status: "active", status_since: "2024-03-01" });
  expect(resumed.status_reason_text).toBeUndefined();
  expect(resumed.rxnorm_ingredient).toBeUndefined();
  expect(resumed.stop_reason).toBeUndefined();
});

test("same ingredient: newest prescription event wins, including a later event on an older prescription", () => {
  const old = clinic("old", "2024-01-01", { rx: rx("old", "metoprolol tartrate 25 mg tablet") });
  const next = clinic("new", "2024-02-01", { rx: rx("new", "metoprolol succinate 50 mg tablet", { START_DATE: "2024-02-01", DOSE_QTY: 50 }) });
  const stop = clinic("stop", "2024-03-01", { h: hist("old", "2024-03-01", 2, { REASON_CODE: "ADR", COMMENT_TEXT: "dizziness" }) });
  expect(at([old, next], "2024-02-01").medications).toHaveLength(1);
  expect(at([old, next], "2024-02-01").medications[0]).toMatchObject({ ingredient: "metoprolol", dose: { value: 50, unit: "mg" } });
  expect(at([old, next, stop]).medications[0]).toMatchObject({ status: "stopped", stop_reason: "adverse_reaction", dose: { value: 10, unit: "mg" } });
  const error = clinic("error", "2024-04-01", { h: hist("old", "2024-04-01", 9, { REASON_CODE: "ERR" }) });
  expect(at([old, next, stop, error]).medications[0].status).toBe("active");
});

test("medication dose/frequency mappings and status with no known start of hold", () => {
  const rows = at([clinic("m", "2024-01-01", {
    insulin: rx("ins", "insulin glargine 100 unit/mL solution", { DOSE_UNIT: "unit", DOSE_QTY: 12, FREQ_CODE: "QHS" }),
    held: rx("held", "furosemide 40 mg tablet", { MED_STATUS: 3 }),
    error: rx("err", "lisinopril 10 mg tablet", { MED_STATUS: 9 }),
  })]).medications;
  expect(rows).toHaveLength(2);
  expect(rows.find(x => x.ingredient === "insulin glargine")).toMatchObject({ dose: { value: 12, unit: "units" }, frequency: "QHS" });
  expect(rows.find(x => x.ingredient === "furosemide")?.status_since).toBeUndefined();
});

test("problem resolution, refutation, provisional diagnosis, and independent clinician staging", () => {
  const a = clinic("a", "2024-01-01", {
    ckd: dx("N18.2", "Chronic kidney disease stage 2"), provisional: dx("N04.9", "Nephrotic syndrome", "P"),
    resolved: dx("N17.9", "Acute kidney injury", "H"), ruled: dx("E87.5", "Hyperkalemia"),
  });
  a.payload.visit.CKD_G = "G2"; a.payload.visit.CKD_A = "A3";
  const b = clinic("b", "2024-02-01", { ckd: dx("N18.32", "Chronic kidney disease stage 3b"), ruled: dx("E87.5", "Hyperkalemia", "R") });
  b.payload.visit.CKD_G = "G3b";
  const tel = clinic("tel", "2024-03-01", {});
  const rows = at([a, b, tel]).problems;
  expect(rows).toHaveLength(2);
  expect(rows.find(x => x.icd10cm === "N18.32")).toMatchObject({ ckd_stage: "G3b", albuminuria: "A3" });
  expect(rows.find(x => x.icd10cm === "N17.9")?.status).toBe("resolved");
});

test("blood pressure pairing, latest repeat, time of BP rather than earlier weight", () => {
  const vital = (code: string, n: number, value: number, t: string) => ({ type: "VITAL", VITAL_CODE: code, READING_NO: n,
    VALUE_NUM: value, UNIT_CODE: code === "WT" ? "kg" : code === "HR" ? "/min" : "mmHg", TAKEN_AT: t });
  const row = at([clinic("v", "2024-07-01T15:00Z", {
    weight: vital("WT", 1, 72.26, "2024-07-01T14:58Z"), pulse: vital("HR", 1, 75, "2024-07-01T15:00Z"),
    s1: vital("BPS", 1, 150, "2024-07-01T15:00Z"), d1: vital("BPD", 1, 90, "2024-07-01T15:00Z"),
    s2: vital("BPS", 2, 140, "2024-07-01T15:05Z"), d2: vital("BPD", 2, 85, "2024-07-01T15:05Z"),
    s3: vital("BPS", 3, 130, "2024-07-01T15:10Z"), d3: vital("BPD", 3, 80, "2024-07-01T15:10Z"),
  })]).vitals[0];
  expect(row).toMatchObject({ local_time: "2024-07-01T10:00", systolic_mmhg: 150, diastolic_mmhg: 90,
    repeat_systolic_mmhg: 130, repeat_diastolic_mmhg: 80, pulse_bpm: 75, weight_kg: 72.3 });
});

test("drug-attributed diagnosis gives problem plus allergy, bare adverse-effect diagnosis gives allergy alone", () => {
  const a = clinic("a", "2024-01-01", { rash: dx("L50.0", "Urticaria due to amoxicillin") });
  expect(at([a]).allergies[0]).toMatchObject({ substance: "amoxicillin", reaction_type: "hypersensitivity", mechanism: "unknown" });
  expect(at([a]).problems).toHaveLength(1);
  const b = clinic("b", "2024-01-01", { adverse: dx("T36.0X5A", "Adverse effect of penicillins, initial encounter"), rx: rx("amox", "amoxicillin 500 mg capsule") },
    { narrative: '<ref id="adverse">Hives after amoxicillin</ref>' });
  expect(at([b]).problems).toHaveLength(0);
  expect(at([b]).allergies[0]).toMatchObject({ substance: "amoxicillin", reaction_type: "hypersensitivity" });
});

test("sensitive conditions are retained and tagged", () => {
  const result = at([clinic("s", "2024-01-01", { psych: dx("F31.9", "Bipolar disorder"), genetic: dx("Q61.2", "Autosomal dominant polycystic kidney disease"),
    med: rx("q", "quetiapine 25 mg tablet") })]);
  expect(result.problems).toHaveLength(2);
  expect(result.problems.find(x => x.icd10cm === "F31.9")?.sensitivity).toEqual(["mental-health"]);
  expect(result.problems.find(x => x.icd10cm === "Q61.2")?.sensitivity).toEqual(["genetic"]);
  expect(result.medications[0].sensitivity).toEqual(["mental-health"]);
});

test("causation by a disease is not a drug allergy; classes preserve source wording", () => {
  const otherCause = clinic("cause", "2024-01-01", { aki: dx("N17.9", "Acute kidney injury due to dehydration") });
  expect(at([otherCause]).problems).toHaveLength(1);
  expect(at([otherCause]).allergies).toEqual([]);
  const drugClass = clinic("class", "2024-01-01", { reaction: dx("L50.0", "Urticaria due to Sulfonamide antibiotics") });
  expect(at([drugClass]).allergies[0].substance).toBe("Sulfonamide antibiotics");
  const ambiguous = clinic("ambiguous", "2024-01-01", { reaction: dx("T36.0X5A", "Adverse effect of penicillins") });
  expect(at([ambiguous]).allergies).toEqual([]);
});

test("a structured CKD assessment is usable without a diagnosis row or lab inference", () => {
  const assessment = clinic("assessment", "2024-01-01", {});
  assessment.payload.visit.CKD_G = "G3a";
  assessment.payload.visit.CKD_A = "A2";
  expect(at([assessment]).problems[0]).toMatchObject({ ckd_stage: "G3a", albuminuria: "A2" });
  assessment.payload.dx = { VISIT_ID: "assessment", ...dx("N18.31", "Chronic kidney disease stage 3a", "P") };
  expect(at([assessment]).problems).toEqual([]);
});

test("a recorded held order with an older start date still supplies the newer status", () => {
  const active = clinic("active", "2024-02-01", { rx: rx("active", "finerenone 10 mg tablet", { START_DATE: "2024-02-01" }) });
  const held = clinic("held", "2024-03-01", { rx: rx("held", "finerenone 20 mg tablet", { MED_STATUS: 3, START_DATE: "2024-01-01" }) });
  expect(at([active, held]).medications[0].status).toBe("held");
});

test("permutation invariance, evidence references real entries, and no input mutation", () => {
  const input = structuredClone(samples[0].items);
  const before = JSON.stringify(input);
  const expected = at(input);
  expect(at([...input].reverse())).toEqual(expected);
  for (let n = 1; n < input.length; n++) expect(at([...input.slice(n), ...input.slice(0, n)])).toEqual(expected);
  expect(JSON.stringify(input)).toBe(before);
  for (const rows of Object.values(expected)) for (const row of rows) for (const ref of row.evidence) {
    expect(input.find(i => i.id === ref.item_id)?.payload).toHaveProperty(ref.entry_id!);
  }
});

test("malformed input and unknown fields are skipped without throwing", () => {
  const odd: any[] = [null, false, 42, "text", [], {}, { id: "bad", recorded: "not-a-date" }, item("bad-payload", "2024-01-01", null as any),
    item("rows", "2024-01-01", { a: null, b: "text", c: { type: "VITAL", VALUE_NUM: "120" }, d: { type: "MED_ORDER" },
      e: { type: "LAB_RESULT" }, f: { type: "VISIT_DX", DX_TEXT: 7 }, g: { type: "unrecognized" } }),
    lab("bad-time", "2024-02-30"), lab("bad-unit", "2024-01-01", { UNIT_CODE: "surprise" }),
    lab("bad-value", "2024-01-01", { VALUE_TEXT: "4.5 junk" }),
  ];
  expect(at(odd)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  expect(() => at(null as any)).not.toThrow();
  expect(() => at(odd, null as any)).not.toThrow();
});
