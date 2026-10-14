import { test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const item = (id: string, recorded: string, payload: Record<string, unknown> = {}, extra: Partial<FolioItem> = {}): FolioItem => ({
  folio: "0.1", id, issuer: "did:web:homelog.example", patient: "p", recorded,
  effective: recorded.slice(0, 10), narrative: "", payload, ...extra,
});
const med = (extra: Record<string, unknown> = {}) => ({ type: "my_med", homelog_med_id: "m", name: "Metformin", status: "taking", kind: "prescription", strength_text: "500 mg", how_i_take_it: "morning", ...extra });
const bp = (extra: Record<string, unknown> = {}) => ({ type: "bp_reading", measured_at: "2026-02-10T08:00", systolic_mmhg: 130, diastolic_mmhg: 80, pulse_bpm: 65, entry_method: "cuff_sync", ...extra });
const glu = (extra: Record<string, unknown> = {}) => ({ type: "glucose_reading", measured_at: "2026-02-10T08:00", value: 5.5, unit: "mmol/L", entry_method: "meter_sync", ...extra });
const rows = (payload: Record<string, unknown>) => transform([item("i", "2026-02-11T12:00:00Z", payload)], "2026-02-11");

for (const [asOf, last, next] of [
  ["2026-01-15", "2026-01-16T05:59:59.999Z", "2026-01-16T06:00:00Z"],
  ["2026-07-15", "2026-07-16T04:59:59.999Z", "2026-07-16T05:00:00Z"],
  ["2026-03-08", "2026-03-09T04:59:59.999Z", "2026-03-09T05:00:00Z"],
  ["2026-11-01", "2026-11-02T05:59:59.999Z", "2026-11-02T06:00:00Z"],
]) test(`Chicago inclusive end of ${asOf}`, () => {
  const result = transform([item("last", last, { b: bp() }), item("next", next, {}, { retracts: ["last"] })], asOf);
  expect(result.vitals).toHaveLength(1);
  expect(result.vitals[0].evidence[0].item_id).toBe("last");
});

test("recorded scope does not use the event date or UTC date", () => {
  const a = item("a", "2026-02-11T05:50:00Z", { b: bp() });
  const b = item("b", "2026-02-11T06:01:00Z", { b: bp() });
  expect(transform([a, b], "2026-02-10").vitals).toHaveLength(1);
});

test("whole-page replacement is transitive, order independent, and retraction does not resurrect", () => {
  const a = item("a", "2026-02-11T12:00:00Z", { b: bp(), g: glu() });
  const b = item("b", "2026-02-12T12:00:00Z", { b: bp({ systolic_mmhg: 135 }) }, { supersedes: ["a"] });
  const c = item("c", "2026-02-13T12:00:00Z", { b: bp({ systolic_mmhg: 140 }) }, { supersedes: ["b"] });
  const d = item("d", "2026-02-14T12:00:00Z", {}, { retracts: ["c"] });
  expect(transform([d, b, c, a], "2026-02-13").vitals.map(r => r.systolic_mmhg)).toEqual([140]);
  expect(transform([a, c, b, d], "2026-02-14").vitals).toEqual([]);
  expect(transform([a, b, c, d], "2026-02-11").vitals).toHaveLength(2);
});

test("correction ids are scoped to issuer", () => {
  const a = item("same", "2026-02-11T12:00:00Z", { b: bp() });
  const b = item("same", "2026-02-11T12:00:00Z", { b: bp() }, { issuer: "did:web:other" });
  const c = item("c", "2026-02-12T12:00:00Z", {}, { retracts: ["same"] });
  expect(transform([a, b, c], "2026-02-12").vitals).toHaveLength(1);
});

test("latest list is a snapshot, with absence removing medicines", () => {
  const a = item("a", "2026-02-10T12:00:00Z", { m: med(), n: med({ name: "Jardiance" }) });
  const b = item("b", "2026-02-11T12:00:00Z", { n: med({ name: "Jardiance" }) });
  expect(transform([b, a], "2026-02-11").medications.map(r => r.ingredient)).toEqual(["empagliflozin"]);
  expect(transform([a, b], "2026-02-10").medications).toHaveLength(2);
});

test("empty list identified by generated narrative clears even an unlinked prior snapshot", () => {
  const a = item("a", "2026-02-10T12:00:00Z", { m: med() });
  const b = item("b", "2026-02-11T12:00:00Z", {}, { narrative: "My Medicines, saved 11 February 2026." });
  expect(transform([a, b], "2026-02-11").medications).toEqual([]);
});

test("medication status, partial dates, patient account, and discontinued medicines", () => {
  const result = rows({ a: med({ name: "Zestril", started: "2020" }), b: med({ name: "Crestor", status: "stopped", stopped: "2026-01", note: "Stopped because of muscle aches." }) });
  expect(result.medications[0]).toMatchObject({ ingredient: "lisinopril", patient_reported: true, status: "active", status_since: "2020" });
  expect(result.medications[1]).toMatchObject({ ingredient: "rosuvastatin", status: "stopped", status_since: "2026-01", stop_reason: "adverse_reaction", status_reason_text: "Stopped because of muscle aches." });
});

test("latest own event selects a restarted drug over a stopped older line", () => {
  const result = rows({ z: med({ status: "stopped", stopped: "2025-12" }), a: med({ started: "2026-01", homelog_med_id: "new" }) });
  expect(result.medications).toHaveLength(1);
  expect(result.medications[0]).toMatchObject({ status: "active", status_since: "2026-01", evidence: [{ item_id: "i", entry_id: "a" }] });
});

test("temporary pause overrides both taking and stopped, without inventing a hold date", () => {
  for (const status of ["taking", "stopped"]) {
    const result = rows({ m: med({ status, started: "2018", note: "Doctor told me to stop for now." }) }).medications[0];
    expect(result.status).toBe("held");
    expect(result.status_since).toBeUndefined();
    expect(result.stop_reason).toBeUndefined();
    expect(result.status_reason_text).toBe("Doctor told me to stop for now.");
  }
});

test("negated, conditional, and historical holds do not override current taking", () => {
  for (const note of ["Not on hold.", "Hold if I get sick.", "Was held in January, restarted in February.", "Doctor said do not stop for now."]) {
    expect(rows({ m: med({ note }) }).medications[0].status).toBe("active");
  }
});

test("hold date comes from explicit date, not list-save time or original start", () => {
  const m = rows({ m: med({ started: "2019", note: "Paused since 2026-02-01 until my appointment." }) }).medications[0];
  expect(m).toMatchObject({ status: "held", status_since: "2026-02-01" });
});

test("patient strength wins over contradictory product strength, product CUI stays out", () => {
  const m = rows({ m: med({ name: "Synthroid", strength_text: "75 mg", picked_from_search: { rxnorm: "966222", display: "levothyroxine sodium 0.075 MG Oral Tablet" } }) }).medications[0];
  expect(m.ingredient).toBe("levothyroxine");
  expect(m.dose).toEqual({ value: 75, unit: "mg" });
  expect(m.rxnorm_ingredient).toBeUndefined();
});

test("ingredient-only search result can supply its own RxNorm code", () => {
  const m = rows({ m: med({ picked_from_search: { rxnorm: "6809", display: "metformin" } }) }).medications[0];
  expect(m.rxnorm_ingredient).toBe("6809");
});

for (const [directions, strength, expected, freq] of [
  ["2 tablets twice daily", "200 mg", { value: 400, unit: "mg" }, "BID"],
  ["half a tablet at bedtime", "50 mg", { value: 25, unit: "mg" }, "QHS"],
  ["1/2 tablet each morning", "50 mcg", { value: 25, unit: "mcg" }, "QD"],
  ["morning and supper", "500 mg", { value: 500, unit: "mg" }, "BID"],
  ["one capsule every week", undefined, { value: 1, unit: "tablet" }, "QW"],
  ["1 or 2 as needed", "220 mg", undefined, "PRN"],
  ["1 in the morning and 2 at bedtime", "500 mg", undefined, "BID"],
  ["sliding scale before meals", "500 mg", undefined, "other"],
] as const) test(`dose and frequency: ${directions}`, () => {
  const m = rows({ m: med({ how_i_take_it: directions, strength_text: strength }) }).medications[0];
  expect(m.dose).toEqual(expected);
  expect(m.frequency).toBe(freq);
});

test("insulin concentration does not become the dose", () => {
  const m = med({ name: "Lantus", strength_text: "100 units/mL pen", how_i_take_it: "10 units at bedtime" });
  expect(rows({ m }).medications[0]).toMatchObject({ ingredient: "insulin glargine", dose: { value: 10, unit: "units" }, frequency: "QHS" });
  expect(rows({ m: { ...m, how_i_take_it: "bedtime" } }).medications[0].dose).toBeUndefined();
});

test("liquid volume is not multiplied by concentration", () => {
  expect(rows({ m: med({ strength_text: "200 mg/5 mL", how_i_take_it: "10 mL three times daily" }) }).medications[0].dose).toEqual({ value: 10, unit: "mL" });
});

test("unknown medicine nickname is retained, but has no ingredient or guessed code", () => {
  const m = rows({ m: med({ name: "water pill", kind: "over_the_counter", strength_text: undefined }) }).medications[0];
  expect(m.drug_name).toBe("water pill");
  expect(m.ingredient).toBeUndefined();
  expect(m.otc).toBe(true);
});

test("diary symptoms, narrative diagnoses, and logged doses do not create clinical list rows", () => {
  const result = transform([item("i", "2026-02-11T12:00:00Z", {
    n: { type: "diary_note", written_at: "2026-02-10T08:00", symptom_tags: ["pain", "low_mood"], severity: 5 },
    d: { type: "dose_log", at: "2026-02-10T08:00", homelog_med_id: "m", med_name: "Lantus", status: "taken", amount: 20, amount_unit: "units" },
  }, { narrative: '<ref id="n">My doctor said I have diabetes and my medicine makes me sick.</ref>' })], "2026-02-11");
  expect(result).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});

test("each glucose reading supplies its own units and HI/LO are limit flags", () => {
  const result = rows({ a: glu(), b: glu({ value: 90, unit: "mg/dL" }), c: glu({ value: 33.3, out_of_range: "HI" }), d: glu({ value: 1.1, out_of_range: "LO" }) });
  expect(result.vitals.map(v => [v.glucose_mg_dl, v.glucose_out_of_range])).toEqual([[99, undefined], [90, undefined], [600, "HI"], [20, "LO"]]);
});

test("phone wall clocks are retained even in the spring DST gap", () => {
  expect(rows({ b: bp({ measured_at: "2026-03-08T02:30" }) }).vitals[0].local_time).toBe("2026-03-08T02:30");
});

test("typed duplicate is removed and device time and both evidence citations retained", () => {
  const result = rows({ d: bp(), t: bp({ measured_at: "2026-02-10T08:02", entry_method: "typed", pulse_bpm: undefined }) });
  expect(result.vitals).toHaveLength(1);
  expect(result.vitals[0]).toMatchObject({ local_time: "2026-02-10T08:00", pulse_bpm: 65 });
  expect(result.vitals[0].evidence).toEqual([{ item_id: "i", entry_id: "d" }, { item_id: "i", entry_id: "t" }]);
});

test("distinct repeats, opposite arms, and nonmatching pulse values survive", () => {
  expect(rows({ a: bp(), b: bp({ measured_at: "2026-02-10T08:01" }) }).vitals).toHaveLength(2);
  expect(rows({ a: bp(), b: bp({ measured_at: "2026-02-10T08:03", entry_method: "typed" }) }).vitals).toHaveLength(2);
  expect(rows({ a: bp({ arm: "left" }), b: bp({ arm: "right", entry_method: "typed" }) }).vitals).toHaveLength(2);
  expect(rows({ a: bp(), b: bp({ pulse_bpm: 66, entry_method: "typed" }) }).vitals).toHaveLength(2);
});

test("rounding cannot collapse two different same-unit glucose readings", () => {
  expect(rows({ a: glu({ value: 5.55 }), b: glu({ value: 5.56, entry_method: "typed" }) }).vitals).toHaveLength(2);
  expect(rows({ a: glu({ value: 5.6 }), b: glu({ value: 101, unit: "mg/dL", entry_method: "typed" }) }).vitals).toHaveLength(1);
  expect(rows({ a: glu({ value: 600, unit: "mg/dL", out_of_range: "HI" }), b: glu({ value: 600, unit: "mg/dL", entry_method: "typed" }) }).vitals).toHaveLength(2);
});

test("malformed entries skip safely without poisoning readable ones", () => {
  const values: unknown[] = [null, [], false, {}, { recorded: "bad" }, item("i", "2026-02-11T12:00:00Z", {
    a: null, b: [], c: bp({ systolic_mmhg: "130" }), d: bp({ measured_at: "2026-02-30T12:00" }), e: glu({ value: NaN }), f: glu({ unit: "unknown" }), good: bp(),
  })];
  expect(transform(values as FolioItem[], "2026-02-11").vitals).toHaveLength(1);
  expect(transform(null as never, "2026-02-11").vitals).toEqual([]);
  expect(transform([], "bad").vitals).toEqual([]);
});

test("sensitive medications remain present", () => {
  const m = rows({ m: med({ name: "Zoloft" }) }).medications[0];
  expect(m.ingredient).toBe("sertraline");
  expect(m.sensitivity).toContain("mental-health");
});

test("input order and payload insertion order do not change the result or mutate the input", () => {
  const a = item("a", "2026-02-11T12:00:00Z", { g: glu(), b: bp() });
  const b = item("b", "2026-02-12T12:00:00Z", { m: med() });
  const before = JSON.stringify([a, b]);
  const expected = transform([a, b], "2026-02-12");
  expect(transform([{ ...b }, { ...a, payload: { b: a.payload.b, g: a.payload.g } }], "2026-02-12")).toEqual(expected);
  expect(JSON.stringify([a, b])).toBe(before);
});

test("mixed explicit and implicit tablet counts still represent a variable dose", () => {
  expect(rows({ m: med({ how_i_take_it: "2 tablets in the morning and 1 at bedtime" }) }).medications[0].dose).toBeUndefined();
});

test("strength embedded in a tablet instruction is multiplied by the count", () => {
  expect(rows({ m: med({ how_i_take_it: "2 500 mg tablets twice daily" }) }).medications[0].dose).toEqual({ value: 1000, unit: "mg" });
});

test("concentration in directions is not an additional dose", () => {
  const m = rows({ m: med({ name: "Lantus", how_i_take_it: "10 units at bedtime (100 units/1 mL pen)", strength_text: "100 units/mL" }) }).medications[0];
  expect(m.dose).toEqual({ value: 10, unit: "units" });
});

test("later present hold after a restart is still held", () => {
  expect(rows({ m: med({ note: "Restarted in January, but on hold now until my appointment." }) }).medications[0].status).toBe("held");
});

test("negated side effects do not create an adverse-reaction stop reason", () => {
  expect(rows({ m: med({ status: "stopped", note: "No side effects. Finished the course." }) }).medications[0].stop_reason).toBe("course_complete");
});

test("a nickname cannot become a generic ingredient", () => {
  expect(rows({ m: med({ name: "little blue pill" }) }).medications[0].ingredient).toBeUndefined();
});

test("mixed fractions and thousands separators retain the actual amount", () => {
  for (const how_i_take_it of ["1½ tablets daily", "1 1/2 tablets daily"]) {
    expect(rows({ m: med({ how_i_take_it, strength_text: "1,000 mg" }) }).medications[0].dose).toEqual({ value: 1500, unit: "mg" });
  }
});

test("bedtime described as evening is one administration", () => {
  expect(rows({ m: med({ how_i_take_it: "1 every evening at bedtime" }) }).medications[0].frequency).toBe("QHS");
});
