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
    expect(result.vitals.length).toBe(2);
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
  expect(stopped.status).toBe("held");
  expect(stopped.status_since).toBe("2026-02");
  expect(stopped.stop_reason).toBeUndefined();
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

function bp(at: string, overrides: Record<string, unknown> = {}) {
  return { type: "bp_reading", measured_at: at, systolic_mmhg: 122, diastolic_mmhg: 72,
    pulse_bpm: 66, entry_method: "cuff_sync", ...overrides };
}

function glucose(at: string, value: number, unit = "mg/dL", overrides: Record<string, unknown> = {}) {
  return { type: "glucose_reading", measured_at: at, value, unit, entry_method: "meter_sync", ...overrides };
}

test("feedback fixtures: expected available home rows and medication statuses", () => {
  const feedback = readFileSync(new URL("../in/feedback.md", import.meta.url), "utf8");
  const patients = new Map<string, FolioItem[]>();
  for (const match of feedback.matchAll(/````markdown\n([\s\S]*?)\n````/g)) {
    const block = match[1];
    const field = (name: string) => new RegExp(`^${name}: "([^"]+)"`, "m").exec(block)?.[1] ?? "";
    const payload = JSON.parse(/```json payload\n([\s\S]*?)\n```/.exec(block)![1]);
    const fixture = item(field("id"), field("recorded"), payload, {
      issuer: field("issuer"), patient: field("patient"), effective: field("effective"),
      supersedes: [...(block.match(/^supersedes:\n((?:  - "[^"\n]+"\n)+)/m)?.[1] ?? "")
        .matchAll(/"([^"]+)"/g)].map(m => m[1]),
    });
    const items = patients.get(fixture.patient) ?? [];
    items.push(fixture);
    patients.set(fixture.patient, items);
  }
  let assertions = 0;
  for (const section of feedback.split(/^## Patient /m).slice(1)) {
    const header = /^([^,]+), (vitals|medications) `([^`]+)`/.exec(section)!;
    const items = patients.get(header[1]) ?? [];
    const output = transform(items, "2026-10-13");
    if (header[2] === "medications") {
      const expected = /status: expected "([^"]+)"/.exec(section)![1];
      expect(output.medications.find(m => m.ingredient === header[3])?.status).toBe(expected);
      assertions++;
    } else {
      const time = header[3].slice("home@".length);
      // Some feedback headings have no supplied source item.
      if (items.some(i => Object.values(i.payload).some(e => e.measured_at === time))) {
        expect(output.vitals.some(v => v.setting === "home" && v.local_time === time)).toBe(true);
        assertions++;
      }
    }
    expect(transform([...items].reverse(), "2026-10-13")).toEqual(output);
  }
  expect(assertions).toBe(11);
  const readings = transform(patients.get("HL-U-13739")!, "2026-10-13").vitals;
  expect(readings.some(v => v.local_time === "2026-07-02T07:13")).toBe(false);
});

test("each home reading is separate, uses its own units, and preserves the phone time", () => {
  const day = item("day", "2026-07-03T06:00:00Z", {
    bp: bp("2026-07-02T07:00"),
    mmol: glucose("2026-07-02T07:00", 7.8, "mmol/L"),
    mg: glucose("2026-07-02T08:00", 165),
    hi: glucose("2026-07-02T09:00", 33.3, "mmol/L", { out_of_range: "HI" }),
    lo: glucose("2026-07-02T10:00", 20, "mg/dL", { out_of_range: "LO" }),
    hiMg: glucose("2026-07-02T11:00", 600, "mg/dL", { out_of_range: "HI" }),
    loMmol: glucose("2026-07-02T12:00", 1.1, "mmol/L", { out_of_range: "LO" }),
  });
  const result = transform([day], "2026-07-03");
  expect(result.vitals).toEqual([
    { setting: "home", local_time: "2026-07-02T07:00", systolic_mmhg: 122, diastolic_mmhg: 72,
      pulse_bpm: 66, evidence: [{ item_id: "day", entry_id: "bp" }] },
    ...[["mmol", "07:00", 141, undefined], ["mg", "08:00", 165, undefined],
      ["hi", "09:00", 600, "HI"], ["lo", "10:00", 20, "LO"],
      ["hiMg", "11:00", 600, "HI"], ["loMmol", "12:00", 20, "LO"]].map(([id, time, value, flag]) => ({
        setting: "home", local_time: `2026-07-02T${time}`, glucose_mg_dl: value,
        ...(flag ? { glucose_out_of_range: flag } : {}), evidence: [{ item_id: "day", entry_id: id }],
      })),
  ]);
  expect(result.labs).toEqual([]);
});

test("device copies replace matching typed copies within two minutes, retaining other repeats", () => {
  const day = item("day", "2026-07-03T06:00:00Z", {
    synced: bp("2026-07-02T07:00", { arm: "left" }),
    typed: bp("2026-07-02T07:01", { entry_method: "typed", pulse_bpm: undefined }),
    typedTwo: bp("2026-07-02T07:02", { entry_method: "typed" }),
    differentArm: bp("2026-07-02T07:01", { entry_method: "typed", arm: "right" }),
    differentPulse: bp("2026-07-02T07:01", { entry_method: "typed", pulse_bpm: 80 }),
    differentBp: bp("2026-07-02T07:01", { entry_method: "typed", systolic_mmhg: 123 }),
    later: bp("2026-07-02T07:03", { entry_method: "typed" }),
    syncedRepeat: bp("2026-07-02T07:02", { arm: "left" }),
    standalone: bp("2026-07-02T08:00", { entry_method: "typed" }),
    standaloneRepeat: bp("2026-07-02T08:01", { entry_method: "typed" }),
  });
  const ids = transform([day], "2026-07-03").vitals.map(v => v.evidence[0].entry_id);
  expect(ids).toEqual(["synced", "differentArm", "differentBp", "differentPulse", "syncedRepeat", "standalone", "standaloneRepeat"]);
  delete (day.payload as Record<string, unknown>).syncedRepeat;
  expect(transform([day], "2026-07-03").vitals.some(v => v.evidence[0].entry_id === "later")).toBe(true);
});

test("glucose deduplication respects numeric values, conversion, and HI/LO flags", () => {
  const day = item("day", "2026-07-03T06:00:00Z", {
    a: glucose("2026-07-02T07:00", 7.8, "mmol/L"),
    b: glucose("2026-07-02T07:01", 7.8, "mmol/L", { entry_method: "typed" }),
    c: glucose("2026-07-02T07:02", 141, "mg/dL", { entry_method: "typed" }),
    d: glucose("2026-07-02T07:01", 142, "mg/dL", { entry_method: "typed" }),
    e: glucose("2026-07-02T08:00", 600, "mg/dL", { out_of_range: "HI" }),
    f: glucose("2026-07-02T08:01", 600, "mg/dL", { entry_method: "typed" }),
    g: glucose("2026-07-02T09:00", 140.1),
    h: glucose("2026-07-02T09:01", 140.2, "mg/dL", { entry_method: "typed" }),
  });
  expect(transform([day], "2026-07-03").vitals.map(v => v.evidence[0].entry_id)).toEqual(["a", "d", "e", "f", "g", "h"]);
});

test("superseded and retracted day pages cannot supply readings or suppress current copies", () => {
  const old = item("old", "2026-07-03T06:00:00Z", { a: bp("2026-07-02T07:00") });
  const replacement = item("new", "2026-07-04T06:00:00Z", {
    b: bp("2026-07-02T07:01", { systolic_mmhg: 125, entry_method: "typed" }),
  }, { supersedes: ["old"] });
  const withdrawal = item("withdrawal", "2026-07-05T06:00:00Z", {}, { retracts: ["new"] });
  const pages = [replacement, withdrawal, old];
  expect(transform(pages, "2026-07-03").vitals[0].systolic_mmhg).toBe(122);
  expect(transform(pages, "2026-07-04").vitals).toEqual([
    { setting: "home", local_time: "2026-07-02T07:01", systolic_mmhg: 125, diastolic_mmhg: 72,
      pulse_bpm: 66, evidence: [{ item_id: "new", entry_id: "b" }] },
  ]);
  expect(transform(pages, "2026-07-05").vitals).toEqual([]);
});

test("unqualified device clock times are not parsed in the host zone, including DST changes", () => {
  for (const time of ["2026-01-02T07:00", "2026-07-02T07:00", "2026-03-08T02:30", "2026-11-01T01:30"]) {
    const reading = item("day", "2026-11-02T12:00:00Z", { bp: bp(time) });
    expect(transform([reading], "2026-11-02").vitals[0].local_time).toBe(time);
  }
});

test("temporary stops use held with source text, without an invented date or stop reason", () => {
  for (const status of ["taking", "stopped"]) {
    for (const note of ["doctor told me to stop for now", "on hold until blood work", "paused", "held", "temporarily stopped for surgery"]) {
      const result = row(med("Kerendia", { status, started: "2020", note }));
      expect(result.status).toBe("held");
      expect(result.status_reason_text).toBe(note);
      expect(result.status_since).toBeUndefined();
      expect(result.stop_reason).toBeUndefined();
    }
  }
  expect(row(med("Lisinopril", { status: "stopped", stopped: "2026-02", note: "on hold" })).status_since).toBe("2026-02");
  for (const note of ["not on hold", "previously paused", "was on hold last week", "on hold; restarted yesterday", "if I get sick, stop for now", "no longer on hold"]) {
    expect(row(med("Lisinopril", { note })).status).toBe("active");
  }
  expect(row(med("Lisinopril", { note: "on hold; not restarted yet" })).status).toBe("held");
  const stopped = row(med("Jardiance", { status: "stopped", stopped: "2024-09", note: "euglycemic DKA" }));
  expect(stopped.stop_reason).toBe("adverse_reaction");
});

test("an undated current list line outranks an explicitly historical stop without fabricating a start", () => {
  const list = item("list", "2026-04-17T16:10:43Z", {
    a: med("Jardiance", { homelog_med_id: "active" }),
    z: med("Jardiance", { homelog_med_id: "old", status: "stopped", stopped: "2024-09", note: "euglycemic DKA" }),
  });
  expect(transform([list], "2026-04-17").medications).toEqual([
    { drug_name: "Jardiance", ingredient: "empagliflozin", status: "active", patient_reported: true,
      evidence: [{ item_id: "list", entry_id: "a" }] },
  ]);
  list.payload.a.started = "2023";
  expect(transform([list], "2026-04-17").medications[0].status).toBe("stopped");
});

test("invalid readings are skipped while valid companion entries survive", () => {
  const day = item("day", "2026-07-03T06:00:00Z", {
    badDate: bp("2026-02-30T07:00"), badTime: bp("2026-07-02T24:00"), badMinute: bp("2026-07-02T12:60"),
    badZone: bp("2026-07-02T07:00Z"), seconds: bp("2026-07-02T07:00:00"),
    infinity: bp("2026-07-02T07:00", { systolic_mmhg: Infinity }),
    missing: bp("2026-07-02T07:00", { diastolic_mmhg: undefined }),
    text: bp("2026-07-02T07:00", { systolic_mmhg: "122" }),
    unit: glucose("2026-07-02T07:00", 7.8, "mmol/dL"),
    nan: glucose("2026-07-02T07:00", NaN),
    overflow: glucose("2026-07-02T07:00", Number.MAX_VALUE, "mmol/L"),
    flag: glucose("2026-07-02T07:00", 600, "mg/dL", { out_of_range: "unknown" }),
    valid: bp("2026-07-02T07:00", { pulse_bpm: NaN }),
  });
  expect(transform([day], "2026-07-03").vitals).toEqual([
    { setting: "home", local_time: "2026-07-02T07:00", systolic_mmhg: 122, diastolic_mmhg: 72,
      evidence: [{ item_id: "day", entry_id: "valid" }] },
  ]);
});
