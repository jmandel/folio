// Real-CLI smoke runs (cost money). Run with: FOLIO_SMOKE=1 bun test test/smoke.test.ts
// Records to <repo>/runs/smoke/<runId>/, replacing any previous run with the same id.
import { expect, test } from "bun:test";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { findRepoRoot, runAgent, type AgentTask } from "../src/index.ts";

const enabled = process.env.FOLIO_SMOKE === "1";
const prompt = 'Create the file out/hello.txt containing exactly the two characters "hi" (no newline). Then reply "done".';

async function smoke(runId: string, task: Omit<AgentTask, "family" | "runId" | "prompt">) {
  rmSync(join(findRepoRoot(), "runs/smoke", runId), { recursive: true, force: true });
  const r = await runAgent({ family: "smoke", runId, prompt, expectFiles: ["hello.txt"], timeoutMs: 5 * 60_000, ...task }, { retries: 0 });
  console.log(runId, JSON.stringify({ ok: r.meta.ok, error: r.meta.error, durationMs: r.meta.durationMs, costUsd: r.meta.costUsd, usage: r.meta.usage, finalText: r.finalText }));
  expect(r.meta.ok).toBe(true);
  expect(r.outputs["hello.txt"]?.trim()).toBe("hi");
  expect(r.meta.durationMs).toBeGreaterThan(0);
  return r;
}

test.skipIf(!enabled)("claude haiku", async () => {
  const r = await smoke("claude-haiku", { backend: "claude", model: "haiku" });
  expect(r.meta.costUsd).toBeGreaterThan(0);
}, 300_000);

test.skipIf(!enabled)("codex default model", async () => {
  await smoke("codex", { backend: "codex" });
}, 300_000);

test.skipIf(!enabled)("claude haiku in tmux", async () => {
  const r = await smoke("claude-haiku-tmux", { backend: "claude", model: "haiku", tmux: { session: "folio-agents-smoke" } });
  expect(r.meta.tmux?.session).toBe("folio-agents-smoke");
  expect(r.meta.costUsd).toBeGreaterThan(0);
}, 300_000);
