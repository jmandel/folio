// FOLIO_COHORT=fresh FHIR_SAMPLE=5 bun packages/compiler/src/cli/validate-uscore.ts : HL7 validation (tx.fhir.org) of the round-2 US Core mappers on fresh patients.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readTransformOf, RESULTS } from "../compile.ts";
import { SOURCES } from "../data.ts";
import { validateUsCore } from "../fhirvalidate.ts";
import { backendOf } from "../report.ts";
for (const s of SOURCES) for (const b of ["claude-opus", "codex-gpt-6-astra"]) {
  const p = join(RESULTS, "round2/compiles", s, "uscore", b, "a.json");
  if (!existsSync(p)) continue;
  const r = JSON.parse(readFileSync(p, "utf8"));
  if (existsSync(join(RESULTS, "fhir", `fresh-${r.final}.json`))) continue;
  const t0 = Date.now();
  const v = await validateUsCore(readTransformOf(s, "uscore", backendOf(b), r.final), s, r.final, "fresh");
  console.log(s, b, r.final, `${v.resources} resources, ${v.structuralErrors} structural errors; ${v.codes} distinct codes, ${v.terminologyErrors} terminology errors, ${v.terminologyWarnings} display warnings`, `${((Date.now() - t0) / 60000).toFixed(1)} min`);
}
process.exit(0);
