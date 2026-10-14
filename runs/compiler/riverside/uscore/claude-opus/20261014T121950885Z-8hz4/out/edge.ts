import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const groups = JSON.parse(readFileSync(new URL("../in/samples/samples.json", import.meta.url), "utf8"));
const items = JSON.parse(JSON.stringify(groups[0].items));
const ds = items.find((i: any) => i.payload.enc.document_kind === "discharge_summary");
// Addendum DS superseding the original: changes metformin to stopped, preliminary->corrected lab, race eGFR
const add = JSON.parse(JSON.stringify(ds));
add.id = "ADDENDUM1"; add.recorded = "2025-06-27T04:30:00Z"; add.supersedes = [ds.id];
add.payload.med_metformin.status = "stopped"; add.payload.med_metformin.instructions = "Stopped due to lactic acidosis risk (adverse reaction)";
add.payload.med_jard = { type: "home_med", drug_name: "Jardiance 10 mg tablet", dose_text: "10 mg", sig: "1 tab PO every morning", status: "new" };
add.payload.bmp_dc.components.push({ test: { local_code: "EGFRAA", loinc: "48643-1", name: "eGFR if African American (MDRD)" }, value: ">60", unit: "mL/min/1.73m2" });
add.payload.trop = { type: "result", test: { local_code: "TNI", loinc: "10839-9", name: "Troponin I" }, accession: "X1", collected: "2025-06-26T11:28:00Z", specimen: "serum", status: "corrected", value: "<0.01", unit: "ng/mL" };
add.payload.bad = { type: "result", test: { local_code: "K", loinc: "2823-3", name: "Potassium" }, accession: "X2", collected: "2025-06-26T11:28:00Z", specimen: "serum", status: "final", value: "Hemolyzed, see comment", unit: "mmol/L" };
add.payload.ua = { type: "result", test: { local_code: "UNA", name: "Sodium, urine" }, accession: "X3", collected: "2025-06-26T11:28:00Z", specimen: "urine", status: "final", value: "40", unit: "mmol/L" };
items.push(add);
// a retracted later ED note
const ed = JSON.parse(JSON.stringify(items.find((i: any) => i.payload.enc.document_kind === "ed_note")));
ed.id = "ED2"; ed.recorded = "2025-07-01T03:00:00Z"; ed.effective = "2025-07-01T01:00:00Z"; ed.payload.enc.encounter_id = "NEW"; ed.payload.enc.arrived = "2025-07-01T01:00:00Z";
items.push(ed);
const retr = { ...ed, id: "RETR", recorded: "2025-07-02T15:00:00Z", retracts: ["ED2"], payload: {} };
items.push(retr, null, { garbage: true });
for (const asOf of ["2025-06-26", "2025-06-30", "2025-07-01", "2025-07-02"]) {
  const r = transform(items, asOf);
  console.log("== asOf", asOf);
  for (const m of r.medicationRequests) console.log("  ", m.id, m.status, m.intent, m.authoredOn ?? "-", JSON.stringify(m.statusReason ?? ""), m.medicationCodeableConcept.text, m.dosageInstruction?.[0]?.timing?.code.text);
  for (const o of r.observations.filter(o => !/^lab-L2517[56]/.test(o.id))) console.log("   ", o.id, o.status, JSON.stringify(o.valueQuantity), o.method?.text ?? "");
}
