import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// The source is deliberately read as unknown: malformed entries must not prevent
// valid entries in the same document from being displayed.
type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj | undefined => v !== null && typeof v === "object" && !Array.isArray(v) ? v as Obj : undefined;
const str = (v: unknown): string => typeof v === "string" ? v.trim() : "";
const num = (v: unknown): number | undefined => typeof v === "number" && Number.isFinite(v) ? v : undefined;
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const norm = (v: string): string => v.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const key = (...s: string[]): string => JSON.stringify(s);

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function wall(ms: number): string {
  const p: Record<string, string> = {};
  for (const part of chicago.formatToParts(new Date(ms))) p[part.type] = part.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}
function validDay(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const ms = Date.parse(s + "T00:00:00Z");
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === s;
}
type Time = { ms: number; day: string; local: string; rfc: string };
function time(v: unknown): Time | undefined {
  const s = str(v);
  const m = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(\.\d{1,9})?)?(Z|[+-]\d{2}:\d{2})?)?$/i.exec(s);
  if (!m || !validDay(m[1]) || +(m[2] || 0) > 23 || +(m[3] || 0) > 59 || +(m[4] || 0) > 59) return undefined;
  const w = `${m[1]}T${m[2] || "00"}:${m[3] || "00"}:${m[4] || "00"}`;
  if (m[6]) {
    const rfc = w + (m[5] || "") + m[6].toUpperCase();
    const ms = Date.parse(rfc);
    if (!Number.isFinite(ms)) return undefined;
    const local = wall(ms);
    return { ms, day: local.slice(0, 10), local: local.slice(0, 16), rfc };
  }
  // Never parse a zone-less timestamp in the process's time zone. At the fall
  // overlap choose the earlier occurrence; keep even nonexistent spring wall times.
  const utc = Date.parse(w + (m[5] || "") + "Z");
  let offset = [5, 6].find(h => wall(utc + h * 3600000) === w);
  if (offset === undefined) {
    const localAtNoon = wall(Date.parse(m[1] + "T18:00:00Z"));
    offset = localAtNoon.slice(11, 13) === "13" ? 5 : 6;
  }
  return { ms: utc + offset * 3600000, day: m[1], local: w.slice(0, 16), rfc: w + (m[5] || "") + `-0${offset}:00` };
}
function partial(v: unknown): ProblemRow["onset"] {
  let s = str(v).replace(/^since\s+/i, "");
  if (/^\d{4}$/.test(s)) return { value: s, precision: "year" };
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(s)) return { value: s, precision: "month" };
  if (validDay(s)) return { value: s, precision: "day" };
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const m = /^([a-z]+)\s+(?:(\d{1,2}),?\s+)?(\d{4})$/i.exec(s);
  if (m) {
    const i = months.findIndex(n => n === m[1].toLowerCase() || n.slice(0, 3) === m[1].toLowerCase());
    if (i >= 0) {
      s = `${m[3]}-${String(i + 1).padStart(2, "0")}`;
      if (!m[2]) return { value: s, precision: "month" };
      s += "-" + m[2].padStart(2, "0");
      if (validDay(s)) return { value: s, precision: "day" };
    }
  }
  return undefined; // "childhood" and "~10 years" are not dates.
}

type Doc = { id: string; issuer: string; raw: Obj; entries: Ref[]; enc: Obj; recorded: Time; event?: Time; encounter: string };
type Ref = { doc: Doc; id: string; e: Obj };
const ev = (r: Ref): Evidence => [{ item_id: r.doc.id, entry_id: r.id }];
function evidence(...parts: Evidence[]): Evidence {
  const m = new Map<string, Evidence[number]>();
  for (const part of parts) for (const e of part) m.set(key(e.item_id, e.entry_id || ""), e);
  return [...m.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id || "", b.entry_id || ""));
}
const docOrder = (a: Doc, b: Doc): number => a.recorded.ms - b.recorded.ms || cmp(a.id, b.id);
const refOrder = (a: Ref, b: Ref): number => docOrder(a.doc, b.doc) || cmp(a.id, b.id);
const refs = (d: Doc, type: string): Ref[] => d.entries.filter(r => r.e.type === type);

function documents(input: unknown, asOf: string): Doc[] {
  if (!Array.isArray(input) || !validDay(asOf)) return [];
  const all = new Map<string, Doc>();
  for (const value of input) {
    const raw = obj(value);
    if (!raw || !str(raw.id) || !str(raw.issuer)) continue;
    const recorded = time(raw.recorded);
    if (!recorded || recorded.day > asOf) continue;
    const entries = Object.entries(obj(raw.payload) || {}).sort(([a], [b]) => cmp(a, b));
    const enc = entries.map(([, v]) => obj(v)).find(v => v?.type === "encounter") || {};
    const d: Doc = {
      id: str(raw.id), issuer: str(raw.issuer), raw, recorded, enc, entries: [],
      encounter: str(enc.encounter_id) || str(raw.id),
      event: time(enc.document_kind === "discharge_summary" ? enc.discharged || raw.effective_end : raw.effective),
    };
    d.entries = entries.flatMap(([id, value]) => { const e = obj(value); return e ? [{ doc: d, id, e }] : []; });
    all.set(key(d.issuer, d.id), d);
  }
  const ids = (d: Doc, field: string): string[] => Array.isArray(d.raw[field])
    ? (d.raw[field] as unknown[]).filter((x): x is string => typeof x === "string").map(x => key(d.issuer, x)) : [];
  // Expand supersession chains, but not retraction chains. Actions on an item
  // entered in error do not survive just because that erroneous item was supplied.
  const edges = new Map<string, Set<string>>();
  const incoming = new Map<string, number>();
  for (const id of all.keys()) incoming.set(id, 0);
  for (const [id, d] of all) {
    const targets = new Set<string>();
    const visited = new Set<string>();
    const pending = ids(d, "supersedes");
    while (pending.length) {
      const target = pending.pop()!;
      if (visited.has(target)) continue;
      visited.add(target);
      if (all.has(target)) {
        targets.add(target);
        pending.push(...ids(all.get(target)!, "supersedes"));
      }
    }
    for (const target of ids(d, "retracts")) if (all.has(target)) targets.add(target);
    edges.set(id, targets);
    for (const target of targets) incoming.set(target, incoming.get(target)! + 1);
  }
  const queue = [...all.keys()].filter(id => incoming.get(id) === 0).sort(cmp);
  const suppressed = new Set<string>();
  const live: Doc[] = [];
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    const active = !suppressed.has(id);
    if (active) live.push(all.get(id)!);
    for (const target of edges.get(id) || []) {
      if (active) suppressed.add(target);
      incoming.set(target, incoming.get(target)! - 1);
      if (incoming.get(target) === 0) queue.push(target);
    }
  }
  // Cyclic replacement graphs cannot be interpreted as earlier-item references.
  return live.sort(docOrder);
}

const brands: Record<string, string> = {
  hctz: "hydrochlorothiazide", asa: "aspirin", apap: "acetaminophen",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", fortamet: "metformin", glumetza: "metformin", cozaar: "losartan", microzide: "hydrochlorothiazide",
  prinivil: "lisinopril", zestril: "lisinopril", norvasc: "amlodipine", lipitor: "atorvastatin", crestor: "rosuvastatin",
  zocor: "simvastatin", lasix: "furosemide", aldactone: "spironolactone", toprol: "metoprolol", lopressor: "metoprolol",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", keflex: "cephalexin", amoxil: "amoxicillin",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", naprosyn: "naproxen",
  pepcid: "famotidine", zyrtec: "cetirizine", claritin: "loratadine", benadryl: "diphenhydramine", prilosec: "omeprazole",
  protonix: "pantoprazole", synthroid: "levothyroxine", levoxyl: "levothyroxine", plavix: "clopidogrel", eliquis: "apixaban",
  xarelto: "rivaroxaban", coumadin: "warfarin", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  humalog: "insulin lispro", novolog: "insulin aspart", tresiba: "insulin degludec", levemir: "insulin detemir",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", seroquel: "quetiapine", wellbutrin: "bupropion",
  cymbalta: "duloxetine", effexor: "venlafaxine", abilify: "aripiprazole", depakote: "divalproex",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide",
  januvia: "sitagliptin", tradjenta: "linagliptin", flomax: "tamsulosin", neurontin: "gabapentin",
};
function ingredient(name: string): string | undefined {
  let s = name.toLowerCase().trim();
  if (!s || /^(unknown|unspecified|medication|drug|none|n\/a)$/.test(s)) return undefined;
  // Prefer a generic name explicitly supplied in parentheses to a brand.
  const generic = /\(([^()]*)\)/.exec(s);
  if (generic && Object.values(brands).includes(generic[1].trim())) return generic[1].trim();
  for (const [brand, genericName] of Object.entries(brands)) {
    if (s === brand || s.startsWith(brand + " ") || s.startsWith(brand + "(")) return genericName;
  }
  s = s.replace(/\([^)]*\)/g, " ").replace(/\b\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)*\s*(?:mg|mcg|µg|μg|g|units?|iu|u|ml|%)(?:\b|$).*$/i, "")
    .replace(/\b(?:hydrochloride|hcl|hydrobromide|hbr|trihydrate|dihydrate|monohydrate|succinate|tartrate|maleate|besylate|mesylate|fumarate)\b/g, " ")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|sustained[ -]release|enteric[ -]coated|film[ -]coated)\b/g, " ")
    .replace(/\b(?:tablets?|tabs?|capsules?|caps?|oral|injection|injectable|solution|suspension|inhaler|hfa|cream|ointment|patch|pen|vial|subcutaneous|subq|iv|po|er|xr|xl|sr|dr)\b.*$/g, "")
    .replace(/\s+/g, " ").replace(/[\s,;/-]+$/g, "").trim();
  if (/^(?:losartan|diclofenac) potassium$/.test(s) || /^(?:levothyroxine|naproxen|valproate) sodium$/.test(s)) s = s.replace(/ (potassium|sodium)$/, "");
  return s || undefined;
}
function drugKey(e: Obj): string {
  return str(e.rxnorm_ingredient) ? "rx:" + str(e.rxnorm_ingredient) : "name:" + (ingredient(str(e.drug_name)) || norm(str(e.drug_name)));
}
function sameDrug(a: Obj, b: Obj): boolean {
  if (str(a.rxnorm_ingredient) && str(b.rxnorm_ingredient)) return str(a.rxnorm_ingredient) === str(b.rxnorm_ingredient);
  const name = ingredient(str(a.drug_name));
  return !!name && name === ingredient(str(b.drug_name));
}
function sensitivities(text: string, code = ""): Sensitivity[] | undefined {
  const s = text.toLowerCase();
  const c = code.toUpperCase();
  const out: Sensitivity[] = [];
  if (/\b(depress(?:ion|ive)|bipolar|schizophren\w*|psychosis|psychotic|anxiety|ptsd|adhd|suicid\w*|quetiapine|sertraline|fluoxetine|escitalopram|aripiprazole|olanzapine|risperidone|lithium)\b/.test(s) || /^F(?:[2-9]\d|0[0-9])/.test(c)) out.push("mental-health");
  if (/\b(alcohol use disorder|alcoholism|alcohol dependence|opioid use disorder|opioid dependence|substance use|substance abuse|cocaine|tobacco dependence|nicotine dependence|buprenorphine)\b/.test(s) || /^F1\d/.test(c)) out.push("substance-use");
  if (/\b(pregnan\w*|contracepti\w*|fertility|infertility|sexual dysfunction|erectile dysfunction|abortion|miscarriage|ethinyl estradiol|levonorgestrel|norethindrone)\b/.test(s) || /^(O\d|Z3[234]|Z30)/.test(c)) out.push("sexual-reproductive-health");
  if (/\b(hiv|aids|chlamydia|gonorrh\w*|syphilis|genital herpes|antiretroviral|emtricitabine|tenofovir|bictegravir|dolutegravir)\b/.test(s) || /^(B2[0-4]|Z21|A5[0-9]|A6[0-4])/.test(c)) out.push("hiv-sti");
  if (/\b(genetic|hereditary|inherited|brca[12]?|cystic fibrosis|sickle cell|huntington\w*|lynch syndrome)\b/.test(s)) out.push("genetic");
  return out.length ? out : undefined;
}

function dose(e: Obj): MedicationRow["dose"] {
  function amounts(s: string): string {
    const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: .5, quarter: .25 };
    return s.replace(/\b(one|two|three|four|half|quarter)(?:\s+of)?(?:\s+a)?(?=\s+(?:tabs?|tablets?|capsules?|puffs?|mg|units?|ml)\b)/gi, (_, w: string) => String(words[w.toLowerCase()]))
      .replace(/\b(\d+)\/(\d+)(?=\s*(?:tabs?|tablets?|capsules?|puffs?)\b)/gi, (_, a: string, b: string) => +b > 0 ? String(+a / +b) : "unreadable")
      .replace(/\b(\d{1,3}),(\d{3})(?=\b)/g, "$1$2");
  }
  const text = amounts(str(e.dose_text));
  const sig = amounts(str(e.sig));
  const combined = text + " " + sig;
  if (/\d\s*(?:[-–—]|to|\/)\s*\d|sliding\s*scale|taper|titrate|depending|based on|as directed|\bif\b|\bper\s+(?:protocol|scale)\b|\/kg|unreadable/i.test(combined)) return undefined;
  const re = /([\d]+(?:\.\d+)?|\.\d+|½|¼)\s*(milligrams?|mg|micrograms?|mcg|[µμ]g|grams?|g|units?|unit\(s\)|iu|u|millilit(?:er|re)s?|ml|cc|tablets?|tabs?|tab\(s\)|puffs?|capsules?)\b/gi;
  const matches = [...text.matchAll(re)];
  let m = matches[0];
  if (matches.length > 1 && matches.slice(1).some(x => !/^(tab|puff|capsule)/i.test(x[2]))) return undefined;
  if (!m) {
    m = [...sig.matchAll(re)][0];
    if (!m && sig && /daily|night|evening|bedtime|weekly|\b(?:qd|bid|tid|qhs|qw)\b/i.test(sig)) {
      m = [...str(e.drug_name).matchAll(re)][0];
    }
  }
  if (!m) return undefined;
  let value = m[1] === "½" ? .5 : m[1] === "¼" ? .25 : +m[1];
  const u = m[2].toLowerCase();
  let unit: NonNullable<MedicationRow["dose"]>["unit"];
  if (/^(tab|puff|capsule)/.test(u)) {
    const strength = [...str(e.drug_name).matchAll(re)].find(x => /^(mg|milligram|mcg|microgram|[µμ]g|g|gram)/i.test(x[2]));
    if (strength) {
      value *= +strength[1];
      unit = /^(mcg|microgram|[µμ]g)/i.test(strength[2]) ? "mcg" : "mg";
      if (/^(g|grams?)$/i.test(strength[2])) value *= 1000;
    } else if (/^tab/.test(u)) unit = "tablet";
    else return undefined;
  } else if (/^(mcg|microgram|[µμ]g)/.test(u)) unit = "mcg";
  else if (/^(u|iu)/.test(u)) unit = "units";
  else if (/^(ml|millilit|cc)/.test(u)) unit = "mL";
  else { unit = "mg"; if (/^(g|grams?)$/.test(u)) value *= 1000; }
  return Number.isFinite(value) && value > 0 ? { value, unit } : undefined;
}
function frequency(v: string): MedicationRow["frequency"] {
  const s = v.toLowerCase().replace(/\./g, "");
  if (/\bprn\b|as needed/.test(s)) return "PRN";
  if (/every other|alternate days|taper|\b(?:qid|qod)\b|four times|monthly|every month|\bq[46]h\b|every (?:4|6) hours/.test(s)) return "other";
  if (/\bbid\b|twice (?:a |per )?da(?:y|ily)|(?:two|2) times (?:a |per )?da(?:y|ily)|\bq12h\b|every (?:12|twelve) hours/.test(s)) return "BID";
  if (/\btid\b|(?:three|3) times (?:a |per )?da(?:y|ily)|\bq8h\b|every (?:8|eight) hours/.test(s)) return "TID";
  if (/\bqhs\b|bedtime|nightly|at night/.test(s)) return "QHS";
  if (/\bqw\b|weekly|every (?:7|seven) days|once a week/.test(s)) return "QW";
  if (/\b(?:qd|qday|q24h|daily)\b|once (?:a |per )?day|every (?:24|twenty-four) hours|in the (?:morning|evening)|\b(?:qam|qpm)\b/.test(s)) return "QD";
  if (/\bevery\b|\btimes\b|\bonce\b|with (?:each )?meals|\bq\d+h\b|\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.test(s)) return "other";
  return undefined;
}
function stopReason(s: string): MedicationRow["stop_reason"] {
  if (!s) return undefined;
  if (/adverse|side effect|reaction|rash|cough|angioedema|anaphyla|ketoacidosis|\bdka\b|pancreatitis|hypoglyc|hyperkal|liver injury/i.test(s)) return "adverse_reaction";
  if (/ineffective|not (?:effective|working)|did not work|no benefit/i.test(s)) return "ineffective";
  if (/replac|switch|changed to|change in (?:therapy|regimen)/i.test(s)) return "therapy_changed";
  if (/course (?:is )?(?:complete|finished)|completed (?:the )?(?:course|therapy|treatment)|finished (?:the )?course/i.test(s)) return "course_complete";
  if (/patient (?:choice|preference|request|declin|refus)|chose to stop|does not want/i.test(s)) return "patient_choice";
  if (/because|due to|\bfor\b|no longer (?:needed|indicated)|contraindicat/i.test(s)) return "other";
  return undefined;
}
const medStatus = (s: unknown): MedicationRow["status"] | undefined => {
  if (["continue", "new", "changed"].includes(str(s))) return "active";
  if (s === "held" || s === "stopped") return s;
  return s === "not_reconciled" ? "unknown" : undefined;
};
function medications(docs: Doc[]): MedicationRow[] {
  const byStay = new Map<string, Doc[]>();
  for (const d of docs) {
    if (!str(d.enc.document_kind)) continue;
    const k = key(d.issuer, d.encounter);
    byStay.set(k, [...(byStay.get(k) || []), d]);
  }
  const snapshots = [...byStay.values()].map(stay => {
    const discharges = stay.filter(d => d.enc.document_kind === "discharge_summary");
    return (discharges.length ? discharges : stay).at(-1)!;
  }).sort(docOrder);
  const latest = snapshots.at(-1);
  if (!latest) return [];
  const rows = new Map<string, MedicationRow>();
  const lines = new Map<string, Obj>();
  for (const r of refs(latest, "home_med")) {
    const e = r.e;
    const name = str(e.drug_name), status = medStatus(e.status);
    if (!name || !status) continue;
    const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: ev(r) };
    row.ingredient = ingredient(name);
    row.rxnorm_ingredient = str(e.rxnorm_ingredient) || undefined;
    row.dose = dose(e);
    row.frequency = frequency(str(e.sig));
    row.status_reason_text = str(e.instructions) || undefined;
    if (status === "stopped") row.stop_reason = stopReason(str(e.instructions));
    row.sensitivity = sensitivities(name + " " + (row.ingredient || "") + " " + str(e.instructions));
    // Dates belong to decisions, not to every reprinting of a medication list.
    const history = (byStay.get(key(latest.issuer, latest.encounter)) || []).filter(d => docOrder(d, latest) <= 0)
      .flatMap(d => refs(d, "home_med")).filter(p => sameDrug(p.e, e) && str(p.e.dose_text) === str(e.dose_text));
    let first = history.length - 1;
    while (first > 0 && medStatus(history[first - 1].e.status) === status) first--;
    const start = history[first];
    if (start && status !== "unknown" && (status === "held" || status === "stopped" || ["new", "changed"].includes(str(start.e.status)) ||
      (first > 0 && ["held", "stopped"].includes(str(medStatus(history[first - 1].e.status)))))) {
      if (start.doc.event) {
        row.status_since = start.doc.event.day;
        row.evidence = evidence(row.evidence, ev(start));
      }
    }
    for (const [k, old] of lines) if (sameDrug(old, e)) { rows.delete(k); lines.delete(k); }
    rows.set(drugKey(e), row);
    lines.set(drugKey(e), e);
  }
  return [...rows.values()].sort((a, b) => cmp(a.ingredient || a.drug_name, b.ingredient || b.drug_name));
}

const labUnits: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const labCodes: Record<string, Analyte> = {
  CREAT: "creatinine", CREA: "creatinine", CREATININE: "creatinine", CR: "creatinine", EGFR: "egfr", GFR: "egfr",
  K: "potassium", POTASSIUM: "potassium", NA: "sodium", SODIUM: "sodium", CL: "chloride", CHLORIDE: "chloride",
  CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate", BICARB: "bicarbonate", AGAP: "anion_gap", ANIONGAP: "anion_gap",
  BUN: "bun", GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c",
  UACR: "uacr", MACR: "uacr", PLT: "platelets", PLATELETS: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", BOHB: "bhb", VPH: "ph", APH: "ph", PH: "ph", VPCO2: "pco2", APCO2: "pco2", PCO2: "pco2",
  LIPASE: "lipase", LIP: "lipase", TROPONINI: "troponin", TNI: "troponin",
  CHOL: "cholesterol", CHOLESTEROL: "cholesterol", TC: "cholesterol", TRIG: "triglycerides", TG: "triglycerides",
  HDL: "hdl", HDLC: "hdl", LDL: "ldl", LDLC: "ldl", LDLCALC: "ldl", LDLDIRECT: "ldl",
};
function analyte(test: Obj, specimen: string): Analyte | undefined {
  const n = str(test.name).toLowerCase();
  const c = str(test.local_code).toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (/troponin\s*t\b|^tnt$/.test(n) || /^(TNT|TROPT|TROPONINT|HSTNT)$/.test(c)) return undefined;
  if (/non[- ]hdl|cholesterol.*ratio|hdl.*ratio|ldl.*ratio/.test(n)) return undefined;
  if (/albumin.{0,20}creatinine|microalbumin.{0,20}creatinine|\buacr\b/.test(n)) return "uacr";
  if (/estimated.*(?:glomerular|gfr)|\begfr\b|glomerular filtration rate/.test(n) || /^EGFR/.test(c)) return "egfr";
  if (/creatinine/.test(n) && !/clearance|ratio|urine/.test(n) && !/urine/i.test(specimen)) return "creatinine";
  if (/\b(?:hemoglobin|haemoglobin|hgb)\s*a1c\b|glycat(?:ed|ion)|glycosylated hemoglobin/.test(n)) return "a1c";
  if (/beta[- ]?hydroxybutyrate|β[- ]?hydroxybutyrate|3[- ]hydroxybutyrate/.test(n)) return "bhb";
  if (/\b(?:pco2|p co2)\b|carbon dioxide partial pressure/.test(n)) return "pco2";
  if (/^ph\b/.test(n) && !/urine/i.test(specimen + " " + n)) return "ph";
  if (/bicarbonate|total (?:co2|carbon dioxide)|carbon dioxide,? total/.test(n)) return "bicarbonate";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/urea nitrogen/.test(n)) return "bun";
  if (/\bhdl\b|high.density lipoprotein/.test(n)) return "hdl";
  if (/\bldl\b|low.density lipoprotein/.test(n)) return "ldl";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n) && !/ratio|non.hdl/.test(n)) return "cholesterol";
  if (/troponin\s*i\b/.test(n)) return "troponin";
  if (/\bplatelet/.test(n) && !/volume|width|fraction/.test(n)) return "platelets";
  if (/white blood (?:cell|count)|leukocyte count|^leukocytes$/.test(n) && !/urine/i.test(specimen)) return "wbc";
  if (/^(?:hemoglobin|haemoglobin)(?:$|,|\s+(?:blood|concentration))/.test(n)) return "hemoglobin";
  for (const a of ["potassium", "sodium", "chloride", "glucose", "lipase"] as const) {
    if (new RegExp("^" + a + "(?:$|[ ,(])").test(n) && !/urine|ratio|tolerance|challenge/.test(n + " " + specimen.toLowerCase())) return a;
  }
  const found = labCodes[c] || labCodes[n.toUpperCase().replace(/[^A-Z0-9]/g, "")];
  if (found && /urine/i.test(n + " " + specimen) && ["creatinine", "sodium", "potassium", "chloride", "glucose", "ph", "wbc"].includes(found)) return undefined;
  return found;
}
function numeric(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const s = str(v).replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/−/g, "-");
  const m = /^(<=|>=|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)$/i.exec(s);
  if (!m || !Number.isFinite(+m[2])) return undefined;
  return { value: +m[2], comparator: m[1] as LabResultRow["comparator"] };
}
function unitKey(s: string): string {
  return s.toLowerCase().replace(/[µμ]/g, "u").replace(/×/g, "*").replace(/²/g, "2").replace(/\^/g, "*")
    .replace(/\s|[{}]/g, "").replace(/lit(?:er|re)s?/g, "l");
}
function convert(a: Analyte, v: number, sourceUnit: unknown): number | undefined {
  const u = unitKey(str(sourceUnit));
  const target = unitKey(labUnits[a]);
  let factor: number | undefined, add = 0;
  if (u === target) factor = 1;
  else if (a === "ph" && ["", "1", "ph"].includes(u)) factor = 1;
  else if (a === "egfr" && ["ml/min/1.73m*2", "ml/min/1.73m2", "ml/min/1.73sqm"].includes(u)) factor = 1;
  else if (a === "egfr" && ["l/s/1.73m2", "l/s/1.73m*2"].includes(u)) factor = 60000;
  else if (["sodium", "potassium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") factor = 1;
  else if (labUnits[a] === "mmol/L" && u === "umol/l") factor = .001;
  else if (labUnits[a] === "mg/dL" && u === "mg/l") factor = .1;
  else if (a === "creatinine" && u === "umol/l") factor = 1 / 88.4;
  else if (a === "creatinine" && u === "mmol/l") factor = 1000 / 88.4;
  else if (a === "glucose" && u === "mmol/l") factor = 18.016;
  else if (a === "bun" && u === "mmol/l") factor = 2.801;
  else if (a === "a1c" && u === "mmol/mol") { factor = .09148; add = 2.152; }
  else if (a === "a1c" && ["percent", "%ngsp", "ngsp%"].includes(u)) factor = 1;
  else if (a === "uacr" && ["mg/mmol", "g/mol"].includes(u)) factor = 8.84;
  else if (a === "uacr" && u === "ug/mg") factor = 1;
  else if (a === "uacr" && u === "g/g") factor = 1000;
  else if (["platelets", "wbc"].includes(a) && ["10*9/l", "109/l", "k/ul", "10*3/ul", "103/ul", "thousand/ul", "thousands/ul"].includes(u)) factor = 1;
  else if (["platelets", "wbc"].includes(a) && ["/ul", "1/ul", "cells/ul", "cells/mm3", "/mm3"].includes(u)) factor = .001;
  else if (["platelets", "wbc"].includes(a) && ["/l", "1/l", "cells/l"].includes(u)) factor = 1e-9;
  else if (a === "hemoglobin" && u === "g/l") factor = .1;
  else if (a === "bhb" && u === "mg/dl") factor = 1 / 10.412;
  else if (a === "pco2" && u === "kpa") factor = 7.50062;
  else if (a === "lipase" && u === "iu/l") factor = 1;
  else if (a === "troponin" && ["ng/l", "pg/ml"].includes(u)) factor = .001;
  else if (a === "troponin" && u === "ug/l") factor = 1;
  else if (["cholesterol", "hdl", "ldl"].includes(a) && u === "mmol/l") factor = 38.67;
  else if (a === "triglycerides" && u === "mmol/l") factor = 88.57;
  if (factor === undefined) return undefined;
  const result = v * factor + add;
  return Number.isFinite(result) ? Number(result.toPrecision(12)) : undefined;
}
type LabCopy = { r: Ref; v: Obj; shared: Obj; test: Obj; rank: number; ordinal: number };
function equation(copy: LabCopy): NonNullable<LabResultRow["egfr_equation"]> {
  const s = str(copy.test.name) + " " + str(copy.test.local_code);
  if (/mdrd/i.test(s)) return "mdrd";
  if (/2009/i.test(s)) return "ckd-epi-2009";
  if (/2021/i.test(s)) return "ckd-epi-2021";
  // This is documented source metadata, not an equation inferred from the value.
  if ((time(copy.shared.collected)?.day || "") >= "2023-01-01") return "ckd-epi-2021";
  return "unknown";
}
function raceAdjusted(copy: LabCopy): boolean {
  const s = str(copy.test.name) + " " + str(copy.test.local_code);
  if (/non[-_ ]?(?:african|black|aa)|without.{0,15}(?:race|coefficient)|race[- ]?(?:free|neutral)|not black|\bNAA\b/i.test(s)) return false;
  return /african|\bblack\b|\bAA\b|[_-]AA\b|race.adjusted|with race/i.test(s);
}
function labs(docs: Doc[]): LabResultRow[] {
  const copies = new Map<string, LabCopy[]>();
  for (const d of docs) for (const r of d.entries) {
    if (r.e.type !== "panel" && r.e.type !== "result") continue;
    const rank = r.e.status === "corrected" ? 3 : r.e.status === "final" ? 2 : r.e.status === "preliminary" ? 1 : 0;
    if (!rank || !str(r.e.accession)) continue;
    const values = r.e.type === "result" ? [r.e] : Array.isArray(r.e.components) ? r.e.components : [];
    for (let i = 0; i < values.length; i++) {
      const v = obj(values[i]), test = obj(v?.test);
      if (!v || !test || !str(test.local_code)) continue;
      const id = key(d.issuer, str(r.e.accession), str(test.local_code));
      copies.set(id, [...(copies.get(id) || []), { r, v, shared: r.e, test, rank, ordinal: i }]);
    }
  }
  const chosen = [...copies.values()].map(group => {
    group.sort((a, b) => a.rank - b.rank || refOrder(a.r, b.r) || a.ordinal - b.ordinal);
    return { copy: group.at(-1)!, group };
  });
  const noRace = new Set<string>();
  for (const { copy } of chosen) if (analyte(copy.test, str(copy.shared.specimen)) === "egfr" && !raceAdjusted(copy)) {
    noRace.add(key(copy.r.doc.issuer, str(copy.shared.accession), equation(copy)));
  }
  const output: { row: LabResultRow; ms: number; code: string }[] = [];
  for (const { copy, group } of chosen) {
    const a = analyte(copy.test, str(copy.shared.specimen));
    const n = numeric(copy.v.value), collected = time(copy.shared.collected);
    // Select the winning copy BEFORE parsing: an unreportable corrected value
    // must not resurrect an older numeric result.
    if (!a || !n || !collected || !/[T ]\d\d:\d\d/.test(str(copy.shared.collected))) continue;
    if (a === "egfr" && raceAdjusted(copy) && noRace.has(key(copy.r.doc.issuer, str(copy.shared.accession), equation(copy)))) continue;
    const value = convert(a, n.value, copy.v.unit);
    if (value === undefined) continue;
    const row: LabResultRow = {
      analyte: a, value, unit: labUnits[a], collected: collected.rfc,
      status: copy.rank === 1 ? "preliminary" : "final",
      evidence: evidence(...group.map(c => ev(c.r))),
    };
    if (n.comparator) row.comparator = n.comparator;
    if (str(copy.test.loinc)) row.loinc = str(copy.test.loinc);
    if (a === "egfr") row.egfr_equation = equation(copy);
    output.push({ row, ms: collected.ms, code: key(str(copy.shared.accession), str(copy.test.local_code)) });
  }
  return output.sort((a, b) => a.ms - b.ms || cmp(a.row.analyte, b.row.analyte) || cmp(a.code, b.code)).map(x => x.row);
}

type Diagnosis = { r: Ref; label: string; text: string; code: string; local: string; family: string; history: boolean };
function conditionFamily(label: string, code: string): string {
  const s = norm(label);
  if (/\bckd\b|chronic (?:kidney|renal) (?:disease|failure)|end stage (?:renal|kidney)/.test(s) || /^N18\./i.test(code)) return "ckd";
  if (/\baki\b|acute (?:kidney|renal) (?:injury|failure)/.test(s) || /^N17\./i.test(code)) return "aki";
  if (/hyperkal[ae]mia/.test(s) || code === "E87.5") return "hyperkalemia";
  if (/hypokal[ae]mia/.test(s) || code === "E87.6") return "hypokalemia";
  if (/\bdka\b|diabetic ketoacidosis/.test(s)) return /euglyc/.test(s) ? "euglycemic dka" : "dka";
  if (/pancreatitis/.test(s)) return /chronic/.test(s) ? "chronic pancreatitis" : "acute pancreatitis";
  if (/\basthma\b/.test(s) || /^J45\./.test(code)) return "asthma";
  if (/\b(?:type 2 diabetes|diabetes mellitus type 2|t2dm|dm2)\b/.test(s) || /^E11\./.test(code)) return "type 2 diabetes";
  if (/\b(?:type 1 diabetes|diabetes mellitus type 1|t1dm|dm1)\b/.test(s) || /^E10\./.test(code)) return "type 1 diabetes";
  if (/^(?:essential |primary |uncontrolled |benign )?(?:hypertension|htn)$/.test(s) || code === "I10") return "hypertension";
  if (/\bcopd\b|chronic obstructive pulmonary/.test(s)) return "copd";
  return s.replace(/^(?:r o |rule out |suspected |possible |probable |history of |hx of )/, "")
    .replace(/\b(?:resolved|active|historical)\b/g, "").replace(/\s+/g, " ").trim();
}
function stage(d: Diagnosis): ProblemRow["ckd_stage"] {
  if (d.family !== "ckd") return undefined;
  const m = /\bG([12345](?:[ab])?)\b/i.exec(d.text) || /\bstage\s*([12345](?:\s*[ab])?)\b/i.exec(d.text);
  if (m) {
    const s = "G" + m[1].replace(/\s/g, "").toLowerCase();
    if (["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(s)) return s as ProblemRow["ckd_stage"];
  }
  const roman = /\bstage\s+(i{1,3}|iv|v)\b/i.exec(d.text)?.[1].toLowerCase();
  if (roman && roman !== "iii") return ({ i: "G1", ii: "G2", iv: "G4", v: "G5" } as const)[roman as "i" | "ii" | "iv" | "v"];
  const codes: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
  return codes[d.code];
}
function albuminuria(d: Diagnosis): ProblemRow["albuminuria"] {
  if (d.family !== "ckd") return undefined;
  const m = /\bA([123])\b/i.exec(d.text);
  if (m) return ("A" + m[1]) as ProblemRow["albuminuria"];
  if (/severely increased albuminuria|macroalbuminuria/i.test(d.text)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria/i.test(d.text)) return "A2";
  if (/normal to mildly increased albuminuria|normoalbuminuria/i.test(d.text)) return "A1";
  return undefined;
}
function pureAdverse(d: Diagnosis): boolean {
  return /^(?:adverse (?:effect|reaction)|drug adverse (?:effect|reaction))\b/i.test(d.label) ||
    (/^T(?:3[6-9]|4\d|50)/.test(d.code) && !/\b(?:rash|urticaria|anaphylaxis|injury|failure|ketoacidosis|pancreatitis|hepatitis|hypoglycemia|angioedema)\b/i.test(d.label));
}
function problemData(docs: Doc[]): { rows: ProblemRow[]; confirmed: Diagnosis[] } {
  const entries: Diagnosis[] = [];
  for (const doc of docs) for (const r of doc.entries) {
    const history = r.e.type === "history";
    if (!history && r.e.type !== "diagnosis") continue;
    const label = str(history ? r.e.condition : r.e.label);
    if (!label || (!history && !["working", "ruled_out", "active", "resolved"].includes(str(r.e.status)))) continue;
    const local = obj(r.e.riverside_dx);
    const code = str(r.e.icd10cm).toUpperCase();
    const text = label + (str(local?.name) ? "; " + str(local?.name) : "");
    entries.push({ r, label, text, code, local: str(local?.code), family: conditionFamily(label, code), history });
  }
  // Local diagnoses are more specific than ICD-10-CM. An unqualified earlier
  // diagnosis can join a local diagnosis only if its same-stay match is unique.
  const groups = new Map<string, Diagnosis[]>();
  for (const d of entries) {
    let id: string;
    if (d.family === "ckd") id = "condition:ckd"; // Restaging is not a new condition.
    else {
      let local = d.local;
      if (!local) {
        const matches = entries.filter(other => other.local && other.r.doc.encounter === d.r.doc.encounter &&
          (other.family === d.family || (d.code && d.code === other.code)));
        const codes = [...new Set(matches.map(other => other.local))];
        if (codes.length === 1) local = codes[0];
      }
      if (local) id = "local:" + local;
      else if (["aki", "hyperkalemia", "hypokalemia", "dka", "euglycemic dka", "asthma", "copd", "hypertension", "type 1 diabetes", "type 2 diabetes", "acute pancreatitis", "chronic pancreatitis"].includes(d.family)) id = "condition:" + d.family;
      else {
        const matchingCodes = [...new Set(entries.filter(other => other.family === d.family && other.code && !other.local).map(other => other.code))];
        id = d.code || matchingCodes.length === 1 ? "icd:" + (d.code || matchingCodes[0]) : "text:" + d.family;
      }
    }
    groups.set(id, [...(groups.get(id) || []), d]);
  }
  const rows: ProblemRow[] = [], confirmed: Diagnosis[] = [];
  for (const group of groups.values()) {
    group.sort((a, b) => refOrder(a.r, b.r));
    const episodes = new Map<string, Diagnosis[]>();
    for (const d of group.filter(d => !d.history)) episodes.set(d.r.doc.encounter, [...(episodes.get(d.r.doc.encounter) || []), d]);
    const assertions: Diagnosis[] = [], validAssessments: Diagnosis[] = [];
    for (const episode of episodes.values()) {
      if (episode.at(-1)!.r.e.status === "ruled_out") continue;
      // A subsequent working recurrence does not erase a previously established
      // condition, but a rule-out in this episode does invalidate earlier workup.
      const lastRefutation = episode.map(d => d.r.e.status).lastIndexOf("ruled_out");
      const established = episode.slice(lastRefutation + 1).filter(d => d.r.e.status === "active" || d.r.e.status === "resolved");
      if (established.length) {
        assertions.push(established.at(-1)!);
        confirmed.push(...established);
        validAssessments.push(...established);
      }
    }
    assertions.sort((a, b) => refOrder(a.r, b.r));
    const histories = group.filter(d => d.history);
    const chosen = assertions.at(-1) || (episodes.size === 0 ? histories.at(-1) : undefined);
    if (episodes.size === 0) confirmed.push(...histories);
    if (!chosen || pureAdverse(chosen)) continue;
    const row: ProblemRow = {
      condition: chosen.label,
      status: chosen.history ? (/\b(?:resolved|history of|historical|remote|previous)\b/i.test(chosen.label) ? "resolved" : "active") : chosen.r.e.status === "resolved" ? "resolved" : "active",
      evidence: ev(chosen.r),
    };
    if (chosen.code) row.icd10cm = chosen.code;
    row.sensitivity = sensitivities(chosen.text, chosen.code);
    for (const h of [...histories].reverse()) {
      const onset = partial(h.r.e.onset_text);
      if (onset) { row.onset = onset; row.evidence = evidence(row.evidence, ev(h.r)); break; }
    }
    if (chosen.family === "ckd") {
      // Copied PMH is not a new clinical staging assessment. Use it only when
      // there is no actual diagnosis assessment of CKD.
      const assessments = assertions.length ? validAssessments.sort((a, b) => refOrder(a.r, b.r)) : histories;
      let gfrDecided = false;
      for (const d of [...assessments].reverse()) {
        if (!gfrDecided && (stage(d) || /\bstage\s*(?:[1-5iv]|unknown|unspecified)|\bG[1-5]\b/i.test(d.text) || /^N18\.3(?:0)?$/.test(d.code))) {
          row.ckd_stage = stage(d); gfrDecided = true; row.evidence = evidence(row.evidence, ev(d.r));
        }
        if (!row.albuminuria && albuminuria(d)) { row.albuminuria = albuminuria(d); row.evidence = evidence(row.evidence, ev(d.r)); }
      }
    }
    rows.push(row);
  }
  return { rows: rows.sort((a, b) => cmp(a.condition, b.condition)), confirmed: confirmed.sort((a, b) => refOrder(a.r, b.r)) };
}

type DrugClass = { pattern: RegExp; members: RegExp; fallback: string };
const drugClasses: DrugClass[] = [
  { pattern: /SGLT[- ]?2(?:\s+inhibitors?)?|sodium[- ]glucose co[- ]?transporter[- ]?2(?:\s+inhibitors?)?/i, members: /\b(?:empagliflozin|dapagliflozin|canagliflozin|ertugliflozin|bexagliflozin|sotagliflozin)\b/, fallback: "SGLT2 inhibitors" },
  { pattern: /ACE inhibitors?|angiotensin[- ]converting enzyme inhibitors?/i, members: /\b(?:lisinopril|enalapril|ramipril|benazepril|captopril|perindopril|quinapril|fosinopril|trandolapril)\b/, fallback: "ACE inhibitors" },
  { pattern: /\bARBs?\b|angiotensin (?:II|2) receptor blockers?/i, members: /\b(?:losartan|valsartan|irbesartan|candesartan|telmisartan|olmesartan|azilsartan|eprosartan)\b/, fallback: "ARBs" },
  { pattern: /\bNSAIDs?\b|non[- ]?steroidal anti[- ]inflammatory (?:drugs?|agents?)/i, members: /\b(?:naproxen|ibuprofen|diclofenac|meloxicam|celecoxib|indomethacin|ketorolac|piroxicam|etodolac)\b/, fallback: "NSAIDs" },
  { pattern: /\bpenicillins?\b/i, members: /\b(?:penicillin|amoxicillin|ampicillin|piperacillin|dicloxacillin|nafcillin|oxacillin)\b/, fallback: "penicillins" },
  { pattern: /\bcephalosporins?\b/i, members: /\b(?:cephalexin|cefazolin|ceftriaxone|cefdinir|cefuroxime|cefepime|cefpodoxime|ceftazidime)\b/, fallback: "cephalosporins" },
  { pattern: /\bsulfonamide antibiotics\b/i, members: /\b(?:sulfamethoxazole|sulfadiazine|sulfisoxazole)\b/, fallback: "Sulfonamide antibiotics" },
  { pattern: /\bstatins?\b|HMG[- ]CoA reductase inhibitors?/i, members: /\b(?:atorvastatin|rosuvastatin|simvastatin|pravastatin|lovastatin|fluvastatin|pitavastatin)\b/, fallback: "statins" },
  { pattern: /GLP[- ]?1(?: receptor)? agonists?/i, members: /\b(?:semaglutide|liraglutide|dulaglutide|exenatide|lixisenatide)\b/, fallback: "GLP-1 receptor agonists" },
  { pattern: /\bsulfonylureas?\b/i, members: /\b(?:glipizide|glyburide|glimepiride|gliclazide|chlorpropamide|tolbutamide)\b/, fallback: "sulfonylureas" },
  { pattern: /\bbeta[- ]blockers?\b/i, members: /\b(?:metoprolol|atenolol|carvedilol|propranolol|bisoprolol|labetalol|nebivolol|nadolol)\b/, fallback: "beta blockers" },
  { pattern: /\bcalcium[- ]channel blockers?\b/i, members: /\b(?:amlodipine|nifedipine|diltiazem|verapamil|felodipine|nicardipine)\b/, fallback: "calcium channel blockers" },
  { pattern: /\bthiazide(?:[- ]like)?(?: diuretics?)?\b/i, members: /\b(?:hydrochlorothiazide|chlorthalidone|indapamide|metolazone|chlorothiazide)\b/, fallback: "thiazide diuretics" },
  { pattern: /oral (?:hypoglycemic|antidiabetic|glucose[- ]lowering) (?:drugs?|agents?)/i, members: /\b(?:metformin|empagliflozin|dapagliflozin|canagliflozin|ertugliflozin|glipizide|glyburide|glimepiride|sitagliptin|linagliptin|saxagliptin|alogliptin|pioglitazone|rosiglitazone|repaglinide|nateglinide|acarbose|miglitol)\b/, fallback: "oral hypoglycemic drugs" },
];
type Substance = { name: string; rx?: string; evidence: Evidence };
const knownIngredients = [...new Set([...Object.values(brands), "isoniazid", "valproate", "erythromycin", "amoxicillin", "penicillin", "prednisone", "trimethoprim", "sulfamethoxazole", "nitrofurantoin", "allopurinol", "carbamazepine", "lamotrigine", "insulin", "morphine", "codeine", "hydrocodone", "oxycodone", "tramadol", "aspirin", "ondansetron", "clindamycin", "doxycycline"] )];
function resolveSubstance(phrase: string, d: Diagnosis): Substance | undefined {
  const meds = d.r.doc.entries.filter(r => r.e.type === "home_med" || r.e.type === "inpatient_med");
  const p = phrase.toLowerCase();
  // A specific drug named in the attribution takes priority over a class.
  const named = meds.filter(r => {
    const name = ingredient(str(r.e.drug_name));
    const phraseWords = " " + norm(p) + " ";
    return !!name && (phraseWords.includes(" " + norm(name) + " ") || phraseWords.includes(" " + norm(str(r.e.drug_name)) + " "));
  });
  if (new Set(named.map(r => drugKey(r.e))).size === 1) {
    const r = named.at(-1)!;
    return { name: ingredient(str(r.e.drug_name))!, rx: str(r.e.rxnorm_ingredient) || undefined, evidence: ev(r) };
  }
  const found = knownIngredients.filter(n => new RegExp("\\b" + n.replace(/ /g, "\\s+") + "\\b", "i").test(phrase));
  for (const [brand, generic] of Object.entries(brands)) if (new RegExp("\\b" + brand + "\\b", "i").test(phrase)) found.push(generic);
  const uniqueNames = [...new Set(found)].filter(n => !found.some(other => other !== n && other.includes(n)));
  if (uniqueNames.length === 1) return { name: uniqueNames[0], evidence: [] };
  if (uniqueNames.length > 1 || new Set(named.map(r => drugKey(r.e))).size > 1) return undefined;
  for (const cls of drugClasses) {
    const match = cls.pattern.exec(phrase);
    if (!match) continue;
    const matched = meds.filter(r => cls.members.test(ingredient(str(r.e.drug_name)) || ""));
    const unique = new Map(matched.map(r => [drugKey(r.e), r]));
    if (unique.size === 1) {
      const r = [...unique.values()][0];
      return { name: ingredient(str(r.e.drug_name))!, rx: str(r.e.rxnorm_ingredient) || undefined, evidence: ev(r) };
    }
    return { name: match[0] || cls.fallback, evidence: [] };
  }
  // Also handle named drugs absent from the medication snapshot (e.g. an OTC
  // culprit). The name comes from the attribution, never from a guessed code.
  // An explicit adverse-effect label may name an otherwise unknown substance.
  // Ordinary causes such as "due to dehydration" must never become allergens.
  const clean = phrase.replace(/^[\s,;:]+|[\s,;:.]+$/g, "").replace(/\s*\([^)]*\)\s*/g, " ").trim();
  if (pureAdverse(d) && /^[a-z][a-z -]{3,70}$/i.test(clean) && !/^(?:drug|medication|unknown|unspecified)/i.test(clean)) return { name: clean, evidence: [] };
  return undefined;
}
function narrativeAttribution(d: Diagnosis): string {
  // Narrative may interpret a structured diagnosis, but cannot create one.
  const text = str(d.r.doc.raw.narrative).replace(/<[^>]*>/g, " ").replace(/\*+/g, "");
  const sentences = text.split(/[\n.!?]+/);
  return sentences.filter(sentence => {
    const n = norm(sentence);
    const mentions = n.includes(norm(d.label)) || (d.family === "aki" && /acute (?:kidney|renal) (?:injury|failure)|\baki\b/.test(n)) ||
      (d.family.includes("dka") && /ketoacidosis|\bdka\b/.test(n));
    return mentions && /attributed to|due to|caused by|induced by|associated with|[- ]induced|[- ]associated/i.test(sentence) && !/not (?:attributed|due|caused)|unrelated to|possibly|suspect|may be/i.test(sentence);
  }).join("; ");
}
function attribution(d: Diagnosis): { substance: Substance; reaction?: string } | undefined {
  const pure = pureAdverse(d);
  const structured = d.text;
  const causal = /adverse (?:effect|reaction)(?:s)? (?:of|to)|due to|attribut(?:ed|able) to|caused by|induced by|associated with|[- ](?:associated|induced)\b/i;
  const text = causal.test(structured) ? structured : narrativeAttribution(d);
  if (!text) {
    // A coded adverse effect can identify the class even with abbreviated wording.
    const codeClass = /^T36\.0X5/.test(d.code) ? "penicillins" : /^T46\.4X5/.test(d.code) ? "ACE inhibitors" : "";
    const substance = codeClass ? resolveSubstance(codeClass, d) : undefined;
    return substance ? { substance } : undefined;
  }
  const after = /(?:adverse (?:effect|reaction)s? (?:of|to)|due to|attribut(?:ed|able) to|caused by|induced by|associated with)\s+(.+)/i.exec(text)?.[1];
  const before = /(?:^|[,;]\s*)(.+?)[- ](?:associated|induced)\b/i.exec(text)?.[1];
  const substance = resolveSubstance(after || before || text, d);
  if (!substance) return undefined;
  return { substance, reaction: pure ? undefined : d.label };
}
function reactionDetails(reaction: string, severity: string): Pick<AllergyIntoleranceRow, "reaction_type" | "mechanism" | "criticality"> {
  const s = reaction.toLowerCase();
  const hyper = /hives|urticaria|rash|anaphyla|angioedema|bronchospasm|(?:lip|face|facial|tongue|throat|mouth).{0,20}swell|swell.{0,20}(?:lip|face|tongue|throat)/.test(s);
  const serious = /ketoacidosis|\bdka\b|pancreatitis|(?:liver|hepatic|kidney|renal).{0,20}(?:injury|failure)|hepatitis|rhabdomyolysis|agranulocytosis|severe hypoglyc|lactic acidosis|major bleed|gastrointestinal bleed|arrhythmia|torsades|stevens.johnson|toxic epidermal|necrolysis|\baki\b/.test(s);
  const side = /cough|nausea|vomit|diarrh|constipation|stomach upset|drows|sedat|fatigue|headache|dizz|myalgia|edema|oedema|flushing|bradycardia/.test(s);
  const reaction_type: AllergyIntoleranceRow["reaction_type"] = hyper ? "hypersensitivity" : serious ? "serious_adverse_event" : side ? "side_effect" : severity === "severe" ? "serious_adverse_event" : "hypersensitivity";
  let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
  if (/non[- ]?immune|not immune|non[- ]allergic/.test(s)) mechanism = "non_immune";
  else if (!/not .{0,20}(?:immune|ige)|no evidence of/.test(s) && /immune[- ]mediated|ige[- ]mediated|confirmed.{0,15}allergy test/.test(s)) mechanism = "immune";
  else if ((!hyper && side) || /ketoacidosis|\bdka\b|lactic acidosis|hypoglyc/.test(s)) mechanism = "non_immune";
  const high = severity === "severe" || serious || /anaphyla|angioedema|bronchospasm|tongue|throat|lip swelling/.test(s);
  return { reaction_type, mechanism, criticality: high ? "high" : severity === "mild" ? "low" : "unknown" };
}
function allergies(docs: Doc[], confirmed: Diagnosis[]): AllergyIntoleranceRow[] {
  const rows = new Map<string, AllergyIntoleranceRow>();
  function add(row: AllergyIntoleranceRow): void {
    const k = norm(row.substance);
    const prev = rows.get(k);
    if (!prev) { rows.set(k, row); return; }
    const reactions = [...new Set([...(prev.reaction ? prev.reaction.split("; ") : []), ...(row.reaction ? row.reaction.split("; ") : [])])];
    const rank = { side_effect: 1, hypersensitivity: 2, serious_adverse_event: 3 };
    rows.set(k, {
      ...prev, ...row,
      rxnorm_ingredient: row.rxnorm_ingredient || prev.rxnorm_ingredient,
      reaction: reactions.length ? reactions.join("; ") : undefined,
      reaction_type: rank[prev.reaction_type] > rank[row.reaction_type] ? prev.reaction_type : row.reaction_type,
      mechanism: prev.mechanism === row.mechanism ? row.mechanism : "unknown",
      criticality: prev.criticality === "high" || row.criticality === "high" ? "high" : prev.criticality === "low" || row.criticality === "low" ? "low" : "unknown",
      evidence: evidence(prev.evidence, row.evidence),
      sensitivity: [...new Set([...(prev.sensitivity || []), ...(row.sensitivity || [])])].length ? [...new Set([...(prev.sensitivity || []), ...(row.sensitivity || [])])] : undefined,
    });
  }
  const snapshot = docs.filter(d => str(d.enc.document_kind)).at(-1);
  if (snapshot) for (const r of refs(snapshot, "allergy")) {
    const name = str(r.e.substance);
    if (!name || /^(?:nkda|nka|no known (?:drug )?allergies|none)$/i.test(name)) continue;
    const rx = str(r.e.rxnorm_ingredient);
    const isClass = drugClasses.some(c => c.pattern.test(name));
    const normalized = ingredient(name);
    const single = !!rx || (!isClass && (knownIngredients.includes(normalized || "") || Object.keys(brands).some(b => name.toLowerCase().startsWith(b))));
    const substance = single ? normalized || name.toLowerCase() : name;
    const reaction = str(r.e.reaction);
    add({
      substance, rxnorm_ingredient: rx || undefined, reaction: reaction || undefined,
      ...reactionDetails(reaction, str(r.e.severity)), sensitivity: sensitivities(substance + " " + reaction), evidence: ev(r),
    });
  }
  for (const d of confirmed) {
    const a = attribution(d);
    if (!a) continue;
    add({
      substance: a.substance.name, rxnorm_ingredient: a.substance.rx, reaction: a.reaction,
      ...reactionDetails(a.reaction || d.label, ""),
      sensitivity: sensitivities(d.text + " " + a.substance.name, d.code),
      evidence: evidence(ev(d.r), a.substance.evidence),
    });
  }
  return [...rows.values()].sort((a, b) => cmp(a.substance, b.substance));
}

function vitals(docs: Doc[]): VitalRow[] {
  type Reading = { row: VitalRow; ms: number; encounter: string; documents: Set<string>; bpOnly: boolean };
  const readings = new Map<string, Reading>();
  for (const d of docs) for (const r of refs(d, "vitals")) {
    const t = time(r.e.taken);
    if (!t || !/[T ]\d\d:\d\d/.test(str(r.e.taken))) continue;
    const bp = obj(r.e.bp);
    const row: VitalRow = { setting: "hospital", local_time: t.local, evidence: ev(r) };
    row.systolic_mmhg = num(bp?.systolic_mmhg);
    row.diastolic_mmhg = num(bp?.diastolic_mmhg);
    row.pulse_bpm = num(r.e.heart_rate_bpm);
    const weight = num(r.e.weight_kg);
    if (weight !== undefined) row.weight_kg = Math.round(weight * 10) / 10;
    if ([row.systolic_mmhg, row.diastolic_mmhg, row.pulse_bpm, row.weight_kg].every(v => v === undefined)) continue;
    const encounter = key(d.issuer, d.encounter);
    const k = key(encounter, String(t.ms));
    const prev = readings.get(k);
    const bpOnly = row.systolic_mmhg !== undefined && row.weight_kg === undefined &&
      [r.e.resp_rate_per_min, r.e.temp_f, r.e.spo2_pct].every(v => num(v) === undefined);
    if (prev) {
      // Later signed copies can complete/correct a set at the same instant.
      for (const field of ["systolic_mmhg", "diastolic_mmhg", "pulse_bpm", "weight_kg"] as const) {
        if (row[field] !== undefined) prev.row[field] = row[field];
      }
      prev.row.evidence = evidence(prev.row.evidence, row.evidence);
      prev.documents.add(d.id);
      prev.bpOnly = prev.bpOnly && bpOnly;
    } else readings.set(k, { row, ms: t.ms, encounter, documents: new Set([d.id]), bpOnly });
  }
  const sorted = [...readings.values()].sort((a, b) => a.ms - b.ms || cmp(a.encounter, b.encounter));
  const sets: Reading[] = [];
  for (const reading of sorted) {
    const prev = [...sets].reverse().find(p => p.encounter === reading.encounter);
    const sameDocument = prev && [...reading.documents].some(id => prev.documents.has(id));
    const close = prev && reading.ms - prev.ms <= 5 * 60000;
    // Separate daily/inpatient observations remain separate. Only a BP-only
    // recheck in the same examination is attached as a later repeat.
    const recheck = prev && reading.bpOnly && sameDocument && reading.ms - prev.ms <= 2 * 3600000 &&
      prev.row.local_time.slice(0, 10) === reading.row.local_time.slice(0, 10);
    if (prev && (close || recheck)) {
      if (reading.row.systolic_mmhg !== undefined || reading.row.diastolic_mmhg !== undefined) {
        if (prev.row.systolic_mmhg === undefined && prev.row.diastolic_mmhg === undefined) {
          prev.row.systolic_mmhg = reading.row.systolic_mmhg;
          prev.row.diastolic_mmhg = reading.row.diastolic_mmhg;
          prev.row.local_time = reading.row.local_time;
        } else {
          prev.row.repeat_systolic_mmhg = reading.row.systolic_mmhg;
          prev.row.repeat_diastolic_mmhg = reading.row.diastolic_mmhg;
        }
      }
      if (prev.row.pulse_bpm === undefined) prev.row.pulse_bpm = reading.row.pulse_bpm;
      if (prev.row.weight_kg === undefined) prev.row.weight_kg = reading.row.weight_kg;
      prev.row.evidence = evidence(prev.row.evidence, reading.row.evidence);
      for (const id of reading.documents) prev.documents.add(id);
    } else sets.push(reading);
  }
  return sets.map(s => s.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const docs = documents(items, asOf);
  const problems = problemData(docs);
  return {
    medications: medications(docs), problems: problems.rows,
    allergies: allergies(docs, problems.confirmed), labs: labs(docs), vitals: vitals(docs),
  };
}
