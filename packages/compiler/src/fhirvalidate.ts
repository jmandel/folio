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

function runValidator(resources: any[], dir: string, name: string, tx: string): any[] {
  mkdirSync(dir, { recursive: true });
  const bundle = { resourceType: "Bundle", type: "collection", entry: resources.map((r: any) => ({ fullUrl: `https://folio.example/fhir/${r.resourceType}/${r.id}`, resource: r })) };
  writeFileSync(join(dir, `${name}.json`), JSON.stringify(bundle));
  const out = join(dir, `${name}-report.json`);
  spawnSync("java", ["-Xmx6g", "-jar", VALIDATOR_JAR, join(dir, `${name}.json`), "-version", "4.0.1", "-ig", "hl7.fhir.us.core.r4#8.0.1", "-tx", tx,
    ...(tx === "n/a" ? [] : ["-txCache", join(REPO, "build/stage3/fhir/txcache")]), "-output", out], { encoding: "utf8", timeout: 60 * 60_000, maxBuffer: 1 << 28 });
  if (!existsSync(out)) throw new Error(`validator produced no report for ${name}`);
  return (JSON.parse(readFileSync(out, "utf8")).issue ?? []) as any[];
}

/** Every coding and UCUM unit in the resources, de-duplicated. */
function distinctCodes(resources: any[]): { system: string; code: string; display?: string }[] {
  const out = new Map<string, { system: string; code: string; display?: string }>();
  const add = (c: any) => { if (c?.system && c?.code && /^https?:/.test(c.system)) out.set(`${c.system}|${c.code}|${c.display ?? ""}`, { system: c.system, code: String(c.code), ...(c.display ? { display: c.display } : {}) }); };
  for (const r of resources) {
    for (const c of r.medicationCodeableConcept?.coding ?? []) add(c);
    for (const c of r.code?.coding ?? []) add(c);
    for (const cat of r.category ?? []) for (const c of cat.coding ?? []) add(c);
    for (const q of [r.valueQuantity, r.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity]) if (q?.system && q?.code) add({ system: q.system, code: q.code });
  }
  return [...out.values()];
}

/** tx.fhir.org CodeSystem/$validate-code for one coding: valid, and whether the display matches. */
async function txValidate(c: { system: string; code: string; display?: string }): Promise<{ result: boolean | null; message?: string }> {
  const u = new URL(`${TX}/CodeSystem/$validate-code`);
  u.searchParams.set("url", c.system); u.searchParams.set("code", c.code); if (c.display) u.searchParams.set("display", c.display);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(u, { headers: { accept: "application/fhir+json" }, signal: AbortSignal.timeout(60_000) });
      const j: any = await res.json();
      const p = (n: string) => j.parameter?.find((x: any) => x.name === n);
      if (j.resourceType === "Parameters") return { result: p("result")?.valueBoolean ?? null, message: p("message")?.valueString };
      return { result: null, message: j.issue?.[0]?.diagnostics ?? `HTTP ${res.status}` };
    } catch (e) { if (attempt === 2) return { result: null, message: String(e).slice(0, 200) }; }
  }
  return { result: null };
}

/**
 * Structure and profile conformance: the HL7 validator over every resource of the sample, terminology offline
 * (-tx n/a). Terminology: every distinct coding and UCUM unit checked with tx.fhir.org CodeSystem/$validate-code
 * (code exists; display matches when one is given). Value-set binding checks against tx.fhir.org were not run:
 * through the validator they took over 15 minutes per 40 resources.
 */
export async function validateUsCore(transformTs: string, source: Source, runId: string, tag = "fresh"): Promise<Validation & { codes: number; invalidCodes: any[] }> {
  const test = patientsIn(source, "test");
  const sample = [...test.filter((p) => p.patient === "hero"), ...shuffled(test.filter((p) => p.patient !== "hero"), `fhir/${source}`).slice(0, SAMPLE_PATIENTS)];
  const runs = execute(stage(transformTs, "uscore"), sample.map((p) => ({ patient: p.patient, asOf: EVAL_AS_OF, items: itemsForPatient(source, p) }))).runs;
  const resources = runs.flatMap((r) => (r.error ? [] : [...(r.rows?.medicationRequests ?? []), ...(r.rows?.observations ?? [])]));
  const dir = join(REPO, "build/stage3/fhir", `${tag}-${runId}`);
  const structural = runValidator(resources, dir, "all", "n/a");
  const codes = distinctCodes(resources);
  const checks = [];
  for (const c of codes) checks.push({ ...c, ...(await txValidate(c)) });
  const invalidCodes = checks.filter((c) => c.result === false);
  const terminology = invalidCodes.map((c) => ({ severity: /display/i.test(c.message ?? "") && !/unknown|not found|invalid/i.test(c.message ?? "") ? "warning" : "error", diagnostics: `${c.system}|${c.code}${c.display ? ` "${c.display}"` : ""}: ${c.message ?? "invalid"}` }));
  const top = (xs: any[]) => { const m = new Map<string, number>(); for (const i of xs) { const k = norm(i.diagnostics ?? i.details?.text ?? ""); m.set(k, (m.get(k) ?? 0) + 1); } return [...m].sort((a, b) => b[1] - a[1]).slice(0, 8); };
  const sev = (xs: any[], s: string[]) => xs.filter((i) => s.includes(i.severity));
  const sErr = sev(structural, ["error", "fatal"]).filter((i) => !isTerminology(i)), sWarn = sev(structural, ["warning"]).filter((i) => !isTerminology(i));
  const tErr = sev(terminology, ["error", "fatal"]), tWarn = sev(terminology, ["warning"]);
  const keep = join(REPO, "results/stage3/fhir");
  mkdirSync(keep, { recursive: true });
  const v: Validation = {
    patients: sample.map((p) => p.patient), resources: resources.length, errors: sErr.length + tErr.length, warnings: sWarn.length + tWarn.length, info: sev(structural, ["information"]).length,
    terminologyErrors: tErr.length, terminologyWarnings: tWarn.length, structuralErrors: sErr.length,
    topErrors: top([...sErr, ...tErr]), topWarnings: top([...sWarn, ...tWarn]), topTerminology: top([...tErr, ...tWarn]), reportPath: `results/stage3/fhir/${tag}-${runId}.json`, tx: TX,
  };
  writeFileSync(join(keep, `${tag}-${runId}.json`), JSON.stringify({ runId, source, ...v, codes: codes.length, codeChecks: checks, structuralIssues: structural, terminologyIssues: terminology }) + "\n");
  return { ...v, codes: codes.length, invalidCodes };
}
