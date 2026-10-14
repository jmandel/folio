import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, LabResultRow, VitalRow, Evidence, Analyte, Sensitivity,
} from "../in/views/views";

const TZ = "America/Chicago";
const dtf = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
});

function wallOf(ms: number): number {
  const p: Record<string, number> = {};
  for (const x of dtf.formatToParts(new Date(ms))) if (x.type !== "literal") p[x.type] = Number(x.value);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
}
function offsetMin(ms: number): number {
  return Math.round((wallOf(Math.floor(ms / 1000) * 1000) - Math.floor(ms / 1000) * 1000) / 60000);
}
const HAS_OFF = /(Z|[+-]\d{2}:?\d{2})$/;
function parseWall(s: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?/.exec(s);
  if (!m) return null;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
}
/** Instant (ms) of a timestamp; offset-less values are Chicago wall-clock. */
function instant(s: string | undefined): number | null {
  if (!s) return null;
  if (HAS_OFF.test(s) && s.includes("T")) {
    const t = Date.parse(s);
    return isNaN(t) ? null : t;
  }
  const w = parseWall(s);
  if (w === null) return null;
  for (const h of [5, 6]) {
    const u = w + h * 3600000;
    if (offsetMin(u) === -h * 60) return u;
  }
  return w + 6 * 3600000;
}
function pad(n: number): string { return (n < 10 ? "0" : "") + n; }
function fmtOff(min: number): string {
  const a = Math.abs(min);
  return (min < 0 ? "-" : "+") + pad(Math.floor(a / 60)) + ":" + pad(a % 60);
}
/** RFC 3339 with the Chicago offset. */
function toRfc(s: string): string | null {
  if (HAS_OFF.test(s) && s.includes("T")) return s;
  const t = instant(s);
  if (t === null) return null;
  const w = new Date(wallOf(t)).toISOString();
  return w.slice(0, 19) + fmtOff(offsetMin(t));
}
/** Local wall clock YYYY-MM-DDTHH:MM. */
function toLocalMinute(s: string): string | null {
  if (!HAS_OFF.test(s) || !s.includes("T")) {
    const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(s);
    return m ? m[1] + "T" + m[2] : null;
  }
  const t = Date.parse(s);
  if (isNaN(t)) return null;
  return new Date(wallOf(t)).toISOString().slice(0, 16);
}
function localDate(s: string | undefined): string | null {
  if (!s) return null;
  if (!s.includes("T")) return s.slice(0, 10);
  const l = toLocalMinute(s);
  return l ? l.slice(0, 10) : null;
}

interface Entry { item: FolioItem; key: string; row: any }

function entriesOf(item: FolioItem): Entry[] {
  const out: Entry[] = [];
  const p = item.payload;
  if (!p || typeof p !== "object") return out;
  for (const key of Object.keys(p)) {
    const row = (p as any)[key];
    if (row && typeof row === "object" && typeof row.type === "string") out.push({ item, key, row });
  }
  return out;
}

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const d = parseWall(asOf + "T00:00:00");
  if (d === null) return [];
  const next = new Date(d + 86400000).toISOString().slice(0, 10);
  const cutoff = instant(next + "T00:00:00") as number;
  const ok = items.filter((i) => {
    const t = instant(i.recorded);
    return t !== null && t < cutoff;
  });
  const retracted = new Set<string>();
  for (const i of ok) for (const r of i.retracts || []) retracted.add(r);
  const active = ok.filter((i) => !retracted.has(i.id));
  const byId = new Map<string, FolioItem>();
  for (const i of items) byId.set(i.id, i);
  const replaced = new Set<string>();
  const stack: string[] = [];
  for (const i of active) for (const s of i.supersedes || []) stack.push(s);
  while (stack.length) {
    const id = stack.pop() as string;
    if (replaced.has(id)) continue;
    replaced.add(id);
    const it = byId.get(id);
    if (it) for (const s of it.supersedes || []) stack.push(s);
  }
  return active.filter((i) => !replaced.has(i.id));
}

const ANALYTE: Record<string, Analyte> = {
  "LK-CREAT": "creatinine", "LK-EGFR09N": "egfr", "LK-EGFR21": "egfr", "LK-NA": "sodium", "LK-K": "potassium",
  "LK-GLU": "glucose", "LK-A1C": "a1c", "LK-UACR": "uacr", "LK-WBC": "wbc", "LK-HGB": "hemoglobin",
  "LK-PLT": "platelets", "LK-CHOL": "cholesterol", "LK-TRIG": "triglycerides", "LK-HDL": "hdl", "LK-LDLC": "ldl",
};
const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function buildLabs(entries: Entry[]): LabResultRow[] {
  const reqs = new Map<FolioItem, any>();
  const badOrders = new Set<string>();
  for (const e of entries) {
    if (e.row.type === "LAB_REQ") reqs.set(e.item, e.row);
    if (e.row.type === "LAB_ORDER" && (e.row.ORDER_STATUS === 9 || e.row.ORDER_STATUS === 5)) {
      badOrders.add(e.item.id + "|" + e.row.ORDER_ID);
    }
  }
  const rank = (s: string) => (s === "P" ? 1 : 2);
  const best = new Map<string, { e: Entry; row: LabResultRow; copies: Evidence }>();
  for (const e of entries) {
    const r = e.row;
    if (r.type !== "LAB_RESULT") continue;
    if (r.RESULT_STATUS === "C" || r.RESULT_STATUS === "X") continue;
    if (!["P", "F", "A"].includes(r.RESULT_STATUS)) continue;
    if (badOrders.has(e.item.id + "|" + r.ORDER_ID)) continue;
    const analyte = ANALYTE[r.TEST_CODE];
    if (!analyte) continue;
    const m = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(r.VALUE_TEXT ?? ""));
    if (!m) continue;
    const req = reqs.get(e.item);
    const collected = req ? toRfc(req.COLLECTED_AT) : null;
    if (!collected) continue;
    const row: LabResultRow = {
      analyte, value: Number(m[2]), unit: UNIT[analyte], collected,
      status: r.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: [{ item_id: e.item.id, entry_id: e.key }],
    };
    if (m[1]) row.comparator = m[1] as any;
    if (analyte === "egfr") {
      const c = String(r.COMMENT_TEXT || "") + " " + String(r.TEST_NAME || "");
      row.egfr_equation = /2021/.test(c) && /CKD-EPI/i.test(c) ? "ckd-epi-2021"
        : /CKD-EPI/i.test(c) && /2009/.test(c) ? "ckd-epi-2009"
        : /MDRD/i.test(c) ? "mdrd"
        : r.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : r.TEST_CODE === "LK-EGFR09N" ? "ckd-epi-2009" : "unknown";
    }
    if (r.LOINC) row.loinc = String(r.LOINC);
    const id = String(r.RESULT_ID ?? e.item.id + "|" + e.key);
    const prev = best.get(id);
    if (!prev) best.set(id, { e, row, copies: [...row.evidence] });
    else {
      prev.copies.push(...row.evidence);
      if (rank(r.RESULT_STATUS) >= rank(prev.e.row.RESULT_STATUS)) { prev.e = e; prev.row = row; }
    }
  }
  const out: LabResultRow[] = [];
  for (const b of best.values()) { b.row.evidence = b.copies; out.push(b.row); }
  out.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : 0));
  return out;
}

function buildVitals(entries: Entry[]): VitalRow[] {
  const groups = new Map<string, Entry[]>();
  for (const e of entries) {
    if (e.row.type !== "VITAL") continue;
    const k = e.item.id + "|" + e.row.VISIT_ID;
    if (!groups.has(k)) groups.set(k, []);
    (groups.get(k) as Entry[]).push(e);
  }
  const out: VitalRow[] = [];
  for (const g of groups.values()) {
    const num = (e: Entry) => (typeof e.row.VALUE_NUM === "number" ? (e.row.VALUE_NUM as number) : null);
    const t = (e: Entry) => instant(e.row.TAKEN_AT) ?? Infinity;
    const pick = (code: string, n: number) =>
      g.filter((e) => e.row.VITAL_CODE === code && e.row.READING_NO === n && num(e) !== null)
        .sort((a, b) => t(a) - t(b))[0];
    const repeat = (code: string) => {
      const c = g.filter((e) => e.row.VITAL_CODE === code && (e.row.READING_NO ?? 1) > 1 && num(e) !== null)
        .sort((a, b) => a.row.READING_NO - b.row.READING_NO);
      return c[0];
    };
    const bps = pick("BPS", 1), bpd = pick("BPD", 1), hr = pick("HR", 1), wt = pick("WT", 1);
    const rs = repeat("BPS"), rd = repeat("BPD");
    const used = [bps, bpd, rs, rd, hr, wt].filter((x): x is Entry => !!x);
    if (!used.length) continue;
    const firstBp = [bps, bpd].filter((x): x is Entry => !!x).sort((a, b) => t(a) - t(b))[0];
    const first = firstBp || used.slice().sort((a, b) => t(a) - t(b))[0];
    const lt = toLocalMinute(first.row.TAKEN_AT);
    if (!lt) continue;
    const row: VitalRow = { setting: "clinic", local_time: lt, evidence: used.map((e) => ({ item_id: e.item.id, entry_id: e.key })) };
    if (bps) row.systolic_mmhg = num(bps) as number;
    if (bpd) row.diastolic_mmhg = num(bpd) as number;
    if (rs) row.repeat_systolic_mmhg = num(rs) as number;
    if (rd) row.repeat_diastolic_mmhg = num(rd) as number;
    if (hr) row.pulse_bpm = num(hr) as number;
    if (wt) row.weight_kg = Math.round((num(wt) as number) * 10) / 10;
    out.push(row);
  }
  out.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return out;
}

function dxGroup(icd: string): string {
  const c = icd.toUpperCase();
  if (c.startsWith("N18")) return "CKD";
  return c.slice(0, 3);
}
function ckdStageFromCode(icd: string): ProblemRow["ckd_stage"] | undefined {
  const c = icd.toUpperCase();
  if (c === "N18.1") return "G1";
  if (c === "N18.2") return "G2";
  if (c === "N18.31") return "G3a";
  if (c === "N18.32") return "G3b";
  if (c === "N18.4") return "G4";
  if (c === "N18.5") return "G5";
  return undefined;
}
function sensitivityOfDx(icd: string): Sensitivity[] | undefined {
  const c = icd.toUpperCase();
  if (/^F1\d/.test(c)) return ["substance-use"];
  if (/^F/.test(c)) return ["mental-health"];
  if (/^(B20|Z21|O98\.7|A5\d|A6[0-4]|A74\.|B97\.7)/.test(c)) return ["hiv-sti"];
  if (/^(Z3\d|O\d\d|N97|N46)/.test(c)) return ["sexual-reproductive-health"];
  return undefined;
}
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
function onsetFromNarrative(item: FolioItem, key: string): ProblemRow["onset"] | undefined {
  const re = new RegExp('<ref id="' + key.replace(/[^\w-]/g, "") + '">([^<]*)</ref>');
  const m = re.exec(item.narrative || "");
  if (!m) return undefined;
  const t = m[1];
  let x = /since\s+(\d{1,2})\/(\d{4})/i.exec(t);
  if (x) return { value: x[2] + "-" + pad(+x[1]), precision: "month" };
  x = /since\s+([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/i.exec(t);
  if (x && MONTHS.indexOf(x[1].toLowerCase()) >= 0) return { value: x[2] + "-" + pad(MONTHS.indexOf(x[1].toLowerCase()) + 1), precision: "month" };
  x = /since\s+(\d{4})\b/i.exec(t);
  if (x) return { value: x[1], precision: "year" };
  return undefined;
}

function buildProblems(entries: Entry[]): ProblemRow[] {
  const visits = new Map<string, { e: Entry; at: number }>();
  for (const e of entries) {
    if (e.row.type === "CLINIC_VISIT") visits.set(e.item.id + "|" + e.row.VISIT_ID, { e, at: instant(e.row.VISIT_AT) ?? 0 });
  }
  interface Dx { e: Entry; at: number; v?: Entry }
  const dxs: Dx[] = [];
  for (const e of entries) {
    if (e.row.type !== "VISIT_DX" || !e.row.ICD10CM) continue;
    const v = visits.get(e.item.id + "|" + e.row.VISIT_ID);
    dxs.push({ e, at: v ? v.at : instant(e.item.effective) ?? 0, v: v?.e });
  }
  dxs.sort((a, b) => a.at - b.at || (b.e.row.DX_RANK ?? 0) - (a.e.row.DX_RANK ?? 0));
  const groups = new Map<string, Dx[]>();
  for (const d of dxs) {
    const k = dxGroup(String(d.e.row.ICD10CM));
    if (!groups.has(k)) groups.set(k, []);
    (groups.get(k) as Dx[]).push(d);
  }
  const out: ProblemRow[] = [];
  for (const [gk, list] of groups) {
    const decisive = list.filter((d) => d.e.row.DX_STATUS !== "P");
    if (!decisive.length) continue;
    const last = decisive[decisive.length - 1];
    const st = last.e.row.DX_STATUS;
    if (st !== "A" && st !== "H") continue;
    const row: ProblemRow = {
      condition: String(last.e.row.DX_TEXT || last.e.row.ICD10CM),
      icd10cm: String(last.e.row.ICD10CM),
      status: st === "A" ? "active" : "resolved",
      evidence: [{ item_id: last.e.item.id, entry_id: last.e.key }],
    };
    for (const d of list) {
      const o = onsetFromNarrative(d.e.item, d.e.key);
      if (o) { row.onset = o; break; }
    }
    if (gk === "CKD") {
      let g: ProblemRow["ckd_stage"] | undefined, a: ProblemRow["albuminuria"] | undefined;
      const seen = new Set<string>();
      for (const d of list) {
        const vk = d.e.item.id + "|" + d.e.row.VISIT_ID;
        if (seen.has(vk)) continue;
        seen.add(vk);
        const vg = d.v?.row.CKD_G || ckdStageFromCode(String(d.e.row.ICD10CM));
        if (vg) g = vg;
        if (d.v?.row.CKD_A) a = d.v.row.CKD_A;
      }
      // visits without a CKD diagnosis can still carry the category
      const lastCkdAt = last.at;
      for (const v of visits.values()) {
        if (v.at > lastCkdAt) {
          if (v.e.row.CKD_G) g = v.e.row.CKD_G;
          if (v.e.row.CKD_A) a = v.e.row.CKD_A;
        }
      }
      if (g) row.ckd_stage = g;
      if (a) row.albuminuria = a;
    }
    const s = sensitivityOfDx(String(last.e.row.ICD10CM));
    if (s) row.sensitivity = s;
    out.push(row);
  }
  out.sort((a, b) => (a.condition < b.condition ? -1 : a.condition > b.condition ? 1 : 0));
  return out;
}

const SALTS = new Set([
  "hydrochloride", "hcl", "besylate", "maleate", "succinate", "tartrate", "mesylate", "sulfate", "phosphate",
  "acetate", "citrate", "fumarate", "calcium", "hydrobromide", "bromide", "tablet", "tablets", "capsule",
  "capsules", "injection", "solution", "pen", "extended-release", "er", "xr", "sr", "oral", "film-coated",
  "delayed-release", "inhaler", "suspension",
]);
function ingredientOf(name: string): string | undefined {
  const out: string[] = [];
  for (const w of name.toLowerCase().replace(/\(.*?\)/g, " ").split(/\s+/)) {
    if (!w) continue;
    if (/^\d/.test(w)) break;
    out.push(w);
  }
  while (out.length > 1 && SALTS.has(out[out.length - 1])) out.pop();
  const s = out.join(" ").trim();
  return s || undefined;
}
const MENTAL = /quetiapine|olanzapine|risperidone|aripiprazole|lithium|sertraline|fluoxetine|citalopram|escitalopram|bupropion|venlafaxine|lamotrigine|haloperidol|paroxetine|mirtazapine|trazodone/;
const SUBST = /buprenorphine|naloxone|naltrexone|methadone|disulfiram|acamprosate/;

function buildMeds(entries: Entry[]): MedicationRow[] {
  const orders = new Map<string, Entry>();
  for (const e of entries) if (e.row.type === "MED_ORDER" && e.row.RX_ID) {
    const p = orders.get(e.row.RX_ID);
    if (!p || (instant(e.item.recorded) ?? 0) >= (instant(p.item.recorded) ?? 0)) orders.set(e.row.RX_ID, e);
  }
  const hists = new Map<string, Entry[]>();
  for (const e of entries) if (e.row.type === "MED_STATUS_HIST" && e.row.RX_ID) {
    if (!hists.has(e.row.RX_ID)) hists.set(e.row.RX_ID, []);
    (hists.get(e.row.RX_ID) as Entry[]).push(e);
  }
  interface Cand { row: MedicationRow; ev: number; ing: string }
  const best = new Map<string, Cand>();
  for (const [rx, o] of orders) {
    const hl = (hists.get(rx) || []).slice().sort((a, b) => (instant(a.row.CHANGED_AT) ?? 0) - (instant(b.row.CHANGED_AT) ?? 0));
    const lastH = hl[hl.length - 1];
    const code: number = lastH ? lastH.row.NEW_STATUS : o.row.MED_STATUS;
    if (code === 9 || hl.some((h) => h.row.NEW_STATUS === 9)) continue;
    const status = code === 1 ? "active" : code === 2 ? "stopped" : code === 3 ? "held" : null;
    if (!status) continue;
    const since = lastH ? localDate(lastH.row.CHANGED_AT) : localDate(o.row.START_DATE);
    const startD = localDate(o.row.START_DATE);
    const evDate = since || startD || "";
    const drugName = String(o.row.DRUG_NAME || "");
    const ing = ingredientOf(drugName);
    const row: MedicationRow = {
      drug_name: drugName, status, patient_reported: false,
      evidence: [{ item_id: o.item.id, entry_id: o.key }, ...hl.map((h) => ({ item_id: h.item.id, entry_id: h.key }))],
    };
    if (ing) row.ingredient = ing;
    if (since) row.status_since = since;
    const q = o.row.DOSE_QTY;
    if (typeof q === "number") {
      const u = o.row.DOSE_UNIT === "unit" ? "units" : o.row.DOSE_UNIT;
      if (u === "mg" || u === "mcg" || u === "units" || u === "mL") row.dose = { value: q, unit: u };
    }
    const f = o.row.FREQ_CODE;
    if (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(f)) row.frequency = f;
    if (lastH && lastH.row.COMMENT_TEXT) row.status_reason_text = String(lastH.row.COMMENT_TEXT);
    if (status === "stopped" && lastH) {
      const rc = lastH.row.REASON_CODE;
      row.stop_reason = rc === "ADR" ? "adverse_reaction" : rc === "PT" ? "patient_choice" : "other";
    }
    const lname = (ing || drugName).toLowerCase();
    if (MENTAL.test(lname)) row.sensitivity = ["mental-health"];
    else if (SUBST.test(lname)) row.sensitivity = ["substance-use"];
    const key = ing || drugName.toLowerCase() || rx;
    const ev = Date.parse(evDate) || 0;
    const prev = best.get(key);
    if (!prev || ev >= prev.ev) best.set(key, { row, ev, ing: key });
  }
  return [...best.values()].map((c) => c.row).sort((a, b) => (a.drug_name < b.drug_name ? -1 : 1));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const counting = countingItems(items || [], asOf);
    const entries: Entry[] = [];
    for (const i of counting) entries.push(...entriesOf(i));
    rows.labs = buildLabs(entries);
    rows.vitals = buildVitals(entries);
    rows.problems = buildProblems(entries);
    rows.medications = buildMeds(entries);
  } catch (_e) {
    // return what we have
  }
  return rows;
}
