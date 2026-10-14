import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  VitalRow,
  Evidence,
  PartialDate,
  Sensitivity,
} from "../in/views/views";

// Mapper for HomeLog (patient-generated diary app): My Medicines list snapshots -> medications,
// day pages (home BP / glucose readings) -> vitals. HomeLog has no problems, allergies or labs
// (home meter glucose is a vital, diary symptom tags are not diagnoses).

const ZONE = "America/Chicago";
const MG_PER_MMOL = 18.016;

// ─── helpers ─────────────────────────────────────────────────────────────────────────────────────

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x.trim() : undefined;
}
function num(x: unknown): number | undefined {
  return typeof x === "number" && Number.isFinite(x) ? x : undefined;
}
function round(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}

let dateFmt: Intl.DateTimeFormat | undefined;
/** Local (America/Chicago) calendar date of an RFC 3339 instant, or undefined if unreadable. */
function chicagoDate(instant: string): string | undefined {
  const t = Date.parse(instant);
  if (!Number.isFinite(t)) return undefined;
  if (!dateFmt) {
    dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
  }
  const parts = dateFmt.formatToParts(new Date(t));
  const get = (k: string) => parts.find((p) => p.type === k)?.value;
  const y = get("year"), m = get("month"), d = get("day");
  if (!y || !m || !d) return undefined;
  return `${y}-${m}-${d}`;
}

/** Normalizes a HomeLog wall-clock time to `YYYY-MM-DDTHH:MM` (as written, no shift). */
function localTime(x: unknown): string | undefined {
  const s = str(x);
  if (!s) return undefined;
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/.exec(s);
  if (!m) return undefined;
  return `${m[1]}T${m[2]}:${m[3]}`;
}
function minutesOf(lt: string): number {
  const t = Date.parse(lt + ":00Z");
  return Number.isFinite(t) ? t / 60000 : NaN;
}

function partialDate(x: unknown): PartialDate | undefined {
  const s = str(x);
  if (!s) return undefined;
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(s);
  if (!m) return undefined;
  if (m[2] && (+m[2] < 1 || +m[2] > 12)) return undefined;
  if (m[3] && (+m[3] < 1 || +m[3] > 31)) return undefined;
  return s;
}

// ─── scope and corrections ───────────────────────────────────────────────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope: FolioItem[] = [];
  for (const it of Array.isArray(items) ? items : []) {
    if (!isObj(it) || typeof it.id !== "string" || typeof it.recorded !== "string") continue;
    const d = chicagoDate(it.recorded);
    if (!d || d > asOf) continue;
    inScope.push(it);
  }
  const key = (issuer: unknown, id: string) => `${String(issuer)}\u0000${id}`;
  const ids = (x: unknown): string[] => (Array.isArray(x) ? x.filter((v): v is string => typeof v === "string") : []);

  // Retracted items never existed, so their own supersedes/retracts do not count either.
  // Iterate to a fixed point so a retraction that is itself retracted is handled.
  let retracted = new Set<string>();
  for (let pass = 0; pass < 10; pass++) {
    const next = new Set<string>();
    for (const it of inScope) {
      if (retracted.has(key(it.issuer, it.id))) continue;
      for (const r of ids(it.retracts)) next.add(key(it.issuer, r));
    }
    const same = next.size === retracted.size && [...next].every((k) => retracted.has(k));
    retracted = next;
    if (same) break;
  }
  const superseded = new Set<string>();
  for (const it of inScope) {
    if (retracted.has(key(it.issuer, it.id))) continue;
    for (const s of ids(it.supersedes)) superseded.add(key(it.issuer, s));
  }
  return inScope.filter((it) => {
    const k = key(it.issuer, it.id);
    return !retracted.has(k) && !superseded.has(k);
  });
}

function entriesOf(it: FolioItem): [string, Record<string, any>][] {
  if (!isObj(it.payload)) return [];
  return Object.keys(it.payload)
    .sort(naturalCompare)
    .map((k) => [k, it.payload[k]] as [string, any])
    .filter((e): e is [string, Record<string, any>] => isObj(e[1]));
}
function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, "en", { numeric: true });
}

function isMedList(it: FolioItem): boolean {
  const es = entriesOf(it);
  if (es.some(([, e]) => e.type === "my_med")) return true;
  if (es.length === 0 && typeof it.narrative === "string" && /^\s*My Medicines\b/i.test(it.narrative)) return true;
  return false;
}

/** Later item first: recorded, then effective, then id. */
function laterFirst(a: FolioItem, b: FolioItem): number {
  const ra = Date.parse(a.recorded), rb = Date.parse(b.recorded);
  if (ra !== rb) return (Number.isFinite(rb) ? rb : 0) - (Number.isFinite(ra) ? ra : 0);
  const ea = String(a.effective ?? ""), eb = String(b.effective ?? "");
  if (ea !== eb) return ea < eb ? 1 : -1;
  return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
}

// ─── drug names ──────────────────────────────────────────────────────────────────────────────────

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", qbrelis: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  lotensin: "benazepril", accupril: "quinapril", norvasc: "amlodipine", procardia: "nifedipine", adalat: "nifedipine",
  cardizem: "diltiazem", calan: "verapamil", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan",
  avapro: "irbesartan", micardis: "telmisartan", atacand: "candesartan", entresto: "sacubitril / valsartan",
  hyzaar: "losartan / hydrochlorothiazide", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide",
  microzide: "hydrochlorothiazide", aldactone: "spironolactone", inspra: "eplerenone", kerendia: "finerenone",
  toprol: "metoprolol", "toprol xl": "metoprolol", lopressor: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  bystolic: "nebivolol", glucophage: "metformin", "glucophage xr": "metformin", glumetza: "metformin", fortamet: "metformin",
  glucotrol: "glipizide", "glucotrol xl": "glipizide", amaryl: "glimepiride", diabeta: "glyburide", actos: "pioglitazone",
  januvia: "sitagliptin", tradjenta: "linagliptin", janumet: "sitagliptin / metformin", jardiance: "empagliflozin",
  synjardy: "empagliflozin / metformin", farxiga: "dapagliflozin", xigduo: "dapagliflozin / metformin",
  invokana: "canagliflozin", steglatro: "ertugliflozin", ozempic: "semaglutide", wegovy: "semaglutide",
  rybelsus: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide", saxenda: "liraglutide",
  mounjaro: "tirzepatide", zepbound: "tirzepatide", byetta: "exenatide", lantus: "insulin glargine",
  basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine", rezvoglar: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  lyumjev: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  crestor: "rosuvastatin", lipitor: "atorvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  livalo: "pitavastatin", zetia: "ezetimibe", vytorin: "ezetimibe / simvastatin", lovaza: "omega-3-acid ethyl esters",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", euthyrox: "levothyroxine",
  tirosint: "levothyroxine", armour: "thyroid", cytomel: "liothyronine", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", jantoven: "warfarin", pradaxa: "dabigatran", plavix: "clopidogrel", brilinta: "ticagrelor",
  aleve: "naproxen", naprosyn: "naproxen", anaprox: "naproxen", advil: "ibuprofen", motrin: "ibuprofen",
  tylenol: "acetaminophen", celebrex: "celecoxib", mobic: "meloxicam", ultram: "tramadol",
  bayer: "aspirin", ecotrin: "aspirin", "baby aspirin": "aspirin", prilosec: "omeprazole", nexium: "esomeprazole",
  protonix: "pantoprazole", prevacid: "lansoprazole", pepcid: "famotidine", zantac: "ranitidine",
  zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine", celexa: "citalopram", paxil: "paroxetine",
  wellbutrin: "bupropion", cymbalta: "duloxetine", effexor: "venlafaxine", remeron: "mirtazapine",
  desyrel: "trazodone", seroquel: "quetiapine", abilify: "aripiprazole", zyprexa: "olanzapine", risperdal: "risperidone",
  neurontin: "gabapentin", lyrica: "pregabalin", flomax: "tamsulosin", proscar: "finasteride", zyloprim: "allopurinol",
  uloric: "febuxostat", colcrys: "colchicine", claritin: "loratadine", zyrtec: "cetirizine", allegra: "fexofenadine",
  singulair: "montelukast", proair: "albuterol", ventolin: "albuterol", proventil: "albuterol", flonase: "fluticasone",
  "k-dur": "potassium chloride", "klor-con": "potassium chloride", suboxone: "buprenorphine / naloxone",
  subutex: "buprenorphine", vivitrol: "naltrexone", chantix: "varenicline", antabuse: "disulfiram",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", descovy: "emtricitabine / tenofovir alafenamide",
  truvada: "emtricitabine / tenofovir disoproxil", viagra: "sildenafil", cialis: "tadalafil", fosamax: "alendronate",
  imodium: "loperamide", zofran: "ondansetron", miralax: "polyethylene glycol 3350", "vitamin d3": "cholecalciferol",
};

const GENERICS = new Set<string>([
  "lisinopril", "enalapril", "ramipril", "benazepril", "quinapril", "captopril", "amlodipine", "nifedipine", "diltiazem",
  "verapamil", "losartan", "valsartan", "olmesartan", "irbesartan", "telmisartan", "candesartan", "furosemide",
  "bumetanide", "torsemide", "hydrochlorothiazide", "chlorthalidone", "spironolactone", "eplerenone", "finerenone",
  "metoprolol", "carvedilol", "atenolol", "nebivolol", "propranolol", "labetalol", "hydralazine", "clonidine",
  "metformin", "glipizide", "glimepiride", "glyburide", "pioglitazone", "sitagliptin", "linagliptin", "empagliflozin",
  "dapagliflozin", "canagliflozin", "ertugliflozin", "semaglutide", "dulaglutide", "liraglutide", "tirzepatide",
  "exenatide", "insulin glargine", "insulin detemir", "insulin degludec", "insulin lispro", "insulin aspart",
  "insulin glulisine", "insulin isophane", "insulin regular", "rosuvastatin", "atorvastatin", "simvastatin",
  "pravastatin", "pitavastatin", "lovastatin", "ezetimibe", "levothyroxine", "liothyronine", "apixaban", "rivaroxaban",
  "warfarin", "dabigatran", "clopidogrel", "ticagrelor", "aspirin", "naproxen", "ibuprofen", "acetaminophen",
  "celecoxib", "meloxicam", "diclofenac", "tramadol", "omeprazole", "esomeprazole", "pantoprazole", "lansoprazole",
  "famotidine", "sertraline", "escitalopram", "fluoxetine", "citalopram", "paroxetine", "bupropion", "duloxetine",
  "venlafaxine", "mirtazapine", "trazodone", "quetiapine", "aripiprazole", "olanzapine", "risperidone", "lithium",
  "gabapentin", "pregabalin", "tamsulosin", "finasteride", "allopurinol", "febuxostat", "colchicine", "loratadine",
  "cetirizine", "fexofenadine", "montelukast", "albuterol", "fluticasone", "prednisone", "potassium chloride",
  "buprenorphine", "naltrexone", "methadone", "varenicline", "disulfiram", "acamprosate", "sildenafil", "tadalafil",
  "alendronate", "loperamide", "ondansetron", "cholecalciferol", "ergocalciferol", "cyanocobalamin", "folic acid",
  "magnesium oxide", "calcium carbonate", "sodium bicarbonate", "ferrous sulfate", "melatonin", "doxycycline",
  "amoxicillin", "nitrofurantoin", "estradiol", "levonorgestrel", "norethindrone", "medroxyprogesterone",
]);

const SALTS = new Set<string>([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "magnesium", "besylate", "maleate", "mesylate", "succinate",
  "tartrate", "fumarate", "citrate", "sulfate", "acetate", "bromide", "chloride", "monohydrate", "dihydrate", "hyclate",
  "anhydrous", "hydrobromide", "phosphate", "propionate", "furoate", "dipropionate", "bitartrate", "trihydrate",
  "medoxomil", "cilexetil", "hemihydrate", "propanediol", "disodium", "dimeglumine",
]);

const FORM_WORDS = /\b(oral|tablet|capsule|injectable|injection|solution|suspension|pen|injector|inhaler|inhalant|inhalation|powder|topical|cream|ointment|patch|transdermal|spray|nasal|chewable|extended|delayed|release|film|kit|syringe|cartridge|vial|drops?|lozenge|gel|prefilled|metered|dose|product|pill)\b/i;

function stripSalt(name: string): string {
  const words = name.trim().split(/\s+/);
  while (words.length > 1 && SALTS.has(words[words.length - 1].toLowerCase())) {
    // keep "potassium chloride", "sodium bicarbonate" etc. intact
    if (words.length === 2 && SALTS.has(words[0].toLowerCase())) break;
    words.pop();
  }
  return words.join(" ");
}

interface ProductInfo {
  ingredients: string[]; // lower case, salt stripped
  ingredientLevel: boolean; // display is a single plain ingredient (RxNorm IN)
  massPerUnit?: { value: number; unit: "mg" | "mcg" }; // single-ingredient solid strength
  solid: boolean | undefined; // tablet/capsule? undefined when the form is not stated
}

/** Parses an RxNorm-style display ("rosuvastatin calcium 20 MG Oral Tablet", "empagliflozin", "… [Jardiance]"). */
function parseRxDisplay(display: string): ProductInfo | undefined {
  let s = display.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return undefined;
  const hasDigits = /\d/.test(s);
  const formStated = FORM_WORDS.test(s);
  const solid = /\b(tablet|capsule|caplet|pill)\b/i.test(s) ? true : formStated ? false : undefined;
  // leading quantity prefixes: "24 HR", "3 ML", "0.4 ML", "120 ACTUAT"
  s = s.replace(/^(\d+(\.\d+)?\s+(HR|ML|ACTUAT|MG|UNT|DAY)\s+)+/i, "");
  const parts = s.split(/\s+\/\s+/);
  const ingredients: string[] = [];
  const masses: { value: number; unit: "mg" | "mcg" }[] = [];
  let massOk = true;
  for (const p of parts) {
    const words = p.split(" ");
    const nameWords: string[] = [];
    let i = 0;
    for (; i < words.length; i++) {
      if (/^\d/.test(words[i]) || FORM_WORDS.test(words[i])) break;
      nameWords.push(words[i]);
    }
    if (nameWords.length === 0) continue;
    let ing = nameWords.join(" ");
    const lower = ing.toLowerCase();
    if (BRANDS[lower]) ing = BRANDS[lower];
    else if (ing !== lower) {
      // capitalized: a brand-name concept we do not know
      const stripped = stripSalt(lower);
      if (GENERICS.has(stripped)) ing = stripped;
      else return { ingredients: [], ingredientLevel: false, solid };
    } else ing = stripSalt(lower);
    ingredients.push(ing);
    const m = /^(\d+(?:\.\d+)?)\s+(MG|MCG)(?!\/)\b/i.exec(words.slice(i).join(" "));
    if (m && !/^\S+\s+\S+\//.test(words.slice(i).join(" "))) {
      const v = parseFloat(m[1]);
      masses.push(m[2].toUpperCase() === "MCG" ? { value: v, unit: "mcg" } : { value: v, unit: "mg" });
    } else massOk = false;
  }
  if (ingredients.length === 0) return undefined;
  const plain = parts.length === 1 && !hasDigits && !formStated;
  const ingredientLevel =
    plain && /^[a-z][a-z \-]*$/.test(s) && !s.split(" ").some((w) => SALTS.has(w)) && ingredients.length === 1;
  let massPerUnit: ProductInfo["massPerUnit"];
  if (massOk && masses.length === 1 && ingredients.length === 1) massPerUnit = masses[0];
  return { ingredients, ingredientLevel, massPerUnit, solid };
}

/** Generic ingredient from a typed name, if the name plainly identifies one. */
function ingredientFromTyped(name: string): string | undefined {
  const candidates: string[] = [];
  const base = name.toLowerCase().replace(/[®™]/g, "").trim();
  const noParen = base.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  const inParen = [...base.matchAll(/\(([^)]*)\)/g)].map((m) => m[1].trim());
  for (const c of [noParen, ...inParen]) {
    if (!c) continue;
    candidates.push(c);
    // drop strength / form trailing words: "metformin 500mg", "metformin er tablets"
    const head = c.split(/\s+(?=\d)|\d/)[0].trim();
    candidates.push(head);
    candidates.push(head.replace(/\b(er|xr|xl|sr|la|cr|dr|ir|tablets?|tabs?|capsules?|caps?|pills?|pen|inhaler)\b/g, "").replace(/\s+/g, " ").trim());
  }
  for (const c of candidates) {
    if (!c) continue;
    if (BRANDS[c]) return BRANDS[c];
    const s = stripSalt(c);
    if (GENERICS.has(s)) return s;
    if (BRANDS[s]) return BRANDS[s];
  }
  return undefined;
}

const SENSITIVE: Record<string, Sensitivity> = {
  sertraline: "mental-health", escitalopram: "mental-health", fluoxetine: "mental-health", citalopram: "mental-health",
  paroxetine: "mental-health", bupropion: "mental-health", duloxetine: "mental-health", venlafaxine: "mental-health",
  desvenlafaxine: "mental-health", mirtazapine: "mental-health", quetiapine: "mental-health",
  aripiprazole: "mental-health", olanzapine: "mental-health", risperidone: "mental-health", lithium: "mental-health",
  ziprasidone: "mental-health", lurasidone: "mental-health", clozapine: "mental-health", haloperidol: "mental-health",
  buprenorphine: "substance-use", naltrexone: "substance-use", methadone: "substance-use",
  disulfiram: "substance-use", acamprosate: "substance-use", varenicline: "substance-use",
  levonorgestrel: "sexual-reproductive-health", norethindrone: "sexual-reproductive-health",
  medroxyprogesterone: "sexual-reproductive-health", etonogestrel: "sexual-reproductive-health",
  drospirenone: "sexual-reproductive-health", norgestimate: "sexual-reproductive-health",
  bictegravir: "hiv-sti", dolutegravir: "hiv-sti", emtricitabine: "hiv-sti", raltegravir: "hiv-sti",
  darunavir: "hiv-sti", rilpivirine: "hiv-sti", cabotegravir: "hiv-sti", efavirenz: "hiv-sti",
};

// ─── directions ──────────────────────────────────────────────────────────────────────────────────

const NUM_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5, "a half": 0.5, "one half": 0.5 };

function frequencyOf(dir: string | undefined): MedicationRow["frequency"] {
  if (!dir) return undefined;
  const d = dir.toLowerCase();
  if (/\b(as needed|when needed|if needed|prn|as required|when i need|if i need|when necessary)\b/.test(d)) return "PRN";
  if (/\bevery other\b|\bmonthly\b|\bevery \d+ (days|weeks|months)\b|\b(twice|two times|2 times|2x) (a|per) week\b/.test(d)) return "other";
  if (/\b(weekly|once a week|once per week|every week|1x (a|per) week|every (monday|tuesday|wednesday|thursday|friday|saturday|sunday)s?|on (mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays))\b/.test(d)) return "QW";
  if (/\b(four times|4 times|qid|every 6 hours)\b/.test(d)) return "other";
  if (/\b(three times|3 times|3x|tid|every 8 hours|with (each|every) meal|with meals)\b/.test(d)) return "TID";
  if (/\b(twice|two times|2 times|2x|bid|every 12 hours)\b/.test(d)) return "BID";
  if (/\b(once a day|once daily|once per day|1x a day|daily|every day|each day|qd|every 24 hours|a day)\b/.test(d) &&
      !/\bnight|bedtime\b/.test(d)) return "QD";
  const slots = [
    /\b(morning|breakfast|am|a\.m\.|wake|waking|get up)\b/,
    /\b(noon|lunch|midday|afternoon)\b/,
    /\b(evening|supper|dinner|pm|p\.m\.)\b/,
    /\b(bedtime|bed|night|nightly|sleep|hs|qhs)\b/,
  ].filter((r) => r.test(d)).length;
  const bedtimeOnly = slots === 1 && /\b(bedtime|bed|night|nightly|sleep|hs|qhs)\b/.test(d);
  if (/\bmost days\b|\bsometimes\b|\bsome days\b/.test(d)) return "other";
  if (slots === 1) return bedtimeOnly ? "QHS" : "QD";
  if (slots === 2) return "BID";
  if (slots === 3) return "TID";
  if (slots >= 4) return "other";
  if (/\b(once|daily|every day)\b/.test(d)) return "QD";
  return "other";
}

type Mass = { value: number; unit: "mg" | "mcg" };

function parseStrengthText(s: string | undefined): Mass | "concentration" | undefined {
  if (!s) return undefined;
  const t = s.toLowerCase().replace(/(\d),(\d{3})/g, "$1$2");
  if (/\d\s*[a-zµ]*\s*\/\s*\d*\s*(ml|l|actuat|puff|spray|hr|h|hour|day)\b/.test(t) || /\bper\s+ml\b/.test(t)) return "concentration";
  const all = [...t.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|g)\b/g)];
  if (all.length !== 1) return undefined;
  const v = parseFloat(all[0][1]);
  const u = all[0][2];
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u === "mg") return { value: v, unit: "mg" };
  return { value: v, unit: "mcg" };
}

function toMcg(m: Mass): number {
  return m.unit === "mg" ? m.value * 1000 : m.value;
}
function niceMass(m: Mass): Mass {
  if (m.unit === "mg" && m.value < 1) return { value: round(m.value * 1000, 6), unit: "mcg" };
  return { value: round(m.value, 6), unit: m.unit };
}

/** Amount per administration from the patient's direction, strength text and picked product. */
function doseOf(dir: string | undefined, strengthText: string | undefined, product: ProductInfo | undefined): MedicationRow["dose"] {
  if (!dir) return undefined;
  let d = " " + dir.toLowerCase().replace(/(\d),(\d{3})/g, "$1$2") + " ";
  // ranges: no single amount
  if (/\d+(\.\d+)?\s*(or|-|–|to)\s*\d+/.test(d) || /\b(one|two|three|half)\s+(or|to)\s+(one|two|three|four)\b/.test(d)) return undefined;
  if (/\b(sliding scale|per scale|depends|depending|varies|correction)\b/.test(d)) return undefined;

  // explicit amounts with units
  const units = [...d.matchAll(/(\d+(?:\.\d+)?)\s*(units?|u|iu|unt)\b/g)];
  if (units.length) {
    const vals = new Set(units.map((m) => parseFloat(m[1])));
    return vals.size === 1 ? { value: [...vals][0], unit: "units" } : undefined;
  }
  const masses = [...d.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug)\b/g)];
  if (masses.length) {
    const vals = new Set(masses.map((m) => `${m[1]} ${m[2]}`));
    if (vals.size !== 1) return undefined;
    const v = parseFloat(masses[0][1]);
    return masses[0][2] === "mg" ? { value: v, unit: "mg" } : { value: v, unit: "mcg" };
  }
  const mls = [...d.matchAll(/(\d+(?:\.\d+)?)\s*(ml|cc)\b/g)];
  if (mls.length) {
    const vals = new Set(mls.map((m) => parseFloat(m[1])));
    return vals.size === 1 ? { value: [...vals][0], unit: "mL" } : undefined;
  }
  if (/\b(puffs?|drops?|sprays?|patch|patches|teaspoons?|tsp|tablespoons?|scoops?|capfuls?|inhalations?)\b/.test(d)) return undefined;

  // remove timing phrases, then count what remains
  d = d
    .replace(/\b\d+\s*(times|time|x)\b/g, " ")
    .replace(/\bevery\s+\d+\s*(hours?|hrs?|h|days?|weeks?|months?)\b/g, " ")
    .replace(/\b\d{1,2}(:\d{2})?\s*(am|pm|a\.m\.|p\.m\.|o'?clock)/g, " ")
    .replace(/\b\d{1,2}:\d{2}\b/g, " ")
    .replace(/\b(one|two|three|four)\s+(times|time)\b/g, " ")
    .replace(/\bonce\b|\btwice\b/g, " ");
  const counts: number[] = [];
  for (const m of d.matchAll(/(\d+(?:\.\d+)?|\d+\/\d+)/g)) {
    const raw = m[1];
    counts.push(raw.includes("/") ? +raw.split("/")[0] / +raw.split("/")[1] : parseFloat(raw));
  }
  for (const m of d.matchAll(/\b(a half|one half|half|one|two|three|four)\b(?=\s+(of\s+a\s+|a\s+)?(tablets?|tabs?|pills?|capsules?|caps?|caplets?)?)/g)) {
    // "one" in phrases like "one in the morning" counts; "half" alone counts
    counts.push(NUM_WORDS[m[1]]);
  }
  let count: number;
  if (counts.length === 0) count = 1;
  else if (new Set(counts).size === 1) count = counts[0];
  else return undefined;
  if (!(count > 0)) return undefined;

  // per-tablet mass: strength text vs picked product
  const st = parseStrengthText(strengthText);
  if (st === "concentration") return undefined;
  if (product && product.solid === false) return undefined;
  const pm = product?.massPerUnit;
  let per: Mass | undefined;
  if (st && pm) {
    const a = toMcg(st), b = toMcg(pm);
    if (Math.abs(a - b) < 1e-9) per = pm;
    else if (Math.abs(a - b * 1000) < 1e-6 || Math.abs(a * 1000 - b) < 1e-6) per = pm; // mg/mcg slip in the typed strength
    else return undefined; // the patient's strength and the picked product disagree
  } else per = st ?? pm;
  if (per) {
    const total = niceMass({ value: per.value * count, unit: per.unit });
    return total;
  }
  if (strengthText && /\d/.test(strengthText)) return undefined; // a strength we could not read
  return { value: count, unit: "tablet" };
}

// ─── status from the patient's note ──────────────────────────────────────────────────────────────

const HOLD_RE =
  /\b(for now|on hold|hold(ing)? (it|off|this)|held|paus(e|ed|ing)|temporar(y|ily)|for a (few|couple|while|bit|week|month)|take a break|taking a break|until (after|my|the|i|we|surgery|procedure|further|next|told|cleared|labs?|kidney|doctor|dr)|till (after|my|the|i|surgery|next)|before (my |the )?(surgery|procedure|colonoscopy|scan|ct|mri|operation)|restart|resume|go back on|back on it (after|when))\b/i;

function isHoldNote(note: string | undefined): boolean {
  if (!note) return false;
  return HOLD_RE.test(note);
}
function takingButHeld(note: string | undefined): boolean {
  if (!note) return false;
  if (!isHoldNote(note) && !/\b(not taking|stopped taking|off it|told me to stop|said to stop|quit)\b/i.test(note)) return false;
  if (/\b(don'?t|do not|never|not)\s+(stop|pause|hold)/i.test(note)) return false;
  return isHoldNote(note) || /\b(right now|currently|at the moment|at present)\b/i.test(note);
}

function stopReasonOf(note: string | undefined): MedicationRow["stop_reason"] {
  if (!note) return undefined;
  const n = note.toLowerCase();
  if (/\b(switch(ed)?|changed (me )?to|replaced|instead|moved (me )?to|swapped)\b/.test(n)) return "therapy_changed";
  if (/\b(side effects?|made me|gave me|caused|reaction|allerg|rash|hives|itch|swell|cough|dizz|nause|vomit|diarr|upset stomach|stomach (upset|pain|issues|problems)|cramp|muscle (pain|ache)|aches|headache|tired|fatigue|yeast|infection|bleed|bruis|low blood sugar|lows|hypo|couldn'?t tolerate|did not tolerate|didn'?t tolerate|intoleran)/.test(n)) return "adverse_reaction";
  if (/\b(didn'?t work|did not work|not working|wasn'?t working|didn'?t help|did not help|not helping|no effect|ineffective|stopped working|no difference)\b/.test(n)) return "ineffective";
  if (/\b(finished|course (done|complete|over)|completed|ran its course|done with the course|only for \d+ (days|weeks))\b/.test(n)) return "course_complete";
  if (/\b(i (decided|chose|didn'?t want|don'?t want|did not want)|my (choice|decision)|too expensive|cost|afford|insurance)\b/.test(n)) return "patient_choice";
  return undefined;
}

// ─── medications ─────────────────────────────────────────────────────────────────────────────────

interface MedCandidate {
  row: MedicationRow;
  key: string;
  latestEvent: string;
  order: number;
}

function medRow(itemId: string, entryId: string, e: Record<string, any>): MedCandidate | undefined {
  const name = str(e.name);
  const pick = isObj(e.picked_from_search) ? e.picked_from_search : undefined;
  const pickDisplay = pick ? str(pick.display) : undefined;
  const pickCode = pick ? (typeof pick.rxnorm === "string" ? pick.rxnorm.trim() : typeof pick.rxnorm === "number" ? String(pick.rxnorm) : undefined) : undefined;
  const drugName = name ?? pickDisplay;
  if (!drugName) return undefined;

  const product = pickDisplay ? parseRxDisplay(pickDisplay) : undefined;
  let ingredient: string | undefined;
  let rxIngredient: string | undefined;
  if (product && product.ingredients.length) {
    ingredient = product.ingredients.join(" / ");
    if (product.ingredientLevel && pickCode && /^\d+$/.test(pickCode)) rxIngredient = pickCode;
  } else if (name) {
    ingredient = ingredientFromTyped(name);
  }

  const note = str(e.note);
  const started = partialDate(e.started);
  const stopped = partialDate(e.stopped);
  let status: MedicationRow["status"];
  let since: PartialDate | undefined;
  if (e.status === "stopped") {
    status = isHoldNote(note) ? "held" : "stopped";
    since = stopped;
  } else if (e.status === "taking") {
    if (takingButHeld(note)) {
      status = "held";
      since = undefined;
    } else {
      status = "active";
      since = started;
    }
  } else {
    status = "unknown";
  }

  const dir = str(e.how_i_take_it);
  const row: MedicationRow = {
    drug_name: drugName,
    status,
    patient_reported: true,
    evidence: [{ item_id: itemId, entry_id: entryId }],
  };
  if (ingredient) row.ingredient = ingredient;
  if (rxIngredient) row.rxnorm_ingredient = rxIngredient;
  if (since) row.status_since = since;
  const dose = doseOf(dir, str(e.strength_text), product);
  if (dose) row.dose = dose;
  const freq = frequencyOf(dir);
  if (freq) row.frequency = freq;
  if (status === "stopped") {
    const r = stopReasonOf(note);
    if (r) row.stop_reason = r;
  }
  if ((status === "stopped" || status === "held") && note) row.status_reason_text = note;
  if (e.kind === "over_the_counter") row.otc = true;
  if (ingredient) {
    const sens = new Set<Sensitivity>();
    for (const part of ingredient.split(" / ")) {
      const first = SENSITIVE[part] ?? SENSITIVE[part.split(" ")[0]];
      if (first) sens.add(first);
    }
    if (sens.size) row.sensitivity = [...sens].sort();
  }

  const key = ingredient ? `ing:${ingredient}` : `id:${str(e.homelog_med_id) ?? entryId}`;
  const latestEvent = [started ?? "", stopped ?? ""].sort().pop() ?? "";
  return { row, key, latestEvent, order: 0 };
}

function medications(current: FolioItem[]): MedicationRow[] {
  const lists = current.filter(isMedList).sort(laterFirst);
  const latest = lists[0];
  if (!latest) return [];
  const byKey = new Map<string, MedCandidate>();
  const order: string[] = [];
  let i = 0;
  for (const [entryId, e] of entriesOf(latest)) {
    if (e.type !== "my_med") continue;
    const c = medRow(latest.id, entryId, e);
    if (!c) continue;
    c.order = i++;
    const prev = byKey.get(c.key);
    if (!prev) {
      byKey.set(c.key, c);
      order.push(c.key);
      continue;
    }
    // same ingredient listed twice: keep the line whose own latest event is latest
    const better =
      c.latestEvent !== prev.latestEvent
        ? c.latestEvent > prev.latestEvent
        : prev.row.status === "stopped" && c.row.status !== "stopped";
    if (better) byKey.set(c.key, c);
  }
  return order.map((k) => byKey.get(k)!.row);
}

// ─── vitals ──────────────────────────────────────────────────────────────────────────────────────

interface VitalCandidate {
  row: VitalRow;
  kind: "bp" | "glu";
  device: boolean;
  minutes: number;
  sig: string;
}

function vitals(current: FolioItem[]): VitalRow[] {
  // One current day page per day; if several are current for a day, the latest restates the day.
  const pages = current.filter((it) => !isMedList(it)).sort(laterFirst);
  const seenDays = new Set<string>();
  const dayPages: FolioItem[] = [];
  for (const p of pages) {
    const day = typeof p.effective === "string" && /^\d{4}-\d{2}-\d{2}$/.test(p.effective) ? p.effective : undefined;
    if (day) {
      if (seenDays.has(day)) continue;
      seenDays.add(day);
    }
    dayPages.push(p);
  }

  const cands: VitalCandidate[] = [];
  for (const p of dayPages) {
    for (const [entryId, e] of entriesOf(p)) {
      const ev: Evidence = [{ item_id: p.id, entry_id: entryId }];
      if (e.type === "bp_reading") {
        const t = localTime(e.measured_at);
        const sys = num(e.systolic_mmhg), dia = num(e.diastolic_mmhg);
        if (!t || sys === undefined || dia === undefined) continue;
        const row: VitalRow = { setting: "home", local_time: t, systolic_mmhg: sys, diastolic_mmhg: dia, evidence: ev };
        const pulse = num(e.pulse_bpm);
        if (pulse !== undefined) row.pulse_bpm = pulse;
        cands.push({ row, kind: "bp", device: e.entry_method !== "typed", minutes: minutesOf(t), sig: `${sys}/${dia}` });
      } else if (e.type === "glucose_reading") {
        const t = localTime(e.measured_at);
        const v = num(e.value);
        if (!t || v === undefined) continue;
        let mg: number;
        if (e.unit === "mg/dL") mg = Math.round(v);
        else if (e.unit === "mmol/L") mg = Math.round(v * MG_PER_MMOL);
        else continue; // unit unknown: cannot read the value
        const row: VitalRow = { setting: "home", local_time: t, glucose_mg_dl: mg, evidence: ev };
        if (e.out_of_range === "HI" || e.out_of_range === "LO") row.glucose_out_of_range = e.out_of_range;
        cands.push({ row, kind: "glu", device: e.entry_method !== "typed", minutes: minutesOf(t), sig: `${mg}|${row.glucose_out_of_range ?? ""}` });
      }
    }
  }

  // Each measurement once: drop exact repeats, and typed copies of a device reading a few minutes apart.
  const keep: VitalCandidate[] = [];
  const sorted = cands.slice().sort((a, b) => Number(b.device) - Number(a.device) || cmpVital(a.row, b.row));
  for (const c of sorted) {
    const dup = keep.some((k) => {
      if (k.kind !== c.kind || k.sig !== c.sig) return false;
      if (k.row.local_time === c.row.local_time && (k.row.pulse_bpm === c.row.pulse_bpm || c.row.pulse_bpm === undefined || k.row.pulse_bpm === undefined))
        return true;
      if (!c.device && k.device && Math.abs(k.minutes - c.minutes) <= 5) {
        return c.row.pulse_bpm === undefined || k.row.pulse_bpm === undefined || c.row.pulse_bpm === k.row.pulse_bpm;
      }
      return false;
    });
    if (!dup) keep.push(c);
  }
  return keep.map((k) => k.row).sort(cmpVital);
}

function cmpVital(a: VitalRow, b: VitalRow): number {
  if (a.local_time !== b.local_time) return a.local_time < b.local_time ? -1 : 1;
  const ka = a.systolic_mmhg !== undefined ? 0 : 1, kb = b.systolic_mmhg !== undefined ? 0 : 1;
  if (ka !== kb) return ka - kb;
  const ea = a.evidence[0], eb = b.evidence[0];
  const sa = `${ea.item_id}|${ea.entry_id ?? ""}`, sb = `${eb.item_id}|${eb.entry_id ?? ""}`;
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}

// ─── entry point ─────────────────────────────────────────────────────────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return out;
  let current: FolioItem[];
  try {
    current = currentItems(items, asOf);
  } catch {
    return out;
  }
  try {
    out.medications = medications(current);
  } catch {
    out.medications = [];
  }
  try {
    out.vitals = vitals(current);
  } catch {
    out.vitals = [];
  }
  return out;
}
