// Plain-language descriptions of truth facts, for note requests (what a note must cover).

import { ANALYTES, drug, FREQ_TEXT } from "../../truth/src/catalog.ts";
import { inZone, localDate, type Patient, sortKey, type When, wall } from "../../truth/src/model.ts";

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
    const t = when ? Date.parse(when) : Infinity;
    const d = medDoseAt(p, id, when ?? "2100-01-01T00:00:00Z");
    const name = m.orderName ?? d.drug.ingredient;
    const hist = m.history.filter((h) => !h.at.includes("T") || Date.parse(h.at) <= t);
    const last = hist[hist.length - 1];
    const sameDay = last && when && last.at.includes("T") && localDate(last.at, tz) === localDate(when, tz);
    const base = `${name} ${d.doseText} ${FREQ_TEXT[d.frequency]}${m.otc ? " (over the counter)" : ""}`;
    if (!last) return base;
    if (sameDay) {
      const prev = hist[hist.length - 2];
      const verb = last.status === "held" ? "held" : last.status === "stopped" ? "stopped" : last.status === "entered-in-error" ? "entered in error"
        : !prev ? "started" : prev.status === "held" ? "resumed" : last.dose || last.product ? "dose changed to" : "continued";
      return `${name}: ${verb}${verb === "dose changed to" || verb === "started" ? ` ${d.doseText} ${FREQ_TEXT[d.frequency]}` : ""} today${last.reason ? ` (${last.reason})` : ""}${last.reviewOn ? `; review ${last.reviewOn}` : ""}`;
    }
    return last.status === "active" ? base : `${base}, ${last.status}${last.reason ? ` (${last.reason})` : ""}`;
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

const SHORT: Record<string, string> = {
  creatinine: "Cr", egfr: "eGFR", potassium: "K", sodium: "Na", chloride: "Cl", bicarbonate: "bicarbonate", "anion-gap": "anion gap", bun: "BUN",
  glucose: "glucose", a1c: "A1c", uacr: "UACR", platelets: "platelets", wbc: "WBC", hemoglobin: "Hgb", bhb: "beta-hydroxybutyrate", ph: "venous pH",
  pco2: "pCO2", lipase: "lipase", troponin: "troponin I",
};
const UNIT: Record<string, string> = { a1c: "%", uacr: " mg/g", creatinine: "", egfr: "", potassium: "", sodium: "", glucose: "", platelets: "K", wbc: "K" };

/** How a clinician of this source would refer to a fact in a note (short, no machine timestamps). */
export function human(p: Patient, id: string, when: string, src: "A" | "B" | "C" | "P"): string {
  const tz = p.demographics.tz;
  const md = (w: string) => { const d = localDate(w, tz); return `${+d.slice(5, 7)}/${+d.slice(8, 10)}${d.slice(0, 4) !== localDate(when, tz).slice(0, 4) ? "/" + d.slice(2, 4) : ""}`; };
  const l = p.labs.find((x) => x.id === id);
  if (l) {
    const v = `${l.comparator ?? ""}${l.value}${UNIT[l.analyte] ?? ` ${l.unit}`}`;
    const same = localDate(l.collectedAt, tz) === localDate(when, tz);
    return `${SHORT[l.analyte] ?? l.analyte} ${v}${same ? (src === "A" ? ` (drawn ${inZone(l.collectedAt, tz).slice(11, 16)})` : " (today)") : ` (${md(l.collectedAt)})`}${l.annotations?.includes("hemolyzed") ? ", hemolyzed" : ""}`;
  }
  const v = p.vitals.find((x) => x.id === id);
  if (v) {
    const parts = [v.bp && `BP ${v.bp.systolic}/${v.bp.diastolic}`, v.bpRepeat && `repeat ${v.bpRepeat.systolic}/${v.bpRepeat.diastolic}`, v.pulse && `pulse ${v.pulse}`,
      v.weightKg && (src === "B" ? `wt ${Math.round(v.weightKg / 0.45359237)} lb` : `wt ${v.weightKg} kg`)].filter(Boolean);
    return parts.join(", ");
  }
  const c = p.conditions.find((x) => x.id === id);
  if (c) {
    const st = [...c.history].reverse().find((h) => h.stage && sortKey(h.at) <= Date.parse(when))?.stage;
    return `${c.name}${st ? ` stage ${st}` : ""}`;
  }
  const a = p.allergies.find((x) => x.id === id);
  if (a) return `${a.substance.display} ${a.type === "adverse-reaction" ? "adverse reaction" : a.type}: ${a.reaction}`;
  const f = p.narrativeFacts.find((x) => x.id === id);
  if (f) return f.statement;
  return describe(p, id, when);
}
