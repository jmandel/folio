import { describe, expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const samples = await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).json() as { patient: string; items: FolioItem[] }[];
const day = "2026-10-13";
const item = (id: string, payload: Record<string, unknown>, recorded = "2026-01-01T12:00:00-06:00", extra = {}): FolioItem => ({
  folio: "0.1", id, issuer: "source", patient: "patient", effective: recorded, recorded, narrative: "", payload, ...extra,
});
function lab(id: string, code = "LK-K", value = "4.5", status = "F", extra: Record<string, unknown> = {}): FolioItem {
  return item(id, {
    req: { type: "LAB_REQ", REQ_ID: `req-${id}`, COLLECTED_AT: "2026-01-01T08:00:00-06:00" },
    order: { type: "LAB_ORDER", ORDER_ID: `order-${id}`, REQ_ID: `req-${id}`, ORDER_STATUS: 4, SPECIMEN_TYPE: "SER", SPECIMEN_COND: "OK" },
    result: { type: "LAB_RESULT", RESULT_ID: `result-${id}`, ORDER_ID: `order-${id}`, TEST_CODE: code, VALUE_TEXT: value, VALUE_NUM: 9999999,
      UNIT_CODE: code.includes("EGFR") ? "mL/min/1.73m2" : code === "LK-PLT" || code === "LK-WBC" ? "K/uL" : "mmol/L", RESULT_STATUS: status, ...extra },
  });
}
function clinic(id: string, rows: Record<string, Record<string, unknown>>, when = "2026-01-01T10:00:00-06:00", visitExtra = {}): FolioItem {
  const payload: Record<string, unknown> = { visit: { type: "CLINIC_VISIT", VISIT_ID: id, VISIT_TYPE: "FU", VISIT_AT: when, ...visitExtra } };
  for (const [key, value] of Object.entries(rows)) payload[key] = { VISIT_ID: id, ...value };
  return item(id, payload, when);
}
const rx = (id = "rx", extra = {}) => ({ type: "MED_ORDER", RX_ID: id, LV_DRUG_ID: "drug", DRUG_NAME: "finerenone 10 mg tablet", MED_STATUS: 1,
  DOSE_QTY: 10, DOSE_UNIT: "mg", FREQ_CODE: "QD", ROUTE: "PO", START_DATE: "2026-01-02", ...extra });
const hist = (status: number, time: string, id = "rx", extra = {}) => ({ type: "MED_STATUS_HIST", HIST_ID: time, RX_ID: id, NEW_STATUS: status, CHANGED_AT: time, REASON_CODE: "LAB", ...extra });
const diagnosis = (code: string, status = "A", text = code) => ({ type: "VISIT_DX", ICD10CM: code, DX_TEXT: text, DX_STATUS: status, DX_RANK: 1 });

describe("samples and historical state", () => {
  test("sample semantics and complete evidence", () => {
    const neph = transform(samples[0].items, day);
    expect(neph.medications).toMatchObject([{ ingredient: "finerenone", status: "held", status_since: "2026-03-03", dose: { value: 10, unit: "mg" } }]);
    expect(neph.problems.find(p => p.icd10cm === "N18.32")).toMatchObject({ ckd_stage: "G3b", albuminuria: "A3" });
    expect(neph.problems.find(p => p.icd10cm === "E11.22")?.onset).toEqual({ value: "2017", precision: "year" });
    expect(neph.vitals.map(v => v.local_time)).toEqual(["2026-01-27T11:04", "2026-07-13T10:44"]);
    expect(neph.labs).toEqual([]); // Never fabricate the labs mentioned only in prose.
    const result = transform(samples[1].items, day);
    expect(result.labs).toHaveLength(35);
    expect(result.labs.filter(l => l.analyte === "egfr")).toHaveLength(5);
    expect(result.labs.find(l => l.analyte === "egfr")).toMatchObject({ value: 60, comparator: ">", egfr_equation: "ckd-epi-2009", loinc: "48642-3" });
    expect(result.labs.find(l => l.analyte === "platelets")).toMatchObject({ value: 259, unit: "10*3/uL" });
    expect(result.labs.filter(l => l.analyte === "potassium" && l.collected.startsWith("2024"))).toEqual([]);
    for (const group of samples) {
      const output = transform(group.items, day);
      for (const rows of Object.values(output)) for (const row of rows) {
        expect(row.evidence.length).toBeGreaterThan(0);
        for (const e of row.evidence) expect(group.items.find(i => i.id === e.item_id)?.payload[e.entry_id!]).toBeDefined();
      }
    }
  });
  test("hold is not applied before publication and does not expire at review", () => {
    expect(transform(samples[0].items, "2026-03-02").medications[0].status).toBe("active");
    expect(transform(samples[0].items, "2026-03-17").medications[0].status).toBe("held");
  });
  test("permutations of items and payload keys do not change output", () => {
    for (const group of samples) {
      const reversed = group.items.toReversed().map(i => ({ ...i, payload: Object.fromEntries(Object.entries(i.payload).reverse()) }));
      expect(transform(reversed, day)).toEqual(transform(group.items, day));
      expect(transform([...reversed, ...reversed], day)).toEqual(transform(group.items, day));
    }
  });
});

describe("FOLIO corrections and Chicago cutoffs", () => {
  test.each([
    ["2026-01-01", "2026-01-02T05:59:59.999Z", "2026-01-02T06:00:00Z"],
    ["2026-07-01", "2026-07-02T04:59:59.999Z", "2026-07-02T05:00:00Z"],
    ["2026-03-08", "2026-03-09T04:59:59.999Z", "2026-03-09T05:00:00Z"],
    ["2026-11-01", "2026-11-02T05:59:59.999Z", "2026-11-02T06:00:00Z"],
  ])("uses local end of day %s", (asOf, inside, outside) => {
    const a = lab("a"), b = lab("b");
    a.recorded = inside; b.recorded = outside;
    expect(transform([b, a], asOf).labs).toHaveLength(1);
  });
  test("corrections are bounded by publication, including transitive retractions", () => {
    const a = lab("a");
    const b = { ...structuredClone(a), id: "b", recorded: "2026-02-01T12:00:00-06:00", supersedes: ["a"] };
    b.payload.result.VALUE_TEXT = "5.1";
    const c = item("c", {}, "2026-03-01T12:00:00-06:00", { retracts: ["b"] });
    const d = item("d", {}, "2026-04-01T12:00:00-05:00", { retracts: ["c"] });
    expect(transform([d, c, b, a], "2026-01-31").labs[0].value).toBe(4.5);
    expect(transform([d, c, b, a], "2026-02-28").labs[0].value).toBe(5.1);
    expect(transform([d, c, b, a], "2026-03-01").labs).toEqual([]);
    expect(transform([d, c, b, a], day).labs).toEqual([]);
  });
  test("a different issuer cannot retract a source item", () => {
    expect(transform([lab("a"), item("b", {}, undefined, { issuer: "other", retracts: ["a"] })], day).labs).toHaveLength(1);
  });
});

describe("lab validity and values", () => {
  test("all result statuses and order validity are independent", () => {
    const items = ["P", "F", "A", "C", "X"].map(s => lab(s, "LK-K", "4.5", s));
    const voided = lab("void"); voided.payload.order.ORDER_STATUS = 9;
    const inProcess = lab("process", "LK-K", "4.8", "P"); inProcess.payload.order.ORDER_STATUS = 3;
    const rows = transform([...items, voided, inProcess], day).labs;
    expect(rows).toHaveLength(4);
    expect(rows.filter(r => r.status === "preliminary")).toHaveLength(2);
  });
  test("comparator text is authoritative, and nonnumeric values are skipped", () => {
    const items = [lab("a", "LK-EGFR21", ">90"), lab("b", "LK-K", "<=0.1"), lab("c", "LK-K", "See comment"), lab("d", "LK-K", "12junk")];
    expect(transform(items, day).labs).toMatchObject([{ analyte: "egfr", value: 90, comparator: ">" }, { analyte: "potassium", value: .1, comparator: "<=" }]);
  });
  test("race variants, old mappings, and method overrides", () => {
    const result = transform([
      lab("a", "LK-EGFR09N", "53", "F", { COMMENT_TEXT: "Calculated by CKD-EPI 2009.", LOINC: "48642-3" }),
      lab("b", "LK-EGFR09A", "62"),
      lab("c", "LK-EGFR21", "58", "A", { COMMENT_TEXT: "Calculated using MDRD equation." }),
    ], day).labs;
    expect(result).toHaveLength(2);
    expect(result.find(l => l.value === 53)?.egfr_equation).toBe("ckd-epi-2009");
    expect(result.find(l => l.value === 58)?.egfr_equation).toBe("mdrd");
    expect(result.find(l => l.value === 58)?.loinc).toBeUndefined();
  });
  test("hemolysis alone and confirmation repeats do not invalidate a value", () => {
    const a = lab("a", "LK-K", "6.0"), b = lab("b", "LK-K", "5.9");
    a.payload.order.SPECIMEN_COND = "HEM";
    b.payload.order.REPEAT_OF_ORDER_ID = "order-a"; b.payload.order.REPEAT_REASON = "CONF";
    expect(transform([b, a], day).labs).toHaveLength(2);
  });
  test("final beats a duplicate preliminary and withdrawn beats final", () => {
    const a = lab("a"), b = { ...structuredClone(a), id: "b", recorded: "2026-01-02T12:00:00-06:00" };
    b.payload.result.RESULT_STATUS = "P";
    expect(transform([a, b], day).labs).toHaveLength(1);
    expect(transform([a, b], day).labs[0].status).toBe("final");
    b.payload.result.RESULT_STATUS = "C";
    expect(transform([a, b], day).labs).toEqual([]);
  });
  test("bad units and dangling orders do not generate rows", () => {
    const a = lab("a"), b = lab("b");
    a.payload.result.UNIT_CODE = "mg/dL";
    delete b.payload.order;
    expect(transform([a, b], day).labs).toEqual([]);
  });
});

describe("medication event history", () => {
  const start = clinic("start", { rx: rx() });
  test("resume, hold, and stop use change dates and preserve dose", () => {
    const hold = clinic("hold", { history: hist(3, "2026-02-01T10:01:00-06:00", "rx", { REVIEW_DATE: "2026-02-02" }) }, "2026-02-01T10:00:00-06:00");
    const resume = clinic("resume", { history: hist(1, "2026-03-01T10:01:00-06:00") }, "2026-03-01T10:00:00-06:00");
    const stop = clinic("stop", { history: hist(2, "2026-04-01T10:01:00-05:00", "rx", { REASON_CODE: "PT", COMMENT_TEXT: "Patient requested stop" }) }, "2026-04-01T10:00:00-05:00");
    expect(transform([hold, start], day).medications[0]).toMatchObject({ status: "held", status_since: "2026-02-01" });
    expect(transform([resume, hold, start], day).medications[0]).toMatchObject({ status: "active", status_since: "2026-03-01" });
    expect(transform([stop, resume, hold, start], day).medications[0]).toMatchObject({ status: "stopped", stop_reason: "patient_choice", status_since: "2026-04-01", dose: { value: 10, unit: "mg" } });
  });
  test("an older prescription with a later event wins, but voids never suppress a valid line", () => {
    const newer = clinic("newer", { rx: rx("new", { DOSE_QTY: 20 }) }, "2026-02-01T10:00:00-06:00");
    const oldStop = clinic("stop", { history: hist(2, "2026-03-01T10:01:00-06:00") }, "2026-03-01T10:00:00-06:00");
    expect(transform([start, newer, oldStop], day).medications[0]).toMatchObject({ status: "stopped", dose: { value: 10 } });
    const voidNew = clinic("void", { history: hist(9, "2026-04-01T10:01:00-05:00", "new") }, "2026-04-01T10:00:00-05:00");
    expect(transform([start, newer, voidNew], day).medications[0].dose?.value).toBe(10);
    const enteredError = clinic("error", { rx: rx("error", { MED_STATUS: 9 }) }, "2026-05-01T10:00:00-05:00");
    expect(transform([start, enteredError], day).medications).toHaveLength(1);
  });
  test("brand names, salt removal, units, and product RxNorm", () => {
    const data = clinic("meds", { a: rx("a", { DRUG_NAME: "Jardiance 10 mg tablet", RXNORM: "product-code" }),
      b: rx("b", { DRUG_NAME: "losartan potassium 50 mg tablet" }),
      c: rx("c", { DRUG_NAME: "insulin glargine 100 unit/mL injection", DOSE_QTY: 12, DOSE_UNIT: "unit", ROUTE: "SC" }) });
    const rows = transform([data], day).medications;
    expect(rows.map(r => r.ingredient)).toEqual(["empagliflozin", "insulin glargine", "losartan"]);
    expect(rows[1].dose).toEqual({ value: 12, unit: "units" });
    expect(rows.every(r => r.rxnorm_ingredient === undefined)).toBe(true);
  });
  test("mineral ingredients are preserved and release forms are removed", () => {
    const data = clinic("meds", { a: rx("a", { DRUG_NAME: "calcium acetate 667 mg capsule" }),
      b: rx("b", { DRUG_NAME: "metoprolol succinate ER 50 mg tablet" }),
      c: rx("c", { DRUG_NAME: "ferrous sulfate 325 mg tablet" }) });
    expect(transform([data], day).medications.map(r => r.ingredient)).toEqual(["calcium acetate", "ferrous sulfate", "metoprolol"]);
  });
  test("combination names produce one row per ingredient without ambiguous component doses", () => {
    for (const name of ["losartan potassium / hydrochlorothiazide 50/12.5 mg tablet", "losartan potassium 50 mg / hydrochlorothiazide 12.5 mg tablet", "Hyzaar 50/12.5 mg tablet"]) {
      const rows = transform([clinic("meds", { rx: rx("combo", { DRUG_NAME: name }) })], day).medications;
      expect(rows.map(r => r.ingredient)).toEqual(["hydrochlorothiazide", "losartan"]);
      expect(rows.every(r => r.dose === undefined)).toBe(true);
    }
  });
  test("retracted status events and retracted prescription lines", () => {
    const hold = clinic("hold", { history: hist(3, "2026-02-01T10:01:00-06:00") }, "2026-02-01T10:00:00-06:00");
    const undo = item("undo", {}, "2026-03-01T12:00:00-06:00", { retracts: ["hold"] });
    expect(transform([start, hold, undo], day).medications[0].status).toBe("active");
    undo.retracts = ["start"];
    expect(transform([start, hold, undo], day).medications).toEqual([]);
  });
});

describe("problems and clinic vitals", () => {
  test("restaging gives one CKD row and carries forward a missing assessment", () => {
    const a = clinic("a", { dx: diagnosis("N18.31", "A", "CKD stage 3a") }, undefined, { CKD_G: "G3a", CKD_A: "A2" });
    const b = clinic("b", { dx: diagnosis("N18.32", "A", "CKD stage 3b") }, "2026-02-01T10:00:00-06:00", { CKD_G: "G3b" });
    const c = clinic("c", {}, "2026-03-01T10:00:00-06:00", { VISIT_TYPE: "TEL" });
    expect(transform([c, b, a], day).problems).toMatchObject([{ icd10cm: "N18.32", ckd_stage: "G3b", albuminuria: "A2" }]);
  });
  test("provisional, ruled out, and historical diagnosis states", () => {
    const a = clinic("a", { p: diagnosis("A00", "P"), r: diagnosis("B00", "R"), h: diagnosis("C00", "H"), c: diagnosis("D00", "A") });
    const b = clinic("b", { r: diagnosis("D00", "R") }, "2026-02-01T10:00:00-06:00");
    expect(transform([a, b], day).problems).toMatchObject([{ icd10cm: "C00", status: "resolved" }]);
  });
  test("adverse effect diagnoses are reactions, not problems", () => {
    const a = clinic("a", { dx: diagnosis("T38.3X5A", "A", "Adverse effect of empagliflozin, initial encounter"), illness: diagnosis("E11.10", "A", "Type 2 diabetes mellitus with ketoacidosis without coma") });
    const rows = transform([a], day);
    expect(rows.problems).toHaveLength(1);
    expect(rows.allergies).toMatchObject([{ substance: "empagliflozin", type: "adverse_reaction", criticality: "unknown" }]);
  });
  test("BP reading numbers pair correctly, use BP time, and retain last repeat", () => {
    const vital = (code: string, n: number, value: number, time: string) => ({ type: "VITAL", VITAL_CODE: code, READING_NO: n, VALUE_NUM: value, UNIT_CODE: code === "WT" ? "kg" : code === "HR" ? "/min" : "mmHg", TAKEN_AT: time });
    const a = clinic("a", {
      wt: vital("WT", 1, 82.26, "2026-01-01T16:01:00Z"), s1: vital("BPS", 1, 140, "2026-01-01T16:03:00Z"), d1: vital("BPD", 1, 90, "2026-01-01T16:03:00Z"),
      s2: vital("BPS", 2, 135, "2026-01-01T16:10:00Z"), d2: vital("BPD", 2, 85, "2026-01-01T16:10:00Z"),
      s3: vital("BPS", 3, 130, "2026-01-01T16:15:00Z"), d3: vital("BPD", 3, 80, "2026-01-01T16:15:00Z"),
    });
    expect(transform([a], day).vitals).toMatchObject([{ local_time: "2026-01-01T10:03", systolic_mmhg: 140, diastolic_mmhg: 90, repeat_systolic_mmhg: 130, repeat_diastolic_mmhg: 80, weight_kg: 82.3 }]);
    delete a.payload.d1; delete a.payload.s2; delete a.payload.s3; delete a.payload.d3;
    const row = transform([a], day).vitals[0];
    expect(row.diastolic_mmhg).toBeUndefined();
    expect(row.repeat_systolic_mmhg).toBeUndefined();
    expect(row.repeat_diastolic_mmhg).toBe(85);
  });
});

test("malformed JSON-shaped inputs are skipped without throwing or contaminating readable rows", () => {
  const bad = [null, 4, "text", [], {}, { recorded: "yesterday", id: "a", issuer: "source" }, item("broken", { bad: null, other: [], number: 3 }),
    item("bad-date", {}, "2026-02-30T10:00:00-06:00")];
  for (const value of [null, {}, "", 5]) expect(transform(value as FolioItem[], day)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  expect(transform([...bad, lab("good")] as FolioItem[], day).labs).toHaveLength(1);
  expect(transform([lab("good")], "not-a-date").labs).toEqual([]);
  const fuzzValues = [null, [], {}, true, 0, "", "unrecognized", Number.NaN, Number.POSITIVE_INFINITY];
  const fixtures = [lab("fuzz"), clinic("fuzz", { rx: rx(), dx: diagnosis("N18.32") })];
  for (const fixture of fixtures) for (const [id, row] of Object.entries(fixture.payload)) {
    for (const field of Object.keys(row)) for (const value of fuzzValues) {
      const copy = structuredClone(fixture); copy.payload[id][field] = value;
      expect(() => transform([copy], day)).not.toThrow();
    }
  }
});
