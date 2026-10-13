/**
 * Lakeview Labs & Kidney Care: FOLIO export, version 1.
 *
 * Lakeview runs an outreach reference laboratory and a nephrology clinic on one system. The export is a
 * row-for-row copy of that system's tables. Every payload entry is one table row; its `type` is the table
 * name. Column names are the database's own (UPPER_SNAKE). Codes are Lakeview's, documented below; the
 * tables at the end of this file list every code value in use.
 *
 * Two kinds of item, each with its own entry type:
 *
 * - **Lab report items** (`LabReportRow`): one item per requisition, i.e. one set of specimens drawn at
 *   one time for one ordering client. Holds exactly one LAB_REQ row, one LAB_ORDER row per ordered test,
 *   and the LAB_RESULT rows those orders produced. Published when every order on the requisition is
 *   resulted, cancelled or void (rarely earlier, with 'P' rows, when a slow test holds up a requisition
 *   with urgent results). Lab items have no author (system-generated) and no narrative.
 * - **Clinic contact items** (`ClinicRow`): one item per nephrology clinic contact (office visit or
 *   telephone contact). Holds exactly one CLINIC_VISIT row plus the VISIT_DX, VITAL, MED_ORDER and
 *   MED_STATUS_HIST rows entered during that contact. The narrative is the note the nephrologist typed
 *   and signed; it is short and is never generated from the rows.
 *
 * Changes: rows are never edited in place in the export. When a row changes after its item was
 * published (a result invalidated, an order marked entered in error), Lakeview publishes a new item that
 * `supersedes` the old one and restates every row of the requisition or contact with current values.
 * Exception: a medication's status changes are separate MED_STATUS_HIST rows in a later contact, not a
 * re-published MED_ORDER row. See MED_ORDER.MED_STATUS.
 *
 * Times: every timestamp column is RFC 3339 with the UTC offset in effect in America/Chicago at that
 * moment (e.g. `2026-02-09T08:14:00-06:00`). Date-only columns are local calendar dates.
 *
 * Identifiers: REQ_ID, ORDER_ID, RESULT_ID, ACCESSION, VISIT_ID, RX_ID and HIST_ID are Lakeview-assigned,
 * never reused, and unique across the whole export (not only within an item). Rows refer to rows in
 * other items by these ids.
 */

// ─────────────────────────────────────────────────────────────────────────────────────────────────────
// Lab report items
// ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** One row in a lab report item. */
export type LabReportRow = LabReq | LabOrder | LabResult;

/** The requisition: who ordered, when the specimens were drawn. Exactly one per lab report item. */
export interface LabReq {
  type: 'LAB_REQ';

  /** Requisition id, e.g. "RQ-2602090412". */
  REQ_ID: string;

  /**
   * Ordering client account code. Clients are practices that send work to Lakeview.
   * - 'NGFM': Northgate Family Medicine (outside primary care practice).
   * - 'LVNEPH': Lakeview's own nephrology clinic.
   * Other client codes exist for other patients; CLIENT_NAME always carries the display name.
   */
  CLIENT_CODE: string;

  /** Display name of the ordering client, as on the requisition. */
  CLIENT_NAME: string;

  /** NPI of the ordering clinician, 10 digits. Absent when the requisition was standing-order only. */
  ORDERING_NPI?: string;

  /** Ordering clinician's name, "Last, First Credential", as typed on the requisition. */
  ORDERING_NAME?: string;

  /**
   * When the specimens were drawn. This is the clinically meaningful time and the item's `effective`.
   * All specimens on one requisition share it.
   */
  COLLECTED_AT: string;

  /** When the specimens were logged in at the laboratory. */
  RECEIVED_AT: string;

  /**
   * Patient-reported fasting status at draw.
   * - 'Y': fasting at least 8 hours.
   * - 'N': not fasting.
   * - 'U': not asked or not recorded.
   */
  FASTING: 'Y' | 'N' | 'U';
}

/**
 * One ordered test or panel on the requisition. One row per order, even when two orders are run on the
 * same tube (they then share an ACCESSION).
 */
export interface LabOrder {
  type: 'LAB_ORDER';

  /** Order id, e.g. "OR-7730412". */
  ORDER_ID: string;

  /** The LAB_REQ this order belongs to (always the LAB_REQ in the same item). */
  REQ_ID: string;

  /**
   * What was ordered: a Lakeview test code (see `LabTestCode` at the end of this file). An order code
   * may produce several result rows: panel codes (e.g. 'LK-CBC') produce one row per component, and
   * 'LK-CREAT' also produces calculated eGFR rows.
   */
  ORDER_CODE: `${LabTestCode}`;

  /** Display name of the ordered test as printed on the requisition. */
  ORDER_NAME: string;

  /**
   * Specimen container barcode, "LV" + 2-digit year, day of year, 5-digit sequence, e.g. "LV26-040-00093".
   * One accession per tube; several orders can share one. Outside systems that receive Lakeview results
   * (e.g. Northgate) keep this number as their link back to Lakeview.
   */
  ACCESSION: string;

  /**
   * Specimen type.
   * - 'SER': serum.
   * - 'PLA': plasma (lithium heparin).
   * - 'WB': whole blood (EDTA).
   * - 'URN': random urine.
   */
  SPECIMEN_TYPE: 'SER' | 'PLA' | 'WB' | 'URN';

  /**
   * Specimen condition noted on receipt or by the analyzer.
   * - 'OK': acceptable.
   * - 'HEM': hemolyzed. Potassium, AST and LDH can be falsely high. Results are still released, with a
   *   comment; a recollection is usually requested.
   * - 'LIP': lipemic.
   * - 'ICT': icteric.
   * - 'QNS': quantity not sufficient; affected results have RESULT_STATUS 'X'.
   * - 'CLT': clotted.
   */
  SPECIMEN_COND: 'OK' | 'HEM' | 'LIP' | 'ICT' | 'QNS' | 'CLT';

  /**
   * Where the order stands in the lab workflow. Integer code. This is a separate axis from each result
   * row's RESULT_STATUS: an order is 4 (resulted) as soon as its results have been released, and stays 4
   * even if one of its results is later invalidated (RESULT_STATUS 'C'). Never infer result validity from
   * this field.
   * - 1: ordered, not yet collected.
   * - 2: collected, in transit or awaiting testing.
   * - 3: in process (some results may be preliminary).
   * - 4: resulted (results released).
   * - 5: cancelled before testing (no results; see STATUS_REASON).
   * - 9: entered in error (wrong patient, duplicate order). The order is void. Any result rows it has
   *      were produced by the analyzer before the error was caught, still carry their own
   *      RESULT_STATUS (often 'F'), and must not be used.
   */
  ORDER_STATUS: 1 | 2 | 3 | 4 | 5 | 9;

  /** When ORDER_STATUS last changed. */
  STATUS_AT: string;

  /** Free-text reason entered with status 5 or 9, e.g. "Duplicate order". Absent for other statuses. */
  STATUS_REASON?: string;

  /**
   * Set when this order is a repeat draw of an earlier order (in an earlier requisition): that order's
   * ORDER_ID. Absent for ordinary orders.
   */
  REPEAT_OF_ORDER_ID?: string;

  /**
   * Why the repeat draw was taken. Present exactly when REPEAT_OF_ORDER_ID is.
   * - 'HEM': the earlier specimen was hemolyzed. The earlier result is normally invalidated
   *   (RESULT_STATUS 'C', REPLACED_BY_RESULT_ID pointing here).
   * - 'CONF': confirmation of a critical or unexpected value. Both results stand; the earlier one is
   *   NOT invalidated.
   * - 'QNS': the earlier specimen was insufficient.
   */
  REPEAT_REASON?: 'HEM' | 'CONF' | 'QNS';
}

/**
 * One reported result value. Lakeview stores every result as text (VALUE_TEXT) plus a numeric
 * convenience column (VALUE_NUM). VALUE_TEXT is the value of record.
 */
export interface LabResult {
  type: 'LAB_RESULT';

  /** Result id, e.g. "RS-90044817". */
  RESULT_ID: string;

  /** The LAB_ORDER that produced this row (always in the same item). */
  ORDER_ID: string;

  /**
   * Lakeview test code for this result (see `LabTestCode`). Codes are stable across years but are
   * retired and replaced when the method or equation changes: eGFR changed code on 2022-01-10. A
   * mapper that needs a continuous series must join the old and new codes.
   */
  TEST_CODE: `${LabTestCode}`;

  /** Test name as printed on the report on the day it was resulted. Wording varies over the years. */
  TEST_NAME: string;

  /**
   * LOINC code, copied from Lakeview's code table at the moment the row was resulted. Absent when the
   * test code had no LOINC mapping at that moment, which includes some codes that are mapped now (rows
   * resulted before the mapping was added are not back-filled). `LabTestCode` says which codes
   * have a mapping and since when. Do not use LOINC as the only key to find a test; use TEST_CODE.
   */
  LOINC?: string;

  /**
   * The result as reported, as text. Usually a plain decimal ("1.45", "212"). May carry a comparator
   * (">60", "<0.1", ">90") or be non-numeric ("Not done: QNS", "See comment"). Never sort or compare as
   * text.
   */
  VALUE_TEXT: string;

  /**
   * Numeric form of VALUE_TEXT, for queries.
   * - A number when VALUE_TEXT is a plain decimal: the same value.
   * - 9999999 (sentinel) when VALUE_TEXT has a comparator such as ">60": the number is NOT the value;
   *   read VALUE_TEXT.
   * - null when VALUE_TEXT is not numeric.
   */
  VALUE_NUM: number | null;

  /**
   * Unit of VALUE_TEXT, as Lakeview prints it (see `LakeviewUnit`). Fixed per TEST_CODE. Null only when
   * VALUE_TEXT is not numeric. Note 'K/uL' means thousands per microlitre: a platelet count of "212" is
   * 212 000 cells/uL.
   */
  UNIT_CODE: `${LakeviewUnit}` | null;

  /** Reference interval as printed, e.g. "3.5-5.1", "<30", ">59". Text; may be absent for calculated tests. */
  REF_RANGE_TEXT?: string;

  /**
   * Abnormal flag against the reference interval.
   * - 'N': within range.
   * - 'L' / 'H': below / above range.
   * - 'LL' / 'HH': critical low / high (phoned to the ordering clinician).
   * - 'A': abnormal, non-numeric.
   * Absent when the test has no reference interval or the value is not numeric.
   */
  ABN_FLAG?: 'N' | 'L' | 'H' | 'LL' | 'HH' | 'A';

  /**
   * Validity of this row's value. Letter code. Independent of the order's ORDER_STATUS.
   * - 'P': preliminary; a later item will restate the row as 'F'.
   * - 'F': final.
   * - 'A': amended; the value on this row was changed after it was final (for example a transcription
   *   fix). The value shown is the current, valid one; the earlier value is in the superseded item.
   * - 'C': corrected away. The value on this row has been withdrawn and must not be used. If a
   *   replacement exists, REPLACED_BY_RESULT_ID names it (usually in a repeat-draw requisition). Note:
   *   this is NOT the HL7 v2 meaning of 'C' (where 'C' marks the new corrected value); in Lakeview 'C'
   *   marks the old, withdrawn one.
   * - 'X': not performed (cancelled, QNS); VALUE_TEXT says why, VALUE_NUM is null.
   */
  RESULT_STATUS: 'P' | 'F' | 'A' | 'C' | 'X';

  /** When the value was released (first released, for 'A' and 'C' rows). */
  RESULTED_AT: string;

  /** When RESULT_STATUS was set to 'A' or 'C'. Absent otherwise. */
  STATUS_CHANGED_AT?: string;

  /** For RESULT_STATUS 'C': the RESULT_ID of the row that replaces this one. Absent if no replacement. */
  REPLACED_BY_RESULT_ID?: string;

  /**
   * For calculated results (eGFR): the RESULT_ID of the creatinine row it was calculated from (same
   * item). Lakeview calculates eGFR from creatinine, the patient's age and sex on the collection date,
   * and, for the 2009 codes only, a race coefficient (both race variants are always reported; the lab
   * does not know the patient's race).
   */
  DERIVED_FROM_RESULT_ID?: string;

  /** Result comment as printed on the report, free text. Lakeview's comments are canned phrases. */
  COMMENT_TEXT?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────────
// Clinic contact items
// ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** One row in a nephrology clinic contact item. */
export type ClinicRow = ClinicVisit | VisitDx | Vital | MedOrder | MedStatusHist;

/** The clinic contact itself. Exactly one per clinic contact item. */
export interface ClinicVisit {
  type: 'CLINIC_VISIT';

  /** Contact id, e.g. "NV-104552". */
  VISIT_ID: string;

  /**
   * Kind of contact.
   * - 'NP': new patient office visit.
   * - 'FU': follow-up office visit.
   * - 'TEL': telephone contact (no vitals; CKD_G / CKD_A usually absent).
   */
  VISIT_TYPE: 'NP' | 'FU' | 'TEL';

  /** Start of the contact. The item's `effective`. */
  VISIT_AT: string;

  /** NPI of the nephrologist responsible for the contact. */
  PROVIDER_NPI: string;

  /**
   * KDIGO GFR category as assessed by the nephrologist at this contact: 'G1', 'G2', 'G3a', 'G3b',
   * 'G4', 'G5'. A clinician judgement (usually from two or more eGFRs ≥ 90 days apart), not computed
   * from a single lab value. Absent when not assessed at this contact.
   */
  CKD_G?: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';

  /**
   * KDIGO albuminuria category as assessed at this contact: 'A1' (UACR < 30 mg/g), 'A2' (30–300),
   * 'A3' (> 300). Absent when not assessed.
   */
  CKD_A?: 'A1' | 'A2' | 'A3';

  /** Referring practice as typed at registration, free text. Present on 'NP' visits from a referral. */
  REFERRED_BY_TEXT?: string;
}

/** One diagnosis recorded at the contact. The clinic's problem list is the latest VISIT_DX row per code. */
export interface VisitDx {
  type: 'VISIT_DX';

  /** The contact (same item). */
  VISIT_ID: string;

  /** Order of importance at this contact, 1 = primary. */
  DX_RANK: number;

  /** ICD-10-CM code, with the dot (e.g. "N18.32"). Always present. */
  ICD10CM: string;

  /** ICD-10-CM description as shown in the clinic system. */
  DX_TEXT: string;

  /**
   * - 'A': active, confirmed.
   * - 'P': provisional / working diagnosis.
   * - 'R': ruled out at this contact. Not a diagnosis the patient has.
   * - 'H': history of; resolved, recorded for context.
   */
  DX_STATUS: 'A' | 'P' | 'R' | 'H';
}

/**
 * One vital-sign measurement taken at an office visit. Blood pressure is two rows (systolic and
 * diastolic) linked by READING_NO. Unlike lab values, vitals are stored as numbers.
 */
export interface Vital {
  type: 'VITAL';

  /** The contact (same item). */
  VISIT_ID: string;

  /**
   * - 'BPS': systolic blood pressure, mmHg.
   * - 'BPD': diastolic blood pressure, mmHg.
   * - 'HR': heart rate, /min.
   * - 'WT': weight, kg.
   */
  VITAL_CODE: 'BPS' | 'BPD' | 'HR' | 'WT';

  /** The measurement, in UNIT_CODE. */
  VALUE_NUM: number;

  /** 'mmHg' for BPS/BPD, '/min' for HR, 'kg' for WT. Always present. */
  UNIT_CODE: 'mmHg' | '/min' | 'kg';

  /** 1 for the first reading of this VITAL_CODE at the contact, 2 for a repeat, and so on. */
  READING_NO: number;

  /** When the measurement was taken. */
  TAKEN_AT: string;
}

/**
 * A medication prescribed or managed by the nephrology clinic, as the row stood when this item was
 * published. The clinic records only medications it prescribes or changes; it does not keep a full home
 * medication list.
 */
export interface MedOrder {
  type: 'MED_ORDER';

  /** Prescription id, e.g. "RX-30418". Stable for the life of the prescription. */
  RX_ID: string;

  /** The contact at which it was prescribed (same item). */
  VISIT_ID: string;

  /** Lakeview formulary id, e.g. "LVD-04471". Always present; stable across years. */
  LV_DRUG_ID: string;

  /** Drug name and strength from the Lakeview formulary, e.g. "finerenone 10 mg tablet". */
  DRUG_NAME: string;

  /**
   * RxNorm CUI (SCD or SBD) from the formulary. Absent for drugs added to the formulary locally without
   * a mapping; recent additions often have none. Identify the drug by LV_DRUG_ID and DRUG_NAME.
   */
  RXNORM?: string;

  /** Dose per administration, as a number. */
  DOSE_QTY: number;

  /** Unit of DOSE_QTY: 'mg', 'mcg', 'unit', 'mL'. */
  DOSE_UNIT: 'mg' | 'mcg' | 'unit' | 'mL';

  /** 'PO' by mouth, 'SC' subcutaneous, 'IV' intravenous. */
  ROUTE: 'PO' | 'SC' | 'IV';

  /** Frequency code (see `FrequencyCode`). */
  FREQ_CODE: `${FrequencyCode}`;

  /**
   * Status when this row was published. Integer code.
   * - 1: active (patient should be taking it).
   * - 2: discontinued. Final; a restart is a new RX_ID.
   * - 3: on hold. Patient told to stop for now, with intent to resume; not being taken. Can return to 1.
   * - 9: entered in error. The prescription never existed; ignore it.
   *
   * Later changes are NOT made by re-publishing this row. They arrive as MED_STATUS_HIST rows (with the
   * same RX_ID) in later contact items. The current status is NEW_STATUS of the latest MED_STATUS_HIST row
   * for the RX_ID, or this field if there is none.
   */
  MED_STATUS: 1 | 2 | 3 | 9;

  /** Date the patient is to start. Local date. */
  START_DATE: string;

  /** NPI of the prescriber. */
  PRESCRIBER_NPI: string;
}

/** A change to the status of an existing MED_ORDER, made at this contact. */
export interface MedStatusHist {
  type: 'MED_STATUS_HIST';

  /** History row id, e.g. "MH-5520193". */
  HIST_ID: string;

  /** The contact where the change was made (same item). */
  VISIT_ID: string;

  /** The prescription changed. Its MED_ORDER row is in an earlier item. */
  RX_ID: string;

  /** Status before the change (MED_ORDER.MED_STATUS codes). */
  OLD_STATUS: 1 | 2 | 3 | 9;

  /** Status after the change (MED_ORDER.MED_STATUS codes). This is the prescription's current status until a later row. */
  NEW_STATUS: 1 | 2 | 3 | 9;

  /** When the change was made. */
  CHANGED_AT: string;

  /**
   * - 'LAB': abnormal lab result.
   * - 'ADR': adverse drug reaction.
   * - 'PT': patient request.
   * - 'PROC': upcoming procedure.
   * - 'ERR': entered in error.
   * - 'OTH': other; see COMMENT_TEXT.
   */
  REASON_CODE: 'LAB' | 'ADR' | 'PT' | 'PROC' | 'ERR' | 'OTH';

  /** For NEW_STATUS 3: date the clinic plans to review resuming. Local date. Absent otherwise. */
  REVIEW_DATE?: string;

  /** Short free-text comment typed with the change. */
  COMMENT_TEXT?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────────
// Code tables (as of this schema version; a new code means a new schema version)
// ─────────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Lakeview lab test codes, used in LAB_ORDER.ORDER_CODE and LAB_RESULT.TEST_CODE. Each member says the
 * specimen, the unit (LAB_RESULT.UNIT_CODE), the LOINC mapping and since when it exists (rows resulted
 * before that date have no LOINC), and the years the code was in use.
 *
 * eGFR reporting rules:
 * - Until 2022-01-09, every LK-CREAT result produced two eGFR rows, LK-EGFR09N and LK-EGFR09A, for
 *   every patient. They are two calculations from the same creatinine, not two measurements; at most
 *   one applies to a given patient, and the lab does not record which.
 * - From 2022-01-10, one row, LK-EGFR21. The old codes were retired; old rows were not recalculated.
 * - Until 2021-06-30, eGFR values of 60 or more were reported as ">60" (VALUE_NUM 9999999). From
 *   2021-07-01, values are reported as numbers up to 90 and as ">90" above.
 */
export declare enum LabTestCode {
  /** Creatinine, serum. Unit mg/dL. LOINC 2160-0 (always). In use 2015–. An LK-CREAT order also produces the calculated eGFR rows. */
  LK_CREAT = 'LK-CREAT',
  /**
   * eGFR, CKD-EPI 2009 equation, non-African American value. Serum. Unit mL/min/1.73m2. In use
   * 2015–2022-01-09. LOINC 48642-3 (always). Note: that LOINC code is defined for the MDRD equation;
   * Lakeview mapped its CKD-EPI 2009 rows to the MDRD codes and never changed the mapping. The
   * equation actually used is the one in COMMENT_TEXT.
   */
  LK_EGFR09N = 'LK-EGFR09N',
  /**
   * eGFR, CKD-EPI 2009 equation, African American value (race coefficient applied). Serum. Unit
   * mL/min/1.73m2. In use 2015–2022-01-09. LOINC 48643-1 (always), which, like LK-EGFR09N's, is an
   * MDRD code; see there.
   */
  LK_EGFR09A = 'LK-EGFR09A',
  /** eGFR, CKD-EPI 2021 equation (no race term). Serum. Unit mL/min/1.73m2. No LOINC mapping. In use 2022-01-10–. */
  LK_EGFR21 = 'LK-EGFR21',
  /** Sodium, serum. Unit mmol/L. LOINC 2951-2 (always). In use 2015–. */
  LK_NA = 'LK-NA',
  /** Potassium, serum. Unit mmol/L. LOINC 2823-3 since 2023-05-01. In use 2015–. */
  LK_K = 'LK-K',
  /** Glucose, serum. Unit mg/dL. LOINC 2345-7 (always). In use 2015–. */
  LK_GLU = 'LK-GLU',
  /** Hemoglobin A1c, whole blood. Unit % (NGSP). LOINC 4548-4 (always). In use 2015–. */
  LK_A1C = 'LK-A1C',
  /** Albumin/creatinine ratio, random urine. Unit mg/g. LOINC 9318-7 since 2023-05-01. In use 2015–. */
  LK_UACR = 'LK-UACR',
  /** CBC without differential, whole blood. Order code only: produces LK-WBC, LK-HGB and LK-PLT result rows. In use 2015–. */
  LK_CBC = 'LK-CBC',
  /** White blood cell count (component of LK-CBC). Unit K/uL. LOINC 6690-2 (always). In use 2015–. */
  LK_WBC = 'LK-WBC',
  /** Hemoglobin (component of LK-CBC). Unit g/dL. LOINC 718-7 (always). In use 2015–. */
  LK_HGB = 'LK-HGB',
  /** Platelet count (component of LK-CBC). Unit K/uL. LOINC 777-3 (always). In use 2015–. */
  LK_PLT = 'LK-PLT',
}

/** Lakeview unit strings (LAB_RESULT.UNIT_CODE). Each member gives the UCUM equivalent. */
export declare enum LakeviewUnit {
  /** Milligrams per decilitre. UCUM mg/dL. */
  MG_PER_DL = 'mg/dL',
  /** Millimoles per litre. UCUM mmol/L. */
  MMOL_PER_L = 'mmol/L',
  /** Percent; for A1c, NGSP percent. UCUM %. */
  PERCENT = '%',
  /** eGFR, mL/min normalized to 1.73 m² body surface area. UCUM mL/min/{1.73_m2}. */
  ML_MIN_173M2 = 'mL/min/1.73m2',
  /** Milligrams of albumin per gram of creatinine. UCUM mg/g{creat}. */
  MG_PER_G = 'mg/g',
  /** Thousands per microlitre (WBC, platelets): "212" means 212 000 cells/uL. UCUM 10*3/uL. */
  K_PER_UL = 'K/uL',
  /** Grams per decilitre. UCUM g/dL. */
  G_PER_DL = 'g/dL',
}

/** Medication frequency codes (MED_ORDER.FREQ_CODE). */
export declare enum FrequencyCode {
  /** Once daily. */
  QD = 'QD',
  /** Twice daily. */
  BID = 'BID',
  /** Three times daily. */
  TID = 'TID',
  /** Once daily at bedtime. */
  QHS = 'QHS',
  /** Once weekly. */
  QW = 'QW',
  /** As needed. */
  PRN = 'PRN',
}
