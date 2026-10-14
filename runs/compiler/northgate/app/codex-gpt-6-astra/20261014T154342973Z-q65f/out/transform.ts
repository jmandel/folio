import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// Payloads are deliberately read at runtime: a bad or unfamiliar entry must not
// prevent the readable part of a chart from being returned.
type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj | undefined =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? v as Obj : undefined;
const str = (v: unknown): string => typeof v === "string" ? v : "";
const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const pad = (n: number, width = 2): string => String(n).padStart(width, "0");
const empty = (): ViewRows => ({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function wallAt(ms: number): string {
  const p: Record<string, string> = {};
  for (const part of chicago.formatToParts(new Date(ms))) p[part.type] = part.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}
function offsetAt(ms: number): number {
  return Math.round((Date.parse(wallAt(ms) + "Z") - Math.floor(ms / 1000) * 1000) / 60000);
}
function offsetText(minutes: number): string {
  return `${minutes < 0 ? "-" : "+"}${pad(Math.floor(Math.abs(minutes) / 60))}:${pad(Math.abs(minutes) % 60)}`;
}
function localEpoch(wall: string): number {
  const nominal = Date.parse(wall + "Z");
  const offsets = new Set([offsetAt(nominal - 86400000), offsetAt(nominal + 86400000)]);
  const candidates = [...offsets].map(o => nominal - o * 60000)
    .filter(t => wallAt(t) === wall.slice(0, 19));
  // During the fall fold, choose the earlier occurrence. For a spring gap,
  // preserve the supplied wall clock, using the offset after the transition.
  return candidates.length ? Math.min(...candidates) : nominal - offsetAt(nominal + 86400000) * 60000;
}
function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
type Time = { date: string; epoch: number; wall?: string; rfc?: string };
function time(v: unknown): Time | undefined {
  try { return readTime(v); } catch { return undefined; }
}
function readTime(v: unknown): Time | undefined {
  const s = str(v).trim();
  if (/^\d{4}(?:-\d{2})?(?:-\d{2})?$/.test(s)) {
    const date = s.length === 4 ? s + "-01-01" : s.length === 7 ? s + "-01" : s;
    if (!validDate(date)) return undefined;
    return { date: s, epoch: localEpoch(date + "T00:00:00") };
  }
  const m = s.match(/^(\d{4}-\d{2}-\d{2})[Tt ](\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?\s*(Z|[+-]\d{2}:?\d{2}|UTC|GMT)?$/i);
  if (!m || !validDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] || 0) > 59) return undefined;
  const wall = `${m[1]}T${m[2]}:${m[3]}:${m[4] || "00"}`;
  const fraction = m[5] || "";
  if (m[6]) {
    const zone = /^(z|utc|gmt)$/i.test(m[6]) ? "Z" : m[6].replace(/^([+-]\d{2})(\d{2})$/, "$1:$2");
    const epoch = Date.parse(wall + fraction + zone);
    if (!Number.isFinite(epoch)) return undefined;
    const local = wallAt(epoch);
    return { date: local.slice(0, 10), epoch, wall: local, rfc: local + fraction + offsetText(offsetAt(epoch)) };
  }
  const epoch = localEpoch(wall) + Number("0" + fraction) * 1000;
  // Do not round-trip a naive time through UTC: even a DST-gap wall time is kept.
  const off = Math.round((Date.parse(wall + "Z") - localEpoch(wall)) / 60000);
  return { date: m[1], epoch, wall, rfc: wall + fraction + offsetText(off) };
}
function onset(v: unknown): ProblemRow["onset"] {
  const o = obj(v);
  if (!o) return undefined;
  const date = time(o.date)?.date;
  const length = o.precision === "year" ? 4 : o.precision === "month" ? 7 : o.precision === "day" ? 10 : 0;
  if (!date || !length || date.length < length) return undefined;
  return { value: date.slice(0, length), precision: o.precision as "year" | "month" | "day" };
}

type Item = { raw: Obj; id: string; issuer: string; recorded: Time; effective?: Time };
type Entry = { item: Item; id: string; data: Obj };
const itemKey = (issuer: string, id: string): string => JSON.stringify([issuer, id]);
const evidence = (e: Entry): Evidence => [{ item_id: e.item.id, entry_id: e.id }];
function mergeEvidence(...groups: Evidence[]): Evidence {
  const map = new Map<string, Evidence[number]>();
  for (const group of groups) for (const e of group) map.set(JSON.stringify([e.item_id, e.entry_id]), e);
  return [...map.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id || "", b.entry_id || ""));
}
function order(a: Entry, b: Entry): number {
  return (a.item.effective?.epoch ?? a.item.recorded.epoch) - (b.item.effective?.epoch ?? b.item.recorded.epoch)
    || a.item.recorded.epoch - b.item.recorded.epoch || cmp(a.item.id, b.item.id) || cmp(a.id, b.id);
}

function countingItems(input: FolioItem[], asOf: string): Item[] {
  const byId = new Map<string, Item>();
  for (const v of Array.isArray(input) ? input : []) {
    const raw = obj(v);
    if (!raw || !str(raw.id) || !str(raw.issuer)) continue;
    const recorded = time(raw.recorded);
    if (!recorded || recorded.date.length !== 10 || recorded.date > asOf) continue;
    const item: Item = { raw, id: str(raw.id), issuer: str(raw.issuer), recorded, effective: time(raw.effective) };
    byId.set(itemKey(item.issuer, item.id), item);
  }
  const attacks = new Map<string, Set<string>>();
  const indegree = new Map<string, number>();
  for (const key of byId.keys()) indegree.set(key, 0);
  for (const [key, item] of byId) {
    const targets = new Set<string>();
    const pending = strings(item.raw.supersedes).map(id => itemKey(item.issuer, id));
    // Only supersession is transitive. A void of a correction does not void
    // the original fact; an inactive correction's own retractions do not fire.
    while (pending.length) {
      const target = pending.pop()!;
      if (targets.has(target)) continue;
      targets.add(target);
      const previous = byId.get(target);
      if (previous) for (const id of strings(previous.raw.supersedes)) pending.push(itemKey(item.issuer, id));
    }
    for (const id of strings(item.raw.retracts)) targets.add(itemKey(item.issuer, id));
    for (const target of [...targets]) if (!byId.has(target)) targets.delete(target);
    attacks.set(key, targets);
    for (const target of targets) indegree.set(target, indegree.get(target)! + 1);
  }
  const queue = [...indegree.keys()].filter(k => indegree.get(k) === 0).sort(cmp);
  const suppressed = new Set<string>();
  const result: Item[] = [];
  for (let i = 0; i < queue.length; i++) {
    const key = queue[i];
    const active = !suppressed.has(key);
    if (active) result.push(byId.get(key)!);
    for (const target of attacks.get(key) || []) {
      if (active) suppressed.add(target);
      const left = indegree.get(target)! - 1;
      indegree.set(target, left);
      if (left === 0) queue.push(target);
    }
  }
  // Cyclic replacement references are unreadable; leave their component out.
  return result.sort((a, b) => a.recorded.epoch - b.recorded.epoch || cmp(a.id, b.id));
}

// These are name translations, never RxNorm-code translations. Medication
// rxnorm in this source is SCD/SBD, whereas allergy rxnorm is explicitly IN.
const brands: Record<string, string[]> = {
  ventolin: ["albuterol"], proair: ["albuterol"], proventil: ["albuterol"],
  keflex: ["cephalexin"], amoxil: ["amoxicillin"], augmentin: ["amoxicillin", "clavulanic acid"],
  bactrim: ["sulfamethoxazole", "trimethoprim"], septra: ["sulfamethoxazole", "trimethoprim"],
  zestril: ["lisinopril"], prinivil: ["lisinopril"], cozaar: ["losartan"], diovan: ["valsartan"],
  norvasc: ["amlodipine"], lasix: ["furosemide"], aldactone: ["spironolactone"],
  lopressor: ["metoprolol"], toprol: ["metoprolol"], coreg: ["carvedilol"],
  microzide: ["hydrochlorothiazide"], hyzaar: ["losartan", "hydrochlorothiazide"],
  zestoretic: ["lisinopril", "hydrochlorothiazide"], prinzide: ["lisinopril", "hydrochlorothiazide"],
  glucophage: ["metformin"], jardiance: ["empagliflozin"], farxiga: ["dapagliflozin"],
  invokana: ["canagliflozin"], januvia: ["sitagliptin"], tradjenta: ["linagliptin"],
  janumet: ["sitagliptin", "metformin"], synjardy: ["empagliflozin", "metformin"],
  glucotrol: ["glipizide"], amaryl: ["glimepiride"],
  ozempic: ["semaglutide"], wegovy: ["semaglutide"], rybelsus: ["semaglutide"],
  trulicity: ["dulaglutide"], victoza: ["liraglutide"], mounjaro: ["tirzepatide"], zepbound: ["tirzepatide"],
  lantus: ["insulin glargine"], basaglar: ["insulin glargine"], toujeo: ["insulin glargine"], semglee: ["insulin glargine"],
  humalog: ["insulin lispro"], novolog: ["insulin aspart"], fiasp: ["insulin aspart"],
  levemir: ["insulin detemir"], tresiba: ["insulin degludec"],
  lipitor: ["atorvastatin"], crestor: ["rosuvastatin"], zocor: ["simvastatin"], pravachol: ["pravastatin"],
  synthroid: ["levothyroxine"], levoxyl: ["levothyroxine"], unithroid: ["levothyroxine"],
  prilosec: ["omeprazole"], protonix: ["pantoprazole"], nexium: ["esomeprazole"], pepcid: ["famotidine"],
  zyrtec: ["cetirizine"], claritin: ["loratadine"], benadryl: ["diphenhydramine"], allegra: ["fexofenadine"],
  tylenol: ["acetaminophen"], advil: ["ibuprofen"], motrin: ["ibuprofen"], aleve: ["naproxen"],
  zoloft: ["sertraline"], prozac: ["fluoxetine"], lexapro: ["escitalopram"], celexa: ["citalopram"],
  paxil: ["paroxetine"], wellbutrin: ["bupropion"], zyban: ["bupropion"],
  effexor: ["venlafaxine"], cymbalta: ["duloxetine"], remeron: ["mirtazapine"],
  seroquel: ["quetiapine"], abilify: ["aripiprazole"], risperdal: ["risperidone"],
  zyprexa: ["olanzapine"], depakote: ["divalproex"], lamictal: ["lamotrigine"],
  suboxone: ["buprenorphine", "naloxone"], subutex: ["buprenorphine"], vivitrol: ["naltrexone"],
  truvada: ["emtricitabine", "tenofovir disoproxil"], descovy: ["emtricitabine", "tenofovir alafenamide"],
  biktarvy: ["bictegravir", "emtricitabine", "tenofovir alafenamide"],
  eliquis: ["apixaban"], xarelto: ["rivaroxaban"], coumadin: ["warfarin"], plavix: ["clopidogrel"],
};
const knownDrugs = new Set([
  ...Object.values(brands).flat(), "isoniazid", "valproate", "valproic acid", "prednisone", "prednisolone", "erythromycin",
  "azithromycin", "clarithromycin", "doxycycline", "nitrofurantoin", "ciprofloxacin", "levofloxacin", "clindamycin",
  "penicillin", "ampicillin", "piperacillin", "dicloxacillin", "cefdinir", "ceftriaxone", "cefuroxime",
  "enalapril", "ramipril", "benazepril", "captopril", "irbesartan", "olmesartan", "telmisartan",
  "chlorthalidone", "atenolol", "bisoprolol", "propranolol", "hydralazine", "eplerenone", "finerenone", "torsemide", "bumetanide",
  "aspirin", "allopurinol", "colchicine", "gabapentin", "pregabalin", "hydroxyzine", "trazodone", "buspirone",
  "lithium", "lorazepam", "clonazepam", "alprazolam", "diazepam", "methadone", "oxycodone", "hydrocodone",
  "morphine", "codeine", "tramadol", "fentanyl", "norethindrone", "ethinyl estradiol", "levonorgestrel",
]);
const dropPackagePrefix = (s: string): string => s.replace(/^\s*(?:\d+(?:\.\d+)?\s*(?:ml|hr|hours?|actuat(?:ion)?s?)\s+)+/i, "");
function genericPart(name: string): string {
  return dropPackagePrefix(name.toLowerCase()).replace(/\[[^\]]*\]/g, " ")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+\d.*$/, "")
    .replace(/\b(?:hydrochloride|hcl|dihydrochloride|hydrobromide|hbr|trihydrate|dihydrate|monohydrate|anhydrous|besylate|besilate|succinate|tartrate|fumarate|maleate|mesylate)\b/g, " ")
    .replace(/(\S)\s+(?:phosphate|sulfate|sulphate|sodium|potassium|calcium)\b/g, "$1 ")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|sustained[ -]release|er|xr|sr|xl|dr|hfa|oral|subcutaneous|topical|ophthalmic|inhalation|injectable|tablet|tablets|capsule|capsules|solution|suspension|cream|ointment|gel|patch|pen|injector|injection|inhaler|powder)\b.*$/, "")
    .replace(/\s+/g, " ").replace(/^[\s/+,;-]+|[\s/+,;-]+$/g, "")
    .replace(/^clavulanate$/, "clavulanic acid")
    .replace(/^(insulin (?:glargine|lispro|aspart))-[a-z]{4}$/, "$1");
}
function ingredients(name: string): string[] {
  const low = name.toLowerCase();
  // Prefer the explicit generic name over a bracketed brand (which may be a
  // combination brand). A leading brand, however, must be translated.
  const leading = dropPackagePrefix(low).match(/^[a-z]+/)?.[0];
  if (leading && Array.isArray(brands[leading])) return [...brands[leading]];
  const clean = dropPackagePrefix(low.replace(/\[[^\]]*\]/g, ""));
  const parts = clean.split(/\s*\/\s*(?!(?:ml|l|actuation|puff|dose|hr|h)\b)(?=[a-z])|\s*\+\s*|\s+and\s+|\s*;\s*/);
  const knownPair = /^(lisinopril|losartan|valsartan|amlodipine|sulfamethoxazole|sitagliptin|empagliflozin|buprenorphine)[-/](hydrochlorothiazide|amlodipine|benazepril|trimethoprim|metformin|naloxone)\b/;
  const pair = clean.match(knownPair);
  const values = pair ? [pair[1], pair[2]] : parts.map(genericPart);
  return [...new Set(values.filter(v => v && /[a-z]/.test(v) && !/^(unknown|unspecified|medication|drug|not recorded)$/.test(v)))];
}

function sensitivity(e: Obj, text: string, code = ""): Sensitivity[] | undefined {
  const result = new Set<Sensitivity>();
  const t = text.toLowerCase();
  const c = code.toUpperCase();
  if (e.restricted === "BH") result.add("mental-health");
  if (/^F(?:0\d|[2-9]\d)/.test(c) || /\b(depress(?:ion|ive)|anxiety|bipolar|schizophren\w*|psychosis|ptsd|adhd|obsessive.compulsive|quetiapine|sertraline|escitalopram|fluoxetine|citalopram|paroxetine|bupropion|venlafaxine|mirtazapine|aripiprazole|risperidone|olanzapine)\b/.test(t)) result.add("mental-health");
  if (/^F1\d/.test(c) || /\b(?:alcohol|opioid|cocaine|cannabis|substance|tobacco|nicotine) (?:use disorder|dependence|abuse)\b|\b(?:buprenorphine|naltrexone|acamprosate|disulfiram)\b/.test(t)) result.add("substance-use");
  if (/^(?:O\d|Z3[0-9]|N9[1678])/.test(c) || /\b(?:contracept\w*|pregnan\w*|infertility|fertility|endometriosis|menopause|erectile dysfunction|ethinyl estradiol|levonorgestrel|norethindrone)\b/.test(t)) result.add("sexual-reproductive-health");
  if (/^(?:B2[0-4]|Z21|A[56]\d)/.test(c) || /\b(?:hiv|aids|chlamydia|gonorrh\w*|syphilis|genital herpes|antiretroviral|emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|rilpivirine|efavirenz|darunavir|abacavir|zidovudine)\b/.test(t)) result.add("hiv-sti");
  if (/\b(?:brca[12]?|genetic|hereditary|inherited|cystic fibrosis|sickle.cell|huntington|marfan|factor v leiden|polycystic kidney disease)\b/.test(t)) result.add("genetic");
  return result.size ? [...result].sort(cmp) : undefined;
}

function doseUnit(s: string): "mg" | "mcg" | "units" | "mL" | "tablet" | undefined {
  const v = s.toLowerCase().trim();
  if (/^(mg|milligrams?)$/.test(v)) return "mg";
  if (/^(mcg|[µμ]g|micrograms?)$/.test(v)) return "mcg";
  if (/^(u|iu|unt|units?|unit\(s\))$/.test(v)) return "units";
  if (/^(ml|cc|millilit(?:er|re)s?)$/.test(v)) return "mL";
  if (/^(tabs?|tablets?|tab\(s\))$/.test(v)) return "tablet";
  return undefined;
}
const variableSig = (s: string): boolean => /\bsliding\s+scale\b|\b(?:depending|based)\s+on\b|\b(?:taper|titration)\b|\d+(?:\.\d+)?\s*(?:[-–—]|to|or)\s*\d+(?:\.\d+)?\s*(?:puffs?|tabs?|tablets?|capsules?|mg|mcg|ml|units?)\b/i.test(s);
function medDose(d: Obj, ingredient: string, ingredientCount: number): MedicationRow["dose"] {
  const sig = str(d.sig);
  if (variableSig(sig)) return undefined;
  const dose = obj(d.dose);
  const value = num(dose?.value);
  const unit = doseUnit(str(dose?.unit));
  if (value === undefined || !unit) return undefined;
  if (unit !== "tablet") return ingredientCount === 1 ? { value, unit } : undefined;
  const name = str(obj(d.drug)?.name);
  const index = ingredients(name).indexOf(ingredient);
  const pair = name.match(/\b(\d+(?:\.\d+)?)\s*[-/]\s*(\d+(?:\.\d+)?)\s*(mg|mcg|[µμ]g)\b/i);
  if (pair && ingredientCount === 2 && index >= 0) return { value: value * +pair[index + 1], unit: doseUnit(pair[3])! };
  const escaped = ingredient.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const segment = ingredientCount === 1 ? name : name.match(new RegExp(escaped + "[^/]*", "i"))?.[0] || "";
  const strength = segment.match(/\b(\d+(?:\.\d+)?)\s*(mg|mcg|[µμ]g|milligrams?|micrograms?)\b/i);
  if (strength) return { value: value * Number(strength[1]), unit: doseUnit(strength[2])! };
  if (ingredientCount > 1) {
    const strengths = [...name.matchAll(/\b(\d+(?:\.\d+)?)\s*(mg|mcg|[µμ]g)\b/gi)];
    if (strengths.length === ingredientCount && strengths[index]) return { value: value * +strengths[index][1], unit: doseUnit(strengths[index][2])! };
  }
  return ingredientCount === 1 ? { value, unit: "tablet" } : undefined;
}
function frequency(d: Obj): MedicationRow["frequency"] {
  const f = str(d.frequency);
  if (["QD", "BID", "TID", "QHS", "PRN", "QW"].includes(f)) return f as MedicationRow["frequency"];
  const s = str(d.sig).toLowerCase();
  if (/\bas needed\b|\bprn\b/.test(s)) return "PRN";
  if (variableSig(s)) return f || s ? "other" : undefined;
  if (/\b(?:once (?:a |per )?week|weekly|every 7 days)\b/.test(s)) return "QW";
  if (/\b(?:twice (?:a |per )?day|twice daily|every 12 hours)\b/.test(s)) return "BID";
  if (/\b(?:three times (?:a |per )?day|three times daily|every 8 hours)\b/.test(s)) return "TID";
  if (/\b(?:at bedtime|nightly|at night|every evening)\b/.test(s)) return "QHS";
  if (/\b(?:once (?:a |per )?day|once daily|daily|every morning)\b/.test(s) && !/every other|four times|twice|three times/.test(s)) return "QD";
  return f === "OTHER" || /every|times|taper/.test(s) ? "other" : undefined;
}
function medications(entries: Entry[]): MedicationRow[] {
  const lines = new Map<string, Entry[]>();
  for (const e of entries) if (e.data.type === "med_event" && str(e.data.med_id) && ["start", "change", "hold", "resume", "stop"].includes(str(e.data.action))) {
    const key = str(e.data.med_id);
    lines.set(key, [...(lines.get(key) || []), e]);
  }
  const winners = new Map<string, { entry: Entry; row: MedicationRow }>();
  for (const events of lines.values()) {
    events.sort(order);
    const e = events[events.length - 1];
    const d = e.data;
    const name = str(obj(d.drug)?.name);
    if (!name.trim()) continue;
    const names = ingredients(name);
    const status: MedicationRow["status"] = d.action === "stop" ? "stopped" : d.action === "hold" ? "held" : "active";
    let since: Entry | undefined = e;
    if (d.action === "change") {
      since = undefined;
      for (let i = events.length - 2; i >= 0; i--) {
        const prev = events[i];
        if (prev.data.action === "start" || prev.data.action === "resume") { since = prev; break; }
        if (prev.data.action !== "change") break;
      }
    }
    for (const ingredient of names.length ? names : [undefined]) {
      const row: MedicationRow = {
        drug_name: name, status, patient_reported: false,
        evidence: mergeEvidence(evidence(e), since && since !== e ? evidence(since) : []),
      };
      if (ingredient) row.ingredient = ingredient;
      if (since?.item.effective) row.status_since = since.item.effective.date;
      const dose = medDose(d, ingredient || "", names.length || 1);
      if (dose) row.dose = dose;
      const freq = frequency(d);
      if (freq) row.frequency = freq;
      if (status === "stopped" && ["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(str(d.stop_reason))) row.stop_reason = d.stop_reason as MedicationRow["stop_reason"];
      if (str(d.reason_text)) row.status_reason_text = str(d.reason_text);
      const sensitive = sensitivity(d, [name, ingredient, str(d.reason_text)].join(" "));
      if (sensitive) row.sensitivity = sensitive;
      const key = ingredient || name.toLowerCase();
      const old = winners.get(key);
      if (!old || order(old.entry, e) < 0) winners.set(key, { entry: e, row });
    }
  }
  return [...winners.values()].map(v => v.row).sort((a, b) => cmp(a.ingredient || a.drug_name, b.ingredient || b.drug_name));
}

function ckd(code: string, description: string): boolean {
  return /^N18(?:\.|$)/i.test(code) || (!/^E1[01]\./i.test(code) && /\b(?:ckd|chronic (?:kidney|renal) (?:disease|failure|insufficiency)|end.stage renal)\b/i.test(description));
}
function conditionKey(code: string, text: string, snomed = ""): string {
  const c = code.toUpperCase().trim();
  if (ckd(c, text)) return "ckd";
  if (/^E1[01](?:\.|$)/.test(c)) return c.slice(0, 3);
  if (c === "I10" || /^(?:essential |primary )?hypertension$/i.test(text.trim())) return "hypertension";
  return c || (snomed ? "snomed:" + snomed : text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());
}
function stage(code: string, text: string): ProblemRow["ckd_stage"] {
  if (!ckd(code, text)) return undefined;
  const explicit = text.match(/\bG\s*(3[ab]|[1245])(?=\b|A[123])/i)?.[1] || text.match(/\bstage\s*(3[ab]|[1245])\b/i)?.[1];
  if (explicit) return ("G" + explicit.toLowerCase()) as ProblemRow["ckd_stage"];
  const roman = text.match(/\bstage\s+(III[ab]|IV|II|I|V)\b/i)?.[1].toUpperCase();
  const romanStages: Record<string, ProblemRow["ckd_stage"]> = { I: "G1", II: "G2", IIIA: "G3a", IIIB: "G3b", IV: "G4", V: "G5" };
  if (roman) return romanStages[roman];
  const codes: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
  return codes[code.toUpperCase()];
}
const unconfirmed = (s: string): boolean => /\b(?:rule[ -]?out|r\/o|suspected|possible|probable|provisional|working diagnosis|ruled out)\b|\?$|^no (?:evidence of |known )?/i.test(s);
type ProblemFact = { entry: Entry; description: string; code: string; snomed: string; key: string; line: boolean };
function problemFacts(entries: Entry[]): ProblemFact[] {
  const lines = new Map<string, Entry>();
  const aliases = new Map<string, Set<string>>();
  const referrals = new Map<string, Entry>();
  for (const e of entries) {
    if (e.data.type === "problem_event" && str(e.data.problem_id) && ["add", "update", "resolve", "remove"].includes(str(e.data.action))) {
      const id = str(e.data.problem_id);
      const keys = aliases.get(id) || new Set<string>();
      keys.add(conditionKey(str(e.data.icd10cm), str(e.data.description), str(e.data.snomed)));
      aliases.set(id, keys);
      const old = lines.get(id);
      if (!old || order(old, e) < 0) lines.set(id, e);
    }
    if (e.data.type === "referral_dx" && str(e.data.referral_id)) {
      const key = JSON.stringify([e.data.referral_id, conditionKey(str(e.data.icd10cm), str(e.data.display))]);
      const old = referrals.get(key);
      if (!old || order(old, e) < 0) referrals.set(key, e);
    }
  }
  // Referrals lack a problem-line id. Match their older diagnosis codes against
  // the surviving line's history, so a recode does not create a second disease.
  const aliasToCurrent = new Map<string, { key: string; entry: Entry }>();
  for (const [id, e] of lines) {
    const key = conditionKey(str(e.data.icd10cm), str(e.data.description), str(e.data.snomed));
    for (const alias of aliases.get(id) || []) {
      const old = aliasToCurrent.get(alias);
      if (!old || order(old.entry, e) < 0) aliasToCurrent.set(alias, { key, entry: e });
    }
  }
  const facts: ProblemFact[] = [];
  for (const e of [...lines.values(), ...referrals.values()]) {
    const line = e.data.type === "problem_event";
    const description = str(line ? e.data.description : e.data.display);
    if (!description.trim()) continue;
    const code = str(e.data.icd10cm), snomed = str(e.data.snomed);
    const key = conditionKey(code, description, snomed);
    facts.push({ entry: e, description, code, snomed, key: line ? key : aliasToCurrent.get(key)?.key || key, line });
  }
  const groups = new Map<string, ProblemFact[]>();
  for (const f of facts) groups.set(f.key, [...(groups.get(f.key) || []), f]);
  const result: ProblemFact[] = [];
  for (const group of groups.values()) {
    // A referral repeats diagnoses selected when it was created. It supplies
    // assertions absent from the event stream, but does not undo a later list
    // resolution/removal or re-stage a maintained list line.
    const list = group.filter(f => f.line);
    const candidates = list.length ? list : group;
    candidates.sort((a, b) => order(a.entry, b.entry));
    const f = candidates[candidates.length - 1];
    if (f.entry.data.action !== "remove" && !unconfirmed(f.description)) result.push(f);
  }
  return result;
}
function problems(facts: ProblemFact[]): ProblemRow[] {
  const result: ProblemRow[] = [];
  for (const f of facts) {
    // Pure adverse-effect codes assert the drug reaction, not a separate disease.
    if (/^T(?:3[6-9]|4\d|50)\./i.test(f.code) && /adverse effect/i.test(f.description)) continue;
    const d = f.entry.data;
    const row: ProblemRow = { condition: f.description, status: d.action === "resolve" ? "resolved" : "active", evidence: evidence(f.entry) };
    if (f.code) row.icd10cm = f.code;
    if (f.snomed) row.snomed = f.snomed;
    const start = onset(d.onset);
    if (start) row.onset = start;
    const g = stage(f.code, f.description);
    if (g) row.ckd_stage = g;
    if (ckd(f.code, f.description)) {
      const a = f.description.match(/(?:\b|G[1-5][ab]?)A\s*([123])\b/i)?.[1];
      if (a) row.albuminuria = ("A" + a) as ProblemRow["albuminuria"];
    }
    const sensitive = sensitivity(d, f.description, f.code);
    if (sensitive) row.sensitivity = sensitive;
    result.push(row);
  }
  return result.sort((a, b) => cmp(a.condition, b.condition) || cmp(a.icd10cm || "", b.icd10cm || ""));
}

const hyper = /\b(?:hives|urticaria|rash|angioedema|anaphyl\w*|bronchospasm|(?:lip|face|facial|tongue|throat) swelling|swelling of (?:the )?(?:lips|face|tongue|throat))\b/i;
const serious = /\b(?:ketoacidosis|dka|pancreatitis|liver (?:injury|failure)|hepatotoxicity|renal failure|kidney injury|agranulocytosis|rhabdomyolysis|stevens.johnson|toxic epidermal necrolysis|major bleeding|gastrointestinal bleeding|severe hypoglyc\w*)\b/i;
const sideEffect = /\b(?:cough|nausea|vomiting|diarrh\w*|stomach upset|drowsiness|sedation|constipation|dizziness|headache|myalgia)\b/i;
function positiveReaction(s: string): string {
  return s.split(/[;.!]|,\s*(?:no|denies|without)\b/i).filter(p => !/\b(?:no|denies|without|not)\b/i.test(p)).join("; ");
}
function reactionType(reaction: string, sourceType: unknown): AllergyIntoleranceRow["reaction_type"] | undefined {
  const s = positiveReaction(reaction);
  if (hyper.test(s)) return "hypersensitivity";
  if (serious.test(s)) return "serious_adverse_event";
  if (sideEffect.test(s)) return "side_effect";
  if (sourceType === "allergy") return "hypersensitivity";
  if (sourceType === "intolerance") return "side_effect";
  if (sourceType === "adverse_reaction") return "serious_adverse_event";
  return undefined;
}
function substanceName(name: string, isDrug: boolean): string {
  if (/\b(?:inhibitors?|blockers?|antibiotics|penicillins|sulfonamides|nsaids|statins|opioids)\b/i.test(name)) return name;
  const parts = ingredients(name);
  if (parts.length !== 1) return name;
  const translated = parts[0];
  // Source ingredient codes identify drugs. With no code, translate recognizable
  // drug names, but preserve foods/environmental names exactly as recorded.
  const known = knownDrugs.has(translated);
  return isDrug || known ? translated : name;
}
function attributedReaction(f: ProblemFact, entries: Entry[]): { substance: string; reaction: string } | undefined {
  const s = f.description;
  let drug = "", reaction = "";
  let m = s.match(/^(.*?)\s+(?:due to|caused by|secondary to|associated with|attributed to)\s+(.+?)\.?$/i);
  if (m) { reaction = m[1]; drug = m[2]; }
  else if ((m = s.match(/^adverse (?:effect|reaction)s? (?:of|to)\s+(.+?)(?:[,;:]\s*(.+))?$/i))) { drug = m[1]; reaction = m[2] || s; }
  else if ((m = s.match(/^(.+?)[ -](?:induced|associated)\s+(.+)$/i))) { drug = m[1]; reaction = m[2]; }
  else if ((m = s.match(/^(ACE[ -]inhibitors?)\s+(cough)$/i))) { drug = m[1]; reaction = m[2]; }
  else if ((m = s.match(/^(.+?)\s+(?:on|from)\s+(.+)$/i)) && reactionType(m[1], undefined)) { reaction = m[1]; drug = m[2]; }
  if (!drug || /^(?:diabetes|hypertension|infection|unknown|unspecified|other disease|renal|kidney)\b/i.test(drug)) return undefined;
  drug = drug.replace(/[,;]\s*(?:initial|subsequent) encounter.*$/i, "").trim();
  // A named drug/class must be present; don't turn any causal diagnosis (e.g.
  // anemia due to CKD) into a drug allergy.
  const normalized = ingredients(drug);
  const medNames = entries.filter(e => e.item.id === f.entry.item.id && e.data.type === "med_event")
    .flatMap(e => ingredients(str(obj(e.data.drug)?.name)));
  const knownDrug = normalized.some(x => knownDrugs.has(x) || medNames.includes(x));
  const classDrug = /\b(?:inhibitors?|antibiotics|penicillins|cephalosporins|sulfonamides|nsaids|statins|opioids|blockers?)\b/i.test(drug);
  const explicitDrug = /^(?:T(?:3[6-9]|4\d|50)\.)/i.test(f.code) || /^adverse (?:effect|reaction)/i.test(s);
  if (!knownDrug && !classDrug && !explicitDrug) return undefined;
  if (classDrug) {
    let members: string[] = [];
    if (/penicillins/i.test(drug)) members = ["amoxicillin", "ampicillin", "penicillin", "piperacillin", "dicloxacillin"];
    else if (/ACE[ -]inhibitor/i.test(drug)) members = ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril"];
    else if (/statins/i.test(drug)) members = ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin"];
    const matching = [...new Set(medNames.filter(n => members.includes(n)))];
    if (matching.length === 1) drug = matching[0];
  }
  return { substance: substanceName(drug, !classDrug || medNames.includes(drug)), reaction };
}
function allergies(entries: Entry[], facts: ProblemFact[]): AllergyIntoleranceRow[] {
  const lines = new Map<string, Entry>();
  for (const e of entries) if (e.data.type === "allergy_event" && str(e.data.allergy_id) && ["add", "update", "inactivate"].includes(str(e.data.action))) {
    const id = str(e.data.allergy_id), old = lines.get(id);
    if (!old || order(old, e) < 0) lines.set(id, e);
  }
  const explicit = new Map<string, { entry: Entry; row?: AllergyIntoleranceRow }>();
  for (const e of lines.values()) {
    const d = e.data, sub = obj(d.substance), name = str(sub?.name);
    if (!name || /^(?:no known (?:drug )?allergies|nkda|nka|none)$/i.test(name.trim())) continue;
    const substance = substanceName(name, !!str(sub?.rxnorm));
    const key = substance.toLowerCase();
    const old = explicit.get(key);
    if (old && order(old.entry, e) > 0) continue;
    if (d.action === "inactivate") { explicit.set(key, { entry: e }); continue; }
    const reaction = strings(d.reactions).join("; ");
    const type = reactionType(reaction, d.reaction_type);
    if (!type) continue;
    const mechanism: AllergyIntoleranceRow["mechanism"] = d.reaction_type === "allergy" ? "immune" : d.reaction_type === "intolerance" || sideEffect.test(positiveReaction(reaction)) || serious.test(positiveReaction(reaction)) ? "non_immune" : "unknown";
    const row: AllergyIntoleranceRow = { substance, reaction_type: type, mechanism,
      criticality: d.severity === "high" || d.severity === "low" ? d.severity : "unknown", evidence: evidence(e) };
    if (str(sub?.rxnorm)) row.rxnorm_ingredient = str(sub?.rxnorm);
    if (reaction) row.reaction = reaction;
    const start = onset(d.onset);
    if (start) row.onset = start;
    const sensitive = sensitivity(d, substance + " " + reaction);
    if (sensitive) row.sensitivity = sensitive;
    explicit.set(key, { entry: e, row });
  }
  const inferred = new Map<string, { entry: Entry; row: AllergyIntoleranceRow }>();
  for (const f of facts) {
    const attribution = attributedReaction(f, entries);
    if (!attribution) continue;
    const key = attribution.substance.toLowerCase();
    const current = explicit.get(key);
    if (current?.row) { current.row.evidence = mergeEvidence(current.row.evidence, evidence(f.entry)); continue; }
    if (current && order(current.entry, f.entry) >= 0) continue;
    const type = reactionType(attribution.reaction, undefined) || (/adverse (effect|reaction)/i.test(f.description) ? "serious_adverse_event" : undefined);
    if (!type) continue;
    const row: AllergyIntoleranceRow = { substance: attribution.substance, reaction_type: type,
      mechanism: /\ballerg(?:ic|y)\b/i.test(f.description) ? "immune" : sideEffect.test(attribution.reaction) || serious.test(attribution.reaction) ? "non_immune" : "unknown",
      reaction: attribution.reaction, criticality: "unknown", evidence: evidence(f.entry) };
    const start = onset(f.entry.data.onset);
    if (start) row.onset = start;
    const sensitive = sensitivity(f.entry.data, f.description, f.code);
    if (sensitive) row.sensitivity = sensitive;
    const old = inferred.get(key);
    if (!old || order(old.entry, f.entry) < 0) inferred.set(key, { entry: f.entry, row });
  }
  return [...explicit.values(), ...inferred.values()].flatMap(v => v.row ? [v.row] : [])
    .sort((a, b) => cmp(a.substance, b.substance));
}

const units: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const analyteCodes: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", CR: "creatinine", K: "potassium", POTASSIUM: "potassium",
  NA: "sodium", SODIUM: "sodium", CL: "chloride", CHLORIDE: "chloride", CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate", BICARB: "bicarbonate", BICARBONATE: "bicarbonate",
  AG: "anion_gap", AGAP: "anion_gap", ANIONGAP: "anion_gap", BUN: "bun", GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose",
  A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c", UACR: "uacr", ACR: "uacr", MALBCR: "uacr",
  PLT: "platelets", PLATELET: "platelets", PLATELETS: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", HEMOGLOBIN: "hemoglobin",
  BHB: "bhb", BOHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase", TROP: "troponin", TROPI: "troponin", TROPONINI: "troponin",
  CHOL: "cholesterol", TCHOL: "cholesterol", TC: "cholesterol", CHOLESTEROL: "cholesterol", TG: "triglycerides", TRIG: "triglycerides", TRIGLYCERIDES: "triglycerides", HDL: "hdl", HDLC: "hdl", LDL: "ldl", LDLC: "ldl", LDLCALC: "ldl", LDLDIRECT: "ldl",
};
function analyte(d: Obj): Analyte | undefined {
  const test = obj(d.test);
  if (!test) return undefined;
  const name = str(test.name).toLowerCase();
  const code = str(test.nfm_code).toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (/troponin\s*t\b|urine (?:creatinine|glucose)|(?:creatinine|glucose),?\s*urine|creatinine clearance/.test(name)) return undefined;
  if (code.startsWith("EGFR") || /\be-?gfr\b|estimated glomerular filtration/.test(name)) return "egfr";
  if (analyteCodes[code]) return analyteCodes[code];
  const matches: [RegExp, Analyte][] = [
    [/albumin.{0,15}creatinine.*ratio|urine albumin\/creatinine|microalbumin\/creatinine/, "uacr"],
    [/hemoglobin a1c|ha?b?a1c|glycated hemoglobin/, "a1c"], [/\bcreatinine\b/, "creatinine"],
    [/\bpotassium\b/, "potassium"], [/\bsodium\b/, "sodium"], [/\bchloride\b/, "chloride"],
    [/bicarbonate|carbon dioxide,? total|total (?:co2|carbon dioxide)/, "bicarbonate"],
    [/anion gap/, "anion_gap"], [/urea nitrogen|\bbun\b/, "bun"], [/\bglucose\b/, "glucose"],
    [/platelet/, "platelets"], [/white (?:blood )?cell|leukocyte/, "wbc"], [/\bhemoglobin\b|\bhaemoglobin\b/, "hemoglobin"],
    [/beta.hydroxybutyrate|3.hydroxybutyrate/, "bhb"], [/^(?:blood |venous |arterial )?ph\b|\bph, (?:blood|arterial|venous)/, "ph"],
    [/\bpco2\b|partial pressure of (?:co2|carbon dioxide)/, "pco2"], [/\blipase\b/, "lipase"], [/troponin i\b/, "troponin"],
    [/triglyceride/, "triglycerides"], [/\bhdl\b|high.density lipoprotein/, "hdl"], [/\bldl\b|low.density lipoprotein/, "ldl"], [/total cholesterol|cholesterol,? total|^cholesterol$/, "cholesterol"],
  ];
  return matches.find(([pattern]) => pattern.test(name))?.[1];
}
function numericValue(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const m = str(v).trim().replace(/^≤/, "<=").replace(/^≥/, ">=").match(/^(<=|>=|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/);
  if (!m || !Number.isFinite(Number(m[2]))) return undefined;
  const result: { value: number; comparator?: LabResultRow["comparator"] } = { value: Number(m[2]) };
  if (m[1]) result.comparator = m[1] as LabResultRow["comparator"];
  return result;
}
const unitKey = (s: string): string => s.toLowerCase().replace(/[µμ]/g, "u").replace(/\s/g, "").replace(/\^/g, "*").replace(/²/g, "2");
function convert(a: Analyte, value: number, rawUnit: unknown): number | undefined {
  const u = unitKey(str(rawUnit));
  if (u === unitKey(units[a])) return value;
  if (a === "ph" && (u === "" || u === "ph" || u === "1")) return value;
  if (a === "egfr" && ["ml/min/1.73m*2", "ml/min/1.73m2", "ml/min/1.73m^2", "ml/min/1.73sqm"].includes(u)) return value;
  if ((a === "platelets" || a === "wbc")) {
    if (["cells/ul", "cell/ul", "/ul", "cells/mm3", "/mm3"].includes(u)) return value / 1000;
    if (["k/ul", "10*3/ul", "10**3/ul", "10*9/l", "10**9/l", "thousand/ul", "thousands/ul", "x10*3/ul"].includes(u)) return value;
  }
  if (["sodium", "potassium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") return value;
  if (a === "creatinine" && u === "umol/l") return value / 88.4;
  if (a === "glucose" && u === "mmol/l") return value * 18.016;
  if (a === "bun" && u === "mmol/l") return value * 2.801;
  if (["cholesterol", "hdl", "ldl"].includes(a) && u === "mmol/l") return value * 38.67;
  if (a === "triglycerides" && u === "mmol/l") return value * 88.57;
  if (units[a] === "mg/dL" && u === "mg/l") return value / 10;
  if (a === "uacr" && u === "mg/mmol") return value * 8.84;
  if (a === "uacr" && ["ug/mg", "mcg/mg"].includes(u)) return value;
  if (a === "hemoglobin" && u === "g/l") return value / 10;
  if (a === "a1c" && u === "mmol/mol") return value * 0.09148 + 2.152;
  if (a === "bhb" && u === "mg/dl") return value / 10.412;
  if (a === "bhb" && u === "umol/l") return value / 1000;
  if (a === "pco2" && u === "kpa") return value * 7.50061683;
  if (a === "troponin" && ["ng/l", "pg/ml"].includes(u)) return value / 1000;
  if (a === "troponin" && u === "ug/l") return value;
  if (a === "lipase" && u === "iu/l") return value;
  return undefined; // Unknown units must not be relabelled as target units.
}
function equation(d: Obj): LabResultRow["egfr_equation"] {
  const test = obj(d.test), ref = obj(d.external_ref);
  const text = [str(test?.name), str(test?.nfm_code), str(ref?.result_code), str(d.comment)].join(" ");
  if (/\bMDRD\b/i.test(text)) return "mdrd";
  if (/2021|EGFR[-_ ]?(?:EPI[-_]?)?21/i.test(text)) return "ckd-epi-2021";
  if (/2009|EGFR[-_ ]?(?:EPI[-_]?)?09/i.test(text)) return "ckd-epi-2009";
  return "unknown";
}
function raceVariant(d: Obj): "with" | "without" | "unspecified" {
  const test = obj(d.test), ref = obj(d.external_ref);
  // Do not inspect the shared lab comment: it describes both variants.
  const text = [str(test?.name), str(test?.nfm_code), str(ref?.result_code)].join(" ");
  if (/non[- ]?(?:african|black|aa)|without.*race|race[- ]?free|EGFR[-_]?NAA|EGFR09N|2021|EGFR[-_]?21/i.test(text)) return "without";
  if (/african|\bblack\b|EGFR[-_]?AA|EGFR09A/i.test(text)) return "with";
  return "unspecified";
}
function labs(entries: Entry[]): LabResultRow[] {
  type Copy = { entry: Entry; analyte: Analyte; collected: Time; rank: number; specimen: string; equation?: LabResultRow["egfr_equation"]; race: ReturnType<typeof raceVariant> };
  const copies = new Map<string, Copy[]>();
  for (const e of entries) {
    const d = e.data;
    if (d.type !== "imported_result") continue;
    const a = analyte(d), collected = time(d.collected);
    const rank = d.result_status === "C" ? 3 : d.result_status === "F" ? 2 : d.result_status === "P" ? 1 : 0;
    if (!a || !collected?.rfc || !rank) continue;
    const test = obj(d.test), ref = obj(d.external_ref);
    const specimen = str(ref?.accession) ? JSON.stringify([ref?.lab, ref?.accession]) : JSON.stringify([e.item.id, collected.epoch]);
    const component = str(ref?.result_code) || str(test?.nfm_code) || e.id;
    const key = JSON.stringify([specimen, component]);
    const copy: Copy = { entry: e, analyte: a, collected, rank, specimen, race: raceVariant(d) };
    if (a === "egfr") copy.equation = equation(d);
    copies.set(key, [...(copies.get(key) || []), copy]);
  }
  const selected: { copy: Copy; evidence: Evidence }[] = [];
  for (const group of copies.values()) {
    group.sort((a, b) => a.rank - b.rank || (time(a.entry.data.resulted)?.epoch ?? a.entry.item.recorded.epoch) - (time(b.entry.data.resulted)?.epoch ?? b.entry.item.recorded.epoch) || order(a.entry, b.entry));
    selected.push({ copy: group[group.length - 1], evidence: mergeEvidence(...group.map(c => evidence(c.entry))) });
  }
  const result: LabResultRow[] = [];
  for (const { copy: c, evidence: ev } of selected) {
    const d = c.entry.data;
    if (c.analyte === "egfr" && c.race === "with" && selected.some(v => v.copy.analyte === "egfr" && v.copy.specimen === c.specimen && v.copy.equation === c.equation && v.copy.race !== "with")) continue;
    const parsed = numericValue(d.value);
    if (!parsed) continue;
    const comment = str(d.comment);
    if (/^(?:result |test )?(?:invalidated|withdrawn|cancelled|canceled|not performed|entered in error)\b/i.test(comment.trim())) continue;
    const value = convert(c.analyte, parsed.value, d.unit);
    if (value === undefined || !Number.isFinite(value)) continue;
    const row: LabResultRow = { analyte: c.analyte, value, unit: units[c.analyte], collected: c.collected.rfc!, status: c.rank === 1 ? "preliminary" : "final", evidence: ev };
    if (parsed.comparator) row.comparator = parsed.comparator;
    if (c.analyte === "egfr") row.egfr_equation = c.equation || "unknown";
    const loinc = str(obj(d.test)?.loinc);
    if (loinc) row.loinc = loinc;
    result.push(row);
  }
  return result.sort((a, b) => (time(a.collected)?.epoch || 0) - (time(b.collected)?.epoch || 0) || cmp(a.analyte, b.analyte) || cmp(a.egfr_equation || "", b.egfr_equation || "") || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

function bp(v: unknown): [number, number] | undefined {
  const m = str(v).match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (!m || !Number.isFinite(+m[1]) || !Number.isFinite(+m[2])) return undefined;
  return [+m[1], +m[2]];
}
function vitals(entries: Entry[]): VitalRow[] {
  const result: { row: VitalRow; visit: string; epoch: number; hasBP: boolean }[] = [];
  for (const e of entries.filter(e => e.data.type === "vital_set").sort(order)) {
    const t = e.item.effective;
    if (!t?.wall) continue;
    const d = e.data, first = bp(d.bp), repeat = bp(d.bp_repeat);
    const pulse = num(d.pulse_bpm), weight = num(d.weight_lb);
    if (!first && !repeat && pulse === undefined && weight === undefined) continue;
    const row: VitalRow = { setting: "clinic", local_time: t.wall.slice(0, 16), evidence: evidence(e) };
    if (first) [row.systolic_mmhg, row.diastolic_mmhg] = first;
    if (repeat) [row.repeat_systolic_mmhg, row.repeat_diastolic_mmhg] = repeat;
    if (pulse !== undefined) row.pulse_bpm = pulse;
    if (weight !== undefined) row.weight_kg = Math.round(weight * 0.45359237 * 10) / 10;
    const visit = str(d.visit_id);
    const previous = visit ? [...result].reverse().find(v => v.visit === visit && v.row.local_time.slice(0, 10) === row.local_time.slice(0, 10)) : undefined;
    if (previous && ((t.epoch - previous.epoch <= 5 * 60000) || (first && previous.hasBP && previous.row.repeat_systolic_mmhg === undefined))) {
      if (first && !previous.hasBP) {
        previous.row.local_time = row.local_time;
        previous.row.systolic_mmhg = first[0]; previous.row.diastolic_mmhg = first[1]; previous.hasBP = true;
      } else if (first && previous.row.repeat_systolic_mmhg === undefined && !(t.epoch === previous.epoch && first[0] === previous.row.systolic_mmhg && first[1] === previous.row.diastolic_mmhg)) {
        previous.row.repeat_systolic_mmhg = first[0]; previous.row.repeat_diastolic_mmhg = first[1];
      }
      if (repeat) { previous.row.repeat_systolic_mmhg = repeat[0]; previous.row.repeat_diastolic_mmhg = repeat[1]; }
      if (previous.row.pulse_bpm === undefined && pulse !== undefined) previous.row.pulse_bpm = pulse;
      if (previous.row.weight_kg === undefined && row.weight_kg !== undefined) previous.row.weight_kg = row.weight_kg;
      previous.row.evidence = mergeEvidence(previous.row.evidence, row.evidence);
    } else result.push({ row, visit, epoch: t.epoch, hasBP: !!first });
  }
  return result.map(v => v.row).sort((a, b) => cmp(a.local_time, b.local_time) || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  if (typeof asOf !== "string" || !validDate(asOf)) return empty();
  const entries: Entry[] = [];
  for (const item of countingItems(items, asOf)) {
    const payload = obj(item.raw.payload);
    if (!payload) continue;
    for (const id of Object.keys(payload).sort(cmp)) {
      const data = obj(payload[id]);
      if (data) entries.push({ item, id, data });
    }
  }
  entries.sort(order);
  const facts = problemFacts(entries);
  return { medications: medications(entries), problems: problems(facts), allergies: allergies(entries, facts), labs: labs(entries), vitals: vitals(entries) };
}
