import { test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/uscore";
import samples from "../in/samples/samples.json";

const patient = "P-1", issuer = "did:web:northgate-fm.example";
function item(id: string, effective: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer, patient, effective, recorded: `${effective.slice(0, 10)}T12:00:00-06:00`,
    narrative: "", payload, ...extra };
}
function med(id: string, action = "start", name = "losartan potassium 50 MG Oral Tablet", extra = {}) {
  return { type: "med_event", med_id: id, action, origin: "northgate", drug: { name, rxnorm: "123456" },
    dose: { value: 50, unit: "mg" }, frequency: "QD", sig: "Take one tablet daily", ...extra };
}
function lab(code = "K", extra: Record<string, unknown> = {}) {
  return { type: "imported_result", test: { nfm_code: code, name: code }, value: "4.5", unit: "mmol/L",
    result_status: "F", collected: "2024-01-01T09:00:00-06:00", resulted: "2024-01-01T11:00:00-06:00",
    external_ref: { lab: "Lakeview Labs", accession: "ACC-1", result_code: `LK-${code}` }, ...extra };
}
function run(items: FolioItem[], date = "2026-10-13") { return transform(items, date); }

test("samples retain the stopped drug and corrected report; narrative and list review produce no rows", () => {
  const a = run(samples[0].items as FolioItem[]);
  expect(a.medicationRequests).toHaveLength(1);
  expect(a.medicationRequests[0].status).toBe("stopped");
  expect(a.medicationRequests[0].authoredOn).toBeUndefined();
  expect(a.observations.map(o => o.code.text).sort()).toEqual(["creatinine", "egfr", "sodium"]);
  expect(run(samples[1].items as FolioItem[])).toEqual({ medicationRequests: [], observations: [] });
});

test("scope follows Chicago midnight in both standard and daylight time", () => {
  for (const [date, included, excluded] of [
    ["2024-01-01", "2024-01-02T05:59:59.999Z", "2024-01-02T06:00:00Z"],
    ["2024-07-01", "2024-07-02T04:59:59.999Z", "2024-07-02T05:00:00Z"],
    ["2024-03-10", "2024-03-11T04:59:59.999Z", "2024-03-11T05:00:00Z"],
    ["2024-11-03", "2024-11-04T05:59:59.999Z", "2024-11-04T06:00:00Z"],
  ]) {
    const before = item("before", date, { m: med("line") }, { recorded: included });
    const after = item("after", date, { m: med("line", "stop") }, { recorded: excluded });
    expect(run([after, before], date).medicationRequests[0].status).toBe("active");
  }
});

test("a future-recorded correction does not change the earlier snapshot", () => {
  const start = item("a", "2024-01-01", { m: med("m") });
  const correction = item("b", "2024-01-01", { m: med("m", "hold") },
    { recorded: "2024-01-03T00:00:00-06:00", supersedes: ["a"] });
  expect(run([correction, start], "2024-01-02").medicationRequests[0].status).toBe("active");
  expect(run([correction, start], "2024-01-03").medicationRequests[0].status).toBe("on-hold");
});

test("supersession is transitive and a void does not resurrect any predecessor", () => {
  const a = item("a", "2024-01-01", { m: med("m") });
  const b = item("b", "2024-01-02", { m: med("m", "hold") }, { supersedes: ["a"] });
  const c = item("c", "2024-01-03", { m: med("m", "stop") }, { supersedes: ["b"] });
  const d = item("d", "2024-01-04", {}, { retracts: ["c"] });
  expect(run([a, b, c, d]).medicationRequests).toEqual([]);
  expect(run([a, b, c, d], "2024-01-03").medicationRequests[0].status).toBe("stopped");
});

test("correction references are issuer-local", () => {
  const a = item("same-id", "2024-01-01", { m: med("m") });
  const voidOther = item("void", "2024-01-02", {}, { issuer: "did:web:other.example", retracts: ["same-id"] });
  expect(run([a, voidOther]).medicationRequests).toHaveLength(1);
});

test("effective chronology, not filing order, determines medication state", () => {
  const start = item("start", "2024-01-01", { m: med("m") }, { recorded: "2024-02-01T00:00:00Z" });
  const hold = item("hold", "2024-01-10", { m: med("m", "hold", undefined, { review_on: "2024-01-12", reason_text: "AKI" }) });
  const review = item("review", "2024-03-01", { r: { type: "list_reviewed", list: "medications", lines_on_list: ["m"] } });
  const rows = run([review, hold, start]).medicationRequests;
  expect(rows[0].status).toBe("on-hold");
  expect(rows[0].authoredOn).toBe("2024-01-01");
  expect(rows[0].statusReason).toEqual([{ text: "AKI" }]);
});

test("active authoredOn follows start/resume, never dose change or review", () => {
  const a = item("a", "2024-01-01", { m: med("m") });
  const b = item("b", "2024-02-01", { m: med("m", "change", undefined, { dose: { value: 100, unit: "mg" } }) });
  const c = item("c", "2024-03-01", { m: med("m", "hold") });
  const d = item("d", "2024-04-01", { m: med("m", "resume") });
  const e = item("e", "2024-05-01", { m: med("m", "change") });
  expect(run([b, a]).medicationRequests[0].authoredOn).toBe("2024-01-01");
  expect(run([e, b, a, d, c]).medicationRequests[0].authoredOn).toBe("2024-04-01");
  expect(run([b]).medicationRequests[0].authoredOn).toBeUndefined();
});

test("authoredOn retains partial dates and converts offset timestamps to Chicago dates", () => {
  for (const [effective, expected] of [["2016", "2016"], ["2016-04", "2016-04"], ["2024-01-02T03:00:00Z", "2024-01-01"]]) {
    const a = item("a", effective, { m: med("m") }, { recorded: "2024-02-01T12:00:00Z" });
    expect(run([a]).medicationRequests[0].authoredOn).toBe(expected);
  }
});

test("brand and generic lines merge by the latest line event, even after restart", () => {
  const a = item("a", "2024-01-01", { m: med("old", "start", "Jardiance 10 MG") });
  const b = item("b", "2024-02-01", { m: med("new", "start", "empagliflozin 25 MG Oral Tablet") });
  const c = item("c", "2024-03-01", { m: med("old", "stop", "Jardiance 10 MG") });
  const rows = run([a, b, c]).medicationRequests;
  expect(rows).toHaveLength(1);
  expect(rows[0].status).toBe("stopped");
  expect(rows[0].authoredOn).toBe("2024-01-01");
});

test("voiding an erroneous newer line leaves the legitimate line untouched", () => {
  const a = item("a", "2024-01-01", { m: med("old", "hold") });
  const b = item("b", "2024-02-01", { m: med("new") });
  const c = item("c", "2024-03-01", {}, { retracts: ["b"] });
  expect(run([a, b, c]).medicationRequests[0].status).toBe("on-hold");
});

test("outside drugs are plans and local outside codes never become RxNorm", () => {
  const a = item("a", "2024-01-01", { m: med("m", "start", "", { origin: "outside",
    drug: { name: "Jardiance", outside_code: { system: "lakeview-drug", code: "123" } } }) });
  const m = run([a]).medicationRequests[0];
  expect(m.intent).toBe("plan");
  expect(m.reportedBoolean).toBe(true);
  expect(m.medicationCodeableConcept).toEqual({ text: "Jardiance (empagliflozin)" });
});

test("insulin concentration is not a dose; supplied units and sig are retained", () => {
  const a = item("a", "2024-01-01", { m: med("m", "start", "", { drug: { name: "insulin glargine 100 UNIT/ML" },
    dose: { value: 20, unit: "units" }, frequency: "QHS", sig: "Inject 20 units at bedtime" }) });
  const m = run([a]).medicationRequests[0];
  expect(m.medicationCodeableConcept.text).toBe("insulin glargine 100 UNIT/ML (insulin glargine)");
  expect(m.dosageInstruction![0].doseAndRate![0].doseQuantity).toEqual({ value: 20, unit: "units", system: "http://unitsofmeasure.org", code: "[iU]" });
  expect(m.dosageInstruction![0].timing?.code.text).toBe("QHS");
});

test("unknown drug descriptions stay separate; restricted entries are still supplied records", () => {
  const a = item("a", "2024-01-01", { m: med("a", "start", "", { drug: { name: "water pill" } }) });
  const b = item("b", "2024-01-02", { m: med("b", "start", "", { drug: { name: "water pill" } }) });
  const c = item("c", "2024-01-03", { m: med("c", "start", "sertraline 50 MG Oral Tablet", { restricted: "BH" }) });
  expect(run([a, b, c]).medicationRequests).toHaveLength(3);
});

test("dose units, OTHER frequency, missing single dose, and stop reasons map to FHIR", () => {
  const a = item("a", "2024-01-01", { m: med("m", "stop", undefined, { dose: { value: 2, unit: "tab" }, frequency: "OTHER",
    stop_reason: "patient_choice", reason_text: "Patient declined" }) });
  const m = run([a]).medicationRequests[0];
  expect(m.dosageInstruction![0].doseAndRate![0].doseQuantity.code).toBe("{tbl}");
  expect(m.dosageInstruction![0].timing?.code.text).toBe("other");
  expect(m.statusReason![0].coding![0].code).toBe("patient_choice");
  const b = item("b", "2024-01-01", { m: med("m", "start", undefined, { dose: undefined, frequency: undefined, sig: "Sliding scale" }) });
  expect(run([b]).medicationRequests[0].dosageInstruction).toEqual([{ text: "Sliding scale" }]);
});

test("all target analytes get fallback LOINC and UCUM units", () => {
  const definitions = [
    ["CREAT", "creatinine", "mg/dL", "2160-0"], ["EGFR", "egfr", "mL/min/1.73m2", "98979-8"],
    ["K", "potassium", "mmol/L", "2823-3"], ["NA", "sodium", "mmol/L", "2951-2"],
    ["CL", "chloride", "mmol/L", "2075-0"], ["CO2", "bicarbonate", "mmol/L", "2028-9"],
    ["AG", "anion_gap", "mmol/L", "33037-3"], ["BUN", "bun", "mg/dL", "3094-0"],
    ["GLU", "glucose", "mg/dL", "2345-7"], ["A1C", "a1c", "%", "4548-4"], ["UACR", "uacr", "mg/g", "9318-7"],
    ["PLT", "platelets", "cells/uL", "777-3"], ["WBC", "wbc", "cells/uL", "6690-2"],
    ["HGB", "hemoglobin", "g/dL", "718-7"], ["BHB", "bhb", "mmol/L", "53060-9"],
    ["PH", "ph", "", "2746-6"], ["PCO2", "pco2", "mmHg", "2021-4"], ["LIPASE", "lipase", "U/L", "3040-3"],
    ["TROPI", "troponin", "ng/mL", "10839-9"], ["CHOL", "cholesterol", "mg/dL", "2093-3"],
    ["TG", "triglycerides", "mg/dL", "2571-8"], ["HDL", "hdl", "mg/dL", "2085-9"], ["LDL", "ldl", "mg/dL", "13457-7"],
  ];
  const payload = Object.fromEntries(definitions.map(([code, , unit]) => [code, lab(code, { unit, value: code === "PLT" ? "212000" : code === "WBC" ? "6800" : "1.23" })]));
  const rows = run([item("all-labs", "2024-01-01", payload)]).observations;
  expect(rows).toHaveLength(23);
  for (const [code, name, , loinc] of definitions) {
    const o = rows.find(o => o.code.text === name)!;
    expect(o.code.coding).toEqual([{ system: "http://loinc.org", code: loinc }, { system: "urn:northgate-fm:test-code", code }]);
    if (name === "platelets") expect(o.valueQuantity.value).toBe(212);
    if (name === "wbc") expect(o.valueQuantity.value).toBe(6.8);
    if (name === "egfr") expect(o.valueQuantity.code).toBe("mL/min/{1.73_m2}");
  }
});

test("deduplication keeps advanced statuses and separate confirmation accessions", () => {
  const p = item("p", "2024-01-01", { k: lab("K", { result_status: "P", value: "4.2" }) });
  const f = item("f", "2024-01-01", { k: lab("K", { value: "4.4" }) });
  const repeat = item("repeat", "2024-01-01", { k: lab("K", { external_ref: { lab: "Lakeview Labs", accession: "ACC-2", result_code: "LK-K" } }) });
  const rows = run([p, repeat, f]).observations;
  expect(rows).toHaveLength(2);
  expect(rows.map(o => o.valueQuantity.value).sort()).toEqual([4.4, 4.5]);
  expect(rows.every(o => o.status === "final")).toBe(true);
});

test("a nonnumeric corrected component suppresses a numeric final even without a correction edge", () => {
  const f = item("f", "2024-01-01", { k: lab("K", { value: "6.0" }) });
  const c = item("c", "2024-01-01", { k: lab("K", { result_status: "C", value: "Result invalidated" }) });
  expect(run([f, c]).observations).toEqual([]);
});

test("a numeric hemolysis warning alone does not withdraw a result", () => {
  const f = item("f", "2024-01-01", { k: lab("K", { value: "6.0", comment: "Specimen hemolyzed; potassium may be falsely elevated." }) });
  expect(run([f]).observations[0].valueQuantity.value).toBe(6);
});

test("comparators and numeric parsing never invent numeric values from lab text", () => {
  for (const value of ["Hemolyzed", "Result invalidated", "4.5 comment", "", "Infinity", "NaN"]) {
    expect(run([item("a", "2024-01-01", { k: lab("K", { value }) })]).observations).toEqual([]);
  }
  const row = run([item("a", "2024-01-01", { k: lab("K", { value: "<=0.01", result_status: "P" }) })]).observations[0];
  expect(row.valueQuantity.value).toBe(0.01);
  expect(row.valueQuantity.comparator).toBe("<=");
  expect(row.status).toBe("preliminary");
});

test("eGFR retains non-race variants, distinct equations, source LOINC, and method-note precedence", () => {
  const naa = lab("EGFR-NAA", { test: { nfm_code: "EGFR-NAA", name: "eGFR non-African American", loinc: "33914-3" },
    unit: "mL/min/1.73m2", value: ">60", comment: "Calculated by CKD-EPI 2009 equation." });
  const aa = lab("EGFR-AA", { test: { nfm_code: "EGFR-AA", name: "eGFR African American", loinc: "48643-1" }, unit: "mL/min/1.73m2", value: "72" });
  const current = lab("EGFR21", { test: { nfm_code: "EGFR21", name: "eGFR" }, unit: "mL/min/1.73m2", value: "65" });
  const rows = run([item("a", "2024-01-01", { naa, aa, current })]).observations;
  expect(rows).toHaveLength(2);
  const old = rows.find(o => o.valueQuantity.value === 60)!;
  expect(old.method?.text).toBe("ckd-epi-2009");
  expect(old.code.coding![0].code).toBe("33914-3");
  expect(old.valueQuantity.comparator).toBe(">");
  expect(rows.find(o => o.valueQuantity.value === 65)?.method?.text).toBe("ckd-epi-2021");
});

test("unknown tests, wrong specimen, troponin T, and unsupported units are skipped", () => {
  const rows = run([item("a", "2024-01-01", {
    unknown: lab("TSH", { unit: "mIU/L" }),
    urine: lab("CREAT", { test: { nfm_code: "CREAT", name: "Creatinine, urine" }, unit: "mg/dL" }),
    trop: lab("TROP", { test: { nfm_code: "TROP", name: "Troponin T" }, unit: "ng/mL" }),
    badunit: lab("K", { unit: "unknown" }),
  })]).observations;
  expect(rows).toEqual([]);
});

test("output is order-independent, does not mutate input, and has valid unique IDs", () => {
  const items = [item("a".repeat(90), "2024-01-01", { "lab/one": lab(), "med/one": med("x/y") }),
    item("a?", "2024-01-02", { "med/two": med("x?y", "start", "metformin 500 MG Oral Tablet") })];
  const original = JSON.stringify(items);
  const result = run(items);
  expect(run([...items].reverse())).toEqual(result);
  expect(JSON.stringify(items)).toBe(original);
  const ids = [...result.observations, ...result.medicationRequests].map(r => r.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.every(id => /^[A-Za-z0-9.-]{1,64}$/.test(id))).toBe(true);
});

test("malformed JSON values, dates, and payloads do not throw", () => {
  for (const weird of [null, undefined, [], {}, "x", 12, true, { toString: null }]) {
    expect(() => run(weird as FolioItem[])).not.toThrow();
    expect(() => run([item("a", "2024-01-01", { med: med("m", "start", undefined, { origin: weird }), lab: lab("K", { result_status: weird }) })])).not.toThrow();
    expect(() => run([item("a", "2024-01-01", weird as any)])).not.toThrow();
    expect(() => run([item("a", "2024-01-01", {}, { effective: weird as string })], weird as string)).not.toThrow();
  }
  for (const recorded of ["not a date", "2024-02-30T00:00:00Z", "2024-01-01", "2024-01-01T01:00:00"]) {
    expect(run([item("a", "2024-01-01", { m: med("m") }, { recorded })]).medicationRequests).toEqual([]);
  }
});
