import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  VitalRow,
  Evidence,
  Sensitivity,
} from "../in/views/views";

// HomeLog (patient-kept app): home BP / glucose readings, dose logs, diary notes and the patient's own
// "My Medicines" list. The medicine list is published as full snapshots ("My Medicines, saved …").
// Dose logs and diary notes do not produce rows in any view.

const TZ = "America/Chicago";

// ---------------------------------------------------------------- time helpers

const dtf = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function hasZone(s: string): boolean {
  return /(Z|[+-]\d{2}:?\d{2})$/i.test(s.trim());
}

/** Local wall-clock parts "YYYY-MM-DDTHH:MM:SS" for an instant. */
function localParts(ms: number): string {
  const p: Record<string, string> = {};
  for (const x of dtf.formatToParts(new Date(ms))) p[x.type] = x.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}

/** Local wall-clock "YYYY-MM-DDTHH:MM[:SS]" for a date-time string, or undefined. */
function toLocal(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (hasZone(t)) {
    const ms = Date.parse(t);
    if (!Number.isFinite(ms)) return undefined;
    return localParts(ms);
  }
  const m = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(t);
  if (!m) return undefined;
  return `${m[1]}T${m[2] ?? "00"}:${m[3] ?? "00"}:${m[4] ?? "00"}`;
}

/** Sortable key for an instant; local times (no zone) are treated as Chicago wall clock (approximate). */
function instantKey(s: unknown): number {
  if (typeof s !== "string") return NaN;
  const t = s.trim();
  if (hasZone(t)) return Date.parse(t);
  const l = toLocal(t);
  if (!l) return NaN;
  // Approximate: treat as UTC-6. Only used for ordering/near-duplicate detection.
  return Date.parse(l + "-06:00");
}

/** Partial local date with the source's precision. */
function partialDate(s: unknown): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (/^\d{4}$/.test(t)) return { value: t, precision: "year" };
  if (/^\d{4}-\d{2}$/.test(t)) return { value: t, precision: "month" };
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return { value: t, precision: "day" };
  if (/^\d{4}-\d{2}-\d{2}[T ]/.test(t)) {
    const l = toLocal(t);
    if (l) return { value: l.slice(0, 10), precision: "day" };
  }
  return undefined;
}

// ---------------------------------------------------------------- item selection

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inTime = items.filter((it) => {
    if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
    const l = toLocal(it.recorded);
    if (!l) return false;
    return l.slice(0, 10) <= asOf;
  });
  const byId = new Map<string, FolioItem>();
  for (const it of inTime) byId.set(it.id, it);

  // Retractions: a retracting item that is itself retracted has no effect. Iterate to a fixed point.
  let retracted = new Set<string>();
  for (let i = 0; i < 20; i++) {
    const next = new Set<string>();
    for (const it of inTime) {
      if (retracted.has(it.id)) continue;
      for (const r of arr(it.retracts)) if (typeof r === "string" && r !== it.id) next.add(r);
    }
    if (sameSet(next, retracted)) break;
    retracted = next;
  }
  const alive = inTime.filter((it) => !retracted.has(it.id));
  const superseded = new Set<string>();
  for (const it of alive) for (const s of arr(it.supersedes)) if (typeof s === "string" && s !== it.id) superseded.add(s);
  return alive.filter((it) => !superseded.has(it.id));
}

function arr(x: unknown): unknown[] {
  return Array.isArray(x) ? x : [];
}

function sameSet(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

function entries(it: FolioItem): [string, any][] {
  const p = it.payload;
  if (!p || typeof p !== "object" || Array.isArray(p)) return [];
  return Object.keys(p)
    .sort()
    .map((k) => [k, p[k]] as [string, any])
    .filter(([, v]) => v && typeof v === "object");
}

function compareItems(a: FolioItem, b: FolioItem): number {
  const ra = instantKey(a.recorded), rb = instantKey(b.recorded);
  if (ra !== rb) return (Number.isFinite(ra) ? ra : -Infinity) - (Number.isFinite(rb) ? rb : -Infinity) || 0;
  const ea = String(a.effective ?? ""), eb = String(b.effective ?? "");
  if (ea !== eb) return ea < eb ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

// ---------------------------------------------------------------- vitals

const MMOL_TO_MGDL = 18.016;

interface VitalCand {
  row: VitalRow;
  t: number;
  device: boolean;
  kind: "bp" | "glu";
  sig: string;
}

function isNum(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

function glucoseMgDl(value: number, unit: unknown): number {
  let mmol = unit === "mmol/L";
  // A meter set to the other unit: values impossible in the stated unit are read in the other one.
  if (!mmol && (value < 20 || (value < 35 && !Number.isInteger(value)))) mmol = true;
  else if (mmol && value > 40) mmol = false;
  return Math.round(mmol ? value * MMOL_TO_MGDL : value);
}

function vitals(items: FolioItem[]): VitalRow[] {
  const cands: VitalCand[] = [];
  for (const it of items) {
    for (const [k, e] of entries(it)) {
      if (e.type === "bp_reading") {
        const local = toLocal(e.measured_at);
        if (!local) continue;
        if (!isNum(e.systolic_mmhg) && !isNum(e.diastolic_mmhg) && !isNum(e.pulse_bpm)) continue;
        const row: VitalRow = { setting: "home", local_time: local.slice(0, 16), evidence: [{ item_id: it.id, entry_id: k }] };
        if (isNum(e.systolic_mmhg)) row.systolic_mmhg = e.systolic_mmhg;
        if (isNum(e.diastolic_mmhg)) row.diastolic_mmhg = e.diastolic_mmhg;
        if (isNum(e.pulse_bpm)) row.pulse_bpm = e.pulse_bpm;
        cands.push({
          row,
          t: instantKey(e.measured_at),
          device: e.entry_method !== "typed",
          kind: "bp",
          sig: `${row.systolic_mmhg}/${row.diastolic_mmhg}`,
        });
      } else if (e.type === "glucose_reading") {
        const local = toLocal(e.measured_at);
        if (!local) continue;
        const oor = e.out_of_range === "HI" || e.out_of_range === "LO" ? (e.out_of_range as "HI" | "LO") : undefined;
        let mg: number | undefined;
        if (isNum(e.value)) mg = glucoseMgDl(e.value, e.unit);
        else if (oor) mg = oor === "HI" ? 600 : 20;
        if (mg === undefined) continue;
        const row: VitalRow = { setting: "home", local_time: local.slice(0, 16), glucose_mg_dl: mg, evidence: [{ item_id: it.id, entry_id: k }] };
        if (oor) row.glucose_out_of_range = oor;
        cands.push({ row, t: instantKey(e.measured_at), device: e.entry_method !== "typed", kind: "glu", sig: `${mg}/${oor ?? ""}` });
      }
    }
  }

  // Merge duplicates: exact repeats of the same reading, and typed copies of a device reading taken within a
  // few minutes with the same values (prefer the device copy).
  cands.sort((a, b) => (a.device === b.device ? a.t - b.t : a.device ? -1 : 1));
  const kept: VitalCand[] = [];
  for (const c of cands) {
    const dup = kept.find(
      (k) =>
        k.kind === c.kind &&
        k.sig === c.sig &&
        (k.row.local_time === c.row.local_time ||
          (Number.isFinite(k.t) && Number.isFinite(c.t) && Math.abs(k.t - c.t) <= 5 * 60000 && k.device !== c.device)) &&
        (c.kind !== "bp" || k.row.pulse_bpm === undefined || c.row.pulse_bpm === undefined || k.row.pulse_bpm === c.row.pulse_bpm),
    );
    if (dup) {
      for (const ev of c.row.evidence)
        if (!dup.row.evidence.some((x) => x.item_id === ev.item_id && x.entry_id === ev.entry_id)) dup.row.evidence.push(ev);
      if (dup.row.pulse_bpm === undefined && c.row.pulse_bpm !== undefined) dup.row.pulse_bpm = c.row.pulse_bpm;
    } else kept.push(c);
  }
  kept.sort((a, b) =>
    a.row.local_time !== b.row.local_time ? (a.row.local_time < b.row.local_time ? -1 : 1) : a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : 0,
  );
  return kept.map((k) => k.row);
}

// ---------------------------------------------------------------- medications

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  "glucophage xr": "metformin", glumetza: "metformin", fortamet: "metformin", crestor: "rosuvastatin",
  lipitor: "atorvastatin", zocor: "simvastatin", pravachol: "pravastatin", mevacor: "lovastatin",
  livalo: "pitavastatin", synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine",
  euthyrox: "levothyroxine", tirosint: "levothyroxine", cytomel: "liothyronine", farxiga: "dapagliflozin",
  jardiance: "empagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin", glucotrol: "glipizide",
  "glucotrol xl": "glipizide", amaryl: "glimepiride", diabeta: "glyburide", micronase: "glyburide",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", nesina: "alogliptin",
  actos: "pioglitazone", avandia: "rosiglitazone", ozempic: "semaglutide", wegovy: "semaglutide",
  rybelsus: "semaglutide", victoza: "liraglutide", saxenda: "liraglutide", trulicity: "dulaglutide",
  byetta: "exenatide", bydureon: "exenatide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  lyumjev: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  aleve: "naproxen", naprosyn: "naproxen", anaprox: "naproxen", advil: "ibuprofen", motrin: "ibuprofen",
  tylenol: "acetaminophen", paracetamol: "acetaminophen", aspirin: "aspirin", bayer: "aspirin", ecotrin: "aspirin",
  "baby aspirin": "aspirin", celebrex: "celecoxib", mobic: "meloxicam", voltaren: "diclofenac",
  ultram: "tramadol", neurontin: "gabapentin", lyrica: "pregabalin", flexeril: "cyclobenzaprine",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide",
  aldactone: "spironolactone", inspra: "eplerenone", cozaar: "losartan", diovan: "valsartan",
  benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan", atacand: "candesartan",
  vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", accupril: "quinapril",
  toprol: "metoprolol", "toprol xl": "metoprolol", lopressor: "metoprolol", coreg: "carvedilol",
  tenormin: "atenolol", bystolic: "nebivolol", inderal: "propranolol", cardizem: "diltiazem",
  calan: "verapamil", procardia: "nifedipine", adalat: "nifedipine", catapres: "clonidine",
  apresoline: "hydralazine", imdur: "isosorbide mononitrate", nitrostat: "nitroglycerin",
  entresto: "sacubitril / valsartan", lanoxin: "digoxin", eliquis: "apixaban", xarelto: "rivaroxaban",
  pradaxa: "dabigatran", coumadin: "warfarin", jantoven: "warfarin", plavix: "clopidogrel",
  brilinta: "ticagrelor", effient: "prasugrel", zetia: "ezetimibe", tricor: "fenofibrate",
  lopid: "gemfibrozil", lovaza: "omega-3-acid ethyl esters", vascepa: "icosapent ethyl",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", prevacid: "lansoprazole",
  aciphex: "rabeprazole", dexilant: "dexlansoprazole", pepcid: "famotidine", zantac: "ranitidine",
  tums: "calcium carbonate", "milk of magnesia": "magnesium hydroxide", miralax: "polyethylene glycol 3350",
  colace: "docusate", senokot: "sennosides", dulcolax: "bisacodyl", imodium: "loperamide",
  zofran: "ondansetron", reglan: "metoclopramide", phenergan: "promethazine",
  claritin: "loratadine", zyrtec: "cetirizine", allegra: "fexofenadine", xyzal: "levocetirizine",
  benadryl: "diphenhydramine", flonase: "fluticasone", nasacort: "triamcinolone", singulair: "montelukast",
  ventolin: "albuterol", "ventolin hfa": "albuterol", proair: "albuterol", "proair hfa": "albuterol",
  proventil: "albuterol", xopenex: "levalbuterol", flovent: "fluticasone", qvar: "beclomethasone",
  pulmicort: "budesonide", spiriva: "tiotropium", advair: "fluticasone / salmeterol",
  symbicort: "budesonide / formoterol", breo: "fluticasone / vilanterol", sudafed: "pseudoephedrine",
  mucinex: "guaifenesin", delsym: "dextromethorphan",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram",
  paxil: "paroxetine", effexor: "venlafaxine", "effexor xr": "venlafaxine", pristiq: "desvenlafaxine",
  cymbalta: "duloxetine", wellbutrin: "bupropion", "wellbutrin xl": "bupropion", zyban: "bupropion",
  remeron: "mirtazapine", desyrel: "trazodone", trintellix: "vortioxetine", seroquel: "quetiapine",
  abilify: "aripiprazole", risperdal: "risperidone", zyprexa: "olanzapine", geodon: "ziprasidone",
  latuda: "lurasidone", vraylar: "cariprazine", rexulti: "brexpiprazole", clozaril: "clozapine",
  haldol: "haloperidol", lithobid: "lithium", lamictal: "lamotrigine", depakote: "divalproex",
  tegretol: "carbamazepine", trileptal: "oxcarbazepine", keppra: "levetiracetam", topamax: "topiramate",
  xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam",
  buspar: "buspirone", ambien: "zolpidem", lunesta: "eszopiclone", adderall: "amphetamine",
  ritalin: "methylphenidate", concerta: "methylphenidate", vyvanse: "lisdexamfetamine", strattera: "atomoxetine",
  suboxone: "buprenorphine / naloxone", zubsolv: "buprenorphine / naloxone", subutex: "buprenorphine",
  sublocade: "buprenorphine", vivitrol: "naltrexone", revia: "naltrexone", narcan: "naloxone",
  antabuse: "disulfiram", campral: "acamprosate", chantix: "varenicline",
  truvada: "emtricitabine / tenofovir disoproxil", descovy: "emtricitabine / tenofovir alafenamide",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", tivicay: "dolutegravir",
  triumeq: "abacavir / dolutegravir / lamivudine", genvoya: "elvitegravir / cobicistat / emtricitabine / tenofovir alafenamide",
  valtrex: "valacyclovir", zovirax: "acyclovir", viagra: "sildenafil", cialis: "tadalafil",
  flomax: "tamsulosin", proscar: "finasteride", avodart: "dutasteride", detrol: "tolterodine",
  ditropan: "oxybutynin", myrbetriq: "mirabegron", fosamax: "alendronate", boniva: "ibandronate",
  prolia: "denosumab", premarin: "conjugated estrogens", estrace: "estradiol", provera: "medroxyprogesterone",
  "depo-provera": "medroxyprogesterone", prometrium: "progesterone", plaquenil: "hydroxychloroquine",
  medrol: "methylprednisolone", deltasone: "prednisone", trexall: "methotrexate", humira: "adalimumab",
  enbrel: "etanercept", zyloprim: "allopurinol", uloric: "febuxostat", colcrys: "colchicine",
  keflex: "cephalexin", amoxil: "amoxicillin", augmentin: "amoxicillin / clavulanate", zithromax: "azithromycin",
  "z-pak": "azithromycin", cipro: "ciprofloxacin", levaquin: "levofloxacin", bactrim: "sulfamethoxazole / trimethoprim",
  macrobid: "nitrofurantoin", doxycycline: "doxycycline", flagyl: "metronidazole", diflucan: "fluconazole",
  "vitamin d": "cholecalciferol", "vitamin d3": "cholecalciferol", "fish oil": "omega-3 fatty acids",
  "vitamin b12": "cyanocobalamin", "b12": "cyanocobalamin", "folic acid": "folic acid", "iron": "ferrous sulfate",
  "k-dur": "potassium chloride", "klor-con": "potassium chloride", "slow-k": "potassium chloride",
};

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "magnesium", "maleate", "besylate", "besilate",
  "mesylate", "succinate", "tartrate", "bitartrate", "citrate", "sulfate", "acetate", "fumarate", "hydrobromide",
  "bromide", "phosphate", "dihydrate", "monohydrate", "trihydrate", "hyclate", "propionate", "furoate",
  "xinafoate", "dipropionate", "valerate", "hemihydrate", "medoxomil", "monosodium", "disodium", "trometamol",
  "tromethamine", "sesquihydrate", "anhydrous", "pamoate", "decanoate", "lactate", "gluconate", "carbonate",
  "oxalate", "napsylate", "estolate", "stearate", "ethylsuccinate", "hydrate",
]);
// Words that complete an ingredient name rather than being a salt ("potassium chloride", "calcium carbonate").
const KEEP_FIRST = new Set(["potassium", "calcium", "magnesium", "sodium", "ferrous", "zinc"]);

const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "pill", "pills", "oral", "er", "xr",
  "sr", "dr", "la", "xl", "cr", "ec", "odt", "hfa", "inhaler", "injection", "solution", "suspension", "cream",
  "ointment", "patch", "pen", "drops", "spray", "nasal", "extended", "release", "delayed", "chewable",
  "mg", "mcg", "ml", "units", "unit", "iu", "g",
]);

function stripSalts(name: string): string {
  const w = name.toLowerCase().replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (w.length >= 2 && KEEP_FIRST.has(w[0]) && !SALTS.has(w[1])) return w.join(" ");
  while (w.length > 1 && SALTS.has(w[w.length - 1])) w.pop();
  return w.join(" ");
}

interface Component {
  ingredient: string;
  strength?: Strength;
}

/** Ingredients from an RxNorm display string ("metformin hydrochloride 1000 MG Oral Tablet"). */
function parseDisplay(display: string): { comps: Component[]; ingredientLevel: boolean } | undefined {
  let d = display.replace(/\[[^\]]*\]/g, " ").replace(/^\s*\d+(\.\d+)?\s*(HR|DAY|ACTUAT)\s+/i, " ").trim();
  if (!d || /^\{/.test(d)) return undefined;
  const hasNumber = /\d/.test(d);
  const comps: Component[] = [];
  for (const seg of d.split(/\s+\/\s+/)) {
    const m = /^(.*?)\s+(\d+(?:\.\d+)?)\s*([A-Za-zµ]+(?:\/[A-Za-z0-9.]+)?)/.exec(seg);
    const raw = m ? m[1] : hasNumber ? seg.replace(/\s+\d.*$/, "") : seg;
    const ing = stripSalts(cleanName(raw));
    if (!ing) continue;
    comps.push({ ingredient: ing, strength: m ? parseStrength(`${m[2]} ${m[3]}`) : undefined });
  }
  if (!comps.length) return undefined;
  const ingredientLevel = !hasNumber && !/(tablet|capsule|solution|injectable|inhaler|oral|topical|pen|patch|suspension|cream)/i.test(d);
  return { comps, ingredientLevel };
}

function cleanName(s: string): string {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/\b\d+(\.\d+)?\s*(mg|mcg|µg|g|ml|units?|iu|%)\b(\s*\/\s*[\d.]*\s*\w+)?/g, " ")
    .replace(/[,;]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !FORM_WORDS.has(w) && !/^\d/.test(w))
    .join(" ")
    .trim();
}

/** Ingredients from a patient-typed name ("Zestril", "Metformin ER 500 mg"). */
function ingredientsFromName(name: string): string[] | undefined {
  const lower = name.toLowerCase().replace(/\s+/g, " ").trim();
  if (!lower) return undefined;
  const direct = BRANDS[lower] ?? BRANDS[cleanName(lower)];
  if (direct) return direct.split(" / ");
  const c = cleanName(lower);
  const first = c.split(" ")[0];
  if (first && BRANDS[first]) return BRANDS[first].split(" / ");
  if (!c) return undefined;
  const parts = c.split(/\s*(?:\/|\band\b|\+|-(?=[a-z]+$))\s*/).filter(Boolean);
  if (parts.length > 1 && parts.every((p) => /^[a-z][a-z ]+$/.test(p))) return parts.map(stripSalts);
  return [stripSalts(c)];
}

type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";
interface Strength {
  value: number;
  unit: "mg" | "mcg" | "units" | "mL";
  perValue?: number;
  perUnit?: string; // "mL", "puff", "tablet"…
}

function normUnit(u: string): { unit: "mg" | "mcg" | "units" | "mL"; factor: number } | undefined {
  const x = u.toLowerCase().replace(/\.$/, "");
  if (["mg", "milligram", "milligrams"].includes(x)) return { unit: "mg", factor: 1 };
  if (["g", "gram", "grams", "gm"].includes(x)) return { unit: "mg", factor: 1000 };
  if (["mcg", "µg", "ug", "microgram", "micrograms"].includes(x)) return { unit: "mcg", factor: 1 };
  if (["u", "iu", "unt", "unit", "units"].includes(x)) return { unit: "units", factor: 1 };
  if (["ml", "cc", "milliliter", "milliliters", "millilitre", "millilitres"].includes(x)) return { unit: "mL", factor: 1 };
  return undefined;
}

function parseStrength(s: unknown): Strength | undefined {
  if (typeof s !== "string") return undefined;
  const m = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|g|gm|grams?|milligrams?|micrograms?|units?|unt|iu|u|ml|cc)\b(?:\s*(?:\/|per)\s*(\d+(?:\.\d+)?)?\s*([a-zµ]+))?/i.exec(
    s,
  );
  if (!m) return undefined;
  const nu = normUnit(m[2]);
  if (!nu) return undefined;
  const st: Strength = { value: round(parseFloat(m[1]) * nu.factor), unit: nu.unit };
  if (m[4]) {
    st.perValue = m[3] ? parseFloat(m[3]) : 1;
    const pu = m[4].toLowerCase();
    st.perUnit = normUnit(pu)?.unit === "mL" ? "mL" : pu;
  }
  return st;
}

function round(n: number): number {
  return Math.round(n * 10000) / 10000;
}

const NUMWORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5, a: 1, an: 1 };
function numOf(s: string): number | undefined {
  const x = s.toLowerCase().trim();
  if (x in NUMWORDS) return NUMWORDS[x];
  if (/^\d+\/\d+$/.test(x)) {
    const [a, b] = x.split("/").map(Number);
    return b ? a / b : undefined;
  }
  const n = parseFloat(x);
  return Number.isFinite(n) ? n : undefined;
}

const NUM = String.raw`(\d+(?:\.\d+)?|\d+\/\d+|one|two|three|four|five|six|half|an?)`;

function frequencyOf(how: string): MedicationRow["frequency"] | undefined {
  const h = " " + how.toLowerCase() + " ";
  if (/\b(as needed|when needed|if needed|prn|when i need|as required|when it hurts|if i need)\b/.test(h)) return "PRN";
  if (/\b(taper|tapering|every other day|alternate days|monthly|every month|four times|4 times|4x|qid|every 6 hours|every 4 hours|q6h|q4h|every 2 weeks|every two weeks|twice a week|2 times a week|three times a week)\b/.test(h))
    return "other";
  if (/\b(once a week|weekly|every week|once weekly|every (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|on (mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays))\b/.test(h))
    return "QW";
  if (/\b(three times|3 times|3x|tid|every 8 hours|q8h|with (each|every) meal|with meals)\b/.test(h)) return "TID";
  if (/\b(twice|two times|2 times|2x|bid|every 12 hours|q12h)\b/.test(h)) return "BID";
  const slots = [
    /\b(morning|breakfast|am|a\.m\.|wake|waking)\b/,
    /\b(noon|lunch|midday)\b/,
    /\b(evening|supper|dinner|pm|p\.m\.)\b/,
    /\b(bedtime|bed|night|nightly|nighttime)\b/,
  ];
  const hits = slots.map((r) => r.test(h));
  const n = hits.filter(Boolean).length;
  if (n === 4) return "other";
  if (n === 3) return "TID";
  if (n === 2) return "BID";
  if (n === 1) return hits[3] ? "QHS" : "QD";
  if (/\b(once a day|once daily|daily|every day|each day|qd|once|1 a day|one a day|a day)\b/.test(h)) return "QD";
  return undefined;
}

function doseOf(how: string | undefined, strength: Strength | undefined, freq: MedicationRow["frequency"] | undefined): MedicationRow["dose"] | undefined {
  if (!how) return undefined;
  const h = how.toLowerCase();
  if (/\b(sliding|scale|depends|depending|if (my )?(sugar|bs|glucose|blood)|varies|per carb|carbs?)\b/.test(h)) return undefined;
  // Ranges: "1 or 2", "1-2", "1 to 2", "2–4 units".
  if (new RegExp(String.raw`\b${NUM}\s*(?:or|-|–|to)\s*${NUM}\b`).test(h)) return undefined;

  // Explicit amounts in a measurable unit ("10 units", "5 mL", "500 mg").
  const amts: { v: number; unit: "mg" | "mcg" | "units" | "mL" }[] = [];
  const reAmt = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|g|milligrams?|micrograms?|units?|iu|u|ml|cc)\b/gi;
  for (let m; (m = reAmt.exec(h)); ) {
    const nu = normUnit(m[2]);
    if (nu) amts.push({ v: round(parseFloat(m[1]) * nu.factor), unit: nu.unit });
  }
  // Counts of dosage units ("2 tablets", "one puff", "1/2 tab").
  const counts: { n: number; form: string }[] = [];
  const reCnt = new RegExp(String.raw`\b${NUM}\s*(tablets?|tabs?|pills?|capsules?|caps?|puffs?|sprays?|drops?|inhalations?|patch(?:es)?|lozenges?|gumm(?:y|ies)|softgels?)\b`, "gi");
  for (let m; (m = reCnt.exec(h)); ) {
    const n = numOf(m[1]);
    if (n !== undefined) counts.push({ n, form: m[2] });
  }
  if (!counts.length && !amts.length) {
    // A bare leading count: "2 at bedtime", "1 every morning".
    const m = new RegExp(String.raw`^\s*${NUM}\b(?!\s*(?:x\b|times|hours?|hrs?|days?|weeks?|a day|per|%))`).exec(h);
    if (m && m[1] !== "a" && m[1] !== "an") {
      const n = numOf(m[1]);
      if (n !== undefined) counts.push({ n, form: "" });
    }
  }

  if (amts.length) {
    if (counts.length) return undefined;
    const u = amts[0].unit;
    if (!amts.every((a) => a.unit === u && a.v === amts[0].v)) return undefined;
    const a = amts[0];
    if (a.unit === "mL" && strength && strength.perUnit === "mL" && strength.unit !== "mL") {
      return { value: round((a.v * strength.value) / (strength.perValue || 1)), unit: strength.unit };
    }
    return { value: a.v, unit: a.unit };
  }

  let count: number | undefined;
  let form = "";
  if (counts.length) {
    if (!counts.every((c) => c.n === counts[0].n)) return undefined;
    count = counts[0].n;
    form = counts[0].form;
  } else if (freq && freq !== "PRN") {
    count = 1; // a time with no count means one unit
  } else if (freq === "PRN" && /\b(take|use)\s+(one|a|an|1)\b/.test(h)) {
    count = 1;
  }
  if (count === undefined) return undefined;

  if (strength) {
    if (strength.perUnit === "mL" || strength.unit === "mL") return undefined; // count of a liquid: no single mass
    return { value: round(strength.value * count), unit: strength.unit };
  }
  if (/^(tablets?|tabs?|pills?)$/.test(form) || form === "") {
    if (form === "" && !/\b(tablets?|tabs?|pills?)\b/.test(h)) return undefined;
    return { value: count, unit: "tablet" };
  }
  return undefined;
}

const HELD_RE =
  /\b(paused?|pausing|on hold|holding|hold(ing)? off|for now|for the time being|temporarily|taking a break|break from|until (after|my|the|i)|stopped for|off it for|not taking (it )?(right now|at the moment|currently|for now)|skipping (it )?(for now|until))\b/i;

function stopReasonOf(text: string): MedicationRow["stop_reason"] | undefined {
  const t = text.toLowerCase();
  if (/\b(side effect|rash|hives|itch|allerg|reaction|swell|made me|gave me|caused|cough(ing)?|dizz|nause|upset stomach|stomach|cramps|muscle (pain|ache)|diarrh|bleed|headache)\b/.test(t))
    return "adverse_reaction";
  if (/\b(didn'?t work|did not work|not working|wasn'?t working|no help|didn'?t help|did not help|ineffective|no effect|stopped working)\b/.test(t)) return "ineffective";
  if (/\b(switched|switch|changed to|replaced|instead|moved to|new medicine|new med)\b/.test(t)) return "therapy_changed";
  if (/\b(finished|course|completed|done with|ran its course|all gone)\b/.test(t)) return "course_complete";
  if (/\b(i decided|my choice|didn'?t want|don'?t want|chose to|decided to stop|i stopped|too expensive|cost|can'?t afford)\b/.test(t)) return "patient_choice";
  return undefined;
}

const SENS: [Sensitivity, RegExp][] = [
  [
    "substance-use",
    /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|varenicline|nicotine|lofexidine)\b/,
  ],
  [
    "mental-health",
    /\b(sertraline|fluoxetine|escitalopram|citalopram|paroxetine|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|vortioxetine|vilazodone|quetiapine|aripiprazole|risperidone|olanzapine|ziprasidone|lurasidone|cariprazine|brexpiprazole|clozapine|haloperidol|paliperidone|lithium|lamotrigine|divalproex|amitriptyline|nortriptyline|imipramine|clomipramine|doxepin|phenelzine|buspirone|alprazolam|lorazepam|clonazepam|diazepam|methylphenidate|amphetamine|dextroamphetamine|lisdexamfetamine|atomoxetine|guanfacine|chlorpromazine|perphenazine|fluphenazine|lumateperone|esketamine)\b/,
  ],
  [
    "hiv-sti",
    /\b(emtricitabine|tenofovir|dolutegravir|bictegravir|raltegravir|elvitegravir|cabotegravir|rilpivirine|efavirenz|abacavir|lamivudine|zidovudine|darunavir|atazanavir|ritonavir|lopinavir|nevirapine|doravirine|maraviroc|lenacapavir)\b/,
  ],
  [
    "sexual-reproductive-health",
    /\b(ethinyl estradiol|levonorgestrel|norethindrone|norgestimate|desogestrel|drospirenone|etonogestrel|ulipristal|medroxyprogesterone|mifepristone|misoprostol|clomiphene|letrozole|sildenafil|tadalafil|vardenafil|progesterone|segesterone)\b/,
  ],
];

function sensitivityOf(ingredient: string | undefined, name: string): Sensitivity[] | undefined {
  const s = `${ingredient ?? ""} ${name}`.toLowerCase();
  const out: Sensitivity[] = [];
  for (const [cat, re] of SENS) if (re.test(s)) out.push(cat);
  // Naloxone alone is overdose rescue, not treatment; buprenorphine/naloxone is caught above.
  return out.length ? out : undefined;
}

function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() ? x.trim() : undefined;
}

function medications(items: FolioItem[]): MedicationRow[] {
  const snapshots = items.filter(
    (it) =>
      entries(it).some(([, e]) => e.type === "my_med") ||
      (entries(it).length === 0 && /^\s*my medicines\b/i.test(String(it.narrative ?? ""))),
  );
  if (!snapshots.length) return [];
  snapshots.sort(compareItems);
  const snap = snapshots[snapshots.length - 1];

  const rows: MedicationRow[] = [];
  const byIngredient = new Map<string, MedicationRow>();
  const order: string[] = [];
  for (const [k, e] of entries(snap)) {
    if (e.type !== "my_med") continue;
    const name = str(e.name) ?? str(e.picked_from_search?.display);
    if (!name) continue;
    const picked = str(e.picked_from_search?.display) ? parseDisplay(e.picked_from_search.display) : undefined;
    const fromName = str(e.name) ? ingredientsFromName(e.name) : undefined;

    let comps: Component[];
    let rxIn: string | undefined;
    const nameKnown = fromName && str(e.name) && (BRANDS[e.name.toLowerCase().trim()] || BRANDS[cleanName(e.name)] || BRANDS[cleanName(e.name).split(" ")[0]]);
    if (picked) {
      comps = picked.comps;
      if (picked.ingredientLevel && comps.length === 1 && /^\d+$/.test(String(e.picked_from_search?.rxnorm ?? "")))
        rxIn = String(e.picked_from_search.rxnorm);
      // If the name the patient wrote is a known drug and contradicts the search pick, trust the name.
      if (nameKnown && fromName && fromName.join("/") !== comps.map((c) => c.ingredient).join("/") &&
          !fromName.every((f) => comps.some((c) => c.ingredient === f))) {
        comps = fromName.map((f) => ({ ingredient: f }));
        rxIn = undefined;
      }
    } else comps = (fromName ?? []).map((f) => ({ ingredient: f }));

    const how = str(e.how_i_take_it);
    const note = str(e.note);
    const strengthText = parseStrength(e.strength_text);
    const freq = how ? frequencyOf(how) : undefined;

    let status: MedicationRow["status"];
    let since: string | undefined;
    let reasonText: string | undefined;
    let stopReason: MedicationRow["stop_reason"];
    const annot = [note, how].filter(Boolean).join(" ");
    if (e.status === "taking") {
      if (annot && HELD_RE.test(annot)) {
        status = "held";
        reasonText = note ?? how;
      } else {
        status = "active";
        since = partialDate(e.started)?.value;
      }
    } else if (e.status === "stopped") {
      if (note && HELD_RE.test(note)) {
        status = "held";
        reasonText = note;
      } else {
        status = "stopped";
        reasonText = note;
        if (note) stopReason = stopReasonOf(note);
      }
      since = partialDate(e.stopped)?.value;
    } else {
      status = "unknown";
    }

    const singleComp = comps.length <= 1;
    const list: (Component | undefined)[] = comps.length ? comps : [undefined];
    for (const c of list) {
      const strength = singleComp ? strengthText ?? c?.strength : c?.strength;
      const row: MedicationRow = {
        drug_name: name,
        status,
        patient_reported: true,
        evidence: [{ item_id: snap.id, entry_id: k }],
      };
      if (c) row.ingredient = c.ingredient;
      if (c && rxIn) row.rxnorm_ingredient = rxIn;
      if (since) row.status_since = since;
      const dose = doseOf(how, strength, freq);
      if (dose) row.dose = dose;
      if (freq) row.frequency = freq;
      if (stopReason) row.stop_reason = stopReason;
      if (reasonText) row.status_reason_text = reasonText;
      if (e.kind === "over_the_counter") row.otc = true;
      const sens = sensitivityOf(c?.ingredient, name);
      if (sens) row.sensitivity = sens;

      const key = c ? c.ingredient : `name:${name.toLowerCase()}`;
      const prev = byIngredient.get(key);
      if (!prev) {
        byIngredient.set(key, row);
        order.push(key);
      } else if (prev.status !== "active" && row.status === "active") {
        // Same drug named twice: keep one row, preferring the entry the patient says they take.
        row.evidence = [...row.evidence, ...prev.evidence];
        byIngredient.set(key, row);
      } else {
        prev.evidence.push(...row.evidence);
      }
    }
  }
  for (const k of order) rows.push(byIngredient.get(k)!);
  return rows;
}

// ---------------------------------------------------------------- entry point

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return out;
  let counting: FolioItem[] = [];
  try {
    counting = countingItems(items, asOf);
  } catch {
    return out;
  }
  try {
    out.medications = medications(counting);
  } catch {
    out.medications = [];
  }
  try {
    out.vitals = vitals(counting);
  } catch {
    out.vitals = [];
  }
  return out;
}

