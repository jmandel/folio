import { expect, test } from "bun:test";
import { transform } from "./transform";
import type { FolioItem } from "../in/views/views";

function doc(id: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem {
  return {
    folio: "0.1", id, issuer: "did:web:riverside.example", patient: "p",
    recorded: "2025-01-02T16:00:00Z", effective: "2025-01-02T15:00:00Z", narrative: "",
    payload: { enc: { type: "encounter", encounter_id: "stay", document_kind: "hp", class: "inpatient", service: "Medicine" }, ...payload },
    ...extra,
  };
}
const med = (instructions?: string, status = "stopped") => ({
  type: "home_med", drug_name: "lisinopril 20 mg tablet", rxnorm_ingredient: "29046",
  dose_text: "20 mg", sig: "daily", status, instructions,
});
const rows = (items: FolioItem[]) => transform(items, "2025-01-04");

test("drug allergy display names normalize without requiring a code", () => {
  for (const substance of ["Lisinopril 20 mg tablet", "Lisinopril dihydrate", "LISINOPRIL (PRINIVIL)", "Zestril 20 mg tablet"]) {
    const result = rows([doc("a", { reaction: { type: "allergy", substance, reaction: "cough", severity: "mild" } })]);
    expect(result.allergies).toEqual([{
      substance: "lisinopril", type: "intolerance", reaction: "cough", criticality: "low",
      evidence: [{ item_id: "a", entry_id: "reaction" }],
    }]);
  }
  const result = rows([doc("a", { reaction: { type: "allergy", substance: "Tree nuts", reaction: "hives", severity: "moderate" } })]);
  expect(result.allergies[0].substance).toBe("Tree nuts");
});

test("ACE inhibitor diagnoses resolve only an unambiguous recorded culprit", () => {
  for (const label of ["Cough due to ACE inhibitor", "ACE inhibitor-induced cough", "ACE-inhibitor cough", "Adverse effect of ACE inhibitors: cough"]) {
    const result = rows([doc("a", { reaction: { type: "diagnosis", label, status: "resolved" }, medicine: med() })]);
    expect(result.allergies).toHaveLength(1);
    expect(result.allergies[0]).toMatchObject({ substance: "lisinopril", rxnorm_ingredient: "29046", type: "intolerance", reaction: label });
    expect(result.allergies[0].evidence).toEqual([{ item_id: "a", entry_id: "medicine" }, { item_id: "a", entry_id: "reaction" }]);
  }
  const diagnosis = { type: "diagnosis", label: "Cough due to ACE inhibitor", status: "active" };
  const ambiguous = doc("a", { reaction: diagnosis, first: med(), second: { ...med(), drug_name: "enalapril", rxnorm_ingredient: undefined } });
  expect(rows([ambiguous]).allergies[0].substance).toBe("ACE inhibitor");
  const unrelated = doc("a", { reaction: diagnosis, medicine: { ...med(), drug_name: "losartan", rxnorm_ingredient: "52175" } });
  expect(rows([unrelated]).allergies[0].substance).toBe("ACE inhibitor");
});

test("explicit drug reaction in home medication instructions is retained with its evidence", () => {
  for (const instructions of ["Stopped due to cough", "Discontinued because of persistent dry cough", "Lisinopril caused cough; avoid restarting"]) {
    const result = rows([doc("a", { medicine: med(instructions), nkda: { type: "allergy", substance: "NKDA" } })]);
    expect(result.allergies).toEqual([{
      substance: "lisinopril", rxnorm_ingredient: "29046", type: "intolerance", reaction: instructions, criticality: "low",
      evidence: [{ item_id: "a", entry_id: "medicine" }],
    }]);
    expect(result.medications[0].status).toBe("stopped");
    expect(result.medications[0].stop_reason).toBe("adverse_reaction");
  }
});

test("holding a drug during illness, warnings and unconfirmed causation do not assert a reaction", () => {
  for (const instructions of [
    undefined, "Hold for volume depletion and potassium; resume when eating",
    "Held during AKI", "Stopped; cough is due to viral infection",
    "Stop if cough occurs", "May cause cough", "Possible lisinopril-induced cough; assess later",
    "Cough not due to lisinopril", "No cough or angioedema", "History of cough with losartan",
  ]) {
    for (const status of ["held", "stopped"]) {
      expect(rows([doc("a", { medicine: med(instructions, status) })]).allergies).toEqual([]);
    }
  }
  for (const status of ["working", "ruled_out"]) {
    expect(rows([doc("a", { reaction: { type: "diagnosis", label: "Cough due to ACE inhibitor", status }, medicine: med() })]).allergies).toEqual([]);
  }
  expect(rows([doc("a", { medicine: med() }, { narrative: "Lisinopril caused cough." })]).allergies).toEqual([]);
});

test("reaction instructions obey corrections, recorded cutoff, and input ordering", () => {
  const a = doc("a", { medicine: med("Stopped due to cough") });
  const omitted = doc("b", {}, { recorded: "2025-01-03T16:00:00Z" });
  expect(rows([omitted, a]).allergies).toHaveLength(1);
  for (const edge of ["supersedes", "retracts"]) {
    const corrected = { ...omitted, [edge]: ["a"] };
    expect(rows([corrected, a]).allergies).toEqual([]);
    expect(transform([corrected, a], "2025-01-02").allergies).toHaveLength(1);
  }
  expect(rows([omitted, a])).toEqual(rows([a, omitted]));
});

test("diagnosis reaction nature is based on the reaction except for explicit adverse-effect T codes", () => {
  for (const [label, type] of [["Lisinopril-induced cough", "intolerance"], ["Angioedema due to lisinopril.", "allergy"]]) {
    expect(rows([doc("a", { reaction: { type: "diagnosis", label, status: "resolved" } })]).allergies[0]).toMatchObject({ substance: "lisinopril", type });
  }
  expect(rows([doc("a", { reaction: { type: "diagnosis", label: "Adverse effect of lisinopril: cough", icd10cm: "T46.4X5A", status: "resolved" } })]).allergies[0]).toMatchObject({ substance: "lisinopril", type: "adverse_reaction" });
});
