import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// Payloads are checked at the boundary: the source's declarations are documentation,
// not a guarantee that an unrecognized or damaged entry can be read.
type ObjectValue = Record<string, unknown>;
const object = (v: unknown): ObjectValue =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? v as ObjectValue : {};
const string = (v: unknown): string => typeof v === "string" ? v : "";
const number = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const clean = (s: string): string => s.trim().replace(/\s+/g, " ");
const member = <T extends string>(v: unknown, choices: readonly T[]): v is T =>
  typeof v === "string" && (choices as readonly string[]).includes(v);
const emptyRows = (): ViewRows => ({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });

const chicago = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function wallTime(ms: number): string {
  const parts: Record<string, string> = {};
  for (const p of chicago.formatToParts(new Date(ms))) parts[p.type] = p.value;
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}
function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const y = +s.slice(0, 4), m = +s.slice(5, 7), d = +s.slice(8, 10);
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  return y > 0 && m >= 1 && m <= 12 && d >= 1 && d <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}
type Time = { local: string; ms: number; rfc?: string };
function time(v: unknown): Time | undefined {
  const s = string(v).trim();
  if (/^\d{4}(?:-\d{2})?$/.test(s)) {
    const padded = s.length === 4 ? `${s}-01-01` : `${s}-01`;
    if (!validDate(padded)) return;
    return { local: s, ms: Date.parse(`${padded}T06:00:00Z`) };
  }
  if (validDate(s)) return { local: s, ms: localInstant(`${s}T00:00:00`).ms };
  const m = s.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})?$/i);
  if (!m || !validDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] || 0) > 59) return;
  const local = `${m[1]}T${m[2]}:${m[3]}:${m[4] || "00"}${m[5] || ""}`;
  if (!m[6]) {
    const resolved = localInstant(local);
    return { local, ms: resolved.ms, rfc: local + resolved.offset };
  }
  const zone = m[6].toUpperCase().replace(/^([+-]\d{2})(\d{2})$/, "$1:$2");
  const rfc = local + zone, ms = Date.parse(rfc);
  if (!Number.isFinite(ms)) return;
  return { local: wallTime(ms), ms, rfc };
}
function localInstant(local: string): { ms: number; offset: string } {
  // Try both Chicago offsets, choosing the earlier occurrence of an ambiguous fall hour.
  // Offset-free timestamps retain their wall time even in a spring-forward gap.
  for (const offset of ["-05:00", "-06:00"]) {
    const ms = Date.parse(local + offset);
    if (wallTime(ms) === local.slice(0, 19)) return { ms, offset };
  }
  const midday = Date.parse(local.slice(0, 10) + "T18:00:00Z");
  const offset = wallTime(midday).slice(11, 13) === "13" ? "-05:00" : "-06:00";
  return { ms: Date.parse(local + offset), offset };
}
function localDate(v: unknown): string | undefined { return time(v)?.local.slice(0, 10); }
function onset(v: unknown): ProblemRow["onset"] {
  const o = object(v), d = string(o.date);
  if (!validDate(d)) return;
  if (o.precision === "year") return { value: d.slice(0, 4), precision: "year" };
  if (o.precision === "month") return { value: d.slice(0, 7), precision: "month" };
  if (o.precision === "day") return { value: d, precision: "day" };
}

type Item = { id: string; issuer: string; effective: unknown; recorded: Time; raw: ObjectValue };
type Entry = { item: Item; id?: string; data: ObjectValue; at: number };
function entryCompare(a: Entry, b: Entry): number {
  return a.at - b.at || a.item.recorded.ms - b.item.recorded.ms ||
    compare(a.item.id, b.item.id) || compare(a.id || "", b.id || "");
}
function evidence(...entries: Entry[]): Evidence {
  const seen = new Set<string>();
  return entries.slice().sort(entryCompare).flatMap(e => {
    const key = JSON.stringify([e.item.id, e.id]);
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ item_id: e.item.id, ...(e.id !== undefined ? { entry_id: e.id } : {}) }];
  });
}
function availableEntries(input: FolioItem[], asOf: string): Entry[] {
  const items: Item[] = [];
  for (const raw of Array.isArray(input) ? input : []) {
    const o = object(raw), recorded = time(o.recorded), id = string(o.id);
    if (!id || !recorded || recorded.local.length < 10 || recorded.local.slice(0, 10) > asOf) continue;
    items.push({ id, issuer: string(o.issuer), effective: o.effective, recorded, raw: o });
  }
  const key = (issuer: string, id: string): string => JSON.stringify([issuer, id]);
  const byId = new Map(items.map(i => [key(i.issuer, i.id), i]));
  const suppressed = new Set<string>();
  for (const i of items) {
    for (const id of strings(i.raw.retracts)) suppressed.add(key(i.issuer, id));
    const pending = strings(i.raw.supersedes).slice(), visited = new Set<string>();
    while (pending.length) {
      const id = pending.pop()!;
      if (visited.has(id)) continue;
      visited.add(id);
      const k = key(i.issuer, id);
      suppressed.add(k);
      const replaced = byId.get(k);
      if (replaced) pending.push(...strings(replaced.raw.supersedes));
    }
  }
  const entries: Entry[] = [];
  for (const i of items) {
    if (suppressed.has(key(i.issuer, i.id))) continue;
    const payload = object(i.raw.payload), at = time(i.effective)?.ms ?? i.recorded.ms;
    if (typeof payload.type === "string") entries.push({ item: i, data: payload, at });
    else for (const id of Object.keys(payload).sort(compare)) {
      const data = object(payload[id]);
      if (typeof data.type === "string") entries.push({ item: i, id, data, at });
    }
  }
  return entries.sort(entryCompare);
}
function byLine(entries: Entry[], type: string, field: string, actions: readonly string[]): Map<string, Entry[]> {
  const result = new Map<string, Entry[]>();
  for (const e of entries) {
    const id = string(e.data[field]);
    if (e.data.type !== type || !id || !member(e.data.action, actions)) continue;
    const line = result.get(id) || [];
    line.push(e);
    result.set(id, line);
  }
  return result;
}

// Text aliases only. Product RxNorm CUIs and outside codes are deliberately never
// converted to ingredient CUIs; only allergy entries supply ingredient-level codes.
const brands: Record<string, string> = {
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  humalog: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart", levemir: "insulin detemir", tresiba: "insulin degludec",
  glucophage: "metformin", fortamet: "metformin", glumetza: "metformin", jardiance: "empagliflozin", farxiga: "dapagliflozin",
  invokana: "canagliflozin", januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  amaryl: "glimepiride", glucotrol: "glipizide", actos: "pioglitazone",
  cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  norvasc: "amlodipine", procardia: "nifedipine", adalat: "nifedipine", cardizem: "diltiazem",
  lopressor: "metoprolol", toprol: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  lasix: "furosemide", demadex: "torsemide", bumex: "bumetanide", aldactone: "spironolactone", inspra: "eplerenone",
  microzide: "hydrochlorothiazide", hctz: "hydrochlorothiazide", hygroton: "chlorthalidone",
  kerendia: "finerenone", lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  zetia: "ezetimibe", tricor: "fenofibrate", plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", pradaxa: "dabigatran", synthroid: "levothyroxine", levoxyl: "levothyroxine",
  protonix: "pantoprazole", prilosec: "omeprazole", nexium: "esomeprazole", pepcid: "famotidine",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", singulair: "montelukast",
  keflex: "cephalexin", amoxil: "amoxicillin", zithromax: "azithromycin", cipro: "ciprofloxacin",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine", benadryl: "diphenhydramine",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine",
  wellbutrin: "bupropion", cymbalta: "duloxetine", effexor: "venlafaxine", remeron: "mirtazapine",
  seroquel: "quetiapine", abilify: "aripiprazole", risperdal: "risperidone", zyprexa: "olanzapine",
  depakote: "divalproex", neurontin: "gabapentin", lyrica: "pregabalin", ativan: "lorazepam", xanax: "alprazolam",
  flomax: "tamsulosin", proscar: "finasteride", zyloprim: "allopurinol", uloric: "febuxostat",
  hyzaar: "losartan / hydrochlorothiazide", janumet: "sitagliptin / metformin", synjardy: "empagliflozin / metformin",
  entresto: "sacubitril / valsartan", augmentin: "amoxicillin / clavulanic acid",
  bactrim: "sulfamethoxazole / trimethoprim", suboxone: "buprenorphine / naloxone",
};
function genericPart(name: string): string | undefined {
  let s = clean(name.toLowerCase())
    .replace(/^(?:otc\s+|over[ -]the[ -]counter\s+)/, "")
    .replace(/^\d+(?:\.\d+)?\s*(?:ml|hr|hour)\s+/i, "")
    .replace(/^\d+(?:\.\d+)?\s*(?:ml|hr|hour)\s+/i, "");
  const first = s.match(/^[a-z]+/)?.[0];
  if (first && Object.hasOwn(brands, first)) return brands[first];
  s = s.replace(/\[[^\]]*\]/g, "").replace(/\([^)]*\)/g, "")
    .replace(/\s+\d.*$/, "")
    .replace(/\b(?:hydrochloride|hcl|hydrobromide|hbr|trihydrate|dihydrate|monohydrate|besylate|besilate|succinate|tartrate|maleate|fumarate|mesylate)\b/g, "")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|modified[ -]release|sustained[ -]release)\b/g, "")
    .replace(/\b(?:oral|tablet[s]?|capsule[s]?|solution|suspension|injection|injectable|pen|injector|inhaler|aerosol|powder|cream|ointment|topical|ophthalmic|nasal|patch|sublingual|chewable|disintegrating|er|xr|xl|sr|dr|hfa|usp|solostar|kwikpen|flextouch)\b.*$/, "");
  s = clean(s).replace(/[ ,;:-]+$/, "");
  if (/^(?:losartan|diclofenac|levothyroxine|naproxen|atorvastatin|rosuvastatin|pravastatin|alendronate|pantoprazole|montelukast)\s+(?:sodium|potassium|calcium)$/.test(s)) s = s.split(" ")[0];
  s = s.replace(/^(insulin (?:glargine|lispro|aspart))-[a-z]{4}$/, "$1");
  if (!s || /^(?:unknown|unspecified|unidentified|medication|drug|none|n\/a)\b/.test(s) || !/^[a-z][a-z0-9 '\-/]*$/.test(s)) return;
  return Object.hasOwn(brands, s) ? brands[s] : s;
}
function ingredients(name: string): string[] {
  // A slash followed by a concentration denominator is not an ingredient separator.
  const pieces = name.split(/\s*\/\s*(?!\s*(?:(?:ml|l|dl|actuation|puff|dose|hr|hour)\b|\d))/i);
  return [...new Set(pieces.flatMap(p => (genericPart(p) || "").split(" / ").filter(Boolean)))];
}
const psychiatricDrugs = /\b(?:sertraline|fluoxetine|escitalopram|citalopram|paroxetine|bupropion|venlafaxine|desvenlafaxine|mirtazapine|quetiapine|aripiprazole|risperidone|olanzapine|buspirone|lithium)\b/i;
function sensitivity(d: ObjectValue, text: string, code = ""): Sensitivity[] | undefined {
  const categories = new Set<Sensitivity>();
  if (d.restricted === "BH" || /\b(?:depress(?:ion|ive)|anxiety|bipolar|schizophren\w*|psychosis|PTSD|ADHD|post[- ]traumatic stress|obsessive.compulsive)\b/i.test(text) || psychiatricDrugs.test(text) || /^F(?!1[0-9])\d{2}/i.test(code)) categories.add("mental-health");
  if (/^F1\d/i.test(code) || /\b(?:(?:alcohol|opioid|cocaine|cannabis|substance|tobacco|nicotine).{0,25}(?:disorder|dependence|abuse)|buprenorphine)\b/i.test(text)) categories.add("substance-use");
  if (/^(?:O\d|Z3[0-6]|N97|N46)/i.test(code) || /\b(?:pregnan\w*|contracepti\w*|infertility|fertility|endometriosis)\b/i.test(text)) categories.add("sexual-reproductive-health");
  if (/^(?:B2[0-4]|Z21(?:\.|$)|A[56]\d)/i.test(code) || /\b(?:HIV|human immunodeficiency|AIDS|chlamydia|gonorrh\w*|syphilis|genital herpes|antiretroviral)\b/i.test(text)) categories.add("hiv-sti");
  if (/\b(?:hereditary|inherited|BRCA[12]?|cystic fibrosis|sickle.cell|Huntington|autosomal|polycystic kidney)\b/i.test(text)) categories.add("genetic");
  return categories.size ? [...categories] : undefined;
}
function doseUnit(v: unknown): NonNullable<MedicationRow["dose"]>["unit"] | undefined {
  const u = string(v).trim().toLowerCase();
  if (/^(?:mg|milligrams?)$/.test(u)) return "mg";
  if (/^(?:mcg|[µμ]g|micrograms?)$/.test(u)) return "mcg";
  if (/^(?:u|iu|unt|units?|unit\(s\))$/.test(u)) return "units";
  if (/^(?:ml|cc|milliliters?|millilitres?)$/.test(u)) return "mL";
  if (/^(?:tabs?|tablets?|tab\(s\))$/.test(u)) return "tablet";
}
function dose(d: ObjectValue, name: string, ingredient: string, count: number): MedicationRow["dose"] {
  const source = object(d.dose), unit = doseUnit(source.unit), value = source.value;
  // In this schema an absent dose is intentional (e.g. sliding scale), not an
  // invitation to extract a single amount from a complicated sig.
  if (!number(value) || value < 0 || !unit || /\bsliding\s+scale\b|\d\s*[-–]\s*\d|\bdepending on\b/i.test(string(d.sig))) return;
  if (unit !== "tablet") return count === 1 ? { value, unit } : undefined;
  let part = name;
  if (count > 1) {
    part = name.split(/\s+\/\s+/).find(p => ingredients(p).includes(ingredient)) || "";
    if (!part || ingredients(part).length !== 1) {
      // Branded combinations list strengths in the ingredient order on the label.
      // Only interpret a complete, unambiguous pair; do not assign one aggregate
      // mass to every component of a combination.
      const pair = name.match(/\b(\d+(?:\.\d+)?)\s*(mg|mcg)?\s*[-/]\s*(\d+(?:\.\d+)?)\s*(mg|mcg)\b/i);
      const names = ingredients(name), index = names.indexOf(ingredient);
      if (pair && count === 2 && index >= 0) {
        const mass = value * +(index === 0 ? pair[1] : pair[3]);
        const u = doseUnit(index === 0 ? pair[2] || pair[4] : pair[4]);
        if (u && Number.isFinite(mass)) return { value: +mass.toPrecision(14), unit: u };
      }
      return;
    }
  }
  const strengths = [...part.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg|[µμ]g|milligrams?|micrograms?)\b/gi)];
  if (strengths.length === 1 && !/\b(?:mg|mcg)\s*\//i.test(part)) {
    const u = doseUnit(strengths[0][2]);
    const mass = value * +strengths[0][1];
    if (u && Number.isFinite(mass)) return { value: +mass.toPrecision(14), unit: u };
  }
  if (count === 1 && strengths.length === 0) return { value, unit };
}
function frequency(d: ObjectValue): MedicationRow["frequency"] {
  if (member(d.frequency, ["QD", "BID", "TID", "QHS", "PRN"] as const)) return d.frequency;
  if (d.frequency !== undefined && d.frequency !== "OTHER") return;
  const sig = string(d.sig);
  if (/\bas needed\b|\bprn\b/i.test(sig)) return "PRN";
  if (/\btaper\w*\b|every other|four times|every (?:4|6) hours/i.test(sig)) return "other";
  if (/\b(?:once (?:a |per )?week|weekly|every 7 days)\b/i.test(sig)) return "QW";
  if (/\b(?:twice (?:a )?daily|twice a day|two times (?:a )?day|every 12 hours|bid)\b/i.test(sig)) return "BID";
  if (/\b(?:three times (?:a )?(?:day|daily)|every 8 hours|tid)\b/i.test(sig)) return "TID";
  if (/\b(?:bedtime|nightly|at night|qhs)\b/i.test(sig)) return "QHS";
  if (/\b(?:daily|every (?:day|24 hours)|qd)\b/i.test(sig)) return "QD";
  if (d.frequency === "OTHER") return "other";
}
function medicationRows(entries: Entry[]): MedicationRow[] {
  const chosen = new Map<string, { entry: Entry; row: MedicationRow }>();
  for (const [id, history] of byLine(entries, "med_event", "med_id", ["start", "change", "hold", "resume", "stop"])) {
    const e = history[history.length - 1], d = e.data, name = string(object(d.drug).name);
    if (!name.trim()) continue;
    const status: MedicationRow["status"] = d.action === "hold" ? "held" : d.action === "stop" ? "stopped" : "active";
    let since: Entry | undefined = e;
    if (d.action === "change") {
      since = undefined;
      for (let i = history.length - 2; i >= 0; i--) {
        const action = history[i].data.action;
        if (action === "hold" || action === "stop") break;
        if (action === "start" || action === "resume") { since = history[i]; break; }
      }
    }
    const names = ingredients(name);
    for (const ingredient of names.length ? names : [undefined]) {
      const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: evidence(e, ...(since ? [since] : [])) };
      if (ingredient) row.ingredient = ingredient;
      const statusDate = since && localDate(since.item.effective);
      if (statusDate) row.status_since = statusDate;
      const amount = dose(d, name, ingredient || "", Math.max(names.length, 1));
      if (amount) row.dose = amount;
      const schedule = frequency(d);
      if (schedule) row.frequency = schedule;
      if (status === "stopped" && member(d.stop_reason, ["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"] as const)) row.stop_reason = d.stop_reason;
      if (string(d.reason_text)) row.status_reason_text = string(d.reason_text);
      if (/\bOTC\b|\bover[ -]the[ -]counter\b/i.test(`${name} ${string(d.sig)}`)) row.otc = true;
      const tags = sensitivity(d, `${ingredient || name} ${string(d.reason_text)}`);
      if (tags) row.sensitivity = tags;
      const key = ingredient || `unknown:${id}`;
      const previous = chosen.get(key);
      if (!previous || entryCompare(previous.entry, e) <= 0) chosen.set(key, { entry: e, row });
    }
  }
  return [...chosen.entries()].sort(([a], [b]) => compare(a, b)).map(([, x]) => x.row);
}

function conditionKey(d: ObjectValue): string {
  const code = string(d.icd10cm).toUpperCase(), name = string(d.description || d.display).toLowerCase();
  if (/^N18(?:\.|$)/.test(code) || /\b(?:ckd|chronic kidney disease)\b/.test(name)) return "ckd";
  if (code) return `icd:${code}`;
  if (string(d.snomed)) return `snomed:${string(d.snomed)}`;
  return `text:${clean(name)}`;
}
function isUnconfirmed(text: string): boolean {
  return /\b(?:rule[ -]out|r\/o|suspected|possible|probable|provisional|ruled out|no evidence of)\b/i.test(text);
}
function problemCandidates(entries: Entry[]): Entry[] {
  const explicit: Entry[] = [], covered = new Set<string>();
  for (const history of byLine(entries, "problem_event", "problem_id", ["add", "update", "resolve", "remove"]).values()) {
    // Old referral snapshots must not revive a removed problem or undo its restaging.
    for (const e of history) covered.add(conditionKey(e.data));
    const e = history[history.length - 1];
    if (e.data.action !== "remove") explicit.push(e);
  }
  const referrals = new Map<string, Entry>();
  for (const e of entries) {
    if (e.data.type !== "referral_dx" || !string(e.data.display)) continue;
    const key = conditionKey(e.data);
    if (!covered.has(key)) referrals.set(key, e);
  }
  const chosen = new Map<string, Entry>();
  for (const e of [...explicit, ...referrals.values()].sort(entryCompare)) chosen.set(conditionKey(e.data), e);
  return [...chosen.values()].sort(entryCompare);
}
function problemRow(e: Entry): ProblemRow | undefined {
  const d = e.data, condition = string(d.description || d.display), code = string(d.icd10cm);
  if (!condition || isUnconfirmed(condition)) return;
  // A pure adverse-effect code names the drug, not a separate disease.
  if (/^(?:adverse (?:effect|reaction)|allergy|intolerance)\s+(?:of|to)\b/i.test(condition)) return;
  const row: ProblemRow = { condition, status: d.action === "resolve" ? "resolved" : "active", evidence: evidence(e) };
  if (code) row.icd10cm = code;
  if (string(d.snomed)) row.snomed = string(d.snomed);
  const began = onset(d.onset);
  if (began) row.onset = began;
  if (conditionKey(d) === "ckd") {
    const stated = condition.match(/\b(?:G\s*|stage\s*)([1-5](?:[ab])?)\b/i)?.[1].toLowerCase();
    const stages: Record<string, ProblemRow["ckd_stage"]> = { "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5" };
    const codes: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
    const stage = (stated && stages[stated]) || codes[code.toUpperCase()];
    if (stage) row.ckd_stage = stage;
    const albumin = condition.match(/\bA([123])\b/i)?.[1];
    if (albumin) row.albuminuria = `A${albumin}` as "A1" | "A2" | "A3";
  }
  const tags = sensitivity(d, condition, code);
  if (tags) row.sensitivity = tags;
  return row;
}

const hypersensitivity = /\b(?:hives|urticaria|rash|angioedema|anaphyla\w*|bronchospasm|(?:lip|face|facial|tongue|throat)\s+swelling|swelling\s+(?:of\s+)?(?:the\s+)?(?:lips|face|tongue|throat))\b/i;
const seriousReaction = /\b(?:ketoacidosis|DKA|pancreatitis|hepatotoxicity|liver (?:injury|failure)|hepatitis|acute kidney injury|renal failure|agranulocytosis|rhabdomyolysis|major bleeding|severe hypoglycemia|lactic acidosis|arrhythmia|torsades)\b/i;
const sideEffect = /\b(?:cough|nausea|vomiting|diarrh\w*|drowsiness|sedation|constipation|stomach upset|dizziness)\b/i;
function classifyReaction(reaction: string, source: unknown): AllergyIntoleranceRow["reaction_type"] | undefined {
  if (hypersensitivity.test(reaction)) return "hypersensitivity";
  if (seriousReaction.test(reaction)) return "serious_adverse_event";
  if (sideEffect.test(reaction)) return "side_effect";
  if (source === "allergy") return "hypersensitivity";
  if (source === "intolerance") return "side_effect";
  if (source === "adverse_reaction") return "serious_adverse_event";
}
function mechanism(reaction: string, source: unknown, substance: string): AllergyIntoleranceRow["mechanism"] {
  if (source === "allergy") return "immune"; // Northgate explicitly defines this code as immune-mediated.
  if (source === "intolerance") return "non_immune";
  if (/\b(?:ketoacidosis|DKA|lactic acidosis|hypoglycemia|rhabdomyolysis)\b/i.test(reaction)) return "non_immune";
  if (/\b(?:lisinopril|enalapril|ramipril|benazepril|captopril|ACE inhibitor)\b/i.test(substance) && /\b(?:cough|angioedema)\b/i.test(reaction)) return "non_immune";
  return "unknown";
}
function allergySubstance(name: string, hasCode: boolean): string {
  const first = name.toLowerCase().match(/^[a-z]+/)?.[0] || "";
  // Preserve foods, environmental substances, drug classes and combinations.
  if (/\b(?:antibiotics|inhibitors|blockers|penicillins|sulfonamides|NSAIDs|opioids)\b/i.test(name) || name.includes(" / ")) return name;
  const names = ingredients(name);
  if (hasCode || Object.hasOwn(brands, first) || (names.length === 1 && knownGenerics.has(names[0]))) {
    if (names.length === 1) return names[0];
  }
  return name;
}
function allergyRow(e: Entry): AllergyIntoleranceRow | undefined {
  const d = e.data, source = object(d.substance), name = string(source.name), reaction = strings(d.reactions).join("; ");
  if (!name || /^(?:no known|nka\b|nkda\b)/i.test(name)) return;
  const type = classifyReaction(reaction, d.reaction_type);
  if (!type) return;
  const substance = allergySubstance(name, !!string(source.rxnorm));
  const row: AllergyIntoleranceRow = {
    substance, reaction_type: type, mechanism: mechanism(reaction, d.reaction_type, substance),
    criticality: member(d.severity, ["low", "high", "unknown"] as const) ? d.severity : "unknown",
    evidence: evidence(e),
  };
  if (string(source.rxnorm)) row.rxnorm_ingredient = string(source.rxnorm);
  if (reaction) row.reaction = reaction;
  const began = onset(d.onset);
  if (began) row.onset = began;
  const tags = sensitivity(d, substance);
  if (tags) row.sensitivity = tags;
  return row;
}
const knownGenerics = new Set([
  ...Object.values(brands).flatMap(s => s.split(" / ")),
  "prednisone", "prednisolone", "amitriptyline", "trazodone", "hydroxyzine", "hydralazine", "clonidine",
  "aspirin", "erythromycin", "isoniazid", "valproate", "valproic acid", "acetaminophen", "penicillin", "cefdinir",
  "cefaclor", "ceftriaxone", "nitrofurantoin", "doxycycline", "sulfamethoxazole", "trimethoprim", "sulfasalazine",
]);
function attributedAllergy(e: Entry, entries: Entry[]): AllergyIntoleranceRow | undefined {
  const d = e.data, text = string(d.description || d.display);
  if (isUnconfirmed(text)) return;
  let reaction = "", drug = "", className = false;
  let m = text.match(/^(.+?)\s+(?:due to|caused by|attributed to|secondary to|from|on)\s+(.+)$/i);
  if (m) { reaction = clean(m[1]); drug = clean(m[2]); }
  else if ((m = text.match(/^(.+?)[ -](?:induced|associated)\s+(.+)$/i))) { drug = clean(m[1]); reaction = clean(m[2]); }
  else if ((m = text.match(/^(?:adverse (?:effect|reaction)|allergy|intolerance)\s+(?:of|to)\s+(.+)$/i))) drug = clean(m[1]);
  if ((!drug || /^(?:drug|medication)s?$/i.test(drug)) && /^T36\.0X5/i.test(string(d.icd10cm))) drug = "penicillins";
  if (!drug) return;
  const parenthesized = drug.match(/\(([^)]+)\)/)?.[1];
  const specific = parenthesized && genericPart(parenthesized);
  if (specific && knownGenerics.has(specific)) drug = specific;
  drug = drug.replace(/[,;].*$/, "").replace(/\s*\([^)]*\)\s*$/, "").replace(/\s*,?\s*(?:initial|subsequent) encounter$/i, "");
  className = /\b(?:penicillins|cephalosporins|sulfonamides|sulfonamide antibiotics|ACE inhibitors?|SGLT2 inhibitors?|statins|NSAIDs|opioids)\b/i.test(drug);
  const normalized = genericPart(drug);
  // Do not reinterpret non-drug causes (e.g. CKD due to diabetes) as allergies.
  if (!className && (!normalized || !knownGenerics.has(normalized))) return;
  let substance = className ? drug : normalized!;
  if (className) {
    const classPattern = /penicillins/i.test(drug) ? /^(?:amoxicillin|ampicillin|penicillin|piperacillin)$/ :
      /ACE inhibitors?/i.test(drug) ? /pril$/ : /SGLT2/i.test(drug) ? /gliflozin$/ : /statins/i.test(drug) ? /statin$/ : undefined;
    if (classPattern) {
      const matches = new Set(entries.filter(x => x.item.id === e.item.id && x.data.type === "med_event")
        .flatMap(x => ingredients(string(object(x.data.drug).name))).filter(s => classPattern.test(s)));
      if (matches.size === 1) substance = [...matches][0];
    }
  }
  const type = classifyReaction(reaction, undefined);
  // A bare adverse-effect code provides no mechanism or manifestation. Its explicit
  // adverse-effect assertion still supports an avoidance row, with unknown criticality.
  const row: AllergyIntoleranceRow = {
    substance, reaction_type: type || (/^allergy\b/i.test(text) ? "hypersensitivity" : /^intolerance\b/i.test(text) ? "side_effect" : "serious_adverse_event"),
    mechanism: mechanism(reaction, undefined, substance), criticality: "unknown", evidence: evidence(e),
  };
  if (reaction) row.reaction = reaction;
  const began = onset(d.onset);
  if (began) row.onset = began;
  const tags = sensitivity(d, `${text} ${substance}`, string(d.icd10cm));
  if (tags) row.sensitivity = tags;
  return row;
}
function allergyRows(entries: Entry[], problems: Entry[]): AllergyIntoleranceRow[] {
  const rows: AllergyIntoleranceRow[] = [], explicit = new Map<string, Entry>();
  for (const history of byLine(entries, "allergy_event", "allergy_id", ["add", "update", "inactivate"]).values()) {
    const e = history[history.length - 1], s = object(e.data.substance);
    const name = allergySubstance(string(s.name), !!string(s.rxnorm)).toLowerCase();
    const prev = explicit.get(name);
    if (!prev || entryCompare(prev, e) < 0) explicit.set(name, e);
    if (e.data.action !== "inactivate") {
      const row = allergyRow(e);
      if (row) rows.push(row);
    }
  }
  const inferred = new Map<string, { entry: Entry; row: AllergyIntoleranceRow }>();
  for (const e of problems) {
    const row = attributedAllergy(e, entries);
    if (!row) continue;
    const key = row.substance.toLowerCase(), existing = explicit.get(key);
    if (existing && (existing.data.action !== "inactivate" || entryCompare(existing, e) >= 0)) continue;
    inferred.set(key, { entry: e, row });
  }
  rows.push(...[...inferred.values()].map(x => x.row));
  return rows.sort((a, b) => compare(a.substance, b.substance) || compare(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

const labUnits: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const labCodes: Record<string, Analyte> = {
  CREAT: "creatinine", CREA: "creatinine", CREATININE: "creatinine", SCR: "creatinine",
  K: "potassium", POTASSIUM: "potassium", NA: "sodium", SODIUM: "sodium", CL: "chloride", CHLORIDE: "chloride",
  CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate", BICARB: "bicarbonate", BICARBONATE: "bicarbonate",
  AG: "anion_gap", AGAP: "anion_gap", ANIONGAP: "anion_gap", BUN: "bun", UREANITROGEN: "bun",
  GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", MALBCR: "uacr", PLT: "platelets", PLATELETS: "platelets",
  WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", HEMOGLOBIN: "hemoglobin",
  BHB: "bhb", BHOB: "bhb", BETAHYDROXYBUTYRATE: "bhb", PH: "ph", VPH: "ph", APH: "ph",
  PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2", LIP: "lipase", LIPASE: "lipase",
  TNI: "troponin", TROI: "troponin", TROPI: "troponin", TROPONINI: "troponin", HSTNI: "troponin",
  CHOL: "cholesterol", TC: "cholesterol", TCHOL: "cholesterol", CHOLESTEROL: "cholesterol",
  TG: "triglycerides", TRIG: "triglycerides", TRIGLYCERIDES: "triglycerides",
  HDL: "hdl", HDLC: "hdl", LDL: "ldl", LDLC: "ldl", LDLCALC: "ldl", LDLDIRECT: "ldl",
};
const loincAnalytes: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "48642-3": "egfr", "48643-1": "egfr", "62238-1": "egfr", "98979-8": "egfr",
  "2823-3": "potassium", "2951-2": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate",
  "33037-3": "anion_gap", "10466-1": "anion_gap", "3094-0": "bun", "2345-7": "glucose", "4548-4": "a1c", "17856-6": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin", "2731-8": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2019-8": "pco2", "2021-4": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl",
};
function analyteOf(d: ObjectValue): Analyte | undefined {
  const t = object(d.test), name = string(t.name), code = string(t.nfm_code).toUpperCase().replace(/[^A-Z0-9]/g, "");
  // Exclude lookalikes before broad display-name matching.
  if (/troponin\s*T\b/i.test(name) || /^(?:TNT|TROPT|TROPONINT|HSTNT)$/.test(code)) return;
  if (/\b(?:egfr|estimated (?:glomerular filtration|gfr))\b/i.test(name) || /^EGFR/.test(code)) return "egfr";
  if (labCodes[code]) return labCodes[code];
  if (Object.hasOwn(loincAnalytes, string(t.loinc))) return loincAnalytes[string(t.loinc)];
  if (/(?:albumin|microalbumin).*(?:creatinine).*(?:ratio|\brat\b)|(?:albumin|microalbumin)\s*[/:]\s*creatinine/i.test(name)) return "uacr";
  if (/\bcreatinine\b/i.test(name) && !/urine|urinary|ratio|clearance/i.test(name)) return "creatinine";
  if (/\bpotassium\b/i.test(name) && !/urine|urinary/i.test(name)) return "potassium";
  if (/\bsodium\b/i.test(name) && !/urine|urinary/i.test(name)) return "sodium";
  if (/\bchloride\b/i.test(name) && !/urine|urinary/i.test(name)) return "chloride";
  if (/bicarbonate|carbon dioxide,? total|total (?:carbon dioxide|CO2)/i.test(name)) return "bicarbonate";
  if (/anion gap/i.test(name)) return "anion_gap";
  if (/\b(?:urea nitrogen|BUN)\b/i.test(name)) return "bun";
  if (/\bglucose\b/i.test(name) && !/urine|urinary|home|meter/i.test(name)) return "glucose";
  if (/\b(?:A1c|HbA1c|hemoglobin A1c|glycated hemoglobin)\b/i.test(name)) return "a1c";
  if (/\bplatelet(?:s| count)?\b/i.test(name)) return "platelets";
  if (/\b(?:WBC|white (?:blood )?cell(?:s| count)?|leukocyte count)\b/i.test(name)) return "wbc";
  if (/^hemoglobin(?:,|$|\s+(?:blood|total))|^hgb\b/i.test(name)) return "hemoglobin";
  if (/beta[ -]?hydroxybutyrate|β[ -]?hydroxybutyrate/i.test(name)) return "bhb";
  if (/\bpH\b/.test(name) && !/urine|urinary/i.test(name)) return "ph";
  if (/\bpCO2\b|partial pressure of (?:CO2|carbon dioxide)/i.test(name)) return "pco2";
  if (/\blipase\b/i.test(name)) return "lipase";
  if (/\btroponin\s*I\b/i.test(name)) return "troponin";
  if (/\b(?:LDL|low.density lipoprotein)\b/i.test(name)) return "ldl";
  if (/\b(?:HDL|high.density lipoprotein)\b/i.test(name)) return "hdl";
  if (/\btriglycerides?\b/i.test(name)) return "triglycerides";
  if (/\bcholesterol\b/i.test(name) && !/ratio|non.HDL/i.test(name)) return "cholesterol";
}
function normalizedUnit(s: string): string {
  return s.toLowerCase().replace(/[µμ]/g, "u").replace(/\s/g, "").replace(/²/g, "2").replace(/\^/g, "*");
}
function converted(value: number, unit: string, analyte: Analyte): number | undefined {
  const u = normalizedUnit(unit), target = normalizedUnit(labUnits[analyte]);
  if (u === target) return value;
  let factor: number | undefined;
  if ((analyte === "wbc" || analyte === "platelets")) {
    if (["cells/ul", "cell/ul", "/ul", "cells/mm3"].includes(u)) factor = 0.001;
    else if (["k/ul", "10*3/ul", "x10*3/ul", "10e3/ul", "10*9/l", "x10*9/l", "thou/ul"].includes(u)) factor = 1;
  } else if (analyte === "egfr" && /^ml\/min\/(?:1\.73m2|1\.73\*m2|1\.73m\*2)$/.test(u)) factor = 1;
  else if (analyte === "ph" && ["", "ph", "1"].includes(u)) factor = 1;
  else if (analyte === "creatinine" && u === "umol/l") factor = 1 / 88.4;
  else if (analyte === "glucose" && u === "mmol/l") factor = 18.016;
  else if (analyte === "bun" && u === "mmol/l") factor = 2.801;
  else if (["cholesterol", "hdl", "ldl"].includes(analyte) && u === "mmol/l") factor = 38.67;
  else if (analyte === "triglycerides" && u === "mmol/l") factor = 88.57;
  else if (analyte === "hemoglobin" && u === "g/l") factor = 0.1;
  else if (analyte === "troponin" && ["ng/l", "pg/ml"].includes(u)) factor = 0.001;
  else if (analyte === "troponin" && u === "ug/l") factor = 1;
  else if (analyte === "uacr" && u === "ug/mg") factor = 1;
  else if (analyte === "uacr" && u === "mg/mmol") factor = 8.84;
  else if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(analyte) && u === "meq/l") factor = 1;
  else if (analyte === "pco2" && u === "kpa") factor = 7.50062;
  else if (analyte === "lipase" && u === "iu/l") factor = 1;
  else if (analyte === "bhb" && u === "mg/dl") factor = 1 / 10.41;
  const result = factor === undefined ? undefined : value * factor;
  return result !== undefined && Number.isFinite(result) ? +result.toPrecision(14) : undefined;
}
function equation(e: Entry): LabResultRow["egfr_equation"] {
  const d = e.data, test = object(d.test), ext = object(d.external_ref);
  const method = `${string(test.name)} ${string(d.comment)}`;
  if (/CKD[ -]?EPI.{0,15}2021|2021.{0,15}CKD[ -]?EPI/i.test(method)) return "ckd-epi-2021";
  if (/CKD[ -]?EPI.{0,15}2009|2009.{0,15}CKD[ -]?EPI/i.test(method)) return "ckd-epi-2009";
  if (/\bMDRD\b/i.test(method)) return "mdrd";
  const code = `${string(test.nfm_code)} ${string(ext.result_code)}`;
  if (/EGFR[- ]?(?:2021|21)/i.test(code)) return "ckd-epi-2021";
  if (/EGFR[- ]?(?:2009|09)/i.test(code)) return "ckd-epi-2009";
  return "unknown";
}
function raceVariant(e: Entry): "adjusted" | "unadjusted" | "unspecified" {
  const t = object(e.data.test), ext = object(e.data.external_ref), name = string(t.name);
  const code = `${string(t.nfm_code)} ${string(ext.result_code)}`.toUpperCase();
  // Method comments may mention BOTH variants. Only the component identity tells
  // which one this value represents.
  if (/non[ -]?(?:african|black|AA)|without.*race|race[ -]?(?:free|neutral)/i.test(name) || /EGFR[- ]?(?:NAA|(?:09|2009)N)\b/.test(code)) return "unadjusted";
  if (/african[ -]?american|\bblack\b|with.*race coefficient/i.test(name) || /EGFR[- ]?(?:AA|(?:09|2009)A)\b/.test(code)) return "adjusted";
  return "unspecified";
}
function labIdentity(e: Entry): string {
  const d = e.data, ext = object(d.external_ref), t = object(d.test);
  if (string(ext.accession) && string(ext.result_code)) return JSON.stringify([e.item.issuer, ext.lab, ext.accession, ext.result_code]);
  if (string(d.order_id)) return JSON.stringify([e.item.issuer, d.order_id, time(d.collected)?.ms, t.nfm_code || t.loinc || t.name]);
  return JSON.stringify([e.item.issuer, e.item.id, e.id]);
}
function specimenIdentity(e: Entry): string {
  const ext = object(e.data.external_ref);
  return JSON.stringify([e.item.issuer, ext.lab, ext.accession || e.item.id, time(e.data.collected)?.ms, equation(e)]);
}
function labRows(entries: Entry[]): LabResultRow[] {
  const copies = new Map<string, Entry[]>();
  for (const e of entries) {
    if (e.data.type !== "imported_result" || !member(e.data.result_status, ["P", "F", "C"])) continue;
    const id = labIdentity(e), group = copies.get(id) || [];
    group.push(e); copies.set(id, group);
  }
  const rank: Record<string, number> = { P: 0, F: 1, C: 2 };
  const selected = [...copies.values()].map(group => {
    group.sort((a, b) => rank[string(a.data.result_status)] - rank[string(b.data.result_status)] ||
      (time(a.data.resulted)?.ms ?? a.item.recorded.ms) - (time(b.data.resulted)?.ms ?? b.item.recorded.ms) ||
      a.item.recorded.ms - b.item.recorded.ms || entryCompare(a, b));
    return { e: group[group.length - 1], group };
  });
  const unadjusted = new Set(selected.filter(({ e }) => analyteOf(e.data) === "egfr" && raceVariant(e) !== "adjusted").map(({ e }) => specimenIdentity(e)));
  const rows: LabResultRow[] = [];
  for (const { e, group } of selected) {
    const d = e.data, analyte = analyteOf(d), collected = time(d.collected)?.rfc;
    if (!analyte || !collected) continue;
    if (analyte === "egfr" && raceVariant(e) === "adjusted" && unadjusted.has(specimenIdentity(e))) continue;
    // Choose a correction BEFORE parsing its value: a nonnumeric corrected value
    // withdraws the old number, rather than falling back to it.
    const m = string(d.value).trim().match(/^(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/);
    if (!m) continue;
    const raw = +m[2];
    if (!Number.isFinite(raw) || typeof d.unit !== "string") continue;
    const value = converted(raw, d.unit, analyte);
    if (value === undefined) continue;
    const row: LabResultRow = {
      analyte, value, unit: labUnits[analyte], collected,
      status: d.result_status === "P" ? "preliminary" : "final", evidence: evidence(...group),
    };
    if (m[1]) row.comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as LabResultRow["comparator"];
    if (analyte === "egfr") row.egfr_equation = equation(e);
    const loinc = string(object(d.test).loinc);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  return rows.sort((a, b) => (time(a.collected)!.ms - time(b.collected)!.ms) || compare(a.analyte, b.analyte) || compare(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

function bloodPressure(v: unknown): [number, number] | undefined {
  const m = string(v).match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (m && Number.isFinite(+m[1]) && Number.isFinite(+m[2])) return [+m[1], +m[2]];
}
function vitalRows(entries: Entry[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const e of entries) {
    if (e.data.type !== "vital_set") continue;
    const d = e.data, t = time(e.item.effective);
    if (!t || t.local.length < 16) continue; // A date alone cannot supply a measurement time.
    const row: VitalRow = { setting: "clinic", local_time: t.local.slice(0, 16), evidence: evidence(e) };
    const bp = bloodPressure(d.bp), repeat = bloodPressure(d.bp_repeat);
    if (bp) [row.systolic_mmhg, row.diastolic_mmhg] = bp;
    if (repeat) [row.repeat_systolic_mmhg, row.repeat_diastolic_mmhg] = repeat;
    if (number(d.pulse_bpm)) row.pulse_bpm = d.pulse_bpm;
    if (number(d.weight_lb)) {
      const kg = Math.round(d.weight_lb * 0.45359237 * 10) / 10;
      if (Number.isFinite(kg)) row.weight_kg = kg;
    }
    if (bp || repeat || row.pulse_bpm !== undefined || row.weight_kg !== undefined) rows.push(row);
  }
  return rows;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  if (typeof asOf !== "string" || !validDate(asOf)) return emptyRows();
  const entries = availableEntries(items, asOf);
  const candidates = problemCandidates(entries);
  return {
    medications: medicationRows(entries),
    problems: candidates.map(problemRow).filter((r): r is ProblemRow => r !== undefined)
      .sort((a, b) => compare(a.condition, b.condition) || compare(a.icd10cm || "", b.icd10cm || "")),
    allergies: allergyRows(entries, candidates), labs: labRows(entries), vitals: vitalRows(entries),
  };
}
