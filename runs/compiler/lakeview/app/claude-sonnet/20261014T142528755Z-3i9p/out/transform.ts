import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Analyte, Evidence, Sensitivity,
} from "../in/views/views";

const TZ = "America/Chicago";
const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

function localParts(ts: string): { date: string; time: string } | null {
  if (typeof ts !== "string") return null;
  const hasTime = ts.length > 10;
  const ms = Date.parse(ts);
  if (isNaN(ms)) return null;
  if (!hasTime) return { date: ts.slice(0, 10), time: "" };
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}
const localDate = (ts: string) => localParts(ts)?.date ?? "";
const ms = (ts: string) => { const v = Date.parse(ts); return isNaN(v) ? 0 : v; };

type Entry = { item: FolioItem; id: string; e: any };

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = items.filter((i) => i && i.recorded && localDate(i.recorded) !== "" && localDate(i.recorded) <= asOf);
  const dead = new Set<string>();
  for (const i of inScope) {
    for (const s of i.supersedes ?? []) dead.add(i.issuer + "|" + s);
    for (const s of i.retracts ?? []) dead.add(i.issuer + "|" + s);
  }
  return inScope.filter((i) => !dead.has(i.issuer + "|" + i.id));
}

function entriesOf(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    for (const [id, e] of Object.entries(item.payload ?? {})) {
      if (e && typeof e === "object" && (e as any).type === type) out.push({ item, id, e });
    }
  }
  return out;
}

// ───────────── labs
const LAB_MAP: Record<string, Analyte> = {
  "LK-CREAT": "creatinine", "LK-EGFR09N": "egfr", "LK-EGFR21": "egfr", "LK-NA": "sodium",
  "LK-K": "potassium", "LK-GLU": "glucose", "LK-A1C": "a1c", "LK-UACR": "uacr",
  "LK-WBC": "wbc", "LK-HGB": "hemoglobin", "LK-PLT": "platelets", "LK-CHOL": "cholesterol",
  "LK-TRIG": "triglycerides", "LK-HDL": "hdl", "LK-LDLC": "ldl",
};
const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const rank = (s: string) => (s === "P" ? 1 : 2);

function mapLabs(cur: FolioItem[]): LabResultRow[] {
  const best = new Map<string, { row: LabResultRow; rk: number; at: number }>();
  for (const item of cur) {
    const es = Object.entries(item.payload ?? {}) as [string, any][];
    const req = es.find(([, e]) => e?.type === "LAB_REQ")?.[1];
    if (!req) continue;
    const okOrders = new Set<string>();
    for (const [, e] of es) if (e?.type === "LAB_ORDER" && (e.ORDER_STATUS === 3 || e.ORDER_STATUS === 4)) okOrders.add(e.ORDER_ID);
    for (const [id, r] of es) {
      if (r?.type !== "LAB_RESULT" || !okOrders.has(r.ORDER_ID)) continue;
      if (r.RESULT_STATUS !== "P" && r.RESULT_STATUS !== "F" && r.RESULT_STATUS !== "A") continue;
      const analyte = LAB_MAP[r.TEST_CODE];
      if (!analyte) continue;
      const m = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(r.VALUE_TEXT ?? ""));
      if (!m) continue;
      const value = Number(m[2]);
      if (!isFinite(value)) continue;
      let unit = UNITS[analyte];
      const row: LabResultRow = {
        analyte, value, unit, collected: req.COLLECTED_AT,
        status: r.RESULT_STATUS === "P" ? "preliminary" : "final",
        evidence: [{ item_id: item.id, entry_id: id }],
      } as LabResultRow;
      if (m[1]) row.comparator = m[1] as any;
      if (analyte === "egfr") {
        const c = String(r.COMMENT_TEXT ?? "");
        row.egfr_equation = /2021/.test(c) ? "ckd-epi-2021" : /CKD-EPI/i.test(c) ? "ckd-epi-2009"
          : /MDRD/i.test(c) ? "mdrd" : r.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : r.TEST_CODE.startsWith("LK-EGFR09") ? "ckd-epi-2009" : "unknown";
        if (r.TEST_CODE.startsWith("LK-EGFR09") && row.egfr_equation !== "mdrd") {
          // Lakeview's LOINC for these rows is an MDRD code; do not pass it on
        } else if (r.LOINC) row.loinc = r.LOINC;
      } else if (r.LOINC) row.loinc = r.LOINC;
      const rk = rank(r.RESULT_STATUS);
      const at = ms(r.RESULTED_AT);
      const prev = best.get(r.RESULT_ID);
      if (!prev || rk > prev.rk || (rk === prev.rk && at >= prev.at)) best.set(r.RESULT_ID, { row, rk, at });
    }
  }
  return [...best.values()].map((b) => b.row).sort((a, b) => ms(a.collected) - ms(b.collected) || a.analyte.localeCompare(b.analyte));
}

// ───────────── vitals
function mapVitals(cur: FolioItem[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const item of cur) {
    const vs = (Object.entries(item.payload ?? {}) as [string, any][]).filter(
      ([, e]) => e?.type === "VITAL" && typeof e.VALUE_NUM === "number");
    if (!vs.length) continue;
    const find = (code: string, n: number) => vs.find(([, e]) => e.VITAL_CODE === code && e.READING_NO === n);
    const bps = find("BPS", 1), bpd = find("BPD", 1), bps2 = find("BPS", 2), bpd2 = find("BPD", 2);
    const hr = find("HR", 1), wt = find("WT", 1);
    const first = bps ?? bpd ?? [...vs].sort((a, b) => ms(a[1].TAKEN_AT) - ms(b[1].TAKEN_AT))[0];
    const lp = localParts(first[1].TAKEN_AT);
    if (!lp) continue;
    const used: [string, any][] = [];
    const row: VitalRow = { setting: "clinic", local_time: `${lp.date}T${lp.time}`, evidence: [] };
    const take = (x: [string, any] | undefined) => { if (x) used.push(x); return x?.[1].VALUE_NUM as number | undefined; };
    const a = take(bps); if (a !== undefined) row.systolic_mmhg = a;
    const b = take(bpd); if (b !== undefined) row.diastolic_mmhg = b;
    const c = take(bps2); if (c !== undefined) row.repeat_systolic_mmhg = c;
    const d = take(bpd2); if (d !== undefined) row.repeat_diastolic_mmhg = d;
    const h = take(hr); if (h !== undefined) row.pulse_bpm = h;
    const w = take(wt); if (w !== undefined) row.weight_kg = Math.round(w * 10) / 10;
    if (!used.length) continue;
    row.evidence = used.map(([id]) => ({ item_id: item.id, entry_id: id }));
    rows.push(row);
  }
  return rows.sort((a, b) => a.local_time.localeCompare(b.local_time));
}

// ───────────── problems & allergies
function ckdStageFromCode(code: string): ProblemRow["ckd_stage"] | undefined {
  const m: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
  return m[code];
}
function sensFor(icd: string): Sensitivity[] | undefined {
  if (/^F1[0-9]/.test(icd)) return ["substance-use"];
  if (/^F/.test(icd)) return ["mental-health"];
  if (/^(B20|Z21|A5[0-9]|A6[0-4])/.test(icd)) return ["hiv-sti"];
  if (/^(O|Z3[0-9])/.test(icd)) return ["sexual-reproductive-health"];
  return undefined;
}
function parseOnset(item: FolioItem, id: string): { value: string; precision: "year" | "month" | "day" } | undefined {
  const re = new RegExp(`<ref id="${id}">([\\s\\S]*?)</ref>`);
  const t = re.exec(item.narrative ?? "")?.[1];
  if (!t) return undefined;
  let m = /since\s+(\d{1,2})\/(\d{4})/i.exec(t);
  if (m) return { value: `${m[2]}-${m[1].padStart(2, "0")}`, precision: "month" };
  m = /since\s+(\d{4})/i.exec(t);
  if (m) return { value: m[1], precision: "year" };
  return undefined;
}

const CLASS_DRUGS: [RegExp, RegExp][] = [
  [/sglt2/i, /(gliflozin)/i], [/ace inhibitor/i, /(pril)\b/i], [/arb|angiotensin receptor/i, /(sartan)\b/i],
  [/statin/i, /(statin)\b/i], [/mineralocorticoid|mra/i, /(finerenone|spironolactone|eplerenone)/i],
];

function ingredientOf(name: string): string {
  return name.replace(/\s+\d.*$/, "").trim().toLowerCase();
}

function mapProblems(cur: FolioItem[], meds: Entry[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const visits = entriesOf(cur, "CLINIC_VISIT").sort((a, b) => ms(a.e.VISIT_AT) - ms(b.e.VISIT_AT));
  const visitOf = new Map<string, Entry>();
  for (const v of visits) visitOf.set(v.item.id, v);
  const dxs = entriesOf(cur, "VISIT_DX").map((d) => ({ ...d, at: ms(visitOf.get(d.item.id)?.e.VISIT_AT ?? d.item.effective) }))
    .sort((a, b) => a.at - b.at || a.item.recorded.localeCompare(b.item.recorded));

  const groupKey = (code: string) => (/^N18\./.test(code) ? "CKD" : code);
  const latest = new Map<string, (typeof dxs)[number]>();
  const onsets = new Map<string, { value: string; precision: "year" | "month" | "day" }>();
  for (const d of dxs) {
    const k = groupKey(String(d.e.ICD10CM));
    latest.set(k, d);
    const o = parseOnset(d.item, d.id);
    if (o) onsets.set(k, o);
  }
  const lastCkdVisit = [...visits].reverse().find((v) => v.e.CKD_G || v.e.CKD_A);

  const problems: ProblemRow[] = [];
  const allergies: AllergyIntoleranceRow[] = [];
  for (const [k, d] of latest) {
    const code = String(d.e.ICD10CM);
    const text = String(d.e.DX_TEXT ?? "");
    if (d.e.DX_STATUS !== "A" && d.e.DX_STATUS !== "H") continue;
    const evidence: Evidence = [{ item_id: d.item.id, entry_id: d.id }];
    const isT = /^T\d/.test(code);
    // drug-caused
    let substance: string | undefined;
    let cls: string | undefined;
    const am = /adverse effect of\s+(.+?)(?:,|$)/i.exec(text);
    if (isT && am) substance = am[1].trim().toLowerCase();
    const cm = /^(.*?)-associated/i.exec(text);
    if (!isT && cm) cls = cm[1].trim();
    if (substance || cls) {
      if (d.e.DX_STATUS === "A") {
        let sub = substance ?? "";
        if (!sub && cls) {
          sub = cls;
          const pair = CLASS_DRUGS.find(([r]) => r.test(cls!));
          if (pair) {
            const same = meds.filter((m) => m.item.id === d.item.id && pair[1].test(String(m.e.DRUG_NAME)));
            const ings = new Set(same.map((m) => ingredientOf(String(m.e.DRUG_NAME))));
            if (ings.size === 1) sub = [...ings][0];
          }
        }
        const low = (text + " " + (sub ?? "")).toLowerCase();
        let reaction_type: AllergyIntoleranceRow["reaction_type"] = "serious_adverse_event";
        let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
        let criticality: AllergyIntoleranceRow["criticality"] = "unknown";
        if (/angioedema|urticaria|anaphyla|rash|hives|bronchospasm/.test(low)) {
          reaction_type = "hypersensitivity";
          if (/ace inhibitor|pril\b/.test(low)) mechanism = "non_immune";
          criticality = /angioedema|anaphyla/.test(low) ? "high" : "unknown";
        } else if (/cough|nausea|myalgia|gastro/.test(low)) {
          reaction_type = "side_effect"; criticality = "low";
          if (/cough/.test(low)) mechanism = "non_immune";
        } else if (/ketoacidosis/.test(low)) { mechanism = "non_immune"; criticality = "high"; }
        const al: AllergyIntoleranceRow = { substance: sub, reaction_type, mechanism, criticality, evidence };
        if (!isT) al.reaction = text;
        const o = onsets.get(k); if (o) al.onset = o;
        allergies.push(al);
      }
      if (isT) continue;
    }
    const p: ProblemRow = { condition: text, icd10cm: code, status: d.e.DX_STATUS === "A" ? "active" : "resolved", evidence };
    const o = onsets.get(k); if (o) p.onset = o;
    if (k === "CKD") {
      const v = visitOf.get(d.item.id);
      const g = v?.e.CKD_G ?? ckdStageFromCode(code) ?? lastCkdVisit?.e.CKD_G;
      if (g) p.ckd_stage = g;
      const a = v?.e.CKD_A ?? lastCkdVisit?.e.CKD_A;
      if (a) p.albuminuria = a;
      if (v) evidence.push({ item_id: v.item.id, entry_id: v.id });
    }
    const s = sensFor(code); if (s) p.sensitivity = s;
    problems.push(p);
  }
  return { problems, allergies };
}

// ───────────── medications
function mapMeds(cur: FolioItem[], orders: Entry[]): MedicationRow[] {
  const hists = entriesOf(cur, "MED_STATUS_HIST").sort((a, b) => ms(a.e.CHANGED_AT) - ms(b.e.CHANGED_AT));
  const byIng = new Map<string, { row: MedicationRow; at: number }>();
  const seen = new Set<string>();
  for (const o of orders) {
    const rx = String(o.e.RX_ID);
    if (seen.has(rx)) continue;
    seen.add(rx);
    const hs = hists.filter((h) => h.e.RX_ID === rx);
    const lastH = hs[hs.length - 1];
    const status = lastH ? lastH.e.NEW_STATUS : o.e.MED_STATUS;
    if (status === 9 || hs.some((h) => h.e.NEW_STATUS === 9) || o.e.MED_STATUS === 9) continue;
    if (o.e.ROUTE === "IV") continue;
    const name = String(o.e.DRUG_NAME ?? "");
    const ingredient = ingredientOf(name);
    const st = status === 1 ? "active" : status === 2 ? "stopped" : status === 3 ? "held" : "unknown";
    const row: MedicationRow = { drug_name: name, status: st, patient_reported: false, evidence: [{ item_id: o.item.id, entry_id: o.id }] };
    if (ingredient) row.ingredient = ingredient;
    const since = lastH ? localDate(lastH.e.CHANGED_AT) : String(o.e.START_DATE ?? "");
    if (since) row.status_since = since;
    const u = o.e.DOSE_UNIT === "unit" ? "units" : o.e.DOSE_UNIT;
    if (typeof o.e.DOSE_QTY === "number" && ["mg", "mcg", "units", "mL"].includes(u)) row.dose = { value: o.e.DOSE_QTY, unit: u };
    if (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(o.e.FREQ_CODE)) row.frequency = o.e.FREQ_CODE;
    else if (o.e.FREQ_CODE) row.frequency = "other";
    if (lastH) {
      row.evidence.push({ item_id: lastH.item.id, entry_id: lastH.id });
      if (st === "stopped") {
        const rc = lastH.e.REASON_CODE;
        row.stop_reason = rc === "ADR" ? "adverse_reaction" : rc === "PT" ? "patient_choice" : "other";
      }
      if ((st === "stopped" || st === "held") && lastH.e.COMMENT_TEXT) row.status_reason_text = String(lastH.e.COMMENT_TEXT);
    }
    const at = lastH ? ms(lastH.e.CHANGED_AT) : ms(o.e.START_DATE + "T00:00:00-06:00");
    const key = ingredient || rx;
    const prev = byIng.get(key);
    if (!prev || at >= prev.at) byIng.set(key, { row, at });
  }
  return [...byIng.values()].map((v) => v.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const cur = currentItems(Array.isArray(items) ? items : [], asOf);
    const orders = entriesOf(cur, "MED_ORDER");
    out.labs = mapLabs(cur);
    out.vitals = mapVitals(cur);
    out.medications = mapMeds(cur, orders);
    const pa = mapProblems(cur, orders);
    out.problems = pa.problems;
    out.allergies = pa.allergies;
  } catch (_e) {
    // return what we have
  }
  return out;
}
