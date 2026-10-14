import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  ProblemRow,
  AllergyIntoleranceRow,
  LabResultRow,
  VitalRow,
  Evidence,
  Sensitivity,
  Analyte,
} from "../in/views/views";

// Mapper for Northgate Family Medicine (northgate-chart-v1 ChartEvent payload entries).

const TZ = "America/Chicago";

// ---------------------------------------------------------------- time helpers

interface Parsed {
  y: string; mo?: string; d?: string; h?: string; mi?: string; s?: string;
  offset?: string; // "Z" or "+hh:mm"
}

function parseDT(v: unknown): Parsed | null {
  if (typeof v !== "string") return null;
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*(Z|z|[+-]\d{2}:?\d{2})?)?)?)?$/.exec(v.trim());
  if (!m) return null;
  return { y: m[1], mo: m[2], d: m[3], h: m[4], mi: m[5], s: m[6], offset: m[7] };
}

let fmtCache: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number) {
  if (!fmtCache) {
    fmtCache = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  }
  const o: Record<string, string> = {};
  for (const p of fmtCache.formatToParts(new Date(ms))) o[p.type] = p.value;
  const h = o.hour === "24" ? "00" : o.hour;
  return { y: o.year, mo: o.month, d: o.day, h, mi: o.minute, s: o.second };
}

function pad(n: number): string { return (n < 10 ? "0" : "") + n; }

function offsetMinutesAt(ms: number): number {
  const p = chicagoParts(ms);
  const asUtc = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +p.mi, +p.s);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

function fmtOffset(min: number): string {
  const sign = min < 0 ? "-" : "+";
  const a = Math.abs(min);
  return `${sign}${pad(Math.floor(a / 60))}:${pad(a % 60)}`;
}

function instantOf(p: Parsed): number | null {
  if (!p.offset || !p.d || !p.h) return null;
  let off = p.offset.toUpperCase() === "Z" ? "Z" : p.offset;
  if (off !== "Z" && !off.includes(":")) off = off.slice(0, 3) + ":" + off.slice(3);
  const ms = Date.parse(`${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}:${p.s ?? "00"}${off}`);
  return isNaN(ms) ? null : ms;
}

/** Local (Chicago) wall-clock parts: offsets converted, no-offset values kept as written. */
function localParts(v: unknown): Parsed | null {
  const p = parseDT(v);
  if (!p) return null;
  if (p.offset && p.h) {
    const ms = instantOf(p);
    if (ms === null) return null;
    const c = chicagoParts(ms);
    return { y: c.y, mo: c.mo, d: c.d, h: c.h, mi: c.mi, s: c.s };
  }
  return { y: p.y, mo: p.mo, d: p.d, h: p.h, mi: p.mi, s: p.s };
}

/** Local date with source precision (YYYY, YYYY-MM or YYYY-MM-DD). */
function localDate(v: unknown): string | undefined {
  const p = localParts(v);
  if (!p) return undefined;
  if (!p.mo) return p.y;
  if (!p.d) return `${p.y}-${p.mo}`;
  return `${p.y}-${p.mo}-${p.d}`;
}

/** Sortable local key. */
function sortKey(v: unknown): string {
  const p = localParts(v);
  if (!p) return "";
  let k = p.y;
  if (p.mo) k += "-" + p.mo;
  if (p.d) k += "-" + p.d;
  if (p.h) k += "T" + p.h + ":" + p.mi + ":" + (p.s ?? "00");
  return k;
}

function localMinute(v: unknown): string | undefined {
  const p = localParts(v);
  if (!p) return undefined;
  if (!p.mo || !p.d) return localDate(v);
  if (!p.h) return `${p.y}-${p.mo}-${p.d}`;
  return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}`;
}

/** RFC 3339 with the America/Chicago offset. */
function rfc3339Local(v: unknown): string | undefined {
  const p = parseDT(v);
  if (!p) return undefined;
  if (!p.mo || !p.d || !p.h) return typeof v === "string" ? v : undefined;
  if (p.offset) {
    const ms = instantOf(p);
    if (ms === null) return undefined;
    const c = chicagoParts(ms);
    return `${c.y}-${c.mo}-${c.d}T${c.h}:${c.mi}:${c.s}${fmtOffset(offsetMinutesAt(ms))}`;
  }
  const s = p.s ?? "00";
  const wall = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +(p.mi ?? "0"), +s);
  let off = offsetMinutesAt(wall);
  off = offsetMinutesAt(wall - off * 60000);
  return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}:${s}${fmtOffset(off)}`;
}

function fuzzy(fd: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!fd || typeof fd !== "object" || typeof fd.date !== "string") return undefined;
  const d = localDate(fd.date);
  if (!d) return undefined;
  let prec: "year" | "month" | "day" = fd.precision === "year" || fd.precision === "month" || fd.precision === "day"
    ? fd.precision : (d.length === 4 ? "year" : d.length === 7 ? "month" : "day");
  const len = prec === "year" ? 4 : prec === "month" ? 7 : 10;
  if (d.length < len) prec = d.length === 4 ? "year" : "month";
  return { value: d.slice(0, prec === "year" ? 4 : prec === "month" ? 7 : 10), precision: prec };
}

// ---------------------------------------------------------------- text helpers

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}
function num(v: unknown): number | undefined {
  return typeof v === "number" && isFinite(v) ? v : undefined;
}
function round(v: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

// ---------------------------------------------------------------- drug knowledge

const BRANDS: Record<string, string> = {
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  januvia: "sitagliptin", tradjenta: "linagliptin", glucophage: "metformin", glucotrol: "glipizide",
  amaryl: "glimepiride", actos: "pioglitazone", kerendia: "finerenone",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  zetia: "ezetimibe", zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  lotensin: "benazepril", cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan",
  micardis: "telmisartan", norvasc: "amlodipine", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide",
  aldactone: "spironolactone", microzide: "hydrochlorothiazide", coreg: "carvedilol", toprol: "metoprolol",
  lopressor: "metoprolol", tenormin: "atenolol", synthroid: "levothyroxine", levoxyl: "levothyroxine",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", flovent: "fluticasone",
  singulair: "montelukast", keflex: "cephalexin", amoxil: "amoxicillin", augmentin: "amoxicillin",
  zithromax: "azithromycin", cipro: "ciprofloxacin", levaquin: "levofloxacin", bactrim: "sulfamethoxazole",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine",
  effexor: "venlafaxine", cymbalta: "duloxetine", wellbutrin: "bupropion", seroquel: "quetiapine",
  abilify: "aripiprazole", zyprexa: "olanzapine", risperdal: "risperidone", xanax: "alprazolam",
  klonopin: "clonazepam", ativan: "lorazepam", ambien: "zolpidem", suboxone: "buprenorphine",
  subutex: "buprenorphine", vivitrol: "naltrexone", narcan: "naloxone", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", plavix: "clopidogrel", prilosec: "omeprazole", nexium: "esomeprazole",
  protonix: "pantoprazole", pepcid: "famotidine", zyrtec: "cetirizine", claritin: "loratadine",
  allegra: "fexofenadine", tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen",
  aleve: "naproxen", neurontin: "gabapentin", lyrica: "pregabalin", zyloprim: "allopurinol",
  uloric: "febuxostat", flomax: "tamsulosin", biktarvy: "bictegravir", truvada: "emtricitabine",
  descovy: "emtricitabine", entresto: "sacubitril", lisinoprilhctz: "lisinopril",
};

const CLASS_MEMBERS: Record<string, string[]> = {
  penicillin: ["amoxicillin", "ampicillin", "penicillin", "penicillin v", "penicillin g", "dicloxacillin", "nafcillin", "oxacillin", "piperacillin"],
  cephalosporin: ["cephalexin", "cefazolin", "cefdinir", "cefuroxime", "ceftriaxone", "cefpodoxime", "cefadroxil", "cefepime", "cefprozil", "cefixime"],
  sulfonamide: ["sulfamethoxazole", "sulfadiazine", "sulfasalazine"],
  macrolide: ["azithromycin", "clarithromycin", "erythromycin"],
  fluoroquinolone: ["ciprofloxacin", "levofloxacin", "moxifloxacin", "ofloxacin"],
  tetracycline: ["doxycycline", "minocycline", "tetracycline"],
  "ace inhibitor": ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"],
  "angiotensin receptor blocker": ["losartan", "valsartan", "irbesartan", "olmesartan", "telmisartan", "candesartan", "azilsartan"],
  statin: ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin", "fluvastatin", "pitavastatin"],
  nsaid: ["ibuprofen", "naproxen", "meloxicam", "diclofenac", "celecoxib", "ketorolac", "indomethacin", "aspirin", "etodolac", "nabumetone"],
  opioid: ["oxycodone", "hydrocodone", "morphine", "codeine", "tramadol", "hydromorphone", "fentanyl", "methadone", "tapentadol"],
  "sglt2 inhibitor": ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"],
  "glp-1": ["semaglutide", "dulaglutide", "liraglutide", "exenatide", "tirzepatide"],
  sulfonylurea: ["glipizide", "glyburide", "glimepiride"],
  thiazide: ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone"],
  "beta blocker": ["metoprolol", "carvedilol", "atenolol", "propranolol", "bisoprolol", "nadolol", "labetalol", "nebivolol"],
  "calcium channel blocker": ["amlodipine", "nifedipine", "diltiazem", "verapamil", "felodipine"],
  "loop diuretic": ["furosemide", "bumetanide", "torsemide"],
  glucocorticoid: ["prednisone", "prednisolone", "methylprednisolone", "dexamethasone", "hydrocortisone"],
  anticoagulant: ["warfarin", "apixaban", "rivaroxaban", "dabigatran", "edoxaban", "heparin", "enoxaparin"],
};

/** Class keyword in text → class key. */
const CLASS_PATTERNS: [RegExp, string][] = [
  [/penicillin/i, "penicillin"], [/cephalosporin/i, "cephalosporin"], [/sulfonamide|sulfa\b/i, "sulfonamide"],
  [/macrolide/i, "macrolide"], [/fluoroquinolone|quinolone/i, "fluoroquinolone"], [/tetracycline/i, "tetracycline"],
  [/ace[- ]?inhibitor|angiotensin[- ]converting/i, "ace inhibitor"], [/\barb\b|angiotensin receptor/i, "angiotensin receptor blocker"],
  [/statin\b|hmg[- ]coa|antihyperlipid/i, "statin"], [/nsaid|nonsteroidal|non-steroidal/i, "nsaid"],
  [/opioid|opiate|narcotic/i, "opioid"], [/sglt-?2/i, "sglt2 inhibitor"], [/glp-?1/i, "glp-1"],
  [/sulfonylurea/i, "sulfonylurea"], [/thiazide/i, "thiazide"], [/beta[- ]?blocker|beta-adrenergic/i, "beta blocker"],
  [/calcium[- ]channel/i, "calcium channel blocker"], [/loop diuretic/i, "loop diuretic"],
  [/glucocorticoid|corticosteroid/i, "glucocorticoid"], [/anticoagulant/i, "anticoagulant"],
];

/** ICD-10-CM T-code (adverse effect) prefixes → class wording. */
const T_CLASSES: [string, string][] = [
  ["T36.0", "Penicillins"], ["T36.1", "Cephalosporins"], ["T36.3", "Macrolides"], ["T36.4", "Tetracyclines"],
  ["T37.0", "Sulfonamides"], ["T36.8", "Fluoroquinolones"], ["T38.0", "Glucocorticoids"],
  ["T39.01", "aspirin"], ["T39.1", "acetaminophen"], ["T39.31", "Propionic acid derivatives"], ["T39.39", "NSAIDs"],
  ["T40.2", "Opioids"], ["T40.4", "Opioids"], ["T45.51", "Anticoagulants"], ["T46.4", "ACE inhibitors"],
  ["T46.5", "Antihypertensive drugs"], ["T46.6", "Statins"], ["T38.3", "Insulin and oral hypoglycemic drugs"],
  ["T50.1", "Loop diuretics"], ["T50.2", "Thiazides"],
];

const ALL_GENERICS = new Set<string>([
  ...Object.values(BRANDS), ...([] as string[]).concat(...Object.values(CLASS_MEMBERS)),
  "metformin", "insulin", "glipizide", "potassium chloride", "allopurinol", "colchicine", "gabapentin",
  "acetaminophen", "aspirin", "omeprazole", "lisinopril", "amlodipine", "hydralazine", "clonidine",
  "spironolactone", "eplerenone", "finerenone", "sodium bicarbonate", "trimethoprim", "nitrofurantoin",
  "vancomycin", "clindamycin", "metronidazole", "isoniazid", "valproate", "valproic acid", "carbamazepine",
  "phenytoin", "lamotrigine", "contrast", "iodinated contrast", "lithium",
]);

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "magnesium", "besylate", "besilate", "maleate",
  "mesylate", "succinate", "tartrate", "bitartrate", "fumarate", "citrate", "sulfate", "acetate", "bromide",
  "phosphate", "trihydrate", "monohydrate", "dihydrate", "anhydrous", "hyclate", "propionate", "dipropionate",
  "furoate", "valerate", "xinafoate", "hydrobromide", "disodium", "dihydrochloride", "lactate", "gluconate",
  "pamoate", "decanoate", "monosodium", "medoxomil", "cilexetil", "axetil", "hemifumarate", "erbumine",
]);

const FORM_WORDS = new Set([
  "oral", "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "solution", "suspension", "injection",
  "injectable", "pen", "injector", "auto-injector", "prefilled", "syringe", "inhaler", "inhalation", "aerosol",
  "metered", "dose", "hfa", "cream", "ointment", "gel", "patch", "transdermal", "topical", "extended", "release",
  "delayed", "er", "xr", "sr", "dr", "xl", "la", "cr", "ec", "odt", "disintegrating", "chewable", "film", "coated",
  "powder", "nasal", "spray", "ophthalmic", "drops", "otic", "vaginal", "rectal", "suppository", "kit", "pack",
  "cartridge", "vial", "liquid", "elixir", "syrup", "lotion", "foam", "shampoo", "lozenge", "sublingual",
  "buccal", "mg", "ml", "mcg", "unt", "actuat", "dry", "diskus", "respimat", "ellipta", "flexpen", "kwikpen",
  "solostar", "hr", "day",
]);

function normIngredientWords(words: string[]): string | undefined {
  const w = words.map((x) => x.toLowerCase().replace(/[(),®™]/g, "")).filter((x) => x !== "");
  if (w.length === 0) return undefined;
  // brand lookup on the first word
  if (BRANDS[w[0]]) return BRANDS[w[0]];
  const kept: string[] = [];
  for (let i = 0; i < w.length; i++) {
    const x = w[i];
    if (FORM_WORDS.has(x)) continue;
    if (i > 0 && SALTS.has(x)) continue;
    kept.push(x);
  }
  if (kept.length === 0) return undefined;
  const joined = kept.join(" ");
  if (BRANDS[joined]) return BRANDS[joined];
  return joined;
}

/** Generic ingredient names from a drug name; one per ingredient of a combination. */
function ingredientsOf(name: string): string[] {
  let s = name.replace(/\{[^}]*\}/g, " ");
  const brand = /\[([^\]]+)\]/.exec(s);
  s = s.replace(/\[[^\]]*\]/g, " ").trim();
  // leading package quantity (e.g. "3 ML insulin glargine ...", "24 HR metoprolol ...")
  s = s.replace(/^(\d+(\.\d+)?\s*(ml|hr|actuat|mg|day)\s+)+/i, "");
  const parts = s.split(/\s+\/\s+|\s+and\s+|\s*\+\s*/i);
  const out: string[] = [];
  for (const part of parts) {
    const toks = part.trim().split(/\s+/);
    const words: string[] = [];
    for (const t of toks) {
      if (/^[\d.]/.test(t)) break;
      words.push(t);
    }
    const ing = normIngredientWords(words);
    if (ing && /[a-z]/.test(ing) && !out.includes(ing)) out.push(ing);
  }
  if (out.length === 0 && brand) {
    const b = brand[1].toLowerCase().split(/\s+/)[0];
    if (BRANDS[b]) out.push(BRANDS[b]);
  }
  return out;
}

/** Per-ingredient strength of each component of a (combination) drug name. */
function componentStrengths(name: string): Map<string, { value: number; unit: DoseUnit }> {
  const out = new Map<string, { value: number; unit: DoseUnit }>();
  let s = name.replace(/\{[^}]*\}/g, " ").replace(/\[[^\]]*\]/g, " ").trim();
  s = s.replace(/^(\d+(\.\d+)?\s*(ml|hr|actuat|mg|day)\s+)+/i, "");
  for (const part of s.split(/\s+\/\s+|\s+and\s+|\s*\+\s*/i)) {
    const ings = ingredientsOf(part);
    const st = strengthOf(part);
    if (ings.length === 1 && st) out.set(ings[0], st);
  }
  return out;
}

/** Name is a bare ingredient (no strength or form), so a code given with it is ingredient-level. */
function isBareIngredientName(name: string): boolean {
  if (/\d|\[|\//.test(name)) return false;
  const words = name.toLowerCase().split(/\s+/);
  if (words.some((w) => FORM_WORDS.has(w) || (SALTS.has(w) && words.length > 1 && w !== words[0]))) return false;
  return !BRANDS[words[0]];
}

function classOf(text: string): string | undefined {
  for (const [re, k] of CLASS_PATTERNS) if (re.test(text)) return k;
  return undefined;
}

// ---------------------------------------------------------------- sensitivity

const MH_DRUGS = [
  "sertraline", "fluoxetine", "escitalopram", "citalopram", "paroxetine", "venlafaxine", "desvenlafaxine",
  "duloxetine", "bupropion", "mirtazapine", "trazodone", "vortioxetine", "vilazodone", "quetiapine", "olanzapine",
  "risperidone", "paliperidone", "aripiprazole", "brexpiprazole", "cariprazine", "ziprasidone", "lurasidone",
  "haloperidol", "clozapine", "lithium", "buspirone", "alprazolam", "clonazepam", "lorazepam", "methylphenidate",
  "amphetamine", "dextroamphetamine", "lisdexamfetamine", "atomoxetine", "guanfacine er", "fluphenazine",
  "chlorpromazine", "perphenazine",
];
const SU_DRUGS = ["buprenorphine", "naltrexone", "methadone", "disulfiram", "acamprosate", "naloxone"];
const HIV_DRUGS = [
  "bictegravir", "emtricitabine", "tenofovir", "dolutegravir", "raltegravir", "elvitegravir", "efavirenz",
  "rilpivirine", "darunavir", "atazanavir", "abacavir", "cabotegravir", "lenacapavir", "doravirine", "zidovudine",
];
const SRH_DRUGS = [
  "ethinyl estradiol", "norethindrone", "levonorgestrel", "drospirenone", "norgestimate", "desogestrel",
  "etonogestrel", "medroxyprogesterone", "ulipristal", "mifepristone", "misoprostol", "clomiphene", "segesterone",
];

function drugSensitivity(ingredients: string[], restricted: boolean): Sensitivity[] {
  const out = new Set<Sensitivity>();
  for (const i of ingredients) {
    if (MH_DRUGS.some((d) => i === d || i.startsWith(d + " "))) out.add("mental-health");
    if (SU_DRUGS.some((d) => i === d)) out.add("substance-use");
    if (HIV_DRUGS.some((d) => i === d)) out.add("hiv-sti");
    if (SRH_DRUGS.some((d) => i === d)) out.add("sexual-reproductive-health");
  }
  // Northgate's only restriction category is BH (behavioral health).
  if (restricted && !out.has("substance-use") && !out.has("mental-health")) out.add("mental-health");
  return [...out].sort();
}

function icdSensitivity(icd: string | undefined, text: string, restricted: boolean): Sensitivity[] {
  const out = new Set<Sensitivity>();
  const c = (icd ?? "").toUpperCase().replace(/\s/g, "");
  const cat = c.slice(0, 3);
  const n = parseInt(cat.slice(1), 10);
  const L = cat[0];
  if (L === "F" && !isNaN(n)) {
    if (n >= 10 && n <= 19) { if (n !== 17) out.add("substance-use"); }
    else if (n >= 4) out.add("mental-health");
  }
  if (c.startsWith("R45.851") || c.startsWith("T14.91") || c.startsWith("Z91.5")) out.add("mental-health");
  if (L === "A" && n >= 50 && n <= 64) out.add("hiv-sti");
  if (cat === "B20" || cat === "Z21" || c.startsWith("B97.35") || c.startsWith("Z20.2") || c.startsWith("Z20.6") || cat === "R75") out.add("hiv-sti");
  if (L === "O" || cat === "Z3A" || cat === "Z30" || cat === "Z31" || cat === "Z32" || cat === "Z33" || cat === "Z34" || cat === "Z35" || cat === "Z36" || cat === "Z37" || cat === "Z39" || cat === "N97" || cat === "N96" || cat === "N98" || cat === "N52") out.add("sexual-reproductive-health");
  if (cat === "Z14" || cat === "Z15" || cat === "D56" || cat === "D57" || cat === "E84" || cat === "G10" || (L === "Q" && n >= 90)) out.add("genetic");
  const t = text.toLowerCase();
  if (/\b(hiv|chlamydia|gonorrh|syphilis|trichomon|genital herpes|genital warts)\b/.test(t)) out.add("hiv-sti");
  if (/\b(brca[12]?|lynch syndrome|hereditary|genetic)\b/.test(t)) out.add("genetic");
  if (/\b(opioid use|alcohol use|alcohol dependence|substance use|cocaine|methamphetamine|cannabis use)\b/.test(t)) out.add("substance-use");
  if (/\b(depress|bipolar|schizo|anxiety disorder|ptsd|post-traumatic|psychos|adhd|panic disorder|obsessive|eating disorder|anorexia nervosa|bulimia)/.test(t)) out.add("mental-health");
  if (/\b(pregnan|contracept|infertil|erectile)/.test(t)) out.add("sexual-reproductive-health");
  if (restricted && !out.has("substance-use") && !out.has("mental-health")) out.add("mental-health");
  return [...out].sort();
}

// ---------------------------------------------------------------- reactions

const HYPER_RE = /hive|urticari|rash|swell|angioedema|anaphyla|bronchospasm|wheez|itch|prurit|exanthem|stevens|johnson|\bsjs\b|toxic epidermal|\bten\b|\bdress\b|blister|throat (tight|clos)|shortness of breath|dyspnea|hypotension|flushing with/i;
const SERIOUS_RE = /liver|hepat|pancreatit|rhabdo|agranulocyt|neutropeni|thrombocytopeni|aplastic|kidney injury|renal failure|acute kidney|nephrit|qt prolong|torsade|arrhythm|seizure|lactic acidosis|ketoacidosis|bleed|hemorrhag|tendon rupture|myopathy with|hyperkalemi|hyponatremi|hypoglycemi|serotonin syndrome|neuroleptic malignant|osteonecrosis|interstitial lung|pneumonitis/i;
const NONIMMUNE_RE = /cough|nausea|vomit|diarrh|upset stomach|stomach upset|gi upset|dyspepsia|abdominal pain|constipat|drowsi|sedat|somnolen|dizz|lighthead|headache|myalgia|muscle (ache|pain)|fatigue|insomnia|jitter|tremor|palpitat|edema|ankle swelling|leg swelling|dry mouth|taste|flushing|frequent urination|yeast infection/i;

function classifyReaction(reaction: string, sourceType?: string): {
  type: "hypersensitivity" | "side_effect" | "serious_adverse_event"; mechanism: "immune" | "non_immune" | "unknown";
} {
  const r = reaction;
  // peripheral/ankle edema is not hypersensitivity swelling
  const hyper = HYPER_RE.test(r.replace(/(ankle|leg|peripheral|pedal|feet|foot) (swelling|edema)/gi, ""));
  if (hyper) return { type: "hypersensitivity", mechanism: /\bige\b|immune[- ]mediated|positive (skin|allergy) test/i.test(r) ? "immune" : "unknown" };
  if (SERIOUS_RE.test(r)) return { type: "serious_adverse_event", mechanism: "unknown" };
  if (NONIMMUNE_RE.test(r)) return { type: "side_effect", mechanism: "non_immune" };
  if (r.trim() === "") {
    if (sourceType === "allergy") return { type: "hypersensitivity", mechanism: "unknown" };
    return { type: "side_effect", mechanism: "unknown" };
  }
  if (sourceType === "allergy") return { type: "hypersensitivity", mechanism: "unknown" };
  return { type: "side_effect", mechanism: "unknown" };
}

// ---------------------------------------------------------------- item selection

interface Entry { item: FolioItem; key: string; e: any }

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const valid = (items ?? []).filter((it) => it && typeof it === "object" && typeof it.id === "string");
  if (valid.length === 0) return [];
  const issuer = valid[0].issuer;
  const counted = valid.filter((it) => {
    if (it.issuer !== issuer) return false;
    const d = localDate(it.recorded);
    return !!d && d.length === 10 && d <= asOf;
  });
  const byId = new Map<string, FolioItem>();
  for (const it of counted) byId.set(it.id, it);

  const retractsOf = (it: FolioItem): string[] => {
    const out: string[] = [];
    if (Array.isArray(it.retracts)) for (const r of it.retracts) if (typeof r === "string") out.push(r);
    const p = it.payload;
    if (p && typeof p === "object") {
      for (const k of Object.keys(p)) {
        const e = p[k];
        if (e && e.type === "chart_correction" && Array.isArray(e.voided_items)) {
          for (const r of e.voided_items) if (typeof r === "string") out.push(r);
        }
      }
    }
    return out;
  };

  // Retracted items: iterate until stable, since a retracted item's own retractions do not apply.
  let retracted = new Set<string>();
  for (let iter = 0; iter < 20; iter++) {
    const next = new Set<string>();
    for (const it of counted) if (!retracted.has(it.id)) for (const r of retractsOf(it)) if (r !== it.id) next.add(r);
    const same = next.size === retracted.size && [...next].every((x) => retracted.has(x));
    retracted = next;
    if (same) break;
  }
  // Supersession, transitive, from counting non-retracted items.
  const superseded = new Set<string>();
  const stack: string[] = [];
  for (const it of counted) {
    if (retracted.has(it.id)) continue;
    if (Array.isArray(it.supersedes)) for (const s of it.supersedes) if (typeof s === "string" && s !== it.id) stack.push(s);
  }
  const allById = new Map<string, FolioItem>();
  for (const it of valid) allById.set(it.id, it);
  while (stack.length) {
    const id = stack.pop()!;
    if (superseded.has(id)) continue;
    superseded.add(id);
    const it = allById.get(id);
    if (it && Array.isArray(it.supersedes)) for (const s of it.supersedes) if (typeof s === "string") stack.push(s);
  }
  return counted.filter((it) => !retracted.has(it.id) && !superseded.has(it.id));
}

function entriesOf(items: FolioItem[]): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    const p = item.payload;
    if (!p || typeof p !== "object") continue;
    for (const key of Object.keys(p)) {
      const e = p[key];
      if (e && typeof e === "object" && typeof e.type === "string") out.push({ item, key, e });
    }
  }
  return out;
}

function cmpEntries(a: Entry, b: Entry): number {
  const ka = sortKey(a.item.effective), kb = sortKey(b.item.effective);
  if (ka !== kb) return ka < kb ? -1 : 1;
  const ra = sortKey(a.item.recorded), rb = sortKey(b.item.recorded);
  if (ra !== rb) return ra < rb ? -1 : 1;
  if (a.item.id !== b.item.id) return a.item.id < b.item.id ? -1 : 1;
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function ev(entries: Entry[]): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const x of entries) {
    const k = x.item.id + "#" + x.key;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: x.item.id, entry_id: x.key });
  }
  return out;
}

// ---------------------------------------------------------------- medications

type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";

function normUnit(u: string): { unit: DoseUnit; factor: number } | { count: true } | null {
  const x = u.trim().toLowerCase().replace(/\.$/, "");
  if (/^(mg|mgs|milligrams?)$/.test(x)) return { unit: "mg", factor: 1 };
  if (/^(g|gm|grams?)$/.test(x)) return { unit: "mg", factor: 1000 };
  if (/^(mcg|µg|μg|ug|micrograms?)$/.test(x)) return { unit: "mcg", factor: 1 };
  if (/^(u|iu|units?|unt|international units?)$/.test(x)) return { unit: "units", factor: 1 };
  if (/^(ml|cc|milliliters?|millilitres?)$/.test(x)) return { unit: "mL", factor: 1 };
  if (/^(tab|tabs|tablets?|capsules?|caps?|puffs?|actuations?|sprays?|inhalations?|patch(es)?|pens?)$/.test(x)) return { count: true };
  return null;
}

/** Single strength in a drug name, e.g. "90 MCG/ACTUAT" → {90, mcg}. Undefined for combinations or concentrations per mL. */
function strengthOf(name: string): { value: number; unit: DoseUnit } | undefined {
  const ms = [...name.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|unt|units?|g)\b(\s*\/\s*(ml|actuat\w*|puff|spray|hr))?/gi)];
  if (ms.length !== 1) return undefined;
  const m = ms[0];
  if (m[4] && /^ml$/i.test(m[4])) return undefined;
  if (m[4] && /^hr$/i.test(m[4])) return undefined;
  const u = normUnit(m[2]);
  if (!u || "count" in u) return undefined;
  return { value: parseFloat(m[1]) * u.factor, unit: u.unit };
}

function doseFrom(d: any, drugName: string, combo: boolean, ingredient?: string): { value: number; unit: DoseUnit } | undefined {
  if (!d || typeof d !== "object") return undefined;
  const v = num(d.value);
  const u = str(d.unit);
  if (v === undefined || !u || v <= 0) return undefined;
  const nu = normUnit(u);
  if (!nu) return undefined;
  if ("count" in nu) {
    if (combo && ingredient) {
      const s = componentStrengths(drugName).get(ingredient);
      if (s) return { value: round(v * s.value, 4), unit: s.unit };
    }
    if (!combo) {
      const s = strengthOf(drugName);
      if (s) return { value: round(v * s.value, 4), unit: s.unit };
    }
    if (/^tab/i.test(u.trim()) && !combo) return { value: v, unit: "tablet" };
    return undefined;
  }
  if (combo) return undefined;
  return { value: round(v * nu.factor, 4), unit: nu.unit };
}

function doseFromSig(sig: string, drugName: string, combo: boolean, ingredient?: string): { value: number; unit: DoseUnit } | undefined {
  if (/sliding|scale|per protocol|as directed|\d\s*(-|–|to|or)\s*\d|varies|depending|if\s/i.test(sig)) return undefined;
  const m = /\b(?:take|inject|inhale|give|use|apply|instill)\s+(\d+(?:\.\d+)?|one|two|three|four|half)\s*(tablets?|tabs?|capsules?|caps?|puffs?|units?|mg|mcg|ml|sprays?)\b/i.exec(sig);
  if (!m) return undefined;
  const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5 };
  const v = words[m[1].toLowerCase()] ?? parseFloat(m[1]);
  return doseFrom({ value: v, unit: m[2] }, drugName, combo, ingredient);
}

type Freq = NonNullable<MedicationRow["frequency"]>;

function freqFromSig(sig: string): Freq | undefined {
  const s = sig.toLowerCase();
  if (/\b(prn|as needed)\b/.test(s)) return "PRN";
  if (/\b(once (a )?week(ly)?|every week|weekly|qw|q ?week)\b/.test(s)) return "QW";
  if (/\b(four times|qid|every 6 hours|q6h|every other day|monthly|taper)\b/.test(s)) return "other";
  if (/\b(three times|tid|every 8 hours|q8h)\b/.test(s)) return "TID";
  if (/\b(twice|bid|every 12 hours|q12h)\b/.test(s)) return "BID";
  if (/\b(at bedtime|qhs|nightly|at night)\b/.test(s)) return "QHS";
  if (/\b(once (a )?daily|daily|every day|qd|every morning|each morning|once a day)\b/.test(s)) return "QD";
  return undefined;
}

function mapFreq(f: unknown, sig: string | undefined): Freq | undefined {
  if (f === "QD" || f === "BID" || f === "TID" || f === "QHS" || f === "PRN") return f;
  if (f === "OTHER") {
    const s = sig ? freqFromSig(sig) : undefined;
    return s === "QW" ? "QW" : "other";
  }
  return sig ? freqFromSig(sig) : undefined;
}

const STOP_REASONS = new Set(["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"]);

interface MedCandidate { row: MedicationRow; latestKey: string; latestRec: string; lineId: string }

function buildMedications(entries: Entry[]): MedicationRow[] {
  const lines = new Map<string, Entry[]>();
  for (const x of entries) {
    if (x.e.type !== "med_event") continue;
    const id = str(x.e.med_id);
    if (!id) continue;
    if (!lines.has(id)) lines.set(id, []);
    lines.get(id)!.push(x);
  }
  const candidates: MedCandidate[] = [];
  for (const [lineId, evs] of lines) {
    evs.sort(cmpEntries);
    let status: MedicationRow["status"] | undefined;
    let since: string | undefined;
    let drugName: string | undefined;
    let rxnorm: string | undefined;
    let dose: any;
    let freqRaw: unknown;
    let sig: string | undefined;
    let stopReason: string | undefined;
    let reasonText: string | undefined;
    let restricted = false;
    let statusEntry: Entry | undefined;
    for (const x of evs) {
      const e = x.e;
      const date = localDate(x.item.effective);
      const name = str(e.drug?.name);
      if (name) { drugName = name; rxnorm = str(e.drug?.rxnorm); }
      if (e.dose && typeof e.dose === "object") dose = e.dose;
      if (e.frequency !== undefined) freqRaw = e.frequency;
      if (str(e.sig)) sig = str(e.sig);
      if (e.restricted === "BH") restricted = true;
      const act = e.action;
      if (act === "start" || act === "resume") {
        status = "active"; since = date; statusEntry = x;
      } else if (act === "change") {
        if (status !== "active" && status !== "held") since = date;
        if (status !== "held") status = "active";
        statusEntry = x;
        if (status === "held") { /* dose change while held keeps the hold */ }
      } else if (act === "hold") {
        status = "held"; since = date; statusEntry = x;
      } else if (act === "stop") {
        status = "stopped"; since = date; statusEntry = x;
      } else continue;
      stopReason = act === "stop" && typeof e.stop_reason === "string" && STOP_REASONS.has(e.stop_reason) ? e.stop_reason : undefined;
      reasonText = str(e.reason_text);
    }
    if (!status || !drugName || !statusEntry) continue;
    const ings = ingredientsOf(drugName);
    const combo = ings.length > 1;
    const doseFor = (ing: string | undefined) => {
      let d = doseFrom(dose, drugName!, combo, ing);
      if (!d && !dose && sig) d = doseFromSig(sig, drugName!, combo, ing);
      return d;
    };
    const freq = mapFreq(freqRaw, sig);
    const latest = evs[evs.length - 1];
    const bare = isBareIngredientName(drugName) && ings.length === 1;
    const base = (ing: string | undefined): MedicationRow => {
      const row: MedicationRow = { drug_name: drugName!, status: status!, patient_reported: false, evidence: ev(evs) };
      if (ing) row.ingredient = ing;
      if (ing && bare && rxnorm) row.rxnorm_ingredient = rxnorm;
      if (since) row.status_since = since;
      const d = doseFor(ing);
      if (d) row.dose = d;
      if (freq) row.frequency = freq;
      if (status === "stopped" && stopReason) row.stop_reason = stopReason as MedicationRow["stop_reason"];
      if (reasonText) row.status_reason_text = reasonText;
      const sens = drugSensitivity(ing ? [ing] : ings, restricted);
      if (sens.length) row.sensitivity = sens;
      return row;
    };
    const latestKey = sortKey(latest.item.effective);
    const latestRec = sortKey(latest.item.recorded);
    if (ings.length === 0) candidates.push({ row: base(undefined), latestKey, latestRec, lineId });
    else for (const ing of ings) candidates.push({ row: base(ing), latestKey, latestRec, lineId });
  }
  const byIng = new Map<string, MedCandidate>();
  for (const c of candidates) {
    const k = c.row.ingredient ? "i:" + c.row.ingredient : "l:" + c.lineId;
    const cur = byIng.get(k);
    if (!cur) { byIng.set(k, c); continue; }
    const newer = c.latestKey !== cur.latestKey ? c.latestKey > cur.latestKey
      : c.latestRec !== cur.latestRec ? c.latestRec > cur.latestRec : c.lineId > cur.lineId;
    if (newer) byIng.set(k, c);
  }
  return [...byIng.values()].map((c) => c.row).sort((a, b) => (a.ingredient ?? a.drug_name).localeCompare(b.ingredient ?? b.drug_name));
}

// ---------------------------------------------------------------- problems & allergies

function ckdStage(icd: string | undefined, text: string): ProblemRow["ckd_stage"] {
  const c = (icd ?? "").toUpperCase();
  const t = text.toLowerCase();
  const m = /\b(?:stage|g)\s*(1|2|3a|3b|4|5)\b/i.exec(t) || /\bckd\s*(1|2|3a|3b|4|5)\b/i.exec(t);
  if (m) return ("G" + m[1].toLowerCase()) as ProblemRow["ckd_stage"];
  const map: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  return map[c];
}

function albuminuria(text: string): ProblemRow["albuminuria"] {
  const m = /\bA([123])\b/.exec(text);
  if (m) return ("A" + m[1]) as ProblemRow["albuminuria"];
  const t = text.toLowerCase();
  if (/severely increased albuminuria|macroalbuminuria/.test(t)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria/.test(t)) return "A2";
  if (/normal to mildly increased albuminuria/.test(t)) return "A1";
  return undefined;
}

function isCkd(icd: string | undefined, text: string): boolean {
  const c = (icd ?? "").toUpperCase();
  return c.startsWith("N18") || /chronic kidney disease|\bckd\b/i.test(text) || /^(E1[0-3]\.22|I12|I13)/.test(c);
}

function isSuspected(text: string, icd: string | undefined): boolean {
  if ((icd ?? "").toUpperCase().startsWith("Z03")) return true;
  return /^\s*(r\/o|rule[- ]out|ruled[- ]out|suspected|possible|probable|provisional|presumed|query|\?)/i.test(text) || /\bruled out\b|\brule out\b/i.test(text);
}

/** Adverse-effect T-code (6th character 5). */
function isAdverseEffectCode(icd: string | undefined): boolean {
  return /^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/i.test(icd ?? "") || /^T(3[6-9]|4\d|50)\.\d5/i.test(icd ?? "");
}

interface DrugAttribution { substance: string; reaction?: string; problemToo: boolean }

function drugAttribution(desc: string, icd: string | undefined, medsInItem: string[]): DrugAttribution | undefined {
  const resolveSubstance = (raw: string): string => {
    const t = raw.trim().replace(/[.;,]+$/, "");
    const ings = ingredientsOf(t);
    if (ings.length === 1 && (ALL_GENERICS.has(ings[0]) || BRANDS[t.toLowerCase().split(/\s+/)[0]])) return ings[0];
    const cls = classOf(t);
    if (cls) {
      const members = CLASS_MEMBERS[cls] ?? [];
      const onList = [...new Set(medsInItem.filter((m) => members.includes(m)))];
      if (onList.length === 1) return onList[0];
      return t;
    }
    if (ings.length === 1) return ings[0];
    return t;
  };
  const isDrugish = (raw: string): boolean => {
    const t = raw.trim().toLowerCase();
    if (classOf(t)) return true;
    const ings = ingredientsOf(t);
    return ings.length > 0 && ings.every((i) => ALL_GENERICS.has(i)) || !!BRANDS[t.split(/\s+/)[0]];
  };
  if (isAdverseEffectCode(icd)) {
    const m = /adverse effect of\s+(.+?)(?:,|\(|$)/i.exec(desc);
    let sub: string | undefined = m ? m[1] : undefined;
    if (!sub) {
      const c = (icd ?? "").toUpperCase();
      let best: [string, string] | undefined;
      for (const tc of T_CLASSES) if (c.startsWith(tc[0]) && (!best || tc[0].length > best[0].length)) best = tc;
      sub = best ? best[1] : undefined;
    }
    if (!sub) return undefined;
    // reaction wording if the description also names a condition ("Rash, adverse effect of ...")
    const before = desc.split(/[,;]?\s*(?:due to|adverse effect of)/i)[0].trim();
    const reaction = before && !/^adverse effect/i.test(before) ? before : undefined;
    return { substance: resolveSubstance(sub), reaction, problemToo: false };
  }
  const m = /^(.+?)\s+(?:due to|caused by|induced by|secondary to|from|associated with)\s+(?:use of\s+|the\s+)?(.+)$/i.exec(desc);
  if (m && isDrugish(m[2])) return { substance: resolveSubstance(m[2]), reaction: m[1].trim(), problemToo: true };
  const m2 = /^(.*?)([A-Za-z0-9-]+(?:\s+inhibitor)?)[- ]induced\s+(.+)$/i.exec(desc);
  if (m2 && isDrugish(m2[2]) && !/^drug$/i.test(m2[2])) return { substance: resolveSubstance(m2[2]), reaction: m2[3].trim(), problemToo: true };
  return undefined;
}

function substanceName(name: string, rxnorm: string | undefined): { substance: string; single: boolean } {
  const ings = ingredientsOf(name);
  const first = name.trim().toLowerCase().split(/\s+/)[0];
  const known = ings.length === 1 && (ALL_GENERICS.has(ings[0]) || !!BRANDS[first]);
  if (ings.length === 1 && (known || (rxnorm && !classOf(name)))) return { substance: ings[0], single: true };
  return { substance: name.trim(), single: false };
}

function buildProblemsAndAllergies(entries: Entry[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const problems: ProblemRow[] = [];
  const allergies: AllergyIntoleranceRow[] = [];

  // medication ingredients per item (for drug-class resolution)
  const medsByItem = new Map<string, string[]>();
  for (const x of entries) {
    if (x.e.type !== "med_event") continue;
    const n = str(x.e.drug?.name);
    if (!n) continue;
    if (!medsByItem.has(x.item.id)) medsByItem.set(x.item.id, []);
    medsByItem.get(x.item.id)!.push(...ingredientsOf(n));
  }

  // ---- problems
  const plines = new Map<string, Entry[]>();
  for (const x of entries) {
    if (x.e.type !== "problem_event") continue;
    const id = str(x.e.problem_id);
    if (!id) continue;
    if (!plines.has(id)) plines.set(id, []);
    plines.get(id)!.push(x);
  }
  interface PCand { row: ProblemRow; key: string; rec: string; id: string; icd?: string; evs: Entry[] }
  const pcands: PCand[] = [];
  const drugAllergies: { a: AllergyIntoleranceRow; evs: Entry[] }[] = [];
  for (const [pid, evs] of plines) {
    evs.sort(cmpEntries);
    let status: "active" | "resolved" | "removed" | undefined;
    let desc: string | undefined, icd: string | undefined, snomed: string | undefined;
    let onset: ProblemRow["onset"];
    let stage: ProblemRow["ckd_stage"], alb: ProblemRow["albuminuria"];
    let restricted = false;
    let lastEntry: Entry | undefined;
    for (const x of evs) {
      const e = x.e;
      const a = e.action;
      if (a !== "add" && a !== "update" && a !== "resolve" && a !== "remove") continue;
      if (str(e.description)) desc = str(e.description);
      if (str(e.icd10cm) || str(e.description)) { icd = str(e.icd10cm); snomed = str(e.snomed); }
      const o = fuzzy(e.onset);
      if (o) onset = o;
      if (e.restricted === "BH") restricted = true;
      const t = (str(e.description) ?? "");
      if (isCkd(str(e.icd10cm), t)) {
        const s = ckdStage(str(e.icd10cm), t);
        if (s) stage = s;
        const al = albuminuria(t);
        if (al) alb = al;
      }
      status = a === "resolve" ? "resolved" : a === "remove" ? "removed" : "active";
      lastEntry = x;
    }
    if (!status || status === "removed" || !desc || !lastEntry) continue;
    if (isSuspected(desc, icd)) continue;
    const used = evs.filter((x) => ["add", "update", "resolve", "remove"].includes(x.e.action));
    const attr = drugAttribution(desc, icd, medsByItem.get(lastEntry.item.id) ?? []);
    if (attr) {
      const cls = classifyReaction(attr.reaction ?? desc);
      const a: AllergyIntoleranceRow = {
        substance: attr.substance, reaction_type: cls.type, mechanism: "unknown", criticality: "unknown",
        evidence: ev(used),
      };
      if (attr.reaction) a.reaction = attr.reaction;
      if (onset) a.onset = onset;
      const sens = drugSensitivity([attr.substance], false);
      if (sens.length) a.sensitivity = sens;
      drugAllergies.push({ a, evs: used });
      if (!attr.problemToo) continue;
    }
    const row: ProblemRow = { condition: desc, status: status, evidence: ev(used) };
    if (icd) row.icd10cm = icd;
    if (snomed) row.snomed = snomed;
    if (onset) row.onset = onset;
    if (isCkd(icd, desc)) {
      if (stage) row.ckd_stage = stage;
      if (alb) row.albuminuria = alb;
    }
    const sens = icdSensitivity(icd, desc, restricted);
    if (sens.length) row.sensitivity = sens;
    pcands.push({ row, key: sortKey(lastEntry.item.effective), rec: sortKey(lastEntry.item.recorded), id: pid, icd, evs: used });
  }
  // Restaged/recoded entries of the same staged condition (CKD, asthma) on separate lines: one row, latest wins.
  const merged = new Map<string, PCand>();
  for (const c of pcands) {
    const cat = (c.icd ?? "").toUpperCase().slice(0, 3);
    const k = (cat === "N18" || cat === "J45") ? "cat:" + cat : "id:" + c.id;
    const cur = merged.get(k);
    if (!cur) { merged.set(k, c); continue; }
    const newer = c.key !== cur.key ? c.key > cur.key : c.rec !== cur.rec ? c.rec > cur.rec : c.id > cur.id;
    const win = newer ? c : cur, lose = newer ? cur : c;
    win.row.evidence = ev([...win.evs, ...lose.evs]);
    win.evs = [...win.evs, ...lose.evs];
    if (!win.row.onset && lose.row.onset) win.row.onset = lose.row.onset;
    if (!win.row.ckd_stage && lose.row.ckd_stage && win.row.ckd_stage === undefined && cat === "N18") win.row.ckd_stage = lose.row.ckd_stage;
    if (!win.row.albuminuria && lose.row.albuminuria && cat === "N18") win.row.albuminuria = lose.row.albuminuria;
    merged.set(k, win);
  }
  for (const c of merged.values()) problems.push(c.row);

  // ---- allergies
  const alines = new Map<string, Entry[]>();
  for (const x of entries) {
    if (x.e.type !== "allergy_event") continue;
    const id = str(x.e.allergy_id);
    if (!id) continue;
    if (!alines.has(id)) alines.set(id, []);
    alines.get(id)!.push(x);
  }
  for (const [, evs] of alines) {
    evs.sort(cmpEntries);
    const used = evs.filter((x) => ["add", "update", "inactivate"].includes(x.e.action));
    if (used.length === 0) continue;
    const last = used[used.length - 1];
    if (last.e.action === "inactivate") continue;
    // latest values, falling back to earlier events for missing fields
    let name: string | undefined, rx: string | undefined, rtype: string | undefined;
    let reactions: string[] | undefined, severity: string | undefined, onset: AllergyIntoleranceRow["onset"];
    for (const x of used) {
      const e = x.e;
      if (str(e.substance?.name)) { name = str(e.substance.name); rx = str(e.substance.rxnorm); }
      if (typeof e.reaction_type === "string") rtype = e.reaction_type;
      if (Array.isArray(e.reactions)) reactions = e.reactions.filter((r: unknown) => typeof r === "string" && r.trim() !== "").map((r: string) => r.trim());
      if (typeof e.severity === "string") severity = e.severity;
      const o = fuzzy(e.onset);
      if (o) onset = o;
    }
    if (!name) continue;
    if (/^(nka|nkda|no known (drug )?allergies)/i.test(name)) continue;
    const sub = substanceName(name, rx);
    const reaction = reactions && reactions.length ? reactions.join("; ") : undefined;
    const cls = classifyReaction(reaction ?? "", rtype);
    const row: AllergyIntoleranceRow = {
      substance: sub.substance,
      reaction_type: cls.type,
      mechanism: cls.mechanism,
      criticality: severity === "high" ? "high" : severity === "low" ? "low" : "unknown",
      evidence: ev(used),
    };
    if (sub.single && rx && isBareIngredientName(name)) row.rxnorm_ingredient = rx;
    if (reaction) row.reaction = reaction;
    if (onset) row.onset = onset;
    const sens = drugSensitivity(sub.single ? [sub.substance] : [], false);
    if (sens.length) row.sensitivity = sens;
    allergies.push(row);
  }
  for (const d of drugAllergies) {
    const dup = allergies.find((a) => a.substance.toLowerCase() === d.a.substance.toLowerCase());
    if (dup) { dup.evidence = [...dup.evidence, ...d.a.evidence.filter((x) => !dup.evidence.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id))]; continue; }
    allergies.push(d.a);
  }
  return { problems, allergies };
}

// ---------------------------------------------------------------- labs

const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const LOINC: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "59826-8": "creatinine",
  "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr",
  "98979-8": "egfr", "50044-7": "egfr", "50210-4": "egfr", "69405-9": "egfr", "77147-7": "egfr", "70969-1": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "22760-3": "potassium",
  "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "20565-8": "bicarbonate", "14627-4": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap",
  "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose", "14749-6": "glucose", "15074-8": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "14958-3": "uacr", "30000-4": "uacr", "13705-9": "uacr", "32294-1": "uacr", "44292-1": "uacr", "89998-9": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "804-5": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin", "59260-0": "hemoglobin",
  "53060-9": "bhb", "2263-2": "bhb", "33428-4": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2745-8": "ph", "33254-4": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "2020-6": "pco2",
  "3040-3": "lipase", "1990-5": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "49563-0": "troponin", "16255-2": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "13457-7": "ldl", "2089-1": "ldl", "18262-6": "ldl", "69419-0": "ldl", "96259-7": "ldl", "91000-0": "ldl",
};

const NFM: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", HCO3: "bicarbonate", TCO2: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", ANGAP: "anion_gap",
  BUN: "bun", GLU: "glucose", GLUC: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", MALBCR: "uacr", ACR: "uacr",
  PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", PH: "ph", PCO2: "pco2",
  LIPASE: "lipase", LIP: "lipase", TROPI: "troponin", TNI: "troponin", HSTNI: "troponin", CHOL: "cholesterol",
  TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl", LDLD: "ldl",
};

function analyteByName(name: string): Analyte | undefined {
  const n = name.toLowerCase();
  if (/albumin.*creatinine|microalb.*creat|\buacr\b|\bacr\b/.test(n)) return "uacr";
  if (/urine|urinary|\bur\b|csf|fluid/.test(n)) return undefined;
  if (/\begfr\b|glomerular filtration/.test(n)) return "egfr";
  if (/creatinine/.test(n) && !/clearance|kinase/.test(n)) return "creatinine";
  if (/potassium/.test(n)) return "potassium";
  if (/sodium/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/bicarbonate|\bco2\b.*total|total co2|carbon dioxide/.test(n) && !/pco2|partial/.test(n)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/a1c|glycated|glycosylated/.test(n)) return "a1c";
  if (/glucose/.test(n) && !/meter|glucometer|point of care|\bpoc\b|tolerance|home/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/\bwbc\b|white blood|leukocyte/.test(n)) return "wbc";
  if (/hemoglobin|haemoglobin|\bhgb\b/.test(n)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b/.test(n)) return "bhb";
  if (/pco2|partial pressure of (co2|carbon dioxide)/.test(n)) return "pco2";
  if (/^ph\b|\bph\b/.test(n)) return "ph";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n) && !/troponin t\b/.test(n)) return "troponin";
  if (/\bhdl\b/.test(n)) return "hdl";
  if (/\bldl\b/.test(n)) return "ldl";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n) && !/non-?hdl|ratio/.test(n)) return "cholesterol";
  return undefined;
}

function analyteOf(test: any): Analyte | undefined {
  if (!test || typeof test !== "object") return undefined;
  const name = str(test.name) ?? "";
  if (/troponin t\b/i.test(name)) return undefined;
  const loinc = str(test.loinc);
  if (loinc && LOINC[loinc]) {
    const a = LOINC[loinc];
    if (a === "glucose" && /meter|home/i.test(name)) return undefined;
    return a;
  }
  const code = (str(test.nfm_code) ?? "").toUpperCase();
  if (code.startsWith("EGFR")) return "egfr";
  if (/urine|urinary/i.test(name) && NFM[code] !== "uacr") return analyteByName(name);
  if (NFM[code]) return NFM[code];
  return analyteByName(name);
}

function convert(a: Analyte, v: number, unitRaw: string): number | undefined {
  const u = unitRaw.trim().replace(/\s+/g, "").replace(/µ|μ/g, "u").toLowerCase();
  const target = UNIT[a].toLowerCase();
  if (u === target) return v;
  switch (a) {
    case "creatinine":
      if (u === "umol/l") return round(v / 88.42, 2);
      if (u === "mg/dl") return v;
      return undefined;
    case "egfr":
      if (/^ml\/min(\/1\.73(m2|m\^2|sqm|m²))?$/.test(u) || u === "ml/min/1.73" || u === "ml/min/{1.73_m2}" || u === "ml/min/1.73m²") return v;
      return undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      if (u === "mmol/l" || u === "meq/l") return v;
      return undefined;
    case "bhb":
      if (u === "mmol/l") return v;
      if (u === "mg/dl") return round(v / 10.41, 2);
      return undefined;
    case "bun":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return round(v * 2.801, 1);
      return undefined;
    case "glucose":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 18.016);
      return undefined;
    case "a1c":
      if (u === "%" || u === "%hba1c" || u === "percent") return v;
      if (u === "mmol/mol") return round(v * 0.09148 + 2.152, 1);
      return undefined;
    case "uacr":
      if (u === "mg/g" || u === "ug/mg" || u === "mcg/mg" || u === "mg/gcreat" || u === "mg/g{creat}") return v;
      if (u === "mg/mmol") return round(v * 8.842, 1);
      return undefined;
    case "platelets": case "wbc":
      if (/^(10\*3\/ul|10\^3\/ul|x10e3\/ul|10e3\/ul|k\/ul|thou\/ul|x10\^3\/ul|10\*9\/l|10\^9\/l|x10e9\/l|x10\^9\/l|g\/l|k\/mm3|10\^3\/mm3|10\*3\/mm3)$/.test(u)) return v;
      if (u === "/ul" || u === "cells/ul" || u === "/mm3") return round(v / 1000, 3);
      return undefined;
    case "hemoglobin":
      if (u === "g/dl") return v;
      if (u === "g/l") return round(v / 10, 1);
      if (u === "mmol/l") return round(v * 1.611, 1);
      return undefined;
    case "ph":
      if (u === "" || u === "[ph]" || u === "ph" || u === "units") return v;
      return undefined;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return v;
      if (u === "kpa") return round(v * 7.50062, 1);
      return undefined;
    case "lipase":
      if (u === "u/l" || u === "iu/l") return v;
      return undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return round(v / 1000, 4);
      return undefined;
    case "cholesterol": case "hdl": case "ldl":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 38.67);
      return undefined;
    case "triglycerides":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 88.57);
      return undefined;
  }
  return undefined;
}

function parseValue(v: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  if (typeof v === "number" && isFinite(v)) return { value: v };
  if (typeof v !== "string") return undefined;
  const m = /^\s*(<=|>=|≤|≥|<|>)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(v.replace(/,/g, ""));
  if (!m) return undefined;
  let c = m[1] as string | undefined;
  if (c === "≤") c = "<=";
  if (c === "≥") c = ">=";
  return { value: parseFloat(m[2]), comparator: c as any };
}

function isRaceVariant(test: any): boolean {
  const name = (str(test?.name) ?? "").toLowerCase();
  const code = (str(test?.nfm_code) ?? "").toUpperCase();
  const loinc = str(test?.loinc);
  if (/non[- ]?(african|black)|not (african|black)/.test(name)) return false;
  if (code.endsWith("-NAA") || code.endsWith("NAA")) return false;
  return /african|black/.test(name) || code.endsWith("-AA") || loinc === "48643-1" || loinc === "88294-4";
}

function egfrEquation(test: any, comment: string | undefined): LabResultRow["egfr_equation"] {
  const t = `${str(test?.name) ?? ""} ${comment ?? ""}`.toLowerCase();
  if (/ckd[- ]?epi\s*\(?2021|2021 ckd|race[- ]free|without race/.test(t)) return "ckd-epi-2021";
  if (/ckd[- ]?epi\s*\(?2009|2009 ckd/.test(t)) return "ckd-epi-2009";
  if (/mdrd/.test(t)) return "mdrd";
  const l = str(test?.loinc);
  if (l === "98979-8") return "ckd-epi-2021";
  if (l === "62238-1" || l === "88293-6" || l === "88294-4") return "ckd-epi-2009";
  if (l === "33914-3") return "mdrd";
  return "unknown";
}

function buildLabs(entries: Entry[]): LabResultRow[] {
  const groups = new Map<string, Entry[]>();
  for (const x of entries) {
    if (x.e.type !== "imported_result") continue;
    const e = x.e;
    const acc = str(e.external_ref?.accession);
    const rc = str(e.external_ref?.result_code) ?? str(e.test?.nfm_code) ?? str(e.test?.name);
    const k = acc && rc ? `${acc}|${rc}` : `${x.item.id}|${x.key}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(x);
  }
  const rank = (s: unknown) => (s === "C" ? 3 : s === "F" ? 2 : s === "P" ? 1 : 0);
  const rows: { row: LabResultRow; acc?: string; collected?: string; race: boolean }[] = [];
  for (const [, copies] of groups) {
    const usable = copies.filter((x) => rank(x.e.result_status) > 0);
    if (usable.length === 0) continue;
    usable.sort((a, b) => {
      const r = rank(a.e.result_status) - rank(b.e.result_status);
      if (r) return r;
      const ra = sortKey(a.e.resulted), rb = sortKey(b.e.resulted);
      if (ra !== rb) return ra < rb ? -1 : 1;
      return cmpEntries(a, b);
    });
    const best = usable[usable.length - 1];
    const e = best.e;
    const analyte = analyteOf(e.test);
    if (!analyte) continue;
    const comment = str(e.comment);
    if (comment && /\b(invalidated|not performed|cancell?ed|disregard|entered in error|wrong patient)\b/i.test(comment) && rank(e.result_status) === 3) {
      // a corrected copy that withdraws the value
      if (!parseValue(e.value) || /result (is )?invalidated|disregard (this|previous)|wrong patient/i.test(comment)) continue;
    }
    const pv = parseValue(e.value);
    if (!pv) continue;
    const unit = str(e.unit) ?? "";
    const val = convert(analyte, pv.value, unit);
    if (val === undefined) continue;
    const collected = rfc3339Local(e.collected) ?? rfc3339Local(best.item.effective);
    if (!collected) continue;
    const row: LabResultRow = {
      analyte, value: val, unit: UNIT[analyte], collected,
      status: rank(e.result_status) >= 2 ? "final" : "preliminary",
      evidence: ev([best, ...copies.filter((c) => c !== best)]),
    };
    if (pv.comparator) row.comparator = pv.comparator;
    if (analyte === "egfr") row.egfr_equation = egfrEquation(e.test, comment);
    const loinc = str(e.test?.loinc);
    if (loinc) row.loinc = loinc;
    rows.push({ row, acc: str(e.external_ref?.accession), collected, race: analyte === "egfr" && isRaceVariant(e.test) });
  }
  // eGFR race variants: drop when a race-free variant exists for the same specimen.
  const out: LabResultRow[] = [];
  for (const r of rows) {
    if (r.race) {
      const sibling = rows.some((o) => o !== r && !o.race && o.row.analyte === "egfr" &&
        ((r.acc && o.acc === r.acc) || o.collected === r.collected));
      if (sibling) continue;
    }
    out.push(r.row);
  }
  return out.sort((a, b) => a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : a.analyte.localeCompare(b.analyte));
}

// ---------------------------------------------------------------- vitals

function parseBp(v: unknown): [number, number] | undefined {
  if (typeof v !== "string") return undefined;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(v);
  if (!m) return undefined;
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

function buildVitals(entries: Entry[]): VitalRow[] {
  const visitType = new Map<string, string>();
  for (const x of entries) {
    if (x.e.type === "visit" && str(x.e.visit_id) && typeof x.e.visit_type === "string") visitType.set(x.e.visit_id, x.e.visit_type);
  }
  const rows: VitalRow[] = [];
  for (const x of entries) {
    if (x.e.type !== "vital_set") continue;
    const e = x.e;
    const t = localMinute(x.item.effective);
    if (!t) continue;
    const vt = str(e.visit_id) ? visitType.get(e.visit_id) : undefined;
    const setting: VitalRow["setting"] = vt === "telehealth" || vt === "phone" ? "home" : "clinic";
    const row: VitalRow = { setting, local_time: t, evidence: [{ item_id: x.item.id, entry_id: x.key }] };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const rep = parseBp(e.bp_repeat);
    if (rep && setting !== "home") { row.repeat_systolic_mmhg = rep[0]; row.repeat_diastolic_mmhg = rep[1]; }
    const p = num(e.pulse_bpm);
    if (p !== undefined) row.pulse_bpm = p;
    const w = num(e.weight_lb);
    if (w !== undefined && w > 0) row.weight_kg = round(w * 0.45359237, 1);
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    rows.push(row);
  }
  return rows.sort((a, b) => a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0);
}

// ---------------------------------------------------------------- entry point

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return empty;
  const live = countingItems(items, asOf);
  const entries = entriesOf(live);
  const safe = <T>(f: () => T[]): T[] => { try { return f(); } catch { return []; } };
  const pa = (() => { try { return buildProblemsAndAllergies(entries); } catch { return { problems: [], allergies: [] }; } })();
  return {
    medications: safe(() => buildMedications(entries)),
    problems: pa.problems,
    allergies: pa.allergies,
    labs: safe(() => buildLabs(entries)),
    vitals: safe(() => buildVitals(entries)),
  };
}
