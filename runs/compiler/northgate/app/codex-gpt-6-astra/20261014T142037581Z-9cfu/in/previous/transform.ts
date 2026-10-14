import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// Payloads cross an untyped boundary. A bad field must not prevent other readable
// entries (or an envelope's correction links) from being processed.
type ObjectValue = Record<string, unknown>;
const object = (v: unknown): ObjectValue =>
  v !== null && typeof v === "object" && !Array.isArray(v) ? v as ObjectValue : {};
const string = (v: unknown): string => typeof v === "string" ? v : "";
const number = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (...v: string[]): string => JSON.stringify(v);
const has = <T extends string>(v: unknown, values: readonly T[]): v is T =>
  typeof v === "string" && (values as readonly string[]).includes(v);

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function wallAt(epoch: number): string {
  const parts: Record<string, string> = {};
  for (const p of chicago.formatToParts(new Date(epoch))) parts[p.type] = p.value;
  return `${parts.year.padStart(4, "0")}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

function validDate(v: string): boolean {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v) || v.startsWith("0000")) return false;
  const t = Date.parse(v + "T00:00:00Z");
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === v;
}

type Time = { epoch: number; local: string; date: string; timed: boolean; zoned: boolean };
function time(v: unknown): Time | undefined {
  if (typeof v !== "string") return undefined;
  if (/^\d{4}(?:-\d{2})?(?:-\d{2})?$/.test(v)) {
    const day = v.length === 4 ? v + "-01-01" : v.length === 7 ? v + "-01" : v;
    if (!validDate(day)) return undefined;
    const t = time(day + "T00:00:00");
    return t && { ...t, date: v, timed: false };
  }
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/i.exec(v);
  if (!m || !validDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] || 0) > 59) return undefined;
  if (m[6]) {
    const epoch = Date.parse(v);
    if (!Number.isFinite(epoch)) return undefined;
    const local = wallAt(epoch);
    return { epoch, local, date: local.slice(0, 10), timed: true, zoned: true };
  }
  const local = `${m[1]}T${m[2]}:${m[3]}:${m[4] || "00"}`;
  const naive = Date.parse(local + (m[5] || "") + "Z");
  let epoch = naive + 6 * 3600000;
  // This conversion is only for ordering zone-less source times. Display them
  // literally, including a wall time in a DST gap; never use the host time zone.
  for (let i = 0; i < 3; i++) {
    const offset = Date.parse(wallAt(epoch) + "Z") - Math.floor(epoch / 1000) * 1000;
    const next = naive - offset;
    if (next === epoch) break;
    epoch = next;
  }
  return { epoch, local, date: m[1], timed: true, zoned: false };
}

function collectedTime(v: unknown): string | undefined {
  const t = time(v);
  if (!t?.timed) return undefined;
  if (t.zoned) return string(v);
  // Northgate normally supplies offsets. Honor the consumer's wall-time rule
  // defensively if a producer omits one.
  if (wallAt(t.epoch) !== t.local) return undefined;
  return new Date(t.epoch).toISOString();
}

function onset(v: unknown): ProblemRow["onset"] {
  const o = object(v), d = string(o.date);
  if (!validDate(d) || !has(o.precision, ["year", "month", "day"] as const)) return undefined;
  return { value: d.slice(0, o.precision === "year" ? 4 : o.precision === "month" ? 7 : 10), precision: o.precision };
}

interface Item {
  id: string; issuer: string; effective?: Time; recorded: Time;
  raw: ObjectValue; payload: ObjectValue;
}
interface Entry { item: Item; id: string; data: ObjectValue }
function compare(a: Entry, b: Entry): number {
  return (a.item.effective!.epoch - b.item.effective!.epoch)
    || (a.item.recorded.epoch - b.item.recorded.epoch)
    || cmp(a.item.issuer, b.item.issuer) || cmp(a.item.id, b.item.id) || cmp(a.id, b.id);
}
function evidence(...entries: Entry[]): Evidence {
  const seen = new Set<string>();
  return entries.filter(e => {
    const k = key(e.item.issuer, e.item.id, e.id);
    if (seen.has(k)) return false;
    seen.add(k); return true;
  }).map(e => ({ item_id: e.item.id, entry_id: e.id }));
}
function combineEvidence(...values: Evidence[]): Evidence {
  const unique = new Map<string, Evidence[number]>();
  for (const v of values) for (const e of v) unique.set(key(e.item_id, e.entry_id || ""), e);
  return [...unique.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id || "", b.entry_id || ""));
}
function sensitivity(e: Entry): Sensitivity[] | undefined {
  return e.data.restricted === "BH" ? ["mental-health"] : undefined;
}

function currentEntries(items: FolioItem[], asOf: string): Entry[] {
  if (!Array.isArray(items) || !validDate(asOf)) return [];
  const scoped: Item[] = [];
  for (const input of items) {
    const raw = object(input), id = string(raw.id), issuer = string(raw.issuer);
    const recorded = time(raw.recorded);
    if (!id || !issuer || !recorded || recorded.date > asOf) continue;
    scoped.push({ id, issuer, recorded, effective: time(raw.effective), raw, payload: object(raw.payload) });
  }
  const removed = new Set<string>();
  // Include links from superseded items too: A <- B <- C must remove both A
  // and B. Retracting C does not revive the versions it already replaced.
  for (const item of scoped) {
    for (const id of [...strings(item.raw.supersedes), ...strings(item.raw.retracts)])
      removed.add(key(item.issuer, id));
  }
  const entries: Entry[] = [];
  for (const item of scoped) {
    if (!item.effective || removed.has(key(item.issuer, item.id))) continue;
    for (const id of Object.keys(item.payload).sort(cmp)) {
      const data = object(item.payload[id]);
      if (typeof data.type === "string") entries.push({ item, id, data });
    }
  }
  return entries.sort(compare);
}

// This is display-name normalization, not an RxNorm lookup. Product CUIs and
// outside_code values are deliberately never promoted to ingredient CUIs.
const drugNames: [string, string[]][] = [
  ["insulin glargine", ["lantus", "basaglar", "toujeo", "semglee"]],
  ["insulin lispro", ["humalog", "admelog"]], ["insulin aspart", ["novolog", "fiasp"]],
  ["insulin degludec", ["tresiba"]], ["insulin detemir", ["levemir"]],
  ["empagliflozin", ["jardiance"]], ["dapagliflozin", ["farxiga"]],
  ["canagliflozin", ["invokana"]], ["ertugliflozin", ["steglatro"]],
  ["metformin", ["glucophage", "glumetza", "fortamet"]],
  ["semaglutide", ["ozempic", "rybelsus", "wegovy"]], ["dulaglutide", ["trulicity"]],
  ["liraglutide", ["victoza", "saxenda"]], ["tirzepatide", ["mounjaro", "zepbound"]],
  ["sitagliptin", ["januvia"]], ["linagliptin", ["tradjenta"]],
  ["glipizide", ["glucotrol"]], ["glyburide", ["diabeta", "micronase"]],
  ["glimepiride", ["amaryl"]], ["pioglitazone", ["actos"]],
  ["losartan", ["cozaar"]], ["valsartan", ["diovan"]], ["irbesartan", ["avapro"]],
  ["olmesartan", ["benicar"]], ["telmisartan", ["micardis"]],
  ["lisinopril", ["prinivil", "zestril"]], ["enalapril", ["vasotec"]],
  ["ramipril", ["altace"]], ["benazepril", ["lotensin"]], ["captopril", ["capoten"]],
  ["fosinopril", ["monopril"]], ["perindopril", ["aceon"]],
  ["quinapril", ["accupril"]], ["trandolapril", ["mavik"]],
  ["amlodipine", ["norvasc"]], ["nifedipine", ["procardia", "adalat"]],
  ["diltiazem", ["cardizem", "tiazac"]], ["verapamil", ["calan", "verelan"]],
  ["hydrochlorothiazide", ["hctz", "microzide"]], ["chlorthalidone", ["hygroton", "thalitone"]],
  ["furosemide", ["lasix"]], ["torsemide", ["demadex"]], ["bumetanide", ["bumex"]],
  ["spironolactone", ["aldactone"]], ["eplerenone", ["inspra"]], ["finerenone", ["kerendia"]],
  ["metoprolol", ["lopressor", "toprol", "toprol-xl"]], ["carvedilol", ["coreg"]],
  ["atenolol", ["tenormin"]], ["propranolol", ["inderal"]],
  ["atorvastatin", ["lipitor"]], ["rosuvastatin", ["crestor"]], ["simvastatin", ["zocor"]],
  ["pravastatin", ["pravachol"]], ["lovastatin", ["mevacor", "altoprev"]],
  ["ezetimibe", ["zetia"]], ["fenofibrate", ["tricor", "trilipix"]],
  ["aspirin", ["acetylsalicylic acid"]], ["clopidogrel", ["plavix"]],
  ["apixaban", ["eliquis"]], ["rivaroxaban", ["xarelto"]], ["warfarin", ["coumadin", "jantoven"]],
  ["sertraline", ["zoloft"]], ["escitalopram", ["lexapro"]], ["fluoxetine", ["prozac"]],
  ["citalopram", ["celexa"]], ["bupropion", ["wellbutrin", "zyban"]],
  ["duloxetine", ["cymbalta"]], ["venlafaxine", ["effexor"]], ["trazodone", ["desyrel"]],
  ["gabapentin", ["neurontin"]], ["pregabalin", ["lyrica"]],
  ["levothyroxine", ["synthroid", "levoxyl", "tirosint"]],
  ["omeprazole", ["prilosec"]], ["pantoprazole", ["protonix"]], ["famotidine", ["pepcid"]],
  ["albuterol", ["ventolin", "proair", "proventil"]], ["montelukast", ["singulair"]],
  ["allopurinol", ["zyloprim"]], ["colchicine", ["colcrys", "mitigare"]],
  ["tamsulosin", ["flomax"]], ["finasteride", ["proscar", "propecia"]],
  ["acetaminophen", ["tylenol", "paracetamol"]], ["ibuprofen", ["advil", "motrin"]],
  ["naproxen", ["aleve", "naprosyn"]], ["meloxicam", ["mobic"]],
  ["amoxicillin", ["amoxil"]], ["penicillin", []], ["cephalexin", ["keflex"]],
  ["doxycycline", ["vibramycin"]], ["azithromycin", ["zithromax"]],
  ["ciprofloxacin", ["cipro"]], ["levofloxacin", ["levaquin"]],
  ["clindamycin", ["cleocin"]], ["nitrofurantoin", ["macrobid", "macrodantin"]],
  ["sodium bicarbonate", []], ["potassium chloride", ["klor-con", "k-tab"]],
  ["cholecalciferol", ["vitamin d3"]], ["ergocalciferol", ["vitamin d2"]],
  ["cyanocobalamin", ["vitamin b12", "vitamin b-12"]], ["ferrous sulfate", []],
];
const combinationBrands: [string, string[]][] = [
  ["hyzaar", ["losartan", "hydrochlorothiazide"]],
  ["prinzide", ["lisinopril", "hydrochlorothiazide"]], ["zestoretic", ["lisinopril", "hydrochlorothiazide"]],
  ["janumet", ["sitagliptin", "metformin"]], ["synjardy", ["empagliflozin", "metformin"]],
  ["xigduo", ["dapagliflozin", "metformin"]], ["jentadueto", ["linagliptin", "metformin"]],
  ["entresto", ["sacubitril", "valsartan"]], ["lotrel", ["amlodipine", "benazepril"]],
];
function containsName(text: string, name: string): boolean {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i").test(text);
}
function knownIngredients(text: string): string[] {
  const found = new Set<string>();
  for (const [brand, ingredients] of combinationBrands)
    if (containsName(text, brand)) for (const ingredient of ingredients) found.add(ingredient);
  for (const [generic, brands] of drugNames)
    if ([generic, ...brands].some(n => containsName(text, n))) found.add(generic);
  return [...found].sort(cmp);
}
function ingredients(name: string): string[] {
  const known = knownIngredients(name);
  if (known.length) return known;
  if (/\b(unknown|unspecified|unidentified|water pill|blood pressure (pill|medicine)|diabetes (pill|medicine))\b/i.test(name)) return [];
  const cleaned = name.toLowerCase()
    .replace(/^\s*\d+(?:\.\d+)?\s*(?:ml|mg|mcg|g)\s+/i, "")
    .replace(/\s*\[[^\]]*\]\s*/g, " ").split(/\s+\d|\s*\(/)[0]
    .replace(/\b(?:oral|subcutaneous|extended release|delayed release|immediate release|tablet|capsule|solution|suspension|injection|injectable|pen injector|cream|ointment|patch|er|xr|sr|xl)\b.*$/i, "")
    .replace(/\s+(?:hydrochloride|hcl|hydrobromide|besylate|succinate|tartrate|fumarate|maleate|mesylate|phosphate|sodium|potassium)\s*$/i, "")
    .replace(/\s+/g, " ").trim();
  return cleaned && /^[a-z][a-z\s'-]*$/.test(cleaned) ? [cleaned] : [];
}

function medicationDose(d: ObjectValue, ingredientCount: number): MedicationRow["dose"] {
  const dose = object(d.dose), value = number(dose.value), unit = string(dose.unit).toLowerCase();
  if (value === undefined || value < 0) return undefined;
  if (["tab", "tabs", "tablet", "tablets"].includes(unit)) {
    const name = string(object(d.drug).name);
    const strengths = [...name.matchAll(/(\d+(?:\.\d+)?)\s*(mcg|mg|g)\b(?!\s*\/)/gi)];
    if (ingredientCount === 1 && strengths.length === 1) {
      const m = strengths[0], amount = value * +m[1] * (m[2].toLowerCase() === "g" ? 1000 : 1);
      return Number.isFinite(amount) ? { value: amount, unit: m[2].toLowerCase() === "mcg" ? "mcg" : "mg" } : undefined;
    }
    return { value, unit: "tablet" };
  }
  if (ingredientCount > 1) return undefined; // No allocation of an unspecified combination dose.
  if (["unit", "units", "unt", "[iu]", "iu"].includes(unit)) return { value, unit: "units" };
  if (unit === "mg" || unit === "mcg") return { value, unit };
  if (unit === "ml") return { value, unit: "mL" };
  return undefined;
}

function medicationFrequency(d: ObjectValue): MedicationRow["frequency"] {
  if (has(d.frequency, ["QD", "BID", "TID", "QHS", "PRN"] as const)) return d.frequency;
  const sig = string(d.sig);
  // OTHER delegates to the sig in this source. Recognize explicit schedules,
  // but do not turn "twice weekly" or "every other day" into daily/weekly.
  if (/\b(as needed|PRN)\b/i.test(sig)) return "PRN";
  if (/\b(?:twice|three times|two times|2 times|3 times)\s+(?:a |per )?week|\bevery (?:other|\d+) (?:day|week)s?\b/i.test(sig)) return "other";
  if (/\b(?:once\s+(?:a |per )?(?:week|weekly)|every week|weekly|q7d)\b/i.test(sig)) return "QW";
  if (/\b(?:twice (?:a day|daily|per day)|two times (?:a day|daily|per day)|BID)\b/i.test(sig)) return "BID";
  if (/\b(?:three times (?:a day|daily|per day)|TID)\b/i.test(sig)) return "TID";
  if (/\b(?:four times (?:a day|daily|per day)|QID|every \d+ hours?)\b/i.test(sig)) return "other";
  if (/\b(?:at bedtime|every night|nightly|QHS)\b/i.test(sig)) return "QHS";
  if (/\b(?:once (?:a day|daily|per day)|daily|every day|QD)\b/i.test(sig)) return "QD";
  return d.frequency === "OTHER" ? "other" : undefined;
}

function medicationRows(entries: Entry[]): MedicationRow[] {
  const lines = new Map<string, Entry[]>();
  for (const e of entries) {
    if (e.data.type !== "med_event" || !string(e.data.med_id)) continue;
    if (!has(e.data.action, ["start", "change", "hold", "resume", "stop"] as const)) continue;
    const k = key(e.item.issuer, string(e.data.med_id));
    const history = lines.get(k) || []; history.push(e); lines.set(k, history);
  }
  const drugs = new Map<string, { e: Entry; row: MedicationRow }>();
  for (const history of lines.values()) {
    const e = history[history.length - 1], d = e.data, drugName = string(object(d.drug).name);
    if (!drugName.trim()) continue;
    const names = ingredients(drugName), status = d.action === "hold" ? "held" : d.action === "stop" ? "stopped" : "active";
    let began: Entry | undefined;
    if (status !== "active") began = e;
    else began = [...history].reverse().find(x => x.data.action === "start" || x.data.action === "resume");
    const dose = medicationDose(d, names.length || 1);
    for (const ingredient of names.length ? names : [undefined]) {
      const row: MedicationRow = {
        drug_name: drugName, status, patient_reported: false,
        evidence: evidence(e, ...(began ? [began] : [])),
      };
      if (ingredient) row.ingredient = ingredient;
      if (began) row.status_since = began.item.effective!.date;
      if (dose) row.dose = dose;
      const frequency = medicationFrequency(d); if (frequency) row.frequency = frequency;
      if (status === "stopped" && has(d.stop_reason, ["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"] as const)) row.stop_reason = d.stop_reason;
      if (status !== "active" && string(d.reason_text)) row.status_reason_text = string(d.reason_text);
      const sensitive = sensitivity(e); if (sensitive) row.sensitivity = sensitive;
      const k = ingredient ? key(e.item.issuer, ingredient) : key(e.item.issuer, "unidentified", string(d.med_id));
      const prior = drugs.get(k);
      if (!prior || compare(prior.e, e) < 0) drugs.set(k, { e, row });
    }
  }
  return [...drugs.values()].map(x => x.row).sort((a, b) => cmp(a.ingredient || a.drug_name, b.ingredient || b.drug_name));
}

function latestLines(entries: Entry[], type: string, idField: string, actions: string[]): Entry[] {
  const lines = new Map<string, Entry>();
  for (const e of entries) {
    const id = string(e.data[idField]);
    if (e.data.type === type && id && actions.includes(string(e.data.action))) lines.set(key(e.item.issuer, id), e);
  }
  return [...lines.values()].sort(compare);
}
function isCKD(d: ObjectValue): boolean {
  return /^N18(?:\.|$)/i.test(string(d.icd10cm)) || /\b(chronic (kidney|renal) (disease|failure|insufficiency)|CKD|ESRD|end.stage renal disease)\b/i.test(string(d.description));
}
function ckdStage(d: ObjectValue): ProblemRow["ckd_stage"] {
  const description = string(d.description);
  const explicit = /\bG(3[ab]|[1245])\b/i.exec(description);
  const stage = /\bstage\s*(3\s*[ab]|[1245]|iii\s*[ab]|iv|ii|v|i)\b/i.exec(description);
  const label = (explicit?.[1] || stage?.[1] || "").toLowerCase().replace(/\s/g, "");
  const named: Record<string, ProblemRow["ckd_stage"]> = { "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5", i: "G1", ii: "G2", iiia: "G3a", iiib: "G3b", iv: "G4", v: "G5" };
  if (named[label]) return named[label];
  const coded: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
  return coded[string(d.icd10cm).toUpperCase()];
}
function unconfirmed(description: string): boolean {
  return /\b(?:rule[ds]? out|ruled.out|r\/o|suspected|possible|probable|provisional|working diagnosis|not confirmed|no evidence of)\b/i.test(description);
}
function conditionKeys(e: Entry): string[] {
  const d = e.data;
  if (isCKD(d)) return [key(e.item.issuer, "ckd")];
  return [
    string(d.snomed) && key(e.item.issuer, "snomed", string(d.snomed)),
    string(d.icd10cm) && !/^T\d/i.test(string(d.icd10cm)) && key(e.item.issuer, "icd", string(d.icd10cm).toUpperCase()),
    key(e.item.issuer, "description", string(d.description).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()),
  ].filter((v): v is string => typeof v === "string" && v.length > 0);
}

type ReactionType = AllergyIntoleranceRow["reaction_type"];
function positiveReaction(text: string): string {
  return text.replace(/\b(?:no|not|without|denies|negative for)\s+[^;,.()]*/gi, "");
}
function reactionType(text: string, source: unknown): ReactionType | undefined {
  const r = positiveReaction(text);
  if (/\b(hives|urticaria|rash|angioedema|anaphyla\w*|bronchospasm|stevens.johnson|toxic epidermal necrolysis)\b/i.test(r)) return "hypersensitivity";
  if (/\b(ketoacidosis|DKA|lactic acidosis|severe hyperkalemia|acute (kidney injury|renal failure)|pancreatitis|rhabdomyolysis|agranulocytosis|gastrointestinal bleeding)\b/i.test(r)) return "serious_adverse_event";
  if (/\b(cough|nausea|vomiting|diarrhea|GI upset|gastrointestinal upset|myalgia|constipation|dizziness)\b/i.test(r)) return "side_effect";
  if (source === "allergy") return "hypersensitivity";
  if (source === "intolerance") return "side_effect";
  if (source === "adverse_reaction") return "serious_adverse_event";
  return undefined;
}
const aceInhibitors = ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "fosinopril", "perindopril", "quinapril", "trandolapril"];
function mechanism(substance: string, reaction: string, source: unknown): AllergyIntoleranceRow["mechanism"] {
  if ((aceInhibitors.includes(substance.toLowerCase()) || /\bACE[ -]?inhibitor/i.test(substance)) && /\b(cough|angioedema)\b/i.test(positiveReaction(reaction))) return "non_immune";
  if (/\b(non.immune|bradykinin|ketoacidosis|lactic acidosis)\b/i.test(reaction)) return "non_immune";
  if (source === "allergy") return "immune"; // Northgate explicitly defines this code as immune-mediated.
  if (source === "intolerance" || source === "adverse_reaction") return "non_immune";
  if (/\b(immune.mediated|IgE|T.cell.mediated)\b/i.test(reaction)) return "immune";
  return "unknown";
}

interface DrugClass { pattern: RegExp; members: string[] }
const drugClasses: DrugClass[] = [
  { pattern: /\bSGLT[ -]?2(?:[ -]inhibitors?)?\b/i, members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"] },
  { pattern: /\bACE[ -]inhibitors?\b/i, members: aceInhibitors },
  { pattern: /\bstatins?\b/i, members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "fluvastatin", "pitavastatin"] },
  { pattern: /\bNSAIDs?\b/i, members: ["ibuprofen", "naproxen", "meloxicam", "diclofenac", "celecoxib", "indomethacin"] },
];
interface Attributed { substance: string; reaction?: string; type?: ReactionType; extra: Entry[]; onlyEffect: boolean }
function attributedDrug(e: Entry, entries: Entry[]): Attributed | undefined {
  const description = string(e.data.description);
  if (/\b(?:not|no longer)\s+(?:associated|attributed|due to|caused by|secondary to)\b/i.test(description)) return undefined;
  const causeMatch = /\b(?:due to|caused by|secondary to|attributed to|associated with|adverse (?:effect|reaction) (?:of|to)|allergy to|intolerance to)\s+(.+?)(?:[,;()]|$)/i.exec(description)
    || /^(.+?)[ -](?:associated|induced|related)\b/i.exec(description);
  if (!causeMatch) return undefined;
  const cause = causeMatch[1];
  let substance: string | undefined;
  let extra: Entry[] = [];
  const named = knownIngredients(cause);
  if (named.length === 1) substance = named[0];
  if (!substance) {
    for (const cls of drugClasses) {
      const match = cls.pattern.exec(cause);
      if (!match) continue;
      substance = match[0];
      const candidates = new Map<string, Entry>();
      for (const sibling of entries) {
        if (sibling.item !== e.item || sibling.data.type !== "med_event") continue;
        for (const ingredient of ingredients(string(object(sibling.data.drug).name)))
          if (cls.members.includes(ingredient)) candidates.set(ingredient, sibling);
      }
      if (candidates.size === 1) { const [ingredient, sibling] = [...candidates][0]; substance = ingredient; extra = [sibling]; }
      break;
    }
  }
  if (!substance) {
    // A free-text disease cause such as "infection" is not a medication.
    // Unknown names are only usable when the wording explicitly calls them a
    // drug adverse effect, allergy or intolerance.
    if (/\b(?:adverse (?:effect|reaction) (?:of|to)|allergy to|intolerance to)\b/i.test(description)
      && !/\b(drug|medication|therapy|treatment|unknown|other|unspecified)\b/i.test(cause)) substance = ingredients(cause)[0];
  }
  if (!substance) return undefined;
  const type = reactionType(description, undefined);
  const onlyEffect = /^T\d/i.test(string(e.data.icd10cm)) && /adverse (?:effect|reaction)/i.test(description) && !type;
  return { substance, reaction: type ? description : undefined, type, extra, onlyEffect };
}

function problemRows(entries: Entry[]): { rows: ProblemRow[]; diagnoses: Entry[] } {
  const lines = latestLines(entries, "problem_event", "problem_id", ["add", "update", "resolve", "remove"])
    .filter(e => e.data.action !== "remove" && string(e.data.description).trim() && !unconfirmed(string(e.data.description)));
  // Match only explicit identities (or the same CKD condition across staging).
  // Different complications of diabetes, for example, are not collapsed by a
  // broad ICD prefix.
  const groups: { keys: Set<string>; e: Entry }[] = [];
  for (const e of lines) {
    const keys = conditionKeys(e), matches = groups.filter(g => keys.some(k => g.keys.has(k)));
    if (!matches.length) groups.push({ keys: new Set(keys), e });
    else {
      const first = matches[0]; first.e = e;
      for (const k of keys) first.keys.add(k);
      for (const other of matches.slice(1)) {
        for (const k of other.keys) first.keys.add(k);
        groups.splice(groups.indexOf(other), 1);
      }
    }
  }
  const rows: ProblemRow[] = [], diagnoses = groups.map(g => g.e);
  for (const e of diagnoses) {
    const d = e.data;
    if (attributedDrug(e, entries)?.onlyEffect) continue;
    const row: ProblemRow = { condition: string(d.description), status: d.action === "resolve" ? "resolved" : "active", evidence: evidence(e) };
    if (string(d.icd10cm)) row.icd10cm = string(d.icd10cm);
    if (string(d.snomed)) row.snomed = string(d.snomed);
    const start = onset(d.onset); if (start) row.onset = start;
    if (isCKD(d)) {
      const stage = ckdStage(d); if (stage) row.ckd_stage = stage;
      const category = /\bA[123]\b/i.exec(row.condition)?.[0].toUpperCase();
      if (has(category, ["A1", "A2", "A3"] as const)) row.albuminuria = category;
    }
    const sensitive = sensitivity(e); if (sensitive) row.sensitivity = sensitive;
    rows.push(row);
  }
  return { rows: rows.sort((a, b) => cmp(a.condition, b.condition)), diagnoses };
}

function allergySubstance(d: ObjectValue): string {
  const s = object(d.substance), name = string(s.name).trim();
  const known = knownIngredients(name);
  if (known.length === 1) return known[0];
  if (string(s.rxnorm)) return ingredients(name)[0] || name.toLowerCase();
  return name; // Preserve food, environmental allergen and drug-class wording.
}
function allergyRows(entries: Entry[], diagnoses: Entry[]): AllergyIntoleranceRow[] {
  const explicit = new Map<string, { e: Entry; row?: AllergyIntoleranceRow }>();
  for (const e of latestLines(entries, "allergy_event", "allergy_id", ["add", "update", "inactivate"])) {
    const d = e.data, substance = allergySubstance(d);
    if (!substance || /^(?:NKDA|NKA|no known (?:drug )?allergies)$/i.test(substance)) continue;
    const k = key(e.item.issuer, substance.toLowerCase());
    // An inactivated line is gone, but cannot erase a separate current line
    // for the same substance. Retain the tombstone only if no active line exists.
    if (d.action === "inactivate") {
      if (!explicit.get(k)?.row) explicit.set(k, { e });
      continue;
    }
    const reaction = strings(d.reactions).filter(s => s.trim()).join("; ");
    const type = reactionType(reaction, d.reaction_type); if (!type) continue;
    const row: AllergyIntoleranceRow = {
      substance, reaction_type: type, mechanism: mechanism(substance, reaction, d.reaction_type),
      criticality: has(d.severity, ["low", "high", "unknown"] as const) ? d.severity : "unknown", evidence: evidence(e),
    };
    if (reaction) row.reaction = reaction;
    const cui = string(object(d.substance).rxnorm); if (cui) row.rxnorm_ingredient = cui;
    const start = onset(d.onset); if (start) row.onset = start;
    const sensitive = sensitivity(e); if (sensitive) row.sensitivity = sensitive;
    explicit.set(k, { e, row });
  }
  const derived = new Map<string, { e: Entry; row: AllergyIntoleranceRow }>();
  for (const e of [...diagnoses].sort(compare)) {
    const attributed = attributedDrug(e, entries); if (!attributed) continue;
    const { substance, reaction, extra } = attributed;
    const type = attributed.type || "serious_adverse_event";
    const row: AllergyIntoleranceRow = {
      substance, reaction_type: type, mechanism: mechanism(substance, reaction || "", undefined),
      criticality: attributed.type === "serious_adverse_event" || /\b(angioedema|anaphyla\w*)\b/i.test(reaction || "") ? "high"
        : attributed.type === "side_effect" ? "low" : "unknown",
      evidence: evidence(e, ...extra),
    };
    if (reaction) row.reaction = reaction;
    const start = onset(e.data.onset); if (start) row.onset = start;
    const sensitive = sensitivity(e); if (sensitive) row.sensitivity = sensitive;
    derived.set(key(e.item.issuer, substance.toLowerCase()), { e, row });
  }
  for (const [k, stated] of explicit) {
    const inferred = derived.get(k);
    if (stated.row) {
      if (inferred) {
        stated.row.evidence = combineEvidence(stated.row.evidence, inferred.row.evidence);
        if (inferred.row.sensitivity && !stated.row.sensitivity) stated.row.sensitivity = inferred.row.sensitivity;
      }
      derived.set(k, { e: stated.e, row: stated.row });
    } else if (!inferred || compare(inferred.e, stated.e) <= 0) derived.delete(k);
  }
  return [...derived.values()].map(x => x.row).sort((a, b) => cmp(a.substance, b.substance));
}

const units: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const analyteCodes: Record<string, Analyte> = {
  CREAT: "creatinine", CREA: "creatinine", CREATININE: "creatinine", CR: "creatinine",
  K: "potassium", POTASSIUM: "potassium", NA: "sodium", SODIUM: "sodium", CL: "chloride", CHLORIDE: "chloride",
  CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate", BICARB: "bicarbonate", BICARBONATE: "bicarbonate",
  AG: "anion_gap", AGAP: "anion_gap", ANIONGAP: "anion_gap", BUN: "bun", UREANITROGEN: "bun",
  GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", MALBCR: "uacr", UMALBCR: "uacr", MICROALBUMINCREATININERATIO: "uacr",
  PLT: "platelets", PLATELET: "platelets", PLATELETS: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", BOHB: "bhb", BETAHYDROXYBUTYRATE: "bhb", PH: "ph", PHVEN: "ph", PHART: "ph", VPH: "ph", APH: "ph",
  PCO2: "pco2", PCO2VEN: "pco2", PCO2ART: "pco2", LIP: "lipase", LIPASE: "lipase",
  TNI: "troponin", TROP: "troponin", TROPI: "troponin", TROPONINI: "troponin",
  CHOL: "cholesterol", CHOLESTEROL: "cholesterol", TC: "cholesterol", TCHOL: "cholesterol",
  TG: "triglycerides", TRIG: "triglycerides", TRIGLYCERIDES: "triglycerides", HDL: "hdl", HDLC: "hdl",
  LDL: "ldl", LDLC: "ldl", LDLCALC: "ldl", LDLDIRECT: "ldl", LDLMEASURED: "ldl",
};
const loincAnalytes: Record<string, Analyte> = {
  "2160-0": "creatinine", "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr",
  "62238-1": "egfr", "98979-8": "egfr", "17861-6": "egfr", "69405-9": "egfr",
  "2823-3": "potassium", "2951-2": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate",
  "10466-1": "anion_gap", "3094-0": "bun", "2345-7": "glucose", "4548-4": "a1c", "17856-6": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc",
  "26464-8": "wbc", "718-7": "hemoglobin", "27369-2": "bhb", "1977-8": "bhb", "2744-1": "ph", "2746-6": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl",
};
const codeText = (v: unknown): string => string(v).toUpperCase().replace(/^LK[-_]?/, "").replace(/[^A-Z0-9]/g, "");
function analyte(d: ObjectValue): Analyte | undefined {
  const test = object(d.test), name = string(test.name);
  // Do not confuse serum analytes with urine concentrations or troponin T.
  if (/troponin\s*[- ]?T\b/i.test(name)) return undefined;
  if (/\b(urine|urinary|CSF)\b/i.test(name) && !/(?:albumin|microalbumin).*(?:creatinine|ratio)|\buacr\b/i.test(name)) return undefined;
  for (const code of [codeText(test.nfm_code), codeText(object(d.external_ref).result_code)]) {
    if (/^EGFR|^GFR/.test(code)) return "egfr";
    if (Object.prototype.hasOwnProperty.call(analyteCodes, code)) return analyteCodes[code];
  }
  if (Object.prototype.hasOwnProperty.call(loincAnalytes, string(test.loinc))) return loincAnalytes[string(test.loinc)];
  const patterns: [RegExp, Analyte][] = [
    [/\b(eGFR|estimated glomerular filtration|glomerular filtration rate)\b/i, "egfr"],
    [/(?:albumin|microalbumin).*(?:creatinine|ratio)/i, "uacr"],
    [/\b(?:hemoglobin\s*a1c|hba1c|a1c|glycated hemoglobin)\b/i, "a1c"],
    [/\bcreatinine\b/i, "creatinine"], [/\bpotassium\b/i, "potassium"], [/\bsodium\b/i, "sodium"],
    [/\bchloride\b/i, "chloride"], [/\b(pCO2|carbon dioxide partial pressure)\b/i, "pco2"],
    [/\b(bicarbonate|carbon dioxide|total CO2)\b/i, "bicarbonate"],
    [/\banion gap\b/i, "anion_gap"], [/\b(urea nitrogen|BUN)\b/i, "bun"], [/\bglucose\b/i, "glucose"],
    [/\bplatelets?\b/i, "platelets"], [/\b(WBC|white (?:blood )?cell|leukocytes?)\b/i, "wbc"],
    [/\bhemoglobin\b/i, "hemoglobin"], [/\b(beta[ -]?hydroxybutyrate|β[ -]?hydroxybutyrate|BHB)\b/i, "bhb"],
    [/\bpH\b/i, "ph"],
    [/\blipase\b/i, "lipase"], [/\btroponin(?:\s+I)?\b/i, "troponin"],
    [/\b(HDL|high.density lipoprotein)\b/i, "hdl"], [/\b(LDL|low.density lipoprotein)\b/i, "ldl"],
    [/\btriglycerides?\b/i, "triglycerides"], [/\bcholesterol\b/i, "cholesterol"],
  ];
  return patterns.find(([pattern]) => pattern.test(name))?.[1];
}

type Equation = NonNullable<LabResultRow["egfr_equation"]>;
function equationIn(text: string): Equation | undefined {
  if (/MDRD/i.test(text)) return "mdrd";
  if (/CKD[ -]?EPI[\s\S]*?2021|2021[\s\S]*?CKD[ -]?EPI|\bEGFR(?:[-_ ]?)(?:21|2021)\b/i.test(text)) return "ckd-epi-2021";
  if (/CKD[ -]?EPI[\s\S]*?2009|2009[\s\S]*?CKD[ -]?EPI|\bEGFR[-_ ]?(?:09|2009)[NA]?\b/i.test(text)) return "ckd-epi-2009";
  return undefined;
}
function egfrEquation(d: ObjectValue): Equation {
  const test = object(d.test);
  const method = equationIn(string(d.comment)); if (method) return method;
  if (/\b(?:equation|method)\s*(?:unknown|unspecified|not (?:stated|available|specified))\b/i.test(string(d.comment))) return "unknown";
  return equationIn(string(test.name)) || equationIn(string(test.nfm_code)) || equationIn(string(object(d.external_ref).result_code)) || "unknown";
}
function raceAdjusted(d: ObjectValue): boolean {
  const test = object(d.test), name = string(test.name);
  if (/\b(non[ -]?(?:African[ -]?American|black)|without (?:a )?race|race[ -]free)\b/i.test(name)) return false;
  const codes = [codeText(test.nfm_code), codeText(object(d.external_ref).result_code)];
  if (codes.some(c => /NAA|NONAA|09N$/.test(c))) return false;
  if (/\b(African[ -]?American|black|with (?:a )?race coefficient)\b/i.test(name)) return true;
  return codes.some(c => /(?:EGFR|GFR).*(?:AA|09A|2009A)$/.test(c)) || string(test.loinc) === "48643-1";
}
function numericResult(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*$/.exec(string(v));
  if (!m || !Number.isFinite(+m[2])) return undefined;
  const comparator = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1];
  return comparator ? { value: +m[2], comparator: comparator as LabResultRow["comparator"] } : { value: +m[2] };
}
function convertUnit(value: number, unit: string, a: Analyte): number | undefined {
  const normalize = (v: string): string => v.toLowerCase().replace(/[µμ]/g, "u").replace(/\s/g, "").replace(/\^/g, "*").replace(/²/g, "2");
  const u = normalize(unit);
  if (u === normalize(units[a])) return value;
  if (a === "platelets" || a === "wbc") {
    if (["cells/ul", "cell/ul", "/ul"].includes(u)) return value / 1000;
    if (["k/ul", "10*3/ul", "x10*3/ul", "10*9/l", "x10*9/l"].includes(u)) return value;
  }
  if (a === "ph" && ["", "ph", "[ph]"].includes(u)) return value;
  if (a === "egfr" && ["ml/min/1.73m2", "ml/min/1.73m*2", "ml/min/1.73m^2"].includes(u)) return value;
  if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") return value;
  if (a === "hemoglobin" && u === "g/l") return value / 10;
  if (a === "troponin" && ["ng/l", "pg/ml"].includes(u)) return value / 1000;
  if (a === "glucose" && u === "mmol/l") return value * 18.016;
  if (a === "creatinine" && u === "umol/l") return value / 88.4;
  if (units[a] === "mg/dL" && u === "mg/l") return value / 10;
  return undefined; // Unknown units are not silently relabeled.
}
function labRows(entries: Entry[]): LabResultRow[] {
  const candidates = new Map<string, { e: Entry; a: Analyte; collected: string; rank: number }>();
  for (const e of entries) {
    const d = e.data; if (d.type !== "imported_result") continue;
    const a = analyte(d), collected = collectedTime(d.collected);
    if (!a || !collected || !has(d.result_status, ["P", "F", "C"] as const) || (a === "egfr" && raceAdjusted(d))) continue;
    const ref = object(d.external_ref), test = object(d.test);
    const component = string(ref.result_code) || string(test.nfm_code) || string(test.loinc) || string(test.name);
    const accession = string(ref.accession);
    // Accession + component + collection distinguish a confirmation/redraw from
    // a copy. Keep nonnumeric candidates here so a correction cannot resurrect
    // the old numeric value merely because its replacement cannot be graphed.
    const k = key(e.item.issuer, string(ref.lab), accession || e.item.id, component, String(time(collected)!.epoch));
    const rank = d.result_status === "C" ? 3 : d.result_status === "F" ? 2 : 1;
    const old = candidates.get(k);
    const resultTime = time(d.resulted)?.epoch || e.item.recorded.epoch;
    const oldTime = old && (time(old.e.data.resulted)?.epoch || old.e.item.recorded.epoch);
    if (!old || rank > old.rank || (rank === old.rank && (resultTime > oldTime! || (resultTime === oldTime && compare(old.e, e) < 0))))
      candidates.set(k, { e, a, collected, rank });
  }
  const rows: { e: Entry; row: LabResultRow }[] = [];
  for (const { e, a, collected } of candidates.values()) {
    const d = e.data, parsed = numericResult(d.value); if (!parsed) continue;
    const value = convertUnit(parsed.value, string(d.unit), a); if (value === undefined || !Number.isFinite(value)) continue;
    const row: LabResultRow = { analyte: a, value, unit: units[a], collected, status: d.result_status === "P" ? "preliminary" : "final", evidence: evidence(e) };
    if (parsed.comparator) row.comparator = parsed.comparator;
    if (a === "egfr") row.egfr_equation = egfrEquation(d);
    const loinc = string(object(d.test).loinc); if (loinc) row.loinc = loinc;
    rows.push({ e, row });
  }
  return rows.sort((a, b) => time(a.row.collected)!.epoch - time(b.row.collected)!.epoch || cmp(a.row.analyte, b.row.analyte) || compare(a.e, b.e)).map(x => x.row);
}

function bloodPressure(v: unknown): [number, number] | undefined {
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(string(v));
  return m && Number.isSafeInteger(+m[1]) && Number.isSafeInteger(+m[2]) ? [+m[1], +m[2]] : undefined;
}
function vitalRows(entries: Entry[]): VitalRow[] {
  const rows = new Map<string, VitalRow>();
  for (const e of entries) {
    if (e.data.type !== "vital_set" || !e.item.effective?.timed) continue;
    const d = e.data, bp = bloodPressure(d.bp), repeat = bloodPressure(d.bp_repeat);
    const pulse = number(d.pulse_bpm), weight = number(d.weight_lb);
    const row: VitalRow = { setting: "clinic", local_time: e.item.effective.local.slice(0, 16), evidence: evidence(e) };
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    if (repeat) { row.repeat_systolic_mmhg = repeat[0]; row.repeat_diastolic_mmhg = repeat[1]; }
    if (pulse !== undefined && pulse >= 0) row.pulse_bpm = pulse;
    if (weight !== undefined && weight >= 0 && Number.isFinite(weight * 0.45359237 * 10)) row.weight_kg = Math.round(weight * 0.45359237 * 10) / 10;
    if (!bp && !repeat && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    const k = key(e.item.issuer, string(d.visit_id), String(e.item.effective.epoch), JSON.stringify([bp, repeat, pulse, weight]));
    const old = rows.get(k);
    if (old) old.evidence = combineEvidence(old.evidence, row.evidence); else rows.set(k, row);
  }
  return [...rows.values()];
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const entries = currentEntries(items, asOf);
  const problems = problemRows(entries);
  return {
    medications: medicationRows(entries), problems: problems.rows,
    allergies: allergyRows(entries, problems.diagnoses), labs: labRows(entries), vitals: vitalRows(entries),
  };
}
