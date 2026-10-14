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
  PartialDate,
} from "../in/views/views";

// Mapper for Riverside Regional (riverside-doc-v1) document items -> consumer views.
//
// Each Riverside item is one clinical document (ED note, H&P, progress note, consult, discharge
// summary) whose payload restates the encounter, diagnoses, history, allergies, home medication list,
// inpatient orders, vitals and lab results as of that document.

const TZ = "America/Chicago";

// ───────────────────────────── generic helpers ─────────────────────────────

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x : undefined;
}
function hasOffset(s: string): boolean {
  return /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i.test(s.trim());
}

const dtf = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function localParts(ms: number): { y: string; mo: string; d: string; h: string; mi: string; s: string } | undefined {
  try {
    const parts = dtf.formatToParts(new Date(ms));
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    let h = get("hour");
    if (h === "24") h = "00";
    return { y: get("year"), mo: get("month"), d: get("day"), h, mi: get("minute"), s: get("second") };
  } catch {
    return undefined;
  }
}

/** Instant (ms) for a date-time; no-offset wall clock times are America/Chicago; dates are local midnight. */
function toInstant(s: unknown): number | undefined {
  const v = str(s);
  if (!v) return undefined;
  const t = v.trim();
  if (hasOffset(t)) {
    const ms = Date.parse(t);
    return isNaN(ms) ? undefined : ms;
  }
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?)?)?$/.exec(t);
  if (!m) return undefined;
  const asUtc = Date.UTC(+m[1], m[2] ? +m[2] - 1 : 0, m[3] ? +m[3] : 1, m[4] ? +m[4] : 0, m[5] ? +m[5] : 0, m[6] ? +m[6] : 0);
  // Find the Chicago offset at that wall time.
  let guess = asUtc + 6 * 3600000;
  for (let i = 0; i < 2; i++) {
    const p = localParts(guess);
    if (!p) return guess;
    const wall = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +p.mi, +p.s);
    guess += asUtc - wall;
  }
  return guess;
}

/** Local (Chicago) date of a date-time; partial dates are returned as written. */
function localDate(s: unknown): PartialDate | undefined {
  const v = str(s);
  if (!v) return undefined;
  const t = v.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  if (!hasOffset(t)) {
    const m = /^(\d{4}-\d{2}-\d{2})[T ]/.exec(t);
    return m ? m[1] : undefined;
  }
  const ms = Date.parse(t);
  if (isNaN(ms)) return undefined;
  const p = localParts(ms);
  return p ? `${p.y}-${p.mo}-${p.d}` : undefined;
}

/** Local wall-clock `YYYY-MM-DDTHH:MM`. */
function localTime(s: unknown): string | undefined {
  const v = str(s);
  if (!v) return undefined;
  const t = v.trim();
  if (!hasOffset(t)) {
    const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(t);
    return m ? `${m[1]}T${m[2]}` : undefined;
  }
  const ms = Date.parse(t);
  if (isNaN(ms)) return undefined;
  const p = localParts(ms);
  return p ? `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}` : undefined;
}

function precisionOf(d: string): "year" | "month" | "day" {
  return d.length === 4 ? "year" : d.length === 7 ? "month" : "day";
}

function num(x: unknown): number | undefined {
  if (typeof x === "number" && isFinite(x)) return x;
  if (typeof x === "string" && /^\s*-?\d+(\.\d+)?\s*$/.test(x)) return parseFloat(x);
  return undefined;
}

function round(v: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(v * f) / f;
}

function addEvidence(ev: Evidence, item_id: string, entry_id?: string): void {
  if (!ev.some((e) => e.item_id === item_id && e.entry_id === entry_id)) ev.push(entry_id ? { item_id, entry_id } : { item_id });
}

// ───────────────────────────── items in scope ─────────────────────────────

interface Doc {
  item: FolioItem;
  /** Clinical time of the document, for ordering (end of the documented period when given). */
  eventMs: number;
  recordedMs: number;
  /** Local date the document's decisions apply from. */
  eventDate?: PartialDate;
  entries: [string, Record<string, any>][];
}

function currentDocs(items: FolioItem[], asOf: string): Doc[] {
  const inScope: FolioItem[] = [];
  for (const it of Array.isArray(items) ? items : []) {
    if (!isObj(it) || !str(it.id)) continue;
    const rd = localDate(it.recorded);
    if (!rd || rd.length !== 10) continue;
    if (rd > asOf) continue;
    inScope.push(it);
  }
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const k of ["supersedes", "retracts"] as const) {
      const list = (it as any)[k];
      if (Array.isArray(list)) for (const id of list) if (typeof id === "string") dead.add(`${it.issuer}|${id}`);
    }
  }
  const docs: Doc[] = [];
  for (const it of inScope) {
    if (dead.has(`${it.issuer}|${it.id}`)) continue;
    const payload = isObj(it.payload) ? it.payload : {};
    const entries: [string, Record<string, any>][] = [];
    for (const k of Object.keys(payload)) if (isObj(payload[k])) entries.push([k, payload[k]]);
    const evStr = str(it.effective_end) ?? str(it.effective);
    const recordedMs = toInstant(it.recorded) ?? 0;
    docs.push({
      item: it,
      eventMs: toInstant(evStr) ?? recordedMs,
      recordedMs,
      eventDate: localDate(evStr),
      entries,
    });
  }
  docs.sort((a, b) => a.eventMs - b.eventMs || a.recordedMs - b.recordedMs || (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0));
  return docs;
}

// ───────────────────────────── drugs ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  steglatro: "ertugliflozin",
  januvia: "sitagliptin",
  tradjenta: "linagliptin",
  glucophage: "metformin",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  semglee: "insulin glargine",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  humalog: "insulin lispro",
  admelog: "insulin lispro",
  novolog: "insulin aspart",
  fiasp: "insulin aspart",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  trulicity: "dulaglutide",
  victoza: "liraglutide",
  mounjaro: "tirzepatide",
  cozaar: "losartan",
  diovan: "valsartan",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  vasotec: "enalapril",
  norvasc: "amlodipine",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  zocor: "simvastatin",
  lasix: "furosemide",
  microzide: "hydrochlorothiazide",
  hctz: "hydrochlorothiazide",
  kerendia: "finerenone",
  eliquis: "apixaban",
  xarelto: "rivaroxaban",
  coumadin: "warfarin",
  synthroid: "levothyroxine",
  aleve: "naproxen",
  naprosyn: "naproxen",
  advil: "ibuprofen",
  motrin: "ibuprofen",
  tylenol: "acetaminophen",
  zoloft: "sertraline",
  prozac: "fluoxetine",
  lexapro: "escitalopram",
  wellbutrin: "bupropion",
  seroquel: "quetiapine",
  abilify: "aripiprazole",
};

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "succinate", "tartrate", "calcium",
  "mesylate", "fumarate", "citrate", "sulfate", "magnesium", "acetate", "bromide", "dihydrate", "monohydrate",
  "hyclate", "phosphate", "bitartrate", "hydrobromide", "disodium", "trihydrate",
]);
const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "oral", "po", "solution", "suspension",
  "injection", "injectable", "pen", "prefilled", "syringe", "er", "xr", "sr", "dr", "xl", "ec", "extended", "delayed",
  "release", "immediate", "film", "coated", "chewable", "subq", "subcutaneous", "iv", "infusion", "patch", "cream",
  "ointment", "inhaler", "spray", "drops", "vial", "u-100", "u100", "(human)", "human", "mg", "mcg", "ml", "units",
]);

function ingredientOf(name: string): string | undefined {
  let s = name.toLowerCase().replace(/[®™]/g, " ");
  const brandHit = Object.keys(BRANDS).find((b) => new RegExp(`\\b${b}\\b`).test(s));
  if (brandHit) return BRANDS[brandHit];
  // Cut at the first strength number.
  const cut = s.search(/\s\d|\s\.\d/);
  if (cut > 0) s = s.slice(0, cut);
  s = s.replace(/\(.*?\)/g, " ");
  let words = s.split(/[\s,]+/).filter((w) => w && !FORM_WORDS.has(w));
  if (words.length > 1) words = [words[0], ...words.slice(1).filter((w) => !SALTS.has(w))];
  const out = words.join(" ").trim();
  if (!out || /^(water|blood pressure|sugar|diabetes|pain)\s+pill/.test(out)) return undefined;
  return out;
}

const DRUG_CLASSES: { re: RegExp; members: RegExp }[] = [
  { re: /sglt-?2/i, members: /(empagliflozin|dapagliflozin|canagliflozin|ertugliflozin|bexagliflozin|sotagliflozin)/i },
  { re: /\bace(-|\s)?(inhibitor|i)\b|angiotensin[- ]converting/i, members: /\w+pril\b/i },
  { re: /\barb\b|angiotensin (ii )?receptor blocker/i, members: /\w+sartan\b/i },
  { re: /\bstatin\b/i, members: /\w+statin\b/i },
  { re: /\bnsaid\b/i, members: /(ibuprofen|naproxen|diclofenac|meloxicam|celecoxib|indomethacin|ketorolac|nabumetone|etodolac)/i },
  { re: /\bthiazide\b/i, members: /(hydrochlorothiazide|chlorthalidone|indapamide|metolazone)/i },
  { re: /glp-?1/i, members: /(semaglutide|liraglutide|dulaglutide|exenatide|tirzepatide)/i },
  { re: /dpp-?4/i, members: /\w+gliptin\b/i },
  { re: /sulfonylurea/i, members: /(glipizide|glyburide|glimepiride)/i },
  { re: /\bmetformin\b|biguanide/i, members: /\bmetformin\b/i },
  { re: /\binsulin\b/i, members: /\binsulin\b/i },
];

// Plain-category sensitivity for drugs and conditions (the schema has no restriction flag).
const MH_DRUGS = /(sertraline|fluoxetine|escitalopram|citalopram|paroxetine|venlafaxine|duloxetine|bupropion|mirtazapine|trazodone|quetiapine|aripiprazole|olanzapine|risperidone|haloperidol|lithium|lamotrigine|clozapine|ziprasidone|lurasidone)/i;
const SUD_DRUGS = /(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|varenicline)/i;
const HIV_DRUGS = /(emtricitabine|tenofovir|dolutegravir|bictegravir|raltegravir|efavirenz|rilpivirine|darunavir|lamivudine|abacavir|zidovudine|cabotegravir)/i;
const SRH_DRUGS = /(estradiol|ethinyl|norethindrone|levonorgestrel|medroxyprogesterone|etonogestrel|drospirenone|norgestimate|prenatal|sildenafil|tadalafil|misoprostol|mifepristone)/i;

function drugSensitivity(name: string): Sensitivity[] | undefined {
  const out: Sensitivity[] = [];
  if (MH_DRUGS.test(name)) out.push("mental-health");
  if (SUD_DRUGS.test(name)) out.push("substance-use");
  if (HIV_DRUGS.test(name)) out.push("hiv-sti");
  if (SRH_DRUGS.test(name)) out.push("sexual-reproductive-health");
  return out.length ? out : undefined;
}

function conditionSensitivity(label: string, icd?: string): Sensitivity[] | undefined {
  const out = new Set<Sensitivity>();
  const c = (icd ?? "").toUpperCase();
  const l = label.toLowerCase();
  if (/^F1\d/.test(c) || /(alcohol|opioid|cocaine|cannabis|amphetamine|substance) (use|abuse|dependence)|alcoholism|addiction/.test(l)) out.add("substance-use");
  else if (/^F\d/.test(c) || /(depress|anxiety|bipolar|schizo|psychos|ptsd|post-traumatic|adhd|eating disorder|anorexia nervosa|bulimia|suicid|panic disorder|obsessive)/.test(l)) out.add("mental-health");
  if (/^(B2[0-4]|Z21|A5[0-9]|A6[0-4])/.test(c) || /\bhiv\b|syphilis|gonorr|chlamydia|herpes simplex|genital|trichomon/.test(l)) out.add("hiv-sti");
  if (/^(O\d|Z3[0-9]|N9[67])/.test(c) || /pregnan|contracept|infertil|abortion|miscarriage/.test(l)) out.add("sexual-reproductive-health");
  if (/^Q\d/.test(c) || /\bgenetic\b|hereditary|brca|lynch syndrome/.test(l)) out.add("genetic");
  return out.size ? [...out] : undefined;
}

// ───────────────────────────── medications ─────────────────────────────

type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";

function parseAmount(text: string): { value: number; unit: DoseUnit } | undefined {
  const m = /(\d+(?:\.\d+)?)\s*(mg|milligrams?|mcg|micrograms?|µg|ug|g|grams?|units?|unt|\[iu\]|iu|u|ml|tablets?|tabs?|capsules?|caps?)\b/i.exec(text);
  if (!m) return undefined;
  const v = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  if (/^(mg|milligram)/.test(u)) return { value: v, unit: "mg" };
  if (/^(mcg|microgram|µg|ug)/.test(u)) return { value: v, unit: "mcg" };
  if (/^(g|gram)/.test(u)) return { value: v * 1000, unit: "mg" };
  if (/^(unit|unt|\[iu\]|iu|u)$|^units$/.test(u)) return { value: v, unit: "units" };
  if (u === "ml") return { value: v, unit: "mL" };
  return { value: v, unit: "tablet" };
}

function isRange(text: string): boolean {
  return /\d\s*(-|–|to|or)\s*\d|sliding|scale|per protocol|titrat|variable/i.test(text);
}

function sigCount(sig: string): number | "range" | undefined {
  const s = sig.toLowerCase();
  if (/\d+(\.\d+)?\s*(-|–|to|or)\s*\d+(\.\d+)?\s*(tab|cap|pill)/.test(s)) return "range";
  if (/\b(one|two|three)\s*(or|to)\s*(two|three|four)\s*(tab|cap|pill)/.test(s)) return "range";
  const m = /(\d+(?:\.\d+)?|½|one|two|three|four|half)\s*(tab|cap|pill)/.exec(s);
  if (!m) return undefined;
  const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5, "½": 0.5 };
  return words[m[1]] ?? parseFloat(m[1]);
}

function computeDose(e: Record<string, any>): { value: number; unit: DoseUnit } | undefined {
  const doseText = str(e.dose_text) ?? "";
  const sig = str(e.sig) ?? "";
  const name = str(e.drug_name) ?? "";
  if (doseText && isRange(doseText)) return undefined;
  const d = doseText ? parseAmount(doseText) : undefined;
  const strengthAmt = parseAmount(name);
  const strength = strengthAmt && strengthAmt.unit !== "tablet" && strengthAmt.unit !== "units" ? strengthAmt : undefined;
  const n = sig ? sigCount(sig) : undefined;
  const isSolid = /\b(tab|tablet|cap|capsule)/i.test(name + " " + sig);
  if (d) {
    if (d.unit === "tablet") {
      if (strength) return { value: round(d.value * strength.value, 4), unit: strength.unit };
      return d;
    }
    if (strength && isSolid && d.unit === strength.unit && d.value === strength.value) {
      // dose_text restates the tablet strength; the sig gives the count.
      if (n === "range") return undefined;
      if (typeof n === "number") return { value: round(n * d.value, 4), unit: d.unit };
    }
    return d;
  }
  if (n === "range") return undefined;
  if (strength && typeof n === "number") return { value: round(n * strength.value, 4), unit: strength.unit };
  if (typeof n === "number") return { value: n, unit: "tablet" };
  return undefined;
}

function frequencyOf(sig: string): MedicationRow["frequency"] | undefined {
  const s = sig.toLowerCase();
  if (!s.trim()) return undefined;
  if (/\bprn\b|as needed|when needed|if needed/.test(s)) return "PRN";
  if (/\bqhs\b|at bedtime|nightly at bedtime|\bhs\b|before bed/.test(s)) return "QHS";
  if (/\b(bid|b\.i\.d\.?)\b|twice (a |per )?(day|daily)|2 times (a |per )?day|every 12 hours|q12h/.test(s)) return "BID";
  if (/\b(tid|t\.i\.d\.?)\b|three times (a |per )?(day|daily)|3 times (a |per )?day|every 8 hours|q8h/.test(s)) return "TID";
  if (/\b(qw|weekly)\b|once (a |per )?week|every week/.test(s)) return "QW";
  if (/\b(qid|q\d+h|every \d+ hours|every other day|qod|monthly|four times)\b/.test(s)) return "other";
  if (/\b(qd|daily|once (a |per )?day|every day|each day|every morning|every evening|qam|qpm|nightly|in the morning)\b/.test(s)) return "QD";
  return "other";
}

function mapMedStatus(s: unknown): MedicationRow["status"] | undefined {
  switch (s) {
    case "not_reconciled":
      return "unknown";
    case "continue":
    case "new":
    case "changed":
      return "active";
    case "held":
      return "held";
    case "stopped":
      return "stopped";
    default:
      return undefined;
  }
}

function stopReason(text: string): MedicationRow["stop_reason"] | undefined {
  const t = text.toLowerCase();
  if (/side effect|adverse|reaction|intoleran|allerg|rash|hives|angioedema|cough|ketoacidosis|lactic acidosis|hyperkalemia|caused|associated/.test(t)) return "adverse_reaction";
  if (/ineffective|not effective|not working|inadequate|insufficient|uncontrolled|lack of (effect|efficacy)/.test(t)) return "ineffective";
  if (/switch|replac|changed to|change to|instead|transition(ed)? to|in place of/.test(t)) return "therapy_changed";
  if (/course (complete|completed|finished)|completed (the )?course|finished (the )?course/.test(t)) return "course_complete";
  if (/patient (declined|refused|prefer|request|chose|wish)|per patient|patient's (choice|preference|request)/.test(t)) return "patient_choice";
  return undefined;
}

function isHospitalOnly(e: Record<string, any>): boolean {
  const t = `${e.drug_name ?? ""} ${e.sig ?? ""} ${e.dose_text ?? ""}`.toLowerCase();
  return /\b(iv|intravenous|infusion|drip)\b|\/h\b|per hour|lactated ringer|normal saline|sodium chloride 0\.9/.test(t);
}

function medKey(e: Record<string, any>): string | undefined {
  const rx = str(e.rxnorm_ingredient);
  if (rx) return `rx:${rx}`;
  const name = str(e.drug_name);
  if (!name) return undefined;
  const ing = ingredientOf(name);
  return ing ? `ing:${ing}` : `name:${name.toLowerCase().trim()}`;
}

interface MedObs {
  doc: Doc;
  entryId: string;
  e: Record<string, any>;
  status: MedicationRow["status"];
}

function buildMedications(docs: Doc[]): MedicationRow[] {
  // Each document restates the home medication list; the latest document with a list is the list.
  const snapshots: { doc: Doc; meds: Map<string, MedObs> }[] = [];
  for (const doc of docs) {
    const meds = new Map<string, MedObs>();
    for (const [id, e] of doc.entries) {
      if (e.type !== "home_med") continue;
      if (!str(e.drug_name)) continue;
      if (isHospitalOnly(e)) continue;
      const status = mapMedStatus(e.status);
      if (!status) continue;
      const key = medKey(e);
      if (!key) continue;
      meds.set(key, { doc, entryId: id, e, status });
    }
    if (meds.size) snapshots.push({ doc, meds });
  }
  if (!snapshots.length) return [];
  const latest = snapshots[snapshots.length - 1];
  const rows: MedicationRow[] = [];
  for (const [key, cur] of latest.meds) {
    // Walk back over the run of snapshots that show the same status for this drug.
    const run: MedObs[] = [cur];
    let before: MedObs | undefined;
    for (let i = snapshots.length - 2; i >= 0; i--) {
      const o = snapshots[i].meds.get(key);
      if (!o) break;
      if (o.status !== cur.status) {
        before = o;
        break;
      }
      run.unshift(o);
    }
    const first = run[0];
    const e = cur.e;
    const name = str(e.drug_name)!;
    const row: MedicationRow = {
      drug_name: name,
      status: cur.status,
      patient_reported: false,
      evidence: [],
    };
    const ing = ingredientOf(name);
    if (ing) row.ingredient = ing;
    const rx = str(e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;

    if (cur.status === "held" || cur.status === "stopped") {
      if (first.doc.eventDate) row.status_since = first.doc.eventDate;
    } else if (cur.status === "active") {
      const startedHere = first.e.status === "new" || first.e.status === "changed" || (before && (before.status === "held" || before.status === "stopped"));
      if (startedHere && first.doc.eventDate) row.status_since = first.doc.eventDate;
    }

    const dose = computeDose(e);
    if (dose) row.dose = dose;
    const freq = frequencyOf(str(e.sig) ?? "");
    if (freq) row.frequency = freq;

    if (cur.status === "held" || cur.status === "stopped") {
      let text: string | undefined;
      for (let i = run.length - 1; i >= 0 && !text; i--) text = str(run[i].e.instructions);
      if (text) row.status_reason_text = text;
      if (cur.status === "stopped" && text) {
        const r = stopReason(text);
        if (r) row.stop_reason = r;
      }
    }
    const sens = drugSensitivity(`${name} ${ing ?? ""}`);
    if (sens) row.sensitivity = sens;

    for (const o of run) addEvidence(row.evidence, o.doc.item.id, o.entryId);
    // Cite the current state first.
    row.evidence.sort((a, b) => (a.item_id === cur.doc.item.id ? -1 : b.item_id === cur.doc.item.id ? 1 : 0));
    rows.push(row);
  }
  rows.sort((a, b) => (a.ingredient ?? a.drug_name).localeCompare(b.ingredient ?? b.drug_name));
  return rows;
}

// ───────────────────────────── allergies ─────────────────────────────

const HYPERSENS = /hives|urticaria|rash|angioedema|swelling|anaphyla|bronchospasm|wheez|itch|prurit|throat (closing|tightness)|stevens|sjs|ten\b|toxic epidermal|dress|blister|exanthem|hypersensitiv|flushing|shortness of breath/i;
const SERIOUS = /ketoacidosis|\bdka\b|lactic acidosis|hyperkal|renal failure|kidney injury|\baki\b|pancreatitis|hepatotox|liver (injury|failure)|agranulocytosis|neutropenia|thrombocytopenia|rhabdo|bleed|hemorrhag|hypoglyc|qt prolong|arrhythm|seizure|serotonin syndrome|neuroleptic/i;
const SIDE = /cough|nausea|vomit|gi upset|upset stomach|diarrh|constipat|dizz|headache|myalgia|muscle (ache|pain)|fatigue|drows|insomnia|edema|taste|dry mouth|lighthead|palpitation|flatulen|bloat|cramp/i;

function reactionType(reaction: string, severity?: string): AllergyIntoleranceRow["reaction_type"] {
  if (HYPERSENS.test(reaction)) return "hypersensitivity";
  if (SERIOUS.test(reaction)) return "serious_adverse_event";
  if (SIDE.test(reaction)) return "side_effect";
  return severity === "mild" && reaction ? "side_effect" : "hypersensitivity";
}

function mechanismOf(substance: string, reaction: string, explicit?: string): AllergyIntoleranceRow["mechanism"] {
  const s = substance.toLowerCase();
  const r = reaction.toLowerCase();
  if (explicit && /ige|immune[- ]mediated|t-cell|positive (skin|patch) test/i.test(explicit)) return "immune";
  if ((/\w+pril\b/.test(s) || /ace inhibitor/.test(s)) && /cough|angioedema/.test(r)) return "non_immune";
  if (/ketoacidosis|\bdka\b|lactic acidosis|hyperkal/.test(r)) return "non_immune";
  return "unknown";
}

function criticalityOf(severity: unknown, reaction: string): AllergyIntoleranceRow["criticality"] {
  if (/anaphyla|angioedema|stevens|sjs|toxic epidermal|throat (closing|tightness)|ketoacidosis|\bdka\b|lactic acidosis/i.test(reaction)) return "high";
  if (severity === "severe") return "high";
  if (severity === "mild") return "low";
  return "unknown";
}

function allergyKey(substance: string, rx?: string): string {
  return rx ? `rx:${rx}` : `s:${substance.toLowerCase().trim()}`;
}

// ───────────────────────────── problems ─────────────────────────────

function ckdStage(label: string, icd?: string): ProblemRow["ckd_stage"] | undefined {
  const c = (icd ?? "").toUpperCase();
  const map: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
  const l = label.toLowerCase();
  const m = /\bg(1|2|3a|3b|4|5)\b/.exec(l) ?? /stage\s*(1|2|3a|3b|4|5|i{1,3}a?b?|iv|v)\b/.exec(l);
  if (m) {
    const roman: Record<string, string> = { i: "1", ii: "2", iiia: "3a", iiib: "3b", iv: "4", v: "5" };
    const v = roman[m[1]] ?? m[1];
    const st = ("G" + v) as ProblemRow["ckd_stage"];
    if (["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(st as string)) return st;
  }
  if (map[c]) return map[c];
  return undefined;
}

function albuminuriaOf(label: string): ProblemRow["albuminuria"] | undefined {
  const m = /\bA([123])\b/.exec(label);
  return m ? (("A" + m[1]) as ProblemRow["albuminuria"]) : undefined;
}

function isCkd(label: string, icd?: string): boolean {
  return /^N18/i.test(icd ?? "") || /chronic kidney disease|\bckd\b/i.test(label);
}

function parseOnset(text?: string): PartialDate | undefined {
  if (!text) return undefined;
  const t = text.trim();
  let m = /^(?:(?:in|since|onset|dx|diagnosed)\s+)?(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/i.exec(t);
  if (m) return m[1] + (m[2] ? `-${m[2]}` : "") + (m[2] && m[3] ? `-${m[3]}` : "");
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  m = /^(?:(?:in|since)\s+)?([a-z]+)\.?\s+(\d{4})$/i.exec(t);
  if (m) {
    const idx = months.findIndex((mo) => mo.startsWith(m![1].toLowerCase()) && m![1].length >= 3);
    if (idx >= 0) return `${m[2]}-${String(idx + 1).padStart(2, "0")}`;
  }
  m = /^(\d{1,2})\/(\d{4})$/.exec(t);
  if (m && +m[1] >= 1 && +m[1] <= 12) return `${m[2]}-${m[1].padStart(2, "0")}`;
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t);
  if (m && +m[1] >= 1 && +m[1] <= 12) return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  return undefined;
}

/** For a diagnosis the source attributes to a drug: the drug or class phrase, else undefined. */
function drugAttribution(e: Record<string, any>): { phrase: string; reactionText: string } | undefined {
  const label = str(e.label) ?? "";
  const rname = isObj(e.riverside_dx) ? str(e.riverside_dx.name) ?? "" : "";
  const icd = str(e.icd10cm) ?? "";
  for (const text of [label, rname]) {
    if (!text) continue;
    const m = /^(.*?)[,;]?\s*\(?\b([a-z0-9][a-z0-9 \-\/]*?)[- ](associated|induced|related)\)?\s*(.*)$/i.exec(text);
    if (m) {
      const phrase = m[2].trim();
      if (/drug|medication|inhibitor|blocker|agonist|statin|nsaid|insulin|\w+(pril|sartan|gliflozin|statin|olol|dipine|mycin|cillin|floxacin)\b/i.test(phrase) || ingredientOf(phrase) !== undefined && Object.values(BRANDS).includes(ingredientOf(phrase)!)) {
        const rest = `${m[1]} ${m[4]}`.replace(/\s+/g, " ").replace(/^[,;\s]+|[,;\s]+$/g, "").trim();
        return { phrase, reactionText: rest || text };
      }
    }
    const d = /^(.*?)\s+(?:due to|caused by|secondary to|from)\s+(.+)$/i.exec(text);
    if (d && /\w+(pril|sartan|gliflozin|statin|olol|dipine|mycin|cillin|floxacin|formin|profen|proxen)\b|inhibitor|blocker|nsaid|medication|drug/i.test(d[2])) {
      return { phrase: d[2].trim(), reactionText: d[1].trim() };
    }
  }
  // ICD-10 T36-T50 with 5th character 5 = adverse effect of drug.
  if (/^T(3[6-9]|4\d|50)\.\w{2}5/i.test(icd)) {
    const m = /adverse effect of\s+(.+?)(?:,|$)/i.exec(label) ?? /adverse effect of\s+(.+?)(?:,|$)/i.exec(rname);
    return { phrase: m ? m[1].trim() : label, reactionText: label };
  }
  return undefined;
}

function isTCodeOnly(e: Record<string, any>): boolean {
  return /^T(3[6-9]|4\d|50)\./i.test(str(e.icd10cm) ?? "");
}

function resolveSubstance(phrase: string, doc: Doc): { substance: string; rx?: string; entryId?: string } {
  const cls = DRUG_CLASSES.find((c) => c.re.test(phrase));
  if (!cls) {
    const ing = ingredientOf(phrase);
    // Specific drug named: look it up on the item's list for a code.
    for (const [id, e] of doc.entries) {
      if ((e.type === "home_med" || e.type === "inpatient_med") && str(e.drug_name) && ingredientOf(e.drug_name) === ing) {
        return { substance: ing!, rx: str(e.rxnorm_ingredient), entryId: id };
      }
    }
    return { substance: ing ?? phrase.toLowerCase() };
  }
  const found = new Map<string, { substance: string; rx?: string; entryId: string }>();
  for (const [id, e] of doc.entries) {
    if (e.type !== "home_med" || !str(e.drug_name)) continue;
    const ing = ingredientOf(e.drug_name);
    if (!ing || !cls.members.test(ing)) continue;
    if (!found.has(ing)) found.set(ing, { substance: ing, rx: str(e.rxnorm_ingredient), entryId: id });
  }
  if (found.size === 1) return [...found.values()][0];
  return { substance: phrase };
}

function buildProblemsAndAllergies(docs: Doc[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  interface Obs { doc: Doc; id: string; e: Record<string, any>; kind: "dx" | "hx" }
  const groups = new Map<string, Obs[]>();
  const aliases = new Map<string, string>();
  const keyFor = (e: Record<string, any>, label: string): string => {
    const keys: string[] = [];
    const icd = str(e.icd10cm);
    if (icd) keys.push(`icd:${icd.toUpperCase()}`);
    if (isObj(e.riverside_dx) && str(e.riverside_dx.code)) keys.push(`rrh:${e.riverside_dx.code}`);
    keys.push(`lbl:${label.toLowerCase().replace(/\s+/g, " ").trim()}`);
    for (const k of keys) if (aliases.has(k)) {
      const g = aliases.get(k)!;
      for (const k2 of keys) if (!aliases.has(k2)) aliases.set(k2, g);
      return g;
    }
    for (const k of keys) aliases.set(k, keys[0]);
    return keys[0];
  };
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      let label: string | undefined;
      let kind: "dx" | "hx";
      if (e.type === "diagnosis") {
        label = str(e.label) ?? (isObj(e.riverside_dx) ? str(e.riverside_dx.name) : undefined);
        kind = "dx";
      } else if (e.type === "history") {
        label = str(e.condition);
        kind = "hx";
      } else continue;
      if (!label) continue;
      const k = keyFor(e, label);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push({ doc, id, e, kind });
    }
  }

  const problems: ProblemRow[] = [];
  const allergyMap = new Map<string, AllergyIntoleranceRow>();
  const allergyOrder: string[] = [];

  for (const obs of groups.values()) {
    // Status: latest decisive diagnosis entry; history entries count as 'active' only when no diagnosis decides.
    const dxDecisive = obs.filter((o) => o.kind === "dx" && ["active", "resolved", "ruled_out"].includes(o.e.status));
    let status: ProblemRow["status"] | undefined;
    let current: Obs | undefined;
    if (dxDecisive.length) {
      current = dxDecisive[dxDecisive.length - 1];
      status = current.e.status === "ruled_out" ? undefined : (current.e.status as ProblemRow["status"]);
    } else {
      const hx = obs.filter((o) => o.kind === "hx");
      if (hx.length) {
        current = hx[hx.length - 1];
        const c = String(current.e.condition).toLowerCase();
        status = /\bresolved\b|\bremote\b|\bs\/p\b|status post|\bhistory of\b|\bprior\b|\bpast\b/.test(c) ? "resolved" : "active";
      }
    }
    if (!status || !current) continue;
    const labelOf = (o: Obs) => (o.kind === "dx" ? str(o.e.label) ?? str(o.e.riverside_dx?.name) : str(o.e.condition)) ?? "";
    const label = labelOf(current);
    const relevant = obs.filter((o) => !(o.kind === "dx" && o.e.status === "working"));
    let icd: string | undefined;
    for (const o of relevant) if (str(o.e.icd10cm)) icd = str(o.e.icd10cm);

    const attributionObs = relevant.filter((o) => o.kind === "dx" && drugAttribution(o.e));
    const tOnly = attributionObs.length > 0 && isTCodeOnly(current.e) && !/(?:,|;)/.test(label) && /^adverse effect/i.test(label);

    if (!tOnly) {
      const row: ProblemRow = { condition: label, status, evidence: [] };
      if (icd) row.icd10cm = icd;
      let onset: PartialDate | undefined;
      for (const o of relevant) if (o.kind === "hx") onset = parseOnset(str(o.e.onset_text)) ?? onset;
      if (onset) row.onset = { value: onset, precision: precisionOf(onset) };
      if (isCkd(label, icd)) {
        let st: ProblemRow["ckd_stage"] | undefined;
        let alb: ProblemRow["albuminuria"] | undefined;
        for (const o of relevant) {
          const l = labelOf(o) + " " + (str(o.e.riverside_dx?.name) ?? "");
          st = ckdStage(l, str(o.e.icd10cm)) ?? st;
          alb = albuminuriaOf(l) ?? alb;
        }
        if (st) row.ckd_stage = st;
        if (alb) row.albuminuria = alb;
      }
      const sens = conditionSensitivity(label, icd);
      if (sens) row.sensitivity = sens;
      addEvidence(row.evidence, current.doc.item.id, current.id);
      for (const o of relevant) addEvidence(row.evidence, o.doc.item.id, o.id);
      problems.push(row);
    }

    // Drug-attributed diagnosis -> substance to avoid.
    if (attributionObs.length) {
      let resolved: { substance: string; rx?: string; entryId?: string; doc: Doc; o: Obs } | undefined;
      for (let i = attributionObs.length - 1; i >= 0; i--) {
        const o = attributionObs[i];
        const a = drugAttribution(o.e)!;
        const r = resolveSubstance(a.phrase, o.doc);
        if (!resolved) resolved = { ...r, doc: o.doc, o };
        if (r.substance !== a.phrase) {
          resolved = { ...r, doc: o.doc, o };
          break;
        }
      }
      if (resolved) {
        const a = drugAttribution(resolved.o.e)!;
        const reaction = a.reactionText;
        const key = allergyKey(resolved.substance, resolved.rx);
        const ev: Evidence = [];
        for (const o of attributionObs) addEvidence(ev, o.doc.item.id, o.id);
        if (resolved.entryId) addEvidence(ev, resolved.doc.item.id, resolved.entryId);
        const rt = HYPERSENS.test(reaction) ? "hypersensitivity" : SIDE.test(reaction) && !SERIOUS.test(reaction) ? "side_effect" : "serious_adverse_event";
        const row: AllergyIntoleranceRow = {
          substance: resolved.substance,
          reaction_type: rt,
          mechanism: mechanismOf(resolved.substance, reaction),
          reaction,
          criticality: rt === "serious_adverse_event" ? "high" : criticalityOf(undefined, reaction),
          evidence: ev,
        };
        if (resolved.rx) row.rxnorm_ingredient = resolved.rx;
        mergeAllergy(allergyMap, allergyOrder, key, row);
      }
    }
  }

  // Allergy list entries: latest entry per substance.
  const latestAlg = new Map<string, { doc: Doc; id: string; e: Record<string, any>; all: { doc: Doc; id: string }[] }>();
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      if (e.type !== "allergy") continue;
      const sub = str(e.substance);
      if (!sub) continue;
      if (/^(nkda|nka|no known)/i.test(sub.trim())) continue;
      const key = allergyKey(ingredientOf(sub) ?? sub, str(e.rxnorm_ingredient));
      const prev = latestAlg.get(key);
      latestAlg.set(key, { doc, id, e, all: [...(prev?.all ?? []), { doc, id }] });
    }
  }
  for (const [key, a] of latestAlg) {
    const sub = str(a.e.substance)!;
    const reaction = str(a.e.reaction);
    const isDrug = !!str(a.e.rxnorm_ingredient) || Object.values(BRANDS).includes(ingredientOf(sub) ?? "") || /\w+(pril|sartan|gliflozin|statin|olol|dipine|mycin|cillin|floxacin|formin|cycline|azole|sulfa)\b/i.test(sub);
    const substance = isDrug ? ingredientOf(sub) ?? sub.toLowerCase() : sub;
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: reactionType(reaction ?? "", str(a.e.severity)),
      mechanism: mechanismOf(substance, reaction ?? ""),
      criticality: criticalityOf(a.e.severity, reaction ?? ""),
      evidence: [],
    };
    const rx = str(a.e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;
    if (reaction) row.reaction = reaction;
    addEvidence(row.evidence, a.doc.item.id, a.id);
    for (const x of a.all) addEvidence(row.evidence, x.doc.item.id, x.id);
    mergeAllergy(allergyMap, allergyOrder, key, row);
  }

  const allergies = allergyOrder.map((k) => allergyMap.get(k)!);
  return { problems, allergies };
}

function mergeAllergy(map: Map<string, AllergyIntoleranceRow>, order: string[], key: string, row: AllergyIntoleranceRow): void {
  let k = key;
  // Also match by substance name when one side lacks a code.
  if (!map.has(k)) {
    for (const [k2, r] of map) if (r.substance.toLowerCase() === row.substance.toLowerCase()) k = k2;
  }
  const prev = map.get(k);
  if (!prev) {
    map.set(k, row);
    order.push(k);
    return;
  }
  const reactions = [prev.reaction, row.reaction].filter((x): x is string => !!x);
  const uniq = [...new Set(reactions)];
  if (uniq.length) prev.reaction = uniq.join("; ");
  const rank = { serious_adverse_event: 3, hypersensitivity: 2, side_effect: 1 } as const;
  if (rank[row.reaction_type] > rank[prev.reaction_type]) prev.reaction_type = row.reaction_type;
  if (prev.mechanism === "unknown") prev.mechanism = row.mechanism;
  if (row.criticality === "high" || prev.criticality === "unknown") prev.criticality = row.criticality === "unknown" ? prev.criticality : row.criticality;
  if (!prev.rxnorm_ingredient && row.rxnorm_ingredient) prev.rxnorm_ingredient = row.rxnorm_ingredient;
  for (const e of row.evidence) addEvidence(prev.evidence, e.item_id, e.entry_id);
}

// ───────────────────────────── labs ─────────────────────────────

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "88293-6": "egfr", "88294-4": "egfr", "50044-7": "egfr", "70969-1": "egfr", "77147-7": "egfr", "50210-4": "egfr",
  "2823-3": "potassium", "6298-4": "potassium",
  "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "14627-4": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "41653-7": "glucose", "1558-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "59261-8": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "13705-9": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin", "30313-1": "hemoglobin", "20509-6": "hemoglobin", "59260-0": "hemoglobin",
  "53060-9": "bhb", "47571-6": "bhb", "9343-5": "bhb",
  "2746-6": "ph", "2744-1": "ph", "11558-4": "ph", "2753-2": "ph",
  "2021-4": "pco2", "2019-8": "pco2", "11557-6": "pco2",
  "3040-3": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin", "76399-5": "troponin",
  "2093-3": "cholesterol",
  "2571-8": "triglycerides",
  "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "69419-0": "ldl",
};

const LOCAL_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", CREA: "creatinine",
  EGFR: "egfr", GFR: "egfr",
  K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate", TCO2: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", GLUC: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", MALB_CR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", VPH: "ph", APH: "ph", PH: "ph", VPCO2: "pco2", APCO2: "pco2", PCO2: "pco2",
  LIPASE: "lipase", TROP: "troponin", TROPI: "troponin", TNI: "troponin", HSTNI: "troponin",
  CHOL: "cholesterol", TG: "triglycerides", TRIG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L",
  troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function analyteOf(test: Record<string, any>): Analyte | undefined {
  const loinc = str(test.loinc);
  if (loinc && LOINC_ANALYTE[loinc]) return LOINC_ANALYTE[loinc];
  const lc = str(test.local_code)?.toUpperCase();
  if (lc && LOCAL_ANALYTE[lc]) return LOCAL_ANALYTE[lc];
  const n = (str(test.name) ?? "").toLowerCase();
  if (/egfr|glomerular filtration/.test(n)) return "egfr";
  if (/albumin.*creatinine|\buacr\b/.test(n)) return "uacr";
  if (/^creatinine/.test(n)) return "creatinine";
  if (/^potassium/.test(n)) return "potassium";
  if (/^sodium/.test(n)) return "sodium";
  if (/^chloride/.test(n)) return "chloride";
  if (/bicarbonate|total co2|carbon dioxide/.test(n)) return "bicarbonate";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/^glucose/.test(n)) return "glucose";
  if (/a1c|glycated h/.test(n)) return "a1c";
  if (/^platelet/.test(n)) return "platelets";
  if (/white blood|^wbc|leukocyte/.test(n)) return "wbc";
  if (/^hemoglobin\b(?!\s*a1c)/.test(n)) return "hemoglobin";
  if (/hydroxybutyrate/.test(n)) return "bhb";
  if (/^ph\b/.test(n)) return "ph";
  if (/pco2/.test(n)) return "pco2";
  if (/^lipase/.test(n)) return "lipase";
  if (/troponin i/.test(n)) return "troponin";
  if (/^(total )?cholesterol(, total)?$/.test(n)) return "cholesterol";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/^hdl|hdl cholesterol/.test(n)) return "hdl";
  if (/^ldl|ldl cholesterol/.test(n)) return "ldl";
  return undefined;
}

function convert(analyte: Analyte, value: number, unitRaw: string | undefined, loinc?: string): number | undefined {
  const u = (unitRaw ?? "").trim().toLowerCase().replace(/\s+/g, "").replace(/µ/g, "u");
  const target = UNIT[analyte].toLowerCase();
  if (!u) return analyte === "ph" ? value : undefined;
  if (u === target) return value;
  switch (analyte) {
    case "creatinine":
      if (u === "umol/l") return value / 88.42;
      break;
    case "egfr":
      if (/^ml\/min(\/1\.73(m2|m\^2|sqm|m²)?)?$/.test(u) || u === "ml/min/{1.73_m2}") return value;
      break;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      if (u === "meq/l" || u === "mmol/l") return value;
      break;
    case "bun":
      if (u === "mmol/l") return value * 2.801;
      break;
    case "glucose":
      if (u === "mmol/l") return value * 18.016;
      break;
    case "a1c":
      if (u === "mmol/mol" || loinc === "59261-8") return round(0.09148 * value + 2.152, 1);
      if (u === "%hb" || u === "%ofhb" || u === "%total") return value;
      break;
    case "uacr":
      if (u === "mg/mmol") return value * 8.84;
      if (u === "ug/mg" || u === "mcg/mg") return value;
      if (u === "mg/gcreat" || u === "mg/g{creat}") return value;
      break;
    case "platelets": case "wbc":
      if (["k/ul", "10^3/ul", "x10^3/ul", "x10e3/ul", "10e3/ul", "thou/ul", "10*9/l", "10^9/l", "x10^9/l", "x10e9/l", "10*3/mm3", "k/mm3"].includes(u)) return value;
      if (u === "/ul" || u === "cells/ul" || u === "/mm3") return value / 1000;
      break;
    case "hemoglobin":
      if (u === "g/l") return value / 10;
      if (u === "mmol/l") return value * 1.611;
      break;
    case "bhb":
      if (u === "mg/dl") return value / 10.41;
      break;
    case "ph":
      if (u === "ph" || u === "[ph]" || u === "units") return value;
      break;
    case "pco2":
      if (u === "mm[hg]" || u === "mmhg") return value;
      if (u === "kpa") return value * 7.50062;
      break;
    case "lipase":
      if (u === "iu/l" || u === "u/l") return value;
      break;
    case "troponin":
      if (u === "ng/l" || u === "pg/ml") return value / 1000;
      if (u === "ug/l") return value;
      break;
    case "cholesterol": case "hdl": case "ldl":
      if (u === "mmol/l") return value * 38.67;
      break;
    case "triglycerides":
      if (u === "mmol/l") return value * 88.57;
      break;
  }
  return undefined;
}

function egfrEquation(test: Record<string, any>, methodText: string): LabResultRow["egfr_equation"] {
  const t = `${methodText}`.toLowerCase();
  if (/ckd[- ]?epi[^0-9]*2021|2021|race[- ]free/.test(t)) return "ckd-epi-2021";
  if (/ckd[- ]?epi[^0-9]*2009|2009/.test(t)) return "ckd-epi-2009";
  if (/mdrd/.test(t)) return "mdrd";
  if (/ckd[- ]?epi/.test(t)) return "unknown";
  const loinc = str(test.loinc);
  if (loinc === "98979-8" || loinc === "98980-6") return "ckd-epi-2021";
  if (loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  if (loinc === "48642-3" || loinc === "48643-1" || loinc === "33914-3" || loinc === "70969-1") return "mdrd";
  return "unknown";
}

function isRaceVariant(test: Record<string, any>): "black" | "nonblack" | undefined {
  const n = (str(test.name) ?? "").toLowerCase();
  const loinc = str(test.loinc);
  if (loinc === "48643-1" || loinc === "88293-6" || /african|black|\baa\b/.test(n) && !/non[- ]?(african|black|aa)/.test(n)) return "black";
  if (loinc === "48642-3" || loinc === "88294-4" || /non[- ]?(african|black|aa)/.test(n)) return "nonblack";
  return undefined;
}

const STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

function buildLabs(docs: Doc[]): LabResultRow[] {
  interface Cand {
    key: string;
    analyte: Analyte;
    test: Record<string, any>;
    v: Record<string, any>;
    accession: string;
    collected: string;
    status: string;
    doc: Doc;
    entryId: string;
    specimen: string;
  }
  const cands: Cand[] = [];
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      const pushOne = (v: Record<string, any>, header: Record<string, any>) => {
        if (!isObj(v.test)) return;
        const analyte = analyteOf(v.test);
        if (!analyte) return;
        const collected = str(header.collected);
        const status = str(header.status);
        if (!collected || !status || !(status in STATUS_RANK)) return;
        const accession = str(header.accession) ?? "";
        const code = str(v.test.local_code) ?? str(v.test.loinc) ?? str(v.test.name) ?? "";
        cands.push({
          key: `${accession}|${code}|${toInstant(collected) ?? collected}`,
          analyte,
          test: v.test,
          v,
          accession,
          collected,
          status,
          doc,
          entryId: id,
          specimen: (str(header.specimen) ?? "").toLowerCase(),
        });
      };
      if (e.type === "result") pushOne(e, e);
      else if (e.type === "panel" && Array.isArray(e.components)) for (const c of e.components) if (isObj(c)) pushOne(c, e);
    }
  }
  // One copy per result: most advanced status, then latest document.
  const best = new Map<string, { c: Cand; all: Cand[] }>();
  for (const c of cands) {
    const prev = best.get(c.key);
    if (!prev) best.set(c.key, { c, all: [c] });
    else {
      prev.all.push(c);
      if (STATUS_RANK[c.status] >= STATUS_RANK[prev.c.status]) prev.c = c;
    }
  }
  const chosen = [...best.values()];
  const rows: LabResultRow[] = [];
  for (const { c, all } of chosen) {
    const sp = c.specimen;
    if (/urine/.test(sp) && c.analyte !== "uacr") continue;
    if (c.analyte === "uacr" && sp && !/urine/.test(sp)) continue;
    if (/csf|cerebrospinal|fluid|dialysate|stool/.test(sp)) continue;
    if (c.analyte === "glucose" && /capillary|meter|poc|fingerstick/.test(sp + " " + (str(c.test.name) ?? "").toLowerCase())) {
      // Point-of-care meter readings are not laboratory glucose.
      if (c.test.loinc === "41653-7" || /meter|fingerstick/.test(sp)) continue;
    }
    if (c.analyte === "egfr" && isRaceVariant(c.test) === "black") {
      const sibling = chosen.some(
        (o) => o.c !== c && o.c.analyte === "egfr" && o.c.accession === c.accession && o.c.collected === c.collected && isRaceVariant(o.c.test) !== "black",
      );
      if (sibling) continue;
    }
    const raw = typeof c.v.value === "number" ? String(c.v.value) : str(c.v.value);
    if (!raw) continue;
    const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(raw);
    if (!m) continue;
    const comp = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as LabResultRow["comparator"] | undefined);
    const n = parseFloat(m[2]);
    const conv = convert(c.analyte, n, str(c.v.unit), str(c.test.loinc));
    if (conv === undefined || !isFinite(conv)) continue;
    const value = conv === n ? n : round(conv, c.analyte === "ph" ? 3 : 2);
    const row: LabResultRow = {
      analyte: c.analyte,
      value,
      unit: UNIT[c.analyte],
      collected: c.collected,
      status: c.status === "preliminary" ? "preliminary" : "final",
      evidence: [],
    };
    if (comp) row.comparator = comp;
    if (c.analyte === "egfr") row.egfr_equation = egfrEquation(c.test, `${str(c.test.name) ?? ""} ${str(c.v.method) ?? ""}`);
    const loinc = str(c.test.loinc);
    if (loinc) row.loinc = loinc;
    addEvidence(row.evidence, c.doc.item.id, c.entryId);
    for (const o of all) addEvidence(row.evidence, o.doc.item.id, o.entryId);
    rows.push(row);
  }
  rows.sort((a, b) => (toInstant(a.collected) ?? 0) - (toInstant(b.collected) ?? 0) || a.analyte.localeCompare(b.analyte));
  return rows;
}

// ───────────────────────────── vitals ─────────────────────────────

function buildVitals(docs: Doc[]): VitalRow[] {
  interface V { ms: number; taken: string; e: Record<string, any>; doc: Doc; id: string }
  const byInstant = new Map<number, V[]>();
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      if (e.type !== "vitals") continue;
      const taken = str(e.taken);
      const ms = toInstant(taken);
      if (!taken || ms === undefined) continue;
      const hasBp = isObj(e.bp) && num(e.bp.systolic_mmhg) !== undefined && num(e.bp.diastolic_mmhg) !== undefined;
      if (!hasBp && num(e.heart_rate_bpm) === undefined && num(e.weight_kg) === undefined) continue;
      if (!byInstant.has(ms)) byInstant.set(ms, []);
      byInstant.get(ms)!.push({ ms, taken, e, doc, id });
    }
  }
  // The same measurement restated in several documents is one.
  const sets = [...byInstant.entries()].sort((a, b) => a[0] - b[0]);
  const rows: VitalRow[] = [];
  let groupStart: number | undefined;
  let cur: VitalRow | undefined;
  for (const [ms, copies] of sets) {
    const latest = copies[copies.length - 1].e;
    const bp = isObj(latest.bp) ? latest.bp : undefined;
    const sys = bp ? num(bp.systolic_mmhg) : undefined;
    const dia = bp ? num(bp.diastolic_mmhg) : undefined;
    const hr = num(latest.heart_rate_bpm);
    const wt = num(latest.weight_kg);
    if (cur && groupStart !== undefined && ms - groupStart <= 15 * 60000) {
      // Same vital-sign set; a later blood pressure is a repeat.
      if (sys !== undefined && dia !== undefined) {
        if (cur.systolic_mmhg === undefined) {
          cur.systolic_mmhg = sys;
          cur.diastolic_mmhg = dia;
          cur.local_time = localTime(copies[0].taken) ?? cur.local_time;
        } else if (cur.repeat_systolic_mmhg === undefined) {
          cur.repeat_systolic_mmhg = sys;
          cur.repeat_diastolic_mmhg = dia;
        }
      }
      if (cur.pulse_bpm === undefined && hr !== undefined) cur.pulse_bpm = hr;
      if (cur.weight_kg === undefined && wt !== undefined) cur.weight_kg = round(wt, 1);
      for (const c of copies) addEvidence(cur.evidence, c.doc.item.id, c.id);
      continue;
    }
    const lt = localTime(copies[0].taken);
    if (!lt) continue;
    cur = { setting: "hospital", local_time: lt, evidence: [] };
    groupStart = ms;
    if (sys !== undefined && dia !== undefined) {
      cur.systolic_mmhg = sys;
      cur.diastolic_mmhg = dia;
    }
    if (hr !== undefined) cur.pulse_bpm = hr;
    if (wt !== undefined) cur.weight_kg = round(wt, 1);
    for (const c of copies) addEvidence(cur.evidence, c.doc.item.id, c.id);
    rows.push(cur);
  }
  return rows;
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  let docs: Doc[];
  try {
    docs = currentDocs(items, asOf);
  } catch {
    return out;
  }
  try {
    out.medications = buildMedications(docs);
  } catch {
    out.medications = [];
  }
  try {
    const pa = buildProblemsAndAllergies(docs);
    out.problems = pa.problems;
    out.allergies = pa.allergies;
  } catch {
    out.problems = [];
    out.allergies = [];
  }
  try {
    out.labs = buildLabs(docs);
  } catch {
    out.labs = [];
  }
  try {
    out.vitals = buildVitals(docs);
  } catch {
    out.vitals = [];
  }
  return out;
}
