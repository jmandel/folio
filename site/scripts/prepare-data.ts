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

write("data/index.json", {
  generated: new Date().toISOString().slice(0, 10),
  patients,
  sources: sourceIndex,
  traps,
  spec: specPages,
  runs,
});
write(".nojekyll", "");
console.log("site data written to site/public/data and site/public/hosts");
