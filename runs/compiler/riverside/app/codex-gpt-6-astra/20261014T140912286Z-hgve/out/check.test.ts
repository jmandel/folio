import { transform } from './transform';
import type { FolioItem } from '../in/views/views';
import { describe, expect, test } from 'bun:test';

type Payload = Record<string, any>;
function doc(id: string, time: string, payload: Payload, overrides: Partial<FolioItem> = {}): FolioItem {
  return { folio: '0.1', id, issuer: 'riverside', patient: 'p', effective: time,
    recorded: time, narrative: '', payload: { enc: { type: 'encounter', encounter_id: 'stay',
      document_kind: 'hp', class: 'inpatient', service: 'Medicine' }, ...payload }, ...overrides };
}
const med = (name = 'metformin 1000 mg tablet', status = 'continue', extras: Payload = {}) =>
  ({ type: 'home_med', drug_name: name, dose_text: '1000 mg', sig: '1 tab PO BID with meals', status, ...extras });
const dx = (label: string, code?: string, status = 'active', extras: Payload = {}) =>
  ({ type: 'diagnosis', label, icd10cm: code, status, ...extras });
const lab = (value = '1.2', status = 'final', extras: Payload = {}) =>
  ({ type: 'result', accession: 'accession', test: { local_code: 'CREAT', loinc: '2160-0', name: 'Creatinine' },
    collected: '2025-06-01T20:00:00Z', specimen: 'serum', unit: 'mg/dL', value, status, ...extras });
const map = (items: FolioItem[], date = '2026-10-13') => transform(items, date);

describe('samples', () => {
  test('deduplication, adverse diagnoses, inpatient exclusions and local times', async () => {
    const [p] = await Bun.file(new URL('../in/samples/samples.json', import.meta.url)).json();
    const rows = map(p.items);
    expect(rows.medications).toHaveLength(4);
    expect(rows.problems).toHaveLength(3);
    expect(rows.allergies).toHaveLength(2);
    expect(rows.labs).toHaveLength(49);
    expect(rows.vitals).toHaveLength(7);
    expect(rows.medications.find(m => m.ingredient === 'empagliflozin')?.status).toBe('held');
    expect(rows.medications.some(m => /insulin/.test(m.ingredient ?? ''))).toBe(false);
    expect(rows.problems.find(p => p.icd10cm === 'N17.9')?.status).toBe('resolved');
    expect(rows.allergies.find(a => a.substance === 'empagliflozin')).toMatchObject({ reaction_type: 'serious_adverse_event', mechanism: 'non_immune', criticality: 'high' });
    expect(rows.vitals[0].local_time).toBe('2023-04-08T23:01');
    expect(map([...p.items].reverse())).toEqual(rows);
    for (let n = 1; n < p.items.length; n++) expect(map([...p.items.slice(n), ...p.items.slice(0, n)])).toEqual(rows);
  });
  test('discharge was recorded on the preceding Chicago date', async () => {
    const [p] = await Bun.file(new URL('../in/samples/samples.json', import.meta.url)).json();
    expect(map(p.items, '2023-04-11').medications.find(m => m.ingredient === 'metformin')?.status).toBe('held');
    expect(map(p.items, '2023-04-12').medications.find(m => m.ingredient === 'metformin')?.status).toBe('active');
    expect(map(p.items, '2025-04-28').allergies.some(a => a.substance === 'empagliflozin')).toBe(true);
  });
});

describe('scope and correction graph', () => {
  test('exact summer/winter local end-of-day boundaries', () => {
    for (const [before, after, date] of [
      ['2025-06-02T04:59:59.999Z', '2025-06-02T05:00:00Z', '2025-06-01'],
      ['2025-01-02T05:59:59.999Z', '2025-01-02T06:00:00Z', '2025-01-01'],
      ['2025-03-10T04:59:59.999Z', '2025-03-10T05:00:00Z', '2025-03-09'],
      ['2025-11-03T05:59:59.999Z', '2025-11-03T06:00:00Z', '2025-11-02'],
    ]) {
      expect(map([doc('a', before, { m: med() })], date).medications).toHaveLength(1);
      expect(map([doc('a', after, { m: med() })], date).medications).toHaveLength(0);
    }
  });
  test('supersession is transitive, stays issuer-scoped and does not resurrect withdrawn ancestors', () => {
    const a = doc('a', '2025-01-01T18:00:00Z', { d: dx('Hypertension', 'I10') });
    const b = doc('b', '2025-01-02T18:00:00Z', { d: dx('Hyperkalemia', 'E87.5') }, { supersedes: ['a'] });
    const c = doc('c', '2025-01-03T18:00:00Z', {}, { supersedes: ['b'] });
    const d = doc('d', '2025-01-04T18:00:00Z', {}, { retracts: ['c'] });
    expect(map([d, c, b, a], '2025-01-01').problems[0].icd10cm).toBe('I10');
    expect(map([a, b, c, d], '2025-01-02').problems[0].icd10cm).toBe('E87.5');
    expect(map([a, b, c, d]).problems).toHaveLength(0);
    expect(map([a, { ...c, issuer: 'other', supersedes: ['a'] }]).problems).toHaveLength(1);
  });
});

describe('medications', () => {
  test('complete latest snapshot, discharge preference, no inferred initiation dates', () => {
    const a = doc('a', '2025-06-01T17:00:00Z', { m: med(), old: med('losartan', 'continue') });
    const b = doc('b', '2025-06-02T17:00:00Z', { enc: { ...a.payload.enc, document_kind: 'discharge_summary', discharged: '2025-06-02T16:00:00Z' },
      m: med('metformin', 'held', { restart_advice: 'advise_against' }),
      iv: { type: 'inpatient_med', drug_name: 'insulin glargine', dose_text: '20 units' } }, { effective: a.effective });
    const c = doc('c', '2025-06-03T17:00:00Z', { m: med('metformin', 'continue') });
    expect(map([a, b, c]).medications).toHaveLength(1);
    expect(map([a, b, c]).medications[0]).toMatchObject({ status: 'held', patient_reported: false });
    expect(map([a, b, c]).medications[0].status_since).toBeUndefined();
    expect(map([a, b, c]).medications[0].stop_reason).toBeUndefined();
    const next = doc('d', '2025-07-01T17:00:00Z', { enc: { ...a.payload.enc, encounter_id: 'new-stay' } });
    expect(map([a, b, c, next]).medications).toHaveLength(0);
  });
  test('names, strengths, ranges, changed lines, and frequencies', () => {
    const rows = map([doc('a', '2025-06-01T17:00:00Z', {
      a: med('Jardiance 10 mg tablet', 'not_reconciled', { dose_text: '2 tablets', sig: 'PO daily' }),
      b: med('insulin glargine 100 unit/mL injection', 'new', { dose_text: '10 [iU]', sig: 'SubQ QHS' }),
      c: med('losartan potassium 50 mg tablet', 'stopped', { dose_text: '1 or 2 tabs', sig: 'as needed', instructions: 'Changed to valsartan' }),
      d: med('metformin 1000 mg tablet', 'changed', { dose_text: '0.5 g', sig: 'BID in morning and at bedtime' }),
      e: med('water pill', 'continue', { dose_text: '1 tablet', sig: 'four times daily' }),
    })]).medications;
    expect(rows.find(m => m.ingredient === 'empagliflozin')).toMatchObject({ status: 'unknown', dose: { value: 20, unit: 'mg' } });
    expect(rows.find(m => m.ingredient === 'insulin glargine')).toMatchObject({ dose: { value: 10, unit: 'units' }, frequency: 'QHS' });
    expect(rows.find(m => m.ingredient === 'losartan')).toMatchObject({ stop_reason: 'therapy_changed', frequency: 'PRN' });
    expect(rows.find(m => m.ingredient === 'losartan')?.dose).toBeUndefined();
    expect(rows.find(m => m.ingredient === 'metformin')).toMatchObject({ dose: { value: 500, unit: 'mg' }, frequency: 'BID' });
    expect(rows.find(m => m.drug_name === 'water pill')).toMatchObject({ frequency: 'other' });
    expect(rows.find(m => m.drug_name === 'water pill')?.ingredient).toBeUndefined();
  });
});

describe('conditions and reactions', () => {
  test('CKD restaging beats stale copied history; only precise onset survives', () => {
    const a = doc('a', '2025-06-01T17:00:00Z', { h: { type: 'history', condition: 'CKD stage 3a', icd10cm: 'N18.31', onset_text: '2016', source: 'patient' } });
    const b = doc('b', '2025-06-02T17:00:00Z', { d: dx('Chronic kidney disease stage 3b A2', 'N1832') });
    const c = doc('c', '2025-06-03T17:00:00Z', a.payload);
    const rows = map([a, b, c]).problems;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ ckd_stage: 'G3b', albuminuria: 'A2', icd10cm: 'N18.32', onset: { value: '2016', precision: 'year' }, status: 'active' });
    expect(rows[0].evidence).toContainEqual({ item_id: 'b', entry_id: 'd' });
  });
  test('working and ruled-out do not become established through omission', () => {
    const a = doc('a', '2025-06-01T17:00:00Z', { d: dx('R/O pancreatitis', undefined, 'working'), x: dx('Hyperkalemia', 'E87.5') });
    const b = doc('b', '2025-06-02T17:00:00Z', { x: dx('Hyperkalemia', 'E87.5', 'ruled_out') });
    expect(map([a, b]).problems).toHaveLength(0);
  });
  test('ruling out an acute condition does not erase a different chronic condition', () => {
    const rows = map([doc('a', '2025-06-01T17:00:00Z', {
      chronic: dx('Chronic pancreatitis', 'K86.1'), acute: dx('Acute pancreatitis', 'K85.9', 'ruled_out'),
    })]).problems;
    expect(rows.map(r => r.condition)).toEqual(['Chronic pancreatitis']);
  });
  test('local diagnosis codes can separate conditions sharing an ICD code', () => {
    const a = doc('a', '2025-06-01T17:00:00Z', {
      x: dx('Euglycemic DKA, SGLT2 inhibitor-associated', 'E11.10', 'resolved', { riverside_dx: { code: 'RRH-DX-1', name: 'Drug-associated DKA' } }),
      y: dx('Diabetic ketoacidosis due to missed insulin', 'E11.10', 'active', { riverside_dx: { code: 'RRH-DX-2', name: 'Other DKA' } }),
    });
    expect(map([a]).problems).toHaveLength(2);
  });
  test('exactly one class member resolves a drug; ambiguity retains the class', () => {
    const a = doc('a', '2025-06-01T17:00:00Z', {
      d: dx('Euglycemic DKA, SGLT2 inhibitor-associated', 'E11.10', 'resolved'),
      m: med('Jardiance 10 mg tablet', 'held', { rxnorm_ingredient: '1545653' }),
      allergy: { type: 'allergy', substance: 'lisinopril', rxnorm_ingredient: '29046', reaction: 'angioedema', severity: 'severe' },
    });
    const rows = map([a]);
    expect(rows.allergies.find(a => a.substance === 'empagliflozin')).toMatchObject({ criticality: 'high', mechanism: 'non_immune', rxnorm_ingredient: '1545653' });
    expect(rows.allergies.find(a => a.substance === 'lisinopril')).toMatchObject({ reaction_type: 'hypersensitivity', mechanism: 'non_immune' });
    const b = { ...a, payload: { ...a.payload, m2: med('dapagliflozin', 'stopped') } };
    expect(map([b]).allergies.some(a => a.substance === 'SGLT2 inhibitor')).toBe(true);
  });
  test('T-code only is a reaction, not an invented condition; NKDA is not a row', () => {
    const a = doc('a', '2025-06-01T17:00:00Z', {
      d: dx('Adverse effect of SGLT2 inhibitor', 'T38.3X5A'),
      m: med('empagliflozin'), nkda: { type: 'allergy', substance: 'NKDA' },
    });
    expect(map([a]).problems).toHaveLength(0);
    expect(map([a]).allergies.map(a => a.substance)).toEqual(['empagliflozin']);
  });
  test('sensitive conditions remain present and flagged', () => {
    const rows = map([doc('a', '2025-06-01T17:00:00Z', { d: dx('Major depression', 'F32.9') })]).problems;
    expect(rows[0].sensitivity).toEqual(['mental-health']);
  });
  test('non-drug causes and missing a medicine are not adverse reactions', () => {
    for (const label of ['Diabetic ketoacidosis due to missed insulin glargine', 'Starvation-induced ketoacidosis',
      'Diabetic ketoacidosis unrelated to empagliflozin', 'Hypoglycemia due to fasting']) {
      const rows = map([doc('a', '2025-06-01T17:00:00Z', {
        d: dx(label, 'E11.10'), m: med('insulin glargine'), m2: med('empagliflozin'),
      })]);
      expect(rows.problems).toHaveLength(1);
      expect(rows.allergies).toHaveLength(0);
    }
  });
  test('a correction of an older assessment does not overtake a later assessment', () => {
    const a = doc('a', '2025-06-01T17:00:00Z', { d: dx('Hyperkalemia', 'E87.5'), m: med('metformin', 'held') });
    const b = doc('b', '2025-06-02T17:00:00Z', { d: dx('Hyperkalemia', 'E87.5', 'resolved'), m: med() });
    const c = { ...a, id: 'c', recorded: '2025-06-03T17:00:00Z', supersedes: ['a'] };
    expect(map([a, b, c]).problems[0].status).toBe('resolved');
    expect(map([a, b, c]).medications[0].status).toBe('active');
  });
});

describe('lab copies and units', () => {
  test('status outranks copying time; corrected text invalidates a prior number', () => {
    const a = doc('a', '2025-06-01T21:00:00Z', { x: lab('1.1', 'corrected') });
    const b = doc('b', '2025-06-02T21:00:00Z', { x: lab('2.2', 'final') });
    const c = doc('c', '2025-06-03T21:00:00Z', { x: lab('3.3', 'preliminary') });
    expect(map([a, b, c]).labs[0]).toMatchObject({ value: 1.1, status: 'final' });
    const d = doc('d', '2025-06-04T21:00:00Z', { x: lab('Hemolyzed, see comment', 'corrected') });
    expect(map([a, b, c, d]).labs).toHaveLength(0);
  });
  test('panel/standalone are the same result, while a new accession is a repeat', () => {
    const x = lab();
    const a = doc('a', '2025-06-01T21:00:00Z', {
      p: { type: 'panel', accession: x.accession, collected: x.collected, specimen: x.specimen, status: 'preliminary', components: [x] },
    });
    const b = doc('b', '2025-06-02T21:00:00Z', { x: lab('1.3'), y: lab('1.4', 'final', { accession: 'repeat' }) });
    expect(map([a, b]).labs.map(l => l.value)).toEqual([1.3, 1.4]);
  });
  test('comparators, conversions, unsupported values and race-specific eGFR', () => {
    const make = (local_code: string, name: string, value: string, unit: string | undefined, loinc?: string) =>
      lab(value, 'final', { accession: local_code, test: { local_code, name, loinc }, unit });
    const a = doc('a', '2025-06-01T21:00:00Z', {
      c: make('CREAT', 'Creatinine', '88.4', 'umol/L'),
      g: make('GLU', 'Glucose', '>10', 'mmol/L'),
      p: make('PLT', 'Platelets', '212,000', 'cells/uL'),
      t: make('TNI', 'Troponin I', '<0.01', 'ng/mL'),
      e: make('EGFR', 'eGFR (CKD-EPI 2021)', '>=60', 'mL/min/1.73m2'),
      r: make('EGFR_AA', 'eGFR African American', '80', 'mL/min/1.73m2'),
      q: make('VPH', 'pH, venous', '7.21', undefined),
      x: make('UNTRACKED', 'Calcium', '10', 'mg/dL'),
      bad: make('K', 'Potassium', 'Hemolyzed', 'mmol/L'),
    });
    const rows = map([a]).labs;
    expect(rows).toHaveLength(6);
    expect(rows.find(r => r.analyte === 'creatinine')?.value).toBe(1);
    expect(rows.find(r => r.analyte === 'glucose')).toMatchObject({ value: 180.16, comparator: '>', unit: 'mg/dL' });
    expect(rows.find(r => r.analyte === 'platelets')?.value).toBe(212);
    expect(rows.find(r => r.analyte === 'egfr')).toMatchObject({ comparator: '>=', value: 60, egfr_equation: 'ckd-epi-2021' });
    expect(rows.find(r => r.analyte === 'ph')?.unit).toBe('[pH]');
  });
});

describe('vitals and robustness', () => {
  test('local wall time, duplicate measurement, nearby weight, repeat BP and a later set', () => {
    const a = doc('a', '2025-06-01T21:00:00Z', {
      w: { type: 'vitals', taken: '2025-06-01T12:00', weight_kg: 82.45 },
      bp: { type: 'vitals', taken: '2025-06-01T12:02', bp: { systolic_mmhg: 150, diastolic_mmhg: 90 } },
      repeat: { type: 'vitals', taken: '2025-06-01T12:20', bp: { systolic_mmhg: 140, diastolic_mmhg: 85 } },
      later: { type: 'vitals', taken: '2025-06-01T17:00', bp: { systolic_mmhg: 130, diastolic_mmhg: 80 } },
    });
    const b = doc('b', '2025-06-02T21:00:00Z', { copied: { ...a.payload.bp, taken: '2025-06-01T17:02:00Z' } });
    const rows = map([a, b]).vitals;
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ local_time: '2025-06-01T12:02', systolic_mmhg: 150, repeat_systolic_mmhg: 140, weight_kg: 82.5 });
    expect(rows[1].local_time).toBe('2025-06-01T17:00');
  });
  test('malformed fields and unknown dictionaries never throw or produce NaN', () => {
    const junk = [null, undefined, 1, true, [], {}, '', { type: 'panel', components: [null, 'junk'] },
      { type: 'result', test: null }, { type: 'home_med', drug_name: {}, status: 'constructor' },
      { type: 'vitals', taken: 'not-a-date', bp: [] }, { type: 'diagnosis', label: [] }];
    expect(map(junk as any)).toEqual({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });
    const payload = Object.fromEntries(junk.map((v, i) => [String(i), v]));
    payload.evil = lab('12', 'final', { test: { local_code: 'x', name: 'x', loinc: '__proto__' } });
    expect(() => map([doc('a', '2025-06-01T21:00:00Z', payload)])).not.toThrow();
    expect(map([doc('a', '2025-06-01T21:00:00Z', payload)]).labs).toEqual([]);
    expect(() => transform(null as any, '2025-06-01')).not.toThrow();
    expect(() => transform([], 'invalid')).not.toThrow();
  });
  test('an offset-free spring-forward wall time is preserved as written', () => {
    const rows = map([doc('a', '2025-03-09T21:00:00Z', {
      v: { type: 'vitals', taken: '2025-03-09T02:15', heart_rate_bpm: 80 },
    })]).vitals;
    expect(rows[0].local_time).toBe('2025-03-09T02:15');
  });
});
