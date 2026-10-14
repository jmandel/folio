import { test, expect } from "bun:test";
import type { FolioItem } from "../in/views/views";
import { transform } from "./transform";

// Use the supplied feedback's actual payloads, not the prose checker's inferred dates.
const feedback = await Bun.file(new URL("../in/feedback.md", import.meta.url)).text();
const fixtures: FolioItem[] = [...feedback.matchAll(/````markdown\n([\s\S]*?)\n````/g)].map(match => {
  const markdown = match[1];
  const envelope = markdown.split("\n---\n")[0];
  const fields = Object.fromEntries([...envelope.matchAll(/^(folio|id|issuer|patient|effective|recorded): "([^"]*)"$/gm)].map(m => [m[1], m[2]]));
  const payload = JSON.parse(/```json payload\n([\s\S]*?)\n```/.exec(markdown)![1]);
  return { ...fields, payload, narrative: markdown.split("\n---\n")[1].split("```json payload")[0] } as FolioItem;
});
const fixture = (id: string) => fixtures.find(item => item.id === id)!;
const at = (items: FolioItem[], date = "2026-01-01") => transform(items, date);
function make(payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: "0.1", id: "a", issuer: "did:web:riverside.example", patient: "p", effective: "2025-01-01T16:00:00Z",
    recorded: "2025-01-01T18:00:00Z", narrative: "", payload: {
      enc: { type: "encounter", encounter_id: "stay", document_kind: "ed_note", class: "emergency", service: "ED" }, ...payload,
    }, ...extra };
}
const angioedema = { type: "diagnosis", label: "Angioedema, ACE inhibitor-associated", icd10cm: "T78.3XXA", status: "active" };
const lisinopril = { type: "home_med", drug_name: "lisinopril 10 mg tablet", rxnorm_ingredient: "29046", dose_text: "10 mg", sig: "daily", status: "stopped",
  instructions: "Do not take lisinopril or any ACE inhibitor again" };

test("both feedback angioedema diagnoses link to the explicitly named avoidance drug", () => {
  for (const [id, date] of [["01J9FHFYN022XMP813A6DRS7EK", "2024-10-05"], ["01JAC693Q01AJZEY7TW6HHJFZF", "2024-10-16"]]) {
    const rows = at([fixture(id)], date);
    expect(rows.allergies).toEqual([{
      substance: "lisinopril", rxnorm_ingredient: "29046", type: "adverse_reaction", criticality: "high",
      reaction: "Angioedema, ACE inhibitor-associated",
      evidence: [{ item_id: id, entry_id: "dx_angioedema" }, { item_id: id, entry_id: "med_lisinopril" }],
    }]);
    expect(rows.problems.some(p => p.icd10cm === "T78.3XXA")).toBe(true);
  }
});

test("attribution follows structured diagnosis and explicit class instructions, independent of keys and prose", () => {
  const rows = at([make({ randomDx: angioedema, renamedMed: { ...lisinopril, drug_name: "Zestril", instructions: "Avoid all ACE inhibitors" } })]);
  expect(rows.allergies[0]).toMatchObject({ substance: "lisinopril", rxnorm_ingredient: "29046", type: "adverse_reaction", criticality: "high" });
  expect(rows.allergies[0].evidence).toEqual([{ item_id: "a", entry_id: "randomDx" }, { item_id: "a", entry_id: "renamedMed" }]);
});

test("class attribution stays a class without an explicit, unambiguous medication link", () => {
  for (const instructions of [undefined, "Patient requested discontinuation", "Switch to an ACE inhibitor"]) {
    const rows = at([make({ d: angioedema, m: { ...lisinopril, instructions } })]);
    expect(rows.allergies).toMatchObject([{ substance: "ACE inhibitor", type: "adverse_reaction" }]);
    expect(rows.allergies[0].rxnorm_ingredient).toBeUndefined();
  }
  const rows = at([make({ d: angioedema, m: lisinopril, other: { ...lisinopril, drug_name: "enalapril", rxnorm_ingredient: undefined } })]);
  expect(rows.allergies.map(a => a.substance)).toEqual(["ACE inhibitor"]);
});

test("working, ruled-out, and withdrawn adverse diagnoses do not create avoidance entries", () => {
  for (const status of ["working", "ruled_out"]) expect(at([make({ d: { ...angioedema, status }, m: lisinopril })]).allergies).toEqual([]);
  const original = make({ d: angioedema, m: lisinopril });
  const replacement = make({ m: lisinopril }, { id: "b", recorded: "2025-01-02T18:00:00Z", supersedes: ["a"] });
  expect(at([replacement, original]).allergies).toEqual([]);
  expect(at([make({ m: lisinopril }, { narrative: "Lisinopril-associated angioedema" })]).allergies).toEqual([]);
});

test("explicit nonimmune angioedema differs from an unspecified allergy-list reaction", () => {
  const rows = at([make({
    a: { type: "allergy", substance: "lisinopril", rxnorm_ingredient: "29046", reaction: "ACE inhibitor-associated angioedema", severity: "severe" },
    b: { type: "allergy", substance: "penicillins", reaction: "angioedema", severity: "severe" },
  })]);
  expect(rows.allergies.find(a => a.substance === "lisinopril")?.type).toBe("adverse_reaction");
  expect(rows.allergies.find(a => a.substance === "penicillins")?.type).toBe("allergy");
});

test("feedback troponins retain both specimens with their actual collection instants", () => {
  for (const [id, date, times, vitalTime] of [
    ["01FZ2K8620E9Y9KMN60SG8ATRM", "2022-03-26", ["2022-03-26T03:39:00Z", "2022-03-26T06:39:00Z"], "2022-03-25T22:18"],
    ["01HV8SH3Q0KD0QRJY98X7FQ8EM", "2024-04-12", ["2024-04-12T05:16:00Z", "2024-04-12T08:16:00Z"], "2024-04-11T23:54"],
  ] as const) {
    const rows = at([fixture(id)], date);
    expect(rows.labs.filter(l => l.analyte === "troponin").map(l => ({ value: l.value, comparator: l.comparator, collected: l.collected })))
      .toEqual(times.map(collected => ({ value: .01, comparator: "<", collected })));
    expect(rows.vitals[0].local_time).toBe(vitalTime);
  }
});

test("feedback arrival BP remains on the prior local date alongside later inpatient vitals", () => {
  const ed = fixture("01J1C2ZDA0TYTTM11347HN7791");
  const later = { ...ed, id: "later", recorded: "2024-06-27T12:00:00Z", payload: { enc: ed.payload.enc,
    vs_1: { type: "vitals", taken: "2024-06-27T07:17:00Z", bp: { systolic_mmhg: 125, diastolic_mmhg: 75 } },
  } };
  expect(at([later, ed], "2024-06-27").vitals).toMatchObject([
    { local_time: "2024-06-26T20:54", systolic_mmhg: 135, diastolic_mmhg: 81 },
    { local_time: "2024-06-27T02:17", systolic_mmhg: 125, diastolic_mmhg: 75 },
  ]);
});

test("feedback arrival panel and repeat panel are separate specimens, not conflicting values", () => {
  const ed = fixture("01JB3N7W30VBSTD9ZSNC3Y51J7");
  const later = { ...ed, id: "later", recorded: "2024-10-26T15:00:00Z", payload: { enc: ed.payload.enc,
    bmp: { ...ed.payload.bmp, accession: "repeat", collected: "2024-10-26T11:09:00Z", components: [
      { test: { local_code: "K", loinc: "2823-3", name: "Potassium" }, value: "3.9", unit: "mmol/L" },
    ] },
  } };
  const rows = at([later, ed], "2024-10-26");
  expect(rows.labs.filter(l => l.analyte === "potassium").map(l => l.value)).toEqual([5, 3.9]);
  expect(rows.labs.find(l => l.analyte === "creatinine")?.value).toBe(.93);
  expect(rows.vitals[0]).toMatchObject({ local_time: "2024-10-25T20:11", systolic_mmhg: 116, diastolic_mmhg: 70 });
});

test("unrecognized strings and malformed discriminator objects never invoke prototype properties", () => {
  for (const name of ["constructor", "__proto__", "toString", "hasOwnProperty"]) {
    expect(() => at([make({ m: { ...lisinopril, drug_name: name, rxnorm_ingredient: name },
      r: { type: "result", accession: "x", status: "final", collected: "2025-01-01T15:00:00Z", specimen: "serum", test: { local_code: name, loinc: name, name }, value: "1", unit: "mg/dL" },
    })])).not.toThrow();
  }
  expect(() => at([make({ d: { ...angioedema, status: { toString: null } }, enc: { type: "encounter", document_kind: { toString: null } } })])).not.toThrow();
});
