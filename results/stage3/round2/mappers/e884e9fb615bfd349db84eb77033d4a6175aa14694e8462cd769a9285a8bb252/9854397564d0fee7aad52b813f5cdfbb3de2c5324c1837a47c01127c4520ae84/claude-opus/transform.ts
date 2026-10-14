// Lakeview Labs & Kidney Care (lakeview-v1) -> consumer views v2.
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
  Sensitivity,
} from "../in/views/views";

const TZ = "America/Chicago";

// ───────────────────────────── time helpers ─────────────────────────────

const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

/** Local wall-clock `YYYY-MM-DDTHH:MM` in Chicago, or undefined if unreadable. */
function localDateTime(ts: unknown): string | undefined {
  if (typeof ts !== "string") return undefined;
  const s = ts.trim();
  const m = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(s);
  if (!m) return undefined;
  if (!HAS_ZONE.test(s) || !m[2]) {
    // No zone: already local wall-clock time; report as written.
    return m[2] ? `${m[1]}T${m[2]}:${m[3]}` : undefined;
  }
  const t = Date.parse(s);
  if (isNaN(t)) return undefined;
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(new Date(t))) p[part.type] = part.value;
  const hour = p.hour === "24" ? "00" : p.hour;
  return `${p.year}-${p.month}-${p.day}T${hour}:${p.minute}`;
}

/** Local calendar date `YYYY-MM-DD` in Chicago. Date-only strings are returned as is. */
function localDate(ts: unknown): string | undefined {
  if (typeof ts !== "string") return undefined;
  const s = ts.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dt = localDateTime(s);
  if (dt) return dt.slice(0, 10);
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(s);
  return m ? m[1] : undefined;
}

/** Sortable key for a timestamp (epoch ms); NaN-safe. */
function timeKey(ts: unknown): number {
  if (typeof ts !== "string") return -Infinity;
  const s = ts.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const t = Date.parse(`${s}T12:00:00-06:00`);
    return isNaN(t) ? -Infinity : t;
  }
  if (!HAS_ZONE.test(s)) {
    const t = Date.parse(`${s.slice(0, 19)}-06:00`);
    return isNaN(t) ? -Infinity : t;
  }
  const t = Date.parse(s);
  return isNaN(t) ? -Infinity : t;
}

// ───────────────────────────── item selection ─────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = (Array.isArray(items) ? items : []).filter((it) => {
    if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
    if (!it.payload || typeof it.payload !== "object") return false;
    const d = localDate(it.recorded);
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const k of ["supersedes", "retracts"] as const) {
      const ids = it[k];
      if (!Array.isArray(ids)) continue;
      for (const id of ids) if (typeof id === "string") dead.add(`${it.issuer}|${id}`);
    }
  }
  const out = inScope.filter((it) => !dead.has(`${it.issuer}|${it.id}`));
  out.sort((a, b) => timeKey(a.recorded) - timeKey(b.recorded) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return out;
}

type Entry = { item: FolioItem; key: string; row: any };

function entriesOf(item: FolioItem, type: string): Entry[] {
  const out: Entry[] = [];
  for (const key of Object.keys(item.payload)) {
    const row = item.payload[key];
    if (row && typeof row === "object" && row.type === type) out.push({ item, key, row });
  }
  return out;
}

function ev(e: Entry): { item_id: string; entry_id: string } {
  return { item_id: e.item.id, entry_id: e.key };
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && isFinite(v) ? v : undefined;
}

// ───────────────────────────── labs ─────────────────────────────

const LAB_MAP: Record<string, { analyte: Analyte; unit: string; srcUnit: string }> = {
  "LK-CREAT": { analyte: "creatinine", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-EGFR09N": { analyte: "egfr", unit: "mL/min/1.73m2", srcUnit: "mL/min/1.73m2" },
  "LK-EGFR21": { analyte: "egfr", unit: "mL/min/1.73m2", srcUnit: "mL/min/1.73m2" },
  // LK-EGFR09A (race coefficient applied) is deliberately not mapped.
  "LK-NA": { analyte: "sodium", unit: "mmol/L", srcUnit: "mmol/L" },
  "LK-K": { analyte: "potassium", unit: "mmol/L", srcUnit: "mmol/L" },
  "LK-GLU": { analyte: "glucose", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-A1C": { analyte: "a1c", unit: "%", srcUnit: "%" },
  "LK-UACR": { analyte: "uacr", unit: "mg/g", srcUnit: "mg/g" },
  "LK-WBC": { analyte: "wbc", unit: "10*3/uL", srcUnit: "K/uL" },
  "LK-HGB": { analyte: "hemoglobin", unit: "g/dL", srcUnit: "g/dL" },
  "LK-PLT": { analyte: "platelets", unit: "10*3/uL", srcUnit: "K/uL" },
  "LK-CHOL": { analyte: "cholesterol", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-TRIG": { analyte: "triglycerides", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-HDL": { analyte: "hdl", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-LDLC": { analyte: "ldl", unit: "mg/dL", srcUnit: "mg/dL" },
};

/** LOINC codes Lakeview attached that denote a different method than the one used (MDRD codes on CKD-EPI 2009 rows). */
const MISLEADING_LOINC: Record<string, true> = { "LK-EGFR09N": true, "LK-EGFR09A": true };

function parseValue(text: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  if (typeof text !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>)?\s*([+-]?(?:\d+\.?\d*|\.\d+))\s*$/.exec(text);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!isFinite(value)) return undefined;
  return m[1] ? { value, comparator: m[1] as "<" | ">" | "<=" | ">=" } : { value };
}

function egfrEquation(code: string, comment: unknown): LabResultRow["egfr_equation"] {
  const c = typeof comment === "string" ? comment : "";
  if (/CKD[-\s]?EPI[^.;]*2021/i.test(c)) return "ckd-epi-2021";
  if (/CKD[-\s]?EPI[^.;]*2009/i.test(c)) return "ckd-epi-2009";
  if (/\bMDRD\b/i.test(c)) return "mdrd";
  if (code === "LK-EGFR21") return "ckd-epi-2021";
  if (code === "LK-EGFR09N" || code === "LK-EGFR09A") return "ckd-epi-2009";
  return "unknown";
}

const RESULT_RANK: Record<string, number> = { P: 1, F: 2, A: 3 };

function mapLabs(items: FolioItem[]): LabResultRow[] {
  const best = new Map<string, { rank: number; recorded: number; row: LabResultRow }>();
  for (const item of items) {
    const reqs = entriesOf(item, "LAB_REQ");
    const orders = new Map<string, any>();
    for (const o of entriesOf(item, "LAB_ORDER")) if (str(o.row.ORDER_ID)) orders.set(o.row.ORDER_ID, o.row);
    for (const e of entriesOf(item, "LAB_RESULT")) {
      const r = e.row;
      const code = str(r.TEST_CODE);
      if (!code) continue;
      const map = LAB_MAP[code];
      if (!map) continue;
      const status = str(r.RESULT_STATUS);
      if (!status || !(status in RESULT_RANK)) continue; // C (withdrawn), X (not performed), unknown
      const order = orders.get(r.ORDER_ID);
      if (order && (order.ORDER_STATUS === 9 || order.ORDER_STATUS === 5)) continue;
      if (r.UNIT_CODE !== map.srcUnit) continue;
      const parsed = parseValue(r.VALUE_TEXT);
      if (!parsed) continue;

      let collected: string | undefined;
      const req = reqs.find((q) => !order || q.row.REQ_ID === order.REQ_ID) ?? reqs[0];
      if (req) collected = str(req.row.COLLECTED_AT);
      collected = collected ?? str(item.effective);
      if (!collected) continue;

      const row: LabResultRow = {
        analyte: map.analyte,
        value: parsed.value,
        unit: map.unit,
        collected,
        status: status === "P" ? "preliminary" : "final",
        evidence: [ev(e)],
      };
      if (parsed.comparator) row.comparator = parsed.comparator;
      if (map.analyte === "egfr") row.egfr_equation = egfrEquation(code, r.COMMENT_TEXT);
      const loinc = str(r.LOINC);
      if (loinc && !MISLEADING_LOINC[code]) row.loinc = loinc;

      const id = str(r.RESULT_ID) ?? `${item.id}|${e.key}`;
      const cand = { rank: RESULT_RANK[status], recorded: timeKey(item.recorded), row };
      const prev = best.get(id);
      if (!prev || cand.rank > prev.rank || (cand.rank === prev.rank && cand.recorded >= prev.recorded)) best.set(id, cand);
    }
  }
  const rows = [...best.values()].map((b) => b.row);
  rows.sort((a, b) => timeKey(a.collected) - timeKey(b.collected) || (a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
  return rows;
}

// ───────────────────────────── vitals ─────────────────────────────

function mapVitals(items: FolioItem[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const item of items) {
    const byVisit = new Map<string, Entry[]>();
    for (const e of entriesOf(item, "VITAL")) {
      if (num(e.row.VALUE_NUM) === undefined) continue;
      const v = str(e.row.VISIT_ID) ?? "";
      if (!byVisit.has(v)) byVisit.set(v, []);
      byVisit.get(v)!.push(e);
    }
    for (const vs of byVisit.values()) {
      const reading = (code: string) =>
        vs
          .filter((e) => e.row.VITAL_CODE === code)
          .sort((a, b) => (num(a.row.READING_NO) ?? 1) - (num(b.row.READING_NO) ?? 1) || timeKey(a.row.TAKEN_AT) - timeKey(b.row.TAKEN_AT));
      const bps = reading("BPS").filter((e) => e.row.UNIT_CODE === "mmHg" || e.row.UNIT_CODE === undefined);
      const bpd = reading("BPD").filter((e) => e.row.UNIT_CODE === "mmHg" || e.row.UNIT_CODE === undefined);
      const hr = reading("HR");
      const wt = reading("WT");
      const used: Entry[] = [];
      const row: Partial<VitalRow> = { setting: "clinic" };

      // First BP pair: lowest READING_NO; repeat: the last later reading.
      const firstNo = bps.length ? num(bps[0].row.READING_NO) : bpd.length ? num(bpd[0].row.READING_NO) : undefined;
      const s1 = bps.find((e) => num(e.row.READING_NO) === firstNo) ?? bps[0];
      const d1 = bpd.find((e) => num(e.row.READING_NO) === firstNo) ?? bpd[0];
      if (s1) { row.systolic_mmhg = s1.row.VALUE_NUM; used.push(s1); }
      if (d1) { row.diastolic_mmhg = d1.row.VALUE_NUM; used.push(d1); }
      const laterS = bps.filter((e) => e !== s1);
      const laterD = bpd.filter((e) => e !== d1);
      const s2 = laterS[laterS.length - 1];
      const d2 = s2 ? laterD.find((e) => num(e.row.READING_NO) === num(s2.row.READING_NO)) ?? laterD[laterD.length - 1] : laterD[laterD.length - 1];
      if (s2) { row.repeat_systolic_mmhg = s2.row.VALUE_NUM; used.push(s2); }
      if (d2) { row.repeat_diastolic_mmhg = d2.row.VALUE_NUM; used.push(d2); }
      if (hr[0]) { row.pulse_bpm = hr[0].row.VALUE_NUM; used.push(hr[0]); }
      if (wt[0]) {
        const u = wt[0].row.UNIT_CODE;
        const v: number = wt[0].row.VALUE_NUM;
        const kg = u === "kg" || u === undefined ? v : u === "lb" || u === "[lb_av]" ? v * 0.45359237 : undefined;
        if (kg !== undefined) { row.weight_kg = Math.round(kg * 10) / 10; used.push(wt[0]); }
      }
      if (!used.length) continue;

      const timeSource = s1 ?? d1 ?? [...used].sort((a, b) => timeKey(a.row.TAKEN_AT) - timeKey(b.row.TAKEN_AT))[0];
      const lt = localDateTime(timeSource.row.TAKEN_AT) ?? localDateTime(item.effective);
      if (!lt) continue;
      row.local_time = lt;
      row.evidence = used.map(ev);
      rows.push(row as VitalRow);
    }
  }
  rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return rows;
}

// ───────────────────────────── drug knowledge ─────────────────────────────

const BRANDS: Record<string, string> = {
  kerendia: "finerenone", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  steglatro: "ertugliflozin", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide", lasix: "furosemide",
  bumex: "bumetanide", aldactone: "spironolactone", inspra: "eplerenone", cozaar: "losartan",
  diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan",
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", lipitor: "atorvastatin",
  crestor: "rosuvastatin", glucophage: "metformin", lantus: "insulin glargine", basaglar: "insulin glargine",
  toujeo: "insulin glargine", humalog: "insulin lispro", novolog: "insulin aspart", lokelma: "sodium zirconium cyclosilicate",
  veltassa: "patiromer", renvela: "sevelamer", renagel: "sevelamer", sensipar: "cinacalcet",
  epogen: "epoetin alfa", procrit: "epoetin alfa", aranesp: "darbepoetin alfa", zyloprim: "allopurinol", uloric: "febuxostat",
};

/** Salt / form words removed from the ingredient name. */
const SALT_WORDS = new Set([
  "potassium", "sodium", "calcium", "magnesium", "hydrochloride", "hcl", "besylate", "maleate", "mesylate",
  "succinate", "tartrate", "fumarate", "citrate", "acetate", "carbonate", "sulfate", "phosphate", "medoxomil",
  "propanediol", "dihydrate", "monohydrate", "hyclate", "bromide", "chloride", "er", "xr", "sr", "dr", "la",
  "tablet", "tablets", "tab", "capsule", "capsules", "cap", "oral", "solution", "injection", "pen", "vial", "extended-release",
]);
/** Compounds whose "salt" word is the drug itself. */
const KEEP_WHOLE = [
  "potassium chloride", "sodium bicarbonate", "sodium chloride", "calcium acetate", "calcium carbonate",
  "magnesium oxide", "sodium zirconium cyclosilicate", "ferrous sulfate", "potassium citrate", "sodium polystyrene sulfonate",
];

function ingredientOf(drugName: string): string | undefined {
  let s = drugName.toLowerCase().trim();
  const cut = s.search(/\d/);
  if (cut > 0) s = s.slice(0, cut);
  s = s.replace(/\(.*?\)/g, " ").replace(/[,]/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return undefined;
  for (const k of KEEP_WHOLE) if (s.startsWith(k)) return k;
  const first = s.split(" ")[0];
  if (BRANDS[first]) return BRANDS[first];
  const words = s.split(" ").filter((w) => !SALT_WORDS.has(w));
  const out = words.join(" ").trim();
  return out || undefined;
}

const DRUG_CLASSES: { re: RegExp; label: string; members: string[] }[] = [
  { re: /angiotensin[- ]converting[- ]enzyme|\bace[- ]?inhibitor|\bacei\b/i, label: "ACE inhibitor", members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"] },
  { re: /angiotensin[- ](ii )?receptor|\barbs?\b/i, label: "angiotensin receptor blocker", members: ["losartan", "valsartan", "irbesartan", "olmesartan", "telmisartan", "candesartan", "azilsartan"] },
  { re: /sglt-?2/i, label: "SGLT2 inhibitor", members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin"] },
  { re: /mineralocorticoid|aldosterone antagonist/i, label: "mineralocorticoid receptor antagonist", members: ["spironolactone", "eplerenone", "finerenone"] },
  { re: /glp-?1/i, label: "GLP-1 receptor agonist", members: ["semaglutide", "dulaglutide", "liraglutide", "exenatide", "tirzepatide"] },
  { re: /statin|hmg-?coa/i, label: "statin", members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin"] },
  { re: /loop diuretic/i, label: "loop diuretic", members: ["furosemide", "bumetanide", "torsemide"] },
  { re: /thiazide/i, label: "thiazide diuretic", members: ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone"] },
  { re: /biguanide/i, label: "biguanide", members: ["metformin"] },
  { re: /nsaid|nonsteroidal anti-?inflammatory/i, label: "NSAID", members: ["ibuprofen", "naproxen", "diclofenac", "meloxicam", "celecoxib", "indomethacin"] },
  { re: /calcium[- ]channel blocker/i, label: "calcium channel blocker", members: ["amlodipine", "nifedipine", "diltiazem", "verapamil", "felodipine"] },
  { re: /oral hypoglycemic|antidiabetic|blood[- ]glucose[- ]lowering/i, label: "oral hypoglycemic drug", members: ["metformin", "empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "glipizide", "glimepiride", "glyburide", "sitagliptin", "linagliptin", "pioglitazone"] },
  { re: /\binsulin\b/i, label: "insulin", members: ["insulin glargine", "insulin lispro", "insulin aspart", "insulin detemir", "insulin degludec", "insulin nph", "insulin regular"] },
  { re: /sulfonamide/i, label: "sulfonamide", members: ["sulfamethoxazole"] },
  { re: /penicillin/i, label: "penicillin", members: ["penicillin", "amoxicillin", "ampicillin"] },
];

const KNOWN_DRUGS: string[] = (() => {
  const s = new Set<string>(Object.values(BRANDS));
  for (const c of DRUG_CLASSES) for (const m of c.members) s.add(m);
  for (const k of ["metformin", "allopurinol", "febuxostat", "patiromer", "sevelamer", "cinacalcet", "lithium", "tacrolimus", "cyclosporine", "vancomycin", "gentamicin", "contrast"]) s.add(k);
  return [...s].sort((a, b) => b.length - a.length);
})();

// ───────────────────────────── medications ─────────────────────────────

const FREQS = new Set(["QD", "BID", "TID", "QHS", "QW", "PRN"]);
const DOSE_UNITS: Record<string, "mg" | "mcg" | "units" | "mL"> = { mg: "mg", mcg: "mcg", unit: "units", units: "units", mL: "mL", ml: "mL" };

function stopReason(code: unknown, comment: unknown): MedicationRow["stop_reason"] {
  const c = typeof comment === "string" ? comment.toLowerCase() : "";
  if (code === "ADR") return "adverse_reaction";
  if (code === "PT") return "patient_choice";
  if (/switch|changed to|replaced (by|with)|instead/.test(c)) return "therapy_changed";
  if (/ineffective|not effective|not working|no (benefit|response)|inadequate response/.test(c)) return "ineffective";
  if (/course (complete|completed|finished)|completed course/.test(c)) return "course_complete";
  if (code === "LAB" || code === "PROC" || code === "OTH" || code === "ERR") return "other";
  return undefined;
}

type RxInfo = { order: Entry; hists: Entry[] };

function collectRx(items: FolioItem[]): Map<string, RxInfo> {
  const orders = new Map<string, Entry>();
  const hists = new Map<string, Map<string, Entry>>();
  for (const item of items) {
    for (const e of entriesOf(item, "MED_ORDER")) {
      const id = str(e.row.RX_ID);
      if (id) orders.set(id, e); // items are sorted by recorded: later restatement wins
    }
    for (const e of entriesOf(item, "MED_STATUS_HIST")) {
      const id = str(e.row.RX_ID);
      if (!id) continue;
      if (!hists.has(id)) hists.set(id, new Map());
      hists.get(id)!.set(str(e.row.HIST_ID) ?? `${item.id}|${e.key}`, e);
    }
  }
  const out = new Map<string, RxInfo>();
  for (const [id, order] of orders) {
    const hs = [...(hists.get(id)?.values() ?? [])];
    hs.sort((a, b) => timeKey(a.row.CHANGED_AT) - timeKey(b.row.CHANGED_AT) || timeKey(a.item.recorded) - timeKey(b.item.recorded));
    out.set(id, { order, hists: hs });
  }
  return out;
}

function mapMedications(rxs: Map<string, RxInfo>): MedicationRow[] {
  const byIngredient = new Map<string, { latest: number; row: MedicationRow }>();
  for (const [, { order, hists }] of rxs) {
    const o = order.row;
    const last = hists[hists.length - 1];
    const code = last ? last.row.NEW_STATUS : o.MED_STATUS;
    if (o.MED_STATUS === 9 || code === 9) continue; // entered in error: never existed
    if (o.ROUTE === "IV") continue; // infusions are not home medications
    const drugName = str(o.DRUG_NAME);
    if (!drugName) continue;
    const status: MedicationRow["status"] | undefined = code === 1 ? "active" : code === 2 ? "stopped" : code === 3 ? "held" : undefined;
    if (!status) continue;

    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [ev(order)] };
    const ing = ingredientOf(drugName);
    if (ing) row.ingredient = ing;

    if (status === "active") {
      // Resumed from a hold: the resume date; otherwise the line's start date.
      const since = last && last.row.OLD_STATUS === 3 && last.row.REASON_CODE !== "ERR" ? localDate(last.row.CHANGED_AT) : localDate(o.START_DATE);
      if (since) row.status_since = since;
    } else if (last) {
      const since = localDate(last.row.CHANGED_AT);
      if (since) row.status_since = since;
      const text = str(last.row.COMMENT_TEXT);
      if (text) row.status_reason_text = text;
      if (status === "stopped") {
        const r = stopReason(last.row.REASON_CODE, last.row.COMMENT_TEXT);
        if (r) row.stop_reason = r;
      }
    }
    const q = num(o.DOSE_QTY);
    const u = DOSE_UNITS[o.DOSE_UNIT];
    if (q !== undefined && q > 0 && u) row.dose = { value: q, unit: u };
    if (typeof o.FREQ_CODE === "string") row.frequency = FREQS.has(o.FREQ_CODE) ? (o.FREQ_CODE as MedicationRow["frequency"]) : "other";
    if (last) row.evidence.push(ev(last));

    const latest = Math.max(timeKey(o.START_DATE), timeKey(order.item.effective), ...hists.map((h) => timeKey(h.row.CHANGED_AT)));
    const key = ing ?? drugName.toLowerCase();
    const prev = byIngredient.get(key);
    if (!prev || latest >= prev.latest) byIngredient.set(key, { latest, row });
  }
  return [...byIngredient.values()].map((v) => v.row).sort((a, b) => ((a.ingredient ?? a.drug_name) < (b.ingredient ?? b.drug_name) ? -1 : 1));
}

// ───────────────────────────── problems & allergies ─────────────────────────────

const CKD_FROM_ICD: Record<string, ProblemRow["ckd_stage"]> = {
  "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
};
const G_CODES = new Set(["G1", "G2", "G3a", "G3b", "G4", "G5"]);
const A_CODES = new Set(["A1", "A2", "A3"]);

function sensitivityFor(icd: string): Sensitivity[] | undefined {
  const c = icd.toUpperCase();
  const cat = c.slice(0, 3);
  if (/^F1[0-9]/.test(cat)) return ["substance-use"];
  if (/^F[0-9]{2}/.test(cat)) return ["mental-health"];
  if (cat === "B20" || cat === "Z21" || /^A5[0-9]|^A6[0-4]/.test(cat)) return ["hiv-sti"];
  if (/^O/.test(cat) || /^Z3[0-9]/.test(cat) || /^N9[4-8]/.test(cat)) return ["sexual-reproductive-health"];
  return undefined;
}

/** Condition grouping key: re-coded or restaged entries of one condition share a key. */
function conditionKey(icd: string): string {
  const cat = icd.toUpperCase().slice(0, 3);
  if (cat === "N18") return "CKD";
  return cat;
}

/** T36–T50 with 6th character 5: adverse effect of a drug. */
function isAdverseEffectTCode(icd: string): boolean {
  return /^T(3[6-9]|4[0-9]|50)\.[0-9A-Z]{2}5/i.test(icd);
}

function findDrugIn(text: string): string | undefined {
  const t = text.toLowerCase();
  for (const d of KNOWN_DRUGS) if (new RegExp(`\\b${d.replace(/ /g, "\\s+")}\\b`).test(t)) return d;
  for (const b of Object.keys(BRANDS)) if (new RegExp(`\\b${b}\\b`).test(t)) return BRANDS[b];
  return undefined;
}

function classifyReaction(text: string): { type: AllergyIntoleranceRow["reaction_type"]; mech: AllergyIntoleranceRow["mechanism"]; crit: AllergyIntoleranceRow["criticality"] } {
  const t = text.toLowerCase();
  if (/anaphyla/.test(t)) return { type: "hypersensitivity", mech: "unknown", crit: "high" };
  if (/angioedema/.test(t)) return { type: "hypersensitivity", mech: /ace|angiotensin[- ]converting/.test(t) ? "non_immune" : "unknown", crit: "high" };
  if (/urticaria|hives|rash|bronchospasm|dermatitis|stevens|hypersensitivity|allerg/.test(t)) return { type: "hypersensitivity", mech: "unknown", crit: "unknown" };
  if (/ketoacidosis/.test(t)) return { type: "serious_adverse_event", mech: "non_immune", crit: "high" };
  if (/acidosis|hyperkalemia|acute kidney|renal failure|rhabdomyolysis|hypoglycemi|pancreatitis|hyponatremia|bleeding|hemorrhage/.test(t))
    return { type: "serious_adverse_event", mech: "unknown", crit: "high" };
  if (/cough/.test(t)) return { type: "side_effect", mech: /ace|angiotensin[- ]converting/.test(t) ? "non_immune" : "unknown", crit: "low" };
  if (/nausea|vomit|diarrh|gastro|dyspepsia|myalgia|dizz|headache|fatigue|edema|constipation|upset/.test(t))
    return { type: "side_effect", mech: "unknown", crit: "low" };
  return { type: "side_effect", mech: "unknown", crit: "unknown" };
}

/** Manifestation codes that commonly accompany an adverse-effect T-code at the same contact. */
const MANIFESTATION = /^(E87\.[0-9]|E11\.1|E13\.1|T78\.3|T88\.[67]|R05|R21|L50|L27|N17|R11|K52\.1|M79\.1|E16\.[02]|D68\.32|T78\.4)/i;

function mapProblemsAndAllergies(items: FolioItem[], rxs: Map<string, RxInfo>): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  type Dx = Entry & { when: number; icd: string; status: string };
  const dxs: Dx[] = [];
  // CKD category facts per contact, from the visit's category fields or (if absent) its N18 code.
  const gFacts: { when: number; g: ProblemRow["ckd_stage"]; e: Entry }[] = [];
  const aFacts: { when: number; a: ProblemRow["albuminuria"]; e: Entry }[] = [];

  for (const item of items) {
    const visits = entriesOf(item, "CLINIC_VISIT");
    const visitTime = new Map<string, number>();
    for (const v of visits) {
      const when = timeKey(v.row.VISIT_AT ?? item.effective);
      visitTime.set(v.row.VISIT_ID, when);
      if (G_CODES.has(v.row.CKD_G)) gFacts.push({ when, g: v.row.CKD_G, e: v });
      if (A_CODES.has(v.row.CKD_A)) aFacts.push({ when, a: v.row.CKD_A, e: v });
    }
    const itemDx = entriesOf(item, "VISIT_DX");
    for (const e of itemDx) {
      const icd = str(e.row.ICD10CM);
      const status = str(e.row.DX_STATUS);
      if (!icd || !status) continue;
      const when = visitTime.get(e.row.VISIT_ID) ?? timeKey(item.effective);
      dxs.push({ ...e, when, icd: icd.toUpperCase(), status });
      const g = CKD_FROM_ICD[icd.toUpperCase()];
      if (g && (status === "A" || status === "H") && !visits.some((v) => v.row.VISIT_ID === e.row.VISIT_ID && G_CODES.has(v.row.CKD_G))) {
        gFacts.push({ when, g, e });
      }
    }
  }
  const order = (a: { when: number; e?: Entry; item?: FolioItem }, b: { when: number; e?: Entry; item?: FolioItem }) => a.when - b.when;
  dxs.sort((a, b) => a.when - b.when || timeKey(a.item.recorded) - timeKey(b.item.recorded) || (a.row.DX_RANK ?? 0) - (b.row.DX_RANK ?? 0));
  gFacts.sort(order);
  aFacts.sort(order);

  // Problem list: latest VISIT_DX row per code; drop codes ruled out or never confirmed.
  const perCode = new Map<string, { latest: Dx; everActive: boolean }>();
  for (const d of dxs) {
    const p = perCode.get(d.icd);
    perCode.set(d.icd, { latest: d, everActive: (p?.everActive ?? false) || d.status === "A" || d.status === "H" });
  }
  const groups = new Map<string, Dx>();
  for (const [icd, { latest, everActive }] of perCode) {
    if (latest.status === "R") continue;
    if (latest.status === "P" && !everActive) continue;
    if (!/^[A-Z]/.test(icd)) continue;
    if (isAdverseEffectTCode(icd)) continue; // yields an allergy row only
    const key = conditionKey(icd);
    const prev = groups.get(key);
    if (!prev || latest.when >= prev.when) groups.set(key, latest);
  }
  const problems: ProblemRow[] = [];
  for (const [key, d] of groups) {
    const condition = str(d.row.DX_TEXT) ?? d.icd;
    const row: ProblemRow = {
      condition,
      icd10cm: d.icd,
      status: d.status === "H" ? "resolved" : "active",
      evidence: [ev(d)],
    };
    if (key === "CKD") {
      const g = gFacts[gFacts.length - 1];
      const a = aFacts[aFacts.length - 1];
      if (g) { row.ckd_stage = g.g; if (g.e !== d) row.evidence.push(ev(g.e)); }
      if (a) { row.albuminuria = a.a; if (a.e !== d && a.e !== g?.e) row.evidence.push(ev(a.e)); }
    }
    const s = sensitivityFor(d.icd);
    if (s) row.sensitivity = s;
    problems.push(row);
  }
  problems.sort((a, b) => (a.icd10cm ?? "") < (b.icd10cm ?? "") ? -1 : 1);

  // Drug-caused diagnoses -> allergy/intolerance rows.
  const allergies = new Map<string, { when: number; row: AllergyIntoleranceRow }>();
  for (const [icd, { latest: d, everActive }] of perCode) {
    if (d.status === "R" || (d.status === "P" && !everActive)) continue;
    const text = str(d.row.DX_TEXT) ?? "";
    const tcode = isAdverseEffectTCode(icd);
    const attributed = /associated|induced|due to|caused by|adverse effect|secondary to|related to|toxicity|intoleran|allerg/i.test(text);
    if (!tcode && !attributed) continue;

    let substance = findDrugIn(text);
    if (!substance) {
      const classes = DRUG_CLASSES.filter((c) => c.re.test(text));
      if (!classes.length) continue; // no drug named: not a drug-caused diagnosis we can attribute
      const cls = { label: classes[0].label, members: classes.flatMap((c) => c.members) };
      // The one drug of the named class(es) on the medication list in the same item, if exactly one.
      const sameItem = new Set<string>();
      for (const e of entriesOf(d.item, "MED_ORDER")) {
        const ing = str(e.row.DRUG_NAME) ? ingredientOf(e.row.DRUG_NAME) : undefined;
        if (ing && e.row.MED_STATUS !== 9 && cls.members.includes(ing)) sameItem.add(ing);
      }
      for (const e of entriesOf(d.item, "MED_STATUS_HIST")) {
        const rx = rxs.get(e.row.RX_ID);
        const ing = rx && str(rx.order.row.DRUG_NAME) ? ingredientOf(rx.order.row.DRUG_NAME) : undefined;
        if (ing && cls.members.includes(ing)) sameItem.add(ing);
      }
      substance = sameItem.size === 1 ? [...sameItem][0] : cls.label;
    }

    // Reaction: the diagnosis itself, or for a bare T-code the manifestation codes at the same contact.
    let reaction: string | undefined;
    if (tcode) {
      const manif = dxs.filter((x) => x.item === d.item && x.row.VISIT_ID === d.row.VISIT_ID && x.icd !== icd && MANIFESTATION.test(x.icd) && x.status !== "R");
      const texts = [...new Set(manif.map((x) => str(x.row.DX_TEXT)).filter((x): x is string => !!x))];
      reaction = texts.length ? texts.join("; ") : undefined;
    } else {
      reaction = text;
    }
    const cls = classifyReaction(`${reaction ?? ""} ${text}`);
    const mechText = `${reaction ?? ""} ${text} ${substance}`;
    let mech = cls.mech;
    if (mech === "unknown" && /angioedema|cough/i.test(reaction ?? text) && DRUG_CLASSES[0].members.includes(substance)) mech = "non_immune";
    if (mech === "unknown" && /ketoacidosis/i.test(mechText)) mech = "non_immune";

    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: cls.type,
      mechanism: mech,
      criticality: cls.crit,
      evidence: [ev(d)],
    };
    if (reaction) row.reaction = reaction;
    // The source does not record when the reaction began: onset is left out.
    const prev = allergies.get(substance);
    if (!prev || d.when >= prev.when) allergies.set(substance, { when: d.when, row });
  }

  return { problems, allergies: [...allergies.values()].map((v) => v.row) };
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return empty;
  const current = currentItems(items, asOf);
  const safe = <T>(f: () => T, d: T): T => {
    try { return f(); } catch { return d; }
  };
  const rxs = safe(() => collectRx(current), new Map<string, RxInfo>());
  const pa = safe(() => mapProblemsAndAllergies(current, rxs), { problems: [] as ProblemRow[], allergies: [] as AllergyIntoleranceRow[] });
  return {
    medications: safe(() => mapMedications(rxs), []),
    problems: pa.problems,
    allergies: pa.allergies,
    labs: safe(() => mapLabs(current), []),
    vitals: safe(() => mapVitals(current), []),
  };
}
