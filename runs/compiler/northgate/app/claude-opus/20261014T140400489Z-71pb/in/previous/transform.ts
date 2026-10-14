import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  ProblemRow,
  AllergyIntoleranceRow,
  LabResultRow,
  VitalRow,
  Evidence,
  Sensitivity,
  Analyte,
} from "../in/views/views";

// ─────────────────────────────────────────────────────────────────────────────
// Time helpers (America/Chicago)
// ─────────────────────────────────────────────────────────────────────────────

const TZ = "America/Chicago";
let fmt: Intl.DateTimeFormat | null = null;
function chicagoFmt(): Intl.DateTimeFormat {
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  }
  return fmt;
}

const DT_OFFSET = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?\s*(Z|[+-]\d{2}:?\d{2})$/i;
const DT_LOCAL = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/;
const PARTIAL = /^\d{4}(-\d{2}(-\d{2})?)?$/;

/** Local wall-clock "YYYY-MM-DDTHH:MM" in Chicago, or null. Partial dates return null. */
function localDateTime(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  let m = DT_LOCAL.exec(t);
  if (m) return `${m[1]}T${m[2]}:${m[3]}`;
  m = DT_OFFSET.exec(t);
  if (!m) return null;
  const ms = Date.parse(t);
  if (isNaN(ms)) return null;
  try {
    const parts = chicagoFmt().formatToParts(new Date(ms));
    const get = (k: string) => parts.find((p) => p.type === k)?.value ?? "";
    const hh = get("hour") === "24" ? "00" : get("hour");
    return `${get("year")}-${get("month")}-${get("day")}T${hh}:${get("minute")}`;
  } catch {
    return null;
  }
}

/** Local date (keeping partial precision for date-only values), or null. */
function localDate(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (PARTIAL.test(t)) return t;
  const ldt = localDateTime(t);
  return ldt ? ldt.slice(0, 10) : null;
}

/** Sortable instant (ms). Date-only / local values are taken as Chicago wall-clock (approx. -06:00). */
function instant(s: unknown): number {
  if (typeof s !== "string") return NaN;
  const t = s.trim();
  if (DT_OFFSET.test(t)) return Date.parse(t);
  let m = DT_LOCAL.exec(t);
  if (m) return Date.parse(`${m[1]}T${m[2]}:${m[3]}:00-06:00`);
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return Date.parse(`${t}T00:00:00-06:00`);
  if (/^\d{4}-\d{2}$/.test(t)) return Date.parse(`${t}-01T00:00:00-06:00`);
  if (/^\d{4}$/.test(t)) return Date.parse(`${t}-01-01T00:00:00-06:00`);
  const ms = Date.parse(t);
  return ms;
}

function fuzzy(d: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!d || typeof d !== "object" || typeof d.date !== "string") return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(d.date.trim());
  if (!m) return undefined;
  const p = d.precision;
  if (p === "year") return { value: m[1], precision: "year" };
  if (p === "month" && m[2]) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  if (p === "day" && m[2] && m[3]) return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
  return undefined;
}

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() !== "" ? v.trim() : undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Entry collection
// ─────────────────────────────────────────────────────────────────────────────

interface Ev {
  item: FolioItem;
  entryId: string;
  e: any;
  eff: number;
  rec: number;
}

function cmpEv(a: Ev, b: Ev): number {
  const ae = isNaN(a.eff) ? -Infinity : a.eff;
  const be = isNaN(b.eff) ? -Infinity : b.eff;
  if (ae !== be) return ae - be;
  const ar = isNaN(a.rec) ? -Infinity : a.rec;
  const br = isNaN(b.rec) ? -Infinity : b.rec;
  if (ar !== br) return ar - br;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : a.entryId < b.entryId ? -1 : a.entryId > b.entryId ? 1 : 0;
}

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope: FolioItem[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const d = localDate(it.recorded);
    if (!d || d.length !== 10) continue;
    if (d > asOf) continue;
    inScope.push(it);
  }
  const key = (iss: unknown, id: string) => `${typeof iss === "string" ? iss : ""}\u0000${id}`;
  const removed = new Set<string>();
  for (const it of inScope) {
    for (const list of [it.supersedes, it.retracts]) {
      if (!Array.isArray(list)) continue;
      for (const id of list) if (typeof id === "string") removed.add(key(it.issuer, id));
    }
    // Northgate voids name their targets in the payload too.
    for (const e of Object.values(it.payload ?? {})) {
      if (e && e.type === "chart_correction" && Array.isArray(e.voided_items)) {
        for (const id of e.voided_items) if (typeof id === "string") removed.add(key(it.issuer, id));
      }
    }
  }
  return inScope.filter((it) => !removed.has(key(it.issuer, it.id)));
}

function collect(items: FolioItem[]): Map<string, Ev[]> {
  const byType = new Map<string, Ev[]>();
  for (const item of items) {
    const payload = item.payload;
    if (!payload || typeof payload !== "object") continue;
    for (const entryId of Object.keys(payload)) {
      const e = payload[entryId];
      if (!e || typeof e !== "object" || typeof e.type !== "string") continue;
      const ev: Ev = { item, entryId, e, eff: instant(item.effective), rec: instant(item.recorded) };
      let arr = byType.get(e.type);
      if (!arr) byType.set(e.type, (arr = []));
      arr.push(ev);
    }
  }
  for (const arr of byType.values()) arr.sort(cmpEv);
  return byType;
}

function evidenceOf(evs: Ev[]): Evidence {
  const out: Evidence = [];
  const seen = new Set<string>();
  for (const ev of evs) {
    const k = ev.item.id + "\u0000" + ev.entryId;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: ev.item.id, entry_id: ev.entryId });
  }
  return out;
}

function groupBy(evs: Ev[], idField: string): Map<string, Ev[]> {
  const m = new Map<string, Ev[]>();
  for (const ev of evs) {
    const id = str(ev.e[idField]);
    if (!id) continue;
    let arr = m.get(id);
    if (!arr) m.set(id, (arr = []));
    arr.push(ev);
  }
  return m;
}

function restrictedSens(evs: Ev[]): Sensitivity[] | undefined {
  for (const ev of evs) if (ev.e.restricted === "BH") return ["mental-health"];
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Drug names
// ─────────────────────────────────────────────────────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide", byetta: "exenatide",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", glucophage: "metformin",
  glucotrol: "glipizide", amaryl: "glimepiride", actos: "pioglitazone",
  kerendia: "finerenone", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide",
  aldactone: "spironolactone", inspra: "eplerenone", microzide: "hydrochlorothiazide",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan",
  atacand: "candesartan", entresto: "sacubitril / valsartan",
  norvasc: "amlodipine", procardia: "nifedipine", cardizem: "diltiazem",
  lopressor: "metoprolol", toprol: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin", zetia: "ezetimibe",
  synthroid: "levothyroxine", levoxyl: "levothyroxine",
  zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine", paxil: "paroxetine",
  wellbutrin: "bupropion", effexor: "venlafaxine", cymbalta: "duloxetine", remeron: "mirtazapine", trazodone: "trazodone",
  buspar: "buspirone", xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", plavix: "clopidogrel",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", pepcid: "famotidine",
  zyloprim: "allopurinol", uloric: "febuxostat", neurontin: "gabapentin", lyrica: "pregabalin",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", flomax: "tamsulosin",
};

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "tartrate", "succinate", "mesylate",
  "fumarate", "bromide", "sulfate", "acetate", "phosphate", "magnesium", "dihydrate", "monohydrate", "hyclate",
  "calcium", "citrate", "propionate", "furoate", "xinafoate", "disoproxil", "er", "xr", "sr", "dr", "xl",
]);

const FORM_WORDS = new Set([
  "oral", "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "injection", "injectable",
  "solution", "suspension", "pen", "injector", "prefilled", "syringe", "extended", "delayed", "release",
  "chewable", "topical", "cream", "ointment", "patch", "inhaler", "inhalation", "nasal", "spray", "ophthalmic",
  "drops", "subcutaneous", "transdermal", "film", "coated", "auto-injector", "kit", "mg", "mcg", "ml", "unt",
  "units", "daily", "po", "sc", "subq", "liquid", "powder", "gel", "lotion", "disintegrating", "sublingual",
]);

function cleanOne(part: string): string | undefined {
  let s = part.trim().toLowerCase();
  s = s.replace(/^\d+(\.\d+)?\s*(ml|hr|day)\s+/i, "");
  const toks = s.split(/[\s,]+/).filter(Boolean);
  const kept: string[] = [];
  for (const t of toks) {
    if (/^\d/.test(t) || /^\d*\.?\d+(mg|mcg|ml|g|%)/.test(t)) break;
    if (FORM_WORDS.has(t)) break;
    if (t === "(" || t.startsWith("(")) break;
    kept.push(t.replace(/[^a-z\-]/g, ""));
  }
  let words = kept.filter(Boolean);
  // Brand names
  for (const w of words) if (BRANDS[w]) return BRANDS[w];
  const noSalt = words.filter((w) => !SALTS.has(w));
  if (noSalt.length > 0) words = noSalt;
  if (words.length === 0) return undefined;
  return words.join(" ");
}

function ingredientOf(name: string): string | undefined {
  let n = name;
  const bracket = /\[([^\]]+)\]/.exec(n);
  n = n.replace(/\[[^\]]*\]/g, " ").trim();
  if (!n && bracket) n = bracket[1];
  const parts = n.split(/\s+\/\s+|\s+and\s+|-(?=[a-z]+\s+\d)/i);
  const ings: string[] = [];
  for (const p of parts) {
    const i = cleanOne(p);
    if (i && !ings.includes(i)) ings.push(i);
  }
  if (ings.length === 0) {
    if (bracket) {
      const b = bracket[1].trim().toLowerCase();
      if (BRANDS[b]) return BRANDS[b];
    }
    return undefined;
  }
  return ings.join(" / ");
}

function isHospitalOnly(name: string): boolean {
  return /\b(intravenous|infusion|IVPB|IV piggyback|IV push|premix|in 0\.9 ?% sodium chloride|in dextrose)\b/i.test(name) ||
    /\bIV\b/.test(name);
}

function mapDose(dose: any, drugName: string): MedicationRow["dose"] | undefined {
  if (!dose || typeof dose !== "object") return undefined;
  const v = dose.value;
  if (typeof v !== "number" || !isFinite(v) || v <= 0) return undefined;
  const u = String(dose.unit ?? "").trim().toLowerCase();
  if (u === "mg" || u === "milligram" || u === "milligrams") return { value: v, unit: "mg" };
  if (u === "mcg" || u === "ug" || u === "µg") return { value: v, unit: "mcg" };
  if (u === "ml") return { value: v, unit: "mL" };
  if (u === "unit" || u === "units" || u === "unt" || u === "[iu]" || u === "iu" || u === "u") return { value: v, unit: "units" };
  if (["tab", "tabs", "tablet", "tablets", "cap", "caps", "capsule", "capsules"].includes(u)) {
    // Express in mass when the name gives a single per-tablet strength.
    if (/\b(tablet|capsule|tab|cap)s?\b/i.test(drugName) && !/\//.test(drugName.replace(/\[[^\]]*\]/g, ""))) {
      const strengths = [...drugName.matchAll(/(\d+(?:\.\d+)?)\s*(MG|MCG)\b(?!\s*\/)/gi)];
      if (strengths.length === 1) {
        const amt = parseFloat(strengths[0][1]);
        const su = strengths[0][2].toLowerCase() === "mcg" ? "mcg" : "mg";
        if (isFinite(amt)) return { value: Math.round(amt * v * 1e6) / 1e6, unit: su };
      }
    }
    return { value: v, unit: "tablet" };
  }
  return undefined;
}

function mapFreq(f: unknown, sig: unknown): MedicationRow["frequency"] | undefined {
  switch (f) {
    case "QD": return "QD";
    case "BID": return "BID";
    case "TID": return "TID";
    case "QHS": return "QHS";
    case "PRN": return "PRN";
    case "OTHER":
      if (typeof sig === "string" && /\b(once (a |per |every )?week|weekly|every week|q ?week)\b/i.test(sig)) return "QW";
      return "other";
  }
  return undefined;
}

const STOP_REASONS = new Set(["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"]);

interface MedLine {
  row: MedicationRow;
  key: string;
  last: Ev;
  events: Ev[];
}

function buildMedications(evs: Ev[]): { rows: MedicationRow[]; ingredientsByItem: Map<string, string[]> } {
  const lines: MedLine[] = [];
  const ingredientsByItem = new Map<string, string[]>();
  for (const [, events] of groupBy(evs, "med_id")) {
    const valid = events.filter((ev) => ["start", "change", "hold", "resume", "stop"].includes(ev.e.action));
    if (valid.length === 0) continue;
    const last = valid[valid.length - 1];
    const e = last.e;
    let drugName: string | undefined;
    for (let i = valid.length - 1; i >= 0 && !drugName; i--) drugName = str(valid[i].e.drug?.name);
    if (!drugName) continue;
    if (isHospitalOnly(drugName)) continue;
    const ingredient = ingredientOf(drugName);

    let status: MedicationRow["status"];
    let sinceEv: Ev | undefined;
    if (e.action === "stop") {
      status = "stopped";
      sinceEv = last;
    } else if (e.action === "hold") {
      status = "held";
      // Start of the current run of holds.
      sinceEv = last;
      for (let i = valid.length - 1; i >= 0 && valid[i].e.action === "hold"; i--) sinceEv = valid[i];
    } else {
      status = "active";
      for (let i = valid.length - 1; i >= 0; i--) {
        if (valid[i].e.action === "start" || valid[i].e.action === "resume") { sinceEv = valid[i]; break; }
      }
    }

    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: evidenceOf(valid) };
    if (ingredient) row.ingredient = ingredient;
    const since = sinceEv ? localDate(sinceEv.item.effective) : null;
    if (since) row.status_since = since;
    const dose = mapDose(e.dose, drugName);
    if (dose) row.dose = dose;
    const freq = mapFreq(e.frequency, e.sig);
    if (freq) row.frequency = freq;
    if (status === "stopped" && STOP_REASONS.has(e.stop_reason)) row.stop_reason = e.stop_reason;
    if (status !== "active") {
      const rt = str(e.reason_text);
      if (rt) row.status_reason_text = rt;
    }
    const sens = restrictedSens(valid);
    if (sens) row.sensitivity = sens;

    for (const ev of valid) {
      if (!ingredient) continue;
      const arr = ingredientsByItem.get(ev.item.id) ?? [];
      if (!arr.includes(ingredient)) arr.push(ingredient);
      ingredientsByItem.set(ev.item.id, arr);
    }
    lines.push({ row, key: ingredient ?? "name:" + drugName.toLowerCase(), last, events: valid });
  }

  // One row per ingredient: the line whose own latest event is latest.
  const best = new Map<string, MedLine>();
  for (const l of lines) {
    const cur = best.get(l.key);
    if (!cur || cmpEv(cur.last, l.last) < 0) best.set(l.key, l);
  }
  const rows = [...best.values()].sort((a, b) => cmpEv(a.last, b.last)).map((l) => l.row);
  return { rows, ingredientsByItem };
}

// ─────────────────────────────────────────────────────────────────────────────
// Problems (and drug-caused diagnoses → allergies)
// ─────────────────────────────────────────────────────────────────────────────

function ckdStage(desc: string, icd: string | undefined): ProblemRow["ckd_stage"] | undefined {
  const d = desc.toLowerCase();
  let m = /\bstage\s*(1|2|3a|3b|4|5)\b/.exec(d) || /\bg(1|2|3a|3b|4|5)\b/.exec(d);
  if (m) return ("G" + m[1]) as ProblemRow["ckd_stage"];
  if (/\b(esrd|end[- ]stage)\b/.test(d)) return "G5";
  if (icd) {
    const c = icd.toUpperCase();
    if (c === "N18.1") return "G1";
    if (c === "N18.2") return "G2";
    if (c === "N18.31") return "G3a";
    if (c === "N18.32") return "G3b";
    if (c === "N18.4") return "G4";
    if (c === "N18.5" || c === "N18.6") return "G5";
  }
  return undefined;
}

function albuminuria(desc: string): ProblemRow["albuminuria"] | undefined {
  const m = /\bA([123])\b/.exec(desc);
  return m ? (("A" + m[1]) as ProblemRow["albuminuria"]) : undefined;
}

function isCkd(desc: string, icd: string | undefined): boolean {
  return (!!icd && /^N18(\.|$)/i.test(icd)) || /chronic kidney disease|\bckd\b/i.test(desc);
}

function icdSensitivity(icd: string | undefined): Sensitivity[] | undefined {
  if (!icd) return undefined;
  const c = icd.toUpperCase();
  if (/^F1\d/.test(c)) return ["substance-use"];
  if (/^F\d/.test(c)) return ["mental-health"];
  if (/^(B20|B97\.35|Z21|A5\d|A6[0-4])/.test(c)) return ["hiv-sti"];
  if (/^(O\d|Z3[0-9])/.test(c)) return ["sexual-reproductive-health"];
  return undefined;
}

function mergeSens(a: Sensitivity[] | undefined, b: Sensitivity[] | undefined): Sensitivity[] | undefined {
  const s = [...(a ?? []), ...(b ?? [])];
  const out = s.filter((x, i) => s.indexOf(x) === i);
  return out.length ? out : undefined;
}

const DRUG_CLASSES: { re: RegExp; label: string; members: string[] }[] = [
  { re: /\bsglt-?2\b/i, label: "SGLT2 inhibitor", members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin", "bexagliflozin"] },
  { re: /\bace[- ]?inhibitor|\bacei\b|angiotensin[- ]converting[- ]enzyme/i, label: "ACE inhibitor", members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"] },
  { re: /\b(angiotensin receptor blocker|arb)\b/i, label: "angiotensin receptor blocker", members: ["losartan", "valsartan", "olmesartan", "irbesartan", "telmisartan", "candesartan", "azilsartan"] },
  { re: /\bstatin\b/i, label: "statin", members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"] },
  { re: /\bglp-?1\b/i, label: "GLP-1 receptor agonist", members: ["semaglutide", "dulaglutide", "liraglutide", "exenatide", "tirzepatide"] },
  { re: /\bdpp-?4\b/i, label: "DPP-4 inhibitor", members: ["sitagliptin", "linagliptin", "saxagliptin", "alogliptin"] },
  { re: /\bsulfonylurea\b/i, label: "sulfonylurea", members: ["glipizide", "glimepiride", "glyburide"] },
  { re: /\bnsaid\b/i, label: "NSAID", members: ["ibuprofen", "naproxen", "meloxicam", "diclofenac", "celecoxib", "indomethacin", "ketorolac"] },
  { re: /\bthiazide\b/i, label: "thiazide diuretic", members: ["hydrochlorothiazide", "chlorthalidone", "indapamide", "metolazone"] },
  { re: /\bloop diuretic\b/i, label: "loop diuretic", members: ["furosemide", "bumetanide", "torsemide"] },
];

const KNOWN_DRUGS: string[] = (() => {
  const s = new Set<string>(Object.values(BRANDS).filter((v) => !v.includes("/")));
  for (const c of DRUG_CLASSES) for (const m of c.members) s.add(m);
  for (const d of ["metformin", "insulin", "allopurinol", "penicillin", "amoxicillin", "sulfamethoxazole", "trimethoprim", "codeine", "morphine", "lithium", "spironolactone"]) s.add(d);
  return [...s].sort((a, b) => b.length - a.length);
})();

interface DrugDx {
  substance: string;
  classMembers?: string[];
  conditionNamed: boolean;
}

/** Recognise a diagnosis the source attributes to a drug. */
function drugCausedDx(desc: string, icd: string | undefined): DrugDx | null {
  const d = desc.toLowerCase();
  const tCode = !!icd && /^T(3[6-9]|4\d|50)\.[0-9A-Z]{1,2}5/i.test(icd.replace(/X/gi, "X"));
  const attributes = /(associated|induced|related|due to|caused by|secondary to|adverse effect|reaction to|from)\b/.test(d);
  if (!tCode && !attributes) return null;
  let substance: string | undefined;
  let classMembers: string[] | undefined;
  for (const c of DRUG_CLASSES) {
    if (c.re.test(desc)) { substance = c.label; classMembers = c.members; break; }
  }
  // A specific drug named in the description wins over a class.
  for (const name of KNOWN_DRUGS) {
    if (new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(d)) { substance = name; classMembers = undefined; break; }
  }
  if (!substance) {
    if (!tCode) return null;
    const m = /adverse effect of ([^,;()]+)/i.exec(desc);
    if (!m) return null;
    substance = m[1].trim().replace(/,? (initial|subsequent) encounter.*$/i, "").trim();
    if (!substance) return null;
  }
  const conditionNamed = !/^\s*adverse effect of\b/i.test(desc) && !(tCode && /^\s*(adverse|side) effect/i.test(desc));
  return { substance, classMembers, conditionNamed };
}

interface ProbLine {
  key: string;
  last: Ev;
  row: ProblemRow;
  status: "active" | "resolved";
  dx: DrugDx | null;
  events: Ev[];
}

function buildProblems(evs: Ev[]): { lines: ProbLine[] } {
  const lines: ProbLine[] = [];
  for (const [, events] of groupBy(evs, "problem_id")) {
    const valid = events.filter((ev) => ["add", "update", "resolve", "remove"].includes(ev.e.action));
    if (valid.length === 0) continue;
    let status: "active" | "resolved" | "removed" = "active";
    for (const ev of valid) {
      if (ev.e.action === "add") status = "active";
      else if (ev.e.action === "resolve") status = "resolved";
      else if (ev.e.action === "remove") status = "removed";
    }
    if (status === "removed") continue;
    const last = valid[valid.length - 1];
    // Latest wording/codes: restated on every event.
    let desc: string | undefined;
    let icd: string | undefined;
    let snomed: string | undefined;
    let onset: ProblemRow["onset"] | undefined;
    for (const ev of valid) {
      desc = str(ev.e.description) ?? desc;
      icd = str(ev.e.icd10cm) ?? icd;
      snomed = str(ev.e.snomed) ?? snomed;
      onset = fuzzy(ev.e.onset) ?? onset;
    }
    if (!desc && !icd) continue;
    const condition = desc ?? icd!;
    const row: ProblemRow = { condition, status, evidence: evidenceOf(valid) };
    if (icd) row.icd10cm = icd;
    if (snomed) row.snomed = snomed;
    if (onset) row.onset = onset;
    if (isCkd(condition, icd)) {
      const st = ckdStage(condition, icd);
      if (st) row.ckd_stage = st;
      const al = albuminuria(condition);
      if (al) row.albuminuria = al;
    }
    const sens = mergeSens(restrictedSens(valid), icdSensitivity(icd));
    if (sens) row.sensitivity = sens;
    const key = isCkd(condition, icd) ? "ckd" : icd ? "icd:" + icd.toUpperCase() : "desc:" + condition.toLowerCase();
    lines.push({ key, last, row, status, dx: drugCausedDx(condition, icd), events: valid });
  }
  return { lines };
}

// ─────────────────────────────────────────────────────────────────────────────
// Allergies
// ─────────────────────────────────────────────────────────────────────────────

const HYPERSENS = /(hives|urticaria|rash|angioedema|swelling|anaphyla|bronchospasm|wheez|itch|prurit|throat (tight|closing)|stevens|sjs|toxic epidermal|dress\b|blister)/i;
const SERIOUS = /(ketoacidosis|lactic acidosis|hyperkalemia|acute kidney injury|\baki\b|pancreatitis|rhabdomyolysis|agranulocytosis|hepatotoxicity|liver injury|hypoglycemia|bleeding|hemorrhage|seizure|qt prolongation|torsade|arrhythmia)/i;
const ACE_INHIBITORS = new Set(DRUG_CLASSES[1].members);

function classifyReaction(
  sourceType: unknown,
  reactionText: string,
  substance: string,
): { reaction_type: AllergyIntoleranceRow["reaction_type"]; mechanism: AllergyIntoleranceRow["mechanism"] } {
  const isAce = ACE_INHIBITORS.has(substance) || /ace inhibitor/i.test(substance);
  let reaction_type: AllergyIntoleranceRow["reaction_type"];
  if (HYPERSENS.test(reactionText)) reaction_type = "hypersensitivity";
  else if (SERIOUS.test(reactionText) || sourceType === "adverse_reaction") reaction_type = "serious_adverse_event";
  else if (sourceType === "allergy" && !reactionText) reaction_type = "hypersensitivity";
  else if (sourceType === "allergy" && !/(cough|nausea|vomit|diarr|gi upset|upset stomach|myalgia|muscle|headache|dizz|fatigue|constipation|edema|flushing|insomnia|drows)/i.test(reactionText)) reaction_type = "hypersensitivity";
  else reaction_type = "side_effect";

  let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
  if (isAce && /(cough|angioedema)/i.test(reactionText)) mechanism = "non_immune";
  else if (/ketoacidosis|lactic acidosis/i.test(reactionText)) mechanism = "non_immune";
  else if (sourceType === "allergy") mechanism = reaction_type === "hypersensitivity" ? "immune" : "unknown";
  else if (sourceType === "intolerance") mechanism = reaction_type === "side_effect" ? "non_immune" : "unknown";
  else if (sourceType === "adverse_reaction") mechanism = reaction_type === "serious_adverse_event" ? "non_immune" : "unknown";
  return { reaction_type, mechanism };
}

interface AlLine {
  key: string;
  last: Ev;
  row: AllergyIntoleranceRow;
}

function buildAllergies(evs: Ev[]): AlLine[] {
  const out: AlLine[] = [];
  for (const [, events] of groupBy(evs, "allergy_id")) {
    const valid = events.filter((ev) => ["add", "update", "inactivate"].includes(ev.e.action));
    if (valid.length === 0) continue;
    const last = valid[valid.length - 1];
    if (last.e.action === "inactivate") continue;
    const e = last.e;
    const name = str(e.substance?.name);
    if (!name) continue;
    const substance = (ingredientOf(name) ?? name).toLowerCase();
    const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.filter((r: unknown) => typeof r === "string" && r.trim()).map((r: string) => r.trim()) : [];
    const reactionText = reactions.join("; ");
    const cls = classifyReaction(e.reaction_type, reactionText, substance);
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: cls.reaction_type,
      mechanism: cls.mechanism,
      criticality: e.severity === "low" || e.severity === "high" ? e.severity : "unknown",
      evidence: evidenceOf(valid),
    };
    const rx = str(e.substance?.rxnorm);
    if (rx) row.rxnorm_ingredient = rx;
    if (reactionText) row.reaction = reactionText;
    let onset: AllergyIntoleranceRow["onset"] | undefined;
    for (const ev of valid) onset = fuzzy(ev.e.onset) ?? onset;
    if (onset) row.onset = onset;
    const sens = restrictedSens(valid);
    if (sens) row.sensitivity = sens;
    out.push({ key: substance, last, row });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Labs
// ─────────────────────────────────────────────────────────────────────────────

const LOINC_MAP: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "62238-1": "egfr", "98979-8": "egfr", "88293-6": "egfr",
  "88294-4": "egfr", "50044-7": "egfr", "69405-9": "egfr", "77147-7": "egfr", "50210-4": "egfr", "98980-6": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate",
  "33037-3": "anion_gap", "41276-7": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "20509-6": "hemoglobin",
  "53060-9": "bhb", "47596-5": "bhb", "2744-1": "ph", "11558-4": "ph", "2019-8": "pco2", "11557-6": "pco2", "2021-4": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "49563-0": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

const CODE_MAP: Record<string, Analyte> = {
  CREAT: "creatinine", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate",
  TCO2: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", GLUC: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", ACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase", TROP: "troponin", TNI: "troponin", TROPI: "troponin",
  CHOL: "cholesterol", TC: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

function analyteOf(test: any, resultCode: string): Analyte | null {
  const name = String(test?.name ?? "");
  const code = String(test?.nfm_code ?? "").toUpperCase();
  const n = name.toLowerCase();
  // Urine creatinine / urine glucose etc. are not the serum analytes.
  const urine = /\burine|\bur\b|urinary/.test(n);
  if (/^EGFR/.test(code) || /\begfr\b|glomerular filtration/.test(n) || /EGFR/i.test(resultCode)) return "egfr";
  if (/albumin\s*\/\s*creat|albumin.creatinine ratio|\buacr\b|microalb.*creat/.test(n)) return "uacr";
  const loinc = str(test?.loinc);
  if (loinc && LOINC_MAP[loinc]) {
    const a = LOINC_MAP[loinc];
    if (urine && a !== "uacr") return null;
    return a;
  }
  if (urine) return null;
  if (CODE_MAP[code]) return CODE_MAP[code];
  const lk = resultCode.toUpperCase().replace(/^LK-/, "");
  if (CODE_MAP[lk]) return CODE_MAP[lk];
  if (/creatinine/.test(n)) return "creatinine";
  if (/potassium/.test(n)) return "potassium";
  if (/sodium/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/bicarbonate|\bco2\b|carbon dioxide/.test(n) && !/pco2|partial/.test(n)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/a1c|glycated h|glycohemoglobin/.test(n)) return "a1c";
  if (/glucose/.test(n) && !/meter|poc|point of care|fingerstick/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(n)) return "wbc";
  if (/hemoglobin|\bhgb\b/.test(n)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b/.test(n)) return "bhb";
  if (/\bpco2\b/.test(n)) return "pco2";
  if (/\bph\b/.test(n)) return "ph";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n)) return "troponin";
  if (/triglycer/.test(n)) return "triglycerides";
  if (/\bhdl\b/.test(n)) return "hdl";
  if (/\bldl\b/.test(n)) return "ldl";
  if (/cholesterol/.test(n) && !/non[- ]?hdl|vldl|ratio/.test(n)) return "cholesterol";
  return null;
}

const UNIT_OF: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const normUnit = (u: string) => u.toLowerCase().replace(/\s+/g, "").replace(/µ|μ/g, "u");

/** Factor to convert the filed unit into the consumer's unit, or null if not convertible. */
function unitFactor(a: Analyte, unit: string): number | null {
  const u = normUnit(unit);
  const target = normUnit(UNIT_OF[a]);
  if (u === target) return 1;
  switch (a) {
    case "egfr":
      if (/^ml\/min(\/1\.73m\^?2|\/1\.73m2|\/1\.73sqm|\/{1\.73_m2})?$/.test(u) || u === "ml/min/1.73m²") return 1;
      return null;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      return u === "meq/l" || u === "mmol/l" ? 1 : null;
    case "platelets": case "wbc":
      if (u === "cells/ul" || u === "/ul" || u === "cells/mm3" || u === "/mm3") return 1 / 1000;
      if (u === "k/ul" || u === "10*3/ul" || u === "x10e3/ul" || u === "10^3/ul" || u === "thou/ul" || u === "x10^3/ul" || u === "10*9/l" || u === "x10e9/l" || u === "10^9/l") return 1;
      return null;
    case "ph":
      return u === "" || u === "[ph]" || u === "ph" ? 1 : null;
    case "pco2":
      return u === "mmhg" || u === "mm[hg]" ? 1 : null;
    case "lipase":
      return u === "u/l" || u === "iu/l" ? 1 : null;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return 1;
      if (u === "ng/l" || u === "pg/ml") return 1 / 1000;
      return null;
    case "a1c":
      return u === "%" || u === "%hba1c" || u === "%ofhgb" || u === "%oftotalhgb" ? 1 : null;
    case "uacr":
      return u === "mg/g" || u === "mg/gcreat" || u === "mg/g{creat}" || u === "ug/mgcreat" || u === "ug/mg" ? 1 : null;
    case "hemoglobin":
      return u === "g/dl" ? 1 : null;
    default:
      return u === "mg/dl" ? 1 : null;
  }
}

function egfrEquation(e: any): LabResultRow["egfr_equation"] {
  const comment = String(e.comment ?? "") + " " + String(e.test?.name ?? "");
  if (/ckd[- ]?epi[^.;]*2021|2021[^.;]*ckd[- ]?epi|race[- ]free/i.test(comment)) return "ckd-epi-2021";
  if (/ckd[- ]?epi[^.;]*2009|2009[^.;]*ckd[- ]?epi/i.test(comment)) return "ckd-epi-2009";
  if (/\bmdrd\b/i.test(comment)) return "mdrd";
  const rc = String(e.external_ref?.result_code ?? "") + " " + String(e.test?.nfm_code ?? "");
  if (/21/.test(rc) && /egfr/i.test(rc)) return "ckd-epi-2021";
  if (/09/.test(rc) && /egfr/i.test(rc)) return "ckd-epi-2009";
  if (/mdrd/i.test(rc)) return "mdrd";
  if (/ckd[- ]?epi/i.test(comment)) return "unknown";
  return "unknown";
}

/** True for the race-coefficient variant of an eGFR (the "African American"/"Black" value). */
function isRaceVariant(e: any): boolean {
  const name = String(e.test?.name ?? "").toLowerCase();
  const code = String(e.test?.nfm_code ?? "").toUpperCase();
  const rc = String(e.external_ref?.result_code ?? "").toUpperCase();
  if (/non[- ]?(african|black|aa\b)/.test(name) || /NAA$|NONAA|NB$/.test(code)) return false;
  if (/african|black/.test(name)) return true;
  if (/-AA$/.test(code) || /EGFR\d*A$/.test(rc)) return true;
  if (e.test?.loinc === "48643-1" || e.test?.loinc === "88293-6") return true;
  return false;
}

function buildLabs(evs: Ev[]): LabResultRow[] {
  interface Cand { row: LabResultRow; key: string; rank: number; rec: number }
  const cands: Cand[] = [];
  for (const ev of evs) {
    const e = ev.e;
    const raw = typeof e.value === "string" ? e.value : typeof e.value === "number" ? String(e.value) : "";
    const m = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(raw);
    if (!m) continue;
    const resultCode = String(e.external_ref?.result_code ?? "");
    const analyte = analyteOf(e.test, resultCode);
    if (!analyte) continue;
    if (analyte === "egfr" && isRaceVariant(e)) continue;
    const factor = unitFactor(analyte, String(e.unit ?? ""));
    if (factor === null) continue;
    let value = parseFloat(m[2]);
    if (!isFinite(value)) continue;
    if (factor !== 1) value = Math.round(value * factor * 1e6) / 1e6;
    const status: LabResultRow["status"] | null =
      e.result_status === "F" || e.result_status === "C" ? "final" : e.result_status === "P" ? "preliminary" : null;
    if (!status) continue;
    const collected = str(e.collected) ?? str(ev.item.effective);
    if (!collected) continue;
    const row: LabResultRow = { analyte, value, unit: UNIT_OF[analyte], collected, status, evidence: [{ item_id: ev.item.id, entry_id: ev.entryId }] };
    if (m[1]) row.comparator = m[1] as LabResultRow["comparator"];
    if (analyte === "egfr") row.egfr_equation = egfrEquation(e);
    const loinc = str(e.test?.loinc);
    if (loinc) row.loinc = loinc;
    const acc = str(e.external_ref?.accession);
    const comp = resultCode || String(e.test?.nfm_code ?? "");
    const key = acc ? `${acc}\u0000${comp}` : `${ev.item.id}\u0000${ev.entryId}`;
    cands.push({ row, key, rank: status === "final" ? 1 : 0, rec: isNaN(ev.rec) ? 0 : ev.rec });
  }
  const best = new Map<string, Cand>();
  for (const c of cands) {
    const cur = best.get(c.key);
    if (!cur || c.rank > cur.rank || (c.rank === cur.rank && c.rec > cur.rec)) best.set(c.key, c);
  }
  return [...best.values()]
    .map((c) => c.row)
    .sort((a, b) => instant(a.collected) - instant(b.collected) || (a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
}

// ─────────────────────────────────────────────────────────────────────────────
// Vitals
// ─────────────────────────────────────────────────────────────────────────────

function parseBp(s: unknown): [number, number] | null {
  if (typeof s !== "string") return null;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(s);
  if (!m) return null;
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

function buildVitals(evs: Ev[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const ev of evs) {
    const e = ev.e;
    const t = localDateTime(ev.item.effective) ?? localDateTime(ev.item.recorded);
    if (!t) continue;
    const row: VitalRow = { setting: "clinic", local_time: t, evidence: [{ item_id: ev.item.id, entry_id: ev.entryId }] };
    let any = false;
    const bp = parseBp(e.bp);
    if (bp) { row.systolic_mmhg = bp[0]; row.diastolic_mmhg = bp[1]; any = true; }
    const rp = parseBp(e.bp_repeat);
    if (rp) { row.repeat_systolic_mmhg = rp[0]; row.repeat_diastolic_mmhg = rp[1]; any = true; }
    if (typeof e.pulse_bpm === "number" && isFinite(e.pulse_bpm)) { row.pulse_bpm = e.pulse_bpm; any = true; }
    if (typeof e.weight_lb === "number" && isFinite(e.weight_lb) && e.weight_lb > 0) {
      row.weight_kg = Math.round(e.weight_lb * 0.45359237 * 10) / 10;
      any = true;
    }
    if (any) rows.push(row);
  }
  return rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return out;
  const cur = currentItems(items, asOf.trim().slice(0, 10));
  const byType = collect(cur);
  const get = (t: string) => byType.get(t) ?? [];

  let ingredientsByItem = new Map<string, string[]>();
  try {
    const med = buildMedications(get("med_event"));
    out.medications = med.rows;
    ingredientsByItem = med.ingredientsByItem;
  } catch { /* skip unreadable */ }

  let allergyLines: AlLine[] = [];
  try { allergyLines = buildAllergies(get("allergy_event")); } catch { /* skip */ }

  try {
    const { lines } = buildProblems(get("problem_event"));
    // One problem row per condition: latest line wins, evidence merged.
    const best = new Map<string, ProbLine>();
    const allEv = new Map<string, Ev[]>();
    for (const l of lines) {
      if (l.dx && !l.dx.conditionNamed) continue; // T-code naming only the adverse effect: allergy row only
      const c = best.get(l.key);
      if (!c || cmpEv(c.last, l.last) < 0) best.set(l.key, l);
      allEv.set(l.key, [...(allEv.get(l.key) ?? []), ...l.events]);
    }
    for (const [k, l] of best) {
      const evs = (allEv.get(k) ?? l.events).slice().sort(cmpEv);
      // Cite the current line first.
      l.row.evidence = evidenceOf([...l.events.slice().reverse(), ...evs.slice().reverse()]);
      out.problems.push(l.row);
    }
    out.problems.sort((a, b) => (a.condition < b.condition ? -1 : a.condition > b.condition ? 1 : 0));

    // Drug-caused diagnoses yield an allergy row too.
    for (const l of lines) {
      if (!l.dx) continue;
      let substance = l.dx.substance;
      if (l.dx.classMembers) {
        const inItem = new Set<string>();
        for (const ev of l.events) for (const ing of ingredientsByItem.get(ev.item.id) ?? []) if (l.dx.classMembers.includes(ing)) inItem.add(ing);
        if (inItem.size === 1) substance = [...inItem][0];
      }
      const cond = l.row.condition;
      const cls = classifyReaction("adverse_reaction", cond, substance);
      const row: AllergyIntoleranceRow = {
        substance,
        reaction_type: cls.reaction_type,
        mechanism: l.dx.conditionNamed ? cls.mechanism : "unknown",
        criticality: "unknown",
        evidence: evidenceOf(l.events.slice().reverse()),
      };
      if (l.dx.conditionNamed) row.reaction = cond;
      if (l.row.onset) row.onset = l.row.onset;
      if (l.row.sensitivity) row.sensitivity = l.row.sensitivity;
      allergyLines.push({ key: substance.toLowerCase(), last: l.last, row });
    }
  } catch { /* skip */ }

  // One allergy row per substance: an allergy-list line wins over a derived row; evidence merged.
  const byKey = new Map<string, AlLine[]>();
  for (const a of allergyLines) byKey.set(a.key, [...(byKey.get(a.key) ?? []), a]);
  for (const [, group] of byKey) {
    let chosen = group[0];
    for (const g of group) if (cmpEv(chosen.last, g.last) < 0) chosen = g;
    const listLines = group.filter((g) => g.last.e.type === "allergy_event");
    if (listLines.length) {
      chosen = listLines[0];
      for (const g of listLines) if (cmpEv(chosen.last, g.last) < 0) chosen = g;
    }
    const ev: Evidence = [...chosen.row.evidence];
    for (const g of group) for (const x of g.row.evidence) if (!ev.some((y) => y.item_id === x.item_id && y.entry_id === x.entry_id)) ev.push(x);
    out.allergies.push({ ...chosen.row, evidence: ev });
  }
  out.allergies.sort((a, b) => (a.substance < b.substance ? -1 : a.substance > b.substance ? 1 : 0));

  try { out.labs = buildLabs(get("imported_result")); } catch { /* skip */ }
  try { out.vitals = buildVitals(get("vital_set")); } catch { /* skip */ }
  return out;
}
