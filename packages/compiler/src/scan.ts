// Transcript scan: every tool call an agent made (claude stream-json tool_use, codex command_execution)
// is checked for filesystem paths outside its own run dir and for network or session-bus tools. The
// proxy's network.log (if present) adds every denied connection. Used as a gate in the compile loop and
// over all recorded runs by `bun packages/compiler/src/cli/scan.ts`.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface Finding { kind: "path" | "network" | "ipc" | "web-tool" | "denied-connection"; detail: string }

const NET = /(^|[\s;&|(])(curl|wget|ncat|nc|ssh|scp|rsync|telnet|ftp|npx|bunx)\s|\b(npm|bun|pnpm|yarn)\s+(install|add|i)\b|\bgit\s+(clone|fetch|pull|ls-remote)\b|\bfetch\(\s*["'`]https?:/;
const IPC = /\b(busctl|systemd-run|dbus-send|gdbus|loginctl)\b|\/run\/user\/|DBUS_SESSION/;
const PATH = /(?:^|[\s"'=(:])((?:\/home\/[^\s"'`;|&)]+)|(?:~\/[^\s"'`;|&)]*))/g;

/** Commands and paths the agent asked for, in order. */
export function toolCalls(runDir: string): { tool: string; text: string }[] {
  const p = join(runDir, "transcript.jsonl");
  if (!existsSync(p)) return [];
  const out: { tool: string; text: string }[] = [];
  for (const line of readFileSync(p, "utf8").split("\n")) {
    let e: any;
    try { e = JSON.parse(line); } catch { continue; }
    if (e.type === "assistant") for (const c of e.message?.content ?? []) if (c.type === "tool_use") out.push({ tool: c.name, text: JSON.stringify(c.input) });
    const item = e.item ?? e.msg;
    if (item && (item.type === "command_execution" || item.item_type === "command_execution") && item.command && e.type === "item.started") out.push({ tool: "shell", text: String(item.command) });
  }
  return out;
}

export function scanRun(runDir: string): Finding[] {
  const f: Finding[] = [];
  const own = runDir.replace(/\/$/, "");
  for (const c of toolCalls(runDir)) {
    if (/^(WebFetch|WebSearch)$/.test(c.tool)) f.push({ kind: "web-tool", detail: c.text.slice(0, 200) });
    // For Write/Edit, only the file path counts (file contents may legitimately mention URLs).
    const raw = /^(Write|Edit)$/.test(c.tool) ? (JSON.parse(c.text).file_path ?? "") : c.text.replace(/\\n/g, "\n");
    // Heredoc bodies are file contents (code, tests), not commands: drop them before matching.
    const text = raw.replace(/<<-?\s*\\?['"]?(\w+)\\?['"]?[\s\S]*?\n\1(?=\n|\\?"|$)/g, "<<HEREDOC");
    if (NET.test(text)) f.push({ kind: "network", detail: `${c.tool}: ${text.slice(0, 200)}` });
    if (IPC.test(text)) f.push({ kind: "ipc", detail: `${c.tool}: ${text.slice(0, 200)}` });
    if (/(?:\.\.\/){2,}|\bcd\s+\.\.(?:\s|;|&|$)/.test(text)) f.push({ kind: "path", detail: `${c.tool} (relative climb, check by hand): ${text.slice(0, 160)}` });
    for (const m of text.matchAll(PATH)) {
      const p = m[1].replace(/[\\,}\]]+$/, "");
      if (p.startsWith(own) || /^\/home\/[^/]+\/\.claude\/projects\/[^/]+\/[^/]+\/tool-results\//.test(p) || /^\/home\/[^/]+\/\.(cache|local\/share\/claude)\b/.test(p)) continue;
      f.push({ kind: "path", detail: `${c.tool}: ${p}` });
    }
  }
  const net = join(runDir, "network.log");
  if (existsSync(net)) for (const l of readFileSync(net, "utf8").split("\n")) if (/ DENY /.test(l)) f.push({ kind: "denied-connection", detail: l.trim() });
  return f;
}
