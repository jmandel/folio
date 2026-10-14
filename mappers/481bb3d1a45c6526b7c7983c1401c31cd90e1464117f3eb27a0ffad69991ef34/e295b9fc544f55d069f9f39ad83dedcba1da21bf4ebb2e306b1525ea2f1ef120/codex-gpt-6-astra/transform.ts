import type {
  CodeableConcept, FolioItem, MedicationRequest, Quantity, UsCoreRows,
} from "../in/views/uscore";

type ObjectValue = Record<string, unknown>;
type Frequency = "QD" | "BID" | "TID" | "QHS" | "QW" | "PRN" | "other";
type StopReason = "adverse_reaction" | "ineffective" | "therapy_changed"
  | "course_complete" | "patient_choice" | "other";

function object(value: unknown): value is ObjectValue {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function partialDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) return;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || (month !== undefined && (month < 1 || month > 12))) return;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day !== undefined && (day < 1 || day > days[month - 1])) return;
  return value;
}

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
});

function instant(value: unknown): number | undefined {
  if (typeof value !== "string") return;
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$/i.exec(value);
  if (!match || !partialDate(match[1]) || +match[2] > 23 || +match[3] > 59 || +match[4] > 59) return;
  if (match[5].toUpperCase() !== "Z" && (+match[5].slice(1, 3) > 23 || +match[5].slice(4) > 59)) return;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : undefined;
}

function localDate(time: number): string {
  const parts = chicago.formatToParts(time);
  const get = (part: string) => parts.find(p => p.type === part)?.value ?? "";
  return `${get("year").padStart(4, "0")}-${get("month")}-${get("day")}`;
}

interface Item {
  id: string;
  issuer: string;
  patient: string;
  recorded: number;
  effective: string;
  narrative: string;
  payload: ObjectValue;
  supersedes: string[];
  retracts: string[];
}

function ids(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.length > 0) : [];
}

function key(issuer: string, id: string): string {
  return JSON.stringify([issuer, id]);
}

function scopedItems(input: unknown, asOf: string): Item[] {
  if (!Array.isArray(input)) return [];
  const result: Item[] = [];
  for (const raw of input) {
    if (!object(raw)) continue;
    const id = string(raw.id), issuer = string(raw.issuer), patient = string(raw.patient);
    const recorded = instant(raw.recorded);
    if (!id || !issuer || !patient || recorded === undefined || localDate(recorded) > asOf) continue;
    result.push({
      id, issuer, patient, recorded,
      effective: partialDate(raw.effective) ?? "",
      narrative: typeof raw.narrative === "string" ? raw.narrative : "",
      payload: object(raw.payload) ? raw.payload : {},
      supersedes: ids(raw.supersedes), retracts: ids(raw.retracts),
    });
  }
  return result;
}

function hasMedicines(item: Item): boolean {
  return Object.values(item.payload).some(entry => object(entry) && entry.type === "my_med");
}

function latestLists(items: Item[]): Item[] {
  const removed = new Set<string>();
  const lists = new Set<string>();
  for (const item of items) {
    // Even a superseded/retracted correction suppresses its predecessors. This
    // implements transitive supersession without resurrecting an older save.
    for (const id of [...item.supersedes, ...item.retracts]) removed.add(key(item.issuer, id));
    // Empty lists have no entry discriminator. The app-generated heading is
    // metadata about the snapshot, never a basis for a medication row.
    if (hasMedicines(item) || /^\s*My Medicines(?:\s*,|\s*$)/i.test(item.narrative)) {
      lists.add(key(item.issuer, item.id));
    }
  }
  // An empty replacement of a known list also restates that list as empty.
  // A retraction alone is not a replacement snapshot.
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of items) {
      const itemKey = key(item.issuer, item.id);
      if (!lists.has(itemKey) && Object.keys(item.payload).length === 0 &&
          item.supersedes.some(id => lists.has(key(item.issuer, id)))) {
        lists.add(itemKey);
        changed = true;
      }
    }
  }
  const latest = new Map<string, Item>();
  for (const item of items) {
    if (removed.has(key(item.issuer, item.id)) || !lists.has(key(item.issuer, item.id))) continue;
    const stream = key(item.issuer, item.patient);
    const previous = latest.get(stream);
    // effective is the save date. recorded resolves multiple saves on that day.
    if (!previous || compare(item.effective, previous.effective) > 0 ||
        (item.effective === previous.effective && (item.recorded > previous.recorded ||
          (item.recorded === previous.recorded && compare(item.id, previous.id) > 0)))) {
      latest.set(stream, item);
    }
  }
  return [...latest.values()].sort((a, b) => compare(key(a.issuer, a.patient), key(b.issuer, b.patient)));
}

// Name translations only: this table never supplies RxNorm identifiers. Prefer
// the search result's generic wording, when present, to a patient's nickname.
const drugNames = [
  "metformin|glucophage|glucophage xr|fortamet|glumetza",
  "empagliflozin|jardiance", "dapagliflozin|farxiga|forxiga",
  "canagliflozin|invokana", "ertugliflozin|steglatro",
  "glipizide|glucotrol|glucotrol xl", "glyburide|diabeta|glynase|glibenclamide",
  "glimepiride|amaryl", "pioglitazone|actos", "sitagliptin|januvia",
  "linagliptin|tradjenta", "saxagliptin|onglyza", "alogliptin|nesina",
  "dulaglutide|trulicity", "semaglutide|ozempic|rybelsus|wegovy",
  "liraglutide|victoza|saxenda", "tirzepatide|mounjaro|zepbound",
  "exenatide|byetta|bydureon", "insulin glargine|lantus|basaglar|toujeo|semglee",
  "insulin lispro|humalog|admelog|lyumjev", "insulin aspart|novolog|novorapid|fiasp",
  "insulin detemir|levemir", "insulin degludec|tresiba",
  "losartan|cozaar", "valsartan|diovan", "irbesartan|avapro",
  "candesartan|atacand", "olmesartan|benicar", "telmisartan|micardis",
  "lisinopril|zestril|prinivil", "enalapril|vasotec", "ramipril|altace",
  "benazepril|lotensin", "amlodipine|norvasc", "nifedipine|procardia|adalat",
  "diltiazem|cardizem|tiazac", "verapamil|calan|verelan",
  "hydrochlorothiazide|hctz|microzide", "chlorthalidone|hygroton|thalitone",
  "furosemide|lasix", "torsemide|demadex", "bumetanide|bumex",
  "spironolactone|aldactone", "eplerenone|inspra", "finerenone|kerendia",
  "metoprolol|lopressor|toprol xl", "carvedilol|coreg", "atenolol|tenormin",
  "propranolol|inderal", "bisoprolol|zebeta", "clonidine|catapres",
  "atorvastatin|lipitor", "rosuvastatin|crestor", "simvastatin|zocor",
  "pravastatin|pravachol", "ezetimibe|zetia", "fenofibrate|tricor",
  "levothyroxine|synthroid|levoxyl|unithroid|tirosint",
  "sertraline|zoloft", "fluoxetine|prozac", "escitalopram|lexapro",
  "citalopram|celexa", "paroxetine|paxil", "duloxetine|cymbalta",
  "venlafaxine|effexor|effexor xr", "bupropion|wellbutrin|wellbutrin xl|zyban",
  "trazodone|desyrel", "mirtazapine|remeron", "gabapentin|neurontin",
  "pregabalin|lyrica", "ibuprofen|advil|motrin", "naproxen|aleve|naprosyn",
  "acetaminophen|tylenol|paracetamol", "aspirin|bayer aspirin|ecotrin",
  "celecoxib|celebrex", "meloxicam|mobic", "diclofenac|voltaren",
  "omeprazole|prilosec", "pantoprazole|protonix", "esomeprazole|nexium",
  "famotidine|pepcid", "albuterol|salbutamol|ventolin|proair|proventil",
  "montelukast|singulair", "cetirizine|zyrtec", "loratadine|claritin",
  "fexofenadine|allegra", "diphenhydramine|benadryl",
  "apixaban|eliquis", "rivaroxaban|xarelto", "warfarin|coumadin|jantoven",
  "clopidogrel|plavix", "allopurinol|zyloprim", "colchicine|colcrys|mitigare",
  "tamsulosin|flomax", "finasteride|proscar|propecia",
  "amoxicillin|amoxil", "azithromycin|zithromax", "doxycycline|vibramycin",
  "cephalexin|keflex", "nitrofurantoin|macrobid|macrodantin",
  "prednisone|deltasone", "prednisolone|orapred", "methylprednisolone|medrol",
  "cholecalciferol|vitamin d3", "ergocalciferol|vitamin d2",
  "cyanocobalamin", "vitamin b12|vitamin b-12", "folic acid",
  "potassium chloride|klor-con|k-tab", "ferrous sulfate|feosol",
  "calcium carbonate|tums", "polyethylene glycol 3350|miralax",
  "empagliflozin / metformin|synjardy", "sitagliptin / metformin|janumet",
  "losartan / hydrochlorothiazide|hyzaar", "amoxicillin / clavulanic acid|augmentin",
];

const names = new Map<string, string>();
for (const line of drugNames) {
  const [generic, ...aliases] = line.split("|");
  for (const name of [generic, ...aliases]) names.set(name, generic);
}

function normalized(value: string): string {
  return value.toLowerCase().replace(/[®™]/g, "").replace(/\s+/g, " ").trim();
}

function nameOnly(value: string): string {
  return normalized(value)
    .replace(/\s*\[[^\]]*\]\s*$/, "")
    .replace(/\s+\d+(?:\.\d+)?\s*(?:mg|mcg|ug|g|units?|iu|unt|ml|%)\b.*$/, "")
    .replace(/\s+(?:(?:extended|delayed|immediate|modified)[ -]release|oral|injectable|injection|solution|suspension|tablets?|capsules?|pens?|xr|er|sr|xl)\b.*$/, "")
    .trim();
}

function knownIngredient(value: string): string | undefined {
  const cleaned = nameOnly(value);
  const exact = names.get(cleaned);
  if (exact) return exact;
  const withoutSalt = cleaned.replace(/\s+(?:hydrochloride|hcl|potassium|sodium|calcium|succinate|tartrate|besylate|maleate|phosphate|fumarate|sulfate|citrate)$/, "");
  return names.get(withoutSalt);
}

function ingredient(name: string, searchDisplay?: string): string | undefined {
  if (searchDisplay) {
    // Split named ingredients before removing strengths: otherwise a combination
    // product could be mistaken for its first ingredient alone. A concentration
    // denominator (e.g. " / 1 mL") is not another ingredient.
    const components = searchDisplay.split(/\s+\/\s+(?=[a-z])/i).map(nameOnly).filter(Boolean);
    const known = components.length === 1 ? knownIngredient(searchDisplay) : undefined;
    if (known) return known;
    // Search results can explicitly name generic products beyond the alias
    // table. Strip product strength/form, but do not decode their RxNorm CUI.
    if (components.length > 0 && components.every(c => /^[a-z][a-z -]*$/.test(c))) {
      return components.map(c => knownIngredient(c) ?? c).join(" / ");
    }
  }
  return knownIngredient(name);
}

function frequency(sig: string): Frequency | undefined {
  const text = normalized(sig).replace(/\b([bqt])\.i\.d\./g, "$1id")
    .replace(/\bq\.d\./g, "qd").replace(/\bq\.h\.s\./g, "qhs");
  if (/\b(?:prn|as needed|if needed|when needed|as required)\b/.test(text) ||
      /\b(?:when|if)\b.*\b(?:hurt\w*|pain|wheez\w*|short of breath|nause\w*|headache\w*)\b/.test(text)) return "PRN";
  if (/\b(?:every other|alternate|alternating|twice a week|twice weekly|two times a week|few times|some days|most days|up to|except|qid|four times|4 times|4x|four times daily)\b/.test(text)) return "other";
  if (/\b(?:[4-9]|\d{2,}|four|five|six|seven|eight|nine|ten)\s*(?:x|times)\b/.test(text) ||
      /\b(?:twice|(?:[2-9]|two|three|four) times)\s+(?:(?:a|per|each)\s+)?(?:week|weekly|month|monthly)\b/.test(text) ||
      /\b(?:not daily|not every|used to|previously|formerly)\b/.test(text)) return "other";
  const weekdays = new Set(text.match(/\b(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/g) ?? []);
  if (weekdays.size > 1) return "other";
  const interval = /\b(?:every\s+(\d+)\s+hours|q(\d+)h)\b/.exec(text);
  if (interval && ![8, 12, 24].includes(Number(interval[1] ?? interval[2]))) return "other";
  const codes = new Set<Frequency>();
  if (/\b(?:qw|weekly|once (?:a |per |each )?week|every (?:7 days|week|sunday|monday|tuesday|wednesday|thursday|friday|saturday))\b/.test(text)) codes.add("QW");
  if (/\b(?:bid|twice (?:a |per |each )?(?:day|daily)|two times (?:a |per |each )?(?:day|daily)|2\s*(?:x|times)\s*(?:\/\s*day|daily|a day)|every 12 hours|q12h)\b/.test(text)) codes.add("BID");
  if (/\b(?:tid|three times (?:a |per |each )?(?:day|daily)|3\s*(?:x|times)\s*(?:\/\s*day|daily|a day)|every 8 hours|q8h)\b/.test(text)) codes.add("TID");
  const times = [
    /\b(?:morning|breakfast|qam)\b/, /\b(?:noon|lunch|midday)\b/,
    /\b(?:evening|supper|dinner|qpm)\b/, /\b(?:bedtime|qhs)\b/,
  ].filter(pattern => pattern.test(text)).length;
  if (times >= 2) codes.add(times === 2 ? "BID" : times === 3 ? "TID" : "other");
  if (codes.size > 1) return "other";
  if (codes.size === 1) return [...codes][0];
  if (/\b(?:qhs|bedtime|nightly|every night|each night|at night)\b/.test(text)) return "QHS";
  if (/\b(?:qd|daily|once (?:a |per |each )?day|every (?:day|24 hours)|q24h|each day)\b/.test(text) || times === 1) return "QD";
  if (/\b(?:times|weekly|monthly|every|with meals|qid|q\d+h)\b/.test(text)) return "other";
  return undefined;
}

function quantity(value: number, unit: string, code: string): Quantity {
  return { value, unit, system: "http://unitsofmeasure.org", code };
}

function dose(sig: string, form?: string): Quantity | undefined {
  let text = normalized(sig).replace(/½/g, " 1/2").replace(/¼/g, " 1/4");
  const words: Record<string, string> = {
    one: "1", two: "2", three: "3", four: "4", five: "5", six: "6",
    seven: "7", eight: "8", nine: "9", ten: "10", half: "1/2", quarter: "1/4",
  };
  text = text.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|half|quarter)\b/g, w => words[w]);
  text = text.replace(/(1\/[24])\s+(?:of\s+)?(?:a|an)\s+/g, "$1 ");
  // Variable doses and daily totals do not state a single per-dose amount.
  if (/\b(?:sliding scale|titrate|titrating|alternat\w*|total|divided|up to|maximum|max|do not|don't|never|used to|previously|formerly)\b/.test(text) ||
      /\d\s*(?:[-–—]|to|or)\s*\d/.test(text) ||
      /(?:\band\b|\bthen\b|[,;])\s*\d+(?:\.\d+)?\s+(?:at|in the|with|before|after|every|each)\b/.test(text)) return;
  const amount = "(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:\\.\\d+)?|\\.\\d+)";
  const units = "(?:milligrams?|mg|micrograms?|mcg|ug|µg|μg|grams?|g|international units?|units?|unt|iu|\\[iu\\]|millilit(?:er|re)s?|ml|tablets?|tabs?|capsules?|caps?)";
  const pattern = new RegExp(`(${amount})\\s*(${units})(?![a-z])`, "g");
  const found: Quantity[] = [];
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    // Do not read a concentration, a tablet's strength, or a negative number
    // as the amount administered. Strength_text alone is never a dose.
    if (index > 0 && /[\w.\/-]/.test(text[index - 1])) continue;
    const rest = text.slice(index + match[0].length);
    if (/^\s*(?:\/|per\b|tablets?\b|capsules?\b|pens?\b)/.test(rest)) continue;
    const pieces = match[1].split(/\s+/);
    const fraction = (part: string): number => {
      const [n, d] = part.split("/").map(Number);
      return d === undefined ? n : n / d;
    };
    const value = pieces.reduce((sum, part) => sum + fraction(part), 0);
    if (!Number.isFinite(value) || value <= 0) continue;
    const unit = match[2];
    if (/^(?:milligram|mg)/.test(unit)) found.push(quantity(value, "mg", "mg"));
    else if (/^(?:microgram|mcg|ug|µg|μg)/.test(unit)) found.push(quantity(value, "mcg", "ug"));
    else if (/^(?:gram|g$)/.test(unit)) found.push(quantity(value * 1000, "mg", "mg"));
    else if (/^(?:international|unit|unt|iu|\[iu\])/.test(unit)) found.push(quantity(value, "units", "[iU]"));
    else if (/^(?:millilit|ml)/.test(unit)) found.push(quantity(value, "mL", "mL"));
    else found.push(quantity(value, "tablet", "{tbl}"));
  }
  if (found.length && Number.isFinite(found[0].value) && found.every(q => q.value === found[0].value && q.code === found[0].code)) return found[0];
  // A bare count in "2 when my back hurts" is interpretable only when the
  // source explicitly identifies the product as tablets/capsules.
  if (found.length === 0 && form && /\b(?:tablet|capsule)s?\b/i.test(form)) {
    const count = /^(?:take\s+)?(\d+(?:\.\d+)?|\d+\/\d+)\s+(?:when|if|at|in the|each|every|daily|once|twice|three times|as needed)\b/.exec(text);
    if (count) {
      const [n, d] = count[1].split("/").map(Number);
      const value = d === undefined ? n : n / d;
      if (Number.isFinite(value) && value > 0) return quantity(value, "tablet", "{tbl}");
    }
  }
  return undefined;
}

function reason(note: string): StopReason | undefined {
  const text = normalized(note);
  // A note can instead name a prescriber or indication. It is not automatically
  // a stop reason, and a negated adverse effect must not become a coded reason.
  const indication = /\b(?:for (?:my |the |a )?|treat(?:ing)? )(?:cough|nausea|pain|swelling|rash|diarrhea)\b/.test(text);
  if (!indication && !/\b(?:no|not|never|without|denies)\b/.test(text) &&
      /\b(?:side effects?|adverse|allerg\w*|rash|hives|cough|nausea|vomit\w*|diarrh\w*|dizz\w*|swelling|angioedema|hypoglyc\w*|low (?:blood )?sugar|ketoacidosis|stomach upset|upset stomach|gi upset|made me sick)\b/.test(text)) return "adverse_reaction";
  if (/\b(?:not working|did(?:n't| not) work|ineffective|no (?:benefit|effect)|no longer (?:works?|helps?)|stopped working|wasn't helping|was not helping)\b/.test(text)) return "ineffective";
  if (/\b(?:switched|replaced|changed (?:to|therapy)|instead|substitut\w*)\b/.test(text)) return "therapy_changed";
  if (/\b(?:finished|completed|course (?:is )?(?:done|over|complete))\b/.test(text)) return "course_complete";
  if (/\b(?:my choice|on my own|did(?:n't| not) want|don'?t want|do not want|declined|refused|chose to stop|decided to stop)\b/.test(text)) return "patient_choice";
  if (/\b(?:because|due to|caused|made me|stopp\w*|discontinu\w*|told me to stop|pause\w*|hold|cost|expensive|afford|insurance|ran out|no longer need\w*)\b/.test(text)) return "other";
  return undefined;
}

interface Candidate {
  item: Item;
  entryId: string;
  medId: string;
  entry: ObjectValue;
  name: string;
  ingredient?: string;
  searchDisplay?: string;
  rxnorm?: string;
  event: string;
}

function candidates(item: Item): Candidate[] {
  const byDrug = new Map<string, Candidate>();
  for (const entryId of Object.keys(item.payload).sort(compare)) {
    const entry = item.payload[entryId];
    if (!object(entry) || entry.type !== "my_med") continue;
    const name = string(entry.name), medId = string(entry.homelog_med_id);
    if (!name || !medId || (entry.status !== "taking" && entry.status !== "stopped")) continue;
    const search = object(entry.picked_from_search) ? entry.picked_from_search : undefined;
    const searchDisplay = string(search?.display);
    const suppliedCode = string(search?.rxnorm);
    const rxnorm = suppliedCode && /^\d+$/.test(suppliedCode) ? suppliedCode : undefined;
    const generic = ingredient(name, searchDisplay);
    const candidate: Candidate = {
      item, entryId, medId, entry, name, ingredient: generic, searchDisplay, rxnorm,
      event: partialDate(entry.status === "stopped" ? entry.stopped : entry.started) ?? "",
    };
    // Unidentified nicknames are distinct medicines unless HomeLog's stable id
    // says otherwise. Do not merge all "water pill" entries into one drug.
    const drug = generic ? `ingredient:${generic}` : rxnorm ? `rxnorm:${rxnorm}` : `id:${medId}`;
    const previous = byDrug.get(drug);
    if (!previous || compare(candidate.event, previous.event) > 0 ||
        (candidate.event === previous.event && compare(JSON.stringify([medId, entryId]), JSON.stringify([previous.medId, previous.entryId])) > 0)) {
      byDrug.set(drug, candidate);
    }
  }
  return [...byDrug.entries()].sort(([a], [b]) => compare(a, b)).map(([, candidate]) => candidate);
}

function hash(value: string): string {
  let a = 2166136261, b = 5381;
  for (let i = 0; i < value.length; i++) {
    a = Math.imul(a ^ value.charCodeAt(i), 16777619);
    b = Math.imul(b, 33) ^ value.charCodeAt(i);
  }
  return (a >>> 0).toString(16).padStart(8, "0") + (b >>> 0).toString(16).padStart(8, "0");
}

function medication(candidate: Candidate, id: string): MedicationRequest {
  const { item, entry, name, ingredient: generic, searchDisplay, rxnorm } = candidate;
  const concept: CodeableConcept = { text: rxnorm || !generic ? name : `${name} (${generic})` };
  if (rxnorm) {
    // An ingredient-only search display establishes the level of its supplied
    // code. Product codes are retained as products, never promoted to IN codes.
    const isIngredient = searchDisplay && generic && nameOnly(searchDisplay) === normalized(searchDisplay);
    concept.coding = [{
      system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: rxnorm,
      ...(isIngredient ? { display: generic } : searchDisplay ? { display: searchDisplay } : {}),
    }];
  }
  const row: MedicationRequest = {
    resourceType: "MedicationRequest", id,
    meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
    status: entry.status === "taking" ? "active" : "stopped",
    intent: "plan", reportedBoolean: true,
    medicationCodeableConcept: concept,
    subject: { reference: `Patient/${item.patient}` },
  };
  const started = partialDate(entry.started);
  if (started) row.authoredOn = started;
  if (row.status === "stopped") {
    const note = string(entry.note);
    const code = note ? reason(note) : undefined;
    if (note && code) row.statusReason = [{ text: note, coding: [{ system: "urn:folio:stop-reason", code }] }];
  }
  const sig = string(entry.how_i_take_it);
  if (sig) {
    const timing = frequency(sig);
    const amount = dose(sig, searchDisplay ?? string(entry.strength_text));
    row.dosageInstruction = [{
      text: sig,
      ...(timing ? { timing: { code: { text: timing } } } : {}),
      ...(amount ? { doseAndRate: [{ doseQuantity: amount }] } : {}),
    }];
  }
  return row;
}

/** HomeLog's glucose/BP readings are vitals, not laboratory results. Its dose
 * logs are administrations, not changes to the self-reported medicine list. */
export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const rows: UsCoreRows = { medicationRequests: [], observations: [] };
  if (!partialDate(asOf) || asOf.length !== 10) return rows;
  const usedIds = new Set<string>();
  for (const item of latestLists(scopedItems(items, asOf))) {
    for (const candidate of candidates(item)) {
      const base = `hl-med-${hash(JSON.stringify([item.issuer, item.patient, candidate.medId]))}`;
      let id = base, suffix = 1;
      while (usedIds.has(id)) id = `${base}-${suffix++}`;
      usedIds.add(id);
      rows.medicationRequests.push(medication(candidate, id));
    }
  }
  return rows;
}
