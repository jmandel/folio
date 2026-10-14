import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow, Analyte,
} from "../in/views/views";

const TZ = "America/Chicago";

function chicagoParts(ms: number): { date: string; time: string } | undefined {
  if (!isFinite(ms)) return undefined;
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const x of f.formatToParts(new Date(ms))) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}
function localDate(ts: string | undefined): string | undefined {
  if (!ts) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(ts)) return ts;
  return chicagoParts(Date.parse(ts))?.date;
}
function localDateTime(ts: string): string | undefined {
  const p = chicagoParts(Date.parse(ts));
  return p ? `${p.date}T${p.time}` : undefined;
}
function ms(ts: string | undefined): number {
  const n = ts ? Date.parse(ts) : NaN;
  return isFinite(n) ? n : 0;
}

interface Entry { item: FolioItem; id: string; e: any }

const ANALYTE: Record<string, { a: Analyte; unit: string; ui: string }> = {
  "LK-CREAT": { a: "creatinine", unit: "mg/dL", ui: "mg/dL" },
  "LK-EGFR21": { a: "egfr", unit: "mL/min/1.73m2", ui: "mL/min/1.73m2" },
  "LK-EGFR09N": { a: "egfr", unit: "mL/min/1.73m2", ui: "mL/min/1.73m2" },
  "LK-NA": { a: "sodium", unit: "mmol/L", ui: "mmol/L" },
  "LK-K": { a: "potassium", unit: "mmol/L", ui: "mmol/L" },
  "LK-GLU": { a: "glucose", unit: "mg/dL", ui: "mg/dL" },
  "LK-A1C": { a: "a1c", unit: "%", ui: "%" },
  "LK-UACR": { a: "uacr", unit: "mg/g", ui: "mg/g" },
  "LK-WBC": { a: "wbc", unit: "10*3/uL", ui: "K/uL" },
  "LK-HGB": { a: "hemoglobin", unit: "g/dL", ui: "g/dL" },
  "LK-PLT": { a: "platelets", unit: "10*3/uL", ui: "K/uL" },
  "LK-CHOL": { a: "cholesterol", unit: "mg/dL", ui: "mg/dL" },
  "LK-TRIG": { a: "triglycerides", unit: "mg/dL", ui: "mg/dL" },
  "LK-HDL": { a: "hdl", unit: "mg/dL", ui: "mg/dL" },
  "LK-LDLC": { a: "ldl", unit: "mg/dL", ui: "mg/dL" },
};

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "succinate", "tartrate", "mesylate",
  "calcium", "magnesium", "sulfate", "phosphate", "acetate", "citrate", "fumarate", "hydrobromide", "bromide",
  "medoxomil", "cilexetil", "dihydrate", "monohydrate", "anhydrous",
]);
const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", kerendia: "finerenone", cozaar: "losartan",
  lantus: "insulin glargine", glucophage: "metformin", norvasc: "amlodipine", lasix: "furosemide",
  invokana: "canagliflozin", ozempic: "semaglutide", januvia: "sitagliptin", zestril: "lisinopril",
  diovan: "valsartan", benicar: "olmesartan", lokelma: "sodium zirconium cyclosilicate", lipitor: "atorvastatin",
};

function ingredientOf(name: string): string | undefined {
  const toks = name.toLowerCase().replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const t of toks) {
    if (/^\d/.test(t)) break;
    out.push(t);
  }
  while (out.length > 1 && SALTS.has(out[out.length - 1])) out.pop();
  if (!out.length) return undefined;
  if (out.length === 1 && BRANDS[out[0]]) return BRANDS[out[0]];
  return out.join(" ");
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    run(items, asOf, rows);
  } catch (_) {
    // skip what cannot be read
  }
  return rows;
}

function run(all: FolioItem[], asOf: string, rows: ViewRows): void {
  const inScope = all.filter((it) => {
    const d = localDate(it.recorded);
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const id of [...(it.supersedes ?? []), ...(it.retracts ?? [])]) dead.add(it.issuer + "|" + id);
  }
  const current = inScope.filter((it) => !dead.has(it.issuer + "|" + it.id));

  const entries: Entry[] = [];
  for (const item of current) {
    for (const [id, e] of Object.entries(item.payload ?? {})) {
      if (e && typeof e === "object" && typeof (e as any).type === "string") entries.push({ item, id, e });
    }
  }

  labs(entries, rows);
  vitals(entries, rows);
  problems(entries, rows);
  meds(entries, rows);
}

// ───────────── labs

const STATUS_RANK: Record<string, number> = { P: 1, F: 2, A: 3 };

function labs(entries: Entry[], rows: ViewRows): void {
  const orders = new Map<string, Entry>();
  const reqs = new Map<string, Entry>(); // by item id
  for (const en of entries) {
    if (en.e.type === "LAB_ORDER") orders.set(en.e.ORDER_ID, en);
    else if (en.e.type === "LAB_REQ") reqs.set(en.item.id, en);
  }
  const best = new Map<string, { en: Entry; row: LabResultRow }>();
  for (const en of entries) {
    const r = en.e;
    if (r.type !== "LAB_RESULT") continue;
    const st = r.RESULT_STATUS;
    if (!(st in STATUS_RANK)) continue;
    const ord = orders.get(r.ORDER_ID);
    if (!ord || (ord.e.ORDER_STATUS !== 3 && ord.e.ORDER_STATUS !== 4)) continue;
    const map = ANALYTE[r.TEST_CODE];
    if (!map) continue;
    if (r.UNIT_CODE !== map.ui) continue;
    const m = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(r.VALUE_TEXT ?? ""));
    if (!m) continue;
    const req = reqs.get(en.item.id);
    const collected = req?.e.COLLECTED_AT ?? en.item.effective;
    if (!collected) continue;
    const row: LabResultRow = {
      analyte: map.a,
      value: Number(m[2]),
      unit: map.unit,
      collected,
      status: st === "P" ? "preliminary" : "final",
      evidence: [{ item_id: en.item.id, entry_id: en.id }],
    };
    if (m[1]) row.comparator = m[1] as LabResultRow["comparator"];
    if (r.LOINC) row.loinc = r.LOINC;
    if (map.a === "egfr") {
      const c = String(r.COMMENT_TEXT ?? "");
      row.egfr_equation = /mdrd/i.test(c) ? "mdrd"
        : /2021/.test(c) ? "ckd-epi-2021"
        : /2009/.test(c) ? "ckd-epi-2009"
        : r.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021"
        : r.TEST_CODE === "LK-EGFR09N" ? "ckd-epi-2009" : "unknown";
    }
    const prev = best.get(r.RESULT_ID);
    if (!prev || STATUS_RANK[st] > STATUS_RANK[prev.en.e.RESULT_STATUS]
      || (STATUS_RANK[st] === STATUS_RANK[prev.en.e.RESULT_STATUS] && ms(en.item.recorded) > ms(prev.en.item.recorded))) {
      best.set(r.RESULT_ID, { en, row });
    }
  }
  const out = [...best.values()].map((b) => b.row);
  out.sort((a, b) => ms(a.collected) - ms(b.collected) || a.analyte.localeCompare(b.analyte));
  rows.labs.push(...out);
}

// ───────────── vitals

function vitals(entries: Entry[], rows: ViewRows): void {
  const byVisit = new Map<string, Entry[]>();
  for (const en of entries) {
    if (en.e.type !== "VITAL") continue;
    const k = en.item.id + "|" + en.e.VISIT_ID;
    if (!byVisit.has(k)) byVisit.set(k, []);
    byVisit.get(k)!.push(en);
  }
  for (const list of byVisit.values()) {
    const pick = (code: string, n: number) =>
      list.filter((x) => x.e.VITAL_CODE === code && x.e.READING_NO === n && typeof x.e.VALUE_NUM === "number")[0];
    const s1 = pick("BPS", 1), d1 = pick("BPD", 1), s2 = pick("BPS", 2), d2 = pick("BPD", 2);
    const hr = pick("HR", 1), wt = pick("WT", 1);
    const used = [s1, d1, s2, d2, hr, wt].filter((x): x is Entry => !!x);
    if (!used.length) continue;
    const first = s1 ?? d1 ?? used.slice().sort((a, b) => ms(a.e.TAKEN_AT) - ms(b.e.TAKEN_AT))[0];
    const lt = localDateTime(first.e.TAKEN_AT);
    if (!lt) continue;
    const row: VitalRow = { setting: "clinic", local_time: lt, evidence: used.map((x) => ({ item_id: x.item.id, entry_id: x.id })) };
    if (s1) row.systolic_mmhg = s1.e.VALUE_NUM;
    if (d1) row.diastolic_mmhg = d1.e.VALUE_NUM;
    if (s2) row.repeat_systolic_mmhg = s2.e.VALUE_NUM;
    if (d2) row.repeat_diastolic_mmhg = d2.e.VALUE_NUM;
    if (hr) row.pulse_bpm = hr.e.VALUE_NUM;
    if (wt) row.weight_kg = Math.round(wt.e.VALUE_NUM * 10) / 10;
    rows.vitals.push(row);
  }
  rows.vitals.sort((a, b) => a.local_time.localeCompare(b.local_time));
}

// ───────────── problems / adverse effects

function visitTime(en: Entry, visits: Map<string, Entry>): number {
  const v = visits.get(en.item.id);
  return ms(v?.e.VISIT_AT ?? en.item.effective) || ms(en.item.recorded);
}

function ckdStageFromCode(code: string): ProblemRow["ckd_stage"] | undefined {
  if (code === "N18.1") return "G1";
  if (code === "N18.2") return "G2";
  if (code === "N18.31") return "G3a";
  if (code === "N18.32") return "G3b";
  if (code === "N18.4") return "G4";
  if (code === "N18.5") return "G5";
  return undefined;
}

function problems(entries: Entry[], rows: ViewRows): void {
  const visits = new Map<string, Entry>();
  for (const en of entries) if (en.e.type === "CLINIC_VISIT") visits.set(en.item.id, en);

  const dxs = entries.filter((en) => en.e.type === "VISIT_DX" && typeof en.e.ICD10CM === "string");
  const groups = new Map<string, Entry[]>();
  for (const en of dxs) {
    const code: string = en.e.ICD10CM;
    const key = code.startsWith("N18") ? "CKD" : code;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(en);
  }
  const byTime = (a: Entry, b: Entry) => visitTime(a, visits) - visitTime(b, visits) || ms(a.item.recorded) - ms(b.item.recorded);

  // latest CKD category / albuminuria assessed at any contact
  const vlist = [...visits.values()].sort(byTime);
  let ckdG: Entry | undefined, ckdA: Entry | undefined;
  for (const v of vlist) {
    if (v.e.CKD_G) ckdG = v;
    if (v.e.CKD_A) ckdA = v;
  }

  for (const [key, list] of groups) {
    list.sort(byTime);
    const confirmed = list.filter((x) => x.e.DX_STATUS !== "P");
    const latest = confirmed[confirmed.length - 1];
    if (!latest) continue;
    const st = latest.e.DX_STATUS;
    if (st !== "A" && st !== "H") continue;
    const code: string = latest.e.ICD10CM;

    if (/^T(3[6-9]|4[0-9]|50)\./.test(code)) {
      if (st !== "A") continue;
      const text: string = latest.e.DX_TEXT ?? "";
      const m = /adverse effect of (.+?)(?:,|$)/i.exec(text);
      const row: AllergyIntoleranceRow = {
        substance: (m ? m[1] : text).toLowerCase().trim(),
        type: "adverse_reaction",
        reaction: text,
        criticality: "unknown",
        evidence: [{ item_id: latest.item.id, entry_id: latest.id }],
      };
      rows.allergies.push(row);
      continue;
    }

    const row: ProblemRow = {
      condition: latest.e.DX_TEXT ?? code,
      icd10cm: code,
      status: st === "A" ? "active" : "resolved",
      evidence: list.map((x) => ({ item_id: x.item.id, entry_id: x.id })),
    };
    if (key === "CKD") {
      const g = ckdG?.e.CKD_G ?? ckdStageFromCode(code);
      if (g) row.ckd_stage = g;
      if (ckdA) row.albuminuria = ckdA.e.CKD_A;
    }
    rows.problems.push(row);
  }
  rows.problems.sort((a, b) => a.condition.localeCompare(b.condition));
}

// ───────────── medications

const FREQ: Record<string, MedicationRow["frequency"]> = {
  QD: "QD", BID: "BID", TID: "TID", QHS: "QHS", QW: "QW", PRN: "PRN",
};
const UNITS: Record<string, "mg" | "mcg" | "units" | "mL"> = { mg: "mg", mcg: "mcg", unit: "units", mL: "mL" };

function meds(entries: Entry[], rows: ViewRows): void {
  const visits = new Map<string, Entry>();
  for (const en of entries) if (en.e.type === "CLINIC_VISIT") visits.set(en.item.id, en);

  const hist = new Map<string, Entry[]>();
  for (const en of entries) {
    if (en.e.type !== "MED_STATUS_HIST") continue;
    if (!hist.has(en.e.RX_ID)) hist.set(en.e.RX_ID, []);
    hist.get(en.e.RX_ID)!.push(en);
  }
  const histTime = (h: Entry) => ms(h.e.CHANGED_AT) || ms(h.item.recorded);

  interface Cand { row: MedicationRow; when: number; ing: string }
  const cands: Cand[] = [];
  for (const en of entries) {
    const o = en.e;
    if (o.type !== "MED_ORDER") continue;
    if (o.ROUTE === "IV") continue;
    const hs = (hist.get(o.RX_ID) ?? []).slice().sort((a, b) => histTime(a) - histTime(b));
    if (o.MED_STATUS === 9 || hs.some((h) => h.e.NEW_STATUS === 9 || h.e.REASON_CODE === "ERR")) continue;
    const last = hs[hs.length - 1];
    const status = (last ? last.e.NEW_STATUS : o.MED_STATUS) as number;
    const orderTime = ms(visits.get(en.item.id)?.e.VISIT_AT ?? en.item.effective);
    const when = last ? histTime(last) : orderTime;
    const name: string = o.DRUG_NAME ?? "";
    const ing = ingredientOf(name);
    const row: MedicationRow = {
      drug_name: name,
      status: status === 1 ? "active" : status === 3 ? "held" : status === 2 ? "stopped" : "unknown",
      patient_reported: false,
      evidence: [{ item_id: en.item.id, entry_id: en.id }],
    };
    if (ing) row.ingredient = ing;
    if (last) row.evidence.push({ item_id: last.item.id, entry_id: last.id });
    const since = last ? localDate(last.e.CHANGED_AT) : o.START_DATE;
    if (since) row.status_since = since;
    const unit = UNITS[o.DOSE_UNIT];
    if (unit && typeof o.DOSE_QTY === "number") row.dose = { value: o.DOSE_QTY, unit };
    const fq = FREQ[o.FREQ_CODE];
    if (fq) row.frequency = fq;
    if (last && (row.status === "held" || row.status === "stopped")) {
      if (last.e.COMMENT_TEXT) row.status_reason_text = last.e.COMMENT_TEXT;
      if (row.status === "stopped") {
        const rc = last.e.REASON_CODE;
        row.stop_reason = rc === "ADR" ? "adverse_reaction" : rc === "PT" ? "patient_choice" : "other";
      }
    }
    cands.push({ row, when, ing: ing ?? "rx:" + o.RX_ID });
  }
  const bestBy = new Map<string, Cand>();
  for (const c of cands) {
    const p = bestBy.get(c.ing);
    if (!p || c.when >= p.when) bestBy.set(c.ing, c);
  }
  rows.medications.push(...[...bestBy.values()].map((c) => c.row).sort((a, b) => a.drug_name.localeCompare(b.drug_name)));
}
