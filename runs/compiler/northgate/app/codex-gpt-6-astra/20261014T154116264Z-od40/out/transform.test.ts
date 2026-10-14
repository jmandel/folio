import { test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const item = (id: string, effective: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem => ({
  folio: "0.1", id, issuer: "northgate", patient: "one", effective,
  recorded: effective.length === 10 ? effective + "T12:00:00-06:00" : effective, narrative: "", payload, ...extra,
});
const med = (action: string, extra: Record<string, unknown> = {}) => ({
  type: "med_event", med_id: "m1", action, origin: "northgate", drug: { name: "losartan potassium 50 MG Oral Tablet", rxnorm: "product-only" },
  dose: { value: 50, unit: "mg" }, frequency: "QD", ...extra,
});
const problem = (action: string, extra: Record<string, unknown> = {}) => ({
  type: "problem_event", problem_id: "p1", action, description: "Chronic kidney disease stage 3a", icd10cm: "N18.31", ...extra,
});
const lab = (code: string, value: string, unit: string, extra: Record<string, unknown> = {}) => ({
  type: "imported_result", test: { nfm_code: code, name: code }, value, unit, result_status: "F",
  collected: "2025-01-01T08:00:00-06:00", resulted: "2025-01-01T10:00:00-06:00",
  external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-" + code }, ...extra,
});
const allergy = (action: string, extra: Record<string, unknown> = {}) => ({
  type: "allergy_event", allergy_id: "a1", action, substance: { name: "Lisinopril", rxnorm: "29046" },
  reaction_type: "intolerance", reactions: ["Cough"], severity: "low", ...extra,
});
const run = (items: FolioItem[], asOf = "2026-10-13") => transform(items, asOf);

test("Chicago recorded cutoff includes the entire local day and is not the effective cutoff", () => {
  const a = item("a", "2025-01-01", { m: med("start") }, { recorded: "2025-03-05T05:59:59.999Z" });
  const b = item("b", "2025-02-01", { m: med("hold") }, { recorded: "2025-03-05T06:00:00Z" });
  expect(run([b, a], "2025-03-04").medications[0].status).toBe("active");
  expect(run([b, a], "2025-03-05").medications[0].status).toBe("held");
  const c = item("c", "2025-07-02", { m: med("start") }, { recorded: "2025-07-02T04:59:59Z" });
  expect(run([c], "2025-07-01").medications).toHaveLength(1);
});

test("supersession replaces entire payload and ancestry; future correction has no effect", () => {
  const a = item("a", "2025-01-01", { p: problem("add") });
  const b = item("b", "2025-01-01", { m: med("start") }, { recorded: "2025-01-02T12:00:00-06:00", supersedes: ["a"] });
  const c = item("c", "2025-01-01", { m: med("hold") }, { recorded: "2025-01-03T12:00:00-06:00", supersedes: ["b"] });
  expect(run([a, c, b], "2025-01-01").problems).toHaveLength(1);
  const middle = run([a, c, b], "2025-01-02");
  expect(middle.problems).toHaveLength(0);
  expect(middle.medications[0].status).toBe("active");
  expect(run([a, c, b]).medications[0].status).toBe("held");
  expect(run([a, c, b]).problems).toHaveLength(0);
});

test("void removes an erroneous event and replay restores the preceding line state", () => {
  const a = item("a", "2025-01-01", { m: med("start") });
  const b = item("b", "2025-01-02", { m: med("stop") });
  const c = item("c", "2025-01-03", { void: { type: "chart_correction", voided_items: ["b"], reason: "entry_error" } }, { retracts: ["b"] });
  expect(run([b, c, a]).medications[0].status).toBe("active");
  expect(run([b, c, a], "2025-01-02").medications[0].status).toBe("stopped");
  expect(run([item("v", "2025-01-04", {}, { retracts: ["a"] }), a]).medications).toHaveLength(0);
});

test("a retracted correction never existed", () => {
  const a = item("a", "2025-01-01", { m: med("start") });
  const b = item("b", "2025-01-02", { m: med("stop") }, { supersedes: ["a"] });
  const c = item("c", "2025-01-03", {}, { retracts: ["b"] });
  expect(run([b, c, a]).medications[0].status).toBe("active");
});

test("effective order wins over late filing and payload iteration order", () => {
  const a = item("a", "2025-01-01", { m: med("start") }, { recorded: "2025-04-01T12:00:00-05:00" });
  const b = item("b", "2025-02-01", { m: med("hold") });
  expect(run([b, a]).medications[0].status).toBe("held");
});

test("holds do not expire or change on list review, and active dates survive dose changes", () => {
  const a = item("a", "2025-01-01", { m: med("start") });
  const b = item("b", "2025-02-01", { m: med("change", { dose: { value: 100, unit: "mg" } }) });
  expect(run([b, a]).medications[0].status_since).toBe("2025-01-01");
  expect(run([b, a]).medications[0].dose?.value).toBe(100);
  const c = item("c", "2025-03-01", { m: med("hold", { review_on: "2025-03-10" }) });
  const d = item("d", "2025-04-01", { review: { type: "list_reviewed", list: "medications", lines_on_list: ["m1", "missing"] } });
  expect(run([d, c, b, a]).medications[0].status).toBe("held");
  expect(run([d, c, b, a]).medications).toHaveLength(1);
});

test("latest line event per ingredient wins, including an old line's later stop", () => {
  const a = item("a", "2025-01-01", { m: med("start") });
  const b = item("b", "2025-02-01", { m: med("start", { med_id: "m2", drug: { name: "Cozaar 25 MG Tablet" } }) });
  const c = item("c", "2025-03-01", { m: med("stop", { stop_reason: "adverse_reaction" }) });
  const rows = run([b, c, a]).medications;
  expect(rows).toHaveLength(1);
  expect(rows[0].ingredient).toBe("losartan");
  expect(rows[0].status).toBe("stopped");
  expect(rows[0].rxnorm_ingredient).toBeUndefined();
  expect(run([b, c, a]).allergies).toHaveLength(0);
});

test("tablet dose uses stated strength and absent dose is not inferred from strength alone", () => {
  const a = item("a", "2025-01-01", { m: med("start", { drug: { name: "famotidine 10 mg tablet" }, dose: { value: 2, unit: "tab" }, origin: "outside" }) });
  expect(run([a]).medications[0].dose).toEqual({ value: 20, unit: "mg" });
  expect(run([a]).medications[0].patient_reported).toBe(false);
  const b = item("b", "2025-01-02", { m: med("change", { dose: undefined, sig: "Sliding scale" }) });
  expect(run([b]).medications[0].dose).toBeUndefined();
});

test("problem recoding, precision, removal and resolution follow the line id", () => {
  const a = item("a", "2025-01-01", { p: problem("add", { onset: { date: "2016-01-01", precision: "year" } }) });
  const b = item("b", "2025-02-01", { p: problem("update", { description: "CKD G3b A3", icd10cm: "N18.32", onset: { date: "2016-01-01", precision: "year" } }) });
  const rows = run([b, a]).problems;
  expect(rows).toHaveLength(1);
  expect(rows[0].ckd_stage).toBe("G3b");
  expect(rows[0].albuminuria).toBe("A3");
  expect(rows[0].onset).toEqual({ value: "2016", precision: "year" });
  expect(run([a, item("c", "2025-03-01", { p: problem("resolve") })]).problems[0].status).toBe("resolved");
  expect(run([a, item("c", "2025-03-01", { p: problem("remove") })]).problems).toHaveLength(0);
});

test("referral copies cannot refresh a known line or undo removal; billing is excluded", () => {
  const a = item("a", "2025-01-01", { p: problem("remove") });
  const b = item("b", "2025-02-01", {
    dx: { type: "referral_dx", referral_id: "r1", display: "CKD", icd10cm: "N18.31" },
    bill: { type: "billing_dx", display: "Depression", icd10cm: "F32.9", restricted: "BH" },
  });
  expect(run([a, b]).problems).toHaveLength(0);
  expect(run([b]).problems).toHaveLength(1);
});

test("restricted and plainly sensitive conditions remain in output", () => {
  const a = item("a", "2025-01-01", {
    p: problem("add", { description: "Major depressive disorder", icd10cm: "F32.9", restricted: "BH" }),
    m: med("start", { drug: { name: "sertraline 50 mg tablet" }, restricted: "BH" }),
  });
  expect(run([a]).problems[0].sensitivity).toEqual(["mental-health"]);
  expect(run([a]).medications[0].sensitivity).toEqual(["mental-health"]);
});

test("allergy phenotype, mechanism, criticality, codes and inactivation", () => {
  const a = item("a", "2025-01-01", { a: allergy("add", { onset: { date: "2020-05-01", precision: "month" } }) });
  const r = run([a]).allergies[0];
  expect(r.substance).toBe("lisinopril");
  expect(r.reaction_type).toBe("side_effect");
  expect(r.mechanism).toBe("non_immune");
  expect(r.criticality).toBe("low");
  expect(r.rxnorm_ingredient).toBe("29046");
  expect(r.onset?.value).toBe("2020-05");
  const b = item("b", "2025-02-01", { a: allergy("update", { reaction_type: "adverse_reaction", reactions: ["Angioedema"], severity: "high" }) });
  expect(run([a, b]).allergies[0].reaction_type).toBe("hypersensitivity");
  expect(run([a, b]).allergies[0].mechanism).toBe("non_immune");
  expect(run([a, b, item("c", "2025-03-01", { a: allergy("inactivate") })]).allergies).toHaveLength(0);
});

test("drug-attributed diagnosis produces a substance entry with source evidence", () => {
  const a = item("a", "2025-01-01", { p: problem("add", { description: "Urticaria due to amoxicillin", icd10cm: "L50.0" }) });
  expect(run([a]).problems).toHaveLength(1);
  expect(run([a]).allergies[0].substance).toBe("amoxicillin");
  expect(run([a]).allergies[0].reaction_type).toBe("hypersensitivity");
  expect(run([a]).allergies[0].mechanism).toBe("unknown");
  const b = item("b", "2025-02-01", {
    p: problem("update", { description: "Adverse effect of penicillins", icd10cm: "T36.0X5A" }),
    m: med("start", { drug: { name: "amoxicillin 500 mg capsule" } }),
  });
  expect(run([a, b]).problems).toHaveLength(0);
  expect(run([a, b]).allergies[0].substance).toBe("amoxicillin");
});

test("interface cell counts convert to thousands and comparators survive", () => {
  const a = item("a", "2025-01-01", { plt: lab("PLT", "212000", "cells/uL"), wbc: lab("WBC", ">12000", "cells/uL") });
  const rows = run([a]).labs;
  expect(rows.find(r => r.analyte === "platelets")?.value).toBe(212);
  expect(rows.find(r => r.analyte === "wbc")?.value).toBe(12);
  expect(rows.find(r => r.analyte === "wbc")?.comparator).toBe(">");
  expect(rows.every(r => r.unit === "10*3/uL")).toBe(true);
});

test("lab correction withdraws only that report, not a valid redraw", () => {
  const a = item("a", "2025-01-01", { k: lab("K", "6.5", "mmol/L") });
  const b = item("b", "2025-01-01", { k: lab("K", "Result invalidated", "mmol/L", { result_status: "C" }) }, { recorded: "2025-01-02T12:00:00-06:00", supersedes: ["a"] });
  const c = item("c", "2025-01-02", { k: lab("K", "4.5", "mmol/L", { external_ref: { lab: "Lakeview Labs", accession: "A2", result_code: "LK-K" } }) });
  expect(run([c, a, b]).labs.map(r => r.value)).toEqual([4.5]);
  expect(run([c, a, b], "2025-01-01").labs[0].value).toBe(6.5);
});

test("most advanced lab copy wins, including nonnumeric corrected copies", () => {
  const a = item("a", "2025-01-01", { k: lab("K", "6.5", "mmol/L", { result_status: "P" }) });
  const b = item("b", "2025-01-02", { k: lab("K", "4.9", "mmol/L") });
  expect(run([a, b]).labs).toHaveLength(1);
  expect(run([a, b]).labs[0].value).toBe(4.9);
  expect(run([a, b]).labs[0].evidence).toHaveLength(2);
  const c = item("c", "2025-01-03", { k: lab("K", "Hemolyzed", "mmol/L", { result_status: "C" }) });
  expect(run([a, b, c]).labs).toHaveLength(0);
});

test("eGFR keeps the non-race value and separate stated calculations without date inference", () => {
  const a = item("a", "2025-01-01", {
    n: lab("EGFR-NAA", "61", "mL/min/1.73m2", { comment: "Calculated by CKD-EPI 2009. Report the African American value when appropriate." }),
    a: lab("EGFR-AA", "70", "mL/min/1.73m2", { comment: "Calculated by CKD-EPI 2009. Report the African American value when appropriate." }),
    m: lab("EGFR-MDRD", ">60", "mL/min/1.73m2", { comment: "MDRD" }),
  });
  const rows = run([a]).labs;
  expect(rows).toHaveLength(2);
  expect(rows.map(r => r.value).sort()).toEqual([60, 61]);
  expect(rows.find(r => r.value === 61)?.egfr_equation).toBe("ckd-epi-2009");
  const b = item("b", "2025-01-01", { e: lab("EGFR", "60", "mL/min/1.73m2") });
  expect(run([b]).labs[0].egfr_equation).toBe("unknown");
});

test("offset-free timestamps stay local and lab timestamps acquire seasonal offsets", () => {
  const a = item("a", "2025-07-02T08:05", {
    v: { type: "vital_set", bp: "160/95", bp_repeat: "142/88", weight_lb: 154, pulse_bpm: 72 },
    l: lab("K", "4.5", "mmol/L", { collected: "2025-07-02T08:05" }),
  }, { recorded: "2025-07-02T08:10" });
  expect(run([a]).labs[0].collected).toBe("2025-07-02T08:05:00-05:00");
  const v = run([a]).vitals[0];
  expect(v.local_time).toBe("2025-07-02T08:05");
  expect(v.weight_kg).toBe(69.9);
  expect(v.systolic_mmhg).toBe(160);
  expect(v.repeat_systolic_mmhg).toBe(142);
  const b = item("b", "2025-03-04T03:30:00Z", { v: { type: "vital_set", bp: "120/80" } });
  expect(run([b]).vitals[0].local_time).toBe("2025-03-03T21:30");
});

test("unreadable values and unknown units do not create fabricated clinical values", () => {
  const a = item("a", "2025-01-01", {
    p: null, m: [], k: lab("K", "4.5 invalid", "mmol/L"), n: lab("NA", "137", "bananas"),
    empty: {}, unknown: { type: "new_type" }, bp: { type: "vital_set", bp: "error", weight_lb: "154" },
  });
  expect(run([null, false, {}, a] as unknown as FolioItem[])).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  expect(run([a], "invalid")).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});

test("output is independent of item order and input remains unchanged", () => {
  const items = [
    item("a", "2025-01-01", { m: med("start"), p: problem("add") }),
    item("b", "2025-01-02", { m: med("change"), l: lab("PLT", "210000", "cells/uL") }),
    item("c", "2025-01-03", { a: allergy("add") }),
  ];
  const before = JSON.stringify(items), expected = run(items);
  for (const order of [[0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) expect(run(order.map(i => items[i]))).toEqual(expected);
  expect(JSON.stringify(items)).toBe(before);
});

test("removing a duplicate problem line preserves another valid line", () => {
  const a = item("a", "2025-01-01", { p: problem("add") });
  const b = item("b", "2025-01-02", { p: problem("remove", { problem_id: "duplicate" }) });
  expect(run([a, b]).problems).toHaveLength(1);
  expect(run([a, b]).problems[0].evidence[0].item_id).toBe("a");
});

test("new eGFR code and narrative method wording, no LOINC, and explicit CKD wording", () => {
  const a = item("a", "2025-01-01", {
    e: lab("EGFR-CR", ">90", "mL/min/1.73m2", { comment: "CKD-EPI creatinine equation (2021), race-free." }),
    p: problem("add", { description: "CKD stage IV, moderately increased albuminuria", icd10cm: "N18.9" }),
  });
  expect(run([a]).labs[0].egfr_equation).toBe("ckd-epi-2021");
  expect(run([a]).problems[0].ckd_stage).toBe("G4");
  expect(run([a]).problems[0].albuminuria).toBe("A2");
});

test("all listed analytes are recognized without requiring LOINC", () => {
  const tests = [
    ["CREAT", "mg/dL", "creatinine"], ["EGFR", "mL/min/1.73m2", "egfr"], ["K", "mmol/L", "potassium"],
    ["NA", "mmol/L", "sodium"], ["CL", "mmol/L", "chloride"], ["CO2", "mmol/L", "bicarbonate"],
    ["AGAP", "mmol/L", "anion_gap"], ["BUN", "mg/dL", "bun"], ["GLU", "mg/dL", "glucose"],
    ["HBA1C", "%", "a1c"], ["UACR", "mg/g", "uacr"], ["PLT", "cells/uL", "platelets"],
    ["WBC", "cells/uL", "wbc"], ["HGB", "g/dL", "hemoglobin"], ["BHB", "mmol/L", "bhb"],
    ["PH", "", "ph"], ["PCO2", "mmHg", "pco2"], ["LIPASE", "U/L", "lipase"],
    ["TROPI", "ng/mL", "troponin"], ["CHOL", "mg/dL", "cholesterol"], ["TG", "mg/dL", "triglycerides"],
    ["HDL", "mg/dL", "hdl"], ["LDL", "mg/dL", "ldl"],
  ];
  const a = item("a", "2025-01-01", Object.fromEntries(tests.map(([code, unit]) => [code, lab(code, "1", unit)])));
  expect(run([a]).labs.map(r => r.analyte).sort()).toEqual(tests.map(t => t[2]).sort());
});

test("malformed JSON shapes are skipped without throwing", () => {
  const values: unknown[] = [null, false, true, 0, -1, 1e308, "", "nonsense", [], [null], {}];
  for (const value of values) {
    expect(() => run([item("a", "2025-01-01", {
      m: med("start", { drug: value, dose: value, frequency: value }),
      p: problem("add", { onset: value, description: value, snomed: value }),
      a: allergy("add", { substance: value, reactions: value, severity: value }),
      l: lab("K", "4", "mmol/L", { test: value, external_ref: value, collected: value }),
      v: { type: "vital_set", bp: value, pulse_bpm: value, weight_lb: value },
    })])).not.toThrow();
  }
});

test("tablet strengths in grams and biological units are amounts, not tablet counts", () => {
  const rows = run([item("a", "2025-01-01", {
    a: med("start", { med_id: "a", drug: { name: "amoxicillin 1 g tablet" }, dose: { value: 2, unit: "tab" } }),
    b: med("start", { med_id: "b", drug: { name: "cholecalciferol 1000 UNT tablet" }, dose: { value: 2, unit: "tab" } }),
    c: med("start", { med_id: "c", drug: { name: "potassium chloride 20 mEq tablet" }, dose: { value: 1, unit: "tab" } }),
  })]).medications;
  expect(rows.find(r => r.ingredient === "amoxicillin")?.dose).toEqual({ value: 2000, unit: "mg" });
  expect(rows.find(r => r.ingredient === "cholecalciferol")?.dose).toEqual({ value: 2000, unit: "units" });
  expect(rows.find(r => r.ingredient === "potassium chloride")?.dose).toBeUndefined();
});
