// Prose cross-check: an independent agent reads ONLY the narrative (with its ref spans) of sampled
// narrated items and states the view facts each narrative asserts. The harness compares those facts
// with the mapper's rows for the same patient as of the item's date. Discrepancies are reported; the
// keys are then used (by the harness, never by either agent) to say which discrepancies were real
// mapper errors and which were false alarms.
//
// The extraction depends only on the sampled items, not on any mapper, so it runs once per (source,
// split) and is cached in results/stage3/prose/<source>-<split>.json with its run id.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../../agent-runner/src/index.ts";
import { viewSetFiles, VIEW_SETS } from "../../views/src/index.ts";
import { inZone, localDate } from "../../truth/src/model.ts";
import { type FolioItem, loadItems, patientsIn, REPO, shuffled, type Source, type Split } from "./data.ts";
import { family } from "./keys.ts";
import { normAnalyte, normDrug } from "./score.ts";
import { sandboxWrap } from "./sandbox.ts";

export const PROSE_DIR = join(REPO, "results/stage3/prose");
export const PROSE_MODEL = { backend: "claude" as const, model: "sonnet" };

export interface ProseFact {
  view: "medications" | "problems" | "allergies" | "labs" | "vitals";
  ingredient?: string; status?: string; dose?: { value: number; unit: string };
  condition?: string; icd10cm?: string; ckd_stage?: string;
  substance?: string; reaction_type?: string;
  analyte?: string; value?: number; comparator?: string; date?: string;
  systolic_mmhg?: number; diastolic_mmhg?: number;
  ref?: string; quote?: string;
}
export interface ProseItem { patient: string; local: string; item_id: string; file: string; as_of: string; facts: ProseFact[] }
export interface ProseSample { source: Source; split: Split; runId: string; costUsd?: number; items: ProseItem[] }

/** Narrated items worth reading: narrative with at least one ref span (generated list headers excluded). */
function narrated(source: Source, split: Split, n: number) {
  const pool = patientsIn(source, split).flatMap((p) => loadItems(source, p.sources[source]!).map((l) => ({ patient: p.patient, local: p.sources[source]!, ...l })))
    .filter((x) => /<ref id=/.test(x.item.narrative ?? ""));
  // Round-robin over patients so one long record does not dominate.
  const byPatient = new Map<string, typeof pool>();
  for (const x of shuffled(pool, `prose/${source}/${split}`)) { if (!byPatient.has(x.patient)) byPatient.set(x.patient, []); byPatient.get(x.patient)!.push(x); }
  const out: typeof pool = [];
  const queues = [...byPatient.values()];
  for (let i = 0; out.length < n && queues.some((q) => q.length); i = (i + 1) % queues.length) if (queues[i].length) out.push(queues[i].shift()!);
  return out;
}

const asOfFor = (it: FolioItem) => localDate(inZone(it.recorded));

const PROMPT = `# Read clinical notes and state their facts

Each file in \`in/notes/\` is the narrative of one clinical record item: a note, a comment, a diary entry.
Spans marked \`<ref id="…">…</ref>\` are the parts the author tied to structured data (you do not see
that data). Read each narrative and write down the facts it asserts, in the terms of the consumer views
defined in \`in/views/views.d.ts\` (medications, problems, allergies, labs, vitals). The header of each
note gives the organization and the note's date.

Write \`out/facts.json\`: \`{ "items": [ { "item_id": "...", "facts": [Fact, ...] }, ... ] }\` with one entry per note
(an empty \`facts\` array if the note asserts nothing these views cover). A Fact is one of:

- \`{ "view": "medications", "ingredient": "finerenone", "status": "active"|"held"|"stopped", "dose"?: {"value": 10, "unit": "mg"} }\`:
  the status as of the note's date, by this organization's account, using the meanings in
  \`MedicationRow.status\` (held = paused, not stopped). Give a dose only if the note states the current one.
- \`{ "view": "problems", "condition": "...", "icd10cm"?: "...", "status": "active"|"resolved"|"ruled_out", "ckd_stage"?: "G3b" }\`:
  include conditions the note says were ruled out, as "ruled_out".
- \`{ "view": "allergies", "substance": "lisinopril", "reaction_type": "hypersensitivity"|"side_effect"|"serious_adverse_event" }\`
- \`{ "view": "labs", "analyte": "potassium", "value": 5.8, "comparator"?: "<"|">", "date"?: "YYYY-MM-DD" }\`: analyte
  names and units as in the \`Analyte\` table (convert units); \`date\` = local collection date if stated.
- \`{ "view": "vitals", "systolic_mmhg": 138, "diastolic_mmhg": 84 }\`: blood pressure measured at this encounter.

Every fact also has \`"ref"\` (the ref id it comes from, or null) and \`"quote"\` (the words it rests on).
Only facts the narrative itself asserts about this patient now; not plans for the future, not other
patients, not your own clinical inference. When unsure, leave it out.
`;

/** The prose reader's inputs: the views file and one note per sampled item (narrative only). Deterministic. */
export function proseInputs(source: Source, split: Split, n: number) {
  const items = narrated(source, split, n);
  const org: Record<Source, string> = { northgate: "Northgate Family Medicine (primary care)", lakeview: "Lakeview Labs & Kidney Care (nephrology)", riverside: "Riverside Regional Hospital", homelog: "HomeLog (the patient's own diary app)" };
  const inputs: Record<string, string> = { "views/views.d.ts": viewSetFiles(VIEW_SETS.app)["views.d.ts"] };
  items.forEach((x, i) => {
    inputs[`notes/${String(i + 1).padStart(3, "0")}.md`] = `item_id: ${x.item.id}\norganization: ${org[source]}\ndate: ${asOfFor(x.item)}\n\n---\n\n${x.item.narrative}\n`;
  });
  return { items, inputs };
}

export async function proseSample(source: Source, split: Split, n: number): Promise<ProseSample> {
  mkdirSync(PROSE_DIR, { recursive: true });
  const path = join(PROSE_DIR, `${source}-${split}.json`);
  if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  const { items, inputs } = proseInputs(source, split, n);
  const r = await runAgent({
    family: `compiler/prose/${source}-${split}`, backend: PROSE_MODEL.backend, model: PROSE_MODEL.model, prompt: PROMPT, inputs,
    expectFiles: ["facts.json"], wrapCommand: sandboxWrap, extraArgs: ["--disallowedTools=WebFetch,WebSearch"], timeoutMs: 30 * 60_000,
  }, { retries: 1 });
  if (!r.meta.ok) throw new Error(`prose run failed: ${r.meta.error}`);
  const facts = JSON.parse(r.outputs["facts.json"]).items as { item_id: string; facts: ProseFact[] }[];
  const sample: ProseSample = {
    source, split, runId: r.meta.runId, costUsd: r.meta.costUsd,
    items: items.map((x) => ({ patient: x.patient, local: x.local, item_id: x.item.id, file: x.file, as_of: asOfFor(x.item), facts: facts.find((f) => f.item_id === x.item.id)?.facts ?? [] })),
  };
  writeFileSync(path, JSON.stringify(sample, null, 1) + "\n");
  return sample;
}

// ─── Comparison ────────────────────────────────────────────────────────────────────────────────────

export interface Discrepancy { patient: string; local: string; item_id: string; as_of: string; fact: ProseFact; kind: "missing" | "status" | "dose" | "type" | "value" | "ruled_out_reported" | "stage"; mapper?: unknown; matchKey: string }

const drugEq = (a?: string, b?: string) => { const x = normDrug(a), y = normDrug(b); return !!x && !!y && (x === y || x.split(" ").every((w) => y.split(" ").includes(w)) || y.split(" ").every((w) => x.split(" ").includes(w))); };
const localDay = (iso: string) => { try { return localDate(inZone(iso)); } catch { return ""; } };

/** Compare one item's prose facts with the mapper's rows as of that item's date. */
export function compareFacts(pi: ProseItem, rows: any): Discrepancy[] {
  const out: Discrepancy[] = [];
  const d = (fact: ProseFact, kind: Discrepancy["kind"], matchKey: string, mapper?: unknown) => out.push({ patient: pi.patient, local: pi.local, item_id: pi.item_id, as_of: pi.as_of, fact, kind, mapper, matchKey });
  const list = (v: string) => (Array.isArray(rows?.[v]) ? rows[v] : []) as any[];
  for (const f of pi.facts) {
    if (f.view === "medications" && f.ingredient) {
      const r = list("medications").find((x) => drugEq(f.ingredient, x.ingredient ?? x.drug_name));
      const k = `medications:${normDrug(f.ingredient)}`;
      if (!r) { d(f, "missing", k); continue; }
      if (f.status && f.status !== r.status) d(f, "status", k, r);
      else if (f.dose && r.dose && (f.dose.value !== r.dose.value)) d(f, "dose", k, r);
    } else if (f.view === "problems" && (f.condition || f.icd10cm)) {
      const fam = family(f.icd10cm, f.condition);
      const r = list("problems").find((x) => family(x.icd10cm, x.condition) === fam);
      const k = `problems:${fam}`;
      if (f.status === "ruled_out") { if (r && r.status === "active") d(f, "ruled_out_reported", k, r); continue; }
      if (!r) { d(f, "missing", k); continue; }
      if (f.status && f.status !== r.status) d(f, "status", k, r);
      else if (f.ckd_stage && r.ckd_stage && f.ckd_stage !== r.ckd_stage) d(f, "stage", k, r);
    } else if (f.view === "allergies" && f.substance) {
      const r = list("allergies").find((x) => drugEq(f.substance, x.substance));
      const k = `allergies:${normDrug(f.substance)}`;
      if (!r) d(f, "missing", k);
      else if (f.reaction_type && f.reaction_type !== r.reaction_type) d(f, "type", k, r);
    } else if (f.view === "labs" && f.analyte && typeof f.value === "number") {
      const day = f.date ?? pi.as_of;
      const k = `labs:${normAnalyte(f.analyte)}@${day}`;
      const same = list("labs").filter((x) => normAnalyte(x.analyte) === normAnalyte(f.analyte) && localDay(String(x.collected)) === day);
      if (!same.length) { d(f, "missing", k); continue; }
      if (!same.some((x) => Math.abs(Number(x.value) - f.value!) <= Math.max(0.051, Math.abs(f.value!) * 0.01))) d(f, "value", k, same);
    } else if (f.view === "vitals" && typeof f.systolic_mmhg === "number") {
      const k = `vitals:${pi.as_of}`;
      const same = list("vitals").filter((x) => String(x.local_time ?? "").slice(0, 10) === pi.as_of);
      if (!same.length) { d(f, "missing", k); continue; }
      if (!same.some((x) => x.systolic_mmhg === f.systolic_mmhg || x.repeat_systolic_mmhg === f.systolic_mmhg)) d(f, "value", k, same);
    }
  }
  return out;
}

export function promptHash(): string { return createHash("sha256").update(PROMPT).digest("hex").slice(0, 12); }
