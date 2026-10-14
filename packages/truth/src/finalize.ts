// Fills derived parts of a patient's truth: eGFR rows computed from creatinine (with what the
// performing lab reported, T9/T11), lab defaults taken from their draw, cross-source copies (T14),
// canonical units, and visibility defaults. Used for the hero, the secondaries and the population.

import { ANALYTES } from "./catalog.ts";
import {
  ageOn, ckdEpi2009, ckdEpi2021, EGFR_2021_FROM, EGFR_NUMERIC_FROM, localDate,
  type LabResult, type Patient,
} from "./model.ts";

export type LabIn = Omit<LabResult, "collectedAt" | "unit" | "status" | "orderedBy" | "performedBy" | "visibility" | "specimen"> &
  Partial<Pick<LabResult, "collectedAt" | "unit" | "status" | "orderedBy" | "performedBy" | "visibility" | "specimen">>;

export type PatientIn = Omit<Patient, "labs"> & { labs: LabIn[] };

const SPECIMEN: Partial<Record<LabResult["analyte"], LabResult["specimen"]>> = {
  a1c: "whole-blood", platelets: "whole-blood", wbc: "whole-blood", hemoglobin: "whole-blood",
  uacr: "urine", ph: "venous-blood", pco2: "venous-blood",
};

export function finalize(input: PatientIn): Patient {
  const p = input as Patient;
  const draws = new Map(p.draws.map((d) => [d.id, d]));
  const black = /black|african/i.test(p.demographics.race ?? "");

  for (const l of p.labs as LabResult[]) {
    const d = draws.get(l.draw);
    if (!d) throw new Error(`${p.id}: lab ${l.id} has unknown draw ${l.draw}`);
    l.collectedAt ??= d.collectedAt;
    l.orderedBy ??= d.orderedBy;
    l.performedBy ??= d.performedBy;
    l.unit ??= ANALYTES[l.analyte].unit;
    l.status ??= "final";
    l.specimen ??= SPECIMEN[l.analyte] ?? "serum";
  }

  // eGFR from every creatinine that has none.
  const derived = new Set(p.labs.flatMap((l) => l.derivedFrom ?? []));
  const extra: LabResult[] = [];
  for (const cr of p.labs as LabResult[]) {
    if (cr.analyte !== "creatinine" || derived.has(cr.id)) continue;
    const date = localDate(cr.collectedAt, p.demographics.tz);
    const age = ageOn(p.demographics.birthDate, date);
    const sex = p.demographics.sex;
    const v21 = Math.round(ckdEpi2021(cr.value, age, sex));
    const reported: NonNullable<LabResult["reported"]> = [];
    if (cr.performedBy === "C" && date < EGFR_2021_FROM) {
      for (const [eq, isBlack, loinc] of [["ckd-epi-2009-nonaa", false, "48642-3"], ["ckd-epi-2009-aa", true, "48643-1"]] as const) {
        const v = Math.round(ckdEpi2009(cr.value, age, sex, isBlack));
        if (date < EGFR_NUMERIC_FROM && v >= 60) reported.push({ equation: eq, value: 60, comparator: ">", loinc });
        else if (date >= EGFR_NUMERIC_FROM && v > 90) reported.push({ equation: eq, value: 90, comparator: ">", loinc });
        else reported.push({ equation: eq, value: v, loinc });
      }
    } else if (cr.performedBy === "C") {
      reported.push(v21 > 90 ? { equation: "ckd-epi-2021", value: 90, comparator: ">" } : { equation: "ckd-epi-2021", value: v21 });
    } else {
      reported.push({ equation: "ckd-epi-2021", value: v21 });
    }
    void black;
    extra.push({
      id: `${cr.id}_egfr`, analyte: "egfr", draw: cr.draw, collectedAt: cr.collectedAt, specimen: "serum",
      value: v21, unit: ANALYTES.egfr.unit, status: cr.status, derivedFrom: [cr.id], reported,
      orderedBy: cr.orderedBy, performedBy: cr.performedBy, resultedAt: cr.resultedAt, finalAt: cr.finalAt,
      correctedAt: cr.correctedAt, visibility: { ...cr.visibility },
      traps: cr.performedBy === "C" && date < EGFR_2021_FROM ? ["T11", ...(date < EGFR_NUMERIC_FROM && reported[0].comparator ? ["T9" as const] : [])] : undefined,
    });
  }
  // Keep each eGFR right after its creatinine.
  if (extra.length) {
    const byCr = new Map(extra.map((e) => [e.derivedFrom![0], e]));
    p.labs = p.labs.flatMap((l) => (byCr.has(l.id) ? [l, byCr.get(l.id)!] : [l]));
  }

  // Copies: Lakeview results go to Northgate over the interface, except entered-in-error orders (T4).
  for (const l of p.labs) {
    if (l.performedBy === "C" && p.sources.B && l.status !== "entered-in-error") {
      l.copies ??= ["B"];
    }
    if (!l.visibility || Object.keys(l.visibility).length === 0) {
      l.visibility = { [l.performedBy]: "structured" };
      for (const c of l.copies ?? []) l.visibility[c] = "structured";
    }
    if (l.copies?.length) l.traps = [...new Set([...(l.traps ?? []), "T14" as const])];
  }

  for (const e of p.encounters) e.documents ??= [];
  p.home ??= undefined;
  return p;
}
