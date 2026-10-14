import { strict as assert } from "node:assert";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

let checks = 0;
function test(name: string, run: () => void) {
  run(); checks++; console.log(`ok ${checks}: ${name}`);
}
function item(id: string, recorded: string, payload: Record<string, unknown>, extras: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "issuer", patient: "patient", effective: recorded, recorded, narrative: "",
    payload: { enc: { type: "encounter", encounter_id: "stay", document_kind: "hp", class: "inpatient", service: "Medicine" }, ...payload }, ...extras };
}
const med = (status = "continue", extras: Record<string, unknown> = {}) => ({ type: "home_med", drug_name: "metformin 500 mg tablet",
  rxnorm_ingredient: "6809", dose_text: "500 mg", sig: "1 tab PO BID", status, ...extras });
const dx = (label: string, status = "active", extras: Record<string, unknown> = {}) => ({ type: "diagnosis", label, status, ...extras });
const lab = (value = "1.2", status = "final", extras: Record<string, unknown> = {}) => ({ type: "result", accession: "specimen-1",
  test: { local_code: "CREAT", loinc: "2160-0", name: "Creatinine" }, value, unit: "mg/dL", status,
  specimen: "serum", collected: "2025-01-01T18:00:00Z", ...extras });
const a = item("a", "2025-01-01T19:00:00Z", { med: med("held"), dx: dx("Acute kidney injury", "active", { icd10cm: "N17.9" }), lab: lab() });
const map = (items: FolioItem[], day = "2025-12-31") => transform(items, day);

test("recorded cutoff is Chicago day, including summer midnight", () => {
  assert.equal(map([item("a", "2025-07-02T04:59:59Z", { med: med() })], "2025-07-01").medications.length, 1);
  assert.equal(map([item("a", "2025-07-02T05:00:00Z", { med: med() })], "2025-07-01").medications.length, 0);
});
test("winter and DST transition cutoffs", () => {
  assert.equal(map([item("a", "2025-01-02T05:59:59Z", { med: med() })], "2025-01-01").medications.length, 1);
  assert.equal(map([item("a", "2025-01-02T06:00:00Z", { med: med() })], "2025-01-01").medications.length, 0);
  assert.equal(map([item("a", "2025-03-10T04:59:59Z", { med: med() })], "2025-03-09").medications.length, 1);
  assert.equal(map([item("a", "2025-11-03T05:59:59Z", { med: med() })], "2025-11-02").medications.length, 1);
});
test("future corrections do not leak into earlier snapshots", () => {
  const b = item("b", "2025-01-02T19:00:00Z", { med: med("stopped") }, { supersedes: ["a"] });
  assert.equal(map([b, a], "2025-01-01").medications[0].status, "held");
  assert.equal(map([b, a]).medications[0].status, "stopped");
  assert.equal(map([b, a]).labs.length, 0);
});
test("replacement is transitive and retraction never resurrects a predecessor", () => {
  const b = item("b", "2025-01-02T19:00:00Z", { med: med("continue") }, { supersedes: ["a"] });
  const c = item("c", "2025-01-03T19:00:00Z", {}, { retracts: ["b"], payload: {} });
  assert.deepEqual(map([c, a, b]), { medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});
test("lineage ids are scoped to issuer", () => {
  const b = item("b", "2025-01-02T19:00:00Z", {}, { issuer: "another", retracts: ["a"], payload: {} });
  assert.equal(map([a, b]).labs.length, 1);
});
test("latest full medication snapshot removes missing lines", () => {
  assert.equal(map([a, item("b", "2025-01-02T19:00:00Z", {})]).medications.length, 0);
});
test("discharge is final authority for its encounter, including late consults", () => {
  const discharge = item("b", "2025-01-02T20:00:00Z", { med: med("continue"), enc: {
    type: "encounter", encounter_id: "stay", document_kind: "discharge_summary", discharged: "2025-01-02T18:00:00Z",
  } }, { effective: "2025-01-01T12:00:00Z" });
  const consult = item("c", "2025-01-03T19:00:00Z", { med: med("held"), enc: {
    type: "encounter", encounter_id: "stay", document_kind: "consult",
  } });
  const row = map([a, consult, discharge]).medications[0];
  assert.equal(row.status, "active"); assert.equal(row.status_since, "2025-01-02");
});
test("a newer encounter supersedes an old encounter's discharge list", () => {
  const old = item("b", "2025-01-02T20:00:00Z", { med: med("continue"), enc: {
    type: "encounter", encounter_id: "old", document_kind: "discharge_summary", discharged: "2025-01-02T18:00:00Z",
  } });
  const now = item("c", "2025-02-03T19:00:00Z", { med: med("not_reconciled") });
  assert.equal(map([old, now]).medications[0].status, "unknown");
});
test("advise-against does not convert a hold to a stop", () => {
  const row = map([item("a", "2025-01-01T19:00:00Z", { m: med("held", {
    restart_advice: "advise_against", instructions: "Recommend against restarting at discharge",
  }) })]).medications[0];
  assert.equal(row.status, "held"); assert.equal(row.stop_reason, undefined);
});
test("medication history matches ingredient and dose, not payload id", () => {
  const b = item("b", "2025-01-02T19:00:00Z", { renamed: med("held") });
  assert.equal(map([b, a]).medications[0].status_since, "2025-01-01");
});
test("hospital-only orders are excluded and continue does not invent a start date", () => {
  const rows = map([item("a", "2025-01-01T19:00:00Z", { m: med(), iv: {
    type: "inpatient_med", drug_name: "insulin glargine", dose_text: "18 units", started: "2025-01-01T18:00:00Z",
  } })]).medications;
  assert.equal(rows.length, 1); assert.equal(rows[0].status_since, undefined);
});
test("tablet mass, brands, frequencies and explicit stop reasons", () => {
  const row = map([item("a", "2025-01-01T19:00:00Z", { m: med("stopped", {
    drug_name: "Jardiance 10 mg tablet", rxnorm_ingredient: "1545653", dose_text: "2 tablets", sig: "PO once daily",
    instructions: "Stopped due to ketoacidosis",
  }) })]).medications[0];
  assert.equal(row.ingredient, "empagliflozin"); assert.deepEqual(row.dose, { value: 20, unit: "mg" });
  assert.equal(row.frequency, "QD"); assert.equal(row.stop_reason, "adverse_reaction");
});
test("ranges do not become numeric doses", () => {
  assert.equal(map([item("a", "2025-01-01T19:00:00Z", { m: med("continue", { dose_text: "1 or 2 tablets" }) })]).medications[0].dose, undefined);
});
test("combination ingredients do not inherit a combined product dose", () => {
  const rows = map([item("a", "2025-01-01T19:00:00Z", { m: med("continue", {
    drug_name: "losartan 50 mg / hydrochlorothiazide 12.5 mg tablet", rxnorm_ingredient: undefined, dose_text: "1 tablet",
  }) })]).medications;
  assert.deepEqual(rows.map(r => r.ingredient), ["hydrochlorothiazide", "losartan"]);
  assert.ok(rows.every(r => r.dose === undefined && r.rxnorm_ingredient === undefined));
});
test("working and ruled-out diagnoses do not become problems or allergies", () => {
  const b = item("b", "2025-01-02T19:00:00Z", { dx: dx("Acute kidney injury", "ruled_out", { icd10cm: "N17.9" }),
    suspected: dx("Metformin-associated lactic acidosis", "working") });
  assert.equal(map([a, b]).problems.length, 0); assert.equal(map([a, b]).allergies.length, 0);
});
test("a silent drop does not establish a working diagnosis", () => {
  const b = item("b", "2025-01-01T19:00:00Z", { dx: dx("Pancreatitis", "working") });
  assert.equal(map([b, item("c", "2025-01-02T19:00:00Z", {})]).problems.length, 0);
});
test("a suspected recurrence does not erase a confirmed earlier condition", () => {
  const b = item("b", "2025-02-01T19:00:00Z", { dx: dx("Acute kidney injury", "working", { icd10cm: "N17.9" }),
    enc: { type: "encounter", encounter_id: "later", document_kind: "hp" } });
  assert.equal(map([a, b]).problems.length, 1);
});
test("CKD restaging deduplicates and copied history does not overwrite a diagnosis", () => {
  const h = { type: "history", condition: "CKD stage 3a", icd10cm: "N18.31", source: "riverside", onset_text: "2016" };
  const old = item("old", "2025-01-01T19:00:00Z", { h });
  const now = item("now", "2025-01-02T19:00:00Z", { h, d: dx("Chronic kidney disease stage 3b A2", "active", { icd10cm: "N18.32" }) });
  const later = item("later", "2025-01-03T19:00:00Z", { h });
  const rows = map([now, old, later]).problems;
  assert.equal(rows.length, 1); assert.equal(rows[0].ckd_stage, "G3b"); assert.equal(rows[0].albuminuria, "A2");
  assert.deepEqual(rows[0].onset, { value: "2016", precision: "year" });
});
test("local diagnosis codes keep distinct conditions sharing one ICD code", () => {
  const rows = map([item("a", "2025-01-01T19:00:00Z", {
    one: dx("Euglycemic DKA", "resolved", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-1", name: "Euglycemic DKA" } }),
    two: dx("Other DKA", "active", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-2", name: "Other DKA" } }),
  })]).problems;
  assert.equal(rows.length, 2);
});
test("an older generic condition does not acquire a new encounter's specific local identity", () => {
  const old = item("old", "2024-01-01T19:00:00Z", { d: dx("Diabetic ketoacidosis", "resolved", { icd10cm: "E11.10" }),
    enc: { type: "encounter", encounter_id: "prior", document_kind: "hp" } });
  const now = item("now", "2025-01-01T19:00:00Z", { d: dx("SGLT2 inhibitor-associated euglycemic DKA", "active", {
    icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-4471", name: "SGLT2 inhibitor-associated euglycemic DKA" },
  }) });
  assert.equal(map([now, old]).problems.length, 2);
});
test("the same named condition may be re-coded without becoming two rows", () => {
  const old = item("old", "2025-01-01T19:00:00Z", { d: dx("Hyperlipidemia", "active", { icd10cm: "E78.5" }) });
  const now = item("now", "2025-01-02T19:00:00Z", { d: dx("Hyperlipidemia", "active", { icd10cm: "E78.2" }) });
  const rows = map([old, now]).problems;
  assert.equal(rows.length, 1); assert.equal(rows[0].icd10cm, "E78.2");
});
test("class-only causal diagnosis resolves a unique same-item drug", () => {
  const rows = map([item("a", "2025-01-01T19:00:00Z", { d: dx("SGLT2 inhibitor-associated ketoacidosis"),
    m: med("held", { drug_name: "Jardiance 10 mg tablet", rxnorm_ingredient: "1545653" }) })]);
  assert.equal(rows.problems.length, 1); assert.equal(rows.allergies[0].substance, "empagliflozin");
  assert.equal(rows.allergies[0].reaction_type, "serious_adverse_event"); assert.equal(rows.allergies[0].mechanism, "non_immune");
});
test("ambiguous class attribution remains a class", () => {
  const p = { d: dx("SGLT2 inhibitor-associated ketoacidosis"), one: med("held", { drug_name: "empagliflozin", rxnorm_ingredient: "1545653" }),
    two: med("held", { drug_name: "dapagliflozin", rxnorm_ingredient: undefined }) };
  const row = map([item("a", "2025-01-01T19:00:00Z", p)]).allergies[0];
  assert.equal(row.substance, "SGLT2 inhibitor"); assert.equal(row.rxnorm_ingredient, undefined);
});
test("explicit drug wins over class inference even when that drug is absent from the medication list", () => {
  const row = map([item("a", "2025-01-01T19:00:00Z", { d: dx("SGLT2 inhibitor-associated ketoacidosis due to empagliflozin"),
    m: med("held", { drug_name: "dapagliflozin", rxnorm_ingredient: undefined }) })]).allergies[0];
  assert.equal(row.substance, "empagliflozin"); assert.equal(row.rxnorm_ingredient, undefined);
});
test("adverse-effect-only T codes do not create problem rows", () => {
  const rows = map([item("a", "2025-01-01T19:00:00Z", { d: dx("Adverse effect of empagliflozin", "resolved", { icd10cm: "T38.3X5A" }) })]);
  assert.equal(rows.problems.length, 0); assert.equal(rows.allergies.length, 1);
});
test("non-drug causation does not create an allergy", () => {
  assert.equal(map([item("a", "2025-01-01T19:00:00Z", { d: dx("Hyperkalemia due to renal failure") })]).allergies.length, 0);
  assert.equal(map([item("a", "2025-01-01T19:00:00Z", { d: dx("Acute kidney injury due to dehydration (metformin held)"), m: med("held") })]).allergies.length, 0);
});
test("reaction phenotype and mechanism are distinct", () => {
  const rows = map([item("a", "2025-01-01T19:00:00Z", { allergy: { type: "allergy", substance: "lisinopril", reaction: "angioedema", severity: "severe" } })]).allergies;
  assert.equal(rows[0].reaction_type, "hypersensitivity"); assert.equal(rows[0].mechanism, "non_immune");
  assert.equal(rows[0].criticality, "high");
});
test("NKDA is not an allergy row", () => {
  assert.equal(map([item("a", "2025-01-01T19:00:00Z", { allergy: { type: "allergy", substance: "NKDA" } })]).allergies.length, 0);
});
test("lab correction rank beats signing recency and entry ids", () => {
  const b = item("b", "2025-01-02T19:00:00Z", { another: lab("1.4", "corrected") });
  const c = item("c", "2025-01-03T19:00:00Z", { third: lab("1.3", "final") });
  const rows = map([c, a, b]).labs; assert.equal(rows.length, 1); assert.equal(rows[0].value, 1.4);
  assert.equal(rows[0].evidence[0].item_id, "b"); assert.equal(rows[0].status, "final");
});
test("corrected textual cancellation hides older numeric value", () => {
  assert.equal(map([a, item("b", "2025-01-02T19:00:00Z", { lab: lab("Hemolyzed, see comment", "corrected") })]).labs.length, 0);
});
test("panels flatten and deduplicate against standalone results; repeats remain distinct", () => {
  const b = item("b", "2025-01-02T19:00:00Z", { panel: { ...lab(), type: "panel", components: [{ test: lab().test, value: "1.2", unit: "mg/dL" }] },
    repeat: lab("1.1", "final", { accession: "repeat" }) });
  assert.equal(map([a, b]).labs.length, 2);
});
test("comparators and unit conversions survive", () => {
  const rows = map([item("a", "2025-01-01T19:00:00Z", {
    creat: lab("<88.4", "final", { unit: "umol/L" }),
    platelets: lab("212000", "final", { accession: "platelets", test: { local_code: "PLT", name: "Platelets" }, unit: "cells/uL" }),
    ph: lab("7.2", "final", { accession: "ph", test: { local_code: "VPH", name: "pH, venous" }, unit: undefined, specimen: "venous blood" }),
  })]).labs;
  assert.equal(rows.find(r => r.analyte === "creatinine")?.value, 1); assert.equal(rows.find(r => r.analyte === "creatinine")?.comparator, "<");
  assert.equal(rows.find(r => r.analyte === "platelets")?.value, 212); assert.equal(rows.find(r => r.analyte === "ph")?.unit, "[pH]");
});
test("post-2023 eGFR method follows the schema and never becomes CKD staging", () => {
  const rows = map([item("a", "2025-01-01T19:00:00Z", { lab: lab(">60", "final", {
    test: { local_code: "EGFR", name: "eGFR" }, unit: "mL/min/1.73m2",
  }) })]);
  assert.equal(rows.labs[0].egfr_equation, "ckd-epi-2021"); assert.equal(rows.problems.length, 0);
});
test("urine creatinine, troponin T and blood gas bicarbonate are not tracked analytes", () => {
  const rows = map([item("a", "2025-01-01T19:00:00Z", {
    urine: lab("25", "final", { specimen: "urine" }),
    trop: lab("1", "final", { accession: "t", test: { local_code: "TROPT", name: "Troponin T" } }),
    hco3: lab("11", "final", { accession: "b", test: { local_code: "HCO3", name: "Bicarbonate, calculated blood gas" }, unit: "mmol/L" }),
  })]).labs;
  assert.equal(rows.length, 0);
});
test("vitals use Chicago wall time, round weight and deduplicate copies", () => {
  const vs = { type: "vitals", taken: "2025-01-02T02:00:00Z", bp: { systolic_mmhg: 130, diastolic_mmhg: 80 }, weight_kg: 81.26 };
  const rows = map([item("a", "2025-01-02T03:00:00Z", { vs }), item("b", "2025-01-02T04:00:00Z", { copied: vs })]).vitals;
  assert.equal(rows.length, 1); assert.equal(rows[0].local_time, "2025-01-01T20:00"); assert.equal(rows[0].weight_kg, 81.3);
});
test("zone-less measurements retain their written local wall clock", () => {
  const rows = map([item("a", "2025-01-02T19:00:00Z", {
    vs: { type: "vitals", taken: "2025-01-02T08:30:00", heart_rate_bpm: 70 },
    lab: lab("1.2", "final", { collected: "2025-01-02T08:30:00" }),
  })]);
  assert.equal(rows.vitals[0].local_time, "2025-01-02T08:30"); assert.equal(rows.labs[0].collected, "2025-01-02T14:30:00.000Z");
});
test("repeat BP at the same assessment stays on the first vital set", () => {
  const rows = map([item("a", "2025-01-02T19:00:00Z", {
    first: { type: "vitals", taken: "2025-01-02T08:30:00", bp: { systolic_mmhg: 150, diastolic_mmhg: 90 }, heart_rate_bpm: 70 },
    repeat: { type: "vitals", taken: "2025-01-02T08:50:00", bp: { systolic_mmhg: 130, diastolic_mmhg: 80 } },
  })]).vitals;
  assert.equal(rows.length, 1); assert.equal(rows[0].repeat_systolic_mmhg, 130);
});
test("sensitive conditions are emitted and tagged", () => {
  const rows = map([item("a", "2025-01-01T19:00:00Z", { d: dx("HIV disease") })]).problems;
  assert.deepEqual(rows[0].sensitivity, ["hiv-sti"]);
});
test("unexpected JSON shapes are skipped without throwing", () => {
  for (const input of [null, {}, [null, 42, "hello"], [{...a, payload: null}], [{...a, recorded: "not a date"}],
    [{...a, payload: { bad: [], null: null, panel: { type: "panel", components: [null, 5, {}] } }}]]) {
    assert.doesNotThrow(() => transform(input as any, "2025-12-31"));
  }
  assert.deepEqual(transform([a], "2025-02-30"), { medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});
test("sample output is independent of item and payload-key order, and does not mutate input", () => {
  const groups = JSON.parse(require("node:fs").readFileSync("in/samples/samples.json", "utf8"));
  const items = groups[0].items as FolioItem[];
  const original = JSON.stringify(items), expected = transform(items, "2026-10-13");
  const reversed = [...items].reverse().map(i => ({...i, payload: Object.fromEntries(Object.entries(i.payload).reverse())}));
  assert.deepEqual(transform(reversed, "2026-10-13"), expected); assert.equal(JSON.stringify(items), original);
  assert.equal(expected.medications.length, 4); assert.equal(expected.problems.length, 3);
  assert.equal(expected.allergies.length, 2); assert.equal(expected.labs.length, 49); assert.equal(expected.vitals.length, 7);
});
console.log(`Passed ${checks} regression checks.`);
