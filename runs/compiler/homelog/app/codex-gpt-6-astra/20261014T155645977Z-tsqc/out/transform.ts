import type { FolioItem, ViewRows, MedicationRow, VitalRow, Sensitivity } from "../in/views/views";

type ObjectValue = Record<string, unknown>;
type Item = {
  id: string;
  issuer: string;
  recorded: number;
  narrative: string;
  payload: ObjectValue;
  supersedes: string[];
  retracts: string[];
};

const object = (v: unknown): v is ObjectValue => typeof v === "object" && v !== null && !Array.isArray(v);
const string = (v: unknown): string => typeof v === "string" ? v : "";
const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (issuer: string, id: string): string => JSON.stringify([issuer, id]);

function partialDate(v: unknown): string | undefined {
  if (typeof v !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(v)) return;
  const [year, month, day] = v.split("-").map(Number);
  if (year < 1) return;
  if (month !== undefined && (month < 1 || month > 12)) return;
  const days = [31, year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day !== undefined && (day < 1 || day > days[month - 1])) return;
  return v;
}

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function chicagoTime(epoch: number): string {
  const parts: Record<string, string> = {};
  for (const p of chicago.formatToParts(new Date(epoch))) parts[p.type] = p.value;
  return `${parts.year.padStart(4, "0")}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

function dateTime(v: unknown): { local: string; epoch: number } | undefined {
  if (typeof v !== "string") return;
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})?$/.exec(v);
  if (!m || !partialDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] || 0) > 59) return;
  const wall = `${m[1]}T${m[2]}:${m[3]}:${m[4] || "00"}`;
  if (m[6]) {
    if (m[6] !== "Z") {
      const offset = m[6].replace(":", "");
      if (+offset.slice(1, 3) > 23 || +offset.slice(3) > 59) return;
    }
    const epoch = Date.parse(wall + (m[5] || "") + m[6]);
    if (!Number.isFinite(epoch)) return;
    return { local: chicagoTime(epoch), epoch };
  }
  // Keep unzoned wall times even during a DST gap. For ordering ambiguous recorded
  // times, choose the earlier occurrence; HomeLog itself records server times in UTC.
  const nominal = Date.parse(wall + (m[5] || "") + "Z");
  if (!Number.isFinite(nominal)) return;
  let epoch = nominal + 6 * 3600000;
  for (const hours of [5, 6]) {
    const candidate = nominal + hours * 3600000;
    if (chicagoTime(candidate) === wall) { epoch = candidate; break; }
  }
  return { local: wall, epoch };
}

function eligibleItems(input: unknown, asOf: string): Item[] {
  if (!Array.isArray(input)) return [];
  const result: Item[] = [];
  for (const value of input) {
    if (!object(value) || !string(value.id) || !string(value.issuer)) continue;
    const recorded = dateTime(value.recorded);
    if (!recorded || recorded.local.slice(0, 10) > asOf) continue;
    result.push({
      id: string(value.id), issuer: string(value.issuer), recorded: recorded.epoch,
      narrative: string(value.narrative), payload: object(value.payload) ? value.payload : {},
      supersedes: strings(value.supersedes), retracts: strings(value.retracts),
    });
  }
  return result.sort((a, b) => a.recorded - b.recorded || compare(a.issuer, b.issuer) || compare(a.id, b.id));
}

function currentItems(items: Item[]): Item[] {
  const byId = new Map(items.map(i => [key(i.issuer, i.id), i]));
  const replaced = new Set<string>();
  const retracted = new Set<string>();
  // Apply all committed replacement edges, including those from intermediate
  // revisions: removing a revision must not resurrect its superseded ancestors.
  for (const item of items) {
    for (const id of item.retracts) retracted.add(key(item.issuer, id));
    const pending = item.supersedes.map(id => key(item.issuer, id));
    while (pending.length) {
      const target = pending.pop()!;
      if (replaced.has(target)) continue;
      replaced.add(target);
      const previous = byId.get(target);
      if (previous) for (const id of previous.supersedes) pending.push(key(previous.issuer, id));
    }
  }
  return items.filter(i => !replaced.has(key(i.issuer, i.id)) && !retracted.has(key(i.issuer, i.id)));
}

function medicineSnapshots(items: Item[]): Set<string> {
  const snapshots = new Set<string>();
  for (const item of items) {
    if (Object.values(item.payload).some(e => object(e) && e.type === "my_med") || /^\s*My Medicines\s*,\s*saved\b/i.test(item.narrative)) {
      snapshots.add(key(item.issuer, item.id));
    }
  }
  // An empty restatement can clear the list. Narrative is only a kind hint, never
  // evidence for a new medicine. A retraction notice is not a list snapshot.
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of items) {
      const k = key(item.issuer, item.id);
      if (!snapshots.has(k) && item.supersedes.some(id => snapshots.has(key(item.issuer, id)))) {
        snapshots.add(k); changed = true;
      }
    }
  }
  return snapshots;
}

// Text aliases only. No RxNorm codes are inferred from these names.
const aliases: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  glucophagexr: "metformin", fortamet: "metformin", glumetza: "metformin", glucotrol: "glipizide",
  crestor: "rosuvastatin", lipitor: "atorvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", tirosint: "levothyroxine",
  farxiga: "dapagliflozin", forxiga: "dapagliflozin", jardiance: "empagliflozin", invokana: "canagliflozin",
  januvia: "sitagliptin", tradjenta: "linagliptin", actos: "pioglitazone", amaryl: "glimepiride",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", mounjaro: "tirzepatide",
  zepbound: "tirzepatide", trulicity: "dulaglutide", victoza: "liraglutide", saxenda: "liraglutide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  humalog: "insulin lispro", admelog: "insulin lispro", novolog: "insulin aspart", novorapid: "insulin aspart",
  fiasp: "insulin aspart", tresiba: "insulin degludec", levemir: "insulin detemir", apidra: "insulin glulisine",
  "humulin r": "insulin regular", "novolin r": "insulin regular", "humulin n": "insulin isophane", "novolin n": "insulin isophane",
  aleve: "naproxen", naprosyn: "naproxen", advil: "ibuprofen", motrin: "ibuprofen", tylenol: "acetaminophen",
  paracetamol: "acetaminophen", voltaren: "diclofenac", celebrex: "celecoxib", mobic: "meloxicam",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", salbutamol: "albuterol",
  xopenex: "levalbuterol", pulmicort: "budesonide", flovent: "fluticasone", qvar: "beclomethasone",
  spiriva: "tiotropium", singulair: "montelukast", atrovent: "ipratropium",
  symbicort: "budesonide / formoterol", advair: "fluticasone / salmeterol", breo: "fluticasone / vilanterol",
  combivent: "ipratropium / albuterol", duoneb: "ipratropium / albuterol",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan",
  lopressor: "metoprolol", toprol: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", aldactone: "spironolactone",
  hctz: "hydrochlorothiazide", microzide: "hydrochlorothiazide", hydrodiuril: "hydrochlorothiazide",
  hyzaar: "losartan / hydrochlorothiazide", prinzide: "lisinopril / hydrochlorothiazide",
  zestoretic: "lisinopril / hydrochlorothiazide", janumet: "sitagliptin / metformin",
  eliquis: "apixaban", xarelto: "rivaroxaban", pradaxa: "dabigatran", coumadin: "warfarin", plavix: "clopidogrel",
  pepcid: "famotidine", prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole",
  prevacid: "lansoprazole", zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine",
  benadryl: "diphenhydramine", flonase: "fluticasone", nasonex: "mometasone",
  keflex: "cephalexin", amoxil: "amoxicillin", augmentin: "amoxicillin / clavulanic acid",
  bactrim: "sulfamethoxazole / trimethoprim", septra: "sulfamethoxazole / trimethoprim",
  zithromax: "azithromycin", cipro: "ciprofloxacin", macrobid: "nitrofurantoin", flagyl: "metronidazole",
  deltasone: "prednisone", medrol: "methylprednisolone", fosamax: "alendronate", zyloprim: "allopurinol",
  neurontin: "gabapentin", lyrica: "pregabalin", keppra: "levetiracetam", lamictal: "lamotrigine",
  depakote: "divalproex", depakene: "valproic acid", topamax: "topiramate",
  seroquel: "quetiapine", abilify: "aripiprazole", risperdal: "risperidone", zyprexa: "olanzapine",
  latuda: "lurasidone", geodon: "ziprasidone", clozaril: "clozapine", haldol: "haloperidol",
  prozac: "fluoxetine", zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram",
  paxil: "paroxetine", effexor: "venlafaxine", cymbalta: "duloxetine", wellbutrin: "bupropion",
  remeron: "mirtazapine", desyrel: "trazodone", buspar: "buspirone", xanax: "alprazolam",
  ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam", lithobid: "lithium",
  concerta: "methylphenidate", ritalin: "methylphenidate", vyvanse: "lisdexamfetamine", strattera: "atomoxetine",
  subutex: "buprenorphine", suboxone: "buprenorphine / naloxone", zubsolv: "buprenorphine / naloxone",
  vivitrol: "naltrexone", campral: "acamprosate", antabuse: "disulfiram",
  truvada: "emtricitabine / tenofovir disoproxil", descovy: "emtricitabine / tenofovir alafenamide",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", tivicay: "dolutegravir",
  isentress: "raltegravir", triumeq: "abacavir / dolutegravir / lamivudine",
  estrace: "estradiol", prometrium: "progesterone", provera: "medroxyprogesterone",
  "depo-provera": "medroxyprogesterone", mirena: "levonorgestrel", kyleena: "levonorgestrel",
  nexplanon: "etonogestrel", clomid: "clomiphene", "plan b": "levonorgestrel",
};

const salt = /\b(?:hydrochloride|hcl|hydrobromide|hbr|sodium|potassium|calcium|succinate|tartrate|fumarate|maleate|besylate|sulfate|sulphate|phosphate|acetate|citrate|carbonate|trihydrate|dihydrate|monohydrate|mesylate)\b/gi;
const forms = /\b(?:oral|inhalation|inhaled|topical|ophthalmic|otic|nasal|rectal|vaginal|transdermal|subcutaneous|injectable|injection|solution|suspension|tablet|tablets|capsule|capsules|tab|tabs|cap|caps|inhaler|aerosol|cream|ointment|gel|patch|powder|spray|drops|pen|vial|prefilled|solostar|flexpen|flextouch|kwikpen|hfa|er|xr|xl|sr|cr|dr|ec|extended[ -]release|delayed[ -]release|immediate[ -]release)\b/gi;

function cleanName(v: string): string {
  let text = v.toLowerCase().replace(/[®™]/g, "").replace(/(^|\s)\.(\d)/g, "$10.$2").trim();
  // A product's strength is not part of its ingredient name.
  text = text.replace(/\b\d+(?:\.\d+)?(?:\s*[-/]\s*\d+(?:\.\d+)?)*\s*(?:mg|mcg|µg|μg|g|ml|units?|iu|u|%)(?:\b|(?<=%))[\s\S]*$/i, "");
  text = text.replace(/\([^)]*\)/g, " ").replace(forms, " ").replace(/\b\d+[ -]hour\b/g, " ").trim();
  const alias = aliases[text];
  if (alias) return alias;
  const leadingAlias = Object.keys(aliases).sort((a, b) => b.length - a.length || compare(a, b))
    .find(a => text.startsWith(a + " ") && /^(?:xl|xr|er|hfa|solostar|kwikpen|flexpen|flextouch|pen|inhaler|mix)\b/.test(text.slice(a.length + 1)));
  if (leadingAlias) return aliases[leadingAlias];
  // These salts are retained when they themselves name the administered compound.
  if (!/^(?:calcium|potassium|sodium|magnesium|ferrous|zinc|lithium)\b/.test(text)) text = text.replace(salt, " ");
  if (/^lithium\b/.test(text)) text = "lithium";
  text = text.replace(/\s+/g, " ").replace(/^[\s,;/+-]+|[\s,;/+-]+$/g, "");
  return aliases[text] || text;
}

function drugIngredients(entry: ObjectValue): string[] {
  const picked = object(entry.picked_from_search) ? entry.picked_from_search : {};
  const source = string(picked.display).trim() || string(entry.name).trim();
  if (!source) return [];
  // Remove concentration denominators before splitting combination ingredients.
  const prepared = source.replace(/\/(?:\s*\d+(?:\.\d+)?\s*)?(?:ml|l|actuation|puff|dose)\b/gi, " ")
    .replace(/(\d)\s*\/\s*(?=\d)/g, "$1-");
  const parts = prepared.split(/\s*(?:\/|\+|\band\b)\s*/i).flatMap(p => cleanName(p).split(" / "));
  return [...new Set(parts.filter(p => p && !/^(?:unknown|unspecified|n\/?a|none|other|medicine|medication|insulin|vitamin|supplement|multivitamin|water pill|blood pressure (?:pill|medicine)|sugar pill|pain ?(?:pill|killer)|m_\d+)$/i.test(p)
    && !/\b(?:my|pill|medicine|medication)\b/i.test(p) && /[a-z]/.test(p)))];
}

function normalizedDirections(v: string): string {
  const numbers: Record<string, string> = { one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10", eleven: "11", twelve: "12", half: "0.5", quarter: "0.25" };
  return v.toLowerCase().replace(/[’‘]/g, "'").replace(/½/g, "0.5").replace(/¼/g, "0.25").replace(/¾/g, "0.75")
    .replace(/(^|\s)\.(\d)/g, "$10.$2")
    .replace(/\b(?:one[- ]half|a half)\b/g, "0.5").replace(/\b(?:one[- ]quarter|a quarter)\b/g, "0.25")
    .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|half|quarter)\b/g, m => numbers[m])
    .replace(/\b(\d+)\s*\/\s*(\d+)\b/g, (m, a: string, b: string) => +b ? String(+a / +b) : m)
    .replace(/\b0\.(5|25)\s+(?:a|of a)\s+/g, "0.$1 ")
    .replace(/\b(?:an?|each)\s+(?=tablet|tab\b|capsule|cap\b|puff)/g, "1 ")
    .replace(/\b(?:q\.d\.|q\.h\.s\.|b\.i\.d\.|t\.i\.d\.|q\.i\.d\.|q\.w\.|p\.r\.n\.)/g, m => m.replace(/\./g, ""));
}

function frequency(directions: string): MedicationRow["frequency"] {
  const s = normalizedDirections(directions);
  if (!s.trim()) return;
  if (/\b(?:prn|as needed|when needed|if needed|as required)\b/.test(s)) return "PRN";
  if (/\b(?:every other|alternate days?|4 times|four times|qid|q6h|every 6 hours?|monthly|every month|taper|most days|occasionally|sometimes|sliding scale|variable|every \d+ weeks?)\b/.test(s)) return "other";
  if (/\b(?:twice|[2-9] times) (?:a |per )?week\b/.test(s)) return "other";
  if (/\b(?:qw|qwk|weekly|once a week|once per week|once weekly|every week|every 7 days|every (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/.test(s)) return "QW";
  if (/\b(?:tid|3 times(?: a| per)? day|3 times daily|thrice daily|q8h|every 8 hours?)\b/.test(s)) return "TID";
  if (/\b(?:bid|twice(?: a| per)? day|twice daily|2 times(?: a| per)? day|2 times daily|q12h|every 12 hours?)\b/.test(s)) return "BID";
  const periods = [/(?:\bmornings?\b|\bbreakfast\b|\b(?:a\.?m\.?)\b)/, /\b(?:noon|midday|lunch)\b/, /\b(?:evenings?|supper|dinner|bedtime|nights?|nightly|p\.?m\.?)\b/].filter(r => r.test(s)).length;
  if (periods === 3) return "TID";
  if (periods === 2) return "BID";
  if (/\b(?:qhs|hs|bedtime|nightly|at night|every night)\b/.test(s)) return "QHS";
  if (/\b(?:qd|qday|daily|once(?: a| per)? day|every day|q24h|every 24 hours?)\b/.test(s) || periods === 1) return "QD";
  if (/\bevery\s+\d+\s*(?:hours?|hrs?|days?)\b|\bq\d+h\b|\btimes\b|\bwith (?:each |all )?meals\b/.test(s)) return "other";
}

type Dose = NonNullable<MedicationRow["dose"]>;
const unitPattern = "(?:micrograms?|mcg|µg|μg|milligrams?|mg|grams?|g|international\\s+units?|units?|iu|u|millilit(?:er|re)s?|ml|cc)";
function unit(v: string): { unit: Dose["unit"]; factor: number } | undefined {
  const s = v.toLowerCase();
  if (/^(?:mg|milligram)/.test(s)) return { unit: "mg", factor: 1 };
  if (/^(?:mcg|µg|μg|microgram)/.test(s)) return { unit: "mcg", factor: 1 };
  if (/^(?:g|grams?)$/.test(s)) return { unit: "mg", factor: 1000 };
  if (/^(?:u|iu|units?|international\s+units?)$/.test(s)) return { unit: "units", factor: 1 };
  if (/^(?:ml|cc|millilit)/.test(s)) return { unit: "mL", factor: 1 };
}

function amounts(s: string): Array<Dose & { index: number; end: number }> {
  const result: Array<Dose & { index: number; end: number }> = [];
  const pattern = new RegExp("(\\d+(?:\\.\\d+)?|\\.\\d+)\\s*(" + unitPattern + ")(?![a-z])", "gi");
  for (const m of s.matchAll(pattern)) {
    const u = unit(m[2]);
    const value = Number(m[1]) * (u?.factor || 1);
    if (u && Number.isFinite(value)) result.push({ value, unit: u.unit, index: m.index!, end: m.index! + m[0].length });
  }
  return result;
}

function dose(entry: ObjectValue, component: number, componentCount: number): Dose | undefined {
  const directions = normalizedDirections(string(entry.how_i_take_it));
  if (!directions.trim()) return;
  if (/\b\d+(?:\.\d+)?\s*(?:[-–—]|to|or)\s*\d|\b(?:sliding scale|taper|vary|varies|varying|variable|depending|depends|adjust|as directed|per (?:the )?scale)\b/.test(directions)) return;
  if (/\bif\b.*\b(?:otherwise|else|blood|glucose|sugar)\b|\b(?:blood|glucose|sugar)\b.*\bif\b/.test(directions)) return;
  const picked = object(entry.picked_from_search) ? entry.picked_from_search : {};
  let strength = string(entry.strength_text) || string(picked.display) || string(entry.name);
  // "50/12.5 mg" states two component strengths sharing a unit.
  strength = strength.replace(new RegExp("(\\d+(?:\\.\\d+)?)\\s*[/+-]\\s*(\\d+(?:\\.\\d+)?)\\s*(" + unitPattern + ")(?![a-z])", "gi"), "$1 $3 / $2 $3");
  const strengths = amounts(strength);
  let perUnit: ReturnType<typeof amounts>[number] | undefined = strengths[componentCount > 1 ? component : 0];
  if (componentCount > 1 && strengths.length !== componentCount) perUnit = undefined;
  const concentration = perUnit && /^\s*(?:\/|per\b)\s*(\d+(?:\.\d+)?\s*)?(?:ml|millilit(?:er|re)s?)\b/i.exec(strength.slice(perUnit.end));
  const denominator = concentration ? Number(concentration[1] || 1) : undefined;
  const counts = [...directions.matchAll(/\b(\d+(?:\.\d+)?)\s*(tablets?|tabs?|capsules?|caps?|puffs?|sprays?|actuations?)\b/g)]
    .map(m => ({ value: +m[1], kind: /^(?:puff|spray|actuation)/.test(m[2]) ? "puff" : "tablet" }));
  for (const m of directions.matchAll(new RegExp("\\b(\\d+(?:\\.\\d+)?)\\s+(?:of (?:the )?)?\\d+(?:\\.\\d+)?\\s*" + unitPattern + "\\s*(tablets?|tabs?|capsules?|caps?|puffs?)\\b", "g"))) {
    counts.push({ value: +m[1], kind: m[2].startsWith("puff") ? "puff" : "tablet" });
  }
  // "take 2 in the morning" supplies a count, but "take 10 mg" supplies a mass.
  for (const implicit of directions.matchAll(/(?:^|\btake\s+|\band\s+|,\s*)(\d+(?:\.\d+)?)\s+(?=(?:in |at |every |each |once|twice|daily|nightly|morning|evening|bedtime|supper|with |as needed|for ))/g)) {
    counts.push({ value: +implicit[1], kind: "tablet" });
  }
  if (new Set(counts.map(c => c.value + ":" + c.kind)).size > 1) return;
  const count = counts[0]?.value;
  const countKind = counts[0]?.kind;
  const explicit = amounts(directions);
  const distinct = new Set(explicit.map(a => `${a.value}:${a.unit}`));
  if (distinct.size > 1) return;
  const direct = explicit[0];
  if (count !== undefined) {
    if (perUnit && !concentration && perUnit.unit !== "mL") return safeDose(perUnit.value * count, perUnit.unit);
    if (!perUnit && direct && /\b(?:tablets?|tabs?|capsules?|caps?|puffs?)\b/.test(directions.slice(direct.end))) return safeDose(direct.value * count, direct.unit);
    if (direct && componentCount === 1) return safeDose(direct.value, direct.unit);
    if (!perUnit && countKind === "tablet" && componentCount === 1) return safeDose(count, "tablet");
    return;
  }
  if (direct && componentCount === 1) {
    if (direct.unit === "mL" && concentration && denominator && perUnit) return safeDose(direct.value * perUnit.value / denominator, perUnit.unit);
    return safeDose(direct.value, direct.unit);
  }
  // A timing-only direction means one unit. A concentration is never a dose.
  const schedule = frequency(directions);
  if (perUnit && !concentration && !/\b(?:pen|vial|solution|suspension|cream|ointment|gel|drops?)\b/i.test(strength) && schedule && schedule !== "PRN") return safeDose(perUnit.value, perUnit.unit);
}

function safeDose(value: number, unit: Dose["unit"]): Dose | undefined {
  if (Number.isFinite(value) && value >= 0) return { value: Math.round(value * 1e9) / 1e9, unit };
}

function medicationStatus(entry: ObjectValue): MedicationRow["status"] {
  const s = `${string(entry.how_i_take_it)} ${string(entry.note)}`.toLowerCase().replace(/[’‘]/g, "'");
  const resumed = /\b(?:resumed|restarted|back on|taking (?:it )?again|no longer (?:held|on hold|paused))\b/.test(s);
  const conditional = /\b(?:will|might|may|should|plan to|told to) (?:hold|pause|stop)\b|\b(?:hold|pause|stop) if\b/.test(s);
  const negated = /\b(?:not|never) (?:held|on hold|paused|stopping|holding)\b/.test(s);
  const paused = /\b(?:on hold|holding(?! steady\b| at\b)|held|paused?|pausing|taking a break|stopped for now|not taking (?:it )?(?:right )?now)\b|\btemporarily (?:stopped|off|not taking)\b|\b(?:stop(?:ped)?|not taking|off(?: (?:it|this))?)\b.*\b(?:until|temporarily|for (?:the )?time being|for now|will restart|will resume|plan to restart|plan to resume)\b/.test(s);
  if (paused && !resumed && !conditional && !negated) return "held";
  if (entry.status === "stopped") return "stopped";
  if (entry.status === "taking") {
    if (!resumed && !conditional && /\b(?:no longer taking|stopped (?:it|taking)|discontinued)\b/.test(s)) return "stopped";
    return "active";
  }
  return "unknown";
}

function statusDate(entry: ObjectValue, status: MedicationRow["status"]): string | undefined {
  const s = `${string(entry.how_i_take_it)} ${string(entry.note)}`;
  const resumed = /\b(?:resumed|restarted|back on|taking (?:it )?again)\b/i.test(s);
  const action = status === "active" ? "(?:resumed|restarted)" : status === "held" ? "(?:held|holding|paused|on hold|stopped)" : "(?:stopped|discontinued)";
  const explicit = new RegExp("\\b" + action + "(?:\\s+(?:it|this|taking|since|on|from|as of)){0,3}\\s+(\\d{4}(?:-\\d{2}(?:-\\d{2})?)?)(?![\\d-])", "i").exec(s);
  if (explicit) return partialDate(explicit[1]);
  if (status === "active") return resumed ? undefined : partialDate(entry.started);
  if (status === "stopped" || status === "held" && entry.status === "stopped") return partialDate(entry.stopped);
}

function stopReason(note: string): MedicationRow["stop_reason"] {
  const s = note.toLowerCase().replace(/[’‘]/g, "'");
  if (/\b(?:no|without) (?:side effects?|reaction|rash)\b/.test(s)) return;
  if (/\b(?:side effects?|adverse|reaction|allergic|rash|hives|nausea|nauseous|vomiting|diarrh[eo]a|stomach upset|upset (?:my )?stomach|dizz(?:y|iness)|too (?:sleepy|drowsy)|pancreatitis|liver injury|muscle (?:aches|pain)|made me (?:sick|feel sick|cough)|(?:caused|gave me) (?:a )?(?:cough|swelling|headache))\b/.test(s)) return "adverse_reaction";
  if (/\b(?:ineffective|did(?:n't| not) (?:work|help)|not (?:working|helping)|no (?:benefit|effect)|was(?:n't| not) (?:working|helping))\b/.test(s)) return "ineffective";
  if (/\b(?:switched|replaced|changed (?:to|therapy|regimen)|instead|new regimen)\b/.test(s)) return "therapy_changed";
  if (/\b(?:course (?:complete|completed|finished|ended)|finished (?:the |my )?(?:course|antibiotics)|completed (?:the |my )?course|treatment complete)\b/.test(s)) return "course_complete";
  if (/\b(?:my choice|decided|chose|don't want|didn't want|prefer(?:red)? not|on my own)\b/.test(s)) return "patient_choice";
  if (/\b(?:because|due to|cost|expensive|afford|ran out|pregnan|surgery|kidney|doctor (?:said|told)|told (?:me )?to stop)\b/.test(s)) return "other";
}

function sensitivities(ingredient: string | undefined, entry: ObjectValue): Sensitivity[] {
  const drug = ingredient || "";
  const context = `${string(entry.name)} ${string(entry.note)} ${string(entry.how_i_take_it)}`.toLowerCase();
  const result: Sensitivity[] = [];
  if (/^(?:quetiapine|aripiprazole|risperidone|olanzapine|lurasidone|ziprasidone|clozapine|haloperidol|lithium|fluoxetine|sertraline|escitalopram|citalopram|paroxetine|venlafaxine|desvenlafaxine|bupropion|mirtazapine|trazodone|buspirone|alprazolam|methylphenidate|lisdexamfetamine|atomoxetine)$/.test(drug)
    || /\b(?:bipolar|depression|depressive|anxiety|schizophrenia|psychosis|ptsd|adhd|ocd|panic disorder)\b/.test(context)) result.push("mental-health");
  if (/^(?:buprenorphine|acamprosate|disulfiram)$/.test(drug) || /\b(?:opioid use disorder|alcohol use disorder|addiction|alcohol dependence|opioid dependence|sobriety|for cravings)\b/.test(context)) result.push("substance-use");
  if (/^(?:levonorgestrel|etonogestrel|ethinyl estradiol|norethindrone|norgestimate|drospirenone|desogestrel|clomiphene|medroxyprogesterone|progesterone|estradiol)$/.test(drug)
    || /\b(?:contracepti\w*|birth control|pregnan\w*|fertility|infertility|menopaus\w*)\b/.test(context)) result.push("sexual-reproductive-health");
  if (/^(?:abacavir|bictegravir|dolutegravir|raltegravir|elvitegravir|emtricitabine|tenofovir(?: disoproxil| alafenamide)?|lamivudine|zidovudine|efavirenz|rilpivirine|doravirine|darunavir|atazanavir|ritonavir|lopinavir|nevirapine|maraviroc|enfuvirtide)$/.test(drug)
    || /\b(?:hiv|aids|chlamydia|gonorrh[eo]a|syphilis|genital herpes|hiv prep|hiv pep)\b/.test(context)) result.push("hiv-sti");
  if (/\b(?:brca[12]|cystic fibrosis|huntington(?:'s)?|inherited|genetic disorder)\b/.test(context)) result.push("genetic");
  return result;
}

function medications(snapshot: Item | undefined): MedicationRow[] {
  if (!snapshot) return [];
  const selected = new Map<string, MedicationRow>();
  for (const [entryId, entry] of Object.entries(snapshot.payload).sort(([a], [b]) => compare(a, b))) {
    if (!object(entry) || entry.type !== "my_med" || !string(entry.name).trim()) continue;
    const ingredients = drugIngredients(entry);
    const components: Array<string | undefined> = ingredients.length ? ingredients : [undefined];
    for (let index = 0; index < components.length; index++) {
      const ingredient = components[index];
      const status = medicationStatus(entry);
      const row: MedicationRow = {
        drug_name: string(entry.name), status, patient_reported: true,
        evidence: [{ item_id: snapshot.id, entry_id: entryId }],
      };
      if (ingredient) row.ingredient = ingredient;
      const picked = object(entry.picked_from_search) ? entry.picked_from_search : {};
      // A bare generic ingredient display is the schema's ingredient-only search
      // result. Product strengths, forms, salts and brand displays never supply IN.
      if (ingredient && components.length === 1 && string(picked.display).trim().toLowerCase() === ingredient && /^\d+$/.test(string(picked.rxnorm))) row.rxnorm_ingredient = string(picked.rxnorm);
      const since = statusDate(entry, status);
      if (since) row.status_since = since;
      const amount = dose(entry, index, components.length);
      if (amount) row.dose = amount;
      const schedule = frequency(string(entry.how_i_take_it));
      if (schedule) row.frequency = schedule;
      const note = string(entry.note);
      if (note.trim() && (status === "held" || status === "stopped")) row.status_reason_text = note;
      else if (status === "held") row.status_reason_text = string(entry.how_i_take_it);
      if (status === "stopped") {
        const reason = stopReason(note || string(entry.how_i_take_it));
        if (reason) row.stop_reason = reason;
      }
      if (entry.kind === "over_the_counter") row.otc = true;
      const sensitive = sensitivities(ingredient, entry);
      if (sensitive.length) row.sensitivity = sensitive;
      const identity = ingredient ? "ingredient:" + ingredient : "unidentified:" + (string(entry.homelog_med_id) || entryId);
      const prior = selected.get(identity);
      // Conflicting self-list duplicates have no mandated winner. Prefer a stated
      // later status date, then the lexically last entry id, retaining one row.
      if (!prior || (row.status_since || "") >= (prior.status_since || "")) selected.set(identity, row);
    }
  }
  return [...selected.values()].sort((a, b) => compare(a.ingredient || a.drug_name, b.ingredient || b.drug_name) || compare(a.evidence[0].entry_id || "", b.evidence[0].entry_id || ""));
}

type Reading = { row: VitalRow; minute: number; kind: "bp" | "glucose"; device: boolean; arm?: string; exactGlucose?: number; issuer: string };

function vitals(items: Item[]): VitalRow[] {
  const readings: Reading[] = [];
  for (const item of items) {
    for (const [entryId, entry] of Object.entries(item.payload).sort(([a], [b]) => compare(a, b))) {
      if (!object(entry) || (entry.type !== "bp_reading" && entry.type !== "glucose_reading")) continue;
      const time = dateTime(entry.measured_at);
      if (!time) continue;
      const row: VitalRow = { setting: "home", local_time: time.local.slice(0, 16), evidence: [{ item_id: item.id, entry_id: entryId }] };
      const reading: Reading = { row, minute: Date.parse(row.local_time + ":00Z") / 60000, kind: entry.type === "bp_reading" ? "bp" : "glucose", device: false, issuer: item.issuer };
      if (entry.type === "bp_reading") {
        if (!finite(entry.systolic_mmhg) || !finite(entry.diastolic_mmhg)) continue;
        if (entry.entry_method !== "typed" && entry.entry_method !== "cuff_sync") continue;
        row.systolic_mmhg = entry.systolic_mmhg;
        row.diastolic_mmhg = entry.diastolic_mmhg;
        if (finite(entry.pulse_bpm)) row.pulse_bpm = entry.pulse_bpm;
        reading.device = entry.entry_method === "cuff_sync";
        reading.arm = string(entry.arm) || undefined;
      } else {
        if (!finite(entry.value) || (entry.unit !== "mg/dL" && entry.unit !== "mmol/L")) continue;
        if (entry.entry_method !== "typed" && entry.entry_method !== "meter_sync") continue;
        if (entry.out_of_range !== undefined && entry.out_of_range !== "HI" && entry.out_of_range !== "LO") continue;
        const value = entry.value * (entry.unit === "mmol/L" ? 18.016 : 1);
        if (!Number.isFinite(value)) continue;
        row.glucose_mg_dl = Math.round(value);
        if (entry.out_of_range) row.glucose_out_of_range = entry.out_of_range;
        reading.exactGlucose = value;
        reading.device = entry.entry_method === "meter_sync";
      }
      readings.push(reading);
    }
  }
  readings.sort((a, b) => a.minute - b.minute || compare(a.row.evidence[0].item_id, b.row.evidence[0].item_id) || compare(a.row.evidence[0].entry_id || "", b.row.evidence[0].entry_id || ""));
  const devices = readings.filter(r => r.device);
  const removed = new Set<Reading>();
  for (const typed of readings.filter(r => !r.device)) {
    // Pair only a typed copy with one device reading, never two real device
    // measurements (or two typed measurements) merely because values repeat.
    const match = devices.filter(d => d.issuer === typed.issuer && d.kind === typed.kind && typed.minute - d.minute >= 0 && typed.minute - d.minute <= 2 && sameMeasurement(d, typed))
      .sort((a, b) => b.minute - a.minute || compare(a.row.evidence[0].item_id, b.row.evidence[0].item_id) || compare(a.row.evidence[0].entry_id || "", b.row.evidence[0].entry_id || ""))[0];
    if (match) {
      removed.add(typed);
      match.row.evidence.push(...typed.row.evidence);
    }
  }
  return readings.filter(r => !removed.has(r)).map(r => r.row);
}

function sameMeasurement(a: Reading, b: Reading): boolean {
  if (a.kind === "glucose") {
    // Compare before rounding so distinct fractional measurements do not merge.
    return Math.abs(a.exactGlucose! - b.exactGlucose!) < 1e-8 && a.row.glucose_out_of_range === b.row.glucose_out_of_range;
  }
  return a.row.systolic_mmhg === b.row.systolic_mmhg && a.row.diastolic_mmhg === b.row.diastolic_mmhg
    && (a.row.pulse_bpm === undefined || b.row.pulse_bpm === undefined || a.row.pulse_bpm === b.row.pulse_bpm)
    && (!a.arm || !b.arm || a.arm === b.arm);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (typeof asOf !== "string" || asOf.length !== 10 || !partialDate(asOf)) return empty;
  const eligible = eligibleItems(items, asOf);
  const current = currentItems(eligible);
  const snapshots = medicineSnapshots(eligible);
  const latestList = current.filter(i => snapshots.has(key(i.issuer, i.id))).at(-1);
  // Dose logs are individual administrations, not the medicine list. Symptom tags
  // are not diagnoses or an avoidance list. Home meter values are vitals, not labs.
  return { ...empty, medications: medications(latestList), vitals: vitals(current) };
}
