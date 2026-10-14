import { describe, expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

function item(id: string, effective: string, data: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "northgate", patient: "one", effective,
    recorded: effective.includes("T") ? effective : "2025-01-01T12:00:00-06:00",
    narrative: "", payload: { entry: data }, ...extra };
}
const when = "2025-01-01T09:00:00-06:00";
const end = "2026-10-13";
const med = (action: string, extra: Record<string, unknown> = {}) => ({
  type: "med_event", med_id: "m1", action, origin: "northgate",
  drug: { name: "losartan potassium 50 MG Oral Tablet", rxnorm: "product-code" },
  dose: { value: 50, unit: "mg" }, frequency: "QD", ...extra,
});
const problem = (action: string, extra: Record<string, unknown> = {}) => ({
  type: "problem_event", problem_id: "p1", action, description: "Chronic kidney disease stage 3a", icd10cm: "N18.31", ...extra,
});
const allergy = (action: string, extra: Record<string, unknown> = {}) => ({
  type: "allergy_event", allergy_id: "a1", action, substance: { name: "Lisinopril", rxnorm: "29046" },
  reaction_type: "intolerance", severity: "low", reactions: ["Cough"], ...extra,
});
const lab = (code: string, name: string, value: string, unit: string, extra: Record<string, unknown> = {}) => ({
  type: "imported_result", test: { nfm_code: code, name }, value, unit,
  result_status: "F", collected: when, resulted: when,
  external_ref: { lab: "Lakeview Labs", accession: "acc1", result_code: `LK-${code}` }, ...extra,
});

describe("record visibility and deterministic replay", () => {
  test("Chicago end of day works in summer, winter, and at DST transitions", () => {
    for (const [day, last, next] of [
      ["2025-07-01", "2025-07-02T04:59:59.999Z", "2025-07-02T05:00:00Z"],
      ["2025-01-01", "2025-01-02T05:59:59.999Z", "2025-01-02T06:00:00Z"],
      ["2025-03-09", "2025-03-10T04:59:59.999Z", "2025-03-10T05:00:00Z"],
      ["2025-11-02", "2025-11-03T05:59:59.999Z", "2025-11-03T06:00:00Z"],
    ]) {
      const rows = transform([
        item("a", when, med("start"), { recorded: last }),
        item("b", when, med("stop"), { recorded: next, supersedes: ["a"] }),
      ], day);
      expect(rows.medications[0].status).toBe("active");
    }
  });
  test("future corrections do not change history; chains and voids do not resurrect old versions", () => {
    const a = item("a", when, med("start"));
    const b = item("b", when, med("change", { dose: { value: 100, unit: "mg" } }), {
      supersedes: ["a"], recorded: "2025-01-02T09:00:00-06:00",
    });
    const c = item("c", "2025-01-03T09:00:00-06:00", { type: "chart_correction", voided_items: ["b"], reason: "entry_error" }, { retracts: ["b"] });
    expect(transform([c, a, b], "2025-01-01").medications[0].dose?.value).toBe(50);
    expect(transform([c, a, b], "2025-01-02").medications[0].dose?.value).toBe(100);
    expect(transform([c, a, b], "2025-01-03").medications).toEqual([]);
    expect(transform([a, c, b], "2025-01-03")).toEqual(transform([c, b, a], "2025-01-03"));
  });
  test("correction ids are scoped to issuer", () => {
    const a = item("a", when, med("start"));
    const voidOther = item("v", when, { type: "chart_correction" }, { issuer: "other", retracts: ["a"] });
    expect(transform([a, voidOther], end).medications).toHaveLength(1);
  });
  test("clinical time orders events even when filing order differs", () => {
    const start = item("start", "2025-01-01T09:00:00-06:00", med("start"), { recorded: "2025-01-05T09:00:00-06:00" });
    const stop = item("stop", "2025-01-03T09:00:00-06:00", med("stop"));
    expect(transform([stop, start], end).medications[0].status).toBe("stopped");
  });
});

describe("clinical lists", () => {
  test("dose changes retain start/resume date, holds never auto-expire, reviews do nothing", () => {
    const start = item("start", "2020", med("start"));
    const change = item("change", "2025-01-03T09:00:00-06:00", med("change", { dose: { value: 100, unit: "mg" } }));
    const review = item("review", "2025-01-04T09:00:00-06:00", { type: "list_reviewed", list: "medications", lines_on_list: [] });
    const active = transform([review, start, change], end).medications[0];
    expect(active.status_since).toBe("2020");
    expect(active.rxnorm_ingredient).toBeUndefined();
    expect(active.ingredient).toBe("losartan");
    expect(active.evidence).toHaveLength(2);
    const hold = item("hold", "2025-01-05T09:00:00-06:00", med("hold", { review_on: "2025-01-06", reason_text: "Acute illness" }));
    expect(transform([hold, review, start, change], end).medications[0]).toMatchObject({ status: "held", status_since: "2025-01-05", status_reason_text: "Acute illness" });
    const resume = item("resume", "2025-02-01T09:00:00-06:00", med("resume"));
    const nextChange = item("change2", "2025-03-01T09:00:00-06:00", med("change"));
    expect(transform([start, change, hold, resume, nextChange], end).medications[0].status_since).toBe("2025-02-01");
  });
  test("one latest line per ingredient, including outside medications and restricted entries", () => {
    const old = item("old", when, med("stop", { stop_reason: "ineffective" }));
    const restart = item("new", "2025-02-01T09:00:00-06:00", med("start", { med_id: "m2", origin: "outside", restricted: "BH", drug: { name: "Cozaar", outside_code: { system: "other", code: "xyz" } } }));
    const wrong = item("wrong", "2025-03-01T09:00:00-06:00", med("stop", { med_id: "m3" }));
    const voided = item("void", "2025-03-02T09:00:00-06:00", { type: "chart_correction" }, { retracts: ["wrong"] });
    const rows = transform([wrong, old, restart, voided], end).medications;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ ingredient: "losartan", status: "active", patient_reported: false });
    expect(rows[0].stop_reason).toBeUndefined();
  });
  test("combination drugs yield each named ingredient without assigning a combined mg dose to both", () => {
    const combination = item("combo", when, med("start", { drug: { name: "losartan-hydrochlorothiazide 50-12.5 MG Oral Tablet" } }));
    const rows = transform([combination], end).medications;
    expect(rows.map(r => r.ingredient)).toEqual(["hydrochlorothiazide", "losartan"]);
    expect(rows.every(r => r.dose === undefined)).toBe(true);
  });
  test("problems restage from their own events, retain fuzzy onset, and can resolve or be removed", () => {
    const a = item("a", when, problem("add", { onset: { date: "2016-01-01", precision: "year" } }));
    const b = item("b", "2025-02-01T09:00:00-06:00", problem("update", { icd10cm: "N18.32", description: "Chronic kidney disease stage 3b, A2", onset: { date: "2016-03-01", precision: "month" } }));
    const review = item("review", "2025-03-01T09:00:00-06:00", { type: "list_reviewed", list: "problems", lines_on_list: ["p1"] });
    const latestLab = item("lab", "2025-04-01T09:00:00-06:00", lab("EGFR", "eGFR", "12", "mL/min/1.73m2"));
    const result = transform([latestLab, b, a, review], end).problems[0];
    expect(result).toMatchObject({ ckd_stage: "G3b", albuminuria: "A2", onset: { value: "2016-03", precision: "month" } });
    expect(result.evidence).toEqual([{ item_id: "b", entry_id: "entry" }]);
    const resolved = item("r", "2025-05-01T09:00:00-06:00", problem("resolve"));
    expect(transform([a, b, resolved], end).problems[0].status).toBe("resolved");
    const removed = item("x", "2025-06-01T09:00:00-06:00", problem("remove"));
    expect(transform([a, b, resolved, removed], end).problems).toEqual([]);
  });
  test("narrative, billing, referrals and reviews alone do not manufacture list entries", () => {
    const note = item("note", when, { type: "visit", visit_id: "v", reason: "Diabetes" }, { narrative: "Taking carvedilol. CKD stage 4. BP 180/110. eGFR 20." });
    const billing = item("bill", when, { type: "billing_dx", icd10cm: "E11.9", display: "Diabetes" });
    const referral = item("ref", when, { type: "referral_dx", icd10cm: "N18.4", display: "CKD stage 4" });
    expect(transform([note, billing, referral], end)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  });
  test("allergy list preserves reaction type/criticality and respects inactivation", () => {
    const a = item("a", when, allergy("add", { onset: { date: "2010-01-01", precision: "year" } }));
    expect(transform([a], end).allergies[0]).toMatchObject({ substance: "lisinopril", type: "intolerance", criticality: "low", onset: { value: "2010", precision: "year" } });
    const stop = item("stop", when, med("stop", { drug: { name: "Lisinopril 10 MG Oral Tablet" }, stop_reason: "adverse_reaction", reason_text: "Cough" }));
    const inactive = item("inactive", "2025-02-01T09:00:00-06:00", allergy("inactivate"));
    expect(transform([stop, a, inactive], end).allergies).toEqual([]);
  });
  test("drug names normalize without inventing ingredient codes, while food spelling is retained", () => {
    const a = item("a", when, allergy("add", { substance: { name: "Lisinopril" } }));
    const b = item("b", when, allergy("add", { allergy_id: "food", substance: { name: "Peanuts" }, reactions: ["Hives", "Angioedema"], reaction_type: "allergy", severity: "high" }));
    const rows = transform([a, b], end).allergies;
    expect(rows.find(r => r.substance === "lisinopril")?.rxnorm_ingredient).toBeUndefined();
    expect(rows.find(r => r.substance === "Peanuts")).toMatchObject({ reaction: "Hives; Angioedema", criticality: "high" });
  });
  test("a drug adverse-effect diagnosis is an allergy row; its resulting illness remains a problem", () => {
    const effect = item("effect", when, problem("add", { description: "Adverse effect of dapagliflozin, initial encounter", icd10cm: "T38.3X5A" }));
    const illness = item("illness", when, problem("add", { problem_id: "p2", description: "Diabetic ketoacidosis", icd10cm: "E11.10" }));
    const rows = transform([effect, illness], end);
    expect(rows.problems).toHaveLength(1);
    expect(rows.problems[0].condition).toBe("Diabetic ketoacidosis");
    expect(rows.allergies[0]).toMatchObject({ substance: "dapagliflozin", type: "adverse_reaction", criticality: "unknown" });
  });
});

describe("laboratory and vital measurements", () => {
  test("report-level replacement drops a withdrawn component and keeps a separate redraw", () => {
    const old = item("old", when, lab("K", "Potassium, serum", "6.0", "mmol/L"));
    const correction = item("c", when, lab("K", "Potassium, serum", "Result invalidated", "mmol/L", { result_status: "C" }), { supersedes: ["old"], recorded: "2025-01-02T09:00:00-06:00" });
    const redraw = item("new", when, lab("K", "Potassium, serum", "4.5", "mmol/L", { external_ref: { lab: "Lakeview Labs", accession: "acc2", result_code: "LK-K" } }));
    expect(transform([old, correction, redraw], "2025-01-01").labs.map(r => r.value).sort()).toEqual([4.5, 6]);
    expect(transform([old, correction, redraw], end).labs.map(r => r.value)).toEqual([4.5]);
  });
  test("most advanced copy wins before value parsing, while a valid hemolyzed numeric result stands", () => {
    const p = item("p", when, lab("K", "Potassium", "6", "mmol/L", { result_status: "P", comment: "Specimen hemolyzed" }));
    const f = item("f", when, lab("K", "Potassium", "5.9", "mmol/L", { comment: "Specimen hemolyzed; recollection requested" }));
    expect(transform([p, f], end).labs[0].value).toBe(5.9);
    const c = item("c", when, lab("K", "Potassium", "Result invalidated", "mmol/L", { result_status: "C" }));
    expect(transform([p, f, c], end).labs).toEqual([]);
  });
  test("counts scale to thousands; comparators and separate results survive", () => {
    const platelets = item("plt", when, lab("PLT", "Platelet count", "212000", "cells/uL"));
    const wbc = item("wbc", when, lab("WBC", "White blood cell count", "7100", "cells/uL"));
    const troponin = item("trop", when, lab("TNI", "Troponin I", "<0.01", "ng/mL"));
    const rows = transform([platelets, wbc, troponin], end).labs;
    expect(rows.find(r => r.analyte === "platelets")).toMatchObject({ value: 212, unit: "10*3/uL" });
    expect(rows.find(r => r.analyte === "wbc")?.value).toBe(7.1);
    expect(rows.find(r => r.analyte === "troponin")).toMatchObject({ value: 0.01, comparator: "<" });
  });
  test("eGFR spans local codes, excludes race-adjusted variants, and trusts method notes", () => {
    const naa = item("naa", when, lab("EGFR-NAA", "eGFR non-African American", ">60", "mL/min/1.73m2", { comment: "Calculated by MDRD equation.", external_ref: { lab: "Lakeview Labs", accession: "acc1", result_code: "LK-EGFR09N" } }));
    const aa = item("aa", when, lab("EGFR-AA", "eGFR African American", "75", "mL/min/1.73m2"));
    const free = item("free", when, lab("EGFR", "eGFR (CKD-EPI 2021)", "65", "mL/min/1.73m2", { external_ref: { lab: "Lakeview Labs", accession: "acc2", result_code: "LK-EGFR21" } }));
    const rows = transform([aa, free, naa], end).labs;
    expect(rows).toHaveLength(2);
    expect(rows.find(r => r.value === 60)).toMatchObject({ comparator: ">", egfr_equation: "mdrd" });
    expect(rows.find(r => r.value === 65)?.egfr_equation).toBe("ckd-epi-2021");
  });
  test("every tracked analyte maps without depending on LOINC", () => {
    const specs = [
      ["CREAT", "Creatinine, serum", "mg/dL", "creatinine"], ["NA", "Sodium, serum", "mmol/L", "sodium"],
      ["CL", "Chloride", "mmol/L", "chloride"], ["CO2", "Carbon dioxide, total", "mmol/L", "bicarbonate"],
      ["AGAP", "Anion gap", "mmol/L", "anion_gap"], ["BUN", "Urea nitrogen", "mg/dL", "bun"],
      ["GLU", "Glucose", "mg/dL", "glucose"], ["A1C", "Hemoglobin A1c", "%", "a1c"],
      ["UACR", "Urine albumin/creatinine ratio", "mg/g", "uacr"], ["HGB", "Hemoglobin", "g/dL", "hemoglobin"],
      ["BHB", "Beta-hydroxybutyrate", "mmol/L", "bhb"], ["PH", "Venous pH", "", "ph"],
      ["PCO2", "Venous pCO2", "mmHg", "pco2"], ["LIP", "Lipase", "U/L", "lipase"],
      ["CHOL", "Cholesterol, total", "mg/dL", "cholesterol"], ["TRIG", "Triglycerides", "mg/dL", "triglycerides"],
      ["HDL", "HDL cholesterol", "mg/dL", "hdl"], ["LDL", "LDL cholesterol, calculated", "mg/dL", "ldl"],
    ];
    for (const [code, name, unit, analyte] of specs) {
      expect(transform([item(code, when, lab(code, name, "1", unit))], end).labs[0]?.analyte).toBe(analyte);
    }
  });
  test("unsupported measurements and unreadable values never become unrelated lab results", () => {
    const data = [lab("UCREAT", "Creatinine, urine", "100", "mg/dL"), lab("TSH", "TSH", "2", "mIU/L"),
      lab("K", "Potassium", "4.5 hemolyzed", "mmol/L"), lab("NA", "Sodium", "140", "mystery units"),
      lab("TROP", "Troponin T", "2", "ng/mL"), lab("NONHDL", "Non-HDL cholesterol", "150", "mg/dL"),
      lab("CR", "C-reactive protein", "2", "mg/dL")];
    expect(transform(data.map((d, i) => item(`x${i}`, when, d)), end).labs).toEqual([]);
  });
  test("vitals convert timezone, preserve repeats, and round pounds to kilograms", () => {
    const v = item("v", "2025-07-01T05:12:00Z", { type: "vital_set", bp: "152/94", bp_repeat: "140/86", pulse_bpm: 75, weight_lb: 174.4, temp_f: 98.6 });
    expect(transform([v], end).vitals[0]).toMatchObject({ local_time: "2025-07-01T00:12", setting: "clinic", systolic_mmhg: 152, diastolic_mmhg: 94, repeat_systolic_mmhg: 140, repeat_diastolic_mmhg: 86, weight_kg: 79.1 });
  });
});

test("malformed JSON-shaped inputs do not throw, and input order does not affect output", () => {
  const malformed: unknown[] = [null, undefined, false, 9, "x", [], {}, { recorded: "bad" },
    item("badpayload", when, {}, { payload: null as never }),
    item("badentry", when, {}, { payload: { a: null, b: [], c: 42, d: { type: "med_event", drug: null } } }),
    item("badlab", when, lab("K", "Potassium", "4", "mmol/L", { result_status: { toString: null } })),
    item("badallergy", when, allergy("add", { substance: null, reactions: [null, 1] })),
  ];
  expect(() => transform(malformed as FolioItem[], end)).not.toThrow();
  expect(transform(null as never, end)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  expect(transform([], "2025-02-30")).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  const valid = [item("a", when, med("start")), item("b", when, problem("add")), item("c", when, allergy("add")), item("d", when, lab("K", "Potassium", "4.5", "mmol/L"))];
  const original = JSON.stringify(valid), expected = transform(valid, end);
  expect(transform([...valid].reverse(), end)).toEqual(expected);
  expect(transform([valid[2], valid[0], valid[3], valid[1]], end)).toEqual(expected);
  expect(JSON.stringify(valid)).toBe(original);
});
