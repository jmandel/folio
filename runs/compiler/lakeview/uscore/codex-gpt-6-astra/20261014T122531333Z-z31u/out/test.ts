import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from './transform';
import type { FolioItem } from '../in/views/uscore';

type Row = Record<string, any>;
const issuer = 'did:web:lakeview-labs.example';
const day = '2026-01-01';
const at = day + 'T10:00:00-06:00';
function item(id: string, rows: Row[], recorded = at, extra: Partial<FolioItem> = {}): FolioItem {
  return { folio: '0.1', id, issuer, patient: 'test', effective: recorded, recorded,
    narrative: '', payload: Object.fromEntries(rows.map((r, i) => ['e' + i, r])), ...extra };
}
function lab(id: string, results: Row[] = [], extra: Partial<FolioItem> = {}, order: Row = {}): FolioItem {
  return item(id, [
    { type: 'LAB_REQ', REQ_ID: 'req-' + id, COLLECTED_AT: at, RECEIVED_AT: at },
    { type: 'LAB_ORDER', REQ_ID: 'req-' + id, ORDER_ID: 'order-' + id,
      ORDER_CODE: 'LK-K', ORDER_STATUS: 4, STATUS_AT: at, ACCESSION: 'tube-' + id,
      SPECIMEN_TYPE: 'SER', SPECIMEN_COND: 'OK', ...order },
    ...(results.length ? results : [{}]).map((r, i) => ({
      type: 'LAB_RESULT', ORDER_ID: 'order-' + id, RESULT_ID: id + '-result-' + i,
      TEST_CODE: 'LK-K', TEST_NAME: 'Potassium', VALUE_TEXT: '4.2', VALUE_NUM: 4.2,
      UNIT_CODE: 'mmol/L', RESULT_STATUS: 'F', RESULTED_AT: at, ...r,
    })),
  ], at, extra);
}
function med(rx: string, extra: Row = {}): Row {
  return { type: 'MED_ORDER', RX_ID: rx, VISIT_ID: 'visit', LV_DRUG_ID: 'drug-' + rx,
    DRUG_NAME: 'finerenone 10 mg tablet', DOSE_QTY: 10, DOSE_UNIT: 'mg', ROUTE: 'PO',
    FREQ_CODE: 'QD', MED_STATUS: 1, START_DATE: day, ...extra };
}
function contact(id: string, rows: Row[], when = at, extra: Partial<FolioItem> = {}): FolioItem {
  return item(id, [{ type: 'CLINIC_VISIT', VISIT_ID: 'visit', VISIT_AT: when, VISIT_TYPE: 'FU' }, ...rows], when, extra);
}
function hist(rx: string, status: number, when: string, extra: Row = {}): Row {
  return { type: 'MED_STATUS_HIST', HIST_ID: rx + '-' + when, RX_ID: rx, VISIT_ID: 'visit',
    OLD_STATUS: 1, NEW_STATUS: status, CHANGED_AT: when, REASON_CODE: 'LAB', ...extra };
}
const run = (items: FolioItem[], asOf = '2026-12-31') => transform(items, asOf);
const tests: [string, () => void][] = [];
const test = (name: string, fn: () => void) => tests.push([name, fn]);

test('sample output and historical medication status', () => {
  const groups = JSON.parse(readFileSync('in/samples/samples.json', 'utf8'));
  assert.equal(run(groups[0].items).medicationRequests[0].status, 'on-hold');
  assert.equal(run(groups[0].items, '2026-01-26').medicationRequests.length, 0);
  const initial = run(groups[0].items, '2026-01-27').medicationRequests[0];
  assert.equal(initial.status, 'active');
  assert.equal(initial.authoredOn, '2026-01-28'); // Published future starts remain in scope.
  assert.equal(initial.medicationCodeableConcept.text, 'finerenone 10 mg tablet (finerenone)');
  const labs = run(groups[1].items).observations;
  assert.equal(labs.length, 35);
  assert(!labs.some(o => o.code.text === 'potassium' && o.effectiveDateTime.startsWith('2024')));
  assert(labs.some(o => o.method?.text === 'ckd-epi-2009' && o.code.coding?.[0].code === '48642-3' && o.valueQuantity.value === 60 && o.valueQuantity.comparator === '>'));
  assert(labs.some(o => o.code.text === 'ldl' && o.valueQuantity.value === 144));
  assert(labs.some(o => o.code.text === 'platelets' && o.valueQuantity.value === 259 && o.valueQuantity.code === '10*3/uL'));
});

test('Chicago end-of-day boundaries in both offsets and at DST transitions', () => {
  for (const [asOf, last, next] of [
    ['2026-01-01', '2026-01-02T05:59:59.999Z', '2026-01-02T06:00:00Z'],
    ['2026-07-01', '2026-07-02T04:59:59.999Z', '2026-07-02T05:00:00Z'],
    ['2026-03-08', '2026-03-09T04:59:59.999Z', '2026-03-09T05:00:00Z'],
    ['2026-11-01', '2026-11-02T05:59:59.999Z', '2026-11-02T06:00:00Z'],
  ]) {
    assert.equal(run([lab('yes', [], { recorded: last }), lab('no', [], { recorded: next })], asOf).observations.length, 1);
  }
});

test('corrections are time-scoped, transitive, and not undone by retracting the replacement', () => {
  const a = lab('a');
  const b = lab('b', [], { recorded: '2026-01-02T10:00:00-06:00', supersedes: ['a'] });
  const c = lab('c', [], { recorded: '2026-01-03T10:00:00-06:00', supersedes: ['b'] });
  const d = item('d', [], '2026-01-04T10:00:00-06:00', { retracts: ['c'] });
  assert.equal(run([d, c, b, a], day).observations[0].id, 'obs-a-result-0');
  assert.equal(run([d, c, b, a], '2026-01-02').observations[0].id, 'obs-b-result-0');
  assert.equal(run([d, c, b, a], '2026-01-03').observations[0].id, 'obs-c-result-0');
  assert.equal(run([d, c, b, a]).observations.length, 0);
  assert.equal(run([a, item('foreign', [], at, { issuer: 'did:web:other', retracts: ['a'] })]).observations.length, 1);
});

test('result validity is separate from workflow and hemolysis; repeats remain separate', () => {
  const a = lab('a', [], {}, { SPECIMEN_COND: 'HEM' });
  const b = lab('b', [], {}, { REPEAT_OF_ORDER_ID: 'order-a', REPEAT_REASON: 'CONF' });
  assert.equal(run([a, b]).observations.length, 2);
  const amended = lab('amended', [{ RESULT_STATUS: 'A', VALUE_TEXT: '5.1' }]);
  const corrected = lab('corrected', [{ RESULT_STATUS: 'C', REPLACED_BY_RESULT_ID: 'absent' }]);
  const skipped = lab('skipped', [{ RESULT_STATUS: 'X' }]);
  const voidOrder = lab('void', [], {}, { ORDER_STATUS: 9 });
  const cancelled = lab('cancelled', [], {}, { ORDER_STATUS: 5 });
  const preliminary = lab('prelim', [{ RESULT_STATUS: 'P' }], {}, { ORDER_STATUS: 3 });
  const observations = run([amended, corrected, skipped, voidOrder, cancelled, preliminary]).observations;
  assert.equal(observations.length, 2);
  assert(observations.some(o => o.status === 'final' && o.valueQuantity.value === 5.1));
  assert(observations.some(o => o.status === 'preliminary'));
});

test('VALUE_TEXT is authoritative, including comparators and nonnumeric results', () => {
  const observations = run([lab('a', [
    { VALUE_TEXT: ' >= 6.2 ', VALUE_NUM: 9999999 },
    { VALUE_TEXT: '<0.1', VALUE_NUM: 9999999 },
    { VALUE_TEXT: '4.4', VALUE_NUM: 100 },
    { VALUE_TEXT: 'See comment', VALUE_NUM: 4 },
    { VALUE_TEXT: '', VALUE_NUM: 0 },
    { VALUE_TEXT: 'Infinity' },
    { VALUE_TEXT: '4.1 mg/dL' },
    { VALUE_TEXT: '4.1', UNIT_CODE: 'mg/dL' },
  ])]).observations;
  assert.deepEqual(observations.map(o => [o.valueQuantity.value, o.valueQuantity.comparator]), [[6.2, '>='], [0.1, '<'], [4.4, undefined]]);
});

test('eGFR method notes override code, race variant excluded, source LOINC preserved', () => {
  const observations = run([lab('egfr', [
    { TEST_CODE: 'LK-EGFR09N', UNIT_CODE: 'mL/min/1.73m2', LOINC: '48642-3', COMMENT_TEXT: 'Calculated by CKD-EPI 2009.', VALUE_TEXT: '>60' },
    { TEST_CODE: 'LK-EGFR09A', UNIT_CODE: 'mL/min/1.73m2', VALUE_TEXT: '90' },
    { TEST_CODE: 'LK-EGFR21', UNIT_CODE: 'mL/min/1.73m2', COMMENT_TEXT: 'Calculated by MDRD equation.' },
  ])]).observations;
  assert.equal(observations.length, 2);
  assert.equal(observations[0].method?.text, 'ckd-epi-2009');
  assert.equal(observations[0].code.coding?.[0].code, '48642-3');
  assert.equal(observations[0].valueQuantity.code, 'mL/min/{1.73_m2}');
  assert.equal(observations[1].method?.text, 'mdrd');
});

test('known local codes work without LOINC; panels and unknown local codes do not become results', () => {
  const observations = run([lab('panel', [
    { TEST_CODE: 'LK-WBC', UNIT_CODE: 'K/uL', VALUE_TEXT: '8.2' },
    { TEST_CODE: 'LK-PLT', UNIT_CODE: 'K/uL', VALUE_TEXT: '212' },
    { TEST_CODE: 'LK-HGB', UNIT_CODE: 'g/dL', VALUE_TEXT: '13.4' },
    { TEST_CODE: 'LK-CBC', UNIT_CODE: 'K/uL' },
    { TEST_CODE: 'new-unknown-test', LOINC: '2823-3' },
  ], {}, { ORDER_CODE: 'LK-CBC' })]).observations;
  assert.equal(observations.length, 3);
  assert.equal(observations[1].valueQuantity.value, 212);
  assert.equal(observations[1].valueQuantity.code, '10*3/uL');
  assert.equal(observations[1].code.coding?.[0].code, '777-3');
});

test('duplicate results prefer advanced status, without collapsing separate results', () => {
  const final = lab('f', [{ RESULT_ID: 'same', VALUE_TEXT: '4.3' }]);
  const prelim = lab('p', [{ RESULT_ID: 'same', RESULT_STATUS: 'P', VALUE_TEXT: '4.1' }], { recorded: '2026-01-02T10:00:00-06:00' });
  assert.equal(run([final, prelim]).observations.length, 1);
  assert.equal(run([prelim, final]).observations[0].valueQuantity.value, 4.3);
  const withdrawn = lab('c', [{ RESULT_ID: 'same', RESULT_STATUS: 'C' }]);
  assert.equal(run([final, prelim, withdrawn]).observations.length, 0);
  assert.equal(run([final, final]).observations.length, 1);
});

test('holds persist after planned review and omission from subsequent contacts; resume is explicit', () => {
  const initial = contact('initial', [med('r')]);
  const heldAt = '2026-02-01T12:00:00-06:00';
  const hold = contact('hold', [hist('r', 3, heldAt, { REVIEW_DATE: '2026-02-10', COMMENT_TEXT: 'K elevated' })], heldAt);
  const unrelated = contact('later', [], '2026-03-01T12:00:00-06:00');
  const held = run([unrelated, initial, hold]).medicationRequests[0];
  assert.equal(held.status, 'on-hold');
  assert.equal(held.authoredOn, day);
  assert.deepEqual(held.statusReason, [{ text: 'K elevated' }]);
  const resumeAt = '2026-04-02T02:00:00Z';
  const resume = contact('resume', [hist('r', 1, resumeAt)], resumeAt);
  const active = run([resume, hold, initial]).medicationRequests[0];
  assert.equal(active.status, 'active');
  assert.equal(active.authoredOn, '2026-04-01');
  assert.equal(active.statusReason, undefined);
  assert.equal(run([hold, initial, item('retract', [], '2026-03-01T12:00:00-06:00', { retracts: ['hold'] })]).medicationRequests[0].status, 'active');
});

test('latest own medication event wins across strengths and invalid orders never suppress valid orders', () => {
  const old = contact('old', [med('old', { DRUG_NAME: 'losartan potassium 25 mg tablet' })]);
  const newer = contact('new', [med('new', { DRUG_NAME: 'losartan 50 mg tablet', DOSE_QTY: 50 })], '2026-02-01T12:00:00-06:00');
  assert.equal(run([old, newer]).medicationRequests.length, 1);
  assert.equal(run([old, newer]).medicationRequests[0].id, 'med-new');
  const last = '2026-03-01T12:00:00-06:00';
  const oldStop = contact('old-stop', [hist('old', 2, last, { REASON_CODE: 'ADR', COMMENT_TEXT: 'Side effect' })], last);
  const stopped = run([oldStop, newer, old]).medicationRequests[0];
  assert.equal(stopped.id, 'med-old');
  assert.equal(stopped.status, 'stopped');
  assert.equal(stopped.statusReason?.[0].coding?.[0].code, 'adverse_reaction');
  const errorOrder = contact('error', [med('error', { MED_STATUS: 9, DRUG_NAME: 'losartan 100 mg tablet' })], '2026-04-01T12:00:00-05:00');
  assert.equal(run([errorOrder, newer, old]).medicationRequests[0].id, 'med-new');
  const voidNew = contact('void-new', [hist('new', 9, last)], last);
  assert.equal(run([voidNew, newer, old]).medicationRequests[0].id, 'med-old');
});

test('brand and generic grouping, product RxNorm, no fabricated sig, and dose UCUM', () => {
  const initial = contact('a', [med('brand', { DRUG_NAME: 'Jardiance 10 mg tablet', RXNORM: 'source-product-cui' })]);
  const generic = contact('b', [med('generic', { DRUG_NAME: 'empagliflozin 25 mg tablet', RXNORM: 'new-product-cui' })], '2026-02-01T10:00:00-06:00');
  const medication = run([generic, initial]).medicationRequests[0];
  assert.equal(run([generic, initial]).medicationRequests.length, 1);
  assert.deepEqual(medication.medicationCodeableConcept, { text: 'empagliflozin 25 mg tablet', coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: 'new-product-cui' }] });
  assert.equal(medication.intent, 'order');
  assert.equal(medication.reportedBoolean, false);
  assert.equal(medication.dosageInstruction?.[0].text, undefined);
  const units = run([contact('units', [
    med('insulin', { DRUG_NAME: 'insulin glargine 100 unit/mL injection', DOSE_QTY: 20, DOSE_UNIT: 'unit', ROUTE: 'SC', FREQ_CODE: 'QHS' }),
    med('calcitriol', { DRUG_NAME: 'calcitriol 0.25 mcg capsule', DOSE_QTY: 0.25, DOSE_UNIT: 'mcg' }),
    med('iv', { DRUG_NAME: 'iron sucrose injection', ROUTE: 'IV' }),
  ])]).medicationRequests;
  assert.equal(units.length, 2);
  assert(units.some(m => m.dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.code === '[iU]'));
  assert(units.some(m => m.dosageInstruction?.[0].doseAndRate?.[0].doseQuantity.code === 'ug'));
  const metoprolol = run([contact('metoprolol', [med('brand', { DRUG_NAME: 'Toprol XL 25 mg tablet' }), med('generic', { DRUG_NAME: 'metoprolol succinate 50 mg tablet' })])]);
  assert.equal(metoprolol.medicationRequests.length, 1);
});

test('unchanged inputs, deterministic permutations, valid unique bounded identifiers', () => {
  const ids = ['a/b', 'a_b', 'a-b', 'x'.repeat(100) + 'a', 'x'.repeat(100) + 'b'];
  const input = ids.map(id => lab(id));
  input.push(contact('meds', [med('a/b'), med('a_b', { DRUG_NAME: 'calcitriol 1 mcg capsule' })]));
  const before = JSON.stringify(input);
  const output = run(input);
  assert.equal(JSON.stringify(input), before);
  const permuted = [...input].reverse().map(i => ({ ...i, payload: Object.fromEntries(Object.entries(i.payload).reverse()) }));
  assert.deepEqual(run(permuted), output);
  const allIds = [...output.observations, ...output.medicationRequests].map(r => r.id);
  assert.equal(new Set(allIds).size, allIds.length);
  assert(allIds.every(id => /^[A-Za-z0-9.-]{1,64}$/.test(id)));
});

test('malformed input is skipped without throwing', () => {
  const bad: any[] = [null, undefined, false, 10, 'item', [], {}, { recorded: at },
    item('bad', [], 'invalid'), item('null', [], at, { payload: null as any }),
    item('badrows', [], at, { payload: { null: null, array: [], bad: { type: 'LAB_RESULT', VALUE_TEXT: {} } } }),
  ];
  assert.deepEqual(run(bad), { medicationRequests: [], observations: [] });
  assert.deepEqual(run(null as any), { medicationRequests: [], observations: [] });
  assert.deepEqual(run([lab('okay')], '2026-02-30'), { medicationRequests: [], observations: [] });
  assert.deepEqual(run([lab('okay')], null as any), { medicationRequests: [], observations: [] });
  assert.equal(run([lab('bad', [{ VALUE_TEXT: {}, VALUE_NUM: 4 }])]).observations.length, 0);
});

for (const [name, fn] of tests) { fn(); console.log('PASS', name); }
console.log(`${tests.length} test groups passed`);
