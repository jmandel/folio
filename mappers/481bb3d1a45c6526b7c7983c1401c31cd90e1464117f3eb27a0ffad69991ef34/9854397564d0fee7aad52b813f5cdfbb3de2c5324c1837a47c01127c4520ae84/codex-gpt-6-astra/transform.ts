import type { FolioItem, ViewRows, MedicationRow, VitalRow, Evidence } from "../in/views/views";

// HomeLog has neither a problem/diagnosis list, an allergy list, nor laboratory results.
// In particular, symptom tags and individual taken/skipped doses are not those lists.
type ObjectValue = Record<string, unknown>;
type Item = {
  id: string;
  issuer: string;
  key: string;
  recorded: number;
  effective: string;
  narrative: string;
  payload: ObjectValue;
  supersedes: string[];
  retracts: string[];
};

const object = (v: unknown): v is ObjectValue => v !== null && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): string | undefined => typeof v === "string" && v.trim() ? v : undefined;
const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
const key = (issuer: string, id: string): string => JSON.stringify([issuer, id]);
const clean = (s: string): string => s.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();

function partialDate(v: unknown): string | undefined {
  if (typeof v !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(v)) return;
  const [year, month, day] = v.split("-").map(Number);
  if (year < 1 || (month !== undefined && (month < 1 || month > 12))) return;
  if (day !== undefined) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day < 1 || day > days[month - 1]) return;
  }
  return v;
}

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

function chicagoTime(ms: number): string {
  const parts = chicago.formatToParts(ms);
  const get = (type: string): string => parts.find(p => p.type === type)?.value ?? "";
  return `${get("year").padStart(4, "0")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function instant(v: unknown): number | undefined {
  if (typeof v !== "string") return;
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/i.exec(v);
  if (!m || !partialDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] ?? 0) > 59) return;
  if (m[5].toUpperCase() !== "Z" && (+m[5].slice(1, 3) > 23 || +m[5].slice(4) > 59)) return;
  const ms = Date.parse(v);
  return finite(ms) ? ms : undefined;
}

function localTime(v: unknown): string | undefined {
  if (typeof v !== "string") return;
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(v);
  if (m) return partialDate(m[1]) && +m[2] < 24 && +m[3] < 60 ? v : undefined;
  const ms = instant(v);
  return ms === undefined ? undefined : chicagoTime(ms);
}

function localDate(v: unknown): string | undefined {
  const date = partialDate(v);
  if (date) return date;
  const time = localTime(v);
  return time?.slice(0, 10);
}

function scopedItems(input: unknown, asOf: string): Item[] {
  if (!Array.isArray(input)) return [];
  const result: Item[] = [];
  for (const raw of input) {
    if (!object(raw) || !text(raw.id) || !text(raw.issuer)) continue;
    const recorded = instant(raw.recorded);
    // Compare calendar dates in the consumer's zone; this includes the whole day across DST.
    if (recorded === undefined || chicagoTime(recorded).slice(0, 10) > asOf) continue;
    const id = raw.id as string, issuer = raw.issuer as string;
    result.push({
      id, issuer, key: key(issuer, id), recorded,
      effective: localDate(raw.effective) ?? chicagoTime(recorded).slice(0, 10),
      narrative: typeof raw.narrative === "string" ? raw.narrative : "",
      payload: object(raw.payload) ? raw.payload : {},
      supersedes: strings(raw.supersedes), retracts: strings(raw.retracts),
    });
  }
  return result.sort((a, b) => a.recorded - b.recorded || compare(a.key, b.key));
}

function entries(item: Item): [string, ObjectValue][] {
  return Object.keys(item.payload).sort(compare).flatMap(id => {
    const value = item.payload[id];
    return object(value) ? [[id, value] as [string, ObjectValue]] : [];
  });
}

function currentItems(items: Item[]): Item[] {
  const removed = new Set<string>();
  // Process edges from ALL scoped items, even ones themselves replaced/retracted. Thus an
  // A -> B -> C chain removes A and B, and retracting C does not resurrect A or B.
  for (const item of items) {
    for (const id of [...item.supersedes, ...item.retracts]) {
      if (id !== item.id) removed.add(key(item.issuer, id));
    }
  }
  return items.filter(item => !removed.has(item.key));
}

function medicineLists(all: Item[], current: Item[]): Item[] {
  const lists = new Set<string>();
  for (const item of all) {
    if (entries(item).some(([, e]) => e.type === "my_med") || /^\s*My Medicines\b/i.test(item.narrative)) lists.add(item.key);
  }
  // Empty saves still replace the list. A retraction-only item is not a list save.
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of all) {
      if (!lists.has(item.key) && item.supersedes.some(id => lists.has(key(item.issuer, id)))) {
        lists.add(item.key);
        changed = true;
      }
    }
  }
  const latest = new Map<string, Item>();
  for (const item of current) {
    if (!lists.has(item.key)) continue;
    const old = latest.get(item.issuer);
    if (!old || compare(item.effective, old.effective) > 0 ||
      (item.effective === old.effective && (item.recorded > old.recorded ||
        (item.recorded === old.recorded && compare(item.id, old.id) > 0)))) latest.set(item.issuer, item);
  }
  return [...latest.values()].sort((a, b) => compare(a.key, b.key));
}

// These are name translations, NOT a product-code -> ingredient-code crosswalk.
// Unknown named generics are retained; uninformative nicknames do not become ingredients.
const brands: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine",
  glucophage: "metformin", fortamet: "metformin", glumetza: "metformin", riomet: "metformin",
  glucotrol: "glipizide", amaryl: "glimepiride", diabeta: "glyburide", micronase: "glyburide",
  crestor: "rosuvastatin", lipitor: "atorvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", euthyrox: "levothyroxine", tirosint: "levothyroxine",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", forxiga: "dapagliflozin", invokana: "canagliflozin",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", actos: "pioglitazone",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide",
  mounjaro: "tirzepatide", zepbound: "tirzepatide", trulicity: "dulaglutide", victoza: "liraglutide", saxenda: "liraglutide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  novolog: "insulin aspart", novorapid: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  "humulin n": "insulin isophane", "novolin n": "insulin isophane",
  "humulin r": "insulin regular", "novolin r": "insulin regular",
  aleve: "naproxen", naprosyn: "naproxen", advil: "ibuprofen", motrin: "ibuprofen", tylenol: "acetaminophen",
  celebrex: "celecoxib", voltaren: "diclofenac", mobic: "meloxicam",
  cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan",
  altace: "ramipril", vasotec: "enalapril", lotensin: "benazepril",
  lopressor: "metoprolol", "toprol xl": "metoprolol", toprol: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  microzide: "hydrochlorothiazide", lasix: "furosemide", bumex: "bumetanide", aldactone: "spironolactone",
  plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", pradaxa: "dabigatran",
  proventil: "albuterol", ventolin: "albuterol", proair: "albuterol", singulair: "montelukast",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", pepcid: "famotidine",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram",
  paxil: "paroxetine", wellbutrin: "bupropion", effexor: "venlafaxine", cymbalta: "duloxetine",
  remeron: "mirtazapine", desyrel: "trazodone", abilify: "aripiprazole", seroquel: "quetiapine",
  risperdal: "risperidone", zyprexa: "olanzapine", latuda: "lurasidone",
  xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam",
  neurontin: "gabapentin", lyrica: "pregabalin", keppra: "levetiracetam", lamictal: "lamotrigine",
  fosamax: "alendronate", flomax: "tamsulosin", proscar: "finasteride",
  zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine", benadryl: "diphenhydramine",
  zofran: "ondansetron", imodium: "loperamide", miralax: "polyethylene glycol 3350",
  hyzaar: "losartan / hydrochlorothiazide", zestoretic: "lisinopril / hydrochlorothiazide",
  prinzide: "lisinopril / hydrochlorothiazide", janumet: "sitagliptin / metformin",
  synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin",
  entresto: "sacubitril / valsartan", suboxone: "buprenorphine / naloxone",
};

function ingredientName(value: string): string | undefined {
  let s = clean(value).replace(/[®™]/g, "").replace(/\[[^\]]*\]/g, "").trim();
  if (!s || /^\d+(?:\.\d+)?\s*(?:mg|mcg|units?|ml)\b/.test(s) || /^(?:unknown|unsure|not sure|n\/?a|none|unidentified|m_\d+)\b/.test(s) ||
    /\b(?:water|sugar|blood pressure|bp|cholesterol|thyroid|pain|sleeping|heart|diabetes) (?:pill|tablet|medicine|medication)s?\b/.test(s) ||
    /^(?:my |the )|\b(?:little|white|blue|pink|round) (?:pill|tablet)\b/.test(s)) return;
  // Match a brand only as a whole name or followed by strength/form, not as an arbitrary prefix.
  for (const brand of Object.keys(brands).sort((a, b) => b.length - a.length || compare(a, b))) {
    if (s === brand || s.startsWith(brand + " ") && /^(?:\d|xr\b|er\b|sr\b|xl\b|oral\b|tablet\b|capsule\b|pen\b|kwikpen\b|solostar\b|flextouch\b|hfa\b)/.test(s.slice(brand.length + 1))) return brands[brand];
  }
  s = s.replace(/\s+\(?\d+(?:\.\d+)?\s*(?:mg|mcg|ug|μg|µg|g|units?|iu|unt|meq|ml|%)\b.*$/i, "");
  s = s.replace(/\s+u-?\d+\b.*$/i, "");
  if (s !== "polyethylene glycol 3350") s = s.replace(/\s+\d+(?:\.\d+)?\s*$/, "");
  s = s.replace(/\s+(?:(?:extended|delayed|immediate|sustained)[ -]release|oral|inhalation|injectable|injection|subcutaneous|topical|transdermal|ophthalmic|otic|tablet|capsule|solution|suspension|cream|ointment|gel|patch|pen|vial)s?\b.*$/, "");
  s = s.replace(/\s+(?:xr|er|sr|xl|dr|ir|hfa)\b.*$/, "");
  s = s.replace(/\s+(?:hydrochloride|hcl|potassium|sodium|calcium|succinate|tartrate|maleate|fumarate|besylate|mesylate|phosphate|sulfate|acetate)(?:\s+hydrate|\s+hemihydrate|\s+trihydrate)?$/, "");
  s = s.replace(/^(insulin \w+)-(?:yfgn|aglr|aabc)$/, "$1").trim();
  if (!s || !/[a-z]/.test(s) || /[<>?]|\b(?:pill|tablets?|capsules?|medicine|medication|supplement)\b/.test(s)) return;
  return Object.prototype.hasOwnProperty.call(brands, s) ? brands[s] : s;
}

function ingredients(entry: ObjectValue): { names: string[]; rxnorm?: string } {
  const picked = object(entry.picked_from_search) ? entry.picked_from_search : undefined;
  const display = text(picked?.display);
  const source = display ?? text(entry.name);
  if (!source) return { names: [] };
  // Slashes separating named ingredients are not the slash in a concentration (units/mL).
  const pieces = source.split(/\s*\+\s*|\s*\/\s*(?!(?:ml|l|dl|tablet|capsule|dose)\b)(?=[a-z][a-z]+(?:\s|$))/i);
  let names = pieces.map(ingredientName).filter((s): s is string => !!s).flatMap(s => s.split(" / "));
  if (!names.length && text(entry.name) && display) names = [ingredientName(entry.name as string)].filter((s): s is string => !!s);
  names = [...new Set(names)];
  // Only an explicitly plain ingredient search result supplies an ingredient-level code.
  // Product codes (even if their ingredient is obvious) must never leak into this field.
  const rxnorm = names.length === 1 && display && clean(display) === names[0] && typeof picked?.rxnorm === "string" && /^\d+$/.test(picked.rxnorm)
    ? picked.rxnorm : undefined;
  return { names, rxnorm };
}

function temporaryHold(note: string): boolean {
  let s = clean(note);
  // Later resumption cancels a historical hold mentioned in the same note.
  const resume = Math.max(s.lastIndexOf("restarted"), s.lastIndexOf("resumed"), s.lastIndexOf("back on"), s.lastIndexOf("taking again"));
  if (resume >= 0) s = s.slice(resume);
  s = s.replace(/\b(?:not|never|no longer)\s+(?:on\s+)?(?:hold|held|paused|stopped)\b/g, "")
    .replace(/\b(?:don't|do not|not to)\s+(?:stop|hold|pause)\b/g, "");
  return /\b(?:on hold|on pause|paused|currently holding|holding (?:it |this )?(?:for now|until)|held (?:for now|until|by|per)|hold (?:for now|until|per|pending)|temporarily (?:stop\w*|off|hold\w*)|(?:stop\w*|off|hold\w*) (?:it |this )?(?:for now|temporarily|for (?:a|one|two|\d+) (?:days?|weeks?))|(?:stop\w*|hold\w*|off) (?:it |this )?(?:until|pending)|(?:don't|do not|not) tak(?:e|ing) (?:it |this )?(?:for now|until))\b/.test(s) || /^(?:held|hold|holding|pause)$/.test(s.trim());
}

function statusDateInNote(note: string): string | undefined {
  const m = /\b(?:since|on|from|starting|stopped|paused|held)\s+(\d{4}(?:-\d{2}(?:-\d{2})?)?)(?![\d-])/.exec(note);
  return m ? partialDate(m[1]) : undefined;
}

function stopReason(note: string): MedicationRow["stop_reason"] {
  const s = clean(note).replace(/\b(?:no|without|not having|never had) (?:known |any )?(?:side effects?|adverse reactions?|allergies)\b/g, "");
  if (!s) return;
  if (/\b(?:side effects?|adverse|allerg\w*|intoleran\w*|made me|gave me|caused|due to (?:cough|rash|nausea|vomiting|diarrhea|dizziness|swelling|muscle|stomach)|because (?:of (?:cough|rash|nausea|vomiting|diarrhea|dizziness)|it (?:made|gave|caused)))\b/.test(s) ||
    /^(?:cough|rash|nausea|vomiting|diarrhea|dizziness|upset stomach|stomach upset|muscle aches?|low (?:blood )?sugars?)[.!]?$/.test(s)) return "adverse_reaction";
  if (/\b(?:ineffective|not (?:work\w*|help\w*)|didn't (?:work|help)|wasn't (?:work\w*|help\w*)|no (?:benefit|effect)|did not (?:work|help))\b/.test(s)) return "ineffective";
  if (/\b(?:replaced|switched|changed (?:it )?(?:to|over to)|instead|different (?:drug|medicine|medication))\b/.test(s)) return "therapy_changed";
  if (/\b(?:course (?:complete\w*|finished)|finished (?:the |my )?(?:course|antibiotics?|treatment)|completed (?:the |my )?(?:course|treatment))\b/.test(s)) return "course_complete";
  if (/\b(?:my (?:choice|decision)|(?:i )?(?:chose|decided|wanted|asked) to stop|don't want|didn't want|do not want|declined|prefer not)\b/.test(s)) return "patient_choice";
  if (/\b(?:because|due to|cost|expensive|afford|ran out|no longer need|not needed|stopped for|stopped after)\b/.test(s)) return "other";
  return undefined;
}

function frequency(direction: string): MedicationRow["frequency"] {
  const s = clean(direction).replace(/\./g, "").replace(/as-needed/g, "as needed");
  if (/\b(?:prn|as needed|if needed|when needed|as required|when necessary|as necessary)\b/.test(s)) return "PRN";
  if (/\b(?:(?:twice|three times|two times|\d+ times) (?:a |per )?(?:week|weekly)|every (?:other|two|three|\d+) weeks?|monthly)\b/.test(s)) return "other";
  if (/\b(?:qw|qweek|weekly|once (?:a|per) week|every week|every (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/.test(s)) return "QW";
  if (/\b(?:every other|alternate|every \d+ days|four times|4 times|qid|q6h|most days|occasionally|sometimes|twice (?:a |per )?week)\b/.test(s)) return "other";
  if (/\b(?:tid|three times|3 times|q8h|every (?:8|eight) hours)\b/.test(s)) return "TID";
  if (/\b(?:bid|twice|two times|2 times|q12h|every (?:12|twelve) hours)\b/.test(s)) return "BID";
  const morning = /\b(?:morning|breakfast|am)\b/.test(s);
  const midday = /\b(?:lunch|lunchtime|noon|midday)\b/.test(s);
  const evening = /\b(?:supper|dinner|evening|pm)\b/.test(s);
  const bedtime = /\b(?:bedtime|bed|night|nightly|qhs|qpm)\b/.test(s);
  const separateEveningAndBed = evening && bedtime && /\b(?:supper|dinner|evening)\b.*\band\b.*\b(?:bedtime|bed|night)\b/.test(s);
  const times = +morning + +midday + +(evening || bedtime) + +separateEveningAndBed;
  if (times > 3) return "other";
  if (times === 3) return "TID";
  if (times === 2) return "BID";
  if (bedtime) return "QHS";
  if (times === 1 || /\b(?:qd|daily|once a day|once per day|every day|q24h|every (?:24|twenty-four) hours)\b/.test(s)) return "QD";
  if (/\b(?:every|times|days|hours|weeks|months)\b/.test(s)) return "other";
  return undefined;
}

const amountPattern = "(?:\\d+(?:\\.\\d+)?(?:\\s*\\/\\s*\\d+)?|\\.\\d+|one and a half|one-half|one half|a half|half|one|two|three|four|five|six|a|an|¼|½|¾)";
const unitPattern = "(?:milligrams?|micrograms?|grams?|mg|mcg|[μµu]g|g|units?|unt|iu|u|\\[iu\\]|millilit(?:er|re)s?|ml|tablets?|tabs?|capsules?|caps?)";

function numberAmount(s: string): number | undefined {
  const values: Record<string, number> = { "one and a half": 1.5, "one-half": 0.5, "one half": 0.5, "a half": 0.5, half: 0.5, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, a: 1, an: 1, "¼": 0.25, "½": 0.5, "¾": 0.75 };
  if (Object.prototype.hasOwnProperty.call(values, s)) return values[s];
  const pieces = s.split("/").map(x => Number(x.trim()));
  const n = pieces.length === 2 ? pieces[0] / pieces[1] : pieces[0];
  return finite(n) && n > 0 ? n : undefined;
}

function amountUnit(s: string): { unit: NonNullable<MedicationRow["dose"]>["unit"]; scale: number } {
  if (/^(?:mg|milligram)/.test(s)) return { unit: "mg", scale: 1 };
  if (/^(?:mcg|[μµu]g|microgram)/.test(s)) return { unit: "mcg", scale: 1 };
  if (/^(?:g|gram)$/.test(s) || s === "grams") return { unit: "mg", scale: 1000 };
  if (/^(?:unit|unt|iu|\[iu\])/.test(s) || s === "u") return { unit: "units", scale: 1 };
  if (/^(?:ml|millilit)/.test(s)) return { unit: "mL", scale: 1 };
  return { unit: "tablet", scale: 1 };
}

function strength(entry: ObjectValue, component: number, count: number): { value: number; unit: "mg" | "mcg" } | undefined {
  const picked = object(entry.picked_from_search) ? entry.picked_from_search : undefined;
  // An explicitly entered strength wins, including typos. Do not repair it with a product's strength.
  const source = text(entry.strength_text) ?? text(picked?.display);
  if (!source) return;
  const s = clean(source);
  if (/\b(?:ml|milliliters?|millilitres?|units?|iu|unt|puff|spray|patch)\b|%/.test(s)) return;
  const matches = [...s.matchAll(/(\d+(?:\.\d+)?|\.\d+)\s*(mg|mcg|[μµu]g|g|milligrams?|micrograms?|grams?)\b/g)];
  if (matches.length !== count) return;
  const m = matches[component];
  if (!m) return;
  const u = amountUnit(m[2]);
  if (u.unit !== "mg" && u.unit !== "mcg") return;
  const value = +m[1] * u.scale;
  return finite(value) && value > 0 ? { value, unit: u.unit } : undefined;
}

function dose(entry: ObjectValue, direction: string, component: number, count: number, ingredient?: string): MedicationRow["dose"] {
  if (!direction) return;
  let s = clean(direction).replace(/\b(?:b\.?i\.?d\.?|t\.?i\.?d\.?|q\.?d\.?|q\.?h\.?s\.?)\b/g, "")
    .replace(/\bhalf (?:of )?(?:a|an|one) (?=tablet|capsule)/g, "half ");
  if (new RegExp(`${amountPattern}\\s*(?:or|to|through|[-–—])\\s*${amountPattern}`, "i").test(s) ||
    /\b(?:sliding|scale|taper|varies|variable|adjust|adjusted|depending|alternate|alternating|different doses|up to)\b/.test(s)) return;
  // The view cannot represent puffs, drops, applications or patches as an amount.
  if (/\b(?:puffs?|sprays?|drops?|patch(?:es)?|applications?|apply|topically|inhalations?|squirts?)\b/.test(s)) return;
  if (/^(?:on hold|hold|held|paused|stopped|not taking|do not take|don't take)(?:\b|$)/.test(s)) return;
  // "take two 500 mg tablets": the embedded strength is per tablet, not the whole dose.
  const countWithStrength = new RegExp(`(^|\\b(?:take|taking)\\s+)(${amountPattern})\\s+(?:of (?:the |my )?)?(\\d+(?:\\.\\d+)?)\\s*(mg|mcg|[μµu]g|g)\\s+(tablets?|capsules?)\\b`, "i").exec(s);
  if (countWithStrength) {
    const n = numberAmount(countWithStrength[2]);
    const u = amountUnit(countWithStrength[4]);
    if (n !== undefined && count === 1 && (u.unit === "mg" || u.unit === "mcg")) {
      const remaining = s.slice((countWithStrength.index ?? 0) + countWithStrength[0].length);
      if (new RegExp(`\\b(?:and|then|but)\\s*${amountPattern}\\b`, "i").test(remaining)) return;
      const value = n * +countWithStrength[3] * u.scale;
      return finite(value) && value > 0 ? { value: Number(value.toPrecision(12)), unit: u.unit } : undefined;
    }
  }
  // A parenthetical tablet strength is descriptive; the tablet count still determines dose.
  s = s.replace(/\(\s*\d+(?:\.\d+)?\s*(?:mg|mcg|[μµu]g|g)\s*(?:each)?\s*\)/g, "");
  const re = new RegExp(`(^|[^a-z0-9.])(${amountPattern})\\s*(${unitPattern})(?![a-z])`, "gi");
  const amounts: { value: number; unit: NonNullable<MedicationRow["dose"]>["unit"] }[] = [];
  for (const m of s.matchAll(re)) {
    const n = numberAmount(m[2]);
    if (n === undefined) return;
    const u = amountUnit(m[3]);
    // A concentration mentioned in directions is not an administration amount.
    if (/^\s*\/\s*(?:ml|l|tablet|capsule)\b/.test(s.slice((m.index ?? 0) + m[0].length))) continue;
    amounts.push({ value: n * u.scale, unit: u.unit });
  }
  let amount = amounts[0];
  if (amounts.some(a => a.value !== amount.value || a.unit !== amount.unit)) {
    // "one 500 mg tablet" states count and strength, not two administrations.
    return;
  }
  if (!amount) {
    const bare = new RegExp(`(?:^|\\b(?:take|taking))\\s*(${amountPattern})(?=\\s|$)`, "i").exec(s);
    const number = bare && !/^\s*(?:times?|x|days?|hours?|weeks?|a\.?m\.?|p\.?m\.?)\b/.test(s.slice((bare.index ?? 0) + bare[0].length)) ? numberAmount(bare[1]) : 1;
    if (number === undefined) return;
    // Distinct counts at different times do not have a single per-administration dose.
    const extraCounts = new RegExp(`(?:\\b(?:and|then|but)|[,;])\\s*(${amountPattern})(?=\\s|$)`, "gi");
    for (const m of s.matchAll(extraCounts)) {
      const rest = s.slice((m.index ?? 0) + m[0].length);
      if (!/^\s*(?:a\.?m\.?|p\.?m\.?|times?|hours?|days?|weeks?)\b/.test(rest) && numberAmount(m[1]) !== number) return;
    }
    amount = { value: number, unit: "tablet" };
  }
  if (amount.unit === "tablet") {
    const solid = /\b(?:tablet|capsule|tab|cap)s?\b/.test(s);
    const picked = object(entry.picked_from_search) ? entry.picked_from_search : undefined;
    const form = clean([text(entry.strength_text), text(picked?.display), ingredient].filter(Boolean).join(" "));
    if (!solid && /\b(?:insulin|ml|pen|vial|injection|solution|suspension|liquid|cream|ointment|inhaler|patch)\b/.test(form)) return;
    const perTablet = strength(entry, component, count);
    if (perTablet) {
      const value = amount.value * perTablet.value;
      return finite(value) && value > 0 ? { value: Number(value.toPrecision(12)), unit: perTablet.unit } : undefined;
    }
  } else if (count > 1) {
    // A total mass for a combination drug does not specify each ingredient's amount.
    return;
  }
  return finite(amount.value) && amount.value > 0 ? amount : undefined;
}

function medicationRows(lists: Item[]): MedicationRow[] {
  type Candidate = { row: MedicationRow; event: string; tie: string };
  const selected = new Map<string, Candidate>();
  for (const item of lists) {
    for (const [entryId, entry] of entries(item)) {
      if (entry.type !== "my_med") continue;
      const name = text(entry.name);
      if (!name) continue;
      const drug = ingredients(entry);
      const direction = text(entry.how_i_take_it) ?? "";
      const note = text(entry.note) ?? "";
      const held = temporaryHold(note + " " + direction);
      const status: MedicationRow["status"] = held ? "held" : entry.status === "taking" ? "active" : entry.status === "stopped" ? "stopped" : "unknown";
      const statusSince = status === "active" ? partialDate(entry.started) : status === "held" || status === "stopped"
        ? partialDate(entry.stopped) ?? statusDateInNote(note) : undefined;
      const names: (string | undefined)[] = drug.names.length ? drug.names : [undefined];
      names.forEach((ingredient, component) => {
        const row: MedicationRow = { drug_name: name, status, patient_reported: true, evidence: [{ item_id: item.id, entry_id: entryId }] };
        if (ingredient) row.ingredient = ingredient;
        if (drug.rxnorm) row.rxnorm_ingredient = drug.rxnorm;
        if (statusSince) row.status_since = statusSince;
        const amount = dose(entry, direction, component, names.length, ingredient);
        if (amount) row.dose = amount;
        const freq = frequency(direction);
        if (freq) row.frequency = freq;
        if (status === "held" || status === "stopped") {
          if (note) row.status_reason_text = note;
          else if (held && direction) row.status_reason_text = direction;
        }
        if (status === "stopped") {
          const reason = stopReason(note);
          if (reason) row.stop_reason = reason;
        }
        if (entry.kind === "over_the_counter") row.otc = true;
        const group = ingredient ? `ingredient:${ingredient}` : `unknown:${item.key}:${text(entry.homelog_med_id) ?? entryId}`;
        const candidate: Candidate = { row, event: statusSince ?? partialDate(entry.started) ?? "", tie: `${item.key}:${text(entry.homelog_med_id) ?? entryId}:${entryId}` };
        const old = selected.get(group);
        if (!old || compare(candidate.event, old.event) > 0 || candidate.event === old.event && compare(candidate.tie, old.tie) > 0) selected.set(group, candidate);
      });
    }
  }
  return [...selected.values()].map(c => c.row).sort((a, b) => compare(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name) || compare(a.drug_name, b.drug_name));
}

type Reading = { row: VitalRow; kind: "bp" | "glucose"; method: string; issuer: string; tie: string; minute: number; arm?: string; meal?: string; glucoseValue?: number; glucoseUnit?: string };

function evidenceUnion(first: Evidence, second: Evidence): Evidence {
  const ids = new Set(first.map(e => JSON.stringify(e)));
  return [...first, ...second.filter(e => !ids.has(JSON.stringify(e)))];
}

function sameMeasurement(a: Reading, b: Reading): boolean {
  if (a.issuer !== b.issuer || a.kind !== b.kind || Math.abs(a.minute - b.minute) > 2) return false;
  if (a.kind === "bp") return a.row.systolic_mmhg === b.row.systolic_mmhg && a.row.diastolic_mmhg === b.row.diastolic_mmhg &&
    (a.row.pulse_bpm === undefined || b.row.pulse_bpm === undefined || a.row.pulse_bpm === b.row.pulse_bpm) && (!a.arm || !b.arm || a.arm === b.arm);
  return a.row.glucose_mg_dl === b.row.glucose_mg_dl && (a.glucoseUnit !== b.glucoseUnit || a.glucoseValue === b.glucoseValue) &&
    a.row.glucose_out_of_range === b.row.glucose_out_of_range && (!a.meal || !b.meal || a.meal === b.meal);
}

function vitalRows(items: Item[]): VitalRow[] {
  const readings: Reading[] = [];
  for (const item of items) {
    for (const [id, entry] of entries(item)) {
      if (entry.type !== "bp_reading" && entry.type !== "glucose_reading") continue;
      const time = localTime(entry.measured_at);
      if (!time) continue;
      const row: VitalRow = { setting: "home", local_time: time, evidence: [{ item_id: item.id, entry_id: id }] };
      if (entry.type === "bp_reading") {
        if (!finite(entry.systolic_mmhg) || !finite(entry.diastolic_mmhg)) continue;
        row.systolic_mmhg = entry.systolic_mmhg;
        row.diastolic_mmhg = entry.diastolic_mmhg;
        if (finite(entry.pulse_bpm)) row.pulse_bpm = entry.pulse_bpm;
      } else {
        if (!finite(entry.value) || (entry.unit !== "mg/dL" && entry.unit !== "mmol/L")) continue;
        if (entry.out_of_range !== undefined && entry.out_of_range !== "HI" && entry.out_of_range !== "LO") continue;
        const value = Math.round(entry.value * (entry.unit === "mmol/L" ? 18.016 : 1));
        if (!finite(value)) continue;
        row.glucose_mg_dl = value;
        if (entry.out_of_range === "HI" || entry.out_of_range === "LO") row.glucose_out_of_range = entry.out_of_range;
      }
      readings.push({ row, kind: entry.type === "bp_reading" ? "bp" : "glucose", method: text(entry.entry_method) ?? "",
        issuer: item.issuer, tie: `${item.key}:${id}`, minute: Date.parse(time + ":00Z") / 60000,
        arm: text(entry.arm), meal: text(entry.meal_marker), glucoseValue: finite(entry.value) ? entry.value : undefined, glucoseUnit: text(entry.unit) });
    }
  }
  readings.sort((a, b) => a.minute - b.minute || compare(a.kind, b.kind) || compare(a.tie, b.tie));
  const devices = readings.filter(r => r.method === (r.kind === "bp" ? "cuff_sync" : "meter_sync"));
  const output: Reading[] = [];
  let deviceStart = 0, deviceEnd = 0;
  for (const reading of readings) {
    if (reading.method === "typed") {
      // The readings are chronological: inspect only a moving two-minute window, even for
      // a patient with many years of readings.
      while (deviceStart < devices.length && devices[deviceStart].minute < reading.minute - 2) deviceStart++;
      while (deviceEnd < devices.length && devices[deviceEnd].minute <= reading.minute + 2) deviceEnd++;
      const matches = devices.slice(deviceStart, deviceEnd).filter(d => sameMeasurement(reading, d)).sort((a, b) =>
        Math.abs(a.minute - reading.minute) - Math.abs(b.minute - reading.minute) || a.minute - b.minute || compare(a.tie, b.tie));
      if (matches.length) {
        matches[0].row.evidence = evidenceUnion(matches[0].row.evidence, reading.row.evidence);
        continue;
      }
    }
    output.push(reading);
  }
  return output.map(r => r.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!partialDate(asOf) || asOf.length !== 10) return rows;
  const scoped = scopedItems(items, asOf);
  const current = currentItems(scoped);
  rows.medications = medicationRows(medicineLists(scoped, current));
  rows.vitals = vitalRows(current);
  return rows;
}
