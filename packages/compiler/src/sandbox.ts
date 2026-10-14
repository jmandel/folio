// Filesystem isolation for compiler-agent runs. The agent CLI runs under bubblewrap with the home
// directory and /tmp replaced by empty tmpfs mounts; only the run dir (read-write), the CLI binaries,
// the CLI's auth file and a read-only TypeScript install are mounted back. The repo (truth/, answer
// keys, TRAPS.md, other sources, NOTES.md), the user's agent histories and every other file under
// $HOME are therefore not reachable from inside the run, whatever tools the agent uses.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { findRepoRoot } from "../../agent-runner/src/index.ts";

const HOME = homedir();

/** Minimal codex config: the user's default model and reasoning effort, nothing else (no project trust list). */
function codexConfig(): string {
  const dir = mkdtempSync(join(tmpdir(), "folio-codex-cfg-"));
  let model = "", effort = "";
  try {
    const src = readFileSync(join(HOME, ".codex/config.toml"), "utf8");
    model = src.match(/^model\s*=\s*"([^"]+)"/m)?.[1] ?? "";
    effort = src.match(/^model_reasoning_effort\s*=\s*"([^"]+)"/m)?.[1] ?? "";
  } catch { /* no user config */ }
  const toml = [model && `model = "${model}"`, effort && `model_reasoning_effort = "${effort}"`].filter(Boolean).join("\n") + "\n";
  writeFileSync(join(dir, "config.toml"), toml);
  return join(dir, "config.toml");
}

let codexCfg: string | undefined;

/** The codex default model as configured by the user (recorded in provenance). */
export function codexDefaultModel(): { model?: string; effort?: string } {
  try {
    const src = readFileSync(join(HOME, ".codex/config.toml"), "utf8");
    return { model: src.match(/^model\s*=\s*"([^"]+)"/m)?.[1], effort: src.match(/^model_reasoning_effort\s*=\s*"([^"]+)"/m)?.[1] };
  } catch { return {}; }
}

export function sandboxWrap(cmd: string[], runDir: string): string[] {
  const repo = findRepoRoot();
  const ro = (p: string, to = p) => (existsSync(p) ? ["--ro-bind", p, to] : []);
  const rw = (p: string, to = p) => (existsSync(p) ? ["--bind", p, to] : []);
  // Empty dir in the run dir to mount TypeScript on (bwrap needs the mount point inside a bind mount).
  mkdirSync(join(runDir, "node_modules", "typescript"), { recursive: true });
  const args = [
    "bwrap",
    "--ro-bind", "/", "/",
    "--dev", "/dev",
    "--proc", "/proc",
    "--tmpfs", "/tmp",
    "--tmpfs", HOME,
    // CLI binaries.
    ...ro(join(HOME, ".local/share/claude")),
    ...ro(join(HOME, ".local/bin")),
    ...ro(join(HOME, ".codex/packages")),
    // Auth only (read-write so token refreshes persist).
    ...rw(join(HOME, ".claude/.credentials.json")),
    ...rw(join(HOME, ".codex/auth.json")),
  ];
  if (cmd[0] === "codex") {
    codexCfg ??= codexConfig();
    args.push("--ro-bind", codexCfg, join(HOME, ".codex/config.toml"));
  }
  if (cmd[0] === "claude") {
    // A fresh ~/.claude.json so no project history or settings leak in.
    const dir = mkdtempSync(join(tmpdir(), "folio-claude-json-"));
    writeFileSync(join(dir, "claude.json"), JSON.stringify({ hasCompletedOnboarding: true, autoUpdates: false }) + "\n");
    args.push("--bind", join(dir, "claude.json"), join(HOME, ".claude.json"));
  }
  args.push(
    "--bind", runDir, runDir,
    ...ro(join(repo, "node_modules/typescript"), join(runDir, "node_modules/typescript")),
    "--chdir", runDir,
    "--unshare-pid", "--die-with-parent",
    "--setenv", "HOME", HOME,
    "--",
    ...cmd,
  );
  return args;
}

