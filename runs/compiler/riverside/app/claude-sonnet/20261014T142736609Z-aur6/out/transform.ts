import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Analyte, Evidence, Sensitivity,
} from "../in/views/views";

const TZ = "America/Chicago";

function fmtParts(ms: number): Record<string, string> {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const o: Record<string, string> = {};
  for (const p of f.formatToParts(new Date(ms))) o[p.type] = p.value;
  return o;
}
function localDate(ms: number): string {
  const p = fmtParts(ms);
  return `${p.year}-${p.month}-${p.day}`;
}
function localTime(ms: number): string {
  const p = fmtParts(ms);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
function ms(s: string | undefined): number {
  if (!s) return NaN;
  const t = Date.parse(s);
  return t;
}

interface Ent { item: FolioItem; id: string; e: any; t: number }

const STATUS_RANK: Record<string, number> = { preliminary: 0, final: 1, corrected: 2 };

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", glucophage: "metformin",
  cozaar: "losartan", zestril: "lisinopril", prinivil: "lisinopril", lantus: "insulin glargine",
  toujeo: "insulin glargine", basaglar: "insulin glargine", lasix: "furosemide", norvasc: "amlodipine",
  lipitor: "atorvastatin", zocor: "simvastatin", aleve: "naproxen", advil: "ibuprofen", motrin: "ibuprofen",
  tylenol: "acetaminophen", ozempic: "semaglutide", trulicity: "dulaglutide", januvia: "sitagliptin",
};
const SALTS = new Set(["potassium", "sodium", "hydrochloride", "hcl", "sulfate", "succinate", "tartrate", "maleate",
  "besylate", "mesylate", "calcium", "phosphate", "acetate", "citrate", "hydrobromide", "fumarate", "magnesium"]);

function ingredientOf(name: string): string | undefined {
  let s = (name || "").toLowerCase().trim();
  const m = s.match(/^[^0-9(\[]*/);
  s = (m ? m[0] : s).trim();
  const words = s.split(/\s+/).filter((w) => w && !SALTS.has(w));
  const FORMS = new Set(["tablet", "tablets", "capsule", "capsules", "oral", "injection", "solution", "pen", "extended", "release", "er", "xr", "tab", "cap"]);
  const kept: string[] = [];
  for (const w of words) { if (FORMS.has(w) && kept.length) break; kept.push(w); }
  let out = kept.join(" ").trim();
  if (BRANDS[out]) out = BRANDS[out];
  return out || undefined;
}

const CLASSES: { re: RegExp; name: string; members: string[]; nonImmune?: boolean }[] = [
  { re: /sglt-?2/i, name: "SGLT2 inhibitor", members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"], nonImmune: true },
  { re: /\bace\b|ace[- ]inhibitor|angiotensin[- ]converting/i, name: "ACE inhibitor", members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril"], nonImmune: true },
  { re: /\barb\b|angiotensin receptor/i, name: "ARB", members: ["losartan", "valsartan", "irbesartan", "olmesartan", "candesartan", "telmisartan"] },
  { re: /statin/i, name: "statin", members: ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin"] },
  { re: /thiazide/i, name: "thiazide diuretic", members: ["hydrochlorothiazide", "chlorthalidone", "indapamide"] },
  { re: /nsaid|anti-inflammatory/i, name: "NSAID", members: ["naproxen", "ibuprofen", "meloxicam", "diclofenac", "celecoxib"] },
  { re: /fluoroquinolone/i, name: "fluoroquinolone", members: ["ciprofloxacin", "levofloxacin", "moxifloxacin"] },
  { re: /sulfonylurea/i, name: "sulfonylurea", members: ["glipizide", "glyburide", "glimepiride"] },
  { re: /glp-?1/i, name: "GLP-1 receptor agonist", members: ["semaglutide", "liraglutide", "dulaglutide", "exenatide"] },
];
const ACE = CLASSES[1].members;

const SENS_MEDS: Record<string, Sensitivity> = {
  sertraline: "mental-health", fluoxetine: "mental-health", citalopram: "mental-health", escitalopram: "mental-health",
  paroxetine: "mental-health", bupropion: "mental-health", venlafaxine: "mental-health", duloxetine: "mental-health",
  mirtazapine: "mental-health", trazodone: "mental-health", quetiapine: "mental-health", olanzapine: "mental-health",
  risperidone: "mental-health", aripiprazole: "mental-health", lithium: "mental-health", lamotrigine: "mental-health",
  buprenorphine: "substance-use", naltrexone: "substance-use", methadone: "substance-use",
};

function normLabel(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function parseNumber(v: string): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  const m = (v || "").trim().match(/^(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!isFinite(value)) return undefined;
  let c = m[1] as any;
  if (c === "≤") c = "<=";
  if (c === "≥") c = ">=";
  return c ? { value, comparator: c } : { value };
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    run(items || [], asOf, rows);
  } catch (_e) {
    // return what we have
  }
  return rows;
}

function run(all: FolioItem[], asOf: string, rows: ViewRows): void {
  // scope
  const inScope = all.filter((it) => {
    const t = ms(it.recorded);
    return isFinite(t) && localDate(t) <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const id of it.supersedes || []) dead.add(it.issuer + "|" + id);
    for (const id of it.retracts || []) dead.add(it.issuer + "|" + id);
  }
  const key = (it: FolioItem) => ms(it.recorded);
  const cur = inScope
    .filter((it) => !dead.has(it.issuer + "|" + it.id))
    .sort((a, b) => key(a) - key(b) || ms(a.recorded) - ms(b.recorded) || (a.id < b.id ? -1 : 1));

  const ents: Ent[] = [];
  for (const item of cur) {
    const p = item.payload || {};
    for (const id of Object.keys(p)) {
      const e = p[id];
      if (e && typeof e === "object" && typeof e.type === "string") ents.push({ item, id, e, t: key(item) });
    }
  }
  const ofType = (ty: string, within?: FolioItem) =>
    ents.filter((x) => x.e.type === ty && (!within || x.item === within));

  const snapshotItem = [...cur].reverse().find((it) => Object.values(it.payload || {}).some((e: any) => e && e.type === "encounter"));

  medications(cur, ofType, snapshotItem, rows);
  problemsAndAllergies(cur, ents, ofType, snapshotItem, rows);
  labs(ents, rows);
  vitals(cur, ofType, rows);
}

// ───────────────────────── medications
function parseDose(text: string): { value: number; unit: "mg" | "mcg" | "units" | "mL" | "tablet" } | undefined {
  const m = (text || "").toLowerCase().match(/^\s*(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|units?|unt|\[iu\]|iu|ml|g|tablets?|tabs?|capsules?|caps?)\b/);
  if (!m) return undefined;
  const v = Number(m[1]);
  const u = m[2];
  if (u === "mg") return { value: v, unit: "mg" };
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u === "mcg" || u === "µg" || u === "ug") return { value: v, unit: "mcg" };
  if (u === "ml") return { value: v, unit: "mL" };
  if (/^(unit|units|unt|\[iu\]|iu)$/.test(u)) return { value: v, unit: "units" };
  return { value: v, unit: "tablet" };
}
function parseFreq(sig: string): MedicationRow["frequency"] | undefined {
  const s = (sig || "").toLowerCase();
  if (!s) return undefined;
  if (/\bprn\b|as needed/.test(s)) return "PRN";
  if (/\bqhs\b|bedtime|at night|\bhs\b/.test(s)) return "QHS";
  if (/\bbid\b|twice|2 times|two times|\bq12h\b/.test(s)) return "BID";
  if (/\btid\b|three times|3 times|\bq8h\b/.test(s)) return "TID";
  if (/weekly|once a week|\bqw\b|every week/.test(s)) return "QW";
  if (/\bdaily\b|\bqd\b|once a day|every day|\bqam\b|every morning|once daily|\bod\b/.test(s)) return "QD";
  return "other";
}

function medications(cur: FolioItem[], ofType: (t: string, w?: FolioItem) => Ent[], snap: FolioItem | undefined, rows: ViewRows) {
  if (!snap) return;
  const lines = ofType("home_med", snap);
  // snapshots in order, for status_since chain
  const snaps = cur.filter((it) => Object.values(it.payload || {}).some((e: any) => e && e.type === "home_med"));
  const byIng = new Map<string, Ent>();
  for (const l of lines) {
    const ing = l.e.rxnorm_ingredient ? "rx:" + l.e.rxnorm_ingredient : "n:" + (ingredientOf(l.e.drug_name) || normLabel(l.e.drug_name));
    byIng.set(ing, l);
  }
  for (const [k, l] of byIng) {
    const e = l.e;
    const st = e.status as string;
    const status: MedicationRow["status"] =
      st === "held" ? "held" : st === "stopped" ? "stopped" : st === "not_reconciled" ? "unknown" : "active";
    const ingredient = ingredientOf(e.drug_name);
    const ev: Evidence = [{ item_id: l.item.id, entry_id: l.id }];
    let since: string | undefined;
    if (status === "held" || status === "stopped" || st === "new") {
      // walk back through earlier snapshots of the same stay with the same status
      const idx = snaps.indexOf(snap);
      let first: FolioItem = snap;
      for (let i = idx - 1; i >= 0; i--) {
        const prev = Object.entries(snaps[i].payload).find(([, pe]: [string, any]) =>
          pe && pe.type === "home_med" &&
          (k.startsWith("rx:") ? "rx:" + pe.rxnorm_ingredient === k : "n:" + (ingredientOf(pe.drug_name) || normLabel(pe.drug_name)) === k));
        if (!prev || (prev[1] as any).status !== st) break;
        if (encId(snaps[i]) !== encId(snap)) break;
        first = snaps[i];
        ev.push({ item_id: snaps[i].id, entry_id: prev[0] });
      }
      const t = ms(first.effective);
      since = isFinite(t) ? localDate(t) : undefined;
    }
    const row: MedicationRow = {
      drug_name: e.drug_name,
      status,
      patient_reported: false,
      evidence: ev,
    };
    if (ingredient) row.ingredient = ingredient;
    if (e.rxnorm_ingredient) row.rxnorm_ingredient = String(e.rxnorm_ingredient);
    if (since) row.status_since = since;
    const dose = parseDose(e.dose_text);
    if (dose) row.dose = dose;
    const fr = parseFreq(e.sig);
    if (fr) row.frequency = fr;
    if (status === "stopped" || status === "held") {
      if (e.instructions) row.status_reason_text = e.instructions;
    }
    if (status === "stopped" && e.instructions && /side effect|adverse|reaction|allerg/i.test(e.instructions)) row.stop_reason = "adverse_reaction";
    if (ingredient && SENS_MEDS[ingredient]) row.sensitivity = [SENS_MEDS[ingredient]];
    rows.medications.push(row);
  }
}
function encId(it: FolioItem): string {
  for (const e of Object.values(it.payload || {}) as any[]) if (e && e.type === "encounter") return e.encounter_id;
  return "";
}

// ───────────────────────── problems & allergies
function ckdStage(text: string, icd?: string): ProblemRow["ckd_stage"] | undefined {
  const i = (icd || "").toUpperCase();
  const map: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
  if (map[i]) return map[i];
  const m = (text || "").toLowerCase().match(/(?:stage|g)\s*(1|2|3a|3b|4|5)\b/);
  if (m) return ("G" + m[1]) as any;
  return undefined;
}
function isCkd(label: string, icd?: string): boolean {
  return /^N18\./i.test(icd || "") || /chronic kidney|\bckd\b/i.test(label || "");
}
function partialOnset(t: string | undefined): ProblemRow["onset"] {
  if (!t) return undefined;
  const s = t.trim();
  let m = s.match(/^(?:since |in |~)?((?:19|20)\d{2})$/i);
  if (m) return { value: m[1], precision: "year" };
  m = s.match(/^((?:19|20)\d{2})-(\d{2})$/);
  if (m) return { value: s, precision: "month" };
  m = s.match(/^((?:19|20)\d{2})-(\d{2})-(\d{2})$/);
  if (m) return { value: s, precision: "day" };
  return undefined;
}

function classifyReaction(text: string | undefined, severity?: string): { type: AllergyIntoleranceRow["reaction_type"]; known: boolean } {
  const s = (text || "").toLowerCase();
  if (/angioedema|anaphyl|hives|urticaria|rash|swelling|bronchospasm|wheez|itch|pruritus|throat|stevens|sjs|dyspnea|shortness of breath/.test(s)) return { type: "hypersensitivity", known: true };
  if (/ketoacidosis|dka|lactic acidosis|hyperkalemia|hepatotox|liver|renal failure|kidney injury|rhabdo|bleed|pancreatitis|arrhythm/.test(s)) return { type: "serious_adverse_event", known: true };
  if (/cough|nausea|vomit|diarrhea|gi upset|stomach|myalgia|muscle|headache|dizz|constipation|fatigue|drowsy|flush|edema of (?:the )?(?:ankle|feet)/.test(s)) return { type: "side_effect", known: true };
  if (severity === "severe") return { type: "hypersensitivity", known: false };
  return { type: "side_effect", known: false };
}

function problemsAndAllergies(cur: FolioItem[], ents: Ent[], ofType: (t: string, w?: FolioItem) => Ent[], snap: FolioItem | undefined, rows: ViewRows) {
  // gather condition entries
  interface C { ent: Ent; label: string; icd?: string; dx?: string; status: string; hist: boolean }
  const cs: C[] = [];
  for (const x of ents) {
    if (x.e.type === "diagnosis") {
      cs.push({ ent: x, label: x.e.label || "", icd: x.e.icd10cm, dx: x.e.riverside_dx?.code, status: x.e.status, hist: false });
    } else if (x.e.type === "history") {
      cs.push({ ent: x, label: x.e.condition || "", icd: x.e.icd10cm, status: "active", hist: true });
    }
  }
  const parent = cs.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < cs.length; i++) {
    for (let j = i + 1; j < cs.length; j++) {
      const a = cs[i], b = cs[j];
      let same = false;
      if (a.dx && b.dx && a.dx !== b.dx) same = false;
      else if (normLabel(a.label) && normLabel(a.label) === normLabel(b.label)) same = true;
      else if (a.icd && a.icd === b.icd) same = true;
      else if (isCkd(a.label, a.icd) && isCkd(b.label, b.icd)) same = true;
      if (same) parent[find(i)] = find(j);
    }
  }
  const groups = new Map<number, C[]>();
  cs.forEach((c, i) => { const r = find(i); if (!groups.has(r)) groups.set(r, []); groups.get(r)!.push(c); });

  const drugAllergies: AllergyIntoleranceRow[] = [];

  for (const g of groups.values()) {
    g.sort((a, b) => a.ent.t - b.ent.t || (a.hist === b.hist ? 0 : a.hist ? -1 : 1));
    // drug-caused diagnoses (any non-working, non-ruled-out entry)
    for (const c of g) {
      if (c.hist || c.status === "ruled_out" || c.status === "working") continue;
      const d = drugCaused(c, ofType);
      if (d) drugAllergies.push(d);
    }
    // effective latest entry
    let latest: C | undefined;
    for (let i = g.length - 1; i >= 0; i--) {
      if (g[i].status === "working") continue;
      latest = g[i];
      break;
    }
    if (!latest || latest.status === "ruled_out") continue;
    const adverseOnly = !latest.hist && isAdverseOnly(latest);
    if (adverseOnly) continue;
    const row: ProblemRow = {
      condition: latest.label,
      status: latest.status === "resolved" ? "resolved" : "active",
      evidence: [],
    };
    const lastIcd = [...g].reverse().find((c) => c.icd && c.status !== "working" && c.status !== "ruled_out");
    if (lastIcd?.icd) row.icd10cm = lastIcd.icd;
    const on = [...g].reverse().find((c) => c.hist && partialOnset((c.ent.e as any).onset_text));
    if (on) row.onset = partialOnset((on.ent.e as any).onset_text);
    if (g.some((c) => isCkd(c.label, c.icd))) {
      for (let i = g.length - 1; i >= 0; i--) {
        if (g[i].status === "working" || g[i].status === "ruled_out") continue;
        const st = ckdStage(g[i].label, g[i].icd);
        if (st) { row.ckd_stage = st; break; }
      }
      for (let i = g.length - 1; i >= 0; i--) {
        const m = g[i].label.match(/\bA([123])\b/);
        if (m) { row.albuminuria = ("A" + m[1]) as any; break; }
      }
    }
    const seen = new Set<string>();
    for (const c of [latest, ...[...g].reverse()]) {
      if (c.status === "working" || c.status === "ruled_out") continue;
      const k = c.ent.item.id + "|" + c.ent.id;
      if (seen.has(k)) continue;
      seen.add(k);
      row.evidence.push({ item_id: c.ent.item.id, entry_id: c.ent.id });
    }
    rows.problems.push(row);
  }

  // allergy list from the latest snapshot
  const listed = snap ? ofType("allergy", snap) : [];
  const out = new Map<string, AllergyIntoleranceRow>();
  for (const a of listed) {
    const sub = String(a.e.substance || "").trim();
    if (!sub || /^(nkda|nka|no known)/i.test(sub)) continue;
    const lower = sub.toLowerCase();
    const cl = classifyReaction(a.e.reaction, a.e.severity);
    const isAce = ACE.includes(lower);
    const row: AllergyIntoleranceRow = {
      substance: lower,
      reaction_type: cl.type,
      mechanism: isAce && /cough|angioedema/i.test(a.e.reaction || "") ? "non_immune" : "unknown",
      criticality: a.e.severity === "mild" ? "low" : a.e.severity === "severe" ? "high" : "unknown",
      evidence: [{ item_id: a.item.id, entry_id: a.id }],
    };
    if (a.e.rxnorm_ingredient) row.rxnorm_ingredient = String(a.e.rxnorm_ingredient);
    if (a.e.reaction) row.reaction = a.e.reaction;
    out.set(lower, row);
  }
  for (const d of drugAllergies) {
    const ex = out.get(d.substance);
    if (!ex) { out.set(d.substance, d); continue; }
    // merge: the diagnosis describes serious harm
    ex.evidence.push(...d.evidence);
    if (d.reaction_type === "serious_adverse_event") {
      ex.reaction_type = "serious_adverse_event";
      ex.mechanism = d.mechanism;
      ex.criticality = "high";
      ex.reaction = [ex.reaction, d.reaction].filter(Boolean).join("; ") || undefined;
      if (!ex.reaction) delete ex.reaction;
    }
    if (!ex.rxnorm_ingredient && d.rxnorm_ingredient) ex.rxnorm_ingredient = d.rxnorm_ingredient;
  }
  rows.allergies.push(...out.values());
}

function isTCode(icd?: string): boolean {
  return /^T(3[6-9]|4\d|50)\./i.test(icd || "");
}
function isAdverseOnly(c: { label: string; icd?: string }): boolean {
  return isTCode(c.icd) && /^(adverse effect|poisoning|underdosing|drug)/i.test(c.label.trim());
}

function drugCaused(c: { ent: Ent; label: string; icd?: string }, ofType: (t: string, w?: FolioItem) => Ent[]): AllergyIntoleranceRow | undefined {
  const label = c.label;
  const attributed = isTCode(c.icd) || /-\s*associated|\bassociated with\b|induced|\bdue to\b|adverse effect of|caused by|secondary to .*(inhibitor|drug)/i.test(label);
  if (!attributed) return undefined;
  const meds = [...ofType("home_med", c.ent.item), ...ofType("inpatient_med", c.ent.item)];
  const medNames = new Set<string>();
  for (const m of meds) { const n = ingredientOf(m.e.drug_name); if (n) medNames.add(n); }

  let substance: string | undefined;
  let rx: string | undefined;
  let nonImmune = false;
  const low = label.toLowerCase();
  // specific drug named in label
  const named = [...Object.values(BRANDS), ...CLASSES.flatMap((k) => k.members), ...medNames]
    .filter((n) => new RegExp("\\b" + n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b").test(low));
  if (named.length) substance = named[0];
  else {
    const cls = CLASSES.find((k) => k.re.test(label));
    if (cls) {
      nonImmune = !!cls.nonImmune;
      const onList = cls.members.filter((m) => medNames.has(m));
      const homeOnly = new Set<string>();
      for (const m of ofType("home_med", c.ent.item)) { const n = ingredientOf(m.e.drug_name); if (n && cls.members.includes(n)) homeOnly.add(n); }
      const pool = homeOnly.size ? [...homeOnly] : onList;
      substance = pool.length === 1 ? pool[0] : cls.name;
    } else {
      const m = label.match(/([A-Za-z0-9][A-Za-z0-9 ]*?)[- ](?:associated|induced)/);
      if (m) substance = m[1].trim().split(/\s+/).slice(-2).join(" ");
      const m2 = label.match(/adverse effect of (.+)$/i);
      if (!substance && m2) substance = m2[1].trim();
    }
  }
  if (!substance) return undefined;
  substance = substance.toLowerCase() === "sglt2 inhibitor" ? "SGLT2 inhibitor" : substance.toLowerCase() === "ace inhibitor" ? "ACE inhibitor" : substance;
  if (named.length || meds.length) {
    const mm = meds.find((m) => ingredientOf(m.e.drug_name) === substance);
    if (mm?.e.rxnorm_ingredient) rx = String(mm.e.rxnorm_ingredient);
  }
  const cl = classifyReaction(label, "severe");
  let type = cl.known ? cl.type : "serious_adverse_event";
  if (isAdverseOnly(c) && !cl.known) type = "serious_adverse_event";
  if (ACE.includes(substance) || /ace inhibitor/i.test(substance)) { if (/angioedema|cough/i.test(label)) nonImmune = true; }
  if (/ketoacidosis/i.test(label)) nonImmune = true;
  const row: AllergyIntoleranceRow = {
    substance,
    reaction_type: type,
    mechanism: nonImmune ? "non_immune" : "unknown",
    criticality: type === "side_effect" ? "unknown" : "high",
    evidence: [{ item_id: c.ent.item.id, entry_id: c.ent.id }],
  };
  if (rx) row.rxnorm_ingredient = rx;
  if (!isAdverseOnly(c)) row.reaction = label;
  return row;
}

// ───────────────────────── labs
interface LabSpec { analyte: Analyte; unit: string }
const BY_CODE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", HCO3: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase", TROP: "troponin", TNI: "troponin",
  CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl",
};
const BY_LOINC: Record<string, Analyte> = {
  "2160-0": "creatinine", "2951-2": "sodium", "2823-3": "potassium", "2075-0": "chloride", "2028-9": "bicarbonate",
  "33037-3": "anion_gap", "3094-0": "bun", "2345-7": "glucose", "4548-4": "a1c", "4544-3": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin", "20565-8": "bicarbonate", "2744-1": "ph", "11558-4": "ph", "2019-8": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr",
};
const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function analyteOf(t: { local_code?: string; loinc?: string; name?: string }): Analyte | undefined {
  if (t.loinc && BY_LOINC[t.loinc]) return BY_LOINC[t.loinc];
  const c = (t.local_code || "").toUpperCase();
  if (BY_CODE[c]) return BY_CODE[c];
  const n = (t.name || "").toLowerCase();
  if (/egfr|glomerular filtration/.test(n)) return "egfr";
  if (/beta[- ]?hydroxybutyrate|\bbhb\b/.test(n)) return "bhb";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/creatinine/.test(n) && !/urine|ratio|clearance/.test(n)) return "creatinine";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/^potassium/.test(n)) return "potassium";
  if (/^sodium/.test(n)) return "sodium";
  if (/^chloride/.test(n)) return "chloride";
  if (/bicarbonate|total co2|carbon dioxide, total/.test(n)) return "bicarbonate";
  if (/^glucose/.test(n)) return "glucose";
  if (/a1c|glycated|glycohemoglobin/.test(n)) return "a1c";
  if (/albumin.*creatinine/.test(n)) return "uacr";
  if (/platelet/.test(n)) return "platelets";
  if (/white blood|^wbc/.test(n)) return "wbc";
  if (/hemoglobin$|^hemoglobin\b/.test(n) && !/a1c/.test(n)) return "hemoglobin";
  if (/^ph\b|blood gas ph/.test(n)) return "ph";
  if (/pco2|carbon dioxide partial/.test(n)) return "pco2";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n)) return "troponin";
  if (/hdl/.test(n)) return "hdl";
  if (/ldl/.test(n)) return "ldl";
  if (/triglycerid/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n)) return "cholesterol";
  return undefined;
}

function convert(a: Analyte, v: number, unit: string | undefined): number | undefined {
  const u = (unit || "").trim().toLowerCase().replace(/µ/g, "u");
  const std = UNITS[a].toLowerCase();
  if (u === std || (!u && (a === "ph"))) return v;
  switch (a) {
    case "creatinine": if (u === "umol/l") return v / 88.4; break;
    case "glucose": if (u === "mmol/l") return v * 18.016; break;
    case "bun": if (u === "mmol/l") return v * 2.801; break;
    case "hemoglobin": if (u === "g/l") return v / 10; break;
    case "platelets": case "wbc":
      if (u === "/ul" || u === "cells/ul" || u === "1/ul") return v / 1000;
      if (u === "10*9/l" || u === "10^9/l" || u === "10*3/ul" || u === "k/ul" || u === "x10e3/ul" || u === "10e3/ul" || u === "10^3/ul") return v;
      break;
    case "a1c": if (u === "mmol/mol") return v * 0.09148 + 2.152; break;
    case "uacr": if (u === "mg/mmol") return v * 8.84; if (u === "mcg/mg" || u === "ug/mg") return v; break;
    case "troponin": if (u === "ng/l" || u === "pg/ml") return v / 1000; break;
    case "cholesterol": case "ldl": case "hdl": if (u === "mmol/l") return v * 38.67; break;
    case "triglycerides": if (u === "mmol/l") return v * 88.57; break;
    case "bhb": if (u === "mg/dl") return v / 10.4; break;
    case "pco2": if (u === "kpa") return v * 7.50062; break;
  }
  return undefined;
}

function eqOf(name: string, code: string): LabResultRow["egfr_equation"] {
  const n = (name || "").toLowerCase();
  if (/2021/.test(n)) return "ckd-epi-2021";
  if (/2009/.test(n)) return "ckd-epi-2009";
  if (/mdrd/.test(n)) return "mdrd";
  if (/ckd-epi/.test(n)) return "unknown";
  return "unknown";
}
function isRaceVariant(name: string, code: string): boolean {
  const n = (name || "").toLowerCase() + " " + (code || "").toLowerCase();
  if (/race-free|without race|no race|non-?african|non-?black|not african|not black/.test(n)) return false;
  return /african|\bblack\b|\baa\b|_aa\b|with race|race coef|race-adjusted/.test(n);
}

function labs(ents: Ent[], rows: ViewRows) {
  interface L { ent: Ent; rv: any; acc: string; collected: string; status: string; panelId?: string }
  const best = new Map<string, L>();
  const consider = (ent: Ent, rv: any, acc: string, collected: string, status: string, panelId?: string) => {
    if (!rv || !rv.test) return;
    const k = acc + "|" + rv.test.local_code + (isRaceVariant(rv.test.name, rv.test.local_code) ? "|race" : "") + (rv.test.name && /egfr/i.test(rv.test.name + rv.test.local_code) ? "|" + (rv.test.local_code) : "");
    const prev = best.get(k);
    const r = STATUS_RANK[status] ?? 0;
    if (!prev || r >= (STATUS_RANK[prev.status] ?? 0)) best.set(k, { ent, rv, acc, collected, status, panelId });
  };
  for (const x of ents) {
    if (x.e.type === "result") consider(x, x.e, x.e.accession, x.e.collected, x.e.status);
    else if (x.e.type === "panel" && Array.isArray(x.e.components)) {
      for (const c of x.e.components) consider(x, c, x.e.accession, x.e.collected, x.e.status, x.id);
    }
  }
  for (const l of best.values()) {
    const rv = l.rv;
    const a = analyteOf(rv.test);
    if (!a) continue;
    if (a === "egfr" && isRaceVariant(rv.test.name, rv.test.local_code)) continue;
    const num = parseNumber(String(rv.value));
    if (!num) continue;
    const v = convert(a, num.value, rv.unit);
    if (v === undefined) continue;
    const t = ms(l.collected);
    if (!isFinite(t)) continue;
    const row: LabResultRow = {
      analyte: a,
      value: Math.round(v * 1e6) / 1e6,
      unit: UNITS[a],
      collected: new Date(t).toISOString().replace(".000Z", "Z"),
      status: l.status === "preliminary" ? "preliminary" : "final",
      evidence: [{ item_id: l.ent.item.id, entry_id: l.ent.id }],
    };
    if (num.comparator && v === num.value) row.comparator = num.comparator;
    if (a === "egfr") row.egfr_equation = eqOf(rv.test.name, rv.test.local_code);
    if (rv.test.loinc) row.loinc = rv.test.loinc;
    rows.labs.push(row);
  }
  rows.labs.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
}

// ───────────────────────── vitals
function vitals(cur: FolioItem[], ofType: (t: string, w?: FolioItem) => Ent[], rows: ViewRows) {
  const seen = new Map<number, VitalRow>();
  const all = ofType("vitals");
  for (const x of all) {
    const e = x.e;
    const t = ms(e.taken);
    if (!isFinite(t)) continue;
    const t0 = Math.floor(t / 60000) * 60000;
    const ex = seen.get(t0);
    if (ex) {
      if (!ex.evidence.some((v) => v.item_id === x.item.id && v.entry_id === x.id)) ex.evidence.push({ item_id: x.item.id, entry_id: x.id });
      if (ex.systolic_mmhg === undefined && e.bp) { ex.systolic_mmhg = e.bp.systolic_mmhg; ex.diastolic_mmhg = e.bp.diastolic_mmhg; }
      if (ex.pulse_bpm === undefined && typeof e.heart_rate_bpm === "number") ex.pulse_bpm = e.heart_rate_bpm;
      if (ex.weight_kg === undefined && typeof e.weight_kg === "number") ex.weight_kg = Math.round(e.weight_kg * 10) / 10;
      continue;
    }
    const row: VitalRow = { setting: "hospital", local_time: localTime(t), evidence: [{ item_id: x.item.id, entry_id: x.id }] };
    if (e.bp && typeof e.bp.systolic_mmhg === "number") { row.systolic_mmhg = e.bp.systolic_mmhg; row.diastolic_mmhg = e.bp.diastolic_mmhg; }
    if (typeof e.heart_rate_bpm === "number") row.pulse_bpm = e.heart_rate_bpm;
    if (typeof e.weight_kg === "number") row.weight_kg = Math.round(e.weight_kg * 10) / 10;
    seen.set(t0, row);
  }
  const list = [...seen.entries()].sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  rows.vitals.push(...list.filter((r) => r.systolic_mmhg !== undefined || r.pulse_bpm !== undefined || r.weight_kg !== undefined));
}
