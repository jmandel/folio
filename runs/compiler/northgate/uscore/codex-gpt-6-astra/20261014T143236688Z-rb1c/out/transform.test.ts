import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/uscore";

let checks = 0;
function test(name: string, run: () => void) { run(); console.log(`ok ${++checks}: ${name}`); }
function item(id: string, effective: string, data: Record<string, unknown>, overrides: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "did:web:northgate-fm.example", patient: "P", effective,
    recorded: effective.length === 10 ? effective + "T12:00:00-06:00" : effective,
    narrative: "", payload: { e: data }, ...overrides };
}
function med(med_id: string, action: string, extra: Record<string, unknown> = {}) {
  return { type: "med_event", med_id, action, origin: "northgate",
    drug: { name: "losartan potassium 50 MG Oral Tablet", rxnorm: "979492" },
    dose: { value: 1, unit: "tab" }, frequency: "QD", ...extra };
}
function lab(nfm_code: string, value: string, unit: string, extra: Record<string, unknown> = {}) {
  return { type: "imported_result", test: { nfm_code, name: nfm_code }, value, unit,
    result_status: "F", collected: "2024-01-01T09:00:00-06:00", resulted: "2024-01-01T10:00:00-06:00",
    external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: `LK-${nfm_code}` }, ...extra };
}
const start = item("start", "2024-01-01", med("M1", "start"));
const change = item("change", "2024-02-01", med("M1", "change", {
  drug: { name: "losartan 100 MG Oral Tablet", rxnorm: "new-product" }, reason_text: "Dose titration",
}));
const hold = item("hold", "2024-03-01", med("M1", "hold", { reason_text: "Hold during illness", review_on: "2024-03-03" }));
const resume = item("resume", "2024-04-01", med("M1", "resume"));
const stop = item("stop", "2024-05-01", med("M1", "stop", { reason_text: "Not tolerated", stop_reason: "adverse_reaction" }));
const all = [change, resume, start, stop, hold];
const meds = (data: FolioItem[], asOf = "2025-01-01") => transform(data, asOf).medicationRequests;
const labs = (data: FolioItem[], asOf = "2025-01-01") => transform(data, asOf).observations;

test("clinical replay and authoredOn across dose changes, holds, resumptions and stops", () => {
  const changed = meds(all, "2024-02-29")[0];
  assert.equal(changed.status, "active"); assert.equal(changed.authoredOn, "2024-01-01");
  assert.equal(changed.dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.value, 100);
  assert.equal(changed.statusReason, undefined);
  const held = meds(all, "2024-03-31")[0];
  assert.equal(held.status, "on-hold"); assert.equal(held.authoredOn, "2024-01-01");
  assert.deepEqual(held.statusReason, { text: "Hold during illness" });
  assert.equal(meds(all, "2024-04-30")[0].authoredOn, "2024-04-01");
  const stopped = meds(all)[0];
  assert.equal(stopped.status, "stopped"); assert.equal(stopped.authoredOn, "2024-01-01");
  assert.equal(stopped.statusReason?.coding?.[0].code, "adverse_reaction");
});
test("hold never expires or resets after a list review", () => {
  const review = item("review", "2025-01-01", { type: "list_reviewed", list: "medications", lines_on_list: ["M1"] });
  assert.equal(meds([start, hold, review], "2026-01-01")[0].status, "on-hold");
});
test("latest line per ingredient wins, including brand aliases and stopped lines", () => {
  const second = item("second", "2024-06-01", med("M2", "start", { drug: { name: "Cozaar 25 MG Oral Tablet" } }));
  const result = meds([...all, second]);
  assert.equal(result.length, 1); assert.equal(result[0].status, "active");
  assert.equal(result[0].medicationCodeableConcept.text, "Cozaar 25 MG Oral Tablet (losartan)");
  const stopSecond = item("stopSecond", "2024-07-01", med("M2", "stop", { drug: { name: "Cozaar 25 MG Oral Tablet" } }));
  assert.equal(meds([start, second, stopSecond])[0].status, "stopped");
});
test("voided new line cannot mask legitimate prior line", () => {
  const wrong = item("wrong", "2024-06-01", med("wrong-line", "start"));
  const voided = item("void", "2024-06-02", { type: "chart_correction", voided_items: ["wrong"], reason: "wrong_patient" }, { retracts: ["wrong"] });
  assert.deepEqual(meds([...all, wrong, voided]), meds(all));
});
test("retracted change restores surviving state, only after correction is recorded", () => {
  const voided = item("void", "2024-03-01", {}, { retracts: ["change"] });
  assert.equal(meds([start, change, voided], "2024-02-29")[0].dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.value, 100);
  assert.equal(meds([start, change, voided], "2024-03-01")[0].dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.value, 50);
});
test("transitive supersession and subsequent retraction never resurrect ancestors", () => {
  const b = item("b", "2024-02-01", med("M1", "hold"), { supersedes: ["start"] });
  const c = item("c", "2024-03-01", med("M1", "stop"), { supersedes: ["b"] });
  const d = item("d", "2024-04-01", {}, { retracts: ["c"] });
  assert.equal(meds([d, b, start, c], "2024-04-01").length, 0);
  assert.equal(meds([d, b, start, c], "2024-02-01")[0].status, "on-hold");
});
test("corrections are scoped to issuer", () => {
  const other = item("void", "2024-03-01", {}, { issuer: "did:web:another.example", retracts: ["start"] });
  assert.equal(meds([start, other]).length, 1);
});
test("effective chronology outranks filing chronology", () => {
  assert.equal(meds([hold, { ...start, recorded: "2024-12-01T10:00:00-06:00" }])[0].status, "on-hold");
});
test("Chicago cutoff handles UTC, winter, summer and DST transition days", () => {
  for (const [asOf, last, next] of [
    ["2024-01-01", "2024-01-02T05:59:59.999Z", "2024-01-02T06:00:00Z"],
    ["2024-07-01", "2024-07-02T04:59:59.999Z", "2024-07-02T05:00:00Z"],
    ["2024-03-10", "2024-03-11T04:59:59.999Z", "2024-03-11T05:00:00Z"],
    ["2024-11-03", "2024-11-04T05:59:59.999Z", "2024-11-04T06:00:00Z"],
  ]) {
    assert.equal(meds([{ ...start, recorded: last }], asOf).length, 1);
    assert.equal(meds([{ ...start, recorded: next }], asOf).length, 0);
  }
});
test("partial dates retain precision and effective dates are Chicago-local", () => {
  for (const [effective, expected] of [["2016", "2016"], ["2016-11", "2016-11"],
    ["2024-01-01T01:00:00Z", "2023-12-31"], ["2024-01-01T01:00:00", "2024-01-01"]]) {
    assert.equal(meds([{ ...start, effective }])[0].authoredOn, expected);
  }
});
test("outside and restricted medications survive, without promoting local codes to RxNorm", () => {
  const r = meds([item("out", "2024-01-01", med("M2", "start", { origin: "outside", restricted: "BH",
    drug: { name: "Zoloft 50 mg tablet", outside_code: { system: "lakeview-drug", code: "12345" } },
  }))])[0];
  assert.equal(r.intent, "plan"); assert.equal(r.reportedBoolean, true); assert.equal(r.requester, undefined);
  assert.deepEqual(r.medicationCodeableConcept, { text: "Zoloft 50 mg tablet (sertraline)" });
});
test("requester is organization when author is merely entering staff; product code stays product code", () => {
  const r = meds([{ ...start, author: { name: "Nurse", role: "RN" } }])[0];
  assert.deepEqual(r.requester, { display: "Northgate Family Medicine" });
  assert.deepEqual(r.medicationCodeableConcept.coding, [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "979492" }]);
});
test("dose conversion, unknown strength, insulin units and sliding scale", () => {
  const cases = [
    ["metformin hydrochloride 500 MG Oral Tablet", { value: 2, unit: "tab" }, 1000, "mg"],
    ["levothyroxine sodium 50 MCG Oral Tablet", { value: 1, unit: "tab" }, 50, "ug"],
    ["3 ML insulin glargine 100 UNT/ML Pen Injector", { value: 10, unit: "units" }, 10, "[iU]"],
    ["metformin tablet", { value: 2, unit: "tab" }, 2, "{tbl}"],
  ] as const;
  for (const [name, d, value, code] of cases) {
    const q = meds([item("dose", "2024-01-01", med("M1", "start", { drug: { name }, dose: d }))])[0].dosageInstruction?.[0].doseAndRate?.[0].doseQuantity;
    assert.equal(q?.value, value); assert.equal(q?.code, code);
  }
  const r = meds([item("scale", "2024-01-01", med("M1", "start", { dose: undefined, frequency: "OTHER", sig: "Sliding scale 1 to 10 units" }))])[0];
  assert.equal(r.dosageInstruction?.[0].doseAndRate, undefined);
  assert.equal(r.dosageInstruction?.[0].timing?.code.text, "other");
});
test("release-duration prefixes and ingredient combinations are normalized without dropping ingredients", () => {
  const old = item("old", "2024-01-01", med("M1", "stop", { drug: { name: "Glucophage XR 500 MG Oral Tablet" } }));
  const recent = item("recent", "2024-02-01", med("M2", "start", { drug: { name: "24 HR metformin hydrochloride 500 MG Extended Release Oral Tablet" } }));
  const r = meds([old, recent]);
  assert.equal(r.length, 1); assert.equal(r[0].status, "active");
  assert.match(r[0].medicationCodeableConcept.text!, /\(metformin\)$/);
  const combination = meds([item("combo", "2024-01-01", med("M1", "start", {
    drug: { name: "losartan potassium 50 MG / hydrochlorothiazide 12.5 MG Oral Tablet" },
  }))])[0];
  assert.match(combination.medicationCodeableConcept.text!, /\(hydrochlorothiazide \/ losartan\)$/);
  assert.equal(combination.dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.code, "{tbl}");
});
test("all 23 tracked analytes without LOINC receive required units and fallback codes", () => {
  const definitions = [
    ["creatinine", "CREAT", "mg/dL", "2160-0"], ["egfr", "EGFR21", "mL/min/1.73m2", "98979-8"],
    ["potassium", "K", "mmol/L", "2823-3"], ["sodium", "NA", "mmol/L", "2951-2"],
    ["chloride", "CL", "mmol/L", "2075-0"], ["bicarbonate", "CO2", "mmol/L", "2028-9"],
    ["anion_gap", "AGAP", "mmol/L", "33037-3"], ["bun", "BUN", "mg/dL", "3094-0"],
    ["glucose", "GLU", "mg/dL", "2345-7"], ["a1c", "A1C", "%", "4548-4"],
    ["uacr", "UACR", "mg/g", "9318-7"], ["platelets", "PLT", "cells/uL", "777-3"],
    ["wbc", "WBC", "cells/uL", "6690-2"], ["hemoglobin", "HGB", "g/dL", "718-7"],
    ["bhb", "BHB", "mmol/L", "53060-9"], ["ph", "VPH", "", "2746-6"],
    ["pco2", "VPCO2", "mmHg", "2021-4"], ["lipase", "LIPASE", "U/L", "3040-3"],
    ["troponin", "TROP-I", "ng/mL", "10839-9"], ["cholesterol", "CHOL", "mg/dL", "2093-3"],
    ["triglycerides", "TG", "mg/dL", "2571-8"], ["hdl", "HDL", "mg/dL", "2085-9"],
    ["ldl", "LDL-CALC", "mg/dL", "13457-7"],
  ];
  const r = labs(definitions.map(([a, c, u]) => item(a, "2024-01-01", lab(c, "10", u))));
  assert.equal(r.length, 23);
  for (const [a, c, , l] of definitions) {
    const o = r.find(v => v.code.text === a)!;
    assert.equal(o.code.coding?.[0].code, l); assert.equal(o.code.coding?.[1].code, c);
    assert.equal(o.valueQuantity.value, a === "platelets" || a === "wbc" ? 0.01 : 10);
    if (a !== "egfr") assert.equal(o.method, undefined);
  }
});
test("cell counts, comparators, preliminary status and eGFR UCUM", () => {
  const r = labs([item("plt", "2024-01-01", lab("PLT", "212000", "cells/uL")),
    item("wbc", "2024-01-01", lab("WBC", "7500", "cells/uL")),
    item("gfr", "2024-01-01", lab("EGFR21", ">=60", "mL/min/1.73m2", { result_status: "P" }))]);
  assert.equal(r.find(o => o.code.text === "platelets")?.valueQuantity.value, 212);
  assert.equal(r.find(o => o.code.text === "wbc")?.valueQuantity.value, 7.5);
  const gfr = r.find(o => o.code.text === "egfr")!;
  assert.equal(gfr.valueQuantity.comparator, ">="); assert.equal(gfr.status, "preliminary");
  assert.equal(gfr.valueQuantity.code, "mL/min/{1.73_m2}"); assert.equal(gfr.method?.text, "ckd-epi-2021");
});
test("multiple eGFR calculations survive, race coefficient variants do not, method note overrides LOINC", () => {
  const make = (code: string, name: string, loinc: string, comment: string) =>
    item(code, "2024-01-01", lab(code, "60", "mL/min/1.73m2", { test: { nfm_code: code, name, loinc }, comment }));
  const result = labs([
    make("EGFR-NAA", "eGFR (non-African American)", "48642-3", "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American."),
    make("EGFR-AA", "eGFR (African American)", "48643-1", "Calculated by CKD-EPI 2009."),
    make("EGFR21", "eGFR CKD-EPI 2021", "98979-8", ""), make("EGFR-MDRD", "eGFR MDRD", "48642-3", "MDRD"),
  ]);
  assert.equal(result.length, 3);
  assert.deepEqual(result.map(r => r.method?.text).sort(), ["ckd-epi-2009", "ckd-epi-2021", "mdrd"]);
  assert.equal(result.find(r => r.method?.text === "ckd-epi-2009")?.code.coding?.[0].code, "48642-3");
});
test("select advanced copy before parsing value; invalidation suppresses old result while retaining redraw", () => {
  const orig = item("orig", "2024-01-01", lab("K", "6.5", "mmol/L", { comment: "Specimen hemolyzed; may be falsely elevated." }));
  const corrected = item("corrected", "2024-01-01", lab("K", "Result invalidated", "mmol/L", { result_status: "C" }), { recorded: "2024-01-02T12:00:00-06:00" });
  const redraw = item("redraw", "2024-01-02", lab("K", "4.5", "mmol/L", { external_ref: { lab: "Lakeview Labs", accession: "A2", result_code: "LK-K" } }));
  assert.equal(labs([orig, corrected, redraw], "2024-01-01")[0].valueQuantity.value, 6.5);
  const r = labs([orig, corrected, redraw]); assert.equal(r.length, 1); assert.equal(r[0].valueQuantity.value, 4.5);
});
test("whole-report supersession removes omitted components", () => {
  const orig = item("original", "2024-01-01", {}, { payload: { a: lab("K", "7", "mmol/L"), b: lab("NA", "140", "mmol/L") } });
  const replacement = item("replacement", "2024-01-02", lab("K", "4.4", "mmol/L", { result_status: "C" }), { supersedes: ["original"] });
  const result = labs([orig, replacement]); assert.equal(result.length, 1);
  assert.equal(result[0].valueQuantity.value, 4.4); assert.equal(result[0].status, "final");
});
test("duplicates collapse and final outranks later preliminary; resource id survives copies", () => {
  const first = item("one", "2024-01-01", lab("K", "4.4", "mmol/L"));
  const copy = item("two", "2024-01-02", lab("K", "4.4", "mmol/L"));
  const preliminary = item("three", "2024-01-03", lab("K", "4.3", "mmol/L", { result_status: "P" }));
  const result = labs([first, preliminary, copy]); assert.equal(result.length, 1);
  assert.equal(result[0].valueQuantity.value, 4.4); assert.equal(result[0].id, labs([first])[0].id);
});
test("display names identify tracked tests when local codes are unfamiliar", () => {
  const r = labs([item("custom", "2024-01-01", lab("CUSTOM-812", "2.4", "mg/dL", { test: { name: "Creatinine, serum", nfm_code: "CUSTOM-812" } }))]);
  assert.equal(r.length, 1); assert.equal(r[0].code.text, "creatinine");
});
test("untracked tests, non-numeric results and incompatible units are omitted", () => {
  const cases = [
    lab("ALB", "4.0", "g/dL", { test: { nfm_code: "ALB", name: "Albumin" } }),
    lab("CREAT-U", "100", "mg/dL", { test: { nfm_code: "CREAT-U", name: "Creatinine, urine" } }),
    lab("NONHDL", "100", "mg/dL", { test: { nfm_code: "NONHDL", name: "Non-HDL cholesterol" } }),
    lab("TROP-T", "0.1", "ng/mL", { test: { nfm_code: "TROP-T", name: "Troponin T" } }),
    lab("K", "Hemolyzed", "mmol/L"), lab("NA", "140x", "mmol/L"), lab("GLU", "100", "mystery-unit"),
  ];
  assert.equal(labs(cases.map((data, i) => item(String(i), "2024-01-01", data))).length, 0);
});
test("malformed input is skipped and impossible dates do not silently normalize", () => {
  const bad: unknown[] = [null, true, "oops", 123, [], {}, { ...start, payload: null }, { ...start, recorded: "2024-02-31T10:00:00Z" },
    { ...start, payload: { e: null, e2: [], e3: { type: "med_event" }, e4: { type: "imported_result", test: null } } }];
  assert.deepEqual(transform(bad as FolioItem[], "2025-01-01"), { medicationRequests: [], observations: [] });
  assert.deepEqual(transform(null as unknown as FolioItem[], "2025-01-01"), { medicationRequests: [], observations: [] });
  assert.equal(meds([start], "2024-02-31").length, 0);
});
test("order-independent output, valid unique ids, no input mutation", () => {
  const data = [...all, item("lab", "2024-01-01", lab("PLT", "212000", "cells/uL"))];
  const before = JSON.stringify(data), expected = transform(data, "2025-01-01");
  for (let i = 0; i < data.length; i++) assert.deepEqual(transform([...data.slice(i), ...data.slice(0, i)].reverse(), "2025-01-01"), expected);
  assert.equal(JSON.stringify(data), before);
  const ids = [...expected.medicationRequests, ...expected.observations].map(r => r.id);
  assert.equal(new Set(ids).size, ids.length); assert.ok(ids.every(id => /^[A-Za-z0-9.-]{1,64}$/.test(id)));
});
test("sample correction yields three standing labs and one medication", () => {
  const groups = JSON.parse(readFileSync(new URL("../in/samples/samples.json", import.meta.url), "utf8"));
  const rows = transform(groups[0].items, "2026-10-13");
  assert.equal(rows.medicationRequests.length, 1);
  assert.deepEqual(rows.observations.map(o => o.code.text).sort(), ["creatinine", "egfr", "sodium"]);
  assert.equal(rows.observations.find(o => o.code.text === "egfr")?.method?.text, "ckd-epi-2009");
});
console.log(`${checks} tests passed`);
