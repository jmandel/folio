// Plain-language descriptions of truth facts, for note requests (what a note must cover).

import { ANALYTES, drug, FREQ_TEXT } from "../../truth/src/catalog.ts";
import { localDate, type Patient, type When, wall } from "../../truth/src/model.ts";

export function findFact(p: Patient, id: string) {
  return (
    p.conditions.find((x) => x.id === id) ?? p.meds.find((x) => x.id === id) ?? p.labs.find((x) => x.id === id) ??
    p.allergies.find((x) => x.id === id) ?? p.narrativeFacts.find((x) => x.id === id) ?? p.vitals.find((x) => x.id === id)
  );
}

export function fmtDate(w: When, tz = "America/Chicago"): string {
  return localDate(w, tz);
}

export function medDoseAt(p: Patient, medId: string, when: string) {
  const m = p.meds.find((x) => x.id === medId)!;
  let product = m.product, dose = m.dose, doseText = m.doseText, frequency = m.frequency;
  for (const h of m.history) {
    if (h.at.includes("T") && Date.parse(h.at) > Date.parse(when)) break;
    if (h.product) product = h.product;
    if (h.dose) dose = h.dose;
    if (h.doseText) doseText = h.doseText;
    if (h.frequency) frequency = h.frequency;
  }
  return { product, dose, doseText, frequency, drug: drug(product) };
}

export function describe(p: Patient, id: string, when?: string): string {
  const tz = p.demographics.tz;
  const c = p.conditions.find((x) => x.id === id);
  if (c) {
    const stage = [...c.history].reverse().find((h) => h.stage && (!when || h.at <= when))?.stage;
    return `${c.name}${stage ? ` (stage ${stage})` : ""}, onset ${c.onset}`;
  }
  const m = p.meds.find((x) => x.id === id);
  if (m) {
    const d = medDoseAt(p, id, when ?? "2100-01-01T00:00:00Z");
    const name = m.orderName ?? d.drug.ingredient;
    const last = [...m.history].reverse().find((h) => !when || !h.at.includes("T") || Date.parse(h.at) <= Date.parse(when));
    return `${name} ${d.doseText} ${FREQ_TEXT[d.frequency]}${m.otc ? " (over the counter)" : ""}; status ${last?.status ?? "active"}${last?.reason ? ` (${last.reason})` : ""}`;
  }
  const l = p.labs.find((x) => x.id === id);
  if (l) {
    return `${ANALYTES[l.analyte].name} ${l.comparator ?? ""}${l.value} ${l.unit} on ${localDate(l.collectedAt, tz)}${l.status !== "final" ? ` (${l.status})` : ""}${l.annotations?.length ? ` [${l.annotations.join(", ")}]` : ""}`;
  }
  const a = p.allergies.find((x) => x.id === id);
  if (a) return `${a.substance.display}: ${a.reaction} (${a.type}, criticality ${a.criticality})`;
  const f = p.narrativeFacts.find((x) => x.id === id);
  if (f) return f.statement;
  const v = p.vitals.find((x) => x.id === id);
  if (v) {
    const parts = [v.bp && `BP ${v.bp.systolic}/${v.bp.diastolic}`, v.pulse && `HR ${v.pulse}`, v.weightKg && `weight ${v.weightKg} kg`, v.glucose && `glucose ${v.glucose} mg/dL`].filter(Boolean);
    return `${parts.join(", ")} at ${wall(v.at, tz).replace("T", " ")}`;
  }
  return id;
}

/** Regex groups a note that mentions this fact should match (used for mustInclude checks). */
export function evidenceFor(p: Patient, id: string): string[][] {
  const l = p.labs.find((x) => x.id === id);
  if (l) {
    const v = String(l.value).replace(".", "\\.");
    return [[`(?<![\\d.])${v}${String(l.value).includes(".") ? "0*" : "(\\.0+)?"}(?![\\d])`]];
  }
  const m = p.meds.find((x) => x.id === id);
  if (m) {
    const d = drug(m.product);
    const names = [d.ingredient.split(" ").slice(-1)[0], d.ingredient.split(" ")[0], d.brand].filter(Boolean) as string[];
    return [[`\\b(${[...new Set(names)].join("|")})\\b`]];
  }
  const c = p.conditions.find((x) => x.id === id);
  if (c) return [[CONDITION_WORDS[c.coding.find((x) => x.system === "icd10")!.code.slice(0, 3)] ?? c.name.split(" ")[0]]];
  const f = p.narrativeFacts.find((x) => x.id === id);
  if (f) return f.evidence;
  return [];
}

const CONDITION_WORDS: Record<string, string> = {
  I10: "hypertension|HTN|blood pressure|\\bBP\\b", E11: "diabet|DM|A1c|glucose|DKA|ketoacidosis", N18: "kidney|CKD|eGFR|renal",
  E78: "lipid|cholesterol|statin|HLD", F33: "depress|mood|MDD", E66: "weight|obes|BMI", I50: "heart failure|HF|EF\\b|ejection",
  E87: "sodium|potassium|hypona|hyperk|\\bNa\\b|\\bK\\b", K85: "pancrea|lipase", N17: "kidney|AKI|creatinine", M10: "gout|uric",
  M17: "knee|arthritis|OA\\b", E03: "thyroid|TSH|levothyrox", J18: "pneumonia|infiltrate", F41: "anxi", T78: "angioedema|swelling",
  I24: "ACS|coronary|troponin|chest",
};
