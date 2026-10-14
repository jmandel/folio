// bun packages/compiler/src/cli/trapcounts.ts : per source, how many patients of the selected cohort carry each trap (fact-level, as scored). Aggregate counts only.
import { truth, trapIndex } from "../data.ts";
import { trapsFor } from "../keys.ts";
const counts: Record<string, Record<string, number>> = {};
for (const p of truth().patients) {
  const ix = trapIndex(p);
  const seen = new Set<string>();
  for (const k of ix.item.keys()) { const [s, id] = k.split("|"); for (const t of trapsFor(ix, s as any, [id])) seen.add(`${s}|${t}`); }
  for (const x of seen) { const [s, t] = x.split("|"); (counts[s] ??= {})[t] = ((counts[s] ??= {})[t] ?? 0) + 1; }
}
const pts = truth().patients;
const src: Record<string, number> = {}; for (const p of pts) for (const s of Object.keys(p.sources)) src[s] = (src[s] ?? 0) + 1;
console.log("patients", pts.length, "per source", JSON.stringify(src));
for (const s of ["A", "B", "C", "P"]) console.log(s, Object.entries(counts[s] ?? {}).sort((a, b) => +a[0].slice(1) - +b[0].slice(1)).map(([t, n]) => `${t}:${n}`).join(" "));
process.exit(0);
