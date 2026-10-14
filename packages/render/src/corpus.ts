// Builds the corpus: truth -> rendered items (+ accepted prose from the ledger, else a template
// placeholder) -> corpus/<source>/<patient>/<item>.folio.md, answer keys, MANIFEST.json.

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildCohort, buildTruth, COHORT, corpusDir, DEFAULT_SEED, FRESH, POPULATION_SIZE } from "../../truth/src/index.ts";
import { cohorts, patientKeys } from "../../truth/src/keys.ts";
import { EVAL_DATE, type Patient, type SourceKey } from "../../truth/src/model.ts";
import { assignArchetypes } from "../../truth/src/population.ts";
import { TRAP_NOTES } from "../../truth/src/hero.ts";
import { type RenderedItem, SOURCE_DIR } from "./context.ts";
import { renderPatient } from "./index.ts";
import { formatPayload, REPO, toMarkdown } from "./item.ts";
import { ledgerNarrative, loadLedger, requestHash } from "./prose.ts";

export const CORPUS = join(REPO, corpusDir());

export interface Built { patients: Patient[]; items: Map<string, RenderedItem[]>; seed: string }

export function build(seed?: string, size?: number): Built {
  const patients = seed || size ? buildTruth(seed ?? DEFAULT_SEED, size ?? POPULATION_SIZE) : buildCohort();
  seed ??= COHORT === "fresh" ? FRESH.seed : DEFAULT_SEED;
  const items = new Map<string, RenderedItem[]>();
  for (const p of patients) items.set(p.id, renderPatient(p, seed));
  return { patients, items, seed };
}

/** Fill narratives: fixtures and app text as rendered, accepted prose from the ledger, else the template. */
export function resolveNarratives(b: Built): Record<string, number> {
  const ledger = loadLedger();
  const counts: Record<string, number> = { fixture: 0, app: 0, prose: 0, template: 0, none: 0 };
  for (const [pid, items] of b.items) {
    const byKey = new Map(items.map((i) => [i.key, i]));
    for (const it of items) {
      if (it.narrativeKind !== "prose" || !it.note) continue;
      const text = ledgerNarrative(ledger, `${pid}/${it.dir}`, it.note);
      if (text !== undefined) it.item.narrative = text;
      else { it.item.narrative = it.template ?? ""; (it as RenderedItem & { templated?: boolean }).templated = true; }
    }
    for (const it of items) {
      if (it.narrativeFrom) {
        const src = byKey.get(it.narrativeFrom)!;
        it.item.narrative = src.item.narrative;
        if ((src as { templated?: boolean }).templated) (it as { templated?: boolean }).templated = true;
      }
      const kind = (it as { templated?: boolean }).templated ? "template" : it.narrativeKind === "prose" && !it.note && !it.narrativeFrom ? "none" : it.narrativeKind;
      counts[kind] = (counts[kind] ?? 0) + 1;
    }
  }
  return counts;
}

export function writeCorpus(b: Built, narrativeCounts: Record<string, number>) {
  for (const d of ["riverside", "northgate", "lakeview", "homelog", "answers"]) rmSync(join(CORPUS, d), { recursive: true, force: true });
  const write = (rel: string, text: string) => {
    const path = join(CORPUS, rel);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  };
  const perSource: Record<string, { patients: number; items: number }> = {};
  for (const p of b.patients) {
    for (const it of b.items.get(p.id)!) {
      write(`${it.dir}/${p.sources[it.source]!.localId}/${it.file}`, toMarkdown(it.item));
    }
    for (const s of Object.keys(p.sources) as SourceKey[]) {
      const k = SOURCE_DIR[s];
      perSource[k] ??= { patients: 0, items: 0 };
      perSource[k].patients++;
      perSource[k].items += b.items.get(p.id)!.filter((i) => i.source === s).length;
    }
    const keys = patientKeys(p);
    for (const [view, v] of Object.entries(keys)) write(`answers/${p.id}/${view}.json`, formatPayload({ patient: p.id, view, as_of: EVAL_DATE, key: v }) + "\n");
  }
  const cs = cohorts(b.patients);
  for (const c of cs) write(`answers/cohorts/${c.id}.json`, JSON.stringify({ ...c, as_of: EVAL_DATE }, null, 1) + "\n");
  write("answers/patients.json", JSON.stringify(b.patients.map((p) => ({
    patient: p.id, role: p.role, name: `${p.demographics.given} ${p.demographics.family}`, birth_date: p.demographics.birthDate, sex: p.demographics.sex,
    sources: Object.fromEntries(Object.entries(p.sources).map(([s, v]) => [SOURCE_DIR[s as SourceKey], v!.localId])),
  })), null, 1) + "\n");
  write("MANIFEST.json", JSON.stringify(manifest(b, perSource, narrativeCounts, cs), null, 1) + "\n");
}

function manifest(b: Built, perSource: Record<string, { patients: number; items: number }>, narrative: Record<string, number>, cs: ReturnType<typeof cohorts>) {
  const pop = b.patients.filter((p) => p.role === "population");
  const arche = assignArchetypes(b.seed, pop.length, COHORT === "fresh" ? FRESH.quotas : undefined);
  const ledger = loadLedger();
  // Trap coverage: assigned in the truth, and evidenced by a rendered item.
  const traps: Record<string, { name: string; patients: string[]; rendered: string[] }> = {};
  for (const p of b.patients) {
    for (const t of p.traps) (traps[t.trap] ??= { name: TRAP_NOTES[t.trap] ?? "", patients: [], rendered: [] }).patients.push(p.id);
    const rendered = new Set(b.items.get(p.id)!.flatMap((i) => i.traps));
    for (const t of rendered) (traps[t] ??= { name: TRAP_NOTES[t] ?? "", patients: [], rendered: [] }).rendered.push(p.id);
  }
  const proseOnly = b.patients.filter((p) => p.narrativeFacts.some((f) => Object.values(f.visibility).every((m) => m === "prose") && f.polarity === "affirmed"))
    .map((p) => ({ patient: p.id, facts: p.narrativeFacts.filter((f) => Object.values(f.visibility).every((m) => m === "prose") && f.polarity === "affirmed").map((f) => `${f.id} (${f.kind}; ${Object.keys(f.visibility).join("")})`) }));
  const proseItems = [...b.items.values()].flat().filter((i) => i.note && i.narrativeKind === "prose");
  const accepted = proseItems.filter((i) => ledger.batches[`${b.patients.find((p) => p.sources[i.source]?.localId === i.item.patient)?.id}/${i.dir}`]?.items[i.note!.key]?.hash === requestHash(i.note!));
  return {
    generator: { seed: b.seed, population: pop.length, patients: b.patients.length, eval_date: EVAL_DATE, truth: "packages/truth", render: "packages/render" },
    counts: {
      patients_by_role: Object.fromEntries(["hero", "secondary", "population"].map((r) => [r, b.patients.filter((p) => p.role === r).length])),
      sources: perSource,
      source_combinations: Object.fromEntries(Object.entries(b.patients.reduce((a, p) => { const k = Object.keys(p.sources).sort().map((s) => SOURCE_DIR[s as SourceKey]).join("+"); a[k] = (a[k] ?? 0) + 1; return a; }, {} as Record<string, number>)).sort(([, x], [, y]) => y - x)),
      items: [...b.items.values()].reduce((a, xs) => a + xs.length, 0),
      narrative: narrative,
      prose_requests: proseItems.length,
      prose_accepted: accepted.length,
    },
    traps: Object.fromEntries(Object.entries(traps).sort(([a], [b2]) => +a.slice(1) - +b2.slice(1)).map(([t, v]) => [t, { name: v.name, assigned: v.patients.length, rendered: v.rendered.length, patients: v.patients }])),
    prose_only_patients: { count: proseOnly.length, patients: proseOnly },
    cohorts: Object.fromEntries(cs.map((c) => [c.id, { members: c.members.length, patients: c.members.map((m) => m.patient) }])),
    archetypes: Object.fromEntries(pop.map((p, i) => [p.id, arche[i]])),
    prose_runs: Object.fromEntries(Object.entries(ledger.batches).map(([k, v]) => [k, v.runs.map((r) => r.run)])),
  };
}
