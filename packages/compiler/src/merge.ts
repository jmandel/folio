// The consumer's merge: combines one patient's view rows from several sources into one chart. Generic
// and source-agnostic: it knows the views, not the sources. Rules, in order of use:
//
// - Each row's "evidence date" is the latest `effective` date among the items it cites.
// - Medications, grouped by ingredient (or drug name when the ingredient is unknown): status, status
//   date and reason come from the most recently dated clinician-recorded row (later of evidence date
//   and status_since), else from the patient's own list; 'unknown' only if nothing else is known.
//   Dose and frequency come from the most recently dated clinician-recorded row that has a dose,
//   else from a patient-reported row.
// - Problems, grouped by condition (ICD-10 family, else wording): active if any source says active;
//   CKD stage from the most recently dated row that records one; onset from the most precise row.
// - Allergies, grouped by substance: type and reaction from the most recently dated row; criticality
//   'high' if any row says high.
// - Labs: one row per analyte, collection minute and value (copies of one result across sources).
// - Vitals: one row per setting, reading time (within 2 minutes) and values.

import { family } from "./keys.ts";

type Row = Record<string, any>;
export interface Rows { medications: Row[]; problems: Row[]; allergies: Row[]; labs: Row[]; vitals: Row[] }
export interface SourceRows { source: string; rows: Partial<Rows>; items: { id: string; effective: string }[] }

const day = (s: string | undefined) => (s ? s.slice(0, 10) : "");
const norm = (s: unknown) => String(s ?? "").toLowerCase().replace(/\s+/g, " ").trim();

function withDates(src: SourceRows, view: keyof Rows): Row[] {
  const eff = new Map(src.items.map((i) => [i.id, i.effective]));
  return (Array.isArray(src.rows[view]) ? src.rows[view]! : []).filter((r) => r && typeof r === "object").map((r) => ({
    ...r, _source: src.source,
    _date: (Array.isArray(r.evidence) ? r.evidence : []).map((e: any) => day(eff.get(e?.item_id))).sort().pop() ?? "",
  }));
}

function groupBy<T>(xs: T[], key: (x: T) => string): T[][] {
  const m = new Map<string, T[]>();
  for (const x of xs) { const k = key(x); if (!m.has(k)) m.set(k, []); m.get(k)!.push(x); }
  return [...m.values()];
}
const latest = (rs: Row[], date: (r: Row) => string) => [...rs].sort((a, b) => date(b).localeCompare(date(a)))[0];
const evidenceOf = (rs: Row[]) => rs.flatMap((r) => (r.evidence ?? []).map((e: any) => ({ ...e, source: r._source })));
const clean = (r: Row) => Object.fromEntries(Object.entries(r).filter(([k]) => !k.startsWith("_")));

export function mergeRows(sources: SourceRows[]): Rows {
  const all = (v: keyof Rows) => sources.flatMap((s) => withDates(s, v));

  const medications = groupBy(all("medications"), (r) => norm(r.ingredient) || `name:${norm(r.drug_name)}`).map((g) => {
    const known = g.filter((r) => r.status !== "unknown");
    const pool = known.length ? known : g;
    const clinical = pool.filter((r) => !r.patient_reported);
    const when = (r: Row) => [r._date, r.status_since ?? ""].sort().pop()!;
    const st = latest(clinical.length ? clinical : pool, when);
    const dosed = g.filter((r) => r.dose);
    const doseRow = latest(dosed.filter((r) => !r.patient_reported), when) ?? latest(dosed, when);
    return clean({
      ...st, dose: doseRow?.dose, frequency: doseRow?.frequency ?? st.frequency,
      patient_reported: g.every((r) => r.patient_reported), otc: g.some((r) => r.otc) || undefined, evidence: evidenceOf(g),
    });
  });

  const problems = groupBy(all("problems"), (r) => family(r.icd10cm, r.condition)).map((g) => {
    const staged = latest(g.filter((r) => r.ckd_stage), (r) => r._date);
    const prec = { day: 3, month: 2, year: 1 } as Record<string, number>;
    const onset = [...g].filter((r) => r.onset).sort((a, b) => (prec[b.onset.precision] ?? 0) - (prec[a.onset.precision] ?? 0))[0]?.onset;
    const base = latest(g, (r) => r._date);
    return clean({ ...base, status: g.some((r) => r.status === "active") ? "active" : "resolved", ckd_stage: staged?.ckd_stage, albuminuria: staged?.albuminuria, onset, evidence: evidenceOf(g) });
  });

  const allergies = groupBy(all("allergies"), (r) => norm(r.substance)).map((g) => {
    const base = latest(g, (r) => r._date);
    return clean({ ...base, criticality: g.some((r) => r.criticality === "high") ? "high" : base.criticality, evidence: evidenceOf(g) });
  });

  const labs = groupBy(all("labs"), (r) => `${r.analyte}|${Math.floor(Date.parse(r.collected) / 60000)}|${Number(r.value).toPrecision(3)}|${r.comparator ?? ""}`)
    .map((g) => clean({ ...(g.find((r) => r.status === "final") ?? g[0]), evidence: evidenceOf(g) }));

  const vitals: Row[] = [];
  for (const r of all("vitals").sort((a, b) => String(a.local_time).localeCompare(String(b.local_time)))) {
    const t = Date.parse(String(r.local_time) + "Z");
    const dup = vitals.find((v) => v.setting === r.setting && Math.abs(Date.parse(String(v.local_time) + "Z") - t) <= 120000
      && v.systolic_mmhg === r.systolic_mmhg && v.glucose_mg_dl === r.glucose_mg_dl);
    if (dup) dup.evidence = [...dup.evidence, ...evidenceOf([r])];
    else vitals.push(clean({ ...r, evidence: evidenceOf([r]) }));
  }

  return { medications, problems, allergies, labs, vitals };
}
