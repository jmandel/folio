import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Evidence, Sensitivity, Analyte,
} from "../in/views/views";

const TZ = "America/Chicago";
const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
});

function localParts(ms: number): { date: string; time: string } {
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

function toMs(s: string | undefined): number {
  if (!s) return NaN;
  if (/^\d{4}(-\d{2}){0,2}$/.test(s)) return Date.parse(s.length === 4 ? s + "-01-01" : s.length === 7 ? s + "-01" : s);
  if (!/(Z|[+-]\d{2}:?\d{2})$/.test(s)) return NaN;
  return Date.parse(s);
}

/** Local (Chicago) date of an effective/recorded string; date-only strings are returned as written. */
function localDate(s: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const ms = toMs(s);
  return isNaN(ms) ? s.slice(0, 10) : localParts(ms).date;
}

function localDateTime(s: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s + "T00:00";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(s)) return s.slice(0, 16);
  const ms = toMs(s);
  if (isNaN(ms)) return s.slice(0, 16);
  const p = localParts(ms);
  return `${p.date}T${p.time}`;
}

interface Ent { item: FolioItem; id: string; e: any; }

function cmpEnt(a: Ent, b: Ent): number {
  const ea = toMs(a.item.effective) || 0, eb = toMs(b.item.effective) || 0;
  if (ea !== eb) return ea - eb;
  const ra = toMs(a.item.recorded) || 0, rb = toMs(b.item.recorded) || 0;
  if (ra !== rb) return ra - rb;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0;
}

function ev(...es: Ent[]): Evidence {
  const out: Evidence = [];
  const seen = new Set<string>();
  for (const x of es) {
    const k = x.item.id + "|" + x.id;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: x.item.id, entry_id: x.id });
  }
  return out;
}

function groupBy<T>(xs: T[], key: (x: T) => string | undefined): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const x of xs) {
    const k = key(x);
    if (k === undefined) continue;
    const l = m.get(k);
    if (l) l.push(x); else m.set(k, [x]);
  }
  return m;
}

function sens(e: any): Sensitivity[] | undefined {
  return e && e.restricted === "BH" ? ["mental-health"] : undefined;
}

function partial(f: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f.date !== "string") return undefined;
  const p = f.precision;
  if (p === "year") return { value: f.date.slice(0, 4), precision: "year" };
  if (p === "month") return { value: f.date.slice(0, 7), precision: "month" };
  return { value: f.date.slice(0, 10), precision: "day" };
}

// ───────────── medications ─────────────

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "succinate", "tartrate", "maleate", "besylate", "mesylate",
  "calcium", "sulfate", "phosphate", "acetate", "citrate", "fumarate", "hydrobromide", "magnesium", "medoxomil",
  "hemihydrate", "dihydrate", "monohydrate", "bromide", "chloride",
]);
const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", lantus: "insulin glargine",
  basaglar: "insulin glargine", toujeo: "insulin glargine", levemir: "insulin detemir", novolog: "insulin aspart",
  humalog: "insulin lispro", glucophage: "metformin", cozaar: "losartan", lasix: "furosemide", norvasc: "amlodipine",
  zestril: "lisinopril", prinivil: "lisinopril", lipitor: "atorvastatin", zocor: "simvastatin", ozempic: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", januvia: "sitagliptin", aldactone: "spironolactone",
  kerendia: "finerenone", zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine", celexa: "citalopram",
  coreg: "carvedilol", lopressor: "metoprolol", toprol: "metoprolol", diovan: "valsartan", tenormin: "atenolol",
};

function ingredientOf(name: string): string | undefined {
  let s = name.toLowerCase().trim();
  s = s.replace(/^\d+(\.\d+)?\s*(ml|mg|g)\s+/, "");
  s = s.replace(/\[([^\]]*)\]/g, "$1").replace(/\(([^)]*)\)/g, " $1 ");
  const toks = s.split(/\s+/).filter(Boolean);
  const keep: string[] = [];
  for (const t of toks) {
    if (/^\d/.test(t) || t === "/" || t === "oral" || t === "injectable" || t === "pen" || t === "tablet" || t === "capsule") break;
    keep.push(t);
  }
  const words = keep.filter((w) => !SALTS.has(w));
  let out = words.join(" ").replace(/[,;]+$/, "").trim();
  if (!out) out = keep.join(" ");
  if (!out) return undefined;
  if (BRANDS[out]) return BRANDS[out];
  const first = out.split(" ")[0];
  if (BRANDS[first] && words.length === 1) return BRANDS[first];
  return out;
}

function strengthMg(name: string): number | undefined {
  if (/\s\/\s/.test(name)) return undefined;
  const m = /(\d+(?:\.\d+)?)\s*MG\b/i.exec(name);
  return m ? parseFloat(m[1]) : undefined;
}

function medRows(ents: Ent[]): MedicationRow[] {
  const lines = groupBy(ents.filter((x) => x.e.type === "med_event" && typeof x.e.med_id === "string"), (x) => x.e.med_id);
  const cands: { row: MedicationRow; last: Ent; key: string }[] = [];
  for (const [, evs] of lines) {
    evs.sort(cmpEnt);
    const last = evs[evs.length - 1];
    const e = last.e;
    const name: string = e.drug?.name ?? "";
    if (!name) continue;
    const ingredient = ingredientOf(name);
    let status: MedicationRow["status"];
    switch (e.action) {
      case "hold": status = "held"; break;
      case "stop": status = "stopped"; break;
      default: status = "active";
    }
    let sinceEnt = last;
    if (status === "active") {
      const st = [...evs].reverse().find((x) => x.e.action === "start" || x.e.action === "resume");
      sinceEnt = st ?? evs[0];
    }
    const row: MedicationRow = {
      drug_name: name, status, patient_reported: false, evidence: ev(last, ...(sinceEnt !== last ? [sinceEnt] : [])),
    };
    if (ingredient) row.ingredient = ingredient;
    row.status_since = localDate(sinceEnt.item.effective);
    if (e.dose && typeof e.dose.value === "number") {
      const u = String(e.dose.unit ?? "").toLowerCase();
      if (u === "mg" || u === "mcg" || u === "units" || u === "ml") {
        row.dose = { value: e.dose.value, unit: u === "ml" ? "mL" : (u as "mg" | "mcg" | "units") };
      } else if (u === "unit" || u === "iu" || u === "[iu]") {
        row.dose = { value: e.dose.value, unit: "units" };
      } else if (u === "tab" || u === "tabs" || u === "tablet" || u === "tablets") {
        const mg = strengthMg(name);
        row.dose = mg !== undefined
          ? { value: Math.round(e.dose.value * mg * 1000) / 1000, unit: "mg" }
          : { value: e.dose.value, unit: "tablet" };
      }
    }
    const sig: string = typeof e.sig === "string" ? e.sig : "";
    switch (e.frequency) {
      case "QD": case "BID": case "TID": case "QHS": case "PRN": row.frequency = e.frequency; break;
      case "OTHER": row.frequency = /\b(weekly|once a week|every week|each week|per week)\b/i.test(sig) ? "QW" : "other"; break;
    }
    if (status === "stopped") {
      if (e.stop_reason) row.stop_reason = e.stop_reason;
    }
    if (status !== "active" && typeof e.reason_text === "string" && e.reason_text) row.status_reason_text = e.reason_text;
    const s = sens(e);
    if (s) row.sensitivity = s;
    cands.push({ row, last, key: ingredient ?? "\u0000" + name.toLowerCase() });
  }
  const byKey = groupBy(cands, (c) => c.key);
  const out: MedicationRow[] = [];
  for (const [, cs] of byKey) {
    cs.sort((a, b) => cmpEnt(a.last, b.last));
    out.push(cs[cs.length - 1].row);
  }
  return out;
}

// ───────────── problems & allergies ─────────────

const CKD_STAGES: Record<string, "G1" | "G2" | "G3a" | "G3b" | "G4" | "G5"> = {
  "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
};

function ckdStage(desc: string, code: string | undefined): "G1" | "G2" | "G3a" | "G3b" | "G4" | "G5" | undefined {
  const m = /stage\s*(1|2|3\s*a|3\s*b|3|4|5)\b/i.exec(desc) || /\bG\s?(1|2|3a|3b|4|5)\b/i.exec(desc);
  if (m) {
    const v = m[1].toLowerCase().replace(/\s/g, "");
    if (v !== "3") return ("G" + v) as any;
  }
  if (code) return CKD_STAGES[code.toUpperCase()];
  return undefined;
}

const ACEI = /(pril)$/;

function drugCaused(desc: string, code: string | undefined): { substance: string; conditionNamed: boolean } | undefined {
  const d = desc.trim();
  let m = /^(.*?)[\s-]+(?:associated|induced)\s+(.+)$/i.exec(d);
  if (m && m[1].trim() && !/diabet|hypertens|kidney|disease|obes|pregnan|stress|alcohol|tobacco|sleep|age|sepsis/i.test(m[1])) {
    return { substance: cleanSubstance(m[1].replace(/^drug[- ]/i, "")), conditionNamed: true };
  }
  const t = code && /^T(3[6-9]|4\d|50)\.[0-9A-Z]*5[A-Z]?$/i.test(code);
  m = /adverse (?:effect|reaction)s?\s+(?:of|to|from)\s+(.+?)(?:,\s*(?:initial|subsequent|sequela).*)?$/i.exec(d);
  if (m) return { substance: cleanSubstance(m[1]), conditionNamed: false };
  if (t) return { substance: cleanSubstance(d), conditionNamed: false };
  return undefined;
}

function cleanSubstance(s: string): string {
  const x = s.trim();
  // keep drug classes as written (e.g. "SGLT2 inhibitor"); lower-case plain drug names
  if (/\b(inhibitor|blocker|antagonist|agonist|class|diuretic|statin|nsaid)\b/i.test(x) || /[A-Z]{2,}/.test(x)) return x;
  return x.toLowerCase();
}

function classifyReaction(reactions: string[], rtype: string, substance: string): {
  type: AllergyIntoleranceRow["reaction_type"]; mech: AllergyIntoleranceRow["mechanism"];
} {
  const txt = reactions.join(" ").toLowerCase();
  const hyper = /(hives|urticaria|rash|angioedema|anaphyla|swelling|bronchospasm|wheez|itch|pruritus|stevens|throat)/.test(txt);
  const serious = /(ketoacidosis|lactic acidosis|hyperkal|rhabdo|pancreatitis|hepatotox|liver failure|renal failure|kidney injury|agranulocytosis)/.test(txt);
  const side = /(cough|nausea|vomit|diarrhea|gi upset|upset|myalgia|muscle|dizz|headache|constipation|fatigue|cramp|edema)/.test(txt);
  let type: AllergyIntoleranceRow["reaction_type"];
  if (hyper) type = "hypersensitivity";
  else if (serious) type = "serious_adverse_event";
  else if (side) type = "side_effect";
  else type = rtype === "allergy" ? "hypersensitivity" : rtype === "intolerance" ? "side_effect" : "serious_adverse_event";
  const acei = ACEI.test(substance.toLowerCase()) || /ace inhibitor/i.test(substance);
  let mech: AllergyIntoleranceRow["mechanism"] = "unknown";
  if (acei && /(cough|angioedema)/.test(txt)) mech = "non_immune";
  else if (/ketoacidosis/.test(txt)) mech = "non_immune";
  else if (rtype === "allergy") mech = "immune";
  else if (rtype === "intolerance") mech = "non_immune";
  return { type, mech };
}

function problemAndAllergyRows(ents: Ent[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const allergies: AllergyIntoleranceRow[] = [];
  const problems: ProblemRow[] = [];

  const alines = groupBy(ents.filter((x) => x.e.type === "allergy_event" && typeof x.e.allergy_id === "string"), (x) => x.e.allergy_id);
  for (const [, evs] of alines) {
    evs.sort(cmpEnt);
    const last = evs[evs.length - 1];
    const e = last.e;
    if (e.action === "inactivate") continue;
    const name = String(e.substance?.name ?? "").trim();
    if (!name) continue;
    const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.filter((r: any) => typeof r === "string") : [];
    const sub = cleanSubstance(name);
    const c = classifyReaction(reactions, e.reaction_type, sub);
    const row: AllergyIntoleranceRow = {
      substance: sub, reaction_type: c.type, mechanism: c.mech,
      criticality: e.severity === "high" || e.severity === "low" ? e.severity : "unknown",
      evidence: ev(last),
    };
    if (e.substance?.rxnorm) row.rxnorm_ingredient = e.substance.rxnorm;
    if (reactions.length) row.reaction = reactions.join("; ");
    const on = partial(e.onset) ?? [...evs].reverse().map((x) => partial(x.e.onset)).find(Boolean);
    if (on) row.onset = on;
    allergies.push(row);
  }

  const plines = groupBy(ents.filter((x) => x.e.type === "problem_event" && typeof x.e.problem_id === "string"), (x) => x.e.problem_id);
  for (const [, evs] of plines) {
    evs.sort(cmpEnt);
    const last = evs[evs.length - 1];
    const e = last.e;
    if (e.action === "remove") continue;
    const desc = String(e.description ?? "").trim();
    if (!desc) continue;
    const dc = drugCaused(desc, e.icd10cm);
    const onset = partial(e.onset) ?? [...evs].reverse().map((x) => partial(x.e.onset)).find(Boolean);
    const s = sens(e);

    if (dc) {
      const sub = dc.substance;
      const existing = allergies.find((a) => a.substance.toLowerCase() === sub.toLowerCase());
      if (existing) {
        existing.evidence = ev(...existing.evidence.map((x) => ({ item: { id: x.item_id } as FolioItem, id: x.entry_id ?? "", e: null })), last);
      } else {
        const rx = dc.conditionNamed ? desc.toLowerCase() : desc.toLowerCase();
        const hyper = /(angioedema|anaphyla|urticaria|rash|hives)/.test(rx);
        const row: AllergyIntoleranceRow = {
          substance: sub,
          reaction_type: hyper ? "hypersensitivity" : /(cough|nausea|diarrhea|myalgia)/.test(rx) ? "side_effect" : "serious_adverse_event",
          mechanism: /ketoacidosis/.test(rx) || (hyper && (ACEI.test(sub.toLowerCase()) || /ace inhibitor/i.test(sub))) ? "non_immune" : "unknown",
          criticality: "unknown",
          evidence: ev(last),
        };
        if (dc.conditionNamed) row.reaction = desc;
        if (onset) row.onset = onset;
        if (s) row.sensitivity = s;
        allergies.push(row);
      }
      if (!dc.conditionNamed) continue;
    }

    const row: ProblemRow = {
      condition: desc, status: e.action === "resolve" ? "resolved" : "active", evidence: ev(last),
    };
    if (e.icd10cm) row.icd10cm = e.icd10cm;
    if (e.snomed) row.snomed = e.snomed;
    if (onset) row.onset = onset;
    if (/^N18\./i.test(e.icd10cm ?? "") || /chronic kidney disease|\bCKD\b/i.test(desc)) {
      const st = ckdStage(desc, e.icd10cm);
      if (st) row.ckd_stage = st;
      const a = /\bA([123])\b/.exec(desc);
      if (a) row.albuminuria = ("A" + a[1]) as "A1" | "A2" | "A3";
    }
    if (s) row.sensitivity = s;
    problems.push(row);
  }
  return { problems, allergies };
}

// ───────────── labs ─────────────

function analyteOf(test: { nfm_code?: string; name?: string }): Analyte | undefined {
  const code = String(test.nfm_code ?? "").toUpperCase();
  const name = String(test.name ?? "").toLowerCase();
  const urine = /urine|\bur\b/.test(name) || /^U[-_]/.test(code);
  if (/^EGFR/.test(code) || /\begfr\b|glomerular/.test(name)) return "egfr";
  if (/uacr|albumin.*creat|microalb/.test(name) || /^(UACR|UMALB|MALB)/.test(code)) return "uacr";
  if (urine) return undefined;
  const byCode: Record<string, Analyte> = {
    CREAT: "creatinine", CR: "creatinine", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate",
    HCO3: "bicarbonate", AG: "anion_gap", ANGAP: "anion_gap", BUN: "bun", GLU: "glucose", GLUC: "glucose",
    A1C: "a1c", HBA1C: "a1c", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb",
    PH: "ph", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase", CHOL: "cholesterol", TRIG: "triglycerides",
    TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl", TROP: "troponin", TNI: "troponin", TROPI: "troponin",
  };
  if (byCode[code]) return byCode[code];
  if (/creatinine/.test(name)) return "creatinine";
  if (/potassium/.test(name)) return "potassium";
  if (/sodium/.test(name)) return "sodium";
  if (/chloride/.test(name)) return "chloride";
  if (/bicarb|carbon dioxide|total co2/.test(name)) return "bicarbonate";
  if (/anion gap/.test(name)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(name)) return "bun";
  if (/glucose/.test(name)) return "glucose";
  if (/a1c|hemoglobin a1/.test(name)) return "a1c";
  if (/platelet/.test(name)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(name)) return "wbc";
  if (/hemoglobin/.test(name)) return "hemoglobin";
  if (/hydroxybutyr/.test(name)) return "bhb";
  if (/\bph\b/.test(name)) return "ph";
  if (/pco2/.test(name)) return "pco2";
  if (/lipase/.test(name)) return "lipase";
  if (/troponin/.test(name)) return "troponin";
  if (/ldl/.test(name)) return "ldl";
  if (/hdl/.test(name)) return "hdl";
  if (/triglycerid/.test(name)) return "triglycerides";
  if (/cholesterol/.test(name)) return "cholesterol";
  return undefined;
}

const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function convert(a: Analyte, v: number, unitRaw: string): number | undefined {
  const u = unitRaw.trim().toLowerCase().replace(/\s+/g, "").replace("µ", "u").replace("μ", "u");
  if (a === "platelets" || a === "wbc") {
    if (u === "cells/ul" || u === "/ul" || u === "cells/mm3" || u === "/mm3") return v / 1000;
    if (u === "k/ul" || u === "10*3/ul" || u === "10^3/ul" || u === "x10e3/ul" || u === "thou/ul" || u === "10e3/ul") return v;
    return undefined;
  }
  switch (a) {
    case "creatinine": if (u === "umol/l") return v / 88.4; break;
    case "glucose": if (u === "mmol/l") return v * 18.016; break;
    case "a1c": if (u === "mmol/mol") return 0.09148 * v + 2.152; break;
    case "cholesterol": case "hdl": case "ldl": if (u === "mmol/l") return v * 38.67; break;
    case "triglycerides": if (u === "mmol/l") return v * 88.57; break;
    case "bun": if (u === "mmol/l") return v * 2.801; break;
    case "hemoglobin": if (u === "g/l") return v / 10; break;
    case "uacr": if (u === "mg/mmol") return v * 8.84; break;
    case "troponin": if (u === "ng/l") return v / 1000; if (u === "pg/ml") return v / 1000; break;
  }
  const want = UNITS[a].toLowerCase().replace(/\s+/g, "");
  if (u === want || u === "" || (a === "a1c" && u === "%") || (a === "egfr" && /^ml\/min/.test(u))) return v;
  if (a === "ph" && (u === "ph" || u === "[ph]")) return v;
  // unknown unit: trust value only when the analyte's unit text is otherwise equivalent
  if (u.replace("dl", "dl") === want) return v;
  return undefined;
}

function eqOf(r: any): "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | "unknown" {
  const c = String(r.comment ?? "").toLowerCase();
  if (/ckd-?epi[^.]*2021|2021[^.]*ckd-?epi/.test(c)) return "ckd-epi-2021";
  if (/ckd-?epi[^.]*2009|2009[^.]*ckd-?epi/.test(c)) return "ckd-epi-2009";
  if (/mdrd/.test(c)) return "mdrd";
  if (/ckd-?epi/.test(c)) return "unknown";
  const rc = String(r.external_ref?.result_code ?? "").toUpperCase();
  if (/EGFR21|2021/.test(rc)) return "ckd-epi-2021";
  if (/EGFR09|2009/.test(rc)) return "ckd-epi-2009";
  if (/MDRD/.test(rc)) return "mdrd";
  return "unknown";
}

function isRaceVariant(r: any): boolean {
  const code = String(r.test?.nfm_code ?? "").toUpperCase();
  const name = String(r.test?.name ?? "").toLowerCase();
  const rc = String(r.external_ref?.result_code ?? "").toUpperCase();
  if (/-AA$|_AA$/.test(code) || /(EGFR\d*A)$/.test(rc)) return true;
  if (/african american/.test(name) && !/non[- ]?african/.test(name)) return true;
  if (/\b(black)\b/.test(name) && !/non[- ]?black/.test(name)) return true;
  return false;
}

const RANK: Record<string, number> = { P: 0, F: 1, C: 2 };

function labRows(ents: Ent[]): LabResultRow[] {
  const results = ents.filter((x) => x.e.type === "imported_result" && x.e.test);
  const best = new Map<string, Ent>();
  for (const x of results) {
    const r = x.e;
    const key = [r.external_ref?.accession ?? x.item.id, r.test.nfm_code, r.external_ref?.result_code ?? "", r.collected].join("|");
    const cur = best.get(key);
    if (!cur) { best.set(key, x); continue; }
    const a = RANK[r.result_status] ?? 1, b = RANK[cur.e.result_status] ?? 1;
    if (a > b || (a === b && cmpEnt(cur, x) < 0)) best.set(key, x);
  }
  const out: LabResultRow[] = [];
  for (const x of best.values()) {
    const r = x.e;
    const analyte = analyteOf(r.test);
    if (!analyte) continue;
    if (analyte === "egfr" && isRaceVariant(r)) continue;
    const m = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(r.value ?? ""));
    if (!m) continue;
    let v = parseFloat(m[2]);
    const cv = convert(analyte, v, String(r.unit ?? ""));
    if (cv === undefined) continue;
    v = cv;
    const row: LabResultRow = {
      analyte, value: Math.round(v * 1e6) / 1e6, unit: UNITS[analyte], collected: r.collected ?? x.item.effective,
      status: r.result_status === "P" ? "preliminary" : "final", evidence: ev(x),
    };
    if (m[1]) row.comparator = m[1] as LabResultRow["comparator"];
    if (analyte === "egfr") row.egfr_equation = eqOf(r);
    if (r.test.loinc) row.loinc = r.test.loinc;
    out.push(row);
  }
  out.sort((a, b) => (toMs(a.collected) - toMs(b.collected)) || (a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
  return out;
}

// ───────────── vitals ─────────────

function parseBp(s: any): [number, number] | undefined {
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(String(s ?? ""));
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : undefined;
}

function vitalRows(ents: Ent[]): VitalRow[] {
  const out: VitalRow[] = [];
  for (const x of ents) {
    if (x.e.type !== "vital_set") continue;
    const e = x.e;
    const row: VitalRow = { setting: "clinic", local_time: localDateTime(x.item.effective), evidence: ev(x) };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const rp = bp ? parseBp(e.bp_repeat) : undefined;
    if (rp) { row.repeat_systolic_mmhg = rp[0]; row.repeat_diastolic_mmhg = rp[1]; }
    if (typeof e.pulse_bpm === "number") row.pulse_bpm = e.pulse_bpm;
    if (typeof e.weight_lb === "number") row.weight_kg = Math.round(e.weight_lb * 0.45359237 * 10) / 10;
    if (!bp && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    out.push(row);
  }
  out.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return out;
}

// ───────────── entry point ─────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items)) return rows;
  try {
    const scoped = items.filter((it) => {
      if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
      const ms = toMs(it.recorded);
      if (isNaN(ms)) return false;
      return localParts(ms).date <= asOf;
    });
    const dead = new Set<string>();
    for (const it of scoped) {
      for (const id of it.supersedes ?? []) dead.add(it.issuer + "|" + id);
      for (const id of it.retracts ?? []) dead.add(it.issuer + "|" + id);
    }
    const current = scoped.filter((it) => !dead.has(it.issuer + "|" + it.id));
    const ents: Ent[] = [];
    for (const item of current) {
      if (!item.payload || typeof item.payload !== "object") continue;
      for (const id of Object.keys(item.payload)) {
        const e = item.payload[id];
        if (e && typeof e === "object") ents.push({ item, id, e });
      }
    }
    rows.medications = medRows(ents);
    const pa = problemAndAllergyRows(ents);
    rows.problems = pa.problems;
    rows.allergies = pa.allergies;
    rows.labs = labRows(ents);
    rows.vitals = vitalRows(ents);
  } catch {
    // never throw on unexpected input
  }
  return rows;
}
