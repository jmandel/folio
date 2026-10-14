import { describe, expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

function item(id: string, effective: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", issuer: "test:northgate", patient: "p", id, effective,
    recorded: effective.length === 10 ? effective + "T12:00:00-06:00" : effective,
    narrative: "", payload, ...extra };
}
const med = (med_id: string, action: string, name = "losartan potassium 50 MG Oral Tablet", extra = {}) => ({
  type: "med_event", med_id, action, origin: "northgate", drug: { name, rxnorm: "PRODUCT-CODE" },
  dose: { value: 1, unit: "tab" }, frequency: "QD", ...extra,
});
const problem = (problem_id: string, action: string, description: string, icd10cm: string, extra = {}) => ({
  type: "problem_event", problem_id, action, description, icd10cm, ...extra,
});
const allergy = (allergy_id: string, action: string, name: string, reactions: string[], extra = {}) => ({
  type: "allergy_event", allergy_id, action, substance: { name, rxnorm: "INGREDIENT-CODE" },
  reactions, reaction_type: "allergy", severity: "high", ...extra,
});
const lab = (code: string, value: string, unit: string, extra = {}) => ({
  type: "imported_result", test: { nfm_code: code, name: code }, value, unit, result_status: "F",
  collected: "2023-04-01T11:00:00-05:00", resulted: "2023-04-01T12:00:00-05:00",
  external_ref: { lab: "Lakeview Labs", accession: "A", result_code: "LK-" + code }, ...extra,
});
const run = (items: FolioItem[], asOf = "2026-10-13") => transform(items, asOf);

describe("record scope and replay", () => {
  test("Chicago winter and summer recording boundaries", () => {
    for (const [date, cutoff] of [["2024-01-01", "2024-01-02T06:00:00Z"], ["2024-07-01", "2024-07-02T05:00:00Z"]]) {
      const old = item("before", date, { m: med("m", "start") }, { recorded: new Date(Date.parse(cutoff) - 1).toISOString() });
      const later = item("after", date, { m: med("m", "stop") }, { recorded: cutoff });
      expect(run([later, old], date).medications[0].status).toBe("active");
    }
  });
  test("corrections apply only when filed, transitively, and in their issuer", () => {
    const old = item("a", "2024-01-01", { m: med("m", "start") });
    const corrected = item("b", "2024-01-01", { m: med("m", "hold") }, { recorded: "2024-01-03T12:00:00-06:00", supersedes: ["a"] });
    const voided = item("c", "2024-01-05", {}, { retracts: ["b"] });
    expect(run([voided, corrected, old], "2024-01-02").medications[0].status).toBe("active");
    expect(run([voided, corrected, old], "2024-01-04").medications[0].status).toBe("held");
    expect(run([voided, corrected, old]).medications).toEqual([]);
    expect(run([old, item("x", "2024-01-02", {}, { issuer: "other", retracts: ["a"] })]).medications).toHaveLength(1);
  });
  test("replay is by effective time, with recorded time breaking ties", () => {
    const start = item("s", "2024-01-01", { m: med("m", "start") }, { recorded: "2024-03-01T10:00:00-06:00" });
    const hold = item("h", "2024-02-01", { m: med("m", "hold", undefined, { review_on: "2024-02-15", reason_text: "AKI" }) });
    const review = item("r", "2024-04-01", { r: { type: "list_reviewed", list: "medications", lines_on_list: ["m"] } });
    const result = run([review, hold, start]).medications[0];
    expect(result).toMatchObject({ status: "held", status_since: "2024-02-01", status_reason_text: "AKI" });
    expect(result.evidence).toEqual([{ item_id: "h", entry_id: "m" }]);
  });
  test("effective timestamps compare instants, including the repeated DST hour", () => {
    const first = item("z", "2024-11-03T01:50:00-05:00", { m: med("m", "start") });
    const second = item("a", "2024-11-03T01:10:00-06:00", { m: med("m", "stop") });
    expect(run([first, second]).medications[0].status).toBe("stopped");
  });
  test("future effective dates are not substituted for the recorded-time scope rule", () => {
    const event = item("s", "2025-06-01", { m: med("m", "start") }, { recorded: "2025-05-30T10:00:00-05:00" });
    expect(run([event], "2025-05-30").medications[0].status_since).toBe("2025-06-01");
  });
});

describe("medication semantics", () => {
  test("dose changes preserve the start date, and resumes replace it", () => {
    const events = [
      item("s", "2022-01-01", { m: med("m", "start") }),
      item("c", "2022-03-01", { m: med("m", "change", undefined, { dose: { value: 2, unit: "tab" } }) }),
    ];
    expect(run(events).medications[0]).toMatchObject({ ingredient: "losartan", status_since: "2022-01-01", dose: { value: 100, unit: "mg" } });
    expect(run(events).medications[0].evidence).toHaveLength(2);
    events.push(item("h", "2022-05-01", { m: med("m", "hold") }), item("r", "2022-07-01", { m: med("m", "resume") }));
    expect(run(events).medications[0].status_since).toBe("2022-07-01");
  });
  test("selects the line with the latest own event, and voids do not affect valid lines", () => {
    const a = item("a", "2022-01-01", { m: med("old", "start", "Jardiance 10 MG Oral Tablet") });
    const b = item("b", "2022-03-01", { m: med("new", "start", "empagliflozin 25 MG Oral Tablet") });
    const c = item("c", "2022-04-01", { m: med("old", "stop", "Jardiance 10 MG Oral Tablet", { stop_reason: "adverse_reaction" }) });
    expect(run([c, b, a]).medications).toHaveLength(1);
    expect(run([c, b, a]).medications[0]).toMatchObject({ ingredient: "empagliflozin", status: "stopped", stop_reason: "adverse_reaction" });
    const voided = item("v", "2022-05-01", {}, { retracts: ["c"] });
    expect(run([c, b, a, voided]).medications[0]).toMatchObject({ status: "active", dose: { value: 25, unit: "mg" } });
  });
  test("preserves outside and sensitive lines without pretending product codes are ingredients", () => {
    const r = run([item("m", "2024-01-01", { m: med("m", "start", "Zoloft 50 MG Oral Tablet", { origin: "outside", restricted: "BH", frequency: "OTHER" }) })]).medications[0];
    expect(r).toMatchObject({ ingredient: "sertraline", patient_reported: false, sensitivity: ["mental-health"], frequency: "other" });
    expect(r.rxnorm_ingredient).toBeUndefined();
  });
  test("omits unexpressed dose and unknown ingredient, keeps partial dates", () => {
    const r = run([item("m", "2016", { m: med("m", "change", "water pill", { dose: undefined }) }, { recorded: "2022-01-01T12:00:00-06:00" })]).medications[0];
    expect(r.ingredient).toBeUndefined();
    expect(r.dose).toBeUndefined();
    expect(r.status_since).toBeUndefined();
    const started = run([item("m", "2016", { m: med("m", "start") }, { recorded: "2022-01-01T12:00:00-06:00" })]);
    expect(started.medications[0].status_since).toBe("2016");
  });
  test("combination tablets yield ingredient doses, not the product mass for both", () => {
    const rows = run([item("m", "2024-01-01", { m: med("m", "start", "lisinopril 10 MG / hydrochlorothiazide 12.5 MG Oral Tablet", { dose: { value: 2, unit: "tab" } }) })]).medications;
    expect(rows.map(r => [r.ingredient, r.dose])).toEqual([
      ["hydrochlorothiazide", { value: 25, unit: "mg" }], ["lisinopril", { value: 20, unit: "mg" }],
    ]);
  });
  test("OTHER can describe an explicit once-weekly sig", () => {
    const event = item("m", "2024-01-01", { m: med("m", "start", "Ozempic", { frequency: "OTHER", sig: "Inject 0.25 mg under the skin once weekly", dose: { value: 0.25, unit: "mg" } }) });
    expect(run([event]).medications[0]).toMatchObject({ ingredient: "semaglutide", frequency: "QW", dose: { value: 0.25, unit: "mg" } });
    event.payload.m.sig = "Take twice weekly";
    expect(run([event]).medications[0].frequency).toBe("other");
  });
});

describe("problems and avoidance list", () => {
  test("only problem events edit the list; stage and onset come from the clinician", () => {
    const items = [
      item("p1", "2020-01-01", { p: problem("p", "add", "CKD stage 3a", "N18.31") }),
      item("p2", "2024-01-01", { p: problem("p", "update", "Chronic kidney disease stage 3b A2", "N18.32", { onset: { date: "2016-01-01", precision: "year" } }) }),
      item("bill", "2025-01-01", { b: { type: "billing_dx", icd10cm: "N18.4", display: "CKD stage 4" }, r: { type: "referral_dx", icd10cm: "N18.4", display: "CKD stage 4" } }),
      item("l", "2025-02-01", { l: lab("EGFR21", "15", "mL/min/1.73m2") }),
    ];
    expect(run(items).problems).toHaveLength(1);
    expect(run(items).problems[0]).toMatchObject({ ckd_stage: "G3b", albuminuria: "A2", onset: { value: "2016", precision: "year" } });
    expect(run([item("p", "2024-01-01", { p: problem("p", "add", "CKD stage 3", "N18.3") })]).problems[0].ckd_stage).toBeUndefined();
    expect(run([item("p", "2024-01-01", { p: problem("p", "add", "CKD G3bA3", "N18.9") })]).problems[0]).toMatchObject({ ckd_stage: "G3b", albuminuria: "A3" });
  });
  test("resolve retains history, remove deletes, equivalent conditions collapse", () => {
    const rows = run([
      item("a", "2020-01-01", { p: problem("p", "add", "Hypertension", "I10") }),
      item("b", "2021-01-01", { p: problem("p", "resolve", "Hypertension", "I10") }),
      item("c", "2022-01-01", { p: problem("q", "add", "Essential hypertension", "I10", { restricted: "BH" }) }),
      item("d", "2020-01-01", { p: problem("x", "add", "Other problem", "X") }),
      item("e", "2023-01-01", { p: problem("x", "remove", "Other problem", "X") }),
    ]).problems;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ condition: "Essential hypertension", status: "active", sensitivity: ["mental-health"] });
  });
  test("classifies by reaction and distinguishes criticality from mechanism", () => {
    const rows = run([
      item("a", "2024-01-01", { a: allergy("a", "add", "lisinopril", ["Angioedema"], { reaction_type: "intolerance" }) }),
      item("b", "2024-01-01", { a: allergy("b", "add", "amoxicillin", ["Hives", "Rash"]) }),
      item("c", "2024-01-01", { a: allergy("c", "add", "empagliflozin", ["Ketoacidosis"], { reaction_type: "adverse_reaction", severity: "unknown" }) }),
    ]).allergies;
    expect(rows.find(r => r.substance === "lisinopril")).toMatchObject({ reaction_type: "hypersensitivity", mechanism: "non_immune" });
    expect(rows.find(r => r.substance === "amoxicillin")).toMatchObject({ reaction: "Hives; Rash", mechanism: "immune" });
    expect(rows.find(r => r.substance === "empagliflozin")).toMatchObject({ reaction_type: "serious_adverse_event", mechanism: "non_immune", criticality: "unknown" });
  });
  test("drug-attributed diagnoses add avoidance rows and use same-item class resolution only", () => {
    const caused = item("p", "2024-01-01", {
      p: problem("p", "resolve", "SGLT2 inhibitor-associated ketoacidosis", "E11.10"),
      m: med("m", "stop", "Jardiance 10 MG Oral Tablet"),
    });
    const rows = run([caused]);
    expect(rows.problems[0].status).toBe("resolved");
    expect(rows.allergies[0]).toMatchObject({ substance: "empagliflozin", reaction_type: "serious_adverse_event", mechanism: "non_immune", criticality: "high" });
    expect(rows.allergies[0].evidence).toHaveLength(2);
    const separately = item("p", "2024-01-01", { p: caused.payload.p });
    expect(run([separately, item("m", "2023-01-01", { m: caused.payload.m })]).allergies[0].substance).toBe("SGLT2 inhibitor");
  });
  test("inactivation suppresses an older derived avoidance entry", () => {
    const p = item("p", "2023-01-01", { p: problem("p", "resolve", "Lisinopril-induced cough", "R05") });
    expect(run([p]).allergies[0]).toMatchObject({ reaction_type: "side_effect", mechanism: "non_immune" });
    expect(run([p, item("a", "2024-01-01", { a: allergy("a", "inactivate", "lisinopril", ["Cough"]) })]).allergies).toEqual([]);
  });
  test("a treatment mentioned in a diagnosis does not become its cause", () => {
    expect(run([item("p", "2024-01-01", { p: problem("p", "add", "CKD due to diabetes, treated with losartan", "N18.3") })]).allergies).toEqual([]);
  });
  test("an adverse-effect T code with no condition yields only an avoidance row", () => {
    const rows = run([item("p", "2024-01-01", { p: problem("p", "add", "Adverse effect of empagliflozin", "T38.3X5A") })]);
    expect(rows.problems).toEqual([]);
    expect(rows.allergies[0].substance).toBe("empagliflozin");
    expect(rows.allergies[0].criticality).toBe("unknown");
  });
});

describe("labs and vitals", () => {
  test("nonnumeric correction removes the prior number, but a redraw survives", () => {
    const first = item("a", "2023-04-01", { k: lab("K", "6.7", "mmol/L") });
    const correction = item("b", "2023-04-01", { k: lab("K", "Result invalidated", "mmol/L", { result_status: "C" }) }, { recorded: "2023-04-02T12:00:00-05:00", supersedes: ["a"] });
    const repeat = item("c", "2023-04-02", { k: lab("K", "4.4", "mmol/L", { external_ref: { lab: "Lakeview Labs", accession: "B", result_code: "LK-K" } }) });
    expect(run([first, correction], "2023-04-01").labs[0].value).toBe(6.7);
    expect(run([correction, repeat, first]).labs.map(r => r.value)).toEqual([4.4]);
    const unlinked = { ...correction, supersedes: undefined };
    expect(run([first, unlinked]).labs).toEqual([]);
  });
  test("most advanced lab copy wins over a later duplicate preliminary", () => {
    const f = item("f", "2023-04-01", { k: lab("K", "4.5", "mmol/L") });
    const p = item("p", "2023-04-02", { k: lab("K", "4.4", "mmol/L", { result_status: "P" }) });
    expect(run([p, f]).labs[0]).toMatchObject({ value: 4.5, status: "final" });
  });
  test("converts cell counts and comparators, and does not require LOINC", () => {
    const rows = run([item("l", "2023-04-01", {
      p: lab("PLT", "212000", "cells/uL"), w: lab("WBC", ">=11000", "cells/uL"),
      t: lab("TROPI", "<0.01", "ng/mL"), h: lab("PH", "7.4", ""),
      bad: lab("TSH", "2.0", "mIU/L"), text: lab("NA", "Hemolyzed", "mmol/L"),
    })]).labs;
    expect(rows).toHaveLength(4);
    expect(rows.find(r => r.analyte === "platelets")).toMatchObject({ value: 212, unit: "10*3/uL" });
    expect(rows.find(r => r.analyte === "wbc")).toMatchObject({ value: 11, comparator: ">=" });
    expect(rows.find(r => r.analyte === "troponin")).toMatchObject({ value: 0.01, comparator: "<" });
    expect(rows.find(r => r.analyte === "ph")).toMatchObject({ value: 7.4, unit: "[pH]" });
  });
  test("eGFR excludes race coefficients, preserves calculations, and trusts method notes", () => {
    const rows = run([item("l", "2023-04-01", {
      n: lab("EGFR-NAA", "50", "mL/min/1.73m2", { comment: "Calculated by CKD-EPI 2009." }),
      a: lab("EGFR-AA", "58", "mL/min/1.73m2", { comment: "Calculated by CKD-EPI 2009." }),
      m: lab("EGFR-MDRD", "48", "mL/min/1.73m2"),
      c: lab("EGFR21", "53", "mL/min/1.73m2"),
    })]).labs;
    expect(rows.map(r => r.value).sort()).toEqual([48, 50, 53]);
    expect(rows.map(r => r.egfr_equation).sort()).toEqual(["ckd-epi-2009", "ckd-epi-2021", "mdrd"]);
    const override = run([item("l", "2023-04-01", { n: lab("EGFR09N", "51", "mL/min/1.73m2", { comment: "Calculated using the CKD-EPI 2021 equation." }) })]);
    expect(override.labs[0].egfr_equation).toBe("ckd-epi-2021");
  });
  test("vitals preserve repeat readings, convert weight, and handle zone-less local time", () => {
    const rows = run([
      item("a", "2024-07-01T00:30:00Z", { v: { type: "vital_set", bp: "152/94", bp_repeat: "140/88", weight_lb: 200, pulse_bpm: 71 } }),
      item("b", "2024-07-01T09:14:20", { v: { type: "vital_set", bp: "120/80" } }),
    ]).vitals;
    expect(rows[0]).toMatchObject({ local_time: "2024-06-30T19:30", systolic_mmhg: 152, repeat_systolic_mmhg: 140, weight_kg: 90.7 });
    expect(rows[1].local_time).toBe("2024-07-01T09:14");
  });
  test("unsupported or malformed fields do not create invented rows", () => {
    const malformed = [null, false, 0, "x", {}, { id: "x", issuer: "s", recorded: "nonsense" },
      item("a", "2024-01-01", { bad: null, bad2: [], m: { type: "med_event" }, p: { type: "problem_event" }, a: { type: "allergy_event" }, l: { type: "imported_result" }, v: { type: "vital_set", bp: "bad", weight_lb: "10" } }),
    ] as FolioItem[];
    expect(run(malformed)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
    expect(transform(null as unknown as FolioItem[], "bad").medications).toEqual([]);
    const badText = { toString: 0, valueOf: 0 };
    expect(() => run([item("bad", "2024-01-01", {
      m: med("m", badText as unknown as string),
      p: problem("p", badText as unknown as string, "Example", "x"),
      l: lab("unrecognized", "1", "mg/dL", { test: { loinc: "constructor" } }),
      e: lab("EGFR", "50", "mL/min/1.73m2", { comment: badText, test: { nfm_code: "EGFR", name: badText } }),
    })])).not.toThrow();
  });
  test("input order and payload insertion order do not change results; input is unmodified", () => {
    const a = item("a", "2024-01-01", { z: med("m", "start"), a: problem("p", "add", "Hypertension", "I10") });
    const b = item("b", "2024-01-02", { m: med("m", "change") });
    const before = JSON.stringify([a, b]);
    expect(run([a, b])).toEqual(run([b, { ...a, payload: { a: a.payload.a, z: a.payload.z } }]));
    expect(JSON.stringify([a, b])).toBe(before);
  });
});
