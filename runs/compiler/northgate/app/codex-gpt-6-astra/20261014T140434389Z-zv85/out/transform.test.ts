import { describe, expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

const AS_OF = "2026-10-13";
function item(id: string, effective: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id, issuer: "northgate", patient: "patient", effective,
    recorded: effective.length === 10 ? effective + "T12:00:00-06:00" : effective,
    narrative: "", payload, ...extra };
}
function med(id: string, action: string, name = "losartan potassium 50 MG Oral Tablet", extra = {}) {
  return { type: "med_event", med_id: id, action, origin: "northgate", drug: { name, rxnorm: "product-code" },
    dose: { value: 50, unit: "mg" }, frequency: "QD", ...extra };
}
function problem(id: string, action = "add", extra = {}) {
  return { type: "problem_event", problem_id: id, action, description: "Chronic kidney disease stage 3a",
    icd10cm: "N18.31", ...extra };
}
function lab(code: string, value: string, unit: string, extra = {}) {
  return { type: "imported_result", test: { nfm_code: code, name: code }, value, unit, result_status: "F",
    collected: "2026-01-01T09:00:00-06:00", resulted: "2026-01-01T12:00:00-06:00",
    external_ref: { lab: "Lakeview Labs", accession: "accession", result_code: "LK-" + code }, ...extra };
}
function allergy(id: string, action = "add", extra = {}) {
  return { type: "allergy_event", allergy_id: id, action, substance: { name: "lisinopril", rxnorm: "29046" },
    reaction_type: "allergy", reactions: ["Angioedema"], severity: "high", ...extra };
}

describe("scope and replay", () => {
  test("applies historical corrections only after recorded Chicago date; supersession stays transitive", () => {
    const a = item("a", "2026-01-01", { m: med("m", "start") });
    const b = item("b", "2026-01-01", { m: med("m", "hold") }, { recorded: "2026-01-03T01:00:00Z", supersedes: ["a"] });
    const c = item("c", "2026-01-01", { m: med("m", "stop") }, { recorded: "2026-01-04T12:00:00-06:00", supersedes: ["b"] });
    const v = item("void", "2026-01-05", {}, { retracts: ["c"] });
    expect(transform([v, b, a, c], "2026-01-01").medications[0].status).toBe("active");
    expect(transform([v, b, a, c], "2026-01-02").medications[0].status).toBe("held");
    expect(transform([v, b, a, c], "2026-01-04").medications[0].status).toBe("stopped");
    expect(transform([v, b, a, c], "2026-01-05").medications).toEqual([]);
  });
  test("uses the Chicago end of day on both sides of DST", () => {
    for (const [day, inside, outside] of [
      ["2026-03-07", "2026-03-08T05:59:59Z", "2026-03-08T06:00:00Z"],
      ["2026-03-08", "2026-03-09T04:59:59Z", "2026-03-09T05:00:00Z"],
      ["2026-11-01", "2026-11-02T05:59:59Z", "2026-11-02T06:00:00Z"],
    ]) {
      const a = item("a", day, { m: med("m", "start") }, { recorded: inside });
      const b = item("b", day, { m: med("m", "hold") }, { recorded: outside });
      expect(transform([b, a], day).medications[0].status).toBe("active");
    }
  });
  test("correction links are issuer-scoped even if payload is unreadable", () => {
    const a = item("a", "2026-01-01", { m: med("m", "start") });
    const v = item("void", "2026-01-02", null as never, { issuer: "different", retracts: ["a"] });
    expect(transform([a, v], AS_OF).medications).toHaveLength(1);
    v.issuer = "northgate";
    expect(transform([a, v], AS_OF).medications).toHaveLength(0);
  });
  test("replays effective time, using recorded time only to break ties", () => {
    const a = item("a", "2026-01-01T09:00:00-06:00", { m: med("m", "start") }, { recorded: "2026-02-01T12:00:00-06:00" });
    const b = item("b", "2026-01-02T09:00:00-06:00", { m: med("m", "hold") });
    expect(transform([a, b], AS_OF).medications[0].status).toBe("held");
  });
});

describe("list views", () => {
  test("dose changes retain the start/resume date and holds never expire", () => {
    const items = [
      item("a", "2026-01-01", { m: med("m", "start") }),
      item("b", "2026-01-02", { m: med("m", "change", undefined, { dose: { value: 100, unit: "mg" } }) }),
      item("c", "2026-01-03", { m: med("m", "hold", undefined, { review_on: "2026-01-04", reason_text: "AKI" }) }),
      item("d", "2026-02-01", { type: { type: "list_reviewed", list: "medications", lines_on_list: ["m"] } }),
      item("e", "2026-03-01", { m: med("m", "resume") }),
      item("f", "2026-03-05", { m: med("m", "change") }),
    ];
    const changed = transform(items, "2026-01-02").medications[0];
    expect(changed.status_since).toBe("2026-01-01");
    expect(changed.dose).toEqual({ value: 100, unit: "mg" });
    expect(changed.evidence).toEqual([{ item_id: "b", entry_id: "m" }, { item_id: "a", entry_id: "m" }]);
    const held = transform(items, "2026-02-28").medications[0];
    expect(held.status).toBe("held"); expect(held.status_since).toBe("2026-01-03"); expect(held.status_reason_text).toBe("AKI");
    expect(transform(items, AS_OF).medications[0].status_since).toBe("2026-03-01");
  });
  test("the line with the latest own event wins for the ingredient; voided lines have no effect", () => {
    const items = [
      item("a", "2026-01-01", { m: med("old", "start", "Jardiance") }),
      item("b", "2026-01-02", { m: med("old", "stop", "empagliflozin 10 MG Oral Tablet", { stop_reason: "adverse_reaction" }) }),
      item("c", "2026-01-03", { m: med("new", "start", "Jardiance") }),
      item("v", "2026-01-04", {}, { retracts: ["c"] }),
    ];
    expect(transform(items, "2026-01-03").medications).toHaveLength(1);
    expect(transform(items, "2026-01-03").medications[0].ingredient).toBe("empagliflozin");
    expect(transform(items, AS_OF).medications[0].status).toBe("stopped");
    expect(transform(items, AS_OF).medications[0].stop_reason).toBe("adverse_reaction");
    expect(transform(items, AS_OF).medications[0].rxnorm_ingredient).toBeUndefined();
  });
  test("outside lines remain clinician-reported, tablet strength becomes mass, BH is retained", () => {
    const result = transform([item("a", "2026-01-01", {
      m: med("m", "start", "sertraline hydrochloride 50 MG Oral Tablet", {
        origin: "outside", restricted: "BH", dose: { value: 2, unit: "tab" }, frequency: "OTHER",
      }),
    })], AS_OF).medications[0];
    expect(result.ingredient).toBe("sertraline"); expect(result.dose).toEqual({ value: 100, unit: "mg" });
    expect(result.patient_reported).toBe(false); expect(result.sensitivity).toEqual(["mental-health"]);
    expect(result.frequency).toBe("other"); expect(result.rxnorm_ingredient).toBeUndefined();
  });
  test("OTHER frequency uses explicit instructions, preserving unusual schedules", () => {
    const a = item("a", "2026-01-01", { m: med("m", "start", "Ozempic", { frequency: "OTHER", sig: "Inject 0.5 mg once weekly" }) });
    expect(transform([a], AS_OF).medications[0].frequency).toBe("QW");
    a.payload.m.sig = "Take one tablet twice weekly";
    expect(transform([a], AS_OF).medications[0].frequency).toBe("other");
    a.payload.m.sig = "Take one tablet every other day";
    expect(transform([a], AS_OF).medications[0].frequency).toBe("other");
  });
  test("restaging is a current problem update; labs/reviews/billing/referral do not restage it", () => {
    const items = [
      item("a", "2026-01-01", { p: problem("p", "add", { onset: { date: "2016-01-01", precision: "year" } }) }),
      item("b", "2026-01-02", { p: problem("p", "update", { description: "CKD stage 3b, A2", icd10cm: "N18.32", onset: { date: "2016-01-01", precision: "year" } }) }),
      item("c", "2026-01-03", { e: lab("EGFR21", "12", "mL/min/1.73m2"),
        bill: { type: "billing_dx", display: "CKD stage 5", icd10cm: "N18.5" },
        ref: { type: "referral_dx", display: "CKD stage 4", icd10cm: "N18.4" },
        rev: { type: "list_reviewed", list: "problems", lines_on_list: ["p"] } }),
    ];
    const row = transform(items, AS_OF).problems[0];
    expect(transform(items, AS_OF).problems).toHaveLength(1);
    expect(row.ckd_stage).toBe("G3b"); expect(row.albuminuria).toBe("A2");
    expect(row.onset).toEqual({ value: "2016", precision: "year" }); expect(row.evidence[0].item_id).toBe("b");
  });
  test("resolved problems remain, removed ones do not; restricted problems remain", () => {
    const items = [
      item("a", "2026-01-01", { p: problem("p") }),
      item("b", "2026-01-02", { p: problem("p", "resolve") }),
      item("c", "2026-01-03", { p: problem("other", "add", { description: "Depression", icd10cm: "F32.A", restricted: "BH" }) }),
    ];
    expect(transform(items, AS_OF).problems.find(p => p.icd10cm === "N18.31")?.status).toBe("resolved");
    expect(transform(items, AS_OF).problems.find(p => p.icd10cm === "F32.A")?.sensitivity).toEqual(["mental-health"]);
    items.push(item("d", "2026-01-04", { p: problem("p", "remove") }));
    expect(transform(items, AS_OF).problems).toHaveLength(1);
  });
  test("ACE angioedema is hypersensitivity with nonimmune mechanism, cough is a side effect", () => {
    const a = item("a", "2026-01-01", { a: allergy("a", "add", { onset: { date: "2020-07-01", precision: "month" } }) });
    let row = transform([a], AS_OF).allergies[0];
    expect(row.reaction_type).toBe("hypersensitivity"); expect(row.mechanism).toBe("non_immune");
    expect(row.criticality).toBe("high"); expect(row.rxnorm_ingredient).toBe("29046");
    expect(row.onset).toEqual({ value: "2020-07", precision: "month" });
    a.payload.a.reactions = ["Cough", "No angioedema"]; a.payload.a.reaction_type = "intolerance";
    row = transform([a], AS_OF).allergies[0]; expect(row.reaction_type).toBe("side_effect");
    const b = item("b", "2026-02-01", { a: allergy("a", "inactivate") });
    expect(transform([a, b], AS_OF).allergies).toHaveLength(0);
  });
  test("inactivating one allergy line does not erase a different valid line for that substance", () => {
    const a = item("a", "2026-01-01", { a: allergy("active") });
    const b = item("b", "2026-01-02", { a: allergy("other", "inactivate") });
    expect(transform([a, b], AS_OF).allergies).toHaveLength(1);
    expect(transform([a, b], AS_OF).allergies[0].evidence).toEqual([{ item_id: "a", entry_id: "a" }]);
  });
  test("drug-caused conditions produce both views; class resolution uses only same-item medications", () => {
    const p = item("a", "2026-01-01", { p: problem("p", "resolve", { description: "SGLT2 inhibitor-associated ketoacidosis", icd10cm: "E11.10" }) });
    const elsewhere = item("b", "2026-01-01", { m: med("m", "start", "Jardiance") });
    let result = transform([p, elsewhere], AS_OF);
    expect(result.problems).toHaveLength(1); expect(result.problems[0].status).toBe("resolved");
    expect(result.allergies[0].substance).toBe("SGLT2 inhibitor");
    expect(result.allergies[0].reaction_type).toBe("serious_adverse_event");
    p.payload.m = med("m", "start", "Jardiance");
    result = transform([p], AS_OF);
    expect(result.allergies[0].substance).toBe("empagliflozin"); expect(result.allergies[0].evidence).toHaveLength(2);
    p.payload.m2 = med("m2", "start", "Farxiga");
    expect(transform([p], AS_OF).allergies[0].substance).toBe("SGLT2 inhibitor");
  });
  test("an adverse-effect-only T-code is not a problem; an unrelated drug mention is not a cause", () => {
    const p = item("a", "2026-01-01", { p: problem("p", "add", { description: "Adverse effect of SGLT2 inhibitor", icd10cm: "T38.3X5D" }) });
    expect(transform([p], AS_OF).problems).toHaveLength(0);
    expect(transform([p], AS_OF).allergies).toHaveLength(1);
    p.payload.p.description = "Ketoacidosis due to infection (on empagliflozin)"; p.payload.p.icd10cm = "E11.10";
    expect(transform([p], AS_OF).allergies).toHaveLength(0);
  });
});

describe("results and measurements", () => {
  test("a withdrawn component vanishes, a redraw remains, and earlier asOf still sees the original", () => {
    const a = item("a", "2026-01-01", { k: lab("K", "6.5", "mmol/L") });
    const b = item("b", "2026-01-01", { k: lab("K", "Result invalidated", "mmol/L", { result_status: "C" }) },
      { recorded: "2026-01-02T12:00:00-06:00", supersedes: ["a"] });
    const c = item("c", "2026-01-02", { k: lab("K", "4.2", "mmol/L", { collected: "2026-01-02T09:00:00-06:00", external_ref: { lab: "Lakeview Labs", accession: "redraw", result_code: "LK-K" } }) });
    expect(transform([b, c, a], "2026-01-01").labs[0].value).toBe(6.5);
    expect(transform([b, c, a], AS_OF).labs.map(x => x.value)).toEqual([4.2]);
  });
  test("component identity deduplicates preliminary/final copies, including nonnumeric corrected copies", () => {
    const a = item("a", "2026-01-01", { k: lab("K", "6.5", "mmol/L", { result_status: "P" }) });
    const b = item("b", "2026-01-01", { k: lab("K", "4.5", "mmol/L") });
    expect(transform([a, b], AS_OF).labs.map(x => x.value)).toEqual([4.5]);
    const c = item("c", "2026-01-01", { k: lab("K", "Hemolyzed", "mmol/L", { result_status: "C" }) });
    expect(transform([a, b, c], AS_OF).labs).toEqual([]);
  });
  test("eGFR variants exclude race coefficient; method notes override codes; other equations remain", () => {
    const a = item("a", "2026-01-01", {
      n: lab("EGFR-NAA", ">60", "mL/min/1.73m2", { comment: "Calculated with CKD-EPI 2021", external_ref: { lab: "Lakeview Labs", accession: "a", result_code: "LK-EGFR09N" } }),
      a: lab("EGFR-AA", "75", "mL/min/1.73m2", { comment: "CKD-EPI 2009" }),
      m: lab("EGFR-MDRD", "58", "mL/min/1.73m2", { comment: "MDRD equation" }),
    });
    const rows = transform([a], AS_OF).labs;
    expect(rows).toHaveLength(2);
    expect(rows.find(x => x.value === 60)?.comparator).toBe(">");
    expect(rows.find(x => x.value === 60)?.egfr_equation).toBe("ckd-epi-2021");
    expect(rows.find(x => x.value === 58)?.egfr_equation).toBe("mdrd");
  });
  test("counts are divided by 1000 and nonnumeric values never get parseFloat treatment", () => {
    const result = transform([item("a", "2026-01-01", {
      p: lab("PLT", "212000", "cells/uL"), w: lab("WBC", "6800", "cells/uL"),
      c: lab("CREAT", "1.5 invalidated", "mg/dL"), k: lab("K", "<3", "mmol/L"),
      bad: lab("NA", "140", "unknown-unit"),
    })], AS_OF).labs;
    expect(result.find(x => x.analyte === "platelets")?.value).toBe(212);
    expect(result.find(x => x.analyte === "wbc")?.value).toBe(6.8);
    expect(result.find(x => x.analyte === "potassium")?.comparator).toBe("<");
    expect(result).toHaveLength(3);
  });
  test("all tracked analytes are recognizable without LOINC", () => {
    const pairs = [
      ["CREAT", "mg/dL"], ["EGFR21", "mL/min/1.73m2"], ["K", "mmol/L"], ["NA", "mmol/L"], ["CL", "mmol/L"],
      ["CO2", "mmol/L"], ["AG", "mmol/L"], ["BUN", "mg/dL"], ["GLU", "mg/dL"], ["A1C", "%"], ["UACR", "mg/g"],
      ["PLT", "cells/uL"], ["WBC", "cells/uL"], ["HGB", "g/dL"], ["BHB", "mmol/L"], ["PH", ""], ["PCO2", "mmHg"],
      ["LIPASE", "U/L"], ["TNI", "ng/mL"], ["CHOL", "mg/dL"], ["TG", "mg/dL"], ["HDL", "mg/dL"], ["LDL", "mg/dL"],
    ];
    expect(transform([item("a", "2026-01-01", Object.fromEntries(pairs.map(([code, unit]) => [code, lab(code, "5", unit)])))], AS_OF).labs).toHaveLength(23);
  });
  test("vitals preserve repeat BP, use Chicago wall time, and round pounds correctly", () => {
    const a = item("a", "2026-07-01T04:30:00Z", { v: { type: "vital_set", bp: "152/94", bp_repeat: "138/88", pulse_bpm: 72, weight_lb: 190.7, height_in: 65 } });
    const row = transform([a], AS_OF).vitals[0];
    expect(row.local_time).toBe("2026-06-30T23:30"); expect(row.weight_kg).toBe(86.5);
    expect(row.systolic_mmhg).toBe(152); expect(row.repeat_systolic_mmhg).toBe(138);
    a.effective = "2026-07-01T09:05:00";
    expect(transform([a], AS_OF).vitals[0].local_time).toBe("2026-07-01T09:05");
  });
});

describe("defensive and deterministic behavior", () => {
  test("malformed entries and envelopes do not throw or prevent readable siblings", () => {
    const malformed = [null, undefined, 0, "x", [], {}, { type: "med_event", med_id: "m", action: "start", drug: null },
      { type: "allergy_event", allergy_id: "a", action: "add", substance: {}, reactions: 4 },
      { type: "imported_result", test: null, value: {}, collected: "not a date" },
      { type: "vital_set", bp: { x: 1 }, weight_lb: Infinity },
      { type: "problem_event", problem_id: "p", action: "add", description: { x: 1 } }];
    const good = item("good", "2026-01-01", Object.fromEntries(malformed.map((x, i) => [String(i), x])));
    good.payload.good = med("good", "start");
    for (const bad of malformed) {
      const result = transform([bad, good] as never, AS_OF);
      expect(result.medications).toHaveLength(1);
    }
    expect(transform(null as never, AS_OF).medications).toEqual([]);
    expect(transform([good], [AS_OF] as never).medications).toEqual([]);
  });
  test("does not mutate inputs; array order and payload-key order do not affect output", () => {
    const items = [
      item("z", "2026-01-01", { m: med("m", "start"), p: problem("p") }),
      item("a", "2026-01-03", { m: med("m", "hold") }),
      item("b", "2026-01-02", { a: allergy("a"), e: lab("CREAT", "1.1", "mg/dL") }),
    ];
    const original = JSON.stringify(items), expected = transform(items, AS_OF);
    for (let i = 0; i < items.length; i++) {
      const reordered = [...items.slice(i), ...items.slice(0, i)].reverse().map(x => ({ ...x, payload: Object.fromEntries(Object.entries(x.payload).reverse()) }));
      expect(transform(reordered, AS_OF)).toEqual(expected);
    }
    expect(JSON.stringify(items)).toBe(original);
  });
});
