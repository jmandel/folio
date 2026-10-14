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

export interface Encounter {
  type: 'encounter';

  encounter_id: string;

  document_kind: 'ed_note' | 'hp' | 'progress_note' | 'consult' | 'discharge_summary';

  class: 'emergency' | 'inpatient';

  service: string;

  arrived?: string;

  admitted?: string;

  discharged?: string;

  disposition?: 'admitted' | 'home' | 'home_with_services' | 'transferred' | 'left_against_advice';
}

export interface Diagnosis {
  type: 'diagnosis';

  label: string;

  icd10cm?: string;

  riverside_dx?: { code: string; name: string };

  status: 'working' | 'ruled_out' | 'active' | 'resolved';

  rank?: 'principal' | 'secondary';
}

export interface History {
  type: 'history';

  condition: string;

  icd10cm?: string;

  onset_text?: string;

  source: 'patient' | 'outside_records' | 'riverside';
}

export interface Allergy {
  type: 'allergy';

  substance: string;

  rxnorm_ingredient?: string;

  reaction?: string;

  severity: 'mild' | 'moderate' | 'severe' | 'unknown';
}

export interface HomeMed {
  type: 'home_med';

  drug_name: string;

  rxnorm_ingredient?: string;

  dose_text: string;

  sig: string;

  status: 'not_reconciled' | 'continue' | 'held' | 'stopped' | 'new' | 'changed';

  restart_advice?: 'resume_when_able' | 'prescriber_decides' | 'advise_against';

  instructions?: string;
}

export interface InpatientMed {
  type: 'inpatient_med';

  drug_name: string;

  rxnorm_ingredient?: string;

  route: string;

  dose_text: string;

  started: string;

  stopped?: string;
}

export interface Vitals {
  type: 'vitals';

  taken: string;

  bp?: { systolic_mmhg: number; diastolic_mmhg: number };

  heart_rate_bpm?: number;

  resp_rate_per_min?: number;

  temp_f?: number;

  spo2_pct?: number;

  weight_kg?: number;
}

export interface ResultValue {

  test: { local_code: string; loinc?: string; name: string };

  value: string;

  unit?: string;

  ref_range?: string;

  flag?: 'H' | 'L' | 'HH' | 'LL' | 'A';
}

export interface Result extends ResultValue {
  type: 'result';

  accession: string;

  collected: string;

  specimen: string;

  status: 'preliminary' | 'final' | 'corrected';
}

export interface Panel {
  type: 'panel';

  panel: { local_code: string; loinc?: string; name: string };

  accession: string;

  collected: string;

  specimen: string;

  status: 'preliminary' | 'final' | 'corrected';

  components: ResultValue[];
}

export interface FollowUp {
  type: 'follow_up';

  with: string;

  when_text: string;

  purpose: string;
}
