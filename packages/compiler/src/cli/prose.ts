// bun packages/compiler/src/cli/prose.ts <source...> : run (or reuse) the prose extraction for the dev (30 items) and test (40 items) splits.
import { proseSample } from "../prose.ts";
import type { Source } from "../data.ts";
const sources = process.argv.slice(2) as Source[];
await Promise.all(sources.flatMap((s) => [proseSample(s, "dev", 30), proseSample(s, "test", 40)].map((p) => p.then((x) => console.log(`${x.source}/${x.split}: run ${x.runId}, ${x.items.length} items, ${x.items.reduce((a, i) => a + i.facts.length, 0)} facts, cost ${x.costUsd?.toFixed(2)}`)))));
