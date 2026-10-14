import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

let count = 0;
function test(name: string, fn: () => void) {
  try { fn(); count++; console.log(`ok ${count} - ${name}`); }
  catch (error) { console.error(`FAIL - ${name}`); throw error; }
}
function item(id: string, effective: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem {
  return {
    folio: "0.1", id, issuer: "did:web:northgate-fm.example", patient: "test",
    effective, recorded: effective.length === 10 ? effective + "T12:00:00-06:00" : effective,
    narrative: "", payload, ...extra,
  };
}
function med(id: string, action = "start", name = "losartan potassium 50 MG Oral Tablet", extra: Record<string, unknown> = {}) {
  return { type: "med_event", med_id: id, action, origin: "northgate", drug: { name, rxnorm: "product-only" }, dose: { value: 50, unit: "mg" }, frequency: "QD", ...extra };
}
function problem(id: string, description: string, code: string, action = "add", extra: Record<string, unknown> = {}) {
  return { type: "problem_event", problem_id: id, action, description, icd10cm: code, ...extra };
}
function lab(code: string, name: string, value: string, unit: string, extra: Record<string, unknown> = {}) {
  return { type: "imported_result", test: { nfm_code: code, name }, value, unit, result_status: "F", collected: "2024-01-02T08:00:00-06:00", resulted: "2024-01-02T10:00:00-06:00", external_ref: { lab: "Lakeview Labs", accession: "acc-1", result_code: "LK-" + code }, ...extra };
}
function allergy(id: string, name: string, reactions: string[], extra: Record<string, unknown> = {}) {
  return { type: "allergy_event", allergy_id: id, action: "add", substance: { name }, reaction_type: "allergy", reactions, severity: "unknown", ...extra };
}
const run = (items: FolioItem[], asOf = "2026-10-13") => transform(items, asOf);

test("sample results and entry-level provenance", () => {
  const groups = JSON.parse(readFileSync(new URL("../in/samples/samples.json", import.meta.url), "utf8"));
  const a = run(groups[0].items);
  assert.deepEqual(a.labs.map(x => [x.analyte, x.value]), [["creatinine", 1.13], ["egfr", 61], ["sodium", 137]]);
  assert.equal(a.medications[0].ingredient, "insulin glargine");
  assert.equal(a.medications[0].rxnorm_ingredient, undefined);
  assert.deepEqual(a.problems[0].onset, { value: "2010-11", precision: "month" });
  assert.equal(a.vitals[0].weight_kg, 86.5);
  assert.equal(run(groups[1].items).medications.length, 0);
  assert.equal(run(groups[2].items).allergies[0].reaction_type, "side_effect");
  assert.deepEqual(run(groups[0].items.slice().reverse()), a);
  assert.equal(run(groups[0].items, "2021-07-10").labs.length, 0);
});

test("recorded cutoff is Chicago midnight in both seasons", () => {
  for (const [day, before, after] of [
    ["2024-07-01", "2024-07-02T04:59:59Z", "2024-07-02T05:00:00Z"],
    ["2024-01-01", "2024-01-02T05:59:59Z", "2024-01-02T06:00:00Z"],
    ["2024-03-10", "2024-03-11T04:59:59Z", "2024-03-11T05:00:00Z"],
    ["2024-11-03", "2024-11-04T05:59:59Z", "2024-11-04T06:00:00Z"],
  ]) {
    const events = [item("a", day, { m: med("m") }, { recorded: before }), item("b", day, { m: med("m", "stop") }, { recorded: after })];
    assert.equal(run(events, day).medications[0].status, "active");
  }
});

test("corrections are scoped by recorded time and transitively suppress ancestors", () => {
  const a = item("a", "2024-01-01", { m: med("m") });
  const b = item("b", "2024-01-01", { m: med("m", "hold") }, { recorded: "2024-02-01T12:00:00-06:00", supersedes: ["a"] });
  const c = item("c", "2024-03-01", {}, { retracts: ["b"] });
  assert.equal(run([c, b, a], "2024-01-31").medications[0].status, "active");
  assert.equal(run([c, b, a], "2024-02-29").medications[0].status, "held");
  assert.equal(run([c, b, a]).medications.length, 0);
  const other = item("c", "2024-03-01", {}, { issuer: "did:web:other", retracts: ["a"] });
  assert.equal(run([a, other]).medications.length, 1);
});

test("active status starts at start/resume, changes and reviews do not reset it", () => {
  const events = [
    item("a", "2020", { m: med("m") }, { recorded: "2020-01-01T01:00:00-06:00" }),
    item("b", "2021-01-01", { m: med("m", "change", undefined, { dose: { value: 75, unit: "mg" } }) }),
    item("r", "2022-01-01", { review: { type: "list_reviewed", list: "medications", lines_on_list: ["m"] } }),
  ];
  let row = run(events).medications[0];
  assert.equal(row.status_since, "2020");
  assert.equal(row.dose?.value, 75);
  assert.deepEqual(row.evidence.map(e => e.item_id), ["b", "a"]);
  events.push(item("h", "2023-01-01", { m: med("m", "hold", undefined, { review_on: "2023-01-02", reason_text: "AKI" }) }));
  row = run(events).medications[0];
  assert.equal(row.status, "held");
  assert.equal(row.status_since, "2023-01-01");
  assert.equal(row.status_reason_text, "AKI");
  events.push(item("u", "2024-01-01", { m: med("m", "resume") }), item("v", "2025-01-01", { m: med("m", "change") }));
  assert.equal(run(events).medications[0].status_since, "2024-01-01");
  assert.equal(run([events[1]]).medications[0].status_since, undefined);
});

test("latest effective line wins per ingredient; voids cannot replace an older valid line", () => {
  const events = [
    item("a", "2024-01-01", { m: med("old") }),
    item("b", "2024-02-01", { m: med("new", "start", "Cozaar") }),
    item("c", "2024-03-01", { m: med("old", "stop", undefined, { stop_reason: "adverse_reaction", reason_text: "Cough" }) }),
  ];
  let rows = run(events).medications;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].status, "stopped");
  assert.equal(rows[0].stop_reason, "adverse_reaction");
  events.push(item("void", "2024-04-01", {}, { retracts: ["c", "b"] }));
  assert.equal(run(events).medications[0].status, "active");
  // A late-filed backdated event is not the latest clinical event.
  events.push(item("late", "2023-01-01", { m: med("old", "hold") }, { recorded: "2025-01-01T12:00:00-06:00" }));
  assert.equal(run(events).medications[0].status, "active");
});

test("tablet strengths, outside products and BH restrictions", () => {
  const row = run([item("a", "2024-01-01", { m: med("m", "start", "Zoloft 50 MG Oral Tablet", {
    restricted: "BH", origin: "outside", drug: { name: "Zoloft 50 MG Oral Tablet", outside_code: { system: "lakeview-drug", code: "abc" } }, dose: { value: 2, unit: "tab" }, frequency: "OTHER",
  }) })]).medications[0];
  assert.equal(row.ingredient, "sertraline");
  assert.deepEqual(row.dose, { value: 100, unit: "mg" });
  assert.deepEqual(row.sensitivity, ["mental-health"]);
  assert.equal(row.patient_reported, false);
  assert.equal(row.rxnorm_ingredient, undefined);
  assert.equal(row.frequency, "other");
});

test("problem replay, precision, CKD staging, removal and billing exclusion", () => {
  const events = [
    item("a", "2024-01-01", { p: problem("p", "Chronic kidney disease stage 3a", "N18.31", "add", { onset: { date: "2015-01-01", precision: "year" } }) }),
    item("b", "2024-02-01", { p: problem("p", "Chronic kidney disease G3b A2", "N18.32", "update", { onset: { date: "2015-01-01", precision: "year" } }) }),
    item("c", "2024-03-01", { p: problem("depression", "Depression", "F32.A", "resolve", { restricted: "BH" }) }),
    item("d", "2024-04-01", { b: { type: "billing_dx", icd10cm: "E11.9", display: "Diabetes" }, r: { type: "referral_dx", icd10cm: "N18.4", display: "CKD stage 4" } }),
  ];
  const rows = run(events).problems;
  assert.equal(rows.length, 2);
  assert.equal(rows[0].ckd_stage, "G3b");
  assert.equal(rows[0].albuminuria, "A2");
  assert.equal(rows[0].onset?.value, "2015");
  assert.equal(rows[1].status, "resolved");
  assert.deepEqual(rows[1].sensitivity, ["mental-health"]);
  events.push(item("e", "2024-05-01", { p: problem("p", "CKD", "N18.9", "remove") }));
  assert.equal(run(events).problems.length, 1);
});

test("condition re-listings merge, but a deleted erroneous line does not erase another", () => {
  const a = item("a", "2024-01-01", { p: problem("p1", "Essential hypertension", "I10") });
  const b = item("b", "2024-02-01", { p: problem("p2", "Hypertension", "I10") });
  const c = item("c", "2024-03-01", { p: problem("p2", "Hypertension", "I10", "remove") });
  assert.equal(run([a, b]).problems.length, 1);
  assert.equal(run([a, b]).problems[0].condition, "Hypertension");
  assert.equal(run([a, b, c]).problems[0].condition, "Essential hypertension");
});

test("allergy reaction phenotype differs from mechanism; inactivation persists", () => {
  const events = [item("a", "2024-01-01", {
    ace: allergy("ace", "lisinopril", ["Angioedema"], { severity: "high" }),
    cough: allergy("cough", "enalapril", ["Cough; no angioedema"], { reaction_type: "intolerance", severity: "low" }),
    rash: allergy("rash", "amoxicillin", ["Hives"]),
    dka: allergy("dka", "Jardiance", ["Ketoacidosis"], { reaction_type: "adverse_reaction", severity: "high" }),
  })];
  const rows = run(events).allergies;
  assert.equal(rows.find(r => r.substance === "lisinopril")?.reaction_type, "hypersensitivity");
  assert.equal(rows.find(r => r.substance === "lisinopril")?.mechanism, "non_immune");
  assert.equal(rows.find(r => r.substance === "enalapril")?.reaction_type, "side_effect");
  assert.equal(rows.find(r => r.substance === "amoxicillin")?.mechanism, "immune");
  assert.equal(rows.find(r => r.substance === "empagliflozin")?.reaction_type, "serious_adverse_event");
  events.push(item("b", "2024-02-01", { a: allergy("ace", "lisinopril", ["Angioedema"], { action: "inactivate" }) }));
  assert.equal(run(events).allergies.length, 3);
});

test("independent current allergy lines retain both reactions", () => {
  const result = run([
    item("a", "2024-01-01", { a: allergy("a1", "lisinopril", ["Angioedema"], { severity: "high" }) }),
    item("b", "2024-02-01", { a: allergy("a2", "lisinopril", ["Cough"], { severity: "low", reaction_type: "intolerance" }) }),
  ]);
  assert.equal(result.allergies.length, 1);
  assert.equal(result.allergies[0].reaction, "Angioedema; Cough");
  assert.equal(result.allergies[0].reaction_type, "hypersensitivity");
  assert.equal(result.allergies[0].criticality, "high");
});

test("drug-attributed diagnoses create avoidance rows without narrative invention", () => {
  const e = item("a", "2024-01-01", {
    p: problem("p", "SGLT2 inhibitor-associated ketoacidosis", "E11.10", "resolve"),
    m: med("m", "stop", "Jardiance 10 MG Oral Tablet"),
  });
  let result = run([e]);
  assert.equal(result.problems[0].status, "resolved");
  assert.equal(result.allergies[0].substance, "empagliflozin");
  assert.equal(result.allergies[0].criticality, "high");
  assert.equal(result.allergies[0].mechanism, "non_immune");
  assert.deepEqual(result.allergies[0].evidence.map(r => r.entry_id), ["p", "m"]);
  result = run([item("b", "2024-01-01", { p: e.payload.p }), item("c", "2024-01-01", { m: e.payload.m })]);
  assert.equal(result.allergies[0].substance, "SGLT2 inhibitor");
  const bare = item("t", "2024-01-01", { p: problem("t", "Adverse effect of lisinopril", "T46.4X5A") });
  assert.equal(run([bare]).problems.length, 0);
  assert.equal(run([bare]).allergies.length, 1);
  const dka = item("dka", "2024-01-01", { p: problem("dka", "Empagliflozin-associated euglycemic DKA", "E11.10") });
  assert.equal(run([dka]).allergies[0].mechanism, "non_immune");
  assert.equal(run([item("n", "2024-01-01", {}, { narrative: "Lisinopril caused angioedema. CKD stage 5." })]).allergies.length, 0);
  const nonDrug = item("not-drug", "2024-01-01", {
    p: problem("aki", "Acute kidney injury due to dehydration", "N17.9"),
    q: problem("acid", "Lactic acidosis not due to metformin", "E87.2"),
  });
  assert.equal(run([nonDrug]).allergies.length, 0);
});

test("correction removes only invalid components, redraws stand, counts are divided by 1000", () => {
  const original = item("a", "2024-01-02", { k: lab("K", "Potassium", "6.5", "mmol/L"), p: lab("PLT", "Platelets", "212000", "cells/uL"), w: lab("WBC", "WBC", "5400", "cells/uL") });
  const correction = item("b", "2024-01-02", { ...original.payload, k: lab("K", "Potassium", "Result invalidated", "mmol/L", { result_status: "C" }) }, { recorded: "2024-01-03T11:00:00-06:00", supersedes: ["a"] });
  const redraw = item("c", "2024-01-03", { k: lab("K", "Potassium", "4.5", "mmol/L", { collected: "2024-01-03T08:00:00-06:00", external_ref: { lab: "Lakeview Labs", accession: "acc-2", result_code: "LK-K" } }) });
  let rows = run([original, correction, redraw]).labs;
  assert.deepEqual(rows.map(r => [r.analyte, r.value]), [["platelets", 212], ["wbc", 5.4], ["potassium", 4.5]]);
  assert.equal(run([original, correction], "2024-01-02").labs.find(r => r.analyte === "potassium")?.value, 6.5);
  // A hemolysis caution alone does not withdraw a numeric result.
  rows = run([item("d", "2024-01-02", { k: lab("K", "Potassium", "6.5", "mmol/L", { comment: "Specimen hemolyzed; may be falsely high" }) })]).labs;
  assert.equal(rows[0].value, 6.5);
});

test("copies use most advanced status, including corrected-away copies", () => {
  const p = item("p", "2024-01-02", { k: lab("K", "Potassium", "6.2", "mmol/L", { result_status: "P" }) });
  const f = item("f", "2024-01-02", { k: lab("K", "Potassium", "6.0", "mmol/L") });
  const c = item("c", "2024-01-02", { k: lab("K", "Potassium", "Invalidated", "mmol/L", { result_status: "C" }) });
  assert.equal(run([p, f]).labs[0].value, 6);
  assert.equal(run([p, f, c]).labs.length, 0);
});

test("eGFR keeps non-race-coefficient values, all equations, and note overrides", () => {
  const base = lab("EGFR-NAA", "eGFR (non-African American)", ">60", "mL/min/1.73m2", { comment: "Calculated by CKD-EPI 2009." });
  const rows = run([item("a", "2024-01-02", {
    n: base,
    a: lab("EGFR-AA", "eGFR (African American)", "70", "mL/min/1.73m2", { comment: "Calculated by CKD-EPI 2009." }),
    m: lab("EGFR-MDRD", "eGFR MDRD", "55", "mL/min/1.73m2"),
    c: lab("EGFR21", "eGFR CKD-EPI 2021", "54", "mL/min/1.73m2", { comment: "Calculated by MDRD.", external_ref: { lab: "Lakeview Labs", accession: "acc-2", result_code: "LK-EGFR21" } }),
  })]).labs;
  assert.equal(rows.length, 3);
  assert.equal(rows.find(r => r.value === 60)?.comparator, ">");
  assert.equal(rows.find(r => r.value === 54)?.egfr_equation, "mdrd");
  assert.equal(rows.find(r => r.value === 60)?.egfr_equation, "ckd-epi-2009");
  const note = run([item("n", "2024-01-02", { r: lab("EGFR21", "eGFR CKD-EPI 2021", "56", "mL/min/1.73m2", { comment: "Calculated using the CKD-EPI creatinine equation (2009)." }) })]).labs[0];
  assert.equal(note.egfr_equation, "ckd-epi-2009");
  const mdrd = run([item("m", "2024-01-02", { r: lab("EGFR21", "eGFR CKD-EPI 2021", "56", "mL/min/1.73m2", { comment: "Calculated by MDRD, not CKD-EPI 2021." }) })]).labs[0];
  assert.equal(mdrd.egfr_equation, "mdrd");
});

test("different codes for one named eGFR calculation are one row", () => {
  const first = item("a", "2024-01-02", { e: lab("EGFR-NAA", "eGFR non-African American", "55", "mL/min/1.73m2", { comment: "Calculated by CKD-EPI 2009.", result_status: "P" }) });
  const final = item("b", "2024-01-02", { e: lab("EGFR09N", "eGFR non-African American", "54", "mL/min/1.73m2", { comment: "Calculated by CKD-EPI 2009." }) });
  assert.equal(run([first, final]).labs.length, 1);
  assert.equal(run([first, final]).labs[0].value, 54);
});

test("all supported analytes map without relying on LOINC", () => {
  const values: [string, string, string, string][] = [
    ["CREAT", "Creatinine, serum", "mg/dL", "creatinine"], ["K", "Potassium", "mmol/L", "potassium"],
    ["NA", "Sodium", "mmol/L", "sodium"], ["CL", "Chloride", "mmol/L", "chloride"],
    ["CO2", "Carbon dioxide, total", "mmol/L", "bicarbonate"], ["AG", "Anion gap", "mmol/L", "anion_gap"],
    ["BUN", "Urea nitrogen", "mg/dL", "bun"], ["GLU", "Glucose", "mg/dL", "glucose"],
    ["A1C", "Hemoglobin A1c", "%", "a1c"], ["UACR", "Albumin/creatinine ratio, urine", "mg/g", "uacr"],
    ["PLT", "Platelets", "cells/uL", "platelets"], ["WBC", "White blood cells", "cells/uL", "wbc"],
    ["HGB", "Hemoglobin", "g/dL", "hemoglobin"], ["BHB", "Beta-hydroxybutyrate", "mmol/L", "bhb"],
    ["PH", "pH", "", "ph"], ["PCO2", "pCO2", "mmHg", "pco2"], ["LIPASE", "Lipase", "U/L", "lipase"],
    ["TROP", "Troponin I", "ng/mL", "troponin"], ["CHOL", "Cholesterol", "mg/dL", "cholesterol"],
    ["TG", "Triglycerides", "mg/dL", "triglycerides"], ["HDL", "HDL cholesterol", "mg/dL", "hdl"],
    ["LDL", "LDL cholesterol", "mg/dL", "ldl"],
  ];
  const payload = Object.fromEntries(values.map(([code, name, unit], i) => [String(i), lab(code, name, "2.1", unit)]));
  const rows = run([item("all", "2024-01-02", payload)]).labs;
  assert.deepEqual(rows.map(r => r.analyte).sort(), values.map(v => v[3]).sort());
});

test("repeat BP stays on the same row, wall-clock times are preserved", () => {
  const rows = run([
    item("a", "2024-07-02T02:00:00Z", { v: { type: "vital_set", bp: "150/90", bp_repeat: "130/80", weight_lb: 200, pulse_bpm: 60 } }),
    item("b", "2024-01-02T09:30:00", { v: { type: "vital_set", bp: "120/70" } }, { recorded: "2024-01-02T10:00:00-06:00" }),
  ]).vitals;
  assert.equal(rows.length, 2);
  assert.equal(rows[0].local_time, "2024-01-02T09:30");
  assert.equal(rows[1].local_time, "2024-07-01T21:00");
  assert.equal(rows[1].repeat_systolic_mmhg, 130);
  assert.equal(rows[1].weight_kg, 90.7);
});

test("malformed and unfamiliar data are skipped without throwing or partial numeric parses", () => {
  const bad = [null, 1, "str", {}, { id: "x", issuer: "z", recorded: "not a date" }, item("bad", "2024-01-01", {
    a: null, b: "x", c: { type: "unknown" }, d: { type: "med_event", action: "start", med_id: "m", drug: null },
    l: lab("K", "Potassium", "6.5 invalidated", "mmol/L"), unknownUnit: lab("NA", "Sodium", "135", "mystery"),
    v: { type: "vital_set", bp: "120/x", weight_lb: "200" },
  })];
  assert.deepEqual(run(bad as any), { medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  assert.deepEqual(transform(null as any, "2024-01-01"), run([]));
  assert.deepEqual(run([], "2024-02-30"), run([]));
});

test("malformed fields on otherwise recognizable entries never crash", () => {
  const malformed = [null, false, 0, [], {}, { toString: null }, { toString: {} }, "__proto__", "constructor"];
  const examples = [med("m"), problem("p", "Hypertension", "I10"), allergy("a", "lisinopril", ["Cough"]), lab("K", "Potassium", "4.0", "mmol/L"), { type: "vital_set", bp: "120/80", pulse_bpm: 60 }];
  for (const example of examples) for (const field of Object.keys(example)) for (const value of malformed) {
    assert.doesNotThrow(() => run([item("bad", "2024-01-01", { e: { ...example, [field]: value } })]));
  }
  for (const value of malformed) {
    assert.doesNotThrow(() => run([item("loinc", "2024-01-01", { e: lab("UNRECOGNIZED", "Unrecognized", "1", "mg/dL", { test: { name: "Unrecognized", loinc: value } }) })]));
  }
});

console.log(`${count} tests passed`);
