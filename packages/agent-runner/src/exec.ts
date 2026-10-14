import { spawn } from "node:child_process";
import { createWriteStream, existsSync, openSync, readFileSync, readSync, closeSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { childEnv } from "./backends.ts";

export interface ExecResult { exitCode: number | null; timedOut: boolean; error?: string }

export interface ExecSpec {
  cmd: string[];
  runDir: string; // cwd; contains prompt.md, receives transcript.jsonl + stderr.log
  timeoutMs: number;
  onLine?: (line: string) => void;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function killGroup(pid: number, signal: NodeJS.Signals): void {
  try { process.kill(-pid, signal); } catch { /* already gone */ }
}

/** Run as a child in its own process group; the timeout kills the whole group. */
export function execDirect(spec: ExecSpec): Promise<ExecResult> {
  const { cmd, runDir, timeoutMs, onLine } = spec;
  return new Promise((resolve) => {
    const transcript = createWriteStream(join(runDir, "transcript.jsonl"));
    const stderr = createWriteStream(join(runDir, "stderr.log"));
    const child = spawn(cmd[0]!, cmd.slice(1), {
      cwd: runDir, env: childEnv(), detached: true, stdio: ["pipe", "pipe", "pipe"],
    });
    let timedOut = false;
    let spawnError: string | undefined;
    let buf = "";
    const timer = setTimeout(() => {
      timedOut = true;
      if (child.pid) {
        killGroup(child.pid, "SIGTERM");
        setTimeout(() => killGroup(child.pid!, "SIGKILL"), 3000).unref();
      }
    }, timeoutMs);
    child.on("error", (err) => { spawnError = String(err); });
    child.stdout.on("data", (d: Buffer) => {
      transcript.write(d);
      if (!onLine) return;
      buf += d.toString("utf8");
      const lines = buf.split("\n");
      buf = lines.pop()!;
      for (const l of lines) onLine(l);
    });
    child.stderr.pipe(stderr);
    child.stdin.on("error", () => { /* child may exit without reading stdin */ });
    child.stdin.end(readFileSync(join(runDir, "prompt.md")));
    child.on("close", (code) => {
      clearTimeout(timer);
      if (onLine && buf) onLine(buf);
      let pending = 2;
      const done = () => { if (--pending === 0) resolve({ exitCode: spawnError ? null : code, timedOut, error: spawnError }); };
      transcript.end(done);
      stderr.end(done);
    });
  });
}

const q = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`;

async function tmux(...args: string[]): Promise<{ code: number; out: string }> {
  const p = Bun.spawn(["tmux", ...args], { stdout: "pipe", stderr: "pipe" });
  const out = await new Response(p.stdout).text();
  return { code: await p.exited, out: out.trim() };
}

/**
 * Run inside a tmux window: stdout is tee'd to transcript.jsonl (so the raw stream
 * stays visible), stderr goes to stderr.log, and the exit code lands in exit_code.
 * The window is left open after exit (remain-on-exit) so a human can read it.
 */
export async function execTmux(spec: ExecSpec, session: string, window: string): Promise<ExecResult & { window: string }> {
  const { cmd, runDir, timeoutMs, onLine } = spec;
  const dropped = Object.keys(process.env).filter((k) => !(k in childEnv()));
  const script = [
    "#!/usr/bin/env bash",
    `tmux set-option -w -t "$TMUX_PANE" remain-on-exit on 2>/dev/null`,
    `cd ${q(runDir)} || exit 1`,
    ...(dropped.length ? [`unset ${dropped.join(" ")}`] : []),
    `${cmd.map(q).join(" ")} < prompt.md 2> stderr.log | tee transcript.jsonl`,
    `echo "\${PIPESTATUS[0]}" > exit_code`,
    "",
  ].join("\n");
  writeFileSync(join(runDir, "tmux.sh"), script, { mode: 0o755 });
  const launch = ["bash", join(runDir, "tmux.sh")].map(q).join(" ");
  const fmt = ["-P", "-F", "#{window_id}"];
  let r = (await tmux("has-session", "-t", `=${session}`)).code === 0
    ? { code: 1, out: "" }
    : await tmux("new-session", "-d", "-s", session, "-n", window, ...fmt, launch);
  if (r.code !== 0) r = await tmux("new-window", "-d", "-t", `=${session}:`, "-n", window, ...fmt, launch);
  if (r.code !== 0) return { exitCode: null, timedOut: false, error: `tmux launch failed: ${r.out}`, window };
  const winId = r.out;

  const deadline = Date.now() + timeoutMs;
  const exitFile = join(runDir, "exit_code");
  const tPath = join(runDir, "transcript.jsonl");
  let offset = 0;
  let partial = "";
  const pump = () => {
    if (!onLine || !existsSync(tPath)) return;
    const fd = openSync(tPath, "r");
    const chunk = Buffer.alloc(1 << 16);
    let n: number;
    while ((n = readSync(fd, chunk, 0, chunk.length, offset)) > 0) {
      offset += n;
      partial += chunk.subarray(0, n).toString("utf8");
    }
    closeSync(fd);
    const lines = partial.split("\n");
    partial = lines.pop()!;
    for (const l of lines) onLine(l);
  };
  for (;;) {
    await sleep(300);
    pump();
    if (existsSync(exitFile)) {
      const code = Number.parseInt(readFileSync(exitFile, "utf8").trim(), 10);
      return { exitCode: Number.isNaN(code) ? null : code, timedOut: false, window };
    }
    const pane = await tmux("display-message", "-p", "-t", winId, "#{pane_pid} #{pane_dead}");
    const [pid, dead] = pane.out.split(" ");
    if (pane.code !== 0 || dead === "1") {
      return { exitCode: null, timedOut: false, error: "tmux window ended without writing exit_code", window };
    }
    if (Date.now() > deadline) {
      killGroup(Number(pid), "SIGTERM");
      await sleep(2000);
      killGroup(Number(pid), "SIGKILL");
      await tmux("kill-window", "-t", winId);
      pump();
      return { exitCode: null, timedOut: true, window };
    }
  }
}
