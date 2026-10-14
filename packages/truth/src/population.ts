// Seeded population generator. Each patient is simulated chronologically: primary-care visits with
// labs and treat-to-target medication changes, plus planted events ("archetypes") assigned by exact
// quotas so trap and cohort rates are controlled. Every random draw comes from a stream named after
// the patient, so the population is reproducible from the seed alone.

import { CONDITIONS, conditionCoding, drug, DRUGS, type DrugClass, ingredientCoding } from "./catalog.ts";
import { finalize, type LabIn } from "./finalize.ts";
import { deriveTraps } from "./hero.ts";
import {
  addDays, addMinutes, ageOn, at, ckdEpi2021, sortKey, type Condition, type DocItem, EVAL_DATE, type Encounter, type EncounterDocument,
  type HomeLogPlan, type LabDraw, localDate, type MedHistoryEntry, type Medication, ms, type MyMedPlan, type NarrativeFact,
  type Patient, type SourceKey, type Vital,
} from "./model.ts";
import type { TrapId } from "./model.ts";
import { FAMILY, GIVEN_F, GIVEN_M } from "./names.ts";
import { Rng } from "./rng.ts";
import { plausibility } from "./plausibility.ts";

export type Archetype =
  | "ckd_prog_sglt2" | "ckd_prog_sglt2_held" | "ckd_inpatient_dip" | "dka_prec" | "dka_noprec" | "hyperk_conf" | "hyperk_hem"
  | "insulin_ckd" | "masked_htn" | "acei_angio" | "acei_cough" | "med_error" | "dup_lab" | "meter_mmol" | "mdd" | "hf"
  | "b_hold" | "sick_day" | "nonadherence" | "otc_nsaid" | "chest_pain" | "pneumonia" | "aki_hyperk" | "early_labs" | "typed_dup";

/** Exact counts per archetype in a 295-patient population (scaled for other sizes). */
export const QUOTAS: Record<Archetype, number> = {
  ckd_prog_sglt2: 14, ckd_prog_sglt2_held: 6, ckd_inpatient_dip: 5, dka_prec: 9, dka_noprec: 4, hyperk_conf: 24, hyperk_hem: 32,
  insulin_ckd: 14, masked_htn: 14, acei_angio: 6, acei_cough: 32, med_error: 32, dup_lab: 32, meter_mmol: 26, mdd: 42, hf: 18,
  b_hold: 30, sick_day: 16, nonadherence: 14, otc_nsaid: 22, chest_pain: 12, pneumonia: 10, aki_hyperk: 8, early_labs: 70, typed_dup: 20,
};

export interface PatientSpec {
  id: string;
  role: Patient["role"];
  seed: string;
  arche: Archetype[];
  sex?: "F" | "M"; birthDate?: string; race?: string; given?: string; family?: string;
  sources?: SourceKey[];                       // forced members
  bStart?: string;
}

const T = EVAL_DATE;
const TZ = "America/Chicago";
const yrs = (a: string, b: string) => (Date.parse(b.slice(0, 10)) - Date.parse(a.slice(0, 10))) / (365.25 * 86400000);
const r1 = (x: number) => Math.round(x * 10) / 10;
const r2 = (x: number) => Math.round(x * 100) / 100;

function creatFor(egfr: number, age: number, sex: "F" | "M"): number {
  let lo = 0.3, hi = 12;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (ckdEpi2021(mid, age, sex) > egfr) lo = mid; else hi = mid;
  }
  return r2((lo + hi) / 2);
}

function weekday(date: string, rng: Rng): string {
  let d = date;
  while ([0, 6].includes(new Date(d + "T12:00:00Z").getUTCDay())) d = addDays(d, rng.chance(0.5) ? 1 : 2);
  return d;
}

const hhmm = (h: number, m: number) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

interface Draw { draw: LabDraw; labs: LabIn[] }

class Gen {
  readonly rng: Rng;
  readonly has: Set<Archetype>;
  readonly id: string;
  sex: "F" | "M" = "F";
  birth = "1960-01-01";
  race = "White";
  given = ""; family = "";
  sources = new Set<SourceKey>();
  bStart = "2019-06-01";
  pcp = "ngf:treyes";
  conditions: Condition[] = [];
  meds: Medication[] = [];
  draws: LabDraw[] = [];
  labs: LabIn[] = [];
  vitals: Vital[] = [];
  allergies: Patient["allergies"] = [];
  facts: NarrativeFact[] = [];
  encounters: Encounter[] = [];
  referrals: NonNullable<Patient["referrals"]> = [];
  home: HomeLogPlan = { notes: [], doses: [], listSaves: [], edits: [] };
  sensitive: string[] = [];
  n = 0;
  // Clinical state
  dm = false; htn = false; ckd = false; hld = false; hf = false; mdd = false; oa = false; obesity = false; hypothyroid = false;
  eT = 80; rateRecent = 1; rateOld = 1; uacr0 = 12; uacrGrowth = 1.05;
  a1c = 7; sbp0 = 136; aceiAvoid = false; aceiStopFrom?: string; dkaHistory = false; nephStart?: string; nephDoc = "lv:marsh";
  maskedFrom?: string;
  lastA1cBump = "1900-01-01";
  neph = false;

  constructor(readonly spec: PatientSpec) {
    this.rng = new Rng(spec.seed);
    this.has = new Set(spec.arche);
    this.id = spec.id;
  }

  uid(prefix: string) { return `${prefix}_${++this.n}`; }

  // ─── trajectories ──────────────────────────────────────────────────────────────────────────
  egfr(date: string): number {
    const back = yrs(date, T);
    const e = this.eT + this.rateRecent * Math.min(back, 2.5) + this.rateOld * Math.max(0, back - 2.5);
    const sd = this.has.has("ckd_prog_sglt2") || this.has.has("ckd_prog_sglt2_held") ? 0.7 : 1.4;
    return Math.min(115, Math.max(8, e + this.rng.fork(`egfr/${date}`).normal(0, sd)));
  }
  age(date: string) { return ageOn(this.birth, date); }
  creat(date: string, factor = 1) { return r2(creatFor(this.egfr(date), this.age(date), this.sex) * factor); }
  uacr(date: string) { return Math.max(3, Math.round(this.uacr0 * this.uacrGrowth ** (yrs(this.bStart, date)) * Math.exp(this.rng.fork(`uacr/${date}`).normal(0, 0.15)))); }
  potassium(date: string) {
    const raas = this.activeClass(date, ["acei", "arb"]).length ? 0.25 : 0;
    const mra = this.activeClass(date, ["mra", "ns-mra"]).length ? 0.3 : 0;
    const k = 4.15 + raas + mra + 0.012 * Math.max(0, 60 - this.egfr(date)) + this.rng.fork(`k/${date}`).normal(0, 0.22);
    return r1(Math.min(5.3, Math.max(3.5, k)));
  }

  // ─── meds ──────────────────────────────────────────────────────────────────────────────────
  status(m: Medication, when: string): string | undefined {
    const t = ms(when.includes("T") ? when : when + "T23:59:00-05:00");
    // A planned ACE-inhibitor angioedema stops every ACE inhibitor from that date, for all later simulation steps
    // (the ED visit itself is written later in the run, back-dated).
    if (this.aceiStopFrom && drug(m.product).klass === "acei" && t > ms(addDays(this.aceiStopFrom, 3) + "T23:59:59-05:00")) return "stopped";
    let s: string | undefined, best = -Infinity;
    for (const h of m.history) { const k = sortKey(h.at); if (k <= t && k >= best) { best = k; s = h.status; } }
    return s;
  }
  activeClass(when: string, klass: DrugClass[], statuses = ["active"]): Medication[] {
    return this.meds.filter((m) => m.setting !== "inpatient" && klass.includes(drug(m.product).klass) && statuses.includes(this.status(m, when) ?? ""));
  }
  currentProduct(m: Medication, when: string): string {
    let prod = m.product;
    for (const h of m.history) if (h.product && (!h.at.includes("T") || ms(h.at) <= ms(when))) prod = h.product;
    return prod;
  }
  startMed(product: string, at0: string, by: SourceKey, opts: { dose?: number; freq?: Medication["frequency"]; reason?: string; vis?: SourceKey[]; sensitive?: boolean; otc?: boolean } = {}): Medication {
    const d = drug(product);
    const doseVal = opts.dose ?? (d.form === "pen" && d.unit === "units/mL" ? 10 : d.strength);
    const unit = d.unit === "units/mL" ? "units" : d.unit === "mcg" ? "mcg" : "mg";
    const m: Medication = {
      id: this.uid("m"), product, rxnorm: ingredientCoding(product), doseText: `${doseVal} ${unit}`, dose: { value: doseVal, unit },
      frequency: opts.freq ?? (d.klass === "biguanide" ? "BID" : d.klass === "basal-insulin" || d.klass === "statin" ? "QHS" : d.klass === "glp1ra" ? "QW" : "QD"),
      history: [{ at: at0, status: "active", by, ...(opts.reason ? { reason: opts.reason } : {}) }],
      visibility: Object.fromEntries((opts.vis ?? ["B", "P"]).map((s) => [s, "structured"])) as Medication["visibility"],
      ...(opts.otc ? { otc: true } : {}), ...(opts.sensitive ? { sensitive: "behavioral-health" as const } : {}), prescriber: by === "P" ? undefined : by,
    };
    if (by === "B" || (m.visibility.B && by !== "C")) m.visibility.B = "both";
    this.meds.push(m);
    if (opts.sensitive) this.sensitive.push(m.id);
    return m;
  }
  change(m: Medication, at0: string, by: SourceKey, e: Partial<MedHistoryEntry>) {
    m.history.push({ at: at0, status: "active", by, ...e });
    m.visibility[by] = by === "A" ? "both" : m.visibility[by] ?? "both";
  }
  set(m: Medication, at0: string, by: SourceKey, status: MedHistoryEntry["status"], e: Partial<MedHistoryEntry> = {}) {
    m.history.push({ at: at0, status, by, ...e });
    if (!m.visibility[by]) m.visibility[by] = by === "A" ? "both" : "both";
  }

  // ─── conditions ────────────────────────────────────────────────────────────────────────────
  cond(key: string, onset: string, recordedAt: string | undefined, by: SourceKey = "B", extra: Partial<Condition> = {}): Condition {
    const c: Condition = {
      id: this.uid("c"), name: CONDITIONS[key].name, coding: conditionCoding(key), onset,
      history: recordedAt ? [{ at: recordedAt, status: "active", recordedBy: by }] : [], visibility: recordedAt ? { [by]: "both" } : {}, ...extra,
    };
    this.conditions.push(c);
    return c;
  }
  condByKey(key: string) { return this.conditions.find((c) => c.coding.some((x) => x.code === CONDITIONS[key].icd10) && !c.history.some((h) => h.status === "ruled-out")); }

  // ─── labs ──────────────────────────────────────────────────────────────────────────────────
  drawC(at0: string, orderedBy: SourceKey | "outside", clinician: string | undefined, values: Partial<Record<LabIn["analyte"], number>>, opts: { fasting?: "Y" | "N" | "U" } = {}): Draw {
    const id = this.uid("d");
    const r = this.rng.fork(`draw/${id}`);
    const draw: LabDraw = { id, collectedAt: at0, receivedAt: addMinutes(at0, 30 + r.int(0, 70)), fasting: opts.fasting ?? r.pick(["Y", "N", "U"]), orderedBy, orderingClinician: clinician, performedBy: "C", setting: "outpatient" };
    this.draws.push(draw);
    const labs: LabIn[] = [];
    const base = addMinutes(at0, 95 + r.int(0, 80));
    for (const [analyte, value] of Object.entries(values) as [LabIn["analyte"], number][]) {
      const resultedAt = analyte === "uacr" ? addMinutes(base, 200 + r.int(0, 120)) : analyte === "a1c" ? addMinutes(base, 60 + r.int(0, 60)) : ["wbc", "hemoglobin", "platelets"].includes(analyte) ? addMinutes(base, -40) : base;
      const l: LabIn = { id: this.uid("l"), analyte, draw: id, value, resultedAt, visibility: {} };
      labs.push(l);
      this.labs.push(l);
    }
    const ldl = labs.find((l) => l.analyte === "ldl");
    if (ldl) ldl.derivedFrom = labs.filter((l) => ["cholesterol", "hdl", "triglycerides"].includes(l.analyte)).map((l) => l.id);
    return { draw, labs };
  }
  /** Lipid panel values; LDL is calculated (Friedewald) from the others, as the lab does. */
  lipids(date: string) {
    const r = this.rng.fork(`lipid/${date}`);
    const statin = this.activeClass(date, ["statin"]).length > 0;
    const hdl = Math.round(Math.max(28, r.normal(this.sex === "F" ? 54 : 44, 9)));
    const tg = Math.round(Math.min(380, Math.max(55, r.normal(this.dm ? 170 : 135, 45))));
    const ldl = Math.round(Math.max(40, r.normal(statin ? 88 : 132, statin ? 20 : 26)));
    const chol = Math.round(ldl + hdl + tg / 5);
    return { cholesterol: chol, triglycerides: tg, hdl, ldl: Math.round(chol - hdl - tg / 5) };
  }
  lastLipid = "1900-01-01";
  routineValues(date: string, opts: { k?: boolean; a1c?: boolean; uacr?: boolean; cbc?: boolean; na?: boolean; glu?: boolean; lipid?: boolean } = {}) {
    const v: Partial<Record<LabIn["analyte"], number>> = { creatinine: this.creat(date) };
    if (opts.na) v.sodium = Math.round(this.rng.fork(`na/${date}`).normal(this.activeClass(date, ["thiazide"]).length ? 135 : 139, 2));
    if (opts.k ?? true) v.potassium = this.potassium(date);
    if (opts.glu) v.glucose = Math.round(this.rng.fork(`glu/${date}`).normal(this.dm ? 150 : 96, 12));
    if (opts.uacr) v.uacr = this.uacr(date);
    if (opts.a1c) v.a1c = r1(this.a1c);
    if (opts.cbc) {
      const r = this.rng.fork(`cbc/${date}`);
      v.wbc = r1(r.normal(7, 1.4)); v.hemoglobin = r1(r.normal(this.sex === "F" ? 12.8 : 14.2, 0.9) - (this.eT < 40 ? 1.2 : 0)); v.platelets = Math.round(r.normal(245, 45));
    }
    if (opts.lipid) { Object.assign(v, this.lipids(date)); this.lastLipid = date; }
    return v;
  }

  // ─── visits ────────────────────────────────────────────────────────────────────────────────
  bEncounter(start: string, reason: string, kind: Encounter["kind"] = "office", clinician = this.pcp): Encounter {
    const e: Encounter = {
      id: this.uid("e"), source: "B", kind, start, reason, clinician, addressed: [],
      documents: [{ key: "note", kind: kind === "phone" ? "phone-note" : "office-note", at: start, signedAt: addMinutes(start, 90 + this.rng.fork(`sign/${start}`).int(0, 300)), author: clinician, factIds: [] }],
    };
    this.encounters.push(e);
    return e;
  }
  vitalSet(at0: string, source: SourceKey, sys: number, dia: number): Vital {
    const r = this.rng.fork(`vit/${at0}`);
    const v: Vital = {
      id: this.uid("v"), kind: "set", at: at0, setting: source === "A" ? "hospital" : "clinic", source,
      bp: { systolic: Math.round(sys), diastolic: Math.round(dia) }, pulse: r.int(62, 88), weightKg: r1(this.weight + r.normal(0, 0.8)),
    };
    if (source === "B" && sys >= 140 && r.chance(0.6)) v.bpRepeat = { systolic: Math.round(sys - r.int(2, 8)), diastolic: Math.round(dia - r.int(0, 4)) };
    this.vitals.push(v);
    return v;
  }
  weight = 85;

  clinicSbp(date: string): number {
    const n = this.activeClass(date, ["acei", "arb", "thiazide", "ccb", "beta-blocker", "loop"]).length;
    let s = this.sbp0 - n * 7 + this.rng.fork(`sbp/${date}`).normal(0, 6);
    if (this.maskedFrom && date >= this.maskedFrom) s = 117 + this.rng.fork(`msbp/${date}`).int(0, 10);
    return Math.round(s);
  }
}

// ─── the generator ──────────────────────────────────────────────────────────────────────────────

export function generatePatient(spec: PatientSpec): Patient {
  const g = new Gen(spec);
  const r = g.rng;
  const has = (a: Archetype) => g.has.has(a);

  // Demographics.
  g.sex = spec.sex ?? (r.chance(0.5) ? "F" : "M");
  const age2026 = Math.round(Math.min(88, Math.max(38, r.normal(63, 10))));
  g.birth = spec.birthDate ?? `${2026 - age2026 - (r.chance(0.6) ? 1 : 0)}-${String(r.int(1, 12)).padStart(2, "0")}-${String(r.int(1, 28)).padStart(2, "0")}`;
  g.race = spec.race ?? r.weighted([["White", 55], ["Black or African American", 27], ["Hispanic or Latino", 11], ["Asian", 7]] as const);
  g.given = spec.given ?? r.pick(g.sex === "F" ? GIVEN_F : GIVEN_M);
  g.family = spec.family ?? r.pick(FAMILY);
  g.weight = r1(r.normal(g.sex === "F" ? 82 : 94, 13));

  // Sources.
  const needA = ["dka_prec", "dka_noprec", "acei_angio", "chest_pain", "pneumonia", "aki_hyperk", "ckd_inpatient_dip"].some((a) => has(a as Archetype)) || (has("hf") && r.chance(0.5));
  const needC = ["ckd_prog_sglt2", "ckd_prog_sglt2_held", "hyperk_conf", "hyperk_hem", "insulin_ckd", "dup_lab", "early_labs", "ckd_inpatient_dip"].some((a) => has(a as Archetype));
  const needP = ["masked_htn", "meter_mmol", "otc_nsaid", "typed_dup"].some((a) => has(a as Archetype));
  const needB = !["chest_pain"].every((a) => has(a as Archetype)) || true;
  if (spec.sources) for (const s of spec.sources) g.sources.add(s);
  else {
    if (needB && r.chance(0.94)) g.sources.add("B");
    if (needC || (g.sources.has("B") ? r.chance(0.85) : r.chance(0.5))) g.sources.add("C");
    if (needA || r.chance(0.08)) g.sources.add("A");
    if (needP || r.chance(0.12)) g.sources.add("P");
    if (["b_hold", "med_error", "acei_cough", "sick_day", "nonadherence", "mdd", "dka_prec", "dka_noprec", "masked_htn", "hyperk_conf"].some((a) => has(a as Archetype))) g.sources.add("B");
    if (!g.sources.size) g.sources.add("B");
  }
  const inB = g.sources.has("B"), inC = g.sources.has("C"), inA = g.sources.has("A"), inP = g.sources.has("P");

  // Relationship start.
  g.bStart = spec.bStart ?? (has("early_labs") || has("ckd_prog_sglt2") || has("ckd_prog_sglt2_held") ? `${r.pick(["2019", "2020"])}-${String(r.int(1, 12)).padStart(2, "0")}-${String(r.int(1, 28)).padStart(2, "0")}` : `${r.pick(["2019", "2020", "2021", "2022", "2022", "2023", "2023", "2024", "2024"])}-${String(r.int(1, 12)).padStart(2, "0")}-${String(r.int(1, 28)).padStart(2, "0")}`);
  g.bStart = weekday(g.bStart, r);
  g.pcp = r.weighted([["ngf:treyes", 4], ["ngf:dkhan", 3], ["ngf:mbrennan", 3], ["ngf:jpatel", 1]] as const);

  // Phenotype.
  const ckdArch = has("ckd_prog_sglt2") || has("ckd_prog_sglt2_held") || has("insulin_ckd") || has("ckd_inpatient_dip");
  g.dm = ckdArch || has("meter_mmol") || has("dka_prec") || has("dka_noprec") || has("sick_day") || r.chance(0.55);
  g.htn = has("masked_htn") || has("acei_angio") || has("acei_cough") || has("hyperk_conf") || has("nonadherence") || r.chance(0.78);
  g.hld = r.chance(0.65);
  g.hf = has("hf");
  g.mdd = has("mdd");
  g.oa = has("otc_nsaid") || r.chance(0.15);
  g.obesity = g.weight > 95 || r.chance(0.2);
  g.hypothyroid = r.chance(0.08);
  g.ckd = ckdArch || (g.dm || g.htn ? r.chance(0.35) : r.chance(0.08));
  if (has("ckd_prog_sglt2") || has("ckd_prog_sglt2_held")) { g.eT = r.int(33, 44); g.rateRecent = r.int(75, 100) / 10; g.rateOld = r.int(10, 25) / 10; }
  else if (has("insulin_ckd")) { g.eT = r.int(28, 43); g.rateRecent = r.int(15, 40) / 10; g.rateOld = 1.5; }
  else if (has("ckd_inpatient_dip")) { g.eT = r.int(44, 55); g.rateRecent = r.int(5, 18) / 10; g.rateOld = 1; }
  else if (g.ckd) { g.eT = r.int(32, 58); g.rateRecent = r.int(5, 35) / 10; g.rateOld = r.int(5, 25) / 10; }
  else { g.eT = Math.min(105, r.int(62, 98) - Math.max(0, age2026 - 65) * 0.6); g.rateRecent = r.int(3, 12) / 10; g.rateOld = g.rateRecent; }
  g.uacr0 = g.ckd || g.dm ? r.weighted([[10, 3], [60, 4], [180, 3], [420, 2]] as const) * (0.7 + r.next() * 0.6) : 8 + r.int(0, 15);
  g.uacrGrowth = ckdArch ? 1.25 : g.ckd ? 1.1 : 1.02;
  g.a1c = g.dm ? r1(r.normal(7.4, 0.7)) : 5.6;
  if (has("insulin_ckd")) g.a1c = r1(r.normal(8.6, 0.4));
  g.sbp0 = g.htn ? r.int(140, 158) : r.int(118, 132);

  // Conditions present at the start (onsets before the relationship, often year precision).
  const startYear = +g.bStart.slice(0, 4);
  const onsetOf = (yearsBefore: [number, number]) => {
    const y = startYear - r.int(...yearsBefore);
    return r.chance(0.7) ? String(y) : r.chance(0.6) ? `${y}-${String(r.int(1, 12)).padStart(2, "0")}` : `${y}-${String(r.int(1, 12)).padStart(2, "0")}-${String(r.int(1, 28)).padStart(2, "0")}`;
  };
  const c: Record<string, Condition> = {};
  const vis = (s: SourceKey[]) => Object.fromEntries(s.map((x) => [x, "both"])) as Condition["visibility"];
  const fuzzy = (): Condition["traps"] => (inB ? ["T17", "T10"] : undefined);
  if (g.htn) c.htn = g.cond("htn", onsetOf([2, 14]), inB ? g.bStart : undefined, "B", { traps: fuzzy() });
  if (g.dm) c.dm = g.cond("t2dm", onsetOf([1, 12]), inB ? g.bStart : undefined, "B", { traps: fuzzy() });
  if (g.hld) c.hld = g.cond("hld", onsetOf([1, 10]), inB ? g.bStart : undefined);
  if (g.obesity) c.obesity = g.cond("obesity", onsetOf([2, 15]), inB ? g.bStart : undefined);
  if (g.hf) c.hf = g.cond("hf", onsetOf([1, 5]), inB ? g.bStart : undefined);
  if (g.oa) c.oa = g.cond("oa-knee", onsetOf([1, 8]), inB ? g.bStart : undefined);
  if (g.hypothyroid) c.hypo = g.cond("hypothyroid", onsetOf([2, 15]), inB ? g.bStart : undefined);
  if (g.mdd) { c.mdd = g.cond("mdd", onsetOf([0, 6]), inB ? g.bStart : undefined, "B", { sensitive: "behavioral-health", traps: ["T19"] }); g.sensitive.push(c.mdd.id); }
  for (const x of Object.values(c)) if (x.onset.length === 10 && x.traps) x.traps = x.traps.filter((t) => t !== "T17" && t !== "T10");
  for (const x of Object.values(c)) x.visibility = { ...vis(inB ? ["B"] : []), ...(inA ? { A: "both" } : {}) };

  // Baseline medications (taken before the relationship began; B creates the lines at the first visit).
  const pre = String(startYear - 1);
  const homeVis: SourceKey[] = ["B", ...(inP ? (["P"] as SourceKey[]) : []), ...(inA ? (["A"] as SourceKey[]) : [])];
  const baseMed = (product: string, opts: Parameters<Gen["startMed"]>[3] = {}) => g.startMed(product, pre, "B", { vis: homeVis, ...opts });
  if (g.htn) {
    if (has("acei_cough") || has("acei_angio") || (r.chance(0.5) && !has("hf"))) baseMed(r.pick(["lisinopril-10", "lisinopril-20"]));
    else baseMed(r.pick(["losartan-50", "losartan-100"]));
    if (r.chance(0.35)) baseMed(r.chance(0.5) ? "amlodipine-5" : "hctz-25");
  }
  if (g.dm) {
    baseMed(r.chance(0.6) ? "metformin-1000" : "metformin-500", { freq: "BID" });
    if (r.chance(0.18)) baseMed("glipizide-5");
  }
  if (g.hld) baseMed(r.pick(["atorvastatin-20", "atorvastatin-40", "rosuvastatin-20"]));
  if (g.hf) {
    baseMed("carvedilol-12.5", { freq: "BID" });
    baseMed("furosemide-40");
    baseMed("spironolactone-25");
    if (!g.meds.some((m) => ["acei", "arb"].includes(drug(m.product).klass))) baseMed("losartan-50");
  }
  if (g.mdd) baseMed(r.pick(["sertraline-50", "sertraline-100", "escitalopram-10"]), { sensitive: true });
  if (g.hypothyroid) baseMed("levothyroxine-75");
  const sglt2Planned = has("ckd_prog_sglt2") || has("ckd_prog_sglt2_held") || has("dka_prec") || has("dka_noprec") || has("ckd_inpatient_dip") || has("sick_day") || (g.dm && g.ckd && r.chance(0.35)) || (g.hf && r.chance(0.5));
  // Not a baseline SGLT2i for a planned DKA: that patient's SGLT2i comes from the DKA plan (it may predate the first visit).
  // (Random draws are made as before so other patients' streams do not shift.)
  if (sglt2Planned && (has("ckd_prog_sglt2") || has("ckd_prog_sglt2_held") || r.chance(0.4))) {
    const prod = r.pick(["empagliflozin-10", "dapagliflozin-10"]);
    if (!has("dka_prec") && !has("dka_noprec")) baseMed(prod);
  }

  // ─── Primary-care simulation ────────────────────────────────────────────────────────────────
  const visits: string[] = [];
  if (inB) {
    let d = g.bStart;
    const end = addDays(T, -r.int(14, 120));
    while (d <= end) {
      visits.push(weekday(d, r));
      d = addDays(d, (g.dm && g.a1c > 8) || ckdArch ? r.int(120, 180) : r.int(200, 330));
    }
  }
  // Planted event dates.
  const pickVisit = (lo: number, hi = visits.length - 1) => visits[Math.max(0, Math.min(visits.length - 1, r.int(Math.min(lo, hi), hi)))];
  const plan: Record<string, string> = {};
  if (has("acei_cough") && visits.length > 1) plan.cough = pickVisit(1, Math.min(4, visits.length - 1));
  if (has("acei_angio") && visits.length > 1) { plan.angio = addDays(pickVisit(1, Math.max(1, visits.length - 3)), r.int(10, 40)); g.aceiStopFrom = plan.angio; }
  if (has("dka_prec") || has("dka_noprec")) plan.dka = weekday(addDays("2022-09-01", r.int(0, 1300)), r);
  if (has("aki_hyperk")) plan.aki = addDays("2023-01-15", r.int(0, 1200));
  if (has("pneumonia") || has("ckd_inpatient_dip")) plan.pna = addDays(has("ckd_inpatient_dip") ? "2025-03-01" : "2022-01-10", r.int(0, has("ckd_inpatient_dip") ? 420 : 1500));
  if (has("chest_pain")) plan.cp = addDays("2021-05-01", r.int(0, 1900));
  if (has("hyperk_hem")) plan.hem = visits.length ? pickVisit(1) : addDays("2022-03-01", r.int(0, 1200));
  if (has("hyperk_conf")) plan.conf = visits.length ? pickVisit(Math.max(1, visits.length - 5)) : addDays("2025-01-01", r.int(0, 500));
  if (has("b_hold") && visits.length > 2) plan.bhold = addDays(pickVisit(1, visits.length - 2), r.int(8, 40));
  if (has("med_error")) plan.err = addDays(visits.length ? pickVisit(1) : "2024-04-01", r.int(5, 30));
  if (has("dup_lab")) plan.dup = visits.length ? pickVisit(1) : "";
  if (has("sick_day")) plan.sick = pickVisit(1);
  if (has("nonadherence")) plan.nonadh = pickVisit(1);
  if (has("masked_htn")) g.maskedFrom = addDays(T, -540);
  if (has("insulin_ckd")) plan.insulin = addDays(T, -r.int(400, 900));
  if (has("ckd_prog_sglt2_held")) plan.sglt2hold = addDays(T, -r.int(20, 80));
  if (sglt2Planned && !g.meds.some((m) => drug(m.product).klass === "sglt2i")) plan.sglt2 = has("dka_prec") || has("dka_noprec") ? addDays(plan.dka, -r.int(200, 700)) : addDays(T, -r.int(800, 1400));

  const traps = (id: string, ...t: string[]) => {
    const all = [...g.conditions, ...g.meds, ...g.labs, ...g.allergies, ...g.facts] as { id: string; traps?: string[] }[];
    const f = all.find((x) => x.id === id);
    if (f) f.traps = [...new Set([...(f.traps ?? []), ...t])];
  };

  let ckdLine: Condition | undefined = undefined;
  let prevSbp = 0;
  let lastLabs: Draw | undefined;
  const qualifyingEgfr: string[] = [];

  const doVisit = (date: string, i: number) => {
    const vr = r.fork(`visit/${date}`);
    const start = at(`${date}T${hhmm(vr.int(8, 15), vr.pick([0, 10, 15, 20, 30, 40, 45, 50]))}`);
    const reasonPool = i === 0 ? ["New patient, establish care"] : g.dm ? ["Diabetes follow-up", "Diabetes follow-up", "Chronic care visit", "Annual exam"] : g.htn ? ["BP follow-up", "Chronic care visit", "Annual exam"] : ["Annual exam", "Follow-up"];
    const e = g.bEncounter(start, vr.pick(reasonPool));
    const doc = e.documents[0];
    const sbp = g.clinicSbp(date);
    const vit = g.vitalSet(addMinutes(start, -vr.int(8, 15)), "B", sbp, sbp * 0.6 + vr.normal(0, 4));
    doc.factIds.push(vit.id);
    // Labs drawn the same morning (or a few days before) at Lakeview.
    if (inC) {
      const ld = addDays(date, vr.chance(0.6) ? 0 : -vr.int(2, 6));
      const drawAt = at(`${ld}T${hhmm(7, vr.int(15, 59))}`);
      if (ms(drawAt) < ms(start)) {
        const lipid = yrs(g.lastLipid, ld) > 0.9 && vr.chance(g.hld || g.dm ? 0.85 : 0.35);
        const vals = g.routineValues(ld, { a1c: g.dm, uacr: (g.dm || g.ckd) && vr.chance(0.5), cbc: vr.chance(0.25), na: vr.chance(0.3), glu: !g.dm && vr.chance(0.3), k: g.htn || g.ckd || g.hf || vr.chance(0.5), lipid });
        const dr = g.drawC(drawAt, "B", e.clinician, vals, lipid ? { fasting: "Y" } : {});
        lastLabs = dr;
        for (const l of dr.labs) if (["creatinine", "a1c", "potassium", "uacr", "ldl"].includes(l.analyte)) doc.factIds.push(l.analyte === "creatinine" ? `${l.id}_egfr` : l.id);
        if (date < "2022-01-10") for (const l of dr.labs) traps(l.id, "T11");
        // CKD stage recorded on Northgate's problem list when two eGFRs < 60 are 90+ days apart.
        const e0 = g.egfr(ld);
        if (e0 < 60) qualifyingEgfr.push(ld);
        if (!ckdLine && qualifyingEgfr.length >= 2 && yrs(qualifyingEgfr[0], ld) * 365 >= 90) {
          const stage = e0 >= 45 ? "3a" : e0 >= 30 ? "3b" : "4";
          ckdLine = g.cond(stage === "3a" ? "ckd3a" : stage === "3b" ? "ckd3b" : "ckd4", ld, undefined);
          ckdLine.name = "Chronic kidney disease";
          ckdLine.history.push({ at: ld, status: "active", stage, recordedBy: "B", icd10: stage === "3a" ? "N18.31" : stage === "3b" ? "N18.32" : "N18.4", snomed: CONDITIONS[stage === "3a" ? "ckd3a" : stage === "3b" ? "ckd3b" : "ckd4"].snomed });
          ckdLine.visibility = { B: "both", ...(inA ? { A: "both" as const } : {}), ...(inC ? { C: "both" as const } : {}) };
          e.addressed!.push({ conditionId: ckdLine.id });
          doc.factIds.push(ckdLine.id);
        } else if (ckdLine && vr.chance(0.12)) {
          // Occasionally Northgate updates the stage; usually it never does (T5).
          const st = e0 >= 45 ? "3a" : e0 >= 30 ? "3b" : "4";
          const last = [...ckdLine.history].reverse().find((h) => h.recordedBy === "B")!;
          if (last.stage !== st && st !== "3a") { ckdLine.history.push({ at: ld, status: "active", stage: st, recordedBy: "B", icd10: st === "3b" ? "N18.32" : "N18.4" }); doc.factIds.push(ckdLine.id); }
        }
      }
    }
    for (const x of [c.htn, c.dm, ckdLine, c.hld, c.hf, c.mdd].filter(Boolean) as Condition[]) if (vr.chance(0.7) || x === ckdLine) e.addressed!.push({ conditionId: x.id });
    if (!e.addressed!.length && c.htn) e.addressed!.push({ conditionId: c.htn.id });
    e.addressed = [...new Map(e.addressed!.map((a) => [a.conditionId, a])).values()];
    if (e.reason === "Annual exam") e.billingExtra = [{ icd10: "Z00.00", display: "Encounter for general adult medical examination without abnormal findings" }];
    // Medication decisions.
    const t0 = addMinutes(start, 20);
    let k = 0;
    const tick = () => addMinutes(t0, ++k);
    const eg = g.egfr(date);
    for (const m of g.activeClass(date, ["biguanide"])) {
      const prod = g.currentProduct(m, start);
      if (eg < 30) { g.set(m, tick(), "B", "stopped", { stopReason: "other", reason: `eGFR ${Math.round(eg)}` }); doc.factIds.push(m.id); }
      else if (eg < 45 && prod === "metformin-1000") { g.change(m, tick(), "B", { product: "metformin-500", dose: { value: 500, unit: "mg" }, doseText: "500 mg", reason: `eGFR ${Math.round(eg)}` }); doc.factIds.push(m.id); }
    }
    if (g.dm && g.a1c >= 8.1 && yrs(g.lastA1cBump, date) > 0.7 && !(plan.insulin && date >= plan.insulin)) {
      g.lastA1cBump = date;
      const met = g.activeClass(date, ["biguanide"])[0];
      const sg = g.activeClass(date, ["sglt2i"])[0];
      const glp = g.activeClass(date, ["glp1ra"])[0];
      const ins = g.activeClass(date, ["basal-insulin"])[0];
      let m: Medication | undefined;
      if (!met && eg >= 30) m = g.startMed("metformin-500", tick(), "B", { reason: `A1c ${g.a1c}`, vis: homeVis, freq: "BID" });
      else if (met && g.currentProduct(met, start) === "metformin-500" && eg >= 45) { g.change(met, tick(), "B", { product: "metformin-1000", dose: { value: 1000, unit: "mg" }, doseText: "1000 mg", reason: `A1c ${g.a1c}` }); m = met; }
      else if (!sg && !g.dkaHistory && eg >= 25 && !has("dka_noprec") && !has("dka_prec")) m = g.startMed(r.pick(["empagliflozin-10", "dapagliflozin-10"]), tick(), "B", { reason: `A1c ${g.a1c}${g.ckd ? ", CKD" : ""}`, vis: homeVis });
      else if (!glp && vr.chance(0.6)) m = g.startMed(r.pick(["semaglutide-1", "dulaglutide-1.5"]), tick(), "B", { reason: `A1c ${g.a1c}`, vis: homeVis, dose: 0.5 });
      else if (!ins) m = g.startMed("glargine-100", tick(), "B", { reason: `A1c ${g.a1c}`, vis: homeVis, dose: 10 });
      else { const cur = ins.history.reduce((a, h) => h.dose?.value ?? a, ins.dose!.value); g.change(ins, tick(), "B", { dose: { value: cur + 4, unit: "units" }, doseText: `${cur + 4} units`, reason: `A1c ${g.a1c}` }); m = ins; }
      if (m) { doc.factIds.push(m.id); g.a1c = r1(g.a1c - (0.6 + vr.next() * 0.6)); }
    } else if (g.dm) g.a1c = r1(Math.min(10.5, Math.max(6.1, g.a1c + vr.normal(0.12, 0.3))));
    if (has("insulin_ckd") && date >= addDays(T, -540)) g.a1c = r1(8.2 + vr.next() * 1.1);
    // Never after a planned SGLT2i-associated DKA: the DKA's own SGLT2i line is created later in the simulation (back-dated).
    if (plan.sglt2 && date >= plan.sglt2 && !g.meds.some((m) => drug(m.product).klass === "sglt2i") && !g.dkaHistory && !(plan.dka && date >= plan.dka)) {
      const m = g.startMed(r.pick(["empagliflozin-10", "dapagliflozin-10"]), tick(), "B", { reason: g.ckd ? "CKD + DM, cardiorenal benefit" : g.hf ? "HFrEF" : "A1c above goal", vis: homeVis });
      doc.factIds.push(m.id);
    }
    if (plan.insulin && date >= plan.insulin && !g.activeClass(date, ["basal-insulin"]).length) {
      const m = g.startMed("glargine-100", tick(), "B", { reason: `A1c ${g.a1c}`, vis: homeVis, dose: 10 });
      doc.factIds.push(m.id);
    }
    // Not when the patient has run out of a blood-pressure medicine: restarting it comes first.
    if (g.htn && sbp >= 140 && prevSbp >= 140 && !(g.maskedFrom && date >= g.maskedFrom) && plan.nonadh !== date) {
      const raas = g.activeClass(date, ["acei", "arb"])[0];
      const prod = raas ? g.currentProduct(raas, start) : undefined;
      let m: Medication | undefined;
      if (!raas) m = g.startMed(g.aceiAvoid || (g.aceiStopFrom && date >= g.aceiStopFrom) || r.chance(0.5) ? "losartan-50" : "lisinopril-10", tick(), "B", { reason: "BP above goal", vis: homeVis });
      else if (prod && ["lisinopril-10", "lisinopril-20", "losartan-50"].includes(prod)) {
        const next = { "lisinopril-10": "lisinopril-20", "lisinopril-20": "lisinopril-40", "losartan-50": "losartan-100" }[prod]!;
        g.change(raas, tick(), "B", { product: next, dose: { value: drug(next).strength, unit: "mg" }, doseText: `${drug(next).strength} mg`, reason: "BP above goal" });
        m = raas;
      } else if (!g.activeClass(date, ["thiazide"]).length) m = g.startMed("chlorthalidone-25", tick(), "B", { reason: "BP above goal", vis: homeVis, dose: 12.5 });
      else if (!g.activeClass(date, ["ccb"]).length) m = g.startMed("amlodipine-5", tick(), "B", { reason: "BP above goal", vis: homeVis });
      if (m) doc.factIds.push(m.id);
    }
    prevSbp = sbp;
    // Planted visit events.
    if (plan.cough === date) {
      const lis = g.activeClass(date, ["acei"])[0];
      if (lis) {
        g.set(lis, tick(), "B", "stopped", { stopReason: "adverse_reaction", reason: "dry cough" });
        const los = g.startMed("losartan-50", tick(), "B", { reason: "ACE inhibitor cough", vis: homeVis });
        const onsetMonth = addDays(date, -vr.int(35, 90)).slice(0, 7);
        const a = { id: g.uid("a"), substance: ingredientCoding("lisinopril-10")!, type: "intolerance" as const, reaction: "dry cough", reactions: ["Cough"], criticality: "low" as const,
          onset: onsetMonth, recordedAt: tick(), recordedBy: "B" as SourceKey, negatedFindings: ["angioedema", "lip, tongue or throat swelling"],
          visibility: { B: "both" as const, ...(inA ? { A: "structured" as const } : {}), ...(inP ? { P: "prose" as const } : {}) }, traps: ["T12", "T18"] as TrapId[] };
        g.allergies.push(a);
        const nf: NarrativeFact = { id: g.uid("nf"), at: a.recordedAt, kind: "negation", polarity: "negated", about: [a.id], statement: "Cough only with the ACE inhibitor: no lip, tongue or throat swelling (not angioedema).",
          evidence: [["no (lip|tongue|throat|facial|mouth)|no angioedema|without (angioedema|swelling)|denies (any )?(lip|tongue|throat|facial)? ?swelling"]], visibility: { B: "prose" }, traps: ["T12"] };
        g.facts.push(nf);
        g.aceiAvoid = true;
        doc.factIds.push(lis.id, los.id, a.id);
      }
    }
    if (plan.sick === date) {
      const nf: NarrativeFact = { id: g.uid("nf"), at: start, kind: "teaching", polarity: "affirmed", statement: "Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink.", evidence: [["sick[- ]day"]], span: { B: "sick_day" }, visibility: { B: "prose" }, traps: ["T13"] };
      g.facts.push(nf);
      doc.factIds.push(nf.id);
    }
    if (plan.nonadh === date) {
      const bp = g.activeClass(date, ["acei", "arb", "ccb", "thiazide"])[0];
      if (bp) {
        const nf: NarrativeFact = { id: g.uid("nf"), at: start, kind: "patient-report", polarity: "affirmed", about: [bp.id], statement: `Patient ran out of ${drug(g.currentProduct(bp, start)).ingredient} about 3 weeks ago and has not been taking it.`, evidence: [[`ran out|out of|not been taking|hasn'?t been taking|stopped taking`], [drug(bp.product).ingredient.split(" ")[0]]], visibility: { B: "prose" }, traps: ["T13"] };
        g.facts.push(nf);
        doc.factIds.push(nf.id);
      }
    }
    if (plan.dup === date && lastLabs && localDate(lastLabs.draw.collectedAt) <= date) {
      const src = lastLabs.labs.find((l) => l.analyte === "a1c") ?? lastLabs.labs.find((l) => l.analyte === "potassium");
      if (src) {
        const dup: LabIn = { ...src, id: g.uid("l"), status: "entered-in-error", duplicateOf: src.id, correctedAt: addMinutes(src.resultedAt!, 70), traps: ["T4"] };
        g.labs.push(dup);
      }
    }
    if (plan.hem === date && lastLabs && inC) {
      const kLab = lastLabs.labs.find((l) => l.analyte === "potassium");
      const dr = lastLabs.draw;
      if (kLab) {
        kLab.value = r1(5.8 + vr.next() * 0.8);
        kLab.annotations = ["hemolyzed"];
        kLab.status = "corrected-away";
        const redrawAt = addMinutes(dr.collectedAt, 240 + vr.int(0, 90));
        const red = g.drawC(redrawAt, dr.orderedBy, dr.orderingClinician, { potassium: r1(4.1 + vr.next() * 0.8) });
        kLab.replacedBy = red.labs[0].id;
        kLab.correctedAt = addMinutes(red.labs[0].resultedAt!, 7);
        kLab.traps = ["T2", "T3"];
        red.labs[0].traps = ["T3"];
        doc.factIds.push(red.labs[0].id);
      }
    }
    return e;
  };

  visits.forEach((d, i) => doVisit(d, i));

  // Lakeview patients with no Northgate chart: labs ordered by another practice.
  if (inC && !inB) {
    for (let d = weekday(addDays(g.bStart, r.int(0, 60)), r); d < addDays(T, -10); d = weekday(addDays(d, r.int(120, 240)), r)) {
      g.drawC(at(`${d}T${hhmm(7, r.int(10, 55))}`), "outside", undefined, g.routineValues(d, { a1c: g.dm, uacr: (g.dm || g.ckd) && r.chance(0.5), na: r.chance(0.3), glu: !g.dm, cbc: r.chance(0.2), lipid: yrs(g.lastLipid, d) > 0.9 && r.chance(0.6) }));
    }
  }

  // ─── Hospital admissions (Riverside) ─────────────────────────────────────────────────────────
  const admit = (kind: "dka" | "aki" | "pna" | "cp" | "angio", date: string) => admission(g, kind, date, { c, inB, inP, homeVis });
  if (plan.dka && inA) {
    // SGLT2i must be active at the DKA.
    if (!g.activeClass(plan.dka, ["sglt2i"]).length) g.startMed("empagliflozin-10", at(`${addDays(plan.dka, -r.int(200, 500))}T10:30`), "B", { reason: "CKD + DM, cardiorenal benefit", vis: homeVis });
    admit("dka", plan.dka);
  }
  if (plan.aki && inA) admit("aki", plan.aki);
  if (plan.pna && inA) admit("pna", plan.pna);
  if (plan.cp && inA) admit("cp", plan.cp);
  if (plan.angio && inA) admit("angio", plan.angio);

  // ─── Phone events and other planted episodes ─────────────────────────────────────────────────
  if (plan.bhold) {
    const target = g.activeClass(plan.bhold, ["biguanide"])[0] ?? g.activeClass(plan.bhold, ["arb", "acei"])[0] ?? g.activeClass(plan.bhold, ["sglt2i"])[0];
    if (target) {
      const t1 = at(`${weekday(plan.bhold, r)}T${hhmm(r.int(9, 15), r.int(0, 59))}`);
      const e = g.bEncounter(t1, "Phone: sick, vomiting", "phone");
      const reason = "vomiting, poor oral intake";
      g.set(target, addMinutes(t1, 5), "B", "held", { reason, intendResume: true, reviewOn: addDays(localDate(t1), 7) });
      e.documents[0].factIds.push(target.id);
      // Most holds are resumed a week later; some are never revisited (still held at the evaluation date).
      if (r.chance(0.6) && addDays(localDate(t1), 9) < T) {
        const t2 = at(`${weekday(addDays(localDate(t1), r.int(6, 12)), r)}T${hhmm(r.int(9, 15), r.int(0, 59))}`);
        const e2 = g.bEncounter(t2, "Phone: feeling better", "phone");
        g.change(target, addMinutes(t2, 4), "B", { reason: "eating and drinking normally" });
        e2.documents[0].factIds.push(target.id);
      }
      traps(target.id, "T1");
    }
  }
  if (plan.err) {
    const choices = ["atorvastatin-80", "metoprolol-50", "amlodipine-10", "furosemide-40", "carvedilol-12.5"].filter((p) => !g.meds.some((m) => m.product === p));
    const prod = r.pick(choices);
    const t1 = at(`${weekday(plan.err, r)}T${hhmm(r.int(13, 16), r.int(0, 59))}`);
    const m = g.startMed(prod, t1, "B", { vis: ["B"] });
    m.history.push({ at: at(`${addDays(localDate(t1), 1)}T${hhmm(8, r.int(10, 50))}:${String(r.int(10, 59))}`), status: "entered-in-error", by: "B", reason: r.chance(0.7) ? "wrong patient" : "entry error" });
    m.visibility = { B: "structured" };
    m.traps = ["T4"];
  }

  // Hyperkalemia confirmed by a same-day repeat, on RAAS/MRA therapy (cohort 3), then held (T1).
  if (plan.conf && inC) {
    const date = weekday(plan.conf, r);
    let raas = g.activeClass(date, ["mra", "ns-mra", "arb", "acei"]);
    if (!raas.length) raas = [g.startMed("losartan-50", at(`${addDays(date, -200)}T10:00`), "B", { reason: "albuminuria", vis: homeVis })];
    const t1 = at(`${date}T${hhmm(7, r.int(5, 50))}`);
    const ordBy: SourceKey = g.neph ? "C" : "B";
    const kv = r1(5.6 + r.next() * 0.7);
    const d1 = g.drawC(t1, ordBy, ordBy === "C" ? g.nephDoc : g.pcp, { creatinine: g.creat(date), potassium: kv });
    const k1 = d1.labs.find((l) => l.analyte === "potassium")!;
    k1.annotations = ["not hemolyzed"];
    const d2 = g.drawC(addMinutes(t1, 260 + r.int(0, 80)), ordBy, d1.draw.orderingClinician, { potassium: r1(Math.max(5.5, kv + r.normal(-0.1, 0.12))) });
    d2.labs[0].confirms = k1.id;
    k1.traps = ["T3"]; d2.labs[0].traps = ["T3"];
    const target = raas.find((m) => ["mra", "ns-mra"].includes(drug(m.product).klass)) ?? raas[0];
    const t2 = addMinutes(d2.labs[0].resultedAt!, 45);
    const e = g.bEncounter(t2, "Phone: high potassium", "phone");
    g.set(target, addMinutes(t2, 6), "B", "held", { reason: `K ${kv} confirmed on repeat`, intendResume: true, reviewOn: addDays(date, 14) });
    e.documents[0].factIds.push(k1.id, d2.labs[0].id, target.id);
    traps(target.id, "T1");
  }

  // ─── Nephrology (Lakeview Kidney Care) ───────────────────────────────────────────────────────
  if (inC && inB && (ckdArch || (g.ckd && (g.eT < 42 || g.uacr(T) > 300) && r.chance(0.7)))) nephrology(g, { c, ckdLine, homeVis, plan });
  if (plan.sglt2hold) {
    const sg = g.activeClass(plan.sglt2hold, ["sglt2i"])[0];
    if (sg) {
      const neph = g.encounters.filter((e) => e.source === "C");
      const t1 = at(`${weekday(plan.sglt2hold, r)}T${hhmm(r.int(13, 16), r.int(0, 59))}`);
      if (neph.length && inC) {
        const e: Encounter = { id: g.uid("e"), source: "C", kind: "phone", start: t1, reason: "Phone: symptoms", clinician: g.nephDoc,
          documents: [{ key: "note", kind: "phone-note", at: t1, signedAt: addMinutes(t1, 18), author: g.nephDoc, factIds: [sg.id] }] };
        g.encounters.push(e);
        if (!sg.history.some((h) => h.by === "C")) sg.history.push({ at: addMinutes(t1, -0.5), status: "active", by: "C", reason: "taking (reconciled)" });
        g.set(sg, addMinutes(t1, 9), "C", "held", { reason: r.pick(["recurrent genital yeast infection", "lightheaded, volume depletion"]), intendResume: true, reviewOn: addDays(localDate(t1), 30) });
      } else {
        const e = g.bEncounter(t1, "Phone: side effect", "phone");
        g.set(sg, addMinutes(t1, 6), "B", "held", { reason: "recurrent genital yeast infection", intendResume: true, reviewOn: addDays(localDate(t1), 30) });
        e.documents[0].factIds.push(sg.id);
      }
      traps(sg.id, "T1");
    }
  }

  // ─── HomeLog ─────────────────────────────────────────────────────────────────────────────────
  if (inP) homeLog(g, { masked: has("masked_htn"), mmol: has("meter_mmol"), nsaid: has("otc_nsaid"), typedDup: has("typed_dup"), plan });

  // A source with nothing to say about the patient does not know them.
  const hasData: Record<SourceKey, boolean> = {
    A: g.encounters.some((e) => e.source === "A"),
    B: g.encounters.some((e) => e.source === "B") || g.meds.some((m) => m.history.some((h) => h.by === "B")),
    C: g.draws.some((d) => d.performedBy === "C") || g.encounters.some((e) => e.source === "C"),
    P: g.vitals.some((v) => v.source === "P") || g.home.notes.length > 0 || g.home.listSaves.length > 0,
  };
  for (const s of [...g.sources]) if (!hasData[s]) g.sources.delete(s);
  const p = finalize({
    id: g.id, role: spec.role,
    demographics: { given: g.given, family: g.family, birthDate: g.birth, sex: g.sex, race: g.race, tz: TZ },
    sources: Object.fromEntries([...g.sources].sort().map((s) => [s, { localId: localIdFor(s, g.rng) }])),
    sensitivity: g.sensitive.length ? [{ category: "behavioral-health", factIds: g.sensitive }] : [],
    encounters: g.encounters.sort((a, b) => ms(a.start) - ms(b.start)), conditions: g.conditions, meds: g.meds, draws: g.draws, labs: g.labs, vitals: g.vitals,
    allergies: g.allergies, narrativeFacts: g.facts, home: inP ? g.home : undefined, referrals: g.referrals, traps: [],
  });
  for (const l of p.labs) l.resultedAt ??= addMinutes(l.collectedAt, 150);
  // Visibility of meds for sources that never see them.
  for (const m of p.meds) for (const s of Object.keys(m.visibility) as SourceKey[]) if (!p.sources[s]) delete m.visibility[s];
  for (const c0 of p.conditions) for (const s of Object.keys(c0.visibility) as SourceKey[]) if (!p.sources[s]) delete c0.visibility[s];
  p.traps = deriveTraps(p);
  return p;
}

function localIdFor(s: SourceKey, rng: Rng): string {
  const r = rng.fork(`local/${s}`);
  return s === "A" ? `RRH-00${r.digits(6)}` : s === "B" ? `NFM-00${r.digits(6)}` : s === "C" ? `LV-00${r.digits(5)}` : `HL-U-${r.int(10000, 99999)}`;
}

// ─── Hospital admission builder ─────────────────────────────────────────────────────────────────

interface AdmCtx { c: Record<string, Condition>; inB: boolean; inP: boolean; homeVis: SourceKey[] }

const PRECIPITANTS = [
  { statement: "precipitated by a viral gastroenteritis with vomiting and almost no oral intake for several days", evidence: [["gastroenteritis|vomit|stomach bug|diarrh"], ["intake|eat|food|oral"]], diary: "Stomach bug, throwing up since yesterday, can barely keep water down. Still taking my morning pills." },
  { statement: "precipitated by elective knee replacement surgery with prolonged pre-operative fasting while the SGLT2 inhibitor was continued", evidence: [["surgery|knee replacement|arthroplasty|operation"], ["fast|NPO|nothing to eat|not eating"]], diary: "Knee surgery tomorrow. Nothing to eat after midnight, they said keep taking my diabetes pill." },
  { statement: "precipitated by influenza with fever and poor oral intake", evidence: [["influenza|flu"], ["intake|eat|food|drink"]], diary: "Flu, fever 102, no appetite at all. Just tea and crackers." },
  { statement: "precipitated by a weekend of heavy alcohol use with little food", evidence: [["alcohol|drinking|ETOH|binge"], ["food|eat|intake|fasting"]], diary: "Too much to drink at the reunion this weekend, didn't eat much. Feel awful." },
  { statement: "precipitated by prolonged fasting for religious observance while continuing the SGLT2 inhibitor", evidence: [["fast|fasting|Ramadan"]], diary: "Fasting all day this week. Tired and thirsty in the afternoons." },
];

function admission(g: Gen, kind: "dka" | "aki" | "pna" | "cp" | "angio", date: string, ax: AdmCtx) {
  const r = g.rng.fork(`adm/${kind}/${date}`);
  const arrive = at(`${date}T${hhmm(r.int(13, 23), r.pick([5, 12, 20, 34, 41, 48, 55]))}`);
  const edOnly = kind === "cp" || kind === "angio";
  const admitted = edOnly ? undefined : addMinutes(arrive, 180 + r.int(0, 200));
  const los = kind === "dka" ? r.int(2, 4) : kind === "aki" ? r.int(2, 4) : kind === "pna" ? r.int(3, 5) : 0;
  const dcDate = addDays(localDate(admitted ?? arrive), los);
  const discharged = edOnly ? addMinutes(arrive, 300 + r.int(0, 200)) : at(`${dcDate}T${hhmm(r.int(10, 15), r.pick([0, 15, 30, 45]))}`);
  const edDoc = r.pick(["rrh:hale", "rrh:okonjo", "rrh:lindqvist"]);
  const hosp = r.pick(["rrh:raman", "rrh:castellano", "rrh:whitaker"]);
  const docs: EncounterDocument[] = [];
  const enc: Encounter = { id: g.uid("e"), source: "A", kind: edOnly ? "ed" : "inpatient", start: arrive, admitted, end: discharged, disposition: "home", reason: { dka: "Vomiting, short of breath", aki: "Weakness, decreased urine output", pna: "Cough, fever", cp: "Chest pain", angio: "Lip and tongue swelling" }[kind], clinician: edOnly ? edDoc : hosp, documents: docs };
  g.encounters.push(enc);
  const A = (s: string) => s;
  void A;
  // Make every home med active at arrival visible to the hospital (it re-lists them, T15).
  for (const m of g.meds) if (m.setting !== "inpatient" && !m.otc && ["active", "held"].includes(g.status(m, arrive) ?? "")) m.visibility.A = "both";

  // ED labs.
  const edDraw: LabDraw = { id: g.uid("d"), collectedAt: addMinutes(arrive, 15 + r.int(0, 20)), orderedBy: "A", performedBy: "A", setting: "ed" };
  g.draws.push(edDraw);
  const L = (d: LabDraw, analyte: LabIn["analyte"], value: number, extra: Partial<LabIn> = {}) => {
    const l: LabIn = { id: g.uid("l"), analyte, draw: d.id, value, resultedAt: addMinutes(d.collectedAt, 40 + r.int(0, 30)), visibility: { A: "structured" }, ...extra };
    g.labs.push(l);
    return l;
  };
  const bmp = (d: LabDraw, v: { na: number; k: number; cl: number; co2: number; bun: number; cr: number; glu: number }) => {
    const ag = v.na - v.cl - v.co2;
    return [L(d, "sodium", v.na), L(d, "potassium", v.k), L(d, "chloride", v.cl), L(d, "bicarbonate", v.co2), L(d, "anion-gap", ag), L(d, "bun", v.bun), L(d, "creatinine", v.cr), L(d, "glucose", v.glu)];
  };
  const withEgfr = (labs: LabIn[]) => labs.flatMap((l) => (l.analyte === "creatinine" ? [l.id, `${l.id}_egfr`] : [l.id]));
  const baseCr = g.creat(date);
  const vit = (t: string, sys: number, extra: Partial<Vital> = {}) => {
    const v: Vital = { id: g.uid("v"), kind: "set", at: t, setting: "hospital", source: "A", bp: { systolic: Math.round(sys), diastolic: Math.round(sys * 0.6) }, pulse: r.int(78, 112), resp: r.int(16, 24), tempF: r1(98 + r.next() * 1.2), spo2: r.int(94, 99), weightKg: r1(g.weight), ...extra };
    g.vitals.push(v);
    return v;
  };
  const condA = (key: string, entries: Condition["history"], extra: Partial<Condition> = {}) => {
    const cc = g.cond(key, localDate(arrive), undefined, "A", extra);
    cc.history.push(...entries);
    cc.visibility = { A: "both", ...(ax.inB ? { B: "prose" as const } : {}) };
    return cc;
  };
  const inpatient = (product: string, orderName: string, route: string, doseText: string, start: string, stop: string) => {
    const m: Medication = { id: g.uid("i"), product, rxnorm: ingredientCoding(product), orderName, setting: "inpatient", route, doseText, frequency: "QD",
      history: [{ at: start, status: "active", by: "A" }, { at: stop, status: "stopped", by: "A" }], visibility: { A: "both" } };
    g.meds.push(m);
    return m;
  };
  const home = (klass: DrugClass[]) => g.meds.filter((m) => m.setting !== "inpatient" && !m.otc && klass.includes(drug(m.product).klass) && g.status(m, arrive) === "active");

  const edV = vit(addMinutes(arrive, 6), kind === "dka" ? r.int(98, 118) : kind === "cp" ? r.int(140, 165) : r.int(110, 150));
  const edAt = arrive, edSigned = addMinutes(arrive, 160 + r.int(0, 120));
  const plan: DocItem[] = [{ kind: "vitals", vitalId: edV.id }];
  const facts: string[] = [];
  const nfFor = (statement: string, kind2: NarrativeFact["kind"], evidence: string[][], polarity: NarrativeFact["polarity"] = "affirmed", span?: string, extra: Partial<NarrativeFact> = {}) => {
    const nf: NarrativeFact = { id: g.uid("nf"), at: arrive, kind: kind2, polarity, statement, evidence, ...(span ? { span: { A: span } } : {}), visibility: { A: "prose" }, ...extra };
    g.facts.push(nf);
    return nf;
  };

  if (kind === "cp" || kind === "angio") {
    if (kind === "cp") {
      const lb = bmp(edDraw, { na: r.int(136, 141), k: r1(4 + r.next() * 0.6), cl: r.int(99, 105), co2: r.int(23, 28), bun: r.int(12, 24), cr: baseCr, glu: r.int(98, 180) });
      const trop = L(edDraw, "troponin", 0.01, { comparator: "<", traps: ["T9"] });
      const d2: LabDraw = { id: g.uid("d"), collectedAt: addMinutes(edDraw.collectedAt, 180), orderedBy: "A", performedBy: "A", setting: "ed" };
      g.draws.push(d2);
      const trop2 = L(d2, "troponin", 0.01, { comparator: "<" });
      plan.push({ kind: "lab", panel: "BMP", key: "bmp", labIds: withEgfr(lb) }, { kind: "lab", key: "trop_1", labIds: [trop.id] }, { kind: "lab", key: "trop_2", labIds: [trop2.id] });
      const acs = condA("acs", [{ at: edAt, status: "ruled-out", recordedBy: "A", label: "Chest pain, acute coronary syndrome ruled out", doc: "ed" }], { traps: ["T12"] });
      plan.push({ kind: "dx", conditionId: acs.id });
      const nf = nfFor("Acute coronary syndrome ruled out: two troponins <0.01 three hours apart and an ECG without ischemic changes.", "rule-out", [["ACS|acute coronary|ischemi|myocardial infarction|MI\\b"], ["ruled out|rule out|no evidence|negative|without"]], "negated", undefined, { traps: ["T12"] });
      facts.push(acs.id, trop.id, trop2.id, nf.id);
    } else {
      const lis = home(["acei"])[0] ?? g.startMed("lisinopril-20", at(`${addDays(date, -400)}T10:00`), "B", { vis: ax.homeVis });
      const ang = condA("angioedema", [{ at: edAt, status: "active", recordedBy: "A", label: "Angioedema, ACE inhibitor-associated", doc: "ed" }]);
      lis.history.push({ at: addMinutes(edAt, 30), status: "stopped", by: "A", stopReason: "adverse_reaction", reason: "angioedema", doc: "ed", instructions: "Do not take lisinopril or any ACE inhibitor again" });
      const steroid = inpatient("methylpred-iv", "methylprednisolone IV", "IV", "125 mg once", addMinutes(edAt, 25), addMinutes(edAt, 26));
      plan.push({ kind: "dx", conditionId: ang.id }, { kind: "inpatient-med", medId: steroid.id });
      const a = { id: g.uid("a"), substance: ingredientCoding("lisinopril-10")!, type: "allergy" as const, reaction: "angioedema of lips and tongue", reactions: ["Angioedema"], criticality: "high" as const,
        onset: date, recordedAt: at(`${weekday(addDays(date, r.int(4, 10)), r)}T${hhmm(r.int(9, 15), r.int(0, 59))}`), recordedBy: "B" as SourceKey, manifestation: ang.id, visibility: { B: "both" as const, A: "structured" as const } };
      if (ax.inB) {
        g.allergies.push(a);
        const e = g.bEncounter(addMinutes(a.recordedAt, -20), "ED follow-up: angioedema");
        e.documents[0].factIds.push(a.id, lis.id, ang.id);
        e.addressed = [{ conditionId: ang.id }];
        // Already on amlodipine: raise its dose instead of opening a second amlodipine line.
        const onCcb = g.activeClass(a.recordedAt, ["ccb"])[0] ?? g.meds.find((m) => m.setting !== "inpatient" && drug(m.product).klass === "ccb");
        const alt = onCcb ?? g.startMed("amlodipine-5", addMinutes(a.recordedAt, 3), "B", { reason: "replacing lisinopril (angioedema)", vis: ax.homeVis });
        if (onCcb && g.currentProduct(onCcb, a.recordedAt) === "amlodipine-5") g.change(onCcb, addMinutes(a.recordedAt, 3), "B", { product: "amlodipine-10", dose: { value: 10, unit: "mg" }, doseText: "10 mg", reason: "replacing lisinopril (angioedema)" });
        e.documents[0].factIds.push(alt.id);
        lis.history.push({ at: addMinutes(a.recordedAt, 2), status: "stopped", by: "B", stopReason: "adverse_reaction", reason: "angioedema" });
      }
      g.aceiAvoid = true;
      facts.push(ang.id, lis.id);
    }
    docs.push({ key: "ed", kind: "ed-note", at: edAt, signedAt: edSigned, author: edDoc, factIds: facts, plan });
    return;
  }

  // Inpatient stays.
  const dayDraws: LabDraw[] = [];
  const mkDraw = (t: string, setting: LabDraw["setting"]) => { const d: LabDraw = { id: g.uid("d"), collectedAt: t, orderedBy: "A", performedBy: "A", setting }; g.draws.push(d); dayDraws.push(d); return d; };
  const hpAt = addMinutes(admitted!, 40 + r.int(0, 40));
  const hpSigned = addMinutes(hpAt, 90 + r.int(0, 60));
  const pnDays = [] as string[];
  for (let i = 1; i <= los; i++) pnDays.push(addDays(localDate(admitted!), i));
  const dcSigned = addMinutes(discharged, 180 + r.int(0, 150));
  const hpPlan: DocItem[] = [];
  const dcPlan: DocItem[] = [];
  const hpFacts: string[] = [], dcFacts: string[] = [], edFacts: string[] = [];
  const pnDocs: EncounterDocument[] = [];
  let consult: EncounterDocument | undefined;

  const inStay = (h: MedHistoryEntry) => h.by === "A" && ms(h.at) >= ms(arrive) && ms(h.at) <= ms(discharged) + 86400000;
  const holdAt = (m: Medication, doc: string, t: string, extra: Partial<MedHistoryEntry>) => m.history.push({ at: t, status: "held", by: "A", doc, ...extra });
  const resumeAt = (m: Medication, doc: string, t: string) => m.history.push({ at: t, status: "active", by: "A", doc });

  const hpV = vit(addMinutes(hpAt, -10), r.int(104, 132));
  hpPlan.push({ kind: "vitals", vitalId: hpV.id });
  const dcV = vit(addMinutes(discharged, -180), r.int(118, 138));

  // Diuretics are held for volume depletion; every other home medication is continued by the admitting team.
  if (kind === "dka" || kind === "aki") {
    for (const m of home(["thiazide", "loop"])) {
      if (m.history.some(inStay)) continue;
      holdAt(m, "hp", hpAt, { restartAdvice: kind === "dka" ? "resume_when_able" : "prescriber_decides", instructions: "Hold for volume depletion", intendResume: true });
      if (kind === "dka") resumeAt(m, "dc", addMinutes(discharged, 30));
      else holdAt(m, "dc", addMinutes(discharged, 30), { restartAdvice: "prescriber_decides", instructions: "PCP to decide after a repeat BMP", intendResume: true });
      hpFacts.push(m.id); dcFacts.push(m.id);
    }
  }
  if (kind === "dka") {
    const prec = g.has.has("dka_prec");
    const sg = home(["sglt2i"])[0]!;
    const met = home(["biguanide"])[0];
    const raas = home(["acei", "arb"])[0];
    const k0 = r1(4.6 + r.next() * 1.0);
    const ed = bmp(edDraw, { na: r.int(128, 135), k: k0, cl: r.int(92, 100), co2: r.int(8, 14), bun: r.int(24, 40), cr: r2(baseCr * (1.15 + r.next() * 0.3)), glu: r.int(150, 245) });
    const ph = L(edDraw, "ph", r2(7.08 + r.next() * 0.15), { specimen: "venous-blood" });
    const pco2 = L(edDraw, "pco2", r.int(20, 30), { specimen: "venous-blood" });
    const bhb = L(edDraw, "bhb", r1(4.2 + r.next() * 3), { traps: ["T16"] });
    const lip = r.chance(0.4) ? L(edDraw, "lipase", r.int(20, 55), { resultedAt: addMinutes(edDraw.collectedAt, 230) }) : undefined;
    plan.push({ kind: "lab", panel: "BMP", key: "bmp", labIds: withEgfr(ed) }, { kind: "lab", panel: "VBG", key: "vbg", labIds: [ph.id, pco2.id] }, { kind: "lab", key: "bhb", labIds: [bhb.id] });
    const dka = condA("dka", [
      { at: edAt, status: "active", recordedBy: "A", label: "Diabetic ketoacidosis, euglycemic", doc: "ed" },
      { at: hpAt, status: "active", recordedBy: "A", label: "Euglycemic DKA, SGLT2 inhibitor-associated", subtype: "sglt2i", doc: "hp" },
      { at: addMinutes(discharged, -60), status: "resolved", recordedBy: "A", doc: "dc" },
    ], { traps: ["T18"] });
    dka.name = "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated";
    plan.push({ kind: "dx", conditionId: dka.id });
    edFacts.push(dka.id, sg.id, ...withEgfr(ed).slice(0, 2));
    let panc: Condition | undefined;
    if (lip) {
      panc = condA("pancreatitis", [{ at: edAt, status: "working", recordedBy: "A", label: "R/O pancreatitis", doc: "ed" }, { at: hpAt, status: "ruled-out", recordedBy: "A", label: "Acute pancreatitis", doc: "hp" }], { traps: ["T12"] });
      plan.push({ kind: "dx", conditionId: panc.id });
      edFacts.push(panc.id);
    }
    const ivIns = inpatient("regular-insulin", "insulin regular (human) IV infusion", "IV", "per DKA protocol, 0.1 units/kg/h", addMinutes(arrive, 70), at(`${pnDays[0]}T09:00`));
    const d5 = inpatient("fluid-d5lr", "dextrose 5% in lactated Ringer's", "IV", "150 mL/h", addMinutes(arrive, 70), at(`${pnDays[0]}T09:00`));
    const gla = inpatient("glargine-100", "insulin glargine", "SubQ", `${r.int(10, 18)} units daily`, at(`${pnDays[0]}T07:00`), addMinutes(discharged, -240));
    plan.push({ kind: "inpatient-med", medId: ivIns.id });
    // Precipitant: prose only (T13). Without one, the notes say none was found (a negation, T12).
    let precFact: NarrativeFact;
    if (prec) {
      const pr = r.pick(PRECIPITANTS);
      precFact = nfFor(`The ketoacidosis was ${pr.statement}.`, "precipitant", pr.evidence, "affirmed", "precipitant", { about: [dka.id], traps: ["T13"], visibility: { A: "prose", ...(ax.inP ? { P: "prose" as const } : {}) } });
      if (ax.inP) g.home.notes.push({ id: g.uid("n"), at: at(`${addDays(date, -1)}T${hhmm(r.int(18, 21), r.int(0, 59))}`), tags: ["nausea", "poor_appetite"], severity: 3, factIds: [precFact.id], gist: pr.diary });
    } else {
      precFact = nfFor("No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery.", "context", [["no (clear|obvious|identifiable) (precipitant|trigger|cause)|precipitant (is |was )?(unclear|not (clear|identified))|without (a |an )?(clear|obvious) (precipitant|trigger)"]], "negated", undefined, { about: [dka.id], traps: ["T12"] });
    }
    hpFacts.push(precFact.id, dka.id, sg.id, ...(met ? [met.id] : []), ...(raas ? [raas.id] : []), ...(panc ? [panc.id] : []));
    holdAt(sg, "hp", hpAt, {});
    if (met) holdAt(met, "hp", hpAt, { restartAdvice: "resume_when_able", instructions: "Hold while acidotic and NPO", intendResume: true });
    if (raas && k0 >= 5) holdAt(raas, "hp", hpAt, { restartAdvice: "resume_when_able", instructions: "Hold for volume depletion and potassium; resume when eating", intendResume: true });
    hpPlan.push({ kind: "dx", conditionId: dka.id, rank: "principal" });
    if (panc) hpPlan.push({ kind: "dx", conditionId: panc.id, rank: "secondary" }, { kind: "lab", key: "lipase", labIds: [lip!.id] });
    hpPlan.push({ kind: "lab", panel: "BMP", key: "bmp", labIds: withEgfr(ed) }, { kind: "inpatient-med", medId: ivIns.id }, { kind: "inpatient-med", medId: d5.id });
    // Daily labs; the gap closes the first morning.
    const pnLabs: string[][] = [];
    pnDays.forEach((d, i) => {
      const dd = mkDraw(at(`${d}T06:${String(r.int(0, 30)).padStart(2, "0")}`), "inpatient");
      const closed = i >= 0;
      const lb = bmp(dd, { na: r.int(131, 137), k: r1(3.9 + r.next() * 0.6), cl: r.int(98, 104), co2: closed ? r.int(19, 24) : r.int(14, 18), bun: r.int(14, 26), cr: r2(baseCr * (1.05 + r.next() * 0.15)), glu: r.int(120, 190) });
      const extras = i === 0 ? [L(dd, "bhb", r1(0.2 + r.next() * 0.6), { finalAt: addMinutes(dd.collectedAt, 480) })] : [];
      pnLabs.push([...withEgfr(lb), ...extras.map((x) => x.id)]);
    });
    // Progress notes (all but the discharge day), an endocrinology consult in about half.
    pnDays.slice(0, -1).forEach((d, i) => {
      const t = at(`${d}T${hhmm(7, r.int(30, 59))}`);
      const v = vit(addMinutes(t, -20), r.int(112, 136));
      const doc: EncounterDocument = { key: `pn${i + 1}`, kind: "progress", at: t, signedAt: addMinutes(t, 45 + r.int(0, 50)), author: hosp,
        factIds: [dka.id, ...pnLabs[i].slice(0, 4), ...(i === 0 ? [gla.id, ivIns.id] : [gla.id])],
        plan: [{ kind: "vitals", vitalId: v.id }, { kind: "dx", conditionId: dka.id, rank: "principal" }, { kind: "lab", panel: "BMP", key: "bmp", labIds: pnLabs[i].filter((x) => !g.labs.find((l) => l.id === x && l.analyte === "bhb")) },
          ...(i === 0 ? [{ kind: "inpatient-med" as const, medId: ivIns.id }] : []), { kind: "inpatient-med", medId: gla.id }] };
      pnDocs.push(doc);
    });
    if (r.chance(0.5)) {
      const t = at(`${pnDays[0]}T${hhmm(r.int(10, 14), r.int(0, 59))}`);
      const nfE = nfFor("Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.", "decision", [["SGLT2|empagliflozin|dapagliflozin|canagliflozin"], ["not|against|avoid|do not"]], "affirmed", undefined, { about: [sg.id] });
      consult = { key: "consult", kind: "consult", at: t, signedAt: addMinutes(t, 70 + r.int(0, 60)), author: "rrh:vasquez", factIds: [dka.id, sg.id, nfE.id, gla.id],
        plan: [{ kind: "dx", conditionId: dka.id }, { kind: "lab", key: "bhb_1", labIds: [bhb.id] }, { kind: "inpatient-med", medId: ivIns.id }, { kind: "inpatient-med", medId: gla.id }, { kind: "allergies" }, { kind: "home-meds" }] };
      holdAt(sg, "consult", t, { restartAdvice: "advise_against", instructions: "Recommend against restarting at discharge" });
    }
    // Discharge.
    holdAt(sg, "dc", addMinutes(discharged, 30), { restartAdvice: "advise_against", instructions: "Do not resume until reviewed by PCP", intendResume: false });
    if (met) resumeAt(met, "dc", addMinutes(discharged, 30));
    if (raas && k0 >= 5) resumeAt(raas, "dc", addMinutes(discharged, 30));
    const lastDraw = dayDraws[dayDraws.length - 1];
    dcPlan.push({ kind: "dx", conditionId: dka.id, rank: "principal" }, ...(panc ? [{ kind: "dx" as const, conditionId: panc.id, rank: "secondary" as const }] : []),
      { kind: "vitals", vitalId: dcV.id }, { kind: "lab", panel: "BMP", key: "bmp_dc", labIds: pnLabs[pnLabs.length - 1].filter((x) => !g.labs.find((l) => l.id === x && l.analyte === "bhb")) }, { kind: "allergies" }, { kind: "home-meds" },
      { kind: "follow-up", key: "fu_pcp", with: "Primary care (Northgate Family Medicine)", when: "within 1 week", purpose: `Decide whether to restart ${drug(sg.product).ingredient}; recheck basic metabolic panel` });
    void lastDraw;
    dcFacts.push(precFact.id, dka.id, sg.id, ...(met ? [met.id] : []), ...(raas && k0 >= 5 ? [raas.id] : []), ...(panc ? [panc.id] : []));
    g.dkaHistory = true;
    // Primary-care follow-up: stop the SGLT2i for good, record the adverse reaction (T18), maybe sick-day rules.
    if (ax.inB) {
      const fu = at(`${weekday(addDays(dcDate, r.int(5, 12)), r)}T${hhmm(r.int(8, 15), r.pick([0, 15, 30, 45]))}`);
      const e = g.bEncounter(fu, "Hosp f/u");
      e.billingExtra = [{ icd10: "Z09", display: "Follow-up exam after completed treatment" }];
      if (ax.c.dm) e.addressed = [{ conditionId: ax.c.dm.id }];
      g.set(sg, addMinutes(fu, 22), "B", "stopped", { stopReason: "adverse_reaction", reason: "euglycemic DKA" });
      const a = { id: g.uid("a"), substance: sg.rxnorm!, type: "adverse-reaction" as const, reaction: "euglycemic diabetic ketoacidosis", reactions: ["Diabetic ketoacidosis"], criticality: "high" as const,
        onset: date, recordedAt: addMinutes(fu, 25), recordedBy: "B" as SourceKey, manifestation: dka.id, visibility: { B: "both" as const, A: "structured" as const }, traps: ["T18"] as TrapId[] };
      g.allergies.push(a);
      e.documents[0].factIds.push(dka.id, sg.id, a.id);
      const sv = g.vitalSet(addMinutes(fu, -10), "B", g.clinicSbp(localDate(fu)), 78);
      e.documents[0].factIds.push(sv.id);
      if (g.has.has("dka_prec") ? r.chance(0.6) : r.chance(0.3)) {
        const nf: NarrativeFact = { id: g.uid("nf"), at: fu, kind: "teaching", polarity: "affirmed", statement: "Sick-day rules reviewed.", evidence: [["sick[- ]day"]], span: { B: "sick_day" }, visibility: { B: "prose" }, traps: ["T13"] };
        g.facts.push(nf);
        e.documents[0].factIds.push(nf.id);
      }
      traps(g, sg.id, "T1", "T18");
    }
  } else if (kind === "aki" || kind === "pna") {
    const raas = home(["acei", "arb"]);
    const mra = home(["mra", "ns-mra"]);
    const met = home(["biguanide"])[0];
    const sg = home(["sglt2i"])[0];
    const aki = kind === "aki";
    const crF = aki ? 1.8 + r.next() * 0.8 : 1.25 + r.next() * 0.35;
    const k0 = aki ? r1(6.0 + r.next() * 0.8) : r1(4.2 + r.next() * 0.7);
    const ed = bmp(edDraw, { na: r.int(129, 138), k: k0, cl: r.int(96, 106), co2: r.int(16, 23), bun: r.int(30, 60), cr: r2(baseCr * crF), glu: r.int(110, 210) });
    plan.push({ kind: "lab", panel: "BMP", key: "bmp", labIds: withEgfr(ed) });
    let cbcIds: string[] = [];
    if (!aki) { const w = L(edDraw, "wbc", r1(12 + r.next() * 6)), h = L(edDraw, "hemoglobin", r1(12 + r.next() * 2)), pl = L(edDraw, "platelets", r.int(180, 360)); cbcIds = [w.id, h.id, pl.id]; plan.push({ kind: "lab", panel: "CBC", key: "cbc", labIds: cbcIds }); }
    const main = aki
      ? condA("aki", [{ at: edAt, status: "active", recordedBy: "A", doc: "ed" }, { at: addMinutes(discharged, -60), status: "resolved", recordedBy: "A", doc: "dc" }])
      : condA("pneumonia", [{ at: edAt, status: "active", recordedBy: "A", label: "Community-acquired pneumonia", doc: "ed" }, { at: addMinutes(discharged, -60), status: "resolved", recordedBy: "A", doc: "dc" }]);
    const hk = aki ? condA("hyperkalemia", [{ at: edAt, status: "active", recordedBy: "A", doc: "ed" }, { at: addMinutes(discharged, -60), status: "resolved", recordedBy: "A", doc: "dc" }]) : undefined;
    plan.push({ kind: "dx", conditionId: main.id }, ...(hk ? [{ kind: "dx" as const, conditionId: hk.id }] : []));
    const fluids = inpatient("fluid-ns", "sodium chloride 0.9%", "IV", aki ? "1000 mL bolus, then 125 mL/h" : "75 mL/h", addMinutes(arrive, 50), addMinutes(admitted!, 1440));
    const abx = aki ? inpatient("calcium-gluconate", "calcium gluconate IV", "IV", "1 g once", addMinutes(arrive, 40), addMinutes(arrive, 50)) : inpatient("ceftriaxone-1000", "ceftriaxone IV", "IV", "1 g every 24 h", addMinutes(arrive, 90), addMinutes(discharged, -120));
    plan.push({ kind: "inpatient-med", medId: fluids.id }, { kind: "inpatient-med", medId: abx.id });
    let precFact: NarrativeFact | undefined;
    if (aki) {
      const nsaid = g.rng.chance(0.5);
      precFact = nfFor(nsaid ? "AKI attributed to several days of over-the-counter naproxen for back pain on top of an ARB/diuretic, with poor fluid intake." : "AKI attributed to volume depletion from diarrhea for four days while continuing the ARB and diuretic.",
        "precipitant", nsaid ? [["naproxen|aleve|NSAID|ibuprofen"]] : [["diarrh|volume deplet|dehydrat"]], "affirmed", "precipitant", { about: [main.id], traps: ["T13"] });
      edFacts.push(main.id, hk!.id, ...withEgfr(ed).slice(0, 3));
    } else edFacts.push(main.id, ...cbcIds.slice(0, 1));
    hpFacts.push(main.id, ...(hk ? [hk.id] : []), ...(precFact ? [precFact.id] : []));
    hpPlan.push({ kind: "dx", conditionId: main.id, rank: "principal" }, ...(hk ? [{ kind: "dx" as const, conditionId: hk.id, rank: "secondary" as const }] : []), { kind: "lab", panel: "BMP", key: "bmp", labIds: withEgfr(ed) }, { kind: "inpatient-med", medId: fluids.id });
    for (const m of [...raas, ...mra]) { if (aki || r.chance(0.3)) { holdAt(m, "hp", hpAt, { restartAdvice: "resume_when_able", instructions: "Hold until creatinine back to baseline", intendResume: true }); hpFacts.push(m.id); } }
    if (met) { holdAt(met, "hp", hpAt, { restartAdvice: "resume_when_able", instructions: "Hold during acute illness", intendResume: true }); hpFacts.push(met.id); }
    if (sg) { holdAt(sg, "hp", hpAt, { restartAdvice: "resume_when_able", instructions: "Hold while not eating", intendResume: true }); hpFacts.push(sg.id); }
    const pnLabs: string[][] = [];
    pnDays.forEach((d, i) => {
      const dd = mkDraw(at(`${d}T06:${String(r.int(0, 30)).padStart(2, "0")}`), "inpatient");
      const frac = (i + 1) / pnDays.length;
      const lb = bmp(dd, { na: r.int(133, 139), k: r1(Math.max(3.9, k0 - 1.2 * frac - r.next() * 0.3)), cl: r.int(99, 105), co2: r.int(21, 26), bun: r.int(15, 35), cr: r2(baseCr * (crF - (crF - 1.1) * frac)), glu: r.int(100, 170) });
      pnLabs.push(withEgfr(lb));
    });
    pnDays.slice(0, -1).forEach((d, i) => {
      const t = at(`${d}T${hhmm(7, r.int(30, 59))}`);
      const v = vit(addMinutes(t, -20), r.int(110, 140));
      pnDocs.push({ key: `pn${i + 1}`, kind: "progress", at: t, signedAt: addMinutes(t, 45 + r.int(0, 50)), author: hosp, factIds: [main.id, ...pnLabs[i].slice(0, 4)],
        plan: [{ kind: "vitals", vitalId: v.id }, { kind: "dx", conditionId: main.id, rank: "principal" }, { kind: "lab", panel: "BMP", key: "bmp", labIds: pnLabs[i] }, { kind: "inpatient-med", medId: fluids.id }] });
    });
    // Discharge: ARB/MRA stay held for the PCP to decide (AKI) or resume (pneumonia).
    for (const m of [...raas, ...mra]) {
      if (!m.history.some((h) => inStay(h) && h.status === "held")) continue;
      if (aki && drug(m.product).klass !== "acei" && drug(m.product).klass !== "arb") m.history.push({ at: addMinutes(discharged, 30), status: "stopped", by: "A", doc: "dc", reason: "hyperkalemia" });
      else if (aki) holdAt(m, "dc", addMinutes(discharged, 30), { restartAdvice: "prescriber_decides", instructions: "PCP to decide on restarting after a repeat BMP", intendResume: true });
      else resumeAt(m, "dc", addMinutes(discharged, 30));
      dcFacts.push(m.id);
      traps(g, m.id, "T1");
    }
    if (met) resumeAt(met, "dc", addMinutes(discharged, 30));
    if (sg) resumeAt(sg, "dc", addMinutes(discharged, 30));
    dcPlan.push({ kind: "dx", conditionId: main.id, rank: "principal" }, ...(hk ? [{ kind: "dx" as const, conditionId: hk.id, rank: "secondary" as const }] : []), { kind: "vitals", vitalId: dcV.id },
      { kind: "lab", panel: "BMP", key: "bmp_dc", labIds: pnLabs[pnLabs.length - 1] }, { kind: "allergies" }, { kind: "home-meds" },
      { kind: "follow-up", key: "fu_pcp", with: "Primary care (Northgate Family Medicine)", when: "within 1 week", purpose: aki ? "Repeat BMP; decide on restarting held blood pressure medicines" : "Recheck symptoms and chest exam" });
    dcFacts.push(main.id, ...(precFact ? [precFact.id] : []), ...(met ? [met.id] : []));
    // Primary care decides on the held medicines a week or two later.
    const stillHeld = g.meds.filter((m) => m.history.some((h) => inStay(h) && h.doc === "dc" && h.status === "held"));
    if (ax.inB && stillHeld.length) {
      const fu = at(`${weekday(addDays(dcDate, r.int(6, 14)), r)}T${hhmm(r.int(8, 15), r.pick([0, 15, 30, 45]))}`);
      const e = g.bEncounter(fu, "Hosp f/u");
      e.billingExtra = [{ icd10: "Z09", display: "Follow-up exam after completed treatment" }];
      const sv = g.vitalSet(addMinutes(fu, -10), "B", g.clinicSbp(localDate(fu)), 78);
      e.documents[0].factIds.push(main.id, sv.id);
      stillHeld.forEach((m, i) => {
        if (r.chance(0.7)) g.change(m, addMinutes(fu, 20 + i), "B", { reason: "creatinine back to baseline" });
        else g.set(m, addMinutes(fu, 20 + i), "B", "stopped", { stopReason: "adverse_reaction", reason: aki ? "AKI with hyperkalemia" : "hospitalization" });
        e.documents[0].factIds.push(m.id);
      });
    }
  }
  for (const m of g.meds) {
    if (m.setting === "inpatient" || m.otc || g.status(m, arrive) !== "active") continue;
    if (!m.history.some((h) => inStay(h) && h.doc === "hp")) m.history.push({ at: hpAt, status: "active", by: "A", doc: "hp" });
  }
  docs.push({ key: "ed", kind: "ed-note", at: edAt, signedAt: edSigned, author: edDoc, factIds: [...new Set(edFacts)], plan });
  docs.push({ key: "hp", kind: "h&p", at: hpAt, signedAt: hpSigned, author: hosp, factIds: [...new Set(hpFacts)], plan: hpPlan });
  docs.push(...pnDocs);
  if (consult) docs.push(consult);
  docs.push({ key: "dc", kind: "discharge", at: admitted!, signedAt: dcSigned, author: hosp, factIds: [...new Set(dcFacts)], plan: dcPlan });
}

function traps(g: Gen, id: string, ...t: string[]) {
  const all = [...g.conditions, ...g.meds, ...g.labs, ...g.allergies, ...g.facts] as { id: string; traps?: string[] }[];
  const f = all.find((x) => x.id === id);
  if (f) f.traps = [...new Set([...(f.traps ?? []), ...t])];
}

// ─── Nephrology ─────────────────────────────────────────────────────────────────────────────────

function nephrology(g: Gen, x: { c: Record<string, Condition>; ckdLine?: Condition; homeVis: SourceKey[]; plan: Record<string, string> }) {
  const r = g.rng.fork("neph");
  g.neph = true;
  g.nephDoc = r.pick(["lv:marsh", "lv:adeyemi"]);
  // Referral when the eGFR first falls below 45 (or later for albuminuria), after 2021.
  let refDate = "";
  for (let d = "2021-06-01"; d < addDays(T, -120); d = addDays(d, 30)) if (g.egfr(d) < 45 || g.uacr(d) > 350) { refDate = d; break; }
  if (!refDate) refDate = addDays(T, -r.int(300, 500));
  const office = g.encounters.filter((e) => e.source === "B" && e.kind === "office" && localDate(e.start) >= "2021-01-01").sort((a, b) => ms(a.start) - ms(b.start));
  const refEnc = office.find((e) => localDate(e.start) >= refDate) ?? office[office.length - 1];
  if (!refEnc) return;
  const created = addMinutes(refEnc.start, 45);
  const npDate = weekday(addDays(localDate(created), r.int(35, 75)), r);
  if (npDate >= addDays(T, -14)) return;
  const ckd = x.ckdLine ?? g.conditions.find((c) => c.coding.some((k) => k.code.startsWith("N18")));
  const dxIds = [ckd, x.c.dm, x.c.htn].filter(Boolean).map((c) => c!.id);
  const npStart = at(`${npDate}T${hhmm(r.int(8, 14), r.pick([0, 30]))}`);
  g.referrals.push({
    id: g.uid("rf"), by: "B", author: refEnc.clinician!, encounter: refEnc.id, created,
    to: { org: "Lakeview Kidney Care", specialty: "Nephrology" }, question: `eGFR ${Math.round(g.egfr(localDate(created)))}, UACR ${g.uacr(localDate(created))} mg/g: CKD evaluation and management`,
    urgency: "routine", scheduled: addMinutes(created, 60 * 24 * r.int(3, 10)), appointmentOn: npDate, closed: addMinutes(npStart, 60 * 24 * r.int(5, 12)),
    dx: dxIds, factIds: [...dxIds],
  });
  refEnc.reviewed = ["problems", "medications"];
  // Visits: new patient, then follow-ups every 3-6 months, each with labs ordered by the clinic.
  const dates = [npDate];
  for (let d = addDays(npDate, r.int(90, 180)); d < addDays(T, -10); d = addDays(d, r.int(90, 180))) dates.push(weekday(d, r));
  const clinicMeds: Medication[] = [];
  dates.forEach((d, i) => {
    const start = i === 0 ? npStart : at(`${d}T${hhmm(r.int(8, 15), r.pick([0, 20, 40]))}`);
    const eg = g.egfr(d);
    const ua = g.uacr(d);
    const G = eg >= 60 ? "G2" : eg >= 45 ? "G3a" : eg >= 30 ? "G3b" : eg >= 15 ? "G4" : "G5";
    const Acat = ua < 30 ? "A1" : ua <= 300 ? "A2" : "A3";
    const e: Encounter = { id: g.uid("e"), source: "C", kind: "office", start, reason: i === 0 ? "New patient: CKD" : "CKD follow-up", clinician: g.nephDoc,
      ckdCategory: { g: G, a: Acat }, referredBy: i === 0 ? `Northgate Family Medicine - Dr ${refEnc.clinician === "ngf:treyes" ? "Reyes" : refEnc.clinician === "ngf:dkhan" ? "Khan" : refEnc.clinician === "ngf:mbrennan" ? "Brennan" : "Patel"}` : undefined,
      addressed: [], documents: [] };
    // The clinic's own stage, recorded on the condition (T5: Northgate's line may lag).
    if (ckd) {
      const stage = `${G.slice(1)} ${Acat}`;
      const icd = G === "G3a" ? "N18.31" : G === "G3b" ? "N18.32" : G === "G4" ? "N18.4" : G === "G2" ? "N18.2" : "N18.5";
      ckd.history.push({ at: start, status: "active", stage, recordedBy: "C", icd10: icd });
      ckd.visibility.C = "both";
      e.addressed!.push({ conditionId: ckd.id, status: "active", icd10: icd });
    }
    if (x.c.dm) e.addressed!.push({ conditionId: x.c.dm.id, status: "active", icd10: "E11.22", label: "Type 2 diabetes mellitus with diabetic chronic kidney disease" });
    if (x.c.htn) e.addressed!.push({ conditionId: x.c.htn.id, status: "active", icd10: "I12.9" });
    if (g.dkaHistory) { const dka = g.conditions.find((c) => c.coding.some((k) => k.code === "E11.10")); if (dka) { e.addressed!.push({ conditionId: dka.id, status: "history", icd10: "Z86.39" }); dka.visibility.C = "both"; } }
    for (const a of e.addressed!) { const cc = g.conditions.find((c) => c.id === a.conditionId)!; cc.visibility.C = "both"; }
    const v = g.vitalSet(addMinutes(start, 4), "C", g.clinicSbp(d), 80);
    const labT = at(`${d}T${hhmm(7, r.int(10, 50))}`);
    const draw = g.drawC(ms(labT) < ms(start) ? labT : addMinutes(start, -90), "C", g.nephDoc, g.routineValues(d, { uacr: i % 2 === 0, na: true }));
    const facts: string[] = [v.id, ...draw.labs.filter((l) => ["creatinine", "potassium", "uacr"].includes(l.analyte)).map((l) => (l.analyte === "creatinine" ? `${l.id}_egfr` : l.id)), ...e.addressed!.map((a) => a.conditionId)];
    // Treatment decisions (prescriptions are the clinic's own; Northgate copies them as outside lines, T1/T16).
    const t0 = addMinutes(start, 25);
    if (i === 0) {
      const sg = g.activeClass(d, ["sglt2i"])[0];
      // No second SGLT2i line: a later primary-care start may already exist in the simulation.
      if (!sg && !g.dkaHistory && eg >= 20 && r.chance(0.6) && !g.meds.some((m) => m.setting !== "inpatient" && drug(m.product).klass === "sglt2i")) {
        const m = g.startMed("dapagliflozin-10", t0, "C", { reason: "CKD with albuminuria", vis: ["C", ...x.homeVis] });
        clinicMeds.push(m); facts.push(m.id);
      } else if (g.dkaHistory) {
        const nf: NarrativeFact = { id: g.uid("nf"), at: start, kind: "decision", polarity: "affirmed", statement: "Not starting an SGLT2 inhibitor because of the prior SGLT2i-associated DKA.", evidence: [["SGLT2"], ["not|no |avoid|hold off"]], span: { C: "sglt2_decision" }, visibility: { C: "prose" }, traps: ["T13"] };
        g.facts.push(nf); facts.push(nf.id);
      }
      if (x.c.dm && ua >= 30 && g.activeClass(d, ["acei", "arb"]).length && !g.activeClass(d, ["mra", "ns-mra"]).length && g.potassium(d) < 4.9 && r.chance(0.55)) {
        const m = g.startMed("finerenone-10", t0, "C", { reason: "albuminuria persists on ARB", vis: ["C", "B"] });
        m.visibility = { C: "both", B: "both" };
        m.laggingLines = [{ source: "B", showsStatus: "active", since: at(`${weekday(addDays(d, r.int(5, 15)), r)}T${hhmm(r.int(9, 15), r.int(0, 59))}`) }];
        m.history[0].reason = "albuminuria persists on ARB";
        m.traps = ["T1", "T16"];
        clinicMeds.push(m); facts.push(m.id);
      }
      if (r.chance(0.35)) {
        const nf: NarrativeFact = { id: g.uid("nf"), at: start, kind: "decision", polarity: "affirmed", statement: "Advised to avoid NSAIDs (ibuprofen, naproxen) for kidney protection.", evidence: [["NSAID|ibuprofen|naproxen|Advil|Aleve"]], visibility: { C: "prose" }, traps: ["T13"] };
        g.facts.push(nf); facts.push(nf.id);
      }
    }
    e.documents.push({ key: "note", kind: "office-note", at: start, signedAt: addMinutes(start, 200 + r.int(0, 240)), author: g.nephDoc, factIds: [...new Set(facts)] });
    g.encounters.push(e);
  });
  // Stale problem list (T5): Northgate's latest stage differs from the clinic's latest assessment.
  if (ckd) {
    const bStage = [...ckd.history].reverse().find((h) => h.recordedBy === "B" && h.stage)?.stage;
    const cStage = [...ckd.history].reverse().find((h) => h.recordedBy === "C" && h.stage)?.stage?.split(" ")[0];
    if (bStage && cStage && bStage !== cStage) traps(g, ckd.id, "T5");
  }
  // A clinic-prescribed MRA held for potassium by phone (T1) in some.
  const fin = clinicMeds.find((m) => drug(m.product).klass === "ns-mra");
  if (fin && r.chance(0.5)) {
    const d = weekday(addDays(localDate(fin.history[0].at), r.int(30, 60)), r);
    if (d < addDays(T, -5)) {
      const t1 = at(`${d}T07:${String(r.int(20, 55)).padStart(2, "0")}`);
      const kv = r1(5.6 + r.next() * 0.5);
      const d1 = g.drawC(t1, "C", g.nephDoc, { creatinine: g.creat(d), potassium: kv });
      const k1 = d1.labs.find((l) => l.analyte === "potassium")!;
      k1.annotations = ["not hemolyzed"];
      const d2 = g.drawC(addMinutes(t1, 270), "C", g.nephDoc, { potassium: r1(Math.max(5.5, kv - 0.1)) });
      d2.labs[0].confirms = k1.id;
      k1.traps = ["T3"];
      const ph = addMinutes(d2.labs[0].resultedAt!, 70);
      const e: Encounter = { id: g.uid("e"), source: "C", kind: "phone", start: ph, reason: "Hyperkalemia", clinician: g.nephDoc,
        documents: [{ key: "note", kind: "phone-note", at: ph, signedAt: addMinutes(ph, 20), author: g.nephDoc, factIds: [k1.id, d2.labs[0].id, fin.id] }] };
      g.encounters.push(e);
      g.set(fin, addMinutes(ph, 10), "C", "held", { reason: `K ${kv} / ${d2.labs[0].value} confirmed`, intendResume: true, reviewOn: addDays(d, 14) });
    }
  }
  void x.plan;
}

// ─── HomeLog ────────────────────────────────────────────────────────────────────────────────────

function homeLog(g: Gen, o: { masked: boolean; mmol: boolean; nsaid: boolean; typedDup: boolean; plan: Record<string, string> }) {
  const r = g.rng.fork("homelog");
  const pStart = o.mmol ? addDays("2023-10-01", r.int(0, 250)) : addDays(T, -r.int(90, 420));
  let pEnd = o.masked || r.chance(0.7) ? addDays(T, -r.int(1, 4)) : addDays(T, -r.int(20, 200));
  if (o.mmol && !o.masked) pEnd = addDays(pStart, r.int(300, 540)) < pEnd ? addDays(pStart, r.int(300, 540)) : pEnd;
  const switchDate = o.mmol ? addDays(pStart, r.int(40, Math.max(41, Math.min(500, Math.floor(yrs(pStart, pEnd) * 365) - 30)))) : "";
  const perWeek = o.masked ? 3 : r.pick([1, 1, 1.5, 2]);
  const homeSbpOffset = o.masked ? 0 : r.int(-8, 4);
  const insulin = g.meds.find((m) => drug(m.product).klass === "basal-insulin" && m.setting !== "inpatient");
  // OTC NSAID only the patient knows about (T13).
  let nsaid: Medication | undefined;
  if (o.nsaid) {
    const prod = r.pick(["ibuprofen-200", "naproxen-220"]);
    nsaid = g.startMed(prod, String(+pStart.slice(0, 4) - r.int(0, 2)), "P", { otc: true, vis: ["P"], dose: prod === "ibuprofen-200" ? 400 : 220, freq: "PRN" });
    nsaid.history[0].takenAs = prod === "ibuprofen-200" ? "2 when my back hurts, a few times a week" : "1 or 2 for my knee, most days";
    nsaid.doseText = prod === "ibuprofen-200" ? "400 mg (2 × 200 mg)" : "220-440 mg";
    nsaid.traps = ["T13"];
  }
  let day = pStart;
  while (day <= pEnd) {
    const dr = r.fork(`day/${day}`);
    if (dr.next() < perWeek / 7) {
      const hh = dr.int(6, 8), mm = dr.int(0, 59);
      if (g.htn || o.masked) {
        const base = o.masked && day >= addDays(T, -60) ? dr.int(136, 149) : g.clinicSbp(day) + 4 + homeSbpOffset;
        const v: Vital = { id: g.uid("h"), kind: "bp", at: at(`${day}T${hhmm(hh, mm)}`), setting: "home", source: "P", bp: { systolic: Math.round(base + dr.normal(0, 3)), diastolic: Math.round(base * 0.6 + dr.normal(0, 3)) }, pulse: dr.int(60, 86), entryMethod: "device", arm: dr.pick(["left", "right"]) };
        g.vitals.push(v);
        if (o.typedDup && dr.chance(0.08)) g.vitals.push({ ...v, id: g.uid("h"), at: at(`${day}T${hhmm(hh, Math.min(59, mm + 1))}`), entryMethod: "typed", pulse: undefined, arm: undefined, duplicateOf: v.id });
        else if (o.typedDup && dr.chance(0.04)) v.typo = { systolic: Number(String(v.bp!.systolic).split("").reverse().join("")) || v.bp!.systolic + 40, fixedAt: `${addDays(day, 2)}T01:${String(dr.int(10, 59))}:${String(dr.int(10, 59))}Z` };
        if (v.typo) { v.entryMethod = "typed"; v.pulse = undefined; v.arm = undefined; }
      }
      if (g.dm) {
        const mmol = o.mmol && day < switchDate;
        const glu = Math.round(dr.normal(110 + (g.a1c - 6) * 25, 18));
        g.vitals.push({ id: g.uid("h"), kind: "home-glucose", at: at(`${day}T${hhmm(hh, Math.max(0, mm - 10))}`), setting: "home", source: "P", glucose: glu, renderedUnit: mmol ? "mmol/L" : "mg/dL", mealMarker: "fasting", entryMethod: "device" });
        if (insulin && g.status(insulin, `${day}T21:00:00-05:00`) === "active") g.home.doses.push({ id: g.uid("dose"), at: at(`${day}T21:${String(dr.int(10, 55)).padStart(2, "0")}`), medId: insulin.id, amount: insulin.history.reduce((a, h) => h.dose?.value ?? a, insulin.dose!.value) });
      }
    }
    day = addDays(day, 1);
  }
  if (switchDate) {
    g.home.notes.push({ id: g.uid("n"), at: at(`${switchDate}T${hhmm(r.int(15, 19), r.int(0, 59))}`), tags: [], factIds: [], gist: "Changed the meter setting so it shows numbers like the clinic's (it was showing the small numbers before)." });
    traps(g, g.vitals.find((v) => v.renderedUnit === "mmol/L")?.id ?? "", "T6");
  }
  if (nsaid) {
    const t = at(`${addDays(pStart, r.int(10, 60))}T${hhmm(r.int(16, 21), r.int(0, 59))}`);
    const nf: NarrativeFact = { id: g.uid("nf"), at: t, kind: "patient-report", polarity: "affirmed", about: [nsaid.id], statement: `Takes over-the-counter ${drug(nsaid.product).brand} for joint pain.`, evidence: [[`${drug(nsaid.product).brand}|${drug(nsaid.product).ingredient}`]], visibility: { P: "prose" }, traps: ["T13"] };
    g.facts.push(nf);
    g.home.notes.push({ id: g.uid("n"), at: t, tags: ["pain"], severity: 2, factIds: [nf.id], gist: `Back/knee pain flared up; took ${drug(nsaid.product).brand} again, it helps.` });
  }
  if (g.dkaHistory && o.plan.dka) {
    const dka = o.plan.dka;
    g.home.notes.push({ id: g.uid("n"), at: at(`${addDays(dka, 9)}T${hhmm(10, r.int(0, 59))}`), tags: ["tired"], severity: 2, factIds: [], gist: "Home from Riverside. They said my diabetes pill caused the acid problem and not to take it until my doctor sees me." });
  }
  // The patient's own medicine list, saved at the start and once or twice later.
  const saves = [pStart, ...(r.chance(0.6) ? [addDays(pStart, r.int(60, 300))] : [])].filter((d) => d <= pEnd);
  for (const s of saves) {
    const entries: MyMedPlan[] = [];
    for (const m of g.meds.filter((x) => x.setting !== "inpatient" && !x.history.some((h) => h.status === "entered-in-error"))) {
      const st = g.status(m, `${s}T12:00:00-05:00`);
      if (!st) continue;
      const d = drug(g.currentProduct(m, `${s}T12:00:00-05:00`));
      const stoppedRecently = st === "stopped" && m.history.some((h) => h.status === "stopped" && yrs(localDate(h.at), s) < 2);
      if (st !== "active" && st !== "held" && !stoppedRecently) continue;
      if (m.sensitive && r.chance(0.2)) continue;
      const typed = r.chance(0.3);
      entries.push({
        medId: m.id, name: typed ? (d.klass === "thiazide" ? "water pill" : d.brand ?? d.ingredient) : (d.brand && r.chance(0.4) ? d.brand : d.ingredient[0].toUpperCase() + d.ingredient.slice(1)),
        ...(typed ? {} : { picked: { rxnorm: d.scd ?? d.ingredientRx, display: d.scd ? d.scdName : d.ingredient } }),
        // The strength in the product's own unit (levothyroxine is mcg), matching the picked RxNorm product.
        strengthText: d.form === "pen" ? (d.unit === "units/mL" ? "100 units/mL pen" : `${d.strength} ${d.unit} pen`) : `${d.strength} ${d.unit}`,
        howITakeIt: m.history.find((h) => h.takenAs)?.takenAs ?? (d.form === "pen" ? (d.klass === "glp1ra" ? "once a week, Sunday" : `${m.dose?.value ?? 10} units at bedtime`) : m.frequency === "BID" ? "morning and supper" : m.frequency === "QHS" ? "bedtime" : "morning"),
        status: st === "stopped" ? "stopped" : "taking",
        ...(st === "stopped" ? { stopped: localDate(m.history.filter((h) => h.status === "stopped").pop()!.at).slice(0, 7), note: m.history.filter((h) => h.status === "stopped").pop()!.reason } : {}),
        ...(st === "held" ? { note: "doctor told me to stop for now" } : {}),
      });
      m.visibility.P = m.visibility.P ?? "structured";
    }
    g.home.listSaves.push({ at: s, entries });
  }
}

// ─── the population ─────────────────────────────────────────────────────────────────────────────

export function assignArchetypes(seed: string, n: number, quotas?: Record<Archetype, number>): Archetype[][] {
  const rng = new Rng(`${seed}/archetypes`);
  const out: Archetype[][] = Array.from({ length: n }, () => []);
  const scale = quotas ? 1 : n / 295;
  const exclusive: Archetype[][] = [["ckd_prog_sglt2", "ckd_prog_sglt2_held", "ckd_inpatient_dip", "dka_prec", "dka_noprec", "insulin_ckd"]];
  for (const [a, q] of Object.entries(quotas ?? QUOTAS) as [Archetype, number][]) {
    const count = Math.round(q * scale);
    const group = exclusive.find((gr) => gr.includes(a));
    const order = rng.shuffle([...Array(n).keys()]);
    let placed = 0;
    for (const i of order) {
      if (placed >= count) break;
      if (group && out[i].some((x) => group.includes(x))) continue;
      if (a === "acei_angio" && out[i].includes("acei_cough")) continue;
      if (a === "acei_cough" && out[i].includes("acei_angio")) continue;
      if (a === "masked_htn" && out[i].includes("nonadherence")) continue;
      out[i].push(a);
      placed++;
    }
  }
  return out;
}

export function generatePopulation(seed: string, n: number, idPrefix = "p", startIndex = 1, quotas?: Record<Archetype, number>): Patient[] {
  const arche = assignArchetypes(seed, n, quotas);
  // A patient that breaks a plausibility rule (plausibility.ts) is regenerated from a derived seed, same archetypes.
  return arche.map((a, i) => {
    const id = `${idPrefix}${String(startIndex + i).padStart(3, "0")}`;
    let p = generatePatient({ id, role: "population", seed: `${seed}/patient/${startIndex + i}`, arche: a });
    for (let k = 1; k <= 8 && plausibility(p).length; k++) p = generatePatient({ id, role: "population", seed: `${seed}/patient/${startIndex + i}/retry${k}`, arche: a });
    return p;
  });
}

export { EVAL_DATE };
