import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Analyte, Sensitivity, Evidence,
} from "../in/views/views";

const TZ = "America/Chicago";
const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
});

function localParts(ms: number) {
  const o: Record<string, string> = {};
  for (const p of fmt.formatToParts(new Date(ms))) o[p.type] = p.value;
  const hh = o.hour === "24" ? "00" : o.hour;
  return { date: `${o.year}-${o.month}-${o.day}`, time: `${hh}:${o.minute}`, sec: o.second, ms: Date.UTC(+o.year, +o.month - 1, +o.day, +hh, +o.minute, +o.second) };
}

const HAS_ZONE = /(Z|[+-]\d\d:?\d\d)$/i;

/** Parse a date-time; zone-less strings are local (Chicago). Returns UTC ms or NaN. */
function toMs(s: string | undefined): number {
  if (!s) return NaN;
  if (HAS_ZONE.test(s)) return Date.parse(s);
  const m = /^(\d{4})-(\d\d)-(\d\d)(?:[T ](\d\d):(\d\d)(?::(\d\d))?)?/.exec(s);
  if (!m) return NaN;
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
  let guess = wall + 6 * 3600000;
  for (let i = 0; i < 3; i++) guess = wall - (localParts(guess).ms - guess);
  return guess;
}

function localDate(s: string | undefined): string | undefined {
  if (!s) return undefined;
  if (/^\d{4}(-\d\d)?(-\d\d)?$/.test(s)) return s;
  if (!HAS_ZONE.test(s)) return s.slice(0, 10);
  const ms = Date.parse(s);
  return isNaN(ms) ? undefined : localParts(ms).date;
}

function localMinute(s: string | undefined): string | undefined {
  if (!s) return undefined;
  if (!HAS_ZONE.test(s)) return /^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(s) ? s.slice(0, 16) : undefined;
  const ms = Date.parse(s);
  if (isNaN(ms)) return undefined;
  const p = localParts(ms);
  return `${p.date}T${p.time}`;
}

function isoWithOffset(s: string): string | undefined {
  const ms = toMs(s);
  if (isNaN(ms)) return undefined;
  const p = localParts(ms);
  const off = Math.round((p.ms - Math.floor(ms / 1000) * 1000) / 60000);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  const oh = String(Math.floor(a / 60)).padStart(2, "0");
  const om = String(a % 60).padStart(2, "0");
  return `${p.date}T${p.time}:${p.sec}${sign}${oh}:${om}`;
}

interface Entry { key: string; e: any }
interface Doc { item: FolioItem; kind: string; enc: any; entries: Entry[]; rec: number }

function str(x: unknown): string | undefined { return typeof x === "string" && x.length ? x : undefined; }

function selectItems(items: FolioItem[], asOf: string): FolioItem[] {
  const counting = items.filter((i) => {
    const ms = toMs(i.recorded);
    return !isNaN(ms) && localParts(ms).date <= asOf;
  });
  const retracted = new Set<string>();
  for (const i of counting) for (const r of i.retracts ?? []) retracted.add(r);
  const live = counting.filter((i) => !retracted.has(i.id));
  const byId = new Map<string, FolioItem>();
  for (const i of items) byId.set(i.id, i);
  const replaced = new Set<string>();
  const stack: string[] = [];
  for (const i of live) for (const s of i.supersedes ?? []) stack.push(s);
  while (stack.length) {
    const id = stack.pop()!;
    if (replaced.has(id)) continue;
    replaced.add(id);
    const it = byId.get(id);
    if (it) for (const s of it.supersedes ?? []) stack.push(s);
  }
  return live.filter((i) => !replaced.has(i.id));
}

function buildDocs(items: FolioItem[]): Doc[] {
  const docs: Doc[] = [];
  for (const item of items) {
    const entries: Entry[] = [];
    const payload = item.payload && typeof item.payload === "object" ? item.payload : {};
    for (const [key, e] of Object.entries(payload)) {
      if (e && typeof e === "object" && typeof (e as any).type === "string") entries.push({ key, e });
    }
    const enc = entries.find((x) => x.e.type === "encounter")?.e ?? {};
    docs.push({ item, kind: enc.document_kind ?? "", enc, entries, rec: toMs(item.recorded) });
  }
  docs.sort((a, b) => a.rec - b.rec || (a.item.id < b.item.id ? -1 : 1));
  return docs;
}

// ---------- medications ----------

const SALTS = new Set(["hydrochloride", "hcl", "sodium", "potassium", "sulfate", "tartrate", "succinate", "maleate", "mesylate", "besylate", "calcium", "phosphate", "acetate", "citrate", "hydrobromide", "fumarate", "bromide", "trihydrate", "dihydrate", "monohydrate"]);

function ingredientName(drug: string): string {
  const words = drug.toLowerCase().replace(/\(.*?\)/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const w of words) {
    if (/\d/.test(w)) break;
    if (/^(tablet|tablets|capsule|capsules|tab|cap|inhaler|solution|injection|oral|pen|cream|ointment|patch)$/.test(w)) break;
    out.push(w);
  }
  while (out.length > 1 && SALTS.has(out[out.length - 1])) out.pop();
  return out.join(" ").replace(/[,;]+$/, "");
}

function normUnit(u: string): "mg" | "mcg" | "units" | "mL" | "tablet" | undefined {
  const x = u.toLowerCase().replace(/\./g, "");
  if (/^(mg|milligrams?)$/.test(x)) return "mg";
  if (/^(mcg|µg|μg|ug|micrograms?)$/.test(x)) return "mcg";
  if (/^(u|iu|units?)$/.test(x)) return "units";
  if (/^(ml|cc|milliliters?)$/.test(x)) return "mL";
  if (/^(tabs?|tablets?)$/.test(x)) return "tablet";
  return undefined;
}

function parseDose(doseText: string, sig: string): MedicationRow["dose"] {
  const t = (doseText ?? "").trim();
  if (/\d\s*(-|–|to)\s*\d/.test(t)) return undefined;
  let m = /^(\d+(?:\.\d+)?)\s*(?:x|×)\s*(\d+(?:\.\d+)?)\s*([A-Za-zµμ]+)/.exec(t);
  if (m) { const u = normUnit(m[3]); if (u) return { value: +m[1] * +m[2], unit: u }; }
  m = /^(\d+(?:\.\d+)?)\s*([A-Za-zµμ]+)/.exec(t);
  if (m) { const u = normUnit(m[2]); if (u) return { value: +m[1], unit: u }; }
  return undefined;
}

function parseFreq(sig: string): MedicationRow["frequency"] {
  const s = (sig ?? "").toLowerCase();
  if (!s) return undefined;
  if (/\bprn\b|as needed/.test(s)) return "PRN";
  if (/every other day|alternate day|\bqod\b|four times|\bqid\b|\bq6h\b|every 6 hours|monthly|taper|every \d+ days|twice weekly/.test(s)) return "other";
  if (/\bbid\b|twice|two times|every 12 h|\bq12h?\b/.test(s)) return "BID";
  if (/\btid\b|three times|every 8 h|\bq8h?\b/.test(s)) return "TID";
  if (/weekly|once a week|\bqw\b|every week/.test(s)) return "QW";
  if (/bedtime|\bqhs\b|\bhs\b|at night|nightly/.test(s)) return "QHS";
  if (/daily|once|\bqd\b|every day|every morning|each morning|every evening|in the morning|in the evening|\bqam\b/.test(s)) return "QD";
  return undefined;
}

const SENS_MEDS: [RegExp, Sensitivity][] = [
  [/quetiapine|olanzapine|risperidone|aripiprazole|lithium|sertraline|fluoxetine|citalopram|escitalopram|paroxetine|venlafaxine|bupropion|lamotrigine|haloperidol|clozapine|lurasidone|ziprasidone|buspirone|mirtazapine|trazodone|duloxetine|alprazolam|lorazepam|clonazepam|diazepam/i, "mental-health"],
  [/buprenorphine|naltrexone|methadone|naloxone|disulfiram|acamprosate|varenicline/i, "substance-use"],
  [/ethinyl|estradiol|norethindrone|levonorgestrel|medroxyprogesterone|drospirenone|etonogestrel|sildenafil|tadalafil/i, "sexual-reproductive-health"],
  [/tenofovir|emtricitabine|dolutegravir|bictegravir|efavirenz|raltegravir|darunavir|ritonavir|lamivudine|abacavir|zidovudine|rilpivirine|doxycycline.*pep/i, "hiv-sti"],
];

function sensFromText(t: string, patterns: [RegExp, Sensitivity][]): Sensitivity[] | undefined {
  const out: Sensitivity[] = [];
  for (const [re, s] of patterns) if (re.test(t) && !out.includes(s)) out.push(s);
  return out.length ? out : undefined;
}

type MedState = { cat: "active" | "held" | "stopped" | "unknown"; date?: string };

function medCat(status: string): MedState["cat"] {
  switch (status) {
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
    default: return "unknown";
  }
}

function docDate(d: Doc): string | undefined {
  if (d.kind === "discharge_summary" && d.enc.discharged) return localDate(d.enc.discharged);
  return localDate(d.item.effective) ?? localDate(d.item.recorded);
}

function medKey(e: any): string {
  return str(e.rxnorm_ingredient) ?? "n:" + ingredientName(String(e.drug_name ?? ""));
}

function pickLine(entries: Entry[]): Entry {
  return entries[entries.length - 1];
}

function buildMedications(docs: Doc[]): MedicationRow[] {
  const withMeds = docs.filter((d) => d.entries.some((x) => x.e.type === "home_med"));
  if (!withMeds.length) return [];
  // the current list: the latest encounter's final word (latest discharge summary) or else its latest snapshot
  const encOf = (d: Doc) => str(d.enc.encounter_id) ?? "";
  const startOf = (d: Doc) => {
    const ms = toMs(d.enc.arrived ?? d.enc.admitted ?? d.item.effective);
    return isNaN(ms) ? d.rec : ms;
  };
  let latest = withMeds[withMeds.length - 1];
  const sameEnc = withMeds.filter((d) => encOf(d) === encOf(latest) && encOf(d) !== "");
  if (sameEnc.length) {
    const ds = sameEnc.filter((d) => d.kind === "discharge_summary");
    latest = ds.length ? ds[ds.length - 1] : sameEnc[sameEnc.length - 1];
  }
  void startOf;
  const lines = new Map<string, Entry[]>();
  for (const x of latest.entries) if (x.e.type === "home_med") {
    const k = medKey(x.e);
    if (!lines.has(k)) lines.set(k, []);
    lines.get(k)!.push(x);
  }
  const rows: MedicationRow[] = [];
  for (const [k, ents] of lines) {
    const pick = pickLine(ents);
    const e = pick.e;
    const cat = medCat(e.status);
    const evidence: Evidence = [{ item_id: latest.item.id, entry_id: pick.key }];

    // walk back through earlier snapshots to find when this status began
    let since: string | undefined = docDate(latest);
    let began = latest;
    let prevCat: MedState["cat"] | undefined;
    const idx = withMeds.indexOf(latest);
    for (let i = idx - 1; i >= 0; i--) {
      const d = withMeds[i];
      const prev = d.entries.filter((x) => x.e.type === "home_med" && medKey(x.e) === k).pop();
      if (!prev) break;
      const pc = medCat(prev.e.status);
      if (prevCat === undefined) prevCat = pc;
      if (pc !== cat) break;
      began = d;
      since = docDate(d);
      evidence.push({ item_id: d.item.id, entry_id: prev.key });
    }
    void began;
    let status_since: string | undefined;
    if (cat === "held" || cat === "stopped") status_since = since;
    else if (cat === "active") {
      if (e.status === "new" || e.status === "changed" || (prevCat !== undefined && prevCat !== "active" && prevCat !== "unknown")) status_since = since;
      else if (e.status === "new") status_since = since;
    }

    const name = str(e.drug_name) ?? "";
    const ingredient = ingredientName(name) || undefined;
    const row: MedicationRow = {
      drug_name: name,
      status: cat,
      patient_reported: false,
      evidence,
    };
    if (ingredient) row.ingredient = ingredient;
    if (str(e.rxnorm_ingredient)) row.rxnorm_ingredient = e.rxnorm_ingredient;
    if (status_since) row.status_since = status_since;
    const dose = parseDose(e.dose_text, e.sig);
    if (dose) row.dose = dose;
    const fr = parseFreq(e.sig);
    if (fr) row.frequency = fr;
    if (str(e.instructions)) row.status_reason_text = e.instructions;
    if (cat === "stopped" && str(e.instructions)) {
      const t = e.instructions.toLowerCase();
      if (/rash|reaction|allerg|side effect|adverse|ketoacidosis|intoleran|angioedema/.test(t)) row.stop_reason = "adverse_reaction";
      else if (/replaced|switch|instead|changed to/.test(t)) row.stop_reason = "therapy_changed";
      else if (/course (complete|finished)|completed/.test(t)) row.stop_reason = "course_complete";
      else if (/ineffective|not effective|did not work/.test(t)) row.stop_reason = "ineffective";
    }
    const sens = sensFromText(name, SENS_MEDS);
    if (sens) row.sensitivity = sens;
    rows.push(row);
  }
  return rows;
}

// ---------- problems and drug-attributed allergies ----------

const CLASS_MEMBERS: [RegExp, string[]][] = [
  [/sglt2/i, ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"]],
  [/ace inhibitor|ace-inhibitor/i, ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril"]],
  [/penicillin/i, ["amoxicillin", "penicillin", "ampicillin", "piperacillin", "dicloxacillin"]],
  [/statin/i, ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin", "pitavastatin"]],
  [/cephalosporin/i, ["cephalexin", "cefazolin", "ceftriaxone", "cefuroxime", "cefdinir", "cefepime"]],
  [/sulfonamide|sulfa/i, ["sulfamethoxazole"]],
  [/fluoroquinolone/i, ["ciprofloxacin", "levofloxacin", "moxifloxacin"]],
  [/nsaid/i, ["ibuprofen", "naproxen", "diclofenac", "meloxicam", "ketorolac", "celecoxib"]],
  [/thiazide/i, ["hydrochlorothiazide", "chlorthalidone"]],
  [/beta[- ]?blocker/i, ["metoprolol", "atenolol", "carvedilol", "propranolol", "bisoprolol"]],
];

function drugAttribution(label: string, icd: string | undefined): string | undefined {
  if (icd && /^T(3[6-9]|4\d|50)\.[0-9A-Z]*5[A-Z]?$/i.test(icd)) {
    return label.replace(/^(adverse effect of|poisoning by)\s*/i, "").replace(/,?\s*(initial|subsequent) encounter.*$/i, "").trim() || label;
  }
  let m = /(?:adverse effect of|due to|caused by|secondary to)\s+(.+)$/i.exec(label);
  if (m) return m[1].trim();
  m = /^(.*?)[-\s](?:associated|induced)(?:\s|$)/i.exec(label.replace(/^.*,\s*/, ""));
  if (m && /inhibitor|blocker|statin|drug|[a-z]+(mide|pril|sartan|gliflozin|olol|azole|cillin|mycin|floxacin)\b/i.test(label)) return m[1].trim();
  return undefined;
}

function resolveSubstance(phrase: string, docMeds: Entry[]): { substance: string; rxnorm?: string } {
  const p = phrase.toLowerCase();
  for (const x of docMeds) {
    const ing = ingredientName(String(x.e.drug_name ?? ""));
    if (ing && p.includes(ing)) return { substance: ing, rxnorm: str(x.e.rxnorm_ingredient) };
  }
  for (const [re, members] of CLASS_MEMBERS) {
    if (re.test(p)) {
      const hits = docMeds.filter((x) => members.includes(ingredientName(String(x.e.drug_name ?? ""))));
      const names = new Set(hits.map((x) => ingredientName(String(x.e.drug_name))));
      if (names.size === 1) return { substance: [...names][0], rxnorm: str(hits[0].e.rxnorm_ingredient) };
      break;
    }
  }
  const single = phrase.trim();
  return { substance: single };
}

function ckdFrom(text: string, icd: string | undefined): { stage?: ProblemRow["ckd_stage"]; alb?: ProblemRow["albuminuria"] } {
  const t = text.toLowerCase();
  let stage: ProblemRow["ckd_stage"];
  let m = /\bg([1-5])\s*([ab])?\b/i.exec(text);
  if (m) stage = (`G${m[1]}${m[1] === "3" && m[2] ? m[2].toLowerCase() : ""}`) as ProblemRow["ckd_stage"];
  if (!stage && (m = /stage\s*(3\s*a|3\s*b|[1-5])\b/i.exec(t))) {
    const s = m[1].replace(/\s/g, "");
    stage = (s === "3" ? undefined : `G${s}`) as ProblemRow["ckd_stage"];
  }
  if (!stage && icd) {
    const c = icd.toUpperCase();
    const map: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
    stage = map[c];
  }
  let alb: ProblemRow["albuminuria"];
  const am = /\ba([1-3])\b/i.exec(text);
  if (am) alb = ("A" + am[1]) as ProblemRow["albuminuria"];
  return { stage, alb };
}

const SENS_DX: [RegExp, Sensitivity][] = [
  [/bipolar|schizophren|depress|anxiety|psychosis|psychotic|ptsd|mania|suicid|adhd|panic|mental/i, "mental-health"],
  [/alcohol|opioid use|substance|cocaine|cannabis use|nicotine|tobacco use|overdose|withdrawal|stimulant use/i, "substance-use"],
  [/pregnan|contracept|infertil|gestation|menopaus|erectile/i, "sexual-reproductive-health"],
  [/\bhiv\b|chlamydia|gonorrh|syphilis|herpes simplex genital|hepatitis c|sexually transmitted/i, "hiv-sti"],
  [/brca|genetic|hereditary|cystic fibrosis|huntington|sickle cell|trisomy|down syndrome|hemophilia/i, "genetic"],
];

interface ProbState { key: string; label: string; icd?: string; snomed?: string; status: "active" | "resolved"; onset?: ProblemRow["onset"]; evidence: Evidence; riv?: string; sensText: string }

function normLabel(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }

function parseOnset(t: string | undefined): ProblemRow["onset"] | undefined {
  if (!t) return undefined;
  const s = t.trim();
  let m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(s);
  if (m) return { value: s, precision: "day" };
  m = /^(\d{4})-(\d\d)$/.exec(s);
  if (m) return { value: s, precision: "month" };
  if (/^\d{4}$/.test(s)) return { value: s, precision: "year" };
  return undefined;
}

function buildProblems(docs: Doc[]): { problems: ProblemRow[]; derived: AllergyIntoleranceRow[] } {
  const states = new Map<string, ProbState>();
  const derived = new Map<string, AllergyIntoleranceRow>();
  const keyForIcd = new Map<string, string>(); // icd -> key of a riverside-keyed group
  for (const d of docs) for (const x of d.entries) {
    if (x.e.type === "diagnosis" && x.e.riverside_dx?.code && str(x.e.icd10cm)) keyForIcd.set(x.e.icd10cm, "rv:" + x.e.riverside_dx.code);
  }
  for (const d of docs) {
    const meds = d.entries.filter((x) => x.e.type === "home_med");
    for (const x of d.entries) {
      const e = x.e;
      if (e.type !== "diagnosis" && e.type !== "history") continue;
      const label = String(e.label ?? e.condition ?? "").trim();
      if (!label) continue;
      const icd = str(e.icd10cm);
      let key: string;
      if (e.type === "diagnosis" && e.riverside_dx?.code) key = "rv:" + e.riverside_dx.code;
      else if (icd && keyForIcd.has(icd)) key = keyForIcd.get(icd)!;
      else if (icd) key = "icd:" + icd;
      else key = "lb:" + normLabel(label);
      const evidence: Evidence = [{ item_id: d.item.id, entry_id: x.key }];
      const status = e.type === "history" ? "active" : e.status;

      if (e.type === "diagnosis" && (status === "active" || status === "resolved")) {
        const attr = drugAttribution(label, icd);
        if (attr) {
          const sub = resolveSubstance(attr, meds);
          const dkey = sub.substance.toLowerCase();
          const row: AllergyIntoleranceRow = {
            substance: sub.substance,
            reaction_type: "serious_adverse_event",
            mechanism: "unknown",
            criticality: "unknown",
            evidence,
          };
          if (sub.rxnorm) row.rxnorm_ingredient = sub.rxnorm;
          const prev = derived.get(dkey);
          if (prev) row.evidence = [...prev.evidence.filter((v) => v.item_id !== d.item.id), ...evidence];
          derived.set(dkey, row);
          // adverse-effect code naming no condition: allergy only
          if (icd && /^T\d\d/i.test(icd)) continue;
        }
      }

      if (e.type === "diagnosis" && status === "ruled_out") { states.delete(key); continue; }
      if (e.type === "diagnosis" && status === "working") continue;
      if (status !== "active" && status !== "resolved") continue;

      const prev = states.get(key);
      const ck = ckdFrom(label, icd);
      const st: ProbState = {
        key, label, icd, status,
        evidence: prev ? [...prev.evidence.filter((v) => v.item_id !== d.item.id), ...evidence] : evidence,
        sensText: label,
        onset: e.type === "history" ? parseOnset(e.onset_text) : prev?.onset,
      };
      (st as any).ck = ck;
      if (prev && !st.onset) st.onset = prev.onset;
      states.set(key, st);
    }
  }
  const problems: ProblemRow[] = [];
  for (const st of states.values()) {
    const row: ProblemRow = { condition: st.label, status: st.status, evidence: st.evidence };
    if (st.icd) row.icd10cm = st.icd;
    if (st.onset) row.onset = st.onset;
    const ck = (st as any).ck as ReturnType<typeof ckdFrom>;
    if (ck.stage) row.ckd_stage = ck.stage;
    if (ck.alb) row.albuminuria = ck.alb;
    const sens = sensFromText(st.sensText, SENS_DX);
    if (sens) row.sensitivity = sens;
    problems.push(row);
  }
  return { problems, derived: [...derived.values()] };
}

// ---------- allergies ----------

function classifyReaction(reaction: string | undefined, severity: string): AllergyIntoleranceRow["reaction_type"] {
  const r = (reaction ?? "").toLowerCase();
  if (/hive|urticaria|rash|swell|angioedema|anaphyla|bronchospasm|wheez|itch|pruritus|stevens|dress|edema|throat|difficulty breathing|shortness of breath/.test(r)) return "hypersensitivity";
  if (/liver|hepat|pancreatit|kidney|renal|nephro|marrow|agranulocyt|cytopenia|rhabdo|torsades|arrhythm|bleed|hemorrhag|ketoacidosis|seizure|failure|injury|toxicity|neuropath|tendon/.test(r)) return "serious_adverse_event";
  if (!r && severity === "severe") return "hypersensitivity";
  return "side_effect";
}

function buildAllergies(docs: Doc[], derived: AllergyIntoleranceRow[]): AllergyIntoleranceRow[] {
  const out = new Map<string, AllergyIntoleranceRow>();
  const withList = docs.filter((d) => d.entries.some((x) => x.e.type === "allergy"));
  const latest = withList[withList.length - 1];
  if (latest) {
    for (const x of latest.entries) {
      if (x.e.type !== "allergy") continue;
      const sub = str(x.e.substance);
      if (!sub || /^(nkda|nka|no known (drug )?allergies)$/i.test(sub.trim())) continue;
      const sev = String(x.e.severity ?? "unknown");
      const reaction = str(x.e.reaction);
      const row: AllergyIntoleranceRow = {
        substance: sub.trim().toLowerCase() === sub.trim() || /^[A-Z][a-z]+$/.test(sub.trim()) ? sub.trim() : sub.trim(),
        reaction_type: classifyReaction(reaction, sev),
        mechanism: "unknown",
        criticality: sev === "severe" ? "high" : sev === "mild" ? "low" : sev === "moderate" ? "low" : "unknown",
        evidence: [{ item_id: latest.item.id, entry_id: x.key }],
      };
      if (str(x.e.rxnorm_ingredient)) row.rxnorm_ingredient = x.e.rxnorm_ingredient;
      if (reaction) row.reaction = reaction;
      if (row.rxnorm_ingredient) row.substance = row.substance.toLowerCase();
      out.set(row.substance.toLowerCase(), row);
    }
  }
  for (const r of derived) {
    const k = r.substance.toLowerCase();
    if (out.has(k)) {
      out.get(k)!.evidence.push(...r.evidence);
    } else {
      out.set(k, r);
    }
  }
  return [...out.values()];
}

// ---------- labs ----------

const CODE_MAP: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc",
  HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", TROP: "troponin", TNI: "troponin",
  CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl",
};
const LOINC_MAP: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr", "2823-3": "potassium", "6298-4": "potassium",
  "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "33037-3": "anion_gap", "3094-0": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "4549-2": "a1c", "17856-6": "a1c", "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "20509-6": "hemoglobin",
  "1759-0": "bhb", "53063-4": "bhb", "2753-2": "bhb", "2744-1": "ph", "11558-4": "ph", "2019-8": "pco2", "11557-6": "pco2", "3040-3": "lipase",
  "10839-9": "troponin", "49563-0": "troponin", "89579-7": "troponin", "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "13457-7": "ldl", "2089-1": "ldl", "18262-6": "ldl",
};

function analyteOf(test: { local_code?: string; loinc?: string; name?: string }): Analyte | undefined {
  const name = (test.name ?? "").toLowerCase();
  if (/egfr|glomerular/.test(name)) return "egfr";
  if (test.loinc && LOINC_MAP[test.loinc]) return LOINC_MAP[test.loinc];
  const c = (test.local_code ?? "").toUpperCase();
  if (CODE_MAP[c]) return CODE_MAP[c];
  if (/beta.?hydroxy/.test(name)) return "bhb";
  if (/anion gap/.test(name)) return "anion_gap";
  if (/lipase/.test(name)) return "lipase";
  if (/troponin/.test(name)) return "troponin";
  if (/hemoglobin a1c|hba1c/.test(name)) return "a1c";
  return undefined;
}

const UNIT_OF: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L", bicarbonate: "mmol/L", anion_gap: "mmol/L",
  bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]",
  pco2: "mmHg", lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function convert(a: Analyte, v: number, unit: string | undefined): number | undefined {
  const u = (unit ?? "").trim().toLowerCase().replace(/µ/g, "u").replace(/μ/g, "u");
  const target = UNIT_OF[a].toLowerCase();
  if (!u || u === target) return v;
  switch (a) {
    case "creatinine": if (u === "umol/l") return v / 88.4; break;
    case "glucose": if (u === "mmol/l") return v * 18.016; break;
    case "bun": if (u === "mmol/l") return v * 2.801; break;
    case "cholesterol": case "hdl": case "ldl": if (u === "mmol/l") return v * 38.67; break;
    case "triglycerides": if (u === "mmol/l") return v * 88.57; break;
    case "hemoglobin": if (u === "g/l") return v / 10; if (u === "mmol/l") return v * 1.611; break;
    case "platelets": case "wbc":
      if (u === "10*3/ul" || u === "k/ul" || u === "x10^3/ul" || u === "10^3/ul" || u === "10*9/l" || u === "10^9/l" || u === "g/l") return v;
      if (u === "/ul" || u === "cells/ul" || u === "/mm3" || u === "cells/mm3") return v / 1000;
      break;
    case "a1c": if (u === "mmol/mol") return v * 0.09148 + 2.152; break;
    case "troponin": if (u === "ng/l" || u === "pg/ml") return v / 1000; break;
    case "uacr": if (u === "mg/mmol") return v * 8.84; break;
    case "bhb": if (u === "mg/dl") return v / 10.41; break;
    case "pco2": if (u === "kpa") return v * 7.50062; break;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": if (u === "meq/l") return v; break;
    default: break;
  }
  return undefined;
}

const STATUS_RANK: Record<string, number> = { preliminary: 0, final: 1, corrected: 2 };

interface LabCand { analyte: Analyte; rv: any; acc: string; collected: string; status: string; ev: { item_id: string; entry_id: string }; rec: number; spec: any }

function buildLabs(docs: Doc[]): LabResultRow[] {
  const groups = new Map<string, LabCand[]>();
  const add = (d: Doc, key: string, rv: any, parent: any) => {
    if (!rv || typeof rv.test !== "object" || rv.test === null) return;
    const analyte = analyteOf(rv.test);
    if (!analyte) return;
    const acc = String(parent.accession ?? "");
    const collected = String(parent.collected ?? "");
    const gk = `${acc || collected}|${rv.test.local_code ?? analyte}|${analyte}`;
    const cand: LabCand = { analyte, rv, acc, collected, status: String(parent.status ?? "final"), ev: { item_id: d.item.id, entry_id: key }, rec: d.rec, spec: parent };
    if (!groups.has(gk)) groups.set(gk, []);
    groups.get(gk)!.push(cand);
  };
  for (const d of docs) for (const x of d.entries) {
    if (x.e.type === "result") add(d, x.key, x.e, x.e);
    else if (x.e.type === "panel" && Array.isArray(x.e.components)) for (const c of x.e.components) add(d, x.key, c, x.e);
  }
  const rows: LabResultRow[] = [];
  for (const cands of groups.values()) {
    cands.sort((a, b) => (STATUS_RANK[a.status] ?? 1) - (STATUS_RANK[b.status] ?? 1) || a.rec - b.rec);
    const best = cands[cands.length - 1];
    const rv = best.rv;
    const raw = String(rv.value ?? "").trim();
    const m = /^(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)$/.exec(raw);
    if (!m) continue;
    const analyte = best.analyte;
    if (analyte === "egfr" && /race|african|black/i.test(rv.test.name ?? "") && !/race-free|without|2021/i.test(rv.test.name ?? "")) continue;
    let v = convert(analyte, parseFloat(m[2]), rv.unit);
    if (v === undefined) continue;
    v = Math.round(v * 10000) / 10000;
    const collected = isoWithOffset(best.collected);
    if (!collected) continue;
    const row: LabResultRow = {
      analyte, value: v, unit: UNIT_OF[analyte], collected,
      status: best.status === "preliminary" ? "preliminary" : "final",
      evidence: [],
    };
    if (m[1]) row.comparator = m[1] as LabResultRow["comparator"];
    if (analyte === "egfr") {
      const n = String(rv.test.name ?? "") + " " + String(rv.test.local_code ?? "");
      row.egfr_equation = /2021/.test(n) ? "ckd-epi-2021" : /2009/.test(n) ? "ckd-epi-2009" : /mdrd/i.test(n) ? "mdrd" : "unknown";
    }
    if (str(rv.test.loinc)) row.loinc = rv.test.loinc;
    const seen = new Set<string>();
    const ordered = [best, ...cands.slice().reverse().filter((c) => c !== best)];
    for (const c of ordered) {
      const k = c.ev.item_id + "|" + c.ev.entry_id;
      if (!seen.has(k)) { seen.add(k); row.evidence.push(c.ev); }
    }
    rows.push(row);
  }
  rows.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
  return rows;
}

// ---------- vitals ----------

function buildVitals(docs: Doc[]): VitalRow[] {
  const byTime = new Map<number, VitalRow>();
  for (const d of docs) for (const x of d.entries) {
    if (x.e.type !== "vitals") continue;
    const e = x.e;
    const ms = toMs(e.taken);
    const lt = localMinute(e.taken);
    if (isNaN(ms) || !lt) continue;
    const ev = { item_id: d.item.id, entry_id: x.key };
    const prev = byTime.get(ms);
    if (prev) { prev.evidence.push(ev); continue; }
    const row: VitalRow = { setting: "hospital", local_time: lt, evidence: [ev] };
    if (e.bp && typeof e.bp.systolic_mmhg === "number") { row.systolic_mmhg = e.bp.systolic_mmhg; row.diastolic_mmhg = e.bp.diastolic_mmhg; }
    if (typeof e.heart_rate_bpm === "number") row.pulse_bpm = e.heart_rate_bpm;
    if (typeof e.weight_kg === "number") row.weight_kg = Math.round(e.weight_kg * 10) / 10;
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    byTime.set(ms, row);
  }
  return [...byTime.entries()].sort((a, b) => a[0] - b[0]).map((x) => x[1]);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  try {
    const docs = buildDocs(selectItems(items ?? [], asOf));
    const { problems, derived } = buildProblems(docs);
    return {
      medications: buildMedications(docs),
      problems,
      allergies: buildAllergies(docs, derived),
      labs: buildLabs(docs),
      vitals: buildVitals(docs),
    };
  } catch {
    return { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  }
}
