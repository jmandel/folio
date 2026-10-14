import type { FolioItem, ViewRows, MedicationRow, VitalRow, Evidence, Sensitivity } from "../in/views/views";

// Mapper for HomeLog (patient-generated diary app; schema homelog-v1).
// Produces medications (from the latest counting My Medicines snapshot) and home vitals
// (BP and glucose readings from the current day pages). HomeLog has no problems, allergies or labs.

const TZ = "America/Chicago";

// ---------------------------------------------------------------- time helpers

let chicagoFmt: Intl.DateTimeFormat | null = null;
function fmt(): Intl.DateTimeFormat {
  if (!chicagoFmt) {
    chicagoFmt = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  }
  return chicagoFmt;
}

/** Local (Chicago) `YYYY-MM-DDTHH:MM:SS` for an instant, or null. */
function chicagoLocal(ms: number): string | null {
  if (!isFinite(ms)) return null;
  const parts: Record<string, string> = {};
  for (const p of fmt().formatToParts(new Date(ms))) parts[p.type] = p.value;
  const hour = parts.hour === "24" ? "00" : parts.hour;
  return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}:${parts.second}`;
}

const HAS_OFFSET = /(Z|[+-]\d{2}:?\d{2})$/i;

/** Converts a date or date-time string to a local Chicago `YYYY-MM-DDTHH:MM:SS` (or date) for comparison. */
function toLocal(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return `${t}T00:00:00`;
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(:\d{2})?(\.\d+)?(.*)$/.exec(t);
  if (!m) return null;
  if (HAS_OFFSET.test(t)) {
    return chicagoLocal(Date.parse(t.replace(" ", "T")));
  }
  if (m[5] && m[5].trim() !== "") return null;
  return `${m[1]}T${m[2]}${m[3] ?? ":00"}`;
}

/** Wall-clock `YYYY-MM-DDTHH:MM` for a HomeLog local time (no offset expected). */
function wallTime(s: unknown): string | null {
  const l = toLocal(s);
  if (!l || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(l)) return null;
  if (typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s.trim())) return null;
  return l.slice(0, 16);
}

function minutesOf(t: string): number {
  const ms = Date.parse(`${t}:00Z`);
  return isFinite(ms) ? ms / 60000 : NaN;
}

// ---------------------------------------------------------------- item selection

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const cutoff = `${asOf}T23:59:59.999`;
  const counted: { item: FolioItem; rec: string }[] = [];
  const seen = new Set<string>();
  for (const it of Array.isArray(items) ? items : []) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const rec = toLocal(it.recorded);
    if (!rec || rec > cutoff) continue;
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    counted.push({ item: it, rec });
  }
  const removed = new Set<string>();
  for (const { item } of counted) {
    for (const k of ["supersedes", "retracts"] as const) {
      const v = (item as any)[k];
      if (Array.isArray(v)) for (const id of v) if (typeof id === "string" && id !== item.id) removed.add(id);
    }
  }
  // Supersession is transitive by construction: every counting superseder removes its target,
  // and a removed intermediate's own `supersedes` still applies (it was a counting item).
  return counted
    .filter(c => !removed.has(c.item.id))
    .sort((a, b) => (a.rec < b.rec ? -1 : a.rec > b.rec ? 1 : a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0))
    .map(c => c.item);
}

function entriesOf(item: FolioItem): [string, any][] {
  const p = item.payload;
  if (!p || typeof p !== "object" || Array.isArray(p)) return [];
  return Object.keys(p).sort().map(k => [k, (p as any)[k]] as [string, any]).filter(([, e]) => e && typeof e === "object");
}

function isMedList(item: FolioItem): boolean {
  const es = entriesOf(item);
  if (es.some(([, e]) => e.type === "my_med")) return true;
  if (es.length === 0 && typeof item.narrative === "string" && /^\s*My Medicines\b/i.test(item.narrative)) return true;
  return false;
}

// ---------------------------------------------------------------- medicine names

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "calcium", "potassium", "magnesium", "maleate", "besylate", "succinate",
  "tartrate", "mesylate", "fumarate", "citrate", "sulfate", "acetate", "phosphate", "bromide", "hyclate",
  "monohydrate", "trihydrate", "dihydrate", "anhydrous", "propionate", "furoate", "dipropionate", "valerate",
  "hydrobromide", "bitartrate", "medoxomil", "axetil", "disodium", "dimesylate", "xinafoate", "monosodium",
  "pivoxil", "cilexetil", "estolate", "stearate", "ethylsuccinate", "lactate", "gluconate", "carbonate",
  "nitrate", "mononitrate", "erbumine", "olamine", "tromethamine", "hemifumarate", "hydrate",
]);

const DOSE_FORM_WORDS = /\b(oral|tablet|tablets|capsule|capsules|injection|injectable|solution|suspension|pen|injector|inhaler|inhalation|metered|dose|extended|release|delayed|chewable|topical|cream|ointment|patch|transdermal|nasal|spray|ophthalmic|drops|powder|syrup|elixir|er|xr|sr|dr|xl|cr|la|hfa|ec|odt|prefilled|syringe|auto-injector|kwikpen|flexpen|solostar|vial|gel|lotion|suppository|film|granules|lozenge|kit|pack)\b/i;

const BRANDS: Record<string, string> = {
  // cardiovascular
  zestril: "lisinopril", prinivil: "lisinopril", qbrelis: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  lotensin: "benazepril", accupril: "quinapril", norvasc: "amlodipine", katerzia: "amlodipine", procardia: "nifedipine",
  adalat: "nifedipine", cardizem: "diltiazem", tiazac: "diltiazem", calan: "verapamil", verelan: "verapamil",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan",
  atacand: "candesartan", edarbi: "azilsartan", lopressor: "metoprolol", toprol: "metoprolol", "toprol xl": "metoprolol",
  tenormin: "atenolol", coreg: "carvedilol", bystolic: "nebivolol", zebeta: "bisoprolol", inderal: "propranolol",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide",
  aldactone: "spironolactone", inspra: "eplerenone", hygroton: "chlorthalidone", thalitone: "chlorthalidone",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  livalo: "pitavastatin", mevacor: "lovastatin", zetia: "ezetimibe", tricor: "fenofibrate", lopid: "gemfibrozil",
  plavix: "clopidogrel", brilinta: "ticagrelor", effient: "prasugrel", eliquis: "apixaban", xarelto: "rivaroxaban",
  pradaxa: "dabigatran", coumadin: "warfarin", jantoven: "warfarin", lanoxin: "digoxin", entresto: "sacubitril / valsartan",
  imdur: "isosorbide mononitrate", nitrostat: "nitroglycerin", ranexa: "ranolazine", catapres: "clonidine",
  apresoline: "hydralazine", cordarone: "amiodarone", pacerone: "amiodarone", multaq: "dronedarone",
  // diabetes
  glucophage: "metformin", "glucophage xr": "metformin", glumetza: "metformin", fortamet: "metformin",
  glucotrol: "glipizide", "glucotrol xl": "glipizide", amaryl: "glimepiride", diabeta: "glyburide", micronase: "glyburide",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", nesina: "alogliptin",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  actos: "pioglitazone", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", trulicity: "dulaglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  byetta: "exenatide", bydureon: "exenatide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  lyumjev: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  janumet: "metformin / sitagliptin", synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin",
  // thyroid
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", euthyrox: "levothyroxine",
  tirosint: "levothyroxine", cytomel: "liothyronine", tapazole: "methimazole", armour: "thyroid",
  // GI
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", prevacid: "lansoprazole",
  aciphex: "rabeprazole", dexilant: "dexlansoprazole", pepcid: "famotidine", zantac: "ranitidine", "zantac 360": "famotidine",
  tagamet: "cimetidine", zofran: "ondansetron", reglan: "metoclopramide", imodium: "loperamide", miralax: "polyethylene glycol 3350",
  colace: "docusate", senokot: "sennosides", dulcolax: "bisacodyl", linzess: "linaclotide", carafate: "sucralfate",
  // pain / OTC
  tylenol: "acetaminophen", paracetamol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  naprosyn: "naproxen", anaprox: "naproxen", celebrex: "celecoxib", mobic: "meloxicam", voltaren: "diclofenac",
  bayer: "aspirin", ecotrin: "aspirin", "baby aspirin": "aspirin", asa: "aspirin", ultram: "tramadol",
  neurontin: "gabapentin", gralise: "gabapentin", lyrica: "pregabalin", flexeril: "cyclobenzaprine",
  robaxin: "methocarbamol", zanaflex: "tizanidine", norco: "acetaminophen / hydrocodone", vicodin: "acetaminophen / hydrocodone",
  percocet: "acetaminophen / oxycodone", oxycontin: "oxycodone", roxicodone: "oxycodone",
  imitrex: "sumatriptan", maxalt: "rizatriptan",
  // allergy / respiratory
  zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine", xyzal: "levocetirizine", clarinex: "desloratadine",
  benadryl: "diphenhydramine", flonase: "fluticasone", nasacort: "triamcinolone", rhinocort: "budesonide",
  singulair: "montelukast", ventolin: "albuterol", "ventolin hfa": "albuterol", proair: "albuterol", proventil: "albuterol",
  salbutamol: "albuterol", xopenex: "levalbuterol", flovent: "fluticasone", pulmicort: "budesonide", qvar: "beclomethasone",
  spiriva: "tiotropium", advair: "fluticasone / salmeterol", symbicort: "budesonide / formoterol",
  breo: "fluticasone / vilanterol", trelegy: "fluticasone / umeclidinium / vilanterol", incruse: "umeclidinium",
  mucinex: "guaifenesin", sudafed: "pseudoephedrine",
  // mental health
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine",
  effexor: "venlafaxine", "effexor xr": "venlafaxine", pristiq: "desvenlafaxine", cymbalta: "duloxetine",
  wellbutrin: "bupropion", "wellbutrin xl": "bupropion", zyban: "bupropion", remeron: "mirtazapine", desyrel: "trazodone",
  seroquel: "quetiapine", abilify: "aripiprazole", risperdal: "risperidone", zyprexa: "olanzapine", latuda: "lurasidone",
  geodon: "ziprasidone", vraylar: "cariprazine", rexulti: "brexpiprazole", haldol: "haloperidol", clozaril: "clozapine",
  lithobid: "lithium", depakote: "divalproex", lamictal: "lamotrigine", tegretol: "carbamazepine", trileptal: "oxcarbazepine",
  xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam", buspar: "buspirone",
  ambien: "zolpidem", lunesta: "eszopiclone", adderall: "amphetamine / dextroamphetamine", ritalin: "methylphenidate",
  concerta: "methylphenidate", vyvanse: "lisdexamfetamine", strattera: "atomoxetine", elavil: "amitriptyline",
  pamelor: "nortriptyline", hydroxyzine: "hydroxyzine", vistaril: "hydroxyzine", atarax: "hydroxyzine",
  keppra: "levetiracetam", topamax: "topiramate", dilantin: "phenytoin",
  // substance use
  suboxone: "buprenorphine / naloxone", zubsolv: "buprenorphine / naloxone", subutex: "buprenorphine",
  sublocade: "buprenorphine", vivitrol: "naltrexone", revia: "naltrexone", antabuse: "disulfiram", campral: "acamprosate",
  narcan: "naloxone", chantix: "varenicline",
  // HIV / STI
  truvada: "emtricitabine / tenofovir disoproxil", descovy: "emtricitabine / tenofovir alafenamide",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", genvoya: "cobicistat / elvitegravir / emtricitabine / tenofovir alafenamide",
  triumeq: "abacavir / dolutegravir / lamivudine", tivicay: "dolutegravir", isentress: "raltegravir", dovato: "dolutegravir / lamivudine",
  valtrex: "valacyclovir", zovirax: "acyclovir", famvir: "famciclovir",
  // reproductive / urology / hormones
  yaz: "drospirenone / ethinyl estradiol", yasmin: "drospirenone / ethinyl estradiol", "plan b": "levonorgestrel",
  mirena: "levonorgestrel", nexplanon: "etonogestrel", depo: "medroxyprogesterone", "depo-provera": "medroxyprogesterone",
  provera: "medroxyprogesterone", premarin: "conjugated estrogens", estrace: "estradiol", prometrium: "progesterone",
  clomid: "clomiphene", viagra: "sildenafil", cialis: "tadalafil", flomax: "tamsulosin", proscar: "finasteride",
  avodart: "dutasteride", detrol: "tolterodine", ditropan: "oxybutynin", myrbetriq: "mirabegron", vesicare: "solifenacin",
  // other
  prednisone: "prednisone", deltasone: "prednisone", medrol: "methylprednisolone", fosamax: "alendronate",
  boniva: "ibandronate", actonel: "risedronate", allopurinol: "allopurinol", zyloprim: "allopurinol", uloric: "febuxostat",
  colcrys: "colchicine", mitigare: "colchicine", plaquenil: "hydroxychloroquine", methotrexate: "methotrexate",
  humira: "adalimumab", enbrel: "etanercept", keflex: "cephalexin", augmentin: "amoxicillin / clavulanate",
  amoxil: "amoxicillin", zithromax: "azithromycin", "z-pak": "azithromycin", zpak: "azithromycin", cipro: "ciprofloxacin",
  levaquin: "levofloxacin", bactrim: "sulfamethoxazole / trimethoprim", "bactrim ds": "sulfamethoxazole / trimethoprim",
  macrobid: "nitrofurantoin", flagyl: "metronidazole", diflucan: "fluconazole", doxy: "doxycycline",
  klor: "potassium chloride", "klor-con": "potassium chloride", "k-dur": "potassium chloride",
  "vitamin d": "cholecalciferol", "vitamin d3": "cholecalciferol", "vit d": "cholecalciferol", "vitamin d 3": "cholecalciferol",
  "vitamin b12": "cyanocobalamin", "b12": "cyanocobalamin", "vitamin b-12": "cyanocobalamin", "vitamin c": "ascorbic acid",
  "folic acid": "folic acid", "fish oil": "fish oil", "omega 3": "omega-3 fatty acids", "omega-3": "omega-3 fatty acids",
  "iron": "ferrous sulfate", "melatonin": "melatonin", "tums": "calcium carbonate", "aricept": "donepezil",
  namenda: "memantine", sinemet: "carbidopa / levodopa", requip: "ropinirole", mirapex: "pramipexole",
  xalatan: "latanoprost", eliquis5: "apixaban",
};

const GENERIC_SUFFIX = /(pril|sartan|olol|ilol|statin|dipine|formin|gliflozin|gliptin|glutide|prazole|tidine|cillin|mycin|floxacin|cycline|azepam|azolam|oxetine|aline|pram|triptan|lukast|tadine|zosin|osin|semide|thiazide|thalidone|actone|parin|xaban|gatran|grel|afil|olone|sone|asone|lamide|ipine|zodone|apine|idone|iprazole|azine|barbital|profen|oxicam|coxib|fenac|navir|tegravir|vudine|ciclovir|conazole|thyroxine|thyronine|mazole|dronate|vastatin|amide|ine|ide|ol|in)$/;

function stripSalts(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return name;
  const kept = words.filter((w, i) => i === 0 || !SALTS.has(w));
  return kept.join(" ");
}

/** Cleans an RxNorm display ("rosuvastatin calcium 20 MG Oral Tablet [Crestor]") to ingredient(s). */
function ingredientFromDisplay(display: string): { ingredient: string; ingredientOnly: boolean } | null {
  let d = display.replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ").trim().toLowerCase();
  if (!d) return null;
  let ingredientOnly = !/\d/.test(d) && !DOSE_FORM_WORDS.test(d);
  const parts = d.split(/\s+\/\s+|\s+and\s+(?=[a-z])/).map(p => {
    const words = p.split(/\s+/);
    const out: string[] = [];
    for (const w of words) {
      if (/\d/.test(w) || DOSE_FORM_WORDS.test(w) || /^(mg|mcg|ml|unt|units?|actuat|hr|%)/.test(w)) break;
      out.push(w);
    }
    return stripSalts(out.join(" ").trim());
  }).filter(Boolean);
  if (parts.length === 0) return null;
  const uniq = Array.from(new Set(parts));
  if (uniq.length > 1) ingredientOnly = false;
  return { ingredient: uniq.join(" / "), ingredientOnly };
}

const KNOWN_GENERICS = new Set(Object.values(BRANDS).flatMap(v => v.split(" / ")));

/** Derives a generic ingredient from a typed name, or undefined when it cannot tell which drug it is. */
function ingredientFromTyped(name: string): string | undefined {
  let n = name.toLowerCase().replace(/[®™]/g, "").replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  if (!n) return undefined;
  if (BRANDS[n]) return BRANDS[n];
  // drop strength and form words
  const words = n.split(/\s+/);
  const out: string[] = [];
  for (const w of words) {
    if (/\d/.test(w) || DOSE_FORM_WORDS.test(w) || /^(mg|mcg|ml|units?)$/.test(w)) break;
    out.push(w);
  }
  n = out.join(" ").replace(/[.,;:]+$/, "").trim();
  if (!n) return undefined;
  if (BRANDS[n]) return BRANDS[n];
  const first = n.split(" ")[0];
  if (BRANDS[first] && n.split(" ").length <= 2) return BRANDS[first];
  const stripped = stripSalts(n);
  if (KNOWN_GENERICS.has(stripped)) return stripped;
  if (/^insulin\b/.test(stripped)) return stripped;
  if (/^[a-z][a-z-]+$/.test(stripped) && stripped.length >= 6 && GENERIC_SUFFIX.test(stripped)) return stripped;
  return undefined;
}

// ---------------------------------------------------------------- sensitivity

const SENSITIVE: [Sensitivity, RegExp][] = [
  ["mental-health", /\b(sertraline|fluoxetine|escitalopram|citalopram|paroxetine|fluvoxamine|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|vilazodone|vortioxetine|quetiapine|aripiprazole|risperidone|olanzapine|lurasidone|ziprasidone|cariprazine|brexpiprazole|haloperidol|clozapine|paliperidone|asenapine|lithium|divalproex|lamotrigine|alprazolam|lorazepam|clonazepam|diazepam|buspirone|amitriptyline|nortriptyline|imipramine|doxepin|phenelzine|tranylcypromine|methylphenidate|amphetamine|dextroamphetamine|lisdexamfetamine|atomoxetine|guanfacine er|chlorpromazine|perphenazine|fluphenazine)\b/],
  ["substance-use", /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|naloxone|varenicline|nicotine)\b/],
  ["hiv-sti", /\b(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|elvitegravir|cabotegravir|rilpivirine|efavirenz|abacavir|lamivudine|zidovudine|darunavir|atazanavir|ritonavir|cobicistat|lopinavir|nevirapine|maraviroc|lenacapavir|valacyclovir|acyclovir|famciclovir)\b/],
  ["sexual-reproductive-health", /\b(levonorgestrel|norethindrone|ethinyl estradiol|drospirenone|norgestimate|desogestrel|etonogestrel|medroxyprogesterone|ulipristal|clomiphene|letrozole for fertility|sildenafil|tadalafil|vardenafil|mifepristone|misoprostol|segesterone|norelgestromin)\b/],
];

function sensitivityOf(ingredient: string | undefined, name: string): Sensitivity[] | undefined {
  const hay = `${ingredient ?? ""} ${name}`.toLowerCase();
  const out: Sensitivity[] = [];
  for (const [cat, re] of SENSITIVE) if (re.test(hay)) out.push(cat);
  // acyclovir/valacyclovir are often for shingles/cold sores; only tag when the name says herpes
  if (out.includes("hiv-sti") && !/(emtricitabine|tenofovir|tegravir|virine|efavirenz|abacavir|lamivudine|zidovudine|navir|cobicistat|nevirapine|maraviroc|lenacapavir)/.test(hay) && !/herpes|hsv|genital/.test(hay)) {
    out.splice(out.indexOf("hiv-sti"), 1);
  }
  // sildenafil/tadalafil are also used for pulmonary hypertension and BPH
  if (out.includes("sexual-reproductive-health") && /^(sildenafil|tadalafil)$/.test(ingredient ?? "") && !/viagra|cialis|levitra|erect|\bed\b/.test(hay)) {
    out.splice(out.indexOf("sexual-reproductive-health"), 1);
  }
  return out.length ? out : undefined;
}

// ---------------------------------------------------------------- dose and frequency

const NUMWORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, a: 1, an: 1, half: 0.5, single: 1 };

function num(s: string): number {
  const t = s.toLowerCase().trim();
  if (t in NUMWORDS) return NUMWORDS[t];
  if (/^\d+\/\d+$/.test(t)) { const [a, b] = t.split("/").map(Number); return b ? a / b : NaN; }
  return Number(t);
}

function normUnit(u: string): "mg" | "mcg" | "units" | "mL" | "g" | null {
  const t = u.toLowerCase();
  if (/^(mg|mgs|milligrams?)$/.test(t)) return "mg";
  if (/^(mcg|µg|μg|ug|micrograms?)$/.test(t)) return "mcg";
  if (/^(u|iu|units?|unt)$/.test(t)) return "units";
  if (/^(ml|cc|milliliters?|millilitres?)$/.test(t)) return "mL";
  if (/^(g|grams?|gm)$/.test(t)) return "g";
  return null;
}

type Strength = { value: number; unit: "mg" | "mcg" | "units" | "mL"; perVolumeMl?: number; perUnitWord?: string };

function parseStrength(s: unknown): Strength | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  const nums = t.match(/\d+(?:\.\d+)?/g) ?? [];
  const m = /^(?:about\s+)?(\d+(?:\.\d+)?)\s*(mg|mgs|milligrams?|mcg|µg|μg|ug|micrograms?|units?|iu|u|g|grams?|ml|cc)\b(?:\s*(?:\/|per)\s*(\d+(?:\.\d+)?)?\s*(ml|cc|actuation|puff|spray|dose|tablet|capsule|tab|cap)s?\b)?/i.exec(t);
  if (!m) return null;
  let unit = normUnit(m[2]);
  if (!unit) return null;
  let value = Number(m[1]);
  // a second independent number (combination strength like "5/325 mg") is not a single strength
  const used = 1 + (m[3] ? 1 : 0);
  if (nums.length > used && !/\bpen\b|\bvial\b/i.test(t.slice(m[0].length))) {
    if (/\d\s*\/\s*\d/.test(t) || /\d.*\b(and|\+)\b.*\d/i.test(t)) return null;
  }
  if (unit === "g") { unit = "mg"; value = value * 1000; }
  const st: Strength = { value, unit: unit as Strength["unit"] };
  if (m[4]) {
    const per = m[4].toLowerCase();
    if (per === "ml" || per === "cc") st.perVolumeMl = m[3] ? Number(m[3]) : 1;
    else st.perUnitWord = per;
  }
  return st;
}

const NUM = "(\\d+(?:\\.\\d+)?|\\d+\\/\\d+|one|two|three|four|five|six|a|an|half|single)";

function round3(x: number): number { return Math.round(x * 1000) / 1000; }

function parseDose(strengthText: unknown, how: unknown): MedicationRow["dose"] | undefined {
  if (typeof how !== "string" || !how.trim()) return undefined; // strength with no directions
  const h = how.toLowerCase().replace(/½/g, " half ");
  if (/sliding|scale|depend|varies|vary|per (my )?(sugar|reading|carb)|correction|according to|based on|if (my )?(sugar|bs|bg|glucose)|taper/.test(h)) return undefined;
  // ranges: "1-2", "1 to 2", "1 or 2", "one or two", "up to 2"
  if (new RegExp(`${NUM}\\s*(-|–|—|to|or)\\s*${NUM}\\b`).test(h) && !/\b(a|an) or\b/.test(h)) {
    const rm = new RegExp(`\\b${NUM}\\s*(?:-|–|—|to|or)\\s*${NUM}\\b`).exec(h);
    if (rm && !/^(a|an)$/.test(rm[1])) return undefined;
  }
  if (/\bup to\b/.test(h)) return undefined;
  const st = parseStrength(strengthText);

  // explicit amount with a measure unit
  const am = new RegExp(`\\b${NUM}\\s*(mg|mgs|milligrams?|mcg|µg|μg|ug|micrograms?|units?|iu|u|ml|cc|g|grams?)\\b`, "i").exec(h);
  if (am) {
    const v = num(am[1]);
    const u = normUnit(am[2]);
    if (!isFinite(v) || !u) return undefined;
    if (u === "mL") {
      if (st && st.perVolumeMl && st.unit !== "mL") return { value: round3(st.value * v / st.perVolumeMl), unit: st.unit };
      return { value: round3(v), unit: "mL" };
    }
    if (u === "g") return { value: round3(v * 1000), unit: "mg" };
    return { value: round3(v), unit: u };
  }

  // a count of tablets / capsules / puffs etc.
  const cm = new RegExp(`\\b${NUM}\\s*(?:x\\s*)?(tablets?|tabs?|pills?|capsules?|caps?|puffs?|sprays?|inhalations?|drops?|patch(?:es)?|gumm(?:y|ies)|softgels?|chews?|lozenges?)\\b`, "i").exec(h);
  let count: number | null = null;
  let countWord = "";
  if (cm) { count = num(cm[1]); countWord = cm[2].toLowerCase(); }
  else {
    const bare = new RegExp(`^\\s*(?:take\\s+)?${NUM}\\b(?!\\s*(?:times|x\\b|days?|weeks?|hours?|hrs?|am|pm|:|o'?clock))`, "i").exec(h);
    if (bare && !/^(a|an)$/.test(bare[1])) { count = num(bare[1]); }
  }
  if (count !== null && (!isFinite(count) || count <= 0)) return undefined;

  if (count === null) {
    // no count: one unit when there is a time or schedule
    if (!hasScheduleWords(h)) return undefined;
    count = 1;
  }

  const isPuff = /^(puff|spray|inhalation)/.test(countWord);
  const isTab = countWord === "" || /^(tab|pill|cap|softgel|chew|gumm|lozenge)/.test(countWord);
  if (st) {
    if (st.perVolumeMl) return undefined; // per-volume strength with a count makes no single amount
    if (st.unit === "mL") return undefined;
    if (isPuff || isTab || /^(drop|patch)/.test(countWord)) return { value: round3(st.value * count), unit: st.unit };
    return undefined;
  }
  if (isTab && (countWord !== "" || cm)) return { value: round3(count), unit: "tablet" };
  return undefined;
}

function hasScheduleWords(h: string): boolean {
  return /\b(morning|breakfast|noon|lunch|afternoon|evening|supper|dinner|night|nightly|bedtime|bed|daily|day|days|a\.?m\.?|p\.?m\.?|once|twice|times|every|each|week|weekly|hours?|meals?|needed|when|qd|bid|tid|qhs|prn|sunday|monday|tuesday|wednesday|thursday|friday|saturday|wake|waking|sleep)\b/.test(h);
}

function parseFrequency(how: unknown): MedicationRow["frequency"] | undefined {
  if (typeof how !== "string" || !how.trim()) return undefined;
  const h = how.toLowerCase();
  if (/\b(as needed|when needed|if needed|as required|when required|prn|when i|if i|when it|if it|when my|if my|whenever|for (pain|headaches?|migraines?|sleep|anxiety|wheez\w*|itch\w*|nausea|heartburn|constipation|allerg\w*))\b/.test(h)) return "PRN";
  if (/\b(taper|every other|alternate days|most days|some days|few days|four times|4 times|4x|qid|every [2-6] hours?|every four|every six|monthly|a month|per month|every month|every \d+ (days|weeks)|every (two|three) (days|weeks)|twice a week|2 times a week|three times a week|3 times a week|days a week)\b/.test(h)) return "other";
  if (/\b(weekly|once a week|1x a week|one time a week|every week|a week|per week|every (sunday|monday|tuesday|wednesday|thursday|friday|saturday)|on (sundays|mondays|tuesdays|wednesdays|thursdays|fridays|saturdays))\b/.test(h)) return "QW";
  if (/\b(three times|3 times|3x|thrice|tid|every 8 hours|every eight hours)\b/.test(h)) return "TID";
  if (/\b(twice|two times|2 times|2x|bid|every 12 hours|every twelve hours)\b/.test(h)) return "BID";
  let slots = 0;
  if (/\b(morning|breakfast|a\.?m\.?|wake|waking)\b/.test(h)) slots++;
  if (/\b(noon|lunch|midday|afternoon)\b/.test(h)) slots++;
  const evening = /\b(evening|supper|dinner|night|nightly|p\.?m\.?)\b/.test(h);
  const bed = /\b(bedtime|bed|sleep)\b/.test(h);
  if (evening) slots++;
  if (bed && !evening) slots++;
  if (slots === 1 && (bed || /\b(at night|nightly|every night|each night)\b/.test(h)) && !/\b(morning|breakfast|noon|lunch|afternoon|a\.?m\.?)\b/.test(h)) return "QHS";
  if (slots >= 4) return "other";
  if (slots === 3) return "TID";
  if (slots === 2) return "BID";
  if (slots === 1) return "QD";
  if (/\b(once a day|once daily|daily|every day|each day|a day|per day|qd|1x a day|once)\b/.test(h)) return "QD";
  return undefined;
}

// ---------------------------------------------------------------- status

const HELD_RE = /\b(paus|on hold|holding|hold off|held|put on hold|for now|for the time being|temporar|break from|taking a break|until (after|my|the|i|we|surgery|next|it|labs?|she|he|they|dr|doctor)|restart|resume|re-start|going back on|back on it|start again|starting again|off it for)/i;
const NOT_HELD_RE = /\b(not|never|no plans?|don'?t|won'?t|doesn'?t|isn'?t)\b[^.]{0,25}\b(restart|resume|going back|start again)/i;

// For an entry still marked 'taking', only an annotation that it is paused right now makes it held
// ("restarted in May" on a 'taking' entry means it is active again).
const TAKING_HELD_RE = /\b(paus|on hold|holding|hold off|held|put on hold|for now|for the time being|temporar|break from|taking a break|on a break|until (after|my|the|i|we|surgery|next|it|labs?|she|he|they|dr|doctor)|not taking|stopped (it )?(for|until|while)|off it (for|until|while))/i;
const TAKING_HELD_HOW_RE = /\b(paused|on hold|holding|not taking (it )?(now|right now|at the moment|currently)|stopped for now|taking a break)\b/i;

function looksHeld(text: string): boolean {
  return HELD_RE.test(text) && !NOT_HELD_RE.test(text);
}

function stopReason(note: string): MedicationRow["stop_reason"] | undefined {
  const n = note.toLowerCase();
  if (/side.?effects?|made me|gave me|caused|causing|rash|hives|itch|swell|allerg|reaction|cough|dizz|nause|vomit|stomach|diarrh|muscle (pain|ache)|aches|cramp|bleed|bruis|tired|fatigue|headache|couldn'?t tolerate|could not tolerate|didn'?t agree|low blood sugar|lows\b|hypo|too low|kidney|liver|yeast|infection|pancrea/.test(n)) return "adverse_reaction";
  if (/didn'?t work|did not work|not working|wasn'?t working|stopped working|no help|didn'?t help|did not help|no effect|no difference|not helping|ineffective/.test(n)) return "ineffective";
  if (/switch|replac|changed (me )?to|change(d)? (me )?over|instead|swapped|moved (me )?to|put me on|started .* in its place/.test(n)) return "therapy_changed";
  if (/finished|course|completed|ran out of the|done with the|all done/.test(n)) return "course_complete";
  if (/i decided|my choice|my decision|didn'?t want|don'?t want|chose to|on my own|didn'?t like|too expensive|cost|can'?t afford|couldn'?t afford|didn'?t think i needed/.test(n)) return "patient_choice";
  if (/\b(because|due to|since|as it|reason)\b/.test(n)) return "other";
  return undefined;
}

function partialDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (/^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/.test(t)) return t;
  return undefined;
}

// ---------------------------------------------------------------- medications

function buildMedications(list: FolioItem | undefined): MedicationRow[] {
  if (!list) return [];
  const byKey = new Map<string, MedicationRow>();
  const order: string[] = [];
  for (const [entryId, e] of entriesOf(list)) {
    if (e.type !== "my_med") continue;
    const name = typeof e.name === "string" ? e.name.trim() : "";
    const pfs = e.picked_from_search && typeof e.picked_from_search === "object" ? e.picked_from_search : null;
    const display = pfs && typeof pfs.display === "string" ? pfs.display : "";
    const fromDisplay = display ? ingredientFromDisplay(display) : null;
    const ingredient = fromDisplay?.ingredient || (name ? ingredientFromTyped(name) : undefined);
    const drugName = name || display;
    if (!drugName && !ingredient) continue;

    const note = typeof e.note === "string" ? e.note.trim() : "";
    const how = typeof e.how_i_take_it === "string" ? e.how_i_take_it.trim() : "";
    let status: MedicationRow["status"];
    if (e.status === "taking") status = (TAKING_HELD_RE.test(note) && !NOT_HELD_RE.test(note)) || TAKING_HELD_HOW_RE.test(how) ? "held" : "active";
    else if (e.status === "stopped") status = looksHeld(note) ? "held" : "stopped";
    else status = "unknown";

    const row: MedicationRow = { drug_name: drugName, status, patient_reported: true, evidence: [{ item_id: list.id, entry_id: entryId }] };
    if (ingredient) row.ingredient = ingredient;
    if (fromDisplay?.ingredientOnly && pfs && typeof pfs.rxnorm === "string" && /^\d+$/.test(pfs.rxnorm.trim())) {
      row.rxnorm_ingredient = pfs.rxnorm.trim();
    }
    let since: string | undefined;
    if (status === "active") since = partialDate(e.started);
    else if (status === "stopped") since = partialDate(e.stopped);
    else if (status === "held" && e.status === "stopped") since = partialDate(e.stopped);
    if (since) row.status_since = since;

    const dose = parseDose(e.strength_text, how);
    if (dose) row.dose = dose;
    const freq = parseFrequency(how);
    if (freq) row.frequency = freq;

    if (status === "stopped" && note) {
      const r = stopReason(note);
      if (r) row.stop_reason = r;
    }
    if ((status === "stopped" || status === "held") && note) row.status_reason_text = note;
    if (e.kind === "over_the_counter") row.otc = true;
    const sens = sensitivityOf(ingredient, `${drugName} ${display}`);
    if (sens) row.sensitivity = sens;

    const key = ingredient ? `i:${ingredient}` : `m:${typeof e.homelog_med_id === "string" ? e.homelog_med_id : entryId}`;
    const prev = byKey.get(key);
    if (!prev) { byKey.set(key, row); order.push(key); }
    else if (prev.status !== "active" && row.status === "active") {
      byKey.set(key, row); // same drug listed twice: prefer the entry the patient says they take
    }
  }
  return order.map(k => byKey.get(k)!);
}

// ---------------------------------------------------------------- vitals

type Reading = { row: VitalRow; device: boolean; t: number };

function buildVitals(pages: FolioItem[]): VitalRow[] {
  const bps: Reading[] = [];
  const glus: Reading[] = [];
  for (const page of pages) {
    for (const [entryId, e] of entriesOf(page)) {
      const ev: Evidence = [{ item_id: page.id, entry_id: entryId }];
      if (e.type === "bp_reading") {
        const t = wallTime(e.measured_at);
        const s = e.systolic_mmhg, d = e.diastolic_mmhg;
        if (!t || typeof s !== "number" || typeof d !== "number" || !isFinite(s) || !isFinite(d)) continue;
        const row: VitalRow = { setting: "home", local_time: t, systolic_mmhg: s, diastolic_mmhg: d, evidence: ev };
        if (typeof e.pulse_bpm === "number" && isFinite(e.pulse_bpm)) row.pulse_bpm = e.pulse_bpm;
        bps.push({ row, device: e.entry_method === "cuff_sync", t: minutesOf(t) });
      } else if (e.type === "glucose_reading") {
        const t = wallTime(e.measured_at);
        if (!t) continue;
        const unit = typeof e.unit === "string" ? e.unit.trim().toLowerCase() : "";
        const oor = e.out_of_range === "HI" || e.out_of_range === "LO" ? e.out_of_range : undefined;
        let mg: number;
        if (oor) mg = oor === "HI" ? 600 : 20;
        else {
          if (typeof e.value !== "number" || !isFinite(e.value)) continue;
          if (unit === "mg/dl") mg = Math.round(e.value);
          else if (unit === "mmol/l") mg = Math.round(e.value * 18.016);
          else continue;
        }
        const row: VitalRow = { setting: "home", local_time: t, glucose_mg_dl: mg, evidence: ev };
        if (oor) row.glucose_out_of_range = oor;
        glus.push({ row, device: e.entry_method === "meter_sync", t: minutesOf(t) });
      }
    }
  }
  const sameBp = (a: VitalRow, b: VitalRow) =>
    a.systolic_mmhg === b.systolic_mmhg && a.diastolic_mmhg === b.diastolic_mmhg &&
    (a.pulse_bpm === undefined || b.pulse_bpm === undefined || a.pulse_bpm === b.pulse_bpm);
  const sameGlu = (a: VitalRow, b: VitalRow) => a.glucose_mg_dl === b.glucose_mg_dl && a.glucose_out_of_range === b.glucose_out_of_range;
  const out = [...dedupe(bps, sameBp), ...dedupe(glus, sameGlu)];
  out.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 :
    (a.systolic_mmhg !== undefined ? 0 : 1) - (b.systolic_mmhg !== undefined ? 0 : 1)));
  return out;
}

/** Drops typed readings that duplicate a device reading taken within a few minutes with the same values. */
function dedupe(rs: Reading[], same: (a: VitalRow, b: VitalRow) => boolean): VitalRow[] {
  const devices = rs.filter(r => r.device);
  const used = new Set<Reading>();
  const out: VitalRow[] = [];
  for (const r of rs) {
    if (r.device) continue;
    const match = devices.find(d => !used.has(d) && isFinite(d.t) && isFinite(r.t) && Math.abs(r.t - d.t) <= 5 && same(d.row, r.row));
    if (match) {
      used.add(match);
      if (match.row.pulse_bpm === undefined && r.row.pulse_bpm !== undefined) { /* keep device values only */ }
      match.row.evidence = [...match.row.evidence, ...r.row.evidence];
      continue;
    }
    out.push(r.row);
  }
  for (const d of devices) out.push(d.row);
  return out;
}

// ---------------------------------------------------------------- entry point

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return rows;
  let current: FolioItem[];
  try {
    current = countingItems(items, asOf);
  } catch {
    return rows;
  }

  const lists: FolioItem[] = [];
  const pagesByDay = new Map<string, FolioItem>();
  for (const it of current) {
    try {
      if (isMedList(it)) { lists.push(it); continue; }
      // one current page per day: a later page for the same day restates it
      const day = typeof it.effective === "string" ? it.effective.slice(0, 10) : `?${it.id}`;
      pagesByDay.set(day, it); // `current` is sorted by recorded, so the latest wins
    } catch { /* skip */ }
  }

  try {
    // `current` is in recorded order; the last list is the latest save
    rows.medications = buildMedications(lists[lists.length - 1]);
  } catch { rows.medications = []; }
  try {
    rows.vitals = buildVitals(Array.from(pagesByDay.values()));
  } catch { rows.vitals = []; }
  return rows;
}
