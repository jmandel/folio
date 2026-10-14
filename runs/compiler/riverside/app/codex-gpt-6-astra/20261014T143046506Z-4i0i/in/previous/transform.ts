import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow,
  AllergyIntoleranceRow, LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// All parsing is deliberately local: Riverside's structured entries are the
// authority. In particular, narrative-only medicines and diagnoses are not rows.
type Obj = Record<string, unknown>;
type Doc = { item: FolioItem; entries: Entry[]; enc?: Obj; time: number };
type Entry = { id: string; data: Obj };
type Ref = { doc: Doc; entry: Entry };
const object = (v: unknown): v is Obj => v !== null && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown): string => typeof v === "string" ? v.trim() : "";
const num = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (...parts: unknown[]): string => JSON.stringify(parts);
function lookup<T>(table: Record<string, T>, name: string): T | undefined {
  return Object.prototype.hasOwnProperty.call(table, name) ? table[name] : undefined;
}
const evidence = (r: Ref): Evidence => [{ item_id: r.doc.item.id, entry_id: r.entry.id }];
function unionEvidence(...lists: Evidence[]): Evidence {
  const m = new Map<string, Evidence[number]>();
  for (const list of lists) for (const e of list) m.set(key(e.item_id, e.entry_id), e);
  return [...m.values()].sort((a, b) => cmp(key(a.item_id, a.entry_id), key(b.item_id, b.entry_id)));
}

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function wall(ms: number): string | undefined {
  if (!Number.isFinite(ms)) return;
  try {
    const parts: Record<string, string> = {};
    for (const p of chicago.formatToParts(new Date(ms))) parts[p.type] = p.value;
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
  } catch { return; }
}
function validDay(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const t = Date.parse(`${s}T12:00:00Z`);
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === s;
}
function localTime(value: unknown): string | undefined {
  const s = str(value);
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/i.exec(s);
  if (!m || !validDay(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] || 0) > 59) return;
  if (!m[5]) return `${m[1]}T${m[2]}:${m[3]}:${m[4] || "00"}`;
  return wall(Date.parse(s.replace(" ", "T")));
}
function instant(value: unknown): number {
  const s = str(value);
  const local = localTime(s);
  if (!local) return NaN;
  if (/(Z|[+-]\d{2}:?\d{2})$/i.test(s)) return Date.parse(s.replace(" ", "T"));
  // Offset-free input means Chicago, never the process's time zone. Choose the
  // earlier occurrence of a repeated fall-back time deterministically.
  const naive = Date.parse(`${local}Z`);
  const choices = [naive + 5 * 3600000, naive + 6 * 3600000];
  return choices.find(t => wall(t) === local) ?? NaN;
}
function rfc3339(value: unknown): string | undefined {
  const t = instant(value);
  return Number.isFinite(t) ? new Date(t).toISOString() : undefined;
}
function partialDate(value: unknown): ProblemRow["onset"] {
  const s = str(value);
  if (/^\d{4}$/.test(s)) return { value: s, precision: "year" };
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(s)) return { value: s, precision: "month" };
  if (validDay(s)) return { value: s, precision: "day" };
  // "childhood", "~10 years", and approximate years are not exact dates.
  return undefined;
}
function compareDoc(a: Doc, b: Doc): number {
  return a.time - b.time || cmp(a.item.issuer, b.item.issuer) || cmp(a.item.id, b.item.id);
}
function compareRef(a: Ref, b: Ref): number {
  return compareDoc(a.doc, b.doc) || cmp(a.entry.id, b.entry.id);
}
function currentDocuments(items: FolioItem[], asOf: string): Doc[] {
  if (!Array.isArray(items) || !validDay(asOf)) return [];
  const scope: FolioItem[] = [];
  for (const i of items) {
    if (!object(i) || !str(i.id) || !str(i.issuer)) continue;
    // Scope is the record known by this day's end, not measurements taken ON
    // this day. Notes signed after midnight can publish the previous evening's
    // vitals and labs; preserve those measurements at their own actual times.
    const local = localTime(i.recorded);
    if (local && local.slice(0, 10) <= asOf && Number.isFinite(instant(i.recorded))) scope.push(i);
  }
  const removed = new Set<string>();
  // Apply edges from ALL in-scope items, even ones themselves replaced or
  // retracted. Thus A <- B <- C never resurrects A when B ceases to be current.
  for (const i of scope) for (const field of [i.supersedes, i.retracts]) {
    if (Array.isArray(field)) for (const id of field) {
      if (typeof id === "string" && id !== i.id) removed.add(key(i.issuer, id));
    }
  }
  const docs: Doc[] = [];
  const seen = new Set<string>();
  for (const i of scope.sort((a, b) => cmp(key(a.issuer, a.id), key(b.issuer, b.id)))) {
    const id = key(i.issuer, i.id);
    if (removed.has(id) || seen.has(id)) continue;
    seen.add(id);
    const entries: Entry[] = object(i.payload) ? Object.keys(i.payload).sort().flatMap(id => {
      const data: unknown = i.payload[id];
      return object(data) ? [{ id, data }] : [];
    }) : [];
    docs.push({ item: i, entries, enc: entries.find(e => e.data.type === "encounter")?.data, time: instant(i.recorded) });
  }
  return docs.sort(compareDoc);
}

function sensitivity(text: string): Sensitivity[] | undefined {
  const result: Sensitivity[] = [];
  if (/\b(depressi(?:on|ve)|bipolar|schizophren\w*|anxiety|ptsd|post.?traumatic stress|mental health|sertraline|escitalopram|fluoxetine)\b/i.test(text)) result.push("mental-health");
  if (/\b(substance use|alcohol use disorder|opioid use disorder|alcohol dependence|drug dependence|addiction)\b/i.test(text)) result.push("substance-use");
  if (/\b(pregnan\w*|contracepti\w*|infertility|erectile dysfunction|abortion)\b/i.test(text)) result.push("sexual-reproductive-health");
  if (/\b(HIV|AIDS|syphilis|gonorrhea|chlamydia|sexually transmitted)\b/i.test(text)) result.push("hiv-sti");
  if (/\b(BRCA[12]?|cystic fibrosis|Huntington\w*|genetic|hereditary hemochromatosis)\b/i.test(text)) result.push("genetic");
  return result.length ? result : undefined;
}

// Name normalization never manufactures an RxNorm code. Codes in rows are
// copied only from the source's explicitly ingredient-level field.
const brands: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", forxiga: "dapagliflozin",
  invokana: "canagliflozin", steglatro: "ertugliflozin", glucophage: "metformin",
  glumetza: "metformin", fortamet: "metformin", cozaar: "losartan",
  prinivil: "lisinopril", zestril: "lisinopril", microzide: "hydrochlorothiazide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro",
  novolog: "insulin aspart", novorapid: "insulin aspart", humulin: "insulin human",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  norvasc: "amlodipine", lasix: "furosemide", eliquis: "apixaban", coumadin: "warfarin",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  januvia: "sitagliptin", ozempic: "semaglutide", rybelsus: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", zoloft: "sertraline",
  lexapro: "escitalopram", prozac: "fluoxetine", synthroid: "levothyroxine",
  synjardy: "empagliflozin / metformin", janumet: "sitagliptin / metformin",
  hyzaar: "losartan / hydrochlorothiazide",
};
function ingredient(name: unknown): string | undefined {
  let s = str(name).toLowerCase();
  if (!s || /^(?:unknown|unspecified|water pill|blood pressure pill|diabetes pill|medication)(?:\b|$)/.test(s)) return;
  for (const [brand, generic] of Object.entries(brands)) {
    if (new RegExp(`\\b${brand}\\b`).test(s)) return generic;
  }
  s = s.replace(/\([^)]*\)/g, " ")
    .replace(/\bU[ -]?(?:100|200|300|500)\b/gi, "")
    .replace(/\b(?:\d+(?:\.\d+)?|\.\d+)(?:\s*\/\s*\d+(?:\.\d+)?)*\s*(?:mg|mcg|ug|g|ml|units?|iu|%|meq)\b.*$/i, "")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|oral|subcutaneous|injection|injectable|solution|suspension|tablets?|capsules?|caps?|tabs?|inhaler|cream|ointment|patch|pen|vial|iv infusion|xr|er|sr|dr|po)\b.*$/i, "")
    .replace(/\b(?:hydrochloride|hcl|besylate|succinate|tartrate|maleate|fumarate|mesylate)\b/g, "")
    .replace(/\b(losartan|diclofenac) potassium\b/g, "$1")
    .replace(/\b(levothyroxine|naproxen|diclofenac) sodium\b/g, "$1")
    .replace(/\s+/g, " ").replace(/[ ,;.-]+$/, "").trim();
  return s || undefined;
}
function ingredients(e: Obj): string[] {
  const name = ingredient(e.drug_name);
  return name ? name.split(/\s*\/\s*|\s+and\s+/).filter(Boolean) : [];
}
function dose(e: Obj, component?: number, count = 1): MedicationRow["dose"] {
  let s = str(e.dose_text).toLowerCase().replace(/[μµ]/g, "u");
  if (/\b(?:sliding|scale|per protocol|titrate|or|to)\b|\d\s*[-–]\s*\d|\/(?:kg|h|hr|day)\b/.test(s)) return;
  if (count > 1) {
    const m = /^([\d.]+(?:\s*\/\s*[\d.]+)+)\s*(mg|mcg|g)$/.exec(s);
    if (!m) return;
    const amounts = m[1].split(/\s*\/\s*/);
    if (amounts.length !== count || component === undefined) return;
    s = `${amounts[component]} ${m[2]}`;
  }
  // More than one specified amount is not one dose (e.g. 1 tablet AM, 2 PM).
  if ((s.match(/\d+(?:\.\d+)?\s*(?:mg|mcg|units?|ml|tabs?|tablets?|capsules?)\b/g) || []).length > 1) return;
  const m = /^(\d+(?:\.\d+)?|\.\d+|\d+\/\d+)\s*(mg|milligrams?|mcg|ug|micrograms?|g|grams?|units?|unt|iu|\[iu\]|ml|milliliters?|tabs?|tablets?|caps?|capsules?)(?=\s|$|[,;])/i.exec(s);
  if (!m) return;
  const value = m[1].includes("/") ? +m[1].split("/")[0] / +m[1].split("/")[1] : +m[1];
  if (!Number.isFinite(value) || value < 0) return;
  const u = m[2];
  if (/^(mg|milligram)/.test(u)) return { value, unit: "mg" };
  if (/^(mcg|ug|microgram)/.test(u)) return { value, unit: "mcg" };
  if (/^(g|grams?)$/.test(u)) return { value: value * 1000, unit: "mg" };
  if (/^(unit|unt|iu|\[iu\])/.test(u)) return { value, unit: "units" };
  if (/^(ml|milliliter)/.test(u)) return { value, unit: "mL" };
  const strength = /(?:^|\s)(\d+(?:\.\d+)?|\.\d+)\s*(mg|mcg|ug|g)\b/i.exec(str(e.drug_name));
  if (strength) {
    const unit = strength[2].toLowerCase();
    return { value: value * +strength[1] * (unit === "g" ? 1000 : 1), unit: /mcg|ug/.test(unit) ? "mcg" : "mg" };
  }
  return { value, unit: "tablet" };
}
function frequency(value: unknown): MedicationRow["frequency"] {
  const s = str(value).toLowerCase().replace(/\b(?:[bqt]\.i\.d\.?|q\.d\.?|q\.h\.s\.?)/g, x => x.replace(/\./g, ""));
  if (!s) return;
  if (/\b(prn|as needed|when needed)\b/.test(s)) return "PRN";
  if (/\b(qid|qod|four times|every other|every \d+ (?:days|weeks)|alternat\w*|(?:twice|three times) (?:a week|weekly))\b/.test(s)) return "other";
  if (/\b(qw|qwk|weekly|once a week|every week)\b/.test(s)) return "QW";
  if (/\b(bid|twice (?:a day|daily)|two times (?:a day|daily)|q12h|every 12 hours)\b/.test(s)) return "BID";
  if (/\b(tid|three times (?:a day|daily)|q8h|every 8 hours)\b/.test(s)) return "TID";
  if (/\b(qhs|at bedtime|nightly|every night)\b/.test(s)) return "QHS";
  if (/\b(qd|daily|once a day|q24h|every (?:day|morning)|each morning)\b/.test(s)) return "QD";
  if (/\b(qid|qod|every|times|once|twice|weekly|monthly|alternat\w*|with meals)\b|\bq\d+h\b/.test(s)) return "other";
  return undefined;
}
function stopReason(value: string): MedicationRow["stop_reason"] {
  if (!value) return;
  if (/ineffective|not (?:effective|working)|lack of (?:effect|benefit)/i.test(value)) return "ineffective";
  if (/patient (?:choice|request|declin|prefer)|declined|does not want/i.test(value)) return "patient_choice";
  if (/course (?:is )?(?:complete|finished)|completed (?:the |a )?course|therapy complete/i.test(value)) return "course_complete";
  if (/replac|switch|changed to|alternative therapy/i.test(value)) return "therapy_changed";
  if (/adverse|side effect|reaction|intoleran|due to (?:cough|rash|angioedema|hyperkalemia|hypoglycemia|ketoacidosis|lactic acidosis)|caus(?:ed|ing)/i.test(value)) return "adverse_reaction";
  // A bare instruction is not a recorded reason for stopping.
  if (/\b(?:because|due to|for|reason)\b/i.test(value)) return "other";
  return undefined;
}
function medicationSnapshot(docs: Doc[]): Doc | undefined {
  const encounters = new Map<string, Doc[]>();
  for (const doc of docs) {
    if (!doc.enc) continue;
    const id = key(doc.item.issuer, str(doc.enc.encounter_id) || doc.item.id);
    const group = encounters.get(id) || [];
    group.push(doc); encounters.set(id, group);
  }
  const snapshots: { doc: Doc; start: number }[] = [];
  for (const group of encounters.values()) {
    const discharges = group.filter(d => d.enc?.document_kind === "discharge_summary");
    const doc = (discharges.length ? discharges : group).slice().sort(compareDoc).at(-1)!;
    const starts = group.flatMap(d => [instant(d.enc?.arrived), instant(d.enc?.admitted)]).filter(Number.isFinite);
    const fallback = group.map(d => instant(d.item.effective)).filter(Number.isFinite);
    snapshots.push({ doc, start: (starts.length ? starts : fallback.length ? fallback : group.map(d => d.time)).reduce((a, b) => Math.min(a, b), Infinity) });
  }
  // A late correction of an old stay must not replace a subsequent stay's list.
  return snapshots.sort((a, b) => a.start - b.start || compareDoc(a.doc, b.doc)).at(-1)?.doc;
}
function medications(docs: Doc[]): MedicationRow[] {
  const doc = medicationSnapshot(docs);
  if (!doc) return [];
  const rows = new Map<string, MedicationRow>();
  const statuses: Record<string, MedicationRow["status"]> = {
    not_reconciled: "unknown", continue: "active", held: "held", stopped: "stopped", new: "active", changed: "active",
  };
  const priority: Record<string, number> = { stopped: 0, not_reconciled: 1, held: 2, continue: 3, new: 4, changed: 4 };
  for (const entry of doc.entries.slice().sort((a, b) => (lookup(priority, str(a.data.status)) ?? 0) -
    (lookup(priority, str(b.data.status)) ?? 0) || cmp(a.id, b.id))) {
    const e = entry.data, name = str(e.drug_name);
    if (e.type !== "home_med" || !name) continue;
    const status = lookup(statuses, str(e.status));
    if (!status) continue;
    const names = ingredients(e);
    for (const [index, generic] of (names.length ? names : [undefined]).entries()) {
      const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: evidence({ doc, entry }) };
      if (generic) row.ingredient = generic;
      if (str(e.rxnorm_ingredient) && names.length <= 1) row.rxnorm_ingredient = str(e.rxnorm_ingredient);
      const amount = dose(e, index, names.length);
      if (amount && Number.isFinite(amount.value)) row.dose = amount;
      const freq = frequency(e.sig);
      if (freq) row.frequency = freq;
      if ((status === "held" || status === "stopped") && str(e.instructions)) row.status_reason_text = str(e.instructions);
      if (status === "stopped") {
        const reason = stopReason(str(e.instructions));
        if (reason) row.stop_reason = reason;
      }
      // No start/hold date is supplied on HomeMed. A repeated observation date
      // does not establish when the status began, so status_since is omitted.
      const sensitive = sensitivity(name);
      if (sensitive) row.sensitivity = sensitive;
      const id = row.rxnorm_ingredient ? `rx:${row.rxnorm_ingredient}` : generic || name.toLowerCase();
      rows.delete(id);
      rows.set(id, row);
    }
  }
  // Resolve a coded and uncoded spelling of the same ingredient in one snapshot.
  const byName = new Map<string, MedicationRow>();
  for (const row of rows.values()) {
    const id = row.ingredient || row.drug_name.toLowerCase();
    byName.set(id, row);
  }
  return [...byName.values()];
}

function diagnosisLabel(e: Obj): string { return str(e.type === "history" ? e.condition : e.label); }
function icd(e: Obj): string {
  const s = str(e.icd10cm).toUpperCase();
  return /^[A-Z]\d{2}[A-Z0-9]+$/.test(s) ? `${s.slice(0, 3)}.${s.slice(3)}` : s;
}
function localDx(e: Obj): string { return object(e.riverside_dx) ? str(e.riverside_dx.code) : ""; }
function diagnosisText(e: Obj): string {
  return `${diagnosisLabel(e)} ${object(e.riverside_dx) ? str(e.riverside_dx.name) : ""}`.trim();
}
function conditionName(e: Obj): string {
  return diagnosisLabel(e).toLowerCase().replace(/\b(?:r\/o|rule[ -]?out|suspected|possible|probable|working diagnosis|history of|resolved)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim();
}
function family(e: Obj): string {
  const text = diagnosisText(e), code = icd(e);
  if (/^N18\./.test(code) || /\b(?:ckd|chronic (?:kidney|renal) (?:disease|failure))\b/i.test(text)) return "ckd";
  if (/^N17\./.test(code) || /\b(?:aki|acute (?:kidney injury|renal failure))\b/i.test(text)) return "aki";
  if (/\b(?:dka|ketoacidosis)\b/i.test(text) || /^E(?:08|09|10|11|13)\.1/.test(code)) return "ketoacidosis";
  if (code === "E87.5" || /^hyperkal[ae]mia$/i.test(text)) return "hyperkalemia";
  if (code === "I10" || /^(?:essential |primary )?hypertension$/i.test(text)) return "hypertension";
  if (/^E11\.(?:9|65)$/.test(code) || /^(?:type (?:2|ii) diabetes(?: mellitus)?|diabetes mellitus,? type (?:2|ii))$/i.test(text)) return "type2-diabetes";
  return "";
}
function sameCondition(a: Obj, b: Obj): boolean {
  const la = localDx(a), lb = localDx(b);
  if (la && lb && la !== lb) return false; // ICD can be deliberately coarser than Riverside's code.
  if (la && la === lb) return true;
  if (family(a) && family(a) === family(b)) return true;
  if (icd(a) && icd(a) === icd(b)) return true;
  return !!conditionName(a) && conditionName(a) === conditionName(b);
}
function asserted(e: Obj): boolean {
  return e.type === "history" || e.status === "active" || e.status === "resolved";
}
function confirmed(group: Ref[]): Ref[] {
  const byEncounter = new Map<string, Ref[]>();
  for (const r of group) {
    const id = key(r.doc.item.issuer, str(r.doc.enc?.encounter_id) || r.doc.item.id);
    const refs = byEncounter.get(id) || [];
    refs.push(r); byEncounter.set(id, refs);
  }
  const eligible = new Set<Ref>();
  for (const refs of byEncounter.values()) {
    // Ruling out a suspected recurrence does not erase a confirmed past episode
    // in a different stay. Within the same stay the final exclusion wins.
    if (refs.at(-1)?.entry.data.status !== "ruled_out") for (const r of refs) if (asserted(r.entry.data)) eligible.add(r);
  }
  return group.filter(r => eligible.has(r));
}
function bareAdverseEffect(e: Obj): boolean {
  const text = diagnosisLabel(e);
  return /^(?:adverse (?:effect|reaction)|drug (?:reaction|adverse effect)|allergy to|intolerance to)\b/i.test(text)
    && !/\b(?:ketoacidosis|\bdka\b|acidosis|angioedema|anaphylaxis|rash|hives|cough|hyperkalemia|hypoglycemia|kidney injury|renal failure|hepatitis|pancreatitis|bleeding|rhabdomyolysis)\b/i.test(text);
}
function problemGroups(docs: Doc[]): Ref[][] {
  const groups: Ref[][] = [];
  for (const doc of docs) for (const entry of doc.entries) {
    const e = entry.data;
    if (!['diagnosis', 'history'].includes(str(e.type)) || !diagnosisLabel(e)) continue;
    if (e.type === "diagnosis" && !["working", "ruled_out", "active", "resolved"].includes(str(e.status))) continue;
    let group = groups.find(g => g.some(r => sameCondition(r.entry.data, e)) &&
      !g.some(r => localDx(e) && localDx(r.entry.data) && localDx(e) !== localDx(r.entry.data)));
    if (!group) { group = []; groups.push(group); }
    group.push({ doc, entry });
  }
  return groups.map(g => g.sort((a, b) => compareDoc(a.doc, b.doc) ||
    (a.entry.data.type === "diagnosis" ? 1 : 0) - (b.entry.data.type === "diagnosis" ? 1 : 0) || cmp(a.entry.id, b.entry.id)));
}
function ckdStage(e: Obj): ProblemRow["ckd_stage"] {
  const text = diagnosisText(e);
  const stage = /\b(?:stage\s*|g)(3a|3b|[1245])\b/i.exec(text)?.[1].toLowerCase();
  if (stage) return `G${stage}` as ProblemRow["ckd_stage"];
  const codes: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
  };
  return codes[icd(e)];
}
function problems(groups: Ref[][]): ProblemRow[] {
  const rows: ProblemRow[] = [];
  for (const group of groups) {
    const established = confirmed(group);
    const r = established.at(-1);
    if (!r || bareAdverseEffect(r.entry.data)) continue;
    const e = r.entry.data;
    const row: ProblemRow = {
      condition: diagnosisLabel(e),
      status: e.status === "resolved" || (e.type === "history" && /\b(?:history of|resolved|remote|past episode)\b/i.test(diagnosisLabel(e))) ? "resolved" : "active",
      evidence: evidence(r),
    };
    if (icd(e)) row.icd10cm = icd(e);
    // A prior explicit onset is still evidence; absence in a later note does not
    // turn a year into a day, or make the most recent visit the onset.
    const onsetRef = [...established].reverse().find(x => partialDate(x.entry.data.onset_text));
    if (onsetRef) {
      row.onset = partialDate(onsetRef.entry.data.onset_text);
      row.evidence = unionEvidence(row.evidence, evidence(onsetRef));
    }
    if (family(e) === "ckd") {
      const staged = [...established].reverse().find(x => ckdStage(x.entry.data));
      if (staged) { row.ckd_stage = ckdStage(staged.entry.data); row.evidence = unionEvidence(row.evidence, evidence(staged)); }
      const albumin = [...established].reverse().find(x => /\bA[123]\b/.test(diagnosisText(x.entry.data)));
      if (albumin) {
        row.albuminuria = /\b(A[123])\b/.exec(diagnosisText(albumin.entry.data))![1] as ProblemRow["albuminuria"];
        row.evidence = unionEvidence(row.evidence, evidence(albumin));
      }
    }
    const sensitive = sensitivity(row.condition);
    if (sensitive) row.sensitivity = sensitive;
    rows.push(row);
  }
  return rows;
}

const drugClasses: { pattern: RegExp; member: RegExp }[] = [
  { pattern: /\bSGLT\s*[- ]?2 inhibitors?\b/i, member: /\b(?:empagliflozin|dapagliflozin|canagliflozin|ertugliflozin|bexagliflozin|sotagliflozin)\b/i },
  { pattern: /\b(?:ACE[ -]inhibitors?|angiotensin[ -]converting enzyme inhibitors?)\b/i, member: /\b(?:lisinopril|enalapril|ramipril|benazepril|captopril|quinapril|fosinopril|perindopril|trandolapril|moexipril)\b/i },
  { pattern: /\b(?:NSAIDs?|non[ -]steroidal anti[ -]inflammatory (?:drugs?|agents?))\b/i, member: /\b(?:naproxen|ibuprofen|diclofenac|meloxicam|celecoxib|indomethacin|ketorolac|piroxicam|etodolac|aspirin)\b/i },
  { pattern: /\b(?:ARBs?|angiotensin (?:II |2 )?receptor blockers?)\b/i, member: /\b(?:losartan|valsartan|olmesartan|candesartan|irbesartan|telmisartan|azilsartan|eprosartan)\b/i },
  { pattern: /\bstatins?\b/i, member: /\b(?:atorvastatin|rosuvastatin|simvastatin|pravastatin|lovastatin|fluvastatin|pitavastatin)\b/i },
  { pattern: /\bGLP[ -]?1 (?:receptor )?agonists?\b/i, member: /\b(?:semaglutide|liraglutide|dulaglutide|exenatide|lixisenatide)\b/i },
];
type Culprit = { substance: string; rxnorm?: string; refs: Ref[] };
function escapeRegex(s: string): string { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function culprit(r: Ref): Culprit | undefined {
  const text = diagnosisText(r.entry.data);
  if (!/\b(?:associated|induced|related|caused|due to|from|secondary to|attributed to|adverse (?:effect|reaction)|allergy to|intolerance to)\b/i.test(text)) return;
  if (/\b(?:not (?:due to|associated|caused)|unrelated to|no adverse|without adverse)\b/i.test(text)) return;
  const meds = r.doc.entries.filter(x => x.data.type === "home_med" || x.data.type === "inpatient_med")
    .flatMap(entry => ingredients(entry.data).map(name => ({ name, ref: { doc: r.doc, entry } })));
  const named = meds.filter(m => new RegExp(`\\b${escapeRegex(m.name)}\\b`, "i").test(text));
  const uniqueNamed = [...new Set(named.map(m => m.name))];
  if (uniqueNamed.length === 1) {
    const m = named.find(m => m.name === uniqueNamed[0])!;
    return { substance: m.name, rxnorm: str(m.ref.entry.data.rxnorm_ingredient) || undefined, refs: [m.ref] };
  }
  // Brand names and explicitly named generic drugs can be identified even when
  // the responsible drug is no longer on the same document's medication list.
  const known = new Set(Object.values(brands).flatMap(s => s.split(" / ")));
  for (const brand of Object.keys(brands)) known.add(brand);
  for (const drug of [...known].sort((a, b) => b.length - a.length || cmp(a, b))) {
    if (new RegExp(`\\b${escapeRegex(drug)}\\b`, "i").test(text)) {
      const name = ingredient(drug)!;
      if (name.includes(" / ")) continue;
      const m = meds.find(m => m.name === name);
      return { substance: name, rxnorm: m ? str(m.ref.entry.data.rxnorm_ingredient) || undefined : undefined, refs: m ? [m.ref] : [] };
    }
  }
  for (const cls of drugClasses) {
    const match = cls.pattern.exec(text);
    if (!match) continue;
    const matches = meds.filter(m => cls.member.test(m.name));
    const distinct = [...new Set(matches.map(m => m.name))];
    if (distinct.length === 1) {
      const m = matches.find(m => m.name === distinct[0])!;
      return { substance: m.name, rxnorm: str(m.ref.entry.data.rxnorm_ingredient) || undefined, refs: [m.ref] };
    }
    return { substance: match[0], refs: [] };
  }
  // Only an explicit adverse-effect/allergy assertion establishes an unfamiliar
  // substance. A diagnosis merely "due to sepsis" must not create a drug allergy.
  const m = /(?:adverse (?:effect|reaction) (?:of|to)|allergy to|intolerance to)\s+([^,;()]+)/i.exec(diagnosisLabel(r.entry.data));
  if (m && !/^(?:a |the )?(?:drug|medication)(?:s)?$/i.test(m[1].trim())) {
    const source = m[1].trim();
    const isClass = /\b(?:agents?|drugs?|inhibitors?|blockers?|antibiotics?|antidiabetics?|chemotherapy)\b/i.test(source);
    const name = isClass ? source : ingredient(source);
    if (name) return { substance: name, refs: [] };
  }
  return undefined;
}
function reactionDetails(substance: string, reaction: string, severity: string, diagnosis = false): Pick<AllergyIntoleranceRow, "reaction_type" | "mechanism" | "criticality"> {
  const hyper = /\b(?:hives|urticaria|rash|angioedema|anaphylax\w*|bronchospasm|Stevens.?Johnson|toxic epidermal necrolysis)\b/i.test(reaction);
  const serious = /\b(?:ketoacidosis|DKA|lactic acidosis|hyperkalemia|renal failure|kidney injury|rhabdomyolysis|hepatotoxicity|liver failure|severe hypoglycemia|major bleeding|pancreatitis)\b/i.test(reaction);
  const side = /\b(?:cough|GI upset|nausea|vomiting|diarrhea|constipation|myalgia|muscle aches|headache|dizziness|fatigue|edema)\b/i.test(reaction);
  const reaction_type: AllergyIntoleranceRow["reaction_type"] = hyper ? "hypersensitivity" : serious ? "serious_adverse_event" : side ? "side_effect" : diagnosis ? "serious_adverse_event" : "hypersensitivity";
  const ace = drugClasses[1].member.test(substance) || drugClasses[1].pattern.test(substance);
  let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
  if (/\bnon[ -]immune|bradykinin/i.test(reaction) || (ace && /cough|angioedema/i.test(reaction)) ||
    /ketoacidosis|\bDKA\b|lactic acidosis|hyperkalemia/i.test(reaction) || reaction_type === "side_effect") mechanism = "non_immune";
  else if (/\bIgE|\bT[ -]cell|\bimmune[ -]mediated|positive (?:allergy|skin) test/i.test(reaction)) mechanism = "immune";
  const criticality: AllergyIntoleranceRow["criticality"] = severity === "severe" || serious ||
    /anaphylax\w*|angioedema|bronchospasm|Stevens.?Johnson|toxic epidermal necrolysis|life[ -]threatening/i.test(reaction)
    ? "high" : severity === "mild" || (side && severity !== "moderate") ? "low" : "unknown";
  return { reaction_type, mechanism, criticality };
}
function allergies(docs: Doc[], groups: Ref[][]): AllergyIntoleranceRow[] {
  const rows = new Map<string, AllergyIntoleranceRow>();
  function add(row: AllergyIntoleranceRow): void {
    const id = row.substance.toLowerCase();
    const old = rows.get(id);
    if (!old) { rows.set(id, row); return; }
    const reactions = [...new Set([old.reaction, row.reaction].filter((s): s is string => !!s))];
    const priority = { side_effect: 1, hypersensitivity: 2, serious_adverse_event: 3 };
    const described = old.reaction && !row.reaction ? old : row.reaction && !old.reaction ? row : undefined;
    const severe = described || (priority[row.reaction_type] >= priority[old.reaction_type] ? row : old);
    rows.set(id, {
      ...old, ...row, ...reactionDetails(row.substance, reactions.join("; "), "unknown"),
      reaction_type: severe.reaction_type,
      mechanism: old.mechanism === row.mechanism ? row.mechanism : old.mechanism === "unknown" ? row.mechanism : row.mechanism === "unknown" ? old.mechanism : "unknown",
      criticality: old.criticality === "high" || row.criticality === "high" ? "high" : described ? described.criticality : old.criticality === "unknown" || row.criticality === "unknown" ? "unknown" : "low",
      ...(reactions.length ? { reaction: reactions.join("; ") } : {}),
      evidence: unionEvidence(old.evidence, row.evidence),
    });
  }
  // Allergy entries are repeated complete lists. A subsequent NKDA or empty
  // list replaces earlier allergy-list snapshots, but not a documented drug-
  // caused diagnosis elsewhere in the still-current record.
  const snapshot = docs.filter(d => d.enc).at(-1);
  if (snapshot) for (const entry of snapshot.entries) {
    const e = entry.data;
    const source = str(e.substance);
    if (e.type !== "allergy" || !source || /^(?:NKDA|NKA|no known (?:drug )?allergies)$/i.test(source)) continue;
    const isClass = drugClasses.some(c => c.pattern.test(source)) || /\b(?:penicillins|cephalosporins|sulfonamides|sulfa|antibiotics)\b/i.test(source);
    const isDrug = !!str(e.rxnorm_ingredient) || !!lookup(brands, source.toLowerCase()) || Object.values(brands).includes(source.toLowerCase()) ||
      /(?:cillin|mycin|pril|sartan|statin|gliflozin|prazole|gliptin|semide|oxetine|traline|olol|zepam|azepam|sone|cycline)$/i.test(source);
    const substance = !isClass && isDrug ? ingredient(source) || source.toLowerCase() : source;
    const reaction = str(e.reaction);
    const row: AllergyIntoleranceRow = { substance, ...reactionDetails(substance, reaction, str(e.severity)), evidence: evidence({ doc: snapshot, entry }) };
    if (str(e.rxnorm_ingredient)) row.rxnorm_ingredient = str(e.rxnorm_ingredient);
    if (reaction) row.reaction = reaction;
    add(row);
  }
  for (const group of groups) {
    // A resolved episode still documents an adverse reaction on re-exposure.
    const r = [...confirmed(group)].reverse().find(r => culprit(r));
    if (!r) continue;
    const drug = culprit(r)!;
    const reaction = bareAdverseEffect(r.entry.data) ? "" : diagnosisLabel(r.entry.data);
    const row: AllergyIntoleranceRow = {
      substance: drug.substance, ...reactionDetails(drug.substance, reaction, "unknown", true),
      evidence: unionEvidence(evidence(r), ...drug.refs.map(evidence)),
    };
    if (drug.rxnorm) row.rxnorm_ingredient = drug.rxnorm;
    if (reaction) row.reaction = reaction;
    const onset = partialDate(r.entry.data.onset_text);
    if (onset) row.onset = onset;
    const sensitive = sensitivity(reaction);
    if (sensitive) row.sensitivity = sensitive;
    add(row);
  }
  return [...rows.values()];
}

const units: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const localTests: Record<string, Analyte> = {
  CREAT: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate",
  AGAP: "anion_gap", BUN: "bun", GLU: "glucose", VPH: "ph", VPCO2: "pco2", BHB: "bhb", LIPASE: "lipase",
};
const loincTests: Record<string, Analyte> = {
  "2160-0": "creatinine", "14682-9": "creatinine", "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr", "48642-3": "egfr",
  "2823-3": "potassium", "2951-2": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "10466-1": "anion_gap", "3094-0": "bun", "14937-7": "bun", "2345-7": "glucose", "14749-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "59261-8": "a1c", "14959-1": "uacr", "9318-7": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin",
  "6873-4": "bhb", "53060-3": "bhb", "2744-1": "ph", "2746-6": "ph", "11558-4": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl",
};
function analyte(test: Obj, specimen: string): Analyte | undefined {
  const name = str(test.name), code = str(test.local_code).toUpperCase();
  if (/troponin\s*T\b/i.test(name)) return; // Consumer tracks troponin I only.
  let a: Analyte | undefined = lookup(loincTests, str(test.loinc)) || lookup(localTests, code);
  if (!a) {
    const patterns: [Analyte, RegExp][] = [
      ["uacr", /\b(?:UACR|urine (?:micro)?albumin[ /-](?:to[ -])?creatinine(?: ratio)?|(?:micro)?albumin[ /-]creatinine ratio)\b/i],
      ["egfr", /\b(?:eGFR|estimated glomerular filtration rate)\b/i],
      ["creatinine", /^(?:serum |plasma )?creatinine(?:, serum|, plasma)?$/i],
      ["potassium", /^potassium\b/i], ["sodium", /^sodium\b/i], ["chloride", /^chloride\b/i],
      ["bicarbonate", /^(?:bicarbonate(?: \(total CO2\))?|(?:carbon dioxide|CO2),? total|total CO2)$/i],
      ["anion_gap", /^anion gap\b/i], ["bun", /^(?:BUN|(?:blood )?urea nitrogen)$/i],
      ["glucose", /^(?:glucose|(?:serum|plasma|laboratory) glucose)(?:,? (?:serum|plasma|fasting|random))*$/i],
      ["a1c", /^(?:HbA1c|A1c|hemoglobin A1c|glycated hemoglobin)\b/i],
      ["platelets", /^(?:platelets?|platelet count)\b/i], ["wbc", /^(?:WBC|white blood cell(?:s| count)?|leukocytes)\b/i],
      ["hemoglobin", /^(?:hemoglobin|Hgb|Hb)$/i], ["bhb", /^(?:beta[ -]hydroxybutyrate|β[ -]hydroxybutyrate|BHB)\b/i],
      ["ph", /^(?:pH|(?:venous|arterial|blood gas) pH)\b/i], ["pco2", /^(?:pCO2|(?:venous|arterial) pCO2)\b/i],
      ["lipase", /^lipase$/i], ["troponin", /^(?:(?:high[ -]sensitivity|hs)[ -])?troponin I\b/i],
      ["hdl", /\bHDL(?:[ -]cholesterol)?\b/i], ["ldl", /\bLDL(?:[ -]cholesterol)?\b/i],
      ["cholesterol", /^(?:total cholesterol|cholesterol(?:,? total)?)$/i], ["triglycerides", /^triglycerides?$/i],
    ];
    a = patterns.find(([, pattern]) => pattern.test(name))?.[0];
  }
  if (!a) return;
  if (a === "uacr") return a;
  if (/\burine\b/i.test(specimen) && ["creatinine", "sodium", "potassium", "chloride", "glucose", "wbc"].includes(a)) return;
  if (a === "creatinine" && specimen && !/serum|plasma/i.test(specimen)) return;
  if (a === "glucose" && specimen && !/serum|plasma/i.test(specimen)) return;
  if (a === "ph" && specimen && !/blood/i.test(specimen)) return;
  return a;
}
function numericResult(value: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const s = str(value).replace(/≤/g, "<=").replace(/≥/g, ">=");
  const m = /^\s*(<=|>=|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*$/.exec(s);
  if (!m || !Number.isFinite(+m[2])) return;
  return { value: +m[2], ...(m[1] ? { comparator: m[1] as LabResultRow["comparator"] } : {}) };
}
function convertLab(a: Analyte, value: number, unit: unknown): number | undefined {
  const norm = (s: string): string => s.toLowerCase().replace(/[μµ]/g, "u").replace(/\s+/g, "").replace(/²/g, "2").replace(/\^/g, "*");
  const u = norm(str(unit));
  if (u === norm(units[a]) || (a === "ph" && (!u || u === "ph" || u === "1"))) return value;
  if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") return value;
  if (a === "creatinine" && u === "umol/l") return value / 88.4;
  if (a === "glucose" && u === "mmol/l") return value * 18.016;
  if (a === "bun" && u === "mmol/l") return value * 2.801;
  if (["cholesterol", "hdl", "ldl"].includes(a) && u === "mmol/l") return value * 38.67;
  if (a === "triglycerides" && u === "mmol/l") return value * 88.57;
  if (a === "hemoglobin" && u === "g/l") return value / 10;
  if (a === "a1c" && u === "mmol/mol") return value * 0.09148 + 2.152;
  if (a === "uacr" && u === "mg/mmol") return value * 8.84;
  if (a === "uacr" && ["ug/mg", "mg/g{creat}", "mg/gcreatinine"].includes(u)) return value;
  if ((a === "wbc" || a === "platelets") && ["10*9/l", "k/ul", "thousand/ul", "thousands/ul", "10³/ul"].includes(u)) return value;
  if ((a === "wbc" || a === "platelets") && ["cells/ul", "/ul", "1/ul", "cells/mm3"].includes(u)) return value / 1000;
  if (a === "troponin" && ["ng/l", "pg/ml"].includes(u)) return value / 1000;
  if (a === "troponin" && u === "ug/l") return value;
  if (a === "pco2" && u === "kpa") return value * 7.50062;
  if (a === "egfr" && /^(?:ml\/min\/(?:1\.73m2|1\.73\{m2\})|ml\/min\/1\.73|ml\/min\/\{1\.73_m2\})$/.test(u)) return value;
  return undefined; // Unknown dimensions are never silently relabelled.
}
type LabCopy = Ref & { shared: Obj; value: Obj; rank: number; component: number };
function labResults(docs: Doc[]): LabResultRow[] {
  const copies = new Map<string, LabCopy>();
  const ranks: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };
  for (const doc of docs) for (const entry of doc.entries) {
    const e = entry.data;
    if (e.type !== "result" && e.type !== "panel") continue;
    const values = e.type === "panel" ? (Array.isArray(e.components) ? e.components : []) : [e];
    const rank = lookup(ranks, str(e.status));
    if (!str(e.accession) || !rank) continue;
    for (const [component, value] of values.entries()) {
      if (!object(value) || !object(value.test) || !str(value.test.local_code)) continue;
      const id = key(doc.item.issuer, e.accession, value.test.local_code);
      const copy: LabCopy = { doc, entry, shared: e, value, rank, component };
      const previous = copies.get(id);
      if (!previous || copy.rank > previous.rank || (copy.rank === previous.rank &&
        (compareRef(copy, previous) > 0 || (compareRef(copy, previous) === 0 && component > previous.component)))) copies.set(id, copy);
    }
  }
  const rows: LabResultRow[] = [];
  for (const copy of copies.values()) {
    const { shared, value } = copy;
    const test = value.test as Obj;
    const a = analyte(test, str(shared.specimen));
    if (!a) continue;
    // Keep the specimen instant, even when it falls on an earlier Chicago day
    // than the reviewing note. Copies are identified by accession + test, not
    // by the document date or payload entry key.
    const printed = numericResult(value.value), collected = rfc3339(shared.collected);
    if (!printed || !collected) continue;
    const converted = convertLab(a, printed.value, value.unit);
    if (converted === undefined || !Number.isFinite(converted)) continue;
    const name = str(test.name);
    // The race-coefficient version is not a separate calculation for this view.
    if (a === "egfr" && /\b(?:African American|Black|race coefficient)\b/i.test(name) && !/\b(?:non[ -]?(?:African|Black)|without|no race|race[ -]free)\b/i.test(name)) continue;
    const row: LabResultRow = {
      analyte: a, value: converted, unit: units[a], collected,
      status: shared.status === "preliminary" ? "preliminary" : "final", evidence: evidence(copy),
    };
    if (printed.comparator) row.comparator = printed.comparator;
    if (str(test.loinc)) row.loinc = str(test.loinc);
    if (a === "egfr") {
      row.egfr_equation = /2021/.test(name) ? "ckd-epi-2021" : /2009/.test(name) ? "ckd-epi-2009" : /MDRD/i.test(name) ? "mdrd"
        : collected.slice(0, 4) >= "2023" ? "ckd-epi-2021" : "unknown";
    }
    rows.push(row);
  }
  return rows;
}

type VitalCopy = Ref & { row: VitalRow; time: number; encounter: string };
function vitals(docs: Doc[]): VitalRow[] {
  const copies = new Map<string, VitalCopy>();
  for (const doc of docs) for (const entry of doc.entries) {
    const e = entry.data;
    if (e.type !== "vitals") continue;
    const local = localTime(e.taken);
    if (!local) continue;
    const row: VitalRow = { setting: "hospital", local_time: local.slice(0, 16), evidence: evidence({ doc, entry }) };
    if (object(e.bp)) {
      if (num(e.bp.systolic_mmhg)) row.systolic_mmhg = e.bp.systolic_mmhg;
      if (num(e.bp.diastolic_mmhg)) row.diastolic_mmhg = e.bp.diastolic_mmhg;
    }
    if (num(e.heart_rate_bpm)) row.pulse_bpm = e.heart_rate_bpm;
    if (num(e.weight_kg) && Number.isFinite(e.weight_kg * 10)) row.weight_kg = Math.round(e.weight_kg * 10) / 10;
    if (Object.keys(row).length === 3) continue;
    const time = instant(e.taken);
    const encounter = key(doc.item.issuer, str(doc.enc?.encounter_id) || doc.item.id);
    const id = key(encounter, Number.isFinite(time) ? time : local);
    const old = copies.get(id);
    // Same encounter and exact measurement time identify copied sets. Preserve
    // complementary measurements; the latest document wins conflicting fields.
    if (old) {
      row.evidence = unionEvidence(old.row.evidence, row.evidence);
      for (const field of ["systolic_mmhg", "diastolic_mmhg", "pulse_bpm", "weight_kg"] as const) {
        if (row[field] === undefined && old.row[field] !== undefined) row[field] = old.row[field];
      }
    }
    // Keep the original examination context when a later note copies a set.
    copies.set(id, { doc: old?.doc || doc, entry, row, time, encounter });
  }
  // Group in actual measurement order, before truncation to displayed minutes.
  // At the fall DST transition a later instant can have an earlier wall time;
  // entry ids also say nothing about which of two readings in a minute came first.
  const sorted = [...copies.values()].sort((a, b) =>
    (Number.isFinite(a.time) && Number.isFinite(b.time) ? a.time - b.time :
      cmp(localTime(a.entry.data.taken)!, localTime(b.entry.data.taken)!)) || compareRef(a, b));
  const groups: VitalCopy[] = [];
  for (const copy of sorted) {
    // A hospital stay spans days, not one office visit. Group the same day's
    // measurements from one examination/document, or complementary sets within
    // five minutes. An ED visit can cross midnight, so its repeat BP still
    // belongs to the same visit. Separate inpatient examinations remain separate.
    const previous = [...groups].reverse().find(g => g.encounter === copy.encounter &&
      ((g.doc === copy.doc && (g.doc.enc?.document_kind === "ed_note" ||
        g.row.local_time.slice(0, 10) === copy.row.local_time.slice(0, 10))) ||
      (Number.isFinite(g.time) && copy.time >= g.time && copy.time - g.time <= 5 * 60000)));
    if (!previous) { groups.push(copy); continue; }
    const a = previous.row, b = copy.row;
    if (b.systolic_mmhg !== undefined || b.diastolic_mmhg !== undefined) {
      if (a.systolic_mmhg !== undefined || a.diastolic_mmhg !== undefined) {
        if (b.systolic_mmhg !== undefined) a.repeat_systolic_mmhg = b.systolic_mmhg;
        if (b.diastolic_mmhg !== undefined) a.repeat_diastolic_mmhg = b.diastolic_mmhg;
      } else {
        a.systolic_mmhg = b.systolic_mmhg; a.diastolic_mmhg = b.diastolic_mmhg;
        a.local_time = b.local_time;
      }
    }
    if (a.pulse_bpm === undefined && b.pulse_bpm !== undefined) a.pulse_bpm = b.pulse_bpm;
    if (a.weight_kg === undefined && b.weight_kg !== undefined) a.weight_kg = b.weight_kg;
    a.evidence = unionEvidence(a.evidence, b.evidence);
  }
  return groups.map(g => g.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const docs = currentDocuments(items, asOf);
  const groups = problemGroups(docs);
  const rows: ViewRows = {
    medications: medications(docs), problems: problems(groups), allergies: allergies(docs, groups),
    labs: labResults(docs), vitals: vitals(docs),
  };
  rows.medications.sort((a, b) => cmp(key(a.ingredient, a.drug_name), key(b.ingredient, b.drug_name)));
  rows.problems.sort((a, b) => cmp(key(a.condition, a.icd10cm), key(b.condition, b.icd10cm)));
  rows.allergies.sort((a, b) => cmp(a.substance, b.substance));
  rows.labs.sort((a, b) => cmp(a.collected, b.collected) || cmp(a.analyte, b.analyte) || cmp(key(a.evidence), key(b.evidence)));
  rows.vitals.sort((a, b) => cmp(a.local_time, b.local_time) || cmp(key(a.evidence), key(b.evidence)));
  return rows;
}
