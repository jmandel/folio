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

// ───────────────────────────── time helpers ─────────────────────────────

const TZ = "America/Chicago";
const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

let fmt: Intl.DateTimeFormat | null | undefined;
function chicagoFormatter(): Intl.DateTimeFormat | null {
  if (fmt !== undefined) return fmt;
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
  return fmt;
}

function pad(n: number, w = 2): string {
  return String(n).padStart(w, "0");
}

/** US DST (2007 rules) fallback when Intl time zones are unavailable. */
function chicagoOffsetHours(ms: number): number {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const nthSunday = (month: number, n: number): number => {
    const first = new Date(Date.UTC(y, month, 1)).getUTCDay();
    return 1 + ((7 - first) % 7) + 7 * (n - 1);
  };
  const start = Date.UTC(y, 2, nthSunday(2, 2), 8); // 02:00 CST = 08:00Z
  const end = Date.UTC(y, 10, nthSunday(10, 1), 7); // 02:00 CDT = 07:00Z
  return ms >= start && ms < end ? -5 : -6;
}

/** Local America/Chicago wall clock `YYYY-MM-DDTHH:MM` for a timestamp; naive timestamps are kept as written. */
function localDateTime(ts: unknown): string | undefined {
  if (typeof ts !== "string") return undefined;
  const s = ts.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s + "T00:00";
  if (!HAS_ZONE.test(s)) {
    const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/.exec(s);
    return m ? `${m[1]}T${m[2]}:${m[3]}` : undefined;
  }
  const ms = Date.parse(s);
  if (isNaN(ms)) return undefined;
  const f = chicagoFormatter();
  if (f) {
    try {
      const parts: Record<string, string> = {};
      for (const p of f.formatToParts(new Date(ms))) parts[p.type] = p.value;
      const hour = parts.hour === "24" ? "00" : parts.hour;
      return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}`;
    } catch {
      /* fall through */
    }
  }
  const d = new Date(ms + chicagoOffsetHours(ms) * 3600000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(
    d.getUTCMinutes(),
  )}`;
}

function localDate(ts: unknown): string | undefined {
  if (typeof ts !== "string") return undefined;
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(ts.trim())) return ts.trim();
  const l = localDateTime(ts);
  return l ? l.slice(0, 10) : undefined;
}

/** Sortable key for an instant (ms); naive timestamps are read as Chicago local. */
function instant(ts: unknown): number {
  if (typeof ts !== "string") return NaN;
  const s = ts.trim();
  if (HAS_ZONE.test(s)) return Date.parse(s);
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(s);
  if (!m) return NaN;
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
  return asUtc - chicagoOffsetHours(asUtc + 6 * 3600000) * 3600000;
}

// ───────────────────────────── generic helpers ─────────────────────────────

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() !== "" ? v : undefined);
const num = (v: unknown): number | undefined => (typeof v === "number" && isFinite(v) ? v : undefined);

interface Entry {
  item: FolioItem;
  key: string;
  row: any;
}

function entriesOf(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    const p = item.payload;
    if (!p || typeof p !== "object") continue;
    for (const key of Object.keys(p).sort()) {
      const row = p[key];
      if (row && typeof row === "object" && row.type === type) out.push({ item, key, row });
    }
  }
  return out;
}

function recordedMs(item: FolioItem): number {
  const t = instant(item.recorded);
  return isNaN(t) ? 0 : t;
}

/** Later-recorded wins; ties broken by item id for determinism. */
function laterItem(a: FolioItem, b: FolioItem): boolean {
  const ta = recordedMs(a);
  const tb = recordedMs(b);
  return ta !== tb ? ta > tb : String(a.id) > String(b.id);
}

function ev(...es: (Entry | undefined)[]): Evidence {
  const out: Evidence = [];
  const seen = new Set<string>();
  for (const e of es) {
    if (!e) continue;
    const k = e.item.id + "\u0000" + e.key;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: e.item.id, entry_id: e.key });
  }
  return out;
}

// ───────────────────────────── scope ─────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const valid = (Array.isArray(items) ? items : []).filter(
    (i) => i && typeof i === "object" && typeof i.id === "string" && i.payload && typeof i.payload === "object",
  );
  const inScope = valid.filter((i) => {
    const d = localDate(i.recorded);
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const i of inScope) {
    for (const list of [i.supersedes, i.retracts]) {
      if (!Array.isArray(list)) continue;
      for (const id of list) if (typeof id === "string") dead.add(i.issuer + "\u0000" + id);
    }
  }
  const seen = new Set<string>();
  const out: FolioItem[] = [];
  for (const i of inScope) {
    const k = i.issuer + "\u0000" + i.id;
    if (dead.has(k) || seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  return out;
}

// ───────────────────────────── labs ─────────────────────────────

const LAB_MAP: Record<string, { analyte: Analyte; unit: string; units: string[] }> = {
  "LK-CREAT": { analyte: "creatinine", unit: "mg/dL", units: ["mg/dL"] },
  "LK-EGFR09N": { analyte: "egfr", unit: "mL/min/1.73m2", units: ["mL/min/1.73m2"] },
  "LK-EGFR21": { analyte: "egfr", unit: "mL/min/1.73m2", units: ["mL/min/1.73m2"] },
  "LK-NA": { analyte: "sodium", unit: "mmol/L", units: ["mmol/L"] },
  "LK-K": { analyte: "potassium", unit: "mmol/L", units: ["mmol/L"] },
  "LK-GLU": { analyte: "glucose", unit: "mg/dL", units: ["mg/dL"] },
  "LK-A1C": { analyte: "a1c", unit: "%", units: ["%"] },
  "LK-UACR": { analyte: "uacr", unit: "mg/g", units: ["mg/g"] },
  "LK-WBC": { analyte: "wbc", unit: "10*3/uL", units: ["K/uL"] },
  "LK-HGB": { analyte: "hemoglobin", unit: "g/dL", units: ["g/dL"] },
  "LK-PLT": { analyte: "platelets", unit: "10*3/uL", units: ["K/uL"] },
  "LK-CHOL": { analyte: "cholesterol", unit: "mg/dL", units: ["mg/dL"] },
  "LK-TRIG": { analyte: "triglycerides", unit: "mg/dL", units: ["mg/dL"] },
  "LK-HDL": { analyte: "hdl", unit: "mg/dL", units: ["mg/dL"] },
  "LK-LDLC": { analyte: "ldl", unit: "mg/dL", units: ["mg/dL"] },
  // LK-EGFR09A (race coefficient applied) is deliberately not mapped.
};

function parseValue(text: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  if (typeof text !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>)?\s*([+-]?(?:\d+\.?\d*|\.\d+))\s*$/.exec(text);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!isFinite(value)) return undefined;
  return m[1] ? { value, comparator: m[1] as "<" | ">" | "<=" | ">=" } : { value };
}

function egfrEquation(code: string, comment: unknown): LabResultRow["egfr_equation"] {
  const c = typeof comment === "string" ? comment.toUpperCase() : "";
  if (/CKD-?EPI[^0-9]*2021/.test(c)) return "ckd-epi-2021";
  if (/CKD-?EPI[^0-9]*2009/.test(c)) return "ckd-epi-2009";
  if (/MDRD/.test(c)) return "mdrd";
  if (/CKD-?EPI/.test(c)) return code === "LK-EGFR21" ? "ckd-epi-2021" : "ckd-epi-2009";
  if (code === "LK-EGFR21") return "ckd-epi-2021";
  if (code === "LK-EGFR09N") return "ckd-epi-2009";
  return "unknown";
}

const STATUS_RANK: Record<string, number> = { P: 1, F: 2, A: 3 };

function mapLabs(items: FolioItem[]): LabResultRow[] {
  // Per item: requisition, orders, results.
  type Copy = { e: Entry; collected?: string; orderVoid: boolean };
  const copies = new Map<string, Copy[]>();
  const resultIndex = new Map<string, Copy>(); // item+RESULT_ID -> copy (for derived lookups)

  for (const item of items) {
    const reqs = entriesOf([item], "LAB_REQ");
    const orders = new Map<string, any>();
    for (const o of entriesOf([item], "LAB_ORDER")) if (str(o.row.ORDER_ID)) orders.set(o.row.ORDER_ID, o.row);
    const reqById = new Map<string, any>();
    for (const r of reqs) if (str(r.row.REQ_ID)) reqById.set(r.row.REQ_ID, r.row);
    for (const e of entriesOf([item], "LAB_RESULT")) {
      const id = str(e.row.RESULT_ID);
      if (!id) continue;
      const order = orders.get(e.row.ORDER_ID);
      const req = (order && reqById.get(order.REQ_ID)) ?? (reqs.length === 1 ? reqs[0].row : undefined);
      const orderVoid = !order || order.ORDER_STATUS === 9 || order.ORDER_STATUS === 5;
      const collected = str(req?.COLLECTED_AT) ?? str(item.effective);
      const c: Copy = { e, collected, orderVoid };
      const list = copies.get(id) ?? [];
      list.push(c);
      copies.set(id, list);
      resultIndex.set(item.id + "\u0000" + id, c);
    }
  }

  const usable = (c: Copy | undefined): boolean =>
    !!c && !c.orderVoid && STATUS_RANK[c.e.row.RESULT_STATUS] !== undefined;

  const rows: LabResultRow[] = [];
  for (const id of [...copies.keys()].sort()) {
    const list = copies.get(id)!;
    // Latest-recorded copy gives the current state; a preliminary copy never overrides a final one.
    let latest = list[0];
    for (const c of list) if (laterItem(c.e.item, latest.e.item)) latest = c;
    let chosen: Copy | undefined;
    if (!usable(latest)) {
      chosen = undefined; // withdrawn ('C'), not performed ('X'), or order voided in the latest copy
    } else {
      chosen = latest;
      for (const c of list) {
        if (!usable(c)) continue;
        const rc = STATUS_RANK[c.e.row.RESULT_STATUS];
        const rb = STATUS_RANK[chosen.e.row.RESULT_STATUS];
        if (rc > rb || (rc === rb && laterItem(c.e.item, chosen.e.item))) chosen = c;
      }
    }
    if (!chosen) continue;
    const r = chosen.e.row;
    const code = String(r.TEST_CODE ?? "");
    const map = LAB_MAP[code];
    if (!map) continue;
    // A calculated value from a withdrawn source value does not stand either.
    const src = str(r.DERIVED_FROM_RESULT_ID);
    if (src) {
      const s = resultIndex.get(chosen.e.item.id + "\u0000" + src);
      if (s && !usable(s)) continue;
    }
    const v = parseValue(r.VALUE_TEXT);
    if (!v) continue;
    if (r.UNIT_CODE != null && !map.units.includes(r.UNIT_CODE)) continue;
    if (!chosen.collected) continue;
    const row: LabResultRow = {
      analyte: map.analyte,
      value: v.value,
      unit: map.unit,
      collected: chosen.collected,
      status: r.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: ev(chosen.e),
    };
    if (v.comparator) row.comparator = v.comparator;
    if (map.analyte === "egfr") row.egfr_equation = egfrEquation(code, r.COMMENT_TEXT);
    const loinc = str(r.LOINC);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  rows.sort((a, b) => instant(a.collected) - instant(b.collected) || a.analyte.localeCompare(b.analyte));
  return rows;
}

// ───────────────────────────── visits ─────────────────────────────

interface Visit {
  e: Entry;
  at: number;
}

function visitsById(items: FolioItem[]): Map<string, Visit> {
  const m = new Map<string, Visit>();
  for (const e of entriesOf(items, "CLINIC_VISIT")) {
    const id = str(e.row.VISIT_ID);
    if (!id) continue;
    const prev = m.get(id);
    if (prev && !laterItem(e.item, prev.e.item)) continue;
    let at = instant(e.row.VISIT_AT);
    if (isNaN(at)) at = instant(e.item.effective);
    if (isNaN(at)) at = recordedMs(e.item);
    m.set(id, { e, at });
  }
  return m;
}

function visitTime(visits: Map<string, Visit>, e: Entry): number {
  const v = visits.get(e.row.VISIT_ID);
  if (v) return v.at;
  const t = instant(e.item.effective);
  return isNaN(t) ? recordedMs(e.item) : t;
}

/** Keep one copy per id (latest recorded item). */
function dedupe(entries: Entry[], idOf: (e: Entry) => string | undefined): Entry[] {
  const m = new Map<string, Entry>();
  for (const e of entries) {
    const id = idOf(e);
    if (!id) continue;
    const prev = m.get(id);
    if (!prev || laterItem(e.item, prev.item)) m.set(id, e);
  }
  return [...m.values()];
}

// ───────────────────────────── vitals ─────────────────────────────

function mapVitals(items: FolioItem[], visits: Map<string, Visit>): VitalRow[] {
  const all = dedupe(entriesOf(items, "VITAL"), (e) =>
    str(e.row.VISIT_ID) && str(e.row.VITAL_CODE)
      ? `${e.row.VISIT_ID}|${e.row.VITAL_CODE}|${e.row.READING_NO ?? 1}|${e.row.TAKEN_AT ?? ""}`
      : undefined,
  );
  // Use only the copy from the visit's current item, so a restated contact doesn't mix with an old one.
  const byVisit = new Map<string, Entry[]>();
  for (const e of all) {
    const v = visits.get(e.row.VISIT_ID);
    if (v && v.e.item.id !== e.item.id) continue;
    if (num(e.row.VALUE_NUM) === undefined) continue;
    const list = byVisit.get(e.row.VISIT_ID) ?? [];
    list.push(e);
    byVisit.set(e.row.VISIT_ID, list);
  }

  const rows: VitalRow[] = [];
  for (const [, list] of byVisit) {
    const byCode = (code: string): Entry[] =>
      list
        .filter((e) => e.row.VITAL_CODE === code)
        .sort(
          (a, b) =>
            (num(a.row.READING_NO) ?? 1) - (num(b.row.READING_NO) ?? 1) || instant(a.row.TAKEN_AT) - instant(b.row.TAKEN_AT),
        );
    const sys = byCode("BPS");
    const dia = byCode("BPD");
    const hr = byCode("HR");
    const wt = byCode("WT");

    // Pair BP readings by READING_NO.
    const readingNos = [...new Set([...sys, ...dia].map((e) => num(e.row.READING_NO) ?? 1))].sort((a, b) => a - b);
    const bp = readingNos.map((n) => ({
      s: sys.find((e) => (num(e.row.READING_NO) ?? 1) === n),
      d: dia.find((e) => (num(e.row.READING_NO) ?? 1) === n),
    }));

    let firstTime: string | undefined;
    if (bp.length) {
      const b = bp[0];
      const t = [b.s, b.d].filter((x): x is Entry => !!x).sort((x, y) => instant(x.row.TAKEN_AT) - instant(y.row.TAKEN_AT))[0];
      firstTime = t?.row.TAKEN_AT;
    }
    if (!firstTime) {
      const sorted = [...list].sort((a, b) => instant(a.row.TAKEN_AT) - instant(b.row.TAKEN_AT));
      firstTime = sorted[0]?.row.TAKEN_AT;
    }
    const lt = localDateTime(firstTime) ?? localDateTime(list[0].item.effective);
    if (!lt) continue;

    const row: VitalRow = { setting: "clinic", local_time: lt, evidence: [] };
    const used: Entry[] = [];
    if (bp[0]) {
      if (bp[0].s) (row.systolic_mmhg = bp[0].s.row.VALUE_NUM), used.push(bp[0].s);
      if (bp[0].d) (row.diastolic_mmhg = bp[0].d.row.VALUE_NUM), used.push(bp[0].d);
    }
    if (bp.length > 1) {
      const r = bp[bp.length - 1];
      if (r.s) (row.repeat_systolic_mmhg = r.s.row.VALUE_NUM), used.push(r.s);
      if (r.d) (row.repeat_diastolic_mmhg = r.d.row.VALUE_NUM), used.push(r.d);
    }
    if (hr[0]) (row.pulse_bpm = hr[0].row.VALUE_NUM), used.push(hr[0]);
    if (wt[0]) {
      const u = String(wt[0].row.UNIT_CODE ?? "kg").toLowerCase();
      let kg: number | undefined = wt[0].row.VALUE_NUM;
      if (u === "lb" || u === "lbs" || u === "[lb_av]") kg = wt[0].row.VALUE_NUM * 0.45359237;
      else if (u === "g") kg = wt[0].row.VALUE_NUM / 1000;
      else if (u !== "kg") kg = undefined;
      if (kg !== undefined) (row.weight_kg = Math.round(kg * 10) / 10), used.push(wt[0]);
    }
    if (!used.length) continue;
    const v = visits.get(list[0].row.VISIT_ID);
    row.evidence = ev(v?.e.item.id === list[0].item.id ? v.e : undefined, ...used);
    rows.push(row);
  }
  rows.sort((a, b) => a.local_time.localeCompare(b.local_time));
  return rows;
}

// ───────────────────────────── medications ─────────────────────────────

const SALTS = new Set([
  "potassium", "sodium", "calcium", "magnesium", "hydrochloride", "hcl", "besylate", "maleate", "succinate",
  "tartrate", "mesylate", "fumarate", "citrate", "acetate", "sulfate", "phosphate", "bromide", "chloride",
  "hydrobromide", "monohydrate", "dihydrate", "er", "xr", "sr", "dr", "xl", "la", "cr",
]);
const FORMS = new Set([
  "tablet", "tablets", "tab", "capsule", "capsules", "cap", "solution", "injection", "pen", "suspension",
  "oral", "film", "coated", "extended", "release", "delayed", "chewable", "patch", "cream", "vial",
  "prefilled", "syringe", "inhaler", "powder",
]);
const BRANDS: Record<string, string> = {
  kerendia: "finerenone", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  steglatro: "ertugliflozin", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide", glucophage: "metformin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", levemir: "insulin detemir",
  tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart", cozaar: "losartan",
  diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan", zestril: "lisinopril",
  prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", norvasc: "amlodipine", lasix: "furosemide",
  aldactone: "spironolactone", inspra: "eplerenone", lipitor: "atorvastatin", crestor: "rosuvastatin",
  zocor: "simvastatin", lokelma: "sodium zirconium cyclosilicate", veltassa: "patiromer", renvela: "sevelamer",
  januvia: "sitagliptin", tradjenta: "linagliptin",
};

function ingredientOf(drugName: string): string | undefined {
  const words = drugName.toLowerCase().replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  const kept: string[] = [];
  for (const w of words) {
    if (/^\d/.test(w) || /^[\d.]+(mg|mcg|g|ml|unit|units|%)/.test(w)) break;
    if (FORMS.has(w)) break;
    kept.push(w);
  }
  if (!kept.length) return undefined;
  const joined = kept.join(" ");
  if (BRANDS[joined]) return BRANDS[joined];
  if (BRANDS[kept[0]]) return BRANDS[kept[0]];
  if (joined === "sodium zirconium cyclosilicate" || joined === "sodium bicarbonate" || joined === "potassium chloride" || joined === "calcium acetate" || joined === "calcium carbonate")
    return joined;
  const core = kept.filter((w, i) => i === 0 || !SALTS.has(w));
  return core.join(" ") || undefined;
}

const MED_STATUS: Record<number, MedicationRow["status"]> = { 1: "active", 2: "stopped", 3: "held" };
const FREQS = new Set(["QD", "BID", "TID", "QHS", "QW", "PRN"]);
const DOSE_UNITS: Record<string, NonNullable<MedicationRow["dose"]>["unit"]> = {
  mg: "mg", mcg: "mcg", unit: "units", units: "units", ml: "mL",
};

function mapMedications(items: FolioItem[], visits: Map<string, Visit>): MedicationRow[] {
  const orders = dedupe(entriesOf(items, "MED_ORDER"), (e) => str(e.row.RX_ID));
  const hists = dedupe(entriesOf(items, "MED_STATUS_HIST"), (e) => str(e.row.HIST_ID));
  const histByRx = new Map<string, Entry[]>();
  for (const h of hists) {
    const rx = str(h.row.RX_ID);
    if (!rx) continue;
    const l = histByRx.get(rx) ?? [];
    l.push(h);
    histByRx.set(rx, l);
  }
  const histTime = (h: Entry): number => {
    const t = instant(h.row.CHANGED_AT);
    return isNaN(t) ? visitTime(visits, h) : t;
  };

  type Cand = { row: MedicationRow; key: string; latest: number };
  const cands: Cand[] = [];
  for (const o of orders) {
    const r = o.row;
    if (r.MED_STATUS === 9) continue;
    if (r.ROUTE === "IV") continue; // hospital/infusion, not a home medication
    const hl = (histByRx.get(r.RX_ID) ?? []).sort(
      (a, b) => histTime(a) - histTime(b) || String(a.row.HIST_ID).localeCompare(String(b.row.HIST_ID)),
    );
    const last = hl[hl.length - 1];
    if (hl.some((h) => h.row.NEW_STATUS === 9)) continue; // entered in error: never existed
    if (last && last.row.REASON_CODE === "ERR") continue;
    const code = last ? last.row.NEW_STATUS : r.MED_STATUS;
    const status = MED_STATUS[code];
    if (!status) continue;
    const drugName = str(r.DRUG_NAME) ?? str(r.LV_DRUG_ID);
    if (!drugName) continue;

    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: ev(o, last) };
    const ing = str(r.DRUG_NAME) ? ingredientOf(r.DRUG_NAME) : undefined;
    if (ing) row.ingredient = ing;

    if (last) {
      const d = localDate(last.row.CHANGED_AT) ?? localDate(last.item.effective);
      if (d) row.status_since = d;
    } else if (status === "active") {
      const d = str(r.START_DATE) ? localDate(r.START_DATE) : undefined;
      if (d) row.status_since = d;
    }

    const q = num(r.DOSE_QTY);
    const u = DOSE_UNITS[String(r.DOSE_UNIT ?? "").toLowerCase()];
    if (q !== undefined && u) row.dose = { value: q, unit: u };
    if (str(r.FREQ_CODE)) row.frequency = FREQS.has(r.FREQ_CODE) ? r.FREQ_CODE : "other";

    if (last && status !== "active") {
      const txt = str(last.row.COMMENT_TEXT);
      if (txt) row.status_reason_text = txt;
      if (status === "stopped") {
        const rc = last.row.REASON_CODE;
        if (rc === "ADR") row.stop_reason = "adverse_reaction";
        else if (rc === "PT") row.stop_reason = "patient_choice";
        else if (rc === "LAB" || rc === "PROC" || rc === "OTH") row.stop_reason = "other";
      }
    }

    const latest = Math.max(visitTime(visits, o), last ? histTime(last) : -Infinity);
    const key = ing ?? "lvd:" + (str(r.LV_DRUG_ID) ?? drugName.toLowerCase());
    cands.push({ row, key, latest });
  }

  const best = new Map<string, Cand>();
  for (const c of cands) {
    const p = best.get(c.key);
    if (!p || c.latest > p.latest) best.set(c.key, c);
  }
  return [...best.values()].map((c) => c.row).sort((a, b) => a.drug_name.localeCompare(b.drug_name));
}

// ───────────────────────────── problems & drug-caused diagnoses ─────────────────────────────

const CKD_FROM_ICD: Record<string, ProblemRow["ckd_stage"]> = {
  "N18.1": "G1", "N18.2": "G2", "N18.30": undefined, "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4",
  "N18.5": "G5", "N18.6": "G5",
};
const G_CATS = new Set(["G1", "G2", "G3a", "G3b", "G4", "G5"]);
const A_CATS = new Set(["A1", "A2", "A3"]);

/** Conditions that are commonly re-coded within one ICD category; grouped as one condition. */
const GROUP_BY_CATEGORY = new Set(["N18", "E10", "E11", "I12", "I13"]);

function conditionKey(icd: string): string {
  const cat = icd.toUpperCase().slice(0, 3);
  return GROUP_BY_CATEGORY.has(cat) ? "cat:" + cat : "code:" + icd.toUpperCase();
}

/** ICD-10-CM T36–T50 with 5th/6th character 5 = adverse effect of a drug. */
function isAdverseEffectTCode(icd: string): boolean {
  const m = /^T(\d{2})\.(\w{2,4})/i.exec(icd);
  if (!m) return false;
  const n = +m[1];
  if (n < 36 || n > 50) return false;
  const rest = m[2].toUpperCase();
  return rest.length >= 3 ? rest[2] === "5" : rest[1] === "5";
}

const CLASS_PATTERNS: { re: RegExp; label: string; members: RegExp }[] = [
  { re: /sglt-?2/i, label: "SGLT2 inhibitor", members: /gliflozin$/ },
  { re: /angiotensin[- ]converting[- ]enzyme|ace[- ]inhibitor/i, label: "ACE inhibitor", members: /pril$/ },
  { re: /angiotensin[- ](ii )?receptor|\barb\b/i, label: "angiotensin II receptor blocker", members: /sartan$/ },
  { re: /mineralocorticoid|aldosterone antagonist/i, label: "mineralocorticoid receptor antagonist", members: /^(finerenone|spironolactone|eplerenone)$/ },
  { re: /statin|hmg-?coa/i, label: "statin", members: /statin$/ },
  { re: /glp-?1/i, label: "GLP-1 receptor agonist", members: /(glutide|tide)$/ },
  { re: /biguanide/i, label: "biguanide", members: /^metformin$/ },
  { re: /insulin/i, label: "insulin", members: /^insulin\b/ },
  { re: /loop diuretic/i, label: "loop diuretic", members: /^(furosemide|bumetanide|torsemide)$/ },
];

const KNOWN_DRUGS = [
  "finerenone", "spironolactone", "eplerenone", "empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin",
  "metformin", "lisinopril", "enalapril", "ramipril", "benazepril", "losartan", "valsartan", "irbesartan",
  "olmesartan", "telmisartan", "atorvastatin", "rosuvastatin", "simvastatin", "semaglutide", "liraglutide",
  "dulaglutide", "tirzepatide", "furosemide", "hydrochlorothiazide", "chlorthalidone", "amlodipine", "allopurinol",
];

function drugCausedSubstance(text: string, sameItemIngredients: string[]): string | undefined {
  const t = text.toLowerCase();
  for (const d of KNOWN_DRUGS) if (t.includes(d)) return d;
  for (const [brand, gen] of Object.entries(BRANDS)) if (new RegExp(`\\b${brand}\\b`).test(t)) return gen;
  for (const c of CLASS_PATTERNS) {
    if (!c.re.test(text)) continue;
    const members = [...new Set(sameItemIngredients.filter((i) => c.members.test(i)))];
    return members.length === 1 ? members[0] : c.label;
  }
  return undefined;
}

function reactionType(text: string): { type: AllergyIntoleranceRow["reaction_type"]; mech: AllergyIntoleranceRow["mechanism"]; crit: AllergyIntoleranceRow["criticality"] } {
  const t = text.toLowerCase();
  const ace = /angiotensin[- ]converting|ace[- ]inhibitor|pril\b/.test(t);
  if (/angioedema|angioneurotic/.test(t)) return { type: "hypersensitivity", mech: ace ? "non_immune" : "unknown", crit: "high" };
  if (/anaphyla/.test(t)) return { type: "hypersensitivity", mech: "unknown", crit: "high" };
  if (/urticaria|hives|rash|bronchospasm|dermatitis|stevens/.test(t)) return { type: "hypersensitivity", mech: "unknown", crit: "unknown" };
  if (/ketoacidosis/.test(t)) return { type: "serious_adverse_event", mech: "non_immune", crit: "high" };
  if (/lactic acidosis|hyperkalemia|kidney injury|renal failure|pancreatitis|rhabdomyolysis|hypoglycemi/.test(t))
    return { type: "serious_adverse_event", mech: "unknown", crit: "high" };
  if (/cough/.test(t)) return { type: "side_effect", mech: ace ? "non_immune" : "unknown", crit: "low" };
  return { type: "side_effect", mech: "unknown", crit: "unknown" };
}

function mapProblems(
  items: FolioItem[],
  visits: Map<string, Visit>,
): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const dxs = entriesOf(items, "VISIT_DX").filter((e) => str(e.row.ICD10CM));
  // Only use dx rows from the visit's current item.
  const live = dxs.filter((e) => {
    const v = visits.get(e.row.VISIT_ID);
    return !v || v.e.item.id === e.item.id;
  });
  const order = (a: Entry, b: Entry): number =>
    visitTime(visits, a) - visitTime(visits, b) ||
    recordedMs(a.item) - recordedMs(b.item) ||
    (num(b.row.DX_RANK) ?? 99) - (num(a.row.DX_RANK) ?? 99);
  live.sort(order);

  const allergies = new Map<string, { row: AllergyIntoleranceRow; t: number }>();
  const groups = new Map<string, Entry[]>();
  for (const e of live) {
    const icd = String(e.row.ICD10CM).trim();
    const text = str(e.row.DX_TEXT) ?? "";
    const tcode = isAdverseEffectTCode(icd);
    const drugText = tcode || /(-|\s)(associated|induced)\b|\bdue to\b|\badverse effect\b/i.test(text);
    if (drugText && (e.row.DX_STATUS === "A" || e.row.DX_STATUS === "H")) {
      const ingr = entriesOf([e.item], "MED_ORDER")
        .filter((m) => m.row.MED_STATUS !== 9 && str(m.row.DRUG_NAME))
        .map((m) => ingredientOf(m.row.DRUG_NAME))
        .filter((x): x is string => !!x);
      let sub = drugCausedSubstance(text, ingr);
      if (!sub && tcode) {
        const m = /adverse effect of (.+?)(,\s*(initial|subsequent|sequela).*)?$/i.exec(text);
        if (m) sub = m[1].trim();
      }
      if (sub) {
        const rt = reactionType(text);
        const a: AllergyIntoleranceRow = {
          substance: sub,
          reaction_type: rt.type,
          mechanism: rt.mech,
          criticality: rt.crit,
          evidence: ev(e),
        };
        if (!tcode && text) a.reaction = text;
        const t = visitTime(visits, e);
        const prev = allergies.get(sub.toLowerCase());
        if (!prev || t >= prev.t) allergies.set(sub.toLowerCase(), { row: a, t });
      }
    }
    if (tcode) continue; // a T-code names only the adverse effect, not a condition
    const k = conditionKey(icd);
    const l = groups.get(k) ?? [];
    l.push(e);
    groups.set(k, l);
  }

  // Latest clinician-assessed KDIGO categories.
  let ckdG: { v: ProblemRow["ckd_stage"]; t: number; e?: Entry } | undefined;
  let ckdA: { v: ProblemRow["albuminuria"]; t: number; e?: Entry } | undefined;
  for (const [, v] of visits) {
    if (G_CATS.has(v.e.row.CKD_G) && (!ckdG || v.at >= ckdG.t)) ckdG = { v: v.e.row.CKD_G, t: v.at, e: v.e };
    if (A_CATS.has(v.e.row.CKD_A) && (!ckdA || v.at >= ckdA.t)) ckdA = { v: v.e.row.CKD_A, t: v.at, e: v.e };
  }

  const problems: ProblemRow[] = [];
  for (const [k, list] of groups) {
    const latest = list[list.length - 1];
    const st = latest.row.DX_STATUS;
    let status: ProblemRow["status"] | undefined;
    if (st === "A") status = "active";
    else if (st === "H") status = "resolved";
    else if (st === "P") {
      // Working diagnosis now; report only if the source confirmed it earlier.
      const prior = [...list].reverse().find((e) => e.row.DX_STATUS === "A" || e.row.DX_STATUS === "H");
      if (prior) status = prior.row.DX_STATUS === "H" ? "resolved" : "active";
    }
    if (!status) continue; // ruled out, or never confirmed
    const icd = String(latest.row.ICD10CM).trim();
    const row: ProblemRow = {
      condition: str(latest.row.DX_TEXT) ?? icd,
      icd10cm: icd,
      status,
      evidence: ev(latest),
    };
    if (k === "cat:N18") {
      // Most recent of: the visit's CKD_G field, or the stage implied by the N18 code.
      const codeT = visitTime(visits, latest);
      const codeStage = CKD_FROM_ICD[icd.toUpperCase()];
      if (ckdG && (ckdG.t >= codeT || !codeStage)) {
        row.ckd_stage = ckdG.v;
        if (ckdG.e) row.evidence.push(...ev(ckdG.e).filter((x) => !row.evidence.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id)));
      } else if (codeStage) row.ckd_stage = codeStage;
      if (ckdA) {
        row.albuminuria = ckdA.v;
        if (ckdA.e) row.evidence.push(...ev(ckdA.e).filter((x) => !row.evidence.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id)));
      }
    }
    problems.push(row);
  }
  problems.sort((a, b) => (a.icd10cm ?? "").localeCompare(b.icd10cm ?? ""));
  const allergyRows = [...allergies.values()].map((x) => x.row).sort((a, b) => a.substance.localeCompare(b.substance));
  return { problems, allergies: allergyRows };
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const day = typeof asOf === "string" && /^\d{4}-\d{2}-\d{2}/.test(asOf) ? asOf.slice(0, 10) : "9999-12-31";
    const cur = currentItems(items, day);
    const visits = visitsById(cur);
    const safe = <T>(f: () => T[]): T[] => {
      try {
        return f();
      } catch {
        return [];
      }
    };
    let pa: { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } = { problems: [], allergies: [] };
    try {
      pa = mapProblems(cur, visits);
    } catch {
      /* skip */
    }
    return {
      medications: safe(() => mapMedications(cur, visits)),
      problems: pa.problems,
      allergies: pa.allergies,
      labs: safe(() => mapLabs(cur)),
      vitals: safe(() => mapVitals(cur, visits)),
    };
  } catch {
    return empty;
  }
}
