import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Evidence, Analyte, Sensitivity,
} from "../in/views/views";

// All interpretation is local to Riverside's documented payload. Unknown shapes are ignored.
type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj | undefined => v !== null && typeof v === "object" && !Array.isArray(v) ? v as Obj : undefined;
const str = (v: unknown): string => typeof v === "string" ? v.trim() : "";
const num = (v: unknown): number | undefined => typeof v === "number" && Number.isFinite(v) ? v : undefined;
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const lookup = <T>(table: Record<string, T>, key: string): T | undefined => Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined;
const norm = (s: string): string => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const uniqueEvidence = (e: Evidence): Evidence => [...new Map(e.map(x => [JSON.stringify([x.item_id, x.entry_id]), x])).values()]
  .sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id || "", b.entry_id || ""));
const timezone = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function wall(ms: number): string {
  const p: Record<string, string> = {};
  for (const x of timezone.formatToParts(new Date(ms))) p[x.type] = x.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}
function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const t = Date.parse(s + "T00:00:00Z");
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === s;
}
type Time = { ms: number; local: string; date: string; rfc: string };
function time(value: unknown): Time | undefined {
  const s = str(value);
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(?::(\d{2})(\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})?$/i.exec(s);
  if (!m || !validDate(m[1]) || +m[2].slice(0, 2) > 23 || +m[2].slice(3) > 59 || +(m[3] || 0) > 59) return undefined;
  const local = `${m[1]}T${m[2]}:${m[3] || "00"}`;
  const base = local + (m[4] || "");
  let ms: number;
  if (m[5]) {
    ms = Date.parse(base + m[5]);
  } else {
    const nominal = Date.parse(base + "Z");
    // Both Chicago offsets are tried. On a repeated autumn hour, choose the first occurrence.
    ms = [5, 6].map(h => nominal + h * 3600000).find(t => wall(t) === local) ?? nominal + 6 * 3600000;
  }
  if (!Number.isFinite(ms)) return undefined;
  const resultLocal = m[5] ? wall(ms) : local;
  const offsetMinutes = Math.round((Date.parse(wall(ms) + "Z") - Math.floor(ms / 1000) * 1000) / 60000);
  const sign = offsetMinutes < 0 ? "-" : "+";
  const offset = sign + String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, "0") + ":" + String(Math.abs(offsetMinutes) % 60).padStart(2, "0");
  return { ms, local: resultLocal, date: resultLocal.slice(0, 10), rfc: resultLocal + (m[4] || "") + offset };
}
function partial(value: unknown): ProblemRow["onset"] {
  const s = str(value);
  if (/^\d{4}$/.test(s)) return { value: s, precision: "year" };
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(s)) return { value: s, precision: "month" };
  if (validDate(s)) return { value: s, precision: "day" };
  const t = time(s);
  if (t) return { value: t.date, precision: "day" };
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const m = /^([a-z]+)\s+(\d{4})$/i.exec(s);
  const index = m ? months.findIndex(x => x === m[1].toLowerCase() || x.slice(0, 3) === m[1].toLowerCase()) : -1;
  return m && index >= 0 ? { value: `${m[2]}-${String(index + 1).padStart(2, "0")}`, precision: "month" } : undefined;
}
interface Doc { item: FolioItem; entries: [string, Obj][]; enc?: Obj; recorded: number; event: number; }
interface Entry { doc: Doc; id: string; data: Obj; }
const evidence = (e: Entry): Evidence => [{ item_id: e.doc.item.id, entry_id: e.id }];
const orderDoc = (a: Doc, b: Doc): number => a.event - b.event || a.recorded - b.recorded || cmp(a.item.id, b.item.id);
const orderSigned = (a: Doc, b: Doc): number => a.recorded - b.recorded || orderDoc(a, b);
const orderEntry = (a: Entry, b: Entry): number => orderDoc(a.doc, b.doc) || cmp(a.id, b.id);
const entriesOf = (d: Doc, type: string): Entry[] => d.entries.filter(([, e]) => e.type === type).map(([id, data]) => ({ doc: d, id, data }));
function documents(input: FolioItem[], asOf: string): Doc[] {
  if (!Array.isArray(input) || !validDate(asOf)) return [];
  const eligible = new Map<string, Doc>();
  for (const raw of input) {
    const i = obj(raw);
    if (!i || !str(i.id) || !str(i.issuer)) continue;
    const recorded = time(i.recorded);
    if (!recorded || recorded.date > asOf) continue;
    const payload = obj(i.payload);
    const entries: [string, Obj][] = [];
    for (const key of Object.keys(payload || {}).sort(cmp)) {
      const entry = obj(payload![key]);
      if (entry) entries.push([key, entry]);
    }
    const enc = entries.find(([, e]) => e.type === "encounter")?.[1];
    const event = (enc?.document_kind === "discharge_summary" ? time(enc.discharged) || time(i.effective_end) : undefined)
      || time(i.effective);
    const dateEvent = partial(i.effective)?.value;
    const eventDate = dateEvent?.length === 4 ? dateEvent + "-01-01" : dateEvent?.length === 7 ? dateEvent + "-01" : dateEvent;
    const eventMs = event?.ms ?? (eventDate ? Date.parse(eventDate + "T12:00:00Z") : recorded.ms);
    const d: Doc = { item: raw, entries, enc, recorded: recorded.ms, event: Number.isFinite(eventMs) ? eventMs : recorded.ms };
    eligible.set(JSON.stringify([i.issuer, i.id]), d);
  }
  const keyOf = (d: Doc, id: string) => JSON.stringify([d.item.issuer, id]);
  const blockers = new Map<string, Set<string>>();
  const links = (v: unknown): string[] => Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
  for (const [key, d] of eligible) {
    const targets = new Set<string>();
    const pending = links(d.item.supersedes).map(id => keyOf(d, id));
    while (pending.length) {
      const target = pending.pop()!;
      if (target === key || targets.has(target)) continue;
      targets.add(target);
      const prior = eligible.get(target);
      if (prior) pending.push(...links(prior.item.supersedes).map(id => keyOf(prior, id)));
    }
    for (const id of links(d.item.retracts)) targets.add(keyOf(d, id));
    for (const target of targets) {
      if (target === key) continue;
      if (!blockers.has(target)) blockers.set(target, new Set());
      blockers.get(target)!.add(key);
    }
  }
  const active = new Map<string, boolean>();
  const visiting = new Set<string>();
  function counts(key: string): boolean {
    if (active.has(key)) return active.get(key)!;
    if (visiting.has(key)) return false; // Malformed cycles cannot recurse forever.
    visiting.add(key);
    const result = ![...(blockers.get(key) || [])].sort(cmp).some(counts);
    visiting.delete(key);
    active.set(key, result);
    return result;
  }
  return [...eligible.keys()].sort(cmp).filter(counts).map(k => eligible.get(k)!).sort(orderDoc);
}

const brands: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", fortamet: "metformin", glumetza: "metformin", cozaar: "losartan", prinivil: "lisinopril", zestril: "lisinopril",
  microzide: "hydrochlorothiazide", lipitor: "atorvastatin", crestor: "rosuvastatin", norvasc: "amlodipine",
  keflex: "cephalexin", amoxil: "amoxicillin", ventolin: "albuterol", proair: "albuterol", proventil: "albuterol",
  pepcid: "famotidine", zyrtec: "cetirizine", claritin: "loratadine", benadryl: "diphenhydramine",
  aleve: "naproxen", naprosyn: "naproxen", advil: "ibuprofen", motrin: "ibuprofen", tylenol: "acetaminophen",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  humalog: "insulin lispro", novolog: "insulin aspart", tresiba: "insulin degludec",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", seroquel: "quetiapine",
  depakote: "valproic acid", wellbutrin: "bupropion", eliquis: "apixaban", xarelto: "rivaroxaban",
  synthroid: "levothyroxine", lasix: "furosemide", lopressor: "metoprolol", toprol: "metoprolol",
};
function ingredient(name: string): string {
  let n = name.toLowerCase().trim();
  const words = norm(n).split(" ");
  const generic = lookup(brands, words[0]);
  if (generic) return generic;
  // Strengths and concentrations start the product description, not the ingredient name.
  n = n.replace(/\s+\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)*\s*(?:mg|mcg|[µμ]g|g|units?|iu|u|ml|%).*$/i, "");
  n = n.replace(/\([^)]*\)/g, " ").replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|µg|μg|g|units?|iu|u|ml|%)(?=\b|\/)/gi, " ")
    .replace(/\b(?:hydrochloride|hcl|trihydrate|dihydrate|monohydrate|succinate|tartrate|besylate|maleate|fumarate|sulfate)\b/g, " ")
    .replace(/\b(?:tablets?|tabs?|capsules?|caps?|solution|suspension|inhaler|injection|injectable|cream|ointment|patch|oral|chewable|extended.release|delayed.release|immediate.release|er|xr|sr|xl|dr|hfa|usp)\b.*$/g, " ")
    .replace(/\b(?:potassium|sodium)\b$/, match => /^(?:losartan|diclofenac|naproxen|levothyroxine)\b/.test(n) ? "" : match)
    .replace(/\s+/g, " ").replace(/^[\s,/-]+|[\s,/-]+$/g, "");
  return n;
}
const drugKey = (e: Obj): string => str(e.rxnorm_ingredient) ? "rx:" + str(e.rxnorm_ingredient) : "name:" + ingredient(str(e.drug_name || e.substance));
function sensitivities(text: string, code = ""): Sensitivity[] | undefined {
  const found: Sensitivity[] = [];
  if (/\b(bipolar|depress(?:ion|ive)|anxiety|schizophren\w*|psychosis|psychotic|ptsd|adhd|suicid\w*|quetiapine|sertraline|fluoxetine|escitalopram|olanzapine|risperidone|aripiprazole)\b/i.test(text) || /^F(?:2|3|4|6|9)/i.test(code)) found.push("mental-health");
  if (/\b(substance use|alcohol (?:use disorder|dependence|abuse|withdrawal)|opioid (?:use disorder|dependence|abuse|withdrawal)|cocaine|heroin|buprenorphine|tobacco (?:use|dependence))\b/i.test(text) || /^F1/i.test(code)) found.push("substance-use");
  if (/\b(pregnan\w*|contracepti\w*|infertility|fertility|gestational|erectile dysfunction|endometriosis|norethindrone|ethinyl estradiol)\b/i.test(text) || /^(?:O\d|Z3[234])/.test(code)) found.push("sexual-reproductive-health");
  if (/\b(hiv|aids|chlamydia|gonorrh\w*|syphilis|genital herpes|antiretroviral|bictegravir|dolutegravir)\b/i.test(text) || /^(?:B2[0-4]|A5[0-9]|A6[0-4])/.test(code)) found.push("hiv-sti");
  if (/\b(brca[12]?|cystic fibrosis|sickle cell|huntington\w*|thalassemia|genetic|hereditary|inherited)\b/i.test(text)) found.push("genetic");
  return found.length ? found : undefined;
}
const dosePattern = /(-?\d+(?:\.\d+)?|\.\d+)\s*(milligrams?|mg|micrograms?|mcg|[µμ]g|grams?|g|units?|i\.?u\.?|u|millilit(?:er|re)s?|ml|cc|tablets?|tabs?|puffs?|capsules?)\b/i;
function amount(s: string): { value: number; unit: string } | undefined {
  const normalized = s.replace(/\b\d{1,3}(?:,\d{3})+\b/g, x => x.replace(/,/g, ""))
    .replace(/\b(\d+)\s+(\d+)\s*\/\s*(\d+)\b/g, (_, whole, top, bottom) => +bottom ? String(+whole + +top / +bottom) : "invalid")
    .replace(/\b(\d+)\s*\/\s*(\d+)\b/g, (_, top, bottom) => +bottom ? String(+top / +bottom) : "invalid")
    .replace(/½/g, "0.5").replace(/¼/g, "0.25").replace(/¾/g, "0.75");
  const m = dosePattern.exec(normalized);
  if (!m || !Number.isFinite(+m[1]) || +m[1] < 0) return undefined;
  let unit = m[2].toLowerCase(), value = +m[1];
  if (/^(mg|milligram)/.test(unit)) unit = "mg";
  else if (/^(mcg|[µμ]g|microgram)/.test(unit)) unit = "mcg";
  else if (/^(g|gram)$/.test(unit) || /^grams/.test(unit)) { unit = "mg"; value *= 1000; }
  else if (/^(u|iu|i\.)/.test(unit)) unit = "units";
  else if (/^(ml|cc|millilit)/.test(unit)) unit = "mL";
  else if (/^tab/.test(unit)) unit = "tablet";
  else if (/^puff/.test(unit)) unit = "puff";
  else if (/^capsule/.test(unit)) unit = "capsule";
  return { value, unit };
}
function dose(e: Obj): MedicationRow["dose"] {
  const d = str(e.dose_text), sig = str(e.sig), all = d + " " + sig;
  if (/\b(sliding scale|per protocol|taper|depending|based on|adjust|titrate|otherwise|else)\b|\d\s*(?:-|–|—|to|or)\s*\d/i.test(all) || /\/(?:kg|h(?:r)?|day)\b/i.test(d)) return undefined;
  if (/\bif\b/i.test(all) && (all.match(new RegExp(dosePattern.source, "gi")) || []).length > 2) return undefined;
  const a = amount(d);
  // dose_text is already the amount per administration; never multiply a mass here by sig's tab count.
  if (a && ["mg", "mcg", "units", "mL"].includes(a.unit)) return a as MedicationRow["dose"];
  const direct = amount(sig);
  if (direct && ["mg", "mcg", "units", "mL"].includes(direct.unit)) return direct as MedicationRow["dose"];
  const count = a || direct;
  if (/\d+\s*\/\s*\d+(?:\.\d+)?\s*(?:mg|mcg|g)\b/i.test(str(e.drug_name))) return undefined;
  const strength = amount(str(e.drug_name));
  if (strength && ["mg", "mcg", "units"].includes(strength.unit) && (sig || count)) {
    if (count && ["tablet", "puff", "capsule"].includes(count.unit)) return { value: strength.value * count.value, unit: strength.unit as "mg" | "mcg" | "units" };
    if (!count && frequency(sig)) return strength as MedicationRow["dose"];
  }
  return count?.unit === "tablet" ? { value: count.value, unit: "tablet" } : undefined;
}
function frequency(sig: string): MedicationRow["frequency"] {
  const s = sig.toLowerCase().replace(/\./g, "");
  if (/\b(prn|as needed|when needed)\b/.test(s)) return "PRN";
  if (/\b(?:twice|three times|four times|\d+ times)\s+(?:(?:a|per|each)\s+)?(?:week|weekly|month|monthly)\b/.test(s)) return "other";
  if (/\b(qid|four times|every other|qod|monthly|taper|every 6 hours|q6h)\b|\b(?:each|every)\s+(?:mon|tues|wednes|thurs|fri|satur|sun)day\s+(?:and|,)/.test(s)) return "other";
  if (/\b(bid|twice|two times|q12h|every (?:12|twelve) hours)\b/.test(s)) return "BID";
  if (/\b(tid|three times|q8h|every (?:8|eight) hours)\b/.test(s)) return "TID";
  if (/\b(qhs|bedtime|nightly|at night)\b/.test(s)) return "QHS";
  if (/\b(qw|qweek|weekly|once a week|once per week|every 7 days|every (?:mon|tues|wednes|thurs|fri|satur|sun)day)\b/.test(s)) return "QW";
  if (/\b(qd|daily|once a day|once per day|every day|q24h|every 24 hours|each morning|every morning|in the (?:morning|evening))\b/.test(s)) return "QD";
  if (/\b(every|times|weekly|monthly|hour|hours|q\d+h|qod)\b/.test(s)) return "other";
  return undefined;
}
function stopReason(s: string): MedicationRow["stop_reason"] {
  if (/\b(adverse|reaction|side effect|intoleran\w*|rash|cough|angioedema|ketoacidosis|dka|hypoglyc\w*|pancreatitis|kidney injury|hepatotoxic\w*)\b/i.test(s)) return "adverse_reaction";
  if (/ineffective|did not work|not (?:working|effective)|lack of (?:effect|benefit)/i.test(s)) return "ineffective";
  if (/replac|switch|changed (?:to|therapy)|alternative regimen/i.test(s)) return "therapy_changed";
  if (/course (?:is )?(?:complete|finished)|completed (?:the )?(?:course|therapy)|finished course/i.test(s)) return "course_complete";
  if (/patient (?:choice|request|declin|prefer|decid)|self.discontinu/i.test(s)) return "patient_choice";
  return /\b(because|due to|owing to|for|no longer needed)\b/i.test(s) ? "other" : undefined;
}
function medicationRows(docs: Doc[]): MedicationRow[] {
  // Each stay contributes one full snapshot; a discharge summary is its final outpatient instruction.
  const stays = new Map<string, Doc[]>();
  for (const d of docs) {
    if (!d.enc) continue;
    const key = str(d.enc.encounter_id) || d.item.id;
    stays.set(key, [...(stays.get(key) || []), d]);
  }
  const snapshots: Doc[] = [];
  for (const group of stays.values()) {
    const discharge = group.filter(d => d.enc?.document_kind === "discharge_summary").sort(orderSigned);
    snapshots.push(discharge.at(-1) || group.sort(orderSigned).at(-1)!);
  }
  const current = snapshots.sort(orderDoc).at(-1);
  if (!current) return [];
  const byDrug = new Map<string, Entry>();
  const currentMeds = entriesOf(current, "home_med").filter(e => str(e.data.drug_name));
  const nameCodes = new Map<string, Set<string>>();
  for (const e of currentMeds) if (str(e.data.rxnorm_ingredient)) {
    const name = ingredient(str(e.data.drug_name));
    if (!nameCodes.has(name)) nameCodes.set(name, new Set());
    nameCodes.get(name)!.add(str(e.data.rxnorm_ingredient));
  }
  for (const e of currentMeds) {
    const codes = nameCodes.get(ingredient(str(e.data.drug_name)));
    const key = !str(e.data.rxnorm_ingredient) && codes?.size === 1 ? "rx:" + [...codes][0] : drugKey(e.data);
    byDrug.set(key, e);
  }
  const result: MedicationRow[] = [];
  for (const e of byDrug.values()) {
    const x = e.data;
    const status = lookup<MedicationRow["status"]>({ continue: "active", new: "active", changed: "active", held: "held", stopped: "stopped", not_reconciled: "unknown" }, str(x.status));
    if (!status) continue;
    const row: MedicationRow = { drug_name: str(x.drug_name), ingredient: ingredient(str(x.drug_name)) || undefined,
      rxnorm_ingredient: str(x.rxnorm_ingredient) || undefined, status, dose: dose(x), frequency: frequency(str(x.sig)),
      patient_reported: false, status_reason_text: str(x.instructions) || undefined,
      stop_reason: status === "stopped" ? stopReason(str(x.instructions)) : undefined,
      sensitivity: sensitivities(str(x.drug_name) + " " + str(x.instructions)), evidence: evidence(e) };
    // A continuation snapshot does not reveal when an already-active medicine originally began.
    // Follow the same ingredient AND dose through this stay to find a documented transition.
    const history = docs.filter(d => str(d.enc?.encounter_id) === str(current.enc?.encounter_id) && orderSigned(d, current) <= 0)
      .flatMap(d => entriesOf(d, "home_med")).filter(p => drugKey(p.data) === drugKey(x) && str(p.data.dose_text) === str(x.dose_text))
      .sort((a, b) => orderSigned(a.doc, b.doc) || cmp(a.id, b.id));
    let first = history.length - 1;
    const activeStatus = (s: unknown) => ["continue", "new", "changed"].includes(str(s));
    while (first > 0 && (status === "active" ? activeStatus(history[first - 1].data.status) : history[first - 1].data.status === x.status)) first--;
    const start = status === "active" ? history.slice(first).find(p => p.data.status === "new" || p.data.status === "changed") || history[first] : history[first];
    if (status !== "unknown" && start && (status === "held" || status === "stopped" || x.status === "new" || x.status === "changed" ||
      start.data.status === "new" || start.data.status === "changed" ||
      (first > 0 && ["held", "stopped"].includes(str(history[first - 1].data.status))))) {
      row.status_since = (start.doc.enc?.document_kind === "discharge_summary" ? time(start.doc.enc.discharged) || time(start.doc.item.effective_end) : time(start.doc.item.effective))?.date;
      row.evidence = uniqueEvidence([...row.evidence, ...evidence(start)]);
    }
    if (/\b(otc|over.the.counter|without (?:a )?prescription)\b/i.test(str(x.instructions) + " " + str(x.drug_name))) row.otc = true;
    result.push(row);
  }
  return result.sort((a, b) => cmp(a.ingredient || a.drug_name, b.ingredient || b.drug_name));
}

const labUnits: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const localAnalytes: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", CR: "creatinine", EGFR: "egfr", GFR: "egfr",
  K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate", BICARB: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c",
  UACR: "uacr", MALBCR: "uacr", PLT: "platelets", PLATELETS: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", BOHB: "bhb", PH: "ph", VPH: "ph", APH: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2",
  LIPASE: "lipase", LIP: "lipase", TNI: "troponin", TROPONINI: "troponin", TROPONIN_I: "troponin",
  CHOL: "cholesterol", TC: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};
const loincAnalytes: Record<string, Analyte> = {
  "2160-0": "creatinine", "98979-8": "egfr", "33914-3": "egfr", "62238-1": "egfr", "48642-3": "egfr",
  "2823-3": "potassium", "2951-2": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate",
  "33037-3": "anion_gap", "10466-1": "anion_gap", "3094-0": "bun", "2345-7": "glucose", "4548-4": "a1c",
  "17856-6": "a1c", "59261-8": "a1c", "9318-7": "uacr", "14959-1": "uacr", "777-3": "platelets",
  "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "27369-2": "bhb",
  "2746-6": "ph", "2744-1": "ph", "11558-4": "ph", "2021-4": "pco2", "2019-8": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl",
};
function analyteFor(test: Obj, specimen: string): Analyte | undefined {
  const name = str(test.name), local = str(test.local_code).toUpperCase();
  // Do not mistake urine creatinine, total ketones, or troponin T for target analytes.
  if (/troponin\s*[- ]?t\b/i.test(name) || (/creatinine/i.test(name) && !/ratio|albumin/i.test(name) && /urine/i.test(specimen + " " + name))) return undefined;
  const coded = lookup(loincAnalytes, str(test.loinc));
  if (coded) return coded;
  if (/\b(?:egfr|estimated glomerular filtration rate)\b/i.test(name)) return "egfr";
  if (/(?:albumin.*creatinine|microalbumin.*creatinine).*ratio|\buacr\b/i.test(name)) return "uacr";
  if (/\bcreatinine\b/i.test(name)) return "creatinine";
  if (/\bhemoglobin\s*a1c\b|\bhba1c\b|\ba1c\b/i.test(name)) return "a1c";
  if (/\bhemoglobin\b/i.test(name) && !/urine|free|glycat|fraction/i.test(name)) return "hemoglobin";
  if (/\bplatelet(?:s| count)?\b/i.test(name)) return "platelets";
  if (/white blood cell|leukocytes?(?: count)?|\bwbc\b/i.test(name)) return "wbc";
  if (/beta.?hydroxybutyrate|β.?hydroxybutyrate|3.?hydroxybutyrate/i.test(name)) return "bhb";
  if (/partial pressure.*co2|\bpco2\b/i.test(name)) return "pco2";
  if (/^ph(?:\b|,)/i.test(name)) return "ph";
  if (/bicarbonate|total co2|carbon dioxide.*total|^carbon dioxide$/i.test(name)) return "bicarbonate";
  if (/anion gap/i.test(name)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/i.test(name)) return "bun";
  if (/troponin\s*[- ]?i\b/i.test(name)) return "troponin";
  if (/\b(?:hdl|high.density lipoprotein)\b/i.test(name)) return "hdl";
  if (/\b(?:ldl|low.density lipoprotein)\b/i.test(name)) return "ldl";
  if (/triglyceride/i.test(name)) return "triglycerides";
  if (/cholesterol/i.test(name) && !/ratio|non.hdl/i.test(name)) return "cholesterol";
  for (const a of ["potassium", "sodium", "chloride", "glucose", "lipase"] as const) if (new RegExp("\\b" + a + "\\b", "i").test(name)) return a;
  // A local dictionary code is a fallback only if its display name is absent or just the abbreviation.
  return !name || norm(name) === norm(local) ? lookup(localAnalytes, local) : undefined;
}
function numericResult(value: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof value !== "string") return undefined;
  const s = value.trim().replace(/≤/g, "<=").replace(/≥/g, ">=")
    .replace(/\b\d{1,3}(?:,\d{3})+(?=\b|\.)/g, x => x.replace(/,/g, ""));
  const m = /^(<=|>=|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(s);
  if (!m || !Number.isFinite(+m[2])) return undefined;
  return { value: +m[2], comparator: (m[1] || undefined) as LabResultRow["comparator"] };
}
const unitKey = (s: string): string => s.toLowerCase().replace(/[µμ]/g, "u").replace(/\s+/g, "").replace(/\^/g, "*").replace(/²/g, "2");
function labValue(a: Analyte, value: number, unit: string): number | undefined {
  const u = unitKey(unit), target = unitKey(labUnits[a]);
  if (u === target || (a === "ph" && ["", "1", "ph"].includes(u))) return value;
  let factor: number | undefined;
  if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") factor = 1;
  if (a === "creatinine" && u === "umol/l") factor = 1 / 88.4;
  if (a === "glucose" && u === "mmol/l") factor = 18.016;
  if (a === "bun" && u === "mmol/l") factor = 2.801;
  if (["cholesterol", "hdl", "ldl"].includes(a) && u === "mmol/l") factor = 38.67;
  if (a === "triglycerides" && u === "mmol/l") factor = 88.57;
  if (a === "bhb" && u === "mg/dl") factor = 1 / 10.412;
  if (a === "hemoglobin" && u === "g/l") factor = 0.1;
  if (a === "uacr" && ["ug/mg", "mcg/mg"].includes(u)) factor = 1;
  if (a === "uacr" && u === "mg/mmol") factor = 8.84;
  if (a === "pco2" && u === "kpa") factor = 7.50062;
  if (a === "lipase" && u === "iu/l") factor = 1;
  if (a === "lipase" && u === "ukat/l") factor = 60;
  if (a === "troponin" && ["ng/l", "pg/ml"].includes(u)) factor = 0.001;
  if (a === "troponin" && u === "ug/l") factor = 1;
  if (["wbc", "platelets"].includes(a)) {
    if (["10*9/l", "x10*9/l", "10e9/l", "k/ul", "thousand/ul", "thousands/ul", "10³/ul"].includes(u)) factor = 1;
    if (["/ul", "1/ul", "cells/ul", "cells/mm3", "/mm3"].includes(u)) factor = 0.001;
  }
  if (a === "egfr" && ["ml/min/1.73m2", "ml/min/1.73m*2"].includes(u)) factor = 1;
  if (a === "a1c" && u === "mmol/mol") return Number((value * 0.09148 + 2.152).toPrecision(12));
  if (target === "mg/dl" && u === "mg/l") factor = 0.1;
  if (factor === undefined) return undefined;
  const converted = value * factor;
  return Number.isFinite(converted) ? Number(converted.toPrecision(12)) : undefined;
}
interface LabCopy { e: Entry; value: Obj; test: Obj; accession: string; collected: Time; rank: number; }
function laboratoryRows(docs: Doc[]): LabResultRow[] {
  const copies = new Map<string, LabCopy[]>();
  for (const d of docs) for (const [id, data] of d.entries) {
    if (data.type !== "result" && data.type !== "panel") continue;
    const rank = lookup({ preliminary: 1, final: 2, corrected: 3 }, str(data.status));
    const collected = time(data.collected), accession = str(data.accession);
    if (!rank || !collected || !accession) continue;
    const values = data.type === "panel" ? (Array.isArray(data.components) ? data.components : []) : [data];
    for (const v of values) {
      const value = obj(v), test = obj(value?.test);
      if (!value || !test || !str(test.local_code)) continue;
      const key = JSON.stringify([d.item.issuer, accession, str(test.local_code)]);
      const copy: LabCopy = { e: { doc: d, id, data }, value, test, accession, collected, rank };
      copies.set(key, [...(copies.get(key) || []), copy]);
    }
  }
  const winners = [...copies.entries()].map(([key, list]) => {
    list.sort((a, b) => a.rank - b.rank || a.e.doc.recorded - b.e.doc.recorded || orderEntry(a.e, b.e));
    return { key, list, chosen: list.at(-1)! };
  });
  const result: { row: LabResultRow; key: string; ms: number }[] = [];
  for (const { key, list, chosen: c } of winners) {
    const a = analyteFor(c.test, str(c.e.data.specimen));
    if (!a) continue;
    const testText = str(c.test.name) + " " + str(c.test.local_code);
    const raceAdjusted = (s: string) => /african|\bblack\b|\baa\b/i.test(s) && !/non.?african|non.?black|without|race.free/i.test(s);
    if (a === "egfr" && raceAdjusted(testText) && winners.some(({ chosen: other }) => other.accession === c.accession &&
      analyteFor(other.test, str(other.e.data.specimen)) === "egfr" && !raceAdjusted(str(other.test.name) + " " + str(other.test.local_code)))) continue;
    // Pick the authoritative copy before parsing: a corrected nonnumeric result must not revive an old numeric value.
    const parsed = numericResult(c.value.value);
    if (!parsed) continue;
    const value = labValue(a, parsed.value, str(c.value.unit));
    if (value === undefined) continue;
    let equation: LabResultRow["egfr_equation"];
    if (a === "egfr") {
      equation = /mdrd/i.test(testText) ? "mdrd" : /2009/i.test(testText) ? "ckd-epi-2009" :
        /2021/i.test(testText) || c.collected.date >= "2023-01-01" ? "ckd-epi-2021" : "unknown";
    }
    result.push({ key, ms: c.collected.ms, row: { analyte: a, value, comparator: parsed.comparator, unit: labUnits[a],
      collected: c.collected.rfc, status: c.rank === 1 ? "preliminary" : "final", egfr_equation: equation,
      loinc: str(c.test.loinc) || undefined, evidence: uniqueEvidence(list.flatMap(x => evidence(x.e))) } });
  }
  return result.sort((a, b) => a.ms - b.ms || cmp(a.row.analyte, b.row.analyte) || cmp(a.key, b.key)).map(x => x.row);
}

interface VitalSet { row: VitalRow; ms: number; encounter: string; itemIds: Set<string>; }
function vitalRows(docs: Doc[]): VitalRow[] {
  const sets = new Map<string, VitalSet>();
  for (const d of docs) for (const e of entriesOf(d, "vitals")) {
    const t = time(e.data.taken);
    if (!t) continue;
    const bp = obj(e.data.bp), systolic = num(bp?.systolic_mmhg), diastolic = num(bp?.diastolic_mmhg);
    const pulse = num(e.data.heart_rate_bpm), weight = num(e.data.weight_kg);
    if ([systolic, diastolic, pulse, weight].every(x => x === undefined)) continue;
    const encounter = str(d.enc?.encounter_id) || d.item.id;
    const key = JSON.stringify([encounter, t.ms]);
    const prior = sets.get(key);
    const row: VitalRow = prior?.row || { setting: "hospital", local_time: t.local.slice(0, 16), evidence: [] };
    if (systolic !== undefined) row.systolic_mmhg = systolic;
    if (diastolic !== undefined) row.diastolic_mmhg = diastolic;
    if (pulse !== undefined) row.pulse_bpm = pulse;
    if (weight !== undefined) row.weight_kg = Math.round(weight * 10) / 10;
    row.evidence = uniqueEvidence([...row.evidence, ...evidence(e)]);
    const itemIds = prior?.itemIds || new Set<string>();
    itemIds.add(d.item.id);
    sets.set(key, { row, ms: t.ms, encounter, itemIds });
  }
  const groups: VitalSet[] = [];
  for (const s of [...sets.values()].sort((a, b) => a.ms - b.ms || cmp(a.encounter, b.encounter))) {
    const g = [...groups].reverse().find(x => x.encounter === s.encounter);
    const bpOnly = s.row.pulse_bpm === undefined && s.row.weight_kg === undefined;
    const sameNote = g && [...s.itemIds].some(id => g.itemIds.has(id));
    const near = g && s.ms - g.ms <= 5 * 60000;
    const repeat = g && bpOnly && sameNote && s.row.local_time.slice(0, 10) === g.row.local_time.slice(0, 10);
    if (g && (near || repeat) && g.row.repeat_systolic_mmhg === undefined && g.row.repeat_diastolic_mmhg === undefined) {
      const hasBP = g.row.systolic_mmhg !== undefined || g.row.diastolic_mmhg !== undefined;
      const incomingBP = s.row.systolic_mmhg !== undefined || s.row.diastolic_mmhg !== undefined;
      if (hasBP && incomingBP) {
        g.row.repeat_systolic_mmhg = s.row.systolic_mmhg;
        g.row.repeat_diastolic_mmhg = s.row.diastolic_mmhg;
      } else if (incomingBP) {
        g.row.systolic_mmhg = s.row.systolic_mmhg;
        g.row.diastolic_mmhg = s.row.diastolic_mmhg;
        g.row.local_time = s.row.local_time;
      }
      g.row.pulse_bpm ??= s.row.pulse_bpm;
      g.row.weight_kg ??= s.row.weight_kg;
      g.row.evidence = uniqueEvidence([...g.row.evidence, ...s.row.evidence]);
      for (const id of s.itemIds) g.itemIds.add(id);
    } else groups.push(s);
  }
  return groups.map(x => x.row);
}

const conditionText = (e: Entry): string => str(e.data.type === "history" ? e.data.condition : e.data.label);
const localDiagnosis = (e: Entry): string => str(obj(e.data.riverside_dx)?.code);
const fullDiagnosis = (e: Entry): string => conditionText(e) + " " + str(obj(e.data.riverside_dx)?.name);
function conditionName(e: Entry): string {
  let n = norm(conditionText(e)).replace(/^(?:r o|rule out|possible|suspected|history of|hx of)\s+/, "");
  if (/\b(?:ckd|chronic kidney disease|chronic renal (?:disease|insufficiency))\b/.test(n) || /^N18\./i.test(str(e.data.icd10cm))) return "chronic kidney disease";
  if (/\b(?:aki|acute kidney injury|acute renal failure)\b/.test(n)) return "acute kidney injury";
  if (/\b(?:dka|diabetic ketoacidosis)\b/.test(n)) return /euglyc/.test(n) ? "euglycemic diabetic ketoacidosis" : "diabetic ketoacidosis";
  if (/^(?:essential |primary )?hypertension$/.test(n) || n === "htn") return "hypertension";
  if (/\basthma\b/.test(n) || /^J45\./i.test(str(e.data.icd10cm))) return "asthma";
  if (/\b(?:copd|chronic obstructive pulmonary disease)\b/.test(n)) return "chronic obstructive pulmonary disease";
  if (/^(?:type 2 diabetes(?: mellitus)?|diabetes mellitus type 2|t2dm)(?: without complications)?$/.test(n)) return "type 2 diabetes mellitus";
  n = n.replace(/\b(?:resolved|active|historical)\b/g, "").replace(/\s+/g, " ").trim();
  return n;
}
function conditionGroups(docs: Doc[]): Entry[][] {
  const all = docs.flatMap(d => [...entriesOf(d, "diagnosis"), ...entriesOf(d, "history")]).filter(e => conditionText(e));
  const codes = new Map<string, Set<string>>(), names = new Map<string, Set<string>>();
  const add = (map: Map<string, Set<string>>, key: string, value: string) => {
    if (!key) return;
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(value);
  };
  for (const e of all) if (localDiagnosis(e)) {
    add(codes, str(e.data.icd10cm), localDiagnosis(e));
    add(names, conditionName(e), localDiagnosis(e));
  }
  const codedNames = new Map<string, Set<string>>();
  for (const e of all) if (str(e.data.icd10cm)) add(codedNames, conditionName(e), str(e.data.icd10cm));
  const groups = new Map<string, Entry[]>();
  for (const e of all) {
    const name = conditionName(e), code = str(e.data.icd10cm);
    const byName = names.get(name), byCode = codes.get(code);
    const local = localDiagnosis(e) || (byName?.size === 1 ? [...byName][0] : byCode?.size === 1 ? [...byCode][0] : "");
    const nameCodes = codedNames.get(name);
    const inferredCode = nameCodes?.size === 1 ? [...nameCodes][0] : "";
    const key = name === "chronic kidney disease" ? name : local ? "local:" + local : (nameCodes?.size || 0) > 1 ? "name:" + name :
      code || inferredCode ? "icd:" + (code || inferredCode) : "name:" + name;
    groups.set(key, [...(groups.get(key) || []), e]);
  }
  return [...groups.values()].map(g => g.sort(orderEntry));
}
function assertions(group: Entry[]): Entry[] {
  const encounters = new Map<string, Entry[]>();
  for (const e of group.filter(x => x.data.type === "diagnosis")) {
    const key = str(e.doc.enc?.encounter_id) || e.doc.item.id;
    encounters.set(key, [...(encounters.get(key) || []), e]);
  }
  const accepted: Entry[] = [];
  for (const entries of encounters.values()) {
    entries.sort((a, b) => orderSigned(a.doc, b.doc) || cmp(a.id, b.id));
    // Ruled-out workups are not a disease. A later recurrence in a different stay does not erase a prior confirmed episode.
    const last = entries.at(-1)!;
    if (last.data.status === "ruled_out") continue;
    const established = entries.filter(e => e.data.status === "active" || e.data.status === "resolved");
    accepted.push(...established);
  }
  return accepted.sort((a, b) => str(a.doc.enc?.encounter_id) && a.doc.enc?.encounter_id === b.doc.enc?.encounter_id ?
    orderSigned(a.doc, b.doc) || cmp(a.id, b.id) : orderEntry(a, b));
}
function ckdStage(e: Entry): ProblemRow["ckd_stage"] {
  const text = fullDiagnosis(e);
  const codeStage: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
  const m = /\b(?:stage\s*|g)([1-5](?:[ab])?)(?=\b|A[123]\b)/i.exec(text);
  const stage = m?.[1].toLowerCase();
  if (stage && ["1", "2", "3a", "3b", "4", "5"].includes(stage)) return ("G" + stage) as ProblemRow["ckd_stage"];
  return lookup(codeStage, str(e.data.icd10cm).toUpperCase());
}
function adverseOnly(e: Entry): boolean {
  const label = conditionText(e);
  if (/\b(?:causing|manifesting as|with resultant)\b/i.test(label)) return false;
  return /^(?:adverse (?:effect|reaction)(?: of| to)?|drug (?:adverse (?:effect|reaction)|reaction|allergy|intolerance))\b/i.test(label);
}
function problemRows(groups: Entry[][]): ProblemRow[] {
  const result: ProblemRow[] = [];
  for (const group of groups) {
    const confirmed = assertions(group);
    const history = group.filter(e => e.data.type === "history");
    const ruledOut = !confirmed.length && group.some(e => e.data.type === "diagnosis" && e.data.status === "ruled_out");
    const e = confirmed.at(-1) || (!ruledOut ? history.at(-1) : undefined);
    if (!e || adverseOnly(e)) continue;
    const row: ProblemRow = { condition: conditionText(e), icd10cm: str(e.data.icd10cm) || undefined,
      status: e.data.status === "resolved" || (e.data.type === "history" && /\b(resolved|history of|historical)\b/i.test(conditionText(e))) ? "resolved" : "active",
      sensitivity: sensitivities(fullDiagnosis(e), str(e.data.icd10cm)), evidence: evidence(e) };
    for (const h of [...history].reverse()) {
      const onset = partial(h.data.onset_text);
      if (onset) { row.onset = onset; row.evidence.push(...evidence(h)); break; }
    }
    if (conditionName(e) === "chronic kidney disease") {
      // History can be stale. Clinician diagnoses take priority over copied history, even in a later note.
      const stageSources = [...(confirmed.length ? confirmed : history)].reverse();
      for (const source of stageSources) {
        const stage = ckdStage(source);
        if (stage) { row.ckd_stage = stage; row.evidence.push(...evidence(source)); break; }
      }
      for (const source of stageSources) {
        const albumin = /(?:\b|G[1-5][ab]?)A([123])\b/i.exec(fullDiagnosis(source));
        if (albumin) { row.albuminuria = ("A" + albumin[1]) as ProblemRow["albuminuria"]; row.evidence.push(...evidence(source)); break; }
      }
    }
    row.evidence = uniqueEvidence(row.evidence);
    result.push(row);
  }
  return result.sort((a, b) => cmp(a.condition, b.condition) || cmp(a.icd10cm || "", b.icd10cm || ""));
}

interface DrugClass { pattern: RegExp; members: string[]; }
const drugClasses: DrugClass[] = [
  { pattern: /\bSGLT[- ]?2(?: inhibitor)?s?\b/i, members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "bexagliflozin", "sotagliflozin"] },
  { pattern: /\bpenicillins?\b/i, members: ["penicillin", "amoxicillin", "ampicillin", "dicloxacillin", "nafcillin", "oxacillin", "piperacillin"] },
  { pattern: /\b(?:NSAIDs?|nonsteroidal anti.inflammatory (?:drugs?|agents?))\b/i, members: ["naproxen", "ibuprofen", "diclofenac", "meloxicam", "celecoxib", "ketorolac", "indomethacin", "aspirin"] },
  { pattern: /\bACE inhibitors?\b/i, members: ["lisinopril", "enalapril", "ramipril", "captopril", "benazepril", "fosinopril", "perindopril"] },
  { pattern: /\b(?:ARBs?|angiotensin(?: II)? receptor blockers?)\b/i, members: ["losartan", "valsartan", "irbesartan", "candesartan", "olmesartan", "telmisartan"] },
  { pattern: /\bstatins?\b/i, members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "fluvastatin", "pitavastatin"] },
  { pattern: /\b(?:GLP[- ]?1(?: receptor)? agonists?)\b/i, members: ["semaglutide", "liraglutide", "dulaglutide", "exenatide", "lixisenatide"] },
  { pattern: /\bsulfonylureas?\b/i, members: ["glipizide", "glyburide", "glimepiride"] },
  { pattern: /\bcephalosporins?\b/i, members: ["cephalexin", "cefazolin", "ceftriaxone", "cefepime", "cefdinir", "cefuroxime"] },
  { pattern: /\bfluoroquinolones?\b/i, members: ["ciprofloxacin", "levofloxacin", "moxifloxacin", "ofloxacin"] },
  { pattern: /\b(?:insulins?|antidiabetic drugs?)\b/i, members: ["insulin", "insulin glargine", "insulin lispro", "insulin aspart", "insulin regular", "insulin degludec"] },
];
const knownDrugs = [...new Set([...Object.values(brands), ...drugClasses.flatMap(c => c.members),
  "erythromycin", "isoniazid", "valproate", "valproic acid", "amiodarone", "lithium", "warfarin", "heparin", "trimethoprim", "sulfamethoxazole"])]
  .sort((a, b) => b.length - a.length || cmp(a, b));
const escapeRE = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function refText(e: Entry): string {
  const narrative = str(e.doc.item.narrative);
  const re = /<ref\s+id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/ref>/g;
  const chunks: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(narrative))) if (m[1] === e.id) chunks.push(m[2]);
  return chunks.join("; ");
}
function diagnosisContext(e: Entry): string {
  const name = conditionName(e);
  const patterns: Record<string, RegExp> = {
    "acute kidney injury": /acute kidney injury|acute renal failure|\baki\b/i,
    "diabetic ketoacidosis": /ketoacidosis|\bdka\b/i,
    "euglycemic diabetic ketoacidosis": /ketoacidosis|\bdka\b/i,
  };
  const condition = lookup(patterns, name) || new RegExp(escapeRE(conditionText(e)), "i");
  const narrative = str(e.doc.item.narrative).replace(/<[^>]*>/g, "").replace(/\*+/g, "");
  const related = narrative.split(/(?<=[.!?])\s+|\n/).filter(s => condition.test(s) && /attribut|due to|induced|associated|caused by|secondary to|adverse (?:effect|reaction)/i.test(s));
  return [fullDiagnosis(e), refText(e), ...related].join("; ");
}
interface Substance { name: string; code?: string; evidence: Evidence; }
function attributedSubstances(e: Entry): Substance[] {
  const text = diagnosisContext(e);
  const penicillinCode = /^T36\.0X5/i.test(str(e.data.icd10cm));
  if (!penicillinCode && !/attribut|due to|induced|associated|caused by|secondary to|adverse (?:effect|reaction)|allergy|intolerance/i.test(text)) return [];
  if (/\b(?:not|unlikely)\s+(?:caused by|due to|attributed|associated)|no (?:evidence of|adverse)/i.test(text)) return [];
  const meds = [...entriesOf(e.doc, "home_med"), ...entriesOf(e.doc, "inpatient_med")];
  const found: Substance[] = [];
  // Restrict names to causal clauses; unrelated medicines in the same sentence are not automatically culprits.
  const clauses: string[] = [];
  for (const clause of text.split(/[;\n]/)) {
    const after = /(?:attributed to|due to|caused by|secondary to|adverse (?:effect|reaction) (?:of|to)|allergy to|intolerance (?:of|to))\s+(.+)/i.exec(clause);
    if (after) clauses.push(after[1].split(/\bon top of\b|\bwhile\b|\btreated with\b|\btreatment\b/i)[0]);
    if (/[- ](?:associated|induced)\b/i.test(clause)) clauses.push(clause);
  }
  const causal = clauses.join("; ");
  if (!causal && !penicillinCode) return [];
  const candidates = new Set([...knownDrugs, ...meds.map(m => ingredient(str(m.data.drug_name)))]);
  for (const name of candidates) {
    if (!name || !new RegExp("\\b" + escapeRE(name) + "\\b", "i").test(causal)) continue;
    const matching = meds.filter(m => ingredient(str(m.data.drug_name)) === name);
    found.push({ name, code: matching.map(m => str(m.data.rxnorm_ingredient)).find(Boolean), evidence: matching.flatMap(evidence) });
  }
  for (const [brand, generic] of Object.entries(brands)) if (new RegExp("\\b" + escapeRE(brand) + "\\b", "i").test(causal) && !found.some(f => f.name === generic)) {
    const matching = meds.filter(m => ingredient(str(m.data.drug_name)) === generic);
    found.push({ name: generic, code: matching.map(m => str(m.data.rxnorm_ingredient)).find(Boolean), evidence: matching.flatMap(evidence) });
  }
  for (const c of drugClasses) {
    const match = c.pattern.exec(causal);
    if (!match || found.some(s => c.members.includes(s.name))) continue;
    const matches = new Map<string, Entry[]>();
    for (const med of meds) {
      const name = ingredient(str(med.data.drug_name));
      if (c.members.includes(name)) matches.set(name, [...(matches.get(name) || []), med]);
    }
    if (matches.size === 1) {
      const [name, lines] = [...matches][0];
      found.push({ name, code: lines.map(l => str(l.data.rxnorm_ingredient)).find(Boolean), evidence: lines.flatMap(evidence) });
    } else found.push({ name: match[0], evidence: [] });
  }
  // A named drug may be unfamiliar. Accept an explicit simple "due to X" attribution without inventing a code.
  if (!found.length) {
    const explicit = /(?:adverse (?:effect|reaction) (?:of|to)|(?:urticaria|rash|anaphylaxis) due to)\s+([a-z][a-z -]+?)(?:[,;.(]|$)/i.exec(text);
    if (explicit && !/unspecified|drug|medication|fasting|dehydration|infection|unknown/i.test(explicit[1])) found.push({ name: ingredient(explicit[1]), evidence: [] });
  }
  // T36.0X5 names penicillins even if the author's text is generic. Do not infer an RxNorm code.
  if (!found.length && penicillinCode) {
    const lines = meds.filter(m => drugClasses[1].members.includes(ingredient(str(m.data.drug_name))));
    const names = new Set(lines.map(m => ingredient(str(m.data.drug_name))));
    found.push(names.size === 1 ? { name: [...names][0], code: lines.map(m => str(m.data.rxnorm_ingredient)).find(Boolean), evidence: lines.flatMap(evidence) } : { name: "penicillins", evidence: [] });
  }
  // Prefer the complete ingredient over a contained generic term (insulin glargine over insulin).
  return found.filter((s, i) => found.findIndex(x => x.name === s.name) === i && !found.some(x => x.name !== s.name && x.name.startsWith(s.name + " ")));
}
function reactionDetails(reaction: string, severity: string, substance: string, fromDiagnosis: boolean): Pick<AllergyIntoleranceRow, "reaction_type" | "mechanism" | "criticality"> {
  const hyper = /hives|urticaria|rash|anaphyla|angioedema|bronchospasm|(?:lip|face|facial|tongue|throat) swelling|swelling (?:of (?:the )?)?(?:lips|face|tongue|throat)/i.test(reaction);
  const serious = /ketoacidosis|\bdka\b|kidney injury|renal failure|liver injury|liver failure|hepatitis|hepatotoxic|pancreatitis|rhabdomyolysis|agranulocytosis|aplastic anemia|(?:major|severe|gastrointestinal|gi) bleed|torsades|arrhythmia|seizure|(?:severe|life.threatening) hypoglycemia|stevens.johnson|toxic epidermal/i.test(reaction);
  const side = /cough|nausea|vomit|diarrh|stomach upset|gi upset|drows|sedat|dizz|headache|constipat|fatigue|myalgia|muscle ache/i.test(reaction);
  const reaction_type: AllergyIntoleranceRow["reaction_type"] = hyper ? "hypersensitivity" : serious ? "serious_adverse_event" : side ? "side_effect" : fromDiagnosis ? "serious_adverse_event" : "hypersensitivity";
  let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
  if (/non.immune|non.allergic/i.test(reaction)) mechanism = "non_immune";
  else if (/immune.mediated|ige.mediated|positive (?:allergy|skin) test/i.test(reaction)) mechanism = "immune";
  else if (!hyper && (side || /ketoacidosis|\bdka\b/i.test(reaction) || (/kidney injury|renal failure/i.test(reaction) && drugClasses[2].members.includes(substance)))) mechanism = "non_immune";
  const high = severity === "severe" || serious || /anaphyla|angioedema|bronchospasm|tongue|throat|life.threatening/i.test(reaction);
  return { reaction_type, mechanism, criticality: high ? "high" : severity === "mild" ? "low" : "unknown" };
}
function allergyRows(docs: Doc[], groups: Entry[][]): AllergyIntoleranceRow[] {
  const output = new Map<string, AllergyIntoleranceRow>();
  const put = (row: AllergyIntoleranceRow) => {
    const key = norm(row.substance);
    const old = output.get(key);
    if (!old) { output.set(key, row); return; }
    const reaction = [...new Set([...(old.reaction?.split("; ") || []), ...(row.reaction?.split("; ") || [])])].join("; ") || undefined;
    const priority = { side_effect: 1, hypersensitivity: 2, serious_adverse_event: 3 };
    const stronger = priority[row.reaction_type] > priority[old.reaction_type] ? row : old;
    output.set(key, { ...stronger, rxnorm_ingredient: row.rxnorm_ingredient || old.rxnorm_ingredient,
      reaction, criticality: old.criticality === "high" || row.criticality === "high" ? "high" : row.criticality,
      evidence: uniqueEvidence([...old.evidence, ...row.evidence]) });
  };
  // The allergy list is also a snapshot; absence from the most recent valid document removes an old list entry.
  const latest = docs.filter(d => d.enc).at(-1);
  if (latest) for (const e of entriesOf(latest, "allergy")) {
    const substance = str(e.data.substance);
    if (!substance || /^(?:nkda|nka|no known (?:drug )?allergies|none)$/i.test(substance)) continue;
    const isDrug = str(e.data.rxnorm_ingredient) || knownDrugs.includes(ingredient(substance)) ||
      entriesOf(latest, "home_med").some(m => ingredient(str(m.data.drug_name)) === ingredient(substance)) ||
      /(?:pril|sartan|statin|cillin|cycline|floxacin|mycin|azole|gliptin|gliflozin|olol|caine|oxetine|azepam|izumab)\b/i.test(substance) ||
      Object.keys(brands).some(b => new RegExp("^" + b + "\\b", "i").test(substance));
    const name = isDrug ? ingredient(substance) : substance;
    const reaction = str(e.data.reaction);
    put({ substance: name, rxnorm_ingredient: str(e.data.rxnorm_ingredient) || undefined, reaction: reaction || undefined,
      ...reactionDetails(reaction, str(e.data.severity), name, false), sensitivity: sensitivities(name + " " + reaction), evidence: evidence(e) });
  }
  for (const group of groups) {
    // A later note may omit an established attribution; omission does not revoke the adverse event.
    for (const e of assertions(group)) {
      for (const s of attributedSubstances(e)) {
        const reaction = adverseOnly(e) ? undefined : conditionText(e);
        const details = reactionDetails(reaction || refText(e), "", s.name, !!reaction);
        put({ substance: s.name, rxnorm_ingredient: s.code, reaction, ...details,
          sensitivity: sensitivities(fullDiagnosis(e)), evidence: uniqueEvidence([...evidence(e), ...s.evidence]) });
      }
    }
  }
  return [...output.values()].map(r => ({ ...r, evidence: uniqueEvidence(r.evidence) })).sort((a, b) => cmp(a.substance, b.substance));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const docs = documents(items, asOf);
  const groups = conditionGroups(docs);
  return {
    medications: medicationRows(docs), problems: problemRows(groups), allergies: allergyRows(docs, groups),
    labs: laboratoryRows(docs), vitals: vitalRows(docs),
  };
}
