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

// ───────────────────────────── time helpers ─────────────────────────────

const TZ = "America/Chicago";
const HAS_ZONE = /(Z|[+-]\d\d:?\d\d)$/i;

let fmt: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number): { y: string; mo: string; d: string; h: string; mi: string } | null {
  try {
    if (!fmt) {
      fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      });
    }
    const p: Record<string, string> = {};
    for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = part.value;
    return { y: p.year, mo: p.month, d: p.day, h: p.hour === "24" ? "00" : p.hour, mi: p.minute };
  } catch {
    return null;
  }
}

/** Local wall-clock `YYYY-MM-DDTHH:MM` (or a date / partial date as given). Null if unreadable. */
function localDateTime(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(t);
  if (!m) return null;
  if (!HAS_ZONE.test(t)) return `${m[1]}T${m[2]}`;
  const ms = Date.parse(t);
  if (isNaN(ms)) return null;
  const p = chicagoParts(ms);
  if (!p) return null;
  return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}`;
}

function localDate(s: unknown): string | null {
  const dt = localDateTime(s);
  return dt ? dt.slice(0, 10) : null;
}

function instant(s: unknown): number {
  if (typeof s !== "string") return NaN;
  if (HAS_ZONE.test(s.trim())) return Date.parse(s);
  const withOff = withChicagoOffset(s);
  return withOff ? Date.parse(withOff) : NaN;
}

/** RFC 3339 with offset. Strings already carrying an offset are kept; local ones get the Chicago offset. */
function withChicagoOffset(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (HAS_ZONE.test(t)) return isNaN(Date.parse(t)) ? null : t;
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(:\d{2}(\.\d+)?)?$/.exec(t);
  if (!m) return null;
  const wall = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
  const secs = m[6] ?? ":00";
  for (const off of ["-06:00", "-05:00"]) {
    const cand = `${wall}${secs}${off}`;
    if (localDateTime(cand) === wall) return cand;
  }
  return `${wall}${secs}-06:00`;
}

// ───────────────────────────── generic helpers ─────────────────────────────

type Entry = { item: FolioItem; key: string; row: any };

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}

function isObj(v: unknown): v is Record<string, any> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function entriesOf(item: FolioItem): Entry[] {
  const out: Entry[] = [];
  if (!isObj(item.payload)) return out;
  for (const key of Object.keys(item.payload)) {
    const row = item.payload[key];
    if (isObj(row) && typeof row.type === "string") out.push({ item, key, row });
  }
  return out;
}

function ev(e: Entry): { item_id: string; entry_id: string } {
  return { item_id: e.item.id, entry_id: e.key };
}

function dedupeEvidence(list: Evidence): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const e of list) {
    const k = `${e.item_id}\u0000${e.entry_id ?? ""}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(e);
  }
  return out;
}

function cmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

// ───────────────────────────── as-of / supersession ─────────────────────────────

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const recordedOk = (it: FolioItem): boolean => {
    const d = localDate(it.recorded);
    return d !== null && d <= asOf;
  };
  const candidates = items.filter((it) => isObj(it) && typeof it.id === "string" && recordedOk(it));
  const retracted = new Set<string>();
  for (const it of candidates) {
    if (Array.isArray(it.retracts)) for (const r of it.retracts) if (typeof r === "string") retracted.add(r);
  }
  const live = candidates.filter((it) => !retracted.has(it.id));
  const superseded = new Set<string>();
  for (const it of live) {
    if (Array.isArray(it.supersedes)) for (const s of it.supersedes) if (typeof s === "string") superseded.add(s);
  }
  // Transitivity: every superseding item that counts contributes its list, so chains resolve on their own.
  return live.filter((it) => !superseded.has(it.id));
}

function recordedKey(it: FolioItem): number {
  const n = instant(it.recorded);
  return isNaN(n) ? 0 : n;
}

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
  // LK-EGFR09A (race-coefficient variant) is deliberately absent.
};

// Higher = later state of a result row.
const RESULT_RANK: Record<string, number> = { P: 0, F: 1, A: 2, X: 3, C: 4 };

function parseValue(text: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | null {
  if (typeof text !== "string") return null;
  const m = /^\s*(<=|>=|<|>)?\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(text);
  if (!m) return null;
  const value = Number(m[2]);
  if (!isFinite(value)) return null;
  return m[1] ? { value, comparator: m[1] as "<" | ">" | "<=" | ">=" } : { value };
}

function egfrEquation(code: string, comment: unknown): "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | "unknown" {
  const c = typeof comment === "string" ? comment : "";
  if (/CKD[- ]?EPI[^.]*2021/i.test(c)) return "ckd-epi-2021";
  if (/CKD[- ]?EPI[^.]*2009/i.test(c)) return "ckd-epi-2009";
  if (/MDRD/i.test(c)) return "mdrd";
  if (code === "LK-EGFR21") return "ckd-epi-2021";
  if (code === "LK-EGFR09N") return "ckd-epi-2009";
  return "unknown";
}

function buildLabs(items: FolioItem[]): LabResultRow[] {
  const reqs = new Map<string, { e: Entry; rk: number }>();
  const orders = new Map<string, { e: Entry; rk: number }>();
  const results = new Map<string, Entry[]>();

  for (const it of items) {
    const rk = recordedKey(it);
    for (const e of entriesOf(it)) {
      const r = e.row;
      if (r.type === "LAB_REQ" && str(r.REQ_ID)) {
        const prev = reqs.get(r.REQ_ID);
        if (!prev || rk >= prev.rk) reqs.set(r.REQ_ID, { e, rk });
      } else if (r.type === "LAB_ORDER" && str(r.ORDER_ID)) {
        const prev = orders.get(r.ORDER_ID);
        if (!prev || rk >= prev.rk) orders.set(r.ORDER_ID, { e, rk });
      } else if (r.type === "LAB_RESULT" && str(r.RESULT_ID)) {
        const list = results.get(r.RESULT_ID) ?? [];
        list.push(e);
        results.set(r.RESULT_ID, list);
      }
    }
  }

  // Requisition per item, for collection time when the order row is missing.
  const reqOfItem = new Map<string, Entry>();
  for (const it of items) for (const e of entriesOf(it)) if (e.row.type === "LAB_REQ") reqOfItem.set(it.id, e);

  const rows: LabResultRow[] = [];
  const resultIds = [...results.keys()].sort();
  for (const rid of resultIds) {
    const copies = results.get(rid)!;
    // Most advanced copy; ties go to the later-recorded item.
    let best = copies[0];
    for (const c of copies) {
      const rc = RESULT_RANK[c.row.RESULT_STATUS] ?? -1;
      const rb = RESULT_RANK[best.row.RESULT_STATUS] ?? -1;
      if (rc > rb || (rc === rb && recordedKey(c.item) > recordedKey(best.item))) best = c;
    }
    const r = best.row;
    const status = r.RESULT_STATUS;
    if (status !== "F" && status !== "A" && status !== "P") continue;

    const map = LAB_MAP[r.TEST_CODE];
    if (!map) continue;

    const ord = typeof r.ORDER_ID === "string" ? orders.get(r.ORDER_ID) : undefined;
    if (ord && (ord.e.row.ORDER_STATUS === 9 || ord.e.row.ORDER_STATUS === 5)) continue;

    const parsed = parseValue(r.VALUE_TEXT);
    if (!parsed) continue;
    if (r.UNIT_CODE != null && r.UNIT_CODE !== map.srcUnit) continue;

    let reqEntry: Entry | undefined;
    if (ord && str(ord.e.row.REQ_ID)) reqEntry = reqs.get(ord.e.row.REQ_ID)?.e;
    if (!reqEntry) reqEntry = reqOfItem.get(best.item.id);
    const collected = withChicagoOffset(reqEntry?.row.COLLECTED_AT) ?? withChicagoOffset(best.item.effective);
    if (!collected) continue;

    const row: LabResultRow = {
      analyte: map.analyte,
      value: parsed.value,
      unit: map.unit,
      collected,
      status: status === "P" ? "preliminary" : "final",
      evidence: [],
    };
    if (parsed.comparator) row.comparator = parsed.comparator;
    if (map.analyte === "egfr") row.egfr_equation = egfrEquation(r.TEST_CODE, r.COMMENT_TEXT);
    if (str(r.LOINC)) row.loinc = r.LOINC;

    // The chosen copy first, then other copies of the same result.
    const evid: Evidence = [ev(best)];
    const others = copies.filter((c) => c !== best).sort((a, b) => recordedKey(b.item) - recordedKey(a.item));
    for (const c of others) {
      const rs = c.row.RESULT_STATUS;
      if (rs === "F" || rs === "A" || rs === "P") evid.push(ev(c));
    }
    row.evidence = dedupeEvidence(evid);
    rows.push(row);
  }

  rows.sort((a, b) => cmp(a.collected, b.collected) || cmp(a.analyte, b.analyte));
  return rows;
}

// ───────────────────────────── vitals ─────────────────────────────

function buildVitals(items: FolioItem[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const it of items) {
    const vitals = entriesOf(it).filter((e) => e.row.type === "VITAL" && typeof e.row.VALUE_NUM === "number" && isFinite(e.row.VALUE_NUM));
    if (vitals.length === 0) continue;

    // Group by VISIT_ID in case an item ever carries more than one contact's vitals.
    const byVisit = new Map<string, Entry[]>();
    for (const v of vitals) {
      const k = String(v.row.VISIT_ID ?? "");
      const l = byVisit.get(k) ?? [];
      l.push(v);
      byVisit.set(k, l);
    }

    for (const list of byVisit.values()) {
      const readingNo = (e: Entry): number => (typeof e.row.READING_NO === "number" ? e.row.READING_NO : 1);
      const byCode = (code: string): Entry[] =>
        list
          .filter((e) => e.row.VITAL_CODE === code)
          .sort((a, b) => readingNo(a) - readingNo(b) || (instant(a.row.TAKEN_AT) || 0) - (instant(b.row.TAKEN_AT) || 0));
      const sys = byCode("BPS").filter((e) => e.row.UNIT_CODE === "mmHg" || e.row.UNIT_CODE == null);
      const dia = byCode("BPD").filter((e) => e.row.UNIT_CODE === "mmHg" || e.row.UNIT_CODE == null);
      const hr = byCode("HR");
      const wt = byCode("WT");

      const used: Entry[] = [];
      const row: VitalRow = { setting: "clinic", local_time: "", evidence: [] };

      // Pair systolic and diastolic by READING_NO.
      const readings = [...new Set([...sys, ...dia].map(readingNo))].sort((a, b) => a - b);
      const bpPairs = readings.map((n) => ({
        s: sys.find((e) => readingNo(e) === n),
        d: dia.find((e) => readingNo(e) === n),
      }));
      const first = bpPairs[0];
      if (first) {
        if (first.s) { row.systolic_mmhg = first.s.row.VALUE_NUM; used.push(first.s); }
        if (first.d) { row.diastolic_mmhg = first.d.row.VALUE_NUM; used.push(first.d); }
      }
      const rep = bpPairs[1];
      if (rep) {
        if (rep.s) { row.repeat_systolic_mmhg = rep.s.row.VALUE_NUM; used.push(rep.s); }
        if (rep.d) { row.repeat_diastolic_mmhg = rep.d.row.VALUE_NUM; used.push(rep.d); }
      }
      if (hr[0]) { row.pulse_bpm = hr[0].row.VALUE_NUM; used.push(hr[0]); }
      if (wt[0]) {
        let kg: number | null = wt[0].row.VALUE_NUM;
        const u = wt[0].row.UNIT_CODE;
        if (u === "lb" || u === "lbs") kg = (kg as number) * 0.45359237;
        else if (u === "g") kg = (kg as number) / 1000;
        else if (u != null && u !== "kg") kg = null;
        if (kg !== null) { row.weight_kg = Math.round(kg * 10) / 10; used.push(wt[0]); }
      }
      if (used.length === 0) continue;

      // Time: first blood pressure, else first measurement.
      let timeSrc: Entry | undefined = first ? first.s ?? first.d : undefined;
      if (!timeSrc) {
        timeSrc = [...used].sort((a, b) => (instant(a.row.TAKEN_AT) || 0) - (instant(b.row.TAKEN_AT) || 0))[0];
      }
      const lt = localDateTime(timeSrc?.row.TAKEN_AT) ?? localDateTime(it.effective);
      if (!lt || lt.length < 16) continue;
      row.local_time = lt.slice(0, 16);
      row.evidence = dedupeEvidence(used.map(ev));
      rows.push(row);
    }
  }
  rows.sort((a, b) => cmp(a.local_time, b.local_time));
  return rows;
}

// ───────────────────────────── problems & allergies ─────────────────────────────

/** Groups codes that restage or recode the same condition. */
function conditionGroup(icd: string): string {
  const c = icd.toUpperCase();
  if (/^N18/.test(c)) return "CKD";
  if (/^E11/.test(c)) return "T2DM";
  if (/^E10/.test(c)) return "T1DM";
  if (/^I1[0-3]/.test(c)) return "HTN";
  return c;
}

function isCkdCode(icd: string): boolean {
  return /^N18/i.test(icd);
}

/** ICD-10-CM T36–T50 with 5th/6th character 5: adverse effect of a drug. */
function isAdverseEffectCode(icd: string): boolean {
  return /^T(3[6-9]|4\d|50)\.[0-9A-Z]{1,2}5/i.test(icd) || /^T(3[6-9]|4\d|50)\.\d5/i.test(icd);
}

function stageFromCode(icd: string): ProblemRow["ckd_stage"] | undefined {
  const c = icd.toUpperCase();
  const m: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  return m[c];
}

function problemSensitivity(icd: string, text: string): Sensitivity[] | undefined {
  const c = icd.toUpperCase();
  const s = new Set<Sensitivity>();
  if (/^F1[0-689]/.test(c)) s.add("substance-use");
  else if (/^F(0[1-9]|[2-9]\d)/.test(c)) s.add("mental-health");
  if (/^(B2[0-4]|Z21|A5\d|A6[0-4]|Z20\.6|Z11\.4|Z71\.7)/.test(c)) s.add("hiv-sti");
  if (/^(O\d|Z3[0-9]|Z3A|N9[67]|N98)/.test(c)) s.add("sexual-reproductive-health");
  if (/^(Z1[45]|Q61\.[123]|Q87\.81|E75\.21)/.test(c)) s.add("genetic");
  if (/\b(polycystic kidney|alport|fabry)\b/i.test(text)) s.add("genetic");
  return s.size ? [...s].sort() : undefined;
}

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

function pad2(n: string): string {
  return n.length === 1 ? "0" + n : n;
}

/** Onset stated in the narrative span that refers to an entry ("since 2015", "since 11/2010"). */
function onsetFromText(text: string): ProblemRow["onset"] | undefined {
  const t = text.replace(/<[^>]*>/g, " ");
  let m = /\b(?:since|onset|diagnosed(?: in)?)\s+(\d{4})-(\d{2})-(\d{2})\b/i.exec(t);
  if (m) return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
  m = /\b(?:since|onset|diagnosed(?: in)?)\s+(\d{1,2})\/(\d{1,2})\/(\d{4})\b/i.exec(t);
  if (m && +m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31)
    return { value: `${m[3]}-${pad2(m[1])}-${pad2(m[2])}`, precision: "day" };
  m = /\b(?:since|onset|diagnosed(?: in)?)\s+(\d{4})-(\d{2})\b/i.exec(t);
  if (m) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  m = /\b(?:since|onset|diagnosed(?: in)?)\s+(\d{1,2})\/(\d{4})\b/i.exec(t);
  if (m && +m[1] >= 1 && +m[1] <= 12) return { value: `${m[2]}-${pad2(m[1])}`, precision: "month" };
  m = /\b(?:since|onset|diagnosed(?: in)?)\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s+(\d{4})\b/i.exec(t);
  if (m) return { value: `${m[2]}-${MONTHS[m[1].toLowerCase()]}`, precision: "month" };
  m = /\b(?:since|onset|diagnosed(?: in)?)\s+(\d{4})\b(?![\/-]\d)/i.exec(t);
  if (m && +m[1] >= 1900 && +m[1] <= 2100) return { value: m[1], precision: "year" };
  return undefined;
}

function refSpans(narrative: unknown): Map<string, string> {
  const out = new Map<string, string>();
  if (typeof narrative !== "string") return out;
  const re = /<ref\s+id="([^"]+)"\s*>([\s\S]*?)<\/ref>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(narrative))) out.set(m[1], (out.get(m[1]) ? out.get(m[1]) + " " : "") + m[2]);
  return out;
}

type Contact = { item: FolioItem; visit?: Entry; time: string; dx: Entry[]; meds: Entry[] };

function contactTime(it: FolioItem, visit?: Entry): string {
  return localDateTime(visit?.row.VISIT_AT) ?? localDateTime(it.effective) ?? localDateTime(it.recorded) ?? "";
}

function buildContacts(items: FolioItem[]): Contact[] {
  const out: Contact[] = [];
  for (const it of items) {
    const es = entriesOf(it);
    const visit = es.find((e) => e.row.type === "CLINIC_VISIT");
    const dx = es.filter((e) => e.row.type === "VISIT_DX" && str(e.row.ICD10CM));
    const meds = es.filter((e) => e.row.type === "MED_ORDER");
    if (!visit && dx.length === 0 && meds.length === 0) continue;
    out.push({ item: it, visit, time: contactTime(it, visit), dx, meds });
  }
  out.sort((a, b) => cmp(a.time, b.time) || recordedKey(a.item) - recordedKey(b.item));
  return out;
}

// Reaction manifestations that may accompany an adverse-effect code at the same contact.
const MANIFESTATIONS: { re: RegExp; type: AllergyIntoleranceRow["reaction_type"]; crit: AllergyIntoleranceRow["criticality"] }[] = [
  { re: /^T78\.[0-2]|^T88\.6|^T80\.5/, type: "hypersensitivity", crit: "high" },
  { re: /^T78\.3/, type: "hypersensitivity", crit: "high" },
  { re: /^J98\.01/, type: "hypersensitivity", crit: "high" },
  { re: /^L51\.[12]/, type: "hypersensitivity", crit: "high" },
  { re: /^(L50|L27|R21|T78\.4|L23|L25|L29)/, type: "hypersensitivity", crit: "unknown" },
  { re: /^(K85\.3|K71|N14\.[12]|D61\.1|D70\.1|D59\.0|M62\.82|G72\.0)/, type: "serious_adverse_event", crit: "high" },
  { re: /^(E87\.5|E87\.1|I95\.2|N17)/, type: "serious_adverse_event", crit: "unknown" },
  { re: /^(R05|R11|R42|R19\.7|K59\.0|R53|R51|M79\.1|R60|R25\.2)/, type: "side_effect", crit: "low" },
];

// Drug classes named by adverse-effect codes, with members likely on a nephrology medication list.
const CLASS_MEMBERS: { re: RegExp; members: string[] }[] = [
  { re: /angiotensin[- ]converting[- ]enzyme|ACE inhibitor/i, members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"] },
  { re: /antihypertensive/i, members: ["losartan", "valsartan", "irbesartan", "olmesartan", "telmisartan", "candesartan", "azilsartan", "hydralazine", "clonidine", "minoxidil"] },
  { re: /mineralocorticoid|aldosterone/i, members: ["spironolactone", "eplerenone", "finerenone"] },
  { re: /loop|high-ceiling/i, members: ["furosemide", "bumetanide", "torsemide"] },
  { re: /benzothiadiazine|thiazide/i, members: ["hydrochlorothiazide", "chlorthalidone", "chlorothiazide", "metolazone", "indapamide"] },
  { re: /insulin|hypoglycemic|antidiabetic/i, members: ["insulin", "metformin", "empagliflozin", "dapagliflozin", "canagliflozin", "glipizide", "glimepiride", "sitagliptin", "linagliptin", "semaglutide", "dulaglutide", "liraglutide", "tirzepatide", "pioglitazone"] },
  { re: /penicillin/i, members: ["amoxicillin", "penicillin", "ampicillin", "dicloxacillin", "piperacillin"] },
  { re: /cephalosporin/i, members: ["cephalexin", "cefuroxime", "ceftriaxone", "cefdinir", "cefazolin"] },
  { re: /sulfonamide/i, members: ["sulfamethoxazole"] },
  { re: /antihyperlipidemic|statin/i, members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "ezetimibe"] },
  { re: /calcium[- ]channel/i, members: ["amlodipine", "nifedipine", "diltiazem", "verapamil", "felodipine"] },
  { re: /beta[- ]adrenoreceptor|beta[- ]blocker/i, members: ["metoprolol", "carvedilol", "atenolol", "labetalol", "nebivolol", "bisoprolol", "propranolol"] },
  { re: /nonsteroidal|NSAID|propionic acid/i, members: ["ibuprofen", "naproxen", "meloxicam", "diclofenac", "celecoxib", "indomethacin"] },
];

function adverseSubstanceText(dxText: string): string {
  const m = /adverse effect of\s+(.+?)(?:,\s*(?:initial|subsequent) encounter|,\s*sequela)?\s*$/i.exec(dxText);
  return (m ? m[1] : dxText).trim();
}

function buildProblemsAndAllergies(
  contacts: Contact[],
  medIngredientsByItem: Map<string, string[]>,
): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  // Collect all dx entries in contact order.
  type Dx = { c: Contact; e: Entry; code: string; group: string };
  const all: Dx[] = [];
  for (const c of contacts) {
    const sorted = [...c.dx].sort((a, b) => (Number(a.row.DX_RANK) || 99) - (Number(b.row.DX_RANK) || 99));
    for (const e of sorted) {
      const code = String(e.row.ICD10CM).trim().toUpperCase();
      all.push({ c, e, code, group: isAdverseEffectCode(code) ? "ADV:" + code : conditionGroup(code) });
    }
  }

  const groups = new Map<string, Dx[]>();
  for (const d of all) {
    const l = groups.get(d.group) ?? [];
    l.push(d);
    groups.set(d.group, l);
  }

  // CKD categories, most recent per contact.
  let ckdG: { v: ProblemRow["ckd_stage"]; c: Contact } | undefined;
  let ckdA: { v: ProblemRow["albuminuria"]; c: Contact } | undefined;
  for (const c of contacts) {
    const g = c.visit?.row.CKD_G;
    const a = c.visit?.row.CKD_A;
    let gv: ProblemRow["ckd_stage"] | undefined = ["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(g) ? g : undefined;
    if (!gv) {
      for (const e of c.dx) {
        const s = stageFromCode(String(e.row.ICD10CM));
        if (s && e.row.DX_STATUS !== "R") { gv = s; break; }
      }
    }
    if (gv) ckdG = { v: gv, c };
    if (["A1", "A2", "A3"].includes(a)) ckdA = { v: a, c };
  }

  const problems: ProblemRow[] = [];
  const allergies: AllergyIntoleranceRow[] = [];

  for (const [group, list] of groups) {
    // Latest contact wins; within it, the highest-ranked entry (list is in contact order, rank order).
    const lastContact = list[list.length - 1].c;
    const latest = list.find((d) => d.c === lastContact)!;
    const st = latest.e.row.DX_STATUS;
    if (st === "R") continue;
    const everConfirmed = list.some((d) => d.e.row.DX_STATUS === "A" || d.e.row.DX_STATUS === "H");
    if (st === "P" && !everConfirmed) continue;
    if (st !== "A" && st !== "H" && st !== "P") continue;
    const status: ProblemRow["status"] = st === "H" ? "resolved" : "active";

    if (group.startsWith("ADV:")) {
      if (status !== "active" && status !== "resolved") continue;
      const contact = latest.c;
      const classText = adverseSubstanceText(String(latest.e.row.DX_TEXT ?? latest.code));
      // Specific drug named in the text?
      let substance = classText;
      const meds = medIngredientsByItem.get(contact.item.id) ?? [];
      const direct = meds.find((m) => new RegExp(`\\b${m}\\b`, "i").test(classText));
      if (direct) substance = direct;
      else {
        const cls = CLASS_MEMBERS.find((k) => k.re.test(classText));
        if (cls) {
          const onList = [...new Set(meds.filter((m) => cls.members.includes(m)))];
          if (onList.length === 1) substance = onList[0];
        }
      }
      // Manifestations recorded at the same contact.
      const manif = contact.dx.filter((e) => {
        const code = String(e.row.ICD10CM).toUpperCase();
        return !isAdverseEffectCode(code) && e.row.DX_STATUS !== "R" && MANIFESTATIONS.some((m) => m.re.test(code));
      });
      let reactionType: AllergyIntoleranceRow["reaction_type"] = "side_effect";
      let crit: AllergyIntoleranceRow["criticality"] = "unknown";
      const order = ["side_effect", "serious_adverse_event", "hypersensitivity"];
      const critOrder = ["unknown", "low", "high"];
      let first = true;
      for (const e of manif) {
        const code = String(e.row.ICD10CM).toUpperCase();
        const m = MANIFESTATIONS.find((x) => x.re.test(code))!;
        if (first || order.indexOf(m.type) > order.indexOf(reactionType)) reactionType = m.type;
        if (critOrder.indexOf(m.crit) > critOrder.indexOf(crit)) crit = m.crit;
        first = false;
      }
      const row: AllergyIntoleranceRow = {
        substance,
        reaction_type: reactionType,
        mechanism: "unknown",
        criticality: crit,
        evidence: dedupeEvidence([ev(latest.e), ...manif.map((e) => ev({ item: contact.item, key: e.key, row: e.row }))]),
      };
      const reaction = manif.map((e) => String(e.row.DX_TEXT ?? "")).filter((s) => s).join("; ");
      if (reaction) row.reaction = reaction;
      allergies.push(row);
      continue;
    }

    const code = latest.code;
    const row: ProblemRow = {
      condition: String(latest.e.row.DX_TEXT ?? code),
      icd10cm: String(latest.e.row.ICD10CM).trim(),
      status,
      evidence: [ev(latest.e)],
    };

    // Onset from the narrative span tied to any entry of this condition (latest stating it).
    for (let i = list.length - 1; i >= 0; i--) {
      const d = list[i];
      const span = refSpans(d.c.item.narrative).get(d.e.key);
      if (!span) continue;
      const on = onsetFromText(span);
      if (on) {
        row.onset = on;
        row.evidence.push(ev(d.e));
        break;
      }
    }

    if (isCkdCode(code)) {
      if (ckdG) {
        row.ckd_stage = ckdG.v;
        if (ckdG.c.visit) row.evidence.push(ev(ckdG.c.visit));
      }
      if (ckdA) {
        row.albuminuria = ckdA.v;
        if (ckdA.c.visit) row.evidence.push(ev(ckdA.c.visit));
      }
    }
    const sens = problemSensitivity(code, row.condition);
    if (sens) row.sensitivity = sens;
    row.evidence = dedupeEvidence(row.evidence);
    problems.push(row);
  }

  problems.sort((a, b) => cmp(a.icd10cm ?? "", b.icd10cm ?? "") || cmp(a.condition, b.condition));
  allergies.sort((a, b) => cmp(a.substance, b.substance));
  return { problems, allergies };
}

// ───────────────────────────── medications ─────────────────────────────

const BRANDS: Record<string, string> = {
  kerendia: "finerenone", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", aldactone: "spironolactone", inspra: "eplerenone",
  renvela: "sevelamer", renagel: "sevelamer", phoslo: "calcium acetate", velphoro: "sucroferric oxyhydroxide",
  auryxia: "ferric citrate", fosrenol: "lanthanum", sensipar: "cinacalcet", zemplar: "paricalcitol",
  hectorol: "doxercalciferol", rocaltrol: "calcitriol", lokelma: "sodium zirconium cyclosilicate",
  veltassa: "patiromer", kayexalate: "sodium polystyrene sulfonate", epogen: "epoetin alfa", procrit: "epoetin alfa",
  retacrit: "epoetin alfa", aranesp: "darbepoetin alfa", mircera: "methoxy polyethylene glycol-epoetin beta",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", januvia: "sitagliptin", tradjenta: "linagliptin",
  cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril",
  norvasc: "amlodipine", lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  synthroid: "levothyroxine", glucophage: "metformin", lantus: "insulin glargine", basaglar: "insulin glargine",
  tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart",
  coreg: "carvedilol", lopressor: "metoprolol", toprol: "metoprolol", procardia: "nifedipine",
  zyloprim: "allopurinol", uloric: "febuxostat", jynarque: "tolvaptan", samsca: "tolvaptan",
  cellcept: "mycophenolate", prograf: "tacrolimus", benlysta: "belimumab",
};

const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "hyclate", "besylate", "maleate", "mesylate", "succinate", "tartrate", "fumarate",
  "potassium", "sodium", "calcium", "magnesium", "monohydrate", "dihydrate", "trihydrate", "anhydrous",
  "hydrobromide", "sulfate", "phosphate", "acetate", "citrate", "carbonate", "bicarbonate", "chloride",
  "propionate", "dipropionate", "valerate", "bitartrate", "medoxomil", "cilexetil", "er", "xr", "sr", "dr", "xl", "la",
]);

// Words that are themselves the drug when they are all that is left, or when they lead the name.
const LEADING_SALT_OK = new Set(["potassium", "sodium", "calcium", "magnesium"]);

const FORM_WORDS = /\b(tablets?|capsules?|caps?|tabs?|solution|suspension|injection|injectable|pen|syringe|vial|patch|cream|ointment|oral|extended|delayed|release|chewable|film|coated|powder|packet|for|kit|prefilled|subcutaneous|intravenous|inhaler|ml|mg|mcg|units?)\b/gi;

function ingredientsFromName(drugName: string): string[] {
  let n = drugName.toLowerCase().trim();
  // Cut at the first strength token.
  const cut = n.search(/\s\d|\s\.\d|\(\s*\d/);
  if (cut > 0) n = n.slice(0, cut);
  n = n.replace(/\([^)]*\)/g, " ").replace(FORM_WORDS, " ").replace(/\s+/g, " ").trim();
  if (!n) return [];
  const parts = n.split(/\s*(?:\/|\+|\band\b|-(?=[a-z]{4,}(?:\s|$)))\s*/).map((p) => p.trim()).filter((p) => p);
  const out: string[] = [];
  for (const raw of parts) {
    let p = raw;
    const brand = BRANDS[p.split(" ")[0]];
    if (brand) { out.push(brand); continue; }
    const words = p.split(" ");
    while (words.length > 1 && /^(er|xr|sr|dr|xl|la|ec|cr|odt)$/.test(words[words.length - 1])) words.pop();
    // Leading cation words that are the drug itself (potassium chloride, sodium bicarbonate, calcium acetate).
    if (words.length >= 1 && LEADING_SALT_OK.has(words[0])) { out.push(words.join(" ")); continue; }
    while (words.length > 1 && SALT_WORDS.has(words[words.length - 1])) words.pop();
    p = words.join(" ").trim();
    if (p) out.push(p);
  }
  return [...new Set(out)];
}

const MED_SENSITIVITY: { re: RegExp; cat: Sensitivity }[] = [
  { re: /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|naloxone|varenicline)\b/i, cat: "substance-use" },
  { re: /\b(quetiapine|olanzapine|risperidone|aripiprazole|ziprasidone|lurasidone|clozapine|haloperidol|lithium|lamotrigine|valproate|divalproex|sertraline|fluoxetine|citalopram|escitalopram|paroxetine|venlafaxine|duloxetine|bupropion|mirtazapine|trazodone|buspirone|lorazepam|alprazolam|clonazepam|diazepam)\b/i, cat: "mental-health" },
  { re: /\b(tenofovir|emtricitabine|dolutegravir|bictegravir|raltegravir|efavirenz|rilpivirine|darunavir|atazanavir|abacavir|lamivudine|zidovudine|cabotegravir|lenacapavir)\b/i, cat: "hiv-sti" },
  { re: /\b(levonorgestrel|norethindrone|ethinyl estradiol|medroxyprogesterone|etonogestrel|drospirenone|norgestimate|sildenafil|tadalafil|misoprostol|mifepristone)\b/i, cat: "sexual-reproductive-health" },
];

function buildMedications(items: FolioItem[]): { meds: MedicationRow[]; ingredientsByItem: Map<string, string[]> } {
  const orders = new Map<string, { e: Entry; rk: number }>();
  const hists = new Map<string, Entry[]>();
  const ingredientsByItem = new Map<string, string[]>();

  for (const it of items) {
    const rk = recordedKey(it);
    for (const e of entriesOf(it)) {
      if (e.row.type === "MED_ORDER" && str(e.row.RX_ID)) {
        const prev = orders.get(e.row.RX_ID);
        if (!prev || rk >= prev.rk) orders.set(e.row.RX_ID, { e, rk });
      } else if (e.row.type === "MED_STATUS_HIST" && str(e.row.RX_ID)) {
        const l = hists.get(e.row.RX_ID) ?? [];
        l.push(e);
        hists.set(e.row.RX_ID, l);
      }
    }
  }

  type Cand = { row: MedicationRow; ingredient: string; key: string };
  const cands: Cand[] = [];

  for (const [rxId, { e }] of orders) {
    const r = e.row;
    if (r.MED_STATUS === 9) continue;
    if (r.ROUTE === "IV") continue; // clinic-administered infusions are not home medicines
    const drugName = str(r.DRUG_NAME);
    if (!drugName) continue;

    const hl = (hists.get(rxId) ?? [])
      .filter((h) => [1, 2, 3, 9].includes(h.row.NEW_STATUS))
      .sort((a, b) => (instant(a.row.CHANGED_AT) || 0) - (instant(b.row.CHANGED_AT) || 0) || cmp(String(a.row.HIST_ID), String(b.row.HIST_ID)));
    const last = hl[hl.length - 1];
    const statusCode: number = last ? last.row.NEW_STATUS : r.MED_STATUS;
    if (statusCode === 9) continue;
    if (last && last.row.REASON_CODE === "ERR" && statusCode === 2) continue; // stopped as entered in error

    const status: MedicationRow["status"] =
      statusCode === 1 ? "active" : statusCode === 2 ? "stopped" : statusCode === 3 ? "held" : "unknown";

    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [] };

    let since: string | undefined;
    if (last) since = localDate(last.row.CHANGED_AT) ?? undefined;
    else if (status === "active") since = str(r.START_DATE) && /^\d{4}(-\d{2}(-\d{2})?)?$/.test(r.START_DATE) ? r.START_DATE : undefined;
    if (since) row.status_since = since;

    if (typeof r.DOSE_QTY === "number" && isFinite(r.DOSE_QTY) && r.DOSE_QTY > 0) {
      const u = r.DOSE_UNIT === "unit" || r.DOSE_UNIT === "units" ? "units" : r.DOSE_UNIT;
      if (u === "mg" || u === "mcg" || u === "units" || u === "mL") row.dose = { value: r.DOSE_QTY, unit: u };
    }
    if (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(r.FREQ_CODE)) row.frequency = r.FREQ_CODE;
    else if (str(r.FREQ_CODE)) row.frequency = "other";

    if (last) {
      if (status === "stopped") {
        const rc = last.row.REASON_CODE;
        row.stop_reason = rc === "ADR" ? "adverse_reaction" : rc === "PT" ? "patient_choice" : "other";
      }
      if (str(last.row.COMMENT_TEXT)) row.status_reason_text = last.row.COMMENT_TEXT;
    }

    row.evidence = dedupeEvidence(last ? [ev(last), ev(e)] : [ev(e)]);

    const ings = ingredientsFromName(drugName);
    // Event key: latest of start date and status changes, for picking among lines of one ingredient.
    let key = str(r.START_DATE) ?? "";
    for (const h of hl) {
      const t = localDateTime(h.row.CHANGED_AT);
      if (t && t > key) key = t;
    }
    const sens = new Set<Sensitivity>();
    for (const s of MED_SENSITIVITY) if (s.re.test(drugName)) sens.add(s.cat);

    const list = ingredientsByItem.get(e.item.id) ?? [];
    list.push(...ings);
    ingredientsByItem.set(e.item.id, list);

    if (ings.length === 0) {
      const copy: MedicationRow = { ...row };
      if (sens.size) copy.sensitivity = [...sens].sort();
      cands.push({ row: copy, ingredient: "\u0000" + rxId, key });
      continue;
    }
    for (const ing of ings) {
      const copy: MedicationRow = { ...row, ingredient: ing, evidence: [...row.evidence] };
      if (ings.length > 1) delete copy.dose; // one dose number cannot be split across ingredients
      if (sens.size) copy.sensitivity = [...sens].sort();
      cands.push({ row: copy, ingredient: ing, key: key + "\u0000" + rxId });
    }
  }

  const byIng = new Map<string, Cand>();
  for (const c of cands) {
    const prev = byIng.get(c.ingredient);
    if (!prev || c.key > prev.key) byIng.set(c.ingredient, c);
  }
  const meds = [...byIng.values()].map((c) => c.row);
  meds.sort((a, b) => cmp(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name));
  return { meds, ingredientsByItem };
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return empty;

  const counting = countingItems(items, asOf);
  const result: ViewRows = { ...empty };

  try { result.labs = buildLabs(counting); } catch { result.labs = []; }
  try { result.vitals = buildVitals(counting); } catch { result.vitals = []; }

  let ingredientsByItem = new Map<string, string[]>();
  try {
    const m = buildMedications(counting);
    result.medications = m.meds;
    ingredientsByItem = m.ingredientsByItem;
  } catch { result.medications = []; }

  try {
    const pa = buildProblemsAndAllergies(buildContacts(counting), ingredientsByItem);
    result.problems = pa.problems;
    result.allergies = pa.allergies;
  } catch { result.problems = []; result.allergies = []; }

  return result;
}
