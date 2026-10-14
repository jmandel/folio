// bun run gen [--seed S] [--size N]
// Truth + render (+ any accepted prose from the ledger) -> corpus/. No agent calls.
import { parseArgs } from "node:util";
import { build, resolveNarratives, writeCorpus } from "../corpus.ts";

const { values } = parseArgs({ options: { seed: { type: "string" }, size: { type: "string" } } });
const t0 = Date.now();
const b = build(values.seed, values.size ? +values.size : undefined);
const counts = resolveNarratives(b);
writeCorpus(b, counts);
const n = [...b.items.values()].reduce((a, x) => a + x.length, 0);
console.log(`${b.patients.length} patients, ${n} items written to corpus/ in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log("narratives:", counts);
