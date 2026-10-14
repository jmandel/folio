import type { FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow, Evidence, Sensitivity, Analyte } from "../in/views/views";

const TZ = "America/Chicago";
const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
});

function parts(ms: number) {
  const o: Record<string, string> = {};
  for (const p of fmt.formatToParts(new Date(ms))) o[p.type] = p.value;
  return { date: `${o.year}-${o.month}-${o.day}`, hm: `${o.hour}:${o.minute}`, hms: `${o.hour}:${o.minute}:${o.second}` };
}

const HAS_OFFSET = /(Z|[+-]\d\d:?\d\d)$/i;
const DATETIME = /^(\d{4})-(\d\d)-(\d\d)[T ](\d\d):(\d\d)(?::(\d\d)(?:\.\d+)?)?/;

/** Chicago offset in minutes in effect at a UTC instant. */
function chicagoOffsetMin(ms: number): number {
  const p = parts(ms);
  const [y, m, d] = p.date.split("-").map(Number);
  const [hh, mm, ss] = p.hms.split(":").map(Number);
  return Math.round((Date.UTC(y, m - 1, d, hh, mm, ss) - Math.floor(ms / 1000) * 1000) / 60000);
}

function offsetStr(min: number): string {
  const s = min < 0 ? "-" : "+";
  const a = Math.abs(min);
  return `${s}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

/** Local wall-clock {date, hms} for a date-time string (offset-bearing converted, otherwise as written). */
function localOf(s: string): { date: string; hms: string; hasTime: boolean } | undefined {
  if (typeof s !== "string") return undefined;
  if (HAS_OFFSET.test(s) && DATETIME.test(s)) {
    const ms = Date.parse(s);
    if (isNaN(ms)) return undefined;
    const p = parts(ms);
    return { date: p.date, hms: p.hms, hasTime: true };
  }
  const m = DATETIME.exec(s);
  if (m) return { date: `${m[1]}-${m[2]}-${m[3]}`, hms: `${m[4]}:${m[5]}:${m[6] ?? "00"}`, hasTime: true };
  if (/^\d{4}(-\d\d){0,2}$/.test(s)) return { date: s, hms: "00:00:00", hasTime: false };
  return undefined;
}

function sortKey(s: string): string {
  const l = localOf(s);
  if (!l) return "";
  const d = l.date.length === 4 ? l.date + "-01-01" : l.date.length === 7 ? l.date + "-01" : l.date;
  return `${d}T${l.hms}`;
}

function toRfc(s: string): string | undefined {
  if (HAS_OFFSET.test(s) && DATETIME.test(s)) return s;
  const m = DATETIME.exec(s);
  if (!m) return undefined;
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0));
  let off = chicagoOffsetMin(wall);
  off = chicagoOffsetMin(wall - off * 60000);
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? "00"}${offsetStr(off)}`;
}

function fuzzy(f: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!f || typeof f.date !== "string") return undefined;
  const d = f.date;
  if (f.precision === "year") return { value: d.slice(0, 4), precision: "year" };
  if (f.precision === "month") return { value: d.slice(0, 7), precision: "month" };
  return { value: d.slice(0, 10), precision: "day" };
}

type Entry = { item: FolioItem; id: string; e: any };

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const counting = items.filter((it) => {
    const l = localOf(it.recorded);
    return l !== undefined && l.date <= asOf;
  });
  const byId = new Map<string, FolioItem>();
  for (const it of items) byId.set(it.id, it);
  const dead = new Set<string>();
  const killSuper = (id: string) => {
    if (dead.has(id)) return;
    dead.add(id);
    const it = byId.get(id);
    for (const s of it?.supersedes ?? []) killSuper(s);
  };
  for (const it of counting) {
    for (const s of it.supersedes ?? []) killSuper(s);
    for (const r of it.retracts ?? []) dead.add(r);
  }
  return counting.filter((it) => !dead.has(it.id));
}

function entriesOf(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    if (!item.payload || typeof item.payload !== "object") continue;
    for (const [id, e] of Object.entries(item.payload)) {
      if (e && typeof e === "object" && (e as any).type === type) out.push({ item, id, e });
    }
  }
  return out;
}

function cmpEntries(a: Entry, b: Entry): number {
  const ka = sortKey(a.item.effective), kb = sortKey(b.item.effective);
  if (ka !== kb) return ka < kb ? -1 : 1;
  const ra = sortKey(a.item.recorded), rb = sortKey(b.item.recorded);
  if (ra !== rb) return ra < rb ? -1 : 1;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0;
}

function groupLatest(es: Entry[], key: string): Entry[][] {
  const m = new Map<string, Entry[]>();
  for (const x of es) {
    const k = x.e[key];
    if (typeof k !== "string") continue;
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(x);
  }
  return [...m.values()].map((g) => g.sort(cmpEntries));
}

const ev = (x: Entry) => ({ item_id: x.item.id, entry_id: x.id });
const evAll = (g: Entry[]): Evidence => g.map(ev);

function sens(restricted: unknown, text: string, code?: string): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  if (restricted === "BH") s.add("mental-health");
  const t = text.toLowerCase();
  if (/quetiapine|sertraline|fluoxetine|escitalopram|citalopram|paroxetine|bupropion|venlafaxine|duloxetine|lithium|olanzapine|risperidone|aripiprazole|lamotrigine|buspirone|trazodone|mirtazapine|depress|anxiety|bipolar|schizophren|ptsd/.test(t)) s.add("mental-health");
  if (/buprenorphine|naltrexone|methadone|naloxone|opioid use|alcohol use|substance use|alcohol dependence/.test(t)) s.add("substance-use");
  if (/\bhiv\b|chlamydia|gonorrh|syphilis|emtricitabine|tenofovir|dolutegravir/.test(t)) s.add("hiv-sti");
  if (/contracepti|pregnan/.test(t)) s.add("sexual-reproductive-health");
  if (code) {
    if (/^F1\d/.test(code)) s.add("substance-use");
    else if (/^F(2|3|4|5|6|9)/.test(code) || /^F0[0-9]/.test(code) && false) s.add("mental-health");
    if (/^(B20|A5[0-9]|A6[0-4]|Z21)/.test(code)) s.add("hiv-sti");
  }
  return s.size ? [...s] : undefined;
}

// ---------- medications ----------
const SALTS = /\b(hydrochloride|hcl|sodium|potassium|calcium|magnesium|succinate|tartrate|maleate|besylate|mesylate|sulfate|phosphate|acetate|citrate|fumarate|bromide|hydrobromide|trihydrate|monohydrate|dihydrate|anhydrous|medoxomil|axetil|hemihydrate|disoproxil|propionate|furoate|nitrate|carbonate)\b/g;
const BRANDS: Record<string, string> = {
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", levemir: "insulin detemir",
  humalog: "insulin lispro", novolog: "insulin aspart", ventolin: "albuterol", proair: "albuterol",
  lasix: "furosemide", zestril: "lisinopril", prinivil: "lisinopril", cozaar: "losartan", norvasc: "amlodipine",
  glucophage: "metformin", lipitor: "atorvastatin", zocor: "simvastatin", jardiance: "empagliflozin",
  farxiga: "dapagliflozin", ozempic: "semaglutide", trulicity: "dulaglutide", januvia: "sitagliptin",
};
const FORMS = /\b(oral|tablet|tablets|capsule|capsules|injection|injectable|solution|suspension|pen|injector|inhaler|extended|release|delayed|chewable|cream|ointment|patch|syringe|prefilled|disintegrating|hfa|er|xr|sr|dr)\b/;

function ingredientOf(name: string): string | undefined {
  let n = name.toLowerCase().replace(/\[[^\]]*\]/g, " ").replace(/\([^)]*\)/g, " ").trim();
  n = n.replace(/^\d+(\.\d+)?\s*(ml|mg|g|l)\s+/, "");
  const out: string[] = [];
  for (const part of n.split(/\s+\/\s+|\s+\+\s+/)) {
    let p = part.trim();
    const di = p.search(/(^|\s)\d/);
    if (di >= 0) p = p.slice(0, di);
    const fi = p.search(FORMS);
    if (fi > 0) p = p.slice(0, fi);
    p = p.replace(SALTS, " ").replace(/\s+/g, " ").trim();
    if (p) out.push(BRANDS[p] ?? BRANDS[p.split(" ")[0]] ?? p);
  }
  return out.length ? out.join(" / ") : undefined;
}

function normUnit(u: string): "mg" | "mcg" | "units" | "mL" | "tablet" | undefined {
  const s = u.trim().toLowerCase();
  if (["mg", "milligram", "milligrams"].includes(s)) return "mg";
  if (["mcg", "µg", "ug", "μg", "microgram", "micrograms"].includes(s)) return "mcg";
  if (["u", "iu", "unit", "units"].includes(s)) return "units";
  if (["ml", "cc"].includes(s)) return "mL";
  if (["tab", "tabs", "tablet", "tablets"].includes(s)) return "tablet";
  return undefined;
}

function medRows(items: FolioItem[]): MedicationRow[] {
  const groups = groupLatest(entriesOf(items, "med_event"), "med_id");
  type Cand = { row: MedicationRow; key: string; ing: string };
  const cands: Cand[] = [];
  for (const g of groups) {
    const last = g[g.length - 1];
    const e = last.e;
    const name: string = e.drug?.name ?? "";
    if (!name) continue;
    const ing = ingredientOf(name);
    const status = e.action === "hold" ? "held" : e.action === "stop" ? "stopped" : "active";
    const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: evAll(g) };
    if (ing) row.ingredient = ing;
    const since = localOf(last.item.effective);
    if (since) row.status_since = since.date;
    if (e.dose && typeof e.dose.value === "number") {
      let unit = normUnit(String(e.dose.unit ?? ""));
      let value = e.dose.value;
      if (unit === "tablet") {
        const sm = [...name.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg)\b/gi)];
        if (sm.length === 1) {
          value = Math.round(value * parseFloat(sm[0][1]) * 1000) / 1000;
          unit = sm[0][2].toLowerCase() as "mg" | "mcg";
        }
      }
      if (unit) row.dose = { value, unit };
    }
    const f = e.frequency;
    if (f === "QD" || f === "BID" || f === "TID" || f === "QHS" || f === "PRN") row.frequency = f;
    else if (f === "OTHER") row.frequency = "other";
    if (status === "stopped" && e.stop_reason) row.stop_reason = e.stop_reason;
    if (typeof e.reason_text === "string" && e.reason_text) row.status_reason_text = e.reason_text;
    const s = sens(e.restricted, name);
    if (s) row.sensitivity = s;
    cands.push({ row, key: sortKey(last.item.effective) + "|" + sortKey(last.item.recorded), ing: ing ?? "\u0000" + name });
  }
  const best = new Map<string, Cand>();
  for (const c of cands) {
    const b = best.get(c.ing);
    if (!b || c.key > b.key) best.set(c.ing, c);
  }
  return [...best.values()].map((c) => c.row);
}

// ---------- problems ----------
function ckdStage(text: string, code: string): ProblemRow["ckd_stage"] | undefined {
  const t = text.toLowerCase();
  let m = /\b(?:stage|g)\s*([1-5])\s*([ab])?\b/.exec(t);
  if (m && /kidney|ckd|renal|nephropathy/.test(t)) {
    const n = m[1];
    if (n === "3") return m[2] === "b" ? "G3b" : m[2] === "a" ? "G3a" : undefined;
    return ("G" + n) as ProblemRow["ckd_stage"];
  }
  const c: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.30": undefined, "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
  return c[code];
}

function albuminuria(text: string): ProblemRow["albuminuria"] | undefined {
  const m = /\bA([123])\b/.exec(text);
  if (m) return ("A" + m[1]) as ProblemRow["albuminuria"];
  const t = text.toLowerCase();
  if (/severely increased albuminuria/.test(t)) return "A3";
  if (/moderately increased albuminuria/.test(t)) return "A2";
  return undefined;
}

function problemRows(items: FolioItem[], allergyOut: AllergyIntoleranceRow[]): ProblemRow[] {
  const rows: ProblemRow[] = [];
  for (const g of groupLatest(entriesOf(items, "problem_event"), "problem_id")) {
    const last = g[g.length - 1];
    const e = last.e;
    if (e.action === "remove") continue;
    const desc: string = e.description ?? "";
    const code: string = e.icd10cm ?? "";
    if (!desc && !code) continue;
    // adverse-effect-of-drug code with no condition: allergy only
    if (/^T(3[6-9]|4[0-9]|50)\.[0-9A-Z]*5/.test(code)) {
      if (e.action !== "resolve") {
        const sub = desc.replace(/^adverse effect of\s+/i, "").replace(/,?\s*(initial|subsequent) encounter$/i, "").trim();
        allergyOut.push({
          substance: sub || desc, reaction_type: "side_effect", mechanism: "unknown", criticality: "unknown",
          ...(fuzzy(e.onset) ? { onset: fuzzy(e.onset)! } : {}), evidence: evAll(g),
        });
      }
      continue;
    }
    const row: ProblemRow = {
      condition: desc || code,
      status: e.action === "resolve" ? "resolved" : "active",
      evidence: evAll(g),
    };
    if (code) row.icd10cm = code;
    if (e.snomed) row.snomed = String(e.snomed);
    let onset;
    for (let i = g.length - 1; i >= 0 && !onset; i--) onset = fuzzy(g[i].e.onset);
    if (onset) row.onset = onset;
    if (/^N18/.test(code) || /kidney disease|\bckd\b/i.test(desc)) {
      const st = ckdStage(desc, code);
      if (st) row.ckd_stage = st;
      const al = albuminuria(desc);
      if (al) row.albuminuria = al;
    }
    const s = sens(e.restricted, desc, code);
    if (s) row.sensitivity = s;
    rows.push(row);
  }
  return rows;
}

// ---------- allergies ----------
const HYPER = /hives|urticaria|rash|swelling|angioedema|anaphyla|wheez|bronchospasm|itch|pruritus|stevens|throat|dyspnea|shortness of breath/i;

function allergyRows(items: FolioItem[]): AllergyIntoleranceRow[] {
  const rows: AllergyIntoleranceRow[] = [];
  for (const g of groupLatest(entriesOf(items, "allergy_event"), "allergy_id")) {
    const last = g[g.length - 1];
    const e = last.e;
    if (e.action === "inactivate") continue;
    const nm: string = e.substance?.name ?? "";
    if (!nm) continue;
    const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.filter((x: unknown) => typeof x === "string") : [];
    const rt = e.reaction_type;
    let reaction_type: AllergyIntoleranceRow["reaction_type"];
    let mechanism: AllergyIntoleranceRow["mechanism"];
    const hyper = reactions.some((r) => HYPER.test(r));
    if (rt === "allergy") { reaction_type = "hypersensitivity"; mechanism = "immune"; }
    else if (hyper) { reaction_type = "hypersensitivity"; mechanism = "unknown"; }
    else if (rt === "adverse_reaction") { reaction_type = "serious_adverse_event"; mechanism = "unknown"; }
    else { reaction_type = "side_effect"; mechanism = "non_immune"; }
    const isDrug = !!e.substance?.rxnorm;
    const row: AllergyIntoleranceRow = {
      substance: isDrug ? nm.toLowerCase() : nm,
      reaction_type, mechanism,
      criticality: e.severity === "low" || e.severity === "high" ? e.severity : "unknown",
      evidence: evAll(g),
    };
    if (isDrug) row.rxnorm_ingredient = String(e.substance.rxnorm);
    if (reactions.length) row.reaction = reactions.join("; ");
    let onset;
    for (let i = g.length - 1; i >= 0 && !onset; i--) onset = fuzzy(g[i].e.onset);
    if (onset) row.onset = onset;
    const s = sens(undefined, nm);
    if (s && !s.includes("mental-health")) row.sensitivity = s;
    rows.push(row);
  }
  return rows;
}

// ---------- labs ----------
const LOINC: Record<string, Analyte> = {
  "2160-0": "creatinine", "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "33037-3": "anion_gap", "3094-0": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "17856-6": "a1c", "4544-3": "hemoglobin",
  "14959-1": "uacr", "9318-7": "uacr", "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin", "59032-3": "bhb", "1759-0": "bhb", "2744-1": "ph", "11558-4": "ph", "2019-8": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "13457-7": "ldl", "2089-1": "ldl", "18262-6": "ldl",
};

function analyteOf(t: { nfm_code?: string; name?: string; loinc?: string }): Analyte | undefined {
  const name = (t.name ?? "").toLowerCase();
  const code = (t.nfm_code ?? "").toUpperCase();
  if (/^EGFR/.test(code) || /egfr|glomerular/.test(name)) return "egfr";
  if (t.loinc && LOINC[t.loinc] && t.loinc !== "4544-3") return LOINC[t.loinc];
  if (/creatinine/.test(name) && !/urine|ratio|clearance/.test(name)) return "creatinine";
  if (/microalb|albumin.*creat|uacr/.test(name) || code === "UACR") return "uacr";
  if (/potassium/.test(name) || code === "K") return "potassium";
  if (/sodium/.test(name) || code === "NA") return "sodium";
  if (/chloride/.test(name) || code === "CL") return "chloride";
  if (/bicarb|co2, total|total co2|carbon dioxide, total/.test(name) || code === "CO2" || code === "HCO3") return "bicarbonate";
  if (/anion gap/.test(name)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(name) || code === "BUN") return "bun";
  if (/hemoglobin a1c|hba1c|a1c/.test(name) || code === "A1C" || code === "HBA1C") return "a1c";
  if (/glucose/.test(name) && !/urine|meter|poc/.test(name)) return "glucose";
  if (/platelet/.test(name) || code === "PLT") return "platelets";
  if (/white blood|wbc|leukocyte/.test(name) || code === "WBC") return "wbc";
  if (/^hemoglobin$|hemoglobin, blood|^hgb/.test(name) || code === "HGB") return "hemoglobin";
  if (/hydroxybutyr/.test(name) || code === "BHB") return "bhb";
  if (/^ph\b|\bph, /.test(name) || code === "PH") return "ph";
  if (/pco2|carbon dioxide.*partial|partial pressure/.test(name)) return "pco2";
  if (/lipase/.test(name)) return "lipase";
  if (/troponin/.test(name)) return "troponin";
  if (/triglycer/.test(name)) return "triglycerides";
  if (/hdl/.test(name)) return "hdl";
  if (/ldl/.test(name)) return "ldl";
  if (/cholesterol/.test(name)) return "cholesterol";
  return undefined;
}

const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function convert(a: Analyte, v: number, unit: string): number {
  const u = unit.trim().toLowerCase().replace(/µ|μ/g, "u");
  if (a === "platelets" || a === "wbc") {
    if (u === "cells/ul" || u === "/ul") return v / 1000;
    if (u === "cells/l" || u === "/l") return v / 1e9;
    return v;
  }
  if (a === "creatinine" && u === "umol/l") return v / 88.4;
  if (a === "glucose" && u === "mmol/l") return v * 18.016;
  if (a === "hemoglobin" && u === "g/l") return v / 10;
  if (a === "cholesterol" || a === "hdl" || a === "ldl") { if (u === "mmol/l") return v * 38.67; }
  if (a === "triglycerides" && u === "mmol/l") return v * 88.57;
  if (a === "bun" && u === "mmol/l") return v * 2.801;
  return v;
}

function round(v: number): number {
  return Math.round(v * 1e6) / 1e6;
}

function egfrEq(e: any): NonNullable<LabResultRow["egfr_equation"]> {
  const c = `${e.comment ?? ""} ${e.test?.name ?? ""}`.toLowerCase();
  if (/ckd-?epi\s*2021|2021/.test(c)) return "ckd-epi-2021";
  if (/ckd-?epi\s*2009|2009/.test(c)) return "ckd-epi-2009";
  if (/mdrd/.test(c)) return "mdrd";
  const rc = String(e.external_ref?.result_code ?? "").toUpperCase();
  if (/EGFR09/.test(rc)) return "ckd-epi-2009";
  if (/EGFR21|EGFR-?21/.test(rc)) return "ckd-epi-2021";
  return "unknown";
}

function labRows(items: FolioItem[]): LabResultRow[] {
  type C = { row: LabResultRow; rank: number; rec: string; key: string; ev: Entry[] };
  const best = new Map<string, C>();
  const all = new Map<string, Entry[]>();
  for (const x of entriesOf(items, "imported_result")) {
    const e = x.e;
    const a = analyteOf(e.test ?? {});
    if (!a) continue;
    const nc = String(e.test?.nfm_code ?? "").toUpperCase();
    const nm = String(e.test?.name ?? "").toLowerCase();
    if (a === "egfr" && (/-AA$/.test(nc) || /african american\)?$/.test(nm) && !/non/.test(nm) || /race|black/.test(nm) && !/race-free|without|non/.test(nm))) continue;
    if (e.result_status !== "P" && e.result_status !== "F" && e.result_status !== "C") continue;
    const vm = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(String(e.value ?? ""));
    if (!vm) continue;
    const collected = typeof e.collected === "string" ? toRfc(e.collected) : undefined;
    if (!collected) continue;
    const row: LabResultRow = {
      analyte: a,
      value: round(convert(a, parseFloat(vm[2]), String(e.unit ?? ""))),
      unit: UNITS[a],
      collected,
      status: e.result_status === "P" ? "preliminary" : "final",
      evidence: [ev(x)],
    };
    if (vm[1]) row.comparator = vm[1] as LabResultRow["comparator"];
    if (a === "egfr") row.egfr_equation = egfrEq(e);
    if (e.test?.loinc) row.loinc = String(e.test.loinc);
    const key = [e.external_ref?.accession ?? "", e.external_ref?.result_code ?? nc, collected].join("|");
    const rank = e.result_status === "P" ? 0 : 1;
    const rec = sortKey(x.item.recorded);
    if (!all.has(key)) all.set(key, []);
    all.get(key)!.push(x);
    const b = best.get(key);
    if (!b || rank > b.rank || (rank === b.rank && rec > b.rec)) best.set(key, { row, rank, rec, key, ev: [] });
  }
  const rows: LabResultRow[] = [];
  for (const [key, c] of best) {
    const copies = all.get(key)!;
    const first = c.row.evidence[0];
    c.row.evidence = [first, ...copies.map(ev).filter((x) => x.item_id !== first.item_id || x.entry_id !== first.entry_id)];
    rows.push(c.row);
  }
  return rows;
}

// ---------- vitals ----------
function parseBp(s: unknown): [number, number] | undefined {
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(String(s ?? ""));
  return m ? [+m[1], +m[2]] : undefined;
}

function vitalRows(items: FolioItem[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const x of entriesOf(items, "vital_set")) {
    const e = x.e;
    const l = localOf(x.item.effective);
    if (!l) continue;
    const row: VitalRow = { setting: "clinic", local_time: `${l.date}T${l.hms.slice(0, 5)}`, evidence: [ev(x)] };
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; }
    const rp = parseBp(e.bp_repeat);
    if (rp) { row.repeat_systolic_mmhg = rp[0]; row.repeat_diastolic_mmhg = rp[1]; }
    if (typeof e.pulse_bpm === "number") row.pulse_bpm = e.pulse_bpm;
    if (typeof e.weight_lb === "number") row.weight_kg = Math.round(e.weight_lb * 0.45359237 * 10) / 10;
    if (bp || rp || row.pulse_bpm !== undefined || row.weight_kg !== undefined) rows.push(row);
  }
  return rows;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  try {
    const live = countingItems(items, asOf);
    const allergies = allergyRows(live);
    const problems = problemRows(live, allergies);
    return { medications: medRows(live), problems, allergies, labs: labRows(live), vitals: vitalRows(live) };
  } catch {
    return { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  }
}
