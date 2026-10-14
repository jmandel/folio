import type { AgentTask, BackendName, TranscriptSummary } from "./types.ts";

export const DEFAULT_ALLOWED_TOOLS = ["Read", "Write", "Edit", "Glob", "Grep"];

type CommandBuilder = (task: AgentTask, runDir: string) => string[];
let testOverride: CommandBuilder | null = null;

/**
 * Test-only hook: substitute a command for the real CLI. The command runs with
 * cwd = run dir and the full prompt on stdin, exactly like a real backend; its
 * stdout is parsed with the task's backend parser. Pass null to restore.
 */
export function __setBackendCommandForTests(fn: CommandBuilder | null): void {
  testOverride = fn;
}

export function buildCommand(task: AgentTask, runDir: string): string[] {
  if (testOverride) return testOverride(task, runDir);
  const extra = task.extraArgs ?? [];
  if (task.backend === "claude") {
    const tools = (task.allowedTools ?? DEFAULT_ALLOWED_TOOLS).join(",");
    return [
      "claude", "-p",
      "--output-format", "stream-json", "--verbose",
      "--permission-mode", "acceptEdits",
      `--tools=${tools}`, // only these tools exist for the agent...
      `--allowedTools=${tools}`, // ...and all of them run without prompting
      "--safe-mode", // no CLAUDE.md, skills, plugins, hooks, custom agents
      "--setting-sources=", // no user/project/local settings files
      "--strict-mcp-config", // no MCP servers
      "--no-session-persistence",
      ...(task.model ? ["--model", task.model] : []),
      ...extra,
    ];
  }
  if (task.backend === "codex") {
    return [
      "codex", "exec", "--json",
      "-C", runDir,
      "--skip-git-repo-check",
      "-s", "workspace-write",
      "-c", 'approval_policy="never"',
      "--ephemeral",
      "--disable", "memories",
      ...(task.model ? ["-m", task.model] : []),
      ...extra,
      "-", // prompt from stdin
    ];
  }
  throw new Error(`unknown backend: ${task.backend satisfies never}`);
}

/** Env for the child: drop variables that tie a nested `claude` to the parent session. */
export function childEnv(): Record<string, string> {
  const keep = /^CLAUDE_CODE_(USE_|OAUTH_TOKEN|API_KEY)/;
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (v === undefined) continue;
    if ((k === "CLAUDECODE" || k === "CLAUDE_PID" || k === "CLAUDE_EFFORT" || k.startsWith("CLAUDE_CODE_")) && !keep.test(k)) continue;
    env[k] = v;
  }
  return env;
}

export function parseLines(text: string): unknown[] {
  const out: unknown[] = [];
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("{")) continue;
    try { out.push(JSON.parse(t)); } catch { /* partial or non-JSON line */ }
  }
  return out;
}

function numericFields(o: unknown): Record<string, number> | undefined {
  if (!o || typeof o !== "object") return undefined;
  const r: Record<string, number> = {};
  for (const [k, v] of Object.entries(o)) if (typeof v === "number") r[k] = v;
  return Object.keys(r).length ? r : undefined;
}

type Ev = Record<string, any>;

export function summarize(backend: BackendName, events: unknown[]): TranscriptSummary {
  const s: TranscriptSummary = {};
  for (const raw of events) {
    if (!raw || typeof raw !== "object") continue;
    const e = raw as Ev;
    if (backend === "claude") {
      if (e.type === "system" && e.subtype === "init") s.sessionId = e.session_id;
      if (e.type === "result") {
        s.finalText = typeof e.result === "string" ? e.result : undefined;
        s.costUsd = e.total_cost_usd;
        s.usage = numericFields(e.usage);
        s.numTurns = e.num_turns;
        s.sessionId = e.session_id ?? s.sessionId;
        s.isError = e.is_error === true;
      }
    } else {
      if (e.type === "thread.started") s.sessionId = e.thread_id;
      if (e.type === "item.completed" && e.item?.type === "agent_message") s.finalText = e.item.text;
      if (e.type === "turn.completed") {
        s.numTurns = (s.numTurns ?? 0) + 1;
        const u = numericFields(e.usage);
        if (u) {
          s.usage ??= {};
          for (const [k, v] of Object.entries(u)) s.usage[k] = (s.usage[k] ?? 0) + v;
        }
      }
      if (e.type === "turn.failed" || e.type === "error") s.isError = true;
    }
  }
  return s;
}
