import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const groups = JSON.parse(readFileSync("in/samples/samples.json", "utf8"));
const asOf = process.argv[2] ?? "2026-10-13";
for (const g of groups) {
  const r = transform(g.items, asOf);
  console.log("##", g.patient, asOf);
  for (const [k, rows] of Object.entries(r)) {
    console.log(" --", k);
    for (const row of rows as any[]) { const { evidence, ...rest } = row; console.log("   ", JSON.stringify(rest), "ev:", evidence.length); }
  }
}
