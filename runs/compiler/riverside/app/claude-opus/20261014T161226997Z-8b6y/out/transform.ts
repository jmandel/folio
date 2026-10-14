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

// Mapper for Riverside Regional (riverside-doc-v1) clinical documents. Each item is one document (ED note,
// H&P, progress note, consult, discharge summary) whose payload is a map of entry id -> RiversideEntry.

const TZ = "America/Chicago";

// ---------------------------------------------------------------------------------------------------------
// Small helpers

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x.trim() : undefined;
}

function num(x: unknown): number | undefined {
  if (typeof x === "number" && isFinite(x)) return x;
  if (typeof x === "string" && /^\s*-?\d+(\.\d+)?\s*$/.test(x)) return parseFloat(x);
  return undefined;
}

function round(x: number, digits: number): number {
  const f = Math.pow(10, digits);
  return Math.round(x * f) / f;
}

function cmp(a: string | number, b: string | number): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

// ---------------------------------------------------------------------------------------------------------
// Time handling

let dtf: Intl.DateTimeFormat | undefined;
function chicagoParts(epoch: number): { y: string; mo: string; d: string; h: string; mi: string; s: string } | undefined {
  try {
    if (!dtf) {
      dtf = new Intl.DateTimeFormat("en-US", {
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
    const parts = dtf.formatToParts(new Date(epoch));
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    let h = get("hour");
    if (h === "24") h = "00";
    return { y: get("year"), mo: get("month"), d: get("day"), h, mi: get("minute"), s: get("second") };
  } catch {
    return undefined;
  }
}

/** Offset (minutes, local - UTC) of Chicago at a UTC instant. */
function chicagoOffsetAt(epoch: number): number {
  const p = chicagoParts(epoch);
  if (!p) return -360;
  const asUtc = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +p.mi, +p.s);
  return Math.round((asUtc - Math.floor(epoch / 1000) * 1000) / 60000);
}

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;
const DATETIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?/;

/** Epoch of a wall-clock local time in Chicago. */
function localWallToEpoch(y: number, mo: number, d: number, h: number, mi: number, s: number): number {
  const wall = Date.UTC(y, mo - 1, d, h, mi, s);
  let off = chicagoOffsetAt(wall - 360 * 60000);
  let ep = wall - off * 60000;
  const off2 = chicagoOffsetAt(ep);
  if (off2 !== off) ep = wall - off2 * 60000;
  return ep;
}

/** Epoch for ordering. Partial dates/plain dates are taken as local start of period. */
function toEpoch(s: string | undefined): number | undefined {
  if (!s) return undefined;
  const t = s.trim();
  const m = DATETIME.exec(t);
  if (m) {
    if (HAS_ZONE.test(t)) {
      const e = Date.parse(t);
      return isNaN(e) ? undefined : e;
    }
    return localWallToEpoch(+m[1], +m[2], +m[3], +m[4], +m[5], m[6] ? +m[6] : 0);
  }
  const pd = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(t);
  if (pd) return localWallToEpoch(+pd[1], pd[2] ? +pd[2] : 1, pd[3] ? +pd[3] : 1, 0, 0, 0);
  return undefined;
}

/** Local (Chicago) date with source precision. */
function localDate(s: string | undefined): string | undefined {
  if (!s) return undefined;
  const t = s.trim();
  const m = DATETIME.exec(t);
  if (m) {
    if (!HAS_ZONE.test(t)) return `${m[1]}-${m[2]}-${m[3]}`;
    const e = Date.parse(t);
    if (isNaN(e)) return undefined;
    const p = chicagoParts(e);
    return p ? `${p.y}-${p.mo}-${p.d}` : undefined;
  }
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  return undefined;
}

/** Local wall-clock `YYYY-MM-DDTHH:MM`. */
function localMinute(s: string | undefined): string | undefined {
  if (!s) return undefined;
  const t = s.trim();
  const m = DATETIME.exec(t);
  if (!m) return undefined;
  if (!HAS_ZONE.test(t)) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
  const e = Date.parse(t);
  if (isNaN(e)) return undefined;
  const p = chicagoParts(e);
  return p ? `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}` : undefined;
}

/** RFC 3339 with the Chicago offset. */
function localRfc3339(s: string | undefined): string | undefined {
  if (!s) return undefined;
  const t = s.trim();
  const m = DATETIME.exec(t);
  if (!m) return /^\d{4}(-\d{2}(-\d{2})?)?$/.test(t) ? t : undefined;
  const ep = toEpoch(t);
  if (ep === undefined) return undefined;
  const p = chicagoParts(ep);
  if (!p) return undefined;
  const off = chicagoOffsetAt(ep);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  const oh = String(Math.floor(a / 60)).padStart(2, "0");
  const om = String(a % 60).padStart(2, "0");
  return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}:${p.s}${sign}${oh}:${om}`;
}

function precisionOf(d: string): "year" | "month" | "day" {
  return d.length === 4 ? "year" : d.length === 7 ? "month" : "day";
}

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

/** Parse a free-text onset ("2019", "June 2019", "2019-06", "06/2019", "3/14/2019") to a partial date. */
function parseOnsetText(s: string | undefined): string | undefined {
  if (!s) return undefined;
  const t = s.trim();
  let m = /^(\d{4})(-\d{2})?(-\d{2})?$/.exec(t);
  if (m) return t;
  m = DATETIME.exec(t);
  if (m) return localDate(t);
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t);
  if (m) return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  m = /^(\d{1,2})\/(\d{4})$/.exec(t);
  if (m) return `${m[2]}-${m[1].padStart(2, "0")}`;
  m = /^(?:(?:in|since|around|about|approx\.?|circa|c\.)\s+)?([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})$/i.exec(t);
  if (m && MONTHS[m[1].toLowerCase()]) return `${m[3]}-${MONTHS[m[1].toLowerCase()]}-${m[2].padStart(2, "0")}`;
  m = /^(?:(?:in|since|around|about|approx\.?|circa|c\.)\s+)?([a-z]{3})[a-z]*\.?,?\s+(\d{4})$/i.exec(t);
  if (m && MONTHS[m[1].toLowerCase()]) return `${m[2]}-${MONTHS[m[1].toLowerCase()]}`;
  m = /^(?:in|since|around|about|approx\.?|circa|c\.)\s+(\d{4})$/i.exec(t);
  if (m) return m[1];
  return undefined;
}

// ---------------------------------------------------------------------------------------------------------
// As-of and supersession

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const valid = items.filter((it) => isObj(it) && typeof it.id === "string");
  const inWindow = valid.filter((it) => {
    const d = localDate(typeof it.recorded === "string" ? it.recorded : undefined);
    return d !== undefined && d.length === 10 && d <= asOf;
  });
  const retracted = new Set<string>();
  for (const it of inWindow) for (const r of Array.isArray(it.retracts) ? it.retracts : []) if (typeof r === "string") retracted.add(r);
  const live = inWindow.filter((it) => !retracted.has(it.id));
  const byId = new Map<string, FolioItem>();
  for (const it of valid) byId.set(it.id, it);
  const superseded = new Set<string>();
  const stack: string[] = [];
  for (const it of live) for (const s of Array.isArray(it.supersedes) ? it.supersedes : []) if (typeof s === "string") stack.push(s);
  while (stack.length) {
    const id = stack.pop()!;
    if (superseded.has(id)) continue;
    superseded.add(id);
    const it = byId.get(id);
    if (it && !retracted.has(id)) for (const s of Array.isArray(it.supersedes) ? it.supersedes : []) if (typeof s === "string") stack.push(s);
  }
  return live.filter((it) => !superseded.has(it.id));
}

/** Clinical time of the document's state: end of the period if any (discharge summary), else effective. */
function itemTime(it: FolioItem): number {
  return toEpoch(str(it.effective_end)) ?? toEpoch(str(it.effective)) ?? toEpoch(str(it.recorded)) ?? 0;
}

function itemOrder(a: FolioItem, b: FolioItem): number {
  return (
    itemTime(a) - itemTime(b) ||
    (toEpoch(str(a.recorded)) ?? 0) - (toEpoch(str(b.recorded)) ?? 0) ||
    cmp(a.id, b.id)
  );
}

function itemDate(it: FolioItem): string | undefined {
  return localDate(str(it.effective_end) ?? str(it.effective));
}

interface Entry {
  item: FolioItem;
  key: string;
  e: Record<string, any>;
}

function entriesOf(it: FolioItem, type: string): Entry[] {
  const out: Entry[] = [];
  if (!isObj(it.payload)) return out;
  for (const key of Object.keys(it.payload).sort()) {
    const e = it.payload[key];
    if (isObj(e) && e.type === type) out.push({ item: it, key, e });
  }
  return out;
}

function ev(en: Entry): { item_id: string; entry_id?: string } {
  return { item_id: en.item.id, entry_id: en.key };
}

function dedupEvidence(list: Evidence): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const x of list) {
    const k = x.item_id + "\u0000" + (x.entry_id ?? "");
    if (!seen.has(k)) {
      seen.add(k);
      out.push(x);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------
// Drug names

const BRANDS: Record<string, string> = {
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", lipitor: "atorvastatin",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", zestril: "lisinopril", prinivil: "lisinopril", cozaar: "losartan",
  norvasc: "amlodipine", synthroid: "levothyroxine", levoxyl: "levothyroxine", lasix: "furosemide",
  keflex: "cephalexin", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", humalog: "insulin lispro", admelog: "insulin lispro", novolog: "insulin aspart",
  levemir: "insulin detemir", tresiba: "insulin degludec", ozempic: "semaglutide", wegovy: "semaglutide",
  rybelsus: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", jantoven: "warfarin", plavix: "clopidogrel",
  zoloft: "sertraline", prozac: "fluoxetine", seroquel: "quetiapine", lexapro: "escitalopram",
  celexa: "citalopram", wellbutrin: "bupropion", abilify: "aripiprazole", zyprexa: "olanzapine",
  risperdal: "risperidone", lamictal: "lamotrigine", depakote: "valproate", tylenol: "acetaminophen",
  advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", naprosyn: "naproxen", prilosec: "omeprazole",
  nexium: "esomeprazole", protonix: "pantoprazole", pepcid: "famotidine", zyrtec: "cetirizine",
  claritin: "loratadine", allegra: "fexofenadine", benadryl: "diphenhydramine", flonase: "fluticasone",
  singulair: "montelukast", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  toprol: "metoprolol", lopressor: "metoprolol", coreg: "carvedilol", microzide: "hydrochlorothiazide",
  glucotrol: "glipizide", amaryl: "glimepiride", januvia: "sitagliptin", tradjenta: "linagliptin",
  neurontin: "gabapentin", lyrica: "pregabalin", flomax: "tamsulosin", aldactone: "spironolactone",
  diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", vasotec: "enalapril", altace: "ramipril",
  zithromax: "azithromycin", cipro: "ciprofloxacin", levaquin: "levofloxacin", bactrim: "sulfamethoxazole / trimethoprim",
  augmentin: "amoxicillin / clavulanate", amoxil: "amoxicillin", suboxone: "buprenorphine / naloxone",
  subutex: "buprenorphine", narcan: "naloxone", zofran: "ondansetron", xanax: "alprazolam",
  ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam", ambien: "zolpidem", desyrel: "trazodone",
  effexor: "venlafaxine", cymbalta: "duloxetine", remeron: "mirtazapine", paxil: "paroxetine",
  lithobid: "lithium", entresto: "sacubitril / valsartan", kerendia: "finerenone", lokelma: "sodium zirconium cyclosilicate",
  veltassa: "patiromer", truvada: "emtricitabine / tenofovir disoproxil", descovy: "emtricitabine / tenofovir alafenamide",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide",
};

const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "solution", "suspension", "injection",
  "injectable", "inhaler", "inhalation", "aerosol", "cream", "ointment", "gel", "lotion", "patch", "pen", "oral",
  "er", "xr", "sr", "dr", "xl", "cr", "la", "ec", "odt", "extended-release", "delayed-release", "extended", "delayed",
  "release", "chewable", "hfa", "spray", "nasal", "drops", "ophthalmic", "syrup", "vial", "kwikpen", "flexpen",
  "flextouch", "solostar", "powder", "packet", "liquid", "elixir", "subcutaneous", "sc", "subq", "iv", "po",
  "film-coated", "film", "coated", "concentrate", "suppository", "kit", "prefilled", "syringe", "auto-injector",
  "disintegrating", "orally", "topical", "transdermal", "hcl-er",
]);

const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "magnesium", "succinate", "tartrate", "besylate",
  "maleate", "mesylate", "citrate", "sulfate", "fumarate", "acetate", "trihydrate", "monohydrate", "dihydrate",
  "hyclate", "bromide", "phosphate", "hemifumarate", "dipropionate", "propionate", "furoate", "xinafoate",
  "disoproxil", "bitartrate", "hydrobromide", "valerate", "anhydrous", "monosodium", "dihydrochloride",
]);

function ingredientFromName(drugName: string | undefined): string | undefined {
  if (!drugName) return undefined;
  const lower = drugName.toLowerCase().replace(/[®™]/g, "").replace(/\(.*?\)/g, " ");
  const tokens = lower.split(/[\s,]+/).filter((t) => t !== "");
  const kept: string[] = [];
  for (const t of tokens) {
    if (/\d/.test(t)) break;
    if (FORM_WORDS.has(t)) break;
    kept.push(t);
  }
  if (kept.length === 0) return undefined;
  if (BRANDS[kept[0]]) return BRANDS[kept[0]];
  // Combination products ("losartan-hydrochlorothiazide", "x / y") are kept as written.
  const out = kept.filter((t, i) => i === 0 || !SALT_WORDS.has(t));
  const name = out.join(" ").trim();
  return name === "" ? undefined : name;
}

// Drug classes and member ingredients, for class-attributed diagnoses.
const DRUG_CLASSES: { re: RegExp; members: string[] }[] = [
  { re: /sglt-?2|sodium[- ]glucose co-?transporter|gliflozin/i, members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin", "bexagliflozin"] },
  { re: /ace[- ]?inhibitor|\bacei\b/i, members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"] },
  { re: /\barbs?\b|angiotensin (ii )?receptor blocker/i, members: ["losartan", "valsartan", "irbesartan", "olmesartan", "candesartan", "telmisartan", "azilsartan", "eprosartan"] },
  { re: /penicillin/i, members: ["amoxicillin", "penicillin", "ampicillin", "dicloxacillin", "nafcillin", "piperacillin", "amoxicillin / clavulanate"] },
  { re: /cephalosporin/i, members: ["cephalexin", "cefazolin", "ceftriaxone", "cefuroxime", "cefdinir", "cefpodoxime", "cefepime", "cefadroxil"] },
  { re: /sulfonamide|sulfa\b/i, members: ["sulfamethoxazole", "sulfamethoxazole / trimethoprim", "sulfasalazine"] },
  { re: /nsaid|non-?steroidal anti-?inflammatory/i, members: ["ibuprofen", "naproxen", "diclofenac", "meloxicam", "celecoxib", "indomethacin", "ketorolac", "aspirin", "etodolac", "nabumetone"] },
  { re: /statin\b|hmg-?coa/i, members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"] },
  { re: /thiazide/i, members: ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone", "chlorothiazide"] },
  { re: /sulfonylurea/i, members: ["glipizide", "glyburide", "glimepiride"] },
  { re: /fluoroquinolone|quinolone/i, members: ["ciprofloxacin", "levofloxacin", "moxifloxacin"] },
  { re: /\bopioid|opiate/i, members: ["oxycodone", "hydrocodone", "morphine", "hydromorphone", "tramadol", "codeine", "fentanyl", "tapentadol"] },
  { re: /glp-?1/i, members: ["semaglutide", "liraglutide", "dulaglutide", "exenatide", "tirzepatide"] },
  { re: /\bdpp-?4|gliptin/i, members: ["sitagliptin", "linagliptin", "saxagliptin", "alogliptin"] },
  { re: /metformin|biguanide/i, members: ["metformin"] },
  { re: /\binsulin\b/i, members: ["insulin glargine", "insulin lispro", "insulin aspart", "insulin detemir", "insulin degludec", "insulin regular", "insulin nph", "insulin isophane"] },
  { re: /anticoagulant/i, members: ["warfarin", "apixaban", "rivaroxaban", "dabigatran", "edoxaban", "heparin", "enoxaparin"] },
];

// ---------------------------------------------------------------------------------------------------------
// Sensitivity

const MH_DRUGS = /quetiapine|sertraline|fluoxetine|lithium|aripiprazole|olanzapine|risperidone|escitalopram|citalopram|venlafaxine|desvenlafaxine|paroxetine|mirtazapine|haloperidol|clozapine|lurasidone|ziprasidone|buspirone|trazodone|vortioxetine|vilazodone|paliperidone|cariprazine|brexpiprazole|fluphenazine|chlorpromazine|perphenazine|nortriptyline|amitriptyline|imipramine|clomipramine|phenelzine|lisdexamfetamine|methylphenidate|amphetamine|atomoxetine|guanfacine er/i;
const SU_DRUGS = /buprenorphine|methadone|naltrexone|disulfiram|acamprosate/i;
const HIV_DRUGS = /tenofovir|emtricitabine|dolutegravir|bictegravir|efavirenz|raltegravir|darunavir|abacavir|lamivudine|rilpivirine|cabotegravir|zidovudine|atazanavir|ritonavir|cobicistat|elvitegravir|nevirapine|doravirine|maraviroc|lenacapavir/i;
const SRH_DRUGS = /levonorgestrel|norethindrone|ethinyl estradiol|drospirenone|medroxyprogesterone|etonogestrel|norgestimate|desogestrel|ulipristal|clomiphene|letrozole.*fertility|sildenafil|tadalafil|vardenafil|prenatal|mifepristone|misoprostol|norelgestromin|segesterone/i;

function drugSensitivity(text: string): Sensitivity[] | undefined {
  const out: Sensitivity[] = [];
  if (MH_DRUGS.test(text)) out.push("mental-health");
  if (SU_DRUGS.test(text)) out.push("substance-use");
  if (SRH_DRUGS.test(text)) out.push("sexual-reproductive-health");
  if (HIV_DRUGS.test(text)) out.push("hiv-sti");
  return out.length ? out : undefined;
}

function conditionSensitivity(label: string, icd?: string): Sensitivity[] | undefined {
  const out = new Set<Sensitivity>();
  const l = label.toLowerCase();
  const c = (icd ?? "").toUpperCase();
  if (/^F1[0-689]/.test(c) || /(alcohol|opioid|cocaine|cannabis|stimulant|methamphetamine|amphetamine|benzodiazepine|substance|drug|sedative|heroin) (use|abuse|dependence|disorder|withdrawal)|alcoholism|alcohol-related|overdose/.test(l)) out.add("substance-use");
  if (/^F(2|3|4|5|6|9)\d/.test(c) || /depress|anxiety|bipolar|schizo|psychos|psychotic|ptsd|post-?traumatic stress|adhd|attention[- ]deficit|panic disorder|obsessive|ocd\b|eating disorder|anorexia nervosa|bulimia|suicid|self-harm|personality disorder|mental|psychiatric|insomnia disorder/.test(l)) out.add("mental-health");
  if (/^(B2[0-4]|Z21|A5[0-9]|A6[0-4]|Z20\.6|Z11\.[34])/.test(c) || /\bhiv\b|human immunodeficiency|\baids\b|syphilis|gonorrh|chlamydia|trichomon|genital herpes|herpes genital|genital wart|\bsti\b|\bstd\b|sexually transmitted/.test(l)) out.add("hiv-sti");
  if (/^(O\d|Z3[0-9]|N9[67]|Z98\.5|N52)/.test(c) || /pregnan|contracept|infertil|fertility|miscarriage|abortion|gestation|erectile|postpartum|ivf\b/.test(l)) out.add("sexual-reproductive-health");
  if (/^(Z15|Z14|Q9\d)/.test(c) || /brca|lynch syndrome|genetic|hereditary|inherited|chromosom|carrier of|gene mutation|variant\b/.test(l)) out.add("genetic");
  return out.size ? [...out] : undefined;
}

// ---------------------------------------------------------------------------------------------------------
// Medications

const UNIT_MAP: Record<string, "mg" | "mcg" | "units" | "mL" | "g"> = {
  mg: "mg", milligram: "mg", milligrams: "mg", mgs: "mg",
  mcg: "mcg", "µg": "mcg", ug: "mcg", microgram: "mcg", micrograms: "mcg",
  u: "units", iu: "units", unit: "units", units: "units",
  ml: "mL", cc: "mL", milliliter: "mL", milliliters: "mL",
  g: "g", gm: "g", gram: "g", grams: "g",
};
const UNIT_RE = "(mg|mgs|milligrams?|mcg|µg|ug|micrograms?|units?|iu|u|ml|cc|milliliters?|g|gm|grams?)";

function normAmount(v: number, u: string): { value: number; unit: "mg" | "mcg" | "units" | "mL" } | undefined {
  const nu = UNIT_MAP[u.toLowerCase()];
  if (!nu) return undefined;
  if (nu === "g") return { value: round(v * 1000, 6), unit: "mg" };
  return { value: v, unit: nu };
}

const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5, "1/2": 0.5, "½": 0.5 };

function parseStrength(drugName: string): { value: number; unit: "mg" | "mcg" | "units" | "mL" } | undefined {
  const re = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${UNIT_RE}(?![a-z])(\\s*\\/\\s*[a-z0-9.]+)?`, "gi");
  const found: { value: number; unit: "mg" | "mcg" | "units" | "mL" }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(drugName))) {
    const per = m[3] ? m[3].replace(/\s/g, "").toLowerCase() : "";
    // "90 mcg/actuation", "5 mg/tab" are per-unit strengths; "100 units/mL", "250 mg/5 mL" are concentrations.
    if (per && !/^\/(actuation|act|puff|spray|dose|tab|tablet|cap|capsule|inh|inhalation)$/.test(per)) return undefined;
    const a = normAmount(parseFloat(m[1]), m[2]);
    if (a) found.push(a);
  }
  return found.length === 1 ? found[0] : undefined;
}

const COUNT_UNIT = "(tabs?|tablets?|caps?|capsules?|puffs?|sprays?|inhalations?|actuations?|patch(?:es)?|pills?|lozenges?|suppositor(?:y|ies)|drops?)";

function parseCount(sig: string): { count?: number; range: boolean } {
  const s = sig.toLowerCase();
  if (new RegExp(`\\d+(\\.\\d+)?\\s*(-|–|to|or)\\s*\\d+(\\.\\d+)?\\s*${COUNT_UNIT}\\b`).test(s)) return { range: true };
  const m = new RegExp(`(?:^|\\b|\\s)(\\d+(?:\\.\\d+)?|one|two|three|four|half|1\\/2|½)\\s*(?:of\\s+a\\s+)?${COUNT_UNIT}\\b`).exec(s);
  if (m) {
    const n = WORD_NUM[m[1]] ?? parseFloat(m[1]);
    if (isFinite(n)) return { count: n, range: false };
  }
  return { range: false };
}

function parseDose(drugName: string, doseText: string | undefined, sig: string | undefined): MedicationRow["dose"] {
  const dt = (doseText ?? "").trim();
  const sg = (sig ?? "").trim();
  const all = `${dt} ${sg}`.toLowerCase();
  if (/sliding|scale|per protocol|titrat|as directed|variable|taper|per (?:carb|glucose|bg|inr|level)|if |depending|based on/.test(all)) return undefined;
  if (/\d\s*(-|–|to)\s*\d/.test(dt) && !/\d+\s*mg\s*\/\s*\d/.test(dt)) return undefined;
  const cnt = sg ? parseCount(sg) : { range: false };
  if (cnt.range) return undefined;
  const strength = parseStrength(drugName);
  if (strength && cnt.count !== undefined) return { value: round(strength.value * cnt.count, 6), unit: strength.unit };
  const dm = new RegExp(`^(\\d+(?:\\.\\d+)?)\\s*${UNIT_RE}$`, "i").exec(dt);
  if (dm) {
    const a = normAmount(parseFloat(dm[1]), dm[2]);
    if (a) return a;
  }
  const dc = new RegExp(`^(\\d+(?:\\.\\d+)?)\\s*${COUNT_UNIT}$`, "i").exec(dt);
  if (dc && !strength && /tab|pill/i.test(dc[2])) return { value: parseFloat(dc[1]), unit: "tablet" };
  if (cnt.count !== undefined && !strength) {
    if (/\btab|tablet|pill/i.test(sg)) return { value: cnt.count, unit: "tablet" };
    return undefined;
  }
  if (strength && sg && parseFrequency(sg) !== undefined) return strength;
  return undefined;
}

function parseFrequency(sig: string | undefined): MedicationRow["frequency"] {
  if (!sig) return undefined;
  const s = sig.toLowerCase();
  if (/\bprn\b|as needed|as-needed|when needed|if needed/.test(s)) return "PRN";
  if (/taper|every other day|\bqod\b|alternate days|monthly|every \d+ (weeks|months)|\bqid\b|four times|4 times|five times|every [1-6] ?h|q[1-6] ?h\b|q[1-6]hr?s?\b|twice (a |per )?week|three times (a |per )?week|\d+ times (a |per )?week/.test(s)) return "other";
  if (/\btid\b|three times (a |per )?day|three times daily|3 times (a |per )?day|3 times daily|every 8 ?h|q8 ?h/.test(s)) return "TID";
  if (/\bbid\b|twice (a |per )?day|twice daily|2 times (a |per )?day|2 times daily|every 12 ?h|q12 ?h/.test(s)) return "BID";
  if (/\bqhs\b|at bedtime|before bed|\bhs\b|nightly|at night|every night|each night|in the evening|every evening/.test(s)) {
    if (/bedtime|\bqhs\b|\bhs\b|before bed|nightly|at night|every night|each night/.test(s)) return "QHS";
    return "QD";
  }
  if (/\bqw\b|once (a |per )?week|weekly|every week|every 7 days/.test(s)) return "QW";
  if (/\bqd\b|\bdaily\b|once (a |per )?day|every day|every morning|in the morning|\bqam\b|every 24 ?h|q24 ?h|each day|per day|a day/.test(s)) return "QD";
  return undefined;
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] {
  if (!text) return undefined;
  const t = text.toLowerCase();
  if (/rash|hives|urticaria|reaction|side effect|adverse|intoleran|allerg|angioedema|swelling|caused|induced|associated|toxicity|nausea|vomit|upset|diarrh|dizz|drows|myalgia|cough|ketoacidosis|\bdka\b|pancreatitis|hypoglyc|hyperkal|kidney injury|\baki\b|bleed/.test(t)) return "adverse_reaction";
  if (/ineffective|not effective|no (response|benefit|improvement)|did not (work|help)|failed|inadequate/.test(t)) return "ineffective";
  if (/switch|replac|changed to|change to|instead|in favor of|transition(ed)? to|substitut/.test(t)) return "therapy_changed";
  if (/course (complete|completed|finished)|completed (the )?course|complete(d)? course|finished|course ended|end of course/.test(t)) return "course_complete";
  if (/patient (chose|choice|decided|declin|prefer|refus|wish)|declined|refused|preference/.test(t)) return "patient_choice";
  return "other";
}

function medStatus(s: unknown): MedicationRow["status"] | undefined {
  switch (s) {
    case "continue":
    case "new":
    case "changed":
      return "active";
    case "held":
      return "held";
    case "stopped":
      return "stopped";
    case "not_reconciled":
      return "unknown";
    default:
      return undefined;
  }
}

function medKey(e: Record<string, any>): string | undefined {
  const ing = ingredientFromName(str(e.drug_name));
  if (ing) return "n:" + ing;
  const rx = str(e.rxnorm_ingredient);
  if (rx) return "rx:" + rx;
  const dn = str(e.drug_name);
  return dn ? "d:" + dn.toLowerCase() : undefined;
}

function buildMedications(items: FolioItem[]): MedicationRow[] {
  // Each Riverside document restates the full home medication list with a reconciliation status per line:
  // the latest document carrying home medications is the list; earlier documents give status history.
  const withMeds = items.filter((it) => entriesOf(it, "home_med").length > 0);
  if (withMeds.length === 0) return [];
  const latest = withMeds[withMeds.length - 1];

  // History of each drug across documents, in clinical order.
  const history = new Map<string, Entry[]>();
  for (const it of withMeds) {
    const seenInItem = new Set<string>();
    for (const en of entriesOf(it, "home_med")) {
      const k = medKey(en.e);
      if (!k || seenInItem.has(k)) continue;
      seenInItem.add(k);
      if (!history.has(k)) history.set(k, []);
      history.get(k)!.push(en);
    }
  }

  const rows: MedicationRow[] = [];
  const done = new Set<string>();
  for (const cur of entriesOf(latest, "home_med")) {
    const k = medKey(cur.e);
    if (!k || done.has(k)) continue;
    done.add(k);
    const hist = history.get(k) ?? [cur];
    const status = medStatus(cur.e.status) ?? "unknown";
    // Current run: consecutive entries (back from the latest) with the same mapped status.
    let start = hist.length - 1;
    while (start > 0 && (medStatus(hist[start - 1].e.status) ?? "unknown") === status) start--;
    const run = hist.slice(start);
    const first = run[0];
    const prev = start > 0 ? hist[start - 1] : undefined;
    let since: string | undefined;
    if (status === "held" || status === "stopped") {
      since = itemDate(first.item);
    } else if (status === "active") {
      const firstStatus = first.e.status;
      const prevStatus = prev ? medStatus(prev.e.status) : undefined;
      if (firstStatus === "new" || firstStatus === "changed" || prevStatus === "held" || prevStatus === "stopped") since = itemDate(first.item);
      // A later "changed" within the active run restarts the current regimen.
      for (const en of run) if (en.e.status === "changed" || en.e.status === "new") since = itemDate(en.item) ?? since;
    }

    const drugName = str(cur.e.drug_name) ?? "";
    const ingredient = ingredientFromName(drugName);
    const row: MedicationRow = {
      drug_name: drugName,
      status,
      patient_reported: false,
      evidence: [],
    };
    if (ingredient) row.ingredient = ingredient;
    const rx = str(cur.e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;
    if (since) row.status_since = since;
    const dose = parseDose(drugName, str(cur.e.dose_text), str(cur.e.sig));
    if (dose) row.dose = dose;
    const freq = parseFrequency(str(cur.e.sig));
    if (freq) row.frequency = freq;

    if (status !== "unknown") {
      let reasonText: string | undefined;
      for (const en of run) reasonText = str(en.e.instructions) ?? reasonText;
      if (str(cur.e.instructions)) reasonText = str(cur.e.instructions);
      if (reasonText && status !== "active") row.status_reason_text = reasonText;
      else if (reasonText && status === "active" && str(cur.e.instructions)) row.status_reason_text = reasonText;
      if (status === "stopped") {
        const sr = stopReason(reasonText);
        if (sr) row.stop_reason = sr;
      }
    }
    const otcText = `${drugName} ${str(cur.e.sig) ?? ""} ${str(cur.e.instructions) ?? ""}`;
    if (/\botc\b|over[- ]the[- ]counter|non-?prescription/i.test(otcText)) row.otc = true;
    const sens = drugSensitivity(`${drugName} ${ingredient ?? ""}`);
    if (sens) row.sensitivity = sens;
    row.evidence = dedupEvidence(run.map(ev).reverse());
    rows.push(row);
  }
  rows.sort((a, b) => cmp(a.ingredient ?? a.drug_name.toLowerCase(), b.ingredient ?? b.drug_name.toLowerCase()));
  return rows;
}

// ---------------------------------------------------------------------------------------------------------
// Allergies

const HYPERSENSITIVITY_RE = /hives|urticaria|rash|swell|angioedema|anaphyla|bronchospasm|wheez|itch|prurit|erythema|blister|stevens|sjs\b|\bten\b|toxic epidermal|dress\b|throat (closing|tightness)|shortness of breath|difficulty breathing|flushing|serum sickness|exanthem|dermatitis|hypersensitivity|allergic/i;
const SERIOUS_RE = /ketoacidosis|\bdka\b|pancreatitis|liver|hepat|kidney injury|renal (failure|injury)|\baki\b|nephritis|agranulocytosis|neutropenia|thrombocytopenia|aplastic|rhabdo|qt prolong|torsade|arrhythm|bleed|hemorrhage|lactic acidosis|seizure|tendon rupture|myocarditis|neuroleptic malignant|serotonin syndrome|hyperkalemia|hyponatremia|hypoglycemi|c\.? ?diff|colitis|syncope|respiratory depression/i;
const NON_IMMUNE_RE = /cough|nausea|vomit|gi upset|stomach upset|upset stomach|dyspepsia|diarrh|constipat|drowsi|sedation|somnolen|dizz|lighthead|headache|myalgia|muscle (ache|pain)|ketoacidosis|\bdka\b|hyperkalemia|hypoglycemi|hyponatremia|lactic acidosis|bradycardia|hypotension|ankle (edema|swelling)|edema|insomnia|jitter|palpitation|tremor|fatigue|flushing on niacin|yeast infection/i;

function classifyReaction(reaction: string | undefined): { type: AllergyIntoleranceRow["reaction_type"]; mech: AllergyIntoleranceRow["mechanism"] } {
  if (!reaction) return { type: "hypersensitivity", mech: "unknown" };
  if (HYPERSENSITIVITY_RE.test(reaction)) return { type: "hypersensitivity", mech: "unknown" };
  if (SERIOUS_RE.test(reaction)) return { type: "serious_adverse_event", mech: NON_IMMUNE_RE.test(reaction) ? "non_immune" : "unknown" };
  return { type: "side_effect", mech: NON_IMMUNE_RE.test(reaction) ? "non_immune" : "unknown" };
}

function criticalityOf(sev: unknown, type: AllergyIntoleranceRow["reaction_type"]): AllergyIntoleranceRow["criticality"] {
  if (sev === "severe") return "high";
  if (sev === "mild" || sev === "moderate") return "low";
  if (type === "serious_adverse_event") return "high";
  return "unknown";
}

function isSingleDrugName(s: string): boolean {
  // Treat as a single drug when it looks like a drug product name (has a strength, form or known brand).
  return /\d\s*(mg|mcg|g|units?)\b/i.test(s) || BRANDS[s.toLowerCase().split(/\s+/)[0]] !== undefined;
}

function allergySubstance(e: Record<string, any>): string | undefined {
  const s = str(e.substance);
  if (!s) return undefined;
  if (/^(no known|nkda|nka|none|no allergies|no drug allergies)/i.test(s)) return undefined;
  if (str(e.rxnorm_ingredient) || isSingleDrugName(s)) return ingredientFromName(s) ?? s.toLowerCase();
  return s;
}

interface DxAttribution {
  drugText: string;
  conditionOnly: boolean;
}

const ATTRIB_PATTERNS: RegExp[] = [
  /^(?:adverse (?:effect|reaction|event)|allergy|allergic reaction|intolerance|poisoning) (?:of|to|from) (.+?)(?:,.*)?$/i,
  /\b(?:due to|secondary to|caused by|induced by|from|attributed to|related to|associated with|after|following|on)\s+(.+?)(?:\s+(?:use|therapy|treatment|exposure|ingestion))?\s*$/i,
  /(?:^|[\s,(])([a-z0-9][a-z0-9 \-\/]*?)[- ](?:induced|associated|related|provoked)\b/i,
];

function findDrugAttribution(label: string, icd: string | undefined): DxAttribution | undefined {
  const adverseCode = icd ? /^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/i.test(icd) || /^T88\.[67]/i.test(icd) : false;
  for (const re of ATTRIB_PATTERNS) {
    const m = re.exec(label);
    if (m && m[1]) {
      const text = m[1].trim();
      if (text) return { drugText: text, conditionOnly: re === ATTRIB_PATTERNS[0] };
    }
  }
  if (adverseCode && /^adverse/i.test(label)) return { drugText: label, conditionOnly: true };
  return undefined;
}

/** Resolve attribution text to a drug: named drug, or a class with exactly one member on the item's med list. */
function resolveDrug(
  text: string,
  item: FolioItem,
): { substance: string; rxnorm?: string; evidence?: Entry } | undefined {
  const t = text.toLowerCase();
  const meds = entriesOf(item, "home_med").concat(entriesOf(item, "inpatient_med"));
  // Named drug on the item's lists.
  for (const en of meds) {
    const ing = ingredientFromName(str(en.e.drug_name));
    if (ing && new RegExp(`\\b${ing.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(t)) {
      return { substance: ing, rxnorm: str(en.e.rxnorm_ingredient), evidence: en };
    }
  }
  // Named drug by brand or generic dictionary.
  for (const [brand, generic] of Object.entries(BRANDS)) {
    if (new RegExp(`\\b${brand}\\b`, "i").test(t)) return { substance: generic };
  }
  for (const cls of DRUG_CLASSES) {
    for (const mbr of cls.members) if (new RegExp(`\\b${mbr}\\b`, "i").test(t)) return { substance: mbr };
  }
  for (const cls of DRUG_CLASSES) {
    if (!cls.re.test(t)) continue;
    const onList: { ing: string; en: Entry }[] = [];
    for (const en of meds) {
      const ing = ingredientFromName(str(en.e.drug_name));
      if (ing && cls.members.includes(ing) && !onList.some((x) => x.ing === ing)) onList.push({ ing, en });
    }
    if (onList.length === 1) return { substance: onList[0].ing, rxnorm: str(onList[0].en.e.rxnorm_ingredient), evidence: onList[0].en };
    const m = new RegExp(cls.re.source + "[a-z0-9 \\-]*", "i").exec(text);
    return { substance: (m ? m[0] : text).trim() };
  }
  if (/\bdrug|medication|medicine\b/i.test(t)) return { substance: text };
  return undefined;
}

function reactionFromLabel(label: string): string {
  const cut = label
    .replace(/,?\s*(?:due to|secondary to|caused by|induced by|attributed to|related to|associated with)\s+.*$/i, "")
    .replace(/,?\s*[a-z0-9][a-z0-9 \-\/]*?[- ](?:induced|associated|related|provoked)\b.*$/i, "")
    .trim();
  return cut || label;
}

// ---------------------------------------------------------------------------------------------------------
// Problems

interface DxRec {
  en: Entry;
  label: string;
  icd?: string;
  rcode?: string;
  status: string; // active | resolved | working | ruled_out | history
  onset?: string;
  t: number;
  idx: number;
}

function normLabel(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function ckdStage(label: string, icd: string | undefined): { stage?: ProblemRow["ckd_stage"]; alb?: ProblemRow["albuminuria"] } {
  const out: { stage?: ProblemRow["ckd_stage"]; alb?: ProblemRow["albuminuria"] } = {};
  const l = label;
  const g = /\bG(1|2|3a|3b|4|5)\b/i.exec(l);
  if (g) out.stage = ("G" + g[1].toLowerCase()) as ProblemRow["ckd_stage"];
  else {
    const s = /stage\s*(1|2|3a|3b|4|5|i{1,3}v?|v|iii?a|iii?b)\b/i.exec(l);
    if (s) {
      const v = s[1].toLowerCase();
      const map: Record<string, ProblemRow["ckd_stage"]> = { "1": "G1", i: "G1", "2": "G2", ii: "G2", "3a": "G3a", iiia: "G3a", "3b": "G3b", iiib: "G3b", "4": "G4", iv: "G4", "5": "G5", v: "G5" };
      out.stage = map[v];
    } else if (icd) {
      const c = icd.toUpperCase();
      const map: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
      if (map[c]) out.stage = map[c];
    }
  }
  const a = /\bA([123])\b/.exec(l);
  if (a) out.alb = ("A" + a[1]) as ProblemRow["albuminuria"];
  return out;
}

function buildProblemsAndAllergies(items: FolioItem[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const recs: DxRec[] = [];
  let idx = 0;
  for (const it of items) {
    const t = itemTime(it);
    for (const en of entriesOf(it, "diagnosis")) {
      const label = str(en.e.label);
      if (!label) continue;
      const status = typeof en.e.status === "string" ? en.e.status : "active";
      recs.push({
        en,
        label,
        icd: str(en.e.icd10cm),
        rcode: isObj(en.e.riverside_dx) ? str(en.e.riverside_dx.code) : undefined,
        status,
        t,
        idx: idx++,
      });
    }
    for (const en of entriesOf(it, "history")) {
      const label = str(en.e.condition);
      if (!label) continue;
      recs.push({
        en,
        label,
        icd: str(en.e.icd10cm),
        status: "history",
        onset: parseOnsetText(str(en.e.onset_text)),
        t,
        idx: idx++,
      });
    }
  }

  // Group entries naming the same condition (shared Riverside code, ICD-10-CM code or wording).
  const parent = recs.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const keyOwner = new Map<string, number>();
  recs.forEach((r, i) => {
    const keys = [`l:${normLabel(r.label)}`];
    if (r.rcode) keys.push(`r:${r.rcode}`);
    if (r.icd && !/^R/i.test(r.icd)) keys.push(`i:${r.icd.toUpperCase()}`);
    for (const k of keys) {
      const o = keyOwner.get(k);
      if (o === undefined) keyOwner.set(k, i);
      else parent[find(i)] = find(o);
    }
  });
  const groups = new Map<number, DxRec[]>();
  recs.forEach((r, i) => {
    const g = find(i);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(r);
  });

  const problems: ProblemRow[] = [];
  const allergyRows = new Map<string, { row: AllergyIntoleranceRow; t: number }>();

  for (const g of groups.values()) {
    g.sort((a, b) => a.t - b.t || a.idx - b.idx);
    const confirmed = g.filter((r) => r.status === "active" || r.status === "resolved" || r.status === "history" || r.status === "ruled_out");
    if (confirmed.length === 0) continue; // only suspected
    const lastDecisive = confirmed[confirmed.length - 1];
    if (lastDecisive.status === "ruled_out") continue;
    const latest = g.filter((r) => r.status !== "ruled_out" && r.status !== "working");
    const cur = latest[latest.length - 1];
    const dxOnly = latest.filter((r) => r.status !== "history");
    let status: ProblemRow["status"];
    if (dxOnly.length > 0) {
      const lastDx = dxOnly[dxOnly.length - 1];
      status = lastDx.status === "resolved" && !(cur.status === "history" && cur.t > lastDx.t && false) ? "resolved" : "active";
    } else {
      status = /\b(history of|h\/o|s\/p|status post|resolved|remote|childhood|prior)\b/i.test(cur.label) ? "resolved" : "active";
    }

    const icd = cur.icd ?? undefined;
    const attribution = findDrugAttribution(cur.label, icd);
    let drug: ReturnType<typeof resolveDrug> | undefined;
    if (attribution) drug = resolveDrug(attribution.drugText, cur.en.item);
    const allergyOnly = !!attribution && attribution.conditionOnly && !!drug;

    if (!allergyOnly) {
      const row: ProblemRow = { condition: cur.label, status, evidence: [] };
      if (icd) row.icd10cm = icd;
      const onsetRec = [...latest].reverse().find((r) => r.onset);
      if (onsetRec && onsetRec.onset) row.onset = { value: onsetRec.onset, precision: precisionOf(onsetRec.onset) };
      const isCkd = /chronic kidney disease|\bckd\b/i.test(cur.label) || /^N18/i.test(icd ?? "");
      if (isCkd) {
        for (const r of latest) {
          const s = ckdStage(r.label, r.icd);
          if (s.stage) row.ckd_stage = s.stage;
          if (s.alb) row.albuminuria = s.alb;
        }
      }
      const sens = conditionSensitivity(cur.label, icd);
      if (sens) row.sensitivity = sens;
      row.evidence = dedupEvidence([ev(cur.en), ...latest.slice().reverse().map((r) => ev(r.en))]);
      problems.push(row);
    }

    if (attribution && drug) {
      const firstWithAttr = latest.find((r) => findDrugAttribution(r.label, r.icd)) ?? cur;
      const reaction = attribution.conditionOnly ? undefined : reactionFromLabel(cur.label);
      const cls = classifyReaction(reaction ?? cur.label);
      // A serious drug-attributed diagnosis is not a hypersensitivity unless its wording says so.
      const aRow: AllergyIntoleranceRow = {
        substance: drug.substance,
        reaction_type: cls.type,
        mechanism: cls.mech,
        criticality: cls.type === "serious_adverse_event" ? "high" : "unknown",
        evidence: [],
      };
      if (drug.rxnorm) aRow.rxnorm_ingredient = drug.rxnorm;
      if (reaction) aRow.reaction = reaction;
      const onsetDate = localDate(str(firstWithAttr.en.item.effective));
      if (onsetDate) aRow.onset = { value: onsetDate, precision: precisionOf(onsetDate) };
      const sens = drugSensitivity(drug.substance);
      if (sens) aRow.sensitivity = sens;
      const evs: Evidence = [ev(cur.en)];
      if (drug.evidence) evs.push(ev(drug.evidence));
      aRow.evidence = dedupEvidence(evs);
      const k = drug.substance.toLowerCase();
      const prev = allergyRows.get("dx:" + k);
      if (!prev || prev.t <= cur.t) allergyRows.set("dx:" + k, { row: aRow, t: cur.t });
    }
  }

  // Allergy list entries: latest entry per substance across documents.
  const listRows = new Map<string, { row: AllergyIntoleranceRow; t: number; evs: Evidence }>();
  for (const it of items) {
    const t = itemTime(it);
    for (const en of entriesOf(it, "allergy")) {
      const substance = allergySubstance(en.e);
      if (!substance) continue;
      const reaction = str(en.e.reaction);
      const cls = classifyReaction(reaction);
      const row: AllergyIntoleranceRow = {
        substance,
        reaction_type: cls.type,
        mechanism: cls.mech,
        criticality: criticalityOf(en.e.severity, cls.type),
        evidence: [],
      };
      const rx = str(en.e.rxnorm_ingredient);
      if (rx) row.rxnorm_ingredient = rx;
      if (reaction) row.reaction = reaction.split(/\s*[;,]\s*|\s+and\s+/).filter((x) => x).join("; ");
      const sens = drugSensitivity(substance);
      if (sens) row.sensitivity = sens;
      const k = substance.toLowerCase();
      const prev = listRows.get(k);
      if (!prev || prev.t <= t) listRows.set(k, { row, t, evs: [ev(en)] });
    }
  }

  const allergies: AllergyIntoleranceRow[] = [];
  for (const [k, v] of listRows) {
    v.row.evidence = v.evs;
    allergies.push(v.row);
    allergyRows.delete("dx:" + k);
  }
  for (const v of allergyRows.values()) allergies.push(v.row);
  allergies.sort((a, b) => cmp(a.substance.toLowerCase(), b.substance.toLowerCase()));
  problems.sort((a, b) => cmp(a.condition.toLowerCase(), b.condition.toLowerCase()));
  return { problems, allergies };
}

// ---------------------------------------------------------------------------------------------------------
// Labs

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "14682-9": "creatinine", "77140-2": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr", "33914-3": "egfr", "48642-3": "egfr",
  "48643-1": "egfr", "77147-7": "egfr", "50044-7": "egfr", "50210-4": "egfr", "69405-9": "egfr", "98980-6": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "39789-3": "potassium", "77142-8": "potassium",
  "2951-2": "sodium", "2947-0": "sodium", "39791-9": "sodium", "77139-4": "sodium",
  "2075-0": "chloride", "2069-3": "chloride", "41650-3": "chloride", "77138-6": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "14627-4": "bicarbonate", "1960-4": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "14937-7": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose", "14749-6": "glucose", "15074-8": "glucose", "41651-1": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "14958-3": "uacr", "32294-1": "uacr", "13705-9": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets", "778-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "804-5": "wbc", "49498-9": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin", "55782-7": "hemoglobin", "59260-0": "hemoglobin",
  "53060-9": "bhb", "47906-3": "bhb", "49242-1": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2745-8": "ph", "33254-4": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "2020-6": "pco2",
  "3040-3": "lipase", "1990-1": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin", "76399-5": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "69419-0": "ldl", "96259-7": "ldl",
};

const LOCAL_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", CREA: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", HCO3: "bicarbonate", TCO2: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun",
  GLU: "glucose", GLUC: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin",
  HB: "hemoglobin", BHB: "bhb", PH: "ph", VPH: "ph", APH: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2",
  LIPASE: "lipase", LIP: "lipase", TROP: "troponin", TROPI: "troponin", TNI: "troponin", HSTNI: "troponin",
  CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

function analyteFromName(name: string): Analyte | undefined {
  const n = name.toLowerCase();
  if (/troponin\s*t\b/.test(n)) return undefined;
  if (/egfr|glomerular filtration/.test(n)) return "egfr";
  if (/albumin.*creatinine|\buacr\b|\bacr\b/.test(n)) return "uacr";
  if (/creatinine/.test(n) && !/urine|clearance|kinase/.test(n)) return "creatinine";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/potassium/.test(n)) return "potassium";
  if (/sodium/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/bicarbonate|total co2|\bco2, total|carbon dioxide/.test(n)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/a1c|glycated h|glycosylated h/.test(n)) return "a1c";
  if (/glucose/.test(n) && !/meter|poc|point of care|fingerstick|capillary|home|urine|csf/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/white blood|leukocyte|\bwbc\b/.test(n)) return "wbc";
  if (/hemoglobin|haemoglobin|\bhgb\b/.test(n) && !/a1c|glyc/.test(n)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b|ketone/.test(n)) return /hydroxybutyrate|\bbhb\b/.test(n) ? "bhb" : undefined;
  if (/^p?h\b|\bph\b/.test(n)) return "ph";
  if (/pco2|partial pressure of carbon dioxide/.test(n)) return "pco2";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n)) return "troponin";
  if (/\bhdl\b/.test(n)) return "hdl";
  if (/\bldl\b/.test(n)) return "ldl";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n)) return "cholesterol";
  return undefined;
}

const UNIT_OF: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function normUnit(u: string): string {
  return u.trim().replace(/\s+/g, "").replace(/µ|μ/g, "u").toLowerCase();
}

/** Convert a value to the analyte's unit. Returns undefined if the unit is not understood. */
function convert(analyte: Analyte, v: number, unitRaw: string | undefined): number | undefined {
  const u = unitRaw ? normUnit(unitRaw) : "";
  const target = normUnit(UNIT_OF[analyte]);
  if (u === target) return v;
  switch (analyte) {
    case "creatinine":
      if (u === "" ) return v;
      if (u === "umol/l") return v / 88.42;
      if (u === "mg/l") return v / 10;
      return undefined;
    case "egfr":
      if (u === "" || /^ml\/min(\/1\.73m\^?2|\/1\.73m2|\/1\.73sqm|\/1\.73\{m2\}|\/{1\.73_m2})?$/.test(u) || u.startsWith("ml/min")) return v;
      return undefined;
    case "potassium":
    case "sodium":
    case "chloride":
    case "bicarbonate":
    case "anion_gap":
      if (u === "" || u === "meq/l" || u === "mmol/l") return v;
      return undefined;
    case "bun":
      if (u === "" || u === "mg/dl") return v;
      if (u === "mmol/l") return v * 2.801;
      return undefined;
    case "glucose":
      if (u === "" || u === "mg/dl") return v;
      if (u === "mmol/l") return v * 18.016;
      return undefined;
    case "a1c":
      if (u === "" || u === "%" || u === "%hb" || u === "%ofhb" || u === "%{hb}") return v;
      if (u === "mmol/mol") return 0.09148 * v + 2.152;
      return undefined;
    case "uacr":
      if (u === "" || u === "mg/g" || u === "mg/gcreat" || u === "mg/g{creat}" || u === "ug/mg" || u === "ug/mgcreat" || u === "mcg/mg") return v;
      if (u === "mg/mmol" || u === "mg/mmolcreat") return v * 8.842;
      return undefined;
    case "platelets":
    case "wbc":
      if (u === "" || u === "10*3/ul" || u === "k/ul" || u === "10^3/ul" || u === "x10^3/ul" || u === "thou/ul" || u === "10*9/l" || u === "10^9/l" || u === "x10^9/l" || u === "k/mm3" || u === "10*3/mm3") return v;
      if (u === "/ul" || u === "cells/ul" || u === "/mm3") return v / 1000;
      return undefined;
    case "hemoglobin":
      if (u === "" || u === "g/dl") return v;
      if (u === "g/l") return v / 10;
      if (u === "mmol/l") return v * 1.611;
      return undefined;
    case "bhb":
      if (u === "" || u === "mmol/l") return v;
      if (u === "mg/dl") return v / 10.41;
      if (u === "umol/l") return v / 1000;
      return undefined;
    case "ph":
      if (u === "" || u === "[ph]" || u === "ph") return v;
      return undefined;
    case "pco2":
      if (u === "" || u === "mmhg" || u === "mm[hg]") return v;
      if (u === "kpa") return v * 7.50062;
      return undefined;
    case "lipase":
      if (u === "" || u === "u/l" || u === "iu/l" || u === "units/l") return v;
      return undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return v / 1000;
      return undefined;
    case "cholesterol":
    case "hdl":
    case "ldl":
      if (u === "" || u === "mg/dl") return v;
      if (u === "mmol/l") return v * 38.67;
      return undefined;
    case "triglycerides":
      if (u === "" || u === "mg/dl") return v;
      if (u === "mmol/l") return v * 88.57;
      return undefined;
  }
  return undefined;
}

function egfrEquation(name: string, loinc: string | undefined): LabResultRow["egfr_equation"] {
  const n = name.toLowerCase();
  if (/2021|race[- ]free|without race/.test(n) || loinc === "98979-8" || loinc === "98980-6") return "ckd-epi-2021";
  if (/mdrd/.test(n) || loinc === "33914-3" || loinc === "48642-3" || loinc === "48643-1" || loinc === "77147-7") return "mdrd";
  if (/ckd-?epi|2009/.test(n) || loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  return "unknown";
}

function isRaceVariant(name: string, loinc: string | undefined): "black" | "nonblack" | undefined {
  const n = name.toLowerCase();
  if (loinc === "88293-6" || loinc === "48643-1") return "black";
  if (loinc === "88294-4" || loinc === "48642-3") return "nonblack";
  if (/non[- ]?(african|black|aa\b)/.test(n)) return "nonblack";
  if (/african|black|\baa\b/.test(n)) return "black";
  return undefined;
}

interface LabCopy {
  analyte: Analyte;
  value: number;
  comparator?: LabResultRow["comparator"];
  collected: string;
  statusRank: number;
  status: "final" | "preliminary";
  loinc?: string;
  testName: string;
  testKey: string;
  accession: string;
  race?: "black" | "nonblack";
  equation?: LabResultRow["egfr_equation"];
  en: Entry;
  t: number;
  recorded: number;
}

function labCopy(
  rv: Record<string, any>,
  accession: string,
  collected: string | undefined,
  specimen: string | undefined,
  status: unknown,
  en: Entry,
): LabCopy | undefined {
  if (!isObj(rv.test)) return undefined;
  const loinc = str(rv.test.loinc);
  const local = str(rv.test.local_code);
  const name = str(rv.test.name) ?? "";
  let analyte: Analyte | undefined = (loinc && LOINC_ANALYTE[loinc]) || (local && LOCAL_ANALYTE[local.toUpperCase()]) || analyteFromName(name);
  if (!analyte) return undefined;
  const spec = (specimen ?? "").toLowerCase();
  if (analyte === "uacr") {
    if (spec && !/urine/.test(spec)) return undefined;
  } else if (/urine|csf|cerebrospinal|fluid|stool|capillary|fingerstick|meter/.test(spec) && analyte !== "ph" && analyte !== "pco2") {
    return undefined;
  } else if (/urine/.test(spec)) return undefined;
  if (analyte === "glucose" && /meter|poc|point of care|fingerstick|capillary/i.test(name)) return undefined;
  if (analyte === "troponin" && /troponin\s*t\b|tnt/i.test(name)) return undefined;
  if (status !== "preliminary" && status !== "final" && status !== "corrected") return undefined;
  if (!collected) return undefined;
  const raw = typeof rv.value === "number" ? String(rv.value) : str(rv.value);
  if (!raw) return undefined;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(raw.replace(/,/g, ""));
  if (!m) return undefined;
  let comparator: LabResultRow["comparator"] | undefined;
  if (m[1]) comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as LabResultRow["comparator"];
  const v = convert(analyte, parseFloat(m[2]), str(rv.unit));
  if (v === undefined || !isFinite(v)) return undefined;
  const collectedOut = localRfc3339(collected);
  if (!collectedOut) return undefined;
  const statusRank = status === "corrected" ? 3 : status === "final" ? 2 : 1;
  const copy: LabCopy = {
    analyte,
    value: round(v, 4),
    comparator,
    collected: collectedOut,
    statusRank,
    status: status === "preliminary" ? "preliminary" : "final",
    loinc,
    testName: name,
    testKey: (loinc ?? "") + "|" + (local ?? "").toUpperCase() + "|" + (loinc || local ? "" : name.toLowerCase()),
    accession,
    en,
    t: itemTime(en.item),
    recorded: toEpoch(str(en.item.recorded)) ?? 0,
  };
  if (analyte === "egfr") {
    copy.equation = egfrEquation(name, loinc);
    copy.race = isRaceVariant(name, loinc);
  }
  return copy;
}

function buildLabs(items: FolioItem[]): LabResultRow[] {
  const copies: LabCopy[] = [];
  for (const it of items) {
    for (const en of entriesOf(it, "result")) {
      const c = labCopy(en.e, str(en.e.accession) ?? "", str(en.e.collected), str(en.e.specimen), en.e.status, en);
      if (c) copies.push(c);
    }
    for (const en of entriesOf(it, "panel")) {
      if (!Array.isArray(en.e.components)) continue;
      for (const comp of en.e.components) {
        if (!isObj(comp)) continue;
        const c = labCopy(comp, str(en.e.accession) ?? "", str(en.e.collected), str(en.e.specimen), en.e.status, en);
        if (c) copies.push(c);
      }
    }
  }
  // One result = accession + test (+ collection time when no accession).
  const groups = new Map<string, LabCopy[]>();
  for (const c of copies) {
    const k = `${c.accession || "noacc:" + c.collected}\u0000${c.analyte}\u0000${c.testKey}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(c);
  }
  const chosen: { best: LabCopy; all: LabCopy[] }[] = [];
  for (const g of groups.values()) {
    g.sort((a, b) => b.statusRank - a.statusRank || b.t - a.t || b.recorded - a.recorded || cmp(a.en.item.id, b.en.item.id));
    chosen.push({ best: g[0], all: g });
  }
  // eGFR race variants: when a specimen has a race-free / non-race variant, drop the "black" variant.
  const rows: LabResultRow[] = [];
  for (const { best, all } of chosen) {
    if (best.analyte === "egfr" && best.race === "black") {
      const sibling = chosen.some(
        (o) => o.best !== best && o.best.analyte === "egfr" && o.best.accession === best.accession && o.best.collected === best.collected && o.best.race !== "black",
      );
      if (sibling) continue;
    }
    const row: LabResultRow = {
      analyte: best.analyte,
      value: best.value,
      unit: UNIT_OF[best.analyte],
      collected: best.collected,
      status: best.status,
      evidence: [],
    };
    if (best.comparator) row.comparator = best.comparator;
    if (best.analyte === "egfr") row.egfr_equation = best.equation ?? "unknown";
    if (best.loinc) row.loinc = best.loinc;
    const sameValue = all.filter((c) => c.value === best.value && c.statusRank === best.statusRank);
    row.evidence = dedupEvidence([best, ...sameValue].map((c) => ev(c.en)));
    rows.push(row);
  }
  rows.sort((a, b) => cmp(a.collected, b.collected) || cmp(a.analyte, b.analyte) || a.value - b.value);
  return rows;
}

// ---------------------------------------------------------------------------------------------------------
// Vitals

interface VitalCopy {
  en: Entry;
  time: string;
  epoch: number;
  sys?: number;
  dia?: number;
  pulse?: number;
  weight?: number;
  other: boolean;
}

function buildVitals(items: FolioItem[]): VitalRow[] {
  const copies: VitalCopy[] = [];
  for (const it of items) {
    for (const en of entriesOf(it, "vitals")) {
      const time = localMinute(str(en.e.taken));
      const epoch = toEpoch(str(en.e.taken));
      if (!time || epoch === undefined) continue;
      const c: VitalCopy = { en, time, epoch, other: false };
      if (isObj(en.e.bp)) {
        const s = num(en.e.bp.systolic_mmhg);
        const d = num(en.e.bp.diastolic_mmhg);
        if (s !== undefined && d !== undefined) {
          c.sys = s;
          c.dia = d;
        }
      }
      c.pulse = num(en.e.heart_rate_bpm);
      const w = num(en.e.weight_kg);
      if (w !== undefined) c.weight = round(w, 1);
      c.other = num(en.e.resp_rate_per_min) !== undefined || num(en.e.temp_f) !== undefined || num(en.e.spo2_pct) !== undefined;
      if (c.sys === undefined && c.pulse === undefined && c.weight === undefined && !c.other) continue;
      copies.push(c);
    }
  }
  // Same set restated in several documents: one row.
  const sig = (c: VitalCopy) => [c.time, c.sys, c.dia, c.pulse, c.weight].join("|");
  const bySig = new Map<string, VitalCopy[]>();
  for (const c of copies) {
    const k = sig(c);
    if (!bySig.has(k)) bySig.set(k, []);
    bySig.get(k)!.push(c);
  }
  const sets = [...bySig.values()].map((g) => g.sort((a, b) => cmp(a.en.item.id, b.en.item.id)));
  sets.sort((a, b) => a[0].epoch - b[0].epoch || cmp(sig(a[0]), sig(b[0])));

  const rows: VitalRow[] = [];
  const used = new Set<number>();
  for (let i = 0; i < sets.length; i++) {
    if (used.has(i)) continue;
    const base = sets[i][0];
    const row: VitalRow = { setting: "hospital", local_time: base.time, evidence: sets[i].map((c) => ev(c.en)) };
    if (base.sys !== undefined) {
      row.systolic_mmhg = base.sys;
      row.diastolic_mmhg = base.dia;
    }
    if (base.pulse !== undefined) row.pulse_bpm = base.pulse;
    if (base.weight !== undefined) row.weight_kg = base.weight;
    // A repeat blood pressure recorded alone within the same item shortly after the set.
    for (let j = i + 1; j < sets.length; j++) {
      if (used.has(j)) continue;
      const c = sets[j][0];
      if (c.epoch - base.epoch > 30 * 60000) break;
      const sameItem = sets[j].some((x) => sets[i].some((y) => y.en.item.id === x.en.item.id));
      const bpOnly = c.sys !== undefined && c.pulse === undefined && c.weight === undefined && !c.other;
      if (sameItem && bpOnly && base.sys !== undefined && row.repeat_systolic_mmhg === undefined) {
        row.repeat_systolic_mmhg = c.sys;
        row.repeat_diastolic_mmhg = c.dia;
        row.evidence = dedupEvidence(row.evidence.concat(sets[j].map((x) => ev(x.en))));
        used.add(j);
      }
    }
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------------------------------------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return empty;
  let counting: FolioItem[];
  try {
    counting = countingItems(items, asOf.trim()).sort(itemOrder);
  } catch {
    return empty;
  }
  const safe = <T>(f: () => T[]): T[] => {
    try {
      return f();
    } catch {
      return [];
    }
  };
  const pa = (() => {
    try {
      return buildProblemsAndAllergies(counting);
    } catch {
      return { problems: [] as ProblemRow[], allergies: [] as AllergyIntoleranceRow[] };
    }
  })();
  return {
    medications: safe(() => buildMedications(counting)),
    problems: pa.problems,
    allergies: pa.allergies,
    labs: safe(() => buildLabs(counting)),
    vitals: safe(() => buildVitals(counting)),
  };
}
