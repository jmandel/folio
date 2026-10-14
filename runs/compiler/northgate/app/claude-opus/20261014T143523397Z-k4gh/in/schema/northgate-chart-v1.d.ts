export type ChartEvent =
  | Visit
  | VitalSet
  | MedEvent
  | ProblemEvent
  | AllergyEvent
  | BillingDx
  | ListReviewed
  | ImportedResult
  | ReferralEvent
  | ReferralDx
  | ChartCorrection;

export type Restriction = 'BH';

export interface FuzzyDate {

  date: string;

  precision: 'year' | 'month' | 'day';
}

export interface Visit {
  type: 'visit';

  visit_id: string;

  visit_type: 'office' | 'telehealth' | 'nurse' | 'phone';

  reason: string;
}

export interface BillingDx {
  type: 'billing_dx';

  visit_id: string;

  rank: number;

  icd10cm: string;

  display: string;

  restricted?: Restriction;
}

export interface VitalSet {
  type: 'vital_set';

  visit_id?: string;

  bp?: string;

  bp_repeat?: string;

  bp_position?: 'sitting' | 'standing' | 'supine';

  pulse_bpm?: number;

  weight_lb?: number;

  height_in?: number;

  temp_f?: number;

  spo2_pct?: number;
}

export interface MedEvent {
  type: 'med_event';

  med_id: string;

  action: 'start' | 'change' | 'hold' | 'resume' | 'stop';

  origin: 'northgate' | 'outside';

  drug: {
    name: string;
    rxnorm?: string;
    outside_code?: { system: string; code: string };
  };

  dose?: { value: number; unit: string };

  frequency?: 'QD' | 'BID' | 'TID' | 'QHS' | 'PRN' | 'OTHER';

  sig?: string;

  stop_reason?: 'adverse_reaction' | 'ineffective' | 'therapy_changed' | 'course_complete' | 'patient_choice' | 'other';

  reason_text?: string;

  review_on?: string;

  restricted?: Restriction;

  visit_id?: string;
}

export interface ProblemEvent {
  type: 'problem_event';

  problem_id: string;

  action: 'add' | 'update' | 'resolve' | 'remove';

  description: string;

  icd10cm: string;

  snomed?: string;

  onset?: FuzzyDate;

  restricted?: Restriction;

  visit_id?: string;
}

export interface AllergyEvent {
  type: 'allergy_event';

  allergy_id: string;

  action: 'add' | 'update' | 'inactivate';

  substance: { name: string; rxnorm?: string };

  reaction_type: 'allergy' | 'intolerance' | 'adverse_reaction';

  reactions: string[];

  severity: 'low' | 'high' | 'unknown';

  onset?: FuzzyDate;

  visit_id?: string;
}

export interface ListReviewed {
  type: 'list_reviewed';

  list: 'problems' | 'medications' | 'allergies';

  lines_on_list: string[];

  visit_id?: string;
}

export interface ImportedResult {
  type: 'imported_result';

  test: { nfm_code: string; name: string; loinc?: string };

  value: string;

  unit: string;

  reference_range?: string;

  flag?: 'H' | 'L' | 'HH' | 'LL' | 'A';

  result_status: 'P' | 'F' | 'C';

  collected: string;

  resulted: string;

  comment?: string;

  external_ref: { lab: 'Lakeview Labs'; accession: string; result_code: string };

  order_id?: string;
}

export interface ReferralEvent {
  type: 'referral_event';

  referral_id: string;

  action: 'created' | 'scheduled' | 'closed' | 'cancelled';

  to: { org: string; specialty: string };

  question: string;

  urgency: 'routine' | 'urgent';

  appointment_on?: string;
}

export interface ReferralDx {
  type: 'referral_dx';

  referral_id: string;

  icd10cm: string;

  display: string;

  restricted?: Restriction;
}

export interface ChartCorrection {
  type: 'chart_correction';

  voided_items: string[];

  reason: 'wrong_patient' | 'entry_error' | 'duplicate';
}
