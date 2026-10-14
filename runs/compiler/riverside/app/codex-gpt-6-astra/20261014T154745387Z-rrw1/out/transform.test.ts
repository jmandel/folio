import { describe, expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const asOf = "2025-12-31";
function doc(id: string, payload: Record<string, unknown>, options: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "riverside", patient: "p", narrative: "",
    recorded: "2025-04-02T15:00:00Z", effective: "2025-04-02T14:00:00Z",
    payload: { enc: { type: "encounter", encounter_id: "stay", document_kind: "hp", class: "inpatient", service: "Medicine", arrived: "2025-04-01T15:00:00Z" }, ...payload }, ...options };
}
const med = (status = "continue", extra = {}) => ({ type: "home_med", drug_name: "metformin 1000 mg tablet", rxnorm_ingredient: "6809", dose_text: "1000 mg", sig: "1 tablet BID", status, ...extra });
const dx = (label = "Acute kidney injury", status = "active", extra = {}) => ({ type: "diagnosis", label, status, ...extra });
const lab = (extra = {}) => ({ type: "result", test: { local_code: "CREAT", name: "Creatinine", loinc: "2160-0" }, accession: "accession", collected: "2025-04-01T16:00:00Z", specimen: "serum", status: "final", value: "1.2", unit: "mg/dL", ...extra });
const vital = (extra = {}) => ({ type: "vitals", taken: "2025-04-01T16:00:00Z", bp: { systolic_mmhg: 120, diastolic_mmhg: 80 }, heart_rate_bpm: 70, weight_kg: 65.25, ...extra });

describe("as-of and envelope replacement", () => {
  test("Chicago day ends at local midnight, independently of effective", () => {
    const a = doc("a", { d: dx() }, { recorded: "2025-07-02T04:59:59.999Z", effective: "2000-01-01" });
    const b = doc("b", { d: dx("Hyperkalemia") }, { recorded: "2025-07-02T05:00:00Z" });
    expect(transform([a, b], "2025-07-01").problems.map(p => p.condition)).toEqual(["Acute kidney injury"]);
    expect(transform([doc("w", { d: dx() }, { recorded: "2025-01-02T05:59:59Z" })], "2025-01-01").problems).toHaveLength(1);
    expect(transform([doc("w", { d: dx() }, { recorded: "2025-01-02T06:00:00Z" })], "2025-01-01").problems).toHaveLength(0);
  });
  test("offsetless recorded is local, and effective is not a cutoff", () => {
    const a = doc("a", { d: dx() }, { recorded: "2025-04-01T23:59:59", effective: "2026-01-01" });
    expect(transform([a], "2025-04-01").problems).toHaveLength(1);
  });
  test("future supersession has no effect until recorded; entire payload replaced", () => {
    const a = doc("a", { d: dx(), m: med(), l: lab() });
    const b = doc("b", { d: dx("Hyperkalemia") }, { supersedes: ["a"], recorded: "2025-04-03T15:00:00Z" });
    expect(transform([b, a], "2025-04-02").medications).toHaveLength(1);
    const r = transform([a, b], "2025-04-03");
    expect(r.problems.map(p => p.condition)).toEqual(["Hyperkalemia"]);
    expect(r.medications).toEqual([]); expect(r.labs).toEqual([]);
  });
  test("transitive supersession and retraction do not resurrect replaced versions", () => {
    const a = doc("a", { d: dx() });
    const b = doc("b", { d: dx("Hyperkalemia") }, { supersedes: ["a"], recorded: "2025-04-03T15:00:00Z" });
    const c = doc("c", { d: dx("Hypertension") }, { supersedes: ["b"], recorded: "2025-04-04T15:00:00Z" });
    const r = doc("r", {}, { retracts: ["c"], recorded: "2025-04-05T15:00:00Z" });
    expect(transform([c, b, a], asOf).problems.map(p => p.condition)).toEqual(["Hypertension"]);
    expect(transform([c, b, r, a], asOf).problems).toEqual([]);
  });
  test("retraction IDs are issuer scoped", () => {
    const a = doc("a", { d: dx() });
    const b = doc("b", {}, { issuer: "another", retracts: ["a"] });
    expect(transform([a, b], asOf).problems).toHaveLength(1);
  });
});

describe("home medication snapshots", () => {
  test("latest discharge is authoritative within stay; later consult cannot override it", () => {
    const hp = doc("hp", { m: med("held"), other: med("continue", { drug_name: "losartan", rxnorm_ingredient: "52175" }) });
    const dc = doc("dc", { enc: { type: "encounter", encounter_id: "stay", document_kind: "discharge_summary", arrived: "2025-04-01T15:00:00Z", discharged: "2025-04-04T15:00:00Z" }, renamed: med("continue") }, { recorded: "2025-04-04T20:00:00Z", effective: "2025-04-01T16:00:00Z" });
    const late = doc("late", { m: med("held") }, { recorded: "2025-04-05T15:00:00Z" });
    const r = transform([late, dc, hp], asOf).medications;
    expect(r).toHaveLength(1); expect(r[0].status).toBe("active"); expect(r[0].status_since).toBe("2025-04-04");
    expect(r[0].evidence.some(e => e.item_id === "dc")).toBe(true);
  });
  test("new encounter supersedes an older discharge snapshot", () => {
    const old = doc("old", { m: med("continue"), enc: { type: "encounter", encounter_id: "old", document_kind: "discharge_summary", arrived: "2024-01-01T00:00:00Z" } }, { recorded: "2024-01-03T00:00:00Z" });
    const current = doc("current", { m: med("held", { restart_advice: "advise_against" }) });
    expect(transform([old, current], asOf).medications[0].status).toBe("held");
  });
  test("hospital-only drugs excluded and not reconciled means unknown", () => {
    const a = doc("a", { m: med("not_reconciled"), insulin: { type: "inpatient_med", drug_name: "insulin glargine", dose_text: "18 units", route: "SubQ" } });
    const r = transform([a], asOf).medications;
    expect(r).toHaveLength(1); expect(r[0].status).toBe("unknown"); expect(r[0].status_since).toBeUndefined(); expect(r[0].patient_reported).toBe(false);
  });
  test("snapshot absence removes drug and entry keys never link medications", () => {
    const a = doc("a", { same_key: med("held") });
    const b = doc("b", { same_key: med("new", { drug_name: "losartan 25 mg", rxnorm_ingredient: "52175", dose_text: "25 mg" }) }, { recorded: "2025-04-03T15:00:00Z" });
    const r = transform([a, b], asOf).medications;
    expect(r).toHaveLength(1); expect(r[0].ingredient).toBe("losartan");
  });
  test("continued drug does not gain a fabricated start date", () => {
    expect(transform([doc("a", { m: med() })], asOf).medications[0].status_since).toBeUndefined();
  });
  test("same status change in directions has a new event date", () => {
    const a = doc("a", { m: med() });
    const b = doc("b", { m: med("changed", { sig: "1 tablet daily" }) }, { recorded: "2025-04-03T15:00:00Z", effective: "2025-04-03" });
    const r = transform([a, b], asOf).medications[0];
    expect(r.status_since).toBe("2025-04-03"); expect(r.frequency).toBe("QD");
  });
  test("per-administration dose is not multiplied again by the tablet count", () => {
    const r = transform([doc("a", { m: med("continue", { drug_name: "metformin 500 mg tablet", dose_text: "1000 mg", sig: "2 tablets twice daily" }) })], asOf).medications[0];
    expect(r.dose).toEqual({ value: 1000, unit: "mg" }); expect(r.frequency).toBe("BID");
  });
  test("tablet-only amount uses unit strength, brands normalize", () => {
    const r = transform([doc("a", { m: med("continue", { drug_name: "Pepcid 10 mg tablet", rxnorm_ingredient: undefined, dose_text: "2 tablets", sig: "2 tablets nightly" }) })], asOf).medications[0];
    expect(r.ingredient).toBe("famotidine"); expect(r.dose).toEqual({ value: 20, unit: "mg" }); expect(r.rxnorm_ingredient).toBeUndefined();
  });
  test("range and weight-dependent doses omitted; PRN beats a regular interval", () => {
    const a = doc("a", { m: med("continue", { dose_text: "1–2 tablets", sig: "every 6 hours as needed" }) });
    const r = transform([a], asOf).medications[0];
    expect(r.dose).toBeUndefined(); expect(r.frequency).toBe("PRN");
    a.payload.m.dose_text = "10 mg/kg"; a.payload.m.sig = "daily";
    expect(transform([a], asOf).medications[0].dose).toBeUndefined();
  });
  test("stopped reason only when stated, and never on held rows", () => {
    const a = doc("a", { m: med("stopped", { instructions: "Stopped because of rash" }) });
    expect(transform([a], asOf).medications[0].stop_reason).toBe("adverse_reaction");
    a.payload.m.status = "held";
    expect(transform([a], asOf).medications[0].stop_reason).toBeUndefined();
  });
});

describe("conditions and reactions", () => {
  test("working, ruled out and silently dropped working diagnoses are not conditions", () => {
    const a = doc("a", { a: dx("Pancreatitis", "working"), b: dx("Pneumonia", "ruled_out") });
    const b = doc("b", {}, { recorded: "2025-04-03T15:00:00Z" });
    expect(transform([a, b], asOf).problems).toEqual([]);
  });
  test("latest resolved diagnosis wins without using lab values", () => {
    const a = doc("a", { d: dx("Hyperkalemia", "active", { icd10cm: "E87.5" }) });
    const b = doc("b", { d: dx("Hyperkalemia", "resolved", { icd10cm: "E87.5" }), l: lab({ test: { local_code: "K", name: "Potassium" }, value: "6.5", unit: "mmol/L" }) }, { recorded: "2025-04-03T15:00:00Z" });
    expect(transform([a, b], asOf).problems[0].status).toBe("resolved");
  });
  test("CKD restaging beats stale copied history; retain precision without inventing onset", () => {
    const a = doc("a", { h: { type: "history", condition: "CKD stage 3a", icd10cm: "N18.31", onset_text: "2016", source: "patient" } });
    const b = doc("b", { d: dx("Chronic kidney disease G3b A2", "active", { icd10cm: "N18.32" }) }, { recorded: "2025-04-03T15:00:00Z" });
    const c = doc("c", { h: a.payload.h }, { recorded: "2025-04-04T15:00:00Z" });
    const r = transform([c, b, a], asOf).problems;
    expect(r).toHaveLength(1); expect(r[0].condition).toBe("Chronic kidney disease G3b A2");
    expect(r[0].ckd_stage).toBe("G3b"); expect(r[0].albuminuria).toBe("A2"); expect(r[0].onset).toEqual({ value: "2016", precision: "year" });
    a.payload.h.onset_text = "~10 years"; c.payload.h.onset_text = "~10 years";
    expect(transform([c, b, a], asOf).problems[0].onset).toBeUndefined();
  });
  test("same condition recoded merges; different local codes sharing ICD remain distinct", () => {
    const a = doc("a", { d: dx("Asthma, mild intermittent", "active", { icd10cm: "J45.20" }) });
    const b = doc("b", { d: dx("Moderate persistent asthma", "active", { icd10cm: "J45.40" }) }, { recorded: "2025-04-03T15:00:00Z" });
    const r = transform([a, b], asOf).problems;
    expect(r).toHaveLength(1); expect(r[0].icd10cm).toBe("J45.40");
    a.payload.d = dx("DKA", "resolved", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-1", name: "DKA" } });
    b.payload.d = dx("Euglycemic DKA", "active", { icd10cm: "E11.10", riverside_dx: { code: "RRH-DX-2", name: "Euglycemic DKA" } });
    expect(transform([a, b], asOf).problems).toHaveLength(2);
  });
  test("explicit month-name onset keeps month precision", () => {
    const a = doc("a", { h: { type: "history", condition: "Hypertension", onset_text: "June 2019", source: "outside_records" } });
    expect(transform([a], asOf).problems[0].onset).toEqual({ value: "2019-06", precision: "month" });
    a.payload.h.onset_text = "childhood";
    expect(transform([a], asOf).problems[0].onset).toBeUndefined();
  });
  test("class-attributed injury resolves to the sole matching drug in the same item", () => {
    const a = doc("a", { d: dx("Euglycemic DKA, SGLT2 inhibitor-associated", "resolved"), m: med("held", { drug_name: "empagliflozin 10 mg tablet", rxnorm_ingredient: "1545653" }) });
    const r = transform([a], asOf);
    expect(r.problems).toHaveLength(1); expect(r.allergies[0]).toMatchObject({ substance: "empagliflozin", rxnorm_ingredient: "1545653", reaction_type: "serious_adverse_event", mechanism: "non_immune", criticality: "high" });
    expect(r.allergies[0].evidence).toContainEqual({ item_id: "a", entry_id: "m" });
    a.payload.other = med("held", { drug_name: "dapagliflozin", rxnorm_ingredient: undefined });
    expect(transform([a], asOf).allergies[0].substance).toBe("SGLT2 inhibitor");
  });
  test("pure adverse-effect code yields only allergy; named reaction also yields condition", () => {
    const a = doc("a", { d: dx("Adverse effect of penicillins", "active", { icd10cm: "T36.0X5A" }), m: med("stopped", { drug_name: "amoxicillin 500 mg", rxnorm_ingredient: "723" }) });
    expect(transform([a], asOf).problems).toHaveLength(0);
    expect(transform([a], asOf).allergies[0].substance).toBe("amoxicillin");
    a.payload.d = dx("Urticaria due to amoxicillin", "resolved", { icd10cm: "L50.0" });
    const r = transform([a], asOf);
    expect(r.problems).toHaveLength(1); expect(r.allergies[0].reaction_type).toBe("hypersensitivity"); expect(r.allergies[0].mechanism).toBe("unknown");
  });
  test("reaction meaning, not source list name, determines reaction type", () => {
    const a = doc("a", { a: { type: "allergy", substance: "lisinopril", rxnorm_ingredient: "29046", reaction: "cough", severity: "mild" } });
    expect(transform([a], asOf).allergies[0]).toMatchObject({ reaction_type: "side_effect", mechanism: "non_immune", criticality: "low" });
    const b = doc("b", { a: { type: "allergy", substance: "NKDA" } }, { recorded: "2025-04-03T15:00:00Z" });
    expect(transform([a, b], asOf).allergies).toEqual([]);
  });
  test("a treated condition is not a drug-attributed injury", () => {
    const a = doc("a", { d: dx("Type 2 diabetes on metformin"), m: med() });
    expect(transform([a], asOf).allergies).toEqual([]);
    a.payload.a = { type: "allergy", substance: "amlodipine", reaction: "ankle swelling", severity: "mild" };
    expect(transform([a], asOf).allergies[0].reaction_type).toBe("side_effect");
  });
  test("sensitive conditions and medicines retained and tagged", () => {
    const a = doc("a", { d: dx("Bipolar disorder", "active", { icd10cm: "F31.9" }), m: med("continue", { drug_name: "quetiapine 100 mg tablet", rxnorm_ingredient: undefined }) });
    const r = transform([a], asOf);
    expect(r.problems[0].sensitivity).toEqual(["mental-health"]); expect(r.medications[0].sensitivity).toEqual(["mental-health"]);
  });
});

describe("labs and vitals", () => {
  test("status precedence beats copy time, panels deduplicate against standalone results", () => {
    const a = doc("a", { l: lab({ status: "corrected", value: "1.4" }) });
    const b = doc("b", { p: { type: "panel", accession: "accession", collected: "2025-04-01T16:00:00Z", specimen: "serum", status: "final", components: [{ test: { local_code: "CREAT", name: "Creatinine" }, value: "1.2", unit: "mg/dL" }] } }, { recorded: "2025-04-03T15:00:00Z" });
    const r = transform([a, b], asOf).labs;
    expect(r).toHaveLength(1); expect(r[0].value).toBe(1.4); expect(r[0].status).toBe("final"); expect(r[0].evidence).toHaveLength(2);
  });
  test("corrected nonnumeric value never falls back to old numeric value", () => {
    const a = doc("a", { l: lab() });
    const b = doc("b", { l: lab({ status: "corrected", value: "Hemolyzed, see comment" }) }, { recorded: "2025-04-03T15:00:00Z" });
    expect(transform([a, b], asOf).labs).toEqual([]);
  });
  test("new accession is a new measurement, missing unit and malformed value skipped", () => {
    const a = doc("a", { a: lab(), b: lab({ accession: "repeat" }), bad: lab({ accession: "bad", value: "1.2 xyz" }), unit: lab({ accession: "no-unit", unit: undefined }) });
    expect(transform([a], asOf).labs).toHaveLength(2);
  });
  test("unit conversions preserve comparator and do not manufacture LOINC", () => {
    const a = doc("a", { cr: lab({ value: "≤88.4", unit: "µmol/L" }), plt: lab({ accession: "plt", test: { local_code: "PLT", name: "Platelets" }, value: "350,000", unit: "cells/uL" }), trop: lab({ accession: "trop", test: { local_code: "TNI", name: "Troponin I" }, value: "<10", unit: "ng/L" }) });
    const r = transform([a], asOf).labs;
    expect(r.find(l => l.analyte === "creatinine")).toMatchObject({ value: 1, comparator: "<=", unit: "mg/dL" });
    expect(r.find(l => l.analyte === "platelets")).toMatchObject({ value: 350, unit: "10*3/uL" });
    expect(r.find(l => l.analyte === "troponin")).toMatchObject({ value: 0.01, comparator: "<", unit: "ng/mL" });
    expect(r.find(l => l.analyte === "platelets")!.loinc).toBeUndefined();
  });
  test("unitless pH allowed, unrelated analytes and urine creatinine excluded", () => {
    const a = doc("a", { ph: lab({ test: { local_code: "VPH", name: "pH, venous" }, value: "7.2", unit: undefined }), urine: lab({ accession: "urine", specimen: "urine" }), lactate: lab({ accession: "lac", test: { local_code: "LAC", name: "Lactate" }, unit: "mmol/L" }) });
    expect(transform([a], asOf).labs.map(l => l.analyte)).toEqual(["ph"]);
  });
  test("ambiguous local abbreviations do not invent analyte identity", () => {
    const a = doc("a", { cr: lab({ test: { local_code: "CR", name: "C reactive protein" } }), trop: lab({ accession: "trop", test: { local_code: "TROP", name: "Troponin" }, value: "5", unit: "ng/mL" }) });
    expect(transform([a], asOf).labs).toEqual([]);
  });
  test("offsetless collection stays local with correct seasonal offset", () => {
    const a = doc("a", { a: lab({ accession: "winter", collected: "2025-01-02T23:05" }), b: lab({ accession: "summer", collected: "2025-07-02T23:05:00" }) });
    const r = transform([a], asOf).labs;
    expect(r[0].collected).toBe("2025-01-02T23:05:00-06:00"); expect(r[1].collected).toBe("2025-07-02T23:05:00-05:00");
  });
  test("eGFR keeps reported value and source equation, no race duplicate", () => {
    const a = doc("a", { a: lab({ accession: "old", collected: "2022-01-01T12:00:00Z", test: { local_code: "EGFR_AA", name: "eGFR MDRD African American" }, value: "80", unit: "mL/min/1.73m2" }), b: lab({ accession: "old", collected: "2022-01-01T12:00:00Z", test: { local_code: "EGFR_NAA", name: "eGFR MDRD non-African American" }, value: "65", unit: "mL/min/1.73m2" }), c: lab({ accession: "new", test: { local_code: "EGFR", name: "eGFR" }, value: ">90", unit: "mL/min/1.73m2" }) });
    const r = transform([a], asOf).labs;
    expect(r).toHaveLength(2); expect(r[0]).toMatchObject({ value: 65, egfr_equation: "mdrd" }); expect(r[1]).toMatchObject({ value: 90, comparator: ">", egfr_equation: "ckd-epi-2021" });
  });
  test("vitals localize, deduplicate, and round weight", () => {
    const a = doc("a", { v: vital({ taken: "2025-04-02T03:30:00Z" }) });
    const b = doc("b", { renamed: a.payload.v }, { recorded: "2025-04-03T15:00:00Z" });
    const r = transform([a, b], asOf).vitals;
    expect(r).toHaveLength(1); expect(r[0]).toMatchObject({ local_time: "2025-04-01T22:30", weight_kg: 65.3, pulse_bpm: 70 }); expect(r[0].evidence).toHaveLength(2);
  });
  test("nearby measurements form a set; later BP-only reading is a repeat", () => {
    const a = doc("a", { weight: vital({ taken: "2025-04-01T16:00:00Z", bp: undefined, heart_rate_bpm: undefined }), first: vital({ taken: "2025-04-01T16:02:00Z", weight_kg: undefined }), repeat: vital({ taken: "2025-04-01T16:30:00Z", bp: { systolic_mmhg: 110, diastolic_mmhg: 75 }, heart_rate_bpm: undefined, weight_kg: undefined }) });
    const r = transform([a], asOf).vitals;
    expect(r).toHaveLength(1); expect(r[0]).toMatchObject({ local_time: "2025-04-01T11:02", systolic_mmhg: 120, repeat_systolic_mmhg: 110, repeat_diastolic_mmhg: 75, weight_kg: 65.3 });
  });
});

describe("resilience and samples", () => {
  test("malformed JSON shapes skipped without throwing", () => {
    const odd = [null, false, 0, "x", [], {}, doc("a", { l: lab({ status: "constructor", test: { local_code: "x", loinc: "constructor" } }), p: { type: "panel", components: [null, 3, {}] }, d: dx("", "active"), v: { type: "vitals", taken: "no" }, m: med("unexpected") }), doc("bad", {}, { recorded: "invalid" })];
    expect(() => transform(odd as FolioItem[], asOf)).not.toThrow();
    expect(transform(null as unknown as FolioItem[], asOf)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  });
  test("sample counts, clinical decisions, permutation invariance and no mutation", async () => {
    const groups = await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).json();
    const items = groups[0].items as FolioItem[];
    const original = JSON.stringify(items);
    const r = transform(items, asOf);
    expect(r.medications).toHaveLength(4); expect(r.problems).toHaveLength(3); expect(r.allergies).toHaveLength(2); expect(r.labs).toHaveLength(49); expect(r.vitals).toHaveLength(7);
    expect(r.medications.find(m => m.ingredient === "empagliflozin")!.status).toBe("held");
    expect(r.problems.some(p => /pancreatitis/i.test(p.condition))).toBe(false);
    expect(r.allergies.find(a => a.substance === "empagliflozin")!.reaction_type).toBe("serious_adverse_event");
    expect(JSON.stringify(transform([...items].reverse(), asOf))).toBe(JSON.stringify(r));
    expect(JSON.stringify(transform([...items.slice(3), ...items.slice(0, 3)], asOf))).toBe(JSON.stringify(r));
    expect(JSON.stringify(items)).toBe(original);
    const discharge = transform(items, "2023-04-12");
    expect(discharge.medications.find(m => m.ingredient === "metformin")!.status).toBe("active");
    expect(discharge.medications.find(m => m.ingredient === "losartan")!.status).toBe("held");
    expect(transform(items, "2023-04-08").labs).toHaveLength(0);
  });
});
