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

// ─────────────────────────────────────────────────────────────────────────────
// Time helpers (America/Chicago, computed from US DST rules; no Intl dependency)
// ─────────────────────────────────────────────────────────────────────────────

function nthSundayUtc(year: number, month: number, n: number): number {
  // month 0-based; returns day-of-month of the nth Sunday (n = -1: last Sunday)
  if (n > 0) {
    const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
    return 1 + ((7 - first) % 7) + (n - 1) * 7;
  }
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  return lastDay.getUTCDate() - lastDay.getUTCDay();
}

function chicagoOffsetHours(ms: number): number {
  const year = new Date(ms).getUTCFullYear();
  let start: number;
  let end: number;
  if (year >= 2007) {
    start = Date.UTC(year, 2, nthSundayUtc(year, 2, 2), 8); // 2:00 CST = 08:00 UTC
    end = Date.UTC(year, 10, nthSundayUtc(year, 10, 1), 7); // 2:00 CDT = 07:00 UTC
  } else {
    start = Date.UTC(year, 3, nthSundayUtc(year, 3, 1), 8);
    end = Date.UTC(year, 9, nthSundayUtc(year, 9, -1), 7);
  }
  return ms >= start && ms < end ? -5 : -6;
}

function pad(n: number, w = 2): string {
  return String(n).padStart(w, "0");
}

/** Local Chicago wall-clock "YYYY-MM-DDTHH:MM" for an RFC 3339 instant; undefined if unparseable. */
function chicagoLocal(ts: unknown): string | undefined {
  if (typeof ts !== "string") return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(ts)) return ts + "T00:00";
  if (!/^\d{4}-\d{2}-\d{2}T/.test(ts)) return undefined;
  const ms = Date.parse(ts);
  if (!Number.isFinite(ms)) return undefined;
  const d = new Date(ms + chicagoOffsetHours(ms) * 3600000);
  return `${pad(d.getUTCFullYear(), 4)}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

function chicagoDate(ts: unknown): string | undefined {
  const l = chicagoLocal(ts);
  return l ? l.slice(0, 10) : undefined;
}

function instant(ts: unknown): number {
  if (typeof ts !== "string") return NaN;
  return Date.parse(ts);
}

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x : undefined;
}

function isLocalDate(x: unknown): x is string {
  return typeof x === "string" && /^\d{4}(-\d{2}(-\d{2})?)?$/.test(x);
}

// ─────────────────────────────────────────────────────────────────────────────
// Item scope and correction rules
// ─────────────────────────────────────────────────────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = (Array.isArray(items) ? items : []).filter((it) => {
    if (!isObj(it) || typeof it.id !== "string" || !isObj(it.payload)) return false;
    const d = chicagoDate(it.recorded);
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const key of ["supersedes", "retracts"] as const) {
      const list = (it as any)[key];
      if (Array.isArray(list)) for (const id of list) if (typeof id === "string") dead.add(it.issuer + "\u0000" + id);
    }
  }
  return inScope.filter((it) => !dead.has(it.issuer + "\u0000" + it.id));
}

interface Entry {
  item: FolioItem;
  entryId: string;
  row: Record<string, any>;
}

function entriesOfType(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    for (const [entryId, row] of Object.entries(item.payload)) {
      if (isObj(row) && row.type === type) out.push({ item, entryId, row });
    }
  }
  return out;
}

function recordedMs(item: FolioItem): number {
  const t = instant(item.recorded);
  return Number.isFinite(t) ? t : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Labs
// ─────────────────────────────────────────────────────────────────────────────

const LAB_TESTS: Record<string, { analyte: Analyte; lvUnit: string; unit: string }> = {
  "LK-CREAT": { analyte: "creatinine", lvUnit: "mg/dL", unit: "mg/dL" },
  "LK-EGFR09N": { analyte: "egfr", lvUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2" },
  "LK-EGFR21": { analyte: "egfr", lvUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2" },
  "LK-NA": { analyte: "sodium", lvUnit: "mmol/L", unit: "mmol/L" },
  "LK-K": { analyte: "potassium", lvUnit: "mmol/L", unit: "mmol/L" },
  "LK-GLU": { analyte: "glucose", lvUnit: "mg/dL", unit: "mg/dL" },
  "LK-A1C": { analyte: "a1c", lvUnit: "%", unit: "%" },
  "LK-UACR": { analyte: "uacr", lvUnit: "mg/g", unit: "mg/g" },
  "LK-WBC": { analyte: "wbc", lvUnit: "K/uL", unit: "10*3/uL" },
  "LK-HGB": { analyte: "hemoglobin", lvUnit: "g/dL", unit: "g/dL" },
  "LK-PLT": { analyte: "platelets", lvUnit: "K/uL", unit: "10*3/uL" },
  "LK-CHOL": { analyte: "cholesterol", lvUnit: "mg/dL", unit: "mg/dL" },
  "LK-TRIG": { analyte: "triglycerides", lvUnit: "mg/dL", unit: "mg/dL" },
  "LK-HDL": { analyte: "hdl", lvUnit: "mg/dL", unit: "mg/dL" },
  "LK-LDLC": { analyte: "ldl", lvUnit: "mg/dL", unit: "mg/dL" },
  // LK-EGFR09A (race-coefficient variant) is deliberately not reported.
};

function parseValue(text: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  if (typeof text !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>)?\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(text);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return undefined;
  return m[1] ? { value, comparator: m[1] as "<" | ">" | "<=" | ">=" } : { value };
}

function egfrEquation(code: string, comment: unknown): LabResultRow["egfr_equation"] {
  const c = typeof comment === "string" ? comment.toLowerCase() : "";
  if (/ckd[- ]?epi/.test(c) && /2021/.test(c)) return "ckd-epi-2021";
  if (/ckd[- ]?epi/.test(c) && /2009/.test(c)) return "ckd-epi-2009";
  if (/mdrd/.test(c)) return "mdrd";
  if (/ckd[- ]?epi/.test(c)) return "unknown";
  if (code === "LK-EGFR21") return "ckd-epi-2021";
  if (code === "LK-EGFR09N") return "ckd-epi-2009";
  return "unknown";
}

function mapLabs(items: FolioItem[]): LabResultRow[] {
  const labItems = items.filter((it) => Object.values(it.payload).some((r) => isObj(r) && r.type === "LAB_REQ"));
  // Orders and requisitions by id (ids are unique across the export); latest-recorded copy wins.
  const orders = new Map<string, Entry>();
  for (const e of entriesOfType(labItems, "LAB_ORDER")) {
    const id = str(e.row.ORDER_ID);
    if (!id) continue;
    const prev = orders.get(id);
    if (!prev || recordedMs(e.item) >= recordedMs(prev.item)) orders.set(id, e);
  }
  const reqs = new Map<string, Entry>();
  for (const e of entriesOfType(labItems, "LAB_REQ")) {
    const id = str(e.row.REQ_ID);
    if (!id) continue;
    const prev = reqs.get(id);
    if (!prev || recordedMs(e.item) >= recordedMs(prev.item)) reqs.set(id, e);
  }
  // Results: latest-recorded copy of each RESULT_ID decides.
  const results = new Map<string, Entry>();
  for (const e of entriesOfType(labItems, "LAB_RESULT")) {
    const id = str(e.row.RESULT_ID) ?? e.item.id + "/" + e.entryId;
    const prev = results.get(id);
    if (!prev || recordedMs(e.item) >= recordedMs(prev.item)) results.set(id, e);
  }

  const rows: LabResultRow[] = [];
  for (const e of results.values()) {
    const r = e.row;
    const code = str(r.TEST_CODE);
    if (!code) continue;
    const test = LAB_TESTS[code];
    if (!test) continue;
    const status = r.RESULT_STATUS;
    if (status !== "F" && status !== "A" && status !== "P") continue;
    const order = orders.get(str(r.ORDER_ID) ?? "");
    if (order) {
      const os = order.row.ORDER_STATUS;
      if (os === 9 || os === 5) continue;
    }
    if (r.UNIT_CODE !== test.lvUnit) continue;
    const parsed = parseValue(r.VALUE_TEXT);
    if (!parsed) continue;

    let collected: string | undefined;
    const reqId = order ? str(order.row.REQ_ID) : undefined;
    const req = reqId ? reqs.get(reqId) : undefined;
    collected = str(req?.row.COLLECTED_AT);
    if (!collected) {
      const sameItemReq = Object.values(e.item.payload).find((x) => isObj(x) && x.type === "LAB_REQ");
      collected = str(sameItemReq?.COLLECTED_AT) ?? str(e.item.effective);
    }
    if (!collected) continue;

    const row: LabResultRow = {
      analyte: test.analyte,
      value: parsed.value,
      unit: test.unit,
      collected,
      status: status === "P" ? "preliminary" : "final",
      evidence: [{ item_id: e.item.id, entry_id: e.entryId }],
    };
    if (parsed.comparator) row.comparator = parsed.comparator;
    if (test.analyte === "egfr") row.egfr_equation = egfrEquation(code, r.COMMENT_TEXT);
    const loinc = str(r.LOINC);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  rows.sort((a, b) => instant(a.collected) - instant(b.collected) || a.analyte.localeCompare(b.analyte));
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// Clinic contacts
// ─────────────────────────────────────────────────────────────────────────────

interface Visit {
  item: FolioItem;
  entryId: string;
  row: Record<string, any>;
  at: number;
}

function visitsById(items: FolioItem[]): Map<string, Visit> {
  const m = new Map<string, Visit>();
  for (const e of entriesOfType(items, "CLINIC_VISIT")) {
    const id = str(e.row.VISIT_ID);
    if (!id) continue;
    const at = instant(e.row.VISIT_AT);
    const v: Visit = { ...e, at: Number.isFinite(at) ? at : instant(e.item.effective) || 0 };
    const prev = m.get(id);
    if (!prev || recordedMs(e.item) >= recordedMs(prev.item)) m.set(id, v);
  }
  return m;
}

function visitOrder(a: { at: number; item: FolioItem }, b: { at: number; item: FolioItem }): number {
  return a.at - b.at || recordedMs(a.item) - recordedMs(b.item);
}

// ── Vitals ──

function mapVitals(items: FolioItem[]): VitalRow[] {
  const byVisit = new Map<string, Entry[]>();
  for (const e of entriesOfType(items, "VITAL")) {
    const key = e.item.id + "\u0000" + (str(e.row.VISIT_ID) ?? "");
    const list = byVisit.get(key) ?? [];
    list.push(e);
    byVisit.set(key, list);
  }
  const rows: VitalRow[] = [];
  for (const list of byVisit.values()) {
    const num = (e: Entry) => (typeof e.row.VALUE_NUM === "number" && Number.isFinite(e.row.VALUE_NUM) ? e.row.VALUE_NUM : undefined);
    const rn = (e: Entry) => (typeof e.row.READING_NO === "number" ? e.row.READING_NO : 1);
    const byTime = (a: Entry, b: Entry) => rn(a) - rn(b) || (instant(a.row.TAKEN_AT) || 0) - (instant(b.row.TAKEN_AT) || 0);
    const valid = list.filter((e) => num(e) !== undefined);
    const of = (code: string) => valid.filter((e) => e.row.VITAL_CODE === code).sort(byTime);
    const bps = of("BPS");
    const bpd = of("BPD");
    const hr = of("HR");
    const wt = of("WT");

    const row: Partial<VitalRow> = { setting: "clinic" };
    const used: Entry[] = [];
    const readings = Array.from(new Set([...bps, ...bpd].map(rn))).sort((a, b) => a - b);
    if (readings.length > 0) {
      const first = readings[0];
      const s = bps.find((e) => rn(e) === first);
      const d = bpd.find((e) => rn(e) === first);
      if (s) { row.systolic_mmhg = num(s); used.push(s); }
      if (d) { row.diastolic_mmhg = num(d); used.push(d); }
      if (readings.length > 1) {
        const second = readings[1];
        const s2 = bps.find((e) => rn(e) === second);
        const d2 = bpd.find((e) => rn(e) === second);
        if (s2) { row.repeat_systolic_mmhg = num(s2); used.push(s2); }
        if (d2) { row.repeat_diastolic_mmhg = num(d2); used.push(d2); }
      }
    }
    if (hr.length > 0) { row.pulse_bpm = num(hr[0]); used.push(hr[0]); }
    if (wt.length > 0) {
      let kg = num(wt[0])!;
      const unit = String(wt[0].row.UNIT_CODE ?? "kg").toLowerCase();
      if (unit === "lb" || unit === "lbs" || unit === "[lb_av]") kg = kg * 0.45359237;
      else if (unit === "g") kg = kg / 1000;
      else if (unit !== "kg") kg = NaN;
      if (Number.isFinite(kg)) { row.weight_kg = Math.round(kg * 10) / 10; used.push(wt[0]); }
    }
    if (used.length === 0) continue;

    // local_time: first BP reading's time, otherwise earliest measurement.
    const bpFirst = [...bps, ...bpd].filter((e) => used.includes(e) && rn(e) === readings[0]);
    const timeSource = (bpFirst.length > 0 ? bpFirst : used)
      .map((e) => e.row.TAKEN_AT)
      .filter((t) => Number.isFinite(instant(t)))
      .sort((a, b) => instant(a) - instant(b))[0];
    const visitRow = Object.values(used[0].item.payload).find((x) => isObj(x) && x.type === "CLINIC_VISIT");
    const lt = chicagoLocal(timeSource ?? visitRow?.VISIT_AT ?? used[0].item.effective);
    if (!lt) continue;
    row.local_time = lt;
    row.evidence = used.map((e) => ({ item_id: e.item.id, entry_id: e.entryId }));
    rows.push(row as VitalRow);
  }
  rows.sort((a, b) => a.local_time.localeCompare(b.local_time));
  return rows;
}

// ── Problems and drug adverse-effect diagnoses ──

const CKD_FROM_ICD: Record<string, ProblemRow["ckd_stage"]> = {
  "N18.1": "G1",
  "N18.2": "G2",
  "N18.31": "G3a",
  "N18.32": "G3b",
  "N18.4": "G4",
  "N18.5": "G5",
  "N18.6": "G5",
};
const G_CATS = new Set(["G1", "G2", "G3a", "G3b", "G4", "G5"]);
const A_CATS = new Set(["A1", "A2", "A3"]);

/** ICD-10-CM adverse effect of a drug: T36–T50 with 5 as the 6th character (e.g. T46.4X5A). */
function isDrugAdverseEffect(icd: string): boolean {
  const m = /^T(\d\d)\.(\w)(\w)(\w)/i.exec(icd);
  if (!m) return false;
  const cat = Number(m[1]);
  return cat >= 36 && cat <= 50 && m[4] === "5";
}

interface DxEntry extends Entry {
  visit: Visit;
  icd: string;
}

/** Text of the narrative's `<ref id="entryId">…</ref>` span, tags stripped; undefined if none. */
function refSpan(item: FolioItem, entryId: string): string | undefined {
  const narrative = (item as any).narrative;
  if (typeof narrative !== "string") return undefined;
  const esc = entryId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(`<ref\\s+id="${esc}"\\s*>([\\s\\S]*?)</ref>`).exec(narrative);
  if (!m) return undefined;
  const t = m[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return t || undefined;
}

/**
 * Generic "history of other …" Z-codes (e.g. Z86.39 "Personal history of other endocrine, nutritional and
 * metabolic disease") do not say which condition the patient had; the nephrologist's note names it in the
 * entry's ref span. Use that wording (minus "prior"/"history" framing) for such entries, latest note first.
 */
function specificWording(icd: string, text: string, list: DxEntry[]): string | undefined {
  if (!icd.startsWith("Z") || !/\b(other|unspecified)\b/i.test(text)) return undefined;
  for (let i = list.length - 1; i >= 0; i--) {
    const d = list[i];
    if (d.icd !== icd) continue;
    let t = refSpan(d.item, d.entryId);
    if (!t || t.length > 80 || /\d{2,}\/\d{2,}/.test(t)) continue;
    t = t
      .replace(/^(?:(?:an?|the|his|her|their)\s+)?(?:(?:earlier|prior|previous|past|remote|old|known)\s+)+/i, "")
      .replace(/^(?:personal\s+)?(?:history\s+of|hx\s+of|h\/o)\s+/i, "")
      .replace(/\s+(?:history|hx)$/i, "")
      .replace(/[.;,:]+$/, "")
      .trim();
    if (t.length < 3) continue;
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  return undefined;
}

function mapProblemsAndAllergies(items: FolioItem[], visits: Map<string, Visit>): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const dx: DxEntry[] = [];
  for (const e of entriesOfType(items, "VISIT_DX")) {
    const icd = str(e.row.ICD10CM)?.trim().toUpperCase();
    if (!icd) continue;
    let visit = visits.get(str(e.row.VISIT_ID) ?? "");
    if (!visit || visit.item !== e.item) {
      const vEntry = Object.entries(e.item.payload).find(([, x]) => isObj(x) && x.type === "CLINIC_VISIT");
      const at = instant(vEntry?.[1]?.VISIT_AT);
      visit = {
        item: e.item,
        entryId: vEntry?.[0] ?? "",
        row: vEntry?.[1] ?? {},
        at: Number.isFinite(at) ? at : instant(e.item.effective) || 0,
      };
    }
    dx.push({ ...e, visit, icd });
  }

  // Group codes into conditions. The clinic's problem list is the latest row per code; the exception is
  // restaging, where the code itself carries the stage: CKD (N18.x) is always one condition, and
  // hypertensive CKD (I12.x / I13.x) codes that never appear together at one contact are one condition.
  // Other same-category codes (e.g. E11.22 vs E11.10, diabetes with ketoacidosis) are distinct conditions.
  const RESTAGED = new Set(["N18", "I12", "I13"]);
  const codes = Array.from(new Set(dx.map((d) => d.icd))).sort();
  const visitsOfCode = new Map<string, Set<string>>();
  for (const d of dx) {
    const key = d.visit.item.id;
    const s = visitsOfCode.get(d.icd) ?? new Set<string>();
    s.add(key);
    visitsOfCode.set(d.icd, s);
  }
  const group = new Map<string, string>();
  for (const c of codes) {
    const cat = c.slice(0, 3);
    let g = c;
    if (RESTAGED.has(cat)) {
      for (const other of codes) {
        if (other === c) break;
        if (other.slice(0, 3) !== cat) continue;
        const otherGroup = group.get(other)!;
        const members = codes.filter((x) => group.get(x) === otherGroup);
        const clash = cat !== "N18" && members.some((m) => [...visitsOfCode.get(m)!].some((v) => visitsOfCode.get(c)!.has(v)));
        if (!clash) { g = otherGroup; break; }
      }
    }
    group.set(c, g);
  }

  const byGroup = new Map<string, DxEntry[]>();
  for (const d of dx) {
    const g = group.get(d.icd)!;
    const list = byGroup.get(g) ?? [];
    list.push(d);
    byGroup.set(g, list);
  }

  // CKD categories over time: CKD_G / CKD_A fields on the contact, else the N18 code's stage.
  const allVisits = Array.from(visits.values()).sort(visitOrder);
  let latestG: { at: Visit; g: ProblemRow["ckd_stage"] } | undefined;
  let latestA: { at: Visit; a: ProblemRow["albuminuria"] } | undefined;
  for (const v of allVisits) {
    if (G_CATS.has(v.row.CKD_G)) latestG = { at: v, g: v.row.CKD_G };
    if (A_CATS.has(v.row.CKD_A)) latestA = { at: v, a: v.row.CKD_A };
  }
  for (const d of dx) {
    const g = CKD_FROM_ICD[d.icd];
    if (!g || !(d.row.DX_STATUS === "A" || d.row.DX_STATUS === "H")) continue;
    if (!latestG || visitOrder(d.visit, latestG.at) > 0) latestG = { at: d.visit, g };
  }

  const problems: ProblemRow[] = [];
  const allergies: AllergyIntoleranceRow[] = [];
  for (const list of byGroup.values()) {
    list.sort((a, b) => visitOrder(a.visit, b.visit) || (Number(b.row.DX_RANK) || 0) - (Number(a.row.DX_RANK) || 0));
    const latest = list[list.length - 1];
    let chosen: DxEntry | undefined;
    if (latest.row.DX_STATUS === "A" || latest.row.DX_STATUS === "H") chosen = latest;
    else if (latest.row.DX_STATUS === "P") {
      // Provisional now; report only if it was confirmed earlier (and not ruled out since).
      for (let i = list.length - 1; i >= 0; i--) {
        const s = list[i].row.DX_STATUS;
        if (s === "R") break;
        if (s === "A" || s === "H") { chosen = list[i]; break; }
      }
    }
    if (!chosen) continue;
    const evidence: Evidence = list
      .filter((d) => d.row.DX_STATUS === "A" || d.row.DX_STATUS === "H" || d === latest)
      .map((d) => ({ item_id: d.item.id, entry_id: d.entryId }));
    const text = str(chosen.row.DX_TEXT) ?? chosen.icd;

    if (isDrugAdverseEffect(chosen.icd)) {
      let substance = text
        .replace(/^\s*adverse effect of\s+/i, "")
        .replace(/,\s*(initial|subsequent) encounter.*$/i, "")
        .replace(/,\s*sequela.*$/i, "")
        .trim();
      if (!substance) substance = text;
      allergies.push({
        substance: substance.toLowerCase(),
        type: "adverse_reaction",
        criticality: "unknown",
        evidence,
      });
      continue;
    }

    const row: ProblemRow = {
      condition: specificWording(chosen.icd, text, list) ?? text,
      icd10cm: chosen.icd,
      status: chosen.row.DX_STATUS === "H" ? "resolved" : "active",
      evidence,
    };
    if (chosen.icd.startsWith("N18")) {
      if (latestG) {
        row.ckd_stage = latestG.g;
        if (latestG.at.entryId && !evidence.some((x) => x.item_id === latestG!.at.item.id && x.entry_id === latestG!.at.entryId))
          evidence.push({ item_id: latestG.at.item.id, entry_id: latestG.at.entryId });
      }
      if (latestA) {
        row.albuminuria = latestA.a;
        if (!evidence.some((x) => x.item_id === latestA!.at.item.id && x.entry_id === latestA!.at.entryId))
          evidence.push({ item_id: latestA.at.item.id, entry_id: latestA.at.entryId });
      }
    }
    problems.push(row);
  }
  problems.sort((a, b) => (a.icd10cm ?? "").localeCompare(b.icd10cm ?? ""));
  return { problems, allergies };
}

// ── Medications ──

const BRANDS: Record<string, string> = {
  kerendia: "finerenone",
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  trulicity: "dulaglutide",
  mounjaro: "tirzepatide",
  victoza: "liraglutide",
  cozaar: "losartan",
  diovan: "valsartan",
  benicar: "olmesartan",
  avapro: "irbesartan",
  micardis: "telmisartan",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  norvasc: "amlodipine",
  lasix: "furosemide",
  bumex: "bumetanide",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  zocor: "simvastatin",
  lokelma: "sodium zirconium cyclosilicate",
  veltassa: "patiromer",
  renvela: "sevelamer",
  renagel: "sevelamer",
  phoslo: "calcium acetate",
  sensipar: "cinacalcet",
  epogen: "epoetin alfa",
  procrit: "epoetin alfa",
  retacrit: "epoetin alfa",
  aranesp: "darbepoetin alfa",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  humalog: "insulin lispro",
  novolog: "insulin aspart",
  glucophage: "metformin",
  zyloprim: "allopurinol",
  uloric: "febuxostat",
  aldactone: "spironolactone",
  inspra: "eplerenone",
  coreg: "carvedilol",
  toprol: "metoprolol",
  lopressor: "metoprolol",
  entresto: "sacubitril / valsartan",
};
const SALTS = new Set([
  "potassium", "sodium", "calcium", "magnesium", "hydrochloride", "hcl", "besylate", "maleate", "succinate",
  "tartrate", "mesylate", "fumarate", "citrate", "sulfate", "phosphate", "acetate", "carbonate", "bromide",
  "dihydrate", "monohydrate", "hyclate", "medoxomil", "bitartrate", "chloride", "propionate", "trihydrate", "disodium",
]);
const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "oral", "solution", "suspension",
  "injection", "injectable", "pen", "prefilled", "syringe", "vial", "er", "xr", "sr", "dr", "xl", "la", "cr",
  "extended", "delayed", "release", "film", "coated", "chewable", "powder", "packet", "patch", "cream", "ointment",
  "subcutaneous", "intravenous", "kwikpen", "flexpen", "flextouch", "solostar", "auto-injector", "autoinjector",
]);

function ingredientOf(drugName: string): string | undefined {
  let s = drugName.toLowerCase().replace(/\[.*?\]|\(.*?\)/g, " ");
  // name portion: up to the first token that begins with a digit
  const words = s.split(/\s+/).filter(Boolean);
  const nameWords: string[] = [];
  for (const w of words) {
    if (/^\d/.test(w) || /^\.\d/.test(w)) break;
    nameWords.push(w.replace(/[,;]+$/, ""));
  }
  let ws = nameWords.filter((w) => w && !FORM_WORDS.has(w));
  if (ws.length === 0) return undefined;
  const brand = BRANDS[ws[0]];
  if (brand) return brand;
  if (ws.length >= 2 && !SALTS.has(ws[0]) && ws[0] !== "ferrous") {
    while (ws.length >= 2 && SALTS.has(ws[ws.length - 1])) ws = ws.slice(0, -1);
  }
  return ws.join(" ").trim() || undefined;
}

function mapMedications(items: FolioItem[], visits: Map<string, Visit>): MedicationRow[] {
  // Latest copy of each MED_ORDER by RX_ID.
  const orders = new Map<string, Entry>();
  for (const e of entriesOfType(items, "MED_ORDER")) {
    const id = str(e.row.RX_ID);
    if (!id) continue;
    const prev = orders.get(id);
    if (!prev || recordedMs(e.item) >= recordedMs(prev.item)) orders.set(id, e);
  }
  const hist = new Map<string, Entry[]>();
  for (const e of entriesOfType(items, "MED_STATUS_HIST")) {
    const id = str(e.row.RX_ID);
    if (!id) continue;
    const list = hist.get(id) ?? [];
    list.push(e);
    hist.set(id, list);
  }

  interface Cand { row: MedicationRow; key: string; latestEvent: number }
  const cands: Cand[] = [];
  for (const [rxId, o] of orders) {
    const r = o.row;
    if (r.MED_STATUS === 9) continue;
    if (r.ROUTE === "IV") continue; // infusions are not home medications
    const drugName = str(r.DRUG_NAME);
    if (!drugName) continue;

    const hs = (hist.get(rxId) ?? [])
      .filter((h) => [1, 2, 3, 9].includes(h.row.NEW_STATUS))
      .sort((a, b) =>
        (instant(a.row.CHANGED_AT) || 0) - (instant(b.row.CHANGED_AT) || 0) ||
        recordedMs(a.item) - recordedMs(b.item) ||
        String(a.row.HIST_ID ?? "").localeCompare(String(b.row.HIST_ID ?? "")));
    if (hs.some((h) => h.row.NEW_STATUS === 9 && h === hs[hs.length - 1])) continue;
    const last = hs.length > 0 ? hs[hs.length - 1] : undefined;
    const code: number = last ? last.row.NEW_STATUS : r.MED_STATUS;
    const status: MedicationRow["status"] = code === 1 ? "active" : code === 2 ? "stopped" : code === 3 ? "held" : "unknown";
    if (code !== 1 && code !== 2 && code !== 3) continue;

    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [{ item_id: o.item.id, entry_id: o.entryId }] };
    const ingredient = ingredientOf(drugName);
    if (ingredient) row.ingredient = ingredient;

    if (last) {
      const d = chicagoDate(last.row.CHANGED_AT);
      if (status === "active") {
        if (last.row.OLD_STATUS !== 1 && d) row.status_since = d;
        else if (isLocalDate(r.START_DATE)) row.status_since = r.START_DATE;
      } else if (d) row.status_since = d;
      for (const h of hs) row.evidence.push({ item_id: h.item.id, entry_id: h.entryId });
    } else if (status === "active" && isLocalDate(r.START_DATE)) {
      row.status_since = r.START_DATE;
    }

    if (typeof r.DOSE_QTY === "number" && Number.isFinite(r.DOSE_QTY)) {
      const u = r.DOSE_UNIT === "unit" ? "units" : r.DOSE_UNIT;
      if (u === "mg" || u === "mcg" || u === "units" || u === "mL") row.dose = { value: r.DOSE_QTY, unit: u };
    }
    if (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(r.FREQ_CODE)) row.frequency = r.FREQ_CODE;
    else if (str(r.FREQ_CODE)) row.frequency = "other";

    if (last && status !== "active") {
      const text = str(last.row.COMMENT_TEXT);
      if (text) row.status_reason_text = text;
      if (status === "stopped") {
        const rc = last.row.REASON_CODE;
        if (rc === "ADR") row.stop_reason = "adverse_reaction";
        else if (rc === "PT") row.stop_reason = "patient_choice";
        else if (rc === "LAB" || rc === "PROC" || rc === "OTH") row.stop_reason = "other";
      }
    }

    const visit = visits.get(str(r.VISIT_ID) ?? "");
    const events = [
      instant(r.START_DATE),
      visit && visit.item === o.item ? visit.at : instant(o.item.effective),
      ...hs.map((h) => instant(h.row.CHANGED_AT)),
    ].filter((x) => Number.isFinite(x));
    const latestEvent = events.length ? Math.max(...events) : 0;
    cands.push({ row, key: ingredient ?? "lvd:" + (str(r.LV_DRUG_ID) ?? rxId), latestEvent });
  }

  const best = new Map<string, Cand>();
  for (const c of cands) {
    const prev = best.get(c.key);
    if (!prev || c.latestEvent > prev.latestEvent) best.set(c.key, c);
  }
  return Array.from(best.values())
    .map((c) => c.row)
    .sort((a, b) => (a.ingredient ?? a.drug_name).localeCompare(b.ingredient ?? b.drug_name));
}

// ─────────────────────────────────────────────────────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return empty;
  const current = currentItems(items, asOf);
  const clinicItems = current.filter((it) => Object.values(it.payload).some((r) => isObj(r) && r.type === "CLINIC_VISIT"));

  const out: ViewRows = { ...empty };
  const safe = <T>(f: () => T[]): T[] => {
    try { return f(); } catch { return []; }
  };
  out.labs = safe(() => mapLabs(current));
  const visits = (() => { try { return visitsById(clinicItems); } catch { return new Map<string, Visit>(); } })();
  out.vitals = safe(() => mapVitals(clinicItems));
  const pa = (() => {
    try { return mapProblemsAndAllergies(clinicItems, visits); } catch { return { problems: [], allergies: [] }; }
  })();
  out.problems = pa.problems;
  out.allergies = pa.allergies;
  out.medications = safe(() => mapMedications(clinicItems, visits));
  return out;
}
