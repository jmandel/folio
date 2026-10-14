import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Analyte, Sensitivity, Evidence,
} from "../in/views/views";

type Any = Record<string, any>;
type Entry = { item: FolioItem; key: string; e: Any };

// ---------- time helpers (America/Chicago) ----------

function pad(n: number, w = 2): string { return String(n).padStart(w, "0"); }

function nthSundayUtcMs(year: number, month: number, n: number, hourUtc: number): number {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const day = 1 + ((7 - first) % 7) + (n - 1) * 7;
  return Date.UTC(year, month, day, hourUtc);
}

/** UTC offset in minutes (negative) of America/Chicago at a UTC instant. */
function chicagoOffsetMin(utcMs: number): number {
  const y = new Date(utcMs).getUTCFullYear();
  const start = nthSundayUtcMs(y, 2, 2, 8); // 02:00 CST
  const end = nthSundayUtcMs(y, 10, 1, 7); // 02:00 CDT
  return utcMs >= start && utcMs < end ? -300 : -360;
}

const HAS_ZONE = /(Z|[+-]\d\d:?\d\d)$/i;

/** Local wall-clock `YYYY-MM-DDTHH:MM:SS` in Chicago, or undefined. */
function toLocal(s: string | undefined): string | undefined {
  if (!s) return undefined;
  if (!/T/.test(s)) return /^\d{4}-\d\d-\d\d$/.test(s) ? s + "T00:00:00" : undefined;
  if (!HAS_ZONE.test(s)) {
    const m = s.match(/^(\d{4}-\d\d-\d\dT\d\d:\d\d(:\d\d)?)/);
    return m ? (m[2] ? m[1] : m[1] + ":00") : undefined;
  }
  const ms = Date.parse(s);
  if (isNaN(ms)) return undefined;
  const d = new Date(ms + chicagoOffsetMin(ms) * 60000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

function localDate(s: string | undefined): string | undefined {
  if (!s) return undefined;
  if (/^\d{4}(-\d\d)?(-\d\d)?$/.test(s)) return s;
  return toLocal(s)?.slice(0, 10);
}

/** RFC 3339 with Chicago offset for a UTC or local date-time. */
function toRfc(s: string): string | undefined {
  const l = toLocal(s);
  if (!l) return undefined;
  let off: number;
  if (HAS_ZONE.test(s)) off = chicagoOffsetMin(Date.parse(s));
  else {
    const guess = Date.parse(l + "Z") + 360 * 60000;
    off = chicagoOffsetMin(guess);
    if (off === -300 && chicagoOffsetMin(Date.parse(l + "Z") + 300 * 60000) === -360) off = -360;
  }
  const a = Math.abs(off);
  return `${l}${off < 0 ? "-" : "+"}${pad(Math.floor(a / 60))}:${pad(a % 60)}`;
}

function sortKey(it: FolioItem): string {
  return (toLocal(it.recorded) ?? "") + "|" + (toLocal(it.effective) ?? "") + "|" + it.id;
}

// ---------- item selection ----------

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const counted = items.filter((it) => it && typeof it === "object" && it.payload && typeof it.payload === "object" &&
    (localDate(it.recorded) ?? "9999") <= asOf);
  const dead = new Set<string>();
  for (const it of counted) {
    for (const id of it.supersedes ?? []) dead.add(id);
    for (const id of it.retracts ?? []) dead.add(id);
  }
  return counted.filter((it) => !dead.has(it.id)).sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : 1));
}

function entriesOf(item: FolioItem, type: string): Entry[] {
  const out: Entry[] = [];
  for (const [key, e] of Object.entries(item.payload ?? {})) {
    if (e && typeof e === "object" && (e as Any).type === type) out.push({ item, key, e: e as Any });
  }
  return out;
}

function encOf(item: FolioItem): Any {
  for (const v of Object.values(item.payload ?? {})) if (v && (v as Any).type === "encounter") return v as Any;
  return {};
}

// ---------- text helpers ----------

const num = (v: unknown): number | undefined => (typeof v === "number" && isFinite(v) ? v : undefined);
const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v : undefined);

function ingredientName(drug: string): string {
  const words = drug.toLowerCase().replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const w of words) {
    if (/\d/.test(w)) break;
    if (["tablet", "tablets", "capsule", "capsules", "tab", "cap", "oral", "solution", "injection", "inhaler", "cream", "ointment", "extended-release", "er", "xr", "sr", "dr", "hydrochloride", "hcl", "sodium", "potassium", "calcium", "sulfate", "tartrate", "succinate", "maleate", "mesylate", "besylate", "trihydrate", "hfa", "suspension", "syrup", "patch", "drops", "gel", "spray"].includes(w)) continue;
    out.push(w);
  }
  return out.join(" ") || words[0] || drug.toLowerCase();
}

function parseDose(text: string | undefined): MedicationRow["dose"] | undefined {
  if (!text) return undefined;
  const t = text.trim().toLowerCase();
  if (/\d\s*(-|–|to)\s*\d/.test(t)) return undefined;
  const m = t.match(/^(\d+(?:\.\d+)?)\s*([a-zµμ]+)\b/);
  if (!m) return undefined;
  const v = parseFloat(m[1]);
  const u = m[2];
  if (u === "mg" || u === "milligram" || u === "milligrams") return { value: v, unit: "mg" };
  if (u === "g" || u === "gram" || u === "grams") return { value: v * 1000, unit: "mg" };
  if (["mcg", "µg", "μg", "ug", "microgram", "micrograms"].includes(u)) return { value: v, unit: "mcg" };
  if (["unit", "units", "u", "iu"].includes(u)) return { value: v, unit: "units" };
  if (["ml", "cc"].includes(u)) return { value: v, unit: "mL" };
  if (["tab", "tabs", "tablet", "tablets"].includes(u)) return { value: v, unit: "tablet" };
  return undefined;
}

function parseFreq(sig: string | undefined): MedicationRow["frequency"] | undefined {
  if (!sig) return undefined;
  const s = sig.toLowerCase();
  if (/\bprn\b|as needed/.test(s)) return "PRN";
  if (/every other|four times|\bqid\b|q\.?i\.?d|every [46] hours|every \d+ days|monthly|taper/.test(s)) return "other";
  if (/\bbid\b|twice|every 12 hours|q12h|2 times/.test(s)) return "BID";
  if (/\btid\b|three times|every 8 hours|q8h|3 times/.test(s)) return "TID";
  if (/weekly|once a week|every week|\bqw\b/.test(s)) return "QW";
  if (/bedtime|\bqhs\b|\bhs\b|nightly|at night/.test(s)) return "QHS";
  if (/daily|once|\bqd\b|every day|each day|every morning|every evening|in the morning|in the evening/.test(s)) return "QD";
  return undefined;
}

const SENS_MED: [RegExp, Sensitivity][] = [
  [/quetiapine|olanzapine|risperidone|aripiprazole|lithium|sertraline|fluoxetine|citalopram|escitalopram|paroxetine|venlafaxine|duloxetine|bupropion|mirtazapine|trazodone|lamotrigine|haloperidol|clozapine|ziprasidone|lurasidone|buspirone|amitriptyline|nortriptyline|clonazepam|lorazepam|alprazolam|diazepam|zolpidem|atomoxetine|methylphenidate|amphetamine|vilazodone|vortioxetine|paliperidone|clomipramine/, "mental-health"],
  [/buprenorphine|naltrexone|methadone|naloxone|disulfiram|acamprosate|varenicline|nicotine/, "substance-use"],
  [/ethinyl|estradiol|norethindrone|levonorgestrel|drospirenone|medroxyprogesterone|etonogestrel|norgestimate|desogestrel|misoprostol|mifepristone|clomiphene|letrozole|sildenafil|tadalafil/, "sexual-reproductive-health"],
  [/tenofovir|emtricitabine|dolutegravir|bictegravir|efavirenz|raltegravir|darunavir|ritonavir|lamivudine|abacavir|zidovudine|rilpivirine|cabotegravir|doxycycline.*pep|valacyclovir.*herpes/, "hiv-sti"],
];

function medSensitivity(name: string): Sensitivity[] | undefined {
  const out: Sensitivity[] = [];
  for (const [re, s] of SENS_MED) if (re.test(name) && !out.includes(s)) out.push(s);
  return out.length ? out : undefined;
}

function dxSensitivity(label: string, icd?: string): Sensitivity[] | undefined {
  const out: Sensitivity[] = [];
  const l = label.toLowerCase();
  const c = (icd ?? "").toUpperCase();
  if (/^F(1\d)/.test(c) || /alcohol|opioid|substance|cocaine|cannabis|nicotine|tobacco use disorder|overdose use/.test(l)) out.push("substance-use");
  else if (/^F\d\d/.test(c) || /depress|bipolar|schizo|anxiety|psychosis|ptsd|panic|adhd|mental|suicid|mania|obsessive|eating disorder|anorexia nervosa|bulimia/.test(l)) out.push("mental-health");
  if (/^(O\d\d|Z3[0-9]|N97|N46|Z30)/.test(c) || /pregnan|contracepti|infertil|gestation|pre-?eclampsia|miscarriage/.test(l)) out.push("sexual-reproductive-health");
  if (/^(B20|Z21|A5\d|A6[0-4]|B16|B97\.35|A74)/.test(c) || /\bhiv\b|chlamydia|gonorrh|syphilis|herpes genital|trichomon/.test(l)) out.push("hiv-sti");
  if (/brca|hereditary|genetic|inherited|cystic fibrosis|huntington|sickle cell|down syndrome|lynch|familial hypercholesterolemia/.test(l)) out.push("genetic");
  return out.length ? out : undefined;
}

const evOf = (...es: Entry[]): Evidence => {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const x of es) {
    const k = x.item.id + "#" + x.key;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: x.item.id, entry_id: x.key });
  }
  return out;
};

// ---------- medications ----------

function medKey(e: Any): string {
  const r = str(e.rxnorm_ingredient);
  return r ? "rx:" + r : "n:" + ingredientName(str(e.drug_name) ?? "");
}

function docDate(item: FolioItem): string | undefined {
  const enc = encOf(item);
  if (enc.document_kind === "discharge_summary") return localDate(enc.discharged) ?? localDate(item.effective_end) ?? localDate(item.effective);
  return localDate(item.effective);
}

function mapStatus(s: string): MedicationRow["status"] {
  switch (s) {
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
    default: return "unknown";
  }
}

function buildMedications(items: FolioItem[]): MedicationRow[] {
  const cands = items.filter((it) => entriesOf(it, "home_med").length > 0);
  if (!cands.length) return [];
  let latest = cands[cands.length - 1];
  const encId = encOf(latest).encounter_id;
  const sameEnc = cands.filter((it) => encOf(it).encounter_id === encId);
  const ds = sameEnc.filter((it) => encOf(it).document_kind === "discharge_summary");
  if (ds.length) latest = ds[ds.length - 1];
  const chain = sameEnc.filter((it) => sortKey(it) <= sortKey(latest));

  const rows: MedicationRow[] = [];
  const byKey = new Map<string, Entry>();
  for (const en of entriesOf(latest, "home_med")) {
    const k = medKey(en.e);
    const prev = byKey.get(k);
    if (!prev || en.e.status === "held" || en.e.status === "stopped") byKey.set(k, prev && prev.e.status === "stopped" ? prev : en);
  }
  for (const [k, en] of byKey) {
    const e = en.e;
    const status = mapStatus(String(e.status));
    // walk back through earlier snapshots of the same stay while the status is unchanged
    const evidence: Entry[] = [en];
    let runStartItem = latest;
    let prevStatusDiffers = false;
    let prevRaw = "";
    for (let i = chain.length - 1; i >= 0; i--) {
      const it = chain[i];
      if (it.id === latest.id) continue;
      const m = entriesOf(it, "home_med").find((x) => medKey(x.e) === k);
      if (!m) break;
      if (mapStatus(String(m.e.status)) === status && m.e.status !== "not_reconciled") {
        runStartItem = it;
        evidence.push(m);
      } else {
        prevStatusDiffers = true;
        prevRaw = String(m.e.status);
        break;
      }
    }
    let since: string | undefined;
    const raw = String(e.status);
    if (status === "held" || status === "stopped") since = docDate(runStartItem);
    else if (status === "active" && (raw === "new" || raw === "changed" || (prevStatusDiffers && (prevRaw === "held" || prevRaw === "stopped")))) since = docDate(runStartItem);
    const dose = parseDose(str(e.dose_text));
    const drug = str(e.drug_name) ?? "";
    const row: MedicationRow = {
      ingredient: ingredientName(drug) || undefined,
      rxnorm_ingredient: str(e.rxnorm_ingredient),
      drug_name: drug,
      status,
      patient_reported: false,
      evidence: evOf(...evidence),
    };
    if (since) row.status_since = since;
    if (dose) row.dose = dose;
    const f = parseFreq(str(e.sig));
    if (f) row.frequency = f;
    if (str(e.instructions) && status !== "active") row.status_reason_text = str(e.instructions);
    const s = medSensitivity(drug.toLowerCase());
    if (s) row.sensitivity = s;
    for (const kk of Object.keys(row) as (keyof MedicationRow)[]) if (row[kk] === undefined) delete row[kk];
    rows.push(row);
  }
  return rows;
}

// ---------- problems and drug-attributed diagnoses ----------

function normLabel(s: string): string { return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }

function parseOnset(t: string | undefined): ProblemRow["onset"] | undefined {
  if (!t) return undefined;
  const s = t.trim();
  let m = s.match(/^(\d{4})-(\d\d)-(\d\d)$/);
  if (m) return { value: s, precision: "day" };
  m = s.match(/^(\d{4})-(\d\d)$/);
  if (m) return { value: s, precision: "month" };
  m = s.match(/^(\d{4})$/);
  if (m) return { value: s, precision: "year" };
  return undefined;
}

function ckdInfo(label: string, icd?: string): { stage?: ProblemRow["ckd_stage"]; alb?: ProblemRow["albuminuria"] } | undefined {
  const l = label.toLowerCase();
  const c = (icd ?? "").toUpperCase();
  if (!/^N18/.test(c) && !/chronic kidney|\bckd\b|chronic renal/.test(l)) return undefined;
  let stage: ProblemRow["ckd_stage"];
  const sm = l.match(/(?:stage|g)\s*([1-5])\s*([ab])?\b/);
  if (/N18\.1/.test(c)) stage = "G1";
  else if (/N18\.2/.test(c)) stage = "G2";
  else if (/N18\.31/.test(c)) stage = "G3a";
  else if (/N18\.32/.test(c)) stage = "G3b";
  else if (/N18\.4/.test(c)) stage = "G4";
  else if (/N18\.5/.test(c)) stage = "G5";
  if (sm) {
    const n = sm[1];
    if (n === "3") stage = sm[2] ? (("G3" + sm[2]) as ProblemRow["ckd_stage"]) : stage;
    else stage = ("G" + n) as ProblemRow["ckd_stage"];
  }
  const am = l.match(/\ba([123])\b/);
  return { stage, alb: am ? (("A" + am[1]) as ProblemRow["albuminuria"]) : undefined };
}

const CLASS_RES: [RegExp, RegExp][] = [
  [/sglt-?2/, /gliflozin$/],
  [/ace inhibitor|ace-inhibitor/, /pril$/],
  [/\barbs?\b|angiotensin receptor/, /sartan$/],
  [/statin/, /statin$/],
  [/fluoroquinolone|quinolone/, /floxacin$/],
  [/cephalosporin/, /^(cef|ceph)/],
  [/penicillin/, /^(amoxicillin|ampicillin|penicillin|piperacillin|dicloxacillin|nafcillin|oxacillin)/],
  [/sulfonylurea/, /^(glipizide|glyburide|glimepiride|gliclazide)/],
  [/thiazide/, /thiazide$/],
  [/beta.?blocker/, /olol$/],
  [/nsaid/, /^(ibuprofen|naproxen|diclofenac|meloxicam|celecoxib|ketorolac|indomethacin)/],
  [/macrolide/, /^(azithromycin|clarithromycin|erythromycin)/],
];

interface DrugAttr { substance: string; rxnorm?: string; conditionOnly: boolean; reaction: string }

function drugAttribution(en: Entry, meds: Entry[]): DrugAttr | undefined {
  const label = str(en.e.label) ?? "";
  const icd = (str(en.e.icd10cm) ?? "").toUpperCase();
  const l = label.toLowerCase();
  const isT = /^T(3[6-9]|4\d|50)\.[0-9A-Z]5/.test(icd);
  let term: string | undefined;
  let m = l.match(/(?:adverse effect of|due to|secondary to|caused by|induced by|from|toxicity of)\s+(.+)$/);
  if (m) term = m[1];
  else {
    m = l.match(/(?:^|,\s*|\s)([a-z0-9][a-z0-9 \-]*?)[\s-](?:associated|induced)\b/);
    if (m) term = m[1].split(",").pop();
  }
  if (!term && isT) term = l.replace(/^adverse effect of\s+/, "").replace(/,?\s*(initial|subsequent) encounter.*$/, "");
  if (!term) return undefined;
  term = term.trim().replace(/[.;]$/, "");
  if (!term) return undefined;
  const medNames = meds.map((x) => ({ x, n: ingredientName(str(x.e.drug_name) ?? "") }));
  // named drug on the list?
  const direct = medNames.find((q) => q.n && (term === q.n || term!.split(/\s+/).includes(q.n)));
  let substance = term;
  let rxnorm: string | undefined;
  if (direct) {
    substance = direct.n;
    rxnorm = str(direct.x.e.rxnorm_ingredient);
  } else {
    let isClass = false;
    for (const [cre, dre] of CLASS_RES) {
      if (cre.test(term)) {
        isClass = true;
        const hits = medNames.filter((q) => dre.test(q.n));
        if (hits.length === 1) {
          substance = hits[0].n;
          rxnorm = str(hits[0].x.e.rxnorm_ingredient);
        } else substance = label.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"))?.[0] ?? term;
        break;
      }
    }
    if (!isClass && /^[a-z]+$/.test(term)) substance = term;
  }
  const condOnly = isT && !/due to|associated|induced|from|secondary/.test(l);
  return { substance, rxnorm, conditionOnly: condOnly, reaction: label };
}

function classifyReaction(reaction: string | undefined, severity: string | undefined): AllergyIntoleranceRow["reaction_type"] {
  const r = (reaction ?? "").toLowerCase();
  if (/hive|urticaria|rash|swell|angioedema|anaphyla|wheez|bronchospasm|itch|prurit|stevens|sjs|dress|eczema|dermatitis|shortness of breath|throat|edema/.test(r)) return "hypersensitivity";
  if (/liver|hepat|pancreatit|renal|kidney|nephro|ketoacidosis|dka|bleed|hemorrhag|agranulocyt|neutropen|arrhythm|qt|rhabdo|seizure|lactic|failure|toxicity|injury|tendon|stroke|clot|thrombo|suicid/.test(r)) return "serious_adverse_event";
  if (/cough|nausea|vomit|diarrh|constipat|stomach|gi upset|gastro|dizz|drows|sedat|headache|fatigue|tired|dry mouth|insomnia|flush|palpitation|tremor|cramp|myalgia|muscle|taste|gas|bloat|upset|intoleran|side effect|hypotension|lighthead/.test(r)) return "side_effect";
  if (severity === "mild") return "side_effect";
  return "hypersensitivity";
}

function criticalityOf(sev: string | undefined): AllergyIntoleranceRow["criticality"] {
  if (sev === "mild") return "low";
  if (sev === "severe") return "high";
  return "unknown";
}

function buildProblems(items: FolioItem[]): { problems: ProblemRow[]; drugAllergies: AllergyIntoleranceRow[] } {
  type Rec = { en: Entry; kind: "dx" | "hx"; status: string; date: string };
  const groups = new Map<string, Rec[]>();
  const attrs: { en: Entry; a: DrugAttr; meds: Entry[] }[] = [];

  for (const it of items) {
    const meds = entriesOf(it, "home_med");
    for (const en of entriesOf(it, "diagnosis")) {
      const label = str(en.e.label);
      if (!label) continue;
      const a = drugAttribution(en, meds);
      const status = String(en.e.status);
      if (a && (status === "active" || status === "resolved")) attrs.push({ en, a, meds });
      if (a?.conditionOnly) continue;
      const key = str(en.e.riverside_dx?.code) ? "rdx:" + en.e.riverside_dx.code : str(en.e.icd10cm) ? "icd:" + en.e.icd10cm : "l:" + normLabel(label);
      const arr = groups.get(key) ?? [];
      arr.push({ en, kind: "dx", status, date: localDate(it.effective) ?? "" });
      groups.set(key, arr);
    }
    for (const en of entriesOf(it, "history")) {
      const label = str(en.e.condition);
      if (!label) continue;
      const key = str(en.e.icd10cm) ? "icd:" + en.e.icd10cm : "l:" + normLabel(label);
      const arr = groups.get(key) ?? [];
      arr.push({ en, kind: "hx", status: "active", date: localDate(it.effective) ?? "" });
      groups.set(key, arr);
    }
  }

  // an ICD-only entry joins the single local-code group that carries the same ICD code
  for (const key of Array.from(groups.keys())) {
    if (!key.startsWith("icd:")) continue;
    const icd = key.slice(4);
    const targets = Array.from(groups.keys()).filter((k) => k.startsWith("rdx:") && groups.get(k)!.some((r) => r.en.e.icd10cm === icd));
    if (targets.length === 1) {
      const t = groups.get(targets[0])!;
      groups.set(targets[0], t.concat(groups.get(key)!).sort((a, b) => (sortKey(a.en.item) < sortKey(b.en.item) ? -1 : 1)));
      groups.delete(key);
    }
  }

  // merge groups sharing a normalized label (e.g. same label with and without code)
  const byLabel = new Map<string, string>();
  const merged = new Map<string, Rec[]>();
  for (const [key, recs] of groups) {
    const lab = normLabel(str(recs[recs.length - 1].en.e.label) ?? str(recs[recs.length - 1].en.e.condition) ?? "");
    const target = byLabel.get(lab) ?? key;
    byLabel.set(lab, target);
    merged.set(target, (merged.get(target) ?? []).concat(recs));
  }

  const problems: ProblemRow[] = [];
  for (const recs of merged.values()) {
    // recs are in item order (oldest first). Established dx entries decide; history is a fallback.
    const dxs = recs.filter((r) => r.kind === "dx");
    let chosen: Rec | undefined;
    if (dxs.length) {
      const lastDx = dxs[dxs.length - 1];
      if (lastDx.status === "ruled_out") continue;
      const confirmed = dxs.filter((r) => r.status === "active" || r.status === "resolved");
      if (!confirmed.length) continue;
      chosen = confirmed[confirmed.length - 1];
    } else chosen = recs[recs.length - 1];
    const e = chosen.en.e;
    const label = str(e.label) ?? str(e.condition) ?? "";
    // latest wording and codes from the most recent entry of the group that is not ruled out/working
    const icd = str(e.icd10cm) ?? recs.slice().reverse().map((r) => str(r.en.e.icd10cm)).find(Boolean);
    const row: ProblemRow = {
      condition: label,
      status: chosen.kind === "dx" && chosen.status === "resolved" ? "resolved" : "active",
      evidence: evOf(chosen.en),
    };
    if (icd) row.icd10cm = icd;
    // onset: from history text if present
    const hist = recs.slice().reverse().find((r) => r.kind === "hx" && parseOnset(str(r.en.e.onset_text)));
    const onset = hist ? parseOnset(str(hist.en.e.onset_text)) : undefined;
    if (onset) row.onset = onset;
    const ck = ckdInfo(label, icd);
    if (ck) {
      if (ck.stage) row.ckd_stage = ck.stage;
      if (ck.alb) row.albuminuria = ck.alb;
    }
    const s = dxSensitivity(label, icd);
    if (s) row.sensitivity = s;
    problems.push(row);
  }

  const drugAllergies: AllergyIntoleranceRow[] = [];
  const seen = new Set<string>();
  for (const { en, a } of attrs.slice().reverse()) {
    const k = a.substance.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    const rt = classifyReaction(a.reaction, undefined);
    const row: AllergyIntoleranceRow = {
      substance: a.substance,
      reaction_type: rt === "hypersensitivity" && !/hive|rash|anaphyla|swell|urticaria|angioedema/.test(a.reaction.toLowerCase()) ? "serious_adverse_event" : rt,
      mechanism: "unknown",
      reaction: a.reaction,
      criticality: "unknown",
      evidence: evOf(en),
    };
    if (a.rxnorm) row.rxnorm_ingredient = a.rxnorm;
    if (row.reaction_type === "serious_adverse_event") row.criticality = "high";
    const od = localDate(en.item.effective);
    if (od) row.onset = { value: od, precision: "day" };
    drugAllergies.push(row);
  }
  return { problems, drugAllergies };
}

// ---------- allergies ----------

function buildAllergies(items: FolioItem[]): AllergyIntoleranceRow[] {
  const cands = items.filter((it) => entriesOf(it, "allergy").length > 0);
  if (!cands.length) return [];
  const latest = cands[cands.length - 1];
  const rows: AllergyIntoleranceRow[] = [];
  for (const en of entriesOf(latest, "allergy")) {
    const sub = str(en.e.substance);
    if (!sub) continue;
    if (/^(nkda|nka|no known (drug )?allergies)$/i.test(sub.trim())) continue;
    const reaction = str(en.e.reaction);
    const sev = str(en.e.severity);
    const rt = classifyReaction(reaction, sev);
    const rxn = str(en.e.rxnorm_ingredient);
    const row: AllergyIntoleranceRow = {
      substance: rxn ? ingredientName(sub) : sub,
      reaction_type: rt,
      mechanism: rt === "side_effect" ? "non_immune" : "unknown",
      criticality: criticalityOf(sev),
      evidence: evOf(en),
    };
    if (rxn) row.rxnorm_ingredient = rxn;
    if (reaction) row.reaction = reaction;
    const s = medSensitivity(sub.toLowerCase());
    if (s) row.sensitivity = s;
    rows.push(row);
  }
  return rows;
}

// ---------- labs ----------

const LOINC_MAP: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr", "77147-7": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "33037-3": "anion_gap", "1863-0": "anion_gap", "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c", "14959-1": "uacr", "9318-7": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "20509-6": "hemoglobin",
  "1759-0": "bhb", "53063-5": "bhb", "2753-1": "bhb", "2744-1": "ph", "11558-4": "ph", "2019-8": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "3034-6": "lipase", "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};
const CODE_MAP: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc",
  HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", TROPI: "troponin", TROP: "troponin", TNI: "troponin",
  CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

function analyteOf(test: Any): Analyte | undefined {
  const code = String(test?.local_code ?? "").toUpperCase();
  if (CODE_MAP[code]) return CODE_MAP[code];
  const loinc = str(test?.loinc);
  if (loinc && LOINC_MAP[loinc]) return LOINC_MAP[loinc];
  const n = String(test?.name ?? "").toLowerCase();
  if (/egfr|glomerular filtration/.test(n)) return "egfr";
  if (/creatinine/.test(n) && !/ratio|urine/.test(n)) return "creatinine";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/hydroxybutyrate/.test(n)) return "bhb";
  if (/potassium/.test(n)) return "potassium";
  if (/sodium/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/bicarbonate|total co2/.test(n)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/glucose/.test(n)) return "glucose";
  if (/a1c/.test(n)) return "a1c";
  if (/albumin.*creatinine/.test(n)) return "uacr";
  if (/platelet/.test(n)) return "platelets";
  if (/white blood|wbc|leukocyte/.test(n)) return "wbc";
  if (/hemoglobin/.test(n)) return "hemoglobin";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n)) return "troponin";
  if (/hdl/.test(n)) return "hdl";
  if (/ldl/.test(n)) return "ldl";
  if (/triglycerid/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n)) return "cholesterol";
  if (/pco2/.test(n)) return "pco2";
  if (/^ph\b|\bph$/.test(n)) return "ph";
  return undefined;
}

const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L", bicarbonate: "mmol/L",
  anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL",
  bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function convert(a: Analyte, v: number, unitRaw: string | undefined): number | undefined {
  const u = (unitRaw ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (!u || u === UNITS[a].toLowerCase()) return v;
  switch (a) {
    case "creatinine": if (u === "umol/l" || u === "µmol/l" || u === "μmol/l") return v / 88.4; break;
    case "glucose": if (u === "mmol/l") return v * 18.016; break;
    case "bun": if (u === "mmol/l") return v * 2.801; break;
    case "cholesterol": case "hdl": case "ldl": if (u === "mmol/l") return v * 38.67; break;
    case "triglycerides": if (u === "mmol/l") return v * 88.57; break;
    case "a1c": if (u === "mmol/mol") return v / 10.929 + 2.15; break;
    case "platelets": case "wbc":
      if (u === "/ul" || u === "cells/ul" || u === "/mm3" || u === "10*6/l" || u === "10^6/l") return v / 1000;
      if (u === "10*9/l" || u === "10^9/l" || u === "k/ul" || u === "10*3/ul" || u === "10^3/ul" || u === "x10e3/ul") return v;
      break;
    case "hemoglobin": if (u === "g/l") return v / 10; if (u === "mmol/l") return v * 1.611; break;
    case "troponin": if (u === "ng/l" || u === "pg/ml") return v / 1000; if (u === "ug/l" || u === "µg/l") return v; break;
    case "uacr": if (u === "mg/mmol") return v * 8.84; if (u === "ug/mg" || u === "µg/mg" || u === "mcg/mg") return v; break;
    case "bhb": if (u === "mg/dl") return v / 10.4; break;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": if (u === "meq/l") return v; break;
    case "anion_gap": if (u === "meq/l") return v; break;
    case "lipase": if (u === "iu/l") return v; break;
    case "pco2": if (u === "kpa") return v * 7.50062; break;
    case "ph": return v;
    default: break;
  }
  return undefined;
}

function parseValue(s: string): { v: number; cmp?: LabResultRow["comparator"] } | undefined {
  const m = s.trim().match(/^(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return undefined;
  let cmp = m[1];
  if (cmp === "≤") cmp = "<=";
  if (cmp === "≥") cmp = ">=";
  return { v: parseFloat(m[2]), cmp: cmp as LabResultRow["comparator"] | undefined };
}

const STATUS_RANK: Record<string, number> = { preliminary: 0, final: 1, corrected: 2 };

function roundTo(v: number, unit: string, a: Analyte): number {
  const d = a === "ph" || a === "creatinine" || a === "potassium" || a === "troponin" || a === "bhb" ? 3 : 2;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function buildLabs(items: FolioItem[]): LabResultRow[] {
  type Cand = { en: Entry; r: Any; panel?: Any; status: string; sort: string };
  const groups = new Map<string, Cand[]>();
  const add = (en: Entry, r: Any, ctx: Any, panel?: Any) => {
    const acc = str(ctx.accession) ?? "";
    const code = String(r.test?.local_code ?? r.test?.name ?? "");
    const key = acc ? acc + "|" + code : en.item.id + "|" + en.key + "|" + code;
    const arr = groups.get(key) ?? [];
    arr.push({ en, r, panel: ctx, status: String(ctx.status ?? "final"), sort: sortKey(en.item) });
    groups.set(key, arr);
  };
  for (const it of items) {
    for (const en of entriesOf(it, "result")) if (en.e.test) add(en, en.e, en.e);
    for (const en of entriesOf(it, "panel")) {
      if (!Array.isArray(en.e.components)) continue;
      for (const c of en.e.components) if (c && c.test) add(en, c, en.e);
    }
  }
  const rows: LabResultRow[] = [];
  for (const cands of groups.values()) {
    const best = cands.slice().sort((a, b) => (STATUS_RANK[a.status] ?? 1) - (STATUS_RANK[b.status] ?? 1) || (a.sort < b.sort ? -1 : 1))[cands.length - 1];
    const r = best.r;
    const ctx = best.panel ?? {};
    const a = analyteOf(r.test);
    if (!a) continue;
    const spec = String(ctx.specimen ?? "").toLowerCase();
    if (/urine/.test(spec) && a !== "uacr") continue;
    if (!/urine/.test(spec) && a === "uacr" && spec) { /* keep */ }
    const tname = String(r.test?.name ?? "").toLowerCase();
    if (a === "egfr" && /race|african|black/.test(tname) && !/race-?free|without|non-?black|2021/.test(tname)) continue;
    const pv = parseValue(String(r.value ?? ""));
    if (!pv) continue;
    const val = convert(a, pv.v, str(r.unit));
    if (val === undefined) continue;
    const collected = toRfc(String(ctx.collected ?? ""));
    if (!collected) continue;
    const row: LabResultRow = {
      analyte: a,
      value: roundTo(val, UNITS[a], a),
      unit: UNITS[a],
      collected,
      status: best.status === "preliminary" ? "preliminary" : "final",
      evidence: evOf(best.en, ...cands.map((c) => c.en)),
    };
    if (pv.cmp) row.comparator = pv.cmp;
    if (a === "egfr") {
      const n = tname + " " + String(ctx.panel?.name ?? "");
      row.egfr_equation = /2021/.test(n) ? "ckd-epi-2021" : /2009/.test(n) ? "ckd-epi-2009" : /mdrd/.test(n) ? "mdrd" : "unknown";
    }
    const loinc = str(r.test?.loinc);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  rows.sort((x, y) => (x.collected < y.collected ? -1 : x.collected > y.collected ? 1 : x.analyte < y.analyte ? -1 : 1));
  return rows;
}

// ---------- vitals ----------

function buildVitals(items: FolioItem[]): VitalRow[] {
  const byTime = new Map<string, { row: VitalRow; ens: Entry[] }>();
  for (const it of items) {
    const enc = encOf(it);
    for (const en of entriesOf(it, "vitals")) {
      const e = en.e;
      const lt = toLocal(str(e.taken));
      if (!lt) continue;
      const sys = num(e.bp?.systolic_mmhg), dia = num(e.bp?.diastolic_mmhg);
      const hr = num(e.heart_rate_bpm);
      const w = num(e.weight_kg);
      if (sys === undefined && dia === undefined && hr === undefined && w === undefined) continue;
      const key = lt.slice(0, 16) + "|" + sys + "|" + dia + "|" + hr + "|" + w;
      const prior = byTime.get(key);
      if (prior) { prior.ens.push(en); continue; }
      const row: VitalRow = { setting: "hospital", local_time: lt.slice(0, 16), evidence: [] };
      if (sys !== undefined) row.systolic_mmhg = sys;
      if (dia !== undefined) row.diastolic_mmhg = dia;
      if (hr !== undefined) row.pulse_bpm = hr;
      if (w !== undefined) row.weight_kg = Math.round(w * 10) / 10;
      void enc;
      byTime.set(key, { row, ens: [en] });
    }
  }
  const rows: VitalRow[] = [];
  for (const { row, ens } of byTime.values()) {
    row.evidence = evOf(...ens);
    rows.push(row);
  }
  rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return rows;
}

// ---------- entry point ----------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const live = countingItems(Array.isArray(items) ? items : [], asOf);
    const { problems, drugAllergies } = buildProblems(live);
    const listAllergies = buildAllergies(live);
    const allergies = listAllergies.slice();
    for (const d of drugAllergies) {
      if (!allergies.some((a) => a.substance.toLowerCase() === d.substance.toLowerCase())) allergies.push(d);
    }
    return {
      medications: buildMedications(live),
      problems,
      allergies,
      labs: buildLabs(live),
      vitals: buildVitals(live),
    };
  } catch {
    return empty;
  }
}
