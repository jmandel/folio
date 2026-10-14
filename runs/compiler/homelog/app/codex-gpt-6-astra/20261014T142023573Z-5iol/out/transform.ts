import type { FolioItem, ViewRows, MedicationRow, VitalRow, Evidence, Sensitivity } from "../in/views/views";

type Obj = Record<string, unknown>;
type Item = { id: string; issuer: string; recorded: number; effective?: string; narrative: string; entries: [string, Obj][]; supersedes: string[]; retracts: string[] };
const obj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string | undefined => typeof v === "string" && v.trim() ? v : undefined;
const num = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (issuer: string, id: string): string => JSON.stringify([issuer, id]);
const itemKey = (i: Item): string => key(i.issuer, i.id);
const evidence = (i: Item, id: string): Evidence => [{ item_id: i.id, entry_id: id }];

function partialDate(v: unknown): string | undefined {
  if (typeof v !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(v)) return;
  const y = Number(v.slice(0, 4));
  if (y < 1) return;
  if (v.length === 4) return v;
  const m = Number(v.slice(5, 7));
  if (m < 1 || m > 12) return;
  if (v.length === 7) return v;
  const d = Number(v.slice(8, 10));
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return d >= 1 && d <= days[m - 1] ? v : undefined;
}
const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});
function chicagoTime(ms: number): string | undefined {
  if (!Number.isFinite(ms)) return;
  try {
    const p: Record<string, string> = {};
    for (const part of chicago.formatToParts(new Date(ms))) p[part.type] = part.value;
    return `${p.year.padStart(4, "0")}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
  } catch { return; }
}
function instant(v: unknown): number | undefined {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(v)) return;
  if (!partialDate(v.slice(0, 10)) || Number(v.slice(11, 13)) > 23 || Number(v.slice(14, 16)) > 59 || Number(v.slice(17, 19)) > 59) return;
  const ms = Date.parse(v);
  return Number.isFinite(ms) ? ms : undefined;
}
function localTime(v: unknown): string | undefined {
  if (typeof v !== "string") return;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) {
    if (partialDate(v.slice(0, 10)) && Number(v.slice(11, 13)) <= 23 && Number(v.slice(14, 16)) <= 59) return v;
    return;
  }
  const ms = instant(v);
  return ms === undefined ? undefined : chicagoTime(ms);
}
function readItems(values: unknown, asOf: string): Item[] {
  if (!Array.isArray(values)) return [];
  const result: Item[] = [];
  for (const v of values) {
    if (!obj(v)) continue;
    const id = str(v.id), issuer = str(v.issuer), recorded = instant(v.recorded);
    if (!id || !issuer || recorded === undefined) continue;
    const date = chicagoTime(recorded)?.slice(0, 10);
    if (!date || date > asOf) continue;
    const entries: [string, Obj][] = [];
    if (obj(v.payload)) for (const entryId of Object.keys(v.payload).sort(cmp)) {
      const entry = v.payload[entryId];
      if (obj(entry)) entries.push([entryId, entry]);
    }
    result.push({ id, issuer, recorded, effective: str(v.effective), narrative: typeof v.narrative === "string" ? v.narrative : "", entries,
      supersedes: strings(v.supersedes), retracts: strings(v.retracts) });
  }
  return result.sort((a, b) => a.recorded - b.recorded || cmp(a.issuer, b.issuer) || cmp(a.id, b.id));
}

// All in-scope correction edges count, including those on a now-superseded item.
// Thus A <- B <- C removes both A and B, even if C is subsequently retracted.
function currentItems(items: Item[]): Item[] {
  const removed = new Set<string>();
  for (const item of items) for (const id of [...item.supersedes, ...item.retracts]) {
    if (id !== item.id) removed.add(key(item.issuer, id));
  }
  return items.filter(i => !removed.has(itemKey(i)));
}
function medicineSnapshots(items: Item[]): Set<string> {
  const ids = new Set<string>();
  for (const i of items) {
    if (i.entries.some(([, e]) => e.type === "my_med") || /^My Medicines,\s*saved\b/i.test(i.narrative.trim())) ids.add(itemKey(i));
  }
  // An empty replacement still clears the list. Narrative only identifies the
  // document kind; it never supplies a medication row.
  let changed = true;
  while (changed) {
    changed = false;
    for (const i of items) if (!ids.has(itemKey(i)) && i.entries.length === 0 && i.supersedes.some(id => ids.has(key(i.issuer, id)))) {
      ids.add(itemKey(i)); changed = true;
    }
  }
  return ids;
}

// Aliases translate names, never RxNorm codes. Product codes are not converted
// to ingredient CUIs. Unrecognized but explicit drug names can still be retained.
const brands: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin", glumetza: "metformin", fortamet: "metformin", riomet: "metformin",
  crestor: "rosuvastatin", synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", tirosint: "levothyroxine",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", forxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan", atacand: "candesartan",
  vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", capoten: "captopril",
  lopressor: "metoprolol", toprol: "metoprolol", "toprol xl": "metoprolol", coreg: "carvedilol", tenormin: "atenolol", inderal: "propranolol", bystolic: "nebivolol",
  lasix: "furosemide", demadex: "torsemide", bumex: "bumetanide", aldactone: "spironolactone", inspra: "eplerenone", kerendia: "finerenone", microzide: "hydrochlorothiazide", hctz: "hydrochlorothiazide",
  lipitor: "atorvastatin", zocor: "simvastatin", pravachol: "pravastatin", lescol: "fluvastatin", livalo: "pitavastatin", zetia: "ezetimibe",
  glipizide: "glipizide", glucotrol: "glipizide", amaryl: "glimepiride", diabeta: "glyburide", micronase: "glyburide",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", nesina: "alogliptin", actos: "pioglitazone",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide", trulicity: "dulaglutide", victoza: "liraglutide", saxenda: "liraglutide", byetta: "exenatide", bydureon: "exenatide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", admelog: "insulin lispro", lyumjev: "insulin lispro", novolog: "insulin aspart", novorapid: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  "humulin r": "insulin regular", "novolin r": "insulin regular", "humulin n": "insulin isophane", "novolin n": "insulin isophane", "nph insulin": "insulin isophane", "regular insulin": "insulin regular",
  aleve: "naproxen", naprosyn: "naproxen", advil: "ibuprofen", motrin: "ibuprofen", tylenol: "acetaminophen", paracetamol: "acetaminophen", celebrex: "celecoxib", mobic: "meloxicam", voltaren: "diclofenac",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", prevacid: "lansoprazole", pepcid: "famotidine",
  eliquis: "apixaban", xarelto: "rivaroxaban", pradaxa: "dabigatran", coumadin: "warfarin", jantoven: "warfarin", plavix: "clopidogrel", brilinta: "ticagrelor",
  proair: "albuterol", ventolin: "albuterol", proventil: "albuterol", salbutamol: "albuterol", spiriva: "tiotropium", singulair: "montelukast",
  neurontin: "gabapentin", lyrica: "pregabalin", cymbalta: "duloxetine", zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine", effexor: "venlafaxine", wellbutrin: "bupropion", remeron: "mirtazapine", desyrel: "trazodone",
  xanax: "alprazolam", ativan: "lorazepam", valium: "diazepam", klonopin: "clonazepam", abilify: "aripiprazole", seroquel: "quetiapine", risperdal: "risperidone", zyprexa: "olanzapine", latuda: "lurasidone", buspar: "buspirone",
  flomax: "tamsulosin", proscar: "finasteride", cialis: "tadalafil", viagra: "sildenafil", zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine", benadryl: "diphenhydramine",
  amoxil: "amoxicillin", zithromax: "azithromycin", keflex: "cephalexin", cipro: "ciprofloxacin", flagyl: "metronidazole", vibramycin: "doxycycline",
  imitrex: "sumatriptan", zofran: "ondansetron", fosamax: "alendronate", evista: "raloxifene", arimidex: "anastrozole", nolvadex: "tamoxifen", plaquenil: "hydroxychloroquine",
  narcan: "naloxone", subutex: "buprenorphine", vivitrol: "naltrexone", campral: "acamprosate", antabuse: "disulfiram", chantix: "varenicline",
  estrace: "estradiol", premarin: "conjugated estrogens", prometrium: "progesterone", provera: "medroxyprogesterone", "depo-provera": "medroxyprogesterone", planb: "levonorgestrel", "plan b": "levonorgestrel",
  janumet: "sitagliptin / metformin", synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin", kombiglyze: "saxagliptin / metformin",
  hyzaar: "losartan / hydrochlorothiazide", prinzide: "lisinopril / hydrochlorothiazide", zestoretic: "lisinopril / hydrochlorothiazide", lotrel: "amlodipine / benazepril", exforge: "amlodipine / valsartan", entresto: "sacubitril / valsartan",
  augmentin: "amoxicillin / clavulanate", bactrim: "sulfamethoxazole / trimethoprim", septra: "sulfamethoxazole / trimethoprim", suboxone: "buprenorphine / naloxone",
};
function plainName(s: string): string {
  return s.toLowerCase().replace(/[®™]/g, "").replace(/\s+/g, " ").trim();
}
function ingredientName(raw: string): string | undefined {
  let s = plainName(raw);
  s = s.replace(/\[[^\]]*\]/g, "").replace(/\([^)]*\)/g, "").trim();
  // Remove strength and form, but preserve ingredient numerals such as vitamin B12.
  s = s.replace(/\s+\d+(?:\.\d+)?\s*(?:mg|mcg|ug|g|units?|unt|iu|ml|%)(?:\b|$).*$/i, "");
  s = s.replace(/\s+(?:oral|tablet|tablets|capsule|capsules|solution|suspension|injection|injectable|inhaler|cream|ointment|gel|patch|pen|vial|extended.release|delayed.release|immediate.release|xr|er|xl|sr|dr|hfa|solostar|kwikpen|flextouch|flexpen)\b.*$/i, "").trim();
  if (Object.prototype.hasOwnProperty.call(brands, s)) return brands[s];
  // Salt removal only for named drug salts, not substances such as calcium carbonate.
  s = s.replace(/\s+(?:hydrochloride|hcl|hydrobromide|besylate|besilate|succinate|tartrate|maleate|fumarate|mesylate|dihydrate|monohydrate|trihydrate)\b.*$/, "");
  s = s.replace(/^(losartan|diclofenac) potassium$/, "$1")
    .replace(/^(levothyroxine|naproxen|diclofenac|warfarin|liothyronine|pravastatin) sodium$/, "$1")
    .replace(/^(rosuvastatin|atorvastatin) calcium$/, "$1");
  if (Object.prototype.hasOwnProperty.call(brands, s)) return brands[s];
  if (!s || !/[a-z]/.test(s) || /[_\d]{2,}/.test(s) && !/\b(?:vitamin|omega|b\d)/.test(s)) return;
  if (/\b(?:unknown|unspecified|unidentified|water pill|blood pressure|bp pill|sugar pill|cholesterol pill|thyroid pill|pain pill|painkiller|medicine|medication|supplement|vitamins|something|forgot|not sure)\b/.test(s)) return;
  if (/^(?:my |the |a |an )/.test(s) || /\b(?:pill|pills|blood thinner)\b/.test(s) || s === "insulin") return;
  if (!/^[a-z][a-z0-9 ,+'’-]*(?:-[a-z0-9]+)*$/.test(s)) return;
  return s;
}
type Ingredient = { name?: string; rxnorm?: string; productPart?: string };
function ingredients(e: Obj): Ingredient[] {
  const search = obj(e.picked_from_search) ? e.picked_from_search : undefined;
  const display = search ? str(search.display) : undefined;
  const raw = display || str(e.name) || "";
  // A slash before a numeric denominator is a concentration, not a second ingredient.
  const parts = raw.split(/\s*\/\s*(?=[a-zA-Z])/).filter(p => !/^(?:ml|l|actuation|dose)\b/i.test(p));
  const result: Ingredient[] = [];
  for (const part of parts) {
    const normalized = ingredientName(part);
    if (!normalized) continue;
    for (const name of normalized.split(" / ")) {
      if (result.some(r => r.name === name)) continue;
      const r: Ingredient = { name, productPart: display ? part : undefined };
      // The search result itself must describe just this ingredient. A product,
      // salt, brand or combination display never establishes an ingredient CUI.
      if (search && display && plainName(display) === name && /^\d+$/.test(str(search.rxnorm) || "")) r.rxnorm = str(search.rxnorm);
      result.push(r);
    }
  }
  if (!result.length && display && str(e.name)) {
    const name = ingredientName(e.name as string);
    if (name) for (const n of name.split(" / ")) result.push({ name: n });
  }
  return result.length ? result : [{}];
}

function directions(v: unknown): string {
  if (typeof v !== "string") return "";
  return plainName(v).replace(/[μµ]g/g, "mcg")
    .replace(/\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b/g, n => n.replace(/,/g, ""))
    .replace(/\b(\d+)\s*([½¼¾])/g, (_, whole: string, fraction: string) => String(Number(whole) + ({ "½": 0.5, "¼": 0.25, "¾": 0.75 }[fraction] || 0)))
    .replace(/\b(\d+)\s+(1\s*\/\s*2|1\s*\/\s*4|3\s*\/\s*4)\b/g, (_, whole: string, fraction: string) => {
      const [n, d] = fraction.split("/").map(Number); return String(Number(whole) + n / d);
    })
    .replace(/½/g, " 0.5 ").replace(/¼/g, " 0.25 ").replace(/¾/g, " 0.75 ")
    .replace(/\b1\s*\/\s*2\b/g, "0.5").replace(/\b1\s*\/\s*4\b/g, "0.25").replace(/\b3\s*\/\s*4\b/g, "0.75")
    .replace(/\b(?:one|two|three|four|five|six|seven|eight|nine|ten|half|quarter)\b/g,
      w => ({ one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10", half: "0.5", quarter: "0.25" }[w] || w));
}
function frequency(text: string): MedicationRow["frequency"] {
  const s = directions(text);
  if (!s) return;
  if (/\b(?:prn|p\.r\.n\.?|as needed|if needed|when needed|when necessary)\b/.test(s)) return "PRN";
  if (/\b(?:every other|alternate|most days|sometimes|occasionally|taper|as directed|sliding scale)\b/.test(s)) return "other";
  if (/\b(?:once (?:a |per )?week|weekly|every week|q\.?w\.?)\b/.test(s) && !/\b(?:twice|3 times|2 times)\b/.test(s)) return "QW";
  if (/\bevery (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.test(s)) return "QW";
  if (/\b(?:week|month|monthly|year)\b/.test(s)) return "other";
  if (/\b(?:tid|t\.i\.d|3\s*(?:times|x)\s*(?:(?:a|per) day|daily)|thrice daily|every 8 hours|q8h)\b/.test(s)) return "TID";
  if (/\b(?:bid|b\.i\.d|2\s*(?:times|x)\s*(?:(?:a|per) day|daily)|twice (?:a day|daily|per day)|every 12 hours|q12h)\b/.test(s)) return "BID";
  if (/\b(?:qid|q\.i\.d|4 times|every \d+ hours|q\d+h)\b/.test(s) && !/\b(?:every 24 hours|q24h)\b/.test(s)) return "other";
  const times = [ /\b(?:morning|breakfast|qam)\b/, /\b(?:noon|lunch|lunchtime|midday)\b/, /\b(?:supper|dinner|evening|qpm)\b/, /\b(?:bedtime|night|nightly|qhs)\b/ ];
  const schedule = s.replace(/\bevening (?:at|before) bedtime\b/g, "bedtime");
  const count = times.filter(r => r.test(schedule)).length;
  if (count > 1 && /\bor\b/.test(schedule)) return "other";
  if (count > 3) return "other";
  if (count === 3) return "TID";
  if (count === 2) return "BID";
  if (times[3].test(s)) return "QHS";
  if (count === 1 || /\b(?:qd|q\.d|daily|once a day|once per day|every day|each day|every 24 hours|q24h)\b/.test(s)) return "QD";
  if (/\b(?:times|with meals|before meals|after meals|every)\b/.test(s)) return "other";
  return;
}
type Dose = NonNullable<MedicationRow["dose"]>;
function doseQuantity(value: number, unit: string): Dose | undefined {
  if (!Number.isFinite(value) || value < 0) return;
  const u = unit.toLowerCase();
  if (/^(?:unit|units|unt|iu|\[iu\]|u)$/.test(u)) return { value, unit: "units" };
  if (u === "ml") return { value, unit: "mL" };
  if (u === "mg" || u === "mcg") return { value, unit: u };
  if ((u === "g" || u === "gram" || u === "grams") && Number.isFinite(value * 1000)) return { value: value * 1000, unit: "mg" };
  return;
}
function strength(text: string | undefined): Dose | undefined {
  if (!text) return;
  const s = directions(text);
  // Never treat a concentration, percentage, or combination strength as a tablet dose.
  if (/%|\/\s*(?:\d|ml\b|l\b)|\bper\s+(?:ml|\d)/.test(s)) return;
  const matches = [...s.matchAll(/(\d+(?:\.\d+)?)\s*(mcg|mg|g)\b/g)];
  if (matches.length !== 1) return;
  return doseQuantity(Number(matches[0][1]), matches[0][2]);
}
function dose(e: Obj, ingredient: Ingredient, combination: boolean): Dose | undefined {
  const s = directions(e.how_i_take_it);
  if (!s || /\b(?:sliding scale|variable|varies|titrate|titrating|as directed)\b/.test(s)) return;
  if (/\d+(?:\.\d+)?\s*(?:or|to|[-–])\s*\d+(?:\.\d+)?(?!\d)(?!\s*(?:times|hours|days|weeks)\b)/.test(s)) return;
  if (/\b(?:puffs?|drops?|sprays?|patch(?:es)?|apply|topical)\b/.test(s)) return;
  const tabletMatches = [...s.matchAll(/(\d+(?:\.\d+)?)\s*(?:(?:of )?(?:a|an) )?(?:tablets?|tabs?|capsules?|caps?)\b/g)];
  const tabletsWithStrength = [...s.matchAll(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*(mcg|mg|g)\s+(?:tablets?|capsules?)\b/g)];
  const amounts = [...s.matchAll(/(\d+(?:\.\d+)?)\s*(mcg|mg|ml|grams?|g|units?|unt|\[iu\]|iu|u)(?=\W|$)/g)]
    .filter(m => !/^\s*(?:\/|per\b)/.test(s.slice(m.index! + m[0].length)) && !/(?:\/|\bper)\s*$/.test(s.slice(0, m.index)));
  const scheduled = [...s.matchAll(/\b(?:morning|evening|bedtime|supper|breakfast|dinner|lunch)\s*[:=]?\s*(\d+(?:\.\d+)?)/g)].map(m => Number(m[1]));
  const beforeTime = [...s.matchAll(/\b(\d+(?:\.\d+)?)\s+(?:(?:in|at|with)\s+(?:the\s+)?)?(?:morning|evening|bedtime|supper|breakfast|dinner|lunch)\b/g)].map(m => Number(m[1]));
  let count: number | undefined;
  if (tabletMatches.length || tabletsWithStrength.length) {
    const counts = [...tabletMatches, ...tabletsWithStrength].map(m => Number(m[1]));
    counts.push(...scheduled, ...beforeTime);
    if (new Set(counts).size > 1) return;
    count = counts[0];
  } else if (amounts.length) {
    const parsed = amounts.map(m => doseQuantity(Number(m[1]), m[2]));
    if (!parsed[0] || parsed.some(p => !p || p.value !== parsed[0]!.value || p.unit !== parsed[0]!.unit)) return;
    return parsed[0];
  } else {
    const bare = s.match(/^(?:i\s+)?(?:(?:take|taking|use|inject)\s+)?(\d+(?:\.\d+)?)(?![\d.])(?=\s|$)/);
    if (bare && !/^\s*(?:times|x|days|hours|weeks)\b/.test(s.slice(bare[0].length))) count = Number(bare[1]);
    const counts = [...scheduled, ...beforeTime, ...(count === undefined ? [] : [count])];
    if (new Set(counts).size > 1) return;
    if (counts.length) count = counts[0];
  }
  // An implicit count applies to oral tablets/capsules, not insulin or liquids.
  const form = `${ingredient.name || ""} ${str(e.strength_text) || ""} ${ingredient.productPart || ""}`.toLowerCase();
  if (/\b(?:insulin|units?|ml|injection|injectable|pen|vial|solution|suspension|inhaler|cream|gel|ointment)\b/.test(form)) return;
  count ??= 1;
  // Explicit patient-entered strength wins even when a search product disagrees.
  let st: Dose | undefined;
  const written = str(e.strength_text);
  if (tabletsWithStrength.length && !combination) {
    const stated = tabletsWithStrength.map(m => doseQuantity(Number(m[2]), m[3]));
    if (stated.some(d => !d || d.value !== stated[0]?.value || d.unit !== stated[0]?.unit)) return;
    st = stated[0];
  } else if (combination) {
    // A combination's total tablet count is shared, but component mass is not.
    if (written && ingredient.name && written.toLowerCase().includes(ingredient.name)) {
      const part = written.split(/\s*\/\s*(?=[a-zA-Z])/).find(p => p.toLowerCase().includes(ingredient.name!));
      st = strength(part);
    } else if (!written) st = strength(ingredient.productPart);
  } else st = strength(written || ingredient.productPart);
  const value = count * (st?.value ?? 1);
  return Number.isFinite(value) ? { value, unit: st?.unit ?? "tablet" } : undefined;
}

function isHeld(text: string): boolean {
  const s = plainName(text);
  // Conditional future advice and explicit negation do not describe a present hold.
  let held = false;
  const clauses = s.split(/[.;,\n]|\bbut\b/);
  for (const c of clauses) {
    if (/\b(?:no longer (?:held|paused|on hold)|not on hold)\b/.test(c)) { held = false; continue; }
    if (/\b(?:if |might |may |consider |will |do not |don't |never )/.test(c)) continue;
    const holds = [...c.matchAll(/\b(?:on hold|held|paused|pausing|holding|temporarily stopped|temporarily stop|stopped temporarily|stop temporarily|stop(?:ped)? for now|off (?:it |this |the medicine )?for now|not taking (?:it )?(?:right now|for now|until)|hold (?:it |this |the medicine )?(?:until|for now)|told me to (?:hold|pause))\b/g)];
    const temporaryStop = c.match(/\b(?:stop|stopped|off|hold)\b.*\b(?:until|temporarily|for now|for a (?:few|week|month)|for \d+ days)/);
    const holdIndex = Math.max(holds.at(-1)?.index ?? -1, temporaryStop?.index ?? -1);
    const resumed = [...c.matchAll(/\b(?:restarted|resumed|back on|taking again)\b/g)].at(-1)?.index ?? -1;
    if (holdIndex >= 0 || resumed >= 0) held = holdIndex > resumed;
  }
  return held;
}
function stopReason(note: string): MedicationRow["stop_reason"] {
  // Negated effects are not reasons for stopping.
  const s = plainName(note).split(/[.;,\n]/).filter(c => !/\b(?:no side effects?|no adverse|no (?:rash|cough|nausea)|not (?:caused|due)|didn't cause|did not cause|without side effects?)\b/.test(c)).join("; ");
  if (/\b(?:side effects?|adverse|allerg|rash|hives|swelling|angioedema|cough|nausea|vomiting|diarrhea|dizzy|dizziness|stomach upset|upset stomach|muscle (?:pain|aches)|myalgia|made me|caused)\b/.test(s)) return "adverse_reaction";
  if (/\b(?:ineffective|not working|wasn't working|didn't work|did not work|not helping|didn't help|did not help|no (?:benefit|effect)|not effective)\b/.test(s)) return "ineffective";
  if (/\b(?:switched|switching|replaced|changed to|instead|new (?:medicine|medication|drug))\b/.test(s)) return "therapy_changed";
  if (/\b(?:finished|completed|complete|course ended|course over)\b/.test(s)) return "course_complete";
  if (/\b(?:didn't want|did not want|don't want|do not want|declined|chose|my choice|prefer|asked to stop|decided to stop)\b/.test(s)) return "patient_choice";
  if (/\b(?:because|due to|cost|expensive|afford|ran out|no longer need|not needed|told me to stop|doctor stopped)\b/.test(s)) return "other";
  return;
}
function statusDateFromText(text: string): string | undefined {
  const s = plainName(text);
  const matches = [...s.matchAll(/\b(?:since|on|from|as of|stopped|held|paused)\s+(\d{4}(?:-\d{2}(?:-\d{2})?)?)\b/g)];
  for (let i = matches.length - 1; i >= 0; i--) {
    const d = partialDate(matches[i][1]);
    if (d) return d;
  }
  return;
}
function sensitivities(ingredient: string | undefined): Sensitivity[] | undefined {
  if (!ingredient) return;
  if (/^(?:sertraline|fluoxetine|escitalopram|citalopram|paroxetine|venlafaxine|desvenlafaxine|mirtazapine|buspirone|aripiprazole|quetiapine|risperidone|olanzapine|lurasidone|clozapine)$/.test(ingredient)) return ["mental-health"];
  if (/^(?:acamprosate|disulfiram)$/.test(ingredient)) return ["substance-use"];
  // Other drugs with several indications do not establish a sensitive condition.
  return;
}
function medicationRows(all: Item[], current: Item[]): MedicationRow[] {
  const snapshots = medicineSnapshots(all);
  const snapshot = current.filter(i => snapshots.has(itemKey(i))).at(-1);
  if (!snapshot) return [];
  const latest = new Map<string, { row: MedicationRow; event: string; entry: string }>();
  for (const [entryId, e] of snapshot.entries) {
    if (e.type !== "my_med" || !str(e.name)) continue;
    const name = e.name as string;
    const note = str(e.note), how = str(e.how_i_take_it);
    const held = isHeld(`${note || ""}; ${how || ""}`);
    const status: MedicationRow["status"] = held ? "held" : e.status === "taking" ? "active" : e.status === "stopped" ? "stopped" : "unknown";
    const since = status === "active" ? partialDate(e.started) : status === "held" || status === "stopped" ? partialDate(e.stopped) || statusDateFromText(note || "") : undefined;
    const reason = status === "stopped" && note ? stopReason(note) : undefined;
    const parts = ingredients(e);
    for (const part of parts) {
      const row: MedicationRow = { drug_name: name, status, patient_reported: true, evidence: evidence(snapshot, entryId) };
      if (part.name) row.ingredient = part.name;
      if (part.rxnorm) row.rxnorm_ingredient = part.rxnorm;
      if (since) row.status_since = since;
      const amount = dose(e, part, parts.length > 1);
      if (amount) row.dose = amount;
      const freq = frequency(how || "");
      if (freq) row.frequency = freq;
      if (reason) row.stop_reason = reason;
      if ((status === "held" || status === "stopped") && note && (held || reason || /\b(?:stop|stopped|hold|held|pause|paused|discontinued)\b/i.test(note))) row.status_reason_text = note;
      else if (status === "held" && how && isHeld(how)) row.status_reason_text = how;
      if (e.kind === "over_the_counter") row.otc = true;
      const sensitive = sensitivities(part.name);
      if (sensitive) row.sensitivity = sensitive;
      // Dated starts/stops disambiguate stopped and restarted lines of one drug.
      // An undated line is only known at this save; ties use the entry id.
      const event = since || chicagoTime(snapshot.recorded)!.slice(0, 10);
      const group = part.name || `unknown:${str(e.homelog_med_id) || entryId}`;
      const previous = latest.get(group);
      if (!previous || cmp(event, previous.event) > 0 || event === previous.event && cmp(entryId, previous.entry) > 0) latest.set(group, { row, event, entry: entryId });
    }
  }
  return [...latest.values()].map(v => v.row).sort((a, b) => cmp(a.ingredient || a.drug_name, b.ingredient || b.drug_name) || cmp(a.evidence[0].entry_id || "", b.evidence[0].entry_id || ""));
}

type Reading = { row: VitalRow; kind: "bp" | "glucose"; method: "device" | "typed" | "unknown"; minute: number; issuer: string; id: string; arm?: string; marker?: string; rawValue?: number; rawUnit?: string };
function readings(current: Item[]): Reading[] {
  const result: Reading[] = [];
  for (const item of current) for (const [entryId, e] of item.entries) {
    if (e.type !== "bp_reading" && e.type !== "glucose_reading") continue;
    const time = localTime(e.measured_at);
    if (!time) continue;
    const row: VitalRow = { setting: "home", local_time: time, evidence: evidence(item, entryId) };
    const r: Reading = { row, kind: e.type === "bp_reading" ? "bp" : "glucose", method: "unknown", minute: Date.parse(`${time}:00Z`) / 60000, issuer: item.issuer, id: key(item.id, entryId) };
    if (e.type === "bp_reading") {
      if (!num(e.systolic_mmhg) || !num(e.diastolic_mmhg)) continue;
      row.systolic_mmhg = e.systolic_mmhg; row.diastolic_mmhg = e.diastolic_mmhg;
      if (num(e.pulse_bpm)) row.pulse_bpm = e.pulse_bpm;
      if (e.entry_method === "cuff_sync") r.method = "device";
      if (e.arm === "left" || e.arm === "right") r.arm = e.arm;
    } else {
      if (!num(e.value) || (e.unit !== "mg/dL" && e.unit !== "mmol/L")) continue;
      if (e.out_of_range !== undefined && e.out_of_range !== "HI" && e.out_of_range !== "LO") continue;
      const value = Math.round(e.value * (e.unit === "mmol/L" ? 18.016 : 1));
      if (!Number.isFinite(value)) continue;
      row.glucose_mg_dl = value;
      if (e.out_of_range === "HI" || e.out_of_range === "LO") row.glucose_out_of_range = e.out_of_range;
      if (e.entry_method === "meter_sync") r.method = "device";
      r.rawValue = e.value; r.rawUnit = e.unit; r.marker = str(e.meal_marker);
    }
    if (e.entry_method === "typed") r.method = "typed";
    result.push(r);
  }
  return result.sort((a, b) => a.minute - b.minute || cmp(a.kind, b.kind) || cmp(a.issuer, b.issuer) || cmp(a.id, b.id));
}
function duplicate(a: Reading, b: Reading): boolean {
  if (a.issuer !== b.issuer || a.kind !== b.kind || Math.abs(a.minute - b.minute) > 2) return false;
  if (a.kind === "bp") return a.row.systolic_mmhg === b.row.systolic_mmhg && a.row.diastolic_mmhg === b.row.diastolic_mmhg
    && (a.row.pulse_bpm === undefined || b.row.pulse_bpm === undefined || a.row.pulse_bpm === b.row.pulse_bpm)
    && (!a.arm || !b.arm || a.arm === b.arm);
  return a.row.glucose_out_of_range === b.row.glucose_out_of_range && (!a.marker || !b.marker || a.marker === b.marker)
    && (a.rawUnit === b.rawUnit ? a.rawValue === b.rawValue : a.row.glucose_mg_dl === b.row.glucose_mg_dl);
}
function vitalRows(current: Item[]): VitalRow[] {
  const all = readings(current);
  const devices = all.filter(r => r.method === "device");
  const pairs: { typed: Reading; device: Reading; distance: number }[] = [];
  let start = 0;
  for (const typed of all) if (typed.method === "typed") {
    while (start < devices.length && devices[start].minute < typed.minute - 2) start++;
    for (let j = start; j < devices.length && devices[j].minute <= typed.minute + 2; j++) {
      const device = devices[j];
      if (duplicate(typed, device)) pairs.push({ typed, device, distance: Math.abs(typed.minute - device.minute) });
    }
  }
  pairs.sort((a, b) => a.distance - b.distance || cmp(a.typed.id, b.typed.id) || cmp(a.device.id, b.device.id));
  const removed = new Set<Reading>(), used = new Set<Reading>();
  for (const { typed, device } of pairs) {
    if (removed.has(typed) || used.has(device)) continue;
    removed.add(typed); used.add(device);
    device.row.evidence.push(...typed.row.evidence);
  }
  return all.filter(r => !removed.has(r)).map(r => r.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (typeof asOf !== "string" || asOf.length !== 10 || !partialDate(asOf)) return empty;
  const scoped = readItems(items, asOf);
  const current = currentItems(scoped);
  return { medications: medicationRows(scoped, current), problems: [], allergies: [], labs: [], vitals: vitalRows(current) };
}
