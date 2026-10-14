import { transform } from "./transform.ts";
const md = await Bun.file(new URL("../in/feedback.md", import.meta.url)).text();
const blocks = [...md.matchAll(/````markdown\n([\s\S]*?)\n````/g)].map(m => m[1]);
const items: any[] = blocks.map(b => {
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(b)![1];
  const g = (k: string) => (new RegExp("^" + k + ': "([^"]*)"', "m").exec(fm) ?? [])[1];
  const payload = JSON.parse(/```json payload\n([\s\S]*?)\n```/.exec(b)![1]);
  return { folio: "0.1", id: g("id"), issuer: g("issuer"), patient: g("patient"), effective: g("effective"), recorded: g("recorded"), narrative: "", payload };
});
const asOf: Record<string,string> = { "RRH-00571362": "2024-04-12", "RRH-00941538": "2025-09-23", "RRH-00903997": "2025-03-15" };
for (const p of Object.keys(asOf)) {
  const r = transform(items.filter(i => i.patient === p), asOf[p]);
  console.log("=== ", p);
  for (const k of ["labs", "vitals"]) for (const x of (r as any)[k]) { const { evidence, ...rest } = x; console.log(k, JSON.stringify(rest)); }
}
