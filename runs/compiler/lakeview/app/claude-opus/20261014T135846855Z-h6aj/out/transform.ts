import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  ProblemRow,
  AllergyIntoleranceRow,
  LabResultRow,
  VitalRow,
  Analyte,
  Evidence,
  Sensitivity,
} from "../in/views/views";

// ───────────────────────────────────────────────────────────────────────────
// Time helpers (America/Chicago)
// ───────────────────────────────────────────────────────────────────────────

const TZ = "America/Chicago";
let fmt: Intl.DateTimeFormat | null = null;

function chicagoFormatter(): Intl.DateTimeFormat {
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

/** Local wall-clock `YYYY-MM-DDTHH:MM` in Chicago, or null when unreadable. */
function localDateTime(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const m = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(s);
  if (!m) return null;
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/i.test(s);
  if (!m[2]) return null;
  if (!hasZone) return `${m[1]}T${m[2]}:${m[3]}`; // floating local time: as written
  const t = Date.parse(s);
  if (isNaN(t)) return null;
  const parts: Record<string, string> = {};
  for (const p of chicagoFormatter().formatToParts(new Date(t))) parts[p.type] = p.value;
  const hour = parts.hour === "24" ? "00" : parts.hour;
  return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}`;
}

/** Local date `YYYY-MM-DD` (date-only strings pass through). */
function localDate(s: unknown): string | null {
  if (typeof s !== "string") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dt = localDateTime(s);
  return dt ? dt.slice(0, 10) : null;
}

function instant(s: unknown): number {
  if (typeof s !== "string") return NaN;
  return Date.parse(s);
}

// ───────────────────────────────────────────────────────────────────────────
// Item scope and correction rules
// ───────────────────────────────────────────────────────────────────────────

interface Entry {
  item: FolioItem;
  entryId: string;
  row: any;
}

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = items.filter((it) => {
    if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
    const d = localDate(it.recorded);
    return d !== null && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const id of [...(Array.isArray(it.supersedes) ? it.supersedes : []), ...(Array.isArray(it.retracts) ? it.retracts : [])]) {
      dead.add(`${it.issuer}\u0000${id}`);
    }
  }
  // Supersession is transitive: an item that supersedes a dead item is itself still alive unless named.
  // Anything named by any in-scope item (dead or not) is not current.
  return inScope.filter((it) => !dead.has(`${it.issuer}\u0000${it.id}`));
}

function entriesOf(items: FolioItem[]): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    const p = item.payload;
    if (!p || typeof p !== "object") continue;
    for (const entryId of Object.keys(p)) {
      const row = p[entryId];
      if (row && typeof row === "object" && typeof row.type === "string") out.push({ item, entryId, row });
    }
  }
  return out;
}

function ev(e: Entry): { item_id: string; entry_id: string } {
  return { item_id: e.item.id, entry_id: e.entryId };
}

function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x : undefined;
}

function num(x: unknown): number | undefined {
  return typeof x === "number" && isFinite(x) ? x : undefined;
}

// ───────────────────────────────────────────────────────────────────────────
// Drug names
// ───────────────────────────────────────────────────────────────────────────

const BRANDS: Record<string, string> = {
  kerendia: "finerenone",
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  steglatro: "ertugliflozin",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  trulicity: "dulaglutide",
  victoza: "liraglutide",
  mounjaro: "tirzepatide",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  humalog: "insulin lispro",
  novolog: "insulin aspart",
  glucophage: "metformin",
  cozaar: "losartan",
  diovan: "valsartan",
  benicar: "olmesartan",
  avapro: "irbesartan",
  micardis: "telmisartan",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  vasotec: "enalapril",
  altace: "ramipril",
  lasix: "furosemide",
  bumex: "bumetanide",
  demadex: "torsemide",
  aldactone: "spironolactone",
  inspra: "eplerenone",
  norvasc: "amlodipine",
  lokelma: "sodium zirconium cyclosilicate",
  veltassa: "patiromer",
  renvela: "sevelamer",
  renagel: "sevelamer",
  sensipar: "cinacalcet",
  zemplar: "paricalcitol",
  epogen: "epoetin alfa",
  procrit: "epoetin alfa",
  retacrit: "epoetin alfa",
  aranesp: "darbepoetin alfa",
  zyloprim: "allopurinol",
  uloric: "febuxostat",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  zocor: "simvastatin",
};

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "calcium", "magnesium", "maleate", "besylate", "mesylate",
  "succinate", "tartrate", "citrate", "carbonate", "acetate", "sulfate", "fumarate", "bicarbonate",
  "hydrobromide", "medoxomil", "monohydrate", "dihydrate", "phosphate", "chloride", "propionate",
  "er", "xr", "sr", "dr", "la", "xl", "cd", "hctz",
]);
// salts that are the drug itself when alone, or meaningful parts of a multi-word name
const KEEP_WHOLE = new Set(["sodium bicarbonate", "calcium acetate", "calcium carbonate", "potassium chloride", "sodium zirconium cyclosilicate", "sevelamer carbonate", "ferric citrate", "magnesium oxide"]);

function ingredientOf(drugName: string): string | undefined {
  let s = drugName.toLowerCase().replace(/[®™]/g, "").trim();
  // cut at first strength/number token
  const cut = s.search(/\s\d|\s\(|,|\s\d*\.\d/);
  if (cut > 0) s = s.slice(0, cut);
  s = s.replace(/\b(oral|tablet|tablets|tab|capsule|capsules|cap|solution|injection|pen|vial|suspension|extended|release|delayed|chewable|subcutaneous|prefilled|syringe)\b.*$/, "").trim();
  if (!s) return undefined;
  const first = s.split(/\s+/)[0];
  if (BRANDS[s]) return BRANDS[s];
  if (BRANDS[first]) return BRANDS[first];
  if (KEEP_WHOLE.has(s)) {
    if (s === "sevelamer carbonate") return "sevelamer";
    return s;
  }
  const words = s.split(/\s+/);
  const kept = words.filter((w) => !SALTS.has(w));
  const out = (kept.length ? kept : words).join(" ").trim();
  return out || undefined;
}

// ───────────────────────────────────────────────────────────────────────────
// Medications
// ───────────────────────────────────────────────────────────────────────────

const FREQS = new Set(["QD", "BID", "TID", "QHS", "QW", "PRN"]);

function mapMedications(entries: Entry[]): MedicationRow[] {
  const visitAt = new Map<string, string>();
  for (const e of entries) if (e.row.type === "CLINIC_VISIT" && str(e.row.VISIT_ID)) visitAt.set(e.row.VISIT_ID, e.row.VISIT_AT);

  const orders = new Map<string, Entry>();
  for (const e of entries) {
    if (e.row.type !== "MED_ORDER" || !str(e.row.RX_ID)) continue;
    const prev = orders.get(e.row.RX_ID);
    if (!prev || (instant(e.item.recorded) || 0) > (instant(prev.item.recorded) || 0)) orders.set(e.row.RX_ID, e);
  }
  const hists = new Map<string, Entry[]>();
  const seenHist = new Set<string>();
  for (const e of entries) {
    if (e.row.type !== "MED_STATUS_HIST" || !str(e.row.RX_ID)) continue;
    const hid = str(e.row.HIST_ID) ?? `${e.item.id}/${e.entryId}`;
    if (seenHist.has(hid)) continue;
    seenHist.add(hid);
    const list = hists.get(e.row.RX_ID) ?? [];
    list.push(e);
    hists.set(e.row.RX_ID, list);
  }
  const histTime = (h: Entry): number => {
    const t = instant(h.row.CHANGED_AT);
    return isNaN(t) ? instant(visitAt.get(h.row.VISIT_ID)) || instant(h.item.effective) || 0 : t;
  };

  interface Cand { row: MedicationRow; key: string; latest: string }
  const cands: Cand[] = [];

  for (const [rxId, o] of orders) {
    const r = o.row;
    const hs = (hists.get(rxId) ?? []).slice().sort((a, b) => histTime(a) - histTime(b) || String(a.row.HIST_ID).localeCompare(String(b.row.HIST_ID)));
    // entered in error at any point: the prescription never existed
    if (r.MED_STATUS === 9 || hs.some((h) => h.row.NEW_STATUS === 9)) continue;
    if (r.ROUTE === "IV") continue; // infusions are not home medications
    const drugName = str(r.DRUG_NAME);
    if (!drugName) continue;
    const last = hs.length ? hs[hs.length - 1] : undefined;
    const code = last ? last.row.NEW_STATUS : r.MED_STATUS;
    const status: MedicationRow["status"] = code === 1 ? "active" : code === 2 ? "stopped" : code === 3 ? "held" : "unknown";

    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [ev(o)] };
    const ing = ingredientOf(drugName);
    if (ing) row.ingredient = ing;

    if (status === "active") {
      // resumed after a hold: since the resume; otherwise the start date
      const since = last && last.row.NEW_STATUS === 1 && last.row.OLD_STATUS === 3 ? localDate(last.row.CHANGED_AT) : localDate(r.START_DATE);
      if (since) row.status_since = since;
    } else if (last) {
      const since = localDate(last.row.CHANGED_AT) ?? localDate(visitAt.get(last.row.VISIT_ID));
      if (since) row.status_since = since;
    }

    const dose = num(r.DOSE_QTY);
    const unit = r.DOSE_UNIT === "unit" ? "units" : r.DOSE_UNIT;
    if (dose !== undefined && (unit === "mg" || unit === "mcg" || unit === "units" || unit === "mL")) row.dose = { value: dose, unit };
    if (FREQS.has(r.FREQ_CODE)) row.frequency = r.FREQ_CODE;

    if (last && status !== "active") {
      const comment = str(last.row.COMMENT_TEXT);
      if (comment) row.status_reason_text = comment;
      if (status === "stopped") {
        const rc = last.row.REASON_CODE;
        if (rc === "ADR") row.stop_reason = "adverse_reaction";
        else if (rc === "PT") row.stop_reason = "patient_choice";
        else if (rc === "LAB" || rc === "PROC" || rc === "OTH") row.stop_reason = "other";
      }
    }
    for (const h of hs) row.evidence.push(ev(h));

    const startKey = localDate(r.START_DATE) ?? "";
    const lastKey = last ? localDateTime(last.row.CHANGED_AT) ?? "" : "";
    const latest = lastKey > startKey ? lastKey : startKey;
    const key = ing ?? `lvd:${str(r.LV_DRUG_ID) ?? drugName.toLowerCase()}`;
    cands.push({ row, key, latest: `${latest}|${o.item.effective ?? ""}|${rxId}` });
  }

  const best = new Map<string, Cand>();
  for (const c of cands) {
    const prev = best.get(c.key);
    if (!prev || c.latest > prev.latest) best.set(c.key, c);
  }
  return [...best.values()].map((c) => c.row);
}

// ───────────────────────────────────────────────────────────────────────────
// Problems and drug-attributed diagnoses
// ───────────────────────────────────────────────────────────────────────────

function problemGroup(icd: string): string {
  const c = icd.toUpperCase();
  if (/^[TZ]/.test(c)) return c;
  return c.slice(0, 3);
}

function ckdFromIcd(icd: string): ProblemRow["ckd_stage"] | undefined {
  const c = icd.toUpperCase();
  if (c === "N18.1") return "G1";
  if (c === "N18.2") return "G2";
  if (c === "N18.31") return "G3a";
  if (c === "N18.32") return "G3b";
  if (c === "N18.4") return "G4";
  if (c === "N18.5" || c === "N18.6") return "G5";
  return undefined;
}

function sensitivityForIcd(icd: string): Sensitivity[] | undefined {
  const c = icd.toUpperCase();
  const cat = c.slice(0, 3);
  if (/^F1[0-9]$/.test(cat)) return ["substance-use"];
  if (/^F/.test(cat)) return ["mental-health"];
  if (cat === "B20" || cat === "Z21" || /^A5[0-9]$/.test(cat) || /^A6[0-4]$/.test(cat)) return ["hiv-sti"];
  if (/^O/.test(cat) || cat === "Z33" || cat === "Z34" || cat === "Z30" || cat === "Z3A") return ["sexual-reproductive-health"];
  return undefined;
}

/** ICD-10-CM T36–T50 code whose 6th character is 5: adverse effect of a drug. */
function isAdverseEffectCode(icd: string): boolean {
  return /^T(3[6-9]|4[0-9]|50)\.[0-9A-Z]{2}5/i.test(icd);
}

interface DrugClass { pattern: RegExp; members: (ing: string) => boolean }
const CLASSES: DrugClass[] = [
  { pattern: /\bsglt-?2\b|sodium-glucose/i, members: (i) => /gliflozin$/.test(i) },
  { pattern: /\bace\b|angiotensin[- ]converting/i, members: (i) => /pril$/.test(i) },
  { pattern: /\barbs?\b|angiotensin (ii )?receptor/i, members: (i) => /sartan$/.test(i) },
  { pattern: /mineralocorticoid|aldosterone antagonist/i, members: (i) => ["finerenone", "spironolactone", "eplerenone"].includes(i) },
  { pattern: /\bglp-?1\b/i, members: (i) => ["semaglutide", "dulaglutide", "liraglutide", "tirzepatide", "exenatide"].includes(i) },
  { pattern: /\bstatins?\b|hmg-?coa/i, members: (i) => /statin$/.test(i) },
  { pattern: /loop diuretic/i, members: (i) => ["furosemide", "bumetanide", "torsemide"].includes(i) },
  { pattern: /biguanide/i, members: (i) => i === "metformin" },
  { pattern: /\binsulin\b/i, members: (i) => /^insulin/.test(i) },
];

function classify(reaction: string, substance: string): { type: AllergyIntoleranceRow["reaction_type"]; mech: AllergyIntoleranceRow["mechanism"]; crit: AllergyIntoleranceRow["criticality"] } {
  const r = reaction.toLowerCase();
  const ace = /pril$|\bace\b|angiotensin[- ]converting/i.test(substance);
  if (/angioedema/.test(r) && ace) return { type: "hypersensitivity", mech: "non_immune", crit: "high" };
  if (/cough/.test(r) && ace) return { type: "side_effect", mech: "non_immune", crit: "low" };
  if (/anaphyla/.test(r)) return { type: "hypersensitivity", mech: "unknown", crit: "high" };
  if (/angioedema/.test(r)) return { type: "hypersensitivity", mech: "unknown", crit: "high" };
  if (/urticaria|hives|rash|bronchospasm|dermatitis|stevens|eruption/.test(r)) return { type: "hypersensitivity", mech: "unknown", crit: "unknown" };
  if (/acidosis|hyperkalemia|kidney injury|acute kidney|renal failure|pancreatitis|rhabdo|hypoglycemi|agranulocytosis|hyponatremia/.test(r))
    return { type: "serious_adverse_event", mech: /acidosis|hyperkalemia/.test(r) ? "non_immune" : "unknown", crit: "high" };
  return { type: "side_effect", mech: "unknown", crit: "unknown" };
}

function mapProblemsAndAllergies(entries: Entry[], meds: Map<string, string[]>): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const visits = new Map<string, Entry>();
  for (const e of entries) if (e.row.type === "CLINIC_VISIT" && str(e.row.VISIT_ID)) visits.set(e.row.VISIT_ID, e);
  const whenOf = (e: Entry): number => {
    const v = visits.get(e.row.VISIT_ID);
    return instant(v?.row.VISIT_AT) || instant(e.item.effective) || instant(e.item.recorded) || 0;
  };

  const dx = entries.filter((e) => e.row.type === "VISIT_DX" && str(e.row.ICD10CM));
  dx.sort((a, b) => whenOf(a) - whenOf(b) || (num(b.row.DX_RANK) ?? 0) - (num(a.row.DX_RANK) ?? 0));

  const allergies: AllergyIntoleranceRow[] = [];
  const allergyKeys = new Map<string, AllergyIntoleranceRow>();

  const groups = new Map<string, Entry[]>();
  for (const e of dx) {
    const code: string = e.row.ICD10CM.trim();
    const text: string = str(e.row.DX_TEXT) ?? code;
    const isTcode = isAdverseEffectCode(code);
    const drugAttributed = isTcode || /\b(induced|associated|adverse effect of|due to)\b/i.test(text);

    if (drugAttributed && (e.row.DX_STATUS === "A" || e.row.DX_STATUS === "H")) {
      const substance = findSubstance(text, meds.get(e.item.id) ?? []);
      if (substance) {
        let reaction: string | undefined;
        if (isTcode) {
          // manifestation is coded first; take the dx ranked just before it in the same contact
          const rank = num(e.row.DX_RANK);
          const prev = dx.find((d) => d.item === e.item && rank !== undefined && num(d.row.DX_RANK) === rank - 1);
          if (prev && !isAdverseEffectCode(prev.row.ICD10CM) && !/^(N18|E0[89]|E1[0-3]|I1[0-6])/i.test(prev.row.ICD10CM)) reaction = str(prev.row.DX_TEXT);
        } else reaction = text;
        const cls = classify(reaction ?? text, substance);
        const row: AllergyIntoleranceRow = { substance, reaction_type: cls.type, mechanism: cls.mech, criticality: cls.crit, evidence: [ev(e)] };
        if (reaction) row.reaction = reaction;
        const prev = allergyKeys.get(substance);
        if (prev) prev.evidence.push(ev(e));
        else {
          allergyKeys.set(substance, row);
          allergies.push(row);
        }
      }
    }
    if (isTcode) continue; // a T-code names only the adverse effect: allergy row alone
    const g = problemGroup(code);
    const list = groups.get(g) ?? [];
    list.push(e);
    groups.set(g, list);
  }

  // CKD categories from the visit rows, latest first
  const visitList = [...visits.values()].sort((a, b) => (instant(a.row.VISIT_AT) || 0) - (instant(b.row.VISIT_AT) || 0));

  const problems: ProblemRow[] = [];
  for (const [g, list] of groups) {
    const latest = list[list.length - 1];
    if (latest.row.DX_STATUS === "R") continue;
    let basis = latest;
    if (latest.row.DX_STATUS !== "A" && latest.row.DX_STATUS !== "H") {
      const confirmed = list.filter((e) => e.row.DX_STATUS === "A" || e.row.DX_STATUS === "H");
      if (!confirmed.length) continue;
      basis = confirmed[confirmed.length - 1];
    }
    const row: ProblemRow = {
      condition: str(basis.row.DX_TEXT) ?? basis.row.ICD10CM,
      icd10cm: basis.row.ICD10CM,
      status: basis.row.DX_STATUS === "H" ? "resolved" : "active",
      evidence: [ev(basis)],
    };
    if (g === "N18") {
      let stage: ProblemRow["ckd_stage"] | undefined;
      let stageAt = -Infinity;
      for (const d of list) {
        const s = ckdFromIcd(d.row.ICD10CM);
        if (s && whenOf(d) >= stageAt) { stage = s; stageAt = whenOf(d); }
      }
      let alb: ProblemRow["albuminuria"] | undefined;
      let stageVisit: Entry | undefined;
      let albVisit: Entry | undefined;
      for (const v of visitList) {
        const t = instant(v.row.VISIT_AT) || 0;
        if (["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(v.row.CKD_G) && t >= stageAt) { stage = v.row.CKD_G; stageAt = t; stageVisit = v; }
        if (["A1", "A2", "A3"].includes(v.row.CKD_A)) { alb = v.row.CKD_A; albVisit = v; }
      }
      if (stage) row.ckd_stage = stage;
      if (alb) row.albuminuria = alb;
      for (const v of [stageVisit, albVisit]) {
        if (v && !row.evidence.some((x) => x.item_id === v.item.id && x.entry_id === v.entryId)) row.evidence.push(ev(v));
      }
    }
    const sens = sensitivityForIcd(basis.row.ICD10CM);
    if (sens) row.sensitivity = sens;
    problems.push(row);
  }
  return { problems, allergies };
}

function findSubstance(text: string, itemMeds: string[]): string | undefined {
  const t = text.toLowerCase();
  // a specific drug named in the text
  for (const [brand, ing] of Object.entries(BRANDS)) if (new RegExp(`\\b${brand}\\b`).test(t)) return ing;
  for (const ing of itemMeds) if (t.includes(ing)) return ing;
  const named = /\b([a-z]+(?:pril|sartan|gliflozin|glutide|statin|formin|renone|olactone))\b/.exec(t);
  if (named) return named[1];
  for (const c of CLASSES) {
    const m = c.pattern.exec(text);
    if (!m) continue;
    const hits = [...new Set(itemMeds.filter(c.members))];
    if (hits.length === 1) return hits[0];
    return classLabel(text, m);
  }
  const ae = /adverse effect of ([^,;]+)/i.exec(text);
  if (ae) return ae[1].trim().toLowerCase();
  return undefined;
}

function classLabel(text: string, m: RegExpExecArray): string {
  // the class as written, e.g. "SGLT2 inhibitor"
  const rest = text.slice(m.index);
  const w = /^[^,;()]*?\b(inhibitors?|blockers?|antagonists?|agonists?|diuretics?|statins?|insulins?|biguanides?)\b/i.exec(rest);
  return (w ? w[0] : m[0]).trim();
}

// ───────────────────────────────────────────────────────────────────────────
// Labs
// ───────────────────────────────────────────────────────────────────────────

const LAB_MAP: Record<string, { analyte: Analyte; unit: string; srcUnit: string }> = {
  "LK-CREAT": { analyte: "creatinine", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-EGFR09N": { analyte: "egfr", unit: "mL/min/1.73m2", srcUnit: "mL/min/1.73m2" },
  "LK-EGFR21": { analyte: "egfr", unit: "mL/min/1.73m2", srcUnit: "mL/min/1.73m2" },
  "LK-NA": { analyte: "sodium", unit: "mmol/L", srcUnit: "mmol/L" },
  "LK-K": { analyte: "potassium", unit: "mmol/L", srcUnit: "mmol/L" },
  "LK-GLU": { analyte: "glucose", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-A1C": { analyte: "a1c", unit: "%", srcUnit: "%" },
  "LK-UACR": { analyte: "uacr", unit: "mg/g", srcUnit: "mg/g" },
  "LK-WBC": { analyte: "wbc", unit: "10*3/uL", srcUnit: "K/uL" },
  "LK-HGB": { analyte: "hemoglobin", unit: "g/dL", srcUnit: "g/dL" },
  "LK-PLT": { analyte: "platelets", unit: "10*3/uL", srcUnit: "K/uL" },
  "LK-CHOL": { analyte: "cholesterol", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-TRIG": { analyte: "triglycerides", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-HDL": { analyte: "hdl", unit: "mg/dL", srcUnit: "mg/dL" },
  "LK-LDLC": { analyte: "ldl", unit: "mg/dL", srcUnit: "mg/dL" },
};

function parseValue(text: unknown): { value: number; comparator?: LabResultRow["comparator"] } | null {
  if (typeof text !== "string") return null;
  const m = /^\s*(<=|>=|<|>)?\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(text);
  if (!m) return null;
  const value = Number(m[2]);
  if (!isFinite(value)) return null;
  const out: { value: number; comparator?: LabResultRow["comparator"] } = { value };
  if (m[1]) out.comparator = m[1] as LabResultRow["comparator"];
  return out;
}

function egfrEquation(code: string, comment: unknown): LabResultRow["egfr_equation"] {
  const c = typeof comment === "string" ? comment.toLowerCase() : "";
  if (/ckd-?epi[^.]*2021/.test(c)) return "ckd-epi-2021";
  if (/ckd-?epi[^.]*2009/.test(c)) return "ckd-epi-2009";
  if (/\bmdrd\b/.test(c)) return "mdrd";
  if (code === "LK-EGFR21") return "ckd-epi-2021";
  if (code === "LK-EGFR09N") return "ckd-epi-2009";
  return "unknown";
}

function mapLabs(entries: Entry[]): LabResultRow[] {
  const reqs = new Map<string, Entry>(); // item id -> LAB_REQ
  const orders = new Map<string, Entry>(); // item id + ORDER_ID -> LAB_ORDER
  for (const e of entries) {
    if (e.row.type === "LAB_REQ") reqs.set(e.item.id, e);
    else if (e.row.type === "LAB_ORDER" && str(e.row.ORDER_ID)) orders.set(`${e.item.id}\u0000${e.row.ORDER_ID}`, e);
  }
  const rank = (s: string): number => (s === "A" ? 3 : s === "F" ? 2 : s === "P" ? 1 : 0);
  const best = new Map<string, { row: LabResultRow; rank: number; rec: number }>();

  for (const e of entries) {
    const r = e.row;
    if (r.type !== "LAB_RESULT") continue;
    const map = LAB_MAP[r.TEST_CODE];
    if (!map) continue; // untracked analyte, or race-coefficient eGFR variant (LK-EGFR09A)
    const st = r.RESULT_STATUS;
    if (st !== "P" && st !== "F" && st !== "A") continue;
    const order = orders.get(`${e.item.id}\u0000${r.ORDER_ID}`);
    if (order && (order.row.ORDER_STATUS === 9 || order.row.ORDER_STATUS === 5)) continue;
    if (r.UNIT_CODE !== map.srcUnit) continue;
    const v = parseValue(r.VALUE_TEXT);
    if (!v) continue;
    const req = reqs.get(e.item.id);
    const collected = str(req?.row.COLLECTED_AT) ?? str(e.item.effective);
    if (!collected) continue;

    const row: LabResultRow = { analyte: map.analyte, value: v.value, unit: map.unit, collected, status: st === "P" ? "preliminary" : "final", evidence: [ev(e)] };
    if (v.comparator) row.comparator = v.comparator;
    if (map.analyte === "egfr") row.egfr_equation = egfrEquation(r.TEST_CODE, r.COMMENT_TEXT);
    const loinc = str(r.LOINC);
    if (loinc) row.loinc = loinc;

    const key = str(r.RESULT_ID) ?? `${e.item.id}/${e.entryId}`;
    const rec = instant(e.item.recorded) || 0;
    const prev = best.get(key);
    if (!prev || rank(st) > prev.rank || (rank(st) === prev.rank && rec > prev.rec)) best.set(key, { row, rank: rank(st), rec });
  }
  return [...best.values()].map((b) => b.row).sort((a, b) => (instant(a.collected) || 0) - (instant(b.collected) || 0));
}

// ───────────────────────────────────────────────────────────────────────────
// Vitals
// ───────────────────────────────────────────────────────────────────────────

function mapVitals(entries: Entry[]): VitalRow[] {
  const byVisit = new Map<string, Entry[]>();
  for (const e of entries) {
    if (e.row.type !== "VITAL" || num(e.row.VALUE_NUM) === undefined) continue;
    const k = `${e.item.id}\u0000${e.row.VISIT_ID}`;
    const list = byVisit.get(k) ?? [];
    list.push(e);
    byVisit.set(k, list);
  }
  const rows: VitalRow[] = [];
  for (const list of byVisit.values()) {
    const pick = (code: string, n: number) => list.find((e) => e.row.VITAL_CODE === code && e.row.READING_NO === n);
    const readings = (code: string) => list.filter((e) => e.row.VITAL_CODE === code).map((e) => num(e.row.READING_NO) ?? 1);
    const t = (e: Entry) => instant(e.row.TAKEN_AT);
    const bpNos = [...new Set([...readings("BPS"), ...readings("BPD")])].sort((a, b) => a - b);

    const sorted = list.slice().sort((a, b) => (t(a) || 0) - (t(b) || 0));
    const firstBp = bpNos.length ? pick("BPS", bpNos[0]) ?? pick("BPD", bpNos[0]) : undefined;
    const anchor = firstBp ?? sorted[0];
    const local = localDateTime(anchor.row.TAKEN_AT) ?? localDateTime(anchor.item.effective);
    if (!local) continue;

    const row: VitalRow = { setting: "clinic", local_time: local, evidence: [] };
    if (bpNos.length) {
      const s1 = pick("BPS", bpNos[0]);
      const d1 = pick("BPD", bpNos[0]);
      if (s1) row.systolic_mmhg = s1.row.VALUE_NUM;
      if (d1) row.diastolic_mmhg = d1.row.VALUE_NUM;
      if (bpNos.length > 1) {
        const s2 = pick("BPS", bpNos[1]);
        const d2 = pick("BPD", bpNos[1]);
        if (s2) row.repeat_systolic_mmhg = s2.row.VALUE_NUM;
        if (d2) row.repeat_diastolic_mmhg = d2.row.VALUE_NUM;
      }
    }
    const hrNos = readings("HR").sort((a, b) => a - b);
    const hr = hrNos.length ? pick("HR", hrNos[0]) : undefined;
    if (hr) row.pulse_bpm = hr.row.VALUE_NUM;
    const wtNos = readings("WT").sort((a, b) => a - b);
    const wt = wtNos.length ? pick("WT", wtNos[0]) : undefined;
    if (wt && wt.row.UNIT_CODE === "kg") row.weight_kg = Math.round(wt.row.VALUE_NUM * 10) / 10;
    else if (wt && /^lbs?$/i.test(String(wt.row.UNIT_CODE))) row.weight_kg = Math.round(wt.row.VALUE_NUM * 0.45359237 * 10) / 10;

    for (const e of list) row.evidence.push(ev(e));
    if (row.systolic_mmhg === undefined && row.diastolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    rows.push(row);
  }
  return rows.sort((a, b) => a.local_time.localeCompare(b.local_time));
}

// ───────────────────────────────────────────────────────────────────────────
// Entry point
// ───────────────────────────────────────────────────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return empty;
  const cur = currentItems(items, asOf);
  const entries = entriesOf(cur);

  const out: ViewRows = { ...empty };
  try { out.medications = mapMedications(entries); } catch { out.medications = []; }

  // medications named in each item, for resolving drug-class diagnoses
  const medsByItem = new Map<string, string[]>();
  try {
    const rxIng = new Map<string, string>();
    for (const e of entries) if (e.row.type === "MED_ORDER" && str(e.row.DRUG_NAME)) {
      const ing = ingredientOf(e.row.DRUG_NAME);
      if (ing) rxIng.set(e.row.RX_ID, ing);
    }
    for (const e of entries) {
      let ing: string | undefined;
      if (e.row.type === "MED_ORDER" && e.row.MED_STATUS !== 9) ing = rxIng.get(e.row.RX_ID);
      else if (e.row.type === "MED_STATUS_HIST") ing = rxIng.get(e.row.RX_ID);
      if (!ing) continue;
      const list = medsByItem.get(e.item.id) ?? [];
      if (!list.includes(ing)) list.push(ing);
      medsByItem.set(e.item.id, list);
    }
    const pa = mapProblemsAndAllergies(entries, medsByItem);
    out.problems = pa.problems;
    out.allergies = pa.allergies;
  } catch {
    out.problems = [];
    out.allergies = [];
  }
  try { out.labs = mapLabs(entries); } catch { out.labs = []; }
  try { out.vitals = mapVitals(entries); } catch { out.vitals = []; }
  return out;
}
