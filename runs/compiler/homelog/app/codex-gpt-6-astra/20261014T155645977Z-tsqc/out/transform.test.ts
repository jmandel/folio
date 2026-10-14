import { test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const item = (id: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem => ({
  folio: "0.1", id, issuer: "homelog", patient: "patient", effective: "2026-01-01",
  recorded: "2026-01-02T12:00:00Z", narrative: "", payload, ...extra,
});
const med = (extra: Record<string, unknown> = {}) => ({ type: "my_med", homelog_med_id: "m", name: "Lisinopril", status: "taking", kind: "prescription", ...extra });
const bp = (extra: Record<string, unknown> = {}) => ({ type: "bp_reading", measured_at: "2026-01-01T08:00", systolic_mmhg: 120, diastolic_mmhg: 80, pulse_bpm: 70, entry_method: "cuff_sync", ...extra });
const glu = (extra: Record<string, unknown> = {}) => ({ type: "glucose_reading", measured_at: "2026-01-01T08:00", value: 5.5, unit: "mmol/L", entry_method: "meter_sync", ...extra });
const mapMed = (extra: Record<string, unknown>) => transform([item("list", { m: med(extra) })], "2026-12-31").medications[0];

test("as-of uses recorded in Chicago, including DST, rather than effective", () => {
  const a = item("a", { r: bp() }, { recorded: "2026-03-09T04:59:59.999Z", effective: "2030-01-01" });
  const b = item("b", { r: bp() }, { recorded: "2026-03-09T05:00:00Z" });
  expect(transform([a, b], "2026-03-08").vitals.map(r => r.evidence[0].item_id)).toEqual(["a"]);
  const c = item("c", { r: bp() }, { recorded: "2026-11-02T05:59:59.999Z" });
  const d = item("d", { r: bp() }, { recorded: "2026-11-02T06:00:00Z" });
  expect(transform([c, d], "2026-11-01").vitals.map(r => r.evidence[0].item_id)).toEqual(["c"]);
});

test("corrections and retractions take effect only when committed; chains do not resurrect", () => {
  const a = item("a", { old: bp() });
  const b = item("b", { fixed: bp({ systolic_mmhg: 125 }) }, { recorded: "2026-02-01T12:00Z", supersedes: ["a"] });
  const c = item("c", { fixed: bp({ systolic_mmhg: 130 }) }, { recorded: "2026-03-01T12:00Z", supersedes: ["b"] });
  const d = item("d", {}, { recorded: "2026-04-01T12:00Z", retracts: ["c"] });
  expect(transform([d, c, a, b], "2026-01-31").vitals[0].systolic_mmhg).toBe(120);
  expect(transform([d, c, a, b], "2026-02-28").vitals[0].systolic_mmhg).toBe(125);
  expect(transform([d, c, a, b], "2026-03-31").vitals[0].systolic_mmhg).toBe(130);
  expect(transform([d, c, a, b], "2026-04-30").vitals).toEqual([]);
});

test("only the latest full medicine list supplies rows, including an empty list", () => {
  const first = item("first", { a: med(), b: med({ name: "Norvasc" }) });
  const second = item("second", { a: med({ status: "stopped", stopped: "2026-02" }) }, { recorded: "2026-02-02T12:00Z" });
  expect(transform([second, first], "2026-03-01").medications).toHaveLength(1);
  expect(transform([second, first], "2026-03-01").medications[0].status_since).toBe("2026-02");
  const empty = item("empty", {}, { recorded: "2026-03-02T12:00Z", supersedes: ["second"] });
  expect(transform([first, empty, second], "2026-04-01").medications).toEqual([]);
});

test("dose logs and narrative do not create a medicine list or diagnoses", () => {
  const data = item("day", {
    dose: { type: "dose_log", med_name: "Lantus", homelog_med_id: "new", at: "2026-01-01T08:00", amount: 10, amount_unit: "units", status: "taken" },
    note: { type: "diary_note", written_at: "2026-01-01T08:00", symptom_tags: ["pain", "low_mood"], severity: 4 },
  }, { narrative: '<ref id="note">I wonder whether I have cancer. I took Tylenol.</ref>' });
  expect(transform([data], "2026-12-31")).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});

test("reading conversion, limits, and wall-clock times are preserved per entry", () => {
  const rows = transform([item("day", {
    a: glu(), b: glu({ value: 123, unit: "mg/dL", measured_at: "2026-01-01T09:00" }),
    c: glu({ value: 33.3, out_of_range: "HI", measured_at: "2026-01-01T10:00" }),
    d: glu({ value: 1.1, out_of_range: "LO", measured_at: "2026-01-01T11:00" }),
    e: bp({ measured_at: "2026-03-08T02:30" }),
    f: bp({ measured_at: "2026-07-01T03:30:00Z" }),
  })], "2026-12-31").vitals;
  expect(rows.slice(0, 4).map(r => r.glucose_mg_dl)).toEqual([99, 123, 600, 20]);
  expect(rows[2].glucose_out_of_range).toBe("HI");
  expect(rows[3].glucose_out_of_range).toBe("LO");
  expect(rows[4].local_time).toBe("2026-03-08T02:30");
  expect(rows[5].local_time).toBe("2026-06-30T22:30");
});

test("typed copies merge into device readings, distinct measurements stay separate", () => {
  const rows = transform([item("day", {
    a: bp(), b: bp({ entry_method: "typed", measured_at: "2026-01-01T08:02", pulse_bpm: undefined }),
    c: bp({ measured_at: "2026-01-01T08:02" }),
    d: bp({ entry_method: "typed", measured_at: "2026-01-01T08:03", systolic_mmhg: 121 }),
    e: glu(), f: glu({ entry_method: "typed", measured_at: "2026-01-01T08:01" }),
  })], "2026-12-31").vitals;
  expect(rows).toHaveLength(4);
  expect(rows.filter(r => r.evidence.length === 2)).toHaveLength(2);
  expect(rows.filter(r => r.glucose_mg_dl !== undefined)).toHaveLength(1);
});

test.each([
  [{ name: "famotidine", strength_text: "10 mg", how_i_take_it: "take 2 tablets daily" }, { value: 20, unit: "mg" }, "QD"],
  [{ name: "Ventolin HFA", strength_text: "90 mcg/puff", how_i_take_it: "2 puffs every 6 hours as needed for wheeze" }, { value: 180, unit: "mcg" }, "PRN"],
  [{ name: "cetirizine", strength_text: "10 mg tablet", how_i_take_it: "take in the evening" }, { value: 10, unit: "mg" }, "QD"],
  [{ name: "prednisone", how_i_take_it: "1 tablet each morning" }, { value: 1, unit: "tablet" }, "QD"],
  [{ name: "Lantus", strength_text: "100 units/mL pen", how_i_take_it: "10 units nightly" }, { value: 10, unit: "units" }, "QHS"],
  [{ name: "metformin", strength_text: "500 milligrams", how_i_take_it: "two tablets every 12 hours" }, { value: 1000, unit: "mg" }, "BID"],
  [{ name: "levothyroxine", strength_text: "100 µg", how_i_take_it: "half a tablet each morning" }, { value: 50, unit: "mcg" }, "QD"],
  [{ name: "methotrexate", strength_text: "2.5 mg", how_i_take_it: "4 tablets once weekly" }, { value: 10, unit: "mg" }, "QW"],
  [{ name: "amoxicillin", strength_text: "250 mg/5 mL", how_i_take_it: "5 mL three times daily" }, { value: 250, unit: "mg" }, "TID"],
  [{ name: "metformin", how_i_take_it: "take 2 500 mg tablets b.i.d." }, { value: 1000, unit: "mg" }, "BID"],
  [{ name: "Lantus", strength_text: "100 units/mL", how_i_take_it: "ten units at bedtime" }, { value: 10, unit: "units" }, "QHS"],
  [{ name: "levothyroxine", strength_text: "100 mcg", how_i_take_it: ".5 tablet daily" }, { value: 50, unit: "mcg" }, "QD"],
] as const)("fixed dose and frequency: %j", (entry, expected, schedule) => {
  const result = mapMed(entry);
  expect(result.dose).toEqual(expected);
  expect(result.frequency).toBe(schedule);
});

test.each([
  { name: "albuterol", strength_text: "90 mcg/puff", how_i_take_it: "1–2 puffs as needed" },
  { name: "Naproxen", strength_text: "220 mg", how_i_take_it: "one or two for my knee, most days" },
  { name: "Lantus", strength_text: "100 units/mL pen", how_i_take_it: "nightly" },
  { name: "Humalog", strength_text: "100 units/mL pen", how_i_take_it: "sliding scale with meals" },
  { name: "prednisone", strength_text: "10 mg" },
  { name: "prednisone", strength_text: "10 mg", how_i_take_it: "2 tablets mornings and 1 tablet evenings" },
  { name: "Humalog", how_i_take_it: "2 units if blood sugar is over 200" },
  { name: "prednisone", strength_text: "10 mg", how_i_take_it: "take 1 in the morning and 2 at night" },
  { name: "naproxen", strength_text: "220 mg", how_i_take_it: "as needed" },
])("ambiguous amounts stay absent: %j", entry => { expect(mapMed(entry).dose).toBeUndefined(); });

test("normalizes names, preserves partial status dates, and never derives ingredient codes", () => {
  expect(mapMed({ name: "Glucophage" }).ingredient).toBe("metformin");
  const product = mapMed({ name: "Crestor", picked_from_search: { rxnorm: "859751", display: "rosuvastatin calcium 20 MG Oral Tablet" }, started: "2019-06" });
  expect(product.ingredient).toBe("rosuvastatin");
  expect(product.rxnorm_ingredient).toBeUndefined();
  expect(product.status_since).toBe("2019-06");
  expect(mapMed({ picked_from_search: { rxnorm: "29046", display: "lisinopril" } }).rxnorm_ingredient).toBe("29046");
  expect(mapMed({ name: "water pill" }).ingredient).toBeUndefined();
  expect(mapMed({ name: "Levothyroxine .075 mg tablet" }).ingredient).toBe("levothyroxine");
});

test("paused self-report is held, not assigned a list-save date or permanent stop reason", () => {
  const held = mapMed({ status: "stopped", started: "2019", stopped: "2026-01", note: "Paused until after surgery" });
  expect(held.status).toBe("held");
  expect(held.status_since).toBe("2026-01");
  expect(held.stop_reason).toBeUndefined();
  const taking = mapMed({ started: "2019", note: "Not taking right now, holding until surgery" });
  expect(taking.status).toBe("held");
  expect(taking.status_since).toBeUndefined();
  expect(mapMed({ note: "Hold if blood pressure is low" }).status).toBe("active");
  expect(mapMed({ note: "Temporarily increased the dose" }).status).toBe("active");
  expect(mapMed({ status: "stopped", note: "Stopped because it gave me a rash" }).stop_reason).toBe("adverse_reaction");
});

test("sensitive medicines remain present and are tagged, duplicates collapse", () => {
  const rows = transform([item("list", { a: med({ name: "Seroquel" }), b: med({ name: "quetiapine", status: "stopped", stopped: "2026-01" }) })], "2026-12-31").medications;
  expect(rows).toHaveLength(1);
  expect(rows[0].sensitivity).toEqual(["mental-health"]);
  expect(rows[0].status).toBe("stopped");
});

test("component strengths do not become a total combination dose", () => {
  const rows = transform([item("list", { m: med({ name: "Hyzaar", strength_text: "50/12.5 mg", how_i_take_it: "1 tablet daily" }) })], "2026-12-31").medications;
  expect(rows.map(r => [r.ingredient, r.dose])).toEqual([
    ["hydrochlorothiazide", { value: 12.5, unit: "mg" }], ["losartan", { value: 50, unit: "mg" }],
  ]);
});

test("unexpected JSON values and invalid dates are skipped without throwing", () => {
  const bad: unknown[] = [null, true, 3, "a", [], {}, { id: "bad", issuer: "homelog", recorded: "2026-02-30T00:00Z" },
    item("entries", { a: null, b: "x", c: [], d: bp({ systolic_mmhg: "120" }), e: glu({ value: NaN }), f: bp({ measured_at: "2026-01-01T30:00" }), g: med({ note: [] }) })];
  expect(() => transform(bad as FolioItem[], "2026-12-31")).not.toThrow();
  expect(transform(bad as FolioItem[], "2026-12-31").vitals).toEqual([]);
  expect(transform(null as unknown as FolioItem[], "2026-12-31").medications).toEqual([]);
  expect(transform([], "invalid").vitals).toEqual([]);
});

test("output does not depend on input item or payload key order", () => {
  const a = item("a", { x: bp(), y: glu() });
  const b = item("b", { b: med({ name: "Norvasc" }), a: med() });
  const before = JSON.stringify([a, b]);
  expect(transform([a, b], "2026-12-31")).toEqual(transform([{ ...b, payload: Object.fromEntries(Object.entries(b.payload).reverse()) }, a], "2026-12-31"));
  expect(JSON.stringify([a, b])).toBe(before);
});

test("several manual copies of one device reading report that measurement once", () => {
  const rows = transform([item("day", {
    device: bp(), firstCopy: bp({ entry_method: "typed", measured_at: "2026-01-01T08:01" }),
    secondCopy: bp({ entry_method: "typed", measured_at: "2026-01-01T08:02" }),
  })], "2026-12-31").vitals;
  expect(rows).toHaveLength(1);
  expect(rows[0].evidence).toHaveLength(3);
  expect(rows[0].local_time).toBe("2026-01-01T08:00");
});
