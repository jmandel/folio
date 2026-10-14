/**
 * Consumer views: the rows a patient-facing chart application shows for one patient's record at one
 * health organization.
 *
 * Each organization publishes record items ({@link FolioItem}). For each organization a mapper implements
 * {@link Transform}: it receives every item that organization published for one patient (in any order,
 * including superseded and retracted items) and a local date `asOf` (`YYYY-MM-DD`), and returns
 * {@link ViewRows}: the organization's record as it stood at the end of that day. A view the organization has
 * nothing for is an empty array.
 *
 * Rules shared by every view:
 *
 * - **As-of.** An item counts when its `recorded` time is on or before the end of `asOf` (23:59:59.999 local
 *   time). Among those, an item does not count if a counting item supersedes it (directly or through a chain:
 *   if C supersedes B and B supersedes A, A is replaced too) or retracts it. A superseding or retracting item
 *   recorded after `asOf` has no effect yet. `supersedes` and `retracts` only refer to items of the same issuer.
 * - **Corrections versus changes.** Supersession replaces an item entirely (correction, amendment, re-statement).
 *   A retracted item was entered in error and is treated as if it never existed. A change in clinical state (a
 *   medicine paused, a problem resolved) arrives as a new fact in a new item, not as a supersession; the
 *   earlier item still counts as history.
 * - **Time zone.** The consumer's time zone is America/Chicago. "Local date" and "local time" mean wall-clock
 *   time there. Convert date-times that carry an offset or zone to local time (e.g. `2025-03-04T03:30:00Z` is
 *   local date 2025-03-03, 21:30). A date-time with no offset and no zone is already local time: report it as
 *   written, never shift it and never drop it. A plain date is a local date.
 * - **Partial dates.** A source date may be only a year (`2019`) or a year and month (`2019-06`). Keep exactly
 *   the precision the source has; never pad to a full date.
 * - **Only what this organization records.** Report what this organization's items say, without inference from
 *   other organizations and without correcting the source. Rows come from structured payload entries; the
 *   narrative may help interpret an entry, but is never the only basis for a row.
 * - **Evidence.** Every row lists the items (and, where the payload has them, entry ids) it rests on; at least
 *   the item that gives the row its current state.
 * - **Sensitive entries.** Report everything, including entries the organization marks restricted or
 *   confidential. Tag rows with `sensitivity` when the source marks the entry with a sensitive category (map
 *   the source's own category) or when the entry plainly belongs to one (e.g. sertraline for depression →
 *   `mental-health`). Never drop a row because it is sensitive; whether to show or share it is the patient's
 *   later decision.
 * - **Determinism.** Same input, same output. No clock, randomness, network or file access.
 */

/**
 * One record item as published by a health organization. Items are never edited; corrections arrive as new
 * items that supersede or retract earlier ones.
 */
export interface FolioItem {
  /** Record-item format identifier. Carries no clinical meaning. */
  folio: string;

  /** Identifier of this item, unique within the issuer. Referenced by `supersedes`, `retracts` and row evidence. */
  id: string;

  /** The organization that published the item. All items given to one transform call share the same issuer. */
  issuer: string;

  /** The patient the item is about, as identified by the issuer. */
  patient: string;

  /**
   * When the clinical event happened (visit, specimen collection, list review…). Date or date-time, possibly
   * partial. Not used for the as-of cut-off.
   */
  effective: string;
  /** End of the clinical event when it spans a period (e.g. a hospital stay). */
  effective_end?: string;

  /**
   * When the organization committed the item (date-time). Decides whether the item counts for a given `asOf`:
   * it counts when this is on or before the end of `asOf`, local time.
   */
  recorded: string;
  /** Who wrote or signed the item, as far as the issuer says. */
  author?: { id?: string; name?: string; role?: string };

  /**
   * The organization's own schema that types `payload`: its location, the type name within it, and the
   * SHA-256 of the schema document.
   */
  schema?: { url: string; type: string; sha256: string };

  /**
   * Ids of earlier items of the same issuer that this item replaces entirely (correction, amendment,
   * re-statement). Transitive. The replaced items no longer count once this item counts.
   */
  supersedes?: string[];

  /**
   * Ids of earlier items of the same issuer that were entered in error. Nothing replaces them; once this item
   * counts, they are treated as never having existed.
   */
  retracts?: string[];

  /**
   * Human-readable Markdown account of the item. `<ref id="…">` spans point at payload entries. May help
   * interpret an entry; never the only basis for a row.
   */
  narrative: string;

  /** Structured entries, typed by the organization's schema (`schema`). Rows are built from these. */
  payload: Record<string, any>;
}

/**
 * The mapper's entry point. `items`: every item one organization published for one patient, in any order,
 * including superseded and retracted ones. `asOf`: a local date `YYYY-MM-DD`. Returns that organization's
 * record as it stood at the end of `asOf` (America/Chicago). Must be deterministic.
 */
export type Transform = (items: FolioItem[], asOf: string) => ViewRows;

/** All rows for one organization, one patient, one as-of date. Each array is empty when there is nothing. */
export interface ViewRows {
  /** Outpatient (home) medicines, one row per drug ingredient. */
  medications: MedicationRow[];
  /** Conditions the patient has or had, one row per condition. */
  problems: ProblemRow[];
  /** Current substances to avoid because of a past reaction. */
  allergies: AllergyIntoleranceRow[];
  /** Laboratory results for the listed analytes, one row per result. */
  labs: LabResultRow[];
  /** Clinic and hospital vital-sign sets and home readings. */
  vitals: VitalRow[];
}

/**
 * A local date with the precision the source has: `YYYY`, `YYYY-MM` or `YYYY-MM-DD`. Never padded
 * (a source saying "June 2019" gives `2019-06`, not `2019-06-01`).
 */
export type PartialDate = string;

/**
 * The items a row rests on. Must include at least the item that gives the row its current state; may
 * include earlier items it also relies on (e.g. the start of a medicine that is now held).
 * `item_id`: the item's `id`. `entry_id`: the id of the payload entry within that item, when it has one.
 */
export type Evidence = { item_id: string; entry_id?: string }[];

/**
 * Sensitive categories. `mental-health`: psychiatric conditions and their treatment (e.g. depression,
 * sertraline). `substance-use`: alcohol, opioid or other substance use disorders and their treatment
 * (e.g. buprenorphine). `sexual-reproductive-health`: contraception, pregnancy, fertility, sexual health.
 * `hiv-sti`: HIV and other sexually transmitted infections and their treatment (e.g. chlamydia, an
 * antiretroviral). `genetic`: genetic test results and inherited conditions (e.g. a BRCA1 variant).
 * Set when the source marks the entry with such a category (map the source's own category) or when the entry
 * plainly belongs to one. Omit when none applies.
 */
export type Sensitivity = 'mental-health' | 'substance-use' | 'sexual-reproductive-health' | 'hiv-sti' | 'genetic';

/**
 * One outpatient (home) medicine. Hospital-only orders (infusions, drugs given only during a stay) are not
 * rows; a discharge prescription for home use is.
 *
 * One row per drug ingredient. If the source has several lines or orders for the same ingredient over time,
 * report the most recent one: the one whose own latest event (start, change, hold, resume, stop) is latest.
 * A line or order entered in error never existed. Stopped medicines that the source still shows are rows.
 *
 * Snapshots versus events: if the source publishes its medication list as repeated snapshots (each item a
 * full list), the latest counting snapshot is the list, and a drug absent from it is not reported. If the
 * source publishes events or status changes per line, the latest event for a line decides its state, however
 * old that event is.
 *
 * If a patient's own list names the same drug twice with conflicting statuses, report one row for it; which
 * entry wins is not specified.
 */
export interface MedicationRow {

  /**
   * Generic ingredient name, lower case, without salt or dosage form; brand names translated
   * (e.g. "Ventolin HFA" → "albuterol", "amoxicillin trihydrate 500 mg capsule" → "amoxicillin").
   * Omit only when the record does not say which drug it is.
   */
  ingredient?: string;

  /**
   * RxNorm code of the ingredient (term type IN), only when the source itself states an ingredient-level
   * code. Never looked up or derived from a product-level code.
   */
  rxnorm_ingredient?: string;

  /** The medicine's name as the source writes it (e.g. "Ventolin HFA 90 mcg/actuation inhaler"). */
  drug_name: string;

  /**
   * - `active`: the patient should be taking it (clinician record) or says they are taking it (own list).
   * - `held`: paused, with intent or possibility of resuming; not taking now. Distinct from stopped.
   *   On a patient's own list, an entry marked as taken but annotated by the patient as paused or stopped
   *   for the time being is held.
   * - `stopped`: discontinued.
   * - `unknown`: listed with no decision recorded (e.g. a list the source marks as not reviewed).
   */
  status: 'active' | 'held' | 'stopped' | 'unknown';

  /**
   * Local date the current status began, per the source: the hold date for held, the stop date for stopped,
   * the start or resume date for active. Source precision. Omit if unknown.
   */
  status_since?: PartialDate;

  /**
   * Amount per administration currently prescribed; for held or stopped rows, the amount at the time of the
   * hold or stop. On a patient's own list, the amount the patient says they take.
   * - Strength per unit and a count: report the mass (strength × count): "ibuprofen 200 mg, take 2 tablets"
   *   → 400 mg; "albuterol 90 mcg/puff, 2 puffs" → 180 mcg.
   * - No count but a time ("take in the evening") means one unit: "cetirizine 10 mg tablet, take in the
   *   evening" → 10 mg.
   * - `tablet` only when the strength is unknown ("1 tablet of prednisone", strength not given → 1 tablet).
   * - Normalize unit spellings: "milligrams" → mg; "µg", "mcg", "micrograms" → mcg; "U", "IU", "unit(s)" →
   *   units; "ml", "cc" → mL; "tab(s)" → tablet.
   * - Omit when there is no single amount: a range ("1–2 puffs"), a sliding scale, an amount that depends on
   *   a condition, or a strength with no directions at all.
   */
  dose?: { value: number; unit: 'mg' | 'mcg' | 'units' | 'mL' | 'tablet' };

  /**
   * QD once daily; BID twice daily (also "every 12 hours"); TID three times daily (also "every 8 hours");
   * QHS once daily at bedtime; QW once weekly; PRN as needed (e.g. "every 6 hours as needed for wheeze");
   * other for any other schedule (four times daily, every other day, monthly, tapering). A once-daily direction
   * given only as "nightly" or "at night" may be QHS or QD. Omit when the source gives no frequency.
   */
  frequency?: 'QD' | 'BID' | 'TID' | 'QHS' | 'QW' | 'PRN' | 'other';

  /**
   * Only for stopped rows, and only when the source gives a coded or clearly stated reason.
   * `adverse_reaction`: stopped because of a side effect or reaction (e.g. rash on amoxicillin).
   * `ineffective`: did not work. `therapy_changed`: replaced by another drug or regimen.
   * `course_complete`: a planned course ended (e.g. a 10-day antibiotic course). `patient_choice`: the
   * patient decided to stop. `other`: a stated reason that fits none of these.
   */
  stop_reason?: 'adverse_reaction' | 'ineffective' | 'therapy_changed' | 'course_complete' | 'patient_choice' | 'other';

  /** The source's free-text reason for the current status, as written (e.g. "holding until after knee surgery"). */
  status_reason_text?: string;

  /** true for the patient's own account (a self-reported list); false for a clinician's record. */
  patient_reported: boolean;

  /** true when the source says the medicine was bought without a prescription (over the counter). Omit otherwise. */
  otc?: boolean;

  /** Sensitive categories of this medicine; see {@link Sensitivity}. Omit when none applies. */
  sensitivity?: Sensitivity[];
  /** Items and entries this row rests on; at least the one giving the current status. */
  evidence: Evidence;
}

/**
 * A condition the source asserts the patient has or had. One row per condition: entries that restage or
 * recode the same condition are one row with the latest wording, codes and stage.
 *
 * Not rows: ruled-out conditions; conditions only suspected (working, provisional, "rule out") and never
 * confirmed; diagnoses recorded only to bill an encounter, unless the source says its problem list is built
 * that way.
 *
 * A diagnosis the source attributes to a drug (a named drug, a drug class, or an "adverse effect of <drug>"
 * code) also yields an {@link AllergyIntoleranceRow} for the drug. "Urticaria due to amoxicillin" gives a
 * problem row for urticaria and an allergy row for amoxicillin. A code that names only the adverse effect and
 * no condition (e.g. ICD-10-CM T36.0X5A "adverse effect of penicillins") gives the allergy row alone.
 */
export interface ProblemRow {

  /** The condition in the source's latest wording (e.g. "Moderate persistent asthma"). */
  condition: string;

  /** ICD-10-CM code as the source states it in its latest entry (e.g. "J45.40"). Omit if not given. */
  icd10cm?: string;

  /** SNOMED CT concept id as the source states it in its latest entry. Omit if not given. */
  snomed?: string;

  /** `active`, or `resolved` when the source says resolved, inactive-resolved or historical. */
  status: 'active' | 'resolved';

  /**
   * When the condition began, per the source, as a local date with the source's precision
   * (`{ value: "2019-06", precision: "month" }`). Omit if unknown.
   */
  onset?: { value: PartialDate; precision: 'year' | 'month' | 'day' };

  /**
   * Chronic kidney disease rows only: the KDIGO GFR category the source most recently recorded, as recorded
   * by a clinician (from wording, a code, or a category field). Never computed from lab values. Omit otherwise.
   */
  ckd_stage?: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';

  /**
   * Chronic kidney disease rows only: the KDIGO albuminuria category the source most recently recorded, as
   * recorded by a clinician (from wording, a code, or a category field). Never computed from lab values.
   * Omit otherwise.
   */
  albuminuria?: 'A1' | 'A2' | 'A3';

  /** Sensitive categories of this condition; see {@link Sensitivity}. Omit when none applies. */
  sensitivity?: Sensitivity[];
  /** Items and entries this row rests on; at least the one giving the latest wording and status. */
  evidence: Evidence;
}

/**
 * A current entry on the list of substances to avoid because of a past reaction. Makes no claim about
 * mechanism. Only current entries: inactive, refuted or entered-in-error entries are not rows, and
 * "no known allergies" is not a row.
 *
 * Also produced from a drug-attributed diagnosis (see {@link ProblemRow}). The substance is then the specific
 * drug when the record names it; when it names only a drug class, the one drug of that class on the patient's
 * medication list in the same item if there is exactly one (class "penicillins", amoxicillin on the list →
 * amoxicillin), otherwise the class as written.
 */
export interface AllergyIntoleranceRow {

  /**
   * For a single drug: generic ingredient name, lower case ("Keflex 500 mg" → "cephalexin"). For anything
   * else (drug classes, combinations, foods, environmental substances): as written ("Sulfonamide
   * antibiotics", "Peanut", "Latex").
   */
  substance: string;

  /** RxNorm ingredient code, only when the source states an ingredient-level code. Never guessed. */
  rxnorm_ingredient?: string;

  /**
   * Decided by what happened, not by which list the source keeps the entry on and not by mechanism.
   * - `hypersensitivity`: hives, rash, swelling of lips/face/tongue, anaphylaxis, bronchospasm, whatever
   *   the mechanism.
   * - `side_effect`: a predictable, non-dangerous effect that made the drug unacceptable (e.g. stomach upset
   *   on erythromycin, drowsiness on an antihistamine).
   * - `serious_adverse_event`: serious harm attributed to the drug that is not a hypersensitivity-type
   *   reaction (e.g. liver injury on isoniazid, pancreatitis on valproate).
   * If the source keeps everything on one undifferentiated list, decide from the recorded reaction.
   */
  reaction_type: 'hypersensitivity' | 'side_effect' | 'serious_adverse_event';

  /**
   * `immune` only when the source (or a confirmed allergy test it records) says the reaction is immune-mediated;
   * `non_immune` when known not to be (well-established non-immune drug effects, e.g. nausea on erythromycin);
   * `unknown` when not established. Use `unknown` when in doubt.
   */
  mechanism: 'immune' | 'non_immune' | 'unknown';

  /** The source's reaction wording, several manifestations joined with "; " (e.g. "hives; lip swelling"). */
  reaction?: string;

  /**
   * `high`: re-exposure could be serious or life-threatening; `low`; `unknown` when the source gives neither.
   * Map a source's severity scale by meaning: mild → low; severe or life-threatening → high.
   */
  criticality: 'low' | 'high' | 'unknown';

  /** When the reaction first occurred, local date with the source's precision. Omit if unknown. */
  onset?: { value: PartialDate; precision: 'year' | 'month' | 'day' };

  /** Sensitive categories of this entry; see {@link Sensitivity}. Omit when none applies. */
  sensitivity?: Sensitivity[];
  /** Items and entries this row rests on; at least the one giving the current entry. */
  evidence: Evidence;
}

/**
 * Reported analytes and their fixed units (`LabResultRow.unit`). Convert source values to these units.
 *
 * | analyte         | meaning                                      | unit          |
 * |-----------------|----------------------------------------------|---------------|
 * | `creatinine`    | serum/plasma creatinine                      | mg/dL         |
 * | `egfr`          | estimated glomerular filtration rate         | mL/min/1.73m2 |
 * | `potassium`     | potassium                                    | mmol/L        |
 * | `sodium`        | sodium                                       | mmol/L        |
 * | `chloride`      | chloride                                     | mmol/L        |
 * | `bicarbonate`   | bicarbonate (total CO2)                      | mmol/L        |
 * | `anion_gap`     | anion gap                                    | mmol/L        |
 * | `bun`           | urea nitrogen                                | mg/dL         |
 * | `glucose`       | laboratory glucose (not a home meter)        | mg/dL         |
 * | `a1c`           | hemoglobin A1c, NGSP                         | %             |
 * | `uacr`          | urine albumin/creatinine ratio               | mg/g          |
 * | `platelets`     | platelet count                               | 10*3/uL       |
 * | `wbc`           | white blood cell count                       | 10*3/uL       |
 * | `hemoglobin`    | hemoglobin                                   | g/dL          |
 * | `bhb`           | beta-hydroxybutyrate                         | mmol/L        |
 * | `ph`            | pH                                           | [pH]          |
 * | `pco2`          | partial pressure of CO2                      | mmHg          |
 * | `lipase`        | lipase                                       | U/L           |
 * | `troponin`      | troponin I                                   | ng/mL         |
 * | `cholesterol`   | total cholesterol                            | mg/dL         |
 * | `triglycerides` | triglycerides                                | mg/dL         |
 * | `hdl`           | HDL cholesterol                              | mg/dL         |
 * | `ldl`           | LDL cholesterol, measured or calculated      | mg/dL         |
 *
 * 10*3/uL is thousands per microlitre: 350 000 cells/uL is 350. Other analytes are not reported.
 */
export type Analyte =
  | 'creatinine' | 'egfr' | 'potassium' | 'sodium' | 'chloride' | 'bicarbonate' | 'anion_gap' | 'bun'
  | 'glucose' | 'a1c' | 'uacr' | 'platelets' | 'wbc' | 'hemoglobin' | 'bhb' | 'ph' | 'pco2' | 'lipase'
  | 'troponin' | 'cholesterol' | 'triglycerides' | 'hdl' | 'ldl';

/**
 * One laboratory result for a listed analyte ({@link Analyte}).
 *
 * One row per result. A result shown several times (copies in several items, a preliminary then a final copy)
 * is one row, taken from the copy with the most advanced status; its evidence lists the copies used.
 *
 * Only values that stand. Leave out results withdrawn, invalidated or corrected away by the lab; results of
 * orders voided or entered in error; results not performed; superseded copies. A confirmation repeat on a
 * new measurement is a second valid result and its own row.
 *
 * eGFR: one row per calculation the source reports for a specimen. When the source reports variants of one
 * calculation with and without a race coefficient, report only the one without. Report the value as printed;
 * never recompute.
 */
export interface LabResultRow {
  /** Which analyte; see the table on {@link Analyte}. */
  analyte: Analyte;

  /** Numeric value in the analyte's unit, converted if the source used another unit. ">90" → 90. */
  value: number;

  /** The comparator printed with the value (">90" → `>`). Omit for plain values. */
  comparator?: '<' | '>' | '<=' | '>=';

  /** The analyte's fixed unit from the table on {@link Analyte}, written exactly as there (e.g. "mg/dL", "[pH]"). */
  unit: string;

  /**
   * Specimen collection time, RFC 3339 with offset (e.g. `2025-03-04T08:15:00-06:00`). If the source gives a
   * date-time without offset, it is local time: keep the wall-clock time and add the America/Chicago offset in
   * effect then.
   */
  collected: string;

  /** `final` (including amended or corrected values that stand) or `preliminary`. */
  status: 'final' | 'preliminary';

  /**
   * eGFR rows only: the equation the source says it used (CKD-EPI 2021 race-free, CKD-EPI 2009, MDRD);
   * `unknown` if not stated. Omit for other analytes.
   */
  egfr_equation?: 'ckd-epi-2021' | 'ckd-epi-2009' | 'mdrd' | 'unknown';

  /** LOINC code of the result as the source gives it. Omit if not given; never looked up. */
  loinc?: string;
  /** Items and entries this row rests on; at least the copy the row's value and status come from. */
  evidence: Evidence;
}

/**
 * A vital-sign set or a home reading.
 *
 * A clinic or hospital vital-sign set (measurements taken within a few minutes at one visit) is one row; a
 * repeat blood pressure later in the same visit goes in `repeat_*`. Each home reading is its own row. Each
 * measurement is reported once: a hand-entered reading that duplicates a device reading taken a minute or two
 * earlier with the same values is one row, preferring the device copy.
 */
export interface VitalRow {

  /** `clinic`; `hospital` (emergency department or inpatient); `home` (patient's own devices). */
  setting: 'clinic' | 'hospital' | 'home';

  /**
   * Local wall-clock time `YYYY-MM-DDTHH:MM` in America/Chicago. For a clinic or hospital set: the time of its
   * first blood pressure, or of its first measurement if it has no blood pressure. For a home reading: the
   * reading's time. Times without offset are already local: report as written.
   */
  local_time: string;
  /** Systolic blood pressure (first reading of the set), mmHg. */
  systolic_mmhg?: number;
  /** Diastolic blood pressure (first reading of the set), mmHg. */
  diastolic_mmhg?: number;

  /** Systolic pressure of a repeat blood pressure later in the same visit, mmHg. Clinic/hospital sets only. */
  repeat_systolic_mmhg?: number;
  /** Diastolic pressure of a repeat blood pressure later in the same visit, mmHg. Clinic/hospital sets only. */
  repeat_diastolic_mmhg?: number;
  /** Pulse (heart rate), beats per minute. */
  pulse_bpm?: number;

  /** Body weight in kg, one decimal (1 lb = 0.45359237 kg; 154 lb → 69.9). */
  weight_kg?: number;

  /**
   * Home glucose reading in mg/dL, whole number (1 mmol/L = 18.016 mg/dL; 5.5 mmol/L → 99). When the meter
   * showed HI or LO, the meter's limit in mg/dL.
   */
  glucose_mg_dl?: number;

  /** `HI` or `LO` when the meter showed that instead of a number; `glucose_mg_dl` is then the meter's limit. */
  glucose_out_of_range?: 'HI' | 'LO';
  /** Items and entries this row rests on. */
  evidence: Evidence;
}
