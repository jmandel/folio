import { readFileSync } from "node:fs";
import { transform } from "./transform.ts";
const groups = JSON.parse(readFileSync("in/samples/samples.json", "utf8"));
const items = groups[0].items.map((x: any) => structuredClone(x));
const ds = items.find((i: any) => i.payload.enc.document_kind === "discharge_summary");
ds.payload.dx_t = { type: "diagnosis", label: "Adverse effect of SGLT2 inhibitor", icd10cm: "T38.3X5A", status: "active" };
const r = transform(items, "2026-01-01");
console.log(JSON.stringify(r.allergies), r.problems.map(p => p.condition));
