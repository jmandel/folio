import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Analyte, Sensitivity, Evidence,
} from "../in/views/views";

const TZ = "America/Chicago";
const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
});

interface Local { date: string; time: string }

function chicagoParts(ms: number): Local {
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}:${p.second}` };
}

/** Local wall-clock of a date / date-time string; strings with an offset or Z are converted to Chicago. */
function toLocal(s: string | undefined): Local | undefined {
  if (!s) return undefined;
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?\s*(Z|[+-]\d{2}:?\d{2})?)?$/.exec(s.trim());
  if (!m) return undefined;
  if (m[4] === undefined) return { date: `${m[1]}-${m[2]}-${m[3]}`, time: "00:00:00" };
  if (m[7] === undefined) return { date: `${m[1]}-${m[2]}-${m[3]}`, time: `${m[4]}:${m[5]}:${m[6] ?? "00"}` };
  const ms = Date.parse(s.trim().replace(" ", "T"));
  if (isNaN(ms)) return undefined;
  return chicagoParts(ms);
}

function chicagoOffsetFor(l: Local): string {
  for (const off of ["-05:00", "-06:00"]) {
    const ms = Date.parse(`${l.date}T${l.time}${off}`);
    if (!isNaN(ms)) {
      const b = chicagoParts(ms);
      if (b.date === l.date && b.time === l.time) return off;
    }
  }
  return "-06:00";
}

function localKey(s: string | undefined): string {
  const l = toLocal(s);
  return l ? `${l.date}T${l.time}` : "";
}

interface Entry { item: FolioItem; id: string; e: any }

function counting(items: FolioItem[], asOf: string): FolioItem[] {
  const ok = items.filter((i) => {
    const l = toLocal(i.recorded);
    return l !== undefined && l.date <= asOf;
  });
  const dead = new Set<string>();
  for (const i of ok) {
    for (const x of i.retracts ?? []) dead.add(x);
    for (const x of i.supersedes ?? []) dead.add(x);
  }
  // Transitive supersession: any superseded item's own supersedes are already included since
  // the superseding item (if counting) lists them; chains through counting items are covered.
  return ok.filter((i) => !dead.has(i.id));
}

function entries(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    const p = item.payload;
    if (!p || typeof p !== "object") continue;
    for (const id of Object.keys(p)) {
      const e = p[id];
      if (e && typeof e === "object" && e.type === type) out.push({ item, id, e });
    }
  }
  return out;
}

function cmpEntries(a: Entry, b: Entry): number {
  const ka = localKey(a.item.effective), kb = localKey(b.item.effective);
  if (ka !== kb) return ka < kb ? -1 : 1;
  const ra = Date.parse(a.item.recorded), rb = Date.parse(b.item.recorded);
  if (ra !== rb && !isNaN(ra) && !isNaN(rb)) return ra < rb ? -1 : 1;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0;
}

function latestBy(es: Entry[], key: string): Map<string, Entry> {
  const m = new Map<string, Entry>();
  for (const x of es.slice().sort(cmpEntries)) {
    const k = x.e[key];
    if (typeof k === "string") m.set(k, x);
  }
  return m;
}

function ev(x: Entry): Evidence {
  return [{ item_id: x.item.id, entry_id: x.id }];
}

function fuzzy(f: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f.date !== "string") return undefined;
  const d: string = f.date;
  if (f.precision === "year") return { value: d.slice(0, 4), precision: "year" };
  if (f.precision === "month") return { value: d.slice(0, 7), precision: "month" };
  return { value: d.slice(0, 10), precision: "day" };
}

const MH_DRUGS = /\b(sertraline|fluoxetine|escitalopram|citalopram|paroxetine|bupropion|venlafaxine|desvenlafaxine|duloxetine|quetiapine|lithium|aripiprazole|olanzapine|risperidone|buspirone|trazodone|mirtazapine|fluvoxamine|amitriptyline|nortriptyline|hydroxyzine|clonazepam|lorazepam|alprazolam|diazepam)\b/;
const SU_DRUGS = /\b(buprenorphine|naltrexone|methadone|disulfiram|acamprosate|naloxone)\b/;

function sensFromIcd(code: string | undefined): Sensitivity[] {
  const out: Sensitivity[] = [];
  if (!code) return out;
  const c = code.toUpperCase();
  if (/^F(1\d)/.test(c)) out.push("substance-use");
  else if (/^F([2-4]\d|5[0-3]|6\d)/.test(c)) out.push("mental-health");
  if (/^(B20|Z21|A5[0-9]|A6[0-4]|B97\.35)/.test(c)) out.push("hiv-sti");
  return out;
}

// ---------- medications ----------

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "besylate", "succinate", "tartrate", "maleate",
  "mesylate", "sulfate", "phosphate", "acetate", "fumarate", "citrate", "bromide", "hydrobromide", "trihydrate",
  "monohydrate", "dihydrate", "medoxomil", "axetil", "magnesium", "nitrate", "bitartrate",
]);

function ingredientOf(name: string): string | undefined {
  let n = name.replace(/\[[^\]]*\]/g, " ").replace(/\([^)]*\)/g, " ").toLowerCase();
  n = n.replace(/^\s*\d+(\.\d+)?\s*(ml|mg|g|l)\s+/, "");
  const toks = n.split(/\s+/).filter(Boolean);
  const keep: string[] = [];
  for (const t of toks) {
    if (/^\d/.test(t)) break;
    keep.push(t);
  }
  while (keep.length > 1 && SALTS.has(keep[keep.length - 1])) keep.pop();
  const r = keep.join(" ").replace(/\s*\/\s*/g, " / ").trim();
  return r || undefined;
}

function strengthMg(name: string): number | undefined {
  const m = /(\d+(?:\.\d+)?)\s*(mg|mcg|ug|µg)\b(?!\s*\/)/i.exec(name);
  if (!m) return undefined;
  const v = parseFloat(m[1]);
  return m[2].toLowerCase() === "mg" ? v : undefined;
}

function medDose(e: any): MedicationRow["dose"] | undefined {
  const d = e.dose;
  if (!d || typeof d.value !== "number") return undefined;
  const u = String(d.unit ?? "").toLowerCase();
  if (u === "mg") return { value: d.value, unit: "mg" };
  if (u === "mcg" || u === "µg" || u === "ug") return { value: d.value, unit: "mcg" };
  if (u === "unit" || u === "units" || u === "u" || u === "iu") return { value: d.value, unit: "units" };
  if (u === "ml" || u === "cc") return { value: d.value, unit: "mL" };
  if (u === "tab" || u === "tabs" || u === "tablet" || u === "tablets") {
    const s = strengthMg(String(e.drug?.name ?? ""));
    if (s !== undefined) return { value: Math.round(s * d.value * 1000) / 1000, unit: "mg" };
    return { value: d.value, unit: "tablet" };
  }
  return undefined;
}

function medRows(items: FolioItem[]): MedicationRow[] {
  const all = entries(items, "med_event");
  const byLine = new Map<string, Entry[]>();
  for (const x of all) {
    const id = x.e.med_id;
    if (typeof id !== "string") continue;
    (byLine.get(id) ?? byLine.set(id, []).get(id)!).push(x);
  }
  const lines: { last: Entry; first: Entry }[] = [];
  for (const es of byLine.values()) {
    es.sort(cmpEntries);
    lines.push({ last: es[es.length - 1], first: es[0] });
  }
  // one row per ingredient: the line whose latest event is latest
  const byIng = new Map<string, { last: Entry; first: Entry }>();
  for (const l of lines) {
    const name = String(l.last.e.drug?.name ?? "");
    const key = ingredientOf(name) ?? "name:" + name.toLowerCase();
    const cur = byIng.get(key);
    if (!cur || cmpEntries(cur.last, l.last) < 0) byIng.set(key, l);
  }
  const rows: MedicationRow[] = [];
  for (const l of byIng.values()) {
    const e = l.last.e;
    const name = String(e.drug?.name ?? "");
    const ing = ingredientOf(name);
    const status: MedicationRow["status"] =
      e.action === "stop" ? "stopped" : e.action === "hold" ? "held" : "active";
    const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: ev(l.last) };
    if (ing) row.ingredient = ing;
    const since = toLocal(l.last.item.effective);
    if (since) row.status_since = since.date;
    const dose = medDose(e);
    if (dose) row.dose = dose;
    const f: Record<string, MedicationRow["frequency"]> = {
      QD: "QD", BID: "BID", TID: "TID", QHS: "QHS", PRN: "PRN", OTHER: "other",
    };
    if (typeof e.frequency === "string" && f[e.frequency]) row.frequency = f[e.frequency];
    if (status === "stopped" && typeof e.stop_reason === "string") row.stop_reason = e.stop_reason;
    if (typeof e.reason_text === "string" && e.reason_text) row.status_reason_text = e.reason_text;
    const sens: Sensitivity[] = [];
    if (e.restricted === "BH") sens.push("mental-health");
    const lname = (ing ?? name).toLowerCase();
    if (MH_DRUGS.test(lname) && !sens.includes("mental-health")) sens.push("mental-health");
    if (SU_DRUGS.test(lname)) sens.push("substance-use");
    if (sens.length) row.sensitivity = sens;
    if (l.first !== l.last) row.evidence = [...ev(l.last), ...ev(l.first)];
    rows.push(row);
  }
  return rows;
}

// ---------- problems ----------

function ckdStage(desc: string, code: string | undefined): ProblemRow["ckd_stage"] | undefined {
  const d = desc.toLowerCase();
  if (!/kidney|ckd|renal/.test(d) && !/^N18/i.test(code ?? "")) return undefined;
  const m = /stage\s*(?:g)?\s*(1|2|3\s*a|3\s*b|3|4|5)\b/i.exec(d) ?? /\bg\s*(1|2|3a|3b|4|5)\b/i.exec(d);
  if (m) {
    const s = m[1].replace(/\s+/g, "").toLowerCase();
    if (s === "3") return undefined;
    return ("G" + s) as ProblemRow["ckd_stage"];
  }
  const c = (code ?? "").toUpperCase();
  const map: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.30": "G3a", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
  };
  return map[c];
}

function albuminuria(desc: string): ProblemRow["albuminuria"] | undefined {
  const m = /\b(?:albuminuria\s*)?(A[123])\b/.exec(desc);
  return m ? (m[1] as ProblemRow["albuminuria"]) : undefined;
}

function problemRows(items: FolioItem[], allergies: AllergyIntoleranceRow[]): ProblemRow[] {
  const latest = latestBy(entries(items, "problem_event"), "problem_id");
  const rows: ProblemRow[] = [];
  for (const x of latest.values()) {
    const e = x.e;
    if (e.action === "remove") continue;
    const desc = String(e.description ?? "");
    const code: string | undefined = typeof e.icd10cm === "string" ? e.icd10cm : undefined;
    // adverse-effect code naming no condition: allergy row only
    if (code && /^T(3[6-9]|4\d|50)\.[0-9A-Z]*5/i.test(code)) {
      const sub = desc.replace(/^(adverse effect of|allergy to|reaction to)\s+/i, "").trim();
      if (sub) {
        const row: AllergyIntoleranceRow = {
          substance: sub.toLowerCase(), reaction_type: "hypersensitivity", mechanism: "unknown",
          criticality: "unknown", evidence: ev(x),
        };
        const o = fuzzy(e.onset);
        if (o) row.onset = o;
        allergies.push(row);
      }
      continue;
    }
    const row: ProblemRow = {
      condition: desc,
      status: e.action === "resolve" ? "resolved" : "active",
      evidence: ev(x),
    };
    if (code) row.icd10cm = code;
    if (typeof e.snomed === "string") row.snomed = e.snomed;
    const o = fuzzy(e.onset);
    if (o) row.onset = o;
    const st = ckdStage(desc, code);
    if (st) row.ckd_stage = st;
    if (st || /kidney|ckd/i.test(desc)) {
      const al = albuminuria(desc);
      if (al) row.albuminuria = al;
    }
    const sens = sensFromIcd(code);
    if (e.restricted === "BH" && !sens.includes("mental-health")) sens.push("mental-health");
    if (sens.length) row.sensitivity = sens;
    rows.push(row);
  }
  return rows;
}

// ---------- allergies ----------

function allergyRows(items: FolioItem[]): AllergyIntoleranceRow[] {
  const latest = latestBy(entries(items, "allergy_event"), "allergy_id");
  const rows: AllergyIntoleranceRow[] = [];
  for (const x of latest.values()) {
    const e = x.e;
    if (e.action === "inactivate") continue;
    const sub = e.substance ?? {};
    const isDrug = typeof sub.rxnorm === "string";
    const name = String(sub.name ?? "");
    const rt = e.reaction_type;
    const row: AllergyIntoleranceRow = {
      substance: isDrug ? (ingredientOf(name) ?? name.toLowerCase()) : name,
      reaction_type: rt === "intolerance" ? "side_effect" : rt === "adverse_reaction" ? "serious_adverse_event" : "hypersensitivity",
      mechanism: rt === "allergy" ? "immune" : rt === "intolerance" ? "non_immune" : "unknown",
      criticality: e.severity === "high" ? "high" : e.severity === "low" ? "low" : "unknown",
      evidence: ev(x),
    };
    if (isDrug) row.rxnorm_ingredient = sub.rxnorm;
    if (Array.isArray(e.reactions) && e.reactions.length) row.reaction = e.reactions.join("; ");
    const o = fuzzy(e.onset);
    if (o) row.onset = o;
    rows.push(row);
  }
  return rows;
}

// ---------- labs ----------

function analyteOf(t: any): Analyte | undefined {
  const code = String(t?.nfm_code ?? "").toUpperCase();
  const name = String(t?.name ?? "").toLowerCase();
  const byCode: Record<string, Analyte> = {
    CREAT: "creatinine", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate",
    AG: "anion_gap", ANIONGAP: "anion_gap", BUN: "bun", GLU: "glucose", GLUC: "glucose", A1C: "a1c", HBA1C: "a1c",
    UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", BHB: "bhb", PH: "ph", PCO2: "pco2",
    LIPASE: "lipase", TROPI: "troponin", TNI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides",
    HDL: "hdl", LDL: "ldl", LDLC: "ldl",
  };
  if (byCode[code]) return byCode[code];
  if (code.startsWith("EGFR")) return "egfr";
  if (/egfr|glomerular/.test(name)) return "egfr";
  if (/creatinine/.test(name) && !/urine|ratio|clearance/.test(name)) return "creatinine";
  if (/albumin.*creatinine|uacr/.test(name)) return "uacr";
  if (/^potassium/.test(name)) return "potassium";
  if (/^sodium/.test(name)) return "sodium";
  if (/^chloride/.test(name)) return "chloride";
  if (/bicarbonate|carbon dioxide|co2, total/.test(name)) return "bicarbonate";
  if (/anion gap/.test(name)) return "anion_gap";
  if (/urea nitrogen|^bun/.test(name)) return "bun";
  if (/^glucose/.test(name)) return "glucose";
  if (/a1c/.test(name)) return "a1c";
  if (/platelet/.test(name)) return "platelets";
  if (/white blood|^wbc|leukocyte/.test(name)) return "wbc";
  if (/hemoglobin/.test(name)) return "hemoglobin";
  if (/hydroxybutyrate/.test(name)) return "bhb";
  if (/^ph\b/.test(name)) return "ph";
  if (/pco2/.test(name)) return "pco2";
  if (/lipase/.test(name)) return "lipase";
  if (/troponin/.test(name)) return "troponin";
  if (/hdl/.test(name)) return "hdl";
  if (/ldl/.test(name)) return "ldl";
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

function round(v: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(v * f + (v >= 0 ? 1e-9 : -1e-9)) / f;
}

function convert(a: Analyte, v: number, unit: string): number | undefined {
  const u = unit.trim().toLowerCase();
  if (a === "platelets" || a === "wbc") {
    if (u === "cells/ul" || u === "/ul" || u === "cells/µl") return round(v / 1000, 6);
    if (u === "k/ul" || u === "10*3/ul" || u === "10^3/ul" || u === "x103/ul" || u === "thou/ul") return v;
    return v;
  }
  if (a === "creatinine" && (u === "umol/l" || u === "µmol/l")) return round(v / 88.4, 4);
  if ((a === "glucose" || a === "bun" || a === "cholesterol" || a === "triglycerides" || a === "hdl" || a === "ldl") && u === "mmol/l") {
    const f = a === "glucose" ? 18.016 : a === "bun" ? 2.801 : a === "triglycerides" ? 88.57 : 38.67;
    return round(v * f, 1);
  }
  return v;
}

function egfrEquation(comment: string | undefined, code: string): LabResultRow["egfr_equation"] {
  const c = (comment ?? "").toLowerCase();
  if (/2021/.test(c)) return "ckd-epi-2021";
  if (/2009/.test(c)) return "ckd-epi-2009";
  if (/mdrd/.test(c)) return "mdrd";
  void code;
  return "unknown";
}

function labRows(items: FolioItem[]): LabResultRow[] {
  const groups = new Map<string, { best: Entry; rank: number; used: Entry[] }>();
  for (const x of entries(items, "imported_result").sort(cmpEntries)) {
    const e = x.e;
    const an = analyteOf(e.test);
    if (!an) continue;
    const code = String(e.test?.nfm_code ?? "").toUpperCase();
    const rname = String(e.test?.name ?? "").toLowerCase();
    if (an === "egfr" && (/(^|-)AA$/.test(code) || /african american\)/.test(rname) && !/non/.test(rname))) continue;
    const m = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(e.value ?? ""));
    if (!m) continue;
    const rank = e.result_status === "P" ? 0 : 1;
    const key = [e.external_ref?.accession ?? x.item.id, code, e.external_ref?.result_code ?? ""].join("|");
    const g = groups.get(key);
    if (!g) groups.set(key, { best: x, rank, used: [x] });
    else {
      g.used.push(x);
      if (rank >= g.rank) { g.best = x; g.rank = rank; }
    }
  }
  const rows: LabResultRow[] = [];
  for (const g of groups.values()) {
    const e = g.best.e;
    const an = analyteOf(e.test)!;
    const m = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(e.value))!;
    const v = convert(an, parseFloat(m[2]), String(e.unit ?? ""));
    if (v === undefined) continue;
    const cl = toLocal(String(e.collected ?? g.best.item.effective));
    if (!cl) continue;
    const hasOff = /(Z|[+-]\d{2}:?\d{2})$/.test(String(e.collected ?? ""));
    void hasOff;
    const collected = `${cl.date}T${cl.time}${chicagoOffsetFor(cl)}`;
    const row: LabResultRow = {
      analyte: an, value: v, unit: UNITS[an], collected,
      status: e.result_status === "P" ? "preliminary" : "final",
      evidence: g.used.filter((u) => u === g.best || u.e.result_status !== "P" || true).map((u) => ({ item_id: u.item.id, entry_id: u.id })),
    };
    // evidence: put the best copy first
    row.evidence.sort((a, b) => (a.item_id === g.best.item.id && a.entry_id === g.best.id ? -1 : b.item_id === g.best.item.id && b.entry_id === g.best.id ? 1 : 0));
    if (m[1]) row.comparator = m[1] as LabResultRow["comparator"];
    if (an === "egfr") row.egfr_equation = egfrEquation(e.comment, String(e.test?.nfm_code ?? ""));
    if (typeof e.test?.loinc === "string" && e.test.loinc) row.loinc = e.test.loinc;
    rows.push(row);
  }
  rows.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
  return rows;
}

// ---------- vitals ----------

function parseBp(s: unknown): [number, number] | undefined {
  if (typeof s !== "string") return undefined;
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(s);
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : undefined;
}

function vitalRows(items: FolioItem[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const x of entries(items, "vital_set").sort(cmpEntries)) {
    const e = x.e;
    const l = toLocal(x.item.effective);
    if (!l) continue;
    const row: VitalRow = { setting: "clinic", local_time: `${l.date}T${l.time.slice(0, 5)}`, evidence: ev(x) };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const rp = parseBp(e.bp_repeat);
    if (rp) { row.repeat_systolic_mmhg = rp[0]; row.repeat_diastolic_mmhg = rp[1]; }
    if (typeof e.pulse_bpm === "number") row.pulse_bpm = e.pulse_bpm;
    if (typeof e.weight_lb === "number") row.weight_kg = round(e.weight_lb * 0.45359237, 1);
    if (!bp && !rp && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    rows.push(row);
  }
  return rows;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  let live: FolioItem[] = [];
  try {
    live = counting(Array.isArray(items) ? items : [], asOf);
  } catch {
    live = [];
  }
  const safe = <T>(f: () => T, d: T): T => { try { return f(); } catch { return d; } };
  const allergies: AllergyIntoleranceRow[] = [];
  const problems = safe(() => problemRows(live, allergies), []);
  allergies.push(...safe(() => allergyRows(live), []));
  return {
    medications: safe(() => medRows(live), []),
    problems,
    allergies,
    labs: safe(() => labRows(live), []),
    vitals: safe(() => vitalRows(live), []),
  };
}
