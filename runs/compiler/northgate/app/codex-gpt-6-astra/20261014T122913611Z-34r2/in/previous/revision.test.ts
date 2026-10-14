import { describe, expect, test } from "bun:test";
import type { FolioItem } from "../in/views/views";
import { transform } from "./transform";

// Exercise the supplied feedback items themselves. The feedback does not include
// their patients' lab items, so lab fixtures below explicitly model the reported
// old output rather than pretending to reconstruct those full records.
const feedback = await Bun.file(new URL("../in/feedback.md", import.meta.url)).text();
const feedbackItems: FolioItem[] = [...feedback.matchAll(/````markdown\n([\s\S]*?)\n````/g)].map(match => {
  const markdown = match[1];
  const field = (name: string): string => {
    const found = new RegExp(`^${name}: "([^"]*)"$`, "m").exec(markdown);
    if (!found) throw new Error(`Missing fixture field ${name}`);
    return found[1];
  };
  const payload = /```json payload\n([\s\S]*?)\n```/.exec(markdown);
  if (!payload) throw new Error("Missing fixture payload");
  return {
    folio: "0.1", id: field("id"), issuer: field("issuer"), patient: field("patient"),
    effective: field("effective"), recorded: field("recorded"),
    narrative: markdown.split("---\n")[2].split("```json payload")[0].trim(),
    payload: JSON.parse(payload[1]),
  };
});

function patientItem(patient: string): FolioItem {
  const found = feedbackItems.find(i => i.patient === patient);
  if (!found) throw new Error(`Missing fixture patient ${patient}`);
  return found;
}

function result(note: FolioItem, analyte: "egfr" | "a1c" | "uacr", value: string, day: string, oldEquation = false): FolioItem {
  const time = `${day}T07:22:00-05:00`;
  const nfmCode = analyte === "egfr" ? oldEquation ? "EGFR-NAA" : "EGFR" : analyte.toUpperCase();
  const externalCode = analyte === "egfr" ? oldEquation ? "LK-EGFR09N" : "LK-EGFR21" : `LK-${nfmCode}`;
  return {
    ...note, id: `result-${day}-${analyte}`, effective: time, recorded: `${day}T10:00:00-05:00`, narrative: "",
    payload: { result: {
      type: "imported_result", test: { nfm_code: nfmCode, name: analyte === "egfr" ? oldEquation ? "eGFR non-African American" : "eGFR (CKD-EPI 2021)" : analyte },
      value, unit: analyte === "egfr" ? "mL/min/1.73m2" : analyte === "a1c" ? "%" : "mg/g",
      collected: time, resulted: `${day}T09:00:00-05:00`, result_status: "F",
      external_ref: { lab: "Lakeview Labs", accession: `acc-${day}`, result_code: externalCode },
    } },
  };
}

describe("independent prose feedback", () => {
  test("all six provided items describe non-lab events and supply no collected lab results", () => {
    expect(feedbackItems).toHaveLength(6);
    for (const item of feedbackItems) {
      const rows = transform([item], item.recorded.slice(0, 10));
      expect(rows.labs).toEqual([]);
      expect(rows).toEqual(transform([{ ...item, narrative: "" }], item.recorded.slice(0, 10)));
    }
  });

  test("both historical eGFR values stay as printed despite the problem narrative's 49", () => {
    const note = patientItem("NFM-00423020");
    const past = result(note, "egfr", "47", "2020-08-10", true);
    const recent = result(note, "egfr", "46", "2021-07-05", true);
    const rows = transform([recent, note, past], "2021-07-05");
    expect(rows.labs.map(r => [r.value, r.egfr_equation])).toEqual([[47, "ckd-epi-2009"], [46, "ckd-epi-2009"]]);
    expect(rows.problems[0].ckd_stage).toBe("G3a");
    expect(rows).toEqual(transform([past, recent, note], "2021-07-05"));
  });

  test("referral question does not overwrite eGFR 56 or create a UACR collection", () => {
    const note = patientItem("NFM-00371731");
    const actual = result(note, "egfr", "56", "2025-08-22");
    const rows = transform([note, actual], "2025-08-22");
    expect(rows.labs).toHaveLength(1);
    expect(rows.labs[0]).toMatchObject({ analyte: "egfr", value: 56, evidence: [{ item_id: actual.id, entry_id: "result" }] });
    expect(rows.problems).toEqual([]);
  });

  test("metformin change reason does not overwrite eGFR 43 with 44", () => {
    const note = patientItem("NFM-00165827");
    const actual = result(note, "egfr", "43", "2025-06-17");
    const rows = transform([note, actual], "2025-06-17");
    expect(rows.labs.map(r => r.value)).toEqual([43]);
    expect(rows.medications[0]).toMatchObject({ ingredient: "metformin", dose: { value: 500, unit: "mg" }, frequency: "BID" });
  });

  test("A1c and eGFR mentions do not invent collection time, units, or final status", () => {
    for (const patient of ["NFM-00448962", "NFM-00072209", "NFM-00719869"]) {
      const note = patientItem(patient);
      const rows = transform([note], note.recorded.slice(0, 10));
      expect(rows.labs).toEqual([]);
      expect(rows.medications).toHaveLength(1);
    }
  });

  test("a withdrawn or not-yet-filed result is not resurrected by a matching mention", () => {
    const note = patientItem("NFM-00448962");
    const actual = result(note, "a1c", "8.1", "2019-07-10");
    const future = { ...actual, recorded: "2019-07-11T08:00:00-05:00" };
    expect(transform([note, future], "2019-07-10").labs).toEqual([]);
    expect(transform([note, future], "2019-07-11").labs[0]).toMatchObject({ value: 8.1, collected: actual.effective });
    const correction: FolioItem = {
      ...actual, id: "correction", recorded: "2019-07-10T12:00:00-05:00", supersedes: [actual.id],
      payload: { result: { ...actual.payload.result, value: "Result invalidated", result_status: "C" } },
    };
    expect(transform([note, actual, correction], "2019-07-10").labs).toEqual([]);
  });

  test("dulagutide's actual dose and once-weekly sig are honored", () => {
    const note = patientItem("NFM-00072209");
    const rows = transform([note], "2020-04-28");
    expect(rows.medications[0]).toMatchObject({ ingredient: "dulaglutide", dose: { value: 0.5, unit: "mg" }, frequency: "QW" });
    expect(rows.medications[0].rxnorm_ingredient).toBeUndefined();
    expect(rows.labs).toEqual([]);
  });
});

test("weekly sig normalization does not collapse other intervals or multi-phase schedules", () => {
  const source = patientItem("NFM-00072209");
  for (const [sig, expected] of [
    ["Inject 0.5 mg under the skin once weekly", "QW"],
    ["Inject 0.5 mg once per week", "QW"],
    ["Inject 0.5 mg every 7 days", "QW"],
    ["Inject 0.5 mg every other week", "other"],
    ["Inject 0.5 mg twice weekly", "other"],
    ["Inject 0.5 mg once weekly then increase to twice weekly", "other"],
    ["Inject 0.5 mg once weekly or as directed", "other"],
    ["Do not inject 0.5 mg once weekly", "other"],
  ]) {
    const modified = { ...source, payload: { med_1: { ...source.payload.med_1, sig } } };
    expect(transform([modified], "2020-04-28").medications[0].frequency).toBe(expected);
  }
});
