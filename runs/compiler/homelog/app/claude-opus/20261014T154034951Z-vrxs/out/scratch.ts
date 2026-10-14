import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "x", patient: "p", narrative: "" };
const items: any[] = [
  { ...base, id: "D1", effective: "2024-01-05", recorded: "2024-01-06T05:00:00Z", payload: {
    g1: { type: "glucose_reading", measured_at: "2024-01-05T07:00", value: 5.5, unit: "mmol/L", entry_method: "meter_sync" },
    g2: { type: "glucose_reading", measured_at: "2024-01-05T09:00", value: 33.3, unit: "mmol/L", out_of_range: "HI", entry_method: "meter_sync" },
    b1: { type: "bp_reading", measured_at: "2024-01-05T08:00", systolic_mmhg: 150, diastolic_mmhg: 90, pulse_bpm: 70, entry_method: "cuff_sync" },
    b2: { type: "bp_reading", measured_at: "2024-01-05T08:02", systolic_mmhg: 150, diastolic_mmhg: 90, entry_method: "typed" },
    b3: { type: "bp_reading", measured_at: "2024-01-05T12:00", systolic_mmhg: 510, diastolic_mmhg: 90, entry_method: "typed" } } },
  { ...base, id: "D1b", effective: "2024-01-05", recorded: "2024-01-08T05:00:00Z", supersedes: ["D1"], payload: {
    g1: { type: "glucose_reading", measured_at: "2024-01-05T07:00", value: 5.5, unit: "mmol/L", entry_method: "meter_sync" },
    b3: { type: "bp_reading", measured_at: "2024-01-05T12:00", systolic_mmhg: 150, diastolic_mmhg: 90, entry_method: "typed" } } },
  { ...base, id: "R", effective: "2024-01-09", recorded: "2024-01-09T05:00:00Z", retracts: ["D2"], payload: {} },
  { ...base, id: "D2", effective: "2024-01-07", recorded: "2024-01-08T05:00:00Z", payload: {
    g1: { type: "glucose_reading", measured_at: "2024-01-07T07:00", value: 1.1, unit: "mmol/L", out_of_range: "LO", entry_method: "meter_sync" } } },
  { ...base, id: "L1", effective: "2024-01-07", recorded: "2024-01-08T03:00:00Z", narrative: "My Medicines, saved", payload: {
    m1: { type: "my_med", homelog_med_id: "m1", name: "Lantus", strength_text: "100 units/mL pen", how_i_take_it: "22 units at bedtime", status: "taking", kind: "prescription", started: "2019-06" },
    m2: { type: "my_med", homelog_med_id: "m2", name: "water pill", strength_text: "20 mg", how_i_take_it: "every morning", status: "stopped", stopped: "2023", kind: "prescription", note: "Dr said stop until my kidney numbers improve" },
    m3: { type: "my_med", homelog_med_id: "m3", name: "Zestril", strength_text: "10 mg", how_i_take_it: "take 2 tablets daily", status: "stopped", stopped: "2023-11-02", kind: "prescription", note: "gave me a cough, switched to losartan" },
    m4: { type: "my_med", homelog_med_id: "m4", name: "Prednisone", how_i_take_it: "1 tablet in the morning", status: "taking", kind: "prescription", note: "holding while I have the infection" },
    m5: { type: "my_med", homelog_med_id: "m5", name: "Ventolin HFA", strength_text: "90 mcg/puff", how_i_take_it: "2 puffs every 6 hours as needed", status: "taking", kind: "prescription" },
    m6: { type: "my_med", homelog_med_id: "m6", name: "Zoloft", picked_from_search: { rxnorm: "36437", display: "sertraline" }, strength_text: "50 mg", how_i_take_it: "half a tablet at night", status: "taking", kind: "prescription" },
    m7: { type: "my_med", homelog_med_id: "m7", name: "Famotidine 10 mg", strength_text: "10 mg", how_i_take_it: "2 tabs twice a day", status: "taking", kind: "over_the_counter" },
    m8: { type: "my_med", homelog_med_id: "m8", name: "Humalog", strength_text: "100 units/mL", how_i_take_it: "sliding scale with meals", status: "taking", kind: "prescription" },
  } },
];
for (const a of ["2024-01-05", "2024-01-07", "2024-01-08", "2024-01-09"]) console.log(a, JSON.stringify(transform(items, a), null, 1));
