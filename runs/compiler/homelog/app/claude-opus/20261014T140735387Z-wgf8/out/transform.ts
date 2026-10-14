import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  VitalRow,
  Sensitivity,
  Evidence,
} from "../in/views/views";

// ───────────────────────────── time helpers ─────────────────────────────

/** Day of month of the n-th (1-based) Sunday of a month (month 0-based), UTC calendar. */
function nthSunday(year: number, month: number, n: number): number {
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  return 1 + ((7 - firstDow) % 7) + (n - 1) * 7;
}

function lastSunday(year: number, month: number): number {
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const dow = new Date(Date.UTC(year, month, days)).getUTCDay();
  return days - dow;
}

/** Is the given Chicago-local wall time (as ms of a fake-UTC timestamp) in daylight time? */
function chicagoIsDstLocal(y: number, mo: number, d: number, h: number): boolean {
  let startM: number, startD: number, endM: number, endD: number;
  if (y >= 2007) {
    startM = 2; startD = nthSunday(y, 2, 2);
    endM = 10; endD = nthSunday(y, 10, 1);
  } else {
    startM = 3; startD = nthSunday(y, 3, 1);
    endM = 9; endD = lastSunday(y, 9);
  }
  const key = (m: number, dd: number, hh: number) => (m * 100 + dd) * 100 + hh;
  const k = key(mo, d, h);
  return k >= key(startM, startD, 2) && k < key(endM, endD, 2);
}

/** UTC offset hours for Chicago at a local wall time (negative): -5 in CDT, -6 in CST. */
function chicagoOffsetForLocal(y: number, mo: number, d: number, h: number): number {
  return chicagoIsDstLocal(y, mo, d, h) ? -5 : -6;
}

/** UTC ms at the end of the given local Chicago date (i.e. start of the next local day). */
function endOfChicagoDay(asOf: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(asOf || "");
  if (!m) return Number.POSITIVE_INFINITY;
  const y = +m[1], mo = +m[2] - 1, d = +m[3];
  const next = new Date(Date.UTC(y, mo, d + 1));
  const ny = next.getUTCFullYear(), nmo = next.getUTCMonth(), nd = next.getUTCDate();
  const off = chicagoOffsetForLocal(ny, nmo, nd, 0);
  return Date.UTC(ny, nmo, nd, 0, 0) - off * 3600e3;
}

/** Chicago local `YYYY-MM-DDTHH:MM` for a UTC instant. */
function chicagoLocalFromInstant(ms: number): string {
  // Try CST, then check whether that local time is in DST.
  for (const off of [-6, -5]) {
    const t = new Date(ms + off * 3600e3);
    const y = t.getUTCFullYear(), mo = t.getUTCMonth(), d = t.getUTCDate(), h = t.getUTCHours();
    const isDst = chicagoIsDstLocal(y, mo, d, h);
    if ((off === -5) === isDst) return t.toISOString().slice(0, 16);
  }
  return new Date(ms - 6 * 3600e3).toISOString().slice(0, 16);
}

/** Normalize a HomeLog wall-clock time to `YYYY-MM-DDTHH:MM` (taken as Chicago local). */
function localTime(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim().replace(" ", "T");
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/.exec(s);
  if (!m) return undefined;
  if (m[4]) {
    const ms = Date.parse(s);
    if (isNaN(ms)) return undefined;
    return chicagoLocalFromInstant(ms);
  }
  return `${m[1]}T${m[2]}:${m[3]}`;
}

function minutesOf(lt: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(lt);
  if (!m) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) / 60000;
}

function partialDate(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (/^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/.test(s)) return s;
  return undefined;
}

// ───────────────────────────── item selection ─────────────────────────────

interface ScopedItem {
  item: FolioItem;
  recordedMs: number;
}

function currentItems(items: FolioItem[], asOf: string): ScopedItem[] {
  const end = endOfChicagoDay(asOf);
  const scoped: ScopedItem[] = [];
  for (const it of Array.isArray(items) ? items : []) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const ms = typeof it.recorded === "string" ? Date.parse(it.recorded) : NaN;
    if (isNaN(ms) || ms >= end) continue;
    scoped.push({ item: it, recordedMs: ms });
  }
  const dead = new Set<string>();
  for (const { item } of scoped) {
    for (const list of [item.supersedes, item.retracts]) {
      if (!Array.isArray(list)) continue;
      for (const id of list) if (typeof id === "string") dead.add(`${item.issuer}|${id}`);
    }
  }
  return scoped.filter(s => !dead.has(`${s.item.issuer}|${s.item.id}`));
}

function entriesOf(item: FolioItem): [string, any][] {
  const p = item.payload;
  if (!p || typeof p !== "object") return [];
  return Object.entries(p).filter(([, e]) => e && typeof e === "object");
}

function isMedList(item: FolioItem): boolean {
  const es = entriesOf(item);
  if (es.some(([, e]) => e.type === "my_med")) return true;
  if (es.length === 0 && typeof item.narrative === "string" && /^\s*My Medicines\b/i.test(item.narrative)) return true;
  return false;
}

function later(a: ScopedItem, b: ScopedItem): number {
  if (a.recordedMs !== b.recordedMs) return a.recordedMs - b.recordedMs;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0;
}

// ───────────────────────────── drug names ─────────────────────────────

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  "glucophage xr": "metformin", glumetza: "metformin", fortamet: "metformin", riomet: "metformin",
  crestor: "rosuvastatin", lipitor: "atorvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  livalo: "pitavastatin", mevacor: "lovastatin", zetia: "ezetimibe", synthroid: "levothyroxine",
  levoxyl: "levothyroxine", unithroid: "levothyroxine", euthyrox: "levothyroxine", tirosint: "levothyroxine",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", nesina: "alogliptin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", victoza: "liraglutide",
  saxenda: "liraglutide", trulicity: "dulaglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  byetta: "exenatide", bydureon: "exenatide", glucotrol: "glipizide", "glucotrol xl": "glipizide",
  amaryl: "glimepiride", diabeta: "glyburide", micronase: "glyburide", glynase: "glyburide",
  actos: "pioglitazone", avandia: "rosiglitazone",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  rezvoglar: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", admelog: "insulin lispro", lyumjev: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  "humulin r": "insulin regular", "novolin r": "insulin regular", "humulin n": "insulin isophane",
  "novolin n": "insulin isophane",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan",
  atacand: "candesartan", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", accupril: "quinapril",
  tenormin: "atenolol", lopressor: "metoprolol", "toprol xl": "metoprolol", toprol: "metoprolol",
  coreg: "carvedilol", bystolic: "nebivolol", inderal: "propranolol",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide",
  aldactone: "spironolactone", inspra: "eplerenone", kerendia: "finerenone",
  cardizem: "diltiazem", procardia: "nifedipine", adalat: "nifedipine", calan: "verapamil",
  catapres: "clonidine", apresoline: "hydralazine", entresto: "sacubitril / valsartan",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", jantoven: "warfarin", plavix: "clopidogrel",
  brilinta: "ticagrelor", pradaxa: "dabigatran",
  aleve: "naproxen", naprosyn: "naproxen", advil: "ibuprofen", motrin: "ibuprofen", tylenol: "acetaminophen",
  celebrex: "celecoxib", mobic: "meloxicam", bayer: "aspirin", ecotrin: "aspirin",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", prevacid: "lansoprazole",
  pepcid: "famotidine", zantac: "ranitidine",
  zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine", benadryl: "diphenhydramine",
  flonase: "fluticasone", singulair: "montelukast",
  neurontin: "gabapentin", lyrica: "pregabalin", ultram: "tramadol",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine",
  effexor: "venlafaxine", cymbalta: "duloxetine", wellbutrin: "bupropion", remeron: "mirtazapine",
  desyrel: "trazodone", seroquel: "quetiapine", abilify: "aripiprazole", zyprexa: "olanzapine",
  risperdal: "risperidone", buspar: "buspirone", xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam",
  ambien: "zolpidem", suboxone: "buprenorphine / naloxone", subutex: "buprenorphine", vivitrol: "naltrexone",
  zyloprim: "allopurinol", uloric: "febuxostat", colcrys: "colchicine",
  flomax: "tamsulosin", proscar: "finasteride", lipofen: "fenofibrate", tricor: "fenofibrate",
  lovaza: "omega-3-acid ethyl esters", fosamax: "alendronate", deltasone: "prednisone",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", symbicort: "budesonide / formoterol",
  advair: "fluticasone / salmeterol", spiriva: "tiotropium",
  "k-dur": "potassium chloride", "klor-con": "potassium chloride",
  "glucovance": "glyburide / metformin", janumet: "metformin / sitagliptin", synjardy: "empagliflozin / metformin",
  xigduo: "dapagliflozin / metformin",
};

const GENERICS = new Set<string>([
  "lisinopril", "amlodipine", "metformin", "glipizide", "glimepiride", "glyburide", "rosuvastatin", "atorvastatin",
  "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "ezetimibe", "levothyroxine", "liothyronine",
  "empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sitagliptin", "linagliptin", "saxagliptin",
  "alogliptin", "semaglutide", "liraglutide", "dulaglutide", "tirzepatide", "exenatide", "pioglitazone",
  "insulin glargine", "insulin detemir", "insulin degludec", "insulin lispro", "insulin aspart", "insulin glulisine",
  "insulin regular", "insulin isophane", "insulin nph",
  "losartan", "valsartan", "olmesartan", "irbesartan", "telmisartan", "candesartan", "enalapril", "ramipril",
  "benazepril", "quinapril", "captopril", "fosinopril", "perindopril", "trandolapril",
  "atenolol", "metoprolol", "carvedilol", "nebivolol", "propranolol", "bisoprolol", "labetalol",
  "furosemide", "bumetanide", "torsemide", "hydrochlorothiazide", "chlorthalidone", "indapamide", "spironolactone",
  "eplerenone", "finerenone", "diltiazem", "nifedipine", "verapamil", "felodipine", "clonidine", "hydralazine",
  "doxazosin", "terazosin", "minoxidil", "apixaban", "rivaroxaban", "warfarin", "clopidogrel", "ticagrelor",
  "prasugrel", "dabigatran", "aspirin", "naproxen", "ibuprofen", "acetaminophen", "celecoxib", "meloxicam",
  "diclofenac", "omeprazole", "esomeprazole", "pantoprazole", "lansoprazole", "famotidine", "ranitidine",
  "cetirizine", "loratadine", "fexofenadine", "diphenhydramine", "fluticasone", "montelukast", "gabapentin",
  "pregabalin", "tramadol", "oxycodone", "hydrocodone", "sertraline", "fluoxetine", "escitalopram", "citalopram",
  "paroxetine", "venlafaxine", "desvenlafaxine", "duloxetine", "bupropion", "mirtazapine", "trazodone",
  "quetiapine", "aripiprazole", "olanzapine", "risperidone", "lithium", "buspirone", "alprazolam", "lorazepam",
  "clonazepam", "zolpidem", "buprenorphine", "naltrexone", "methadone", "allopurinol", "febuxostat", "colchicine",
  "tamsulosin", "finasteride", "fenofibrate", "gemfibrozil", "alendronate", "prednisone", "albuterol",
  "tiotropium", "budesonide", "potassium chloride", "sodium bicarbonate", "calcium carbonate", "magnesium oxide",
  "ferrous sulfate", "cholecalciferol", "ergocalciferol", "vitamin d", "vitamin d3", "vitamin b12",
  "cyanocobalamin", "folic acid", "fish oil", "multivitamin", "docusate", "senna", "sennosides", "polyethylene glycol",
  "loperamide", "ondansetron", "metoclopramide", "sacubitril", "digoxin", "amiodarone", "isosorbide mononitrate",
  "nitroglycerin", "ranolazine", "sildenafil", "tadalafil", "doxycycline", "amoxicillin", "azithromycin",
  "cephalexin", "ciprofloxacin", "nitrofurantoin", "sulfamethoxazole", "trimethoprim", "melatonin",
  "calcitriol", "sevelamer", "patiromer", "sodium zirconium cyclosilicate", "hydroxychloroquine", "methotrexate",
]);

const SALTS = new Set<string>([
  "hydrochloride", "hcl", "dihydrochloride", "potassium", "sodium", "disodium", "calcium", "magnesium",
  "besylate", "besilate", "maleate", "mesylate", "tartrate", "bitartrate", "succinate", "fumarate", "citrate",
  "acetate", "sulfate", "phosphate", "bromide", "hydrobromide", "hyclate", "monohydrate", "dihydrate",
  "trihydrate", "hemihydrate", "propionate", "dipropionate", "furoate", "valerate", "anhydrous",
]);
const SALT_KEEP_ALONE = new Set<string>(["ferrous", "zinc", "magnesium", "potassium", "sodium", "calcium"]);

const RELEASE_WORDS = /\b(er|xr|sr|xl|dr|cr|la|ir|ec|extended release|delayed release|immediate release|ext rel)\b/g;

function stripSalts(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  while (words.length > 1 && SALTS.has(words[words.length - 1])) {
    if (words.length === 2 && SALT_KEEP_ALONE.has(words[0])) break;
    words.pop();
  }
  return words.join(" ");
}

function cleanName(s: string): string {
  let t = s.toLowerCase();
  t = t.replace(/\[[^\]]*\]/g, " ").replace(/\([^)]*\)/g, " ");
  // cut at first number (strength), keep words before
  t = t.replace(/\d.*$/, " ");
  t = t.replace(/[,;]+/g, " ");
  t = t.replace(RELEASE_WORDS, " ");
  t = t.replace(/\b(oral|tablet|tablets|tab|tabs|capsule|capsules|cap|caps|pill|pills|pen|injector|injection|solution|suspension|inhaler|prefilled|syringe|cartridge|vial|kit|chewable|film|coated|topical|cream|patch|spray|nasal|human|product|delayed|extended|release)\b/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return stripSalts(t);
}

function lookupIngredient(raw: string): string | undefined {
  const c = cleanName(raw);
  if (!c) return undefined;
  if (BRANDS[c]) return BRANDS[c];
  if (GENERICS.has(c)) return c;
  const words = c.split(" ");
  for (const n of [2, 1]) {
    if (words.length > n) {
      const head = words.slice(0, n).join(" ");
      if (BRANDS[head]) return BRANDS[head];
      if (GENERICS.has(head)) return head;
    }
  }
  return undefined;
}

/** Ingredient from an RxNorm display string (ingredient-level or product-level). */
function ingredientFromDisplay(display: string): string | undefined {
  const parts = display.replace(/\[[^\]]*\]/g, " ").split(/\s\/\s/);
  const names: string[] = [];
  for (const p of parts) {
    const c = cleanName(p.replace(/^\s*\d+\s*(hr|hour)\s+/i, ""));
    if (!c) continue;
    names.push(BRANDS[c] ?? c);
  }
  if (names.length === 0) {
    const b = /\[([^\]]+)\]/.exec(display);
    if (b) return lookupIngredient(b[1]);
    return undefined;
  }
  // a brand-only display ("Jardiance 10 MG Oral Tablet")
  if (names.length === 1 && BRANDS[names[0]]) return BRANDS[names[0]];
  return names.join(" / ");
}

function displayIsIngredientLevel(display: string): boolean {
  return !/\d/.test(display) &&
    !/\b(oral|tablet|capsule|injection|injector|pen|solution|suspension|inhaler|cream|patch|spray|syringe|product)\b/i.test(display) &&
    !/\//.test(display) && !/\[/.test(display);
}

// ───────────────────────────── sensitivity ─────────────────────────────

const SENSITIVE: Record<string, Sensitivity> = {
  sertraline: "mental-health", fluoxetine: "mental-health", escitalopram: "mental-health",
  citalopram: "mental-health", paroxetine: "mental-health", venlafaxine: "mental-health",
  desvenlafaxine: "mental-health", mirtazapine: "mental-health", vortioxetine: "mental-health",
  vilazodone: "mental-health", lithium: "mental-health", quetiapine: "mental-health",
  aripiprazole: "mental-health", olanzapine: "mental-health", risperidone: "mental-health",
  lurasidone: "mental-health", ziprasidone: "mental-health", haloperidol: "mental-health",
  clozapine: "mental-health", paliperidone: "mental-health", buspirone: "mental-health",
  buprenorphine: "substance-use", naltrexone: "substance-use", methadone: "substance-use",
  disulfiram: "substance-use", acamprosate: "substance-use",
  "ethinyl estradiol": "sexual-reproductive-health", norethindrone: "sexual-reproductive-health",
  levonorgestrel: "sexual-reproductive-health", drospirenone: "sexual-reproductive-health",
  norgestimate: "sexual-reproductive-health", etonogestrel: "sexual-reproductive-health",
  desogestrel: "sexual-reproductive-health",
  emtricitabine: "hiv-sti", bictegravir: "hiv-sti", dolutegravir: "hiv-sti", efavirenz: "hiv-sti",
  raltegravir: "hiv-sti", darunavir: "hiv-sti", rilpivirine: "hiv-sti", abacavir: "hiv-sti",
  cabotegravir: "hiv-sti", elvitegravir: "hiv-sti", atazanavir: "hiv-sti",
};

function sensitivityFor(ingredient: string | undefined): Sensitivity[] | undefined {
  if (!ingredient) return undefined;
  const out = new Set<Sensitivity>();
  for (const part of ingredient.split(" / ")) {
    const s = SENSITIVE[part.trim()];
    if (s) out.add(s);
  }
  return out.size ? [...out].sort() : undefined;
}

// ───────────────────────────── dose & frequency ─────────────────────────────

type Mass = { value: number; unit: "mg" | "mcg" };

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

function normMass(value: number, unit: string): Mass | undefined {
  if (!isFinite(value) || value <= 0) return undefined;
  const u = unit.toLowerCase();
  if (u === "g") return { value: round6(value * 1000), unit: "mg" };
  if (u === "mg") return value < 1 ? { value: round6(value * 1000), unit: "mcg" } : { value: round6(value), unit: "mg" };
  if (u === "mcg" || u === "ug" || u === "µg") return { value: round6(value), unit: "mcg" };
  return undefined;
}

function toMcg(m: Mass): number {
  return m.unit === "mg" ? m.value * 1000 : m.value;
}

/** Single per-unit mass from the product display, e.g. "levothyroxine sodium 0.075 MG Oral Tablet". */
function strengthFromDisplay(display: string): Mass | undefined {
  if (display.includes(" / ")) return undefined;
  if (!/\b(tablet|capsule|caplet)\b/i.test(display)) return undefined;
  const ms = [...display.matchAll(/(\d+(?:\.\d+)?)\s*(MG|MCG|G)\b(?!\s*\/)/gi)];
  if (ms.length !== 1) return undefined;
  return normMass(parseFloat(ms[0][1]), ms[0][2]);
}

function strengthFromText(text: string): Mass | undefined {
  const m = /^\s*(\d+(?:\.\d+)?)\s*(mg|mcg|ug|µg|g)\b\.?\s*(tablets?|tabs?|capsules?|caps?|pills?)?\s*$/i.exec(text);
  if (!m) return undefined;
  return normMass(parseFloat(m[1]), m[2]);
}

const NON_SOLID = /\b(units?|unt|iu|ml|pen|inhaler|puffs?|spray|drops?|patch|cream|ointment|gel|injection|injector|insulin|solution|suspension|syrup|liquid|liter|vial|syringe)\b|\/\s*ml/i;

const NUM_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, half: 0.5, "a half": 0.5, "1/2": 0.5, "½": 0.5,
};

function parseNum(s: string): number {
  const k = s.toLowerCase().trim();
  if (k in NUM_WORDS) return NUM_WORDS[k];
  return parseFloat(k);
}

type Dose = NonNullable<MedicationRow["dose"]>;

function parseDose(med: any, ingredient: string | undefined): Dose | undefined {
  const how = typeof med.how_i_take_it === "string" ? med.how_i_take_it.toLowerCase() : "";
  if (!how.trim()) return undefined;
  const NUM = "(\\d+(?:\\.\\d+)?|one|two|three|four|five|a half|half|1/2|½)";
  // a range ("1 or 2", "1-2", "1 to 2") is not a single amount
  if (new RegExp(`${NUM}\\s*(?:or|-|–|to)\\s*${NUM}\\b`, "i").test(how)) return undefined;

  const amounts = (re: RegExp) => [...how.matchAll(re)].map(m => parseNum(m[1]));
  const allSame = (xs: number[]) => xs.length > 0 && xs.every(x => x === xs[0]) ? xs[0] : undefined;

  const units = amounts(new RegExp(`${NUM}\\s*(?:units?|u|iu)\\b`, "gi"));
  if (units.length) { const v = allSame(units); return v && v > 0 ? { value: v, unit: "units" } : undefined; }
  const mls = amounts(new RegExp(`${NUM}\\s*(?:ml|cc)\\b`, "gi"));
  if (mls.length) { const v = allSame(mls); return v && v > 0 ? { value: v, unit: "mL" } : undefined; }
  const masses = [...how.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg|ug|g)\b/gi)].map(m => normMass(parseFloat(m[1]), m[2]));
  if (masses.length) {
    if (masses.some(m => !m)) return undefined;
    const vs = masses.map(m => toMcg(m!));
    return vs.every(v => v === vs[0]) ? masses[0] : undefined;
  }
  if (/\bpuffs?\b|\bdrops?\b|\bsprays?\b/.test(how)) return undefined;

  // counts of tablets
  const countRe = new RegExp(`(?:^|[^\\w.])${NUM}(?![\\w.:/])\\s*(tablets?|tabs?|pills?|capsules?|caps?)?(?!\\s*(?:am|pm|a\\.m|p\\.m|o'?clock|hours?|hrs?|h\\b|times?|x\\b|days?|weeks?|months?|a day|per day|daily|/))`, "gi");
  const counts: number[] = [];
  for (const m of how.matchAll(countRe)) counts.push(parseNum(m[1]));
  // "twice"/"N times" are frequencies, not counts
  const strengthText = typeof med.strength_text === "string" ? med.strength_text : "";
  const display = med.picked_from_search && typeof med.picked_from_search.display === "string" ? med.picked_from_search.display : "";
  const name = typeof med.name === "string" ? med.name : "";
  const nonSolid = NON_SOLID.test(strengthText) || NON_SOLID.test(display) || NON_SOLID.test(name) ||
    (!!ingredient && /insulin|glutide|tirzepatide|exenatide/.test(ingredient)) ||
    (!!display && /\b(tablet|capsule|caplet)\b/i.test(display) === false && /\d/.test(display));
  let count: number | undefined;
  if (counts.length) {
    count = allSame(counts);
    if (count === undefined || !(count > 0)) return undefined;
  } else if (/\b\d+\s*(?:a day|per day|daily|x)\b/.test(how)) {
    return undefined;
  } else {
    if (nonSolid) return undefined;
    count = 1;
  }
  if (nonSolid && counts.length) return undefined;

  // strength per tablet
  const fromDisplay = display ? strengthFromDisplay(display) : undefined;
  const fromText = strengthText ? strengthFromText(strengthText) : undefined;
  // the patient's own strength text is what they say they take; the search pick is only a fallback
  const strength: Mass | undefined = fromText ?? fromDisplay;
  if (strength) {
    const v = round6(strength.value * count);
    return { value: v, unit: strength.unit };
  }
  if (display.includes(" / ") || /\d/.test(strengthText) || !strengthText) {
    return { value: count, unit: "tablet" };
  }
  return { value: count, unit: "tablet" };
}

function parseFrequency(howRaw: unknown): MedicationRow["frequency"] | undefined {
  if (typeof howRaw !== "string" || !howRaw.trim()) return undefined;
  const how = howRaw.toLowerCase();
  const prn = /\b(as needed|when needed|if needed|prn|as required|when i need|if i need|sometimes|occasionally|when (?:i|my|it|the)\b|if (?:i|my|it)\b|for (?:my )?(?:pain|knee|knees|back|headaches?|migraines?|joints?|arthritis|sleep|allergies|heartburn|anxiety|cough))/.test(how);
  if (/\b(every other day|every 2 days|every second day|twice a week|three times a week|monthly|every month)\b/.test(how)) return "other";
  if (/\b(weekly|once a week|every week|a week|per week|every (?:mon|tue|wed|thu|fri|sat|sun)[a-z]*|on (?:mon|tue|wed|thu|fri|sat|sun)[a-z]*s)\b/.test(how)) return "QW";
  let explicit: number | undefined;
  if (/\b(four times|4 times|qid|4x)\b/.test(how)) explicit = 4;
  else if (/\b(three times|3 times|tid|3x|thrice|with (?:each |every |all )?meals)\b/.test(how)) explicit = 3;
  else if (/\b(twice|two times|2 times|bid|2x|every 12 hours|12 hours apart)\b/.test(how)) explicit = 2;
  else if (/\b(every 8 hours)\b/.test(how)) explicit = 3;
  else if (/\bevery \d+ hours\b/.test(how)) return "other";
  const slots = new Set<string>();
  if (/\b(morning|mornings|breakfast|am|a\.m\.|wake|waking|get up)\b/.test(how)) slots.add("M");
  if (/\b(noon|lunch|midday|afternoon)\b/.test(how)) slots.add("L");
  if (/\b(supper|dinner|evening|evenings|pm|p\.m\.)\b/.test(how)) slots.add("E");
  const bed = /\b(bedtime|bed|night|nights|nightly|qhs|hs)\b/.test(how);
  if (bed) slots.add("B");
  const daily = /\b(once|daily|every day|each day|a day|per day|qd|everyday)\b/.test(how);
  if (prn) return slots.size === 0 && explicit === undefined && !daily ? "PRN" : "other";
  if (/\b(most days|some days)\b/.test(how) && slots.size === 0) return "other";
  if (explicit !== undefined) {
    if (slots.size > explicit) return "other";
    return explicit === 2 ? "BID" : explicit === 3 ? "TID" : "other";
  }
  if (slots.size === 1) return bed ? "QHS" : "QD";
  if (slots.size === 2) return "BID";
  if (slots.size === 3) return "TID";
  if (slots.size >= 4) return "other";
  if (daily) return "QD";
  return undefined;
}

// ───────────────────────────── status ─────────────────────────────

const PAUSE_RE = /\b(for now|for the time being|on hold|hold(?:ing)? (?:it|off|this)|holding|paus\w*|temporar\w*|until|for a (?:while|bit|few|week|month|couple)|till|restart|re-start|resume|start again|go back on|back on it after|before (?:my |the )?(?:surgery|procedure|operation|colonoscopy|scan|test)|after (?:my |the )?(?:surgery|procedure|operation|colonoscopy|scan|test))\b/i;
const NO_RESUME_RE = /\b(not|never|don'?t|won'?t|no plan to|isn'?t going to)\s+(?:\w+\s+){0,2}(restart|resume|start again|go back on|take it again)\b|\bfor good\b|\bpermanently\b/i;
const TAKING_STOP_RE = /\b(told|said|asked|wants?) me to (stop|hold|pause|quit)|\bnot taking\b|\bstopped (?:taking )?(?:it|this|them)\b|\boff (?:it|this|them)\b|\bquit (?:it|this|taking)\b/i;

function stopReason(note: string): MedicationRow["stop_reason"] | undefined {
  const n = note.toLowerCase();
  if (/\b(switch\w*|changed? (?:to|over)|replac\w*|instead|swapped|moved (?:me )?to|put me on|started on)\b/.test(n)) return "therapy_changed";
  if (/\b(side effects?|made me|gave me|caused|reaction|allerg\w*|rash|hives|itch\w*|cough\w*|swell\w*|swollen|nause\w*|vomit\w*|diarrh\w*|upset stomach|stomach upset|dizz\w*|lightheaded|cramp\w*|muscle (?:pain|aches?)|aches?|yeast infection|infection|low (?:blood )?sugar|hypo\w*|ketoacidosis|dka|kidney|bleed\w*|tired|fatigue|headaches?|didn'?t agree with me|couldn'?t tolerate|intoleran\w*)\b/.test(n)) return "adverse_reaction";
  if (/\b(didn'?t (?:work|help)|not (?:working|helping)|did ?n[o']t do anything|no (?:help|effect|difference)|stopped working|wasn'?t (?:working|helping)|ineffective)\b/.test(n)) return "ineffective";
  if (/\b(finished|completed|course (?:was )?(?:done|over)|ran out of the course|done with the course|all done|was only for)\b/.test(n)) return "course_complete";
  if (/\b(i decided|my (?:own )?(?:choice|decision)|didn'?t want|don'?t want|did not want|too expensive|cost|couldn'?t afford|can'?t afford|i chose|i stopped it myself|on my own)\b/.test(n)) return "patient_choice";
  return undefined;
}

// ───────────────────────────── medications ─────────────────────────────

interface MedCandidate {
  row: MedicationRow;
  key: string;
  eventDate?: string;
  order: number;
}

function medRows(list: ScopedItem | undefined): MedicationRow[] {
  if (!list) return [];
  const cands: MedCandidate[] = [];
  let order = 0;
  for (const [entryId, e] of entriesOf(list.item)) {
    if (e.type !== "my_med") continue;
    order++;
    const name = typeof e.name === "string" ? e.name.trim() : "";
    const pick = e.picked_from_search && typeof e.picked_from_search === "object" ? e.picked_from_search : undefined;
    const display = pick && typeof pick.display === "string" ? pick.display.trim() : "";
    const rx = pick && typeof pick.rxnorm === "string" ? pick.rxnorm.trim() : "";
    const drugName = name || display;
    if (!drugName) continue;

    let ingredient: string | undefined;
    if (display) ingredient = ingredientFromDisplay(display);
    if (!ingredient && name) ingredient = lookupIngredient(name);
    const ingredientLevel = !!display && displayIsIngredientLevel(display) && /^\d+$/.test(rx);

    const note = typeof e.note === "string" ? e.note.trim() : "";
    const started = partialDate(e.started);
    const stopped = partialDate(e.stopped);

    let status: MedicationRow["status"];
    if (e.status === "taking") {
      status = note && !NO_RESUME_RE.test(note) && (PAUSE_RE.test(note) || TAKING_STOP_RE.test(note)) ? "held" : "active";
    } else if (e.status === "stopped") {
      status = note && PAUSE_RE.test(note) && !NO_RESUME_RE.test(note) ? "held" : "stopped";
    } else {
      status = "unknown";
    }

    const row: MedicationRow = {
      drug_name: drugName,
      status,
      patient_reported: true,
      evidence: [{ item_id: list.item.id, entry_id: entryId }],
    };
    if (ingredient) row.ingredient = ingredient;
    if (ingredientLevel && ingredient && !ingredient.includes(" / ")) row.rxnorm_ingredient = rx;

    if (status === "active") {
      if (started) row.status_since = started;
    } else if (status === "stopped" || status === "held") {
      if (stopped) row.status_since = stopped;
    }

    const dose = parseDose(e, ingredient);
    if (dose) row.dose = dose;
    const freq = parseFrequency(e.how_i_take_it);
    if (freq) row.frequency = freq;

    if (status === "stopped" && note) {
      const r = stopReason(note);
      if (r) row.stop_reason = r;
    }
    if ((status === "stopped" || status === "held") && note) row.status_reason_text = note;
    if (e.kind === "over_the_counter") row.otc = true;
    const sens = sensitivityFor(ingredient);
    if (sens) row.sensitivity = sens;

    const eventDate = [started, stopped].filter((x): x is string => !!x).sort().pop();
    cands.push({ row, key: ingredient ? `i:${ingredient}` : `n:${drugName.toLowerCase()}|${entryId}`, eventDate, order });
  }

  // one row per ingredient: keep the most recent line
  const best = new Map<string, MedCandidate>();
  for (const c of cands) {
    const prev = best.get(c.key);
    if (!prev || newer(c, prev)) best.set(c.key, c);
  }
  return [...best.values()].sort((a, b) => a.order - b.order).map(c => c.row);
}

function newer(a: MedCandidate, b: MedCandidate): boolean {
  if (a.eventDate && b.eventDate && a.eventDate !== b.eventDate) {
    // compare at the shared precision; a more precise date within the same period counts as later
    const n = Math.min(a.eventDate.length, b.eventDate.length);
    const pa = a.eventDate.slice(0, n), pb = b.eventDate.slice(0, n);
    if (pa !== pb) return pa > pb;
  }
  const aStopped = a.row.status === "stopped", bStopped = b.row.status === "stopped";
  if (aStopped !== bStopped) return !aStopped;
  return a.order > b.order;
}

// ───────────────────────────── vitals ─────────────────────────────

interface VitalCand {
  row: VitalRow;
  kind: "bp" | "glu";
  device: boolean;
  minutes: number;
  sig: string;
}

const MMOL_TO_MGDL = 18.016;

function num(v: unknown): number | undefined {
  return typeof v === "number" && isFinite(v) ? v : undefined;
}

function vitalRows(days: ScopedItem[]): VitalRow[] {
  const cands: VitalCand[] = [];
  for (const { item } of days) {
    for (const [entryId, e] of entriesOf(item)) {
      const ev: Evidence = [{ item_id: item.id, entry_id: entryId }];
      if (e.type === "bp_reading") {
        const lt = localTime(e.measured_at);
        const sys = num(e.systolic_mmhg), dia = num(e.diastolic_mmhg);
        if (!lt || sys === undefined || dia === undefined || sys <= 0 || dia <= 0) continue;
        const row: VitalRow = { setting: "home", local_time: lt, systolic_mmhg: sys, diastolic_mmhg: dia, evidence: ev };
        const pulse = num(e.pulse_bpm);
        if (pulse !== undefined && pulse > 0) row.pulse_bpm = pulse;
        cands.push({ row, kind: "bp", device: e.entry_method === "cuff_sync", minutes: minutesOf(lt), sig: `${sys}/${dia}` });
      } else if (e.type === "glucose_reading") {
        const lt = localTime(e.measured_at);
        const v = num(e.value);
        if (!lt || v === undefined || v <= 0) continue;
        let mg: number;
        if (e.unit === "mg/dL") {
          if (!e.out_of_range && (v < 20 || v > 600)) continue; // impossible for the stated unit: unreadable
          mg = Math.round(v);
        } else if (e.unit === "mmol/L") {
          if (!e.out_of_range && (v < 1.1 || v > 33.3)) continue;
          mg = Math.round(v * MMOL_TO_MGDL);
        } else continue;
        const row: VitalRow = { setting: "home", local_time: lt, glucose_mg_dl: mg, evidence: ev };
        if (e.out_of_range === "HI" || e.out_of_range === "LO") row.glucose_out_of_range = e.out_of_range;
        cands.push({ row, kind: "glu", device: e.entry_method === "meter_sync", minutes: minutesOf(lt), sig: `${mg}|${row.glucose_out_of_range ?? ""}` });
      }
    }
  }

  // drop typed copies of device readings (same values, within a few minutes)
  const devices = cands.filter(c => c.device);
  const kept = cands.filter(c => {
    if (c.device) return true;
    return !devices.some(d => {
      if (d.kind !== c.kind) return false;
      if (Math.abs(d.minutes - c.minutes) > 10) return false;
      if (c.kind === "bp") {
        if (d.sig !== c.sig) return false;
        const p1 = d.row.pulse_bpm, p2 = c.row.pulse_bpm;
        return p1 === undefined || p2 === undefined || p1 === p2;
      }
      return Math.abs((d.row.glucose_mg_dl ?? -99) - (c.row.glucose_mg_dl ?? 99)) <= 1 &&
        d.row.glucose_out_of_range === c.row.glucose_out_of_range;
    });
  });

  return kept
    .map(c => c.row)
    .sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const current = currentItems(items, asOf);

    const lists = current.filter(s => isMedList(s.item)).sort(later);
    const latestList = lists.length ? lists[lists.length - 1] : undefined;
    out.medications = medRows(latestList);

    // day pages: each restates the whole day, so keep the latest current page per day
    const byDay = new Map<string, ScopedItem>();
    for (const s of current) {
      if (isMedList(s.item)) continue;
      const day = typeof s.item.effective === "string" ? s.item.effective.slice(0, 10) : s.item.id;
      const prev = byDay.get(day);
      if (!prev || later(s, prev) > 0) byDay.set(day, s);
    }
    out.vitals = vitalRows([...byDay.values()]);
  } catch {
    // never throw; return what we have
  }
  return out;
}
