import { test, expect } from 'bun:test';
import { transform } from './transform';
import type { FolioItem } from '../in/views/views';

const asOf = '2026-07-01';
function item(id: string, payload: Record<string, unknown>, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: '0.1', id, issuer: 'home', patient: 'one', effective: '2026-06-01', recorded: '2026-06-02T03:00:00Z', narrative: '', payload, ...extra };
}
function med(extra: Record<string, unknown> = {}) {
  return { type: 'my_med', homelog_med_id: 'm1', name: 'Metformin', status: 'taking', kind: 'prescription', ...extra };
}
function medicine(extra: Record<string, unknown>) {
  return transform([item('list', { m: med(extra) })], asOf).medications[0];
}
function bp(extra: Record<string, unknown> = {}) {
  return { type: 'bp_reading', measured_at: '2026-06-01T08:00', systolic_mmhg: 120, diastolic_mmhg: 80, pulse_bpm: 60, entry_method: 'cuff_sync', ...extra };
}
function glucose(extra: Record<string, unknown> = {}) {
  return { type: 'glucose_reading', measured_at: '2026-06-01T08:00', value: 5.5, unit: 'mmol/L', entry_method: 'meter_sync', ...extra };
}

test('publication cutoff is the end of a Chicago day in winter and summer', () => {
  for (const [date, before, after] of [
    ['2026-01-03', '2026-01-04T05:59:59.999Z', '2026-01-04T06:00:00Z'],
    ['2026-06-03', '2026-06-04T04:59:59.999Z', '2026-06-04T05:00:00Z'],
    ['2026-03-08', '2026-03-09T04:59:59.999Z', '2026-03-09T05:00:00Z'],
    ['2026-11-01', '2026-11-02T05:59:59.999Z', '2026-11-02T06:00:00Z'],
  ]) {
    const rows = transform([item('before', { b: bp() }, { recorded: before }), item('after', { b: bp() }, { recorded: after })], date);
    expect(rows.vitals.map(v => v.evidence[0].item_id)).toEqual(['before']);
  }
});

test('recorded, not clinical effective or measurement time, controls visibility', () => {
  const a = item('a', { b: bp({ measured_at: '2030-01-01T10:00' }) }, { effective: '2030-01-01' });
  expect(transform([a], asOf).vitals).toHaveLength(1);
});

test('supersession chains and retractions apply only after publication', () => {
  const a = item('a', { b: bp() });
  const b = item('b', { b: bp({ systolic_mmhg: 130 }) }, { recorded: '2026-06-03T12:00:00Z', supersedes: ['a'] });
  const c = item('c', { b: bp({ systolic_mmhg: 140 }) }, { recorded: '2026-06-04T12:00:00Z', supersedes: ['b'] });
  const r = item('r', {}, { recorded: '2026-06-05T12:00:00Z', retracts: ['c'] });
  const input = [r, b, a, c];
  expect(transform(input, '2026-06-02').vitals[0].systolic_mmhg).toBe(120);
  expect(transform(input, '2026-06-03').vitals[0].systolic_mmhg).toBe(130);
  expect(transform(input, '2026-06-04').vitals[0].systolic_mmhg).toBe(140);
  expect(transform(input, '2026-06-05').vitals).toHaveLength(0);
});

test('the latest full medicine list wins, including an empty list', () => {
  const old = item('old', { a: med(), b: med({ name: 'Lisinopril', homelog_med_id: 'm2' }) });
  const current = item('new', { b: med({ name: 'Lisinopril', homelog_med_id: 'm2' }) }, { recorded: '2026-06-04T12:00:00Z' });
  expect(transform([current, old], asOf).medications.map(m => m.ingredient)).toEqual(['lisinopril']);
  const empty = item('empty', {}, { recorded: '2026-06-05T12:00:00Z', narrative: 'My Medicines, saved 5 June 2026.' });
  expect(transform([empty, current, old], asOf).medications).toHaveLength(0);
  const silentEmpty = { ...empty, narrative: '', supersedes: ['new'] };
  expect(transform([silentEmpty, current, old], asOf).medications).toHaveLength(0);
});

test('single patient list ingredient and generic/brand duplicates', () => {
  const rows = transform([item('a', { b: med({ name: 'Glucophage', status: 'stopped' }), a: med() })], asOf).medications;
  expect(rows).toHaveLength(1);
  expect(rows[0].ingredient).toBe('metformin');
  expect(rows[0].patient_reported).toBe(true);
});

test('codes and partial dates retain only what is supplied', () => {
  const product = medicine({ started: '2019-06', picked_from_search: { rxnorm: '861004', display: 'metformin hydrochloride 1000 MG Oral Tablet' } });
  expect(product.status_since).toBe('2019-06');
  expect(product.ingredient).toBe('metformin');
  expect(product.rxnorm_ingredient).toBeUndefined();
  expect(medicine({ picked_from_search: { rxnorm: '6809', display: 'metformin' } }).rxnorm_ingredient).toBe('6809');
  expect(medicine({ picked_from_search: { rxnorm: '123', display: 'metformin hydrochloride' } }).rxnorm_ingredient).toBeUndefined();
  expect(medicine({ started: '2019-02-29' }).status_since).toBeUndefined();
  expect(medicine({ status: 'stopped', stopped: '2025' }).status_since).toBe('2025');
});

test('nicknames do not become invented ingredients', () => {
  expect(medicine({ name: 'water pill' }).ingredient).toBeUndefined();
  expect(medicine({ name: 'm_61' }).ingredient).toBeUndefined();
  expect(medicine({ name: 'water pill', picked_from_search: { display: 'furosemide 20 MG Oral Tablet', rxnorm: '123' } }).ingredient).toBe('furosemide');
});

test('fixed dose and frequency rules', () => {
  for (const [strength_text, how_i_take_it, expectedDose, expectedFrequency] of [
    ['10 mg', 'take 2 tablets every 12 hours', { value: 20, unit: 'mg' }, 'BID'],
    ['90 mcg/puff', '2 puffs every 6 hours as needed', { value: 180, unit: 'mcg' }, 'PRN'],
    ['10 mg tablet', 'in the evening', { value: 10, unit: 'mg' }, 'QD'],
    [undefined, '1 tablet daily', { value: 1, unit: 'tablet' }, 'QD'],
    ['100 units/mL pen', '10 units at bedtime', { value: 10, unit: 'units' }, 'QHS'],
    ['0.075 mg', 'morning', { value: 0.075, unit: 'mg' }, 'QD'],
    ['10 mg', 'half a tablet every 8 hours', { value: 5, unit: 'mg' }, 'TID'],
    ['10 mg', '1/2 tablet daily', { value: 5, unit: 'mg' }, 'QD'],
    ['10 mg', '2 in the morning and 2 in the evening', { value: 20, unit: 'mg' }, 'BID'],
    ['10 mg', 'once weekly', { value: 10, unit: 'mg' }, 'QW'],
    [undefined, '5 cc nightly', { value: 5, unit: 'mL' }, 'QHS'],
  ] as const) {
    const row = medicine({ strength_text, how_i_take_it });
    expect(row.dose, how_i_take_it).toEqual(expectedDose);
    expect(row.frequency, how_i_take_it).toBe(expectedFrequency);
  }
});

test('ambiguous amounts are omitted', () => {
  for (const how_i_take_it of [undefined, '', '1 or 2 most days', '1–2 puffs as needed', '2 to 4 tablets daily', 'sliding scale with meals', '10 units if glucose is high', '1 tablet in the morning and 2 at night', '2 in the morning and 1 in the evening', 'as directed', 'as needed']) {
    expect(medicine({ strength_text: '10 mg', how_i_take_it }).dose, String(how_i_take_it)).toBeUndefined();
  }
  expect(medicine({ strength_text: '100 units/mL pen', how_i_take_it: 'bedtime' }).dose).toBeUndefined();
});

test('holds, stop reasons, and sensitivity', () => {
  const hold = medicine({ name: 'Seroquel', started: '2020', note: 'Holding until surgery, since 2026-05.' });
  expect(hold.status).toBe('held');
  expect(hold.status_since).toBe('2026-05');
  expect(hold.sensitivity).toEqual(['mental-health']);
  expect(hold.stop_reason).toBeUndefined();
  const stopped = medicine({ status: 'stopped', stopped: '2026-06', note: 'Made me nauseated.' });
  expect(stopped.stop_reason).toBe('adverse_reaction');
  expect(stopped.status_reason_text).toBe('Made me nauseated.');
  expect(stopped.status_since).toBe('2026-06');
  expect(medicine({ status: 'stopped', note: 'Paused for now', stopped: '2026-05-10' }).status).toBe('held');
  expect(medicine({ name: 'Suboxone' }).sensitivity).toContain('substance-use');
});

test('home readings stay separate, wall times stay unchanged, and meter units are per reading', () => {
  const rows = transform([item('a', {
    a: glucose(), b: glucose({ measured_at: '2026-06-01T09:00', value: 105, unit: 'mg/dL' }),
    c: glucose({ measured_at: '2026-06-01T10:00', value: 33.3, out_of_range: 'HI' }),
    d: glucose({ measured_at: '2026-06-01T11:00', value: 1.1, out_of_range: 'LO' }), e: bp(),
    f: bp({ measured_at: '2026-03-08T02:30' }),
    g: bp({ measured_at: '2026-03-04T03:30:00Z' }),
  })], asOf);
  expect(rows.labs).toEqual([]);
  expect(rows.vitals).toHaveLength(7);
  expect(rows.vitals.find(v => v.glucose_mg_dl === 99)?.local_time).toBe('2026-06-01T08:00');
  expect(rows.vitals.find(v => v.glucose_out_of_range === 'HI')?.glucose_mg_dl).toBe(600);
  expect(rows.vitals.find(v => v.glucose_out_of_range === 'LO')?.glucose_mg_dl).toBe(20);
  expect(rows.vitals.some(v => v.local_time === '2026-03-08T02:30')).toBe(true);
  expect(rows.vitals.some(v => v.local_time === '2026-03-03T21:30')).toBe(true);
});

test('deduplicate typed copies, but keep distinct device repeats and distinct rounded glucose values', () => {
  const rows = transform([item('a', {
    a: bp(), b: bp({ measured_at: '2026-06-01T08:01', entry_method: 'typed', pulse_bpm: undefined }),
    c: bp({ measured_at: '2026-06-01T08:02' }),
    d: glucose(), e: glucose({ measured_at: '2026-06-01T08:01', entry_method: 'typed' }),
    f: glucose({ measured_at: '2026-06-01T08:02', value: 5.51, entry_method: 'typed' }),
  })], asOf).vitals;
  expect(rows).toHaveLength(4);
  expect(rows.filter(r => r.evidence.length === 2)).toHaveLength(2);
});

test('diary and dose logs do not create regimens, diagnoses, allergies, or labs', () => {
  const rows = transform([item('a', {
    n: { type: 'diary_note', written_at: '2026-06-01T10:00', symptom_tags: ['pain', 'nausea'] },
    d: { type: 'dose_log', at: '2026-06-01T10:00', homelog_med_id: 'm1', med_name: 'insulin', status: 'skipped' },
  }, { narrative: '<ref id="n">I think I have cancer</ref>' })], asOf);
  expect(rows).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});

test('malformed payloads are skipped without throwing', () => {
  const values = [null, undefined, true, 6, 'text', [], {}, { type: 'bp_reading' }, { type: 'my_med', name: [] }, { type: 'glucose_reading', measured_at: 'not a date' }];
  for (const value of values) {
    expect(() => transform(value as FolioItem[], asOf)).not.toThrow();
    expect(() => transform([item('a', { x: value })], asOf)).not.toThrow();
    expect(() => transform([item('a', { x: bp({ measured_at: value }) })], asOf)).not.toThrow();
    expect(() => transform([item('a', { x: med({ strength_text: value, how_i_take_it: value, note: value, picked_from_search: value }) })], asOf)).not.toThrow();
    expect(() => transform([item('a', {})], value as string)).not.toThrow();
  }
});

test('permuting item order or payload key order does not change rows and input is not mutated', () => {
  const items = [item('a', { z: glucose(), a: bp() }), item('b', { m: med() })];
  const before = JSON.stringify(items);
  const rows = transform(items, asOf);
  expect(JSON.stringify(items)).toBe(before);
  expect(transform([...items].reverse().map(i => ({ ...i, payload: Object.fromEntries(Object.entries(i.payload).reverse()) })), asOf)).toEqual(rows);
});

test('concentrations are not single-unit strengths and liquid doses use the written denominator', () => {
  expect(medicine({ strength_text: '250 mg/5 mL', how_i_take_it: '10 mL twice daily' }).dose).toEqual({ value: 500, unit: 'mg' });
  expect(medicine({ strength_text: '250 mg/5 mL', how_i_take_it: 'morning' }).dose).toBeUndefined();
  expect(medicine({ strength_text: '100 units/mL', how_i_take_it: '100 units/mL at bedtime' }).dose).toBeUndefined();
  expect(medicine({ strength_text: '5-10 mg', how_i_take_it: 'morning' }).dose).toBeUndefined();
  expect(medicine({ strength_text: '10 mg', how_i_take_it: '1½ tablets daily' }).dose).toEqual({ value: 15, unit: 'mg' });
  expect(medicine({ strength_text: '10 mg', how_i_take_it: '1 tablet daily and another if needed' }).dose).toBeUndefined();
  expect(medicine({ strength_text: '10 mg', how_i_take_it: '1 in the morning, 2 in the evening' }).dose).toBeUndefined();
});

test('temporary stops are holds and older dates do not become hold dates', () => {
  for (const note of ['Stopped taking it for now', 'Stopped taking for now', 'Not taking at the moment', 'Held until next visit']) {
    expect(medicine({ note }).status, note).toBe('held');
  }
  expect(medicine({ note: 'Started on 2020-01-01. Holding since 2026-05.' }).status_since).toBe('2026-05');
  expect(medicine({ note: 'Do not stop or hold until I call the doctor.' }).status).toBe('active');
  expect(medicine({ status: 'stopped', note: 'No side effects; I decided I did not want it.' }).stop_reason).toBe('patient_choice');
});

test('combination ingredients retain their own strengths', () => {
  const rows = transform([item('a', { m: med({ name: 'Zestoretic', strength_text: '20/12.5 mg', how_i_take_it: '2 tablets daily' }) })], asOf).medications;
  expect(rows.map(r => [r.ingredient, r.dose])).toEqual([
    ['hydrochlorothiazide', { value: 25, unit: 'mg' }], ['lisinopril', { value: 40, unit: 'mg' }],
  ]);
  const unknownStrength = transform([item('a', { m: med({ name: 'Zestoretic', how_i_take_it: 'morning' }) })], asOf).medications;
  expect(unknownStrength.every(m => m.dose === undefined)).toBe(true);
});

test('equivalent meter units deduplicate without merging distinct same-unit readings', () => {
  const rows = transform([item('a', {
    a: glucose(), b: glucose({ measured_at: '2026-06-01T08:01', entry_method: 'typed', unit: 'mg/dL', value: 99 }),
  })], asOf).vitals;
  expect(rows).toHaveLength(1);
  expect(rows[0].evidence).toHaveLength(2);
});
