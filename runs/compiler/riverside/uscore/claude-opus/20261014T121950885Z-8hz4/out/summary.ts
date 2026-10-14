import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const groups = JSON.parse(readFileSync(new URL("../in/samples/samples.json", import.meta.url), "utf8"));
for (const asOf of process.argv.slice(2)) for (const g of groups) {
  const r = transform(g.items, asOf);
  console.log(`== ${g.patient} asOf ${asOf}: ${r.observations.length} obs`);
  for (const m of r.medicationRequests) console.log("  ", m.id, m.status, m.intent, m.reportedBoolean, m.authoredOn ?? "-", m.statusReason?.[0]?.text ?? "", m.dosageInstruction?.[0]?.timing?.code.text, JSON.stringify(m.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity?.value));
}
const r = transform(groups[1].items, "2026-01-01");
for (const o of r.observations) console.log(o.id, o.code.text, o.valueQuantity.value, o.valueQuantity.code, o.effectiveDateTime, o.method?.text ?? "", o.code.coding?.map(c=>c.code).join(","));
