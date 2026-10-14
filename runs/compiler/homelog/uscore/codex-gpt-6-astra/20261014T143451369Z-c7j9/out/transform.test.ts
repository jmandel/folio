import { describe, test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/uscore";
import samples from "../in/samples/samples.json";

const med = (extra: Record<string, unknown> = {}) => ({
  type: "my_med", homelog_med_id: "m1", name: "Metformin", strength_text: "500 mg",
  how_i_take_it: "morning and supper", status: "taking", kind: "prescription", ...extra,
});
const item = (id = "a", payload: any = { m: med() }, extra: Partial<FolioItem> = {}): FolioItem => ({
  folio: "0.1", id, issuer: "did:web:homelog.example", patient: "patient-1",
  effective: "2025-01-01", recorded: "2025-01-01T18:00:00Z", narrative: "", payload, ...extra,
});
const rows = (items: FolioItem[], asOf = "2026-10-13") => transform(items, asOf).medicationRequests;
const one = (extra: Record<string, unknown>) => rows([item("a", { m: med(extra) })])[0];
const q = (extra: Record<string, unknown>) => one(extra).dosageInstruction?.[0].doseAndRate?.[0].doseQuantity;
const f = (extra: Record<string, unknown>) => one(extra).dosageInstruction?.[0].timing?.code.text;

describe("scope and complete snapshots", () => {
  test("winter Chicago end of day, not UTC midnight", () => {
    expect(rows([item("a", undefined, { recorded: "2025-01-02T05:59:59.999Z" })], "2025-01-01")).toHaveLength(1);
    expect(rows([item("a", undefined, { recorded: "2025-01-02T06:00:00Z" })], "2025-01-01")).toHaveLength(0);
  });
  test.each([
    ["2025-07-01", "2025-07-02T04:59:59Z", "2025-07-02T05:00:00Z"],
    ["2025-03-09", "2025-03-10T04:59:59Z", "2025-03-10T05:00:00Z"],
    ["2025-11-02", "2025-11-03T05:59:59Z", "2025-11-03T06:00:00Z"],
  ])("DST cutoff %s", (asOf, before, after) => {
    expect(rows([item("a", undefined, { recorded: before })], asOf)).toHaveLength(1);
    expect(rows([item("a", undefined, { recorded: after })], asOf)).toHaveLength(0);
  });
  test("future corrections do not change the past", () => {
    const a = item();
    const b = item("b", { m: med({ strength_text: "1000 mg" }) }, {
      supersedes: ["a"], effective: "2025-02-01", recorded: "2025-02-01T18:00:00Z",
    });
    expect(rows([b, a], "2025-01-01")[0].dosageInstruction![0].doseAndRate![0].doseQuantity.value).toBe(500);
    expect(rows([b, a])[0].dosageInstruction![0].doseAndRate![0].doseQuantity.value).toBe(1000);
  });
  test("transitive replacement and retraction never resurrect ancestors", () => {
    const a = item();
    const b = item("b", { m: med({ name: "Lisinopril" }) }, { supersedes: ["a"] });
    const c = item("c", {}, { retracts: ["b"] });
    expect(rows([c, a, b])).toHaveLength(0);
  });
  test("correction identifiers are issuer-scoped", () => {
    expect(rows([item(), item("b", {}, { issuer: "did:web:elsewhere", retracts: ["a"] })])).toHaveLength(1);
  });
  test("latest snapshot omits absent medicines, even without explicit supersedes", () => {
    const a = item("a", { a: med(), b: med({ name: "Lisinopril", homelog_med_id: "m2" }) });
    const b = item("b", { b: med({ name: "Lisinopril", homelog_med_id: "m2" }) }, {
      effective: "2025-02-01", recorded: "2025-02-01T18:00:00Z",
    });
    expect(rows([b, a])).toHaveLength(1);
    expect(rows([b, a])[0].medicationCodeableConcept.text).toBe("Lisinopril (lisinopril)");
  });
  test("empty snapshot identified by generated narrative clears the list", () => {
    expect(rows([item(), item("b", {}, {
      narrative: "My Medicines, saved 2 February 2025.",
      recorded: "2025-02-02T18:00:00Z", effective: "2025-02-02",
    })])).toHaveLength(0);
  });
  test("an empty replacement inherits list kind across multiple replacements", () => {
    expect(rows([item("c", {}, { supersedes: ["b"] }), item(), item("b", {}, { supersedes: ["a"] })])).toHaveLength(0);
  });
  test("a later diary page and dose log do not change medication state", () => {
    const day = item("z", { dose: { type: "dose_log", status: "skipped", homelog_med_id: "m1", med_name: "Other" },
      note: { type: "diary_note", symptom_tags: ["pain"] },
      glucose: { type: "glucose_reading", value: 500, unit: "mg/dL" } }, {
      narrative: 'Took insulin and stopped metformin', recorded: "2025-08-01T18:00:00Z",
    });
    expect(rows([item(), day])).toEqual(rows([item()]));
    expect(transform([day], "2026-01-01")).toEqual({ medicationRequests: [], observations: [] });
  });
});

describe("source fidelity and FHIR", () => {
  test("prescriptions and OTC are both reported plans", () => {
    for (const kind of ["prescription", "over_the_counter"]) {
      const row = one({ kind });
      expect(row.intent).toBe("plan"); expect(row.reportedBoolean).toBe(true);
      expect(row.requester).toBeUndefined();
    }
  });
  test("preserve source code and product display; do not add an ingredient CUI", () => {
    const row = one({ name: "Synthroid", strength_text: "75 mg",
      picked_from_search: { rxnorm: "966222", display: "levothyroxine sodium 0.075 MG Oral Tablet" } });
    expect(row.medicationCodeableConcept.coding).toEqual([{
      system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "966222",
      display: "levothyroxine sodium 0.075 MG Oral Tablet",
    }]);
    expect(row.dosageInstruction![0].doseAndRate![0].doseQuantity.value).toBe(75);
  });
  test("ingredient code display is normalized without fabricating a code", () => {
    expect(one({ name: "Zestril", picked_from_search: { rxnorm: "29046", display: "Lisinopril" } })
      .medicationCodeableConcept.coding?.[0]).toEqual({ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "29046", display: "lisinopril" });
  });
  test("a brand-only coded display is not an ingredient code", () => {
    expect(one({ name: "Lantus", picked_from_search: { rxnorm: "261551", display: "Lantus" } })
      .medicationCodeableConcept.coding?.[0].display).toBe("Lantus");
  });
  test("brand normalization with no code", () => {
    expect(one({ name: "Jardiance" }).medicationCodeableConcept).toEqual({ text: "Jardiance (empagliflozin)" });
  });
  test("unknown medicine retained without guessing an ingredient", () => {
    expect(one({ name: "water pill" }).medicationCodeableConcept).toEqual({ text: "water pill" });
  });
  test.each(["2020", "2020-02", "2020-02-29"])("preserve start precision %s", started => {
    expect(one({ started }).authoredOn).toBe(started);
    expect(one({ started, status: "stopped", stopped: "2025-01" }).authoredOn).toBe(started);
  });
  test("snapshot date is not the medication start", () => expect(one({}).authoredOn).toBeUndefined());
  test.each(["2021-02-29", "2020-13", "2020-04-31", "yesterday"])("invalid start %s omitted", started => {
    expect(one({ started }).authoredOn).toBeUndefined();
  });
  test("latest event of duplicate ingredient wins regardless of active status", () => {
    const a = med({ name: "Glucophage", started: "2020", homelog_med_id: "old" });
    const b = med({ status: "stopped", started: "2021", stopped: "2024-12", homelog_med_id: "new" });
    const r = rows([item("a", { a, b })]);
    expect(r).toHaveLength(1); expect(r[0].status).toBe("stopped");
  });
  test("unknown medicines with distinct list ids are retained", () => {
    expect(rows([item("a", { a: med({ name: "water pill" }), b: med({ name: "sleep pill", homelog_med_id: "m2" }) })])).toHaveLength(2);
  });
  test("sensitive medicines are retained", () => expect(one({ name: "Sertraline", restricted: true })).toBeDefined());
});

describe("status semantics", () => {
  test.each(["doctor told me to stop for now", "Paused until next appointment", "On hold since 2025-01-01", "not taking it for now"])("temporary hold: %s", note => {
    expect(one({ note }).status).toBe("on-hold");
    expect(one({ note }).statusReason?.text).toBe(note);
    expect(one({ note }).statusReason?.coding).toBeUndefined();
  });
  test("a stopped checkbox may describe a temporary pause", () => expect(one({ status: "stopped", note: "Temporarily held until labs" }).status).toBe("on-hold"));
  test.each(["Hold if sick", "Was on hold, but restarted", "Not on hold", "Do not stop", "Previously held for tests", "Temporarily taking two tablets", "Was held last month; now taking daily"])("not a current hold: %s", note => {
    expect(one({ note }).status).toBe("active");
  });
  test("a hold described in the directions is still a hold", () => {
    expect(one({ how_i_take_it: "on hold until next visit" }).status).toBe("on-hold");
  });
  test.each([
    ["Made me cough", "adverse_reaction"], ["Not working", "ineffective"],
    ["Switched to another drug", "therapy_changed"], ["Finished the course", "course_complete"],
    ["I decided to stop", "patient_choice"], ["Too expensive", "other"],
  ])("stopped reason: %s", (note, code) => {
    const row = one({ status: "stopped", note });
    expect(row.status).toBe("stopped");
    expect(row.statusReason).toEqual({ text: note, coding: [{ system: "urn:folio:stop-reason", code }] });
  });
});

describe("dosage", () => {
  test.each([
    ["morning", "500 mg", 500, "mg"], ["take 2", "200 mg", 400, "mg"],
    ["2 tablets twice daily", "200 mg", 400, "mg"], ["half a tablet daily", "50 mg", 25, "mg"],
    ["1/2 tablet at bedtime", "50 mg", 25, "mg"], ["one and a half tablets daily", "100 mg", 150, "mg"],
    ["morning", "75 mcg", 75, "ug"], ["500 mg twice daily", "1000 mg", 500, "mg"],
    ["2 500 mg tablets twice daily", "500 mg", 1000, "mg"],
    ["2 tablets of 500 mg each daily", "500 mg", 1000, "mg"],
    ["10 units at bedtime", "100 units/mL pen", 10, "[iU]"],
    ["10 [iU] at bedtime", "100 units/mL pen", 10, "[iU]"],
    ["5 mL twice a day", "20 mg/mL", 5, "mL"],
  ])("%s / %s", (how_i_take_it, strength_text, value, code) => {
    expect(q({ how_i_take_it, strength_text })).toMatchObject({ value, code, system: "http://unitsofmeasure.org" });
  });
  test("unknown strength uses tablet count", () => {
    expect(q({ strength_text: undefined, how_i_take_it: "two tablets daily" })).toMatchObject({ value: 2, code: "{tbl}" });
  });
  test.each(["1 or 2 for my knee, most days", "one to two tablets daily", "1-2 tablets daily", "sliding scale", "1 morning and 2 evening", "1 tablet AM and 2 tablets PM", "10 units morning and 20 at night"])("no single amount: %s", how_i_take_it => {
    expect(q({ how_i_take_it })).toBeUndefined();
  });
  test("strength alone is not dose", () => expect(q({ how_i_take_it: undefined })).toBeUndefined());
  test("insulin concentration is not a bedtime dose", () => expect(q({ name: "Lantus", strength_text: "100 units/mL pen", how_i_take_it: "bedtime" })).toBeUndefined());
  test("puffs are not tablets", () => expect(q({ how_i_take_it: "two puffs as needed" })).toBeUndefined());
  test.each([
    ["morning", "QD"], ["morning and supper", "BID"], ["bedtime", "QHS"],
    ["once weekly", "QW"], ["as needed", "PRN"], ["three times daily", "TID"],
    ["every other day", "other"], ["most days", "other"], ["2 times daily", "BID"],
    ["twice weekly", "other"], ["b.i.d.", "BID"],
  ])("frequency %s", (how_i_take_it, value) => expect(f({ how_i_take_it })).toBe(value));
});

describe("robustness", () => {
  test("sample counts and all samples have no laboratory observations", () => {
    expect(samples.map(g => rows(g.items).length)).toEqual([7, 6]);
    for (const g of samples) expect(transform(g.items, "2026-10-13").observations).toEqual([]);
  });
  test("input item and entry order do not matter; inputs are unchanged", () => {
    for (const g of samples) {
      const before = JSON.stringify(g.items);
      const shuffled = g.items.slice().reverse().map(i => ({ ...i, payload: Object.fromEntries(Object.entries(i.payload).reverse()) }));
      expect(rows(shuffled)).toEqual(rows(g.items));
      expect(JSON.stringify(g.items)).toBe(before);
    }
  });
  test("invalid input safely skipped", () => {
    for (const input of [null, 0, "x", {}, [null, {}, 1], [item("a", { x: null, y: [], z: { type: "my_med", name: 3 } })]]) {
      expect(() => transform(input as any, "2026-01-01")).not.toThrow();
    }
    expect(transform([item()], "bad")).toEqual({ medicationRequests: [], observations: [] });
    expect(rows([item("a", null, { recorded: "bad" })])).toHaveLength(0);
  });
  test("ids are valid and unique even with colliding sanitized names", () => {
    const r = rows([item("a", { a: med({ name: "water pill", homelog_med_id: "x/y" }),
      b: med({ name: "sleep pill", homelog_med_id: "x_y" }), c: med({ name: "new pill", homelog_med_id: "!".repeat(1000) }) })]);
    expect(new Set(r.map(x => x.id)).size).toBe(r.length);
    for (const row of r) expect(row.id).toMatch(/^[A-Za-z0-9.-]{1,64}$/);
  });
});
