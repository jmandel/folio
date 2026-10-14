// bun site/scripts/merged-story.ts
//
// Writes site/src/story/hero-chart.json (Linda's whole merged chart, for the record view) and
// site/src/story/dka-merged.json: the front page's merged example, produced by code rather than
// by hand. The cached views-v3 mappers (one per source, listed in MAPPERS) run on Linda's items as of
// 2026-10-13, the generic merge (packages/compiler/src/merge.ts) combines their rows, and this script
// keeps the rows for the empagliflozin story:
//
//   - medication and allergy rows whose ingredient or substance is empagliflozin;
//   - problem rows coded as diabetes with ketoacidosis (ICD-10-CM E08.1–E13.1), or citing an entry the
//     front page quotes as the DKA (Lakeview's dx_dka_hx).
//
// Each row's title is the merged row; each part is one source mapper's row that the merge combined, and
// its cites are that row's evidence (item id, entry id) exactly as the mapper wrote them. Text is
// formatted from the row fields; nothing is written by hand.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { itemsForPatient, patients, schemaHash, SOURCES, type Source } from "../../packages/compiler/src/data.ts";
import { execute, stage } from "../../packages/compiler/src/exec.ts";
import { mergeRows, type Rows } from "../../packages/compiler/src/merge.ts";
import { VIEW_SETS, viewSetHash } from "../../packages/views/src/index.ts";
import type { MergedResult, MergedRow, Cite } from "../src/story/dka.ts";

const ROOT = resolve(import.meta.dir, "../..");
const OUT = join(ROOT, "site/src/story/dka-merged.json");
const CHART = join(ROOT, "site/src/story/hero-chart.json");
const PID = "hero";
const AS_OF = "2026-10-13";

/** One cached views-v3 one-shot mapper per source (the Opus mappers; the only cached one for Northgate). */
const MAPPERS: Record<Source, string> = {
  riverside: "20261014T153539589Z-ml0t",
  northgate: "20261014T153538312Z-nujp",
  lakeview: "20261014T153539262Z-il83",
  homelog: "20261014T154025060Z-lt22",
};
const SHORT: Record<Source, string> = { riverside: "Riverside", northgate: "Northgate", lakeview: "Lakeview", homelog: "HomeLog" };

/** Find the cache entry for a run id and check it is keyed by today's schema and views. */
function cached(source: Source, runId: string): { dir: string; schema: string } {
  const views = viewSetHash(VIEW_SETS.app);
  const schema = schemaHash(source);
  const dir = join(ROOT, "mappers", schema, views);
  if (!existsSync(dir)) throw new Error(`no cached mappers for ${source} at mappers/${schema}/${views}`);
  for (const backend of readdirSync(dir)) {
    const prov = JSON.parse(readFileSync(join(dir, backend, "provenance.json"), "utf8"));
    if (prov.chosen?.runId === runId) {
      if (prov.source !== source || prov.view_set !== "app") throw new Error(`${runId}: provenance says ${prov.source}/${prov.view_set}`);
      return { dir: join(dir, backend), schema };
    }
  }
  throw new Error(`run ${runId} is not in the mapper cache for ${source}`);
}

// ─── run the mappers, then the merge ────────────────────────────────────────────────────────────

const hero = patients().find((p) => p.patient === PID)!;
type Row = Record<string, any>;
const perSource: { source: Source; rows: Partial<Rows>; items: { id: string; effective: string }[] }[] = [];
const used: { source: Source; runId: string; schema: string }[] = [];
for (const s of SOURCES) {
  if (!hero.sources[s]) continue;
  const { dir, schema } = cached(s, MAPPERS[s]);
  const items = itemsForPatient(s, hero);
  const r = execute(stage(readFileSync(join(dir, "transform.ts"), "utf8"), "app"), [{ patient: PID, asOf: AS_OF, items }]);
  const run = r.runs[0];
  if (r.error || !run || run.error) throw new Error(`${s}: ${r.error ?? run?.error}`);
  perSource.push({ source: s, rows: run.rows, items: items.map((i) => ({ id: i.id, effective: i.effective })) });
  used.push({ source: s, runId: MAPPERS[s], schema });
}
const merged = mergeRows(perSource);

// ─── text from fields ───────────────────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function date(d: string | undefined): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return [day ? String(+day) : "", m ? MONTHS[+m - 1] : "", y].filter(Boolean).join(" ");
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const words = (s: string | undefined) => (s ?? "").replace(/_/g, " ");
const FREQ: Record<string, string> = { QD: "once daily", BID: "twice daily", TID: "three times daily", QHS: "at bedtime", QW: "once weekly", PRN: "as needed" };
const quote = (s: string | undefined) => (s ? `“${s}”` : "");
const join_ = (xs: (string | undefined | false)[], sep = ", ") => xs.filter(Boolean).join(sep);

const medStatus = (r: Row) =>
  join_([`${cap(r.status)}${r.status_since ? (r.status === "held" ? ` since ${date(r.status_since)}` : ` ${date(r.status_since)}`) : ""}`, r.stop_reason && words(r.stop_reason)]);
const medTitle = (r: Row) =>
  `${cap(r.ingredient ?? r.drug_name)}${r.dose ? ` ${r.dose.value} ${r.dose.unit}` : ""}${r.frequency ? `, ${FREQ[r.frequency] ?? r.frequency}` : ""}: ${medStatus(r).replace(/^./, (c) => c.toLowerCase())}`;
const medPart = (r: Row) => {
  const t = join_([medStatus(r), quote(r.status_reason_text)], ": ");
  return r.patient_reported ? `Patient's own list, ${t.charAt(0).toLowerCase()}${t.slice(1)}` : t;
};

const allergyTitle = (r: Row) => `${cap(r.substance)}: ${words(r.reaction_type)}, ${r.criticality} criticality`;
const allergyPart = (r: Row) => join_([r.reaction && `${r.reaction}${r.onset ? `, onset ${date(r.onset.value)}` : ""}`, `${words(r.reaction_type)}, ${r.mechanism === "non_immune" ? "non-immune" : words(r.mechanism)} mechanism`, `${r.criticality} criticality`], "; ");

const problemTitle = (r: Row) => `${r.condition}${r.icd10cm ? ` (${r.icd10cm})` : ""}: ${r.status}`;
const problemPart = (r: Row) => join_([cap(r.status), r.icd10cm && `ICD-10-CM ${r.icd10cm}`, r.onset && `onset ${date(r.onset.value)}`]);

// ─── pick the story rows ────────────────────────────────────────────────────────────────────────

const STORY_REFS = new Set(["01KXEQKXQGGFWM3XCNV7YSNJGV#dx_dka_hx"]);
const cites = (r: Row, source: Source): Cite[] => (r.evidence ?? []).map((e: any) => ({ source, item: e.item_id, ref: e.entry_id }));
const evKey = (e: any) => `${e.item_id}#${e.entry_id}`;

/** The per-source rows the merge combined into `m`: same group key, evidence inside m's evidence. */
function contributors(view: keyof Rows, m: Row, sameGroup: (r: Row) => boolean) {
  const ev = new Set((m.evidence ?? []).map(evKey));
  return perSource.flatMap((p) =>
    ((p.rows[view] ?? []) as Row[]).filter((r) => sameGroup(r) && (r.evidence ?? []).every((e: any) => ev.has(evKey(e)))).map((r) => ({ source: p.source, r })),
  );
}

const rows: MergedRow[] = [];
const isEmpa = (x: unknown) => String(x ?? "").toLowerCase() === "empagliflozin";
for (const m of merged.medications.filter((r) => isEmpa(r.ingredient)))
  rows.push({
    view: "Medications",
    title: medTitle(m),
    parts: contributors("medications", m, (r) => isEmpa(r.ingredient)).map(({ source, r }) => ({ label: SHORT[source], text: medPart(r), cites: cites(r, source) })),
  });
for (const m of merged.allergies.filter((r) => isEmpa(r.substance)))
  rows.push({
    view: "Allergies and intolerances",
    title: allergyTitle(m),
    parts: contributors("allergies", m, (r) => isEmpa(r.substance)).map(({ source, r }) => ({ label: SHORT[source], text: allergyPart(r), cites: cites(r, source) })),
  });
const coded = (r: Row) => (/^E(08|09|10|11|13)\.1/.test(r.icd10cm ?? "") ? 0 : 1);
const isDka = (r: Row) => coded(r) === 0 || (r.evidence ?? []).some((e: any) => STORY_REFS.has(evKey(e)));
for (const m of merged.problems.filter(isDka).sort((a, b) => coded(a) - coded(b)))
  rows.push({
    view: "Problems",
    title: problemTitle(m),
    parts: contributors("problems", m, isDka).map(({ source, r }) => ({ label: SHORT[source], text: problemPart(r), cites: cites(r, source) })),
  });

// Every part has cites, and together they cover the merged row's evidence.
for (const r of rows) {
  if (!r.parts.length || r.parts.some((p) => !p.cites.length)) throw new Error(`row without cites: ${r.title}`);
}

const result: MergedResult = {
  kind: "compiled-mapper",
  patient: PID,
  basis:
    `Produced by site/scripts/merged-story.ts: the cached views-v3 mappers from runs ${used.map((u) => `${u.runId} (${SHORT[u.source]}, schema ${u.schema.slice(0, 8)}…)`).join(", ")}` +
    ` ran on Linda's items as of ${AS_OF}, and the generic merge (packages/compiler/src/merge.ts) combined their rows.`,
  rows,
};
writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n");
writeFileSync(CHART, JSON.stringify({ patient: PID, asOf: AS_OF, basis: result.basis, rows: merged }) + "\n");
console.log(`wrote ${CHART.replace(ROOT + "/", "")}: ${Object.entries(merged).map(([v, r]) => `${r.length} ${v}`).join(", ")}`);
console.log(`wrote ${OUT.replace(ROOT + "/", "")}: ${rows.length} rows`);
for (const r of rows) {
  console.log(`  ${r.view}: ${r.title}`);
  for (const p of r.parts) console.log(`    ${p.label}: ${p.text} [${p.cites.map((c) => c.ref).join(", ")}]`);
}
