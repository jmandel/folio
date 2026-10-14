import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const groups = JSON.parse(readFileSync("in/samples/samples.json", "utf8"));
for (const asOf of process.argv.slice(2)) for (const g of groups) {
  const r = transform(g.items, asOf);
  console.log("== asOf", asOf, "meds", r.medicationRequests.length, "obs", r.observations.length);
  for (const m of r.medicationRequests) console.log(" ", m.id, m.status, m.intent, m.authoredOn ?? "", m.requester?.display ?? "", m.statusReason?.text ?? "", JSON.stringify(m.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity?.value), m.dosageInstruction?.[0]?.timing?.code.text);
  if (asOf === process.argv[2]) for (const o of r.observations) console.log(" ", o.id, o.code.text, o.valueQuantity.value, o.valueQuantity.code, o.effectiveDateTime, o.status, o.method?.text ?? "", o.code.coding?.map(c=>c.code).join(","));
}
