/**
 * Consumer views, version 2: the small shapes a patient-facing chart app reads.
 *
 * These are defined by the consumer, not by any source. A mapper turns one source's FOLIO record items
 * for one patient into these rows. The consumer merges rows from several sources itself, so a mapper
 * reports only what its own source says, and never invents, infers from other sources, or "corrects"
 * what the source records.
 *
 * Contract (see `Transform`): the mapper receives every item one source published for one patient,
 * in no particular order and including items that were later superseded or retracted, plus an
 * `asOf` date. It returns the rows that describe that source's record as it stood at the end of that
 * date.
 *
 * Conventions for every view:
 *
 * - **Scope in time.** An item is in scope when its envelope `recorded` time is on or before the end of
 *   the `asOf` day in America/Chicago. Ignore items recorded later. Apply the FOLIO correction rules to
 *   the items in scope: an item listed in another in-scope item's `supersedes` or `retracts` (same
 *   issuer) is not current; supersession is transitive. Use only current items, except where a view
 *   below says otherwise.
 * - **Time zone.** The consumer displays everything in America/Chicago, the patients' home zone. "Local
 *   date" and "local time" below mean wall-clock date/time in America/Chicago (UTC-6 standard, UTC-5
 *   daylight time). A date-time with no offset and no zone (for example a phone's wall clock) is taken to
 *   be America/Chicago local time: report it as written, do not shift it, and do not leave it out.
 * - **Partial dates.** `PartialDate` strings keep the precision the source actually knows: "2016"
 *   means some time in 2016, never 2016-01-01. Never pad a year-only or month-only date.
 * - **Only what the source records.** Rows come from structured payload entries. Narrative text may be
 *   used to understand an entry but must not be the only basis for a row.
 * - **Evidence.** Every row lists the items (and payload entry ids) it was built from, so the consumer
 *   can show the source text behind a fact. Cite at least the item whose entry gives the row's current
 *   state.
 * - **Sensitive entries are reported, never dropped.** Report every entry the source holds, including
 *   ones it marks restricted, confidential or sensitive. Mark such rows with `sensitivity` (see
 *   `Sensitivity`). Whether a sensitive fact is shown or shared is decided later, by the patient, at
 *   disclosure time; it is never decided by a mapper.
 * - **Determinism.** Same input, same output: no clock, randomness, network or file access.
 */

/** A FOLIO record item in its JSON form (see the FOLIO record-item spec). */
export interface FolioItem {
  folio: string;
  /** Item id (ULID), unique within the issuer. */
  id: string;
  /** did:web of the issuing organization. */
  issuer: string;
  /** Patient id at this issuer. */
  patient: string;
  /** When the clinical event happened: RFC 3339 date-time with offset, or a full or partial date. */
  effective: string;
  effective_end?: string;
  /** When the issuer committed this item: RFC 3339 date-time with offset. */
  recorded: string;
  author?: { id?: string; name?: string; role?: string };
  /** The payload's schema: `type` names the entry type in the source's .d.ts. */
  schema?: { url: string; type: string; sha256: string };
  /** Ids of earlier items from the same issuer that this item replaces entirely. */
  supersedes?: string[];
  /** Ids of earlier items from the same issuer that were entered in error, withdrawn without replacement. */
  retracts?: string[];
  /** Markdown narrative with `<ref id="…">…</ref>` spans; "" if none. */
  narrative: string;
  /** Entry id -> entry, each entry typed by the source's schema; {} if none. */
  payload: Record<string, any>;
}

/** The mapper's entry point. `asOf` is a local date, `YYYY-MM-DD`. */
export type Transform = (items: FolioItem[], asOf: string) => ViewRows;

/** Everything one mapper returns for one patient and one source. Empty arrays where the source has nothing. */
export interface ViewRows {
  medications: MedicationRow[];
  problems: ProblemRow[];
  allergies: AllergyIntoleranceRow[];
  labs: LabResultRow[];
  vitals: VitalRow[];
}

/** `YYYY`, `YYYY-MM` or `YYYY-MM-DD`; the precision is the string's length. */
export type PartialDate = string;

/** The items (and entries inside them) a row was built from. At least one. */
export type Evidence = { item_id: string; entry_id?: string }[];

/**
 * Sensitivity categories, for rows whose disclosure a patient may want to control separately.
 * - 'mental-health': behavioral or mental health conditions and the medicines used for them.
 * - 'substance-use': substance use disorders and their treatment.
 * - 'sexual-reproductive-health': sexual and reproductive health, including pregnancy and contraception.
 * - 'hiv-sti': HIV and other sexually transmitted infections.
 * - 'genetic': genetic test results and genetic conditions.
 * Set a category when the source marks the entry restricted or sensitive (map the source's own category,
 * e.g. a behavioral-health restriction is 'mental-health'). You may also set one when the entry plainly
 * belongs to a category. Omit the field when none applies.
 */
export type Sensitivity = 'mental-health' | 'substance-use' | 'sexual-reproductive-health' | 'hiv-sti' | 'genetic';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Medications
// ─────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * One outpatient (home) medication as this source records it, with its status as of `asOf`.
 *
 * - One row per drug ingredient. If the source has several lines, orders or prescriptions for the
 *   same ingredient over time (stopped and restarted, re-entered), report the most recent one, i.e.
 *   the one whose own latest event is latest. A line or order that was entered in error, voided or
 *   retracted never existed: do not report it, and do not let it affect another line.
 * - Include medications that are stopped (status 'stopped') if the source still shows them, so the
 *   consumer can say what was stopped and why.
 * - Exclude hospital-only orders (infusions, IV fluids, inpatient-only drugs). They are not home
 *   medications.
 * - When the source publishes a medication list as repeated snapshots (each document or save restates
 *   the list), the latest in-scope snapshot is the source's list; a drug missing from the latest
 *   snapshot is not reported. When the source publishes events or status rows, the latest event or
 *   status row for a line determines its state, however old it is.
 */
export interface MedicationRow {
  /**
   * Generic ingredient name, lower case, without salt or form: "losartan" (not "losartan potassium"),
   * "metformin", "insulin glargine", "empagliflozin". Translate brand names the record uses
   * ("Jardiance" -> "empagliflozin"). Omit only when the record does not say which drug it is (e.g. the
   * patient wrote "water pill").
   */
  ingredient?: string;
  /** RxNorm ingredient CUI, only when the source states an ingredient-level RxNorm code. Never guessed or derived from a product code. */
  rxnorm_ingredient?: string;
  /** The drug as the source names it (display text), e.g. "losartan potassium 50 MG Oral Tablet" or "Jardiance". */
  drug_name: string;
  /**
   * Status as of `asOf`, by this source's account.
   * - 'active': the patient should be taking it (or, on a patient's own list, says they are).
   * - 'held': paused with intent (or at least possibility) of resuming; the patient should not be
   *   taking it now. Not the same as stopped.
   * - 'stopped': discontinued.
   * - 'unknown': the source lists the drug but records no decision about whether it is being taken
   *   (e.g. a hospital list marked as not reconciled).
   * On a patient's own list, a medicine marked as being taken but annotated as paused or stopped for now
   * (e.g. a note "doctor told me to stop for now") is 'held'.
   */
  status: 'active' | 'held' | 'stopped' | 'unknown';
  /**
   * Local date on which the current status began according to this source: for 'held' or 'stopped',
   * the date of the hold or stop; for 'active', the date the source's current line or order started
   * (or resumed). Keep the source's precision. Omit if the source does not say.
   */
  status_since?: PartialDate;
  /**
   * Amount per administration currently prescribed (for 'held' and 'stopped': the amount when it was
   * held or stopped). For a patient's own list: the amount the patient says they take, if they give
   * one; a direction that names no count ("morning", "bedtime") means one tablet or capsule. `unit` is
   * one of the listed units; convert source spellings ("unit", "UNT", "[iU]" -> "units"). Express an
   * amount in tablets as a mass when the record gives the strength per tablet ("200 mg" strength,
   * "take 2" -> 400 mg); use 'tablet' only when the strength is unknown. Omit when the source gives no
   * single amount (a range such as "1 or 2", a sliding scale).
   */
  dose?: { value: number; unit: 'mg' | 'mcg' | 'units' | 'mL' | 'tablet' };
  /**
   * How often, normalized: 'QD' once daily, 'BID' twice daily, 'TID' three times daily, 'QHS' once
   * daily at bedtime, 'QW' once weekly, 'PRN' as needed, 'other' anything else. Omit if unknown.
   */
  frequency?: 'QD' | 'BID' | 'TID' | 'QHS' | 'QW' | 'PRN' | 'other';
  /**
   * For 'stopped' rows, why, when the source records a coded or clearly stated reason:
   * - 'adverse_reaction': side effect or adverse reaction.
   * - 'ineffective': not working well enough.
   * - 'therapy_changed': replaced by another drug for the same purpose.
   * - 'course_complete': finite course finished.
   * - 'patient_choice': the patient declined or asked to stop.
   * - 'other': another reason (see `status_reason_text`).
   * Omit when the source gives no reason, and on rows that are not 'stopped'.
   */
  stop_reason?: 'adverse_reaction' | 'ineffective' | 'therapy_changed' | 'course_complete' | 'patient_choice' | 'other';
  /** Free-text reason for the current status (hold or stop) as the source wrote it, if any. */
  status_reason_text?: string;
  /** True when the row comes from the patient's own account (a self-reported list), not a clinician's record. */
  patient_reported: boolean;
  /** True when the source says the drug was bought without a prescription. Omit otherwise. */
  otc?: boolean;
  /** See `Sensitivity`. */
  sensitivity?: Sensitivity[];
  evidence: Evidence;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Problems
// ─────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * One condition on the source's problem list (or the source's equivalent: its diagnosis or history
 * lists), with status as of `asOf`.
 *
 * - One row per condition. Several entries for the same condition (re-listed in several documents,
 *   restaged, re-coded) are one row whose fields reflect the latest entry.
 * - Report only conditions the source asserts the patient has or had. Never report a condition that
 *   was ruled out, or one that was only suspected (working/provisional) and never confirmed.
 * - Billing codes attached to a visit or claim are not problem-list entries, unless the source says
 *   its problem list is built from them.
 * - **Drug-caused diagnoses.** A diagnosis the source attributes to a drug (for example "SGLT2
 *   inhibitor-associated ketoacidosis", "ACE inhibitor-associated angioedema", or an ICD-10 T-code
 *   "adverse effect of …" entry) yields an `AllergyIntoleranceRow` for the drug (see there) in addition
 *   to a ProblemRow for the condition it caused. A T-code entry that names only the adverse effect and no
 *   condition yields the AllergyIntoleranceRow alone.
 */
export interface ProblemRow {
  /** The condition as the source words it, e.g. "Chronic kidney disease stage 3a". */
  condition: string;
  /** ICD-10-CM code, with the dot, as the source gives it (latest). Omit if the source gives none. */
  icd10cm?: string;
  /** SNOMED CT concept id, if the source gives one. */
  snomed?: string;
  /**
   * - 'active': the patient has it.
   * - 'resolved': the patient had it and the source says it is resolved or historical.
   */
  status: 'active' | 'resolved';
  /** When the condition began, at the precision the source knows. Omit if the source does not say. */
  onset?: { value: PartialDate; precision: 'year' | 'month' | 'day' };
  /**
   * For chronic kidney disease only: the KDIGO GFR category the source most recently recorded for this
   * patient ('G3a' for "stage 3a", "N18.31" or a G3a category field). As recorded by a clinician; never
   * computed from lab values.
   */
  ckd_stage?: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';
  /** For chronic kidney disease only: KDIGO albuminuria category as recorded ('A1', 'A2', 'A3'), if the source records one. */
  albuminuria?: 'A1' | 'A2' | 'A3';
  /** See `Sensitivity`. */
  sensitivity?: Sensitivity[];
  evidence: Evidence;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Allergies, intolerances, adverse reactions
// ─────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * One substance the patient should avoid, or be careful with, because of a past reaction, as of `asOf`.
 * This is a list of substances to avoid; it does not claim a mechanism. Only current entries: an entry
 * the source marks inactive or invalid is not reported. "No known drug allergies" is not a row.
 *
 * A diagnosis the source attributes to a drug (see `ProblemRow`) also yields a row here. Its substance
 * is the specific drug when the record names it; when the diagnosis names only a drug class, it is the
 * one drug of that class on the patient's medication list in the same item if there is exactly one;
 * otherwise the class as written (e.g. "SGLT2 inhibitor").
 */
export interface AllergyIntoleranceRow {
  /** Substance: generic ingredient name, lower case, for drugs ("lisinopril"); a drug class or other substance as written otherwise. */
  substance: string;
  /** RxNorm ingredient CUI, if the source gives one. */
  rxnorm_ingredient?: string;
  /**
   * What kind of reaction it was, by what happened (not by which list the source keeps it on, and not by
   * mechanism):
   * - 'hypersensitivity': a hypersensitivity-type reaction: hives, rash, angioedema, anaphylaxis,
   *   bronchospasm. Includes ACE-inhibitor angioedema, which is not immune-mediated.
   * - 'side_effect': a predictable, non-dangerous side effect that made the drug unacceptable (e.g.
   *   ACE-inhibitor cough, GI upset, myalgia).
   * - 'serious_adverse_event': serious harm attributed to the drug that is not a hypersensitivity-type
   *   reaction (e.g. drug-associated ketoacidosis, lactic acidosis, severe hyperkalemia).
   * If the source keeps all of these on one undifferentiated list, decide from the recorded reaction.
   */
  reaction_type: 'hypersensitivity' | 'side_effect' | 'serious_adverse_event';
  /**
   * Mechanism, only as far as the record or well-established pharmacology says:
   * - 'immune': immune-mediated (IgE or T-cell), stated by the source or by a confirmed allergy test.
   * - 'non_immune': known not to be immune-mediated (e.g. ACE-inhibitor cough or angioedema, which are
   *   bradykinin-mediated; drug-associated ketoacidosis).
   * - 'unknown': not established. Use this when in doubt.
   */
  mechanism: 'immune' | 'non_immune' | 'unknown';
  /** Reaction(s) as the source words them, joined with "; ". Omit if not recorded. */
  reaction?: string;
  /**
   * Criticality: how dangerous re-exposure is judged to be.
   * - 'high': re-exposure could be serious or life-threatening.
   * - 'low': re-exposure unlikely to cause serious harm.
   * - 'unknown': not assessed or not derivable.
   * A source's "severity" scale is mapped by meaning: mild -> 'low'; severe or life-threatening -> 'high'.
   */
  criticality: 'low' | 'high' | 'unknown';
  /** When the reaction began, at the precision the source knows. */
  onset?: { value: PartialDate; precision: 'year' | 'month' | 'day' };
  /** See `Sensitivity`. */
  sensitivity?: Sensitivity[];
  evidence: Evidence;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Lab results
// ─────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Analytes this consumer tracks, with the unit `LabResultRow.value` must be in. Results for other
 * tests are not reported.
 *
 * | analyte         | unit            | notes |
 * |-----------------|-----------------|-------|
 * | creatinine      | mg/dL           | serum |
 * | egfr            | mL/min/1.73m2   | see `egfr_equation` and the eGFR rule below |
 * | potassium       | mmol/L          | |
 * | sodium          | mmol/L          | |
 * | chloride        | mmol/L          | |
 * | bicarbonate     | mmol/L          | total CO2 |
 * | anion_gap       | mmol/L          | |
 * | bun             | mg/dL           | urea nitrogen |
 * | glucose         | mg/dL           | laboratory glucose (serum/plasma); home meter readings are vitals |
 * | a1c             | %               | NGSP |
 * | uacr            | mg/g            | urine albumin/creatinine ratio |
 * | platelets       | 10*3/uL         | thousands per microlitre: 212 000 cells/uL is 212 |
 * | wbc             | 10*3/uL         | thousands per microlitre |
 * | hemoglobin      | g/dL            | |
 * | bhb             | mmol/L          | beta-hydroxybutyrate |
 * | ph              | [pH]            | blood gas pH |
 * | pco2            | mmHg            | |
 * | lipase          | U/L             | |
 * | troponin        | ng/mL           | troponin I |
 * | cholesterol     | mg/dL           | total |
 * | triglycerides   | mg/dL           | |
 * | hdl             | mg/dL           | |
 * | ldl             | mg/dL           | measured or calculated |
 */
export type Analyte =
  | 'creatinine' | 'egfr' | 'potassium' | 'sodium' | 'chloride' | 'bicarbonate' | 'anion_gap' | 'bun'
  | 'glucose' | 'a1c' | 'uacr' | 'platelets' | 'wbc' | 'hemoglobin' | 'bhb' | 'ph' | 'pco2' | 'lipase'
  | 'troponin' | 'cholesterol' | 'triglycerides' | 'hdl' | 'ldl';

/**
 * One valid laboratory result.
 *
 * - One row per result. A result the source shows several times (copies in several documents, a
 *   preliminary and a final copy) is one row, taken from the copy with the most advanced status.
 * - Report only values that stand: leave out results that were withdrawn, invalidated or "corrected
 *   away" by the lab, results of orders voided or entered in error, results not performed, and
 *   superseded copies. A confirmation repeat is a second valid result; keep both.
 * - **eGFR rule.** One eGFR row per eGFR calculation the source reports for a specimen. When the source
 *   reports race-specific variants of one calculation (a value with and one without a race
 *   coefficient), report only the variant without the race coefficient. Report the value as printed
 *   (do not recompute).
 */
export interface LabResultRow {
  analyte: Analyte;
  /** Numeric value in the analyte's unit (see `Analyte`). For a result printed with a comparator (">60", "<0.01"), the number part. */
  value: number;
  /** Set when the printed result has a comparator: ">60" -> value 60, comparator '>'. */
  comparator?: '<' | '>' | '<=' | '>=';
  /** The analyte's unit from the table in `Analyte`, exactly as written there. */
  unit: string;
  /** Specimen collection time, RFC 3339 with offset (any offset; it denotes an instant). */
  collected: string;
  /** 'final' (also for amended or corrected values that stand) or 'preliminary'. */
  status: 'final' | 'preliminary';
  /**
   * For analyte 'egfr' only: the equation the source says it used.
   * - 'ckd-epi-2021': CKD-EPI 2021 (race-free).
   * - 'ckd-epi-2009': CKD-EPI 2009.
   * - 'mdrd': MDRD.
   * - 'unknown': not stated.
   * When a code and a method note disagree, believe the method note.
   */
  egfr_equation?: 'ckd-epi-2021' | 'ckd-epi-2009' | 'mdrd' | 'unknown';
  /** LOINC code if the source gives one for this result. */
  loinc?: string;
  evidence: Evidence;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Vital signs and home readings
// ─────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * One set of vital signs taken together, or one home reading.
 *
 * - A clinic or hospital vital-sign set (BP, pulse, weight taken within a few minutes at one visit) is
 *   one row; `local_time` is the time of its first blood pressure (or of its first measurement if no
 *   BP). A repeat blood pressure taken later in the same visit goes in `repeat_*` on the same row.
 * - Each home BP reading and each home glucose reading is its own row.
 * - Each measurement is reported once: if a source shows the same measurement twice (a reading typed
 *   in by hand that duplicates one synced from the device a minute or two earlier with the same
 *   values), report it once, preferring the device copy.
 */
export interface VitalRow {
  /** 'clinic' (outpatient office), 'hospital' (ED or inpatient), or 'home' (patient's own devices). */
  setting: 'clinic' | 'hospital' | 'home';
  /** Local wall-clock time in America/Chicago, `YYYY-MM-DDTHH:MM`. */
  local_time: string;
  systolic_mmhg?: number;
  diastolic_mmhg?: number;
  /** Repeat blood pressure at the same visit, if one was taken. */
  repeat_systolic_mmhg?: number;
  repeat_diastolic_mmhg?: number;
  pulse_bpm?: number;
  /** Body weight in kilograms (1 lb = 0.45359237 kg), one decimal place. */
  weight_kg?: number;
  /** Home glucose meter reading in mg/dL (1 mmol/L = 18.016 mg/dL), rounded to a whole number. */
  glucose_mg_dl?: number;
  /** Set when the meter showed HI or LO instead of a number; `glucose_mg_dl` is then the meter's limit in mg/dL. */
  glucose_out_of_range?: 'HI' | 'LO';
  evidence: Evidence;
}
