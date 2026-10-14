import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, normalize, resolve, sep } from "node:path";
import { buildCommand, parseLines, summarize } from "./backends.ts";
import { execDirect, execTmux } from "./exec.ts";
import type { AgentTask, RunMeta, RunOptions, RunResult } from "./types.ts";

export type { AgentTask, BackendName, RunMeta, RunOptions, RunResult } from "./types.ts";
export { __setBackendCommandForTests } from "./backends.ts";

export const PROMPT_FOOTER =
  "\n\n---\nWrite all output files under ./out/ (relative to your working directory). Do not modify ./in/.\n";
const DEFAULT_TIMEOUT_MS = 15 * 60_000;
const DEFAULT_TMUX_SESSION = "folio-agents";

/** Nearest ancestor (of `from`, else cwd, else this package) whose package.json has "workspaces". */
export function findRepoRoot(from?: string): string {
  for (const start of from ? [from] : [process.cwd(), import.meta.dir]) {
    for (let d = resolve(start); ; d = dirname(d)) {
      const pj = join(d, "package.json");
      if (existsSync(pj)) {
        try { if (JSON.parse(readFileSync(pj, "utf8")).workspaces) return d; } catch { /* ignore */ }
      }
      if (dirname(d) === d) break;
    }
  }
  throw new Error(`no workspace root found above ${from ?? process.cwd()}`);
}

/** Bounded-concurrency map; results keep input order. Rejects if fn rejects. */
export async function pool<T, R>(items: T[], concurrency: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  if (!(concurrency >= 1)) throw new Error("pool: concurrency must be >= 1");
  const results = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]!, i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

function assertRelative(p: string, what: string): void {
  const n = normalize(p);
  if (!p || isAbsolute(p) || n === ".." || n.startsWith(`..${sep}`)) throw new Error(`${what} must be a relative path inside the run dir: ${p}`);
}

function newRunId(): string {
  const ts = new Date().toISOString().replace(/[-:]/g, "").replace(/\.(\d+)Z$/, "$1Z"); // 20261013T120102345Z
  return `${ts}-${Math.random().toString(36).slice(2, 6)}`;
}

function listFiles(root: string, rel = ""): string[] {
  const dir = join(root, rel);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort().flatMap((name) => {
    const r = rel ? `${rel}/${name}` : name;
    return statSync(join(root, r)).isDirectory() ? listFiles(root, r) : [r];
  });
}

function readOutputs(runDir: string): Record<string, string> {
  const out = join(runDir, "out");
  return Object.fromEntries(listFiles(out).map((f) => [f, readFileSync(join(out, f), "utf8")]));
}

async function runOnce(task: AgentTask, runId: string, runsRoot: string, attempt: number, previousRunId: string | undefined, opts: RunOptions): Promise<RunResult> {
  const runDir = join(runsRoot, task.family, runId);
  if (existsSync(runDir)) throw new Error(`run dir already exists: ${runDir}`);
  mkdirSync(join(runDir, "out"), { recursive: true });
  mkdirSync(join(runDir, "in"), { recursive: true });
  for (const [rel, content] of Object.entries(task.inputs ?? {})) {
    const p = join(runDir, "in", rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
  }
  writeFileSync(join(runDir, "prompt.md"), task.prompt.trimEnd() + PROMPT_FOOTER);

  const cmd = buildCommand(task, runDir);
  const onLine = opts.onEvent && ((l: string) => { for (const e of parseLines(l)) opts.onEvent!(e); });
  const spec = { cmd, runDir, timeoutMs: task.timeoutMs ?? DEFAULT_TIMEOUT_MS, onLine };
  const startedAt = new Date();
  let tmuxInfo: RunMeta["tmux"];
  let res;
  if (task.tmux) {
    const t = typeof task.tmux === "object" ? task.tmux : {};
    const session = t.session ?? DEFAULT_TMUX_SESSION;
    const r = await execTmux(spec, session, t.window ?? `${task.family}/${runId}`);
    tmuxInfo = { session, window: r.window };
    res = r;
  } else {
    res = await execDirect(spec);
  }
  const endedAt = new Date();

  const transcriptPath = join(runDir, "transcript.jsonl");
  const summary = summarize(task.backend, parseLines(existsSync(transcriptPath) ? readFileSync(transcriptPath, "utf8") : ""));
  const producedFiles = listFiles(join(runDir, "out"));
  const missing = (task.expectFiles ?? []).filter((f) => !producedFiles.includes(normalize(f)));
  const errors = [
    res.error,
    res.timedOut ? `timed out after ${spec.timeoutMs}ms` : undefined,
    !res.timedOut && res.exitCode !== 0 ? `exit code ${res.exitCode}` : undefined,
    summary.isError ? "agent reported an error" : undefined,
    missing.length ? `missing expected files: ${missing.join(", ")}` : undefined,
  ].filter((x): x is string => !!x);

  const meta: RunMeta = {
    runId, family: task.family, backend: task.backend, model: task.model, attempt, previousRunId,
    cmd, cwd: runDir, startedAt: startedAt.toISOString(), endedAt: endedAt.toISOString(),
    durationMs: endedAt.getTime() - startedAt.getTime(),
    exitCode: res.exitCode, timedOut: res.timedOut, ok: errors.length === 0,
    error: errors.length ? errors.join("; ") : undefined,
    costUsd: summary.costUsd, usage: summary.usage, numTurns: summary.numTurns, sessionId: summary.sessionId,
    producedFiles, tmux: tmuxInfo,
  };
  writeFileSync(join(runDir, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
  return { meta, runDir, outputs: readOutputs(runDir), finalText: summary.finalText };
}

/** Run a task through a CLI agent, recording it under runs/. Never throws for agent failure. */
export async function runAgent(task: AgentTask, opts: RunOptions = {}): Promise<RunResult> {
  if (task.backend !== "claude" && task.backend !== "codex") throw new Error(`unknown backend: ${task.backend}`);
  if (!task.prompt) throw new Error("task.prompt is required");
  assertRelative(task.family, "family");
  if (task.runId !== undefined) {
    assertRelative(task.runId, "runId");
    if (task.runId.includes("/")) throw new Error(`runId must not contain '/': ${task.runId}`);
  }
  for (const p of Object.keys(task.inputs ?? {})) assertRelative(p, "input path");
  for (const p of task.expectFiles ?? []) assertRelative(p, "expectFiles entry");

  const runsRoot = opts.runsRoot ?? join(findRepoRoot(), "runs");
  const baseId = task.runId ?? newRunId();
  const attempts = 1 + Math.max(0, opts.retries ?? 1);
  let result: RunResult | undefined;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (attempt > 1 && opts.retryDelayMs) await new Promise((r) => setTimeout(r, opts.retryDelayMs));
    const runId = attempt === 1 ? baseId : `${baseId}-a${attempt}`;
    result = await runOnce(task, runId, runsRoot, attempt, result?.meta.runId, opts);
    if (result.meta.ok) break;
  }
  return result!;
}

/** Rebuild a RunResult from disk only. */
export function replay(family: string, runId: string, opts: { runsRoot?: string } = {}): RunResult {
  const runDir = join(opts.runsRoot ?? join(findRepoRoot(), "runs"), family, runId);
  const meta = JSON.parse(readFileSync(join(runDir, "meta.json"), "utf8")) as RunMeta;
  const tp = join(runDir, "transcript.jsonl");
  const summary = summarize(meta.backend, parseLines(existsSync(tp) ? readFileSync(tp, "utf8") : ""));
  return { meta, runDir, outputs: readOutputs(runDir), finalText: summary.finalText };
}

/** All recorded runs of a family, oldest first (run ids sort by time). */
export function listRuns(family: string, opts: { runsRoot?: string } = {}): RunMeta[] {
  const dir = join(opts.runsRoot ?? join(findRepoRoot(), "runs"), family);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort()
    .filter((id) => existsSync(join(dir, id, "meta.json")))
    .map((id) => JSON.parse(readFileSync(join(dir, id, "meta.json"), "utf8")) as RunMeta);
}
