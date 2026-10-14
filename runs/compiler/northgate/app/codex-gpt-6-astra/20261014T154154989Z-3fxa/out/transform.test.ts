import { test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";
import samples from "../in/samples/samples.json";

const item = (id: string, effective: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem => ({
  folio: "0.1", id, issuer: "northgate", patient: "p", effective,
  recorded: effective.length === 10 ? effective + "T12:00:00-06:00" : effective,
  narrative: "", payload, ...extra,
});
const med = (action: string, extra: Record<string, unknown> = {}) => ({ type: "med_event", med_id: "m", action,
  origin: "northgate", drug: { name: "metformin hydrochloride 500 MG Oral Tablet", rxnorm: "product-code" },
  dose: { value: 2, unit: "tab" }, frequency: "BID", ...extra });
const problem = (action: string, extra: Record<string, unknown> = {}) => ({ type: "problem_event", problem_id: "p", action,
  description: "Chronic kidney disease stage 3a", icd10cm: "N18.31", ...extra });
const allergy = (action: string, extra: Record<string, unknown> = {}) => ({ type: "allergy_event", allergy_id: "a", action,
  substance: { name: "Lisinopril", rxnorm: "29046" }, reaction_type: "intolerance", reactions: ["Cough"], severity: "low", ...extra });
const lab = (code: string, value: string, unit: string, extra: Record<string, unknown> = {}) => ({ type: "imported_result",
  test: { nfm_code: code, name: code }, value, unit, result_status: "F", collected: "2025-01-01T08:00:00-06:00",
  resulted: "2025-01-01T09:00:00-06:00", external_ref: { lab: "Lakeview Labs", accession: "a", result_code: code }, ...extra });
const run = (items: FolioItem[], asOf = "2026-10-13") => transform(items, asOf);

test("sample evidence, correction, explicit list, referral fallback, and insulin packaging", () => {
  const r = run(samples[0].items as FolioItem[]);
  expect(r.medications).toHaveLength(1);
  expect(r.medications[0]).toMatchObject({ ingredient: "insulin glargine", dose: { value: 10, unit: "units" }, status: "active" });
  expect(r.medications[0]).not.toHaveProperty("rxnorm_ingredient");
  expect(r.labs.map(x => x.analyte)).toEqual(["creatinine", "egfr", "sodium"]);
  expect(r.labs[1]).toMatchObject({ value: 61, egfr_equation: "ckd-epi-2009" });
  expect(r.problems.find(x => x.icd10cm === "I10")?.onset).toEqual({ value: "2010-11", precision: "month" });
  expect(r.vitals[0].weight_kg).toBe(86.5);
  expect(run(samples[2].items as FolioItem[]).allergies[0]).toMatchObject({ substance: "lisinopril", reaction_type: "side_effect", mechanism: "non_immune" });
});
test("input order and payload key order do not affect the output", () => {
  const original = samples[0].items as FolioItem[], before = JSON.stringify(original);
  const reordered = original.slice().reverse().map(x => ({ ...x, payload: Object.fromEntries(Object.entries(x.payload).reverse()) }));
  expect(run(reordered)).toEqual(run(original));
  expect(JSON.stringify(original)).toBe(before);
});
test("recorded Chicago date controls cutoff, including end-of-day milliseconds", () => {
  const events = [
    item("a", "2027-01-01", { m: med("start") }, { recorded: "2025-03-04T05:59:59.999Z" }),
    item("b", "2027-02-01", { m: med("hold") }, { recorded: "2025-03-04T06:00:00Z" }),
  ];
  expect(run(events, "2025-03-03").medications[0]).toMatchObject({ status: "active", status_since: "2027-01-01" });
  expect(run(events, "2025-03-04").medications[0].status).toBe("held");
});
test("summer cutoff uses daylight time", () => {
  const a = item("a", "2025-07-01", { m: med("start") }, { recorded: "2025-07-02T04:59:59Z" });
  const b = item("b", "2025-07-02", { m: med("stop") }, { recorded: "2025-07-02T05:00:00Z" });
  expect(run([b, a], "2025-07-01").medications[0].status).toBe("active");
});
test("replay is by effective time, not arrival time", () => {
  const start = item("start", "2025-01-01", { m: med("start") }, { recorded: "2025-03-01T12:00:00-06:00" });
  const hold = item("hold", "2025-02-01", { m: med("hold") });
  expect(run([hold, start]).medications[0]).toMatchObject({ status: "held", status_since: "2025-02-01" });
});
test("holds do not expire; reviews neither clear nor refresh lines", () => {
  const hold = item("hold", "2020-01-01", { m: med("hold", { review_on: "2020-01-15", origin: "outside" }) });
  const review = item("review", "2026-01-01", { r: { type: "list_reviewed", list: "medications", lines_on_list: [] } });
  const r = run([hold, review]).medications[0];
  expect(r).toMatchObject({ status: "held", status_since: "2020-01-01", patient_reported: false });
  expect(r.evidence).toEqual([{ item_id: "hold", entry_id: "m" }]);
});
test("change retains start/resume date and uses the current dose", () => {
  const events = [item("start", "2020-01-01", { m: med("start") }), item("hold", "2021-01-01", { m: med("hold") }),
    item("resume", "2022-01-01", { m: med("resume") }), item("change", "2023-01-01", { m: med("change", { dose: { value: 500, unit: "mg" } }) })];
  expect(run(events).medications[0]).toMatchObject({ status: "active", status_since: "2022-01-01", dose: { value: 500, unit: "mg" },
    evidence: [{ item_id: "resume", entry_id: "m" }, { item_id: "change", entry_id: "m" }] });
  expect(run([events[3]]).medications[0]).not.toHaveProperty("status_since");
});
test("same ingredient, latest line's own event wins; void restores prior actual line", () => {
  const a = item("a", "2020-01-01", { m: med("start") });
  const b = item("b", "2021-01-01", { m: med("start", { med_id: "m2", drug: { name: "Glucophage 500 mg" } }) });
  const c = item("c", "2022-01-01", { m: med("stop", { stop_reason: "adverse_reaction", reason_text: "Nausea" }) });
  const v = item("v", "2023-01-01", {}, { retracts: ["c"] });
  expect(run([b, a, c]).medications).toHaveLength(1);
  expect(run([b, a, c]).medications[0]).toMatchObject({ status: "stopped", stop_reason: "adverse_reaction" });
  expect(run([b, a, c, v]).medications[0].evidence[0].item_id).toBe("b");
  expect(run([a, c]).allergies).toEqual([]); // A stop reason alone is not an allergy entry or diagnosis.
});
test("future supersession does not apply; transitive replacement replaces whole items", () => {
  const a = item("a", "2020-01-01", { m: med("start"), p: problem("add") });
  const b = item("b", "2020-01-01", { m: med("hold") }, { recorded: "2021-01-01T08:00:00-06:00", supersedes: ["a"] });
  const c = item("c", "2020-01-01", { m: med("stop") }, { recorded: "2022-01-01T08:00:00-06:00", supersedes: ["b"] });
  expect(run([a, b, c], "2020-12-31").medications[0].status).toBe("active");
  expect(run([a, b, c], "2021-12-31").problems).toEqual([]);
  expect(run([c, a, b]).medications[0].status).toBe("stopped");
});
test("ingredient code is only copied from ingredient-level allergy codes", () => {
  const r = run([item("x", "2025-01-01", { m: med("start", { drug: { name: "Jardiance 10 mg", outside_code: { system: "outside", code: "x" } } }), a: allergy("add") })]);
  expect(r.medications[0].ingredient).toBe("empagliflozin");
  expect(r.medications[0]).not.toHaveProperty("rxnorm_ingredient");
  expect(r.allergies[0].rxnorm_ingredient).toBe("29046");
});
test("tablet strengths, unknown strengths, ranges, and weekly OTHER instructions", () => {
  const r = run([item("m", "2025-01-01", {
    a: med("start", { med_id: "a", drug: { name: "famotidine 10 mg tablet" } }),
    b: med("start", { med_id: "b", drug: { name: "prednisone" }, dose: { value: 1, unit: "tab" } }),
    c: med("start", { med_id: "c", drug: { name: "semaglutide 2 mg/mL solution" }, dose: undefined, sig: "Sliding scale", frequency: "OTHER" }),
    d: med("start", { med_id: "d", drug: { name: "dulaglutide 0.75 mg" }, dose: { value: 0.75, unit: "mg" }, frequency: "OTHER", sig: "Inject once weekly" }),
  })]).medications;
  expect(r.find(x => x.ingredient === "famotidine")?.dose).toEqual({ value: 20, unit: "mg" });
  expect(r.find(x => x.ingredient === "prednisone")?.dose).toEqual({ value: 1, unit: "tablet" });
  expect(r.find(x => x.ingredient === "semaglutide")).not.toHaveProperty("dose");
  expect(r.find(x => x.ingredient === "dulaglutide")?.frequency).toBe("QW");
});
test("CKD restaging is explicit, not calculated from lab results or list review", () => {
  const r = run([item("a", "2020-01-01", { p: problem("add") }),
    item("b", "2021-01-01", { p: problem("update", { description: "CKD G3b A2", icd10cm: "N18.32", onset: { date: "2016-01-01", precision: "year" } }) }),
    item("c", "2022-01-01", { l: lab("EGFR21", "19", "mL/min/1.73m2"), r: { type: "list_reviewed", list: "problems", lines_on_list: ["p"] } })]);
  expect(r.problems).toHaveLength(1);
  expect(r.problems[0]).toMatchObject({ ckd_stage: "G3b", albuminuria: "A2", onset: { value: "2016", precision: "year" } });
});
test("resolved rows remain, removed rows and billing diagnoses do not", () => {
  const history = [item("a", "2020-01-01", { p: problem("add") }), item("b", "2021-01-01", { p: problem("resolve") })];
  expect(run(history).problems[0].status).toBe("resolved");
  const remove = item("c", "2022-01-01", { p: problem("remove"), b: { type: "billing_dx", icd10cm: "F32.9", display: "Depression" },
    r: { type: "referral_dx", referral_id: "r", icd10cm: "N18.31", display: "Chronic kidney disease" } });
  expect(run([...history, remove]).problems).toEqual([]);
});
test("sensitivity never suppresses restricted conditions or medications", () => {
  const r = run([item("s", "2025-01-01", { p: problem("add", { description: "Depression", icd10cm: "F32.9", restricted: "BH" }),
    m: med("start", { drug: { name: "sertraline 50 mg" }, restricted: "BH" }) })]);
  expect(r.problems[0].sensitivity).toEqual(["mental-health"]);
  expect(r.medications[0].sensitivity).toEqual(["mental-health"]);
});
test("allergy reaction and mechanism are separate, and inactivation removes an entry", () => {
  const a = item("a", "2020-01-01", { a: allergy("add", { reaction_type: "adverse_reaction", reactions: ["Angioedema"], severity: "high" }) });
  expect(run([a]).allergies[0]).toMatchObject({ reaction_type: "hypersensitivity", mechanism: "non_immune", criticality: "high" });
  const b = item("b", "2021-01-01", { a: allergy("inactivate") });
  expect(run([a, b]).allergies).toEqual([]);
});
test("source explicitly immune, serious nonimmune harm, and non-drug substance spelling", () => {
  const r = run([item("a", "2025-01-01", {
    a: allergy("add", { substance: { name: "Peanut" }, reactions: ["Hives", "Lip swelling"], reaction_type: "allergy", severity: "high" }),
    b: allergy("add", { allergy_id: "b", substance: { name: "empagliflozin", rxnorm: "1545653" }, reactions: ["Ketoacidosis"], reaction_type: "adverse_reaction", severity: "high" }),
  })]).allergies;
  expect(r[0]).toMatchObject({ substance: "Peanut", reaction: "Hives; Lip swelling", mechanism: "immune" });
  expect(r[1]).toMatchObject({ reaction_type: "serious_adverse_event", mechanism: "non_immune" });
});
test("drug-attributed problems produce avoidance rows; disease causes do not", () => {
  const r = run([item("a", "2025-01-01", {
    p: problem("add", { description: "Urticaria due to amoxicillin", icd10cm: "L50.0" }),
    c: problem("add", { problem_id: "c", description: "Chronic kidney disease due to diabetes", icd10cm: "N18.4" }),
  })]);
  expect(r.problems).toHaveLength(2);
  expect(r.allergies).toHaveLength(1);
  expect(r.allergies[0]).toMatchObject({ substance: "amoxicillin", reaction: "Urticaria", reaction_type: "hypersensitivity", mechanism: "unknown" });
});
test("bare drug adverse-effect diagnosis only gives an allergy row, with class kept", () => {
  const r = run([item("a", "2025-01-01", { p: problem("add", { description: "Adverse effect of penicillins", icd10cm: "T36.0X5A" }) })]);
  expect(r.problems).toEqual([]);
  expect(r.allergies[0].substance).toBe("penicillins");
});
test("count units, comparators, supported analytes without LOINC, and unsupported tests", () => {
  const r = run([item("a", "2025-01-01", {
    p: lab("PLT", "212000", "cells/uL"), w: lab("WBC", "7500", "cells/uL"), k: lab("K", ">6.5", "mmol/L"),
    u: lab("UACR", "456", "mg/g"), alt: lab("ALT", "35", "U/L"), invalid: lab("CREAT", "Hemolyzed", "mg/dL"),
  })]).labs;
  expect(r.find(x => x.analyte === "platelets")?.value).toBe(212);
  expect(r.find(x => x.analyte === "wbc")?.value).toBe(7.5);
  expect(r.find(x => x.analyte === "potassium")).toMatchObject({ value: 6.5, comparator: ">" });
  expect(r).toHaveLength(4);
});
test("final copy wins over preliminary; corrected invalidation wins before number parsing", () => {
  const p = item("p", "2025-01-01", { l: lab("K", "6.5", "mmol/L", { result_status: "P" }) });
  const f = item("f", "2025-01-02", { l: lab("K", "6.1", "mmol/L") });
  const c = item("c", "2025-01-03", { l: lab("K", "Result invalidated", "mmol/L", { result_status: "C" }) });
  expect(run([f, p]).labs[0]).toMatchObject({ value: 6.1, status: "final", evidence: [{ item_id: "p", entry_id: "l" }, { item_id: "f", entry_id: "l" }] });
  expect(run([c, f, p]).labs).toEqual([]);
});
test("hemolysis caution alone does not withdraw a numeric result; redraw is separate", () => {
  const a = item("a", "2025-01-01", { l: lab("K", "6.5", "mmol/L", { comment: "Specimen hemolyzed; may be falsely elevated. Recollect." }) });
  const b = item("b", "2025-01-01", { l: lab("K", "4.2", "mmol/L", { external_ref: { lab: "Lakeview Labs", accession: "b", result_code: "K" } }) });
  expect(run([a, b]).labs.map(x => x.value)).toEqual([6.5, 4.2]);
});
test("eGFR series spans codes; discard only the race variant of the same calculation", () => {
  const r = run([item("a", "2025-01-01", {
    n: lab("EGFR-NAA", "50", "mL/min/1.73m2", { comment: "Calculated by CKD-EPI 2009. Report African American value when applicable." }),
    a: lab("EGFR-AA", "60", "mL/min/1.73m2", { comment: "Calculated by CKD-EPI 2009. Report African American value when applicable." }),
    m: lab("EGFR-MDRD", "49", "mL/min/1.73m2", { comment: "MDRD" }),
    x: lab("EGFR21", ">90", "mL/min/1.73m2", { comment: "CKD-EPI 2021 race-free" }),
  })]).labs;
  expect(r).toHaveLength(3);
  expect(r.map(x => x.value).sort((a, b) => a - b)).toEqual([49, 50, 90]);
  expect(r.find(x => x.value === 90)).toMatchObject({ comparator: ">", egfr_equation: "ckd-epi-2021" });
});
test("time conversion and source precision are independent of the runtime timezone", () => {
  const r = run([item("a", "2025-03-04T03:30:00Z", { v: { type: "vital_set", bp: "152/94", bp_repeat: "140/88", pulse_bpm: 77, weight_lb: 154 } }),
    item("b", "2025-07-01T08:15:00", { l: lab("K", "4.2", "mmol/L", { collected: "2025-07-01T08:15:00" }) })]);
  expect(r.vitals[0]).toMatchObject({ local_time: "2025-03-03T21:30", repeat_systolic_mmhg: 140, repeat_diastolic_mmhg: 88, weight_kg: 69.9 });
  expect(r.labs[0].collected).toBe("2025-07-01T08:15:00-05:00");
});
test("source-only narrative never creates a row", () => {
  expect(run([item("a", "2025-01-01", { v: { type: "visit", visit_id: "v", visit_type: "office", reason: "Follow-up" } },
    { narrative: "Patient takes metformin 500 mg. Has CKD stage 4 and diabetes. A1c 8.3. BP 160/90." })]))
    .toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});
test("malformed values and unknown entry types do not throw or supply invalid rows", () => {
  const rubbish = [null, false, 1, [], {}, { id: "x", recorded: "bad" }, item("a", "2025-01-01", {
    a: null, b: { type: "future_type" }, c: med("invalid"), d: med("start", { drug: null }),
    e: lab("unknown", "1", "?", { test: { loinc: "constructor", name: null } }),
    f: { type: "vital_set", bp: 123, pulse_bpm: "bad", weight_lb: Infinity },
    g: allergy("add", { substance: null }),
  })];
  expect(() => run(rubbish as FolioItem[])).not.toThrow();
  expect(() => transform(null as unknown as FolioItem[], "2025-01-01")).not.toThrow();
  expect(run(rubbish as FolioItem[])).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});
test("explicit combination strengths are assigned to their respective ingredients", () => {
  const r = run([item("a", "2025-01-01", { m: med("start", { drug: { name: "Janumet 50/1000 mg tablet" }, dose: { value: 1, unit: "tab" } }) })]);
  expect(r.medications).toHaveLength(2);
  expect(r.medications.find(x => x.ingredient === "metformin")?.dose).toEqual({ value: 1000, unit: "mg" });
  expect(r.medications.find(x => x.ingredient === "sitagliptin")?.dose).toEqual({ value: 50, unit: "mg" });
});
test("a named drug in a drug-class adverse diagnosis is retained", () => {
  const r = run([item("a", "2025-01-01", { p: problem("add", { description: "Euglycemic DKA due to SGLT2 inhibitor (empagliflozin)", icd10cm: "E11.10" }) })]);
  expect(r.allergies[0]).toMatchObject({ substance: "empagliflozin", reaction_type: "serious_adverse_event", mechanism: "non_immune" });
});
test("source OTC designation is kept without inferring it from the ingredient", () => {
  const r = run([item("a", "2025-01-01", { m: med("start", { drug: { name: "OTC ibuprofen 200 mg tablet" } }) })]);
  expect(r.medications[0]).toMatchObject({ ingredient: "ibuprofen", otc: true, dose: { value: 400, unit: "mg" } });
});
