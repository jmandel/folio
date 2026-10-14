import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Analyte, Evidence, Sensitivity, PartialDate,
} from "../in/views/views";

type Doc = { item: FolioItem; kind: string; enc: any; entries: [string, any][] };

// ───────────── time helpers ─────────────
const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});
function localParts(iso: string | undefined): { date: string; time: string } | undefined {
  if (!iso) return undefined;
  const ms = Date.parse(iso);
  if (isNaN(ms)) return undefined;
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}
function ms(iso: string | undefined): number {
  const v = iso ? Date.parse(iso) : NaN;
  return isNaN(v) ? 0 : v;
}

// ───────────── text helpers ─────────────
const SALTS = new Set(["potassium", "sodium", "hydrochloride", "hcl", "tartrate", "succinate", "maleate", "mesylate",
  "besylate", "sulfate", "calcium", "citrate", "phosphate", "acetate", "fumarate", "bromide", "magnesium", "hydrobromide"]);
const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", lantus: "insulin glargine",
  glucophage: "metformin", cozaar: "losartan", zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine",
  lipitor: "atorvastatin", zocor: "simvastatin", lasix: "furosemide", aleve: "naproxen", advil: "ibuprofen",
  motrin: "ibuprofen", tylenol: "acetaminophen", ozempic: "semaglutide", januvia: "sitagliptin",
};
function ingredientOf(drugName: string): string | undefined {
  let s = (drugName || "").toLowerCase().replace(/\(.*?\)/g, " ").trim();
  if (!s) return undefined;
  const toks = s.split(/\s+/);
  const out: string[] = [];
  for (const t of toks) {
    if (/\d/.test(t)) break;
    out.push(t);
  }
  let words = out.filter((w) => !["tablet", "tablets", "capsule", "capsules", "tab", "cap", "oral", "injection", "solution", "er", "xr", "sr", "dr"].includes(w));
  if (words.length === 0) return undefined;
  if (words.length === 1 && BRANDS[words[0]]) return BRANDS[words[0]];
  if (words.some((w) => w.includes("/") || w === "and" || w === "with")) return undefined;
  if (words.length > 1) {
    const kept = words.filter((w) => !SALTS.has(w));
    if (kept.length > 0) words = kept;
  }
  const r = words.join(" ").trim();
  return BRANDS[r] ?? (r || undefined);
}
const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// ───────────── class / drug knowledge ─────────────
const CLASSES: { re: RegExp; members: string[] }[] = [
  { re: /sglt-?2/i, members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"] },
  { re: /ace[- ]?inhibitor|\bace-i\b/i, members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "perindopril", "fosinopril", "trandolapril"] },
  { re: /\barbs?\b|angiotensin receptor/i, members: ["losartan", "valsartan", "irbesartan", "candesartan", "olmesartan", "telmisartan"] },
  { re: /statin/i, members: ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin", "pitavastatin"] },
  { re: /\bnsaids?\b|anti-?inflammatory/i, members: ["ibuprofen", "naproxen", "diclofenac", "meloxicam", "celecoxib", "ketorolac"] },
  { re: /thiazide/i, members: ["hydrochlorothiazide", "chlorthalidone", "indapamide"] },
  { re: /glp-?1/i, members: ["semaglutide", "liraglutide", "dulaglutide", "exenatide"] },
  { re: /sulfonylurea/i, members: ["glipizide", "glyburide", "glimepiride"] },
  { re: /beta[- ]?blocker/i, members: ["metoprolol", "atenolol", "carvedilol", "propranolol", "bisoprolol"] },
  { re: /fluoroquinolone/i, members: ["ciprofloxacin", "levofloxacin", "moxifloxacin"] },
];
const ACEI = CLASSES[1].members;
const NON_IMMUNE_SUBSTANCES = new Set([...ACEI, "empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"]);

// ───────────── sensitivity ─────────────
function sensitivityOf(text: string, icd?: string): Sensitivity[] | undefined {
  const t = (text || "").toLowerCase();
  const c = (icd || "").toUpperCase();
  const out: Sensitivity[] = [];
  if (/^F1[0-9]/.test(c) || /alcohol use|opioid use|substance use|cannabis use|stimulant use|nicotine dependence|tobacco use|alcohol dependence|drug (abuse|dependence)|methadone|buprenorphine|naltrexone/.test(t)) out.push("substance-use");
  if ((/^F/.test(c) && !/^F1[0-9]/.test(c)) || /depress|anxiety|bipolar|schizo|ptsd|psychosis|suicid|adhd|panic|mental|insomnia disorder|sertraline|fluoxetine|escitalopram|citalopram|bupropion|quetiapine|olanzapine|risperidone|aripiprazole|lithium|lamotrigine|venlafaxine|duloxetine|paroxetine|trazodone|mirtazapine|buspirone|alprazolam|lorazepam|clonazepam|diazepam/.test(t)) out.push("mental-health");
  if (/^(B20|Z21|B97\.35|A5\d|A6\d|A74|A64)/.test(c) || /\bhiv\b|syphilis|chlamydia|gonorrh|herpes simplex|\bsti\b|hepatitis c|emtricitabine|tenofovir|dolutegravir/.test(t)) out.push("hiv-sti");
  if (/^(O\d|Z3[0-9]|Z30)/.test(c) || /pregnan|contracepti|infertil|menopaus|prenatal|estradiol|levonorgestrel|norethindrone/.test(t)) out.push("sexual-reproductive-health");
  if (/genetic|hereditary|brca|cystic fibrosis|sickle cell|huntington|down syndrome|marfan/.test(t)) out.push("genetic");
  return out.length ? out : undefined;
}

// ───────────── main ─────────────
export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    return run(items || [], asOf);
  } catch {
    return empty;
  }
}

function run(all: FolioItem[], asOf: string): ViewRows {
  // scope
  const inScope = all.filter((it) => {
    const lp = localParts(it.recorded);
    return lp ? lp.date <= asOf : false;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const id of it.supersedes ?? []) dead.add(it.issuer + "|" + id);
    for (const id of it.retracts ?? []) dead.add(it.issuer + "|" + id);
  }
  const current = inScope.filter((it) => !dead.has(it.issuer + "|" + it.id));

  const docs: Doc[] = current.map((item) => {
    const entries = Object.entries(item.payload ?? {}).filter(([, v]) => v && typeof v === "object") as [string, any][];
    const enc = entries.map((e) => e[1]).find((v) => v.type === "encounter") ?? {};
    return { item, kind: enc.document_kind ?? "", enc, entries };
  });
  const byRecorded = (a: Doc, b: Doc) =>
    ms(a.item.recorded) - ms(b.item.recorded) || ms(a.item.effective) - ms(b.item.effective) || (a.item.id < b.item.id ? -1 : 1);
  docs.sort(byRecorded);

  return {
    medications: medications(docs),
    problems: problems(docs),
    allergies: allergies(docs),
    labs: labs(docs),
    vitals: vitals(docs),
  };
}

// ───────────── medications ─────────────
function docDate(d: Doc): string | undefined {
  if (d.kind === "discharge_summary" && d.enc.discharged) return localParts(d.enc.discharged)?.date;
  return localParts(d.item.effective)?.date ?? (/^\d{4}-\d{2}-\d{2}/.test(d.item.effective) ? d.item.effective.slice(0, 10) : undefined);
}
function medKey(m: any): string {
  return (m.rxnorm_ingredient ? "rx:" + m.rxnorm_ingredient : "nm:" + (ingredientOf(m.drug_name) ?? norm(m.drug_name))) ;
}
function mapStatus(s: string): "active" | "held" | "stopped" | "unknown" {
  switch (s) {
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
    default: return "unknown";
  }
}
function parseDose(m: any): MedicationRow["dose"] | undefined {
  const t = String(m.dose_text ?? "").toLowerCase().trim();
  if (/\d\s*(-|to|or)\s*\d/.test(t)) return undefined;
  const r = t.match(/^(\d+(?:\.\d+)?)\s*([a-z\[\]µ]*)/);
  if (!r) return undefined;
  const v = parseFloat(r[1]);
  if (!isFinite(v)) return undefined;
  const u = r[2];
  if (u === "mg") return { value: v, unit: "mg" };
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u === "mcg" || u === "µg" || u === "ug") return { value: v, unit: "mcg" };
  if (["unit", "units", "u", "iu", "[iu]", "unt"].includes(u)) return { value: v, unit: "units" };
  if (u === "ml") return { value: v, unit: "mL" };
  if (/^(tab|tabs|tablet|tablets|cap|caps|capsule|capsules)$/.test(u)) {
    const s = String(m.drug_name ?? "").toLowerCase().match(/(\d+(?:\.\d+)?)\s*(mg|mcg)\b/);
    if (s) return { value: Math.round(v * parseFloat(s[1]) * 1000) / 1000, unit: s[2] as "mg" | "mcg" };
    return { value: v, unit: "tablet" };
  }
  return undefined;
}
function parseFreq(sig: string): MedicationRow["frequency"] | undefined {
  const s = String(sig ?? "").toLowerCase();
  if (!s) return undefined;
  if (/\bprn\b|as needed/.test(s)) return "PRN";
  if (/\bqhs\b|bedtime|at night|\bhs\b|nightly/.test(s)) return "QHS";
  if (/\bbid\b|twice|2 times|two times|b\.i\.d/.test(s)) return "BID";
  if (/\btid\b|three times|3 times|t\.i\.d/.test(s)) return "TID";
  if (/weekly|once a week|\bqw\b|every week|per week/.test(s)) return "QW";
  if (/daily|\bqd\b|once a day|every day|every morning|\bqam\b|each morning|\bq24h\b|once\b/.test(s)) return "QD";
  return "other";
}
function stopReason(text: string): MedicationRow["stop_reason"] | undefined {
  const t = text.toLowerCase();
  if (/cough|angioedema|side effect|adverse|reaction|rash|intoleran|ketoacidosis/.test(t)) return "adverse_reaction";
  if (/ineffective|not working|inadequate control/.test(t)) return "ineffective";
  if (/replaced|switched|changed to|instead of/.test(t)) return "therapy_changed";
  if (/course (complete|finished)|completed/.test(t)) return "course_complete";
  if (/patient (declin|request|prefer|chose)|declined/.test(t)) return "patient_choice";
  return undefined;
}

function pickListDoc(docs: Doc[], type: string): Doc | undefined {
  const withType = docs.filter((d) => d.entries.some((e) => e[1].type === type));
  if (!withType.length) return undefined;
  const last = withType[withType.length - 1];
  const encId = last.enc.encounter_id;
  if (encId) {
    const dcs = withType.filter((d) => d.enc.encounter_id === encId && d.kind === "discharge_summary");
    if (dcs.length) return dcs[dcs.length - 1];
  }
  return last;
}

function medications(docs: Doc[]): MedicationRow[] {
  const snap = pickListDoc(docs, "home_med");
  if (!snap) return [];
  const rows = new Map<string, MedicationRow>();
  const order: string[] = [];
  const earlier = docs.filter((d) => d !== snap && byTime(d, snap) < 0);
  for (const [eid, m] of snap.entries) {
    if (m.type !== "home_med" || !m.drug_name) continue;
    const key = medKey(m);
    const status = mapStatus(m.status);
    const sameLine = (x: any) => x.type === "home_med" && medKey(x) === key && String(x.dose_text ?? "") === String(m.dose_text ?? "");
    // walk back through earlier snapshots
    const evidence: Evidence = [{ item_id: snap.item.id, entry_id: eid }];
    let since: string | undefined;
    let prevStatus: string | undefined;
    let chainStartDoc: Doc = snap;
    let sawDifferent = false;
    for (let i = earlier.length - 1; i >= 0; i--) {
      const d = earlier[i];
      const e = d.entries.find((x) => sameLine(x[1]));
      if (!e) {
        if (d.entries.some((x) => x[1].type === "home_med")) break; // missing from a snapshot: line restarted later
        continue;
      }
      const st = mapStatus(e[1].status);
      if (prevStatus === undefined) prevStatus = st;
      if (st !== status) { sawDifferent = true; break; }
      chainStartDoc = d;
      evidence.push({ item_id: d.item.id, entry_id: e[0] });
    }
    if (status === "held" || status === "stopped") since = docDate(chainStartDoc);
    else if (status === "active") {
      if (m.status === "new" || m.status === "changed" || (sawDifferent && (prevStatus === "held" || prevStatus === "stopped"))) since = docDate(chainStartDoc);
    }
    const row: MedicationRow = {
      drug_name: String(m.drug_name),
      status,
      patient_reported: false,
      evidence: evidence.slice(0, 1).concat(evidence.length > 1 ? evidence.slice(-1) : []),
    };
    const ing = ingredientOf(m.drug_name);
    if (ing) row.ingredient = ing;
    if (m.rxnorm_ingredient) row.rxnorm_ingredient = String(m.rxnorm_ingredient);
    if (since) row.status_since = since;
    const dose = parseDose(m);
    if (dose) row.dose = dose;
    const f = parseFreq(m.sig);
    if (f) row.frequency = f;
    if ((status === "held" || status === "stopped") && m.instructions) row.status_reason_text = String(m.instructions);
    if (status === "stopped" && m.instructions) {
      const sr = stopReason(String(m.instructions));
      if (sr) row.stop_reason = sr;
    }
    if (/\botc\b|over[- ]the[- ]counter/i.test(`${m.drug_name} ${m.sig} ${m.instructions ?? ""}`)) row.otc = true;
    const sens = sensitivityOf(`${m.drug_name}`);
    if (sens) row.sensitivity = sens;
    const rk = row.ingredient ?? key;
    if (!rows.has(rk)) order.push(rk);
    rows.set(rk, row); // later line for same ingredient wins
  }
  return order.map((k) => rows.get(k)!);
}
function byTime(a: Doc, b: Doc): number {
  return ms(a.item.recorded) - ms(b.item.recorded) || ms(a.item.effective) - ms(b.item.effective) || (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0);
}

// ───────────── problems & drug-caused diagnoses ─────────────
function ckdInfo(label: string, icd?: string): { stage?: ProblemRow["ckd_stage"]; alb?: ProblemRow["albuminuria"]; isCkd: boolean } {
  const l = label.toLowerCase();
  const c = (icd || "").toUpperCase();
  const isCkd = /chronic kidney|\bckd\b|chronic renal/.test(l) || /^N18/.test(c);
  if (!isCkd) return { isCkd };
  let stage: ProblemRow["ckd_stage"] | undefined;
  const m = l.match(/(?:stage|g)\s*([1-5])\s*([ab])?/);
  if (m) {
    const s = m[1] + (m[2] ?? "");
    if (["1", "2", "3a", "3b", "4", "5"].includes(s)) stage = ("G" + s) as ProblemRow["ckd_stage"];
    else if (s === "3") stage = undefined;
  }
  const cm: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.30": undefined, "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
  if (!stage && cm[c]) stage = cm[c];
  const a = l.match(/\ba([123])\b/);
  return { isCkd, stage, alb: a ? (("A" + a[1]) as ProblemRow["albuminuria"]) : undefined };
}

type DxEntry = { doc: Doc; eid: string; e: any; kind: "dx" | "hx" };

function isDrugCaused(e: any): boolean {
  const label = String(e.label ?? "");
  const icd = String(e.icd10cm ?? "").toUpperCase();
  return /^T(3[6-9]|4\d|50)/.test(icd) || /-\s*associated|\bassociated with\b|adverse effect|induced|due to (?:a )?\w+ (?:inhibitor|blocker)/i.test(label) && /inhibitor|blocker|statin|adverse|drug|medic|induced|-associated|[a-z]+(?:pril|sartan|gliflozin|formin|statin|olol|azide|cillin|mycin|floxacin)/i.test(label + " " + (e.riverside_dx?.name ?? ""));
}
function adverseOnly(e: any): boolean {
  const label = String(e.label ?? "");
  const icd = String(e.icd10cm ?? "").toUpperCase();
  return /^T/.test(icd) && !/ketoacidosis|angioedema|hyperkal|acidosis|rhabdo|hepatitis|pancreatitis|injury/i.test(label) || /^(adverse effect|poisoning|underdosing)/i.test(label.trim());
}

function problems(docs: Doc[]): ProblemRow[] {
  const entries: DxEntry[] = [];
  for (const d of docs) {
    for (const [eid, e] of d.entries) {
      if (e.type === "diagnosis" && e.label) entries.push({ doc: d, eid, e, kind: "dx" });
      else if (e.type === "history" && e.condition) entries.push({ doc: d, eid, e, kind: "hx" });
    }
  }
  const labelOf = (x: DxEntry) => String(x.kind === "dx" ? x.e.label : x.e.condition);
  // icd -> riverside code, when unambiguous
  const icdRs = new Map<string, Set<string>>();
  for (const x of entries) {
    if (x.kind === "dx" && x.e.icd10cm && x.e.riverside_dx?.code) {
      const s = icdRs.get(x.e.icd10cm) ?? new Set();
      s.add(x.e.riverside_dx.code);
      icdRs.set(x.e.icd10cm, s);
    }
  }
  const keyOf = (x: DxEntry): string => {
    const rs = x.kind === "dx" ? x.e.riverside_dx?.code : undefined;
    if (rs) return "rs:" + rs;
    const icd = x.e.icd10cm;
    if (icd) {
      const s = icdRs.get(icd);
      if (s && s.size === 1) return "rs:" + [...s][0];
      if (!s) return "icd:" + icd;
      return "icd:" + icd + "|" + norm(labelOf(x));
    }
    return "lb:" + norm(labelOf(x));
  };
  const groups = new Map<string, DxEntry[]>();
  for (const x of entries) {
    const k = keyOf(x);
    (groups.get(k) ?? groups.set(k, []).get(k)!).push(x);
  }
  const out: ProblemRow[] = [];
  for (const g of groups.values()) {
    const latest = g[g.length - 1];
    let status: "active" | "resolved" | undefined;
    if (latest.kind === "hx") status = "active";
    else if (latest.e.status === "active") status = "active";
    else if (latest.e.status === "resolved") status = "resolved";
    if (!status) continue; // ruled out / working
    if (latest.kind === "dx" && adverseOnly(latest.e)) continue;
    const label = labelOf(latest);
    let icd: string | undefined;
    for (let i = g.length - 1; i >= 0; i--) if (g[i].e.icd10cm) { icd = g[i].e.icd10cm; break; }
    const row: ProblemRow = { condition: label, status, evidence: [{ item_id: latest.doc.item.id, entry_id: latest.eid }] };
    if (icd) row.icd10cm = icd;
    // onset from history lines
    for (let i = g.length - 1; i >= 0; i--) {
      const t = g[i].kind === "hx" ? String(g[i].e.onset_text ?? "").trim() : "";
      const m = t.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
      if (m) {
        const v: PartialDate = m[3] ? t : m[2] ? `${m[1]}-${m[2]}` : m[1];
        row.onset = { value: v, precision: m[3] ? "day" : m[2] ? "month" : "year" };
        break;
      }
    }
    // ckd: latest entry that states a stage
    const ck = ckdInfo(label, icd);
    if (ck.isCkd) {
      for (let i = g.length - 1; i >= 0; i--) {
        const c = ckdInfo(labelOf(g[i]), g[i].e.icd10cm);
        if (c.stage) { row.ckd_stage = c.stage; break; }
      }
      for (let i = g.length - 1; i >= 0; i--) {
        const c = ckdInfo(labelOf(g[i]), g[i].e.icd10cm);
        if (c.alb) { row.albuminuria = c.alb; break; }
      }
    }
    const sens = sensitivityOf(label, icd);
    if (sens) row.sensitivity = sens;
    out.push(row);
  }
  return out;
}

// ───────────── allergies ─────────────
function reactionKind(reaction: string | undefined): AllergyIntoleranceRow["reaction_type"] {
  const r = (reaction ?? "").toLowerCase();
  if (/ketoacidosis|lactic acidosis|hyperkal|rhabdo|hepatotox|liver (injury|failure)|pancreatitis|kidney injury|bleed|agranulocyt|stevens|neutropenia|aki\b/.test(r)) return "serious_adverse_event";
  if (/hives|urticaria|rash|angioedema|swelling|anaphyl|bronchospasm|wheez|itch|pruritus|throat|dyspnea|shortness of breath|hypersens|allerg/.test(r)) return "hypersensitivity";
  if (r === "") return "hypersensitivity";
  return "side_effect";
}
function critOf(sev: string | undefined): AllergyIntoleranceRow["criticality"] {
  if (sev === "mild") return "low";
  if (sev === "severe") return "high";
  return "unknown";
}

function allergies(docs: Doc[]): AllergyIntoleranceRow[] {
  const rows: AllergyIntoleranceRow[] = [];
  const idx = new Map<string, number>();
  const add = (r: AllergyIntoleranceRow) => {
    const k = norm(r.substance);
    const i = idx.get(k);
    if (i === undefined) { idx.set(k, rows.length); rows.push(r); }
    else {
      const old = rows[i];
      const merged: AllergyIntoleranceRow = { ...old, ...r, evidence: [...r.evidence, ...old.evidence] };
      // keep the more severe criticality
      if (old.criticality === "high" || r.criticality === "high") merged.criticality = "high";
      rows[i] = merged;
    }
  };
  // list snapshot
  const snap = pickLatestWith(docs, "allergy");
  if (snap) {
    for (const [eid, a] of snap.entries) {
      if (a.type !== "allergy" || !a.substance) continue;
      const sub = String(a.substance).trim();
      if (/^(nkda|no known( drug)? allergies)$/i.test(sub)) continue;
      const lower = a.rxnorm_ingredient ? sub.toLowerCase() : sub;
      const rtype = reactionKind(a.reaction);
      const r = String(a.reaction ?? "").toLowerCase();
      const row: AllergyIntoleranceRow = {
        substance: lower,
        reaction_type: rtype,
        mechanism: ACEI.includes(lower) && /cough|angioedema/.test(r) ? "non_immune" : "unknown",
        criticality: critOf(a.severity),
        evidence: [{ item_id: snap.item.id, entry_id: eid }],
      };
      if (a.rxnorm_ingredient) row.rxnorm_ingredient = String(a.rxnorm_ingredient);
      if (a.reaction) row.reaction = String(a.reaction);
      const s = sensitivityOf(sub);
      if (s) row.sensitivity = s;
      add(row);
    }
  }
  // drug-caused diagnoses: latest entry per condition key, active/resolved only
  const latest = new Map<string, DxEntry>();
  for (const d of docs) {
    for (const [eid, e] of d.entries) {
      if (e.type !== "diagnosis" || !e.label) continue;
      if (!isDrugCaused(e)) continue;
      latest.set(String(e.riverside_dx?.code ?? e.icd10cm ?? norm(e.label)), { doc: d, eid, e, kind: "dx" });
    }
  }
  for (const x of latest.values()) {
    if (x.e.status !== "active" && x.e.status !== "resolved") continue;
    const label = String(x.e.label);
    const homeMeds = x.doc.entries.map((e) => e[1]).filter((m) => m.type === "home_med");
    const ings = homeMeds.map((m) => ({ ing: ingredientOf(m.drug_name), rx: m.rxnorm_ingredient as string | undefined })).filter((m) => m.ing) as { ing: string; rx?: string }[];
    const lowerLabel = label.toLowerCase();
    let substance: string | undefined;
    let rx: string | undefined;
    // specific drug named
    const named = ings.find((m) => new RegExp("\\b" + m.ing.replace(/[^a-z ]/g, "") + "\\b").test(lowerLabel));
    const knownNamed = CLASSES.flatMap((c) => c.members).find((n) => new RegExp("\\b" + n + "\\b").test(lowerLabel));
    if (named) { substance = named.ing; rx = named.rx; }
    else if (knownNamed) { substance = knownNamed; rx = ings.find((m) => m.ing === knownNamed)?.rx; }
    else {
      const cls = CLASSES.find((c) => c.re.test(label) || c.re.test(x.e.riverside_dx?.name ?? ""));
      if (cls) {
        const cands = ings.filter((m) => cls.members.includes(m.ing));
        const uniq = [...new Set(cands.map((c) => c.ing))];
        if (uniq.length === 1) { substance = uniq[0]; rx = cands[0].rx; }
        else {
          const m = label.match(cls.re);
          substance = classText(label, m?.[0]);
        }
      } else {
        const m = label.match(/(?:adverse effect of|associated with|induced by)\s+(.+)$/i) ?? label.match(/^(.+?)[- ]associated/i);
        if (m) substance = m[1].trim().toLowerCase();
      }
    }
    if (!substance) continue;
    const condition = adverseOnly(x.e) ? undefined : label;
    const reactionText = condition ?? label;
    const rtype = reactionKind(reactionText);
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: rtype,
      mechanism: NON_IMMUNE_SUBSTANCES.has(substance) || /sglt-?2|ace[- ]?inhibitor/i.test(substance) ? "non_immune" : "unknown",
      criticality: rtype === "side_effect" ? "low" : "high",
      evidence: [{ item_id: x.doc.item.id, entry_id: x.eid }],
    };
    if (rx) row.rxnorm_ingredient = rx;
    if (condition) row.reaction = condition;
    // non-immune only for the well-established ACEi/SGLT2i adverse events
    if (row.mechanism === "non_immune" && !/ketoacidosis|angioedema|cough/i.test(reactionText)) row.mechanism = "unknown";
    add(row);
  }
  return rows;
}
function classText(label: string, matched: string | undefined): string {
  const m = matched ?? "";
  const mm = label.match(/(SGLT-?2 inhibitors?|ACE inhibitors?|ACE-I|ARBs?|NSAIDs?)/i);
  return (mm ? mm[1] : m).replace(/inhibitors$/i, "inhibitor");
}
function pickLatestWith(docs: Doc[], type: string): Doc | undefined {
  for (let i = docs.length - 1; i >= 0; i--) if (docs[i].entries.some((e) => e[1].type === type)) return docs[i];
  return undefined;
}

// ───────────── labs ─────────────
const RANK: Record<string, number> = { preliminary: 0, final: 1, corrected: 2 };
type Cand = { analyte: Analyte; rv: any; acc: string; collected: string; specimen: string; status: string; doc: Doc; eid: string };

function analyteOf(rv: any, specimen: string): Analyte | undefined {
  const t = rv.test ?? {};
  const code = String(t.local_code ?? "").toUpperCase();
  const loinc = String(t.loinc ?? "");
  const name = String(t.name ?? "").toLowerCase();
  const sp = specimen.toLowerCase();
  const urine = /urine/.test(sp);
  const LO: Record<string, Analyte> = {
    "2160-0": "creatinine", "38483-4": "creatinine", "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr", "77147-7": "egfr", "69405-9": "egfr",
    "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "33037-3": "anion_gap", "1863-0": "anion_gap",
    "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "9318-7": "uacr", "14959-1": "uacr",
    "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "20509-6": "hemoglobin",
    "1759-0": "bhb", "53060-0": "bhb", "76625-3": "bhb", "2744-1": "ph", "11558-4": "ph", "2019-8": "pco2", "11557-6": "pco2", "3040-3": "lipase", "3034-6": "lipase",
    "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin", "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
  };
  if (loinc && LO[loinc]) {
    const a = LO[loinc];
    if (a === "creatinine" && urine) return undefined;
    return a;
  }
  const CODE: Record<string, Analyte> = {
    CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate",
    AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc",
    HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", TROP: "troponin", TNI: "troponin",
    CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
  };
  if (CODE[code]) {
    const a = CODE[code];
    if (urine && a !== "uacr") return undefined;
    return a;
  }
  if (urine && !/albumin.*creatinine|microalbumin/.test(name)) return undefined;
  if (/albumin.*creatinine|microalbumin\/creat/.test(name)) return "uacr";
  if (/egfr|glomerular/.test(name)) return "egfr";
  if (/creatinine/.test(name)) return "creatinine";
  if (/potassium/.test(name)) return "potassium";
  if (/sodium/.test(name)) return "sodium";
  if (/chloride/.test(name)) return "chloride";
  if (/bicarb|total co2|co2/.test(name)) return "bicarbonate";
  if (/anion gap/.test(name)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(name)) return "bun";
  if (/hemoglobin a1c|hba1c|a1c/.test(name)) return "a1c";
  if (/glucose/.test(name)) return "glucose";
  if (/platelet/.test(name)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(name)) return "wbc";
  if (/hemoglobin/.test(name)) return "hemoglobin";
  if (/hydroxybutyr/.test(name)) return "bhb";
  if (/\bph\b/.test(name)) return "ph";
  if (/pco2|carbon dioxide/.test(name)) return "pco2";
  if (/lipase/.test(name)) return "lipase";
  if (/troponin/.test(name)) return "troponin";
  if (/triglycer/.test(name)) return "triglycerides";
  if (/hdl/.test(name)) return "hdl";
  if (/ldl/.test(name)) return "ldl";
  if (/cholesterol/.test(name)) return "cholesterol";
  return undefined;
}
const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L", bicarbonate: "mmol/L",
  anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL",
  hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL",
  triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
function convert(a: Analyte, v: number, unit: string | undefined): number | undefined {
  const u = (unit ?? "").toLowerCase().replace(/\s/g, "");
  const std = UNITS[a].toLowerCase();
  if (u === "" || u === std) return v;
  const table: Record<string, number> = {};
  switch (a) {
    case "creatinine": table["umol/l"] = 1 / 88.4; table["µmol/l"] = 1 / 88.4; break;
    case "glucose": table["mmol/l"] = 18.016; break;
    case "bun": table["mmol/l"] = 2.801; break;
    case "cholesterol": case "hdl": case "ldl": table["mmol/l"] = 38.67; break;
    case "triglycerides": table["mmol/l"] = 88.57; break;
    case "hemoglobin": table["g/l"] = 0.1; break;
    case "platelets": case "wbc": table["/ul"] = 0.001; table["10*3/ul"] = 1; table["k/ul"] = 1; table["10^3/ul"] = 1; table["x10e3/ul"] = 1; table["/mm3"] = 0.001; table["10*9/l"] = 1; table["g/l"] = 1; break;
    case "troponin": table["ng/l"] = 0.001; table["pg/ml"] = 0.001; table["ug/l"] = 1; table["µg/l"] = 1; break;
    case "uacr": table["mg/mmol"] = 8.84; table["mg/g{creat}"] = 1; table["mg/gcreat"] = 1; break;
    case "bhb": table["mg/dl"] = 1 / 10.4; break;
    case "egfr": table["ml/min"] = 1; table["ml/min/1.73m^2"] = 1; table["ml/min/1.73sqm"] = 1; break;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": table["meq/l"] = 1; break;
    case "a1c": table["%(ngsp)"] = 1; break;
    case "pco2": table["kpa"] = 7.50062; break;
    default: break;
  }
  const f = table[u];
  if (f === undefined) return undefined;
  return v * f;
}
function egfrEq(rv: any): LabResultRow["egfr_equation"] {
  const name = String(rv.test?.name ?? "").toLowerCase();
  const loinc = String(rv.test?.loinc ?? "");
  if (/2021/.test(name)) return "ckd-epi-2021";
  if (/2009/.test(name)) return "ckd-epi-2009";
  if (/mdrd/.test(name)) return "mdrd";
  if (/ckd-?epi/.test(name)) return "unknown";
  if (loinc === "98979-8") return "ckd-epi-2021";
  if (loinc === "62238-1") return "ckd-epi-2009";
  if (["33914-3", "48642-3", "48643-1"].includes(loinc)) return "mdrd";
  return "unknown";
}
function raceVariant(rv: any): boolean {
  const name = String(rv.test?.name ?? "").toLowerCase();
  if (/race-?free|without race|non-?black|non-?african|not african|no race/.test(name)) return false;
  return /african|\bblack\b|with race|race coef/.test(name) || String(rv.test?.loinc ?? "") === "48643-1" || String(rv.test?.loinc ?? "") === "77147-7";
}

function labs(docs: Doc[]): LabResultRow[] {
  const best = new Map<string, Cand>();
  const consider = (rv: any, doc: Doc, eid: string, acc: string, collected: string, specimen: string, status: string) => {
    if (!rv || !rv.test) return;
    const a = analyteOf(rv, specimen);
    if (!a) return;
    const key = `${acc}|${rv.test.local_code ?? rv.test.name}|${rv.test.loinc ?? ""}|${collected}`;
    const prev = best.get(key);
    const r = RANK[status] ?? 1;
    if (!prev || r >= (RANK[prev.status] ?? 1)) best.set(key, { analyte: a, rv, acc, collected, specimen, status, doc, eid });
  };
  for (const d of docs) {
    for (const [eid, e] of d.entries) {
      if (e.type === "result") consider(e, d, eid, String(e.accession ?? ""), String(e.collected ?? ""), String(e.specimen ?? ""), String(e.status ?? "final"));
      else if (e.type === "panel" && Array.isArray(e.components)) {
        for (const c of e.components) consider(c, d, eid, String(e.accession ?? ""), String(e.collected ?? ""), String(e.specimen ?? ""), String(e.status ?? "final"));
      }
    }
  }
  const out: LabResultRow[] = [];
  const cands = [...best.values()];
  for (const c of cands) {
    if (c.analyte === "egfr" && raceVariant(c.rv)) continue;
    const m = String(c.rv.value ?? "").trim().match(/^(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?)$/);
    if (!m) continue;
    const num = parseFloat(m[2]);
    const conv = convert(c.analyte, num, c.rv.unit);
    if (conv === undefined || !isFinite(conv) || isNaN(ms(c.collected))) continue;
    const row: LabResultRow = {
      analyte: c.analyte,
      value: Math.round(conv * 1e6) / 1e6,
      unit: UNITS[c.analyte],
      collected: c.collected,
      status: c.status === "preliminary" ? "preliminary" : "final",
      evidence: [{ item_id: c.doc.item.id, entry_id: c.eid }],
    };
    if (m[1]) row.comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as LabResultRow["comparator"];
    if (c.analyte === "egfr") row.egfr_equation = egfrEq(c.rv);
    if (c.rv.test.loinc) row.loinc = String(c.rv.test.loinc);
    out.push(row);
  }
  out.sort((a, b) => ms(a.collected) - ms(b.collected) || (a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
  return out;
}

// ───────────── vitals ─────────────
function vitals(docs: Doc[]): VitalRow[] {
  const byTaken = new Map<number, VitalRow>();
  for (const d of docs) {
    const setting: VitalRow["setting"] = "hospital";
    for (const [eid, v] of d.entries) {
      if (v.type !== "vitals") continue;
      const lp = localParts(v.taken);
      if (!lp) continue;
      const t = ms(v.taken);
      const row: VitalRow = { setting, local_time: `${lp.date}T${lp.time}`, evidence: [{ item_id: d.item.id, entry_id: eid }] };
      if (v.bp && typeof v.bp.systolic_mmhg === "number" && typeof v.bp.diastolic_mmhg === "number") {
        row.systolic_mmhg = v.bp.systolic_mmhg;
        row.diastolic_mmhg = v.bp.diastolic_mmhg;
      }
      if (typeof v.heart_rate_bpm === "number") row.pulse_bpm = v.heart_rate_bpm;
      if (typeof v.weight_kg === "number") row.weight_kg = Math.round(v.weight_kg * 10) / 10;
      if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
      const prev = byTaken.get(t);
      if (prev) prev.evidence.push(...row.evidence);
      else byTaken.set(t, row);
    }
  }
  return [...byTaken.entries()].sort((a, b) => a[0] - b[0]).map((x) => x[1]);
}
