import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const g = JSON.parse(readFileSync("in/samples/samples.json", "utf8"))[0];
for (const asOf of process.argv.slice(2)) {
  const r = transform(g.items, asOf);
  console.log("=== " + asOf);
  for (const m of r.medications) console.log("MED", m.ingredient, m.status, m.status_since ?? "-", m.status_reason_text ?? "", JSON.stringify(m.dose), m.frequency, m.evidence.map(e=>e.item_id.slice(-4)).join(","));
  for (const p of r.problems) console.log("PRB", p.condition, p.status, p.icd10cm);
  for (const a of r.allergies) console.log("ALG", JSON.stringify(a));
  console.log("LABS", r.labs.length, r.labs.filter(l=>!["sodium","chloride","anion_gap","bun","bicarbonate","glucose","potassium"].includes(l.analyte)).map(l=>`${l.analyte}=${l.value}${l.comparator??""}@${l.collected}`).join(" "));
  for (const v of r.vitals) console.log("VIT", JSON.stringify({...v, evidence: v.evidence.length}));
}
