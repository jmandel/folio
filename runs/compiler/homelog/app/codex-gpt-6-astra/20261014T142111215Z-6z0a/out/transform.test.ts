import { describe, expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

function item(id: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "homelog", patient: "p", effective: "2026-02-01", recorded: "2026-02-01T15:00:00Z", narrative: "", payload, ...extra };
}
function med(extra: Record<string, unknown> = {}) {
  return { type: "my_med", name: "Metformin", homelog_med_id: "m", status: "taking", kind: "prescription", ...extra };
}
function bp(extra: Record<string, unknown> = {}) {
  return { type: "bp_reading", measured_at: "2026-02-01T09:00", systolic_mmhg: 120, diastolic_mmhg: 80, pulse_bpm: 60, entry_method: "cuff_sync", ...extra };
}
function glu(extra: Record<string, unknown> = {}) {
  return { type: "glucose_reading", measured_at: "2026-02-01T09:00", value: 100, unit: "mg/dL", entry_method: "meter_sync", ...extra };
}
function rows(items: FolioItem[], date = "2026-10-13") { return transform(items, date); }
function medication(extra: Record<string, unknown>) { return rows([item("m", { m: med(extra) })]).medications[0]; }

describe("publication time and correction semantics", () => {
  test.each([
    ["2026-02-01", "2026-02-02T05:59:59.999Z", "2026-02-02T06:00:00Z"],
    ["2026-07-01", "2026-07-02T04:59:59.999Z", "2026-07-02T05:00:00Z"],
    ["2026-03-08", "2026-03-09T04:59:59Z", "2026-03-09T05:00:00Z"],
    ["2026-11-01", "2026-11-02T05:59:59Z", "2026-11-02T06:00:00Z"],
  ])("Chicago end of day %s", (asOf, inside, outside) => {
    expect(rows([item("a", { a: bp() }, { recorded: inside }), item("b", { b: bp() }, { recorded: outside })], asOf).vitals.map(v => v.evidence[0].item_id)).toEqual(["a"]);
  });
  test("corrections are scoped, transitive, and do not resurrect after retraction", () => {
    const a = item("a", { r: bp() });
    const b = item("b", { r: bp({ systolic_mmhg: 130 }) }, { recorded: "2026-02-02T15:00:00Z", supersedes: ["a"] });
    const c = item("c", { r: bp({ systolic_mmhg: 140 }) }, { recorded: "2026-02-03T15:00:00Z", supersedes: ["b"] });
    const d = item("d", {}, { recorded: "2026-02-04T15:00:00Z", retracts: ["c"] });
    expect(rows([c, a, d, b], "2026-02-01").vitals[0].systolic_mmhg).toBe(120);
    expect(rows([c, a, d, b], "2026-02-02").vitals[0].systolic_mmhg).toBe(130);
    expect(rows([c, a, d, b], "2026-02-03").vitals[0].systolic_mmhg).toBe(140);
    expect(rows([c, a, d, b], "2026-02-04").vitals).toEqual([]);
  });
  test("correction IDs are scoped to issuer", () => {
    expect(rows([item("a", { r: bp() }), item("b", {}, { issuer: "other", retracts: ["a"] })]).vitals).toHaveLength(1);
  });
  test("phone timestamps are preserved, including DST gaps and clock drift", () => {
    for (const measured_at of ["2026-03-08T02:30", "2026-11-01T01:30", "2027-01-01T00:00"]) {
      expect(rows([item("a", { r: bp({ measured_at }) })]).vitals[0].local_time).toBe(measured_at);
    }
  });
});

describe("whole-list medication snapshots", () => {
  test("missing drugs disappear even without an explicit supersedes link", () => {
    const a = item("a", { m: med(), x: med({ name: "Lisinopril", homelog_med_id: "x" }) });
    const b = item("b", { x: med({ name: "Lisinopril", homelog_med_id: "x" }) }, { recorded: "2026-02-02T15:00:00Z" });
    expect(rows([b, a]).medications.map(m => m.ingredient)).toEqual(["lisinopril"]);
  });
  test("an empty snapshot clears the list", () => {
    const a = item("a", { m: med() });
    expect(rows([a, item("b", {}, { supersedes: ["a"], recorded: "2026-02-02T15:00:00Z" })]).medications).toEqual([]);
    expect(rows([a, item("b", {}, { narrative: "My Medicines, saved 2 February 2026.", recorded: "2026-02-02T15:00:00Z" })]).medications).toEqual([]);
  });
  test("dose logs and diary mentions do not update medication lists or create diagnoses", () => {
    const result = rows([item("a", { m: med() }), item("b", {
      d: { type: "dose_log", homelog_med_id: "m", med_name: "Lantus", status: "skipped", skip_reason: "rash", amount: 100, amount_unit: "units" },
      n: { type: "diary_note", written_at: "2026-02-01T10:00", symptom_tags: ["pain", "low_mood"], severity: 5 },
    }, { narrative: '<ref id="n">I have a drug allergy and stopped all my medicines.</ref>' })]);
    expect(result.medications).toHaveLength(1);
    expect(result.medications[0].ingredient).toBe("metformin");
    expect(result.medications[0].status).toBe("active");
    expect(result.problems).toEqual([]); expect(result.allergies).toEqual([]); expect(result.labs).toEqual([]);
  });
  test("same ingredient selects the line with the latest own event", () => {
    const result = rows([item("a", {
      z: med({ homelog_med_id: "old", name: "Glucophage", status: "stopped", stopped: "2025-12" }),
      a: med({ homelog_med_id: "new", started: "2026-01", how_i_take_it: "twice daily" }),
    })]);
    expect(result.medications).toHaveLength(1);
    expect(result.medications[0].status_since).toBe("2026-01");
    expect(result.medications[0].evidence).toEqual([{ item_id: "a", entry_id: "a" }]);
  });
});

describe("medication interpretation", () => {
  test.each([
    ["morning", "200 mg", { value: 200, unit: "mg" }, "QD"],
    ["bedtime", "20 mg", { value: 20, unit: "mg" }, "QHS"],
    ["every evening at bedtime", "20 mg", { value: 20, unit: "mg" }, "QHS"],
    ["with food", "20 mg", { value: 20, unit: "mg" }, undefined],
    ["1 every 7 days", "20 mg", { value: 20, unit: "mg" }, "QW"],
    ["once per week", "20 mg", { value: 20, unit: "mg" }, "QW"],
    ["twice a week", "20 mg", { value: 20, unit: "mg" }, "other"],
    ["3 times per week", "20 mg", { value: 20, unit: "mg" }, "other"],
    ["morning and supper", "500 mg", { value: 500, unit: "mg" }, "BID"],
    ["take 2", "200 mg", { value: 400, unit: "mg" }, undefined],
    ["two tablets twice daily", "200 mg", { value: 400, unit: "mg" }, "BID"],
    ["1/2 tablet each morning", "100 mg", { value: 50, unit: "mg" }, "QD"],
    ["1½ tablets daily", "100 mg", { value: 150, unit: "mg" }, "QD"],
    ["1 1/2 tablets daily", "100 mg", { value: 150, unit: "mg" }, "QD"],
    ["two 500 mg tablets twice daily", "500 mg", { value: 1000, unit: "mg" }, "BID"],
    ["2 x 500 mg daily", "500 mg", { value: 1000, unit: "mg" }, "QD"],
    ["take 2 capsules as needed", undefined, { value: 2, unit: "tablet" }, "PRN"],
    ["25 mcg daily", "50 mcg", { value: 25, unit: "mcg" }, "QD"],
    ["10 [iU] at bedtime", "100 units/mL", { value: 10, unit: "units" }, "QHS"],
    ["5 mL twice daily", "100 mg/5mL", { value: 5, unit: "mL" }, "BID"],
    ["1 or 2 for pain, most days", "200 mg", undefined, "other"],
    ["1-2 tablets as needed", "200 mg", undefined, "PRN"],
    ["1 in the morning and 2 at bedtime", "200 mg", undefined, "BID"],
    ["2 tablets in the morning and 1 at bedtime", "200 mg", undefined, "BID"],
    ["sliding scale before meals", "100 units/mL", undefined, undefined],
    ["2 puffs twice daily", undefined, undefined, "BID"],
  ])("parses %s", (how_i_take_it, strength_text, dose, freq) => {
    const m = medication({ how_i_take_it, strength_text });
    expect(m.dose).toEqual(dose); expect(m.frequency).toBe(freq);
  });
  test("preserves patient strength despite conflicting product text and omits product code", () => {
    const m = medication({ name: "Synthroid", picked_from_search: { rxnorm: "966222", display: "levothyroxine sodium 0.075 MG Oral Tablet" }, strength_text: "75 mg", how_i_take_it: "morning" });
    expect(m.ingredient).toBe("levothyroxine"); expect(m.dose).toEqual({ value: 75, unit: "mg" }); expect(m.rxnorm_ingredient).toBeUndefined();
  });
  test("bare ingredient code is retained", () => {
    expect(medication({ name: "Zestril", picked_from_search: { rxnorm: "29046", display: "lisinopril" } }).rxnorm_ingredient).toBe("29046");
  });
  test("unidentified medicine stays in the output without a guessed ingredient", () => {
    const m = medication({ name: "water pill", how_i_take_it: "morning" });
    expect(m.ingredient).toBeUndefined(); expect(m.drug_name).toBe("water pill");
  });
  test.each(["taking", "stopped"])("temporary stop annotated on %s is held", status => {
    const m = medication({ status, stopped: "2026-02", note: "doctor told me to stop for now" });
    expect(m.status).toBe("held"); expect(m.status_since).toBe("2026-02"); expect(m.stop_reason).toBeUndefined();
    expect(m.status_reason_text).toBe("doctor told me to stop for now");
  });
  test("past hold does not override resumption", () => {
    expect(medication({ note: "Was on hold, but restarted yesterday" }).status).toBe("active");
  });
  test("temporary symptoms are not a medication hold", () => {
    expect(medication({ note: "Temporary nausea when I started, now fine" }).status).toBe("active");
  });
  test("insulin directions with no amount cannot become a tablet dose", () => {
    expect(medication({ name: "Lantus", how_i_take_it: "bedtime" }).dose).toBeUndefined();
  });
  test("stop reasons are distinct and do not create allergy rows", () => {
    for (const [note, reason] of [["made me cough", "adverse_reaction"], ["did not work", "ineffective"], ["switched to another drug", "therapy_changed"], ["finished the course", "course_complete"], ["I chose to stop", "patient_choice"], ["too expensive", "other"]]) {
      const m = medication({ status: "stopped", note, stopped: "2024" });
      expect(m.stop_reason).toBe(reason); expect(m.status_reason_text).toBe(note); expect(m.status_since).toBe("2024");
    }
  });
  test("save date and symptom onset are not medication status dates", () => {
    expect(medication({ status: "stopped", note: "Stopped because of cough since 2024-01" }).status_since).toBeUndefined();
    expect(medication({ status: "taking" }).status_since).toBeUndefined();
  });
  test("combination components have distinct doses", () => {
    const meds = rows([item("a", { m: med({ name: "Hyzaar", strength_text: "50/12.5 mg", how_i_take_it: "morning" }) })]).medications;
    expect(meds.map(m => [m.ingredient, m.dose])).toEqual([["hydrochlorothiazide", { value: 12.5, unit: "mg" }], ["losartan", { value: 50, unit: "mg" }]]);
  });
  test("a combination search display is not reduced to its first component", () => {
    const meds = rows([item("a", { m: med({ name: "Hyzaar", picked_from_search: { display: "losartan potassium 50 MG / hydrochlorothiazide 12.5 MG Oral Tablet", rxnorm: "12345" }, how_i_take_it: "morning" }) })]).medications;
    expect(meds.map(m => m.ingredient)).toEqual(["hydrochlorothiazide", "losartan"]);
  });
});

describe("readings", () => {
  test("per-reading units and meter limits are preserved", () => {
    const v = rows([item("a", { a: glu({ value: 7.2, unit: "mmol/L" }), b: glu({ value: 150 }), c: glu({ value: 33.3, unit: "mmol/L", out_of_range: "HI" }), d: glu({ value: 1.1, unit: "mmol/L", out_of_range: "LO" }) })]).vitals;
    expect(v.map(r => [r.glucose_mg_dl, r.glucose_out_of_range])).toEqual([[130, undefined], [150, undefined], [600, "HI"], [20, "LO"]]);
  });
  test("device is preferred over a typed duplicate with evidence from both", () => {
    const v = rows([item("a", { typed: bp({ measured_at: "2026-02-01T09:02", entry_method: "typed", pulse_bpm: undefined }), device: bp() })]).vitals;
    expect(v).toHaveLength(1); expect(v[0].local_time).toBe("2026-02-01T09:00"); expect(v[0].pulse_bpm).toBe(60);
    expect(v[0].evidence).toEqual([{ item_id: "a", entry_id: "device" }, { item_id: "a", entry_id: "typed" }]);
  });
  test("genuine repeats, other arms, changed pulses and readings outside two minutes remain", () => {
    const v = rows([item("a", { a: bp({ arm: "left" }), b: bp(), c: bp({ entry_method: "typed", arm: "right", pulse_bpm: 62 }), d: bp({ entry_method: "typed", measured_at: "2026-02-01T09:03" }) })]).vitals;
    expect(v).toHaveLength(4);
  });
  test("HI is not an ordinary reading at the threshold", () => {
    expect(rows([item("a", { a: glu({ value: 600, out_of_range: "HI" }), b: glu({ value: 600, entry_method: "typed" }) })]).vitals).toHaveLength(2);
  });
  test("cross-unit duplicate uses normalized value", () => {
    expect(rows([item("a", { a: glu({ value: 7.2, unit: "mmol/L" }), b: glu({ value: 130, entry_method: "typed" }) })]).vitals).toHaveLength(1);
  });
});

test("malformed JSON-shaped inputs are skipped and output is finite", () => {
  const garbage = [null, [], {}, true, 0, "bad", { toString: null }];
  const badItems: unknown[] = [...garbage];
  for (const value of garbage) {
    badItems.push(item("bad" + badItems.length, { bp: bp({ measured_at: value }), glu: glu({ unit: value }), med: med({ name: value }) }));
    badItems.push({ ...item("bad" + badItems.length, {}), payload: value, supersedes: value, retracts: value });
  }
  expect(() => transform(badItems as FolioItem[], "2026-10-13")).not.toThrow();
  expect(rows([item("a", { a: bp({ systolic_mmhg: Infinity }), b: glu({ value: NaN }), c: bp({ measured_at: "2026-02-30T08:00" }) })]).vitals).toEqual([]);
  expect(rows([], "invalid")).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});

test("input order and payload key order do not change results; input is not mutated", () => {
  const a = item("a", { z: bp({ entry_method: "typed" }), y: bp(), m: med({ name: "Zoloft", how_i_take_it: "morning" }) });
  const b = item("b", { g: glu() });
  const before = JSON.stringify([a, b]);
  const expected = rows([a, b]);
  expect(rows([{ ...b, payload: Object.fromEntries(Object.entries(b.payload).reverse()) }, { ...a, payload: Object.fromEntries(Object.entries(a.payload).reverse()) }])).toEqual(expected);
  expect(JSON.stringify([a, b])).toBe(before);
  expect(expected.medications[0].sensitivity).toEqual(["mental-health"]);
});
