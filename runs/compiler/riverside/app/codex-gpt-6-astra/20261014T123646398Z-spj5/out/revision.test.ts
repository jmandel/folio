import { expect, test } from "bun:test";
import type { FolioItem } from "../in/views/views";
import { transform } from "./transform";

function doc(payload: FolioItem["payload"], extra: Partial<FolioItem> = {}): FolioItem {
  return {
    folio: "0.1", id: "note", issuer: "did:web:riverside-regional.example", patient: "test",
    effective: "2025-01-01T16:00:00Z", recorded: "2025-01-01T17:00:00Z", narrative: "",
    payload: {
      enc: { type: "encounter", encounter_id: "stay", document_kind: "discharge_summary",
        class: "inpatient", service: "Hospital Medicine", discharged: "2025-01-01T16:00:00Z" },
      ...payload,
    },
    ...extra,
  };
}
const illness = {
  type: "diagnosis", label: "Euglycemic DKA, SGLT2 inhibitor-associated", icd10cm: "E11.10",
  riverside_dx: { code: "RRH-DX-4471", name: "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
  status: "resolved", rank: "principal",
};
const effect = {
  type: "diagnosis", label: "Adverse effect of empagliflozin: ketoacidosis", icd10cm: "T38.3X5A",
  status: "resolved", rank: "secondary",
};

test("all three complete feedback documents retain the illness and held drug without adding a reaction", async () => {
  const feedback = await Bun.file(new URL("../in/feedback.md", import.meta.url)).text();
  const blocks = [...feedback.matchAll(/```json payload\n([\s\S]*?)\n```/g)];
  expect(blocks).toHaveLength(3);
  for (const block of blocks) {
    const payload = JSON.parse(block[1]);
    const item = doc(payload);
    const rows = transform([item], "2026-01-01");
    expect(rows.allergies).toEqual([]);
    expect(rows.problems).toEqual([{
      condition: illness.label, icd10cm: "E11.10", status: "resolved",
      evidence: [{ item_id: "note", entry_id: "dx_dka" }],
    }]);
    const held = rows.medications.filter(r => r.status === "held");
    expect(held).toHaveLength(1);
    expect(["empagliflozin", "dapagliflozin"]).toContain(held[0].ingredient);
    expect(held[0].stop_reason).toBeUndefined();
    expect(held[0].status_reason_text).toBe("Do not resume until reviewed by PCP");
    expect(rows.labs).toHaveLength(9);
    expect(rows.vitals).toHaveLength(1);
  }
});

test("association wording in an illness does not create a second clinical entity", () => {
  for (const label of [
    illness.label, "Empagliflozin-associated ketoacidosis", "Lactic acidosis due to metformin",
    "Pancreatitis induced by sitagliptin", "Cough associated with lisinopril",
  ]) for (const status of ["active", "resolved"]) {
    // No NKDA entry: the distinction comes from the diagnosis, not an NKDA veto.
    const item = doc({ condition: { type: "diagnosis", label, status } });
    const rows = transform([item], "2025-01-01");
    expect(rows.allergies).toEqual([]);
    expect(rows.problems).toEqual([{
      condition: label, status, evidence: [{ item_id: "note", entry_id: "condition" }],
    }]);
  }
});

test("a separate established adverse-effect diagnosis is retained even with NKDA and a resolved illness", () => {
  for (const status of ["active", "resolved"]) for (const coded of [true, false]) {
    const item = doc({
      illness,
      effect: { ...effect, status, icd10cm: coded ? effect.icd10cm : undefined },
      nkda: { type: "allergy", substance: "NKDA", severity: "unknown" },
    });
    const rows = transform([item], "2025-01-01");
    expect(rows.problems.map(r => r.condition)).toEqual([illness.label]);
    expect(rows.allergies).toEqual([{
      substance: "empagliflozin", type: "adverse_reaction", reaction: effect.label,
      criticality: "high", evidence: [{ item_id: "note", entry_id: "effect" }],
    }]);
  }
});

test("an explicit adverse-effect code can identify the reaction without an adverse-effect label prefix", () => {
  const label = "Empagliflozin-associated ketoacidosis";
  const rows = transform([doc({ illness, effect: { ...effect, label } })], "2025-01-01");
  expect(rows.problems.map(r => r.condition)).toEqual([illness.label]);
  expect(rows.allergies).toEqual([{
    substance: "empagliflozin", type: "adverse_reaction", reaction: label,
    criticality: "high", evidence: [{ item_id: "note", entry_id: "effect" }],
  }]);
});

test("a serious reaction explicitly listed as an allergy remains a reaction without a T-code", () => {
  const rows = transform([doc({
    illness,
    allergy: { type: "allergy", substance: "empagliflozin", rxnorm_ingredient: "1545653",
      reaction: "Euglycemic ketoacidosis", severity: "severe" },
  })], "2025-01-01");
  expect(rows.allergies).toEqual([{
    substance: "empagliflozin", rxnorm_ingredient: "1545653", type: "adverse_reaction",
    reaction: "Euglycemic ketoacidosis", criticality: "high",
    evidence: [{ item_id: "note", entry_id: "allergy" }],
  }]);
  expect(rows.problems.map(r => r.condition)).toEqual([illness.label]);
});

test("working and ruled-out adverse-effect diagnoses do not assert a reaction", () => {
  for (const status of ["working", "ruled_out"]) {
    const rows = transform([doc({ illness, effect: { ...effect, status } })], "2025-01-01");
    expect(rows.allergies).toEqual([]);
    expect(rows.problems.map(r => r.condition)).toEqual([illness.label]);
  }
});

test("removing an adverse-effect entry in a correction does not recreate it from the remaining illness", () => {
  const original = doc({ illness, effect });
  const corrected = doc({ illness }, {
    id: "correction", recorded: "2025-01-02T17:00:00Z", supersedes: [original.id],
  });
  expect(transform([corrected, original], "2025-01-01").allergies).toHaveLength(1);
  const rows = transform([original, corrected], "2025-01-02");
  expect(rows.allergies).toEqual([]);
  expect(rows.problems).toEqual([{
    condition: illness.label, icd10cm: "E11.10", status: "resolved",
    evidence: [{ item_id: "correction", entry_id: "illness" }],
  }]);
  expect(transform([corrected, original], "2025-01-02")).toEqual(rows);
});
