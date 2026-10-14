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

const TZ = "America/Chicago";

// ---------------------------------------------------------------- time helpers

const OFFSET_RE = /(Z|[+-]\d{2}:?\d{2})$/i;

let dtf: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number): { y: string; mo: string; d: string; h: string; mi: string; s: string } | null {
  try {
    if (!dtf) {
      dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
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

/** Local wall-clock form of a source date/date-time: "YYYY[-MM[-DD]]" or "YYYY-MM-DDTHH:MM:SS". */
function toLocal(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?(\.\d+)?(.*)$/.exec(t);
  if (!m) return null;
  const rest = m[6].trim();
  if (rest === "") return `${m[1]}T${m[2]}:${m[3]}:${m[4] ?? "00"}`;
  if (!OFFSET_RE.test(rest)) return null;
  const ms = Date.parse(t);
  if (isNaN(ms)) return null;
  const p = chicagoParts(ms);
  if (!p) return null;
  return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}:${p.s}`;
}

function localDate(s: unknown): string | null {
  const l = toLocal(s);
  return l ? l.slice(0, 10).replace(/T.*$/, "") : null;
}

/** Chicago UTC offset ("-05:00") in effect at a local wall-clock time. */
function chicagoOffset(wall: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.exec(wall);
  if (!m) return null;
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  let guess = asUtc + 6 * 3600e3;
  for (let i = 0; i < 3; i++) {
    const p = chicagoParts(guess);
    if (!p) return null;
    const shown = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +p.mi, +p.s);
    guess += asUtc - shown;
  }
  const off = Math.round((asUtc - guess) / 60000);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  return `${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

function rfc3339Local(s: unknown): string | null {
  const l = toLocal(s);
  if (!l || !l.includes("T")) return null;
  const off = chicagoOffset(l);
  return off ? `${l}${off}` : null;
}

function fuzzy(f: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f !== "object" || typeof f.date !== "string") return undefined;
  const d = localDate(f.date);
  if (!d) return undefined;
  const prec: "year" | "month" | "day" | null =
    f.precision === "year" || f.precision === "month" || f.precision === "day" ? f.precision : null;
  const avail: "year" | "month" | "day" = d.length >= 10 ? "day" : d.length >= 7 ? "month" : "year";
  const order = { year: 0, month: 1, day: 2 } as const;
  const p = prec && order[prec] <= order[avail] ? prec : avail;
  const value = p === "year" ? d.slice(0, 4) : p === "month" ? d.slice(0, 7) : d.slice(0, 10);
  return { value, precision: p };
}

// ---------------------------------------------------------------- misc helpers

function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x.trim() : undefined;
}
function num(x: unknown): number | undefined {
  return typeof x === "number" && isFinite(x) ? x : undefined;
}
function round(v: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}
function uniq<T>(a: T[]): T[] {
  return Array.from(new Set(a));
}
function uniqEvidence(ev: Evidence): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const e of ev) {
    const k = `${e.item_id}\u0000${e.entry_id ?? ""}`;
    if (!seen.has(k)) { seen.add(k); out.push(e); }
  }
  return out;
}

interface Entry {
  item: FolioItem;
  key: string;
  e: any;
  /** sort key: local effective of the item, then recorded, then id */
  sort: string;
}

function cmpEntry(a: Entry, b: Entry): number {
  return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0;
}

// ---------------------------------------------------------------- sensitivity

const SUBSTANCE_DRUGS = ["buprenorphine", "methadone", "naltrexone", "disulfiram", "acamprosate", "varenicline", "nicotine", "naloxone", "lofexidine"];
const MH_DRUGS = [
  "quetiapine", "olanzapine", "risperidone", "aripiprazole", "ziprasidone", "lurasidone", "haloperidol", "clozapine", "paliperidone",
  "cariprazine", "brexpiprazole", "lithium", "lamotrigine", "valpro", "divalproex", "sertraline", "fluoxetine", "paroxetine",
  "citalopram", "escitalopram", "fluvoxamine", "venlafaxine", "desvenlafaxine", "duloxetine", "bupropion", "mirtazapine",
  "trazodone", "vortioxetine", "vilazodone", "amitriptyline", "nortriptyline", "imipramine", "doxepin", "buspirone",
  "methylphenidate", "amphetamine", "lisdexamfetamine", "dextroamphetamine", "atomoxetine", "guanfacine", "alprazolam",
  "lorazepam", "clonazepam", "diazepam", "hydroxyzine", "prazosin",
];
const HIV_DRUGS = ["emtricitabine", "tenofovir", "bictegravir", "dolutegravir", "raltegravir", "efavirenz", "rilpivirine", "darunavir", "atazanavir", "ritonavir", "cobicistat", "abacavir", "lamivudine", "zidovudine", "elvitegravir", "cabotegravir", "doravirine", "nevirapine", "maraviroc"];
const SRH_DRUGS = ["ethinyl estradiol", "levonorgestrel", "norethindrone", "norgestimate", "drospirenone", "desogestrel", "etonogestrel", "medroxyprogesterone", "ulipristal", "sildenafil", "tadalafil", "clomiphene", "letrozole", "progesterone", "misoprostol", "mifepristone"];
// Ambiguous drugs (e.g. hydroxyzine, prazosin, sildenafil, letrozole, lamotrigine) are only tagged when restricted;
// tag unflagged entries only for drugs whose use is plainly in the category.
const MH_AMBIGUOUS = new Set(["hydroxyzine", "prazosin", "lamotrigine", "valpro", "divalproex", "amitriptyline", "nortriptyline", "doxepin", "trazodone", "guanfacine", "diazepam", "lorazepam", "clonazepam", "alprazolam", "duloxetine", "bupropion"]);
const SRH_AMBIGUOUS = new Set(["sildenafil", "tadalafil", "letrozole", "progesterone", "misoprostol", "medroxyprogesterone"]);

function drugSensitivity(ingredients: string[], restricted: unknown): Sensitivity[] {
  const out: Sensitivity[] = [];
  const text = ingredients.join(" ").toLowerCase();
  const has = (list: string[], amb?: Set<string>) => list.some((d) => text.includes(d) && !(amb && amb.has(d)));
  const hasAny = (list: string[]) => list.some((d) => text.includes(d));
  if (has(SUBSTANCE_DRUGS)) out.push("substance-use");
  if (has(MH_DRUGS, MH_AMBIGUOUS)) out.push("mental-health");
  if (has(HIV_DRUGS)) out.push("hiv-sti");
  if (has(SRH_DRUGS, SRH_AMBIGUOUS)) out.push("sexual-reproductive-health");
  if (restricted === "BH" && !out.includes("mental-health") && !out.includes("substance-use")) {
    out.push(hasAny(SUBSTANCE_DRUGS) ? "substance-use" : "mental-health");
  }
  return uniq(out);
}

function codeSensitivity(icd: string | undefined, text: string | undefined, restricted: unknown): Sensitivity[] {
  const out: Sensitivity[] = [];
  const c = (icd ?? "").toUpperCase().replace(/\s/g, "");
  const t = (text ?? "").toLowerCase();
  const cat = c.slice(0, 3);
  const letter = c[0];
  const n = parseInt(c.slice(1, 3), 10);
  let substance = false;
  if (letter === "F" && n >= 10 && n <= 19) substance = true;
  if (/\b(alcohol|opioid|cannabis|cocaine|amphetamine|stimulant|sedative|substance|tobacco|nicotine)\b.*\b(use|abuse|dependence|disorder|withdrawal)\b/.test(t)) substance = true;
  if (substance) out.push("substance-use");
  let mh = false;
  if (letter === "F" && !(n >= 10 && n <= 19) && !isNaN(n)) mh = true;
  if (/\b(depress|bipolar|schizo|anxiety|panic disorder|ptsd|post-traumatic|psychos|psychotic|adhd|attention[- ]deficit|obsessive|ocd|eating disorder|anorexia nervosa|bulimia|suicid|personality disorder|insomnia disorder)/.test(t)) mh = true;
  if (/^R45\.85/.test(c) || /^T14\.91/.test(c)) mh = true;
  if (mh) out.push("mental-health");
  let hiv = false;
  if (cat === "B20" || cat === "Z21" || c.startsWith("Z20.6") || c.startsWith("R75")) hiv = true;
  if (letter === "A" && n >= 50 && n <= 64) hiv = true;
  if (cat === "B97" && c.startsWith("B97.35")) hiv = true;
  if (cat === "B16" || cat === "B18" && /hepatitis b/.test(t)) { /* hepatitis is not classed as STI here */ }
  if (/\b(hiv|chlamydia|gonorrh|syphilis|trichomon|genital herpes|genital wart|herpes genital)/.test(t)) hiv = true;
  if (hiv) out.push("hiv-sti");
  let srh = false;
  if (letter === "O") srh = true;
  if (["Z30", "Z31", "Z32", "Z33", "Z34", "Z35", "Z36", "Z37", "Z39", "N97", "N96", "N52", "Z3A"].includes(cat)) srh = true;
  if (/\b(pregnan|contracept|infertil|erectile dysfunction|miscarriage|abortion)/.test(t)) srh = true;
  if (srh) out.push("sexual-reproductive-health");
  let gen = false;
  if (letter === "Q" || cat === "Z15" || c.startsWith("Z14") || cat === "E84" || cat === "D57" || c.startsWith("D56") || cat === "E83" && c.startsWith("E83.11")) gen = true;
  if (/\b(brca|lynch syndrome|genetic|hereditary|inherited|sickle cell|cystic fibrosis|huntington|thalassemia)/.test(t)) gen = true;
  if (gen) out.push("genetic");
  if (restricted === "BH" && !out.includes("mental-health") && !out.includes("substance-use")) {
    out.push("mental-health");
  }
  return uniq(out);
}

// ---------------------------------------------------------------- drug names

const BRANDS: Record<string, string> = {
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  humalog: "insulin lispro", admelog: "insulin lispro", lyumjev: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart",
  levemir: "insulin detemir", tresiba: "insulin degludec", apidra: "insulin glulisine",
  glucophage: "metformin", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide",
  saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide", byetta: "exenatide", januvia: "sitagliptin",
  tradjenta: "linagliptin", amaryl: "glimepiride", glucotrol: "glipizide", actos: "pioglitazone",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin", zetia: "ezetimibe",
  norvasc: "amlodipine", zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  lotensin: "benazepril", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan",
  micardis: "telmisartan", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide",
  hctz: "hydrochlorothiazide", toprol: "metoprolol", lopressor: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  aldactone: "spironolactone", inspra: "eplerenone", kerendia: "finerenone", cardizem: "diltiazem", procardia: "nifedipine",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", jantoven: "warfarin", plavix: "clopidogrel",
  brilinta: "ticagrelor", synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", prevacid: "lansoprazole", pepcid: "famotidine",
  zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine", benadryl: "diphenhydramine", xyzal: "levocetirizine",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", flovent: "fluticasone", flonase: "fluticasone",
  singulair: "montelukast", keflex: "cephalexin", zithromax: "azithromycin", cipro: "ciprofloxacin", levaquin: "levofloxacin",
  macrobid: "nitrofurantoin", macrodantin: "nitrofurantoin", amoxil: "amoxicillin", motrin: "ibuprofen", advil: "ibuprofen",
  aleve: "naproxen", naprosyn: "naproxen", tylenol: "acetaminophen", celebrex: "celecoxib", mobic: "meloxicam",
  zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine", paxil: "paroxetine",
  effexor: "venlafaxine", cymbalta: "duloxetine", wellbutrin: "bupropion", zyban: "bupropion", remeron: "mirtazapine",
  desyrel: "trazodone", seroquel: "quetiapine", abilify: "aripiprazole", zyprexa: "olanzapine", risperdal: "risperidone",
  latuda: "lurasidone", lamictal: "lamotrigine", depakote: "divalproex", lithobid: "lithium", neurontin: "gabapentin",
  lyrica: "pregabalin", subutex: "buprenorphine", sublocade: "buprenorphine", vivitrol: "naltrexone", narcan: "naloxone",
  chantix: "varenicline", flomax: "tamsulosin", proscar: "finasteride", ultram: "tramadol", xanax: "alprazolam",
  ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam", ambien: "zolpidem", imitrex: "sumatriptan",
  zofran: "ondansetron", reglan: "metoclopramide", allopurinol: "allopurinol", zyloprim: "allopurinol", uloric: "febuxostat",
  colcrys: "colchicine", deltasone: "prednisone", medrol: "methylprednisolone", spiriva: "tiotropium", plaquenil: "hydroxychloroquine",
  viagra: "sildenafil", cialis: "tadalafil", veklury: "remdesivir", paxlovid: "nirmatrelvir / ritonavir",
  augmentin: "amoxicillin / clavulanate", bactrim: "sulfamethoxazole / trimethoprim", septra: "sulfamethoxazole / trimethoprim",
  entresto: "sacubitril / valsartan", suboxone: "buprenorphine / naloxone", zubsolv: "buprenorphine / naloxone",
  truvada: "emtricitabine / tenofovir", descovy: "emtricitabine / tenofovir", biktarvy: "bictegravir / emtricitabine / tenofovir",
  janumet: "sitagliptin / metformin", synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin",
  symbicort: "budesonide / formoterol", advair: "fluticasone / salmeterol", breo: "fluticasone / vilanterol",
  hyzaar: "losartan / hydrochlorothiazide", lotrel: "amlodipine / benazepril", vicodin: "hydrocodone / acetaminophen",
  norco: "hydrocodone / acetaminophen", percocet: "oxycodone / acetaminophen", oxycontin: "oxycodone",
};

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "magnesium", "besylate", "maleate", "tartrate", "succinate",
  "mesylate", "citrate", "sulfate", "phosphate", "fumarate", "trihydrate", "monohydrate", "dihydrate", "hemihydrate",
  "hyclate", "bromide", "acetate", "propionate", "dipropionate", "furoate", "xinafoate", "valerate", "bitartrate",
  "disodium", "hydrobromide", "dihydrochloride", "anhydrous", "medoxomil", "axetil", "pivoxil", "monosodium",
  "camsylate", "tosylate", "lactate", "gluconate", "nitrate", "oxalate", "malate", "dimesylate", "alafenamide",
  "disoproxil", "olamine", "pamoate", "decanoate", "chloride",
]);
// salts that are the ingredient themselves when standing alone
const FORM_WORDS = new Set([
  "oral", "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "solution", "suspension", "injection",
  "injectable", "inhaler", "inhalation", "aerosol", "powder", "cream", "ointment", "gel", "patch", "transdermal", "topical",
  "nasal", "spray", "ophthalmic", "drops", "pen", "injector", "auto-injector", "prefilled", "syringe", "er", "xr", "sr",
  "xl", "dr", "ec", "cr", "la", "extended", "delayed", "release", "chewable", "disintegrating", "odt", "film", "coated",
  "metered", "dose", "mdi", "hfa", "pump", "kit", "vial", "liquid", "elixir", "syrup", "lozenge", "sublingual", "buccal",
  "rectal", "suppository", "vaginal", "otic", "lotion", "foam", "shampoo", "intravenous", "subcutaneous", "intramuscular",
  "product", "pack", "actuat", "actuation", "dry", "flexpen", "kwikpen", "solostar", "flextouch", "cartridge",
]);

function stripPart(part: string): string {
  let words = part.trim().split(/\s+/).filter(Boolean);
  // cut at the first strength token
  const idx = words.findIndex((w) => /^\d/.test(w) || /^\d*\.\d/.test(w));
  if (idx > 0) words = words.slice(0, idx);
  else if (idx === 0) words = words.filter((w) => !/^\d/.test(w));
  words = words.filter((w) => !FORM_WORDS.has(w) && !/^(mg|mcg|ml|unt|units?|meq|%|hr|h)$/.test(w) && !/^[\d.\/%]+$/.test(w));
  while (words.length > 1 && SALTS.has(words[words.length - 1])) words.pop();
  return words.join(" ").trim();
}

/** Generic ingredient(s), lower case, from a drug name. Empty when it cannot tell. */
function ingredientsOf(name: string): string[] {
  let n = name.toLowerCase().replace(/[®™]/g, "").trim();
  // brand in brackets: "... [Lantus]"
  const br = /\[([^\]]+)\]/.exec(n);
  n = n.replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ").replace(/\([^)]*\)/g, " ");
  // leading quantity / duration: "3 ml ...", "24 hr ..."
  n = n.replace(/^\s*(\d+(\.\d+)?\s*(ml|hr|h|day|actuat)\s+)+/i, "");
  n = n.replace(/,/g, " ").replace(/\s+/g, " ").trim();
  const first = n.split(/[\s\/-]+/)[0];
  if (BRANDS[first]) return BRANDS[first].split(" / ");
  if (br && BRANDS[br[1].trim().split(/\s+/)[0]] && !n) return BRANDS[br[1].trim().split(/\s+/)[0]].split(" / ");
  const parts = n.split(/\s+\/\s+|\s+and\s+|\s*\+\s*|-(?=[a-z]{4,}\b)/).map(stripPart).filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    const b = BRANDS[p.split(" ")[0]];
    if (b) out.push(...b.split(" / "));
    else out.push(p);
  }
  return uniq(out);
}

/** True when the name is a bare ingredient (so a code given with it is ingredient-level). */
function isBareIngredient(name: string): boolean {
  const n = name.trim().toLowerCase();
  if (/\d/.test(n) || /[\[\]{}\/]/.test(n)) return false;
  const ing = ingredientsOf(name);
  return ing.length === 1 && ing[0] === n;
}

// ---------------------------------------------------------------- medications

function normUnit(u: string): string | null {
  const x = u.trim().toLowerCase().replace(/\.$/, "");
  if (/^(mg|mgs|milligrams?)$/.test(x)) return "mg";
  if (/^(mcg|µg|μg|ug|micrograms?)$/.test(x)) return "mcg";
  if (/^(g|grams?|gm)$/.test(x)) return "g";
  if (/^(u|iu|units?|unt)$/.test(x)) return "units";
  if (/^(ml|cc|milliliters?|millilitres?)$/.test(x)) return "mL";
  if (/^(tab|tabs|tablets?)$/.test(x)) return "tablet";
  if (/^(cap|caps|capsules?)$/.test(x)) return "capsule";
  if (/^(puffs?|actuations?|actuat|inhalations?|sprays?)$/.test(x)) return "puff";
  return null;
}

interface Strength { value: number; unit: string; per?: string }
function strengthOf(name: string): Strength | null {
  const n = name.toLowerCase();
  if (/\s\/\s/.test(n.replace(/\d\s*(mg|mcg|unt|ml)\s*\/\s*(ml|actuat)/g, ""))) return null; // combination
  const m = /(\d+(?:\.\d+)?)\s*(mg|mcg|unt|units|meq)(?:\s*\/\s*(\d+(?:\.\d+)?)?\s*(ml|actuat|actuation|puff))?/.exec(n);
  if (!m) return null;
  let v = parseFloat(m[1]);
  if (m[3]) v = v / parseFloat(m[3]);
  const unit = m[2] === "unt" ? "units" : m[2];
  return { value: v, unit, per: m[4] ? (m[4] === "ml" ? "mL" : "puff") : undefined };
}

function computeDose(e: any, drugName: string, singleIngredient: boolean): MedicationRow["dose"] | undefined {
  const d = e && e.dose;
  if (!d || typeof d !== "object") return undefined;
  const v = num(d.value);
  const u = typeof d.unit === "string" ? normUnit(d.unit) : null;
  if (v === undefined || v <= 0 || !u) return undefined;
  const st = singleIngredient ? strengthOf(drugName) : null;
  if (u === "mg" || u === "mcg" || u === "units") return { value: v, unit: u };
  if (u === "g") return { value: round(v * 1000, 4), unit: "mg" };
  if (u === "tablet" || u === "capsule") {
    if (st && !st.per && (st.unit === "mg" || st.unit === "mcg" || st.unit === "units")) {
      return { value: round(v * st.value, 4), unit: st.unit as "mg" | "mcg" | "units" };
    }
    return u === "tablet" ? { value: v, unit: "tablet" } : undefined;
  }
  if (u === "puff") {
    if (st && st.per === "puff" && (st.unit === "mg" || st.unit === "mcg")) return { value: round(v * st.value, 4), unit: st.unit as "mg" | "mcg" };
    return undefined;
  }
  if (u === "mL") {
    if (st && st.per === "mL" && (st.unit === "mg" || st.unit === "mcg" || st.unit === "units")) {
      return { value: round(v * st.value, 4), unit: st.unit as "mg" | "mcg" | "units" };
    }
    return { value: v, unit: "mL" };
  }
  return undefined;
}

const FREQ: Record<string, MedicationRow["frequency"]> = { QD: "QD", BID: "BID", TID: "TID", QHS: "QHS", PRN: "PRN", OTHER: "other" };
const STOP_REASONS = new Set(["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"]);

function statusOf(action: string): MedicationRow["status"] | null {
  if (action === "start" || action === "change" || action === "resume") return "active";
  if (action === "hold") return "held";
  if (action === "stop") return "stopped";
  return null;
}

interface MedCandidate { ingredient: string; row: MedicationRow; latestSort: string }

function buildMedications(entries: Entry[]): MedicationRow[] {
  const byLine = new Map<string, Entry[]>();
  for (const en of entries) {
    const id = str(en.e.med_id);
    if (!id || !statusOf(en.e.action)) continue;
    if (!en.e.drug || !str(en.e.drug.name)) continue;
    const l = byLine.get(id) ?? [];
    l.push(en);
    byLine.set(id, l);
  }
  const cands: MedCandidate[] = [];
  for (const [, evs] of byLine) {
    evs.sort(cmpEntry);
    const last = evs[evs.length - 1];
    const status = statusOf(last.e.action)!;
    const drugName = str(last.e.drug.name)!;
    const evidence: Evidence = [{ item_id: last.item.id, entry_id: last.key }];

    // status_since
    let sinceEntry: Entry | undefined = last;
    if (status === "active") {
      sinceEntry = undefined;
      for (let i = evs.length - 1; i >= 0; i--) {
        const a = evs[i].e.action;
        if (a === "start" || a === "resume") { sinceEntry = evs[i]; break; }
        if (a !== "change") break;
      }
    } else {
      // first event of the current uninterrupted held/stopped run
      for (let i = evs.length - 2; i >= 0; i--) {
        if (statusOf(evs[i].e.action) === status) sinceEntry = evs[i]; else break;
      }
    }
    const since = sinceEntry ? localDate(sinceEntry.item.effective) : null;
    if (sinceEntry && sinceEntry !== last) evidence.push({ item_id: sinceEntry.item.id, entry_id: sinceEntry.key });

    // dose / frequency: latest event that carries them
    let doseEntry: Entry | undefined;
    for (let i = evs.length - 1; i >= 0; i--) if (evs[i].e.dose) { doseEntry = evs[i]; break; }
    let freqEntry: Entry | undefined;
    for (let i = evs.length - 1; i >= 0; i--) if (typeof evs[i].e.frequency === "string" && FREQ[evs[i].e.frequency]) { freqEntry = evs[i]; break; }

    const drugEntry = last;
    const rx = str(drugEntry.e.drug.rxnorm)
      ?? (drugEntry.e.drug.outside_code && /rxnorm|88\.1/i.test(String(drugEntry.e.drug.outside_code.system ?? "")) ? str(drugEntry.e.drug.outside_code.code) : undefined);
    const ings = ingredientsOf(drugName);
    const single = ings.length <= 1;
    const restricted = evs.some((x) => x.e.restricted === "BH") ? "BH" : last.e.restricted;

    const ingList = ings.length ? ings : [""];
    for (const ing of ingList) {
      const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [] };
      if (ing) row.ingredient = ing;
      if (ing && single && rx && isBareIngredient(drugName)) row.rxnorm_ingredient = rx;
      if (since) row.status_since = since;
      const dose = doseEntry ? computeDose(doseEntry.e, str(doseEntry.e.drug?.name) ?? drugName, single) : undefined;
      if (dose) row.dose = dose;
      if (freqEntry) row.frequency = FREQ[freqEntry.e.frequency];
      if (status === "stopped" && STOP_REASONS.has(last.e.stop_reason)) row.stop_reason = last.e.stop_reason;
      const rt = str(last.e.reason_text);
      if (rt) row.status_reason_text = rt;
      const sens = drugSensitivity(ingList.filter(Boolean).length ? ingList : [drugName], restricted);
      if (sens.length) row.sensitivity = sens;
      const ev = evidence.slice();
      if (doseEntry && row.dose) ev.push({ item_id: doseEntry.item.id, entry_id: doseEntry.key });
      if (freqEntry && row.frequency) ev.push({ item_id: freqEntry.item.id, entry_id: freqEntry.key });
      row.evidence = uniqEvidence(ev);
      cands.push({ ingredient: ing || `\u0000${drugName.toLowerCase()}`, row, latestSort: last.sort });
    }
  }
  const best = new Map<string, MedCandidate>();
  for (const c of cands) {
    const cur = best.get(c.ingredient);
    if (!cur || c.latestSort > cur.latestSort) best.set(c.ingredient, c);
  }
  return Array.from(best.values())
    .sort((a, b) => (a.ingredient < b.ingredient ? -1 : a.ingredient > b.ingredient ? 1 : 0))
    .map((c) => c.row);
}

// ---------------------------------------------------------------- problems & allergies

function ckdStage(icd: string | undefined, text: string): ProblemRow["ckd_stage"] | undefined {
  const t = text.toLowerCase();
  const w = /\b(?:stage|g)\s*(1|2|3a|3b|4|5)\b/i.exec(t) || /\bckd\s*(?:stage\s*)?(1|2|3a|3b|4|5)\b/i.exec(t) || /\bg(3a|3b|[1245])\b/i.exec(t);
  if (w) {
    const s = w[1].toLowerCase();
    return ({ "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5" } as const)[s as "1"];
  }
  const c = (icd ?? "").toUpperCase();
  if (c.startsWith("N18.1")) return "G1";
  if (c.startsWith("N18.2")) return "G2";
  if (c.startsWith("N18.31")) return "G3a";
  if (c.startsWith("N18.32")) return "G3b";
  if (c.startsWith("N18.4")) return "G4";
  if (c.startsWith("N18.5") || c.startsWith("N18.6")) return "G5";
  return undefined;
}
function albuminuria(text: string): ProblemRow["albuminuria"] | undefined {
  const t = text.toLowerCase();
  const m = /\ba([123])\b/i.exec(t);
  if (m) return ("A" + m[1]) as "A1";
  if (/severely increased albuminuria|macroalbuminuria/.test(t)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria/.test(t)) return "A2";
  return undefined;
}
function isCkd(icd: string | undefined, text: string): boolean {
  return (icd ?? "").toUpperCase().startsWith("N18") || /chronic kidney disease|\bckd\b/i.test(text);
}

// Drug classes in ICD-10-CM T36–T50 adverse-effect codes (4-char category prefix).
const T_CLASSES: Record<string, string> = {
  "T36.0": "Penicillins", "T36.1": "Cephalosporins", "T36.3": "Macrolides", "T36.4": "Tetracyclines",
  "T36.8": "Fluoroquinolones", "T37.0": "Sulfonamides", "T38.0": "Glucocorticoids", "T38.3": "Insulin and oral hypoglycemic drugs",
  "T39.1": "Acetaminophen", "T39.0": "Salicylates", "T39.3": "NSAIDs", "T40.2": "Opioids", "T42.4": "Benzodiazepines",
  "T43.2": "Antidepressants", "T45.5": "Anticoagulants", "T46.4": "ACE inhibitors", "T46.6": "Antihyperlipidemic drugs",
  "T50.1": "Loop diuretics", "T50.2": "Thiazide diuretics", "T44.7": "Beta blockers", "T46.1": "Calcium channel blockers",
};
const CLASS_MEMBERS: Record<string, string[]> = {
  penicillin: ["amoxicillin", "ampicillin", "penicillin", "dicloxacillin", "nafcillin", "piperacillin", "oxacillin"],
  cephalosporin: ["cephalexin", "cefazolin", "cefuroxime", "ceftriaxone", "cefdinir", "cefpodoxime", "cefadroxil", "cefepime"],
  sulfonamide: ["sulfamethoxazole", "sulfadiazine", "sulfasalazine"],
  macrolide: ["azithromycin", "clarithromycin", "erythromycin"],
  tetracycline: ["doxycycline", "minocycline", "tetracycline"],
  fluoroquinolone: ["ciprofloxacin", "levofloxacin", "moxifloxacin"],
  "ace inhibitor": ["lisinopril", "enalapril", "ramipril", "benazepril", "quinapril", "captopril", "fosinopril"],
  statin: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin"],
  antihyperlipidemic: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "ezetimibe"],
  nsaid: ["ibuprofen", "naproxen", "meloxicam", "diclofenac", "celecoxib", "ketorolac", "indomethacin"],
  opioid: ["oxycodone", "hydrocodone", "morphine", "tramadol", "codeine", "hydromorphone", "fentanyl"],
  "beta blocker": ["metoprolol", "carvedilol", "atenolol", "propranolol", "bisoprolol", "nebivolol"],
  "loop diuretic": ["furosemide", "bumetanide", "torsemide"],
  "thiazide diuretic": ["hydrochlorothiazide", "chlorthalidone", "indapamide"],
  "calcium channel blocker": ["amlodipine", "diltiazem", "nifedipine", "verapamil", "felodipine"],
  benzodiazepine: ["alprazolam", "lorazepam", "clonazepam", "diazepam"],
  anticoagulant: ["warfarin", "apixaban", "rivaroxaban", "dabigatran", "edoxaban"],
  glucocorticoid: ["prednisone", "prednisolone", "methylprednisolone", "dexamethasone", "hydrocortisone"],
};
function classKey(cls: string): string | null {
  const c = cls.toLowerCase().replace(/s\b/g, "").replace(/-/g, " ");
  for (const k of Object.keys(CLASS_MEMBERS)) if (c.includes(k)) return k;
  if (/sulfa/.test(c)) return "sulfonamide";
  if (/ace\b|angiotensin.converting/.test(c)) return "ace inhibitor";
  return null;
}

const KNOWN_DRUGS = new Set<string>([
  ...Object.values(BRANDS).flatMap((v) => v.split(" / ")),
  ...Object.values(CLASS_MEMBERS).flat(),
  ...SUBSTANCE_DRUGS, ...MH_DRUGS, ...HIV_DRUGS,
  "metformin", "lisinopril", "losartan", "amlodipine", "insulin", "aspirin", "codeine", "morphine", "penicillin",
  "vancomycin", "clindamycin", "gabapentin", "allopurinol", "hydralazine", "spironolactone", "contrast",
]);

interface DrugAttribution { substance: string; isClass: boolean; reaction?: string; adverseOnly: boolean }

function drugAttribution(desc: string, icd: string | undefined): DrugAttribution | null {
  const c = (icd ?? "").toUpperCase();
  const tcode = /^T(3[6-9]|4\d|50)\.[0-9A-Z]{1,2}[0-9X]?5/.test(c) || /^T(3[6-9]|4\d|50)\.\d5/.test(c);
  const d = desc.trim();
  const m = /^(.*?)\s*(?:,\s*)?(?:due to|caused by|secondary to|induced by|from)\s+(.+)$/i.exec(d)
    || /^(.*?)\s*(?:,\s*)?(?:adverse (?:effect|reaction) (?:of|to))\s+(.+)$/i.exec(d);
  const m2 = /^([a-z][a-z\- ]+?)[- ]induced\s+(.+)$/i.exec(d);
  let drug: string | null = null;
  let condition: string | null = null;
  if (m) {
    const cand = m[2].replace(/\b(therapy|use|treatment|initial encounter|subsequent encounter)\b.*$/i, "").replace(/[.,;]+$/, "").trim();
    const ing = ingredientsOf(cand);
    if (ing.length === 1 && KNOWN_DRUGS.has(ing[0])) drug = ing[0];
    else if (classKey(cand)) drug = cand;
    if (drug) condition = m[1].trim() || null;
  } else if (m2) {
    const ing = ingredientsOf(m2[1]);
    if (ing.length === 1 && KNOWN_DRUGS.has(ing[0])) { drug = ing[0]; condition = m2[2].trim(); }
    else if (classKey(m2[1])) { drug = m2[1].trim(); condition = m2[2].trim(); }
  }
  if (!drug && tcode) {
    const cls = T_CLASSES[c.slice(0, 5)];
    const mm = /(?:adverse effect of|due to)\s+(.+)$/i.exec(d);
    drug = mm ? mm[1].replace(/,?\s*(initial|subsequent) encounter.*$/i, "").trim() : cls ?? null;
    if (!drug) return null;
    condition = null;
  }
  if (!drug) return null;
  const ing = ingredientsOf(drug);
  const isSingle = ing.length === 1 && KNOWN_DRUGS.has(ing[0]) && !classKey(drug);
  const adverseOnly = !condition || /^adverse (effect|reaction)$/i.test(condition) || (tcode && !m);
  return {
    substance: isSingle ? ing[0] : drug,
    isClass: !isSingle,
    reaction: condition && !adverseOnly ? condition : undefined,
    adverseOnly: !!adverseOnly,
  };
}

const HYPERSENS_RE = /hive|urticaria|rash|swell|angioedema|anaphyla|bronchospasm|wheez|itch|prurit|throat (tight|closing)|shortness of breath|dyspnea|stevens|sjs|ten\b|toxic epidermal|dress\b|blister|flush|erythema|exanthem|lip|tongue|face|facial/i;
const SERIOUS_RE = /liver|hepat|pancreatit|agranulocyt|neutropenia|aplastic|thrombocytopenia|kidney injury|renal failure|nephrit|rhabdo|qt prolong|torsade|arrhythm|seizure|hyperkalemia|lactic acidosis|bleed|hemorrhag|myocarditis|interstitial lung|tendon rupture|serotonin syndrome|neuroleptic malignant/i;

function classifyReaction(reactions: string[], sourceType: string, severity: string): AllergyIntoleranceRow["reaction_type"] {
  const t = reactions.join("; ");
  if (HYPERSENS_RE.test(t)) return "hypersensitivity";
  if (SERIOUS_RE.test(t)) return "serious_adverse_event";
  if (sourceType === "allergy" && reactions.length === 0) return "hypersensitivity";
  if (sourceType === "allergy") return "hypersensitivity";
  if (sourceType === "adverse_reaction" && severity === "high") return "serious_adverse_event";
  return "side_effect";
}

const NON_IMMUNE_RE = /cough|nausea|vomit|upset stomach|stomach upset|gi upset|diarrh|dyspepsia|drowsi|sedation|dizz|headache|constipat|myalgia|muscle (pain|ache)|insomnia|fatigue|edema|ankle swelling|flushing on niacin|jitter|tremor|palpitation|dry mouth/i;

function substanceName(name: string, rx: string | undefined): string {
  const ing = ingredientsOf(name);
  const looksDrug = !!rx || (ing.length === 1 && KNOWN_DRUGS.has(ing[0])) || !!BRANDS[name.trim().toLowerCase().split(/\s+/)[0]] || /\d\s*(mg|mcg)\b/i.test(name);
  if (looksDrug && ing.length === 1 && !classKey(name)) return ing[0];
  return name.trim();
}

function buildProblemsAndAllergies(
  probEntries: Entry[], refEntries: Entry[], allergyEntries: Entry[], medEntries: Entry[],
): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const problems: ProblemRow[] = [];
  const allergies: AllergyIntoleranceRow[] = [];
  const derived: { attr: DrugAttribution; entry: Entry; onset?: ProblemRow["onset"]; sens: Sensitivity[] }[] = [];

  // --- problem list
  const byId = new Map<string, Entry[]>();
  for (const en of probEntries) {
    const id = str(en.e.problem_id);
    if (!id || !["add", "update", "resolve", "remove"].includes(en.e.action)) continue;
    const l = byId.get(id) ?? [];
    l.push(en);
    byId.set(id, l);
  }
  // merge problem lines that are the same condition (CKD restaged on a new line; identical code)
  const groups: Entry[][] = [];
  const groupKey = (evs: Entry[]) => {
    const last = evs.slice().sort(cmpEntry)[evs.length - 1];
    const icd = str(last.e.icd10cm)?.toUpperCase();
    if (icd && icd.startsWith("N18")) return "N18";
    return icd ?? `desc:${String(last.e.description ?? "").toLowerCase()}`;
  };
  const gmap = new Map<string, Entry[]>();
  for (const [, evs] of byId) {
    const k = groupKey(evs);
    const g = gmap.get(k);
    if (g) g.push(...evs); else { const n = evs.slice(); gmap.set(k, n); groups.push(n); }
  }
  const listedCats = new Set<string>();
  for (const evs of groups) {
    evs.sort(cmpEntry);
    for (const x of evs) { const ic = str(x.e.icd10cm); if (ic) listedCats.add(ic.toUpperCase().slice(0, 3)); }
    // per line latest; group state from line with latest event
    const last = evs[evs.length - 1];
    if (last.e.action === "remove") continue;
    const desc = str(last.e.description);
    if (!desc) continue;
    const icd = str(last.e.icd10cm);
    const row: ProblemRow = { condition: desc, status: last.e.action === "resolve" ? "resolved" : "active", evidence: [] };
    if (icd) row.icd10cm = icd;
    const sn = str(last.e.snomed);
    if (sn) row.snomed = sn;
    const ev: Evidence = [{ item_id: last.item.id, entry_id: last.key }];
    for (let i = evs.length - 1; i >= 0; i--) {
      const o = fuzzy(evs[i].e.onset);
      if (o) { row.onset = o; if (evs[i] !== last) ev.push({ item_id: evs[i].item.id, entry_id: evs[i].key }); break; }
    }
    if (isCkd(icd, desc)) {
      for (let i = evs.length - 1; i >= 0; i--) {
        const s = ckdStage(str(evs[i].e.icd10cm), String(evs[i].e.description ?? ""));
        if (s) { row.ckd_stage = s; break; }
      }
      for (let i = evs.length - 1; i >= 0; i--) {
        const a = albuminuria(String(evs[i].e.description ?? ""));
        if (a) { row.albuminuria = a; break; }
      }
    }
    const sens = codeSensitivity(icd, desc, evs.some((x) => x.e.restricted === "BH") ? "BH" : undefined);
    if (sens.length) row.sensitivity = sens;
    row.evidence = uniqEvidence(ev);
    const attr = drugAttribution(desc, icd);
    if (attr) derived.push({ attr, entry: last, onset: row.onset, sens });
    if (!attr || !attr.adverseOnly) problems.push(row);
  }

  // --- diagnoses stated on referrals, for conditions not on the problem list
  const refByCat = new Map<string, Entry[]>();
  for (const en of refEntries) {
    const icd = str(en.e.icd10cm);
    const disp = str(en.e.display);
    if (!disp) continue;
    const cat = icd ? icd.toUpperCase().slice(0, 3) : `desc:${disp.toLowerCase()}`;
    if (listedCats.has(cat)) continue;
    const l = refByCat.get(cat) ?? [];
    l.push(en);
    refByCat.set(cat, l);
  }
  for (const [, evs] of refByCat) {
    evs.sort(cmpEntry);
    const last = evs[evs.length - 1];
    const desc = str(last.e.display)!;
    const icd = str(last.e.icd10cm);
    const row: ProblemRow = { condition: desc, status: "active", evidence: [{ item_id: last.item.id, entry_id: last.key }] };
    if (icd) row.icd10cm = icd;
    if (isCkd(icd, desc)) {
      const s = ckdStage(icd, desc);
      if (s) row.ckd_stage = s;
      const a = albuminuria(desc);
      if (a) row.albuminuria = a;
    }
    const sens = codeSensitivity(icd, desc, evs.some((x) => x.e.restricted === "BH") ? "BH" : undefined);
    if (sens.length) row.sensitivity = sens;
    const attr = drugAttribution(desc, icd);
    if (attr) derived.push({ attr, entry: last, sens });
    if (!attr || !attr.adverseOnly) problems.push(row);
  }

  // --- allergy list
  const algById = new Map<string, Entry[]>();
  for (const en of allergyEntries) {
    const id = str(en.e.allergy_id);
    if (!id || !["add", "update", "inactivate"].includes(en.e.action)) continue;
    const l = algById.get(id) ?? [];
    l.push(en);
    algById.set(id, l);
  }
  const algSubstances = new Map<string, AllergyIntoleranceRow>();
  for (const [, evs] of algById) {
    evs.sort(cmpEntry);
    const last = evs[evs.length - 1];
    if (last.e.action === "inactivate") continue;
    const sub = last.e.substance;
    const name = sub && str(sub.name);
    if (!name) continue;
    if (/^(no known|nka|nkda|none)\b/i.test(name)) continue;
    const rx = str(sub.rxnorm);
    const substance = substanceName(name, rx);
    const reactions: string[] = Array.isArray(last.e.reactions) ? last.e.reactions.filter((r: unknown) => typeof r === "string" && r.trim()).map((r: string) => r.trim()) : [];
    const srcType = String(last.e.reaction_type ?? "");
    const severity = String(last.e.severity ?? "");
    const rtype = classifyReaction(reactions, srcType, severity);
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: rtype,
      mechanism: rtype === "side_effect" && reactions.length > 0 && NON_IMMUNE_RE.test(reactions.join(" ")) && !HYPERSENS_RE.test(reactions.join(" ")) ? "non_immune" : "unknown",
      criticality: severity === "low" ? "low" : severity === "high" ? "high" : "unknown",
      evidence: [{ item_id: last.item.id, entry_id: last.key }],
    };
    if (rx && isBareIngredient(name)) row.rxnorm_ingredient = rx;
    if (reactions.length) row.reaction = reactions.join("; ");
    let onset: AllergyIntoleranceRow["onset"];
    for (let i = evs.length - 1; i >= 0; i--) {
      const o = fuzzy(evs[i].e.onset);
      if (o) { onset = o; if (evs[i] !== last) row.evidence.push({ item_id: evs[i].item.id, entry_id: evs[i].key }); break; }
    }
    if (onset) row.onset = onset;
    const sens = drugSensitivity([substance], undefined);
    if (sens.length) row.sensitivity = sens;
    if (!algSubstances.has(substance.toLowerCase())) algSubstances.set(substance.toLowerCase(), row);
    allergies.push(row);
  }

  // --- allergy rows from drug-attributed diagnoses
  for (const d of derived) {
    let substance = d.attr.substance;
    if (d.attr.isClass) {
      const key = classKey(substance);
      if (key) {
        const onList = uniq(medEntries.filter((m) => m.item.id === d.entry.item.id)
          .flatMap((m) => ingredientsOf(String(m.e.drug?.name ?? "")))
          .filter((i) => CLASS_MEMBERS[key].includes(i)));
        if (onList.length === 1) substance = onList[0];
      }
    }
    const existing = algSubstances.get(substance.toLowerCase());
    if (existing) {
      existing.evidence = uniqEvidence([...existing.evidence, { item_id: d.entry.item.id, entry_id: d.entry.key }]);
      continue;
    }
    const reactions = d.attr.reaction ? [d.attr.reaction] : [];
    const rtype = reactions.length ? classifyReaction(reactions, "", "") : "side_effect";
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: rtype === "side_effect" && reactions.length && !NON_IMMUNE_RE.test(reactions[0]) && SERIOUS_RE.test(reactions[0]) ? "serious_adverse_event" : rtype,
      mechanism: "unknown",
      criticality: "unknown",
      evidence: [{ item_id: d.entry.item.id, entry_id: d.entry.key }],
    };
    if (d.attr.reaction) row.reaction = d.attr.reaction;
    if (d.onset) row.onset = d.onset;
    const sens = drugSensitivity([substance], undefined);
    if (sens.length) row.sensitivity = sens;
    algSubstances.set(substance.toLowerCase(), row);
    allergies.push(row);
  }

  return { problems, allergies };
}

// ---------------------------------------------------------------- labs

const LOINC_MAP: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "14682-9": "creatinine", "21232-4": "creatinine",
  "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "62238-1": "egfr", "98979-8": "egfr", "88293-6": "egfr",
  "88294-4": "egfr", "50044-7": "egfr", "69405-9": "egfr", "50210-4": "egfr", "77147-7": "egfr", "94677-2": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "39789-3": "potassium",
  "2951-2": "sodium", "2947-0": "sodium", "39791-9": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "20565-8": "bicarbonate", "14627-4": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "14937-7": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose", "14749-6": "glucose", "41653-7": "glucose", "2341-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "13705-9": "uacr", "14958-3": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "778-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "804-5": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin", "30350-3": "hemoglobin", "30352-9": "hemoglobin",
  "53060-9": "bhb", "48357-8": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2753-2": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "2020-6": "pco2",
  "3040-3": "lipase", "1798-8": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "49563-0": "troponin", "16255-2": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "96259-7": "ldl", "91105-7": "ldl",
};
const CODE_MAP: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", SCR: "creatinine", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate",
  HCO3: "bicarbonate", TCO2: "bicarbonate", BICARB: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", ANIONGAP: "anion_gap",
  BUN: "bun", UREAN: "bun", GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", MALBCR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase", TROPI: "troponin", TNI: "troponin", TROP: "troponin",
  HSTNI: "troponin", CHOL: "cholesterol", TC: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl",
  LDL: "ldl", LDLC: "ldl", LDLD: "ldl",
};

function analyteOf(test: any): Analyte | null {
  const name = String(test?.name ?? "").toLowerCase();
  const code = String(test?.nfm_code ?? "").toUpperCase();
  const loinc = str(test?.loinc);
  const urine = /\burine\b|\bur\b|\bua\b|random urine|24\s*h/.test(name);
  let a: Analyte | null = null;
  if (loinc && LOINC_MAP[loinc]) a = LOINC_MAP[loinc];
  if (!a && /^EGFR/.test(code)) a = "egfr";
  if (!a && CODE_MAP[code]) a = CODE_MAP[code];
  if (!a && CODE_MAP[code.replace(/[^A-Z0-9]/g, "")]) a = CODE_MAP[code.replace(/[^A-Z0-9]/g, "")];
  if (!a) {
    if (/albumin.*creatinine|\bacr\b|uacr|microalbumin\/creat/.test(name)) a = "uacr";
    else if (/egfr|glomerular filtration/.test(name)) a = "egfr";
    else if (/a1c|glycated h|glycohemoglobin/.test(name)) a = "a1c";
    else if (/creatinine/.test(name) && !/kinase|clearance|ratio/.test(name)) a = "creatinine";
    else if (/potassium/.test(name)) a = "potassium";
    else if (/sodium/.test(name)) a = "sodium";
    else if (/chloride/.test(name)) a = "chloride";
    else if (/bicarbonate|total co2|carbon dioxide/.test(name)) a = "bicarbonate";
    else if (/anion gap/.test(name)) a = "anion_gap";
    else if (/urea nitrogen|\bbun\b/.test(name)) a = "bun";
    else if (/glucose/.test(name) && !/meter|home|tolerance|\bgtt\b/.test(name)) a = "glucose";
    else if (/platelet/.test(name)) a = "platelets";
    else if (/white blood|\bwbc\b|leukocyte/.test(name) && !/esterase/.test(name)) a = "wbc";
    else if (/hemoglobin|\bhgb\b/.test(name) && !/a1c|glycated/.test(name)) a = "hemoglobin";
    else if (/hydroxybutyrate|\bbhb\b/.test(name)) a = "bhb";
    else if (/\bpco2\b|partial pressure.*co2/.test(name)) a = "pco2";
    else if (/\bph\b/.test(name)) a = "ph";
    else if (/lipase/.test(name)) a = "lipase";
    else if (/troponin/.test(name) && !/troponin t\b|tnt/.test(name)) a = "troponin";
    else if (/\bhdl\b/.test(name)) a = "hdl";
    else if (/\bldl\b/.test(name)) a = "ldl";
    else if (/triglyceride/.test(name)) a = "triglycerides";
    else if (/cholesterol/.test(name)) a = "cholesterol";
  }
  if (!a) return null;
  if (urine && a !== "uacr") return null;
  if (a === "troponin" && /troponin t\b|\btnt\b/.test(name)) return null;
  if (a === "glucose" && /meter|home|self/.test(name)) return null;
  return a;
}

const TARGET_UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L",
  troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

/** Factor (or function) converting a source unit into the analyte's unit; null when unknown. */
function convert(a: Analyte, unitRaw: string, v: number): number | null {
  const u = unitRaw.trim().toLowerCase().replace(/\s+/g, "").replace(/μ|µ/g, "u");
  const is = (...xs: string[]) => xs.includes(u);
  switch (a) {
    case "creatinine":
      if (is("mg/dl")) return v;
      if (is("umol/l")) return round(v / 88.42, 2);
      return null;
    case "egfr":
      if (/^ml\/min(\/|per)?\{?1\.73_?m2\}?$/.test(u) || is("ml/min/1.73m2", "ml/min/1.73m^2", "ml/min/1.73sqm", "ml/min/{1.73_m2}", "ml/min")) return v;
      return null;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      if (is("mmol/l", "meq/l")) return v;
      return null;
    case "bhb":
      if (is("mmol/l")) return v;
      if (is("mg/dl")) return round(v / 10.41, 2);
      return null;
    case "bun":
      if (is("mg/dl")) return v;
      if (is("mmol/l")) return round(v * 2.801, 1);
      return null;
    case "glucose":
      if (is("mg/dl")) return v;
      if (is("mmol/l")) return Math.round(v * 18.016);
      return null;
    case "a1c":
      if (is("%", "%hba1c", "%{hba1c}", "%ngsp")) return v;
      if (is("mmol/mol")) return round(v / 10.929 + 2.15, 1);
      return null;
    case "uacr":
      if (is("mg/g", "mg/g{creat}", "mg/gcreat", "ug/mg", "ug/mg{creat}", "mg/gcr", "mcg/mg", "mcg/mgcreat", "mg/g{cre}")) return v;
      if (is("mg/mmol", "mg/mmol{creat}")) return round(v * 8.84, 1);
      return null;
    case "platelets": case "wbc":
      if (is("10*3/ul", "10^3/ul", "x10e3/ul", "x10^3/ul", "k/ul", "thou/ul", "10*9/l", "10^9/l", "x10e9/l", "x10^9/l", "/nl", "k/mm3", "10*3/mm3", "x10(3)/ul", "x10(9)/l", "thousand/ul", "10e3/ul")) return v;
      if (is("/ul", "cells/ul", "/mm3")) return round(v / 1000, 3);
      return null;
    case "hemoglobin":
      if (is("g/dl")) return v;
      if (is("g/l")) return round(v / 10, 1);
      if (is("mmol/l")) return round(v * 1.611, 1);
      return null;
    case "ph":
      if (is("", "[ph]", "ph", "units", "pharmaceuticalunits")) return v;
      return null;
    case "pco2":
      if (is("mmhg", "mm[hg]", "torr")) return v;
      if (is("kpa")) return round(v * 7.50062, 1);
      return null;
    case "lipase":
      if (is("u/l", "iu/l", "units/l")) return v;
      return null;
    case "troponin":
      if (is("ng/ml", "ug/l")) return v;
      if (is("ng/l", "pg/ml")) return round(v / 1000, 4);
      return null;
    case "cholesterol": case "hdl": case "ldl":
      if (is("mg/dl")) return v;
      if (is("mmol/l")) return Math.round(v * 38.67);
      return null;
    case "triglycerides":
      if (is("mg/dl")) return v;
      if (is("mmol/l")) return Math.round(v * 88.57);
      return null;
  }
  return null;
}

const INVALID_RE = /invalidat|cancel+ed|withdrawn|not performed|entered in error|wrong patient|specimen rejected|test not done|disregard|retracted/i;
const STATUS_RANK: Record<string, number> = { P: 1, F: 2, C: 3 };

function buildLabs(entries: Entry[]): LabResultRow[] {
  const byResult = new Map<string, Entry[]>();
  for (const en of entries) {
    const e = en.e;
    if (!e.test || typeof e.test !== "object") continue;
    const ref = e.external_ref;
    const k = ref && str(ref.accession) && str(ref.result_code)
      ? `${ref.accession}|${ref.result_code}`
      : `${String(e.test.nfm_code ?? e.test.name)}|${String(e.collected)}`;
    const l = byResult.get(k) ?? [];
    l.push(en);
    byResult.set(k, l);
  }
  const rows: LabResultRow[] = [];
  for (const [, copies] of byResult) {
    copies.sort((a, b) => {
      const ra = STATUS_RANK[a.e.result_status] ?? 0;
      const rb = STATUS_RANK[b.e.result_status] ?? 0;
      if (ra !== rb) return ra - rb;
      const xa = `${localDate(a.e.resulted) ?? ""}${toLocal(a.e.resulted) ?? ""}|${a.sort}`;
      const xb = `${localDate(b.e.resulted) ?? ""}${toLocal(b.e.resulted) ?? ""}|${b.sort}`;
      return xa < xb ? -1 : xa > xb ? 1 : 0;
    });
    const best = copies[copies.length - 1];
    const e = best.e;
    const st = e.result_status;
    if (!STATUS_RANK[st]) continue;
    const a = analyteOf(e.test);
    if (!a) continue;
    if (typeof e.value !== "string" && typeof e.value !== "number") continue;
    const comment = String(e.comment ?? "");
    if (INVALID_RE.test(comment) && st === "C") continue;
    if (INVALID_RE.test(String(e.value))) continue;
    const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(String(e.value));
    if (!m) continue;
    const raw = parseFloat(m[2]);
    const value = convert(a, String(e.unit ?? ""), raw);
    if (value === null || !isFinite(value)) continue;
    let egfrEq: LabResultRow["egfr_equation"];
    if (a === "egfr") {
      const name = String(e.test.name ?? "");
      const code = String(e.test.nfm_code ?? "");
      const text = `${name} ${comment}`;
      const raceVariant = /\bafrican[- ]american\b|\bblack\b/i.test(name) && !/\bnon[- ]?(african|black)/i.test(name);
      if (raceVariant || /^EGFR-?AA$/i.test(code) || /\b(LOINC)?48643-1\b/.test(String(e.test.loinc ?? "")) || /^(88293-6|62239-9|50210-4)$/.test(String(e.test.loinc ?? ""))) {
        if (!/\bnon[- ]?(african|black)/i.test(name)) continue;
      }
      if (/ckd[- ]?epi[^.]*2021|2021[^.]*ckd[- ]?epi|race[- ]free/i.test(text)) egfrEq = "ckd-epi-2021";
      else if (/ckd[- ]?epi[^.]*2009|2009[^.]*ckd[- ]?epi/i.test(text)) egfrEq = "ckd-epi-2009";
      else if (/\bmdrd\b/i.test(text)) egfrEq = "mdrd";
      else if (String(e.test.loinc ?? "") === "98979-8") egfrEq = "ckd-epi-2021";
      else if (String(e.test.loinc ?? "") === "62238-1") egfrEq = "ckd-epi-2009";
      else egfrEq = "unknown";
    }
    const collected = rfc3339Local(e.collected) ?? rfc3339Local(best.item.effective);
    if (!collected) continue;
    let comparator: LabResultRow["comparator"];
    if (m[1]) comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as LabResultRow["comparator"];
    const row: LabResultRow = {
      analyte: a,
      value,
      unit: TARGET_UNIT[a],
      collected,
      status: st === "P" ? "preliminary" : "final",
      evidence: uniqEvidence(copies.slice().reverse().map((c) => ({ item_id: c.item.id, entry_id: c.key }))),
    };
    if (comparator) row.comparator = comparator;
    if (egfrEq) row.egfr_equation = egfrEq;
    const loinc = str(e.test.loinc);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  rows.sort((x, y) => (x.collected < y.collected ? -1 : x.collected > y.collected ? 1 : x.analyte < y.analyte ? -1 : x.analyte > y.analyte ? 1 : 0));
  return rows;
}

// ---------------------------------------------------------------- vitals

function parseBp(s: unknown): [number, number] | null {
  if (typeof s !== "string") return null;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(s);
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : null;
}

function buildVitals(entries: Entry[], visitTypes: Map<string, string>): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const en of entries) {
    const e = en.e;
    const lt = toLocal(en.item.effective);
    const time = lt && lt.includes("T") ? lt : toLocal(en.item.recorded);
    if (!time || !time.includes("T")) continue;
    const vt = e.visit_id ? visitTypes.get(String(e.visit_id)) : undefined;
    const row: VitalRow = {
      setting: vt === "telehealth" || vt === "phone" ? "home" : "clinic",
      local_time: time.slice(0, 16),
      evidence: [{ item_id: en.item.id, entry_id: en.key }],
    };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const rep = parseBp(e.bp_repeat);
    if (rep && row.setting !== "home") { row.repeat_systolic_mmhg = rep[0]; row.repeat_diastolic_mmhg = rep[1]; }
    const p = num(e.pulse_bpm);
    if (p !== undefined) row.pulse_bpm = p;
    const w = num(e.weight_lb);
    if (w !== undefined && w > 0) row.weight_kg = round(w * 0.45359237, 1);
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined && row.repeat_systolic_mmhg === undefined) continue;
    rows.push(row);
  }
  rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return rows;
}

// ---------------------------------------------------------------- entry point

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items)) return out;
  const all = items.filter((i): i is FolioItem => !!i && typeof i === "object" && typeof (i as any).id === "string");
  const byId = new Map<string, FolioItem>();
  for (const i of all) byId.set(i.id, i);

  const counting = all.filter((i) => {
    const d = localDate(i.recorded);
    return !!d && d.length === 10 && d <= asOf;
  });
  const countingIds = new Set(counting.map((i) => i.id));

  const retracted = new Set<string>();
  for (const i of counting) {
    if (Array.isArray(i.retracts)) for (const r of i.retracts) if (typeof r === "string") retracted.add(r);
    const p = i.payload;
    if (p && typeof p === "object") {
      for (const k of Object.keys(p)) {
        const e = p[k];
        if (e && e.type === "chart_correction" && Array.isArray(e.voided_items)) {
          for (const r of e.voided_items) if (typeof r === "string") retracted.add(r);
        }
      }
    }
  }
  const superseded = new Set<string>();
  const stack: string[] = [];
  for (const i of counting) {
    if (retracted.has(i.id)) continue;
    if (Array.isArray(i.supersedes)) for (const s of i.supersedes) if (typeof s === "string") stack.push(s);
  }
  while (stack.length) {
    const s = stack.pop()!;
    if (superseded.has(s)) continue;
    superseded.add(s);
    const it = byId.get(s);
    if (it && Array.isArray(it.supersedes)) for (const t of it.supersedes) if (typeof t === "string") stack.push(t);
  }
  const live = counting.filter((i) => countingIds.has(i.id) && !retracted.has(i.id) && !superseded.has(i.id));

  const byType = new Map<string, Entry[]>();
  for (const item of live) {
    const p = item.payload;
    if (!p || typeof p !== "object") continue;
    const sort = `${toLocal(item.effective) ?? ""}|${toLocal(item.recorded) ?? ""}|${item.id}`;
    for (const key of Object.keys(p).sort()) {
      const e = p[key];
      if (!e || typeof e !== "object" || typeof e.type !== "string") continue;
      const l = byType.get(e.type) ?? [];
      l.push({ item, key, e, sort });
      byType.set(e.type, l);
    }
  }
  const get = (t: string) => byType.get(t) ?? [];

  const visitTypes = new Map<string, string>();
  for (const v of get("visit")) if (str(v.e.visit_id)) visitTypes.set(v.e.visit_id, String(v.e.visit_type ?? ""));

  const safe = <T>(f: () => T, fallback: T): T => {
    try { return f(); } catch { return fallback; }
  };
  out.medications = safe(() => buildMedications(get("med_event")), []);
  const pa = safe(() => buildProblemsAndAllergies(get("problem_event"), get("referral_dx"), get("allergy_event"), get("med_event")), { problems: [], allergies: [] });
  out.problems = pa.problems;
  out.allergies = pa.allergies;
  out.labs = safe(() => buildLabs(get("imported_result")), []);
  out.vitals = safe(() => buildVitals(get("vital_set"), visitTypes), []);
  return out;
}
