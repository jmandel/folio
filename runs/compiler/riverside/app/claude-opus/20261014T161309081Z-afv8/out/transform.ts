// Mapper: Riverside Regional (riverside-doc-v1) FOLIO items -> consumer views.
//
// Riverside publishes one item per clinical document (ED note, H&P, progress note, consult, discharge
// summary). Every document restates the home medication list and the allergy list, so those are treated as
// snapshots: the latest counting document that carries them is the list. Diagnoses, history entries, labs
// and vitals are accumulated across documents.
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

type Entry = Record<string, any>;
type Ev = { item_id: string; entry_id?: string };

interface Doc {
  item: FolioItem;
  entries: [string, Entry][];
  kind?: string;
  encClass?: string;
  sortKey: string; // local wall-clock time of the clinical event (end when it spans a period)
  statusDate?: string; // local date the document's statements apply to
}

const TZ = "America/Chicago";

// ---------------------------------------------------------------------------------------------------------
// Time helpers

const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function wallFromMs(ms: number): string {
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = part.value;
  const hh = p.hour === "24" ? "00" : p.hour;
  return `${p.year}-${p.month}-${p.day}T${hh}:${p.minute}:${p.second}`;
}

const DT_RE = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*(Z|z|[+-]\d{2}:?\d{2})?$/;

/** Local wall-clock `YYYY-MM-DDTHH:MM:SS` for a date-time, or the partial/plain date as written. */
function toLocal(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  const m = DT_RE.exec(t);
  if (!m) return undefined;
  if (!m[5]) return `${m[1]}T${m[2]}:${m[3]}:${m[4] ?? "00"}`;
  const ms = Date.parse(t.replace(" ", "T"));
  if (isNaN(ms)) return undefined;
  return wallFromMs(ms);
}

function localDate(s: unknown): string | undefined {
  const l = toLocal(s);
  return l ? l.slice(0, 10) : undefined;
}

/** Offset (e.g. "-05:00") of America/Chicago at the given local wall-clock time. */
function chicagoOffset(wall: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.exec(wall);
  if (!m) return "-06:00";
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  for (const off of [-5, -6]) {
    if (wallFromMs(asUtc - off * 3600000) === wall) return off === -5 ? "-05:00" : "-06:00";
  }
  return "-06:00";
}

function rfc3339Local(s: unknown): string | undefined {
  const l = toLocal(s);
  if (!l || l.length < 19) return undefined;
  return `${l}${chicagoOffset(l)}`;
}

function padKey(local: string | undefined): string {
  if (!local) return "0000-00-00T00:00:00";
  if (local.length === 4) return `${local}-01-01T00:00:00`;
  if (local.length === 7) return `${local}-01T00:00:00`;
  if (local.length === 10) return `${local}T00:00:00`;
  return local;
}

// ---------------------------------------------------------------------------------------------------------
// As-of and supersession

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const counting = items.filter((it) => {
    if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
    const d = localDate(it.recorded);
    return !!d && d.length === 10 && d <= asOf;
  });
  const byId = new Map<string, FolioItem>();
  for (const it of counting) byId.set(it.id, it);
  const retracted = new Set<string>();
  for (const it of counting) for (const r of arr(it.retracts)) if (typeof r === "string") retracted.add(r);
  const removed = new Set<string>(retracted);
  const stack: string[] = [];
  for (const it of counting) if (!retracted.has(it.id)) for (const s of arr(it.supersedes)) stack.push(s);
  while (stack.length) {
    const id = stack.pop();
    if (typeof id !== "string" || removed.has(id)) continue;
    removed.add(id);
    const it = byId.get(id);
    if (it) for (const s of arr(it.supersedes)) stack.push(s);
  }
  return counting.filter((it) => !removed.has(it.id));
}

function arr(x: unknown): any[] {
  return Array.isArray(x) ? x : [];
}

function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x.trim() : undefined;
}

function buildDocs(items: FolioItem[]): Doc[] {
  const docs: Doc[] = [];
  for (const item of items) {
    const payload = item.payload;
    if (!payload || typeof payload !== "object") continue;
    const entries: [string, Entry][] = [];
    for (const [k, v] of Object.entries(payload)) if (v && typeof v === "object" && typeof (v as Entry).type === "string") entries.push([k, v as Entry]);
    const enc = entries.find(([, e]) => e.type === "encounter")?.[1];
    const kind = str(enc?.document_kind);
    const endLocal = toLocal(item.effective_end);
    const effLocal = toLocal(item.effective);
    const clin = (kind === "discharge_summary" && toLocal(enc?.discharged)) || endLocal || effLocal || toLocal(item.recorded);
    docs.push({
      item,
      entries,
      kind,
      encClass: str(enc?.class),
      sortKey: padKey(clin) + "|" + padKey(toLocal(item.recorded)) + "|" + item.id,
      statusDate: clin && clin.length >= 10 ? clin.slice(0, 10) : undefined,
    });
  }
  docs.sort((a, b) => (a.sortKey < b.sortKey ? -1 : a.sortKey > b.sortKey ? 1 : 0));
  return docs;
}

// ---------------------------------------------------------------------------------------------------------
// Drug knowledge

const BRANDS: Record<string, string> = {
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", lipitor: "atorvastatin", zocor: "simvastatin",
  crestor: "rosuvastatin", pravachol: "pravastatin", norvasc: "amlodipine", glucophage: "metformin",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  lasix: "furosemide", bumex: "bumetanide", coumadin: "warfarin", jantoven: "warfarin", eliquis: "apixaban",
  xarelto: "rivaroxaban", pradaxa: "dabigatran", plavix: "clopidogrel", brilinta: "ticagrelor",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", zoloft: "sertraline", prozac: "fluoxetine",
  lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine", effexor: "venlafaxine", cymbalta: "duloxetine",
  wellbutrin: "bupropion", seroquel: "quetiapine", zyprexa: "olanzapine", risperdal: "risperidone",
  abilify: "aripiprazole", lamictal: "lamotrigine", depakote: "valproate", keflex: "cephalexin",
  augmentin: "amoxicillin / clavulanate", amoxil: "amoxicillin", zestril: "lisinopril", prinivil: "lisinopril",
  vasotec: "enalapril", altace: "ramipril", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan",
  avapro: "irbesartan", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro",
  admelog: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart", ozempic: "semaglutide",
  wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide",
  mounjaro: "tirzepatide", januvia: "sitagliptin", tradjenta: "linagliptin", protonix: "pantoprazole",
  prilosec: "omeprazole", nexium: "esomeprazole", pepcid: "famotidine", zyrtec: "cetirizine", claritin: "loratadine",
  allegra: "fexofenadine", benadryl: "diphenhydramine", tylenol: "acetaminophen", advil: "ibuprofen",
  motrin: "ibuprofen", aleve: "naproxen", naprosyn: "naproxen", flomax: "tamsulosin", toprol: "metoprolol",
  lopressor: "metoprolol", coreg: "carvedilol", tenormin: "atenolol", aldactone: "spironolactone",
  neurontin: "gabapentin", lyrica: "pregabalin", suboxone: "buprenorphine / naloxone", subutex: "buprenorphine",
  ambien: "zolpidem", xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam",
  microzide: "hydrochlorothiazide", bactrim: "sulfamethoxazole / trimethoprim", cipro: "ciprofloxacin",
  levaquin: "levofloxacin", zithromax: "azithromycin", singulair: "montelukast", flovent: "fluticasone",
  entresto: "sacubitril / valsartan", glucotrol: "glipizide", amaryl: "glimepiride", zetia: "ezetimibe",
  zyloprim: "allopurinol", colcrys: "colchicine", deltasone: "prednisone", lithobid: "lithium",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", truvada: "emtricitabine / tenofovir disoproxil",
  descovy: "emtricitabine / tenofovir alafenamide", narcan: "naloxone", vivitrol: "naltrexone",
  chantix: "varenicline", ultram: "tramadol", norco: "hydrocodone / acetaminophen", percocet: "oxycodone / acetaminophen",
  oxycontin: "oxycodone", dilaudid: "hydromorphone", flexeril: "cyclobenzaprine", imdur: "isosorbide mononitrate",
  lanoxin: "digoxin", cardizem: "diltiazem", procardia: "nifedipine", kdur: "potassium chloride",
  "k-dur": "potassium chloride", klor: "potassium chloride",
};

const SALTS = [
  "hydrochloride", "hcl", "hydrobromide", "sodium", "potassium", "calcium", "magnesium", "succinate", "tartrate",
  "besylate", "maleate", "mesylate", "trihydrate", "dihydrate", "monohydrate", "sulfate", "citrate", "fumarate",
  "bromide", "acetate", "phosphate", "hyclate", "propionate", "furoate", "dipropionate", "valerate", "disoproxil",
];
const SALT_PROTECTED = /^(potassium chloride|sodium chloride|sodium bicarbonate|calcium carbonate|calcium gluconate|calcium acetate|magnesium oxide|magnesium sulfate|potassium citrate|calcium citrate|ferrous sulfate|zinc sulfate|sodium citrate|levothyroxine sodium|warfarin sodium)$/;
const FORMS = [
  "tablets?", "tabs?", "capsules?", "caps?", "extended[- ]release", "delayed[- ]release", "immediate[- ]release",
  "er", "xr", "xl", "sr", "dr", "ir", "cr", "ec", "odt", "oral", "solution", "suspension", "syrup", "injection",
  "injectable", "pen", "prefilled", "syringe", "inhaler", "inhalation", "hfa", "aerosol", "nebulizer", "nebulized",
  "cream", "ointment", "gel", "patch", "transdermal", "topical", "ophthalmic", "drops?", "nasal", "spray", "powder",
  "chewable", "iv", "infusion", "subq", "subcutaneous", "po", "kwikpen", "flexpen", "flextouch", "solostar",
];

function ingredientOf(drugName: string): string | undefined {
  let s = drugName.toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[®™]/g, " ");
  // Cut at the first strength / number.
  const cut = s.search(/\s\d|^\d/);
  if (cut >= 0) s = s.slice(0, cut);
  s = s.replace(/[,;].*$/, "");
  const formRe = new RegExp(`\\b(${FORMS.join("|")})\\b`, "g");
  s = s.replace(formRe, " ").replace(/\s+/g, " ").trim();
  if (!s) return undefined;
  const words = s.split(" ");
  const brand = BRANDS[words[0]] ?? BRANDS[s];
  if (brand) return brand;
  s = s.replace(/\s*[-+\/]\s*|\s+and\s+/g, " / ");
  if (!SALT_PROTECTED.test(s)) {
    const parts = s.split(" / ").map((p) => {
      const ws = p.split(" ").filter((w) => !SALTS.includes(w));
      return ws.length ? ws.join(" ") : p;
    });
    s = parts.join(" / ");
  }
  s = s.replace(/\s+/g, " ").trim();
  return s || undefined;
}

const CLASSES: [RegExp, string[]][] = [
  [/sglt-?2 inhibitors?|gliflozins?/i, ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin", "bexagliflozin"]],
  [/penicillins?/i, ["amoxicillin", "ampicillin", "penicillin", "penicillin v", "penicillin g", "piperacillin", "dicloxacillin", "nafcillin", "oxacillin", "amoxicillin / clavulanate", "piperacillin / tazobactam", "ampicillin / sulbactam"]],
  [/cephalosporins?/i, ["cephalexin", "cefazolin", "ceftriaxone", "cefuroxime", "cefdinir", "cefepime", "cefpodoxime", "cefadroxil", "ceftazidime"]],
  [/sulfonamides?|sulfa drugs?|sulfa antibiotics?/i, ["sulfamethoxazole / trimethoprim", "sulfamethoxazole", "sulfadiazine"]],
  [/ace inhibitors?|angiotensin[- ]converting enzyme inhibitors?/i, ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril"]],
  [/\barbs?\b|angiotensin (ii )?receptor blockers?/i, ["losartan", "valsartan", "irbesartan", "olmesartan", "candesartan", "telmisartan", "azilsartan"]],
  [/statins?/i, ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"]],
  [/nsaids?|non-?steroidal anti-?inflammatory( drugs?)?/i, ["ibuprofen", "naproxen", "ketorolac", "meloxicam", "diclofenac", "celecoxib", "indomethacin", "aspirin", "nabumetone", "etodolac"]],
  [/fluoroquinolones?|quinolones?/i, ["ciprofloxacin", "levofloxacin", "moxifloxacin"]],
  [/macrolides?/i, ["azithromycin", "clarithromycin", "erythromycin"]],
  [/thiazides?( diuretics?)?/i, ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone"]],
  [/loop diuretics?/i, ["furosemide", "bumetanide", "torsemide"]],
  [/beta[- ]blockers?/i, ["metoprolol", "atenolol", "carvedilol", "propranolol", "bisoprolol", "labetalol", "nadolol", "nebivolol"]],
  [/dpp-?4 inhibitors?|gliptins?/i, ["sitagliptin", "linagliptin", "saxagliptin", "alogliptin"]],
  [/glp-?1( receptor)?( agonists?| ras?)?/i, ["semaglutide", "dulaglutide", "liraglutide", "exenatide", "tirzepatide"]],
  [/sulfonylureas?/i, ["glipizide", "glyburide", "glimepiride"]],
  [/anticoagulants?|doacs?/i, ["warfarin", "apixaban", "rivaroxaban", "dabigatran", "edoxaban", "heparin", "enoxaparin"]],
  [/opioids?|opiates?/i, ["morphine", "oxycodone", "hydrocodone", "hydromorphone", "fentanyl", "tramadol", "codeine", "methadone", "oxycodone / acetaminophen", "hydrocodone / acetaminophen"]],
  [/corticosteroids?|steroids?|glucocorticoids?/i, ["prednisone", "prednisolone", "methylprednisolone", "dexamethasone", "hydrocortisone"]],
  [/insulins?/i, ["insulin glargine", "insulin lispro", "insulin aspart", "insulin detemir", "insulin degludec", "insulin regular", "insulin nph", "insulin isophane"]],
  [/checkpoint inhibitors?/i, ["pembrolizumab", "nivolumab", "ipilimumab", "atezolizumab", "durvalumab"]],
];

// Single drugs we can recognise in diagnosis wording.
const KNOWN_DRUGS = new Set<string>([
  ...Object.values(BRANDS).filter((v) => !v.includes("/")),
  ...CLASSES.flatMap(([, m]) => m.filter((v) => !v.includes("/"))),
  "metformin", "lithium", "valproate", "valproic acid", "isoniazid", "carbamazepine", "phenytoin", "allopurinol",
  "vancomycin", "gentamicin", "amiodarone", "digoxin", "clozapine", "methotrexate", "trimethoprim", "nitrofurantoin",
  "clindamycin", "doxycycline", "spironolactone", "tacrolimus", "cyclosporine", "contrast", "iodinated contrast",
]);

// ICD-10-CM adverse-effect codes (T36-T50, 6th character 5) -> class wording.
const T_CODES: [RegExp, string][] = [
  [/^T36\.0X5/, "penicillins"], [/^T36\.1X5/, "cephalosporins"], [/^T37\.0X5/, "sulfonamides"],
  [/^T38\.0X5/, "glucocorticoids"], [/^T38\.3X5/, "insulin and oral hypoglycemic drugs"],
  [/^T39\.0[19]5/, "salicylates"], [/^T39\.315/, "propionic acid derivatives"], [/^T39\.395/, "NSAIDs"],
  [/^T45\.515/, "anticoagulants"], [/^T46\.4X5/, "ACE inhibitors"], [/^T46\.5X5/, "antihypertensive drugs"],
  [/^T40\.2X5/, "opioids"], [/^T42\.4X5/, "benzodiazepines"],
];

function isAdverseEffectCode(code: string | undefined): boolean {
  return !!code && /^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/i.test(code);
}

// ---------------------------------------------------------------------------------------------------------
// Sensitivity

const SENS_DRUGS: [Sensitivity, RegExp][] = [
  ["mental-health", /\b(quetiapine|olanzapine|risperidone|aripiprazole|haloperidol|lithium|sertraline|fluoxetine|escitalopram|citalopram|paroxetine|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|clozapine|ziprasidone|lurasidone|paliperidone|buspirone|vortioxetine|vilazodone|cariprazine|brexpiprazole|fluvoxamine|nortriptyline|lamotrigine for bipolar)\b/i],
  ["substance-use", /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|varenicline|nicotine)\b/i],
  ["hiv-sti", /\b(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|elvitegravir|cabotegravir|efavirenz|rilpivirine|doravirine|darunavir|atazanavir|lopinavir|ritonavir|cobicistat|abacavir|zidovudine|nevirapine|maraviroc|lenacapavir)\b/i],
  ["sexual-reproductive-health", /\b(levonorgestrel|norethindrone|ethinyl estradiol|drospirenone|etonogestrel|norgestimate|desogestrel|medroxyprogesterone acetate injectable|ulipristal|mifepristone|misoprostol|segesterone|contracept)/i],
];

function drugSensitivity(text: string): Sensitivity[] | undefined {
  const out: Sensitivity[] = [];
  for (const [cat, re] of SENS_DRUGS) if (re.test(text) && !out.includes(cat)) out.push(cat);
  return out.length ? out : undefined;
}

function conditionSensitivity(label: string, icd?: string): Sensitivity[] | undefined {
  const out: Sensitivity[] = [];
  const add = (c: Sensitivity) => { if (!out.includes(c)) out.push(c); };
  const code = (icd ?? "").toUpperCase();
  const l = label.toLowerCase();
  if (/^F1\d/.test(code) || /\b(alcohol|opioid|cocaine|cannabis|methamphetamine|stimulant|substance|tobacco|nicotine) (use|dependence|abuse|disorder|withdrawal)|alcoholism|\boud\b|\baud\b/.test(l)) add("substance-use");
  else if (/^F\d/.test(code) || /\b(depress|bipolar|schizo|anxiety|panic disorder|ptsd|post-traumatic|psychos|psychotic|adhd|attention[- ]deficit|eating disorder|anorexia nervosa|bulimia|obsessive|ocd|suicid|personality disorder|mood disorder)/.test(l)) add("mental-health");
  if (/^(B20|Z21|B97\.35|A5[0-9]|A6[0-4]|Z20\.6)/.test(code) || /\bhiv\b|human immunodeficiency|syphilis|gonorrh|chlamydia|trichomon|genital herpes|herpes genitalis|genital warts|\bsti\b|sexually transmitted/.test(l)) add("hiv-sti");
  if (/^(O\d|Z3[0-9]|N97|Z31)/.test(code) || /pregnan|contracept|infertil|miscarriage|abortion|gestation|postpartum|erectile dysfunction/.test(l)) add("sexual-reproductive-health");
  if (/^(Q9[0-9]|Z15|Z14|D57|E84)/.test(code) || /\b(brca|lynch syndrome|genetic|hereditary|inherited|sickle cell|cystic fibrosis|huntington)/.test(l)) add("genetic");
  return out.length ? out : undefined;
}

// ---------------------------------------------------------------------------------------------------------
// Medications

type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";

function normUnit(u: string): DoseUnit | "g" | "count" | undefined {
  const x = u.toLowerCase();
  if (/^(mg|milligrams?)$/.test(x)) return "mg";
  if (/^(mcg|µg|μg|ug|micrograms?)$/.test(x)) return "mcg";
  if (/^(g|grams?|gm)$/.test(x)) return "g";
  if (/^(u|iu|units?|international units?)$/.test(x)) return "units";
  if (/^(ml|cc|milliliters?|millilitres?)$/.test(x)) return "mL";
  if (/^(tabs?|tablets?|caps?|capsules?)$/.test(x)) return "tablet";
  if (/^(puffs?|sprays?|actuations?|inhalations?|pills?|patch(es)?|drops?)$/.test(x)) return "count";
  return undefined;
}

const NUM_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5, "1/2": 0.5, "one-half": 0.5 };
const UNIT_ALT = "mg|milligrams?|mcg|µg|μg|ug|micrograms?|g|grams?|gm|units?|iu|u|ml|cc|tabs?|tablets?|caps?|capsules?|puffs?|sprays?|actuations?|inhalations?|pills?";

function parseNum(s: string): number | undefined {
  const w = NUM_WORDS[s.toLowerCase()];
  if (w !== undefined) return w;
  const n = Number(s);
  return isFinite(n) ? n : undefined;
}

function hasRange(s: string): boolean {
  return /\d\s*(-|–|—|to|or)\s*\d/i.test(s) || /sliding|scale|per protocol|as directed|varies|variable/i.test(s);
}

function parseAmount(s: string): { value: number; unit: DoseUnit | "g" | "count" } | undefined {
  const m = new RegExp(`(?:^|\\s)(\\d+(?:\\.\\d+)?|one|two|three|four|half)\\s*(${UNIT_ALT})\\b`, "i").exec(s);
  if (!m) return undefined;
  const v = parseNum(m[1]);
  const u = normUnit(m[2]);
  if (v === undefined || !u) return undefined;
  // A strength per volume/actuation is not an amount per administration.
  const after = s.slice((m.index ?? 0) + m[0].length);
  if (/^\s*\/\s*(\d|ml|actuation|puff|spray|dose|hr|h\b|kg)/i.test(after)) return undefined;
  return { value: v, unit: u };
}

function strengthOf(drugName: string): { value: number; unit: "mg" | "mcg" | "units" } | undefined {
  const m = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|μg|ug|g|units?|iu)\b(\s*\/\s*(actuation|puff|spray|inhalation|dose))?/i.exec(drugName);
  if (!m) return undefined;
  const after = drugName.slice((m.index ?? 0) + m[0].length);
  if (!m[3] && /^\s*\/\s*\d*\s*(ml|l)\b/i.test(after)) return undefined;
  // Combination strengths ("5 mg/325 mg") are not a single strength.
  if (/^\s*[-\/]\s*\d/.test(after)) return undefined;
  const u = normUnit(m[2]);
  const v = Number(m[1]);
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u === "mg" || u === "mcg" || u === "units") return { value: v, unit: u };
  return undefined;
}

function countOf(sig: string): number | undefined {
  const m = /(?:^|\b(?:take|inhale|use|give|apply|chew|instill)\s+)(\d+(?:\.\d+)?|one|two|three|four|half|1\/2)\s*(tabs?|tablets?|caps?|capsules?|puffs?|sprays?|actuations?|inhalations?|pills?)\b/i.exec(sig);
  if (!m) return undefined;
  return parseNum(m[1]);
}

function computeDose(e: Entry): { value: number; unit: DoseUnit } | undefined {
  const doseText = str(e.dose_text) ?? "";
  const sig = str(e.sig) ?? "";
  const drug = str(e.drug_name) ?? "";
  if (hasRange(doseText) || hasRange(sig.replace(/q\s*\d+\s*-\s*\d+\s*h/gi, ""))) return undefined;
  if (/\b(if|when|depending|per glucose|correction)\b/i.test(doseText)) return undefined;
  const strength = strengthOf(drug);
  const count = countOf(sig);
  const amt = parseAmount(doseText);
  const fin = (v: number, u: DoseUnit) => ({ value: Math.round(v * 10000) / 10000, unit: u });
  if (amt) {
    if (amt.unit === "g") return fin(amt.value * 1000, "mg");
    if (amt.unit === "tablet" || amt.unit === "count") {
      if (strength) return fin(strength.value * amt.value, strength.unit);
      return amt.unit === "tablet" ? fin(amt.value, "tablet") : undefined;
    }
    // dose_text restating the unit strength while the sig takes several units: multiply.
    if (strength && count && count !== 1 && strength.unit === amt.unit && Math.abs(strength.value - amt.value) < 1e-9) {
      return fin(amt.value * count, amt.unit);
    }
    return fin(amt.value, amt.unit);
  }
  if (strength && count) return fin(strength.value * count, strength.unit);
  if (strength && frequencyOf(sig + " " + doseText)) return fin(strength.value, strength.unit);
  if (count && /tab|tablet/i.test(sig)) return fin(count, "tablet");
  return undefined;
}

function frequencyOf(text: string): MedicationRow["frequency"] | undefined {
  const s = ` ${text.toLowerCase()} `;
  if (/\bprn\b|as needed|as-needed|if needed/.test(s)) return "PRN";
  if (/taper/.test(s)) return "other";
  if (/\bqid\b|four times|4 times|q\s*6\s*h|every 6 hours|q\s*4\s*h|every 4 hours|five times|every other day|\bqod\b|monthly|every month|every (2|3|4|two|three|four) weeks|three times (a|per) week|twice (a|per) week|every 72 hours/.test(s)) return "other";
  if (/\btid\b|three times|3 times|q\s*8\s*h|every 8 hours/.test(s)) return "TID";
  if (/\bbid\b|twice|2 times|q\s*12\s*h|every 12 hours/.test(s)) return "BID";
  if (/\bqhs\b|at bedtime|bedtime|\bhs\b|nightly|at night|every night|each night/.test(s)) return "QHS";
  if (/weekly|once a week|every week|\bqw(k)?\b|per week/.test(s)) return "QW";
  if (/\bdaily\b|\bqd\b|once a day|once daily|every day|each day|\bq\s*24\s*h|every 24 hours|every morning|in the morning|\bqam\b|in the evening|every evening|\bqpm\b|per day|a day/.test(s)) return "QD";
  return undefined;
}

function medStatus(s: unknown): MedicationRow["status"] | undefined {
  switch (s) {
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
    case "not_reconciled": return "unknown";
  }
  return undefined;
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] | undefined {
  if (!text) return undefined;
  const t = text.toLowerCase();
  if (/rash|hives|urticaria|reaction|side effect|adverse|intoleran|allerg|angioedema|swelling|nausea|cough|ketoacidosis|\bdka\b|hypoglyc|bleed|toxicity|injury/.test(t)) return "adverse_reaction";
  if (/ineffective|not effective|did not work|didn't work|no benefit|no response|inadequate|failed|failure of/.test(t)) return "ineffective";
  if (/switch|replac|changed to|change to|instead|in place of|transition(ed)? to/.test(t)) return "therapy_changed";
  if (/course (complete|completed|finished)|completed( the)? course|course ended|finished|end of course/.test(t)) return "course_complete";
  if (/patient (chose|choice|declin|decided|prefer|refus|wish)|per patient|patient request/.test(t)) return "patient_choice";
  return "other";
}

function medKey(e: Entry): string | undefined {
  const name = str(e.drug_name);
  const ing = name ? ingredientOf(name) : undefined;
  const rx = str(e.rxnorm_ingredient);
  if (rx) return `rx:${rx}`;
  return ing ? `in:${ing}` : name ? `nm:${name.toLowerCase()}` : undefined;
}

function buildMedications(docs: Doc[]): MedicationRow[] {
  const snaps = docs.filter((d) => d.entries.some(([, e]) => e.type === "home_med"));
  if (!snaps.length) return [];
  // Per snapshot: key -> [entryId, entry]
  const maps = snaps.map((d) => {
    const m = new Map<string, [string, Entry]>();
    for (const [id, e] of d.entries) {
      if (e.type !== "home_med" || !str(e.drug_name)) continue;
      const k = medKey(e);
      if (!k) continue;
      const prev = m.get(k);
      // Same drug twice in one list: prefer the one with a decided status.
      if (!prev || (medStatus(prev[1].status) === "unknown" && medStatus(e.status) !== "unknown")) m.set(k, [id, e]);
    }
    return m;
  });
  const lastIdx = snaps.length - 1;
  const latest = snaps[lastIdx];
  const rows: MedicationRow[] = [];
  for (const [key, [entryId, e]] of maps[lastIdx]) {
    const status = medStatus(e.status) ?? "unknown";
    const drugName = str(e.drug_name)!;
    // Walk back through the contiguous run of snapshots with the same status.
    let runStart = lastIdx;
    while (runStart > 0) {
      const prev = maps[runStart - 1].get(key);
      if (!prev || (medStatus(prev[1].status) ?? "unknown") !== status) break;
      runStart--;
    }
    let statusSince: string | undefined;
    const startEntry = maps[runStart].get(key)!;
    if (status === "held" || status === "stopped") statusSince = snaps[runStart].statusDate;
    else if (status === "active") {
      const before = runStart > 0 ? maps[runStart - 1].get(key) : undefined;
      const beforeStatus = before ? medStatus(before[1].status) : undefined;
      if (startEntry[1].status === "new" || beforeStatus === "held" || beforeStatus === "stopped") statusSince = snaps[runStart].statusDate;
    }
    let reasonText: string | undefined;
    let reasonIdx = -1;
    for (let i = lastIdx; i >= runStart; i--) {
      const t = str(maps[i].get(key)?.[1].instructions);
      if (t) { reasonText = t; reasonIdx = i; break; }
    }
    const evidence: Evidence = [{ item_id: latest.item.id, entry_id: entryId }];
    if (runStart !== lastIdx) evidence.push({ item_id: snaps[runStart].item.id, entry_id: startEntry[0] });
    if (reasonIdx >= 0 && reasonIdx !== lastIdx && reasonIdx !== runStart) evidence.push({ item_id: snaps[reasonIdx].item.id, entry_id: maps[reasonIdx].get(key)![0] });

    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence };
    const ing = ingredientOf(drugName);
    if (ing) row.ingredient = ing;
    const rx = str(e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;
    if (statusSince) row.status_since = statusSince;
    const dose = computeDose(e);
    if (dose) row.dose = dose;
    const freq = frequencyOf(`${str(e.sig) ?? ""} ${str(e.dose_text) ?? ""}`);
    if (freq) row.frequency = freq;
    if (status === "stopped") {
      const sr = stopReason(reasonText);
      if (sr) row.stop_reason = sr;
    }
    if (reasonText && status !== "unknown") row.status_reason_text = reasonText;
    const all = `${drugName} ${str(e.sig) ?? ""} ${str(e.instructions) ?? ""}`;
    if (/\botc\b|over[- ]the[- ]counter|non-?prescription/i.test(all)) row.otc = true;
    const sens = drugSensitivity(`${drugName} ${ing ?? ""}`);
    if (sens) row.sensitivity = sens;
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------------------------------------
// Problems and drug-attributed allergies

interface DxRef { doc: Doc; id: string; e: Entry; }

function normLabel(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function parsePartial(text: string | undefined): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!text) return undefined;
  const t = text.trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (m) return { value: t, precision: "day" };
  m = /^(\d{4})-(\d{2})$/.exec(t);
  if (m) return { value: t, precision: "month" };
  m = /^(?:in\s+|since\s+|circa\s+|about\s+|~\s*)?(\d{4})$/i.exec(t);
  if (m) return { value: m[1], precision: "year" };
  m = /^(\d{1,2})\/(\d{4})$/.exec(t);
  if (m && +m[1] >= 1 && +m[1] <= 12) return { value: `${m[2]}-${m[1].padStart(2, "0")}`, precision: "month" };
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t);
  if (m && +m[1] <= 12 && +m[2] <= 31) return { value: `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`, precision: "day" };
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  m = /^(?:in\s+|since\s+)?([a-z]+)\.?\s+(\d{1,2},?\s+)?(\d{4})$/i.exec(t);
  if (m) {
    const mi = months.findIndex((x) => x.startsWith(m![1].toLowerCase()) && m![1].length >= 3);
    if (mi >= 0) {
      const mm = String(mi + 1).padStart(2, "0");
      if (m[2]) {
        const dd = m[2].replace(/[,\s]/g, "").padStart(2, "0");
        return { value: `${m[3]}-${mm}-${dd}`, precision: "day" };
      }
      return { value: `${m[3]}-${mm}`, precision: "month" };
    }
  }
  return undefined;
}

function ckdStage(label: string, icd?: string): ProblemRow["ckd_stage"] | undefined {
  const c = (icd ?? "").toUpperCase();
  const byCode: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.30": "G3a" as any, "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
  const l = label.toLowerCase();
  let m = /\bg\s?(1|2|3a|3b|4|5)\b/.exec(l) ?? /stage\s*(1|2|3a|3b|4|5|i{1,3}v?|v)\b/.exec(l) ?? /\bckd\s*(1|2|3a|3b|4|5)\b/.exec(l);
  if (m) {
    const roman: Record<string, string> = { i: "1", ii: "2", iii: "3", iv: "4", v: "5" };
    const v = roman[m[1]] ?? m[1];
    const map: Record<string, ProblemRow["ckd_stage"]> = { "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5" };
    if (map[v]) return map[v];
  }
  if (c === "N18.30") return undefined;
  return byCode[c];
}

function albuminuria(label: string): ProblemRow["albuminuria"] | undefined {
  const l = label.toLowerCase();
  const m = /\ba\s?([123])\b/.exec(l);
  if (m) return (`A${m[1]}`) as ProblemRow["albuminuria"];
  if (/severely increased albuminuria|macroalbuminuria/.test(l)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria/.test(l)) return "A2";
  if (/normal to mildly increased albuminuria/.test(l)) return "A1";
  return undefined;
}

const ATTRIB_RE = /(associated|induced|related|due to|secondary to|caused by|attributed to|adverse effect|from|toxicity|reaction to|after|on)/i;

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** If the diagnosis attributes itself to a drug, the substance and the remaining manifestation text. */
function drugAttribution(e: Entry, doc: Doc): { substance: string; rx?: string; reaction?: string; matchedText?: string } | undefined {
  const label = str(e.label) ?? "";
  const texts = [label, str(e.riverside_dx?.name) ?? ""].filter(Boolean);
  const meds: { ing: string; rx?: string }[] = [];
  for (const [, m] of doc.entries) {
    if ((m.type === "home_med" || m.type === "inpatient_med") && str(m.drug_name)) {
      const ing = ingredientOf(m.drug_name);
      if (ing) meds.push({ ing, rx: str(m.rxnorm_ingredient) });
    }
  }
  const resolveClass = (members: string[], written: string) => {
    const hits = new Map<string, string | undefined>();
    for (const m of meds) if (members.includes(m.ing)) hits.set(m.ing, m.rx);
    if (hits.size === 1) { const [ing, rx] = [...hits][0]; return { substance: ing, rx }; }
    return { substance: written };
  };
  for (const text of texts) {
    if (!ATTRIB_RE.test(text)) continue;
    const lower = text.toLowerCase();
    // Specific drug named (from the item's med list, brand table or known drugs).
    const candidates: string[] = [...meds.map((m) => m.ing), ...KNOWN_DRUGS, ...Object.keys(BRANDS)];
    for (const c of candidates) {
      const re = new RegExp(`\\b${escapeRe(c)}\\b`, "i");
      const mm = re.exec(lower);
      if (!mm) continue;
      if (!attribNear(lower, mm.index, c.length)) continue;
      const ing = BRANDS[c] ?? c;
      return { substance: ing, rx: meds.find((m) => m.ing === ing)?.rx, reaction: stripAttribution(label, text.slice(mm.index, mm.index + c.length)), matchedText: c };
    }
    for (const [re, members] of CLASSES) {
      const mm = new RegExp(re.source, "i").exec(text);
      if (!mm) continue;
      if (!attribNear(lower, mm.index, mm[0].length)) continue;
      const written = mm[0].trim();
      const r = resolveClass(members, written);
      return { ...r, reaction: stripAttribution(label, written) };
    }
  }
  const code = str(e.icd10cm);
  if (isAdverseEffectCode(code)) {
    for (const [re, cls] of T_CODES) {
      if (re.test(code!.toUpperCase())) {
        const cl = CLASSES.find(([r]) => r.test(cls));
        const r = cl ? resolveClass(cl[1], cls) : { substance: cls };
        return { ...r, reaction: /^adverse effect/i.test(label) ? undefined : stripAttribution(label, "") };
      }
    }
    const m = /adverse effect of (.+)$/i.exec(label);
    if (m) return { substance: m[1].trim() };
  }
  return undefined;
}

function attribNear(lower: string, idx: number, len: number): boolean {
  const before = lower.slice(Math.max(0, idx - 30), idx);
  const after = lower.slice(idx + len, idx + len + 25);
  if (/(due to|secondary to|caused by|attributed to|adverse effect of|from|toxicity of|reaction to|after|on|induced by|associated with)\s+(the\s+|an?\s+)?$/.test(before)) return true;
  if (/^\s*[- ]?\s*(associated|induced|related|toxicity|use)\b/.test(after)) return true;
  return false;
}

function stripAttribution(label: string, phrase: string): string | undefined {
  let s = label;
  if (phrase) {
    const p = escapeRe(phrase);
    s = s.replace(new RegExp(`[,;]?\\s*\\b(due to|secondary to|caused by|attributed to|induced by|associated with|from|after|on)\\s+(the\\s+|an?\\s+)?${p}\\w*.*$`, "i"), "");
    s = s.replace(new RegExp(`[,;]?\\s*${p}\\w*\\s*[- ]\\s*(associated|induced|related)\\b`, "i"), "");
    s = s.replace(new RegExp(`\\b${p}\\w*\\s+toxicity`, "i"), "toxicity");
  }
  s = s.replace(/^\s*adverse effect of\b.*$/i, "").replace(/\s+/g, " ").replace(/^[\s,;:-]+|[\s,;:-]+$/g, "");
  return s || undefined;
}

const SERIOUS_RE = /ketoacidosis|\bdka\b|pancreatitis|hepatitis|liver (injury|failure|toxicity)|hepatotox|agranulocytosis|neutropenia|aplastic|thrombocytopenia|kidney injury|renal failure|\baki\b|nephrotox|qt prolongation|torsade|arrhythmia|seizure|rhabdomyolysis|lactic acidosis|hemorrhage|bleed|hyperkalemia|hyponatremia|hypoglycemi|myocarditis|colitis|pneumonitis|serotonin syndrome|neuroleptic malignant|tendon rupture|ototox|stroke|thrombosis|dress\b/i;
const HYPER_RE = /hives|urticaria|rash|swelling|angioedema|anaphyla|bronchospasm|wheez|itch|prurit|flushing|stevens|sjs|toxic epidermal|\bten\b|blister|exanthem|eruption|throat (tightness|closing)|dyspnea|shortness of breath|hypersensitivity|allergic/i;
const NONIMMUNE_RE = /cough|nausea|vomit|diarrh|constipat|stomach upset|gi upset|dyspepsia|abdominal (pain|upset|discomfort)|drowsi|sedation|somnolence|dizz|headache|myalgia|muscle (pain|ache)|ankle (edema|swelling)|edema|ketoacidosis|\bdka\b|hypoglyc|lactic acidosis|hyperkalemia|bleed|hemorrhage|bradycardia|hypotension|insomnia|tremor|fatigue|jitter|palpitation|dry mouth|weight gain|flushing on niacin/i;

function classifyReaction(reaction: string | undefined, sev: string | undefined): {
  reaction_type: AllergyIntoleranceRow["reaction_type"]; mechanism: AllergyIntoleranceRow["mechanism"]; criticality: AllergyIntoleranceRow["criticality"];
} {
  const r = reaction ?? "";
  let type: AllergyIntoleranceRow["reaction_type"] = "hypersensitivity";
  if (HYPER_RE.test(r)) type = "hypersensitivity";
  else if (SERIOUS_RE.test(r)) type = "serious_adverse_event";
  else if (r && NONIMMUNE_RE.test(r)) type = "side_effect";
  else if (r) type = "side_effect";
  let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
  if (/ige|immune[- ]mediated|positive (skin|allergy) test|skin test positive/i.test(r)) mechanism = "immune";
  else if (!HYPER_RE.test(r) && r && NONIMMUNE_RE.test(r)) mechanism = "non_immune";
  let criticality: AllergyIntoleranceRow["criticality"] = "unknown";
  if (sev === "severe") criticality = "high";
  else if (sev === "mild" || sev === "moderate") criticality = "low";
  if (/anaphyla|angioedema|throat|tongue|airway|stevens|sjs|toxic epidermal|\bdress\b|bronchospasm/i.test(r)) criticality = "high";
  if (type === "serious_adverse_event" && criticality !== "high" && sev !== "mild") criticality = "high";
  return { reaction_type: type, mechanism, criticality };
}

function buildProblems(docs: Doc[]): { problems: ProblemRow[]; dxAllergies: AllergyIntoleranceRow[] } {
  const refs: DxRef[] = [];
  for (const doc of docs) for (const [id, e] of doc.entries) {
    if ((e.type === "diagnosis" && str(e.label)) || (e.type === "history" && str(e.condition))) refs.push({ doc, id, e });
  }
  // Union entries naming the same condition (shared ICD-10-CM code, Riverside code or wording).
  const parent = refs.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const keyOwner = new Map<string, number>();
  refs.forEach((r, i) => {
    const keys: string[] = [];
    const icd = str(r.e.icd10cm);
    if (icd && !isAdverseEffectCode(icd)) keys.push(`icd:${icd.toUpperCase()}`);
    const rc = str(r.e.riverside_dx?.code);
    if (rc) keys.push(`rrh:${rc}`);
    keys.push(`lbl:${normLabel(str(r.e.label) ?? str(r.e.condition) ?? "")}`);
    for (const k of keys) {
      const o = keyOwner.get(k);
      if (o === undefined) keyOwner.set(k, i);
      else parent[find(i)] = find(o);
    }
  });
  const groups = new Map<number, DxRef[]>();
  refs.forEach((r, i) => {
    const g = find(i);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(r);
  });

  const problems: ProblemRow[] = [];
  const dxAllergies: AllergyIntoleranceRow[] = [];
  for (const list of groups.values()) {
    // refs are in document order already (docs sorted).
    const dx = list.filter((r) => r.e.type === "diagnosis");
    const confirmed = dx.filter((r) => r.e.status === "active" || r.e.status === "resolved");
    const lastDx = dx[dx.length - 1];
    if (lastDx && lastDx.e.status === "ruled_out") continue;
    const hist = list.filter((r) => r.e.type === "history");
    if (!confirmed.length && !hist.length) continue;
    const lead = confirmed.length ? confirmed[confirmed.length - 1] : hist[hist.length - 1];
    const label = str(lead.e.label) ?? str(lead.e.condition)!;
    const icd = str(lead.e.icd10cm);
    const status: ProblemRow["status"] = confirmed.length && lead.e.status === "resolved" ? "resolved" : "active";
    const evidence: Evidence = [];
    const seen = new Set<string>();
    for (const r of [...confirmed, ...hist]) {
      const k = `${r.doc.item.id}#${r.id}`;
      if (!seen.has(k)) { seen.add(k); evidence.push({ item_id: r.doc.item.id, entry_id: r.id }); }
    }
    // Lead first.
    evidence.sort((a, b) => (a.item_id === lead.doc.item.id && a.entry_id === lead.id ? -1 : b.item_id === lead.doc.item.id && b.entry_id === lead.id ? 1 : 0));

    // Drug attribution -> allergy row.
    let attributed: ReturnType<typeof drugAttribution> & {} | undefined;
    let attribRef: DxRef | undefined;
    for (let i = confirmed.length - 1; i >= 0 && !attributed; i--) {
      const a = drugAttribution(confirmed[i].e, confirmed[i].doc);
      if (a) { attributed = a; attribRef = confirmed[i]; }
    }
    if (attributed && attribRef) {
      const reaction = attributed.reaction;
      const cls = classifyReaction(reaction, undefined);
      const firstDate = localDate(list[0].doc.item.effective);
      const row: AllergyIntoleranceRow = {
        substance: attributed.substance,
        reaction_type: cls.reaction_type,
        mechanism: cls.mechanism,
        criticality: cls.reaction_type === "serious_adverse_event" ? "high" : cls.criticality,
        evidence: [{ item_id: attribRef.doc.item.id, entry_id: attribRef.id }],
      };
      if (attributed.rx) row.rxnorm_ingredient = attributed.rx;
      if (reaction) row.reaction = reaction;
      if (firstDate && firstDate.length === 10) row.onset = { value: firstDate, precision: "day" };
      const sens = drugSensitivity(attributed.substance);
      if (sens) row.sensitivity = sens;
      dxAllergies.push(row);
    }

    // A code naming only the adverse effect gives the allergy row alone.
    if (isAdverseEffectCode(icd) && (/^adverse effect of/i.test(label) || !stripAttribution(label, ""))) {
      if (attributed) continue;
    }
    if (/^adverse effect of\b/i.test(label) && attributed) continue;

    const row: ProblemRow = { condition: label, status, evidence };
    if (icd) row.icd10cm = icd;
    const onsetSrc = [...hist].reverse().map((r) => parsePartial(str(r.e.onset_text))).find((x) => x);
    if (onsetSrc) row.onset = onsetSrc;
    const isCkd = /^N18/i.test(icd ?? "") || /chronic kidney disease|\bckd\b/i.test(label);
    if (isCkd) {
      // Latest recorded stage / albuminuria across the group.
      for (let i = list.length - 1; i >= 0; i--) {
        const r = list[i];
        if (r.e.type === "diagnosis" && !(r.e.status === "active" || r.e.status === "resolved")) continue;
        const st = ckdStage(`${str(r.e.label) ?? str(r.e.condition) ?? ""} ${str(r.e.riverside_dx?.name) ?? ""}`, str(r.e.icd10cm));
        if (st) { row.ckd_stage = st; break; }
      }
      for (let i = list.length - 1; i >= 0; i--) {
        const r = list[i];
        if (r.e.type === "diagnosis" && !(r.e.status === "active" || r.e.status === "resolved")) continue;
        const al = albuminuria(`${str(r.e.label) ?? str(r.e.condition) ?? ""} ${str(r.e.riverside_dx?.name) ?? ""}`);
        if (al) { row.albuminuria = al; break; }
      }
    }
    const sens = conditionSensitivity(`${label} ${str(lead.e.riverside_dx?.name) ?? ""}`, icd);
    if (sens) row.sensitivity = sens;
    problems.push(row);
  }
  return { problems, dxAllergies };
}

// ---------------------------------------------------------------------------------------------------------
// Allergies

function isDrugSubstance(e: Entry, doc: Doc): string | undefined {
  const s = str(e.substance)!;
  const ing = ingredientOf(s);
  if (!ing) return undefined;
  if (str(e.rxnorm_ingredient)) return ing;
  if (KNOWN_DRUGS.has(ing) || BRANDS[s.toLowerCase().split(/\s+/)[0]]) return ing;
  for (const [, m] of doc.entries) {
    if ((m.type === "home_med" || m.type === "inpatient_med") && str(m.drug_name) && ingredientOf(m.drug_name) === ing) return ing;
  }
  return undefined;
}

function buildAllergies(docs: Doc[], dxAllergies: AllergyIntoleranceRow[]): AllergyIntoleranceRow[] {
  const snaps = docs.filter((d) => d.entries.some(([, e]) => e.type === "allergy"));
  const rows: AllergyIntoleranceRow[] = [];
  const latest = snaps[snaps.length - 1];
  if (latest) {
    for (const [id, e] of latest.entries) {
      if (e.type !== "allergy") continue;
      const sub = str(e.substance);
      if (!sub || /^(no known|nka|nkda|none|no allergies|nil)\b/i.test(sub)) continue;
      const drug = isDrugSubstance(e, latest);
      const reaction = str(e.reaction);
      const sev = str(e.severity);
      const cls = classifyReaction(reaction, sev);
      const row: AllergyIntoleranceRow = {
        substance: drug ?? sub,
        reaction_type: cls.reaction_type,
        mechanism: cls.mechanism,
        criticality: cls.criticality,
        evidence: [{ item_id: latest.item.id, entry_id: id }],
      };
      const rx = str(e.rxnorm_ingredient);
      if (rx) row.rxnorm_ingredient = rx;
      if (reaction) row.reaction = reaction.split(/\s*[,;]\s*/).filter(Boolean).join("; ");
      const sens = drugSensitivity(row.substance);
      if (sens) row.sensitivity = sens;
      const existing = rows.find((r) => r.substance.toLowerCase() === row.substance.toLowerCase());
      if (existing) existing.evidence.push(...row.evidence);
      else rows.push(row);
    }
  }
  for (const a of dxAllergies) {
    const existing = rows.find((r) => r.substance.toLowerCase() === a.substance.toLowerCase());
    if (existing) {
      // Same substance on the allergy list: keep the list entry, add the diagnosis evidence.
      existing.evidence.push(...a.evidence);
      if (!existing.reaction && a.reaction) existing.reaction = a.reaction;
    } else rows.push(a);
  }
  return rows;
}

// ---------------------------------------------------------------------------------------------------------
// Labs

const CODE_ANALYTE: Record<string, Analyte> = {
  NA: "sodium", K: "potassium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate", TCO2: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", CREAT: "creatinine", CR: "creatinine", GLU: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", MALB_CR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin",
  HB: "hemoglobin", BHB: "bhb", PH: "ph", VPH: "ph", APH: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2",
  LIPASE: "lipase", LIP: "lipase", TROPI: "troponin", TNI: "troponin", TROP: "troponin", HSTNI: "troponin",
  CHOL: "cholesterol", TCHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl",
  LDLC: "ldl", LDL_CALC: "ldl", LDLD: "ldl",
};

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2951-2": "sodium", "2947-0": "sodium", "2823-3": "potassium", "6298-4": "potassium", "2075-0": "chloride",
  "2069-3": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap", "3094-0": "bun", "6299-2": "bun",
  "2160-0": "creatinine", "38483-4": "creatinine", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr",
  "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr", "98979-8": "egfr", "50044-7": "egfr", "69405-9": "egfr",
  "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose", "4548-4": "a1c", "17856-6": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "777-3": "platelets", "26515-7": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "20509-6": "hemoglobin", "53060-9": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2019-8": "pco2", "2021-4": "pco2", "2020-6": "pco2",
  "11557-6": "pco2", "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin",
  "49563-0": "troponin", "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl",
  "18262-6": "ldl", "2089-1": "ldl",
};

const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function analyteOf(test: Entry, specimen: string): Analyte | undefined {
  const code = (str(test?.local_code) ?? "").toUpperCase();
  const loinc = str(test?.loinc);
  const name = (str(test?.name) ?? "").toLowerCase();
  const spec = specimen.toLowerCase();
  let a: Analyte | undefined = (loinc && LOINC_ANALYTE[loinc]) || CODE_ANALYTE[code];
  if (!a && /^egfr/i.test(code)) a = "egfr";
  if (!a) {
    if (/\begfr\b|glomerular filtration/.test(name)) a = "egfr";
    else if (/albumin.*creatinine|\buacr\b|\bacr\b/.test(name)) a = "uacr";
    else if (/^creatinine\b/.test(name)) a = "creatinine";
    else if (/^sodium\b/.test(name)) a = "sodium";
    else if (/^potassium\b/.test(name)) a = "potassium";
    else if (/^chloride\b/.test(name)) a = "chloride";
    else if (/bicarbonate|total co2|^co2\b/.test(name)) a = "bicarbonate";
    else if (/anion gap/.test(name)) a = "anion_gap";
    else if (/urea nitrogen|\bbun\b/.test(name)) a = "bun";
    else if (/a1c|glycated hemoglobin|glycohemoglobin/.test(name)) a = "a1c";
    else if (/^glucose\b/.test(name)) a = "glucose";
    else if (/platelet/.test(name)) a = "platelets";
    else if (/white blood cell|\bwbc\b|leukocyte/.test(name)) a = "wbc";
    else if (/^hemoglobin\b|^hgb\b/.test(name)) a = "hemoglobin";
    else if (/hydroxybutyrate/.test(name)) a = "bhb";
    else if (/^ph\b/.test(name)) a = "ph";
    else if (/^p\s?co2\b/.test(name)) a = "pco2";
    else if (/^lipase/.test(name)) a = "lipase";
    else if (/troponin i\b|troponin-i|\btni\b/.test(name)) a = "troponin";
    else if (/hdl/.test(name)) a = "hdl";
    else if (/ldl/.test(name)) a = "ldl";
    else if (/triglyceride/.test(name)) a = "triglycerides";
    else if (/^(total )?cholesterol/.test(name)) a = "cholesterol";
  }
  if (!a) return undefined;
  if (a === "troponin" && /troponin t|tnt\b/.test(name)) return undefined;
  const otherFluid = /urine|csf|cerebrospinal|fluid|stool|pleural|peritoneal|synovial|dialysate/.test(spec) || /urine|, ur\b|csf/.test(name);
  if (a === "uacr") return otherFluid || /urine/.test(spec) || /urine/.test(name) || !spec ? a : undefined;
  if (otherFluid) return undefined;
  if (a === "glucose" && (/poc|point of care|meter|glucometer|fingerstick|capillary/.test(name) || /capillary|fingerstick/.test(spec) || loinc === "41653-7")) return undefined;
  return a;
}

function convert(a: Analyte, v: number, unitRaw: string | undefined): number | undefined {
  const u = (unitRaw ?? "").trim().replace(/μ/g, "u").replace(/µ/g, "u");
  const ul = u.toLowerCase().replace(/\s+/g, "");
  const target = UNIT[a].toLowerCase().replace(/\s+/g, "");
  if (!ul || ul === target) return v;
  switch (a) {
    case "creatinine":
      if (ul === "umol/l") return v / 88.42;
      if (ul === "mg/l") return v / 10;
      return undefined;
    case "egfr":
      if (/^ml\/min(\/1\.73(m2|m\^2|sqm|m²))?$/.test(ul) || ul === "ml/min/{1.73_m2}") return v;
      return undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      if (ul === "meq/l" || ul === "mmol/l") return v;
      if (a === "bhb" && ul === "mg/dl") return v / 10.41;
      if (a === "bhb" && ul === "umol/l") return v / 1000;
      return undefined;
    case "bun":
      if (ul === "mmol/l") return v * 2.801;
      return undefined;
    case "glucose":
      if (ul === "mmol/l") return v * 18.016;
      return undefined;
    case "a1c":
      if (ul === "%" || ul === "%hba1c" || ul === "%ofhgb") return v;
      if (ul === "mmol/mol") return v / 10.929 + 2.15;
      return undefined;
    case "uacr":
      if (ul === "mg/g" || ul === "ug/mg" || ul === "mg/gcreat" || ul === "mg/g{creat}") return v;
      if (ul === "mg/mmol") return v * 8.84;
      return undefined;
    case "platelets": case "wbc":
      if (["10*3/ul", "10^3/ul", "k/ul", "x10^3/ul", "x10e3/ul", "10*9/l", "10^9/l", "x10^9/l", "thou/ul", "k/mm3", "10*3/mm3"].includes(ul)) return v;
      if (ul === "/ul" || ul === "cells/ul" || ul === "/mm3") return v / 1000;
      return undefined;
    case "hemoglobin":
      if (ul === "g/l") return v / 10;
      if (ul === "mmol/l") return v * 1.611;
      return undefined;
    case "ph":
      if (ul === "" || ul === "ph" || ul === "[ph]" || ul === "units") return v;
      return undefined;
    case "pco2":
      if (ul === "mmhg" || ul === "mm[hg]" || ul === "torr") return v;
      if (ul === "kpa") return v * 7.50062;
      return undefined;
    case "lipase":
      if (ul === "u/l" || ul === "iu/l" || ul === "units/l") return v;
      return undefined;
    case "troponin":
      if (ul === "ng/ml" || ul === "ug/l") return v;
      if (ul === "ng/l" || ul === "pg/ml") return v / 1000;
      return undefined;
    case "cholesterol": case "hdl": case "ldl":
      if (ul === "mmol/l") return v * 38.67;
      return undefined;
    case "triglycerides":
      if (ul === "mmol/l") return v * 88.57;
      return undefined;
  }
  return undefined;
}

function egfrEquation(test: Entry): LabResultRow["egfr_equation"] {
  const n = `${str(test?.name) ?? ""} ${str(test?.local_code) ?? ""}`.toLowerCase();
  const loinc = str(test?.loinc);
  if (/2021/.test(n) || loinc === "98979-8") return "ckd-epi-2021";
  if (/mdrd/.test(n) || loinc === "33914-3" || loinc === "48642-3" || loinc === "48643-1") return "mdrd";
  if (/ckd[- ]?epi/.test(n) || loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  return "unknown";
}

function isRaceVariant(test: Entry): boolean {
  const n = (str(test?.name) ?? "").toLowerCase();
  const loinc = str(test?.loinc);
  if (loinc === "48643-1" || loinc === "88293-6") return true;
  if (/non[- ]?(african|black)/.test(n)) return false;
  return /african|black|\baa\b/.test(n);
}

const STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

function buildLabs(docs: Doc[]): LabResultRow[] {
  interface Copy { row: LabResultRow; rank: number; order: number; ev: Ev }
  const byKey = new Map<string, Copy[]>();
  let order = 0;
  const addResult = (doc: Doc, entryId: string, rv: Entry, accession: string | undefined, collected: unknown, specimen: string, status: unknown) => {
    order++;
    const rank = STATUS_RANK[String(status)];
    if (!rank) return;
    const test = rv.test;
    if (!test || typeof test !== "object") return;
    const a = analyteOf(test, specimen);
    if (!a) return;
    if (a === "egfr" && isRaceVariant(test)) return;
    const raw = typeof rv.value === "number" ? String(rv.value) : str(rv.value);
    if (!raw) return;
    const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(raw.replace(/,/g, ""));
    if (!m) return;
    const num = convert(a, Number(m[2]), str(rv.unit));
    if (num === undefined || !isFinite(num)) return;
    const coll = rfc3339Local(collected);
    if (!coll) return;
    const cmpMap: Record<string, LabResultRow["comparator"]> = { "<": "<", ">": ">", "<=": "<=", ">=": ">=", "≤": "<=", "≥": ">=" };
    const row: LabResultRow = {
      analyte: a,
      value: Math.round(num * 1000) / 1000,
      unit: UNIT[a],
      collected: coll,
      status: rank >= 2 ? "final" : "preliminary",
      evidence: [],
    };
    if (m[1]) row.comparator = cmpMap[m[1]];
    if (a === "egfr") row.egfr_equation = egfrEquation(test);
    const loinc = str(test.loinc);
    if (loinc) row.loinc = loinc;
    const testKey = str(test.local_code) ?? loinc ?? str(test.name) ?? a;
    const key = `${accession ?? coll}|${testKey}`.toUpperCase();
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push({ row, rank, order, ev: { item_id: doc.item.id, entry_id: entryId } });
  };
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      try {
        if (e.type === "result") addResult(doc, id, e, str(e.accession), e.collected, str(e.specimen) ?? "", e.status);
        else if (e.type === "panel") for (const c of arr(e.components)) if (c && typeof c === "object") addResult(doc, id, c, str(e.accession), e.collected, str(e.specimen) ?? "", e.status);
      } catch {
        // skip unreadable entry
      }
    }
  }
  const rows: LabResultRow[] = [];
  for (const copies of byKey.values()) {
    // Most advanced status; among equals, the latest document.
    const best = copies.reduce((b, c) => (c.rank > b.rank || (c.rank === b.rank && c.order > b.order) ? c : b));
    const ev: Evidence = [best.ev];
    for (const c of copies) if (c !== best && c.rank === best.rank && !ev.some((x) => x.item_id === c.ev.item_id && x.entry_id === c.ev.entry_id)) ev.push(c.ev);
    rows.push({ ...best.row, evidence: ev });
  }
  rows.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
  return rows;
}

// ---------------------------------------------------------------------------------------------------------
// Vitals

function num(x: unknown): number | undefined {
  return typeof x === "number" && isFinite(x) ? x : typeof x === "string" && x.trim() !== "" && isFinite(Number(x)) ? Number(x) : undefined;
}

function buildVitals(docs: Doc[]): VitalRow[] {
  interface V { local: string; ms: number; enc?: string; e: Entry; ev: Ev; setting: VitalRow["setting"] }
  const byTime = new Map<string, V[]>();
  for (const doc of docs) {
    const enc = doc.entries.find(([, e]) => e.type === "encounter")?.[1];
    const encId = str(enc?.encounter_id);
    for (const [id, e] of doc.entries) {
      if (e.type !== "vitals") continue;
      const local = toLocal(e.taken);
      if (!local || local.length < 16) continue;
      const ms = Date.parse(`${local.slice(0, 19)}Z`);
      const v: V = { local: local.slice(0, 16), ms, enc: encId, e, ev: { item_id: doc.item.id, entry_id: id }, setting: "hospital" };
      const k = `${local.slice(0, 16)}`;
      if (!byTime.has(k)) byTime.set(k, []);
      byTime.get(k)!.push(v);
    }
  }
  // One measurement set per time: the latest document's copy, evidence from all copies.
  const sets = [...byTime.values()].map((copies) => ({ v: copies[copies.length - 1], evs: copies.map((c) => c.ev) }));
  sets.sort((a, b) => a.v.ms - b.v.ms);
  const rows: { row: VitalRow; ms: number; enc?: string; hasRepeat: boolean; hasBp: boolean }[] = [];
  for (const { v, evs } of sets) {
    const bp = v.e.bp;
    const sys = num(bp?.systolic_mmhg);
    const dia = num(bp?.diastolic_mmhg);
    const pulse = num(v.e.heart_rate_bpm);
    const wt = num(v.e.weight_kg);
    const otherMeasures = pulse !== undefined || wt !== undefined || num(v.e.resp_rate_per_min) !== undefined || num(v.e.temp_f) !== undefined || num(v.e.spo2_pct) !== undefined;
    // A lone blood pressure shortly after a set in the same visit is that set's repeat.
    if (sys !== undefined && dia !== undefined && !otherMeasures) {
      const prev = rows[rows.length - 1];
      if (prev && prev.hasBp && !prev.hasRepeat && prev.enc === v.enc && v.ms - prev.ms <= 60 * 60000) {
        prev.row.repeat_systolic_mmhg = sys;
        prev.row.repeat_diastolic_mmhg = dia;
        prev.row.evidence.push(...evs);
        prev.hasRepeat = true;
        continue;
      }
    }
    if (sys === undefined && pulse === undefined && wt === undefined) continue;
    const row: VitalRow = { setting: v.setting, local_time: v.local, evidence: [...evs] };
    if (sys !== undefined && dia !== undefined) { row.systolic_mmhg = sys; row.diastolic_mmhg = dia; }
    if (pulse !== undefined) row.pulse_bpm = pulse;
    if (wt !== undefined) row.weight_kg = Math.round(wt * 10) / 10;
    rows.push({ row, ms: v.ms, enc: v.enc, hasRepeat: false, hasBp: sys !== undefined && dia !== undefined });
  }
  return rows.map((r) => r.row);
}

// ---------------------------------------------------------------------------------------------------------

function safe<T>(f: () => T[]): T[] {
  try {
    return f();
  } catch {
    return [];
  }
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return empty;
  let docs: Doc[];
  try {
    docs = buildDocs(countingItems(items, asOf));
  } catch {
    return empty;
  }
  let problems: ProblemRow[] = [];
  let dxAllergies: AllergyIntoleranceRow[] = [];
  try {
    const p = buildProblems(docs);
    problems = p.problems;
    dxAllergies = p.dxAllergies;
  } catch {
    // leave empty
  }
  return {
    medications: safe(() => buildMedications(docs)),
    problems,
    allergies: safe(() => buildAllergies(docs, dxAllergies)),
    labs: safe(() => buildLabs(docs)),
    vitals: safe(() => buildVitals(docs)),
  };
}
