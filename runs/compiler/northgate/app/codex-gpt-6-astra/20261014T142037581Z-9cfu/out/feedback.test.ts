import { describe, expect, test } from "bun:test";
import type { FolioItem } from "../in/views/views";
import { transform } from "./transform";

// Use the exact structured payloads cited in the independent check.
const feedback = await Bun.file(new URL("../in/feedback.md", import.meta.url)).text();
const payloads = [...feedback.matchAll(/```json payload\n([\s\S]*?)\n```/g)]
  .map(match => JSON.parse(match[1]) as FolioItem["payload"]);
if (payloads.length !== 2) throw new Error("Expected the two feedback item payloads");

function item(id: string, at: string, payload: FolioItem["payload"], extra: Partial<FolioItem> = {}): FolioItem {
  return {
    folio: "0.1", id, issuer: "did:web:northgate-fm.example", patient: "test-patient",
    effective: at, recorded: at, narrative: "", payload, ...extra,
  };
}
const medication = item("01JXZMJNEGH7TPXBKJTFBY5B4Z", "2025-06-17T14:06:00-05:00", payloads[0], {
  recorded: "2025-06-17T14:06:42-05:00",
  narrative: '<ref id="med_1">A1c 8.4. Empagliflozin 10 mg daily started today.</ref>',
});
const referral = item("01H8CS8V00DQK8X0ZHMWT4969B", "2023-08-21T14:30:00-05:00", payloads[1], {
  recorded: "2023-08-21T14:31:12-05:00",
  narrative: '<ref id="referral">Most recent eGFR is 59 with UACR 311 mg/g.</ref>',
});

function report(id: string, collected: string, values: [string, string, string][]): FolioItem {
  return item(id, collected, Object.fromEntries(values.map(([code, value, unit]) => [code, {
    type: "imported_result", test: { nfm_code: code, name: code }, value, unit,
    result_status: "F", collected, resulted: collected,
    external_ref: { lab: "Lakeview Labs", accession: id, result_code: "LK-" + code },
  }])));
}

describe("independent prose feedback: clinical context does not identify lab results", () => {
  test("A1c in the medication reason does not turn a drug start into a specimen collection", () => {
    const rows = transform([medication], "2025-06-17");
    expect(rows.labs).toEqual([]);
    expect(rows.medications).toEqual([{
      ingredient: "empagliflozin", drug_name: "empagliflozin 10 MG Oral Tablet",
      status: "active", status_since: "2025-06-17", dose: { value: 10, unit: "mg" },
      frequency: "QD", patient_reported: false,
      evidence: [{ item_id: medication.id, entry_id: "med_1" }],
    }]);
  });

  test("eGFR and UACR in the referral question do not have collection times or result statuses", () => {
    const rows = transform([referral], "2023-08-21");
    expect(rows.labs).toEqual([]);
    // Referral diagnoses are copies, not problem-list changes.
    expect(rows.problems).toEqual([]);
  });

  test("actual A1c results preserve collection time and status despite later medication commentary", () => {
    const result = report("a1c-result", "2025-06-16T08:00:00-05:00", [["A1C", "8.4", "%"]]);
    result.payload.A1C.result_status = "P";
    const rows = transform([medication, result], "2025-06-17");
    expect(rows.labs).toEqual([{
      analyte: "a1c", value: 8.4, unit: "%", collected: "2025-06-16T08:00:00-05:00",
      status: "preliminary", evidence: [{ item_id: result.id, entry_id: "A1C" }],
    }]);
  });

  test("repeated referral questions neither duplicate actual results nor restore corrected-away ones", () => {
    const original = report("renal-results", "2023-08-18T08:00:00-05:00", [
      ["EGFR21", "59", "mL/min/1.73m2"], ["UACR", "311", "mg/g"],
    ]);
    const scheduled = item("scheduled-referral", "2023-08-22T09:00:00-05:00", {
      ...referral.payload,
      referral: { ...referral.payload.referral, action: "scheduled", appointment_on: "2023-09-01" },
    });
    const corrected = item("corrected-renal-results", original.effective, {
      EGFR21: { ...original.payload.EGFR21, value: "60", result_status: "C" },
      UACR: { ...original.payload.UACR, value: "Result invalidated", result_status: "C" },
    }, { recorded: "2023-08-22T10:00:00-05:00", supersedes: [original.id] });
    const records = [scheduled, corrected, original, referral];
    const before = transform(records, "2023-08-21");
    expect(before.labs.map(row => [row.analyte, row.value])).toEqual([["egfr", 59], ["uacr", 311]]);
    expect(before.labs.every(row => row.collected === original.effective)).toBe(true);
    const after = transform(records, "2023-08-22");
    expect(after.labs).toEqual([{
      analyte: "egfr", value: 60, unit: "mL/min/1.73m2", collected: original.effective,
      status: "final", egfr_equation: "ckd-epi-2021",
      evidence: [{ item_id: corrected.id, entry_id: "EGFR21" }],
    }]);
    expect(transform([...records].reverse(), "2023-08-22")).toEqual(after);
  });
});
