// Clinical truth model: the source-neutral record of what happened to each patient.
// Follows truth/MODEL.md. Deviations from the sketch there are listed in packages/truth/README.md.
//
// Times: an "instant" is an RFC 3339 string with the offset in effect in the patient's zone
// ("2024-11-01T21:40:00-05:00"). A "date" is a full or partial local date ("2016", "2016-06",
// "2016-06-14"); its precision is the string's precision. `When` is either.

export type SourceKey = "A" | "B" | "C" | "P";
export type Modality = "prose" | "structured" | "both";
export type Visibility = Partial<Record<SourceKey, Modality>>;
export type TrapId = `T${number}`;
export type When = string;

export interface Coding { system: "snomed" | "icd10" | "rxnorm" | "loinc"; code: string; display: string }

export interface Patient {
  id: string;                                  // truth id, never rendered
  role: "hero" | "secondary" | "population";
  demographics: {
    given: string; family: string; birthDate: string; sex: "F" | "M";
    race?: string; tz: string; occupation?: string;
  };
  /** Which sources know the patient, with the patient's id at that source. */
  sources: Partial<Record<SourceKey, { localId: string }>>;
  sensitivity: { category: "behavioral-health" | "reproductive" | "substance-use"; factIds: string[] }[];
  encounters: Encounter[];
  conditions: Condition[];
  meds: Medication[];
  draws: LabDraw[];
  labs: LabResult[];
  vitals: Vital[];
  allergies: AllergyIntolerance[];
  narrativeFacts: NarrativeFact[];
  /** Things only the patient's app holds that are not clinical facts (diary days, list saves, meter settings). */
  home?: HomeLogPlan;
  /** Outbound referrals (Northgate refers to Lakeview nephrology). */
  referrals?: Referral[];
  /** Planted traps: which facts carry which trap. Derived for the hero, chosen by the generator otherwise. */
  traps: TrapAssignment[];
}

export interface Referral {
  id: string;
  by: SourceKey;
  author: string;                              // Staff id
  encounter?: string;                          // encounter it was written at
  created: string;
  to: { org: string; specialty: string };
  question: string;
  urgency: "routine" | "urgent";
  scheduled?: string; appointmentOn?: string; closed?: string;
  dx: string[];                                // condition ids
  factIds: string[];                           // what the referral letter covers
}

export interface TrapAssignment { trap: TrapId; factIds: string[]; note: string }

/** A clinician at one organization. Staff are real-world facts (who works where), shared across patients. */
export interface Staff { id: string; source: SourceKey; name: string; role: string; npi?: string; short?: string }

export type DocKind =
  | "ed-note" | "h&p" | "progress" | "consult" | "discharge" | "office-note" | "phone-note" | "letter"
  | "patient-note";

export interface Encounter {
  id: string;
  source: SourceKey;
  kind: "office" | "ed" | "inpatient" | "telehealth" | "phone" | "nurse" | "lab-only" | "home";
  start: string;                               // instant
  end?: string;
  admitted?: string;                           // inpatient admission time (stays that began in the ED)
  disposition?: "admitted" | "home" | "home_with_services" | "transferred" | "left_against_advice";
  reason: string;
  clinician?: string;                          // Staff id
  /** Conditions addressed at the encounter, most important first (B billing dx, C VISIT_DX). */
  addressed?: { conditionId: string; status?: "active" | "working" | "ruled-out" | "history"; label?: string; icd10?: string }[];
  /** Extra billing-only codes (Z codes) rendered before the addressed conditions. */
  billingExtra?: { icd10: string; display: string }[];
  /** Assessed CKD category at a nephrology contact. */
  ckdCategory?: { g: string; a?: string };
  referredBy?: string;
  /** Northgate "Mark as reviewed" clicks at this visit (T5). */
  reviewed?: ("problems" | "medications" | "allergies")[];
  documents: EncounterDocument[];
}

export interface EncounterDocument {
  key: string;                                 // unique within the encounter, e.g. "ed", "hp", "pn1", "dc"
  kind: DocKind;
  at: string;                                  // the time the document is about (instant)
  signedAt: string;                            // instant
  author: string;                              // Staff id
  /** Facts the narrative discusses (drives prose requests and the payload of hospital documents). */
  factIds: string[];
  /** Hospital documents only: the structured content of the document, in payload order. */
  plan?: DocItem[];
  /** Hospital documents only: entry key overrides, factId -> key. */
  keys?: Record<string, string>;
}

/** One structured element of a hospital document. Home meds and allergies are always re-listed (T15). */
export type DocItem =
  | { kind: "vitals"; vitalId: string }
  | { kind: "lab"; labIds: string[]; panel?: string; key?: string }
  | { kind: "dx"; conditionId: string; rank?: "principal" | "secondary" }
  | { kind: "adverse-dx"; allergyId: string; rank?: "principal" | "secondary" }
  | { kind: "history"; conditionId: string; label?: string; onsetText?: string; source: "patient" | "outside_records" | "riverside"; coded?: boolean }
  | { kind: "inpatient-med"; medId: string }
  | { kind: "follow-up"; key?: string; with: string; when: string; purpose: string }
  | { kind: "allergies" }                      // position of the re-listed allergy list (default: end)
  | { kind: "home-meds" };                     // position of the re-listed home med list (default: end)

export type ConditionStatus = "active" | "resolved" | "ruled-out" | "working";

export interface Condition {
  id: string;
  name: string;                                // canonical display
  coding: Coding[];                            // SNOMED + ICD-10
  onset: When;                                 // partial dates allowed (T10/T17)
  history: {
    at: When; status: ConditionStatus; stage?: string; recordedBy: SourceKey;
    /** How the recording source worded it, when that matters (hospital working diagnoses). */
    label?: string; subtype?: string; doc?: string;
    /** Source-side codes chosen when the stage changed (e.g. N18.31 vs N18.32). */
    icd10?: string; snomed?: string;
  }[];
  sensitive?: "behavioral-health";
  visibility: Visibility;
  traps?: TrapId[];
}

export type MedStatus = "active" | "held" | "stopped" | "entered-in-error";
export type Freq = "QD" | "BID" | "TID" | "QHS" | "QW" | "PRN";

export interface Dose { value: number; unit: "mg" | "units" | "mcg" | "mL" }

export interface MedHistoryEntry {
  at: When;
  status: MedStatus;
  by: SourceKey;
  reason?: string;
  stopReason?: "adverse_reaction" | "ineffective" | "therapy_changed" | "course_complete" | "patient_choice" | "other";
  intendResume?: boolean;                      // T1, T4
  restartAdvice?: "resume_when_able" | "prescriber_decides" | "advise_against";
  instructions?: string;
  reviewOn?: string;
  /** Set on a dose change; the top-level dose is the starting one. */
  product?: string; dose?: Dose; doseText?: string; frequency?: Freq;
  /** How the patient actually takes it when that differs from the prescription (by: "P"). */
  takenAs?: string;
  /** Hospital document that recorded this decision (A only). */
  doc?: string;
  encounter?: string;
}

export interface Medication {
  id: string;
  product: string;                             // catalog key (packages/truth/src/catalog.ts)
  rxnorm?: Coding;                             // ingredient; absent for IV fluids
  doseText: string;
  dose?: Dose;
  frequency: Freq;
  setting?: "home" | "inpatient";
  route?: string;
  /** As-ordered display name for hospital orders ("insulin regular (human) IV infusion"). */
  orderName?: string;
  otc?: boolean;
  history: MedHistoryEntry[];
  /** A source's copy that was never updated (B's outside finerenone line, T1). */
  laggingLines?: { source: SourceKey; showsStatus: "active" | "held" | "stopped"; since: When }[];
  /** Who prescribes/manages it (B line origin "outside" when another source prescribes). */
  prescriber?: SourceKey;
  sensitive?: "behavioral-health";
  visibility: Visibility;
  traps?: TrapId[];
}

export type Analyte =
  | "creatinine" | "egfr" | "potassium" | "sodium" | "chloride" | "bicarbonate" | "anion-gap" | "bun"
  | "glucose" | "a1c" | "uacr" | "platelets" | "wbc" | "hemoglobin" | "bhb" | "ph" | "pco2" | "lipase"
  | "troponin" | "cholesterol" | "triglycerides" | "hdl" | "ldl";

/** One blood/urine draw (a requisition): the specimens collected at one time for one orderer. */
export interface LabDraw {
  id: string;
  collectedAt: string;
  receivedAt?: string;
  fasting?: "Y" | "N" | "U";
  /** Who ordered it; "outside" is another practice that sends work to Lakeview. */
  orderedBy: SourceKey | "outside";
  orderingClinician?: string;                  // Staff id
  performedBy: SourceKey;
  setting: "outpatient" | "ed" | "inpatient";
}

export interface LabResult {
  id: string;
  analyte: Analyte;
  draw: string;
  collectedAt: string;
  specimen: "serum" | "plasma" | "urine" | "whole-blood" | "capillary" | "venous-blood";
  value: number;
  comparator?: "<" | ">";
  unit: string;                                // canonical
  status: "final" | "corrected-away" | "entered-in-error";
  replacedBy?: string; confirms?: string;      // T3
  duplicateOf?: string;                        // T4 entered-in-error duplicate order
  derivedFrom?: string[];                      // eGFR <- creatinine (T11)
  reported?: { equation: "ckd-epi-2009-nonaa" | "ckd-epi-2009-aa" | "ckd-epi-2021"; value: number; comparator?: ">"; loinc?: string }[];
  orderedBy: SourceKey | "outside"; performedBy: SourceKey; copies?: SourceKey[];   // T14
  annotations?: string[];                      // "hemolyzed"
  resultedAt?: string;                         // released by the lab
  finalAt?: string;                            // when a preliminary result became final (absent: final at resultedAt)
  correctedAt?: string;                        // when a value was withdrawn
  visibility: Visibility;
  traps?: TrapId[];
}

export interface Vital {
  id: string;
  kind: "set" | "bp" | "home-glucose";
  at: string;                                  // instant (home readings: instant too; P renders wall time)
  setting: "clinic" | "hospital" | "home";
  source: SourceKey;
  bp?: { systolic: number; diastolic: number };
  bpRepeat?: { systolic: number; diastolic: number };
  pulse?: number; resp?: number; tempF?: number; spo2?: number; weightKg?: number; heightIn?: number;
  /** Home glucose, canonical mg/dL. */
  glucose?: number;
  renderedUnit?: "mmol/L" | "mg/dL";           // T6
  mealMarker?: "fasting" | "before_meal" | "after_meal" | "bedtime";
  entryMethod?: "device" | "typed";
  arm?: "left" | "right";
  /** P only: a typed duplicate of another reading (T14), or a typo later fixed. */
  duplicateOf?: string;
  typo?: { systolic?: number; diastolic?: number; fixedAt: string };
}

export interface AllergyIntolerance {
  id: string;
  substance: Coding;                           // rxnorm ingredient
  type: "allergy" | "intolerance" | "adverse-reaction";
  reaction: string;
  reactions: string[];                         // picklist display text
  criticality: "low" | "high";
  onset: When;
  recordedAt: When;                            // when the clinic entered it
  recordedBy: SourceKey;
  negatedFindings?: string[];                  // "no angioedema" (T12)
  manifestation?: string;                      // condition id it caused (T18)
  visibility: Visibility;
  traps?: TrapId[];
}

/** Facts that exist only (or mainly) as prose: precipitants, decisions, patient reports. */
export interface NarrativeFact {
  id: string;
  at: When;
  statement: string;                           // canonical one-sentence form
  about?: string[];                            // ids of conditions/meds it explains
  kind: "precipitant" | "decision" | "teaching" | "patient-report" | "negation" | "rule-out" | "context";
  polarity: "affirmed" | "negated";
  /** Regexes (case-insensitive); a note that carries the fact must match at least one of each group. */
  evidence: string[][];
  /** Narrative-only span id when a source writes it as its own span. */
  span?: Partial<Record<SourceKey, string>>;
  sensitive?: "behavioral-health";
  visibility: Visibility;
  traps?: TrapId[];
}

/** HomeLog-only material: day pages and list saves the patient produced. */
export interface HomeLogPlan {
  /** Diary notes: words are prose (LLM-written or fixture), tags structured. */
  notes: { id: string; at: string; tags: string[]; severity?: number; factIds: string[]; gist: string }[];
  /** Insulin dose logs. */
  doses: { id: string; at: string; medId: string; amount: number }[];
  /** My Medicines saves: which meds appear (truth med ids) and how the patient describes them. */
  listSaves: { at: string; recordedAt?: string; entries: MyMedPlan[] }[];
  /** Day pages that were edited later (superseding page). Keyed by local date. */
  edits?: { date: string; recordedAt: string }[];
}

export interface MyMedPlan {
  medId: string;
  name: string;
  picked?: { rxnorm: string; display: string };
  strengthText?: string;
  howITakeIt?: string;
  status: "taking" | "stopped";
  started?: string; stopped?: string;
  note?: string;
}

// ─── Dates and times ────────────────────────────────────────────────────────────────────────────

export const EVAL_DATE = "2026-10-13";
export const EVAL_INSTANT = "2026-10-13T23:59:59-05:00";

export function precisionOf(w: When): "year" | "month" | "day" | "instant" {
  if (w.includes("T")) return "instant";
  return w.length === 4 ? "year" : w.length === 7 ? "month" : "day";
}

/** Offset in minutes of `tz` at UTC time `ms`. */
const DTF = new Map<string, Intl.DateTimeFormat>();
const OFFSETS = new Map<string, number>();
export function tzOffsetMinutes(ms: number, tz: string): number {
  if (tz === "UTC") return 0;
  const hourKey = `${tz}/${Math.floor(ms / 3600000)}`;
  const hit = OFFSETS.get(hourKey);
  if (hit !== undefined) return hit;
  let dtf = DTF.get(tz);
  if (!dtf) {
    dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    DTF.set(tz, dtf);
  }
  const p = Object.fromEntries(dtf.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  const off = Math.round((asUtc - ms) / 60000);
  OFFSETS.set(hourKey, off);
  return off;
}

function fmtOffset(min: number): string {
  if (min === 0) return "Z";
  const s = min < 0 ? "-" : "+";
  const a = Math.abs(min);
  return `${s}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

/** "2024-11-01T21:40" (wall time in tz) -> "2024-11-01T21:40:00-05:00". */
export function at(local: string, tz = "America/Chicago"): string {
  const m = local.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) throw new Error(`bad local time ${local}`);
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0));
  let off = tzOffsetMinutes(wall, tz);
  off = tzOffsetMinutes(wall - off * 60000, tz);
  const o = fmtOffset(off);
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? "00"}${o === "Z" ? "+00:00" : o}`;
}

export function ms(instant: string): number {
  const t = Date.parse(instant);
  if (Number.isNaN(t)) throw new Error(`bad instant ${instant}`);
  return t;
}

/** Instant re-expressed in tz: "2024-11-02T02:40:00Z" -> "2024-11-01T21:40:00-05:00". */
export function inZone(instant: string, tz = "America/Chicago"): string {
  const t = ms(instant);
  const off = tzOffsetMinutes(t, tz);
  const d = new Date(t + off * 60000).toISOString().slice(0, 19);
  const o = fmtOffset(off);
  return d + (o === "Z" ? "+00:00" : o);
}

export function utcZ(instant: string): string {
  return new Date(ms(instant)).toISOString().replace(/\.\d{3}Z$/, "Z");
}

/** Local wall-clock "YYYY-MM-DDTHH:MM" of an instant. */
export function wall(instant: string, tz = "America/Chicago"): string {
  return inZone(instant, tz).slice(0, 16);
}

export function localDate(w: When, tz = "America/Chicago"): string {
  return w.includes("T") ? inZone(w, tz).slice(0, 10) : w;
}

export function addMinutes(instant: string, min: number, tz = "America/Chicago"): string {
  return inZone(new Date(ms(instant) + min * 60000).toISOString(), tz);
}

export function addDays(date: string, days: number): string {
  const d = new Date(Date.parse(date.slice(0, 10) + "T12:00:00Z") + days * 86400000);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b.slice(0, 10) + "T12:00:00Z") - Date.parse(a.slice(0, 10) + "T12:00:00Z")) / 86400000);
}

/** Sort key for a When: partial dates sort at their start. */
export function sortKey(w: When): number {
  if (w.includes("T")) return ms(w);
  const full = w.length === 4 ? `${w}-01-01` : w.length === 7 ? `${w}-01` : w;
  return Date.parse(full + "T00:00:00-06:00");
}

export function ageOn(birthDate: string, date: string): number {
  const [by, bm, bd] = birthDate.split("-").map(Number);
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  return y - by - (m < bm || (m === bm && d < bd) ? 1 : 0);
}

// ─── eGFR ───────────────────────────────────────────────────────────────────────────────────────

/** CKD-EPI 2021 (race-free). */
export function ckdEpi2021(scr: number, age: number, sex: "F" | "M"): number {
  const k = sex === "F" ? 0.7 : 0.9;
  const a = sex === "F" ? -0.241 : -0.302;
  const r = scr / k;
  return 142 * Math.min(r, 1) ** a * Math.max(r, 1) ** -1.2 * 0.9938 ** age * (sex === "F" ? 1.012 : 1);
}

/** CKD-EPI 2009, with or without the race coefficient. */
export function ckdEpi2009(scr: number, age: number, sex: "F" | "M", black: boolean): number {
  const k = sex === "F" ? 0.7 : 0.9;
  const a = sex === "F" ? -0.329 : -0.411;
  const r = scr / k;
  return 141 * Math.min(r, 1) ** a * Math.max(r, 1) ** -1.209 * 0.993 ** age * (sex === "F" ? 1.018 : 1) * (black ? 1.159 : 1);
}

export const EGFR_2021_FROM = "2022-01-10";        // Lakeview switched equations
export const EGFR_NUMERIC_FROM = "2021-07-01";     // Lakeview stopped printing ">60"
export const LAKEVIEW_LOINC_K_UACR_FROM = "2023-05-01";
