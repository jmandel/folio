// bun packages/compiler/src/cli/leakcheck.ts <views.d.ts> : every quoted string, backticked string and number-with-unit example in a
// views file, checked against sources/, the generator and renderers (packages/truth, packages/render) and the corpus.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO } from "../data.ts";
const file = process.argv[2];
const text = readFileSync(file, "utf8");
const docs = (text.match(/\/\*\*[\s\S]*?\*\//g) ?? []).join("\n").replace(/^\s*\*\s?/gm, "");
const found = new Set<string>();
for (const m of docs.matchAll(/"([^"\n]{2,80})"|`([^`\n]{2,80})`|“([^”\n]{2,80})”/g)) found.add((m[1] ?? m[2] ?? m[3]).trim());
for (const m of docs.matchAll(/\b\d+(?:[.,]\d+)?\s?(?:mg\/dL|mmol\/L|mg\/g|mg|mcg|units?|mL\/min\/1\.73\s?m2|mL|g\/dL|kg|lb|%|mmHg|cells\/uL|K\/uL|10\*3\/uL|U\/L|ng\/mL|bpm)\b/g)) found.add(m[0].trim());
const where = ["sources", "packages/truth/src", "packages/render/src", "corpus"];
const rows = [...found].sort().map((s) => {
  const r = spawnSync("rg", ["-F", "-l", "-m", "1", "--", s, ...where.map((w) => join(REPO, w))], { encoding: "utf8" });
  const hits = r.stdout.trim().split("\n").filter(Boolean);
  return { string: s, hits: hits.length, where: [...new Set(hits.map((h) => h.slice(REPO.length + 1).split("/").slice(0, 2).join("/")))].slice(0, 4) };
});
writeFileSync(file.replace(/\.d\.ts$/, ".leakcheck.json"), JSON.stringify(rows, null, 1) + "\n");
for (const r of rows.filter((x) => x.hits)) console.log(`${r.hits > 99 ? "99+" : r.hits}\t${JSON.stringify(r.string)}\t${r.where.join(", ")}`);
console.log(`${rows.length} strings checked, ${rows.filter((x) => x.hits).length} occur in sources/generator/corpus`);
