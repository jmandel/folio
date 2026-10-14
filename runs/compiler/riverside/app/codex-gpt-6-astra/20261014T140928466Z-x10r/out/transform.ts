import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// The input is deliberately decoded at runtime: FOLIO payloads need not be well formed.
type Obj = Record<string, unknown>;
type Entry = { id: string; value: Obj };
type Doc = {
  id: string; issuer: string; recorded: number; effective: string;
  end?: string; entries: Entry[]; enc?: Obj; encounter: string;
};
type Fact = { doc: Doc; entry: Entry };
const object = (v: unknown): Obj | undefined =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? v as Obj : undefined;
const str = (v: unknown): string | undefined => typeof v === "string" && v.trim() ? v.trim() : undefined;
const num = (v: unknown): number | undefined => typeof v === "number" && Number.isFinite(v) ? v : undefined;
const lower = (v: unknown): string => (str(v) ?? "").toLowerCase();
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (...parts: string[]): string => JSON.stringify(parts);
const evidence = (f: Fact): Evidence => [{ item_id: f.doc.id, entry_id: f.entry.id }];
function mergeEvidence(...lists: Evidence[]): Evidence {
  const m = new Map<string, Evidence[number]>();
  for (const list of lists) for (const e of list) m.set(key(e.item_id, e.entry_id ?? ""), e);
  return [...m.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id ?? "", b.entry_id ?? ""));
}
const docOrder = (a: Doc, b: Doc): number => a.recorded - b.recorded || cmp(a.issuer, b.issuer) || cmp(a.id, b.id);
const factOrder = (a: Fact, b: Fact): number => docOrder(a.doc, b.doc) || cmp(a.entry.id, b.entry.id);
const entries = (d: Doc, type: string): Fact[] => d.entries.filter(e => e.value.type === type).map(entry => ({ doc: d, entry }));

const chicago = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function wall(ms: number): string {
  const parts: Record<string, string> = {};
  for (const p of chicago.formatToParts(new Date(ms))) parts[p.type] = p.value;
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}
function partial(v: unknown): ProblemRow["onset"] {
  const s = str(v);
  if (!s || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(s)) return;
  const [y, m, d] = s.split("-").map(Number);
  if (y < 1 || (m !== undefined && (m < 1 || m > 12))) return;
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (d !== undefined && (d < 1 || d > days[m - 1])) return;
  return { value: s, precision: s.length === 4 ? "year" : s.length === 7 ? "month" : "day" };
}
function instant(v: unknown): number | undefined {
  const s = str(v);
  if (!s || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?$/i.test(s) ||
      !partial(s.slice(0, 10)) || Number(s.slice(11, 13)) > 23 || Number(s.slice(14, 16)) > 59 ||
      (s.length > 18 && /:\d\d/.test(s.slice(16, 19)) && Number(s.slice(17, 19)) > 59)) return;
  if (/(?:Z|[+-]\d{2}:\d{2})$/i.test(s)) {
    const ms = Date.parse(s);
    return Number.isFinite(ms) ? ms : undefined;
  }
  // A zone-less timestamp is a Chicago wall clock, independent of the host zone.
  // In the autumn overlap choose the first occurrence, deterministically.
  const utc = Date.parse(`${s}Z`);
  for (const hours of [5, 6]) {
    const candidate = utc + hours * 3600000;
    if (Number.isFinite(candidate) && wall(candidate).slice(0, 16) === s.slice(0, 16)) return candidate;
  }
  return;
}
function local(v: unknown): string | undefined {
  const s = str(v);
  if (!s) return;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(s) && partial(s.slice(0, 10)) &&
      Number(s.slice(11, 13)) < 24 && Number(s.slice(14, 16)) < 60) return s.slice(0, 16);
  const ms = instant(s);
  return ms === undefined ? undefined : wall(ms).slice(0, 16);
}
const localDate = (v: unknown): string | undefined => partial(v)?.value ?? local(v)?.slice(0, 10);
function clinicalDate(d: Doc): string | undefined {
  return localDate(d.enc?.document_kind === "discharge_summary" ? d.enc.discharged ?? d.end : d.effective);
}
function currentDocs(input: unknown, asOf: string): Doc[] {
  if (!Array.isArray(input) || partial(asOf)?.precision !== "day") return [];
  const scoped: { item: Obj; time: number; id: string; issuer: string }[] = [];
  for (const raw of input) {
    const item = object(raw);
    if (!item) continue;
    const id = str(item.id), issuer = str(item.issuer), time = instant(item.recorded);
    if (id && issuer && time !== undefined && (local(item.recorded)?.slice(0, 10) ?? "9999") <= asOf)
      scoped.push({ item, time, id, issuer });
  }
  // Use all in-scope envelopes, even a correction that was itself subsequently
  // replaced or retracted. This makes replacement transitive without resurrecting ancestors.
  const removed = new Set<string>();
  for (const { item, issuer } of scoped) for (const field of ["supersedes", "retracts"]) {
    const ids = item[field];
    if (Array.isArray(ids)) for (const id of ids) if (str(id)) removed.add(key(issuer, id as string));
  }
  const docs: Doc[] = [];
  for (const { item, time, id, issuer } of scoped) {
    if (removed.has(key(issuer, id))) continue;
    const payload = object(item.payload);
    if (!payload) continue;
    const es: Entry[] = [];
    for (const entryId of Object.keys(payload).sort(cmp)) {
      const value = object(payload[entryId]);
      if (value && str(value.type)) es.push({ id: entryId, value });
    }
    const enc = es.find(e => e.value.type === "encounter")?.value;
    docs.push({ id, issuer, recorded: time, effective: str(item.effective) ?? "",
      end: str(item.effective_end), entries: es, enc,
      encounter: key(issuer, str(enc?.encounter_id) ?? id) });
  }
  return docs.sort(docOrder);
}

// These aliases only normalize names. No RxNorm code is ever generated.
const brands: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", forxiga: "dapagliflozin", invokana: "canagliflozin",
  steglatro: "ertugliflozin", glucophage: "metformin", fortamet: "metformin", glumetza: "metformin",
  cozaar: "losartan", microzide: "hydrochlorothiazide", prinivil: "lisinopril", zestril: "lisinopril",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  humalog: "insulin lispro", novolog: "insulin aspart", novorapid: "insulin aspart", tresiba: "insulin degludec",
  levemir: "insulin detemir", lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  norvasc: "amlodipine", lasix: "furosemide", aldactone: "spironolactone", diovan: "valsartan",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide", eliquis: "apixaban",
  coumadin: "warfarin", plavix: "clopidogrel", synthroid: "levothyroxine", levoxyl: "levothyroxine",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", wellbutrin: "bupropion",
  prilosec: "omeprazole", protonix: "pantoprazole", neurontin: "gabapentin",
  hyzaar: "losartan / hydrochlorothiazide", janumet: "sitagliptin / metformin",
  synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin",
  invokamet: "canagliflozin / metformin", entresto: "sacubitril / valsartan",
};
const rxNames: Record<string, string> = {
  "6809": "metformin", "1545653": "empagliflozin", "52175": "losartan", "5487": "hydrochlorothiazide",
  "29046": "lisinopril", "274783": "insulin glargine", "253182": "insulin regular",
};
function ingredient(v: unknown, rx?: unknown): string | undefined {
  const name = str(v);
  if (!name) return;
  if (str(rx) && rxNames[str(rx)!]) return rxNames[str(rx)!];
  let s = name.toLowerCase().replace(/[®™]/g, "");
  for (const brand of Object.keys(brands)) if (new RegExp(`\\b${brand}\\b`).test(s)) return brands[brand];
  if (/^(?:unknown|unspecified|water pill|blood pressure (?:pill|medication)|diabetes (?:pill|medication)|medication|pill)s?\b/.test(s)) return;
  s = s.replace(/\([^)]*\)/g, " ").replace(/\b(?:u-?100|u-?200|u-?300|u-?500)\b/g, " ")
    .replace(/\b\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)*\s*(?:mg|mcg|g|units?|ml|%)\b.*$/i, "")
    .replace(/\b(?:tablet|tab|capsule|cap|solution|suspension|injection|injectable|pen|vial|cream|ointment|patch|spray|inhaler|oral|extended[- ]release|delayed[- ]release|immediate[- ]release|er|xr|sr|dr|hcl|hydrochloride|hydrobromide|potassium|sodium|besylate|succinate|tartrate|fumarate|maleate|subcutaneous)\b.*$/i, "")
    .replace(/\s+/g, " ").trim().replace(/\s+\d+(?:\.\d+)?$/, "").replace(/[-,;]+$/, "").trim();
  // Do not erase the substance name for sodium/potassium salts that are themselves drugs.
  if (!s && /^(?:sodium|potassium|calcium|magnesium)\s+[a-z]+/i.test(name))
    s = name.toLowerCase().match(/^[a-z]+\s+[a-z]+/)?.[0] ?? "";
  return s || undefined;
}
function ingredients(e: Obj): (string | undefined)[] {
  // In a combination with individually written strengths, normalize each named
  // component before stripping the strength. Never assign the combined dose to each.
  const raw = str(e.drug_name) ?? "";
  if (!str(e.rxnorm_ingredient) && /[a-z]\s*[+/]\s*[a-z]/i.test(raw)) {
    const names = raw.split(/\s*[+/]\s*/).map(x => ingredient(x)).filter((x): x is string => !!x && !/^(?:ml|l|mg|mcg|g)$/i.test(x));
    if (names.length > 1) return [...new Set(names)];
  }
  const s = ingredient(e.drug_name, e.rxnorm_ingredient);
  return s && /\s[+/]\s|\//.test(s) ? s.split(/\s*[+/]\s*/).map(x => ingredient(x)).filter(Boolean) : [s];
}
const medStatus = (v: unknown): MedicationRow["status"] | undefined => {
  if (v === "continue" || v === "new" || v === "changed") return "active";
  if (v === "held" || v === "stopped") return v;
  if (v === "not_reconciled") return "unknown";
  return;
};
function dose(e: Obj): MedicationRow["dose"] {
  const s = lower(e.dose_text);
  if (/\b(?:or|to|sliding|scale|per|titrate)\b|\d\s*[-–]\s*\d|\//.test(s)) return;
  const m = s.match(/^\s*(\d+(?:\.\d+)?|\.\d+)\s*(mg|mcg|µg|μg|g|units?|unt|\[iu\]|iu|ml|tablets?|tabs?|capsules?|caps?)\s*$/i);
  if (!m) return;
  let value = Number(m[1]);
  let unit: NonNullable<MedicationRow["dose"]>["unit"];
  if (/^(?:tab|cap)/.test(m[2])) {
    unit = "tablet";
    const strength = lower(e.drug_name).match(/\b(\d+(?:\.\d+)?)\s*(mg|mcg|µg|μg|g)\b/);
    if (strength && !/\//.test(lower(e.drug_name))) {
      value *= Number(strength[1]) * (strength[2] === "g" ? 1000 : 1);
      unit = /mcg|µg|μg/.test(strength[2]) ? "mcg" : "mg";
    }
  } else if (/units?|unt|\[iu\]|^iu$/.test(m[2])) unit = "units";
  else if (m[2] === "ml") unit = "mL";
  else if (/mcg|µg|μg/.test(m[2])) unit = "mcg";
  else { unit = "mg"; if (m[2] === "g") value *= 1000; }
  return Number.isFinite(value) && value >= 0 ? { value, unit } : undefined;
}
function frequency(v: unknown): MedicationRow["frequency"] {
  const s = lower(v).replace(/\./g, "");
  if (!s) return;
  if (/\bprn\b|as needed/.test(s)) return "PRN";
  if (/\bqhs\b|at bedtime|nightly|every night/.test(s)) return "QHS";
  if (/\bqw\b|once (?:a |per )?week|weekly|every (?:7|seven) days/.test(s)) return "QW";
  if (/\bbid\b|twice (?:a |per )?day|twice daily|every (?:12|twelve) hours|\bq12h\b/.test(s)) return "BID";
  if (/\btid\b|three times (?:a |per )?day|three times daily|every (?:8|eight) hours|\bq8h\b/.test(s)) return "TID";
  if (/\b(?:qid|q6h|q4h|qod)\b|every other|alternate|four times|every \d+ hours/.test(s)) return "other";
  if (/\b(?:qd|qam|qpm|q24h)\b|\bdaily\b|once (?:a |per )?day|every (?:morning|evening|day)/.test(s)) return "QD";
  if (/\bevery\b|\bweekly\b|\bmonthly\b|\bonce\b/.test(s)) return "other";
  return;
}
function stopReason(v: string): MedicationRow["stop_reason"] {
  const s = v.toLowerCase();
  if (/adverse|side effect|due to.*(?:cough|rash|hyperkal|ketoacidosis|hypoglyc)|caus(?:ed|ing)|intoleran|allerg/.test(s)) return "adverse_reaction";
  if (/ineffective|not (?:effective|working)|lack of (?:effect|benefit)|inadequate (?:response|control)/.test(s)) return "ineffective";
  if (/replac|switch|changed to|change to|instead/.test(s)) return "therapy_changed";
  if (/course.*(?:complet|finish)|therapy complet|completed course/.test(s)) return "course_complete";
  if (/patient.*(?:declin|prefer|request|refus)|per patient/.test(s)) return "patient_choice";
  // A bare instruction to stop is not a stated reason.
  return /because|due to|for |reason|no longer|not needed/.test(s) ? "other" : undefined;
}
function sensitivity(text: string): Sensitivity[] | undefined {
  const result: Sensitivity[] = [];
  if (/\b(?:depress(?:ion|ive)|bipolar|schizophren|anxiety|ptsd|mental health|behavioral health|sertraline|fluoxetine|escitalopram|psychosis)\b/i.test(text)) result.push("mental-health");
  if (/\b(?:alcohol use disorder|opioid use disorder|substance use|substance abuse|alcohol dependence|opioid dependence)\b/i.test(text)) result.push("substance-use");
  if (/\b(?:pregnan\w*|contracept\w*|infertility|erectile dysfunction|abortion)\b/i.test(text)) result.push("sexual-reproductive-health");
  if (/\b(?:hiv|aids|syphilis|gonorrhea|chlamydia|sexually transmitted)\b/i.test(text)) result.push("hiv-sti");
  if (/\b(?:genetic|hereditary|brca[12]?|cystic fibrosis|huntington)\b/i.test(text)) result.push("genetic");
  return result.length ? result : undefined;
}
function medications(docs: Doc[]): MedicationRow[] {
  const byEncounter = new Map<string, Doc[]>();
  for (const d of docs) if (d.enc) byEncounter.set(d.encounter, [...(byEncounter.get(d.encounter) ?? []), d]);
  const latest = [...byEncounter.values()].sort((a, b) => docOrder(a[a.length - 1], b[b.length - 1])).at(-1);
  if (!latest) return [];
  const snapshot = latest.filter(d => d.enc?.document_kind === "discharge_summary").at(-1) ?? latest[latest.length - 1];
  const chosen = new Map<string, { row: MedicationRow; f: Fact }>();
  for (const f of entries(snapshot, "home_med")) {
    const e = f.entry.value, drug_name = str(e.drug_name), status = medStatus(e.status);
    if (!drug_name || !status) continue;
    const names = ingredients(e);
    for (const name of names) {
      const row: MedicationRow = { drug_name, status, patient_reported: false, evidence: evidence(f) };
      if (name) row.ingredient = name;
      if (str(e.rxnorm_ingredient)) row.rxnorm_ingredient = str(e.rxnorm_ingredient);
      const amount = names.length === 1 ? dose(e) : undefined;
      if (amount) row.dose = amount;
      const freq = frequency(e.sig);
      if (freq) row.frequency = freq;
      if ((status === "held" || status === "stopped") && str(e.instructions)) {
        row.status_reason_text = str(e.instructions);
        const reason = status === "stopped" ? stopReason(str(e.instructions)!) : undefined;
        if (reason) row.stop_reason = reason;
      }
      const sensitive = sensitivity(`${drug_name} ${name ?? ""}`);
      if (sensitive) row.sensitivity = sensitive;
      // Walk this encounter's snapshots using ingredient AND dose, never entry ids.
      let first = f, prior: Fact | undefined;
      for (const d of [...latest].filter(d => docOrder(d, snapshot) < 0).reverse()) {
        const match = entries(d, "home_med").find(x =>
          ((str(e.rxnorm_ingredient) && e.rxnorm_ingredient === x.entry.value.rxnorm_ingredient) ||
           (name && ingredients(x.entry.value).includes(name))) && lower(e.dose_text) === lower(x.entry.value.dose_text));
        if (!match) break;
        if (medStatus(match.entry.value.status) !== status) { prior = match; break; }
        first = match;
      }
      // A pre-existing "continue"/unreconciled line has no known start date.
      if (status === "held" || status === "stopped" ||
          (status === "active" && (first.entry.value.status === "new" || first.entry.value.status === "changed" ||
            prior?.entry.value.status === "held" || prior?.entry.value.status === "stopped"))) {
        const since = clinicalDate(first.doc);
        if (since) { row.status_since = since; row.evidence = mergeEvidence(row.evidence, evidence(first), prior ? evidence(prior) : []); }
      }
      const identity = name ?? str(e.rxnorm_ingredient) ?? lower(drug_name);
      const old = chosen.get(identity);
      // Conflicting parallel doses have no ordering in this source. Use a stable
      // entry-id tie break, without adding two doses into an invented prescription.
      if (!old || factOrder(old.f, f) <= 0) chosen.set(identity, { row, f });
    }
  }
  return [...chosen.values()].map(x => x.row).sort((a, b) => cmp(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name));
}

function conditionText(e: Obj): string { return str(e.type === "history" ? e.condition : e.label) ?? ""; }
function icd(e: Obj): string | undefined {
  const s = str(e.icd10cm)?.toUpperCase();
  if (!s || !/^[A-Z][0-9][A-Z0-9](?:\.?[A-Z0-9]{1,4})?$/.test(s)) return;
  return s.includes(".") || s.length <= 3 ? s : `${s.slice(0, 3)}.${s.slice(3)}`;
}
function concept(e: Obj): string {
  let s = conditionText(e).toLowerCase();
  const code = icd(e) ?? "";
  if (/^N18\b/.test(code) || (!/^N17\b/.test(code) && /\bckd\b|chronic (?:kidney|renal) (?:disease|failure)/.test(s))) return "ckd";
  if (/^N17\b/.test(code) || /\baki\b|acute (?:kidney injury|renal failure)/.test(s)) return "aki";
  if (/\bdka\b|ketoacidosis/.test(s)) return "dka";
  if (/\bhyperkalemia\b/.test(s) || code === "E87.5") return "hyperkalemia";
  if (/\bpancreatitis\b/.test(s)) return "pancreatitis";
  if (code === "I10" || /^(?:essential (?:primary )?hypertension|hypertension|htn)$/.test(s)) return "hypertension";
  if (/\b(?:type (?:2|ii)|t2dm)\b/.test(s) && /diabet|t2dm/.test(s) && !/with\b|complicat/.test(s)) return "type 2 diabetes";
  s = s.replace(/^(?:r\/?o\s+|rule[ -]?out\s+|possible\s+|suspected\s+|history of\s+|h\/o\s+)/, "")
    .replace(/\b(?:resolved|active)\b/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  return s;
}
type ConditionGroup = { facts: Fact[]; selected: Fact; valid: Fact[] };
function conditions(docs: Doc[]): ConditionGroup[] {
  const facts = docs.flatMap(d => [...entries(d, "diagnosis"), ...entries(d, "history")])
    .filter(f => conditionText(f.entry.value)).sort(factOrder);
  const localsByIcd = new Map<string, Set<string>>(), localsByConcept = new Map<string, Set<string>>();
  const codesByConcept = new Map<string, Set<string>>();
  for (const f of facts) {
    const e = f.entry.value, localCode = str(object(e.riverside_dx)?.code), c = concept(e), code = icd(e);
    if (localCode) {
      const ci = key(f.doc.encounter, code ?? ""), cc = key(f.doc.encounter, c);
      if (code) localsByIcd.set(ci, new Set([...(localsByIcd.get(ci) ?? []), localCode]));
      localsByConcept.set(cc, new Set([...(localsByConcept.get(cc) ?? []), localCode]));
    }
    const cc = key(f.doc.issuer, c);
    if (code && !localCode) codesByConcept.set(cc, new Set([...(codesByConcept.get(cc) ?? []), code]));
  }
  // A condition may be re-coded without acquiring a local code. Connect only
  // codes attached to the same normalized condition, never distinct local concepts.
  const codeParent = new Map<string, string>();
  function root(k: string): string {
    let r = k;
    while (codeParent.has(r) && codeParent.get(r) !== r) r = codeParent.get(r)!;
    return r;
  }
  for (const [cc, codes] of codesByConcept) {
    const issuer = (JSON.parse(cc) as string[])[0];
    const names = [...codes].map(c => key(issuer, c)).sort(cmp);
    for (const name of names.slice(1)) {
      const a = root(names[0]), b = root(name);
      if (a !== b) codeParent.set(cmp(a, b) < 0 ? b : a, cmp(a, b) < 0 ? a : b);
    }
  }
  const groups = new Map<string, Fact[]>();
  for (const f of facts) {
    const e = f.entry.value, c = concept(e), code = icd(e), lc = str(object(e.riverside_dx)?.code);
    const byConcept = localsByConcept.get(key(f.doc.encounter, c));
    const localCandidates = byConcept?.size === 1 ? byConcept : code ? localsByIcd.get(key(f.doc.encounter, code)) : byConcept;
    let identity: string;
    // CKD restaging is one condition. Distinct Riverside codes otherwise retain
    // distinctions that the ICD code alone may erase.
    if (c === "ckd") identity = "condition:ckd";
    else if (lc) identity = `local:${lc}`;
    else if (localCandidates?.size === 1) identity = `local:${[...localCandidates][0]}`;
    else {
      const candidates = codesByConcept.get(key(f.doc.issuer, c));
      const selectedCode = code ?? (candidates?.size ? [...candidates].sort(cmp)[0] : undefined);
      identity = selectedCode ? `condition:${root(key(f.doc.issuer, selectedCode))}` : `condition:${c}`;
    }
    const k = key(f.doc.issuer, identity);
    groups.set(k, [...(groups.get(k) ?? []), f]);
  }
  const result: ConditionGroup[] = [];
  for (const fs of groups.values()) {
    const episodes = new Map<string, Fact[]>();
    for (const f of fs) episodes.set(f.doc.encounter, [...(episodes.get(f.doc.encounter) ?? []), f]);
    const valid: Fact[] = [];
    for (const ep of episodes.values()) {
      const diagnoses = ep.filter(f => f.entry.value.type === "diagnosis");
      if (diagnoses.at(-1)?.entry.value.status === "ruled_out") continue;
      const confirmed = diagnoses.filter(f => f.entry.value.status === "active" || f.entry.value.status === "resolved");
      valid.push(...confirmed, ...ep.filter(f => f.entry.value.type === "history"));
    }
    if (!valid.length) continue;
    // A copied PMH line is not a new staging decision. Prefer the latest actual
    // diagnosis when one exists; still preserve explicit historical onset below.
    const selected = valid.filter(f => f.entry.value.type === "diagnosis").sort(factOrder).at(-1) ?? valid.sort(factOrder).at(-1)!;
    result.push({ facts: fs, selected, valid: valid.sort(factOrder) });
  }
  return result;
}
function isAdverseOnly(e: Obj): boolean {
  return /^T\d/.test(icd(e) ?? "") && /adverse (?:effect|reaction)/i.test(conditionText(e)) &&
    !/ketoacidosis|\bdka\b|angioedema|anaphyla|rash|hives|cough|hyperkalemia|lactic acidosis|hypoglycemia|pancreatitis|kidney injury|hepatitis|rhabdomyolysis/i.test(conditionText(e));
}
function ckdStage(e: Obj): ProblemRow["ckd_stage"] {
  const s = conditionText(e);
  const m = s.match(/(?:\bstage\s*|\bG)(3[ab]|[1245])\b/i);
  if (m) return `G${m[1].toLowerCase()}` as ProblemRow["ckd_stage"];
  const stages: Record<string, NonNullable<ProblemRow["ckd_stage"]>> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
  };
  return stages[icd(e) ?? ""];
}
function problems(groups: ConditionGroup[]): ProblemRow[] {
  const rows: ProblemRow[] = [];
  for (const group of groups) {
    const f = group.selected, e = f.entry.value;
    if (isAdverseOnly(e)) continue;
    const row: ProblemRow = { condition: conditionText(e), status: e.status === "resolved" ||
      /^(?:history of|h\/o)\s/i.test(conditionText(e)) ? "resolved" : "active", evidence: evidence(f) };
    if (icd(e)) row.icd10cm = icd(e);
    const onsetFact = [...group.valid].reverse().find(x => partial(x.entry.value.onset_text));
    if (onsetFact) { row.onset = partial(onsetFact.entry.value.onset_text); row.evidence = mergeEvidence(row.evidence, evidence(onsetFact)); }
    if (concept(e) === "ckd") {
      const stage = ckdStage(e);
      if (stage) row.ckd_stage = stage;
      const albumin = conditionText(e).match(/\bA[123]\b/i)?.[0].toUpperCase();
      if (albumin) row.albuminuria = albumin as ProblemRow["albuminuria"];
    }
    const sensitive = sensitivity(row.condition);
    if (sensitive) row.sensitivity = sensitive;
    rows.push(row);
  }
  return rows.sort((a, b) => cmp(a.condition, b.condition) || cmp(a.icd10cm ?? "", b.icd10cm ?? ""));
}

type DrugClass = { pattern: RegExp; members: string[] };
const drugClasses: DrugClass[] = [
  { pattern: /SGLT[- ]?2 inhibitors?/i, members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "bexagliflozin", "sotagliflozin"] },
  { pattern: /ACE[- ]?inhibitors?|angiotensin[- ]converting enzyme inhibitors?/i, members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "fosinopril", "quinapril", "perindopril", "trandolapril", "moexipril"] },
  { pattern: /angiotensin (?:II )?receptor blockers?|\bARBs?\b/i, members: ["losartan", "valsartan", "irbesartan", "candesartan", "olmesartan", "telmisartan", "azilsartan", "eprosartan"] },
  { pattern: /biguanides?/i, members: ["metformin"] },
  { pattern: /statins?/i, members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"] },
  { pattern: /thiazides?(?: diuretics?)?/i, members: ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone"] },
  { pattern: /GLP[- ]?1(?: receptor)? agonists?/i, members: ["semaglutide", "liraglutide", "dulaglutide", "exenatide", "lixisenatide"] },
  { pattern: /sulfonylureas?/i, members: ["glipizide", "glyburide", "glimepiride", "gliclazide"] },
  { pattern: /NSAIDs?|nonsteroidal anti[- ]inflammatory(?: drugs?)?/i, members: ["ibuprofen", "naproxen", "diclofenac", "celecoxib", "meloxicam", "indomethacin", "ketorolac"] },
];
function reactionKind(s: string): AllergyIntoleranceRow["reaction_type"] {
  if (/hives|urticaria|rash|angioedema|anaphyla|bronchospasm|stevens.johnson|toxic epidermal/i.test(s)) return "hypersensitivity";
  if (/ketoacidosis|\bdka\b|lactic acidosis|hyperkalemia|rhabdomyolysis|pancreatitis|kidney injury|renal failure|hepatotoxic|hepatitis|liver (?:injury|failure)|severe hypoglycemia|hemorrhage|(?:major|gi|gastrointestinal) bleed|agranulocytosis|pulmonary fibrosis|torsades|qt prolongation|serotonin syndrome|neuroleptic malignant/i.test(s)) return "serious_adverse_event";
  if (/cough|nausea|vomit|diarrh|gi upset|gastrointestinal|myalgia|muscle (?:ache|pain)|dizz|headache|fatigue|constipation|edema|intoleran/i.test(s)) return "side_effect";
  // An allergy with no characterized reaction retains the source's allergy
  // assertion; unknown mechanism and criticality do not claim a proven allergy.
  return "hypersensitivity";
}
function mechanism(substance: string, reaction: string): AllergyIntoleranceRow["mechanism"] {
  if (/non[- ]?immune|bradykinin/i.test(reaction)) return "non_immune";
  if (/\bIgE\b|\bT[- ]cell\b|immune[- ]mediated|positive allergy test/i.test(reaction)) return "immune";
  if ((drugClasses[1].members.includes(substance) || drugClasses[1].pattern.test(substance)) && /cough|angioedema/i.test(reaction)) return "non_immune";
  if (/ketoacidosis|\bdka\b|lactic acidosis/i.test(reaction)) return "non_immune";
  return "unknown";
}
type AllergyFact = { row: AllergyIntoleranceRow; fact: Fact };
function causalName(text: string, name: string): boolean {
  const token = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${token}(?:[- ](?:associated|induced|related)|(?: use)? (?:caused|causing))`, "i").test(text) ||
    new RegExp(`(?:associated with|induced by|caused by|due to|secondary to|adverse (?:effect of|reaction to)|from|related to|attributed to)\\s+(?:the )?(?:use of )?${token}\\b`, "i").test(text);
}
function diagnosisAllergy(f: Fact): AllergyIntoleranceRow | undefined {
  const e = f.entry.value, label = conditionText(e), localName = str(object(e.riverside_dx)?.name) ?? "";
  const text = `${label} ${localName}`;
  if (!/(?:associated|induced|caused|due to|secondary to|adverse (?:effect|reaction)|from |related|attributed)/i.test(text)) return;
  const meds = [...entries(f.doc, "home_med"), ...entries(f.doc, "inpatient_med")];
  const listed = meds.flatMap(m => ingredients(m.entry.value).filter((n): n is string => !!n).map(name => ({ name, fact: m })));
  const attributedClass = drugClasses.find(c => {
    const name = text.match(c.pattern)?.[0];
    return name !== undefined && causalName(text, name);
  });
  function explicitlyAttributed(name: string): boolean {
    const tokens = [name, ...Object.keys(brands).filter(b => brands[b] === name)];
    return tokens.some(token => causalName(text, token) ||
      (attributedClass?.members.includes(name) && text.toLowerCase().includes(token)));
  }
  let substance: string | undefined, match: Fact | undefined;
  for (const m of listed) {
    if (explicitlyAttributed(m.name)) {
      substance = m.name; match = m.fact; break;
    }
  }
  if (!substance) {
    const known = [...new Set([...Object.values(rxNames), ...Object.values(brands), ...drugClasses.flatMap(c => c.members)])];
    substance = known.find(n => !n.includes("/") && explicitlyAttributed(n));
  }
  if (!substance && attributedClass) {
    const c = attributedClass;
    const className = text.match(c.pattern)?.[0];
    const candidates = new Map(listed.filter(m => c.members.includes(m.name)).map(m => [m.name, m]));
    if (candidates.size === 1) { const m = [...candidates.values()][0]; substance = m.name; match = m.fact; }
    else substance = className;
  }
  if (!substance) {
    // Only an explicit adverse-drug-effect statement permits this fallback.
    // "AKI due to dehydration" does not name a drug.
    const named = label.match(/adverse (?:effect|reaction) (?:of|to)\s+([^,;()]+)/i);
    if (named && !/^(?:unspecified|unknown|medication|drug)s?$/i.test(named[1].trim())) {
      const raw = named[1].trim();
      substance = /\b(?:drugs|agents|inhibitors|antibiotics|antidiabetics|other|unspecified)\b/i.test(raw) ? raw : ingredient(raw);
    }
  }
  if (!substance) return;
  let reaction = label, reactionFact: Fact | undefined;
  if (isAdverseOnly(e)) {
    const related = entries(f.doc, "diagnosis").find(x => x.entry.id !== f.entry.id &&
      (x.entry.value.status === "active" || x.entry.value.status === "resolved") && !isAdverseOnly(x.entry.value) &&
      (conditionText(x.entry.value).toLowerCase().includes(substance!.toLowerCase()) ||
       drugClasses.some(c => c.members.includes(substance!) && c.pattern.test(conditionText(x.entry.value)))));
    if (related) { reaction = conditionText(related.entry.value); reactionFact = related; }
    else reaction = "";
  }
  const kind = reaction ? reactionKind(reaction) : "side_effect";
  const row: AllergyIntoleranceRow = { substance, reaction_type: kind, mechanism: mechanism(substance, reaction),
    criticality: kind === "serious_adverse_event" || /angioedema|anaphyla|bronchospasm|stevens.johnson/i.test(reaction) ? "high" : "unknown",
    evidence: mergeEvidence(evidence(f), match ? evidence(match) : [], reactionFact ? evidence(reactionFact) : []) };
  if (reaction) row.reaction = reaction;
  if (match && str(match.entry.value.rxnorm_ingredient)) row.rxnorm_ingredient = str(match.entry.value.rxnorm_ingredient);
  return row;
}
function allergies(docs: Doc[], groups: ConditionGroup[]): AllergyIntoleranceRow[] {
  const candidates: AllergyFact[] = [];
  const latest = docs.filter(d => d.enc).at(-1);
  if (latest) for (const f of entries(latest, "allergy")) {
    const e = f.entry.value, raw = str(e.substance);
    if (!raw || /^(?:NKDA|NKA|no known (?:drug )?allergies)$/i.test(raw)) continue;
    const isClass = /\b(?:inhibitors?|antibiotics?|penicillins?|sulfonamides?|sulfa|latex|foods?|peanuts?|shellfish)\b/i.test(raw);
    const substance = isClass ? raw : ingredient(raw, e.rxnorm_ingredient) ?? raw;
    const reaction = str(e.reaction), kind = reactionKind(reaction ?? "");
    const row: AllergyIntoleranceRow = { substance, reaction_type: kind, mechanism: mechanism(substance, reaction ?? ""),
      criticality: e.severity === "severe" ? "high" : e.severity === "mild" ? "low" :
        kind === "serious_adverse_event" || /anaphyla|angioedema|bronchospasm/i.test(reaction ?? "") ? "high" : "unknown",
      evidence: evidence(f) };
    if (reaction) row.reaction = reaction;
    if (str(e.rxnorm_ingredient)) row.rxnorm_ingredient = str(e.rxnorm_ingredient);
    candidates.push({ row, fact: f });
  }
  for (const group of groups) for (const f of group.valid) if (f.entry.value.type === "diagnosis") {
    const row = diagnosisAllergy(f);
    if (row) candidates.push({ row, fact: f });
  }
  const merged = new Map<string, AllergyFact>();
  for (const candidate of candidates.sort((a, b) => factOrder(a.fact, b.fact))) {
    const row = candidate.row, k = lower(row.substance), old = merged.get(k);
    if (old) {
      const reactions = [...new Set([...(old.row.reaction?.split("; ") ?? []), ...(row.reaction?.split("; ") ?? [])])];
      if (reactions.length) row.reaction = reactions.join("; ");
      row.evidence = mergeEvidence(old.row.evidence, row.evidence);
      row.rxnorm_ingredient ??= old.row.rxnorm_ingredient;
      if (old.row.criticality === "high") row.criticality = "high";
      if (old.row.reaction_type === "serious_adverse_event") row.reaction_type = "serious_adverse_event";
      if (row.mechanism === "unknown") row.mechanism = old.row.mechanism;
    }
    merged.set(k, candidate);
  }
  return [...merged.values()].map(x => x.row).sort((a, b) => cmp(a.substance, b.substance));
}

const units: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const loincs: Record<string, Analyte> = {
  "2160-0": "creatinine", "14682-9": "creatinine", "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr",
  "48642-3": "egfr", "88293-6": "egfr", "69405-9": "egfr", "48643-1": "egfr", "88294-4": "egfr",
  "2823-3": "potassium", "2951-2": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate",
  "33037-3": "anion_gap", "10466-1": "anion_gap", "3094-0": "bun", "14937-7": "bun", "2345-7": "glucose",
  "14749-6": "glucose", "4548-4": "a1c", "17856-6": "a1c", "59261-8": "a1c", "14959-1": "uacr", "9318-7": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin",
  "6873-4": "bhb", "2739-9": "bhb", "2746-6": "ph", "2744-1": "ph", "11558-4": "ph",
  "2021-4": "pco2", "2019-8": "pco2", "11557-6": "pco2", "3040-3": "lipase", "10839-9": "troponin",
  "42757-5": "troponin", "89579-7": "troponin", "2093-3": "cholesterol", "14647-2": "cholesterol",
  "2571-8": "triglycerides", "14927-8": "triglycerides", "2085-9": "hdl", "14646-4": "hdl",
  "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl", "22748-8": "ldl",
};
const localAnalytes: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", TCO2: "bicarbonate", AGAP: "anion_gap", BUN: "bun", GLU: "glucose", GLUCOSE: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", VPH: "ph", APH: "ph", PH: "ph", VPCO2: "pco2", APCO2: "pco2", PCO2: "pco2", LIPASE: "lipase",
  TNI: "troponin", TROP_I: "troponin", TROPONINI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl",
};
function analyte(test: Obj, specimen: string): Analyte | undefined {
  const name = lower(test.name), lc = (str(test.local_code) ?? "").toUpperCase();
  if (/troponin\s*t\b|urine.*(?:creatinine|glucose)|(?:creatinine|glucose).*urine|urine\s*ph|bicarbonate.*(?:calculated|blood gas)/.test(name)) return;
  let result: Analyte | undefined = loincs[str(test.loinc) ?? ""] ?? localAnalytes[lc];
  if (!result) {
    const patterns: [Analyte, RegExp][] = [
      ["uacr", /(?:albumin.*creatinine|microalbumin.*creatinine).*(?:ratio)|\buacr\b/],
      ["egfr", /\begfr\b|estimated glomerular filtration/], ["creatinine", /^creatinine(?:,? serum|,? plasma)?$/],
      ["potassium", /^potassium\b/], ["sodium", /^sodium\b/], ["chloride", /^chloride\b/],
      ["bicarbonate", /total (?:co2|carbon dioxide)|bicarbonate \(total co2\)/], ["anion_gap", /anion gap/],
      ["bun", /urea nitrogen|\bbun\b/], ["glucose", /^glucose\b/], ["a1c", /hemoglobin a1c|hba1c|^a1c$/],
      ["platelets", /^platelet(?:s| count)?$/], ["wbc", /^(?:wbc|white blood cell(?:s| count)?)$/],
      ["hemoglobin", /^hemoglobin$/], ["bhb", /(?:beta|β)[- ]hydroxybutyrate/], ["ph", /^ph(?:$|[, (])/],
      ["pco2", /\bpco2\b|carbon dioxide.*partial pressure/], ["lipase", /^lipase$/], ["troponin", /troponin[- ]?i\b/],
      ["hdl", /\bhdl\b/], ["ldl", /\bldl\b/], ["cholesterol", /^(?:total cholesterol|cholesterol(?:,? total)?)$/],
      ["triglycerides", /^triglycerides?$/],
    ];
    result = patterns.find(([, re]) => re.test(name))?.[0];
  }
  if ((result === "creatinine" || result === "glucose") && !/serum|plasma/i.test(specimen)) return;
  if ((result === "ph" || result === "pco2") && !/blood|arterial|venous|capillary/i.test(specimen)) return;
  return result;
}
function numeric(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const s = str(v)?.replace(/≤/g, "<=").replace(/≥/g, ">=");
  if (!s) return;
  const m = s.match(/^\s*(<=|>=|<|>)?\s*([+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*$/);
  if (!m) return;
  const value = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(value)) return;
  return m[1] ? { value, comparator: m[1] as LabResultRow["comparator"] } : { value };
}
const unitKey = (v: unknown): string => lower(v).replace(/[µμ]/g, "u").replace(/\s+/g, "").replace(/²/g, "2");
function converted(a: Analyte, value: number, rawUnit: unknown): number | undefined {
  const u = unitKey(rawUnit);
  if (u === unitKey(units[a]) || (a === "ph" && (!u || u === "ph" || u === "1"))) return value;
  if (["sodium", "potassium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") return value;
  if ((a === "wbc" || a === "platelets") && ["10^3/ul", "x10^3/ul", "k/ul", "10*9/l", "10^9/l"].includes(u)) return value;
  if ((a === "wbc" || a === "platelets") && ["cells/ul", "/ul", "1/ul", "cells/mm3"].includes(u)) return value / 1000;
  if (a === "hemoglobin" && u === "g/l") return value / 10;
  if (a === "creatinine" && u === "umol/l") return value / 88.4;
  if (a === "glucose" && u === "mmol/l") return value * 18.016;
  if (a === "bun" && u === "mmol/l") return value * 2.801;
  if (a === "troponin" && (u === "ng/l" || u === "pg/ml")) return value / 1000;
  if (a === "troponin" && u === "ug/l") return value;
  if (a === "pco2" && u === "kpa") return value * 7.50061683;
  if (["cholesterol", "hdl", "ldl"].includes(a) && u === "mmol/l") return value * 38.67;
  if (a === "triglycerides" && u === "mmol/l") return value * 88.57;
  if (a === "a1c" && u === "mmol/mol") return value * 0.09148 + 2.152;
  if (a === "uacr" && u === "mg/mmol") return value * 8.84;
  if (a === "uacr" && u === "ug/mg") return value;
  if (a === "egfr" && ["ml/min/1.73m^2", "ml/min/{1.73_m2}", "ml/min/1.73m2"].includes(u)) return value;
  if (a === "lipase" && (u === "iu/l" || u === "[iu]/l")) return value;
  return;
}
type LabCopy = { f: Fact; value: Obj; test: Obj; container: Obj; rank: number; accession: string };
function labs(docs: Doc[]): LabResultRow[] {
  const copies = new Map<string, LabCopy>();
  for (const d of docs) for (const f of [...entries(d, "result"), ...entries(d, "panel")]) {
    const c = f.entry.value, accession = str(c.accession);
    const rank = c.status === "corrected" ? 3 : c.status === "final" ? 2 : c.status === "preliminary" ? 1 : 0;
    if (!accession || !rank) continue;
    const values = c.type === "panel" ? Array.isArray(c.components) ? c.components : [] : [c];
    for (const raw of values) {
      const value = object(raw), test = object(value?.test), code = str(test?.local_code);
      if (!value || !test || !code) continue;
      const k = key(d.issuer, accession, code), old = copies.get(k);
      if (!old || rank > old.rank || (rank === old.rank && factOrder(old.f, f) <= 0))
        copies.set(k, { f, value, test, container: c, rank, accession });
    }
  }
  const result: LabResultRow[] = [];
  for (const c of copies.values()) {
    const a = analyte(c.test, str(c.container.specimen) ?? "");
    const n = numeric(c.value.value);
    const ms = instant(c.container.collected);
    if (!a || !n || ms === undefined) continue;
    // Choosing the winning copy precedes numeric parsing: a corrected textual
    // cancellation must not expose the older numeric value.
    const value = converted(a, n.value, c.value.unit);
    if (value === undefined || !Number.isFinite(value)) continue;
    const row: LabResultRow = { analyte: a, value, unit: units[a], collected: new Date(ms).toISOString(),
      status: c.rank === 1 ? "preliminary" : "final", evidence: evidence(c.f) };
    if (n.comparator) row.comparator = n.comparator;
    if (str(c.test.loinc)) row.loinc = str(c.test.loinc);
    if (a === "egfr") {
      const name = str(c.test.name) ?? "";
      const noRace = /non[- ]?(?:african|black)|without.*race|race[- ]free/i.test(name);
      if (!noRace && (/african|\bblack\b|with.*race.*(?:factor|coefficient)/i.test(name) || ["48643-1", "88294-4"].includes(str(c.test.loinc) ?? ""))) continue;
      row.egfr_equation = /2021/.test(name) ? "ckd-epi-2021" : /2009/.test(name) ? "ckd-epi-2009" : /mdrd/i.test(name) ? "mdrd" :
        // This source explicitly documents its equation for every result since 2023.
        (localDate(c.container.collected) ?? "") >= "2023" ? "ckd-epi-2021" : "unknown";
    }
    result.push(row);
  }
  return result.sort((a, b) => cmp(a.collected, b.collected) || cmp(a.analyte, b.analyte) || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

function vitals(docs: Doc[]): VitalRow[] {
  type Set = { row: VitalRow; f: Fact; ms: number; taken: string };
  const sets = new Map<string, Set>();
  for (const d of docs) for (const f of entries(d, "vitals")) {
    const e = f.entry.value, time = local(e.taken);
    if (!time) continue;
    const bp = object(e.bp), row: VitalRow = { setting: "hospital", local_time: time, evidence: evidence(f) };
    if (num(bp?.systolic_mmhg) !== undefined) row.systolic_mmhg = num(bp?.systolic_mmhg);
    if (num(bp?.diastolic_mmhg) !== undefined) row.diastolic_mmhg = num(bp?.diastolic_mmhg);
    if (num(e.heart_rate_bpm) !== undefined) row.pulse_bpm = num(e.heart_rate_bpm);
    if (num(e.weight_kg) !== undefined) row.weight_kg = Math.round(num(e.weight_kg)! * 10) / 10;
    if (row.systolic_mmhg === undefined && row.diastolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    const ms = instant(e.taken) ?? Date.parse(`${time}:00Z`);
    const k = key(d.encounter, String(ms)), old = sets.get(k);
    if (old) {
      row.systolic_mmhg ??= old.row.systolic_mmhg; row.diastolic_mmhg ??= old.row.diastolic_mmhg;
      row.pulse_bpm ??= old.row.pulse_bpm; row.weight_kg ??= old.row.weight_kg;
      row.evidence = mergeEvidence(old.row.evidence, row.evidence);
    }
    sets.set(k, { row, f, ms, taken: str(e.taken)! });
  }
  const ordered = [...sets.values()].sort((a, b) => a.ms - b.ms || factOrder(a.f, b.f));
  const grouped: Set[] = [];
  for (const set of ordered) {
    const bpOnly = set.row.systolic_mmhg !== undefined && set.row.diastolic_mmhg !== undefined &&
      set.row.pulse_bpm === undefined && set.row.weight_kg === undefined;
    const repeatOf = bpOnly ? [...grouped].reverse().find(p => p.f.doc.id === set.f.doc.id &&
      p.f.doc.issuer === set.f.doc.issuer && p.row.local_time.slice(0, 10) === set.row.local_time.slice(0, 10)) : undefined;
    const prev = repeatOf ?? grouped.at(-1);
    // Close measurements in one hospital encounter form a set. Separate daily
    // inpatient observations and ED/admission examinations remain separate sets.
    if (prev && prev.f.doc.encounter === set.f.doc.encounter && (repeatOf || set.ms - prev.ms <= 5 * 60000)) {
      const row = prev.row;
      if (set.row.systolic_mmhg !== undefined && set.row.diastolic_mmhg !== undefined) {
        if (row.systolic_mmhg === undefined) {
          row.systolic_mmhg = set.row.systolic_mmhg; row.diastolic_mmhg = set.row.diastolic_mmhg;
          row.local_time = set.row.local_time;
        } else {
          row.repeat_systolic_mmhg = set.row.systolic_mmhg; row.repeat_diastolic_mmhg = set.row.diastolic_mmhg;
        }
      }
      row.pulse_bpm ??= set.row.pulse_bpm; row.weight_kg ??= set.row.weight_kg;
      row.evidence = mergeEvidence(row.evidence, set.row.evidence);
    } else grouped.push(set);
  }
  return grouped.map(s => s.row).sort((a, b) => cmp(a.local_time, b.local_time) || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const docs = currentDocs(items, asOf), groups = conditions(docs);
  return { medications: medications(docs), problems: problems(groups), allergies: allergies(docs, groups), labs: labs(docs), vitals: vitals(docs) };
}
