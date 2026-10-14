// Mapper: Riverside Regional Hospital signed clinical documents (riverside-doc-v1) -> consumer views.
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

// ---------------------------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------------------------

function isObj(v: unknown): v is Record<string, any> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}
function num(v: unknown): number | undefined {
  return typeof v === "number" && isFinite(v) ? v : undefined;
}
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// ---------------------------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------------------------

let dtf: Intl.DateTimeFormat | undefined;
function fmt(): Intl.DateTimeFormat {
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
  return dtf;
}

interface Wall { y: number; mo: number; d: number; h: number; mi: number; s: number }

function wallAt(ms: number): Wall {
  const p: Record<string, number> = {};
  for (const part of fmt().formatToParts(new Date(ms))) {
    if (part.type !== "literal") p[part.type] = parseInt(part.value, 10);
  }
  return { y: p.year, mo: p.month, d: p.day, h: p.hour === 24 ? 0 : p.hour, mi: p.minute, s: p.second };
}
function offsetMinAt(ms: number): number {
  const w = wallAt(ms);
  const asUtc = Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, w.s);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}
function p2(n: number): string {
  return String(n).padStart(2, "0");
}
function wallDate(w: Wall): string {
  return `${w.y}-${p2(w.mo)}-${p2(w.d)}`;
}
function wallHM(w: Wall): string {
  return `${wallDate(w)}T${p2(w.h)}:${p2(w.mi)}`;
}
function offStr(min: number): string {
  const sign = min < 0 ? "-" : "+";
  const a = Math.abs(min);
  return `${sign}${p2(Math.floor(a / 60))}:${p2(a % 60)}`;
}

const RE_ZONED = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i;
const RE_NAIVE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/;
const RE_DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

interface LocalTime {
  /** epoch ms (for ordering) */
  ms: number;
  date: string;
  hm: string;
  rfc: string;
}

/** Converts a source date-time to local (America/Chicago) wall-clock information. */
function toLocal(s: unknown): LocalTime | undefined {
  const v = str(s);
  if (!v) return undefined;
  const t = v.trim();
  if (RE_ZONED.test(t)) {
    const ms = Date.parse(t);
    if (isNaN(ms)) return undefined;
    const w = wallAt(ms);
    return { ms, date: wallDate(w), hm: wallHM(w), rfc: `${wallHM(w)}:${p2(w.s)}${offStr(offsetMinAt(ms))}` };
  }
  const m = RE_NAIVE.exec(t);
  if (m) {
    const [y, mo, d, h, mi] = [m[1], m[2], m[3], m[4], m[5]].map((x) => parseInt(x, 10));
    const sec = m[6] ? parseInt(m[6], 10) : 0;
    const wallUtc = Date.UTC(y, mo - 1, d, h, mi, sec);
    let off = offsetMinAt(wallUtc + 6 * 3600000);
    let ms = wallUtc - off * 60000;
    off = offsetMinAt(ms);
    ms = wallUtc - off * 60000;
    const date = `${m[1]}-${m[2]}-${m[3]}`;
    const hm = `${date}T${m[4]}:${m[5]}`;
    return { ms, date, hm, rfc: `${hm}:${p2(sec)}${offStr(off)}` };
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const ms = Date.UTC(+t.slice(0, 4), +t.slice(5, 7) - 1, +t.slice(8, 10), 12);
    if (isNaN(ms)) return undefined;
    return { ms, date: t, hm: `${t}T00:00`, rfc: `${t}T00:00:00${offStr(offsetMinAt(ms))}` };
  }
  return undefined;
}

// ---------------------------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------------------------

interface Doc {
  item: FolioItem;
  id: string;
  recMs: number;
  effMs: number;
  kind: string;
  encId: string;
  encStartMs: number;
  /** local date the document's decisions are dated to */
  decisionDate?: string;
  entries: [string, Record<string, any>][];
}

function selectCounting(items: FolioItem[], asOf: string): FolioItem[] {
  const counting: FolioItem[] = [];
  for (const it of items) {
    if (!isObj(it) || !str(it.id)) continue;
    const rec = toLocal(it.recorded);
    if (!rec) continue;
    if (rec.date > asOf) continue;
    counting.push(it);
  }
  // Retracted items never existed: drop them first, along with their own supersessions.
  const retracted = new Set<string>();
  for (const it of counting) {
    if (Array.isArray(it.retracts)) for (const r of it.retracts) if (typeof r === "string" && r !== it.id) retracted.add(r);
  }
  const live = counting.filter((it) => !retracted.has(it.id));
  const liveById = new Map<string, FolioItem>();
  for (const it of live) liveById.set(it.id, it);
  // Superseded (transitively) by a live item: a replaced item's own replacements still hold.
  const removed = new Set<string>(retracted);
  const stack: string[] = [];
  for (const it of live) {
    if (Array.isArray(it.supersedes)) for (const r of it.supersedes) if (typeof r === "string" && r !== it.id) stack.push(r);
  }
  while (stack.length) {
    const id = stack.pop()!;
    if (removed.has(id)) continue;
    removed.add(id);
    const it = liveById.get(id);
    if (it && Array.isArray(it.supersedes)) {
      for (const r of it.supersedes) if (typeof r === "string") stack.push(r);
    }
  }
  return counting.filter((it) => !removed.has(it.id));
}

function buildDoc(it: FolioItem): Doc | undefined {
  const payload = isObj(it.payload) ? it.payload : undefined;
  if (!payload) return undefined;
  const entries: [string, Record<string, any>][] = [];
  let enc: Record<string, any> | undefined;
  for (const k of Object.keys(payload)) {
    const e = payload[k];
    if (!isObj(e) || typeof e.type !== "string") continue;
    entries.push([k, e]);
    if (e.type === "encounter" && !enc) enc = e;
  }
  const rec = toLocal(it.recorded);
  const eff = toLocal(it.effective);
  const recMs = rec ? rec.ms : 0;
  const kind = (enc && str(enc.document_kind)) || "";
  const encStart =
    toLocal(enc?.arrived) ?? toLocal(enc?.admitted) ?? eff ?? rec;
  let decision: LocalTime | undefined;
  if (kind === "discharge_summary") decision = toLocal(enc?.discharged) ?? toLocal(it.effective_end) ?? rec;
  else decision = eff ?? rec;
  return {
    item: it,
    id: it.id,
    recMs,
    effMs: eff ? eff.ms : recMs,
    kind,
    encId: (enc && str(enc.encounter_id)) || `item:${it.id}`,
    encStartMs: encStart ? encStart.ms : recMs,
    decisionDate: decision?.date,
    entries,
  };
}

function cmpDoc(a: Doc, b: Doc): number {
  return a.recMs - b.recMs || a.effMs - b.effMs || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

// ---------------------------------------------------------------------------------------------
// Drug names
// ---------------------------------------------------------------------------------------------

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", lasix: "furosemide", cozaar: "losartan", diovan: "valsartan", zestril: "lisinopril",
  prinivil: "lisinopril", norvasc: "amlodipine", lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", levemir: "insulin detemir",
  tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart", ozempic: "semaglutide",
  wegovy: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide", januvia: "sitagliptin",
  synthroid: "levothyroxine", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", plavix: "clopidogrel",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", keflex: "cephalexin", zoloft: "sertraline",
  lexapro: "escitalopram", prozac: "fluoxetine", seroquel: "quetiapine", abilify: "aripiprazole", lithobid: "lithium",
  suboxone: "buprenorphine", subutex: "buprenorphine", motrin: "ibuprofen", advil: "ibuprofen", aleve: "naproxen",
  tylenol: "acetaminophen", prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", pepcid: "famotidine",
  zyrtec: "cetirizine", claritin: "loratadine", flomax: "tamsulosin", toprol: "metoprolol", lopressor: "metoprolol",
  coreg: "carvedilol", aldactone: "spironolactone", microzide: "hydrochlorothiazide", neurontin: "gabapentin",
  lyrica: "pregabalin", amoxil: "amoxicillin", augmentin: "amoxicillin / clavulanate", bactrim: "sulfamethoxazole / trimethoprim",
  zithromax: "azithromycin", cipro: "ciprofloxacin", levaquin: "levofloxacin", truvada: "emtricitabine / tenofovir",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide",
};

const SALTS = new Set([
  "hydrochloride", "hcl", "succinate", "tartrate", "besylate", "maleate", "mesylate", "fumarate", "citrate", "sulfate",
  "acetate", "phosphate", "bromide", "sodium", "potassium", "calcium", "magnesium", "monohydrate", "dihydrate",
  "trihydrate", "hyclate", "propionate", "furoate", "dipropionate", "valerate", "hydrobromide", "bitartrate",
  "disodium", "chloride", "carbonate", "oxide", "gluconate", "lactate", "xinafoate", "bisulfate", "camsylate",
]);
const KEEP_WHOLE = new Set([
  "potassium chloride", "sodium chloride", "sodium bicarbonate", "calcium carbonate", "calcium acetate",
  "calcium citrate", "calcium gluconate", "magnesium oxide", "magnesium sulfate", "ferrous sulfate", "ferrous gluconate",
  "zinc sulfate", "potassium citrate", "magnesium citrate", "calcium chloride", "potassium phosphate", "sodium phosphate",
]);
const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "er", "xr", "sr", "xl", "dr", "ir", "cr",
  "la", "ec", "oral", "solution", "suspension", "injection", "injectable", "pen", "inhaler", "hfa", "patch", "cream",
  "ointment", "gel", "spray", "nasal", "chewable", "odt", "extended", "release", "delayed", "immediate", "film", "coated",
  "vial", "syringe", "prefilled", "kwikpen", "flexpen", "flextouch", "solostar", "drops", "ophthalmic", "topical", "iv",
  "infusion", "liquid", "elixir", "syrup", "powder", "packet", "disintegrating", "orally", "sublingual", "subq", "po",
]);

/** Generic ingredient name (lower case, no salt or form) from a drug name as written. */
function ingredientFromName(name: string): string | undefined {
  let s = name.toLowerCase().replace(/\(.*?\)/g, " ");
  // Cut at the first strength token.
  const m = /\s\d|^\d/.exec(s);
  if (m) s = s.slice(0, m.index);
  s = s.replace(/[,;]+.*$/, "");
  let words = s.split(/\s+/).filter((w) => w !== "");
  words = words.filter((w) => !FORM_WORDS.has(w.replace(/[^a-z]/g, "")));
  if (words.length === 0) return undefined;
  const brand = BRANDS[words[0].replace(/[^a-z]/g, "")];
  if (brand) return brand;
  const whole = words.join(" ");
  if (KEEP_WHOLE.has(whole)) return whole;
  for (const k of KEEP_WHOLE) if (whole.startsWith(k + " ")) return k;
  if (words.length > 1) {
    const kept = [words[0], ...words.slice(1).filter((w) => !SALTS.has(w))];
    words = kept;
  }
  const out = words.join(" ").replace(/\s*-\s*/g, " / ").trim();
  return out || undefined;
}

// ---------------------------------------------------------------------------------------------
// Sensitivity
// ---------------------------------------------------------------------------------------------

const SENS_DRUGS: [RegExp, Sensitivity][] = [
  [/\b(quetiapine|olanzapine|risperidone|aripiprazole|haloperidol|clozapine|ziprasidone|lurasidone|paliperidone|lithium|lamotrigine|sertraline|fluoxetine|paroxetine|citalopram|escitalopram|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|amitriptyline|nortriptyline|imipramine|clomipramine|buspirone|methylphenidate|amphetamine|lisdexamfetamine|atomoxetine|guanfacine|vortioxetine|vilazodone|cariprazine|brexpiprazole)\b/, "mental-health"],
  [/\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|naloxone|varenicline)\b/, "substance-use"],
  [/\b(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|efavirenz|rilpivirine|darunavir|atazanavir|ritonavir|cobicistat|abacavir|lamivudine|zidovudine|nevirapine|cabotegravir|elvitegravir|maraviroc)\b/, "hiv-sti"],
  [/\b(ethinyl estradiol|levonorgestrel|norethindrone|drospirenone|etonogestrel|medroxyprogesterone|norgestimate|desogestrel|ulipristal|mifepristone|misoprostol|clomiphene|letrozole for ovulation|sildenafil|tadalafil|vardenafil)\b/, "sexual-reproductive-health"],
];

const SENS_COND: [RegExp, Sensitivity][] = [
  [/\b(depress|bipolar|schizo|psychos|psychotic|anxiety|panic|ptsd|post traumatic|obsessive|ocd|adhd|attention deficit|eating disorder|anorexia nervosa|bulimia|suicid|self harm|personality disorder|mental)/, "mental-health"],
  [/\b(alcohol (use|abuse|dependence|withdrawal)|alcoholism|opioid (use|abuse|dependence|withdrawal)|substance (use|abuse)|cocaine|methamphetamine|cannabis (use|abuse)|drug (abuse|dependence)|heroin)/, "substance-use"],
  [/\b(hiv|human immunodeficiency|aids\b|chlamydia|gonorrh|syphilis|trichomon|genital herpes|herpes genitalis|hpv|human papilloma|sexually transmitted)/, "hiv-sti"],
  [/\b(pregnan|contracept|infertil|miscarriage|abortion|erectile|gestation|postpartum|ectopic)/, "sexual-reproductive-health"],
  [/\b(brca|lynch syndrome|cystic fibrosis|sickle cell|huntington|hemochromatosis|factor v leiden|genetic|hereditary)/, "genetic"],
];

function icdSensitivity(code: string | undefined): Sensitivity | undefined {
  if (!code) return undefined;
  const c = code.toUpperCase();
  if (/^F1\d/.test(c)) return "substance-use";
  if (/^F/.test(c)) return "mental-health";
  if (/^(B20|Z21|A5[0-9]|A6[0-4])/.test(c)) return "hiv-sti";
  if (/^(O|Z3[0-9]|N97)/.test(c)) return "sexual-reproductive-health";
  return undefined;
}

function sensFrom(text: string, table: [RegExp, Sensitivity][], extra?: Sensitivity): Sensitivity[] | undefined {
  const t = text.toLowerCase();
  const out: Sensitivity[] = [];
  for (const [re, s] of table) if (re.test(t) && !out.includes(s)) out.push(s);
  if (extra && !out.includes(extra)) out.push(extra);
  return out.length ? out : undefined;
}

// ---------------------------------------------------------------------------------------------
// Medications
// ---------------------------------------------------------------------------------------------

type MedStatus = MedicationRow["status"];

function medStatus(raw: string): MedStatus | undefined {
  switch (raw) {
    case "not_reconciled": return "unknown";
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
  }
  return undefined;
}

function unitOf(u: string): "mg" | "mcg" | "units" | "mL" | "tablet" | "g" | "count" | undefined {
  const x = u.toLowerCase().replace(/\.$/, "");
  if (["mg", "milligram", "milligrams"].includes(x)) return "mg";
  if (["mcg", "µg", "ug", "microgram", "micrograms"].includes(x)) return "mcg";
  if (["g", "gram", "grams"].includes(x)) return "g";
  if (["u", "unit", "units", "iu"].includes(x)) return "units";
  if (["ml", "cc", "milliliter", "milliliters"].includes(x)) return "mL";
  if (["tab", "tabs", "tablet", "tablets", "cap", "caps", "capsule", "capsules"].includes(x)) return "tablet";
  if (["puff", "puffs", "actuation", "actuations", "spray", "sprays", "inhalation", "inhalations"].includes(x)) return "count";
  return undefined;
}

function strengthFromName(name: string): { value: number; unit: "mg" | "mcg" | "units" | "mL" } | undefined {
  const m = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|g|units?|iu)\b(?!\s*\/\s*(ml|g)\b)/i.exec(name);
  if (!m) return undefined;
  const all = name.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|g|units?|iu)\b/gi);
  if (all && all.length > 1) return undefined; // combination product: no single strength
  const u = unitOf(m[2]);
  const v = parseFloat(m[1]);
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u === "mg" || u === "mcg" || u === "units") return { value: v, unit: u };
  return undefined;
}

function parseDose(doseText: string, drugName: string): MedicationRow["dose"] | undefined {
  const t = doseText.trim();
  if (/\d\s*(-|–|to|or)\s*\d/i.test(t)) return undefined; // range
  if (/scale|per protocol|as directed|variable|varies|see /i.test(t)) return undefined;
  const m = /^(\d+(?:\.\d+)?|\d*\.\d+)\s*([a-zµ.]+)?$/i.exec(t);
  if (!m) return undefined;
  const v = parseFloat(m[1]);
  if (!isFinite(v)) return undefined;
  const u = m[2] ? unitOf(m[2]) : undefined;
  if (!u) return undefined;
  if (u === "g") return { value: round(v * 1000, 4), unit: "mg" };
  if (u === "tablet" || u === "count") {
    const st = strengthFromName(drugName);
    if (st) return { value: round(st.value * v, 4), unit: st.unit };
    if (u === "tablet") return { value: v, unit: "tablet" };
    return undefined;
  }
  return { value: v, unit: u };
}

function round(v: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function parseFrequency(sig: string): MedicationRow["frequency"] | undefined {
  const s = " " + sig.toLowerCase().replace(/[.,;()]/g, " ") + " ";
  if (/\bprn\b|as needed|when needed|if needed/.test(s)) return "PRN";
  if (/taper|every other day|\bqod\b|alternate days|monthly|every month|every \d+ (weeks|months|days)|four times|\bqid\b|q\s?[46]\s?h\b|every [46] hours|five times|every 2 weeks|biweekly|twice (a |per )?week|three times (a |per )?week/.test(s)) return "other";
  if (/\bq\s?12\s?h\b|every 12 hours|twice daily|twice a day|\bbid\b|2 times (a |per )?day|two times (a |per )?day/.test(s)) return "BID";
  if (/\bq\s?8\s?h\b|every 8 hours|three times daily|three times a day|\btid\b|3 times (a |per )?day/.test(s)) return "TID";
  if (/weekly|once a week|every week|\bqw(eek)?\b|once per week|every (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/.test(s)) return "QW";
  if (/\bqhs\b|at bedtime|\bhs\b|nightly|at night|every night/.test(s)) return "QHS";
  if (/\bdaily\b|once a day|once daily|every day|\bqd\b|\bq24h\b|every 24 hours|every morning|each morning|in the morning|every evening|in the evening|\bqam\b|\bqpm\b|once per day/.test(s)) return "QD";
  return undefined;
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] | undefined {
  if (!text) return undefined;
  const t = text.toLowerCase();
  if (/allerg|rash|hives|urticaria|angioedema|anaphyla|side effect|adverse|intoleran|reaction|toxicity|induced|associated|caused|ketoacidosis|\bdka\b|cough|bleed|hypoglyc|hyperkal|kidney injury|\baki\b|pancreatitis|hepat/.test(t)) return "adverse_reaction";
  if (/ineffective|not effective|no benefit|not working|did not work|inadequate (response|control)|failed/.test(t)) return "ineffective";
  if (/replaced|switch|changed to|in favou?r of|instead|substitut/.test(t)) return "therapy_changed";
  if (/course complete|completed (the )?course|course finished|end of course/.test(t)) return "course_complete";
  if (/patient (declined|chose|choice|preference|prefers|refused|wishes)|per patient/.test(t)) return "patient_choice";
  return undefined;
}

function lineKey(e: Record<string, any>): string | undefined {
  const dn = str(e.drug_name);
  const ing = str(e.rxnorm_ingredient) ?? (dn ? ingredientFromName(dn) : undefined);
  if (!ing) return undefined;
  return `${ing}|${norm(str(e.dose_text) ?? "")}`;
}

function rowKey(e: Record<string, any>): string | undefined {
  const rx = str(e.rxnorm_ingredient);
  if (rx) return `rx:${rx}`;
  const dn = str(e.drug_name);
  const ing = dn ? ingredientFromName(dn) : undefined;
  return ing ? `ing:${ing}` : dn ? `name:${norm(dn)}` : undefined;
}

const STATUS_PREF: Record<string, number> = { new: 6, changed: 6, continue: 5, held: 4, stopped: 3, not_reconciled: 1 };

function homeMeds(d: Doc): [string, Record<string, any>][] {
  return d.entries.filter(([, e]) => e.type === "home_med" && str(e.drug_name) && medStatus(String(e.status)));
}

function mapMedications(docs: Doc[]): MedicationRow[] {
  const withMeds = docs.filter((d) => homeMeds(d).length > 0);
  if (withMeds.length === 0) return [];
  // Latest encounter (by its start) that has a home medication list.
  const encStart = new Map<string, number>();
  for (const d of withMeds) {
    const cur = encStart.get(d.encId);
    if (cur === undefined || d.encStartMs < cur) encStart.set(d.encId, d.encStartMs);
  }
  let encId = "";
  let best = -Infinity;
  let bestRec = -Infinity;
  for (const d of withMeds) {
    const s = encStart.get(d.encId)!;
    if (s > best || (s === best && d.recMs > bestRec)) {
      best = s;
      bestRec = d.recMs;
      encId = d.encId;
    }
  }
  const encDocs = withMeds.filter((d) => d.encId === encId).sort(cmpDoc);
  const ds = encDocs.filter((d) => d.kind === "discharge_summary");
  const snap = ds.length ? ds[ds.length - 1] : encDocs[encDocs.length - 1];

  // Per line (ingredient + dose), walk this encounter's documents up to the snapshot to date the current status.
  const upTo = encDocs.slice(0, encDocs.indexOf(snap) + 1);
  interface LineState { mapped?: MedStatus; raw?: string; since?: Doc; sinceKey?: string; instr?: string }
  const states = new Map<string, LineState>();
  for (const d of upTo) {
    for (const [k, e] of homeMeds(d)) {
      const lk = lineKey(e);
      if (!lk) continue;
      const raw = String(e.status);
      const mapped = medStatus(raw)!;
      const st = states.get(lk) ?? {};
      let since = st.since;
      let sinceKey = st.sinceKey;
      if (raw === "not_reconciled") {
        since = undefined;
      } else if (raw === "held" || raw === "stopped") {
        if (st.mapped !== mapped) { since = d; sinceKey = k; }
      } else if (raw === "new" || raw === "changed") {
        if (st.raw !== raw && !(st.mapped === "active" && (st.raw === "new" || st.raw === "changed"))) { since = d; sinceKey = k; }
      } else if (raw === "continue") {
        if (st.mapped === "held" || st.mapped === "stopped") { since = d; sinceKey = k; }
        else if (st.mapped !== "active") since = undefined;
      }
      // The reason for the current status may have been written when the status began and not restated since.
      const instr = str(e.instructions) ?? (st.mapped === mapped ? st.instr : undefined);
      states.set(lk, { mapped, raw, since, sinceKey, instr });
    }
  }

  const chosen = new Map<string, [string, Record<string, any>]>();
  for (const [k, e] of homeMeds(snap)) {
    const rk = rowKey(e);
    if (!rk) continue;
    const prev = chosen.get(rk);
    if (!prev || (STATUS_PREF[String(e.status)] ?? 0) > (STATUS_PREF[String(prev[1].status)] ?? 0)) chosen.set(rk, [k, e]);
  }

  const rows: MedicationRow[] = [];
  for (const [, [k, e]] of chosen) {
    const drugName = str(e.drug_name)!;
    const raw = String(e.status);
    const status = medStatus(raw)!;
    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [] };
    const ing = ingredientFromName(drugName);
    if (ing) row.ingredient = ing;
    const rx = str(e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;
    const lk = lineKey(e);
    const st = lk ? states.get(lk) : undefined;
    const ev: Evidence = [];
    if (st?.since && st.since !== snap && st.since.decisionDate) {
      ev.push({ item_id: st.since.id, entry_id: st.sinceKey });
    }
    if (st?.since?.decisionDate && status !== "unknown") row.status_since = st.since.decisionDate;
    const dt = str(e.dose_text);
    if (dt) {
      const dose = parseDose(dt, drugName);
      if (dose) row.dose = dose;
    }
    const sig = str(e.sig);
    if (sig) {
      const f = parseFrequency(sig);
      if (f) row.frequency = f;
    }
    const instr = str(e.instructions) ?? st?.instr;
    if (instr && status !== "unknown") row.status_reason_text = instr;
    if (status === "stopped") {
      const r = stopReason(instr);
      if (r) row.stop_reason = r;
    }
    const sens = sensFrom(`${drugName} ${ing ?? ""}`, SENS_DRUGS);
    if (sens) row.sensitivity = sens;
    ev.push({ item_id: snap.id, entry_id: k });
    row.evidence = ev;
    rows.push(row);
  }
  rows.sort((a, b) => (a.ingredient ?? a.drug_name).localeCompare(b.ingredient ?? b.drug_name));
  return rows;
}

// ---------------------------------------------------------------------------------------------
// Drug attribution (diagnoses attributed to a drug) and allergy classification
// ---------------------------------------------------------------------------------------------

interface DrugClass { re: RegExp; member: RegExp }
const DRUG_CLASSES: DrugClass[] = [
  { re: /sglt-?2|gliflozin/i, member: /gliflozin$/ },
  { re: /ace[- ]inhibitor|\bacei?\b/i, member: /pril$/ },
  { re: /angiotensin receptor blocker|\barbs?\b/i, member: /sartan$/ },
  { re: /statin/i, member: /statin$/ },
  { re: /penicillin/i, member: /cillin$/ },
  { re: /cephalosporin/i, member: /^(cef|ceph)/ },
  { re: /fluoroquinolone|quinolone/i, member: /floxacin$/ },
  { re: /macrolide/i, member: /(thromycin|erythromycin)$/ },
  { re: /sulfonamide|sulfa\b/i, member: /^sulfa/ },
  { re: /nsaid|non-?steroidal/i, member: /^(ibuprofen|naproxen|diclofenac|meloxicam|celecoxib|indomethacin|ketorolac|aspirin|etodolac|nabumetone|ketoprofen|piroxicam)$/ },
  { re: /opioid|opiate/i, member: /^(morphine|oxycodone|hydrocodone|hydromorphone|fentanyl|codeine|tramadol|methadone|tapentadol|oxymorphone|buprenorphine)$/ },
  { re: /beta[- ]?blocker/i, member: /olol$/ },
  { re: /thiazide/i, member: /^(hydrochlorothiazide|chlorthalidone|indapamide|metolazone|chlorothiazide)$/ },
  { re: /loop diuretic/i, member: /^(furosemide|bumetanide|torsemide|ethacrynic acid)$/ },
  { re: /sulfonylurea/i, member: /^(glipizide|glyburide|glimepiride|gliclazide)$/ },
  { re: /dpp-?4|gliptin/i, member: /gliptin$/ },
  { re: /glp-?1/i, member: /(glutide|exenatide)$/ },
  { re: /calcium channel blocker/i, member: /(dipine|^verapamil|^diltiazem)$/ },
  { re: /anticoagulant/i, member: /^(warfarin|apixaban|rivaroxaban|dabigatran|edoxaban|heparin|enoxaparin)$/ },
  { re: /\bppi\b|proton pump/i, member: /prazole$/ },
  { re: /\bssri\b/i, member: /^(sertraline|fluoxetine|paroxetine|citalopram|escitalopram|fluvoxamine)$/ },
  { re: /tetracycline/i, member: /cycline$/ },
  { re: /aminoglycoside/i, member: /(micin|mycin)$/ },
  { re: /contrast/i, member: /^$/ },
];
const DRUG_SUFFIX = /(pril|sartan|statin|cillin|gliflozin|gliptin|glutide|floxacin|thromycin|cycline|olol|dipine|prazole|tidine|azole|mab|nib|vir|platin|parin|xaban|semide|thiazide|profen|oxacin)$/;

interface Attribution {
  /** class or drug wording as written in the diagnosis */
  written: string;
  /** the condition part of the label with the attribution removed (may be empty) */
  condition: string;
  /** true when the entry names only the adverse effect and no condition */
  effectOnly: boolean;
}

function isAdverseEffectTCode(code: string | undefined): boolean {
  if (!code) return false;
  return /^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/i.test(code.trim());
}

function findAttribution(label: string, rdxName: string | undefined, icd: string | undefined, docDrugs: string[]): Attribution | undefined {
  const texts = [label, rdxName ?? ""];
  for (const text of texts) {
    if (!text) continue;
    let m = /^\s*adverse effect of\s+(.+?)(?:,\s*(initial|subsequent).*)?\s*$/i.exec(text);
    if (m) return { written: m[1].trim(), condition: "", effectOnly: true };
    const patterns: RegExp[] = [
      /^(.*?)[,;]?\s+(?:due to|secondary to|caused by|from|attributed to|related to|associated with|induced by)\s+(.+?)\s*$/i,
      /^(.*?)[,;]\s*([a-z0-9 \-\/]+?)[- ](?:associated|induced|related)\s*$/i,
      /^([a-z0-9 \-\/]+?)[- ](?:associated|induced|related)\s+(.+)$/i,
    ];
    for (let i = 0; i < patterns.length; i++) {
      m = patterns[i].exec(text);
      if (!m) continue;
      const cond = i === 2 ? m[2] : m[1];
      const drug = i === 2 ? m[1] : m[2];
      if (looksLikeDrug(drug, docDrugs)) return { written: drug.trim(), condition: cond.trim(), effectOnly: false };
    }
  }
  if (isAdverseEffectTCode(icd)) {
    // Coded as an adverse drug effect but wording did not name the drug in a recognised form.
    for (const d of docDrugs) if (label.toLowerCase().includes(d)) return { written: d, condition: "", effectOnly: true };
  }
  return undefined;
}

function looksLikeDrug(text: string, docDrugs: string[]): boolean {
  const t = text.toLowerCase().trim();
  if (!t) return false;
  if (DRUG_CLASSES.some((c) => c.re.test(t))) return true;
  for (const d of docDrugs) if (d && (t === d || t.includes(d))) return true;
  const ing = ingredientFromName(t);
  if (ing && BRANDS[ing]) return true;
  return t.split(/\s+/).some((w) => DRUG_SUFFIX.test(w.replace(/[^a-z]/g, "")) || BRANDS[w] !== undefined) && !/\b(disease|infection|failure|injury)\b/.test(t);
}

interface DocDrug { ingredient: string; rx?: string; entryKey: string }
function docDrugList(d: Doc): DocDrug[] {
  const out: DocDrug[] = [];
  for (const [k, e] of d.entries) {
    if (e.type !== "home_med") continue;
    const dn = str(e.drug_name);
    const ing = dn ? ingredientFromName(dn) : undefined;
    if (ing) out.push({ ingredient: ing, rx: str(e.rxnorm_ingredient), entryKey: k });
  }
  return out;
}

function resolveSubstance(written: string, drugs: DocDrug[]): { substance: string; rx?: string } {
  const w = written.toLowerCase().trim();
  // Named drug present on the list.
  for (const d of drugs) if (w === d.ingredient || w.includes(d.ingredient)) return { substance: d.ingredient, rx: d.rx };
  const cls = DRUG_CLASSES.find((c) => c.re.test(w));
  if (cls) {
    const members = new Map<string, DocDrug>();
    for (const d of drugs) if (cls.member.test(d.ingredient)) members.set(d.ingredient, d);
    if (members.size === 1) {
      const d = [...members.values()][0];
      return { substance: d.ingredient, rx: d.rx };
    }
    return { substance: written.trim() };
  }
  const ing = ingredientFromName(written);
  return { substance: ing ?? written.trim() };
}

const HYPERSENS = /hive|urticari|rash|swell|angioedema|anaphyla|bronchospasm|wheez|itch|prurit|throat|lip|tongue|face|facial|stevens|johnson|\bsjs\b|\bten\b|epidermal necrolysis|dress|blister|exfoliat|erythema|flush|shortness of breath|dyspnea|difficulty breathing|hypersensitiv|allergic/;
const SERIOUS = /liver|hepat|pancreatitis|kidney|renal|\baki\b|agranulocyt|neutropeni|thrombocytopeni|aplastic|qt prolong|arrhythm|torsade|rhabdo|seizure|ketoacidosis|\bdka\b|lactic acidosis|tendon|bleed|hemorrhag|intracranial|serotonin syndrome|neuroleptic malignant|myocarditis|hyperkal|hypoglyc|coma|death|cardiac arrest|respiratory depression|c\.? ?diff|colitis/;
const NON_IMMUNE = /cough|nausea|vomit|diarrh|constipat|stomach|\bgi\b|gastro|dyspepsia|upset|drowsi|sedat|dizz|headache|myalgia|muscle (ache|pain)|fatigue|insomnia|tremor|palpitation|edema|ketoacidosis|\bdka\b|hypoglyc|hyperkal|lactic acidosis|flushing with niacin|jitter|dry mouth|weight gain|hair loss/;

function classifyReaction(reaction: string | undefined, severity: string | undefined): { type: AllergyIntoleranceRow["reaction_type"]; mech: AllergyIntoleranceRow["mechanism"] } {
  const r = (reaction ?? "").toLowerCase();
  if (r && HYPERSENS.test(r)) return { type: "hypersensitivity", mech: /\bige\b|immune[- ]mediated/.test(r) ? "immune" : "unknown" };
  if (r && SERIOUS.test(r)) return { type: "serious_adverse_event", mech: NON_IMMUNE.test(r) ? "non_immune" : "unknown" };
  if (r && NON_IMMUNE.test(r)) return { type: "side_effect", mech: "non_immune" };
  if (severity === "mild") return { type: "side_effect", mech: "unknown" };
  return { type: "hypersensitivity", mech: "unknown" };
}

function criticalityOf(severity: string | undefined, type: AllergyIntoleranceRow["reaction_type"]): AllergyIntoleranceRow["criticality"] {
  switch (severity) {
    case "mild": return "low";
    case "severe": return "high";
    case "moderate": return type === "side_effect" ? "low" : "high";
  }
  return "unknown";
}

// ---------------------------------------------------------------------------------------------
// Allergies (list snapshot)
// ---------------------------------------------------------------------------------------------

function mapAllergyList(docs: Doc[]): AllergyIntoleranceRow[] {
  const sorted = [...docs].sort(cmpDoc);
  let snap: Doc | undefined;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].entries.some(([, e]) => e.type === "allergy" && str(e.substance))) { snap = sorted[i]; break; }
  }
  if (!snap) return [];
  const rows = new Map<string, AllergyIntoleranceRow>();
  for (const [k, e] of snap.entries) {
    if (e.type !== "allergy") continue;
    const sub = str(e.substance);
    if (!sub) continue;
    if (/^\s*(nkda|nka|no known (drug )?allergies|none)\s*$/i.test(sub)) continue;
    const rx = str(e.rxnorm_ingredient);
    const substance = rx ? ingredientFromName(sub) ?? sub.toLowerCase() : sub;
    const reaction = str(e.reaction);
    const severity = str(e.severity);
    const { type, mech } = classifyReaction(reaction, severity);
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: type,
      mechanism: mech,
      criticality: criticalityOf(severity, type),
      evidence: [{ item_id: snap.id, entry_id: k }],
    };
    if (rx) row.rxnorm_ingredient = rx;
    if (reaction) row.reaction = reaction.split(/\s*[,;]\s*/).filter((x) => x).join("; ");
    const sens = sensFrom(substance, SENS_DRUGS);
    if (sens) row.sensitivity = sens;
    const key = rx ? `rx:${rx}` : `s:${norm(substance)}`;
    if (!rows.has(key)) rows.set(key, row);
  }
  return [...rows.values()];
}

// ---------------------------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------------------------

interface CondEntry {
  doc: Doc;
  key: string;
  kind: "diagnosis" | "history";
  e: Record<string, any>;
  label: string;
  icd?: string;
  rdx?: string;
  order: number;
}

function isCkd(label: string, icd: string | undefined): boolean {
  if (icd && /^N18(\.|$)/i.test(icd)) return true;
  return /\bckd\b|chronic kidney disease|chronic renal (disease|insufficiency|failure)/i.test(label);
}

function ckdStage(label: string, icd: string | undefined): ProblemRow["ckd_stage"] | undefined {
  const l = label.toLowerCase();
  let m = /\bg\s?(1|2|3a|3b|4|5)\b/.exec(l);
  if (m) return ("G" + m[1]) as ProblemRow["ckd_stage"];
  m = /stage\s*(1|2|3a|3b|4|5|i{1,3}[ab]?|iv|v)\b/.exec(l);
  if (m) {
    const roman: Record<string, string> = { i: "1", ii: "2", iii: "3", iiia: "3a", iiib: "3b", iv: "4", v: "5" };
    const s = roman[m[1]] ?? m[1];
    if (["1", "2", "3a", "3b", "4", "5"].includes(s)) return ("G" + s) as ProblemRow["ckd_stage"];
  }
  if (/end[- ]stage|\besrd\b|\beskd\b/.test(l)) return "G5";
  if (icd) {
    const c = icd.toUpperCase().trim();
    const map: Record<string, ProblemRow["ckd_stage"]> = {
      "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
    };
    if (map[c]) return map[c];
  }
  return undefined;
}

function albuminuriaCat(label: string): ProblemRow["albuminuria"] | undefined {
  const l = label.toLowerCase();
  const m = /\ba\s?([123])\b/.exec(l);
  if (m) return ("A" + m[1]) as ProblemRow["albuminuria"];
  if (/severely increased albuminuria|macroalbuminuria|severe albuminuria/.test(l)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria|moderate albuminuria/.test(l)) return "A2";
  if (/normal to mildly increased albuminuria|no albuminuria/.test(l)) return "A1";
  return undefined;
}

function parseOnset(text: string | undefined): ProblemRow["onset"] | undefined {
  if (!text) return undefined;
  const t = text.trim();
  if (/^\d{4}$/.test(t)) return { value: t, precision: "year" };
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(t)) return { value: t, precision: "month" };
  if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(t)) return { value: t, precision: "day" };
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const m = /^([a-z]+)\.?\s+(\d{4})$/i.exec(t);
  if (m) {
    const i = months.indexOf(m[1].slice(0, 3).toLowerCase());
    if (i >= 0) return { value: `${m[2]}-${p2(i + 1)}`, precision: "month" };
  }
  return undefined;
}

class UF {
  parent = new Map<string, string>();
  rdx = new Map<string, Set<string>>();
  find(x: string): string {
    if (!this.parent.has(x)) { this.parent.set(x, x); this.rdx.set(x, new Set(x.startsWith("rdx:") ? [x] : [])); }
    let r = x;
    while (this.parent.get(r) !== r) r = this.parent.get(r)!;
    let c = x;
    while (this.parent.get(c) !== r) { const n = this.parent.get(c)!; this.parent.set(c, r); c = n; }
    return r;
  }
  union(a: string, b: string): void {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return;
    const sa = this.rdx.get(ra)!, sb = this.rdx.get(rb)!;
    if (sa.size && sb.size && [...sa].some((x) => !sb.has(x))) return; // never merge different Riverside codes
    this.parent.set(rb, ra);
    for (const x of sb) sa.add(x);
  }
}

function mapProblems(docs: Doc[], allergyOut: AllergyIntoleranceRow[]): ProblemRow[] {
  const sorted = [...docs].sort(cmpDoc);
  const entries: CondEntry[] = [];
  let order = 0;
  for (const d of sorted) {
    // history before diagnoses within one document
    for (const kind of ["history", "diagnosis"] as const) {
      for (const [k, e] of d.entries) {
        if (e.type !== kind) continue;
        const label = kind === "diagnosis" ? str(e.label) : str(e.condition);
        if (!label) continue;
        const icd = str(e.icd10cm)?.trim();
        const rdx = kind === "diagnosis" && isObj(e.riverside_dx) ? str(e.riverside_dx.code) : undefined;
        entries.push({ doc: d, key: k, kind, e, label, icd, rdx, order: order++ });
      }
    }
  }
  if (entries.length === 0) return [];

  // Initial keys.
  const keyOf = new Map<CondEntry, string>();
  for (const ce of entries) {
    let key: string;
    if (isCkd(ce.label, ce.icd)) key = "ckd";
    else if (ce.rdx) key = `rdx:${ce.rdx}`;
    else if (ce.icd) {
      key = `icd:${ce.icd.toUpperCase()}`;
      if (ce.kind === "diagnosis") {
        const codes = new Set(
          entries.filter((o) => o.rdx && o.icd && o.icd.toUpperCase() === ce.icd!.toUpperCase() && o.doc.encId === ce.doc.encId).map((o) => o.rdx!),
        );
        if (codes.size === 1) key = `rdx:${[...codes][0]}`;
      }
    } else key = `lbl:${norm(ce.label)}`;
    keyOf.set(ce, key);
  }
  const uf = new UF();
  for (const ce of entries) uf.find(keyOf.get(ce)!);
  // Same wording -> same condition (recoding); a working "R/O x" never merges into an established x by label.
  const byLabel = new Map<string, string[]>();
  for (const ce of entries) {
    const l = norm(ce.label);
    const arr = byLabel.get(l) ?? [];
    arr.push(keyOf.get(ce)!);
    byLabel.set(l, arr);
    if (ce.rdx && isObj(ce.e.riverside_dx) && str(ce.e.riverside_dx.name)) {
      const ln = norm(ce.e.riverside_dx.name);
      const a2 = byLabel.get(ln) ?? [];
      a2.push(keyOf.get(ce)!);
      byLabel.set(ln, a2);
    }
  }
  for (const keys of byLabel.values()) for (let i = 1; i < keys.length; i++) uf.union(keys[0], keys[i]);

  const groups = new Map<string, CondEntry[]>();
  for (const ce of entries) {
    const g = uf.find(keyOf.get(ce)!);
    const arr = groups.get(g) ?? [];
    arr.push(ce);
    groups.set(g, arr);
  }

  const rows: ProblemRow[] = [];
  const allergyKeys = new Set(allergyOut.map((a) => (a.rxnorm_ingredient ? `rx:${a.rxnorm_ingredient}` : `s:${norm(a.substance)}`)));
  for (const [gk, list] of groups) {
    list.sort((a, b) => a.order - b.order);
    const dx = list.filter((c) => c.kind === "diagnosis");
    const hist = list.filter((c) => c.kind === "history");
    let decisive: CondEntry | undefined;
    let status: ProblemRow["status"] | undefined;
    if (dx.length) {
      const confirmed = dx.filter((c) => c.e.status !== "working");
      if (confirmed.length === 0) continue; // only ever suspected
      decisive = confirmed[confirmed.length - 1];
      const s = decisive.e.status;
      if (s === "ruled_out") continue;
      if (s === "active") status = "active";
      else if (s === "resolved") status = "resolved";
      else continue;
    } else if (hist.length) {
      decisive = hist[hist.length - 1];
      status = /\b(history of|h\/o|hx of|resolved|remote|former|past)\b/i.test(decisive.label) ? "resolved" : "active";
    }
    if (!decisive || !status) continue;

    // Drug attribution -> allergy row.
    const drugs = docDrugList(decisive.doc);
    let effectOnly = false;
    if (decisive.kind === "diagnosis") {
      const rdxName = isObj(decisive.e.riverside_dx) ? str(decisive.e.riverside_dx.name) : undefined;
      const att = findAttribution(decisive.label, rdxName, decisive.icd, drugs.map((d) => d.ingredient));
      if (att) {
        effectOnly = att.effectOnly;
        const { substance, rx } = resolveSubstance(att.written, drugs);
        const reactionText = att.condition || (effectOnly ? undefined : decisive.label);
        const cls = classifyReaction(reactionText ?? decisive.label, undefined);
        const type = cls.type;
        const crit: AllergyIntoleranceRow["criticality"] =
          type === "serious_adverse_event" ? "high" : type === "side_effect" ? "low"
          : /anaphyla|angioedema|stevens|johnson|necrolysis|dress|bronchospasm/i.test(reactionText ?? "") ? "high" : "unknown";
        const akey = rx ? `rx:${rx}` : `s:${norm(substance)}`;
        const ev: Evidence = [{ item_id: decisive.doc.id, entry_id: decisive.key }];
        const medEntry = drugs.find((d) => d.ingredient === substance);
        if (medEntry) ev.push({ item_id: decisive.doc.id, entry_id: medEntry.entryKey });
        if (allergyKeys.has(akey)) {
          const existing = allergyOut.find((a) => (a.rxnorm_ingredient ? `rx:${a.rxnorm_ingredient}` : `s:${norm(a.substance)}`) === akey);
          if (existing) {
            for (const x of ev) {
              if (!existing.evidence.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id)) existing.evidence.push(x);
            }
            if (!existing.reaction && reactionText) existing.reaction = reactionText;
          }
        } else {
          allergyKeys.add(akey);
          const row: AllergyIntoleranceRow = {
            substance,
            reaction_type: type,
            mechanism: cls.mech,
            criticality: crit,
            evidence: ev,
          };
          if (rx) row.rxnorm_ingredient = rx;
          if (reactionText) row.reaction = reactionText;
          const sens = sensFrom(substance, SENS_DRUGS);
          if (sens) row.sensitivity = sens;
          allergyOut.push(row);
        }
      }
    }
    if (effectOnly) continue;

    const row: ProblemRow = { condition: decisive.label, status, evidence: [] };
    if (decisive.icd) row.icd10cm = decisive.icd;
    // Onset: history lines carry the only onset Riverside records.
    for (let i = hist.length - 1; i >= 0; i--) {
      const o = parseOnset(str(hist[i].e.onset_text));
      if (o) { row.onset = o; break; }
    }
    if (gk === uf.find("ckd") && list.some((c) => isCkd(c.label, c.icd))) {
      const pref = [...hist, ...dx]; // diagnoses (re-assessed) outrank history lines
      for (let i = pref.length - 1; i >= 0; i--) {
        const s = ckdStage(pref[i].label, pref[i].icd);
        if (s) { row.ckd_stage = s; break; }
      }
      for (let i = pref.length - 1; i >= 0; i--) {
        const a = albuminuriaCat(pref[i].label);
        if (a) { row.albuminuria = a; break; }
      }
    }
    const sens = sensFrom(decisive.label, SENS_COND, icdSensitivity(decisive.icd));
    if (sens) row.sensitivity = sens;
    const ev: Evidence = [];
    const seen = new Set<string>();
    for (const c of [...list.filter((c) => c !== decisive), decisive]) {
      if (c.kind === "diagnosis" && c.e.status === "working" && c !== decisive) continue;
      const k = `${c.doc.id}#${c.key}`;
      if (seen.has(k)) continue;
      seen.add(k);
      ev.push({ item_id: c.doc.id, entry_id: c.key });
    }
    row.evidence = ev;
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------------------------
// Labs
// ---------------------------------------------------------------------------------------------

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "50044-7": "egfr",
  "88293-6": "egfr", "88294-4": "egfr", "77147-7": "egfr", "50210-4": "egfr", "69405-9": "egfr", "94677-2": "egfr",
  "2823-3": "potassium", "6298-4": "potassium",
  "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap",
  "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "41653-7": "glucose", "1547-9": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "14958-3": "uacr", "13705-9": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "33256-9": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin", "30313-1": "hemoglobin", "30350-3": "hemoglobin", "30351-1": "hemoglobin",
  "53060-9": "bhb", "47548-4": "bhb", "48003-9": "bhb",
  "2744-1": "ph", "2746-6": "ph", "2753-2": "ph", "11558-4": "ph", "19213-8": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "2026-3": "pco2", "11557-6": "pco2",
  "3040-3": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin", "16255-2": "troponin",
  "2093-3": "cholesterol",
  "2571-8": "triglycerides",
  "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "69419-0": "ldl", "96259-7": "ldl",
};
const LOINC_EGFR_RACE = new Set(["48643-1", "88293-6"]);

const ANALYTE_UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L",
  troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function analyteByName(code: string, name: string, specimen: string): Analyte | undefined {
  const n = `${code} ${name}`.toLowerCase();
  const urine = /urine|\bur\b|\bu-/.test(`${n} ${specimen.toLowerCase()}`);
  if (/albumin.*creat|\buacr\b|\bacr\b|microalb.*creat/.test(n)) return "uacr";
  if (urine) return undefined;
  if (/egfr|glomerular/.test(n)) return "egfr";
  if (/creatinine|\bcreat\b|\bcr\b/.test(n) && !/kinase|clearance/.test(n)) return "creatinine";
  if (/potassium|^k\b/.test(n)) return "potassium";
  if (/sodium|^na\b/.test(n)) return "sodium";
  if (/chloride|^cl\b/.test(n)) return "chloride";
  if (/anion gap|\bagap\b/.test(n)) return "anion_gap";
  if (/bicarbonate|total co2|\bco2\b|\bhco3\b/.test(n) && !/pco2|partial/.test(n)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/a1c|glycated|glycosylated/.test(n)) return "a1c";
  if (/glucose|\bglu\b/.test(n)) return "glucose";
  if (/platelet|\bplt\b/.test(n)) return "platelets";
  if (/white blood|leukocyte|\bwbc\b/.test(n)) return "wbc";
  if (/hemoglobin|haemoglobin|\bhgb\b|\bhb\b/.test(n)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b/.test(n)) return "bhb";
  if (/\bph\b|vph|aph/.test(n)) return "ph";
  if (/pco2/.test(n)) return "pco2";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin i|\btni\b|\bctni\b|troponin(?! t)/.test(n) && !/troponin t|\btnt\b/.test(n)) return "troponin";
  if (/\bhdl\b/.test(n)) return "hdl";
  if (/\bldl\b/.test(n)) return "ldl";
  if (/triglyceride|\btrig\b/.test(n)) return "triglycerides";
  if (/cholesterol|\bchol\b/.test(n)) return "cholesterol";
  return undefined;
}

function convertUnit(analyte: Analyte, value: number, unit: string | undefined): number | undefined {
  const target = ANALYTE_UNIT[analyte];
  if (analyte === "ph") return unit === undefined || /^\[?ph\]?$|^$/i.test(unit.trim()) ? value : undefined;
  if (!unit) return undefined;
  const u = unit.trim().replace(/\s+/g, "").replace(/µ/g, "u");
  const ul = u.toLowerCase();
  if (ul === target.toLowerCase()) return value;
  switch (analyte) {
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      if (ul === "meq/l" || ul === "mmol/l") return value;
      if (analyte === "bhb" && ul === "mg/dl") return value / 10.41;
      return undefined;
    case "creatinine":
      if (ul === "umol/l") return value / 88.42;
      return undefined;
    case "glucose":
      if (ul === "mmol/l") return value * 18.016;
      return undefined;
    case "bun":
      if (ul === "mmol/l") return value * 2.801;
      return undefined;
    case "egfr":
      if (/^ml\/min\/1\.73m(2|\^2|²)$/.test(ul) || ul === "ml/min/{1.73_m2}" || ul === "ml/min/1.73m2") return value;
      return undefined;
    case "a1c":
      if (ul === "%" || ul === "%hba1c" || ul === "%{hba1c}") return value;
      if (ul === "mmol/mol") return value / 10.929 + 2.15;
      return undefined;
    case "uacr":
      if (ul === "mg/g" || ul === "ug/mg" || ul === "mg/gcreat" || ul === "mg/g{creat}") return value;
      if (ul === "mg/mmol") return value * 8.84;
      return undefined;
    case "platelets": case "wbc":
      if (["10*3/ul", "10^3/ul", "k/ul", "10*9/l", "10^9/l", "thou/ul", "x10e3/ul", "x10*3/ul"].includes(ul)) return value;
      if (ul === "/ul" || ul === "cells/ul") return value / 1000;
      return undefined;
    case "hemoglobin":
      if (ul === "g/dl") return value;
      if (ul === "g/l") return value / 10;
      if (ul === "mmol/l") return value * 1.611;
      return undefined;
    case "pco2":
      if (ul === "mmhg" || ul === "mm[hg]") return value;
      if (ul === "kpa") return value * 7.50062;
      return undefined;
    case "lipase":
      if (ul === "u/l" || ul === "iu/l") return value;
      return undefined;
    case "troponin":
      if (ul === "ng/ml" || ul === "ug/l") return value;
      if (ul === "ng/l" || ul === "pg/ml") return value / 1000;
      return undefined;
    case "cholesterol": case "hdl": case "ldl":
      if (ul === "mg/dl") return value;
      if (ul === "mmol/l") return value * 38.67;
      return undefined;
    case "triglycerides":
      if (ul === "mg/dl") return value;
      if (ul === "mmol/l") return value * 88.57;
      return undefined;
  }
  return undefined;
}

const STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

interface LabCopy {
  doc: Doc;
  entryKey: string;
  rv: Record<string, any>;
  accession: string;
  collected: string;
  specimen: string;
  status: string;
}

function mapLabs(docs: Doc[]): LabResultRow[] {
  const copies = new Map<string, LabCopy[]>();
  const add = (c: LabCopy, code: string) => {
    const k = `${c.accession}|${code}`;
    const arr = copies.get(k) ?? [];
    arr.push(c);
    copies.set(k, arr);
  };
  for (const d of docs) {
    for (const [k, e] of d.entries) {
      const acc = str(e.accession);
      const coll = str(e.collected);
      const status = str(e.status);
      if (!acc || !coll || !status || !STATUS_RANK[status]) continue;
      const spec = str(e.specimen) ?? "";
      if (e.type === "result") {
        const code = isObj(e.test) ? str(e.test.local_code) ?? str(e.test.loinc) ?? str(e.test.name) : undefined;
        if (code) add({ doc: d, entryKey: k, rv: e, accession: acc, collected: coll, specimen: spec, status }, code);
      } else if (e.type === "panel" && Array.isArray(e.components)) {
        for (const comp of e.components) {
          if (!isObj(comp) || !isObj(comp.test)) continue;
          const code = str(comp.test.local_code) ?? str(comp.test.loinc) ?? str(comp.test.name);
          if (code) add({ doc: d, entryKey: k, rv: comp, accession: acc, collected: coll, specimen: spec, status }, code);
        }
      }
    }
  }

  const rows: LabResultRow[] = [];
  for (const list of copies.values()) {
    list.sort((a, b) => (STATUS_RANK[a.status] - STATUS_RANK[b.status]) || cmpDoc(a.doc, b.doc));
    const best = list[list.length - 1];
    const test = best.rv.test as Record<string, any>;
    const loinc = str(test.loinc);
    const name = str(test.name) ?? "";
    const code = str(test.local_code) ?? "";
    let analyte: Analyte | undefined = loinc ? LOINC_ANALYTE[loinc] : undefined;
    if (!analyte) analyte = analyteByName(code, name, best.specimen);
    if (!analyte) continue;
    if (analyte !== "uacr" && /urine/i.test(best.specimen)) continue;
    if (analyte === "egfr") {
      if ((loinc && LOINC_EGFR_RACE.has(loinc)) || /african|black|\baa\b|race[- ]based|with race/i.test(name)) continue;
    }
    const raw = str(best.rv.value);
    if (!raw) continue;
    const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(raw);
    if (!m) continue;
    const parsed = parseFloat(m[2]);
    if (!isFinite(parsed)) continue;
    const conv = convertUnit(analyte, parsed, str(best.rv.unit));
    if (conv === undefined) continue;
    const when = toLocal(best.collected);
    if (!when) continue;
    const comp = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as LabResultRow["comparator"] | undefined);
    const value = conv === parsed ? parsed : round(conv, 4);
    const row: LabResultRow = {
      analyte,
      value,
      unit: ANALYTE_UNIT[analyte],
      collected: when.rfc,
      status: best.status === "preliminary" ? "preliminary" : "final",
      evidence: [],
    };
    if (comp) row.comparator = comp;
    if (analyte === "egfr") {
      const n = name.toLowerCase();
      if (/2021|race[- ]free/.test(n) || loinc === "98979-8") row.egfr_equation = "ckd-epi-2021";
      else if (/2009/.test(n) || loinc === "62238-1" || loinc === "88294-4" || loinc === "50044-7") row.egfr_equation = "ckd-epi-2009";
      else if (/mdrd/.test(n) || loinc === "33914-3" || loinc === "48642-3" || loinc === "77147-7") row.egfr_equation = "mdrd";
      else if (/ckd-?epi/.test(n) && when.date >= "2023-01-01") row.egfr_equation = "ckd-epi-2021";
      else if (when.date >= "2023-01-01") row.egfr_equation = "ckd-epi-2021"; // Riverside: CKD-EPI 2021 for all results since 2023
      else row.egfr_equation = "unknown";
    }
    if (loinc) row.loinc = loinc;
    const seen = new Set<string>();
    // Copies that agree with the chosen value/status are the evidence; superseded preliminary copies are listed too.
    for (const c of list) {
      const k = `${c.doc.id}#${c.entryKey}`;
      if (seen.has(k)) continue;
      seen.add(k);
      row.evidence.push({ item_id: c.doc.id, entry_id: c.entryKey });
    }
    rows.push(row);
  }
  rows.sort((a, b) => a.collected.localeCompare(b.collected) || a.analyte.localeCompare(b.analyte));
  return rows;
}

// ---------------------------------------------------------------------------------------------
// Vitals
// ---------------------------------------------------------------------------------------------

function mapVitals(docs: Doc[]): VitalRow[] {
  interface VSet { ms: number; hm: string; encId: string; e: Record<string, any>; doc: Doc; key: string; ev: Evidence }
  const byTime = new Map<string, VSet>();
  for (const d of [...docs].sort(cmpDoc)) {
    for (const [k, e] of d.entries) {
      if (e.type !== "vitals") continue;
      const t = toLocal(e.taken);
      if (!t) continue;
      const tk = `${t.ms}`;
      const prev = byTime.get(tk);
      if (prev) {
        prev.ev.push({ item_id: d.id, entry_id: k });
        prev.e = { ...prev.e, ...e }; // later copy fills in / restates
        prev.doc = d;
      } else {
        byTime.set(tk, { ms: t.ms, hm: t.hm, encId: d.encId, e: { ...e }, doc: d, key: k, ev: [{ item_id: d.id, entry_id: k }] });
      }
    }
  }
  const sets = [...byTime.values()].sort((a, b) => a.ms - b.ms);
  const rows: VitalRow[] = [];
  let last: { row: VitalRow; ms: number; encId: string } | undefined;
  for (const s of sets) {
    const bp = isObj(s.e.bp) ? s.e.bp : undefined;
    const sys = bp ? num(bp.systolic_mmhg) : undefined;
    const dia = bp ? num(bp.diastolic_mmhg) : undefined;
    const hr = num(s.e.heart_rate_bpm);
    const wt = num(s.e.weight_kg);
    const onlyBp =
      sys !== undefined && hr === undefined && wt === undefined && num(s.e.resp_rate_per_min) === undefined &&
      num(s.e.temp_f) === undefined && num(s.e.spo2_pct) === undefined;
    if (
      onlyBp && last && last.encId === s.encId && s.ms - last.ms <= 60 * 60000 &&
      last.row.systolic_mmhg !== undefined && last.row.repeat_systolic_mmhg === undefined
    ) {
      last.row.repeat_systolic_mmhg = sys;
      if (dia !== undefined) last.row.repeat_diastolic_mmhg = dia;
      last.row.evidence.push(...s.ev);
      continue;
    }
    if (sys === undefined && hr === undefined && wt === undefined) continue;
    const row: VitalRow = { setting: "hospital", local_time: s.hm, evidence: s.ev };
    if (sys !== undefined && dia !== undefined) {
      row.systolic_mmhg = sys;
      row.diastolic_mmhg = dia;
    }
    if (hr !== undefined) row.pulse_bpm = hr;
    if (wt !== undefined) row.weight_kg = round(wt, 1);
    rows.push(row);
    last = { row, ms: s.ms, encId: s.encId };
  }
  return rows;
}

// ---------------------------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------------------------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string" || !RE_DATE.test(asOf)) return empty;
  const counting = selectCounting(items, asOf);
  const docs: Doc[] = [];
  for (const it of counting) {
    try {
      const d = buildDoc(it);
      if (d) docs.push(d);
    } catch {
      // skip unreadable item
    }
  }
  const safe = <T>(f: () => T[]): T[] => {
    try {
      return f();
    } catch {
      return [];
    }
  };
  const medications = safe(() => mapMedications(docs));
  const allergies = safe(() => mapAllergyList(docs));
  const problems = safe(() => mapProblems(docs, allergies));
  const labs = safe(() => mapLabs(docs));
  const vitals = safe(() => mapVitals(docs));
  return { medications, problems, allergies, labs, vitals };
}
