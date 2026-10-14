import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow,
  AllergyIntoleranceRow, LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// Treat the payload as untrusted JSON. In particular, never coerce null/empty
// strings into numeric clinical measurements.
type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj | undefined => v !== null && typeof v === "object" && !Array.isArray(v) ? v as Obj : undefined;
const str = (v: unknown): string => typeof v === "string" ? v.trim() : "";
const num = (v: unknown): number | undefined => typeof v === "number" && Number.isFinite(v) ? v : undefined;
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const norm = (s: string): string => s.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9]+/g, " ").trim();
const unique = <T>(a: T[]): T[] => [...new Set(a)];
function evidence(...parts: Evidence[]): Evidence {
  const m = new Map<string, Evidence[number]>();
  for (const p of parts) for (const e of p) m.set(JSON.stringify([e.item_id, e.entry_id]), e);
  return [...m.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id || "", b.entry_id || ""));
}

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function wall(ms: number): string {
  const p: Record<string, string> = {};
  for (const v of chicago.formatToParts(new Date(ms))) p[v.type] = v.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}
function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const ms = Date.parse(s + "T00:00:00Z");
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === s;
}
type Time = { ms: number; local: string; rfc: string };
function time(v: unknown): Time | undefined {
  const s = str(v);
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})?$/i.exec(s);
  if (!m || !validDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] || 0) > 59) return undefined;
  const base = `${m[1]}T${m[2]}:${m[3]}:${m[4] || "00"}${m[5] || ""}`;
  if (m[6]) {
    const offset = m[6].toUpperCase().replace(/^([+-]\d{2})(\d{2})$/, "$1:$2");
    const ms = Date.parse(base + offset);
    if (!Number.isFinite(ms)) return undefined;
    return { ms, local: wall(ms), rfc: base + offset };
  }
  const naive = Date.parse(base + "Z");
  // Chicago has two offsets. Prefer the earlier occurrence of an ambiguous
  // fall-back wall time; never shift an offsetless source wall time.
  const candidates = [naive + 5 * 3600000, naive + 6 * 3600000];
  const ms = candidates.find(t => wall(t) === base.slice(0, 19)) ?? candidates[0];
  const offset = ms === candidates[1] ? "-06:00" : "-05:00";
  return { ms, local: base.slice(0, 19), rfc: base + offset };
}
function localDate(v: unknown): string | undefined {
  const s = str(v);
  if (/^\d{4}$/.test(s)) return s;
  if (/^\d{4}-\d{2}$/.test(s) && +s.slice(5) >= 1 && +s.slice(5) <= 12) return s;
  if (validDate(s)) return s;
  return time(s)?.local.slice(0, 10);
}
function onset(v: unknown): ProblemRow["onset"] {
  let s = localDate(v);
  if (!s) {
    const text = str(v).replace(/^(?:since|diagnosed(?: in| on)?)\s+/i, "");
    s = localDate(text);
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const m = /^([A-Za-z]+)\s+(?:(\d{1,2}),?\s+)?(\d{4})$/.exec(text);
    if (!s && m) {
      const month = months.findIndex(n => n === m[1].toLowerCase() || n.slice(0, 3) === m[1].toLowerCase());
      if (month >= 0) s = localDate(`${m[3]}-${String(month + 1).padStart(2, "0")}${m[2] ? "-" + m[2].padStart(2, "0") : ""}`);
    }
  }
  if (!s) return undefined;
  return { value: s, precision: s.length === 4 ? "year" : s.length === 7 ? "month" : "day" };
}
type Doc = {
  id: string; issuer: string; effective: string; end: string; recorded: number;
  enc?: Obj; encounter: string; entries: Entry[]; start: number;
};
type Entry = { doc: Doc; key: string; v: Obj };
const ev = (e: Entry): Evidence => [{ item_id: e.doc.id, entry_id: e.key }];
const docOrder = (a: Doc, b: Doc): number => a.recorded - b.recorded || cmp(a.id, b.id);
const entryOrder = (a: Entry, b: Entry): number => docOrder(a.doc, b.doc) || cmp(a.key, b.key);
function documents(items: FolioItem[], asOf: string): Doc[] {
  if (!Array.isArray(items) || !validDate(asOf)) return [];
  const eligible: Obj[] = [];
  for (const raw of items) {
    const i = obj(raw);
    if (!i || !str(i.id)) continue;
    const t = time(i.recorded);
    if (t && t.local.slice(0, 10) <= asOf) eligible.push(i);
  }
  const id = (issuer: unknown, key: string) => JSON.stringify([str(issuer), key]);
  const byId = new Map(eligible.map(i => [id(i.issuer, str(i.id)), i]));
  const removed = new Set<string>();
  const refs = (v: unknown): string[] => Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
  // Follow supersession even through a replaced intermediate document. A later
  // retraction does not resurrect documents that were already replaced.
  for (const i of eligible) {
    const stack = [...refs(i.supersedes), ...refs(i.retracts)];
    const seen = new Set<string>();
    while (stack.length) {
      const key = id(i.issuer, stack.pop()!);
      if (seen.has(key)) continue;
      seen.add(key); removed.add(key);
      const target = byId.get(key);
      if (target) stack.push(...refs(target.supersedes));
    }
  }
  const docs: Doc[] = [];
  for (const i of eligible) {
    if (removed.has(id(i.issuer, str(i.id)))) continue;
    const payload = obj(i.payload);
    if (!payload) continue;
    const entries = Object.keys(payload).sort().flatMap(key => {
      const v = obj(payload[key]);
      return v && str(v.type) ? [{ key, v }] : [];
    });
    const enc = entries.find(e => e.v.type === "encounter")?.v;
    const recorded = time(i.recorded)!.ms;
    const d: Doc = { id: str(i.id), issuer: str(i.issuer), effective: str(i.effective), end: str(i.effective_end),
      recorded, enc, encounter: str(enc?.encounter_id) || str(i.id), entries: [],
      start: time(enc?.arrived)?.ms ?? time(enc?.admitted)?.ms ?? time(i.effective)?.ms ?? recorded };
    d.entries = entries.map(e => ({ ...e, doc: d }));
    docs.push(d);
  }
  return docs.sort(docOrder);
}

// Name normalization is separate from code handling: codes are copied only
// from the explicitly ingredient-level source field, never synthesized.
const brands: Record<string, string> = {
  "ventolin": "albuterol", "ventolin hfa": "albuterol", "proair hfa": "albuterol", "proventil": "albuterol",
  "keflex": "cephalexin", "amoxil": "amoxicillin", "zithromax": "azithromycin",
  "glucophage": "metformin", "glucophage xr": "metformin", "fortamet": "metformin",
  "jardiance": "empagliflozin", "farxiga": "dapagliflozin", "invokana": "canagliflozin", "steglatro": "ertugliflozin",
  "cozaar": "losartan", "zestril": "lisinopril", "prinivil": "lisinopril", "microzide": "hydrochlorothiazide",
  "norvasc": "amlodipine", "lipitor": "atorvastatin", "crestor": "rosuvastatin", "zocor": "simvastatin",
  "lantus": "insulin glargine", "basaglar": "insulin glargine", "toujeo": "insulin glargine",
  "humalog": "insulin lispro", "novolog": "insulin aspart", "tresiba": "insulin degludec",
  "ozempic": "semaglutide", "rybelsus": "semaglutide", "wegovy": "semaglutide", "trulicity": "dulaglutide",
  "mounjaro": "tirzepatide", "januvia": "sitagliptin", "trad jenta": "linagliptin", "tradjenta": "linagliptin",
  "pepcid": "famotidine", "prilosec": "omeprazole", "nexium": "esomeprazole", "protonix": "pantoprazole",
  "zyrtec": "cetirizine", "claritin": "loratadine", "benadryl": "diphenhydramine",
  "tylenol": "acetaminophen", "advil": "ibuprofen", "motrin": "ibuprofen", "aleve": "naproxen",
  "lasix": "furosemide", "aldactone": "spironolactone", "synthroid": "levothyroxine",
  "seroquel": "quetiapine", "zoloft": "sertraline", "prozac": "fluoxetine", "lexapro": "escitalopram",
  "wellbutrin": "bupropion", "abilify": "aripiprazole", "depakote": "divalproex", "ativan": "lorazepam",
  "subutex": "buprenorphine", "suboxone": "buprenorphine/naloxone", "narcan": "naloxone",
  "viagra": "sildenafil", "cialis": "tadalafil", "truvada": "emtricitabine/tenofovir disoproxil",
  "eliquis": "apixaban", "xarelto": "rivaroxaban", "coumadin": "warfarin", "plavix": "clopidogrel",
};
function ingredient(name: string): string {
  let n = name.toLowerCase().replace(/®|™/g, "").trim();
  for (const b of Object.keys(brands).sort((a, b) => b.length - a.length || cmp(a, b))) {
    if (n === b || n.startsWith(b + " ") || n.startsWith(b + "(")) return brands[b];
  }
  // Strength is not a dose; discard it only when identifying the drug.
  n = n.replace(/\s+\d.*$/, "").replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:hydrochloride|hcl|trihydrate|dihydrate|monohydrate|besylate|tartrate|succinate|fumarate|maleate|mesylate|sulfate|sulphate|phosphate)\b/g, " ")
    .replace(/\s+(?:sodium|potassium)\b$/g, " ")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|sustained[ -]release|er|xr|sr|xl|dr|hfa)\b/g, " ")
    .replace(/\b(?:oral|tablet[s]?|tab[s]?|capsule[s]?|cap[s]?|solution|suspension|inhaler|injection|injectable|pen|vial|cream|ointment|patch|powder|spray|drops|subcutaneous)\b/g, " ")
    .replace(/\s+/g, " ").trim();
  return n;
}
function medKey(e: Entry): string {
  return str(e.v.rxnorm_ingredient) ? "rx:" + str(e.v.rxnorm_ingredient) : "name:" + ingredient(str(e.v.drug_name));
}
function sensitivity(text: string, code = ""): Sensitivity[] | undefined {
  const t = text.toLowerCase(); const out: Sensitivity[] = [];
  if (/\b(?:depress(?:ion|ive)|bipolar|schizophren\w*|psychosis|psychotic|anxiety|ptsd|adhd|obsessive|suicid\w*|quetiapine|sertraline|fluoxetine|escitalopram|citalopram|paroxetine|aripiprazole|olanzapine|risperidone|clozapine)\b/.test(t) || /^F(?:[2-6]\d|90)/i.test(code)) out.push("mental-health");
  if (/\b(?:(?:alcohol|opioid|cocaine|cannabis|tobacco|nicotine|methamphetamine|substance).{0,20}(?:use disorder|dependence|abuse|withdrawal)|alcoholism|buprenorphine|disulfiram|acamprosate)\b/.test(t) || /^F1\d/i.test(code)) out.push("substance-use");
  if (/\b(?:pregnan\w*|contracept\w*|fertility|infertility|erectile dysfunction|sexual dysfunction|gestational|ethinyl estradiol|levonorgestrel|norethindrone)\b/.test(t) || /^(?:O\d|Z3[234]|Z30)/i.test(code)) out.push("sexual-reproductive-health");
  if (/\b(?:hiv|aids|chlamydia|gonorrh\w*|syphilis|genital herpes|trichomon\w*|antiretroviral|emtricitabine|dolutegravir|bictegravir|ritonavir)\b/.test(t) || /^(?:B20|Z21|A5[0-9]|A6[0-4])/i.test(code)) out.push("hiv-sti");
  if (/\b(?:brca[12]?|lynch syndrome|cystic fibrosis|sickle cell|huntington|hemochromatosis|factor v leiden|genetic|hereditary|inherited)\b/.test(t)) out.push("genetic");
  return out.length ? out : undefined;
}
function frequency(sig: string): MedicationRow["frequency"] {
  const s = sig.toLowerCase().replace(/\./g, "");
  if (/\b(?:prn|as needed|when needed)\b/.test(s)) return "PRN";
  if (/\b(?:taper\w*|every other|alternat\w*|qid|four times|monthly|q4h|q6h)\b/.test(s) || /every\s+(?:4|6)\s*hours?/.test(s)) return "other";
  if (/\b(?:qhs|at bedtime|nightly|at night)\b/.test(s)) return "QHS";
  if (/\b(?:bid|twice daily|twice a day|two times (?:a day|daily)|q12h)\b/.test(s) || /every\s+12\s*hours?/.test(s)) return "BID";
  if (/\b(?:tid|three times (?:daily|a day)|q8h)\b/.test(s) || /every\s+8\s*hours?/.test(s)) return "TID";
  if (/\b(?:qw|qweek|weekly|once a week|every week)\b/.test(s)) return "QW";
  if (/\b(?:qd|qday|daily|once a day|q24h|every morning|each morning|every evening|in the evening)\b/.test(s) || /every\s+24\s*hours?/.test(s)) return "QD";
  if (/\b(?:every|once|twice|times|hours?|days?|weeks?|months?|with meals|before meals)\b/.test(s)) return "other";
  return undefined;
}
function amount(s: string): MedicationRow["dose"] {
  const m = /^(\d+(?:\.\d+)?|\.\d+)\s*(mg|milligrams?|mcg|[µμ]g|micrograms?|u|iu|units?|ml|cc|millilit(?:er|re)s?|tabs?|tablets?)\b/i.exec(s.trim());
  if (!m) return undefined;
  const u = m[2].toLowerCase();
  const unit: NonNullable<MedicationRow["dose"]>["unit"] = /^(?:mcg|[µμ]g|micro)/.test(u) ? "mcg" : /^(?:mg|milli?gram)/.test(u) ? "mg" : /^(?:u|iu)/.test(u) ? "units" : /^(?:ml|cc|millilit)/.test(u) ? "mL" : "tablet";
  return Number.isFinite(+m[1]) ? { value: +m[1], unit } : undefined;
}
function dose(e: Entry): MedicationRow["dose"] {
  const d = str(e.v.dose_text), sig = str(e.v.sig), name = str(e.v.drug_name);
  if (/\d\s*(?:[-–—]|to|or)\s*\d|sliding|scale|taper|depending|based on|\bif\b|\balternat/i.test(d + " " + sig) || /\/\s*(?:kg|m2|h\b|min\b)/i.test(d)) return undefined;
  if ((d.match(/\d\s*(?:mg|mcg|units?|mL)\b/gi) || []).length > 1) return undefined;
  const explicit = amount(d);
  if (explicit && explicit.unit !== "tablet") return explicit; // dose_text is per administration, not unit strength.
  const count = explicit?.value ?? Number(/\b(\d+(?:\.\d+)?)\s*(?:tabs?|tablets?|capsules?|caps?|puffs?|actuations?)\b/i.exec(sig)?.[1]);
  const strength = /\b(\d+(?:\.\d+)?\s*(?:mg|mcg|[µμ]g|micrograms?|milligrams?))\b/i.exec(name);
  const s = strength ? amount(strength[1]) : undefined;
  if (s && (Number.isFinite(count) || frequency(sig))) {
    const value = s.value * (Number.isFinite(count) ? count : 1);
    return Number.isFinite(value) ? { value, unit: s.unit } : undefined;
  }
  if (explicit) return explicit;
  return amount(sig.replace(/^take\s+/i, ""));
}
function medStatus(v: unknown): MedicationRow["status"] | undefined {
  switch (v) {
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
    case "not_reconciled": return "unknown";
    default: return undefined;
  }
}
function stopReason(s: string): MedicationRow["stop_reason"] {
  if (/side effect|adverse|reaction|rash|cough|angioedema|anaphyl|ketoacidosis|pancreatitis|toxicity|kidney injury/i.test(s)) return "adverse_reaction";
  if (/ineffective|not effective|did not work|lack of (?:benefit|effect)/i.test(s)) return "ineffective";
  if (/replac|switch|changed to|change in (?:therapy|regimen)/i.test(s)) return "therapy_changed";
  if (/course (?:is )?(?:complete|finished)|completed|finished (?:the )?course/i.test(s)) return "course_complete";
  if (/patient (?:choice|request|preference|declin|chose)|prefers|does not want/i.test(s)) return "patient_choice";
  if (/because|due to|for (?:renal|kidney|cost|surgery)|no longer (?:needed|indicated)/i.test(s)) return "other";
  return undefined;
}
function decisionDate(d: Doc): string | undefined {
  return d.enc?.document_kind === "discharge_summary"
    ? localDate(d.enc.discharged) ?? localDate(d.end)
    : localDate(d.effective);
}
function medications(docs: Doc[]): MedicationRow[] {
  const stays = new Map<string, Doc[]>();
  for (const d of docs) {
    if (!d.enc) continue;
    const k = JSON.stringify([d.issuer, d.encounter]);
    stays.set(k, [...(stays.get(k) || []), d]);
  }
  const groups = [...stays.values()].sort((a, b) => Math.min(...a.map(d => d.start)) - Math.min(...b.map(d => d.start)) || docOrder(a[a.length - 1], b[b.length - 1]));
  const stay = groups[groups.length - 1];
  if (!stay) return [];
  const discharges = stay.filter(d => d.enc?.document_kind === "discharge_summary");
  const chosen = (discharges.length ? discharges : stay).slice().sort(docOrder).at(-1)!;
  const latest = new Map<string, Entry>();
  for (const e of chosen.entries) if (e.v.type === "home_med" && str(e.v.drug_name) && medStatus(e.v.status)) latest.set(medKey(e), e);
  return [...latest.values()].map(e => {
    const status = medStatus(e.v.status)!;
    const name = str(e.v.drug_name), ing = ingredient(name), reason = str(e.v.instructions);
    const row: MedicationRow = { drug_name: name, ingredient: ing || undefined,
      rxnorm_ingredient: str(e.v.rxnorm_ingredient) || undefined, status,
      dose: dose(e), frequency: frequency(str(e.v.sig)), patient_reported: false,
      status_reason_text: reason || undefined, stop_reason: status === "stopped" ? stopReason(reason) : undefined,
      sensitivity: sensitivity(ing + " " + reason), evidence: ev(e) };
    // Repeated snapshots are not repeated starts. Trace an uninterrupted status
    // for this ingredient AND dose within this stay, independently of entry keys.
    const sequence: Entry[] = [];
    for (const d of stay.filter(d => docOrder(d, chosen) <= 0).sort(docOrder)) {
      const found = d.entries.find(x => x.v.type === "home_med" && medKey(x) === medKey(e) && str(x.v.dose_text) === str(e.v.dose_text));
      if (!found) { sequence.length = 0; continue; }
      sequence.push(found);
    }
    let first = sequence.length - 1;
    while (first > 0 && medStatus(sequence[first - 1].v.status) === status) {
      const here = sequence[first], before = sequence[first - 1];
      if ((here.v.status === "new" || here.v.status === "changed") &&
        (here.v.status !== before.v.status || str(here.v.sig) !== str(before.v.sig))) break;
      first--;
    }
    const start = sequence[first];
    if (start && status !== "unknown") {
      const isAction = status === "held" || status === "stopped" || start.v.status === "new" || start.v.status === "changed" ||
        (first > 0 && ["held", "stopped"].includes(medStatus(sequence[first - 1].v.status) || ""));
      if (isAction) {
        row.status_since = decisionDate(start.doc);
        row.evidence = evidence(row.evidence, ev(start));
      }
    }
    return row;
  }).sort((a, b) => cmp(a.ingredient || a.drug_name, b.ingredient || b.drug_name) || cmp(a.rxnorm_ingredient || "", b.rxnorm_ingredient || ""));
}

const label = (e: Entry): string => str(e.v.type === "history" ? e.v.condition : e.v.label);
const localDx = (e: Entry): string => str(obj(e.v.riverside_dx)?.code);
function isCkd(e: Entry): boolean {
  return /^N18(?:\.|$)/i.test(str(e.v.icd10cm)) || /\b(?:ckd|chronic kidney disease|chronic renal (?:disease|insufficiency))\b/i.test(label(e));
}
function conditionName(e: Entry): string {
  let s = norm(label(e)).replace(/^(?:r o|rule out|possible|suspected|history of|h o)\s+/, "")
    .replace(/\b(?:resolved|resolving|active|ruled out)\b/g, "").trim();
  s = s.replace(/diabetic ketoacidosis/g, "dka").replace(/acute renal failure|acute renal injury|\baki\b/g, "acute kidney injury");
  if (isCkd(e)) return "chronic kidney disease";
  if (/^(?:essential |primary |systemic )?hypertension$/.test(s)) return "hypertension";
  if (/\b(?:type 2|type ii|t2dm)\b/.test(s) && /diabet|t2dm/.test(s) && !/ketoacidosis|dka|nephropathy|retinopathy|neuropathy|hyperosmolar/.test(s)) return "type 2 diabetes";
  if (/\b(?:type 1|type i|t1dm)\b/.test(s) && /diabet|t1dm/.test(s) && !/ketoacidosis|dka|nephropathy|retinopathy|neuropathy|hyperosmolar/.test(s)) return "type 1 diabetes";
  if (/\basthma\b/.test(s) && !/cardiac asthma/.test(s)) return "asthma";
  return s.replace(/\s+/g, " ");
}
function stage(e: Entry): ProblemRow["ckd_stage"] {
  if (!isCkd(e)) return undefined;
  const s = label(e);
  const m = /\bG([1245]|3[ab])\b|\bstage\s*([1245]|3\s*[ab])\b/i.exec(s);
  if (m) return ("G" + (m[1] || m[2]).toLowerCase().replace(/\s/g, "")) as ProblemRow["ckd_stage"];
  const codes: Record<string, NonNullable<ProblemRow["ckd_stage"]>> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
  return codes[str(e.v.icd10cm).toUpperCase()];
}
function albuminuria(e: Entry): ProblemRow["albuminuria"] {
  if (!isCkd(e)) return undefined;
  return /\b(A[123])\b/i.exec(label(e))?.[1].toUpperCase() as ProblemRow["albuminuria"];
}
function adverseOnly(e: Entry): boolean {
  // T-code diagnoses that name only a drug adverse effect are not conditions.
  return /^(?:adverse (?:effect|reaction)|drug[- ]induced adverse effect|allergic reaction to|allergy to)\b/i.test(label(e)) ||
    (/^T(?:3[6-9]|[45]\d)/i.test(str(e.v.icd10cm)) && /adverse effect/i.test(label(e)));
}
type ConditionGroup = { all: Entry[]; established: Entry[]; current?: Entry };
function conditionGroups(docs: Doc[]): ConditionGroup[] {
  const all = docs.flatMap(d => d.entries).filter(e => (e.v.type === "diagnosis" || e.v.type === "history") && label(e));
  const localByCode = new Map<string, Set<string>>();
  const localByStayCode = new Map<string, Set<string>>();
  for (const e of all) if (localDx(e) && str(e.v.icd10cm)) {
    const code = str(e.v.icd10cm).toUpperCase();
    for (const [map, key] of [[localByCode, code], [localByStayCode, JSON.stringify([e.doc.encounter, code])]] as const) {
      const set = map.get(key) || new Set<string>(); set.add(localDx(e)); map.set(key, set);
    }
  }
  function key(e: Entry): string {
    if (isCkd(e)) return "condition:ckd";
    if (localDx(e)) return "local:" + localDx(e);
    const code = str(e.v.icd10cm).toUpperCase();
    if (code) {
      const locals = localByStayCode.get(JSON.stringify([e.doc.encounter, code])) || localByCode.get(code);
      if (locals?.size === 1) return "local:" + [...locals][0];
    }
    const name = conditionName(e);
    if (["hypertension", "type 1 diabetes", "type 2 diabetes", "asthma"].includes(name)) return "condition:" + name;
    return code ? "icd:" + code : "name:" + name;
  }
  // Bridge an uncoded or recoded name only when it points unambiguously to one
  // coded identity. Never conflate two Riverside local codes just by ICD-10.
  const byName = new Map<string, Set<string>>();
  for (const e of all) {
    const n = conditionName(e), set = byName.get(n) || new Set<string>();
    set.add(key(e)); byName.set(n, set);
  }
  const aliases = new Map<string, string>();
  function root(k: string): string {
    while (aliases.has(k)) k = aliases.get(k)!;
    return k;
  }
  for (const matches of byName.values()) {
    const keys = unique([...matches].map(root));
    const locals = keys.filter(k => k.startsWith("local:"));
    if (locals.length > 1) continue;
    const target = locals[0] || keys.slice().sort()[0];
    for (const k of keys) if (k !== target) aliases.set(k, target);
  }
  const groups = new Map<string, Entry[]>();
  for (const e of all) {
    const k = root(key(e));
    const group = groups.get(k) || []; group.push(e); groups.set(k, group);
  }
  return [...groups.values()].map(entries => {
    entries.sort(entryOrder);
    const episodes = new Map<string, Entry | undefined>();
    for (const e of entries.filter(e => e.v.type === "diagnosis")) {
      if (e.v.status === "active" || e.v.status === "resolved") episodes.set(e.doc.encounter, e);
      else if (e.v.status === "ruled_out") episodes.set(e.doc.encounter, undefined);
      // A working diagnosis never establishes a condition, even if later omitted.
    }
    const established = [...episodes.values()].filter((e): e is Entry => !!e).sort(entryOrder);
    let current = established.at(-1);
    if (!current && !entries.some(e => e.v.type === "diagnosis" && e.v.status === "ruled_out")) current = entries.filter(e => e.v.type === "history").at(-1);
    return { all: entries, established, current };
  });
}
function problems(groups: ConditionGroup[]): ProblemRow[] {
  const rows: ProblemRow[] = [];
  for (const g of groups) {
    const e = g.current;
    if (!e || adverseOnly(e)) continue;
    const code = str(e.v.icd10cm);
    const row: ProblemRow = { condition: label(e), icd10cm: code || undefined,
      status: e.v.status === "resolved" || (e.v.type === "history" && /^(?:history of|h\/o)\b/i.test(label(e))) ? "resolved" : "active",
      sensitivity: sensitivity(label(e), code), evidence: ev(e) };
    // A copied PMH stage does not overrule a clinician's later assessment.
    // Keep the latest explicitly recorded category, never estimate from eGFR.
    const assessments = g.all.filter(x => x.v.type === "diagnosis" && (x.v.status === "active" || x.v.status === "resolved"));
    const history = g.all.filter(x => x.v.type === "history");
    const latestStage = assessments.filter(x => stage(x)).at(-1) ?? history.filter(x => stage(x)).at(-1);
    const latestAlbumin = assessments.filter(x => albuminuria(x)).at(-1) ?? history.filter(x => albuminuria(x)).at(-1);
    if (isCkd(e) && latestStage) { row.ckd_stage = stage(latestStage); row.evidence = evidence(row.evidence, ev(latestStage)); }
    if (isCkd(e) && latestAlbumin) { row.albuminuria = albuminuria(latestAlbumin); row.evidence = evidence(row.evidence, ev(latestAlbumin)); }
    const dated = history.filter(x => onset(x.v.onset_text)).at(-1);
    if (dated) { row.onset = onset(dated.v.onset_text); row.evidence = evidence(row.evidence, ev(dated)); }
    rows.push(row);
  }
  return rows.sort((a, b) => cmp(a.condition, b.condition) || cmp(a.icd10cm || "", b.icd10cm || ""));
}

type DrugClass = { pattern: RegExp; members: RegExp };
const drugClasses: DrugClass[] = [
  { pattern: /\bSGLT[- ]?2\s*(?:inhibitors?)?/i, members: /\b(?:empagliflozin|dapagliflozin|canagliflozin|ertugliflozin|bexagliflozin|sotagliflozin)\b/i },
  { pattern: /\b(?:penicillins?|penicillin antibiotics)\b/i, members: /\b(?:amoxicillin|ampicillin|penicillin|piperacillin|dicloxacillin|nafcillin|oxacillin)\b/i },
  { pattern: /\b(?:NSAIDs?|non[- ]steroidal anti[- ]inflammatory(?: drugs?)?)\b/i, members: /\b(?:naproxen|ibuprofen|diclofenac|meloxicam|celecoxib|ketorolac|indomethacin|piroxicam|etodolac|aspirin)\b/i },
  { pattern: /\bACE\s*inhibitors?\b/i, members: /\b(?:lisinopril|enalapril|ramipril|benazepril|captopril|fosinopril|quinapril|perindopril)\b/i },
  { pattern: /\b(?:ARBs?|angiotensin (?:II |2 )?receptor blockers?)\b/i, members: /\b(?:losartan|valsartan|irbesartan|candesartan|telmisartan|olmesartan|azilsartan)\b/i },
  { pattern: /\bstatins?\b/i, members: /\b(?:atorvastatin|rosuvastatin|simvastatin|pravastatin|lovastatin|fluvastatin|pitavastatin)\b/i },
  { pattern: /\b(?:sulfonamide antibiotics|sulfonamides|sulfa antibiotics)\b/i, members: /\b(?:sulfamethoxazole|sulfadiazine|sulfisoxazole)\b/i },
  { pattern: /\bcephalosporins?\b/i, members: /\b(?:cephalexin|cefazolin|ceftriaxone|cefuroxime|cefdinir|cefepime|cefpodoxime|cefotaxime)\b/i },
  { pattern: /\bfluoroquinolones?\b/i, members: /\b(?:ciprofloxacin|levofloxacin|moxifloxacin|ofloxacin)\b/i },
  { pattern: /\bGLP[- ]?1(?: receptor)?\s*(?:agonists?)?\b/i, members: /\b(?:semaglutide|liraglutide|dulaglutide|exenatide|lixisenatide)\b/i },
  { pattern: /\bsulfonylureas?\b/i, members: /\b(?:glipizide|glyburide|glimepiride|gliclazide|chlorpropamide|tolbutamide)\b/i },
  { pattern: /\boral (?:hypoglycemic|antidiabetic)(?: drugs?| agents?)?\b/i, members: /\b(?:metformin|glipizide|glyburide|glimepiride|gliclazide|sitagliptin|linagliptin|saxagliptin|alogliptin|pioglitazone|rosiglitazone|acarbose|miglitol|repaglinide|nateglinide|empagliflozin|dapagliflozin|canagliflozin|ertugliflozin)\b/i },
  { pattern: /\banticoagulants?\b/i, members: /\b(?:warfarin|apixaban|rivaroxaban|dabigatran|edoxaban|heparin|enoxaparin|dalteparin|fondaparinux)\b/i },
  { pattern: /\b(?:beta|β)[ -]?blockers?\b/i, members: /\b(?:metoprolol|atenolol|propranolol|carvedilol|bisoprolol|labetalol|nebivolol|nadolol|timolol)\b/i },
  { pattern: /\bthiazide(?: diuretics?)?\b/i, members: /\b(?:hydrochlorothiazide|chlorthalidone|indapamide|metolazone|chlorothiazide)\b/i },
  { pattern: /\bloop diuretics?\b/i, members: /\b(?:furosemide|bumetanide|torsemide|ethacrynic acid)\b/i },
];
const knownDrugs = unique([...Object.values(brands), "amoxicillin", "erythromycin", "isoniazid", "valproate", "valproic acid", "allopurinol", "prednisone", "methotrexate", "nitrofurantoin", "trimethoprim", "sulfamethoxazole", "carbamazepine", "lamotrigine", "levetiracetam", "gabapentin", "lithium"]);
function containsName(text: string, name: string): boolean {
  const t = " " + norm(text) + " ";
  return !!norm(name) && t.includes(" " + norm(name) + " ");
}
type Attribution = { substance: string; rx?: string; supporting?: Entry };
function attributedDrug(e: Entry): Attribution | undefined {
  const text = [label(e), str(obj(e.v.riverside_dx)?.name)].join("; ");
  const code = str(e.v.icd10cm).toUpperCase();
  const causal = /associated|induced|due to|secondary to|attributed to|caused by|from |adverse (?:effect|reaction)|allerg(?:y|ic reaction) to/i.test(text) ||
    (/\bon\b/i.test(text) && /urticaria|rash|hives|anaphyla|angioedema|pancreatitis|ketoacidosis|\bdka\b|toxicity|(?:kidney|liver) injury|nausea|cough/i.test(text));
  // Adverse-effect codes identify a class only to the specificity of that code.
  const codedClass = /^T36\.0X5/.test(code) ? "penicillins" : /^T39\.3[0-9X]*5/.test(code) ? "NSAIDs" : "";
  if (!causal && !codedClass) return undefined;
  const meds = e.doc.entries.filter(x => (x.v.type === "home_med" || x.v.type === "inpatient_med") && str(x.v.drug_name));
  // Explicitly named individual drug takes priority over any class mention.
  const named = meds.filter(m => containsName(text, ingredient(str(m.v.drug_name))) || containsName(text, str(m.v.drug_name)));
  const namedIngredients = unique(named.map(m => ingredient(str(m.v.drug_name))));
  if (namedIngredients.length === 1) {
    const m = named.find(m => str(m.v.rxnorm_ingredient)) || named[0];
    return { substance: namedIngredients[0], rx: str(m.v.rxnorm_ingredient) || undefined, supporting: m };
  }
  for (const d of [...knownDrugs, ...Object.keys(brands)].sort((a, b) => b.length - a.length || cmp(a, b))) {
    if (containsName(text, d)) return { substance: ingredient(d) };
  }
  for (const c of drugClasses) {
    const match = c.pattern.exec(text) || c.pattern.exec(codedClass);
    if (!match) continue;
    const matches = meds.filter(m => c.members.test(ingredient(str(m.v.drug_name))));
    const drugs = unique(matches.map(m => ingredient(str(m.v.drug_name))));
    if (drugs.length === 1) {
      const m = matches.find(m => str(m.v.rxnorm_ingredient)) || matches[0];
      return { substance: drugs[0], rx: str(m.v.rxnorm_ingredient) || undefined, supporting: m };
    }
    return { substance: match[0] };
  }
  // Preserve an explicitly named, otherwise unfamiliar drug/class. Do not mine
  // general narrative, a working diagnosis, or an unlinked medication for a cause.
  const m = /(?:adverse (?:effect|reaction) (?:of|to)|allerg(?:y|ic reaction) to|due to|caused by|attributed to)\s+([^,;()]+)/i.exec(label(e));
  if (m && !/^(?:infection|dehydration|volume|fasting|sepsis|trauma|poor intake|diabetes|unknown|unspecified)\b/i.test(m[1])) {
    const value = m[1].replace(/\s+(?:use|therapy|treatment)\b.*$/i, "").trim();
    if (/drug|medication|inhibitor|antibiotic/i.test(value)) return { substance: value };
    if (/adverse|allerg/i.test(label(e))) return { substance: ingredient(value) || value };
  }
  return undefined;
}
function reactionInfo(reaction: string, severity = "", diagnosis = false): Pick<AllergyIntoleranceRow, "reaction_type" | "mechanism" | "criticality"> {
  const hyper = /hives|urticaria|rash|anaphyla|angioedema|bronchospasm|(?:lip|fac[ei]|tongue|throat).{0,12}swelling|swelling.{0,15}(?:lip|face|tongue|throat)|stevens.johnson|toxic epidermal|\bDRESS\b/i.test(reaction);
  const serious = /ketoacidosis|\bdka\b|pancreatitis|(?:liver|kidney|renal|hepatic) (?:injury|failure|damage)|hepatotoxicity|nephrotoxicity|hepatitis|rhabdomyolysis|agranulocytosis|pancytopenia|thrombocytopenia|hemolysis|haemolysis|torsades|arrhythmia|hemorrhage|haemorrhage|bleeding|seizure|lactic acidosis|serotonin syndrome/i.test(reaction);
  const side = /cough|nausea|vomiting|diarrh|constipation|stomach upset|drows|sedation|fatigue|headache|dizz|dry mouth|flushing|myalgia|peripheral edema|ankle swelling|ankle edema/i.test(reaction);
  const nonimmune = /non[- ]immune|non[- ]allergic/i.test(reaction) || (!hyper && (side || /ketoacidosis|\bdka\b|lactic acidosis|rhabdomyolysis|serotonin syndrome/i.test(reaction)));
  return {
    // The target has no unspecified-reaction category. For a reactionless allergy
    // list entry use hypersensitivity with unknown mechanism and criticality.
    reaction_type: hyper ? "hypersensitivity" : serious ? "serious_adverse_event" : side ? "side_effect" : diagnosis ? "serious_adverse_event" : "hypersensitivity",
    mechanism: nonimmune ? "non_immune" : /(?:immune[- ]mediated|IgE[- ]mediated|positive allergy test)/i.test(reaction) ? "immune" : "unknown",
    criticality: severity === "severe" || serious || /anaphyla|angioedema|bronchospasm|stevens.johnson|toxic epidermal/i.test(reaction) ? "high" : severity === "mild" ? "low" : "unknown",
  };
}
function allergySubstance(s: string, rx: string): string {
  if (!rx && /\s(?:and|with)\s|[+/]/i.test(s)) return s;
  if (rx || knownDrugs.some(d => containsName(s, d)) || Object.keys(brands).some(b => containsName(s, b))) return ingredient(s);
  return s;
}
function allergies(docs: Doc[], groups: ConditionGroup[]): AllergyIntoleranceRow[] {
  const candidates: AllergyIntoleranceRow[] = [];
  const snapshot = docs.filter(d => !!d.enc).at(-1);
  if (snapshot) for (const e of snapshot.entries) {
    if (e.v.type !== "allergy") continue;
    const s = str(e.v.substance), reaction = str(e.v.reaction), rx = str(e.v.rxnorm_ingredient);
    if (!s || /^(?:NKDA|NKA|no known (?:drug )?allergies)$/i.test(s)) continue;
    candidates.push({ substance: allergySubstance(s, rx), rxnorm_ingredient: rx || undefined,
      ...reactionInfo(reaction, str(e.v.severity)), reaction: reaction || undefined,
      sensitivity: sensitivity(s + " " + reaction), evidence: ev(e) });
  }
  for (const g of groups) {
    // A resolved drug-induced injury still documents a reaction to avoid. Use
    // each established episode, because a later recurrence may name another drug.
    for (const e of g.established) {
      let from = e;
      let attribution = attributedDrug(from);
      if (!attribution) {
        const earlier = g.all.filter(x => x.doc.encounter === e.doc.encounter && entryOrder(x, e) <= 0 &&
          (x.v.status === "active" || x.v.status === "resolved") && attributedDrug(x)).at(-1);
        if (earlier) { from = earlier; attribution = attributedDrug(from); }
      }
      if (!attribution) continue;
      const reaction = label(from);
      candidates.push({ substance: attribution.substance, rxnorm_ingredient: attribution.rx,
        ...reactionInfo(reaction, "", true), reaction, sensitivity: sensitivity(reaction),
        evidence: evidence(ev(e), ev(from), attribution.supporting ? ev(attribution.supporting) : []) });
    }
  }
  const rows = new Map<string, AllergyIntoleranceRow>();
  for (const row of candidates) {
    const key = norm(row.substance);
    const prev = rows.get(key);
    if (!prev) { rows.set(key, row); continue; }
    const order = { side_effect: 0, hypersensitivity: 1, serious_adverse_event: 2 };
    const best = order[row.reaction_type] > order[prev.reaction_type] ? row : prev;
    rows.set(key, { ...best, rxnorm_ingredient: row.rxnorm_ingredient || prev.rxnorm_ingredient,
      reaction: unique([prev.reaction, row.reaction].filter((s): s is string => !!s)).join("; ") || undefined,
      criticality: [prev.criticality, row.criticality].includes("high") ? "high" : [prev.criticality, row.criticality].includes("unknown") ? "unknown" : "low",
      mechanism: prev.mechanism === row.mechanism ? row.mechanism : "unknown",
      sensitivity: (prev.sensitivity || row.sensitivity) ? unique([...(prev.sensitivity || []), ...(row.sensitivity || [])]) : undefined,
      evidence: evidence(prev.evidence, row.evidence) });
  }
  return [...rows.values()].sort((a, b) => cmp(a.substance, b.substance));
}

const units: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const labCodes: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", EGFR: "egfr", GFR: "egfr",
  NA: "sodium", SODIUM: "sodium", K: "potassium", POTASSIUM: "potassium", CL: "chloride", CHLORIDE: "chloride",
  CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate", BICARB: "bicarbonate", AGAP: "anion_gap", ANIONGAP: "anion_gap",
  BUN: "bun", GLU: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", ACR: "uacr",
  PLT: "platelets", PLATELETS: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", BOHB: "bhb", PH: "ph", VPH: "ph", APH: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2",
  LIPASE: "lipase", LIP: "lipase", TROPONINI: "troponin", TNI: "troponin",
  CHOL: "cholesterol", CHOLESTEROL: "cholesterol", TC: "cholesterol", TRIG: "triglycerides", TG: "triglycerides",
  HDL: "hdl", HDLC: "hdl", LDL: "ldl", LDLC: "ldl",
};
const loincs: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr",
  "2951-2": "sodium", "2823-3": "potassium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate",
  "33037-3": "anion_gap", "10466-1": "anion_gap", "3094-0": "bun", "2345-7": "glucose", "2339-0": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "59261-8": "a1c", "14959-1": "uacr", "9318-7": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin",
  "6873-4": "bhb", "27369-2": "bhb", "2744-1": "ph", "2746-6": "ph", "11558-4": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "3040-3": "lipase",
  "10839-9": "troponin", "89579-7": "troponin", "42757-5": "troponin", "2571-8": "triglycerides",
  "2093-3": "cholesterol", "2085-9": "hdl", "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl",
};
function analyte(value: Obj, specimen: string): Analyte | undefined {
  const test = obj(value.test); if (!test) return undefined;
  const name = str(test.name).toLowerCase(), code = str(test.local_code).toUpperCase().replace(/[^A-Z0-9]/g, "");
  // These are not the requested analytes, even if a short local code collides.
  if (/troponin\s*t\b|\btnt\b/.test(name) || /(?:urine|urinary).*(?:creatinine|glucose|sodium|potassium|chloride)/.test(name) && !/ratio|albumin.*creatinine/.test(name)) return undefined;
  const loinc = str(test.loinc);
  const direct = (Object.hasOwn(loincs, loinc) ? loincs[loinc] : undefined) || labCodes[code];
  let a: Analyte | undefined = direct;
  if (!a) {
    const patterns: [Analyte, RegExp][] = [
      ["uacr", /(?:albumin.{0,15}creatinine|microalbumin.{0,15}creatinine).*(?:ratio|\bcr\b)|\buacr\b/],
      ["egfr", /\begfr\b|estimated glomerular filtration|\bgfr\b/],
      ["a1c", /(?:hemoglobin|haemoglobin|hgb|hb)\s*a1c|\ba1c\b/],
      ["creatinine", /\bcreatinine\b/], ["potassium", /\bpotassium\b/], ["sodium", /\bsodium\b/], ["chloride", /\bchloride\b/],
      ["anion_gap", /\banion gap\b/], ["bicarbonate", /bicarbonate|total (?:co2|carbon dioxide)|carbon dioxide.*total/],
      ["bun", /\b(?:blood )?urea nitrogen\b|\bbun\b/], ["glucose", /\bglucose\b/],
      ["platelets", /\bplatelet(?:s| count)?\b/], ["wbc", /white blood cell|\bwbc\b|leukocyte count/],
      ["hemoglobin", /^(?:hemoglobin|haemoglobin|hgb)(?:\s|$)/], ["bhb", /(?:beta|β|3)[ -]?hydroxybutyrate|\bbhb\b/],
      ["ph", /^ph(?:\b|,)/], ["pco2", /\bpco2\b|carbon dioxide.*partial pressure/], ["lipase", /\blipase\b/],
      ["troponin", /\btroponin\s*i\b/], ["triglycerides", /\btriglycerides?\b/], ["hdl", /\bhdl\b|high density lipoprotein/],
      ["ldl", /\bldl\b|low density lipoprotein/], ["cholesterol", /^(?:total )?cholesterol(?:,? total)?$/],
    ];
    a = patterns.find(([, p]) => p.test(name))?.[0];
  }
  if (a === "creatinine" && /urine|urinary/i.test(specimen + " " + name)) return undefined;
  return a;
}
function numeric(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const s = str(v).replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/−/g, "-");
  const m = /^(<=|>=|<|>)?\s*([+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(s);
  if (!m) return undefined;
  const value = Number(m[2].replace(/,/g, ""));
  return Number.isFinite(value) ? { value, comparator: m[1] as LabResultRow["comparator"] || undefined } : undefined;
}
function unitKey(s: string): string {
  return s.toLowerCase().replace(/[µμ]/g, "u").replace(/²/g, "2").replace(/\s+/g, "").replace(/lit(?:er|re)s?/g, "l").replace(/\^/g, "*");
}
function convert(a: Analyte, value: number, unit: unknown): number | undefined {
  const u = unitKey(str(unit)), target = unitKey(units[a]);
  let out: number | undefined;
  if (u === target || (a === "ph" && (u === "" || u === "ph" || u === "1"))) out = value;
  else if (["sodium", "potassium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") out = value;
  else if (a === "creatinine" && u === "umol/l") out = value / 88.4;
  else if (a === "creatinine" && u === "mmol/l") out = value * 1000 / 88.4;
  else if (a === "glucose" && u === "mmol/l") out = value * 18.016;
  else if (a === "bun" && u === "mmol/l") out = value * 2.801;
  else if (["cholesterol", "hdl", "ldl"].includes(a) && u === "mmol/l") out = value * 38.67;
  else if (a === "triglycerides" && u === "mmol/l") out = value * 88.57;
  else if (a === "a1c" && u === "mmol/mol") out = value * 0.09148 + 2.152;
  else if (a === "uacr" && u === "mg/mmol") out = value * 8.84;
  else if (a === "uacr" && ["ug/mg", "mcg/mg"].includes(u)) out = value;
  else if (a === "uacr" && u === "g/g") out = value * 1000;
  else if (["wbc", "platelets"].includes(a) && ["10*9/l", "10e9/l", "k/ul", "thousand/ul", "thousands/ul", "x10*3/ul"].includes(u)) out = value;
  else if (["wbc", "platelets"].includes(a) && ["cells/ul", "cell/ul", "/ul", "1/ul", "cells/mm3", "/mm3"].includes(u)) out = value / 1000;
  else if (a === "hemoglobin" && u === "g/l") out = value / 10;
  else if (a === "pco2" && u === "kpa") out = value * 7.50062;
  else if (a === "troponin" && ["ng/l", "pg/ml"].includes(u)) out = value / 1000;
  else if (a === "troponin" && u === "ug/l") out = value;
  else if (a === "lipase" && u === "ukat/l") out = value * 60;
  else if (a === "lipase" && u === "iu/l") out = value;
  else if (a === "egfr" && ["ml/min/1.73m*2", "ml/min/1.73m2", "ml/min/{1.73_m2}"].includes(u)) out = value;
  else if (a === "bhb" && u === "mg/dl") out = value / 10.412;
  else if (units[a] === "mg/dL" && u === "mg/l") out = value / 10;
  if (out === undefined || !Number.isFinite(out)) return undefined;
  return Number(out.toPrecision(12));
}
type LabCopy = { e: Entry; v: Obj; shared: Obj; index: number; rank: number; t: Time };
function equation(c: LabCopy): LabResultRow["egfr_equation"] {
  const test = obj(c.v.test), name = str(test?.name);
  if (/MDRD/i.test(name)) return "mdrd";
  if (/2009/.test(name)) return "ckd-epi-2009";
  if (/2021/.test(name) || c.t.local.slice(0, 4) >= "2023") return "ckd-epi-2021";
  return "unknown";
}
function labs(docs: Doc[]): LabResultRow[] {
  const groups = new Map<string, LabCopy[]>();
  for (const d of docs) for (const e of d.entries) {
    if (e.v.type !== "result" && e.v.type !== "panel") continue;
    const accession = str(e.v.accession), t = time(e.v.collected);
    const ranks: Record<string, number> = { preliminary: 0, final: 1, corrected: 2 };
    const rank = Object.hasOwn(ranks, str(e.v.status)) ? ranks[str(e.v.status)] : undefined;
    if (!accession || !t || rank === undefined) continue;
    const values = e.v.type === "result" ? [e.v] : Array.isArray(e.v.components) ? e.v.components : [];
    values.forEach((raw, index) => {
      const v = obj(raw), test = obj(v?.test), code = str(test?.local_code);
      if (!v || !code) return;
      const key = JSON.stringify([d.issuer, accession, code]);
      const copies = groups.get(key) || [];
      copies.push({ e, v, shared: e.v, index, rank, t }); groups.set(key, copies);
    });
  }
  const chosen = [...groups.values()].map(copies => {
    copies.sort((a, b) => a.rank - b.rank || entryOrder(a.e, b.e) || a.index - b.index);
    return { c: copies[copies.length - 1], copies };
  });
  const rows: LabResultRow[] = [];
  for (const { c, copies } of chosen) {
    const a = analyte(c.v, str(c.shared.specimen));
    if (!a) continue;
    if (a === "egfr") {
      const name = str(obj(c.v.test)?.name);
      const race = /african|\bblack\b|race coefficient|race adjusted/i.test(name) && !/non[- ]?(?:african|black)|without|race[- ]?free/i.test(name);
      if (race && chosen.some(({ c: other }) => other !== c && str(other.shared.accession) === str(c.shared.accession) &&
        equation(other) === equation(c) && analyte(other.v, str(other.shared.specimen)) === "egfr" &&
        /non[- ]?(?:african|black)|without|race[- ]?free/i.test(str(obj(other.v.test)?.name)))) continue;
    }
    // Select status first. A corrected nonnumeric value must not resurrect a
    // superseded numeric preliminary/final copy.
    const n = numeric(c.v.value);
    if (!n) continue;
    const value = convert(a, n.value, c.v.unit);
    if (value === undefined) continue;
    rows.push({ analyte: a, value, comparator: n.comparator, unit: units[a], collected: c.t.rfc,
      status: c.rank === 0 ? "preliminary" : "final", egfr_equation: a === "egfr" ? equation(c) : undefined,
      loinc: str(obj(c.v.test)?.loinc) || undefined, evidence: evidence(...copies.map(x => ev(x.e))) });
  }
  return rows.sort((a, b) => (time(a.collected)!.ms - time(b.collected)!.ms) || cmp(a.analyte, b.analyte) ||
    cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)) || a.value - b.value);
}

type VitalSet = { row: VitalRow; t: Time; encounter: string; docs: Set<string> };
function vitals(docs: Doc[]): VitalRow[] {
  const sets = new Map<string, VitalSet>();
  for (const d of docs) for (const e of d.entries) {
    if (e.v.type !== "vitals") continue;
    const t = time(e.v.taken), bp = obj(e.v.bp);
    if (!t) continue;
    const row: VitalRow = { setting: "hospital", local_time: t.local.slice(0, 16),
      systolic_mmhg: num(bp?.systolic_mmhg), diastolic_mmhg: num(bp?.diastolic_mmhg),
      pulse_bpm: num(e.v.heart_rate_bpm), evidence: ev(e) };
    const weight = num(e.v.weight_kg);
    if (weight !== undefined && Number.isFinite(weight * 10)) row.weight_kg = Math.round(weight * 10) / 10;
    if ([row.systolic_mmhg, row.diastolic_mmhg, row.pulse_bpm, row.weight_kg].every(x => x === undefined)) continue;
    const key = JSON.stringify([d.issuer, d.encounter, t.ms]);
    const prev = sets.get(key);
    if (prev) {
      // Same encounter and measurement time is a copied set. Most recently
      // signed copy supplies overlapping values; partial copies fill in gaps.
      for (const k of ["systolic_mmhg", "diastolic_mmhg", "pulse_bpm", "weight_kg"] as const) if (row[k] !== undefined) prev.row[k] = row[k];
      prev.row.evidence = evidence(prev.row.evidence, row.evidence); prev.docs.add(d.id);
    } else sets.set(key, { row, t, encounter: JSON.stringify([d.issuer, d.encounter]), docs: new Set([d.id]) });
  }
  const sorted = [...sets.values()].sort((a, b) => a.t.ms - b.t.ms || cmp(a.encounter, b.encounter));
  const merged: VitalSet[] = [];
  for (const set of sorted) {
    const r = set.row;
    const prev = merged.filter(p => p.encounter === set.encounter).at(-1);
    const bpOnly = r.pulse_bpm === undefined && r.weight_kg === undefined;
    const sameDocument = prev && [...set.docs].some(id => prev.docs.has(id));
    const close = prev && set.t.ms - prev.t.ms <= 5 * 60000;
    const repeat = prev && bpOnly && sameDocument && prev.t.local.slice(0, 10) === set.t.local.slice(0, 10);
    if (prev && (close || repeat)) {
      const p = prev.row;
      const hasBp = r.systolic_mmhg !== undefined || r.diastolic_mmhg !== undefined;
      const prevBp = p.systolic_mmhg !== undefined || p.diastolic_mmhg !== undefined;
      if (hasBp && prevBp && (p.repeat_systolic_mmhg !== undefined || p.repeat_diastolic_mmhg !== undefined)) { merged.push(set); continue; }
      if (hasBp && prevBp) { p.repeat_systolic_mmhg = r.systolic_mmhg; p.repeat_diastolic_mmhg = r.diastolic_mmhg; }
      else if (hasBp) { p.systolic_mmhg = r.systolic_mmhg; p.diastolic_mmhg = r.diastolic_mmhg; p.local_time = r.local_time; }
      if (p.pulse_bpm === undefined) p.pulse_bpm = r.pulse_bpm;
      if (p.weight_kg === undefined) p.weight_kg = r.weight_kg;
      p.evidence = evidence(p.evidence, r.evidence);
      for (const id of set.docs) prev.docs.add(id);
    } else merged.push(set);
  }
  return merged.map(s => s.row).sort((a, b) => cmp(a.local_time, b.local_time) || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const docs = documents(items, asOf);
  const groups = conditionGroups(docs);
  return { medications: medications(docs), problems: problems(groups), allergies: allergies(docs, groups), labs: labs(docs), vitals: vitals(docs) };
}
