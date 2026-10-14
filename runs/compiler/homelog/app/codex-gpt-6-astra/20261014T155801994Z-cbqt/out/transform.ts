import type { FolioItem, ViewRows, MedicationRow, VitalRow, Sensitivity } from "../in/views/views";

// The source has no diagnosis, allergy-list, or laboratory-result entry type.
// Diary symptom tags are not diagnoses, and dose logs are not medication-list updates.
type ObjectValue = Record<string, unknown>;
const object = (v: unknown): v is ObjectValue => v !== null && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): string | undefined => typeof v === "string" && v.trim() ? v : undefined;
const number = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
const empty = (): ViewRows => ({ medications: [], problems: [], allergies: [], labs: [], vitals: [] });

function partialDate(v: unknown): string | undefined {
  if (typeof v !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(v)) return;
  const [y, m, d] = v.split("-").map(Number);
  if (y < 1 || (m !== undefined && (m < 1 || m > 12))) return;
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (d !== undefined && (d < 1 || d > days[m - 1])) return;
  return v;
}

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function chicagoTime(ms: number): string {
  const p: Record<string, string> = {};
  for (const part of chicago.formatToParts(new Date(ms))) p[part.type] = part.value;
  return `${p.year.padStart(4, "0")}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}

type Time = { local: string; instant: number; wall: number };
function time(v: unknown): Time | undefined {
  if (typeof v !== "string") return;
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})?$/i.exec(v);
  if (!m || !partialDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] ?? 0) > 59) return;
  const wallText = `${m[1]}T${m[2]}:${m[3]}:${m[4] ?? "00"}${m[5] ?? ""}`;
  const originalWall = Date.parse(wallText + "Z");
  if (!Number.isFinite(originalWall)) return;
  if (m[6]) {
    const instant = Date.parse(wallText + m[6]);
    if (!Number.isFinite(instant)) return;
    const local = chicagoTime(instant).slice(0, 16);
    return { local, instant, wall: Date.parse(local + ":00Z") };
  }
  // Offset-free times stay exactly on the phone's wall clock. The instant is
  // only a deterministic ordering aid; readings use local/wall, never a shift.
  let instant = originalWall;
  for (let i = 0; i < 3; i++) {
    const offset = Date.parse(chicagoTime(instant) + "Z") - Math.floor(instant / 1000) * 1000;
    instant = originalWall - offset;
  }
  return { local: v.slice(0, 16), instant, wall: originalWall };
}

type Item = { raw: ObjectValue; id: string; issuer: string; key: string; recorded: Time };
const itemKey = (issuer: string, id: string): string => JSON.stringify([issuer, id]);

function countingItems(input: FolioItem[], asOf: string): Item[] {
  const eligible: Item[] = [];
  for (const raw of input) {
    if (!object(raw) || !text(raw.id) || !text(raw.issuer)) continue;
    const recorded = time(raw.recorded);
    if (!recorded || recorded.local.slice(0, 10) > asOf) continue;
    eligible.push({ raw, id: raw.id, issuer: raw.issuer, key: itemKey(raw.issuer, raw.id), recorded });
  }
  eligible.sort((a, b) => b.recorded.instant - a.recorded.instant || compare(b.key, a.key));
  const byKey = new Map(eligible.map(item => [item.key, item]));
  const incoming = new Map<string, number>([...byKey.keys()].map(key => [key, 0]));
  const references = (item: Item): string[] => [...new Set([...strings(item.raw.supersedes), ...strings(item.raw.retracts)]
    .map(id => itemKey(item.issuer, id)).filter(key => byKey.has(key)))];
  for (const item of byKey.values()) for (const key of references(item)) incoming.set(key, incoming.get(key)! + 1);
  const queue = eligible.filter(item => incoming.get(item.key) === 0);
  const excluded = new Set<string>();
  const live: Item[] = [];
  // Process referrers before their targets, even when commit timestamps tie.
  // A retracted item never existed, so it cannot itself remove another item.
  // Supersession, however, is transitive. Unreadable cycles have no roots.
  const processed = new Set<string>();
  for (let index = 0; index < queue.length; index++) {
    const item = queue[index];
    if (processed.has(item.key)) continue;
    processed.add(item.key);
    for (const key of references(item)) {
      incoming.set(key, incoming.get(key)! - 1);
      if (incoming.get(key) === 0) queue.push(byKey.get(key)!);
    }
    if (excluded.has(item.key)) continue;
    live.push(item);
    const stack = strings(item.raw.supersedes).map(id => itemKey(item.issuer, id));
    const visited = new Set<string>();
    while (stack.length) {
      const key = stack.pop()!;
      if (visited.has(key)) continue;
      visited.add(key);
      excluded.add(key);
      const old = byKey.get(key);
      if (old) for (const id of strings(old.raw.supersedes)) stack.push(itemKey(old.issuer, id));
    }
    for (const id of strings(item.raw.retracts)) excluded.add(itemKey(item.issuer, id));
  }
  // Also guards malformed cycles or backwards references without throwing.
  const seen = new Set<string>();
  return live.filter(item => !excluded.has(item.key) && !seen.has(item.key) && !!seen.add(item.key));
}

function entries(item: Item): [string, ObjectValue][] {
  if (!object(item.raw.payload)) return [];
  return Object.entries(item.raw.payload).filter((p): p is [string, ObjectValue] => object(p[1]))
    .sort((a, b) => compare(a[0], b[0]));
}

// Name aliases are spelling/brand normalization only, never code lookups.
const aliases: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin", hctz: "hydrochlorothiazide",
  "glucophage xr": "metformin", glumetza: "metformin", fortamet: "metformin", crestor: "rosuvastatin",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", tirosint: "levothyroxine",
  farxiga: "dapagliflozin", forxiga: "dapagliflozin", jardiance: "empagliflozin",
  glucotrol: "glipizide", "glucotrol xl": "glipizide", amaryl: "glimepiride",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide",
  mounjaro: "tirzepatide", zepbound: "tirzepatide", trulicity: "dulaglutide", victoza: "liraglutide",
  aleve: "naproxen", naprosyn: "naproxen", advil: "ibuprofen", motrin: "ibuprofen", tylenol: "acetaminophen",
  paracetamol: "acetaminophen", lipitor: "atorvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan",
  lopressor: "metoprolol", toprol: "metoprolol", "toprol xl": "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  lasix: "furosemide", bumex: "bumetanide", aldactone: "spironolactone", microzide: "hydrochlorothiazide",
  ventolin: "albuterol", "ventolin hfa": "albuterol", proair: "albuterol", "proair hfa": "albuterol",
  proventil: "albuterol", salbutamol: "albuterol", flovent: "fluticasone", pulmicort: "budesonide",
  spiriva: "tiotropium", atrovent: "ipratropium", singulair: "montelukast",
  pepcid: "famotidine", prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole",
  zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine", benadryl: "diphenhydramine",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", lyumjev: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart",
  "humulin r": "insulin regular", "novolin r": "insulin regular", "humulin n": "insulin isophane",
  "novolin n": "insulin isophane", "nph insulin": "insulin isophane",
  seroquel: "quetiapine", abilify: "aripiprazole", risperdal: "risperidone", zyprexa: "olanzapine",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram",
  paxil: "paroxetine", cymbalta: "duloxetine", effexor: "venlafaxine", wellbutrin: "bupropion",
  remeron: "mirtazapine", desyrel: "trazodone", depakote: "divalproex", lamictal: "lamotrigine",
  xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam",
  suboxone: "buprenorphine / naloxone", subutex: "buprenorphine", vivitrol: "naltrexone",
  antabuse: "disulfiram", campral: "acamprosate", narcan: "naloxone",
  truvada: "emtricitabine / tenofovir disoproxil", descovy: "emtricitabine / tenofovir alafenamide",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide",
  keflex: "cephalexin", amoxil: "amoxicillin", augmentin: "amoxicillin / clavulanic acid",
  bactrim: "sulfamethoxazole / trimethoprim", septra: "sulfamethoxazole / trimethoprim",
  zithromax: "azithromycin", cipro: "ciprofloxacin", levaquin: "levofloxacin",
  coumadin: "warfarin", eliquis: "apixaban", xarelto: "rivaroxaban", plavix: "clopidogrel",
  imdur: "isosorbide mononitrate", neurontin: "gabapentin", lyrica: "pregabalin",
  flomax: "tamsulosin", proscar: "finasteride", fosamax: "alendronate", deltasone: "prednisone",
  "vitamin d3": "cholecalciferol", "vitamin d2": "ergocalciferol", "vitamin b12": "cyanocobalamin",
  "vitamin c": "ascorbic acid", "folic acid": "folic acid",
  symbicort: "budesonide / formoterol", advair: "fluticasone / salmeterol",
  janumet: "sitagliptin / metformin", synjardy: "empagliflozin / metformin",
  entresto: "sacubitril / valsartan", hyzaar: "losartan / hydrochlorothiazide",
  zestoretic: "lisinopril / hydrochlorothiazide", prinzide: "lisinopril / hydrochlorothiazide",
};

function cleanName(s: string): string | undefined {
  let n = s.toLowerCase().replace(/[®™]/g, "").replace(/\[[^\]]*\]/g, "").trim();
  // Search displays give generic names even when the patient's name is a brand.
  n = n.replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|ug|µg|μg|g|ml|iu|units?|%|milligrams?|micrograms?)\b.*$/i, "")
    .replace(/\b(?:oral|tablet|tablets|capsule|capsules|solution|suspension|injection|injectable|inhaler|cream|ointment|patch|pen|prefilled|extended[- ]release|delayed[- ]release|immediate[- ]release|er|xr|sr|xl|hfa|diskus|flexpen|kwikpen|solostar)\b.*$/, "")
    .replace(/\([^)]*\)/g, "").trim();
  if (Object.prototype.hasOwnProperty.call(aliases, n)) return aliases[n];
  n = n.replace(/\b(?:hydrochloride|hcl|hydrobromide|hbr|besylate|besilate|maleate|mesylate|tartrate|succinate|fumarate|trihydrate|dihydrate|monohydrate|sulfate|sulphate|phosphate)\b/g, "")
    .replace(/\b(rosuvastatin|atorvastatin) calcium\b/g, "$1")
    .replace(/\b(levothyroxine|naproxen|diclofenac|pravastatin) sodium\b/g, "$1")
    .replace(/\b(losartan|diclofenac) potassium\b/g, "$1").replace(/\s+/g, " ").trim();
  if (Object.prototype.hasOwnProperty.call(aliases, n)) return aliases[n];
  if (!n || /\d/.test(n) || /\b(?:pill|medicine|medication|unknown|unidentified|unnamed|water|blood pressure|diabetes|thyroid|cholesterol|painkiller)\b/.test(n) || /^(?:insulin|vitamin|supplement|antibiotic|inhaler|my\b)/.test(n) && !/^insulin (?:glargine|lispro|aspart|detemir|degludec|regular|isophane)\b/.test(n)) return;
  return n;
}

type DrugPart = { ingredient?: string; code?: string; strength?: string };
function drugParts(entry: ObjectValue): DrugPart[] {
  const picked = object(entry.picked_from_search) ? entry.picked_from_search : undefined;
  const display = picked && text(picked.display);
  const source = display || text(entry.name) || "";
  // Split combination displays only at ingredient separators, not at mg/mL.
  const chunks = source.split(/\s*\/\s*(?!(?:ml|mg|mcg|ug|g|l|actuat(?:ion)?s?|puffs?|doses?|tablets?|capsules?|h)\b)(?=[a-zA-Z])|\s*\+\s*(?=[a-zA-Z])/i);
  const result: DrugPart[] = [];
  for (const chunk of chunks) {
    const normalized = cleanName(chunk);
    const names = normalized?.split(" / ") ?? [undefined];
    for (const ingredient of names) {
      const part: DrugPart = { ingredient };
      // Only a display that itself names just the ingredient supports an IN
      // code. A product or salt-specific concept cannot supply this field.
      if (display && ingredient && display.trim().toLowerCase() === ingredient && text(picked?.rxnorm)) part.code = text(picked?.rxnorm);
      part.strength = chunks.length > 1 ? chunk : text(entry.strength_text) || display || text(entry.name);
      if (names.length > 1) part.strength = undefined; // no unambiguous component strengths
      result.push(part);
    }
  }
  return result;
}

function words(s: string): string {
  return s.toLowerCase().replace(/[µμ]/g, "u").replace(/[–—]/g, "-")
    .replace(/½/g, "0.5").replace(/¼/g, "0.25").replace(/¾/g, "0.75")
    .replace(/\bone and (?:a |one )?half\b/g, "1.5").replace(/\b(?:a |one )?half (?:of )?(?:a |one )?/g, "0.5 ")
    .replace(/\b(\d+)\s*\/\s*(\d+)\b/g, (_, a: string, b: string) => +b ? String(+a / +b) : "?")
    .replace(/\b(one|two|three|four|five|six|half|a half|quarter)\b/g, w => ({ one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", half: "0.5", "a half": "0.5", quarter: "0.25" })[w]!);
}

function frequency(direction: string): MedicationRow["frequency"] {
  const d = words(direction);
  if (/\b(?:as needed|when needed|prn|p\.r\.n\.)\b/.test(d)) return "PRN";
  if (/\b(?:every other|alternate days|most days|monthly|every month|taper|4 times|four times|qid|q6h|every 6 hours|twice weekly|2 times (?:a |per )?week)\b/.test(d)) return "other";
  if (/\b(?:once (?:a |per )?week|weekly|qw|every week|every (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/.test(d)) return "QW";
  if (/\b(?:tid|t\.i\.d|3 times (?:a |per )?day|three times daily|every 8 hours|q8h|3 times daily|3\s*x\s*(?:daily|\/\s*day))\b/.test(d)) return "TID";
  if (/\b(?:bid|b\.i\.d|twice (?:a |per )?day|twice daily|2 times (?:a |per )?day|2 times daily|every 12 hours|q12h|2\s*x\s*(?:daily|\/\s*day))\b/.test(d)) return "BID";
  const morning = /\b(?:morning|breakfast|am)\b/.test(d);
  const noon = /\b(?:noon|lunch|midday)\b/.test(d);
  const evening = /\b(?:evening|supper|dinner|bedtime|night|pm)\b/.test(d);
  if (+morning + +noon + +evening === 3) return "TID";
  if (+morning + +noon + +evening === 2) return "BID";
  if (/\b(?:bedtime|qhs|nightly|at night)\b/.test(d)) return "QHS";
  if (/\b(?:daily|every day|once (?:a |per )?day|qd|qday|q24h|every 24 hours|qam|qpm)\b/.test(d) || morning || noon || evening) return "QD";
  if (/\b(?:every|times|weekly|week|month|day|hour|taper)\b/.test(d)) return "other";
  return;
}

type Dose = NonNullable<MedicationRow["dose"]>;
const unitPattern = "(?:milligrams?|micrograms?|mcg|ug|mg|grams?|g|international units?|units?|iu|u|millilit(?:er|re)s?|ml|cc|tablets?|tabs?|capsules?|caps?|puffs?|actuations?)";
function unitDose(value: number, unit: string): Dose | undefined {
  if (!Number.isFinite(value) || value <= 0) return;
  if (/^(?:mg|milligram)/.test(unit)) return { value, unit: "mg" };
  if (/^(?:mcg|ug|microgram)/.test(unit)) return { value, unit: "mcg" };
  if (/^(?:g|gram)$/.test(unit) || unit === "grams") return { value: value * 1000, unit: "mg" };
  if (/^(?:u|iu|international)/.test(unit)) return { value, unit: "units" };
  if (/^(?:ml|cc|millilit)/.test(unit)) return { value, unit: "mL" };
  if (/^(?:tab|cap)/.test(unit)) return { value, unit: "tablet" };
  return;
}

function dose(direction: string | undefined, strength: string | undefined): Dose | undefined {
  if (!direction) return;
  const d = words(direction);
  if (/\d\s*(?:-|to|or)\s*\d|\b(?:sliding|scale|depending|depends|titrate|taper|adjust|otherwise|extra|up to|vary|varies|variable|if|unless)\b/.test(d)) return;
  const amounts = [...d.matchAll(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${unitPattern})\\b`, "g"))];
  if (amounts.some(m => /\d\s*(?:or|to|-)\s*$/.test(d.slice(0, m.index)))) return;
  const direct = amounts.filter(m => !/^(?:tab|cap|puff|actuation)/.test(m[2]));
  const counts = amounts.filter(m => /^(?:tab|cap|puff|actuation)/.test(m[2]));
  if (counts.some(m => +m[1] !== +counts[0][1])) return;
  if (direct.length) {
    const values = direct.map(m => unitDose(+m[1], m[2]));
    if (values.some(v => !v || v.value !== values[0]?.value || v.unit !== values[0]?.unit)) return;
    const perUnit = /\b\d+(?:\.\d+)?\s+(?:of (?:the )?)?\d+(?:\.\d+)?\s*(?:mg|mcg|ug)\s*(?:tab|cap)/.exec(d);
    if (perUnit && values[0]) return { value: values[0].value * +perUnit[0].split(/\s/)[0], unit: values[0].unit };
    if (counts.length && values[0] && (values[0].unit === "mg" || values[0].unit === "mcg") &&
      /\b(?:each|apiece)\b|\b(?:tablets?|tabs?|capsules?|caps?)\s+(?:of|at)\s+\d/.test(d) && !/\btotal\b/.test(d)) {
      return { value: values[0].value * +counts[0][1], unit: values[0].unit };
    }
    return values[0];
  }
  let count: number | undefined;
  let countKind: string | undefined;
  if (counts.length) {
    count = +counts[0][1]; countKind = counts[0][2];
    if (counts.some(m => +m[1] !== count || m[2] !== countKind)) return;
  } else {
    const implied = [...d.matchAll(/(?:^|[,;]|\b(?:take|taking|use|and))\s*(\d+(?:\.\d+)?)(?=\s+(?:each|every|in|at|with|before|after|daily|twice|once|morning|evening|night|for|a day|per day|bid|tid|qhs|qd))/g)];
    if (implied.length) {
      count = +implied[0][1];
      if (implied.some(m => +m[1] !== count)) return;
    } else if (frequency(direction) && !/\b(?:if|unless)\b/.test(d)) count = 1;
  }
  if (count === undefined || count <= 0 || /\b(?:if|unless)\b/.test(d)) return;
  const s = words(strength ?? "");
  const sm = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${unitPattern})\\b`).exec(s);
  if (sm) {
    const strengthDose = unitDose(+sm[1], sm[2]);
    const after = s.slice(sm.index + sm[0].length);
    // A concentration in a pen/bottle is not the amount administered.
    const concentration = /^\s*(?:\/|per\b)\s*(?:\d+(?:\.\d+)?\s*)?(?:ml|l)\b/.test(after);
    if (strengthDose && !concentration && (strengthDose.unit === "mg" || strengthDose.unit === "mcg")) {
      const value = Number((strengthDose.value * count).toPrecision(12));
      if (Number.isFinite(value)) return { value, unit: strengthDose.unit };
    }
  }
  if (countKind && /^(?:tab|cap)/.test(countKind)) return { value: count, unit: "tablet" };
  return;
}

function medicationState(e: ObjectValue): Pick<MedicationRow, "status" | "status_since" | "status_reason_text" | "stop_reason"> {
  const note = text(e.note);
  const directions = text(e.how_i_take_it);
  const context = [note, directions].filter(Boolean).join("; ");
  const n = context.toLowerCase();
  let status: MedicationRow["status"] = e.status === "taking" ? "active" : e.status === "stopped" ? "stopped" : "unknown";
  const hold = /\b(?:on hold|held|holding|hold(?:ing)? (?:it|this|until|for|since)|paused?|taking a break|temporarily (?:stopped|off|not taking|discontinued)|stopped (?:it )?(?:for now|temporarily|until|for the time being|for the moment)|not taking (?:it )?(?:right now|now|until|while|for now)|off (?:it )?(?:until|temporarily|during))\b/g;
  const resumed = /\b(?:resumed|restarted|back on|taking (?:it )?again)\b/g;
  const lastHold = [...n.matchAll(hold)].filter(m => !/\b(?:not|never|no longer)\s*$/.test(n.slice(Math.max(0, m.index! - 20), m.index))).pop()?.index ?? -1;
  const lastResume = [...n.matchAll(resumed)].pop()?.index ?? -1;
  if (lastHold > lastResume) status = "held";
  const result: ReturnType<typeof medicationState> = { status };
  let since = status === "active" ? partialDate(e.started) : status === "stopped" || e.status === "stopped" ? partialDate(e.stopped) : undefined;
  const dateEvent = status === "held" ? /\b(?:held|hold|holding|paused?|stopped)\s+(?:(?:since|on|from)\s+)?(\d{4}(?:-\d{2}(?:-\d{2})?)?)(?![\d-])/i
    : status === "stopped" ? /\b(?:stopped|discontinued)\b[^.;\n]*?\b(?:since|on|from)\s+(\d{4}(?:-\d{2}(?:-\d{2})?)?)(?![\d-])/i
    : /\b(?:resumed|restarted|started)\s+(?:on |since )?(\d{4}(?:-\d{2}(?:-\d{2})?)?)(?![\d-])/i;
  const dateMatch = dateEvent.exec(context);
  if (dateMatch && partialDate(dateMatch[1])) since = dateMatch[1];
  if (since) result.status_since = since;
  if (note && (status === "stopped" || status === "held" || /\b(?:because|due to|resumed|restarted)\b/.test(note.toLowerCase()))) result.status_reason_text = note;
  else if (directions && status === "held") result.status_reason_text = directions;
  if (status === "stopped" && note) {
    if (/\b(?:side effects?|adverse|allerg|rash|hives|nausea|vomit|diarrh|dizz|cough|swelling|made me|caused|stomach upset|upset (?:my )?stomach)\w*\b/.test(n) && !/\b(?:no|without) (?:side effects?|rash|nausea)\b/.test(n)) result.stop_reason = "adverse_reaction";
    else if (/\b(?:did(?:n't| not) (?:work|help)|ineffective|not (?:working|helping)|no (?:benefit|effect))\b/.test(n)) result.stop_reason = "ineffective";
    else if (/\b(?:switched|replaced|changed to|instead|new regimen)\b/.test(n)) result.stop_reason = "therapy_changed";
    else if (/\b(?:finished|completed|course (?:ended|complete)|end of (?:the )?course)\b/.test(n)) result.stop_reason = "course_complete";
    else if (/\b(?:decided|chose|my choice|don't want|do not want|prefer not|on my own)\b/.test(n)) result.stop_reason = "patient_choice";
    else if (/\b(?:because|due to|cost|afford|expensive|ran out|no longer need|told me to stop)\b/.test(n)) result.stop_reason = "other";
  }
  return result;
}

function sensitivity(ingredient: string | undefined, e: ObjectValue): Sensitivity[] | undefined {
  const i = ingredient ?? "";
  const context = [text(e.note), text(e.how_i_take_it)].filter(Boolean).join(" ").toLowerCase();
  const found: Sensitivity[] = [];
  if (/\b(?:quetiapine|aripiprazole|risperidone|olanzapine|clozapine|ziprasidone|lurasidone|haloperidol|sertraline|fluoxetine|escitalopram|citalopram|paroxetine|venlafaxine|desvenlafaxine|bupropion|mirtazapine|trazodone|buspirone|alprazolam|lorazepam|clonazepam|lithium)\b/.test(i) || /\b(?:for|treat(?:ing|ment of)?) (?:my )?(?:bipolar|depression|anxiety|adhd|ptsd|schizophrenia|mental health)\b/.test(context)) found.push("mental-health");
  if (/\b(?:buprenorphine|naltrexone|acamprosate|disulfiram)\b/.test(i) || /\b(?:for|treating) (?:my )?(?:addiction|opioid use disorder|alcohol use disorder)\b/.test(context)) found.push("substance-use");
  if (/\b(?:ethinyl estradiol|norethindrone|levonorgestrel|desogestrel|etonogestrel|drospirenone|clomiphene)\b/.test(i) || /\b(?:contraception|birth control|fertility|pregnancy|for erectile dysfunction)\b/.test(context)) found.push("sexual-reproductive-health");
  if (/\b(?:bictegravir|dolutegravir|raltegravir|efavirenz|rilpivirine|emtricitabine|tenofovir|abacavir|zidovudine|darunavir|atazanavir|ritonavir)\b/.test(i) || /\b(?:for|treating) (?:my )?(?:hiv|chlamydia|gonorrhea|syphilis)\b/.test(context)) found.push("hiv-sti");
  return found.length ? found : undefined;
}

function medications(items: Item[]): MedicationRow[] {
  const lists = items.filter(item => entries(item).some(([, e]) => e.type === "my_med") ||
    (typeof item.raw.narrative === "string" && /^\s*My Medicines,\s*saved\b/i.test(item.raw.narrative)));
  // An empty saved list also replaces the whole list. Its narrative identifies
  // the snapshot, but does not itself create any rows.
  lists.sort((a, b) => compare(partialDate(b.raw.effective) ?? b.recorded.local, partialDate(a.raw.effective) ?? a.recorded.local) || b.recorded.instant - a.recorded.instant || compare(b.id, a.id));
  const list = lists[0];
  if (!list) return [];
  const rows = new Map<string, MedicationRow>();
  for (const [id, e] of entries(list)) {
    const name = text(e.name);
    if (e.type !== "my_med" || !name) continue;
    for (const part of drugParts(e)) {
      const row: MedicationRow = { drug_name: name, ...medicationState(e), patient_reported: true, evidence: [{ item_id: list.id, entry_id: id }] };
      if (part.ingredient) row.ingredient = part.ingredient;
      if (part.code) row.rxnorm_ingredient = part.code;
      const d = dose(text(e.how_i_take_it), part.strength);
      if (d && Number.isFinite(d.value)) row.dose = d;
      const f = text(e.how_i_take_it) ? frequency(e.how_i_take_it as string) : undefined;
      if (f) row.frequency = f;
      if (e.kind === "over_the_counter") row.otc = true;
      const sensitive = sensitivity(part.ingredient, e);
      if (sensitive) row.sensitivity = sensitive;
      const key = part.ingredient ? `ingredient:${part.ingredient}` : `unknown:${text(e.homelog_med_id) ?? id}`;
      // For conflicting duplicate entries on an own list, the contract permits
      // either entry. Pick a stable entry-id order, without merging regimens.
      if (!rows.has(key)) rows.set(key, row);
    }
  }
  return [...rows.values()].sort((a, b) => compare(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name) || compare(a.drug_name, b.drug_name));
}

type Reading = { row: VitalRow; kind: "bp" | "glucose"; device: boolean; typed: boolean; wall: number; arm?: string };
function vitals(items: Item[]): VitalRow[] {
  const readings: Reading[] = [];
  for (const item of items) for (const [id, e] of entries(item)) {
    if (e.type !== "bp_reading" && e.type !== "glucose_reading") continue;
    const measured = time(e.measured_at);
    if (!measured) continue;
    const row: VitalRow = { setting: "home", local_time: measured.local, evidence: [{ item_id: item.id, entry_id: id }] };
    if (e.type === "bp_reading") {
      if (!number(e.systolic_mmhg) || !number(e.diastolic_mmhg)) continue;
      row.systolic_mmhg = e.systolic_mmhg; row.diastolic_mmhg = e.diastolic_mmhg;
      if (number(e.pulse_bpm)) row.pulse_bpm = e.pulse_bpm;
    } else {
      if (!number(e.value) || (e.unit !== "mg/dL" && e.unit !== "mmol/L")) continue;
      if (e.out_of_range !== undefined && e.out_of_range !== "HI" && e.out_of_range !== "LO") continue;
      const value = Math.round(e.value * (e.unit === "mmol/L" ? 18.016 : 1));
      if (!Number.isFinite(value)) continue;
      row.glucose_mg_dl = value;
      if (e.out_of_range === "HI" || e.out_of_range === "LO") row.glucose_out_of_range = e.out_of_range;
    }
    readings.push({ row, kind: e.type === "bp_reading" ? "bp" : "glucose", device: e.entry_method === "cuff_sync" || e.entry_method === "meter_sync", typed: e.entry_method === "typed", wall: measured.wall, arm: text(e.arm) });
  }
  const identity = (r: Reading): string => JSON.stringify(r.row.evidence[0]);
  readings.sort((a, b) => a.wall - b.wall || compare(a.kind, b.kind) || compare(identity(a), identity(b)));
  const devices = readings.filter(r => r.device);
  const omitted = new Set<Reading>();
  for (const typed of readings.filter(r => r.typed)) {
    const matches = devices.filter(device => {
      const delta = typed.wall - device.wall;
      if (device.kind !== typed.kind || delta < 0 || delta > 120000) return false;
      const a = device.row, b = typed.row;
      if (typed.kind === "glucose") return a.glucose_mg_dl === b.glucose_mg_dl && a.glucose_out_of_range === b.glucose_out_of_range;
      return a.systolic_mmhg === b.systolic_mmhg && a.diastolic_mmhg === b.diastolic_mmhg &&
        (a.pulse_bpm === undefined || b.pulse_bpm === undefined || a.pulse_bpm === b.pulse_bpm) &&
        (!device.arm || !typed.arm || device.arm === typed.arm);
    }).sort((a, b) => b.wall - a.wall || compare(identity(a), identity(b)));
    if (matches[0]) {
      matches[0].row.evidence.push(...typed.row.evidence);
      omitted.add(typed);
    }
  }
  return readings.filter(r => !omitted.has(r)).map(r => r.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows = empty();
  if (!Array.isArray(items) || !partialDate(asOf) || asOf.length !== 10) return rows;
  const live = countingItems(items, asOf);
  rows.medications = medications(live);
  rows.vitals = vitals(live);
  return rows;
}
