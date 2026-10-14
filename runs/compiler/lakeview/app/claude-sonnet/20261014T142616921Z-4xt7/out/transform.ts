import type { FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow, Evidence, PartialDate } from "../in/views/views";

const TZ = "America/Chicago";

function chicagoParts(iso: string): { date: string; time: string } | null {
  const ms = Date.parse(iso);
  if (isNaN(ms)) return null;
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const x of f.formatToParts(new Date(ms))) p[x.type] = x.value;
  const hh = p.hour === "24" ? "00" : p.hour;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${hh}:${p.minute}` };
}

/** Local date-time (no offset -> as written). */
function localDateTime(s: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(s)) return s.slice(0, 16);
  const c = chicagoParts(s);
  return c ? `${c.date}T${c.time}` : null;
}
function localDate(s: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const l = localDateTime(s);
  return l ? l.slice(0, 10) : null;
}
function ms(s: string): number {
  const t = Date.parse(/^\d{4}-\d{2}-\d{2}T[\d:.]+$/.test(s) ? s + "-06:00" : s);
  return isNaN(t) ? 0 : t;
}

interface Entry { item: FolioItem; key: string; e: any }

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = items.filter((it) => {
    const d = localDate(it.recorded);
    return d !== null && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const id of it.supersedes ?? []) dead.add(it.issuer + "|" + id);
    for (const id of it.retracts ?? []) dead.add(it.issuer + "|" + id);
  }
  return inScope.filter((it) => !dead.has(it.issuer + "|" + it.id));
}

function entries(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    const p = item.payload;
    if (!p || typeof p !== "object") continue;
    for (const key of Object.keys(p)) {
      const e = p[key];
      if (e && typeof e === "object" && e.type === type) out.push({ item, key, e });
    }
  }
  return out;
}

// ───────────── labs

const ANALYTE: Record<string, { a: LabResultRow["analyte"]; unit: string }> = {
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

function labs(items: FolioItem[]): LabResultRow[] {
  const best = new Map<string, LabResultRow>();
  const rank = (s: string) => (s === "P" ? 0 : 1);
  const reqs = entries(items, "LAB_REQ");
  const orders = entries(items, "LAB_ORDER");
  for (const r of entries(items, "LAB_RESULT")) {
    const e = r.e;
    const m = ANALYTE[e.TEST_CODE];
    if (!m) continue;
    if (!["P", "F", "A"].includes(e.RESULT_STATUS)) continue;
    const ord = orders.find((o) => o.item === r.item && o.e.ORDER_ID === e.ORDER_ID);
    if (ord && (ord.e.ORDER_STATUS === 9 || ord.e.ORDER_STATUS === 5)) continue;
    const req = reqs.find((q) => q.item === r.item);
    if (!req || typeof req.e.COLLECTED_AT !== "string") continue;
    const mt = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(e.VALUE_TEXT ?? ""));
    if (!mt) continue;
    const value = Number(mt[2]);
    let eq: LabResultRow["egfr_equation"];
    if (m.a === "egfr") {
      const c = String(e.COMMENT_TEXT ?? "");
      if (/CKD-EPI\s*2021/i.test(c)) eq = "ckd-epi-2021";
      else if (/CKD-EPI\s*2009/i.test(c)) eq = "ckd-epi-2009";
      else if (/MDRD/i.test(c)) eq = "mdrd";
      else eq = e.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : "ckd-epi-2009";
    }
    const row: LabResultRow = {
      analyte: m.a,
      value,
      unit: m.unit,
      collected: req.e.COLLECTED_AT,
      status: e.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: [{ item_id: r.item.id, entry_id: r.key }],
    };
    if (mt[1]) row.comparator = mt[1] as any;
    if (eq) row.egfr_equation = eq;
    if (e.LOINC) row.loinc = e.LOINC;
    const k = String(e.RESULT_ID);
    const prev = best.get(k);
    if (!prev || rank(e.RESULT_STATUS) > rank(prev.status === "final" ? "F" : "P")) best.set(k, row);
  }
  return [...best.values()].sort((a, b) => ms(a.collected) - ms(b.collected));
}

// ───────────── clinic

function visitTime(it: FolioItem): number {
  return ms(it.effective);
}

function ingredientOf(name: string): string {
  const words = name.trim().toLowerCase().split(/\s+/);
  const out: string[] = [];
  for (const w of words) {
    if (/^\d/.test(w) || w === "tablet" || w === "capsule") break;
    out.push(w);
  }
  const salts = ["potassium", "sodium", "hydrochloride", "hcl", "mesylate", "maleate", "besylate", "tartrate", "succinate", "calcium", "sulfate"];
  while (out.length > 1 && salts.includes(out[out.length - 1])) out.pop();
  return out.join(" ");
}

function medications(items: FolioItem[]): MedicationRow[] {
  const orders = entries(items, "MED_ORDER");
  const hists = entries(items, "MED_STATUS_HIST");
  const byIng = new Map<string, { row: MedicationRow; t: number }>();
  for (const o of orders) {
    const e = o.e;
    if (e.ROUTE === "IV") continue;
    const hs = hists.filter((h) => h.e.RX_ID === e.RX_ID).sort((a, b) => ms(a.e.CHANGED_AT) - ms(b.e.CHANGED_AT));
    if (e.MED_STATUS === 9 || hs.some((h) => h.e.NEW_STATUS === 9)) continue;
    const last = hs.length ? hs[hs.length - 1] : undefined;
    const code: number = last ? last.e.NEW_STATUS : e.MED_STATUS;
    const status = code === 2 ? "stopped" : code === 3 ? "held" : "active";
    const ing = ingredientOf(String(e.DRUG_NAME ?? ""));
    const row: MedicationRow = {
      drug_name: String(e.DRUG_NAME),
      status,
      patient_reported: false,
      evidence: [{ item_id: o.item.id, entry_id: o.key }],
    };
    if (ing) row.ingredient = ing;
    const unit = e.DOSE_UNIT === "unit" ? "units" : e.DOSE_UNIT;
    if (typeof e.DOSE_QTY === "number" && ["mg", "mcg", "units", "mL"].includes(unit)) row.dose = { value: e.DOSE_QTY, unit };
    if (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(e.FREQ_CODE)) row.frequency = e.FREQ_CODE;
    let since: string | null = null;
    if (last) {
      since = localDate(last.e.CHANGED_AT);
      row.evidence.push({ item_id: last.item.id, entry_id: last.key });
      if (status !== "active") {
        if (last.e.COMMENT_TEXT) row.status_reason_text = String(last.e.COMMENT_TEXT);
        if (status === "stopped") {
          const rc = last.e.REASON_CODE;
          row.stop_reason = rc === "ADR" ? "adverse_reaction" : rc === "PT" ? "patient_choice" : rc ? "other" : undefined;
          if (!row.stop_reason) delete row.stop_reason;
        }
      }
    } else since = typeof e.START_DATE === "string" ? e.START_DATE : null;
    if (since) row.status_since = since;
    const t = last ? ms(last.e.CHANGED_AT) : ms(e.START_DATE ?? o.item.effective) || visitTime(o.item);
    const prev = byIng.get(ing || e.LV_DRUG_ID);
    if (!prev || t > prev.t) byIng.set(ing || e.LV_DRUG_ID, { row, t });
  }
  return [...byIng.values()].map((x) => x.row);
}

function onsetFromNarrative(it: FolioItem, key: string): { value: PartialDate; precision: "year" | "month" | "day" } | undefined {
  const re = new RegExp(`<ref id="${key.replace(/[^\w-]/g, "")}">([\\s\\S]*?)</ref>`);
  const m = re.exec(it.narrative ?? "");
  if (!m) return undefined;
  const t = m[1];
  let x = /since\s+(\d{1,2})\/(\d{4})/i.exec(t);
  if (x) return { value: `${x[2]}-${x[1].padStart(2, "0")}`, precision: "month" };
  x = /since\s+(\d{4})-(\d{2})-(\d{2})/i.exec(t);
  if (x) return { value: `${x[1]}-${x[2]}-${x[3]}`, precision: "day" };
  x = /since\s+(\d{4})/i.exec(t);
  if (x) return { value: x[1], precision: "year" };
  return undefined;
}

function problemsAndAllergies(items: FolioItem[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const dxs = entries(items, "VISIT_DX").sort((a, b) => visitTime(a.item) - visitTime(b.item));
  const groups = new Map<string, Entry[]>();
  for (const d of dxs) {
    const code = String(d.e.ICD10CM ?? "");
    const g = /^N18\./.test(code) ? "CKD" : code;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(d);
  }
  const visits = entries(items, "CLINIC_VISIT");
  const problems: ProblemRow[] = [];
  const allergies: AllergyIntoleranceRow[] = [];
  for (const [g, list] of groups) {
    const latestAny = list[list.length - 1];
    if (latestAny.e.DX_STATUS === "R") continue;
    const usable = list.filter((d) => d.e.DX_STATUS === "A" || d.e.DX_STATUS === "H");
    if (!usable.length) continue;
    const last = usable[usable.length - 1];
    const code = String(last.e.ICD10CM);
    const text = String(last.e.DX_TEXT ?? "");
    const evidence: Evidence = [{ item_id: last.item.id, entry_id: last.key }];

    // drug-caused diagnoses
    const isT = /^T(3[6-9]|4\d|50)\./.test(code);
    const assoc = /(?:adverse effect of|(?:induced|associated))/i.test(text);
    if (isT || assoc) {
      let sub = "";
      let m = /adverse effect of\s+([^,;(]+)/i.exec(text);
      if (m) sub = m[1];
      else if ((m = /([\w -]+?)[- ](?:associated|induced)/i.exec(text))) sub = m[1];
      sub = sub.trim().toLowerCase();
      if (sub) {
        const lt = text.toLowerCase();
        let rt: AllergyIntoleranceRow["reaction_type"] = "serious_adverse_event";
        if (/angioedema|urticaria|anaphyla|rash|hypersens|bronchospasm/.test(lt)) rt = "hypersensitivity";
        else if (/cough|myalgia|nausea|gastro/.test(lt)) rt = "side_effect";
        const al: AllergyIntoleranceRow = {
          substance: sub,
          reaction_type: rt,
          mechanism: /angioedema|ketoacidosis|cough/.test(lt) ? "non_immune" : "unknown",
          criticality: rt === "side_effect" ? "low" : rt === "serious_adverse_event" ? "high" : "unknown",
          evidence,
        };
        if (!isT) al.reaction = text;
        allergies.push(al);
      }
      if (isT) continue;
    }

    const row: ProblemRow = {
      condition: text,
      icd10cm: code,
      status: last.e.DX_STATUS === "H" ? "resolved" : "active",
      evidence,
    };
    for (const d of [...usable].reverse()) {
      const on = onsetFromNarrative(d.item, d.key);
      if (on) { row.onset = on; break; }
    }
    if (g === "CKD") {
      const vs = visits.filter((v) => v.e.CKD_G || v.e.CKD_A).sort((a, b) => visitTime(a.item) - visitTime(b.item));
      const lg = [...vs].reverse().find((v) => v.e.CKD_G);
      const la = [...vs].reverse().find((v) => v.e.CKD_A);
      if (lg) { row.ckd_stage = lg.e.CKD_G; evidence.push({ item_id: lg.item.id, entry_id: lg.key }); }
      if (la) {
        row.albuminuria = la.e.CKD_A;
        if (!evidence.some((x) => x.item_id === la.item.id && x.entry_id === la.key)) evidence.push({ item_id: la.item.id, entry_id: la.key });
      }
    }
    problems.push(row);
  }
  return { problems, allergies };
}

function vitals(items: FolioItem[]): VitalRow[] {
  const out: VitalRow[] = [];
  const all = entries(items, "VITAL");
  const byItem = new Map<FolioItem, Entry[]>();
  for (const v of all) {
    if (!byItem.has(v.item)) byItem.set(v.item, []);
    byItem.get(v.item)!.push(v);
  }
  for (const [item, vs] of byItem) {
    const find = (code: string, n: number) => vs.find((v) => v.e.VITAL_CODE === code && v.e.READING_NO === n);
    const bps = find("BPS", 1), bpd = find("BPD", 1), rs = find("BPS", 2), rd = find("BPD", 2);
    const hr = find("HR", 1), wt = find("WT", 1);
    const firsts = [bps, bpd, hr, wt].filter((x): x is Entry => !!x);
    if (!firsts.length) continue;
    const anchor = bps ?? bpd ?? [...firsts].sort((a, b) => ms(a.e.TAKEN_AT) - ms(b.e.TAKEN_AT))[0];
    const lt = localDateTime(String(anchor.e.TAKEN_AT));
    if (!lt) continue;
    const row: VitalRow = { setting: "clinic", local_time: lt, evidence: [] };
    if (bps) row.systolic_mmhg = bps.e.VALUE_NUM;
    if (bpd) row.diastolic_mmhg = bpd.e.VALUE_NUM;
    if (rs) row.repeat_systolic_mmhg = rs.e.VALUE_NUM;
    if (rd) row.repeat_diastolic_mmhg = rd.e.VALUE_NUM;
    if (hr) row.pulse_bpm = hr.e.VALUE_NUM;
    if (wt && typeof wt.e.VALUE_NUM === "number") row.weight_kg = Math.round(wt.e.VALUE_NUM * 10) / 10;
    for (const v of [bps, bpd, rs, rd, hr, wt]) if (v) row.evidence.push({ item_id: item.id, entry_id: v.key });
    out.push(row);
  }
  return out.sort((a, b) => a.local_time.localeCompare(b.local_time));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const cur = currentItems(items ?? [], asOf);
  const { problems, allergies } = problemsAndAllergies(cur);
  return {
    medications: medications(cur),
    problems,
    allergies,
    labs: labs(cur),
    vitals: vitals(cur),
  };
}
