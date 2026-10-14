import { afterAll, afterEach, beforeAll, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { __setBackendCommandForTests, findRepoRoot, listRuns, pool, PROMPT_FOOTER, replay, runAgent } from "../src/index.ts";

const fake = join(import.meta.dir, "fake-agent.ts");
let runsRoot: string;
let stateDir: string;
const useFake = (mode: string) => __setBackendCommandForTests(() => ["bun", fake, mode, stateDir]);

beforeAll(() => {
  runsRoot = mkdtempSync(join(tmpdir(), "agent-runner-runs-"));
  stateDir = mkdtempSync(join(tmpdir(), "agent-runner-state-"));
});
afterEach(() => __setBackendCommandForTests(null));
afterAll(() => { rmSync(runsRoot, { recursive: true, force: true }); rmSync(stateDir, { recursive: true, force: true }); });

describe("runAgent with a fake backend", () => {
  test("records prompt, inputs, transcript, outputs and meta", async () => {
    useFake("ok");
    const events: unknown[] = [];
    const r = await runAgent(
      { family: "unit/ok", runId: "r1", prompt: "say hi", backend: "claude", model: "haiku", inputs: { "a/b.txt": "B" }, expectFiles: ["hello.txt"] },
      { runsRoot, onEvent: (e) => events.push(e) },
    );
    expect(r.meta.ok).toBe(true);
    expect(r.runDir).toBe(join(runsRoot, "unit/ok/r1"));
    expect(readFileSync(join(r.runDir, "prompt.md"), "utf8")).toBe("say hi" + PROMPT_FOOTER);
    expect(readFileSync(join(r.runDir, "in/a/b.txt"), "utf8")).toBe("B");
    expect(r.outputs["hello.txt"]).toBe("hi");
    expect(r.outputs["prompt-echo.txt"]).toContain("Write all output files under ./out/");
    expect(r.finalText).toBe("done: ok");
    expect(r.meta).toMatchObject({ costUsd: 0.0012, numTurns: 2, sessionId: "fake-session", exitCode: 0, timedOut: false, attempt: 1, model: "haiku" });
    expect(r.meta.usage).toEqual({ input_tokens: 10, output_tokens: 5 });
    expect(r.meta.producedFiles).toEqual(["hello.txt", "prompt-echo.txt"]);
    expect(r.meta.durationMs).toBeGreaterThan(0);
    expect(events.length).toBe(2);
    expect(existsSync(join(r.runDir, "transcript.jsonl"))).toBe(true);
    expect(existsSync(join(r.runDir, "stderr.log"))).toBe(true);
  });

  test("replay and listRuns read disk only", async () => {
    useFake("ok");
    const live = await runAgent({ family: "unit/replay", runId: "r1", prompt: "x", backend: "claude" }, { runsRoot });
    __setBackendCommandForTests(() => { throw new Error("must not launch"); });
    const again = replay("unit/replay", "r1", { runsRoot });
    expect(again).toEqual(live);
    expect(listRuns("unit/replay", { runsRoot }).map((m) => m.runId)).toEqual(["r1"]);
    expect(listRuns("nope", { runsRoot })).toEqual([]);
  });

  test("timeout kills the whole process tree", async () => {
    useFake("sleep");
    const t0 = Date.now();
    const r = await runAgent({ family: "unit/timeout", prompt: "x", backend: "claude", timeoutMs: 1500 }, { runsRoot, retries: 0 });
    expect(Date.now() - t0).toBeLessThan(10_000);
    expect(r.meta.ok).toBe(false);
    expect(r.meta.timedOut).toBe(true);
    expect(r.meta.error).toContain("timed out");
    const pid = Number(readFileSync(join(r.runDir, "out/child.pid"), "utf8"));
    await Bun.sleep(200);
    expect(() => process.kill(pid, 0)).toThrow();
  });

  test("failure is reported, not thrown; retries create new run dirs", async () => {
    useFake("fail");
    const r = await runAgent({ family: "unit/fail", runId: "f", prompt: "x", backend: "claude" }, { runsRoot, retries: 2 });
    expect(r.meta.ok).toBe(false);
    expect(r.meta.exitCode).toBe(3);
    expect(r.meta.attempt).toBe(3);
    expect(r.meta.runId).toBe("f-a3");
    expect(r.meta.previousRunId).toBe("f-a2");
    expect(readFileSync(join(runsRoot, "unit/fail/f/stderr.log"), "utf8")).toContain("boom");
    expect(listRuns("unit/fail", { runsRoot }).map((m) => m.attempt)).toEqual([1, 2, 3]);
  });

  test("retry recovers a flaky run; missing expectFiles counts as failure", async () => {
    useFake("flaky");
    const r = await runAgent({ family: "unit/flaky", runId: "k", prompt: "x", backend: "claude" }, { runsRoot });
    expect(r.meta).toMatchObject({ ok: true, attempt: 2, runId: "k-a2", previousRunId: "k" });

    useFake("nofile");
    const m = await runAgent({ family: "unit/missing", prompt: "x", backend: "codex", expectFiles: ["hello.txt"] }, { runsRoot, retries: 0 });
    expect(m.meta.ok).toBe(false);
    expect(m.meta.exitCode).toBe(0);
    expect(m.meta.error).toContain("missing expected files: hello.txt");
  });

  test("missing executable is a failed run, not a throw", async () => {
    __setBackendCommandForTests(() => ["/nonexistent/agent-cli"]);
    const r = await runAgent({ family: "unit/enoent", prompt: "x", backend: "claude" }, { runsRoot, retries: 0 });
    expect(r.meta.ok).toBe(false);
    expect(r.meta.error).toContain("ENOENT");
  });

  test("programmer errors throw", async () => {
    await expect(runAgent({ family: "../x", prompt: "x", backend: "claude" }, { runsRoot })).rejects.toThrow();
    await expect(runAgent({ family: "ok", prompt: "x", backend: "claude", inputs: { "/etc/x": "" } }, { runsRoot })).rejects.toThrow();
    await expect(runAgent({ family: "ok", prompt: "x", backend: "gpt" as never }, { runsRoot })).rejects.toThrow();
  });

  test("default run ids sort by time", async () => {
    useFake("ok");
    const a = await runAgent({ family: "unit/ids", prompt: "x", backend: "claude" }, { runsRoot });
    const b = await runAgent({ family: "unit/ids", prompt: "x", backend: "claude" }, { runsRoot });
    expect(a.meta.runId < b.meta.runId).toBe(true);
    expect(a.meta.runId).toMatch(/^\d{8}T\d{9}Z-[a-z0-9]+$/);
  });
});

test("tmux mode records the same files", async () => {
  const which = Bun.spawnSync(["which", "tmux"]);
  if (which.exitCode !== 0) return;
  const session = `agent-runner-test-${process.pid}`;
  try {
    useFake("ok");
    const r = await runAgent({ family: "unit/tmux", prompt: "x", backend: "claude", tmux: { session } }, { runsRoot });
    expect(r.meta.ok).toBe(true);
    expect(r.meta.tmux?.session).toBe(session);
    expect(r.outputs["hello.txt"]).toBe("hi");
    expect(r.finalText).toBe("done: ok");
    useFake("sleep");
    const t = await runAgent({ family: "unit/tmux", prompt: "x", backend: "claude", tmux: { session }, timeoutMs: 1500 }, { runsRoot, retries: 0 });
    expect(t.meta.timedOut).toBe(true);
    const pid = Number(readFileSync(join(t.runDir, "out/child.pid"), "utf8"));
    expect(() => process.kill(pid, 0)).toThrow();
  } finally {
    Bun.spawnSync(["tmux", "kill-session", "-t", `=${session}`]);
  }
}, 20_000);

test("pool bounds concurrency and preserves order", async () => {
  let active = 0, peak = 0;
  const out = await pool([50, 10, 30, 0, 20], 2, async (ms, i) => {
    active++; peak = Math.max(peak, active);
    await Bun.sleep(ms);
    active--;
    return i * 10;
  });
  expect(out).toEqual([0, 10, 20, 30, 40]);
  expect(peak).toBe(2);
  expect(await pool([], 3, async () => 1)).toEqual([]);
});

test("findRepoRoot finds the workspace root", () => {
  const root = findRepoRoot(import.meta.dir);
  expect(JSON.parse(readFileSync(join(root, "package.json"), "utf8")).workspaces).toBeDefined();
});
