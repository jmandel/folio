// Answer keys, computed from the truth only (truth/MODEL.md#answer-keys) as of the evaluation time.
// Each entry carries `sources` (who could know it) and `basis` (the truth ids it came from), so a
// key can be restricted to one source when scoring a mapper.

import { ANALYTES, drug, RAAS_CLASSES } from "./catalog.ts";
import {
  addDays, daysBetween, EVAL_DATE, EVAL_INSTANT, localDate, ms, type Patient, precisionOf, sortKey, type SourceKey, wall, type When,
} from "./model.ts";

const T_MS = ms(EVAL_INSTANT);
const atOrBefore = (w: When, t = T_MS) => sortKey(w) <= t;
const srcs = (v: Partial<Record<SourceKey, unknown>>) => (Object.keys(v) as SourceKey[]).sort();
const onsetOf = (w: When) => ({ value: w.includes("T") ? w.slice(0, 10) : w, precision: precisionOf(w) === "instant" ? "day" : precisionOf(w) });

export function activeMeds(p: Patient, t = T_MS) {
  const out = [];
  for (const m of p.meds) {
    if (m.setting === "inpatient") continue;
    const hist = m.history.filter((h) => atOrBefore(h.at, t));
    if (!hist.length || m.history.some((h) => h.status === "entered-in-error")) continue;
    const last = hist[hist.length - 1];
    // Patient-only entries ("how I take it") do not change the clinical status.
    const clinical = hist.filter((h) => h.by !== "P" || m.otc);
    const status = (clinical[clinical.length - 1] ?? last).status;
    if (status !== "active" && status !== "held") continue;
    let product = m.product, dose = m.dose, doseText = m.doseText, frequency = m.frequency;
    for (const h of hist) {
      if (h.by === "P" && !m.otc) continue;
      if (h.product) product = h.product;
      if (h.dose) dose = h.dose;
      if (h.doseText) doseText = h.doseText;
      if (h.frequency) frequency = h.frequency;
    }
    const d = drug(product);
    const statusEntry = [...clinical].reverse().find((h) => h.status !== clinical[clinical.length - 1].status) ? clinical[clinical.length - 1] : clinical[0];
    out.push({
      medication: d.ingredient, rxnorm_ingredient: d.ingredientRx, product: d.scdName, ...(d.scd ? { rxnorm_product: d.scd } : {}),
      dose: dose ?? null, dose_text: doseText, frequency, status, since: localDate(statusEntry.at),
      ...(m.otc ? { otc: true } : {}), ...(hist.find((h) => h.takenAs) ? { taken_as: [...hist].reverse().find((h) => h.takenAs)!.takenAs } : {}),
      ...(status === "held" && last.intendResume !== undefined ? { intend_resume: last.intendResume } : {}),
      ...(m.sensitive ? { sensitive: m.sensitive } : {}),
      sources: srcs(m.visibility), basis: [m.id],
    });
  }
  return out.sort((a, b) => a.medication.localeCompare(b.medication));
}

export function problems(p: Patient, t = T_MS) {
  const active = [], resolved = [];
  for (const c of p.conditions) {
    const hist = c.history.filter((h) => atOrBefore(h.at, t));
    if (!hist.length) continue;
    const last = hist[hist.length - 1];
    if (last.status === "ruled-out" || last.status === "working") continue;
    const staged = [...hist].reverse().find((h) => h.stage);
    const icd = [...hist].reverse().find((h) => h.icd10 && h.status !== "resolved")?.icd10 ?? c.coding.find((x) => x.system === "icd10")!.code;
    const entry = {
      condition: c.name, icd10: last.status === "resolved" ? c.coding.find((x) => x.system === "icd10")!.code : icd,
      snomed: c.coding.find((x) => x.system === "snomed")?.code, onset: onsetOf(c.onset),
      ...(staged ? { stage: staged.stage, stage_recorded_by: staged.recordedBy, stage_recorded_on: localDate(staged.at) } : {}),
      ...(c.sensitive ? { sensitive: c.sensitive } : {}), sources: srcs(c.visibility), basis: [c.id],
    };
    if (last.status === "active") active.push(entry);
    else resolved.push({ ...entry, resolved_on: localDate(last.at) });
  }
  return { active, resolved };
}

export function allergies(p: Patient) {
  return p.allergies.map((a) => ({
    substance: a.substance.display, rxnorm_ingredient: a.substance.code, type: a.type, reaction: a.reaction, criticality: a.criticality,
    onset: onsetOf(a.onset), ...(a.negatedFindings ? { negated_findings: a.negatedFindings } : {}), sources: srcs(a.visibility), basis: [a.id],
  }));
}

function labEntry(p: Patient, l: Patient["labs"][number]) {
  const draw = p.draws.find((d) => d.id === l.draw)!;
  return {
    analyte: l.analyte, value: l.value, ...(l.comparator ? { comparator: l.comparator } : {}), unit: l.unit, loinc: ANALYTES[l.analyte].loinc ?? null,
    collected: l.collectedAt, collected_local_date: localDate(l.collectedAt, p.demographics.tz), setting: draw.setting,
    ...(l.analyte === "egfr" ? { equation: "ckd-epi-2021", reported: l.reported } : {}),
    ...(l.confirms ? { confirms: l.confirms } : {}),
    sources: [l.performedBy, ...(l.copies ?? [])].sort(), basis: [l.id],
  };
}

export function labSeries(p: Patient, t = T_MS) {
  const out: Record<string, ReturnType<typeof labEntry>[]> = {};
  for (const l of [...p.labs].sort((a, b) => ms(a.collectedAt) - ms(b.collectedAt))) {
    if (l.status !== "final" || ms(l.collectedAt) > t) continue;
    (out[l.analyte] ??= []).push(labEntry(p, l));
  }
  return out;
}

export function latestLabs(p: Patient, t = T_MS) {
  const series = labSeries(p, t);
  return Object.fromEntries(Object.entries(series).map(([a, s]) => [a, s[s.length - 1]]));
}

export function vitalsSeries(p: Patient, t = T_MS) {
  const tz = p.demographics.tz;
  const clinic = [], hospital = [], home_bp = [], home_glucose = [];
  for (const v of [...p.vitals].sort((a, b) => ms(a.at) - ms(b.at))) {
    if (ms(v.at) > t || v.duplicateOf) continue;
    const base = { local_time: wall(v.at, tz), sources: [v.source], basis: [v.id] };
    if (v.kind === "home-glucose") home_glucose.push({ ...base, glucose_mg_dl: v.glucose, ...(v.mealMarker ? { meal: v.mealMarker } : {}) });
    else if (v.setting === "home") home_bp.push({ ...base, systolic: v.bp!.systolic, diastolic: v.bp!.diastolic, ...(v.pulse ? { pulse: v.pulse } : {}) });
    else {
      const e = { ...base, ...(v.bp ? { systolic: v.bp.systolic, diastolic: v.bp.diastolic } : {}), ...(v.bpRepeat ? { repeat: v.bpRepeat } : {}), ...(v.pulse ? { pulse: v.pulse } : {}), ...(v.weightKg ? { weight_kg: v.weightKg } : {}) };
      (v.setting === "hospital" ? hospital : clinic).push(e);
    }
  }
  return { clinic, hospital, home_bp, home_glucose };
}

export function encounters(p: Patient) {
  return [...p.encounters].sort((a, b) => ms(a.start) - ms(b.start)).map((e) => ({
    local_date: localDate(e.start, p.demographics.tz), kind: e.kind, reason: e.reason, source: e.source, basis: [e.id],
  }));
}

export function patientKeys(p: Patient) {
  return {
    "active-meds": activeMeds(p), problems: problems(p), allergies: allergies(p), "latest-labs": latestLabs(p),
    "lab-series": labSeries(p), vitals: vitalsSeries(p), encounters: encounters(p),
  };
}

// ─── Cohorts ────────────────────────────────────────────────────────────────────────────────────

export interface CohortMember { patient: string; basis: string[]; note?: string }
export interface Cohort { id: string; title: string; definition: string; traps: string[]; members: CohortMember[] }

const klass = (p: Patient, medId: string) => drug(p.meds.find((m) => m.id === medId)!.product).klass;
function statusAt(p: Patient, medId: string, t: number): string | undefined {
  const m = p.meds.find((x) => x.id === medId)!;
  let s: string | undefined;
  for (const h of m.history) if (sortKey(h.at) <= t) s = h.status;
  return s;
}
const isDka = (c: Patient["conditions"][number]) => c.coding.some((x) => x.code === "E11.10") && !c.history.some((h) => h.status === "ruled-out");

function slope(points: { x: number; y: number }[]): number {
  const n = points.length;
  const mx = points.reduce((a, p) => a + p.x, 0) / n, my = points.reduce((a, p) => a + p.y, 0) / n;
  const num = points.reduce((a, p) => a + (p.x - mx) * (p.y - my), 0), den = points.reduce((a, p) => a + (p.x - mx) ** 2, 0);
  return den ? num / den : 0;
}

export function cohorts(ps: Patient[]): Cohort[] {
  const c1: CohortMember[] = [], c2: CohortMember[] = [], c3: CohortMember[] = [], c4: CohortMember[] = [], c5: CohortMember[] = [], c6: CohortMember[] = [];
  const twoYearsAgo = addDays(EVAL_DATE, -730);
  for (const p of ps) {
    const draws = new Map(p.draws.map((d) => [d.id, d]));
    const outpatient = (l: Patient["labs"][number]) => draws.get(l.draw)!.setting === "outpatient";
    const egfrs = p.labs.filter((l) => l.analyte === "egfr" && l.status === "final" && ms(l.collectedAt) <= T_MS).sort((a, b) => ms(a.collectedAt) - ms(b.collectedAt));
    const out = egfrs.filter(outpatient);
    // 1. CKD progression on an SGLT2i, no DKA history. Inpatient and ED eGFRs are excluded (acute illness).
    const stage3 = out.filter((l) => l.value >= 30 && l.value <= 59);
    const spaced = stage3.length >= 2 && daysBetween(stage3[0].collectedAt, stage3[stage3.length - 1].collectedAt) >= 90;
    const recent = out.filter((l) => localDate(l.collectedAt) >= twoYearsAgo);
    const span = recent.length >= 3 ? daysBetween(recent[0].collectedAt, recent[recent.length - 1].collectedAt) : 0;
    const s = span >= 365 ? slope(recent.map((l) => ({ x: ms(l.collectedAt) / (365.25 * 86400000), y: l.value }))) : 0;
    const sglt2 = p.meds.filter((m) => m.setting !== "inpatient" && drug(m.product).klass === "sglt2i" && statusAt(p, m.id, T_MS) === "active" && !m.history.some((h) => h.status === "entered-in-error"));
    const dka = p.conditions.filter(isDka);
    if (spaced && s < -5 && sglt2.length && !dka.length) c1.push({ patient: p.id, basis: [...stage3.slice(0, 2).map((l) => l.id), ...recent.map((l) => l.id), ...sglt2.map((m) => m.id)], note: `outpatient eGFR slope ${s.toFixed(1)} /yr over ${recent.length} values` });

    // 2. SGLT2i-associated DKA with a documented precipitant.
    for (const d of dka) {
      const onset = sortKey(d.history[0]?.at ?? d.onset);
      const onSglt2 = p.meds.filter((m) => drug(m.product).klass === "sglt2i" && statusAt(p, m.id, onset - 60000) === "active");
      const prec = p.narrativeFacts.filter((f) => f.kind === "precipitant" && f.polarity === "affirmed" && f.about?.includes(d.id));
      if (onSglt2.length && prec.length) c2.push({ patient: p.id, basis: [d.id, ...onSglt2.map((m) => m.id), ...prec.map((f) => f.id)] });
    }

    // 3. Confirmed hyperkalemia on RAAS or MRA therapy (active or held within 30 days).
    const ks = p.labs.filter((l) => l.analyte === "potassium" && l.status === "final" && l.value >= 5.5 && ms(l.collectedAt) <= T_MS);
    const hits: string[] = [];
    for (const k of ks) {
      const t = ms(k.collectedAt);
      const raas = p.meds.filter((m) => m.setting !== "inpatient" && RAAS_CLASSES.includes(drug(m.product).klass) && !m.history.some((h) => h.status === "entered-in-error") &&
        [0, 30].some((days) => ["active", "held"].includes(statusAt(p, m.id, t - days * 86400000) ?? "")));
      if (raas.length) hits.push(k.id, ...raas.map((m) => m.id));
    }
    if (hits.length) c3.push({ patient: p.id, basis: [...new Set(hits)] });

    // 4. Uncontrolled diabetes on basal insulin with eGFR < 45.
    const a1cs = p.labs.filter((l) => l.analyte === "a1c" && l.status === "final" && ms(l.collectedAt) <= T_MS).sort((a, b) => ms(a.collectedAt) - ms(b.collectedAt));
    const lastA1c = a1cs[a1cs.length - 1];
    const basal = p.meds.filter((m) => m.setting !== "inpatient" && klass(p, m.id) === "basal-insulin" && statusAt(p, m.id, T_MS) === "active" && !m.history.some((h) => h.status === "entered-in-error"));
    const lastEgfr = egfrs[egfrs.length - 1];
    if (lastA1c && lastA1c.value >= 8 && daysBetween(lastA1c.collectedAt, EVAL_DATE) <= 365 && basal.length && lastEgfr && lastEgfr.value < 45)
      c4.push({ patient: p.id, basis: [lastA1c.id, ...basal.map((m) => m.id), lastEgfr.id] });

    // 5. Masked hypertension: home mean systolic >= 135 over the last 30 days, last two office systolics < 130.
    const since = T_MS - 30 * 86400000;
    const home = p.vitals.filter((v) => v.kind === "bp" && v.setting === "home" && !v.duplicateOf && ms(v.at) >= since && ms(v.at) <= T_MS);
    const office = p.vitals.filter((v) => v.setting === "clinic" && v.bp && ms(v.at) <= T_MS).sort((a, b) => ms(a.at) - ms(b.at)).slice(-2);
    if (home.length >= 4 && office.length === 2) {
      const mean = home.reduce((a, v) => a + v.bp!.systolic, 0) / home.length;
      if (mean >= 135 && office.every((v) => v.bp!.systolic < 130)) c5.push({ patient: p.id, basis: [...home.map((v) => v.id), ...office.map((v) => v.id)], note: `home mean ${mean.toFixed(0)} (${home.length} readings)` });
    }

    // 6. ACE-inhibitor angioedema (a negated "no angioedema" does not count).
    for (const a of p.allergies) {
      const isAcei = p.meds.some((m) => m.rxnorm?.code === a.substance.code && drug(m.product).klass === "acei");
      if (isAcei && /angioedema/i.test(a.reaction) && !(a.negatedFindings ?? []).some((x) => /angioedema/i.test(x))) c6.push({ patient: p.id, basis: [a.id] });
    }
  }
  const sort = (xs: CohortMember[]) => xs.sort((a, b) => a.patient.localeCompare(b.patient));
  return [
    { id: "1-ckd-progression-on-sglt2i", title: "CKD progression on an SGLT2 inhibitor, no DKA history", traps: ["T1", "T9", "T11", "T12", "T16"],
      definition: "Two outpatient eGFRs 30-59 at least 90 days apart; least-squares slope of outpatient eGFR (CKD-EPI 2021, recomputed from creatinine) over the last two years below -5 mL/min/1.73m2 per year, from at least 3 values spanning at least a year; an SGLT2 inhibitor active (not held, not stopped) at the evaluation date; no DKA ever. Inpatient and ED eGFRs are excluded from both the staging and the slope: they reflect acute illness.",
      members: sort(c1) },
    { id: "2-sglt2i-dka-with-precipitant", title: "SGLT2i-associated DKA with a documented precipitant", traps: ["T13", "T18", "T15"],
      definition: "A DKA diagnosis (not ruled out) whose onset fell while an SGLT2 inhibitor was active, where some source's narrative states what precipitated it (illness, surgery, fasting, alcohol). A note saying no precipitant was found does not count.",
      members: sort(c2) },
    { id: "3-confirmed-hyperkalemia-on-raas", title: "Confirmed hyperkalemia on RAAS or MRA therapy", traps: ["T2", "T3", "T4", "T1"],
      definition: "A final potassium >= 5.5 mmol/L (not withdrawn by the lab, not entered in error) collected while an ACE inhibitor, ARB, MRA or finerenone was active or held, or had been active or held 30 days earlier. A same-day confirmation repeat counts; a hemolyzed value replaced by a redraw does not.",
      members: sort(c3) },
    { id: "4-uncontrolled-diabetes-insulin-ckd", title: "Uncontrolled diabetes on basal insulin with eGFR < 45", traps: ["T4", "T9", "T11", "T14"],
      definition: "Most recent A1c within 12 months of the evaluation date is >= 8.0%; basal insulin active at the evaluation date; most recent eGFR (any setting) < 45.",
      members: sort(c4) },
    { id: "5-masked-hypertension", title: "Masked hypertension", traps: ["T10", "T14"],
      definition: "At least 4 home BP readings in the 30 days before the evaluation date with mean systolic >= 135 (typed duplicates excluded, corrected values used); the last two office systolic readings (primary care or nephrology clinic; hospital readings excluded) both < 130.",
      members: sort(c5) },
    { id: "6-ace-inhibitor-angioedema", title: "ACE-inhibitor angioedema", traps: ["T12"],
      definition: "An allergy record of angioedema caused by an ACE inhibitor. A recorded negation (\"no lip, tongue or throat swelling\") does not count.",
      members: sort(c6) },
  ];
}

export { EVAL_DATE };
