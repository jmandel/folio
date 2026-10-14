export type HomeLogEntry = BpReading | GlucoseReading | DoseLog | DiaryNote | MyMed;

type LocalDateTime = string;

export interface BpReading {
  type: 'bp_reading';

  measured_at: LocalDateTime;

  systolic_mmhg: number;

  diastolic_mmhg: number;

  pulse_bpm?: number;

  entry_method: 'cuff_sync' | 'typed';

  arm?: 'left' | 'right';
}

export interface GlucoseReading {
  type: 'glucose_reading';

  measured_at: LocalDateTime;

  value: number;

  unit: 'mg/dL' | 'mmol/L';

  out_of_range?: 'HI' | 'LO';

  meal_marker?: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime';

  entry_method: 'meter_sync' | 'typed';
}

export interface DoseLog {
  type: 'dose_log';

  at: LocalDateTime;

  homelog_med_id: string;

  med_name: string;

  status: 'taken' | 'skipped';

  amount?: number;

  amount_unit?: 'units' | 'tablets' | 'puffs' | 'mL';

  skip_reason?: string;
}

export interface DiaryNote {
  type: 'diary_note';

  written_at: LocalDateTime;

  symptom_tags: Array<
    | 'nausea' | 'vomiting' | 'diarrhea' | 'poor_appetite' | 'dizzy' | 'tired' | 'short_of_breath'
    | 'swelling' | 'headache' | 'cough' | 'pain' | 'low_mood' | 'other'
  >;

  severity?: 1 | 2 | 3 | 4 | 5;
}

export interface MyMed {
  type: 'my_med';

  homelog_med_id: string;

  name: string;

  picked_from_search?: { rxnorm: string; display: string };

  strength_text?: string;

  how_i_take_it?: string;

  status: 'taking' | 'stopped';

  started?: string;

  stopped?: string;

  kind: 'prescription' | 'over_the_counter';

  note?: string;
}
