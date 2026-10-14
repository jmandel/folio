import type { FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow, Evidence, Sensitivity, Analyte } from "../in/views/views";

const TZ = "America/Chicago";

// ---------- time helpers ----------
const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

function localParts(s: string | undefined): { date: string; time?: string } | undefined {
  if (!s) return undefined;
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(s)) return { date: s };
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/i.test(s);
  if (!hasZone) {
    const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(s);
    return m ? { date: m[1], time: m[2] } : undefined;
  }
  const t = Date.parse(s);
  if (isNaN(t)) return undefined;
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(t))) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

function instant(s: string | undefined): number {
  if (!s) return 0;
  const t = Date.parse(s);
  if (!isNaN(t)) return t;
  const p = localParts(s);
  return p ? Date.parse(p.date + "T" + (p.time ?? "00:00") + ":00Z") : 0;
}

function cmpItems(a: FolioItem, b: FolioItem): number {
  return instant(a.effective) - instant(b.effective) || instant(a.recorded) - instant(b.recorded) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

// ---------- drug helpers ----------
const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", lantus: "insulin glargine",
  basaglar: "insulin glargine", toujeo: "insulin glargine", cozaar: "losartan", glucophage: "metformin",
  januvia: "sitagliptin", tradjenta: "linagliptin", ozempic: "semaglutide", trulicity: "dulaglutide",
  lasix: "furosemide", zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", lipitor: "atorvastatin",
  zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine", humalog: "insulin lispro",
  novolog: "insulin aspart", glucotrol: "glipizide", diovan: "valsartan", coreg: "carvedilol",
};
const SALTS = new Set(["potassium", "sodium", "hydrochloride", "hcl", "succinate", "tartrate", "maleate", "besylate",
  "mesylate", "calcium", "sulfate", "phosphate", "hydrobromide", "acetate", "citrate", "magnesium", "fumarate"]);
const UNITWORDS = new Set(["ml", "mg", "mcg", "unt", "unt/ml", "mg/ml", "unit", "units", "g"]);

function ingredientOf(name: string): string | undefined {
  const toks = name.replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  let i = 0;
  while (i < toks.length && (/^[\d.\/]+$/.test(toks[i]) || UNITWORDS.has(toks[i].toLowerCase()))) i++;
  const out: string[] = [];
  for (; i < toks.length; i++) {
    if (/^\d/.test(toks[i])) break;
    out.push(toks[i].toLowerCase());
  }
  let words = out.filter((w) => w !== "/" );
  const kept = words.filter((w) => !SALTS.has(w));
  if (kept.length) words = kept;
  if (!words.length) return undefined;
  if (words.length === 1 && BRANDS[words[0]]) return BRANDS[words[0]];
  return words.join(" ");
}

const CLASS_MEMBERS: [RegExp, RegExp][] = [
  [/sglt-?2/i, /gliflozin$/],
  [/ace[ -]?inhibitor/i, /pril$/],
  [/\barb\b|angiotensin receptor/i, /sartan$/],
  [/statin/i, /statin$/],
  [/sulfonylurea/i, /^(glipizide|glyburide|glimepiride)$/],
  [/dpp-?4/i, /gliptin$/],
  [/glp-?1/i, /(glutide|tide)$/],
  [/biguanide/i, /^metformin$/],
];

// ---------- main ----------
export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    run(items, asOf, rows);
  } catch {
    /* never throw */
  }
  return rows;
}

function run(all: FolioItem[], asOf: string, rows: ViewRows): void {
  const inScope = all.filter((it) => {
    const p = localParts(it.recorded);
    return p ? p.date <= asOf : false;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const id of it.supersedes ?? []) dead.add(id);
    for (const id of it.retracts ?? []) dead.add(id);
  }
  const cur = inScope.filter((it) => !dead.has(it.id)).sort(cmpItems);

  type Ent = { item: FolioItem; id: string; e: any };
  const ents: Ent[] = [];
  for (const item of cur) {
    for (const [id, e] of Object.entries(item.payload ?? {})) {
      if (e && typeof e === "object" && typeof (e as any).type === "string") ents.push({ item, id, e });
    }
  }
  const ev = (x: Ent) => ({ item_id: x.item.id, entry_id: x.id });
  const sens = (e: any): Sensitivity[] | undefined => (e.restricted === "BH" ? ["mental-health"] : undefined);

  // ----- medications -----
  const medLines = new Map<string, Ent[]>();
  for (const x of ents) if (x.e.type === "med_event" && typeof x.e.med_id === "string") {
    const a = medLines.get(x.e.med_id) ?? [];
    a.push(x);
    medLines.set(x.e.med_id, a);
  }
  const medCandidates: { row: MedicationRow; key: number; ing: string }[] = [];
  const allIngredients: string[] = [];
  for (const [, evs] of medLines) {
    const last = evs[evs.length - 1];
    const drug = last.e.drug ?? {};
    const name: string = typeof drug.name === "string" ? drug.name : "";
    if (!name) continue;
    const ing = ingredientOf(name);
    if (ing) allIngredients.push(ing);
    let status: MedicationRow["status"] = "active";
    let sinceEv: Ent = evs[0];
    for (const x of evs) {
      const a = x.e.action;
      const s = a === "hold" ? "held" : a === "stop" ? "stopped" : a === "start" || a === "resume" ? "active" : undefined;
      if (s) { status = s; sinceEv = x; }
    }
    const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: evs.map(ev) };
    if (ing) row.ingredient = ing;
    const since = localParts(sinceEv.item.effective)?.date;
    if (since) row.status_since = since;
    const d = last.e.dose;
    if (d && typeof d.value === "number") {
      const u = String(d.unit).toLowerCase();
      if (u === "mg" || u === "mcg" || u === "ml") row.dose = { value: d.value, unit: u === "ml" ? "mL" : (u as "mg" | "mcg") };
      else if (u === "unit" || u === "units" || u === "unt") row.dose = { value: d.value, unit: "units" };
      else if (u === "tab" || u === "tablet" || u === "tablets") {
        const m = /(\d+(?:\.\d+)?)\s*MG\b/i.exec(name);
        row.dose = m ? { value: Math.round(d.value * parseFloat(m[1]) * 1000) / 1000, unit: "mg" } : { value: d.value, unit: "tablet" };
      }
    }
    const f = last.e.frequency;
    if (f === "QD" || f === "BID" || f === "TID" || f === "QHS" || f === "PRN") row.frequency = f;
    else if (f === "OTHER") row.frequency = "other";
    if (status === "stopped" && last.e.stop_reason) row.stop_reason = last.e.stop_reason;
    if ((status === "stopped" || status === "held") && last.e.reason_text) row.status_reason_text = last.e.reason_text;
    const s = evs.some((x) => x.e.restricted === "BH") ? (["mental-health"] as Sensitivity[]) : undefined;
    if (s) row.sensitivity = s;
    medCandidates.push({ row, key: instant(last.item.effective) * 1 + 0, ing: ing ?? "\u0000" + name });
  }
  const bestMed = new Map<string, { row: MedicationRow; key: number }>();
  for (const c of medCandidates) {
    const b = bestMed.get(c.ing);
    if (!b || c.key >= b.key) bestMed.set(c.ing, c);
  }
  rows.medications = [...bestMed.values()].map((c) => c.row);

  // ----- problems -----
  const probLines = new Map<string, Ent[]>();
  for (const x of ents) if (x.e.type === "problem_event" && typeof x.e.problem_id === "string") {
    const a = probLines.get(x.e.problem_id) ?? [];
    a.push(x);
    probLines.set(x.e.problem_id, a);
  }
  for (const [, evs] of probLines) {
    const last = evs[evs.length - 1];
    if (last.e.action === "remove") continue;
    const e = last.e;
    const row: ProblemRow = {
      condition: String(e.description ?? ""),
      status: e.action === "resolve" ? "resolved" : "active",
      evidence: evs.map(ev),
    };
    if (!row.condition) continue;
    if (e.icd10cm) row.icd10cm = e.icd10cm;
    if (e.snomed) row.snomed = e.snomed;
    if (e.onset?.date) {
      const prec = e.onset.precision;
      const v = prec === "year" ? e.onset.date.slice(0, 4) : prec === "month" ? e.onset.date.slice(0, 7) : e.onset.date;
      row.onset = { value: v, precision: prec === "year" || prec === "month" ? prec : "day" };
    }
    const s = sens(e);
    if (s) row.sensitivity = s;
    const icd: string = e.icd10cm ?? "";
    if (/^N18/.test(icd) || /chronic kidney|\bCKD\b/i.test(row.condition)) {
      const m = /stage\s*(1|2|3a|3b|4|5)\b/i.exec(row.condition) ?? /\bG(1|2|3a|3b|4|5)\b/i.exec(row.condition);
      if (m) row.ckd_stage = ("G" + m[1].toLowerCase()) as ProblemRow["ckd_stage"];
      else {
        const t: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
        if (t[icd]) row.ckd_stage = t[icd];
      }
      const a = /\bA([123])\b/.exec(row.condition);
      if (a) row.albuminuria = ("A" + a[1]) as ProblemRow["albuminuria"];
    }
    rows.problems.push(row);

    // drug-caused diagnoses -> allergy row
    const drugRow = drugCaused(row.condition, icd, medLines, allIngredients);
    if (drugRow) {
      const ar: AllergyIntoleranceRow = { ...drugRow, evidence: evs.map(ev) };
      if (s) ar.sensitivity = s;
      rows.allergies.push(ar);
    }
  }

  // ----- allergies -----
  const alLines = new Map<string, Ent[]>();
  for (const x of ents) if (x.e.type === "allergy_event" && typeof x.e.allergy_id === "string") {
    const a = alLines.get(x.e.allergy_id) ?? [];
    a.push(x);
    alLines.set(x.e.allergy_id, a);
  }
  for (const [, evs] of alLines) {
    const last = evs[evs.length - 1];
    const e = last.e;
    if (e.action === "inactivate" || !e.substance?.name) continue;
    const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.map(String) : [];
    const rtext = reactions.join("; ");
    const substance = String(e.substance.name).toLowerCase();
    const isAce = /pril$/.test(substance) || /ace inhibitor/.test(substance);
    const hyper = /angioedema|hives|urticaria|rash|anaphyla|bronchospasm|wheez|swelling/i.test(rtext);
    const mild = reactions.length > 0 && reactions.every((r) => /cough|nausea|vomit|diarrh|myalg|gi |stomach|upset|constipation|headache|dizz/i.test(r));
    let rt: AllergyIntoleranceRow["reaction_type"];
    if (e.reaction_type === "adverse_reaction") rt = hyper ? "hypersensitivity" : "serious_adverse_event";
    else if (e.reaction_type === "intolerance") rt = hyper ? "hypersensitivity" : "side_effect";
    else rt = mild && !hyper ? "side_effect" : "hypersensitivity";
    let mech: AllergyIntoleranceRow["mechanism"] = "unknown";
    if (isAce && /cough|angioedema|swelling/i.test(rtext)) mech = "non_immune";
    else if (e.reaction_type === "allergy" && rt === "hypersensitivity") mech = "immune";
    else if (/ketoacidosis/i.test(rtext)) mech = "non_immune";
    else if (e.reaction_type === "intolerance") mech = "non_immune";
    const row: AllergyIntoleranceRow = {
      substance, reaction_type: rt, mechanism: mech,
      criticality: e.severity === "high" || e.severity === "low" ? e.severity : "unknown",
      evidence: evs.map(ev),
    };
    if (e.substance.rxnorm) row.rxnorm_ingredient = e.substance.rxnorm;
    if (rtext) row.reaction = rtext;
    if (e.onset?.date) {
      const prec = e.onset.precision;
      const v = prec === "year" ? e.onset.date.slice(0, 4) : prec === "month" ? e.onset.date.slice(0, 7) : e.onset.date;
      row.onset = { value: v, precision: prec === "year" || prec === "month" ? prec : "day" };
    }
    rows.allergies.push(row);
  }

  // ----- labs -----
  const rank = (s: string) => (s === "C" ? 3 : s === "F" ? 2 : 1);
  const labBest = new Map<string, { row: LabResultRow; r: number; rec: number }>();
  for (const x of ents) {
    if (x.e.type !== "imported_result") continue;
    const e = x.e;
    const an = analyteOf(e.test);
    if (!an) continue;
    const eq = an === "egfr" ? egfrEquation(e) : undefined;
    if (an === "egfr" && /african american/i.test(String(e.test?.name)) && !/non/i.test(String(e.test?.name))) continue;
    if (an === "egfr" && /-AA$/i.test(String(e.test?.nfm_code))) continue;
    const pv = parseValue(String(e.value ?? ""));
    if (!pv) continue;
    const conv = convert(an, pv.value, String(e.unit ?? ""));
    if (conv === undefined) continue;
    const row: LabResultRow = {
      analyte: an, value: conv, unit: UNITS[an], collected: e.collected ?? x.item.effective,
      status: e.result_status === "P" ? "preliminary" : "final", evidence: [ev(x)],
    };
    if (pv.comparator) row.comparator = pv.comparator;
    if (eq) row.egfr_equation = eq;
    if (e.test?.loinc) row.loinc = e.test.loinc;
    const key = [e.external_ref?.accession ?? x.item.id, an, eq ?? "", e.external_ref?.accession ? "" : x.id].join("|");
    const r = rank(String(e.result_status));
    const rec = instant(x.item.recorded);
    const b = labBest.get(key);
    if (!b || r > b.r || (r === b.r && rec >= b.rec)) labBest.set(key, { row, r, rec });
  }
  rows.labs = [...labBest.values()].map((b) => b.row);

  // ----- vitals -----
  for (const x of ents) {
    if (x.e.type !== "vital_set") continue;
    const e = x.e;
    const lp = localParts(x.item.effective);
    const lt = lp?.time ? lp : localParts(x.item.recorded);
    if (!lt || !lt.time) continue;
    const row: VitalRow = { setting: "clinic", local_time: `${lt.date}T${lt.time}`, evidence: [ev(x)] };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const rp = parseBp(e.bp_repeat);
    if (rp) { row.repeat_systolic_mmhg = rp[0]; row.repeat_diastolic_mmhg = rp[1]; }
    if (typeof e.pulse_bpm === "number") row.pulse_bpm = e.pulse_bpm;
    if (typeof e.weight_lb === "number") row.weight_kg = Math.round(e.weight_lb * 0.45359237 * 10) / 10;
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    rows.vitals.push(row);
  }
}

function parseBp(s: unknown): [number, number] | undefined {
  if (typeof s !== "string") return undefined;
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(s);
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : undefined;
}

function drugCaused(
  cond: string, icd: string, medLines: Map<string, { e: any }[]>, ingredients: string[],
): Omit<AllergyIntoleranceRow, "evidence"> | undefined {
  let m = /^(.*?)[- ]associated\s+(.+)$/i.exec(cond);
  let agent: string | undefined, effect = "";
  if (m) { agent = m[1].trim(); effect = m[2].trim(); }
  else if ((m = /adverse (?:effect|reaction) of\s+(.+?)(?:,|$| \()/i.exec(cond))) { agent = m[1].trim(); }
  else if (/^T(3[6-9]|4\d|50)\./.test(icd)) { agent = cond.replace(/^(poisoning|adverse effect) (by|of)\s*/i, "").trim(); }
  if (!agent) return undefined;
  const lower = agent.toLowerCase();
  let substance = lower;
  const cls = CLASS_MEMBERS.find(([re]) => re.test(agent!));
  if (cls) {
    const uniq = [...new Set(ingredients.filter((i) => cls[1].test(i)))];
    if (uniq.length === 1) substance = uniq[0];
  } else if (BRANDS[lower]) substance = BRANDS[lower];
  const text = effect || cond;
  const hyper = /angioedema|anaphyla|urticaria|hives|rash|bronchospasm/i.test(text);
  const serious = /ketoacidosis|lactic|hyperkal|rhabdo|pancreatitis|hepatotox|failure/i.test(text);
  const reaction_type: AllergyIntoleranceRow["reaction_type"] = hyper ? "hypersensitivity" : serious || effect ? "serious_adverse_event" : "serious_adverse_event";
  const nonImmune = /ketoacidosis|lactic|hyperkal/i.test(text) || (/ace|pril/i.test(agent) && /angioedema|cough/i.test(text));
  const out: Omit<AllergyIntoleranceRow, "evidence"> = {
    substance, reaction_type, mechanism: nonImmune ? "non_immune" : "unknown", criticality: hyper || serious ? "high" : "unknown",
  };
  if (effect) out.reaction = effect;
  return out;
}

// ---------- lab helpers ----------
const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const CODES: Record<string, Analyte> = {
  CREAT: "creatinine", "EGFR-NAA": "egfr", "EGFR-AA": "egfr", NA: "sodium", K: "potassium", CL: "chloride",
};

function analyteOf(t: any): Analyte | undefined {
  if (!t) return undefined;
  const code = String(t.nfm_code ?? "").toUpperCase();
  if (CODES[code]) return CODES[code];
  if (/^EGFR/.test(code)) return "egfr";
  const n = String(t.name ?? "");
  if (/urine|random urine|\bur\b/i.test(n) && !/albumin.*creatinine|microalbumin.*ratio|uacr/i.test(n)) return undefined;
  if (/albumin\s*\/\s*creatinine|uacr|albumin.creatinine ratio/i.test(n)) return "uacr";
  if (/egfr|glomerular/i.test(n)) return "egfr";
  if (/a1c|glycated|glycohemoglobin/i.test(n)) return "a1c";
  if (/creatinine/i.test(n) && !/clearance|ratio/i.test(n)) return "creatinine";
  if (/potassium/i.test(n)) return "potassium";
  if (/sodium/i.test(n)) return "sodium";
  if (/chloride/i.test(n)) return "chloride";
  if (/bicarbonate|carbon dioxide|\bco2\b/i.test(n) && !/pco2|partial/i.test(n)) return "bicarbonate";
  if (/anion gap/i.test(n)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/i.test(n)) return "bun";
  if (/glucose/i.test(n)) return "glucose";
  if (/platelet/i.test(n)) return "platelets";
  if (/white|wbc|leuk/i.test(n)) return "wbc";
  if (/hemoglobin|haemoglobin/i.test(n)) return "hemoglobin";
  if (/hydroxybutyr|bhb/i.test(n)) return "bhb";
  if (/pco2|partial pressure.*carbon/i.test(n)) return "pco2";
  if (/^ph\b|\bph\b.*(blood|arterial|venous)|blood gas ph/i.test(n)) return "ph";
  if (/lipase/i.test(n)) return "lipase";
  if (/troponin/i.test(n)) return "troponin";
  if (/triglycerid/i.test(n)) return "triglycerides";
  if (/\bhdl\b/i.test(n)) return "hdl";
  if (/\bldl\b/i.test(n)) return "ldl";
  if (/cholesterol/i.test(n)) return "cholesterol";
  return undefined;
}

function parseValue(s: string): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  const m = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(s);
  if (!m) return undefined;
  const r: { value: number; comparator?: "<" | ">" | "<=" | ">=" } = { value: parseFloat(m[2]) };
  if (m[1]) r.comparator = m[1] as "<" | ">" | "<=" | ">=";
  return r;
}

function round(v: number): number {
  return Math.round(v * 1e6) / 1e6;
}

function convert(an: Analyte, v: number, unit: string): number | undefined {
  const u = unit.trim().toLowerCase().replace(/\s+/g, "");
  if (an === "platelets" || an === "wbc") {
    if (u === "cells/ul" || u === "/ul" || u === "cells/µl" || u === "/µl") return round(v / 1000);
    return round(v);
  }
  if (an === "glucose" && u === "mmol/l") return round(v * 18.016);
  if (an === "creatinine" && (u === "umol/l" || u === "µmol/l")) return round(v / 88.4);
  if (an === "bun" && u === "mmol/l") return round(v * 2.801);
  if (an === "hemoglobin" && u === "g/l") return round(v / 10);
  if (an === "troponin" && u === "ng/l") return round(v / 1000);
  return v;
}

function egfrEquation(e: any): LabResultRow["egfr_equation"] {
  const c = String(e.comment ?? "");
  if (/ckd-?epi/i.test(c) && /2021/.test(c)) return "ckd-epi-2021";
  if (/ckd-?epi/i.test(c) && /2009/.test(c)) return "ckd-epi-2009";
  if (/mdrd/i.test(c)) return "mdrd";
  const rc = String(e.external_ref?.result_code ?? "").toUpperCase();
  if (/EGFR21|EGFR-?21|2021/.test(rc)) return "ckd-epi-2021";
  if (/EGFR09|2009/.test(rc)) return "ckd-epi-2009";
  if (/MDRD/.test(rc)) return "mdrd";
  return "unknown";
}
