import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// The payload is deliberately decoded at its boundary: an unrecognized or malformed
// entry must not prevent the other entries in a document from being reported.
type ObjectValue = Record<string, unknown>;
type Entry = { id: string; value: ObjectValue };
type Document = {
  item: FolioItem;
  entries: Entry[];
  enc?: ObjectValue;
  encounter: string;
  recorded: number;
  clinical: number;
};
type Fact = { doc: Document; entry: Entry };
const object = (v: unknown): ObjectValue | undefined =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? v as ObjectValue : undefined;
const string = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;
const number = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;
const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const normalized = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const key = (...parts: string[]): string => JSON.stringify(parts);
const lookup = <T>(table: Record<string, T>, k: string): T | undefined => Object.hasOwn(table, k) ? table[k] : undefined;

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const t = Date.parse(s + "T12:00:00Z");
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === s;
}
function localTime(v: unknown): string | undefined {
  const s = string(v);
  if (!s) return undefined;
  const wall = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/.exec(s);
  if (wall) {
    return validDate(wall[1]) && +wall[2] < 24 && +wall[3] < 60 && +(wall[4] ?? 0) < 60
      ? `${wall[1]}T${wall[2]}:${wall[3]}` : undefined;
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s) || !validDate(s.slice(0, 10)) || !/(Z|[+-]\d{2}:\d{2})$/i.test(s)) return undefined;
  const t = Date.parse(s);
  if (!Number.isFinite(t)) return undefined;
  const p: Record<string, string> = {};
  for (const part of chicago.formatToParts(new Date(t))) p[part.type] = part.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
// Offset-free timestamps are local, including across DST. Prefer the earlier
// instant of an ambiguous fall-back time. Keep a spring-forward wall-clock entry
// as written too; the pre-transition offset supplies its otherwise absent instant.
function instant(v: unknown): number | undefined {
  const s = string(v);
  if (!s) return undefined;
  if (/(Z|[+-]\d{2}:\d{2})$/i.test(s)) {
    if (!localTime(s)) return undefined;
    const t = Date.parse(s);
    return Number.isFinite(t) ? t : undefined;
  }
  const local = localTime(s);
  if (!local) return undefined;
  const base = Date.parse(s.replace(" ", "T") + "Z");
  if (!Number.isFinite(base)) return undefined;
  for (const offset of [5, 6]) {
    const t = base + offset * 3600000;
    if (localTime(new Date(t).toISOString()) === local) return t;
  }
  return Number.isFinite(base) ? base + 6 * 3600000 : undefined;
}
function eventTime(v: unknown): number | undefined {
  const s = string(v);
  if (!s) return undefined;
  if (/^\d{4}(-\d{2})?(-\d{2})?$/.test(s)) {
    const full = s.length === 4 ? s + "-01-01" : s.length === 7 ? s + "-01" : s;
    return validDate(full) ? instant(full + "T00:00") : undefined;
  }
  return instant(s);
}
function rfc3339(v: unknown): string | undefined {
  const s = string(v), t = instant(v);
  if (!s || t === undefined) return undefined;
  return /(?:Z|[+-]\d{2}:\d{2})$/i.test(s) ? s : new Date(t).toISOString();
}
function partialDate(v: unknown): ProblemRow["onset"] {
  const s = string(v);
  if (!s) return undefined;
  if (/^\d{4}$/.test(s)) return { value: s, precision: "year" };
  if (/^\d{4}-(0[1-9]|1[012])$/.test(s)) return { value: s, precision: "month" };
  if (validDate(s)) return { value: s, precision: "day" };
  return undefined;
}
function evidence(...facts: Fact[]): Evidence {
  return mergeEvidence(...facts.map(f => [{ item_id: f.doc.item.id, entry_id: f.entry.id }]));
}
function mergeEvidence(...lists: Evidence[]): Evidence {
  const result = new Map<string, Evidence[number]>();
  for (const list of lists) for (const e of list) result.set(key(e.item_id, e.entry_id ?? ""), e);
  return [...result.values()].sort((a, b) => compare(a.item_id, b.item_id) || compare(a.entry_id ?? "", b.entry_id ?? ""));
}
function docOrder(a: Document, b: Document): number {
  return a.clinical - b.clinical || a.recorded - b.recorded || compare(a.item.issuer, b.item.issuer) || compare(a.item.id, b.item.id);
}
function signedOrder(a: Document, b: Document): number {
  return a.recorded - b.recorded || docOrder(a, b);
}
function factOrder(a: Fact, b: Fact): number {
  return docOrder(a.doc, b.doc) || compare(a.entry.id, b.entry.id);
}
function documents(items: FolioItem[], asOf: string): Document[] {
  if (!Array.isArray(items) || !validDate(asOf)) return [];
  const scoped: FolioItem[] = [];
  for (const candidate of items) {
    const i = object(candidate);
    if (!i || !string(i.id) || !string(i.issuer)) continue;
    const recorded = localTime(i.recorded);
    if (recorded && recorded.slice(0, 10) <= asOf && instant(i.recorded) !== undefined) scoped.push(candidate);
  }
  const removed = new Set<string>();
  // Include edges from ALL in-scope items, even replaced or retracted corrections.
  // This also removes every ancestor in a supersession chain, without resurrection.
  for (const i of scoped) for (const refs of [i.supersedes, i.retracts]) {
    if (Array.isArray(refs)) for (const id of refs) if (typeof id === "string") removed.add(key(i.issuer, id));
  }
  const docs: Document[] = [];
  for (const item of scoped) {
    if (removed.has(key(item.issuer, item.id))) continue;
    const payload = object(item.payload);
    if (!payload) continue;
    const entries: Entry[] = [];
    for (const id of Object.keys(payload).sort(compare)) {
      const value = object(payload[id]);
      if (value && string(value.type)) entries.push({ id, value });
    }
    const enc = entries.find(e => e.value.type === "encounter" && string(e.value.encounter_id) &&
      ["ed_note", "hp", "progress_note", "consult", "discharge_summary"].includes(string(e.value.document_kind) ?? ""))?.value;
    const recorded = instant(item.recorded)!;
    const clinical = (enc?.document_kind === "discharge_summary"
      ? eventTime(enc.discharged) ?? eventTime(item.effective_end) : undefined)
      ?? eventTime(item.effective) ?? recorded;
    docs.push({ item, entries, enc, recorded, clinical,
      encounter: key(item.issuer, string(enc?.encounter_id) ?? item.id) });
  }
  return docs.sort(docOrder);
}

// Names are normalized, but ingredient CUIs are always copied from the source.
const brands: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", forxiga: "dapagliflozin",
  invokana: "canagliflozin", steglatro: "ertugliflozin", bexagliflozin: "bexagliflozin",
  glucophage: "metformin", fortamet: "metformin", glumetza: "metformin",
  cozaar: "losartan", microzide: "hydrochlorothiazide", prinivil: "lisinopril", zestril: "lisinopril",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  norvasc: "amlodipine", lasix: "furosemide", aldactone: "spironolactone",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart",
  trulicity: "dulaglutide", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin",
  amaryl: "glimepiride", glucotrol: "glipizide", actos: "pioglitazone",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", protonix: "pantoprazole", prilosec: "omeprazole",
  plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin",
  toprol: "metoprolol", lopressor: "metoprolol", diovan: "valsartan", benicar: "olmesartan",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", wellbutrin: "bupropion",
  cymbalta: "duloxetine", neurontin: "gabapentin", lyrica: "pregabalin",
  flomax: "tamsulosin", ventolin: "albuterol", proair: "albuterol",
  augmentin: "amoxicillin / clavulanic acid", bactrim: "sulfamethoxazole / trimethoprim",
  hyzaar: "losartan / hydrochlorothiazide", synjardy: "empagliflozin / metformin",
  janumet: "sitagliptin / metformin", xigduo: "dapagliflozin / metformin",
};
function ingredient(v: unknown): string | undefined {
  let s = string(v)?.toLowerCase();
  if (!s || /^(?:unknown|unspecified|water pill|blood pressure pill|diabetes pill|medication|pill)s?$/.test(s)) return undefined;
  const brand = Object.keys(brands).find(b => s === b || s!.startsWith(b + " ") || s!.startsWith(b + "®"));
  if (brand) return brands[brand];
  // Keep combination ingredient names together; the schema provides no component doses.
  s = s.replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|µg|g|units?|unt|\[iu\]|iu|u\b|ml|%)(?:\s*\/\s*\d*(?:\.\d+)?\s*(?:mg|mcg|ml))?/gi, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:hydrochloride|hcl|hydrobromide|succinate|tartrate|besylate|maleate|fumarate|sodium|potassium)\b/g,
      (salt, offset: number) => offset === 0 ? salt : " ")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|oral|injectable|injection|solution|suspension|tablets?|tabs?|capsules?|caps?|pen|prefilled|vial|subcutaneous|subq|intravenous|iv|po|er|xr|sr|dr|usp)\b/g, " ")
    .replace(/[®™]/g, "").replace(/\s+/g, " ").replace(/^[\s,;/-]+|[\s,;/-]+$/g, "").trim();
  return s && /[a-z]/.test(s) ? s : undefined;
}
function medicationKey(v: ObjectValue): string | undefined {
  const rx = string(v.rxnorm_ingredient), name = ingredient(v.drug_name);
  return rx ? "rx:" + rx : name ? "name:" + name : string(v.drug_name) ? "text:" + normalized(string(v.drug_name)!) : undefined;
}
function sensitivities(text: string): Sensitivity[] | undefined {
  const result: Sensitivity[] = [];
  if (/\b(depress(?:ion|ive)|bipolar|schizophren\w*|anxiety|ptsd|post[- ]traumatic stress|obsessive.compulsive|mental health|sertraline|fluoxetine|escitalopram|lithium|clozapine)\b/i.test(text)) result.push("mental-health");
  if (/\b(?:alcohol|opioid|cocaine|cannabis|stimulant|sedative|tobacco) (?:use disorder|dependence|abuse)|\bsubstance use disorder\b|\bbuprenorphine\b/i.test(text)) result.push("substance-use");
  if (/\bpregnan\w*|\bcontracepti\w*|\binfertility\b|\berectile dysfunction\b|\bendometriosis\b/i.test(text)) result.push("sexual-reproductive-health");
  if (/\bHIV\b|\bAIDS\b|\bsyphilis\b|\bgonorrh\w*|\bchlamydia\b|\bgenital herpes\b/i.test(text)) result.push("hiv-sti");
  if (/\bgenetic\b|\bBRCA[12]?\b|\bHuntington\w*|\bcystic fibrosis\b|\bsickle cell\b/i.test(text)) result.push("genetic");
  return result.length ? result : undefined;
}
function doseOf(v: ObjectValue): MedicationRow["dose"] {
  const s = string(v.dose_text);
  if (!s || /\b(?:or|to|sliding|scale|per kg|as directed)\b|\d\s*[-–]\s*\d/i.test(s)) return undefined;
  const m = /^\s*(\d+(?:\.\d+)?|\.\d+|\d+\s*\/\s*\d+)\s*(mg|mcg|µg|μg|g|ml|units?|unt|\[iu\]|iu|tablets?|tabs?|capsules?|caps?)\s*$/i.exec(s);
  if (!m) return undefined;
  const fraction = m[1].split("/");
  let amount = fraction.length === 2 ? +fraction[0] / +fraction[1] : +m[1];
  if (!Number.isFinite(amount) || amount < 0) return undefined;
  const raw = m[2].toLowerCase();
  let unit: NonNullable<MedicationRow["dose"]>["unit"];
  if (raw === "g") { unit = "mg"; amount *= 1000; }
  else if (["mcg", "µg", "μg"].includes(raw)) unit = "mcg";
  else if (raw === "mg") unit = "mg";
  else if (raw === "ml") unit = "mL";
  else if (/^(unit|unt|\[iu\]|iu)/.test(raw)) unit = "units";
  else {
    const strengths = [...(string(v.drug_name) ?? "").matchAll(/\b(\d+(?:\.\d+)?)\s*(mg|mcg|µg|μg|g)\b/gi)];
    const strength = strengths.length === 1 ? strengths[0] : undefined;
    if (strength && !/\d\s*\/\s*\d/.test(string(v.drug_name) ?? "")) {
      amount *= +strength[1] * (strength[2].toLowerCase() === "g" ? 1000 : 1);
      unit = /mcg|µg|μg/i.test(strength[2]) ? "mcg" : "mg";
    } else if (/^tab/.test(raw)) unit = "tablet";
    else return undefined; // The target has no unknown-strength capsule unit.
  }
  return { value: amount, unit };
}
function frequency(v: unknown): MedicationRow["frequency"] {
  const s = string(v);
  if (!s) return undefined;
  if (/\bprn\b|as needed/i.test(s)) return "PRN";
  if (/twice (?:a |per )?week|twice weekly|[234] times (?:a |per )?week/i.test(s)) return "other";
  if (/\bqw\b|once (?:a |per )?week|weekly|every 7 days/i.test(s)) return "QW";
  if (/\bbid\b|(?:twice|2 times) (?:a |per )?day|(?:twice|2 times) daily|every 12 hours|\bq12h\b/i.test(s)) return "BID";
  if (/\btid\b|(?:three|3) times (?:a |per )?day|(?:three|3) times daily|every 8 hours|\bq8h\b/i.test(s)) return "TID";
  if (/\bqid\b|\bqod\b|four times|every other day|alternate days|\bq[1-6]h\b|every [1-6] hours/i.test(s)) return "other";
  if (/\bqhs\b|\b(?:at )?bedtime\b|\bnightly\b|every night/i.test(s)) return "QHS";
  if (/\bqd\b|once (?:a |per )?day|once daily|\bdaily\b|every (?:24 hours|morning)|\bq24h\b|\bqam\b/i.test(s)) return "QD";
  if (/\b(?:q\d+h|qid|qod|every|times|alternate|morning|evening|week|hour|day)\b/i.test(s)) return "other";
  return undefined;
}
function stopReason(v: unknown): MedicationRow["stop_reason"] {
  const s = string(v);
  if (!s) return undefined;
  if (/adverse|side effect|intoleran|allerg|due to.*(?:cough|rash|angioedema|ketoacidosis|acidosis|hyperkalemia)|caused/i.test(s)) return "adverse_reaction";
  if (/ineffective|not (?:effective|working)|lack of (?:effect|benefit)|no benefit/i.test(s)) return "ineffective";
  if (/replac|switch|changed to|instead/i.test(s)) return "therapy_changed";
  if (/course.*(?:complet|finish)|(?:complet|finish).*course|therapy completed/i.test(s)) return "course_complete";
  if (/patient.*(?:declin|prefer|request|cho(?:se|ice)|refus)|at (?:his|her|their) request/i.test(s)) return "patient_choice";
  // A bare "stop" instruction is not a reason.
  return /because|due to|for |reason|contraindicat|no longer (?:needed|indicated)/i.test(s) ? "other" : undefined;
}
function medicationRows(docs: Document[]): MedicationRow[] {
  const stays = new Map<string, Document[]>();
  for (const d of docs) if (d.enc) {
    const group = stays.get(d.encounter) ?? [];
    group.push(d); stays.set(d.encounter, group);
  }
  // Each stay has one authoritative snapshot: its last discharge summary, or
  // its latest signed note while discharge instructions do not yet exist.
  const snapshots: Document[] = [];
  for (const stay of stays.values()) {
    const discharges = stay.filter(d => d.enc?.document_kind === "discharge_summary");
    snapshots.push((discharges.length ? discharges : stay).slice().sort(docOrder).at(-1)!);
  }
  const snapshot = snapshots.sort(docOrder).at(-1);
  if (!snapshot) return [];
  const rows = new Map<string, MedicationRow>();
  const rxByName = new Map<string, string>();
  for (const e of snapshot.entries) if (e.value.type === "home_med") {
    const name = ingredient(e.value.drug_name), rx = string(e.value.rxnorm_ingredient);
    if (name && rx) rxByName.set(name, rx);
  }
  const statuses: Record<string, MedicationRow["status"]> = {
    not_reconciled: "unknown", continue: "active", new: "active", changed: "active", held: "held", stopped: "stopped",
  };
  for (const entry of snapshot.entries) {
    const v = entry.value;
    if (v.type !== "home_med") continue;
    const name = string(v.drug_name), ing = ingredient(v.drug_name), status = lookup(statuses, string(v.status) ?? "");
    const identity = ing && rxByName.has(ing) ? "rx:" + rxByName.get(ing) : medicationKey(v);
    if (!name || !status || !identity) continue;
    const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: evidence({ doc: snapshot, entry }) };
    if (ing) row.ingredient = ing;
    const rx = string(v.rxnorm_ingredient); if (rx) row.rxnorm_ingredient = rx;
    const dose = doseOf(v); if (dose) row.dose = dose;
    const freq = frequency(v.sig); if (freq) row.frequency = freq;
    const reason = string(v.instructions);
    if ((status === "held" || status === "stopped") && reason) row.status_reason_text = reason;
    if (status === "stopped") { const stop = stopReason(reason); if (stop) row.stop_reason = stop; }
    const sensitive = sensitivities(ing ?? name); if (sensitive) row.sensitivity = sensitive;
    // HomeMed has no start/hold/stop date. A note date is not a medication onset.
    // restart_advice never changes a held line into a stopped or active line.
    const old = rows.get(identity);
    if (!old || (old.status === "stopped" && status !== "stopped") || v.status === "changed" || v.status === "new") rows.set(identity, row);
    else if (old.status === row.status && JSON.stringify(old.dose) === JSON.stringify(row.dose) && old.frequency === row.frequency) old.evidence = mergeEvidence(old.evidence, row.evidence);
  }
  return [...rows.values()].sort((a, b) => compare(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name));
}

function diagnosisText(v: ObjectValue): string {
  return [string(v.label) ?? string(v.condition) ?? "", string(object(v.riverside_dx)?.name) ?? ""].join("; ");
}
function icd(v: ObjectValue): string | undefined {
  const s = string(v.icd10cm)?.toUpperCase();
  if (!s || !/^[A-Z]\d[A-Z0-9](?:\.?[A-Z0-9]{1,4})?$/.test(s)) return undefined;
  return s.includes(".") || s.length === 3 ? s : s.slice(0, 3) + "." + s.slice(3);
}
function conditionName(v: ObjectValue): string {
  return (string(v.label) ?? string(v.condition) ?? "")
    .toLowerCase().replace(/\br\s*\/\s*o\b|\brule[ -]?out\b|\b(?:suspected|possible|probable|resolved|active)\b/g, "")
    .replace(/\baki\b/g, "acute kidney injury").replace(/\bckd\b/g, "chronic kidney disease")
    .replace(/\bdka\b/g, "diabetic ketoacidosis").replace(/\bhtn\b/g, "hypertension")
    .replace(/\bt2dm\b/g, "type 2 diabetes").replace(/\bt1dm\b/g, "type 1 diabetes");
}
function family(v: ObjectValue): string | undefined {
  const text = conditionName(v).trim(), code = icd(v) ?? "";
  if (/^N18\b/.test(code) || /chronic kidney disease|chronic renal (?:disease|failure|insufficiency)/.test(text)) return "ckd";
  if (/^N17\b/.test(code) || /acute kidney injury|acute renal failure/.test(text)) return "aki";
  if (code === "E87.5" || /^(?:\s*hyperkal[ae]mia\s*)$/.test(text)) return "hyperkalemia";
  if (/^K85\b/.test(code) || /^(?:acute )?pancreatitis\b/.test(text)) return "pancreatitis";
  if (code === "I10" || /^(?:\s*(?:essential |primary |systemic )?hypertension\s*)$/.test(text)) return "hypertension";
  if (/diabetic ketoacidosis|ketoacidosis.*diabet|euglyc[ae]mic.*ketoacidosis/.test(text) || /^E(?:08|09|10|11|13)\.1/.test(code)) return "dka";
  if (!/ketoacidosis/.test(text) && /(?:type (?:2|ii) diabetes|diabetes mellitus.*type (?:2|ii))/.test(text)) return "type2-diabetes";
  if (!/ketoacidosis/.test(text) && /(?:type (?:1|i) diabetes|diabetes mellitus.*type (?:1|i))/.test(text)) return "type1-diabetes";
  return undefined;
}
function stage(v: ObjectValue): ProblemRow["ckd_stage"] {
  if (family(v) !== "ckd") return undefined;
  const text = diagnosisText(v);
  const m = /\b(?:stage\s*|G)(3a|3b|[1245])\b/i.exec(text);
  if (m) return ("G" + m[1].toLowerCase()) as ProblemRow["ckd_stage"];
  const codes: Record<string, NonNullable<ProblemRow["ckd_stage"]>> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
  };
  return codes[icd(v) ?? ""];
}
type ConditionGroup = { facts: Fact[]; established: Fact[]; current?: Fact };
function conditions(docs: Document[]): ConditionGroup[] {
  const facts: Fact[] = [];
  for (const doc of docs) for (const entry of doc.entries) {
    if ((entry.value.type === "diagnosis" && string(entry.value.label)) ||
        (entry.value.type === "history" && string(entry.value.condition))) facts.push({ doc, entry });
  }
  // Local diagnoses can distinguish conditions sharing a coarse ICD code. Only
  // bridge an uncoded/ICD-only mention when the matching local identity is unique.
  const localByAlias = new Map<string, Set<string>>();
  const strongByName = new Map<string, Set<string>>();
  const aliases = (v: ObjectValue): string[] => {
    const a = ["name:" + normalized(conditionName(v))];
    const c = icd(v), f = family(v);
    if (c) a.push("icd:" + c);
    if (f) a.push("family:" + f);
    return a;
  };
  for (const { entry } of facts) {
    const v = entry.value, local = string(object(v.riverside_dx)?.code);
    for (const alias of aliases(v)) if (local) {
      const set = localByAlias.get(alias) ?? new Set<string>(); set.add(local); localByAlias.set(alias, set);
    }
    const c = icd(v);
    if (c) {
      const n = "name:" + normalized(conditionName(v)), set = strongByName.get(n) ?? new Set<string>();
      set.add(c); strongByName.set(n, set);
    }
  }
  const groups = new Map<string, Fact[]>();
  for (const f of facts) {
    const v = f.entry.value, fam = family(v), local = string(object(v.riverside_dx)?.code);
    let identity: string | undefined;
    if (fam === "ckd") identity = "family:ckd"; // Restaging is the same condition.
    else if (local) identity = "local:" + local;
    else {
      for (const alias of aliases(v)) {
        const set = localByAlias.get(alias);
        if (set?.size === 1) { identity = "local:" + [...set][0]; break; }
      }
    }
    if (!identity) {
      const code = icd(v), name = "name:" + normalized(conditionName(v));
      const nameCodes = strongByName.get(name);
      identity = fam ? "family:" + fam : code ? "icd:" + code : nameCodes?.size === 1 ? "icd:" + [...nameCodes][0] : name;
    }
    const k = key(f.doc.item.issuer, identity), group = groups.get(k) ?? [];
    group.push(f); groups.set(k, group);
  }
  const result: ConditionGroup[] = [];
  for (const facts of groups.values()) {
    facts.sort(factOrder);
    const perStay = new Map<string, Fact[]>();
    for (const f of facts.filter(f => f.entry.value.type === "diagnosis")) {
      const group = perStay.get(f.doc.encounter) ?? []; group.push(f); perStay.set(f.doc.encounter, group);
    }
    const established: Fact[] = [];
    for (const group of perStay.values()) {
      // Clinical order describes the workup within a stay. A later exclusion
      // defeats that stay's working/established diagnosis, but not past episodes.
      group.sort(factOrder);
      let accepted: Fact | undefined;
      for (const f of group) {
        if (f.entry.value.status === "ruled_out") accepted = undefined;
        else if (f.entry.value.status === "active" || f.entry.value.status === "resolved") accepted = f;
      }
      if (accepted) established.push(accepted);
    }
    established.sort(factOrder);
    // A re-copied history is not a new clinician assessment of, for example, CKD stage.
    let current = established.at(-1);
    if (!current) current = facts.filter(f => f.entry.value.type === "history" &&
      !facts.some(later => later.doc.encounter === f.doc.encounter && factOrder(later, f) >= 0 &&
        later.entry.value.type === "diagnosis" && later.entry.value.status === "ruled_out")).at(-1);
    result.push({ facts, established, current });
  }
  return result;
}
function onlyAdverseEffect(v: ObjectValue): boolean {
  const text = diagnosisText(v);
  return /^T(?:3[6-9]|[4-5]\d)/.test(icd(v) ?? "") &&
    !/\b(?:ketoacidosis|DKA|lactic acidosis|hyperkalemia|angioedema|anaphylaxis|rash|hives|cough|myalgia|hepatitis|renal failure|kidney injury|hypoglycemia|pancreatitis|bleeding|hemorrhage)\b/i.test(text);
}
function problemRows(groups: ConditionGroup[]): ProblemRow[] {
  const rows: ProblemRow[] = [];
  for (const g of groups) {
    const f = g.current;
    if (!f || onlyAdverseEffect(f.entry.value)) continue;
    const v = f.entry.value, condition = string(v.label) ?? string(v.condition);
    if (!condition) continue;
    const historical = /\b(?:history of|h\/o|resolved|remote|in remission)\b/i.test(condition);
    const row: ProblemRow = { condition,
      status: v.type === "diagnosis" ? v.status === "resolved" ? "resolved" : "active" : historical ? "resolved" : "active",
      evidence: evidence(f) };
    const code = icd(v); if (code) row.icd10cm = code;
    const history = g.facts.filter(x => x.entry.value.type === "history" && partialDate(x.entry.value.onset_text)).at(-1);
    if (history) { row.onset = partialDate(history.entry.value.onset_text); row.evidence = mergeEvidence(row.evidence, evidence(history)); }
    if (family(v) === "ckd") {
      const staging = [...g.established].reverse().find(x => stage(x.entry.value)) ??
        [...g.facts].reverse().find(x => x.entry.value.type === "history" && stage(x.entry.value));
      if (staging) { row.ckd_stage = stage(staging.entry.value); row.evidence = mergeEvidence(row.evidence, evidence(staging)); }
      const albumin = [...g.established, ...(!g.established.length ? g.facts : [])].reverse()
        .find(x => /\bA[123]\b/.test(diagnosisText(x.entry.value)));
      if (albumin) {
        row.albuminuria = /\b(A[123])\b/.exec(diagnosisText(albumin.entry.value))![1] as ProblemRow["albuminuria"];
        row.evidence = mergeEvidence(row.evidence, evidence(albumin));
      }
    }
    const sensitive = sensitivities(condition); if (sensitive) row.sensitivity = sensitive;
    rows.push(row);
  }
  return rows.sort((a, b) => compare(a.condition, b.condition));
}

type DrugClass = { label: RegExp; members: RegExp };
const drugClasses: DrugClass[] = [
  { label: /\bSGLT[- ]?2(?:\s+inhibitors?)?\b|\bsodium[- ]glucose (?:co[- ]?transporter|cotransport)\s*2 inhibitors?\b/i,
    members: /\b(?:empagliflozin|dapagliflozin|canagliflozin|ertugliflozin|bexagliflozin|sotagliflozin)\b/i },
  { label: /\bACE(?:[- ]inhibitors?)?\b|\bangiotensin[- ]converting enzyme inhibitors?\b/i,
    members: /\b(?:lisinopril|enalapril|ramipril|benazepril|captopril|fosinopril|perindopril|quinapril|trandolapril|moexipril)\b/i },
  { label: /\bARBs?\b|\bangiotensin(?: II| 2)? receptor blockers?\b/i,
    members: /\b(?:losartan|valsartan|irbesartan|candesartan|telmisartan|olmesartan|azilsartan|eprosartan)\b/i },
  { label: /\bstatins?\b|\bHMG[- ]CoA reductase inhibitors?\b/i,
    members: /\b(?:atorvastatin|rosuvastatin|simvastatin|pravastatin|lovastatin|fluvastatin|pitavastatin)\b/i },
  { label: /\bsulfonylureas?\b/i, members: /\b(?:glipizide|glimepiride|glyburide|glibenclamide|gliclazide|chlorpropamide|tolbutamide)\b/i },
  { label: /\bbiguanides?\b/i, members: /\b(?:metformin|phenformin)\b/i },
  { label: /\bDPP[- ]?4 inhibitors?\b/i, members: /\b(?:sitagliptin|saxagliptin|linagliptin|alogliptin|vildagliptin)\b/i },
  { label: /\bGLP[- ]?1(?: receptor)? (?:agonists?|analogues?)\b/i,
    members: /\b(?:semaglutide|liraglutide|dulaglutide|exenatide|lixisenatide|albiglutide)\b/i },
  { label: /\bNSAIDs?\b|\bnon[- ]steroidal anti[- ]inflammatory (?:drugs?|agents?)\b/i,
    members: /\b(?:ibuprofen|naproxen|diclofenac|meloxicam|celecoxib|indomethacin|ketorolac|piroxicam)\b/i },
  { label: /\bpenicillins?\b/i, members: /\b(?:penicillin|amoxicillin|ampicillin|piperacillin|nafcillin|oxacillin|dicloxacillin)\b/i },
  { label: /\bthiazides?(?: diuretics?)?\b/i, members: /\b(?:hydrochlorothiazide|chlorthalidone|indapamide|metolazone)\b/i },
  { label: /\b(?:oral )?(?:hypoglycemic|antidiabetic) (?:drugs?|agents?)\b/i,
    members: /\b(?:metformin|empagliflozin|dapagliflozin|canagliflozin|ertugliflozin|glipizide|glimepiride|glyburide|gliclazide|sitagliptin|linagliptin|saxagliptin|alogliptin|pioglitazone|rosiglitazone|repaglinide|nateglinide|acarbose)\b/i },
];
type Substance = { substance: string; rx?: string; evidence: Evidence };
function escaped(s: string): string { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function mentioned(text: string, name: string): boolean {
  return new RegExp("(?:^|[^a-z])" + escaped(name) + "(?:$|[^a-z])", "i").test(text);
}
function drugsIn(doc: Document): { name: string; rx?: string; fact: Fact }[] {
  const drugs: { name: string; rx?: string; fact: Fact }[] = [];
  for (const entry of doc.entries) {
    if (entry.value.type !== "home_med" && entry.value.type !== "inpatient_med") continue;
    const name = ingredient(entry.value.drug_name);
    if (name) drugs.push({ name, rx: string(entry.value.rxnorm_ingredient), fact: { doc, entry } });
  }
  return drugs.sort((a, b) => b.name.length - a.name.length || compare(a.name, b.name));
}
function culprit(f: Fact): Substance | undefined {
  const text = diagnosisText(f.entry.value);
  if (/\b(?:due to|from|secondary to)\s+(?:missed|missing|lack of|omission|non[- ]?adherence|noncompliance|withdrawal)|\bnot (?:drug[- ]related|associated with|due to)|\bunrelated to\b/i.test(text)) return undefined;
  if (!/associat|induc|due to|secondary to|caused by|attribut|adverse (?:effect|reaction)|toxicity|poisoning|related|from /i.test(text) &&
      !/^T(?:3[6-9]|4\d|50)/.test(icd(f.entry.value) ?? "")) return undefined;
  const meds = drugsIn(f.doc);
  // Specific names take priority over a drug class in the same diagnosis.
  const direct = meds.find(m => mentioned(text, m.name) ||
    Object.entries(brands).some(([b, generic]) => generic === m.name && mentioned(text, b)));
  if (direct) return { substance: direct.name, rx: direct.rx, evidence: evidence(direct.fact) };
  const known = [...new Set([...Object.values(brands),
    "enalapril", "ramipril", "benazepril", "captopril", "amiodarone", "methotrexate", "allopurinol",
    "amoxicillin", "penicillin", "trimethoprim", "sulfamethoxazole", "nitrofurantoin", "dapsone",
    "carbamazepine", "lamotrigine", "phenytoin", "valproate", "lithium", "heparin", "prednisone",
  ])].filter(n => !n.includes(" / ")).sort((a, b) => b.length - a.length || compare(a, b));
  for (const name of known) if (mentioned(text, name)) return { substance: name, evidence: [] };
  for (const [brand, name] of Object.entries(brands)) if (mentioned(text, brand)) return { substance: name, evidence: [] };
  for (const c of drugClasses) {
    const match = c.label.exec(text);
    if (!match) continue;
    const candidates = new Map<string, { name: string; rx?: string; facts: Fact[] }>();
    for (const m of meds) {
      const member = c.members.exec(m.name)?.[0]?.toLowerCase();
      if (!member) continue;
      const old = candidates.get(member);
      candidates.set(member, { name: member, rx: m.name === member ? m.rx : undefined, facts: [...(old?.facts ?? []), m.fact] });
    }
    if (candidates.size === 1) {
      const m = [...candidates.values()][0];
      return { substance: m.name, rx: m.rx, evidence: evidence(...m.facts) };
    }
    return { substance: match[0], evidence: [] };
  }
  // Explicit adverse-effect wording can name an unfamiliar substance/class. Do
  // not turn arbitrary causes (starvation, infection, missed doses) into drugs.
  const named = /\badverse (?:effect|reaction) (?:of|to)\s+([^;,()]+)/i.exec(text)?.[1]?.trim();
  if (named && !/^(?:a |the )?(?:drug|medication)(?:s| unspecified)?$/i.test(named))
    return { substance: /\s/.test(named) ? named : ingredient(named) ?? named, evidence: [] };
  return undefined;
}
function reactionKind(reaction: string, substance: string, severity?: string): Pick<AllergyIntoleranceRow, "reaction_type" | "mechanism" | "criticality"> {
  const hyper = /hives|urticaria|rash|angioedema|anaphyla|bronchospasm|Stevens.Johnson|toxic epidermal|\bSJS\b|\bDRESS\b/i.test(reaction);
  const serious = /ketoacidosis|\bDKA\b|lactic acidosis|severe hyperkalemia|life.threatening|renal failure|kidney injury|hepatotoxic|liver (?:failure|injury)|rhabdomyolysis|agranulocytosis|severe hypoglycemia|major bleeding|hemorrhage|pancreatitis|pulmonary toxicity|torsades/i.test(reaction);
  const side = /cough|nausea|vomiting|diarrh|GI upset|gastrointestinal|myalgia|muscle (?:pain|ache)|headache|dizz|constipation|fatigue|edema|oedema|intoleran|stomach upset/i.test(reaction);
  // The target has no unspecified-reaction enum. Preserve an uncharacterized
  // allergy-list entry with unknown mechanism/criticality rather than dropping it.
  const reaction_type: AllergyIntoleranceRow["reaction_type"] = hyper ? "hypersensitivity" : serious ? "serious_adverse_event" : side ? "side_effect" : severity === "severe" ? "serious_adverse_event" : "hypersensitivity";
  const ace = drugClasses[1].members.test(substance) || drugClasses[1].label.test(substance);
  let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
  if (/non[- ]immune|bradykinin/i.test(reaction) || (ace && /cough|angioedema/i.test(reaction)) || /ketoacidosis|\bDKA\b|lactic acidosis/i.test(reaction) || (side && !hyper && !serious)) mechanism = "non_immune";
  else if (/\bIgE\b|\bT[- ]cell\b|immune[- ]mediated|(?:positive|confirmed) allergy test/i.test(reaction)) mechanism = "immune";
  const dangerous = serious || /anaphyla|angioedema|bronchospasm|Stevens.Johnson|toxic epidermal|\bSJS\b|\bDRESS\b/i.test(reaction);
  const criticality: AllergyIntoleranceRow["criticality"] = severity === "severe" || dangerous ? "high" : severity === "mild" || side ? "low" : "unknown";
  return { reaction_type, mechanism, criticality };
}
function allergyRows(docs: Document[], groups: ConditionGroup[]): AllergyIntoleranceRow[] {
  const rows = new Map<string, AllergyIntoleranceRow>();
  const put = (row: AllergyIntoleranceRow): void => {
    const k = normalized(row.substance);
    const existingKey = [...rows.keys()].find(k2 => row.rxnorm_ingredient && rows.get(k2)?.rxnorm_ingredient === row.rxnorm_ingredient) ?? k;
    const old = rows.get(existingKey);
    if (!old) { rows.set(k, row); return; }
    const reactions = [...new Set([...(old.reaction?.split("; ") ?? []), ...(row.reaction?.split("; ") ?? [])])];
    if (reactions.length) old.reaction = reactions.join("; ");
    old.evidence = mergeEvidence(old.evidence, row.evidence);
    if (row.rxnorm_ingredient) old.rxnorm_ingredient = row.rxnorm_ingredient;
    if (row.criticality === "high" || (row.criticality === "low" && old.criticality === "unknown")) old.criticality = row.criticality;
    if (row.reaction_type === "serious_adverse_event" ||
        (row.reaction_type === "hypersensitivity" && old.reaction_type === "side_effect")) old.reaction_type = row.reaction_type;
    if (old.mechanism === "unknown") old.mechanism = row.mechanism;
    else if (row.mechanism !== "unknown" && old.mechanism !== row.mechanism) old.mechanism = "unknown";
    if (row.sensitivity) old.sensitivity = [...new Set([...(old.sensitivity ?? []), ...row.sensitivity])];
  };
  // Riverside republishes the whole allergy list, including an explicit NKDA.
  const snapshot = docs.filter(d => d.enc || d.entries.some(e => e.value.type === "allergy")).at(-1);
  if (snapshot) for (const entry of snapshot.entries) {
    const v = entry.value, name = string(v.substance);
    if (v.type !== "allergy" || !name || /^(?:NKDA|NKA|no known (?:drug )?allergies)$/i.test(name)) continue;
    const rx = string(v.rxnorm_ingredient);
    const isClass = drugClasses.some(c => c.label.test(name)) && !drugClasses.some(c => c.members.test(name));
    const namedDrug = drugClasses.some(c => c.members.test(name)) ||
      drugsIn(snapshot).some(m => normalized(m.name) === normalized(name)) ||
      [...Object.values(brands).flatMap(n => n.split(" / ")), ...Object.keys(brands)].some(n => mentioned(name, n));
    const substance = !isClass && (rx || namedDrug) ? ingredient(name) ?? name : name;
    const reaction = string(v.reaction);
    const row: AllergyIntoleranceRow = { substance, ...reactionKind(reaction ?? "", substance, string(v.severity)), evidence: evidence({ doc: snapshot, entry }) };
    if (rx) row.rxnorm_ingredient = rx;
    if (reaction) row.reaction = reaction;
    const sensitive = sensitivities(reaction ?? ""); if (sensitive) row.sensitivity = sensitive;
    put(row);
  }
  for (const group of groups) {
    const survivingStays = new Set(group.established.map(f => f.doc.encounter));
    const latestBySubstance = new Map<string, { fact: Fact; substance: Substance }>();
    for (const fact of group.facts) {
      if (!survivingStays.has(fact.doc.encounter) || !["active", "resolved"].includes(string(fact.entry.value.status) ?? "")) continue;
      const substance = culprit(fact);
      if (substance) latestBySubstance.set(normalized(substance.substance), { fact, substance });
    }
    for (const { fact, substance } of latestBySubstance.values()) {
      const v = fact.entry.value;
      let reaction = onlyAdverseEffect(v) ? undefined : string(v.label);
      let supporting: Evidence = [];
      if (!reaction) {
        // A T-code often names the causative drug, while a neighboring diagnosis
        // supplies the actual clinical reaction. Do not treat the T-code as a disease.
        const companions: Fact[] = [];
        for (const entry of fact.doc.entries) if (entry.value.type === "diagnosis" &&
            ["active", "resolved"].includes(string(entry.value.status) ?? "") && !onlyAdverseEffect(entry.value)) {
          const f = { doc: fact.doc, entry }, cause = culprit(f);
          if (cause && normalized(cause.substance) === normalized(substance.substance)) companions.push(f);
        }
        reaction = [...new Set(companions.map(f => string(f.entry.value.label)).filter((s): s is string => !!s))].join("; ") || undefined;
        supporting = evidence(...companions);
      }
      const row: AllergyIntoleranceRow = {
        substance: substance.substance, ...reactionKind(reaction ?? "", substance.substance),
        evidence: mergeEvidence(evidence(fact), substance.evidence, supporting),
      };
      if (substance.rx) row.rxnorm_ingredient = substance.rx;
      if (reaction) row.reaction = reaction;
      const sensitive = sensitivities(reaction ?? ""); if (sensitive) row.sensitivity = sensitive;
      put(row);
    }
  }
  return [...rows.values()].sort((a, b) => compare(a.substance, b.substance));
}

const units: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const loincs: Record<string, Analyte> = {
  "2160-0": "creatinine", "14682-9": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "62239-9": "egfr", "48642-3": "egfr", "48643-1": "egfr",
  "33914-3": "egfr", "69405-9": "egfr", "76497-8": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride", "2028-9": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "10466-1": "anion_gap", "1863-0": "anion_gap",
  "3094-0": "bun", "14937-7": "bun", "2345-7": "glucose", "14749-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "14958-3": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin",
  "6873-4": "bhb", "53060-3": "bhb", "1977-8": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2753-2": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "14647-2": "cholesterol", "2571-8": "triglycerides", "14927-8": "triglycerides",
  "2085-9": "hdl", "14646-4": "hdl", "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl", "22748-8": "ldl",
};
const localTests: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", EGFR: "egfr", NA: "sodium", K: "potassium", CL: "chloride",
  CO2: "bicarbonate", TCO2: "bicarbonate", AGAP: "anion_gap", BUN: "bun", GLU: "glucose", GLUCOSE: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", BHB: "bhb",
  VPH: "ph", APH: "ph", PH: "ph", VPCO2: "pco2", APCO2: "pco2", PCO2: "pco2", LIPASE: "lipase",
  TNI: "troponin", TROPONINI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl",
};
function analyteOf(v: ObjectValue, specimen: string): Analyte | undefined {
  const test = object(v.test);
  if (!test) return undefined;
  const name = string(test.name) ?? "", local = string(test.local_code) ?? "", loinc = string(test.loinc) ?? "";
  let a: Analyte | undefined = lookup(loincs, loinc) ?? lookup(localTests, local.toUpperCase());
  if (!a) {
    const matches: [RegExp, Analyte][] = [
      [/\beGFR\b|estimated glomerular filtration/i, "egfr"],
      [/(?:albumin|microalbumin).*(?:creatinine).*(?:ratio)|\bUACR\b/i, "uacr"],
      [/\b(?:HbA1c|A1c)\b|glycat(?:ed|es).*hemoglobin|hemoglobin A1/i, "a1c"],
      [/\bcreatinine\b/i, "creatinine"], [/\bpotassium\b/i, "potassium"], [/\bsodium\b/i, "sodium"],
      [/\bchloride\b/i, "chloride"], [/total (?:CO2|carbon dioxide)|^bicarbonate(?:\s*\(total CO2\))?$/i, "bicarbonate"],
      [/anion gap/i, "anion_gap"], [/urea nitrogen|\bBUN\b/i, "bun"], [/^glucose(?:\s*[,([]\s*(?:serum|plasma).*)?$/i, "glucose"],
      [/platelet(?:s| count)?/i, "platelets"], [/white blood (?:cell|count)|leukocyte|\bWBC\b/i, "wbc"],
      [/^hemoglobin(?:,? (?:blood|whole blood))?$/i, "hemoglobin"], [/hydroxybutyrate|\bBHB\b/i, "bhb"],
      [/^pH(?:[, (]|$)/i, "ph"], [/\bpCO2\b|carbon dioxide partial pressure/i, "pco2"], [/\blipase\b/i, "lipase"],
      [/troponin[- ]?I\b/i, "troponin"], [/\bHDL\b|high.density lipoprotein/i, "hdl"],
      [/\bLDL\b|low.density lipoprotein/i, "ldl"], [/triglycerides?/i, "triglycerides"], [/cholesterol(?:,? total)?/i, "cholesterol"],
    ];
    a = matches.find(([pattern]) => pattern.test(name))?.[1];
  }
  const context = name + " " + specimen;
  if ((a === "creatinine" || a === "glucose") && /urine|\burinary\b|\bCSF\b|cerebrospinal|pleural|peritoneal/i.test(context)) return undefined;
  if (a === "glucose" && /capillary|point.of.care|\bPOC\b|meter|whole blood/i.test(context)) return undefined;
  if ((a === "ph" || a === "pco2") && /urine|gastric|pleural/i.test(context)) return undefined;
  if (a === "bicarbonate" && /blood gas|\bHCO3\b/i.test(name) && !/total CO2/i.test(name)) return undefined;
  if (a === "troponin" && /troponin[- ]?T\b/i.test(name)) return undefined;
  return a;
}
function numericResult(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const s = string(v)?.replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/−/g, "-");
  if (!s) return undefined;
  const m = /^(<=|>=|<|>)?\s*([+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(s);
  if (!m) return undefined;
  const value = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(value)) return undefined;
  return m[1] ? { value, comparator: m[1] as LabResultRow["comparator"] } : { value };
}
function unitKey(v: string): string {
  return v.toLowerCase().replace(/[µμ]/g, "u").replace(/²/g, "2").replace(/³/g, "3")
    .replace(/\^/g, "*").replace(/\s/g, "").replace(/[{}]/g, "");
}
function converted(a: Analyte, value: number, sourceUnit: unknown): number | undefined {
  const raw = string(sourceUnit), u = raw ? unitKey(raw) : "";
  if (u === unitKey(units[a])) return value;
  let factor: number | undefined, intercept = 0;
  if (a === "ph" && ["", "ph", "1", "[ph]"].includes(u)) factor = 1;
  else if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") factor = 1;
  else if (a === "egfr" && ["ml/min/1.73m*2", "ml/min/1.73m²", "ml/min/(1.73m2)"].includes(u)) factor = 1;
  else if (["platelets", "wbc"].includes(a)) {
    if (["10*9/l", "10e9/l", "x10*9/l", "k/ul", "10e3/ul", "x10*3/ul", "thousand/ul", "thousands/ul"].includes(u)) factor = 1;
    else if (["cells/ul", "/ul", "1/ul", "cells/mm3"].includes(u)) factor = 0.001;
  } else if (a === "creatinine" && ["umol/l", "micromol/l"].includes(u)) factor = 1 / 88.4;
  else if (a === "glucose" && u === "mmol/l") factor = 18.016;
  else if (["cholesterol", "hdl", "ldl"].includes(a) && u === "mmol/l") factor = 38.67;
  else if (a === "triglycerides" && u === "mmol/l") factor = 88.57;
  else if (a === "bun" && u === "mmol/l") factor = 2.801;
  else if (a === "hemoglobin" && u === "g/l") factor = 0.1;
  else if (a === "bhb" && u === "mg/dl") factor = 1 / 10.41;
  else if (a === "bhb" && u === "umol/l") factor = 0.001;
  else if (a === "uacr") {
    if (u === "mg/mmol") factor = 8.84;
    else if (u === "ug/mg" || u === "mcg/mg") factor = 1;
    else if (u === "mg/mg" || u === "g/g") factor = 1000;
  } else if (a === "a1c" && u === "mmol/mol") { factor = 0.09148; intercept = 2.152; }
  else if (a === "pco2" && u === "kpa") factor = 7.50062;
  else if (a === "troponin" && ["ng/l", "pg/ml"].includes(u)) factor = 0.001;
  else if (a === "lipase" && u === "iu/l") factor = 1;
  else if (a === "lipase" && u === "ukat/l") factor = 60;
  else if (units[a] === "mg/dL" && u === "mg/l") factor = 0.1;
  if (factor === undefined) return undefined;
  const result = value * factor + intercept;
  return Number.isFinite(result) ? Number(result.toPrecision(12)) : undefined;
}
type LabCopy = { fact: Fact; value: ObjectValue; accession: string; collected: string; specimen: string; status: string; rank: number; index: number };
function labRows(docs: Document[]): LabResultRow[] {
  const copies = new Map<string, LabCopy>();
  const rank: Record<string, number> = { preliminary: 0, final: 1, corrected: 2 };
  for (const doc of docs) for (const entry of doc.entries) {
    const v = entry.value;
    if (v.type !== "result" && v.type !== "panel") continue;
    const accession = string(v.accession), collected = rfc3339(v.collected), status = string(v.status);
    if (!accession || !collected || !status || lookup(rank, status) === undefined) continue;
    const values = v.type === "panel" ? Array.isArray(v.components) ? v.components : [] : [v];
    for (let index = 0; index < values.length; index++) {
      const value = object(values[index]), test = object(value?.test), code = string(test?.local_code);
      if (!value || !code) continue;
      const k = key(doc.item.issuer, accession, code);
      const candidate: LabCopy = { fact: { doc, entry }, value, accession, collected, specimen: string(v.specimen) ?? "", status, rank: rank[status], index };
      const old = copies.get(k);
      if (!old || candidate.rank > old.rank || (candidate.rank === old.rank &&
          (signedOrder(doc, old.fact.doc) || compare(entry.id, old.fact.entry.id) || index - old.index) > 0)) copies.set(k, candidate);
    }
  }
  const rows: LabResultRow[] = [];
  // Choose the winning copy BEFORE parsing it: a corrected nonnumeric value must
  // not resurrect a superseded, numeric preliminary/final value.
  for (const copy of copies.values()) {
    const a = analyteOf(copy.value, copy.specimen), parsed = numericResult(copy.value.value);
    if (!a || !parsed) continue;
    const value = converted(a, parsed.value, copy.value.unit);
    if (value === undefined) continue;
    const test = object(copy.value.test)!, name = string(test.name) ?? "", loinc = string(test.loinc);
    if (a === "egfr") {
      const nonRace = /non[- ]?(?:african|black)|without.*(?:race|coefficient)|race[- ]free|no race|not african/i.test(name);
      if (!nonRace && (/african|\bblack\b|with race|race[- ]adjusted/i.test(name) || loinc === "48643-1" || loinc === "62239-9")) continue;
    }
    const row: LabResultRow = { analyte: a, value, unit: units[a], collected: copy.collected,
      status: copy.status === "preliminary" ? "preliminary" : "final", evidence: evidence(copy.fact) };
    if (parsed.comparator) row.comparator = parsed.comparator;
    if (loinc) row.loinc = loinc;
    if (a === "egfr") {
      row.egfr_equation = /MDRD/i.test(name) ? "mdrd" : /CKD[- ]?EPI.*2009/i.test(name) ? "ckd-epi-2009"
        : /CKD[- ]?EPI.*2021/i.test(name) || copy.collected.slice(0, 4) >= "2023" || loinc === "98979-8" ? "ckd-epi-2021"
        : loinc === "62238-1" || loinc === "62239-9" ? "ckd-epi-2009"
        : loinc === "48642-3" || loinc === "48643-1" || loinc === "33914-3" ? "mdrd" : "unknown";
    }
    rows.push(row);
  }
  return rows.sort((a, b) => Date.parse(a.collected) - Date.parse(b.collected) || compare(a.analyte, b.analyte) ||
    compare(JSON.stringify(a.evidence), JSON.stringify(b.evidence)) || a.value - b.value);
}

type VitalSet = { row: VitalRow; time: number; encounter: string; facts: Fact[] };
function vitalRows(docs: Document[]): VitalRow[] {
  const measurements = new Map<string, VitalSet>();
  for (const doc of docs) for (const entry of doc.entries) {
    const v = entry.value;
    if (v.type !== "vitals") continue;
    const local = localTime(v.taken), time = instant(v.taken);
    if (!local || time === undefined) continue;
    const bp = object(v.bp), systolic = number(bp?.systolic_mmhg), diastolic = number(bp?.diastolic_mmhg);
    const pulse = number(v.heart_rate_bpm), weight = number(v.weight_kg);
    if (systolic === undefined && diastolic === undefined && pulse === undefined && weight === undefined) continue;
    const fact = { doc, entry }, row: VitalRow = { setting: "hospital", local_time: local, evidence: evidence(fact) };
    if (systolic !== undefined) row.systolic_mmhg = systolic;
    if (diastolic !== undefined) row.diastolic_mmhg = diastolic;
    if (pulse !== undefined) row.pulse_bpm = pulse;
    if (weight !== undefined) row.weight_kg = Math.round(weight * 10) / 10;
    const k = key(doc.encounter, String(time)), old = measurements.get(k);
    if (!old) measurements.set(k, { row, time, encounter: doc.encounter, facts: [fact] });
    else {
      // Same taken time is one set, even if another document copies only part of it.
      const newer = signedOrder(doc, old.facts.at(-1)!.doc) >= 0;
      const merged = newer ? { ...old.row, ...row } : { ...row, ...old.row };
      merged.evidence = mergeEvidence(old.row.evidence, row.evidence);
      old.row = merged; old.facts.push(fact); old.facts.sort(factOrder);
    }
  }
  const sorted = [...measurements.values()].sort((a, b) => a.time - b.time || compare(a.encounter, b.encounter));
  const clusters: VitalSet[] = [];
  for (const current of sorted) {
    const prev = [...clusters].reverse().find(c => c.encounter === current.encounter);
    const bp = current.row.systolic_mmhg !== undefined || current.row.diastolic_mmhg !== undefined;
    const prevBP = prev && (prev.row.systolic_mmhg !== undefined || prev.row.diastolic_mmhg !== undefined);
    const sameNote = prev?.facts.some(a => current.facts.some(b => a.doc === b.doc));
    const gap = prev ? current.time - prev.time : Infinity;
    // A stay is not one vital-sign set. Combine measurements within five minutes;
    // a later BP in the same note can be its repeat (within the same assessment hour).
    const together = prev && (gap <= 5 * 60000 || (sameNote && bp && prevBP && gap <= 60 * 60000));
    const hasRepeat = prev?.row.repeat_systolic_mmhg !== undefined || prev?.row.repeat_diastolic_mmhg !== undefined;
    if (!together || (bp && prevBP && hasRepeat)) { clusters.push(current); continue; }
    if (bp && prevBP) {
      if (current.row.systolic_mmhg !== undefined) prev.row.repeat_systolic_mmhg = current.row.systolic_mmhg;
      if (current.row.diastolic_mmhg !== undefined) prev.row.repeat_diastolic_mmhg = current.row.diastolic_mmhg;
    } else if (bp) {
      prev.row.systolic_mmhg = current.row.systolic_mmhg;
      prev.row.diastolic_mmhg = current.row.diastolic_mmhg;
      prev.row.local_time = current.row.local_time; // first BP, even if weight was earlier
    }
    if (prev.row.pulse_bpm === undefined) prev.row.pulse_bpm = current.row.pulse_bpm;
    if (prev.row.weight_kg === undefined) prev.row.weight_kg = current.row.weight_kg;
    prev.row.evidence = mergeEvidence(prev.row.evidence, current.row.evidence);
    prev.facts.push(...current.facts);
  }
  return clusters.map(c => c.row).sort((a, b) => compare(a.local_time, b.local_time) || compare(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const docs = documents(items, asOf), groups = conditions(docs);
  return {
    medications: medicationRows(docs),
    problems: problemRows(groups),
    allergies: allergyRows(docs, groups),
    labs: labRows(docs),
    vitals: vitalRows(docs),
  };
}
