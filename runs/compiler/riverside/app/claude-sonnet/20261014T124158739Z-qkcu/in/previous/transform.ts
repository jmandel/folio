import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Analyte, Evidence, PartialDate,
} from "../in/views/views";

type Ent = { item: FolioItem; id: string; e: any };

// ───────── time helpers ─────────
const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago", hourCycle: "h23",
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
});
function localParts(iso: string): { date: string; time: string } | undefined {
  const ms = Date.parse(iso);
  if (isNaN(ms)) return undefined;
  const m: Record<string, string> = {};
  for (const p of fmt.formatToParts(new Date(ms))) m[p.type] = p.value;
  return { date: `${m.year}-${m.month}-${m.day}`, time: `${m.hour}:${m.minute}` };
}
const localDate = (iso: string | undefined) => (iso ? localParts(iso)?.date : undefined);

// ───────── item selection ─────────
function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = items.filter((it) => {
    const d = localDate(it.recorded);
    return d !== undefined && d <= asOf;
  });
  const removed = new Set<string>();
  for (const it of inScope) {
    for (const id of [...(it.supersedes ?? []), ...(it.retracts ?? [])]) removed.add(it.issuer + "|" + id);
  }
  return inScope
    .filter((it) => !removed.has(it.issuer + "|" + it.id))
    .sort((a, b) => (a.recorded < b.recorded ? -1 : a.recorded > b.recorded ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
const ents = (it: FolioItem, type?: string): Ent[] => {
  const out: Ent[] = [];
  const p = it.payload && typeof it.payload === "object" ? it.payload : {};
  for (const id of Object.keys(p)) {
    const e = p[id];
    if (e && typeof e === "object" && (!type || e.type === type)) out.push({ item: it, id, e });
  }
  return out;
};
const encOf = (it: FolioItem): any => ents(it, "encounter")[0]?.e;
const ev = (x: Ent): Evidence => [{ item_id: x.item.id, entry_id: x.id }];

// ───────── medications ─────────
const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", glucophage: "metformin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", levemir: "insulin detemir",
  tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart", zestril: "lisinopril",
  prinivil: "lisinopril", lipitor: "atorvastatin", januvia: "sitagliptin", ozempic: "semaglutide",
  lasix: "furosemide", cozaar: "losartan", norvasc: "amlodipine", tradjenta: "linagliptin",
  trulicity: "dulaglutide", victoza: "liraglutide", glucotrol: "glipizide", synthroid: "levothyroxine",
  eliquis: "apixaban", xarelto: "rivaroxaban", plavix: "clopidogrel", zocor: "simvastatin", crestor: "rosuvastatin",
  motrin: "ibuprofen", advil: "ibuprofen", aleve: "naproxen", tylenol: "acetaminophen",
};
const SALTS = new Set(["potassium", "sodium", "hydrochloride", "hcl", "mesylate", "tartrate", "succinate", "maleate",
  "besylate", "sulfate", "phosphate", "citrate", "acetate", "calcium", "hydrobromide", "fumarate"]);
const FORMS = new Set(["tablet", "tablets", "tab", "capsule", "cap", "pen", "injection", "solution", "oral", "er", "xr",
  "sr", "extended-release", "delayed-release", "cream", "inhaler", "vial", "syringe", "patch", "suspension"]);
function ingredientName(drug: string): string | undefined {
  const toks = drug.toLowerCase().replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  const keep: string[] = [];
  for (const t of toks) {
    if (/\d/.test(t) || FORMS.has(t)) break;
    keep.push(t);
  }
  const out = keep.filter((t, i) => i === 0 || !SALTS.has(t));
  if (!out.length) return undefined;
  if (out.length === 1 && BRANDS[out[0]]) return BRANDS[out[0]];
  const first = BRANDS[out[0]];
  if (first && out.length <= 2) return first;
  return out.join(" ");
}
function parseDose(t: string | undefined): MedicationRow["dose"] {
  if (!t) return undefined;
  const s = t.toLowerCase();
  const all = [...s.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg|ug|µg|g|units?|unt|\[iu\]|iu|ml|tablets?|tabs?)\b/g)];
  if (all.length !== 1 || /\d\s*(-|to)\s*\d/.test(s)) return undefined;
  const v = parseFloat(all[0][1]);
  const u = all[0][2];
  if (!isFinite(v)) return undefined;
  if (u === "mg") return { value: v, unit: "mg" };
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u === "mcg" || u === "ug" || u === "µg") return { value: v, unit: "mcg" };
  if (u === "ml") return { value: v, unit: "mL" };
  if (u.startsWith("tab")) return { value: v, unit: "tablet" };
  return { value: v, unit: "units" };
}
function parseFreq(sig: string | undefined): MedicationRow["frequency"] {
  if (!sig) return undefined;
  const s = sig.toLowerCase();
  if (/\b(prn|as needed)\b/.test(s)) return "PRN";
  if (/\b(qhs|nightly|at bedtime|at night|every night|bedtime|qpm)\b/.test(s)) return "QHS";
  if (/\b(weekly|once a week|every week|qw)\b/.test(s)) return "QW";
  if (/\b(tid|three times)\b/.test(s)) return "TID";
  if (/\b(bid|twice)\b/.test(s)) return "BID";
  if (/\b(daily|qd|once a day|every day|every morning|qam|once daily)\b/.test(s)) return "QD";
  return "other";
}
function stopReason(text: string | undefined): MedicationRow["stop_reason"] {
  if (!text) return undefined;
  const s = text.toLowerCase();
  if (/(cough|angioedema|rash|hives|side effect|adverse|intoleran|allerg|ketoacidosis|reaction)/.test(s)) return "adverse_reaction";
  if (/(ineffective|not effective|not working|inadequate|failed)/.test(s)) return "ineffective";
  if (/(replaced|switch|instead|changed to|substitut)/.test(s)) return "therapy_changed";
  if (/(course (is )?complete|completed|finished)/.test(s)) return "course_complete";
  if (/(patient (declin|refus|request|prefer|chose|stopped)|declined)/.test(s)) return "patient_choice";
  return "other";
}
const medKey = (m: any) => m.rxnorm_ingredient ?? ingredientName(m.drug_name ?? "") ?? String(m.drug_name);
const statusClass = (s: string) => (s === "held" ? "held" : s === "stopped" ? "stopped" : s === "new" || s === "changed" ? "new" : s);

function medications(cur: FolioItem[]): MedicationRow[] {
  const docs = cur.filter((it) => ents(it, "home_med").length > 0);
  if (!docs.length) return [];
  let latest = docs[docs.length - 1];
  const lenc = encOf(latest);
  if (lenc) {
    const ds = docs.filter((d) => {
      const e = encOf(d);
      return e && e.encounter_id === lenc.encounter_id && e.document_kind === "discharge_summary";
    });
    if (ds.length) latest = ds[ds.length - 1];
  }
  const enc = encOf(latest);
  const sameStay = docs.filter((d) => enc && encOf(d)?.encounter_id === enc.encounter_id && d.recorded <= latest.recorded)
    .sort((a, b) => (a.recorded < b.recorded ? -1 : a.recorded > b.recorded ? 1 : 0));

  const byKey = new Map<string, Ent>();
  for (const x of ents(latest, "home_med")) byKey.set(medKey(x.e), x);

  const rows: MedicationRow[] = [];
  for (const x of byKey.values()) {
    const m = x.e;
    const st: string = m.status;
    let status: MedicationRow["status"];
    if (st === "held") status = "held";
    else if (st === "stopped") status = "stopped";
    else if (st === "not_reconciled") status = "unknown";
    else if (st === "continue" || st === "new" || st === "changed") status = "active";
    else status = "unknown";

    let since: string | undefined;
    if (st === "held" || st === "stopped" || st === "new" || st === "changed") {
      // earliest document of this stay in an unbroken run of the same status for this drug
      const key = medKey(m);
      let earliest: { it: FolioItem } | undefined;
      for (let i = sameStay.length - 1; i >= 0; i--) {
        const line = ents(sameStay[i], "home_med").find((y) => medKey(y.e) === key);
        if (!line || statusClass(line.e.status) !== statusClass(st)) break;
        earliest = { it: sameStay[i] };
      }
      const it = earliest?.it ?? latest;
      const e = encOf(it);
      since = e?.document_kind === "discharge_summary" ? localDate(e.discharged ?? it.effective) : localDate(it.effective);
    }
    const row: MedicationRow = {
      drug_name: String(m.drug_name ?? ""),
      status,
      patient_reported: false,
      evidence: ev(x),
    };
    const ing = ingredientName(row.drug_name);
    if (ing) row.ingredient = ing;
    if (m.rxnorm_ingredient) row.rxnorm_ingredient = String(m.rxnorm_ingredient);
    if (since) row.status_since = since;
    const dose = parseDose(m.dose_text) ?? undefined;
    if (dose) row.dose = dose;
    const f = parseFreq(m.sig);
    if (f) row.frequency = f;
    if ((status === "held" || status === "stopped") && m.instructions) {
      row.status_reason_text = String(m.instructions);
      if (status === "stopped") {
        const r = stopReason(m.instructions);
        if (r) row.stop_reason = r;
      }
    }
    rows.push(row);
  }
  return rows;
}

// ───────── problems ─────────
function ckdStage(icd?: string, text?: string): ProblemRow["ckd_stage"] {
  const t = (text ?? "").toLowerCase();
  const m = t.match(/stage\s*(3a|3b|[1-5])\b/) ?? t.match(/\bg(3a|3b|[1-5])\b/);
  if (m) return ("G" + m[1]) as ProblemRow["ckd_stage"];
  const map: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
  };
  return icd ? map[icd.toUpperCase()] : undefined;
}
function album(text?: string): ProblemRow["albuminuria"] {
  const m = (text ?? "").match(/\bA([123])\b/);
  return m ? (("A" + m[1]) as ProblemRow["albuminuria"]) : undefined;
}
function onsetOf(t?: string): ProblemRow["onset"] {
  if (!t) return undefined;
  const s = t.trim();
  if (/^\d{4}$/.test(s)) return { value: s, precision: "year" };
  if (/^\d{4}-\d{2}$/.test(s)) return { value: s, precision: "month" };
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { value: s, precision: "day" };
  return undefined;
}
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const isCkd = (e: any) => {
  const icd = String(e.icd10cm ?? "").toUpperCase();
  const lab = String(e.label ?? e.condition ?? "");
  return (/^N18\./.test(icd) && icd !== "N18.6") || /chronic kidney disease|\bCKD\b/i.test(lab);
};
const isAdverseT = (e: any) => /^T(3[6-9]|4\d|50)\b/i.test(String(e.icd10cm ?? ""));

function problems(cur: FolioItem[]): ProblemRow[] {
  type G = { key: string; list: Ent[] };
  const groups: G[] = [];
  const all: Ent[] = [];
  for (const it of cur) {
    for (const x of ents(it, "diagnosis")) if (!isAdverseT(x.e)) all.push(x);
    for (const x of ents(it, "history")) all.push(x);
  }
  const labelOf = (e: any) => String(e.label ?? e.condition ?? "");
  const rcode = (e: any) => e.riverside_dx?.code as string | undefined;
  // coded subgroups per icd
  const icdCodes = new Map<string, Set<string>>();
  for (const x of all) {
    const c = rcode(x.e), i = x.e.icd10cm;
    if (c && i) { if (!icdCodes.has(i)) icdCodes.set(i, new Set()); icdCodes.get(i)!.add(c); }
  }
  const keyOf = (e: any): string => {
    if (isCkd(e)) return "ckd";
    const c = rcode(e), i = e.icd10cm as string | undefined;
    if (c) return "rx:" + c;
    if (i) {
      const s = icdCodes.get(i);
      if (s && s.size === 1) return "rx:" + [...s][0];
      return "icd:" + i;
    }
    return "lbl:" + norm(labelOf(e));
  };
  for (const x of all) {
    const k = keyOf(x.e);
    let g = groups.find((y) => y.key === k);
    if (!g) groups.push((g = { key: k, list: [] }));
    g.list.push(x);
  }
  const rows: ProblemRow[] = [];
  for (const g of groups) {
    const last = g.list[g.list.length - 1];
    // within the latest document prefer diagnosis over history
    const sameDoc = g.list.filter((y) => y.item === last.item);
    const lastE = sameDoc.find((y) => y.e.type === "diagnosis") ?? last;
    let status: ProblemRow["status"];
    if (lastE.e.type === "diagnosis") {
      if (lastE.e.status === "active") status = "active";
      else if (lastE.e.status === "resolved") status = "resolved";
      else continue;
    } else status = "active";
    const row: ProblemRow = { condition: labelOf(lastE.e), status, evidence: g.list.map((y) => ({ item_id: y.item.id, entry_id: y.id })) };
    const icd = lastE.e.icd10cm ?? [...g.list].reverse().find((y) => y.e.icd10cm)?.e.icd10cm;
    if (lastE.e.icd10cm) row.icd10cm = lastE.e.icd10cm;
    const on = [...g.list].reverse().map((y) => onsetOf(y.e.onset_text)).find((o) => o);
    if (on) row.onset = on;
    if (g.key === "ckd") {
      for (let i = g.list.length - 1; i >= 0; i--) {
        const e = g.list[i].e;
        const s = ckdStage(e.icd10cm, labelOf(e));
        if (s) { row.ckd_stage = s; break; }
      }
      for (let i = g.list.length - 1; i >= 0; i--) {
        const a = album(labelOf(g.list[i].e));
        if (a) { row.albuminuria = a; break; }
      }
      void icd;
    }
    rows.push(row);
  }
  return rows;
}

// ───────── allergies ─────────
function allergyType(reaction: string | undefined, severity: string): AllergyIntoleranceRow["type"] {
  const r = (reaction ?? "").toLowerCase();
  if (/(hives|urticaria|rash|angioedema|anaphyla|wheez|bronchospasm|swelling|itch|pruritus|stevens|throat)/.test(r)) return "allergy";
  if (/(ketoacidosis|lactic acidosis|rhabdo|hepatotox|liver injury|pancreatitis|bleed|failure)/.test(r)) return "adverse_reaction";
  if (/(cough|nausea|vomit|diarrhea|gi upset|stomach|upset|dizz|headache|constipation|cramp|fatigue|intoleran|gas|bloating)/.test(r)) return "intolerance";
  return "allergy";
}
function allergies(cur: FolioItem[]): AllergyIntoleranceRow[] {
  const rows: AllergyIntoleranceRow[] = [];
  const docs = cur.filter((it) => ents(it, "allergy").length > 0);
  {
    const seen = new Map<string, Ent>();
    for (const d of docs) for (const x of ents(d, "allergy")) {
      const k = String(x.e.substance ?? "").trim().toLowerCase();
      if (k) seen.set(k, x);
    }
    for (const x of seen.values()) {
      const sub = String(x.e.substance ?? "").trim();
      if (!sub || /^(nkda|nka|no known (drug )?allerg)/i.test(sub)) continue;
      const sev = String(x.e.severity ?? "unknown");
      const r: AllergyIntoleranceRow = {
        substance: sub.toLowerCase(),
        type: allergyType(x.e.reaction, sev),
        criticality: sev === "severe" ? "high" : sev === "mild" ? "low" : "unknown",
        evidence: ev(x),
      };
      if (x.e.rxnorm_ingredient) r.rxnorm_ingredient = String(x.e.rxnorm_ingredient);
      if (x.e.reaction) r.reaction = String(x.e.reaction);
      rows.push(r);
    }
  }
  // adverse drug effects coded as T-code diagnoses
  const meds: Ent[] = [];
  for (const it of cur) meds.push(...ents(it, "home_med"));
  const byKey = new Map<string, AllergyIntoleranceRow>();
  for (const it of cur) {
    for (const x of ents(it, "diagnosis")) {
      if (!isAdverseT(x.e)) continue;
      if (x.e.status !== "active" && x.e.status !== "resolved") { byKey.delete(String(x.e.icd10cm)); continue; }
      const label = String(x.e.label ?? "");
      const ln = label.toLowerCase();
      let sub: string | undefined, rx: string | undefined;
      for (const m of meds) {
        const ing = ingredientName(String(m.e.drug_name ?? ""));
        if (ing && ln.includes(ing)) { sub = ing; rx = m.e.rxnorm_ingredient; break; }
      }
      sub = sub ?? ln.replace(/^(adverse effect of|poisoning by|underdosing of)\s+/, "").split(/[,(]/)[0].trim();
      const r: AllergyIntoleranceRow = { substance: sub, type: "adverse_reaction", reaction: label, criticality: "high", evidence: ev(x) };
      if (rx) r.rxnorm_ingredient = String(rx);
      byKey.set(String(x.e.icd10cm), r);
    }
  }
  for (const r of byKey.values()) {
    if (!rows.some((y) => y.substance === r.substance)) rows.push(r);
  }
  return rows;
}

// ───────── labs ─────────
const LOINC: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium",
  "2947-0": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "33037-3": "anion_gap",
  "1863-0": "anion_gap", "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c",
  "4547-6": "a1c", "17856-6": "a1c", "14959-1": "uacr", "9318-7": "uacr", "32294-1": "uacr", "777-3": "platelets",
  "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "20509-6": "hemoglobin",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "3034-6": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
  "98979-8": "egfr", "62238-1": "egfr", "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "77147-7": "egfr",
  "69405-9": "egfr", "50044-7": "egfr", "50210-4": "egfr", "88293-6": "egfr", "88294-4": "egfr", "70969-1": "egfr",
};
const CODES: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate",
  HCO3: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", A1C: "a1c", HBA1C: "a1c",
  UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", PH: "ph", VPH: "ph",
  APH: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2", LIPASE: "lipase", LIP: "lipase", TROP: "troponin",
  TNI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", EGFR: "egfr",
};
function analyteOf(t: { local_code?: string; loinc?: string; name?: string }): Analyte | undefined {
  const name = (t.name ?? "").toLowerCase();
  if (/egfr|glomerular filtration|gfr/.test(name)) return "egfr";
  if (t.loinc && LOINC[t.loinc]) return LOINC[t.loinc];
  const c = (t.local_code ?? "").toUpperCase();
  if (CODES[c]) return CODES[c];
  if (/hydroxybutyrate/.test(name)) return "bhb";
  return undefined;
}
const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
function convert(a: Analyte, v: number, unit: string | undefined): number | undefined {
  const u = (unit ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (!u || u === UNIT[a].toLowerCase()) return v;
  switch (a) {
    case "creatinine": if (u === "umol/l" || u === "µmol/l") return v / 88.4; break;
    case "glucose": if (u === "mmol/l") return v * 18.016; break;
    case "cholesterol": case "hdl": case "ldl": if (u === "mmol/l") return v * 38.67; break;
    case "triglycerides": if (u === "mmol/l") return v * 88.57; break;
    case "bun": if (u === "mmol/l") return v * 2.801; break;
    case "hemoglobin": if (u === "g/l") return v / 10; break;
    case "platelets": case "wbc":
      if (u === "/ul" || u === "cells/ul" || u === "/mm3" || u === "cells/mm3") return v / 1000;
      if (u === "10*9/l" || u === "10^9/l" || u === "k/ul" || u === "10*3/ul" || u === "10^3/ul") return v;
      break;
    case "troponin": if (u === "ug/l") return v; if (u === "pg/ml") return v / 1000; if (u === "ng/l") return v / 1000; break;
    case "a1c": if (u === "percent") return v; break;
    case "ph": return v;
    case "egfr": if (u.startsWith("ml/min")) return v; break;
    case "bhb": if (u === "mg/dl") return v / 10.4; break;
    default: break;
  }
  return undefined;
}
function egfrEq(t: { local_code?: string; loinc?: string; name?: string }, collected: string): LabResultRow["egfr_equation"] {
  const n = (t.name ?? "").toLowerCase();
  if (/mdrd/.test(n)) return "mdrd";
  if (/2009/.test(n)) return "ckd-epi-2009";
  if (/2021/.test(n)) return "ckd-epi-2021";
  if (t.loinc === "98979-8") return "ckd-epi-2021";
  if (t.loinc === "62238-1") return "ckd-epi-2009";
  if (t.loinc === "48642-3" || t.loinc === "48643-1" || t.loinc === "33914-3") return "mdrd";
  if (/ckd-?epi/.test(n) && collected >= "2023") return "ckd-epi-2021";
  return "unknown";
}
const isRaceVariant = (t: { name?: string; loinc?: string }) =>
  /black|african|race|non-?black/.test((t.name ?? "").toLowerCase()) || t.loinc === "48643-1" || t.loinc === "50210-4";
const RANK: Record<string, number> = { preliminary: 0, final: 1, corrected: 2 };

function labs(cur: FolioItem[]): LabResultRow[] {
  type C = { ent: Ent; comp: any; status: string; collected: string; seq: number; panelStatus: string };
  const best = new Map<string, C>();
  let seq = 0;
  const consider = (ent: Ent, comp: any, status: string, collected: string) => {
    if (!comp?.test?.local_code || !collected) return;
    const key = `${ent.e.accession}|${comp.test.local_code}`;
    const c: C = { ent, comp, status, collected, seq: seq++, panelStatus: status };
    const old = best.get(key);
    if (!old || (RANK[status] ?? 0) >= (RANK[old.status] ?? 0)) best.set(key, c);
  };
  for (const it of cur) {
    for (const x of ents(it)) {
      if (x.e.type === "result") consider(x, x.e, String(x.e.status), x.e.collected);
      else if (x.e.type === "panel" && Array.isArray(x.e.components))
        for (const comp of x.e.components) consider(x, comp, String(x.e.status), x.e.collected);
    }
  }
  const rows: LabResultRow[] = [];
  for (const c of best.values()) {
    const comp = c.comp;
    const a = analyteOf(comp.test);
    if (!a) continue;
    if (a === "egfr" && isRaceVariant(comp.test)) continue;
    const raw = String(comp.value ?? "").trim();
    const m = raw.match(/^(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)$/);
    if (!m) continue;
    const num = convert(a, parseFloat(m[2]), comp.unit);
    if (num === undefined || !isFinite(num)) continue;
    const row: LabResultRow = {
      analyte: a,
      value: Math.round(num * 10000) / 10000,
      unit: UNIT[a],
      collected: c.collected,
      status: c.status === "preliminary" ? "preliminary" : "final",
      evidence: ev(c.ent),
    };
    if (m[1]) row.comparator = m[1] as LabResultRow["comparator"];
    if (a === "egfr") row.egfr_equation = egfrEq(comp.test, c.collected);
    if (comp.test.loinc) row.loinc = comp.test.loinc;
    rows.push(row);
  }
  rows.sort((x, y) => (x.collected < y.collected ? -1 : x.collected > y.collected ? 1 : x.analyte < y.analyte ? -1 : x.analyte > y.analyte ? 1 : 0));
  return rows;
}

// ───────── vitals ─────────
function vitals(cur: FolioItem[]): VitalRow[] {
  const byTaken = new Map<string, { taken: string; ents: Ent[]; e: any }>();
  for (const it of cur) {
    for (const x of ents(it, "vitals")) {
      const t = x.e.taken;
      if (typeof t !== "string" || isNaN(Date.parse(t))) continue;
      const k = String(Date.parse(t));
      const g = byTaken.get(k);
      if (g) { g.ents.push(x); g.e = { ...g.e, ...x.e }; }
      else byTaken.set(k, { taken: t, ents: [x], e: { ...x.e } });
    }
  }
  const sorted = [...byTaken.entries()].sort((a, b) => Number(a[0]) - Number(b[0])).map((p) => p[1]);
  const rows: { ms: number; row: VitalRow }[] = [];
  for (const g of sorted) {
    const ms = Date.parse(g.taken);
    const e = g.e;
    const evid: Evidence = g.ents.map((x) => ({ item_id: x.item.id, entry_id: x.id }));
    const prev = rows[rows.length - 1];
    const hasBp = e.bp && typeof e.bp.systolic_mmhg === "number" && typeof e.bp.diastolic_mmhg === "number";
    if (prev && ms - prev.ms <= 15 * 60000 && prev.row.systolic_mmhg !== undefined && hasBp && prev.row.repeat_systolic_mmhg === undefined) {
      prev.row.repeat_systolic_mmhg = e.bp.systolic_mmhg;
      prev.row.repeat_diastolic_mmhg = e.bp.diastolic_mmhg;
      if (prev.row.pulse_bpm === undefined && typeof e.heart_rate_bpm === "number") prev.row.pulse_bpm = e.heart_rate_bpm;
      if (prev.row.weight_kg === undefined && typeof e.weight_kg === "number") prev.row.weight_kg = Math.round(e.weight_kg * 10) / 10;
      prev.row.evidence.push(...evid);
      continue;
    }
    const lp = localParts(g.taken);
    if (!lp) continue;
    const row: VitalRow = { setting: "hospital", local_time: `${lp.date}T${lp.time}`, evidence: evid };
    if (hasBp) { row.systolic_mmhg = e.bp.systolic_mmhg; row.diastolic_mmhg = e.bp.diastolic_mmhg; }
    if (typeof e.heart_rate_bpm === "number") row.pulse_bpm = e.heart_rate_bpm;
    if (typeof e.weight_kg === "number") row.weight_kg = Math.round(e.weight_kg * 10) / 10;
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    rows.push({ ms, row });
  }
  return rows.map((r) => r.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  let cur: FolioItem[] = [];
  try { cur = currentItems(Array.isArray(items) ? items : [], asOf); } catch { cur = []; }
  const safe = <T>(f: () => T[]): T[] => { try { return f(); } catch { return []; } };
  return {
    medications: safe(() => medications(cur)),
    problems: safe(() => problems(cur)),
    allergies: safe(() => allergies(cur)),
    labs: safe(() => labs(cur)),
    vitals: safe(() => vitals(cur)),
  };
}
