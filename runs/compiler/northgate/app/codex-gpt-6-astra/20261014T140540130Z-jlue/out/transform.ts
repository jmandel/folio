import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Evidence, Sensitivity,
} from "../in/views/views";

type Obj = Record<string, unknown>;
type Stamp = { date: string; local?: string; order: number };
type Entry = {
  item: FolioItem; id: string; data: Obj; effective?: Stamp; recorded: Stamp;
};
type Candidate<T> = { entry: Entry; row: T };
const object = (x: unknown): x is Obj => x !== null && typeof x === "object" && !Array.isArray(x);
const str = (x: unknown): string | undefined => typeof x === "string" && x.trim() ? x : undefined;
const textOf = (x: unknown): string => typeof x === "string" ? x : "";
const num = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (...parts: string[]): string => JSON.stringify(parts);
const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const evidence = (e: Entry): Evidence => [{ item_id: e.item.id, entry_id: e.id }];
function joinEvidence(...lists: Evidence[]): Evidence {
  const seen = new Map<string, Evidence[number]>();
  for (const list of lists) for (const e of list) seen.set(key(e.item_id, e.entry_id ?? ""), e);
  return [...seen.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id ?? "", b.entry_id ?? ""));
}
function sensitive(e: Entry): Sensitivity[] | undefined {
  return e.data.restricted === "BH" ? ["mental-health"] : undefined;
}

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", calendar: "gregory", numberingSystem: "latn",
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit",
  minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function localAt(ms: number): string {
  const parts: Record<string, string> = {};
  for (const p of chicago.formatToParts(new Date(ms))) parts[p.type] = p.value;
  return `${parts.year.padStart(4, "0")}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}
function validDate(s: string): boolean {
  if (typeof s !== "string") return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const y = +m[1], month = +m[2], day = +m[3];
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  return month >= 1 && month <= 12 && day >= 1 && day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}
// Used only for ordering local/partial effective times; displayed precision is never padded.
function localEpoch(wall: string): number {
  const nominal = Date.parse(wall + "Z");
  let guess = nominal + 6 * 3600000;
  for (let i = 0; i < 3; i++) {
    const delta = nominal - Date.parse(localAt(guess) + "Z");
    if (!delta) break;
    guess += delta;
  }
  return guess;
}
function stamp(value: unknown): Stamp | undefined {
  if (typeof value !== "string") return undefined;
  const s = value.trim();
  if (/^\d{4}(?:-\d{2})?(?:-\d{2})?$/.test(s)) {
    const full = s.length === 4 ? s + "-01-01" : s.length === 7 ? s + "-01" : s;
    if (!validDate(full)) return undefined;
    return { date: s, order: localEpoch(full + "T00:00:00") };
  }
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/i.exec(s);
  if (!m || !validDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] ?? 0) > 59) return undefined;
  const wall = `${m[1]}T${m[2]}:${m[3]}:${m[4] ?? "00"}`;
  const order = m[6] ? Date.parse(s) : localEpoch(wall) + Number(m[5] ?? 0) * 1000;
  if (!Number.isFinite(order)) return undefined;
  const local = m[6] ? localAt(order) : wall;
  return { date: local.slice(0, 10), local: local.slice(0, 16), order };
}
function onset(value: unknown): ProblemRow["onset"] {
  if (!object(value) || typeof value.date !== "string" || !validDate(value.date)) return undefined;
  const p = value.precision;
  if (p !== "year" && p !== "month" && p !== "day") return undefined;
  return { value: value.date.slice(0, p === "year" ? 4 : p === "month" ? 7 : 10), precision: p };
}
function entryOrder(a: Entry, b: Entry): number {
  return (a.effective?.order ?? a.recorded.order) - (b.effective?.order ?? b.recorded.order)
    || a.recorded.order - b.recorded.order || cmp(a.item.issuer, b.item.issuer)
    || cmp(a.item.id, b.item.id) || cmp(a.id, b.id);
}
function currentEntries(items: FolioItem[], asOf: string): Entry[] {
  if (!Array.isArray(items) || !validDate(asOf)) return [];
  const scoped: { item: FolioItem; recorded: Stamp }[] = [];
  for (const item of items) {
    if (!object(item) || !str(item.id) || !str(item.issuer)) continue;
    const recorded = stamp(item.recorded);
    if (recorded?.date.length === 10 && recorded.date <= asOf) scoped.push({ item, recorded });
  }
  const removed = new Set<string>();
  // All in-scope correction edges apply, even when a correcting item is itself replaced.
  // This also removes every ancestor in a supersession chain without resurrecting an old copy.
  for (const { item } of scoped) for (const links of [item.supersedes, item.retracts]) {
    if (Array.isArray(links)) for (const id of links) if (str(id)) removed.add(key(item.issuer, id));
  }
  const entries = new Map<string, Entry>();
  for (const { item, recorded } of scoped) {
    if (removed.has(key(item.issuer, item.id)) || !object(item.payload)) continue;
    const effective = stamp(item.effective);
    for (const id of Object.keys(item.payload).sort()) {
      const data: unknown = item.payload[id];
      if (object(data) && str(data.type)) entries.set(key(item.issuer, item.id, id), { item, id, data, effective, recorded });
    }
  }
  return [...entries.values()].sort(entryOrder);
}
function lines(entries: Entry[], type: string, idField: string): Entry[][] {
  const result = new Map<string, Entry[]>();
  for (const e of entries) {
    const id = str(e.data[idField]);
    if (e.data.type !== type || !id) continue;
    const k = key(e.item.issuer, id);
    const events = result.get(k) ?? [];
    events.push(e);
    result.set(k, events);
  }
  return [...result.values()];
}

// Text normalization only: product RxNorm CUIs and outside identifiers are never promoted
// to ingredient-level codes. Brand aliases identify names, not terminology codes.
const drugAliases: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  steglatro: "ertugliflozin", glucophage: "metformin", fortamet: "metformin", glumetza: "metformin",
  lantus: "insulin glargine", basaglar: "insulin glargine", semglee: "insulin glargine", toujeo: "insulin glargine",
  humalog: "insulin lispro", novolog: "insulin aspart", tresiba: "insulin degludec", levemir: "insulin detemir",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", actos: "pioglitazone",
  amaryl: "glimepiride", glucotrol: "glipizide", diabeta: "glyburide",
  cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan",
  lisinopril: "lisinopril", zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  lotensin: "benazepril", norvasc: "amlodipine", procardia: "nifedipine", adalat: "nifedipine",
  lasix: "furosemide", demadex: "torsemide", bumex: "bumetanide", aldactone: "spironolactone",
  inspra: "eplerenone", kerendia: "finerenone", microzide: "hydrochlorothiazide", hctz: "hydrochlorothiazide",
  tenormin: "atenolol", coreg: "carvedilol", lopressor: "metoprolol", toprol: "metoprolol", bystolic: "nebivolol",
  catapres: "clonidine", hydralazine: "hydralazine", cardizem: "diltiazem", calan: "verapamil",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  zetia: "ezetimibe", tricor: "fenofibrate", lovaza: "omega-3 acid ethyl esters", vascepa: "icosapent ethyl",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", prilosec: "omeprazole", protonix: "pantoprazole",
  nexium: "esomeprazole", pepcid: "famotidine", neurontin: "gabapentin", lyrica: "pregabalin",
  cymbalta: "duloxetine", zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram",
  prozac: "fluoxetine", paxil: "paroxetine", wellbutrin: "bupropion", effexor: "venlafaxine",
  remeron: "mirtazapine", desyrel: "trazodone", buspar: "buspirone", ativan: "lorazepam",
  xanax: "alprazolam", klonopin: "clonazepam", seroquel: "quetiapine", abilify: "aripiprazole",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", plavix: "clopidogrel",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", singulair: "montelukast",
  flonase: "fluticasone", zyrtec: "cetirizine", claritin: "loratadine", benadryl: "diphenhydramine",
  zyloprim: "allopurinol", uloric: "febuxostat", colcrys: "colchicine", flomax: "tamsulosin",
  proscar: "finasteride", fosamax: "alendronate", renvela: "sevelamer", veltassa: "patiromer",
  lokelma: "sodium zirconium cyclosilicate", kayexalate: "sodium polystyrene sulfonate",
};
const combinations: Record<string, string[]> = {
  hyzaar: ["losartan", "hydrochlorothiazide"], prinzide: ["lisinopril", "hydrochlorothiazide"],
  zestoretic: ["lisinopril", "hydrochlorothiazide"], lotrel: ["amlodipine", "benazepril"],
  janumet: ["sitagliptin", "metformin"], synjardy: ["empagliflozin", "metformin"],
  xigduo: ["dapagliflozin", "metformin"], invokamet: ["canagliflozin", "metformin"],
  entresto: ["sacubitril", "valsartan"], bactrim: ["sulfamethoxazole", "trimethoprim"],
  augmentin: ["amoxicillin", "clavulanic acid"],
};
const genericNames = [...new Set([
  ...Object.values(drugAliases), ...Object.values(combinations).flat(),
  "chlorthalidone", "indapamide", "doxazosin", "terazosin", "minoxidil", "captopril", "fosinopril", "perindopril",
  "potassium chloride", "sodium bicarbonate", "aspirin", "amoxicillin", "doxycycline", "azithromycin",
  "cephalexin", "ciprofloxacin", "nitrofurantoin", "prednisone", "hydroxychloroquine", "methotrexate",
])].sort((a, b) => b.length - a.length || cmp(a, b));
const escapeRE = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasName = (text: string, name: string): boolean => new RegExp(`\\b${escapeRE(name)}\\b`, "i").test(text);
type DrugPart = { ingredient?: string; strength?: { value: number; unit: "mg" | "mcg" } };
const salt = "(?:hydrochloride|hcl|potassium|sodium|succinate|tartrate|besylate|maleate|fumarate|phosphate|acetate|sulfate|sulphate|mesylate)";
function drugParts(name: string): DrugPart[] {
  const lower = name.toLowerCase().replace(/\s+/g, " ");
  const found = new Set<string>();
  for (const generic of genericNames) if (hasName(lower, generic)) found.add(generic);
  for (const [alias, generic] of Object.entries(drugAliases)) if (hasName(lower, alias)) found.add(generic);
  for (const [brand, ingredients] of Object.entries(combinations)) if (hasName(lower, brand)) for (const g of ingredients) found.add(g);
  if (!found.size) {
    let generic = lower.replace(/^\s*(?:\d+(?:\.\d+)?\s*(?:ml|hr)\s+)+/, "")
      .split(/\s+\d|\s*\[/)[0]
      .replace(/\b(?:extended release|delayed release|oral|tablet|capsule|solution|suspension|injection|injectable|cream|ointment|er|xr|xl|sr|dr)\b.*$/, "")
      .trim();
    generic = generic.replace(new RegExp(`\\s+${salt}$`, "i"), "").trim();
    if (generic && !/\b(?:unknown|unspecified|unidentified|pill|medicine|medication|supplement)\b/.test(generic)
        && !/^(?:insulin|vitamin|diuretic|antibiotic|antidepressant)$/.test(generic)) found.add(generic);
  }
  if (!found.size) return [{}];
  return [...found].sort(cmp).map(ingredient => {
    const part: DrugPart = { ingredient };
    // A concentration (mg/mL) is not strength per tablet.
    const aliases = [ingredient, ...Object.keys(drugAliases).filter(a => drugAliases[a] === ingredient)];
    for (const alias of aliases) {
      const m = new RegExp(`\\b${escapeRE(alias)}(?:\\s+${salt})?(?:\\s+(?:er|xr|xl|sr|dr))?\\s+(\\d+(?:\\.\\d+)?)\\s*(mg|mcg|micrograms?|g)\\b(?!\\s*\\/\\s*(?:ml|l)\\b)`, "i").exec(lower);
      if (m) {
        const unit = m[2].toLowerCase();
        part.strength = { value: +m[1] * (unit === "g" ? 1000 : 1), unit: unit.startsWith("mc") || unit.startsWith("micro") ? "mcg" : "mg" };
        break;
      }
    }
    if (!part.strength && found.size === 1) {
      const strengths = [...lower.matchAll(/\b(\d+(?:\.\d+)?)\s*(mg|mcg|micrograms?|g)\b(?!\s*\/\s*(?:ml|l)\b)/g)];
      if (strengths.length === 1) {
        const m = strengths[0];
        part.strength = { value: +m[1] * (m[2] === "g" ? 1000 : 1), unit: /^(?:mc|micro)/.test(m[2]) ? "mcg" : "mg" };
      }
    }
    return part;
  });
}
function doseFor(data: Obj, part: DrugPart, count: number): MedicationRow["dose"] {
  if (!object(data.dose) || !num(data.dose.value) || data.dose.value < 0 || typeof data.dose.unit !== "string") return undefined;
  const value = data.dose.value, unit = data.dose.unit.toLowerCase();
  if (["tab", "tablet", "tablets"].includes(unit)) {
    if (part.strength) return num(value * part.strength.value) ? { value: value * part.strength.value, unit: part.strength.unit } : undefined;
    return { value, unit: "tablet" };
  }
  if (count > 1) return undefined; // A combination product's mass is not the mass of each ingredient.
  if (unit === "mg" || unit === "mcg") return { value, unit };
  if (["unit", "units", "unt", "[iu]", "iu"].includes(unit)) return { value, unit: "units" };
  if (unit === "ml") return { value, unit: "mL" };
  if (unit === "g" && num(value * 1000)) return { value: value * 1000, unit: "mg" };
  return undefined;
}
function medicationRows(entries: Entry[]): MedicationRow[] {
  const selected = new Map<string, Candidate<MedicationRow>>();
  for (const events of lines(entries, "med_event", "med_id")) {
    const e = events[events.length - 1], d = e.data;
    if (!object(d.drug) || !str(d.drug.name)) continue;
    const name = d.drug.name as string;
    const status = d.action === "hold" ? "held" : d.action === "stop" ? "stopped"
      : ["start", "change", "resume"].includes(textOf(d.action)) ? "active" : undefined;
    if (!status) continue;
    const since = status === "active" ? [...events].reverse().find(x => x.data.action === "start" || x.data.action === "resume") : e;
    const parts = drugParts(name);
    for (const part of parts) {
      const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: evidence(e) };
      if (part.ingredient) row.ingredient = part.ingredient;
      if (since?.effective) {
        row.status_since = since.effective.date;
        row.evidence = joinEvidence(row.evidence, evidence(since));
      }
      const dose = doseFor(d, part, parts.length);
      if (dose) row.dose = dose;
      if (["QD", "BID", "TID", "QHS", "PRN"].includes(textOf(d.frequency))) row.frequency = d.frequency as MedicationRow["frequency"];
      else if (d.frequency === "OTHER") {
        const sig = textOf(d.sig);
        row.frequency = /\b(?:weekly|once (?:a|per) week|every week)\b/i.test(sig)
          && !/\b(?:daily|twice|three times|every (?:other|two|2) weeks?|[2-9] times (?:a |per )?week)\b/i.test(sig) ? "QW" : "other";
      }
      if (status === "stopped" && ["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(textOf(d.stop_reason))) row.stop_reason = d.stop_reason as MedicationRow["stop_reason"];
      if (status !== "active" && str(d.reason_text)) row.status_reason_text = d.reason_text as string;
      const sensitivity = sensitive(e);
      if (sensitivity) row.sensitivity = sensitivity;
      const k = part.ingredient ? key(e.item.issuer, part.ingredient) : key(e.item.issuer, textOf(d.med_id));
      const old = selected.get(k);
      if (!old || entryOrder(old.entry, e) < 0) selected.set(k, { entry: e, row });
    }
  }
  return [...selected.values()].sort((a, b) => cmp(a.row.ingredient ?? a.row.drug_name, b.row.ingredient ?? b.row.drug_name) || entryOrder(a.entry, b.entry)).map(x => x.row);
}

function isCKD(d: Obj): boolean {
  return /^N18(?:\.|$)/i.test(textOf(d.icd10cm ?? "")) || /\b(?:chronic kidney disease|chronic renal (?:disease|failure)|ckd)\b/i.test(textOf(d.description ?? ""));
}
function ckdStage(d: Obj): ProblemRow["ckd_stage"] {
  const text = textOf(d.description ?? "");
  const m = /\bG\s*(3a|3b|1|2|4|5)(?=\b|A[123]\b)|\bstage\s*(3a|3b|1|2|4|5)\b/i.exec(text);
  if (m) return ("G" + (m[1] ?? m[2]).toLowerCase()) as ProblemRow["ckd_stage"];
  const codes: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
  return codes[textOf(d.icd10cm ?? "").toUpperCase()];
}
function conditionKeys(d: Obj): string[] {
  if (isCKD(d)) return ["ckd"];
  const keys = ["name:" + norm(textOf(d.description ?? ""))];
  if (str(d.icd10cm)) keys.push("icd:" + textOf(d.icd10cm).toUpperCase());
  if (str(d.snomed)) keys.push("snomed:" + d.snomed);
  return keys;
}
function problemCandidates(entries: Entry[], merge = true): Candidate<ProblemRow>[] {
  const groups: { keys: Set<string>; current: Candidate<ProblemRow> }[] = [];
  const latest = lines(entries, "problem_event", "problem_id").map(es => es[es.length - 1]).sort(entryOrder);
  for (const e of latest) {
    const d = e.data, description = str(d.description);
    if (!description || !["add", "update", "resolve"].includes(textOf(d.action))) continue;
    if (/\b(?:rule[ds]? out|ruled-out|suspected|possible|probable|provisional|working diagnosis|no evidence of)\b/i.test(description)) continue;
    const row: ProblemRow = { condition: description, status: d.action === "resolve" ? "resolved" : "active", evidence: evidence(e) };
    if (str(d.icd10cm)) row.icd10cm = d.icd10cm as string;
    if (str(d.snomed)) row.snomed = d.snomed as string;
    const began = onset(d.onset);
    if (began) row.onset = began;
    if (isCKD(d)) {
      const stage = ckdStage(d);
      if (stage) row.ckd_stage = stage;
      const albuminuria = /(?:\b|G[1-5][ab]?)(A[123])\b/i.exec(description)?.[1].toUpperCase();
      if (albuminuria) row.albuminuria = albuminuria as ProblemRow["albuminuria"];
    }
    const sensitivity = sensitive(e);
    if (sensitivity) row.sensitivity = sensitivity;
    const keys = conditionKeys(d).map(k => key(e.item.issuer, k));
    const matches = merge ? groups.filter(g => keys.some(k => g.keys.has(k))) : [];
    const union = new Set(keys);
    for (const g of matches) for (const k of g.keys) union.add(k);
    for (let i = groups.length - 1; i >= 0; i--) if (matches.includes(groups[i])) groups.splice(i, 1);
    groups.push({ keys: union, current: { entry: e, row } });
  }
  return groups.map(g => g.current).sort((a, b) => cmp(a.row.condition, b.row.condition) || entryOrder(a.entry, b.entry));
}

const aceDrugs = ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "fosinopril", "perindopril", "quinapril", "trandolapril", "moexipril"];
const sglt2Drugs = ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "bexagliflozin", "sotagliflozin"];
function reactionKind(reaction: string, fallback?: unknown): AllergyIntoleranceRow["reaction_type"] | undefined {
  if (/\b(?:hives|urticaria|rash|angioedema|anaphyl\w*|bronchospasm|stevens.johnson|toxic epidermal necrolysis)\b/i.test(reaction)) return "hypersensitivity";
  if (/\b(?:ketoacidosis|lactic acidosis|hyperkalemia|renal failure|kidney injury|rhabdomyolysis|pancreatitis|hepatotoxicity|agranulocytosis|severe hypoglycemia)\b/i.test(reaction)) return "serious_adverse_event";
  if (/\b(?:cough|nausea|vomiting|diarrhea|gi upset|myalgia|dizziness|headache)\b/i.test(reaction)) return "side_effect";
  if (fallback === "allergy") return "hypersensitivity";
  if (fallback === "adverse_reaction") return "serious_adverse_event";
  if (fallback === "intolerance") return "side_effect";
  return undefined;
}
function mechanism(substance: string, reaction: string, sourceType?: unknown): AllergyIntoleranceRow["mechanism"] {
  if ((aceDrugs.includes(substance) || /\bACE[ -]?inhibitor/i.test(substance)) && /\b(?:cough|angioedema)\b/i.test(reaction)) return "non_immune";
  if (/\b(?:non[- ]immune|ketoacidosis|lactic acidosis|hyperkalemia|hypoglycemia)\b/i.test(reaction)) return "non_immune";
  if (sourceType === "allergy") return "immune";
  if (sourceType === "intolerance") return "non_immune";
  return "unknown";
}
function substanceName(name: string, isDrug: boolean): string {
  const parts = drugParts(name);
  const known = genericNames.some(g => hasName(name, g)) || Object.keys(drugAliases).some(a => hasName(name, a));
  return (isDrug || known) && parts.length === 1 && parts[0].ingredient ? parts[0].ingredient : name;
}
function drugCause(e: Entry, entries: Entry[]): AllergyIntoleranceRow | undefined {
  const d = e.data, text = str(d.description);
  if (!text || !/\b(?:associated|induced|caused by|due to|secondary to|adverse (?:effect|reaction)|from)\b/i.test(text)) return undefined;
  let substance: string | undefined;
  let sources = evidence(e);
  const causalText = text.replace(/[‐‑‒–—−]/g, "-");
  // A drug mentioned as treatment is not a cause. Require the causal wording to attach to it.
  const attributedTo = (name: string): boolean => {
    const n = escapeRE(name);
    return new RegExp(`\\b${n}(?:[ -]+(?:associated|induced|related)|\\s+(?:caused|causing))\\b`, "i").test(causalText)
      || new RegExp(`\\b(?:caused by|due to|secondary to|from|adverse (?:effects?|reactions?)(?: of| to)?)\\s+(?:the\\s+)?${n}\\b`, "i").test(causalText);
  };
  const explicit = genericNames.filter(attributedTo);
  for (const [brand, generic] of Object.entries(drugAliases)) if (attributedTo(brand) && !explicit.includes(generic)) explicit.push(generic);
  if (explicit.length === 1) substance = explicit[0];
  if (!substance) {
    const classMatch = /\b(SGLT[- ]?2(?:[ -]inhibitors?)?|ACE[ -]inhibitors?|statins?|NSAIDs?)\b/i.exec(text);
    if (classMatch && attributedTo(classMatch[0])) {
      substance = classMatch[0];
      const allowed = /^SGLT/i.test(substance) ? sglt2Drugs : /^ACE/i.test(substance) ? aceDrugs
        : /^statin/i.test(substance) ? ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"]
        : ["ibuprofen", "naproxen", "diclofenac", "meloxicam", "celecoxib", "indomethacin"];
      const sameItem = new Map<string, Entry[]>();
      for (const med of entries) if (med.item.id === e.item.id && med.item.issuer === e.item.issuer && med.data.type === "med_event" && object(med.data.drug) && str(med.data.drug.name)) {
        for (const part of drugParts(med.data.drug.name as string)) if (part.ingredient && allowed.includes(part.ingredient)) {
          sameItem.set(part.ingredient, [...(sameItem.get(part.ingredient) ?? []), med]);
        }
      }
      if (sameItem.size === 1) {
        substance = [...sameItem.keys()][0];
        sources = joinEvidence(sources, ...sameItem.get(substance)!.map(evidence));
      }
    }
  }
  if (!substance) return undefined;
  const kind = reactionKind(text) ?? "serious_adverse_event";
  const row: AllergyIntoleranceRow = {
    substance, reaction_type: kind, mechanism: mechanism(substance, text), reaction: text,
    criticality: /\b(?:ketoacidosis|lactic acidosis|severe hyperkalemia|renal failure|kidney injury|rhabdomyolysis|anaphyl\w*|angioedema|bronchospasm|stevens.johnson|toxic epidermal necrolysis)\b/i.test(text) ? "high" : "unknown",
    evidence: sources,
  };
  const began = onset(d.onset);
  if (began) row.onset = began;
  const sensitivity = sensitive(e);
  if (sensitivity) row.sensitivity = sensitivity;
  return row;
}
function allergyRows(entries: Entry[], problems: Candidate<ProblemRow>[]): AllergyIntoleranceRow[] {
  const direct = new Map<string, Candidate<AllergyIntoleranceRow>>();
  const inactive = new Map<string, Entry>();
  for (const es of lines(entries, "allergy_event", "allergy_id")) {
    const e = es[es.length - 1], d = e.data;
    if (!object(d.substance) || !str(d.substance.name)) continue;
    const substance = substanceName(d.substance.name as string, !!str(d.substance.rxnorm));
    const k = key(e.item.issuer, norm(substance));
    if (d.action === "inactivate") {
      const old = inactive.get(k);
      if (!old || entryOrder(old, e) < 0) inactive.set(k, e);
      continue;
    }
    if (d.action !== "add" && d.action !== "update") continue;
    if (/^(?:no known (?:drug )?allergies|nkda|nka)$/i.test(substance)) continue;
    const reaction = Array.isArray(d.reactions) ? d.reactions.filter((x): x is string => !!str(x)).join("; ") : "";
    const kind = reactionKind(reaction, d.reaction_type);
    if (!kind) continue;
    const row: AllergyIntoleranceRow = {
      substance, reaction_type: kind, mechanism: mechanism(substance, reaction, d.reaction_type),
      criticality: d.severity === "high" || d.severity === "low" ? d.severity : "unknown", evidence: evidence(e),
    };
    if (reaction) row.reaction = reaction;
    if (str(d.substance.rxnorm)) row.rxnorm_ingredient = d.substance.rxnorm as string;
    const began = onset(d.onset);
    if (began) row.onset = began;
    const sensitivity = sensitive(e);
    if (sensitivity) row.sensitivity = sensitivity;
    const old = direct.get(k);
    if (!old || entryOrder(old.entry, e) < 0) direct.set(k, { entry: e, row });
  }
  const derived = new Map<string, Candidate<AllergyIntoleranceRow>>();
  for (const p of problems) {
    const row = drugCause(p.entry, entries);
    if (!row) continue;
    const k = key(p.entry.item.issuer, norm(row.substance));
    const inactivation = inactive.get(k);
    if (inactivation && entryOrder(p.entry, inactivation) <= 0) continue;
    const explicit = direct.get(k);
    if (explicit) {
      explicit.row.evidence = joinEvidence(explicit.row.evidence, row.evidence);
      if (row.sensitivity) explicit.row.sensitivity = row.sensitivity;
    } else {
      const old = derived.get(k);
      if (!old || entryOrder(old.entry, p.entry) < 0) derived.set(k, { entry: p.entry, row });
    }
  }
  return [...direct.values(), ...derived.values()].sort((a, b) => cmp(a.row.substance, b.row.substance) || entryOrder(a.entry, b.entry)).map(x => x.row);
}

const units: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const labCodes: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", CR: "creatinine", K: "potassium", POTASSIUM: "potassium",
  NA: "sodium", SODIUM: "sodium", CL: "chloride", CHLORIDE: "chloride", CO2: "bicarbonate", TCO2: "bicarbonate",
  HCO3: "bicarbonate", BICARB: "bicarbonate", BICARBONATE: "bicarbonate", AG: "anion_gap", AGAP: "anion_gap", ANIONGAP: "anion_gap",
  BUN: "bun", UREANITROGEN: "bun", GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", MALBCR: "uacr", UMALBCR: "uacr", PLT: "platelets", PLATELET: "platelets", PLATELETS: "platelets",
  WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", HEMOGLOBIN: "hemoglobin", BHB: "bhb", BOHB: "bhb",
  PH: "ph", VPH: "ph", APH: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2", LIPASE: "lipase", LIP: "lipase",
  TNI: "troponin", TROP: "troponin", TROPONIN: "troponin", TROPONINI: "troponin", TROPI: "troponin",
  CHOL: "cholesterol", TC: "cholesterol", CHOLESTEROL: "cholesterol", TG: "triglycerides", TRIG: "triglycerides",
  TRIGLYCERIDES: "triglycerides", HDL: "hdl", HDLC: "hdl", LDL: "ldl", LDLC: "ldl", LDLCALC: "ldl", LDLDIRECT: "ldl",
};
const loincAnalytes: Record<string, Analyte> = {
  "2160-0": "creatinine", "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "62238-1": "egfr", "98979-8": "egfr",
  "2823-3": "potassium", "2951-2": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate",
  "10466-1": "anion_gap", "33037-3": "anion_gap", "3094-0": "bun", "2345-7": "glucose", "1558-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "14959-1": "uacr", "9318-7": "uacr", "777-3": "platelets", "26515-7": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "6873-4": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl",
};
function analyteOf(d: Obj): Analyte | undefined {
  if (!object(d.test)) return undefined;
  const test = d.test, name = textOf(test.name ?? "");
  // Do not mistake urine concentrations, point-of-care meters, or troponin T for tracked tests.
  if (/\b(?:urine|urinary)\b/i.test(name) && !/albumin.*creatinine|creatinine.*ratio|\bUACR\b/i.test(name)) return undefined;
  if (/\b(?:troponin[ -]?T|POC|point.of.care|fingerstick|meter)\b/i.test(name)) return undefined;
  for (const code of [test.nfm_code, object(d.external_ref) ? d.external_ref.result_code : undefined]) {
    if (typeof code !== "string") continue;
    const c = code.toUpperCase().replace(/^LK[-_]/, "").replace(/[^A-Z0-9]/g, "");
    if (c.includes("EGFR") || c.startsWith("GFR")) return "egfr";
    if (Object.hasOwn(labCodes, c)) return labCodes[c];
  }
  if (typeof test.loinc === "string" && Object.hasOwn(loincAnalytes, test.loinc)) return loincAnalytes[test.loinc];
  const patterns: [RegExp, Analyte][] = [
    [/albumin.*creatinine|\b(?:uacr|microalbumin\/creatinine)\b/i, "uacr"],
    [/\b(?:egfr|estimated glomerular filtration|glomerular filtration rate)\b/i, "egfr"],
    [/\bcreatinine\b/i, "creatinine"], [/\bpotassium\b/i, "potassium"], [/\bsodium\b/i, "sodium"], [/\bchloride\b/i, "chloride"],
    [/\bpco2\b|carbon dioxide.*partial pressure/i, "pco2"],
    [/\b(?:bicarbonate|carbon dioxide|total co2)\b/i, "bicarbonate"], [/\banion gap\b/i, "anion_gap"], [/\b(?:urea nitrogen|bun)\b/i, "bun"],
    [/\bglucose\b/i, "glucose"], [/\b(?:a1c|hba1c|glycated hemoglobin)\b/i, "a1c"], [/\bplatelet\w*\b/i, "platelets"],
    [/\b(?:wbc|white blood cell|leukocyte)\w*\b/i, "wbc"], [/\bhemoglobin\b/i, "hemoglobin"],
    [/\b(?:beta[ -]?hydroxybutyrate|bhb)\b/i, "bhb"],
    [/\bpH\b/, "ph"], [/\blipase\b/i, "lipase"], [/\btroponin[ -]?I\b/i, "troponin"],
    [/\b(?:hdl|high.density lipoprotein)\b/i, "hdl"], [/\b(?:ldl|low.density lipoprotein)\b/i, "ldl"],
    [/\btriglyceride\w*\b/i, "triglycerides"], [/\b(?:total cholesterol|cholesterol,? total)\b/i, "cholesterol"],
  ];
  return patterns.find(([p]) => p.test(name))?.[1];
}
function equationIn(text: string): LabResultRow["egfr_equation"] | undefined {
  if (/\bMDRD\b|\b(?:E?GFR)[-_]?MDRD\b/i.test(text)) return "mdrd";
  if (/CKD[ -]?EPI[^.;\n]*2021|2021[^.;\n]*CKD[ -]?EPI|\bEGFR(?:[-_]?CKDEPI)?[-_]?(?:2021|21)\b/i.test(text)) return "ckd-epi-2021";
  if (/CKD[ -]?EPI[^.;\n]*2009|2009[^.;\n]*CKD[ -]?EPI|\bEGFR[-_]?(?:2009|09)[NA]?\b/i.test(text)) return "ckd-epi-2009";
  return undefined;
}
function egfrEquation(d: Obj): NonNullable<LabResultRow["egfr_equation"]> {
  const test = object(d.test) ? d.test : {}, ext = object(d.external_ref) ? d.external_ref : {};
  // Method notes describe the actual calculation even when a legacy test code survived.
  return equationIn(textOf(d.comment ?? "")) ?? equationIn(textOf(test.name ?? ""))
    ?? equationIn(textOf(ext.result_code ?? "") + " " + textOf(test.nfm_code ?? "")) ?? "unknown";
}
function raceCoefficient(d: Obj): boolean {
  const t = object(d.test) ? d.test : {}, ext = object(d.external_ref) ? d.external_ref : {};
  const codes = `${textOf(t.nfm_code)} ${textOf(ext.result_code)}`.toUpperCase();
  const name = textOf(t.name ?? "");
  if (/NON[ -]?(?:AFRICAN[ -]?AMERICAN|BLACK|AA)|WITHOUT (?:THE )?RACE/i.test(name)
      || /(?:EGFR|GFR)[-_]?(?:NAA|NONAA|09N|2009N)\b/.test(codes)) return false;
  return /(?:EGFR|GFR)[-_]?(?:AA|09A|2009A)\b/.test(codes)
    || /\b(?:African[ -]American|Black|with (?:the )?race coefficient)\b/i.test(name) || t.loinc === "48643-1";
}
function numericResult(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof v !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*$/.exec(v);
  if (!m || !Number.isFinite(+m[2])) return undefined;
  const result: { value: number; comparator?: LabResultRow["comparator"] } = { value: +m[2] };
  if (m[1]) result.comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as LabResultRow["comparator"];
  return result;
}
function convertedValue(analyte: Analyte, value: number, sourceUnit: unknown): number | undefined {
  if (typeof sourceUnit !== "string") return undefined;
  const u = sourceUnit.trim().toLowerCase().replace(/[µμ]/g, "u").replace(/\s/g, "").replace(/²/g, "2").replace(/\^/g, "*");
  const target = units[analyte].toLowerCase();
  let factor: number | undefined;
  if (u === target) factor = 1;
  else if ((analyte === "platelets" || analyte === "wbc") && ["cells/ul", "cell/ul"].includes(u)) factor = 0.001;
  else if ((analyte === "platelets" || analyte === "wbc") && ["k/ul", "10*3/ul", "10*9/l", "x10*9/l"].includes(u)) factor = 1;
  else if (analyte === "egfr" && ["ml/min/1.73m2", "ml/min/1.73m*2", "ml/min/1.73m²"].includes(u)) factor = 1;
  else if (analyte === "ph" && ["", "ph", "[ph]"].includes(u)) factor = 1;
  else if (target === "mmol/l" && ["meq/l"].includes(u) && ["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(analyte)) factor = 1;
  else if (analyte === "creatinine" && u === "umol/l") factor = 1 / 88.4;
  else if (analyte === "glucose" && u === "mmol/l") factor = 18.016;
  else if (analyte === "hemoglobin" && u === "g/l") factor = 0.1;
  else if (analyte === "troponin" && (u === "ng/l" || u === "pg/ml")) factor = 0.001;
  else if (analyte === "uacr" && u === "ug/mg") factor = 1;
  else if (analyte === "lipase" && u === "iu/l") factor = 1;
  if (factor === undefined) return undefined;
  const result = value * factor;
  return Number.isFinite(result) ? result : undefined;
}
function labRank(e: Entry): number {
  return e.data.result_status === "C" ? 3 : e.data.result_status === "F" ? 2 : 1;
}
function labOrder(a: Entry, b: Entry): number {
  return labRank(a) - labRank(b)
    || (stamp(a.data.resulted)?.order ?? a.recorded.order) - (stamp(b.data.resulted)?.order ?? b.recorded.order)
    || a.recorded.order - b.recorded.order || entryOrder(a, b);
}
function labRows(entries: Entry[]): LabResultRow[] {
  const copies = new Map<string, Entry>();
  for (const e of entries) {
    const d = e.data;
    if (d.type !== "imported_result" || !["P", "F", "C"].includes(textOf(d.result_status)) || !object(d.test)) continue;
    const ext = object(d.external_ref) ? d.external_ref : {};
    const accession = str(ext.accession), component = str(ext.result_code) ?? str(d.test.nfm_code);
    const k = accession && component ? key(e.item.issuer, textOf(ext.lab ?? "Lakeview Labs"), accession, component)
      : key(e.item.issuer, e.item.id, e.id);
    const old = copies.get(k);
    if (!old || labOrder(old, e) < 0) copies.set(k, e);
  }
  const results = new Map<string, Candidate<LabResultRow>>();
  for (const e of copies.values()) {
    const d = e.data, analyte = analyteOf(d);
    if (!analyte || (analyte === "egfr" && raceCoefficient(d))) continue;
    // Select the standing copy BEFORE parsing: a nonnumeric correction must suppress an old number.
    const parsed = numericResult(d.value);
    const collected = str(d.collected), time = stamp(collected);
    if (!parsed || !collected || !time?.local) continue;
    const value = convertedValue(analyte, parsed.value, d.unit);
    if (value === undefined) continue;
    const row: LabResultRow = { analyte, value, unit: units[analyte], collected, status: d.result_status === "P" ? "preliminary" : "final", evidence: evidence(e) };
    if (parsed.comparator) row.comparator = parsed.comparator;
    if (object(d.test) && str(d.test.loinc)) row.loinc = d.test.loinc as string;
    if (analyte === "egfr") row.egfr_equation = egfrEquation(d);
    // Different component codes can describe different calculations, even with the same equation.
    const k = key(e.item.issuer, e.item.id, e.id);
    const old = results.get(k);
    if (!old || labOrder(old.entry, e) < 0) results.set(k, { entry: e, row });
  }
  return [...results.values()].sort((a, b) => (stamp(a.row.collected)!.order - stamp(b.row.collected)!.order)
    || cmp(a.row.analyte, b.row.analyte) || entryOrder(a.entry, b.entry)).map(x => x.row);
}
function bloodPressure(x: unknown): [number, number] | undefined {
  if (typeof x !== "string") return undefined;
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(x);
  return m && Number.isFinite(+m[1]) && Number.isFinite(+m[2]) ? [+m[1], +m[2]] : undefined;
}
function vitalRows(entries: Entry[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const e of entries) {
    if (e.data.type !== "vital_set" || !e.effective?.local) continue;
    const d = e.data;
    const row: VitalRow = { setting: "clinic", local_time: e.effective.local, evidence: evidence(e) };
    const bp = bloodPressure(d.bp), repeat = bloodPressure(d.bp_repeat);
    if (bp) [row.systolic_mmhg, row.diastolic_mmhg] = bp;
    if (repeat) [row.repeat_systolic_mmhg, row.repeat_diastolic_mmhg] = repeat;
    if (num(d.pulse_bpm)) row.pulse_bpm = d.pulse_bpm;
    if (num(d.weight_lb)) {
      const kg = Math.round(d.weight_lb * 0.45359237 * 10) / 10;
      if (num(kg)) row.weight_kg = kg;
    }
    if (bp || repeat || row.pulse_bpm !== undefined || row.weight_kg !== undefined) rows.push(row);
  }
  return rows;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const entries = currentEntries(items, asOf);
  const problems = problemCandidates(entries);
  return {
    medications: medicationRows(entries),
    // T-code adverse-effect entries without a named condition belong only in the avoidance list.
    problems: problems.filter(p => !/^T\d/i.test(p.row.icd10cm ?? "")
      || !/\badverse (?:effect|reaction)\b/i.test(p.row.condition)
      || /\b(?:ketoacidosis|acidosis|angioedema|anaphyl\w*|rash|cough|hyperkalemia|hypoglycemia|pancreatitis|kidney injury|renal failure)\b/i.test(p.row.condition)).map(p => p.row),
    allergies: allergyRows(entries, problemCandidates(entries, false)), labs: labRows(entries), vitals: vitalRows(entries),
  };
}
