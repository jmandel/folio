import { transform } from "./transform.ts";
const g = JSON.parse(await Bun.file(new URL("../in/samples/samples.json", import.meta.url)).text());
const asOf = process.argv[2] ?? "2026-10-13";
const r = transform(g[0].items, asOf);
for (const [k, rows] of Object.entries(r)) { console.log("##", k); for (const x of rows as any[]) { const { evidence, ...rest } = x; console.log(JSON.stringify(rest), evidence.map((e: any) => e.item_id.slice(-4) + "/" + (e.entry_id ?? "")).join(",")); } }
