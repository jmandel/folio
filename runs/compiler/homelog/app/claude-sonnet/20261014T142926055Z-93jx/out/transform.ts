import type { FolioItem, ViewRows, MedicationRow, VitalRow, Evidence, Sensitivity } from "../in/views/views";

const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" });

function chicagoDate(iso: string): string | undefined {
  const t = Date.parse(iso);
  if (isNaN(t)) return undefined;
  const p = fmt.formatToParts(new Date(t));
  const g = (k: string) => p.find((x) => x.type === k)?.value ?? "";
  return `${g("year")}-${g("month")}-${g("day")}`;
}

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = items.filter((it) => {
    const d = it && typeof it.recorded === "string" ? chicagoDate(it.recorded) : undefined;
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const id of it.supersedes ?? []) dead.add(it.issuer + "|" + id);
    for (const id of it.retracts ?? []) dead.add(it.issuer + "|" + id);
  }
  return inScope.filter((it) => !dead.has(it.issuer + "|" + it.id));
}

function isNum(x: unknown): x is number {
  return typeof x === "number" && isFinite(x);
}

function minutes(local: string): number | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local);
  if (!m) return undefined;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) / 60000;
}

// ───────────── vitals

interface Cand { row: VitalRow; device: boolean; kind: "bp" | "glu"; key: string; t: number }

function vitals(cur: FolioItem[]): VitalRow[] {
  const cands: Cand[] = [];
  for (const it of cur) {
    for (const [eid, e] of Object.entries(it.payload ?? {})) {
      if (!e || typeof e !== "object") continue;
      const ev: Evidence = [{ item_id: it.id, entry_id: eid }];
      if (e.type === "bp_reading") {
        const t = minutes(e.measured_at);
        if (t === undefined || !isNum(e.systolic_mmhg) || !isNum(e.diastolic_mmhg)) continue;
        const row: VitalRow = {
          setting: "home",
          local_time: String(e.measured_at).slice(0, 16),
          systolic_mmhg: e.systolic_mmhg,
          diastolic_mmhg: e.diastolic_mmhg,
          evidence: ev,
        };
        if (isNum(e.pulse_bpm)) row.pulse_bpm = e.pulse_bpm;
        cands.push({ row, device: e.entry_method === "cuff_sync", kind: "bp", key: `${e.systolic_mmhg}/${e.diastolic_mmhg}`, t });
      } else if (e.type === "glucose_reading") {
        const t = minutes(e.measured_at);
        if (t === undefined || !isNum(e.value)) continue;
        let mg: number;
        if (e.unit === "mmol/L") mg = Math.round(e.value * 18.016);
        else if (e.unit === "mg/dL") mg = Math.round(e.value);
        else continue;
        const row: VitalRow = { setting: "home", local_time: String(e.measured_at).slice(0, 16), glucose_mg_dl: mg, evidence: ev };
        if (e.out_of_range === "HI" || e.out_of_range === "LO") row.glucose_out_of_range = e.out_of_range;
        cands.push({ row, device: e.entry_method === "meter_sync", kind: "glu", key: `${mg}|${e.out_of_range ?? ""}`, t });
      }
    }
  }
  const out: VitalRow[] = [];
  for (const c of cands) {
    if (!c.device) {
      const dup = cands.some((d) => d.device && d.kind === c.kind && d.key === c.key && Math.abs(d.t - c.t) <= 3);
      if (dup) continue;
    }
    out.push(c.row);
  }
  out.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return out;
}

// ───────────── medications

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  crestor: "rosuvastatin", synthroid: "levothyroxine", levoxyl: "levothyroxine", jardiance: "empagliflozin",
  farxiga: "dapagliflozin", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  levemir: "insulin detemir", novolog: "insulin aspart", humalog: "insulin lispro", aleve: "naproxen",
  advil: "ibuprofen", motrin: "ibuprofen", tylenol: "acetaminophen", lasix: "furosemide", cozaar: "losartan",
  lipitor: "atorvastatin", zocor: "simvastatin", glucotrol: "glipizide", januvia: "sitagliptin",
  ozempic: "semaglutide", trulicity: "dulaglutide", coreg: "carvedilol", lopressor: "metoprolol",
  "toprol-xl": "metoprolol", toprol: "metoprolol", plavix: "clopidogrel", eliquis: "apixaban",
  xarelto: "rivaroxaban", zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine",
  aldactone: "spironolactone", diovan: "valsartan", benicar: "olmesartan", microzide: "hydrochlorothiazide",
  tradjenta: "linagliptin", invokana: "canagliflozin", victoza: "liraglutide", mounjaro: "tirzepatide",
  zyloprim: "allopurinol", prilosec: "omeprazole", nexium: "esomeprazole", ecotrin: "aspirin", bayer: "aspirin",
  celebrex: "celecoxib", cymbalta: "duloxetine", wellbutrin: "bupropion", xanax: "alprazolam",
  suboxone: "buprenorphine", vivitrol: "naltrexone", altace: "ramipril", vasotec: "enalapril", accupril: "quinapril",
};
const GENERICS = new Set(Object.values(BRANDS).concat([
  "metformin", "lisinopril", "amlodipine", "losartan", "furosemide", "glipizide", "glimepiride", "insulin",
  "hydrochlorothiazide", "atorvastatin", "pravastatin", "naproxen", "ibuprofen", "aspirin", "warfarin",
  "prednisone", "gabapentin", "pioglitazone", "bumetanide", "torsemide", "chlorthalidone", "digoxin", "diltiazem",
  "metoprolol", "atenolol", "levothyroxine", "potassium chloride", "vitamin d", "omeprazole", "pantoprazole",
]));
const SALTS = new Set(["hydrochloride", "hcl", "sodium", "potassium", "calcium", "maleate", "besylate", "tartrate",
  "succinate", "sulfate", "mesylate", "phosphate", "acetate", "magnesium", "citrate", "fumarate", "bromide"]);
const FORMS = /\b(oral|tablet|tablets|capsule|capsules|injection|injectable|solution|pen|extended|release|er|xr|sr|delayed|chewable|suspension|cartridge|prefilled|syringe|inhaler|powder|topical|cream)\b/i;

function ingredientFromDisplay(display: string): { ing?: string; ingredientLevel: boolean } {
  const toks = display.toLowerCase().split(/\s+/);
  const words: string[] = [];
  for (const t of toks) {
    if (/^\d/.test(t) || t === "/" || FORMS.test(t)) break;
    if (SALTS.has(t)) continue;
    words.push(t);
  }
  const ing = words.join(" ").trim();
  const hasStrength = /\d/.test(display);
  const hasForm = FORMS.test(display);
  return { ing: ing || undefined, ingredientLevel: !hasStrength && !hasForm };
}

function ingredientFromName(name: string): string | undefined {
  const n = name.toLowerCase().replace(/[^a-z\- ]/g, " ").replace(/\s+/g, " ").trim();
  if (!n) return undefined;
  if (BRANDS[n]) return BRANDS[n];
  const words = n.split(" ").filter((w) => !SALTS.has(w));
  const joined = words.join(" ");
  if (GENERICS.has(joined)) return joined;
  for (const w of words) {
    if (BRANDS[w]) return BRANDS[w];
    if (GENERICS.has(w)) return w;
  }
  return undefined;
}

function sensitivityFor(ing: string | undefined, name: string): Sensitivity[] | undefined {
  const s = (ing ?? name).toLowerCase();
  const mh = /sertraline|escitalopram|fluoxetine|citalopram|paroxetine|venlafaxine|duloxetine|bupropion|mirtazapine|trazodone|lithium|quetiapine|olanzapine|risperidone|aripiprazole|lamotrigine|alprazolam|lorazepam|clonazepam|diazepam|buspirone|amitriptyline|nortriptyline|haloperidol|clozapine|lurasidone|hydroxyzine/;
  const su = /buprenorphine|naltrexone|methadone|disulfiram|acamprosate|nicotine|varenicline|naloxone/;
  const srh = /ethinyl|estradiol|norethindrone|levonorgestrel|drospirenone|medroxyprogesterone|contracept|misoprostol|mifepristone|clomiphene|progesterone/;
  const hiv = /tenofovir|emtricitabine|dolutegravir|bictegravir|efavirenz|raltegravir|darunavir|abacavir|lamivudine|rilpivirine/;
  const r: Sensitivity[] = [];
  if (mh.test(s)) r.push("mental-health");
  if (su.test(s)) r.push("substance-use");
  if (srh.test(s)) r.push("sexual-reproductive-health");
  if (hiv.test(s)) r.push("hiv-sti");
  return r.length ? r : undefined;
}

type Unit = "mg" | "mcg" | "units" | "mL" | "tablet";

function massOf(text: string | undefined): { v: number; u: "mg" | "mcg" } | undefined {
  if (!text) return undefined;
  const m = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|g)\b(?!\s*\/)/i.exec(text);
  if (!m) return undefined;
  const v = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  if (u === "mg") return v < 1 ? { v: Math.round(v * 1000 * 1000) / 1000, u: "mcg" } : { v, u: "mg" };
  if (u === "g") return { v: v * 1000, u: "mg" };
  return { v, u: "mcg" };
}

const NUMWORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5 };

function parseDose(strength: string | undefined, display: string | undefined, how: string | undefined): { value: number; unit: Unit } | undefined {
  const h = (how ?? "").toLowerCase();
  if (/sliding|scale/.test(h)) return undefined;
  if (/\d\s*(or|to|-|–)\s*\d|\b(one|two|three) or (one|two|three)\b/.test(h)) return undefined;
  // explicit amounts
  let m = /(\d+(?:\.\d+)?)\s*(units?|u)\b/.exec(h);
  if (m) return { value: parseFloat(m[1]), unit: "units" };
  m = /(\d+(?:\.\d+)?)\s*ml\b/.exec(h);
  if (m) return { value: parseFloat(m[1]), unit: "mL" };
  m = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug)\b/.exec(h);
  if (m) {
    const v = parseFloat(m[1]);
    return m[2] === "mg" ? { value: v, unit: "mg" } : { value: v, unit: "mcg" };
  }
  if (!h && !strength && !display) return undefined;
  // count
  let count = 1;
  let mm = /(?:take\s+|^)(\d+(?:\.\d+)?)\s*(?:x\b|tabs?\b|tablets?\b|pills?\b|capsules?\b|caps?\b)?/.exec(h);
  if (mm && /^\d/.test(mm[1]) && !/^\d+\s*(am|pm|times|x\s*(a|per|daily))/.test(h)) {
    if (!/^\s*\d+\s*(times|x)\b/.test(h) || false) count = parseFloat(mm[1]);
  } else {
    const w = /(?:take\s+|^)(one|two|three|four|half)\b/.exec(h);
    if (w) count = NUMWORDS[w[1]];
  }
  const dm = display ? massOf(display) : undefined;
  const sm = dm ?? massOf(strength);
  if (sm) return { value: Math.round(sm.v * count * 1000) / 1000, unit: sm.u };
  if (strength && /units|\/\s*ml|ml/i.test(strength)) return undefined;
  if (!strength && !display) return { value: count, unit: "tablet" };
  return { value: count, unit: "tablet" };
}

function parseFrequency(how: string | undefined): MedicationRow["frequency"] | undefined {
  const h = (how ?? "").toLowerCase();
  if (!h.trim()) return undefined;
  if (/as needed|when needed|prn|when i need|if needed|as required/.test(h)) return "PRN";
  if (/week|weekly/.test(h)) return "QW";
  if (/three times|thrice|\btid\b|3 times|3x/.test(h)) return "TID";
  if (/twice|two times|\bbid\b|2 times|2x/.test(h)) return "BID";
  const slots = new Set<string>();
  if (/morning|breakfast|\bam\b/.test(h)) slots.add("m");
  if (/noon|lunch|midday|afternoon/.test(h)) slots.add("n");
  if (/evening|supper|dinner/.test(h)) slots.add("e");
  if (/bedtime|bed time|at night|before bed|night/.test(h)) slots.add("b");
  if (slots.size >= 3) return "TID";
  if (slots.size === 2) return "BID";
  if (slots.size === 1) return slots.has("b") ? "QHS" : "QD";
  if (/daily|every day|each day|once/.test(h)) return "QD";
  return "other";
}

function stopReason(note: string | undefined): MedicationRow["stop_reason"] | undefined {
  if (!note) return undefined;
  const n = note.toLowerCase();
  if (/side effect|reaction|rash|allerg|cough|nausea|dizz|made me|swell|cramp|upset|hives|couldn'?t tolerate|bad for/.test(n)) return "adverse_reaction";
  if (/not working|didn'?t work|no help|ineffective|wasn'?t helping|stopped working/.test(n)) return "ineffective";
  if (/switched|replaced|changed to|instead|swapped|new one/.test(n)) return "therapy_changed";
  if (/finished|course|completed|done with/.test(n)) return "course_complete";
  if (/i decided|my choice|didn'?t want|don'?t want|chose|refus|declin|on my own|i stopped/.test(n)) return "patient_choice";
  return "other";
}

const PAUSE = /\b(stop|stopped|hold|on hold|pause|paused|skip|skipping|not taking|off)\b.*\b(for now|for the time|temporar|until|right now|at the moment|currently)\b|\b(for now|temporar|paused?|on hold|hold off|holding|until (?:he|she|my|the|dr|doctor)|will (?:restart|resume|start again)|resume)\b/i;

function medications(cur: FolioItem[]): MedicationRow[] {
  const lists = cur
    .filter((it) => Object.values(it.payload ?? {}).some((e: any) => e && e.type === "my_med"))
    .sort((a, b) => {
      const ra = Date.parse(a.recorded), rb = Date.parse(b.recorded);
      return ra !== rb ? ra - rb : a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
  const latest = lists[lists.length - 1];
  if (!latest) return [];
  const rows: { row: MedicationRow; ord: string }[] = [];
  for (const [eid, e] of Object.entries(latest.payload)) {
    if (!e || e.type !== "my_med" || typeof e.name !== "string") continue;
    const picked = e.picked_from_search && typeof e.picked_from_search.display === "string" ? e.picked_from_search : undefined;
    let ing: string | undefined;
    let rx: string | undefined;
    if (picked) {
      const r = ingredientFromDisplay(picked.display);
      ing = r.ing;
      if (r.ingredientLevel && typeof picked.rxnorm === "string") rx = picked.rxnorm;
    }
    ing = ing ?? ingredientFromName(e.name);
    const note: string | undefined = typeof e.note === "string" && e.note.trim() ? e.note : undefined;
    const how: string | undefined = typeof e.how_i_take_it === "string" ? e.how_i_take_it : undefined;
    let status: MedicationRow["status"] = e.status === "stopped" ? "stopped" : "active";
    const pauseText = [note, how].filter(Boolean).join(" . ");
    if (pauseText && PAUSE.test(pauseText)) status = "held";
    const row: MedicationRow = {
      drug_name: e.name,
      status,
      patient_reported: true,
      evidence: [{ item_id: latest.id, entry_id: eid }],
    };
    if (ing) row.ingredient = ing;
    if (rx) row.rxnorm_ingredient = rx;
    const since = status === "active" ? e.started : e.stopped;
    if (typeof since === "string" && /^\d{4}(-\d{2}(-\d{2})?)?$/.test(since)) row.status_since = since;
    const dose = parseDose(e.strength_text, picked?.display, how);
    if (dose) row.dose = dose;
    const f = parseFrequency(how);
    if (f) row.frequency = f;
    if (status === "stopped") {
      const sr = stopReason(note);
      if (sr) row.stop_reason = sr;
    }
    if (status !== "active" && note) row.status_reason_text = note;
    if (e.kind === "over_the_counter") row.otc = true;
    const sens = sensitivityFor(ing, e.name);
    if (sens) row.sensitivity = sens;
    rows.push({ row, ord: String(e.stopped ?? e.started ?? "") });
  }
  // one row per ingredient: most recent line wins
  const byIng = new Map<string, { row: MedicationRow; ord: string }>();
  const out: MedicationRow[] = [];
  for (const r of rows) {
    const k = r.row.ingredient;
    if (!k) { out.push(r.row); continue; }
    const prev = byIng.get(k);
    if (!prev || r.ord >= prev.ord) byIng.set(k, r);
  }
  for (const r of byIng.values()) out.push(r.row);
  return out;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  let cur: FolioItem[] = [];
  try { cur = currentItems(Array.isArray(items) ? items : [], asOf); } catch { cur = []; }
  const safe = <T>(f: () => T[]): T[] => { try { return f(); } catch { return []; } };
  return {
    medications: safe(() => medications(cur)),
    problems: [],
    allergies: [],
    labs: [],
    vitals: safe(() => vitals(cur)),
  };
}
