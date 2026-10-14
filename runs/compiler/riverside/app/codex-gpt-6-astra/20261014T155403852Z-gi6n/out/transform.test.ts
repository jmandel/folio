import { strict as assert } from 'node:assert';
import { transform } from './transform';
import type { FolioItem } from '../in/views/views';
const tests: [string, () => void][] = [];
const test = (name: string, fn: () => void) => tests.push([name, fn]);
const item = (id: string, date: string, payload: Record<string, unknown> = {}, extra: Partial<FolioItem> = {}): FolioItem => ({
  folio: '0.1', id, issuer: 'riverside', patient: 'p', recorded: date, effective: date, narrative: '',
  payload: { enc: { type: 'encounter', encounter_id: 'stay', document_kind: 'hp', class: 'inpatient', service: 'medicine' }, ...payload }, ...extra,
});
const med = (status = 'continue', extra: Record<string, unknown> = {}) => ({ type: 'home_med', drug_name: 'metformin 500 mg tablet', rxnorm_ingredient: '6809', dose_text: '1000 mg', sig: '2 tabs PO BID', status, ...extra });
const dx = (label = 'Acute kidney injury', status = 'active', extra: Record<string, unknown> = {}) => ({ type: 'diagnosis', label, status, ...extra });
const lab = (status = 'final', value = '88.4', extra: Record<string, unknown> = {}) => ({ type: 'result', test: { local_code: 'CREAT', loinc: '2160-0', name: 'Creatinine' }, accession: 'a', collected: '2025-01-03T03:00:00Z', specimen: 'serum', unit: 'umol/L', status, value, ...extra });
const run = (items: FolioItem[], date = '2026-10-13') => transform(items, date);
const a = item('a', '2025-01-03T12:00:00Z', { med: med(), dx: dx(), lab: lab() });

test('winter local cutoff, inclusive end of day, future corrections do not apply', () => {
  const b = item('b', '2025-01-04T06:00:00Z', { med: med('held') }, { supersedes: ['a'] });
  assert.equal(run([a, b], '2025-01-03').medications[0].status, 'active');
  assert.equal(run([a, b], '2025-01-04').medications[0].status, 'held');
  const end = item('end', '2025-01-04T05:59:59.999Z', { med: med('stopped') }, { supersedes: ['a'] });
  assert.equal(run([end, a], '2025-01-03').medications[0].status, 'stopped');
});
test('summer cutoff and naive local timestamps', () => {
  const b = item('b', '2025-07-04T05:00:00Z', { med: med('held') });
  assert.equal(run([b], '2025-07-03').medications.length, 0);
  assert.equal(run([item('c', '2025-07-03T23:59:59', { med: med() })], '2025-07-03').medications.length, 1);
});
test('transitive correction and retraction', () => {
  const b = item('b', '2025-01-04T12:00:00Z', { med: med('held') }, { supersedes: ['a'] });
  const c = item('c', '2025-01-05T12:00:00Z', { med: med('stopped') }, { supersedes: ['b'] });
  assert.equal(run([b, a, c]).medications[0].status, 'stopped');
  assert.equal(run([b, a, c]).problems.length, 0);
  const r = item('r', '2025-01-06T12:00:00Z', {}, { payload: {}, retracts: ['c'] });
  assert.equal(run([r, c, b, a]).medications[0].status, 'held');
});
test('same timestamp correction and issuer scope', () => {
  const b = item('0-before-a', a.recorded, { med: med('held') }, { supersedes: ['a'] });
  assert.equal(run([a, b]).medications[0].status, 'held');
  const r = item('r', '2025-01-06T12:00:00Z', {}, { issuer: 'other', payload: {}, retracts: ['a'] });
  assert.equal(run([r, a]).medications[0].status, 'active');
});
test('advanced lab status wins, comparator converts, copied panel deduplicates', () => {
  const b = item('b', '2025-01-04T12:00:00Z', { p: { type: 'panel', status: 'corrected', accession: 'a', collected: '2025-01-03T03:00:00Z', specimen: 'serum', components: [{ test: lab().test, value: '<176.8', unit: 'umol/L' }] } });
  const c = item('c', '2025-01-05T12:00:00Z', { copied: lab('final', '265.2') });
  const rows = run([c, a, b]).labs;
  assert.equal(rows.length, 1); assert.equal(rows[0].value, 2); assert.equal(rows[0].comparator, '<');
  assert.equal(rows[0].status, 'final'); assert.equal(rows[0].collected, '2025-01-02T21:00:00-06:00');
  assert.equal(rows[0].evidence.length, 3);
});
test('corrected nonnumeric result does not resurrect old value; distinct specimen repeats survive', () => {
  const b = item('b', '2025-01-04T12:00:00Z', { lab: lab('corrected', 'Hemolyzed, see comment') });
  assert.equal(run([a, b]).labs.length, 0);
  const c = item('c', '2025-01-05T12:00:00Z', { lab: lab('final', '176.8', { accession: 'new' }) });
  assert.equal(run([a, c]).labs.length, 2);
});
test('unitless pH, cell count conversion, no invented LOINC', () => {
  const rows = run([item('x', a.recorded, {
    ph: lab('final', '7.2', { test: { local_code: 'PH', name: 'pH' }, unit: undefined }),
    plt: lab('final', '350000', { test: { local_code: 'PLT', name: 'Platelet count' }, unit: 'cells/uL' }),
    bad: lab('final', '3.2 mg/dL', { accession: 'bad' }),
  })]).labs;
  assert.equal(rows.length, 2); assert.equal(rows.find(r => r.analyte === 'platelets')?.value, 350);
  assert.equal(rows.find(r => r.analyte === 'ph')?.unit, '[pH]'); assert.equal(rows[0].loinc, undefined);
});
test('local specimen time gets DST offset without shifting the wall clock', () => {
  const rows = run([item('x', '2025-07-03T12:00:00Z', { lab: lab('final', '88.4', { collected: '2025-07-02T22:30' }) })]).labs;
  assert.equal(rows[0].collected, '2025-07-02T22:30:00-05:00');
});
test('full medication snapshot removes absent drugs; inpatient-only drugs do not appear', () => {
  const b = item('b', '2025-01-04T12:00:00Z', { inpatient: { ...med(), type: 'inpatient_med' } });
  assert.equal(run([a, b]).medications.length, 0);
});
test('discharge is authoritative even when a progress note is signed later', () => {
  const dc = item('dc', '2025-01-05T12:00:00Z', { enc: { type: 'encounter', encounter_id: 'stay', document_kind: 'discharge_summary', discharged: '2025-01-05T10:00:00Z' }, med: med('continue') }, { effective: a.effective });
  const later = item('later', '2025-01-06T12:00:00Z', { med: med('held') });
  assert.equal(run([a, dc, later]).medications[0].status, 'active');
  const nextStay = item('next', '2025-02-06T12:00:00Z', { enc: { type: 'encounter', encounter_id: 'next', document_kind: 'ed_note' }, med: med('not_reconciled') });
  assert.equal(run([a, dc, later, nextStay]).medications[0].status, 'unknown');
});
test('dose_text already gives administered mass, tablet count does not multiply it again', () => {
  assert.deepEqual(run([a]).medications[0].dose, { value: 1000, unit: 'mg' });
  assert.deepEqual(run([item('x', a.recorded, { med: med('continue', { dose_text: '2 tablets' }) })]).medications[0].dose, { value: 1000, unit: 'mg' });
});
test('ranges omitted, units normalized, no stop reason on held despite advise_against', () => {
  const held = med('held', { dose_text: '1–2 tabs', restart_advice: 'advise_against', instructions: 'Do not restart due to rash' });
  const row = run([item('x', a.recorded, { med: held })]).medications[0];
  assert.equal(row.dose, undefined); assert.equal(row.status, 'held'); assert.equal(row.stop_reason, undefined);
  const units = run([item('x', a.recorded, { med: med('new', { drug_name: 'insulin glargine', dose_text: '10 IU', sig: 'nightly' }) })]).medications[0];
  assert.deepEqual(units.dose, { value: 10, unit: 'units' }); assert.equal(units.frequency, 'QHS');
});
test('diagnostic uncertainty is not promoted by silence', () => {
  const x = item('x', a.recorded, { dx: dx('R/O pancreatitis', 'working') });
  const y = item('y', '2025-01-04T12:00:00Z', {});
  assert.equal(run([x, y]).problems.length, 0);
  assert.equal(run([x, item('z', '2025-01-05T12:00:00Z', { dx: dx('Pancreatitis', 'ruled_out') })]).problems.length, 0);
});
test('resolved conditions remain, later ruled-out encounter does not erase established history', () => {
  const b = item('b', '2025-01-05T12:00:00Z', { dx: dx('Acute kidney injury', 'resolved') });
  assert.equal(run([a, b]).problems[0].status, 'resolved');
  const c = item('c', '2025-02-05T12:00:00Z', { enc: { type: 'encounter', encounter_id: 'other', document_kind: 'hp' }, dx: dx('Acute kidney injury', 'ruled_out') });
  assert.equal(run([a, b, c]).problems[0].status, 'resolved');
});
test('CKD restaging uses clinician assertion, copied history does not regress it, exact onset precision', () => {
  const x = item('x', a.recorded, { h: { type: 'history', condition: 'CKD stage 3a', icd10cm: 'N18.31', onset_text: '2016', source: 'outside_records' } });
  const y = item('y', '2025-01-04T12:00:00Z', { dx: dx('CKD stage 3b A2', 'active', { icd10cm: 'N18.32' }) });
  const z = item('z', '2025-01-05T12:00:00Z', { h: { ...x.payload.h, onset_text: '~10 years' } });
  const r = run([z, y, x]).problems;
  assert.equal(r.length, 1); assert.equal(r[0].ckd_stage, 'G3b'); assert.equal(r[0].albuminuria, 'A2');
  assert.deepEqual(r[0].onset, { value: '2016', precision: 'year' });
});
test('different Riverside diagnoses sharing coarse ICD are not conflated', () => {
  const x = item('x', a.recorded, { d1: dx('DKA, ordinary', 'resolved', { icd10cm: 'E11.10', riverside_dx: { code: 'RRH-DX-1', name: 'ordinary' } }), d2: dx('Euglycemic DKA, SGLT2 inhibitor-associated', 'active', { icd10cm: 'E11.10', riverside_dx: { code: 'RRH-DX-2', name: 'euglycemic' } }) });
  assert.equal(run([x]).problems.length, 2);
});
test('side effect is not hypersensitivity; immune mechanism is not inferred from hives', () => {
  const x = item('x', a.recorded, { a: { type: 'allergy', substance: 'lisinopril', reaction: 'cough', severity: 'mild' }, b: { type: 'allergy', substance: 'Peanut', reaction: 'hives', severity: 'severe' } });
  const rows = run([x]).allergies;
  assert.equal(rows.find(r => r.substance === 'lisinopril')?.reaction_type, 'side_effect');
  assert.equal(rows.find(r => r.substance === 'Peanut')?.mechanism, 'unknown');
  assert.equal(rows.find(r => r.substance === 'Peanut')?.criticality, 'high');
});
test('NKDA snapshot clears earlier list, no NKDA row', () => {
  const x = item('x', a.recorded, { a: { type: 'allergy', substance: 'lisinopril', reaction: 'cough', severity: 'mild' } });
  const y = item('y', '2025-01-04T12:00:00Z', { a: { type: 'allergy', substance: 'NKDA' } });
  assert.equal(run([x, y]).allergies.length, 0);
});
test('drug-attributed diagnosis creates allergy with single same-item class member', () => {
  const x = item('x', a.recorded, { d: dx('Euglycemic DKA, SGLT2 inhibitor-associated'), m: med('held', { drug_name: 'Jardiance 10 mg tablet', rxnorm_ingredient: '1545653', dose_text: '10 mg' }) });
  const row = run([x]).allergies[0];
  assert.equal(row.substance, 'empagliflozin'); assert.equal(row.rxnorm_ingredient, '1545653');
  assert.equal(row.reaction_type, 'serious_adverse_event'); assert.equal(row.criticality, 'high');
  const y = { ...x, payload: { ...x.payload, m2: med('held', { drug_name: 'dapagliflozin', rxnorm_ingredient: 'source-code' }) } };
  assert.equal(run([y]).allergies[0].substance, 'SGLT2 inhibitor');
  assert.equal(run([y]).allergies[0].rxnorm_ingredient, undefined);
});
test('adverse effect code-only disease is not a problem', () => {
  const x = item('x', a.recorded, { d: dx('Adverse effect of penicillins', 'active', { icd10cm: 'T36.0X5A' }), m: med('stopped', { drug_name: 'amoxicillin 500 mg capsule', rxnorm_ingredient: '723' }) });
  const r = run([x]); assert.equal(r.problems.length, 0); assert.equal(r.allergies[0].substance, 'amoxicillin');
});
test('sensitive psychiatric history remains visible and tagged', () => {
  const x = item('x', a.recorded, { h: { type: 'history', condition: 'Bipolar disorder', source: 'patient' }, m: med('continue', { drug_name: 'quetiapine 50 mg tablet' }) });
  const r = run([x]); assert.deepEqual(r.problems[0].sensitivity, ['mental-health']); assert.deepEqual(r.medications[0].sensitivity, ['mental-health']);
});
test('vitals copied once, repeat pressure grouped, multi-day stay not collapsed', () => {
  const v = { type: 'vitals', taken: '2025-01-03T01:00:00Z', bp: { systolic_mmhg: 150, diastolic_mmhg: 90 }, heart_rate_bpm: 70, weight_kg: 70.25 };
  const x = item('x', a.recorded, { v, r: { type: 'vitals', taken: '2025-01-03T01:30:00Z', bp: { systolic_mmhg: 140, diastolic_mmhg: 85 } } });
  const y = item('y', '2025-01-04T12:00:00Z', { copy: v, later: { ...v, taken: '2025-01-04T01:00:00Z' } });
  const rows = run([y, x]).vitals; assert.equal(rows.length, 2); assert.equal(rows[0].repeat_systolic_mmhg, 140);
  assert.equal(rows[0].weight_kg, 70.3); assert.equal(rows[0].local_time, '2025-01-02T19:00');
});
test('malformed values are ignored without throwing', () => {
  const malformed: unknown[] = [null, 5, 'x', [], {}, { id: 'x', issuer: 'r', recorded: 'not a date' }, item('x', a.recorded, { a: null, b: [], c: { type: 'result', test: null }, d: { type: 'vitals', taken: 'bad' }, e: { type: 'home_med', drug_name: {}, status: 'held' } })];
  assert.doesNotThrow(() => run(malformed as FolioItem[]));
  assert.deepEqual(run(null as unknown as FolioItem[]), { medications: [], problems: [], allergies: [], labs: [], vitals: [] });
});
const samples = (await Bun.file('in/samples/samples.json').json())[0].items as FolioItem[];
test('generic inhaler ingredients, fractional tablets, and non-daily schedules', () => {
  const rows = run([item('x', a.recorded, {
    inhaler: med('continue', { rxnorm_ingredient: undefined, drug_name: 'albuterol 90 mcg/actuation inhaler', dose_text: '2 puffs', sig: '2 puffs every 6 hours as needed' }),
    fraction: med('continue', { rxnorm_ingredient: undefined, drug_name: 'prednisone 10 mg tablet', dose_text: '1/2 tablet', sig: 'daily' }),
    weekly: med('continue', { rxnorm_ingredient: undefined, drug_name: 'methotrexate 2.5 mg tablet', dose_text: '2.5 mg', sig: 'twice weekly' }),
  })]).medications;
  assert.deepEqual(rows.find(r => r.ingredient === 'albuterol')?.dose, { value: 180, unit: 'mcg' });
  assert.deepEqual(rows.find(r => r.ingredient === 'prednisone')?.dose, { value: 5, unit: 'mg' });
  assert.equal(rows.find(r => r.ingredient === 'methotrexate')?.frequency, 'other');
});
test('reclassification of asthma gives one latest condition row', () => {
  const x = item('x', a.recorded, { d: dx('Mild intermittent asthma', 'active', { icd10cm: 'J45.20' }) });
  const y = item('y', '2025-01-04T12:00:00Z', { d: dx('Moderate persistent asthma', 'active', { icd10cm: 'J45.40' }) });
  const rows = run([x, y]).problems;
  assert.equal(rows.length, 1); assert.equal(rows[0].icd10cm, 'J45.40');
});
test('code supplies adverse drug class, and a named manifestation still gives a problem', () => {
  const x = item('x', a.recorded, { d: dx('Drug adverse effect', 'active', { icd10cm: 'T36.0X5A' }) });
  assert.equal(run([x]).allergies[0].substance, 'penicillins');
  assert.equal(run([x]).problems.length, 0);
  const y = item('y', a.recorded, { d: dx('Drug-induced pancreatitis due to valproate', 'active', { icd10cm: 'T42.6X5A' }) });
  assert.equal(run([y]).problems.length, 1); assert.equal(run([y]).allergies[0].substance, 'valproate');
});
test('unrecognized dictionary keys cannot access object prototype properties', () => {
  const x = item('x', a.recorded, { m: med('constructor', { drug_name: 'constructor' }), l: lab('final', '2', { test: { local_code: 'constructor', loinc: 'constructor', name: 'constructor' } }), d: dx('constructor') });
  const rows = run([x]); assert.equal(rows.medications.length, 0); assert.equal(rows.labs.length, 0);
});
test('sample output and input permutation determinism', () => {
  const r = run(samples); assert.equal(r.labs.length, 49); assert.equal(r.vitals.length, 7);
  assert.equal(r.medications.length, 4); assert.equal(r.problems.length, 3);
  assert.equal(r.medications.find(m => m.ingredient === 'empagliflozin')?.status, 'held');
  assert.equal(r.allergies.find(m => m.substance === 'lisinopril')?.reaction_type, 'side_effect');
  assert.deepEqual(run([...samples].reverse()), r);
  for (let i = 0; i < samples.length; i++) assert.deepEqual(run([...samples.slice(i), ...samples.slice(0, i)]), r);
  assert.deepEqual(run(samples, '2023-04-08'), { medications: [], problems: [], allergies: [], labs: [], vitals: [] });
  const dc = run(samples, '2023-04-12');
  assert.equal(dc.medications.find(m => m.ingredient === 'metformin')?.status, 'active');
  assert.equal(dc.medications.find(m => m.ingredient === 'losartan')?.status, 'held');
});
let failed = 0;
for (const [name, fn] of tests) {
  try { fn(); console.log('PASS', name); } catch (e) { failed++; console.error('FAIL', name, e); }
}
console.log(`${tests.length - failed}/${tests.length} tests passed`);
if (failed) process.exit(1);
