// bun site/scripts/prepare-data.ts
//
// Prepares the static data the workbench reads at runtime (no server). Inputs: build/signed/ (from
// `bun run sign`), corpus/ (answer-key patient index, prose ledger), sources/, spec/, truth/TRAPS.md
// and runs/. Outputs, all git-ignored:
//
//   site/public/data/index.json              patients, sources, traps, spec pages, run list
//   site/public/data/patients/<pid>.json     the patient's signed items (.folio.sd-jwt text, as served)
//   site/public/data/sources/<dir>.json      README, schema text, examples
//   site/public/data/runs/<runId>.json       one recorded prose run (prompt, transcript, outputs)
//   site/public/data/mapper-runs/<runId>.json one recorded mapper compile (inputs, transcript, transform.ts)
//   site/public/data/mappers/views.d.ts      the views the mappers compile into
//   site/public/data/spec/<name>.md          spec pages
//   site/public/hosts/<host>/.well-known/did.json            did:web documents
//   site/public/hosts/<host>/folio/schemas/<file>.d.ts        schemas at their published paths
//
// The browser maps each DID host to `hosts/<host>` (a did:web host map), so signature checks and
// schema-hash checks run against these files exactly as they would against the issuers' own hosts.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { build } from "../../packages/render/src/corpus.ts";
import { parseNotesFile } from "../../packages/render/src/prose.ts";

const ROOT = resolve(import.meta.dir, "../..");
const PUB = join(ROOT, "site/public");
const DATA = join(PUB, "data");
const SIGNED = join(ROOT, "build/signed");

if (!existsSync(SIGNED)) {
  console.error("build/signed is missing: run `bun run sign` first.");
  process.exit(1);
}
rmSync(DATA, { recursive: true, force: true });
rmSync(join(PUB, "hosts"), { recursive: true, force: true });

const write = (rel: string, data: unknown) => {
  const p = join(PUB, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, typeof data === "string" ? data : JSON.stringify(data));
};

// ─── sources ──────────────────────────────────────────────────────────────────────────────────────
const SOURCES = [
  { key: "A", dir: "riverside", name: "Riverside Regional Hospital", short: "Riverside", kind: "Hospital", style: "Signed documents" },
  { key: "B", dir: "northgate", name: "Northgate Family Medicine", short: "Northgate", kind: "Primary care", style: "Event log" },
  { key: "C", dir: "lakeview", name: "Lakeview Labs & Kidney Care", short: "Lakeview", kind: "Lab and nephrology", style: "Coded tables" },
  { key: "P", dir: "homelog", name: "HomeLog", short: "HomeLog", kind: "Patient's app", style: "Patient-generated day pages" },
] as const;

const sourceIndex = SOURCES.map((s) => {
  const did = JSON.parse(readFileSync(join(ROOT, "sources", s.dir, "keys/did.json"), "utf8"));
  const host = (did.id as string).slice("did:web:".length);
  write(`hosts/${host}/.well-known/did.json`, JSON.stringify(did, null, 2));
  const schemaFile = readdirSync(join(ROOT, "sources", s.dir, "schema")).find((f) => f.endsWith(".d.ts"))!;
  const schemaText = readFileSync(join(ROOT, "sources", s.dir, "schema", schemaFile), "utf8");
  write(`hosts/${host}/folio/schemas/${schemaFile}`, schemaText);
  const examples = readdirSync(join(ROOT, "sources", s.dir, "examples"))
    .filter((f) => f.endsWith(".folio.md"))
    .sort()
    .map((f) => ({ file: f, text: readFileSync(join(ROOT, "sources", s.dir, "examples", f), "utf8") }));
  write(`data/sources/${s.dir}.json`, {
    readme: readFileSync(join(ROOT, "sources", s.dir, "README.md"), "utf8"),
    schemaFile,
    schemaText,
    examples,
  });
  return { ...s, issuer: did.id, host, schemaFile };
});

// ─── traps (truth/TRAPS.md, one section per trap) ─────────────────────────────────────────────────
const trapsMd = readFileSync(join(ROOT, "truth/TRAPS.md"), "utf8");
const traps = [...trapsMd.matchAll(/^### (T\d+)\. (.+)\n([\s\S]*?)(?=^### |^## |(?![\s\S]))/gm)].map((m) => ({
  id: m[1],
  title: m[2].trim(),
  body: m[3].trim(),
}));

// ─── spec ─────────────────────────────────────────────────────────────────────────────────────────
const specPages = ["record-item", "schema-conventions", "signing", "sync"];
for (const p of specPages) write(`data/spec/${p}.md`, readFileSync(join(ROOT, "spec", `${p}.md`), "utf8"));
write("data/spec/hero.md", readFileSync(join(ROOT, "truth/HERO.md"), "utf8"));
write("data/spec/traps.md", trapsMd);

// ─── patients ─────────────────────────────────────────────────────────────────────────────────────
const SHOWN = ["hero", "s01", "s02", "s03", "s04", "p016", "p047", "p076", "p155", "p217"];
const patientsIdx = JSON.parse(readFileSync(join(ROOT, "corpus/answers/patients.json"), "utf8")) as {
  patient: string; role: string; name: string; birth_date: string; sex: string; sources: Record<string, string>;
}[];

console.log("rendering truth for item keys and trap tags…");
const built = build();
const ledger = JSON.parse(readFileSync(join(ROOT, "corpus/prose-ledger.json"), "utf8"));

/** note key → where its accepted text went, per (patient, source dir). */
const itemByKey = new Map<string, { pid: string; dir: string; file: string; id: string; issuer: string }>();
const patients = [];
for (const pid of SHOWN) {
  const meta = patientsIdx.find((p) => p.patient === pid)!;
  const rendered = built.items.get(pid)!;
  const byFile = new Map(rendered.map((r) => [`${r.dir}/${r.file}`, r]));
  const items = [];
  for (const s of SOURCES) {
    const local = meta.sources[s.dir];
    if (!local) continue;
    const dir = join(SIGNED, s.dir, local);
    for (const f of readdirSync(dir).sort()) {
      const mdName = f.replace(/\.folio\.sd-jwt$/, ".folio.md");
      const r = byFile.get(`${s.dir}/${mdName}`);
      if (!r) throw new Error(`no rendered item for ${s.dir}/${local}/${mdName}`);
      itemByKey.set(`${pid}/${s.dir}/${r.key}`, { pid, dir: s.dir, file: mdName, id: r.item.id, issuer: r.item.issuer });
      items.push({
        source: s.dir,
        file: mdName,
        key: r.key,
        traps: [...new Set(r.traps)].sort((a, b) => +a.slice(1) - +b.slice(1)),
        fixture: r.fixture,
        sdJwt: readFileSync(join(dir, f), "utf8").trim(),
      });
    }
  }
  write(`data/patients/${pid}.json`, { patient: pid, items });
  patients.push({ ...meta, items: items.length });
  console.log(`${pid}: ${items.length} items`);
}

// ─── recorded prose runs for the shown patients ──────────────────────────────────────────────────
const runs: unknown[] = [];
for (const [batchKey, batch] of Object.entries<any>(ledger.batches)) {
  const [pid, dir] = batchKey.split("/");
  if (!SHOWN.includes(pid)) continue;
  for (const lr of batch.runs) {
    const [family, runId] = lr.run.split("/");
    const rdir = join(ROOT, "runs", family, runId);
    if (!existsSync(rdir)) continue;
    const meta = JSON.parse(readFileSync(join(rdir, "meta.json"), "utf8"));
    const notesText = existsSync(join(rdir, "out/notes.md")) ? readFileSync(join(rdir, "out/notes.md"), "utf8") : "";
    const notes = [...parseNotesFile(notesText)].map(([key, text]) => {
      const acc = batch.items[key];
      const accepted = acc?.run === lr.run;
      return { key, text, accepted, item: accepted ? itemByKey.get(`${pid}/${dir}/${key}`) : undefined };
    });
    const transcript = readFileSync(join(rdir, "transcript.jsonl"), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l))
      .filter((e) => e.type !== "rate_limit_event")
      .map((e) => (e.type === "system" ? { type: "system", subtype: e.subtype, model: e.model, tools: e.tools, cwd: e.cwd } : e));
    write(`data/runs/${runId}.json`, {
      runId, family, patient: pid, source: dir, meta,
      prompt: readFileSync(join(rdir, "prompt.md"), "utf8"),
      transcript, notes,
    });
    runs.push({
      runId, family, patient: pid, source: dir, attempt: lr.attempt, requested: lr.requested, accepted: lr.accepted,
      backend: lr.backend, model: lr.model, costUsd: lr.costUsd, durationMs: lr.durationMs,
    });
  }
}
console.log(`${runs.length} runs`);

// ─── recorded mapper compiles: the cached views-v3 mapper of each source ────────────────────────
// One run per source: the run whose transform.ts is the cached mapper the front page uses
// (site/scripts/merged-story.ts). Only what the Compiler view shows is copied: the prompt, the input
// files except the schema and views (published elsewhere on the site, checked identical here), the
// transcript with long tool results cut, the transform, the cache gates and this run's held-out scores.
const MAPPER_RUNS = [
  { source: "riverside", family: "compiler/riverside/app/claude-opus", runId: "20261014T153539589Z-ml0t" },
  { source: "northgate", family: "compiler/northgate/app/claude-opus", runId: "20261014T153538312Z-nujp" },
  { source: "lakeview", family: "compiler/lakeview/app/claude-opus", runId: "20261014T153539262Z-il83" },
  { source: "homelog", family: "compiler/homelog/app/claude-opus", runId: "20261014T154025060Z-lt22" },
];
const VIEWS_FILE = join(ROOT, "packages/views/views.d.ts");
write("data/mappers/views.d.ts", readFileSync(VIEWS_FILE, "utf8"));
const RESULT_CAP = 2000;
const scoresAt = (file: string, date: string) => {
  if (!existsSync(file)) return undefined;
  const ev = JSON.parse(readFileSync(file, "utf8"));
  return Object.fromEntries(Object.entries<any>(ev.byDate?.[date] ?? {}).map(([v, c]) => [v, { rows: c.rows, wrongRows: c.wrongRows, extraRows: c.extraRows }]));
};
const mapperRuns: unknown[] = [];
for (const mr of MAPPER_RUNS) {
  const rdir = join(ROOT, "runs", mr.family, mr.runId);
  const meta = JSON.parse(readFileSync(join(rdir, "meta.json"), "utf8"));
  const src = sourceIndex.find((s) => s.dir === mr.source)!;
  // The schema and views the agent saw are the files the site already publishes.
  const same = (a: string, b: string) => readFileSync(a).equals(readFileSync(b));
  if (!same(join(rdir, "in/schema", src.schemaFile), join(ROOT, "sources", mr.source, "schema", src.schemaFile))) throw new Error(`${mr.runId}: schema differs from sources/`);
  if (!same(join(rdir, "in/views/views.d.ts"), VIEWS_FILE)) throw new Error(`${mr.runId}: views differ from packages/views`);
  // The cache entry whose provenance names this run, and its transform must be the run's output.
  let cache: { path: string; prov: any } | undefined;
  for (const h of readdirSync(join(ROOT, "mappers")))
    for (const v of readdirSync(join(ROOT, "mappers", h)))
      for (const b of readdirSync(join(ROOT, "mappers", h, v))) {
        const prov = JSON.parse(readFileSync(join(ROOT, "mappers", h, v, b, "provenance.json"), "utf8"));
        if (prov.chosen?.runId === mr.runId) cache = { path: `mappers/${h}/${v}/${b}/transform.ts`, prov };
      }
  if (!cache) throw new Error(`${mr.runId} is not a cached mapper`);
  const transform = readFileSync(join(rdir, "out/transform.ts"), "utf8");
  if (transform !== readFileSync(join(ROOT, cache.path), "utf8")) throw new Error(`${mr.runId}: out/transform.ts differs from ${cache.path}`);

  const strip = (t: string) => t.split(meta.cwd + "/").join("").split(meta.cwd).join(".");
  const cut = (c: any) => {
    if (typeof c === "string") return c.length > RESULT_CAP ? c.slice(0, RESULT_CAP) + `\n… (${(c.length - RESULT_CAP).toLocaleString()} more characters)` : c;
    if (Array.isArray(c)) return c.map((x) => (x?.type === "text" ? { ...x, text: cut(x.text) } : x));
    return c;
  };
  const transcript = strip(readFileSync(join(rdir, "transcript.jsonl"), "utf8"))
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l))
    .filter((e) => e.type !== "rate_limit_event" && !(e.type === "system" && e.subtype !== "init"))
    .map((e) => {
      if (e.type === "system") return { type: "system", subtype: e.subtype, model: e.model, tools: e.tools };
      if (e.type === "user")
        return { type: "user", message: { content: (e.message?.content ?? []).map((c: any) => (c.type === "tool_result" ? { type: "tool_result", content: cut(c.content) } : c)) } };
      if (e.type === "assistant") return { type: "assistant", message: { content: e.message?.content ?? [] } };
      return e;
    });
  const listFiles = (sub: string, skip: string[] = []) =>
    readdirSync(join(rdir, "in", sub))
      .filter((f) => !skip.includes(f))
      .sort()
      .map((f) => ({ file: `in/${sub}/${f}`, text: readFileSync(join(rdir, "in", sub, f), "utf8") }));
  const scores = scoresAt(join(ROOT, "results/stage3/evals-fresh", `${mr.runId}.json`), "2026-10-13");
  const frozen = scoresAt(join(ROOT, "results/stage3/evals-fresh-frozen-26ee28163e5c6e69", `${mr.runId}.json`), "2026-10-13");
  const { cmd: _cmd, cwd: _cwd, sessionId: _sid, ...metaShown } = meta;
  write(`data/mapper-runs/${mr.runId}.json`, {
    runId: mr.runId,
    family: mr.family,
    source: mr.source,
    meta: metaShown,
    prompt: readFileSync(join(rdir, "prompt.md"), "utf8"),
    samples: listFiles("samples", ["samples.json"]),
    harness: listFiles("harness"),
    transcript,
    transform,
    cachePath: cache.path,
    gates: cache.prov.gates,
    scores,
    frozenScores: frozen,
  });
  mapperRuns.push({
    runId: mr.runId, family: mr.family, source: mr.source, backend: meta.backend, model: meta.model,
    durationMs: meta.durationMs, costUsd: meta.costUsd, numTurns: meta.numTurns,
  });
}
console.log(`${mapperRuns.length} mapper runs`);

// ─── views-v3 headline from the Stage 3 scorecard (corrected key, frozen-key values beside) ─────
const card = JSON.parse(readFileSync(join(ROOT, "results/stage3/scorecard.json"), "utf8"));
const BACKENDS = ["claude-opus", "codex-gpt-6-astra", "claude-sonnet"];
const cell = (c: any) => c && { mean: c.mean, min: c.min, max: c.max, extra: c.extra, n: c.n };
const mapperResults = {
  keyHash: card.keys_sha256,
  asOf: "2026-10-13",
  backends: BACKENDS,
  rows: card.headline.map((h: any) => ({
    source: h.source,
    view: h.view,
    rows: h.rows,
    cells: Object.fromEntries(BACKENDS.map((b) => [b, cell(h.cells[b])])),
    frozen: Object.fromEntries(
      BACKENDS.filter((b) => h.frozenKey?.[b] && (h.frozenKey[b].mean !== h.cells[b].mean || h.frozenKey[b].max !== h.cells[b].max)).map((b) => [b, cell(h.frozenKey[b])]),
    ),
  })),
};

write("data/index.json", {
  generated: new Date().toISOString().slice(0, 10),
  patients,
  sources: sourceIndex,
  traps,
  spec: specPages,
  runs,
  mapperRuns,
  mapperResults,
});
write(".nojekyll", "");
console.log("site data written to site/public/data and site/public/hosts");
