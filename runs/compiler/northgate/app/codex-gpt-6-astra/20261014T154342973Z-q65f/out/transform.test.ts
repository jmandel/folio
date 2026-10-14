import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

let count = 0;
function test(name: string, run: () => void) { run(); count++; console.log(`ok ${count}: ${name}`); }
function item(id: string, payload: Record<string, unknown>, effective = "2024-01-01T09:00:00-06:00", extras: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "northgate", patient: "one", effective, recorded: effective, narrative: "", payload, ...extras };
}
function med(action = "start", extras: Record<string, unknown> = {}) {
  return { type: "med_event", med_id: "m", action, origin: "northgate", drug: { name: "losartan potassium 50 MG Oral Tablet", rxnorm: "product-code" }, dose: { value: 50, unit: "mg" }, frequency: "QD", ...extras };
}
function problem(action = "add", extras: Record<string, unknown> = {}) {
  return { type: "problem_event", problem_id: "p", action, description: "Chronic kidney disease stage 3a", icd10cm: "N18.31", ...extras };
}
function allergy(action = "add", extras: Record<string, unknown> = {}) {
  return { type: "allergy_event", allergy_id: "a", action, substance: { name: "lisinopril", rxnorm: "29046" }, reaction_type: "intolerance", reactions: ["Cough"], severity: "low", ...extras };
}
function lab(code = "K", value = "4.2", unit = "mmol/L", extras: Record<string, unknown> = {}) {
  return { type: "imported_result", test: { nfm_code: code, name: code }, value, unit, result_status: "F", collected: "2024-01-01T09:00:00-06:00", resulted: "2024-01-01T12:00:00-06:00", external_ref: { lab: "Lakeview Labs", accession: "a", result_code: code }, ...extras };
}
const run = (items: FolioItem[], asOf = "2026-10-13") => transform(items, asOf);
const day = (d: number) => `2024-01-${String(d).padStart(2, "0")}T09:00:00-06:00`;

test("samples: concentration is not a second ingredient; corrected potassium and race variant omitted", () => {
  const samples = JSON.parse(readFileSync(new URL("../in/samples/samples.json", import.meta.url), "utf8"));
  const rows = run(samples[0].items);
  assert.equal(rows.medications.length, 1);
  assert.equal(rows.medications[0].ingredient, "insulin glargine");
  assert.deepEqual(rows.medications[0].dose, { value: 10, unit: "units" });
  assert.deepEqual(rows.labs.map(x => x.analyte), ["creatinine", "egfr", "sodium"]);
  assert.equal(rows.problems.length, 3);
  assert.equal(rows.problems.find(p => p.icd10cm === "I10")?.onset?.value, "2010-11");
  assert.equal(rows.vitals[0].weight_kg, 86.5);
  assert.equal(run(samples[2].items).allergies[0].mechanism, "non_immune");
  assert.deepEqual(rows, run([...samples[0].items].reverse()));
});
test("recorded cutoff is Chicago end of day, including naive timestamps", () => {
  const a = item("a", { m: med() }, "2030-01-01", { recorded: "2024-01-02T05:59:59.999Z" });
  const b = item("b", { m: med("stop") }, day(2), { recorded: "2024-01-02T06:00:00Z" });
  assert.equal(run([a, b], "2024-01-01").medications[0].status, "active");
  const c = item("c", { m: med("hold") }, "2024-01-01T23:59:59.999", { recorded: "2024-01-01T23:59:59.999" });
  assert.equal(run([c], "2024-01-01").medications[0].status, "held");
  assert.equal(run([c], "2023-12-31").medications.length, 0);
});
test("clinical replay uses effective time, not input order or filing date", () => {
  const start = item("z", { m: med() }, day(1), { recorded: day(9) });
  const hold = item("a", { m: med("hold", { review_on: "2024-01-03" }) }, day(2));
  const rows = run([hold, start]);
  assert.equal(rows.medications[0].status, "held");
  assert.equal(rows.medications[0].status_since, "2024-01-02");
});
test("change retains activation date and evidence, review cannot change it", () => {
  const rows = run([item("a", { m: med() }, day(1)), item("b", { m: med("change", { dose: { value: 100, unit: "mg" } }) }, day(2)), item("c", { r: { type: "list_reviewed", list: "medications", lines_on_list: [] } }, day(3))]);
  assert.equal(rows.medications[0].status_since, "2024-01-01");
  assert.equal(rows.medications[0].dose?.value, 100);
  assert.deepEqual(rows.medications[0].evidence.map(e => e.item_id), ["a", "b"]);
  assert.equal(rows.medications[0].rxnorm_ingredient, undefined);
});
test("latest line event wins among duplicate ingredients, stopped lines remain", () => {
  const rows = run([item("a", { m: med("start", { med_id: "old" }) }, day(1)), item("b", { m: med("start", { med_id: "new" }) }, day(2)), item("c", { m: med("stop", { med_id: "old", stop_reason: "patient_choice" }) }, day(3))]);
  assert.equal(rows.medications.length, 1);
  assert.equal(rows.medications[0].status, "stopped");
  assert.equal(rows.medications[0].stop_reason, "patient_choice");
});
test("future corrections do not apply; supersession chains replace the entire item", () => {
  const a = item("a", { m: med(), p: problem() }, day(1));
  const b = item("b", { m: med("hold") }, day(2), { supersedes: ["a"] });
  const c = item("c", { m: med("stop") }, day(3), { supersedes: ["b"] });
  assert.equal(run([a, b, c], "2024-01-01").problems.length, 1);
  const rows = run([a, b, c]);
  assert.equal(rows.medications[0].status, "stopped");
  assert.equal(rows.problems.length, 0);
});
test("retracted latest event reveals surviving history; retracted correction has no effect", () => {
  const a = item("a", { m: med() }, day(1));
  const b = item("b", { m: med("hold") }, day(2));
  const c = item("c", {}, day(3), { retracts: ["b"] });
  assert.equal(run([a, b, c]).medications[0].status, "active");
  b.supersedes = ["a"];
  assert.equal(run([a, b, c]).medications[0].status, "active");
});
test("outside clinician medicines remain clinician reported, with normalized doses", () => {
  const rows = run([item("a", { m: med("start", { origin: "outside", drug: { name: "metoprolol succinate 25 MG Extended Release Tablet", outside_code: { system: "lakeview-drug", code: "abc" } }, dose: { value: 2, unit: "tab" } }) })]);
  assert.equal(rows.medications[0].ingredient, "metoprolol");
  assert.deepEqual(rows.medications[0].dose, { value: 50, unit: "mg" });
  assert.equal(rows.medications[0].patient_reported, false);
  assert.equal(rows.medications[0].rxnorm_ingredient, undefined);
});
test("generic combination ingredients and per-ingredient tablet strength", () => {
  const rows = run([item("a", { m: med("start", { drug: { name: "amoxicillin 875 MG / clavulanic acid 125 MG Oral Tablet" }, dose: { value: 1, unit: "tab" } }) })]);
  assert.deepEqual(rows.medications.map(m => [m.ingredient, m.dose?.value]), [["amoxicillin", 875], ["clavulanic acid", 125]]);
});
test("BH entries are preserved and tagged; ingredient recognized from brand", () => {
  const rows = run([item("a", { m: med("start", { restricted: "BH", drug: { name: "Seroquel 25 mg tablet" } }), p: problem("add", { description: "Major depressive disorder", icd10cm: "F33.1", restricted: "BH" }) })]);
  assert.equal(rows.medications[0].ingredient, "quetiapine");
  assert.deepEqual(rows.medications[0].sensitivity, ["mental-health"]);
  assert.deepEqual(rows.problems[0].sensitivity, ["mental-health"]);
});
test("problem updates, resolution and removal; fuzzy onset; no lab-derived stage", () => {
  const a = item("a", { p: problem("add", { onset: { date: "2016-01-01", precision: "year" } }) }, day(1));
  assert.deepEqual(run([a]).problems[0].onset, { value: "2016", precision: "year" });
  const b = item("b", { p: problem("update", { description: "CKD G3bA3", icd10cm: "N18.32" }), k: lab("EGFR", "12", "mL/min/1.73m2") }, day(2));
  assert.equal(run([a, b]).problems[0].ckd_stage, "G3b");
  assert.equal(run([a, b]).problems[0].albuminuria, "A3");
  assert.equal(run([a, item("c", { p: problem("resolve") }, day(3))]).problems[0].status, "resolved");
  assert.equal(run([a, item("d", { p: problem("remove") }, day(4))]).problems.length, 0);
  assert.equal(run([item("x", { p: problem("add", { description: "Chronic kidney disease stage 3", icd10cm: "N18.30" }) })]).problems[0].ckd_stage, undefined);
});
test("billing diagnoses and narrative alone never create rows; referral diagnoses do", () => {
  const rows = run([item("a", { v: { type: "visit", visit_id: "v", reason: "checkup", visit_type: "office" }, b: { type: "billing_dx", icd10cm: "I10", display: "Hypertension" }, r: { type: "referral_dx", referral_id: "r", icd10cm: "N18.31", display: "CKD" } }, day(1), { narrative: "Insulin 10 units. BP 200/120. Potassium 9." })]);
  assert.equal(rows.problems.length, 1);
  assert.equal(rows.medications.length + rows.labs.length + rows.vitals.length, 0);
});
test("allergy actions, clinical reaction kind, criticality, and ingredient-only codes", () => {
  const a = item("a", { x: allergy("add", { reactions: ["Lip swelling", "Hives"], severity: "high" }) }, day(1));
  const row = run([a]).allergies[0];
  assert.equal(row.reaction_type, "hypersensitivity");
  assert.equal(row.mechanism, "non_immune");
  assert.equal(row.criticality, "high");
  assert.equal(row.reaction, "Lip swelling; Hives");
  assert.equal(run([a, item("b", { x: allergy("inactivate") }, day(2))]).allergies.length, 0);
  const food = run([item("c", { x: allergy("add", { substance: { name: "Peanut" }, reaction_type: "allergy", reactions: ["Anaphylaxis"] }) })]).allergies[0];
  assert.equal(food.substance, "Peanut");
  assert.equal(food.mechanism, "immune");
});
test("drug-attributed problem emits both views and a drug class remains as written", () => {
  const a = run([item("a", { p: problem("add", { description: "Urticaria due to amoxicillin", icd10cm: "L50.0" }) })]);
  assert.equal(a.problems.length, 1);
  assert.equal(a.allergies[0].substance, "amoxicillin");
  assert.equal(a.allergies[0].reaction_type, "hypersensitivity");
  const b = run([item("b", { p: problem("add", { description: "Adverse effect of penicillins", icd10cm: "T36.0X5A" }) })]);
  assert.equal(b.problems.length, 0);
  assert.equal(b.allergies[0].substance, "penicillins");
});
test("blood counts converted back from cells/uL; comparators retained", () => {
  const rows = run([item("a", { p: lab("PLT", "212000", "cells/uL"), w: lab("WBC", "<500", "cells/uL") })]).labs;
  assert.equal(rows.find(r => r.analyte === "platelets")?.value, 212);
  assert.equal(rows.find(r => r.analyte === "wbc")?.value, 0.5);
  assert.equal(rows.find(r => r.analyte === "wbc")?.comparator, "<");
});
test("most advanced result copy wins; nonnumeric corrected copy suppresses old numeric", () => {
  const a = item("a", { k: lab("K", "6.5", "mmol/L", { result_status: "P" }) }, day(1));
  const b = item("b", { k: lab("K", "4.3", "mmol/L") }, day(2));
  assert.equal(run([a, b]).labs.length, 1);
  assert.equal(run([a, b]).labs[0].value, 4.3);
  assert.equal(run([a, b]).labs[0].evidence.length, 2);
  const c = item("c", { k: lab("K", "Result invalidated", "mmol/L", { result_status: "C" }) }, day(3));
  assert.equal(run([a, b, c]).labs.length, 0);
  const redraw = item("d", { k: lab("K", "4.4", "mmol/L", { external_ref: { lab: "Lakeview Labs", accession: "redraw", result_code: "K" } }) }, day(3));
  assert.equal(run([a, b, c, redraw]).labs[0].value, 4.4);
});
test("multiple eGFR equations retained; with-race copy omitted, no equation inferred by date", () => {
  const a = run([item("a", {
    n: lab("EGFR-NAA", "61", "mL/min/1.73m2", { comment: "CKD-EPI 2009; report African American value for African American patients." }),
    r: lab("EGFR-AA", "70", "mL/min/1.73m2", { comment: "CKD-EPI 2009; report African American value for African American patients." }),
    m: lab("EGFR-MDRD", ">60", "mL/min/1.73m2"),
    f: lab("EGFR21", "68", "mL/min/1.73m2"),
    u: lab("EGFR", "65", "mL/min/1.73m2"),
  })]).labs;
  assert.deepEqual(a.map(r => r.egfr_equation), ["ckd-epi-2009", "ckd-epi-2021", "mdrd", "unknown"]);
  assert.equal(a.some(r => r.value === 70), false);
});
test("local wall clocks, winter/summer offsets, repeat BP and pound conversion", () => {
  const rows = run([
    item("w", { v: { type: "vital_set", bp: "152/94", bp_repeat: "138/86", weight_lb: 154 } }, "2025-03-04T03:30:00Z"),
    item("s", { v: { type: "vital_set", pulse_bpm: 70 } }, "2025-07-01T12:15:00"),
    item("l", { k: lab("K", "4.1", "mmol/L", { collected: "2025-07-01T12:15:00" }) }, "2025-07-01T12:15:00"),
  ]);
  assert.equal(rows.vitals[0].local_time, "2025-03-03T21:30");
  assert.equal(rows.vitals[0].repeat_systolic_mmhg, 138);
  assert.equal(rows.vitals[0].weight_kg, 69.9);
  assert.equal(rows.vitals[1].local_time, "2025-07-01T12:15");
  assert.equal(rows.labs[0].collected, "2025-07-01T12:15:00-05:00");
});
test("malformed entries are skipped without throwing or inventing values", () => {
  assert.doesNotThrow(() => run([null, {}, item("a", { x: null, y: [1], z: { type: "med_event", action: "start", med_id: "m", drug: { name: "constructor" } }, bad: lab("K", "4.2 error", "mmol/L") }), item("b", {}, "not-a-date")] as any));
  assert.deepEqual(run([item("a", { k: lab("K", "4.2", "unknown") })]).labs, []);
  assert.deepEqual(run([item("a", {}, day(1), { supersedes: ["b"] }), item("b", {}, day(2), { supersedes: ["a"] })]), { medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  assert.doesNotThrow(() => transform(null as any, "2024-01-01"));
});
test("release-duration prefixes and combination strengths do not become ingredients", () => {
  const single = run([item("a", { m: med("start", { drug: { name: "24 HR metformin hydrochloride 500 MG Extended Release Oral Tablet" } }) })]).medications[0];
  assert.equal(single.ingredient, "metformin");
  for (const name of ["lisinopril-hydrochlorothiazide 20-12.5 MG Oral Tablet", "Zestoretic 20-12.5 mg tablet"]) {
    const rows = run([item("b", { m: med("start", { drug: { name }, dose: { value: 2, unit: "tab" } }) })]).medications;
    assert.deepEqual(rows.map(m => [m.ingredient, m.dose?.value]), [["hydrochlorothiazide", 25], ["lisinopril", 40]]);
  }
});
test("a referral's old code does not duplicate a recoded problem-list line", () => {
  const rows = run([
    item("a", { p: problem("add", { description: "Major depression, moderate", icd10cm: "F33.1" }) }, day(1)),
    item("b", { r: { type: "referral_dx", referral_id: "r", icd10cm: "F33.1", display: "Major depression, moderate" } }, day(2)),
    item("c", { p: problem("update", { description: "Major depression, severe", icd10cm: "F33.2" }) }, day(3)),
  ]).problems;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].icd10cm, "F33.2");
});
test("known drug-attributed serious harm produces a separate adverse-event entry", () => {
  const rows = run([item("a", { p: problem("add", { description: "Liver injury due to isoniazid", icd10cm: "K71.9" }) })]);
  assert.equal(rows.problems.length, 1);
  assert.equal(rows.allergies[0].substance, "isoniazid");
  assert.equal(rows.allergies[0].reaction_type, "serious_adverse_event");
  assert.equal(rows.allergies[0].criticality, "unknown");
});
test("DST days and fractional cutoff are local, not fixed 24-hour UTC days", () => {
  for (const [asOf, inside, outside] of [
    ["2025-03-09", "2025-03-10T04:59:59.999Z", "2025-03-10T05:00:00Z"],
    ["2025-11-02", "2025-11-03T05:59:59.999Z", "2025-11-03T06:00:00Z"],
  ]) {
    assert.equal(run([item("a", { m: med() }, inside)], asOf).medications.length, 1);
    assert.equal(run([item("b", { m: med() }, outside)], asOf).medications.length, 0);
  }
});
test("malformed field matrix is total and does not mutate the input", () => {
  const bad: unknown[] = [null, undefined, [], {}, true, 42, NaN, Infinity, "", "constructor", "0000-01-01", "0001-01-01", "9999-12-31", "2025-99-99", "2025-03-09T02:30:00"];
  for (const value of bad) {
    for (const field of ["recorded", "effective", "payload", "supersedes", "retracts"]) {
      const a = item("a", { m: med() }, day(1), { [field]: value } as any);
      assert.doesNotThrow(() => run([a]));
    }
    for (const base of [med(), problem(), allergy(), lab(), { type: "vital_set", bp: "120/80" }]) {
      for (const field of Object.keys(base)) {
        assert.doesNotThrow(() => run([item("a", { x: { ...base, [field]: value } })]));
      }
    }
  }
  const input = [item("a", { m: med(), p: problem(), l: lab(), v: { type: "vital_set", bp: "120/80" } })];
  const before = JSON.stringify(input);
  run(input);
  assert.equal(JSON.stringify(input), before);
});
console.log(`${count} tests passed`);
