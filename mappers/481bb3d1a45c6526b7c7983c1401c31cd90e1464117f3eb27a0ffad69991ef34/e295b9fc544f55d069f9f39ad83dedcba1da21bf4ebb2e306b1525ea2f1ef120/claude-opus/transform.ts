// HomeLog (patient diary app) -> US Core rows.
//
// HomeLog publishes day pages (home BP / glucose readings, dose logs, diary notes) and My Medicines
// list snapshots. Only the My Medicines list feeds a US Core view here: home readings are vitals,
// not laboratory results, and HomeLog has no lab results at all, so `observations` is always empty.
// Dose logs are not status events for a medicine and are not used.

import type { FolioItem, UsCoreRows, MedicationRequest, Quantity, CodeableConcept } from "../in/views/uscore";

const RXNORM = "http://www.nlm.nih.gov/research/umls/rxnorm";
const UCUM = "http://unitsofmeasure.org";
const STOP_REASON_SYSTEM = "urn:folio:stop-reason";
const TZ = "America/Chicago";

type Status = "active" | "held" | "stopped" | "unknown";
type Freq = "QD" | "BID" | "TID" | "QHS" | "QW" | "PRN" | "other";
type StopReason = "adverse_reaction" | "ineffective" | "therapy_changed" | "course_complete" | "patient_choice" | "other";
type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";

// ─── time ──────────────────────────────────────────────────────────────────────────────────────

function pad(n: number, w = 2): string {
  let s = String(n);
  while (s.length < w) s = "0" + s;
  return s;
}

/** Nth (1-based) Sunday of a month (0-based month), as a UTC day-of-month. */
function nthSunday(year: number, month: number, n: number): number {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  return 1 + ((7 - first) % 7) + (n - 1) * 7;
}

/** Fallback when Intl lacks time-zone data: US DST rules (2007+), Chicago UTC-6 / UTC-5. */
function chicagoDateManual(ms: number): string {
  const y = new Date(ms).getUTCFullYear();
  // DST starts 2:00 local standard (08:00 UTC) on 2nd Sunday of March, ends 2:00 local daylight (07:00 UTC) on 1st Sunday of November.
  const start = Date.UTC(y, 2, nthSunday(y, 2, 2), 8);
  const end = Date.UTC(y, 10, nthSunday(y, 10, 1), 7);
  const offH = ms >= start && ms < end ? -5 : -6;
  const d = new Date(ms + offH * 3600000);
  return `${pad(d.getUTCFullYear(), 4)}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

let chicagoFmt: Intl.DateTimeFormat | null | undefined;

function chicagoDate(ms: number): string {
  if (chicagoFmt === undefined) {
    try {
      chicagoFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
    } catch {
      chicagoFmt = null;
    }
  }
  if (chicagoFmt) {
    try {
      const parts = chicagoFmt.formatToParts(new Date(ms));
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
      const s = `${get("year")}-${get("month")}-${get("day")}`;
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    } catch {
      /* fall through */
    }
  }
  return chicagoDateManual(ms);
}

/** Parses an RFC 3339 instant; only accepts strings carrying an explicit offset or Z. */
function parseInstant(s: unknown): number | null {
  if (typeof s !== "string") return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i.test(s.trim())) return null;
  const ms = Date.parse(s.trim());
  return Number.isFinite(ms) ? ms : null;
}

function isPartialDate(s: unknown): s is string {
  if (typeof s !== "string") return false;
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(s);
  if (!m) return false;
  if (m[2] !== undefined && (+m[2] < 1 || +m[2] > 12)) return false;
  if (m[3] !== undefined && (+m[3] < 1 || +m[3] > 31)) return false;
  return true;
}

/** Comparable key for a partial date (missing parts sort as earliest). */
function dateKey(s: string | undefined): string {
  return s && isPartialDate(s) ? s : "";
}

// ─── correction rules / scope ──────────────────────────────────────────────────────────────────

function currentItems(items: FolioItem[], asOf: string): { item: FolioItem; recordedMs: number }[] {
  const inScope: { item: FolioItem; recordedMs: number }[] = [];
  for (const it of Array.isArray(items) ? items : []) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const ms = parseInstant(it.recorded);
    if (ms === null) continue;
    if (chicagoDate(ms) > asOf) continue;
    inScope.push({ item: it, recordedMs: ms });
  }
  const dead = new Set<string>();
  for (const { item } of inScope) {
    for (const key of ["supersedes", "retracts"] as const) {
      const ids = item[key];
      if (!Array.isArray(ids)) continue;
      for (const id of ids) if (typeof id === "string") dead.add(`${item.issuer}\u0000${id}`);
    }
  }
  return inScope.filter(({ item }) => !dead.has(`${item.issuer}\u0000${item.id}`));
}

function isMedList(item: FolioItem): boolean {
  const payload = item.payload && typeof item.payload === "object" ? item.payload : {};
  for (const k of Object.keys(payload)) {
    const e = payload[k];
    if (e && typeof e === "object" && e.type === "my_med") return true;
  }
  // An empty save of the list still restates it (as empty).
  return Object.keys(payload).length === 0 && typeof item.narrative === "string" && /^\s*My Medicines\b/i.test(item.narrative);
}

// ─── drug names ────────────────────────────────────────────────────────────────────────────────

/** Brand (and common alternative) names -> generic ingredient, lower case. */
const BRANDS: Record<string, string> = {
  // cardiovascular
  zestril: "lisinopril", prinivil: "lisinopril", qbrelis: "lisinopril",
  vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", accupril: "quinapril", mavik: "trandolapril",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan",
  atacand: "candesartan", edarbi: "azilsartan",
  norvasc: "amlodipine", katerzia: "amlodipine", procardia: "nifedipine", adalat: "nifedipine",
  cardizem: "diltiazem", tiazac: "diltiazem", calan: "verapamil", verelan: "verapamil",
  toprol: "metoprolol", "toprol xl": "metoprolol", "toprol-xl": "metoprolol", lopressor: "metoprolol",
  tenormin: "atenolol", coreg: "carvedilol", bystolic: "nebivolol", zebeta: "bisoprolol", inderal: "propranolol",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide",
  aldactone: "spironolactone", inspra: "eplerenone", hygroton: "chlorthalidone", thalitone: "chlorthalidone",
  catapres: "clonidine", apresoline: "hydralazine", entresto: "sacubitril / valsartan",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  livalo: "pitavastatin", mevacor: "lovastatin", zetia: "ezetimibe", tricor: "fenofibrate", lopid: "gemfibrozil",
  vascepa: "icosapent ethyl", lovaza: "omega-3-acid ethyl esters", repatha: "evolocumab", praluent: "alirocumab",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", jantoven: "warfarin", pradaxa: "dabigatran",
  plavix: "clopidogrel", brilinta: "ticagrelor", effient: "prasugrel", lanoxin: "digoxin", cordarone: "amiodarone",
  pacerone: "amiodarone", imdur: "isosorbide mononitrate", nitrostat: "nitroglycerin", ranexa: "ranolazine",
  // diabetes
  glucophage: "metformin", "glucophage xr": "metformin", glumetza: "metformin", fortamet: "metformin", riomet: "metformin",
  glucotrol: "glipizide", "glucotrol xl": "glipizide", amaryl: "glimepiride", diabeta: "glyburide", glynase: "glyburide",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", nesina: "alogliptin",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  actos: "pioglitazone", avandia: "rosiglitazone",
  trulicity: "dulaglutide", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", byetta: "exenatide", bydureon: "exenatide",
  mounjaro: "tirzepatide", zepbound: "tirzepatide",
  janumet: "metformin / sitagliptin", synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  rezvoglar: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", admelog: "insulin lispro", lyumjev: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  humulin: "insulin human", novolin: "insulin human", "humulin r": "insulin human", "humulin n": "insulin isophane",
  "novolin r": "insulin human", "novolin n": "insulin isophane",
  // thyroid / endocrine
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", euthyrox: "levothyroxine",
  tirosint: "levothyroxine", cytomel: "liothyronine", tapazole: "methimazole",
  fosamax: "alendronate", actonel: "risedronate", boniva: "ibandronate",
  // psych / neuro
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine",
  effexor: "venlafaxine", "effexor xr": "venlafaxine", cymbalta: "duloxetine", pristiq: "desvenlafaxine",
  wellbutrin: "bupropion", "wellbutrin xl": "bupropion", "wellbutrin sr": "bupropion", zyban: "bupropion",
  remeron: "mirtazapine", desyrel: "trazodone", elavil: "amitriptyline", pamelor: "nortriptyline",
  buspar: "buspirone", xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam",
  ambien: "zolpidem", seroquel: "quetiapine", abilify: "aripiprazole", risperdal: "risperidone", zyprexa: "olanzapine",
  lamictal: "lamotrigine", depakote: "divalproex", keppra: "levetiracetam", topamax: "topiramate", dilantin: "phenytoin",
  tegretol: "carbamazepine", neurontin: "gabapentin", gralise: "gabapentin", lyrica: "pregabalin",
  adderall: "amphetamine / dextroamphetamine", ritalin: "methylphenidate", concerta: "methylphenidate",
  aricept: "donepezil", namenda: "memantine", sinemet: "carbidopa / levodopa", requip: "ropinirole", mirapex: "pramipexole",
  imitrex: "sumatriptan", maxalt: "rizatriptan",
  // pain / OTC
  advil: "ibuprofen", motrin: "ibuprofen", "motrin ib": "ibuprofen", midol: "ibuprofen",
  aleve: "naproxen", naprosyn: "naproxen", anaprox: "naproxen",
  tylenol: "acetaminophen", "tylenol extra strength": "acetaminophen", paracetamol: "acetaminophen", panadol: "acetaminophen",
  bayer: "aspirin", ecotrin: "aspirin", "baby aspirin": "aspirin", bufferin: "aspirin", asa: "aspirin",
  celebrex: "celecoxib", mobic: "meloxicam", voltaren: "diclofenac", ultram: "tramadol",
  norco: "acetaminophen / hydrocodone", vicodin: "acetaminophen / hydrocodone", percocet: "acetaminophen / oxycodone",
  oxycontin: "oxycodone", flexeril: "cyclobenzaprine", robaxin: "methocarbamol", zanaflex: "tizanidine",
  // GI
  prilosec: "omeprazole", "prilosec otc": "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole",
  prevacid: "lansoprazole", aciphex: "rabeprazole", dexilant: "dexlansoprazole",
  pepcid: "famotidine", "pepcid ac": "famotidine", zantac: "ranitidine", "zantac 360": "famotidine",
  zofran: "ondansetron", reglan: "metoclopramide", imodium: "loperamide", miralax: "polyethylene glycol 3350",
  colace: "docusate", senokot: "senna", dulcolax: "bisacodyl", metamucil: "psyllium", tums: "calcium carbonate",
  // respiratory / allergy
  proair: "albuterol", ventolin: "albuterol", proventil: "albuterol", "proair hfa": "albuterol", "ventolin hfa": "albuterol",
  flovent: "fluticasone", flonase: "fluticasone", advair: "fluticasone / salmeterol", symbicort: "budesonide / formoterol",
  breo: "fluticasone furoate / vilanterol", spiriva: "tiotropium", singulair: "montelukast", pulmicort: "budesonide",
  claritin: "loratadine", zyrtec: "cetirizine", allegra: "fexofenadine", benadryl: "diphenhydramine", xyzal: "levocetirizine",
  sudafed: "pseudoephedrine", mucinex: "guaifenesin", nasonex: "mometasone",
  // GU / renal
  flomax: "tamsulosin", proscar: "finasteride", avodart: "dutasteride", detrol: "tolterodine", ditropan: "oxybutynin",
  myrbetriq: "mirabegron", viagra: "sildenafil", cialis: "tadalafil", kerendia: "finerenone",
  "k-dur": "potassium chloride", klor: "potassium chloride", "klor-con": "potassium chloride",
  renvela: "sevelamer", renagel: "sevelamer", phoslo: "calcium acetate", sensipar: "cinacalcet",
  // other
  zyloprim: "allopurinol", uloric: "febuxostat", colcrys: "colchicine", mitigare: "colchicine",
  plaquenil: "hydroxychloroquine", deltasone: "prednisone", medrol: "methylprednisolone",
  "vitamin d": "cholecalciferol", "vitamin d3": "cholecalciferol", "fish oil": "omega-3 fatty acids",
  "vitamin b12": "cyanocobalamin", "b12": "cyanocobalamin", "folic acid": "folic acid",
};

/** Generic names a patient may type as-is (lower case). Brand-map targets are added below. */
const GENERICS = new Set<string>([
  "metformin", "lisinopril", "losartan", "amlodipine", "atorvastatin", "rosuvastatin", "simvastatin", "pravastatin",
  "glipizide", "glimepiride", "glyburide", "sitagliptin", "empagliflozin", "dapagliflozin", "canagliflozin",
  "dulaglutide", "semaglutide", "liraglutide", "tirzepatide", "pioglitazone", "insulin", "insulin glargine",
  "insulin lispro", "insulin aspart", "insulin detemir", "insulin degludec", "levothyroxine", "sertraline",
  "fluoxetine", "escitalopram", "citalopram", "bupropion", "trazodone", "gabapentin", "pregabalin",
  "hydrochlorothiazide", "chlorthalidone", "furosemide", "spironolactone", "carvedilol", "metoprolol", "atenolol",
  "valsartan", "olmesartan", "irbesartan", "telmisartan", "enalapril", "ramipril", "benazepril", "diltiazem",
  "nifedipine", "hydralazine", "clonidine", "apixaban", "rivaroxaban", "warfarin", "clopidogrel", "aspirin",
  "ibuprofen", "naproxen", "acetaminophen", "omeprazole", "pantoprazole", "esomeprazole", "famotidine",
  "albuterol", "montelukast", "loratadine", "cetirizine", "fexofenadine", "diphenhydramine", "allopurinol",
  "colchicine", "prednisone", "tamsulosin", "finasteride", "ezetimibe", "fenofibrate", "meloxicam", "tramadol",
  "cyclobenzaprine", "duloxetine", "venlafaxine", "mirtazapine", "alprazolam", "lorazepam", "clonazepam",
  "zolpidem", "quetiapine", "lamotrigine", "levetiracetam", "topiramate", "donepezil", "potassium chloride",
  "magnesium oxide", "calcium carbonate", "cholecalciferol", "ergocalciferol", "cyanocobalamin", "folic acid",
  "ferrous sulfate", "melatonin", "docusate", "senna", "bisacodyl", "polyethylene glycol 3350", "loperamide",
  "ondansetron", "sumatriptan", "oxybutynin", "sildenafil", "tadalafil", "finerenone", "bumetanide", "torsemide",
  "isosorbide mononitrate", "nitroglycerin", "digoxin", "amiodarone", "eplerenone", "sacubitril / valsartan",
  "linagliptin", "saxagliptin", "alogliptin", "exenatide", "liothyronine", "methimazole", "alendronate",
  "celecoxib", "diclofenac", "hydroxychloroquine", "methylprednisolone", "febuxostat", "sevelamer", "budesonide",
  "fluticasone", "tiotropium", "guaifenesin", "pseudoephedrine", "propranolol", "bisoprolol", "nebivolol", "verapamil",
  "lovastatin", "pitavastatin", "gemfibrozil", "icosapent ethyl", "ticagrelor", "prasugrel", "dabigatran", "ranolazine",
  "paroxetine", "amitriptyline", "nortriptyline", "buspirone", "aripiprazole", "risperidone", "olanzapine",
  "carbamazepine", "phenytoin", "divalproex", "memantine", "ropinirole", "pramipexole", "rizatriptan",
  "metoclopramide", "psyllium", "mometasone", "dutasteride", "tolterodine", "mirabegron", "cinacalcet",
  "calcium acetate", "candesartan", "azilsartan", "quinapril", "trandolapril", "glyburide", "insulin human",
  "insulin isophane", "insulin glulisine", "ertugliflozin", "rosiglitazone", "evolocumab", "alirocumab",
]);
for (const v of Object.values(BRANDS)) GENERICS.add(v);

/** Salt / ester words RxNorm keeps in product names but not in the ingredient. */
const SALTS = new Set<string>([
  "potassium", "sodium", "hydrochloride", "hcl", "hydrobromide", "calcium", "magnesium", "maleate", "besylate",
  "mesylate", "succinate", "tartrate", "citrate", "sulfate", "fumarate", "acetate", "phosphate", "bitartrate",
  "monohydrate", "dihydrate", "trihydrate", "anhydrous", "propionate", "furoate", "bromide", "chloride",
  "dipropionate", "xinafoate", "valerate", "hyclate", "disodium", "medoxomil", "cilexetil", "carbonate",
  "lactate", "gluconate", "oxide", "erbumine", "axetil", "pamoate", "napsylate", "estolate", "trometamol",
  "tromethamine", "dimesylate", "propanediol", "free", "base",
]);

/** Ingredients whose "salt" word is part of the drug's identity. */
const KEEP_WHOLE = new Set<string>([
  "potassium chloride", "calcium carbonate", "calcium acetate", "magnesium oxide", "ferrous sulfate",
  "sodium bicarbonate", "sodium chloride", "magnesium citrate", "calcium citrate", "zinc sulfate", "zinc oxide",
  "isosorbide mononitrate", "isosorbide dinitrate", "levothyroxine", "fluticasone furoate", "lanthanum carbonate",
  "sevelamer carbonate", "omega-3-acid ethyl esters", "icosapent ethyl", "magnesium hydroxide", "aluminum hydroxide",
]);

function stripSalts(name: string): string {
  const n = name.trim().toLowerCase().replace(/\s+/g, " ");
  if (KEEP_WHOLE.has(n)) return n;
  // Keep "fluticasone furoate / vilanterol" style but strip salts per component.
  const parts = n.split(/\s*\/\s*/).map((p) => {
    if (KEEP_WHOLE.has(p)) return p;
    const words = p.split(" ").filter((w) => w.length > 0);
    const kept = words.filter((w) => !SALTS.has(w));
    return kept.length > 0 ? kept.join(" ") : p;
  });
  if (n === "sevelamer carbonate") return "sevelamer";
  return parts.join(" / ");
}

/** Ingredient from an RxNorm display ("losartan potassium 100 MG Oral Tablet" -> "losartan"). */
function ingredientFromRxDisplay(display: string): string | undefined {
  let s = display.replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ").trim();
  s = s.replace(/^\d+\s*(HR|Hour|Day)\b\s*/i, "");
  // Product names: ingredient(s) + strength + form; components joined by " / ".
  const comps = s.split(/\s+\/\s+/).map((c) => {
    const m = /^(.*?)(?:\s+\d[\d.,]*\s*(?:MG|MCG|UNT|ML|MEQ|%|G|IU|UNITS?|ACTUAT|HR)\b.*)?$/i.exec(c.trim());
    let base = (m ? m[1] : c).trim();
    // Strip trailing dose-form words in ingredient-plus-form concepts ("metformin Oral Tablet").
    base = base.replace(/\s+(Oral|Topical|Injectable|Prefilled|Pen|Injector|Extended|Delayed|Release|Tablet|Capsule|Solution|Suspension|Inhalant|Inhaler|Nasal|Spray|Chewable|Disintegrating|Auto-Injector|Cartridge|Product|Pill)\b.*$/i, "");
    return base.trim();
  });
  const joined = comps.filter((c) => c.length > 0 && !/^\d/.test(c)).join(" / ").toLowerCase();
  return joined ? stripSalts(joined) : undefined;
}

/** Ingredient from what the patient typed, if it names a known drug. */
function ingredientFromTypedName(name: string): string | undefined {
  let s = name.toLowerCase().replace(/[®™]/g, "").replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  const tryKey = (k: string): string | undefined => {
    k = k.trim();
    if (!k) return undefined;
    if (BRANDS[k] !== undefined) return BRANDS[k];
    if (GENERICS.has(k)) return k;
    const stripped = stripSalts(k);
    if (GENERICS.has(stripped)) return stripped;
    return undefined;
  };
  const direct = tryKey(s);
  if (direct) return direct;
  // Drop strength and trailing form words ("Metformin 500mg tablets", "Toprol XL").
  s = s.replace(/\b\d[\d.,]*\s*(mg|mcg|ug|units?|iu|ml|%)?\b.*$/, "").trim();
  s = s.replace(/\b(tablets?|tabs?|pills?|capsules?|caps?|pen|injection|inhaler|er|xr|xl|sr|cr|dr|ec|od)\b/g, " ").replace(/\s+/g, " ").trim();
  const r = tryKey(s);
  if (r) return r;
  // A single-word brand followed by other words ("Lantus Solostar").
  const first = s.split(" ")[0];
  if (first && BRANDS[first] !== undefined) return BRANDS[first];
  return undefined;
}

function looksHospitalOnly(text: string): boolean {
  return /\b(infusion|intravenous|i\.v\.|iv drip|iv fluids?|iv bag)\b/i.test(text);
}

// ─── sig parsing ───────────────────────────────────────────────────────────────────────────────

const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5, "a half": 0.5 };

function num(s: string): number {
  const w = WORD_NUM[s.toLowerCase()];
  if (w !== undefined) return w;
  if (/^\d+\/\d+$/.test(s)) {
    const [a, b] = s.split("/").map(Number);
    return b ? a / b : NaN;
  }
  return Number(s.replace(",", "."));
}

const NUM_RE = "(\\d+(?:[.,]\\d+)?|\\d+/\\d+|one|two|three|four|half)";

function normUnit(u: string): DoseUnit | null {
  const x = u.toLowerCase();
  if (x === "mg" || x === "milligram" || x === "milligrams") return "mg";
  if (x === "mcg" || x === "ug" || x === "µg" || x === "microgram" || x === "micrograms") return "mcg";
  if (/^(units?|u|iu|unt)$/.test(x)) return "units";
  if (x === "ml") return "mL";
  if (/^(tablets?|tabs?|pills?|capsules?|caps?)$/.test(x)) return "tablet";
  return null;
}

/** Explicit amount in the patient's "how I take it" text; null if none, "multi" if ambiguous. */
function doseFromSig(sig: string, tabletForm: boolean): { value: number; unit: DoseUnit } | null | "multi" {
  const s = sig.toLowerCase();
  // Ranges and alternatives ("1 or 2", "1-2 tablets", "10 to 12 units") are not a single amount.
  if (new RegExp(`${NUM_RE}\\s*(?:-|–|or|to)\\s*${NUM_RE}\\b`).test(s) && !/\d{1,2}:\d{2}/.test(s)) return "multi";
  const unitRe = new RegExp(`(?:^|[^\\w.])${NUM_RE}\\s*(mg|mcg|ug|µg|milligrams?|micrograms?|units?|iu|u|ml|tablets?|tabs?|pills?|capsules?|caps?|puffs?|sprays?|drops?)(?![\\w])`, "g");
  const found: { value: number; unit: DoseUnit | null }[] = [];
  let m: RegExpExecArray | null;
  while ((m = unitRe.exec(s)) !== null) found.push({ value: num(m[1]), unit: normUnit(m[2]) });
  if (found.length > 0) {
    const distinct = new Set(found.map((f) => `${f.value}|${f.unit}`));
    if (distinct.size > 1) return "multi"; // e.g. "10 units morning, 6 units night"
    const f = found[0];
    if (f.unit === null || !Number.isFinite(f.value) || f.value <= 0) return "multi"; // puffs, drops: no allowed unit
    return { value: f.value, unit: f.unit };
  }
  // A bare leading count ("2 when my back hurts") on a tablet/capsule product means that many tablets.
  const bare = /^\s*(\d+(?:\.\d+)?|one|two|three|four|half)\b(?!\s*(?:x\b|times|am\b|pm\b|a\.m|p\.m|:|o'?clock|hours?|hrs?|days?|weeks?|%))/.exec(s);
  if (bare && tabletForm) {
    const v = num(bare[1]);
    if (Number.isFinite(v) && v > 0 && v <= 10) return { value: v, unit: "tablet" };
  }
  return null;
}

function frequencyFromSig(sig: string): Freq | undefined {
  const s = sig.toLowerCase();
  if (/\b(as needed|as-needed|when needed|if needed|prn|p\.r\.n|when (?:i|my|it|the)\b|if (?:i|my)\b|as required|sometimes|occasionally|now and then|only when)\b/.test(s)) return "PRN";
  if (/\b(a|per|each|every|1|one)\s*(times?\s*(a|per)\s*)?weeks?\b|\bweekly\b|\bonce a week\b|\bevery (sunday|monday|tuesday|wednesday|thursday|friday|saturday)s?\b|\bon (sunday|monday|tuesday|wednesday|thursday|friday|saturday)s\b/.test(s)) {
    if (/\b(twice|two times|2 times|2x|three times|3 times|3x)\b/.test(s)) return "other";
    return "QW";
  }
  if (new RegExp(`${NUM_RE}\\s*(?:-|–|or|to)\\s*${NUM_RE}\\s*(?:x\\b|times|a day|per day|daily|a week)`).test(s)) return "other";
  if (/\b(every other day|every 2 days|alternate days|monthly|a month|every \d+ (days|weeks|hours)|every few|a few times|times a week|days a week)\b/.test(s)) return "other";
  if (/\b(four times|4 times|qid|4x)\b/.test(s)) return "other";
  if (/\b(three times|3 times|tid|3x|with (each|every) meal|with meals)\b/.test(s)) return "TID";
  if (/\b(twice|two times|2 times|bid|2x|every 12 hours|every twelve hours)\b/.test(s)) return "BID";
  if (/\b(once a day|once daily|one time a day|1 time a day|daily|every day|a day|per day|qd|every 24 hours)\b/.test(s)) {
    if (/\b(bedtime|at night|before bed|nightly|hs)\b/.test(s)) return "QHS";
    return "QD";
  }
  // Time-of-day words: one slot = once daily, two = twice, three = three times.
  const slots = new Set<string>();
  if (/\b(morning|mornings|breakfast|am|a\.m\.|wake|waking|get up)\b/.test(s)) slots.add("am");
  if (/\b(noon|lunch|lunchtime|midday|afternoon)\b/.test(s)) slots.add("noon");
  if (/\b(evening|evenings|supper|dinner|pm|p\.m\.)\b/.test(s)) slots.add("pm");
  if (/\b(bedtime|bed time|at night|night|nightly|before bed|go to bed|hs)\b/.test(s)) slots.add("bed");
  if (slots.size === 1) return slots.has("bed") ? "QHS" : "QD";
  if (slots.size === 2) return "BID";
  if (slots.size === 3) return "TID";
  if (slots.size >= 4) return "other";
  if (/\bnightly\b/.test(s)) return "QHS";
  return undefined;
}

// ─── status / reasons from the patient's note ──────────────────────────────────────────────────

function noteSaysHeld(note: string): boolean {
  const s = note.toLowerCase();
  if (/\b(restart(ed)?|resum(ed|e)|back on|started again|taking again)\b/.test(s) && !/\b(until|then restart|will restart|to restart|before restart)\b/.test(s)) return false;
  return /\b(paused?|pausing|on hold|holding|hold (it|off|until|for)|held|told to hold|stop(ped)? (it )?(for now|until|temporarily|for a (few|couple))|off (it )?(until|for now|for a)|temporar(y|ily)|for now|break from|until (after|my|the|surgery|procedure|i see)|will restart|to restart|can restart|restart after|resume after|skip(ping)? (it )?(until|for now))\b/.test(s);
}

function stopReasonFromNote(note: string): StopReason | undefined {
  const s = note.toLowerCase();
  if (/\b(cough|rash|hives|itch\w*|swell\w*|dizz\w*|lighthead\w*|nause\w*|vomit\w*|diarrh\w*|constipat\w*|stomach|upset|cramp\w*|side effects?|reaction|allerg\w*|made me|makes me|gave me|bleed\w*|bruis\w*|headaches?|muscle (pain|ache)s?|aches?|tired|fatigue|low (blood )?sugars?|hypo\w*|yeast|infection|kidney|potassium (was |too )?high|angioedema|faint\w*|palpitations?|insomnia|couldn'?t sleep|weight gain|sweat\w*|gas|bloat\w*|heartburn|tremor|shak\w*|anxious|jittery|sick)\b/.test(s)) return "adverse_reaction";
  if (/\b(didn'?t work|did not work|not working|wasn'?t working|stopped working|no help|didn'?t help|did not help|not helping|ineffective|no effect|not enough|wasn'?t enough)\b/.test(s)) return "ineffective";
  if (/\b(switch(ed)?|changed to|change to|replaced|instead|swapped|moved to|put me on|now on|replacing)\b/.test(s)) return "therapy_changed";
  if (/\b(finished|completed|course (done|over|finished)|done with (the )?course|ran its course|all done|no longer needed|healed|cleared up|better now)\b/.test(s)) return "course_complete";
  if (/\b(my choice|my decision|i decided|decided to stop|didn'?t want|did not want|don'?t want|chose to|i quit|i stopped it myself|on my own|too expensive|cost|couldn'?t afford|can'?t afford)\b/.test(s)) return "patient_choice";
  return undefined;
}

// ─── mapping ───────────────────────────────────────────────────────────────────────────────────

interface Candidate {
  itemId: string;
  entryId: string;
  order: number;
  patient: string;
  medId: string;
  name: string;
  ingredient?: string;
  rx?: { code: string; display: string; ingredientLevel: boolean };
  status: Status;
  statusSince?: string;
  started?: string;
  dose?: { value: number; unit: DoseUnit };
  frequency?: Freq;
  sig?: string;
  stopReason?: StopReason;
  reasonText?: string;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined;
}

function buildCandidate(item: FolioItem, entryId: string, e: any, order: number): Candidate | null {
  if (!e || typeof e !== "object" || e.type !== "my_med") return null;
  const name = str(e.name);
  const pick = e.picked_from_search && typeof e.picked_from_search === "object" ? e.picked_from_search : undefined;
  const rxCode = pick && typeof pick.rxnorm === "string" && /^\d+$/.test(pick.rxnorm.trim()) ? pick.rxnorm.trim() : undefined;
  const rxDisplay = pick ? str(pick.display) : undefined;
  const drugName = name ?? rxDisplay;
  if (!drugName) return null;
  if (looksHospitalOnly(`${name ?? ""} ${rxDisplay ?? ""} ${str(e.strength_text) ?? ""}`)) return null;

  // Ingredient: from the linked RxNorm concept when there is one, else from the name the patient typed.
  let ingredient: string | undefined;
  if (rxDisplay) {
    const fromRx = ingredientFromRxDisplay(rxDisplay);
    if (fromRx) ingredient = BRANDS[fromRx] ?? fromRx;
  }
  if (!ingredient && name) ingredient = ingredientFromTypedName(name);
  if (!ingredient && rxDisplay) ingredient = ingredientFromTypedName(rxDisplay);

  // An ingredient-level concept has no strength or form in its name.
  const ingredientLevel = !!rxDisplay && !/\d/.test(rxDisplay) && !/\b(oral|tablet|capsule|injection|injector|pen|solution|suspension|inhaler|inhalant|spray|cream|ointment|patch|topical|product|pill)\b/i.test(rxDisplay);
  const rx = rxCode ? { code: rxCode, display: rxDisplay ?? drugName, ingredientLevel } : undefined;

  const note = str(e.note);
  let status: Status;
  if (e.status === "taking") status = note && noteSaysHeld(note) ? "held" : "active";
  else if (e.status === "stopped") status = note && noteSaysHeld(note) ? "held" : "stopped";
  else status = "unknown";

  const started = isPartialDate(e.started) ? e.started : undefined;
  const stopped = isPartialDate(e.stopped) ? e.stopped : undefined;
  let statusSince: string | undefined;
  if (status === "active") statusSince = started;
  else if (status === "stopped") statusSince = stopped;
  else if (status === "held") statusSince = e.status === "stopped" ? stopped : undefined;

  const sig = str(e.how_i_take_it);
  const strength = str(e.strength_text);
  const tabletForm =
    (!!rxDisplay && /\b(tablet|capsule|caplet)\b/i.test(rxDisplay)) ||
    (!!strength && /\b(tablets?|tabs?|pills?|capsules?|caps?)\b/i.test(strength)) ||
    (!!name && /\b(tablets?|tabs?|pills?|capsules?)\b/i.test(name));
  // The amount comes only from what the patient says they take; `strength_text` is the product's
  // strength (per tablet, per mL, per pen), not an amount per dose.
  let dose: { value: number; unit: DoseUnit } | undefined;
  const fromSig = sig ? doseFromSig(sig, tabletForm) : null;
  if (fromSig && fromSig !== "multi") dose = fromSig;

  const frequency = sig ? frequencyFromSig(sig) : undefined;

  let stopReason: StopReason | undefined;
  let reasonText: string | undefined;
  if (status === "stopped" || status === "held") {
    reasonText = note;
    if (status === "stopped" && note) stopReason = stopReasonFromNote(note);
  }

  return {
    itemId: item.id,
    entryId,
    order,
    patient: typeof item.patient === "string" ? item.patient : "",
    medId: str(e.homelog_med_id) ?? entryId,
    name: drugName,
    ingredient,
    rx,
    status,
    statusSince,
    started,
    dose,
    frequency,
    sig,
    stopReason,
    reasonText,
  };
}

/** Rank for choosing among several list lines for one ingredient: ongoing beats ended, then latest event. */
function candidateRank(c: Candidate): [number, string, number] {
  const ongoing = c.status === "active" || c.status === "unknown" ? 1 : 0;
  const latestEvent = c.status === "active" ? dateKey(c.started) : dateKey(c.statusSince) || dateKey(c.started);
  return [ongoing, latestEvent, -c.order];
}

function better(a: Candidate, b: Candidate): boolean {
  const ra = candidateRank(a);
  const rb = candidateRank(b);
  for (let i = 0; i < ra.length; i++) {
    if (ra[i] > rb[i]) return true;
    if (ra[i] < rb[i]) return false;
  }
  return false;
}

function safeId(s: string): string {
  let id = s.replace(/[^A-Za-z0-9.-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!id) id = "med";
  return id.slice(0, 64);
}

const UCUM_CODE: Record<DoseUnit, string> = { mg: "mg", mcg: "ug", units: "[iU]", mL: "mL", tablet: "{tbl}" };

function toFhir(c: Candidate, usedIds: Set<string>): MedicationRequest {
  let base = safeId(`homelog-${c.patient}-${c.medId}`);
  let id = base;
  for (let n = 2; usedIds.has(id); n++) id = `${base.slice(0, 60)}-${n}`;
  usedIds.add(id);

  const med: CodeableConcept = {};
  if (c.rx) {
    med.coding = [{ system: RXNORM, code: c.rx.code, display: c.rx.ingredientLevel && c.ingredient ? c.ingredient : c.rx.display }];
    med.text = c.name;
  } else {
    med.text = c.ingredient ? `${c.name} (${c.ingredient})` : c.name;
  }

  const mr: MedicationRequest = {
    resourceType: "MedicationRequest",
    id,
    meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
    status: c.status === "held" ? "on-hold" : c.status,
    intent: "plan",
    reportedBoolean: true,
    medicationCodeableConcept: med,
    subject: { reference: `Patient/${c.patient}` },
  };

  if ((c.status === "stopped" || c.status === "held") && (c.reasonText || c.stopReason)) {
    const reason: CodeableConcept = {};
    if (c.stopReason && c.status === "stopped") reason.coding = [{ system: STOP_REASON_SYSTEM, code: c.stopReason }];
    if (c.reasonText) reason.text = c.reasonText;
    mr.statusReason = [reason];
  }

  const authored = c.status === "active" ? c.statusSince ?? c.started : c.started;
  if (authored) mr.authoredOn = authored;

  if (c.sig || c.frequency || c.dose) {
    const di: NonNullable<MedicationRequest["dosageInstruction"]>[number] = {};
    if (c.sig) di.text = c.sig;
    if (c.frequency) di.timing = { code: { text: c.frequency } };
    if (c.dose) {
      const q: Quantity = { value: c.dose.value, unit: c.dose.unit, system: UCUM, code: UCUM_CODE[c.dose.unit] };
      di.doseAndRate = [{ doseQuantity: q }];
    }
    mr.dosageInstruction = [di];
  }
  return mr;
}

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const out: UsCoreRows = { medicationRequests: [], observations: [] };
  try {
    if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return out;
    const current = currentItems(items, asOf);

    // The latest current My Medicines save is the patient's list.
    const lists = current.filter(({ item }) => isMedList(item));
    if (lists.length === 0) return out;
    lists.sort((a, b) =>
      b.recordedMs - a.recordedMs ||
      (String(b.item.effective ?? "") > String(a.item.effective ?? "") ? 1 : String(b.item.effective ?? "") < String(a.item.effective ?? "") ? -1 : 0) ||
      (b.item.id > a.item.id ? 1 : b.item.id < a.item.id ? -1 : 0),
    );
    const list = lists[0].item;
    const payload = list.payload && typeof list.payload === "object" ? list.payload : {};

    // One row per ingredient (unknown ingredient: one per list line).
    const byKey = new Map<string, Candidate>();
    const keyOrder: string[] = [];
    let order = 0;
    for (const entryId of Object.keys(payload)) {
      let c: Candidate | null = null;
      try {
        c = buildCandidate(list, entryId, payload[entryId], order++);
      } catch {
        c = null;
      }
      if (!c) continue;
      const key = c.ingredient ? `ing:${c.ingredient}` : `line:${c.medId}:${entryId}`;
      const prev = byKey.get(key);
      if (!prev) {
        byKey.set(key, c);
        keyOrder.push(key);
      } else if (better(c, prev)) {
        byKey.set(key, c);
      }
    }

    const usedIds = new Set<string>();
    for (const key of keyOrder) {
      const c = byKey.get(key);
      if (!c) continue;
      try {
        out.medicationRequests.push(toFhir(c, usedIds));
      } catch {
        /* skip what cannot be written */
      }
    }
  } catch {
    return { medicationRequests: [], observations: [] };
  }
  return out;
}
