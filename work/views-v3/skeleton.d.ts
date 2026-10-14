export interface FolioItem {
  folio: string;

  id: string;

  issuer: string;

  patient: string;

  effective: string;
  effective_end?: string;

  recorded: string;
  author?: { id?: string; name?: string; role?: string };

  schema?: { url: string; type: string; sha256: string };

  supersedes?: string[];

  retracts?: string[];

  narrative: string;

  payload: Record<string, any>;
}

export type Transform = (items: FolioItem[], asOf: string) => ViewRows;

export interface ViewRows {
  medications: MedicationRow[];
  problems: ProblemRow[];
  allergies: AllergyIntoleranceRow[];
  labs: LabResultRow[];
  vitals: VitalRow[];
}

export type PartialDate = string;

export type Evidence = { item_id: string; entry_id?: string }[];

export type Sensitivity = 'mental-health' | 'substance-use' | 'sexual-reproductive-health' | 'hiv-sti' | 'genetic';

export interface MedicationRow {

  ingredient?: string;

  rxnorm_ingredient?: string;

  drug_name: string;

  status: 'active' | 'held' | 'stopped' | 'unknown';

  status_since?: PartialDate;

  dose?: { value: number; unit: 'mg' | 'mcg' | 'units' | 'mL' | 'tablet' };

  frequency?: 'QD' | 'BID' | 'TID' | 'QHS' | 'QW' | 'PRN' | 'other';

  stop_reason?: 'adverse_reaction' | 'ineffective' | 'therapy_changed' | 'course_complete' | 'patient_choice' | 'other';

  status_reason_text?: string;

  patient_reported: boolean;

  otc?: boolean;

  sensitivity?: Sensitivity[];
  evidence: Evidence;
}

export interface ProblemRow {

  condition: string;

  icd10cm?: string;

  snomed?: string;

  status: 'active' | 'resolved';

  onset?: { value: PartialDate; precision: 'year' | 'month' | 'day' };

  ckd_stage?: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';

  albuminuria?: 'A1' | 'A2' | 'A3';

  sensitivity?: Sensitivity[];
  evidence: Evidence;
}

export interface AllergyIntoleranceRow {

  substance: string;

  rxnorm_ingredient?: string;

  reaction_type: 'hypersensitivity' | 'side_effect' | 'serious_adverse_event';

  mechanism: 'immune' | 'non_immune' | 'unknown';

  reaction?: string;

  criticality: 'low' | 'high' | 'unknown';

  onset?: { value: PartialDate; precision: 'year' | 'month' | 'day' };

  sensitivity?: Sensitivity[];
  evidence: Evidence;
}

export type Analyte =
  | 'creatinine' | 'egfr' | 'potassium' | 'sodium' | 'chloride' | 'bicarbonate' | 'anion_gap' | 'bun'
  | 'glucose' | 'a1c' | 'uacr' | 'platelets' | 'wbc' | 'hemoglobin' | 'bhb' | 'ph' | 'pco2' | 'lipase'
  | 'troponin' | 'cholesterol' | 'triglycerides' | 'hdl' | 'ldl';

export interface LabResultRow {
  analyte: Analyte;

  value: number;

  comparator?: '<' | '>' | '<=' | '>=';

  unit: string;

  collected: string;

  status: 'final' | 'preliminary';

  egfr_equation?: 'ckd-epi-2021' | 'ckd-epi-2009' | 'mdrd' | 'unknown';

  loinc?: string;
  evidence: Evidence;
}

export interface VitalRow {

  setting: 'clinic' | 'hospital' | 'home';

  local_time: string;
  systolic_mmhg?: number;
  diastolic_mmhg?: number;

  repeat_systolic_mmhg?: number;
  repeat_diastolic_mmhg?: number;
  pulse_bpm?: number;

  weight_kg?: number;

  glucose_mg_dl?: number;

  glucose_out_of_range?: 'HI' | 'LO';
  evidence: Evidence;
}
