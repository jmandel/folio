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

// ─── time helpers ────────────────────────────────────────────────────────────────────────────────

const TZ = "America/Chicago";
let fmt: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number): { y: string; mo: string; d: string; h: string; mi: string } | null {
  try {
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
    const parts: Record<string, string> = {};
    for (const p of fmt.formatToParts(new Date(ms))) parts[p.type] = p.value;
    const h = parts.hour === "24" ? "00" : parts.hour;
    return { y: parts.year, mo: parts.month, d: parts.day, h, mi: parts.minute };
  } catch {
    return null;
  }
}

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;
const LOCAL_DT = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/;

/** Instant in ms; a zoneless date-time is read as Chicago wall-clock. */
function instant(s: unknown): number | null {
  if (typeof s !== "string" || !s) return null;
  if (HAS_ZONE.test(s)) {
    const t = Date.parse(s);
    return Number.isNaN(t) ? null : t;
  }
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?)?)?$/.exec(s);
  if (!m) return null;
  return chicagoWallToUtc(+m[1], +(m[2] ?? 1), +(m[3] ?? 1), +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
}

function chicagoWallToUtc(y: number, mo: number, d: number, h: number, mi: number, s: number): number {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  // Try both possible offsets (CST -6, CDT -5) and keep the one that round-trips.
  for (const off of [5, 6]) {
    const t = guess + off * 3600000;
    const p = chicagoParts(t);
    if (p && +p.h === h && +p.d === d) return t;
  }
  return guess + 6 * 3600000;
}

function localDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  if (!HAS_ZONE.test(s)) {
    const m = /^(\d{4}(?:-\d{2}(?:-\d{2})?)?)/.exec(s);
    return m ? m[1] : undefined;
  }
  const t = instant(s);
  if (t === null) return undefined;
  const p = chicagoParts(t);
  return p ? `${p.y}-${p.mo}-${p.d}` : undefined;
}

function localDateTime(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  if (!HAS_ZONE.test(s)) {
    const m = LOCAL_DT.exec(s);
    return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}` : undefined;
  }
  const t = instant(s);
  if (t === null) return undefined;
  const p = chicagoParts(t);
  return p ? `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}` : undefined;
}

function endOfAsOf(asOf: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(asOf);
  if (!m) return Number.POSITIVE_INFINITY;
  const next = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + 1));
  return chicagoWallToUtc(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), 0, 0, 0);
}

function precisionOf(v: string): "year" | "month" | "day" {
  return v.length <= 4 ? "year" : v.length <= 7 ? "month" : "day";
}

// ─── generic helpers ─────────────────────────────────────────────────────────────────────────────

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const isObj = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

interface Doc {
  item: FolioItem;
  rec: number; // recorded instant
  time: number; // clinical time of the document (end of the documented period)
}

interface Ent {
  doc: Doc;
  id: string;
  e: Record<string, any>;
}

function cmpDoc(a: Doc, b: Doc): number {
  return a.time - b.time || a.rec - b.rec || (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0);
}

function addEv(ev: Evidence, item_id: string, entry_id?: string) {
  if (!ev.some((x) => x.item_id === item_id && x.entry_id === entry_id)) ev.push(entry_id ? { item_id, entry_id } : { item_id });
}

/** Sensitivity flags an entry may carry beyond the documented schema. */
function markedSensitivity(e: Record<string, any>): Sensitivity[] {
  const out: Sensitivity[] = [];
  const raw = [e.sensitivity, e.restricted, e.confidentiality, e.restriction, e.sensitive]
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .filter((v) => typeof v === "string")
    .join(" ")
    .toLowerCase();
  if (/behavior|mental|psych/.test(raw)) out.push("mental-health");
  if (/substance|sud|alcohol|42 ?cfr|part ?2/.test(raw)) out.push("substance-use");
  if (/reproduct|sexual|pregnan|contracep/.test(raw)) out.push("sexual-reproductive-health");
  if (/hiv|sti|std/.test(raw)) out.push("hiv-sti");
  if (/genetic/.test(raw)) out.push("genetic");
  return out;
}

function icdSensitivity(icd: string | undefined, text: string): Sensitivity[] {
  const out: Sensitivity[] = [];
  const c = (icd ?? "").toUpperCase();
  const t = text.toLowerCase();
  if (/^F1[0-9]/.test(c) && !/^F17/.test(c)) out.push("substance-use");
  else if (/^F/.test(c)) out.push("mental-health");
  if (/^(B2[0-4]|Z21|A5[0-9]|A6[0-4]|Z20\.6)/.test(c) || /\bhiv\b|syphilis|chlamydia|gonorrh/.test(t)) out.push("hiv-sti");
  if (/^(O|Z3[0-6]|Z30)/.test(c) || /pregnan|contracept/.test(t)) out.push("sexual-reproductive-health");
  if (!c && /depress|anxiety|bipolar|schizo|ptsd|psychos/.test(t)) out.push("mental-health");
  if (!c && /(alcohol|opioid|cocaine|stimulant|cannabis) (use|dependence|abuse)/.test(t)) out.push("substance-use");
  return out;
}

const MH_DRUGS = /\b(sertraline|fluoxetine|paroxetine|citalopram|escitalopram|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|lithium|quetiapine|olanzapine|risperidone|aripiprazole|haloperidol|lurasidone|clozapine|ziprasidone|lamotrigine|buspirone|lorazepam|alprazolam|clonazepam|diazepam|amitriptyline|nortriptyline)\b/;
const SU_DRUGS = /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|varenicline)\b/;
const HIV_DRUGS = /\b(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|efavirenz|rilpivirine|darunavir|abacavir|lamivudine|zidovudine|cabotegravir)\b/;
const REPRO_DRUGS = /\b(levonorgestrel|norethindrone|ethinyl estradiol|medroxyprogesterone|etonogestrel|drospirenone|norgestimate)\b/;

function drugSensitivity(name: string): Sensitivity[] {
  const n = name.toLowerCase();
  const out: Sensitivity[] = [];
  if (MH_DRUGS.test(n)) out.push("mental-health");
  if (SU_DRUGS.test(n)) out.push("substance-use");
  if (HIV_DRUGS.test(n)) out.push("hiv-sti");
  if (REPRO_DRUGS.test(n)) out.push("sexual-reproductive-health");
  return out;
}

function uniq<T>(a: T[]): T[] {
  return [...new Set(a)];
}

// ─── drug names ──────────────────────────────────────────────────────────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro",
  novolog: "insulin aspart", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide", januvia: "sitagliptin",
  tradjenta: "linagliptin", cozaar: "losartan", zestril: "lisinopril", prinivil: "lisinopril",
  norvasc: "amlodipine", lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  lasix: "furosemide", aldactone: "spironolactone", kerendia: "finerenone", diovan: "valsartan",
  benicar: "olmesartan", toprol: "metoprolol", lopressor: "metoprolol", coreg: "carvedilol",
  synthroid: "levothyroxine", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin",
  plavix: "clopidogrel", aleve: "naproxen", naprosyn: "naproxen", advil: "ibuprofen", motrin: "ibuprofen",
  tylenol: "acetaminophen", prilosec: "omeprazole", nexium: "esomeprazole", zoloft: "sertraline",
  prozac: "fluoxetine", lexapro: "escitalopram", glucotrol: "glipizide", amaryl: "glimepiride",
  microzide: "hydrochlorothiazide", zyloprim: "allopurinol", neurontin: "gabapentin",
};

const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "oral", "po", "er", "xr", "sr", "dr",
  "extended", "delayed", "release", "solution", "suspension", "injection", "injectable", "pen", "prefilled",
  "syringe", "subq", "subcutaneous", "iv", "intravenous", "topical", "cream", "ointment", "patch", "inhaler",
  "film", "coated", "chewable", "disintegrating", "odt", "vial", "kwikpen", "flexpen", "solostar", "u",
]);
const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "succinate", "tartrate", "calcium",
  "mesylate", "fumarate", "citrate", "sulfate", "bromide", "magnesium", "acetate", "phosphate", "dihydrate",
  "monohydrate", "trihydrate", "hyclate", "propionate", "furoate", "bitartrate", "disodium",
]);

function ingredientOf(drugName: string): string | undefined {
  let n = drugName.toLowerCase().replace(/\([^)]*\)/g, " ");
  const cut = n.search(/\d/);
  if (cut >= 0) n = n.slice(0, cut);
  const words = n.split(/[^a-z0-9\-/]+/).filter((w) => w && !FORM_WORDS.has(w));
  if (!words.length) return undefined;
  for (const w of words) if (BRANDS[w]) return BRANDS[w];
  // strip trailing salts, but keep a salt that is the drug itself (potassium chloride)
  const out = [...words];
  if (!(out[0] === "potassium" || out[0] === "sodium" || out[0] === "calcium" || out[0] === "magnesium")) {
    while (out.length > 1 && SALTS.has(out[out.length - 1])) out.pop();
  }
  const r = out.join(" ").trim();
  return r || undefined;
}

// ─── main ────────────────────────────────────────────────────────────────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const rows: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items)) return rows;
  const cutoff = endOfAsOf(asOf);

  const inScope = items.filter((it) => {
    if (!isObj(it) || typeof it.id !== "string") return false;
    const r = instant(it.recorded);
    return r !== null && r < cutoff;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const k of ["supersedes", "retracts"] as const) {
      const v = (it as any)[k];
      if (Array.isArray(v)) for (const id of v) if (typeof id === "string") dead.add(`${it.issuer}|${id}`);
    }
  }
  const docs: Doc[] = inScope
    .filter((it) => !dead.has(`${it.issuer}|${it.id}`) && isObj(it.payload))
    .map((it) => {
      const rec = instant(it.recorded) ?? 0;
      const time = instant(it.effective_end) ?? instant(it.effective) ?? rec;
      return { item: it, rec, time };
    })
    .sort(cmpDoc);

  const ents: Ent[] = [];
  for (const d of docs) {
    for (const [id, e] of Object.entries(d.item.payload)) if (isObj(e) && typeof e.type === "string") ents.push({ doc: d, id, e });
  }
  const byType = (t: string) => ents.filter((x) => x.e.type === t);

  const safe = (f: () => void) => {
    try {
      f();
    } catch {
      /* skip what cannot be read */
    }
  };
  safe(() => (rows.medications = medications(docs, byType("home_med"))));
  safe(() => (rows.problems = problems(byType("diagnosis"), byType("history"))));
  safe(() => (rows.allergies = allergies(byType("allergy"), byType("diagnosis"), ents)));
  safe(() => (rows.labs = labs(ents)));
  safe(() => (rows.vitals = vitals(byType("vitals"), ents)));
  return rows;
}

// ─── medications ─────────────────────────────────────────────────────────────────────────────────

type MedStatus = MedicationRow["status"];
const STATUS_MAP: Record<string, MedStatus> = {
  not_reconciled: "unknown", continue: "active", new: "active", changed: "active", held: "held", stopped: "stopped",
};

function medKey(e: Record<string, any>): string | undefined {
  const name = str(e.drug_name);
  const ing = name ? ingredientOf(name) : undefined;
  if (ing) return "i:" + ing;
  const rx = str(e.rxnorm_ingredient);
  if (rx) return "r:" + rx;
  return name ? "n:" + norm(name) : undefined;
}

function parseAmount(s: string): { value: number; unit: "mg" | "mcg" | "units" | "mL" } | undefined {
  const m = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|ug|units?|unt|\[iu\]|iu|ml)\b/i.exec(s);
  if (!m) return undefined;
  const u = m[2].toLowerCase();
  const unit = u === "mg" ? "mg" : u === "ml" ? "mL" : /^(mcg|µg|ug)$/.test(u) ? "mcg" : "units";
  return { value: parseFloat(m[1]), unit };
}

const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5 };

function tabletCount(sig: string): number | null | undefined {
  // undefined: no count stated; null: a range (no single amount)
  const s = sig.toLowerCase();
  if (/\d+(?:\.\d+)?\s*(?:-|to|or)\s*\d+(?:\.\d+)?\s*(tab|cap|pill)/.test(s)) return null;
  const m = /(\d+(?:\.\d+)?|one|two|three|four|half)\s*(?:x\s*)?(tab|tablet|tabs|cap|capsule|caps|pill)/.exec(s);
  if (!m) return undefined;
  return WORD_NUM[m[1]] ?? parseFloat(m[1]);
}

function medDose(e: Record<string, any>): MedicationRow["dose"] | undefined {
  const doseText = str(e.dose_text) ?? "";
  const sig = str(e.sig) ?? "";
  const name = str(e.drug_name) ?? "";
  if (/sliding|scale|per protocol|titrat/i.test(doseText + " " + sig)) return undefined;
  if (/\d+(?:\.\d+)?\s*(?:-|to|or)\s*\d+(?:\.\d+)?\s*(mg|mcg|units?|ml)\b/i.test(doseText)) return undefined;
  const count = tabletCount(sig);
  if (count === null) return undefined;
  const strength = parseAmount(name);
  const dt = parseAmount(doseText);
  // Units-based or volume-based doses stated in the sig ("18 units")
  if (dt) {
    if (count !== undefined && count !== 1 && strength && strength.unit === dt.unit && strength.value === dt.value) {
      return { value: +(dt.value * count).toFixed(4), unit: dt.unit };
    }
    return dt;
  }
  const sigAmt = parseAmount(sig);
  if (sigAmt) return sigAmt;
  if (strength && /tab|cap|pill/i.test(name)) return { value: +(strength.value * (count ?? 1)).toFixed(4), unit: strength.unit };
  if (count !== undefined && /tab|cap|pill/i.test(sig + " " + name)) return { value: count, unit: "tablet" };
  return undefined;
}

function medFrequency(sig: string | undefined): MedicationRow["frequency"] | undefined {
  if (!sig) return undefined;
  const s = " " + sig.toLowerCase() + " ";
  if (/\bprn\b|as needed|when needed|if needed/.test(s)) return "PRN";
  if (/\b(tid|three times)/.test(s)) return "TID";
  if (/\b(bid|twice)/.test(s)) return "BID";
  if (/\b(qid|four times|q\d+h|every \d+ hours)/.test(s)) return "other";
  if (/\b(qhs|at bedtime|nightly at bedtime|bedtime|hs)\b/.test(s)) return "QHS";
  if (/\b(weekly|qw|qweek|once a week|every week)\b/.test(s)) return "QW";
  if (/\b(daily|qd|once a day|every day|every morning|qam|q24h|nightly|each morning|in the morning)\b/.test(s)) return "QD";
  return "other";
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] | undefined {
  if (!text) return undefined;
  const t = text.toLowerCase();
  if (/adverse|side effect|reaction|intoleran|allerg|caused|associated|angioedema|cough|rash|ketoacidosis|hyperkalemia|toxicity/.test(t)) return "adverse_reaction";
  if (/ineffective|not effective|not working|inadequate|insufficient|failed|lack of (effect|efficacy)/.test(t)) return "ineffective";
  if (/replac|switch|changed to|instead|in favor of|substitut/.test(t)) return "therapy_changed";
  if (/course (complete|finished|done)|completed|finished/.test(t)) return "course_complete";
  if (/patient (declin|refus|prefer|choice|chose|request|wish)|declined|refused/.test(t)) return "patient_choice";
  return "other";
}

function medications(docs: Doc[], meds: Ent[]): MedicationRow[] {
  // Each document restates the home-medication list: the latest document carrying one is the list.
  const snapDocs = docs.filter((d) => meds.some((m) => m.doc === d));
  if (!snapDocs.length) return [];
  const snaps = snapDocs.map((d) => {
    const map = new Map<string, Ent>();
    for (const m of meds) {
      if (m.doc !== d) continue;
      const k = medKey(m.e);
      if (!k || !str(m.e.drug_name)) continue;
      map.set(k, m);
    }
    return { doc: d, map };
  });
  const latest = snaps[snaps.length - 1];
  const out: MedicationRow[] = [];
  for (const [key, cur] of latest.map) {
    const e = cur.e;
    const raw = typeof e.status === "string" ? e.status : "";
    const status: MedStatus = STATUS_MAP[raw] ?? "unknown";
    const ev: Evidence = [];
    addEv(ev, cur.doc.item.id, cur.id);

    // Walk back through earlier snapshots to find when the current status began.
    let since: string | undefined;
    let reasonText = str(e.instructions);
    const dateOf = (d: Doc) => localDate(d.item.effective_end) ?? localDate(d.item.effective);
    if (status === "held" || status === "stopped") {
      let start = cur;
      for (let i = snaps.length - 2; i >= 0; i--) {
        const p = snaps[i].map.get(key);
        if (!p || p.e.status !== raw) break;
        start = p;
        if (!reasonText) reasonText = str(p.e.instructions);
      }
      since = dateOf(start.doc);
      if (start !== cur) addEv(ev, start.doc.item.id, start.id);
    } else if (status === "active") {
      if (raw === "new" || raw === "changed") since = dateOf(cur.doc);
      else {
        let start = cur;
        for (let i = snaps.length - 2; i >= 0; i--) {
          const p = snaps[i].map.get(key);
          const ps = p && typeof p.e.status === "string" ? p.e.status : "";
          if (!p) break;
          if (ps === "new" || ps === "changed") {
            start = p;
            since = dateOf(p.doc);
            break;
          }
          if (ps === "held" || ps === "stopped") {
            since = dateOf(start.doc);
            break;
          }
          if (ps !== "continue") break;
          start = p;
        }
        if (since && start !== cur) addEv(ev, start.doc.item.id, start.id);
      }
    }

    const name = str(e.drug_name)!;
    const row: MedicationRow = { drug_name: name, status, patient_reported: false, evidence: ev };
    const ing = ingredientOf(name);
    if (ing) row.ingredient = ing;
    const rx = str(e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;
    if (since) row.status_since = since;
    const dose = medDose(e);
    if (dose) row.dose = dose;
    const freq = medFrequency(str(e.sig));
    if (freq) row.frequency = freq;
    if (status === "held" || status === "stopped") {
      if (reasonText) row.status_reason_text = reasonText;
      if (status === "stopped") {
        const sr = stopReason(reasonText);
        if (sr) row.stop_reason = sr;
      }
    }
    if (/\b(otc|over[- ]the[- ]counter)\b/i.test(`${e.sig ?? ""} ${e.instructions ?? ""} ${e.dose_text ?? ""}`)) row.otc = true;
    const sens = uniq([...markedSensitivity(e), ...drugSensitivity(name)]);
    if (sens.length) row.sensitivity = sens;
    out.push(row);
  }
  return out;
}

// ─── problems ────────────────────────────────────────────────────────────────────────────────────

function ckdStage(icd: string | undefined, text: string): ProblemRow["ckd_stage"] | undefined {
  const c = (icd ?? "").toUpperCase();
  const m: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  if (m[c]) return m[c];
  const t = text.toLowerCase();
  const g = /\bg(1|2|3a|3b|4|5)\b/.exec(t) ?? /stage\s*(1|2|3a|3b|4|5)\b/.exec(t) ?? /stage\s*(i{1,3}|iv|v)(a|b)?\b/.exec(t);
  if (!g) return undefined;
  let v = g[1];
  const roman: Record<string, string> = { i: "1", ii: "2", iii: "3", iv: "4", v: "5" };
  if (roman[v]) v = roman[v] + (g[2] ?? "");
  const map: Record<string, ProblemRow["ckd_stage"]> = { "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5" };
  return map[v];
}

function isCkd(icd: string | undefined, text: string): boolean {
  return /^N18/i.test(icd ?? "") || /chronic kidney disease|\bckd\b/i.test(text);
}

function parseOnset(text: string | undefined): ProblemRow["onset"] | undefined {
  if (!text) return undefined;
  let m = /\b(\d{4})-(\d{2})-(\d{2})\b/.exec(text);
  if (m) return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
  m = /\b(\d{4})-(\d{2})\b/.exec(text);
  if (m) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const mm = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2},\s*)?(\d{4})\b/i.exec(text);
  if (mm) {
    const mo = String(months.indexOf(mm[1].toLowerCase()) + 1).padStart(2, "0");
    if (mm[2]) {
      const d = String(parseInt(mm[2], 10)).padStart(2, "0");
      return { value: `${mm[3]}-${mo}-${d}`, precision: "day" };
    }
    return { value: `${mm[3]}-${mo}`, precision: "month" };
  }
  m = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/.exec(text);
  if (m) return { value: `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`, precision: "day" };
  m = /\b(\d{1,2})\/(\d{4})\b/.exec(text);
  if (m) return { value: `${m[2]}-${m[1].padStart(2, "0")}`, precision: "month" };
  m = /\b(19\d{2}|20\d{2})\b/.exec(text);
  if (m) return { value: m[1], precision: "year" };
  return undefined;
}

/** T-code "adverse effect of" (6th character 5). */
function isAdverseEffectTCode(icd: string | undefined): boolean {
  return !!icd && /^T(3[6-9]|4[0-9]|50)\.?[0-9A-Z]{2}5/i.test(icd.replace(".", "").replace(/^(T\d\d)/i, "$1."));
}

class UF {
  p = new Map<string, string>();
  find(x: string): string {
    if (!this.p.has(x)) this.p.set(x, x);
    let r = x;
    while (this.p.get(r) !== r) r = this.p.get(r)!;
    this.p.set(x, r);
    return r;
  }
  union(a: string, b: string) {
    const ra = this.find(a), rb = this.find(b);
    if (ra !== rb) this.p.set(rb, ra);
  }
}

interface CondEnt {
  ent: Ent;
  label: string;
  icd?: string;
  status: "active" | "resolved" | "working" | "ruled_out";
  onset?: ProblemRow["onset"];
  keys: string[];
}

function problems(dx: Ent[], hx: Ent[]): ProblemRow[] {
  const cs: CondEnt[] = [];
  for (const x of dx) {
    const label = str(x.e.label) ?? str(x.e.riverside_dx?.name);
    if (!label) continue;
    const icd = str(x.e.icd10cm);
    const status = x.e.status;
    if (!["active", "resolved", "working", "ruled_out"].includes(status)) continue;
    // A T-code adverse-effect entry naming no condition yields only an allergy row.
    if (isAdverseEffectTCode(icd) && !/(associated|induced|related|due to)/i.test(label)) continue;
    const keys = [];
    if (icd && !isAdverseEffectTCode(icd)) keys.push("icd:" + icd.toUpperCase());
    const rc = str(x.e.riverside_dx?.code);
    if (rc) keys.push("rdx:" + rc);
    keys.push("lbl:" + norm(label));
    cs.push({ ent: x, label, icd, status, keys });
  }
  for (const x of hx) {
    const label = str(x.e.condition);
    if (!label) continue;
    const icd = str(x.e.icd10cm);
    const historical = /\bresolved\b|\bhistory of\b|\bh\/o\b|\bs\/p\b|\bremote\b|\bin remission\b|\bpast\b|\bprior\b|\bformer\b/i.test(label);
    const keys = [];
    if (icd) keys.push("icd:" + icd.toUpperCase());
    keys.push("lbl:" + norm(label));
    cs.push({ ent: x, label, icd, status: historical ? "resolved" : "active", onset: parseOnset(str(x.e.onset_text)), keys });
  }
  const uf = new UF();
  for (const c of cs) for (const k of c.keys) uf.union(c.keys[0], k);
  const groups = new Map<string, CondEnt[]>();
  for (const c of cs) {
    const r = uf.find(c.keys[0]);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r)!.push(c);
  }
  const out: ProblemRow[] = [];
  let ckdLatest: { stage?: ProblemRow["ckd_stage"]; alb?: ProblemRow["albuminuria"] } = {};
  // KDIGO categories: most recently recorded across all CKD entries for the patient.
  const ckdEnts = cs.filter((c) => isCkd(c.icd, c.label) && (c.status === "active" || c.status === "resolved")).sort((a, b) => cmpDoc(a.ent.doc, b.ent.doc));
  for (const c of ckdEnts) {
    const st = ckdStage(c.icd, c.label);
    if (st) ckdLatest.stage = st;
    const a = /\bA([123])\b/.exec(c.label);
    if (a) ckdLatest.alb = ("A" + a[1]) as ProblemRow["albuminuria"];
  }
  for (const g of groups.values()) {
    g.sort((a, b) => cmpDoc(a.ent.doc, b.ent.doc));
    const last = g[g.length - 1];
    if (last.status === "ruled_out") continue;
    const confirmed = g.filter((c) => c.status === "active" || c.status === "resolved");
    if (!confirmed.length) continue;
    const cur = confirmed[confirmed.length - 1];
    const ev: Evidence = [];
    for (const c of g) if (c.status === "active" || c.status === "resolved") addEv(ev, c.ent.doc.item.id, c.ent.id);
    // put the current entry first
    ev.sort((a, b) => (a.item_id === cur.ent.doc.item.id && a.entry_id === cur.ent.id ? -1 : b.item_id === cur.ent.doc.item.id && b.entry_id === cur.ent.id ? 1 : 0));
    const row: ProblemRow = { condition: cur.label, status: cur.status as "active" | "resolved", evidence: ev };
    const icd = [...confirmed].reverse().map((c) => c.icd).find((i) => i && !isAdverseEffectTCode(i));
    if (icd) row.icd10cm = icd;
    const onset = [...confirmed].reverse().map((c) => c.onset).find((o) => o);
    if (onset) row.onset = onset;
    if (g.some((c) => isCkd(c.icd, c.label))) {
      if (ckdLatest.stage) row.ckd_stage = ckdLatest.stage;
      if (ckdLatest.alb) row.albuminuria = ckdLatest.alb;
    }
    const sens = uniq(g.flatMap((c) => [...markedSensitivity(c.ent.e), ...icdSensitivity(c.icd, c.label)]));
    if (sens.length) row.sensitivity = sens;
    out.push(row);
  }
  return out;
}

// ─── allergies ───────────────────────────────────────────────────────────────────────────────────

const DRUG_CLASSES: { re: RegExp; members: RegExp; name: string }[] = [
  { re: /sglt-?2/i, members: /gliflozin$/, name: "SGLT2 inhibitor" },
  { re: /\bace[- ]?i\b|ace inhibitor|angiotensin[- ]converting/i, members: /pril$/, name: "ACE inhibitor" },
  { re: /\barb\b|angiotensin (ii )?receptor blocker/i, members: /sartan$/, name: "ARB" },
  { re: /statin/i, members: /statin$/, name: "statin" },
  { re: /dpp-?4/i, members: /gliptin$/, name: "DPP-4 inhibitor" },
  { re: /glp-?1/i, members: /(glutide|natide|tirzepatide)$/, name: "GLP-1 receptor agonist" },
  { re: /nsaid/i, members: /^(ibuprofen|naproxen|meloxicam|diclofenac|celecoxib|ketorolac|indomethacin)$/, name: "NSAID" },
  { re: /sulfonylurea/i, members: /^(glipizide|glyburide|glimepiride)$/, name: "sulfonylurea" },
  { re: /thiazide/i, members: /(thiazide|chlorthalidone|indapamide)$/, name: "thiazide diuretic" },
  { re: /beta[- ]?blocker/i, members: /olol$/, name: "beta blocker" },
  { re: /mineralocorticoid|mra\b/i, members: /^(spironolactone|eplerenone|finerenone)$/, name: "mineralocorticoid receptor antagonist" },
];

function classifyReaction(reaction: string, substance: string): { type: AllergyIntoleranceRow["reaction_type"]; mech: AllergyIntoleranceRow["mechanism"] } {
  const r = reaction.toLowerCase();
  const ace = /pril$/.test(substance) || /ace inhibitor/i.test(substance);
  if (/ketoacidosis|\bdka\b|lactic acidosis|hyperkalemia|kidney injury|\baki\b|renal failure|pancreatitis|hypoglycemi|rhabdo|hepatotox|liver injury|bleed|hemorrhag|agranulocyt|qt prolong|arrhythm/.test(r)) {
    return { type: "serious_adverse_event", mech: /ketoacidosis|\bdka\b/.test(r) ? "non_immune" : "unknown" };
  }
  if (/hive|urticaria|rash|angioedema|swelling|anaphyla|bronchospasm|wheez|itch|prurit|stevens|sjs|\bten\b|dress|blister|throat|lip|tongue|face/.test(r)) {
    return { type: "hypersensitivity", mech: ace && /angioedema|swelling/.test(r) ? "non_immune" : "unknown" };
  }
  if (/cough|nausea|vomit|diarr|gi upset|upset stomach|stomach|dyspep|constipat|myalgia|muscle|ache|headache|dizz|fatigue|edema|flushing|insomnia|drows|taste|yeast|mycotic|urinary/.test(r)) {
    return { type: "side_effect", mech: ace && /cough/.test(r) ? "non_immune" : "unknown" };
  }
  return { type: "hypersensitivity", mech: "unknown" };
}

function allergies(alg: Ent[], dx: Ent[], all: Ent[]): AllergyIntoleranceRow[] {
  const byKey = new Map<string, { row: AllergyIntoleranceRow; doc: Doc }>();
  const put = (key: string, row: AllergyIntoleranceRow, doc: Doc) => {
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, { row, doc });
      return;
    }
    if (cmpDoc(doc, prev.doc) >= 0) {
      for (const e of prev.row.evidence) addEv(row.evidence, e.item_id, e.entry_id);
      if (!row.onset && prev.row.onset) row.onset = prev.row.onset;
      if (!row.rxnorm_ingredient && prev.row.rxnorm_ingredient) row.rxnorm_ingredient = prev.row.rxnorm_ingredient;
      byKey.set(key, { row, doc });
    } else {
      for (const e of row.evidence) addEv(prev.row.evidence, e.item_id, e.entry_id);
      if (!prev.row.onset && row.onset) prev.row.onset = row.onset;
    }
  };

  for (const a of alg) {
    const sub = str(a.e.substance);
    if (!sub) continue;
    if (/^(nkda|nka|no known)/i.test(sub) || /no known (drug )?allerg/i.test(sub)) continue;
    const ing = ingredientOf(sub) ?? sub.toLowerCase();
    const reaction = str(a.e.reaction);
    const cls = classifyReaction(reaction ?? "", ing);
    const sev = a.e.severity;
    const row: AllergyIntoleranceRow = {
      substance: ing,
      reaction_type: cls.type,
      mechanism: cls.mech,
      criticality: sev === "mild" ? "low" : sev === "severe" ? "high" : "unknown",
      evidence: [{ item_id: a.doc.item.id, entry_id: a.id }],
    };
    const rx = str(a.e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;
    if (reaction) row.reaction = reaction;
    const sens = markedSensitivity(a.e);
    if (sens.length) row.sensitivity = sens;
    put("s:" + ing, row, a.doc);
  }

  // Drug-attributed diagnoses, confirmed (latest entry for the same diagnosis not ruled out / working).
  const dxGroups = new Map<string, Ent[]>();
  for (const d of dx) {
    const k = str(d.e.riverside_dx?.code) ?? str(d.e.icd10cm) ?? norm(str(d.e.label) ?? "");
    if (!dxGroups.has(k)) dxGroups.set(k, []);
    dxGroups.get(k)!.push(d);
  }
  for (const d of dx) {
    if (d.e.status !== "active" && d.e.status !== "resolved") continue;
    const k = str(d.e.riverside_dx?.code) ?? str(d.e.icd10cm) ?? norm(str(d.e.label) ?? "");
    const g = (dxGroups.get(k) ?? []).slice().sort((a, b) => cmpDoc(a.doc, b.doc));
    if (g.length && g[g.length - 1].e.status === "ruled_out") continue;
    const label = str(d.e.label) ?? "";
    const longName = str(d.e.riverside_dx?.name) ?? "";
    const icd = str(d.e.icd10cm);
    const tcode = isAdverseEffectTCode(icd);
    const text = `${label} ; ${longName}`;
    const m =
      /([A-Za-z0-9][A-Za-z0-9 \-\/]*?)[- ](?:inhibitor[- ])?(?:associated|induced|related)\b/i.exec(label) ??
      /([A-Za-z0-9][A-Za-z0-9 \-\/]*?)[- ](?:inhibitor[- ])?(?:associated|induced|related)\b/i.exec(longName) ??
      /(?:due to|caused by|secondary to|adverse effect of)\s+([A-Za-z0-9 \-\/]+)/i.exec(text);
    if (!m && !tcode) continue;
    let agentText = m ? m[0].replace(/[- ](associated|induced|related)\b.*$/i, "").replace(/^(due to|caused by|secondary to|adverse effect of)\s+/i, "") : label;
    // keep only the trailing drug phrase after a comma ("Euglycemic DKA, SGLT2 inhibitor")
    agentText = agentText.split(",").pop()!.trim();
    const cls = DRUG_CLASSES.find((c) => c.re.test(agentText));
    let substance: string | undefined;
    if (cls) {
      const sameItemMeds = all
        .filter((x) => x.doc === d.doc && (x.e.type === "home_med" || x.e.type === "inpatient_med"))
        .map((x) => ({ ing: ingredientOf(str(x.e.drug_name) ?? ""), rx: str(x.e.rxnorm_ingredient), x }))
        .filter((x) => x.ing && cls.members.test(x.ing));
      const ings = uniq(sameItemMeds.map((x) => x.ing!));
      if (ings.length === 1) substance = ings[0];
      else substance = cls.name;
    } else {
      const ing = ingredientOf(agentText);
      // Only accept an agent that names a drug (rough check: a med-like word or a known brand/stem).
      if (ing && (/(pril|sartan|gliflozin|statin|olol|formin|thiazide|mycin|cillin|floxacin|azole|prazole|gliptin|glutide|ide|ine|ol|en|in|one|ate)$/.test(ing) || tcode)) substance = ing;
    }
    if (!substance) continue;
    // Words like "Drug" / "medication" alone are not substances
    if (/^(drug|medication|medicine)s?$/i.test(substance)) continue;
    const reactionText = label.replace(/,?\s*[A-Za-z0-9 \-\/]*?[- ](associated|induced|related)\b.*$/i, "").trim() || label;
    const cr = classifyReaction(`${label} ${longName}`, substance);
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: cr.type,
      mechanism: cr.mech,
      reaction: reactionText,
      criticality: cr.type === "serious_adverse_event" || /anaphyla|angioedema/i.test(text) ? "high" : "unknown",
      evidence: [{ item_id: d.doc.item.id, entry_id: d.id }],
    };
    // The reaction began at the encounter in which it was diagnosed.
    const encs = all.filter((x) => x.doc === d.doc && x.e.type === "encounter");
    const onsetDate = localDate(encs[0]?.e.arrived) ?? localDate(d.doc.item.effective);
    if (onsetDate) row.onset = { value: onsetDate, precision: precisionOf(onsetDate) };
    const rxMed = all.find((x) => x.doc === d.doc && (x.e.type === "home_med" || x.e.type === "inpatient_med") && ingredientOf(str(x.e.drug_name) ?? "") === substance);
    const rx = rxMed ? str(rxMed.e.rxnorm_ingredient) : undefined;
    if (rx) row.rxnorm_ingredient = rx;
    const sens = markedSensitivity(d.e);
    if (sens.length) row.sensitivity = sens;
    const key = "s:" + substance;
    const prev = byKey.get(key);
    if (prev && prev.row.reaction && prev.row.reaction !== reactionText && !prev.row.evidence.some((e) => dx.some((x) => x.doc.item.id === e.item_id && x.id === e.entry_id))) {
      // Substance already on the allergy list for another reaction: add this reaction to it.
      prev.row.reaction = `${prev.row.reaction}; ${reactionText}`;
      if (cr.type === "serious_adverse_event") prev.row.reaction_type = cr.type;
      if (row.criticality === "high") prev.row.criticality = "high";
      addEv(prev.row.evidence, d.doc.item.id, d.id);
      if (!prev.row.onset && row.onset) prev.row.onset = row.onset;
      continue;
    }
    if (prev) {
      // Keep the earliest onset for the same drug-caused reaction.
      if (prev.row.onset && row.onset && prev.row.onset.value < row.onset.value) row.onset = prev.row.onset;
    }
    put(key, row, d.doc);
  }
  return [...byKey.values()].map((x) => x.row);
}

// ─── labs ────────────────────────────────────────────────────────────────────────────────────────

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "14682-9": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr", "88293-6": "egfr", "88294-4": "egfr", "50044-7": "egfr", "69405-9": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "17856-6": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "777-3": "platelets", "26515-7": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "53060-9": "bhb", "47836-7": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "1798-8": "lipase", "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};
const CODE_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate",
  HCO3: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", A1C: "a1c", HBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb",
  PH: "ph", VPH: "ph", APH: "ph", PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2", LIPASE: "lipase", TROP: "troponin",
  TNI: "troponin", TROPI: "troponin", CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl",
};
function analyteByName(n: string): Analyte | undefined {
  const s = n.toLowerCase();
  if (/egfr|glomerular/.test(s)) return "egfr";
  if (/albumin.*creatinine|\buacr\b|\bacr\b/.test(s)) return "uacr";
  if (/creatinine/.test(s) && !/urine|clearance/.test(s)) return "creatinine";
  if (/potassium/.test(s)) return "potassium";
  if (/sodium/.test(s)) return "sodium";
  if (/chloride/.test(s)) return "chloride";
  if (/anion gap/.test(s)) return "anion_gap";
  if (/bicarbonate|total co2|\bco2\b/.test(s) && !/pco2/.test(s)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(s)) return "bun";
  if (/a1c|glycated|glycohemoglobin/.test(s)) return "a1c";
  if (/glucose/.test(s) && !/urine|meter|poc|fingerstick/.test(s)) return "glucose";
  if (/platelet/.test(s)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(s)) return "wbc";
  if (/hemoglobin|\bhgb\b/.test(s)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b/.test(s)) return "bhb";
  if (/pco2/.test(s)) return "pco2";
  if (/\bph\b/.test(s)) return "ph";
  if (/lipase/.test(s)) return "lipase";
  if (/troponin/.test(s) && !/troponin t/.test(s)) return "troponin";
  if (/hdl/.test(s)) return "hdl";
  if (/ldl/.test(s)) return "ldl";
  if (/triglycer/.test(s)) return "triglycerides";
  if (/cholesterol/.test(s)) return "cholesterol";
  return undefined;
}

const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L",
  troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

/** Convert to the analyte's unit; undefined when the unit cannot be read. */
function convert(a: Analyte, v: number, unitRaw: string | undefined): number | undefined {
  const u = (unitRaw ?? "").replace(/\s+/g, "").replace("µ", "u").replace("μ", "u").toLowerCase();
  const target = UNIT[a].toLowerCase();
  if (u === target) return v;
  switch (a) {
    case "creatinine":
      if (u === "mg/dl") return v;
      if (u === "umol/l") return v / 88.42;
      return undefined;
    case "egfr":
      if (!u || /ml\/min/.test(u)) return v;
      return undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      if (!u || u === "mmol/l" || u === "meq/l") return v;
      return undefined;
    case "bun":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return v * 2.8;
      return undefined;
    case "glucose": case "cholesterol": case "hdl": case "ldl": case "triglycerides": {
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return a === "glucose" ? v * 18.016 : a === "triglycerides" ? v * 88.57 : v * 38.67;
      return undefined;
    }
    case "a1c":
      if (!u || u === "%" || u === "%hba1c" || u === "%ngsp") return v;
      if (u === "mmol/mol") return Math.round((0.09148 * v + 2.152) * 10) / 10;
      return undefined;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "mg/g{creat}" || u === "ug/mg") return v;
      if (u === "mg/mmol") return v * 8.84;
      return undefined;
    case "platelets": case "wbc":
      if (/^(10\*3|10\^3|k|x10\^3|x10e3|thou|10e3)\/(ul|mm3)$/.test(u) || /^(10\*9|10\^9|x10\^9|x10e9)\/l$/.test(u)) return v;
      if (u === "/ul" || u === "cells/ul" || u === "/mm3") return v / 1000;
      return undefined;
    case "hemoglobin":
      if (u === "g/dl") return v;
      if (u === "g/l") return v / 10;
      return undefined;
    case "ph":
      if (!u || u === "[ph]" || u === "ph") return v;
      return undefined;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return v;
      if (u === "kpa") return v * 7.50062;
      return undefined;
    case "lipase":
      if (u === "u/l" || u === "iu/l") return v;
      return undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return v / 1000;
      return undefined;
  }
  return undefined;
}

function egfrInfo(name: string, loinc: string | undefined): { eq: LabResultRow["egfr_equation"]; race: "with" | "without" | "none" } {
  const n = name.toLowerCase();
  let race: "with" | "without" | "none" = "none";
  if (/non[- ]?(african|black|aa\b)|not (african|black)|other races?|without race/.test(n)) race = "without";
  else if (/african|black|\baa\b/.test(n)) race = "with";
  else if (loinc === "48643-1" || loinc === "88293-6") race = "with";
  else if (loinc === "48642-3" || loinc === "88294-4") race = "without";
  let eq: LabResultRow["egfr_equation"] = "unknown";
  if (/ckd[- ]?epi/.test(n) && /2021|race[- ]free|race[- ]neutral/.test(n)) eq = "ckd-epi-2021";
  else if (/ckd[- ]?epi/.test(n) && /2009/.test(n)) eq = "ckd-epi-2009";
  else if (/mdrd/.test(n)) eq = "mdrd";
  else if (/ckd[- ]?epi/.test(n)) eq = race !== "none" ? "ckd-epi-2009" : "unknown";
  if (eq === "unknown") {
    if (loinc === "98979-8") eq = "ckd-epi-2021";
    else if (loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") eq = "ckd-epi-2009";
    else if (loinc === "33914-3" || loinc === "48642-3" || loinc === "48643-1") eq = "mdrd";
  }
  return { eq, race };
}

const STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

function labs(ents: Ent[]): LabResultRow[] {
  type Cand = { row: LabResultRow; key: string; rank: number; doc: Doc };
  const cands: Cand[] = [];
  const handle = (comp: Record<string, any>, ctx: Record<string, any>, ent: Ent, idx?: number) => {
    const test = isObj(comp.test) ? comp.test : {};
    const loinc = str(test.loinc);
    const code = str(test.local_code)?.toUpperCase();
    const name = str(test.name) ?? "";
    const a: Analyte | undefined = (loinc && LOINC_ANALYTE[loinc]) || (code && CODE_ANALYTE[code]) || analyteByName(name);
    if (!a) return;
    const specimen = (str(ctx.specimen) ?? "").toLowerCase();
    if (/urine/.test(specimen) && a !== "uacr") return;
    if (a === "uacr" && specimen && !/urine/.test(specimen)) return;
    if (a === "glucose" && /capillary|poc|meter|fingerstick/.test(specimen + " " + name.toLowerCase())) return;
    const status = ctx.status;
    if (!(status in STATUS_RANK)) return;
    const raw = typeof comp.value === "number" ? String(comp.value) : str(comp.value);
    if (!raw) return;
    const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(raw);
    if (!m) return;
    const cmp = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as LabResultRow["comparator"] | undefined);
    const v = convert(a, parseFloat(m[2]), str(comp.unit));
    if (v === undefined || !Number.isFinite(v)) return;
    const collected = str(ctx.collected);
    if (!collected) return;
    const row: LabResultRow = {
      analyte: a,
      value: Math.round(v * 10000) / 10000,
      unit: UNIT[a],
      collected,
      status: status === "preliminary" ? "preliminary" : "final",
      evidence: [{ item_id: ent.doc.item.id, entry_id: ent.id }],
    };
    if (cmp) row.comparator = cmp;
    if (loinc) row.loinc = loinc;
    let variant = "";
    if (a === "egfr") {
      const info = egfrInfo(name, loinc);
      if (info.race === "with") return;
      row.egfr_equation = info.eq;
      variant = info.eq ?? "";
    }
    const acc = str(ctx.accession) ?? `${collected}`;
    const key = `${acc}|${instant(collected) ?? collected}|${a}|${variant}|${code ?? loinc ?? norm(name)}`;
    cands.push({ row, key, rank: STATUS_RANK[status], doc: ent.doc });
  };
  for (const x of ents) {
    if (x.e.type === "result") handle(x.e, x.e, x);
    else if (x.e.type === "panel" && Array.isArray(x.e.components)) {
      x.e.components.forEach((c: unknown, i: number) => {
        if (isObj(c)) handle(c, x.e, x, i);
      });
    }
  }
  const best = new Map<string, Cand>();
  for (const c of cands) {
    const p = best.get(c.key);
    if (!p) {
      best.set(c.key, c);
      continue;
    }
    const better = c.rank > p.rank || (c.rank === p.rank && cmpDoc(c.doc, p.doc) > 0);
    const [win, lose] = better ? [c, p] : [p, c];
    for (const e of lose.row.evidence) if (lose.rank === win.rank && lose.row.value === win.row.value) addEv(win.row.evidence, e.item_id, e.entry_id);
    best.set(c.key, win);
  }
  return [...best.values()].map((c) => c.row);
}

// ─── vitals ──────────────────────────────────────────────────────────────────────────────────────

function vitals(vs: Ent[], all: Ent[]): VitalRow[] {
  const byTime = new Map<string, VitalRow>();
  const order: string[] = [];
  for (const v of vs) {
    const lt = localDateTime(v.e.taken);
    if (!lt) continue;
    const enc = all.find((x) => x.doc === v.doc && x.e.type === "encounter");
    const setting: VitalRow["setting"] = enc && enc.e.class === "outpatient" ? "clinic" : "hospital";
    const row: VitalRow = { setting, local_time: lt, evidence: [] };
    const bp = isObj(v.e.bp) ? v.e.bp : undefined;
    const num = (x: unknown) => (typeof x === "number" && Number.isFinite(x) ? x : typeof x === "string" && /^\d+(\.\d+)?$/.test(x.trim()) ? parseFloat(x) : undefined);
    const sys = num(bp?.systolic_mmhg), dia = num(bp?.diastolic_mmhg);
    if (sys !== undefined && dia !== undefined) {
      row.systolic_mmhg = sys;
      row.diastolic_mmhg = dia;
    }
    const hr = num(v.e.heart_rate_bpm);
    if (hr !== undefined) row.pulse_bpm = hr;
    const wt = num(v.e.weight_kg);
    if (wt !== undefined) row.weight_kg = Math.round(wt * 10) / 10;
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    const key = `${setting}|${lt}`;
    const prev = byTime.get(key);
    if (prev) {
      // the same measurement restated in another document
      if (prev.systolic_mmhg === undefined && row.systolic_mmhg !== undefined) {
        prev.systolic_mmhg = row.systolic_mmhg;
        prev.diastolic_mmhg = row.diastolic_mmhg;
      }
      if (prev.pulse_bpm === undefined && row.pulse_bpm !== undefined) prev.pulse_bpm = row.pulse_bpm;
      if (prev.weight_kg === undefined && row.weight_kg !== undefined) prev.weight_kg = row.weight_kg;
      addEv(prev.evidence, v.doc.item.id, v.id);
      continue;
    }
    row.evidence.push({ item_id: v.doc.item.id, entry_id: v.id });
    byTime.set(key, row);
    order.push(key);
  }
  return order.map((k) => byTime.get(k)!).sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
}
