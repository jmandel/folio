// Mapper: Northgate Family Medicine chart event log (northgate-chart-v1) → consumer views.
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

interface LocalParts { y: string; m: string; d: string; hh: string; mm: string; ss: string }

let fmt: Intl.DateTimeFormat | null = null;
function localParts(ms: number): LocalParts | null {
  if (!isFinite(ms)) return null;
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    });
  }
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = part.value;
  const hh = p.hour === "24" ? "00" : p.hour;
  return { y: p.year, m: p.month, d: p.day, hh, mm: p.minute, ss: p.second };
}

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;
const DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?/;

/** Local wall-clock parts for a date-time string; null for plain/partial dates or garbage. */
function toLocal(s: unknown): LocalParts | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  const m = DATE_TIME.exec(t);
  if (!m) return null;
  if (HAS_ZONE.test(t)) return localParts(Date.parse(t));
  return { y: m[1], m: m[2], d: m[3], hh: m[4], mm: m[5], ss: m[6] ?? "00" };
}

/** Local date (with source precision for partial dates). */
function localDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  const p = toLocal(t);
  return p ? `${p.y}-${p.m}-${p.d}` : undefined;
}

/** Epoch ms for sorting; local times without offset are interpreted in Chicago. */
function instant(s: unknown): number {
  if (typeof s !== "string") return NaN;
  const t = s.trim();
  if (HAS_ZONE.test(t) && DATE_TIME.test(t)) return Date.parse(t);
  const m = DATE_TIME.exec(t);
  if (m) {
    const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? "00"}`;
    const off = chicagoOffset(iso);
    return off ? Date.parse(iso + off) : NaN;
  }
  const d = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(t);
  if (d) {
    const iso = `${d[1]}-${d[2] ?? "01"}-${d[3] ?? "01"}T00:00:00`;
    const off = chicagoOffset(iso);
    return off ? Date.parse(iso + off) : NaN;
  }
  return NaN;
}

/** America/Chicago offset ("-05:00"/"-06:00") in effect at a local wall-clock time. */
function chicagoOffset(localIso: string): string | null {
  for (const off of ["-06:00", "-05:00"]) {
    const p = localParts(Date.parse(localIso + off));
    if (p && `${p.y}-${p.m}-${p.d}T${p.hh}:${p.mm}:${p.ss}` === localIso.slice(0, 19)) return off;
  }
  // Nonexistent local time (spring-forward gap): fall back to standard offset.
  return isFinite(Date.parse(localIso + "-06:00")) ? "-06:00" : null;
}

/** RFC 3339 with the Chicago offset in effect. */
function toRfc3339Local(s: unknown): string | undefined {
  const p = toLocal(s);
  if (!p) return undefined;
  const iso = `${p.y}-${p.m}-${p.d}T${p.hh}:${p.mm}:${p.ss}`;
  const off = chicagoOffset(iso);
  return off ? iso + off : undefined;
}

function localMinute(s: unknown): string | undefined {
  const p = toLocal(s);
  return p ? `${p.y}-${p.m}-${p.d}T${p.hh}:${p.mm}` : undefined;
}

// ---------------------------------------------------------------------------
// Counting items (as-of, supersession, retraction)

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const recordedOk = (it: FolioItem): boolean => {
    const d = localDate(it.recorded);
    return !!d && d.length === 10 && d <= asOf;
  };
  const counted = items.filter((it) => it && typeof it.id === "string" && it.payload && typeof it.payload === "object" && recordedOk(it));
  const asList = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

  const retracted = new Set<string>();
  for (const it of counted) {
    for (const id of asList(it.retracts)) retracted.add(id);
    for (const e of Object.values(it.payload)) {
      if (e && e.type === "chart_correction") for (const id of asList(e.voided_items)) retracted.add(id);
    }
  }
  // Supersession is transitive: every counting item's `supersedes` removes its targets.
  const superseded = new Set<string>();
  for (const it of counted) {
    if (retracted.has(it.id)) continue;
    for (const id of asList(it.supersedes)) superseded.add(id);
  }
  return counted.filter((it) => !retracted.has(it.id) && !superseded.has(it.id));
}

interface Ent { item: FolioItem; key: string; e: any }

function entries(items: FolioItem[], type: string): Ent[] {
  const out: Ent[] = [];
  for (const item of items) {
    for (const [key, e] of Object.entries(item.payload)) {
      if (e && typeof e === "object" && e.type === type) out.push({ item, key, e });
    }
  }
  return out;
}

/** Replay order: effective, then recorded, then id. */
function cmpEvents(a: Ent, b: Ent): number {
  const da = localDate(a.item.effective) ?? "";
  const db = localDate(b.item.effective) ?? "";
  const ta = toLocal(a.item.effective);
  const tb = toLocal(b.item.effective);
  if (ta && tb) {
    const d = instant(a.item.effective) - instant(b.item.effective);
    if (d) return d;
  } else if (da !== db) {
    return da < db ? -1 : 1;
  }
  const r = instant(a.item.recorded) - instant(b.item.recorded);
  if (r) return r;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function ev(x: Ent): { item_id: string; entry_id: string } {
  return { item_id: x.item.id, entry_id: x.key };
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && isFinite(v) ? v : undefined;
}

function round(x: number, dp: number): number {
  const f = Math.pow(10, dp);
  return Math.round(x * f) / f;
}

function fuzzy(o: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!o || typeof o !== "object") return undefined;
  const d = str(o.date);
  if (!d) return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(d);
  if (!m) return undefined;
  const prec = o.precision === "year" || o.precision === "month" || o.precision === "day" ? o.precision : m[3] ? "day" : m[2] ? "month" : "year";
  if (prec === "year") return { value: m[1], precision: "year" };
  if (prec === "month") return m[2] ? { value: `${m[1]}-${m[2]}`, precision: "month" } : { value: m[1], precision: "year" };
  if (m[3]) return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
  return m[2] ? { value: `${m[1]}-${m[2]}`, precision: "month" } : { value: m[1], precision: "year" };
}

// ---------------------------------------------------------------------------
// Drug names

const BRANDS: Record<string, string> = {
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide", byetta: "exenatide",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", glucophage: "metformin",
  glucotrol: "glipizide", amaryl: "glimepiride", actos: "pioglitazone",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin", zetia: "ezetimibe",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril",
  norvasc: "amlodipine", procardia: "nifedipine", cardizem: "diltiazem",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide",
  hygroton: "chlorthalidone", thalitone: "chlorthalidone", aldactone: "spironolactone", inspra: "eplerenone",
  kerendia: "finerenone", toprol: "metoprolol", lopressor: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  catapres: "clonidine", apresoline: "hydralazine",
  synthroid: "levothyroxine", levoxyl: "levothyroxine",
  zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine", paxil: "paroxetine",
  wellbutrin: "bupropion", cymbalta: "duloxetine", effexor: "venlafaxine", pristiq: "desvenlafaxine",
  remeron: "mirtazapine", desyrel: "trazodone", seroquel: "quetiapine", abilify: "aripiprazole", risperdal: "risperidone",
  zyprexa: "olanzapine", lamictal: "lamotrigine", buspar: "buspirone", xanax: "alprazolam", ativan: "lorazepam",
  klonopin: "clonazepam", valium: "diazepam", ambien: "zolpidem",
  neurontin: "gabapentin", lyrica: "pregabalin", zyloprim: "allopurinol", uloric: "febuxostat", colcrys: "colchicine",
  plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", jantoven: "warfarin",
  prilosec: "omeprazole", protonix: "pantoprazole", nexium: "esomeprazole", pepcid: "famotidine",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", naprosyn: "naproxen",
  keflex: "cephalexin", amoxil: "amoxicillin", zithromax: "azithromycin", cipro: "ciprofloxacin", levaquin: "levofloxacin",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", flonase: "fluticasone", zyrtec: "cetirizine",
  claritin: "loratadine", allegra: "fexofenadine", lokelma: "sodium zirconium cyclosilicate", veltassa: "patiromer",
  kayexalate: "sodium polystyrene sulfonate", narcan: "naloxone", vivitrol: "naltrexone", sublocade: "buprenorphine",
  chantix: "varenicline", antabuse: "disulfiram", "k-dur": "potassium chloride", "klor-con": "potassium chloride",
  bactrim: "sulfamethoxazole / trimethoprim", augmentin: "amoxicillin / clavulanate", suboxone: "buprenorphine / naloxone",
  zubsolv: "buprenorphine / naloxone", entresto: "sacubitril / valsartan", janumet: "sitagliptin / metformin",
  synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin", hyzaar: "losartan / hydrochlorothiazide",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", truvada: "emtricitabine / tenofovir disoproxil",
  descovy: "emtricitabine / tenofovir alafenamide",
};

const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "dihydrochloride", "hydrobromide", "potassium", "sodium", "calcium", "magnesium",
  "besylate", "maleate", "mesylate", "succinate", "tartrate", "fumarate", "citrate", "sulfate", "acetate",
  "phosphate", "bitartrate", "hyclate", "monohydrate", "dihydrate", "trihydrate", "anhydrous", "propionate",
  "furoate", "dipropionate", "bromide", "lactate", "gluconate", "carbonate", "medoxomil", "axetil", "disodium",
  "trometamol", "tromethamine", "xinafoate", "valerate", "cypionate", "enanthate", "decanoate", "pivoxil",
]);

const FORM_WORDS = new Set([
  "oral", "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "solution", "suspension",
  "injection", "injectable", "pen", "injector", "prefilled", "syringe", "extended", "release", "delayed", "er",
  "xr", "xl", "sr", "dr", "ec", "cr", "film", "coated", "chewable", "disintegrating", "odt", "inhaler", "inhalation",
  "aerosol", "metered", "dose", "spray", "nasal", "topical", "cream", "ointment", "gel", "patch", "transdermal",
  "auto-injector", "autoinjector", "powder", "for", "kit", "drops", "ophthalmic", "otic", "liquid", "elixir", "syrup",
  "vial", "cartridge", "mg", "mcg", "ml", "unt", "units", "actuat", "hfa", "daily", "once", "weekly",
]);

/** Generic ingredient name (lower case) from a drug display name; undefined if nothing usable. */
function ingredientOf(name: string): string | undefined {
  let s = name.toLowerCase();
  const bracket = /\[([^\]]+)\]/.exec(s);
  s = s.replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ");
  // Leading quantity, e.g. "3 ML insulin glargine ..."
  s = s.replace(/^\s*([\d.]+\s*(ml|mg|actuat|unt|hr|hour|day)\b\s*)+/i, "");
  // Combination components separated by " / " in RxNorm names.
  const parts = s.split(/\s\/\s|\s+and\s+|\+/);
  const out: string[] = [];
  for (const part of parts) {
    // Text before the first strength number.
    const head = part.split(/\s\d|^\d/)[0];
    const words = head.split(/[\s,]+/).filter(Boolean);
    const kept: string[] = [];
    for (let i = 0; i < words.length; i++) {
      const w = words[i].replace(/[()]/g, "");
      if (!w) continue;
      if (FORM_WORDS.has(w)) continue;
      if (i > 0 && SALT_WORDS.has(w)) continue;
      kept.push(w);
    }
    if (!kept.length) continue;
    let g = kept.join(" ");
    const brand = BRANDS[kept[0]] ?? BRANDS[g];
    if (brand) g = brand;
    out.push(g);
  }
  if (!out.length && bracket) {
    const b = BRANDS[bracket[1].trim()];
    if (b) return b;
  }
  if (!out.length) return undefined;
  return Array.from(new Set(out)).join(" / ");
}

const MENTAL_HEALTH_DRUGS = [
  "sertraline", "escitalopram", "citalopram", "fluoxetine", "paroxetine", "fluvoxamine", "venlafaxine",
  "desvenlafaxine", "duloxetine", "bupropion", "mirtazapine", "trazodone", "vortioxetine", "vilazodone",
  "amitriptyline", "nortriptyline", "imipramine", "clomipramine", "doxepin", "quetiapine", "aripiprazole",
  "brexpiprazole", "cariprazine", "risperidone", "paliperidone", "olanzapine", "ziprasidone", "lurasidone",
  "haloperidol", "clozapine", "lithium", "buspirone", "alprazolam", "lorazepam", "clonazepam", "chlordiazepoxide",
  "methylphenidate", "amphetamine", "lisdexamfetamine", "atomoxetine", "guanfacine er",
];
const SUBSTANCE_USE_DRUGS = ["buprenorphine", "methadone", "naltrexone", "disulfiram", "acamprosate", "varenicline"];
const HIV_DRUGS = [
  "emtricitabine", "tenofovir", "bictegravir", "dolutegravir", "raltegravir", "cabotegravir", "rilpivirine",
  "efavirenz", "darunavir", "atazanavir", "ritonavir", "cobicistat", "abacavir", "lamivudine", "zidovudine",
  "elvitegravir", "doravirine", "lenacapavir",
];

function drugSensitivity(ingredient: string | undefined, restricted: boolean): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  if (restricted) s.add("mental-health");
  const g = ingredient ?? "";
  if (SUBSTANCE_USE_DRUGS.some((d) => g.includes(d))) s.add("substance-use");
  else if (MENTAL_HEALTH_DRUGS.some((d) => g.includes(d))) s.add("mental-health");
  if (HIV_DRUGS.some((d) => g.includes(d))) s.add("hiv-sti");
  return s.size ? Array.from(s) : undefined;
}

// ---------------------------------------------------------------------------
// Medications

type MedDose = NonNullable<MedicationRow["dose"]>;

function normDoseUnit(u: string): MedDose["unit"] | undefined {
  const x = u.trim().toLowerCase().replace(/\.$/, "");
  if (["mg", "milligram", "milligrams"].includes(x)) return "mg";
  if (["mcg", "µg", "ug", "microgram", "micrograms"].includes(x)) return "mcg";
  if (["u", "iu", "unit", "units", "unt"].includes(x)) return "units";
  if (["ml", "cc", "milliliter", "milliliters"].includes(x)) return "mL";
  if (["tab", "tabs", "tablet", "tablets"].includes(x)) return "tablet";
  return undefined;
}

function medDose(e: any): MedDose | undefined {
  const d = e?.dose;
  const v = num(d?.value);
  const unitText = str(d?.unit);
  if (v === undefined || !unitText || v <= 0) return undefined;
  const unit = normDoseUnit(unitText);
  if (!unit) return undefined;
  if (unit !== "tablet") return { value: v, unit };
  // Tablets: report mass when the order names a single strength.
  const name = str(e?.drug?.name) ?? "";
  if (/\s\/\s/.test(name)) return { value: v, unit: "tablet" };
  const strengths = Array.from(name.matchAll(/(\d+(?:\.\d+)?)\s*(MG|MCG)\b(?!\s*\/)/gi));
  if (strengths.length === 1) {
    const s = parseFloat(strengths[0][1]);
    const su: MedDose["unit"] = strengths[0][2].toLowerCase() === "mcg" ? "mcg" : "mg";
    if (isFinite(s)) return { value: round(s * v, 4), unit: su };
  }
  return { value: v, unit: "tablet" };
}

function medFrequency(e: any): MedicationRow["frequency"] {
  switch (e?.frequency) {
    case "QD": case "BID": case "TID": case "QHS": case "PRN": return e.frequency;
    case "OTHER": {
      const sig = (str(e.sig) ?? "").toLowerCase();
      if (/\bas needed\b|\bprn\b/.test(sig)) return "PRN";
      if (/\b(once )?(a |per |every )?week(ly)?\b/.test(sig) && !/\btwice\b|\bevery other\b|\b\d+ times\b/.test(sig)) return "QW";
      return "other";
    }
    default: return undefined;
  }
}

function buildMedications(items: FolioItem[]): MedicationRow[] {
  const byLine = new Map<string, Ent[]>();
  for (const x of entries(items, "med_event")) {
    const id = str(x.e.med_id);
    if (!id || !x.e.drug || !str(x.e.drug.name)) continue;
    const list = byLine.get(id) ?? [];
    list.push(x);
    byLine.set(id, list);
  }

  interface Cand { row: MedicationRow; last: Ent; key: string }
  const cands: Cand[] = [];
  for (const [, list] of byLine) {
    list.sort(cmpEvents);
    let status: MedicationRow["status"] | undefined;
    let since: Ent | undefined;
    for (const x of list) {
      const a = x.e.action;
      const next: MedicationRow["status"] | undefined =
        a === "start" || a === "resume" || a === "change" ? "active" : a === "hold" ? "held" : a === "stop" ? "stopped" : undefined;
      if (!next) continue;
      if (next !== status || a === "start" || a === "resume") {
        if (!(next === "active" && status === "active" && a === "change")) since = x;
        status = next;
      }
    }
    const known = list.filter((x) => ["start", "change", "hold", "resume", "stop"].includes(x.e.action));
    if (!status || !known.length) continue;
    const last = known[known.length - 1];
    const e = last.e;
    const name = str(e.drug.name)!;
    const ingredient = ingredientOf(name);
    const restricted = list.some((x) => x.e.restricted === "BH");
    const row: MedicationRow = {
      ...(ingredient ? { ingredient } : {}),
      drug_name: name,
      status,
      patient_reported: false,
      evidence: list.map(ev),
    };
    const sinceDate = since ? localDate(since.item.effective) : undefined;
    if (sinceDate) row.status_since = sinceDate;
    const dose = medDose(e);
    if (dose) row.dose = dose;
    const freq = medFrequency(e);
    if (freq) row.frequency = freq;
    if (status === "stopped") {
      const sr = e.stop_reason;
      if (["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(sr)) row.stop_reason = sr;
    }
    const reasonText = str(since?.e.reason_text);
    if (reasonText) row.status_reason_text = reasonText;
    const sens = drugSensitivity(ingredient, restricted);
    if (sens) row.sensitivity = sens;
    cands.push({ row, last, key: ingredient ?? name.toLowerCase() });
  }

  // One row per ingredient: the line whose own latest event is latest.
  const best = new Map<string, Cand>();
  for (const c of cands) {
    const cur = best.get(c.key);
    if (!cur || cmpEvents(cur.last, c.last) < 0) best.set(c.key, c);
  }
  return Array.from(best.values()).map((c) => c.row);
}

// ---------------------------------------------------------------------------
// Problems

function problemSensitivity(code: string, restricted: boolean): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  const c = code.toUpperCase();
  if (/^F1\d/.test(c)) s.add("substance-use");
  else if (/^F\d/.test(c)) s.add("mental-health");
  if (restricted && !s.has("substance-use")) s.add("mental-health");
  if (/^(B20|Z21|A5[0-9]|A6[0-4]|B97\.35|Z20\.6|Z11\.4)/.test(c)) s.add("hiv-sti");
  if (/^(O\d|Z3[0-9]|Z79\.3|N97)/.test(c)) s.add("sexual-reproductive-health");
  return s.size ? Array.from(s) : undefined;
}

function isCkd(code: string, desc: string): boolean {
  return /^(N18|I12|I13|E1[0-3]\.2[29])/i.test(code) || /chronic kidney disease|\bckd\b/i.test(desc);
}

function ckdStage(code: string, desc: string): ProblemRow["ckd_stage"] {
  const d = desc.toLowerCase();
  const g = /\bg(1|2|3a|3b|4|5)\b/.exec(d);
  if (g) return ("G" + g[1]) as ProblemRow["ckd_stage"];
  const st = /stage\s*(1|2|3a|3b|4|5|i{1,3}v?|iv|v)\b/.exec(d) ?? /\bckd\s*(1|2|3a|3b|4|5)\b/.exec(d);
  if (st) {
    const roman: Record<string, string> = { i: "1", ii: "2", iii: "3", iv: "4", v: "5" };
    const v = roman[st[1]] ?? st[1];
    if (["1", "2", "3a", "3b", "4", "5"].includes(v)) return ("G" + v) as ProblemRow["ckd_stage"];
  }
  if (/end[- ]stage renal|end[- ]stage kidney|\besrd\b|\beskd\b/.test(d)) return "G5";
  const c = code.toUpperCase();
  const map: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  return map[c];
}

function albuminuria(desc: string): ProblemRow["albuminuria"] {
  const d = desc.toLowerCase();
  const a = /\ba([123])\b/.exec(d);
  if (a) return ("A" + a[1]) as ProblemRow["albuminuria"];
  if (/severely increased albumin|macroalbumin|severe albuminuria/.test(d)) return "A3";
  if (/moderately increased albumin|microalbumin|moderate albuminuria/.test(d)) return "A2";
  if (/normal to mildly increased albumin/.test(d)) return "A1";
  return undefined;
}

/** ICD-10-CM codes naming only an adverse effect of a drug (T36–T50 with 5th/6th character 5). */
function isAdverseEffectCode(code: string): boolean {
  return /^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/i.test(code);
}

const DRUG_CLASS_RE = /(inhibitors?|blockers?|antagonists?|agonists?|statins?|penicillins?|cephalosporins?|sulfonamides?|antibiotics?|diuretics?|nsaids?|opioids?|opiates?|agents?|analogues?|mycins?|quinolones?|glitazones?|gliptins?|gliflozins?)$/i;

/** A drug or drug class named in a problem description as its cause. */
function drugCause(desc: string): string | undefined {
  const pats = [
    /\b(?:due to|caused by|induced by|associated with|secondary to|from|adverse effect of|reaction to|related to)\s+(?:the\s+)?([a-z0-9][a-z0-9 \-/]*?)(?:\s*(?:\(|,|;|$| therapy| use| treatment| exposure))/i,
    /\b([a-z][a-z0-9\-]*?)[- ](?:induced|associated|related)\b/i,
  ];
  for (const re of pats) {
    const m = re.exec(desc);
    if (!m) continue;
    const phrase = m[1].trim();
    if (!phrase) continue;
    const ing = ingredientOf(phrase);
    if (ing && isKnownDrug(ing)) return ing;
    if (DRUG_CLASS_RE.test(phrase) && !/\b(infection|disease)\b/i.test(phrase)) return phrase;
    if (/\b(drug|medication|medicine)\b/i.test(phrase)) continue;
  }
  return undefined;
}

function isKnownDrug(g: string): boolean {
  const all = new Set<string>(Object.values(BRANDS));
  for (const d of [...MENTAL_HEALTH_DRUGS, ...SUBSTANCE_USE_DRUGS, ...HIV_DRUGS]) all.add(d);
  for (const d of ["lisinopril", "enalapril", "ramipril", "benazepril", "metformin", "amoxicillin", "penicillin",
    "cephalexin", "sulfamethoxazole", "trimethoprim", "isoniazid", "valproate", "valproic acid", "allopurinol",
    "carbamazepine", "phenytoin", "nitrofurantoin", "doxycycline", "clindamycin", "erythromycin", "codeine",
    "morphine", "oxycodone", "hydrocodone", "tramadol", "aspirin", "heparin", "contrast", "iodinated contrast"]) all.add(d);
  return all.has(g) || g.split(" / ").every((p) => all.has(p));
}

interface ProblemOut { problems: ProblemRow[]; drugAllergies: AllergyIntoleranceRow[] }

function classifyReaction(text: string): AllergyIntoleranceRow["reaction_type"] | undefined {
  const t = text.toLowerCase();
  if (/hives|urticaria|rash|angioedema|swelling|anaphyla|bronchospasm|wheez|itch|pruritus|stevens|sjs|toxic epidermal|dress\b|hypersensitivity|throat tightness|flushing/.test(t))
    return "hypersensitivity";
  if (/ketoacidosis|\bdka\b|pancreatitis|liver|hepat|kidney injury|\baki\b|renal failure|rhabdo|lactic acidosis|agranulocytosis|neutropenia|thrombocytopenia|bleed|hemorrhage|hyperkalemia|hyponatremia|seizure|arrhythmia|qt prolong|torsade|syncope|hypoglycemi|myopathy|necrosis|aplastic|serotonin syndrome|neuroleptic/.test(t))
    return "serious_adverse_event";
  return undefined;
}

function buildProblems(items: FolioItem[]): ProblemOut {
  const byLine = new Map<string, Ent[]>();
  for (const x of entries(items, "problem_event")) {
    const id = str(x.e.problem_id);
    if (!id) continue;
    const list = byLine.get(id) ?? [];
    list.push(x);
    byLine.set(id, list);
  }
  interface Cand { row: ProblemRow; last: Ent; key: string; adverseOnly: boolean; cause?: string; list: Ent[]; code: string; desc: string }
  const cands: Cand[] = [];
  for (const [, list] of byLine) {
    list.sort(cmpEvents);
    let status: "active" | "resolved" | "removed" | undefined;
    let last: Ent | undefined;
    for (const x of list) {
      const a = x.e.action;
      if (a === "add") status = "active";
      else if (a === "update") status = status === "resolved" ? "resolved" : "active";
      else if (a === "resolve") status = "resolved";
      else if (a === "remove") status = "removed";
      else continue;
      last = x;
    }
    if (!status || status === "removed" || !last) continue;
    // Latest wording: the latest event carrying a description (every event restates it).
    const worded = [...list].reverse().find((x) => str(x.e.description)) ?? last;
    const desc = str(worded.e.description) ?? "";
    const code = str(worded.e.icd10cm) ?? "";
    if (!desc && !code) continue;
    const row: ProblemRow = { condition: desc || code, status, evidence: list.map(ev) };
    if (code) row.icd10cm = code;
    const snomed = str(worded.e.snomed);
    if (snomed) row.snomed = snomed;
    const onsetSrc = [...list].reverse().find((x) => x.e.onset && typeof x.e.onset === "object");
    const onset = fuzzy(onsetSrc?.e.onset);
    if (onset) row.onset = onset;
    if (isCkd(code, desc)) {
      const st = ckdStage(code, desc);
      if (st) row.ckd_stage = st;
      const al = albuminuria(desc);
      if (al) row.albuminuria = al;
    }
    const sens = problemSensitivity(code, list.some((x) => x.e.restricted === "BH"));
    if (sens) row.sensitivity = sens;
    const c3 = code.toUpperCase().slice(0, 3);
    const key = /^(N18|E1[013])$/.test(c3) ? c3 : code ? code.toUpperCase() : "d:" + desc.toLowerCase();
    cands.push({ row, last, key, adverseOnly: isAdverseEffectCode(code), cause: drugCause(desc), list, code, desc });
  }

  // One row per condition: same code (or CKD / diabetes type category) or same wording merges; latest wins.
  const best = new Map<string, Cand>();
  const descKey = new Map<string, string>();
  for (const c of [...cands].sort((a, b) => cmpEvents(a.last, b.last))) {
    const dk = c.row.condition.toLowerCase();
    const key = best.has(c.key) ? c.key : descKey.get(dk) ?? c.key;
    const prev = best.get(key);
    if (prev) c.row.evidence = [...prev.row.evidence, ...c.row.evidence];
    best.set(key, c);
    descKey.set(dk, key);
  }

  const problems: ProblemRow[] = [];
  const drugAllergies: AllergyIntoleranceRow[] = [];
  for (const c of best.values()) {
    let substance = c.cause;
    if (c.adverseOnly && !substance) {
      // "Adverse effect of <drug/class>" wording, else the description as written.
      const m = /adverse (?:effect|reaction) (?:of|to)\s+(.+?)(?:,|\(|;|$)/i.exec(c.desc);
      if (m) {
        const ing = ingredientOf(m[1]);
        substance = ing && isKnownDrug(ing) ? ing : m[1].trim();
      }
    }
    if (!c.adverseOnly) problems.push(c.row);
    if (substance) {
      const rt = classifyReaction(c.desc) ?? "side_effect";
      const a: AllergyIntoleranceRow = {
        substance,
        reaction_type: rt,
        mechanism: "unknown",
        criticality: "unknown",
        evidence: c.row.evidence,
      };
      if (!c.adverseOnly) a.reaction = c.row.condition;
      if (c.row.onset) a.onset = c.row.onset;
      if (c.row.sensitivity) a.sensitivity = c.row.sensitivity;
      drugAllergies.push(a);
    }
  }
  return { problems, drugAllergies };
}

// ---------------------------------------------------------------------------
// Allergies

function buildAllergies(items: FolioItem[], fromProblems: AllergyIntoleranceRow[]): AllergyIntoleranceRow[] {
  const byLine = new Map<string, Ent[]>();
  for (const x of entries(items, "allergy_event")) {
    const id = str(x.e.allergy_id);
    if (!id) continue;
    const list = byLine.get(id) ?? [];
    list.push(x);
    byLine.set(id, list);
  }
  const rows: AllergyIntoleranceRow[] = [];
  for (const [, list] of byLine) {
    list.sort(cmpEvents);
    const known = list.filter((x) => ["add", "update", "inactivate"].includes(x.e.action));
    if (!known.length) continue;
    const last = known[known.length - 1];
    if (last.e.action === "inactivate") continue;
    const e = last.e;
    const sname = str(e.substance?.name);
    if (!sname) continue;
    const rxn = str(e.substance?.rxnorm);
    let substance = sname;
    if (rxn) substance = ingredientOf(sname) ?? sname.toLowerCase();
    else {
      const ing = ingredientOf(sname);
      if (ing && isKnownDrug(ing)) substance = ing;
    }
    const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.filter((r: unknown): r is string => typeof r === "string" && !!r.trim()).map((r: string) => r.trim()) : [];
    const reactionText = reactions.join("; ");
    const srcType = e.reaction_type;
    const byReaction = classifyReaction(reactionText);
    const reaction_type: AllergyIntoleranceRow["reaction_type"] =
      byReaction ?? (srcType === "intolerance" ? "side_effect" : srcType === "adverse_reaction" ? "serious_adverse_event" : srcType === "allergy" ? "hypersensitivity" : "side_effect");
    const mechanism: AllergyIntoleranceRow["mechanism"] =
      (srcType === "intolerance" || srcType === "adverse_reaction") && reaction_type !== "hypersensitivity" ? "non_immune" : "unknown";
    const criticality: AllergyIntoleranceRow["criticality"] = e.severity === "low" || e.severity === "high" ? e.severity : "unknown";
    const row: AllergyIntoleranceRow = { substance, reaction_type, mechanism, criticality, evidence: list.map(ev) };
    if (rxn) row.rxnorm_ingredient = rxn;
    if (reactionText) row.reaction = reactionText;
    const onsetSrc = [...list].reverse().find((x) => x.e.onset && typeof x.e.onset === "object");
    const onset = fuzzy(onsetSrc?.e.onset);
    if (onset) row.onset = onset;
    rows.push(row);
  }
  // Drug-attributed diagnoses: add only substances not already on the allergy list.
  for (const a of fromProblems) {
    const dup = rows.find((r) => r.substance.toLowerCase() === a.substance.toLowerCase());
    if (dup) {
      for (const x of a.evidence) if (!dup.evidence.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id)) dup.evidence.push(x);
    } else rows.push(a);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Labs

const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "2823-3": "potassium", "6298-4": "potassium",
  "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2069-3": "chloride", "1963-8": "bicarbonate",
  "2028-9": "bicarbonate", "33037-3": "anion_gap", "1863-0": "anion_gap", "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "17856-6": "a1c", "9318-7": "uacr", "14959-1": "uacr",
  "32294-1": "uacr", "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin", "53060-9": "bhb", "2744-1": "ph", "2019-8": "pco2", "3040-3": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "2093-3": "cholesterol",
  "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
  "48642-3": "egfr", "48643-1": "egfr", "62238-1": "egfr", "98979-8": "egfr", "33914-3": "egfr", "50044-7": "egfr",
  "88293-6": "egfr", "88294-4": "egfr", "69405-9": "egfr",
};

function analyteOf(test: any): Analyte | undefined {
  const loinc = str(test?.loinc);
  if (loinc && LOINC_ANALYTE[loinc]) return LOINC_ANALYTE[loinc];
  const code = (str(test?.nfm_code) ?? "").toUpperCase();
  const name = (str(test?.name) ?? "").toLowerCase();
  const t = `${name} ${code.toLowerCase()}`;
  if (/albumin.*creat|microalb.*creat|\buacr\b|\bacr\b|alb\/creat/.test(t)) return "uacr";
  if (/\begfr|glomerular filtration/.test(t)) return "egfr";
  const urine = /\burine\b|\bur\b|\bua\b|urinary|24 ?h/.test(name);
  if (urine) return undefined;
  if (/\ba1c\b|hba1c|glycated|glycohemoglobin|hemoglobin a1c/.test(t)) return "a1c";
  if (/creatinine/.test(name) && !/clearance|kinase/.test(name)) return "creatinine";
  if (/hydroxybutyrate|\bbhb\b|beta-?hb/.test(t)) return "bhb";
  if (/pco2|partial pressure.*co2|\bpaco2|\bpvco2/.test(t)) return "pco2";
  if (/^ph\b|\bph,|\bph \(|blood ph|\bph$/.test(name) || code === "PH") return "ph";
  if (/anion gap/.test(t) || code === "AGAP" || code === "AG") return "anion_gap";
  if (/potassium/.test(name) || code === "K") return "potassium";
  if (/sodium/.test(name) || code === "NA") return "sodium";
  if (/chloride/.test(name) || code === "CL") return "chloride";
  if (/bicarbonate|total co2|co2, total|carbon dioxide|\bhco3/.test(name) || code === "CO2" || code === "HCO3") return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(t)) return "bun";
  if (/glucose/.test(name) || code === "GLU") return "glucose";
  if (/platelet|\bplt\b/.test(t)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(t)) return "wbc";
  if (/hemoglobin|\bhgb\b|\bhb\b/.test(t)) return "hemoglobin";
  if (/lipase/.test(t)) return "lipase";
  if (/troponin/.test(t) && !/troponin t\b/.test(t)) return "troponin";
  if (/\bhdl\b|high density/.test(t)) return "hdl";
  if (/\bldl\b|low density/.test(t)) return "ldl";
  if (/triglycer/.test(t)) return "triglycerides";
  if (/cholesterol/.test(t) && !/non-?hdl|vldl|ratio/.test(t)) return "cholesterol";
  return undefined;
}

function unitKey(u: string): string {
  return u.toLowerCase().replace(/\s+/g, "").replace(/µ/g, "u").replace(/μ/g, "u");
}

/** Factor to convert a value in `unit` into the analyte's fixed unit; undefined if unknown. */
function unitFactor(an: Analyte, unit: string): number | undefined {
  const u = unitKey(unit);
  const target = unitKey(UNITS[an]);
  if (u === target) return 1;
  switch (an) {
    case "egfr":
      return /^ml\/min(\/1\.73m2|\/\{1\.73_m2\}|\/1\.73m\^2|\/1\.73sqm|per1\.73m2)?$/.test(u) ? 1 : undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      return u === "meq/l" || u === "mmol/l" ? 1 : undefined;
    case "bhb":
      return u === "mmol/l" ? 1 : undefined;
    case "creatinine":
      return u === "umol/l" ? 1 / 88.42 : undefined;
    case "glucose":
      return u === "mmol/l" ? 18.016 : undefined;
    case "bun":
      return u === "mmol/l" ? 2.8 : undefined;
    case "a1c":
      return u === "%" || u === "%hba1c" ? 1 : undefined;
    case "uacr":
      return u === "mg/g" || u === "mg/gcreat" || u === "ug/mg" || u === "mcg/mg" || u === "ug/mgcreat" ? 1 : u === "mg/mmol" ? 8.84 : undefined;
    case "platelets": case "wbc":
      if (["cells/ul", "/ul", "/mm3", "cells/mm3"].includes(u)) return 1 / 1000;
      if (["k/ul", "10*3/ul", "x10e3/ul", "10^3/ul", "thou/ul", "10e3/ul", "x10^3/ul", "10*9/l", "x10e9/l", "10^9/l"].includes(u)) return 1;
      return undefined;
    case "hemoglobin":
      return u === "g/dl" ? 1 : u === "g/l" ? 0.1 : undefined;
    case "ph":
      return u === "" || u === "ph" || u === "[ph]" ? 1 : undefined;
    case "pco2":
      return u === "mmhg" || u === "mm hg" ? 1 : u === "kpa" ? 7.50062 : undefined;
    case "lipase":
      return u === "u/l" || u === "iu/l" ? 1 : undefined;
    case "troponin":
      return u === "ng/ml" ? 1 : u === "ng/l" || u === "pg/ml" ? 0.001 : undefined;
    case "cholesterol": case "hdl": case "ldl":
      return u === "mmol/l" ? 38.67 : undefined;
    case "triglycerides":
      return u === "mmol/l" ? 88.57 : undefined;
  }
  return undefined;
}

function egfrEquation(e: any): LabResultRow["egfr_equation"] {
  const t = `${str(e.test?.name) ?? ""} ${str(e.comment) ?? ""} ${str(e.test?.nfm_code) ?? ""}`.toLowerCase();
  const rc = (str(e.external_ref?.result_code) ?? "").toUpperCase();
  if (/ckd-?epi[^.]*2021|2021[^.]*ckd-?epi|race[- ]free/.test(t)) return "ckd-epi-2021";
  if (/ckd-?epi[^.]*2009|2009[^.]*ckd-?epi/.test(t)) return "ckd-epi-2009";
  if (/\bmdrd\b/.test(t)) return "mdrd";
  if (/EGFR09/.test(rc)) return "ckd-epi-2009";
  if (/EGFR21/.test(rc)) return "ckd-epi-2021";
  return "unknown";
}

function isRaceVariantAA(e: any): boolean {
  const name = (str(e.test?.name) ?? "").toLowerCase();
  const code = (str(e.test?.nfm_code) ?? "").toUpperCase();
  const rc = (str(e.external_ref?.result_code) ?? "").toUpperCase();
  if (/non[- ]?african|non[- ]?black|\bnaa\b/.test(name) || /NAA$|-NB$/.test(code)) return false;
  return /african american|\bblack\b/.test(name) || /-AA$/.test(code) || /EGFR09A$/.test(rc) || e.test?.loinc === "48643-1";
}

function parseValue(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof v === "number" && isFinite(v)) return { value: v };
  if (typeof v !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(v.replace(/,(?=\d{3}\b)/g, ""));
  if (!m) return undefined;
  const value = parseFloat(m[2]);
  if (!isFinite(value)) return undefined;
  const cmp = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as LabResultRow["comparator"] | undefined);
  return cmp ? { value, comparator: cmp } : { value };
}

function buildLabs(items: FolioItem[]): LabResultRow[] {
  const all = entries(items, "imported_result");
  // Group copies of one result: same accession + Lakeview result code (or Northgate code).
  const groups = new Map<string, Ent[]>();
  for (const x of all) {
    const acc = str(x.e.external_ref?.accession);
    const comp = str(x.e.external_ref?.result_code) ?? str(x.e.test?.nfm_code) ?? x.key;
    const k = acc ? `${acc}|${comp}` : `${x.item.id}|${x.key}`;
    const g = groups.get(k) ?? [];
    g.push(x);
    groups.set(k, g);
  }
  const rank = (s: unknown): number => (s === "C" ? 3 : s === "F" ? 2 : s === "P" ? 1 : 0);
  const rows: LabResultRow[] = [];
  const rowAccession = new Map<LabResultRow, { acc: string; ent: Ent }>();
  for (const [, copies] of groups) {
    copies.sort((a, b) => rank(b.e.result_status) - rank(a.e.result_status) || instant(b.item.recorded) - instant(a.item.recorded) || cmpEvents(b, a));
    const win = copies[0];
    const e = win.e;
    if (rank(e.result_status) === 0) continue;
    const an = analyteOf(e.test);
    if (!an) continue;
    const pv = parseValue(e.value);
    if (!pv) continue; // withdrawn / invalidated / non-numeric
    if (/result invalidated|invalidated|not performed|cancelled|canceled/i.test(String(e.value))) continue;
    const factor = unitFactor(an, typeof e.unit === "string" ? e.unit : "");
    if (factor === undefined) continue;
    const collected = toRfc3339Local(e.collected) ?? toRfc3339Local(win.item.effective);
    if (!collected) continue;
    let value = pv.value * factor;
    if (factor !== 1) value = round(value, an === "platelets" || an === "wbc" ? 3 : an === "creatinine" || an === "troponin" ? 3 : 1);
    const row: LabResultRow = {
      analyte: an,
      value,
      unit: UNITS[an],
      collected,
      status: e.result_status === "P" ? "preliminary" : "final",
      evidence: copies.map(ev),
    };
    if (pv.comparator) row.comparator = pv.comparator;
    if (an === "egfr") row.egfr_equation = egfrEquation(e);
    const loinc = str(e.test?.loinc);
    if (loinc) row.loinc = loinc;
    rows.push(row);
    rowAccession.set(row, { acc: str(e.external_ref?.accession) ?? win.item.id, ent: win });
  }
  // eGFR: drop the race-coefficient variant when the race-free variant of the same specimen is reported.
  return rows.filter((r) => {
    if (r.analyte !== "egfr") return true;
    const me = rowAccession.get(r)!;
    if (!isRaceVariantAA(me.ent.e)) return true;
    return !rows.some((o) => o !== r && o.analyte === "egfr" && rowAccession.get(o)!.acc === me.acc &&
      !isRaceVariantAA(rowAccession.get(o)!.ent.e) && o.egfr_equation === r.egfr_equation);
  });
}

// ---------------------------------------------------------------------------
// Vitals

function parseBp(v: unknown): [number, number] | undefined {
  if (typeof v !== "string") return undefined;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(v);
  if (!m) return undefined;
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

function buildVitals(items: FolioItem[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const x of entries(items, "vital_set")) {
    const e = x.e;
    const local_time = localMinute(x.item.effective) ?? localMinute(x.item.recorded);
    if (!local_time) continue;
    const row: VitalRow = { setting: "clinic", local_time, evidence: [ev(x)] };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const rep = parseBp(e.bp_repeat);
    if (rep) {
      if (bp) { row.repeat_systolic_mmhg = rep[0]; row.repeat_diastolic_mmhg = rep[1]; }
      else { row.systolic_mmhg = rep[0]; row.diastolic_mmhg = rep[1]; }
    }
    const pulse = num(e.pulse_bpm);
    if (pulse !== undefined) row.pulse_bpm = pulse;
    const wt = num(e.weight_lb);
    if (wt !== undefined && wt > 0) row.weight_kg = round(wt * 0.45359237, 1);
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    rows.push(row);
  }
  rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return rows;
}

// ---------------------------------------------------------------------------

function safe<T>(f: () => T[]): T[] {
  try { return f(); } catch { return []; }
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const list = Array.isArray(items) ? items : [];
  let counted: FolioItem[] = [];
  try { counted = countingItems(list, asOf); } catch { counted = []; }
  let probs: ProblemOut = { problems: [], drugAllergies: [] };
  try { probs = buildProblems(counted); } catch { /* skip */ }
  return {
    medications: safe(() => buildMedications(counted)),
    problems: probs.problems,
    allergies: safe(() => buildAllergies(counted, probs.drugAllergies)),
    labs: safe(() => buildLabs(counted)),
    vitals: safe(() => buildVitals(counted)),
  };
}
