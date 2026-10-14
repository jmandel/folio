import type { FolioItem, ViewRows, MedicationRow, ProblemRow, LabResultRow, VitalRow, Evidence, Analyte, Sensitivity } from "../in/views/views";

const TZ = "America/Chicago";

function localDate(ts: string): string {
  if (/[zZ]$|[+-]\d\d:?\d\d$/.test(ts) && ts.length > 10) {
    const ms = Date.parse(ts);
    if (!isNaN(ms)) {
      const p = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(ms));
      return p;
    }
  }
  return ts.slice(0, 10);
}

function entries(it: FolioItem): [string, any][] {
  const p = it.payload;
  if (!p || typeof p !== "object") return [];
  return Object.entries(p).filter(([, v]) => v && typeof v === "object" && typeof (v as any).type === "string");
}

const LAB_MAP: Record<string, { a: Analyte; unit: string }> = {
  "LK-CREAT": { a: "creatinine", unit: "mg/dL" },
  "LK-EGFR09N": { a: "egfr", unit: "mL/min/1.73m2" },
  "LK-EGFR21": { a: "egfr", unit: "mL/min/1.73m2" },
  "LK-NA": { a: "sodium", unit: "mmol/L" },
  "LK-K": { a: "potassium", unit: "mmol/L" },
  "LK-GLU": { a: "glucose", unit: "mg/dL" },
  "LK-A1C": { a: "a1c", unit: "%" },
  "LK-UACR": { a: "uacr", unit: "mg/g" },
  "LK-WBC": { a: "wbc", unit: "10*3/uL" },
  "LK-HGB": { a: "hemoglobin", unit: "g/dL" },
  "LK-PLT": { a: "platelets", unit: "10*3/uL" },
  "LK-CHOL": { a: "cholesterol", unit: "mg/dL" },
  "LK-TRIG": { a: "triglycerides", unit: "mg/dL" },
  "LK-HDL": { a: "hdl", unit: "mg/dL" },
  "LK-LDLC": { a: "ldl", unit: "mg/dL" },
};

function parseValue(r: any): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | null {
  const t = String(r.VALUE_TEXT ?? "").trim();
  const m = /^(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)$/.exec(t);
  if (!m) return null;
  const value = Number(m[2]);
  if (!isFinite(value)) return null;
  return m[1] ? { value, comparator: m[1] as any } : { value };
}

function ingredientOf(name: string): string {
  const words = String(name).toLowerCase().split(/\s+/);
  const out: string[] = [];
  const salts = new Set(["potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "tartrate", "succinate", "mesylate", "calcium", "sulfate", "hydrobromide", "citrate", "phosphate", "acetate"]);
  for (const w of words) {
    if (/^\d/.test(w) || ["tablet", "capsule", "tab", "cap", "injection", "solution", "pen"].includes(w)) break;
    out.push(w);
  }
  while (out.length > 1 && salts.has(out[out.length - 1])) out.pop();
  return out.join(" ");
}

function sensitivityOfIcd(code: string): Sensitivity[] | undefined {
  const c = code.toUpperCase();
  if (/^F1[0-9]/.test(c) && !/^F17/.test(c)) return ["substance-use"];
  if (/^F(2|3|4|5[0-9]|6|9)/.test(c) || /^F0[1-9]/.test(c)) return ["mental-health"];
  if (/^(B20|Z21|A5[0-9]|A6[0-4])/.test(c)) return ["hiv-sti"];
  if (/^(Z30|O\d\d|Z32|Z33|N97)/.test(c)) return ["sexual-reproductive-health"];
  return undefined;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    return build(items, asOf, rows);
  } catch {
    return rows;
  }
}

function build(all: FolioItem[], asOf: string, rows: ViewRows): ViewRows {
  const base = all.filter((i) => i && typeof i.recorded === "string" && localDate(i.recorded) <= asOf);
  const removed = new Set<string>();
  for (const i of base) for (const r of i.retracts ?? []) removed.add(r);
  const byId = new Map<string, FolioItem>();
  for (const i of all) byId.set(i.id, i);
  const stack: string[] = [];
  for (const i of base) for (const s of i.supersedes ?? []) stack.push(s);
  while (stack.length) {
    const id = stack.pop()!;
    if (removed.has(id)) continue;
    removed.add(id);
    for (const s of byId.get(id)?.supersedes ?? []) stack.push(s);
  }
  const items = base.filter((i) => !removed.has(i.id)).sort((a, b) => Date.parse(a.recorded) - Date.parse(b.recorded) || a.id.localeCompare(b.id));

  // ---- labs
  const labs = new Map<string, { row: LabResultRow; rank: number }>();
  for (const it of items) {
    const es = entries(it);
    const req = es.map((e) => e[1]).find((e) => e.type === "LAB_REQ");
    const orders = new Map<string, any>();
    for (const [, e] of es) if (e.type === "LAB_ORDER") orders.set(e.ORDER_ID, e);
    for (const [key, e] of es) {
      if (e.type !== "LAB_RESULT") continue;
      const m = LAB_MAP[e.TEST_CODE];
      if (!m || !req?.COLLECTED_AT) continue;
      const o = orders.get(e.ORDER_ID);
      if (o && (o.ORDER_STATUS === 5 || o.ORDER_STATUS === 9)) continue;
      if (e.RESULT_STATUS === "C" || e.RESULT_STATUS === "X") continue;
      const v = parseValue(e);
      if (!v) continue;
      const status = e.RESULT_STATUS === "P" ? "preliminary" : "final";
      const row: LabResultRow = { analyte: m.a, value: v.value, unit: m.unit, collected: req.COLLECTED_AT, status, evidence: [{ item_id: it.id, entry_id: key }] };
      if (v.comparator) row.comparator = v.comparator;
      if (m.a === "egfr") row.egfr_equation = e.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : "ckd-epi-2009";
      if (e.LOINC) row.loinc = e.LOINC;
      const k = String(e.RESULT_ID ?? it.id + key);
      const rank = status === "final" ? 1 : 0;
      const prev = labs.get(k);
      if (!prev) labs.set(k, { row, rank });
      else if (rank >= prev.rank) {
        row.evidence = [...prev.row.evidence, ...row.evidence];
        labs.set(k, { row, rank });
      } else prev.row.evidence.push(...row.evidence);
    }
  }
  rows.labs = [...labs.values()].map((x) => x.row);

  // ---- vitals
  for (const it of items) {
    const vs = entries(it).filter(([, e]) => e.type === "VITAL" && typeof e.VALUE_NUM === "number");
    if (!vs.length) continue;
    const pick = (code: string, n: number) => vs.find(([, e]) => e.VITAL_CODE === code && e.READING_NO === n);
    const sys = pick("BPS", 1), dia = pick("BPD", 1), rs = pick("BPS", 2), rd = pick("BPD", 2), hr = pick("HR", 1), wt = pick("WT", 1);
    const used = [sys, dia, rs, rd, hr, wt].filter(Boolean) as [string, any][];
    if (!used.length) continue;
    const t = (sys ?? dia ?? used.slice().sort((a, b) => Date.parse(a[1].TAKEN_AT) - Date.parse(b[1].TAKEN_AT))[0])[1].TAKEN_AT as string;
    const v: VitalRow = { setting: "clinic", local_time: localTime(t), evidence: used.map(([k]) => ({ item_id: it.id, entry_id: k })) };
    if (sys) v.systolic_mmhg = sys[1].VALUE_NUM;
    if (dia) v.diastolic_mmhg = dia[1].VALUE_NUM;
    if (rs) v.repeat_systolic_mmhg = rs[1].VALUE_NUM;
    if (rd) v.repeat_diastolic_mmhg = rd[1].VALUE_NUM;
    if (hr) v.pulse_bpm = hr[1].VALUE_NUM;
    if (wt) v.weight_kg = Math.round(wt[1].VALUE_NUM * 10) / 10;
    rows.vitals.push(v);
  }

  // ---- problems
  type Dx = { e: any; item: FolioItem; key: string; at: string; visit: any };
  const dxs: Dx[] = [];
  const visits: { visit: any; item: FolioItem; key: string }[] = [];
  for (const it of items) {
    const es = entries(it);
    const visit = es.find(([, e]) => e.type === "CLINIC_VISIT");
    if (visit) visits.push({ visit: visit[1], item: it, key: visit[0] });
    for (const [key, e] of es) if (e.type === "VISIT_DX" && e.ICD10CM) dxs.push({ e, item: it, key, at: visit?.[1].VISIT_AT ?? it.effective, visit: visit?.[1] });
  }
  const t = (s: string) => Date.parse(s) || 0;
  dxs.sort((a, b) => t(a.at) - t(b.at));
  visits.sort((a, b) => t(a.visit.VISIT_AT) - t(b.visit.VISIT_AT));
  const groups = new Map<string, Dx[]>();
  for (const d of dxs) {
    const code = String(d.e.ICD10CM);
    const g = /^N18/i.test(code) ? "CKD" : code.toUpperCase();
    (groups.get(g) ?? groups.set(g, []).get(g)!).push(d);
  }
  for (const [g, list] of groups) {
    const last = list[list.length - 1];
    if (last.e.DX_STATUS !== "A" && last.e.DX_STATUS !== "H") continue;
    const p: ProblemRow = {
      condition: last.e.DX_TEXT,
      icd10cm: last.e.ICD10CM,
      status: last.e.DX_STATUS === "A" ? "active" : "resolved",
      evidence: [{ item_id: last.item.id, entry_id: last.key }],
    };
    if (g === "CKD") {
      const withG = visits.filter((v) => v.visit.CKD_G).pop();
      const withA = visits.filter((v) => v.visit.CKD_A).pop();
      if (withG) { p.ckd_stage = withG.visit.CKD_G; p.evidence.push({ item_id: withG.item.id, entry_id: withG.key }); }
      if (withA) {
        p.albuminuria = withA.visit.CKD_A;
        if (!p.evidence.some((x) => x.item_id === withA.item.id && x.entry_id === withA.key)) p.evidence.push({ item_id: withA.item.id, entry_id: withA.key });
      }
    }
    const s = sensitivityOfIcd(String(last.e.ICD10CM));
    if (s) p.sensitivity = s;
    rows.problems.push(p);
  }

  // ---- medications
  const orders = new Map<string, { e: any; item: FolioItem; key: string }>();
  const hists = new Map<string, { e: any; item: FolioItem; key: string }[]>();
  for (const it of items) {
    for (const [key, e] of entries(it)) {
      if (e.type === "MED_ORDER" && e.RX_ID) orders.set(e.RX_ID, { e, item: it, key });
      else if (e.type === "MED_STATUS_HIST" && e.RX_ID) (hists.get(e.RX_ID) ?? hists.set(e.RX_ID, []).get(e.RX_ID)!).push({ e, item: it, key });
    }
  }
  const best = new Map<string, { row: MedicationRow; ev: string; rec: number }>();
  for (const [rx, o] of orders) {
    const hs = (hists.get(rx) ?? []).slice().sort((a, b) => t(a.e.CHANGED_AT) - t(b.e.CHANGED_AT));
    const lastH = hs[hs.length - 1];
    const st = lastH ? lastH.e.NEW_STATUS : o.e.MED_STATUS;
    if (st === 9 || o.e.MED_STATUS === 9) continue;
    if (hs.some((h) => h.e.NEW_STATUS === 9)) continue;
    const status = st === 1 ? "active" : st === 2 ? "stopped" : st === 3 ? "held" : null;
    if (!status) continue;
    const since = lastH ? localDate(lastH.e.CHANGED_AT) : o.e.START_DATE;
    const row: MedicationRow = {
      ingredient: ingredientOf(o.e.DRUG_NAME),
      drug_name: o.e.DRUG_NAME,
      status,
      patient_reported: false,
      evidence: [{ item_id: o.item.id, entry_id: o.key }, ...hs.map((h) => ({ item_id: h.item.id, entry_id: h.key }))],
    };
    if (since) row.status_since = since;
    if (typeof o.e.DOSE_QTY === "number") {
      const u = o.e.DOSE_UNIT === "unit" ? "units" : o.e.DOSE_UNIT;
      if (u === "mg" || u === "mcg" || u === "units" || u === "mL") row.dose = { value: o.e.DOSE_QTY, unit: u };
    }
    if (o.e.FREQ_CODE) row.frequency = o.e.FREQ_CODE;
    if (lastH) {
      if (lastH.e.COMMENT_TEXT) row.status_reason_text = lastH.e.COMMENT_TEXT;
      if (status === "stopped") {
        const rc = lastH.e.REASON_CODE;
        row.stop_reason = rc === "ADR" ? "adverse_reaction" : rc === "PT" ? "patient_choice" : rc === "LAB" || rc === "PROC" || rc === "OTH" ? "other" : undefined;
        if (!row.stop_reason) delete row.stop_reason;
      }
    }
    const ev = lastH ? lastH.e.CHANGED_AT : o.e.START_DATE;
    const evKey = String(ev);
    const k = row.ingredient || rx;
    const rec = t(lastH ? lastH.item.recorded : o.item.recorded);
    const prev = best.get(k);
    if (!prev || t(evKey) > t(prev.ev) || (t(evKey) === t(prev.ev) && rec >= prev.rec)) best.set(k, { row, ev: evKey, rec });
  }
  rows.medications = [...best.values()].map((x) => x.row);
  return rows;
}

function localTime(ts: string): string {
  if (/[zZ]$|[+-]\d\d:?\d\d$/.test(ts) && ts.length > 10) {
    const ms = Date.parse(ts);
    if (!isNaN(ms)) {
      const p = Object.fromEntries(
        new Intl.DateTimeFormat("en-CA", { timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
          .formatToParts(new Date(ms)).map((x) => [x.type, x.value]),
      );
      return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
    }
  }
  return ts.slice(0, 16);
}
