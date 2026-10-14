// Official HL7 FHIR validator (validator_cli.jar, as used in ~/hobby/ehi-to-fhir/tools/validate.ts) over a US Core
// mapper's output: the hero plus a fixed sample of held-out patients, as of the end of the corpus. Resources are
// wrapped in a collection Bundle with fullUrls; US Core is loaded (hl7.fhir.us.core.r4#8.0.1) and each resource
// declares its US Core profile, so profile conformance is checked. Terminology is checked against tx.fhir.org (the
// harness has network; agents never do): RxNorm, LOINC and UCUM codes and bindings are validated. Every issue is
// stored; terminology issues are counted apart. No Patient resources are added.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { EVAL_AS_OF, itemsForPatient, patientsIn, REPO, shuffled, type Source } from "./data.ts";
import { execute, stage } from "./exec.ts";

export const VALIDATOR_JAR = join(homedir(), "hobby/ehi-to-fhir/tools/validator_cli.jar");
export const SAMPLE_PATIENTS = Number(process.env.FHIR_SAMPLE ?? 25);

export interface Validation {
  patients: string[]; resources: number; errors: number; warnings: number; info: number;
  terminologyErrors: number; terminologyWarnings: number; structuralErrors: number;
  topErrors: [string, number][]; topWarnings: [string, number][]; topTerminology: [string, number][]; reportPath: string; tx: string;
}
export const TX = "https://tx.fhir.org/r4";
/** A terminology issue: about a code, code system, value set or binding (validator issue code or message). */
export const isTerminology = (i: any) => ["code-invalid", "not-found"].includes(i.code) && /code|ValueSet|CodeSystem|binding|display/i.test(i.diagnostics ?? i.details?.text ?? "")
  || /ValueSet|CodeSystem|Unknown code|not a valid code|display|terminology|binding/i.test(i.diagnostics ?? i.details?.text ?? "");

const norm = (msg: string) => msg.replace(/\d+(\.\d+)?/g, "#").replace(/'[^']{0,80}'/g, "'…'").slice(0, 180);

export function validateUsCore(transformTs: string, source: Source, runId: string, tag = "fresh"): Validation {
  const test = patientsIn(source, "test");
  const sample = [...test.filter((p) => p.patient === "hero"), ...shuffled(test.filter((p) => p.patient !== "hero"), `fhir/${source}`).slice(0, SAMPLE_PATIENTS)];
  const runs = execute(stage(transformTs, "uscore"), sample.map((p) => ({ patient: p.patient, asOf: EVAL_AS_OF, items: itemsForPatient(source, p) }))).runs;
  const resources = runs.flatMap((r) => (r.error ? [] : [...(r.rows?.medicationRequests ?? []), ...(r.rows?.observations ?? [])]));
  const dir = join(REPO, "build/stage3/fhir", `${tag}-${runId}`);
  mkdirSync(dir, { recursive: true });
  const bundle = { resourceType: "Bundle", type: "collection", entry: resources.map((r: any) => ({ fullUrl: `https://folio.example/fhir/${r.resourceType}/${r.id}`, resource: r })) };
  writeFileSync(join(dir, "bundle.json"), JSON.stringify(bundle));
  const out = join(dir, "report.json");
  spawnSync("java", ["-Xmx6g", "-jar", VALIDATOR_JAR, join(dir, "bundle.json"), "-version", "4.0.1", "-ig", "hl7.fhir.us.core.r4#8.0.1", "-tx", TX, "-txCache", join(REPO, "build/stage3/fhir/txcache"), "-output", out], { encoding: "utf8", timeout: 30 * 60_000, maxBuffer: 1 << 28 });
  if (!existsSync(out)) throw new Error(`validator produced no report for ${runId}`);
  const issues = (JSON.parse(readFileSync(out, "utf8")).issue ?? []) as any[];
  const count = (sev: string[]) => issues.filter((i) => sev.includes(i.severity));
  const top = (xs: any[]) => { const m = new Map<string, number>(); for (const i of xs) { const k = norm(i.diagnostics ?? i.details?.text ?? ""); m.set(k, (m.get(k) ?? 0) + 1); } return [...m].sort((a, b) => b[1] - a[1]).slice(0, 8); };
  const errs = count(["error", "fatal"]), warns = count(["warning"]);
  const keep = join(REPO, "results/stage3/fhir");
  mkdirSync(keep, { recursive: true });
  const v: Validation = {
    patients: sample.map((p) => p.patient), resources: resources.length, errors: errs.length, warnings: warns.length, info: count(["information"]).length,
    terminologyErrors: errs.filter(isTerminology).length, terminologyWarnings: warns.filter(isTerminology).length, structuralErrors: errs.filter((i) => !isTerminology(i)).length,
    topErrors: top(errs), topWarnings: top(warns), topTerminology: top([...errs, ...warns].filter(isTerminology)), reportPath: `results/stage3/fhir/${tag}-${runId}.json`, tx: TX,
  };
  writeFileSync(join(keep, `${tag}-${runId}.json`), JSON.stringify({ runId, source, ...v, issues }) + "\n");
  return v;
}
