// bun run check:corpus [--skip-tsc]
//
// Validates every corpus item: it parses; envelope fields are well-formed; schema.sha256 is the
// current hash; the payload type-checks against its source schema (tsc --strict); ref spans are
// well-formed and name a payload entry or a documented narrative-only span; supersedes/retracts
// point at items in the same log; written prose passes its note request's checks. Then compares
// the traps detectable in the corpus with the trap assignment in MANIFEST.json.

import { createHash } from "node:crypto";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { build } from "../corpus.ts";
import { parseItem, REPO, schemaPath, type SourceDir } from "../item.ts";
import { ledgerNarrative, loadLedger } from "../prose.ts";
import { parseSpans, validateNarrative } from "../validate.ts";

const { values } = parseArgs({ options: { "skip-tsc": { type: "boolean", default: false } } });
const CORPUS = join(REPO, "corpus");
const DIRS: SourceDir[] = ["riverside", "northgate", "lakeview", "homelog"];
const TYPES: Record<SourceDir, string[]> = { riverside: ["RiversideEntry"], northgate: ["ChartEvent"], lakeview: ["LabReportRow", "ClinicRow"], homelog: ["HomeLogEntry"] };
const NARRATIVE_ONLY: Record<SourceDir, string[]> = { riverside: ["precipitant"], northgate: ["sick_day"], lakeview: ["sglt2_decision", "na_sertraline"], homelog: [] };
const ID = /^[a-z][a-z0-9_]{0,63}$/;
const ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const DATE_PARTIAL = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const DATETIME_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

const problems: string[] = [];
const hashes = Object.fromEntries(DIRS.map((d) => [d, createHash("sha256").update(readFileSync(schemaPath(d))).digest("hex")]));
const work = mkdtempSync(join(tmpdir(), "folio-corpus-check-"));
const tsFiles: string[] = [];
type Parsed = ReturnType<typeof parseItem> & { path: string; dir: SourceDir; patient: string };
const all: Parsed[] = [];
let n = 0;

for (const dir of DIRS) {
  let patients: string[] = [];
  try { patients = readdirSync(join(CORPUS, dir)); } catch { continue; }
  for (const pat of patients) {
    const files = readdirSync(join(CORPUS, dir, pat)).filter((f) => f.endsWith(".folio.md")).sort();
    const ids = new Set<string>();
    const parsed: Parsed[] = [];
    for (const f of files) {
      const path = `${dir}/${pat}/${f}`;
      let it: ReturnType<typeof parseItem>;
      try { it = parseItem(readFileSync(join(CORPUS, dir, pat, f), "utf8")); } catch (e) { problems.push(`${path}: does not parse (${e})`); continue; }
      n++;
      const fr = it.front as Record<string, any>;
      if (fr.folio !== "0.1") problems.push(`${path}: folio != 0.1`);
      if (!ULID.test(fr.id ?? "")) problems.push(`${path}: id is not a ULID`);
      if (fr.patient !== pat) problems.push(`${path}: patient ${fr.patient} != directory ${pat}`);
      for (const k of ["effective", "effective_end"]) if (fr[k] !== undefined && !DATE_PARTIAL.test(fr[k]) && !DATETIME_OFFSET.test(fr[k])) problems.push(`${path}: ${k} '${fr[k]}' has no offset and is not a date`);
      if (!DATETIME_OFFSET.test(fr.recorded ?? "")) problems.push(`${path}: recorded must carry an offset`);
      if (!it.narrative && !Object.keys(it.payload).length && !(fr.retracts ?? []).length) problems.push(`${path}: empty item`);
      if (ids.has(fr.id)) problems.push(`${path}: duplicate id ${fr.id}`);
      ids.add(fr.id);
      if (Object.keys(it.payload).length) {
        if (!fr.schema) problems.push(`${path}: payload without schema`);
        else {
          if (fr.schema.sha256 !== hashes[dir]) problems.push(`${path}: schema.sha256 is stale`);
          if (!TYPES[dir].includes(fr.schema.type)) problems.push(`${path}: unexpected schema.type ${fr.schema.type}`);
        }
      }
      for (const k of Object.keys(it.payload)) if (!ID.test(k)) problems.push(`${path}: bad entry id ${k}`);
      const { spans, problems: sp } = parseSpans(it.narrative);
      for (const x of sp) problems.push(`${path}: ${x}`);
      for (const s of spans) if (!(s.id in it.payload) && !NARRATIVE_ONLY[dir].includes(s.id)) problems.push(`${path}: ref '${s.id}' has no payload entry and is not a documented narrative-only span`);
      if (/```+\s*json payload/.test(it.narrative)) problems.push(`${path}: narrative contains a payload fence`);
      parsed.push({ ...it, path, dir, patient: pat });
    }
    for (const it of parsed) for (const k of ["supersedes", "retracts"]) for (const ref of ((it.front as any)[k] ?? []) as string[]) if (!ids.has(ref)) problems.push(`${it.path}: ${k} ${ref} not found in this log`);
    all.push(...parsed);
    // One TS file per (source, patient, schema type): arrays of payloads, each tagged with its file.
    for (const type of TYPES[dir]) {
      const mine = parsed.filter((x) => (x.front as any).schema?.type === type);
      if (!mine.length) continue;
      const ts = join(work, `${dir}-${pat}-${type}.ts`);
      writeFileSync(ts, `import type { ${type} } from ${JSON.stringify(schemaPath(dir).replace(/\.d\.ts$/, ""))};\n` +
        mine.map((x, i) => `// ${x.path}\nexport const p${i}: Record<string, ${type}> = ${JSON.stringify(x.payload)};\n`).join(""));
      tsFiles.push(ts);
    }
  }
}

let tscNote = "skipped";
if (!values["skip-tsc"]) {
  const tsc = spawnSync("bunx", ["-p", "typescript@5.6.3", "tsc", "--strict", "--noEmit", "--target", "es2022", "--module", "esnext", "--moduleResolution", "bundler", "--typeRoots", work, ...tsFiles],
    { encoding: "utf8", maxBuffer: 1 << 28 });
  const errs = (tsc.stdout + tsc.stderr).split("\n").filter((l) => /error TS/.test(l));
  for (const e of errs.slice(0, 50)) {
    const m = e.match(/^(.*?\.ts)\((\d+),/);
    let where = e;
    if (m) { const lines = readFileSync(m[1], "utf8").split("\n"); for (let i = +m[2] - 1; i >= 0; i--) if (lines[i].startsWith("// ")) { where = `${lines[i].slice(3)}: ${e.replace(/^.*?error /, "error ")}`; break; } }
    problems.push(`tsc: ${where}`);
  }
  if (errs.length > 50) problems.push(`tsc: ... ${errs.length - 50} more errors`);
  tscNote = `${tsFiles.length} files, ${errs.length} errors`;
}

// Prose: every accepted note still passes its request's checks; count placeholders.
const b = build();
const ledger = loadLedger();
let prose = 0, template = 0, proseFail = 0;
for (const p of b.patients) for (const it of b.items.get(p.id)!) {
  if (!it.note || it.narrativeKind !== "prose") continue;
  const path = `${it.dir}/${p.sources[it.source]!.localId}/${it.file}`;
  const corpusText = all.find((x) => x.path === path)?.narrative;
  const accepted = ledgerNarrative(ledger, `${p.id}/${it.dir}`, it.note);
  if (accepted === undefined) { template++; continue; }
  prose++;
  const v = validateNarrative(corpusText ?? "", it.note);
  if (v.length || corpusText?.trim() !== accepted.trim()) { proseFail++; problems.push(`${path}: prose fails its request: ${v.join("; ") || "corpus text differs from the accepted note (run bun run gen)"}`); }
}

// Trap coverage: what the corpus shows, per patient, against the truth's assignment.
const manifest = JSON.parse(readFileSync(join(CORPUS, "MANIFEST.json"), "utf8"));
const patientsJson = JSON.parse(readFileSync(join(CORPUS, "answers", "patients.json"), "utf8")) as { patient: string; sources: Record<string, string> }[];
const truthOf = new Map<string, string>();
for (const p of patientsJson) for (const [d, local] of Object.entries(p.sources)) truthOf.set(`${d}/${local}`, p.patient);
const seen = new Map<string, Set<string>>();
const mark = (it: Parsed, t: string) => { const pid = truthOf.get(`${it.dir}/${it.patient}`)!; (seen.get(t) ?? seen.set(t, new Set()).get(t)!).add(pid); };
const byLog = new Map<string, Parsed[]>();
for (const it of all) (byLog.get(`${it.dir}/${it.patient}`) ?? byLog.set(`${it.dir}/${it.patient}`, []).get(`${it.dir}/${it.patient}`)!).push(it);
for (const it of all) {
  const entries = Object.values(it.payload) as Record<string, any>[];
  const fr = it.front as Record<string, any>;
  const has = (pred: (e: Record<string, any>) => boolean) => entries.some(pred);
  if (has((e) => (e.type === "home_med" && e.status === "held") || (e.type === "med_event" && e.action === "hold") || (e.type === "MED_STATUS_HIST" && e.NEW_STATUS === 3) || (e.type === "med_event" && e.origin === "outside"))) mark(it, "T1");
  if (has((e) => e.type === "LAB_RESULT" && e.RESULT_STATUS === "C")) mark(it, "T2");
  if (has((e) => (e.type === "LAB_RESULT" && e.RESULT_STATUS === "C") || (e.type === "LAB_ORDER" && e.REPEAT_REASON) || (e.type === "imported_result" && e.result_status === "C"))) mark(it, "T3");
  if (has((e) => e.type === "LAB_ORDER" && e.ORDER_STATUS === 9) || (fr.retracts ?? []).length) mark(it, "T4");
  if (has((e) => e.type === "glucose_reading" && e.unit === "mmol/L")) mark(it, "T6");
  if (has((e) => (e.type === "imported_result" && e.unit === "cells/uL") || (e.type === "panel" && e.components.some((c: any) => c.unit === "10*3/uL")))) mark(it, "T7");
  if (has((e) => (e.type === "LAB_RESULT" && e.VALUE_NUM === 9999999) || (e.type === "result" && /^[<>]/.test(e.value)) || (e.type === "imported_result" && /^[<>]/.test(e.value)))) mark(it, "T9");
  if (it.dir === "homelog" || (it.dir === "riverside" && String(fr.effective).endsWith("Z")) || has((e) => e.onset && e.onset.precision !== "day")) mark(it, "T10");
  if (has((e) => e.TEST_CODE === "LK-EGFR09N" || e.external_ref?.result_code === "LK-EGFR09N")) mark(it, "T11");
  if (has((e) => e.type === "diagnosis" && ["ruled_out", "working"].includes(e.status)) || (has((e) => e.type === "allergy_event") && /\bno (lip|tongue|throat|facial|swelling|angioedema)/i.test(it.narrative))) mark(it, "T12");
  if (has((e) => e.type === "my_med" && e.kind === "over_the_counter")) mark(it, "T13");
  if (has((e) => e.type === "imported_result") || (it.dir === "homelog" && (fr.supersedes ?? []).length) || has((e) => e.type === "bp_reading" && e.entry_method === "typed")) mark(it, "T14");
  if (has((e) => e.TEST_CODE === "LK-EGFR21" || (["LK-K", "LK-UACR"].includes(e.TEST_CODE) && !e.LOINC)) || has((e) => e.type === "med_event" && e.drug?.outside_code) || has((e) => e.type === "result" && !e.test.loinc)) mark(it, "T16");
  if (has((e) => e.onset && e.onset.precision !== "day")) mark(it, "T17");
  if (has((e) => (e.type === "diagnosis" && /^Adverse effect/.test(e.label)) || (e.type === "allergy_event" && e.reaction_type !== "allergy") || (e.type === "allergy" && e.reaction === "cough"))) mark(it, "T18");
  if (has((e) => e.restricted === "BH")) mark(it, "T19");
}
// Prose-only facts (T13) and negations (T12): the fact's words appear in a note from a source that holds it.
for (const p of b.patients) {
  for (const f of p.narrativeFacts) {
    const t = f.polarity === "negated" ? "T12" : Object.values(f.visibility).every((m) => m === "prose") ? "T13" : undefined;
    if (!t) continue;
    for (const s of Object.keys(f.visibility)) {
      const local = p.sources[s as keyof typeof p.sources]?.localId;
      const dir = ({ A: "riverside", B: "northgate", C: "lakeview", P: "homelog" } as const)[s as "A" | "B" | "C" | "P"];
      const hit = (byLog.get(`${dir}/${local}`) ?? []).find((it) => f.evidence.every((g) => g.some((re) => new RegExp(re, "i").test(it.narrative.replace(/<\/?ref[^>]*>/g, "")))));
      if (hit) { mark(hit, t); break; }
    }
  }
}
for (const [log, items] of byLog) {
  const [dir] = log.split("/");
  if (dir === "riverside") {
    const enc = new Map<string, number>();
    for (const it of items) { const e = (Object.values(it.payload) as any[]).find((x) => x.type === "encounter"); if (e && (Object.values(it.payload) as any[]).some((x) => x.type === "home_med")) enc.set(e.encounter_id, (enc.get(e.encounter_id) ?? 0) + 1); }
    if ([...enc.values()].some((c) => c > 1)) mark(items[0], "T15");
  }
  if (dir === "lakeview") {
    const g = [...items].reverse().flatMap((it) => (Object.values(it.payload) as any[]).filter((x) => x.type === "CLINIC_VISIT" && x.CKD_G))[0]?.CKD_G;
    const pid = truthOf.get(log)!;
    const ng = patientsJson.find((x) => x.patient === pid)!.sources.northgate;
    if (g && ng) {
      const probs = (byLog.get(`northgate/${ng}`) ?? []).flatMap((it) => (Object.values(it.payload) as any[]).filter((x) => x.type === "problem_event" && /kidney/i.test(x.description)));
      const stage = probs[probs.length - 1]?.description.match(/stage (\w+)/)?.[1];
      if (stage && `G${stage}` !== g) mark(items[0], "T5");
    }
  }
}
const coverage: Record<string, { assigned: number; detected: number; both: number; assigned_not_detected: string[]; detected_not_assigned: number }> = {};
for (const [t, v] of Object.entries(manifest.traps as Record<string, { patients: string[] }>)) {
  const assigned = new Set(v.patients);
  const det = seen.get(t) ?? new Set();
  coverage[t] = { assigned: assigned.size, detected: det.size, both: [...assigned].filter((x) => det.has(x)).length, assigned_not_detected: [...assigned].filter((x) => !det.has(x)), detected_not_assigned: [...det].filter((x) => !assigned.has(x)).length };
}

console.log(`${n} items checked; tsc: ${tscNote}; prose notes: ${prose} accepted and re-validated (${proseFail} failing), ${template} still template placeholders`);
console.log(`\ntrap coverage (patients): assigned in truth / detected in corpus / both`);
for (const [t, c] of Object.entries(coverage)) console.log(`  ${t.padEnd(4)} ${String(c.assigned).padStart(4)} ${String(c.detected).padStart(4)} ${String(c.both).padStart(4)}${c.assigned_not_detected.length ? `   not detected: ${c.assigned_not_detected.slice(0, 8).join(",")}${c.assigned_not_detected.length > 8 ? ",…" : ""}` : ""}`);
writeFileSync(join(CORPUS, "..", "runs", "check-corpus-coverage.json"), JSON.stringify(coverage, null, 1));
console.log(`\n${problems.length} problem(s).`);
for (const p of problems.slice(0, 80)) console.log(" - " + p);
process.exit(problems.length ? 1 : 0);
