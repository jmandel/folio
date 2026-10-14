import { transform } from "./transform.ts";
const env = (id: string, recorded: string, payload: any, extra: any = {}) => ({ folio: "0.1", id, issuer: "x", patient: "p", effective: recorded.slice(0,10), recorded, narrative: extra.narrative ?? "", payload, ...extra });
const items: any[] = [
  env("D1", "2025-03-02T06:00:00Z", {
    glu_1: { type: "glucose_reading", measured_at: "2025-03-01T07:00", value: 6.1, unit: "mmol/L", entry_method: "meter_sync" },
    glu_2: { type: "glucose_reading", measured_at: "2025-03-01T21:00", value: 33.3, unit: "mmol/L", out_of_range: "HI", entry_method: "meter_sync" },
    glu_3: { type: "glucose_reading", measured_at: "2025-03-01T22:00", value: 20, unit: "mg/dL", out_of_range: "LO", entry_method: "meter_sync" },
    bp_1: { type: "bp_reading", measured_at: "2025-03-01T08:00", systolic_mmhg: 150, diastolic_mmhg: 90, pulse_bpm: 70, entry_method: "cuff_sync" },
    bp_2: { type: "bp_reading", measured_at: "2025-03-01T08:02", systolic_mmhg: 150, diastolic_mmhg: 90, entry_method: "typed" },
    bp_3: { type: "bp_reading", measured_at: "2025-03-01T08:02", systolic_mmhg: 105, diastolic_mmhg: 90, entry_method: "typed" },
  }),
  env("D2", "2025-03-03T06:00:00Z", {
    bp_1: { type: "bp_reading", measured_at: "2025-03-01T08:00", systolic_mmhg: 150, diastolic_mmhg: 90, pulse_bpm: 70, entry_method: "cuff_sync" },
    bp_2: { type: "bp_reading", measured_at: "2025-03-01T08:02", systolic_mmhg: 150, diastolic_mmhg: 90, entry_method: "typed" },
  }, {}),
  env("D3", "2025-03-04T05:30:00Z", { bp_1: { type: "bp_reading", measured_at: "2025-03-03T08:00", systolic_mmhg: 1, diastolic_mmhg: 1, entry_method: "typed" } }),
  env("R", "2025-03-05T05:30:00Z", {}, { retracts: ["D3"] }),
  env("L1", "2025-03-01T12:00:00Z", { m: { type: "my_med", homelog_med_id: "m", name: "x", status: "taking", kind: "prescription" } }, { narrative: "My Medicines, saved" }),
  env("L2", "2025-03-04T12:00:00Z", {
    a: { type: "my_med", homelog_med_id: "a", name: "Lantus", strength_text: "100 units/mL pen", how_i_take_it: "18 units at bedtime", status: "taking", kind: "prescription" },
    b: { type: "my_med", homelog_med_id: "b", name: "Eliquis", strength_text: "5 mg", how_i_take_it: "twice a day", status: "stopped", stopped: "2025-02", note: "dentist said hold it until after my extraction, then restart", kind: "prescription" },
    c: { type: "my_med", homelog_med_id: "c", name: "Lipitor", strength_text: "40 mg", how_i_take_it: "night", status: "stopped", stopped: "2024", note: "muscle aches so doctor switched me to Crestor", kind: "prescription" },
    d: { type: "my_med", homelog_med_id: "d", name: "water pill", how_i_take_it: "1 tablet morning", status: "taking", kind: "prescription" },
    e: { type: "my_med", homelog_med_id: "e", name: "Ventolin HFA", strength_text: "90 mcg", how_i_take_it: "2 puffs as needed", status: "taking", kind: "prescription" },
    f: { type: "my_med", homelog_med_id: "f", name: "Metformin", picked_from_search: { rxnorm: "6809", display: "metformin" }, how_i_take_it: "2 tablets with breakfast", status: "taking", note: "stopped it for a week, stomach", kind: "prescription" },
    g: { type: "my_med", homelog_med_id: "g", name: "Seroquel", strength_text: "50 mg", how_i_take_it: "bedtime", status: "taking", kind: "prescription", started: "2019-06" },
    h: { type: "my_med", homelog_med_id: "h", name: "Hyzaar", strength_text: "50-12.5", how_i_take_it: "morning", status: "taking", kind: "prescription" },
    i: { type: "my_med", homelog_med_id: "i", name: "Famotidine", strength_text: "10 mg", how_i_take_it: "take 2 tablets at night", status: "taking", kind: "over_the_counter" },
  }, { narrative: "My Medicines, saved", supersedes: ["L1"] }),
];
for (const d of ["2025-02-28", "2025-03-01", "2025-03-03", "2025-03-04", "2025-03-10"]) console.log(d, JSON.stringify(transform(items as any, d), null, 0));
