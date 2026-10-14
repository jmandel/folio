import type { FolioItem, ViewRows, MedicationRow, VitalRow, Sensitivity } from "../in/views/views";

const TZ = "America/Chicago";

function chicagoParts(ms: number): string {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const x of f.formatToParts(new Date(ms))) p[x.type] = x.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** Instant (ms) of the start of the day after `asOf` in America/Chicago. */
function endOfDayMs(asOf: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(asOf);
  if (!m) return Infinity;
  const next = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + 1));
  const want = next.toISOString().slice(0, 10) + "T00:00";
  for (const off of [5, 6]) {
    const ms = next.getTime() + off * 3600000;
    if (chicagoParts(ms) === want) return ms;
  }
  return next.getTime() + 6 * 3600000;
}

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  glucotrol: "glipizide", crestor: "rosuvastatin", lipitor: "atorvastatin", zocor: "simvastatin",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", farxiga: "dapagliflozin",
  jardiance: "empagliflozin", invokana: "canagliflozin", januvia: "sitagliptin", ozempic: "semaglutide",
  wegovy: "semaglutide", rybelsus: "semaglutide", victoza: "liraglutide", trulicity: "dulaglutide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", levemir: "insulin detemir",
  tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart", cozaar: "losartan",
  diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", lasix: "furosemide", bumex: "bumetanide",
  aldactone: "spironolactone", microzide: "hydrochlorothiazide", hctz: "hydrochlorothiazide",
  lopressor: "metoprolol", toprol: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  aleve: "naproxen", naprosyn: "naproxen", anaprox: "naproxen", advil: "ibuprofen", motrin: "ibuprofen",
  tylenol: "acetaminophen", bayer: "aspirin", plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine", celexa: "citalopram",
  wellbutrin: "bupropion", xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam",
  abilify: "aripiprazole", seroquel: "quetiapine", zyprexa: "olanzapine", lamictal: "lamotrigine",
  suboxone: "buprenorphine", subutex: "buprenorphine", vivitrol: "naltrexone", revia: "naltrexone",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", zantac: "ranitidine",
  pepcid: "famotidine", neurontin: "gabapentin", lyrica: "pregabalin", amaryl: "glimepiride",
  actos: "pioglitazone", prednisone: "prednisone", zetia: "ezetimibe", vasotec: "enalapril",
  altace: "ramipril", cardizem: "diltiazem", calan: "verapamil", catapres: "clonidine", apresoline: "hydralazine",
  flomax: "tamsulosin", fosamax: "alendronate", singulair: "montelukast", zyrtec: "cetirizine",
  claritin: "loratadine", benadryl: "diphenhydramine", allopurinol: "allopurinol", zyloprim: "allopurinol",
  entresto: "sacubitril/valsartan", kerendia: "finerenone", "vitamin d": "cholecalciferol", "vitamin d3": "cholecalciferol",
  "fish oil": "omega-3 fatty acids", "vitamin b12": "cyanocobalamin", "baby aspirin": "aspirin",
};
const SALTS = new Set(["hydrochloride", "hcl", "sodium", "potassium", "calcium", "maleate", "besylate", "tartrate",
  "succinate", "sulfate", "mesylate", "acetate", "citrate", "phosphate", "bromide", "hydrobromide", "magnesium",
  "fumarate", "nitrate", "disodium"]);
const FORMS = new Set(["oral", "tablet", "tablets", "capsule", "capsules", "pen", "injection", "solution", "extended",
  "release", "er", "xr", "sr", "tab", "cap", "pill", "pills", "mg", "mcg", "units", "ml"]);

function ingredientFromText(s: string): string | undefined {
  const words = s.toLowerCase().replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const w of words) {
    if (/\d/.test(w) || FORMS.has(w)) break;
    if (SALTS.has(w)) continue;
    out.push(w);
  }
  return out.length ? out.join(" ") : undefined;
}

function ingredientOf(name: string, display?: string): string | undefined {
  if (display) {
    const g = ingredientFromText(display);
    if (g) return g;
  }
  const cleaned = name.toLowerCase().replace(/[^a-z0-9/ ]/g, " ").replace(/\s+/g, " ").trim();
  if (BRANDS[cleaned]) return BRANDS[cleaned];
  const first = ingredientFromText(cleaned);
  if (first && BRANDS[first]) return BRANDS[first];
  const firstWord = cleaned.split(" ")[0];
  if (BRANDS[firstWord]) return BRANDS[firstWord];
  // a bare generic name: accept if it is a known generic
  const generics = new Set(Object.values(BRANDS));
  for (const cand of [cleaned, first, firstWord]) if (cand && generics.has(cand)) return cand;
  const gen2 = ["lisinopril", "amlodipine", "metformin", "glipizide", "rosuvastatin", "atorvastatin", "simvastatin",
    "pravastatin", "levothyroxine", "dapagliflozin", "empagliflozin", "losartan", "furosemide", "carvedilol",
    "naproxen", "ibuprofen", "aspirin", "insulin glargine", "insulin lispro", "insulin aspart", "metoprolol",
    "hydrochlorothiazide", "spironolactone", "glimepiride", "sitagliptin", "lithium", "trazodone", "buspirone",
    "tramadol", "oxycodone", "methadone", "naltrexone", "buprenorphine", "bupropion", "sertraline"];
  for (const g of gen2) if (cleaned === g || cleaned.startsWith(g + " ")) return g;
  return undefined;
}

const MENTAL = new Set(["sertraline", "escitalopram", "fluoxetine", "citalopram", "bupropion", "alprazolam", "lorazepam",
  "clonazepam", "diazepam", "aripiprazole", "quetiapine", "olanzapine", "lamotrigine", "lithium", "trazodone",
  "buspirone", "paroxetine", "venlafaxine", "duloxetine", "mirtazapine", "risperidone", "haloperidol"]);
const SUBSTANCE = new Set(["buprenorphine", "naltrexone", "methadone", "disulfiram", "acamprosate", "varenicline"]);

type Dose = { value: number; unit: "mg" | "mcg" | "units" | "mL" | "tablet" };

function parseStrength(s?: string): Dose | undefined {
  if (!s) return undefined;
  const m = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|g|units?|ml)\b(?!\s*\/)/i.exec(s);
  if (!m) return undefined;
  const v = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  if (u === "mg") return v < 0.1 ? { value: round(v * 1000), unit: "mcg" } : { value: v, unit: "mg" };
  if (u === "mcg" || u === "µg" || u === "ug") return { value: v, unit: "mcg" };
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u.startsWith("unit")) return { value: v, unit: "units" };
  if (u === "ml") return { value: v, unit: "mL" };
  return undefined;
}

const NUMWORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5 };

function round(v: number, d = 4): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function parseDose(strength: Dose | undefined, how?: string): Dose | undefined {
  const h = (how ?? "").toLowerCase();
  // explicit amount of insulin / liquid
  const am = /(\d+(?:\.\d+)?)\s*(units?|ml)\b/.exec(h);
  if (am) return { value: parseFloat(am[1]), unit: am[2].startsWith("unit") ? "units" : "mL" };
  if (/\d\s*(or|to|-)\s*\d|\bor\b.*\d|\d.*\bor\b/.test(h) && /\d/.test(h)) return undefined;
  if (/\b(one|two|three|four)\s+(or|to)\s+/.test(h)) return undefined;
  let count = 1;
  const cm = /\b(\d+(?:\.\d+)?|one|two|three|four|half)\s*(?:x\s*)?(?:tablets?|tabs?|pills?|capsules?|caps?)\b/.exec(h)
    ?? /\btake\s+(\d+(?:\.\d+)?|one|two|three|four)\b/.exec(h);
  if (cm) count = NUMWORDS[cm[1]] ?? parseFloat(cm[1]);
  else if (/\b(1\/2|half)\b/.test(h)) count = 0.5;
  if (!isFinite(count) || count <= 0) return undefined;
  if (strength && strength.unit !== "mL" && !(strength.unit === "units" && !am)) {
    return { value: round(strength.value * count), unit: strength.unit };
  }
  if (strength && strength.unit === "units") return undefined;
  if (!strength) return { value: count, unit: "tablet" };
  return undefined;
}

function parseFreq(how?: string): MedicationRow["frequency"] {
  if (!how) return undefined;
  const h = how.toLowerCase();
  if (/\b(as needed|prn|when needed|when i need|if needed|for pain)\b/.test(h)) return "PRN";
  if (/\b(week|weekly)\b/.test(h)) return "QW";
  if (/\b(three times|3 times|3x|tid|thrice)\b/.test(h)) return "TID";
  if (/\b(twice|two times|2 times|2x|bid)\b/.test(h)) return "BID";
  const times = ["morning", "noon", "lunch", "afternoon", "supper", "dinner", "evening", "breakfast", "night"]
    .filter((t) => h.includes(t));
  if (/\b(morning|breakfast)\b/.test(h) && /\b(supper|dinner|evening|night|bedtime)\b/.test(h)) return "BID";
  if (times.length >= 3) return "TID";
  if (/\b(bedtime|at night|before bed|nightly)\b/.test(h) && !/\b(morning|breakfast)\b/.test(h)) return "QHS";
  if (/\b(daily|once|every day|each day|morning|evening|supper|dinner|breakfast|noon|lunch|night|bedtime)\b/.test(h)) return "QD";
  return "other";
}

function stopReason(note?: string): MedicationRow["stop_reason"] {
  if (!note) return undefined;
  const n = note.toLowerCase();
  if (/side effect|reaction|rash|allerg|cough|nausea|dizzy|made me|cramp|swell|hives|sick|upset|ketoacid/.test(n)) return "adverse_reaction";
  if (/not working|didn'?t work|doesn'?t work|no help|ineffective|wasn'?t helping|not helping/.test(n)) return "ineffective";
  if (/switched|replaced|changed to|instead|new (med|pill)|swapped/.test(n)) return "therapy_changed";
  if (/finished|completed|course|done with/.test(n)) return "course_complete";
  if (/i decided|didn'?t want|chose|my choice|don'?t like|wanted to stop/.test(n)) return "patient_choice";
  return "other";
}

const HELD_RE = /\b(for now|on hold|paused?|pausing|hold off|holding|temporar|until (?:my|the|he|she|dr|doctor)|told me to (?:stop|hold|skip)|stop for)\b/i;

function dateKey(s?: string): string {
  return s ?? "";
}

function mapMeds(list: FolioItem): MedicationRow[] {
  const byIng = new Map<string, { row: MedicationRow; key: string; order: number }>();
  const rows: { row: MedicationRow; key: string; order: number }[] = [];
  let order = 0;
  for (const [eid, raw] of Object.entries(list.payload ?? {})) {
    const e: any = raw;
    order++;
    if (!e || e.type !== "my_med" || typeof e.name !== "string") continue;
    const display: string | undefined = e.picked_from_search?.display;
    const ingredient = ingredientOf(e.name, display);
    const strength = parseStrength(display && /\d/.test(display) ? display : undefined) ?? parseStrength(e.strength_text);
    const dose = parseDose(strength, e.how_i_take_it);
    const note: string | undefined = typeof e.note === "string" && e.note.trim() ? e.note : undefined;
    let status: MedicationRow["status"] = e.status === "stopped" ? "stopped" : "active";
    if (status === "active" && note && HELD_RE.test(note)) status = "held";
    const row: MedicationRow = {
      drug_name: display ?? e.name,
      status,
      patient_reported: true,
      evidence: [{ item_id: list.id, entry_id: eid }],
    };
    if (ingredient) row.ingredient = ingredient;
    if (e.picked_from_search?.rxnorm && display && !/\d/.test(display)) row.rxnorm_ingredient = String(e.picked_from_search.rxnorm);
    if (status === "stopped" && e.stopped) row.status_since = e.stopped;
    if (status === "active" && e.started) row.status_since = e.started;
    if (dose) row.dose = dose;
    const fr = parseFreq(e.how_i_take_it);
    if (fr) row.frequency = fr;
    if (status === "stopped") {
      const r = stopReason(note);
      if (r) row.stop_reason = r;
    }
    if ((status === "stopped" || status === "held") && note) row.status_reason_text = note;
    if (e.kind === "over_the_counter") row.otc = true;
    if (ingredient) {
      const s: Sensitivity[] = [];
      if (MENTAL.has(ingredient)) s.push("mental-health");
      if (SUBSTANCE.has(ingredient)) s.push("substance-use");
      if (s.length) row.sensitivity = s;
    }
    const key = dateKey(e.status === "stopped" ? (e.stopped ?? e.started) : e.started);
    const rec = { row, key, order };
    if (ingredient) {
      const prev = byIng.get(ingredient);
      if (!prev || key > prev.key || (key === prev.key && order > prev.order)) byIng.set(ingredient, rec);
    } else rows.push(rec);
  }
  return [...byIng.values(), ...rows].sort((a, b) => a.order - b.order).map((x) => x.row);
}

function isNum(x: any): x is number {
  return typeof x === "number" && isFinite(x);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  const limit = endOfDayMs(asOf);
  const inScope = (items ?? []).filter((it) => {
    const t = Date.parse(it?.recorded);
    return it && isFinite(t) && t < limit;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const id of it.supersedes ?? []) dead.add(it.issuer + "|" + id);
    for (const id of it.retracts ?? []) dead.add(it.issuer + "|" + id);
  }
  const current = inScope.filter((it) => !dead.has(it.issuer + "|" + it.id));

  // medications: latest My Medicines snapshot
  const lists = current.filter((it) =>
    Object.values(it.payload ?? {}).some((e: any) => e && e.type === "my_med"));
  lists.sort((a, b) => (Date.parse(a.recorded) - Date.parse(b.recorded)) || (a.id < b.id ? -1 : 1));
  if (lists.length) out.medications = mapMeds(lists[lists.length - 1]);

  // vitals
  type V = { row: VitalRow; device: boolean; ms: number; kind: "bp" | "glu"; sig: string };
  const vs: V[] = [];
  for (const it of current) {
    for (const [eid, raw] of Object.entries(it.payload ?? {})) {
      const e: any = raw;
      if (!e || typeof e.measured_at !== "string") continue;
      const lt = e.measured_at.slice(0, 16);
      const ms = Date.parse(lt + ":00Z");
      if (!isFinite(ms)) continue;
      const evidence = [{ item_id: it.id, entry_id: eid }];
      if (e.type === "bp_reading" && isNum(e.systolic_mmhg) && isNum(e.diastolic_mmhg)) {
        const row: VitalRow = { setting: "home", local_time: lt, systolic_mmhg: e.systolic_mmhg, diastolic_mmhg: e.diastolic_mmhg, evidence };
        if (isNum(e.pulse_bpm)) row.pulse_bpm = e.pulse_bpm;
        vs.push({ row, device: e.entry_method === "cuff_sync", ms, kind: "bp", sig: `${e.systolic_mmhg}/${e.diastolic_mmhg}` });
      } else if (e.type === "glucose_reading" && isNum(e.value)) {
        const mg = e.unit === "mmol/L" ? e.value * 18.016 : e.value;
        const row: VitalRow = { setting: "home", local_time: lt, glucose_mg_dl: Math.round(mg), evidence };
        if (e.out_of_range === "HI" || e.out_of_range === "LO") row.glucose_out_of_range = e.out_of_range;
        vs.push({ row, device: e.entry_method === "meter_sync", ms, kind: "glu", sig: String(row.glucose_mg_dl) });
      }
    }
  }
  const dropped = new Set<V>();
  for (const a of vs) {
    if (a.device || dropped.has(a)) continue;
    const twin = vs.find((b) => b.device && !dropped.has(b) && b.kind === a.kind && b.sig === a.sig && Math.abs(b.ms - a.ms) <= 5 * 60000);
    if (twin) dropped.add(a);
  }
  out.vitals = vs.filter((v) => !dropped.has(v)).sort((a, b) => a.ms - b.ms).map((v) => v.row);
  return out;
}
