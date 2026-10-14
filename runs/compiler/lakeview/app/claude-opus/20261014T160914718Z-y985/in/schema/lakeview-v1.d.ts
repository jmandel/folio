export type LabReportRow = LabReq | LabOrder | LabResult;

export interface LabReq {
  type: 'LAB_REQ';

  REQ_ID: string;

  CLIENT_CODE: string;

  CLIENT_NAME: string;

  ORDERING_NPI?: string;

  ORDERING_NAME?: string;

  COLLECTED_AT: string;

  RECEIVED_AT: string;

  FASTING: 'Y' | 'N' | 'U';
}

export interface LabOrder {
  type: 'LAB_ORDER';

  ORDER_ID: string;

  REQ_ID: string;

  ORDER_CODE: `${LabTestCode}`;

  ORDER_NAME: string;

  ACCESSION: string;

  SPECIMEN_TYPE: 'SER' | 'PLA' | 'WB' | 'URN';

  SPECIMEN_COND: 'OK' | 'HEM' | 'LIP' | 'ICT' | 'QNS' | 'CLT';

  ORDER_STATUS: 1 | 2 | 3 | 4 | 5 | 9;

  STATUS_AT: string;

  STATUS_REASON?: string;

  REPEAT_OF_ORDER_ID?: string;

  REPEAT_REASON?: 'HEM' | 'CONF' | 'QNS';
}

export interface LabResult {
  type: 'LAB_RESULT';

  RESULT_ID: string;

  ORDER_ID: string;

  TEST_CODE: `${LabTestCode}`;

  TEST_NAME: string;

  LOINC?: string;

  VALUE_TEXT: string;

  VALUE_NUM: number | null;

  UNIT_CODE: `${LakeviewUnit}` | null;

  REF_RANGE_TEXT?: string;

  ABN_FLAG?: 'N' | 'L' | 'H' | 'LL' | 'HH' | 'A';

  RESULT_STATUS: 'P' | 'F' | 'A' | 'C' | 'X';

  RESULTED_AT: string;

  STATUS_CHANGED_AT?: string;

  REPLACED_BY_RESULT_ID?: string;

  DERIVED_FROM_RESULT_ID?: string;

  COMMENT_TEXT?: string;
}

export type ClinicRow = ClinicVisit | VisitDx | Vital | MedOrder | MedStatusHist;

export interface ClinicVisit {
  type: 'CLINIC_VISIT';

  VISIT_ID: string;

  VISIT_TYPE: 'NP' | 'FU' | 'TEL';

  VISIT_AT: string;

  PROVIDER_NPI: string;

  CKD_G?: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';

  CKD_A?: 'A1' | 'A2' | 'A3';

  REFERRED_BY_TEXT?: string;
}

export interface VisitDx {
  type: 'VISIT_DX';

  VISIT_ID: string;

  DX_RANK: number;

  ICD10CM: string;

  DX_TEXT: string;

  DX_STATUS: 'A' | 'P' | 'R' | 'H';
}

export interface Vital {
  type: 'VITAL';

  VISIT_ID: string;

  VITAL_CODE: 'BPS' | 'BPD' | 'HR' | 'WT';

  VALUE_NUM: number;

  UNIT_CODE: 'mmHg' | '/min' | 'kg';

  READING_NO: number;

  TAKEN_AT: string;
}

export interface MedOrder {
  type: 'MED_ORDER';

  RX_ID: string;

  VISIT_ID: string;

  LV_DRUG_ID: string;

  DRUG_NAME: string;

  RXNORM?: string;

  DOSE_QTY: number;

  DOSE_UNIT: 'mg' | 'mcg' | 'unit' | 'mL';

  ROUTE: 'PO' | 'SC' | 'IV';

  FREQ_CODE: `${FrequencyCode}`;

  MED_STATUS: 1 | 2 | 3 | 9;

  START_DATE: string;

  PRESCRIBER_NPI: string;
}

export interface MedStatusHist {
  type: 'MED_STATUS_HIST';

  HIST_ID: string;

  VISIT_ID: string;

  RX_ID: string;

  OLD_STATUS: 1 | 2 | 3 | 9;

  NEW_STATUS: 1 | 2 | 3 | 9;

  CHANGED_AT: string;

  REASON_CODE: 'LAB' | 'ADR' | 'PT' | 'PROC' | 'ERR' | 'OTH';

  REVIEW_DATE?: string;

  COMMENT_TEXT?: string;
}

export declare enum LabTestCode {

  LK_CREAT = 'LK-CREAT',

  LK_EGFR09N = 'LK-EGFR09N',

  LK_EGFR09A = 'LK-EGFR09A',

  LK_EGFR21 = 'LK-EGFR21',

  LK_NA = 'LK-NA',

  LK_K = 'LK-K',

  LK_GLU = 'LK-GLU',

  LK_A1C = 'LK-A1C',

  LK_UACR = 'LK-UACR',

  LK_CBC = 'LK-CBC',

  LK_WBC = 'LK-WBC',

  LK_HGB = 'LK-HGB',

  LK_PLT = 'LK-PLT',

  LK_LIPID = 'LK-LIPID',

  LK_CHOL = 'LK-CHOL',

  LK_TRIG = 'LK-TRIG',

  LK_HDL = 'LK-HDL',

  LK_LDLC = 'LK-LDLC',
}

export declare enum LakeviewUnit {

  MG_PER_DL = 'mg/dL',

  MMOL_PER_L = 'mmol/L',

  PERCENT = '%',

  ML_MIN_173M2 = 'mL/min/1.73m2',

  MG_PER_G = 'mg/g',

  K_PER_UL = 'K/uL',

  G_PER_DL = 'g/dL',
}

export declare enum FrequencyCode {

  QD = 'QD',

  BID = 'BID',

  TID = 'TID',

  QHS = 'QHS',

  QW = 'QW',

  PRN = 'PRN',
}
