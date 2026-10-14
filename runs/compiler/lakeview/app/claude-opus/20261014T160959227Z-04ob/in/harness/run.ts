// Runs out/transform.ts on the sample patients and prints the rows. Usage: bun in/harness/run.ts [asOf]
import { readFileSync } from "node:fs";
import { transform } from "../../out/transform.ts";
const groups: { patient: string; items: unknown[] }[] = JSON.parse(readFileSync(new URL("../samples/samples.json", import.meta.url), "utf8"));
const asOf = process.argv[2] ?? "2026-10-13";
for (const g of groups) console.log(JSON.stringify({ patient: g.patient, asOf, rows: (transform as (i: unknown[], a: string) => unknown)(g.items, asOf) }, null, 2));
