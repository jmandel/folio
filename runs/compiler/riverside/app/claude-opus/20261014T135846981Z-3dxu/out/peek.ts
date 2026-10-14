import { transform } from "./transform.ts";
const g = JSON.parse(await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).text());
for (const asOf of process.argv.slice(2)) {
  const r = transform(g[0].items, asOf);
  console.log("== asOf", asOf);
  for (const m of r.medications) console.log("MED", m.ingredient, m.status, m.status_since ?? "-", m.status_reason_text ?? "");
  for (const p of r.problems) console.log("PROB", p.condition, p.status, p.icd10cm);
  for (const a of r.allergies) console.log("ALG", a.substance, a.reaction_type, a.mechanism, a.criticality, a.reaction);
  console.log("LABS", r.labs.length, r.labs.map(l=>l.analyte+"="+l.value+(l.comparator??"")).join(" "));
  for (const v of r.vitals) console.log("VIT", JSON.stringify({...v, evidence: v.evidence.length}));
}
