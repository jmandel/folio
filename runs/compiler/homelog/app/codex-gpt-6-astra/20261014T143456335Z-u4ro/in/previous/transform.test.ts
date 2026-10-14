import { describe, expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";
import samples from "../in/samples/samples.json";

const issuer = "did:web:homelog.example";
function item(id: string, payload: Record<string, unknown> = {}, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer, patient: "p", effective: "2026-06-01", recorded: "2026-06-02T04:00:00Z", narrative: "", payload, ...extra };
}
function med(extra: Record<string, unknown> = {}) {
  return { type: "my_med", homelog_med_id: "m", name: "Metformin", strength_text: "500 mg", how_i_take_it: "morning", status: "taking", kind: "prescription", ...extra };
}
function bp(extra: Record<string, unknown> = {}) {
  return { type: "bp_reading", measured_at: "2026-06-01T08:00", systolic_mmhg: 122, diastolic_mmhg: 76, pulse_bpm: 65, entry_method: "cuff_sync", ...extra };
}
function glucose(extra: Record<string, unknown> = {}) {
  return { type: "glucose_reading", measured_at: "2026-06-01T08:00", value: 5.6, unit: "mmol/L", entry_method: "meter_sync", ...extra };
}
const run = (items: FolioItem[], day = "2026-12-31") => transform(items, day);
const oneMed = (extra: Record<string, unknown> = {}) => run([item("list", { m: med(extra) })]).medications[0];

describe("scope and replacement", () => {
  test("Chicago end of day in winter and summer, including subsecond boundary", () => {
    for (const [day, before, after] of [
      ["2026-01-01", "2026-01-02T05:59:59.999Z", "2026-01-02T06:00:00Z"],
      ["2026-06-01", "2026-06-02T04:59:59.999Z", "2026-06-02T05:00:00Z"],
      ["2026-03-08", "2026-03-09T04:59:59.999Z", "2026-03-09T05:00:00Z"],
      ["2026-11-01", "2026-11-02T05:59:59.999Z", "2026-11-02T06:00:00Z"],
    ]) {
      const records = [item("before", { b: bp() }, { recorded: before }), item("after", { b: bp() }, { recorded: after })];
      expect(run(records, day).vitals.map(r => r.evidence[0].item_id)).toEqual(["before"]);
    }
  });
  test("future corrections do not change an earlier as-of view", () => {
    const old = item("old", { b: bp() });
    const replacement = item("replacement", { b: bp({ systolic_mmhg: 130 }) }, { supersedes: ["old"], recorded: "2026-06-03T12:00:00Z" });
    expect(run([replacement, old], "2026-06-01").vitals[0].systolic_mmhg).toBe(122);
    expect(run([old, replacement]).vitals[0].systolic_mmhg).toBe(130);
  });
  test("replacement chains and retractions never revive older items", () => {
    const a = item("a", { b: bp() });
    const b = item("b", { b: bp() }, { supersedes: ["a"] });
    const c = item("c", { b: bp() }, { supersedes: ["b"] });
    const d = item("d", {}, { retracts: ["c"] });
    expect(run([c, a, b]).vitals.map(r => r.evidence[0].item_id)).toEqual(["c"]);
    expect(run([c, a, d, b]).vitals).toEqual([]);
  });
  test("correction ids are issuer scoped", () => {
    expect(run([item("a", { b: bp() }), item("withdrawal", {}, { issuer: "did:web:elsewhere.example", retracts: ["a"] })]).vitals).toHaveLength(1);
  });
  test("empty restatements clear medicines; a day page does not", () => {
    const old = item("old", { m: med() });
    expect(run([old, item("day", { b: bp() }, { effective: "2026-06-02" })]).medications).toHaveLength(1);
    expect(run([old, item("new", {}, { supersedes: ["old"] })]).medications).toEqual([]);
    expect(run([old, item("new", {}, { effective: "2026-06-03", narrative: "My Medicines, saved 3 June 2026." })]).medications).toEqual([]);
  });
  test("latest snapshot omits a missing medicine even without a correction link", () => {
    const old = item("old", { a: med(), b: med({ name: "Norvasc" }) }, { effective: "2026-05-01" });
    expect(run([old, item("new", { a: med({ name: "Jardiance" }) })]).medications.map(r => r.ingredient)).toEqual(["empagliflozin"]);
  });
  test("malformed replacement payload still invalidates what it replaces", () => {
    expect(run([item("old", { b: bp() }), item("new", null as any, { supersedes: ["old"] })]).vitals).toEqual([]);
  });
});

describe("home readings", () => {
  test("offset-free phone times remain unchanged, including DST gaps", () => {
    const time = "2026-03-08T02:30";
    expect(run([item("day", { b: bp({ measured_at: time }) })]).vitals[0].local_time).toBe(time);
  });
  test("offset timestamps are converted to Chicago", () => {
    const records = [item("d", { b: bp({ measured_at: "2026-06-01T08:00:00Z" }) })];
    expect(run(records).vitals[0].local_time).toBe("2026-06-01T03:00");
  });
  test("meter clock drift is not repaired or used as the publication cutoff", () => {
    expect(run([item("d", { b: bp({ measured_at: "2028-01-01T08:00" }) })], "2026-06-01").vitals[0].local_time).toBe("2028-01-01T08:00");
  });
  test("units are per reading, and HI/LO values remain limits", () => {
    const rows = run([item("d", {
      a: glucose(), b: glucose({ value: 110, unit: "mg/dL" }),
      c: glucose({ value: 33.3, out_of_range: "HI" }), d: glucose({ value: 1.1, out_of_range: "LO" }),
    })]).vitals;
    expect(rows.map(r => r.glucose_mg_dl)).toEqual([101, 110, 600, 20]);
    expect(rows.map(r => r.glucose_out_of_range)).toEqual([undefined, undefined, "HI", "LO"]);
  });
  test("typed copies prefer devices and keep both evidence references", () => {
    const rows = run([item("d", {
      device: bp(), typed: bp({ measured_at: "2026-06-01T08:02", pulse_bpm: undefined, entry_method: "typed" }),
      repeat: bp({ measured_at: "2026-06-01T08:01" }),
      different: bp({ measured_at: "2026-06-01T08:01", systolic_mmhg: 123, entry_method: "typed" }),
    })]).vitals;
    expect(rows).toHaveLength(3);
    expect(rows.find(r => r.evidence[0].entry_id === "repeat")?.evidence).toEqual([
      { item_id: "d", entry_id: "repeat" }, { item_id: "d", entry_id: "typed" },
    ]);
  });
  test("different arms, pulse values, and typed-only readings stay separate", () => {
    const rows = run([item("d", {
      device: bp({ arm: "left" }), right: bp({ arm: "right", entry_method: "typed" }),
      pulse: bp({ pulse_bpm: 70, entry_method: "typed" }),
      first: bp({ measured_at: "2026-06-01T09:00", entry_method: "typed" }),
      second: bp({ measured_at: "2026-06-01T09:01", entry_method: "typed" }),
    })]).vitals;
    expect(rows).toHaveLength(5);
  });
  test("conversion can match typed and device units, but rounding does not merge distinct source values", () => {
    expect(run([item("d", { device: glucose(), typed: glucose({ value: 101, unit: "mg/dL", entry_method: "typed" }) })]).vitals).toHaveLength(1);
    expect(run([item("d", { device: glucose({ value: 100.1, unit: "mg/dL" }), typed: glucose({ value: 100.4, unit: "mg/dL", entry_method: "typed" }) })]).vitals).toHaveLength(2);
  });
  test("HI and numeric readings are distinct", () => {
    expect(run([item("d", { device: glucose({ value: 600, unit: "mg/dL", out_of_range: "HI" }), typed: glucose({ value: 600, unit: "mg/dL", entry_method: "typed" }) })]).vitals).toHaveLength(2);
  });
  test("BP and glucose do not become a visit set", () => {
    const rows = run([item("d", { b: bp(), g: glucose() })]).vitals;
    expect(rows).toHaveLength(2);
    expect(rows.every(r => !(r.systolic_mmhg && r.glucose_mg_dl))).toBe(true);
  });
});

describe("medicine interpretation", () => {
  test("brands, salts, ingredient codes and product codes", () => {
    expect(oneMed({ name: "Glucophage" }).ingredient).toBe("metformin");
    const product = oneMed({ picked_from_search: { rxnorm: "861004", display: "metformin hydrochloride 1000 MG Oral Tablet" } });
    expect(product.ingredient).toBe("metformin");
    expect(product.rxnorm_ingredient).toBeUndefined();
    expect(oneMed({ picked_from_search: { rxnorm: "6809", display: "metformin" } }).rxnorm_ingredient).toBe("6809");
    expect(oneMed({ name: "water pill" }).ingredient).toBeUndefined();
  });
  test("strength the patient typed wins over the search product", () => {
    const row = oneMed({ name: "Synthroid", strength_text: "75 mg", picked_from_search: { rxnorm: "966222", display: "levothyroxine sodium 0.075 MG Oral Tablet" } });
    expect(row.ingredient).toBe("levothyroxine");
    expect(row.dose).toEqual({ value: 75, unit: "mg" });
  });
  test("single doses and schedules", () => {
    const cases: [Record<string, unknown>, unknown, unknown][] = [
      [{ how_i_take_it: "take 2 twice daily" }, { value: 1000, unit: "mg" }, "BID"],
      [{ how_i_take_it: "half a tablet at bedtime" }, { value: 250, unit: "mg" }, "QHS"],
      [{ how_i_take_it: "1/2 tablet every morning" }, { value: 250, unit: "mg" }, "QD"],
      [{ how_i_take_it: "take two 500 mg tablets twice daily" }, { value: 1000, unit: "mg" }, "BID"],
      [{ how_i_take_it: "take one tablet (500 mg) twice daily" }, { value: 500, unit: "mg" }, "BID"],
      [{ how_i_take_it: "take 2 tablets", strength_text: undefined }, { value: 2, unit: "tablet" }, undefined],
      [{ how_i_take_it: "75 micrograms in the morning" }, { value: 75, unit: "mcg" }, "QD"],
      [{ how_i_take_it: "1 gram every morning" }, { value: 1000, unit: "mg" }, "QD"],
      [{ how_i_take_it: "morning, lunch and supper" }, { value: 500, unit: "mg" }, "TID"],
      [{ how_i_take_it: "every evening at bedtime" }, { value: 500, unit: "mg" }, "QHS"],
      [{ how_i_take_it: "8 am and 8 pm" }, { value: 500, unit: "mg" }, "BID"],
      [{ how_i_take_it: "1 weekly" }, { value: 500, unit: "mg" }, "QW"],
      [{ how_i_take_it: "1 twice weekly" }, { value: 500, unit: "mg" }, "other"],
      [{ how_i_take_it: "one as needed" }, { value: 500, unit: "mg" }, "PRN"],
    ];
    for (const [fields, dose, freq] of cases) {
      const row = oneMed(fields);
      expect(row.dose, String(fields.how_i_take_it)).toEqual(dose);
      expect(row.frequency, String(fields.how_i_take_it)).toBe(freq);
    }
  });
  test("ambiguous amounts, variable regimens and unsupported units are omitted", () => {
    for (const direction of ["1 or 2 as needed", "1-2 daily", "one to two every morning", "sliding scale", "1 morning and 2 evening", "1 in the morning, 2 at night", "2 puffs twice daily", "apply daily", "hold until labs"]) {
      expect(oneMed({ how_i_take_it: direction }).dose, direction).toBeUndefined();
    }
    expect(oneMed({ how_i_take_it: undefined }).dose).toBeUndefined();
  });
  test("insulin concentrations are not ingredients or amounts taken", () => {
    const fields = { name: "Lantus", strength_text: "100 units/mL pen", picked_from_search: { rxnorm: "1234", display: "insulin glargine 100 UNT/ML Injectable Solution" } };
    const row = oneMed({ ...fields, how_i_take_it: "10 units at bedtime" });
    expect(row.ingredient).toBe("insulin glargine");
    expect(row.dose).toEqual({ value: 10, unit: "units" });
    expect(oneMed({ ...fields, how_i_take_it: "bedtime" }).dose).toBeUndefined();
    expect(oneMed({ ...fields, how_i_take_it: "10 [iU] at bedtime" }).dose).toEqual({ value: 10, unit: "units" });
  });
  test("liquids stay in mL", () => {
    expect(oneMed({ name: "drug", strength_text: "10 mg/mL", how_i_take_it: "5 mL twice daily" }).dose).toEqual({ value: 5, unit: "mL" });
  });
  test("combination products yield ingredient rows and component strengths", () => {
    const rows = run([item("l", { m: med({ name: "Hyzaar", strength_text: "50 mg / 12.5 mg" }) })]).medications;
    expect(rows.map(r => [r.ingredient, r.dose])).toEqual([
      ["hydrochlorothiazide", { value: 12.5, unit: "mg" }], ["losartan", { value: 50, unit: "mg" }],
    ]);
  });
  test("holds override taking or stopped, without inventing a start date", () => {
    for (const status of ["taking", "stopped"]) {
      const note = "doctor told me to stop for now";
      const row = oneMed({ status, note, started: "2016" });
      expect(row.status).toBe("held");
      expect(row.status_since).toBeUndefined();
      expect(row.status_reason_text).toBe(note);
      expect(row.stop_reason).toBeUndefined();
    }
    expect(oneMed({ note: "Was paused but restarted yesterday" }).status).toBe("active");
    expect(oneMed({ note: "doctor said not to stop" }).status).toBe("active");
  });
  test("stops, reasons, and date precision", () => {
    const row = oneMed({ status: "stopped", stopped: "2025-10", note: "made me nauseated", kind: "over_the_counter" });
    expect(row.status).toBe("stopped");
    expect(row.status_since).toBe("2025-10");
    expect(row.stop_reason).toBe("adverse_reaction");
    expect(row.patient_reported).toBe(true);
    expect(row.otc).toBe(true);
    expect(oneMed({ started: "2016" }).status_since).toBe("2016");
    expect(oneMed({ status: "stopped", started: "2016" }).status_since).toBeUndefined();
    expect(oneMed({ status: "stopped", note: "No side effects. Course finished." }).stop_reason).toBe("course_complete");
  });
  test("one latest line per ingredient; unknown nicknames remain separate", () => {
    const rows = run([item("l", {
      old: med({ homelog_med_id: "old", name: "Glucophage", status: "stopped", stopped: "2025-10" }),
      current: med({ homelog_med_id: "new", name: "Metformin", started: "2026-02" }),
      a: med({ homelog_med_id: "a", name: "water pill" }),
      b: med({ homelog_med_id: "b", name: "blue pill" }),
    })]).medications;
    expect(rows).toHaveLength(3);
    expect(rows.find(r => r.ingredient === "metformin")?.status).toBe("active");
  });
});

describe("conservative output and robustness", () => {
  test("tags, prose and isolated doses do not create diagnoses, allergies or medicines", () => {
    const rows = run([item("d", {
      note: { type: "diary_note", written_at: "2026-06-01T08:00", symptom_tags: ["nausea", "low_mood"], severity: 5 },
      dose: { type: "dose_log", homelog_med_id: "x", med_name: "insulin glargine", status: "taken", amount: 10, amount_unit: "units" },
    }, { narrative: '<ref id="note">My diabetes is worse. I took more insulin.</ref>' })]);
    expect(rows).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  });
  test("malformed fields do not throw or introduce invalid numbers", () => {
    const values = [null, undefined, false, 0, NaN, Infinity, [], {}, { toString: null }, "", "garbage", "constructor", "__proto__", "toString"];
    for (const value of values) {
      expect(() => transform(value as any, "2026-06-01")).not.toThrow();
      expect(() => transform([item("x", { bad: value })], value as any)).not.toThrow();
      for (const field of ["measured_at", "systolic_mmhg", "diastolic_mmhg", "pulse_bpm", "entry_method"]) {
        expect(() => run([item("x", { b: bp({ [field]: value }) })])).not.toThrow();
      }
      for (const field of ["name", "how_i_take_it", "strength_text", "picked_from_search", "note", "started", "status", "homelog_med_id"]) {
        expect(() => oneMed({ [field]: value })).not.toThrow();
      }
      expect(() => oneMed({ picked_from_search: { display: "metformin", rxnorm: value } })).not.toThrow();
    }
    expect(run([item("x", { b: bp({ measured_at: "2026-02-30T08:00" }), g: glucose({ value: Infinity }) })]).vitals).toEqual([]);
  });
  test("shuffling input and payload keys gives the same rows and does not mutate input", () => {
    const records = [item("a", { b: bp(), t: bp({ entry_method: "typed" }) }), item("l", { m: med() }), item("g", { g: glucose() })];
    const original = JSON.stringify(records);
    const result = run(records);
    expect(JSON.stringify(records)).toBe(original);
    expect(run([...records].reverse().map(i => ({ ...i, payload: Object.fromEntries(Object.entries(i.payload).reverse()) })))).toEqual(result);
  });
  test("sample counts and documented mismatched strength", () => {
    const rows = samples.map(p => run(p.items));
    expect(rows.map(r => r.medications.length)).toEqual([7, 6]);
    expect(rows.map(r => r.vitals.length)).toEqual([2, 6]);
    expect(rows[0].medications.find(r => r.ingredient === "levothyroxine")?.dose).toEqual({ value: 75, unit: "mg" });
  });
});
