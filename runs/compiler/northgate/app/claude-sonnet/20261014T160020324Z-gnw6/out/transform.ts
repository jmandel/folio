import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Analyte, Sensitivity, Evidence,
} from "../in/views/views";

const TZ = "America/Chicago";
const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
});

interface Local { date: string; time: string }

function localOf(ms: number): Local {
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  const hh = p.hour === "24" ? "00" : p.hour;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${hh}:${p.minute}:${p.second}` };
}

function offsetMin(ms: number): number {
  const l = localOf(ms);
  const asUtc = Date.parse(`${l.date}T${l.time}Z`);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

const HAS_OFFSET = /(Z|[+-]\d{2}:?\d{2})$/i;

/** Instant in ms for a date / date-time string; strings without offset are Chicago local time. */
function toMs(s: string | undefined): number {
  if (!s) return NaN;
  let str = s.trim();
  if (/^\d{4}$/.test(str)) str += "-01-01";
  else if (/^\d{4}-\d{2}$/.test(str)) str += "-01";
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) str += "T00:00:00";
  if (HAS_OFFSET.test(str)) return Date.parse(str);
  const naive = Date.parse(str + "Z");
  if (isNaN(naive)) return NaN;
  let guess = naive + 6 * 3600000;
  guess = naive - offsetMin(guess) * 60000;
  guess = naive - offsetMin(guess) * 60000;
  return guess;
}

/** Local date (or partial date, kept as written) of a source timestamp. */
function localDate(s: string | undefined): string | undefined {
  if (!s) return undefined;
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(s)) return s;
  const ms = toMs(s);
  if (isNaN(ms)) return undefined;
  if (!HAS_OFFSET.test(s)) return s.slice(0, 10);
  return localOf(ms).date;
}

function localMinute(s: string | undefined): string | undefined {
  const ms = toMs(s);
  if (isNaN(ms)) return undefined;
  if (s && !HAS_OFFSET.test(s) && /T\d{2}:\d{2}/.test(s)) return s.slice(0, 16);
  const l = localOf(ms);
  return `${l.date}T${l.time.slice(0, 5)}`;
}

function rfcWithOffset(s: string): string {
  if (HAS_OFFSET.test(s)) return s;
  const ms = toMs(s);
  if (isNaN(ms)) return s;
  const off = offsetMin(ms);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  const base = /T/.test(s) ? s : s + "T00:00:00";
  return `${base}${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

interface Entry { item: FolioItem; key: string; e: any }

function isObj(x: any): boolean { return x !== null && typeof x === "object" && !Array.isArray(x); }

function ev(...es: Entry[]): Evidence {
  const out: Evidence = [];
  const seen = new Set<string>();
  for (const x of es) {
    const k = x.item.id + "#" + x.key;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: x.item.id, entry_id: x.key });
  }
  return out;
}

function cmpEntries(a: Entry, b: Entry): number {
  const ea = toMs(a.item.effective), eb = toMs(b.item.effective);
  if (!isNaN(ea) && !isNaN(eb) && ea !== eb) return ea - eb;
  const ra = toMs(a.item.recorded), rb = toMs(b.item.recorded);
  if (!isNaN(ra) && !isNaN(rb) && ra !== rb) return ra - rb;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0;
}

function groupBy(entries: Entry[], idOf: (e: any) => any): Entry[][] {
  const m = new Map<string, Entry[]>();
  for (const x of entries) {
    const id = idOf(x.e);
    if (typeof id !== "string") continue;
    if (!m.has(id)) m.set(id, []);
    m.get(id)!.push(x);
  }
  const out: Entry[][] = [];
  for (const k of [...m.keys()].sort()) out.push(m.get(k)!.sort(cmpEntries));
  return out;
}

// ---------- medications ----------

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "sulfate", "tartrate", "succinate", "maleate",
  "besylate", "mesylate", "phosphate", "acetate", "citrate", "bromide", "hydrobromide", "dihydrate",
  "monohydrate", "trihydrate", "anhydrous", "hemihydrate", "fumarate", "medoxomil", "axetil", "disodium",
  "nitrate", "carbonate", "magnesium", "dipropionate", "propionate", "hemisulfate",
]);
const FORM_WORDS = new Set([
  "oral", "tablet", "tablets", "capsule", "capsules", "pen", "injector", "injection", "solution", "inhaler",
  "extended", "release", "delayed", "chewable", "topical", "cream", "ointment", "suspension", "patch",
  "prefilled", "syringe", "kit", "powder", "gel", "spray", "drops",
]);

function ingredientOf(name: string): string | undefined {
  let s = name.toLowerCase().replace(/\[[^\]]*\]/g, " ").replace(/\([^)]*\)/g, " ");
  s = s.replace(/^\s*\d+(\.\d+)?\s*(ml|mg|g|l)\b\s*/, "");
  const parts = s.split(/\s+\/\s+/);
  const names: string[] = [];
  for (const part of parts) {
    const toks = part.trim().split(/\s+/).filter(Boolean);
    const kept: string[] = [];
    for (const t of toks) {
      if (/^\d/.test(t) || FORM_WORDS.has(t)) break;
      if (kept.length > 0 && SALTS.has(t)) continue;
      kept.push(t);
    }
    if (kept.length) names.push(kept.join(" "));
  }
  return names.length ? names.join(" / ") : undefined;
}

function normFreq(m: any): MedicationRow["frequency"] | undefined {
  switch (m.frequency) {
    case "QD": return "QD";
    case "BID": return "BID";
    case "TID": return "TID";
    case "QHS": return "QHS";
    case "PRN": return "PRN";
    case "OTHER": {
      const sig = String(m.sig ?? "").toLowerCase();
      if (/\b(once (a |per |every )?week|weekly|every week|once a week)\b/.test(sig)) return "QW";
      if (/\bevery 12 hours\b/.test(sig)) return "BID";
      if (/\bevery 8 hours\b/.test(sig)) return "TID";
      if (/\bas needed\b|\bprn\b/.test(sig)) return "PRN";
      return "other";
    }
  }
  return undefined;
}

function medDose(m: any): MedicationRow["dose"] | undefined {
  const d = m.dose;
  if (!d || typeof d.value !== "number") return undefined;
  const u = String(d.unit ?? "").toLowerCase().trim();
  if (u === "mg" || u === "milligram" || u === "milligrams") return { value: d.value, unit: "mg" };
  if (u === "mcg" || u === "ug" || u === "µg" || u === "microgram" || u === "micrograms") return { value: d.value, unit: "mcg" };
  if (u === "units" || u === "unit" || u === "u" || u === "iu") return { value: d.value, unit: "units" };
  if (u === "ml" || u === "cc") return { value: d.value, unit: "mL" };
  if (u === "tab" || u === "tabs" || u === "tablet" || u === "tablets") {
    const name = String(m.drug?.name ?? "");
    if (!name.includes(" / ")) {
      const mt = name.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|ug|g)\b(?!\s*\/)/i);
      if (mt) {
        const strength = parseFloat(mt[1]);
        const unit = mt[2].toLowerCase();
        if (unit === "g") return { value: round(strength * 1000 * d.value, 4), unit: "mg" };
        if (unit === "mg") return { value: round(strength * d.value, 4), unit: "mg" };
        return { value: round(strength * d.value, 4), unit: "mcg" };
      }
    }
    return { value: d.value, unit: "tablet" };
  }
  return undefined;
}

function round(x: number, dp: number): number {
  const f = Math.pow(10, dp);
  return Math.round(x * f) / f;
}

const SUBSTANCE_USE_DRUGS = ["buprenorphine", "naltrexone", "methadone", "naloxone", "disulfiram", "acamprosate"];

function buildMeds(entries: Entry[]): MedicationRow[] {
  const lines = groupBy(entries.filter((x) => x.e.type === "med_event"), (e) => e.med_id);
  const byIngredient = new Map<string, { last: Entry; row: MedicationRow }>();
  for (const line of lines) {
    const last = line[line.length - 1];
    const m = last.e;
    const name = m.drug?.name;
    if (typeof name !== "string") continue;
    const ingredient = ingredientOf(name);
    let status: MedicationRow["status"];
    switch (m.action) {
      case "hold": status = "held"; break;
      case "stop": status = "stopped"; break;
      case "start": case "change": case "resume": status = "active"; break;
      default: continue;
    }
    let sinceEntry = last;
    if (status === "active") {
      for (let i = line.length - 1; i >= 0; i--) {
        if (line[i].e.action === "start" || line[i].e.action === "resume") { sinceEntry = line[i]; break; }
      }
    }
    const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: [] } as any;
    if (ingredient) row.ingredient = ingredient;
    const since = localDate(sinceEntry.item.effective);
    if (since) row.status_since = since;
    const dose = medDose(m);
    if (dose) row.dose = dose;
    const f = normFreq(m);
    if (f) row.frequency = f;
    if (status === "stopped" && m.stop_reason) row.stop_reason = m.stop_reason;
    if (typeof m.reason_text === "string" && m.reason_text && status !== "active") row.status_reason_text = m.reason_text;
    else if (typeof m.reason_text === "string" && m.reason_text && m.action !== "start") row.status_reason_text = m.reason_text;
    const sens: Sensitivity[] = [];
    if (line.some((x) => x.e.restricted === "BH")) sens.push("mental-health");
    if (ingredient && SUBSTANCE_USE_DRUGS.some((d) => ingredient.includes(d))) sens.push("substance-use");
    if (sens.length) row.sensitivity = sens;
    row.evidence = ev(last, ...line);
    const key = ingredient ?? "name:" + name.toLowerCase();
    const prev = byIngredient.get(key);
    if (!prev || cmpEntries(prev.last, last) < 0) byIngredient.set(key, { last, row });
  }
  return [...byIngredient.keys()].sort().map((k) => byIngredient.get(k)!.row);
}

// ---------- problems and allergies ----------

function onsetOf(f: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f.date !== "string") return undefined;
  const p = f.precision;
  if (p === "year") return { value: f.date.slice(0, 4), precision: "year" };
  if (p === "month") return { value: f.date.slice(0, 7), precision: "month" };
  return { value: f.date.slice(0, 10), precision: "day" };
}

function ckdStage(desc: string, code: string): ProblemRow["ckd_stage"] | undefined {
  const d = desc.toLowerCase();
  let m = d.match(/\bg\s*([1-5])\s*([ab])?\b/);
  if (m) {
    if (m[1] === "3") return m[2] ? (("G3" + m[2]) as any) : undefined;
    return ("G" + m[1]) as any;
  }
  m = d.match(/stage\s*(?:([1-5])|(i{1,3}|iv|v))\s*([ab])?\b/);
  if (m) {
    const roman: Record<string, string> = { i: "1", ii: "2", iii: "3", iv: "4", v: "5" };
    const n = m[1] ?? roman[m[2]];
    if (n === "3") return m[3] ? (("G3" + m[3]) as any) : undefined;
    if (n) return ("G" + n) as any;
  }
  const c = code.toUpperCase();
  const map: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
  };
  return map[c];
}

function albuminuria(desc: string): ProblemRow["albuminuria"] | undefined {
  const m = desc.match(/\bA([123])\b/) || desc.match(/albuminuria\s*(?:category|stage|cat\.?)?\s*([123])\b/i);
  return m ? (("A" + m[1]) as any) : undefined;
}

function isCkd(desc: string, code: string): boolean {
  return /^N18\./i.test(code) || /chronic kidney|\bckd\b/i.test(desc);
}

const ADVERSE_CODE = /^T(3[6-9]|4\d|50)\.[0-9A-Z]5/i;

function knownDrugNames(entries: Entry[]): string[] {
  const s = new Set<string>();
  for (const x of entries) {
    if (x.e.type === "med_event" && typeof x.e.drug?.name === "string") {
      const i = ingredientOf(x.e.drug.name);
      if (i) for (const p of i.split(" / ")) s.add(p);
    }
    if (x.e.type === "allergy_event" && typeof x.e.substance?.name === "string") s.add(x.e.substance.name.toLowerCase());
  }
  return [...s].filter((n) => n.length > 3);
}

function allergyKind(a: { reaction_type?: string; reactions?: string[] }): AllergyIntoleranceRow["reaction_type"] {
  const text = (a.reactions ?? []).join(" ").toLowerCase();
  if (/hive|urticaria|rash|swell|angioedema|anaphyla|bronchospasm|wheez|itch|pruritus|stevens|laryngeal|throat/.test(text)) {
    return "hypersensitivity";
  }
  if (a.reaction_type === "adverse_reaction") return "serious_adverse_event";
  if (a.reaction_type === "intolerance") return "side_effect";
  return "hypersensitivity";
}

function buildProblemsAndDrugAllergies(entries: Entry[]): { problems: ProblemRow[]; extra: AllergyIntoleranceRow[] } {
  const lines = groupBy(entries.filter((x) => x.e.type === "problem_event"), (e) => e.problem_id);
  const drugs = knownDrugNames(entries);
  const problems: ProblemRow[] = [];
  const extra: AllergyIntoleranceRow[] = [];
  for (const line of lines) {
    const last = line[line.length - 1];
    const p = last.e;
    if (p.action === "remove") continue;
    if (typeof p.description !== "string") continue;
    const code = typeof p.icd10cm === "string" ? p.icd10cm : "";
    const sens: Sensitivity[] = [];
    if (line.some((x) => x.e.restricted === "BH")) sens.push("mental-health");
    const onset = onsetOf(p.onset);

    // Drug-attributed diagnoses also yield an allergy row.
    let drugSubstance: string | undefined;
    let adverseOnly = false;
    if (ADVERSE_CODE.test(code)) {
      adverseOnly = true;
      const m = p.description.match(/(?:adverse effects? of|due to|from|poisoning by)\s+(.+)$/i);
      drugSubstance = (m ? m[1] : p.description).trim();
    } else {
      const m = p.description.match(/\b(?:due to|caused by|induced by|from|secondary to|reaction to)\s+(.+)$/i);
      if (m) {
        const cand = m[1].toLowerCase();
        const hit = drugs.find((d) => cand.includes(d));
        if (hit) drugSubstance = hit;
      }
    }
    if (drugSubstance) {
      const row: AllergyIntoleranceRow = {
        substance: drugSubstance.toLowerCase() === drugSubstance || adverseOnly ? drugSubstance.toLowerCase() : drugSubstance,
        reaction_type: "hypersensitivity",
        mechanism: "unknown",
        criticality: "unknown",
        evidence: ev(last),
      };
      if (!adverseOnly) row.reaction = p.description;
      if (onset) row.onset = onset;
      if (sens.length) row.sensitivity = sens;
      extra.push(row);
    }
    if (adverseOnly) continue;

    const row: ProblemRow = {
      condition: p.description,
      status: p.action === "resolve" ? "resolved" : "active",
      evidence: ev(last, ...line),
    };
    if (code) row.icd10cm = code;
    if (typeof p.snomed === "string" && p.snomed) row.snomed = p.snomed;
    if (onset) row.onset = onset;
    if (isCkd(p.description, code)) {
      const st = ckdStage(p.description, code);
      if (st) row.ckd_stage = st;
      const al = albuminuria(p.description);
      if (al) row.albuminuria = al;
    }
    if (sens.length) row.sensitivity = sens;
    problems.push(row);
  }
  return { problems, extra };
}

function buildAllergies(entries: Entry[]): AllergyIntoleranceRow[] {
  const lines = groupBy(entries.filter((x) => x.e.type === "allergy_event"), (e) => e.allergy_id);
  const out: AllergyIntoleranceRow[] = [];
  for (const line of lines) {
    const last = line[line.length - 1];
    const a = last.e;
    if (a.action === "inactivate") continue;
    const sub = a.substance;
    if (!sub || typeof sub.name !== "string") continue;
    const reactions: string[] = Array.isArray(a.reactions) ? a.reactions.filter((r: any) => typeof r === "string") : [];
    const row: AllergyIntoleranceRow = {
      substance: typeof sub.rxnorm === "string" ? sub.name.toLowerCase() : sub.name,
      reaction_type: allergyKind(a),
      mechanism: a.reaction_type === "allergy" ? "immune" : a.reaction_type === "intolerance" ? "non_immune" : "unknown",
      criticality: a.severity === "high" ? "high" : a.severity === "low" ? "low" : "unknown",
      evidence: ev(last, ...line),
    };
    if (typeof sub.rxnorm === "string") row.rxnorm_ingredient = sub.rxnorm;
    if (reactions.length) row.reaction = reactions.join("; ");
    const on = onsetOf(a.onset);
    if (on) row.onset = on;
    out.push(row);
  }
  return out;
}

// ---------- labs ----------

function analyteOf(t: any): Analyte | undefined {
  const loinc = String(t?.loinc ?? "");
  const code = String(t?.nfm_code ?? "").toUpperCase();
  const name = String(t?.name ?? "").toLowerCase();
  const byLoinc: Record<string, Analyte> = {
    "2160-0": "creatinine", "38483-4": "creatinine", "2823-3": "potassium", "6298-4": "potassium",
    "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate",
    "33037-3": "anion_gap", "1863-0": "anion_gap", "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose",
    "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "14959-1": "uacr", "9318-7": "uacr", "32294-1": "uacr",
    "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin",
    "59032-3": "bhb", "53060-0": "bhb", "2753-2": "bhb", "2744-1": "ph", "2019-8": "pco2", "11556-8": "pco2",
    "3040-3": "lipase", "6690-3": "wbc", "10839-9": "troponin", "49563-0": "troponin", "2093-3": "cholesterol",
    "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
    "62238-1": "egfr", "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "69405-9": "egfr", "98979-8": "egfr", "77147-7": "egfr",
  };
  if (byLoinc[loinc]) return byLoinc[loinc];
  if (/^EGFR/.test(code) || /egfr|glomerular/.test(name)) return "egfr";
  const byCode: Record<string, Analyte> = {
    CREAT: "creatinine", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate",
    AG: "anion_gap", ANGAP: "anion_gap", BUN: "bun", GLU: "glucose", GLUC: "glucose", A1C: "a1c", HBA1C: "a1c",
    UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", BHB: "bhb", PH: "ph", PCO2: "pco2",
    LIPASE: "lipase", TROPI: "troponin", TNI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", HDL: "hdl", LDL: "ldl",
  };
  if (byCode[code]) return byCode[code];
  if (/creatinine/.test(name) && !/urine|ratio|clearance/.test(name)) return "creatinine";
  if (/potassium/.test(name)) return "potassium";
  if (/sodium/.test(name)) return "sodium";
  if (/chloride/.test(name)) return "chloride";
  if (/bicarbonate|total co2|carbon dioxide, total/.test(name)) return "bicarbonate";
  if (/anion gap/.test(name)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(name)) return "bun";
  if (/glucose/.test(name)) return "glucose";
  if (/a1c/.test(name)) return "a1c";
  if (/albumin.*creatinine|uacr/.test(name)) return "uacr";
  if (/platelet/.test(name)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(name)) return "wbc";
  if (/hemoglobin/.test(name)) return "hemoglobin";
  if (/hydroxybutyrate/.test(name)) return "bhb";
  if (/^ph\b|\bph,? /.test(name)) return "ph";
  if (/pco2/.test(name)) return "pco2";
  if (/lipase/.test(name)) return "lipase";
  if (/troponin/.test(name)) return "troponin";
  if (/triglycer/.test(name)) return "triglycerides";
  if (/\bhdl\b/.test(name)) return "hdl";
  if (/\bldl\b/.test(name)) return "ldl";
  if (/cholesterol/.test(name)) return "cholesterol";
  return undefined;
}

const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function convert(an: Analyte, v: number, unitRaw: string): number | undefined {
  const u = unitRaw.toLowerCase().replace(/\s+/g, "").replace("µ", "u");
  const target = UNITS[an].toLowerCase();
  if (u === target) return v;
  if (u === "" && (an === "ph")) return v;
  if (an === "platelets" || an === "wbc") {
    if (u === "cells/ul" || u === "/ul" || u === "/mm3" || u === "cells/mm3") return round(v / 1000, 4);
    if (u === "k/ul" || u === "10^3/ul" || u === "10*3/ul" || u === "x10e3/ul" || u === "thou/ul" || u === "k/mm3" || u === "10e3/ul" || u === "10^9/l" || u === "10*9/l" || u === "g/l") return v;
    return undefined;
  }
  if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(an)) {
    if (u === "meq/l") return v;
    return undefined;
  }
  switch (an) {
    case "creatinine":
      if (u === "umol/l") return round(v / 88.4, 3);
      if (u === "mg/l") return round(v / 10, 3);
      break;
    case "glucose":
      if (u === "mmol/l") return round(v * 18.016, 1);
      break;
    case "bun":
      if (u === "mmol/l") return round(v * 2.801, 2);
      break;
    case "a1c":
      if (u === "mmol/mol") return round(0.09148 * v + 2.152, 2);
      break;
    case "hemoglobin":
      if (u === "g/l") return round(v / 10, 2);
      break;
    case "cholesterol": case "ldl": case "hdl":
      if (u === "mmol/l") return round(v * 38.67, 1);
      break;
    case "triglycerides":
      if (u === "mmol/l") return round(v * 88.57, 1);
      break;
    case "uacr":
      if (u === "mg/mmol") return round(v * 8.84, 2);
      if (u === "ug/mg") return v;
      break;
    case "troponin":
      if (u === "ng/l" || u === "pg/ml") return round(v / 1000, 4);
      if (u === "ug/l") return v;
      break;
    case "egfr":
      if (u === "ml/min/1.73m^2" || u === "ml/min/1.73m²" || u === "ml/min/1.73sqm" || u === "ml/min") return v;
      break;
    case "pco2":
      if (u === "kpa") return round(v * 7.50062, 1);
      break;
    case "lipase":
      if (u === "iu/l") return v;
      break;
  }
  return undefined;
}

function eqOf(r: any): LabResultRow["egfr_equation"] {
  const txt = `${r.comment ?? ""} ${r.test?.name ?? ""} ${r.external_ref?.result_code ?? ""}`.toLowerCase();
  if (/2021/.test(txt) || /egfr21|race[- ]free/.test(txt)) return "ckd-epi-2021";
  if (/ckd-?epi/.test(txt) && /2009/.test(txt)) return "ckd-epi-2009";
  if (/egfr09/.test(txt)) return "ckd-epi-2009";
  if (/mdrd/.test(txt)) return "mdrd";
  return "unknown";
}

function isRaceCoefficientVariant(r: any): boolean {
  const code = String(r.test?.nfm_code ?? "").toUpperCase();
  const name = String(r.test?.name ?? "").toLowerCase();
  if (/non[- ]?(african|black)/.test(name)) return false;
  if (/african american|\bblack\b/.test(name)) return true;
  if (/-AA$/.test(code)) return true;
  return false;
}

function buildLabs(entries: Entry[]): LabResultRow[] {
  const best = new Map<string, { entry: Entry; row: LabResultRow; rank: number; copies: Entry[] }>();
  for (const x of entries) {
    const r = x.e;
    if (r.type !== "imported_result") continue;
    const an = analyteOf(r.test);
    if (!an) continue;
    if (an === "egfr" && isRaceCoefficientVariant(r)) continue;
    if (r.result_status !== "P" && r.result_status !== "F" && r.result_status !== "C") continue;
    const m = String(r.value ?? "").trim().match(/^(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?)$/);
    if (!m) continue;
    const raw = parseFloat(m[2]);
    const val = convert(an, raw, String(r.unit ?? ""));
    if (val === undefined || !isFinite(val)) continue;
    if (typeof r.collected !== "string") continue;
    const row: LabResultRow = {
      analyte: an,
      value: val,
      unit: UNITS[an],
      collected: rfcWithOffset(r.collected),
      status: r.result_status === "P" ? "preliminary" : "final",
      evidence: ev(x),
    };
    if (m[1]) row.comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as any;
    if (an === "egfr") row.egfr_equation = eqOf(r);
    if (typeof r.test?.loinc === "string" && r.test.loinc) row.loinc = r.test.loinc;
    const acc = r.external_ref?.accession ?? x.item.id;
    const key = `${acc}|${r.test?.nfm_code}|${r.collected}`;
    const rank = r.result_status === "P" ? 0 : 1;
    const prev = best.get(key);
    if (!prev) best.set(key, { entry: x, row, rank, copies: [x] });
    else {
      prev.copies.push(x);
      if (rank > prev.rank || (rank === prev.rank && cmpEntries(prev.entry, x) < 0)) {
        prev.entry = x; prev.row = row; prev.rank = rank;
      }
    }
  }
  const rows: LabResultRow[] = [];
  for (const b of best.values()) {
    b.row.evidence = ev(b.entry, ...b.copies);
    rows.push(b.row);
  }
  rows.sort((a, b) =>
    toMs(a.collected) - toMs(b.collected) || (a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0) ||
    (a.egfr_equation ?? "").localeCompare(b.egfr_equation ?? "") || a.value - b.value);
  return rows;
}

// ---------- vitals ----------

function parseBp(s: any): [number, number] | undefined {
  if (typeof s !== "string") return undefined;
  const m = s.trim().match(/^(\d+)\s*\/\s*(\d+)$/);
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : undefined;
}

function buildVitals(entries: Entry[]): VitalRow[] {
  const rows: { t: number; row: VitalRow }[] = [];
  for (const x of entries) {
    const v = x.e;
    if (v.type !== "vital_set") continue;
    const t = localMinute(x.item.effective) ?? localMinute(x.item.recorded);
    if (!t) continue;
    const row: VitalRow = { setting: "clinic", local_time: t, evidence: ev(x) };
    const bp = parseBp(v.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const rp = parseBp(v.bp_repeat);
    if (rp) { row.repeat_systolic_mmhg = rp[0]; row.repeat_diastolic_mmhg = rp[1]; }
    if (typeof v.pulse_bpm === "number") row.pulse_bpm = v.pulse_bpm;
    if (typeof v.weight_lb === "number") row.weight_kg = round(v.weight_lb * 0.45359237, 1);
    if (bp === undefined && rp === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    rows.push({ t: toMs(t), row });
  }
  rows.sort((a, b) => a.t - b.t);
  return rows.map((r) => r.row);
}

// ---------- entry point ----------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const counting = (items ?? []).filter((it) => {
      if (!it || typeof it.id !== "string") return false;
      const d = localDate(it.recorded);
      return d !== undefined && d.slice(0, 10) <= asOf;
    });
    const retracted = new Set<string>();
    for (const it of counting) {
      for (const id of it.retracts ?? []) retracted.add(id);
      for (const e of Object.values(it.payload ?? {})) {
        if (isObj(e) && (e as any).type === "chart_correction" && Array.isArray((e as any).voided_items)) {
          for (const id of (e as any).voided_items) if (typeof id === "string") retracted.add(id);
        }
      }
    }
    const live = counting.filter((it) => !retracted.has(it.id));
    const byId = new Map<string, FolioItem>();
    for (const it of items) if (it && typeof it.id === "string") byId.set(it.id, it);
    const replaced = new Set<string>();
    const walk = (id: string) => {
      if (replaced.has(id)) return;
      replaced.add(id);
      const it = byId.get(id);
      for (const s of it?.supersedes ?? []) walk(s);
    };
    for (const it of live) for (const s of it.supersedes ?? []) walk(s);

    const entries: Entry[] = [];
    for (const it of live) {
      if (replaced.has(it.id)) continue;
      for (const [key, e] of Object.entries(it.payload ?? {})) {
        if (isObj(e) && typeof (e as any).type === "string") entries.push({ item: it, key, e });
      }
    }
    const { problems, extra } = buildProblemsAndDrugAllergies(entries);
    return {
      medications: buildMeds(entries),
      problems,
      allergies: [...buildAllergies(entries), ...extra],
      labs: buildLabs(entries),
      vitals: buildVitals(entries),
    };
  } catch {
    return empty;
  }
}
