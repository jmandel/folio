import { test, expect } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/uscore";

const issuer = "did:web:riverside-regional.example";
const day = "2025-01-10";
const med = (status = "continue", extra = {}) => ({
  type: "home_med", drug_name: "metformin 500 mg tablet", rxnorm_ingredient: "6809",
  dose_text: "1000 mg", sig: "2 tabs PO BID with meals", status, ...extra,
});
const enc = (kind = "hp", id = "stay") => ({ type: "encounter", encounter_id: id, document_kind: kind, class: "inpatient", service: "Hospital Medicine" });
const lab = (extra = {}) => ({
  type: "result", accession: "acc", collected: "2025-01-10T12:00:00Z", specimen: "serum", status: "final",
  test: { local_code: "CREAT", loinc: "2160-0", name: "Creatinine" }, value: "1.2", unit: "mg/dL", ...extra,
});
const doc = (id: string, payload: Record<string, unknown>, extra = {}): FolioItem => ({
  folio: "0.1", id, issuer, patient: "patient", effective: "2025-01-10T11:00:00Z",
  recorded: "2025-01-10T15:00:00Z", narrative: "", payload, ...extra,
});
const run = (items: FolioItem[], asOf = day) => transform(items, asOf);

test("samples: final home list, no hospital-only insulin, copied results emitted once", async () => {
  const [{ items }] = await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).json();
  const out = run(items, "2026-10-13");
  expect(out.medicationRequests).toHaveLength(4);
  expect(out.observations).toHaveLength(49);
  const empa = out.medicationRequests.find(x => x.medicationCodeableConcept.coding?.some(c => c.code === "1545653"));
  expect(empa?.status).toBe("on-hold");
  expect(empa?.statusReason).toEqual({ text: "Recommend against restarting at discharge" });
  expect(out.observations.filter(x => x.code.text === "bhb")).toHaveLength(1);
  expect(out.medicationRequests.every(x => !x.authoredOn)).toBe(true);
  expect(run([...items].reverse(), "2026-10-13")).toEqual(out);
  for (let i = 0; i < items.length; i++) {
    const shuffled = [...items.slice(i), ...items.slice(0, i)].map(x => ({
      ...x, payload: Object.fromEntries(Object.entries(x.payload).reverse()),
    }));
    expect(run(shuffled, "2026-10-13")).toEqual(out);
  }
  const discharge = run(items, "2023-04-12").medicationRequests;
  expect(discharge).toHaveLength(3);
  expect(discharge.find(x => x.medicationCodeableConcept.coding?.[0].code === "6809")?.status).toBe("active");
});

test("recorded time, not effective time, controls Chicago end-of-day scope", () => {
  for (const [date, end, next] of [
    ["2025-01-10", "2025-01-11T05:59:59Z", "2025-01-11T06:00:00Z"],
    ["2025-07-10", "2025-07-11T04:59:59Z", "2025-07-11T05:00:00Z"],
    ["2025-03-09", "2025-03-10T04:59:59Z", "2025-03-10T05:00:00Z"],
    ["2025-11-02", "2025-11-03T05:59:59Z", "2025-11-03T06:00:00Z"],
  ]) {
    const a = doc("a", { enc: enc(), m: med() }, { recorded: end });
    const b = doc("b", { enc: enc() }, { recorded: next });
    expect(run([b, a], date).medicationRequests).toHaveLength(1);
  }
  const future = doc("future", { r: lab() }, { effective: "2020-01-01", recorded: "2025-01-12T00:00:00Z" });
  expect(run([future]).observations).toHaveLength(0);
});

test("transitive supersession and retraction do not resurrect older documents", () => {
  const a = doc("a", { r: lab({ value: "1" }) });
  const b = doc("b", { r: lab({ value: "2" }) }, { recorded: "2025-01-10T16:00:00Z", supersedes: ["a"] });
  const c = doc("c", {}, { recorded: "2025-01-11T16:00:00Z", retracts: ["b"] });
  expect(run([a, c, b]).observations[0].valueQuantity.value).toBe(2);
  expect(run([c, a, b], "2025-01-11").observations).toHaveLength(0);
  const foreign = { ...c, recorded: b.recorded, issuer: "did:web:another.example", retracts: ["a"] };
  expect(run([foreign, a]).observations).toHaveLength(1);
});

test("a correction restates the whole document; removed entries do not leak through", () => {
  const a = doc("a", { enc: enc(), m: med(), r: lab() });
  const b = doc("b", { enc: enc() }, { supersedes: ["a"], recorded: "2025-01-10T16:00:00Z" });
  expect(run([a, b])).toEqual({ medicationRequests: [], observations: [] });
});

test("discharge wins within an encounter, and a newer encounter replaces its snapshot", () => {
  const discharge = doc("discharge", { enc: enc("discharge_summary"), m: med("continue") });
  const lateConsult = doc("consult", { enc: enc("consult"), renamed: med("held") }, { recorded: "2025-01-10T16:00:00Z" });
  expect(run([lateConsult, discharge]).medicationRequests[0].status).toBe("active");
  const nextStay = doc("next", { enc: enc("ed_note", "next-stay"), m: med("not_reconciled") }, { recorded: "2025-01-10T17:00:00Z" });
  const request = run([nextStay, lateConsult, discharge]).medicationRequests[0];
  expect(request.status).toBe("unknown"); expect(request.intent).toBe("plan");
  expect(request.reportedBoolean).toBe(true); expect(request.requester).toBeUndefined();
  const empty = doc("empty", { context: enc("hp", "next-stay") }, { recorded: "2025-01-10T18:00:00Z" });
  expect(run([nextStay, lateConsult, empty, discharge]).medicationRequests).toHaveLength(0);
});

test("held advice is not discontinuation; stopped reason and requester are preserved", () => {
  const held = run([doc("a", { enc: enc(), m: med("held", { restart_advice: "advise_against", instructions: "Recommend against restarting" }) })]).medicationRequests[0];
  expect(held.status).toBe("on-hold"); expect(held.statusReason?.coding).toBeUndefined();
  const stopped = run([doc("a", { enc: enc(), m: med("stopped", { instructions: "Stopped due to adverse reaction" }) }, { author: { name: "Jane Doe, MD" } })]).medicationRequests[0];
  expect(stopped.status).toBe("stopped"); expect(stopped.intent).toBe("order");
  expect(stopped.requester).toEqual({ display: "Jane Doe, MD" });
  expect(stopped.statusReason?.coding?.[0].code).toBe("adverse_reaction");
});

test("one row per ingredient, changed dose wins; source key is not a medication identity", () => {
  const a = doc("a", { enc: enc(), old: med("stopped"), new: med("changed", { dose_text: "500 mg", sig: "1 tab daily" }) });
  const rows = run([a]).medicationRequests;
  expect(rows).toHaveLength(1); expect(rows[0].status).toBe("active");
  expect(rows[0].dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.value).toBe(500);
  const b = doc("b", { enc: enc(), completely_different_key: med("changed", { dose_text: "500 mg", sig: "1 tab daily" }) });
  expect(run([b]).medicationRequests[0].id).toBe(rows[0].id);
});

test("dose units, tablet strength and frequency are normalized without truncating ranges", () => {
  for (const [dose, name, sig, quantity, frequency] of [
    ["2 tabs", "metformin 500 mg tablet", "2 tabs PO BID", { value: 1000, code: "mg" }, "BID"],
    ["1/2 tablet", "metformin 500 mg tablet", "q24h", { value: 250, code: "mg" }, "QD"],
    ["10 [iU]", "insulin", "at bedtime", { value: 10, code: "[iU]" }, "QHS"],
    ["50 mcg", "levothyroxine", "daily", { value: 50, code: "ug" }, "QD"],
    ["5 mL", "drug solution", "PRN", { value: 5, code: "mL" }, "PRN"],
  ] as const) {
    const row = run([doc("a", { enc: enc(), m: med("continue", { dose_text: dose, drug_name: name, sig }) })]).medicationRequests[0];
    expect(row.dosageInstruction?.[0].doseAndRate?.[0].doseQuantity).toMatchObject(quantity);
    expect(row.dosageInstruction?.[0].timing?.code.text).toBe(frequency);
  }
  for (const dose of ["1 or 2 tablets", "5-10 mg", "10 units AM, 20 units PM", "per sliding scale"]) {
    const row = run([doc("a", { enc: enc(), m: med("continue", { dose_text: dose }) })]).medicationRequests[0];
    expect(row.dosageInstruction?.[0].doseAndRate).toBeUndefined();
  }
});

test("no invented RxNorm; brand displays use generic ingredient names", () => {
  const rows = run([doc("a", { enc: enc(), m: med("new", { drug_name: "Jardiance 10 mg tablet", rxnorm_ingredient: undefined }) })]).medicationRequests;
  expect(rows[0].medicationCodeableConcept).toEqual({ text: "Jardiance 10 mg tablet (empagliflozin)" });
});

test("corrected beats final beats preliminary, independent of document order", () => {
  const a = doc("a", { r: lab({ status: "corrected", value: "1.1" }) });
  const b = doc("b", { r: lab({ value: "2.2" }) }, { recorded: "2025-01-10T16:00:00Z" });
  const c = doc("c", { r: lab({ status: "preliminary", value: "3.3" }) }, { recorded: "2025-01-10T17:00:00Z" });
  const out = run([c, a, b]).observations;
  expect(out).toHaveLength(1); expect(out[0].status).toBe("final"); expect(out[0].valueQuantity.value).toBe(1.1);
  const corrected = doc("d", { r: lab({ status: "corrected", value: "Hemolyzed, see comment" }) }, { recorded: "2025-01-10T18:00:00Z" });
  expect(run([corrected, c, b, a]).observations).toHaveLength(0);
});

test("panel and standalone copies deduplicate; separate accessions remain separate", () => {
  const result = lab();
  const panel = { type: "panel", accession: result.accession, collected: result.collected, status: "final", specimen: "serum", components: [result] };
  const out = run([doc("a", { panel, result, repeat: lab({ accession: "confirmation" }) })]).observations;
  expect(out).toHaveLength(2);
  expect(new Set(out.map(x => x.id)).size).toBe(2);
});

test("comparator, missing LOINC, unitless pH and nonnumeric results", () => {
  const out = run([doc("a", {
    bhb: lab({ accession: "b", test: { local_code: "BHB", name: "Beta-hydroxybutyrate" }, value: ">= 4.2", unit: "mmol/L" }),
    ph: lab({ accession: "p", test: { local_code: "VPH", name: "pH, venous" }, value: "7.21", unit: undefined, specimen: "venous blood" }),
    invalid: lab({ accession: "i", value: "1.2 (see comment)" }),
    unknown: lab({ accession: "u", test: { local_code: "BILI", name: "Bilirubin", loinc: "1975-2" } }),
    urine: lab({ accession: "urine", specimen: "urine", test: { local_code: "UCREAT", name: "Urine creatinine" } }),
  })]).observations;
  expect(out).toHaveLength(2);
  const bhb = out.find(x => x.code.text === "bhb")!;
  expect(bhb.valueQuantity.comparator).toBe(">="); expect(bhb.code.coding?.[0].code).toBe("53060-9");
  expect(out.find(x => x.code.text === "ph")?.valueQuantity.code).toBe("[pH]");
});

test("eGFR method overrides code, race coefficient variant excluded, separate calculations retained", () => {
  const gfr = (local_code: string, name: string, loinc?: string) => lab({ accession: "same", unit: "mL/min/1.73m2", value: ">60", test: { local_code, name, loinc } });
  const out = run([doc("a", {
    non: gfr("EGFR_NAA", "eGFR, non-African American (CKD-EPI 2009)", "33914-3"),
    aa: gfr("EGFR_AA", "eGFR, African American (CKD-EPI 2009)", "48643-1"),
    newer: gfr("EGFR_2021", "eGFR (CKD-EPI 2021)", "98979-8"),
  })]).observations;
  expect(out).toHaveLength(2);
  expect(out.find(x => x.method?.text === "ckd-epi-2009")?.code.coding?.[0].code).toBe("33914-3");
  expect(out.every(x => x.valueQuantity.comparator === ">" && x.valueQuantity.code === "mL/min/{1.73_m2}")).toBe(true);
  const unspecified = run([doc("a", { r: gfr("EGFR", "eGFR") })]).observations[0];
  expect(unspecified.method?.text).toBe("ckd-epi-2021");
});

test("numeric unit conversions do not relabel the original value", () => {
  const rows = run([doc("a", {
    c: lab({ value: "88.4", unit: "umol/L" }),
    p: lab({ accession: "p", test: { local_code: "PLT", name: "Platelets" }, value: "212000", unit: "cells/uL" }),
    t: lab({ accession: "t", test: { local_code: "TNI", name: "Troponin I" }, value: "<10", unit: "ng/L" }),
    bad: lab({ accession: "bad", unit: "unknown" }),
  })]).observations;
  expect(rows).toHaveLength(3);
  expect(rows.find(x => x.code.text === "creatinine")?.valueQuantity.value).toBe(1);
  expect(rows.find(x => x.code.text === "platelets")?.valueQuantity.value).toBe(212);
  expect(rows.find(x => x.code.text === "troponin")?.valueQuantity).toMatchObject({ value: .01, comparator: "<", unit: "ng/mL" });
});

test("similarly named untracked measurements are not substituted for tracked analytes", () => {
  const out = run([doc("a", {
    nonHdl: lab({ accession: "nonhdl", test: { local_code: "NHDL", name: "Non-HDL cholesterol" }, value: "150", unit: "mg/dL" }),
    immature: lab({ accession: "immature", test: { local_code: "IPLT", name: "Absolute immature platelet count" }, value: "5", unit: "10*3/uL" }),
    bloodGas: lab({ accession: "gas", test: { local_code: "HCO3", name: "Bicarbonate, calculated" }, specimen: "venous blood", value: "20", unit: "mmol/L" }),
    totalCo2: lab({ accession: "chem", test: { local_code: "CO2", name: "Bicarbonate (total CO2)" }, value: "22", unit: "mmol/L" }),
  })]).observations;
  expect(out).toHaveLength(1);
  expect(out[0].code.text).toBe("bicarbonate");
  expect(out[0].valueQuantity.value).toBe(22);
});

test("offset-free collection times acquire the Chicago offset", () => {
  const winter = run([doc("a", { r: lab({ collected: "2025-01-10T12:00" }) })]).observations[0];
  expect(winter.effectiveDateTime).toBe("2025-01-10T12:00:00-06:00");
  const summer = run([doc("a", { r: lab({ collected: "2024-07-10T12:00:00" }) })]).observations[0];
  expect(summer.effectiveDateTime).toBe("2024-07-10T12:00:00-05:00");
});

test("malformed input is skipped, including prototype-like dictionary keys", () => {
  const bad: unknown[] = [null, false, 123, "bad", [], {}, { toString: null, valueOf: null }];
  for (const value of bad) {
    expect(() => transform(value as FolioItem[], day)).not.toThrow();
    for (const field of ["recorded", "payload", "id", "issuer", "patient", "author", "supersedes", "retracts"]) {
      expect(() => run([doc("a", {}, { [field]: value })])).not.toThrow();
    }
    for (const field of ["status", "test", "accession", "collected", "value", "unit", "components", "specimen"]) {
      expect(() => run([doc("a", { r: lab({ [field]: value }) })])).not.toThrow();
    }
    expect(() => run([doc("a", { enc: { ...enc(), document_kind: value }, m: med() })])).not.toThrow();
  }
  for (const code of ["__proto__", "constructor", "toString"]) {
    expect(() => run([doc("a", { r: lab({ test: { local_code: code, loinc: code, name: "unknown" } }) })])).not.toThrow();
  }
  expect(transform([], "2025-02-30")).toEqual({ medicationRequests: [], observations: [] });
});
