import type { FolioItem, ViewRows, MedicationRow, VitalRow, Evidence, Sensitivity } from "../in/views/views";

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  crestor: "rosuvastatin", synthroid: "levothyroxine", levoxyl: "levothyroxine", farxiga: "dapagliflozin",
  jardiance: "empagliflozin", lipitor: "atorvastatin", zocor: "simvastatin", lasix: "furosemide",
  coumadin: "warfarin", eliquis: "apixaban", xarelto: "rivaroxaban", plavix: "clopidogrel",
  aleve: "naproxen", advil: "ibuprofen", motrin: "ibuprofen", tylenol: "acetaminophen",
  glucotrol: "glipizide", januvia: "sitagliptin", lantus: "insulin glargine", basaglar: "insulin glargine",
  levemir: "insulin detemir", humalog: "insulin lispro", novolog: "insulin aspart", toprol: "metoprolol",
  "toprol-xl": "metoprolol", lopressor: "metoprolol", coreg: "carvedilol", cozaar: "losartan",
  diovan: "valsartan", zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine",
  seroquel: "quetiapine", abilify: "aripiprazole", suboxone: "buprenorphine", zofran: "ondansetron",
  prilosec: "omeprazole", nexium: "esomeprazole", pepcid: "famotidine", zyrtec: "cetirizine",
  ventolin: "albuterol", prednisone: "prednisone", ozempic: "semaglutide", victoza: "liraglutide",
  trulicity: "dulaglutide", hydrodiuril: "hydrochlorothiazide", aldactone: "spironolactone",
  tenormin: "atenolol", cardizem: "diltiazem", neurontin: "gabapentin", ultram: "tramadol",
  "vitamin d": "cholecalciferol", "vitamin d3": "cholecalciferol", aspirin: "aspirin", bayer: "aspirin",
};
const SENS: Record<string, Sensitivity> = {
  quetiapine: "mental-health", aripiprazole: "mental-health", sertraline: "mental-health",
  escitalopram: "mental-health", fluoxetine: "mental-health", lithium: "mental-health",
  olanzapine: "mental-health", risperidone: "mental-health", bupropion: "mental-health",
  buprenorphine: "substance-use", naltrexone: "substance-use", methadone: "substance-use",
  naloxone: "substance-use", disulfiram: "substance-use", acamprosate: "substance-use",
  emtricitabine: "hiv-sti", tenofovir: "hiv-sti", dolutegravir: "hiv-sti", bictegravir: "hiv-sti",
  levonorgestrel: "sexual-reproductive-health", norethindrone: "sexual-reproductive-health",
  estradiol: "sexual-reproductive-health", medroxyprogesterone: "sexual-reproductive-health",
};
const SALTS = /\b(hydrochloride|hcl|sodium|calcium|potassium|besylate|maleate|tartrate|succinate|sulfate|phosphate|acetate|mesylate|citrate|hydrobromide|fumarate|magnesium)\b/g;

function chicagoDate(iso: string): string | undefined {
  const t = Date.parse(iso);
  if (isNaN(t)) return /^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10) : undefined;
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(t));
  return p;
}

function counting(items: FolioItem[], asOf: string): FolioItem[] {
  const c = items.filter((i) => { const d = chicagoDate(i.recorded); return d !== undefined && d <= asOf; });
  const gone = new Set<string>();
  for (const i of c) { for (const s of i.supersedes ?? []) gone.add(s); for (const r of i.retracts ?? []) gone.add(r); }
  return c.filter((i) => !gone.has(i.id));
}

function ingredientOf(m: any): { ingredient: string; rx?: string } {
  const disp: string | undefined = m.picked_from_search?.display;
  if (disp) {
    const lower = disp.toLowerCase();
    const head = lower.split(/\s\d|\//)[0].replace(SALTS, " ").replace(/\s+/g, " ").trim();
    const hasStrength = /\d/.test(lower);
    const rx = !hasStrength && m.picked_from_search?.rxnorm ? String(m.picked_from_search.rxnorm) : undefined;
    if (head) return { ingredient: head, rx };
  }
  let n = String(m.name ?? "").toLowerCase().replace(/\(.*?\)/g, " ").replace(/\d.*$/, " ").replace(/\s+/g, " ").trim();
  if (BRANDS[n]) return { ingredient: BRANDS[n] };
  const first = n.split(" ")[0];
  if (BRANDS[first]) return { ingredient: BRANDS[first] };
  return { ingredient: n.replace(SALTS, " ").replace(/\s+/g, " ").trim() };
}

const WORDNUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5 };
function normUnit(u: string): "mg" | "mcg" | "units" | "mL" | undefined {
  u = u.toLowerCase();
  if (/^(mg|milligrams?)$/.test(u)) return "mg";
  if (/^(mcg|µg|μg|ug|micrograms?)$/.test(u)) return "mcg";
  if (/^(u|iu|units?)$/.test(u)) return "units";
  if (/^(ml|cc)$/.test(u)) return "mL";
  return undefined;
}

function parseDose(m: any): MedicationRow["dose"] | undefined {
  const how = String(m.how_i_take_it ?? "").toLowerCase();
  if (/sliding|scale|depend|\bif\b|\bper\b.*\b(sugar|glucose)/.test(how)) return undefined;
  if (/\d\s*(-|–|to|or)\s*\d|\b(one|two|three)\s+(or|to)\s+(one|two|three)\b/.test(how)) return undefined;
  const explicit = how.match(/(\d+(?:\.\d+)?)\s*(mg|milligrams?|mcg|µg|μg|micrograms?|units?|iu|ml|cc)\b/);
  if (explicit) {
    const u = normUnit(explicit[2]);
    if (u) return { value: Number(explicit[1]), unit: u };
  }
  const str = String(m.strength_text ?? "").toLowerCase().trim();
  const sm = str.match(/^(\d+(?:\.\d+)?)\s*(mg|milligrams?|mcg|µg|μg|micrograms?|g)$/);
  let count = 1;
  const cm = how.match(/(\d+(?:\.\d+)?|\bone\b|\btwo\b|\bthree\b|\bfour\b|\bhalf\b|1\/2)\s*(?:of\s+a\s+)?(tab|cap|pill|puff|tablet|capsule)?/);
  if (cm && (cm[2] || /^\d|^one|^two|^three|^four|^half/.test(cm[1]))) {
    const w = cm[1].trim();
    count = w === "1/2" ? 0.5 : WORDNUM[w] ?? Number(w);
    if (!isFinite(count) || count <= 0) count = 1;
    if (!cm[2] && !/^(\d+(\.\d+)?)$/.test(w) ) count = WORDNUM[w] ?? 1;
    // a bare number with no unit word is only a count when followed by tab-ish words
    if (!cm[2]) count = 1;
  }
  if (sm) {
    let v = Number(sm[1]); let u = normUnit(sm[2]) ?? "mg";
    if (/^g$/.test(sm[2])) { v *= 1000; u = "mg"; }
    return { value: Math.round(v * count * 1e6) / 1e6, unit: u };
  }
  if (!str && cm && cm[2]) return { value: count, unit: "tablet" };
  return undefined;
}

function parseFreq(m: any): MedicationRow["frequency"] | undefined {
  const t = String(m.how_i_take_it ?? "").toLowerCase();
  if (!t) return undefined;
  if (/as needed|prn|when needed|if needed/.test(t)) return "PRN";
  if (/every other day|monthly|four times|4 times|every 6|every 4|taper|every \d+ days/.test(t)) return "other";
  if (/three times|3 times|tid|every 8|morning,? (noon|midday|afternoon).*(evening|supper|night|bedtime)/.test(t)) return "TID";
  if (/twice|two times|2 times|bid|every 12|(morning|breakfast).*\b(and|&|,)\b.*(evening|supper|dinner|night|bedtime|lunch)/.test(t)) return "BID";
  if (/week/.test(t)) return "QW";
  if (/bedtime|at night|nightly|\bnight\b/.test(t) && !/morning/.test(t)) return "QHS";
  if (/morning|daily|once|every day|each day|evening|supper|dinner|breakfast|noon/.test(t)) return "QD";
  return undefined;
}

function stopReason(note: string): MedicationRow["stop_reason"] | undefined {
  const n = note.toLowerCase();
  if (!n) return undefined;
  if (/side effect|rash|reaction|allerg|made me (sick|dizzy|nauseous)|cough|nausea/.test(n)) return "adverse_reaction";
  if (/didn'?t work|not working|ineffective|no effect|wasn'?t helping/.test(n)) return "ineffective";
  if (/switched|replaced|changed to|instead|now (on|taking)/.test(n)) return "therapy_changed";
  if (/course|finished|completed/.test(n)) return "course_complete";
  if (/i (decided|chose|wanted)|my choice|on my own/.test(n)) return "patient_choice";
  return undefined;
}

function validPartial(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}(-\d{2}(-\d{2})?)?$/.test(s);
}

function meds(items: FolioItem[]): MedicationRow[] {
  const lists = items.filter((i) => Object.values(i.payload ?? {}).some((e: any) => e?.type === "my_med"));
  if (!lists.length) return [];
  lists.sort((a, b) => (a.recorded < b.recorded ? 1 : a.recorded > b.recorded ? -1 : a.id < b.id ? 1 : -1));
  const list = lists[0];
  const byIng = new Map<string, MedicationRow>();
  for (const [eid, e] of Object.entries(list.payload) as [string, any][]) {
    if (!e || e.type !== "my_med") continue;
    const { ingredient, rx } = ingredientOf(e);
    const note = String(e.note ?? "");
    const how = String(e.how_i_take_it ?? "");
    const heldText = /\b(paus|on hold|hold(ing)?|for now|for the time being|temporar|until|resume)/i.test(note + " " + how);
    let status: MedicationRow["status"] = e.status === "stopped" ? "stopped" : "active";
    if (heldText) status = "held";
    const row: MedicationRow = {
      drug_name: String(e.name ?? ingredient),
      status,
      patient_reported: true,
      evidence: [{ item_id: list.id, entry_id: eid }],
    };
    if (ingredient) row.ingredient = ingredient;
    if (rx) row.rxnorm_ingredient = rx;
    const since = status === "stopped" || status === "held" ? e.stopped : e.started;
    if (validPartial(since)) row.status_since = since;
    const dose = parseDose(e); if (dose) row.dose = dose;
    const f = parseFreq(e); if (f) row.frequency = f;
    if (status === "stopped") { const r = stopReason(note); if (r) row.stop_reason = r; }
    if (note) row.status_reason_text = note;
    if (e.kind === "over_the_counter") row.otc = true;
    const s = SENS[ingredient]; if (s) row.sensitivity = [s];
    const prev = byIng.get(ingredient);
    if (!prev || (prev.status === "stopped" && row.status !== "stopped")) byIng.set(ingredient, row);
  }
  return [...byIng.values()];
}

function mgdl(v: number, unit: string): number {
  return unit === "mmol/L" ? Math.round(v * 18.016) : Math.round(v);
}

function vitals(items: FolioItem[]): VitalRow[] {
  type Cand = { row: VitalRow; device: boolean; kind: "bp" | "glu"; t: number; key: string };
  const cands: Cand[] = [];
  for (const it of items) {
    for (const [eid, e] of Object.entries(it.payload ?? {}) as [string, any][]) {
      if (!e || typeof e !== "object") continue;
      const ev: Evidence = [{ item_id: it.id, entry_id: eid }];
      if (e.type === "bp_reading" && typeof e.measured_at === "string" && typeof e.systolic_mmhg === "number" && typeof e.diastolic_mmhg === "number") {
        const row: VitalRow = { setting: "home", local_time: e.measured_at.slice(0, 16), systolic_mmhg: e.systolic_mmhg, diastolic_mmhg: e.diastolic_mmhg, evidence: ev };
        if (typeof e.pulse_bpm === "number") row.pulse_bpm = e.pulse_bpm;
        cands.push({ row, device: e.entry_method === "cuff_sync", kind: "bp", t: Date.parse(e.measured_at.slice(0, 16) + ":00Z"), key: `${e.systolic_mmhg}/${e.diastolic_mmhg}` });
      } else if (e.type === "glucose_reading" && typeof e.measured_at === "string" && typeof e.value === "number") {
        const row: VitalRow = { setting: "home", local_time: e.measured_at.slice(0, 16), evidence: ev };
        if (e.out_of_range === "HI" || e.out_of_range === "LO") {
          row.glucose_out_of_range = e.out_of_range;
          row.glucose_mg_dl = e.out_of_range === "HI" ? 600 : 20;
        } else row.glucose_mg_dl = mgdl(e.value, e.unit);
        cands.push({ row, device: e.entry_method === "meter_sync", kind: "glu", t: Date.parse(e.measured_at.slice(0, 16) + ":00Z"), key: `${row.glucose_mg_dl}${row.glucose_out_of_range ?? ""}` });
      }
    }
  }
  const drop = new Set<Cand>();
  for (const a of cands) {
    if (a.device) continue;
    for (const b of cands) {
      if (b.device && b.kind === a.kind && b.key === a.key && Math.abs(a.t - b.t) <= 2 * 60000) { drop.add(a); break; }
    }
  }
  return cands.filter((c) => !drop.has(c)).sort((a, b) => (a.row.local_time < b.row.local_time ? -1 : a.row.local_time > b.row.local_time ? 1 : 0)).map((c) => c.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  let live: FolioItem[] = [];
  try { live = counting(items ?? [], asOf); } catch { live = []; }
  let m: MedicationRow[] = [], v: VitalRow[] = [];
  try { m = meds(live); } catch { m = []; }
  try { v = vitals(live); } catch { v = []; }
  return { medications: m, problems: [], allergies: [], labs: [], vitals: v };
}
