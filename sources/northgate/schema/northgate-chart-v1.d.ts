/**
 * Northgate Family Medicine — chart event log, version 1.
 *
 * Northgate is a primary-care practice. Its EHR keeps the chart as an append-only log of small
 * events, and publishes each event as one FOLIO record item: one signed visit note, one vital-sign
 * set, one medication change, one problem-list change, one allergy-list change, one list review,
 * one interfaced lab result report, one referral step, or one void.
 *
 * Most items carry exactly one payload entry. An imported result report carries one entry per
 * result component (a renal panel has a creatinine entry and one or more eGFR entries).
 *
 * There is no "current state" record. The current medication list, problem list and allergy list
 * are what you get by replaying the events in `effective` order for each list-line id (`med_id`,
 * `problem_id`, `allergy_id`), after dropping items that were retracted or superseded.
 *
 * Conventions that apply to every entry type:
 * - Times carry an offset. Northgate is in America/Chicago (-06:00 standard, -05:00 daylight).
 * - Item narrative is what the clinician typed into the event's comment box or signed as a note.
 *   It is never generated from the payload. Many items have no narrative.
 * - `visit_id`, where present, is Northgate's visit number (e.g. "V-2024-111203"). It groups the
 *   events entered during one visit. Absent for events entered outside a visit (interfaced
 *   results, phone refills, chart corrections).
 * - Items received through the lab interface have no `author`; every other item's author is the
 *   Northgate user who entered it.
 */

/** One entry in a Northgate item. Discriminated by `type`. */
export type ChartEvent =
  | Visit
  | VitalSet
  | MedEvent
  | ProblemEvent
  | AllergyEvent
  | ListReviewed
  | ImportedResult
  | ReferralEvent
  | ChartCorrection;

/**
 * Restricted-chart category. Northgate hides restricted entries from users without the matching
 * privilege and excludes them from routine outbound records unless the patient consents.
 * - 'BH': behavioral health (depression, anxiety, and the medications used for them).
 * Absent means not restricted. The flag is set by the clinician when the entry is created and
 * restated on every later event for the same list line.
 */
export type Restriction = 'BH';

/**
 * A full date (`YYYY-MM-DD`) with how much of it is real. Northgate's date picker always stores a
 * full date; when the clinician knows only the year or month, it fills the rest with 01 and records
 * the precision. So `{ date: "2016-01-01", precision: "year" }` means "sometime in 2016", not
 * January 1st.
 */
export interface FuzzyDate {
  /** Always a full date. Days and months beyond `precision` are filler (`01`). */
  date: string;
  /**
   * How much of `date` is meaningful.
   * - 'year': only the year is known.
   * - 'month': year and month are known.
   * - 'day': the full date is known.
   */
  precision: 'year' | 'month' | 'day';
}

/**
 * A visit note: the clinician's signed note for one office, telehealth or nurse visit. The item
 * narrative is the note itself, which is usually a few terse lines. The structured events from the
 * same visit (vitals, medication and problem changes) are separate items sharing the `visit_id`.
 */
export interface Visit {
  type: 'visit';

  /** Northgate visit number. Stable; every event entered during this visit carries it. */
  visit_id: string;

  /**
   * Kind of visit.
   * - 'office': in-person visit with a clinician.
   * - 'telehealth': video visit.
   * - 'nurse': nurse-only visit (BP check, injection teaching). No clinician exam.
   * - 'phone': documented phone encounter.
   */
  visit_type: 'office' | 'telehealth' | 'nurse' | 'phone';

  /** Reason for visit as typed at scheduling or check-in, e.g. "Hosp f/u". Free text. */
  reason: string;

  /**
   * Billing diagnoses addressed at this visit, ICD-10-CM codes with Northgate's display text.
   * These are what was billed, not the problem list: a code here does not add, change or confirm a
   * problem. Follow-up and screening codes (Z codes) appear here and never on the problem list.
   */
  billing_dx: { icd10cm: string; display: string }[];
}

/**
 * One set of vital signs taken together, usually by a medical assistant at check-in. Any member
 * may be absent when it was not measured. Values are as entered on the flowsheet; nothing is
 * derived (BMI is not stored).
 */
export interface VitalSet {
  type: 'vital_set';

  /** Visit the set was taken at. Absent for a stand-alone BP check logged outside a visit. */
  visit_id?: string;

  /**
   * Blood pressure as typed on the flowsheet: text "systolic/diastolic" in mmHg, e.g. "152/94".
   * Always two integers separated by "/". Absent if not taken.
   */
  bp?: string;

  /**
   * A second blood pressure taken later in the same visit, same text form as `bp`. Present only
   * when the first was high and the MA repeated it. Both readings are valid measurements.
   */
  bp_repeat?: string;

  /**
   * Patient position for `bp` and `bp_repeat`.
   * - 'sitting', 'standing', 'supine': as recorded. Absent means not recorded (almost always sitting).
   */
  bp_position?: 'sitting' | 'standing' | 'supine';

  /** Pulse, beats per minute. */
  pulse_bpm?: number;

  /** Weight in pounds, clothed, clinic scale. One decimal place. */
  weight_lb?: number;

  /** Height in inches. Usually measured once a year; absent otherwise. */
  height_in?: number;

  /** Oral temperature, degrees Fahrenheit. */
  temp_f?: number;

  /** Pulse oximetry, percent, room air. */
  spo2_pct?: number;
}

/**
 * One change to one line of the medication list: started, dose changed, held, resumed, stopped,
 * or added from an outside record. Every event restates the whole order line as it stands after
 * the event (on a 'stop' or 'hold', the line as it was when stopped or held), so a single event is
 * readable on its own.
 */
export interface MedEvent {
  type: 'med_event';

  /**
   * Northgate medication-list line id, e.g. "ML-30418". Stable across all events for one line.
   * A drug that is stopped and later restarted gets a new line id.
   */
  med_id: string;

  /**
   * What happened to the line.
   * - 'start': line created; the patient should start (or, for medications already taken at the
   *   first Northgate visit, is already taking) the drug.
   * - 'change': dose, frequency or sig changed; the line stays active.
   * - 'hold': paused with intent to resume. The line stays on Northgate's list, shown "On hold";
   *   the patient should not be taking it. A hold does not expire on its own: it lasts until a
   *   'resume' or 'stop' event, however long that takes.
   * - 'resume': a held line is active again.
   * - 'stop': discontinued. Final for this line; a restart is a new 'start' with a new `med_id`.
   * Held is not stopped and not active. Only the latest event per `med_id` says where a line stands.
   */
  action: 'start' | 'change' | 'hold' | 'resume' | 'stop';

  /**
   * Where the line came from.
   * - 'northgate': prescribed or managed by a Northgate clinician.
   * - 'outside': entered during medication reconciliation from another organization's record
   *   (e.g. a Lakeview nephrology visit summary). Northgate does not manage it and learns of
   *   changes only when someone reconciles again, so outside lines can lag the prescriber's record.
   */
  origin: 'northgate' | 'outside';

  /**
   * The drug.
   * - `name`: display name as on the order, e.g. "losartan 50 MG Oral Tablet".
   * - `rxnorm`: RxNorm CUI (SCD or SBD) from Northgate's drug file. Present for Northgate-prescribed
   *   lines; often absent for 'outside' lines, which carry only `outside_code`.
   * - `outside_code`: the other organization's drug identifier as it appeared in their record,
   *   with `system` naming that organization's code space (e.g. "lakeview-drug"). Present only on
   *   'outside' lines. Not mapped to RxNorm.
   */
  drug: {
    name: string;
    rxnorm?: string;
    outside_code?: { system: string; code: string };
  };

  /**
   * Amount per dose. `unit` is Northgate's dose unit text: "mg", "units" (insulin), or "tab".
   * Absent when the sig cannot be expressed as one amount (e.g. sliding scale).
   */
  dose?: { value: number; unit: string };

  /**
   * Northgate frequency code.
   * - 'QD': once daily. 'BID': twice daily. 'TID': three times daily.
   * - 'QHS': once daily at bedtime. 'PRN': as needed. 'OTHER': see `sig`.
   */
  frequency?: 'QD' | 'BID' | 'TID' | 'QHS' | 'PRN' | 'OTHER';

  /** Patient instructions exactly as printed on the prescription, e.g. "Take 1 tablet by mouth daily". */
  sig?: string;

  /**
   * Why the line was stopped. Present on every 'stop'; absent on other actions.
   * - 'adverse_reaction': stopped because of a side effect or adverse reaction. A matching
   *   allergy-list event (`allergy_event`) is usually entered the same day, but not always.
   * - 'ineffective': not working well enough.
   * - 'therapy_changed': replaced by a different drug for the same purpose.
   * - 'course_complete': finite course finished.
   * - 'patient_choice': patient declined to continue.
   * - 'other': see `reason_text`.
   */
  stop_reason?: 'adverse_reaction' | 'ineffective' | 'therapy_changed' | 'course_complete' | 'patient_choice' | 'other';

  /** Clinician's free-text reason for this event. Common on 'stop', 'hold' and 'change'; rare on 'start'. */
  reason_text?: string;

  /**
   * On 'hold' only: the date the prescriber plans to review the hold. A planning date, not an
   * automatic resume; absent when no date was given.
   */
  review_on?: string;

  /** Restricted-chart category; see `Restriction`. */
  restricted?: Restriction;

  /** Visit the event was entered at; absent for phone refills and reconciliation outside a visit. */
  visit_id?: string;
}

/**
 * One change to one line of the problem list. The problem list is maintained by hand: a line
 * changes only when a clinician edits it, so a line can be out of date with respect to newer
 * results or other organizations' diagnoses (see `ListReviewed` for why a review does not mean the
 * line is current).
 */
export interface ProblemEvent {
  type: 'problem_event';

  /** Northgate problem-list line id, e.g. "PL-11902". Stable across all events for one line. */
  problem_id: string;

  /**
   * What happened to the line.
   * - 'add': line created.
   * - 'update': description, codes or onset edited. Staging changes are made this way (the line
   *   keeps its id), so the latest 'update' carries the current wording.
   * - 'resolve': problem no longer active; the line moves to Past Medical History.
   * - 'remove': line deleted from the list because it was wrong (not because the problem resolved).
   */
  action: 'add' | 'update' | 'resolve' | 'remove';

  /** Problem as displayed on the list, e.g. "Chronic kidney disease stage 3a". Restated on every event. */
  description: string;

  /** ICD-10-CM code chosen when the line was created or last updated. */
  icd10cm: string;

  /** SNOMED CT concept from Northgate's terminology service. Absent for lines created before 2020. */
  snomed?: string;

  /** When the problem began, with precision. Often year-only for problems that predate Northgate. */
  onset?: FuzzyDate;

  /** Restricted-chart category; see `Restriction`. */
  restricted?: Restriction;

  /** Visit the event was entered at, if any. */
  visit_id?: string;
}

/**
 * One change to one line of the allergy list. Northgate's allergy list holds allergies,
 * intolerances and adverse reactions in one list; `reaction_type` says which.
 */
export interface AllergyEvent {
  type: 'allergy_event';

  /** Northgate allergy-list line id, e.g. "AL-2207". Stable across events for one line. */
  allergy_id: string;

  /**
   * What happened to the line.
   * - 'add': line created.
   * - 'update': reaction, severity or comment edited.
   * - 'inactivate': no longer considered valid (e.g. patient tolerated a re-challenge). The line
   *   stays in history.
   */
  action: 'add' | 'update' | 'inactivate';

  /**
   * The substance. `rxnorm` is an RxNorm ingredient CUI for drugs; absent for foods and
   * environmental allergens, which have `name` only.
   */
  substance: { name: string; rxnorm?: string };

  /**
   * Kind of reaction, as chosen by the clinician.
   * - 'allergy': immune-mediated (hives, angioedema, anaphylaxis).
   * - 'intolerance': non-immune, predictable side effect that made the drug unacceptable (e.g.
   *   ACE-inhibitor cough). Not an allergy.
   * - 'adverse_reaction': a serious harmful event attributed to the drug that is not an allergy
   *   (e.g. drug-associated ketoacidosis).
   */
  reaction_type: 'allergy' | 'intolerance' | 'adverse_reaction';

  /** Reactions from Northgate's picklist, display text, e.g. ["Cough"]. At least one. */
  reactions: string[];

  /**
   * Northgate's "severity" field, which is really criticality: how dangerous re-exposure is
   * judged to be, not how bad the past reaction was.
   * - 'low': re-exposure unlikely to cause serious harm.
   * - 'high': re-exposure could be serious or life-threatening.
   * - 'unknown': not assessed.
   */
  severity: 'low' | 'high' | 'unknown';

  /** When the reaction began, with precision. Absent if not recorded. */
  onset?: FuzzyDate;

  /** Visit the event was entered at, if any. */
  visit_id?: string;
}

/**
 * A clinician clicked "Mark as reviewed" on one of the patient's lists. Nothing on the list
 * changed. This records that the list was looked at, not that each line was re-confirmed: a
 * stale line stays stale after a review.
 */
export interface ListReviewed {
  type: 'list_reviewed';

  /**
   * Which list was reviewed.
   * - 'problems', 'medications', 'allergies': the corresponding Northgate list.
   */
  list: 'problems' | 'medications' | 'allergies';

  /** Line ids (`problem_id`, `med_id` or `allergy_id`) on the list at the time of the review, active and held lines included. */
  lines_on_list: string[];

  /** Visit the review happened at. */
  visit_id?: string;
}

/**
 * One result component received through Northgate's lab interface from Lakeview Labs and filed in
 * Northgate's chart. Northgate issues its own copy: the same result also exists in Lakeview's own
 * records under Lakeview's identifiers, and `external_ref` points to it. One item holds every
 * component from one Lakeview result report (accession).
 *
 * Values are filed as the interface delivered them, with two exceptions applied by Northgate's
 * interface translation table (see `unit`).
 *
 * When Lakeview sends a correction for a report Northgate already filed, Northgate publishes a new
 * item that `supersedes` the old one and restates every component of the report as corrected, with
 * `result_status` 'C' on the components that changed. This includes a value the lab withdrew without
 * a replacement, as for a hemolyzed specimen: the corrected component then has a non-numeric `value`
 * (e.g. "Result invalidated") and the lab's explanation in `comment`. A separate redraw is a separate
 * accession and a separate item; it does not supersede anything.
 */
export interface ImportedResult {
  type: 'imported_result';

  /**
   * The test.
   * - `nfm_code`: Northgate result-component code, e.g. "CREAT", "EGFR-NAA". Assigned by Northgate's
   *   interface mapping from Lakeview's code; stable across years except where Lakeview introduced
   *   a new test (see `external_ref.result_code`).
   * - `name`: Northgate display name.
   * - `loinc`: LOINC code, present only when Lakeview's message carried one. Lakeview leaves it
   *   off for several local tests, so do not rely on it to find a whole series.
   */
  test: { nfm_code: string; name: string; loinc?: string };

  /**
   * Result value as text, exactly as received (HL7 OBX-5). Usually a plain number ("1.12"), but can
   * carry a comparator (">60", "<0.01") or be words ("Hemolyzed"). Numbers are never padded or
   * rounded by Northgate.
   */
  value: string;

  /**
   * Unit text as filed. Not UCUM; examples: "mg/dL", "mL/min/1.73m2", "mmol/L", "mg/g", "%".
   * Empty string when the result has no unit.
   *
   * Northgate's interface translation table rewrites two analytes on the way in: platelet and
   * white-cell counts arrive from Lakeview in "K/uL" (thousands per microliter) and are filed
   * multiplied by 1000 in "cells/uL". So a Lakeview platelet count of 212 K/uL is filed here as
   * value "212000", unit "cells/uL". All other analytes keep Lakeview's unit.
   */
  unit: string;

  /** Reference range as text from the lab, e.g. "0.57-1.00" or ">59". Absent if none was sent. */
  reference_range?: string;

  /**
   * Abnormal flag from the lab (HL7 OBX-8).
   * - 'H' / 'L': above / below the reference range.
   * - 'HH' / 'LL': critically high / low.
   * - 'A': abnormal, direction not given (non-numeric results).
   * Absent means the lab sent no flag (normal, or not flaggable).
   */
  flag?: 'H' | 'L' | 'HH' | 'LL' | 'A';

  /**
   * Result status from the lab (HL7 OBX-11), as received.
   * - 'P': preliminary; a final will follow as a superseding item.
   * - 'F': final.
   * - 'C': corrected; this value replaces an earlier final for the same accession and component,
   *   and the item supersedes the Northgate item that held the earlier value. The corrected value can
   *   be non-numeric when the lab withdrew the result (see the interface comment).
   */
  result_status: 'P' | 'F' | 'C';

  /** When the specimen was collected (HL7 OBR-7), with offset. The item's `effective` equals this. */
  collected: string;

  /** When Lakeview released the result (HL7 OBX-14), with offset. The item's `recorded` is when Northgate filed it. */
  resulted: string;

  /**
   * Lab comment attached to this component (HL7 NTE), verbatim. Lakeview uses it for method notes
   * (which eGFR equation) and specimen problems ("Specimen hemolyzed").
   */
  comment?: string;

  /**
   * Where the result really comes from.
   * - `lab`: always "Lakeview Labs" in v1.
   * - `accession`: Lakeview's accession number; identical in Lakeview's own record of this result.
   * - `result_code`: Lakeview's own test code (e.g. "LK-CREAT", "LK-EGFR09N"). Lakeview retired
   *   its CKD-EPI 2009 eGFR codes on 2022-01-10 and introduced a race-free CKD-EPI 2021 code;
   *   Northgate maps each to its own `nfm_code`, so the eGFR series spans several codes.
   */
  external_ref: { lab: 'Lakeview Labs'; accession: string; result_code: string };

  /** Northgate order number the result answers, e.g. "NO-2021-55120". Absent for results Lakeview sent without a Northgate order (standing orders). */
  order_id?: string;
}

/**
 * One step of an outbound referral. Each step is its own event; the latest event per
 * `referral_id` gives the referral's current state.
 */
export interface ReferralEvent {
  type: 'referral_event';

  /** Northgate referral number, e.g. "RF-2026-0884". */
  referral_id: string;

  /**
   * What happened.
   * - 'created': referral written and sent; the item narrative is the referral letter if one was written.
   * - 'scheduled': the receiving organization booked an appointment.
   * - 'closed': consult note received or referral otherwise completed.
   * - 'cancelled': withdrawn.
   */
  action: 'created' | 'scheduled' | 'closed' | 'cancelled';

  /** Receiving organization and specialty, display text, e.g. { org: "Lakeview Kidney Care", specialty: "Nephrology" }. */
  to: { org: string; specialty: string };

  /** Clinical question as typed in the referral form. Restated on every event. */
  question: string;

  /** Diagnoses on the referral, ICD-10-CM. Chosen from the problem list at the time of 'created'. */
  dx: { icd10cm: string; display: string }[];

  /**
   * Urgency requested.
   * - 'routine': next available.
   * - 'urgent': within two weeks.
   */
  urgency: 'routine' | 'urgent';

  /** Appointment date, on 'scheduled' only. Full date. */
  appointment_on?: string;
}

/**
 * A void: one or more earlier Northgate items were entered in error and are withdrawn without
 * replacement. Voids are only for entries that should never have existed; a lab correction is a
 * superseding `ImportedResult` item, not a void. The void item's `effective` is the time of the void
 * and equals its `recorded`. The envelope `retracts` lists the same item ids as `voided_items`; this
 * entry adds Northgate's own reason code. The voided items stay in the log for audit.
 */
export interface ChartCorrection {
  type: 'chart_correction';

  /** Ids of the Northgate items voided. Always identical to the envelope's `retracts`. */
  voided_items: string[];

  /**
   * Why the items were voided.
   * - 'wrong_patient': entered on this patient's chart but meant for someone else. The voided
   *   content says nothing about this patient.
   * - 'entry_error': wrong value, wrong drug or similar typing mistake on the right patient.
   * - 'duplicate': the same event was entered twice; another item still records it.
   */
  reason: 'wrong_patient' | 'entry_error' | 'duplicate';
}
