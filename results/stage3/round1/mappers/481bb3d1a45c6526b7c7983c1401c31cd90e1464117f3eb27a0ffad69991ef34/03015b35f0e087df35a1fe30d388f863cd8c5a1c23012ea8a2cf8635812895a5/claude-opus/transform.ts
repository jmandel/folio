import type { FolioItem, ViewRows, MedicationRow, VitalRow, Evidence } from "../in/views/views";

// HomeLog (patient diary app) -> consumer views.
// Day pages give home BP / glucose readings (vitals). My Medicines saves give the patient's own list
// (medications). Dose logs and diary notes produce no rows: dose logs are partial by design and diary
// notes are free text with patient-picked symptom tags, not a problem list.

const TZ = "America/Chicago";

// ─── helpers ────────────────────────────────────────────────────────────────────────────────────

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x : undefined;
}
function num(x: unknown): number | undefined {
  return typeof x === "number" && Number.isFinite(x) ? x : undefined;
}

let dateFmt: Intl.DateTimeFormat | undefined;
/** Local (America/Chicago) date `YYYY-MM-DD` of an RFC 3339 instant, or undefined. */
function chicagoDate(instant: string): string | undefined {
  const t = Date.parse(instant);
  if (Number.isNaN(t)) return undefined;
  if (!dateFmt) {
    dateFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  }
  const parts = dateFmt.formatToParts(new Date(t));
  const get = (k: string) => parts.find((p) => p.type === k)?.value ?? "";
  const y = get("year"), m = get("month"), d = get("day");
  if (!/^\d{4}$/.test(y) || !/^\d{2}$/.test(m) || !/^\d{2}$/.test(d)) return undefined;
  return `${y}-${m}-${d}`;
}

/** HomeLog wall time `YYYY-MM-DDTHH:MM` (seconds tolerated and dropped). */
function wallTime(x: unknown): string | undefined {
  if (typeof x !== "string") return undefined;
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?$/.exec(x.trim());
  return m ? `${m[1]}T${m[2]}` : undefined;
}
/** Minutes since epoch for a wall time, treating it as a naive clock (for differences only). */
function wallMinutes(t: string): number {
  const ms = Date.parse(t + ":00Z");
  return Number.isNaN(ms) ? NaN : ms / 60000;
}

function partialDate(x: unknown): string | undefined {
  if (typeof x !== "string") return undefined;
  const s = x.trim();
  return /^\d{4}(-\d{2}(-\d{2})?)?$/.test(s) ? s : undefined;
}

// ─── correction rules / scope ───────────────────────────────────────────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = items.filter((it) => {
    if (!isObj(it) || typeof it.id !== "string" || typeof it.recorded !== "string") return false;
    const d = chicagoDate(it.recorded);
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const ref of [...(Array.isArray(it.supersedes) ? it.supersedes : []), ...(Array.isArray(it.retracts) ? it.retracts : [])]) {
      if (typeof ref !== "string") continue;
      for (const other of inScope) if (other.id === ref && other.issuer === it.issuer) dead.add(key(other));
    }
  }
  return inScope.filter((it) => !dead.has(key(it)));
}
function key(it: FolioItem): string {
  return `${it.issuer}\u0000${it.id}`;
}
function byRecorded(a: FolioItem, b: FolioItem): number {
  const ta = Date.parse(a.recorded), tb = Date.parse(b.recorded);
  if (ta !== tb) return ta < tb ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function entries(it: FolioItem): [string, Record<string, any>][] {
  if (!isObj(it.payload)) return [];
  return Object.keys(it.payload)
    .sort()
    .filter((k) => isObj(it.payload[k]))
    .map((k) => [k, it.payload[k] as Record<string, any>]);
}

function isMedList(it: FolioItem): boolean {
  if (entries(it).some(([, e]) => e.type === "my_med")) return true;
  return /^\s*my medicines\b/i.test(typeof it.narrative === "string" ? it.narrative : "");
}

// ─── entry point ────────────────────────────────────────────────────────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  const day = typeof asOf === "string" ? /^\s*(\d{4}-\d{2}-\d{2})/.exec(asOf)?.[1] : undefined;
  if (!Array.isArray(items) || !day) return out;
  const current = currentItems(items, day).sort(byRecorded);

  const lists = current.filter(isMedList);
  const days = current.filter((it) => !isMedList(it));

  try {
    if (lists.length) out.medications = medications(lists[lists.length - 1]);
  } catch {
    out.medications = [];
  }
  try {
    out.vitals = vitals(days);
  } catch {
    out.vitals = [];
  }
  return out;
}

// ─── vitals ─────────────────────────────────────────────────────────────────────────────────────

interface Reading {
  kind: "bp" | "glu";
  time: string;
  typed: boolean;
  sys?: number;
  dia?: number;
  pulse?: number;
  mgdl?: number;
  oor?: "HI" | "LO";
  ev: { item_id: string; entry_id: string };
}

const MMOL_TO_MGDL = 18.016;
const DUP_WINDOW_MIN = 10;

function vitals(days: FolioItem[]): VitalRow[] {
  // A day page restates the whole day; if two current pages claim the same day, keep the later one.
  const byDay = new Map<string, FolioItem>();
  const undated: FolioItem[] = [];
  for (const it of days) {
    const d = partialDate(it.effective);
    if (d && d.length === 10) byDay.set(d, it); // days are sorted by recorded, later wins
    else undated.push(it);
  }
  const pages = [...byDay.values(), ...undated];

  const readings: Reading[] = [];
  for (const it of pages) {
    for (const [id, e] of entries(it)) {
      const r = readEntry(it.id, id, e);
      if (r) readings.push(r);
    }
  }

  // Drop typed copies of a device reading (same values, within a few minutes); prefer the device copy.
  const dropped = new Set<Reading>();
  for (const dev of readings.filter((r) => !r.typed)) {
    const tDev = wallMinutes(dev.time);
    let best: Reading | undefined;
    let bestGap = Infinity;
    for (const t of readings) {
      if (!t.typed || dropped.has(t) || t.kind !== dev.kind) continue;
      const gap = Math.abs(wallMinutes(t.time) - tDev);
      if (!(gap <= DUP_WINDOW_MIN) || gap >= bestGap) continue;
      if (!sameValues(dev, t)) continue;
      best = t;
      bestGap = gap;
    }
    if (best) dropped.add(best);
  }

  const rows: VitalRow[] = [];
  for (const r of readings) {
    if (dropped.has(r)) continue;
    const row: VitalRow = { setting: "home", local_time: r.time, evidence: [r.ev] };
    if (r.kind === "bp") {
      row.systolic_mmhg = r.sys;
      row.diastolic_mmhg = r.dia;
      if (r.pulse !== undefined) row.pulse_bpm = r.pulse;
    } else {
      row.glucose_mg_dl = r.mgdl;
      if (r.oor) row.glucose_out_of_range = r.oor;
    }
    rows.push(row);
  }
  rows.sort((a, b) =>
    a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 :
    a.evidence[0].item_id + a.evidence[0].entry_id < b.evidence[0].item_id + b.evidence[0].entry_id ? -1 : 1);
  return rows;
}

function sameValues(a: Reading, b: Reading): boolean {
  if (a.kind === "bp") {
    if (a.sys !== b.sys || a.dia !== b.dia) return false;
    return a.pulse === undefined || b.pulse === undefined || a.pulse === b.pulse;
  }
  return a.mgdl === b.mgdl && a.oor === b.oor;
}

function readEntry(itemId: string, entryId: string, e: Record<string, any>): Reading | undefined {
  const ev = { item_id: itemId, entry_id: entryId };
  if (e.type === "bp_reading") {
    const time = wallTime(e.measured_at);
    const sys = num(e.systolic_mmhg), dia = num(e.diastolic_mmhg);
    if (!time || sys === undefined || dia === undefined || sys <= 0 || dia <= 0) return undefined;
    const pulse = num(e.pulse_bpm);
    return {
      kind: "bp", time, typed: e.entry_method !== "cuff_sync", sys, dia,
      pulse: pulse !== undefined && pulse > 0 ? pulse : undefined, ev,
    };
  }
  if (e.type === "glucose_reading") {
    const time = wallTime(e.measured_at);
    const value = num(e.value);
    if (!time || value === undefined) return undefined;
    const unit = typeof e.unit === "string" ? e.unit.trim().toLowerCase() : "";
    const oor = e.out_of_range === "HI" || e.out_of_range === "LO" ? (e.out_of_range as "HI" | "LO") : undefined;
    let mgdl: number;
    if (oor) {
      // `value` is the meter's display limit, not a measurement; report the limit in mg/dL.
      mgdl = oor === "HI" ? 600 : 20;
    } else if (unit === "mg/dl") {
      // Outside a meter's measurable range: not a readable value (meter would show HI/LO).
      if (value < 20 || value > 600) return undefined;
      mgdl = Math.round(value);
    } else if (unit === "mmol/l") {
      if (value < 1.1 || value > 33.3) return undefined;
      mgdl = Math.round(value * MMOL_TO_MGDL);
    } else return undefined;
    return { kind: "glu", time, typed: e.entry_method !== "meter_sync", mgdl, oor, ev };
  }
  return undefined;
}

// ─── medications ────────────────────────────────────────────────────────────────────────────────

function medications(list: FolioItem): MedicationRow[] {
  const cands: { row: MedicationRow; key: string; eventDate?: string; taking: boolean }[] = [];
  for (const [id, e] of entries(list)) {
    if (e.type !== "my_med") continue;
    const c = medRow(list.id, id, e);
    if (c) cands.push(c);
  }
  // One row per ingredient: keep the entry whose own latest event is latest.
  const chosen = new Map<string, (typeof cands)[number]>();
  for (const c of cands) {
    const prev = chosen.get(c.key);
    if (!prev || laterEntry(c, prev)) chosen.set(c.key, c);
  }
  return [...chosen.values()].map((c) => c.row);
}

function laterEntry(
  a: { eventDate?: string; taking: boolean },
  b: { eventDate?: string; taking: boolean },
): boolean {
  const da = a.eventDate, db = b.eventDate;
  if (da && db && !da.startsWith(db) && !db.startsWith(da)) return da > db;
  // Undecidable by dates: the patient's "taking" entry is the current one.
  if (a.taking !== b.taking) return a.taking;
  return false;
}

function medRow(itemId: string, entryId: string, e: Record<string, any>) {
  const name = str(e.name);
  const search = isObj(e.picked_from_search) ? e.picked_from_search : undefined;
  const display = search ? str(search.display) : undefined;
  const drugName = name ?? display;
  if (!drugName) return undefined;

  const searchIng = display ? ingredientFromDisplay(display) : undefined;
  const ingredient = searchIng?.ingredient ?? ingredientFromName(name ?? "");
  const rxIng = searchIng?.ingredientLevel && search && str(search.rxnorm) && /^\d+$/.test(String(search.rxnorm).trim())
    ? String(search.rxnorm).trim() : undefined;

  const note = str(e.note)?.trim();
  const how = str(e.how_i_take_it) ?? "";
  const started = partialDate(e.started);
  const stoppedDate = partialDate(e.stopped);

  let status: MedicationRow["status"];
  if (e.status === "stopped") status = note && looksPaused(note, true) ? "held" : "stopped";
  else if (e.status === "taking") status = note && looksPaused(note, false) ? "held" : "active";
  else status = "unknown";

  const row: MedicationRow = { drug_name: drugName.trim(), status, patient_reported: true, evidence: [{ item_id: itemId, entry_id: entryId }] };
  if (ingredient) row.ingredient = ingredient;
  if (rxIng) row.rxnorm_ingredient = rxIng;

  if (status === "active" && started) row.status_since = started;
  if ((status === "stopped" || status === "held") && e.status === "stopped" && stoppedDate) row.status_since = stoppedDate;

  const dose = parseDose(how, str(e.strength_text) ?? "", display ?? "");
  if (dose && !(ingredient && /^(levothyroxine|liothyronine)$/.test(ingredient) && dose.unit === "mg" && dose.value >= 1)) {
    row.dose = dose;
  }
  const freq = parseFrequency(how);
  if (freq) row.frequency = freq;

  if (status === "stopped" || status === "held") {
    if (note) row.status_reason_text = note;
    if (status === "stopped" && note) {
      const r = stopReason(note);
      if (r) row.stop_reason = r;
    }
  }
  if (e.kind === "over_the_counter") row.otc = true;

  return {
    row,
    key: ingredient ? `ing:${ingredient}` : `id:${str(e.homelog_med_id) ?? entryId}`,
    eventDate: e.status === "stopped" ? stoppedDate ?? started : started,
    taking: e.status === "taking",
  };
}

// ─── medication text parsing ────────────────────────────────────────────────────────────────────

function looksPaused(note: string, stopped: boolean): boolean {
  const n = note.toLowerCase();
  if (/\b(paus(e|ed|ing)|on hold|holding|held|temporar(y|ily)|for now|for a (few|couple)|until (after|my|the|i|surgery|procedure|told)|break from|hold (it|off))\b/.test(n)) {
    return !/\b(not|never|no longer) (paus|on hold|held|holding)/.test(n);
  }
  if (stopped && /\b(restart|resume|start again|go back on|back on it (after|when))/.test(n)) return true;
  return false;
}

function stopReason(note: string): MedicationRow["stop_reason"] | undefined {
  const n = note.toLowerCase();
  if (/\b(switch(ed)?|chang(e|ed)) (to|over to)\b|\breplaced\b|\binstead\b|\bnew (med|medicine|pill)\b/.test(n)) return "therapy_changed";
  if (/side effect|allerg|rash|hives|itch|cough|swell|dizz|nause|vomit|diarr|upset stomach|stomach (upset|pain|ache)|made me|gave me|muscle (ache|pain)|cramp|headache|low (blood )?sugar|hypo\b|tired|fatigue|reaction|bleed|yeast|infection|constipat|gas\b|bloat|weight gain|palpitat|swollen|angioedema/.test(n)) return "adverse_reaction";
  if (/(did ?n[o']?t|does ?n[o']?t|was ?n[o']?t|not) (work|help)|ineffective|no (effect|help|difference)|stopped working/.test(n)) return "ineffective";
  if (/\b(finished|completed|course (done|over|complete)|done with (the )?(course|it)|ran its course)\b/.test(n)) return "course_complete";
  if (/\b(i (decided|chose|didn'?t want|don'?t want|did not want)|my (choice|decision)|too expensive|cost|could ?n'?t afford|can'?t afford|insurance)\b/.test(n)) return "patient_choice";
  return undefined;
}

const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5, "a half": 0.5 };

function normUnit(u: string): "mg" | "mcg" | "units" | "mL" | "tablet" | undefined {
  const s = u.toLowerCase();
  if (s === "mg") return "mg";
  if (s === "mcg" || s === "ug" || s === "µg" || s === "μg") return "mcg";
  if (/^(units?|u|iu|unt)$/.test(s)) return "units";
  if (s === "ml") return "mL";
  if (/^(tablets?|tabs?|pills?|capsules?|caps?)$/.test(s)) return "tablet";
  return undefined;
}

function parseDose(how: string, strength: string, display: string): MedicationRow["dose"] | undefined {
  const unitRe = "(units?|iu|unt|u|mg|mcg|ug|µg|μg|ml|tablets?|tabs?|pills?|capsules?|caps?)";
  const re = new RegExp(`(\\d+(?:\\.\\d+)?|one|two|three|four)\\s*${unitRe}(?![a-z/])`, "gi");
  const found: { value: number; unit: NonNullable<ReturnType<typeof normUnit>> }[] = [];
  for (const m of how.matchAll(re)) {
    const v = /^\d/.test(m[1]) ? Number(m[1]) : WORD_NUM[m[1].toLowerCase()];
    const u = normUnit(m[2]);
    if (v !== undefined && u && v > 0) found.push({ value: v, unit: u });
  }
  if (found.length) {
    const first = found[0];
    return found.every((f) => f.value === first.value && f.unit === first.unit) ? first : undefined;
  }
  const tabletForm = /tablet|capsule/i.test(display) || /^\s*\d+(\.\d+)?\s*(mg|mcg)\s*$/i.test(strength);
  // A bare count ("2 when my back hurts") on a tablet medicine: number of tablets.
  const bare = /^\s*(\d+|one|two|three|four)\b(?!\s*(x|times|hours?|hrs?|days?|weeks?|am|pm|:|\/|%))/i.exec(how);
  if (bare) {
    const v = /^\d/.test(bare[1]) ? Number(bare[1]) : WORD_NUM[bare[1].toLowerCase()];
    if (tabletForm && v > 0 && v <= 10) return { value: v, unit: "tablet" };
    return undefined;
  }
  if (/\d/.test(how) && !/\b\d{1,2}(:\d{2})?\s*(am|pm)\b/i.test(how)) return undefined;
  // No amount in how they take it: one unit of the stated single strength.
  const s = /^\s*(\d+(?:\.\d+)?)\s*(mg|mcg|ug|µg|units?|ml)\b(?!\s*\/)\s*([a-z ]*)$/i.exec(strength);
  if (s && !/\bper\b/i.test(s[3])) {
    const u = normUnit(s[2]);
    const v = Number(s[1]);
    if (u && v > 0) return { value: v, unit: u };
  }
  return undefined;
}

function parseFrequency(how: string): MedicationRow["frequency"] | undefined {
  const h = how.toLowerCase();
  if (!h.trim()) return undefined;
  if (/\b(as needed|when needed|if needed|prn|as required|when (my|i|the|it|i'm|im)\b|if (my|i)\b|only when)/.test(h)) return "PRN";
  if (/\b(once a week|once weekly|weekly|every week|each week|1x ?(a|per) ?week|every (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|on (mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays))\b/.test(h)) return "QW";
  if (/\b(every other day|every \d+ (days|weeks)|twice a week|2 times a week|three times a week|times a week|monthly|a month)\b/.test(h)) return "other";
  if (/\b(three times|3 times|3x|tid|thrice)\b/.test(h)) return "TID";
  if (/\b(twice|two times|2 times|2x|bid|every 12 h)/.test(h)) return "BID";
  if (/\b(four times|4 times|4x|qid|every [2-8] h)/.test(h)) return "other";
  if (/\b(once a day|once daily|1x ?(a|per) ?day|every day|daily|qd|each day)\b/.test(h)) {
    return /\b(bedtime|before bed|at night|nightly)\b/.test(h) ? "QHS" : "QD";
  }
  let slots = 0;
  const morning = /\b(morning|breakfast|am|a\.m\.|wake|waking)\b/.test(h);
  const noon = /\b(noon|lunch|midday|afternoon)\b/.test(h);
  const evening = /\b(evening|supper|dinner|pm|p\.m\.)\b/.test(h);
  const bed = /\b(bedtime|before bed|at night|nightly|night)\b/.test(h);
  slots = [morning, noon, evening, bed].filter(Boolean).length;
  if (slots === 1) return bed ? "QHS" : "QD";
  if (slots === 2) return "BID";
  if (slots === 3) return "TID";
  if (slots >= 4) return "other";
  return undefined;
}

// ─── ingredient names ───────────────────────────────────────────────────────────────────────────

const SALTS = new Set([
  "hydrochloride", "hcl", "potassium", "sodium", "calcium", "magnesium", "maleate", "besylate", "mesylate",
  "succinate", "tartrate", "citrate", "sulfate", "fumarate", "acetate", "hyclate", "monohydrate", "dihydrate",
  "trihydrate", "bromide", "phosphate", "propionate", "furoate", "dipropionate", "hydrobromide", "bitartrate",
  "malate", "lactate", "gluconate", "nitrate", "anhydrous", "disodium", "monosodium", "medoxomil", "pivoxil",
  "camsylate", "tosylate", "xinafoate", "valerate", "erbumine", "hemifumarate", "oxalate", "mononitrate",
]);

// Brand names (and common generic spellings) -> generic ingredient.
const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  "glucophage xr": "metformin", glumetza: "metformin", fortamet: "metformin", zoloft: "sertraline",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", euthyrox: "levothyroxine",
  tirosint: "levothyroxine", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", rezvoglar: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", admelog: "insulin lispro", lyumjev: "insulin lispro", novolog: "insulin aspart",
  fiasp: "insulin aspart", apidra: "insulin glulisine", lipitor: "atorvastatin", crestor: "rosuvastatin",
  zocor: "simvastatin", pravachol: "pravastatin", livalo: "pitavastatin", farxiga: "dapagliflozin",
  jardiance: "empagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin", trulicity: "dulaglutide",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", victoza: "liraglutide",
  saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide", byetta: "exenatide",
  bydureon: "exenatide", januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin",
  nesina: "alogliptin", glucotrol: "glipizide", "glucotrol xl": "glipizide", amaryl: "glimepiride",
  diabeta: "glyburide", glynase: "glyburide", micronase: "glyburide", actos: "pioglitazone", cozaar: "losartan",
  diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan", atacand: "candesartan",
  vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", accupril: "quinapril", toprol: "metoprolol",
  "toprol xl": "metoprolol", lopressor: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  bystolic: "nebivolol", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide",
  microzide: "hydrochlorothiazide", hctz: "hydrochlorothiazide", aldactone: "spironolactone",
  inspra: "eplerenone", kerendia: "finerenone", cardizem: "diltiazem", procardia: "nifedipine",
  adalat: "nifedipine", catapres: "clonidine", apresoline: "hydralazine", advil: "ibuprofen", motrin: "ibuprofen",
  aleve: "naproxen", naprosyn: "naproxen", tylenol: "acetaminophen", paracetamol: "acetaminophen",
  bayer: "aspirin", ecotrin: "aspirin", celebrex: "celecoxib", mobic: "meloxicam", ultram: "tramadol",
  neurontin: "gabapentin", lyrica: "pregabalin", prozac: "fluoxetine", lexapro: "escitalopram",
  celexa: "citalopram", paxil: "paroxetine", wellbutrin: "bupropion", cymbalta: "duloxetine",
  effexor: "venlafaxine", desyrel: "trazodone", remeron: "mirtazapine", prilosec: "omeprazole",
  nexium: "esomeprazole", protonix: "pantoprazole", prevacid: "lansoprazole", pepcid: "famotidine",
  zantac: "ranitidine", plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", jantoven: "warfarin", lanoxin: "digoxin", zyloprim: "allopurinol", uloric: "febuxostat",
  colcrys: "colchicine", flomax: "tamsulosin", proscar: "finasteride", zyrtec: "cetirizine", claritin: "loratadine",
  allegra: "fexofenadine", benadryl: "diphenhydramine", singulair: "montelukast", proair: "albuterol",
  ventolin: "albuterol", "proair hfa": "albuterol", "ventolin hfa": "albuterol", flonase: "fluticasone",
  zetia: "ezetimibe", entresto: "sacubitril / valsartan", ambien: "zolpidem", xanax: "alprazolam",
  ativan: "lorazepam", klonopin: "clonazepam", deltasone: "prednisone", imodium: "loperamide",
  miralax: "polyethylene glycol 3350", colace: "docusate", senokot: "sennosides", "k-dur": "potassium chloride",
  "klor-con": "potassium chloride", veltassa: "patiromer", lokelma: "sodium zirconium cyclosilicate",
  renvela: "sevelamer", phoslo: "calcium acetate", sensipar: "cinacalcet", calcitriol: "calcitriol",
  rocaltrol: "calcitriol",
};

const GENERICS = new Set<string>([
  ...Object.values(BRANDS),
  "metformin", "glipizide", "losartan", "lisinopril", "amlodipine", "insulin", "aspirin", "levothyroxine",
  "atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin", "furosemide",
  "hydrochlorothiazide", "chlorthalidone", "metoprolol", "carvedilol", "dapagliflozin", "empagliflozin",
  "semaglutide", "dulaglutide", "sertraline", "ibuprofen", "naproxen", "acetaminophen", "omeprazole",
  "gabapentin", "allopurinol", "prednisone", "warfarin", "apixaban", "insulin glargine", "insulin lispro",
  "insulin aspart", "insulin detemir", "insulin degludec", "nph insulin", "insulin isophane", "spironolactone",
  "tamsulosin", "cholecalciferol", "ergocalciferol", "sodium bicarbonate", "ferrous sulfate", "magnesium oxide",
]);

function cleanIngredient(raw: string): string {
  let words = raw.toLowerCase().replace(/\[[^\]]*\]/g, " ").replace(/[,;()]/g, " ").split(/\s+/).filter(Boolean);
  // Strip trailing salt words, but never down to nothing.
  while (words.length > 1 && SALTS.has(words[words.length - 1])) words = words.slice(0, -1);
  const s = words.join(" ");
  return BRANDS[s] ?? s;
}

/** Ingredient from an RxNorm display ("losartan potassium 50 MG Oral Tablet", "dulaglutide"). */
function ingredientFromDisplay(display: string): { ingredient: string; ingredientLevel: boolean } | undefined {
  const d = display.trim();
  const brand = /\[([^\]]+)\]/.exec(d)?.[1];
  const head = d.replace(/\[[^\]]*\]/g, " ").trim();
  // Words before the first strength number are the ingredient(s); a combination is "a / b".
  const parts = head.split(/\s+\/\s+/).map((p) => {
    const m = /^(.*?)\s+\d/.exec(p);
    return (m ? m[1] : p).trim();
  });
  const formWords = /\b(oral|tablet|capsule|injectable|injection|solution|suspension|pen|inhaler|topical|cream|extended|release|delayed|chewable|prefilled|syringe|patch|spray|drops?|product|pack|kit)\b/i;
  const cleaned = parts
    .map((p) => p.replace(new RegExp(formWords.source + ".*$", "i"), "").trim())
    .filter(Boolean)
    .map(cleanIngredient);
  let ingredient = cleaned.join(" / ");
  if (!ingredient && brand) ingredient = BRANDS[brand.toLowerCase()] ?? "";
  if (!ingredient) return undefined;
  const ingredientLevel = !/\d/.test(head) && !formWords.test(head) && !brand && parts.length === 1;
  return { ingredient, ingredientLevel };
}

const VAGUE = /\b(pill|pills|medicine|medication|meds?|shot|shots|tablet|tablets|drops|the|my|for|water|sugar|pressure|heart|sleeping|stuff|unknown|something|vitamins)\b|\?/i;

/** Ingredient from a typed name ("Glucophage", "Metformin ER 500mg"); undefined when it doesn't say which drug. */
function ingredientFromName(name: string): string | undefined {
  const base = name
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b\d+(\.\d+)?\s*(mg|mcg|ug|units?|ml|%)?\b.*$/, "")
    .replace(/\b(er|xr|xl|sr|cr|la|dr|ec|hfa|odt|tabs?|tablets?|caps?|capsules?|pen|flexpen|kwikpen|solostar|inhaler)\b/g, " ")
    .replace(/[^a-z\s\-\/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!base) return undefined;
  const whole = name.toLowerCase().replace(/\s+/g, " ").trim();
  if (BRANDS[whole]) return BRANDS[whole];
  if (BRANDS[base]) return BRANDS[base];
  if (GENERICS.has(base)) return base;
  const cleaned = cleanIngredient(base);
  if (GENERICS.has(cleaned)) return cleaned;
  const first = base.split(" ")[0];
  if (BRANDS[first]) return BRANDS[first];
  // Close misspelling of a known name.
  const fuzzy = fuzzyLookup(base);
  if (fuzzy) return fuzzy;
  if (VAGUE.test(base)) return undefined;
  return cleaned;
}

function fuzzyLookup(s: string): string | undefined {
  if (s.length < 6) return undefined;
  const limit = s.length >= 9 ? 2 : 1;
  let best: string | undefined;
  let bestD = Infinity;
  let tie = false;
  const consider = (cand: string, target: string) => {
    const d = lev(s, cand, limit);
    if (d > limit) return;
    if (d < bestD) { bestD = d; best = target; tie = false; }
    else if (d === bestD && best !== target) tie = true;
  };
  for (const b of Object.keys(BRANDS)) consider(b, BRANDS[b]);
  for (const g of GENERICS) consider(g, g);
  return tie ? undefined : best;
}

function lev(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}
