// View sets: the consumer-defined target views a mapper compiles into. A view set is a list of .d.ts
// files; its hash (sha256 over the files' names and bytes) keys the mapper cache together with the
// source schema hash.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const VIEWS_DIR = join(import.meta.dir, "..");

export interface ViewSet {
  /** Short name used in paths and tables. */
  name: "app" | "appv2" | "uscore";
  /** Files given to the compiler agent, in order: name in the workdir's in/views/ -> path relative to packages/views. */
  files: string[];
  /** Workdir names for `files` when they differ (v2 is published to the agent as views.d.ts). */
  as?: Record<string, string>;
  /** The exported function type transform.ts must satisfy, and the file that declares it. */
  transformType: string;
  transformFile: string;
}

export const VIEW_SETS: Record<ViewSet["name"], ViewSet> = {
  /** Views v3: written blind by a fresh agent from output semantics only (work/views-v3/). */
  app: { name: "app", files: ["views.d.ts"], transformType: "Transform", transformFile: "views.d.ts" },
  /** Views v2: written by the corpus author with knowledge of the sources ("views with source hints"). */
  appv2: { name: "appv2", files: ["v2/views.d.ts"], as: { "v2/views.d.ts": "views.d.ts" }, transformType: "Transform", transformFile: "views.d.ts" },
  uscore: { name: "uscore", files: ["views.d.ts", "uscore.d.ts"], transformType: "UsCoreTransform", transformFile: "uscore.d.ts" },
};

export function viewSetFiles(vs: ViewSet): Record<string, string> {
  return Object.fromEntries(vs.files.map((f) => [vs.as?.[f] ?? f, readFileSync(join(VIEWS_DIR, f), "utf8")]));
}

/** sha256 over "<name>\n<bytes>\n" for each file in order. */
export function viewSetHash(vs: ViewSet): string {
  const h = createHash("sha256");
  for (const [f, text] of Object.entries(viewSetFiles(vs))) h.update(`${f}\n${text}\n`);
  return h.digest("hex");
}

/** Canonical unit per analyte (the table in views.d.ts). */
export const ANALYTE_UNITS: Record<string, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L", bicarbonate: "mmol/L",
  anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL",
  bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
