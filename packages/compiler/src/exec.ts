// Runs a compiled mapper as plain code: type-check it the way the agent's harness did, then execute it
// in a separate bun process over many patients, timing each call. Also a static contract check
// (imports, clock, randomness) and a determinism check (two runs, same output).

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { VIEW_SETS, viewSetFiles, type ViewSet } from "../../views/src/index.ts";
import { REPO, type FolioItem } from "./data.ts";
import { HARNESS } from "./workdir.ts";

export const EXEC_ROOT = join(REPO, "build/stage3/exec");

export interface PatientRun { patient: string; asOf: string; ms: number; items: number; rows?: any; error?: string }
export interface ExecResult { tscOk: boolean; tscOutput: string; contract: string[]; runs: PatientRun[]; deterministic?: boolean; error?: string }

/** Lay out a mapper so its relative type imports resolve: <dir>/out/transform.ts, <dir>/in/views/*.d.ts. */
export function stage(transformTs: string, viewSet: ViewSet["name"]): string {
  const vs = VIEW_SETS[viewSet];
  const h = createHash("sha256").update(viewSet + "\n" + transformTs).digest("hex").slice(0, 16);
  const dir = join(EXEC_ROOT, h);
  mkdirSync(join(dir, "out"), { recursive: true });
  mkdirSync(join(dir, "in/views"), { recursive: true });
  mkdirSync(join(dir, "in/harness"), { recursive: true });
  writeFileSync(join(dir, "out/transform.ts"), transformTs);
  for (const [f, t] of Object.entries(viewSetFiles(vs))) writeFileSync(join(dir, "in/views", f), t);
  writeFileSync(join(dir, "in/harness/tsconfig.json"), HARNESS.HARNESS_TSCONFIG(vs));
  writeFileSync(join(dir, "in/harness/typecheck.ts"), HARNESS.TYPECHECK(vs));
  return dir;
}

export function typecheck(dir: string): { ok: boolean; output: string } {
  const r = spawnSync("bun", [join(REPO, "node_modules/typescript/lib/tsc.js"), "-p", join(dir, "in/harness/tsconfig.json")], { encoding: "utf8", timeout: 120_000 });
  return { ok: r.status === 0, output: (r.stdout + r.stderr).trim() };
}

/** Static contract check: imports other than view types, clock, randomness, I/O. */
export function contractIssues(src: string): string[] {
  const issues: string[] = [];
  for (const m of src.matchAll(/^\s*import\s+(?!type\b)([^;]*?)from\s+["']([^"']+)["']/gm)) issues.push(`value import from ${m[2]}`);
  for (const m of src.matchAll(/^\s*import\s+type\b[^;]*?from\s+["']([^"']+)["']/gm)) if (!/^\.\.\/in\/views\/(views|uscore)(\.d\.ts)?$/.test(m[1])) issues.push(`type import from ${m[1]}`);
  if (/\brequire\s*\(/.test(src)) issues.push("require()");
  if (/Date\.now\s*\(|new Date\(\s*\)/.test(src)) issues.push("reads the clock");
  if (/Math\.random|crypto\.getRandomValues|randomUUID/.test(src)) issues.push("randomness");
  if (/\bfetch\s*\(|\bBun\.|\bprocess\.|Deno\./.test(src)) issues.push("runtime/IO API");
  return issues;
}

const RUNNER = `import { readFileSync, writeFileSync } from "node:fs";
const [, , modPath, inPath, outPath] = process.argv;
const mod = await import(modPath);
const input: { patient: string; asOf: string; items: unknown[] }[] = JSON.parse(readFileSync(inPath, "utf8"));
const out = [];
for (const x of input) {
  const t0 = performance.now();
  try {
    const rows = mod.transform(structuredClone(x.items), x.asOf);
    out.push({ patient: x.patient, asOf: x.asOf, ms: performance.now() - t0, items: x.items.length, rows });
  } catch (e) {
    out.push({ patient: x.patient, asOf: x.asOf, ms: performance.now() - t0, items: x.items.length, error: String((e && e.stack) || e).slice(0, 600) });
  }
}
writeFileSync(outPath, JSON.stringify(out));
`;

export interface Job { patient: string; asOf: string; items: FolioItem[] }

/** Execute the staged mapper over jobs in one bun process (plus a second run for determinism). */
export function execute(dir: string, jobs: Job[], opts: { determinism?: boolean; timeoutMs?: number } = {}): { runs: PatientRun[]; deterministic?: boolean; error?: string } {
  writeFileSync(join(dir, "runner.ts"), RUNNER);
  const inPath = join(dir, `jobs-${process.pid}-${Date.now()}.json`);
  writeFileSync(inPath, JSON.stringify(jobs));
  const once = (tag: string) => {
    const outPath = join(dir, `out-${tag}-${process.pid}.json`);
    const r = spawnSync("bun", [join(dir, "runner.ts"), join(dir, "out/transform.ts"), inPath, outPath], { encoding: "utf8", timeout: opts.timeoutMs ?? 600_000, maxBuffer: 1 << 26 });
    if (r.status !== 0) return { error: `runner exited ${r.status}${r.signal ? ` (${r.signal})` : ""}: ${(r.stderr || "").slice(0, 800)}` };
    const text = readFileSync(outPath, "utf8");
    rmSync(outPath);
    return { text };
  };
  const a = once("a");
  if ("error" in a) { rmSync(inPath, { force: true }); return { runs: [], error: a.error }; }
  let deterministic: boolean | undefined;
  if (opts.determinism) {
    const b = once("b");
    const strip = (t: string) => JSON.stringify((JSON.parse(t) as PatientRun[]).map((x) => ({ ...x, ms: 0 })));
    deterministic = "text" in b ? strip(a.text!) === strip(b.text!) : false;
  }
  rmSync(inPath, { force: true });
  return { runs: JSON.parse(a.text!), deterministic };
}

export function readTransform(path: string): string { return readFileSync(path, "utf8"); }
