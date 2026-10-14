import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:homelog.example", patient: "P", narrative: "" };
const items: any[] = [
  { ...base, id: "L1", effective: "2026-01-01", recorded: "2026-01-01T10:00:00Z", narrative: "My Medicines, saved", payload: {
    m1: { type: "my_med", homelog_med_id: "m1", name: "Jardiance", strength_text: "10 mg", how_i_take_it: "morning", status: "stopped", stopped: "2025-12", kind: "prescription", note: "kept getting yeast infections" },
    m2: { type: "my_med", homelog_med_id: "m2", name: "Lantus", strength_text: "100 units/mL pen", how_i_take_it: "22 units at bedtime", status: "taking", started: "2019", kind: "prescription" },
    m3: { type: "my_med", homelog_med_id: "m3", name: "water pill", how_i_take_it: "morning", status: "taking", kind: "prescription", note: "doctor told me to stop for now" },
    m4: { type: "my_med", homelog_med_id: "m4", name: "ibuprofen", picked_from_search: { rxnorm: "5640", display: "ibuprofen" }, strength_text: "200 mg", how_i_take_it: "2 as needed", status: "taking", kind: "over_the_counter" },
    m5: { type: "my_med", homelog_med_id: "m5", name: "Zoloft", picked_from_search: { rxnorm: "312940", display: "sertraline 50 MG Oral Tablet" }, how_i_take_it: "half a tablet daily", status: "taking", kind: "prescription" },
  }},
  { ...base, id: "D1", effective: "2026-01-05", recorded: "2026-01-06T07:00:00Z", payload: {
    g1: { type: "glucose_reading", measured_at: "2026-01-05T07:00", value: 6.4, unit: "mmol/L", entry_method: "meter_sync" },
    g2: { type: "glucose_reading", measured_at: "2026-01-05T22:00", value: 33.3, unit: "mmol/L", out_of_range: "HI", entry_method: "meter_sync" },
    b1: { type: "bp_reading", measured_at: "2026-01-05T08:00", systolic_mmhg: 150, diastolic_mmhg: 90, pulse_bpm: 70, entry_method: "cuff_sync" },
    b2: { type: "bp_reading", measured_at: "2026-01-05T08:02", systolic_mmhg: 150, diastolic_mmhg: 90, entry_method: "typed" },
    b3: { type: "bp_reading", measured_at: "2026-01-05T09:00", systolic_mmhg: 510, diastolic_mmhg: 90, entry_method: "typed" },
  }},
  { ...base, id: "D1b", effective: "2026-01-05", recorded: "2026-01-07T07:00:00Z", supersedes: ["D1"], payload: {
    g1: { type: "glucose_reading", measured_at: "2026-01-05T07:00", value: 6.4, unit: "mmol/L", entry_method: "meter_sync" },
    b1: { type: "bp_reading", measured_at: "2026-01-05T08:00", systolic_mmhg: 150, diastolic_mmhg: 90, pulse_bpm: 70, entry_method: "cuff_sync" },
    b2: { type: "bp_reading", measured_at: "2026-01-05T08:02", systolic_mmhg: 150, diastolic_mmhg: 90, entry_method: "typed" },
    b3: { type: "bp_reading", measured_at: "2026-01-05T09:00", systolic_mmhg: 151, diastolic_mmhg: 90, entry_method: "typed" },
  }},
  { ...base, id: "D2", effective: "2026-01-06", recorded: "2026-01-08T05:30:00Z", payload: { b1: { type: "bp_reading", measured_at: "2026-01-06T08:00", systolic_mmhg: 1, diastolic_mmhg: 1, entry_method: "typed" } } },
  { ...base, id: "R", effective: "2026-01-06", recorded: "2026-01-09T05:30:00Z", retracts: ["D2"], payload: {} },
  "garbage", null,
];
for (const a of ["2026-01-06", "2026-01-07", "2026-01-08"]) console.log(a, JSON.stringify(transform(items as any, a), null, 1));
