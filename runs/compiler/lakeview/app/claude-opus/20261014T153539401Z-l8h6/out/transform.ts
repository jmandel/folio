import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  ProblemRow,
  AllergyIntoleranceRow,
  LabResultRow,
  VitalRow,
  Evidence,
  Analyte,
  Sensitivity,
} from "../in/views/views";

// Mapper for Lakeview Labs & Kidney Care (lakeview-v1) items.

const TZ = "America/Chicago";

// ───────────────────────────── time helpers ─────────────────────────────

const OFFSET_RE = /(Z|[+-]\d{2}:?\d{2})$/i;

let fmt: Intl.DateTimeFormat | null = null;
function chicagoParts(epoch: number): { y: string; mo: string; d: string; h: string; mi: string; s: string } | null {
  try {
    if (!fmt) {
      fmt = new Intl.DateTimeFormat("en-US", {
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
    const p: Record<string, string> = {};
    for (const part of fmt.formatToParts(new Date(epoch))) p[part.type] = part.value;
    const h = p.hour === "24" ? "00" : p.hour;
    return { y: p.year, mo: p.month, d: p.day, h, mi: p.minute, s: p.second };
  } catch {
    return null;
  }
}

/** Offset (minutes, local − UTC) in effect in Chicago at the given instant. */
function chicagoOffsetAt(epoch: number): number {
  const p = chicagoParts(epoch);
  if (!p) return -360;
  const asUtc = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +p.mi, +p.s);
  return Math.round((asUtc - Math.floor(epoch / 1000) * 1000) / 60000);
}

const WALL_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?$/;

/** Epoch ms of a date-time string; strings without offset are Chicago wall time. */
function toEpoch(s: unknown): number | null {
  if (typeof s !== "string" || !s) return null;
  const t = s.trim();
  if (OFFSET_RE.test(t) && /T/.test(t)) {
    const e = Date.parse(t);
    return isNaN(e) ? null : e;
  }
  const m = WALL_RE.exec(t);
  if (!m) return null;
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
  let off = chicagoOffsetAt(wall - 6 * 3600000);
  let e = wall - off * 60000;
  off = chicagoOffsetAt(e);
  e = wall - off * 60000;
  return e;
}

/** Local wall-clock "YYYY-MM-DDTHH:MM" in Chicago. */
function localMinute(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (!OFFSET_RE.test(t)) {
    const m = WALL_RE.exec(t);
    if (m && m[4] !== undefined) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
    return null;
  }
  const e = toEpoch(t);
  if (e === null) return null;
  const p = chicagoParts(e);
  return p ? `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}` : null;
}

/** Local date (source precision for plain/partial dates). */
function localDate(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  const lm = localMinute(t);
  if (lm) return lm.slice(0, 10);
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(t);
  return m ? m[1] : null;
}

/** RFC 3339 with the Chicago offset in effect. */
function rfc3339Local(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const e = toEpoch(s);
  if (e === null) return null;
  const p = chicagoParts(e);
  if (!p) return null;
  const off = chicagoOffsetAt(e);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  const oh = String(Math.floor(a / 60)).padStart(2, "0");
  const om = String(a % 60).padStart(2, "0");
  return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}:${p.s}${sign}${oh}:${om}`;
}

function sortKey(s: unknown): number {
  const e = toEpoch(s);
  return e === null ? -Infinity : e;
}

// ───────────────────────────── item selection ─────────────────────────────

interface Entry {
  item: FolioItem;
  key?: string;
  row: any;
}

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const recorded: FolioItem[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const d = localDate(it.recorded);
    if (!d || d.length !== 10 || d > asOf) continue;
    recorded.push(it);
  }
  const ids = new Set(recorded.map((i) => i.id));
  // Supersession is transitive; since every recorded superseder itself counts as "recorded", a
  // chain C→B→A excludes A both via B and (if C restates it) via C. Superseded items' own
  // supersedes/retracts were already in effect when they counted, and replacements restate them.
  const removed = new Set<string>();
  const sup = new Map<string, string[]>();
  for (const it of recorded) {
    const s = Array.isArray(it.supersedes) ? it.supersedes.filter((x) => typeof x === "string") : [];
    sup.set(it.id, s);
    for (const r of Array.isArray(it.retracts) ? it.retracts : []) if (typeof r === "string") removed.add(r);
  }
  const stack: string[] = [];
  for (const it of recorded) for (const s of sup.get(it.id) ?? []) stack.push(s);
  while (stack.length) {
    const x = stack.pop()!;
    if (removed.has(x)) continue;
    removed.add(x);
    for (const s of sup.get(x) ?? []) stack.push(s);
  }
  return recorded
    .filter((i) => ids.has(i.id) && !removed.has(i.id))
    .sort((a, b) => sortKey(a.recorded) - sortKey(b.recorded) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

function entriesOf(item: FolioItem): Entry[] {
  const out: Entry[] = [];
  const p = item.payload;
  if (!p || typeof p !== "object") return out;
  if (Array.isArray(p)) {
    for (const r of p) if (r && typeof r === "object" && typeof r.type === "string") out.push({ item, row: r });
  } else {
    for (const [k, r] of Object.entries(p)) {
      if (r && typeof r === "object" && typeof (r as any).type === "string") out.push({ item, key: k, row: r });
    }
  }
  return out;
}

function ev(e: Entry): { item_id: string; entry_id?: string } {
  return e.key !== undefined ? { item_id: e.item.id, entry_id: e.key } : { item_id: e.item.id };
}

function dedupEvidence(list: Evidence): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const x of list) {
    const k = x.item_id + "\u0000" + (x.entry_id ?? "");
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const num = (v: unknown): number | undefined => (typeof v === "number" && isFinite(v) ? v : undefined);

// ───────────────────────────── labs ─────────────────────────────

const LAB_MAP: Record<string, { analyte: Analyte; unit: string; srcUnit: string }> = {
  "LK-CREAT": { analyte: "creatinine", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-EGFR09N": { analyte: "egfr", unit: "mL/min/1.73m2", srcUnit: "mL/min/1.73m2" },
  "LK-EGFR21": { analyte: "egfr", unit: "mL/min/1.73m2", srcUnit: "mL/min/1.73m2" },
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
  // LK-EGFR09A (race coefficient variant) is deliberately not mapped.
};

function parseValue(text: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | null {
  if (typeof text !== "string") return null;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(text);
  if (!m) return null;
  const value = Number(m[2]);
  if (!isFinite(value)) return null;
  const c = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as "<" | ">" | "<=" | ">=" | undefined);
  return c ? { value, comparator: c } : { value };
}

function egfrEquation(code: string, comment: unknown): LabResultRow["egfr_equation"] {
  const c = typeof comment === "string" ? comment.toUpperCase() : "";
  if (/MDRD/.test(c)) return "mdrd";
  if (/CKD-?EPI[^.]*2021/.test(c)) return "ckd-epi-2021";
  if (/CKD-?EPI[^.]*2009/.test(c)) return "ckd-epi-2009";
  if (code === "LK-EGFR21") return "ckd-epi-2021";
  if (code === "LK-EGFR09N") return "ckd-epi-2009";
  return "unknown";
}

function mapLabs(items: FolioItem[]): LabResultRow[] {
  interface Copy {
    entry: Entry;
    order?: Entry;
    collected?: string;
  }
  const byResult = new Map<string, Copy[]>();
  for (const item of items) {
    const es = entriesOf(item);
    const req = es.find((e) => e.row.type === "LAB_REQ");
    const orders = new Map<string, Entry>();
    for (const e of es) if (e.row.type === "LAB_ORDER" && typeof e.row.ORDER_ID === "string") orders.set(e.row.ORDER_ID, e);
    for (const e of es) {
      if (e.row.type !== "LAB_RESULT") continue;
      const id = str(e.row.RESULT_ID) ?? `${item.id}#${e.key ?? ""}`;
      const order = typeof e.row.ORDER_ID === "string" ? orders.get(e.row.ORDER_ID) : undefined;
      const copies = byResult.get(id) ?? [];
      copies.push({ entry: e, order, collected: req?.row.COLLECTED_AT });
      byResult.set(id, copies);
    }
  }

  const rank = (s: unknown): number => (s === "C" || s === "X" ? 4 : s === "A" ? 3 : s === "F" ? 2 : s === "P" ? 1 : 0);
  const rows: LabResultRow[] = [];
  for (const copies of byResult.values()) {
    // Any copy whose order is void / cancelled or whose value is withdrawn rules the result out.
    if (copies.some((c) => c.order && (c.order.row.ORDER_STATUS === 9 || c.order.row.ORDER_STATUS === 5))) continue;
    const best = copies.slice().sort((a, b) => {
      const d = rank(b.entry.row.RESULT_STATUS) - rank(a.entry.row.RESULT_STATUS);
      return d || sortKey(b.entry.item.recorded) - sortKey(a.entry.item.recorded);
    })[0];
    const r = best.entry.row;
    const st = r.RESULT_STATUS;
    if (st !== "P" && st !== "F" && st !== "A") continue;
    const code = str(r.TEST_CODE);
    if (!code) continue;
    const map = LAB_MAP[code];
    if (!map) continue;
    if (r.UNIT_CODE !== map.srcUnit) continue;
    const v = parseValue(r.VALUE_TEXT);
    if (!v) continue;
    const collected = rfc3339Local(best.collected);
    if (!collected) continue;
    const row: LabResultRow = {
      analyte: map.analyte,
      value: v.value,
      unit: map.unit,
      collected,
      status: st === "P" ? "preliminary" : "final",
      evidence: [],
    };
    if (v.comparator) row.comparator = v.comparator;
    if (map.analyte === "egfr") row.egfr_equation = egfrEquation(code, r.COMMENT_TEXT);
    const loinc = str(r.LOINC);
    if (loinc) row.loinc = loinc;
    const evid: Evidence = [ev(best.entry)];
    for (const c of copies) if (c !== best) evid.push(ev(c.entry));
    row.evidence = dedupEvidence(evid);
    rows.push(row);
  }
  rows.sort((a, b) => sortKey(a.collected) - sortKey(b.collected) || (a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
  return rows;
}

// ───────────────────────────── vitals ─────────────────────────────

function mapVitals(items: FolioItem[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const item of items) {
    const vit = entriesOf(item).filter((e) => e.row.type === "VITAL" && num(e.row.VALUE_NUM) !== undefined);
    if (!vit.length) continue;
    // Group by visit in case an item ever carries more than one.
    const byVisit = new Map<string, Entry[]>();
    for (const e of vit) {
      const k = str(e.row.VISIT_ID) ?? "";
      const l = byVisit.get(k) ?? [];
      l.push(e);
      byVisit.set(k, l);
    }
    for (const list of byVisit.values()) {
      const ofCode = (c: string) =>
        list
          .filter((e) => e.row.VITAL_CODE === c)
          .sort((a, b) => (num(a.row.READING_NO) ?? 1) - (num(b.row.READING_NO) ?? 1) || sortKey(a.row.TAKEN_AT) - sortKey(b.row.TAKEN_AT));
      const sys = ofCode("BPS");
      const dia = ofCode("BPD");
      const hr = ofCode("HR");
      const wt = ofCode("WT");
      const readings = Array.from(new Set([...sys, ...dia].map((e) => num(e.row.READING_NO) ?? 1))).sort((a, b) => a - b);
      const at = (l: Entry[], n: number) => l.find((e) => (num(e.row.READING_NO) ?? 1) === n);

      let timeSrc: unknown;
      const firstBp = readings.length ? (at(sys, readings[0]) ?? at(dia, readings[0])) : undefined;
      if (firstBp) timeSrc = firstBp.row.TAKEN_AT;
      else {
        const sorted = list.slice().sort((a, b) => sortKey(a.row.TAKEN_AT) - sortKey(b.row.TAKEN_AT));
        timeSrc = sorted[0].row.TAKEN_AT;
      }
      const local_time = localMinute(timeSrc) ?? localMinute(item.effective);
      if (!local_time) continue;
      const row: VitalRow = { setting: "clinic", local_time, evidence: [] };
      const used: Entry[] = [];
      if (readings.length) {
        const s = at(sys, readings[0]);
        const d = at(dia, readings[0]);
        if (s) { row.systolic_mmhg = s.row.VALUE_NUM; used.push(s); }
        if (d) { row.diastolic_mmhg = d.row.VALUE_NUM; used.push(d); }
        if (readings.length > 1) {
          const n = readings[readings.length - 1];
          const rs = at(sys, n);
          const rd = at(dia, n);
          if (rs) { row.repeat_systolic_mmhg = rs.row.VALUE_NUM; used.push(rs); }
          if (rd) { row.repeat_diastolic_mmhg = rd.row.VALUE_NUM; used.push(rd); }
        }
      }
      if (hr.length) { row.pulse_bpm = hr[0].row.VALUE_NUM; used.push(hr[0]); }
      if (wt.length) {
        const w = wt[0].row;
        const unit = typeof w.UNIT_CODE === "string" ? w.UNIT_CODE.toLowerCase() : "kg";
        let kg: number | undefined = w.VALUE_NUM;
        if (unit === "lb" || unit === "lbs" || unit === "[lb_av]") kg = w.VALUE_NUM * 0.45359237;
        else if (unit === "g") kg = w.VALUE_NUM / 1000;
        else if (unit !== "kg") kg = undefined;
        if (kg !== undefined) { row.weight_kg = Math.round(kg * 10) / 10; used.push(wt[0]); }
      }
      if (!used.length) continue;
      const visit = entriesOf(item).find((e) => e.row.type === "CLINIC_VISIT");
      row.evidence = dedupEvidence([...(visit ? [ev(visit)] : []), ...used.map(ev)]);
      rows.push(row);
    }
  }
  rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return rows;
}

// ───────────────────────────── medications ─────────────────────────────

const BRANDS: Record<string, string> = {
  kerendia: "finerenone",
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  trulicity: "dulaglutide",
  victoza: "liraglutide",
  mounjaro: "tirzepatide",
  lasix: "furosemide",
  bumex: "bumetanide",
  demadex: "torsemide",
  lokelma: "sodium zirconium cyclosilicate",
  veltassa: "patiromer",
  kayexalate: "sodium polystyrene sulfonate",
  renvela: "sevelamer",
  renagel: "sevelamer",
  velphoro: "sucroferric oxyhydroxide",
  auryxia: "ferric citrate",
  sensipar: "cinacalcet",
  zemplar: "paricalcitol",
  hectorol: "doxercalciferol",
  rocaltrol: "calcitriol",
  epogen: "epoetin alfa",
  procrit: "epoetin alfa",
  retacrit: "epoetin alfa",
  aranesp: "darbepoetin alfa",
  cozaar: "losartan",
  diovan: "valsartan",
  benicar: "olmesartan",
  avapro: "irbesartan",
  micardis: "telmisartan",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  vasotec: "enalapril",
  altace: "ramipril",
  norvasc: "amlodipine",
  aldactone: "spironolactone",
  inspra: "eplerenone",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  zocor: "simvastatin",
  glucophage: "metformin",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  humalog: "insulin lispro",
  novolog: "insulin aspart",
  coreg: "carvedilol",
  toprol: "metoprolol",
  lopressor: "metoprolol",
  zyloprim: "allopurinol",
  uloric: "febuxostat",
  tylenol: "acetaminophen",
};

const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "dihydrochloride", "hydrobromide", "besylate", "besilate", "maleate", "mesylate",
  "succinate", "tartrate", "fumarate", "potassium", "sodium", "calcium", "magnesium", "monohydrate",
  "dihydrate", "trihydrate", "hyclate", "phosphate", "sulfate", "carbonate", "acetate", "medoxomil",
  "bromide", "chloride", "citrate", "gluconate", "dipropionate", "propionate", "valerate", "hemihydrate",
]);
const CATION_ONLY = new Set(["sodium", "potassium", "calcium", "magnesium", "ferrous", "ferric", "zinc", "iron", "lithium", "aluminum"]);
const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "solution", "suspension", "injection",
  "injectable", "pen", "syringe", "vial", "oral", "er", "xr", "xl", "sr", "dr", "cr", "la", "ec", "odt",
  "extended-release", "delayed-release", "chewable", "film-coated", "powder", "packet", "kit", "subcutaneous",
  "intravenous", "prefilled", "auto-injector", "cream", "ointment", "patch", "inhaler", "drops",
]);

function ingredientOf(drugName: string): string | undefined {
  let name = drugName.toLowerCase().replace(/\(.*?\)/g, " ").replace(/\s+/g, " ").trim();
  // Cut at the strength (first token beginning with a digit).
  const toks = name.split(" ");
  const kept: string[] = [];
  for (const t of toks) {
    if (/^[\d.]/.test(t)) break;
    kept.push(t);
  }
  while (kept.length && FORM_WORDS.has(kept[kept.length - 1])) kept.pop();
  if (!kept.length) return undefined;
  name = kept.join(" ");
  const parts = name.split(/\s*(?:\/|-(?=[a-z]{3,})|\band\b|\+)\s*/).filter(Boolean);
  const cleaned = parts.map((p) => {
    let w = p.split(" ").filter((x) => !FORM_WORDS.has(x));
    if (w.length === 1 && BRANDS[w[0]]) return BRANDS[w[0]];
    // Strip trailing salt words unless what is left is only a cation (e.g. "calcium acetate").
    while (w.length > 1 && SALT_WORDS.has(w[w.length - 1])) {
      const rest = w.slice(0, -1);
      if (rest.length === 1 && CATION_ONLY.has(rest[0])) break;
      w = rest;
    }
    const j = w.join(" ");
    return BRANDS[j] ?? j;
  });
  const out = cleaned.filter(Boolean).join(" / ");
  return out || undefined;
}

const MED_SENS: [RegExp, Sensitivity][] = [
  [/\b(buprenorphine|methadone|naltrexone|naloxone|disulfiram|acamprosate|varenicline)\b/, "substance-use"],
  [/\b(quetiapine|olanzapine|risperidone|aripiprazole|haloperidol|clozapine|lurasidone|ziprasidone|lithium|lamotrigine|sertraline|fluoxetine|citalopram|escitalopram|paroxetine|venlafaxine|duloxetine|bupropion|mirtazapine|trazodone|lorazepam|alprazolam|clonazepam|diazepam)\b/, "mental-health"],
  [/\b(tenofovir|emtricitabine|dolutegravir|bictegravir|raltegravir|efavirenz|rilpivirine|darunavir|abacavir|lamivudine|zidovudine|cabotegravir)\b/, "hiv-sti"],
  [/\b(estradiol|ethinyl|norethindrone|levonorgestrel|medroxyprogesterone|drospirenone|etonogestrel|sildenafil|tadalafil)\b/, "sexual-reproductive-health"],
];

function medSensitivity(text: string): Sensitivity[] | undefined {
  const t = text.toLowerCase();
  const out: Sensitivity[] = [];
  for (const [re, s] of MED_SENS) if (re.test(t) && !out.includes(s)) out.push(s);
  return out.length ? out : undefined;
}

const FREQ: Record<string, MedicationRow["frequency"]> = { QD: "QD", BID: "BID", TID: "TID", QHS: "QHS", QW: "QW", PRN: "PRN" };
const DOSE_UNIT: Record<string, NonNullable<MedicationRow["dose"]>["unit"]> = { mg: "mg", mcg: "mcg", unit: "units", units: "units", ml: "mL" };

function mapMedications(items: FolioItem[]): MedicationRow[] {
  // Latest restatement of each prescription (items are sorted by recorded).
  const orders = new Map<string, Entry>();
  const visitAt = new Map<string, string>();
  const hist = new Map<string, Entry[]>();
  for (const item of items) {
    const es = entriesOf(item);
    for (const e of es) if (e.row.type === "CLINIC_VISIT" && typeof e.row.VISIT_ID === "string") visitAt.set(e.row.VISIT_ID, e.row.VISIT_AT);
    for (const e of es) {
      if (e.row.type === "MED_ORDER" && typeof e.row.RX_ID === "string") orders.set(e.row.RX_ID, e);
      if (e.row.type === "MED_STATUS_HIST" && typeof e.row.RX_ID === "string") {
        const l = hist.get(e.row.RX_ID) ?? [];
        l.push(e);
        hist.set(e.row.RX_ID, l);
      }
    }
  }

  interface Cand { row: MedicationRow; key: string; latest: number; }
  const byIngredient = new Map<string, Cand>();
  for (const [rxId, o] of orders) {
    const r = o.row;
    const drugName = str(r.DRUG_NAME);
    if (!drugName) continue;
    const hs = (hist.get(rxId) ?? []).slice().sort((a, b) => sortKey(a.row.CHANGED_AT) - sortKey(b.row.CHANGED_AT) || sortKey(a.item.recorded) - sortKey(b.item.recorded));
    const last = hs.length ? hs[hs.length - 1] : undefined;
    const code = last ? last.row.NEW_STATUS : r.MED_STATUS;
    if (code === 9) continue;
    const status: MedicationRow["status"] = code === 1 ? "active" : code === 2 ? "stopped" : code === 3 ? "held" : "unknown";

    const ingredient = ingredientOf(drugName);
    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [] };
    if (ingredient) row.ingredient = ingredient;

    let since: string | null = null;
    if (last) since = localDate(last.row.CHANGED_AT);
    else if (status === "active") since = localDate(r.START_DATE);
    else since = localDate(visitAt.get(r.VISIT_ID) ?? o.item.effective);
    if (since) row.status_since = since;

    const qty = num(r.DOSE_QTY);
    const du = typeof r.DOSE_UNIT === "string" ? DOSE_UNIT[r.DOSE_UNIT.toLowerCase()] : undefined;
    if (qty !== undefined && du) row.dose = { value: qty, unit: du };
    if (typeof r.FREQ_CODE === "string") {
      const f = FREQ[r.FREQ_CODE.toUpperCase()];
      row.frequency = f ?? "other";
    }

    if (last) {
      const reason = last.row.REASON_CODE;
      if (status === "stopped") {
        row.stop_reason =
          reason === "ADR" ? "adverse_reaction" : reason === "PT" ? "patient_choice" : "other";
      }
      const txt = str(last.row.COMMENT_TEXT);
      if (txt) row.status_reason_text = txt;
    }

    const sens = medSensitivity(drugName + " " + (ingredient ?? ""));
    if (sens) row.sensitivity = sens;

    row.evidence = dedupEvidence([...(last ? [ev(last)] : []), ev(o), ...hs.filter((h) => h !== last).map(ev)]);

    const events = [sortKey(r.START_DATE), sortKey(visitAt.get(r.VISIT_ID)), sortKey(o.item.effective), ...hs.map((h) => sortKey(h.row.CHANGED_AT))];
    const latest = Math.max(...events);
    const key = ingredient ?? drugName.toLowerCase();
    const prev = byIngredient.get(key);
    if (!prev || latest > prev.latest || (latest === prev.latest && rxId > prev.key)) byIngredient.set(key, { row, key: rxId, latest });
  }
  return Array.from(byIngredient.values())
    .sort((a, b) => ((a.row.ingredient ?? a.row.drug_name) < (b.row.ingredient ?? b.row.drug_name) ? -1 : 1))
    .map((c) => c.row);
}

// ───────────────────────────── problems & allergies ─────────────────────────────

const CKD_STAGE_BY_CODE: Record<string, ProblemRow["ckd_stage"]> = {
  "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
};
const G_VALUES = new Set(["G1", "G2", "G3a", "G3b", "G4", "G5"]);
const A_VALUES = new Set(["A1", "A2", "A3"]);

function problemGroup(icd: string): string {
  const c = icd.toUpperCase();
  if (c.startsWith("N18")) return "CKD";
  if (/^[ZTSVWXY]/.test(c)) return c;
  return c.slice(0, 3);
}

/** ICD-10-CM T36–T50 with 6th character 5: adverse effect of a drug. */
function isAdverseEffectCode(icd: string): boolean {
  const m = /^T(\d{2})\.?([0-9A-Z]{0,4})/.exec(icd.toUpperCase());
  if (!m) return false;
  const cat = +m[1];
  if (cat < 36 || cat > 50) return false;
  return m[2].length >= 3 && m[2][2] === "5";
}

function problemSensitivity(icd: string, text: string): Sensitivity[] | undefined {
  const c = icd.toUpperCase().replace(".", "");
  const t = text.toLowerCase();
  const out: Sensitivity[] = [];
  const add = (s: Sensitivity) => { if (!out.includes(s)) out.push(s); };
  if (/^F1[0-9]/.test(c) || /^T40/.test(c) && /poison/.test(t)) add("substance-use");
  else if (/^F/.test(c)) add("mental-health");
  if (/^(B20|Z21|B97\.35|R75|Z206)/.test(c) || /^A5[0-9]|^A6[0-4]/.test(c)) add("hiv-sti");
  if (/^(O|Z3[0-9]|N9[67]|Z30)/.test(c)) add("sexual-reproductive-health");
  if (/^(Q6111|Q612|Q8781|Z15|Z14|E750|E752)/.test(c) || /\b(autosomal|hereditary|familial|genetic)\b/.test(t)) add("genetic");
  return out.length ? out : undefined;
}

const DRUG_CLASSES: [RegExp, RegExp][] = [
  [/angiotensin[- ]converting[- ]enzyme|ace inhibitor/i, /pril$/],
  [/angiotensin[- ]?ii receptor|angiotensin receptor|\barb\b/i, /sartan$/],
  [/penicillin/i, /cillin$/],
  [/cephalosporin/i, /^cef|^ceph/],
  [/statin|hmg-coa|antihyperlipidemic/i, /statin$/],
  [/sglt|sodium-glucose/i, /gliflozin$/],
  [/glp-1|glucagon-like/i, /glutide$|tirzepatide/],
  [/sulfonamide/i, /^sulfa/],
  [/loop diuretic/i, /^(furosemide|bumetanide|torsemide)$/],
  [/thiazide/i, /thiazide$|^chlorthalidone$|^metolazone$/],
  [/potassium-sparing|aldosterone|mineralocorticoid/i, /^(spironolactone|eplerenone|finerenone)$/],
  [/insulin/i, /^insulin/],
  [/nonsteroidal anti-inflammatory|nsaid|propionic acid/i, /^(ibuprofen|naproxen|diclofenac|meloxicam|celecoxib|ketorolac|indomethacin)$/],
  [/calcium[- ]channel/i, /dipine$|^diltiazem$|^verapamil$/],
  [/beta[- ]adrenoreceptor|beta[- ]blocker/i, /olol$|^carvedilol$|^labetalol$/],
  [/biguanide/i, /^metformin$/],
];

function allergySubstance(dxText: string, sameItemIngredients: string[]): string {
  let s = dxText.replace(/,?\s*(initial|subsequent) encounter.*$/i, "").replace(/,?\s*sequela.*$/i, "").trim();
  const m = /adverse effect of (.+)$/i.exec(s);
  if (m) s = m[1].trim();
  s = s.replace(/^(other|unspecified)\s+/i, "");
  const single = ingredientOf(s);
  for (const [classRe, drugRe] of DRUG_CLASSES) {
    if (classRe.test(s)) {
      const hits = Array.from(new Set(sameItemIngredients.filter((i) => drugRe.test(i))));
      return hits.length === 1 ? hits[0] : s;
    }
  }
  // A single named drug: generic lower case. Otherwise as written.
  if (single && /^[a-z]+( [a-z]+)?$/.test(single) && !/drugs?|agents?|medicaments?|antibiotics?|inhibitors?|blockers?|diuretics?/.test(single)) {
    return BRANDS[single] ?? single;
  }
  return s;
}

const HYPERSENS_RE = /urticaria|hives|angioedema|anaphyla|rash|dermatitis|bronchospasm|swelling|stevens|erythema|pruritus/i;
const SERIOUS_RE = /acute kidney|kidney failure|renal failure|tubulo|nephritis|pancreatitis|hepat|liver|agranulocytosis|aplastic|neutropenia|rhabdomyolysis|lactic acidosis|ketoacidosis|seizure|arrhythmia|torsade|hemorrhage|bleeding/i;

function mapProblemsAndAllergies(items: FolioItem[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  interface Dx { e: Entry; t: number; rank: number; visit?: Entry; }
  const groups = new Map<string, Dx[]>();
  const adverse = new Map<string, Dx[]>();
  const visits: { e: Entry; t: number }[] = [];
  const itemDx = new Map<string, Dx[]>();
  const itemIngr = new Map<string, string[]>();

  for (const item of items) {
    const es = entriesOf(item);
    const visit = es.find((e) => e.row.type === "CLINIC_VISIT");
    if (visit) visits.push({ e: visit, t: sortKey(visit.row.VISIT_AT ?? item.effective) });
    itemIngr.set(item.id, es.filter((e) => e.row.type === "MED_ORDER" && e.row.MED_STATUS !== 9 && typeof e.row.DRUG_NAME === "string")
      .map((e) => ingredientOf(e.row.DRUG_NAME)).filter((x): x is string => !!x));
    const list: Dx[] = [];
    for (const e of es) {
      if (e.row.type !== "VISIT_DX") continue;
      const icd = str(e.row.ICD10CM);
      if (!icd) continue;
      const dx: Dx = { e, t: sortKey(visit?.row.VISIT_AT ?? item.effective), rank: num(e.row.DX_RANK) ?? 99, visit };
      list.push(dx);
      const target = isAdverseEffectCode(icd) ? adverse : groups;
      const k = isAdverseEffectCode(icd) ? icd.toUpperCase().slice(0, 5) : problemGroup(icd);
      const l = target.get(k) ?? [];
      l.push(dx);
      target.set(k, l);
    }
    itemDx.set(item.id, list);
  }
  const byTime = (a: Dx, b: Dx) => a.t - b.t || sortKey(a.e.item.recorded) - sortKey(b.e.item.recorded) || b.rank - a.rank;

  // Latest clinician-recorded CKD categories (visit fields, else the stage in the CKD code).
  visits.sort((a, b) => a.t - b.t);
  let ckdG: { v: ProblemRow["ckd_stage"]; e: Entry } | undefined;
  let ckdA: { v: NonNullable<ProblemRow["albuminuria"]>; e: Entry } | undefined;
  for (const v of visits) {
    const r = v.e.row;
    let g: ProblemRow["ckd_stage"] | undefined = G_VALUES.has(r.CKD_G) ? r.CKD_G : undefined;
    let gEntry = v.e;
    if (!g) {
      const dxs = itemDx.get(v.e.item.id) ?? [];
      for (const d of dxs) {
        const s = CKD_STAGE_BY_CODE[String(d.e.row.ICD10CM).toUpperCase()];
        if (s && d.e.row.DX_STATUS !== "R") { g = s; gEntry = d.e; break; }
      }
    }
    if (g) ckdG = { v: g, e: gEntry };
    if (A_VALUES.has(r.CKD_A)) ckdA = { v: r.CKD_A, e: v.e };
  }

  const problems: ProblemRow[] = [];
  for (const [k, list] of groups) {
    list.sort(byTime);
    const last = list[list.length - 1];
    const st = last.e.row.DX_STATUS;
    if (st === "R") continue;
    let status: ProblemRow["status"];
    if (st === "A") status = "active";
    else if (st === "H") status = "resolved";
    else {
      // Provisional (or unknown code): only if confirmed at some point.
      const confirmed = list.filter((d) => d.e.row.DX_STATUS === "A" || d.e.row.DX_STATUS === "H");
      if (!confirmed.length) continue;
      status = confirmed[confirmed.length - 1].e.row.DX_STATUS === "H" ? "resolved" : "active";
    }
    const icd = str(last.e.row.ICD10CM)!;
    const condition = str(last.e.row.DX_TEXT) ?? icd;
    const row: ProblemRow = { condition, icd10cm: icd, status, evidence: [] };
    const evid: Evidence = [ev(last.e)];
    if (k === "CKD") {
      if (ckdG) { row.ckd_stage = ckdG.v; evid.push(ev(ckdG.e)); }
      if (ckdA) { row.albuminuria = ckdA.v; evid.push(ev(ckdA.e)); }
    }
    const sens = problemSensitivity(icd, condition);
    if (sens) row.sensitivity = sens;
    row.evidence = dedupEvidence(evid);
    problems.push(row);
  }
  problems.sort((a, b) => (a.icd10cm ?? "").localeCompare(b.icd10cm ?? ""));

  const allergies: AllergyIntoleranceRow[] = [];
  const seenSubst = new Map<string, AllergyIntoleranceRow>();
  for (const list of adverse.values()) {
    list.sort(byTime);
    const last = list[list.length - 1];
    const st = last.e.row.DX_STATUS;
    if (st === "R") continue;
    if (st !== "A" && st !== "H" && !list.some((d) => d.e.row.DX_STATUS === "A" || d.e.row.DX_STATUS === "H")) continue;
    const text = str(last.e.row.DX_TEXT) ?? str(last.e.row.ICD10CM)!;
    const substance = allergySubstance(text, itemIngr.get(last.e.item.id) ?? []);
    // Manifestation: the diagnosis ranked immediately before the adverse-effect code at that contact.
    const sameItem = (itemDx.get(last.e.item.id) ?? []).slice().sort((a, b) => a.rank - b.rank);
    const idx = sameItem.indexOf(last);
    const prev = idx > 0 ? sameItem[idx - 1] : undefined;
    const prevIcd = prev ? String(prev.e.row.ICD10CM).toUpperCase() : "";
    const manifestation = prev && !/^(E1[013]|I1[0-6]|N18|Z|T)/.test(prevIcd) && prev.e.row.DX_STATUS !== "R" ? str(prev.e.row.DX_TEXT) : undefined;
    const reactionText = manifestation ?? "";
    const reaction_type: AllergyIntoleranceRow["reaction_type"] = HYPERSENS_RE.test(reactionText)
      ? "hypersensitivity"
      : SERIOUS_RE.test(reactionText)
        ? "serious_adverse_event"
        : "side_effect";
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type,
      mechanism: "unknown",
      criticality: /anaphyla|angioedema/i.test(reactionText) || reaction_type === "serious_adverse_event" ? "high" : "unknown",
      evidence: dedupEvidence([ev(last.e), ...(manifestation && prev ? [ev(prev.e)] : [])]),
    };
    if (manifestation) row.reaction = manifestation;
    const key = substance.toLowerCase();
    if (seenSubst.has(key)) {
      const prevRow = seenSubst.get(key)!;
      prevRow.evidence = dedupEvidence([...prevRow.evidence, ...row.evidence]);
      continue;
    }
    seenSubst.set(key, row);
    allergies.push(row);
  }
  return { problems, allergies };
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return out;
  const counting = countingItems(items, asOf.trim().slice(0, 10));
  const safe = <T>(f: () => T, d: T): T => {
    try {
      return f();
    } catch {
      return d;
    }
  };
  out.labs = safe(() => mapLabs(counting), []);
  out.vitals = safe(() => mapVitals(counting), []);
  out.medications = safe(() => mapMedications(counting), []);
  const pa = safe(() => mapProblemsAndAllergies(counting), { problems: [], allergies: [] });
  out.problems = pa.problems;
  out.allergies = pa.allergies;
  return out;
}
