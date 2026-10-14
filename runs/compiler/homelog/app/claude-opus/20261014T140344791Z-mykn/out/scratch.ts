import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:homelog.example", patient: "p", narrative: "" };
const med = (o: any) => ({ type: "my_med", homelog_med_id: "x", kind: "prescription", status: "taking", ...o });
const list = { ...base, id: "L2", effective: "2026-05-01", recorded: "2026-05-01T12:00:00Z", supersedes: ["L1"], payload: {
  a: med({ name: "Lantus", strength_text: "100 units/mL pen", how_i_take_it: "22 units at bedtime" }),
  b: med({ name: "water pill", how_i_take_it: "morning" }),
  c: med({ name: "Jardiance", strength_text: "25 mg", how_i_take_it: "1 tablet daily", status: "stopped", stopped: "2026-03", note: "kept getting yeast infections" }),
  d: med({ name: "Metformin", strength_text: "500 mg", how_i_take_it: "2 tabs twice a day", note: "doctor told me to stop for now before my scan" }),
  e: med({ name: "Losartan", picked_from_search: { rxnorm: "52175", display: "losartan" }, strength_text: "50 mg", how_i_take_it: "half a tablet in the morning", started: "2025-06" }),
  f: med({ name: "Lisinopril", status: "stopped", stopped: "2026-01", note: "paused while kidney numbers checked" }),
  g: med({ name: "Zoloft", strength_text: "50mg", how_i_take_it: "1 every day at 8am" }),
  h: med({ name: "Ozempic", strength_text: "0.5 mg", how_i_take_it: "once a week on sundays" }),
  i: med({ name: "Tylenol", strength_text: "500 mg", how_i_take_it: "2 as needed for pain", kind: "over_the_counter" }),
}};
const day = { ...base, id: "D1", effective: "2026-04-01", recorded: "2026-04-02T05:00:00Z", payload: {
  g1: { type: "glucose_reading", measured_at: "2026-04-01T07:00", value: 7.2, unit: "mmol/L", entry_method: "meter_sync" },
  g2: { type: "glucose_reading", measured_at: "2026-04-01T22:00", value: 33.3, unit: "mmol/L", out_of_range: "HI", entry_method: "meter_sync" },
  b1: { type: "bp_reading", measured_at: "2026-04-01T08:00", systolic_mmhg: 150, diastolic_mmhg: 90, pulse_bpm: 70, entry_method: "cuff_sync" },
  b2: { type: "bp_reading", measured_at: "2026-04-01T08:02", systolic_mmhg: 150, diastolic_mmhg: 90, entry_method: "typed" },
  b3: { type: "bp_reading", measured_at: "2026-04-01T12:00", systolic_mmhg: 210, diastolic_mmhg: 90, entry_method: "typed" },
}};
const fix = { ...day, id: "D2", recorded: "2026-04-03T05:00:00Z", supersedes: ["D1"], payload: { ...day.payload, b3: { ...day.payload.b3, systolic_mmhg: 120 } } };
const retracted = { ...base, id: "D3", effective: "2026-04-05", recorded: "2026-04-06T05:00:00Z", payload: { b: { type: "bp_reading", measured_at: "2026-04-05T08:00", systolic_mmhg: 1, diastolic_mmhg: 1, entry_method: "typed" } } };
const retr = { ...base, id: "R", effective: "2026-04-07", recorded: "2026-04-07T05:00:00Z", retracts: ["D3"], payload: {} };
const late = { ...base, id: "D4", effective: "2026-05-01", recorded: "2026-05-02T04:30:00Z", payload: { b: { type: "bp_reading", measured_at: "2026-05-01T08:00", systolic_mmhg: 111, diastolic_mmhg: 71, entry_method: "cuff_sync" } } };
const all: any[] = [list, day, fix, retracted, retr, late];
const r = transform(all, "2026-05-01");
for (const m of r.medications) console.log(JSON.stringify(m));
for (const v of r.vitals) console.log(JSON.stringify(v));
console.log(transform(all, "2026-04-02").vitals.length, transform(all, "2026-04-01").medications.length);
