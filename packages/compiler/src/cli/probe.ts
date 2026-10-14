// bun packages/compiler/src/cli/probe.ts [claude|codex] : isolation probe through the same sandbox as compile runs.
// The agent runs a fixed list of shell commands and writes their output to out/probe.txt.
import { runAgent } from "../../../agent-runner/src/index.ts";
import { sandboxWrap } from "../sandbox.ts";
const backend = (process.argv[2] ?? "claude") as "claude" | "codex";
// "--codex-nosandbox": run codex with its own command sandbox off (inside bwrap), so its shell can reach the proxy.
const nosb = process.argv.includes("--codex-nosandbox");
const api = backend === "claude" ? "https://api.anthropic.com/v1/messages" : "https://chatgpt.com/";
const script = [
  `echo '== github via proxy'; curl -sS -m 10 -o /dev/null -w '%{http_code}\\n' https://github.com/jmandel/folio 2>&1`,
  `echo '== github direct'; curl --noproxy '*' -sS -m 10 -o /dev/null -w '%{http_code}\\n' https://github.com 2>&1`,
  `echo '== raw.githubusercontent via proxy'; curl -sS -m 10 -o /dev/null -w '%{http_code}\\n' https://raw.githubusercontent.com/jmandel/folio/main/truth/TRAPS.md 2>&1`,
  `echo '== model API via proxy'; curl -sS -m 10 -o /dev/null -w '%{http_code}\\n' ${api} 2>&1`,
  `echo '== model API direct'; curl --noproxy '*' -sS -m 10 -o /dev/null -w '%{http_code}\\n' ${api} 2>&1`,
  `echo '== home'; ls -la ~ 2>&1; ls -la ~/.claude ~/.codex 2>&1; ls ~/hobby ~/hobby/folio 2>&1`,
  `echo '== repo files'; cat ~/hobby/folio/truth/TRAPS.md 2>&1 | head -2; ls ~/hobby/folio/.worktrees/stage3/truth 2>&1; ls ~/.claude/projects 2>&1`,
  `echo '== /tmp and /run/user'; ls -la /tmp /run/user/$(id -u) 2>&1`,
  `echo '== dbus'; busctl --user list 2>&1 | head -3; echo "DBUS=$DBUS_SESSION_BUS_ADDRESS"`,
  `echo '== env'; env | sort`,
].join("; ");
const r = await runAgent({
  family: `compiler/isolation-probe-v2/${backend}${nosb ? "-nosandbox" : ""}`, backend, model: backend === "claude" ? "sonnet" : undefined,
  prompt: `Run exactly this shell command once and save its full output, unmodified, to out/probe.txt:\n\n\`\`\`sh\n${script}\n\`\`\`\n\nThen stop.`,
  allowedTools: ["Read", "Write", "Bash"], extraArgs: backend === "claude" ? ["--disallowedTools=WebFetch,WebSearch"] : nosb ? ["--dangerously-bypass-approvals-and-sandbox"] : [],
  expectFiles: ["probe.txt"], wrapCommand: sandboxWrap, timeoutMs: 10 * 60_000,
}, { retries: 0 });
console.log(r.meta.runId, r.meta.ok, r.meta.error ?? "");
console.log(r.outputs["probe.txt"]);
process.exit(0);
