// Filesystem isolation for compiler-agent runs. The agent CLI runs under bubblewrap with the home
// directory and /tmp replaced by empty tmpfs mounts; only the run dir (read-write), the CLI binaries,
// the CLI's auth file and a read-only TypeScript install are mounted back. The repo (truth/, answer
// keys, TRAPS.md, other sources, NOTES.md), the user's agent histories and every other file under
// $HOME are therefore not reachable from inside the run, whatever tools the agent uses.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { findRepoRoot } from "../../agent-runner/src/index.ts";
import { ALLOW, FORWARDER, PROXY_PORT, spawnEgressProxy } from "./egress.ts";

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

/**
 * Wrap an agent CLI command in bubblewrap:
 * - filesystem: read-only root, empty tmpfs over $HOME, /tmp and /run/user/<uid> (no D-Bus or portals);
 *   mounted back: the run dir (rw), CLI binaries, the CLI auth file, a fresh ~/.claude.json, TypeScript (ro);
 * - no network (--unshare-net): the only route out is the allowlisting CONNECT proxy (egress.ts);
 * - no IPC namespace sharing, new PID namespace, cleared environment with an explicit minimal set.
 */
export function sandboxWrap(cmd: string[], runDir: string): string[] {
  const repo = findRepoRoot();
  const ro = (p: string, to = p) => (existsSync(p) ? ["--ro-bind", p, to] : []);
  const rw = (p: string, to = p) => (existsSync(p) ? ["--bind", p, to] : []);
  const backend = cmd[0] === "codex" ? "codex" : "claude";
  const egress = spawnEgressProxy(runDir, ALLOW[backend]);
  writeFileSync(join(egress.socketDir, "fwd.ts"), FORWARDER);
  process.once("exit", () => egress.stop());
  mkdirSync(join(runDir, "node_modules", "typescript"), { recursive: true });
  const uid = process.getuid?.() ?? 1000;
  const proxy = `http://127.0.0.1:${PROXY_PORT}`;
  const args = [
    "bwrap",
    "--ro-bind", "/", "/",
    "--dev", "/dev",
    "--proc", "/proc",
    "--tmpfs", "/tmp",
    "--tmpfs", HOME,
    "--tmpfs", `/run/user/${uid}`,
    ...ro(join(HOME, ".local/share/claude")),
    ...ro(join(HOME, ".local/bin")),
    ...ro(join(HOME, ".codex/packages")),
    ...rw(join(HOME, ".claude/.credentials.json")),
    ...rw(join(HOME, ".codex/auth.json")),
    "--ro-bind", egress.socketDir, "/tmp/folio-net",
  ];
  if (backend === "codex") {
    codexCfg ??= codexConfig();
    args.push("--ro-bind", codexCfg, join(HOME, ".codex/config.toml"));
  } else {
    const dir = mkdtempSync(join(tmpdir(), "folio-claude-json-"));
    writeFileSync(join(dir, "claude.json"), JSON.stringify({ hasCompletedOnboarding: true, autoUpdates: false }) + "\n");
    args.push("--bind", join(dir, "claude.json"), join(HOME, ".claude.json"));
  }
  const env: Record<string, string> = {
    HOME, USER: process.env.USER ?? "user", PATH: `${HOME}/.local/bin:/usr/local/bin:/usr/bin:/bin`, LANG: "C.UTF-8", TERM: "dumb",
    HTTPS_PROXY: proxy, HTTP_PROXY: proxy, https_proxy: proxy, http_proxy: proxy, ALL_PROXY: proxy, NO_PROXY: "localhost,127.0.0.1",
    DISABLE_TELEMETRY: "1", DISABLE_ERROR_REPORTING: "1", CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
  };
  args.push(
    "--bind", runDir, runDir,
    ...ro(join(repo, "node_modules/typescript"), join(runDir, "node_modules/typescript")),
    "--chdir", runDir,
    "--unshare-pid", "--unshare-net", "--unshare-ipc", "--unshare-uts", "--die-with-parent",
    "--clearenv", ...Object.entries(env).flatMap(([k, v]) => ["--setenv", k, v]),
    "--",
    "sh", "-c", `bun /tmp/folio-net/fwd.ts /tmp/folio-net/proxy.sock ${PROXY_PORT} & sleep 0.5; exec "$@"`, "sh",
    ...cmd,
  );
  return args;
}
