import type { FolioItem, MedicationRow, ViewRows } from "../in/views/views";

type ObjectValue = Record<string, unknown>;
type Snapshot = {
  id: string;
  issuer: string;
  recorded: number;
  narrative: string;
  entries: [string, ObjectValue][];
  supersedes: string[];
  retracts: string[];
};

function object(value: unknown): value is ObjectValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function partialDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) return;
  const year = Number(value.slice(0, 4));
  if (year === 0) return;
  if (value.length === 4) return value;
  const month = Number(value.slice(5, 7));
  if (month < 1 || month > 12) return;
  if (value.length === 7) return value;
  const day = Number(value.slice(8, 10));
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= days[month - 1] ? value : undefined;
}

function instant(value: unknown): number | undefined {
  if (typeof value !== "string") return;
  // Require an offset. Date.parse on an unzoned timestamp depends on the host zone.
  const m = /^(\d{4}-\d{2}-\d{2})[Tt](\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:[Zz]|([+-])(\d{2}):(\d{2}))$/.exec(value);
  if (!m || !partialDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +m[4] > 59) return;
  if (m[5] && (+m[6] > 23 || +m[7] > 59)) return;
  const result = Date.parse(value);
  return Number.isFinite(result) ? result : undefined;
}

function key(issuer: string, id: string): string {
  return JSON.stringify([issuer, id]);
}

function ids(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
}

function inScope(items: unknown[], asOf: string): Snapshot[] {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  });
  const result: Snapshot[] = [];
  for (const item of items) {
    if (!object(item)) continue;
    const id = string(item.id);
    const issuer = string(item.issuer);
    const recorded = instant(item.recorded);
    if (!id || !issuer || recorded === undefined) continue;
    const parts = formatter.formatToParts(new Date(recorded));
    const part = (name: string) => parts.find(p => p.type === name)?.value ?? "";
    const day = `${part("year").padStart(4, "0")}-${part("month")}-${part("day")}`;
    if (day > asOf) continue;
    const entries: [string, ObjectValue][] = [];
    // Unknown schema payloads cannot supply HomeLog facts, but their envelope
    // corrections still count.
    if ((!object(item.schema) || item.schema.type === "HomeLogEntry") && object(item.payload)) {
      for (const entryId of Object.keys(item.payload).sort(compare)) {
        const entry = item.payload[entryId];
        if (object(entry)) entries.push([entryId, entry]);
      }
    }
    result.push({ id, issuer, recorded, entries,
      narrative: typeof item.narrative === "string" ? item.narrative : "",
      supersedes: ids(item.supersedes), retracts: ids(item.retracts),
    });
  }
  return result.sort((a, b) => a.recorded - b.recorded || compare(a.issuer, b.issuer) || compare(a.id, b.id));
}

// Each entry supplies its own name. These aliases translate names, never supply
// RxNorm codes, indications, doses, or clinical decisions.
const names: Record<string, string> = {};
const aliases: [string, string[]][] = [
  ["lisinopril", ["zestril", "prinivil", "qbrelis"]],
  ["losartan", ["cozaar"]], ["valsartan", ["diovan"]],
  ["irbesartan", ["avapro"]], ["olmesartan", ["benicar"]],
  ["telmisartan", ["micardis"]], ["candesartan", ["atacand"]],
  ["amlodipine", ["norvasc"]], ["nifedipine", ["procardia", "adalat"]],
  ["diltiazem", ["cardizem", "tiazac"]], ["verapamil", ["calan", "verelan"]],
  ["metoprolol", ["lopressor", "toprol xl", "toprol"]],
  ["atenolol", ["tenormin"]], ["carvedilol", ["coreg"]],
  ["nebivolol", ["bystolic"]], ["propranolol", ["inderal"]],
  ["hydrochlorothiazide", ["hctz", "microzide"]], ["chlorthalidone", ["hygroton", "thalitone"]],
  ["furosemide", ["lasix"]], ["torsemide", ["demadex"]],
  ["bumetanide", ["bumex"]], ["spironolactone", ["aldactone"]],
  ["eplerenone", ["inspra"]], ["finerenone", ["kerendia"]],
  ["hydralazine", ["apresoline"]], ["clonidine", ["catapres"]],
  ["metformin", ["glucophage", "glucophage xr", "glumetza", "fortamet", "riomet"]],
  ["glipizide", ["glucotrol", "glucotrol xl"]], ["glyburide", ["diabeta", "glynase"]],
  ["glimepiride", ["amaryl"]], ["pioglitazone", ["actos"]],
  ["empagliflozin", ["jardiance"]], ["dapagliflozin", ["farxiga", "forxiga"]],
  ["canagliflozin", ["invokana"]], ["ertugliflozin", ["steglatro"]],
  ["sitagliptin", ["januvia"]], ["linagliptin", ["tradjenta"]],
  ["saxagliptin", ["onglyza"]], ["alogliptin", ["nesina"]],
  ["dulaglutide", ["trulicity"]], ["semaglutide", ["ozempic", "rybelsus", "wegovy"]],
  ["liraglutide", ["victoza", "saxenda"]], ["tirzepatide", ["mounjaro", "zepbound"]],
  ["exenatide", ["byetta", "bydureon"]],
  ["insulin glargine", ["lantus", "basaglar", "toujeo", "semglee"]],
  ["insulin lispro", ["humalog", "admelog", "lyumjev"]],
  ["insulin aspart", ["novolog", "novorapid", "fiasp"]],
  ["insulin detemir", ["levemir"]], ["insulin degludec", ["tresiba"]],
  ["atorvastatin", ["lipitor"]], ["rosuvastatin", ["crestor"]],
  ["simvastatin", ["zocor"]], ["pravastatin", ["pravachol"]],
  ["lovastatin", ["mevacor", "altoprev"]], ["ezetimibe", ["zetia"]],
  ["fenofibrate", ["tricor"]], ["fenofibric acid", ["trilipix"]],
  ["levothyroxine", ["synthroid", "levoxyl", "unithroid", "tirosint", "euthyrox"]],
  ["sertraline", ["zoloft"]], ["fluoxetine", ["prozac"]],
  ["escitalopram", ["lexapro"]], ["citalopram", ["celexa"]],
  ["paroxetine", ["paxil"]], ["duloxetine", ["cymbalta"]],
  ["venlafaxine", ["effexor", "effexor xr"]], ["bupropion", ["wellbutrin", "wellbutrin xl", "zyban"]],
  ["trazodone", ["desyrel"]], ["mirtazapine", ["remeron"]],
  ["gabapentin", ["neurontin"]], ["pregabalin", ["lyrica"]],
  ["ibuprofen", ["advil", "motrin"]], ["naproxen", ["aleve", "naprosyn"]],
  ["acetaminophen", ["tylenol", "paracetamol"]], ["aspirin", ["acetylsalicylic acid"]],
  ["celecoxib", ["celebrex"]], ["meloxicam", ["mobic"]],
  ["diclofenac", ["voltaren"]], ["tramadol", ["ultram"]],
  ["omeprazole", ["prilosec"]], ["pantoprazole", ["protonix"]],
  ["esomeprazole", ["nexium"]], ["lansoprazole", ["prevacid"]],
  ["famotidine", ["pepcid"]], ["ondansetron", ["zofran"]],
  ["albuterol", ["salbutamol", "ventolin", "proair", "proventil"]],
  ["budesonide", ["pulmicort"]], ["montelukast", ["singulair"]],
  ["cetirizine", ["zyrtec"]], ["loratadine", ["claritin"]],
  ["fexofenadine", ["allegra"]], ["diphenhydramine", ["benadryl"]],
  ["apixaban", ["eliquis"]], ["rivaroxaban", ["xarelto"]],
  ["dabigatran", ["pradaxa"]], ["warfarin", ["coumadin", "jantoven"]],
  ["clopidogrel", ["plavix"]], ["ticagrelor", ["brilinta"]],
  ["allopurinol", ["zyloprim"]], ["colchicine", ["colcrys", "mitigare"]],
  ["tamsulosin", ["flomax"]], ["finasteride", ["proscar", "propecia"]],
  ["amoxicillin", ["amoxil"]], ["azithromycin", ["zithromax"]],
  ["doxycycline", ["vibramycin"]], ["cephalexin", ["keflex"]],
  ["prednisone", ["deltasone"]], ["hydroxychloroquine", ["plaquenil"]],
  ["alendronate", ["fosamax"]], ["cholecalciferol", ["vitamin d3"]],
  ["ergocalciferol", ["vitamin d2"]], ["cyanocobalamin", []],
];
for (const [ingredient, brands] of aliases) {
  names[ingredient] = ingredient;
  for (const brand of brands) names[brand] = ingredient;
}
for (const ingredient of [
  "enalapril", "ramipril", "benazepril", "sacubitril", "digoxin", "nitroglycerin",
  "isosorbide mononitrate", "isosorbide dinitrate", "amiodarone", "sotalol",
  "penicillin", "penicillin v", "ciprofloxacin", "levofloxacin", "nitrofurantoin",
  "sulfamethoxazole", "trimethoprim", "clavulanic acid", "metronidazole", "clindamycin",
  "acyclovir", "valacyclovir", "fluconazole", "methotrexate", "folic acid",
  "potassium chloride", "potassium citrate", "sodium bicarbonate", "sodium chloride",
  "calcium carbonate", "calcium citrate", "magnesium oxide", "magnesium citrate",
  "ferrous sulfate", "ferrous gluconate", "ferrous fumarate", "ascorbic acid",
  "methylcobalamin", "melatonin", "biotin", "thiamine", "pyridoxine",
  "hydrocortisone", "methylprednisolone", "dexamethasone", "tacrolimus",
  "oxycodone", "hydrocodone", "morphine", "codeine", "baclofen", "cyclobenzaprine",
  "amitriptyline", "nortriptyline", "buspirone", "lorazepam", "alprazolam",
  "clonazepam", "diazepam", "zolpidem", "quetiapine", "aripiprazole",
  "levetiracetam", "lamotrigine", "topiramate", "carbamazepine",
  "docusate", "senna", "bisacodyl", "lactulose", "loperamide",
]) names[ingredient] = ingredient;

const combinations: Record<string, string[]> = {
  hyzaar: ["losartan", "hydrochlorothiazide"],
  prinzide: ["lisinopril", "hydrochlorothiazide"], zestoretic: ["lisinopril", "hydrochlorothiazide"],
  janumet: ["sitagliptin", "metformin"], synjardy: ["empagliflozin", "metformin"],
  xigduo: ["dapagliflozin", "metformin"], glucovance: ["glyburide", "metformin"],
  entresto: ["sacubitril", "valsartan"], lotrel: ["amlodipine", "benazepril"],
  exforge: ["amlodipine", "valsartan"], caduet: ["amlodipine", "atorvastatin"],
  augmentin: ["amoxicillin", "clavulanic acid"], bactrim: ["sulfamethoxazole", "trimethoprim"],
};

function normalized(value: string): string {
  return value.toLowerCase().replace(/[®™]/g, "").replace(/\s+/g, " ").trim();
}

function baseName(value: string): string {
  const base = normalized(value)
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|ug|g|ml|units?|iu|%)\b.*$/, "")
    .replace(/\b(?:extended release|delayed release|sustained release|oral|tablet[s]?|capsule[s]?|solution|injection|injectable|suspension|pen|inhaler|cream|ointment|patch|er|xr|xl|sr|dr|hfa|kwikpen|solostar|flextouch)\b/g, "")
    .replace(/\s+/g, " ").trim();
  // Preserve named mineral compounds. Strip pharmaceutical salts, including
  // sulfate/phosphate/fumarate only when the remaining drug name is recognized.
  if (typeof names[base] === "string") return base;
  const stem = base.replace(/\s+(?:hydrochloride|hcl|hydrobromide|hbr|potassium|sodium|calcium|succinate|tartrate|besylate|maleate|mesylate|sulfate|phosphate|fumarate|citrate)$/, "");
  if (typeof names[stem] === "string") return stem;
  return base.replace(/\s+(?:hydrochloride|hcl|hydrobromide|hbr|potassium|sodium|calcium|succinate|tartrate|besylate|maleate|mesylate)$/, "");
}

function ingredients(value: string, searchDisplay: boolean): string[] {
  const raw = normalized(value);
  const base = baseName(value);
  if (Object.prototype.hasOwnProperty.call(combinations, base)) return combinations[base];
  // Split combination ingredients before stripping the strength of each part.
  // Do not split a concentration denominator such as units/mL.
  const separator = /\s*[+&]\s*|\s+and\s+|\s*\/(?!\s*(?:ml|mg|mcg|g|l|\d)\b)\s*/;
  if (separator.test(raw)) {
    const parts = raw.split(separator);
    const resolved = parts.map(p => ingredients(p, searchDisplay));
    if (resolved.every(p => p.length > 0)) return [...new Set(resolved.flat())];
    return [];
  }
  const known = names[raw] ?? names[base];
  if (typeof known === "string") return [known];
  if (/\b(?:pill|medicine|medication|unknown|unsure|vitamin|supplement)\b|[\d/]/.test(base)) return [];
  // Search displays name the drug. A typed name is resolved only when recognized;
  // do not present a nickname or an unrecognized brand as a generic ingredient.
  if (searchDisplay && /^[a-z][a-z -]*$/.test(base)) return [base];
  return [];
}

type Dose = NonNullable<MedicationRow["dose"]>;
const numberPattern = "(?:(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:/\\d+)?|one|two|three|four|five|six|half|a half|a quarter)";
const numberWords: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5, "a half": 0.5, "a quarter": 0.25 };

function quantity(value: string): number {
  if (Object.prototype.hasOwnProperty.call(numberWords, value)) return numberWords[value];
  const parts = value.split("/").map(Number);
  return parts.length === 2 ? parts[0] / parts[1] : parts[0];
}

function dose(text: string | undefined): Dose | undefined {
  if (!text) return;
  let value = normalized(text).replace(/[μµ]/g, "u");
  value = value.replace(/\bhalf (?:of )?(?:a|one)\b/g, "half");
  // A range, taper or alternating regimen does not specify a single dose.
  if (/\b(?:taper|sliding scale|variable|alternate|alternating|between|divided|total)\b/.test(value)
    || new RegExp(`${numberPattern}\\s*(?:[-–]|to|or)\\s*${numberPattern}`).test(value)) return;
  if (new RegExp(`${numberPattern}\\s*(?:puffs?|sprays?|drops?)\\b`).test(value)) return;
  value = value.replace(/\b(\d+)\s+(\d+)\/(\d+)\b/g, (_, whole, numerator, denominator) => String(+whole + +numerator / +denominator));
  // In "two 500 mg tablets", 500 mg is strength, while two tablets is the dose.
  value = value.replace(new RegExp(`(${numberPattern})\\s+\\d+(?:\\.\\d+)?\\s*(?:mg|mcg|ug|g)\\s+(tablets?|tabs?|capsules?|caps?)\\b`, "g"), "$1 $2");
  const pattern = new RegExp(`(?<![\\w./-])(${numberPattern})\\s*(\\[iu\\]|units?|unt|iu|milligrams?|micrograms?|millilit(?:er|re)s?|tablets?|tabs?|capsules?|caps?|mcg|ug|mg|ml|g)(?![a-z])`, "g");
  const found: Dose[] = [];
  for (const match of value.matchAll(pattern)) {
    const after = value.slice((match.index ?? 0) + match[0].length);
    if (/^\s*(?:\/|per\b)/.test(after)) continue; // concentration, not dose
    if (/^(?:mg|mcg|ug|g|milligrams?|micrograms?)$/.test(match[2])
      && /^\s*(?:tablets?|capsules?|pens?)\b/.test(after)) continue; // product strength
    let amount = quantity(match[1]);
    const sourceUnit = match[2];
    let unit: Dose["unit"];
    if (/^(?:tabs?|tablets?|caps?|capsules?)$/.test(sourceUnit)) unit = "tablet";
    else if (/^(?:units?|unt|iu|\[iu\])$/.test(sourceUnit)) unit = "units";
    else if (/^(?:mcg|ug|micrograms?)$/.test(sourceUnit)) unit = "mcg";
    else if (/^(?:ml|millilit(?:er|re)s?)$/.test(sourceUnit)) unit = "mL";
    else { unit = "mg"; if (sourceUnit === "g") amount *= 1000; }
    if (!Number.isFinite(amount) || amount < 0) continue;
    found.push({ value: amount, unit });
  }
  if (!found.length) return;
  const first = found[0];
  return found.every(d => d.value === first.value && d.unit === first.unit) ? first : undefined;
}

function frequency(text: string | undefined): MedicationRow["frequency"] {
  if (!text) return;
  const value = normalized(text).replace(/\./g, "");
  if (/\b(?:prn|as needed|if needed|when needed|when .*(?:hurts?|pain)|for pain as needed)\b/.test(value)) return "PRN";
  if (/\b(?:every other|alternate|alternating|except|weekdays|taper|four times|4 times|qid|q6h)\b/.test(value)
    || /\b(?:twice|three times|[2-9] times) (?:a |per )?week(?:ly)?\b/.test(value)) return "other";
  if (/\b(?:tid|three times (?:a |per |each )?day|three times daily|3 times (?:daily|(?:a |per )?day)|q8h|every 8 hours)\b/.test(value)
    || /\bmorning\b.*\b(?:noon|lunch|afternoon)\b.*\b(?:evening|night|bedtime|supper|dinner)\b/.test(value)) return "TID";
  if (/\b(?:bid|twice (?:a |per |each )?day|twice daily|two times (?:daily|(?:a |per )?day)|2 times (?:daily|(?:a |per )?day)|q12h|every 12 hours)\b/.test(value)
    || /\b(?:morning|breakfast|am)\b.*\b(?:and|&)\s+(?:at )?(?:supper|dinner|evening|night|bedtime|pm)\b/.test(value)) return "BID";
  if (/\b(?:qw|weekly|once (?:a |per |each )?week|every week)\b/.test(value)) return "QW";
  if (/\b(?:qhs|bedtime|nightly|every night|at night)\b/.test(value)) return "QHS";
  if (/\b(?:qd|daily|once (?:a |per |each )?day|every day|q24h|every 24 hours)\b/.test(value)) return "QD";
  if (/\b(?:(?:every|each|in the) morning|with breakfast)\b/.test(value)
    && !/\b(?:and|or|noon|lunch|evening|night|supper|dinner|bedtime)\b/.test(value)) return "QD";
  if (/^(?:(?:take|use)\s+)?(?:\d+(?:\.\d+)?\s*(?:mg|mcg|units?|tablets?|tabs?|ml)\s+)?(?:in (?:the )?|every |with |at )?(?:morning|breakfast|supper|dinner|evening)$/.test(value)) return "QD";
  if (/\b(?:day|days|week|weeks|month|months|hours?|meals?|morning|evening|supper|dinner|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.test(value)) return "other";
  return undefined;
}

function stopReason(note: string | undefined): MedicationRow["stop_reason"] {
  if (!note) return;
  const text = normalized(note);
  const clauses = text.split(/[.;,\n]/);
  for (const clause of clauses) {
    if (/\b(?:no|not|never|denies|without)\b/.test(clause)) continue;
    if (/\b(?:side effects?|adverse (?:effect|reaction)|allerg(?:y|ic))\b/.test(clause)
      || /\b(?:caused|gave me|made me)\b.*\b(?:cough|rash|hives|nausea|vomit|diarrhea|dizz\w*|sick|tired|swelling|swollen|upset|pain|cramps)\b/.test(clause)
      || /^(?:dry cough|cough|nausea|vomiting|diarrh(?:ea|oea)|rash|hives|dizz(?:iness|y)|stomach upset|gi upset)[! ]*$/.test(clause)
      || /\b(?:because of|due to|from)\s+(?:a |the )?(?:dry cough|cough|nausea|vomiting|diarrhea|rash|hives|dizziness|side effects?)\b/.test(clause)) return "adverse_reaction";
  }
  if (/\b(?:ineffective|did(?:n't| not) (?:work|help)|was(?:n't| not) (?:working|helping)|not (?:working|helping)|no (?:benefit|effect|improvement))\b/.test(text)) return "ineffective";
  if (/\b(?:switched to|replaced (?:by|with)|changed to|instead (?:of|taking))\b/.test(text) && !/\b(?:not|never) (?:switched|replaced|changed)\b/.test(text)) return "therapy_changed";
  if (/\b(?:course (?:complete|completed|finished)|finished (?:the |my )?(?:course|antibiotics)|completed (?:the |my )?(?:course|treatment))\b/.test(text)) return "course_complete";
  if (/\b(?:chose to stop|decided to stop|did(?:n't| not) want|do(?:n't| not) want|declined|refused|patient choice)\b/.test(text)) return "patient_choice";
  if (/\b(?:because|due to|cost|too expensive|could(?:n't| not) afford|ran out|surgery|pregnan(?:t|cy)|doctor (?:said|told)|told (?:me )?to stop)\b/.test(text)) return "other";
  return undefined;
}

type Candidate = { row: MedicationRow; ownDate?: string; snapshot: Snapshot; entryId: string; group: string };

function medicationRows(snapshot: Snapshot): Candidate[] {
  const result: Candidate[] = [];
  for (const [entryId, entry] of snapshot.entries) {
    if (entry.type !== "my_med") continue;
    const name = string(entry.name);
    if (!name || !string(entry.homelog_med_id) || (entry.status !== "taking" && entry.status !== "stopped")) continue;
    const search = object(entry.picked_from_search) ? entry.picked_from_search : undefined;
    const display = search ? string(search.display) : undefined;
    const known = display ? ingredients(display, true) : [];
    const resolved = known.length ? known : ingredients(name, false);
    const taking = string(entry.how_i_take_it);
    const amount = dose(taking);
    const schedule = frequency(taking);
    const since = partialDate(entry.status === "taking" ? entry.started : entry.stopped);
    const note = string(entry.note);
    const reason = entry.status === "stopped" ? stopReason(note) : undefined;
    for (const ingredient of resolved.length ? resolved : [undefined]) {
      const row: MedicationRow = {
        drug_name: name, status: entry.status === "taking" ? "active" : "stopped",
        patient_reported: true, evidence: [{ item_id: snapshot.id, entry_id: entryId }],
      };
      if (ingredient) row.ingredient = ingredient;
      // Under this schema a bare ingredient display identifies an ingredient
      // result. Strengths, forms, brands and salts cannot establish an IN code.
      if (ingredient && display && resolved.length === 1 && normalized(display) === ingredient
        && search && typeof search.rxnorm === "string" && /^\d+$/.test(search.rxnorm)) {
        row.rxnorm_ingredient = search.rxnorm;
      }
      if (since) row.status_since = since;
      // A product's mass amount cannot be assigned to each component. A stated
      // tablet count or volume still describes the combination administration.
      if (amount && (resolved.length <= 1 || amount.unit === "tablet" || amount.unit === "mL")) row.dose = { ...amount };
      if (schedule) row.frequency = schedule;
      if (entry.kind === "over_the_counter") row.otc = true;
      if (reason) { row.stop_reason = reason; row.status_reason_text = note; }
      result.push({ row, ownDate: since ?? partialDate(entry.started), snapshot, entryId,
        // Unknown nicknames do not establish identity between separate list lines.
        group: ingredient ? `ingredient:${ingredient}` : key(snapshot.issuer, String(entry.homelog_med_id)),
      });
    }
  }
  return result;
}

function later(a: Candidate, b: Candidate): number {
  // If one partial date is a prefix of the other, their ordering is unknown;
  // preserve precision and use a stable tie-break instead of inventing a day.
  const aDate = a.ownDate ?? "";
  const bDate = b.ownDate ?? "";
  const dateOrder = aDate && bDate && (aDate.startsWith(bDate) || bDate.startsWith(aDate))
    ? 0 : compare(aDate, bDate);
  return dateOrder || a.snapshot.recorded - b.snapshot.recorded
    || compare(a.snapshot.issuer, b.snapshot.issuer) || compare(a.snapshot.id, b.snapshot.id)
    || compare(a.entryId, b.entryId);
}

/** Map only facts HomeLog can represent without supplying missing clinical context. */
export function transform(items: FolioItem[], asOf: string): ViewRows {
  const result: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string" || asOf.length !== 10 || !partialDate(asOf)) return result;
  const scoped = inScope(items, asOf);
  const removed = new Set<string>();
  const lists = new Set<string>();
  for (const item of scoped) {
    // Process links on *all* in-scope items, including superseded/retracted
    // intermediates. Thus A <- B <- C cannot resurrect A when B is withdrawn.
    for (const id of [...item.supersedes, ...item.retracts]) removed.add(key(item.issuer, id));
    if (item.entries.some(([, e]) => e.type === "my_med") || /^\s*My Medicines,\s*saved\b/i.test(item.narrative)) {
      lists.add(key(item.issuer, item.id));
    }
  }
  // An empty replacement of a medicine list is still a list snapshot. This uses
  // old items only to identify the document kind, never to recover old facts.
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of scoped) {
      const itemKey = key(item.issuer, item.id);
      if (!lists.has(itemKey) && item.entries.length === 0 && item.supersedes.some(id => lists.has(key(item.issuer, id)))) {
        lists.add(itemKey);
        changed = true;
      }
    }
  }
  const latest = new Map<string, Snapshot>();
  for (const item of scoped) {
    const itemKey = key(item.issuer, item.id);
    if (!removed.has(itemKey) && lists.has(itemKey)) latest.set(item.issuer, item);
  }
  const chosen = new Map<string, Candidate>();
  for (const snapshot of latest.values()) {
    for (const candidate of medicationRows(snapshot)) {
      const prior = chosen.get(candidate.group);
      if (!prior || later(candidate, prior) > 0) chosen.set(candidate.group, candidate);
    }
  }
  result.medications = [...chosen.values()].sort((a, b) => compare(a.group, b.group)).map(c => c.row);
  // Day-page clock values have no offset or zone. Neither a UTC sync time nor
  // the consumer's display zone establishes where the phone was. VitalRow has
  // no representation for an unknown zone, so these readings cannot be emitted.
  // HomeLog supplies no lab results, condition list, or allergy/avoidance list.
  // Symptom tags are not diagnoses; a stop note is not an allergy entry. Dose
  // logs describe isolated administrations and do not revise the medicine list.
  return result;
}
