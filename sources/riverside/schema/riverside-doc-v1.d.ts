/**
 * Riverside Regional Hospital: signed clinical documents.
 *
 * One item per signed document: an emergency department provider note, an admission history and
 * physical (H&P), a daily progress note, a specialty consult, or a discharge summary. Several documents
 * usually belong to one hospital encounter; the `encounter` entry in each item says which.
 *
 * The narrative is the note text the clinician signed. The payload holds the structured parts of the
 * note as the hospital EHR stored them when the note was signed: the encounter context, diagnoses, the
 * home medication list, inpatient medications, allergies, vital signs, and copies of lab results the
 * author reviewed.
 *
 * Read these before mapping:
 *
 * - **Every document re-lists the home medications and allergies.** Each list is a snapshot taken when
 *   that document was signed, with that document's status for each drug. Five documents in one stay
 *   mean five copies of the same drugs. For the hospital's final word on outpatient medications, use the
 *   most recent `discharge_summary` of the encounter.
 * - **Lab results are copies.** Riverside does not publish lab results as items of their own. A result
 *   appears inside whichever documents reviewed it, so the same result can appear in several items. The
 *   `accession` plus test code identifies one result across documents.
 * - **Lab values are text**, exactly as the lab displayed them: `"182"`, `"7.21"`, `"<0.01"`.
 * - **Payload times are UTC** (`Z`). Riverside is in America/Chicago (UTC-6 standard, UTC-5 daylight
 *   time). The clinical date of an evening visit is the local date, which can be a day earlier than the
 *   UTC date. Times written in the narrative are local wall-clock times.
 * - **No allergy/intolerance distinction.** Everything on the hospital's allergy list is an `allergy`
 *   entry, including side effects such as cough.
 *
 * Envelope conventions: `effective` is the time the document is about (ED arrival for an ED note, time
 * of examination for an H&P, progress note or consult, inpatient admission time for a discharge
 * summary, with `effective_end` = discharge time). `author` is the signing clinician. A signed addendum
 * or correction is a new item that `supersedes` the original and restates the whole document.
 */

/** One entry in a Riverside document payload. Discriminated by `type`. */
export type RiversideEntry =
  | Encounter
  | Diagnosis
  | History
  | Allergy
  | HomeMed
  | InpatientMed
  | Vitals
  | Result
  | Panel
  | FollowUp;

/**
 * The encounter and document context. Exactly one per item, conventionally under the key `enc`.
 */
export interface Encounter {
  type: 'encounter';

  /**
   * Riverside encounter number. One number covers the whole hospital stay, from ED arrival to
   * discharge: the ED note, H&P, progress notes, consults and discharge summary of one stay share it.
   */
  encounter_id: string;

  /**
   * Which kind of document this item is.
   * - 'ed_note': emergency department provider note.
   * - 'hp': admission history and physical, written by the admitting physician.
   * - 'progress_note': daily inpatient note.
   * - 'consult': note from a specialty service asked to see the patient.
   * - 'discharge_summary': written at discharge; covers the whole stay. Its home medication list is
   *   the discharge instructions.
   */
  document_kind: 'ed_note' | 'hp' | 'progress_note' | 'consult' | 'discharge_summary';

  /**
   * Encounter class at the time the document was signed.
   * - 'emergency': the patient was in the ED and not yet admitted.
   * - 'inpatient': admitted (including step-down and ICU).
   * A stay that starts in the ED changes class from 'emergency' to 'inpatient' at admission; earlier
   * documents keep the class they were signed with.
   */
  class: 'emergency' | 'inpatient';

  /** Clinical service of the author, free text as configured at Riverside, e.g. "Emergency Medicine", "Hospital Medicine", "Endocrinology". */
  service: string;

  /** ED arrival time, UTC. Present on every document of a stay that began in the ED. */
  arrived?: string;

  /** Inpatient admission order time, UTC. Absent while the patient is still in the ED. */
  admitted?: string;

  /** Discharge time, UTC. Present only on discharge summaries. */
  discharged?: string;

  /**
   * Where the patient went at the end of this phase of care.
   * - 'admitted': ED patient admitted to Riverside (ED notes only).
   * - 'home': discharged home without services.
   * - 'home_with_services': discharged home with home health.
   * - 'transferred': sent to another hospital.
   * - 'left_against_advice': left before the care team discharged them.
   * Absent on H&Ps, progress notes and consults.
   */
  disposition?: 'admitted' | 'home' | 'home_with_services' | 'transferred' | 'left_against_advice';
}

/**
 * A diagnosis on this document's diagnosis list, as the author left it at signing. Diagnoses are
 * re-entered in each document, so the same condition can appear in several items of one stay with
 * different statuses as the workup progresses.
 */
export interface Diagnosis {
  type: 'diagnosis';

  /** Diagnosis as the clinician wrote it, e.g. "R/O pancreatitis", "Euglycemic DKA, SGLT2 inhibitor-associated". */
  label: string;

  /**
   * ICD-10-CM code chosen by the author or added by coding. Absent on working diagnoses entered as free
   * text. An adverse drug effect is coded as its own diagnosis (an ICD-10-CM T-code), not as an
   * allergy.
   */
  icd10cm?: string;

  /**
   * Riverside local diagnosis code, used where ICD-10-CM is too coarse (for example to separate
   * SGLT2 inhibitor-associated euglycemic DKA from other DKA, which share ICD-10-CM E11.10). Code
   * space: Riverside problem dictionary, `RRH-DX-` followed by digits; stable across years.
   */
  riverside_dx?: { code: string; name: string };

  /**
   * Where the diagnosis stood when the document was signed.
   * - 'working': suspected and under evaluation, not established. A later document may confirm it,
   *   rule it out, or silently drop it; an absent later mention does not mean it was confirmed.
   * - 'ruled_out': considered and excluded. The patient does NOT have this condition.
   * - 'active': established and present.
   * - 'resolved': established during this stay and no longer present at signing (e.g. a ketoacidosis
   *   that cleared). The patient had it.
   */
  status: 'working' | 'ruled_out' | 'active' | 'resolved';

  /**
   * - 'principal': the main reason for the hospital stay. Set on H&Ps and discharge summaries only.
   * - 'secondary': any other diagnosis addressed in this document.
   * Absent on ED notes, which do not rank diagnoses.
   */
  rank?: 'principal' | 'secondary';
}

/**
 * A line of past medical history as recorded in this document. Taken from the patient, outside
 * records, or earlier Riverside documents, and not re-verified: stages and dates can be out of date.
 */
export interface History {
  type: 'history';

  /** Condition as written, e.g. "CKD stage 3a", "Type 2 diabetes". */
  condition: string;

  /** ICD-10-CM code if the author picked one from the problem dictionary; often absent. */
  icd10cm?: string;

  /** Onset as written, free text and not normalized: "2016", "~10 years", "childhood". Absent if not stated. */
  onset_text?: string;

  /**
   * Where the line came from.
   * - 'patient': patient or family report.
   * - 'outside_records': another organization's records (e.g. a primary care summary).
   * - 'riverside': an earlier Riverside document.
   */
  source: 'patient' | 'outside_records' | 'riverside';
}

/**
 * An entry on Riverside's allergy list as shown in this document. Riverside keeps one list called
 * "Allergies" and does not separate allergies from intolerances or side effects: a drug that once
 * caused a cough is listed the same way as one that caused anaphylaxis. Read `reaction` to tell them
 * apart. Re-listed in every document.
 */
export interface Allergy {
  type: 'allergy';

  /**
   * Substance as entered, e.g. "lisinopril", "penicillins". If the patient has no known allergies, the
   * list has exactly one entry with substance "NKDA" and no other fields.
   */
  substance: string;

  /** RxNorm ingredient CUI when the substance is a single drug ingredient; absent for classes, foods and "NKDA". */
  rxnorm_ingredient?: string;

  /** Reaction as entered, free text, e.g. "cough", "hives". Absent if unknown. */
  reaction?: string;

  /**
   * Severity as entered.
   * - 'mild': bothersome, not dangerous.
   * - 'moderate': needed treatment or stopping the drug urgently.
   * - 'severe': life-threatening (e.g. anaphylaxis, angioedema).
   * - 'unknown': not recorded.
   */
  severity: 'mild' | 'moderate' | 'severe' | 'unknown';
}

/**
 * One line of the home (outpatient) medication list, with this document's decision about it.
 *
 * The meaning of `status` depends on `document_kind` in the item's `encounter` entry:
 * in ED notes, H&Ps, progress notes and consults it is the plan **during the stay**; in a discharge
 * summary it is the instruction **after discharge**. Only the latest discharge summary of an encounter
 * says what the patient should take at home.
 *
 * Entry keys are not stable across documents; match lines across documents by `rxnorm_ingredient` and
 * `dose_text`.
 */
export interface HomeMed {
  type: 'home_med';

  /** Drug and form as written on the list, e.g. "empagliflozin 10 mg tablet". */
  drug_name: string;

  /**
   * RxNorm ingredient CUI (not a clinical drug code: strength and form are in `drug_name` and
   * `dose_text`). Absent for combination products and supplements that are not mapped.
   */
  rxnorm_ingredient?: string;

  /** Dose per administration as written, e.g. "1000 mg", "10 units". Text, not normalized. */
  dose_text: string;

  /** Directions as written, e.g. "1 tab PO BID with meals". Not normalized. */
  sig: string;

  /**
   * This document's decision for the drug (see the interface comment for during-stay vs after-discharge).
   * - 'not_reconciled': listed from the patient or prior records; the author made no decision. Typical
   *   of ED notes. Does not mean the patient is taking it now.
   * - 'continue': keep taking (or keep giving in hospital). In a discharge summary this includes a drug
   *   that was held during the stay and is restarted at discharge.
   * - 'held': do not take for now. Not stopped: the author expects someone to decide later whether to
   *   restart. `instructions` usually says who decides and when. Riverside has no separate status for
   *   "held, and I recommend against restarting"; that opinion, when present, is only in the narrative.
   * - 'stopped': discontinued by this author.
   * - 'new': started during this stay, to continue.
   * - 'changed': same drug, new dose or directions; `dose_text`/`sig` show the new ones.
   */
  status: 'not_reconciled' | 'continue' | 'held' | 'stopped' | 'new' | 'changed';

  /** Free-text instruction attached to the status, e.g. "Do not resume until reviewed by PCP". Absent if none. */
  instructions?: string;
}

/**
 * A medication ordered for use in the hospital only (infusions, IV fluids, inpatient-only drugs).
 * Not part of the home list and not continued after discharge unless it also appears there as 'new'.
 */
export interface InpatientMed {
  type: 'inpatient_med';

  /** Drug or fluid as ordered, e.g. "insulin regular (human) IV infusion", "lactated Ringer's". */
  drug_name: string;

  /** RxNorm ingredient CUI; absent for IV fluids and mixtures. */
  rxnorm_ingredient?: string;

  /** Route as ordered, e.g. "IV", "SubQ", "PO". */
  route: string;

  /** Dose or rate as ordered, free text, e.g. "per DKA protocol, 0.1 units/kg/h", "150 mL/h". */
  dose_text: string;

  /** First administration, UTC. */
  started: string;

  /** Last administration or order discontinue time, UTC. Absent if still running when the document was signed. */
  stopped?: string;
}

/** One set of vital signs taken at one time. Any member may be absent if not measured. */
export interface Vitals {
  type: 'vitals';

  /** When the vitals were taken, UTC. */
  taken: string;

  /** Blood pressure in mmHg. */
  bp?: { systolic_mmhg: number; diastolic_mmhg: number };

  /** Heart rate, beats per minute. */
  heart_rate_bpm?: number;

  /** Respiratory rate, breaths per minute. */
  resp_rate_per_min?: number;

  /** Temperature in degrees Fahrenheit, as entered by nursing. */
  temp_f?: number;

  /** Oxygen saturation by pulse oximetry, percent (0–100). */
  spo2_pct?: number;

  /** Weight in kilograms (converted by the EHR from whatever unit was entered). */
  weight_kg?: number;
}

/**
 * The value part of a lab result. Used on its own as `Result` and for each component of a `Panel`.
 */
export interface ResultValue {
  /**
   * Riverside lab test. `local_code` is the Riverside lab dictionary code (stable across years).
   * `loinc` is present for most chemistry and hematology tests and absent for some point-of-care and
   * send-out tests (e.g. beta-hydroxybutyrate). `name` is the display name.
   */
  test: { local_code: string; loinc?: string; name: string };

  /**
   * Result exactly as displayed by the lab, as text. Usually a decimal number (`"182"`, `"7.21"`), but
   * may carry a comparator (`"<0.01"`, `">600"`) or be words (`"Hemolyzed, see comment"`). Parse with
   * care; a comparator means the true value is beyond the reportable limit.
   */
  value: string;

  /**
   * Unit as the lab reports it, close to UCUM: "mg/dL", "mmol/L", "U/L", "ng/mL", "10*3/uL" (thousands
   * per microliter), "g/dL", "mmHg", "mL/min/1.73m2". Absent for unitless results (pH).
   */
  unit?: string;

  /** Reference range as displayed, text, e.g. "70-99", "<0.04". Absent if the lab gives none. */
  ref_range?: string;

  /**
   * Abnormal flag from the lab.
   * - 'H' / 'L': above / below the reference range.
   * - 'HH' / 'LL': critically high / low.
   * - 'A': abnormal, no direction (non-numeric results).
   * Absent when the value is within range.
   */
  flag?: 'H' | 'L' | 'HH' | 'LL' | 'A';
}

/**
 * Copy of one lab result reviewed in this document. The same result (same `accession` and
 * `test.local_code`) can appear in several documents; it is one result, not several.
 */
export interface Result extends ResultValue {
  type: 'result';

  /** Riverside lab accession number for the specimen. With `test.local_code` it identifies the result. */
  accession: string;

  /** Specimen collection time, UTC. */
  collected: string;

  /** Specimen as labelled by the lab, e.g. "serum", "venous blood", "whole blood". */
  specimen: string;

  /**
   * Status of the result when this document copied it.
   * - 'preliminary': reported but not verified; may change.
   * - 'final': verified.
   * - 'corrected': a final value that the lab later changed; `value` is the corrected value.
   * A document never updates after signing, so a later document can show a different status or value
   * for the same result. Use the copy with the most advanced status.
   */
  status: 'preliminary' | 'final' | 'corrected';
}

/**
 * Copy of a panel of results from one specimen (basic metabolic panel, CBC, blood gas). Components carry
 * their own codes, values and flags; the panel carries what they share. Same duplication rules as
 * `Result`.
 */
export interface Panel {
  type: 'panel';

  /** Riverside panel order code and name, e.g. { local_code: "BMP", name: "Basic metabolic panel" }. LOINC present when the panel has one. */
  panel: { local_code: string; loinc?: string; name: string };

  /** Riverside lab accession number for the specimen. */
  accession: string;

  /** Specimen collection time, UTC. */
  collected: string;

  /** Specimen as labelled by the lab, e.g. "serum", "venous blood", "whole blood". */
  specimen: string;

  /** Status of the panel as a whole when copied; same values and meaning as `Result.status`. */
  status: 'preliminary' | 'final' | 'corrected';

  /**
   * Component results, in the lab's display order. Includes computed values the lab reports with the
   * panel (anion gap, eGFR). eGFR at Riverside is CKD-EPI 2021 (race-free) for all results since 2023.
   */
  components: ResultValue[];
}

/** A follow-up the author arranged or recommended. Mostly in discharge summaries. */
export interface FollowUp {
  type: 'follow_up';

  /** Clinician, clinic or service to follow up with, as written, e.g. "Primary care (Northgate Family Medicine)". */
  with: string;

  /** When, as written, e.g. "within 1 week", "2024-11-12". Not normalized. */
  when_text: string;

  /** What the follow-up is for, free text. */
  purpose: string;
}
