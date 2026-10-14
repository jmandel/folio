// bun packages/compiler/src/cli/scan.ts : scan every recorded compiler/prose/probe run; writes results/stage3/isolation/transcript-scan.json.
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO } from "../data.ts";
import { scanRun } from "../scan.ts";
const root = join(REPO, "runs/compiler");
const runs: string[] = [];
const walk = (d: string) => { for (const f of readdirSync(d)) { const p = join(d, f); if (!statSync(p).isDirectory()) continue; if (existsSync(join(p, "meta.json"))) runs.push(p); else if (f !== "in" && f !== "out" && f !== "node_modules") walk(p); } };
walk(root);
const report = runs.map((r) => ({ run: r.slice(REPO.length + 1), findings: scanRun(r) }));
const flagged = report.filter((x) => x.findings.length);
mkdirSync(join(REPO, "results/stage3/isolation"), { recursive: true });
writeFileSync(join(REPO, "results/stage3/isolation/transcript-scan.json"), JSON.stringify({ runs: report.length, flagged: flagged.length, report: flagged }, null, 1) + "\n");
console.log(`${report.length} runs scanned, ${flagged.length} with findings`);
for (const x of flagged) { console.log(x.run); for (const f of x.findings.slice(0, 6)) console.log(`   ${f.kind}: ${f.detail.slice(0, 220)}`); if (x.findings.length > 6) console.log(`   … ${x.findings.length - 6} more`); }
