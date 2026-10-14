// FOLIO_COHORT=fresh bun run score [--no-fhir] : round-3 scorecard. Scores every round-3 mapper on the fresh held-out cohort
// (all three as-of dates; the latest is primary), reads the main-cohort secondary results (cli/score-main.ts), validates the
// round-2 US Core mappers with the HL7 validator, and writes results/stage3/scorecard.json and SCORECARD.md.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { type CompileRecord, evalPath, keysHash, readTransformOf, RESULTS } from "../compile.ts";
import { COHORT, REPO, SOURCES, type Source, truth } from "../data.ts";
import { AS_OF_DATES, type Eval, evaluateTransform, type ViewScore, VOLUME_TRAPS } from "../evaluate.ts";
import { validateUsCore } from "../fhirvalidate.ts";
import { backendOf, cacheMappers, DEV_GATE, endToEnd, loadRecords } from "../report.ts";
import { VIEWS } from "../score.ts";

if (COHORT !== "fresh") throw new Error("run with FOLIO_COHORT=fresh");
const { values } = parseArgs({ options: { "no-fhir": { type: "boolean" }, reeval: { type: "boolean" } } });
const recs = loadRecords();
const KEYS = keysHash();
const LATEST = AS_OF_DATES[AS_OF_DATES.length - 1];
const TRAP_NAMES: Record<string, { name: string }> = JSON.parse(readFileSync(join(REPO, "corpus/MANIFEST.json"), "utf8")).traps;
const secondary: any[] = existsSync(join(RESULTS, "secondary-main.json")) ? JSON.parse(readFileSync(join(RESULTS, "secondary-main.json"), "utf8")) : [];
const BACKS = ["claude-opus", "codex-gpt-6-astra", "claude-sonnet"].filter((b) => recs.some((r) => r.backend === b));
const short = (b: string) => b.replace("claude-", "").replace("-gpt-6-astra", "");
const pct = (x: number | null | undefined) => (x === null || x === undefined || Number.isNaN(x) ? "–" : (100 * x).toFixed(1));

// Score every final mapper on the fresh cohort (cached per run id).
const evals = new Map<string, Eval>();
for (const r of recs) {
  if (!r.final) continue;
  const p = evalPath(r.final, "fresh");
  if (!values.reeval && existsSync(p)) { evals.set(r.final, JSON.parse(readFileSync(p, "utf8"))); continue; }
  const ev = evaluateTransform(readTransformOf(r.source, r.viewSet, backendOf(r.backend), r.final), r.source, r.viewSet, "test");
  mkdirSync(join(RESULTS, "evals-fresh"), { recursive: true });
  writeFileSync(p, JSON.stringify({ runId: r.final, ...ev }) + "\n");
  evals.set(r.final, ev);
  console.log(`scored ${r.source}/${r.viewSet}/${r.backend}/${r.variant}/r${r.rep}`);
}
const find = (s: Source, vs: string, b: string, variant = "full") => recs.filter((r) => r.source === s && r.viewSet === vs && r.backend === b && r.condition === "a" && (r.variant ?? "full") === variant).sort((a, b2) => a.rep - b2.rep);
type Agg = { mean: number; min: number; max: number; n: number; rows: number; extra: number; failed: number };
function agg(rs: CompileRecord[], view: string, date = LATEST, from: (r: CompileRecord) => Record<string, ViewScore> | undefined = (r) => (r.final ? evals.get(r.final)?.byDate[date] : undefined)): Agg | undefined {
  const xs = rs.map((r) => from(r)?.[view]).filter((v): v is ViewScore => !!v && v.rows > 0);
  if (!xs.length) return undefined;
  const rates = xs.map((v) => v.wrongRows / v.rows);
  return { mean: rates.reduce((a, b) => a + b, 0) / rates.length, min: Math.min(...rates), max: Math.max(...rates), n: rates.length, rows: xs[0].rows, extra: Math.max(...xs.map((v) => v.extraRows)), failed: rs.filter((r) => !r.final).length };
}
const fmt = (a?: Agg) => (!a ? "–" : `${pct(a.mean)}${a.n > 1 ? ` (${pct(a.min)}–${pct(a.max)})` : ""}${a.extra ? `, +${a.extra}` : ""}${a.failed ? `, ${a.failed} failed` : ""}`);
const runList = (rs: CompileRecord[]) => rs.map((r) => (r.final ? `\`${r.final}\`` : "failed")).join(", ");

const L: string[] = [];
L.push("# Stage 3 scorecard (round 3)", "",
  "## How these numbers were made", "",
  "- **History.** Round 1 scored mappers against keys that were changed while looking at test-split errors. Round 2 froze the keys first, but its views (v2) had been revised after round-1 test errors, using strings from the corpus generator, and were scored on test patients that mostly overlapped round 1. Round 3 replaces both: views v3 were written blind (a fresh sandboxed agent given only output semantics; `work/views-v3/README.md`), and all headline numbers come from a fresh held-out cohort generated after the key and scorer code were frozen. Round 1 and 2 results are kept in `results/stage3/round1/` and `round2/` and are not used here.",
  `- **Key and scorer code** frozen at hash \`${KEYS}\` (work/decisions.md, round 3); every round-3 compile record carries the hash it was compiled under.`,
  `- **Fresh cohort.** ${truth().patients.length} patients (seed \`folio-stage3-fresh-final\`, trap-targeted quotas in packages/truth/src/cohort.ts), corpus-fresh/, notes from the Stage 1 note pipeline. No record, key row or mapper output from it was looked at before scoring.`,
  "- **Mappers.** Compiled from the main corpus: the source schema, the views and about eight items from training patients. They were scored in the compile loop on the main corpus's dev split only (the cache gate).",
  `- **Scoring.** Each mapper runs on every fresh patient at three as-of dates. Each fact is counted once per date: the tables use ${LATEST} (end of the corpus) unless they say otherwise. A row is wrong if it is missing, duplicated, or any scored field is wrong ([Fields](#fields) lists them); extra rows are mapper rows with no expected counterpart. Equivalents the views accept (a \"nightly\" once-daily direction as QHS or QD) are accepted; rows the views leave open (a patient list naming one drug twice with different statuses) are not scored.`,
  "");

// Headline.
L.push("## One-shot mappers with views v3", "", `Condition a: schema, views v3, training samples; no feedback. Three independent runs per backend. Wrong-row rate in percent at ${LATEST}, mean (min–max) over the runs; then \`+n\` extra rows in the worst run. \`rows\`: expected rows per run.`, "",
  `| Source | View | rows | ${BACKS.map(short).join(" | ")} |`, `|---|---|---|${BACKS.map(() => "---").join("|")}|`);
const headline: any[] = [];
for (const s of SOURCES) for (const v of VIEWS) {
  const cells = BACKS.map((b) => agg(find(s, "app", b), v));
  const rows = cells.find(Boolean)?.rows;
  if (!rows) continue;
  headline.push({ source: s, view: v, rows, cells: Object.fromEntries(BACKS.map((b, i) => [b, cells[i]])) });
  L.push(`| ${s} | ${v} | ${rows} | ${cells.map(fmt).join(" | ")} |`);
}
L.push("", "Runs:", "");
for (const s of SOURCES) for (const b of BACKS) L.push(`- ${s}, ${short(b)}: ${runList(find(s, "app", b))}`);

// Earlier dates.
L.push("", "### Earlier as-of dates", "", "Same runs, mean wrong-row rate over the three runs, at the two earlier dates (each a separate count of the facts true then).", "",
  `| Source | View | ${AS_OF_DATES.slice(0, -1).flatMap((d) => BACKS.map((b) => `${d} ${short(b)}`)).join(" | ")} |`, `|---|---|${AS_OF_DATES.slice(0, -1).flatMap(() => BACKS.map(() => "---")).join("|")}|`);
for (const h of headline) L.push(`| ${h.source} | ${h.view} | ${AS_OF_DATES.slice(0, -1).flatMap((d) => BACKS.map((b) => { const a = agg(find(h.source, "app", b), h.view, d); return a ? `${pct(a.mean)}${a.extra ? ` +${a.extra}` : ""}` : "–"; })).join(" | ")} |`);

// Compile and run.
L.push("", "### Compile and run", "");
for (const b of BACKS) {
  const rs = recs.filter((r) => r.backend === b && r.viewSet === "app" && (r.variant ?? "full") === "full");
  const evs = rs.map((r) => (r.final ? evals.get(r.final) : undefined));
  L.push(`- ${short(b)}: ${rs.length} runs; ${rs.filter((r) => r.final).length} produced a mapper; ${evs.filter((e) => e?.tsc.ok).length} type-check; ${evs.filter((e) => e && !e.runtime.patientErrors.length && !e.execError).length} ran on every fresh patient and date without throwing; ${evs.filter((e) => e?.deterministic).length} deterministic; contract issues in ${evs.filter((e) => e?.contract.length).length}.`);
}

// Traps.
const trapRows: any[] = [];
for (const s of SOURCES) {
  const sec = secondary.find((x) => x.source === s && x.viewSet === "app" && x.backend === "claude-opus" && x.variant === "full" && x.rep === 1);
  const seen = new Set<string>(sec?.trapsInSamples ?? []);
  const all = new Set<string>();
  for (const b of BACKS) for (const r of find(s, "app", b)) if (r.final) for (const t of Object.keys(evals.get(r.final)?.traps ?? {})) all.add(t);
  for (const t of [...all].sort((a, b) => (VOLUME_TRAPS.includes(a) ? 1 : 0) - (VOLUME_TRAPS.includes(b) ? 1 : 0) || +a.slice(1) - +b.slice(1))) {
    const per = Object.fromEntries(BACKS.map((b) => {
      const xs = find(s, "app", b).map((r) => (r.final ? evals.get(r.final)?.traps[t] : undefined)).filter(Boolean) as any[];
      return [b, xs.length ? { e: xs.reduce((a, x) => a + x.errors, 0), f: xs.reduce((a, x) => a + x.facts, 0), pe: Math.max(...xs.map((x) => x.patientsWithError)), p: xs[0].patients } : undefined];
    }));
    const p = Object.values(per).find(Boolean)?.p ?? 0;
    trapRows.push({ source: s, trap: t, patients: p, inSamples: seen.has(t), volume: VOLUME_TRAPS.includes(t), per });
  }
}
L.push("", "## Traps", "", "Fresh cohort, all three as-of dates. Per backend: errors / trap-bearing facts summed over the three runs (a fact is an expected row or a fact that must not appear); in brackets, the most patients with an error in one run. `Patients`: distinct fresh patients carrying the trap in that source. `In samples`: the trap appears in that source's training samples. Volume traps (carried by nearly every lab or reading) come last in each source.", "",
  `| Source | Trap | Patients | In samples | ${BACKS.map(short).join(" | ")} |`, `|---|---|---|---|${BACKS.map(() => "---").join("|")}|`);
for (const x of trapRows) L.push(`| ${x.source} | ${x.trap} ${TRAP_NAMES[x.trap]?.name ?? ""}${x.volume ? " (volume)" : ""} | ${x.patients} | ${x.inSamples ? "yes" : "no"} | ${BACKS.map((b) => { const c = x.per[b]; return c ? `${c.e}/${c.f}${c.e ? ` (${c.pe})` : ""}` : "–"; }).join(" | ")} |`);
const few = trapRows.filter((x) => !x.volume && x.patients < 10);
L.push("", few.length ? `Judgment traps with fewer than 10 fresh patients in a source: ${few.map((x) => `${x.source} ${x.trap} (${x.patients})`).join(", ")}. The generator places these cases on too few patients (Lakeview T13 needs a DKA history plus nephrology care; the hero-only cases are not generated for population patients).` : "Every judgment trap has at least 10 fresh patients in each source where it occurs.");
const absent = ["A:T19", "C:T19", "C:T13", "P:T19"].filter((k) => !trapRows.some((x) => `${({ riverside: "A", northgate: "B", lakeview: "C", homelog: "P" } as any)[x.source]}:${x.trap}` === k));
if (absent.length) L.push("", `No view row in the fresh cohort carries ${absent.join(", ")} (source:trap). Riverside, Lakeview and HomeLog T19 (a behavioral-health fact in that source) do not occur in the fresh cohort: the generator places them only on the hero. Lakeview T13 occurs (8 fresh patients) but is a prose-only fact (a decision written only in a note), which no view row represents.`);

// v2 vs v3.
const v2s = SOURCES.filter((s) => find(s, "appv2", "claude-opus").length);
if (v2s.length) {
  L.push("", "## Views v2 (source hints) and v3 (blind)", "", "Opus, condition a, three runs each, fresh cohort, wrong-row rate at the latest date. v2 was written by the corpus author with knowledge of each source's quirks; v3 was written blind. Same types, schemas and samples.", "",
    "| Source | View | rows | v3 | v2 |", "|---|---|---|---|---|");
  for (const s of v2s) for (const v of VIEWS) { const a3 = agg(find(s, "app", "claude-opus"), v), a2 = agg(find(s, "appv2", "claude-opus"), v); if (a3 || a2) L.push(`| ${s} | ${v} | ${(a3 ?? a2)!.rows} | ${fmt(a3)} | ${fmt(a2)} |`); }
  L.push("");
  for (const s of v2s) L.push(`- ${s} v2 runs: ${runList(find(s, "appv2", "claude-opus"))}`);
}

// Ablation.
const abl = SOURCES.filter((s) => find(s, "app", "claude-opus", "types-only").length);
if (abl.length) {
  L.push("", "## Documentation ablation (views v3)", "", "Opus, condition a, three runs each, fresh cohort: the full source schema versus the same schema with every comment removed (types, field names and enum values only). Views v3 and samples unchanged. Wrong-row rate at the latest date.", "",
    "| Source | View | rows | full schema | types only |", "|---|---|---|---|---|");
  for (const s of abl) for (const v of VIEWS) { const f = agg(find(s, "app", "claude-opus"), v), t = agg(find(s, "app", "claude-opus", "types-only"), v); if (f || t) L.push(`| ${s} | ${v} | ${(f ?? t)!.rows} | ${fmt(f)} | ${fmt(t)} |`); }
  L.push("");
  for (const s of abl) L.push(`- ${s} types-only runs: ${runList(find(s, "app", "claude-opus", "types-only"))}`);
}

// Secondary: main corpus old test split.
if (secondary.length) {
  L.push("", "## Secondary: main corpus, old test split", "", "The same round-3 v3 mappers on the main corpus's test split (patients that earlier rounds were scored and triaged on), at 2026-10-13. Mean wrong-row rate over the three runs. Shown for comparison only.", "",
    `| Source | View | ${BACKS.map(short).join(" | ")} |`, `|---|---|${BACKS.map(() => "---").join("|")}|`);
  for (const s of SOURCES) for (const v of VIEWS) {
    const cell = (b: string) => { const xs = secondary.filter((x) => x.source === s && x.viewSet === "app" && x.backend === b && x.variant === "full" && x.views?.[v]?.rows); if (!xs.length) return undefined; const r = xs.map((x) => x.views[v].wrongRows / x.views[v].rows); return { m: r.reduce((a: number, c: number) => a + c, 0) / r.length, rows: xs[0].views[v].rows, extra: Math.max(...xs.map((x) => x.views[v].extraRows)) }; };
    const cs = BACKS.map(cell);
    if (!cs.some(Boolean)) continue;
    L.push(`| ${s} | ${v} | ${cs.map((c) => (c ? `${pct(c.m)}${c.extra ? ` +${c.extra}` : ""}` : "–")).join(" | ")} |`);
  }
}

// US Core (round-2 mappers, validated on the fresh cohort).
const fhir: any[] = [];
const FHIR_N = Number(process.env.FHIR_SAMPLE ?? 25);
if (!values["no-fhir"] || readdirSync(join(RESULTS, "fhir")).some((f) => f.startsWith("fresh-"))) {
  const r2 = (() => { const out: any[] = []; const root = join(RESULTS, "round2/compiles"); for (const s of SOURCES) for (const b of ["claude-opus", "codex-gpt-6-astra"]) { const p = join(root, s, "uscore", b, "a.json"); if (existsSync(p)) out.push(JSON.parse(readFileSync(p, "utf8"))); } return out; })();
  for (const r of r2) {
    if (!r.final) continue;
    const cached = join(RESULTS, "fhir", `fresh-${r.final}.json`);
    let v: any = existsSync(cached) ? JSON.parse(readFileSync(cached, "utf8")) : undefined;
    if (!v && !values["no-fhir"]) v = validateUsCore(readTransformOf(r.source, "uscore", backendOf(r.backend), r.final), r.source, r.final, "fresh");
    if (v) fhir.push({ source: r.source, backend: r.backend, run: r.final, resources: v.resources, errors: v.errors, structuralErrors: v.structuralErrors, terminologyErrors: v.terminologyErrors, warnings: v.warnings, terminologyWarnings: v.terminologyWarnings, topErrors: v.topErrors, topTerminology: v.topTerminology });
  }
  L.push("", "## US Core output and the HL7 validator", "", "The round-2 US Core mappers (written against views v2 plus `uscore.d.ts`, before its round-2 fixes for `statusReason` and `requester`; not recompiled in round 3), run on " + FHIR_N + " fresh patients per source at 2026-10-13 and checked with the official HL7 FHIR validator (R4, US Core 8.0.1, each resource declaring its US Core profile) with terminology checked against tx.fhir.org. Every issue is stored in `results/stage3/fhir/fresh-<runId>.json`.", "",
    "| Source | Backend | Run | Resources | Errors: structural | Errors: terminology | Warnings (of which terminology) | Most common error |", "|---|---|---|---|---|---|---|---|");
  for (const f of fhir) L.push(`| ${f.source} | ${short(f.backend)} | \`${f.run}\` | ${f.resources} | ${f.structuralErrors} | ${f.terminologyErrors} | ${f.warnings} (${f.terminologyWarnings}) | ${f.topErrors?.[0] ? `${String(f.topErrors[0][0]).slice(0, 100)} (${f.topErrors[0][1]})` : "–"} |`);
}

// End to end.
const e2e: any[] = [];
{
  const fx = Object.fromEntries(SOURCES.map((s) => [s, { runId: `fixture:${s}-reference.ts`, transform: readFileSync(join(REPO, "packages/compiler/test/fixtures", `${s}-reference.ts`), "utf8") }])) as any;
  e2e.push(endToEnd(fx, "reference (hand-written)"));
  for (const b of BACKS) for (let rep = 1; rep <= 3; rep++) {
    const rs = SOURCES.map((s) => find(s, "app", b).find((r) => r.rep === rep));
    if (rs.some((r) => !r?.final)) continue;
    e2e.push(endToEnd(Object.fromEntries(SOURCES.map((s, i) => [s, { runId: rs[i]!.final!, transform: readTransformOf(s, "app", backendOf(b), rs[i]!.final!) }])) as any, `${short(b)} run ${rep}`));
  }
}
L.push("", "## Merged chart (end to end)", "", "Each source's v3 one-shot mapper runs on its own items for every fresh patient; the generic merge (`packages/compiler/src/merge.ts`, tuned in round 1, unchanged since) combines them; the result is scored at 2026-10-13 against the merged truth key, restricted to facts and fields some source records. A medication whose current status no structured record carries (it is only in a note) is counted under prose-only, not as a wrong row. Wrong-row rate per view, `+n` extra rows; prose-only rows: wrong/total.", "",
  `| Mappers | ${VIEWS.join(" | ")} | prose-only medication rows |`, `|---|${VIEWS.map(() => "---").join("|")}|---|`);
for (const e of e2e) L.push(`| ${e.label} | ${VIEWS.map((v) => { const x = e.views[v]; return x ? `${pct(x.wrongRows / x.rows)}${x.extraRows ? ` +${x.extraRows}` : ""}` : "–"; }).join(" | ")} | ${e.proseOnly?.medications ? `${e.proseOnly.medications.wrongRows}/${e.proseOnly.medications.rows}` : "0/0"} |`);

// Fields.
const fieldAgg: Record<string, Record<string, { ok: number; total: number }>> = {};
for (const b of BACKS) for (const r of recs.filter((x) => x.backend === b && x.viewSet === "app" && (x.variant ?? "full") === "full" && x.final)) {
  const ev = evals.get(r.final!); if (!ev) continue;
  for (const [f, c] of Object.entries(ev.fields)) { const a = ((fieldAgg[f] ??= {})[b] ??= { ok: 0, total: 0 }); a.ok += c.ok; a.total += c.total; }
}
L.push("", "## Fields", "", "Field results over all v3 one-shot runs of each backend (all sources and dates): correct / scored. Only fields with an error are listed.", "", `| Field | ${BACKS.map(short).join(" | ")} |`, `|---|${BACKS.map(() => "---").join("|")}|`);
for (const f of Object.keys(fieldAgg).sort()) if (BACKS.some((b) => fieldAgg[f][b] && fieldAgg[f][b].ok < fieldAgg[f][b].total)) L.push(`| ${f} | ${BACKS.map((b) => (fieldAgg[f][b] ? `${fieldAgg[f][b].ok}/${fieldAgg[f][b].total}` : "–")).join(" | ")} |`);
L.push("", `All scored fields: ${Object.keys(fieldAgg).sort().join(", ")}.`);

// Cost.
L.push("", "## Cost and time (round-3 compiles)", "", "New round-3 compile runs only (the reused round-2 v2 runs are not counted). Notes for the fresh cohort and the regenerated main-corpus notes cost about $32 (sonnet, \`runs/prose/\`); the blind views writer about $0.9.", "", "| Backend | Runs | Cost (USD, as the CLI reports it) | Agent minutes |", "|---|---|---|---|");
for (const b of BACKS) { const rounds = recs.filter((r) => r.backend === b && !(r as any).note?.includes("reused")).flatMap((r) => r.rounds).filter((x) => x.runId); L.push(`| ${short(b)} | ${rounds.length} | ${b.startsWith("codex") ? "not reported" : rounds.reduce((a, x) => a + (x.costUsd ?? 0), 0).toFixed(2)} | ${(rounds.reduce((a, x) => a + x.durationMs, 0) / 60000).toFixed(0)} |`); }

// Isolation.
const scan = existsSync(join(RESULTS, "isolation/transcript-scan.json")) ? JSON.parse(readFileSync(join(RESULTS, "isolation/transcript-scan.json"), "utf8")) : undefined;
const agentRuns = (scan?.report ?? []).filter((r: any) => !r.run.includes("isolation-probe"));
const kinds = (k: string) => agentRuns.reduce((a: number, r: any) => a + r.findings.filter((f: any) => f.kind === k).length, 0);
L.push("", "## Isolation", "",
  "Agents run under bubblewrap with no network of their own (`--unshare-net`); the only route out is a per-run CONNECT proxy that allows the model API hosts and logs every connection to `<run>/network.log`. $HOME, /tmp and /run/user are empty mounts; the environment is cleared; IPC, PID and UTS namespaces are private; claude's web tools are disallowed. Probe runs in `runs/compiler/isolation-probe-v2/`: claude, and codex with its own command sandbox turned off inside bwrap (`codex-nosandbox/`), each get 403 from the proxy for github.com and raw.githubusercontent.com, cannot resolve any host directly, reach the model API host only through the proxy, and see no repo files, agent histories or D-Bus session.",
  `The transcript scan (\`bun packages/compiler/src/cli/scan.ts\`) over ${scan?.runs ?? "?"} recorded runs found ${kinds("network")} agent tool calls using network tools, ${kinds("ipc")} using IPC and ${kinds("web-tool")} web-tool calls outside the probes; ${kinds("denied-connection")} connections were denied, all made by the CLIs themselves (telemetry and image hosts).`);

// Cache.
const cached = cacheMappers(recs);
L.push("", "## Cached mappers", "", `A mapper is cached when it type-checks, runs without errors, is deterministic, has no contract issues, passed the isolation scan, and had (wrong + extra rows) / rows below ${DEV_GATE * 100}% in every view on the main corpus's dev split (set before any held-out run). Condition c and the ablation are never cached; round 3 has only condition a.`, "");
for (const c of cached) L.push(`- \`${c.path}\` (run \`${c.runId}\`)`);
if (!cached.length) L.push("- none");

writeFileSync(join(RESULTS, "scorecard.json"), JSON.stringify({ keys_sha256: KEYS, cohort: "fresh", as_of: AS_OF_DATES, headline, traps: trapRows, fhir, end_to_end: e2e, fields: fieldAgg, cached, secondary,
  records: recs.map((r) => ({ source: r.source, viewSet: r.viewSet, backend: r.backend, variant: r.variant, rep: r.rep, final: r.final, keysSha256: r.keysSha256, costUsd: r.rounds.reduce((a, x) => a + (x.costUsd ?? 0), 0) })) }, null, 1) + "\n");
writeFileSync(join(RESULTS, "SCORECARD.md"), L.join("\n") + "\n");
console.log("wrote SCORECARD.md");
process.exit(0);
