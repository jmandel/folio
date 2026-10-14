import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const g = JSON.parse(readFileSync("in/samples/samples.json", "utf8"))[0];
const items: any[] = g.items;
const clone = (x: any) => JSON.parse(JSON.stringify(x));
const ed25 = items.find((i) => i.id === "01JSZB11F0TPT7DTJ69B3HCPFT");
const dc23 = items.find((i) => i.id === "01GXW37630HYEJYZ8WXWG05528");
// 1. discharge summary for 2025 stay: empagliflozin stopped, glargine new, + addendum superseding it
const ds = clone(dc23);
ds.id = "DS25"; ds.recorded = "2025-05-01T20:00:00Z"; ds.effective = "2025-04-28T22:43:00Z";
ds.payload = {
  enc: { type: "encounter", encounter_id: "RRH-ENC-6374142", document_kind: "discharge_summary", class: "inpatient", service: "Hospital Medicine", arrived: "2025-04-28T19:12:00Z", admitted: "2025-04-28T22:43:00Z", discharged: "2025-05-01T17:00:00Z", disposition: "home" },
  dx: { type: "diagnosis", label: "Euglycemic DKA, SGLT2 inhibitor-associated", icd10cm: "E11.10", status: "resolved", rank: "principal" },
  m1: { type: "home_med", drug_name: "empagliflozin 10 mg tablet", rxnorm_ingredient: "1545653", dose_text: "10 mg", sig: "1 tab PO daily", status: "stopped" },
  m2: { type: "home_med", drug_name: "Lantus 100 units/mL pen", dose_text: "18 units", sig: "18 units SubQ at bedtime", status: "new" },
  m3: { type: "home_med", drug_name: "metformin 500 mg tablet", rxnorm_ingredient: "6809", dose_text: "2 tabs", sig: "2 tabs PO twice daily", status: "changed" },
  r1: { type: "result", test: { local_code: "TROP", loinc: "10839-9", name: "Troponin I" }, accession: "A1", collected: "2025-04-29T10:00:00Z", specimen: "serum", status: "final", value: "<0.01", unit: "ng/mL" },
  r2: { type: "result", test: { local_code: "K", loinc: "2823-3", name: "Potassium" }, accession: "A2", collected: "2025-04-29T10:00:00Z", specimen: "serum", status: "preliminary", value: "5.9", unit: "mmol/L" },
  r3: { type: "result", test: { local_code: "GLU", name: "Glucose" }, accession: "A3", collected: "2025-04-29T10:00:00Z", specimen: "serum", status: "final", value: "Hemolyzed, see comment", unit: "mg/dL" },
  p1: { type: "panel", panel: { local_code: "BMP", name: "BMP" }, accession: "A4", collected: "2021-04-29T10:00:00Z", specimen: "serum", status: "final", components: [
    { test: { local_code: "EGFRAA", name: "eGFR (MDRD) if African American" }, value: ">60", unit: "mL/min/1.73m2" },
    { test: { local_code: "EGFRNAA", name: "eGFR (MDRD) if non-African American" }, value: "52", unit: "mL/min/1.73m2" },
    { test: { local_code: "UCREAT", name: "Creatinine, urine" }, value: "80", unit: "mg/dL" },
  ] },
};
const ds2 = clone(ds); ds2.id = "DS25b"; ds2.recorded = "2025-05-02T15:00:00Z"; ds2.supersedes = ["DS25"];
ds2.payload.r2.status = "corrected"; ds2.payload.r2.value = "5.7";
ds2.payload.m1.instructions = "Ketoacidosis on empagliflozin";
const bad = { id: "BAD", issuer: ds.issuer, patient: g.patient, recorded: "2025-05-03T00:00:00Z", payload: { x: null, y: { type: "panel", components: "no" }, z: { type: "home_med" } } };
const retract = { ...clone(ed25), id: "RET", recorded: "2025-05-03T01:00:00Z", retracts: ["01JSZB11F0TPT7DTJ69B3HCPFT"], payload: {} };
for (const asOf of ["2025-05-01", "2025-05-02", "2025-05-03"]) {
  const r = transform([...items, ds, ds2, bad as any, retract, null as any, "junk" as any], asOf);
  console.log("== asOf", asOf);
  for (const m of r.medicationRequests) console.log(" ", m.id, m.status, m.authoredOn ?? "-", JSON.stringify(m.statusReason ?? null), m.medicationCodeableConcept.text, JSON.stringify(m.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity), m.dosageInstruction?.[0]?.timing?.code.text);
  for (const o of r.observations.filter((o) => !/L2[35]/.test(o.id))) console.log(" ", o.id, o.code.text, o.valueQuantity.comparator ?? "", o.valueQuantity.value, o.status, o.method?.text ?? "", o.code.coding![0].code);
  console.log("  total obs", r.observations.length);
}
console.log(JSON.stringify(transform(undefined as any, "x")), JSON.stringify(transform([], "2025-01-01")));
