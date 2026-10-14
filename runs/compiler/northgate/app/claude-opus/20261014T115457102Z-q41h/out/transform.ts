import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  ProblemRow,
  AllergyIntoleranceRow,
  LabResultRow,
  VitalRow,
  Analyte,
  Evidence,
} from "../in/views/views";

// ───────────────────────────────────────────── time helpers ─────────────────────────────────────────────

const TZ = "America/Chicago";
let fmt: Intl.DateTimeFormat | null = null;
try {
  fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
} catch {
  fmt = null;
}

function pad(n: number, w = 2): string {
  return String(n).padStart(w, "0");
}

/** n-th (1-based) Sunday of a month (UTC day number), or last when n = -1. */
function sundayOf(year: number, month: number, n: number): number {
  if (n > 0) {
    const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    return 1 + ((7 - first) % 7) + (n - 1) * 7;
  }
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const dow = new Date(Date.UTC(year, month - 1, lastDay)).getUTCDay();
  return lastDay - dow;
}

/** Manual America/Chicago offset (hours) for a UTC instant; used only if Intl is unavailable. */
function chicagoOffsetHours(ms: number): number {
  const y = new Date(ms).getUTCFullYear();
  let start: number, end: number;
  if (y >= 2007) {
    start = Date.UTC(y, 2, sundayOf(y, 3, 2), 8); // 2:00 CST = 08:00 UTC
    end = Date.UTC(y, 10, sundayOf(y, 11, 1), 7); // 2:00 CDT = 07:00 UTC
  } else {
    start = Date.UTC(y, 3, sundayOf(y, 4, 1), 8);
    end = Date.UTC(y, 9, sundayOf(y, 10, -1), 7);
  }
  return ms >= start && ms < end ? -5 : -6;
}

/** Local wall-clock `YYYY-MM-DDTHH:MM` in Chicago for an instant, or null. */
function localDateTime(ms: number): string | null {
  if (!isFinite(ms)) return null;
  if (fmt) {
    try {
      const parts: Record<string, string> = {};
      for (const p of fmt.formatToParts(new Date(ms))) parts[p.type] = p.value;
      if (parts.year && parts.month && parts.day && parts.hour && parts.minute) {
        const hh = parts.hour === "24" ? "00" : parts.hour;
        return `${parts.year}-${parts.month}-${parts.day}T${hh}:${parts.minute}`;
      }
    } catch {
      /* fall through */
    }
  }
  const d = new Date(ms + chicagoOffsetHours(ms) * 3600000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(
    d.getUTCMinutes(),
  )}`;
}

const DATE_ONLY = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const HAS_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

/** Local date (or partial date, kept at its precision) of a FOLIO time string. */
function localDate(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (DATE_ONLY.test(t)) return t;
  if (!HAS_TIME.test(t)) return null;
  const ldt = localDateTime(Date.parse(t));
  return ldt ? ldt.slice(0, 10) : null;
}

/** Sortable instant for a FOLIO time string; date-only values are taken as local midnight. */
function sortKey(s: unknown): number {
  if (typeof s !== "string") return NaN;
  const t = s.trim();
  if (DATE_ONLY.test(t)) {
    const full = t.length === 4 ? `${t}-01-01` : t.length === 7 ? `${t}-01` : t;
    return Date.parse(`${full}T00:00:00-06:00`);
  }
  return Date.parse(t);
}

// ───────────────────────────────────────────── generic helpers ─────────────────────────────────────────────

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x : undefined;
}
function num(x: unknown): number | undefined {
  return typeof x === "number" && isFinite(x) ? x : undefined;
}
function clean(n: number): number {
  return parseFloat(n.toPrecision(12));
}

interface Ev {
  item: FolioItem;
  entryId: string;
  entry: Record<string, any>;
  t: number; // effective instant
  r: number; // recorded instant
}

function cmpEv(a: Ev, b: Ev): number {
  const ta = isNaN(a.t) ? -Infinity : a.t;
  const tb = isNaN(b.t) ? -Infinity : b.t;
  if (ta !== tb) return ta - tb;
  const ra = isNaN(a.r) ? -Infinity : a.r;
  const rb = isNaN(b.r) ? -Infinity : b.r;
  if (ra !== rb) return ra - rb;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : a.entryId < b.entryId ? -1 : a.entryId > b.entryId ? 1 : 0;
}

function fuzzy(x: unknown): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!isObj(x)) return undefined;
  const d = str(x.date);
  if (!d) return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(d);
  if (!m) return undefined;
  const p = x.precision;
  if (p === "year") return { value: m[1], precision: "year" };
  if (p === "month" && m[2]) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  if (p === "day" && m[2] && m[3]) return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
  // unknown precision: keep only what the string itself carries
  if (m[3]) return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
  if (m[2]) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  return { value: m[1], precision: "year" };
}

// ───────────────────────────────────────────── scope & corrections ─────────────────────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope: FolioItem[] = [];
  for (const it of Array.isArray(items) ? items : []) {
    if (!isObj(it) || typeof it.id !== "string") continue;
    const rd = localDate(it.recorded);
    if (!rd || rd.length !== 10 || rd > asOf) continue;
    inScope.push(it);
  }
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const key of ["supersedes", "retracts"] as const) {
      const list = (it as any)[key];
      if (!Array.isArray(list)) continue;
      for (const id of list) if (typeof id === "string") dead.add(`${it.issuer}|${id}`);
    }
    // chart_correction entries restate the envelope's retracts; honour them too
    const payload = isObj(it.payload) ? it.payload : {};
    for (const e of Object.values(payload)) {
      if (isObj(e) && e.type === "chart_correction" && Array.isArray(e.voided_items)) {
        for (const id of e.voided_items) if (typeof id === "string") dead.add(`${it.issuer}|${id}`);
      }
    }
  }
  return inScope.filter((it) => !dead.has(`${it.issuer}|${it.id}`));
}

function collect(items: FolioItem[]): Map<string, Ev[]> {
  const byType = new Map<string, Ev[]>();
  for (const item of items) {
    const payload = isObj(item.payload) ? item.payload : {};
    const t = sortKey(item.effective);
    const r = sortKey(item.recorded);
    for (const [entryId, entry] of Object.entries(payload)) {
      if (!isObj(entry) || typeof entry.type !== "string") continue;
      const list = byType.get(entry.type) ?? [];
      list.push({ item, entryId, entry, t, r });
      byType.set(entry.type, list);
    }
  }
  return byType;
}

function groupBy(evs: Ev[], key: string): Map<string, Ev[]> {
  const m = new Map<string, Ev[]>();
  for (const e of evs) {
    const k = str(e.entry[key]);
    if (!k) continue;
    const l = m.get(k) ?? [];
    l.push(e);
    m.set(k, l);
  }
  for (const l of m.values()) l.sort(cmpEv);
  return m;
}

function evidenceOf(evs: Ev[]): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const e of evs) {
    const k = `${e.item.id}|${e.entryId}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: e.item.id, entry_id: e.entryId });
  }
  return out;
}

// ───────────────────────────────────────────── medications ─────────────────────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  steglatro: "ertugliflozin",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  semglee: "insulin glargine",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  humalog: "insulin lispro",
  admelog: "insulin lispro",
  lyumjev: "insulin lispro",
  novolog: "insulin aspart",
  fiasp: "insulin aspart",
  apidra: "insulin glulisine",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  trulicity: "dulaglutide",
  victoza: "liraglutide",
  mounjaro: "tirzepatide",
  byetta: "exenatide",
  januvia: "sitagliptin",
  tradjenta: "linagliptin",
  glucophage: "metformin",
  glucotrol: "glipizide",
  amaryl: "glimepiride",
  actos: "pioglitazone",
  kerendia: "finerenone",
  entresto: "sacubitril / valsartan",
  cozaar: "losartan",
  diovan: "valsartan",
  benicar: "olmesartan",
  avapro: "irbesartan",
  micardis: "telmisartan",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  vasotec: "enalapril",
  altace: "ramipril",
  lotensin: "benazepril",
  norvasc: "amlodipine",
  coreg: "carvedilol",
  toprol: "metoprolol",
  lopressor: "metoprolol",
  tenormin: "atenolol",
  lasix: "furosemide",
  bumex: "bumetanide",
  demadex: "torsemide",
  aldactone: "spironolactone",
  microzide: "hydrochlorothiazide",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  zocor: "simvastatin",
  pravachol: "pravastatin",
  zetia: "ezetimibe",
  synthroid: "levothyroxine",
  levoxyl: "levothyroxine",
  eliquis: "apixaban",
  xarelto: "rivaroxaban",
  coumadin: "warfarin",
  plavix: "clopidogrel",
  zyloprim: "allopurinol",
  uloric: "febuxostat",
  prilosec: "omeprazole",
  protonix: "pantoprazole",
  nexium: "esomeprazole",
  zoloft: "sertraline",
  lexapro: "escitalopram",
  celexa: "citalopram",
  prozac: "fluoxetine",
  paxil: "paroxetine",
  wellbutrin: "bupropion",
  effexor: "venlafaxine",
  cymbalta: "duloxetine",
  remeron: "mirtazapine",
  buspar: "buspirone",
  desyrel: "trazodone",
  neurontin: "gabapentin",
  lyrica: "pregabalin",
  flomax: "tamsulosin",
  veltassa: "patiromer",
  lokelma: "sodium zirconium cyclosilicate",
  tylenol: "acetaminophen",
  advil: "ibuprofen",
  motrin: "ibuprofen",
  aleve: "naproxen",
};

const SALT_WORDS = new Set([
  "potassium", "sodium", "calcium", "magnesium", "hydrochloride", "hcl", "dihydrochloride", "hydrobromide",
  "succinate", "tartrate", "besylate", "maleate", "mesylate", "fumarate", "citrate", "acetate", "sulfate",
  "phosphate", "bromide", "chloride", "monohydrate", "dihydrate", "trihydrate", "anhydrous", "propanediol",
  "dipropionate", "propionate", "furoate", "bitartrate", "hyclate", "er", "xr", "sr", "xl", "cr", "dr", "la",
]);
// salts that are the drug itself when they stand alone
const SALT_KEEP_ALONE = /^(potassium chloride|sodium bicarbonate|calcium carbonate|magnesium oxide|sodium chloride|calcium acetate|sodium zirconium cyclosilicate)$/;

function ingredientFrom(name: string): string | undefined {
  const lower = name.toLowerCase().trim();
  if (!lower) return undefined;
  // SBD style: "... [Brand]"
  const bracket = /\[([^\]]+)\]\s*$/.exec(lower);
  const body = lower.replace(/\[[^\]]*\]/g, " ").trim();
  // Combination products: "a 5 MG / b 500 MG Oral Tablet"
  const parts = body.split(/\s+\/\s+|\s*\/\s*(?=[a-z])/);
  const ings: string[] = [];
  for (const part of parts) {
    const words = part.split(/[\s,]+/).filter(Boolean);
    const lead: string[] = [];
    for (const w of words) {
      if (/^[\d.]/.test(w)) break;
      if (/^(oral|tablet|tablets|tab|capsule|capsules|cap|injectable|injection|solution|suspension|pen|prefilled|extended|delayed|release|topical|cream|ointment|patch|inhaler|spray|nasal|ophthalmic|chewable|sublingual|mg|mcg|ml|units?|unt|daily|po)$/.test(w))
        break;
      lead.push(w.replace(/[()]/g, ""));
    }
    let phrase = lead.join(" ").trim();
    if (!phrase) continue;
    const firstWord = phrase.split(" ")[0];
    if (BRANDS[firstWord] && !phrase.startsWith("insulin")) {
      ings.push(BRANDS[firstWord]);
      continue;
    }
    if (BRANDS[phrase]) {
      ings.push(BRANDS[phrase]);
      continue;
    }
    if (!SALT_KEEP_ALONE.test(phrase)) {
      const ws = phrase.split(" ");
      const kept = ws.filter((w, i) => i === 0 || !SALT_WORDS.has(w));
      phrase = kept.join(" ");
    }
    if (phrase) ings.push(phrase);
  }
  if (ings.length === 0 && bracket) {
    const b = bracket[1].trim().split(/\s+/)[0];
    if (BRANDS[b]) return BRANDS[b];
  }
  if (ings.length === 0) return undefined;
  return ings.join(" / ");
}

function doseOf(d: unknown): MedicationRow["dose"] | undefined {
  if (!isObj(d)) return undefined;
  const v = num(d.value);
  const u = str(d.unit)?.trim().toLowerCase();
  if (v === undefined || !u) return undefined;
  const map: Record<string, "mg" | "mcg" | "units" | "mL" | "tablet"> = {
    mg: "mg",
    mcg: "mcg",
    ug: "mcg",
    "µg": "mcg",
    units: "units",
    unit: "units",
    unt: "units",
    u: "units",
    "[iu]": "units",
    iu: "units",
    ml: "mL",
    tab: "tablet",
    tabs: "tablet",
    tablet: "tablet",
    tablets: "tablet",
  };
  const unit = map[u];
  return unit ? { value: v, unit } : undefined;
}

function freqOf(f: unknown, sig: string | undefined): MedicationRow["frequency"] | undefined {
  switch (f) {
    case "QD":
    case "BID":
    case "TID":
    case "QHS":
    case "PRN":
      return f;
    case "OTHER":
      if (sig && /\b(once (a |per |every )?week(ly)?|every week|weekly|q\s?week|qw)\b/i.test(sig)) return "QW";
      return "other";
    default:
      return undefined;
  }
}

function isHospitalOnly(e: Record<string, any>): boolean {
  const text = `${str(e.drug?.name) ?? ""} ${str(e.sig) ?? ""}`;
  return /\b(intravenous|infusion|ivpb|iv piggyback|iv push|inpatient only)\b|\bIV\b/i.test(text);
}

function mapMedications(byType: Map<string, Ev[]>): MedicationRow[] {
  const lines = groupBy(byType.get("med_event") ?? [], "med_id");
  const candidates: { key: string; last: Ev; row: MedicationRow }[] = [];
  for (const [medId, evs] of lines) {
    const valid = evs.filter((e) => ["start", "change", "hold", "resume", "stop"].includes(e.entry.action));
    if (valid.length === 0) continue;
    const last = valid[valid.length - 1];
    const e = last.entry;
    const name = str(e.drug?.name);
    if (!name) continue;
    if (isHospitalOnly(e)) continue;
    let status: MedicationRow["status"];
    let since: string | undefined;
    if (e.action === "hold") {
      status = "held";
      since = localDate(last.item.effective) ?? undefined;
    } else if (e.action === "stop") {
      status = "stopped";
      since = localDate(last.item.effective) ?? undefined;
    } else {
      status = "active";
      for (let i = valid.length - 1; i >= 0; i--) {
        const a = valid[i].entry.action;
        if (a === "start" || a === "resume") {
          since = localDate(valid[i].item.effective) ?? undefined;
          break;
        }
      }
    }
    const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: evidenceOf(valid) };
    const ing = ingredientFrom(name);
    if (ing) row.ingredient = ing;
    if (since) row.status_since = since;
    const dose = doseOf(e.dose);
    if (dose) row.dose = dose;
    const freq = freqOf(e.frequency, str(e.sig));
    if (freq) row.frequency = freq;
    if (status === "stopped") {
      const sr = e.stop_reason;
      if (["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(sr))
        row.stop_reason = sr;
    }
    if (status === "held" || status === "stopped") {
      const rt = str(e.reason_text);
      if (rt) row.status_reason_text = rt;
    }
    candidates.push({ key: ing ? `ing:${ing}` : `line:${medId}`, last, row });
  }
  const best = new Map<string, { last: Ev; row: MedicationRow }>();
  for (const c of candidates) {
    const prev = best.get(c.key);
    if (!prev || cmpEv(prev.last, c.last) < 0) best.set(c.key, c);
  }
  return [...best.values()].sort((a, b) => cmpEv(a.last, b.last)).map((x) => x.row);
}

// ───────────────────────────────────────────── problems ─────────────────────────────────────────────

function ckdStage(desc: string, icd: string | undefined): ProblemRow["ckd_stage"] | undefined {
  const d = desc.toLowerCase();
  const m = /\b(?:stage|g)\s*(1|2|3a|3b|4|5)\b/.exec(d) ?? /\bckd\s*(1|2|3a|3b|4|5)\b/.exec(d);
  if (m) {
    const s = m[1];
    return s === "3a" ? "G3a" : s === "3b" ? "G3b" : (`G${s}` as ProblemRow["ckd_stage"]);
  }
  if (/end[- ]stage renal|esrd|eskd|end[- ]stage kidney/.test(d)) return "G5";
  const c = (icd ?? "").toUpperCase();
  const codeMap: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1",
    "N18.2": "G2",
    "N18.31": "G3a",
    "N18.32": "G3b",
    "N18.4": "G4",
    "N18.5": "G5",
    "N18.6": "G5",
  };
  return codeMap[c];
}

function albuminuria(desc: string): ProblemRow["albuminuria"] | undefined {
  const d = desc.toLowerCase();
  const m = /\ba\s*([123])\b/.exec(d);
  if (m && /albumin|g\s*(1|2|3a|3b|4|5)\s*\/?\s*a\s*[123]|\/\s*a\s*[123]|stage|ckd|kidney/.test(d)) return `A${m[1]}` as "A1" | "A2" | "A3";
  if (/severely increased albuminuria|macroalbuminuria/.test(d)) return "A3";
  if (/moderately increased albuminuria|microalbuminuria/.test(d)) return "A2";
  if (/normal to mildly increased albuminuria/.test(d)) return "A1";
  return undefined;
}

function isCkd(desc: string, icd: string | undefined): boolean {
  return /^N18(\.|$)/i.test(icd ?? "") || /chronic kidney disease|\bckd\b/i.test(desc);
}

/** ICD-10-CM adverse-effect-of-drug codes (T36–T50 with 6th character 5, and T88.7). */
function isAdverseEffectCode(icd: string | undefined): boolean {
  if (!icd) return false;
  return /^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/i.test(icd) || /^T88\.7/i.test(icd);
}

function mapProblems(byType: Map<string, Ev[]>): ProblemRow[] {
  const lines = groupBy(byType.get("problem_event") ?? [], "problem_id");
  const candidates: { key: string; last: Ev; row: ProblemRow }[] = [];
  for (const [pid, evs] of lines) {
    const valid = evs.filter((e) => ["add", "update", "resolve", "remove"].includes(e.entry.action));
    if (valid.length === 0) continue;
    let status: "active" | "resolved" | "removed" = "active";
    for (const e of valid) {
      if (e.entry.action === "add") status = "active";
      else if (e.entry.action === "resolve") status = "resolved";
      else if (e.entry.action === "remove") status = "removed";
    }
    if (status === "removed") continue;
    const last = valid[valid.length - 1];
    const e = last.entry;
    let desc: string | undefined;
    let icd: string | undefined;
    let snomed: string | undefined;
    let onset: ProblemRow["onset"];
    for (let i = valid.length - 1; i >= 0; i--) {
      const x = valid[i].entry;
      desc ??= str(x.description);
      icd ??= str(x.icd10cm);
      snomed ??= str(x.snomed);
      onset ??= fuzzy(x.onset);
    }
    desc = str(e.description) ?? desc;
    if (!desc) continue;
    if (isAdverseEffectCode(icd)) continue;
    const row: ProblemRow = { condition: desc, status, evidence: evidenceOf(valid) };
    if (icd) row.icd10cm = icd;
    if (snomed) row.snomed = snomed;
    if (onset) row.onset = onset;
    if (isCkd(desc, icd)) {
      const st = ckdStage(desc, icd);
      if (st) row.ckd_stage = st;
      const al = albuminuria(desc);
      if (al) row.albuminuria = al;
    }
    candidates.push({ key: icd ? `icd:${icd.toUpperCase()}` : `desc:${desc.toLowerCase()}|${pid}`, last, row });
  }
  const best = new Map<string, { last: Ev; row: ProblemRow }>();
  for (const c of candidates) {
    const prev = best.get(c.key);
    if (!prev || cmpEv(prev.last, c.last) < 0) best.set(c.key, c);
  }
  return [...best.values()].sort((a, b) => cmpEv(a.last, b.last)).map((x) => x.row);
}

// ───────────────────────────────────────────── allergies ─────────────────────────────────────────────

function mapAllergies(byType: Map<string, Ev[]>): AllergyIntoleranceRow[] {
  const lines = groupBy(byType.get("allergy_event") ?? [], "allergy_id");
  const out: { last: Ev; row: AllergyIntoleranceRow }[] = [];
  for (const evs of lines.values()) {
    const valid = evs.filter((e) => ["add", "update", "inactivate"].includes(e.entry.action));
    if (valid.length === 0) continue;
    const last = valid[valid.length - 1];
    if (last.entry.action === "inactivate") continue;
    const e = last.entry;
    const name = str(e.substance?.name);
    if (!name) continue;
    const rx = str(e.substance?.rxnorm);
    const type: AllergyIntoleranceRow["type"] =
      e.reaction_type === "allergy" || e.reaction_type === "intolerance" || e.reaction_type === "adverse_reaction"
        ? e.reaction_type
        : "allergy";
    if (!["allergy", "intolerance", "adverse_reaction"].includes(e.reaction_type)) {
      // unexpected kind; skip rather than guess
      continue;
    }
    const criticality: AllergyIntoleranceRow["criticality"] =
      e.severity === "low" || e.severity === "high" ? e.severity : "unknown";
    const row: AllergyIntoleranceRow = {
      substance: rx ? name.trim().toLowerCase() : name.trim(),
      type,
      criticality,
      evidence: evidenceOf(valid),
    };
    if (rx) row.rxnorm_ingredient = rx;
    const reactions = Array.isArray(e.reactions) ? e.reactions.filter((r: unknown) => typeof r === "string" && r.trim()) : [];
    if (reactions.length) row.reaction = reactions.join("; ");
    let onset: AllergyIntoleranceRow["onset"];
    for (let i = valid.length - 1; i >= 0 && !onset; i--) onset = fuzzy(valid[i].entry.onset);
    if (onset) row.onset = onset;
    out.push({ last, row });
  }
  return out.sort((a, b) => cmpEv(a.last, b.last)).map((x) => x.row);
}

// ───────────────────────────────────────────── labs ─────────────────────────────────────────────

const LOINC_MAP: Record<string, Analyte> = {
  "2160-0": "creatinine",
  "38483-4": "creatinine",
  "33914-3": "egfr",
  "48642-3": "egfr",
  "48643-1": "egfr",
  "62238-1": "egfr",
  "98979-8": "egfr",
  "50044-7": "egfr",
  "88293-6": "egfr",
  "88294-4": "egfr",
  "69405-9": "egfr",
  "2823-3": "potassium",
  "6298-4": "potassium",
  "2951-2": "sodium",
  "2947-0": "sodium",
  "2075-0": "chloride",
  "2069-3": "chloride",
  "2028-9": "bicarbonate",
  "1963-8": "bicarbonate",
  "33037-3": "anion_gap",
  "41276-7": "anion_gap",
  "10466-1": "anion_gap",
  "3094-0": "bun",
  "6299-2": "bun",
  "2345-7": "glucose",
  "2339-0": "glucose",
  "4548-4": "a1c",
  "17856-6": "a1c",
  "9318-7": "uacr",
  "14959-1": "uacr",
  "32294-1": "uacr",
  "777-3": "platelets",
  "26515-7": "platelets",
  "6690-2": "wbc",
  "26464-8": "wbc",
  "718-7": "hemoglobin",
  "53060-9": "bhb",
  "2744-1": "ph",
  "11558-4": "ph",
  "2019-8": "pco2",
  "2021-4": "pco2",
  "11557-6": "pco2",
  "3040-3": "lipase",
  "10839-9": "troponin",
  "42757-5": "troponin",
  "89579-7": "troponin",
  "2093-3": "cholesterol",
  "2571-8": "triglycerides",
  "2085-9": "hdl",
  "13457-7": "ldl",
  "18262-6": "ldl",
  "2089-1": "ldl",
};

const CODE_MAP: Record<string, Analyte> = {
  CREAT: "creatinine",
  CR: "creatinine",
  K: "potassium",
  NA: "sodium",
  CL: "chloride",
  CO2: "bicarbonate",
  HCO3: "bicarbonate",
  TCO2: "bicarbonate",
  AGAP: "anion_gap",
  AG: "anion_gap",
  ANIONGAP: "anion_gap",
  BUN: "bun",
  GLU: "glucose",
  GLUC: "glucose",
  A1C: "a1c",
  HBA1C: "a1c",
  UACR: "uacr",
  ACR: "uacr",
  MALBCR: "uacr",
  PLT: "platelets",
  WBC: "wbc",
  HGB: "hemoglobin",
  HB: "hemoglobin",
  BHB: "bhb",
  PH: "ph",
  PCO2: "pco2",
  LIPASE: "lipase",
  LIP: "lipase",
  TROP: "troponin",
  TNI: "troponin",
  TROPI: "troponin",
  CHOL: "cholesterol",
  TRIG: "triglycerides",
  TG: "triglycerides",
  HDL: "hdl",
  LDL: "ldl",
  LDLC: "ldl",
};

function analyteOf(test: Record<string, any>, resultCode: string): Analyte | undefined {
  const name = (str(test.name) ?? "").toLowerCase();
  const code = (str(test.nfm_code) ?? "").toUpperCase();
  const all = `${name} ${code.toLowerCase()} ${resultCode.toLowerCase()}`;
  // Never treat urine/point-of-care/meter components as serum analytes (UACR is handled first).
  if (/egfr|glomerular/.test(all) || /^EGFR/.test(code)) return "egfr";
  if (/albumin\s*\/\s*creat|albumin-to-creatinine|albumin creatinine ratio|\buacr\b|microalb.*creat/.test(all)) return "uacr";
  const urine = /\burine\b|\bur\b|\burn\b|\bu-/.test(name);
  const poc = /\bpoc\b|point[- ]of[- ]care|meter|fingerstick|capillary/.test(name);
  const loinc = str(test.loinc);
  let a: Analyte | undefined;
  if (loinc && LOINC_MAP[loinc]) a = LOINC_MAP[loinc];
  if (!a) a = CODE_MAP[code.replace(/[^A-Z0-9]/g, "")];
  if (!a) {
    if (/creatinine/.test(name)) a = "creatinine";
    else if (/potassium/.test(name)) a = "potassium";
    else if (/sodium/.test(name)) a = "sodium";
    else if (/chloride/.test(name)) a = "chloride";
    else if (/anion gap/.test(name)) a = "anion_gap";
    else if (/bicarbonate|\bco2\b|carbon dioxide/.test(name) && !/pco2|partial/.test(name)) a = "bicarbonate";
    else if (/urea nitrogen|\bbun\b/.test(name)) a = "bun";
    else if (/a1c|glycated h|glycohemoglobin/.test(name)) a = "a1c";
    else if (/glucose/.test(name)) a = "glucose";
    else if (/platelet/.test(name)) a = "platelets";
    else if (/white blood|\bwbc\b|leukocyte/.test(name)) a = "wbc";
    else if (/hemoglobin|\bhgb\b/.test(name)) a = "hemoglobin";
    else if (/hydroxybutyr|\bbhb\b/.test(name)) a = "bhb";
    else if (/\bpco2\b|partial pressure.*co2|carbon dioxide.*partial/.test(name)) a = "pco2";
    else if (/\bph\b/.test(name)) a = "ph";
    else if (/lipase/.test(name)) a = "lipase";
    else if (/troponin/.test(name) && !/troponin t\b/.test(name)) a = "troponin";
    else if (/\bhdl\b/.test(name)) a = "hdl";
    else if (/\bldl\b/.test(name)) a = "ldl";
    else if (/triglyceride/.test(name)) a = "triglycerides";
    else if (/cholesterol/.test(name) && !/non[- ]hdl|vldl/.test(name)) a = "cholesterol";
  }
  if (!a) return undefined;
  if (urine && a !== "uacr") return undefined;
  if (poc && a === "glucose") return undefined;
  if (a === "troponin" && /troponin t\b/.test(name)) return undefined;
  if (a === "cholesterol" && /non[- ]hdl|vldl/.test(name)) return undefined;
  return a;
}

const UNIT_OF: Record<Analyte, string> = {
  creatinine: "mg/dL",
  egfr: "mL/min/1.73m2",
  potassium: "mmol/L",
  sodium: "mmol/L",
  chloride: "mmol/L",
  bicarbonate: "mmol/L",
  anion_gap: "mmol/L",
  bun: "mg/dL",
  glucose: "mg/dL",
  a1c: "%",
  uacr: "mg/g",
  platelets: "10*3/uL",
  wbc: "10*3/uL",
  hemoglobin: "g/dL",
  bhb: "mmol/L",
  ph: "[pH]",
  pco2: "mmHg",
  lipase: "U/L",
  troponin: "ng/mL",
  cholesterol: "mg/dL",
  triglycerides: "mg/dL",
  hdl: "mg/dL",
  ldl: "mg/dL",
};

function normUnit(u: string): string {
  return u.toLowerCase().replace(/\s+/g, "").replace(/µ|μ/g, "u");
}

/** Factor that converts the filed unit into the consumer unit, or null when the unit is not recognised. */
function unitFactor(a: Analyte, unitRaw: string): number | null {
  const u = normUnit(unitRaw);
  switch (a) {
    case "creatinine":
    case "bun":
    case "cholesterol":
    case "triglycerides":
    case "hdl":
    case "ldl":
      if (u === "mg/dl") return 1;
      return null;
    case "glucose":
      if (u === "mg/dl") return 1;
      return null;
    case "egfr":
      if (/^ml\/min(\/1\.73m(2|\^2|²)|\/1\.73sq\.?m|\/1\.73)?$/.test(u)) return 1;
      return null;
    case "potassium":
    case "sodium":
    case "chloride":
    case "bicarbonate":
    case "anion_gap":
    case "bhb":
      if (u === "mmol/l" || u === "meq/l") return 1;
      return null;
    case "a1c":
      if (u === "%" || u === "%ofhgb" || u === "%hba1c" || u === "%(ngsp)") return 1;
      return null;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "mg/gcr" || u === "ug/mgcreat" || u === "ug/mg" || u === "mcg/mgcreat" || u === "mcg/mg") return 1;
      return null;
    case "platelets":
    case "wbc":
      if (u === "cells/ul" || u === "/ul" || u === "cells/mm3" || u === "/mm3") return 1 / 1000;
      if (u === "k/ul" || u === "10*3/ul" || u === "x10e3/ul" || u === "10^3/ul" || u === "thou/ul" || u === "x10^3/ul" || u === "10*9/l" || u === "x10e9/l" || u === "10^9/l")
        return 1;
      return null;
    case "hemoglobin":
      if (u === "g/dl") return 1;
      if (u === "g/l") return 0.1;
      return null;
    case "ph":
      if (u === "" || u === "[ph]" || u === "ph" || u === "units") return 1;
      return null;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return 1;
      return null;
    case "lipase":
      if (u === "u/l" || u === "iu/l") return 1;
      return null;
    case "troponin":
      if (u === "ng/ml") return 1;
      if (u === "ng/l" || u === "pg/ml") return 0.001;
      return null;
  }
  return null;
}

function parseValue(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | null {
  if (typeof v === "number" && isFinite(v)) return { value: v };
  if (typeof v !== "string") return null;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(v);
  if (!m) return null;
  const value = parseFloat(m[2]);
  if (!isFinite(value)) return null;
  const c = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as LabResultRow["comparator"] | undefined);
  return c ? { value, comparator: c } : { value };
}

function egfrEquation(test: Record<string, any>, comment: string, resultCode: string): LabResultRow["egfr_equation"] {
  const find = (s: string): LabResultRow["egfr_equation"] | undefined => {
    const t = s.toLowerCase();
    const hits: [number, LabResultRow["egfr_equation"]][] = [];
    const add = (re: RegExp, eq: LabResultRow["egfr_equation"]) => {
      const m = re.exec(t);
      if (m) hits.push([m.index, eq]);
    };
    add(/ckd[- ]?epi[^.;]*?2021|2021[^.;]*?ckd[- ]?epi|race[- ]free/, "ckd-epi-2021");
    add(/ckd[- ]?epi[^.;]*?2009|2009[^.;]*?ckd[- ]?epi/, "ckd-epi-2009");
    add(/\bmdrd\b/, "mdrd");
    if (!hits.length) return undefined;
    hits.sort((a, b) => a[0] - b[0]);
    return hits[0][1];
  };
  return (
    find(comment) ??
    find(str(test.name) ?? "") ??
    (() => {
      const rc = resultCode.toUpperCase();
      if (/EGFR21|EGFR-?2021|CKDEPI21/.test(rc)) return "ckd-epi-2021" as const;
      if (/EGFR09|EGFR-?2009|CKDEPI09/.test(rc)) return "ckd-epi-2009" as const;
      if (/MDRD/.test(rc)) return "mdrd" as const;
      return undefined;
    })() ??
    "unknown"
  );
}

/** 'race' when the component is the race-coefficient variant, 'nonrace' when it is the explicit non-race variant. */
function egfrRaceVariant(test: Record<string, any>, comment: string, resultCode: string): "race" | "nonrace" | "none" {
  const text = `${str(test.name) ?? ""} ${comment}`.toLowerCase();
  const code = (str(test.nfm_code) ?? "").toUpperCase();
  const rc = resultCode.toUpperCase();
  if (/non[- ]?(african|black)|not african|\bnon[- ]?aa\b/.test(text) || /(^|-)NAA$/.test(code) || /EGFR\d*N$/.test(rc))
    return "nonrace";
  if (/african[- ]american|\bblack\b|\baa\b/.test(text) || /(^|-)AA$/.test(code) || /EGFR\d*A$/.test(rc)) return "race";
  return "none";
}

const STATUS_RANK: Record<string, number> = { P: 1, F: 2, C: 3 };

function mapLabs(byType: Map<string, Ev[]>): LabResultRow[] {
  const evs = byType.get("imported_result") ?? [];
  // One copy per accession + component: the most advanced status, then the latest filed.
  const groups = new Map<string, Ev>();
  for (const ev of evs) {
    const e = ev.entry;
    if (!isObj(e.test)) continue;
    const acc = str(e.external_ref?.accession) ?? `item:${ev.item.id}`;
    const comp = `${str(e.test.nfm_code) ?? ""}|${str(e.external_ref?.result_code) ?? ""}|${str(e.test.name) ?? ""}`;
    const key = `${acc}|${comp}`;
    const prev = groups.get(key);
    if (!prev) {
      groups.set(key, ev);
      continue;
    }
    const rp = STATUS_RANK[prev.entry.result_status] ?? 0;
    const rn = STATUS_RANK[e.result_status] ?? 0;
    if (rn > rp || (rn === rp && (ev.r > prev.r || (ev.r === prev.r && ev.item.id > prev.item.id)))) groups.set(key, ev);
  }

  type Cand = { ev: Ev; row: LabResultRow; acc: string; race: "race" | "nonrace" | "none" };
  const cands: Cand[] = [];
  for (const ev of groups.values()) {
    const e = ev.entry;
    const status = e.result_status;
    if (status !== "P" && status !== "F" && status !== "C") continue;
    const resultCode = str(e.external_ref?.result_code) ?? "";
    const analyte = analyteOf(e.test, resultCode);
    if (!analyte) continue;
    const pv = parseValue(e.value);
    if (!pv) continue;
    const factor = unitFactor(analyte, typeof e.unit === "string" ? e.unit : "");
    if (factor === null) continue;
    const collected = str(e.collected) ?? str(ev.item.effective);
    if (!collected) continue;
    const comment = str(e.comment) ?? "";
    const row: LabResultRow = {
      analyte,
      value: clean(pv.value * factor),
      unit: UNIT_OF[analyte],
      collected,
      status: status === "P" ? "preliminary" : "final",
      evidence: [{ item_id: ev.item.id, entry_id: ev.entryId }],
    };
    if (pv.comparator) row.comparator = pv.comparator;
    if (analyte === "egfr") row.egfr_equation = egfrEquation(e.test, comment, resultCode);
    const loinc = str(e.test.loinc);
    if (loinc) row.loinc = loinc;
    const acc = str(e.external_ref?.accession) ?? `item:${ev.item.id}`;
    cands.push({
      ev,
      row,
      acc,
      race: analyte === "egfr" ? egfrRaceVariant(e.test, comment, resultCode) : "none",
    });
  }
  // eGFR: drop the race-coefficient variant when the same specimen has a race-free variant of that calculation.
  const out = cands.filter((c) => {
    if (c.row.analyte !== "egfr" || c.race !== "race") return true;
    return !cands.some(
      (o) =>
        o !== c &&
        o.row.analyte === "egfr" &&
        o.acc === c.acc &&
        o.race !== "race" &&
        (o.row.egfr_equation === c.row.egfr_equation || o.row.egfr_equation === "unknown" || c.row.egfr_equation === "unknown"),
    );
  });
  out.sort((a, b) => {
    const ta = sortKey(a.row.collected);
    const tb = sortKey(b.row.collected);
    if (ta !== tb) return (isNaN(ta) ? 0 : ta) - (isNaN(tb) ? 0 : tb);
    return cmpEv(a.ev, b.ev);
  });
  return out.map((c) => c.row);
}

// ───────────────────────────────────────────── vitals ─────────────────────────────────────────────

function parseBp(s: unknown): [number, number] | null {
  if (typeof s !== "string") return null;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(s);
  if (!m) return null;
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

function mapVitals(byType: Map<string, Ev[]>): VitalRow[] {
  const evs = [...(byType.get("vital_set") ?? [])].sort(cmpEv);
  const out: VitalRow[] = [];
  for (const ev of evs) {
    const e = ev.entry;
    const eff = typeof ev.item.effective === "string" ? ev.item.effective : "";
    const t = HAS_TIME.test(eff) ? Date.parse(eff) : Date.parse(String(ev.item.recorded));
    const local = localDateTime(t);
    if (!local) continue;
    const row: VitalRow = { setting: "clinic", local_time: local, evidence: [{ item_id: ev.item.id, entry_id: ev.entryId }] };
    let any = false;
    const bp = parseBp(e.bp);
    if (bp) {
      row.systolic_mmhg = bp[0];
      row.diastolic_mmhg = bp[1];
      any = true;
    }
    const rep = parseBp(e.bp_repeat);
    if (rep) {
      row.repeat_systolic_mmhg = rep[0];
      row.repeat_diastolic_mmhg = rep[1];
      any = true;
    }
    const pulse = num(e.pulse_bpm);
    if (pulse !== undefined) {
      row.pulse_bpm = pulse;
      any = true;
    }
    const wt = num(e.weight_lb);
    if (wt !== undefined && wt > 0) {
      row.weight_kg = Math.round(wt * 0.45359237 * 10) / 10;
      any = true;
    }
    if (any) out.push(row);
  }
  return out;
}

// ───────────────────────────────────────────── entry point ─────────────────────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return empty;
  let byType: Map<string, Ev[]>;
  try {
    byType = collect(currentItems(items, asOf));
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
  return {
    medications: safe(() => mapMedications(byType)),
    problems: safe(() => mapProblems(byType)),
    allergies: safe(() => mapAllergies(byType)),
    labs: safe(() => mapLabs(byType)),
    vitals: safe(() => mapVitals(byType)),
  };
}
