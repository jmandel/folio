import { describe, expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

function item(id: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "homelog", patient: "p", effective: "2026-01-01",
    recorded: "2026-01-02T01:00:00Z", narrative: "", payload, ...extra };
}
const bp = (extra = {}) => ({ type: "bp_reading", measured_at: "2026-01-01T08:00", systolic_mmhg: 120, diastolic_mmhg: 80, pulse_bpm: 60, entry_method: "cuff_sync", ...extra });
const glucose = (extra = {}) => ({ type: "glucose_reading", measured_at: "2026-01-01T07:00", value: 5.5, unit: "mmol/L", entry_method: "meter_sync", ...extra });
const med = (extra = {}) => ({ type: "my_med", homelog_med_id: "m", name: "Metformin", strength_text: "500 mg", how_i_take_it: "morning and supper", status: "taking", kind: "prescription", ...extra });
const run = (items: FolioItem[], asOf = "2026-10-13") => transform(items, asOf);
const medicine = (extra = {}) => run([item("m", { med: med(extra) })]).medications[0];

describe("time and item lifecycle", () => {
  test("recorded, not effective, controls the Chicago end-of-day cutoff", () => {
    const before = item("a", { bp: bp() }, { effective: "2020-01-01", recorded: "2026-01-02T05:59:59.999Z" });
    const after = item("b", { bp: bp() }, { recorded: "2026-01-02T06:00:00Z" });
    expect(run([after, before], "2026-01-01").vitals.map(v => v.evidence[0].item_id)).toEqual(["a"]);
  });
  test.each([
    ["2026-03-08", "2026-03-09T04:59:59.999Z", "2026-03-09T05:00:00Z"],
    ["2026-11-01", "2026-11-02T05:59:59.999Z", "2026-11-02T06:00:00Z"],
  ])("DST cutoff on %s", (date, before, after) => {
    expect(run([item("a", { bp: bp() }, { recorded: before }), item("b", { bp: bp() }, { recorded: after })], date).vitals).toHaveLength(1);
  });
  test("no offset means retain wall time, including spring DST gap", () => {
    expect(run([item("a", { bp: bp({ measured_at: "2026-03-08T02:30" }) })]).vitals[0].local_time).toBe("2026-03-08T02:30");
  });
  test("explicit offsets convert to Chicago", () => {
    expect(run([item("a", { bp: bp({ measured_at: "2025-03-04T03:30:00Z" }) })]).vitals[0].local_time).toBe("2025-03-03T21:30");
  });
  test("supersession restates a whole page, transitively, after its recorded date", () => {
    const a = item("a", { bp: bp(), glu: glucose() });
    const b = item("b", { bp: bp({ systolic_mmhg: 130 }) }, { supersedes: ["a"], recorded: "2026-01-03T01:00:00Z" });
    const c = item("c", { bp: bp({ systolic_mmhg: 140 }) }, { supersedes: ["b"], recorded: "2026-01-04T01:00:00Z" });
    expect(run([a, c, b], "2026-01-01").vitals).toHaveLength(2);
    expect(run([c, a, b], "2026-01-02").vitals.map(v => v.systolic_mmhg)).toEqual([130]);
    expect(run([b, c, a]).vitals.map(v => v.systolic_mmhg)).toEqual([140]);
  });
  test("retraction has no effect before its commit", () => {
    const a = item("a", { bp: bp() });
    const r = item("r", {}, { retracts: ["a"], recorded: "2026-01-03T01:00:00Z" });
    expect(run([r, a], "2026-01-01").vitals).toHaveLength(1);
    expect(run([a, r], "2026-01-02").vitals).toHaveLength(0);
  });
  test("a retracted correction never existed, even with tied commit times", () => {
    const a = item("a", { bp: bp() });
    const b = item("z", { bp: bp({ systolic_mmhg: 130 }) }, { supersedes: ["a"] });
    const c = item("b", {}, { retracts: ["z"] });
    expect(run([a, b, c]).vitals.map(v => v.systolic_mmhg)).toEqual([120]);
  });
  test("permutation invariance and no input mutations", () => {
    const items = [item("a", { g: glucose() }), item("b", { b: bp() }), item("c", { med: med() })];
    const before = JSON.stringify(items);
    expect(run(items)).toEqual(run([...items].reverse()));
    expect(JSON.stringify(items)).toBe(before);
  });
});

describe("home readings", () => {
  test("units are per reading and glucose is not a lab result", () => {
    const rows = run([item("a", { a: glucose(), b: glucose({ measured_at: "2026-01-01T12:00", value: 164, unit: "mg/dL" }) })]);
    expect(rows.vitals.map(v => v.glucose_mg_dl)).toEqual([99, 164]);
    expect(rows.labs).toEqual([]);
  });
  test("HI and LO retain flags and converted meter limits", () => {
    const rows = run([item("a", { a: glucose({ value: 33.3, out_of_range: "HI" }), b: glucose({ value: 1.1, out_of_range: "LO" }) })]);
    expect(rows.vitals.map(v => [v.glucose_mg_dl, v.glucose_out_of_range])).toEqual([[600, "HI"], [20, "LO"]]);
  });
  test("typed BP duplicates prefer device and retain both evidence entries", () => {
    const rows = run([item("a", { device: bp(), typed: bp({ measured_at: "2026-01-01T08:02", entry_method: "typed", pulse_bpm: undefined }) })]);
    expect(rows.vitals).toHaveLength(1);
    expect(rows.vitals[0].local_time).toBe("2026-01-01T08:00");
    expect(rows.vitals[0].pulse_bpm).toBe(60);
    expect(rows.vitals[0].evidence).toHaveLength(2);
  });
  test("typed glucose duplicates across units", () => {
    const rows = run([item("a", { device: glucose(), typed: glucose({ measured_at: "2026-01-01T07:01", value: 99, unit: "mg/dL", entry_method: "typed" }) })]);
    expect(rows.vitals).toHaveLength(1);
  });
  test("separate device readings and different values remain separate", () => {
    expect(run([item("a", { a: bp(), b: bp(), c: bp({ measured_at: "2026-01-01T08:01", systolic_mmhg: 121, entry_method: "typed" }) })]).vitals).toHaveLength(3);
  });
  test("HI is not an ordinary reading at the limit", () => {
    expect(run([item("a", { a: glucose({ value: 600, unit: "mg/dL", out_of_range: "HI" }), b: glucose({ value: 600, unit: "mg/dL", entry_method: "typed" }) })]).vitals).toHaveLength(2);
  });
});

describe("medicine snapshots and identity", () => {
  test("latest full snapshot removes omitted drugs; stopped medicines remain", () => {
    const old = item("a", { a: med(), b: med({ name: "Lisinopril" }) });
    const current = item("b", { b: med({ name: "Lisinopril", status: "stopped", stopped: "2026-02" }) }, { effective: "2026-03-01", recorded: "2026-03-01T12:00:00Z" });
    const rows = run([old, current]).medications;
    expect(rows).toHaveLength(1);
    expect(rows[0].ingredient).toBe("lisinopril");
    expect(rows[0].status).toBe("stopped");
    expect(rows[0].status_since).toBe("2026-02");
  });
  test("an empty save clears the medicine list", () => {
    expect(run([item("a", { a: med() }), item("b", {}, { effective: "2026-02-01", recorded: "2026-02-01T12:00:00Z", narrative: "My Medicines, saved 1 February 2026." })]).medications).toEqual([]);
  });
  test("ingredient and product RxNorm concepts are distinguished", () => {
    expect(medicine({ picked_from_search: { display: "metformin", rxnorm: "6809" } }).rxnorm_ingredient).toBe("6809");
    const product = medicine({ picked_from_search: { display: "metformin hydrochloride 500 MG Oral Tablet", rxnorm: "product-code" } });
    expect(product.ingredient).toBe("metformin");
    expect(product.rxnorm_ingredient).toBeUndefined();
  });
  test("brands and salts normalize, unknown nicknames do not become ingredients", () => {
    expect(medicine({ name: "Crestor", picked_from_search: { display: "rosuvastatin calcium 20 MG Oral Tablet", rxnorm: "product" } }).ingredient).toBe("rosuvastatin");
    expect(medicine({ name: "water pill" }).ingredient).toBeUndefined();
    expect(medicine({ name: "m_61" }).ingredient).toBeUndefined();
    expect(medicine({ name: "Toprol XL" }).ingredient).toBe("metoprolol");
  });
  test("duplicate branded and generic entries are one ingredient", () => {
    expect(run([item("a", { a: med({ name: "Glucophage" }), b: med() })]).medications).toHaveLength(1);
  });
  test("combination products produce separate ingredients with component doses", () => {
    const rows = run([item("a", { m: med({ name: "Combination pill", picked_from_search: { display: "lisinopril 10 MG/hydrochlorothiazide 12.5 MG Oral Tablet", rxnorm: "product" }, how_i_take_it: "2 tablets daily" }) })]).medications;
    expect(rows.map(r => [r.ingredient, r.dose])).toEqual([["hydrochlorothiazide", { value: 25, unit: "mg" }], ["lisinopril", { value: 20, unit: "mg" }]]);
    expect(rows.every(r => r.rxnorm_ingredient === undefined)).toBe(true);
  });
  test("generic combination names without strengths still identify both drugs", () => {
    const rows = run([item("a", { m: med({ name: "sulfamethoxazole/trimethoprim", strength_text: undefined }) })]).medications;
    expect(rows.map(r => r.ingredient)).toEqual(["sulfamethoxazole", "trimethoprim"]);
  });
  test("partial start dates retain precision and a save date is not a start date", () => {
    expect(medicine({ started: "2020" }).status_since).toBe("2020");
    expect(medicine({ started: "2020-06" }).status_since).toBe("2020-06");
    expect(medicine().status_since).toBeUndefined();
  });
  test("paused taking or stopped entries are held", () => {
    expect(medicine({ note: "Paused since 2026-02 until after surgery" }).status).toBe("held");
    expect(medicine({ note: "Paused since 2026-02 until after surgery" }).status_since).toBe("2026-02");
    expect(medicine({ status: "stopped", stopped: "2026-03", note: "Holding until after surgery" }).status).toBe("held");
  });
  test("a past hold followed by resumption is not a current hold", () => {
    expect(medicine({ note: "Was paused for surgery; restarted on 2026-05-04" }).status).toBe("active");
    expect(medicine({ note: "Was paused for surgery; restarted on 2026-05-04" }).status_since).toBe("2026-05-04");
  });
  test("a new hold after an old resumption is held", () => {
    expect(medicine({ note: "Restarted last month; now on hold until after surgery" }).status).toBe("held");
    expect(medicine({ status: "stopped", note: "Temporarily stopped for surgery" }).status).toBe("held");
    expect(medicine({ note: "Not paused; taking every morning" }).status).toBe("active");
  });
  test("stopping reasons and OTC preserve the patient's account", () => {
    const row = medicine({ status: "stopped", kind: "over_the_counter", note: "Stopped because it made me dizzy" });
    expect(row.stop_reason).toBe("adverse_reaction");
    expect(row.status_reason_text).toBe("Stopped because it made me dizzy");
    expect(row.otc).toBe(true);
    expect(row.patient_reported).toBe(true);
  });
  test("psychiatric and substance-use medicines are included and tagged", () => {
    expect(medicine({ name: "Seroquel" }).sensitivity).toEqual(["mental-health"]);
    expect(medicine({ name: "buprenorphine" }).sensitivity).toEqual(["substance-use"]);
  });
});

describe("directions and dose", () => {
  test.each([
    ["take 2 tablets every 12 hours", "10 mg", { value: 20, unit: "mg" }, "BID"],
    ["2 puffs every 6 hours as needed for wheeze", "90 mcg/puff", { value: 180, unit: "mcg" }, "PRN"],
    ["take in the evening", "10 milligrams", { value: 10, unit: "mg" }, "QD"],
    ["1 tablet daily", undefined, { value: 1, unit: "tablet" }, "QD"],
    ["10 U at bedtime", "100 units/mL pen", { value: 10, unit: "units" }, "QHS"],
    ["5 cc twice daily", undefined, { value: 5, unit: "mL" }, "BID"],
    ["half a tablet each morning", "10 mg", { value: 5, unit: "mg" }, "QD"],
    ["1/2 tab every morning", "10 mg", { value: 5, unit: "mg" }, "QD"],
    ["1 tablet every Sunday", "70 mg", { value: 70, unit: "mg" }, "QW"],
    ["1 tablet every 8 hours", "500 mg", { value: 500, unit: "mg" }, "TID"],
    ["2 tablets of 10 mg twice daily", "10 mg", { value: 20, unit: "mg" }, "BID"],
    ["2 tablets (10 mg each) twice daily", "10 mg", { value: 20, unit: "mg" }, "BID"],
    ["2 tablets (20 mg total) twice daily", "10 mg", { value: 20, unit: "mg" }, "BID"],
  ])("%s, strength %s", (directions, strength, expectedDose, expectedFrequency) => {
    const row = medicine({ how_i_take_it: directions, strength_text: strength });
    expect(row.dose).toEqual(expectedDose);
    expect(row.frequency).toBe(expectedFrequency);
  });
  test.each([
    "1 or 2 tablets for knee pain, most days", "1–2 puffs as needed", "sliding scale before meals",
    "10 units if glucose is high, otherwise 5 units", "1 tablet in the morning and 2 tablets at night",
    "1 in the morning and 2 in the evening", "",
    "take 10 units if glucose is high",
  ])("ambiguous dose is omitted: %s", direction => {
    expect(medicine({ how_i_take_it: direction }).dose).toBeUndefined();
  });
  test("a strength without any directions is not a dose", () => {
    expect(medicine({ how_i_take_it: undefined }).dose).toBeUndefined();
  });
});

describe("conservative scope and malformed input", () => {
  test("diary and dose logs do not invent diagnoses, allergies or list changes", () => {
    const rows = run([item("a", { d: { type: "dose_log", at: "2026-01-01T08:00", med_name: "Lantus", homelog_med_id: "x", amount: 50, amount_unit: "units", status: "taken" }, n: { type: "diary_note", written_at: "2026-01-01T08:00", symptom_tags: ["pain", "low_mood"] } }, { narrative: '<ref id="n">My back hurts and I feel depressed.</ref>' })]);
    expect(rows).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  });
  test("unreadable entries and invalid dates are skipped", () => {
    const inputs: unknown[] = [null, 1, "bad", { id: "x" }, item("a", { null: null, array: [], bad: bp({ measured_at: "2026-02-30T08:00" }), unit: glucose({ unit: "unknown" }), missing: { type: "my_med" }, good: bp() }), item("b", null as any)];
    expect(run(inputs as FolioItem[]).vitals).toHaveLength(1);
    expect(transform(null as any, "2026-01-01").vitals).toEqual([]);
    expect(run([], "not a date").medications).toEqual([]);
  });
});
