// bun run sign [--out build/signed]
//
// Signs the committed (unsigned) corpus into a git-ignored build directory: one `.folio.sd-jwt` per
// item, same layout as corpus/<source>/<patient>/. Keys come from sources/<source>/keys. Salts are
// seeded per item (dev only, see work/decisions.md "Stage 2 follow-up"), and Ed25519 signatures are
// deterministic, so the same corpus always yields byte-identical output. Sync nodes serve these
// files as they are; they do not re-sign.

import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { parseMarkdown, seededSalts, sign } from "../../../core/src/index.ts";
import { loadIssuerKey } from "../../../core/src/node.ts";
import { pool } from "../../../agent-runner/src/index.ts";

const ROOT = resolve(import.meta.dir, "../../../..");
const { values } = parseArgs({ options: { out: { type: "string", default: "build/signed" }, seed: { type: "string", default: "folio-dev-salts-1" } } });
const OUT = resolve(ROOT, values.out!);
rmSync(OUT, { recursive: true, force: true });

const t0 = Date.now();
let n = 0;
const digest = createHash("sha256");
for (const source of ["riverside", "northgate", "lakeview", "homelog"]) {
  const key = loadIssuerKey(join(ROOT, "sources", source, "keys"));
  const jobs: { src: string; dst: string }[] = [];
  for (const patient of readdirSync(join(ROOT, "corpus", source)).sort())
    for (const f of readdirSync(join(ROOT, "corpus", source, patient)).sort())
      if (f.endsWith(".folio.md")) jobs.push({ src: join(ROOT, "corpus", source, patient, f), dst: join(OUT, source, patient, f.replace(/\.folio\.md$/, ".folio.sd-jwt")) });
  const out = await pool(jobs, 16, async (j) => {
    const item = parseMarkdown(readFileSync(j.src, "utf8"));
    const sdJwt = await sign(item, key, { saltGenerator: seededSalts(`${values.seed}/${item.issuer}/${item.id}`) });
    mkdirSync(join(j.dst, ".."), { recursive: true });
    writeFileSync(j.dst, sdJwt + "\n");
    return sdJwt;
  });
  for (const s of out) digest.update(s);
  n += jobs.length;
  console.log(`${source}: ${jobs.length} items signed`);
}
console.log(`${n} items signed into ${values.out} in ${((Date.now() - t0) / 1000).toFixed(1)}s; content digest ${digest.digest("hex").slice(0, 16)}`);
