import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow, Evidence, Analyte,
} from "../in/views/views";

const TZ = "America/Chicago";
const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

/** Chicago wall-clock parts for an instant string; null if unparseable. */
function localParts(s: string): { date: string; time: string } | null {
  if (typeof s !== "string") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { date: s, time: "00:00" };
  const ms = Date.parse(s);
  if (isNaN(ms)) return null;
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

function instant(s: string): number {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return Date.parse(s + "T00:00:00Z");
  if (/^\d{4}-\d{2}$/.test(s)) return Date.parse(s + "-01T00:00:00Z");
  if (/^\d{4}$/.test(s)) return Date.parse(s + "-01-01T00:00:00Z");
  const m = Date.parse(s);
  return isNaN(m) ? 0 : m;
}

interface Ent { item: FolioItem; id: string; e: any }

function cmpEnt(a: Ent, b: Ent): number {
  const d = instant(a.item.effective) - instant(b.item.effective);
  if (d) return d;
  const r = instant(a.item.recorded) - instant(b.item.recorded);
  if (r) return r;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0;
}

function ev(...es: Ent[]): Evidence {
  return es.map((x) => ({ item_id: x.item.id, entry_id: x.id }));
}

function groupBy<T>(xs: T[], key: (x: T) => string | undefined): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const x of xs) {
    const k = key(x);
    if (!k) continue;
    const l = m.get(k);
    if (l) l.push(x); else m.set(k, [x]);
  }
  return m;
}

function partial(f: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f.date !== "string") return undefined;
  if (f.precision === "year") return { value: f.date.slice(0, 4), precision: "year" };
  if (f.precision === "month") return { value: f.date.slice(0, 7), precision: "month" };
  if (f.precision === "day") return { value: f.date.slice(0, 10), precision: "day" };
  return undefined;
}

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", januvia: "sitagliptin",
  lasix: "furosemide", glucophage: "metformin", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", norvasc: "amlodipine",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart", levemir: "insulin detemir",
  ozempic: "semaglutide", wegovy: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", coreg: "carvedilol",
  lopressor: "metoprolol", toprol: "metoprolol", zoloft: "sertraline", lexapro: "escitalopram",
  prozac: "fluoxetine", celexa: "citalopram", wellbutrin: "bupropion", aldactone: "spironolactone",
  kerendia: "finerenone", tylenol: "acetaminophen", motrin: "ibuprofen", advil: "ibuprofen", aleve: "naproxen",
  plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban", synthroid: "levothyroxine",
};
const SALTS = new Set(["potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "succinate", "tartrate",
  "mesylate", "calcium", "sulfate", "phosphate", "acetate", "citrate", "fumarate", "hydrobromide", "magnesium"]);

function ingredientOf(name: string): string | undefined {
  const words = name.replace(/\(.*?\)/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const w of words) {
    if (/^[\d.]/.test(w) || w === "/") break;
    out.push(w.toLowerCase().replace(/[,;]+$/, ""));
  }
  if (out.length && BRANDS[out[0]]) return BRANDS[out[0]];
  const kept = out.filter((w, i) => i === 0 || !SALTS.has(w));
  const s = kept.join(" ").trim();
  return s || undefined;
}

function medFreq(f: any): MedicationRow["frequency"] | undefined {
  switch (f) {
    case "QD": case "BID": case "TID": case "QHS": case "PRN": return f;
    case "OTHER": return "other";
    default: return undefined;
  }
}

function medUnit(u: string): "mg" | "mcg" | "units" | "mL" | "tablet" | undefined {
  const x = String(u || "").toLowerCase().trim();
  if (x === "mg") return "mg";
  if (x === "mcg" || x === "ug" || x === "µg") return "mcg";
  if (["unit", "units", "unt", "[iu]", "iu"].includes(x)) return "units";
  if (x === "ml") return "mL";
  if (["tab", "tabs", "tablet", "tablets"].includes(x)) return "tablet";
  return undefined;
}

function ckdStage(code: string | undefined, desc: string): ProblemRow["ckd_stage"] | undefined {
  const c = (code || "").toUpperCase();
  const byCode: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
  };
  if (byCode[c]) return byCode[c];
  const m = /stage\s*(1|2|3\s*a|3\s*b|4|5)\b/i.exec(desc);
  if (m) return ("G" + m[1].replace(/\s+/g, "").toLowerCase()) as ProblemRow["ckd_stage"];
  return undefined;
}

function isCkd(code: string | undefined, desc: string): boolean {
  return /^N18\./i.test(code || "") || /chronic kidney|\bCKD\b/i.test(desc);
}

function classify(t: { nfm_code?: string; name?: string; loinc?: string }): { analyte: Analyte; egfr?: boolean } | null {
  const code = (t.nfm_code || "").toUpperCase();
  const name = (t.name || "").toLowerCase();
  const urine = /urine|\bur\b/.test(name);
  if (/^egfr/.test(code) || /egfr|glomerular/.test(name)) return { analyte: "egfr", egfr: true };
  if (/uacr|albumin.*creatinine|microalb.*creat/.test(name) || code === "UACR") return { analyte: "uacr" };
  if (/a1c/.test(name) || code === "A1C" || code === "HBA1C") return { analyte: "a1c" };
  if (/hdl/.test(name)) return { analyte: "hdl" };
  if (/ldl/.test(name)) return { analyte: "ldl" };
  if (/triglycer/.test(name)) return { analyte: "triglycerides" };
  if (/cholesterol/.test(name)) return { analyte: "cholesterol" };
  if (/anion gap/.test(name)) return { analyte: "anion_gap" };
  if (/hydroxybut|\bbhb\b/.test(name)) return { analyte: "bhb" };
  if (/troponin/.test(name)) return { analyte: "troponin" };
  if (/lipase/.test(name)) return { analyte: "lipase" };
  if (/platelet|\bplt\b/.test(name) || code === "PLT") return { analyte: "platelets" };
  if (/\bwbc\b|white.*cell|leukocyte/.test(name) || code === "WBC") return { analyte: "wbc" };
  if (/hemoglobin|haemoglobin/.test(name) || code === "HGB") return { analyte: "hemoglobin" };
  if (/pco2/.test(name)) return { analyte: "pco2" };
  if (/^ph\b|\bph\b.*(blood|arterial|venous|gas)|blood gas.*\bph\b/.test(name) || code === "PH") return { analyte: "ph" };
  if (urine) return null;
  if (/bicarb|co2|carbon dioxide/.test(name) || code === "CO2" || code === "HCO3") return { analyte: "bicarbonate" };
  if (/creatinine/.test(name) || code === "CREAT") return { analyte: "creatinine" };
  if (/potassium/.test(name) || code === "K") return { analyte: "potassium" };
  if (/sodium/.test(name) || code === "NA") return { analyte: "sodium" };
  if (/chloride/.test(name) || code === "CL") return { analyte: "chloride" };
  if (/urea nitrogen|\bbun\b/.test(name) || code === "BUN") return { analyte: "bun" };
  if (/glucose/.test(name) || code === "GLU" || code === "GLUCOSE") return { analyte: "glucose" };
  return null;
}

const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function convert(a: Analyte, v: number, unit: string): number {
  const u = unit.replace(/\s+/g, "").toLowerCase();
  if (a === "platelets" || a === "wbc") {
    if (u === "cells/ul" || u === "/ul" || u === "/mm3") return v / 1000;
    return v;
  }
  if (a === "creatinine" && (u === "umol/l" || u === "µmol/l")) return v / 88.4;
  if (a === "glucose" && u === "mmol/l") return v * 18.016;
  if (a === "hemoglobin" && u === "g/l") return v / 10;
  return v;
}

function eqOf(e: any): "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | "unknown" {
  const test = (s: string) => {
    if (/mdrd/i.test(s)) return "mdrd" as const;
    if (/ckd-?epi/i.test(s) && /2021|race-?free/i.test(s)) return "ckd-epi-2021" as const;
    if (/ckd-?epi/i.test(s) && /2009/.test(s)) return "ckd-epi-2009" as const;
    return null;
  };
  return test(e.comment || "") || test(e.test?.name || "") ||
    (/EGFR21|2021/i.test(e.external_ref?.result_code || "") ? "ckd-epi-2021" :
     /EGFR09|2009/i.test(e.external_ref?.result_code || "") ? "ckd-epi-2009" :
     /MDRD/i.test(e.external_ref?.result_code || "") ? "mdrd" : "unknown");
}

function hasRaceCoef(e: any): boolean {
  const s = `${e.test?.nfm_code || ""} ${e.test?.name || ""} ${e.external_ref?.result_code || ""}`;
  if (/non[-\s]?(african|black)|NAA/i.test(s)) return false;
  return /african|black|\bAA\b|-AA\b|EGFRAA|with race/i.test(s);
}

function parseBp(s: any): [number, number] | null {
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(String(s ?? ""));
  return m ? [Number(m[1]), Number(m[2])] : null;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const inScope = (items || []).filter((it) => {
      const lp = localParts(it.recorded);
      return lp !== null && lp.date <= asOf;
    });
    const dead = new Set<string>();
    for (const it of inScope) {
      for (const id of it.supersedes || []) dead.add(it.issuer + "|" + id);
      for (const id of it.retracts || []) dead.add(it.issuer + "|" + id);
    }
    const current = inScope.filter((it) => !dead.has(it.issuer + "|" + it.id));
    const ents: Ent[] = [];
    for (const item of current) {
      for (const [id, e] of Object.entries(item.payload || {})) {
        if (e && typeof e === "object" && typeof (e as any).type === "string") ents.push({ item, id, e });
      }
    }
    const ofType = (t: string) => ents.filter((x) => x.e.type === t).sort(cmpEnt);

    // Medications
    const lines: { ing: string | undefined; row: MedicationRow; last: Ent }[] = [];
    for (const evs of groupBy(ofType("med_event"), (x) => x.e.med_id).values()) {
      const last = evs[evs.length - 1];
      const e = last.e;
      if (e.restricted) continue;
      const name: string = e.drug?.name;
      if (!name) continue;
      const status = e.action === "stop" ? "stopped" : e.action === "hold" ? "held" : "active";
      let since: Ent = last;
      if (status === "active") {
        for (const x of evs) if (x.e.action === "start" || x.e.action === "resume") since = x;
      }
      const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: ev(...evs) };
      const ing = ingredientOf(name);
      if (ing) row.ingredient = ing;
      const sd = localParts(since.item.effective);
      if (sd) row.status_since = sd.date;
      const u = e.dose ? medUnit(e.dose.unit) : undefined;
      if (u && typeof e.dose.value === "number") row.dose = { value: e.dose.value, unit: u };
      const f = medFreq(e.frequency);
      if (f) row.frequency = f;
      if (status === "stopped") {
        if (e.stop_reason) row.stop_reason = e.stop_reason;
      }
      if (status !== "active" && e.reason_text) row.status_reason_text = e.reason_text;
      lines.push({ ing, row, last });
    }
    const byIng = new Map<string, typeof lines[number]>();
    for (const l of lines) {
      const k = l.ing ?? "\u0000" + l.row.drug_name + l.last.id + l.last.item.id;
      const cur = byIng.get(k);
      if (!cur || cmpEnt(cur.last, l.last) < 0) byIng.set(k, l);
    }
    rows.medications = [...byIng.values()].sort((a, b) => cmpEnt(a.last, b.last)).map((l) => l.row);

    // Problems
    const probs: { row: ProblemRow; last: Ent }[] = [];
    for (const evs of groupBy(ofType("problem_event"), (x) => x.e.problem_id).values()) {
      const last = evs[evs.length - 1];
      const e = last.e;
      if (e.action === "remove" || e.restricted || !e.description) continue;
      if (/^T(3[6-9]|4\d|50)\./i.test(e.icd10cm || "")) continue;
      const row: ProblemRow = {
        condition: e.description,
        status: e.action === "resolve" ? "resolved" : "active",
        evidence: ev(...evs),
      };
      if (e.icd10cm) row.icd10cm = e.icd10cm;
      if (e.snomed) row.snomed = e.snomed;
      const on = partial(e.onset);
      if (on) row.onset = on;
      if (isCkd(e.icd10cm, e.description)) {
        const st = ckdStage(e.icd10cm, e.description);
        if (st) row.ckd_stage = st;
        const m = /\bA([123])\b/.exec(e.description);
        if (m) row.albuminuria = ("A" + m[1]) as "A1" | "A2" | "A3";
      }
      probs.push({ row, last });
    }
    const byCode = new Map<string, { row: ProblemRow; last: Ent }>();
    for (const p of probs) {
      const k = p.row.icd10cm ? p.row.icd10cm + "|" + p.row.status : "\u0000" + p.last.item.id + p.last.id;
      const cur = byCode.get(k);
      if (!cur || cmpEnt(cur.last, p.last) < 0) byCode.set(k, p);
    }
    rows.problems = [...byCode.values()].sort((a, b) => cmpEnt(a.last, b.last)).map((p) => p.row);

    // Allergies
    const alg: { row: AllergyIntoleranceRow; last: Ent }[] = [];
    for (const evs of groupBy(ofType("allergy_event"), (x) => x.e.allergy_id).values()) {
      const last = evs[evs.length - 1];
      const e = last.e;
      if (e.action === "inactivate" || !e.substance?.name) continue;
      const isDrug = !!e.substance.rxnorm;
      const row: AllergyIntoleranceRow = {
        substance: isDrug ? String(e.substance.name).toLowerCase() : e.substance.name,
        type: e.reaction_type,
        criticality: e.severity === "high" || e.severity === "low" ? e.severity : "unknown",
        evidence: ev(...evs),
      };
      if (e.substance.rxnorm) row.rxnorm_ingredient = e.substance.rxnorm;
      if (Array.isArray(e.reactions) && e.reactions.length) row.reaction = e.reactions.join("; ");
      const on = partial(e.onset);
      if (on) row.onset = on;
      alg.push({ row, last });
    }
    rows.allergies = alg.sort((a, b) => cmpEnt(a.last, b.last)).map((a) => a.row);

    // Labs
    const rank = (s: string) => (s === "P" ? 0 : 1);
    const labs = new Map<string, { row: LabResultRow; ent: Ent; st: string }>();
    for (const x of ofType("imported_result")) {
      const e = x.e;
      const c = classify(e.test || {});
      if (!c) continue;
      if (c.egfr && hasRaceCoef(e)) continue;
      const raw = String(e.value ?? "").trim();
      const m = /^(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)$/.exec(raw);
      if (!m) continue;
      let v = convert(c.analyte, Number(m[2]), String(e.unit || ""));
      v = Math.round(v * 1e6) / 1e6;
      const row: LabResultRow = {
        analyte: c.analyte, value: v, unit: UNIT[c.analyte], collected: e.collected || x.item.effective,
        status: e.result_status === "P" ? "preliminary" : "final", evidence: ev(x),
      };
      if (m[1]) row.comparator = m[1] as LabResultRow["comparator"];
      if (c.egfr) row.egfr_equation = eqOf(e);
      if (e.test?.loinc) row.loinc = e.test.loinc;
      const key = [e.external_ref?.accession ?? x.item.id, e.test?.nfm_code, c.analyte].join("|");
      const cur = labs.get(key);
      if (!cur || rank(e.result_status) >= rank(cur.st)) labs.set(key, { row, ent: x, st: e.result_status });
    }
    rows.labs = [...labs.values()]
      .sort((a, b) => instant(a.row.collected) - instant(b.row.collected) || cmpEnt(a.ent, b.ent))
      .map((l) => l.row);

    // Vitals
    for (const x of ofType("vital_set")) {
      const e = x.e;
      const bp = parseBp(e.bp);
      const rp = parseBp(e.bp_repeat);
      const lp = localParts(x.item.effective);
      if (!lp) continue;
      const row: VitalRow = { setting: "clinic", local_time: `${lp.date}T${lp.time}`, evidence: ev(x) };
      if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
      if (bp && rp) { row.repeat_systolic_mmhg = rp[0]; row.repeat_diastolic_mmhg = rp[1]; }
      if (typeof e.pulse_bpm === "number") row.pulse_bpm = e.pulse_bpm;
      if (typeof e.weight_lb === "number") row.weight_kg = Math.round(e.weight_lb * 0.45359237 * 10) / 10;
      if (bp || row.pulse_bpm !== undefined || row.weight_kg !== undefined) rows.vitals.push(row);
    }
  } catch (_err) {
    // never throw
  }
  return rows;
}
