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
  PartialDate,
} from "../in/views/views";

// ---------------------------------------------------------------------------
// Time helpers (America/Chicago)
// ---------------------------------------------------------------------------

const TZ = "America/Chicago";
let fmt: Intl.DateTimeFormat | null = null;
function chicagoFmt(): Intl.DateTimeFormat {
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  return fmt;
}

interface Wall { y: number; mo: number; d: number; h: number; mi: number; s: number }

function wallOfEpoch(ms: number): Wall {
  const parts = chicagoFmt().formatToParts(new Date(ms));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  let h = get("hour");
  if (h === 24) h = 0;
  return { y: get("year"), mo: get("month"), d: get("day"), h, mi: get("minute"), s: get("second") };
}

const pad = (n: number, w = 2) => String(n).padStart(w, "0");
const wallDate = (w: Wall) => `${pad(w.y, 4)}-${pad(w.mo)}-${pad(w.d)}`;
const wallMinute = (w: Wall) => `${wallDate(w)}T${pad(w.h)}:${pad(w.mi)}`;

const RE_OFFSET_DT = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*(Z|[+-]\d{2}:?\d{2})$/i;
const RE_LOCAL_DT = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/;
const RE_PARTIAL = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

/** Chicago offset in minutes (e.g. -300) for a local wall-clock time. */
function chicagoOffsetForWall(w: Wall): number {
  const asUtc = Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, w.s);
  let guess = asUtc + 6 * 3600000;
  for (let i = 0; i < 3; i++) {
    const lw = wallOfEpoch(guess);
    const lwUtc = Date.UTC(lw.y, lw.mo - 1, lw.d, lw.h, lw.mi, lw.s);
    const diff = asUtc - lwUtc;
    if (diff === 0) break;
    guess += diff;
  }
  return Math.round((asUtc - guess) / 60000);
}

interface ParsedTime { wall: Wall; ms: number; precision: "year" | "month" | "day" | "time"; partial?: string }

function parseTime(s: unknown): ParsedTime | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  let m = RE_OFFSET_DT.exec(t);
  if (m) {
    const ms = Date.parse(t.replace(" ", "T"));
    if (isNaN(ms)) return null;
    return { wall: wallOfEpoch(ms), ms, precision: "time" };
  }
  m = RE_LOCAL_DT.exec(t);
  if (m) {
    const w: Wall = { y: +m[1], mo: +m[2], d: +m[3], h: +m[4], mi: +m[5], s: m[6] ? +m[6] : 0 };
    const off = chicagoOffsetForWall(w);
    return { wall: w, ms: Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, w.s) - off * 60000, precision: "time" };
  }
  m = RE_PARTIAL.exec(t);
  if (m) {
    const w: Wall = { y: +m[1], mo: m[2] ? +m[2] : 1, d: m[3] ? +m[3] : 1, h: 0, mi: 0, s: 0 };
    const off = chicagoOffsetForWall(w);
    const precision = m[3] ? "day" : m[2] ? "month" : "year";
    return { wall: w, ms: Date.UTC(w.y, w.mo - 1, w.d) - off * 60000, precision, partial: t };
  }
  return null;
}

/** Local date with source precision. */
function localDate(s: unknown): PartialDate | undefined {
  const p = parseTime(s);
  if (!p) return undefined;
  if (p.partial) return p.partial;
  return wallDate(p.wall);
}

function rfc3339Local(s: unknown): string | undefined {
  const p = parseTime(s);
  if (!p || p.precision !== "time") return undefined;
  const off = chicagoOffsetForWall(p.wall);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  return `${wallDate(p.wall)}T${pad(p.wall.h)}:${pad(p.wall.mi)}:${pad(p.wall.s)}${sign}${pad(Math.floor(a / 60))}:${pad(a % 60)}`;
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() !== "" ? v.trim() : undefined);
const isObj = (v: unknown): v is Record<string, any> => typeof v === "object" && v !== null && !Array.isArray(v);

function addEv(ev: Evidence, item_id: string, entry_id?: string) {
  if (!ev.some((e) => e.item_id === item_id && e.entry_id === entry_id)) {
    ev.push(entry_id !== undefined ? { item_id, entry_id } : { item_id });
  }
}

interface Ctx {
  item: FolioItem;
  order: number; // clinical ordering key
  idx: number; // position in ordered list
}

interface Entry { ctx: Ctx; key: string; e: Record<string, any> }

// ---------------------------------------------------------------------------
// Drug knowledge
// ---------------------------------------------------------------------------

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", januvia: "sitagliptin", lantus: "insulin glargine", basaglar: "insulin glargine",
  toujeo: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro",
  novolog: "insulin aspart", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide", cozaar: "losartan",
  diovan: "valsartan", zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  norvasc: "amlodipine", lasix: "furosemide", microzide: "hydrochlorothiazide", lipitor: "atorvastatin",
  crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin", toprol: "metoprolol",
  lopressor: "metoprolol", coreg: "carvedilol", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin",
  plavix: "clopidogrel", synthroid: "levothyroxine", levoxyl: "levothyroxine", prilosec: "omeprazole",
  nexium: "esomeprazole", protonix: "pantoprazole", pepcid: "famotidine", zyrtec: "cetirizine",
  claritin: "loratadine", allegra: "fexofenadine", ventolin: "albuterol", proair: "albuterol",
  proventil: "albuterol", singulair: "montelukast", aleve: "naproxen", naprosyn: "naproxen", advil: "ibuprofen",
  motrin: "ibuprofen", tylenol: "acetaminophen", keflex: "cephalexin", amoxil: "amoxicillin",
  zithromax: "azithromycin", cipro: "ciprofloxacin", levaquin: "levofloxacin", bactrim: "sulfamethoxazole / trimethoprim",
  neurontin: "gabapentin", lyrica: "pregabalin", zoloft: "sertraline", lexapro: "escitalopram",
  celexa: "citalopram", prozac: "fluoxetine", paxil: "paroxetine", wellbutrin: "bupropion", seroquel: "quetiapine",
  abilify: "aripiprazole", risperdal: "risperidone", zyprexa: "olanzapine", lamictal: "lamotrigine",
  depakote: "valproate", lithobid: "lithium", suboxone: "buprenorphine / naloxone", subutex: "buprenorphine",
  narcan: "naloxone", vivitrol: "naltrexone", chantix: "varenicline", truvada: "emtricitabine / tenofovir",
  descovy: "emtricitabine / tenofovir", biktarvy: "bictegravir / emtricitabine / tenofovir", flomax: "tamsulosin",
  aldactone: "spironolactone", entresto: "sacubitril / valsartan", ultram: "tramadol", flexeril: "cyclobenzaprine",
  zofran: "ondansetron", deltasone: "prednisone", kerendia: "finerenone",
};

const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "oral", "solution", "suspension",
  "injection", "injectable", "inhaler", "inhalation", "hfa", "iv", "infusion", "subq", "sc", "pen", "patch",
  "cream", "ointment", "gel", "chewable", "odt", "er", "xr", "sr", "dr", "xl", "cr", "la", "ec", "extended",
  "delayed", "release", "extended-release", "delayed-release", "film", "coated", "film-coated", "prefilled",
  "syringe", "vial", "kit", "spray", "nasal", "drops", "ophthalmic", "topical", "liquid", "elixir", "syrup",
  "powder", "packet", "disintegrating", "orally", "po", "(human)", "human", "u-100", "u100", "flexpen", "kwikpen",
  "solostar", "autoinjector", "auto-injector", "actuation", "puff", "dose", "mg", "mcg",
]);
const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "succinate", "tartrate", "besylate", "maleate", "calcium",
  "mesylate", "sulfate", "citrate", "fumarate", "bromide", "monohydrate", "trihydrate", "dihydrate", "acetate",
  "phosphate", "magnesium", "hyclate", "propionate", "furoate", "dipropionate", "disoproxil", "alafenamide",
  "hemifumarate", "valerate", "xinafoate", "bitartrate", "chloride", "hydrobromide", "lactate", "gluconate",
  "carbonate", "oxide", "decanoate", "pamoate", "er", "anhydrous",
]);
// Words that alone are the drug when a "salt" word would otherwise be stripped.
const KEEP_WHOLE = new Set(["sodium chloride", "potassium chloride", "calcium carbonate", "calcium gluconate", "magnesium oxide", "magnesium sulfate", "sodium bicarbonate", "potassium citrate", "calcium acetate"]);

function ingredientOf(name: string | undefined): string | undefined {
  if (!name) return undefined;
  let s = name.toLowerCase().replace(/\[.*?\]/g, " ").replace(/®|™/g, "");
  // cut at first strength / number
  const cut = s.search(/\d/);
  if (cut > 0) s = s.slice(0, cut);
  s = s.replace(/[(),]/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return undefined;
  for (const k of KEEP_WHOLE) if (s.startsWith(k)) return k;
  const words = s.split(/[\s]+/).filter((w) => w && !FORM_WORDS.has(w));
  // translate brands
  const mapped = words.map((w) => BRANDS[w.replace(/[^a-z-]/g, "")] ?? w);
  let kept = mapped.filter((w) => !SALT_WORDS.has(w));
  if (kept.length === 0) kept = mapped;
  const out = kept.join(" ").replace(/\s*[-/+]\s*/g, " / ").replace(/\s+/g, " ").trim();
  if (!out) return undefined;
  if (BRANDS[out]) return BRANDS[out];
  return out;
}

const DRUG_CLASSES: { re: RegExp; label: string; members: string[] }[] = [
  { re: /sglt-?2|gliflozin/i, label: "SGLT2 inhibitors", members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin", "bexagliflozin"] },
  { re: /\bace[- ]?inhibitor|\bacei\b|angiotensin[- ]converting/i, label: "ACE inhibitors", members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"] },
  { re: /\barbs?\b|angiotensin (ii )?receptor blocker|sartan/i, label: "angiotensin receptor blockers", members: ["losartan", "valsartan", "irbesartan", "olmesartan", "candesartan", "telmisartan", "azilsartan"] },
  { re: /penicillin/i, label: "penicillins", members: ["amoxicillin", "ampicillin", "penicillin", "penicillin v", "penicillin g", "dicloxacillin", "nafcillin", "piperacillin", "amoxicillin / clavulanate"] },
  { re: /cephalosporin/i, label: "cephalosporins", members: ["cephalexin", "cefazolin", "ceftriaxone", "cefuroxime", "cefdinir", "cefepime", "cefpodoxime", "cefadroxil"] },
  { re: /nsaid|non-?steroidal/i, label: "NSAIDs", members: ["naproxen", "ibuprofen", "diclofenac", "meloxicam", "celecoxib", "ketorolac", "indomethacin", "aspirin"] },
  { re: /statin\b|hmg-?coa/i, label: "statins", members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"] },
  { re: /sulfonamide|sulfa\b/i, label: "sulfonamides", members: ["sulfamethoxazole", "sulfamethoxazole / trimethoprim", "sulfasalazine"] },
  { re: /fluoroquinolone|quinolone/i, label: "fluoroquinolones", members: ["ciprofloxacin", "levofloxacin", "moxifloxacin"] },
  { re: /thiazide/i, label: "thiazide diuretics", members: ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone"] },
  { re: /opioid|opiate/i, label: "opioids", members: ["morphine", "oxycodone", "hydrocodone", "hydromorphone", "codeine", "tramadol", "fentanyl", "methadone"] },
  { re: /beta[- ]?blocker/i, label: "beta blockers", members: ["metoprolol", "carvedilol", "atenolol", "propranolol", "bisoprolol", "nebivolol", "labetalol"] },
  { re: /sulfonylurea/i, label: "sulfonylureas", members: ["glipizide", "glyburide", "glimepiride"] },
  { re: /glp-?1/i, label: "GLP-1 receptor agonists", members: ["semaglutide", "liraglutide", "dulaglutide", "exenatide", "tirzepatide"] },
  { re: /\binsulin\b/i, label: "insulin", members: ["insulin glargine", "insulin lispro", "insulin aspart", "insulin regular", "insulin detemir", "insulin degludec", "insulin nph"] },
];

// ICD-10-CM adverse-effect codes (T36-T50, 6th char 5) -> class/drug
const T_CODES: { re: RegExp; label: string }[] = [
  { re: /^T36\.0/, label: "penicillins" },
  { re: /^T36\.1/, label: "cephalosporins" },
  { re: /^T37\.0/, label: "sulfonamides" },
  { re: /^T38\.3/, label: "insulin and oral hypoglycemic drugs" },
  { re: /^T39\.0/, label: "salicylates" },
  { re: /^T39\.1/, label: "acetaminophen" },
  { re: /^T39\.3/, label: "NSAIDs" },
  { re: /^T40\.2/, label: "opioids" },
  { re: /^T45\.51/, label: "anticoagulants" },
  { re: /^T46\.4/, label: "ACE inhibitors" },
  { re: /^T46\.5/, label: "antihypertensive drugs" },
  { re: /^T46\.6/, label: "antihyperlipidemic drugs" },
  { re: /^T50\.1/, label: "loop diuretics" },
  { re: /^T50\.2/, label: "thiazide diuretics" },
];

const MH_DRUGS = ["quetiapine", "lithium", "sertraline", "escitalopram", "citalopram", "fluoxetine", "paroxetine", "bupropion", "aripiprazole", "risperidone", "olanzapine", "lamotrigine", "venlafaxine", "duloxetine", "mirtazapine", "trazodone", "haloperidol", "clozapine", "ziprasidone", "lurasidone", "valproate", "divalproex", "methylphenidate", "amphetamine", "lisdexamfetamine", "atomoxetine", "buspirone", "clonazepam", "lorazepam", "alprazolam", "diazepam", "desvenlafaxine", "vortioxetine", "paliperidone", "nortriptyline", "amitriptyline"];
const SU_DRUGS = ["buprenorphine", "methadone", "naltrexone", "acamprosate", "disulfiram", "naloxone"];
const HIV_DRUGS = ["emtricitabine", "tenofovir", "bictegravir", "dolutegravir", "raltegravir", "efavirenz", "rilpivirine", "darunavir", "atazanavir", "lamivudine", "abacavir", "zidovudine", "cabotegravir", "elvitegravir", "doravirine", "ritonavir", "cobicistat"];
const SRH_DRUGS = ["norethindrone", "levonorgestrel", "ethinyl estradiol", "drospirenone", "medroxyprogesterone", "etonogestrel", "norgestimate", "desogestrel", "ulipristal", "mifepristone", "misoprostol", "clomiphene", "letrozole", "sildenafil", "tadalafil"];

function drugSensitivity(ingredient: string | undefined, text: string): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  const ing = (ingredient ?? "").toLowerCase();
  const t = text.toLowerCase();
  const has = (list: string[]) => list.some((d) => ing.includes(d));
  if (has(SU_DRUGS) || /opioid use|alcohol use|substance use|\boud\b|\baud\b/.test(t)) s.add("substance-use");
  if (has(HIV_DRUGS) || /\bhiv\b|\bprep\b/.test(t)) s.add("hiv-sti");
  if (has(MH_DRUGS) || /bipolar|depress|schizo|anxiety|psychos|adhd/.test(t)) {
    // naloxone etc. are not mental health; lamotrigine/valproate only when psychiatric context or listed
    if (!(["lamotrigine", "valproate", "divalproex", "clonazepam", "diazepam", "amitriptyline", "nortriptyline"].some((d) => ing.includes(d)) && !/bipolar|depress|mood|psych|anxiety|schizo/.test(t))) s.add("mental-health");
  }
  if (has(SRH_DRUGS) && !(["sildenafil", "tadalafil", "letrozole", "misoprostol"].some((d) => ing.includes(d)) && !/erectile|fertility|pregnan|abortion|contracept|sexual/.test(t))) s.add("sexual-reproductive-health");
  if (/contracept|birth control/.test(t)) s.add("sexual-reproductive-health");
  return s.size ? [...s] : undefined;
}

function conditionSensitivity(label: string, icd: string | undefined): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  const l = label.toLowerCase();
  const c = (icd ?? "").toUpperCase();
  if (/^F1[0-9]/.test(c) || /alcohol (use|abuse|dependence)|opioid (use|abuse|dependence)|substance (use|abuse)|drug (abuse|dependence)|cocaine|methamphetamine|cannabis use|alcoholism/.test(l)) s.add("substance-use");
  else if (/^F/.test(c) || /bipolar|depress|schizo|anxiety|psychos|ptsd|post-traumatic|adhd|attention[- ]deficit|eating disorder|anorexia nervosa|bulimia|obsessive|panic disorder|suicid|personality disorder/.test(l)) s.add("mental-health");
  if (/^(B2[0-4]|Z21|A5[0-9]|A6[0-4]|Z20\.6|Z71\.7)/.test(c) || /\bhiv\b|chlamydia|gonorr|syphilis|trichomon|genital herpes|herpes genitalis|hpv|sexually transmitted/.test(l)) s.add("hiv-sti");
  if (/^(O|Z3[0-9]|N97|N96|Z32|Z33|Z34|Z36|Z37|Z39|N52)/.test(c) || /pregnan|contracept|infertil|miscarriage|abortion|erectile|gestation/.test(l)) s.add("sexual-reproductive-health");
  if (/^(Q|Z15|Z14|Z84\.8)/.test(c) || /brca|genetic|hereditary|lynch syndrome|cystic fibrosis|sickle cell disease|huntington/.test(l)) s.add("genetic");
  return s.size ? [...s] : undefined;
}

// ---------------------------------------------------------------------------
// Medication parsing
// ---------------------------------------------------------------------------

type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";

function normUnit(u: string): { unit: DoseUnit; factor: number } | null {
  const x = u.toLowerCase().replace(/\.$/, "");
  if (x === "mg" || x === "milligram" || x === "milligrams") return { unit: "mg", factor: 1 };
  if (x === "g" || x === "gram" || x === "grams" || x === "gm") return { unit: "mg", factor: 1000 };
  if (x === "mcg" || x === "µg" || x === "μg" || x === "ug" || x === "microgram" || x === "micrograms") return { unit: "mcg", factor: 1 };
  if (x === "u" || x === "iu" || x === "unit" || x === "units") return { unit: "units", factor: 1 };
  if (x === "ml" || x === "cc" || x === "milliliter" || x === "milliliters") return { unit: "mL", factor: 1 };
  if (x === "tab" || x === "tabs" || x === "tablet" || x === "tablets") return { unit: "tablet", factor: 1 };
  return null;
}

const NUM_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5, "1/2": 0.5, "½": 0.5 };
const UNIT_RE = "(mg|milligrams?|g|grams?|gm|mcg|µg|μg|ug|micrograms?|u|iu|units?|ml|cc|milliliters?)";
const COUNT_UNIT_RE = "(tabs?|tablets?|caps?|capsules?|puffs?|pills?|sprays?|actuations?|inhalations?|patch(?:es)?|drops?|chews?)";

const isRangeOrConditional = (t: string) =>
  /\d\s*(-|–|—|to|or)\s*\d|sliding|scale|per protocol|titrat|taper|if\b|depending|varies|variable|as directed|per\s+(kg|bg|glucose|carb)|\/kg|correction/i.test(t);

function parseAmount(t: string): { value: number; unit: DoseUnit } | null {
  const m = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${UNIT_RE}\\b(?!\\s*/)`, "i").exec(t);
  if (!m) return null;
  const nu = normUnit(m[2]);
  if (!nu) return null;
  return { value: round(+m[1] * nu.factor, 4), unit: nu.unit };
}

function round(v: number, d: number) {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function parseCount(sig: string): number | null | "range" {
  const re = new RegExp(`(?:^|\\b(?:take|inhale|use|apply|give|chew|instill)\\s+|^\\s*)(\\d+(?:\\.\\d+)?|one|two|three|four|half|1/2|½)\\s*(?:-|–|to|or)?\\s*(\\d+)?\\s*${COUNT_UNIT_RE}\\b`, "i");
  const m = re.exec(sig);
  if (!m) return null;
  if (m[2]) return "range";
  const raw = m[1].toLowerCase();
  const n = NUM_WORDS[raw] ?? Number(raw);
  return isFinite(n) ? n : null;
}

function strengthOf(name: string): { value: number; unit: DoseUnit } | null {
  // concentration (mg/mL) or combination strengths are not a per-unit strength we can multiply
  if (/\d\s*(mg|mcg|units?)\s*\/\s*(ml|l)\b/i.test(name)) return null;
  const all = name.match(new RegExp(`\\d+(?:\\.\\d+)?\\s*${UNIT_RE}\\b`, "gi"));
  if (!all || all.length !== 1) return null;
  return parseAmount(all[0]);
}

function parseDose(drugName: string, doseText: string, sig: string): MedicationRow["dose"] | undefined {
  const dt = doseText || "";
  const sg = sig || "";
  if (isRangeOrConditional(sg) || isRangeOrConditional(dt)) return undefined;
  const count = parseCount(sg);
  if (count === "range") return undefined;
  const strength = strengthOf(drugName) ?? (/\d\s*(mg|mcg)\s*\/\s*(puff|actuation|spray|inhalation)/i.test(drugName) ? parseAmount(drugName.replace(/\/\s*(puff|actuation|spray|inhalation)/i, "")) : null);
  if (count !== null && strength) return { value: round(strength.value * count, 4), unit: strength.unit };
  // explicit amount in sig ("inject 18 units")
  const sigAmt = parseAmount(sg);
  if (sigAmt) return sigAmt;
  const dtAmt = parseAmount(dt);
  if (dtAmt) {
    // dose_text a plain single amount; if a count other than 1 is given and dose_text equals strength, multiply
    if (count !== null && strength && dtAmt.value === strength.value && dtAmt.unit === strength.unit) {
      return { value: round(strength.value * count, 4), unit: strength.unit };
    }
    return dtAmt;
  }
  if (strength && (count !== null || sg.trim() !== "")) {
    if (count !== null) return { value: round(strength.value * count, 4), unit: strength.unit };
    if (parseFrequency(sg) && !/\d/.test(sg)) return strength; // time but no count -> one unit
  }
  if (count !== null && /tab/i.test(sg)) return { value: count, unit: "tablet" };
  return undefined;
}

function parseFrequency(sig: string): MedicationRow["frequency"] | undefined {
  const s = ` ${(sig || "").toLowerCase()} `;
  if (/\bprn\b|as needed|as-needed|when needed|if needed/.test(s)) return "PRN";
  if (/\bqid\b|four times|4 times|\bq\s?4\s?h|\bq\s?6\s?h|every [46] hours|every other day|\bqod\b|monthly|every month|taper|every 2 weeks|every two weeks|biweekly|five times|5 times|\bq\s?2\s?h|every 3 days|every three days|three times (a |per )?week|twice (a |per )?week|\bq72h|\bq48h/.test(s)) return "other";
  if (/\btid\b|three times|3 times|\bq\s?8\s?h|every 8 hours/.test(s)) return "TID";
  if (/\bbid\b|twice|2 times|\bq\s?12\s?h|every 12 hours/.test(s)) return "BID";
  if (/\bqw\b|weekly|once a week|every week|\bq\s?week|\bqwk\b/.test(s)) return "QW";
  if (/\bqhs\b|\bhs\b|at bedtime|bedtime|nightly|at night/.test(s)) return "QHS";
  if (/\bqd\b|daily|once a day|every day|\bq\s?24\s?h|every 24 hours|each morning|every morning|in the morning|in the evening|every evening|\bqam\b|\bqpm\b|once\b/.test(s)) return "QD";
  return undefined;
}

// ---------------------------------------------------------------------------
// Labs
// ---------------------------------------------------------------------------

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "14682-9": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "48642-3": "egfr", "48643-1": "egfr", "88293-6": "egfr", "88294-4": "egfr", "33914-3": "egfr", "50044-7": "egfr", "69405-9": "egfr", "77147-7": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "14937-7": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose", "14749-6": "glucose", "41653-7": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "13705-9": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "33256-9": "wbc", "804-5": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin", "30350-3": "hemoglobin",
  "53060-9": "bhb", "47984-0": "bhb", "53061-7": "bhb",
  "2744-1": "ph", "2746-6": "ph", "2753-2": "ph", "11558-4": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "2026-3": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "1798-8": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin", "16255-2": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "69419-0": "ldl",
};

const LOCAL_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", CRE: "creatinine", EGFR: "egfr", GFR: "egfr", K: "potassium", NA: "sodium",
  CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate", TCO2: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap",
  BUN: "bun", GLU: "glucose", GLUC: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", MALB_CR: "uacr", ACR: "uacr",
  PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", PH: "ph", VPH: "ph", APH: "ph",
  PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2", LIPASE: "lipase", LIP: "lipase", TROP: "troponin", TROPI: "troponin",
  TNI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

function analyteFromName(n: string): Analyte | undefined {
  const s = n.toLowerCase();
  if (/albumin.*creatinine|\buacr\b|\bacr\b/.test(s)) return "uacr";
  if (/egfr|glomerular/.test(s)) return "egfr";
  if (/hemoglobin a1c|hba1c|\ba1c\b|glycated/.test(s)) return "a1c";
  if (/creatinine/.test(s)) return "creatinine";
  if (/potassium/.test(s)) return "potassium";
  if (/sodium/.test(s)) return "sodium";
  if (/chloride/.test(s)) return "chloride";
  if (/bicarbonate|total co2|\bco2\b/.test(s) && !/pco2/.test(s)) return "bicarbonate";
  if (/anion gap/.test(s)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(s)) return "bun";
  if (/glucose/.test(s)) return "glucose";
  if (/platelet/.test(s)) return "platelets";
  if (/white blood|leukocyte|\bwbc\b/.test(s)) return "wbc";
  if (/hemoglobin|haemoglobin|\bhgb\b/.test(s)) return "hemoglobin";
  if (/hydroxybutyrate/.test(s)) return "bhb";
  if (/^ph\b|\bph,/.test(s)) return "ph";
  if (/pco2/.test(s)) return "pco2";
  if (/lipase/.test(s)) return "lipase";
  if (/troponin/.test(s)) return /troponin t/.test(s) ? undefined : "troponin";
  if (/hdl/.test(s)) return "hdl";
  if (/ldl/.test(s)) return "ldl";
  if (/triglyceride/.test(s)) return "triglycerides";
  if (/cholesterol/.test(s)) return "cholesterol";
  return undefined;
}

const UNIT_OF: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function convertUnit(a: Analyte, v: number, unitRaw: string | undefined): number | null {
  const u = (unitRaw ?? "").trim().toLowerCase().replace(/\s+/g, "").replace(/µ|μ/g, "u");
  const target = UNIT_OF[a].toLowerCase().replace(/\s+/g, "");
  if (u === target || u === "") return v;
  switch (a) {
    case "creatinine":
      if (u === "umol/l") return v / 88.42;
      if (u === "mg/dl") return v;
      return null;
    case "egfr":
      if (/^ml\/min(\/1\.73m(2|\^2|²))?$/.test(u)) return v;
      return null;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      if (u === "meq/l" || u === "mmol/l") return v;
      return null;
    case "bhb":
      if (u === "mmol/l") return v;
      if (u === "mg/dl") return v / 10.41;
      return null;
    case "bun":
      if (u === "mmol/l") return v * 2.801;
      return null;
    case "glucose":
      if (u === "mmol/l") return v * 18.016;
      return null;
    case "a1c":
      if (u === "%" || u === "%hb" || u === "%ofhb" || u === "%(ngsp)") return v;
      if (u === "mmol/mol") return v / 10.929 + 2.15;
      return null;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "ug/mg" || u === "mcg/mg" || u === "mg/gcr") return v;
      if (u === "mg/mmol") return v * 8.84;
      return null;
    case "platelets": case "wbc":
      if (["10*3/ul", "10^3/ul", "k/ul", "x10^3/ul", "10*9/l", "10^9/l", "x10^9/l", "thou/ul", "10e3/ul", "10e9/l", "/nl"].includes(u)) return v;
      if (u === "/ul" || u === "cells/ul" || u === "/mm3") return v / 1000;
      return null;
    case "hemoglobin":
      if (u === "g/dl") return v;
      if (u === "g/l") return v / 10;
      if (u === "mmol/l") return v * 1.611;
      return null;
    case "ph":
      if (u === "[ph]" || u === "ph") return v;
      return null;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return v;
      if (u === "kpa") return v * 7.50062;
      return null;
    case "lipase":
      if (u === "u/l" || u === "iu/l") return v;
      return null;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return v / 1000;
      return null;
    case "cholesterol": case "hdl": case "ldl":
      if (u === "mmol/l") return v * 38.67;
      return null;
    case "triglycerides":
      if (u === "mmol/l") return v * 88.57;
      return null;
  }
  return null;
}

function egfrEquation(name: string): LabResultRow["egfr_equation"] {
  const n = name.toLowerCase();
  if (/mdrd/.test(n)) return "mdrd";
  if (/2021|race[- ]free|without race/.test(n)) return "ckd-epi-2021";
  if (/2009/.test(n)) return "ckd-epi-2009";
  return "unknown";
}

function egfrHasRaceCoefficient(name: string, loinc: string | undefined): boolean {
  if (loinc === "48643-1" || loinc === "88293-6") return true;
  if (loinc === "48642-3" || loinc === "88294-4") return false;
  const n = name.toLowerCase();
  if (/non[- ]?(african|black)|not (african|black)|other races?/.test(n)) return false;
  return /african|black|\baa\b/.test(n);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const ctxs = selectItems(Array.isArray(items) ? items : [], asOf);
    const entries: Entry[] = [];
    for (const ctx of ctxs) {
      const p = ctx.item.payload;
      if (!isObj(p)) continue;
      for (const key of Object.keys(p)) {
        const e = p[key];
        if (isObj(e) && typeof e.type === "string") entries.push({ ctx, key, e });
      }
    }
    safe(() => (out.medications = buildMeds(ctxs, entries)));
    safe(() => (out.problems = buildProblems(entries)));
    safe(() => (out.allergies = buildAllergies(entries)));
    safe(() => (out.labs = buildLabs(entries)));
    safe(() => (out.vitals = buildVitals(entries)));
  } catch {
    // never throw
  }
  return out;
}

function safe(f: () => void) {
  try { f(); } catch { /* skip */ }
}

function selectItems(items: FolioItem[], asOf: string): Ctx[] {
  const valid = items.filter((it) => isObj(it) && typeof it.id === "string");
  const counting = valid.filter((it) => {
    const r = parseTime(it.recorded);
    if (!r) return false;
    const d = r.partial ? r.partial : wallDate(r.wall);
    return d.slice(0, 10) <= asOf;
  });
  const ids = new Set(counting.map((i) => i.id));
  // retractions: a retracted retractor has no effect (fixed point)
  let retracted = new Set<string>();
  for (let iter = 0; iter < 20; iter++) {
    const next = new Set<string>();
    for (const it of counting) {
      if (retracted.has(it.id)) continue;
      for (const r of Array.isArray(it.retracts) ? it.retracts : []) if (ids.has(r)) next.add(r);
    }
    const same = next.size === retracted.size && [...next].every((x) => retracted.has(x));
    retracted = next;
    if (same) break;
  }
  const superseded = new Set<string>();
  for (const it of counting) {
    if (retracted.has(it.id)) continue;
    for (const s of Array.isArray(it.supersedes) ? it.supersedes : []) superseded.add(s);
  }
  const live = counting.filter((it) => !retracted.has(it.id) && !superseded.has(it.id));
  const keyed = live.map((item) => {
    const end = parseTime(item.effective_end) ?? parseTime(item.effective);
    const rec = parseTime(item.recorded);
    return { item, order: end ? end.ms : rec ? rec.ms : 0, rec: rec ? rec.ms : 0 };
  });
  keyed.sort((a, b) => a.order - b.order || a.rec - b.rec || (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0));
  return keyed.map((k, idx) => ({ item: k.item, order: k.order, idx }));
}

function itemLocalDate(it: FolioItem): PartialDate | undefined {
  // a status set in a document spanning a stay (discharge summary) takes effect at its end
  return localDate(it.effective_end) ?? localDate(it.effective) ?? localDate(it.recorded);
}

// ---------------------------- Medications ----------------------------------

function medStatus(s: unknown): MedicationRow["status"] | null {
  switch (s) {
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
    case "not_reconciled": return "unknown";
  }
  return null;
}

function stopReason(text: string): MedicationRow["stop_reason"] | undefined {
  const t = text.toLowerCase();
  if (!t) return undefined;
  if (/rash|hives|reaction|allerg|side effect|adverse|intoleran|angioedema|swelling|nausea|cough|ketoacidosis|dka|injury|toxicity|pancreatitis|hypoglyc|bleed/.test(t)) return "adverse_reaction";
  if (/ineffective|not effective|no benefit|did not work|failed|inadequate/.test(t)) return "ineffective";
  if (/switch|replac|changed to|change to|instead|in favor of|transition/.test(t)) return "therapy_changed";
  if (/course complete|completed|finished|end of course|course ended/.test(t)) return "course_complete";
  if (/patient (choice|preference|declined|decided|request)|declined|prefers/.test(t)) return "patient_choice";
  return "other";
}

function buildMeds(ctxs: Ctx[], entries: Entry[]): MedicationRow[] {
  const medEntries = entries.filter((x) => x.e.type === "home_med" && (str(x.e.drug_name) || str(x.e.rxnorm_ingredient)));
  if (!medEntries.length) return [];
  const keyOf = (e: Record<string, any>) => {
    const ing = ingredientOf(str(e.drug_name));
    return ing ?? (str(e.rxnorm_ingredient) ? `rx:${e.rxnorm_ingredient}` : (str(e.drug_name) ?? "").toLowerCase());
  };
  // snapshots: ordered items with home_med entries
  const byItem = new Map<number, Entry[]>();
  for (const m of medEntries) {
    const arr = byItem.get(m.ctx.idx) ?? [];
    arr.push(m);
    byItem.set(m.ctx.idx, arr);
  }
  const order = [...byItem.keys()].sort((a, b) => a - b);
  const latestIdx = order[order.length - 1];
  const latest = byItem.get(latestIdx)!;

  const rows: MedicationRow[] = [];
  const seen = new Set<string>();
  for (const m of latest) {
    const key = keyOf(m.e);
    if (seen.has(key)) continue;
    const status = medStatus(m.e.status);
    if (!status) continue;
    seen.add(key);
    const e = m.e;
    const drugName = str(e.drug_name) ?? "";
    const ingredient = ingredientOf(drugName);
    const ev: Evidence = [];
    // walk back through earlier snapshots to find when the current status began
    let since: PartialDate | undefined;
    let runStart: Entry = m;
    let prevStatus: MedicationRow["status"] | null = null;
    let runInstr = str(m.e.instructions);
    if (!(status === "active" && (m.e.status === "new" || m.e.status === "changed"))) {
      for (let i = order.length - 2; i >= 0; i--) {
        const prev = byItem.get(order[i])!.find((x) => keyOf(x.e) === key);
        if (!prev) break;
        const ps = medStatus(prev.e.status);
        if (ps !== status) { prevStatus = ps; break; }
        runStart = prev;
        if (!runInstr) runInstr = str(prev.e.instructions);
        if (status === "active" && (prev.e.status === "new" || prev.e.status === "changed")) break;
      }
    }
    if (status === "held" || status === "stopped") {
      since = itemLocalDate(runStart.ctx.item);
    } else if (status === "active") {
      if (runStart.e.status === "new" || runStart.e.status === "changed" || prevStatus === "held" || prevStatus === "stopped") {
        since = itemLocalDate(runStart.ctx.item);
      }
    }
    if (runStart !== m) addEv(ev, runStart.ctx.item.id, runStart.key);
    addEv(ev, m.ctx.item.id, m.key);

    const row: MedicationRow = {
      drug_name: drugName || (ingredient ?? ""),
      status,
      patient_reported: false,
      evidence: ev,
    };
    if (ingredient) row.ingredient = ingredient;
    if (str(e.rxnorm_ingredient)) row.rxnorm_ingredient = String(e.rxnorm_ingredient).trim();
    if (since) row.status_since = since;
    const dose = parseDose(drugName, str(e.dose_text) ?? "", str(e.sig) ?? "");
    if (dose) row.dose = dose;
    const freq = parseFrequency(str(e.sig) ?? "");
    if (freq) row.frequency = freq;
    const instr = runInstr;
    if (instr && status !== "unknown") row.status_reason_text = instr;
    if (status === "stopped" && instr) {
      const r = stopReason(instr);
      if (r) row.stop_reason = r;
    }
    if (/over[- ]the[- ]counter|\botc\b/i.test(`${drugName} ${instr ?? ""} ${str(e.sig) ?? ""}`)) row.otc = true;
    const sens = drugSensitivity(ingredient, `${drugName} ${instr ?? ""} ${str(e.sig) ?? ""}`);
    if (sens) row.sensitivity = sens;
    rows.push(row);
  }
  return rows;
}

// ---------------------------- Problems -------------------------------------

function normLabel(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function parseOnsetText(t: string | undefined): ProblemRow["onset"] | undefined {
  if (!t) return undefined;
  const s = t.trim();
  let m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(s);
  if (m) return { value: s, precision: m[3] ? "day" : m[2] ? "month" : "year" };
  m = /^(\d{4}-\d{2}-\d{2})T/.exec(s);
  if (m) { const d = localDate(s); if (d) return { value: d, precision: "day" }; }
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  m = /^(?:(?:in|since|around|circa|about|approx\.?|~)\s+)?([a-z]+)\.?\s+(\d{4})$/i.exec(s);
  if (m) {
    const idx = months.findIndex((mo) => mo.startsWith(m![1].toLowerCase()) && m![1].length >= 3);
    if (idx >= 0) return { value: `${m[2]}-${pad(idx + 1)}`, precision: "month" };
  }
  m = /^(\d{1,2})\/(\d{4})$/.exec(s);
  if (m && +m[1] >= 1 && +m[1] <= 12) return { value: `${m[2]}-${pad(+m[1])}`, precision: "month" };
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (m && +m[1] <= 12 && +m[2] <= 31) return { value: `${m[3]}-${pad(+m[1])}-${pad(+m[2])}`, precision: "day" };
  m = /^(?:(?:in|since|around|circa|about|approx\.?|~)\s+)?(\d{4})$/i.exec(s);
  if (m) return { value: m[1], precision: "year" };
  return undefined;
}

function ckdStage(label: string, icd: string | undefined): ProblemRow["ckd_stage"] | undefined {
  const l = label.toLowerCase();
  let m = /\bg([1-5])([ab])?\b/i.exec(label);
  if (m) {
    const s = `G${m[1]}${m[1] === "3" && m[2] ? m[2].toLowerCase() : ""}`;
    if (s !== "G3") return s as ProblemRow["ckd_stage"];
  }
  m = /stage\s*(1|2|3a|3b|4|5|i{1,3}v?|iv|v)\b/i.exec(l);
  if (m) {
    const v = m[1].toLowerCase();
    const map: Record<string, ProblemRow["ckd_stage"]> = { "1": "G1", i: "G1", "2": "G2", ii: "G2", "3a": "G3a", "3b": "G3b", "4": "G4", iv: "G4", "5": "G5", v: "G5" };
    if (map[v]) return map[v];
  }
  const c = (icd ?? "").toUpperCase();
  if (c === "N18.1") return "G1";
  if (c === "N18.2") return "G2";
  if (c === "N18.31") return "G3a";
  if (c === "N18.32") return "G3b";
  if (c === "N18.4") return "G4";
  if (c === "N18.5" || c === "N18.6") return "G5";
  return undefined;
}

function albuminuriaCat(label: string): ProblemRow["albuminuria"] | undefined {
  const m = /\bA([1-3])\b/.exec(label);
  if (m) return `A${m[1]}` as ProblemRow["albuminuria"];
  const l = label.toLowerCase();
  if (/severely increased albuminuria|macroalbuminuria/.test(l)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria/.test(l)) return "A2";
  if (/normal to mildly increased albuminuria/.test(l)) return "A1";
  return undefined;
}

interface DrugAttribution { phrase: string; condition: string | null }

function drugAttribution(label: string, rdxName: string | undefined, icd: string | undefined): DrugAttribution | null {
  const c = (icd ?? "").toUpperCase();
  if (/^T(3[6-9]|4[0-9]|50)\.[0-9A-Z]{1,2}X?5|^T(3[6-9]|4[0-9]|50)\.\d{2}5/.test(c)) {
    const t = T_CODES.find((x) => x.re.test(c));
    const pure = /^adverse effect of /i.test(label.trim());
    const fromLabel = /adverse effect of\s+(.+?)(?:,|;|$)/i.exec(label)?.[1];
    return { phrase: fromLabel ?? t?.label ?? label, condition: pure ? null : label };
  }
  for (const text of [label, rdxName ?? ""]) {
    if (!text) continue;
    let m = /adverse effect of\s+(.+?)(?:,|;|$)/i.exec(text);
    if (m) {
      const pure = /^adverse effect of /i.test(text.trim());
      return { phrase: m[1].trim(), condition: pure ? null : stripAttribution(label) };
    }
    m = /(?:due to|caused by|secondary to|induced by|associated with|attributed to|from)\s+(.+?)(?:,|;|\)|$)/i.exec(text);
    if (m && looksLikeDrug(m[1])) return { phrase: m[1].trim(), condition: stripAttribution(label) };
    m = /([A-Za-z0-9][A-Za-z0-9 /-]*?)[- ](?:induced|associated|related|attributed)\b/i.exec(text);
    if (m && looksLikeDrug(m[1])) return { phrase: m[1].trim(), condition: stripAttribution(label) };
  }
  return null;
}

function looksLikeDrug(phrase: string): boolean {
  const p = phrase.toLowerCase().trim();
  if (!p) return false;
  if (/^(drug|medication|medicine)s?$/.test(p)) return false;
  if (DRUG_CLASSES.some((c) => c.re.test(p))) return true;
  const ing = ingredientOf(p);
  if (ing && Object.values(BRANDS).includes(ing)) return true;
  if (BRANDS[p]) return true;
  if (/(pril|sartan|statin|olol|azole|mycin|cillin|cycline|floxacin|gliflozin|gliptin|glutide|dipine|tidine|prazole|oxetine|azepam|parin|xaban|mab|nib|vir|thiazide|semide|profen|proxen|fenac|platin|taxel|rubicin|amide|metformin|lithium|steroid|prednis|insulin|chemotherapy|opioid|antibiotic|contrast)/.test(p)) return true;
  return false;
}

function stripAttribution(label: string): string {
  return label
    .replace(/,?\s*(?:due to|caused by|secondary to|induced by|associated with|attributed to)\s+.+$/i, "")
    .replace(/,?\s*[A-Za-z0-9 /-]+[- ](?:induced|associated|related)\b/i, "")
    .replace(/\s+/g, " ")
    .replace(/[,;\s]+$/, "")
    .trim() || label;
}

interface ProbGroup { keys: Set<string>; entries: Entry[] }

function buildProblems(entries: Entry[]): ProblemRow[] {
  const dx = entries.filter((x) => (x.e.type === "diagnosis" && (str(x.e.label) || str(x.e.riverside_dx?.name))) || (x.e.type === "history" && str(x.e.condition)));
  const groups: ProbGroup[] = [];
  for (const x of dx) {
    const label = str(x.e.label) ?? str(x.e.condition) ?? str(x.e.riverside_dx?.name) ?? "";
    // pure adverse-effect codes give an allergy row only
    if (x.e.type === "diagnosis") {
      const att = drugAttribution(label, str(x.e.riverside_dx?.name), str(x.e.icd10cm));
      if (att && att.condition === null) continue;
    }
    const keys = new Set<string>();
    if (str(x.e.icd10cm)) keys.add(`icd:${String(x.e.icd10cm).toUpperCase().trim()}`);
    if (isObj(x.e.riverside_dx) && str(x.e.riverside_dx.code)) keys.add(`rdx:${x.e.riverside_dx.code}`);
    keys.add(`lbl:${normLabel(label)}`);
    const hits = groups.filter((g) => [...keys].some((k) => g.keys.has(k)));
    if (hits.length === 0) groups.push({ keys, entries: [x] });
    else {
      const g = hits[0];
      for (const k of keys) g.keys.add(k);
      g.entries.push(x);
      for (const h of hits.slice(1)) {
        for (const k of h.keys) g.keys.add(k);
        g.entries.push(...h.entries);
        groups.splice(groups.indexOf(h), 1);
      }
    }
  }
  const rows: ProblemRow[] = [];
  for (const g of groups) {
    const sorted = [...g.entries].sort((a, b) => a.ctx.idx - b.ctx.idx || (a.e.type === "history" ? -1 : 1) - (b.e.type === "history" ? -1 : 1));
    const latest = sorted[sorted.length - 1];
    const latestStatus = latest.e.type === "history" ? "active" : latest.e.status;
    if (latestStatus === "ruled_out") continue;
    // the entry that gives status: latest confirmed (active/resolved/history)
    const confirmed = sorted.filter((x) => x.e.type === "history" || x.e.status === "active" || x.e.status === "resolved");
    if (!confirmed.length) continue;
    const cur = confirmed[confirmed.length - 1];
    const label = str(cur.e.label) ?? str(cur.e.condition) ?? str(cur.e.riverside_dx?.name) ?? "";
    const icd = str(cur.e.icd10cm);
    const status: ProblemRow["status"] = cur.e.type === "diagnosis" && cur.e.status === "resolved" ? "resolved" : "active";
    const ev: Evidence = [];
    for (const x of confirmed) addEv(ev, x.ctx.item.id, x.key);
    const row: ProblemRow = { condition: label, status, evidence: ev };
    if (icd) row.icd10cm = icd;
    // onset from history entries
    for (let i = sorted.length - 1; i >= 0; i--) {
      const o = parseOnsetText(str(sorted[i].e.onset_text));
      if (o) { row.onset = o; break; }
    }
    const isCkd = /chronic kidney disease|\bckd\b/i.test(label) || /^N18/i.test(icd ?? "");
    if (isCkd) {
      for (let i = confirmed.length - 1; i >= 0; i--) {
        const l = `${str(confirmed[i].e.label) ?? str(confirmed[i].e.condition) ?? ""} ${str(confirmed[i].e.riverside_dx?.name) ?? ""}`;
        const st = ckdStage(l, str(confirmed[i].e.icd10cm));
        if (st) { row.ckd_stage = st; break; }
      }
      for (let i = confirmed.length - 1; i >= 0; i--) {
        const l = `${str(confirmed[i].e.label) ?? str(confirmed[i].e.condition) ?? ""} ${str(confirmed[i].e.riverside_dx?.name) ?? ""}`;
        const al = albuminuriaCat(l);
        if (al) { row.albuminuria = al; break; }
      }
    }
    const sens = conditionSensitivity(`${label} ${str(cur.e.riverside_dx?.name) ?? ""}`, icd);
    if (sens) row.sensitivity = sens;
    rows.push(row);
  }
  return rows;
}

// ---------------------------- Allergies ------------------------------------

const HYPERSENSITIVITY_RE = /hive|urticari|rash|swell|angioedema|anaphyla|bronchospasm|wheez|itch|prurit|lip|tongue|throat|face|facial|eruption|blister|stevens|sjs|toxic epidermal|ten\b|dress\b|exanthem|flushing|shortness of breath|difficulty breathing|hypotension|serum sickness|erythema/i;
const SERIOUS_RE = /liver|hepat|pancreatit|ketoacidosis|\bdka\b|agranulocyt|neutropeni|aplastic|kidney injury|renal failure|nephrotox|rhabdo|qt prolong|torsade|arrhythm|seizure|hemorrhag|bleed|lactic acidosis|hyperkal|myopathy|tendon rupture|neuroleptic malignant|serotonin syndrome|thrombocytop|hemolys|interstitial|pneumonitis|cardiomyopathy|ototox|hearing loss|hypoglycemi|osteonecrosis/i;
const NON_IMMUNE_RE = /^(cough|dry cough|nausea|vomiting|diarrh|upset stomach|stomach upset|gi upset|abdominal pain|constipation|drowsiness|sedation|dizziness|headache|myalgia|muscle aches?|fatigue|insomnia|jitter|palpitations|flushing with niacin|edema|ankle swelling)/i;

function classifyReaction(reaction: string | undefined): AllergyIntoleranceRow["reaction_type"] {
  const r = reaction ?? "";
  if (!r) return "hypersensitivity";
  if (HYPERSENSITIVITY_RE.test(r) && !/ankle swelling|leg swelling|edema/i.test(r)) return "hypersensitivity";
  if (SERIOUS_RE.test(r)) return "serious_adverse_event";
  return "side_effect";
}

function substanceName(raw: string, rx: string | undefined): string {
  const t = raw.trim();
  const lower = t.toLowerCase();
  if (BRANDS[lower]) return BRANDS[lower];
  if (DRUG_CLASSES.some((c) => c.re.test(lower)) && !/[0-9]/.test(lower)) {
    // a class as written, unless it is itself a single ingredient name
    if (!/^[a-z]+$/.test(lower) || /s$/.test(lower) || /inhibitor|blocker|nsaid|class/.test(lower)) return t;
  }
  if (rx || /\d\s*(mg|mcg)/i.test(t) || looksLikeDrug(lower) || BRANDS[lower.split(/\s+/)[0]]) {
    const ing = ingredientOf(t);
    if (ing) return ing;
  }
  return t;
}

function buildAllergies(entries: Entry[]): AllergyIntoleranceRow[] {
  const byKey = new Map<string, { row: AllergyIntoleranceRow; idx: number }>();
  const put = (key: string, idx: number, mk: () => AllergyIntoleranceRow, ev: { item_id: string; entry_id?: string }) => {
    const prev = byKey.get(key);
    if (prev && prev.idx > idx) { addEv(prev.row.evidence, ev.item_id, ev.entry_id); return; }
    const row = mk();
    if (prev) for (const e of prev.row.evidence) addEv(row.evidence, e.item_id, e.entry_id);
    addEv(row.evidence, ev.item_id, ev.entry_id);
    // keep evidence order: current last
    byKey.set(key, { row, idx });
  };

  for (const x of entries) {
    if (x.e.type !== "allergy") continue;
    const rawSub = str(x.e.substance);
    if (!rawSub) continue;
    if (/^(no known|nka|nkda|none)\b/i.test(rawSub)) continue;
    const rx = str(x.e.rxnorm_ingredient);
    const substance = substanceName(rawSub, rx);
    const reaction = str(x.e.reaction);
    const key = rx ? `rx:${rx}` : `s:${substance.toLowerCase()}`;
    put(key, x.ctx.idx, () => {
      const rt = classifyReaction(reaction);
      const sev = x.e.severity;
      let crit: AllergyIntoleranceRow["criticality"] = sev === "mild" || sev === "moderate" ? "low" : sev === "severe" ? "high" : "unknown";
      if (/anaphyla/i.test(reaction ?? "") && crit !== "high") crit = sev === "mild" ? crit : "high";
      let mech: AllergyIntoleranceRow["mechanism"] = "unknown";
      if (/ige|immune[- ]mediated|positive (skin|patch) test|allergy test positive/i.test(reaction ?? "")) mech = "immune";
      else if (rt === "side_effect" && reaction && NON_IMMUNE_RE.test(reaction.trim())) mech = "non_immune";
      const row: AllergyIntoleranceRow = { substance, reaction_type: rt, mechanism: mech, criticality: crit, evidence: [] };
      if (rx) row.rxnorm_ingredient = rx;
      if (reaction) row.reaction = reaction.split(/\s*[;,]\s*|\s+and\s+/).filter(Boolean).join("; ");
      return row;
    }, { item_id: x.ctx.item.id, entry_id: x.key });
  }

  // drug-attributed diagnoses
  for (const x of entries) {
    if (x.e.type !== "diagnosis") continue;
    if (x.e.status !== "active" && x.e.status !== "resolved") continue;
    const label = str(x.e.label) ?? str(x.e.riverside_dx?.name) ?? "";
    const att = drugAttribution(label, str(x.e.riverside_dx?.name), str(x.e.icd10cm));
    if (!att) continue;
    const phrase = att.phrase;
    const cls = DRUG_CLASSES.find((c) => c.re.test(phrase));
    let substance: string;
    let rx: string | undefined;
    const meds = Object.entries(x.ctx.item.payload ?? {}).filter(([, v]) => isObj(v) && (v.type === "home_med" || v.type === "inpatient_med"));
    const isClass = !!cls && !(ingredientOf(phrase) && cls.members.includes(ingredientOf(phrase)!));
    if (isClass || T_CODES.some((t) => t.label === phrase)) {
      const members = cls ? cls.members : [];
      const onList = new Map<string, string | undefined>();
      for (const [, v] of meds) {
        const ing = ingredientOf(str((v as any).drug_name));
        if (ing && members.includes(ing)) onList.set(ing, str((v as any).rxnorm_ingredient));
      }
      if (onList.size === 1) {
        const [ing, r] = [...onList.entries()][0];
        substance = ing;
        rx = r;
      } else {
        substance = phrase;
      }
    } else {
      substance = ingredientOf(phrase) ?? phrase;
      for (const [, v] of meds) {
        if (ingredientOf(str((v as any).drug_name)) === substance) rx = str((v as any).rxnorm_ingredient);
      }
    }
    const condition = att.condition ?? label;
    const reactionText = stripAttribution(condition);
    const key = rx ? `rx:${rx}` : `s:${substance.toLowerCase()}`;
    // a listed allergy entry for the same substance takes precedence over the derived one
    const existing = byKey.get(key);
    if (existing && existing.row.evidence.some((e) => entries.some((y) => y.e.type === "allergy" && y.ctx.item.id === e.item_id && y.key === e.entry_id))) {
      addEv(existing.row.evidence, x.ctx.item.id, x.key);
      continue;
    }
    put(key, x.ctx.idx, () => {
      const rt0 = classifyReaction(reactionText);
      const rt: AllergyIntoleranceRow["reaction_type"] = rt0 === "side_effect" && !NON_IMMUNE_RE.test(reactionText) ? (SERIOUS_RE.test(reactionText) ? "serious_adverse_event" : rt0) : rt0;
      const row: AllergyIntoleranceRow = {
        substance,
        reaction_type: rt,
        mechanism: "unknown",
        criticality: rt === "serious_adverse_event" || /anaphyla/i.test(reactionText) ? "high" : "unknown",
        reaction: reactionText,
        evidence: [],
      };
      if (rx) row.rxnorm_ingredient = rx;
      return row;
    }, { item_id: x.ctx.item.id, entry_id: x.key });
  }
  return [...byKey.values()].map((v) => v.row);
}

// ---------------------------- Labs -----------------------------------------

const STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

function parseValue(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | null {
  if (typeof v === "number" && isFinite(v)) return { value: v };
  if (typeof v !== "string") return null;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(v);
  if (!m) return null;
  const c = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as LabResultRow["comparator"] | undefined);
  const r: { value: number; comparator?: LabResultRow["comparator"] } = { value: Number(m[2]) };
  if (c) r.comparator = c;
  return r;
}

function buildLabs(entries: Entry[]): LabResultRow[] {
  interface Cand { analyte: Analyte; value: number; comparator?: LabResultRow["comparator"]; collected: string; status: string; rank: number; loinc?: string; eq?: LabResultRow["egfr_equation"]; ev: { item_id: string; entry_id?: string }; idx: number }
  const groups = new Map<string, Cand[]>();
  const order: string[] = [];
  const add = (x: Entry, comp: Record<string, any>, header: Record<string, any>) => {
    const test = isObj(comp.test) ? comp.test : {};
    const loinc = str(test.loinc);
    const local = (str(test.local_code) ?? "").toUpperCase();
    const name = str(test.name) ?? "";
    const analyte: Analyte | undefined = (loinc && LOINC_ANALYTE[loinc]) || LOCAL_ANALYTE[local] || analyteFromName(name);
    if (!analyte) return;
    const specimen = (str(header.specimen) ?? "").toLowerCase();
    if (analyte === "uacr") { if (specimen && !/urine/.test(specimen)) return; }
    else if (/urine|csf|cerebrospinal|pleural|peritoneal|ascit|synovial|fluid|stool/.test(specimen)) return;
    if (analyte === "glucose" && /meter|home|fingerstick|capillary|poc/.test(`${specimen} ${name.toLowerCase()}`) && /meter|home/.test(`${specimen} ${name.toLowerCase()}`)) return;
    if (analyte === "egfr" && egfrHasRaceCoefficient(name, loinc)) return;
    const status = str(header.status);
    if (!status || !(status in STATUS_RANK)) return;
    const pv = parseValue(comp.value);
    if (!pv) return;
    const conv = convertUnit(analyte, pv.value, str(comp.unit) ?? (analyte === "ph" ? "[pH]" : undefined));
    if (conv === null || !isFinite(conv)) return;
    const collected = rfc3339Local(header.collected);
    if (!collected) return;
    const value = analyte === "ph" ? round(conv, 3) : round(conv, 2);
    const acc = str(header.accession) ?? `${collected}`;
    const gkey = `${acc}|${analyte}|${analyte === "egfr" ? (local || name.toLowerCase()) : ""}|${collected}`;
    const c: Cand = { analyte, value, collected, status, rank: STATUS_RANK[status], ev: { item_id: x.ctx.item.id, entry_id: x.key }, idx: x.ctx.idx };
    if (pv.comparator) c.comparator = pv.comparator;
    if (loinc) c.loinc = loinc;
    if (analyte === "egfr") c.eq = egfrEquation(name);
    if (!groups.has(gkey)) { groups.set(gkey, []); order.push(gkey); }
    groups.get(gkey)!.push(c);
  };
  for (const x of entries) {
    if (x.e.type === "result") add(x, x.e, x.e);
    else if (x.e.type === "panel" && Array.isArray(x.e.components)) {
      for (const comp of x.e.components) if (isObj(comp)) add(x, comp, x.e);
    }
  }
  const rows: LabResultRow[] = [];
  for (const k of order) {
    const cands = groups.get(k)!;
    const best = [...cands].sort((a, b) => b.rank - a.rank || b.idx - a.idx)[0];
    const ev: Evidence = [];
    for (const c of cands) if (c.rank === best.rank && c.value === best.value) addEv(ev, c.ev.item_id, c.ev.entry_id);
    const row: LabResultRow = {
      analyte: best.analyte,
      value: best.value,
      unit: UNIT_OF[best.analyte],
      collected: best.collected,
      status: best.status === "preliminary" ? "preliminary" : "final",
      evidence: ev,
    };
    if (best.comparator) row.comparator = best.comparator;
    if (best.analyte === "egfr") row.egfr_equation = best.eq ?? "unknown";
    if (best.loinc) row.loinc = best.loinc;
    rows.push(row);
  }
  rows.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : 0));
  return rows;
}

// ---------------------------- Vitals ---------------------------------------

function buildVitals(entries: Entry[]): VitalRow[] {
  interface V { x: Entry; ms: number; wall: Wall; setting: VitalRow["setting"]; enc?: string }
  const vs: V[] = [];
  for (const x of entries) {
    if (x.e.type !== "vitals") continue;
    const t = parseTime(x.e.taken);
    if (!t || t.precision !== "time") continue;
    const encEntry = Object.values(x.ctx.item.payload ?? {}).find((v) => isObj(v) && v.type === "encounter") as Record<string, any> | undefined;
    const cls = encEntry?.class;
    const setting: VitalRow["setting"] = cls === "emergency" || cls === "inpatient" || !cls ? "hospital" : "clinic";
    vs.push({ x, ms: t.ms, wall: t.wall, setting, enc: str(encEntry?.encounter_id) });
  }
  vs.sort((a, b) => a.ms - b.ms || a.x.ctx.idx - b.x.ctx.idx);
  const num = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : typeof v === "string" && /^\s*\d+(\.\d+)?\s*$/.test(v) ? Number(v) : undefined);
  const rows: { row: VitalRow; ms: number; enc?: string; firstBpMs?: number }[] = [];
  for (const v of vs) {
    const e = v.x.e;
    const bp = isObj(e.bp) ? { s: num(e.bp.systolic_mmhg), d: num(e.bp.diastolic_mmhg) } : undefined;
    const hasBp = !!bp && bp.s !== undefined && bp.d !== undefined;
    const pulse = num(e.heart_rate_bpm);
    const wt = num(e.weight_kg);
    if (!hasBp && pulse === undefined && wt === undefined) continue;
    // same set: same encounter, within 15 minutes of the set's start
    const last = rows[rows.length - 1];
    if (last && last.row.setting === v.setting && (last.enc ?? "") === (v.enc ?? "") && v.ms - last.ms <= 15 * 60000) {
      const r = last.row;
      const dup = v.ms === last.ms || (hasBp && r.systolic_mmhg === bp!.s && r.diastolic_mmhg === bp!.d && (pulse === undefined || r.pulse_bpm === pulse));
      if (dup) {
        if (r.pulse_bpm === undefined && pulse !== undefined) r.pulse_bpm = pulse;
        if (r.weight_kg === undefined && wt !== undefined) r.weight_kg = round(wt, 1);
        if (r.systolic_mmhg === undefined && hasBp) { r.systolic_mmhg = bp!.s; r.diastolic_mmhg = bp!.d; r.local_time = wallMinute(v.wall); }
        addEv(r.evidence, v.x.ctx.item.id, v.x.key);
        continue;
      }
      if (hasBp && r.systolic_mmhg !== undefined && r.repeat_systolic_mmhg === undefined) {
        r.repeat_systolic_mmhg = bp!.s;
        r.repeat_diastolic_mmhg = bp!.d;
        if (r.pulse_bpm === undefined && pulse !== undefined) r.pulse_bpm = pulse;
        if (r.weight_kg === undefined && wt !== undefined) r.weight_kg = round(wt, 1);
        addEv(r.evidence, v.x.ctx.item.id, v.x.key);
        continue;
      }
      if (!hasBp || r.systolic_mmhg === undefined) {
        if (r.pulse_bpm === undefined && pulse !== undefined) r.pulse_bpm = pulse;
        if (r.weight_kg === undefined && wt !== undefined) r.weight_kg = round(wt, 1);
        if (r.systolic_mmhg === undefined && hasBp) { r.systolic_mmhg = bp!.s; r.diastolic_mmhg = bp!.d; r.local_time = wallMinute(v.wall); }
        addEv(r.evidence, v.x.ctx.item.id, v.x.key);
        continue;
      }
    }
    const row: VitalRow = { setting: v.setting, local_time: wallMinute(v.wall), evidence: [] };
    if (hasBp) { row.systolic_mmhg = bp!.s; row.diastolic_mmhg = bp!.d; }
    if (pulse !== undefined) row.pulse_bpm = pulse;
    if (wt !== undefined) row.weight_kg = round(wt, 1);
    addEv(row.evidence, v.x.ctx.item.id, v.x.key);
    rows.push({ row, ms: v.ms, enc: v.enc });
  }
  return rows.map((r) => r.row);
}
