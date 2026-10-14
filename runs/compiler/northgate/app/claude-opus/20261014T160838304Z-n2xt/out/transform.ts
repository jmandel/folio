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

// Mapper for Northgate Family Medicine (northgate-chart-v1 ChartEvent payloads).

type Entry = { item: FolioItem; key: string; e: any };

const TZ = "America/Chicago";

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

let dtf: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number): { y: string; mo: string; d: string; h: string; mi: string; s: string } | null {
  try {
    if (!dtf) {
      dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      });
    }
    const p: Record<string, string> = {};
    for (const part of dtf.formatToParts(new Date(ms))) p[part.type] = part.value;
    const h = p.hour === "24" ? "00" : p.hour;
    return { y: p.year, mo: p.month, d: p.day, h, mi: p.minute, s: p.second };
  } catch {
    return null;
  }
}

function chicagoOffsetMin(utcMs: number): number {
  const p = chicagoParts(utcMs);
  if (!p) return -360;
  const asUtc = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +p.mi, +p.s);
  return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / 60000);
}

interface LocalTs {
  date: string; // YYYY, YYYY-MM or YYYY-MM-DD
  time?: string; // HH:MM:SS
  hasZone: boolean;
}

const DT_RE = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/i;

function toLocal(s: unknown): LocalTs | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return { date: t, hasZone: false };
  const m = DT_RE.exec(t);
  if (!m) return null;
  if (!m[5]) {
    return { date: m[1], time: `${m[2]}:${m[3]}:${m[4] ?? "00"}`, hasZone: false };
  }
  const ms = Date.parse(t.replace(" ", "T"));
  if (isNaN(ms)) return null;
  const p = chicagoParts(ms);
  if (!p) return null;
  return { date: `${p.y}-${p.mo}-${p.d}`, time: `${p.h}:${p.mi}:${p.s}`, hasZone: true };
}

function localDate(s: unknown): string | undefined {
  return toLocal(s)?.date;
}

/** Sortable key of a timestamp in local wall-clock time. */
function sortKey(s: unknown): string {
  const l = toLocal(s);
  if (!l) return "";
  return `${l.date}T${l.time ?? "00:00:00"}`;
}

function rfc3339Local(s: unknown): string | undefined {
  const l = toLocal(s);
  if (!l) return undefined;
  if (!l.time || l.date.length !== 10) return undefined;
  const [y, mo, d] = l.date.split("-").map(Number);
  const [h, mi, se] = l.time.split(":").map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi, se);
  let off = chicagoOffsetMin(wall);
  off = chicagoOffsetMin(wall - off * 60000);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  const oh = String(Math.floor(a / 60)).padStart(2, "0");
  const om = String(a % 60).padStart(2, "0");
  return `${l.date}T${l.time}${sign}${oh}:${om}`;
}

function fuzzyToOnset(f: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f !== "object" || typeof f.date !== "string") return undefined;
  const prec = f.precision;
  if (prec !== "year" && prec !== "month" && prec !== "day") return undefined;
  const d = localDate(f.date) ?? (/^\d{4}/.test(f.date) ? f.date.slice(0, 10) : undefined);
  if (!d) return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(d);
  if (!m) return undefined;
  if (prec === "year") return { value: m[1], precision: "year" };
  if (prec === "month") {
    if (!m[2]) return { value: m[1], precision: "year" };
    return { value: `${m[1]}-${m[2]}`, precision: "month" };
  }
  if (!m[3]) return m[2] ? { value: `${m[1]}-${m[2]}`, precision: "month" } : { value: m[1], precision: "year" };
  return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
}

// ---------------------------------------------------------------------------
// Item selection (as-of, supersession, retraction)
// ---------------------------------------------------------------------------

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const recordedOk = items.filter((it) => {
    if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
    const d = localDate(it.recorded);
    if (!d) return false;
    return d.length === 10 ? d <= asOf : d <= asOf.slice(0, d.length);
  });
  const removed = new Set<string>();
  for (const it of recordedOk) {
    for (const id of Array.isArray(it.supersedes) ? it.supersedes : []) if (typeof id === "string") removed.add(id);
    for (const id of Array.isArray(it.retracts) ? it.retracts : []) if (typeof id === "string") removed.add(id);
    // Northgate chart corrections void items in the payload as well.
    const pl = it.payload && typeof it.payload === "object" ? it.payload : {};
    for (const k of Object.keys(pl)) {
      const e = pl[k];
      if (e && e.type === "chart_correction" && Array.isArray(e.voided_items)) {
        for (const id of e.voided_items) if (typeof id === "string") removed.add(id);
      }
    }
  }
  return recordedOk.filter((it) => !removed.has(it.id));
}

function entriesOf(items: FolioItem[]): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    const pl = item.payload;
    if (!pl || typeof pl !== "object") continue;
    for (const key of Object.keys(pl)) {
      const e = pl[key];
      if (e && typeof e === "object" && typeof e.type === "string") out.push({ item, key, e });
    }
  }
  return out;
}

function cmpEntry(a: Entry, b: Entry): number {
  const ka = sortKey(a.item.effective);
  const kb = sortKey(b.item.effective);
  if (ka !== kb) return ka < kb ? -1 : 1;
  const ra = sortKey(a.item.recorded);
  const rb = sortKey(b.item.recorded);
  if (ra !== rb) return ra < rb ? -1 : 1;
  if (a.item.id !== b.item.id) return a.item.id < b.item.id ? -1 : 1;
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function ev(en: Entry): { item_id: string; entry_id?: string } {
  return { item_id: en.item.id, entry_id: en.key };
}

function uniqEvidence(list: { item_id: string; entry_id?: string }[]): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const x of list) {
    const k = `${x.item_id}#${x.entry_id ?? ""}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

const str = (x: unknown): string | undefined => (typeof x === "string" && x.trim() ? x.trim() : undefined);

// ---------------------------------------------------------------------------
// Drug vocabulary
// ---------------------------------------------------------------------------

const BRANDS: Record<string, string> = {
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  humalog: "insulin lispro", admelog: "insulin lispro", lyumjev: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart",
  levemir: "insulin detemir", tresiba: "insulin degludec", apidra: "insulin glulisine",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", glucophage: "metformin", glumetza: "metformin",
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", lipitor: "atorvastatin", zocor: "simvastatin",
  crestor: "rosuvastatin", pravachol: "pravastatin", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan",
  avapro: "irbesartan", micardis: "telmisartan", lasix: "furosemide", bumex: "bumetanide", jardiance: "empagliflozin",
  farxiga: "dapagliflozin", invokana: "canagliflozin", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  victoza: "liraglutide", trulicity: "dulaglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide", januvia: "sitagliptin",
  tradjenta: "linagliptin", glucotrol: "glipizide", amaryl: "glimepiride", actos: "pioglitazone", keflex: "cephalexin",
  zithromax: "azithromycin", cipro: "ciprofloxacin", levaquin: "levofloxacin", synthroid: "levothyroxine",
  levoxyl: "levothyroxine", prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", pepcid: "famotidine",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", naprosyn: "naproxen",
  plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", jantoven: "warfarin",
  seroquel: "quetiapine", zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine",
  paxil: "paroxetine", effexor: "venlafaxine", cymbalta: "duloxetine", wellbutrin: "bupropion", abilify: "aripiprazole",
  risperdal: "risperidone", zyprexa: "olanzapine", lamictal: "lamotrigine", toprol: "metoprolol", lopressor: "metoprolol",
  coreg: "carvedilol", tenormin: "atenolol", aldactone: "spironolactone", kerendia: "finerenone", flonase: "fluticasone",
  singulair: "montelukast", zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine", neurontin: "gabapentin",
  lyrica: "pregabalin", microzide: "hydrochlorothiazide", zyloprim: "allopurinol", uloric: "febuxostat", flomax: "tamsulosin",
  deltasone: "prednisone", bactrim: "sulfamethoxazole / trimethoprim", septra: "sulfamethoxazole / trimethoprim",
  augmentin: "amoxicillin / clavulanate", suboxone: "buprenorphine / naloxone", zubsolv: "buprenorphine / naloxone",
  subutex: "buprenorphine", sublocade: "buprenorphine", vivitrol: "naltrexone", narcan: "naloxone",
  entresto: "sacubitril / valsartan", hyzaar: "losartan / hydrochlorothiazide", zestoretic: "lisinopril / hydrochlorothiazide",
  janumet: "sitagliptin / metformin", biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide",
  truvada: "emtricitabine / tenofovir disoproxil", descovy: "emtricitabine / tenofovir alafenamide",
  vicodin: "hydrocodone / acetaminophen", norco: "hydrocodone / acetaminophen", percocet: "oxycodone / acetaminophen",
  ultram: "tramadol", flexeril: "cyclobenzaprine", xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam",
  valium: "diazepam", ambien: "zolpidem", desyrel: "trazodone", remeron: "mirtazapine", buspar: "buspirone",
  adderall: "amphetamine", ritalin: "methylphenidate", concerta: "methylphenidate", chantix: "varenicline",
  lotensin: "benazepril", vasotec: "enalapril", altace: "ramipril", procardia: "nifedipine", cardizem: "diltiazem",
  lanoxin: "digoxin", "k-dur": "potassium chloride", klor: "potassium chloride", "klor-con": "potassium chloride",
  fosamax: "alendronate", premarin: "estrogens, conjugated", depo: "medroxyprogesterone", "depo-provera": "medroxyprogesterone",
  nexplanon: "etonogestrel", mirena: "levonorgestrel", plan: "levonorgestrel", viagra: "sildenafil", cialis: "tadalafil",
  zofran: "ondansetron", reglan: "metoclopramide", imitrex: "sumatriptan", humira: "adalimumab", eucrisa: "crisaborole",
  qvar: "beclomethasone", flovent: "fluticasone", pulmicort: "budesonide", spiriva: "tiotropium", symbicort: "budesonide / formoterol",
  advair: "fluticasone / salmeterol", "breo": "fluticasone furoate / vilanterol", xopenex: "levalbuterol",
};

// Ingredient-level RxNorm codes (TTY IN), used only to confirm that a code the source states is ingredient-level.
const RXNORM_IN: Record<string, string> = {
  "29046": "lisinopril", "6809": "metformin", "17767": "amlodipine", "83367": "atorvastatin", "36567": "simvastatin",
  "274783": "insulin glargine", "52175": "losartan", "5487": "hydrochlorothiazide", "4603": "furosemide", "723": "amoxicillin",
  "10180": "sulfamethoxazole", "10831": "trimethoprim", "2231": "cephalexin", "1191": "aspirin", "5640": "ibuprofen",
  "7258": "naproxen", "161": "acetaminophen", "435": "albuterol", "6918": "metoprolol", "20352": "carvedilol",
  "1545653": "empagliflozin", "1488564": "dapagliflozin", "1991302": "semaglutide", "475968": "liraglutide",
  "36437": "sertraline", "51272": "quetiapine", "1819": "buprenorphine", "2670": "codeine", "7052": "morphine",
  "10582": "levothyroxine", "7646": "omeprazole", "25480": "gabapentin", "9997": "spironolactone", "11289": "warfarin",
  "32968": "clopidogrel", "8640": "prednisone", "4821": "glipizide", "593411": "sitagliptin", "301542": "rosuvastatin",
  "42463": "pravastatin", "2409": "chlorthalidone", "4053": "erythromycin", "18631": "azithromycin", "2551": "ciprofloxacin",
  "3640": "doxycycline", "519": "allopurinol", "77492": "tamsulosin", "88249": "montelukast", "20610": "cetirizine",
  "28889": "loratadine", "4278": "famotidine", "7980": "penicillin g", "7984": "penicillin v", "733": "ampicillin",
  "69749": "valsartan", "1364430": "apixaban", "1114195": "rivaroxaban", "6851": "methotrexate", "8163": "phenytoin",
  "2002": "carbamazepine", "6470": "lithium", "40790": "pantoprazole", "283742": "esomeprazole", "8787": "propranolol",
  "1202": "atenolol", "3443": "diltiazem", "7417": "nifedipine", "3827": "enalapril", "35296": "ramipril", "18867": "benazepril",
  "1886": "bumetanide", "35829": "ranolazine", "1658": "bupropion", "4493": "fluoxetine", "2556": "citalopram",
  "321988": "escitalopram", "32937": "paroxetine", "39786": "venlafaxine", "72625": "duloxetine", "89013": "aripiprazole",
  "35636": "risperidone", "61381": "olanzapine", "7243": "naltrexone", "7242": "naloxone", "6813": "methadone",
  "10689": "tramadol", "5489": "hydrocodone", "7804": "oxycodone", "8183": "pioglitazone", "25789": "glimepiride",
  "1373458": "canagliflozin", "1551291": "dulaglutide", "2601723": "tirzepatide", "1100699": "linagliptin",
  "253182": "insulin regular", "86009": "insulin lispro", "51428": "insulin aspart", "139825": "insulin detemir",
  "1670007": "insulin degludec", "2562811": "finerenone", "8076": "potassium chloride", "41126": "fluticasone",
  "11124": "vancomycin", "3356": "digoxin", "10324": "tetracycline", "82122": "levofloxacin", "7454": "nitrofurantoin",
  "6922": "metronidazole", "2194": "cefuroxime", "20481": "cefdinir", "21212": "clarithromycin", "2582": "clindamycin",
  "6135": "ketorolac", "5521": "hydroxychloroquine", "3008": "cyclobenzaprine", "596": "alprazolam",
  "8638": "prednisolone", "3264": "dexamethasone", "5492": "hydrocortisone",
};

const SALTS = new Set([
  "hydrochloride", "hcl", "dihydrochloride", "hyclate", "sodium", "potassium", "succinate", "tartrate", "besylate", "maleate",
  "mesylate", "sulfate", "citrate", "fumarate", "trihydrate", "monohydrate", "dihydrate", "anhydrous", "acetate", "phosphate",
  "bromide", "magnesium", "calcium", "hemifumarate", "hydrobromide", "disodium", "dipropionate", "propionate", "furoate",
  "xinafoate", "valerate", "monosodium", "medoxomil", "axetil", "bitartrate", "hexahydrate", "pamoate", "lactate",
  "gluconate", "decanoate", "nitrate", "estolate", "stearate", "ethylsuccinate", "er", "xr", "sr", "xl", "cr", "dr", "la",
  "ec", "odt", "hfa", "pen", "flexpen", "kwikpen", "solostar", "inhaler", "chewable",
]);
// Salt words that ARE the ingredient when standing alone or forming the name (e.g. "potassium chloride").
const KEEP_WHOLE = new Set(["potassium chloride", "sodium bicarbonate", "calcium carbonate", "magnesium oxide", "sodium chloride",
  "calcium acetate", "potassium citrate", "ferrous sulfate", "magnesium hydroxide", "polyethylene glycol"]);

const FORM_WORDS = /\b(oral|tablets?|tabs?|capsules?|caps?|injection|injectable|injector|solution|suspension|syrup|elixir|cream|ointment|gel|lotion|patch|transdermal|topical|inhalation|inhaler|powder|aerosol|metered|dose|nasal|spray|ophthalmic|otic|drops?|prefilled|syringe|auto-?injector|pen|vial|extended|delayed|release|film|coated|chewable|disintegrating|sublingual|buccal|rectal|suppository|vaginal|kit|pack|actuation|actuat|mg|mcg|ml|unt|units?|iu|meq|hr|hours?|daily|by|mouth|for|and|of)\b/gi;

function stripBrandBrackets(s: string): { base: string; brand?: string } {
  const m = /\[([^\]]+)\]/.exec(s);
  return { base: s.replace(/\[[^\]]*\]/g, " ").trim(), brand: m ? m[1].trim() : undefined };
}

/** Split a drug name into ingredient names (lower case, generic, no salt/form). */
function ingredientsOf(nameRaw: string): string[] {
  let name = nameRaw.toLowerCase().replace(/\s+/g, " ").trim();
  const { base } = stripBrandBrackets(name);
  name = base;
  // leading package quantity, e.g. "3 ml insulin glargine 100 unt/ml pen injector"
  name = name.replace(/^(\d+(\.\d+)?\s*(ml|actuat|mg|g|hr|day|hour)\s+)+/, "");
  name = name.replace(/\bvitamin d3\b/, "cholecalciferol").replace(/\bvitamin d2\b/, "ergocalciferol").replace(/\bvitamin b12\b/, "cyanocobalamin");
  // brand as first word(s)
  const firstWord = name.split(/[\s,(]/)[0].replace(/[®™]/g, "");
  if (BRANDS[firstWord]) return BRANDS[firstWord].split(" / ");
  const twoWords = name.split(/\s+/).slice(0, 2).join(" ");
  if (BRANDS[twoWords]) return BRANDS[twoWords].split(" / ");
  const parts = name.split(/\s*(?:\/|\+|\band\b|,(?=\s*[a-z]))\s*/).filter((p) => p.trim());
  const out: string[] = [];
  for (let p of parts) {
    // cut at first numeric strength
    p = p.replace(/\(.*?\)/g, " ");
    const cut = p.search(/\d/);
    if (cut >= 0) p = p.slice(0, cut);
    p = p.replace(FORM_WORDS, " ").replace(/[^a-z\s-]/g, " ").replace(/\s+/g, " ").trim();
    if (!p) continue;
    if (KEEP_WHOLE.has(p)) {
      out.push(p);
      continue;
    }
    const words = p.split(" ");
    const kept = words.filter((w) => !SALTS.has(w));
    let ing = (kept.length ? kept : words).join(" ").trim();
    if (BRANDS[ing]) ing = BRANDS[ing];
    if (ing) out.push(...ing.split(" / "));
  }
  // dedupe
  return out.filter((x, i) => out.indexOf(x) === i);
}

/** Whether the name is just the ingredient (no strength, form or brand). */
function isBareIngredientName(name: string, ingredient: string): boolean {
  const n = name.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  return n === ingredient;
}

function rxnormIngredient(code: unknown, name: string, ingredient: string | undefined): string | undefined {
  const c = typeof code === "string" ? code.trim() : typeof code === "number" ? String(code) : "";
  if (!c || !ingredient) return undefined;
  if (RXNORM_IN[c] !== undefined) return RXNORM_IN[c] === ingredient ? c : undefined;
  return isBareIngredientName(name, ingredient) ? c : undefined;
}

// ---------------------------------------------------------------------------
// Sensitivity
// ---------------------------------------------------------------------------

const MH_DRUGS = /\b(quetiapine|olanzapine|risperidone|aripiprazole|ziprasidone|lurasidone|paliperidone|clozapine|haloperidol|cariprazine|brexpiprazole|lumateperone|lithium|sertraline|fluoxetine|escitalopram|citalopram|paroxetine|fluvoxamine|venlafaxine|desvenlafaxine|duloxetine|mirtazapine|vortioxetine|vilazodone|buspirone|chlorpromazine|perphenazine|fluphenazine|nortriptyline|imipramine|clomipramine|phenelzine|tranylcypromine|valproate|divalproex|atomoxetine|methylphenidate|lisdexamfetamine|amphetamine|dextroamphetamine|guanfacine er|esketamine|brexanolone|zuranolone)\b/;
const SU_DRUGS = /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|lofexidine)\b/;
const HIV_DRUGS = /\b(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|elvitegravir|cabotegravir|rilpivirine|efavirenz|etravirine|doravirine|nevirapine|darunavir|atazanavir|lopinavir|ritonavir|cobicistat|abacavir|lamivudine|zidovudine|maraviroc|lenacapavir|fostemsavir|ibalizumab)\b/;
const SRH_DRUGS = /\b(ethinyl estradiol|levonorgestrel|norethindrone|norgestimate|etonogestrel|drospirenone|desogestrel|norgestrel|ulipristal|segesterone|dienogest|medroxyprogesterone|clomiphene|mifepristone|misoprostol|sildenafil|tadalafil|vardenafil|follitropin|menotropins|choriogonadotropin|copper intrauterine)\b/;

function drugSensitivity(ingredients: string[], name: string, restricted: boolean): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  const text = (ingredients.join(" ") + " " + name).toLowerCase();
  if (SU_DRUGS.test(text)) s.add("substance-use");
  if (MH_DRUGS.test(text)) s.add("mental-health");
  if (HIV_DRUGS.test(text)) s.add("hiv-sti");
  if (SRH_DRUGS.test(text)) s.add("sexual-reproductive-health");
  if (restricted && !s.has("substance-use") && !s.has("mental-health")) s.add("mental-health");
  return s.size ? [...s] : undefined;
}

function icdSensitivity(icdRaw: string | undefined, text: string, restricted: boolean): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  const icd = (icdRaw ?? "").toUpperCase().replace(/\s/g, "");
  const t = text.toLowerCase();
  const letter = icd[0];
  const num = parseInt(icd.slice(1, 3), 10);
  if (letter === "F" && !isNaN(num)) {
    if (num >= 10 && num <= 19 && num !== 17) s.add("substance-use");
    else if (num >= 20) s.add("mental-health");
  }
  if (/^(Z71\.4|Z71\.5|Z50\.[23]|T40\.[0-6]X[12]|R78\.[0-5])/.test(icd)) s.add("substance-use");
  if (/^(B20|B97\.35|Z21|O98\.7|R75|Z11\.4|Z20\.6|A5[0-9]|A6[0-4]|Z11\.3|Z20\.2|B97\.7|N34\.1|A74\.89)/.test(icd)) s.add("hiv-sti");
  if (/^(O|Z3[0-9]|Z3A|N9[67]|Z98\.5|N52|F52|Z79\.3|Z64\.0|Z33)/.test(icd)) s.add("sexual-reproductive-health");
  if (/^(Z14|Z15|Z84\.81|Q9[0-9]|E84|D57|D66|D67|G10|E83\.0|E83\.11|G71\.0|Q85\.0|Q87\.4)/.test(icd)) s.add("genetic");
  if (/\b(depress|bipolar|schizo|psychos|psychotic|anxiety|panic disorder|ptsd|post-?traumatic stress|obsessive|ocd\b|adhd|attention[- ]deficit|eating disorder|anorexia nervosa|bulimia|borderline personality|suicid|self-harm|mental)/.test(t)) s.add("mental-health");
  if (/\b(alcohol (use|abuse|dependence)|opioid (use|abuse|dependence)|substance (use|abuse)|cocaine|cannabis (use|abuse|dependence)|methamphetamine|stimulant use|drug (abuse|dependence)|alcoholism|overdose)/.test(t)) s.add("substance-use");
  if (/\b(hiv|chlamydia|gonorr|syphilis|trichomon|genital herpes|herpes genitalis|genital warts|hpv|sexually transmitted)/.test(t)) s.add("hiv-sti");
  if (/\b(pregnan|contracept|infertil|miscarriage|abortion|erectile dysfunction|gestation|prenatal|postpartum)/.test(t)) s.add("sexual-reproductive-health");
  if (/\b(brca|lynch syndrome|genetic|hereditary|cystic fibrosis|sickle cell|huntington|carrier of|factor v leiden|hemochromatosis)/.test(t)) s.add("genetic");
  if (restricted && !s.has("substance-use") && !s.has("mental-health")) s.add("mental-health");
  return s.size ? [...s] : undefined;
}

// ---------------------------------------------------------------------------
// Medications
// ---------------------------------------------------------------------------

type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";

function normUnit(u: unknown): DoseUnit | "g" | "count" | undefined {
  if (typeof u !== "string") return undefined;
  const x = u.trim().toLowerCase().replace(/\.$/, "");
  if (["mg", "milligram", "milligrams", "mgs"].includes(x)) return "mg";
  if (["mcg", "µg", "μg", "ug", "microgram", "micrograms", "mcgs"].includes(x)) return "mcg";
  if (["g", "gm", "gram", "grams"].includes(x)) return "g";
  if (["u", "iu", "unit", "units", "unt", "international units"].includes(x)) return "units";
  if (["ml", "cc", "milliliter", "milliliters", "millilitre", "millilitres"].includes(x)) return "mL";
  if (["tab", "tabs", "tablet", "tablets"].includes(x)) return "tablet";
  if (["cap", "caps", "capsule", "capsules", "puff", "puffs", "actuation", "actuations", "spray", "sprays", "patch", "patches", "inhalation", "inhalations", "each", "ea", "drop", "drops", "suppository", "lozenge", "troche", "packet", "packets"].includes(x)) return "count";
  return undefined;
}

/** Per-unit strength of a single-ingredient product from its name ("lisinopril 10 MG Oral Tablet" → 10 mg). */
function perUnitStrength(name: string): { value: number; unit: "mg" | "mcg" | "units" } | undefined {
  const n = name.toLowerCase();
  const all = [...n.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|g|unt|units?|iu)\b(\s*\/\s*(ml|actuat\w*|puff|spray|hr|h|g|dose))?/g)];
  const perUnit = all.filter((m) => !m[3] || /^(actuat|puff|spray|dose)/.test(m[4] ?? ""));
  if (perUnit.length !== 1) return undefined;
  const v = parseFloat(perUnit[0][1]);
  const u = normUnit(perUnit[0][2]);
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u === "mg" || u === "mcg" || u === "units") return { value: v, unit: u };
  return undefined;
}

const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, half: 0.5, "one-half": 0.5, "1/2": 0.5 };

function round(v: number, d = 4): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function computeDose(
  dose: any,
  sig: string | undefined,
  name: string,
  nIngredients: number,
): { value: number; unit: DoseUnit } | undefined {
  const strength = nIngredients === 1 ? perUnitStrength(name) : undefined;
  const solid = /\b(tablet|tab|capsule|cap)\b/i.test(name);
  // a strength that cannot be expressed in the view's units (e.g. mEq): no tablet fallback
  const otherStrength = /\d\s*(meq|mmol)\b/i.test(name);
  const nonSolid = /\b(injection|injectable|injector|solution|suspension|pen|syringe|vial|inhaler|cream|ointment|gel|patch|spray|unt\/ml|units?\/ml|\/ml)\b/i.test(name) && !solid;
  const countAsTablet = !otherStrength && !nonSolid;
  if (dose && typeof dose === "object" && typeof dose.value === "number" && isFinite(dose.value) && dose.value > 0) {
    const u = normUnit(dose.unit);
    if (u === "g") return nIngredients === 1 ? { value: round(dose.value * 1000), unit: "mg" } : undefined;
    if (u === "mg" || u === "mcg" || u === "units" || u === "mL") return nIngredients === 1 ? { value: dose.value, unit: u } : undefined;
    if (u === "tablet" || u === "count") {
      if (strength) return { value: round(dose.value * strength.value), unit: strength.unit };
      if (countAsTablet && (u === "tablet" || /^(cap|capsule)s?$/i.test(String(dose.unit).trim()))) return { value: dose.value, unit: "tablet" };
      return undefined;
    }
    return undefined;
  }
  if (!sig) return undefined;
  const s = sig.toLowerCase();
  if (/sliding scale|per scale|as directed|\bif\b|depending|based on|titrat|taper/.test(s)) return undefined;
  if (/\d+(\.\d+)?\s*(-|–|to|or)\s*\d+(\.\d+)?\s*(tab|cap|puff|unit|mg|mcg|ml|spray|actuation|inhalation)/.test(s)) return undefined;
  if (/\b(one|two|three|1|2|3)\s*(-|–|to|or)\s*(two|three|four|2|3|4)\b/.test(s)) return undefined;
  // explicit mass/volume/units in sig
  const mm = /(\d+(?:\.\d+)?)\s*(mg|mcg|micrograms?|milligrams?|units?|iu|ml|cc)\b/.exec(s);
  if (mm && !/\/\s*(ml|actuat)/.test(s.slice(mm.index + mm[0].length, mm.index + mm[0].length + 6))) {
    const u = normUnit(mm[2]);
    if (nIngredients === 1 && (u === "mg" || u === "mcg" || u === "units" || u === "mL")) return { value: parseFloat(mm[1]), unit: u };
  }
  const cm = /\b(\d+(?:\.\d+)?|one-half|one|two|three|four|five|half|1\/2)\s*(tablets?|tabs?|capsules?|caps?|puffs?|sprays?|actuations?|inhalations?)\b/.exec(s);
  if (cm) {
    const n = WORD_NUM[cm[1]] ?? parseFloat(cm[1]);
    if (!isFinite(n)) return undefined;
    if (strength) return { value: round(n * strength.value), unit: strength.unit };
    if (countAsTablet && /^(tab|cap)/.test(cm[2])) return { value: n, unit: "tablet" };
    return undefined;
  }
  // no count but a time: one unit
  if (solid && strength && /\b(daily|once|morning|evening|bedtime|night|nightly|every|twice|at)\b/.test(s)) {
    return { value: strength.value, unit: strength.unit };
  }
  return undefined;
}

type Freq = "QD" | "BID" | "TID" | "QHS" | "QW" | "PRN" | "other";

function sigFrequency(sig: string | undefined): Freq | undefined {
  if (!sig) return undefined;
  const s = sig.toLowerCase();
  if (/as needed|\bprn\b|as necessary|if needed/.test(s)) return "PRN";
  if (/taper|every other day|\bqod\b|four times|\bqid\b|every 6 hours|every 4 hours|q[46]h|monthly|every (2|two|3|three|4|four) weeks|five times|every month/.test(s)) return "other";
  if (/once (a |per |every )?week|weekly|every week|\bqw(k)?\b/.test(s)) return "QW";
  if (/three times|\btid\b|every 8 hours|\bq8h\b/.test(s)) return "TID";
  if (/twice|two times|\bbid\b|every 12 hours|\bq12h\b/.test(s)) return "BID";
  if (/bedtime|\bqhs\b|\bhs\b/.test(s)) return "QHS";
  if (/once (a |per )?day|\bdaily\b|every day|\bqd\b|every morning|in the morning|every evening|in the evening|nightly|at night|once$/.test(s)) return "QD";
  return undefined;
}

function mapFrequency(code: unknown, sig: string | undefined): Freq | undefined {
  switch (code) {
    case "QD":
    case "BID":
    case "TID":
    case "QHS":
    case "PRN":
      return code;
    case "OTHER": {
      const f = sigFrequency(sig);
      if (f === "QW" || f === "other") return f;
      return "other";
    }
  }
  return sigFrequency(sig);
}

const STOP_REASONS = new Set(["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"]);

interface MedCandidate {
  row: MedicationRow;
  latestKey: string;
  latestRec: string;
}

function buildMedications(entries: Entry[]): { rows: MedicationRow[]; byItem: Map<string, string[]> } {
  const lines = new Map<string, Entry[]>();
  for (const en of entries) {
    if (en.e.type !== "med_event") continue;
    const id = str(en.e.med_id);
    if (!id) continue;
    if (!["start", "change", "hold", "resume", "stop"].includes(en.e.action)) continue;
    if (!lines.has(id)) lines.set(id, []);
    lines.get(id)!.push(en);
  }
  const byIngredient = new Map<string, MedCandidate>();
  const unnamed: MedicationRow[] = [];
  // ingredients per item (for drug-class allergy resolution)
  const byItem = new Map<string, string[]>();

  for (const [, evs] of lines) {
    try {
      evs.sort(cmpEntry);
      const last = evs[evs.length - 1];
      const e = last.e;
      // drug identity: latest event naming the drug
      let drugName: string | undefined;
      let rx: unknown;
      for (let i = evs.length - 1; i >= 0; i--) {
        const n = str(evs[i].e.drug?.name);
        if (n) {
          drugName = n;
          rx = evs[i].e.drug?.rxnorm;
          break;
        }
      }
      if (!drugName) continue;
      const status: MedicationRow["status"] =
        e.action === "hold" ? "held" : e.action === "stop" ? "stopped" : "active";

      const evidence: { item_id: string; entry_id?: string }[] = [ev(last)];
      let statusSince: string | undefined;
      if (status === "active") {
        for (let i = evs.length - 1; i >= 0; i--) {
          if (evs[i].e.action === "start" || evs[i].e.action === "resume") {
            statusSince = localDate(evs[i].item.effective);
            if (evs[i] !== last) evidence.push(ev(evs[i]));
            break;
          }
          if (evs[i].e.action === "hold" || evs[i].e.action === "stop") break;
        }
      } else {
        statusSince = localDate(last.item.effective);
      }

      // dose / frequency: latest event carrying them (holds and stops keep the amount in force)
      let doseSrc: Entry | undefined;
      for (let i = evs.length - 1; i >= 0; i--) {
        if (evs[i].e.dose || str(evs[i].e.sig)) {
          doseSrc = evs[i];
          break;
        }
      }
      let freqSrc: Entry | undefined;
      for (let i = evs.length - 1; i >= 0; i--) {
        if (evs[i].e.frequency || sigFrequency(str(evs[i].e.sig))) {
          freqSrc = evs[i];
          break;
        }
      }

      const ingredients = ingredientsOf(drugName);
      const restricted = evs.some((x) => x.e.restricted === "BH");
      const sens = drugSensitivity(ingredients, drugName, restricted);
      const nameForDose = str(doseSrc?.e.drug?.name) ?? drugName;
      const dose = doseSrc ? computeDose(doseSrc.e.dose, str(doseSrc.e.sig), nameForDose, Math.max(1, ingredients.length)) : undefined;
      const freq = freqSrc ? mapFrequency(freqSrc.e.frequency, str(freqSrc.e.sig)) : undefined;
      if (doseSrc && doseSrc !== last) evidence.push(ev(doseSrc));

      const base: MedicationRow = {
        drug_name: drugName,
        status,
        patient_reported: false,
        evidence: [],
      };
      if (statusSince) base.status_since = statusSince;
      if (freq) base.frequency = freq;
      if (status === "stopped" && STOP_REASONS.has(e.stop_reason)) base.stop_reason = e.stop_reason;
      const reasonText = str(e.reason_text);
      if (reasonText) base.status_reason_text = reasonText;
      if (sens) base.sensitivity = sens;
      base.evidence = uniqEvidence(evidence);

      const latestKey = sortKey(last.item.effective);
      const latestRec = sortKey(last.item.recorded);

      for (const it of evs) {
        const arr = byItem.get(it.item.id) ?? [];
        for (const ing of ingredients) if (!arr.includes(ing)) arr.push(ing);
        byItem.set(it.item.id, arr);
      }

      if (!ingredients.length) {
        if (dose) base.dose = dose;
        unnamed.push(base);
        continue;
      }
      for (const ing of ingredients) {
        const row: MedicationRow = { ...base, ingredient: ing, evidence: base.evidence.slice() };
        const rxi = ingredients.length === 1 ? rxnormIngredient(rx, drugName, ing) : undefined;
        if (rxi) row.rxnorm_ingredient = rxi;
        if (ingredients.length === 1) {
          if (dose) row.dose = dose;
        } else {
          const comp = componentDose(doseSrc, drugName, ing, ingredients);
          if (comp) row.dose = comp;
        }
        // reorder keys for readability
        const ordered: MedicationRow = {
          ingredient: row.ingredient,
          ...(row.rxnorm_ingredient ? { rxnorm_ingredient: row.rxnorm_ingredient } : {}),
          drug_name: row.drug_name,
          status: row.status,
          ...(row.status_since ? { status_since: row.status_since } : {}),
          ...(row.dose ? { dose: row.dose } : {}),
          ...(row.frequency ? { frequency: row.frequency } : {}),
          ...(row.stop_reason ? { stop_reason: row.stop_reason } : {}),
          ...(row.status_reason_text ? { status_reason_text: row.status_reason_text } : {}),
          patient_reported: false,
          ...(row.sensitivity ? { sensitivity: row.sensitivity } : {}),
          evidence: row.evidence,
        };
        const prev = byIngredient.get(ing);
        if (!prev || prev.latestKey < latestKey || (prev.latestKey === latestKey && prev.latestRec <= latestRec)) {
          byIngredient.set(ing, { row: ordered, latestKey, latestRec });
        }
      }
    } catch {
      // skip unreadable line
    }
  }
  const rows = [...[...byIngredient.values()].map((c) => c.row), ...unnamed];
  rows.sort((a, b) => (a.ingredient ?? a.drug_name).localeCompare(b.ingredient ?? b.drug_name));
  return { rows, byItem };
}

/** Per-ingredient dose of a combination product given as a count of units. */
function componentDose(src: Entry | undefined, name: string, ing: string, ingredients: string[]): { value: number; unit: DoseUnit } | undefined {
  if (!src) return undefined;
  let count: number | undefined;
  const d = src.e.dose;
  if (d && typeof d.value === "number") {
    const u = normUnit(d.unit);
    if (u === "tablet" || u === "count") count = d.value;
  } else {
    const s = (str(src.e.sig) ?? "").toLowerCase();
    if (/\d\s*(-|–|to|or)\s*\d/.test(s)) return undefined;
    const cm = /\b(\d+(?:\.\d+)?|one|two|three|half)\s*(tablets?|tabs?|capsules?|caps?|puffs?|actuations?|inhalations?)\b/.exec(s);
    if (cm) count = WORD_NUM[cm[1]] ?? parseFloat(cm[1]);
  }
  if (count === undefined || !isFinite(count)) return undefined;
  const parts = name.toLowerCase().split(/\s*\/\s*(?![a-z]*\s*(?:ml|actuat))/);
  if (parts.length !== ingredients.length) return undefined;
  const idx = ingredients.indexOf(ing);
  const st = perUnitStrength(parts[idx] ?? "");
  if (!st) return undefined;
  return { value: round(count * st.value), unit: st.unit };
}

// ---------------------------------------------------------------------------
// Problems (and drug-attributed diagnoses)
// ---------------------------------------------------------------------------

function ckdFrom(icd: string | undefined, text: string): { stage?: ProblemRow["ckd_stage"]; alb?: ProblemRow["albuminuria"] } {
  const out: { stage?: ProblemRow["ckd_stage"]; alb?: ProblemRow["albuminuria"] } = {};
  const t = text.toLowerCase();
  const g = /\bg(1|2|3a|3b|4|5)\b/i.exec(text);
  const st = /stage\s*(1|2|3a|3b|4|5|i{1,3}v?|v)\b/i.exec(t);
  if (g) out.stage = ("G" + g[1].toLowerCase()) as ProblemRow["ckd_stage"];
  else if (st) {
    const m: Record<string, ProblemRow["ckd_stage"]> = { "1": "G1", i: "G1", "2": "G2", ii: "G2", "3a": "G3a", "3b": "G3b", "4": "G4", iv: "G4", "5": "G5", v: "G5" };
    if (m[st[1]]) out.stage = m[st[1]];
  }
  if (!out.stage && icd) {
    const c = icd.toUpperCase();
    const m: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
    if (m[c]) out.stage = m[c];
  }
  const a = /\ba([123])\b/i.exec(text);
  if (a) out.alb = ("A" + a[1]) as ProblemRow["albuminuria"];
  return out;
}

function isCkd(icd: string | undefined, text: string): boolean {
  return /^N18/i.test(icd ?? "") || /chronic kidney disease|\bckd\b|chronic renal (failure|insufficiency|disease)/i.test(text);
}

// Drug classes and drugs recognised in diagnosis wording.
const DRUG_CLASSES = /\b(penicillins?|cephalosporins?|sulfonamides?|sulfa drugs?|ace inhibitors?|angiotensin[- ]converting[- ]enzyme inhibitors?|statins?|nsaids?|non-?steroidal anti-?inflammatory drugs?|opioids?|opiates?|macrolides?|fluoroquinolones?|quinolones?|tetracyclines?|aminoglycosides?|beta[- ]blockers?|calcium channel blockers?|antiepileptics?|anticonvulsants?|thiazides?|diuretics?|salicylates?|glucocorticoids?|corticosteroids?|contrast media|iodinated contrast|insulins?|sulfonylureas?|antibiotics?|antipsychotics?|anticoagulants?|sglt2 inhibitors?|glp-1 receptor agonists?|biguanides?|carbapenems?|vaccines?)\b/i;
const KNOWN_DRUG_WORDS = new Set(Object.values(RXNORM_IN).concat(Object.values(BRANDS).flatMap((b) => b.split(" / "))));

const CLASS_MEMBERS: Record<string, RegExp> = {
  penicillin: /^(amoxicillin|ampicillin|penicillin|dicloxacillin|nafcillin|oxacillin|piperacillin)/,
  cephalosporin: /^(cef|ceph)/,
  sulfonamide: /^(sulfamethoxazole|sulfasalazine|sulfadiazine)/,
  sulfa: /^(sulfamethoxazole|sulfasalazine|sulfadiazine)/,
  "ace inhibitor": /pril$/,
  "angiotensin-converting-enzyme inhibitor": /pril$/,
  statin: /statin$/,
  nsaid: /^(ibuprofen|naproxen|diclofenac|meloxicam|celecoxib|ketorolac|indomethacin|etodolac|nabumetone|piroxicam)$/,
  opioid: /^(morphine|codeine|oxycodone|hydrocodone|hydromorphone|tramadol|fentanyl|tapentadol|methadone|oxymorphone)$/,
  macrolide: /^(azithromycin|clarithromycin|erythromycin)$/,
  fluoroquinolone: /floxacin$/,
  quinolone: /floxacin$/,
  tetracycline: /cycline$/,
  "beta blocker": /olol$|^carvedilol$|^labetalol$/,
  "calcium channel blocker": /dipine$|^diltiazem$|^verapamil$/,
  thiazide: /^(hydrochlorothiazide|chlorthalidone|indapamide|metolazone|chlorothiazide)$/,
  sulfonylurea: /^(glipizide|glyburide|glimepiride)$/,
  "sglt2 inhibitor": /gliflozin$/,
  "glp-1 receptor agonist": /(glutide|tirzepatide|exenatide)$/,
  insulin: /^insulin/,
  biguanide: /^metformin$/,
  aminoglycoside: /^(gentamicin|tobramycin|amikacin|neomycin|streptomycin)$/,
  carbapenem: /penem$/,
};

function classKey(cls: string): string {
  let c = cls.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim();
  c = c.replace(/s$/, "");
  if (c === "angiotensin converting enzyme inhibitor") return "ace inhibitor";
  if (c.startsWith("non") && c.includes("steroidal")) return "nsaid";
  if (c === "sulfa drug") return "sulfa";
  if (c === "opiate") return "opioid";
  if (c === "glp 1 receptor agonist") return "glp-1 receptor agonist";
  return c;
}

// ICD-10-CM T36–T50 adverse-effect codes (6th character 5): substance class by code block.
const T_ADVERSE: [RegExp, string][] = [
  [/^T36\.0/, "penicillins"], [/^T36\.1/, "cephalosporins"], [/^T36\.2/, "chloramphenicol"], [/^T36\.3/, "macrolides"],
  [/^T36\.4/, "tetracyclines"], [/^T36\.5/, "aminoglycosides"], [/^T36\.6/, "rifampicins"], [/^T36\.7/, "antifungal antibiotics"],
  [/^T36\.8/, "systemic antibiotics"], [/^T36\.9/, "systemic antibiotic"], [/^T37\.0/, "sulfonamides"],
  [/^T38\.0/, "glucocorticoids"], [/^T38\.3/, "insulin and oral hypoglycemic drugs"], [/^T39\.0/, "salicylates"],
  [/^T39\.1/, "4-aminophenol derivatives"], [/^T39\.3/, "nonsteroidal anti-inflammatory drugs"],
  [/^T40\.2/, "opioids"], [/^T42\.4/, "benzodiazepines"], [/^T42\.6/, "antiepileptic drugs"], [/^T43\.2/, "antidepressants"],
  [/^T43\.5/, "antipsychotics"], [/^T44\.7/, "beta-adrenoreceptor antagonists"], [/^T45\.51/, "anticoagulants"],
  [/^T45\.52/, "antithrombotic drugs"], [/^T46\.0/, "cardiac-stimulant glycosides"], [/^T46\.1/, "calcium-channel blockers"],
  [/^T46\.4/, "angiotensin-converting-enzyme inhibitors"], [/^T46\.6/, "antihyperlipidemic drugs"],
  [/^T50\.1/, "loop diuretics"], [/^T50\.2/, "thiazide diuretics"], [/^T50\.8/, "diagnostic agents"], [/^T50\.9/, "drug"],
  [/^T88\.7/, "drug"],
];

function isAdverseEffectCode(icd: string): boolean {
  const c = icd.toUpperCase().replace(".", "");
  if (/^T(3[6-9]|4\d|50)/.test(c) && c.length >= 6 && c[5] === "5") return true;
  return false;
}

/** If a diagnosis attributes the condition to a drug, the drug (or class) as worded, and whether a condition is named too. */
function drugAttribution(desc: string, icd: string | undefined): { drug: string; isClass: boolean; conditionNamed: boolean } | undefined {
  const d = desc.trim();
  const dl = d.toLowerCase();
  let phrase: string | undefined;
  let conditionNamed = true;
  let m = /^(?:adverse (?:effect|reaction) (?:of|to)|allergy to|allergic reaction to|intolerance (?:of|to)|reaction to)\s+(.+?)(?:,.*)?$/i.exec(d);
  if (m) {
    phrase = m[1];
    conditionNamed = false;
  } else if ((m = /\b(?:due to|caused by|induced by|secondary to|from|associated with)\s+(.+?)(?:\s*\(.*\))?(?:,.*)?$/i.exec(d))) {
    phrase = m[1];
  } else if ((m = /^([a-z][a-z-]+)-induced\s+/i.exec(d))) {
    phrase = m[1];
  }
  const adverseCode = icd ? isAdverseEffectCode(icd) || /^T88\.7/i.test(icd) : false;
  if (phrase) {
    let p = phrase.replace(/\b(therapy|use|treatment|initiation|administration|medication|drug)\b/gi, " ").replace(/\s+/g, " ").trim();
    p = p.replace(/^(the|an?|his|her)\s+/i, "");
    const cls = DRUG_CLASSES.exec(p);
    const ings = ingredientsOf(p);
    const known = ings.length > 0 && ings.every((x) => KNOWN_DRUG_WORDS.has(x));
    if (known) return { drug: p, isClass: false, conditionNamed };
    if (cls && cls[0].length >= p.length - 2) return { drug: p, isClass: true, conditionNamed };
    if (cls) return { drug: cls[0], isClass: true, conditionNamed };
    if (adverseCode) return { drug: p, isClass: !known, conditionNamed };
    return undefined;
  }
  if (icd && adverseCode) {
    // code-only attribution: condition named in the wording unless it is just the adverse-effect description
    const onlyAe = /^(adverse effect|adverse drug|drug reaction|side effect)/i.test(dl);
    const block = T_ADVERSE.find(([re]) => re.test(icd.toUpperCase()));
    const cls = DRUG_CLASSES.exec(d);
    return { drug: cls ? cls[0] : block ? block[1] : "drug", isClass: true, conditionNamed: !onlyAe && !cls };
  }
  return undefined;
}

function buildProblems(entries: Entry[], medsByItem: Map<string, string[]>): { rows: ProblemRow[]; derivedAllergies: AllergyIntoleranceRow[] } {
  const groups = new Map<string, Entry[]>();
  for (const en of entries) {
    if (en.e.type !== "problem_event") continue;
    const id = str(en.e.problem_id);
    if (!id) continue;
    if (!["add", "update", "resolve", "remove"].includes(en.e.action)) continue;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id)!.push(en);
  }
  type Cand = { row: ProblemRow; key: string; rec: string; mergeKey: string };
  const cands: Cand[] = [];
  const derived: AllergyIntoleranceRow[] = [];
  for (const [, evs] of groups) {
    try {
      evs.sort(cmpEntry);
      const last = evs[evs.length - 1];
      if (last.e.action === "remove") continue; // taken off the list
      // latest wording/codes from the latest event that carries a description
      let wordSrc = last;
      for (let i = evs.length - 1; i >= 0; i--) {
        if (str(evs[i].e.description)) {
          wordSrc = evs[i];
          break;
        }
      }
      const condition = str(wordSrc.e.description);
      if (!condition) continue;
      const icd = str(wordSrc.e.icd10cm);
      const snomed = str(wordSrc.e.snomed) ?? (typeof wordSrc.e.snomed === "number" ? String(wordSrc.e.snomed) : undefined);
      if (/\b(rule out|r\/o|ruled out|suspected|possible|probable|provisional|working diagnosis|query)\b/i.test(condition)) continue;
      let onset: ProblemRow["onset"];
      for (let i = evs.length - 1; i >= 0; i--) {
        const o = fuzzyToOnset(evs[i].e.onset);
        if (o) {
          onset = o;
          break;
        }
      }
      const status: ProblemRow["status"] = last.e.action === "resolve" ? "resolved" : "active";
      const restricted = evs.some((x) => x.e.restricted === "BH");
      const evidence = uniqEvidence([ev(last), ev(wordSrc)]);

      const attr = drugAttribution(condition, icd);
      if (attr) {
        const ingsInItem = medsByItem.get(wordSrc.item.id) ?? [];
        derived.push(allergyFromDiagnosis(attr, condition, onset, ingsInItem, evidence));
        if (!attr.conditionNamed) continue;
      }

      const row = { condition } as ProblemRow;
      if (icd) row.icd10cm = icd;
      if (snomed) row.snomed = snomed;
      row.status = status;
      if (onset) row.onset = onset;
      if (isCkd(icd, condition)) {
        // most recent clinician-recorded categories across the problem's events
        let stage: ProblemRow["ckd_stage"];
        let alb: ProblemRow["albuminuria"];
        for (let i = evs.length - 1; i >= 0 && (!stage || !alb); i--) {
          const t = str(evs[i].e.description) ?? "";
          const c = ckdFrom(str(evs[i].e.icd10cm), t);
          if (!stage && c.stage) stage = c.stage;
          if (!alb && c.alb) alb = c.alb;
        }
        if (stage) row.ckd_stage = stage;
        if (alb) row.albuminuria = alb;
      }
      const sens = icdSensitivity(icd, condition, restricted);
      if (sens) row.sensitivity = sens;
      row.evidence = evidence;
      const mergeKey = icd ? (/^N18/i.test(icd) ? "N18" : icd.toUpperCase()) : "desc:" + condition.toLowerCase();
      cands.push({ row: row as ProblemRow, key: sortKey(last.item.effective), rec: sortKey(last.item.recorded), mergeKey });
    } catch {
      // skip
    }
  }
  const merged = new Map<string, Cand>();
  for (const c of cands) {
    const p = merged.get(c.mergeKey);
    if (!p) {
      merged.set(c.mergeKey, c);
      continue;
    }
    const newer = p.key < c.key || (p.key === c.key && p.rec <= c.rec) ? c : p;
    const older = newer === c ? p : c;
    newer.row.evidence = uniqEvidence([...newer.row.evidence, ...older.row.evidence]);
    if (!newer.row.onset && older.row.onset) newer.row.onset = older.row.onset;
    merged.set(c.mergeKey, newer);
  }
  const rows = [...merged.values()].map((c) => c.row);
  rows.sort((a, b) => a.condition.localeCompare(b.condition));
  return { rows, derivedAllergies: derived };
}

// ---------------------------------------------------------------------------
// Allergies
// ---------------------------------------------------------------------------

const HYPERSENS = /\b(hives|urticaria|rash|exanthem|swelling of (the )?(lip|face|tongue|throat|eye)|(lip|face|facial|tongue|throat|eyelid|periorbital) swelling|angioedema|anaphyla|bronchospasm|wheez|itch|prurit|throat (tightness|closing)|difficulty breathing|shortness of breath|dyspnea|stevens|sjs|toxic epidermal|ten\b|dress\b|blister|erythema|flushing and hives|serum sickness|hypersensitivity|allergic)\b/i;
const SERIOUS = /\b(liver (injury|damage|failure|toxicity)|hepatotox|hepatitis|transaminitis|elevated (lft|liver)|pancreatitis|agranulocytosis|neutropenia|thrombocytopenia|aplastic|pancytopenia|hemolytic|kidney (injury|failure)|renal (failure|injury)|acute kidney|aki\b|nephrotox|rhabdo|qt prolongation|torsade|arrhythmia|seizure|lactic acidosis|myopathy|tendon rupture|achilles|serotonin syndrome|neuroleptic malignant|bleed|hemorrhage|stroke|interstitial|pneumonitis|hyponatremia|siadh|ototox|hearing loss|c\.? ?diff|colitis)\b/i;
const SIDE_EFFECT_NON_IMMUNE = /\b(cough|nausea|vomit|upset stomach|stomach upset|gi upset|dyspepsia|diarrh|constipat|drowsi|sedat|somnolen|dizz|lightheaded|headache|myalgia|muscle (pain|ache|cramps?)|ankle (swelling|edema)|leg (swelling|edema)|pedal edema|peripheral edema|hypotension|bradycardia|hyperkalemia|hypoglycemia|insomnia|fatigue|tired|jittery|tremor|palpitations|dry mouth|weight gain|frequent urination|urinary|yeast infection|flatulence|bloating|abdominal (pain|cramp))\b/i;

function classifyReaction(reactions: string[], sourceType: unknown): { type: AllergyIntoleranceRow["reaction_type"]; mech: AllergyIntoleranceRow["mechanism"] } {
  const text = reactions.join("; ");
  if (text) {
    if (HYPERSENS.test(text)) return { type: "hypersensitivity", mech: "unknown" };
    if (SERIOUS.test(text)) return { type: "serious_adverse_event", mech: "unknown" };
    if (SIDE_EFFECT_NON_IMMUNE.test(text)) return { type: "side_effect", mech: "non_immune" };
  }
  if (sourceType === "allergy") return { type: "hypersensitivity", mech: "unknown" };
  return { type: "side_effect", mech: "unknown" };
}

function substanceName(name: string, rxnorm: unknown): { substance: string; ingredient?: string } {
  const ings = ingredientsOf(name);
  const isClass = DRUG_CLASSES.test(name);
  if (!isClass && ings.length === 1) {
    const ing = ings[0];
    const known = KNOWN_DRUG_WORDS.has(ing) || (rxnorm !== undefined && rxnorm !== null && rxnorm !== "");
    if (known) return { substance: ing, ingredient: ing };
  }
  return { substance: name };
}

function allergyFromDiagnosis(
  attr: { drug: string; isClass: boolean },
  condition: string,
  onset: ProblemRow["onset"],
  ingsInItem: string[],
  evidence: Evidence,
): AllergyIntoleranceRow {
  let substance = attr.drug;
  if (attr.isClass) {
    const ck = classKey(attr.drug);
    const re = CLASS_MEMBERS[ck];
    const matches = re ? ingsInItem.filter((i) => re.test(i)) : [];
    if (matches.length === 1) substance = matches[0];
  } else {
    const s = substanceName(attr.drug, undefined);
    substance = s.substance;
  }
  const { type } = classifyReaction([condition], undefined);
  const row: AllergyIntoleranceRow = {
    substance,
    reaction_type: HYPERSENS.test(condition) ? "hypersensitivity" : SERIOUS.test(condition) ? "serious_adverse_event" : type,
    mechanism: "unknown",
    reaction: condition,
    criticality: "unknown",
    evidence,
  };
  if (onset) row.onset = onset;
  const sens = drugSensitivity([substance], substance, false);
  if (sens) row.sensitivity = sens;
  return row;
}

function buildAllergies(entries: Entry[], derived: AllergyIntoleranceRow[]): AllergyIntoleranceRow[] {
  const groups = new Map<string, Entry[]>();
  for (const en of entries) {
    if (en.e.type !== "allergy_event") continue;
    const id = str(en.e.allergy_id);
    if (!id) continue;
    if (!["add", "update", "inactivate"].includes(en.e.action)) continue;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id)!.push(en);
  }
  const bySubstance = new Map<string, { row: AllergyIntoleranceRow; key: string }>();
  for (const [, evs] of groups) {
    try {
      evs.sort(cmpEntry);
      const last = evs[evs.length - 1];
      if (last.e.action === "inactivate") continue;
      const e = last.e;
      const name = str(e.substance?.name);
      if (!name) continue;
      if (/^(no known|nka|nkda|none)\b/i.test(name)) continue;
      const rxRaw = e.substance?.rxnorm;
      const { substance, ingredient } = substanceName(name, rxRaw);
      const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.filter((r: unknown) => typeof r === "string" && r.trim()).map((r: string) => r.trim()) : [];
      const cls = classifyReaction(reactions, e.reaction_type);
      const row: AllergyIntoleranceRow = { substance, reaction_type: cls.type, mechanism: cls.mech, criticality: "unknown", evidence: [] };
      if (ingredient) {
        const rxi = rxnormIngredient(rxRaw, name, ingredient);
        if (rxi) row.rxnorm_ingredient = rxi;
      }
      if (reactions.length) row.reaction = reactions.join("; ");
      row.criticality = e.severity === "high" ? "high" : e.severity === "low" ? "low" : "unknown";
      let onset: AllergyIntoleranceRow["onset"];
      for (let i = evs.length - 1; i >= 0; i--) {
        const o = fuzzyToOnset(evs[i].e.onset);
        if (o) {
          onset = o;
          break;
        }
      }
      if (onset) row.onset = onset;
      const sens = drugSensitivity(ingredient ? [ingredient] : [], name, false);
      if (sens) row.sensitivity = sens;
      row.evidence = [ev(last)];
      const ordered: AllergyIntoleranceRow = {
        substance: row.substance,
        ...(row.rxnorm_ingredient ? { rxnorm_ingredient: row.rxnorm_ingredient } : {}),
        reaction_type: row.reaction_type,
        mechanism: row.mechanism,
        ...(row.reaction ? { reaction: row.reaction } : {}),
        criticality: row.criticality,
        ...(row.onset ? { onset: row.onset } : {}),
        ...(row.sensitivity ? { sensitivity: row.sensitivity } : {}),
        evidence: row.evidence,
      };
      const k = substance.toLowerCase();
      const key = sortKey(last.item.effective) + "|" + sortKey(last.item.recorded);
      const prev = bySubstance.get(k);
      if (!prev || prev.key <= key) bySubstance.set(k, { row: ordered, key });
    } catch {
      // skip
    }
  }
  const rows = [...bySubstance.values()].map((x) => x.row);
  for (const d of derived) {
    if (!rows.some((r) => r.substance.toLowerCase() === d.substance.toLowerCase())) rows.push(d);
  }
  rows.sort((a, b) => a.substance.localeCompare(b.substance));
  return rows;
}

// ---------------------------------------------------------------------------
// Labs
// ---------------------------------------------------------------------------

const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L",
  troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const LOINC_MAP: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "59826-8": "creatinine",
  "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr",
  "98979-8": "egfr", "50044-7": "egfr", "69405-9": "egfr", "50210-4": "egfr", "77147-7": "egfr", "98980-6": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "33037-3": "anion_gap", "1863-0": "anion_gap",
  "10466-1": "anion_gap", "41276-7": "anion_gap", "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose",
  "41653-7x": "glucose", "4548-4": "a1c", "17856-6": "a1c", "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "13705-9": "uacr", "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin",
  "20509-6": "hemoglobin", "53060-9": "bhb", "48596-1": "bhb", "2744-1": "ph", "11558-4": "ph", "2753-2": "ph", "19213-8": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "2020-6": "pco2", "3040-3": "lipase", "10839-9": "troponin",
  "42757-5": "troponin", "89579-7": "troponin", "49563-0": "troponin", "2093-3": "cholesterol", "2571-8": "triglycerides",
  "2085-9": "hdl", "13457-7": "ldl", "2089-1": "ldl", "18262-6": "ldl", "69419-0": "ldl",
};

const NFM_MAP: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", "EGFR-NAA": "egfr", "EGFR-AA": "egfr", K: "potassium", NA: "sodium",
  CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", ACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase", TROP: "troponin", TNI: "troponin", TROPI: "troponin",
  CHOL: "cholesterol", TCHOL: "cholesterol", TG: "triglycerides", TRIG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

function analyteFromName(nameRaw: string): Analyte | undefined {
  const n = nameRaw.toLowerCase();
  const urine = /\burine|\burinary|\bur\b/.test(n);
  if (/albumin.*creat|alb\/creat|\bacr\b|\buacr\b|microalbumin.*ratio/.test(n)) return "uacr";
  if (/egfr|glomerular filtration/.test(n)) return "egfr";
  if (urine) return undefined;
  if (/a1c|glycated h|glycohemoglobin/.test(n)) return "a1c";
  if (/creatinine/.test(n) && !/clearance|kinase/.test(n)) return "creatinine";
  if (/potassium|^k\b/.test(n)) return "potassium";
  if (/sodium|^na\b/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/bicarbonate|\bco2\b.*total|total co2|carbon dioxide/.test(n) && !/pco2|partial/.test(n)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/glucose/.test(n) && !/meter|poc|point of care|fingerstick|capillary|tolerance/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(n)) return "wbc";
  if (/hemoglobin|haemoglobin|\bhgb\b/.test(n)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b/.test(n)) return "bhb";
  if (/\bpco2\b|partial pressure.*co2|carbon dioxide.*partial/.test(n)) return "pco2";
  if (/\bph\b/.test(n)) return "ph";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin i\b|troponin-i|tni|troponin i,/.test(n)) return "troponin";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/\bnon[- ]?hdl\b|ratio/.test(n)) return undefined;
  if (/\bhdl\b|high density/.test(n)) return "hdl";
  if (/\bldl\b|low density/.test(n)) return "ldl";
  if (/cholesterol/.test(n)) return "cholesterol";
  return undefined;
}

function convertLab(analyte: Analyte, v: number, unitRaw: string): number | undefined {
  const u = unitRaw.trim().toLowerCase().replace(/\s+/g, "").replace("μ", "u").replace("µ", "u");
  const target = UNITS[analyte].toLowerCase();
  if (u === target) return v;
  switch (analyte) {
    case "creatinine":
      if (u === "umol/l") return round(v / 88.42, 2);
      if (u === "mg/dl") return v;
      return undefined;
    case "egfr":
      if (/^ml\/min(\/1\.73\s*m(2|\^2|²)?)?$/.test(u) || u === "ml/min/1.73m²" || u === "ml/min/{1.73_m2}" || u === "ml/min/1.73_m2") return v;
      return undefined;
    case "potassium":
    case "sodium":
    case "chloride":
    case "bicarbonate":
    case "anion_gap":
    case "bhb":
      if (u === "mmol/l" || u === "meq/l") return v;
      if (analyte === "bhb" && u === "mg/dl") return round(v / 10.41, 2);
      return undefined;
    case "bun":
      if (u === "mmol/l") return round(v * 2.801, 1);
      return u === "mg/dl" ? v : undefined;
    case "glucose":
      if (u === "mmol/l") return Math.round(v * 18.016);
      return u === "mg/dl" ? v : undefined;
    case "a1c":
      if (u === "%" || u === "%hba1c" || u === "percent") return v;
      if (u === "mmol/mol") return round(v / 10.929 + 2.15, 1);
      return undefined;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "mg/g{creat}" || u === "ug/mg" || u === "mcg/mg" || u === "mg/gcr") return v;
      if (u === "mg/mmol" || u === "mg/mmolcreat") return round(v * 8.84, 1);
      return undefined;
    case "platelets":
    case "wbc":
      if (["10*3/ul", "10^3/ul", "k/ul", "x10e3/ul", "thou/ul", "10*9/l", "10^9/l", "x10^9/l", "x10e9/l", "x10^3/ul", "k/mm3", "10^3/mm3", "10*3/mm3"].includes(u)) return v;
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
      if (u === "u/l" || u === "iu/l" || u === "units/l") return v;
      return undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return round(v / 1000, 4);
      return undefined;
    case "cholesterol":
    case "hdl":
    case "ldl":
      if (u === "mmol/l") return round(v * 38.67, 0);
      return u === "mg/dl" ? v : undefined;
    case "triglycerides":
      if (u === "mmol/l") return round(v * 88.57, 0);
      return u === "mg/dl" ? v : undefined;
  }
  return undefined;
}

function parseValue(raw: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof raw === "number" && isFinite(raw)) return { value: raw };
  if (typeof raw !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d{1,3}(?:,\d{3})+|-?\d*\.?\d+)\s*$/.exec(raw);
  if (!m) return undefined;
  const v = parseFloat(m[2].replace(/,/g, ""));
  if (!isFinite(v)) return undefined;
  let c = m[1] as string | undefined;
  if (c === "≤") c = "<=";
  if (c === "≥") c = ">=";
  return c ? { value: v, comparator: c as LabResultRow["comparator"] } : { value: v };
}

function isRaceVariant(e: any): boolean {
  const text = `${e.test?.name ?? ""} ${e.test?.nfm_code ?? ""}`.toLowerCase();
  if (/non[- ]?(african|black|aa\b)|-naa\b|\bnaa\b|non-black/.test(text)) return false;
  if (/african|black|-aa\b/.test(text)) return true;
  const lo = str(e.test?.loinc);
  return lo === "48643-1" || lo === "88293-6";
}

function egfrEquation(e: any): LabResultRow["egfr_equation"] {
  const t = `${e.test?.name ?? ""} ${e.comment ?? ""}`.toLowerCase();
  if (/ckd[- ]?epi[^0-9]*2021|2021[^.]*ckd[- ]?epi|race[- ]free|race[- ]neutral/.test(t)) return "ckd-epi-2021";
  if (/ckd[- ]?epi[^0-9]*2009|2009[^.]*ckd[- ]?epi/.test(t)) return "ckd-epi-2009";
  if (/mdrd/.test(t)) return "mdrd";
  const lo = str(e.test?.loinc);
  if (lo === "98979-8" || lo === "98980-6") return "ckd-epi-2021";
  if (lo === "88293-6" || lo === "88294-4") return "ckd-epi-2009";
  return "unknown";
}

const STATUS_RANK: Record<string, number> = { P: 1, F: 2, C: 3 };

function buildLabs(entries: Entry[]): LabResultRow[] {
  const groups = new Map<string, Entry[]>();
  for (const en of entries) {
    if (en.e.type !== "imported_result") continue;
    const ref = en.e.external_ref;
    const key = ref && str(ref.accession) && str(ref.result_code)
      ? `${ref.lab ?? ""}|${ref.accession}|${ref.result_code}`
      : `item|${en.item.id}|${en.key}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(en);
  }
  const rows: LabResultRow[] = [];
  for (const [, copies] of groups) {
    try {
      // most advanced status, then latest resulted / recorded
      copies.sort((a, b) => {
        const ra = STATUS_RANK[a.e.result_status] ?? 0;
        const rb = STATUS_RANK[b.e.result_status] ?? 0;
        if (ra !== rb) return rb - ra;
        const ta = sortKey(a.e.resulted) + sortKey(a.item.recorded);
        const tb = sortKey(b.e.resulted) + sortKey(b.item.recorded);
        return ta < tb ? 1 : ta > tb ? -1 : 0;
      });
      const best = copies[0];
      const e = best.e;
      if (!STATUS_RANK[e.result_status]) continue;
      const comment = String(e.comment ?? "");
      if (e.result_status === "C" && /\b(invalidated|invalid|withdrawn|cancel+ed|disregard|not performed|entered in error|wrong patient|retracted)\b/i.test(comment.split(/CORRECTED/i).pop() ?? "")) {
        if (!parseValue(e.value) || /result (is )?(invalidated|withdrawn|cancel)/i.test(comment)) continue;
      }
      const loinc = str(e.test?.loinc);
      const nfm = str(e.test?.nfm_code)?.toUpperCase();
      const name = str(e.test?.name) ?? "";
      let analyte: Analyte | undefined = (loinc && LOINC_MAP[loinc]) || (nfm && NFM_MAP[nfm]) || analyteFromName(name);
      // the name must not contradict a urine specimen for serum analytes
      if (analyte && analyte !== "uacr" && /\burine\b|\burinary\b/i.test(name)) analyte = undefined;
      if (!analyte) continue;
      if (analyte === "egfr" && isRaceVariant(e)) continue;
      const pv = parseValue(e.value);
      if (!pv) continue;
      const value = convertLab(analyte, pv.value, String(e.unit ?? ""));
      if (value === undefined) continue;
      const collected = rfc3339Local(e.collected) ?? rfc3339Local(best.item.effective);
      if (!collected) continue;
      const row = { analyte, value } as LabResultRow;
      if (pv.comparator) row.comparator = pv.comparator;
      row.unit = UNITS[analyte];
      row.collected = collected;
      row.status = e.result_status === "P" ? "preliminary" : "final";
      if (analyte === "egfr") row.egfr_equation = egfrEquation(e);
      if (loinc) row.loinc = loinc;
      row.evidence = uniqEvidence(copies.map(ev));
      rows.push(row as LabResultRow);
    } catch {
      // skip
    }
  }
  rows.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : a.analyte.localeCompare(b.analyte)));
  return rows;
}

// ---------------------------------------------------------------------------
// Vitals
// ---------------------------------------------------------------------------

function parseBp(s: unknown): [number, number] | undefined {
  if (typeof s !== "string") return undefined;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(s);
  if (!m) return undefined;
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

function buildVitals(entries: Entry[]): VitalRow[] {
  const visitType = new Map<string, string>();
  for (const en of entries) {
    if (en.e.type === "visit" && str(en.e.visit_id)) visitType.set(en.e.visit_id, String(en.e.visit_type));
  }
  const rows: VitalRow[] = [];
  for (const en of entries) {
    if (en.e.type !== "vital_set") continue;
    try {
      const e = en.e;
      const bp = parseBp(e.bp);
      const rep = parseBp(e.bp_repeat);
      const pulse = typeof e.pulse_bpm === "number" && isFinite(e.pulse_bpm) ? e.pulse_bpm : undefined;
      const wt = typeof e.weight_lb === "number" && isFinite(e.weight_lb) && e.weight_lb > 0 ? Math.round(e.weight_lb * 0.45359237 * 10) / 10 : undefined;
      if (!bp && !rep && pulse === undefined && wt === undefined) continue;
      const vt = str(e.visit_id) ? visitType.get(e.visit_id) : undefined;
      const setting: VitalRow["setting"] = vt === "telehealth" || vt === "phone" ? "home" : "clinic";
      let lt = toLocal(en.item.effective);
      if (!lt || !lt.time || lt.date.length !== 10) lt = toLocal(en.item.recorded);
      if (!lt || !lt.time || lt.date.length !== 10) continue;
      const row: VitalRow = { setting, local_time: `${lt.date}T${lt.time.slice(0, 5)}`, evidence: [ev(en)] };
      if (bp) {
        row.systolic_mmhg = bp[0];
        row.diastolic_mmhg = bp[1];
      }
      if (rep && setting !== "home") {
        if (bp) {
          row.repeat_systolic_mmhg = rep[0];
          row.repeat_diastolic_mmhg = rep[1];
        } else {
          row.systolic_mmhg = rep[0];
          row.diastolic_mmhg = rep[1];
        }
      }
      if (pulse !== undefined) row.pulse_bpm = pulse;
      if (wt !== undefined) row.weight_kg = wt;
      const ordered: VitalRow = {
        setting: row.setting,
        local_time: row.local_time,
        ...(row.systolic_mmhg !== undefined ? { systolic_mmhg: row.systolic_mmhg, diastolic_mmhg: row.diastolic_mmhg } : {}),
        ...(row.repeat_systolic_mmhg !== undefined ? { repeat_systolic_mmhg: row.repeat_systolic_mmhg, repeat_diastolic_mmhg: row.repeat_diastolic_mmhg } : {}),
        ...(row.pulse_bpm !== undefined ? { pulse_bpm: row.pulse_bpm } : {}),
        ...(row.weight_kg !== undefined ? { weight_kg: row.weight_kg } : {}),
        evidence: row.evidence,
      };
      rows.push(ordered);
    } catch {
      // skip
    }
  }
  rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return rows;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    if (!Array.isArray(items) || typeof asOf !== "string") return empty;
    const counting = countingItems(items, asOf.trim());
    const entries = entriesOf(counting);
    const safe = <T>(f: () => T, d: T): T => {
      try {
        return f();
      } catch {
        return d;
      }
    };
    const meds = safe(() => buildMedications(entries), { rows: [] as MedicationRow[], byItem: new Map<string, string[]>() });
    const probs = safe(() => buildProblems(entries, meds.byItem), { rows: [] as ProblemRow[], derivedAllergies: [] as AllergyIntoleranceRow[] });
    return {
      medications: meds.rows,
      problems: probs.rows,
      allergies: safe(() => buildAllergies(entries, probs.derivedAllergies), []),
      labs: safe(() => buildLabs(entries), []),
      vitals: safe(() => buildVitals(entries), []),
    };
  } catch {
    return empty;
  }
}
