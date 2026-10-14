// The prose step: one CLI-agent call per (patient, source) writes the narrative of every item in
// that batch into out/notes.md; a deterministic validator checks each note against its request and
// failures go back to the agent with the problems listed. Accepted notes are recorded in a ledger
// (corpus/prose-ledger.json) that points at recorded runs, so `gen` can replay them offline.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type BackendName, replay, runAgent } from "../../agent-runner/src/index.ts";
import type { SourceKey } from "../../truth/src/model.ts";
import { type NoteRequest, type RenderedItem, SOURCE_DIR } from "./context.ts";
import { parseItem, REPO } from "./item.ts";
import { validateNarrative } from "./validate.ts";

export const LEDGER_PATH = join(REPO, "corpus", "prose-ledger.json");

export interface LedgerRun { run: string; backend: BackendName; model?: string; attempt: number; requested: number; accepted: number; costUsd?: number; durationMs: number; ok: boolean; error?: string }
export interface LedgerBatch { patient: string; source: SourceKey; items: Record<string, { run: string; hash: string }>; runs: LedgerRun[] }
export interface Ledger { version: 1; batches: Record<string, LedgerBatch> }

export function loadLedger(): Ledger {
  return existsSync(LEDGER_PATH) ? JSON.parse(readFileSync(LEDGER_PATH, "utf8")) : { version: 1, batches: {} };
}
/** Write the ledger, merging with whatever another process wrote meanwhile (items and runs are unions). */
export function saveLedger(l: Ledger) {
  const disk = loadLedger();
  for (const [k, b] of Object.entries(disk.batches)) {
    const mine = (l.batches[k] ??= { ...b, items: {}, runs: [] });
    mine.items = { ...b.items, ...mine.items };
    const seen = new Set(mine.runs.map((r) => r.run));
    mine.runs = [...b.runs.filter((r) => !seen.has(r.run)), ...mine.runs];
  }
  const sorted = Object.fromEntries(Object.entries(l.batches).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(LEDGER_PATH, JSON.stringify({ version: 1, batches: sorted }, null, 1) + "\n");
}

export function requestHash(req: NoteRequest): string {
  return createHash("sha256").update(JSON.stringify(req)).digest("hex").slice(0, 16);
}

/** Split out/notes.md into key -> text. */
export function parseNotesFile(text: string): Map<string, string> {
  const out = new Map<string, string>();
  const parts = text.split(/^=== note: (.+?) ===[ \t]*$/m);
  for (let i = 1; i < parts.length; i += 2) out.set(parts[i].trim(), parts[i + 1].replace(/^\n+|\s+$/g, ""));
  return out;
}

const replayCache = new Map<string, Map<string, string>>();
/** Accepted narrative for an item from the ledger, if its request is unchanged and it still validates. */
export function ledgerNarrative(ledger: Ledger, batchKey: string, req: NoteRequest): string | undefined {
  const e = ledger.batches[batchKey]?.items[req.key];
  if (!e || e.hash !== requestHash(req)) return undefined;
  let notes = replayCache.get(e.run);
  if (!notes) {
    const [family, runId] = [e.run.slice(0, e.run.lastIndexOf("/")), e.run.slice(e.run.lastIndexOf("/") + 1)];
    try {
      notes = parseNotesFile(replay(family, runId).outputs["notes.md"] ?? "");
    } catch {
      notes = new Map();
    }
    replayCache.set(e.run, notes);
  }
  const text = notes.get(req.key);
  return text !== undefined && validateNarrative(text, req).length === 0 ? text : undefined;
}

// ─── style guides (from sources/*/README.md and the examples) ────────────────────────────────────

const STYLE: Record<SourceKey, { name: string; guide: string; example: string[] }> = {
  A: {
    name: "Riverside Regional Hospital (signed hospital documents)",
    guide: [
      "A community hospital. Each item is one signed document: ED provider note, admission H&P, daily progress note, specialty consult, discharge summary.",
      "Write like a hospital physician: a `## Title` heading, then bold section labels (**History.**, **Exam.**, **Results.**, **Assessment and plan**), full sentences, numbered problem lists in H&Ps and progress notes, a medication list in the discharge summary.",
      "Times in the prose are local wall-clock times (America/Chicago), e.g. 'started 23:05', 'on the 06:10 panel'. Lab values as the lab reports them ('Troponin I <0.01').",
      "Discuss decisions explicitly (why a drug is held, what the plan is). Rule-outs are stated as such ('Pancreatitis ruled out: lipase 28').",
    ].join("\n"),
    example: ["riverside/2024-11-02-admission-hp.folio.md"],
  },
  B: {
    name: "Northgate Family Medicine (primary care event log)",
    guide: [
      "A primary-care practice. Prose is terse: what the clinician typed into a comment box or a short visit note.",
      "Visit notes: a few short lines, abbreviations are normal (pt, f/u, RTC 3 mo, BP, A1c, HTN, DM2, CKD). No headings, no bold section labels. Mention what was decided today.",
      "Event comments (medication, problem, allergy events): one or two short lines, usually the whole comment is the span, e.g. `<ref id=\"med_1\">eGFR 41 on 2/9. Metformin down to 500 mg BID.</ref> Pt informed by phone.`",
      "Dates in prose are short US style (2/9, 11/2024). Referral letters are a short plain letter to the specialist.",
    ].join("\n"),
    example: ["northgate/2024-11-12-hospital-follow-up-note.folio.md", "northgate/2026-02-11-metformin-dose-reduced.folio.md", "northgate/2021-06-03-lisinopril-intolerance.folio.md"],
  },
  C: {
    name: "Lakeview Kidney Care (nephrology clinic on the lab's coded-table system)",
    guide: [
      "A nephrology clinic. Little prose: the nephrologist's short signed note, a few short paragraphs of clipped sentences ('CKD G3b A3, diabetic and hypertensive. eGFR 54 → 41 since 2022.').",
      "Phone contacts are one to three lines. No headings, no bold labels. Numbers with units where useful; arrows for trends are fine.",
    ].join("\n"),
    example: ["lakeview/2026-07-13-nephrology-new-visit.folio.md", "lakeview/2026-09-14-finerenone-hold.folio.md"],
  },
  P: {
    name: "HomeLog (the patient's own phone diary)",
    guide: [
      "The patient types short diary notes into a phone app. First person, plain everyday words, sometimes run-on sentences or small typos; no medical jargon unless a clinician said it to them; brand names or nicknames for medicines ('my water pill', 'Jardiance').",
      "The app adds the bold time label; the patient's words go inside the span. Follow the skeleton exactly.",
    ].join("\n"),
    example: ["homelog/2024-10-31-stomach-bug.folio.md", "homelog/2024-02-10-meter-unit-change.folio.md"],
  },
};

function exampleNarrative(rel: string): string {
  const [dir, file] = rel.split("/");
  return parseItem(readFileSync(join(REPO, "sources", dir, "examples", file), "utf8")).narrative;
}

export function buildPrompt(source: SourceKey, reqs: NoteRequest[], feedback?: Map<string, { text: string; problems: string[] }>): string {
  const st = STYLE[source];
  const strip = (r: NoteRequest) => ({
    key: r.key, kind: r.docKind, when: r.when, author: r.author, length: r.length,
    refs: r.refs, spans: r.spans.map((s) => ({ id: s.id, statement: s.statement })),
    mustInclude: r.mustInclude.map((m) => m.statement), context: r.context,
    forbidden: r.forbidden.map((f) => f.statement + ` (pattern /${f.pattern}/i)`),
    sensitive: r.sensitive.map((s) => ({ words: `/${s.pattern}/i`, onlyInsideSpans: s.allowedIn })),
    ...(r.skeleton ? { skeleton: r.skeleton } : {}), ...(r.gist ? { gist: r.gist } : {}),
  });
  const lines = [
    `# Task`,
    ``,
    `You are writing the narrative text of synthetic medical record items for a test corpus (FOLIO). All patients and clinicians are fictional. Each request below is one record item from ${st.name}. Its structured data already exists; you write only the human-readable note text that goes with it.`,
    ``,
    `## How this source writes`,
    ``,
    st.guide,
    ``,
    `## Reference notes from this source (other dates; for style only, do not copy their facts)`,
    ``,
    ...st.example.flatMap((e) => ["```markdown", exampleNarrative(e), "```", ""]),
    `## Rules (a program checks every note; violations are sent back to you)`,
    ``,
    `1. For every id in \`refs\` and \`spans\`, wrap the words about it in exactly one \`<ref id="ID">…</ref>\`. Use no other ids. Spans never nest and never cross a paragraph break or a list item.`,
    `2. \`spans\` have no structured data behind them, so the span's own words must say the \`statement\`.`,
    `3. Say every \`mustInclude\` fact somewhere in the note, in the author's words, keeping the numbers.`,
    `4. Never mention anything matching \`forbidden\`, not even to deny it.`,
    `5. Words matching \`sensitive\` may appear only inside the listed spans.`,
    `6. Markdown only: no HTML except the ref tags, no images, no frontmatter, no code fences. Write values like \`<0.01\` as they are.`,
    `7. If a \`skeleton\` is given, reproduce it exactly and replace each [words] with the text.`,
    `8. Use only the facts given (refs, spans, mustInclude, context, gist). You may add ordinary narrative texture (symptoms described in words, exam findings, reassurance, follow-up timing) but no new diagnoses, medications, doses, or lab values.`,
    `9. Keep to each request's \`length\`.`,
    `10. No signature lines, no "signed at" times, no ISO timestamps (2024-11-02T07:15); write dates and times the way this source does.`,
    `11. Don't state decisions about medications or problems beyond what the request gives; mention other listed medications only as they are listed.`,
    `12. Patients (HomeLog) write what they knew at the time, in plain words: no diagnosis they had not been given yet, no generic names in parentheses after a brand.`,
    ``,
    `## Output`,
    ``,
    `Write ONE file, \`out/notes.md\`, containing every note, each preceded by its header line exactly like this:`,
    ``,
    "```",
    `=== note: <key> ===`,
    `<note text>`,
    "```",
    ``,
    `Do not write anything else to out/. Reply "done" when the file is written.`,
    ``,
    `## Requests (${reqs.length})`,
    ``,
    "```json",
    JSON.stringify(reqs.map(strip), null, 1),
    "```",
  ];
  if (feedback?.size) {
    lines.push("", "## Your previous attempt failed these checks; rewrite these notes", "");
    for (const [key, f] of feedback) lines.push(`### ${key}`, "", "Problems:", ...f.problems.map((p) => `- ${p}`), "", "Previous text:", "```markdown", f.text || "(missing)", "```", "");
  }
  return lines.join("\n");
}

export interface BatchResult { accepted: Map<string, { text: string; run: string }>; failed: Map<string, string[]>; runs: LedgerRun[] }

export async function runBatch(opts: {
  batchKey: string; source: SourceKey; reqs: NoteRequest[]; backend: BackendName; model?: string; retries: number; tmux?: boolean; timeoutMs?: number;
  log?: (s: string) => void;
}): Promise<BatchResult> {
  const accepted = new Map<string, { text: string; run: string }>();
  const runs: LedgerRun[] = [];
  let pending = opts.reqs;
  let feedback: Map<string, { text: string; problems: string[] }> | undefined;
  let failed = new Map<string, string[]>();
  for (let attempt = 1; attempt <= opts.retries + 1 && pending.length; attempt++) {
    const runId = `${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z")}-${opts.batchKey.replace(/[^a-zA-Z0-9]+/g, "-")}-a${attempt}`;
    const res = await runAgent(
      { family: "prose", runId, prompt: buildPrompt(opts.source, pending, feedback), backend: opts.backend, model: opts.model, expectFiles: ["notes.md"], tmux: opts.tmux, timeoutMs: opts.timeoutMs ?? 20 * 60000, allowedTools: ["Write", "Read"] },
      { retries: 1 },
    );
    const run = `prose/${res.meta.runId}`;
    const notes = parseNotesFile(res.outputs["notes.md"] ?? "");
    feedback = new Map();
    failed = new Map();
    let ok = 0;
    for (const r of pending) {
      const text = notes.get(r.key) ?? "";
      const problems = text ? validateNarrative(text, r) : ["note missing from out/notes.md"];
      if (problems.length) { feedback.set(r.key, { text, problems }); failed.set(r.key, problems); }
      else { accepted.set(r.key, { text, run }); ok++; }
    }
    runs.push({ run, backend: opts.backend, model: opts.model, attempt, requested: pending.length, accepted: ok, costUsd: res.meta.costUsd, durationMs: res.meta.durationMs, ok: res.meta.ok, ...(res.meta.error ? { error: res.meta.error } : {}) });
    opts.log?.(`${opts.batchKey} attempt ${attempt}: ${ok}/${pending.length} accepted${res.meta.costUsd !== undefined ? `, $${res.meta.costUsd.toFixed(3)}` : ""}, ${(res.meta.durationMs / 1000).toFixed(0)}s${res.meta.ok ? "" : ` (run failed: ${res.meta.error})`}`);
    pending = pending.filter((r) => !accepted.has(r.key));
  }
  return { accepted, failed, runs };
}

/** Group prose-needing items into (patient, source) batches. */
export function batchesOf(patientId: string, items: RenderedItem[]): { key: string; source: SourceKey; reqs: NoteRequest[] }[] {
  const by = new Map<SourceKey, NoteRequest[]>();
  for (const it of items) if (it.note && it.narrativeKind === "prose") (by.get(it.source) ?? by.set(it.source, []).get(it.source)!).push(it.note);
  return [...by].map(([source, reqs]) => ({ key: `${patientId}/${SOURCE_DIR[source]}`, source, reqs }));
}
