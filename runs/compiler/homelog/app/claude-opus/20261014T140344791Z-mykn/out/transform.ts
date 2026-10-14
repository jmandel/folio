import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  VitalRow,
  Evidence,
  Sensitivity,
} from "../in/views/views";

// HomeLog (patient diary app) -> consumer views.
// Sources of rows: My Medicines list snapshots (medications) and day pages (home BP / glucose vitals).
// HomeLog has no problem list, allergy list or lab results; dose logs and diary notes yield no rows.

type Dose = NonNullable<MedicationRow["dose"]>;
type Freq = NonNullable<MedicationRow["frequency"]>;

const MGDL_PER_MMOL = 18.016;

// ───────────────────────────── time helpers ─────────────────────────────

/** Day-of-month of the n-th Sunday of a month (UTC calendar). */
function nthSunday(year: number, month0: number, n: number): number {
  const first = new Date(Date.UTC(year, month0, 1)).getUTCDay();
  return 1 + ((7 - first) % 7) + 7 * (n - 1);
}

/** America/Chicago local date (YYYY-MM-DD) of an instant, using US DST rules (2007+; earlier rules approximated). */
function chicagoDate(ms: number): string {
  const y = new Date(ms).getUTCFullYear();
  let dstStart: number;
  let dstEnd: number;
  if (y >= 2007) {
    dstStart = Date.UTC(y, 2, nthSunday(y, 2, 2), 8);
    dstEnd = Date.UTC(y, 10, nthSunday(y, 10, 1), 7);
  } else {
    // 1987-2006: first Sunday in April to last Sunday in October.
    dstStart = Date.UTC(y, 3, nthSunday(y, 3, 1), 8);
    let lastSun = nthSunday(y, 9, 1);
    while (lastSun + 7 <= 31) lastSun += 7;
    dstEnd = Date.UTC(y, 9, lastSun, 7);
  }
  const offsetH = ms >= dstStart && ms < dstEnd ? -5 : -6;
  return new Date(ms + offsetH * 3600000).toISOString().slice(0, 10);
}

const LOCAL_DT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

/** Normalize a HomeLog wall-clock time to `YYYY-MM-DDTHH:MM`, or undefined if unreadable. */
function localTime(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const m = LOCAL_DT.exec(v.trim());
  if (!m) return undefined;
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
}

/** Minutes since epoch of a wall-clock time (treated as a naive clock; for differences only). */
function wallMinutes(t: string): number {
  const m = LOCAL_DT.exec(t);
  if (!m) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) / 60000;
}

function isPartialDate(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/.test(v);
}

// ───────────────────────────── item selection ─────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope: FolioItem[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const ms = typeof it.recorded === "string" ? Date.parse(it.recorded) : NaN;
    if (isNaN(ms)) continue;
    if (chicagoDate(ms) > asOf) continue;
    inScope.push(it);
  }
  const key = (issuer: unknown, id: unknown) => `${String(issuer)}\u0000${String(id)}`;
  const replaced = new Set<string>();
  for (const it of inScope) {
    for (const list of [it.supersedes, it.retracts]) {
      if (!Array.isArray(list)) continue;
      for (const id of list) if (typeof id === "string") replaced.add(key(it.issuer, id));
    }
  }
  // Every item named by an in-scope item is out; transitivity follows because each link is listed by an in-scope item.
  return inScope.filter((it) => !replaced.has(key(it.issuer, it.id)));
}

function entriesOf(it: FolioItem): [string, any][] {
  const p = it.payload;
  if (!p || typeof p !== "object" || Array.isArray(p)) return [];
  return Object.keys(p)
    .map((k) => [k, (p as Record<string, any>)[k]] as [string, any])
    .filter(([, e]) => e && typeof e === "object" && typeof e.type === "string");
}

function isMedList(it: FolioItem): boolean {
  const es = entriesOf(it);
  if (es.some(([, e]) => e.type === "my_med")) return true;
  if (es.length === 0 && typeof it.narrative === "string" && /^\s*My Medicines\b/i.test(it.narrative)) return true;
  return false;
}

function byRecorded(a: FolioItem, b: FolioItem): number {
  const d = Date.parse(a.recorded) - Date.parse(b.recorded);
  if (d !== 0) return d;
  const e = String(a.effective ?? "").localeCompare(String(b.effective ?? ""));
  if (e !== 0) return e;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

// ───────────────────────────── drug vocabulary ─────────────────────────────

const GENERICS: string[] = [
  // cardiovascular / renal
  "lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril",
  "losartan", "valsartan", "irbesartan", "olmesartan", "telmisartan", "candesartan", "azilsartan", "sacubitril",
  "amlodipine", "nifedipine", "felodipine", "diltiazem", "verapamil", "nicardipine",
  "metoprolol", "atenolol", "carvedilol", "bisoprolol", "propranolol", "nebivolol", "labetalol", "nadolol",
  "hydrochlorothiazide", "chlorthalidone", "indapamide", "furosemide", "torsemide", "bumetanide", "spironolactone", "eplerenone",
  "finerenone", "triamterene", "amiloride", "metolazone", "hydralazine", "clonidine", "minoxidil", "doxazosin", "terazosin", "prazosin",
  "isosorbide mononitrate", "isosorbide dinitrate", "nitroglycerin", "digoxin", "amiodarone", "ranolazine", "ivabradine",
  "atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "ezetimibe", "fenofibrate", "gemfibrozil",
  "icosapent ethyl", "niacin", "evolocumab", "alirocumab",
  "aspirin", "clopidogrel", "prasugrel", "ticagrelor", "warfarin", "apixaban", "rivaroxaban", "dabigatran", "edoxaban",
  "sodium bicarbonate", "potassium chloride", "sevelamer", "calcium acetate", "calcitriol", "patiromer", "sodium zirconium cyclosilicate",
  // diabetes
  "metformin", "glipizide", "glyburide", "glimepiride", "pioglitazone", "sitagliptin", "linagliptin", "saxagliptin", "alogliptin",
  "empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "semaglutide", "liraglutide", "dulaglutide", "exenatide", "tirzepatide",
  "repaglinide", "nateglinide", "acarbose",
  "insulin glargine", "insulin detemir", "insulin degludec", "insulin lispro", "insulin aspart", "insulin glulisine", "insulin isophane",
  "insulin regular", "insulin human",
  // thyroid / endocrine
  "levothyroxine", "liothyronine", "methimazole", "prednisone", "prednisolone", "methylprednisolone", "dexamethasone", "hydrocortisone",
  "alendronate", "risedronate",
  // GI
  "omeprazole", "esomeprazole", "pantoprazole", "lansoprazole", "rabeprazole", "famotidine", "ondansetron", "docusate", "senna",
  "polyethylene glycol", "loperamide", "bisacodyl", "metoclopramide",
  // pain / musculoskeletal
  "acetaminophen", "ibuprofen", "naproxen", "meloxicam", "celecoxib", "diclofenac", "tramadol", "oxycodone", "hydrocodone", "morphine",
  "gabapentin", "pregabalin", "cyclobenzaprine", "allopurinol", "febuxostat", "colchicine",
  // respiratory / allergy
  "albuterol", "fluticasone", "budesonide", "montelukast", "tiotropium", "cetirizine", "loratadine", "fexofenadine", "diphenhydramine",
  "guaifenesin", "dextromethorphan", "pseudoephedrine",
  // urology
  "tamsulosin", "finasteride", "oxybutynin", "sildenafil", "tadalafil",
  // mental health / neuro
  "sertraline", "fluoxetine", "escitalopram", "citalopram", "paroxetine", "venlafaxine", "duloxetine", "bupropion", "mirtazapine",
  "trazodone", "amitriptyline", "nortriptyline", "quetiapine", "aripiprazole", "olanzapine", "risperidone", "lithium", "lamotrigine",
  "buspirone", "lorazepam", "alprazolam", "clonazepam", "diazepam", "zolpidem", "melatonin", "levetiracetam", "topiramate", "donepezil",
  // substance use
  "buprenorphine", "methadone", "naltrexone", "naloxone", "varenicline", "nicotine", "disulfiram", "acamprosate",
  // antiinfective / HIV
  "amoxicillin", "azithromycin", "doxycycline", "cephalexin", "ciprofloxacin", "nitrofurantoin", "sulfamethoxazole", "trimethoprim",
  "emtricitabine", "tenofovir", "bictegravir", "dolutegravir", "valacyclovir", "acyclovir",
  // reproductive
  "estradiol", "norethindrone", "levonorgestrel", "ethinyl estradiol", "medroxyprogesterone", "drospirenone", "progesterone",
  // supplements
  "cholecalciferol", "ergocalciferol", "cyanocobalamin", "folic acid", "ferrous sulfate", "magnesium oxide", "calcium carbonate",
  "fish oil", "omega-3 acid ethyl esters", "multivitamin", "vitamin d", "vitamin b12", "turmeric", "biotin", "zinc",
];

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", accupril: "quinapril",
  cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan", atacand: "candesartan",
  entresto: "sacubitril / valsartan", norvasc: "amlodipine", procardia: "nifedipine", cardizem: "diltiazem", calan: "verapamil",
  toprol: "metoprolol", lopressor: "metoprolol", tenormin: "atenolol", coreg: "carvedilol", bystolic: "nebivolol",
  microzide: "hydrochlorothiazide", hctz: "hydrochlorothiazide", lasix: "furosemide", demadex: "torsemide", bumex: "bumetanide",
  aldactone: "spironolactone", inspra: "eplerenone", kerendia: "finerenone", catapres: "clonidine", cardura: "doxazosin",
  imdur: "isosorbide mononitrate", lanoxin: "digoxin", ranexa: "ranolazine",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin", livalo: "pitavastatin",
  zetia: "ezetimibe", tricor: "fenofibrate", lopid: "gemfibrozil", vascepa: "icosapent ethyl", repatha: "evolocumab", praluent: "alirocumab",
  plavix: "clopidogrel", effient: "prasugrel", brilinta: "ticagrelor", coumadin: "warfarin", jantoven: "warfarin", eliquis: "apixaban",
  xarelto: "rivaroxaban", pradaxa: "dabigatran", savaysa: "edoxaban", ecotrin: "aspirin", bayer: "aspirin",
  renvela: "sevelamer", renagel: "sevelamer", veltassa: "patiromer", lokelma: "sodium zirconium cyclosilicate", "k-dur": "potassium chloride",
  "klor-con": "potassium chloride",
  glucophage: "metformin", glumetza: "metformin", fortamet: "metformin", riomet: "metformin", glucotrol: "glipizide",
  diabeta: "glyburide", glynase: "glyburide", amaryl: "glimepiride", actos: "pioglitazone", januvia: "sitagliptin", tradjenta: "linagliptin",
  onglyza: "saxagliptin", nesina: "alogliptin", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  steglatro: "ertugliflozin", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", victoza: "liraglutide",
  saxenda: "liraglutide", trulicity: "dulaglutide", byetta: "exenatide", bydureon: "exenatide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  janumet: "metformin / sitagliptin", synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin",
  jentadueto: "linagliptin / metformin", glyxambi: "empagliflozin / linagliptin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine", rezvoglar: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro", lyumjev: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", euthyrox: "levothyroxine", tirosint: "levothyroxine",
  cytomel: "liothyronine", tapazole: "methimazole", fosamax: "alendronate", deltasone: "prednisone", medrol: "methylprednisolone",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", prevacid: "lansoprazole", aciphex: "rabeprazole",
  pepcid: "famotidine", zofran: "ondansetron", colace: "docusate", senokot: "senna", miralax: "polyethylene glycol", imodium: "loperamide",
  dulcolax: "bisacodyl", reglan: "metoclopramide",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", naprosyn: "naproxen", anaprox: "naproxen",
  mobic: "meloxicam", celebrex: "celecoxib", voltaren: "diclofenac", ultram: "tramadol", neurontin: "gabapentin", lyrica: "pregabalin",
  flexeril: "cyclobenzaprine", zyloprim: "allopurinol", uloric: "febuxostat", colcrys: "colchicine", mitigare: "colchicine",
  proair: "albuterol", ventolin: "albuterol", proventil: "albuterol", flonase: "fluticasone", flovent: "fluticasone", pulmicort: "budesonide",
  singulair: "montelukast", spiriva: "tiotropium", zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine", benadryl: "diphenhydramine",
  mucinex: "guaifenesin", sudafed: "pseudoephedrine",
  flomax: "tamsulosin", proscar: "finasteride", propecia: "finasteride", ditropan: "oxybutynin", viagra: "sildenafil", cialis: "tadalafil",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine", effexor: "venlafaxine",
  cymbalta: "duloxetine", wellbutrin: "bupropion", zyban: "bupropion", remeron: "mirtazapine", desyrel: "trazodone", elavil: "amitriptyline",
  seroquel: "quetiapine", abilify: "aripiprazole", zyprexa: "olanzapine", risperdal: "risperidone", lamictal: "lamotrigine", buspar: "buspirone",
  ativan: "lorazepam", xanax: "alprazolam", klonopin: "clonazepam", valium: "diazepam", ambien: "zolpidem", keppra: "levetiracetam",
  topamax: "topiramate", aricept: "donepezil",
  suboxone: "buprenorphine / naloxone", subutex: "buprenorphine", sublocade: "buprenorphine", vivitrol: "naltrexone", narcan: "naloxone",
  chantix: "varenicline", antabuse: "disulfiram", nicorette: "nicotine", nicoderm: "nicotine",
  truvada: "emtricitabine / tenofovir", descovy: "emtricitabine / tenofovir", biktarvy: "bictegravir / emtricitabine / tenofovir",
  tivicay: "dolutegravir", valtrex: "valacyclovir", zovirax: "acyclovir", bactrim: "sulfamethoxazole / trimethoprim",
  keflex: "cephalexin", zithromax: "azithromycin", cipro: "ciprofloxacin", macrobid: "nitrofurantoin",
  "depo-provera": "medroxyprogesterone", yaz: "drospirenone / ethinyl estradiol", yasmin: "drospirenone / ethinyl estradiol",
  "plan b": "levonorgestrel", mirena: "levonorgestrel",
  lovaza: "omega-3 acid ethyl esters",
};

/** Lower-case phrase aliases (beyond brand names) that name an ingredient. */
const ALIASES: Record<string, string> = {
  "baby aspirin": "aspirin", asa: "aspirin", paracetamol: "acetaminophen", "vitamin d3": "cholecalciferol", "vitamin d2": "ergocalciferol",
  "b12": "cyanocobalamin", "vitamin b12": "cyanocobalamin", "folate": "folic acid", "iron": "ferrous sulfate", "nph": "insulin isophane",
  "glargine": "insulin glargine", "lispro": "insulin lispro", "aspart": "insulin aspart", "degludec": "insulin degludec", "detemir": "insulin detemir",
  "metoprolol succinate": "metoprolol", "metoprolol tartrate": "metoprolol", "omega 3": "fish oil", "omega-3": "fish oil",
};

const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "magnesium", "besylate", "maleate", "succinate", "tartrate", "mesylate",
  "fumarate", "citrate", "sulfate", "acetate", "propionate", "furoate", "bromide", "phosphate", "dihydrate", "monohydrate", "hyclate",
  "hydrobromide", "bitartrate", "medoxomil", "cilexetil", "disoproxil", "alafenamide", "dipropionate", "xinafoate", "trihydrate",
  "anhydrous", "monosodium", "disodium", "er", "xr", "sr", "xl", "cr", "dr", "la",
]);

const GENERIC_SET = new Set(GENERICS);
const INJECTABLE = /^(insulin|semaglutide|liraglutide|dulaglutide|exenatide|tirzepatide|evolocumab|alirocumab|medroxyprogesterone)/;

function words(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9\-\s]/g, " ").split(/\s+/).filter((w) => w.length > 0);
}

/** Look up ingredient(s) named in free text (a patient-typed name). */
function ingredientFromName(name: string): string | undefined {
  const ws = words(name);
  const found: string[] = [];
  let i = 0;
  while (i < ws.length) {
    let matched = false;
    for (let n = Math.min(4, ws.length - i); n >= 1; n--) {
      const phrase = ws.slice(i, i + n).join(" ");
      const hit = ALIASES[phrase] ?? BRANDS[phrase] ?? (GENERIC_SET.has(phrase) ? phrase : undefined);
      if (hit) {
        for (const h of hit.split(" / ")) if (!found.includes(h)) found.push(h);
        i += n;
        matched = true;
        break;
      }
    }
    if (!matched) i++;
  }
  if (found.length === 0) return undefined;
  // Drop a bare ingredient that is a prefix-part of a longer one found (e.g. "insulin human" vs "insulin glargine" ignored here).
  return found.sort().join(" / ");
}

/** Ingredient name from one component of an RxNorm display ("metformin hydrochloride 1000 MG"). */
function cleanDisplayComponent(c: string): string | undefined {
  let s = c.toLowerCase().replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ");
  s = s.replace(/^\s*\d+\s*hr\s+/, "");
  const ws = s.split(/\s+/).filter((w) => w.length > 0);
  const name: string[] = [];
  for (const w of ws) {
    if (/^[\d.]/.test(w)) break;
    name.push(w.replace(/,$/, ""));
  }
  while (name.length > 1 && SALT_WORDS.has(name[name.length - 1])) name.pop();
  // "insulin isophane, human" style leftovers
  const out = name.join(" ").replace(/,/g, "").trim();
  if (!out) return undefined;
  // Only accept if the remaining words look like a drug name (no dose-form words).
  if (/\b(oral|tablet|capsule|injection|solution|pen|injector|inhaler|suspension|cream|patch)\b/.test(out)) {
    const cut = out.split(/\s+(oral|tablet|capsule|injection|solution|pen|injector|inhaler|suspension|cream|patch)\b/)[0].trim();
    return cut || undefined;
  }
  return out;
}

function ingredientFromDisplay(display: string): string | undefined {
  const bracket = /\[([^\]]+)\]/.exec(display);
  const comps = display.replace(/\[[^\]]*\]/g, " ").split(/\s\/\s/);
  const ings: string[] = [];
  for (const c of comps) {
    const ing = cleanDisplayComponent(c);
    if (ing) {
      const mapped = BRANDS[ing] ?? ALIASES[ing] ?? ing;
      for (const m of mapped.split(" / ")) if (!ings.includes(m)) ings.push(m);
    }
  }
  if (ings.length === 0 && bracket) return ingredientFromName(bracket[1]);
  if (ings.length === 0) return undefined;
  return ings.sort().join(" / ");
}

// ───────────────────────────── strength / dose / frequency ─────────────────────────────

type Mass = { value: number; unit: "mg" | "mcg" };

function toMg(m: Mass): number {
  return m.unit === "mg" ? m.value : m.value / 1000;
}

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

/** Single per-unit mass strength from patient free text ("500 mg", "1,000mg"). */
function massFromStrengthText(s: string): Mass | undefined {
  const t = s.toLowerCase().replace(/(\d),(\d{3})/g, "$1$2");
  if (/\//.test(t) || /\b(units?|iu|ml|puffs?|%)\b/.test(t)) return undefined;
  const re = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|micrograms?|milligrams?|grams?|gm|g)\b/g;
  const ms = [...t.matchAll(re)];
  if (ms.length !== 1) return undefined;
  const v = parseFloat(ms[0][1]);
  if (!isFinite(v) || v <= 0) return undefined;
  const u = ms[0][2];
  if (u === "mg" || u.startsWith("milligram")) return { value: v, unit: "mg" };
  if (u === "mcg" || u === "µg" || u === "ug" || u.startsWith("microgram")) return { value: v, unit: "mcg" };
  return { value: round6(v * 1000), unit: "mg" };
}

/** Single per-unit mass strength from an RxNorm product display ("lisinopril 20 MG Oral Tablet"). */
function massFromDisplay(d: string): Mass | undefined {
  const ms = [...d.matchAll(/(\d+(?:\.\d+)?)\s*(MG|MCG)\b(?!\s*\/)/gi)];
  if (ms.length !== 1 || /\s\/\s/.test(d)) return undefined;
  if (/\/\s*(ML|ACTUAT|HR)\b/i.test(d)) return undefined;
  const v = parseFloat(ms[0][1]);
  if (!isFinite(v) || v <= 0) return undefined;
  return { value: v, unit: ms[0][2].toLowerCase() === "mcg" ? "mcg" : "mg" };
}

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
}

/** Per-tablet strength: patient's text, unless it is off from the picked product by exactly a unit mix-up (x1000). */
function tabletStrength(textMass: Mass | undefined, pickMass: Mass | undefined): Mass | undefined {
  if (textMass && pickMass) {
    const a = toMg(textMass);
    const b = toMg(pickMass);
    if (nearlyEqual(a, b)) return pickMass;
    if (nearlyEqual(a, b * 1000) || nearlyEqual(a * 1000, b)) return pickMass;
    return textMass;
  }
  return textMass ?? pickMass;
}

function massDose(mg: number): Dose {
  const v = round6(mg);
  // Sub-milligram strengths written with 3 decimals (0.075, 0.125) are conventionally micrograms.
  if (v < 1 && Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-6 && /\.\d{3}$/.test(String(v))) {
    return { value: Math.round(v * 1000), unit: "mcg" };
  }
  return { value: v, unit: "mg" };
}

const NUMWORD: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, half: 0.5, "a half": 0.5, "1/2": 0.5, "½": 0.5 };

function parseNum(s: string): number {
  const k = s.trim().toLowerCase();
  if (k in NUMWORD) return NUMWORD[k];
  return parseFloat(k);
}

type Amount = { n: number; kind: "tablet" | "units" | "mL" | "mass" | "puff" | "bare"; mass?: Mass };

/** Amounts per administration named in the patient's direction text, or "ambiguous". */
function amountsFromDirection(text: string): Amount[] | "ambiguous" {
  let t = " " + text.toLowerCase().replace(/(\d),(\d{3})/g, "$1$2") + " ";
  if (/sliding|scale|depend|varies|vary|depending|as directed|per (my )?(doctor|chart)/.test(t)) return "ambiguous";
  if (/\b(\d+(\.\d+)?|one|two|three|four|five)\s*(or|-|–|to)\s*(\d+(\.\d+)?|one|two|three|four|five|six)\b/.test(t)) return "ambiguous";
  if (/\bup to\b/.test(t)) return "ambiguous";
  // remove clock times and frequency / duration numerals
  t = t.replace(/\b\d{1,2}(:\d{2})?\s*(am|pm|a\.m\.|p\.m\.|o'?clock)\b/g, " ");
  t = t.replace(/\b\d{1,2}:\d{2}\b/g, " ");
  t = t.replace(/\b(at|by|around)\s+\d{1,2}\b(?!\s*(units?|u|iu|tabs?|tablets?|pills?|caps?|capsules?|ml|mg|mcg|puffs?)\b)/g, " ");
  t = t.replace(/\b\d+\s*(x|times)\b/g, " ").replace(/\bx\s*\d+\b/g, " ");
  t = t.replace(/\bevery\s+\d+\s*\w+/g, " ");
  t = t.replace(/\b\d+(\.\d+)?\s*(hours?|hrs?|days?|weeks?|wks?|months?|minutes?|mins?|years?)\b/g, " ");
  const out: Amount[] = [];
  const NUM = String.raw`(\d+(?:\.\d+)?|1\/2|½|one|two|three|four|five|a half|half)`;
  const take = (re: RegExp, kind: Amount["kind"]) => {
    t = t.replace(re, (_m, n: string, u?: string) => {
      const v = parseNum(n);
      if (isFinite(v) && v > 0) {
        if (kind === "mass") {
          const unit = (u ?? "").toLowerCase();
          const mass: Mass = unit === "mg" ? { value: v, unit: "mg" } : unit === "g" ? { value: v * 1000, unit: "mg" } : { value: v, unit: "mcg" };
          out.push({ n: v, kind, mass });
        } else out.push({ n: v, kind });
      }
      return " ";
    });
  };
  take(new RegExp(String.raw`\b${NUM}\s*(?:units?|u|iu)\b`, "g"), "units");
  take(new RegExp(String.raw`\b${NUM}\s*(mg|mcg|µg|ug|g)\b`, "g"), "mass");
  take(new RegExp(String.raw`\b${NUM}\s*(?:ml|cc)\b`, "g"), "mL");
  take(new RegExp(String.raw`\b${NUM}\s*(?:puffs?|sprays?|drops?)\b`, "g"), "puff");
  take(new RegExp(String.raw`(?:\b|^)${NUM}\s*(?:of\s+)?(?:an?\s+)?(?:tablets?|tabs?|pills?|capsules?|caps?)\b`, "g"), "tablet");
  t = t.replace(/\b(an?)\s+(tablets?|tabs?|pills?|capsules?|caps?)\b/g, () => {
    out.push({ n: 1, kind: "tablet" });
    return " ";
  });
  take(new RegExp(String.raw`(?:^|\s)(\d+(?:\.\d+)?|1\/2|½)(?=\s|$|[,.;])`, "g"), "bare");
  take(/\b(one|two|three|four|half)\b(?!\s+(time|times|a day|day|week))/g, "bare");
  return out;
}

function parseDose(
  how: string | undefined,
  strengthText: string | undefined,
  pickDisplay: string | undefined,
  ingredient: string | undefined,
  name: string,
): Dose | undefined {
  if (typeof how !== "string" || !how.trim()) return undefined;
  const st = (strengthText ?? "").toLowerCase();
  const pd = (pickDisplay ?? "").toLowerCase();
  const isInsulinLike = /\binsulin\b/.test(`${ingredient ?? ""} ${name.toLowerCase()} ${pd}`) || /\bunits?\b/.test(st) || /\bunt\b/.test(pd);
  const nonTablet =
    isInsulinLike ||
    (ingredient !== undefined && INJECTABLE.test(ingredient) && !/\b(tablet|capsule)\b/.test(pd) && !/rybelsus/i.test(name)) ||
    /\b(inhal|inject|pen|solution|suspension|cream|ointment|gel|patch|spray|drops?|syrup|liquid|powder|lotion|puffs?|ml|actuat)/.test(`${st} ${pd} ${name.toLowerCase()}`);
  const amounts = amountsFromDirection(how);
  if (amounts === "ambiguous") return undefined;
  const textMass = strengthText ? massFromStrengthText(strengthText) : undefined;
  const pickMass = pickDisplay && /\b(tablet|capsule)\b/i.test(pickDisplay) ? massFromDisplay(pickDisplay) : undefined;
  const strength = nonTablet ? undefined : tabletStrength(textMass, pickMass);

  const doses: Dose[] = [];
  for (const a of amounts) {
    if (a.kind === "units") doses.push({ value: a.n, unit: "units" });
    else if (a.kind === "mL") doses.push({ value: a.n, unit: "mL" });
    else if (a.kind === "mass" && a.mass) doses.push(a.mass.unit === "mcg" ? { value: a.mass.value, unit: "mcg" } : massDose(a.mass.value));
    else if (a.kind === "puff") return undefined;
    else if (a.kind === "tablet" || a.kind === "bare") {
      if (a.kind === "bare" && isInsulinLike) doses.push({ value: a.n, unit: "units" });
      else if (nonTablet) return undefined;
      else if (strength) doses.push(strength.unit === "mcg" ? { value: round6(a.n * strength.value), unit: "mcg" } : massDose(a.n * strength.value));
      else doses.push({ value: a.n, unit: "tablet" });
    }
  }
  if (doses.length === 0) {
    if (nonTablet) return undefined;
    // A direction that names no count means one tablet or capsule.
    if (strength) return strength.unit === "mcg" ? { value: strength.value, unit: "mcg" } : massDose(strength.value);
    return { value: 1, unit: "tablet" };
  }
  const first = doses[0];
  if (doses.some((d) => d.unit !== first.unit || !nearlyEqual(d.value, first.value))) return undefined;
  return first;
}

function parseFrequency(how: string | undefined): Freq | undefined {
  if (typeof how !== "string" || !how.trim()) return undefined;
  const t = " " + how.toLowerCase() + " ";
  if (/\b(as needed|when needed|if needed|prn|as necessary|when necessary|when i need|if i need|when i have|if i have|when it hurts)\b/.test(t)) return "PRN";
  if (/\b(twice|two times|2 times|2x|three times|3 times|\d+ times|\d+x)\s+(a|per|each|every)\s+week\b/.test(t)) return "other";
  if (/\b(once a week|once weekly|weekly|every week|per week|a week|each week|every (mon|tues|wednes|thurs|fri|satur|sun)day|on (mon|tues|wednes|thurs|fri|satur|sun)days?)\b/.test(t)) return "QW";
  if (/\b(every other day|most days|some days|every \d+ days|alternate days|every few days|monthly|a month|per month|every month)\b/.test(t)) return "other";
  if (/\b(four times|4 times|4x|qid|every 4 hours|every 6 hours|every 4 hrs|every 6 hrs)\b/.test(t)) return "other";
  if (/\b(three times|3 times|3x|tid|thrice|every 8 hours|every 8 hrs|with (each|every|all) meals?|with meals)\b/.test(t)) return "TID";
  if (/\b(twice|two times|2 times|2x|bid|every 12 hours|every 12 hrs)\b/.test(t)) return "BID";
  let slots = 0;
  const morning = /\b(morning|mornings|breakfast|am|a\.m\.|wake|waking|wake up|get up|before work)\b/.test(t);
  const midday = /\b(noon|lunch|midday|afternoon)\b/.test(t);
  const evening = /\b(supper|dinner|evening|evenings|pm|p\.m\.)\b/.test(t);
  const bed = /\b(bedtime|bed|night|nights|nighttime|sleep|hs)\b/.test(t);
  slots = [morning, midday, evening, bed].filter(Boolean).length;
  if (slots === 1) return bed ? "QHS" : "QD";
  if (slots === 2) return "BID";
  if (slots === 3) return "TID";
  if (slots >= 4) return "other";
  if (/\b(once a day|once daily|daily|every day|a day|per day|each day|once|1x|qd|everyday)\b/.test(t)) return "QD";
  return undefined;
}

// ───────────────────────────── status / reason ─────────────────────────────

const HOLD_ON_TAKING =
  /\b(paus(e|ed|ing)|on hold|hold(ing)? (it|off|this|them)|told (me )?to (stop|hold|pause)|said to (stop|hold|pause)|asked me to (stop|hold|pause)|stop(ped|ping)?( it| taking( it)?)? (for now|for a (while|few|couple|bit|week)|until|temporar)|off (it )?for now|not taking (it )?(right now|for now|at the moment|now)|taking a break|stopped (it|taking)|on a break)/i;
const HOLD_ON_STOPPED =
  /\b(paus(e|ed|ing)|on hold|hold|holding|for now|for a (while|few|couple|bit|week)|until|temporar(y|ily)|resume|restart|start (it )?again|taking a break|on a break|break from|before (my |the )?(surgery|procedure|operation|colonoscopy|scan|test))/i;

function stopReason(note: string | undefined): MedicationRow["stop_reason"] {
  if (!note) return undefined;
  const t = note.toLowerCase();
  if (/(switch|switched|changed (me )?(to|over)|replaced|instead|moved (me )?to|in place of|new (med|medicine|pill) for)/.test(t)) return "therapy_changed";
  if (/(side effect|made me|gave me|caused|reaction|allerg|rash|hives|swell|cough|dizz|nause|upset stomach|stomach|diarrh|cramp|muscle (pain|ache)|itch|sick|bleed|yeast|infection|kidney|low sugar|lows|hypo|ache)/.test(t)) return "adverse_reaction";
  if (/(didn'?t work|did not work|not working|wasn'?t working|didn'?t help|did not help|no help|ineffective|not helping|stopped working)/.test(t)) return "ineffective";
  if (/(finished|course (was )?(done|over|complete)|completed|ran out of the course|done with the course|all done)/.test(t)) return "course_complete";
  if (/(i decided|my choice|didn'?t want|don'?t want|didn'?t like|chose to|i chose|too expensive|cost|couldn'?t afford|can'?t afford)/.test(t)) return "patient_choice";
  return undefined;
}

// ───────────────────────────── sensitivity ─────────────────────────────

const MENTAL = new Set([
  "sertraline", "fluoxetine", "escitalopram", "citalopram", "paroxetine", "venlafaxine", "duloxetine", "bupropion", "mirtazapine",
  "trazodone", "amitriptyline", "nortriptyline", "quetiapine", "aripiprazole", "olanzapine", "risperidone", "lithium", "buspirone",
  "lorazepam", "alprazolam", "clonazepam", "diazepam",
]);
const SUBSTANCE = new Set(["buprenorphine", "methadone", "naltrexone", "disulfiram", "acamprosate", "varenicline"]);
const HIV = new Set(["emtricitabine", "tenofovir", "bictegravir", "dolutegravir"]);
const REPRO = new Set(["norethindrone", "levonorgestrel", "ethinyl estradiol", "medroxyprogesterone", "drospirenone"]);

function medSensitivity(ingredient: string | undefined): Sensitivity[] | undefined {
  if (!ingredient) return undefined;
  const parts = ingredient.split(" / ");
  const s: Sensitivity[] = [];
  if (parts.some((p) => MENTAL.has(p))) s.push("mental-health");
  if (parts.some((p) => SUBSTANCE.has(p))) s.push("substance-use");
  if (parts.some((p) => REPRO.has(p))) s.push("sexual-reproductive-health");
  if (parts.some((p) => HIV.has(p))) s.push("hiv-sti");
  return s.length ? s : undefined;
}

// ───────────────────────────── medications ─────────────────────────────

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

type MedCandidate = { row: MedicationRow; key: string; latestEvent: string; taking: boolean; order: number };

function mapMedications(current: FolioItem[]): MedicationRow[] {
  const lists = current.filter(isMedList).sort(byRecorded);
  if (lists.length === 0) return [];
  const list = lists[lists.length - 1];
  const cands: MedCandidate[] = [];
  let order = 0;
  for (const [entryId, e] of entriesOf(list)) {
    if (e.type !== "my_med") continue;
    try {
      const name = str(e.name);
      const pick = e.picked_from_search && typeof e.picked_from_search === "object" ? e.picked_from_search : undefined;
      const pickDisplay = pick ? str(pick.display) : undefined;
      const pickCode = pick ? str(pick.rxnorm) : undefined;
      const drugName = name ?? pickDisplay;
      if (!drugName) continue;

      let ingredient = pickDisplay ? ingredientFromDisplay(pickDisplay) : undefined;
      if (!ingredient && name) ingredient = ingredientFromName(name);

      let rxnormIngredient: string | undefined;
      if (pickCode && pickDisplay && /^\d+$/.test(pickCode)) {
        const d = pickDisplay.trim().toLowerCase();
        if (!/\d/.test(d) && !/\[/.test(d) && ingredient && d === ingredient && !(d in BRANDS)) rxnormIngredient = pickCode;
      }

      const note = str(e.note);
      const how = str(e.how_i_take_it);
      const started = isPartialDate(e.started) ? e.started : undefined;
      const stoppedDate = isPartialDate(e.stopped) ? e.stopped : undefined;

      let status: MedicationRow["status"];
      let since: string | undefined;
      if (e.status === "taking") {
        if (note && HOLD_ON_TAKING.test(note)) {
          status = "held";
          since = undefined;
        } else {
          status = "active";
          since = started;
        }
      } else if (e.status === "stopped") {
        if (note && HOLD_ON_STOPPED.test(note)) status = "held";
        else status = "stopped";
        since = stoppedDate;
      } else {
        status = "unknown";
      }

      const row: MedicationRow = { drug_name: drugName, status, patient_reported: true, evidence: [{ item_id: list.id, entry_id: entryId }] };
      if (ingredient) row.ingredient = ingredient;
      if (rxnormIngredient) row.rxnorm_ingredient = rxnormIngredient;
      if (since) row.status_since = since;
      const dose = parseDose(how, str(e.strength_text), pickDisplay, ingredient, drugName);
      if (dose) row.dose = dose;
      const freq = parseFrequency(how);
      if (freq) row.frequency = freq;
      if (status === "stopped") {
        const r = stopReason(note);
        if (r) row.stop_reason = r;
      }
      if ((status === "stopped" || status === "held") && note) row.status_reason_text = note;
      if (e.kind === "over_the_counter") row.otc = true;
      const sens = medSensitivity(ingredient);
      if (sens) row.sensitivity = sens;

      const key = ingredient ? `i:${ingredient}` : `n:${drugName.toLowerCase().replace(/\s+/g, " ")}`;
      const latestEvent = [started ?? "", status !== "active" ? stoppedDate ?? "" : ""].sort().pop() ?? "";
      cands.push({ row, key, latestEvent, taking: e.status === "taking", order: order++ });
    } catch {
      continue;
    }
  }
  // One row per ingredient: keep the entry whose own latest event is latest; on ties prefer the one still being taken.
  const best = new Map<string, MedCandidate>();
  for (const c of cands) {
    const prev = best.get(c.key);
    if (!prev) {
      best.set(c.key, c);
      continue;
    }
    const later =
      c.latestEvent > prev.latestEvent && !(prev.latestEvent && c.latestEvent.startsWith(prev.latestEvent))
        ? true
        : prev.latestEvent > c.latestEvent && !(c.latestEvent && prev.latestEvent.startsWith(c.latestEvent))
          ? false
          : c.taking && !prev.taking;
    if (later) best.set(c.key, c);
  }
  return [...best.values()].sort((a, b) => a.order - b.order).map((c) => c.row);
}

// ───────────────────────────── vitals ─────────────────────────────

type Reading = {
  kind: "bp" | "glu";
  time: string;
  device: boolean;
  sys?: number;
  dia?: number;
  pulse?: number;
  glu?: number;
  oor?: "HI" | "LO";
  ev: Evidence;
  order: string;
};

function num(v: unknown): number | undefined {
  return typeof v === "number" && isFinite(v) ? v : undefined;
}

function mapVitals(current: FolioItem[]): VitalRow[] {
  const readings: Reading[] = [];
  const items = current.filter((it) => !isMedList(it)).sort(byRecorded);
  for (const it of items) {
    for (const [entryId, e] of entriesOf(it)) {
      try {
        if (e.type === "bp_reading") {
          const time = localTime(e.measured_at);
          const sys = num(e.systolic_mmhg);
          const dia = num(e.diastolic_mmhg);
          if (!time || sys === undefined || dia === undefined) continue;
          const r: Reading = { kind: "bp", time, device: e.entry_method === "cuff_sync", sys, dia, ev: [{ item_id: it.id, entry_id: entryId }], order: `${it.id}/${entryId}` };
          const p = num(e.pulse_bpm);
          if (p !== undefined) r.pulse = p;
          readings.push(r);
        } else if (e.type === "glucose_reading") {
          const time = localTime(e.measured_at);
          const v = num(e.value);
          if (!time || v === undefined) continue;
          let mg: number;
          if (e.unit === "mg/dL") mg = Math.round(v);
          else if (e.unit === "mmol/L") mg = Math.round(v * MGDL_PER_MMOL);
          else continue;
          const r: Reading = { kind: "glu", time, device: e.entry_method === "meter_sync", glu: mg, ev: [{ item_id: it.id, entry_id: entryId }], order: `${it.id}/${entryId}` };
          if (e.out_of_range === "HI" || e.out_of_range === "LO") r.oor = e.out_of_range;
          readings.push(r);
        }
      } catch {
        continue;
      }
    }
  }

  const sameValues = (a: Reading, b: Reading) =>
    a.kind === b.kind &&
    (a.kind === "bp"
      ? a.sys === b.sys && a.dia === b.dia && (a.pulse === undefined || b.pulse === undefined || a.pulse === b.pulse)
      : a.glu === b.glu && a.oor === b.oor);

  const kept: Reading[] = [];
  // Device copies first so typed duplicates are dropped in favour of them.
  const ordered = [...readings].sort((a, b) => (a.device === b.device ? 0 : a.device ? -1 : 1));
  for (const r of ordered) {
    const dup = kept.find((k) => {
      if (!sameValues(k, r)) return false;
      if (k.time === r.time && k.device === r.device) return true; // same entry restated on two current pages
      if (k.device && !r.device) return Math.abs(wallMinutes(k.time) - wallMinutes(r.time)) <= 10;
      return false;
    });
    if (dup) {
      if (dup.pulse === undefined && r.pulse !== undefined && dup.device === r.device) dup.pulse = r.pulse;
      continue;
    }
    kept.push(r);
  }
  kept.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : a.order < b.order ? -1 : a.order > b.order ? 1 : 0));

  return kept.map((r) => {
    const row: VitalRow = { setting: "home", local_time: r.time, evidence: r.ev };
    if (r.kind === "bp") {
      row.systolic_mmhg = r.sys;
      row.diastolic_mmhg = r.dia;
      if (r.pulse !== undefined) row.pulse_bpm = r.pulse;
    } else {
      row.glucose_mg_dl = r.glu;
      if (r.oor) row.glucose_out_of_range = r.oor;
    }
    return row;
  });
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return rows;
  let current: FolioItem[] = [];
  try {
    current = currentItems(items, asOf);
  } catch {
    return rows;
  }
  try {
    rows.medications = mapMedications(current);
  } catch {
    rows.medications = [];
  }
  try {
    rows.vitals = mapVitals(current);
  } catch {
    rows.vitals = [];
  }
  return rows;
}
