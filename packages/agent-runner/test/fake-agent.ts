// Stand-in for a CLI agent. Usage: bun fake-agent.ts <mode> [stateDir]
// Reads the prompt from stdin, emits claude-style stream-json, writes into ./out/.
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [mode, stateDir] = process.argv.slice(2);
const prompt = await new Response(Bun.stdin.stream()).text();
const emit = (e: unknown) => console.log(JSON.stringify(e));
emit({ type: "system", subtype: "init", session_id: "fake-session" });
writeFileSync("out/prompt-echo.txt", prompt);

if (mode === "sleep") {
  const child = Bun.spawn(["sleep", "30"]);
  writeFileSync("out/child.pid", String(child.pid));
  await Bun.sleep(30_000);
}
if (mode === "fail") { console.error("boom"); process.exit(3); }
if (mode === "flaky" && stateDir) {
  const marker = join(stateDir, "tried");
  if (!existsSync(marker)) { writeFileSync(marker, "1"); process.exit(1); }
}
if (mode !== "nofile") writeFileSync("out/hello.txt", "hi");
emit({ type: "result", subtype: "success", is_error: false, result: "done: " + mode, total_cost_usd: 0.0012, num_turns: 2, session_id: "fake-session", usage: { input_tokens: 10, output_tokens: 5, nested: { x: 1 } } });
