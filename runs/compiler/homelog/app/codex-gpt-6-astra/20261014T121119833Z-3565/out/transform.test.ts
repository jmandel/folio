import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

function med(name = "Metformin", overrides: Record<string, unknown> = {}) {
  return { type: "my_med", homelog_med_id: name, name, status: "taking", kind: "prescription", ...overrides };
}

function item(id: string, recorded: string, payload: Record<string, unknown> = {}, overrides: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "did:web:homelog.example", patient: "patient",
    effective: recorded.slice(0, 10), recorded, narrative: "", payload, ...overrides };
}

function row(entry: Record<string, unknown>) {
  return transform([item("list", "2026-01-01T12:00:00Z", { entry })], "2026-10-13").medications[0];
}

test("samples: snapshots, self-report, ingredient codes, no strength-as-dose or dose-log override", () => {
  const groups = JSON.parse(readFileSync(new URL("../in/samples/samples.json", import.meta.url), "utf8"));
  expect(groups.map((g: any) => transform(g.items, "2026-10-13").medications.length)).toEqual([4, 5, 7]);
  for (const group of groups) {
    const before = JSON.stringify(group.items);
    const result = transform(group.items, "2026-10-13");
    expect(transform([...group.items].reverse(), "2026-10-13")).toEqual(result);
    expect(JSON.stringify(group.items)).toBe(before);
    expect(result.vitals).toEqual([]);
    expect(result.problems).toEqual([]);
    expect(result.allergies).toEqual([]);
    expect(result.labs).toEqual([]);
    for (const medication of result.medications) expect(medication.patient_reported).toBe(true);
  }
  const ida = transform(groups[2].items, "2026-10-13").medications;
  expect(ida.find(m => m.ingredient === "insulin glargine")?.dose).toEqual({ value: 10, unit: "units" });
  expect(ida.find(m => m.ingredient === "dulaglutide")?.rxnorm_ingredient).toBe("1551291");
  expect(ida.find(m => m.ingredient === "losartan")?.rxnorm_ingredient).toBeUndefined();
  expect(ida.find(m => m.ingredient === "metformin")?.dose).toBeUndefined();
});

test("Chicago scope includes the last instant of the day, across both DST boundaries", () => {
  for (const [asOf, before, after] of [
    ["2026-01-01", "2026-01-02T05:59:59.999Z", "2026-01-02T06:00:00Z"],
    ["2026-07-01", "2026-07-02T04:59:59.999Z", "2026-07-02T05:00:00Z"],
    ["2026-03-08", "2026-03-09T04:59:59.999Z", "2026-03-09T05:00:00Z"],
    ["2026-11-01", "2026-11-02T05:59:59.999Z", "2026-11-02T06:00:00Z"],
  ]) {
    const a = item("a", before, { med: med("Metformin") });
    const b = item("b", after, { med: med("Jardiance") }, { supersedes: ["a"] });
    expect(transform([b, a], asOf).medications.map(m => m.ingredient)).toEqual(["metformin"]);
  }
});

test("recorded is an instant; publication date, not effective date, controls scope", () => {
  const a = item("a", "2026-07-02T06:59:59+02:00", { m: med() }, { effective: "2020-01-01" });
  expect(transform([a], "2026-07-01").medications.length).toBe(1);
  a.recorded = "2026-07-02T07:00:00+02:00";
  expect(transform([a], "2026-07-01").medications).toEqual([]);
});

test("supersession and retraction do not resurrect transitive ancestors", () => {
  const a = item("a", "2026-01-01T12:00:00Z", { m: med() });
  const b = item("b", "2026-01-02T12:00:00Z", { m: med("Jardiance") }, { supersedes: ["a"] });
  const c = item("c", "2026-01-03T12:00:00Z", {}, { retracts: ["b"] });
  const d = item("d", "2026-01-04T12:00:00Z", {}, { retracts: ["c"] });
  expect(transform([c, a, d, b], "2026-01-04").medications).toEqual([]);
  expect(transform([c, a, d, b], "2026-01-01").medications[0].ingredient).toBe("metformin");
  expect(transform([c, a, d, b], "2026-01-02").medications[0].ingredient).toBe("empagliflozin");
});

test("correction references are scoped to issuer", () => {
  const a = item("same-id", "2026-01-01T12:00:00Z", { m: med() });
  const b = item("withdrawal", "2026-01-02T12:00:00Z", {}, { issuer: "did:web:other.example", retracts: ["same-id"] });
  expect(transform([b, a], "2026-01-02").medications.length).toBe(1);
});

test("latest snapshot removes absent drugs even without a supersedes link", () => {
  const old = item("old", "2026-01-01T12:00:00Z", { a: med(), b: med("Jardiance") });
  const latest = item("new", "2026-01-02T12:00:00Z", { a: med() });
  expect(transform([latest, old], "2026-01-02").medications.map(m => m.ingredient)).toEqual(["metformin"]);
});

test("empty snapshots clear the list, recognized by header or correction ancestry", () => {
  const old = item("old", "2026-01-01T12:00:00Z", { a: med() });
  const emptyHeader = item("empty", "2026-01-02T12:00:00Z", {}, { narrative: "My Medicines, saved 2 January 2026." });
  expect(transform([old, emptyHeader], "2026-01-02").medications).toEqual([]);
  const emptyLink = { ...emptyHeader, narrative: "", supersedes: ["old"] };
  const otherOld = item("unlinked-old", "2025-01-01T12:00:00Z", { a: med("Lisinopril") });
  expect(transform([otherOld, emptyLink, old], "2026-01-02").medications).toEqual([]);
});

test("day pages and dose logs do not act as list snapshots or create medicines", () => {
  const list = item("list", "2026-01-01T12:00:00Z", { a: med("Lantus", { how_i_take_it: "10 units at bedtime" }) });
  const day = item("day", "2026-01-02T12:00:00Z", {
    d: { type: "dose_log", homelog_med_id: "Lantus", med_name: "Lantus", status: "skipped", amount: 14, amount_unit: "units" },
    other: { type: "dose_log", med_name: "Advil", status: "taken" },
    note: { type: "diary_note", symptom_tags: ["pain", "short_of_breath"], severity: 5 },
  });
  expect(transform([day, list], "2026-01-02").medications).toEqual(transform([list], "2026-01-02").medications);
  expect(transform([day], "2026-01-02").medications).toEqual([]);
});

test("partial dates and explicit patient status are preserved", () => {
  expect(row(med("Lisinopril", { started: "2020" })).status_since).toBe("2020");
  const stopped = row(med("Lisinopril", { status: "stopped", stopped: "2026-02", note: "Temporarily stopped for surgery" }));
  expect(stopped.status).toBe("stopped");
  expect(stopped.status_since).toBe("2026-02");
  expect(stopped.stop_reason).toBe("other");
  expect(row(med("Lisinopril", { status: "stopped", started: "2020" })).status_since).toBeUndefined();
  expect(row(med("Lisinopril", { started: "2025-02-29" })).status_since).toBeUndefined();
});

test("duplicate ingredients select the line with the latest own event", () => {
  const list = item("list", "2026-06-01T12:00:00Z", {
    z: med("Glucophage", { homelog_med_id: "old", status: "stopped", started: "2020", stopped: "2025-01" }),
    a: med("Metformin", { homelog_med_id: "new", started: "2026-02" }),
  });
  const result = transform([list], "2026-06-01").medications;
  expect(result.length).toBe(1);
  expect(result[0].status).toBe("active");
  expect(result[0].evidence).toEqual([{ item_id: "list", entry_id: "a" }]);
});

test("ambiguous nicknames retain separate source lines without invented identities", () => {
  const list = item("list", "2026-01-01T12:00:00Z", {
    a: med("water pill", { homelog_med_id: "a" }), b: med("water pill", { homelog_med_id: "b" }),
  });
  const result = transform([list], "2026-01-01").medications;
  expect(result.length).toBe(2);
  expect(result.every(m => m.ingredient === undefined)).toBe(true);
});

test("ingredient normalization retains minerals, splits combinations, and excludes product CUIs", () => {
  for (const name of ["potassium chloride", "sodium bicarbonate", "calcium carbonate", "ferrous fumarate"]) {
    expect(row(med(name)).ingredient).toBe(name);
  }
  expect(row(med("Cozaar", { picked_from_search: { display: "losartan potassium 50 MG Oral Tablet", rxnorm: "979492" } })).rxnorm_ingredient).toBeUndefined();
  expect(row(med("Albuterol sulfate")).ingredient).toBe("albuterol");
  const combination = med("Combination", { how_i_take_it: "20 mg / 12.5 mg daily", picked_from_search: { display: "lisinopril 20 MG / hydrochlorothiazide 12.5 MG Oral Tablet", rxnorm: "123456" } });
  const result = transform([item("list", "2026-01-01T12:00:00Z", { combination })], "2026-01-01").medications;
  expect(result.map(m => m.ingredient)).toEqual(["hydrochlorothiazide", "lisinopril"]);
  expect(result.every(m => m.rxnorm_ingredient === undefined)).toBe(true);
  expect(result.every(m => m.dose === undefined)).toBe(true);
});

test("dose requires an explicit single administration amount", () => {
  for (const [text, value, unit] of [
    ["take 2 tablets twice daily", 2, "tablet"], ["half a tablet daily", 0.5, "tablet"],
    ["1/2 tablet daily", 0.5, "tablet"], ["1 1/2 tablets daily", 1.5, "tablet"],
    [".5 mg daily", 0.5, "mg"], ["75 mcg morning", 75, "mcg"],
    ["75 mg morning", 75, "mg"], ["10 [iU] bedtime", 10, "units"],
    ["1 g daily", 1000, "mg"], ["5 mg/mL; take 2 mL daily", 2, "mL"],
    ["two 500 mg tablets twice daily", 2, "tablet"],
  ]) expect(row(med("Metformin", { how_i_take_it: text })).dose).toEqual({ value, unit });
  for (const text of ["1-2 tablets daily", "10 units morning and 15 units evening", "sliding scale", "100 units/mL", "2 puffs of 90 mcg as needed", "-5 mg daily", "2 when my back hurts", "10 mg total daily divided into two doses", "500 mg tablets every morning"]) {
    expect(row(med("Metformin", { how_i_take_it: text })).dose).toBeUndefined();
  }
  expect(row(med("Synthroid", { strength_text: "75 mg", how_i_take_it: "morning" })).dose).toBeUndefined();
});

test("frequency recognizes schedules without turning all daily schedules into once daily", () => {
  for (const [text, expected] of [
    ["morning", "QD"], ["morning and supper", "BID"], ["2 times daily", "BID"],
    ["3 times daily", "TID"], ["at bedtime", "QHS"], ["once a week, Sunday", "QW"],
    ["twice weekly", "other"], ["every other day", "other"], ["as needed", "PRN"],
    ["take one tablet every morning", "QD"], ["10 units", undefined], ["as directed", undefined],
  ]) expect(row(med("Metformin", { how_i_take_it: text })).frequency).toBe(expected);
});

test("stop reasons require a stated reason; unrelated notes and negated reactions are omitted", () => {
  for (const [note, expected] of [
    ["dry cough", "adverse_reaction"], ["did not work", "ineffective"],
    ["switched to losartan", "therapy_changed"], ["finished the course", "course_complete"],
    ["decided to stop", "patient_choice"], ["too expensive", "other"],
    ["prescribed by Dr Smith", undefined], ["no side effects", undefined],
  ]) expect(row(med("Lisinopril", { status: "stopped", note })).stop_reason).toBe(expected);
  expect(row(med("Lisinopril", { note: "dry cough" })).stop_reason).toBeUndefined();
});

test("malformed JSON-like input is skipped without throwing or leaking nonfinite numbers", () => {
  const garbage: unknown[] = [null, 3, "x", [], {}, { id: "x", issuer: "i", recorded: "not a date" },
    item("bad-date", "2026-02-30T12:00:00Z", { m: med() }),
    item("unqualified", "2026-01-01T12:00:00", { m: med() }),
    item("bad-payload", "2026-01-01T12:00:00Z", { a: null, b: [], c: "bad", d: med("Metformin", { name: 4 }), e: med("Metformin", { status: "mystery" }) }),
  ];
  const empty = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  expect(transform(garbage as FolioItem[], "2026-10-13")).toEqual(empty);
  expect(transform(null as any, "2026-10-13")).toEqual(empty);
  expect(transform([], null as any)).toEqual(empty);
  expect(transform([], "2026-02-30")).toEqual(empty);
});
