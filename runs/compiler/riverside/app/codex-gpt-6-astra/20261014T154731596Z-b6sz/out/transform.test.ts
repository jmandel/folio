import { describe, test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const enc = (kind = "hp", stay = "stay") => ({ type: "encounter", encounter_id: stay, document_kind: kind, class: "inpatient", service: "Hospital Medicine" });
function item(id: string, recorded: string, payload: Record<string, unknown> = {}, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "riverside", patient: "test", recorded, effective: recorded, narrative: "", payload: { enc: enc(), ...payload }, ...extra };
}
const med = (name = "metformin", status = "continue", extra = {}) => ({ type: "home_med", drug_name: name + " 500 mg tablet", dose_text: "500 mg", sig: "1 tab BID", status, ...extra });
const dx = (label: string, status = "active", extra = {}) => ({ type: "diagnosis", label, status, ...extra });
const lab = (value = "1.2", status = "final", extra = {}) => ({ type: "result", accession: "specimen", test: { local_code: "CREAT", name: "Creatinine", loinc: "2160-0" }, value, status, unit: "mg/dL", collected: "2025-01-01T03:00:00Z", specimen: "serum", ...extra });
const at = (items: FolioItem[], asOf = "2026-01-01") => transform(items, asOf);

describe("publication, replacement and time", () => {
  test("standard and daylight local end-of-day cutoffs", () => {
    for (const [day, before, after] of [["2025-01-01", "2025-01-02T05:59:59.999Z", "2025-01-02T06:00:00Z"], ["2025-07-01", "2025-07-02T04:59:59.999Z", "2025-07-02T05:00:00Z"]]) {
      const a = item("a", before, { m: med("metformin", "held") });
      const b = item("b", after, { m: med("metformin", "stopped") });
      expect(at([a, b], day).medications[0].status).toBe("held");
    }
  });
  test("future replacements have no effect; supersession is transitive", () => {
    const a = item("a", "2025-01-01T12:00:00Z", { p: dx("A") });
    const b = item("b", "2025-01-02T12:00:00Z", { p: dx("B") }, { supersedes: ["a"] });
    const c = item("c", "2025-01-03T12:00:00Z", { p: dx("C") }, { supersedes: ["b"] });
    expect(at([c, a, b], "2025-01-01").problems.map(p => p.condition)).toEqual(["A"]);
    expect(at([c, a, b]).problems.map(p => p.condition)).toEqual(["C"]);
  });
  test("retraction and retraction of an erroneous correction", () => {
    const a = item("a", "2025-01-01T12:00:00Z", { p: dx("A") });
    const b = item("b", "2025-01-02T12:00:00Z", { p: dx("B") }, { supersedes: ["a"] });
    const r = item("r", "2025-01-03T12:00:00Z", {}, { payload: {}, retracts: ["b"] });
    expect(at([r, a, b]).problems.map(p => p.condition)).toEqual(["A"]);
    expect(at([a, item("r", r.recorded, {}, { payload: {}, retracts: ["a"] })]).problems).toEqual([]);
  });
  test("zone-less timestamps preserve wall time and receive seasonal offsets", () => {
    for (const [date, offset] of [["2025-01-01", "-06:00"], ["2025-07-01", "-05:00"]]) {
      const result = at([item("a", date + "T23:59:59", {
        l: lab("2", "final", { collected: date + "T08:20" }),
        v: { type: "vitals", taken: date + "T08:20", heart_rate_bpm: 70 },
      })], date);
      expect(result.labs[0].collected).toBe(date + "T08:20:00" + offset);
      expect(result.vitals[0].local_time).toBe(date + "T08:20");
    }
  });
  test("effective date does not control visibility", () => {
    expect(at([item("a", "2025-01-03T12:00:00Z", { p: dx("A") }, { effective: "2024-01-01" })], "2025-01-02").problems).toEqual([]);
  });
});

describe("medication snapshots", () => {
  test("discharge wins over a later inpatient note, and omitted drugs disappear", () => {
    const a = item("a", "2025-01-01T12:00:00Z", { a: med(), b: med("losartan") });
    const discharge = item("b", "2025-01-02T12:00:00Z", { enc: enc("discharge_summary"), a: med("metformin", "held", { restart_advice: "advise_against" }) });
    const late = item("c", "2025-01-03T12:00:00Z", { a: med(), b: med("losartan") });
    const result = at([late, discharge, a]).medications;
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("held");
  });
  test("unknown reconciliation, hospital-only exclusion and an empty snapshot", () => {
    const a = item("a", "2025-01-01T12:00:00Z", { m: med("metformin", "not_reconciled"), iv: { ...med(), type: "inpatient_med" } });
    expect(at([a]).medications).toHaveLength(1);
    expect(at([a]).medications[0].status).toBe("unknown");
    expect(at([a, item("b", "2025-01-02T12:00:00Z", {})]).medications).toEqual([]);
  });
  test("restart at discharge uses discharge date rather than admission", () => {
    const a = item("a", "2025-01-01T12:00:00Z", { old_key: med("metformin", "held") });
    const b = item("b", "2025-01-05T12:00:00Z", { enc: { ...enc("discharge_summary"), discharged: "2025-01-04T22:00:00Z" }, new_key: med() }, { effective: "2025-01-01T12:00:00Z" });
    expect(at([a, b]).medications[0].status_since).toBe("2025-01-04");
  });
  test("ingredient normalization, authoritative amount and strength times count", () => {
    const result = at([item("a", "2025-01-01T12:00:00Z", {
      a: med("famotidine", "continue", { drug_name: "famotidine 10 mg tablet", dose_text: "2 tablets", sig: "2 tabs every 12 hours" }),
      b: med("metformin", "continue", { drug_name: "metformin hydrochloride 500 mg tablet", dose_text: "1000 milligrams", sig: "2 tablets BID" }),
      c: med("albuterol", "continue", { drug_name: "Ventolin HFA 90 mcg/actuation inhaler", dose_text: "2 puffs", sig: "2 puffs every 6 hours as needed" }),
      d: med("prednisone", "continue", { drug_name: "prednisone tablet", dose_text: "1 tablet", sig: "daily" }),
      e: med("loratadine", "continue", { dose_text: "1-2 tablets", sig: "daily" }),
    })]).medications;
    expect(result.find(m => m.ingredient === "famotidine")?.dose).toEqual({ value: 20, unit: "mg" });
    expect(result.find(m => m.ingredient === "metformin")?.dose).toEqual({ value: 1000, unit: "mg" });
    expect(result.find(m => m.ingredient === "albuterol")?.dose).toEqual({ value: 180, unit: "mcg" });
    expect(result.find(m => m.ingredient === "albuterol")?.frequency).toBe("PRN");
    expect(result.find(m => m.ingredient === "prednisone")?.dose).toEqual({ value: 1, unit: "tablet" });
    expect(result.find(m => m.ingredient === "loratadine")?.dose).toBeUndefined();
  });
  test("fractional tablets are not read as their denominator; optional codes do not duplicate drugs", () => {
    const result = at([item("a", "2025-01-01T12:00:00Z", {
      a: med("prednisone", "continue", { dose_text: "1/2 tablet", sig: "half a tablet daily" }),
      b: med("metformin", "continue", { rxnorm_ingredient: "6809" }),
      c: med("metformin", "held"),
      d: med("famotidine", "continue", { drug_name: "famotidine 10 mg tablet", dose_text: "two tablets", sig: "two tablets daily" }),
    })]).medications;
    expect(result).toHaveLength(3);
    expect(result.find(m => m.ingredient === "prednisone")?.dose).toEqual({ value: 250, unit: "mg" });
    expect(result.find(m => m.ingredient === "famotidine")?.dose).toEqual({ value: 20, unit: "mg" });
  });
});

describe("conditions and reactions", () => {
  test("unconfirmed and excluded diagnoses are not problems", () => {
    const a = item("a", "2025-01-01T12:00:00Z", { a: dx("Pancreatitis", "working"), b: dx("Hyperkalemia", "active"), c: dx("Other suspicion", "working") });
    const b = item("b", "2025-01-02T12:00:00Z", { a: dx("Acute pancreatitis", "ruled_out"), b: dx("Hyperkalemia", "resolved") });
    expect(at([a, b]).problems.map(p => [p.condition, p.status])).toEqual([["Hyperkalemia", "resolved"]]);
  });
  test("CKD restaging outranks later copied history and keeps onset precision", () => {
    const a = item("a", "2025-01-01T12:00:00Z", { p: dx("CKD stage 3a", "active", { icd10cm: "N18.31" }) });
    const b = item("b", "2025-01-02T12:00:00Z", { p: dx("CKD G3b A2", "active", { icd10cm: "N18.32" }) });
    const c = item("c", "2025-01-03T12:00:00Z", { h: { type: "history", condition: "CKD stage 3a", source: "outside_records", onset_text: "June 2016" } });
    const result = at([c, a, b]).problems;
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ condition: "CKD G3b A2", ckd_stage: "G3b", albuminuria: "A2", icd10cm: "N18.32", onset: { value: "2016-06", precision: "month" } });
  });
  test("unspecified stage 3 does not invent a 3a/3b substage", () => {
    const result = at([
      item("a", "2025-01-01T12:00:00Z", { p: dx("CKD stage 3a", "active", { icd10cm: "N18.31" }) }),
      item("b", "2025-01-02T12:00:00Z", { p: dx("CKD stage 3", "active", { icd10cm: "N18.30" }) }),
    ]).problems;
    expect(result[0].ckd_stage).toBeUndefined();
  });
  test("different local diagnoses sharing ICD are not collapsed", () => {
    const result = at([item("a", "2025-01-01T12:00:00Z", {
      a: dx("Euglycemic DKA, SGLT2 inhibitor-associated", "resolved", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-1", name: "SGLT2-associated DKA" } }),
      b: dx("Diabetic ketoacidosis", "resolved", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-2", name: "Other DKA" } }),
    })]);
    expect(result.problems).toHaveLength(2);
  });
  test("drug-induced diagnosis gives a reaction and a problem; pure adverse code only a reaction", () => {
    const result = at([item("a", "2025-01-01T12:00:00Z", {
      a: dx("Urticaria due to penicillins"),
      b: dx("Adverse effect of penicillins", "active", { icd10cm: "T36.0X5A" }),
      m: med("amoxicillin", "stopped", { rxnorm_ingredient: "723" }),
    })]);
    expect(result.problems).toHaveLength(1);
    expect(result.allergies).toHaveLength(1);
    expect(result.allergies[0]).toMatchObject({ substance: "amoxicillin", rxnorm_ingredient: "723", reaction_type: "hypersensitivity", mechanism: "unknown" });
  });
  test("ambiguous class stays a class; unknown mechanisms are not called immune", () => {
    const result = at([item("a", "2025-01-01T12:00:00Z", {
      p: dx("Euglycemic DKA, SGLT2 inhibitor-associated"), a: med("empagliflozin"), b: med("dapagliflozin"),
      c: { type: "allergy", substance: "lisinopril", reaction: "cough", severity: "mild", rxnorm_ingredient: "29046" },
      d: { type: "allergy", substance: "Peanut", reaction: "hives", severity: "moderate" },
    })]);
    expect(result.allergies.find(a => a.substance.includes("SGLT2"))?.rxnorm_ingredient).toBeUndefined();
    expect(result.allergies.find(a => a.substance === "lisinopril")).toMatchObject({ reaction_type: "side_effect", mechanism: "non_immune", criticality: "low" });
    expect(result.allergies.find(a => a.substance === "Peanut")?.mechanism).toBe("unknown");
  });
  test("a non-drug causal diagnosis cannot invent an allergy", () => {
    expect(at([item("a", "2025-01-01T12:00:00Z", { p: dx("Acute kidney injury due to sepsis") })]).allergies).toEqual([]);
  });
  test("latest allergy snapshot replaces the list and NKDA is not a substance", () => {
    const a = item("a", "2025-01-01T12:00:00Z", { allergy: { type: "allergy", substance: "Latex", reaction: "rash", severity: "mild" } });
    const b = item("b", "2025-01-02T12:00:00Z", { allergy: { type: "allergy", substance: "NKDA" } });
    expect(at([a, b]).allergies).toEqual([]);
  });
  test("sensitive problems remain visible and tagged", () => {
    expect(at([item("a", "2025-01-01T12:00:00Z", { p: dx("Bipolar disorder", "active", { icd10cm: "F31.9" }) })]).problems[0].sensitivity).toContain("mental-health");
  });
  test("brand medicine sensitivity and a documented past drug reaction", () => {
    const result = at([item("a", "2025-01-01T12:00:00Z", {
      m: med("Seroquel"),
      h: { type: "history", condition: "Angioedema due to lisinopril", source: "riverside" },
    })]);
    expect(result.medications[0].sensitivity).toContain("mental-health");
    expect(result.allergies[0]).toMatchObject({ substance: "lisinopril", reaction_type: "hypersensitivity", criticality: "high" });
  });
});

describe("measurements", () => {
  test("corrected exceeds final exceeds preliminary, even if copied earlier", () => {
    const result = at([
      item("a", "2025-01-01T12:00:00Z", { p: lab("1.4", "corrected") }),
      item("b", "2025-01-02T12:00:00Z", { p: lab("1.3", "final") }),
      item("c", "2025-01-03T12:00:00Z", { p: lab("1.2", "preliminary") }),
    ]).labs;
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(1.4);
    expect(result[0].evidence).toHaveLength(3);
  });
  test("an unreportable correction removes the old numeric value", () => {
    expect(at([item("a", "2025-01-01T12:00:00Z", { l: lab() }), item("b", "2025-01-02T12:00:00Z", { l: lab("Hemolyzed, see comment", "corrected") })]).labs).toEqual([]);
  });
  test("panels flatten, copies deduplicate and repeat specimens remain", () => {
    const single = lab();
    const panel = { type: "panel", accession: single.accession, collected: single.collected, specimen: "serum", status: "final", components: [single] };
    const result = at([item("a", "2025-01-01T12:00:00Z", { a: single, b: panel, c: lab("1.3", "final", { accession: "new" }) })]).labs;
    expect(result).toHaveLength(2);
    expect(result.find(r => r.value === 1.2)?.evidence).toHaveLength(2);
  });
  test("comparators and conversions, and source-wide equation metadata", () => {
    const result = at([item("a", "2025-01-01T12:00:00Z", {
      a: lab("≤88.4", "final", { unit: "µmol/L" }),
      b: lab("350000", "final", { accession: "p", test: { local_code: "PLT", name: "Platelet count" }, unit: "cells/uL" }),
      c: lab(">90", "final", { accession: "e", test: { local_code: "EGFR", name: "eGFR" }, unit: "mL/min/1.73m2" }),
      d: lab("7.4", "final", { accession: "ph", test: { local_code: "VPH", name: "pH, venous" }, unit: undefined }),
      e: lab("10", "final", { accession: "t", test: { local_code: "TNT", name: "Troponin T" }, unit: "ng/L" }),
    })]).labs;
    expect(result).toHaveLength(4);
    expect(result.find(r => r.analyte === "creatinine")).toMatchObject({ value: 1, comparator: "<=", unit: "mg/dL" });
    expect(result.find(r => r.analyte === "platelets")?.value).toBe(350);
    expect(result.find(r => r.analyte === "egfr")?.egfr_equation).toBe("ckd-epi-2021");
    expect(result.find(r => r.analyte === "ph")?.unit).toBe("[pH]");
  });
  test("race coefficient variants keep only the non-race result", () => {
    const result = at([item("a", "2025-01-01T12:00:00Z", {
      a: lab("60", "final", { test: { local_code: "EGFR_AA", name: "eGFR MDRD African American" }, unit: "mL/min/1.73m2" }),
      b: lab("50", "final", { test: { local_code: "EGFR_NAA", name: "eGFR MDRD non-African American" }, unit: "mL/min/1.73m2" }),
    })]).labs;
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ value: 50, egfr_equation: "mdrd" });
  });
  test("vital copies, nearby measurements and repeats form a set", () => {
    const a = item("a", "2025-01-01T12:00:00Z", {
      w: { type: "vitals", taken: "2025-01-01T03:00:00Z", weight_kg: 82.46 },
      v: { type: "vitals", taken: "2025-01-01T03:02:00Z", bp: { systolic_mmhg: 140, diastolic_mmhg: 90 }, heart_rate_bpm: 70 },
      repeat: { type: "vitals", taken: "2025-01-01T03:20:00Z", bp: { systolic_mmhg: 130, diastolic_mmhg: 80 } },
    });
    const b = item("b", "2025-01-02T12:00:00Z", { copied: a.payload.v });
    const result = at([b, a]).vitals;
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ local_time: "2024-12-31T21:02", systolic_mmhg: 140, repeat_systolic_mmhg: 130, weight_kg: 82.5, pulse_bpm: 70 });
    expect(result[0].evidence).toHaveLength(4);
  });
});

test("samples are order-independent, have all evidence and skip malformed input", async () => {
  const [{ items }] = await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).json();
  const forward = at(items), backward = at([...items].reverse());
  expect(backward).toEqual(forward);
  expect(forward.labs).toHaveLength(49);
  expect(forward.vitals).toHaveLength(7);
  expect(forward.allergies.find(a => a.substance === "naproxen")).toBeDefined();
  expect(forward.allergies.find(a => a.substance === "losartan")).toBeUndefined();
  for (const rows of Object.values(forward)) for (const row of rows) for (const e of row.evidence) {
    const original = items.find((i: FolioItem) => i.id === e.item_id);
    expect(original).toBeDefined();
    if (e.entry_id) expect(original.payload[e.entry_id]).toBeDefined();
  }
  expect(() => at([null, false, {}, { id: "x", issuer: "riverside", recorded: "nonsense" }, item("bad", "2025-01-01", { a: null, b: [], c: { type: "panel", components: [null, "x", {}, { test: null }] }, d: { type: "home_med", drug_name: {} }, e: { type: "vitals", taken: "wrong" } })] as any)).not.toThrow();
  expect(transform(null as any, "2025-01-01").problems).toEqual([]);
});
