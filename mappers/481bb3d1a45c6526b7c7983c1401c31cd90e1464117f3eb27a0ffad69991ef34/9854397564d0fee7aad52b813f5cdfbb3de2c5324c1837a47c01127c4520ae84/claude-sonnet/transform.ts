import type { FolioItem, ViewRows, MedicationRow, VitalRow, Evidence, Sensitivity } from "../in/views/views";

const TZ = "America/Chicago";

function chicagoDate(iso: string): string | undefined {
  const t = Date.parse(iso);
  if (isNaN(t)) return undefined;
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(t));
  return p;
}

const BRANDS: Record<string, string> = {
  norvasc: "amlodipine", glucophage: "metformin", crestor: "rosuvastatin", jardiance: "empagliflozin",
  farxiga: "dapagliflozin", lasix: "furosemide", zestril: "lisinopril", prinivil: "lisinopril",
  cozaar: "losartan", lipitor: "atorvastatin", synthroid: "levothyroxine", levoxyl: "levothyroxine",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  levemir: "insulin detemir", humalog: "insulin lispro", novolog: "insulin aspart",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  zocor: "simvastatin", glucotrol: "glipizide", januvia: "sitagliptin", ozempic: "semaglutide",
  plavix: "clopidogrel", coreg: "carvedilol", lopressor: "metoprolol", toprol: "metoprolol",
  diovan: "valsartan", eliquis: "apixaban", xarelto: "rivaroxaban", zoloft: "sertraline",
  lexapro: "escitalopram", prozac: "fluoxetine", benadryl: "diphenhydramine", aldactone: "spironolactone",
  hydrodiuril: "hydrochlorothiazide", microzide: "hydrochlorothiazide", norco: "hydrocodone",
  trulicity: "dulaglutide", victoza: "liraglutide", actos: "pioglitazone", amaryl: "glimepiride",
  tenormin: "atenolol", vasotec: "enalapril", altace: "ramipril", ativan: "lorazepam", xanax: "alprazolam",
  wellbutrin: "bupropion", celexa: "citalopram", paxil: "paroxetine", klonopin: "clonazepam",
};
const GENERICS = new Set([
  "lisinopril", "amlodipine", "metformin", "glipizide", "rosuvastatin", "levothyroxine", "dapagliflozin",
  "empagliflozin", "furosemide", "losartan", "atorvastatin", "simvastatin", "sitagliptin", "semaglutide",
  "clopidogrel", "carvedilol", "metoprolol", "valsartan", "apixaban", "rivaroxaban", "sertraline",
  "escitalopram", "fluoxetine", "diphenhydramine", "spironolactone", "hydrochlorothiazide", "acetaminophen",
  "ibuprofen", "naproxen", "aspirin", "pioglitazone", "glimepiride", "atenolol", "enalapril", "ramipril",
  "lorazepam", "alprazolam", "bupropion", "citalopram", "paroxetine", "clonazepam", "liraglutide",
  "dulaglutide", "warfarin", "gabapentin", "omeprazole", "pantoprazole", "famotidine", "prednisone",
  "insulin glargine", "insulin lispro", "insulin aspart", "insulin detemir", "tamsulosin", "allopurinol",
  "ezetimibe", "pravastatin", "lovastatin", "hydralazine", "chlorthalidone", "bumetanide", "torsemide",
  "olmesartan", "irbesartan", "telmisartan", "candesartan", "diltiazem", "verapamil", "nifedipine",
  "canagliflozin", "ertugliflozin", "linagliptin", "saxagliptin", "tramadol", "trazodone", "mirtazapine",
  "venlafaxine", "duloxetine", "quetiapine", "aripiprazole", "lithium", "buspirone", "sertraline",
]);
const MENTAL = new Set([
  "sertraline", "escitalopram", "fluoxetine", "citalopram", "paroxetine", "bupropion", "lorazepam",
  "alprazolam", "clonazepam", "trazodone", "mirtazapine", "venlafaxine", "duloxetine", "quetiapine",
  "aripiprazole", "lithium", "buspirone",
]);
const SALTS = new Set([
  "sodium", "potassium", "calcium", "hydrochloride", "hcl", "maleate", "besylate", "tartrate", "succinate",
  "sulfate", "mesylate", "phosphate", "acetate", "citrate", "magnesium", "hydrobromide", "fumarate", "nitrate",
]);

function ingredientOf(m: any): string | undefined {
  const disp = m.picked_from_search?.display;
  if (typeof disp === "string" && disp.trim()) {
    const words: string[] = [];
    for (const w of disp.toLowerCase().split(/\s+/)) {
      if (/^[\d.(\[]/.test(w)) break;
      words.push(w);
    }
    const kept = words.filter((w) => !SALTS.has(w));
    const s = kept.join(" ").trim();
    if (s && !s.includes("/")) return s;
  }
  const name = String(m.name ?? "").toLowerCase().replace(/[^a-z ]/g, " ").trim().replace(/\s+/g, " ");
  if (!name) return undefined;
  if (BRANDS[name]) return BRANDS[name];
  if (GENERICS.has(name)) return name;
  const first = name.split(" ")[0];
  if (BRANDS[first]) return BRANDS[first];
  if (GENERICS.has(first)) return first;
  const two = name.split(" ").slice(0, 2).join(" ");
  if (GENERICS.has(two)) return two;
  return undefined;
}

function parseStrength(s: string | undefined): { value: number; unit: string } | undefined {
  if (!s) return undefined;
  const m = s.toLowerCase().match(/(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|g|units?|iu)\b/);
  if (!m) return undefined;
  let value = parseFloat(m[1]);
  let unit = m[2];
  if (unit === "g") { value *= 1000; unit = "mg"; }
  if (unit === "µg" || unit === "ug") unit = "mcg";
  if (unit === "unit" || unit === "iu") unit = "units";
  return { value, unit };
}

const NUMWORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5 };

function round(x: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(x * f) / f;
}

function dosing(m: any, picked: { value: number; unit: string } | undefined) {
  const how: string = String(m.how_i_take_it ?? "").toLowerCase();
  let strength = parseStrength(m.strength_text);
  const ps = parseStrength(m.picked_from_search?.display ? String(m.picked_from_search.display).replace(/(\d+(?:\.\d+)?)\s*MG/i, "$1 mg") : undefined);
  // prefer the picked product's strength when the typed one disagrees by a unit slip (e.g. 75 mg vs 0.075 mg)
  if (ps && (!strength || (strength.unit === "mg" && ps.unit === "mg" && Math.abs(strength.value - ps.value * 1000) < 1e-6))) {
    strength = ps;
  }
  if (strength && strength.unit === "mg" && strength.value < 1) strength = { value: round(strength.value * 1000, 3), unit: "mcg" };

  let dose: MedicationRow["dose"];
  if (!/\bor\b|-|to\s+\d/.test(how) || /^\s*$/.test(how)) {
    // explicit amount with a unit, e.g. "10 units", "500 mg", "5 mL"
    const ex = how.match(/(\d+(?:\.\d+)?)\s*(units?|mg|mcg|ml)\b/);
    if (ex) {
      const v = parseFloat(ex[1]);
      const u = ex[2];
      if (u.startsWith("unit")) dose = { value: v, unit: "units" };
      else if (u === "ml") dose = { value: v, unit: "mL" };
      else dose = { value: v, unit: u as "mg" | "mcg" };
    } else {
      let count: number | undefined;
      const c = how.match(/(\d+(?:\.\d+)?)\s*(?:x\s*)?(?:tab|cap|pill)/) || how.match(/\b(one|two|three|four|half)\s+(?:tab|cap|pill)/);
      if (c) count = NUMWORDS[c[1]] ?? parseFloat(c[1]);
      else if (!/\d/.test(how)) count = 1;
      else {
        const lead = how.match(/^\s*(\d+(?:\.\d+)?)\b(?!\s*(?:times|x|hours|hrs|days))/);
        if (lead) count = parseFloat(lead[1]);
      }
      if (count !== undefined && count > 0) {
        if (strength && (strength.unit === "mg" || strength.unit === "mcg")) {
          dose = { value: round(count * strength.value, 4), unit: strength.unit as "mg" | "mcg" };
        } else if (!strength) dose = { value: count, unit: "tablet" };
      }
    }
  }
  void picked;
  return dose;
}

function frequencyOf(how: string | undefined): MedicationRow["frequency"] | undefined {
  if (!how) return undefined;
  const h = how.toLowerCase();
  if (/as needed|\bprn\b|when needed|if needed|when i need/.test(h)) return "PRN";
  if (/week/.test(h)) return "QW";
  if (/three times|\btid\b|3 times|3x|morning,? (noon|lunch|midday|afternoon).*(evening|night|supper|dinner|bed)/.test(h)) return "TID";
  if (/twice|\bbid\b|2 times|2x|morning and (evening|supper|dinner|night|bed)|(evening|supper|dinner|night) and morning|breakfast and (supper|dinner)/.test(h)) return "BID";
  if (/bedtime|at night|\bqhs\b|before bed/.test(h) && !/morning/.test(h)) return "QHS";
  if (/once|daily|every day|each day|\bqd\b|morning|evening|supper|dinner|breakfast|noon/.test(h)) return "QD";
  if (/\bor\b|most days|every other|hours/.test(h)) return "other";
  return undefined;
}

function isHeld(note: string | undefined): boolean {
  if (!note) return false;
  return /\b(stop(ped)?|paus(e|ed|ing)|hold|held|off)\b.*\b(for now|for the moment|temporar|until|right now)\b|\b(paused|on hold|holding|hold off|told me to stop|told to stop)\b|for now/i.test(note);
}

function stopReason(note: string | undefined): MedicationRow["stop_reason"] | undefined {
  if (!note) return undefined;
  const n = note.toLowerCase();
  if (/side effect|reaction|allerg|made me (sick|dizzy|nauseous)|rash|cough|nausea|cramp|couldn'?t tolerate|can'?t tolerate|intoleran/.test(n)) return "adverse_reaction";
  if (/replaced|switched|changed to|instead|new (med|drug)/.test(n)) return "therapy_changed";
  if (/didn'?t work|not working|ineffective|no effect|wasn'?t helping/.test(n)) return "ineffective";
  if (/finished|course|completed|done with/.test(n)) return "course_complete";
  if (/chose|decided|didn'?t want|don'?t want|wanted to stop|my choice/.test(n)) return "patient_choice";
  return undefined;
}

function partialOk(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}(-\d{2}(-\d{2})?)?$/.test(s);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    // scope
    const scoped = (items || []).filter((it) => {
      const d = it && typeof it.recorded === "string" ? chicagoDate(it.recorded) : undefined;
      return d !== undefined && d <= asOf;
    });
    // retractions first; a retracted item's own supersedes do not count (it never existed)
    const retractedIds = new Set<string>();
    for (const it of scoped) for (const r of it.retracts ?? []) retractedIds.add(it.issuer + "|" + r);
    const dead = new Set<string>(retractedIds);
    for (const it of scoped) {
      if (retractedIds.has(it.issuer + "|" + it.id)) continue;
      for (const s of it.supersedes ?? []) dead.add(it.issuer + "|" + s);
    }
    const current = scoped.filter((it) => !dead.has(it.issuer + "|" + it.id) && it.payload && typeof it.payload === "object");

    // medications
    let latestList: FolioItem | undefined;
    for (const it of current) {
      const has = Object.values(it.payload).some((e: any) => e && e.type === "my_med");
      if (!has) continue;
      if (!latestList || it.recorded > latestList.recorded || (it.recorded === latestList.recorded && it.id > latestList.id)) latestList = it;
    }
    if (latestList) {
      const byKey = new Map<string, { row: MedicationRow; ev: string }>();
      let n = 0;
      for (const [eid, e] of Object.entries(latestList.payload) as [string, any][]) {
        if (!e || e.type !== "my_med" || typeof e.name !== "string") continue;
        const ingredient = ingredientOf(e);
        const note: string | undefined = typeof e.note === "string" ? e.note : undefined;
        const taking = e.status !== "stopped";
        let status: MedicationRow["status"] = taking ? "active" : "stopped";
        if (taking && isHeld(note)) status = "held";
        const row: MedicationRow = {
          drug_name: e.picked_from_search?.display ? String(e.picked_from_search.display) : e.name,
          status,
          patient_reported: true,
          evidence: [{ item_id: latestList.id, entry_id: eid }],
        };
        if (typeof e.name === "string" && !e.picked_from_search) row.drug_name = e.name;
        if (ingredient) row.ingredient = ingredient;
        const dose = dosing(e, undefined);
        if (dose) row.dose = dose;
        const f = frequencyOf(e.how_i_take_it);
        if (f) row.frequency = f;
        if (status === "stopped") {
          if (partialOk(e.stopped)) row.status_since = e.stopped;
          const sr = stopReason(note);
          if (sr) row.stop_reason = sr;
          if (note) row.status_reason_text = note;
        } else if (status === "held") {
          if (note) row.status_reason_text = note;
        } else if (partialOk(e.started)) row.status_since = e.started;
        if (e.kind === "over_the_counter") row.otc = true;
        if (ingredient && MENTAL.has(ingredient)) row.sensitivity = ["mental-health" as Sensitivity];
        const evDate = (partialOk(e.stopped) ? e.stopped : partialOk(e.started) ? e.started : "") as string;
        const key = ingredient ? "i:" + ingredient : "m:" + (n++);
        const prev = byKey.get(key);
        if (!prev || evDate >= prev.ev) {
          if (!prev || evDate > prev.ev || row.status !== "stopped" || prev.row.status === "stopped") byKey.set(key, { row, ev: evDate });
        }
      }
      for (const v of byKey.values()) out.medications.push(v.row);
    }

    // vitals
    type R = { row: VitalRow; src: "device" | "typed"; t: number; key: string };
    const cand: R[] = [];
    const toMin = (s: string) => Date.parse(s.slice(0, 16) + ":00Z") / 60000;
    const sorted = [...current].sort((a, b) => (a.id < b.id ? -1 : 1));
    for (const it of sorted) {
      for (const [eid, e] of Object.entries(it.payload) as [string, any][]) {
        if (!e || typeof e !== "object") continue;
        const ev: Evidence = [{ item_id: it.id, entry_id: eid }];
        if (e.type === "bp_reading" && typeof e.measured_at === "string" && typeof e.systolic_mmhg === "number" && typeof e.diastolic_mmhg === "number") {
          const t = toMin(e.measured_at);
          if (isNaN(t)) continue;
          const row: VitalRow = { setting: "home", local_time: e.measured_at.slice(0, 16), systolic_mmhg: e.systolic_mmhg, diastolic_mmhg: e.diastolic_mmhg, evidence: ev };
          if (typeof e.pulse_bpm === "number") row.pulse_bpm = e.pulse_bpm;
          cand.push({ row, src: e.entry_method === "typed" ? "typed" : "device", t, key: `bp|${e.systolic_mmhg}|${e.diastolic_mmhg}` });
        } else if (e.type === "glucose_reading" && typeof e.measured_at === "string" && typeof e.value === "number") {
          const t = toMin(e.measured_at);
          if (isNaN(t)) continue;
          const mg = e.unit === "mmol/L" ? Math.round(e.value * 18.016) : Math.round(e.value);
          const row: VitalRow = { setting: "home", local_time: e.measured_at.slice(0, 16), glucose_mg_dl: mg, evidence: ev };
          if (e.out_of_range === "HI" || e.out_of_range === "LO") row.glucose_out_of_range = e.out_of_range;
          cand.push({ row, src: e.entry_method === "typed" ? "typed" : "device", t, key: `glu|${mg}` });
        }
      }
    }
    for (const c of cand) {
      if (c.src === "typed" && cand.some((d) => d.src === "device" && d.key === c.key && Math.abs(d.t - c.t) <= 3)) continue;
      out.vitals.push(c.row);
    }
    out.vitals.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  } catch {
    // skip what cannot be read
  }
  return out;
}
