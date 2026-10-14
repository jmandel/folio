import type { FolioItem, ViewRows, MedicationRow, VitalRow } from "../in/views/views";

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  zoloft: "sertraline", synthroid: "levothyroxine", levoxyl: "levothyroxine", lipitor: "atorvastatin",
  farxiga: "dapagliflozin", jardiance: "empagliflozin", trulicity: "dulaglutide", cozaar: "losartan",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  levemir: "insulin detemir", novolog: "insulin aspart", humalog: "insulin lispro",
  ozempic: "semaglutide", rybelsus: "semaglutide", victoza: "liraglutide", januvia: "sitagliptin",
  glucotrol: "glipizide", amaryl: "glimepiride", zocor: "simvastatin", crestor: "rosuvastatin",
  pravachol: "pravastatin", lasix: "furosemide", aldactone: "spironolactone", coreg: "carvedilol",
  lopressor: "metoprolol", toprol: "metoprolol", "toprol-xl": "metoprolol", tenormin: "atenolol",
  diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", vasotec: "enalapril",
  altace: "ramipril", lotensin: "benazepril", microzide: "hydrochlorothiazide", plavix: "clopidogrel",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", lexapro: "escitalopram",
  prozac: "fluoxetine", celexa: "citalopram", wellbutrin: "bupropion", neurontin: "gabapentin",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", zyrtec: "cetirizine",
  claritin: "loratadine", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  tylenol: "acetaminophen", aspirin: "aspirin", bayer: "aspirin", ecotrin: "aspirin",
  invokana: "canagliflozin", actos: "pioglitazone", tradjenta: "linagliptin", steglatro: "ertugliflozin",
  mounjaro: "tirzepatide", zepbound: "tirzepatide", kerendia: "finerenone", zetia: "ezetimibe",
  imdur: "isosorbide mononitrate", norco: "hydrocodone", ultram: "tramadol", flexeril: "cyclobenzaprine",
  "vitamin d": "cholecalciferol", "vitamin d3": "cholecalciferol", tums: "calcium carbonate",
  benadryl: "diphenhydramine", pepcid: "famotidine", zofran: "ondansetron", deltasone: "prednisone",
};
const GENERICS = new Set([
  ...Object.values(BRANDS), "insulin", "hydrochlorothiazide", "chlorthalidone", "metoprolol", "glyburide",
  "lisinopril", "losartan", "metformin", "amlodipine", "atorvastatin", "furosemide", "prednisone",
]);
const SALTS = new Set(["potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "succinate",
  "tartrate", "calcium", "mesylate", "sulfate", "phosphate", "acetate", "citrate", "fumarate", "medoxomil", "propionate", "hydrobromide"]);

function cleanGeneric(s: string): string {
  const words = s.toLowerCase().replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const w of words) { if (/\d/.test(w)) break; if (SALTS.has(w) && out.length) continue; out.push(w); }
  return out.join(" ");
}

function ingredientsOf(m: any): { names: string[]; rxnorm?: string } {
  const pk = m.picked_from_search;
  if (pk && typeof pk.display === "string" && pk.display.trim()) {
    const parts = pk.display.split("/").map((p: string) => cleanGeneric(p)).filter(Boolean);
    if (parts.length) {
      const ingredientLevel = parts.length === 1 && !/\d/.test(pk.display) && typeof pk.rxnorm === "string";
      return { names: parts, rxnorm: ingredientLevel ? pk.rxnorm : undefined };
    }
  }
  const raw = String(m.name ?? "").toLowerCase().trim();
  const stripped = raw.replace(/\s*\d.*$/, "").replace(/[^a-z0-9\- ]/g, " ").replace(/\s+/g, " ").trim();
  if (BRANDS[stripped]) return { names: [BRANDS[stripped]] };
  const g = cleanGeneric(stripped);
  if (BRANDS[g]) return { names: [BRANDS[g]] };
  if (GENERICS.has(g)) return { names: [g] };
  const first = g.split(" ")[0];
  if (BRANDS[first]) return { names: [BRANDS[first]] };
  if (GENERICS.has(first)) return { names: [first] };
  return { names: [] };
}

type Unit = "mg" | "mcg" | "units" | "mL" | "tablet";
function unitOf(u: string): Unit | undefined {
  u = u.toLowerCase();
  if (u === "mg") return "mg";
  if (u === "mcg" || u === "µg" || u === "ug") return "mcg";
  if (u.startsWith("unit") || u === "iu") return "units";
  if (u === "ml") return "mL";
  if (u.startsWith("tab") || u.startsWith("cap") || u === "pill" || u === "pills") return "tablet";
  return undefined;
}

function doseOf(m: any): { value: number; unit: Unit } | undefined {
  const how = String(m.how_i_take_it ?? "");
  const h = how.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|units?|iu|ml|tablets?|tabs?|capsules?|caps?|pills?)\b/i);
  if (h) {
    const u = unitOf(h[2]); const v = parseFloat(h[1]);
    if (u && isFinite(v)) return { value: v, unit: u };
  }
  const s = String(m.strength_text ?? "");
  const lead = how.match(/^\s*(\d+(?:\.\d+)?)\b(?!\s*(?:x|times|\/|:|am|pm))/i);
  const st = s.match(/^\s*(\d+(?:\.\d+)?)\s*(mg|mcg)\b(?!\s*\/)/i);
  if (lead && st) return { value: parseFloat(lead[1]) * parseFloat(st[1]), unit: unitOf(st[2])! };
  const t = s.match(/^\s*(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug)\b(?!\s*\/)/i);
  if (t) return { value: parseFloat(t[1]), unit: unitOf(t[2])! };
  return undefined;
}

function freqOf(how: string | undefined): MedicationRow["frequency"] {
  if (!how || !how.trim()) return undefined;
  const h = how.toLowerCase();
  if (/as needed|\bprn\b|when needed|if needed|\bwhen\b|\bif\b/.test(h)) return "PRN";
  if (/week|\bqw\b/.test(h)) return "QW";
  if (/three times|\btid\b|3 times|3x|every 8 h/.test(h)) return "TID";
  if (/twice|two times|2 times|2x|\bbid\b|every 12 h|morning and (supper|dinner|evening|night|bed)|breakfast and (supper|dinner)/.test(h)) return "BID";
  if (/bed ?time|at night|\bqhs\b|before bed|\bhs\b/.test(h)) return "QHS";
  if (/once a day|once daily|\bdaily\b|every day|\bqd\b|each day|morning|evening|supper|dinner|breakfast|lunch|\bam\b|\bpm\b/.test(h)) return "QD";
  return "other";
}

function stopReason(note: string | undefined): MedicationRow["stop_reason"] {
  if (!note) return undefined;
  const n = note.toLowerCase();
  if (/side effect|reaction|allerg|rash|cough|nausea|made me|upset|dizz/.test(n)) return "adverse_reaction";
  if (/not working|didn'?t work|no longer working|ineffective|wasn'?t helping|not helping/.test(n)) return "ineffective";
  if (/replaced|switched|changed to|instead|new (med|prescription)/.test(n)) return "therapy_changed";
  if (/course|finished|completed|done with/.test(n)) return "course_complete";
  if (/chose|decided|didn'?t want|don'?t want|prefer/.test(n)) return "patient_choice";
  return undefined;
}

const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" });
function chicagoDate(iso: string): string | undefined {
  const t = Date.parse(iso);
  if (isNaN(t)) return undefined;
  return fmt.format(new Date(t));
}

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = items.filter((i) => {
    const d = chicagoDate(i.recorded);
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const i of inScope) {
    for (const id of i.supersedes ?? []) dead.add(i.issuer + "|" + id);
    for (const id of i.retracts ?? []) dead.add(i.issuer + "|" + id);
  }
  return inScope.filter((i) => !dead.has(i.issuer + "|" + i.id));
}

function minutes(dt: string): number {
  return Date.parse(dt + ":00Z") / 60000;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  let cur: FolioItem[] = [];
  try { cur = currentItems(items ?? [], asOf); } catch { return rows; }
  cur.sort((a, b) => (a.recorded < b.recorded ? -1 : a.recorded > b.recorded ? 1 : a.id < b.id ? -1 : 1));

  // ── medications: latest My Medicines snapshot
  let list: FolioItem | undefined;
  for (const it of cur) {
    const p = it.payload ?? {};
    if (Object.values(p).some((e: any) => e && e.type === "my_med")) list = it;
  }
  if (list) {
    const byIng = new Map<string, { key: string; row: MedicationRow; act: boolean }>();
    let seq = 0;
    for (const [eid, m] of Object.entries(list.payload) as [string, any][]) {
      if (!m || m.type !== "my_med" || typeof m.name !== "string") continue;
      seq++;
      const ing = ingredientsOf(m);
      const stopped = m.status === "stopped";
      const note: string | undefined = typeof m.note === "string" && m.note.trim() ? m.note.trim() : undefined;
      const held = !!note && /paus|on hold|\bhold\b|holding|temporar|for now|until|resume|restart|stop for|stop taking for/i.test(note) && !/permanent|never/i.test(note)
        && (stopped || /stop|paus|hold|skip|don'?t take|not (to )?take/i.test(note));
      const multi = ing.names.length > 1;
      const row: MedicationRow = {
        drug_name: m.picked_from_search?.display || m.name,
        status: held ? "held" : stopped ? "stopped" : "active",
        patient_reported: true,
        evidence: [{ item_id: list.id, entry_id: eid }],
      };
      if (!multi && ing.names[0]) row.ingredient = ing.names[0];
      if (ing.rxnorm) row.rxnorm_ingredient = ing.rxnorm;
      const since = stopped ? m.stopped : held ? undefined : m.started;
      if (typeof since === "string" && /^\d{4}(-\d{2}(-\d{2})?)?$/.test(since)) row.status_since = since;
      if (!multi) { const d = doseOf(m); if (d) row.dose = d; }
      const f = freqOf(m.how_i_take_it); if (f) row.frequency = f;
      if (stopped || held) {
        if (!held && stopped) { const r = stopReason(note); if (r) row.stop_reason = r; }
        if (note) row.status_reason_text = note;
      }
      if (m.kind === "over_the_counter") row.otc = true;
      const names = multi ? ing.names : [ing.names[0] ?? "\u0000" + seq];
      for (const n of names) {
        const r2: MedicationRow = multi ? { ...row, ingredient: n } : row;
        const key = (stopped ? m.stopped : m.started) ?? "";
        const prev = byIng.get(n);
        const act = !stopped && !held;
        const better = !prev || (prev.act !== act
          ? (act ? !(prev.key && key && prev.key > key) : (!!key && !!prev.key && key > prev.key))
          : key >= prev.key);
        if (better) byIng.set(n, { key, row: r2, act });
      }
    }
    rows.medications = [...byIng.values()].map((v) => v.row);
  }

  // ── vitals: home readings
  type R = { t: number; row: VitalRow; device: boolean; sig: string };
  const readings: R[] = [];
  for (const it of cur) {
    for (const [eid, e] of Object.entries(it.payload ?? {}) as [string, any][]) {
      if (!e || typeof e.measured_at !== "string" || isNaN(minutes(e.measured_at))) continue;
      const ev = [{ item_id: it.id, entry_id: eid }];
      if (e.type === "bp_reading") {
        if (typeof e.systolic_mmhg !== "number" || typeof e.diastolic_mmhg !== "number") continue;
        const row: VitalRow = { setting: "home", local_time: e.measured_at.slice(0, 16), systolic_mmhg: e.systolic_mmhg, diastolic_mmhg: e.diastolic_mmhg, evidence: ev };
        if (typeof e.pulse_bpm === "number") row.pulse_bpm = e.pulse_bpm;
        readings.push({ t: minutes(e.measured_at), row, device: e.entry_method === "cuff_sync", sig: `bp${e.systolic_mmhg}/${e.diastolic_mmhg}` });
      } else if (e.type === "glucose_reading") {
        if (typeof e.value !== "number") continue;
        const mg = e.unit === "mmol/L" ? Math.round(e.value * 18.016) : e.unit === "mg/dL" ? Math.round(e.value) : NaN;
        if (isNaN(mg)) continue;
        const row: VitalRow = { setting: "home", local_time: e.measured_at.slice(0, 16), glucose_mg_dl: mg, evidence: ev };
        if (e.out_of_range === "HI" || e.out_of_range === "LO") row.glucose_out_of_range = e.out_of_range;
        readings.push({ t: minutes(e.measured_at), row, device: e.entry_method === "meter_sync", sig: `glu${mg}` });
      }
    }
  }
  const keep: R[] = [];
  for (const r of readings) {
    const dup = readings.find((o) => o !== r && o.sig === r.sig && o.device && !r.device && Math.abs(o.t - r.t) <= 3);
    if (!dup) keep.push(r);
  }
  keep.sort((a, b) => a.t - b.t);
  rows.vitals = keep.map((r) => r.row);
  return rows;
}
