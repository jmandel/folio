import { describe, expect, test } from "bun:test";
import type { FolioItem } from "../in/views/uscore";
import { transform } from "./transform";

const med = (overrides: Record<string, unknown> = {}) => ({
  type: "my_med", homelog_med_id: "m", name: "Lantus", status: "taking",
  kind: "prescription", ...overrides,
});
const list = (id: string, payload: Record<string, unknown> = { m: med() }, overrides: Partial<FolioItem> = {}): FolioItem => ({
  folio: "0.1", id, issuer: "did:web:homelog.example", patient: "p",
  effective: "2026-01-01", recorded: "2026-01-01T12:00:00Z",
  narrative: "My Medicines, saved 1 January 2026.", payload, ...overrides,
});
const rows = (items: FolioItem[], asOf = "2026-12-31") => transform(items, asOf).medicationRequests;
const one = (overrides: Record<string, unknown>) => rows([list("a", { m: med(overrides) })])[0];
const dosage = (sig: string, overrides: Record<string, unknown> = {}) => one({ how_i_take_it: sig, ...overrides }).dosageInstruction?.[0];

describe("as-of records and complete snapshots", () => {
  test.each([
    ["2026-07-01", "2026-07-02T04:59:59.999Z", "2026-07-02T05:00:00Z"],
    ["2026-01-01", "2026-01-02T05:59:59.999Z", "2026-01-02T06:00:00Z"],
    ["2026-03-08", "2026-03-09T04:59:59.999Z", "2026-03-09T05:00:00Z"],
    ["2026-11-01", "2026-11-02T05:59:59.999Z", "2026-11-02T06:00:00Z"],
  ])("Chicago end of %s", (asOf, before, after) => {
    const a = list("a", { m: med({ name: "Metformin" }) }, { effective: asOf, recorded: before });
    const b = list("b", { m: med({ name: "Losartan" }) }, { effective: asOf, recorded: after, supersedes: ["a"] });
    expect(rows([b, a], asOf).map(r => r.medicationCodeableConcept.text)).toEqual(["Metformin (metformin)"]);
    expect(rows([a, b]).map(r => r.medicationCodeableConcept.text)).toEqual(["Losartan (losartan)"]);
  });

  test("recorded, not effective, controls availability", () => {
    expect(rows([list("a", undefined, { effective: "2025-12-01", recorded: "2026-01-02T06:00:00Z" })], "2026-01-01")).toEqual([]);
  });

  test("offset timestamps describe the same instant", () => {
    expect(rows([list("a", undefined, { recorded: "2026-01-01T23:59:59-06:00" })], "2026-01-01")).toHaveLength(1);
    expect(rows([list("a", undefined, { recorded: "2026-01-02T00:00:00-06:00" })], "2026-01-01")).toHaveLength(0);
  });

  test("a whole new list replaces missing drugs even without correction links", () => {
    const old = list("old", { a: med(), b: med({ homelog_med_id: "b", name: "Losartan" }) });
    const latest = list("latest", { a: med() }, { effective: "2026-02-01", recorded: "2026-02-01T12:00:00Z" });
    expect(rows([latest, old])).toHaveLength(1);
  });

  test("transitive correction and a later retraction never revive ancestors", () => {
    const a = list("a");
    const b = list("b", undefined, { supersedes: ["a"], recorded: "2026-01-02T12:00:00Z" });
    const c = list("c", undefined, { supersedes: ["b"], recorded: "2026-01-03T12:00:00Z" });
    const r = list("r", {}, { narrative: "Withdrawn", retracts: ["c"], recorded: "2026-01-04T12:00:00Z" });
    expect(rows([r, a, c, b])).toHaveLength(0);
    expect(rows([r, a, c, b], "2026-01-02")).toHaveLength(1);
  });

  test("correction IDs are issuer scoped", () => {
    const a = list("same");
    const b = list("remove", {}, { issuer: "did:web:elsewhere", retracts: ["same"], narrative: "Withdrawn" });
    expect(rows([b, a])).toHaveLength(1);
  });

  test("empty list saves clear the list with or without a populated predecessor", () => {
    const a = list("a");
    const b = list("b", {}, { recorded: "2026-01-02T12:00:00Z" });
    expect(rows([a, b])).toHaveLength(0);
    const c = list("c", {}, { narrative: "", supersedes: ["a"], recorded: "2026-01-02T12:00:00Z" });
    expect(rows([a, c])).toHaveLength(0);
  });

  test("day pages, dose logs, and diary assertions cannot replace or create list rows", () => {
    const day = list("day", {
      g: { type: "glucose_reading", value: 7.8, unit: "mmol/L", measured_at: "2026-04-15T08:00", entry_method: "meter_sync" },
      b: { type: "bp_reading", systolic_mmhg: 140, diastolic_mmhg: 90 },
      d: { type: "dose_log", homelog_med_id: "m", med_name: "Lantus", amount: 14, amount_unit: "units", status: "taken" },
      s: { type: "dose_log", homelog_med_id: "m", med_name: "Lantus", status: "skipped" },
      n: { type: "diary_note", symptom_tags: ["pain"] },
    }, { effective: "2026-04-15", recorded: "2026-04-16T12:00:00Z", narrative: "I started Advil and stopped Lantus." });
    const a = list("a", { m: med({ how_i_take_it: "10 units at bedtime" }) });
    expect(transform([day], "2026-12-31")).toEqual({ medicationRequests: [], observations: [] });
    expect(transform([day, a], "2026-12-31")).toEqual(transform([a], "2026-12-31"));
  });
});

describe("medication meaning", () => {
  test("self-reported prescriptions and OTC entries both use plan/reported", () => {
    for (const kind of ["prescription", "over_the_counter"]) {
      const row = one({ kind });
      expect([row.intent, row.reportedBoolean]).toEqual(["plan", true]);
    }
  });

  test("keep stopped status despite a pause note, and never substitute stop date for start", () => {
    const row = one({ status: "stopped", started: "2020-03", stopped: "2026-01", note: "Paused until my appointment" });
    expect(row.status).toBe("stopped");
    expect(row.authoredOn).toBe("2020-03");
    expect(row.statusReason?.[0].text).toBe("Paused until my appointment");
    expect(one({ status: "stopped", stopped: "2026" }).authoredOn).toBeUndefined();
  });

  test.each(["2020", "2020-02", "2020-02-29"])("retain precision: %s", started => {
    expect(one({ started }).authoredOn).toBe(started);
  });

  test("brand/generic aliases merge, with the later documented status event winning", () => {
    const a = med({ name: "Glucophage", homelog_med_id: "z", status: "stopped", stopped: "2025-12" });
    const b = med({ name: "Metformin hydrochloride 500 mg Oral Tablet", homelog_med_id: "a", started: "2026-01" });
    const result = rows([list("a", { old: a, new: b })]);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("active");
    expect(result[0].authoredOn).toBe("2026-01");
  });

  test("unidentified medicines stay separate", () => {
    const result = rows([list("a", { a: med({ name: "water pill", homelog_med_id: "a" }), b: med({ name: "water pill", homelog_med_id: "b" }) })]);
    expect(result).toHaveLength(2);
    expect(result.every(r => r.medicationCodeableConcept.text === "water pill")).toBe(true);
  });

  test("source product codes are retained, without creating ingredient codes", () => {
    const row = one({ name: "Cozaar", picked_from_search: { rxnorm: "979492", display: "losartan potassium 50 MG Oral Tablet" } });
    expect(row.medicationCodeableConcept).toEqual({ text: "Cozaar", coding: [{
      system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "979492", display: "losartan potassium 50 MG Oral Tablet",
    }] });
    expect(one({ name: "Jardiance" }).medicationCodeableConcept).toEqual({ text: "Jardiance (empagliflozin)" });
    expect(one({ name: "Dulaglutide", picked_from_search: { rxnorm: "1551291", display: "Dulaglutide" } }).medicationCodeableConcept.coding?.[0].display).toBe("dulaglutide");
    expect(one({ name: "Search result", picked_from_search: { rxnorm: "123456789", display: "Unlistedgeneric" } }).medicationCodeableConcept.coding?.[0].display).toBe("unlistedgeneric");
  });

  test("combination products do not erase a monotherapy line", () => {
    const result = rows([list("a", {
      a: med({ name: "Jardiance", homelog_med_id: "a" }),
      b: med({ name: "Synjardy", homelog_med_id: "b", picked_from_search: { rxnorm: "12345", display: "empagliflozin 5 MG / metformin hydrochloride 1000 MG Oral Tablet" } }),
    })]);
    expect(result).toHaveLength(2);
  });

  test.each([
    ["dry cough", "adverse_reaction"], ["GI upset", "adverse_reaction"],
    ["did not work", "ineffective"], ["switched to another drug", "therapy_changed"],
    ["finished the course", "course_complete"], ["my choice", "patient_choice"],
    ["could not afford it", "other"],
  ])("stopped reason %s", (note, code) => {
    const row = one({ status: "stopped", note });
    expect(row.statusReason?.[0].text).toBe(note);
    expect(row.statusReason?.[0].coding?.[0].code).toBe(code);
    expect(one({ status: "taking", note }).statusReason).toBeUndefined();
  });

  test.each(["Prescribed by Dr Jones", "no cough", "prescribed for cough"])("note is not a stop reason: %s", note => {
    expect(one({ status: "stopped", note }).statusReason).toBeUndefined();
  });
});

describe("directions and doses", () => {
  test("strength is not dose and a dose log is not a regimen", () => {
    expect(dosage("morning", { strength_text: "75 mg" })?.doseAndRate).toBeUndefined();
    expect(one({ strength_text: "100 units/mL pen" }).dosageInstruction).toBeUndefined();
    const d = dosage("10 units at bedtime", { strength_text: "100 units/mL pen" });
    expect(d?.doseAndRate?.[0].doseQuantity).toEqual({ value: 10, unit: "units", code: "[iU]", system: "http://unitsofmeasure.org" });
  });

  test.each([
    ["75 mg every morning", 75, "mg"], ["75 mcg every morning", 75, "ug"],
    ["half a tablet daily", 0.5, "{tbl}"], ["1 1/2 tablets daily", 1.5, "{tbl}"],
    ["2 capsules twice daily", 2, "{tbl}"], ["2.5 mL once daily", 2.5, "mL"],
    ["10 [iU] at bedtime", 10, "[iU]"], ["10 UNT nightly", 10, "[iU]"],
    ["0.5 g twice daily", 500, "mg"], ["1 tablet morning and 1 tablet evening", 1, "{tbl}"],
  ])("explicit per-administration amount: %s", (sig, value, code) => {
    const q = dosage(sig as string)?.doseAndRate?.[0].doseQuantity;
    expect(q?.value).toBe(value);
    expect(q?.code).toBe(code);
  });

  test.each([
    "1-2 tablets daily", "5 mg morning and 10 mg evening", "100 units/mL pen",
    "500 mg tablets", "2 puffs as needed", "up to 4 tablets daily",
    "10 units on a sliding scale", "1 tablet in the morning and 2 at bedtime",
    "used to take 10 mg daily", "do not take 5 mg",
  ])("no single supported dose: %s", sig => {
    expect(dosage(sig)?.doseAndRate).toBeUndefined();
  });

  test.each([
    ["morning", "QD"], ["morning and supper", "BID"], ["morning, lunch, supper", "TID"],
    ["once a week, Sunday", "QW"], ["bedtime", "QHS"], ["twice daily", "BID"],
    ["three times daily", "TID"], ["every 12 hours", "BID"], ["every 6 hours", "other"],
    ["four times daily", "other"], ["twice weekly", "other"], ["every other morning", "other"],
    ["five times daily", "other"], ["three times weekly", "other"], ["every Sunday and Wednesday", "other"],
    ["daily every 6 hours", "other"],
    ["when my back hurts, a few times a week", "PRN"], ["as needed", "PRN"],
  ])("frequency: %s", (sig, code) => {
    expect(dosage(sig)?.timing?.code.text).toBe(code);
    expect(dosage(sig)?.text).toBe(sig);
  });
});

describe("robustness and determinism", () => {
  test("valid records survive malformed neighbors", () => {
    const malformed: unknown[] = [null, 42, "bad", [], {}, { recorded: null },
      list("bad", { a: null, b: 7, c: { type: "my_med" } }, { recorded: "2026-02-30T12:00:00Z" }),
      list("unscoped", {}, { recorded: "2026-01-01T12:00" }),
    ];
    expect(rows([list("valid"), ...malformed] as FolioItem[])).toHaveLength(1);
    expect(transform(null as unknown as FolioItem[], "2026-01-01")).toEqual({ medicationRequests: [], observations: [] });
    for (const asOf of ["2026", "2026-02-30", "bad", null]) {
      expect(transform([list("a")], asOf as string)).toEqual({ medicationRequests: [], observations: [] });
    }
    expect(one({ started: "2025-02-29" }).authoredOn).toBeUndefined();
  });

  test("unordered input and payload keys produce identical output and valid unique ids", () => {
    const payload = { a: med({ homelog_med_id: "m / 😺", name: "Lantus" }), b: med({ homelog_med_id: "m / 😺", name: "Losartan" }), c: med({ homelog_med_id: "m", name: "Glucophage" }) };
    const a = list("a", payload);
    const day = list("day", { n: { type: "diary_note" } }, { narrative: "", recorded: "2026-01-02T12:00:00Z" });
    const copy = JSON.stringify([a, day]);
    const expected = transform([a, day], "2026-12-31");
    const reversed = { ...a, payload: Object.fromEntries(Object.entries(payload).reverse()) };
    expect(transform([day, reversed], "2026-12-31")).toEqual(expected);
    expect(JSON.stringify([a, day])).toBe(copy);
    expect(new Set(expected.medicationRequests.map(r => r.id)).size).toBe(expected.medicationRequests.length);
    expect(expected.medicationRequests.every(r => /^[A-Za-z0-9.-]{1,64}$/.test(r.id))).toBe(true);
  });
});
