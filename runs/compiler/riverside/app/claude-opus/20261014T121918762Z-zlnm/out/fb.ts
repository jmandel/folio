import { readFileSync } from "node:fs";
const mod = process.argv[2] ?? "../out/transform.ts";
const { transform } = await import(mod);
const md = readFileSync("in/feedback.md", "utf8");
const blocks = md.split("````markdown\n").slice(1).map((b) => b.split("\n````")[0]);
const items: any[] = [];
for (const b of blocks) {
  const fm = b.split("---\n")[1];
  const item: any = { narrative: "" };
  let cur: any = item, curKey = "";
  for (const line of fm.split("\n")) {
    if (!line.trim()) continue;
    const m = line.match(/^(\s*)([a-z_]+):\s*(.*)$/);
    if (!m) { const l = line.match(/^\s*-\s*"(.*)"$/); if (l) (item[curKey] ??= []).push(l[1]); continue; }
    if (m[1] === "") { cur = item; }
    const v = m[3];
    if (v === "") { if (m[1]==="") { curKey = m[2]; item[m[2]] = item[m[2]] ?? {}; cur = item[m[2]]; } continue; }
    const val = v.startsWith("[") ? JSON.parse(v) : JSON.parse(v);
    (m[1] === "" ? item : cur)[m[2]] = val;
  }
  for (const k of ["supersedes","retracts"]) if (item[k] && !Array.isArray(item[k])) item[k] = Object.values(item[k]);
  const pj = b.split("```json payload\n")[1].split("\n```")[0];
  item.payload = JSON.parse(pj);
  item.narrative = b.split("---\n").slice(2).join("---\n").split("```json payload")[0];
  if (!items.find((x) => x.id === item.id)) items.push(item);
}
const byPat: Record<string, any[]> = {};
for (const it of items) (byPat[it.patient] ??= []).push(it);
const asOfs: Record<string,string> = {};
for (const m of md.matchAll(/## Patient (\S+), as of (\S+):/g)) asOfs[m[1]] = m[2];
for (const [p, its] of Object.entries(byPat)) {
  const r = transform(its, asOfs[p]);
  console.log("##", p, asOfs[p], its.map((i:any)=>i.id+" "+i.recorded).join(", "));
  for (const k of ["labs","vitals"]) for (const row of r[k]) { const { evidence, ...rest } = row; console.log("  ", k, JSON.stringify(rest)); }
}
