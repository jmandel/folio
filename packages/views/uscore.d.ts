/**
 * US Core FHIR R4 target, version 2 (builds on views v2): medications and laboratory results as FHIR resources.
 *
 * A second consumer of the same records: FHIR is one view, not the wire format. Which medications and
 * which results to emit, their statuses, the eGFR rule, the unit table and the time-scope rules are
 * exactly those of the app views in `views.d.ts` (read its module comment, `MedicationRow`,
 * `Analyte` and `LabResultRow` first). This file says how each one is written as FHIR.
 *
 * Why MedicationRequest and not MedicationStatement: US Core (3.1.1 through 7.0) profiles only
 * MedicationRequest for a patient's medications and represents medication-list entries, including
 * ones reported by the patient or copied from another organization, as MedicationRequest with
 * `reportedBoolean`. There is no US Core MedicationStatement profile, so a US Core client would not
 * read one.
 *
 * Only the elements below are used. Types are a subset of FHIR R4; property names and value sets are
 * FHIR's.
 */

import type { FolioItem } from './views';

export type { FolioItem };

/** The mapper's entry point for this view set. `asOf` is a local date, `YYYY-MM-DD`. */
export type UsCoreTransform = (items: FolioItem[], asOf: string) => UsCoreRows;

export interface UsCoreRows {
  /** One per row the app view would put in `medications`. */
  medicationRequests: MedicationRequest[];
  /** One per row the app view would put in `labs`. */
  observations: Observation[];
}

export interface Coding { system: string; code: string; display?: string }
export interface CodeableConcept { coding?: Coding[]; text?: string }
export interface Reference { reference: string }
export interface Quantity {
  value: number;
  /** '<' | '<=' | '>=' | '>' when the printed result had a comparator. */
  comparator?: '<' | '<=' | '>=' | '>';
  /** Human-readable unit. */
  unit: string;
  /** Always "http://unitsofmeasure.org". */
  system: 'http://unitsofmeasure.org';
  /** UCUM code. For lab values: the unit from the `Analyte` table in views.d.ts (it is UCUM, except write "mL/min/{1.73_m2}" for eGFR, "mg/g" for UACR and "mm[Hg]" for pCO2). */
  code: string;
}

/** System URIs to use. */
export type KnownSystem =
  | 'http://www.nlm.nih.gov/research/umls/rxnorm'
  | 'http://loinc.org'
  | 'http://unitsofmeasure.org'
  | 'http://terminology.hl7.org/CodeSystem/observation-category';

/**
 * US Core MedicationRequest (http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest).
 */
export interface MedicationRequest {
  resourceType: 'MedicationRequest';
  /**
   * Deterministic id, unique within the output: letters, digits, '-' and '.', at most 64 characters
   * (e.g. built from the source's line id or the ingredient).
   */
  id: string;
  meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest'] };
  /**
   * From the app view's `MedicationRow.status`: 'active' -> 'active'; 'held' -> 'on-hold';
   * 'stopped' -> 'stopped'; 'unknown' -> 'unknown'.
   */
  status: 'active' | 'on-hold' | 'stopped' | 'unknown';
  /**
   * Why it is held or stopped: `text` is the source's reason text; `coding` (optional) uses system
   * "urn:folio:stop-reason" with the app view's `stop_reason` code.
   */
  statusReason?: CodeableConcept;
  /** 'order' for a clinician's prescription or order; 'plan' for a line copied from another organization's record or a patient's own list. */
  intent: 'order' | 'plan';
  /**
   * True when this is a reported medication rather than an order made by the source organization
   * (a patient's own list, or a line copied from another organization). False otherwise.
   */
  reportedBoolean: boolean;
  /**
   * The drug. `text` is the source's display name. `coding` carries every RxNorm code the source gives
   * for this drug (system rxnorm), with the generic ingredient name (lower case, as in
   * `MedicationRow.ingredient`) as the `display` of an ingredient-level code if one is given. When the
   * source gives no RxNorm code, put the ingredient name in `text` after the display name, as
   * "<display name> (<ingredient>)" (omit the parenthesis if the ingredient is unknown).
   */
  medicationCodeableConcept: CodeableConcept;
  /** "Patient/<item.patient>". */
  subject: Reference;
  /**
   * Who ordered it: required when `intent` is 'order' (US Core constraint us-core-21). Use the prescriber
   * the source names (`{ display: "<name>" }`, or `{ identifier: { system: "http://hl7.org/fhir/sid/us-npi", value: "<NPI>" } }`
   * when only an NPI is given); when the source names no prescriber, the issuing organization as `{ display: "<organization>" }`.
   */
  requester?: { display?: string; identifier?: { system: string; value: string } };
  /** The app view's `status_since` for 'active' rows when known, else the date the line or order began; a FHIR date or dateTime. Omit if unknown. */
  authoredOn?: string;
  /** At most one. `text` is the sig as written; `doseAndRate[0].doseQuantity` is the app view's `dose` (UCUM code "mg", "ug", "[iU]", "mL", or "{tbl}"). `timing.code.text` is the app view's `frequency` code. */
  dosageInstruction?: {
    text?: string;
    timing?: { code: { text: 'QD' | 'BID' | 'TID' | 'QHS' | 'QW' | 'PRN' | 'other' } };
    doseAndRate?: { doseQuantity: Quantity }[];
  }[];
}

/**
 * US Core Laboratory Result Observation
 * (http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab).
 */
export interface Observation {
  resourceType: 'Observation';
  /** Deterministic id, unique within the output: letters, digits, '-' and '.', at most 64 characters. */
  id: string;
  meta: { profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab'] };
  /** 'final' for final, amended or corrected values that stand; 'preliminary' otherwise. */
  status: 'final' | 'preliminary';
  /** Exactly [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory' }] }]. */
  category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category'; code: 'laboratory'; display?: string }] }];
  /**
   * The test. `coding` must include a LOINC coding (system "http://loinc.org"): the source's LOINC
   * code when it gives one; when it gives none, the LOINC code for the analyte from this table
   * (2160-0 creatinine, 98979-8 eGFR CKD-EPI 2021, 2823-3 potassium, 2951-2 sodium, 2075-0 chloride,
   * 2028-9 bicarbonate, 33037-3 anion gap, 3094-0 BUN, 2345-7 glucose, 4548-4 A1c, 9318-7 UACR,
   * 777-3 platelets, 6690-2 WBC, 718-7 hemoglobin, 6873-4 beta-hydroxybutyrate, 2746-6 venous pH,
   * 2021-4 venous pCO2, 3040-3 lipase, 10839-9 troponin I, 2093-3 cholesterol, 2571-8 triglycerides,
   * 2085-9 HDL, 13457-7 LDL calculated). For an eGFR the source says was calculated with CKD-EPI 2009
   * but codes with an MDRD LOINC, keep the source's code. Also add the source's local code as a second
   * coding (system: any URI naming the source's code space, e.g. "urn:<issuer>:test-code").
   * `text` is the analyte name from the `Analyte` table (e.g. "egfr").
   */
  code: CodeableConcept;
  /** "Patient/<item.patient>". */
  subject: Reference;
  /** Specimen collection time, RFC 3339 with offset. */
  effectiveDateTime: string;
  /** The value in the analyte's unit (see `Quantity.code`). */
  valueQuantity: Quantity;
  /** For eGFR: the equation, as `{ text: 'ckd-epi-2021' | 'ckd-epi-2009' | 'mdrd' | 'unknown' }` (same rule as `LabResultRow.egfr_equation`). Omit for other analytes. */
  method?: { text: 'ckd-epi-2021' | 'ckd-epi-2009' | 'mdrd' | 'unknown' };
}
