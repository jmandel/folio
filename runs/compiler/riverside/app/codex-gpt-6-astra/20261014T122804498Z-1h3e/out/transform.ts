import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow,
  AllergyIntoleranceRow, LabResultRow, VitalRow, Analyte,
} from "../in/views/views";

// Source entries deliberately enter through unknown: a malformed optional member must
// not turn a whole patient's chart into an exception or an invented clinical fact.
type Obj = Record<string, unknown>;
type Doc = {
  item: Obj; id: string; issuer: string; recorded: number;
  entries: Entry[]; enc?: Obj; encounter: string;
};
type Entry = { id: string; value: Obj; doc: Doc };
const object = (v: unknown): Obj | undefined =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? v as Obj : undefined;
const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v : undefined;
const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const norm = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, " ");
const key = (...parts: string[]): string => JSON.stringify(parts);
// Source strings must never index inherited properties such as "constructor".
const lookup = <T>(table: Record<string, T>, name: string): T | undefined =>
  Object.prototype.hasOwnProperty.call(table, name) ? table[name] : undefined;
const evidence = (e: Entry): Evidence => [{ item_id: e.doc.id, entry_id: e.id }];
function mergeEvidence(...sets: Evidence[]): Evidence {
  const all = new Map<string, Evidence[number]>();
  for (const set of sets) for (const e of set) all.set(key(e.item_id, e.entry_id ?? ""), e);
  return [...all.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id ?? "", b.entry_id ?? ""));
}
const localFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});
function partialDate(v: unknown): ProblemRow["onset"] {
  const s = str(v)?.trim();
  if (!s || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(s)) return;
  const y = Number(s.slice(0, 4)), m = Number(s.slice(5, 7) || 1), d = Number(s.slice(8, 10) || 1);
  const days = [31, y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (y < 1 || m < 1 || m > 12 || d < 1 || d > days[m - 1]) return;
  return { value: s, precision: s.length === 4 ? "year" : s.length === 7 ? "month" : "day" };
}
function instant(v: unknown): number | undefined {
  const s = str(v);
  if (!s || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(s) || !partialDate(s.slice(0, 10))) return;
  const n = Date.parse(s);
  return Number.isFinite(n) ? n : undefined;
}
function localTime(ms: number): string {
  const p: Record<string, string> = {};
  for (const part of localFormatter.formatToParts(new Date(ms))) p[part.type] = part.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
function clinicalDate(doc: Doc): string | undefined {
  // A discharge summary's effective START is admission, not discharge.
  const v = doc.enc?.document_kind === "discharge_summary"
    ? doc.enc.discharged ?? doc.item.effective_end : doc.item.effective;
  const t = instant(v);
  return t === undefined ? partialDate(v)?.value : localTime(t).slice(0, 10);
}
function compareDocs(a: Doc, b: Doc): number {
  return a.recorded - b.recorded || cmp(a.issuer, b.issuer) || cmp(a.id, b.id);
}
function compareEntries(a: Entry, b: Entry): number {
  return compareDocs(a.doc, b.doc) || cmp(a.id, b.id);
}
function currentDocs(items: unknown, asOf: string): Doc[] {
  if (!Array.isArray(items) || partialDate(asOf)?.precision !== "day") return [];
  const docs: Doc[] = [];
  for (const raw of items) {
    const item = object(raw);
    if (!item) continue;
    const id = str(item.id), issuer = str(item.issuer), recorded = instant(item.recorded);
    if (!id || !issuer || recorded === undefined || localTime(recorded).slice(0, 10) > asOf) continue;
    const doc: Doc = { item, id, issuer, recorded, entries: [], encounter: key(issuer, id) };
    const payload = object(item.payload);
    if (payload) for (const id of Object.keys(payload).sort(cmp)) {
      const value = object(payload[id]);
      if (value) doc.entries.push({ id, value, doc });
    }
    doc.enc = doc.entries.find(e => e.value.type === "encounter")?.value;
    doc.encounter = key(issuer, str(doc.enc?.encounter_id) ?? id);
    docs.push(doc);
  }
  // Inspect ALL in-scope edges, including edges from noncurrent documents. Thus
  // retracting a replacement does not resurrect the document it superseded.
  const removed = new Set<string>();
  for (const doc of docs) for (const field of ["supersedes", "retracts"]) {
    const ids = doc.item[field];
    if (Array.isArray(ids)) for (const id of ids) if (typeof id === "string" && id !== doc.id)
      removed.add(key(doc.issuer, id));
  }
  return docs.filter(d => !removed.has(key(d.issuer, d.id))).sort(compareDocs);
}

// Names are normalized, but RxNorm codes are ONLY copied from an ingredient field.
// Brand aliases are lexical translations, not inferred product-to-ingredient CUIs.
const brands: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", forxiga: "dapagliflozin",
  invokana: "canagliflozin", steglatro: "ertugliflozin", glucophage: "metformin",
  fortamet: "metformin", glumetza: "metformin", riomet: "metformin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", admelog: "insulin lispro", novolog: "insulin aspart",
  fiasp: "insulin aspart", apidra: "insulin glulisine",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  pravachol: "pravastatin", cozaar: "losartan", diovan: "valsartan",
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine",
  microzide: "hydrochlorothiazide", lasix: "furosemide", bumex: "bumetanide",
  aldactone: "spironolactone", toprol: "metoprolol", lopressor: "metoprolol",
  coreg: "carvedilol", tenormin: "atenolol", glucotrol: "glipizide",
  amaryl: "glimepiride", januvia: "sitagliptin", tradjenta: "linagliptin",
  actos: "pioglitazone", ozempic: "semaglutide", rybelsus: "semaglutide",
  wegovy: "semaglutide", victoza: "liraglutide", trulicity: "dulaglutide",
  mounjaro: "tirzepatide", zepbound: "tirzepatide", synthroid: "levothyroxine",
  levoxyl: "levothyroxine", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", plavix: "clopidogrel", prilosec: "omeprazole",
  protonix: "pantoprazole", nexium: "esomeprazole", pepcid: "famotidine",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen",
  aleve: "naproxen", neurontin: "gabapentin", lyrica: "pregabalin",
  zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol",
  flomax: "tamsulosin", zyloprim: "allopurinol", zofran: "ondansetron",
  synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin",
  janumet: "sitagliptin / metformin", jentadueto: "linagliptin / metformin",
  kombiglyze: "saxagliptin / metformin", glucovance: "glyburide / metformin",
  glyxambi: "empagliflozin / linagliptin", trijardy: "empagliflozin / linagliptin / metformin",
  hyzaar: "losartan / hydrochlorothiazide", zestoretic: "lisinopril / hydrochlorothiazide",
  prinzide: "lisinopril / hydrochlorothiazide", lotrel: "amlodipine / benazepril",
  entresto: "sacubitril / valsartan", augmentin: "amoxicillin / clavulanic acid",
};
const ingredientCodes: Record<string, string> = {
  "6809": "metformin", "1545653": "empagliflozin", "1488564": "dapagliflozin",
  "1373458": "canagliflozin", "29046": "lisinopril", "5487": "hydrochlorothiazide",
  "52175": "losartan", "4821": "glipizide", "274783": "insulin glargine",
  "83367": "atorvastatin", "253182": "insulin human", "17767": "amlodipine",
};
function ingredient(name: string, rx?: string): string | undefined {
  const coded = rx ? lookup(ingredientCodes, rx) : undefined;
  if (coded) return coded;
  let n = norm(name).replace(/[®™]/g, "");
  if (/^(?:unknown|unspecified|unidentified|water pill|blood pressure pill|diabetes pill|medication|medicines?)(?:\b|$)/.test(n)) return;
  // Explicit combination products retain all named ingredients; never pick one.
  const brand = lookup(brands, n.split(/[\s(]/)[0]);
  if (brand && !/\s(?:and|\+)\s|\/\s*[a-z]/.test(n.replace(/\b(?:mg|units?)\/ml\b/g, ""))) return brand;
  n = n.replace(/\([^)]*\)/g, " ")
    .replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|units?|unt|%)(?:\s*\/\s*(?:ml|\d+(?:\.\d+)?\s*(?:mg|mcg|ml)))?/g, " ")
    .replace(/\b(?:hydrochloride|hcl|succinate|tartrate|besylate|fumarate|maleate|mesylate|phosphate|acetate)\b/g, " ")
    .replace(/\b(losartan|diclofenac) potassium\b/g, "$1")
    .replace(/\b(levothyroxine|naproxen|diclofenac) sodium\b/g, "$1")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|sustained[ -]release|film[ -]coated|oral|subcutaneous|injectable|injection|solution|suspension|tablets?|tabs?|capsules?|caps?|pens?|vials?|inhalers?|cream|ointment|patch|er|xr|xl|sr|dr|odt)\b/g, " ")
    .replace(/\s+/g, " ").replace(/^[\s,;-]+|[\s,;-]+$/g, "");
  if (!n) return;
  return lookup(brands, n) ?? n;
}
function medicationKey(e: Entry, codesByName?: Map<string, Set<string>>): string | undefined {
  const name = str(e.value.drug_name), rx = str(e.value.rxnorm_ingredient);
  if (!name) return;
  const ing = ingredient(name, rx);
  if (rx) return `rx:${rx}`;
  const candidates = ing ? codesByName?.get(ing) : undefined;
  if (candidates?.size === 1) return `rx:${[...candidates][0]}`;
  return ing ? `name:${ing}` : `display:${norm(name)}`;
}
function medicationStatus(v: unknown): MedicationRow["status"] | undefined {
  switch (v) {
    case "not_reconciled": return "unknown";
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
    default: return;
  }
}
function parseDose(v: unknown): MedicationRow["dose"] {
  const s = str(v)?.trim();
  if (!s) return;
  const m = /^(\d+(?:,\d{3})*(?:\.\d+)?|\.\d+|\d+\/\d+|½|¼|¾)\s*(mg|milligrams?|mcg|[µμ]g|micrograms?|g|grams?|ml|millilit(?:er|re)s?|units?|unt|\[iu\]|iu|tabs?|tablets?)$/i.exec(s);
  if (!m) return;
  const amounts: Record<string, number> = { "½": .5, "¼": .25, "¾": .75 };
  let value = amounts[m[1]] ?? (m[1].includes("/") ? Number(m[1].split("/")[0]) / Number(m[1].split("/")[1]) : Number(m[1].replace(/,/g, "")));
  if (!Number.isFinite(value) || value < 0) return;
  const u = m[2].toLowerCase();
  let unit: NonNullable<MedicationRow["dose"]>["unit"];
  if (/^(g|grams?)$/.test(u)) { unit = "mg"; value *= 1000; }
  else if (/^(mg|milligram)/.test(u)) unit = "mg";
  else if (/^(mcg|[µμ]g|microgram)/.test(u)) unit = "mcg";
  else if (/^(ml|millilit)/.test(u)) unit = "mL";
  else if (/^tab/.test(u)) unit = "tablet";
  else unit = "units";
  return { value, unit };
}
function frequency(v: unknown): MedicationRow["frequency"] {
  const s = str(v)?.toLowerCase();
  if (!s || /^(?:unknown|not (?:known|specified)|as directed|per instructions)\.?$/.test(s)) return;
  if (/\bprn\b|as needed/.test(s)) return "PRN";
  if (/\b(?:qw|qweek|weekly)\b|once (?:a|per) week|every (?:7|seven) days/.test(s)) return "QW";
  if (/\b(?:tid|t\.i\.d)\b|three times (?:a |per )?(?:day|daily)|every (?:8|eight) hours|\bq8h\b/.test(s)) return "TID";
  if (/\b(?:bid|b\.i\.d)\b|twice (?:a |per )?(?:day|daily)|two times (?:a |per )?day|every (?:12|twelve) hours|\bq12h\b/.test(s)) return "BID";
  if (/\b(?:qhs|q\.h\.s|nightly|bedtime)\b|every night|at night/.test(s)) return "QHS";
  if (/every other|alternate days|\bqod\b|\bqid\b|four times/.test(s)) return "other";
  if (/\b(?:qd|q\.d|daily|qday|q24h|qam|qpm)\b|once (?:a |per )?day|every (?:24 hours|morning|evening)/.test(s)) return "QD";
  if (/\bevery\b|\bq\d|\bq\.?i\.?d\b|\btimes\b|\b(?:meals?|schedule|taper|sliding scale)\b/.test(s)) return "other";
  return;
}
function stopReason(s: string): MedicationRow["stop_reason"] {
  if (/adverse|side effect|allerg|intoleran|(?:caus|induc|associat).*(?:cough|rash|acidosis|hypoglyc|angioedema)|due to (?:cough|rash|angioedema)/i.test(s)) return "adverse_reaction";
  if (/ineffective|not (?:effective|working)|lack of (?:effect|benefit)|no benefit/i.test(s)) return "ineffective";
  if (/replac|switch|changed to|substitut/i.test(s)) return "therapy_changed";
  if (/(?:course|treatment|therapy).*(?:complete|finished)|completed/i.test(s)) return "course_complete";
  if (/patient.*(?:declin|prefer|request|choice|refus)|(?:declin|refus).*(?:patient)/i.test(s)) return "patient_choice";
  if (/^(?:stop(?:ped)?|discontinue[dt]?|do not (?:take|resume))\.?$/i.test(s.trim())) return;
  return "other";
}
function medicationSnapshot(docs: Doc[]): Doc | undefined {
  const encounters = new Map<string, Doc[]>();
  for (const d of docs) if (d.enc && ["ed_note", "hp", "progress_note", "consult", "discharge_summary"].includes(str(d.enc.document_kind) ?? "")) {
    const group = encounters.get(d.encounter) ?? [];
    group.push(d); encounters.set(d.encounter, group);
  }
  const candidates: Doc[] = [];
  for (const group of encounters.values()) {
    const discharge = group.filter(d => d.enc?.document_kind === "discharge_summary");
    candidates.push((discharge.length ? discharge : group).slice(-1)[0]);
  }
  return candidates.sort(compareDocs).slice(-1)[0];
}
function medications(docs: Doc[]): MedicationRow[] {
  const snapshot = medicationSnapshot(docs);
  if (!snapshot) return [];
  const codesByName = new Map<string, Set<string>>();
  for (const d of docs) for (const e of d.entries) if (e.value.type === "home_med") {
    const name = str(e.value.drug_name), rx = str(e.value.rxnorm_ingredient);
    const ing = name ? ingredient(name, rx) : undefined;
    if (ing && rx) {
      const codes = codesByName.get(ing) ?? new Set<string>(); codes.add(rx); codesByName.set(ing, codes);
    }
  }
  const selected = new Map<string, Entry>();
  for (const e of snapshot.entries) if (e.value.type === "home_med") {
    const k = medicationKey(e, codesByName);
    if (k) selected.set(k, e);
  }
  const rows: MedicationRow[] = [];
  for (const [k, e] of selected) {
    const v = e.value, drug_name = str(v.drug_name), status = medicationStatus(v.status);
    if (!drug_name || !status) continue;
    const rx = str(v.rxnorm_ingredient);
    const row: MedicationRow = { drug_name, status, patient_reported: false, evidence: evidence(e) };
    const ing = ingredient(drug_name, rx), dose = parseDose(v.dose_text), freq = frequency(v.sig);
    if (ing) row.ingredient = ing;
    if (rx) row.rxnorm_ingredient = rx;
    if (dose) row.dose = dose;
    if (freq) row.frequency = freq;
    const reason = str(v.instructions);
    if ((status === "held" || status === "stopped") && reason) row.status_reason_text = reason;
    if (status === "stopped" && reason) {
      const stop = stopReason(reason);
      if (stop) row.stop_reason = stop;
    }
    // Find the beginning of the uninterrupted state on THIS dose/line in this
    // encounter. Payload keys are deliberately not used to match medications.
    const history: (Entry | undefined)[] = docs.filter(d => d.encounter === snapshot.encounter && compareDocs(d, snapshot) <= 0)
      .map(d => d.entries.find(x => x.value.type === "home_med" && medicationKey(x, codesByName) === k && x.value.dose_text === v.dose_text));
    let first = history.length - 1;
    while (first > 0 && history[first - 1] && medicationStatus(history[first - 1]!.value.status) === status) first--;
    const start = history[first];
    const prior = history[first - 1];
    // Continuing a pre-existing home drug does not establish its start date.
    if (start && (status === "held" || status === "stopped" ||
      (status === "active" && (start.value.status === "changed" ||
        (prior && ["held", "stopped"].includes(medicationStatus(prior.value.status) ?? "")))))) {
      const date = clinicalDate(start.doc);
      if (date) {
        row.status_since = date;
        row.evidence = mergeEvidence(row.evidence, evidence(start), status === "active" && prior ? evidence(prior) : []);
      }
    }
    rows.push(row);
  }
  // The consumer groups by ingredient, including explicitly named ingredients
  // of a combination product. An ingredient CUI is never manufactured for them.
  const byIngredient = new Map<string, MedicationRow>();
  for (const row of rows) {
    const parts = row.ingredient?.split(/\s*(?:\/|\+|\band\b)\s*/).filter(Boolean);
    if (!row.rxnorm_ingredient && parts && parts.length > 1) {
      for (const part of parts) byIngredient.set(`name:${part}`, { ...row, ingredient: part });
    } else byIngredient.set(row.ingredient ? `name:${row.ingredient}` : `display:${row.drug_name}`, row);
  }
  return [...byIngredient.values()].sort((a, b) => cmp(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name));
}

type Condition = { entry: Entry; label: string; code?: string; local?: string; nameKey: string; family?: string };
function conditionName(s: string): string {
  return norm(s).replace(/\b(?:r\/o|rule[ -]?out|suspected|possible|probable|working diagnosis|history of|resolved)\b/g, "")
    .replace(/\bdka\b/g, "diabetic ketoacidosis").replace(/\baki\b/g, "acute kidney injury")
    .replace(/\bckd\b/g, "chronic kidney disease").replace(/\bhtn\b/g, "hypertension")
    .replace(/[^a-z0-9]+/g, " ").trim();
}
function icd(v: unknown): string | undefined {
  const s = str(v)?.trim().toUpperCase();
  if (!s || !/^[A-Z]\d[A-Z0-9](?:\.?[A-Z0-9]{1,4})?$/.test(s)) return;
  const clean = s.replace(".", "");
  return clean.length > 3 ? `${clean.slice(0, 3)}.${clean.slice(3)}` : clean;
}
function conditionFamily(label: string, code?: string): string | undefined {
  if (code?.startsWith("N18") || /^(?:history of )?(?:ckd\b|chronic (?:kidney|renal) (?:disease|failure|insufficiency))/i.test(label)) return "ckd";
  if (code === "I10" || /^(?:(?:essential|primary) )?(?:hypertension|htn)$/i.test(label)) return "hypertension";
  if (code?.startsWith("N17") || /^(?:acute kidney injury|aki)$/i.test(label)) return "aki";
  return;
}
function adverseCode(code?: string): boolean {
  if (!code) return false;
  const s = code.replace(".", ""), category = Number(s.slice(1, 3));
  return s[0] === "T" && category >= 36 && category <= 50 && s[5] === "5";
}
function adverseOnly(c: Condition): boolean {
  return adverseCode(c.code) || /^(?:adverse (?:effect|reaction)|drug[- ]induced adverse|allergic reaction to|allergy to|intolerance to)\b/i.test(c.label);
}
function conditions(docs: Doc[]): Condition[] {
  const result: Condition[] = [];
  for (const doc of docs) for (const entry of doc.entries) {
    const v = entry.value;
    if (v.type !== "diagnosis" && v.type !== "history") continue;
    const label = str(v.type === "diagnosis" ? v.label : v.condition);
    if (!label) continue;
    if (v.type === "diagnosis" && !["working", "ruled_out", "active", "resolved"].includes(str(v.status) ?? "")) continue;
    const code = icd(v.icd10cm), local = str(object(v.riverside_dx)?.code);
    result.push({ entry, label, code, local, nameKey: conditionName(label), family: conditionFamily(label, code) });
  }
  return result;
}
function groupConditions(all: Condition[]): Condition[][] {
  const primary = (c: Condition): string => {
    const drug = adverseOnly(c) ? drugAttribution(c) : undefined;
    return drug ? `adverse:${norm(resolveDrugAttribution(c, drug).substance)}` : c.family ? `family:${c.family}` : c.local ? `local:${c.local}` : c.code ? `icd:${c.code}` : `text:${c.nameKey}`;
  };
  const localsByCode = new Map<string, Set<string>>(), named = new Map<string, Set<string>>();
  const aliases = new Map<string, string>();
  const resolve = (k: string): string => { while (aliases.has(k)) k = aliases.get(k)!; return k; };
  for (const c of all) {
    const k = primary(c);
    if (c.local && c.code) {
      const set = localsByCode.get(c.code) ?? new Set<string>(); set.add(k); localsByCode.set(c.code, set);
    }
    if (c.code || c.local || c.family) {
      const set = named.get(c.nameKey) ?? new Set<string>(); set.add(k); named.set(c.nameKey, set);
    }
  }
  // An exact condition name can bridge a recoding, but two explicit local
  // dictionary concepts are never collapsed merely because ICD is coarser.
  for (const options of named.values()) {
    const keys = [...new Set([...options].map(resolve))].sort(cmp);
    const locals = keys.filter(k => k.startsWith("local:"));
    // Do not globally alias a coarse ICD code to one local concept: that same
    // ICD may also appear on another, explicitly different local diagnosis.
    if (locals.length || keys.length < 2) continue;
    const target = keys.find(k => k.startsWith("family:")) ?? keys[0];
    for (const k of keys) if (k !== target) aliases.set(k, target);
  }
  const groups = new Map<string, Condition[]>();
  for (const c of all) {
    let k = primary(c);
    if (!c.family && !c.local) {
      const options = c.code ? localsByCode.get(c.code) : named.get(c.nameKey);
      const resolved = new Set(options ? [...options].map(resolve) : []);
      const namedLocals = [...(named.get(c.nameKey) ?? [])].filter(n => n.startsWith("local:"));
      if (namedLocals.length === 1) k = namedLocals[0];
      else if (resolved.size === 1) k = [...resolved][0];
    }
    // Codes are issuer-local, as are the records and their corrections.
    k = key(c.entry.doc.issuer, resolve(k));
    const group = groups.get(k) ?? []; group.push(c); groups.set(k, group);
  }
  return [...groups.values()].map(group => group.sort((a, b) => compareDocs(a.entry.doc, b.entry.doc) ||
    Number(a.entry.value.type === "diagnosis") - Number(b.entry.value.type === "diagnosis") || cmp(a.entry.id, b.entry.id)));
}
function ckdStage(c: Condition): ProblemRow["ckd_stage"] {
  const byCode: Record<string, NonNullable<ProblemRow["ckd_stage"]>> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
  };
  const m = /\b(?:stage\s*|g)(3[ab]|[1245])\b/i.exec(c.label);
  return m ? `G${m[1].toLowerCase()}` as ProblemRow["ckd_stage"] : c.code ? byCode[c.code] : undefined;
}
function problems(groups: Condition[][]): ProblemRow[] {
  const rows: ProblemRow[] = [];
  for (const group of groups) {
    const c = group[group.length - 1], v = c.entry.value;
    if (adverseOnly(c) || (v.type === "diagnosis" && v.status !== "active" && v.status !== "resolved")) continue;
    const row: ProblemRow = {
      condition: c.label,
      status: v.status === "resolved" || (v.type === "history" && /\b(?:resolved|remote history of)\b/i.test(c.label)) ? "resolved" : "active",
      evidence: evidence(c.entry),
    };
    if (c.code) row.icd10cm = c.code;
    // Onset is carried forward only when explicitly recorded, at its actual precision.
    for (let i = group.length - 1; i >= 0; i--) {
      const onset = partialDate(group[i].entry.value.onset_text);
      if (onset) { row.onset = onset; row.evidence = mergeEvidence(row.evidence, evidence(group[i].entry)); break; }
    }
    if (c.family === "ckd") {
      for (let i = group.length - 1; i >= 0; i--) {
        const stage = ckdStage(group[i]), albumin = /\bA([123])\b/i.exec(group[i].label);
        if (!row.ckd_stage && stage) {
          row.ckd_stage = stage; row.evidence = mergeEvidence(row.evidence, evidence(group[i].entry));
        }
        if (!row.albuminuria && albumin) {
          row.albuminuria = `A${albumin[1]}` as ProblemRow["albuminuria"];
          row.evidence = mergeEvidence(row.evidence, evidence(group[i].entry));
        }
      }
    }
    rows.push(row);
  }
  return rows.sort((a, b) => cmp(a.condition, b.condition) || cmp(a.icd10cm ?? "", b.icd10cm ?? ""));
}

function reactionType(reaction: string): AllergyIntoleranceRow["type"] {
  // The source can explicitly identify the nonimmune form of angioedema.
  // Unqualified angioedema on its undifferentiated allergy list stays allergy.
  if (/angioedema/i.test(reaction) && /\bace[- ]inhibitor|angiotensin[- ]converting[- ]enzyme|bradykinin|non[- ]?(?:immune|allergic)/i.test(reaction)) return "adverse_reaction";
  if (/anaphyla|angioedema|hives|urticaria|rash|bronchospasm|stevens.johnson|toxic epidermal/i.test(reaction)) return "allergy";
  if (/ketoacidosis|\bdka\b|lactic acidosis|pancreatitis|agranulocytosis|rhabdomyolysis|hepatic failure|liver failure|kidney (?:injury|failure)|severe hypoglyc|major bleed/i.test(reaction)) return "adverse_reaction";
  if (/cough|\bgi\b|gastrointestinal|nausea|vomit|diarrh|upset|constipat|headache|dizz|myalgia|muscle (?:pain|ache)|flushing|fatigue|edema/i.test(reaction)) return "intolerance";
  return "allergy"; // Unknown reaction on the source's allergy list remains an allergy.
}
function dangerous(reaction: string): boolean {
  return /anaphyla|angioedema|bronchospasm|stevens.johnson|toxic epidermal|ketoacidosis|\bdka\b|lactic acidosis|life.threat|agranulocytosis|rhabdomyolysis|organ failure/i.test(reaction);
}
function knownDrug(name: string): boolean {
  const n = norm(name);
  return !!lookup(brands, n.split(/[\s(]/)[0]) || Object.values(ingredientCodes).includes(n) ||
    /(?:pril|sartan|statin|gliflozin|gliptin|glutide|olol|prazole|cillin|cycline|floxacin|mycin|oxetine|parin|semide|thiazide)$/.test(n) || /^insulin\b/.test(n);
}
function allergySubstance(s: string, rx?: string): string {
  return rx || knownDrug(s) ? ingredient(s, rx) ?? s.toLowerCase() : s;
}
const drugClasses = [
  { name: "ACE inhibitor", pattern: /\b(?:ace[- ]inhibitors?|angiotensin[- ]converting[- ]enzyme inhibitors?)\b/i },
  { name: "SGLT2 inhibitor", pattern: /\bsglt[- ]?2 inhibitors?\b/i },
];
function drugClass(s: string): typeof drugClasses[number] | undefined {
  return drugClasses.find(c => c.pattern.test(s));
}
function drugAttribution(c: Condition): string | undefined {
  // Attribute only what the diagnosis actually names. A medication being held
  // nearby is not evidence that it caused an adverse reaction.
  const s = c.label;
  for (const cls of drugClasses) {
    const match = cls.pattern.exec(s);
    if (match && /^[- ](?:associated|induced)\b/i.test(s.slice(match.index + match[0].length))) return cls.name;
  }
  const before = /\b([a-z][a-z -]*?)(?:[- ](?:associated|induced))\b/i.exec(s);
  if (before) {
    const token = before[1].replace(/^.*[,;:]\s*/, "").trim();
    const last = token.split(/\s+/).slice(-1)[0];
    if (knownDrug(last)) return last;
  }
  const match = /(?:adverse (?:effect|reaction)(?:\s+(?:of|to|from))?|allerg(?:y|ic reaction) to|intolerance to)\s+(.+?)(?:\s*[,;:(]|$)/i.exec(s);
  if (match) {
    const name = match[1].replace(/,?\s*(?:initial|subsequent) encounter.*$/i, "").trim();
    if (name && !/^(?:drug|medication|unspecified)(?:\b|$)/i.test(name)) return drugClass(name)?.name ?? name;
  }
  const due = /(?:due to|caused by|associated with|induced by|secondary to)\s+([^,;:()]+)/i.exec(s);
  if (due && (knownDrug(due[1].trim()) || /inhibitor|antibiotic|antidiabetic|hypoglycemic/i.test(due[1]))) return drugClass(due[1])?.name ?? due[1].trim();
  return;
}
function resolveDrugAttribution(c: Condition, attribution: string): { substance: string; rx?: string; evidence: Evidence } {
  const cls = drugClass(attribution);
  const substance = allergySubstance(attribution);
  const candidates = new Map<string, Entry[]>();
  for (const entry of c.entry.doc.entries) {
    const v = entry.value, name = str(v.drug_name);
    if (v.type !== "home_med" || !name) continue;
    const ing = ingredient(name, str(v.rxnorm_ingredient));
    if (!ing || /\s(?:\/|\+|and)\s/.test(ing)) continue;
    if (cls) {
      // Do not infer a culprit simply because it was held or is a member of a
      // drug class. The same document must explicitly link the medication to
      // the diagnosed class in its own avoidance instruction. If ambiguous,
      // retain the class as stated instead of choosing a drug.
      const instruction = str(v.instructions);
      if (!instruction || (v.status !== "stopped" && v.status !== "held")) continue;
      const avoidance = instruction.split(/[.;]/).some(sentence =>
        cls.pattern.test(sentence) && /\b(?:avoid(?:ed)?|do not (?:take|resume|restart|use)|never (?:take|resume|restart|use)|must not (?:take|resume|restart|use))\b/i.test(sentence));
      if (!avoidance) continue;
    } else if (norm(ing) !== norm(substance)) continue;
    const entries = candidates.get(ing) ?? [];
    entries.push(entry); candidates.set(ing, entries);
  }
  if (candidates.size !== 1) return { substance, evidence: [] };
  const [name, entries] = [...candidates][0];
  const codes = new Set(entries.map(e => str(e.value.rxnorm_ingredient)).filter((s): s is string => !!s));
  return { substance: name, rx: codes.size === 1 ? [...codes][0] : undefined, evidence: mergeEvidence(...entries.map(evidence)) };
}
function allergies(docs: Doc[], groups: Condition[][]): AllergyIntoleranceRow[] {
  const rows = new Map<string, AllergyIntoleranceRow>();
  // Allergies, like home drugs, are repeated full snapshots at signing.
  const snapshot = docs.filter(d => !!d.enc).slice(-1)[0];
  if (snapshot) for (const e of snapshot.entries) {
    const v = e.value, s = str(v.substance), rx = str(v.rxnorm_ingredient);
    if (v.type !== "allergy" || !s || /^(?:nkda|nka|no known (?:drug )?allergies)$/i.test(s.trim())) continue;
    const reaction = str(v.reaction), substance = allergySubstance(s, rx);
    const row: AllergyIntoleranceRow = {
      substance, type: reactionType(reaction ?? ""),
      criticality: v.severity === "severe" ? "high" : v.severity === "mild" ? "low" : reaction && dangerous(reaction) ? "high" : "unknown",
      evidence: evidence(e),
    };
    if (rx) row.rxnorm_ingredient = rx;
    if (reaction) row.reaction = reaction;
    combineAllergy(rows, row);
  }
  for (const group of groups) {
    const c = group[group.length - 1], v = c.entry.value;
    if (v.type === "diagnosis" && v.status !== "active" && v.status !== "resolved") continue;
    const attribution = drugAttribution(c);
    if (!attribution || (!adverseOnly(c) && !/associated|induced|caused by|due to|secondary to/i.test(c.label))) continue;
    const attributed = resolveDrugAttribution(c, attribution);
    const row: AllergyIntoleranceRow = {
      substance: attributed.substance, type: "adverse_reaction", reaction: c.label,
      criticality: dangerous(c.label) ? "high" : "unknown", evidence: mergeEvidence(evidence(c.entry), attributed.evidence),
    };
    if (attributed.rx) row.rxnorm_ingredient = attributed.rx;
    if (/allerg|intolerance/i.test(c.label) && !adverseCode(c.code)) row.type = /intolerance/i.test(c.label) ? "intolerance" : "allergy";
    // A resolved harmful event does not assert that re-exposure is now safe.
    combineAllergy(rows, row);
  }
  return [...rows.values()].sort((a, b) => cmp(a.substance, b.substance));
}
function combineAllergy(rows: Map<string, AllergyIntoleranceRow>, row: AllergyIntoleranceRow): void {
  const k = norm(row.substance), old = rows.get(k);
  if (!old) { rows.set(k, row); return; }
  const reactions = [...new Set([old.reaction, row.reaction].filter((s): s is string => !!s))];
  const ranks = { unknown: 0, low: 1, high: 2 };
  if (ranks[old.criticality] > ranks[row.criticality]) row.criticality = old.criticality;
  if (old.type === "adverse_reaction" || row.type === "adverse_reaction") row.type = "adverse_reaction";
  else if (old.type === "allergy" || row.type === "allergy") row.type = "allergy";
  row.evidence = mergeEvidence(old.evidence, row.evidence);
  if (!row.rxnorm_ingredient && old.rxnorm_ingredient) row.rxnorm_ingredient = old.rxnorm_ingredient;
  if (reactions.length) row.reaction = reactions.join("; ");
  rows.set(k, row);
}

const units: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const loincAnalytes: Record<string, Analyte> = {
  "2160-0": "creatinine", "14682-9": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "98980-6": "egfr", "62238-1": "egfr", "48642-3": "egfr", "48643-1": "egfr",
  "33914-3": "egfr", "33915-0": "egfr", "69405-9": "egfr", "77147-7": "egfr",
  "2823-3": "potassium", "2951-2": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate",
  "2027-1": "bicarbonate", "33037-3": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "14937-7": "bun", "2345-7": "glucose", "14749-6": "glucose",
  "1558-6": "glucose", "4548-4": "a1c", "17856-6": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "13705-9": "uacr", "14958-3": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin", "6873-4": "bhb", "53060-3": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "11559-2": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "11560-0": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "14647-2": "cholesterol", "2571-8": "triglycerides", "14927-8": "triglycerides",
  "2085-9": "hdl", "14646-4": "hdl", "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl", "22748-8": "ldl",
};
const localAnalytes: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", AGAP: "anion_gap", BUN: "bun", GLU: "glucose", A1C: "a1c", HBA1C: "a1c",
  UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", BHB: "bhb", VPH: "ph", APH: "ph",
  VPCO2: "pco2", APCO2: "pco2", LIPASE: "lipase", TROP_I: "troponin", TNI: "troponin",
  CHOL: "cholesterol", TRIG: "triglycerides", HDL: "hdl", LDL: "ldl",
};
function analyte(test: Obj, specimen: string): Analyte | undefined {
  const name = norm(str(test.name) ?? ""), loinc = str(test.loinc), local = str(test.local_code)?.toUpperCase();
  // Never turn a similarly named urine, CSF, or troponin T result into one of
  // the consumer's serum analytes. Local codes alone do not override this.
  if (/troponin\s*t\b|hematocrit/.test(name)) return;
  let a = loinc ? lookup(loincAnalytes, loinc) : undefined;
  if (!a && /^(?:e\s*gfr\b|estimated glomerular filtration)/.test(name)) a = "egfr";
  if (!a && /albumin.*creatinine.*ratio|albumin\/creatinine|\buacr\b/.test(name)) a = "uacr";
  if (!a && /^(?:hemoglobin a1c|haemoglobin a1c|hba1c|a1c|glycat(?:ed|osylated) h(?:a?e)moglobin)\b/.test(name)) a = "a1c";
  if (!a && /^(?:beta[- ]|β[- ]|3[- ])?hydroxybutyrate\b|^beta-hydroxybutyric acid\b/.test(name)) a = "bhb";
  if (!a && /^(?:blood gas )?ph\b/.test(name)) a = "ph";
  if (!a && /^(?:pco2\b|carbon dioxide partial pressure)/.test(name)) a = "pco2";
  if (!a && /^(?:bicarbonate \(total co2\)|total co2|carbon dioxide,? total|co2,? total)$/.test(name)) a = "bicarbonate";
  if (!a && /^anion gap\b/.test(name)) a = "anion_gap";
  if (!a && /^(?:urea nitrogen|blood urea nitrogen|bun)\b/.test(name)) a = "bun";
  if (!a && /^troponin i\b|^high.sensitivity troponin i\b/.test(name)) a = "troponin";
  if (!a && /^(?:hdl|high.density lipoprotein)\b/.test(name)) a = "hdl";
  if (!a && /^(?:ldl|low.density lipoprotein)\b/.test(name)) a = "ldl";
  if (!a && /^(?:total cholesterol|cholesterol(?:,? total)?)$/.test(name)) a = "cholesterol";
  if (!a && /^triglycerides?\b/.test(name)) a = "triglycerides";
  if (!a && /^(?:platelets?|platelet count)\b/.test(name)) a = "platelets";
  if (!a && /^(?:wbc|white blood (?:cell|count)|leukocytes)\b/.test(name)) a = "wbc";
  if (!a && /^(?:hemoglobin|haemoglobin|hgb)(?:,? blood)?$/.test(name)) a = "hemoglobin";
  if (!a) for (const n of ["creatinine", "potassium", "sodium", "chloride", "glucose", "lipase"] as const)
    if (new RegExp(`^${n}(?:$|,| \\(| serum| plasma| fasting)`).test(name)) { a = n; break; }
  if (!a && local) a = lookup(localAnalytes, local);
  if (!a) return;
  if (a !== "uacr" && /urine|urinary|csf|cerebrospinal|pleural|peritoneal/.test(`${name} ${specimen.toLowerCase()}`)) return;
  if (a === "glucose" && !/serum|plasma/i.test(specimen)) return;
  if (a === "creatinine" && !/serum|plasma/i.test(specimen)) return;
  return a;
}
function numericResult(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const s = str(v)?.trim().replace(/^≤/, "<=").replace(/^≥/, ">=");
  if (!s) return;
  const m = /^(<=|>=|<|>)?\s*([+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(s);
  if (!m) return;
  const value = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(value)) return;
  return m[1] ? { value, comparator: m[1] as LabResultRow["comparator"] } : { value };
}
function unitKey(s: string): string {
  return s.toLowerCase().replace(/[µμ]/g, "u").replace(/\s/g, "").replace(/²/g, "2").replace(/\^/g, "*");
}
function convertValue(a: Analyte, value: number, unit: unknown): number | undefined {
  const u = unitKey(str(unit) ?? "");
  if (u === unitKey(units[a]) || (a === "ph" && (u === "" || u === "ph"))) return value;
  let factor: number | undefined, offset = 0;
  if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") factor = 1;
  if (a === "creatinine" && u === "umol/l") factor = 1 / 88.4;
  if (a === "glucose" && u === "mmol/l") factor = 18.016;
  if (a === "bun" && u === "mmol/l") factor = 2.801;
  if (["cholesterol", "hdl", "ldl"].includes(a) && u === "mmol/l") factor = 38.67;
  if (a === "triglycerides" && u === "mmol/l") factor = 88.57;
  if (["creatinine", "bun", "glucose", "cholesterol", "hdl", "ldl", "triglycerides"].includes(a) && u === "mg/l") factor = .1;
  if (a === "a1c" && u === "mmol/mol") { factor = .09148; offset = 2.152; }
  if (a === "a1c" && ["%ngsp", "%{ngsp}"].includes(u)) factor = 1;
  if (a === "uacr" && ["ug/mg", "mg/gcreat", "mg/g{creat}", "mg/gcreatinine"].includes(u)) factor = 1;
  if (a === "uacr" && ["mg/mmol", "mg/mmolcreat", "mg/mmol{creat}"].includes(u)) factor = 1000 / 113.12;
  if ((a === "platelets" || a === "wbc") && ["10*9/l", "10e9/l", "k/ul", "thousand/ul", "thousands/ul", "x10*3/ul"].includes(u)) factor = 1;
  if ((a === "platelets" || a === "wbc") && ["/ul", "1/ul", "cells/ul", "{cells}/ul", "cells/mm3", "/mm3"].includes(u)) factor = .001;
  if (a === "hemoglobin" && u === "g/l") factor = .1;
  if (a === "bhb" && u === "umol/l") factor = .001;
  if (a === "pco2" && u === "kpa") factor = 7.50062;
  if (a === "lipase" && ["iu/l", "[iu]/l"].includes(u)) factor = 1;
  if (a === "lipase" && u === "ukat/l") factor = 60;
  if (a === "troponin" && ["ng/l", "pg/ml"].includes(u)) factor = .001;
  if (a === "troponin" && u === "ug/l") factor = 1;
  if (a === "egfr" && /^ml\/min\/(?:1\.73(?:m2|m\*2)|\{1\.73_m2\})$/.test(u)) factor = 1;
  if (factor === undefined) return;
  // Remove arithmetic noise without pretending to increase source precision.
  return Number((value * factor + offset).toPrecision(12));
}
type LabCopy = { entry: Entry; value: Obj; shared: Obj; rank: number; test: Obj; accession: string; local: string };
function egfrEquation(c: LabCopy): LabResultRow["egfr_equation"] {
  const name = str(c.test.name) ?? "";
  if (/mdrd/i.test(name)) return "mdrd";
  if (/2009/.test(name)) return "ckd-epi-2009";
  if (/2021|race[- ]free/i.test(name)) return "ckd-epi-2021";
  // This is an explicit source-wide method statement in the panel docstring.
  if ((str(c.shared.collected) ?? "").slice(0, 4) >= "2023") return "ckd-epi-2021";
  const code = str(c.test.loinc);
  if (code === "33914-3" || code === "33915-0") return "mdrd";
  if (code === "48642-3" || code === "48643-1" || code === "62238-1") return "ckd-epi-2009";
  if (code === "98979-8" || code === "98980-6") return "ckd-epi-2021";
  return "unknown";
}
function raceCoefficient(test: Obj): boolean {
  const n = norm(str(test.name) ?? ""), code = str(test.loinc);
  if (/non[- ]?(?:african|black|aa\b)|without.*race|race[- ]free/.test(n)) return false;
  return /african american|\bblack\b|\baa\b|with race (?:coefficient|adjustment)/.test(n) || code === "48643-1" || code === "33915-0";
}
function labs(docs: Doc[]): LabResultRow[] {
  const chosen = new Map<string, LabCopy>();
  for (const doc of docs) for (const entry of doc.entries) {
    const shared = entry.value;
    if (shared.type !== "panel" && shared.type !== "result") continue;
    const accession = str(shared.accession);
    if (!accession) continue;
    const rank = shared.status === "corrected" ? 3 : shared.status === "final" ? 2 : shared.status === "preliminary" ? 1 : 0;
    if (!rank) continue;
    const values = shared.type === "panel" ? (Array.isArray(shared.components) ? shared.components : []) : [shared];
    for (const raw of values) {
      const value = object(raw), test = object(value?.test), local = str(test?.local_code);
      if (!value || !test || !local) continue;
      const k = key(doc.issuer, accession, local), old = chosen.get(k);
      if (!old || rank > old.rank || (rank === old.rank && compareEntries(entry, old.entry) >= 0))
        chosen.set(k, { entry, value, shared, rank, test, accession, local });
    }
  }
  const rows: { row: LabResultRow; key: string }[] = [];
  for (const [k, c] of chosen) {
    const collected = str(c.shared.collected), specimen = str(c.shared.specimen) ?? "";
    const a = analyte(c.test, specimen), parsed = numericResult(c.value.value);
    // Select the winning copy BEFORE parsing. A corrected nonnumeric value must
    // not bring back an obsolete numeric final/preliminary copy.
    if (!a || !parsed || !collected || instant(collected) === undefined || (a === "egfr" && raceCoefficient(c.test))) continue;
    const value = convertValue(a, parsed.value, c.value.unit);
    if (value === undefined || !Number.isFinite(value)) continue;
    const row: LabResultRow = { analyte: a, value, unit: units[a], collected,
      status: c.rank === 1 ? "preliminary" : "final", evidence: evidence(c.entry) };
    if (parsed.comparator) row.comparator = parsed.comparator;
    const loinc = str(c.test.loinc);
    if (loinc) row.loinc = loinc;
    if (a === "egfr") row.egfr_equation = egfrEquation(c);
    rows.push({ row, key: k });
  }
  return rows.sort((a, b) => instant(a.row.collected)! - instant(b.row.collected)! || cmp(a.row.analyte, b.row.analyte) || cmp(a.key, b.key)).map(x => x.row);
}

type VitalSet = { entry: Entry; time: number; row: VitalRow };
function vitals(docs: Doc[]): VitalRow[] {
  const sets = new Map<string, VitalSet>();
  for (const doc of docs) for (const entry of doc.entries) {
    const v = entry.value, time = instant(v.taken);
    if (v.type !== "vitals" || time === undefined) continue;
    const bp = object(v.bp), systolic = num(bp?.systolic_mmhg), diastolic = num(bp?.diastolic_mmhg);
    const pulse = num(v.heart_rate_bpm), weight = num(v.weight_kg);
    if (systolic === undefined && diastolic === undefined && pulse === undefined && weight === undefined) continue;
    const row: VitalRow = { setting: "hospital", local_time: localTime(time), evidence: evidence(entry) };
    if (systolic !== undefined) row.systolic_mmhg = systolic;
    if (diastolic !== undefined) row.diastolic_mmhg = diastolic;
    if (pulse !== undefined) row.pulse_bpm = pulse;
    if (weight !== undefined) row.weight_kg = Math.round(weight * 10) / 10;
    const k = key(doc.issuer, String(time));
    const old = sets.get(k);
    if (old) {
      // Same timestamp: combine complementary members; latest signed copy wins
      // any conflict. Repeating a measurement in a note is not a new reading.
      const merged = { ...old.row, ...row, evidence: mergeEvidence(old.row.evidence, row.evidence) };
      sets.set(k, { entry, time, row: merged });
    } else sets.set(k, { entry, time, row });
  }
  const ordered = [...sets.values()].sort((a, b) => a.time - b.time || compareEntries(a.entry, b.entry));
  const clusters: { first: VitalSet; last: VitalSet; bpTime?: number; row: VitalRow }[] = [];
  for (const set of ordered) {
    const previous = clusters[clusters.length - 1];
    const hasBP = set.row.systolic_mmhg !== undefined || set.row.diastolic_mmhg !== undefined;
    // The source has timed sets, not explicit "repeat BP" links. Only readings
    // within five minutes in the same encounter are treated as one set.
    if (!previous || set.entry.doc.encounter !== previous.first.entry.doc.encounter || set.time - previous.first.time > 5 * 60000) {
      clusters.push({ first: set, last: set, bpTime: hasBP ? set.time : undefined, row: { ...set.row } });
      continue;
    }
    const row = previous.row;
    if (hasBP) {
      if (previous.bpTime === undefined) {
        previous.bpTime = set.time; row.local_time = set.row.local_time;
        if (set.row.systolic_mmhg !== undefined) row.systolic_mmhg = set.row.systolic_mmhg;
        if (set.row.diastolic_mmhg !== undefined) row.diastolic_mmhg = set.row.diastolic_mmhg;
      } else {
        if (set.row.systolic_mmhg !== undefined) row.repeat_systolic_mmhg = set.row.systolic_mmhg;
        if (set.row.diastolic_mmhg !== undefined) row.repeat_diastolic_mmhg = set.row.diastolic_mmhg;
      }
    }
    if (row.pulse_bpm === undefined && set.row.pulse_bpm !== undefined) row.pulse_bpm = set.row.pulse_bpm;
    if (row.weight_kg === undefined && set.row.weight_kg !== undefined) row.weight_kg = set.row.weight_kg;
    row.evidence = mergeEvidence(row.evidence, set.row.evidence);
    previous.last = set;
  }
  return clusters.map(c => c.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const docs = currentDocs(items, asOf);
  const groups = groupConditions(conditions(docs));
  return { medications: medications(docs), problems: problems(groups), allergies: allergies(docs, groups), labs: labs(docs), vitals: vitals(docs) };
}
