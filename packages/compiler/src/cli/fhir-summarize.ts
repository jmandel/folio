// Recompute the US Core validation summaries from the stored issues: terminology-engine exceptions (the validator's own
// calls to tx.fhir.org failing: timeouts, cache errors) are counted apart from structural errors.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { RESULTS } from "../compile.ts";
import { isTerminology } from "../fhirvalidate.ts";
const text = (i: any) => i.diagnostics ?? i.details?.text ?? "";
const engine = (i: any) => i.code === "exception" || /SocketTimeoutException|Error from https:\/\/tx\.fhir\.org/.test(text(i));
for (const f of readdirSync(join(RESULTS, "fhir")).filter((x) => x.startsWith("fresh-"))) {
  const p = join(RESULTS, "fhir", f), d = JSON.parse(readFileSync(p, "utf8"));
  const errs = d.structuralIssues.filter((i: any) => ["error", "fatal"].includes(i.severity));
  d.engineExceptions = errs.filter(engine).length;
  const structural = errs.filter((i: any) => !engine(i));
  d.structuralErrors = structural.filter((i: any) => !isTerminology(i)).length;
  d.validatorTerminologyErrors = structural.filter(isTerminology).length;
  const m = new Map<string, number>(); for (const i of structural) m.set(text(i).slice(0, 160), (m.get(text(i).slice(0, 160)) ?? 0) + 1);
  d.topErrors = [...m].sort((a, b) => b[1] - a[1]).slice(0, 8);
  writeFileSync(p, JSON.stringify(d) + "\n");
  console.log(d.source, d.runId, "structural", d.structuralErrors, "validator-terminology", d.validatorTerminologyErrors, "engine exceptions", d.engineExceptions, "tx invalid", d.terminologyErrors, "display", d.terminologyWarnings);
}
