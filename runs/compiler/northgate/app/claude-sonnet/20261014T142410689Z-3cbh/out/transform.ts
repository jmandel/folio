import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Evidence, Sensitivity, Analyte,
} from "../in/views/views";

const TZ = "America/Chicago";

function chicagoParts(ms: number): { date: string; time: string } {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const x of f.formatToParts(new Date(ms))) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

const HAS_OFFSET = /(Z|[+-]\d\d:?\d\d)$/;

/** Local date (YYYY-MM-DD) of a timestamp or date string. */
function localDate(s: string | undefined): string | undefined {
  if (!s) return undefined;
  if (/^\d{4}-\d\d-\d\d$/.test(s)) return s;
  if (/^\d{4}(-\d\d)?$/.test(s)) return s;
  if (!HAS_OFFSET.test(s)) return /^\d{4}-\d\d-\d\d/.test(s) ? s.slice(0, 10) : undefined;
  const ms = Date.parse(s);
  return isNaN(ms) ? undefined : chicagoParts(ms).date;
}

/** Local date-time YYYY-MM-DDTHH:MM, or undefined when only a date is known. */
function localDateTime(s: string | undefined): string | undefined {
  if (!s) return undefined;
  if (/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(s) && !HAS_OFFSET.test(s)) return s.slice(0, 16);
  if (!/T/.test(s)) return undefined;
  const ms = Date.parse(s);
  if (isNaN(ms)) return undefined;
  const p = chicagoParts(ms);
  return `${p.date}T${p.time}`;
}

function tms(s: string | undefined): number {
  if (!s) return 0;
  const ms = Date.parse(HAS_OFFSET.test(s) || !/T/.test(s) ? s : s + "Z");
  return isNaN(ms) ? 0 : ms;
}

interface Ent { item: FolioItem; id: string; e: any }

function cmpEnt(a: Ent, b: Ent): number {
  return tms(a.item.effective) - tms(b.item.effective)
    || tms(a.item.recorded) - tms(b.item.recorded)
    || (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0);
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

function fuzzy(f: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f.date !== "string") return undefined;
  const d: string = f.date;
  if (f.precision === "year") return { value: d.slice(0, 4), precision: "year" };
  if (f.precision === "month") return { value: d.slice(0, 7), precision: "month" };
  if (f.precision === "day") return { value: d.slice(0, 10), precision: "day" };
  return undefined;
}

// ───────────── medications

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", levemir: "insulin detemir",
  humalog: "insulin lispro", novolog: "insulin aspart", ozempic: "semaglutide", rybelsus: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", januvia: "sitagliptin", glucophage: "metformin",
  lasix: "furosemide", zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", cozaar: "losartan",
  diovan: "valsartan", norvasc: "amlodipine", lipitor: "atorvastatin", zocor: "simvastatin", crestor: "rosuvastatin",
  zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine", wellbutrin: "bupropion",
  coreg: "carvedilol", lopressor: "metoprolol", toprol: "metoprolol", aldactone: "spironolactone",
  microzide: "hydrochlorothiazide", tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen",
  aleve: "naproxen", kerendia: "finerenone",
};
const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "succinate", "tartrate", "besylate", "maleate", "calcium",
  "mesylate", "sulfate", "hydrobromide", "phosphate", "fumarate", "acetate", "citrate", "magnesium", "hemihydrate",
]);
const FORM_WORDS = new Set([
  "oral", "tablet", "tablets", "capsule", "capsules", "pen", "injector", "injection", "solution", "suspension",
  "extended", "release", "delayed", "film", "coated", "chewable", "tab", "cap", "prefilled", "syringe", "er", "xr", "sr",
]);

function ingredientOf(name: string): string | undefined {
  let s = name.toLowerCase().replace(/\[[^\]]*\]/g, " ").replace(/\([^)]*\)/g, " ").trim();
  s = s.replace(/^\d+(\.\d+)?\s*(ml|mg|g|l)\b\s*/, "");
  const toks = s.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const t of toks) {
    if (/^\d/.test(t) || FORM_WORDS.has(t)) break;
    out.push(t);
  }
  let words = out.filter((w) => !SALTS.has(w) && w !== "/" && w !== "and" ? true : w === "/" || w === "and");
  while (words.length && (words[0] === "/" || words[0] === "and")) words.shift();
  while (words.length && (words[words.length - 1] === "/" || words[words.length - 1] === "and")) words.pop();
  if (words.length === 0) return undefined;
  if (words.length === 1 && BRANDS[words[0]]) return BRANDS[words[0]];
  const joined = words.join(" ").replace(/[,;]+/g, "").trim();
  const first = joined.split(" ")[0];
  if (BRANDS[first] && words.length <= 2) return BRANDS[first];
  return joined || undefined;
}

function strengthMg(name: string): number | undefined {
  const m = [...name.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg)\b(?!\s*\/)/gi)];
  if (m.length !== 1) return undefined;
  const v = parseFloat(m[0][1]);
  return m[0][2].toLowerCase() === "mg" ? v : undefined;
}

function medDose(e: any): MedicationRow["dose"] | undefined {
  const d = e.dose;
  if (!d || typeof d.value !== "number" || !isFinite(d.value)) return undefined;
  const u = String(d.unit ?? "").toLowerCase();
  if (u === "mg") return { value: d.value, unit: "mg" };
  if (u === "mcg" || u === "ug") return { value: d.value, unit: "mcg" };
  if (u === "ml") return { value: d.value, unit: "mL" };
  if (u === "units" || u === "unit" || u === "unt" || u === "[iu]") return { value: d.value, unit: "units" };
  if (u === "tab" || u === "tablet" || u === "tabs" || u === "tablets") {
    const s = strengthMg(String(e.drug?.name ?? ""));
    if (s !== undefined) return { value: Math.round(d.value * s * 1000) / 1000, unit: "mg" };
    return { value: d.value, unit: "tablet" };
  }
  return undefined;
}

function medFreq(e: any): MedicationRow["frequency"] | undefined {
  switch (e.frequency) {
    case "QD": case "BID": case "TID": case "QHS": case "PRN": return e.frequency;
    case "OTHER":
      if (/week/i.test(e.sig ?? "")) return "QW";
      return "other";
    default: return undefined;
  }
}

function buildMeds(ents: Ent[]): MedicationRow[] {
  const lines = new Map<string, Ent[]>();
  for (const x of ents) {
    if (x.e.type !== "med_event" || typeof x.e.med_id !== "string") continue;
    (lines.get(x.e.med_id) ?? lines.set(x.e.med_id, []).get(x.e.med_id)!).push(x);
  }
  const best = new Map<string, { last: Ent; row: MedicationRow }>();
  for (const [, evs] of lines) {
    evs.sort(cmpEnt);
    const last = evs[evs.length - 1];
    let status: MedicationRow["status"] = "active";
    let statusEnt: Ent = evs[0];
    for (const x of evs) {
      const a = x.e.action;
      if (a === "start" || a === "resume") { status = "active"; statusEnt = x; }
      else if (a === "hold") { status = "held"; statusEnt = x; }
      else if (a === "stop") { status = "stopped"; statusEnt = x; }
    }
    const e = last.e;
    const drugName: string = String(e.drug?.name ?? "");
    if (!drugName) continue;
    const ingredient = ingredientOf(drugName);
    const row: MedicationRow = {
      drug_name: drugName,
      status,
      patient_reported: false,
      evidence: ev(last, statusEnt),
    };
    if (ingredient) row.ingredient = ingredient;
    const since = localDate(statusEnt.item.effective);
    if (since) row.status_since = since;
    const dose = medDose(e);
    if (dose) row.dose = dose;
    const fq = medFreq(e);
    if (fq) row.frequency = fq;
    if (status === "stopped") {
      const r = statusEnt.e.stop_reason ?? e.stop_reason;
      if (r) row.stop_reason = r;
    }
    if (status !== "active") {
      const t = statusEnt.e.reason_text ?? (last !== statusEnt ? e.reason_text : undefined);
      if (t) row.status_reason_text = t;
    }
    if (evs.some((x) => x.e.restricted === "BH")) row.sensitivity = ["mental-health"];
    const key = ingredient ?? "name:" + drugName.toLowerCase();
    const cur = best.get(key);
    if (!cur || cmpEnt(cur.last, last) < 0) best.set(key, { last, row });
  }
  return [...best.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([, v]) => v.row);
}

// ───────────── problems and allergies

function ckdStage(icd: string | undefined, desc: string): ProblemRow["ckd_stage"] | undefined {
  const c = (icd ?? "").toUpperCase();
  if (c === "N18.1") return "G1";
  if (c === "N18.2") return "G2";
  if (c === "N18.31") return "G3a";
  if (c === "N18.32") return "G3b";
  if (c === "N18.4") return "G4";
  if (c === "N18.5") return "G5";
  const m = /stage\s*(1|2|3a|3b|4|5)\b/i.exec(desc) ?? /\bG(1|2|3a|3b|4|5)\b/.exec(desc);
  if (m) return ("G" + m[1].toLowerCase()) as ProblemRow["ckd_stage"];
  return undefined;
}

const DRUG_CLASSES: { re: RegExp; label: string; members: string[] }[] = [
  { re: /sglt-?2/i, label: "SGLT2 inhibitor", members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"] },
  { re: /ace inhibitor|ace-inhibitor/i, label: "ACE inhibitor", members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril"] },
  { re: /\barb\b|angiotensin receptor/i, label: "ARB", members: ["losartan", "valsartan", "irbesartan", "olmesartan", "candesartan", "telmisartan"] },
  { re: /\bstatin/i, label: "statin", members: ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin"] },
  { re: /\bGLP-?1/i, label: "GLP-1 receptor agonist", members: ["semaglutide", "dulaglutide", "liraglutide", "exenatide"] },
];
const ACE_MEMBERS = DRUG_CLASSES[1].members;

const DRUG_CAUSED = /(associated|induced|due to|caused by|secondary to)\b|adverse effect of|toxicity|poisoning/i;

function drugFromProblem(desc: string, meds: MedicationRow[]): { substance: string } | undefined {
  const d = desc.toLowerCase();
  const names = new Set<string>();
  for (const m of meds) if (m.ingredient) names.add(m.ingredient);
  for (const c of DRUG_CLASSES) for (const m of c.members) names.add(m);
  for (const b of Object.keys(BRANDS)) if (new RegExp("\\b" + b + "\\b").test(d)) return { substance: BRANDS[b] };
  for (const n of names) if (d.includes(n)) return { substance: n };
  for (const c of DRUG_CLASSES) {
    if (c.re.test(desc)) {
      const mine = [...new Set(meds.filter((m) => m.ingredient && c.members.includes(m.ingredient)).map((m) => m.ingredient!))];
      return { substance: mine.length === 1 ? mine[0] : c.label };
    }
  }
  const m = /(?:adverse effect of|poisoning by)\s+([a-z0-9 \-]+?)(?:,|\.|$)/i.exec(desc);
  if (m) return { substance: m[1].trim().toLowerCase() };
  return undefined;
}

function classifyReaction(text: string, fallback: AllergyIntoleranceRow["reaction_type"]): AllergyIntoleranceRow["reaction_type"] {
  const t = text.toLowerCase();
  if (/angioedema|hives|urticaria|rash|anaphyla|swelling|bronchospasm|wheez|stevens|steven-johnson/.test(t)) return "hypersensitivity";
  if (/ketoacidosis|lactic acidosis|hyperkalemia|rhabdomyolysis|pancreatitis|liver failure|agranulocytosis|hepatotox/.test(t)) return "serious_adverse_event";
  return fallback;
}

function mechanismOf(substance: string, text: string, rtype: string, srcType: string | undefined): AllergyIntoleranceRow["mechanism"] {
  const t = text.toLowerCase();
  const ace = ACE_MEMBERS.includes(substance.toLowerCase()) || /ace inhibitor/i.test(substance);
  if (ace && /cough|angioedema|swelling/.test(t)) return "non_immune";
  if (/ketoacidosis/.test(t)) return "non_immune";
  if (srcType === "allergy" && rtype === "hypersensitivity") return "immune";
  return "unknown";
}

function buildProblemsAllergies(ents: Ent[], meds: MedicationRow[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const plines = new Map<string, Ent[]>();
  const alines = new Map<string, Ent[]>();
  for (const x of ents) {
    if (x.e.type === "problem_event" && typeof x.e.problem_id === "string")
      (plines.get(x.e.problem_id) ?? plines.set(x.e.problem_id, []).get(x.e.problem_id)!).push(x);
    else if (x.e.type === "allergy_event" && typeof x.e.allergy_id === "string")
      (alines.get(x.e.allergy_id) ?? alines.set(x.e.allergy_id, []).get(x.e.allergy_id)!).push(x);
  }

  const allergyMap = new Map<string, { last: Ent; row: AllergyIntoleranceRow }>();
  const addAllergy = (last: Ent, row: AllergyIntoleranceRow) => {
    const key = row.substance.toLowerCase();
    const cur = allergyMap.get(key);
    if (!cur) { allergyMap.set(key, { last, row }); return; }
    // Same substance: keep the later one, but remember the other's evidence.
    if (cmpEnt(cur.last, last) < 0) {
      row.evidence = [...row.evidence, ...cur.row.evidence.filter((q) => !row.evidence.some((r) => r.item_id === q.item_id && r.entry_id === q.entry_id))];
      allergyMap.set(key, { last, row });
    }
  };

  // problems
  const probByKey = new Map<string, { last: Ent; row: ProblemRow }>();
  for (const [, evs] of plines) {
    evs.sort(cmpEnt);
    const last = evs[evs.length - 1];
    if (last.e.action === "remove") continue;
    const e = last.e;
    const desc = String(e.description ?? "");
    if (!desc) continue;
    const resolved = last.e.action === "resolve";
    const onsetEnt = [...evs].reverse().find((x) => x.e.onset);
    const row: ProblemRow = { condition: desc, status: resolved ? "resolved" : "active", evidence: ev(last) };
    if (e.icd10cm) row.icd10cm = e.icd10cm;
    const snomed = e.snomed ?? [...evs].reverse().find((x) => x.e.snomed)?.e.snomed;
    if (snomed) row.snomed = snomed;
    const on = fuzzy(onsetEnt?.e.onset);
    if (on) row.onset = on;
    const isCkd = /^N18/i.test(e.icd10cm ?? "") || /chronic kidney disease|\bCKD\b/i.test(desc);
    if (isCkd) {
      const st = ckdStage(e.icd10cm, desc);
      if (st) row.ckd_stage = st;
      const al = /\bA([123])\b/.exec(desc);
      if (al) row.albuminuria = ("A" + al[1]) as ProblemRow["albuminuria"];
    }
    if (evs.some((x) => x.e.restricted === "BH")) row.sensitivity = ["mental-health"];

    const code = String(e.icd10cm ?? "");
    const drugCaused = /^T/i.test(code) || DRUG_CAUSED.test(desc);
    let problemRow = true;
    if (drugCaused) {
      const dr = drugFromProblem(desc, meds);
      if (dr) {
        const adverseOnly = /^adverse effect of/i.test(desc) || (/^T/i.test(code) && !/associated|induced|due to|caused by/i.test(desc));
        const condition = desc.replace(/^adverse effect of\s+/i, "");
        const rtype = classifyReaction(desc, "serious_adverse_event");
        const a: AllergyIntoleranceRow = {
          substance: dr.substance,
          reaction_type: rtype,
          mechanism: mechanismOf(dr.substance, desc, rtype, undefined),
          criticality: "unknown",
          evidence: ev(last),
        };
        if (!adverseOnly || condition) a.reaction = adverseOnly ? condition : desc;
        if (rtype === "serious_adverse_event" || /angioedema|anaphyla/i.test(desc)) a.criticality = "high";
        if (on) a.onset = on;
        if (row.sensitivity) a.sensitivity = row.sensitivity;
        addAllergy(last, a);
        if (adverseOnly) problemRow = false;
      }
    }
    if (!problemRow) continue;
    const key = row.icd10cm ? "icd:" + row.icd10cm : "desc:" + desc.toLowerCase();
    const cur = probByKey.get(key);
    if (!cur || cmpEnt(cur.last, last) < 0) probByKey.set(key, { last, row });
  }

  // allergies from the allergy list
  for (const [, evs] of alines) {
    evs.sort(cmpEnt);
    const last = evs[evs.length - 1];
    if (last.e.action === "inactivate") continue;
    const e = last.e;
    const name = String(e.substance?.name ?? "").toLowerCase().trim();
    if (!name) continue;
    const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.map(String) : [];
    const text = reactions.join("; ");
    const fb = e.reaction_type === "allergy" ? "hypersensitivity" : e.reaction_type === "intolerance" ? "side_effect" : "serious_adverse_event";
    const rtype = classifyReaction(text, fb);
    const a: AllergyIntoleranceRow = {
      substance: name,
      reaction_type: rtype,
      mechanism: mechanismOf(name, text, rtype, e.reaction_type),
      criticality: e.severity === "high" || e.severity === "low" ? e.severity : "unknown",
      evidence: ev(last),
    };
    if (e.substance?.rxnorm) a.rxnorm_ingredient = e.substance.rxnorm;
    if (text) a.reaction = text;
    const onsetEnt = [...evs].reverse().find((x) => x.e.onset);
    const on = fuzzy(onsetEnt?.e.onset);
    if (on) a.onset = on;
    // an allergy-list line is authoritative over a problem-derived row for the same substance
    const key = name;
    const cur = allergyMap.get(key);
    if (cur) {
      a.evidence = [...a.evidence, ...cur.row.evidence];
      if (cur.row.sensitivity) a.sensitivity = cur.row.sensitivity;
      allergyMap.set(key, { last: cmpEnt(cur.last, last) < 0 ? last : cur.last, row: a });
    } else allergyMap.set(key, { last, row: a });
  }

  const problems = [...probByKey.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([, v]) => v.row);
  const allergies = [...allergyMap.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([, v]) => v.row);
  return { problems, allergies };
}

// ───────────── labs

function analyteOf(t: { nfm_code?: string; name?: string; loinc?: string }): Analyte | undefined {
  const code = (t.nfm_code ?? "").toUpperCase();
  const name = (t.name ?? "").toLowerCase();
  const byCode: Record<string, Analyte> = {
    CREAT: "creatinine", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate",
    AG: "anion_gap", ANIONGAP: "anion_gap", BUN: "bun", GLU: "glucose", A1C: "a1c", HBA1C: "a1c",
    UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", BHB: "bhb", PH: "ph", PCO2: "pco2",
    LIPASE: "lipase", TROP: "troponin", TNI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides",
    HDL: "hdl", LDL: "ldl", LDLC: "ldl",
  };
  if (byCode[code]) return byCode[code];
  if (code.startsWith("EGFR")) return "egfr";
  if (/egfr|glomerular filtration/.test(name)) return "egfr";
  if (/microalb|albumin.*creatinine/.test(name)) return "uacr";
  if (/creatinine/.test(name) && !/urine|ratio/.test(name)) return "creatinine";
  if (/potassium/.test(name)) return "potassium";
  if (/sodium/.test(name)) return "sodium";
  if (/chloride/.test(name)) return "chloride";
  if (/bicarb|carbon dioxide|co2/.test(name)) return "bicarbonate";
  if (/anion gap/.test(name)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(name)) return "bun";
  if (/a1c/.test(name)) return "a1c";
  if (/glucose/.test(name)) return "glucose";
  if (/platelet/.test(name)) return "platelets";
  if (/white (blood )?cell|\bwbc\b/.test(name)) return "wbc";
  if (/hemoglobin/.test(name)) return "hemoglobin";
  if (/hydroxybutyr/.test(name)) return "bhb";
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

function normUnit(u: string): string {
  return u.toLowerCase().replace(/\s+/g, "").replace(/µ/g, "u").replace(/μ/g, "u");
}

function convert(an: Analyte, v: number, unitRaw: string): number | undefined {
  const u = normUnit(unitRaw);
  const target = normUnit(UNITS[an]);
  if (u === target) return v;
  if (an === "platelets" || an === "wbc") {
    if (u === "cells/ul" || u === "/ul" || u === "/mm3" || u === "cells/mm3") return v / 1000;
    if (u === "k/ul" || u === "10^3/ul" || u === "10e3/ul" || u === "10*3/ul" || u === "x10^3/ul" || u === "thou/ul" || u === "k/mm3") return v;
    return undefined;
  }
  if (an === "creatinine" && (u === "umol/l" || u === "µmol/l")) return v / 88.4;
  if (an === "glucose" && u === "mmol/l") return v * 18.016;
  if (an === "hemoglobin" && u === "g/l") return v / 10;
  if (an === "cholesterol" || an === "ldl" || an === "hdl") { if (u === "mmol/l") return v * 38.67; }
  if (an === "triglycerides" && u === "mmol/l") return v * 88.57;
  if (an === "troponin" && u === "ng/l") return v / 1000;
  if (an === "uacr" && u === "mg/mmol") return v * 8.84;
  if (an === "bun" && u === "mmol/l") return v * 2.801;
  if (an === "a1c" && u === "mmol/mol") return v * 0.0915 + 2.15;
  if (an === "bhb" && u === "mg/dl") return v / 10.4;
  if (an === "ph" && (u === "ph" || u === "")) return v;
  return undefined;
}

function round(v: number): number {
  return Math.round(v * 1e6) / 1e6;
}

function eqOf(e: any): LabResultRow["egfr_equation"] {
  const c = String(e.comment ?? "");
  if (/2021/.test(c) && /CKD-?EPI/i.test(c)) return "ckd-epi-2021";
  if (/2009/.test(c) && /CKD-?EPI/i.test(c)) return "ckd-epi-2009";
  if (/MDRD/i.test(c)) return "mdrd";
  if (/CKD-?EPI/i.test(c)) return "unknown";
  const rc = String(e.external_ref?.result_code ?? "").toUpperCase();
  const nc = String(e.test?.nfm_code ?? "").toUpperCase();
  if (/09/.test(rc) || /09/.test(nc)) return "ckd-epi-2009";
  if (/21/.test(rc) || /21/.test(nc)) return "ckd-epi-2021";
  if (/MDRD/.test(rc + nc)) return "mdrd";
  return "unknown";
}

const STATUS_RANK: Record<string, number> = { P: 0, F: 1, C: 2 };

function buildLabs(ents: Ent[]): LabResultRow[] {
  const best = new Map<string, { x: Ent; row: LabResultRow; rank: number }>();
  for (const x of ents) {
    const e = x.e;
    if (e.type !== "imported_result" || !e.test) continue;
    const an = analyteOf(e.test);
    if (!an) continue;
    if (an === "egfr") {
      const nm = `${e.test.name ?? ""} ${e.test.nfm_code ?? ""}`;
      // race-specific variant with the coefficient
      if (/african american|black|\bAA\b|-AA\b/i.test(nm) && !/non[- ]?african|non[- ]?black|-NAA\b/i.test(nm)) continue;
    }
    const raw = String(e.value ?? "").trim();
    const m = /^(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)$/.exec(raw);
    if (!m) continue;
    const status = e.result_status;
    if (status !== "P" && status !== "F" && status !== "C") continue;
    const v = convert(an, parseFloat(m[2]), String(e.unit ?? ""));
    if (v === undefined || !isFinite(v)) continue;
    const row: LabResultRow = {
      analyte: an,
      value: round(v),
      unit: UNITS[an],
      collected: String(e.collected ?? x.item.effective),
      status: status === "P" ? "preliminary" : "final",
      evidence: ev(x),
    };
    if (m[1]) row.comparator = m[1] as LabResultRow["comparator"];
    if (an === "egfr") row.egfr_equation = eqOf(e);
    if (e.test.loinc) row.loinc = e.test.loinc;
    const key = [e.external_ref?.accession ?? "", e.test.nfm_code ?? an, tms(row.collected)].join("|");
    const rank = STATUS_RANK[status];
    const cur = best.get(key);
    if (!cur || rank > cur.rank || (rank === cur.rank && cmpEnt(cur.x, x) < 0)) best.set(key, { x, row, rank });
  }
  return [...best.values()]
    .map((v) => v.row)
    .sort((a, b) => tms(a.collected) - tms(b.collected) || (a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0) || (a.evidence[0].item_id < b.evidence[0].item_id ? -1 : 1));
}

// ───────────── vitals

function parseBp(s: any): [number, number] | undefined {
  if (typeof s !== "string") return undefined;
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(s);
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : undefined;
}

function buildVitals(ents: Ent[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const x of ents) {
    const e = x.e;
    if (e.type !== "vital_set") continue;
    const t = localDateTime(x.item.effective) ?? localDateTime(x.item.recorded);
    if (!t) continue;
    const row: VitalRow = { setting: "clinic", local_time: t, evidence: ev(x) };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const rp = parseBp(e.bp_repeat);
    if (rp) { row.repeat_systolic_mmhg = rp[0]; row.repeat_diastolic_mmhg = rp[1]; }
    if (typeof e.pulse_bpm === "number") row.pulse_bpm = e.pulse_bpm;
    if (typeof e.weight_lb === "number") row.weight_kg = Math.round(e.weight_lb * 0.45359237 * 10) / 10;
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    rows.push(row);
  }
  return rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : a.evidence[0].item_id < b.evidence[0].item_id ? -1 : 1));
}

// ───────────── entry point

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const inScope = (items ?? []).filter((it) => {
    if (!it || typeof it.recorded !== "string") return false;
    const d = localDate(it.recorded);
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const id of it.supersedes ?? []) dead.add(it.issuer + "|" + id);
    for (const id of it.retracts ?? []) dead.add(it.issuer + "|" + id);
  }
  const ents: Ent[] = [];
  for (const it of inScope) {
    if (dead.has(it.issuer + "|" + it.id)) continue;
    for (const id of Object.keys(it.payload ?? {})) {
      const e = it.payload[id];
      if (e && typeof e === "object") ents.push({ item: it, id, e });
    }
  }
  const medications = buildMeds(ents);
  const { problems, allergies } = buildProblemsAllergies(ents, medications);
  return { medications, problems, allergies, labs: buildLabs(ents), vitals: buildVitals(ents) };
}
