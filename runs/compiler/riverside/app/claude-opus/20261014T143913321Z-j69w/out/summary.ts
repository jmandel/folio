import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const g = JSON.parse(readFileSync("in/samples/samples.json", "utf8"));
for (const asOf of process.argv.slice(2)) {
  const r = transform(g[0].items, asOf);
  console.log("== " + asOf);
  for (const m of r.medications) console.log("MED", m.ingredient, m.status, m.status_since ?? "", JSON.stringify(m.dose), m.frequency, m.status_reason_text ?? "");
  for (const p of r.problems) console.log("PROB", p.condition, p.status, p.icd10cm);
  for (const a of r.allergies) console.log("ALG", a.substance, a.reaction_type, a.mechanism, a.criticality, a.reaction, JSON.stringify(a.onset));
  console.log("LABS", r.labs.length, r.labs.filter(l=>["bhb","ph","pco2","lipase"].includes(l.analyte)).map(l=>`${l.analyte}=${l.value}`).join(" "));
  for (const v of r.vitals) console.log("VS", v.local_time, v.systolic_mmhg, v.diastolic_mmhg, v.pulse_bpm, v.weight_kg);
}
