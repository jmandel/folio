import type { FolioItem, ViewRows, MedicationRow, VitalRow, Sensitivity, Evidence } from "../in/views/views";

// HomeLog's lists are snapshots, not prescriptions or medication-administration events.
// Diary symptom tags are not diagnoses. This source has no problem list, allergy list,
// or laboratory results; in particular, neither a diary symptom nor a skipped dose
// establishes a diagnosis, an allergy, or a change to the medicine list.
type Obj = Record<string, unknown>;
type Item = { raw: Obj; id: string; issuer: string; recorded: number; entries: [string, Obj][] };
type Reading = { row: VitalRow; kind: "bp" | "glucose"; device: boolean; typed: boolean; time: number; original?: number; unit?: string };
type Dose = NonNullable<MedicationRow["dose"]>;

function object(value: unknown): value is Obj {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}
function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
function compare(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function ids(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((s): s is string => typeof s === "string" && s.length > 0) : [];
}
function key(issuer: string, id: string): string { return JSON.stringify([issuer, id]); }
function itemKey(item: Item): string { return key(item.issuer, item.id); }
function evidence(item: Item, entry: string): Evidence { return [{ item_id: item.id, entry_id: entry }]; }

function partialDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (y < 1 || (m !== undefined && (m < 1 || m > 12))) return undefined;
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (d !== undefined && (d < 1 || d > days[m - 1])) return undefined;
  return value;
}

const chicago = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function chicagoWall(epoch: number): string {
  const parts: Record<string, string> = {};
  for (const p of chicago.formatToParts(new Date(epoch))) parts[p.type] = p.value;
  return `${parts.year.padStart(4, "0")}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}
function dateTime(value: unknown): { local: string; epoch: number } | undefined {
  if (typeof value !== "string") return undefined;
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})?$/i.exec(value);
  if (!m || !partialDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] ?? 0) > 59) return undefined;
  const wall = `${m[1]}T${m[2]}:${m[3]}:${m[4] ?? "00"}${m[5] ?? ""}`;
  if (m[6]) {
    const zone = m[6].toUpperCase();
    if (zone !== "Z" && (+zone.slice(1, 3) > 23 || +zone.slice(-2) > 59)) return undefined;
    const epoch = Date.parse(wall + zone);
    if (!Number.isFinite(epoch)) return undefined;
    return { local: chicagoWall(epoch), epoch };
  }
  // Unzoned values are local, even if they fall in a DST clock gap. Never shift
  // their displayed wall time. The epoch is only for ordering publication times.
  const wallEpoch = Date.parse(wall + "Z");
  if (!Number.isFinite(wallEpoch)) return undefined;
  let epoch = wallEpoch + 6 * 60 * 60 * 1000;
  for (let i = 0; i < 2; i++) {
    const offset = Date.parse(chicagoWall(epoch) + "Z") - Math.floor(epoch / 1000) * 1000;
    epoch = wallEpoch - offset;
  }
  return { local: wall, epoch };
}

function availableItems(input: unknown, asOf: string): { all: Item[]; live: Item[] } {
  if (!Array.isArray(input) || !partialDate(asOf) || asOf.length !== 10) return { all: [], live: [] };
  const all: Item[] = [];
  for (const raw of input) {
    if (!object(raw) || !string(raw.id) || !string(raw.issuer)) continue;
    const recorded = dateTime(raw.recorded);
    if (!recorded || recorded.local.slice(0, 10) > asOf) continue;
    const entries: [string, Obj][] = [];
    if (object(raw.payload)) for (const id of Object.keys(raw.payload).sort(compare)) {
      const entry = raw.payload[id];
      if (object(entry)) entries.push([id, entry]);
    }
    all.push({ raw, id: raw.id as string, issuer: raw.issuer as string, recorded: recorded.epoch, entries });
  }
  all.sort((a, b) => a.recorded - b.recorded || compare(itemKey(a), itemKey(b)));
  const byId = new Map(all.map(item => [itemKey(item), item]));
  const removed = new Set<string>();
  for (const item of all) {
    for (const target of ids(item.raw.retracts)) removed.add(key(item.issuer, target));
    const pending = ids(item.raw.supersedes).map(id => key(item.issuer, id));
    const visited = new Set<string>();
    while (pending.length) {
      const target = pending.pop()!;
      if (visited.has(target)) continue;
      visited.add(target);
      removed.add(target);
      const ancestor = byId.get(target);
      if (ancestor) for (const id of ids(ancestor.raw.supersedes)) pending.push(key(ancestor.issuer, id));
    }
  }
  return { all, live: all.filter(item => !removed.has(itemKey(item))) };
}

function latestMedicineList(all: Item[], live: Item[]): Item | undefined {
  // An empty restatement is still a full list. Narrative is used only to identify
  // the document kind, never to manufacture a medication entry.
  const lists = new Set(all.filter(item => item.entries.some(([, e]) => e.type === "my_med") ||
    (typeof item.raw.narrative === "string" && /^\s*My Medicines(?:\s*,|\s*$)/i.test(item.raw.narrative)))
    .map(itemKey));
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of all) {
      if (!lists.has(itemKey(item)) && ids(item.raw.supersedes).some(id => lists.has(key(item.issuer, id)))) {
        lists.add(itemKey(item)); changed = true;
      }
    }
  }
  return live.filter(item => lists.has(itemKey(item))).at(-1);
}

// Translation is lexical, not a code lookup. A product's RxNorm code is never
// converted into an ingredient code. Search display names take precedence over
// typed nicknames when identifying the ingredient.
const drugNames = [
  "albuterol|ventolin|proair|proventil|salbutamol", "amlodipine|norvasc",
  "amoxicillin|amoxil", "amoxicillin / clavulanic acid|augmentin",
  "aripiprazole|abilify", "aspirin|bayer aspirin", "atenolol|tenormin",
  "atorvastatin|lipitor", "azithromycin|zithromax|z-pak", "bupropion|wellbutrin|zyban",
  "buprenorphine|subutex|butrans|sublocade", "buprenorphine / naloxone|suboxone|zubsolv",
  "buspirone|buspar", "carvedilol|coreg", "cephalexin|keflex",
  "cetirizine|zyrtec", "citalopram|celexa", "clonazepam|klonopin",
  "clopidogrel|plavix", "dapagliflozin|farxiga|forxiga", "desvenlafaxine|pristiq",
  "cholecalciferol|vitamin d3|vitamin d-3", "ergocalciferol|vitamin d2|vitamin d-2",
  "ascorbic acid|vitamin c", "folic acid",
  "diclofenac|voltaren", "diphenhydramine|benadryl", "dulaglutide|trulicity",
  "duloxetine|cymbalta", "empagliflozin|jardiance", "enalapril|vasotec",
  "escitalopram|lexapro|cipralex", "esomeprazole|nexium", "estradiol|estrace|vivelle-dot",
  "ezetimibe|zetia", "famotidine|pepcid", "fexofenadine|allegra",
  "finasteride|proscar|propecia", "fluoxetine|prozac|sarafem", "fluticasone|flonase|flovent",
  "fluticasone / salmeterol|advair|wixela", "furosemide|lasix", "gabapentin|neurontin",
  "glimepiride|amaryl", "glipizide|glucotrol", "hydrochlorothiazide|microzide|hctz",
  "hydroxychloroquine|plaquenil", "ibuprofen|advil|motrin", "insulin aspart|novolog|novorapid|fiasp",
  "insulin degludec|tresiba", "insulin detemir|levemir", "insulin glargine|lantus|basaglar|toujeo|semglee",
  "insulin lispro|humalog|admelog|lyumjev", "lamotrigine|lamictal", "lansoprazole|prevacid",
  "levothyroxine|synthroid|levoxyl|tirosint|euthyrox", "liraglutide|victoza|saxenda",
  "lisinopril|zestril|prinivil", "lisinopril / hydrochlorothiazide|zestoretic|prinzide",
  "lithium|lithobid|eskalith", "loratadine|claritin", "lorazepam|ativan",
  "losartan|cozaar", "losartan / hydrochlorothiazide|hyzaar", "meloxicam|mobic",
  "metformin|glucophage|glumetza|fortamet", "methadone|dolophine", "methylphenidate|ritalin|concerta",
  "metoprolol|lopressor|toprol", "mirtazapine|remeron", "montelukast|singulair",
  "naloxone|narcan", "naltrexone|revia|vivitrol", "naproxen|aleve|naprosyn",
  "nifedipine|procardia|adalat", "nitrofurantoin|macrobid|macrodantin",
  "norethindrone|micronor|aygestin", "olanzapine|zyprexa", "omeprazole|prilosec|losec",
  "ondansetron|zofran", "pantoprazole|protonix", "paroxetine|paxil",
  "acetaminophen|tylenol|paracetamol", "pioglitazone|actos", "pravastatin|pravachol",
  "prednisone|deltasone", "pregabalin|lyrica", "quetiapine|seroquel", "risperidone|risperdal",
  "rivaroxaban|xarelto", "apixaban|eliquis", "rosuvastatin|crestor", "semaglutide|ozempic|rybelsus|wegovy",
  "sertraline|zoloft|lustral", "sildenafil|viagra|revatio", "simvastatin|zocor",
  "sitagliptin|januvia", "sitagliptin / metformin|janumet", "spironolactone|aldactone",
  "tadalafil|cialis|adcirca", "tamsulosin|flomax", "tirzepatide|mounjaro|zepbound",
  "topiramate|topamax", "trazodone|desyrel", "valacyclovir|valtrex",
  "valsartan|diovan", "venlafaxine|effexor", "warfarin|coumadin|jantoven", "zolpidem|ambien",
  "emtricitabine / tenofovir disoproxil|truvada", "emtricitabine / tenofovir alafenamide|descovy",
  "bictegravir / emtricitabine / tenofovir alafenamide|biktarvy", "dolutegravir|tivicay",
];
const aliases = drugNames.flatMap(line => {
  const [generic, ...brands] = line.split("|");
  return [generic, ...brands].map(alias => ({ alias, generic }));
}).sort((a, b) => b.alias.length - a.alias.length || compare(a.alias, b.alias));

function normalizeWords(text: string): string {
  return text.toLowerCase().replace(/[’‘]/g, "'").replace(/[µμ]/g, "u").replace(/[®™]/g, "").replace(/\s+/g, " ").trim();
}
function ingredientName(text: string): string | undefined {
  let name = normalizeWords(text).replace(/\[[^\]]*\]/g, "").trim();
  // Remove a written strength and all subsequent dosage-form wording.
  name = name.replace(/\s+\(?\d+(?:\.\d+)?(?:\s|\/|%|(?:mg|mcg|ug|g|units?|iu)\b|$).*$/, "")
    .replace(/\s*\([^)]*\)\s*$/, "").trim();
  for (const { alias, generic } of aliases) {
    if (name === alias || name.startsWith(alias + " ") && /^(?:hfa|xr|er|xl|sr|dr|cr|ec|solostar|kwikpen|flexpen|flextouch|penfill|sodium|calcium|hydrochloride|hcl|tartrate|succinate|sulfate|fumarate|carbonate|besylate|tablet|capsule|oral|inhaler|pen)\b/.test(name.slice(alias.length + 1))) return generic;
  }
  if (/^(?:my |the |a |an )|\b(?:pill|medicine|medication|unknown|unnamed|supplement|vitamins?)\b|^(?:m|med)_\d+\b/.test(name)) return undefined;
  name = name.replace(/\b(?:extended[- ]release|delayed[- ]release|immediate[- ]release|sustained[- ]release|oral|sublingual|chewable|enteric[- ]coated|film[- ]coated|inhalation|ophthalmic|topical|transdermal|injectable)\b/g, " ")
    .replace(/\b(?:tablets?|capsules?|caps?|tabs?|solution|suspension|inhaler|cream|ointment|patch|injection|pen|hfa|xr|er|xl|sr|dr|cr|ec)\b.*$/, "")
    .replace(/\s+(?:hydrochloride|hydrobromide|hcl|hbr|besylate|maleate|fumarate|succinate|tartrate|mesylate|trihydrate|dihydrate|monohydrate|sodium|calcium)\s*$/, "")
    .replace(/\s+/g, " ").trim();
  return /^[a-z][a-z -]*[a-z]$/.test(name) && !/\b(?:for|blood|pressure|water|sugar|heart|sleep|pain|allergy)\b/.test(name) ? name : undefined;
}
function medicineIdentity(entry: Obj): { ingredients: string[]; displays: string[]; code?: string } {
  const search = object(entry.picked_from_search) ? entry.picked_from_search : undefined;
  const display = search && string(search.display);
  const source = display ?? string(entry.name) ?? "";
  // A slash before another drug name denotes a combination; /mL and /puff do not.
  const displays = source.split(/\s*\/\s*(?=[a-zA-Z])(?!m[lL]\b|[pP]uffs?\b|[dD]ose\b|[aA]ctuation\b)/);
  let ingredients = displays.map(ingredientName).filter((x): x is string => !!x).flatMap(s => s.split(" / "));
  if (!ingredients.length && display) ingredients = [ingredientName(string(entry.name) ?? "")].filter((x): x is string => !!x).flatMap(s => s.split(" / "));
  ingredients = [...new Set(ingredients)];
  // The schema distinguishes a product display (strength/form) from an ingredient
  // display. A salt-bearing precise ingredient is not an IN code either.
  const code = display && ingredients.length === 1 && normalizeWords(display) === ingredients[0] &&
    search && typeof search.rxnorm === "string" && /^\d+$/.test(search.rxnorm) ? search.rxnorm : undefined;
  return { ingredients, displays, code };
}

function componentStrengths(text: string | undefined, count: number): (string | undefined)[] {
  if (!text) return Array.from({ length: count }, () => undefined);
  // E.g. "20/12.5 mg" or "20 mg / 12.5 mg". Preserve component order;
  // concentration denominators such as /mL are not another ingredient.
  const components = normalizeWords(text).split(/\s*[+/]\s*/);
  if (components.length !== count) return Array.from({ length: count }, () => undefined);
  const parsed = components.map(s => /^(\d+(?:\.\d+)?)\s*(mg|mcg|ug|g|units?|iu|u)?$/.exec(s));
  if (parsed.some(p => !p)) return Array.from({ length: count }, () => undefined);
  const lastUnit = parsed.at(-1)?.[2];
  return parsed.map(p => p && (p[2] ?? lastUnit) ? `${p[1]} ${p[2] ?? lastUnit}` : undefined);
}

function directionWords(text: string): string {
  return normalizeWords(text)
    .replace(/(\d+)½/g, (_, n: string) => String(+n + 0.5))
    .replace(/(\d+)¼/g, (_, n: string) => String(+n + 0.25))
    .replace(/(\d+)¾/g, (_, n: string) => String(+n + 0.75))
    .replace(/½/g, " 0.5").replace(/¼/g, " 0.25").replace(/¾/g, " 0.75")
    .replace(/\b(?:one[- ]half|a half|half a|half)\b/g, "0.5")
    .replace(/\b(?:one[- ]quarter|a quarter|quarter of a)\b/g, "0.25")
    .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g, word =>
      String(["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"].indexOf(word) + 1))
    .replace(/\b(\d+)\s*\/\s*(\d+)\b/g, (_, a: string, b: string) => +b ? String(+a / +b) : "variable");
}
function frequency(text: string): MedicationRow["frequency"] {
  const s = directionWords(text);
  if (/\b(?:prn|as needed|when needed|if needed|as required|when required)\b/.test(s)) return "PRN";
  if (/\b(?:taper\w*|alternat\w*|every other|every second|most days|some days|occasionally|monthly|every month|variable|except|skip)\b/.test(s)) return "other";
  if (/\b(?:qid|4 times|four times|every 6 (?:hours?|hrs?)|q6h)\b/.test(s)) return "other";
  if (/\b(?:(?:2|3) times (?:a |per )?week|twice (?:a |per )?week|every (?:2|3|4) (?:days?|weeks?))\b/.test(s)) return "other";
  if (/\b(?:qw|qweek|weekly|once (?:a |per )?week|every week|every (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/.test(s)) return "QW";
  if (/\b(?:tid|3 times (?:a |per )?day|three times daily|3 times daily|every 8 (?:hours?|hrs?)|q8h)\b/.test(s)) return "TID";
  if (/\b(?:bid|twice (?:a |per )?day|twice daily|2 times (?:a |per )?day|2 times daily|every 12 (?:hours?|hrs?)|q12h)\b/.test(s)) return "BID";
  const times = [/(?:\bmorning\b|\bbreakfast\b|\bam\b)/, /(?:\bnoon\b|\blunch\b|\bmidday\b)/,
    /(?:\bevening\b|\bsupper\b|\bdinner\b|\bpm\b)/, /(?:\bbedtime\b|\bnightly\b|\bat night\b)/].filter(r => r.test(s)).length;
  if (times > 3) return "other";
  if (times === 3) return "TID";
  if (times === 2) return "BID";
  if (/\b(?:qhs|bedtime|nightly|at night)\b/.test(s)) return "QHS";
  if (/\b(?:qd|daily|once (?:a |per )?day|every day|every 24 (?:hours?|hrs?)|q24h)\b/.test(s) || /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b|\bat \d{1,2}:\d{2}\b/.test(s) || times === 1) return "QD";
  if (/\b(?:every|times|days|weeks|months)\b/.test(s)) return "other";
  return undefined;
}

const quantityPattern = /(\d+(?:\.\d+)?)\s*(micrograms?|mcg|ug|milligrams?|mg|grams?|g|international units?|units?|iu|u|milliliters?|millilitres?|ml|cc|tablets?|tabs?|capsules?|caps?|puffs?)\b/g;
function quantities(text: string): { value: number; unit: Dose["unit"] | "puff"; end: number; start: number }[] {
  const out: ReturnType<typeof quantities> = [];
  for (const m of text.matchAll(quantityPattern)) {
    const unit = /^(?:microgram|mcg|ug)/.test(m[2]) ? "mcg" : /^(?:milligram|mg|gram|g$)/.test(m[2]) ? "mg"
      : /^(?:international|unit|iu|u$)/.test(m[2]) ? "units" : /^(?:millil|ml|cc)/.test(m[2]) ? "mL"
      : /^puff/.test(m[2]) ? "puff" : "tablet";
    const value = +m[1] * (/^(?:grams?|g)$/.test(m[2]) ? 1000 : 1);
    if (Number.isFinite(value)) out.push({ value, unit, start: m.index!, end: m.index! + m[0].length });
  }
  return out;
}
function doseFor(strength: string | undefined, instructions: string | undefined): Dose | undefined {
  if (!instructions) return undefined;
  const s = directionWords(instructions);
  // PRN is a schedule, not a varying amount. A sliding/conditional amount or
  // differing doses at different administrations has no single dose to report.
  if (/\d\s*(?:[-–—]|to|or)\s*\d|\b(?:sliding|scale|taper\w*|variable|depending|based on|adjust\w*|alternat\w*|as directed|per instructions|extra|additional|another)\b/.test(s) ||
      /\bif\b(?!\s+(?:needed|required)\b)|\bwhen (?:my |blood |glucose|sugar|pressure)|\bup to\b/.test(s)) return undefined;
  const concentrationPattern = /^(?:\s*\/\s*|\s+per\s+)(?:(\d+(?:\.\d+)?)\s*)?(?:ml|milliliters?|millilitres?)\b/;
  // Concentration labels in the directions are strengths, not administered doses.
  const qs = quantities(s).filter(q => !concentrationPattern.test(s.slice(q.end)) && !/\/\s*$/.test(s.slice(0, q.start)));
  const st = strength ? directionWords(strength) : "";
  const strengths = quantities(st).filter(q => q.unit === "mg" || q.unit === "mcg" || q.unit === "units");
  const unitStrength = strengths.length === 1 && !/\d\s*(?:[-–—]|to|or)\s*\d/.test(st) ? strengths[0] : undefined;
  const concentration = unitStrength ? concentrationPattern.exec(st.slice(unitStrength.end)) : null;
  const denominator = concentration ? +(concentration[1] ?? 1) : 1;
  const scaled = (count: number, countUnit: "tablet" | "puff" | "mL"): Dose | undefined => {
    if (unitStrength && (concentration ? countUnit === "mL" : countUnit !== "mL")) {
      const value = Number((unitStrength.value * count / denominator).toPrecision(12));
      return Number.isFinite(value) ? { value, unit: unitStrength.unit as Dose["unit"] } : undefined;
    }
    if (countUnit !== "mL" && (concentration || strengths.length > 0)) return undefined;
    return countUnit === "puff" ? undefined : { value: count, unit: countUnit };
  };
  const counts = qs.filter(q => q.unit === "tablet" || q.unit === "puff");
  const amounts = qs.filter(q => q.unit !== "tablet" && q.unit !== "puff");
  const bareCounts = [...s.matchAll(/(?:\b(?:take|taking|inject|use)\s+|^|\band\s+|[,;]\s*)(\d+(?:\.\d+)?)(?=\s+(?:(?:in|at|with|each|every|by|before|after)\b|morning\b|evening\b|bedtime\b|daily\b|nightly\b|a day\b))/g)].map(m => +m[1]);
  if (bareCounts.length && (bareCounts.some(n => n !== bareCounts[0]) || counts.some(q => q.value !== bareCounts[0]) || amounts.length)) return undefined;
  if (counts.length) {
    if (counts.some(q => q.value !== counts[0].value || q.unit !== counts[0].unit)) return undefined;
    // "10 mg tablets, take 2 tablets" describes a unit strength as well as a count.
    const result = scaled(counts[0].value, counts[0].unit as "tablet" | "puff");
    if (amounts.some(q => !unitStrength || q.unit !== unitStrength.unit ||
        (q.value !== unitStrength.value && q.value !== result?.value))) return undefined;
    return result;
  }
  if (amounts.length) {
    if (amounts.some(q => q.value !== amounts[0].value || q.unit !== amounts[0].unit)) return undefined;
    const q = amounts[0];
    return q.unit === "mL" && concentration ? scaled(q.value, "mL") : { value: q.value, unit: q.unit as Dose["unit"] };
  }
  if (bareCounts.length) {
    if (bareCounts.some(n => n !== bareCounts[0])) return undefined;
    // Without a form/strength, an unlabelled number could be tablets, mL or units.
    return unitStrength && !concentration ? scaled(bareCounts[0], "tablet") : undefined;
  }
  const f = frequency(s);
  if (unitStrength && !concentration && f && f !== "PRN" && f !== "other") return scaled(1, "tablet");
  return undefined;
}

function stateOf(entry: Obj): { status: MedicationRow["status"]; since?: string; reason?: string } {
  let status: MedicationRow["status"] = entry.status === "taking" ? "active" : entry.status === "stopped" ? "stopped" : "unknown";
  const note = string(entry.note);
  const directions = string(entry.how_i_take_it);
  const text = [note, directions].filter(Boolean).join("; ");
  const s = normalizeWords(text);
  const pause = /\b(?:holding|held|on hold|hold (?:until|for)|paused?|pausing|temporarily stopped|stopped (?:taking (?:it )?)?(?:temporarily|for (?:now|the time being)|until)|not taking (?:it )?(?:right now|at the moment|for now|until)|off (?:it )?(?:for now|until))\b/.exec(s);
  const resume = /\b(?:resumed|restarted|back on|taking (?:it )?again)\b/.exec(s);
  if (pause && !/\b(?:not|never|don't|do not|will|should|may|might|would|to)\s+$|\b(?:do not|don't|never)(?:\s+\w+){0,4}\s+$/.test(s.slice(0, pause.index)) && (!resume || resume.index < pause.index)) status = "held";
  if (status === "active" && /\b(?:i stopped|i quit|no longer taking|stopped taking)\b/.test(s) && !resume) status = "stopped";
  let since = status === "active" ? partialDate(entry.started) : partialDate(entry.stopped);
  if (status === "unknown") since = undefined;
  if (status === "held" && entry.status !== "stopped") since = undefined;
  const stateText = status === "held" && pause ? s.slice(pause.index) : s.slice(Math.max(0, s.search(/\bstopped\b/)));
  const statusDate = /\b(?:since|on|from|as of)\s+(\d{4}(?:-\d{2}(?:-\d{2})?)?)\b/.exec(stateText);
  if ((status === "held" || status === "stopped") && statusDate && (pause || /\bstopp?\w*\b/.test(s))) since = partialDate(statusDate[1]) ?? since;
  if (status === "active" && resume) {
    const date = /\b(?:on|since|from)?\s*(\d{4}(?:-\d{2}(?:-\d{2})?)?)\b/.exec(s.slice(resume.index));
    since = date ? partialDate(date[1]) : undefined;
  }
  return { status, since, reason: status === "stopped" || status === "held" ? note ?? (pause ? directions : undefined) : undefined };
}
function stopReason(text: string | undefined): MedicationRow["stop_reason"] {
  if (!text) return undefined;
  const s = normalizeWords(text).replace(/\b(?:no|not having|without|never had) (?:side effects?|adverse reactions?|allergic reactions?)\b/g, "");
  if (/\b(?:side effects?|adverse|allerg\w*|reaction|(?:caused|made me|gave me|due to|because of) (?:a |me )?(?:rash|hives|nause\w*|vomit\w*|diarrh\w*|cough|dizz\w*|fatigue|tired|sick|sleepy|drows\w*|swelling|headache|stomach|abdominal|pancreatitis|liver|kidney))\b/.test(s)) return "adverse_reaction";
  if (/\b(?:did(?:n't| not) (?:work|help)|ineffective|not (?:working|helping)|no (?:benefit|effect)|was(?:n't| not) helping)\b/.test(s)) return "ineffective";
  if (/\b(?:switch\w*|replaced|changed to|instead|different (?:drug|medicine))\b/.test(s)) return "therapy_changed";
  if (/\b(?:course (?:complete|finished|ended)|(?:finished|completed|ended) (?:the |my )?(?:course|treatment)|finished antibiotics)\b/.test(s)) return "course_complete";
  if (/\b(?:my choice|decided|did(?:n't| not) want|don't want|do not want|prefer not|chose to)\b/.test(s)) return "patient_choice";
  if (/\b(?:because|due to|cost|afford|insurance|ran out|no longer need|not needed)\b/.test(s)) return "other";
  return undefined;
}
function sensitivities(ingredients: string[], entry: Obj): Sensitivity[] | undefined {
  const result: Sensitivity[] = [];
  const drugs = ingredients.join(" ");
  const context = normalizeWords([string(entry.note), string(entry.how_i_take_it)].filter(Boolean).join(" "));
  if (/\b(?:aripiprazole|bupropion|buspirone|citalopram|clonazepam|desvenlafaxine|duloxetine|escitalopram|fluoxetine|lithium|lorazepam|methylphenidate|mirtazapine|olanzapine|paroxetine|quetiapine|risperidone|sertraline|trazodone|venlafaxine)\b/.test(drugs) ||
      /\b(?:for (?:my )?(?:depression|anxiety|bipolar|schizophrenia|ptsd|adhd)|bipolar disorder)\b/.test(context)) result.push("mental-health");
  if (/\b(?:buprenorphine|naltrexone|disulfiram|acamprosate)\b/.test(drugs) || /\b(?:opioid use disorder|alcohol use disorder|addiction|for (?:alcohol|opioid) (?:dependence|withdrawal))\b/.test(context)) result.push("substance-use");
  if (/\b(?:ethinyl estradiol|norethindrone|levonorgestrel|etonogestrel|medroxyprogesterone|clomiphene)\b/.test(drugs) || /\b(?:birth control|contraception|contraceptive|fertility|pregnancy|for erectile dysfunction)\b/.test(context)) result.push("sexual-reproductive-health");
  if (/\b(?:emtricitabine|tenofovir|bictegravir|dolutegravir|abacavir|lamivudine|raltegravir|rilpivirine|efavirenz|darunavir|ritonavir)\b/.test(drugs) || /\b(?:for (?:hiv|aids|chlamydia|gonorrhea|syphilis|genital herpes)|hiv prep|hiv pep)\b/.test(context)) result.push("hiv-sti");
  if (/\b(?:brca[12]|for (?:cystic fibrosis|huntington's disease|inherited|genetic))\b/.test(context)) result.push("genetic");
  return result.length ? result : undefined;
}

function medications(item: Item | undefined): MedicationRow[] {
  if (!item) return [];
  const rows = new Map<string, MedicationRow>();
  for (const [id, entry] of item.entries) {
    const name = string(entry.name);
    if (entry.type !== "my_med" || !name) continue;
    const identity = medicineIdentity(entry);
    const state = stateOf(entry);
    const directions = string(entry.how_i_take_it);
    const sensitivity = sensitivities(identity.ingredients, entry);
    const ingredients: (string | undefined)[] = identity.ingredients.length ? identity.ingredients : [undefined];
    const strengths = componentStrengths(string(entry.strength_text), ingredients.length);
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      const row: MedicationRow = { drug_name: name, status: state.status, patient_reported: true, evidence: evidence(item, id) };
      if (ingredient) row.ingredient = ingredient;
      if (identity.code) row.rxnorm_ingredient = identity.code;
      if (state.since) row.status_since = state.since;
      if (state.reason) row.status_reason_text = state.reason;
      const strength = ingredients.length === 1 ? string(entry.strength_text) ?? identity.displays[0]
        : strengths[i] ?? (identity.displays.length === ingredients.length ? identity.displays[i] : undefined);
      // An explicit dose for a combination cannot be assigned independently to
      // each ingredient unless its component strength can be read.
      const dose = ingredients.length === 1 || strength ? doseFor(strength, directions) : undefined;
      if (dose) row.dose = dose;
      const schedule = directions && frequency(directions);
      if (schedule) row.frequency = schedule;
      if (state.status === "stopped") {
        const reason = stopReason(state.reason);
        if (reason) row.stop_reason = reason;
      }
      if (entry.kind === "over_the_counter") row.otc = true;
      if (sensitivity) row.sensitivity = sensitivity;
      // The specification allows either conflicting self-list entry to win. Sorted
      // entry ids make the choice stable without inventing a clinical event date.
      rows.set(ingredient ?? `unknown:${string(entry.homelog_med_id) ?? normalizeWords(name)}`, row);
    }
  }
  return [...rows.values()].sort((a, b) => compare(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name) || compare(a.drug_name, b.drug_name));
}

function sameMeasurement(a: Reading, b: Reading): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "bp") return a.row.systolic_mmhg === b.row.systolic_mmhg && a.row.diastolic_mmhg === b.row.diastolic_mmhg &&
    (a.row.pulse_bpm === undefined || b.row.pulse_bpm === undefined || a.row.pulse_bpm === b.row.pulse_bpm);
  if (a.row.glucose_out_of_range !== b.row.glucose_out_of_range) return false;
  // Compare before rounding: distinct measurements can round to the same integer.
  const av = a.original! * (a.unit === "mmol/L" ? 18.016 : 1);
  const bv = b.original! * (b.unit === "mmol/L" ? 18.016 : 1);
  return a.unit === b.unit ? a.original === b.original : Math.round(av) === Math.round(bv);
}
function vitals(items: Item[]): VitalRow[] {
  const readings: Reading[] = [];
  for (const item of items) for (const [id, entry] of item.entries) {
    if (entry.type !== "bp_reading" && entry.type !== "glucose_reading") continue;
    const time = dateTime(entry.measured_at);
    if (!time) continue;
    const local = time.local.slice(0, 16);
    const row: VitalRow = { setting: "home", local_time: local, evidence: evidence(item, id) };
    if (entry.type === "bp_reading") {
      if (!finite(entry.systolic_mmhg) || !finite(entry.diastolic_mmhg)) continue;
      row.systolic_mmhg = entry.systolic_mmhg;
      row.diastolic_mmhg = entry.diastolic_mmhg;
      if (finite(entry.pulse_bpm)) row.pulse_bpm = entry.pulse_bpm;
      readings.push({ row, kind: "bp", device: entry.entry_method === "cuff_sync", typed: entry.entry_method === "typed", time: Date.parse(local + ":00Z") });
    } else {
      if (!finite(entry.value) || (entry.unit !== "mg/dL" && entry.unit !== "mmol/L")) continue;
      if (entry.out_of_range !== undefined && entry.out_of_range !== "HI" && entry.out_of_range !== "LO") continue;
      const value = entry.value * (entry.unit === "mmol/L" ? 18.016 : 1);
      if (!Number.isFinite(value)) continue;
      row.glucose_mg_dl = Math.round(value);
      if (entry.out_of_range === "HI" || entry.out_of_range === "LO") row.glucose_out_of_range = entry.out_of_range;
      readings.push({ row, kind: "glucose", device: entry.entry_method === "meter_sync", typed: entry.entry_method === "typed", time: Date.parse(local + ":00Z"), original: entry.value, unit: entry.unit });
    }
  }
  const tie = (a: Reading, b: Reading) => a.time - b.time || compare(a.kind, b.kind) ||
    compare(a.row.evidence[0].item_id, b.row.evidence[0].item_id) || compare(a.row.evidence[0].entry_id ?? "", b.row.evidence[0].entry_id ?? "");
  readings.sort(tie);
  const devices = readings.filter(r => r.device);
  const used = new Set<Reading>();
  const duplicates = new Set<Reading>();
  for (const typed of readings.filter(r => r.typed)) {
    // A typed copy follows the device reading by at most two minutes. Match one
    // to one: two equal device readings remain two measurements.
    const device = devices.filter(d => !used.has(d) && typed.time >= d.time && typed.time - d.time <= 120_000 && sameMeasurement(d, typed))
      .sort((a, b) => typed.time - a.time - (typed.time - b.time) || tie(a, b))[0];
    if (device) {
      used.add(device); duplicates.add(typed);
      device.row.evidence.push(...typed.row.evidence);
      if (device.kind === "bp" && device.row.pulse_bpm === undefined && typed.row.pulse_bpm !== undefined) device.row.pulse_bpm = typed.row.pulse_bpm;
    }
  }
  return readings.filter(r => !duplicates.has(r)).map(r => {
    r.row.evidence.sort((a, b) => compare(a.item_id, b.item_id) || compare(a.entry_id ?? "", b.entry_id ?? ""));
    return r.row;
  });
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const { all, live } = availableItems(items, asOf);
  return { medications: medications(latestMedicineList(all, live)), problems: [], allergies: [], labs: [], vitals: vitals(live) };
}
