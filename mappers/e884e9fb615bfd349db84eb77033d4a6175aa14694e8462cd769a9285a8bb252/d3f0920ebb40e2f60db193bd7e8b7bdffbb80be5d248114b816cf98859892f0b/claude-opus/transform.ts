import type {
  AllergyIntoleranceRow,
  Analyte,
  Evidence,
  FolioItem,
  LabResultRow,
  MedicationRow,
  ProblemRow,
  Sensitivity,
  ViewRows,
  VitalRow,
} from "../in/views/views";

// Lakeview Labs & Kidney Care (lakeview-v1) → consumer views.

const TZ = "America/Chicago";

// ───────────────────────────── time helpers ─────────────────────────────

type Local = { y: number; mo: number; d: number; h: number; mi: number; s: number };

const OFFSET_RE = /(Z|[+-]\d{2}:?\d{2})$/i;
const DT_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?/;

let fmt: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number): Local | null {
  try {
    if (!fmt) {
      fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
    }
    const p: Record<string, string> = {};
    for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = part.value;
    const h = Number(p.hour) % 24;
    return { y: Number(p.year), mo: Number(p.month), d: Number(p.day), h, mi: Number(p.minute), s: Number(p.second) };
  } catch {
    return null;
  }
}

/** Local wall-clock parts of a timestamp (converted when it carries an offset, as written otherwise). */
function toLocal(s: unknown): Local | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  const m = DT_RE.exec(t);
  if (!m) return null;
  if (m[4] !== undefined && OFFSET_RE.test(t)) {
    const ms = Date.parse(t);
    if (isNaN(ms)) return null;
    return chicagoParts(ms);
  }
  return { y: +m[1], mo: +m[2], d: +m[3], h: m[4] ? +m[4] : 0, mi: m[5] ? +m[5] : 0, s: m[6] ? +m[6] : 0 };
}

const p2 = (n: number) => String(n).padStart(2, "0");
const localDate = (l: Local) => `${l.y}-${p2(l.mo)}-${p2(l.d)}`;
const localMinute = (l: Local) => `${localDate(l)}T${p2(l.h)}:${p2(l.mi)}`;
const localSecond = (l: Local) => `${localMinute(l)}:${p2(l.s)}`;

function dateOf(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  const l = toLocal(t);
  return l ? localDate(l) : null;
}

/** Sort key: local wall-clock time `YYYY-MM-DDTHH:MM:SS`; plain dates sort at midnight. */
function sortKey(s: unknown): string {
  const l = toLocal(s);
  return l ? localSecond(l) : "";
}

/** RFC 3339 with the America/Chicago offset in effect at that local time. */
function rfc3339Local(s: unknown): string | null {
  const l = toLocal(s);
  if (!l) return null;
  const asUtc = Date.UTC(l.y, l.mo - 1, l.d, l.h, l.mi, l.s);
  let off = 0;
  for (let i = 0; i < 3; i++) {
    const back = chicagoParts(asUtc - off * 60000);
    if (!back) return null;
    const shown = Date.UTC(back.y, back.mo - 1, back.d, back.h, back.mi, back.s);
    const next = Math.round((shown - (asUtc - off * 60000)) / 60000);
    if (next === off) break;
    off = next;
  }
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  return `${localSecond(l)}${sign}${p2(Math.floor(a / 60))}:${p2(a % 60)}`;
}

// ───────────────────────────── item selection ─────────────────────────────

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const ok = items.filter((it) => {
    if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
    if (!it.payload || typeof it.payload !== "object") return false;
    const d = dateOf(it.recorded);
    return d !== null && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of ok) {
    for (const id of Array.isArray(it.supersedes) ? it.supersedes : []) dead.add(String(id));
    for (const id of Array.isArray(it.retracts) ? it.retracts : []) dead.add(String(id));
  }
  // Supersession is transitive: every superseding item counts here, so each item it names is gone, and
  // chains (C → B → A) fall out because each link is listed by a counting item. A superseded item's own
  // `supersedes` still holds (the replacement restates it), so no further walk is needed.
  const seen = new Set<string>();
  const out: FolioItem[] = [];
  for (const it of ok) {
    if (dead.has(it.id) || seen.has(it.id)) continue;
    seen.add(it.id);
    out.push(it);
  }
  out.sort((a, b) => (sortKey(a.recorded) < sortKey(b.recorded) ? -1 : sortKey(a.recorded) > sortKey(b.recorded) ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return out;
}

type Entry = { item: FolioItem; key: string; row: any };

function entries(it: FolioItem): Entry[] {
  const out: Entry[] = [];
  for (const key of Object.keys(it.payload)) {
    const row = it.payload[key];
    if (row && typeof row === "object" && typeof row.type === "string") out.push({ item: it, key, row });
  }
  return out;
}

const ev = (e: Entry) => ({ item_id: e.item.id, entry_id: e.key });

function pushEv(list: Evidence, e: { item_id: string; entry_id?: string }) {
  if (!list.some((x) => x.item_id === e.item_id && x.entry_id === e.entry_id)) list.push(e);
}

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() !== "" ? v.trim() : undefined);
const num = (v: unknown): number | undefined => (typeof v === "number" && isFinite(v) ? v : undefined);

// ───────────────────────────── labs ─────────────────────────────

const LAB_MAP: Record<string, { analyte: Analyte; unit: string; from: Record<string, number> }> = {
  "LK-CREAT": { analyte: "creatinine", unit: "mg/dL", from: { "mg/dL": 1 } },
  "LK-EGFR09N": { analyte: "egfr", unit: "mL/min/1.73m2", from: { "mL/min/1.73m2": 1 } },
  "LK-EGFR21": { analyte: "egfr", unit: "mL/min/1.73m2", from: { "mL/min/1.73m2": 1 } },
  "LK-NA": { analyte: "sodium", unit: "mmol/L", from: { "mmol/L": 1 } },
  "LK-K": { analyte: "potassium", unit: "mmol/L", from: { "mmol/L": 1 } },
  "LK-GLU": { analyte: "glucose", unit: "mg/dL", from: { "mg/dL": 1 } },
  "LK-A1C": { analyte: "a1c", unit: "%", from: { "%": 1 } },
  "LK-UACR": { analyte: "uacr", unit: "mg/g", from: { "mg/g": 1 } },
  "LK-WBC": { analyte: "wbc", unit: "10*3/uL", from: { "K/uL": 1 } },
  "LK-HGB": { analyte: "hemoglobin", unit: "g/dL", from: { "g/dL": 1 } },
  "LK-PLT": { analyte: "platelets", unit: "10*3/uL", from: { "K/uL": 1 } },
  "LK-CHOL": { analyte: "cholesterol", unit: "mg/dL", from: { "mg/dL": 1 } },
  "LK-TRIG": { analyte: "triglycerides", unit: "mg/dL", from: { "mg/dL": 1 } },
  "LK-HDL": { analyte: "hdl", unit: "mg/dL", from: { "mg/dL": 1 } },
  "LK-LDLC": { analyte: "ldl", unit: "mg/dL", from: { "mg/dL": 1 } },
  // LK-EGFR09A (race coefficient applied) is deliberately absent: only the race-free variant is reported.
};

const STATUS_RANK: Record<string, number> = { P: 1, F: 2, A: 3, C: 4, X: 4 };

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
  const c = typeof comment === "string" ? comment.toLowerCase() : "";
  if (/ckd[- ]?epi[^.]*2021/.test(c)) return "ckd-epi-2021";
  if (/ckd[- ]?epi[^.]*2009/.test(c)) return "ckd-epi-2009";
  if (/\bmdrd\b/.test(c)) return "mdrd";
  if (code === "LK-EGFR21") return "ckd-epi-2021";
  if (code === "LK-EGFR09N" || code === "LK-EGFR09A") return "ckd-epi-2009";
  return "unknown";
}

function mapLabs(items: FolioItem[]): LabResultRow[] {
  type Copy = { e: Entry; collected: string; voided: boolean };
  const byResult = new Map<string, Copy[]>();
  for (const it of items) {
    const es = entries(it);
    const req = es.find((e) => e.row.type === "LAB_REQ");
    if (!req && !es.some((e) => e.row.type === "LAB_RESULT")) continue;
    const orders = new Map<string, any>();
    for (const e of es) if (e.row.type === "LAB_ORDER" && typeof e.row.ORDER_ID === "string") orders.set(e.row.ORDER_ID, e.row);
    const collected = (req && str(req.row.COLLECTED_AT)) || str(it.effective) || "";
    for (const e of es) {
      if (e.row.type !== "LAB_RESULT") continue;
      const id = str(e.row.RESULT_ID) ?? `${it.id}#${e.key}`;
      const ord = orders.get(e.row.ORDER_ID);
      const voided = !!ord && (ord.ORDER_STATUS === 9 || ord.ORDER_STATUS === "9" || ord.ORDER_STATUS === 5 || ord.ORDER_STATUS === "5");
      const list = byResult.get(id) ?? [];
      list.push({ e, collected, voided });
      byResult.set(id, list);
    }
  }

  const rows: { row: LabResultRow; key: string }[] = [];
  for (const [, copies] of byResult) {
    // Most advanced status wins; among equals, the later-recorded copy (items are sorted by recorded).
    let best = copies[0];
    for (const c of copies) {
      const r = STATUS_RANK[c.e.row.RESULT_STATUS] ?? 0;
      const rb = STATUS_RANK[best.e.row.RESULT_STATUS] ?? 0;
      if (r >= rb) best = c;
    }
    if (copies.some((c) => c.voided)) continue;
    const r = best.e.row;
    const st = r.RESULT_STATUS;
    if (st !== "P" && st !== "F" && st !== "A") continue;
    const code = String(r.TEST_CODE ?? "");
    const spec = LAB_MAP[code];
    if (!spec) continue;
    const factor = spec.from[String(r.UNIT_CODE)];
    if (factor === undefined) continue;
    const pv = parseValue(r.VALUE_TEXT);
    if (!pv) continue;
    const collected = rfc3339Local(best.collected);
    if (!collected) continue;
    const row: LabResultRow = {
      analyte: spec.analyte,
      value: Math.round(pv.value * factor * 1e6) / 1e6,
      unit: spec.unit,
      collected,
      status: st === "P" ? "preliminary" : "final",
      evidence: [],
    };
    if (pv.comparator) row.comparator = pv.comparator;
    if (spec.analyte === "egfr") row.egfr_equation = egfrEquation(code, r.COMMENT_TEXT);
    const loinc = str(r.LOINC);
    if (loinc) row.loinc = loinc;
    pushEv(row.evidence, ev(best.e));
    for (const c of copies) if (c !== best && (STATUS_RANK[c.e.row.RESULT_STATUS] ?? 0) <= 3) pushEv(row.evidence, ev(c.e));
    rows.push({ row, key: `${sortKey(collected)}|${spec.analyte}|${str(r.RESULT_ID) ?? ""}` });
  }
  rows.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  return rows.map((r) => r.row);
}

// ───────────────────────────── vitals ─────────────────────────────

function mapVitals(items: FolioItem[]): VitalRow[] {
  const out: { row: VitalRow; key: string }[] = [];
  for (const it of items) {
    const vit = entries(it).filter((e) => e.row.type === "VITAL" && num(e.row.VALUE_NUM) !== undefined);
    if (!vit.length) continue;
    // Group by contact (an item holds exactly one, but stay safe).
    const byVisit = new Map<string, Entry[]>();
    for (const e of vit) {
      const k = String(e.row.VISIT_ID ?? "");
      byVisit.set(k, [...(byVisit.get(k) ?? []), e]);
    }
    for (const [, vs] of byVisit) {
      const ordered = (code: string) =>
        vs.filter((e) => e.row.VITAL_CODE === code).sort((a, b) => {
          const ra = num(a.row.READING_NO) ?? 0, rb = num(b.row.READING_NO) ?? 0;
          if (ra !== rb) return ra - rb;
          const ka = sortKey(a.row.TAKEN_AT), kb = sortKey(b.row.TAKEN_AT);
          return ka < kb ? -1 : ka > kb ? 1 : 0;
        });
      const sys = ordered("BPS"), dia = ordered("BPD"), hr = ordered("HR"), wt = ordered("WT");
      // Pair systolic and diastolic by READING_NO.
      const readings = [...new Set([...sys, ...dia].map((e) => num(e.row.READING_NO) ?? 0))].sort((a, b) => a - b);
      const bp = readings.map((n) => ({
        s: sys.find((e) => (num(e.row.READING_NO) ?? 0) === n),
        d: dia.find((e) => (num(e.row.READING_NO) ?? 0) === n),
      }));
      const firstBp = bp[0];
      const repeatBp = bp[1];
      let timeSrc: unknown;
      if (firstBp) timeSrc = (firstBp.s ?? firstBp.d)!.row.TAKEN_AT;
      else {
        const all = [...vs].sort((a, b) => (sortKey(a.row.TAKEN_AT) < sortKey(b.row.TAKEN_AT) ? -1 : 1));
        timeSrc = all[0].row.TAKEN_AT;
      }
      const l = toLocal(timeSrc) ?? toLocal(it.effective);
      if (!l) continue;
      const row: VitalRow = { setting: "clinic", local_time: localMinute(l), evidence: [] };
      const used: Entry[] = [];
      if (firstBp?.s) { row.systolic_mmhg = firstBp.s.row.VALUE_NUM; used.push(firstBp.s); }
      if (firstBp?.d) { row.diastolic_mmhg = firstBp.d.row.VALUE_NUM; used.push(firstBp.d); }
      if (repeatBp?.s) { row.repeat_systolic_mmhg = repeatBp.s.row.VALUE_NUM; used.push(repeatBp.s); }
      if (repeatBp?.d) { row.repeat_diastolic_mmhg = repeatBp.d.row.VALUE_NUM; used.push(repeatBp.d); }
      if (hr[0]) { row.pulse_bpm = hr[0].row.VALUE_NUM; used.push(hr[0]); }
      if (wt[0]) {
        const u = String(wt[0].row.UNIT_CODE ?? "kg").toLowerCase();
        const v = wt[0].row.VALUE_NUM as number;
        const kg = u === "lb" || u === "lbs" ? v * 0.45359237 : u === "g" ? v / 1000 : v;
        row.weight_kg = Math.round(kg * 10) / 10;
        used.push(wt[0]);
      }
      if (!used.length) continue;
      for (const e of used) pushEv(row.evidence, ev(e));
      out.push({ row, key: row.local_time });
    }
  }
  out.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  return out.map((r) => r.row);
}

// ───────────────────────────── problems & allergies ─────────────────────────────

/** Codes that restage or recode one condition share a group. */
function dxGroup(icd: string): string {
  const c = icd.toUpperCase();
  if (/^N18/.test(c)) return "CKD";
  if (/^E11/.test(c)) return "DM2";
  if (/^E10/.test(c)) return "DM1";
  if (/^I1[0-2]/.test(c)) return "HTN";
  return c;
}

function stageFromCode(icd: string): ProblemRow["ckd_stage"] | undefined {
  const c = icd.toUpperCase();
  if (c === "N18.1") return "G1";
  if (c === "N18.2") return "G2";
  if (c === "N18.31") return "G3a";
  if (c === "N18.32") return "G3b";
  if (c === "N18.4") return "G4";
  if (c === "N18.5" || c === "N18.6") return "G5";
  return undefined;
}

const G_VALUES = ["G1", "G2", "G3a", "G3b", "G4", "G5"];
const A_VALUES = ["A1", "A2", "A3"];

function dxSensitivity(icd: string, text: string): Sensitivity[] | undefined {
  const c = icd.toUpperCase();
  const t = text.toLowerCase();
  const s = new Set<Sensitivity>();
  if (/^F1[0-9]/.test(c) || /\b(alcohol|opioid|cannabis|cocaine|stimulant) (use|abuse|dependence)/.test(t)) s.add("substance-use");
  else if (/^F/.test(c)) s.add("mental-health");
  if (/^(B2[0-4]|Z21|A5[0-9]|A6[0-4]|Z20\.6)/.test(c) || /\bhiv\b|syphilis|chlamyd|gonorr|herpes genital/.test(t)) s.add("hiv-sti");
  if (/^(O|Z3[0-9]|N97|Z31)/.test(c) || /pregnan|contracept|infertil/.test(t)) s.add("sexual-reproductive-health");
  if (/^Q/.test(c) || /\bgenetic\b|hereditary|brca/.test(t)) s.add("genetic");
  return s.size ? [...s] : undefined;
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/** Onset stated in the note's own words inside the span that points at this entry ("since 11/2010"). */
function narrativeOnset(narr: unknown, key: string): ProblemRow["onset"] | undefined {
  if (typeof narr !== "string") return undefined;
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<ref\\s+id="${esc}"\\s*>([\\s\\S]*?)</ref>`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(narr))) {
    const span = m[1];
    let x = /\b(?:since|diagnosed(?: in)?|onset)\s+(\d{1,2})\/(\d{1,2})\/(\d{4})\b/i.exec(span);
    if (x) return { value: `${x[3]}-${p2(+x[1])}-${p2(+x[2])}`, precision: "day" };
    x = /\b(?:since|diagnosed(?: in)?|onset)\s+(\d{4})-(\d{2})-(\d{2})\b/i.exec(span);
    if (x) return { value: `${x[1]}-${x[2]}-${x[3]}`, precision: "day" };
    x = /\b(?:since|diagnosed(?: in)?|onset)\s+(\d{1,2})\/(\d{4})\b/i.exec(span);
    if (x && +x[1] >= 1 && +x[1] <= 12) return { value: `${x[2]}-${p2(+x[1])}`, precision: "month" };
    x = /\b(?:since|diagnosed(?: in)?|onset)\s+(\d{4})-(\d{2})\b/i.exec(span);
    if (x) return { value: `${x[1]}-${x[2]}`, precision: "month" };
    x = /\b(?:since|diagnosed(?: in)?|onset)\s+([A-Za-z]{3})[a-z]*\.?\s+(\d{4})\b/i.exec(span);
    if (x && MONTHS[x[1].toLowerCase()]) return { value: `${x[2]}-${p2(MONTHS[x[1].toLowerCase()])}`, precision: "month" };
    x = /\b(?:since|diagnosed(?: in)?|onset)\s+(?:in\s+)?((?:19|20)\d{2})\b/i.exec(span);
    if (x) return { value: x[1], precision: "year" };
  }
  return undefined;
}

// Drug classes named in ICD-10-CM "adverse effect of …" codes, with member ingredients.
const DRUG_CLASSES: { re: RegExp; members: string[] }[] = [
  { re: /penicillin/i, members: ["amoxicillin", "ampicillin", "penicillin", "piperacillin", "dicloxacillin", "nafcillin"] },
  { re: /cephalosporin/i, members: ["cephalexin", "cefazolin", "ceftriaxone", "cefuroxime", "cefdinir", "cefepime"] },
  { re: /sulfonamide/i, members: ["sulfamethoxazole"] },
  { re: /angiotensin[- ]converting[- ]enzyme|ace inhibitor/i, members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril"] },
  { re: /angiotensin[- ]?(ii)?[- ]?receptor|\barb\b/i, members: ["losartan", "valsartan", "irbesartan", "olmesartan", "telmisartan", "candesartan"] },
  { re: /mineralocorticoid|aldosterone antagonist/i, members: ["spironolactone", "eplerenone", "finerenone"] },
  { re: /hmg|statin|antihyperlipidemic/i, members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin"] },
  { re: /sglt|sodium-glucose/i, members: ["empagliflozin", "dapagliflozin", "canagliflozin"] },
  { re: /loop diuretic|benzothiadiazine|thiazide/i, members: ["furosemide", "bumetanide", "torsemide", "hydrochlorothiazide", "chlorthalidone"] },
  { re: /insulin|oral hypoglycemic|antidiabetic/i, members: ["insulin", "metformin", "glipizide", "glyburide", "glimepiride", "semaglutide", "liraglutide", "dulaglutide"] },
  { re: /nonsteroidal|nsaid/i, members: ["ibuprofen", "naproxen", "diclofenac", "meloxicam", "celecoxib"] },
];

const HYPERSENS_RE = /urticaria|angioedema|anaphyla|rash|dermatitis due to drug|drug eruption|hypersensitivity|allergic|stevens|bronchospasm/i;
const SERIOUS_RE = /liver|hepat|pancreatitis|acute kidney|nephritis|agranulocytosis|neutropenia|thrombocytopenia|rhabdo|lactic acidosis|ketoacidosis/i;

function isAdverseEffectCode(icd: string): boolean {
  return /^T(3[6-9]|4[0-9]|50)\.[0-9A-Z]{2}5/i.test(icd);
}

// ───────────────────────────── medications: names ─────────────────────────────

const BRANDS: Record<string, string> = {
  kerendia: "finerenone", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide",
  mounjaro: "tirzepatide", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", cozaar: "losartan",
  diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan", zestril: "lisinopril",
  prinivil: "lisinopril", norvasc: "amlodipine", lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", levemir: "insulin detemir",
  humalog: "insulin lispro", novolog: "insulin aspart", glucophage: "metformin", aldactone: "spironolactone",
  inspra: "eplerenone", renvela: "sevelamer", renagel: "sevelamer", phoslo: "calcium acetate", velphoro: "sucroferric oxyhydroxide",
  auryxia: "ferric citrate", fosrenol: "lanthanum", sensipar: "cinacalcet", veltassa: "patiromer", lokelma: "sodium zirconium cyclosilicate",
  kayexalate: "sodium polystyrene sulfonate", epogen: "epoetin alfa", procrit: "epoetin alfa", retacrit: "epoetin alfa",
  aranesp: "darbepoetin alfa", zemplar: "paricalcitol", hectorol: "doxercalciferol", rocaltrol: "calcitriol",
  coreg: "carvedilol", toprol: "metoprolol", lopressor: "metoprolol", catapres: "clonidine", apresoline: "hydralazine",
  entresto: "sacubitril/valsartan", seroquel: "quetiapine", suboxone: "buprenorphine/naloxone", subutex: "buprenorphine",
  zyprexa: "olanzapine", zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine", wellbutrin: "bupropion",
};

const SALTS = new Set([
  "hydrochloride", "hcl", "dihydrochloride", "potassium", "sodium", "besylate", "maleate", "succinate", "tartrate",
  "mesylate", "carbonate", "calcium", "magnesium", "fumarate", "hyclate", "monohydrate", "trihydrate", "dihydrate",
  "hydrobromide", "bromide", "citrate", "phosphate", "sulfate", "acetate", "medoxomil", "dipropionate", "propionate",
  "er", "xr", "sr", "xl", "cr", "dr", "la", "ec", "extended", "release", "delayed",
]);
const KEEP_WHOLE = new Set([
  "sodium bicarbonate", "potassium chloride", "calcium acetate", "calcium carbonate", "ferrous sulfate",
  "magnesium oxide", "sodium chloride", "ferric citrate", "potassium citrate", "sodium citrate",
]);
const FORM_RE = /^(tablet|tablets|tab|tabs|capsule|capsules|cap|caps|injection|solution|suspension|pen|pen-injector|vial|cream|ointment|patch|inhaler|syrup|oral|chewable|powder|packet|ml|mg|mcg|unit|units|g|kit|subcutaneous|prefilled|syringe|film|dr|er|xr)$/i;

function ingredientsOf(drugName: string): string[] {
  let n = drugName.toLowerCase().replace(/\(.*?\)/g, " ").replace(/®|™/g, "");
  // Cut at the first token that carries a number (strength) or names a form.
  const toks = n.split(/\s+/).filter(Boolean);
  const kept: string[] = [];
  for (const t of toks) {
    if (/\d/.test(t) || FORM_RE.test(t)) break;
    kept.push(t);
  }
  n = kept.join(" ").trim();
  if (!n) return [];
  const parts = n.split(/\s*(?:\/|\+|\s-\s|\band\b|-(?=[a-z]{4,}))\s*/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  for (const raw of parts) {
    let p = raw;
    const words = p.split(" ");
    if (words.length === 1 && BRANDS[words[0]]) {
      for (const b of BRANDS[words[0]].split("/")) out.push(b);
      continue;
    }
    if (BRANDS[words[0]]) { for (const b of BRANDS[words[0]].split("/")) out.push(b); continue; }
    if (!KEEP_WHOLE.has(p)) {
      const w = [words[0], ...words.slice(1).filter((x) => !SALTS.has(x))];
      p = w.join(" ");
    }
    out.push(p);
  }
  return [...new Set(out)];
}

const SENSITIVE_DRUGS: { re: RegExp; cat: Sensitivity }[] = [
  { re: /buprenorphine|methadone|naltrexone|naloxone|disulfiram|acamprosate|varenicline/, cat: "substance-use" },
  { re: /quetiapine|olanzapine|risperidone|aripiprazole|haloperidol|lithium|lamotrigine|valproate|divalproex|sertraline|fluoxetine|escitalopram|citalopram|paroxetine|venlafaxine|duloxetine|bupropion|mirtazapine|trazodone|clozapine|ziprasidone|lurasidone/, cat: "mental-health" },
  { re: /tenofovir|emtricitabine|dolutegravir|bictegravir|efavirenz|raltegravir|darunavir|ritonavir|abacavir|lamivudine|zidovudine|rilpivirine|cabotegravir/, cat: "hiv-sti" },
  { re: /estradiol|ethinyl|norethindrone|levonorgestrel|medroxyprogesterone|drospirenone|etonogestrel|clomiphene|sildenafil|tadalafil/, cat: "sexual-reproductive-health" },
];

function drugSensitivity(names: string[]): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  for (const n of names) for (const d of SENSITIVE_DRUGS) if (d.re.test(n)) s.add(d.cat);
  return s.size ? [...s] : undefined;
}

// ───────────────────────────── medications ─────────────────────────────

type RxState = { order: Entry; hist: Entry[] };

function collectRx(items: FolioItem[]): Map<string, RxState> {
  const rx = new Map<string, RxState>();
  const hists: Entry[] = [];
  for (const it of items) {
    for (const e of entries(it)) {
      if (e.row.type === "MED_ORDER" && typeof e.row.RX_ID === "string") {
        // Items are in recorded order: a later restatement of the same RX_ID replaces the earlier copy.
        const prev = rx.get(e.row.RX_ID);
        rx.set(e.row.RX_ID, { order: e, hist: prev?.hist ?? [] });
      } else if (e.row.type === "MED_STATUS_HIST" && typeof e.row.RX_ID === "string") {
        hists.push(e);
      }
    }
  }
  const seenHist = new Set<string>();
  for (const h of hists) {
    const st = rx.get(h.row.RX_ID);
    if (!st) continue;
    const hid = str(h.row.HIST_ID);
    if (hid) {
      if (seenHist.has(hid)) {
        // Restated copy: keep the later one.
        st.hist = st.hist.filter((x) => x.row.HIST_ID !== hid);
      }
      seenHist.add(hid);
    }
    st.hist.push(h);
  }
  for (const [, st] of rx) {
    st.hist.sort((a, b) => {
      const ka = sortKey(a.row.CHANGED_AT) || sortKey(a.item.effective);
      const kb = sortKey(b.row.CHANGED_AT) || sortKey(b.item.effective);
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });
  }
  return rx;
}

function currentStatus(st: RxState): { code: number; last?: Entry } {
  const last = st.hist.length ? st.hist[st.hist.length - 1] : undefined;
  const code = Number(last ? last.row.NEW_STATUS : st.order.row.MED_STATUS);
  return { code, last };
}

function mapMedications(items: FolioItem[]): MedicationRow[] {
  const rx = collectRx(items);
  type Cand = { row: MedicationRow; eventKey: string; ingredient: string };
  const cands: Cand[] = [];
  for (const [, st] of rx) {
    const o = st.order.row;
    if (Number(o.MED_STATUS) === 9) continue;
    if (st.hist.some((h) => Number(h.row.NEW_STATUS) === 9)) {
      // Entered in error: the prescription never existed.
      const { code } = currentStatus(st);
      if (code === 9) continue;
    }
    if (String(o.ROUTE ?? "").toUpperCase() === "IV") continue; // clinic-administered infusion, not a home medicine
    const { code, last } = currentStatus(st);
    if (code === 9) continue;
    const status: MedicationRow["status"] = code === 1 ? "active" : code === 2 ? "stopped" : code === 3 ? "held" : "unknown";
    const drugName = str(o.DRUG_NAME) ?? "";
    if (!drugName) continue;
    const ings = ingredientsOf(drugName);

    let since: string | undefined;
    if (last) since = dateOf(last.row.CHANGED_AT) ?? dateOf(last.item.effective) ?? undefined;
    else if (status === "active") since = dateOf(o.START_DATE) ?? undefined;

    const base: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [] };
    if (since) base.status_since = since;
    const qty = num(o.DOSE_QTY);
    const unitMap: Record<string, "mg" | "mcg" | "units" | "mL"> = { mg: "mg", mcg: "mcg", unit: "units", units: "units", ml: "mL" };
    const unit = unitMap[String(o.DOSE_UNIT ?? "").toLowerCase()];
    if (qty !== undefined && unit && ings.length <= 1) base.dose = { value: qty, unit };
    const freq = String(o.FREQ_CODE ?? "").toUpperCase();
    if (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(freq)) base.frequency = freq as MedicationRow["frequency"];
    else if (freq) base.frequency = "other";
    if (last) {
      const reason = str(last.row.COMMENT_TEXT);
      if (reason) base.status_reason_text = reason;
      if (status === "stopped") {
        const rc = String(last.row.REASON_CODE ?? "");
        const map: Record<string, MedicationRow["stop_reason"]> = { ADR: "adverse_reaction", PT: "patient_choice", LAB: "other", PROC: "other", OTH: "other" };
        if (map[rc]) base.stop_reason = map[rc];
      }
    }
    pushEv(base.evidence, ev(st.order));
    if (last) pushEv(base.evidence, ev(last));
    const sens = drugSensitivity([drugName.toLowerCase(), ...ings]);
    if (sens) base.sensitivity = sens;

    const eventKey = [sortKey(o.START_DATE), ...st.hist.map((h) => sortKey(h.row.CHANGED_AT))].sort().pop() ?? "";
    const keyFor = `${eventKey}|${sortKey(st.order.item.recorded)}|${o.RX_ID}`;
    if (!ings.length) {
      cands.push({ row: base, eventKey: keyFor, ingredient: `#${o.LV_DRUG_ID ?? o.RX_ID}` });
    } else {
      for (const ing of ings) {
        const row: MedicationRow = { ...base, evidence: [...base.evidence], ingredient: ing };
        cands.push({ row, eventKey: keyFor, ingredient: ing });
      }
    }
  }
  const best = new Map<string, Cand>();
  for (const c of cands) {
    const prev = best.get(c.ingredient);
    if (!prev || c.eventKey > prev.eventKey) best.set(c.ingredient, c);
  }
  return [...best.values()]
    .sort((a, b) => (a.ingredient < b.ingredient ? -1 : a.ingredient > b.ingredient ? 1 : 0))
    .map((c) => c.row);
}

// ───────────────────────────── problems ─────────────────────────────

function mapProblemsAndAllergies(items: FolioItem[], meds: MedicationRow[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  type Dx = { e: Entry; visitKey: string; visit?: Entry };
  const groups = new Map<string, Dx[]>();
  type VisitInfo = { e: Entry; key: string; dxCkd?: Entry };
  const visits: VisitInfo[] = [];
  const allergyDx: { e: Entry; visitKey: string; others: Entry[]; meds: Entry[] }[] = [];

  for (const it of items) {
    const es = entries(it);
    const visit = es.find((e) => e.row.type === "CLINIC_VISIT");
    const visitKey = sortKey(visit?.row.VISIT_AT) || sortKey(it.effective) || sortKey(it.recorded);
    const dxs = es.filter((e) => e.row.type === "VISIT_DX" && str(e.row.ICD10CM));
    if (visit) visits.push({ e: visit, key: visitKey, dxCkd: dxs.find((d) => /^N18/i.test(d.row.ICD10CM) && d.row.DX_STATUS !== "R") });
    for (const d of dxs) {
      const icd = String(d.row.ICD10CM).trim();
      if (isAdverseEffectCode(icd)) {
        if (d.row.DX_STATUS === "A" || d.row.DX_STATUS === "H") {
          allergyDx.push({
            e: d, visitKey,
            others: dxs.filter((x) => x !== d && !isAdverseEffectCode(String(x.row.ICD10CM))),
            meds: es.filter((x) => x.row.type === "MED_ORDER" || x.row.type === "MED_STATUS_HIST"),
          });
        }
        continue;
      }
      const g = dxGroup(icd);
      groups.set(g, [...(groups.get(g) ?? []), { e: d, visitKey, visit }]);
    }
  }
  visits.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));

  const problems: { row: ProblemRow; key: string }[] = [];
  for (const [g, list] of groups) {
    list.sort((a, b) => (a.visitKey < b.visitKey ? -1 : a.visitKey > b.visitKey ? 1 : (num(a.e.row.DX_RANK) ?? 0) - (num(b.e.row.DX_RANK) ?? 0)));
    const latest = list[list.length - 1];
    if (latest.e.row.DX_STATUS === "R") continue; // ruled out
    const confirmed = list.filter((d) => d.e.row.DX_STATUS === "A" || d.e.row.DX_STATUS === "H");
    if (!confirmed.length) continue; // only ever provisional
    const cur = confirmed[confirmed.length - 1];
    // Wording and code from the latest entry (also when it is a provisional restatement of a confirmed one).
    const wording = latest;
    const icd = String(wording.e.row.ICD10CM).trim();
    const row: ProblemRow = {
      condition: str(wording.e.row.DX_TEXT) ?? icd,
      icd10cm: icd,
      status: cur.e.row.DX_STATUS === "H" ? "resolved" : "active",
      evidence: [],
    };
    // Onset: the latest note that states one for this condition.
    for (const d of list) {
      const o = narrativeOnset(d.e.item.narrative, d.e.key);
      if (o) row.onset = o;
    }
    if (g === "CKD") {
      let stage: { v: string; e: Entry } | undefined;
      let alb: { v: string; e: Entry } | undefined;
      for (const v of visits) {
        const gv = str(v.e.row.CKD_G);
        if (gv && G_VALUES.includes(gv)) stage = { v: gv, e: v.e };
        else if (v.dxCkd) {
          const sc = stageFromCode(String(v.dxCkd.row.ICD10CM));
          if (sc) stage = { v: sc, e: v.dxCkd };
        }
        const av = str(v.e.row.CKD_A);
        if (av && A_VALUES.includes(av)) alb = { v: av, e: v.e };
      }
      if (stage) row.ckd_stage = stage.v as ProblemRow["ckd_stage"];
      if (alb) row.albuminuria = alb.v as ProblemRow["albuminuria"];
      pushEv(row.evidence, ev(wording.e));
      if (cur !== wording) pushEv(row.evidence, ev(cur.e));
      if (stage) pushEv(row.evidence, ev(stage.e));
      if (alb) pushEv(row.evidence, ev(alb.e));
    } else {
      pushEv(row.evidence, ev(wording.e));
      if (cur !== wording) pushEv(row.evidence, ev(cur.e));
    }
    const sens = dxSensitivity(icd, row.condition);
    if (sens) row.sensitivity = sens;
    problems.push({ row, key: `${String(num(list[0].e.row.DX_RANK) ?? 99).padStart(3, "0")}|${icd}` });
  }
  problems.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));

  // Allergies from "adverse effect of <drug/class>" codes.
  const allergies = new Map<string, AllergyIntoleranceRow & { _k: string }>();
  for (const a of allergyDx) {
    const text = str(a.e.row.DX_TEXT) ?? String(a.e.row.ICD10CM);
    const m = /adverse effect of\s+(.+?)(?:,\s*(?:initial|subsequent|sequela).*)?$/i.exec(text);
    const named = (m ? m[1] : text).trim();
    let substance = named;
    const cls = DRUG_CLASSES.find((c) => c.re.test(named));
    // Same-item medicines (orders and the orders whose status changed here).
    const itemDrugNames: string[] = [];
    for (const x of a.meds) {
      if (x.row.type === "MED_ORDER" && str(x.row.DRUG_NAME)) itemDrugNames.push(String(x.row.DRUG_NAME));
      if (x.row.type === "MED_STATUS_HIST") {
        const mo = items.flatMap(entries).find((y) => y.row.type === "MED_ORDER" && y.row.RX_ID === x.row.RX_ID);
        if (mo && str(mo.row.DRUG_NAME)) itemDrugNames.push(String(mo.row.DRUG_NAME));
      }
    }
    const itemIngs = [...new Set(itemDrugNames.flatMap(ingredientsOf))];
    if (cls) {
      const hits = itemIngs.filter((i) => cls.members.some((mbr) => i === mbr || i.startsWith(mbr + " ") || i.includes(mbr)));
      if (hits.length === 1) substance = hits[0];
    } else {
      const ing = ingredientsOf(named);
      if (ing.length === 1 && /^[a-z]+$/.test(ing[0])) substance = ing[0];
    }
    const reactions = a.others.map((x) => String(x.row.DX_TEXT ?? "")).filter(Boolean);
    const relevant = reactions.filter((r) => HYPERSENS_RE.test(r) || SERIOUS_RE.test(r));
    const row: AllergyIntoleranceRow & { _k: string } = {
      substance,
      reaction_type: relevant.some((r) => HYPERSENS_RE.test(r)) ? "hypersensitivity" : relevant.some((r) => SERIOUS_RE.test(r)) ? "serious_adverse_event" : "side_effect",
      mechanism: "unknown",
      criticality: relevant.some((r) => /anaphyla|angioedema|stevens/i.test(r)) ? "high" : "unknown",
      evidence: [ev(a.e)],
      _k: a.visitKey,
    };
    if (relevant.length) row.reaction = relevant.join("; ");
    const prev = allergies.get(substance.toLowerCase());
    if (!prev || prev._k <= row._k) allergies.set(substance.toLowerCase(), row);
  }
  void meds;
  return {
    problems: problems.map((p) => p.row),
    allergies: [...allergies.values()]
      .sort((a, b) => (a.substance < b.substance ? -1 : 1))
      .map(({ _k, ...r }) => r),
  };
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return empty;
  const counting = countingItems(items, asOf);
  const safe = <T,>(f: () => T[]): T[] => {
    try {
      return f();
    } catch {
      return [];
    }
  };
  const medications = safe(() => mapMedications(counting));
  let pa: { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } = { problems: [], allergies: [] };
  try {
    pa = mapProblemsAndAllergies(counting, medications);
  } catch {
    /* skip */
  }
  return {
    medications,
    problems: pa.problems,
    allergies: pa.allergies,
    labs: safe(() => mapLabs(counting)),
    vitals: safe(() => mapVitals(counting)),
  };
}
