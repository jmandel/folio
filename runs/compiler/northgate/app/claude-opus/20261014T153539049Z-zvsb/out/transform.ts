// Mapper: Northgate Family Medicine chart event log (northgate-chart-v1) → consumer app views.
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

const TZ = "America/Chicago";

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

const OFFSET_RE = /(Z|[+-]\d{2}:?\d{2})$/i;

let dtf: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number): { y: number; mo: number; d: number; h: number; mi: number; s: number } {
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
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(new Date(ms))) p[part.type] = part.value;
  let h = Number(p.hour);
  if (h === 24) h = 0;
  return { y: Number(p.year), mo: Number(p.month), d: Number(p.day), h, mi: Number(p.minute), s: Number(p.second) };
}

/** Chicago offset (minutes east of UTC) at the given instant. */
function chicagoOffsetAt(ms: number): number {
  const p = chicagoParts(ms);
  const asUtc = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

interface LocalDT {
  date: string; // YYYY-MM-DD
  hm?: string; // HH:MM
  sec?: string; // SS
  ms?: number; // absolute instant when known
  offsetMin?: number;
}

/** Parse a source date or date-time into local (Chicago) wall-clock parts. Null if unreadable. */
function toLocal(s: unknown): LocalDT | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return { date: t };
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(.*)$/.exec(t);
  if (!m) return null;
  const rest = m[5];
  if (rest && OFFSET_RE.test(rest)) {
    const ms = Date.parse(t);
    if (isNaN(ms)) return null;
    const p = chicagoParts(ms);
    return {
      date: `${pad(p.y, 4)}-${pad(p.mo)}-${pad(p.d)}`,
      hm: `${pad(p.h)}:${pad(p.mi)}`,
      sec: pad(p.s),
      ms,
      offsetMin: chicagoOffsetAt(ms),
    };
  }
  if (rest && rest.trim() !== "") return null;
  // No offset: already local wall-clock time.
  const [y, mo, d] = m[1].split("-").map(Number);
  const wall = Date.UTC(y, mo - 1, d, Number(m[2]), Number(m[3]), Number(m[4] ?? "0"));
  let guess = wall;
  for (let i = 0; i < 3; i++) guess = wall - chicagoOffsetAt(guess) * 60000;
  return { date: m[1], hm: `${m[2]}:${m[3]}`, sec: m[4] ?? "00", ms: guess, offsetMin: chicagoOffsetAt(guess) };
}

function rfc3339Local(s: unknown): string | null {
  const l = toLocal(s);
  if (!l || !l.hm || l.offsetMin === undefined) return null;
  const off = l.offsetMin;
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  return `${l.date}T${l.hm}:${l.sec ?? "00"}${sign}${pad(Math.floor(a / 60))}:${pad(a % 60)}`;
}

/** Sort key for an event time: local date, then absolute ms (or null for date-only). */
function timeKey(s: unknown): { date: string; ms: number | null } {
  if (typeof s === "string") {
    const l = toLocal(s);
    if (l) return { date: l.date, ms: l.ms ?? null };
    const pm = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(s);
    if (pm) return { date: `${pm[1]}-${pm[2] ?? "01"}-${pm[3] ?? "01"}`, ms: null };
  }
  return { date: "0000-00-00", ms: null };
}

function recordedMs(it: FolioItem): number {
  const l = toLocal(it.recorded);
  return l?.ms ?? 0;
}

/** Compare two items' event times: effective (local date, then instant), falling back to recorded. */
function cmpEvent(a: FolioItem, b: FolioItem): number {
  const ka = timeKey(a.effective);
  const kb = timeKey(b.effective);
  if (ka.date !== kb.date) return ka.date < kb.date ? -1 : 1;
  if (ka.ms !== null && kb.ms !== null && ka.ms !== kb.ms) return ka.ms - kb.ms;
  const ra = recordedMs(a);
  const rb = recordedMs(b);
  if (ra !== rb) return ra - rb;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function fuzzy(f: unknown): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f !== "object") return undefined;
  const o = f as { date?: unknown; precision?: unknown };
  if (typeof o.date !== "string") return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(o.date);
  if (!m) return undefined;
  const prec = o.precision;
  if (prec === "year") return { value: m[1], precision: "year" };
  if (prec === "month" && m[2]) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  if (prec === "day" && m[2] && m[3]) return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
  if (!m[2]) return { value: m[1], precision: "year" };
  if (!m[3]) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  return undefined;
}

function localDateOf(s: unknown): string | undefined {
  const l = toLocal(s);
  return l ? l.date : undefined;
}

// ---------------------------------------------------------------------------
// Counting items (as-of, supersession, retraction)
// ---------------------------------------------------------------------------

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inTime: FolioItem[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const l = toLocal(it.recorded);
    if (!l) continue;
    if (l.date <= asOf) inTime.push(it);
  }
  const byId = new Map<string, FolioItem>();
  for (const it of inTime) byId.set(it.id, it);

  // Retractions (envelope `retracts`, plus chart_correction.voided_items, which the schema says are identical).
  const retracted = new Set<string>();
  const retractTargets = (it: FolioItem): string[] => {
    const out: string[] = [];
    if (Array.isArray(it.retracts)) for (const r of it.retracts) if (typeof r === "string") out.push(r);
    const p = it.payload;
    if (p && typeof p === "object") {
      for (const e of Object.values(p)) {
        if (e && typeof e === "object" && (e as any).type === "chart_correction" && Array.isArray((e as any).voided_items)) {
          for (const r of (e as any).voided_items) if (typeof r === "string") out.push(r);
        }
      }
    }
    return out;
  };
  // Iterate to a fixed point so a retracted retraction has no effect.
  let changed = true;
  let guard = 0;
  while (changed && guard++ < 50) {
    changed = false;
    const next = new Set<string>();
    for (const it of inTime) {
      if (retracted.has(it.id)) continue;
      for (const r of retractTargets(it)) if (r !== it.id) next.add(r);
    }
    if (next.size !== retracted.size || [...next].some((x) => !retracted.has(x))) {
      retracted.clear();
      for (const x of next) retracted.add(x);
      changed = true;
    }
  }

  const live = inTime.filter((it) => !retracted.has(it.id));
  const superseded = new Set<string>();
  const supMap = new Map<string, string[]>();
  for (const it of live) {
    if (Array.isArray(it.supersedes)) supMap.set(it.id, it.supersedes.filter((x) => typeof x === "string"));
  }
  for (const it of live) {
    const stack = [...(supMap.get(it.id) ?? [])];
    const seen = new Set<string>();
    while (stack.length) {
      const x = stack.pop()!;
      if (seen.has(x) || x === it.id) continue;
      seen.add(x);
      superseded.add(x);
      const old = byId.get(x);
      if (old && Array.isArray(old.supersedes)) for (const y of old.supersedes) if (typeof y === "string") stack.push(y);
    }
  }
  return live.filter((it) => !superseded.has(it.id));
}

interface Entry {
  item: FolioItem;
  key: string;
  e: any;
}

function entriesOf(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    const p = item.payload;
    if (!p || typeof p !== "object") continue;
    for (const key of Object.keys(p).sort()) {
      const e = (p as any)[key];
      if (e && typeof e === "object" && e.type === type) out.push({ item, key, e });
    }
  }
  return out;
}

function ev(en: Entry): { item_id: string; entry_id: string } {
  return { item_id: en.item.id, entry_id: en.key };
}

function dedupeEvidence(evd: Evidence): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const x of evd) {
    const k = `${x.item_id}\u0000${x.entry_id ?? ""}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

const str = (x: unknown): string | undefined => (typeof x === "string" && x.trim() !== "" ? x : undefined);
const num = (x: unknown): number | undefined => (typeof x === "number" && isFinite(x) ? x : undefined);

// ---------------------------------------------------------------------------
// Drug names
// ---------------------------------------------------------------------------

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  glucophage: "metformin", januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", victoza: "liraglutide",
  trulicity: "dulaglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide", byetta: "exenatide",
  amaryl: "glimepiride", glucotrol: "glipizide", actos: "pioglitazone",
  kerendia: "finerenone", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan",
  micardis: "telmisartan", atacand: "candesartan", zestril: "lisinopril", prinivil: "lisinopril",
  vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", norvasc: "amlodipine",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide",
  aldactone: "spironolactone", inspra: "eplerenone", toprol: "metoprolol", lopressor: "metoprolol",
  coreg: "carvedilol", tenormin: "atenolol", cardizem: "diltiazem", procardia: "nifedipine",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  zetia: "ezetimibe", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", plavix: "clopidogrel",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", prilosec: "omeprazole", nexium: "esomeprazole",
  protonix: "pantoprazole", pepcid: "famotidine", zyloprim: "allopurinol", uloric: "febuxostat",
  neurontin: "gabapentin", lyrica: "pregabalin", zoloft: "sertraline", prozac: "fluoxetine",
  lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine", effexor: "venlafaxine",
  cymbalta: "duloxetine", wellbutrin: "bupropion", remeron: "mirtazapine", desyrel: "trazodone",
  seroquel: "quetiapine", abilify: "aripiprazole", zyprexa: "olanzapine", risperdal: "risperidone",
  buspar: "buspirone", xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam",
  suboxone: "buprenorphine / naloxone", subutex: "buprenorphine", vivitrol: "naltrexone",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", flonase: "fluticasone",
  keflex: "cephalexin", augmentin: "amoxicillin / clavulanate", zithromax: "azithromycin",
  bactrim: "sulfamethoxazole / trimethoprim", cipro: "ciprofloxacin", levaquin: "levofloxacin",
  motrin: "ibuprofen", advil: "ibuprofen", aleve: "naproxen", tylenol: "acetaminophen",
  "k-dur": "potassium chloride", klor: "potassium chloride", veltassa: "patiromer", lokelma: "sodium zirconium cyclosilicate",
  renvela: "sevelamer", sensipar: "cinacalcet", entresto: "sacubitril / valsartan", biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide",
  truvada: "emtricitabine / tenofovir disoproxil", descovy: "emtricitabine / tenofovir alafenamide",
};

const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "dihydrochloride", "hydrobromide", "potassium", "sodium", "calcium", "magnesium",
  "besylate", "besilate", "maleate", "mesylate", "succinate", "tartrate", "fumarate", "sulfate", "phosphate",
  "acetate", "monohydrate", "dihydrate", "trihydrate", "hyclate", "bitartrate", "propionate", "dipropionate",
  "furoate", "xinafoate", "citrate", "disodium", "anhydrous", "hemihydrate", "medoxomil", "bromide", "nitrate",
]);
// Words that are part of the ingredient name even though they look like salts.
const KEEP_AS_IS = new Set([
  "potassium chloride", "potassium citrate", "sodium bicarbonate", "calcium carbonate", "calcium acetate",
  "magnesium oxide", "sodium chloride", "ferrous sulfate", "magnesium hydroxide", "calcium citrate",
  "sodium zirconium cyclosilicate", "levothyroxine sodium", "docusate sodium",
]);
const FORM_WORDS = new Set([
  "er", "xr", "sr", "dr", "xl", "la", "cr", "ec", "odt", "oral", "tablet", "tablets", "tab", "tabs", "capsule",
  "capsules", "cap", "caps", "solution", "injection", "injectable", "pen", "injector", "inhaler", "hfa", "extended",
  "release", "delayed", "chewable", "cream", "ointment", "patch", "spray", "nasal", "suspension", "kwikpen",
  "flexpen", "flextouch", "solostar", "prefilled", "syringe", "auto-injector", "topical", "ophthalmic",
]);

function cleanIngredient(raw: string): string | undefined {
  let t = raw.toLowerCase().replace(/[(),]/g, " ").replace(/\s+/g, " ").trim();
  if (!t) return undefined;
  if (KEEP_AS_IS.has(t)) {
    if (t === "levothyroxine sodium") return "levothyroxine";
    if (t === "docusate sodium") return "docusate";
    return t;
  }
  let words = t.split(" ").filter((w) => !FORM_WORDS.has(w));
  if (words.length === 0) return undefined;
  const first = words[0];
  if (BRANDS[first]) return BRANDS[first];
  const joined = words.join(" ");
  if (KEEP_AS_IS.has(joined)) return joined;
  const kept = [first, ...words.slice(1).filter((w) => !SALT_WORDS.has(w))];
  t = kept.join(" ").trim();
  return t || undefined;
}

interface IngredientPart {
  ingredient?: string;
  strength?: { value: number; unit: string; per?: string };
}

/** Split a drug name into ingredients with their strengths (RxNorm SCD/SBD style or free text). */
function parseDrugName(name: string): IngredientPart[] {
  let n = name.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
  const brandM = /\[([^\]]+)\]/.exec(name);
  // Leading quantity qualifiers like "3 ML", "24 HR", "120 ACTUAT".
  n = n.replace(/^(\d+(\.\d+)?\s*(ML|HR|ACTUAT|DAY)\s+)+/i, "");
  const segs = n.split(/\s+\/\s+|\s+and\s+|\s*-\s*(?=[a-z]+\s+\d)/i);
  const parts: IngredientPart[] = [];
  for (const seg of segs) {
    const m = /^(.*?)(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|unt|units?|iu|meq|g|ml|%)\b(?:\s*\/\s*(ml|actuat|actuation|puff|hr|g))?/i.exec(seg);
    if (m) {
      const ing = cleanIngredient(m[1]);
      let u = m[3].toLowerCase();
      if (u === "µg" || u === "ug") u = "mcg";
      if (u === "unt" || u === "unit" || u === "units" || u === "iu") u = "units";
      parts.push({ ingredient: ing, strength: { value: Number(m[2]), unit: u, per: m[4]?.toLowerCase() } });
    } else {
      const ing = cleanIngredient(seg);
      parts.push({ ingredient: ing });
    }
  }
  // Brand-only free text: "Jardiance 10 mg".
  for (const p of parts) {
    if (p.ingredient && BRANDS[p.ingredient.split(" ")[0]]) p.ingredient = BRANDS[p.ingredient.split(" ")[0]];
  }
  if (parts.length === 1 && !parts[0].ingredient && brandM) {
    const b = brandM[1].toLowerCase().trim();
    if (BRANDS[b]) parts[0].ingredient = BRANDS[b];
  }
  // A brand mapping to a combination expands to several ingredients.
  const out: IngredientPart[] = [];
  for (const p of parts) {
    if (p.ingredient && p.ingredient.includes(" / ")) {
      for (const s of p.ingredient.split(" / ")) out.push({ ingredient: s });
    } else out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Sensitivity
// ---------------------------------------------------------------------------

const MH_DRUGS = [
  "sertraline", "fluoxetine", "citalopram", "escitalopram", "paroxetine", "venlafaxine", "desvenlafaxine",
  "duloxetine", "bupropion", "mirtazapine", "trazodone", "quetiapine", "aripiprazole", "olanzapine",
  "risperidone", "ziprasidone", "lurasidone", "paliperidone", "haloperidol", "clozapine", "lithium",
  "buspirone", "vortioxetine", "vilazodone", "nortriptyline", "amitriptyline", "imipramine", "alprazolam",
  "clonazepam", "lorazepam", "diazepam", "brexpiprazole", "cariprazine", "fluvoxamine",
];
const SU_DRUGS = ["buprenorphine", "methadone", "naltrexone", "disulfiram", "acamprosate"];
const HIV_DRUGS = [
  "emtricitabine", "tenofovir", "bictegravir", "dolutegravir", "raltegravir", "efavirenz", "rilpivirine",
  "darunavir", "atazanavir", "cabotegravir", "abacavir", "zidovudine", "elvitegravir", "doravirine",
  "lamivudine", "lopinavir", "nevirapine",
];
const SRH_DRUGS = [
  "ethinyl estradiol", "norethindrone", "levonorgestrel", "medroxyprogesterone", "etonogestrel",
  "drospirenone", "norgestimate", "desogestrel", "ulipristal", "mifepristone", "misoprostol", "norelgestromin",
];

function drugSensitivity(names: string[], restricted: unknown): Sensitivity[] {
  const s = new Set<Sensitivity>();
  const text = names.join(" ").toLowerCase();
  const has = (list: string[]) => list.some((d) => new RegExp(`\\b${d}\\b`).test(text));
  if (has(SU_DRUGS)) s.add("substance-use");
  if (restricted === "BH" && !s.has("substance-use")) s.add("mental-health");
  if (has(MH_DRUGS)) s.add("mental-health");
  if (has(HIV_DRUGS)) s.add("hiv-sti");
  if (has(SRH_DRUGS)) s.add("sexual-reproductive-health");
  return orderSens(s);
}

const SENS_ORDER: Sensitivity[] = ["mental-health", "substance-use", "sexual-reproductive-health", "hiv-sti", "genetic"];
function orderSens(s: Set<Sensitivity>): Sensitivity[] {
  return SENS_ORDER.filter((x) => s.has(x));
}

function conditionSensitivity(icd: string | undefined, text: string, restricted: unknown): Sensitivity[] {
  const s = new Set<Sensitivity>();
  const code = (icd ?? "").toUpperCase().trim();
  const t = text.toLowerCase();
  if (/^F1\d/.test(code) || /\b(alcohol|opioid|cannabis|cocaine|stimulant|substance) (use|abuse|dependence)/.test(t)) s.add("substance-use");
  if (/^F([2-9]\d)/.test(code) || /\b(depress|anxiety|bipolar|schizo|ptsd|post-traumatic|panic disorder|adhd|attention.deficit|eating disorder|anorexia nervosa|bulimia|psychosis|psychotic|obsessive)/.test(t)) s.add("mental-health");
  if (restricted === "BH" && !s.has("substance-use")) s.add("mental-health");
  if (/^(B2[0-4]|Z21|A5[0-9]|A6[0-4]|B97\.35|Z20\.6|Z20\.2)/.test(code) || /\b(hiv|chlamydia|gonorrh|syphilis|herpes genital|genital herpes|trichomon)/.test(t)) s.add("hiv-sti");
  if (/^(O\d|Z3[0-9]|Z3A|N97|N96|Z31)/.test(code) || /\b(pregnan|contracept|infertil)/.test(t)) s.add("sexual-reproductive-health");
  if (/^(Z15|Z14|Q9[0-9])/.test(code) || /\b(brca|lynch syndrome|genetic|hereditary)/.test(t)) s.add("genetic");
  return orderSens(s);
}

// ---------------------------------------------------------------------------
// Medications
// ---------------------------------------------------------------------------

type MedStatus = "active" | "held" | "stopped";

function mapFrequency(code: unknown, sig: string | undefined): MedicationRow["frequency"] | undefined {
  switch (code) {
    case "QD":
    case "BID":
    case "TID":
    case "QHS":
    case "PRN":
      return code;
  }
  const s = (sig ?? "").toLowerCase();
  if (code === "OTHER") {
    if (/\b(once (a |per )?week|weekly|every week)\b/.test(s)) return "QW";
    if (/\bas needed\b|\bprn\b/.test(s)) return "PRN";
    if (/every 12 hours|\bq12h\b/.test(s)) return "BID";
    if (/every 8 hours|\bq8h\b/.test(s)) return "TID";
    if (/every 24 hours|\bq24h\b/.test(s)) return "QD";
    return "other";
  }
  return undefined;
}

function mapDose(dose: any, parts: IngredientPart[], idx: number): MedicationRow["dose"] | undefined {
  if (!dose || typeof dose !== "object") return undefined;
  const v = num(dose.value);
  const u = typeof dose.unit === "string" ? dose.unit.trim().toLowerCase() : "";
  if (v === undefined || v <= 0) return undefined;
  const combo = parts.length > 1;
  const strength = parts[idx]?.strength;
  const round = (x: number) => Number(x.toPrecision(10));
  if (/^(mg|milligrams?)$/.test(u)) return combo ? undefined : { value: v, unit: "mg" };
  if (/^(mcg|µg|ug|micrograms?)$/.test(u)) return combo ? undefined : { value: v, unit: "mcg" };
  if (/^(units?|u|iu|unt)$/.test(u)) return combo ? undefined : { value: v, unit: "units" };
  if (/^(ml|cc)$/.test(u)) {
    if (strength && strength.per === "ml" && (strength.unit === "mg" || strength.unit === "mcg" || strength.unit === "units")) {
      return { value: round(v * strength.value), unit: strength.unit as "mg" | "mcg" | "units" };
    }
    return combo ? undefined : { value: v, unit: "mL" };
  }
  if (/^(tab|tabs|tablet|tablets|cap|caps|capsule|capsules)$/.test(u)) {
    if (strength && !strength.per && (strength.unit === "mg" || strength.unit === "mcg")) {
      return { value: round(v * strength.value), unit: strength.unit };
    }
    return { value: v, unit: "tablet" };
  }
  if (/^(puffs?|actuations?|sprays?|inhalations?)$/.test(u)) {
    if (strength && (strength.per === "actuat" || strength.per === "actuation" || strength.per === "puff") &&
        (strength.unit === "mg" || strength.unit === "mcg")) {
      return { value: round(v * strength.value), unit: strength.unit };
    }
    return undefined;
  }
  return undefined;
}

interface MedLine {
  medId: string;
  events: Entry[];
}

function buildMedications(items: FolioItem[]): MedicationRow[] {
  const lines = new Map<string, MedLine>();
  for (const en of entriesOf(items, "med_event")) {
    const id = str(en.e.med_id);
    if (!id) continue;
    if (!["start", "change", "hold", "resume", "stop"].includes(en.e.action)) continue;
    let l = lines.get(id);
    if (!l) lines.set(id, (l = { medId: id, events: [] }));
    l.events.push(en);
  }

  interface Cand { row: MedicationRow; latest: Entry; key: string }
  const cands: Cand[] = [];
  for (const line of lines.values()) {
    line.events.sort((a, b) => cmpEvent(a.item, b.item) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
    let status: MedStatus | null = null;
    let since: Entry | null = null; // event that began the current status
    let latest: Entry | null = null; // latest event that applies
    for (const en of line.events) {
      if (status === "stopped") break; // a stop is final for the line
      const a = en.e.action;
      const ns: MedStatus = a === "hold" ? "held" : a === "stop" ? "stopped" : "active";
      if (ns !== status) since = en;
      latest = en;
      status = ns;
    }
    if (!status || !since || !latest) continue;
    const e = latest.e;
    const drug = e.drug && typeof e.drug === "object" ? e.drug : {};
    const drugName = str(drug.name) ?? "";
    const parts = drugName ? parseDrugName(drugName) : [{}];
    const restricted = line.events.some((x) => x.e.restricted === "BH") ? "BH" : undefined;
    const sens = drugSensitivity([drugName, ...parts.map((p) => p.ingredient ?? "")], restricted);
    const applied = line.events.slice(0, line.events.indexOf(latest) + 1);
    const evidence = dedupeEvidence(applied.map(ev));
    const sinceDate = localDateOf(since.item.effective);
    const reasonText = str(since.e.reason_text) ?? (latest !== since && status !== "active" ? str(latest.e.reason_text) : undefined);
    parts.forEach((p, idx) => {
      const out: MedicationRow = {} as MedicationRow;
      if (p.ingredient) out.ingredient = p.ingredient;
      out.drug_name = drugName;
      out.status = status as MedStatus;
      if (sinceDate) out.status_since = sinceDate;
      const d = mapDose(e.dose, parts, idx);
      if (d) out.dose = d;
      const f = mapFrequency(e.frequency, str(e.sig));
      if (f) out.frequency = f;
      if (status === "stopped") {
        const sr = since.e.stop_reason;
        if (["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(sr)) out.stop_reason = sr;
      }
      if (reasonText) out.status_reason_text = reasonText;
      out.patient_reported = false;
      if (sens.length) out.sensitivity = sens;
      out.evidence = evidence;
      cands.push({ row: out, latest, key: p.ingredient ? `ing:${p.ingredient}` : `line:${line.medId}:${idx}` });
    });
  }

  const best = new Map<string, Cand>();
  for (const c of cands) {
    const cur = best.get(c.key);
    if (!cur || cmpEvent(cur.latest.item, c.latest.item) < 0) best.set(c.key, c);
  }
  return [...best.values()]
    .map((c) => c.row)
    .sort((a, b) => (a.ingredient ?? a.drug_name).localeCompare(b.ingredient ?? b.drug_name));
}

// ---------------------------------------------------------------------------
// Problems (and drug-attributed diagnoses → allergy rows)
// ---------------------------------------------------------------------------

function ckdStage(desc: string, icd: string | undefined): ProblemRow["ckd_stage"] | undefined {
  const t = desc.toLowerCase();
  let m = /\bg(1|2|3a|3b|4|5)\b/.exec(t);
  if (m) return ("G" + m[1]) as ProblemRow["ckd_stage"];
  m = /stage\s*(1|2|3a|3b|4|5|i{1,3}a?b?|iv|v)\b/.exec(t);
  if (m) {
    const map: Record<string, ProblemRow["ckd_stage"]> = {
      "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5",
      i: "G1", ii: "G2", iiia: "G3a", iiib: "G3b", iv: "G4", v: "G5",
    };
    if (map[m[1]]) return map[m[1]];
  }
  if (/end.stage renal|end.stage kidney|\besrd\b|\beskd\b/.test(t)) return "G5";
  const c = (icd ?? "").toUpperCase();
  const codeMap: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  return codeMap[c];
}

function albuminuria(desc: string): ProblemRow["albuminuria"] | undefined {
  const t = desc.toLowerCase();
  const m = /\ba(1|2|3)\b/.exec(t);
  if (m) return ("A" + m[1]) as ProblemRow["albuminuria"];
  if (/severely increased albuminuria|macroalbuminuria|severe albuminuria/.test(t)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria|moderate albuminuria/.test(t)) return "A2";
  if (/normal to mildly increased albuminuria/.test(t)) return "A1";
  return undefined;
}

function isCkd(desc: string, icd: string | undefined): boolean {
  return /^N18/i.test(icd ?? "") || /chronic kidney disease|\bckd\b|chronic renal (disease|insufficiency|failure)/i.test(desc);
}

const KNOWN_DRUGS = new Set<string>([
  ...Object.values(BRANDS).flatMap((x) => x.split(" / ")),
  ...MH_DRUGS, ...SU_DRUGS, ...HIV_DRUGS,
  "lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "losartan", "valsartan",
  "amoxicillin", "penicillin", "ampicillin", "cephalexin", "cefdinir", "ceftriaxone", "azithromycin",
  "clarithromycin", "erythromycin", "doxycycline", "minocycline", "ciprofloxacin", "levofloxacin",
  "nitrofurantoin", "clindamycin", "vancomycin", "metronidazole", "sulfamethoxazole", "trimethoprim",
  "atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "metformin", "empagliflozin", "dapagliflozin",
  "canagliflozin", "glipizide", "glyburide", "glimepiride", "pioglitazone", "semaglutide", "liraglutide",
  "dulaglutide", "insulin", "ibuprofen", "naproxen", "aspirin", "celecoxib", "meloxicam", "diclofenac",
  "codeine", "morphine", "hydrocodone", "oxycodone", "tramadol", "spironolactone", "furosemide",
  "hydrochlorothiazide", "chlorthalidone", "amlodipine", "allopurinol", "carbamazepine", "phenytoin",
  "valproate", "valproic acid", "lamotrigine", "isoniazid", "warfarin", "heparin", "contrast", "iodinated contrast",
  "finerenone", "sitagliptin", "colchicine", "prednisone",
]);
const DRUG_CLASSES: Record<string, string[]> = {
  "ace inhibitor": ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril"],
  "ace inhibitors": ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril"],
  penicillins: ["amoxicillin", "penicillin", "ampicillin", "dicloxacillin"],
  penicillin: ["amoxicillin", "penicillin", "ampicillin", "dicloxacillin"],
  "sglt2 inhibitor": ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"],
  "sglt2 inhibitors": ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"],
  statin: ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin"],
  statins: ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin"],
  nsaid: ["ibuprofen", "naproxen", "meloxicam", "diclofenac", "celecoxib"],
  nsaids: ["ibuprofen", "naproxen", "meloxicam", "diclofenac", "celecoxib"],
  "sulfonamide antibiotics": ["sulfamethoxazole"],
  sulfonamides: ["sulfamethoxazole"],
  cephalosporins: ["cephalexin", "cefdinir", "ceftriaxone", "cefuroxime"],
  "loop diuretic": ["furosemide", "bumetanide", "torsemide"],
  "thiazide diuretic": ["hydrochlorothiazide", "chlorthalidone"],
  opioids: ["codeine", "morphine", "hydrocodone", "oxycodone", "tramadol"],
  arb: ["losartan", "valsartan", "olmesartan", "irbesartan", "telmisartan", "candesartan"],
  "angiotensin receptor blocker": ["losartan", "valsartan", "olmesartan", "irbesartan", "telmisartan", "candesartan"],
};

interface DrugAttribution {
  substance: string;
  rxnorm?: string;
  condition?: string; // the condition part, if any
}

/** Find a drug the diagnosis attributes itself to. */
function drugAttribution(desc: string, icd: string | undefined, item: FolioItem): DrugAttribution | null {
  const d = desc.trim();
  const code = (icd ?? "").toUpperCase();
  const adverseCode = /^T(3[6-9]|4\d|50)\.\w{2,3}5/.test(code.replace(/X/g, "X"));
  let drugText: string | undefined;
  let condition: string | undefined;
  let m = /^(?:adverse (?:effect|reaction) of|adverse drug reaction to)\s+(.+?)(?:,\s*(?:initial|subsequent).*)?$/i.exec(d);
  if (m) {
    drugText = m[1];
  } else {
    m = /^(.+?)\s+(?:due to|caused by|induced by|secondary to|associated with|attributed to|from)\s+(.+)$/i.exec(d);
    if (m) {
      condition = m[1];
      drugText = m[2];
    } else {
      m = /^([a-z][a-z0-9 ]*?)[- ](?:induced|associated)\s+(.+)$/i.exec(d);
      if (m) {
        drugText = m[1];
        condition = m[2];
      }
    }
  }
  if (!drugText) return null;
  const dt = drugText.replace(/\s*\((.*?)\)\s*$/, "").replace(/\s+(use|therapy|treatment|exposure)$/i, "").trim();
  const low = dt.toLowerCase();
  // Specific drug?
  const parsed = parseDrugName(dt);
  const ing = parsed.length === 1 ? parsed[0].ingredient : undefined;
  if (ing && (KNOWN_DRUGS.has(ing) || /^insulin\b/.test(ing))) return { substance: ing, condition };
  // Drug class?
  const cls = DRUG_CLASSES[low];
  if (cls) {
    // Exactly one drug of that class on a medication entry in the same item → that drug.
    const found = new Set<string>();
    const p = item.payload;
    if (p && typeof p === "object") {
      for (const e of Object.values(p)) {
        if (e && typeof e === "object" && (e as any).type === "med_event") {
          const nm = str((e as any).drug?.name);
          if (!nm) continue;
          for (const part of parseDrugName(nm)) if (part.ingredient && cls.includes(part.ingredient)) found.add(part.ingredient);
        }
      }
    }
    if (found.size === 1) return { substance: [...found][0], condition };
    return { substance: dt, condition };
  }
  if (adverseCode) return { substance: dt, condition };
  return null;
}

const HYPERSENS_RE = /\b(hives|urticaria|angioedema|anaphyla|rash|swelling|swollen|bronchospasm|wheez|itch|pruritus|exanthem|stevens|johnson|toxic epidermal|dress\b|flushing|throat tightness|lip|tongue|face|facial|eruption|dermatitis|blister|hypersensitivity|allergic)/i;
const SERIOUS_RE = /\b(ketoacidosis|pancreatitis|liver|hepat|hepatitis|renal failure|kidney injury|aki\b|rhabdo|agranulocytosis|neutropenia|thrombocytopenia|anemia|bleed|hemorrhage|hyperkalemia|hyponatremia|lactic acidosis|seizure|arrhythmia|qt prolong|torsade|myopathy|tendon rupture|c\.? diff|colitis|hypoglycemi|fall|syncope|serotonin syndrome|neuroleptic|lupus|interstitial|pneumonitis|nephritis|osteonecrosis)/i;

function classifyReaction(text: string, sourceType?: string): AllergyIntoleranceRow["reaction_type"] {
  if (HYPERSENS_RE.test(text)) return "hypersensitivity";
  if (SERIOUS_RE.test(text)) return "serious_adverse_event";
  if (sourceType === "allergy") return "hypersensitivity";
  if (sourceType === "intolerance") return "side_effect";
  if (sourceType === "adverse_reaction") return "serious_adverse_event";
  return "side_effect";
}

function buildProblems(items: FolioItem[]): { problems: ProblemRow[]; derivedAllergies: { row: AllergyIntoleranceRow; latest: Entry }[] } {
  const lines = new Map<string, Entry[]>();
  for (const en of entriesOf(items, "problem_event")) {
    const id = str(en.e.problem_id);
    if (!id) continue;
    if (!["add", "update", "resolve", "remove"].includes(en.e.action)) continue;
    const l = lines.get(id) ?? [];
    l.push(en);
    lines.set(id, l);
  }
  const problems: ProblemRow[] = [];
  const derived: { row: AllergyIntoleranceRow; latest: Entry }[] = [];
  for (const evs of lines.values()) {
    evs.sort((a, b) => cmpEvent(a.item, b.item) || (a.key < b.key ? -1 : 1));
    let status: "active" | "resolved" | "removed" | null = null;
    let statusEv: Entry | null = null;
    for (const en of evs) {
      const a = en.e.action;
      if (a === "add") { status = "active"; statusEv = en; }
      else if (a === "resolve") { status = "resolved"; statusEv = en; }
      else if (a === "remove") { status = "removed"; statusEv = en; }
      else if (a === "update" && status === null) { status = "active"; statusEv = en; }
    }
    if (!status || status === "removed") continue;
    // Latest wording: the latest event carrying a description.
    let latest = evs[evs.length - 1];
    for (let i = evs.length - 1; i >= 0; i--) if (str(evs[i].e.description)) { latest = evs[i]; break; }
    const e = latest.e;
    const desc = str(e.description);
    if (!desc) continue;
    const icd = str(e.icd10cm);
    let onset: ProblemRow["onset"] | undefined;
    for (let i = evs.length - 1; i >= 0; i--) {
      const f = fuzzy(evs[i].e.onset);
      if (f) { onset = f; break; }
    }
    const restricted = evs.some((x) => x.e.restricted === "BH") ? "BH" : undefined;
    const evidence = dedupeEvidence([ev(evs[0]), ...(statusEv ? [ev(statusEv)] : []), ev(latest)]);

    const attr = drugAttribution(desc, icd, latest.item);
    const adverseOnly = !!attr && !attr.condition;
    if (attr) {
      const reactionText = attr.condition ?? desc;
      const rt = classifyReaction(reactionText);
      const row: AllergyIntoleranceRow = {
        substance: attr.substance,
        reaction_type: rt,
        mechanism: "unknown",
        criticality: "unknown",
        evidence,
      };
      if (attr.condition) row.reaction = attr.condition;
      if (onset) row.onset = onset;
      const s = drugSensitivity([attr.substance], undefined);
      if (s.length) row.sensitivity = s;
      derived.push({ row, latest });
    }
    if (adverseOnly) continue;

    const row: ProblemRow = { condition: desc, status: status === "resolved" ? "resolved" : "active", evidence };
    if (icd) row.icd10cm = icd;
    const sn = str(e.snomed);
    if (sn) row.snomed = sn;
    if (onset) row.onset = onset;
    if (isCkd(desc, icd)) {
      const st = ckdStage(desc, icd);
      if (st) row.ckd_stage = st;
      const al = albuminuria(desc);
      if (al) row.albuminuria = al;
    }
    const sens = conditionSensitivity(icd, desc, restricted);
    if (sens.length) row.sensitivity = sens;
    problems.push(row);
  }
  problems.sort((a, b) => a.condition.localeCompare(b.condition));
  return { problems, derivedAllergies: derived };
}

// ---------------------------------------------------------------------------
// Allergies
// ---------------------------------------------------------------------------

function substanceName(sub: any): { name: string; rxnorm?: string } | null {
  if (!sub || typeof sub !== "object") return null;
  const name = str(sub.name);
  if (!name) return null;
  const rx = str(sub.rxnorm);
  if (rx) {
    // A drug with an ingredient-level RxNorm code: generic ingredient name, lower case.
    const parts = parseDrugName(name);
    const ing = parts.length === 1 && parts[0].ingredient ? parts[0].ingredient : name.toLowerCase().trim();
    return { name: ing, rxnorm: rx };
  }
  const parts = parseDrugName(name);
  if (parts.length === 1 && parts[0].ingredient && (KNOWN_DRUGS.has(parts[0].ingredient) || BRANDS[name.toLowerCase().split(" ")[0]])) {
    return { name: parts[0].ingredient };
  }
  return { name };
}

function buildAllergies(items: FolioItem[], derived: { row: AllergyIntoleranceRow; latest: Entry }[]): AllergyIntoleranceRow[] {
  const lines = new Map<string, Entry[]>();
  for (const en of entriesOf(items, "allergy_event")) {
    const id = str(en.e.allergy_id);
    if (!id) continue;
    if (!["add", "update", "inactivate"].includes(en.e.action)) continue;
    const l = lines.get(id) ?? [];
    l.push(en);
    lines.set(id, l);
  }
  const result = new Map<string, { row: AllergyIntoleranceRow; latest: Entry }>();
  const anyListed = new Set<string>(); // substances the allergy list mentions at all (active or inactivated)
  for (const evs of lines.values()) {
    evs.sort((a, b) => cmpEvent(a.item, b.item) || (a.key < b.key ? -1 : 1));
    const latest = evs[evs.length - 1];
    const e = latest.e;
    let sub = substanceName(e.substance);
    if (!sub) {
      for (let i = evs.length - 1; i >= 0 && !sub; i--) sub = substanceName(evs[i].e.substance);
    }
    if (!sub) continue;
    anyListed.add(sub.name.toLowerCase());
    if (e.action === "inactivate") continue;
    const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.filter((x: unknown) => typeof x === "string" && x.trim()) : [];
    const reactionText = reactions.join("; ");
    const srcType = e.reaction_type;
    const rt = classifyReaction(reactionText, srcType);
    let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
    if (srcType === "allergy" && rt === "hypersensitivity") mechanism = "immune";
    else if ((srcType === "intolerance" || srcType === "adverse_reaction") && rt !== "hypersensitivity") mechanism = "non_immune";
    const crit = e.severity === "high" ? "high" : e.severity === "low" ? "low" : "unknown";
    const row: AllergyIntoleranceRow = {
      substance: sub.name,
      reaction_type: rt,
      mechanism,
      criticality: crit,
      evidence: dedupeEvidence([ev(evs[0]), ev(latest)]),
    };
    if (sub.rxnorm) row.rxnorm_ingredient = sub.rxnorm;
    if (reactionText) row.reaction = reactionText;
    let onset: AllergyIntoleranceRow["onset"] | undefined;
    for (let i = evs.length - 1; i >= 0; i--) {
      const f = fuzzy(evs[i].e.onset);
      if (f) { onset = f; break; }
    }
    if (onset) row.onset = onset;
    const s = drugSensitivity([sub.name], undefined);
    if (s.length) row.sensitivity = s;
    const key = sub.name.toLowerCase();
    const cur = result.get(key);
    if (!cur || cmpEvent(cur.latest.item, latest.item) < 0) result.set(key, { row, latest });
  }
  for (const d of derived) {
    const key = d.row.substance.toLowerCase();
    if (anyListed.has(key)) continue;
    const cur = result.get(key);
    if (!cur || cmpEvent(cur.latest.item, d.latest.item) < 0) result.set(key, d);
  }
  return [...result.values()].map((x) => x.row).sort((a, b) => a.substance.localeCompare(b.substance));
}

// ---------------------------------------------------------------------------
// Labs
// ---------------------------------------------------------------------------

const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const NFM_CODES: Record<string, Analyte> = {
  CREAT: "creatinine", "EGFR-NAA": "egfr", "EGFR-AA": "egfr", EGFR: "egfr", NA: "sodium", K: "potassium",
  CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun",
  GLU: "glucose", GLUC: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc",
  HGB: "hemoglobin", BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase", TROP: "troponin",
  TROPI: "troponin", TNI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides",
  HDL: "hdl", LDL: "ldl", "LDL-C": "ldl", LDLC: "ldl", "LDL-CALC": "ldl", "LDL-D": "ldl",
};

const LOINC: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr",
  "98979-8": "egfr", "50044-7": "egfr", "69405-9": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin", "53060-9": "bhb", "2744-1": "ph", "11558-4": "ph", "2019-8": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "49563-0": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

function analyteByName(name: string): Analyte | undefined {
  const n = name.toLowerCase();
  if (/\b(poc|point of care|meter|fingerstick|whole blood glucose, capillary)\b/.test(n)) return undefined;
  if (/a1c|glycated|glycosylated/.test(n)) return "a1c";
  if (/albumin.*creatinine|\buacr\b|\bacr\b|microalbumin\/creat/.test(n)) return "uacr";
  if (/\begfr\b|glomerular filtration/.test(n)) return "egfr";
  if (/urine|\bur\b/.test(n)) return undefined;
  if (/creatinine/.test(n)) return "creatinine";
  if (/potassium/.test(n)) return "potassium";
  if (/sodium/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/bicarbonate|\bco2\b.*total|total co2|carbon dioxide/.test(n) && !/pco2|partial/.test(n)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/glucose/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(n)) return "wbc";
  if (/^hemoglobin\b|^hgb\b/.test(n)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b/.test(n)) return "bhb";
  if (/pco2|partial pressure.*co2|carbon dioxide, partial/.test(n)) return "pco2";
  if (/^ph\b|\bph,? (arterial|venous|blood)/.test(n)) return "ph";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n) && !/troponin t/.test(n)) return "troponin";
  if (/non-hdl|vldl|ldl\/hdl|ratio/.test(n)) return undefined;
  if (/\bhdl\b/.test(n)) return "hdl";
  if (/\bldl\b/.test(n)) return "ldl";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n)) return "cholesterol";
  return undefined;
}

function analyteOf(e: any): Analyte | undefined {
  const t = e.test && typeof e.test === "object" ? e.test : {};
  const code = str(t.nfm_code)?.toUpperCase().trim();
  const name = str(t.name) ?? "";
  if (/\b(poc|point of care|meter|fingerstick)\b/i.test(name) || (code && /POC/.test(code))) return undefined;
  if (code && NFM_CODES[code]) return NFM_CODES[code];
  if (code && /^EGFR/.test(code)) return "egfr";
  const loinc = str(t.loinc);
  if (loinc && LOINC[loinc]) return LOINC[loinc];
  return analyteByName(name);
}

function isRaceVariant(e: any): boolean {
  const t = e.test ?? {};
  const code = String(t.nfm_code ?? "").toUpperCase();
  const name = String(t.name ?? "").toLowerCase();
  const rc = String(e.external_ref?.result_code ?? "").toUpperCase();
  if (code === "EGFR-AA" || /09A$|-AA$|EGFRAA$/.test(rc)) return true;
  if (/non[- ]?african|non[- ]?black|non-aa/.test(name)) return false;
  if (/african american|\bblack\b/.test(name)) return true;
  const loinc = String(t.loinc ?? "");
  return loinc === "48643-1" || loinc === "88293-6";
}

function egfrEquation(e: any): LabResultRow["egfr_equation"] {
  const text = `${e.comment ?? ""} ${e.test?.name ?? ""}`.toLowerCase();
  if (/ckd[- ]?epi[^0-9]{0,20}2021|2021[^0-9]{0,10}ckd[- ]?epi|race[- ]free/.test(text)) return "ckd-epi-2021";
  if (/ckd[- ]?epi[^0-9]{0,20}2009|2009[^0-9]{0,10}ckd[- ]?epi/.test(text)) return "ckd-epi-2009";
  if (/\bmdrd\b/.test(text)) return "mdrd";
  const rc = String(e.external_ref?.result_code ?? "").toUpperCase();
  if (/EGFR21/.test(rc)) return "ckd-epi-2021";
  if (/EGFR09/.test(rc)) return "ckd-epi-2009";
  if (/MDRD/.test(rc)) return "mdrd";
  const loinc = String(e.test?.loinc ?? "");
  if (loinc === "98979-8") return "ckd-epi-2021";
  if (loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  return "unknown";
}

function normUnit(u: string): string {
  return u.trim().toLowerCase().replace(/\s+/g, "").replace(/µ/g, "u").replace(/mcl/g, "ul");
}

/** Convert a value to the analyte's unit. Undefined if the unit is not understood. */
function convert(analyte: Analyte, v: number, unitRaw: string): number | undefined {
  const u = normUnit(unitRaw);
  const r = (x: number) => Number(x.toPrecision(10));
  switch (analyte) {
    case "creatinine":
      if (u === "mg/dl") return v;
      if (u === "umol/l") return r(v / 88.42);
      return undefined;
    case "egfr":
      if (u === "" || /^ml\/min(\/1\.73m2|\/1\.73m\^2|\/1\.73sqm|\/{1\.73_m2})?$/.test(u) || u === "ml/min/1.73m2") return v;
      return undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      if (u === "mmol/l" || u === "meq/l" || u === "") return v;
      return undefined;
    case "bhb":
      if (u === "mmol/l") return v;
      if (u === "mg/dl") return r(v / 10.41);
      return undefined;
    case "bun":
      if (u === "mg/dl") return v;
      return undefined;
    case "glucose":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return r(v * 18.016);
      return undefined;
    case "a1c":
      if (u === "%" || u === "" || u === "%hba1c" || u === "%ofhgb" || u === "%oftotalhgb") return v;
      return undefined;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "mg/gcr" || u === "ug/mgcreat" || u === "ug/mg" || u === "mcg/mg") return v;
      if (u === "mg/mmol") return r(v * 8.84);
      return undefined;
    case "platelets": case "wbc":
      if (u === "cells/ul" || u === "/ul" || u === "cells/mm3" || u === "/mm3") return r(v / 1000);
      if (u === "k/ul" || u === "10*3/ul" || u === "10^3/ul" || u === "x10e3/ul" || u === "thou/ul" || u === "10*9/l" || u === "10^9/l" || u === "x10^9/l") return v;
      return undefined;
    case "hemoglobin":
      if (u === "g/dl") return v;
      if (u === "g/l") return r(v / 10);
      return undefined;
    case "ph":
      if (u === "" || u === "[ph]" || u === "ph") return v;
      return undefined;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return v;
      if (u === "kpa") return r(v * 7.50062);
      return undefined;
    case "lipase":
      if (u === "u/l" || u === "iu/l") return v;
      return undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return r(v / 1000);
      return undefined;
    case "cholesterol": case "triglycerides": case "hdl": case "ldl":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return r(v * (analyte === "triglycerides" ? 88.57 : 38.67));
      return undefined;
  }
  return undefined;
}

function parseValue(s: unknown): { value: number; comparator?: LabResultRow["comparator"] } | null {
  if (typeof s === "number" && isFinite(s)) return { value: s };
  if (typeof s !== "string") return null;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?(?:\d+(?:,\d{3})*(?:\.\d+)?|\.\d+))\s*$/.exec(s);
  if (!m) return null;
  const v = Number(m[2].replace(/,/g, ""));
  if (!isFinite(v)) return null;
  let c = m[1] as string | undefined;
  if (c === "≤") c = "<=";
  if (c === "≥") c = ">=";
  return c ? { value: v, comparator: c as LabResultRow["comparator"] } : { value: v };
}

const STATUS_RANK: Record<string, number> = { P: 1, F: 2, C: 3 };

function buildLabs(items: FolioItem[]): LabResultRow[] {
  const groups = new Map<string, Entry[]>();
  for (const en of entriesOf(items, "imported_result")) {
    const e = en.e;
    const acc = str(e.external_ref?.accession);
    const comp = str(e.external_ref?.result_code) ?? str(e.test?.nfm_code) ?? en.key;
    const key = acc ? `${acc}\u0000${comp}` : `${en.item.id}\u0000${en.key}`;
    const g = groups.get(key) ?? [];
    g.push(en);
    groups.set(key, g);
  }
  const rows: { row: LabResultRow; sort: string }[] = [];
  for (const g of groups.values()) {
    g.sort((a, b) => {
      const ra = STATUS_RANK[a.e.result_status] ?? 0;
      const rb = STATUS_RANK[b.e.result_status] ?? 0;
      if (ra !== rb) return ra - rb;
      const d = recordedMs(a.item) - recordedMs(b.item);
      if (d) return d;
      return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0;
    });
    const best = g[g.length - 1];
    const e = best.e;
    if (!(e.result_status in STATUS_RANK)) continue;
    const analyte = analyteOf(e);
    if (!analyte) continue;
    if (analyte === "egfr" && isRaceVariant(e)) continue;
    const pv = parseValue(e.value);
    if (!pv) continue; // withdrawn, invalidated, not performed, or words
    const unitRaw = typeof e.unit === "string" ? e.unit : "";
    const v = convert(analyte, pv.value, unitRaw);
    if (v === undefined) continue;
    const collected = rfc3339Local(e.collected) ?? rfc3339Local(best.item.effective);
    if (!collected) continue;
    const row: LabResultRow = {
      analyte,
      value: v,
      unit: UNIT[analyte],
      collected,
      status: e.result_status === "P" ? "preliminary" : "final",
      evidence: dedupeEvidence(g.slice().reverse().map(ev)),
    };
    if (pv.comparator) row.comparator = pv.comparator;
    if (analyte === "egfr") row.egfr_equation = egfrEquation(e);
    const loinc = str(e.test?.loinc);
    if (loinc) row.loinc = loinc;
    // Reorder keys for readability.
    const ordered: LabResultRow = {
      analyte: row.analyte,
      value: row.value,
      ...(row.comparator ? { comparator: row.comparator } : {}),
      unit: row.unit,
      collected: row.collected,
      status: row.status,
      ...(row.egfr_equation ? { egfr_equation: row.egfr_equation } : {}),
      ...(row.loinc ? { loinc: row.loinc } : {}),
      evidence: row.evidence,
    };
    const ms = toLocal(collected)?.ms ?? 0;
    rows.push({ row: ordered, sort: `${String(ms).padStart(15, "0")}|${analyte}|${best.item.id}|${best.key}` });
  }
  rows.sort((a, b) => (a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0));
  return rows.map((r) => r.row);
}

// ---------------------------------------------------------------------------
// Vitals
// ---------------------------------------------------------------------------

function parseBp(s: unknown): [number, number] | null {
  if (typeof s !== "string") return null;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(s);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
}

function buildVitals(items: FolioItem[]): VitalRow[] {
  const rows: { row: VitalRow; sort: string }[] = [];
  for (const en of entriesOf(items, "vital_set")) {
    const e = en.e;
    let l = toLocal(en.item.effective);
    if (!l || !l.hm) l = toLocal(en.item.recorded);
    if (!l || !l.hm) continue;
    const row: VitalRow = { setting: "clinic", local_time: `${l.date}T${l.hm}`, evidence: [ev(en)] };
    const bp = parseBp(e.bp);
    const bp2 = parseBp(e.bp_repeat);
    if (bp) {
      row.systolic_mmhg = bp[0];
      row.diastolic_mmhg = bp[1];
    }
    if (bp2) {
      if (bp) {
        row.repeat_systolic_mmhg = bp2[0];
        row.repeat_diastolic_mmhg = bp2[1];
      } else {
        row.systolic_mmhg = bp2[0];
        row.diastolic_mmhg = bp2[1];
      }
    }
    const pulse = num(e.pulse_bpm);
    if (pulse !== undefined) row.pulse_bpm = pulse;
    const wt = num(e.weight_lb);
    if (wt !== undefined && wt > 0) row.weight_kg = Math.round(wt * 0.45359237 * 10) / 10;
    const { evidence, ...rest } = row;
    const hasData = Object.keys(rest).some((k) => k !== "setting" && k !== "local_time");
    if (!hasData) continue;
    rows.push({ row: { ...rest, evidence }, sort: `${row.local_time}|${en.item.id}|${en.key}` });
  }
  rows.sort((a, b) => (a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0));
  return rows.map((r) => r.row);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function safe<T>(f: () => T[]): T[] {
  try {
    return f();
  } catch {
    return [];
  }
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const list = Array.isArray(items) ? items : [];
  let counting: FolioItem[] = [];
  try {
    counting = countingItems(list, typeof asOf === "string" ? asOf.slice(0, 10) : "9999-12-31");
  } catch {
    counting = [];
  }
  let probs: ReturnType<typeof buildProblems> = { problems: [], derivedAllergies: [] };
  try {
    probs = buildProblems(counting);
  } catch {
    /* skip */
  }
  return {
    medications: safe(() => buildMedications(counting)),
    problems: probs.problems,
    allergies: safe(() => buildAllergies(counting, probs.derivedAllergies)),
    labs: safe(() => buildLabs(counting)),
    vitals: safe(() => buildVitals(counting)),
  };
}
