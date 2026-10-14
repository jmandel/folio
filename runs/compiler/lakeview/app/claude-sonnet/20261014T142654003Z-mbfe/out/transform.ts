import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Analyte, Evidence, Sensitivity,
} from "../in/views/views";

type Ent = { item: FolioItem; id: string; e: any };

const chicagoDate = (iso: string): string => {
  const ms = Date.parse(iso);
  if (isNaN(ms)) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date(ms));
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${g("year")}-${g("month")}-${g("day")}`;
};

const ts = (s: any): number => {
  const m = typeof s === "string" ? Date.parse(s) : NaN;
  return isNaN(m) ? 0 : m;
};

const LAB_MAP: Record<string, { analyte: Analyte; unit: string }> = {
  "LK-CREAT": { analyte: "creatinine", unit: "mg/dL" },
  "LK-EGFR09N": { analyte: "egfr", unit: "mL/min/1.73m2" },
  "LK-EGFR21": { analyte: "egfr", unit: "mL/min/1.73m2" },
  "LK-NA": { analyte: "sodium", unit: "mmol/L" },
  "LK-K": { analyte: "potassium", unit: "mmol/L" },
  "LK-GLU": { analyte: "glucose", unit: "mg/dL" },
  "LK-A1C": { analyte: "a1c", unit: "%" },
  "LK-UACR": { analyte: "uacr", unit: "mg/g" },
  "LK-WBC": { analyte: "wbc", unit: "10*3/uL" },
  "LK-HGB": { analyte: "hemoglobin", unit: "g/dL" },
  "LK-PLT": { analyte: "platelets", unit: "10*3/uL" },
  "LK-CHOL": { analyte: "cholesterol", unit: "mg/dL" },
  "LK-TRIG": { analyte: "triglycerides", unit: "mg/dL" },
  "LK-HDL": { analyte: "hdl", unit: "mg/dL" },
  "LK-LDLC": { analyte: "ldl", unit: "mg/dL" },
};

const SALTS = new Set(["potassium", "sodium", "hydrochloride", "hcl", "mesylate", "maleate", "besylate", "tartrate",
  "succinate", "sulfate", "calcium", "magnesium", "hydrobromide", "citrate", "phosphate", "acetate", "fumarate"]);

function ingredientOf(name: string): string {
  const toks = name.toLowerCase().replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const t of toks) {
    if (/^\d/.test(t)) break;
    out.push(t);
  }
  while (out.length > 1 && SALTS.has(out[out.length - 1])) out.pop();
  return out.join(" ");
}

function ckdFromIcd(code: string): any {
  const m: Record<string, string> = { "N18.1": "G1", "N18.2": "G2", "N18.30": "G3a", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
  return m[code];
}

function sensitivityOf(icd: string): Sensitivity[] | undefined {
  const c = icd.toUpperCase();
  if (/^F(1[0-9])/.test(c)) return ["substance-use"];
  if (/^F/.test(c)) return ["mental-health"];
  if (/^(B20|Z21|A5[0-9]|A6[0-4])/.test(c)) return ["hiv-sti"];
  if (/^(O|Z3[0-9])/.test(c)) return ["sexual-reproductive-health"];
  return undefined;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const inScope = (items || []).filter((i) => i && i.recorded && chicagoDate(i.recorded) !== "" && chicagoDate(i.recorded) <= asOf);
    const dead = new Set<string>();
    for (const i of inScope) {
      for (const s of i.supersedes ?? []) dead.add(i.issuer + "|" + s);
      for (const s of i.retracts ?? []) dead.add(i.issuer + "|" + s);
    }
    const cur = inScope.filter((i) => !dead.has(i.issuer + "|" + i.id));

    const ents: Ent[] = [];
    for (const item of cur) {
      for (const [id, e] of Object.entries(item.payload ?? {})) {
        if (e && typeof e === "object" && typeof (e as any).type === "string") ents.push({ item, id, e });
      }
    }
    const of = (t: string) => ents.filter((x) => x.e.type === t);
    const ev = (...x: Ent[]): Evidence => x.map((y) => ({ item_id: y.item.id, entry_id: y.id }));

    labs(cur, rows.labs);
    vitals(of("VITAL"), of("CLINIC_VISIT"), rows.vitals, ev);
    meds(of("MED_ORDER"), of("MED_STATUS_HIST"), of("CLINIC_VISIT"), rows.medications, ev);
    problems(of("VISIT_DX"), of("CLINIC_VISIT"), of("MED_ORDER"), rows, ev);
  } catch {
    // return what we have
  }
  return rows;
}

function labs(cur: FolioItem[], out: LabResultRow[]) {
  const best = new Map<string, LabResultRow & { _rank: number }>();
  for (const item of cur) {
    const p = item.payload ?? {};
    const vals = Object.entries(p).filter(([, e]: any) => e && typeof e === "object");
    const req: any = vals.map(([, e]) => e).find((e: any) => e.type === "LAB_REQ");
    if (!req) continue;
    const orders = new Map<string, any>();
    for (const [, e] of vals as any) if (e.type === "LAB_ORDER") orders.set(e.ORDER_ID, e);
    for (const [eid, r] of vals as any) {
      if (r.type !== "LAB_RESULT") continue;
      const o = orders.get(r.ORDER_ID);
      if (!o || o.ORDER_STATUS === 5 || o.ORDER_STATUS === 9) continue;
      if (r.RESULT_STATUS === "C" || r.RESULT_STATUS === "X") continue;
      const map = LAB_MAP[r.TEST_CODE];
      if (!map) continue;
      const text = String(r.VALUE_TEXT ?? "").trim();
      let value: number; let comparator: any;
      const m = /^(<=|>=|<|>)\s*(\d+(?:\.\d+)?)$/.exec(text);
      if (m) { comparator = m[1]; value = parseFloat(m[2]); }
      else if (/^\d+(?:\.\d+)?$/.test(text)) value = parseFloat(text);
      else continue;
      const prelim = r.RESULT_STATUS === "P";
      const row: LabResultRow & { _rank: number } = {
        analyte: map.analyte, value, unit: map.unit, collected: req.COLLECTED_AT,
        status: prelim ? "preliminary" : "final",
        evidence: [{ item_id: item.id, entry_id: eid }], _rank: prelim ? 0 : 1,
      };
      if (comparator) row.comparator = comparator;
      if (map.analyte === "egfr") {
        const c = String(r.COMMENT_TEXT ?? "");
        row.egfr_equation = /2021/.test(c) ? "ckd-epi-2021" : /2009/.test(c) ? "ckd-epi-2009" : /MDRD/i.test(c) ? "mdrd"
          : r.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : r.TEST_CODE === "LK-EGFR09N" ? "ckd-epi-2009" : "unknown";
      }
      if (r.LOINC) row.loinc = r.LOINC;
      const prev = best.get(r.RESULT_ID);
      if (!prev || row._rank >= prev._rank) best.set(r.RESULT_ID, row);
    }
  }
  const arr = [...best.values()].sort((a, b) => ts(a.collected) - ts(b.collected) || a.analyte.localeCompare(b.analyte));
  for (const r of arr) { const { _rank, ...rest } = r; out.push(rest); }
}

function vitals(vs: Ent[], visits: Ent[], out: VitalRow[], ev: (...x: Ent[]) => Evidence) {
  const byVisit = new Map<string, Ent[]>();
  for (const v of vs) {
    if (typeof v.e.VALUE_NUM !== "number") continue;
    const k = v.e.VISIT_ID;
    byVisit.set(k, [...(byVisit.get(k) ?? []), v]);
  }
  for (const [vid, list] of byVisit) {
    list.sort((a, b) => ts(a.e.TAKEN_AT) - ts(b.e.TAKEN_AT));
    const pick = (code: string, n: number) => list.find((x) => x.e.VITAL_CODE === code && x.e.READING_NO === n);
    const s1 = pick("BPS", 1), d1 = pick("BPD", 1), s2 = pick("BPS", 2), d2 = pick("BPD", 2);
    const hr = list.find((x) => x.e.VITAL_CODE === "HR");
    const wt = list.find((x) => x.e.VITAL_CODE === "WT");
    const used = [s1, d1, s2, d2, hr, wt].filter(Boolean) as Ent[];
    if (!used.length) continue;
    const first = s1 ?? d1 ?? [...used].sort((a, b) => ts(a.e.TAKEN_AT) - ts(b.e.TAKEN_AT))[0];
    const row: VitalRow = { setting: "clinic", local_time: String(first.e.TAKEN_AT).slice(0, 16), evidence: ev(...used) };
    if (s1) row.systolic_mmhg = s1.e.VALUE_NUM;
    if (d1) row.diastolic_mmhg = d1.e.VALUE_NUM;
    if (s2) row.repeat_systolic_mmhg = s2.e.VALUE_NUM;
    if (d2) row.repeat_diastolic_mmhg = d2.e.VALUE_NUM;
    if (hr) row.pulse_bpm = hr.e.VALUE_NUM;
    if (wt) row.weight_kg = Math.round(wt.e.VALUE_NUM * 10) / 10;
    out.push(row);
  }
  out.sort((a, b) => a.local_time.localeCompare(b.local_time));
}

function meds(orders: Ent[], hists: Ent[], visits: Ent[], out: MedicationRow[], ev: (...x: Ent[]) => Evidence) {
  const visitAt = new Map<string, number>();
  for (const v of visits) visitAt.set(v.e.VISIT_ID, ts(v.e.VISIT_AT));
  const histBy = new Map<string, Ent[]>();
  for (const h of hists) histBy.set(h.e.RX_ID, [...(histBy.get(h.e.RX_ID) ?? []), h]);

  type Line = { o: Ent; h?: Ent; status: number; event: number };
  const lines: Line[] = [];
  const seen = new Set<string>();
  for (const o of orders) {
    if (seen.has(o.e.RX_ID)) continue;
    seen.add(o.e.RX_ID);
    const hs = (histBy.get(o.e.RX_ID) ?? []).sort((a, b) => ts(a.e.CHANGED_AT) - ts(b.e.CHANGED_AT));
    const h = hs[hs.length - 1];
    const status = h ? h.e.NEW_STATUS : o.e.MED_STATUS;
    if (status === 9) continue;
    if (hs.some((x) => x.e.NEW_STATUS === 9)) continue;
    const event = h ? ts(h.e.CHANGED_AT) : (visitAt.get(o.e.VISIT_ID) || ts(o.e.START_DATE));
    lines.push({ o, h, status, event });
  }
  const byIng = new Map<string, Line>();
  for (const l of lines) {
    const ing = ingredientOf(String(l.o.e.DRUG_NAME ?? "")) || l.o.e.LV_DRUG_ID;
    const p = byIng.get(ing);
    if (!p || l.event > p.event) byIng.set(ing, l);
  }
  for (const [ing, l] of byIng) {
    const e = l.o.e;
    const status = l.status === 1 ? "active" : l.status === 2 ? "stopped" : l.status === 3 ? "held" : "unknown";
    const row: MedicationRow = { ingredient: ing, drug_name: String(e.DRUG_NAME), status, patient_reported: false, evidence: ev(l.o, ...(l.h ? [l.h] : [])) };
    if (status === "active") {
      const d = l.h ? String(l.h.e.CHANGED_AT).slice(0, 10) : e.START_DATE;
      if (d) row.status_since = d;
    } else if (l.h) row.status_since = String(l.h.e.CHANGED_AT).slice(0, 10);
    const u = e.DOSE_UNIT === "unit" ? "units" : e.DOSE_UNIT;
    if (typeof e.DOSE_QTY === "number" && ["mg", "mcg", "units", "mL"].includes(u)) row.dose = { value: e.DOSE_QTY, unit: u };
    if (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(e.FREQ_CODE)) row.frequency = e.FREQ_CODE;
    if (l.h && (status === "stopped" || status === "held")) {
      if (status === "stopped") {
        const rc = l.h.e.REASON_CODE;
        row.stop_reason = rc === "ADR" ? "adverse_reaction" : rc === "PT" ? "patient_choice" : rc === "ERR" ? undefined : "other";
        if (!row.stop_reason) delete row.stop_reason;
      }
      if (l.h.e.COMMENT_TEXT) row.status_reason_text = l.h.e.COMMENT_TEXT;
    }
    out.push(row);
  }
  out.sort((a, b) => (a.ingredient ?? "").localeCompare(b.ingredient ?? ""));
}

function problems(dxs: Ent[], visits: Ent[], orders: Ent[], rows: ViewRows, ev: (...x: Ent[]) => Evidence) {
  const visitBy = new Map<string, Ent>();
  for (const v of visits) visitBy.set(v.e.VISIT_ID, v);
  const when = (d: Ent) => ts(visitBy.get(d.e.VISIT_ID)?.e.VISIT_AT) || ts(d.item.effective);
  const key = (code: string) => (/^N18/.test(code) ? "N18" : code);
  const latest = new Map<string, Ent>();
  for (const d of dxs) {
    const k = key(String(d.e.ICD10CM ?? ""));
    if (!k) continue;
    const p = latest.get(k);
    if (!p || when(d) >= when(p)) latest.set(k, d);
  }
  // latest recorded CKD categories
  const sortedVisits = [...visits].sort((a, b) => ts(a.e.VISIT_AT) - ts(b.e.VISIT_AT));
  const lastG = [...sortedVisits].reverse().find((v) => v.e.CKD_G);
  const lastA = [...sortedVisits].reverse().find((v) => v.e.CKD_A);

  for (const [k, d] of latest) {
    const e = d.e;
    if (e.DX_STATUS !== "A" && e.DX_STATUS !== "H") continue;
    const icd = String(e.ICD10CM);
    const text = String(e.DX_TEXT ?? "");
    const drugCaused = /^T(3[6-9]|4\d|50)/i.test(icd) && /adverse effect/i.test(text);
    const assoc = /(.+?)[- ]associated\b/i.exec(text);
    if (drugCaused || assoc) {
      const subst = drugCaused ? (/adverse effect of\s+(.+?)(?:,|\(|$)/i.exec(text)?.[1] ?? text) : assoc![1];
      allergy(rows, d, subst.trim(), text, orders, ev);
    }
    if (drugCaused && !/(ketoacidosis|angioedema|hyperkal|acidosis|cough|rash)/i.test(text)) continue;
    const row: ProblemRow = { condition: text, icd10cm: icd, status: e.DX_STATUS === "H" ? "resolved" : "active", evidence: ev(d) };
    if (k === "N18") {
      const g = lastG?.e.CKD_G ?? ckdFromIcd(icd);
      if (g) row.ckd_stage = g;
      if (lastA) row.albuminuria = lastA.e.CKD_A;
      row.evidence = ev(d, ...(lastG && lastG.item !== d.item ? [lastG] : []));
    }
    const s = sensitivityOf(icd);
    if (s) row.sensitivity = s;
    rows.problems.push(row);
  }
  rows.problems.sort((a, b) => a.condition.localeCompare(b.condition));
}

function allergy(rows: ViewRows, d: Ent, subst: string, text: string, orders: Ent[], ev: (...x: Ent[]) => Evidence) {
  let s = subst.toLowerCase();
  const classKw: [RegExp, RegExp][] = [
    [/sglt2/, /gliflozin/i], [/ace inhibitor/, /pril\b/i], [/\barb\b|angiotensin receptor/, /sartan/i],
    [/\bstatin/, /statin/i], [/metformin|biguanide/, /metformin/i],
  ];
  for (const [cls, drug] of classKw) {
    if (cls.test(s) && !/^[a-z]+(pril|sartan|gliflozin|statin)$/.test(s)) {
      const same = orders.filter((o) => o.item === d.item && drug.test(String(o.e.DRUG_NAME)));
      const ings = new Set(same.map((o) => ingredientOf(String(o.e.DRUG_NAME))));
      if (ings.size === 1) s = [...ings][0];
    }
  }
  const angio = /angioedema/i.test(text), cough = /cough/i.test(text);
  const rt = angio || /rash|urticaria|anaphyla|hives/i.test(text) ? "hypersensitivity" : cough ? "side_effect" : "serious_adverse_event";
  const mech = angio || cough || /ketoacidosis/i.test(text) ? "non_immune" : "unknown";
  rows.allergies.push({
    substance: s, reaction_type: rt, mechanism: mech, reaction: text,
    criticality: rt === "side_effect" ? "low" : "high", evidence: ev(d),
  });
}
