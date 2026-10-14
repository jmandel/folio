import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow,
  AllergyIntoleranceRow, LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

type Obj = Record<string, unknown>;
const obj = (x: unknown): Obj | undefined =>
  x !== null && typeof x === "object" && !Array.isArray(x) ? x as Obj : undefined;
const str = (x: unknown): string => typeof x === "string" ? x : "";
const num = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const strings = (x: unknown): string[] => Array.isArray(x) ? x.filter((s): s is string => typeof s === "string") : [];
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const oneOf = <T extends string>(x: unknown, choices: readonly T[]): x is T =>
  typeof x === "string" && (choices as readonly string[]).includes(x);

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function calendarDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const y = Number(s.slice(0, 4)), m = Number(s.slice(5, 7)), d = Number(s.slice(8, 10));
  const days = [31, y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return y > 0 && m >= 1 && m <= 12 && d >= 1 && d <= days[m - 1];
}

function wallAt(ms: number): string | undefined {
  if (!Number.isFinite(ms)) return undefined;
  try {
    const p: Record<string, string> = {};
    for (const part of chicago.formatToParts(new Date(ms))) p[part.type] = part.value;
    return `${p.year.padStart(4, "0")}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
  } catch { return undefined; }
}

type Time = { local: string; instant: number; rfc: string };
function time(x: unknown): Time | undefined {
  const s = str(x).trim();
  const m = /^(\d{4}-\d{2}-\d{2})[Tt ](\d{2}):(\d{2})(?::(\d{2})(\.\d{1,9})?)?([zZ]|[+-]\d{2}:?\d{2})?$/.exec(s);
  if (!m || !calendarDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] || 0) > 59) return undefined;
  const wall = `${m[1]}T${m[2]}:${m[3]}:${m[4] || "00"}`;
  const fraction = m[5] || "";
  if (m[6]) {
    const zone = /^[zZ]$/.test(m[6]) ? "Z" : m[6].replace(/^([+-]\d{2})(\d{2})$/, "$1:$2");
    const rfc = wall + fraction + zone, instant = Date.parse(rfc), local = wallAt(instant);
    return local ? { local, instant, rfc } : undefined;
  }
  // Offset-free timestamps are Chicago wall times, independent of the host's timezone.
  // On the repeated fall-back hour, choose the earlier occurrence consistently.
  for (const offset of ["-05:00", "-06:00"]) {
    const rfc = wall + fraction + offset, instant = Date.parse(rfc);
    if (wallAt(instant) === wall) return { local: wall, instant, rfc };
  }
  // A nonexistent spring-forward wall time must still be retained as written.
  const rfc = wall + fraction + "-06:00";
  const instant = Date.parse(rfc);
  return Number.isFinite(instant) ? { local: wall, instant, rfc } : undefined;
}

function localDate(x: unknown): string | undefined {
  const s = str(x).trim();
  if (/^\d{4}$/.test(s) && +s > 0) return s;
  if (/^\d{4}-\d{2}$/.test(s) && calendarDate(s + "-01")) return s;
  if (calendarDate(s)) return s;
  return time(s)?.local.slice(0, 10);
}

function eventInstant(x: unknown): number | undefined {
  const t = time(x);
  if (t) return t.instant;
  const date = localDate(x);
  return date ? time((date.length === 4 ? date + "-01-01" : date.length === 7 ? date + "-01" : date) + "T00:00:00")?.instant : undefined;
}

function onset(x: unknown): ProblemRow["onset"] {
  const o = obj(x);
  if (!o || !oneOf(o.precision, ["year", "month", "day"] as const)) return undefined;
  const d = localDate(o.date), length = { year: 4, month: 7, day: 10 }[o.precision];
  return d && d.length >= length ? { value: d.slice(0, length), precision: o.precision } : undefined;
}

type Item = {
  id: string; issuer: string; effective: string; recorded: number; payload: Obj;
  supersedes: string[]; retracts: string[];
};
type Entry = { item: Item; id: string; data: Obj; at: number };
const itemKey = (i: Item): string => JSON.stringify([i.issuer, i.id]);
const targetKey = (i: Item, id: string): string => JSON.stringify([i.issuer, id]);
const order = (a: Entry, b: Entry): number => a.at - b.at || a.item.recorded - b.item.recorded || cmp(a.item.id, b.item.id) || cmp(a.id, b.id);
const evidence = (...entries: Entry[]): Evidence => {
  const seen = new Set<string>();
  return entries.flatMap(e => {
    const k = JSON.stringify([e.item.id, e.id]);
    if (seen.has(k)) return [];
    seen.add(k);
    return [{ item_id: e.item.id, entry_id: e.id }];
  });
};

function countingItems(input: unknown, asOf: string): Item[] {
  if (!Array.isArray(input) || !calendarDate(asOf)) return [];
  const all = new Map<string, Item>();
  for (const raw of input) {
    const r = obj(raw);
    if (!r || !str(r.id)) continue;
    const recorded = eventInstant(r.recorded), date = localDate(r.recorded);
    if (recorded === undefined || !date || date > asOf) continue;
    const i: Item = { id: str(r.id), issuer: str(r.issuer), effective: str(r.effective), recorded,
      payload: obj(r.payload) || {}, supersedes: strings(r.supersedes), retracts: strings(r.retracts) };
    const old = all.get(itemKey(i));
    // Conflicting duplicate ids are outside the schema; make their selection order-independent.
    if (!old || cmp(JSON.stringify(i), JSON.stringify(old)) > 0) all.set(itemKey(i), i);
  }
  const incoming = new Map<string, number>();
  const edges = new Map<string, string[]>();
  for (const k of all.keys()) incoming.set(k, 0);
  for (const [k, i] of all) {
    const targets = [...new Set([...i.supersedes, ...i.retracts].map(id => targetKey(i, id)))].filter(t => all.has(t));
    edges.set(k, targets);
    for (const t of targets) incoming.set(t, incoming.get(t)! + 1);
  }
  const ready = [...all.keys()].filter(k => incoming.get(k) === 0).sort();
  const hidden = new Set<string>(), result: Item[] = [];
  while (ready.length) {
    const key = ready.pop()!, item = all.get(key)!;
    if (!hidden.has(key)) {
      result.push(item);
      for (const id of item.retracts) hidden.add(targetKey(item, id));
      // A correction replaces the entire supersession ancestry, including missing intermediates
      // whenever their envelopes are available. Retraction itself is deliberately not transitive.
      const pending = item.supersedes.map(id => targetKey(item, id)), visited = new Set<string>();
      while (pending.length) {
        const k = pending.pop()!;
        if (visited.has(k)) continue;
        visited.add(k); hidden.add(k);
        const parent = all.get(k);
        if (parent) for (const id of parent.supersedes) pending.push(targetKey(parent, id));
      }
    }
    for (const k of edges.get(key) || []) {
      incoming.set(k, incoming.get(k)! - 1);
      if (incoming.get(k) === 0) ready.push(k);
    }
    ready.sort();
  }
  // Cyclic correction envelopes are unreadable and are not clinical facts.
  return result;
}

function getEntries(items: Item[]): Entry[] {
  const result: Entry[] = [];
  for (const item of items) {
    const at = eventInstant(item.effective);
    if (at === undefined) continue;
    for (const id of Object.keys(item.payload).sort()) {
      const data = obj(item.payload[id]);
      if (data && str(data.type)) result.push({ item, id, data, at });
    }
  }
  return result.sort(order);
}

function sensitivity(d: Obj, text: string, code = ""): Sensitivity[] | undefined {
  const tags: Sensitivity[] = [];
  const s = text.toLowerCase(), c = code.toUpperCase();
  if (d.restricted === "BH" || /^F(?:[2-9]|0)/.test(c) || /\b(depress(?:ion|ive)|anxiety|bipolar|schizophren\w*|psychosis|ptsd|post.?traumatic stress|adhd|attention deficit|obsessive.compulsive|quetiapine|sertraline|escitalopram|fluoxetine|paroxetine|citalopram|venlafaxine|risperidone|aripiprazole|olanzapine|buspirone)\b/.test(s)) tags.push("mental-health");
  if (/^F1\d/.test(c) || /\b((?:alcohol|opioid|substance|cocaine|cannabis|tobacco|nicotine|sedative).*(?:use disorder|dependence|abuse)|buprenorphine|acamprosate|disulfiram|smoking cessation)\b/.test(s)) tags.push("substance-use");
  if (/^(?:O\d|Z3[0-9]|N9[7-8])/.test(c) || /\b(pregnan\w*|contracepti\w*|infertility|fertility|erectile dysfunction|endometriosis|norethindrone|ethinyl estradiol|levonorgestrel)\b/.test(s)) tags.push("sexual-reproductive-health");
  if (/^(?:B2[0-4]|A5\d|A6[0-4]|Z21)/.test(c) || /\b(hiv|aids|chlamydia|gonorrh\w*|syphilis|genital herpes|trichomon\w*|antiretroviral|bictegravir|dolutegravir|emtricitabine|tenofovir)\b/.test(s)) tags.push("hiv-sti");
  if (/\b(genetic|hereditary|inherited|brca[12]?|lynch syndrome|cystic fibrosis|sickle.cell|thalass[ae]mia|huntington|familial hypercholesterolemia|polycystic kidney)\b/.test(s)) tags.push("genetic");
  return tags.length ? tags : undefined;
}

// Name translation is intentionally separate from coding: medication RxNorm values are
// product CUIs in this source, and are NEVER emitted as ingredient CUIs.
const brands: Record<string, string> = {
  hctz: "hydrochlorothiazide", apap: "acetaminophen", asa: "aspirin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  humalog: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart", tresiba: "insulin degludec", levemir: "insulin detemir",
  glucophage: "metformin", glumetza: "metformin", fortamet: "metformin", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide", saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  januvia: "sitagliptin", tradjenta: "linagliptin", actos: "pioglitazone", amaryl: "glimepiride", glucotrol: "glipizide",
  cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan",
  lisinopril: "lisinopril", prinivil: "lisinopril", zestril: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  norvasc: "amlodipine", procardia: "nifedipine", adalat: "nifedipine", cardizem: "diltiazem",
  lopressor: "metoprolol", toprol: "metoprolol", coreg: "carvedilol", tenormin: "atenolol", bystolic: "nebivolol",
  microzide: "hydrochlorothiazide", hygroton: "chlorthalidone", thalitone: "chlorthalidone", lasix: "furosemide", demadex: "torsemide", bumex: "bumetanide", aldactone: "spironolactone", inspra: "eplerenone", kerendia: "finerenone",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin", zetia: "ezetimibe",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", xopenex: "levalbuterol", flovent: "fluticasone", pulmicort: "budesonide", spiriva: "tiotropium", singulair: "montelukast",
  pepcid: "famotidine", prilosec: "omeprazole", protonix: "pantoprazole", nexium: "esomeprazole", prevacid: "lansoprazole",
  zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine", benadryl: "diphenhydramine",
  keflex: "cephalexin", amoxil: "amoxicillin", zithromax: "azithromycin", cipro: "ciprofloxacin", levaquin: "levofloxacin", flagyl: "metronidazole", macrobid: "nitrofurantoin",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", euthyrox: "levothyroxine", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", plavix: "clopidogrel",
  zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine", celexa: "citalopram", paxil: "paroxetine", effexor: "venlafaxine", cymbalta: "duloxetine", wellbutrin: "bupropion", zyban: "bupropion", seroquel: "quetiapine", abilify: "aripiprazole", risperdal: "risperidone", zyprexa: "olanzapine", buspar: "buspirone", ativan: "lorazepam", xanax: "alprazolam", klonopin: "clonazepam",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", neurontin: "gabapentin", lyrica: "pregabalin", flomax: "tamsulosin",
};
const combinations: Record<string, string[]> = {
  augmentin: ["amoxicillin", "clavulanic acid"], bactrim: ["sulfamethoxazole", "trimethoprim"], septra: ["sulfamethoxazole", "trimethoprim"],
  hyzaar: ["losartan", "hydrochlorothiazide"], entresto: ["sacubitril", "valsartan"], janumet: ["sitagliptin", "metformin"], synjardy: ["empagliflozin", "metformin"],
  symbicort: ["budesonide", "formoterol"], advair: ["fluticasone", "salmeterol"], suboxone: ["buprenorphine", "naloxone"],
};

function ingredientNames(name: string): string[] {
  let s = name.toLowerCase().replace(/[®™]/g, "").trim();
  for (const [brand, ingredients] of Object.entries(combinations)) {
    if (new RegExp(`\\b${brand}\\b`).test(s)) return ingredients;
  }
  // Slash-separated SCD components, excluding concentration denominators such as MG/ML.
  const parts = s.split(/\s*\/\s*(?=[a-z])|\s+(?:and|\+)\s+/).filter(Boolean);
  if (parts.length > 1 && !parts.slice(1).some(p => /^(?:ml|l|actuation|puff|dose|day|24|hr)\b/.test(p))) {
    return [...new Set(parts.flatMap(p => ingredientNames(p)))];
  }
  for (const [brand, generic] of Object.entries(brands)) {
    if (new RegExp(`\\b${brand}\\b`).test(s)) return [generic];
  }
  s = s.replace(/^\d+(?:\.\d+)?\s*(?:ml|gm?|mcg|mg|units?|unt)\s+/i, "");
  s = s.replace(/\s*\[[^\]]*\]/g, "").replace(/\s*\([^)]*\)/g, "");
  s = s.split(/\s+\d|\s+(?:oral|tablet|capsule|solution|suspension|injection|injectable|inhaler|pen injector|extended.release|delayed.release|er|xr|xl|hfa|cream|ointment|patch|drops|powder)\b/i)[0];
  s = s.replace(/\b(?:hydrochloride|hcl|hydrobromide|hbr|succinate|tartrate|besylate|besilate|mesylate|fumarate|maleate|citrate|phosphate|sulfate|sulphate|trihydrate|dihydrate|monohydrate|potassium|sodium|calcium)\b/gi,
    word => /^(?:potassium|sodium|calcium)\b/.test(s) ? word : "");
  s = s.replace(/\s+/g, " ").trim();
  return s && /[a-z]/.test(s) && !/^(?:unknown|unspecified|medication|drug|insulin)$/.test(s) ? [s] : [];
}

function doseUnit(x: unknown): NonNullable<MedicationRow["dose"]>["unit"] | undefined {
  const u = str(x).toLowerCase().replace(/[().\s]/g, "");
  if (["mg", "milligram", "milligrams"].includes(u)) return "mg";
  if (["mcg", "µg", "μg", "ug", "microgram", "micrograms"].includes(u)) return "mcg";
  if (["u", "iu", "unt", "unit", "units"].includes(u)) return "units";
  if (["ml", "cc", "milliliter", "milliliters"].includes(u)) return "mL";
  if (["tab", "tabs", "tablet", "tablets"].includes(u)) return "tablet";
  return undefined;
}

function medicationDose(d: Obj, name: string, ingredient: string, combination: boolean): MedicationRow["dose"] {
  const dose = obj(d.dose);
  // In Northgate, an absent dose specifically means that there is no single structured amount.
  if (!dose || !num(dose.value) || dose.value < 0) return undefined;
  const grams = /^(?:g|grams?)$/i.test(str(dose.unit).trim());
  const unit = grams ? "mg" : doseUnit(dose.unit);
  if (!unit) return undefined;
  if (unit !== "tablet") {
    const value = grams ? dose.value * 1000 : dose.value;
    return combination || !Number.isFinite(value) ? undefined : { value, unit };
  }
  let product = name;
  if (combination) {
    const component = name.split(/\s*\/\s*(?=[a-z])/i).find(p => ingredientNames(p).includes(ingredient));
    if (!component || ingredientNames(component).length !== 1) return undefined;
    product = component;
  }
  const strength = /(?:^|\s)(\d+(?:\.\d+)?)\s*(mg|mcg|µg|μg|micrograms?|milligrams?|g|grams?|units?|unt|iu|u)\b/i.exec(product);
  if (strength) {
    const inGrams = /^(?:g|grams?)$/i.test(strength[2]);
    const u = inGrams ? "mg" : doseUnit(strength[2]);
    const value = Number(strength[1]) * dose.value * (inGrams ? 1000 : 1);
    return u && Number.isFinite(value) ? { value: Number(value.toPrecision(12)), unit: u } : undefined;
  }
  // A known strength in an unsupported unit is not an unknown strength.
  if (/\d\s*(?:meq|mmol)\b/i.test(product)) return undefined;
  return combination ? undefined : { value: dose.value, unit: "tablet" };
}

function frequency(d: Obj): MedicationRow["frequency"] {
  if (oneOf(d.frequency, ["QD", "BID", "TID", "QHS", "PRN"] as const)) return d.frequency;
  if (d.frequency !== "OTHER") return undefined;
  const s = str(d.sig).toLowerCase();
  if (/\bas needed\b|\bprn\b/.test(s)) return "PRN";
  if (/\bonce (?:a |per )?week\b|\bweekly\b|\bevery 7 days\b/.test(s)) return "QW";
  if (/\bevery (?:other|two|2) day|\bfour times|\btaper|\bmonthly\b/.test(s)) return "other";
  if (/\btwice (?:a |per )?day|\btwice daily|\bevery 12 hours\b/.test(s)) return "BID";
  if (/\bthree times (?:a |per )?day|\bthree times daily|\bevery 8 hours\b/.test(s)) return "TID";
  if (/\bat bedtime\b|\bnightly\b|\bevery night\b/.test(s)) return "QHS";
  if (/\bonce daily\b|\bonce (?:a |per )?day\b|\bevery day\b/.test(s)) return "QD";
  return "other";
}

function medications(entries: Entry[]): MedicationRow[] {
  const lines = new Map<string, { latest: Entry; statusEntry?: Entry }>();
  for (const e of entries) {
    const d = e.data, id = str(d.med_id);
    if (d.type !== "med_event" || !id || !oneOf(d.action, ["start", "change", "hold", "resume", "stop"] as const)) continue;
    const old = lines.get(id);
    // Dose changes do not restart the duration of the active status.
    const statusEntry = d.action === "change" ? (old && ["start", "resume", "change"].includes(str(old.latest.data.action)) ? old.statusEntry : undefined) : e;
    lines.set(id, { latest: e, statusEntry });
  }
  const chosen = new Map<string, { row: MedicationRow; entry: Entry }>();
  for (const { latest: e, statusEntry } of lines.values()) {
    const d = e.data, drug = obj(d.drug), name = str(drug?.name);
    if (!name) continue;
    const ingredients = ingredientNames(name);
    for (const ingredient of ingredients.length ? ingredients : [undefined]) {
      const row: MedicationRow = {
        drug_name: name, status: d.action === "hold" ? "held" : d.action === "stop" ? "stopped" : "active",
        patient_reported: false, evidence: statusEntry ? evidence(e, statusEntry) : evidence(e),
      };
      if (ingredient) row.ingredient = ingredient;
      const since = statusEntry && localDate(statusEntry.item.effective);
      if (since) row.status_since = since;
      const amount = medicationDose(d, name, ingredient || "", ingredients.length > 1);
      if (amount) row.dose = amount;
      const f = frequency(d);
      if (f) row.frequency = f;
      if (row.status === "stopped" && oneOf(d.stop_reason, ["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"] as const)) row.stop_reason = d.stop_reason;
      if (str(d.reason_text)) row.status_reason_text = str(d.reason_text);
      const tags = sensitivity(d, `${ingredient || name} ${str(d.reason_text)} ${str(d.sig)}`);
      if (tags) row.sensitivity = tags;
      const key = ingredient || `unknown:${str(d.med_id)}`;
      const previous = chosen.get(key);
      if (!previous || order(previous.entry, e) < 0) chosen.set(key, { row, entry: e });
    }
  }
  return [...chosen.entries()].sort((a, b) => cmp(a[0], b[0])).map(([, v]) => v.row);
}

function conditionKey(d: Obj): string {
  const name = (str(d.description) || str(d.display)).toLowerCase();
  const code = str(d.icd10cm).toUpperCase();
  if (/^N18(?:\.|$)/.test(code) || /\b(?:chronic kidney disease|ckd|end.stage (?:renal|kidney) disease)\b/.test(name)) return "ckd";
  return code ? `icd:${code}` : str(d.snomed) ? `snomed:${str(d.snomed)}` : `name:${name.replace(/[^a-z0-9]+/g, " ").trim()}`;
}

function uncertainDiagnosis(s: string): boolean {
  return /\b(?:rule[ -]?out|ruled out|suspected|possible|probable|provisional|working diagnosis|unconfirmed|no evidence of)\b|\br\/o\b|\?$/.test(s.toLowerCase());
}

function kidneyCategories(d: Obj): Pick<ProblemRow, "ckd_stage" | "albuminuria"> {
  if (conditionKey(d) !== "ckd") return {};
  const text = str(d.description) || str(d.display), code = str(d.icd10cm).toUpperCase();
  const stages: Record<string, NonNullable<ProblemRow["ckd_stage"]>> = {
    "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5",
  };
  const codes: Record<string, NonNullable<ProblemRow["ckd_stage"]>> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  const explicit = /\bG\s*(3[ab]|[1245])(?=\b|A[123])|\bstage\s*(3[ab]|[1245])\b/i.exec(text);
  const roman = /\bstage\s+(III[ab]|IV|II|I|V)\b/i.exec(text);
  const romanStages: Record<string, NonNullable<ProblemRow["ckd_stage"]>> = { i: "G1", ii: "G2", iiia: "G3a", iiib: "G3b", iv: "G4", v: "G5" };
  const stage = explicit ? stages[(explicit[1] || explicit[2]).toLowerCase()] : roman ? romanStages[roman[1].toLowerCase()] : codes[code];
  const albumin = /\bA[123]\b/i.exec(text) || /G(?:3[ab]|[1245])(A[123])\b/i.exec(text);
  const result: Pick<ProblemRow, "ckd_stage" | "albuminuria"> = {};
  if (stage) result.ckd_stage = stage;
  if (albumin) result.albuminuria = (albumin[1] || albumin[0]).toUpperCase() as "A1" | "A2" | "A3";
  else if (/\bseverely increased albuminuria\b/i.test(text)) result.albuminuria = "A3";
  else if (/\bmoderately increased albuminuria\b/i.test(text)) result.albuminuria = "A2";
  else if (/\b(?:normal to mildly increased|mildly increased) albuminuria\b/i.test(text)) result.albuminuria = "A1";
  return result;
}

const knownDrugs = new Set([
  ...Object.values(brands), ...Object.values(combinations).flat(),
  "aspirin", "prednisone", "prednisolone", "methylprednisolone", "hydrocortisone", "dexamethasone", "erythromycin", "penicillin", "ampicillin", "isoniazid", "valproate", "valproic acid", "allopurinol", "colchicine", "hydralazine", "doxazosin", "clonidine", "potassium chloride", "sodium bicarbonate", "ferrous sulfate", "ferrous gluconate", "cholecalciferol", "calcitriol", "ergocalciferol", "azathioprine", "methotrexate", "tacrolimus", "mycophenolate", "lithium", "trazodone", "mirtazapine", "lamotrigine", "carbamazepine", "topiramate", "naltrexone", "nicotine", "varenicline", "methadone", "buprenorphine", "naloxone",
]);

function allergyName(name: string, hasIngredientCode = false): string {
  const names = ingredientNames(name);
  if (names.length === 1 && (hasIngredientCode || knownDrugs.has(names[0]))) return names[0];
  return name;
}

// The source distinguishes mechanisms; the consumer's reaction_type describes the event.
// Phenotype takes precedence over the source's list label.
function reactionKind(reaction: string, sourceKind?: unknown): AllergyIntoleranceRow["reaction_type"] | undefined {
  const s = reaction.toLowerCase();
  if (/\b(hives|urticaria|rash|angioedema|anaphyla\w*|bronchospasm|stevens.johnson|toxic epidermal necrolysis)\b|\b(?:lip|face|facial|tongue|throat)\s+swelling\b|\bswelling (?:of (?:the )?)?(?:lips|face|tongue|throat)\b/.test(s)) return "hypersensitivity";
  if (/\b(ketoacidosis|dka|pancreatitis|hepatitis|liver (?:injury|failure)|hepatotoxicity|acute kidney (?:injury|failure)|renal failure|agranulocytosis|rhabdomyolysis|severe hypoglycemia|major bleeding|gastrointestinal bleeding|seizures?|torsades)\b/.test(s)) return "serious_adverse_event";
  if (/\b(cough|nausea|vomiting|diarrh\w*|constipation|drowsiness|somnolence|sedation|stomach upset|gi upset|dyspepsia|dizziness|headache|myalgia|muscle aches|ankle (?:edema|swelling)|peripheral edema)\b/.test(s)) return "side_effect";
  if (sourceKind === "allergy") return "hypersensitivity";
  if (sourceKind === "intolerance") return "side_effect";
  if (sourceKind === "adverse_reaction") return "serious_adverse_event";
  return undefined;
}

function mechanism(reaction: string, sourceKind: unknown, substance: string): AllergyIntoleranceRow["mechanism"] {
  if (sourceKind === "allergy") return "immune"; // Explicit meaning of Northgate's coded field.
  if (sourceKind === "intolerance") return "non_immune";
  const s = reaction.toLowerCase();
  if (/\b(nausea|vomiting|diarrh\w*|drowsiness|sedation|constipation|stomach upset|dyspepsia)\b/.test(s)) return "non_immune";
  if (/\b(cough|angioedema)\b/.test(s) && /\b(?:\w+pril|ace[ -]?inhibitors?)\b/i.test(substance)) return "non_immune";
  if (/\b(ketoacidosis|dka)\b/.test(s) && /gliflozin|sglt.?2/i.test(substance)) return "non_immune";
  return "unknown";
}

type DrugDiagnosis = { substance: string; reaction: string; onlyAdverseEffect: boolean };
function attributedDrug(description: string): DrugDiagnosis | undefined {
  const s = description.trim();
  let m = /^(?:adverse (?:effect|reaction)(?:s)?|allergy|intolerance)\s+(?:of|to|from)\s+(.+?)(?:,?\s+(?:initial|subsequent) encounter|,?\s+sequela)?$/i.exec(s);
  if (m) return { substance: m[1].trim(), reaction: "", onlyAdverseEffect: true };
  m = /^(.+?)\s+(?:due to|caused by|secondary to|attributed to|induced by|associated with)\s+(.+)$/i.exec(s);
  if (m) {
    const substance = m[2].replace(/\s*\([^)]*\)\s*$/, "").trim();
    const name = ingredientNames(substance)[0];
    // Causation by a disease or an exposure is not a drug attribution.
    if (knownDrugs.has(name) || /\b(?:inhibitors?|antibiotics?|penicillins?|cephalosporins?|statins?|nsaids?|medication|drug)\b/i.test(substance)) {
      return { substance, reaction: m[1].trim(), onlyAdverseEffect: false };
    }
  }
  m = /^(.+?)[ -](?:induced|associated)\s+(.+)$/i.exec(s);
  if (m && (knownDrugs.has(ingredientNames(m[1])[0]) || /\b(?:inhibitors?|antibiotics?|statins?|nsaids?|sglt.?2|ace)\b/i.test(m[1]))) {
    return { substance: m[1].trim(), reaction: m[2].trim(), onlyAdverseEffect: false };
  }
  return undefined;
}

function specificDrug(substance: string, sameItem: Entry[]): { name: string; used: Entry[] } {
  const classes: [RegExp, RegExp][] = [
    [/penicillins?/i, /^(?:amoxicillin|ampicillin|penicillin|dicloxacillin|nafcillin|oxacillin|piperacillin)$/],
    [/cephalosporins?/i, /^(?:cephalexin|cef\w+)$/],
    [/ace[ -]?inhibitors?/i, /pril$/], [/sglt.?2(?: inhibitors?)?/i, /gliflozin$/],
    [/statins?/i, /statin$/], [/nsaids?|nonsteroidal anti.inflammatory/i, /^(?:ibuprofen|naproxen|diclofenac|meloxicam|celecoxib|indomethacin|ketorolac)$/],
  ];
  const match = classes.find(([pattern]) => pattern.test(substance));
  if (!match) return { name: allergyName(substance), used: [] };
  const drugs = new Map<string, Entry>();
  for (const e of sameItem) {
    if (e.data.type !== "med_event") continue;
    for (const ingredient of ingredientNames(str(obj(e.data.drug)?.name))) if (match[1].test(ingredient)) drugs.set(ingredient, e);
  }
  if (drugs.size === 1) {
    const [name, entry] = [...drugs][0];
    return { name, used: [entry] };
  }
  return { name: substance, used: [] };
}

type DerivedAllergy = { row: AllergyIntoleranceRow; entry: Entry };
function problems(entries: Entry[]): { rows: ProblemRow[]; allergies: DerivedAllergy[] } {
  const lines = new Map<string, Entry>();
  const aliases = new Map<string, Set<string>>();
  for (const e of entries) {
    const d = e.data, id = str(d.problem_id);
    if (d.type !== "problem_event" || !id || !oneOf(d.action, ["add", "update", "resolve", "remove"] as const)) continue;
    lines.set(id, e);
    if (!aliases.has(id)) aliases.set(id, new Set());
    aliases.get(id)!.add(conditionKey(d));
  }
  const candidates = new Map<string, Entry>(), listed = new Set<string>();
  for (const [id, e] of lines) {
    for (const key of aliases.get(id) || []) listed.add(key);
    // Removing an erroneous duplicate line does not erase another valid line for the condition.
    if (e.data.action === "remove") continue;
    const key = conditionKey(e.data), old = candidates.get(key);
    if (!old || order(old, e) < 0) candidates.set(key, e);
  }
  // Referral diagnoses are explicit copies chosen from the problem list, unlike billing
  // diagnoses. They can supply a withheld/missing list line, but cannot refresh or undo an
  // available line's update, resolution, or removal merely by being reprinted at scheduling.
  for (const e of entries) {
    if (e.data.type !== "referral_dx" || !str(e.data.display)) continue;
    const key = conditionKey(e.data);
    if (listed.has(key)) continue;
    const old = candidates.get(key);
    if (!old || order(old, e) < 0) candidates.set(key, e);
  }
  const rows: ProblemRow[] = [], allergies: DerivedAllergy[] = [];
  for (const [, e] of [...candidates].sort((a, b) => cmp(a[0], b[0]))) {
    const d = e.data, description = str(d.description) || str(d.display);
    if (d.action === "remove" || !description || uncertainDiagnosis(description)) continue;
    const attribution = attributedDrug(description);
    const tags = sensitivity(d, description, str(d.icd10cm));
    if (!attribution?.onlyAdverseEffect) {
      const row: ProblemRow = { condition: description, status: d.action === "resolve" ? "resolved" : "active", ...kidneyCategories(d), evidence: evidence(e) };
      if (str(d.icd10cm)) row.icd10cm = str(d.icd10cm);
      if (str(d.snomed)) row.snomed = str(d.snomed);
      const date = onset(d.onset);
      if (date) row.onset = date;
      if (tags) row.sensitivity = tags;
      rows.push(row);
    }
    if (attribution) {
      const drug = specificDrug(attribution.substance, entries.filter(other => other.item === e.item));
      const kind = reactionKind(attribution.reaction);
      // An adverse-effect-only code gives an avoidance entry but no invented manifestation.
      const row: AllergyIntoleranceRow = {
        substance: drug.name, reaction_type: kind || "serious_adverse_event",
        mechanism: mechanism(attribution.reaction, undefined, drug.name), criticality: "unknown", evidence: evidence(e, ...drug.used),
      };
      if (attribution.reaction) row.reaction = attribution.reaction;
      const date = onset(d.onset);
      if (date) row.onset = date;
      if (tags) row.sensitivity = tags;
      allergies.push({ row, entry: e });
    }
  }
  return { rows, allergies };
}

function allergies(entries: Entry[], derived: DerivedAllergy[]): AllergyIntoleranceRow[] {
  const lines = new Map<string, Entry>();
  for (const e of entries) {
    if (e.data.type === "allergy_event" && str(e.data.allergy_id) && oneOf(e.data.action, ["add", "update", "inactivate"] as const)) lines.set(str(e.data.allergy_id), e);
  }
  const explicit = new Map<string, Entry>(), rows: AllergyIntoleranceRow[] = [];
  for (const e of lines.values()) {
    const d = e.data, substance = obj(d.substance), name = str(substance?.name);
    if (!name) continue;
    const normalized = allergyName(name, !!str(substance?.rxnorm)), key = normalized.toLowerCase();
    const previous = explicit.get(key);
    if (!previous || order(previous, e) < 0) explicit.set(key, e);
    if (d.action === "inactivate" || /^(?:no known (?:drug )?allergies|nka|nkda|none)$/i.test(name)) continue;
    const reaction = strings(d.reactions).filter(Boolean).join("; "), kind = reactionKind(reaction, d.reaction_type);
    if (!kind) continue;
    const row: AllergyIntoleranceRow = {
      substance: normalized, reaction_type: kind, mechanism: mechanism(reaction, d.reaction_type, normalized),
      criticality: oneOf(d.severity, ["low", "high", "unknown"] as const) ? d.severity : "unknown", evidence: evidence(e),
    };
    if (str(substance?.rxnorm)) row.rxnorm_ingredient = str(substance?.rxnorm);
    if (reaction) row.reaction = reaction;
    const date = onset(d.onset);
    if (date) row.onset = date;
    const tags = sensitivity(d, `${normalized} ${reaction}`);
    if (tags) row.sensitivity = tags;
    rows.push(row);
  }
  const added = new Map<string, DerivedAllergy>();
  for (const candidate of derived) {
    const key = candidate.row.substance.toLowerCase(), state = explicit.get(key);
    if (state) {
      // A deliberate inactivation takes precedence over an older attributed diagnosis.
      if (state.data.action !== "inactivate" || order(candidate.entry, state) <= 0) continue;
    }
    const old = added.get(key);
    if (!old || order(old.entry, candidate.entry) < 0) added.set(key, candidate);
  }
  rows.push(...[...added.values()].map(c => c.row));
  return rows.sort((a, b) => cmp(a.substance, b.substance) || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

const labUnits: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const labCodes: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", CR: "creatinine", SCR: "creatinine", EGFR: "egfr", GFR: "egfr",
  K: "potassium", POTASSIUM: "potassium", NA: "sodium", SODIUM: "sodium", CL: "chloride", CHLORIDE: "chloride",
  CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate", BICARB: "bicarbonate", BICARBONATE: "bicarbonate",
  AG: "anion_gap", AGAP: "anion_gap", ANIONGAP: "anion_gap", BUN: "bun", UREANITROGEN: "bun",
  GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", MALBCR: "uacr", UMALBCR: "uacr", MICROALBCR: "uacr", URINEACR: "uacr",
  PLT: "platelets", PLTS: "platelets", PLATELET: "platelets", PLATELETS: "platelets", WBC: "wbc",
  HGB: "hemoglobin", HB: "hemoglobin", HEMOGLOBIN: "hemoglobin", BHB: "bhb", BOHB: "bhb", BETAHYDROXYBUTYRATE: "bhb",
  PH: "ph", VPH: "ph", APH: "ph", PHVEN: "ph", PHART: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2", PCO2VEN: "pco2", PCO2ART: "pco2",
  LIPASE: "lipase", LIP: "lipase", TROP: "troponin", TROPONIN: "troponin", TROPONINI: "troponin", TNI: "troponin", TROPI: "troponin",
  CHOL: "cholesterol", TCHOL: "cholesterol", CHOLESTEROL: "cholesterol", TOTALCHOL: "cholesterol", TC: "cholesterol",
  TRIG: "triglycerides", TRIGLYCERIDES: "triglycerides", TG: "triglycerides", TRIGS: "triglycerides",
  HDL: "hdl", HDLC: "hdl", HDLCHOL: "hdl", LDL: "ldl", LDLC: "ldl", LDLCALC: "ldl", LDLCHOL: "ldl", LDLDIRECT: "ldl",
};
const loincAnalytes: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr", "62238-1": "egfr", "62239-9": "egfr", "98979-8": "egfr",
  "2823-3": "potassium", "2951-2": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "33037-3": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "2345-7": "glucose", "4548-4": "a1c", "17856-6": "a1c", "14959-1": "uacr", "9318-7": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "6873-4": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl",
};

function analyte(d: Obj): Analyte | undefined {
  const test = obj(d.test), external = obj(d.external_ref);
  if (!test) return undefined;
  const name = str(test.name).toLowerCase();
  // Avoid silently confusing a urine concentration, point-of-care reading, or troponin T
  // with a different analyte in the consumer's fixed list.
  if (/\btroponin[ -]?t\b|\b(?:home|fingerstick|glucometer|capillary) glucose\b/.test(name)) return undefined;
  if (/\burine\b|\burinary\b/.test(name) && !/albumin.*(?:creatinine|ratio)|microalbumin.*(?:creatinine|ratio)/.test(name)) return undefined;
  if (/\begfr\b|estimated (?:glomerular filtration|gfr)|glomerular filtration rate/.test(name)) return "egfr";
  if (/albumin.*creatinine|microalbumin.*ratio/.test(name)) return "uacr";
  if (/\b(?:hemoglobin|haemoglobin|hgb)\s*a1c\b|\ba1c\b|glycated (?:hemoglobin|haemoglobin)/.test(name)) return "a1c";
  if (/\b(?:beta|β)[ -]?hydroxybutyrate\b|\b3[ -]hydroxybutyrate\b/.test(name)) return "bhb";
  if (/\banion gap\b/.test(name)) return "anion_gap";
  if (/\b(?:pco2|pco₂)\b|partial pressure.*(?:carbon dioxide|co2)/.test(name)) return "pco2";
  if (/\b(?:bicarbonate|total co2|co2 total|carbon dioxide,? total)\b/.test(name)) return "bicarbonate";
  if (/\b(?:hdl|high.density lipoprotein)\b/.test(name)) return "hdl";
  if (/\b(?:ldl|low.density lipoprotein)\b/.test(name)) return "ldl";
  if (/\btriglycerides?\b/.test(name)) return "triglycerides";
  if (/\b(?:cholesterol|total cholesterol)\b/.test(name)) return "cholesterol";
  if (/\bplatelet(?:s| count)?\b/.test(name)) return "platelets";
  if (/\b(?:white blood (?:cell|count)|white cell|wbc|leukocyte count)\b/.test(name)) return "wbc";
  if (/\b(?:hemoglobin|haemoglobin)\b/.test(name)) return "hemoglobin";
  if (/\bcreatinine\b/.test(name) && !/clearance|ratio/.test(name)) return "creatinine";
  if (/\bpotassium\b/.test(name)) return "potassium";
  if (/\bsodium\b/.test(name)) return "sodium";
  if (/\bchloride\b/.test(name)) return "chloride";
  if (/\b(?:urea nitrogen|bun)\b/.test(name)) return "bun";
  if (/\bglucose\b/.test(name)) return "glucose";
  if (/\blipase\b/.test(name)) return "lipase";
  if (/\btroponin(?:[ -]?i)?\b/.test(name)) return "troponin";
  if (/\bph\b/.test(name)) return "ph";
  for (const raw of [str(test.nfm_code), str(external?.result_code).replace(/^LK-/, "")]) {
    const code = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (/^EGFR/.test(code)) return "egfr";
    if (Object.prototype.hasOwnProperty.call(labCodes, code)) return labCodes[code];
  }
  return Object.prototype.hasOwnProperty.call(loincAnalytes, str(test.loinc)) ? loincAnalytes[str(test.loinc)] : undefined;
}

function numericResult(x: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const s = str(x).trim().replace(/^≤/, "<=").replace(/^≥/, ">=");
  const m = /^(<=|>=|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(s);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return undefined;
  return m[1] ? { value, comparator: m[1] as LabResultRow["comparator"] } : { value };
}

const unitKey = (s: string): string => s.toLowerCase().replace(/[µμ]/g, "u").replace(/²/g, "2").replace(/\s/g, "");
function converted(a: Analyte, value: number, unit: string): number | undefined {
  const u = unitKey(unit), target = unitKey(labUnits[a]);
  let factor: number | undefined, add = 0;
  if (u === target) factor = 1;
  else if (a === "ph" && ["", "ph", "unitless", "1"].includes(u)) factor = 1;
  else if (a === "egfr" && ["ml/min/1.73m^2", "ml/min/1.73m²", "ml/min/1.73sqm", "ml/min/1.73m2"].includes(u)) factor = 1;
  else if (a === "platelets" || a === "wbc") {
    if (["cells/ul", "cell/ul", "/ul", "cells/mm3"].includes(u)) factor = 0.001;
    if (["k/ul", "10^3/ul", "10³/ul", "x10^3/ul", "10e3/ul", "thou/ul", "10*9/l", "10^9/l"].includes(u)) factor = 1;
  } else if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") factor = 1;
  else if (a === "creatinine" && u === "umol/l") factor = 1 / 88.4;
  else if (a === "glucose" && u === "mmol/l") factor = 18.016;
  else if (a === "bun" && u === "mmol/l") factor = 2.801;
  else if (["cholesterol", "hdl", "ldl"].includes(a) && u === "mmol/l") factor = 38.67;
  else if (a === "triglycerides" && u === "mmol/l") factor = 88.57;
  else if (a === "hemoglobin" && u === "g/l") factor = 0.1;
  else if (a === "uacr" && u === "mg/mmol") factor = 8.84;
  else if (a === "uacr" && u === "ug/mg") factor = 1;
  else if (a === "troponin" && ["ng/l", "pg/ml"].includes(u)) factor = 0.001;
  else if (a === "lipase" && ["iu/l", "[iu]/l"].includes(u)) factor = 1;
  else if (a === "pco2" && u === "kpa") factor = 7.50062;
  else if (a === "bhb" && u === "mg/dl") factor = 1 / 10.41;
  else if (a === "a1c" && u === "mmol/mol") { factor = 0.09148; add = 2.152; }
  else if (target === "mg/dl" && u === "mg/l") factor = 0.1;
  if (factor === undefined) return undefined;
  const result = value * factor + add;
  return Number.isFinite(result) ? (factor === 1 && add === 0 ? value : Number(result.toPrecision(12))) : undefined;
}

function equation(d: Obj): NonNullable<LabResultRow["egfr_equation"]> {
  const t = obj(d.test), ref = obj(d.external_ref);
  const text = `${str(t?.name)} ${str(d.comment)} ${str(t?.nfm_code)} ${str(ref?.result_code)}`;
  if ((/ckd[ -]?epi/i.test(text) && /\b2021\b/.test(text)) || /egfr[-_ ]?(?:21|2021)/i.test(text)) return "ckd-epi-2021";
  if ((/ckd[ -]?epi/i.test(text) && /\b2009\b/.test(text)) || /egfr[-_ ]?(?:09|2009)/i.test(text)) return "ckd-epi-2009";
  if (/\bmdrd\b/i.test(text)) return "mdrd";
  return "unknown";
}

function raceVariant(d: Obj): -1 | 0 | 1 {
  const t = obj(d.test), ref = obj(d.external_ref);
  // The shared method comment can mention both populations; only component identity
  // determines which variant this particular result represents.
  const text = `${str(t?.name)} ${str(t?.nfm_code)} ${str(ref?.result_code)}`;
  if (/non[ -]?(?:african[ -]?american|black)|race[ -]?free|without.*race|\bEGFR[-_ ]?(?:NAA|09N|2009N|21|2021)\b/i.test(text)) return -1;
  if (/african[ -]?american|\bblack\b|\bEGFR[-_ ]?(?:AA|09A|2009A)\b/i.test(text)) return 1;
  return 0;
}

function labs(entries: Entry[]): LabResultRow[] {
  type Result = { entry: Entry; copies: Entry[]; analyte: Analyte; collection: Time; specimen: string; rank: number };
  const components = new Map<string, Result>();
  for (const e of entries) {
    const d = e.data;
    if (d.type !== "imported_result" || !oneOf(d.result_status, ["P", "F", "C"] as const)) continue;
    const a = analyte(d), collection = time(d.collected), test = obj(d.test), ref = obj(d.external_ref);
    if (!a || !collection) continue;
    const specimen = JSON.stringify([str(ref?.lab), str(ref?.accession) || e.item.id, collection.instant]);
    const key = JSON.stringify([specimen, str(ref?.result_code) || str(test?.nfm_code) || str(test?.loinc) || str(test?.name)]);
    const rank = { P: 0, F: 1, C: 2 }[d.result_status], old = components.get(key);
    const result: Result = { entry: e, copies: old ? [...old.copies, e] : [e], analyte: a, collection, specimen, rank };
    // Select before numeric parsing: an invalidated corrected value must not resurrect a
    // numeric preliminary or final copy of the same component.
    const resulted = eventInstant(d.resulted) ?? e.item.recorded;
    const oldResulted = old ? eventInstant(old.entry.data.resulted) ?? old.entry.item.recorded : 0;
    if (!old || rank > old.rank || (rank === old.rank && (resulted > oldResulted || (resulted === oldResulted && order(old.entry, e) < 0)))) components.set(key, result);
    else old.copies.push(e);
  }
  const results = [...components.values()], rows: LabResultRow[] = [];
  for (const r of results) {
    const d = r.entry.data, a = r.analyte, eq = equation(d);
    if (a === "egfr" && raceVariant(d) === 1 && results.some(other => other !== r && other.analyte === "egfr" && other.specimen === r.specimen && equation(other.entry.data) === eq && raceVariant(other.entry.data) !== 1)) continue;
    const numeric = numericResult(d.value);
    if (!numeric) continue;
    const value = converted(a, numeric.value, str(d.unit));
    if (value === undefined) continue;
    const row: LabResultRow = { analyte: a, value, unit: labUnits[a], collected: r.collection.rfc,
      status: d.result_status === "P" ? "preliminary" : "final", evidence: evidence(r.entry, ...r.copies.sort(order)) };
    if (numeric.comparator) row.comparator = numeric.comparator;
    if (a === "egfr") row.egfr_equation = eq;
    const loinc = str(obj(d.test)?.loinc);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  return rows.sort((a, b) => (time(a.collected)!.instant - time(b.collected)!.instant) || cmp(a.analyte, b.analyte) || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

function bloodPressure(x: unknown): [number, number] | undefined {
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(str(x));
  if (!m) return undefined;
  const s = Number(m[1]), d = Number(m[2]);
  return Number.isFinite(s) && Number.isFinite(d) ? [s, d] : undefined;
}

function vitals(entries: Entry[]): VitalRow[] {
  const rows: { row: VitalRow; entry: Entry }[] = [];
  for (const e of entries) {
    const d = e.data;
    if (d.type !== "vital_set") continue;
    const t = time(e.item.effective);
    if (!t) continue;
    const row: VitalRow = { setting: "clinic", local_time: t.local.slice(0, 16), evidence: evidence(e) };
    const bp = bloodPressure(d.bp), repeat = bloodPressure(d.bp_repeat);
    if (bp) [row.systolic_mmhg, row.diastolic_mmhg] = bp;
    if (repeat) [row.repeat_systolic_mmhg, row.repeat_diastolic_mmhg] = repeat;
    if (num(d.pulse_bpm)) row.pulse_bpm = d.pulse_bpm;
    if (num(d.weight_lb)) {
      const weight = Math.round(d.weight_lb * 0.45359237 * 10) / 10;
      if (Number.isFinite(weight)) row.weight_kg = weight;
    }
    if (Object.keys(row).length === 3) continue; // Only height/temperature/SpO2 has no target measurement.
    rows.push({ row, entry: e });
  }
  // Each Northgate vital_set already groups contemporaneous measurements and its repeat BP.
  // Distinct sets are retained; do not collapse different measurements merely by visit id.
  return rows.sort((a, b) => order(a.entry, b.entry)).map(r => r.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const entries = getEntries(countingItems(items, asOf));
  const problemRows = problems(entries);
  return {
    medications: medications(entries), problems: problemRows.rows,
    allergies: allergies(entries, problemRows.allergies), labs: labs(entries), vitals: vitals(entries),
  };
}
