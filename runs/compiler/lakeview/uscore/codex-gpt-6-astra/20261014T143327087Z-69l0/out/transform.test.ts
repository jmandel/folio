import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import type { FolioItem } from "../in/views/uscore";
import { transform } from "./transform";

type Row = Record<string, unknown>;
function item(id: string, recorded: string, payload: Record<string, Row>, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "did:web:lakeview-labs.example", patient: "p1", effective: recorded,
    recorded, narrative: "", payload, ...extra };
}
function lab(id: string, result: Row = {}, order: Row = {}, recorded = "2023-01-01T12:00:00-06:00"): FolioItem {
  return item(id, recorded, {
    req: { type: "LAB_REQ", REQ_ID: `req-${id}`, COLLECTED_AT: "2023-01-01T08:00:00-06:00" },
    order: { type: "LAB_ORDER", ORDER_ID: `order-${id}`, REQ_ID: `req-${id}`, ACCESSION: "same-tube",
      ORDER_STATUS: 4, SPECIMEN_TYPE: "SER", SPECIMEN_COND: "OK", ...order },
    result: { type: "LAB_RESULT", RESULT_ID: `result-${id}`, ORDER_ID: `order-${id}`,
      TEST_CODE: "LK-K", VALUE_TEXT: "4.7", VALUE_NUM: 4.7, UNIT_CODE: "mmol/L", RESULT_STATUS: "F",
      RESULTED_AT: "2023-01-01T11:00:00-06:00", ...result },
  });
}
function med(id: string, date: string, extra: Row = {}): FolioItem {
  return item(id, `${date}T12:00:00-06:00`, {
    visit: { type: "CLINIC_VISIT", VISIT_ID: `v-${id}`, VISIT_AT: `${date}T10:00:00-06:00` },
    rx: { type: "MED_ORDER", RX_ID: id, VISIT_ID: `v-${id}`, LV_DRUG_ID: "fin-10", DRUG_NAME: "finerenone 10 mg tablet",
      MED_STATUS: 1, START_DATE: date, DOSE_QTY: 10, DOSE_UNIT: "mg", FREQ_CODE: "QD", ROUTE: "PO",
      PRESCRIBER_NPI: "1234567890", ...extra },
  });
}
function history(id: string, rx: string, date: string, status: number, extra: Row = {}): FolioItem {
  return item(id, `${date}T12:00:00-06:00`, {
    history: { type: "MED_STATUS_HIST", HIST_ID: id, VISIT_ID: `v-${id}`, RX_ID: rx,
      CHANGED_AT: `${date}T10:00:00-06:00`, NEW_STATUS: status, REASON_CODE: "LAB", ...extra },
  });
}
const run = (items: FolioItem[], asOf = "2026-10-13") => transform(items, asOf);
const samples = JSON.parse(readFileSync(new URL("../in/samples/samples.json", import.meta.url), "utf8"))[0].items as FolioItem[];

test("samples: only structured results, corrected-away exclusion, persistent hold", () => {
  const result = run(samples);
  expect(result.observations.map(o => o.code.text).sort()).toEqual(["a1c", "creatinine", "egfr", "sodium"]);
  expect(result.medicationRequests).toHaveLength(1);
  const rx = result.medicationRequests[0];
  expect(rx.status).toBe("on-hold");
  expect(rx.authoredOn).toBe("2021-09-08");
  expect(rx.medicationCodeableConcept).toEqual({ text: "finerenone 10 mg tablet (finerenone)" });
  expect(rx.statusReason).toEqual({ text: "K 5.6 / 5.5 confirmed" });
  expect(rx.requester).toEqual({ display: "Tobi Adeyemi, MD" });
  expect(run(samples, "2021-09-07").medicationRequests[0].status).toBe("active");
  expect(run(samples, "2021-07-10").observations).toHaveLength(0);
});

test("all documented scalar test codes, fallback LOINC, exact units", () => {
  const cases = [
    ["LK-CREAT", "creatinine", "mg/dL", "mg/dL", "2160-0"],
    ["LK-EGFR21", "egfr", "mL/min/1.73m2", "mL/min/{1.73_m2}", "98979-8"],
    ["LK-NA", "sodium", "mmol/L", "mmol/L", "2951-2"],
    ["LK-K", "potassium", "mmol/L", "mmol/L", "2823-3"],
    ["LK-GLU", "glucose", "mg/dL", "mg/dL", "2345-7"],
    ["LK-A1C", "a1c", "%", "%", "4548-4"],
    ["LK-UACR", "uacr", "mg/g", "mg/g", "9318-7"],
    ["LK-WBC", "wbc", "K/uL", "10*3/uL", "6690-2"],
    ["LK-HGB", "hemoglobin", "g/dL", "g/dL", "718-7"],
    ["LK-PLT", "platelets", "K/uL", "10*3/uL", "777-3"],
    ["LK-CHOL", "cholesterol", "mg/dL", "mg/dL", "2093-3"],
    ["LK-TRIG", "triglycerides", "mg/dL", "mg/dL", "2571-8"],
    ["LK-HDL", "hdl", "mg/dL", "mg/dL", "2085-9"],
    ["LK-LDLC", "ldl", "mg/dL", "mg/dL", "13457-7"],
  ];
  for (const [code, analyte, unit, ucum, loinc] of cases) {
    const [o] = run([lab(code, { TEST_CODE: code, UNIT_CODE: unit, VALUE_TEXT: "212", VALUE_NUM: -123 })]).observations;
    expect(o.code.text).toBe(analyte);
    expect(o.code.coding).toEqual([{ system: "http://loinc.org", code: loinc }, { system: "urn:lakeview:test-code", code }]);
    expect(o.valueQuantity).toMatchObject({ value: 212, code: ucum });
    expect(o.method).toEqual(analyte === "egfr" ? { text: "ckd-epi-2021" } : undefined);
  }
});

test("numeric text is authoritative, comparators never become sentinel numbers", () => {
  for (const [text, value, comparator] of [[">60", 60, ">"], [" < 0.1 ", 0.1, "<"], ["<=90", 90, "<="], ["≥90", 90, ">="], ["0", 0, undefined]] as const) {
    const [o] = run([lab("k", { VALUE_TEXT: text, VALUE_NUM: 9999999 })]).observations;
    expect(o.valueQuantity.value).toBe(value);
    expect(o.valueQuantity.comparator).toBe(comparator);
  }
  for (const value of ["See comment", "Not done: QNS", "", "4.7foo", "NaN", null, 5, "1e9999"]) {
    expect(run([lab("bad", { VALUE_TEXT: value, VALUE_NUM: 4.7 })]).observations).toHaveLength(0);
  }
});

test("result validity is independent of order workflow and specimen condition", () => {
  for (const status of ["F", "A", "P"]) {
    const [o] = run([lab(status, { RESULT_STATUS: status }, { ORDER_STATUS: 3, SPECIMEN_COND: "HEM" })]).observations;
    expect(o.status).toBe(status === "P" ? "preliminary" : "final");
  }
  for (const status of ["C", "X", "unknown"]) expect(run([lab(status, { RESULT_STATUS: status })]).observations).toHaveLength(0);
  for (const status of [5, 9]) expect(run([lab(String(status), {}, { ORDER_STATUS: status })]).observations).toHaveLength(0);
  expect(run([lab("a"), lab("b", {}, { REPEAT_OF_ORDER_ID: "order-a", REPEAT_REASON: "CONF" })]).observations).toHaveLength(2);
  expect(run([lab("a"), lab("b", {}, { REPEAT_OF_ORDER_ID: "order-a", REPEAT_REASON: "HEM" })]).observations).toHaveLength(2);
});

test("eGFR retains source LOINC, excludes race coefficient, and trusts method note", () => {
  const n = lab("n", { TEST_CODE: "LK-EGFR09N", UNIT_CODE: "mL/min/1.73m2", VALUE_TEXT: ">60", VALUE_NUM: 9999999,
    LOINC: "48642-3", COMMENT_TEXT: "Calculated by CKD-EPI 2009. Report the African American value when appropriate." });
  const a = lab("a", { TEST_CODE: "LK-EGFR09A", UNIT_CODE: "mL/min/1.73m2" });
  const [o] = run([a, n]).observations;
  expect(run([a, n]).observations).toHaveLength(1);
  expect(o.code.coding![0].code).toBe("48642-3");
  expect(o.method!.text).toBe("ckd-epi-2009");
  expect(o.valueQuantity).toMatchObject({ value: 60, comparator: ">", code: "mL/min/{1.73_m2}" });
  n.payload.result.COMMENT_TEXT = "Calculated using the MDRD equation.";
  expect(run([n]).observations[0].method!.text).toBe("mdrd");
});

test("deduplicates result ids by advanced status, not matching analyte/value/accession", () => {
  const p = lab("p", { RESULT_ID: "shared", RESULT_STATUS: "P", VALUE_TEXT: "4.8" });
  const f = lab("f", { RESULT_ID: "shared", RESULT_STATUS: "F", VALUE_TEXT: "4.6" });
  const a = lab("a", { RESULT_ID: "shared", RESULT_STATUS: "A", VALUE_TEXT: "4.5" });
  expect(run([p, f, a]).observations).toHaveLength(1);
  expect(run([p, f, a]).observations[0].valueQuantity.value).toBe(4.5);
  expect(run([lab("1"), lab("2")]).observations).toHaveLength(2);
});

test("publication-time supersession is transitive and retraction cannot revive a predecessor", () => {
  const a = lab("a"), b = lab("b", { VALUE_TEXT: "4.8" }, {}, "2023-01-02T12:00:00-06:00");
  b.supersedes = ["a"];
  const c = lab("c", { VALUE_TEXT: "4.9" }, {}, "2023-01-03T12:00:00-06:00");
  c.supersedes = ["b"];
  const retract = item("retract", "2023-01-04T12:00:00-06:00", {}, { retracts: ["c"] });
  const data = [c, a, retract, b];
  expect(run(data, "2023-01-01").observations[0].valueQuantity.value).toBe(4.7);
  expect(run(data, "2023-01-02").observations[0].valueQuantity.value).toBe(4.8);
  expect(run(data, "2023-01-03").observations[0].valueQuantity.value).toBe(4.9);
  expect(run(data, "2023-01-04").observations).toHaveLength(0);
  retract.issuer = "did:web:another.example";
  expect(run(data).observations).toHaveLength(1);
});

test("Chicago end of day follows winter/summer offsets and DST transition days", () => {
  const cases = [
    ["2023-01-01", "2023-01-02T05:59:59.999Z", "2023-01-02T06:00:00Z"],
    ["2023-07-01", "2023-07-02T04:59:59.999Z", "2023-07-02T05:00:00Z"],
    ["2023-03-12", "2023-03-13T04:59:59.999Z", "2023-03-13T05:00:00Z"],
    ["2023-11-05", "2023-11-06T05:59:59.999Z", "2023-11-06T06:00:00Z"],
  ];
  for (const [asOf, before, after] of cases) {
    const a = lab("before", {}, {}, before), b = lab("after", {}, {}, after);
    expect(run([a, b], asOf).observations).toHaveLength(1);
  }
  const unzoned = lab("local", {}, {}, "2023-07-01T23:59:59");
  unzoned.payload.req.COLLECTED_AT = "2023-07-01T08:00:00";
  expect(run([unzoned], "2023-07-01").observations[0].effectiveDateTime).toBe("2023-07-01T08:00:00-05:00");
});

test("medication events persist, resume date authors active request, later stop keeps original start", () => {
  const start = med("rx1", "2023-01-01");
  const hold = history("hold", "rx1", "2023-01-02", 3, { REVIEW_DATE: "2023-01-10", COMMENT_TEXT: "Recheck potassium" });
  const resume = history("resume", "rx1", "2023-01-20", 1);
  const stop = history("stop", "rx1", "2023-01-25", 2, { REASON_CODE: "ADR", COMMENT_TEXT: "Adverse reaction" });
  const data = [stop, resume, start, hold];
  const held = run(data, "2023-01-15").medicationRequests[0];
  expect(held.status).toBe("on-hold");
  expect(held.statusReason).toEqual({ text: "Recheck potassium" });
  expect(held.authoredOn).toBe("2023-01-01");
  const resumed = run(data, "2023-01-21").medicationRequests[0];
  expect(resumed.status).toBe("active");
  expect(resumed.authoredOn).toBe("2023-01-20");
  expect(resumed.statusReason).toBeUndefined();
  const stopped = run(data).medicationRequests[0];
  expect(stopped.status).toBe("stopped");
  expect(stopped.authoredOn).toBe("2023-01-01");
  expect(stopped.statusReason!.coding![0].code).toBe("adverse_reaction");
  const retract = item("undo", "2023-01-26T12:00:00-06:00", {}, { retracts: ["stop"] });
  expect(run([...data, retract]).medicationRequests[0].status).toBe("active");
});

test("latest own event chooses ingredient line; voids never displace valid older lines", () => {
  const first = med("first", "2023-01-01");
  const restart = med("restart", "2023-02-01", { LV_DRUG_ID: "fin-20", DRUG_NAME: "finerenone 20 mg tablet", DOSE_QTY: 20 });
  const oldStop = history("late-stop", "first", "2023-02-10", 2);
  expect(run([first, restart]).medicationRequests[0].dosageInstruction![0].doseAndRate![0].doseQuantity.value).toBe(20);
  expect(run([first, restart, oldStop]).medicationRequests[0].status).toBe("stopped");
  const voided = med("void", "2023-03-01", { MED_STATUS: 9 });
  const error = history("error", "restart", "2023-03-02", 9);
  expect(run([first, restart, error, voided]).medicationRequests).toHaveLength(1);
  expect(run([first, restart, error, voided]).medicationRequests[0].dosageInstruction![0].doseAndRate![0].doseQuantity.value).toBe(10);
  expect(run([error]).medicationRequests).toHaveLength(0);
});

test("status chronology uses changed time, not arrival order or publication time", () => {
  const start = med("rx", "2023-01-01");
  const newer = history("resume", "rx", "2023-01-20", 1);
  const older = history("hold", "rx", "2023-01-10", 3);
  older.recorded = "2023-02-01T12:00:00-06:00";
  expect(run([older, start, newer]).medicationRequests[0].status).toBe("active");
});

test("brand and salt normalization, products retain RxNorm without invented ingredient codes", () => {
  const brand = med("brand", "2023-01-01", { LV_DRUG_ID: "brand", DRUG_NAME: "Jardiance 10 mg tablet", RXNORM: "1545653" });
  const generic = med("generic", "2023-02-01", { LV_DRUG_ID: "generic", DRUG_NAME: "empagliflozin 25 mg tablet", DOSE_QTY: 25 });
  expect(run([brand, generic]).medicationRequests).toHaveLength(1);
  expect(run([brand]).medicationRequests[0].medicationCodeableConcept).toEqual({ text: "Jardiance 10 mg tablet", coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "1545653" }] });
  const a = med("salt", "2023-01-01", { LV_DRUG_ID: "a", DRUG_NAME: "losartan potassium 25 mg oral tablet" });
  const b = med("nosalt", "2023-02-01", { LV_DRUG_ID: "b", DRUG_NAME: "losartan 50 mg tablet" });
  expect(run([a, b]).medicationRequests).toHaveLength(1);
});

test("dose UCUM, route scope, frequency, requester fallback and stop coding", () => {
  for (const [source, unit, code] of [["mg", "mg", "mg"], ["mcg", "mcg", "ug"], ["unit", "units", "[iU]"], ["mL", "mL", "mL"]]) {
    const [rx] = run([med("rx", "2023-01-01", { DOSE_UNIT: source, DOSE_QTY: 2, ROUTE: "SC", FREQ_CODE: "QW" })]).medicationRequests;
    expect(rx.dosageInstruction![0].doseAndRate![0].doseQuantity).toEqual({ value: 2, unit, code, system: "http://unitsofmeasure.org" });
    expect(rx.dosageInstruction![0].timing!.code.text).toBe("QW");
    expect(rx.requester!.identifier!.value).toBe("1234567890");
  }
  expect(run([med("iv", "2023-01-01", { ROUTE: "IV" })]).medicationRequests).toHaveLength(0);
  expect(run([med("rx", "2023-01-01", { PRESCRIBER_NPI: undefined })]).medicationRequests[0].requester).toEqual({ display: "Lakeview Labs & Kidney Care" });
  for (const [source, target] of [["ADR", "adverse_reaction"], ["PT", "patient_choice"], ["LAB", "other"], ["PROC", "other"], ["OTH", "other"]]) {
    const [rx] = run([med("rx", "2023-01-01"), history("stop", "rx", "2023-02-01", 2, { REASON_CODE: source })]).medicationRequests;
    expect(rx.statusReason!.coding![0].code).toBe(target);
  }
});

test("malformed input is skipped, ids are valid, reordering is stable, input is not mutated", () => {
  const bad = [null, false, 5, "bad", {}, { recorded: {} }, { id: "bad", issuer: "i", patient: "p", recorded: "bad-date", payload: [] }] as unknown as FolioItem[];
  expect(run(bad)).toEqual({ medicationRequests: [], observations: [] });
  expect(run(samples, "invalid")).toEqual({ medicationRequests: [], observations: [] });
  const original = JSON.stringify(samples), expected = run(samples);
  for (let shift = 0; shift < samples.length; shift++) {
    const permutation = [...samples.slice(shift), ...samples.slice(0, shift)].reverse();
    expect(run(permutation)).toEqual(expected);
  }
  expect(JSON.stringify(samples)).toBe(original);
  const weird = run([lab("x /#".repeat(50)), med("x /#".repeat(50), "2023-01-01")]);
  const ids = [...weird.observations, ...weird.medicationRequests].map(r => r.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const id of ids) expect(id).toMatch(/^[A-Za-z0-9.-]{1,64}$/);
  const corrupt = lab("corrupt");
  corrupt.payload.null = null;
  corrupt.payload.array = [];
  corrupt.payload.result.VALUE_TEXT = {};
  expect(run([corrupt]).observations).toHaveLength(0);
});
