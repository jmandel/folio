import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  VitalRow,
  Evidence,
  Sensitivity,
  PartialDate,
} from "../in/views/views";

// Mapper for HomeLog (patient-kept home diary). HomeLog publishes:
//  - "My Medicines" items: full snapshots of the patient's own medication list (my_med entries);
//  - day items: home BP readings, home glucose readings, dose logs and diary notes.
// Only medications and vitals are produced; HomeLog has no problems, allergies or laboratory results.

const TZ = "America/Chicago";

// ---------------------------------------------------------------------------------------------------------
// Time helpers

let dtf: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number): { y: string; mo: string; d: string; h: string; mi: string } | null {
  try {
    if (!dtf) {
      dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      });
    }
    const p: Record<string, string> = {};
    for (const part of dtf.formatToParts(new Date(ms))) p[part.type] = part.value;
    const h = p.hour === "24" ? "00" : p.hour;
    return { y: p.year, mo: p.month, d: p.day, h, mi: p.minute };
  } catch {
    return null;
  }
}

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

/** Local wall-clock `YYYY-MM-DDTHH:MM` for a date-time; times without offset are already local. */
function localDateTime(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/.exec(t);
  if (!m) return null;
  if (!HAS_ZONE.test(t)) return `${m[1]}T${m[2]}:${m[3]}`;
  const ms = Date.parse(t);
  if (isNaN(ms)) return null;
  const p = chicagoParts(ms);
  if (!p) return null;
  return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}`;
}

/** Local date with source precision (YYYY, YYYY-MM, YYYY-MM-DD). */
function localPartialDate(s: unknown): PartialDate | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  const dt = localDateTime(t);
  return dt ? dt.slice(0, 10) : null;
}

function minutesOf(localDt: string): number | null {
  const ms = Date.parse(localDt + ":00Z");
  return isNaN(ms) ? null : ms / 60000;
}

// ---------------------------------------------------------------------------------------------------------
// Which items count as of the end of asOf

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope: FolioItem[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const rec = localPartialDate(it.recorded);
    if (!rec || rec.length !== 10) continue;
    if (rec <= asOf) inScope.push(it);
  }
  const retracted = new Set<string>();
  for (const it of inScope) for (const r of asArray(it.retracts)) if (typeof r === "string") retracted.add(r);
  const live = inScope.filter((it) => !retracted.has(it.id));
  const byId = new Map<string, FolioItem>();
  for (const it of live) byId.set(it.id, it);
  const replaced = new Set<string>();
  const visit = (id: string) => {
    if (replaced.has(id)) return;
    replaced.add(id);
    const t = byId.get(id);
    if (t) for (const s of asArray(t.supersedes)) if (typeof s === "string") visit(s);
  };
  for (const it of live) for (const s of asArray(it.supersedes)) if (typeof s === "string") visit(s);
  return live.filter((it) => !replaced.has(it.id));
}

function asArray(x: unknown): unknown[] {
  return Array.isArray(x) ? x : [];
}

function entries(it: FolioItem): [string, Record<string, any>][] {
  const out: [string, Record<string, any>][] = [];
  const p = it.payload;
  if (!p || typeof p !== "object") return out;
  for (const k of Object.keys(p)) {
    const e = (p as Record<string, any>)[k];
    if (e && typeof e === "object" && !Array.isArray(e)) out.push([k, e]);
  }
  return out;
}

function num(x: unknown): number | null {
  return typeof x === "number" && isFinite(x) ? x : null;
}

function cmpStr(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

// ---------------------------------------------------------------------------------------------------------
// Medications

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  "glucophage xr": "metformin", glumetza: "metformin", fortamet: "metformin", crestor: "rosuvastatin",
  lipitor: "atorvastatin", zocor: "simvastatin", pravachol: "pravastatin", livalo: "pitavastatin",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", euthyrox: "levothyroxine",
  tirosint: "levothyroxine", farxiga: "dapagliflozin", jardiance: "empagliflozin", invokana: "canagliflozin",
  steglatro: "ertugliflozin", glucotrol: "glipizide", "glucotrol xl": "glipizide", amaryl: "glimepiride",
  diabeta: "glyburide", micronase: "glyburide", januvia: "sitagliptin", tradjenta: "linagliptin",
  onglyza: "saxagliptin", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", trulicity: "dulaglutide", mounjaro: "tirzepatide",
  zepbound: "tirzepatide", byetta: "exenatide", actos: "pioglitazone", lantus: "insulin glargine",
  basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  lyumjev: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  aleve: "naproxen", naprosyn: "naproxen", anaprox: "naproxen", advil: "ibuprofen", motrin: "ibuprofen",
  tylenol: "acetaminophen", paracetamol: "acetaminophen", bayer: "aspirin", ecotrin: "aspirin",
  "baby aspirin": "aspirin", celebrex: "celecoxib", mobic: "meloxicam", cozaar: "losartan", diovan: "valsartan",
  benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan", atacand: "candesartan",
  vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", accupril: "quinapril",
  toprol: "metoprolol", "toprol xl": "metoprolol", lopressor: "metoprolol", tenormin: "atenolol",
  coreg: "carvedilol", bystolic: "nebivolol", microzide: "hydrochlorothiazide", hctz: "hydrochlorothiazide",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", aldactone: "spironolactone",
  inspra: "eplerenone", cardizem: "diltiazem", calan: "verapamil", procardia: "nifedipine",
  adalat: "nifedipine", plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", jantoven: "warfarin", pradaxa: "dabigatran", brilinta: "ticagrelor",
  zetia: "ezetimibe", tricor: "fenofibrate", lopid: "gemfibrozil", prilosec: "omeprazole",
  nexium: "esomeprazole", protonix: "pantoprazole", prevacid: "lansoprazole", aciphex: "rabeprazole",
  pepcid: "famotidine", zantac: "ranitidine", zyrtec: "cetirizine", claritin: "loratadine",
  allegra: "fexofenadine", xyzal: "levocetirizine", benadryl: "diphenhydramine", flonase: "fluticasone",
  singulair: "montelukast", ventolin: "albuterol", proair: "albuterol", proventil: "albuterol",
  "ventolin hfa": "albuterol", "proair hfa": "albuterol", flovent: "fluticasone", pulmicort: "budesonide",
  spiriva: "tiotropium", neurontin: "gabapentin", lyrica: "pregabalin", flomax: "tamsulosin",
  proscar: "finasteride", zyloprim: "allopurinol", uloric: "febuxostat", colcrys: "colchicine",
  fosamax: "alendronate", deltasone: "prednisone", medrol: "methylprednisolone", ultram: "tramadol",
  flexeril: "cyclobenzaprine", imdur: "isosorbide mononitrate", nitrostat: "nitroglycerin",
  lanoxin: "digoxin", entresto: "sacubitril / valsartan", kerendia: "finerenone", "k-dur": "potassium chloride",
  "klor-con": "potassium chloride", miralax: "polyethylene glycol", colace: "docusate", senokot: "senna",
  imodium: "loperamide", zofran: "ondansetron", reglan: "metoclopramide", amoxil: "amoxicillin",
  keflex: "cephalexin", zithromax: "azithromycin", cipro: "ciprofloxacin", bactrim: "sulfamethoxazole / trimethoprim",
  augmentin: "amoxicillin / clavulanate", valtrex: "valacyclovir", zoloft: "sertraline", prozac: "fluoxetine",
  lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine", effexor: "venlafaxine",
  "effexor xr": "venlafaxine", pristiq: "desvenlafaxine", cymbalta: "duloxetine", wellbutrin: "bupropion",
  "wellbutrin xl": "bupropion", zyban: "bupropion", remeron: "mirtazapine", desyrel: "trazodone",
  seroquel: "quetiapine", abilify: "aripiprazole", zyprexa: "olanzapine", risperdal: "risperidone",
  geodon: "ziprasidone", latuda: "lurasidone", lithobid: "lithium", lamictal: "lamotrigine",
  depakote: "divalproex", buspar: "buspirone", xanax: "alprazolam", ativan: "lorazepam",
  klonopin: "clonazepam", valium: "diazepam", ambien: "zolpidem", adderall: "amphetamine",
  ritalin: "methylphenidate", concerta: "methylphenidate", vyvanse: "lisdexamfetamine", strattera: "atomoxetine",
  suboxone: "buprenorphine / naloxone", subutex: "buprenorphine", sublocade: "buprenorphine",
  vivitrol: "naltrexone", antabuse: "disulfiram", campral: "acamprosate", chantix: "varenicline",
  narcan: "naloxone", biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide",
  truvada: "emtricitabine / tenofovir disoproxil", descovy: "emtricitabine / tenofovir alafenamide",
  tivicay: "dolutegravir", isentress: "raltegravir", genvoya: "elvitegravir / cobicistat / emtricitabine / tenofovir alafenamide",
  triumeq: "abacavir / dolutegravir / lamivudine", "depo-provera": "medroxyprogesterone",
  nexplanon: "etonogestrel", "plan b": "levonorgestrel", viagra: "sildenafil", cialis: "tadalafil",
  premarin: "conjugated estrogens", estrace: "estradiol",
};

const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "magnesium", "besylate", "maleate", "mesylate",
  "tartrate", "succinate", "fumarate", "citrate", "sulfate", "acetate", "phosphate", "bromide", "chloride",
  "hyclate", "monohydrate", "trihydrate", "dihydrate", "anhydrous", "propionate", "furoate", "dipropionate",
  "xinafoate", "bitartrate", "hemifumarate", "medoxomil", "disoproxil", "axetil", "pivoxil", "camsylate",
  "hydrobromide", "mononitrate", "dinitrate", "valerate", "cypionate", "enanthate", "decanoate", "palmitate",
  "lactate", "gluconate", "carbonate", "oxalate", "napsylate", "erbumine", "lysine", "estolate", "stearate",
  "ethylsuccinate", "olamine", "tromethamine", "benzoate", "salicylate", "nitrate", "pamoate", "aspartate",
]);
// Salt words that are themselves the drug when they are the only word (e.g. "potassium chloride").
const FORM_WORDS = /\b(oral|tablet|tablets|tab|tabs|capsule|capsules|cap|caps|extended|delayed|release|er|xr|xl|sr|cr|dr|ec|odt|chewable|solution|suspension|syrup|injection|injectable|pen|inhaler|hfa|inhalation|aerosol|spray|nasal|topical|cream|ointment|gel|patch|transdermal|film|coated|disintegrating|prefilled|syringe|auto-injector|metered|dose|powder|drops|ophthalmic|otic|liquid|elixir|lozenge|sublingual|rectal|suppository|vaginal|kit|pack)\b.*$/i;

function stripSalts(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return name;
  const kept = words.filter((w, i) => i === 0 || !SALT_WORDS.has(w));
  return kept.join(" ");
}

/** Ingredient(s) of an RxNorm display string ("rosuvastatin calcium 20 MG Oral Tablet"). */
function ingredientsFromDisplay(display: string): { name: string; strength?: string }[] {
  let d = display.trim();
  const bracket = /\[([^\]]+)\]/.exec(d); // branded: "... [Norvasc]"
  d = d.replace(/\[[^\]]*\]/g, "").replace(/^\{|\}.*$/g, "").trim();
  const parts = d.split(/\s+\/\s+/);
  const out: { name: string; strength?: string }[] = [];
  for (const p of parts) {
    const m = /^(.*?)(\s+(\d[\d.,]*\s*[a-zA-Z%]+(\/[a-zA-Z0-9.]+)?))?(\s|$)/.exec(p.trim());
    let name = p.trim();
    let strength: string | undefined;
    const sm = /^([^\d]*?)\s+(\d[\d.,]*\s*(MG|MCG|UNT|UNITS?|ML|G|%|MEQ)(\/(\d[\d.]*\s*)?(ML|ACTUAT|ACTUATION|HR|MG|G))?)/i.exec(p.trim());
    if (sm) {
      name = sm[1];
      strength = sm[2];
    } else if (m) {
      name = m[1] || name;
    }
    name = name.replace(FORM_WORDS, "").trim().toLowerCase();
    name = stripSalts(name);
    if (name) out.push({ name, strength });
  }
  if (!out.length && bracket) {
    const b = BRANDS[bracket[1].toLowerCase()];
    if (b) for (const n of b.split(" / ")) out.push({ name: n });
  }
  return out;
}

/** Ingredient(s) named by the patient's own wording, if recognisable. */
function ingredientsFromName(name: string): string[] | null {
  const n = name.toLowerCase().replace(/®|™/g, "").trim();
  const candidates = [n, n.replace(/\s*\d.*$/, "").trim(), n.replace(FORM_WORDS, "").trim(), n.split(/\s+/)[0]];
  for (const c of candidates) {
    if (!c) continue;
    if (BRANDS[c]) return BRANDS[c].split(" / ");
  }
  if (KNOWN_GENERICS.has(candidates[1]) || KNOWN_GENERICS.has(candidates[3])) {
    const base = KNOWN_GENERICS.has(candidates[1]) ? candidates[1] : candidates[3];
    return [base];
  }
  // Unknown wording: use it as written (generic-looking names), without strength / form / salt.
  let g = n.replace(/\s*\d.*$/, "").replace(FORM_WORDS, "").trim();
  g = stripSalts(g);
  if (!g || !/^[a-z][a-z \-/]*$/.test(g)) return null;
  if (g.includes("/") || / and /.test(g)) return g.split(/\s*\/\s*|\s+and\s+/).filter(Boolean);
  return [g];
}

const KNOWN_GENERICS = new Set<string>(
  Object.values(BRANDS)
    .flatMap((v) => v.split(" / "))
    .concat([
      "lisinopril", "amlodipine", "metformin", "glipizide", "rosuvastatin", "levothyroxine", "dapagliflozin",
      "empagliflozin", "naproxen", "ibuprofen", "aspirin", "acetaminophen", "insulin", "atorvastatin",
    ]),
);

// Sensitive categories by ingredient.
const SENSITIVE: Record<string, Sensitivity> = {};
for (const d of [
  "quetiapine", "sertraline", "fluoxetine", "escitalopram", "citalopram", "paroxetine", "venlafaxine",
  "desvenlafaxine", "duloxetine", "mirtazapine", "lithium", "aripiprazole", "olanzapine", "risperidone",
  "haloperidol", "ziprasidone", "lurasidone", "clozapine", "paliperidone", "cariprazine", "brexpiprazole",
  "buspirone", "vortioxetine", "vilazodone", "fluvoxamine", "phenelzine", "lisdexamfetamine", "atomoxetine",
  "methylphenidate", "amphetamine", "dextroamphetamine", "lumateperone", "chlorpromazine", "perphenazine",
]) SENSITIVE[d] = "mental-health";
for (const d of ["buprenorphine", "naltrexone", "methadone", "disulfiram", "acamprosate", "varenicline"]) SENSITIVE[d] = "substance-use";
for (const d of [
  "emtricitabine", "tenofovir", "tenofovir alafenamide", "tenofovir disoproxil", "bictegravir", "dolutegravir",
  "raltegravir", "elvitegravir", "cobicistat", "efavirenz", "rilpivirine", "darunavir", "atazanavir", "abacavir",
  "lamivudine", "zidovudine", "cabotegravir", "doravirine", "nevirapine", "lenacapavir", "maraviroc",
]) SENSITIVE[d] = "hiv-sti";
for (const d of [
  "ethinyl estradiol", "norethindrone", "levonorgestrel", "drospirenone", "norgestimate", "desogestrel",
  "etonogestrel", "medroxyprogesterone", "ulipristal", "segesterone", "norelgestromin", "clomiphene",
]) SENSITIVE[d] = "sexual-reproductive-health";

type Dose = { value: number; unit: "mg" | "mcg" | "units" | "mL" | "tablet" };
type Strength = { value: number; unit: "mg" | "mcg" | "units" | "mL"; per?: string };

function normUnit(u: string): "mg" | "mcg" | "units" | "mL" | "g" | null {
  const x = u.toLowerCase().replace(/\.$/, "");
  if (["mg", "mgs", "milligram", "milligrams"].includes(x)) return "mg";
  if (["mcg", "µg", "μg", "ug", "microgram", "micrograms"].includes(x)) return "mcg";
  if (["u", "iu", "unit", "units", "unt"].includes(x)) return "units";
  if (["ml", "cc", "milliliter", "milliliters", "millilitre", "millilitres"].includes(x)) return "mL";
  if (["g", "gm", "gram", "grams"].includes(x)) return "g";
  return null;
}

const UNIT_RE = "(mg|mgs|milligrams?|mcg|µg|μg|ug|micrograms?|iu|units?|unt|u|ml|cc|millilit(?:er|re)s?|g|gm|grams?)";

function parseStrength(s: unknown): Strength | null {
  if (typeof s !== "string") return null;
  const m = new RegExp(`(\\d[\\d,]*(?:\\.\\d+)?)\\s*${UNIT_RE}\\b(?:\\s*(?:/|per)\\s*(\\d[\\d.]*)?\\s*([a-zA-Z]+))?`, "i").exec(s);
  if (!m) return null;
  let v = parseFloat(m[1].replace(/,/g, ""));
  let u = normUnit(m[2]);
  if (!u || !isFinite(v)) return null;
  if (u === "g") {
    v = v * 1000;
    u = "mg";
  }
  if (m[4]) {
    // concentration per a quantity other than one unit (e.g. 250 mg/5 mL): not a per-unit strength
    if (m[3] && parseFloat(m[3]) !== 1) return { value: v, unit: u, per: `${m[3]} ${m[4].toLowerCase()}` };
    return { value: v, unit: u, per: m[4].toLowerCase() };
  }
  return { value: v, unit: u };
}

const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5, "½": 0.5, a: 1, an: 1 };
const COUNT_UNIT = "(tablets?|tabs?|pills?|capsules?|caps?|puffs?|sprays?|drops?|patch(?:es)?|inhalations?|actuations?|softgels?|gummies|gummy)";

function cleanDirections(t: string): string {
  return t
    .toLowerCase()
    .replace(/\b\d{1,2}(:\d{2})?\s*(am|pm|a\.m\.|p\.m\.)/g, " ")
    .replace(/\b\d{1,2}:\d{2}\b/g, " ")
    .replace(/every\s+\d+(\s*(-|to|or)\s*\d+)?\s*(hours?|hrs?|h|days?|weeks?|months?)/g, " ")
    .replace(/\b(for|x)\s*\d+\s*(days?|weeks?|months?)/g, " ")
    .replace(/\b(\d+|one|two|three|four|five|six)\s*(times?|x)\b(\s*(a|per|each|every)?\s*(day|daily|week|weekly|month))?/g, " ")
    .replace(/\b(once|twice|thrice)\b/g, " ")
    .replace(/\bq\s*\d+\s*h\b/g, " ");
}

function isAmbiguousAmount(t: string): boolean {
  return (
    /\b(\d+(\.\d+)?|one|two|three|half|½)\s*(or|-|–|—|to)\s*(\d+(\.\d+)?|one|two|three|four)\b/.test(t) ||
    /\b(sliding|scale|depend|depends|depending|varies|vary|based on|per (my )?(sugar|glucose|reading|carb)|carbs?\b|correction)/.test(t)
  );
}

function parseDose(strengthText: unknown, display: string | undefined, directions: unknown): Dose | undefined {
  if (typeof directions !== "string" || !directions.trim()) return undefined;
  const t = cleanDirections(directions);
  if (isAmbiguousAmount(t)) return undefined;
  const strength = parseStrength(strengthText) ?? (display ? parseStrength(display) : null);

  // Explicit amount with a measurement unit in the directions ("10 units at bedtime").
  const am = new RegExp(`(\\d[\\d,]*(?:\\.\\d+)?)\\s*${UNIT_RE}\\b`, "i").exec(t);
  if (am) {
    const v = parseFloat(am[1].replace(/,/g, ""));
    const u = normUnit(am[2]);
    if (u && isFinite(v)) {
      if (u === "g") return { value: round(v * 1000), unit: "mg" };
      if (u === "mL" && strength && strength.per === "ml" && strength.unit !== "mL") {
        return { value: round(strength.value * v), unit: strength.unit };
      }
      return { value: round(v), unit: u };
    }
  }

  // Count of dose units.
  let count: number | null = null;
  const cm = new RegExp(`(\\d+(?:\\.\\d+)?|one|two|three|four|five|six|half|½|an?)\\s*(?:a\\s+)?${COUNT_UNIT}\\b`, "i").exec(t);
  if (cm) count = /\d/.test(cm[1]) ? parseFloat(cm[1]) : WORD_NUM[cm[1]] ?? null;
  if (count === null) {
    const lead = /^\s*(\d+(?:\.\d+)?|one|two|three|four|half|½)\b/.exec(t);
    if (lead) count = /\d/.test(lead[1]) ? parseFloat(lead[1]) : WORD_NUM[lead[1]] ?? null;
  }
  if (count === null) {
    if (/\d/.test(t)) return undefined; // a number we cannot interpret
    count = 1; // a time without a count means one unit
  }
  if (!(count > 0)) return undefined;
  if (strength) {
    if (strength.per && !/^(tab|tablet|cap|capsule|puff|actuat|actuation|spray|dose|inhalation|patch|drop)/.test(strength.per)) {
      return undefined; // concentration without a measured volume
    }
    return { value: round(strength.value * count), unit: strength.unit };
  }
  if (cm && /^(tab|pill|cap|softgel)/i.test(cm[2])) return { value: round(count), unit: "tablet" };
  return undefined;
}

function round(v: number): number {
  return Math.round(v * 1e6) / 1e6;
}

type Freq = NonNullable<MedicationRow["frequency"]>;

function parseFrequency(directions: unknown): Freq | undefined {
  if (typeof directions !== "string") return undefined;
  const t = directions.toLowerCase();
  if (/\b(as needed|when needed|if needed|prn|as required|when i need|if i need|when (it|my|i)\b|if (it|my|i)\b|for (my|the) |only when|sometimes|occasionally|now and then)/.test(t)) return "PRN";
  if (/(taper|every other day|alternate days|every 2 days|four times|4 times|qid|every 6 hours|every 4 hours|monthly|every month|once a month|twice a week|two times a week|2 times a week|three times a week|every 2 weeks|every two weeks|most days|some days)/.test(t)) return "other";
  if (/(once a week|once weekly|weekly|every week|per week|\bqw\b|every (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|on (mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays)|^(mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays)$)/.test(t)) return "QW";
  if (/(three times|3 times|thrice|\btid\b|every 8 hours|with (each|every) meal|with meals)/.test(t)) return "TID";
  if (/(twice|two times|2 times|\bbid\b|every 12 hours)/.test(t)) return "BID";
  if (/(once a day|once daily|every day|daily|\bqd\b|a day\b|per day)/.test(t) && !/(bed|night)/.test(t)) return "QD";
  let slots = 0;
  if (/\b(morning|breakfast|am|wake|waking|get up)\b/.test(t)) slots++;
  if (/\b(noon|lunch|midday|afternoon)\b/.test(t)) slots++;
  const evening = /\b(evening|supper|dinner|pm)\b/.test(t);
  const bed = /\b(bedtime|bed|night|nightly|sleep)\b/.test(t);
  if (evening) slots++;
  if (bed) slots++;
  if (slots === 1 && bed) return "QHS";
  if (slots === 1) return "QD";
  if (slots === 2) return "BID";
  if (slots === 3) return "TID";
  if (slots >= 4) return "other";
  if (/(once a day|once daily|daily|every day)/.test(t)) return "QD";
  return undefined;
}

const HOLD_RE = /\b(paused?|pausing|on hold|holding|hold(ing)? off|stopped for now|not taking (it )?(for now|right now|at the moment|currently|until)|off it (for now|until)|stopped (it )?(until|for now|for a (few|couple|while))|for the time being|temporarily|until (after|my|the|i|surgery|procedure)|break from)/i;

function stopReason(note: string): MedicationRow["stop_reason"] | undefined {
  const t = note.toLowerCase();
  if (/(side effect|rash|hives|itch|swell|allerg|made me|gave me|reaction|cough|dizzy|nause|upset stomach|stomach upset|sick|bleed|cramp)/.test(t)) return "adverse_reaction";
  if (/(didn'?t work|did not work|not working|wasn'?t working|no help|didn'?t help|did not help|ineffective|no effect|not helping)/.test(t)) return "ineffective";
  if (/(switch|changed to|change to|replaced|instead|moved to|swapped|new med)/.test(t)) return "therapy_changed";
  if (/(finished|course (is )?(done|over|complete)|completed|ran out of the course|done with the course)/.test(t)) return "course_complete";
  if (/(i decided|my choice|didn'?t want|don'?t want|chose to|my own|decided to stop|decided not)/.test(t)) return "patient_choice";
  if (/(doctor|dr\.?|told me|because|due to)/.test(t)) return "other";
  return undefined;
}

type MedCandidate = { row: MedicationRow; since: string };

function buildMedications(items: FolioItem[]): MedicationRow[] {
  // HomeLog publishes "My Medicines" as full snapshots: the latest counting snapshot is the list.
  const snaps = items.filter((it) => entries(it).some(([, e]) => e.type === "my_med"));
  if (!snaps.length) return [];
  snaps.sort((a, b) => {
    const ea = localDateTime(a.recorded) ?? "";
    const eb = localDateTime(b.recorded) ?? "";
    const ra = String(a.effective ?? "");
    const rb = String(b.effective ?? "");
    return cmpStr(ra, rb) || cmpStr(ea, eb) || cmpStr(String(a.recorded), String(b.recorded)) || cmpStr(a.id, b.id);
  });
  const snap = snaps[snaps.length - 1];
  const byIngredient = new Map<string, MedCandidate>();
  const order: string[] = [];

  for (const [key, e] of entries(snap)) {
    if (e.type !== "my_med") continue;
    const name = typeof e.name === "string" && e.name.trim() ? e.name.trim() : null;
    const pick = e.picked_from_search && typeof e.picked_from_search === "object" ? e.picked_from_search : null;
    const display = pick && typeof pick.display === "string" ? pick.display : undefined;
    const drugName = name ?? display;
    if (!drugName) continue;

    let fromDisplay = display ? ingredientsFromDisplay(display) : [];
    const fromName = name ? ingredientsFromName(name) : null;
    let ingredients: { name: string; strength?: string }[];
    const nameKnown = fromName && fromName.every((n) => KNOWN_GENERICS.has(n));
    if (nameKnown && fromDisplay.length && fromName!.join("|") !== fromDisplay.map((x) => x.name).join("|")) {
      // The patient's own wording names a recognisable drug different from the search pick; trust the wording.
      ingredients = fromName!.map((n) => ({ name: n }));
      fromDisplay = [];
    } else if (fromDisplay.length) ingredients = fromDisplay;
    else if (fromName) ingredients = fromName.map((n) => ({ name: n }));
    else ingredients = [];

    const rawStatus = typeof e.status === "string" ? e.status : "";
    const note = typeof e.note === "string" && e.note.trim() ? e.note.trim() : undefined;
    let status: MedicationRow["status"];
    if (rawStatus === "taking") status = note && HOLD_RE.test(note) ? "held" : "active";
    else if (rawStatus === "stopped") status = "stopped";
    else status = "unknown";

    let since: string | undefined;
    if (status === "active") since = localPartialDate(e.started) ?? undefined;
    else if (status === "stopped") since = localPartialDate(e.stopped) ?? undefined;

    const directions = e.how_i_take_it;
    const multi = ingredients.length > 1;
    const list = ingredients.length ? ingredients : [{ name: "" }];
    for (const ing of list) {
      const row: MedicationRow = { drug_name: drugName, status, patient_reported: true, evidence: [{ item_id: snap.id, entry_id: key }] };
      if (ing.name) row.ingredient = ing.name;
      if (since) row.status_since = since;
      let dose: Dose | undefined;
      if (multi) {
        dose = ing.strength ? parseDose(ing.strength, undefined, directions) : undefined;
      } else {
        dose = parseDose(e.strength_text, display, directions);
      }
      if (dose) row.dose = dose;
      const freq = parseFrequency(directions);
      if (freq) row.frequency = freq;
      if (status === "stopped" && note) {
        const r = stopReason(note);
        if (r) row.stop_reason = r;
      }
      if ((status === "stopped" || status === "held") && note) row.status_reason_text = note;
      if (e.kind === "over_the_counter") row.otc = true;
      const sens = ing.name ? SENSITIVE[ing.name] ?? SENSITIVE[ing.name.split(" ")[0]] : undefined;
      if (sens) row.sensitivity = [sens];

      const k = ing.name || `name:${drugName.toLowerCase()}`;
      const prev = byIngredient.get(k);
      const cand = { row, since: since ?? "" };
      if (!prev) {
        byIngredient.set(k, cand);
        order.push(k);
      } else if (cand.since > prev.since || (cand.since === prev.since && prev.row.status !== "active" && status === "active")) {
        // Same drug listed twice: keep the entry whose status began latest (ties: the active one).
        byIngredient.set(k, cand);
      }
    }
  }
  return order.map((k) => byIngredient.get(k)!.row);
}

// ---------------------------------------------------------------------------------------------------------
// Vitals (home readings)

type Reading = {
  kind: "bp" | "glu";
  device: boolean;
  time: string;
  minutes: number;
  row: VitalRow;
  key: string;
};

function glucoseMgDl(value: number, unit: unknown): number | null {
  let u = unit;
  // A meter never shows a fractional mg/dL value below 35, nor an mmol/L value above 35.
  if (u === "mg/dL" && value < 35 && value !== Math.round(value)) u = "mmol/L";
  if (u === "mmol/L" && value > 35) u = "mg/dL";
  if (u === "mg/dL") return Math.round(value);
  if (u === "mmol/L") return Math.round(value * 18.016);
  return null;
}

function buildVitals(items: FolioItem[]): VitalRow[] {
  const readings: Reading[] = [];
  for (const it of items) {
    for (const [key, e] of entries(it)) {
      if (e.type === "bp_reading") {
        const time = localDateTime(e.measured_at);
        const sys = num(e.systolic_mmhg);
        const dia = num(e.diastolic_mmhg);
        if (!time || sys === null || dia === null) continue;
        const row: VitalRow = { setting: "home", local_time: time, systolic_mmhg: sys, diastolic_mmhg: dia, evidence: [{ item_id: it.id, entry_id: key }] };
        const p = num(e.pulse_bpm);
        if (p !== null) row.pulse_bpm = p;
        readings.push({ kind: "bp", device: e.entry_method === "cuff_sync", time, minutes: minutesOf(time) ?? 0, row, key: `${it.id}/${key}` });
      } else if (e.type === "glucose_reading") {
        const time = localDateTime(e.measured_at);
        if (!time) continue;
        const row: VitalRow = { setting: "home", local_time: time, evidence: [{ item_id: it.id, entry_id: key }] };
        const oor = e.out_of_range === "HI" || e.out_of_range === "LO" ? (e.out_of_range as "HI" | "LO") : undefined;
        const v = num(e.value);
        const mg = v !== null ? glucoseMgDl(v, e.unit) : null;
        if (mg !== null) row.glucose_mg_dl = mg;
        if (oor) row.glucose_out_of_range = oor;
        if (mg === null && !oor) continue;
        readings.push({ kind: "glu", device: e.entry_method === "meter_sync", time, minutes: minutesOf(time) ?? 0, row, key: `${it.id}/${key}` });
      }
    }
  }

  // A typed reading that repeats a device reading taken within a couple of minutes with the same values is one row.
  const dropped = new Set<Reading>();
  for (const typed of readings) {
    if (typed.device) continue;
    const match = readings.find(
      (d) =>
        d.device &&
        d.kind === typed.kind &&
        !dropped.has(d) &&
        Math.abs(typed.minutes - d.minutes) <= 3 &&
        sameValues(d.row, typed.row),
    );
    if (match) {
      dropped.add(typed);
      for (const ev of typed.row.evidence) match.row.evidence.push(ev);
    }
  }
  return readings
    .filter((r) => !dropped.has(r))
    .sort((a, b) => cmpStr(a.time, b.time) || cmpStr(a.kind, b.kind) || cmpStr(a.key, b.key))
    .map((r) => r.row);
}

function sameValues(a: VitalRow, b: VitalRow): boolean {
  if (a.systolic_mmhg !== b.systolic_mmhg || a.diastolic_mmhg !== b.diastolic_mmhg) return false;
  if (a.pulse_bpm !== undefined && b.pulse_bpm !== undefined && a.pulse_bpm !== b.pulse_bpm) return false;
  if (a.glucose_mg_dl !== b.glucose_mg_dl || a.glucose_out_of_range !== b.glucose_out_of_range) return false;
  return true;
}

// ---------------------------------------------------------------------------------------------------------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return rows;
  let counting: FolioItem[];
  try {
    counting = countingItems(items, asOf);
  } catch {
    return rows;
  }
  try {
    rows.medications = buildMedications(counting);
  } catch {
    rows.medications = [];
  }
  try {
    rows.vitals = buildVitals(counting);
  } catch {
    rows.vitals = [];
  }
  return rows;
}

