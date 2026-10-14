import { strict as assert } from "node:assert";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const item = (id: string, recorded: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem => ({
  folio: "0.1", id, issuer: "rrh", patient: "p", effective: recorded, recorded, narrative: "", payload, ...extra,
});
const enc = (id = "stay", kind = "hp", arrived = "2025-04-01T12:00:00Z") => ({
  type: "encounter", encounter_id: id, document_kind: kind, class: "inpatient", service: "Hospital Medicine", arrived,
});
const med = (name: string, status: string, extra = {}) => ({ type: "home_med", drug_name: name, status, dose_text: "10 mg", sig: "daily", ...extra });
const dx = (label: string, status = "active", extra = {}) => ({ type: "diagnosis", label, status, ...extra });
const result = (accession: string, value: string, status = "final", extra = {}) => ({
  type: "result", test: { local_code: "K", loinc: "2823-3", name: "Potassium" }, accession,
  value, status, unit: "mmol/L", collected: "2025-04-01T15:00:00Z", specimen: "serum", ...extra,
});
const run = (items: FolioItem[], day = "2026-10-13") => transform(items, day);
let checks = 0;
function test(name: string, fn: () => void) { fn(); checks++; console.log(`ok ${name}`); }

test("sample output, exclusions, counts, and input-order independence", () => {
  const samples = JSON.parse(require("node:fs").readFileSync(new URL("../in/samples/samples.json", import.meta.url), "utf8"))[0].items;
  const rows = run(samples);
  assert.equal(rows.medications.length, 4);
  assert.equal(rows.medications.find(m => m.ingredient === "empagliflozin")?.status, "held");
  assert.equal(rows.problems.length, 3);
  assert.equal(rows.problems.find(p => p.icd10cm === "N17.9")?.status, "resolved");
  assert.equal(rows.allergies.find(a => a.substance === "lisinopril")?.reaction_type, "side_effect");
  assert.equal(rows.allergies.find(a => a.substance === "empagliflozin")?.criticality, "high");
  assert.equal(rows.labs.length, 49);
  assert.equal(rows.vitals.length, 7);
  assert.equal(rows.vitals[0].local_time, "2023-04-08T23:01");
  assert.deepEqual(rows, run(samples.toReversed()));
  const atDischarge = run(samples, "2023-04-12");
  assert.equal(atDischarge.medications.find(m => m.ingredient === "metformin")?.status, "active");
  assert.equal(atDischarge.medications.length, 3);
  assert.deepEqual(run(samples, "2023-04-08"), { medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});

test("Chicago end-of-day boundaries in summer and winter", () => {
  for (const [day, justBefore, after] of [
    ["2025-07-01", "2025-07-02T04:59:59.999Z", "2025-07-02T05:00:00Z"],
    ["2025-01-01", "2025-01-02T05:59:59.999Z", "2025-01-02T06:00:00Z"],
    ["2025-03-09", "2025-03-10T04:59:59.999Z", "2025-03-10T05:00:00Z"],
    ["2025-11-02", "2025-11-03T05:59:59.999Z", "2025-11-03T06:00:00Z"],
  ]) {
    const a = item("a", justBefore, { dx: dx("Hypertension", "active", { icd10cm: "I10" }) });
    const b = item("b", after, {}, { retracts: ["a"] });
    assert.equal(run([b, a], day).problems.length, 1);
    assert.equal(run([b, a]).problems.length, 0);
  }
});

test("transitive supersession, withdrawn replacement, and same-issuer isolation", () => {
  const a = item("a", "2025-04-01T12:00:00Z", { p: dx("First") });
  const b = item("b", "2025-04-02T12:00:00Z", { p: dx("Second") }, { supersedes: ["a"] });
  const c = item("c", "2025-04-03T12:00:00Z", { p: dx("Third") }, { supersedes: ["b"] });
  const retract = item("r", "2025-04-04T12:00:00Z", {}, { retracts: ["c"] });
  assert.deepEqual(run([c, a, b]).problems.map(p => p.condition), ["Third"]);
  assert.equal(run([retract, c, a, b]).problems.length, 0);
  assert.deepEqual(run([c, a, b], "2025-04-02").problems.map(p => p.condition), ["Second"]);
  assert.equal(run([a, { ...retract, issuer: "other", retracts: ["a"] }]).problems.length, 1);
});

test("medication snapshots remove absent drugs; empty snapshots clear the list", () => {
  const a = item("a", "2025-04-01T12:00:00Z", { enc: enc(), old_key: med("losartan 50 mg tablet", "held"), second: med("metformin", "continue") });
  const b = item("b", "2025-04-02T12:00:00Z", { enc: enc(), different_key: med("Cozaar", "continue", { dose_text: "50 mg" }) });
  const rows = run([b, a]).medications;
  assert.equal(rows.length, 1); assert.equal(rows[0].ingredient, "losartan"); assert.equal(rows[0].status, "active");
  assert.equal(rows[0].status_since, undefined);
  assert.equal(run([a, b, item("c", "2025-04-03T12:00:00Z", { enc: enc() })]).medications.length, 0);
});

test("discharge wins within its stay; a newer stay replaces an old discharge", () => {
  const discharge = item("a", "2025-04-03T12:00:00Z", { enc: enc("stay", "discharge_summary"), m: med("losartan", "continue") }, { effective: "2025-04-01T12:00:00Z" });
  const lateProgress = item("b", "2025-04-04T12:00:00Z", { enc: enc(), m: med("losartan", "held") });
  assert.equal(run([lateProgress, discharge]).medications[0].status, "active");
  const second = item("c", "2025-05-01T12:00:00Z", { enc: enc("next", "ed_note", "2025-05-01T11:00:00Z"), m: med("losartan", "not_reconciled") });
  const correction = { ...discharge, id: "d", recorded: "2025-05-02T12:00:00Z", supersedes: ["a"] };
  assert.equal(run([second, correction, discharge]).medications[0].status, "unknown");
});

test("held with advice against resumption stays held; hospital-only drug is omitted", () => {
  const i = item("a", "2025-04-01T12:00:00Z", { enc: enc(),
    m: med("Jardiance", "held", { restart_advice: "advise_against", instructions: "Recommend against restarting" }),
    inpatient: { type: "inpatient_med", drug_name: "insulin glargine", dose_text: "18 units", started: "2025-04-01T11:00:00Z" },
  });
  const rows = run([i]).medications;
  assert.equal(rows.length, 1); assert.equal(rows[0].status, "held"); assert.equal(rows[0].stop_reason, undefined);
  assert.equal(rows[0].patient_reported, false);
});

test("dose and frequency normalization, unsupported amounts, and ingredient normalization", () => {
  const examples = [
    ["metformin hydrochloride 500 mg tablet", "2 tablets", "b.i.d.", "metformin", 1000, "mg", "BID"],
    ["levothyroxine sodium 50 mcg tablet", "50 mcg", "daily", "levothyroxine", 50, "mcg", "QD"],
    ["insulin glargine", "12 [iU]", "at bedtime", "insulin glargine", 12, "units", "QHS"],
    ["acetaminophen", "1 g", "QID", "acetaminophen", 1000, "mg", "other"],
    ["naproxen", "1 or 2 tablets", "BID PRN", "naproxen", undefined, undefined, "PRN"],
    ["metformin", "1 tablet AM, 2 tablets PM", "with meals", "metformin", undefined, undefined, "other"],
  ];
  for (const [name, dose_text, sig, generic, amount, unit, freq] of examples) {
    const row = run([item("a", "2025-04-01T12:00:00Z", { enc: enc(), m: med(String(name), "continue", { dose_text, sig }) })]).medications[0];
    assert.equal(row.ingredient, generic); assert.equal(row.dose?.value, amount); assert.equal(row.dose?.unit, unit); assert.equal(row.frequency, freq);
  }
});

test("a changed dose in a snapshot wins over the stopped old dose", () => {
  const rows = run([item("a", "2025-04-01T12:00:00Z", { enc: enc(),
    a_new: med("metformin 1000 mg tablet", "changed", { dose_text: "1000 mg", rxnorm_ingredient: "6809" }),
    z_old: med("metformin 500 mg tablet", "stopped", { dose_text: "500 mg", rxnorm_ingredient: "6809" }),
  })]).medications;
  assert.equal(rows.length, 1); assert.equal(rows[0].status, "active"); assert.equal(rows[0].dose?.value, 1000);
});

test("working and ruled-out diagnoses do not become conditions or reactions", () => {
  const a = item("a", "2025-04-01T12:00:00Z", { enc: enc(), p: dx("R/O pancreatitis", "working"), m: med("Jardiance", "held"), d: dx("SGLT2 inhibitor-associated DKA", "working") });
  const b = item("b", "2025-04-02T12:00:00Z", { enc: enc(), p: dx("Acute pancreatitis", "ruled_out", { icd10cm: "K85.90" }) });
  assert.equal(run([a, b]).problems.length, 0); assert.equal(run([a, b]).allergies.length, 0);
});

test("a ruled-out recurrence does not erase a confirmed historical episode", () => {
  const a = item("a", "2025-04-01T12:00:00Z", { enc: enc("old"), p: dx("Acute kidney injury", "resolved", { icd10cm: "N17.9" }) });
  const b = item("b", "2025-05-01T12:00:00Z", { enc: enc("new"), p: dx("Acute kidney injury", "ruled_out", { icd10cm: "N17.9" }) });
  assert.equal(run([a, b]).problems[0].status, "resolved");
  assert.equal(run([a, { ...b, payload: { ...b.payload, enc: enc("old") } }]).problems.length, 0);
});

test("CKD restaging, explicit albuminuria, and partial onset precision", () => {
  const a = item("a", "2025-04-01T12:00:00Z", { enc: enc(), h: { type: "history", condition: "CKD stage 3a", icd10cm: "N18.31", source: "outside_records", onset_text: "2016" } });
  const b = item("b", "2025-04-02T12:00:00Z", { enc: enc(), p: dx("CKD stage 3b A2", "active", { icd10cm: "N18.32" }), k: result("low", "12", "final", { test: { local_code: "EGFR", name: "eGFR" }, unit: "mL/min/1.73m2" }) });
  const rows = run([a, b]).problems;
  assert.equal(rows.length, 1); assert.equal(rows[0].ckd_stage, "G3b"); assert.equal(rows[0].albuminuria, "A2");
  assert.deepEqual(rows[0].onset, { value: "2016", precision: "year" });
  assert.equal(rows[0].evidence.length, 2);
});

test("local diagnosis codes distinguish conditions sharing a coarse ICD code", () => {
  const a = item("a", "2025-04-01T12:00:00Z", { enc: enc(),
    a: dx("Condition variant A", "active", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-1", name: "A" } }),
    b: dx("Condition variant B", "active", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-2", name: "B" } }),
  });
  assert.equal(run([a]).problems.length, 2);
});

test("drug class resolves only to exactly one same-item ingredient", () => {
  const make = (extras: Record<string, unknown>) => item("a", "2025-04-01T12:00:00Z", { enc: enc(),
    p: dx("Euglycemic DKA, SGLT2 inhibitor-associated", "resolved"), ...extras,
  });
  const one = run([make({ m: med("Jardiance", "held", { rxnorm_ingredient: "1545653" }) })]).allergies[0];
  assert.equal(one.substance, "empagliflozin"); assert.equal(one.mechanism, "non_immune"); assert.equal(one.criticality, "high");
  const two = run([make({ m: med("Jardiance", "held"), n: med("Farxiga", "stopped") })]).allergies[0];
  assert.equal(two.substance, "SGLT2 inhibitor"); assert.equal(two.rxnorm_ingredient, undefined);
  assert.equal(run([make({})]).allergies[0].substance, "SGLT2 inhibitor");
});

test("T-code adverse effect alone yields an allergy, not a problem", () => {
  const rows = run([item("a", "2025-04-01T12:00:00Z", { enc: enc(), p: dx("Adverse effect of empagliflozin", "active", { icd10cm: "T38.3X5A" }) })]);
  assert.equal(rows.problems.length, 0); assert.equal(rows.allergies[0].substance, "empagliflozin");
});

test("non-drug causation and narrative-only facts do not create allergy rows", () => {
  const rows = run([item("a", "2025-04-01T12:00:00Z", { enc: enc(), p: dx("Acute kidney injury due to sepsis", "active") }, {
    narrative: "Naproxen caused an adverse event. The patient takes aspirin. History of diabetes.",
  })]);
  assert.equal(rows.allergies.length, 0); assert.equal(rows.medications.length, 0); assert.equal(rows.problems.length, 1);
});

test("reaction phenotype, mechanism, and severity are independent", () => {
  const rows = run([item("a", "2025-04-01T12:00:00Z", { enc: enc(),
    a: { type: "allergy", substance: "lisinopril", reaction: "angioedema", severity: "severe", rxnorm_ingredient: "29046" },
    b: { type: "allergy", substance: "penicillins", reaction: "hives", severity: "moderate" },
    c: { type: "allergy", substance: "atorvastatin", reaction: "myalgia", severity: "mild" },
  })]).allergies;
  const ace = rows.find(r => r.substance === "lisinopril")!;
  assert.equal(ace.reaction_type, "hypersensitivity"); assert.equal(ace.mechanism, "non_immune"); assert.equal(ace.criticality, "high");
  assert.equal(rows.find(r => r.substance === "penicillins")?.mechanism, "unknown");
  assert.equal(rows.find(r => r.substance === "penicillins")?.criticality, "unknown");
  assert.equal(rows.find(r => r.substance === "atorvastatin")?.reaction_type, "side_effect");
});

test("NKDA replaces the allergy-list snapshot but does not invalidate a diagnosis", () => {
  const a = item("a", "2025-04-01T12:00:00Z", { enc: enc(), a: { type: "allergy", substance: "lisinopril", reaction: "cough", severity: "mild" }, p: dx("Empagliflozin-associated ketoacidosis", "resolved") });
  const b = item("b", "2025-04-02T12:00:00Z", { enc: enc(), a: { type: "allergy", substance: "NKDA" } });
  assert.deepEqual(run([a, b]).allergies.map(a => a.substance), ["empagliflozin"]);
});

test("lab status advancement outranks copy date, and equal-status latest copy wins", () => {
  const a = item("a", "2025-04-01T16:00:00Z", { x: result("specimen", "6.0", "corrected") });
  const b = item("b", "2025-04-02T16:00:00Z", { x: result("specimen", "4.0", "final") });
  const c = item("c", "2025-04-03T16:00:00Z", { x: result("specimen", "5.0", "corrected") });
  assert.equal(run([a, b]).labs[0].value, 6); assert.equal(run([a, b, c]).labs[0].value, 5);
  assert.equal(run([a, b, c]).labs.length, 1); assert.equal(run([a, b, c]).labs[0].status, "final");
});

test("corrected nonnumeric results do not fall back to obsolete numeric values", () => {
  const a = item("a", "2025-04-01T16:00:00Z", { x: result("specimen", "6.0") });
  const b = item("b", "2025-04-02T16:00:00Z", { x: result("specimen", "Hemolyzed, see comment", "corrected") });
  assert.equal(run([a, b]).labs.length, 0);
});

test("panel and scalar copies deduplicate; separate accessions remain separate", () => {
  const r = result("specimen", "4.0");
  const rows = run([item("a", "2025-04-01T16:00:00Z", { scalar: r, repeat: { ...r, accession: "repeat" }, panel: {
    type: "panel", accession: r.accession, collected: r.collected, specimen: r.specimen, status: "corrected",
    components: [{ test: r.test, value: "4.2", unit: r.unit }],
  } })]).labs;
  assert.equal(rows.length, 2); assert.deepEqual(rows.map(r => r.value).sort(), [4, 4.2]);
});

test("lab comparators, units, absent pH unit, and nonnumeric filtering", () => {
  const rows = run([item("a", "2025-04-01T16:00:00Z", {
    platelets: result("p", "212000", "final", { test: { local_code: "PLT", name: "Platelets" }, unit: "cells/uL", specimen: "whole blood" }),
    troponin: result("t", "<10", "final", { test: { local_code: "TNI", name: "Troponin I" }, unit: "ng/L" }),
    ph: result("h", "7.21", "final", { test: { local_code: "VPH", name: "pH, venous" }, unit: undefined, specimen: "venous blood" }),
    bad: result("b", "4.0 see comment"),
    unknownUnit: result("u", "4", "final", { unit: "mg/kg" }),
  })]).labs;
  assert.equal(rows.length, 3);
  assert.equal(rows.find(r => r.analyte === "platelets")?.value, 212);
  assert.equal(rows.find(r => r.analyte === "troponin")?.value, 0.01);
  assert.equal(rows.find(r => r.analyte === "troponin")?.comparator, "<");
  assert.equal(rows.find(r => r.analyte === "ph")?.unit, "[pH]");
});

test("urine creatinine and troponin T are not consumer analytes", () => {
  assert.equal(run([item("a", "2025-04-01T16:00:00Z", {
    urine: result("u", "4", "final", { test: { local_code: "CREAT", name: "Creatinine" }, unit: "mg/dL", specimen: "urine" }),
    t: result("t", "0.01", "final", { test: { local_code: "TNT", name: "Troponin T" }, unit: "ng/mL" }),
  })]).labs.length, 0);
});

test("eGFR equation comes from the method, with race-coefficient variant excluded", () => {
  const e = (accession: string, name: string, local_code: string, collected: string) => result(accession, ">60", "final", { test: { local_code, name }, collected, unit: "mL/min/1.73m2" });
  const rows = run([item("a", "2025-04-01T16:00:00Z", {
    a: e("a", "eGFR", "EGFR", "2025-04-01T12:00:00Z"),
    b: e("b", "eGFR (MDRD), non-African American", "EGFR_NONAA", "2022-04-01T12:00:00Z"),
    c: e("b", "eGFR (MDRD), African American", "EGFR_AA", "2022-04-01T12:00:00Z"),
  })]).labs;
  assert.equal(rows.length, 2); assert.equal(rows[0].egfr_equation, "mdrd"); assert.equal(rows[1].egfr_equation, "ckd-epi-2021");
  assert.equal(rows[1].comparator, ">");
});

test("vitals copy deduplication, repeat BP, partial sets, and offset-free wall time", () => {
  const v = { type: "vitals", taken: "2025-04-01T09:00", bp: { systolic_mmhg: 140, diastolic_mmhg: 90 }, weight_kg: 82.46 };
  const a = item("a", "2025-04-01T16:00:00Z", { enc: enc(), first: v,
    repeat: { ...v, taken: "2025-04-01T09:15", bp: { systolic_mmhg: 130, diastolic_mmhg: 85 } },
  });
  const b = item("b", "2025-04-02T16:00:00Z", { enc: enc(), copy: { ...v, taken: "2025-04-01T14:00:00Z" } });
  const rows = run([a, b]).vitals;
  assert.equal(rows[0].local_time, "2025-04-01T09:00"); assert.equal(rows[0].weight_kg, 82.5);
  assert.equal(run([a]).vitals[0].repeat_systolic_mmhg, 130);
  assert.equal(run([a]).vitals.length, 1);
  assert.equal(rows.filter(r => r.local_time === "2025-04-01T09:00").length, 1);
  assert.equal(rows.length, 1); assert.equal(rows[0].repeat_systolic_mmhg, 130);
});

test("an unspecified T-code does not override an explicitly recorded reaction", () => {
  const rows = run([item("a", "2025-04-01T16:00:00Z", { enc: enc(),
    p: dx("Adverse effect of lisinopril", "active", { icd10cm: "T46.4X5A" }),
    a: { type: "allergy", substance: "lisinopril", reaction: "cough", severity: "mild" },
  })]).allergies;
  assert.equal(rows.length, 1); assert.equal(rows[0].reaction_type, "side_effect"); assert.equal(rows[0].criticality, "low");
  assert.equal(rows[0].evidence.length, 2);
});

test("combination ingredient normalization and a later uncoded changed line", () => {
  const rows = run([item("a", "2025-04-01T16:00:00Z", { enc: enc(),
    old: med("losartan 25 mg tablet", "stopped", { rxnorm_ingredient: "52175", dose_text: "25 mg" }),
    changed: med("losartan 50 mg tablet", "changed", { dose_text: "50 mg" }),
    combo: med("sitagliptin/metformin 50/1000 mg tablet", "continue", { dose_text: "50/1000 mg" }),
  })]).medications;
  assert.equal(rows.find(r => r.ingredient === "losartan")?.status, "active");
  assert.equal(rows.find(r => r.ingredient === "losartan")?.dose?.value, 50);
  assert.equal(rows.find(r => r.ingredient === "sitagliptin")?.dose?.value, 50);
  assert.equal(rows.find(r => r.ingredient === "metformin")?.dose?.value, 1000);
});

test("sensitive structured conditions are retained and categorized", () => {
  const rows = run([item("a", "2025-04-01T16:00:00Z", { p: dx("Major depressive disorder", "active", { icd10cm: "F33.1" }), q: { type: "history", condition: "HIV", source: "patient", onset_text: "~10 years" } })]).problems;
  assert.equal(rows.length, 2); assert.deepEqual(rows.find(p => p.icd10cm === "F33.1")?.sensitivity, ["mental-health"]);
  assert.equal(rows.find(p => p.condition === "HIV")?.onset, undefined);
});

test("unexpected JSON shapes are skipped without exceptions or nonfinite output", () => {
  const bad: unknown[] = [null, [], 1, "", true, {}, { payload: null }, { id: "x", issuer: "rrh", recorded: "bad" }];
  const garbage = [undefined, null, true, 42, [], {}, "bad", "__proto__", "constructor", Infinity];
  for (const value of garbage) {
    const i = item("valid", "2025-04-01T16:00:00Z", {
      enc: enc(), a: value,
      b: { type: "panel", status: "final", accession: "a", components: [value] },
      c: { type: "result", accession: "a", collected: value, test: { local_code: "x", name: value, loinc: value }, value, unit: value, status: "final" },
      d: { type: "home_med", drug_name: "metformin", status: value, dose_text: value, sig: value },
      e: { type: "vitals", taken: "2025-04-01T14:00:00Z", bp: value, weight_kg: value },
    });
    assert.doesNotThrow(() => run([...bad, i] as FolioItem[]));
  }
  assert.doesNotThrow(() => transform(null as never, "2025-04-01"));
});

test("initial and repeat BP follow exact measurement instants within a minute", () => {
  const rows = run([item("a", "2025-04-01T16:00:00Z", { enc: enc(),
    z_first: { type: "vitals", taken: "2025-04-01T14:00:10Z", bp: { systolic_mmhg: 140, diastolic_mmhg: 90 } },
    a_repeat: { type: "vitals", taken: "2025-04-01T14:00:50Z", bp: { systolic_mmhg: 130, diastolic_mmhg: 80 } },
  })]).vitals;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].local_time, "2025-04-01T09:00");
  assert.equal(rows[0].systolic_mmhg, 140);
  assert.equal(rows[0].repeat_systolic_mmhg, 130);
});

test("initial and repeat BP follow instants through the fall daylight-saving fold", () => {
  const rows = run([item("a", "2025-11-02T12:00:00Z", { enc: enc("fold", "ed_note", "2025-11-02T06:30:00Z"),
    first: { type: "vitals", taken: "2025-11-02T06:50:00Z", bp: { systolic_mmhg: 150, diastolic_mmhg: 95 } },
    repeat: { type: "vitals", taken: "2025-11-02T07:10:00Z", bp: { systolic_mmhg: 130, diastolic_mmhg: 80 } },
  })]).vitals;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].local_time, "2025-11-02T01:50");
  assert.equal(rows[0].systolic_mmhg, 150);
  assert.equal(rows[0].repeat_systolic_mmhg, 130);
});

test("an ED visit crossing midnight keeps its repeat BP with its initial BP", () => {
  const rows = run([item("a", "2025-04-02T09:00:00Z", { enc: enc("midnight", "ed_note", "2025-04-02T04:30:00Z"),
    first: { type: "vitals", taken: "2025-04-02T04:50:00Z", bp: { systolic_mmhg: 150, diastolic_mmhg: 95 } },
    repeat: { type: "vitals", taken: "2025-04-02T05:10:00Z", bp: { systolic_mmhg: 130, diastolic_mmhg: 80 } },
  })]).vitals;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].local_time, "2025-04-01T23:50");
  assert.equal(rows[0].systolic_mmhg, 150);
  assert.equal(rows[0].repeat_systolic_mmhg, 130);
});

console.log(`${checks} tests passed`);
