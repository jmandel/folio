import type { FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow, Sensitivity, Evidence, Analyte } from "../in/views/views";

type Row = Record<string, any>;
interface Ent { item: FolioItem; key: string; row: Row }

const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago", hourCycle: "h23",
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
});

/** Local wall-clock "YYYY-MM-DDTHH:MM" of a timestamp (date-only gives T00:00). */
function localTime(ts: string): string {
  if (typeof ts !== "string") return "";
  if (!/(Z|[+-]\d\d:?\d\d)$/.test(ts) || ts.length <= 10) {
    return ts.length <= 10 ? ts + "T00:00" : ts.slice(0, 16);
  }
  const ms = Date.parse(ts);
  if (isNaN(ms)) return ts.slice(0, 16);
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
function localDate(ts: string): string { return localTime(ts).slice(0, 10); }

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const counted = items.filter((i) => i && typeof i.recorded === "string" && localDate(i.recorded) <= asOf);
  const byId = new Map<string, FolioItem>();
  for (const i of items) byId.set(i.id, i);
  const dead = new Set<string>();
  const kill = (id: string) => {
    if (dead.has(id)) return;
    dead.add(id);
    const it = byId.get(id);
    if (it) for (const s of it.supersedes ?? []) kill(s); // transitive
  };
  for (const i of counted) {
    for (const s of i.supersedes ?? []) kill(s);
    for (const r of i.retracts ?? []) dead.add(r);
  }
  return counted.filter((i) => !dead.has(i.id));
}

function entries(item: FolioItem): Ent[] {
  const out: Ent[] = [];
  const p = item.payload;
  if (!p || typeof p !== "object") return out;
  for (const [key, v] of Object.entries(p)) {
    const vs = Array.isArray(v) ? v : [v];
    for (const row of vs) if (row && typeof row === "object" && typeof row.type === "string") out.push({ item, key, row });
  }
  return out;
}

const ev = (e: Ent): { item_id: string; entry_id: string } => ({ item_id: e.item.id, entry_id: e.key });

// ───────────── labs

const ANALYTE: Record<string, Analyte> = {
  "LK-CREAT": "creatinine", "LK-EGFR09N": "egfr", "LK-EGFR21": "egfr", "LK-NA": "sodium", "LK-K": "potassium",
  "LK-GLU": "glucose", "LK-A1C": "a1c", "LK-UACR": "uacr", "LK-WBC": "wbc", "LK-HGB": "hemoglobin",
  "LK-PLT": "platelets", "LK-CHOL": "cholesterol", "LK-TRIG": "triglycerides", "LK-HDL": "hdl", "LK-LDLC": "ldl",
};
const UNIT: Record<string, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", glucose: "mg/dL", a1c: "%",
  uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", cholesterol: "mg/dL",
  triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function buildLabs(items: FolioItem[]): LabResultRow[] {
  const groups = new Map<string, { ents: Ent[]; req?: Row }>();
  const rank: Record<string, number> = { P: 1, F: 2, A: 3 };
  const best = new Map<string, { e: Ent; req: Row; all: Ent[] }>();
  for (const item of items) {
    const ents = entries(item);
    const req = ents.find((e) => e.row.type === "LAB_REQ")?.row;
    if (!req) continue;
    const badOrders = new Set<string>();
    for (const e of ents) {
      if (e.row.type === "LAB_ORDER" && (e.row.ORDER_STATUS === 5 || e.row.ORDER_STATUS === 9)) badOrders.add(e.row.ORDER_ID);
    }
    for (const e of ents) {
      const r = e.row;
      if (r.type !== "LAB_RESULT" || badOrders.has(r.ORDER_ID)) continue;
      if (!rank[r.RESULT_STATUS]) continue; // C, X, unknown
      const id = String(r.RESULT_ID ?? item.id + e.key);
      const cur = best.get(id);
      if (!cur) best.set(id, { e, req, all: [e] });
      else {
        cur.all.push(e);
        if (rank[r.RESULT_STATUS] >= rank[cur.e.row.RESULT_STATUS]) { cur.e = e; cur.req = req; }
      }
    }
  }
  void groups;
  const out: LabResultRow[] = [];
  for (const { e, req, all } of best.values()) {
    const r = e.row;
    const analyte = ANALYTE[r.TEST_CODE];
    if (!analyte || !req.COLLECTED_AT) continue;
    const text = String(r.VALUE_TEXT ?? "").trim();
    const m = /^(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?)$/.exec(text);
    if (!m) continue;
    const row: LabResultRow = {
      analyte,
      value: Number(m[2]),
      unit: UNIT[analyte],
      collected: req.COLLECTED_AT,
      status: r.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: all.map(ev),
    } as LabResultRow;
    if (m[1]) row.comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as any;
    if (analyte === "egfr") {
      const c = String(r.COMMENT_TEXT ?? "");
      row.egfr_equation = /2021/.test(c) ? "ckd-epi-2021" : /2009/.test(c) ? "ckd-epi-2009" : /MDRD/i.test(c) ? "mdrd"
        : r.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : r.TEST_CODE === "LK-EGFR09N" ? "ckd-epi-2009" : "unknown";
    }
    if (r.LOINC) row.loinc = r.LOINC;
    out.push(row);
  }
  return out;
}

// ───────────── clinic

const SALTS = new Set(["hydrochloride", "hcl", "sodium", "potassium", "calcium", "sulfate", "maleate", "tartrate", "succinate", "besylate", "mesylate", "acetate", "citrate", "phosphate", "bromide", "magnesium", "hydrobromide", "fumarate"]);
function ingredientOf(name: string): string | undefined {
  const words = name.toLowerCase().replace(/\(.*?\)/g, " ").split(/\s+/).filter(Boolean);
  const keep: string[] = [];
  for (const w of words) {
    if (/\d/.test(w)) break;
    keep.push(w);
  }
  while (keep.length > 1 && SALTS.has(keep[keep.length - 1])) keep.pop();
  const s = keep.join(" ").trim();
  return s || undefined;
}

const DRUG_SENS: [RegExp, Sensitivity][] = [
  [/quetiapine|olanzapine|risperidone|aripiprazole|lithium|sertraline|fluoxetine|escitalopram|citalopram|bupropion|venlafaxine|duloxetine|lamotrigine|haloperidol|paroxetine|mirtazapine|trazodone|clozapine|ziprasidone/, "mental-health"],
  [/buprenorphine|naloxone|naltrexone|methadone|disulfiram|acamprosate/, "substance-use"],
  [/tenofovir|emtricitabine|dolutegravir|bictegravir|efavirenz|raltegravir|darunavir|abacavir|lamivudine|doravirine|rilpivirine/, "hiv-sti"],
  [/ethinyl|norethindrone|levonorgestrel|medroxyprogesterone|drospirenone|estradiol|clomiphene|misoprostol/, "sexual-reproductive-health"],
];
function dxSens(icd: string): Sensitivity[] | undefined {
  const c = icd.toUpperCase();
  if (/^F1\d/.test(c)) return ["substance-use"];
  if (/^F(2|3|4|5|6|9)\d/.test(c) || /^F0[1-9]/.test(c)) return ["mental-health"];
  if (/^(B20|Z21|B97\.35|A5\d|A6[0-4]|A74|A56)/.test(c)) return ["hiv-sti"];
  if (/^(O\d|Z3[0-9]|Z30|N97|N46)/.test(c)) return ["sexual-reproductive-health"];
  return undefined;
}

const FREQ: Record<string, MedicationRow["frequency"]> = { QD: "QD", BID: "BID", TID: "TID", QHS: "QHS", QW: "QW", PRN: "PRN" };

function onsetFromText(t: string): { value: string; precision: "year" | "month" | "day" } | undefined {
  const m = /since\s+(?:(\d{1,2})\/(\d{4})|(\d{4})-(\d{2})|(\d{4}))/i.exec(t);
  if (!m) return undefined;
  if (m[1]) return { value: `${m[2]}-${m[1].padStart(2, "0")}`, precision: "month" };
  if (m[3]) return { value: `${m[3]}-${m[4]}`, precision: "month" };
  return { value: m[5], precision: "year" };
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const result: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  let live: FolioItem[];
  try { live = countingItems(Array.isArray(items) ? items : [], asOf); } catch { return result; }
  live.sort((a, b) => (a.recorded < b.recorded ? -1 : a.recorded > b.recorded ? 1 : a.id < b.id ? -1 : 1));

  try { result.labs = buildLabs(live); } catch { /* skip */ }

  const all: Ent[] = live.flatMap(entries);
  const visitAt = new Map<string, string>(); // item id -> visit time
  for (const e of all) if (e.row.type === "CLINIC_VISIT") visitAt.set(e.item.id, String(e.row.VISIT_AT ?? e.item.effective));
  const when = (e: Ent) => visitAt.get(e.item.id) ?? e.item.effective ?? e.item.recorded;
  const ts = (s: string) => { const n = Date.parse(s); return isNaN(n) ? 0 : n; };
  const byWhen = (a: Ent, b: Ent) => ts(when(a)) - ts(when(b)) || (a.item.recorded < b.item.recorded ? -1 : a.item.recorded > b.item.recorded ? 1 : 0);

  // ── problems & drug-attributed allergies
  const dx = all.filter((e) => e.row.type === "VISIT_DX" && e.row.ICD10CM).sort(byWhen);
  const groups = new Map<string, Ent[]>();
  for (const e of dx) {
    const icd = String(e.row.ICD10CM);
    const k = /^N18/.test(icd) ? "N18" : icd;
    (groups.get(k) ?? groups.set(k, []).get(k)!).push(e);
  }
  const visits = all.filter((e) => e.row.type === "CLINIC_VISIT").sort(byWhen);
  const lastG = [...visits].reverse().find((v) => v.row.CKD_G);
  const lastA = [...visits].reverse().find((v) => v.row.CKD_A);
  for (const [k, es] of groups) {
    const last = es[es.length - 1];
    const icd = String(last.row.ICD10CM);
    const st = last.row.DX_STATUS;
    if (/^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/i.test(icd)) {
      if (st !== "A" && st !== "H") continue;
      if (st === "H") continue;
      const txt = String(last.row.DX_TEXT ?? "");
      const sub = /(?:of|due to|by)\s+(.+)$/i.exec(txt)?.[1] ?? txt;
      const al: AllergyIntoleranceRow = {
        substance: sub.toLowerCase().replace(/,?\s*(initial|subsequent) encounter.*$/, "").trim(),
        reaction_type: "side_effect", mechanism: "unknown", criticality: "unknown",
        evidence: es.map(ev),
      };
      result.allergies.push(al);
      continue;
    }
    if (st !== "A" && st !== "H") continue;
    const p: ProblemRow = {
      condition: String(last.row.DX_TEXT ?? icd),
      icd10cm: icd,
      status: st === "H" ? "resolved" : "active",
      evidence: es.map(ev),
    };
    if (k === "N18") {
      if (lastG) p.ckd_stage = lastG.row.CKD_G;
      if (lastA) p.albuminuria = lastA.row.CKD_A;
    }
    // onset from the narrative text spanning this entry
    for (const e of [...es].reverse()) {
      const re = new RegExp(`<ref id="${e.key.replace(/[^\w]/g, "\\$&")}">([\\s\\S]*?)</ref>`, "g");
      let m: RegExpExecArray | null; let found;
      while ((m = re.exec(e.item.narrative ?? ""))) { found = onsetFromText(m[1]); if (found) break; }
      if (found) { p.onset = found; break; }
    }
    const s = dxSens(icd);
    if (s) p.sensitivity = s;
    result.problems.push(p);
  }

  // ── medications
  const orders = all.filter((e) => e.row.type === "MED_ORDER" && e.row.RX_ID);
  const hist = all.filter((e) => e.row.type === "MED_STATUS_HIST" && e.row.RX_ID)
    .sort((a, b) => ts(a.row.CHANGED_AT) - ts(b.row.CHANGED_AT) || byWhen(a, b));
  const meds: { row: MedicationRow; at: number }[] = [];
  const seenRx = new Set<string>();
  for (const o of orders) {
    const r = o.row;
    if (seenRx.has(r.RX_ID)) continue;
    seenRx.add(r.RX_ID);
    const hs = hist.filter((h) => h.row.RX_ID === r.RX_ID);
    const lastH = hs[hs.length - 1];
    const status = lastH ? lastH.row.NEW_STATUS : r.MED_STATUS;
    if (status === 9) continue;
    const name = String(r.DRUG_NAME ?? "");
    const m: MedicationRow = {
      drug_name: name,
      status: status === 2 ? "stopped" : status === 3 ? "held" : "active",
      patient_reported: false,
      evidence: [ev(o), ...hs.map(ev)],
    };
    const ing = ingredientOf(name);
    if (ing) m.ingredient = ing;
    const since = lastH ? localDate(lastH.row.CHANGED_AT) : r.START_DATE;
    if (since) m.status_since = since;
    if (typeof r.DOSE_QTY === "number") {
      const u = r.DOSE_UNIT === "unit" ? "units" : r.DOSE_UNIT;
      if (u === "mg" || u === "mcg" || u === "units" || u === "mL") m.dose = { value: r.DOSE_QTY, unit: u };
    }
    const f = FREQ[r.FREQ_CODE];
    if (f) m.frequency = f; else if (r.FREQ_CODE) m.frequency = "other";
    if (lastH && status !== 1) {
      if (status === 2) {
        const rc = lastH.row.REASON_CODE;
        const sr = rc === "ADR" ? "adverse_reaction" : rc === "PT" ? "patient_choice" : rc === "LAB" || rc === "PROC" ? "other" : undefined;
        if (sr) m.stop_reason = sr;
      }
      if (lastH.row.COMMENT_TEXT) m.status_reason_text = lastH.row.COMMENT_TEXT;
    } else if (lastH?.row.COMMENT_TEXT) m.status_reason_text = lastH.row.COMMENT_TEXT;
    const sens = DRUG_SENS.filter(([re]) => re.test(name.toLowerCase())).map(([, s]) => s);
    if (sens.length) m.sensitivity = sens;
    meds.push({ row: m, at: ts(since ?? "") });
  }
  // one row per ingredient: most recent event wins
  const byIng = new Map<string, { row: MedicationRow; at: number }>();
  for (const x of meds) {
    const k = x.row.ingredient ?? x.row.drug_name.toLowerCase();
    const c = byIng.get(k);
    if (!c || x.at >= c.at) byIng.set(k, x);
  }
  result.medications = [...byIng.values()].map((x) => x.row);

  // ── vitals
  const byVisit = new Map<string, Ent[]>();
  for (const e of all) {
    if (e.row.type !== "VITAL") continue;
    const k = e.item.id + "|" + e.row.VISIT_ID;
    const l = byVisit.get(k) ?? [];
    l.push(e);
    byVisit.set(k, l);
  }
  for (const vs of byVisit.values()) {
    const get = (code: string, n: number) => vs.filter((v) => v.row.VITAL_CODE === code && v.row.READING_NO === n && typeof v.row.VALUE_NUM === "number")[0];
    const sys = get("BPS", 1), dia = get("BPD", 1), rs = get("BPS", 2), rd = get("BPD", 2), hr = get("HR", 1), wt = get("WT", 1);
    const present = [sys, dia, rs, rd, hr, wt].filter(Boolean) as Ent[];
    if (!present.length) continue;
    const first = sys ?? dia ?? [...present].sort((a, b) => ts(a.row.TAKEN_AT) - ts(b.row.TAKEN_AT))[0];
    const v: VitalRow = { setting: "clinic", local_time: localTime(first.row.TAKEN_AT), evidence: present.map(ev) };
    if (sys) v.systolic_mmhg = sys.row.VALUE_NUM;
    if (dia) v.diastolic_mmhg = dia.row.VALUE_NUM;
    if (rs) v.repeat_systolic_mmhg = rs.row.VALUE_NUM;
    if (rd) v.repeat_diastolic_mmhg = rd.row.VALUE_NUM;
    if (hr) v.pulse_bpm = hr.row.VALUE_NUM;
    if (wt) v.weight_kg = Math.round(wt.row.VALUE_NUM * 10) / 10;
    result.vitals.push(v);
  }
  result.vitals.sort((a, b) => (a.local_time < b.local_time ? -1 : 1));
  return result;
}
