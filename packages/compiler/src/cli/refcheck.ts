// bun packages/compiler/src/cli/refcheck.ts [split=dev] : hand-written reference mappers vs keys at every as-of date (triage tool; dev split only by default).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { REPO, SOURCES, type Split } from "../data.ts";
import { evaluateTransform, summary } from "../evaluate.ts";
const split = (process.argv[2] ?? "dev") as Split;
for (const s of SOURCES) {
  const ev = evaluateTransform(readFileSync(join(REPO, "packages/compiler/test/fixtures", `${s}-reference.ts`), "utf8"), s, "app", split);
  console.log(s, summary(ev));
  if (!ev.tsc.ok) console.log(ev.tsc.output.slice(0, 1500));
  const sig = new Map<string, number>();
  for (const w of ev.wrongRows) { const k = `${w.asOf} ${w.view} ${w.matched ? w.wrong.map((x) => x.field).join(",") : "missing"}${w.duplicated ? " dup" : ""}`; sig.set(k, (sig.get(k) ?? 0) + 1); }
  for (const [k, n] of [...sig].sort((a, b) => b[1] - a[1]).slice(0, 8)) console.log("   ", n, k, JSON.stringify(ev.wrongRows.find((w) => `${w.asOf} ${w.view} ${w.matched ? w.wrong.map((x) => x.field).join(",") : "missing"}${w.duplicated ? " dup" : ""}` === k)).slice(0, 400));
  for (const a of ev.anti.slice(0, 3)) console.log("    ANTI", JSON.stringify(a).slice(0, 300));
}
