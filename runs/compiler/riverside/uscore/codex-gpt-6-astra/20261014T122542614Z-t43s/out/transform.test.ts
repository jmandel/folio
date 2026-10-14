import { strict as assert } from "node:assert";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/uscore";

let checks = 0;
function check(name: string, run: () => void) {
  run(); checks++; console.log(`ok ${checks}: ${name}`);
}
function item(id: string, recorded: string, payload: Record<string, unknown>, extra = {}): FolioItem {
  return { folio: "0.1", id, issuer: "did:web:riverside.example", patient: "patient-1",
    recorded, effective: recorded, narrative: "", payload, ...extra };
}
function enc(kind = "progress_note", encounter_id = "enc-1") {
  return { type: "encounter", encounter_id, document_kind: kind, class: "inpatient", service: "Hospital Medicine" };
}
function med(status = "continue", extra = {}) {
  return { type: "home_med", drug_name: "metformin 500 mg tablet", rxnorm_ingredient: "6809", dose_text: "500 mg", sig: "1 tab PO BID", status, ...extra };
}
function result(extra = {}) {
  return { type: "result", accession: "specimen-1", collected: "2025-01-01T12:00:00Z", specimen: "serum", status: "final",
    test: { local_code: "CREAT", loinc: "2160-0", name: "Creatinine" }, value: "1.2", unit: "mg/dL", ...extra };
}
const rows = (items: FolioItem[], asOf = "2026-10-13") => transform(items, asOf);

check("Chicago end-of-day uses the offset on each date, including DST transitions", () => {
  for (const [asOf, last, next] of [
    ["2025-01-01", "2025-01-02T05:59:59.999Z", "2025-01-02T06:00:00Z"],
    ["2025-07-01", "2025-07-02T04:59:59.999Z", "2025-07-02T05:00:00Z"],
    ["2025-03-09", "2025-03-10T04:59:59.999Z", "2025-03-10T05:00:00Z"],
    ["2025-11-02", "2025-11-03T05:59:59.999Z", "2025-11-03T06:00:00Z"],
  ]) {
    const a = item("a", last, { enc: enc(), med: med("held") });
    const b = item("b", next, { enc: enc(), med: med("continue") });
    assert.equal(rows([b, a], asOf).medicationRequests[0].status, "on-hold");
  }
});

check("recorded, rather than effective, controls knowledge at an asOf date", () => {
  const a = item("a", "2025-01-03T18:00:00Z", { r: result() }, { effective: "2024-01-01" });
  assert.equal(rows([a], "2025-01-02").observations.length, 0);
  assert.equal(rows([a], "2025-01-03").observations.length, 1);
});

check("correction chains, retractions and their historical scope", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { r: result() });
  const b = item("b", "2025-01-02T18:00:00Z", { r: result({ value: "1.5" }) }, { supersedes: ["a"] });
  const c = item("c", "2025-01-03T18:00:00Z", { r: result({ value: "2" }) }, { supersedes: ["b"] });
  const d = item("d", "2025-01-04T18:00:00Z", {}, { retracts: ["c"] });
  assert.equal(rows([c, a, d, b], "2025-01-01").observations[0].valueQuantity.value, 1.2);
  assert.equal(rows([c, a, d, b], "2025-01-02").observations[0].valueQuantity.value, 1.5);
  assert.equal(rows([c, a, d, b], "2025-01-03").observations[0].valueQuantity.value, 2);
  assert.equal(rows([c, a, d, b]).observations.length, 0);
  const foreign = item("foreign", "2025-01-04T18:00:00Z", {}, { issuer: "did:web:other.example", retracts: ["a"] });
  assert.equal(rows([a, foreign]).observations.length, 1);
});

check("latest discharge controls the encounter even with a late progress note", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { enc: enc(), med: med("held") });
  const b = item("b", "2025-01-02T18:00:00Z", { enc: enc("discharge_summary"), renamed: med("continue") });
  const c = item("c", "2025-01-03T18:00:00Z", { enc: enc(), med: med("stopped") });
  assert.equal(rows([c, a, b]).medicationRequests[0].status, "active");
  assert.equal(rows([c, a, b], "2025-01-01").medicationRequests[0].status, "on-hold");
  const d = item("d", "2025-01-04T18:00:00Z", { enc: enc("discharge_summary"), med: med("changed", { dose_text: "1000 mg" }) });
  assert.equal(rows([d, c, b, a]).medicationRequests[0].dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.value, 1000);
});

check("latest snapshot removes absent drugs, and an empty list remains empty", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { enc: enc(), med: med(), other: med("continue", { drug_name: "losartan 25 mg tablet", rxnorm_ingredient: undefined }) });
  const b = item("b", "2025-01-02T18:00:00Z", { enc: enc(), otherKey: med("stopped") });
  const c = item("c", "2025-01-03T18:00:00Z", { enc: enc("ed_note", "enc-2") });
  assert.equal(rows([a, b]).medicationRequests.length, 1);
  assert.equal(rows([a, b]).medicationRequests[0].status, "stopped");
  assert.equal(rows([a, b, c]).medicationRequests.length, 0);
});

check("held advice never implies stopped or an adverse-reaction stop reason", () => {
  const m = rows([item("a", "2025-01-01T18:00:00Z", { enc: enc("discharge_summary"), med: med("held", {
    restart_advice: "advise_against", instructions: "Do not resume until reviewed by PCP",
  }) })]).medicationRequests[0];
  assert.equal(m.status, "on-hold");
  assert.deepEqual(m.statusReason, [{ text: "Do not resume until reviewed by PCP" }]);
  assert.equal(m.authoredOn, undefined);
});

check("unreconciled history is a reported plan, reconciled home decisions are orders", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { enc: enc("ed_note"), med: med("not_reconciled") });
  const m = rows([a]).medicationRequests[0];
  assert.equal(m.status, "unknown"); assert.equal(m.intent, "plan"); assert.equal(m.reportedBoolean, true);
  const b = item("b", "2025-01-02T18:00:00Z", { enc: enc(), med: med("continue") });
  assert.equal(rows([a, b]).medicationRequests[0].reportedBoolean, false);
});

check("inpatient-only drugs are excluded and never replace the home dose", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { enc: enc(), med: med(), inpatient: { type: "inpatient_med", drug_name: "insulin glargine", rxnorm_ingredient: "274783", dose_text: "17 units daily", started: "2025-01-01T10:00:00Z" } });
  assert.equal(rows([a]).medicationRequests.length, 1);
});

check("dose units, frequency, generic display, and explicit stop reasons", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { enc: enc(),
    insulin: med("new", { drug_name: "Lantus", rxnorm_ingredient: "274783", dose_text: "12 [iU]", sig: "12 units SubQ nightly" }),
    thyroid: med("continue", { drug_name: "levothyroxine sodium 25 mcg tablet", rxnorm_ingredient: undefined, dose_text: "25 mcg", sig: "once daily" }),
    stopped: med("stopped", { instructions: "Stopped due to side effects" }),
  });
  const meds = rows([a]).medicationRequests;
  const insulin = meds.find(m => m.medicationCodeableConcept.text === "Lantus")!;
  assert.equal(insulin.medicationCodeableConcept.coding?.[0].display, "insulin glargine");
  assert.equal(insulin.dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.code, "[iU]");
  assert.equal(insulin.dosageInstruction?.[0].timing?.code.text, "QHS");
  const thyroid = meds.find(m => m.medicationCodeableConcept.text?.startsWith("levothyroxine"))!;
  assert.equal(thyroid.medicationCodeableConcept.text, "levothyroxine sodium 25 mcg tablet (levothyroxine)");
  assert.equal(thyroid.dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.code, "ug");
  assert.equal(meds.find(m => m.status === "stopped")?.statusReason?.[0].coding?.[0].code, "adverse_reaction");
});

check("missing codes do not duplicate an ingredient and new dose instructions win", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { enc: enc(),
    oldKey: med("stopped"), newKey: med("changed", { drug_name: "Metformin hydrochloride 1000 mg tablet", rxnorm_ingredient: undefined, dose_text: "1000 mg" }),
  });
  const meds = rows([a]).medicationRequests;
  assert.equal(meds.length, 1);
  assert.equal(meds[0].status, "active");
  assert.equal(meds[0].dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.value, 1000);
  assert.equal(meds[0].medicationCodeableConcept.coding?.[0].code, "6809");
});

check("combination names retain both drugs, and twice weekly is not once weekly", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { enc: enc(), med: med("continue", {
    drug_name: "amoxicillin 875 mg / clavulanic acid 125 mg tablet", rxnorm_ingredient: undefined,
    dose_text: "1 tablet", sig: "twice weekly",
  }) });
  const m = rows([a]).medicationRequests[0];
  assert.ok(m.medicationCodeableConcept.text?.endsWith("(amoxicillin / clavulanic acid)"));
  assert.equal(m.dosageInstruction?.[0].timing?.code.text, "other");
});

check("correction status beats signing recency; same-status ties use signing recency", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { r: result({ status: "corrected", value: "1.6" }) });
  const b = item("b", "2025-01-02T18:00:00Z", { r: result({ status: "final", value: "1.2" }) });
  const c = item("c", "2025-01-03T18:00:00Z", { r: result({ status: "preliminary", value: "1.1" }) });
  assert.equal(rows([c, a, b]).observations[0].valueQuantity.value, 1.6);
  const d = item("d", "2025-01-04T18:00:00Z", { r: result({ status: "corrected", value: "1.8" }) });
  assert.equal(rows([c, a, d, b]).observations[0].valueQuantity.value, 1.8);
  assert.equal(rows([c, a, d, b]).observations[0].status, "final");
});

check("a corrected nonnumeric value suppresses previous numeric copies", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { r: result() });
  const b = item("b", "2025-01-02T18:00:00Z", { r: result({ value: "Hemolyzed, see comment", status: "corrected" }) });
  assert.equal(rows([a, b]).observations.length, 0);
});

check("panels flatten and deduplicate with standalone results; repeat specimens survive", () => {
  const r = result();
  const a = item("a", "2025-01-01T18:00:00Z", { r,
    panel: { ...r, type: "panel", components: [{ test: r.test, value: "1.3", unit: "mg/dL" }], status: "corrected" },
    repeat: result({ accession: "specimen-2" }),
  });
  const obs = rows([a]).observations;
  assert.equal(obs.length, 2);
  assert.deepEqual(obs.map(o => o.valueQuantity.value).sort(), [1.2, 1.3]);
});

check("comparators, unit conversions and missing LOINC fallback", () => {
  const a = item("a", "2025-01-01T18:00:00Z", {
    creat: result({ value: "88.4", unit: "umol/L" }),
    trop: result({ test: { local_code: "TNI", name: "Troponin I" }, value: "<10", unit: "ng/L" }),
    ph: result({ test: { local_code: "VPH", name: "pH, venous" }, value: "7.21", unit: undefined, specimen: "venous blood" }),
    plt: result({ test: { local_code: "PLT", name: "Platelets" }, value: "212,000", unit: "cells/uL", specimen: "whole blood" }),
    bhb: result({ test: { local_code: "BHB", name: "Beta-hydroxybutyrate" }, value: ">=5.1", unit: "mmol/L" }),
  });
  const obs = rows([a]).observations;
  assert.equal(obs.length, 5);
  const get = (name: string) => obs.find(o => o.code.text === name)!;
  assert.equal(get("creatinine").valueQuantity.value, 1);
  assert.equal(get("troponin").valueQuantity.value, 0.01);
  assert.equal(get("troponin").valueQuantity.comparator, "<");
  assert.equal(get("ph").valueQuantity.code, "[pH]");
  assert.equal(get("platelets").valueQuantity.value, 212);
  assert.equal(get("bhb").code.coding?.[0].code, "53060-9");
  assert.equal(get("bhb").valueQuantity.comparator, ">=");
});

check("eGFR preserves printed values and source coding, with documented equation", () => {
  const a = item("a", "2025-01-01T18:00:00Z", { r: result({
    test: { local_code: "EGFR", loinc: "33914-3", name: "eGFR" }, value: ">60", unit: "mL/min/1.73m2",
  }) });
  const o = rows([a]).observations[0];
  assert.equal(o.code.coding?.[0].code, "33914-3");
  assert.deepEqual(o.method, { text: "ckd-epi-2021" });
  assert.equal(o.valueQuantity.code, "mL/min/{1.73_m2}");
  assert.equal(o.valueQuantity.value, 60); assert.equal(o.valueQuantity.comparator, ">");
  const old = item("old", "2022-01-01T18:00:00Z", {
    nonrace: result({ collected: "2022-01-01T12:00:00Z", test: { local_code: "EGFR_NAA", loinc: "33914-3", name: "eGFR non-African American (CKD-EPI 2009)" }, value: "45", unit: "mL/min/1.73m2" }),
    race: result({ collected: "2022-01-01T12:00:00Z", test: { local_code: "EGFR_AA", name: "eGFR African American (CKD-EPI 2009)" }, value: "55", unit: "mL/min/1.73m2" }),
  });
  const historical = rows([old]).observations;
  assert.equal(historical.length, 1); assert.equal(historical[0].valueQuantity.value, 45);
  assert.deepEqual(historical[0].method, { text: "ckd-epi-2009" });
});

check("untracked tests, incompatible specimens, and unknown units are skipped", () => {
  const a = item("a", "2025-01-01T18:00:00Z", {
    unknown: result({ test: { local_code: "MYSTERY", name: "Unknown test" } }),
    urine: result({ test: { local_code: "UCREAT", name: "Urine creatinine" }, specimen: "urine" }),
    tropT: result({ test: { local_code: "TROP", name: "Troponin T" }, unit: "ng/mL" }),
    unit: result({ accession: "other", unit: "mystery" }),
    meter: result({ test: { local_code: "GLU", name: "Glucose" }, specimen: "capillary blood" }),
  });
  assert.equal(rows([a]).observations.length, 0);
});

check("every target analyte can be emitted with source LOINC and correct units", () => {
  const specs = [
    ["creatinine", "2160-0", "mg/dL"], ["egfr", "98979-8", "mL/min/1.73m2"],
    ["potassium", "2823-3", "mmol/L"], ["sodium", "2951-2", "mmol/L"], ["chloride", "2075-0", "mmol/L"],
    ["bicarbonate", "2028-9", "mmol/L"], ["anion_gap", "33037-3", "mmol/L"], ["bun", "3094-0", "mg/dL"],
    ["glucose", "2345-7", "mg/dL"], ["a1c", "4548-4", "%"], ["uacr", "9318-7", "mg/g"],
    ["platelets", "777-3", "10*3/uL"], ["wbc", "6690-2", "10*3/uL"], ["hemoglobin", "718-7", "g/dL"],
    ["bhb", "53060-9", "mmol/L"], ["ph", "2746-6", "[pH]"], ["pco2", "2021-4", "mmHg"],
    ["lipase", "3040-3", "U/L"], ["troponin", "10839-9", "ng/mL"], ["cholesterol", "2093-3", "mg/dL"],
    ["triglycerides", "2571-8", "mg/dL"], ["hdl", "2085-9", "mg/dL"], ["ldl", "13457-7", "mg/dL"],
  ];
  const payload = Object.fromEntries(specs.map(([name, loinc, unit]) => [name, result({ test: { local_code: name, name, loinc }, unit })]));
  const obs = rows([item("a", "2025-01-01T18:00:00Z", payload)]).observations;
  assert.deepEqual(obs.map(o => o.code.text).sort(), specs.map(([name]) => name).sort());
});

check("unfamiliar local codes can still be understood from specific test names", () => {
  const tests = [
    ["Carbon dioxide, total", "bicarbonate", "mmol/L"],
    ["White blood cell count", "wbc", "10*3/uL"],
    ["Platelet count", "platelets", "10*3/uL"],
    ["Urine albumin/creatinine ratio", "uacr", "mg/g"],
    ["High density lipoprotein cholesterol", "hdl", "mg/dL"],
    ["Low density lipoprotein cholesterol", "ldl", "mg/dL"],
  ];
  const payload = Object.fromEntries(tests.map(([name, analyte, unit], i) => [analyte,
    result({ test: { local_code: `RRH${i}`, name }, unit }),
  ]));
  const obs = rows([item("a", "2025-01-01T18:00:00Z", payload)]).observations;
  assert.deepEqual(obs.map(o => o.code.text).sort(), tests.map(([, a]) => a).sort());
});

check("malformed JSON-like input is skipped without throwing", () => {
  const bad = [null, false, 1, "text", [], {}, { payload: null }, { recorded: "invalid" },
    item("x", "2025-01-01T18:00:00Z", { bad: null, array: [], panel: { type: "panel", components: [null, 1, {}] }, med: { type: "home_med", drug_name: {} } })];
  assert.deepEqual(rows(bad as FolioItem[]), { medicationRequests: [], observations: [] });
  assert.deepEqual(rows(null as unknown as FolioItem[]), { medicationRequests: [], observations: [] });
  assert.deepEqual(rows([], "2025-02-30"), { medicationRequests: [], observations: [] });
});

const groups = await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).json();
check("sample invariants, order independence, valid unique FHIR ids, and no input mutation", () => {
  for (const [i, group] of groups.entries()) {
    const before = JSON.stringify(group.items), output = rows(group.items);
    assert.deepEqual(rows([...group.items].reverse()), output);
    assert.equal(JSON.stringify(group.items), before);
    assert.equal(output.medicationRequests.length, i === 0 ? 4 : 5);
    assert.equal(output.observations.length, i === 0 ? 30 : 31);
    const ids = [...output.medicationRequests, ...output.observations].map(r => r.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.every(id => /^[A-Za-z0-9.-]{1,64}$/.test(id)));
  }
});

console.log(`Passed ${checks} scenario groups.`);
