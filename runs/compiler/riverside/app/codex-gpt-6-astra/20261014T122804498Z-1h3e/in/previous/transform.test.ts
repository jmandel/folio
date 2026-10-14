import { test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

function doc(id: string, recorded: string, payload: Record<string, unknown> = {}, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "did:web:test.example", patient: "p", effective: recorded, recorded,
    narrative: "", payload: { enc: { type: "encounter", encounter_id: "stay", document_kind: "hp", class: "inpatient", service: "Medicine" }, ...payload }, ...extra };
}
const med = (status = "continue", overrides: Record<string, unknown> = {}) => ({ type: "home_med", drug_name: "metformin 500 mg tablet", rxnorm_ingredient: "6809", dose_text: "500 mg", sig: "1 tab PO BID", status, ...overrides });
const dx = (label: string, status = "active", overrides: Record<string, unknown> = {}) => ({ type: "diagnosis", label, status, ...overrides });
const result = (value: string, status = "final", overrides: Record<string, unknown> = {}) => ({ type: "result", accession: "acc", collected: "2025-01-01T16:00:00Z", specimen: "serum", status, test: { local_code: "CREAT", name: "Creatinine", loinc: "2160-0" }, value, unit: "mg/dL", ...overrides });
const latest = (items: FolioItem[]) => transform(items, "2026-01-01");

test("Chicago end of day uses the actual winter and summer offset", () => {
  for (const [asOf, before, after] of [
    ["2025-01-01", "2025-01-02T05:59:59.999Z", "2025-01-02T06:00:00Z"],
    ["2025-07-01", "2025-07-02T04:59:59.999Z", "2025-07-02T05:00:00Z"],
    ["2025-03-09", "2025-03-10T04:59:59Z", "2025-03-10T05:00:00Z"],
    ["2025-11-02", "2025-11-03T05:59:59Z", "2025-11-03T06:00:00Z"],
  ]) {
    const rows = transform([doc("a", before, { m: med("held") }), doc("b", after, { m: med("stopped") })], asOf);
    expect(rows.medications[0].status).toBe("held");
  }
});

test("scope corrections by recorded time and issuer; a retraction does not resurrect ancestors", () => {
  const a = doc("a", "2025-01-01T10:00:00Z", { m: med() });
  const b = doc("b", "2025-01-02T10:00:00Z", { m: med("held") }, { supersedes: ["a"] });
  const c = doc("c", "2025-01-03T10:00:00Z", {}, { payload: {}, retracts: ["b"] });
  expect(transform([c, a, b], "2025-01-01").medications[0].status).toBe("active");
  expect(transform([a, c, b], "2025-01-02").medications[0].status).toBe("held");
  expect(latest([c, a, b]).medications).toEqual([]);
  const other = doc("withdraw", "2025-01-03T10:00:00Z", {}, { issuer: "did:web:other.example", retracts: ["a"], payload: {} });
  expect(latest([a, other]).medications.length).toBe(1);
});

test("replacement restates the document, and removed entries never leak back", () => {
  const a = doc("a", "2025-01-01T10:00:00Z", { lab: result("1"), old: dx("Old diagnosis"), m: med() });
  const b = doc("b", "2025-01-02T10:00:00Z", { lab: result("2") }, { supersedes: ["a"] });
  const rows = latest([b, a]);
  expect(rows.problems).toEqual([]);
  expect(rows.medications).toEqual([]);
  expect(rows.labs.map(x => x.value)).toEqual([2]);
});

test("latest discharge list controls home drugs; held advise_against is not stopped", () => {
  const hp = doc("a", "2025-01-02T03:00:00Z", { first_key: med("held"), old: med("continue", { drug_name: "glipizide", rxnorm_ingredient: "4821" }) });
  const discharge = doc("b", "2025-01-03T17:00:00Z", {
    enc: { type: "encounter", encounter_id: "stay", document_kind: "discharge_summary", discharged: "2025-01-03T16:00:00Z" },
    renamed: med("held", { restart_advice: "advise_against", instructions: "PCP to decide about restarting" }),
    inpatient: { type: "inpatient_med", drug_name: "insulin regular", dose_text: "10 units", started: "2025-01-02T03:00:00Z" },
  }, { effective: "2025-01-02T03:00:00Z" });
  const lateProgress = doc("c", "2025-01-04T10:00:00Z", { m: med("continue") });
  const rows = latest([lateProgress, discharge, hp]);
  expect(rows.medications.length).toBe(1);
  expect(rows.medications[0]).toMatchObject({ status: "held", status_since: "2025-01-01", patient_reported: false });
  expect(rows.medications[0].stop_reason).toBeUndefined();
});

test("a new encounter snapshot supersedes the previous encounter's outpatient list", () => {
  const older = doc("a", "2025-01-01T10:00:00Z", { m: med() });
  const newer = doc("b", "2025-01-03T10:00:00Z", { enc: { type: "encounter", encounter_id: "new", document_kind: "ed_note" }, m: med("not_reconciled", { drug_name: "Jardiance", rxnorm_ingredient: "1545653", dose_text: "10 mg", sig: "daily" }) });
  expect(latest([newer, older]).medications).toMatchObject([{ ingredient: "empagliflozin", status: "unknown" }]);
});

test("discharge restart dates use discharge, not the summary's admission effective date", () => {
  const hp = doc("a", "2025-01-01T10:00:00Z", { m: med("held") });
  const discharge = doc("b", "2025-01-04T17:00:00Z", {
    enc: { type: "encounter", encounter_id: "stay", document_kind: "discharge_summary", discharged: "2025-01-04T16:00:00Z" }, m: med("continue"),
  }, { effective: hp.effective });
  expect(latest([hp, discharge]).medications[0].status_since).toBe("2025-01-04");
  expect(latest([doc("a", "2025-01-01T10:00:00Z", { m: med("continue") })]).medications[0].status_since).toBeUndefined();
});

test("dose and frequency parsing preserve uncertainty and explicitly stated units", () => {
  const d = doc("a", "2025-01-01T10:00:00Z", {
    m: med("stopped", { drug_name: "Metoprolol succinate 25 mg extended-release tablet", rxnorm_ingredient: undefined, dose_text: "1/2 tablet", sig: "1/2 tab PO daily", instructions: "Patient requested discontinuation" }),
    i: med("continue", { drug_name: "Lantus", rxnorm_ingredient: "274783", dose_text: "10 [iU]", sig: "SubQ nightly" }),
    unknown: med("continue", { drug_name: "water pill", rxnorm_ingredient: undefined, dose_text: "1-2 tablets", sig: "PO" }),
  });
  const rows = latest([d]).medications;
  expect(rows.find(x => x.ingredient === "metoprolol")).toMatchObject({ dose: { value: .5, unit: "tablet" }, frequency: "QD", stop_reason: "patient_choice" });
  expect(rows.find(x => x.ingredient === "insulin glargine")).toMatchObject({ dose: { value: 10, unit: "units" }, frequency: "QHS" });
  const unknown = rows.find(x => x.drug_name === "water pill")!;
  expect(unknown.ingredient).toBeUndefined(); expect(unknown.dose).toBeUndefined(); expect(unknown.frequency).toBeUndefined();
});

test("working and ruled-out diagnoses do not become problems; omission does not resolve an established problem", () => {
  const old = doc("a", "2025-01-01T10:00:00Z", { suspect: dx("Pancreatitis", "working"), never: dx("Possible MI", "working"), confirmed: dx("Hypertension", "active", { icd10cm: "I10" }) });
  const next = doc("b", "2025-01-02T10:00:00Z", { suspect: dx("Pancreatitis", "ruled_out") });
  expect(latest([old, next]).problems.map(x => x.condition)).toEqual(["Hypertension"]);
});

test("CKD restaging and onset precision come from entries, never from eGFR", () => {
  const old = doc("a", "2025-01-01T10:00:00Z", { h: { type: "history", condition: "CKD stage 3a A2", icd10cm: "N18.31", onset_text: "2016", source: "outside_records" } });
  const next = doc("b", "2025-01-02T10:00:00Z", { d: dx("Chronic kidney disease stage 3b", "active", { icd10cm: "N18.32" }), lab: result("9", "final", { test: { local_code: "EGFR", name: "eGFR" }, unit: "mL/min/1.73m2" }) });
  const rows = latest([next, old]);
  expect(rows.problems.length).toBe(1);
  expect(rows.problems[0]).toMatchObject({ ckd_stage: "G3b", albuminuria: "A2", onset: { value: "2016", precision: "year" }, icd10cm: "N18.32" });
});

test("Riverside local diagnoses distinguish conditions sharing ICD; generic earlier copies join an unambiguous local concept", () => {
  const a = doc("a", "2025-01-01T10:00:00Z", { dx: dx("Euglycemic DKA", "active", { icd10cm: "E11.10" }) });
  const b = doc("b", "2025-01-02T10:00:00Z", { dx: dx("Euglycemic DKA", "resolved", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-1", name: "one" } }) });
  expect(latest([a, b]).problems).toMatchObject([{ status: "resolved" }]);
  const c = doc("c", "2025-01-03T10:00:00Z", { first: dx("First DKA subtype", "active", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-1" } }), second: dx("Second DKA subtype", "active", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-2" } }) });
  expect(latest([c]).problems.length).toBe(2);
});

test("recoding the exact same condition does not produce two problems", () => {
  const a = doc("a", "2025-01-01T10:00:00Z", { d: dx("Type 2 diabetes", "active", { icd10cm: "E11.9" }) });
  const b = doc("b", "2025-01-02T10:00:00Z", { d: dx("Type 2 diabetes", "active", { icd10cm: "E11.65" }) });
  expect(latest([a, b]).problems).toMatchObject([{ icd10cm: "E11.65" }]);
});

test("an ICD-only entry with a matching name does not move to another local concept", () => {
  const old = doc("a", "2025-01-01T10:00:00Z", { one: dx("First subtype", "active", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-1" } }), two: dx("Second subtype", "active", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-2" } }) });
  const newer = doc("b", "2025-01-02T10:00:00Z", { one: dx("First subtype", "resolved", { icd10cm: "E11.10" }), two: dx("Second subtype", "active", { icd10cm: "E11.10" }) });
  const rows = latest([old, newer]).problems;
  expect(rows.length).toBe(2);
  expect(rows.find(x => x.condition === "First subtype")?.status).toBe("resolved");
  expect(rows.find(x => x.condition === "Second subtype")?.status).toBe("active");
});

test("explicit combination ingredients get separate rows without invented CUIs or doses", () => {
  const d = doc("a", "2025-01-01T10:00:00Z", { combo: med("continue", { drug_name: "Synjardy XR 12.5/1000 mg tablet", rxnorm_ingredient: undefined, dose_text: "12.5/1000 mg", sig: "once daily" }) });
  const rows = latest([d]).medications;
  expect(rows.map(x => x.ingredient)).toEqual(["empagliflozin", "metformin"]);
  for (const row of rows) { expect(row.rxnorm_ingredient).toBeUndefined(); expect(row.dose).toBeUndefined(); }
});

test("new during the stay does not invent the date the drug was first started", () => {
  const d = doc("a", "2025-01-04T17:00:00Z", { enc: { type: "encounter", encounter_id: "stay", document_kind: "discharge_summary", discharged: "2025-01-04T16:00:00Z" }, m: med("new") }, { effective: "2025-01-01T16:00:00Z" });
  expect(latest([d]).medications[0].status_since).toBeUndefined();
});

test("allergy nature and severity follow their meaning, and adverse-effect diagnoses are not problems", () => {
  const d = doc("a", "2025-01-01T10:00:00Z", {
    cough: { type: "allergy", substance: "lisinopril", rxnorm_ingredient: "29046", reaction: "cough", severity: "mild" },
    hives: { type: "allergy", substance: "penicillins", reaction: "hives", severity: "moderate" },
    adverse: dx("Adverse effect of metformin: lactic acidosis", "resolved", { icd10cm: "T38.3X5A" }),
    illness: dx("Lactic acidosis", "resolved", { icd10cm: "E87.2" }),
    nkda: { type: "allergy", substance: "NKDA" },
  });
  const rows = latest([d]);
  expect(rows.problems.map(x => x.condition)).toEqual(["Lactic acidosis"]);
  expect(rows.allergies.find(x => x.substance === "lisinopril")).toMatchObject({ type: "intolerance", criticality: "low" });
  expect(rows.allergies.find(x => x.substance === "penicillins")).toMatchObject({ type: "allergy", criticality: "unknown" });
  expect(rows.allergies.find(x => x.substance === "metformin")).toMatchObject({ type: "adverse_reaction", criticality: "high" });
  expect(rows.allergies.length).toBe(3);
});

test("two drugs sharing a coarse adverse-effect ICD remain two substances", () => {
  const d = doc("a", "2025-01-01T10:00:00Z", { a: dx("Adverse effect of empagliflozin: ketoacidosis", "active", { icd10cm: "T38.3X5A" }), b: dx("Adverse effect of metformin: lactic acidosis", "active", { icd10cm: "T38.3X5A" }) });
  expect(latest([d]).allergies.map(x => x.substance)).toEqual(["empagliflozin", "metformin"]);
});

test("copied labs use accession and local test, corrected outranks final regardless of copy date", () => {
  const a = doc("a", "2025-01-01T17:00:00Z", { lab: result("1", "preliminary") });
  const b = doc("b", "2025-01-02T17:00:00Z", { panel: { type: "panel", accession: "acc", collected: "2025-01-01T16:00:00Z", specimen: "serum", status: "corrected", components: [{ test: { local_code: "CREAT", name: "Creatinine" }, value: "2", unit: "mg/dL" }] } });
  const c = doc("c", "2025-01-03T17:00:00Z", { lab: result("1.5", "final"), confirmation: result("2.1", "final", { accession: "acc-repeat" }) });
  expect(latest([c, a, b]).labs.map(x => x.value)).toEqual([2, 2.1]);
  const invalid = doc("d", "2025-01-04T17:00:00Z", { lab: result("Hemolyzed, see comment", "corrected") });
  expect(latest([a, b, c, invalid]).labs.map(x => x.value)).toEqual([2.1]);
});

test("lab comparators, units, unsupported tests, and race-specific eGFR", () => {
  const d = doc("a", "2025-01-02T17:00:00Z", {
    ph: result("7.2", "final", { test: { local_code: "VPH", name: "pH, venous" }, unit: undefined, specimen: "venous blood" }),
    troponin: result("<10", "final", { test: { local_code: "TNI", name: "Troponin I" }, unit: "ng/L" }),
    cells: result("212,000", "final", { test: { local_code: "PLT", name: "Platelets" }, unit: "cells/uL", specimen: "whole blood" }),
    egfr: result(">=60", "final", { test: { local_code: "EGFR_NONAA", name: "eGFR non-African American" }, unit: "mL/min/1.73m2" }),
    egfrAA: result("70", "final", { test: { local_code: "EGFR_AA", name: "eGFR African American" }, unit: "mL/min/1.73m2" }),
    unrelated: result("40", "final", { test: { local_code: "HCT", name: "Hematocrit", loinc: "4544-3" }, unit: "%" }),
    urine: result("10", "final", { specimen: "urine" }),
    invalid: result("5 approximately", "final", { test: { local_code: "K", name: "Potassium" }, unit: "mmol/L" }),
    wrongUnit: result("10", "final", { test: { local_code: "GLU", name: "Glucose" }, unit: "bananas" }),
  });
  const rows = latest([d]).labs;
  expect(rows.length).toBe(4);
  expect(rows.find(x => x.analyte === "troponin")).toMatchObject({ value: .01, comparator: "<", unit: "ng/mL" });
  expect(rows.find(x => x.analyte === "platelets")).toMatchObject({ value: 212, unit: "10*3/uL" });
  expect(rows.find(x => x.analyte === "egfr")).toMatchObject({ value: 60, comparator: ">=", egfr_equation: "ckd-epi-2021" });
});

test("vitals retain separate hospital sets, deduplicate copies, and combine nearby repeats", () => {
  const v = { type: "vitals", taken: "2025-01-02T03:00:00Z", bp: { systolic_mmhg: 140, diastolic_mmhg: 90 }, weight_kg: 70.14 };
  const a = doc("a", "2025-01-02T10:00:00Z", { v, repeat: { ...v, taken: "2025-01-02T03:03:00Z", bp: { systolic_mmhg: 130, diastolic_mmhg: 80 } } });
  const b = doc("b", "2025-01-03T10:00:00Z", { copy: v, next: { ...v, taken: "2025-01-03T03:00:00Z", heart_rate_bpm: 80 } });
  const rows = latest([b, a]).vitals;
  expect(rows.length).toBe(2);
  expect(rows[0]).toMatchObject({ local_time: "2025-01-01T21:00", weight_kg: 70.1, systolic_mmhg: 140, repeat_systolic_mmhg: 130 });
});

test("malformed input is skipped; narrative alone cannot manufacture rows", () => {
  for (const input of [null, undefined, {}, "bad", [null, 2, {}, [], doc("a", "bad")]]) {
    expect(() => transform(input as FolioItem[], "2025-01-01")).not.toThrow();
  }
  const d = doc("a", "2025-01-01T10:00:00Z", { null: null, malformed: { type: "panel", components: [null, 1, {}, { test: [] }], accession: "x", status: "final" }, vital: { type: "vitals", taken: "bad", bp: null } }, { narrative: "Has diabetes. Taking insulin. Creatinine 3.0. BP 200/120." });
  expect(latest([d])).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  expect(transform([d], "2025-02-30")).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});

test("all sample outputs are invariant to item and payload-key order, without input mutation", async () => {
  const groups = await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).json();
  for (const g of groups) {
    const original = JSON.stringify(g.items);
    for (const date of ["2025-05-22", "2025-05-24", "2025-06-24", "2025-06-26", "2026-01-01"]) {
      const expected = transform(g.items, date);
      const reversed = g.items.slice().reverse().map((i: FolioItem) => ({ ...i, payload: Object.fromEntries(Object.entries(i.payload).reverse()) }));
      expect(transform(reversed, date)).toEqual(expected);
    }
    expect(JSON.stringify(g.items)).toBe(original);
  }
});
