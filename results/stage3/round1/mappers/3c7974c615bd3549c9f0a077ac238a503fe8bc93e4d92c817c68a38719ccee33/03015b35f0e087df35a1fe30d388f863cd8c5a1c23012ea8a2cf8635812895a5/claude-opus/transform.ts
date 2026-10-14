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
  PartialDate,
} from "../in/views/views";

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Time helpers (America/Chicago)
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const TZ = "America/Chicago";
let fmt: Intl.DateTimeFormat | null = null;

function localParts(iso: string): { date: string; time: string } | null {
  if (typeof iso !== "string") return null;
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(iso)) return { date: iso, time: "" };
  const ms = Date.parse(iso);
  if (isNaN(ms)) return null;
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
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = part.value;
  const hour = p.hour === "24" ? "00" : p.hour;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${hour}:${p.minute}` };
}

let fmtSec: Intl.DateTimeFormat | null = null;

/** The same instant written in America/Chicago wall-clock time with its offset, e.g. "2024-10-25T20:23:00-05:00". */
function localInstant(iso: string): string {
  const t = Date.parse(iso);
  if (isNaN(t)) return iso;
  if (!fmtSec) {
    fmtSec = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
  }
  const p: Record<string, string> = {};
  for (const part of fmtSec.formatToParts(new Date(t))) p[part.type] = part.value;
  const hour = p.hour === "24" ? "00" : p.hour;
  const wall = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(hour), Number(p.minute), Number(p.second));
  const offMin = Math.round((wall - Math.floor(t / 1000) * 1000) / 60000);
  if (!isFinite(offMin)) return iso;
  const sign = offMin < 0 ? "-" : "+";
  const a = Math.abs(offMin);
  const off = `${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
  return `${p.year}-${p.month}-${p.day}T${hour}:${p.minute}:${p.second}${off}`;
}

function localDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const lp = localParts(iso);
  return lp ? lp.date : undefined;
}

function ms(iso: string | undefined): number {
  if (!iso) return NaN;
  return Date.parse(iso);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Documents
// ─────────────────────────────────────────────────────────────────────────────────────────────────

interface Doc {
  item: FolioItem;
  enc: any | undefined;
  kind: string | undefined;
  encId: string;
  recordedMs: number;
  effectiveMs: number;
  /** When this document's decisions were made (discharge time for a discharge summary). */
  decisionTime: string;
  entries: [string, any][];
}

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x : undefined;
}

function toDoc(item: FolioItem): Doc {
  const entries: [string, any][] = [];
  const payload = isObj(item.payload) ? item.payload : {};
  for (const k of Object.keys(payload)) {
    const e = payload[k];
    if (isObj(e) && typeof e.type === "string") entries.push([k, e]);
  }
  const encEntry = entries.find(([, e]) => e.type === "encounter");
  const enc = encEntry ? encEntry[1] : undefined;
  const kind = enc ? str(enc.document_kind) : undefined;
  let decisionTime = item.effective || item.recorded;
  if (kind === "discharge_summary") {
    decisionTime = str(enc?.discharged) ?? str(item.effective_end) ?? item.recorded;
  }
  if (!localParts(decisionTime)) decisionTime = item.recorded;
  return {
    item,
    enc,
    kind,
    encId: (enc && str(enc.encounter_id)) || `item:${item.id}`,
    recordedMs: ms(item.recorded),
    effectiveMs: ms(item.effective),
    decisionTime,
    entries,
  };
}

function docOrder(a: Doc, b: Doc): number {
  const ra = isNaN(a.recordedMs) ? 0 : a.recordedMs;
  const rb = isNaN(b.recordedMs) ? 0 : b.recordedMs;
  if (ra !== rb) return ra - rb;
  const ea = isNaN(a.effectiveMs) ? 0 : a.effectiveMs;
  const eb = isNaN(b.effectiveMs) ? 0 : b.effectiveMs;
  if (ea !== eb) return ea - eb;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0;
}

function currentDocs(items: FolioItem[], asOf: string): Doc[] {
  const inScope = (Array.isArray(items) ? items : []).filter((it) => {
    if (!isObj(it) || typeof it.id !== "string") return false;
    const d = localDate(it.recorded);
    return !!d && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const list of [it.supersedes, it.retracts]) {
      if (!Array.isArray(list)) continue;
      for (const id of list) {
        if (typeof id === "string") dead.add(`${it.issuer}|${id}`);
      }
    }
  }
  return inScope
    .filter((it) => !dead.has(`${it.issuer}|${it.id}`))
    .map(toDoc)
    .sort(docOrder);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Drug names
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  steglatro: "ertugliflozin",
  glucophage: "metformin",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  semglee: "insulin glargine",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  humalog: "insulin lispro",
  novolog: "insulin aspart",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  zocor: "simvastatin",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  cozaar: "losartan",
  norvasc: "amlodipine",
  glucotrol: "glipizide",
  januvia: "sitagliptin",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  trulicity: "dulaglutide",
  victoza: "liraglutide",
  mounjaro: "tirzepatide",
  lasix: "furosemide",
  synthroid: "levothyroxine",
  eliquis: "apixaban",
  xarelto: "rivaroxaban",
  plavix: "clopidogrel",
  coumadin: "warfarin",
};

const SALT_OR_FORM = new Set([
  "potassium", "sodium", "calcium", "magnesium", "hydrochloride", "hcl", "besylate", "maleate",
  "tartrate", "succinate", "mesylate", "citrate", "sulfate", "fumarate", "acetate", "bromide",
  "er", "xr", "sr", "xl", "dr", "ir", "la", "cr", "odt",
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "pen", "injection",
  "solution", "suspension", "oral", "subq", "vial", "inhaler", "patch", "cream", "ointment", "kwikpen",
  "flexpen", "flextouch", "solostar", "extended-release", "delayed-release", "release", "extended",
  "delayed", "chewable", "film", "coated",
]);

function ingredientName(drugName: string): string | undefined {
  if (!drugName) return undefined;
  const words = drugName.trim().split(/\s+/);
  const kept: string[] = [];
  for (const w of words) {
    if (/\d/.test(w)) break;
    if (w.startsWith("(")) break;
    kept.push(w);
  }
  let out = kept
    .map((w) => w.toLowerCase().replace(/[,;]+$/, ""))
    .filter((w) => w && !SALT_OR_FORM.has(w));
  if (out.length === 0) return undefined;
  const joined = out.join(" ");
  if (BRANDS[joined]) return BRANDS[joined];
  if (out.length === 1 && BRANDS[out[0]]) return BRANDS[out[0]];
  return joined;
}

const SGLT2 = new Set(["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "bexagliflozin", "sotagliflozin"]);
const DRUG_CLASSES: [RegExp, Set<string>][] = [
  [/sglt-?2|sodium[- ]glucose/i, SGLT2],
  [/ace[- ]?inhibitor/i, new Set(["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril", "moexipril"])],
  [/\bstatin/i, new Set(["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "pitavastatin", "fluvastatin"])],
  [/sulfonylurea/i, new Set(["glipizide", "glyburide", "glimepiride"])],
];

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Medications
// ─────────────────────────────────────────────────────────────────────────────────────────────────

type MedStatus = MedicationRow["status"];

function medStatus(s: unknown): MedStatus | undefined {
  switch (s) {
    case "not_reconciled":
      return "unknown";
    case "continue":
    case "new":
    case "changed":
      return "active";
    case "held":
      return "held";
    case "stopped":
      return "stopped";
  }
  return undefined;
}

function medKey(e: any): string | undefined {
  const rx = str(e.rxnorm_ingredient);
  if (rx) return `rx:${rx}`;
  const ing = ingredientName(str(e.drug_name) ?? "");
  if (ing) return `name:${ing}`;
  const dn = str(e.drug_name);
  return dn ? `name:${dn.toLowerCase()}` : undefined;
}

function normDose(s: unknown): string {
  return typeof s === "string" ? s.toLowerCase().replace(/\s+/g, " ").trim() : "";
}

function parseDose(text: unknown): MedicationRow["dose"] | undefined {
  if (typeof text !== "string") return undefined;
  const m = text.trim().match(/^(\d+(?:\.\d+)?|\.\d+)\s*([a-zA-Z\[\]]+)\.?$/);
  if (!m) return undefined;
  const value = Number(m[1]);
  if (!isFinite(value)) return undefined;
  const u = m[2].toLowerCase();
  let unit: NonNullable<MedicationRow["dose"]>["unit"] | undefined;
  if (u === "mg") unit = "mg";
  else if (u === "mcg" || u === "ug" || u === "µg") unit = "mcg";
  else if (["unit", "units", "u", "unt", "[iu]", "iu"].includes(u)) unit = "units";
  else if (u === "ml") unit = "mL";
  else if (["tab", "tabs", "tablet", "tablets"].includes(u)) unit = "tablet";
  if (!unit) return undefined;
  return { value, unit };
}

function parseFrequency(sig: unknown): MedicationRow["frequency"] | undefined {
  if (typeof sig !== "string" || !sig.trim()) return undefined;
  const s = sig.toLowerCase();
  if (/\bprn\b|as needed|when needed|if needed/.test(s)) return "PRN";
  if (/\bqhs\b|nightly|at bedtime|\bbedtime\b|every night|each night|\bhs\b/.test(s)) return "QHS";
  if (/\bbid\b|twice (a |per )?day|twice daily|two times (a |per )?day|every 12 hours|\bq12h\b/.test(s)) return "BID";
  if (/\btid\b|three times (a |per )?day|three times daily|every 8 hours|\bq8h\b/.test(s)) return "TID";
  if (/\bqw\b|weekly|once (a |per )?week|every week/.test(s)) return "QW";
  if (/\bqd\b|\bdaily\b|once (a |per )?day|every day|every morning|each morning|\bqam\b|every 24 hours|\bq24h\b/.test(s)) {
    if (/every other day/.test(s)) return "other";
    return "QD";
  }
  if (/\bqid\b|four times|every \d+ (hours|days|weeks)|\bq\d+h\b|every other|monthly|\bmonth\b/.test(s)) return "other";
  return undefined;
}

function stopReason(text: string | undefined, adverse: boolean): MedicationRow["stop_reason"] | undefined {
  if (adverse) return "adverse_reaction";
  if (!text) return undefined;
  const t = text.toLowerCase();
  if (/adverse|side effect|reaction|intoleran|ketoacidosis|\bdka\b|lactic acidosis|angioedema|rash|hives|cough|allerg/.test(t)) return "adverse_reaction";
  if (/ineffective|not effective|not working|inadequate|insufficient/.test(t)) return "ineffective";
  if (/replaced|switch|changed to|instead of|in place of|substitut/.test(t)) return "therapy_changed";
  if (/course complete|completed course|course finished|completed/.test(t)) return "course_complete";
  if (/patient (declined|refused|preference|request|choice|chose|wishes)|declined by patient/.test(t)) return "patient_choice";
  return undefined;
}

interface AdverseLink {
  ingredient: string;
  rxnorm?: string;
  encId: string;
}

function buildMedications(docs: Doc[], adverse: AdverseLink[]): MedicationRow[] {
  const medDocs = docs.filter((d) => d.entries.some(([, e]) => e.type === "home_med"));
  if (medDocs.length === 0) return [];
  // Snapshot: the latest encounter's latest discharge summary, else the latest document with a list.
  const latest = docs[docs.length - 1];
  let snap: Doc;
  const ds = docs.filter((d) => d.encId === latest.encId && d.kind === "discharge_summary");
  if (ds.length > 0) snap = ds[ds.length - 1];
  else {
    const sameEnc = medDocs.filter((d) => d.encId === latest.encId);
    snap = sameEnc.length > 0 ? sameEnc[sameEnc.length - 1] : medDocs[medDocs.length - 1];
  }
  const snapIdx = docs.indexOf(snap);

  const rank: Record<MedStatus, number> = { active: 4, held: 3, unknown: 2, stopped: 1 };
  const chosen = new Map<string, { id: string; e: any; st: MedStatus }>();
  for (const [id, e] of snap.entries) {
    if (e.type !== "home_med") continue;
    const st = medStatus(e.status);
    const key = medKey(e);
    if (!st || !key || !str(e.drug_name)) continue;
    const prev = chosen.get(key);
    if (!prev || rank[st] > rank[prev.st]) chosen.set(key, { id, e, st });
  }

  const rows: MedicationRow[] = [];
  for (const [key, { id, e, st }] of chosen) {
    const dose = normDose(e.dose_text);
    const evidence: Evidence = [{ item_id: snap.item.id, entry_id: id }];
    let since: PartialDate | undefined;
    let reasonText = str(e.instructions);

    const lineIn = (d: Doc): [string, any] | undefined => {
      const cands = d.entries.filter(([, x]) => x.type === "home_med" && medKey(x) === key);
      return cands.find(([, x]) => normDose(x.dose_text) === dose) ?? cands[0];
    };

    if (st === "held" || st === "stopped") {
      let start: Doc = snap;
      let startEntry = id;
      for (let i = snapIdx - 1; i >= 0; i--) {
        const l = lineIn(docs[i]);
        if (!l) {
          if (docs[i].entries.some(([, x]) => x.type === "home_med")) break;
          continue; // document without a medication list says nothing
        }
        if (medStatus(l[1].status) !== st || normDose(l[1].dose_text) !== dose) break;
        start = docs[i];
        startEntry = l[0];
        if (!reasonText) reasonText = str(l[1].instructions);
      }
      since = localDate(start.decisionTime);
      if (start !== snap) evidence.push({ item_id: start.item.id, entry_id: startEntry });
    } else if (st === "active") {
      if (e.status === "new" || e.status === "changed") since = localDate(snap.decisionTime);
      else {
        let earliest: Doc = snap;
        let earliestEntry = id;
        for (let i = snapIdx - 1; i >= 0; i--) {
          const l = lineIn(docs[i]);
          if (!l) {
            if (docs[i].entries.some(([, x]) => x.type === "home_med")) break;
            continue;
          }
          const pst = medStatus(l[1].status);
          if (pst === "active" && normDose(l[1].dose_text) === dose) {
            earliest = docs[i];
            earliestEntry = l[0];
            if (l[1].status === "new" || l[1].status === "changed") {
              since = localDate(docs[i].decisionTime);
              break;
            }
            continue;
          }
          if (pst === "held" || pst === "stopped" || (pst === "active" && normDose(l[1].dose_text) !== dose)) {
            since = localDate(earliest.decisionTime); // resumed or re-dosed here
          }
          break;
        }
        if (since && earliest !== snap) evidence.push({ item_id: earliest.item.id, entry_id: earliestEntry });
      }
    }

    const drugName = str(e.drug_name) as string;
    const ingredient = ingredientName(drugName);
    const row: MedicationRow = {
      drug_name: drugName,
      status: st,
      patient_reported: false,
      evidence,
    };
    if (ingredient) row.ingredient = ingredient;
    const rx = str(e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;
    if (since) row.status_since = since;
    const d = parseDose(e.dose_text);
    if (d) row.dose = d;
    const f = parseFrequency(e.sig);
    if (f) row.frequency = f;
    if (st === "stopped") {
      const adv = adverse.some((a) => (rx && a.rxnorm === rx) || (ingredient && a.ingredient === ingredient));
      const r = stopReason(reasonText, adv);
      if (r) row.stop_reason = r;
    }
    if ((st === "held" || st === "stopped") && reasonText) row.status_reason_text = reasonText;
    rows.push(sortKeys(row));
  }
  rows.sort((a, b) => (a.ingredient ?? a.drug_name).localeCompare(b.ingredient ?? b.drug_name));
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Adverse drug effects recorded as diagnoses
// ─────────────────────────────────────────────────────────────────────────────────────────────────

function isAdverseTCode(icd: string | undefined): boolean {
  if (!icd) return false;
  const c = icd.replace(/\./g, "").toUpperCase();
  const m = c.match(/^T(\d\d)/);
  if (!m) return false;
  const n = Number(m[1]);
  return n >= 36 && n <= 50 && c.length >= 6 && c[5] === "5";
}

/** Drug phrase from "SGLT2 inhibitor-associated", "metformin-induced", "adverse effect of X". */
function drugPhrase(text: string): string | undefined {
  let m = text.match(/([A-Za-z0-9][A-Za-z0-9 \-\/]*?)[- ](?:associated|induced)\b/i);
  if (m) {
    const words = m[1].trim().split(/[\s,]+/);
    // keep the trailing words that name the drug (stop at a comma-separated condition prefix)
    const tail = m[1].split(",").pop()!.trim();
    return tail || words[words.length - 1];
  }
  m = text.match(/adverse (?:effect|reaction) (?:of|to|from)\s+([^,;()]+)/i);
  if (m) return m[1].trim();
  return undefined;
}

interface DrugResolution {
  substance: string;
  rxnorm?: string;
  evidence: Evidence;
}

function resolveDrug(phrase: string, encId: string, docs: Doc[]): DrugResolution {
  const lines: { ing: string; rx?: string; ev: { item_id: string; entry_id: string } }[] = [];
  const encDocs = docs.filter((d) => d.encId === encId);
  for (const d of encDocs.length ? encDocs : docs) {
    for (const [id, e] of d.entries) {
      if (e.type !== "home_med" && e.type !== "inpatient_med") continue;
      const ing = ingredientName(str(e.drug_name) ?? "");
      if (!ing) continue;
      lines.push({ ing, rx: str(e.rxnorm_ingredient), ev: { item_id: d.item.id, entry_id: id } });
    }
  }
  const p = phrase.toLowerCase().trim();
  let matcher: ((ing: string) => boolean) | undefined;
  for (const [re, set] of DRUG_CLASSES) {
    if (re.test(p)) {
      matcher = (ing) => set.has(ing);
      break;
    }
  }
  if (!matcher) {
    const direct = BRANDS[p] ?? ingredientName(p) ?? p;
    matcher = (ing) => ing === direct || ing.split(" ").includes(direct);
  }
  const hits = lines.filter((l) => matcher!(l.ing));
  const ings = Array.from(new Set(hits.map((h) => h.ing)));
  if (ings.length === 1) {
    const h = hits.filter((x) => x.ing === ings[0]);
    const rx = h.find((x) => x.rx)?.rx;
    return { substance: ings[0], rxnorm: rx, evidence: [h[h.length - 1].ev] };
  }
  const isClass = DRUG_CLASSES.some(([re]) => re.test(p));
  return { substance: isClass ? phrase.trim() : (BRANDS[p] ?? p), evidence: [] };
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Problems
// ─────────────────────────────────────────────────────────────────────────────────────────────────

interface CondEntry {
  doc: Doc;
  docIdx: number;
  id: string;
  kind: "diagnosis" | "history";
  label: string;
  icd?: string;
  rdx?: string;
  status: "working" | "ruled_out" | "active" | "resolved";
  onsetText?: string;
}

function normLabel(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function parseOnset(text: string | undefined): ProblemRow["onset"] | undefined {
  if (!text) return undefined;
  const t = text.trim();
  let m = t.match(/^(\d{4})$/);
  if (m) return { value: m[1], precision: "year" };
  m = t.match(/^(\d{4})-(\d{2})$/);
  if (m) return { value: `${m[1]}-${m[2]}`, precision: "month" };
  m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return { value: t, precision: "day" };
  m = t.match(/^(\d{1,2})\/(\d{4})$/);
  if (m && Number(m[1]) >= 1 && Number(m[1]) <= 12) return { value: `${m[2]}-${m[1].padStart(2, "0")}`, precision: "month" };
  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m && Number(m[1]) <= 12 && Number(m[2]) <= 31)
    return { value: `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`, precision: "day" };
  return undefined;
}

function ckdStage(text: string, icd: string | undefined): ProblemRow["ckd_stage"] | undefined {
  if (icd) {
    const c = icd.toUpperCase();
    if (c === "N18.1") return "G1";
    if (c === "N18.2") return "G2";
    if (c === "N18.31") return "G3a";
    if (c === "N18.32") return "G3b";
    if (c === "N18.4") return "G4";
    if (c === "N18.5" || c === "N18.6") return "G5";
  }
  const t = text.toLowerCase();
  let m = t.match(/\bg\s?(1|2|3a|3b|4|5)\b/);
  if (!m) m = t.match(/stage\s*(1|2|3a|3b|4|5|i{1,3}a?b?|iv|v)\b/);
  if (!m) m = t.match(/\bckd\s*(1|2|3a|3b|4|5)\b/);
  if (!m) return undefined;
  const roman: Record<string, string> = { i: "1", ii: "2", iiia: "3a", iiib: "3b", iv: "4", v: "5" };
  const v = roman[m[1]] ?? m[1];
  const map: Record<string, ProblemRow["ckd_stage"]> = { "1": "G1", "2": "G2", "3a": "G3a", "3b": "G3b", "4": "G4", "5": "G5" };
  return map[v];
}

function albuminuria(text: string): ProblemRow["albuminuria"] | undefined {
  const m = text.match(/\bA([123])\b/);
  return m ? (`A${m[1]}` as ProblemRow["albuminuria"]) : undefined;
}

function isCkd(label: string, icd: string | undefined): boolean {
  return (!!icd && /^N18/i.test(icd)) || /chronic kidney disease|\bckd\b/i.test(label);
}

function buildProblems(docs: Doc[], adverseOut: AllergyIntoleranceRow[], adverseLinks: AdverseLink[]): ProblemRow[] {
  const entries: CondEntry[] = [];
  docs.forEach((doc, docIdx) => {
    for (const [id, e] of doc.entries) {
      if (e.type === "diagnosis") {
        const label = str(e.label) ?? str(e.riverside_dx?.name);
        const status = e.status;
        if (!label || !["working", "ruled_out", "active", "resolved"].includes(status)) continue;
        entries.push({
          doc, docIdx, id, kind: "diagnosis", label,
          icd: str(e.icd10cm), rdx: isObj(e.riverside_dx) ? str(e.riverside_dx.code) : undefined, status,
        });
      } else if (e.type === "history") {
        const label = str(e.condition);
        if (!label) continue;
        const resolved = /\b(resolved|history of|h\/o|remote)\b/i.test(label);
        entries.push({
          doc, docIdx, id, kind: "history", label, icd: str(e.icd10cm),
          status: resolved ? "resolved" : "active", onsetText: str(e.onset_text),
        });
      }
    }
  });

  // Adverse drug effects coded as T-codes: allergy rows, not problems.
  const advEntries = entries.filter((c) => isAdverseTCode(c.icd));
  const condEntries = entries.filter((c) => !isAdverseTCode(c.icd));

  // Drug-associated illnesses (riverside_dx / label naming a drug): the illness stays a problem, and the
  // drug gets an adverse-reaction row.
  const assocEntries = condEntries.filter((c) => c.kind === "diagnosis" && drugPhrase(c.label));
  handleAdverse([...advEntries.map((c) => ({ c, tcode: true })), ...assocEntries.map((c) => ({ c, tcode: false }))], docs, adverseOut, adverseLinks);

  // Group entries into conditions.
  const groups: CondEntry[][] = [];
  const byRdx = new Map<string, CondEntry[]>();
  for (const c of condEntries) {
    if (c.rdx) {
      let g = byRdx.get(c.rdx);
      if (!g) {
        g = [];
        byRdx.set(c.rdx, g);
        groups.push(g);
      }
      g.push(c);
    }
  }
  const byIcd = new Map<string, CondEntry[]>();
  const byLabel = new Map<string, CondEntry[]>();
  const pending = condEntries.filter((c) => !c.rdx);
  for (const c of pending) {
    let g: CondEntry[] | undefined;
    if (c.icd) {
      const icd = c.icd.toUpperCase();
      const rdxGroups = Array.from(byRdx.values()).filter((gg) => gg.some((x) => x.icd && x.icd.toUpperCase() === icd));
      if (rdxGroups.length === 1) g = rdxGroups[0];
      else g = byIcd.get(icd);
      if (!g) {
        g = byLabel.get(normLabel(c.label));
        if (!g) {
          g = [];
          groups.push(g);
        }
        byIcd.set(icd, g);
      }
    } else {
      const nl = normLabel(c.label);
      g = byLabel.get(nl);
      if (!g) {
        for (const gg of groups) {
          if (gg.some((x) => normLabel(x.label) === nl)) {
            g = gg;
            break;
          }
        }
      }
      if (!g) {
        g = [];
        groups.push(g);
      }
    }
    g.push(c);
    byLabel.set(normLabel(c.label), g);
  }

  const rows: ProblemRow[] = [];
  for (const g of groups) {
    g.sort((a, b) => a.docIdx - b.docIdx);
    const dx = g.filter((c) => c.kind === "diagnosis");
    const decisive = dx.filter((c) => c.status !== "working");
    let status: "active" | "resolved" | undefined;
    let basis: CondEntry[];
    if (decisive.length > 0) {
      const last = decisive[decisive.length - 1];
      if (last.status === "ruled_out") {
        // A later history line can reassert it.
        const laterHist = g.filter((c) => c.kind === "history" && c.docIdx > last.docIdx);
        if (laterHist.length === 0) continue;
        status = laterHist[laterHist.length - 1].status as "active" | "resolved";
        basis = laterHist;
      } else {
        status = last.status as "active" | "resolved";
        basis = decisive.filter((c) => c.status !== "ruled_out");
      }
    } else {
      const hist = g.filter((c) => c.kind === "history");
      if (hist.length === 0) continue; // only ever suspected
      status = hist[hist.length - 1].status as "active" | "resolved";
      basis = hist;
    }
    const latest = basis[basis.length - 1];
    const row: ProblemRow = { condition: latest.label, status, evidence: [] };
    const withIcd = basis.filter((c) => c.icd);
    if (withIcd.length) row.icd10cm = withIcd[withIcd.length - 1].icd;
    const hist = g.filter((c) => c.kind === "history" && c.onsetText);
    for (let i = hist.length - 1; i >= 0; i--) {
      const o = parseOnset(hist[i].onsetText);
      if (o) {
        row.onset = o;
        break;
      }
    }
    if (g.some((c) => isCkd(c.label, c.icd))) {
      // Prefer clinician diagnoses over unverified history lines; latest first.
      const ordered = [...g.filter((c) => c.kind === "history"), ...g.filter((c) => c.kind === "diagnosis" && c.status !== "ruled_out")];
      for (let i = ordered.length - 1; i >= 0; i--) {
        const s = ckdStage(ordered[i].label, ordered[i].icd);
        if (s) {
          row.ckd_stage = s;
          break;
        }
      }
      for (let i = ordered.length - 1; i >= 0; i--) {
        const a = albuminuria(ordered[i].label);
        if (a) {
          row.albuminuria = a;
          break;
        }
      }
    }
    const seen = new Set<string>();
    for (const c of [...g].reverse()) {
      if (c.status === "ruled_out" || (c.kind === "diagnosis" && c.status === "working")) continue;
      const k = `${c.doc.item.id}|${c.id}`;
      if (seen.has(k)) continue;
      seen.add(k);
      row.evidence.push({ item_id: c.doc.item.id, entry_id: c.id });
    }
    if (row.evidence.length === 0) row.evidence.push({ item_id: latest.doc.item.id, entry_id: latest.id });
    rows.push(sortKeys(row));
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Allergies
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const ALLERGIC = /hives|urticaria|rash|angioedema|anaphyla|bronchospasm|wheez|throat (swelling|closing)|swelling|itch|prurit|stevens|sjs|\bten\b|dress|eczema|allergic/i;
const SERIOUS_ADVERSE = /ketoacidosis|\bdka\b|lactic acidosis|pancreatitis|hepatotox|liver (injury|failure)|kidney injury|renal failure|\baki\b|agranulocytosis|rhabdomyolysis|hyperkalemia|hyponatremia|bleed|hemorrhage|qt prolong|torsade|seizure|hypoglycemi|neutropenia|thrombocytopenia|myopathy/i;
const HIGH_CRIT = /anaphyla|angioedema|stevens|sjs|toxic epidermal|ketoacidosis|\bdka\b|lactic acidosis|throat (swelling|closing)|bronchospasm/i;

function classifyReaction(reaction: string | undefined): AllergyIntoleranceRow["type"] {
  if (!reaction) return "allergy";
  if (ALLERGIC.test(reaction)) return "allergy";
  if (SERIOUS_ADVERSE.test(reaction)) return "adverse_reaction";
  return "intolerance";
}

function handleAdverse(
  list: { c: CondEntry; tcode: boolean }[],
  docs: Doc[],
  out: AllergyIntoleranceRow[],
  links: AdverseLink[],
): void {
  // Only established diagnoses count (not working, not ruled out); latest status per entry group wins.
  const latestByKey = new Map<string, CondEntry>();
  const allByKey = new Map<string, CondEntry[]>();
  for (const { c, tcode } of list) {
    if (c.kind === "diagnosis" && c.status === "working") continue;
    const phrase = drugPhrase(c.label) ?? (tcode ? c.label : undefined);
    if (!phrase) continue;
    const res = resolveDrug(phrase, c.doc.encId, docs);
    const key = res.rxnorm ? `rx:${res.rxnorm}` : `s:${res.substance.toLowerCase()}`;
    const prev = latestByKey.get(key);
    if (!prev || c.docIdx >= prev.docIdx) latestByKey.set(key, c);
    const all = allByKey.get(key) ?? [];
    all.push(c);
    allByKey.set(key, all);
  }
  for (const [key, c] of latestByKey) {
    if (c.status === "ruled_out") continue;
    const phrase = drugPhrase(c.label) ?? c.label;
    const res = resolveDrug(phrase, c.doc.encId, docs);
    const all = (allByKey.get(key) ?? []).filter((x) => x.status !== "ruled_out").sort((a, b) => a.docIdx - b.docIdx);
    let reaction = c.label;
    // Name the reaction by the illness (strip the drug attribution).
    const stripped = c.label
      .replace(/,?\s*[A-Za-z0-9 \-\/]*?[- ](associated|induced|related)\b/i, "")
      .replace(/\s*,\s*$/, "")
      .trim();
    if (stripped && stripped !== c.label) reaction = stripped;
    const first = all[0] ?? c;
    const enc = first.doc.enc;
    const onsetDate = localDate(str(enc?.arrived) ?? str(enc?.admitted) ?? first.doc.item.effective);
    const row: AllergyIntoleranceRow = {
      substance: res.substance,
      type: "adverse_reaction",
      reaction,
      criticality: HIGH_CRIT.test(c.label) ? "high" : "unknown",
      evidence: [
        ...all.reverse().map((x) => ({ item_id: x.doc.item.id, entry_id: x.id })),
        ...res.evidence,
      ],
    };
    if (res.rxnorm) row.rxnorm_ingredient = res.rxnorm;
    if (onsetDate && onsetDate.length === 10) row.onset = { value: onsetDate, precision: "day" };
    out.push(row);
    links.push({ ingredient: res.substance.toLowerCase(), rxnorm: res.rxnorm, encId: c.doc.encId });
  }
}

function buildAllergies(docs: Doc[], adverseRows: AllergyIntoleranceRow[]): AllergyIntoleranceRow[] {
  const rows: AllergyIntoleranceRow[] = [];
  const listDocs = docs.filter((d) => d.entries.some(([, e]) => e.type === "allergy"));
  if (listDocs.length > 0) {
    const snap = listDocs[listDocs.length - 1];
    const byKey = new Map<string, AllergyIntoleranceRow>();
    for (const [id, e] of snap.entries) {
      if (e.type !== "allergy") continue;
      const sub = str(e.substance);
      if (!sub) continue;
      if (/^(nkda|nka|no known (drug )?allergies)$/i.test(sub.trim())) continue;
      const rx = str(e.rxnorm_ingredient);
      const reaction = str(e.reaction);
      const ing = rx ? ingredientName(sub) ?? sub.toLowerCase() : BRANDS[sub.toLowerCase()] ?? sub;
      const type = classifyReaction(reaction);
      let crit: AllergyIntoleranceRow["criticality"] =
        e.severity === "severe" ? "high" : e.severity === "mild" ? "low" : "unknown";
      if (reaction && HIGH_CRIT.test(reaction)) crit = "high";
      const key = rx ? `rx:${rx}` : `s:${ing.toLowerCase()}`;
      const prev = byKey.get(key);
      if (prev) {
        if (reaction && !(prev.reaction ?? "").split("; ").includes(reaction))
          prev.reaction = prev.reaction ? `${prev.reaction}; ${reaction}` : reaction;
        if (crit === "high" || (prev.criticality === "unknown" && crit === "low")) prev.criticality = crit;
        if (type === "allergy" || (type === "adverse_reaction" && prev.type === "intolerance")) prev.type = type;
        prev.evidence.push({ item_id: snap.item.id, entry_id: id });
        continue;
      }
      const row: AllergyIntoleranceRow = {
        substance: ing,
        type,
        criticality: crit,
        evidence: [{ item_id: snap.item.id, entry_id: id }],
      };
      if (rx) row.rxnorm_ingredient = rx;
      if (reaction) row.reaction = reaction;
      byKey.set(key, row);
      rows.push(row);
    }
  }
  for (const a of adverseRows) {
    const match = rows.find(
      (r) => (a.rxnorm_ingredient && r.rxnorm_ingredient === a.rxnorm_ingredient) || r.substance.toLowerCase() === a.substance.toLowerCase(),
    );
    if (match) {
      match.evidence.push(...a.evidence);
      if (!match.reaction && a.reaction) match.reaction = a.reaction;
      if (!match.onset && a.onset) match.onset = a.onset;
      if (match.criticality !== "high" && a.criticality === "high") match.criticality = "high";
      if (!match.rxnorm_ingredient && a.rxnorm_ingredient) match.rxnorm_ingredient = a.rxnorm_ingredient;
      continue;
    }
    rows.push(a);
  }
  return rows.map(sortKeys);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Labs
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const LOINC_MAP: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "33914-3": "egfr", "48642-3": "egfr", "48643-1": "egfr",
  "88293-6": "egfr", "88294-4": "egfr", "50044-7": "egfr", "77147-7": "egfr", "50210-4": "egfr", "69405-9": "egfr",
  "2823-3": "potassium", "6298-4": "potassium",
  "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "41276-7": "anion_gap",
  "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "4549-2": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr", "13705-9": "uacr", "14958-3": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets",
  "6690-2": "wbc", "26464-8": "wbc", "33256-9": "wbc",
  "718-7": "hemoglobin", "30313-1": "hemoglobin", "20509-6": "hemoglobin",
  "53060-9": "bhb", "47995-6": "bhb",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2745-8": "ph", "33254-4": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2", "2020-6": "pco2",
  "3040-3": "lipase", "1990-1": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol",
  "2571-8": "triglycerides",
  "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl", "69419-0": "ldl",
};

const LOCAL_MAP: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", CRE: "creatinine",
  EGFR: "egfr",
  K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", TCO2: "bicarbonate", HCO3S: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", ACR: "uacr",
  PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", VPH: "ph", APH: "ph", PH: "ph", CPH: "ph", VPCO2: "pco2", APCO2: "pco2", PCO2: "pco2", CPCO2: "pco2",
  LIPASE: "lipase", LIP: "lipase", TROPI: "troponin", TNI: "troponin", TROP: "troponin",
  CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

function analyteFor(test: any, specimen: string): Analyte | undefined {
  const name = String(test?.name ?? "");
  const loinc = str(test?.loinc);
  const local = String(test?.local_code ?? "").toUpperCase();
  let a: Analyte | undefined = (loinc && LOINC_MAP[loinc]) || LOCAL_MAP[local];
  if (!a && !loinc) {
    const n = name.toLowerCase();
    if (/beta[- ]?hydroxybutyrate|\bbhb\b/.test(n)) a = "bhb";
    else if (/^creatinine\b/.test(n) && !/urine|clearance/.test(n)) a = "creatinine";
    else if (/\begfr\b/.test(n)) a = "egfr";
    else if (/lipase/.test(n)) a = "lipase";
    else if (/troponin i\b/.test(n)) a = "troponin";
    else if (/hemoglobin a1c|\bhba1c\b|\ba1c\b/.test(n)) a = "a1c";
    else if (/albumin.*creatinine.*ratio|\buacr\b/.test(n)) a = "uacr";
  }
  if (!a) return undefined;
  const n = name.toLowerCase();
  const sp = specimen.toLowerCase();
  if (a === "troponin" && /troponin t\b|tnt/.test(n)) return undefined;
  if (a === "glucose" && (/poc|point[- ]of[- ]care|meter|fingerstick|capillary/.test(n) || /capillary|fingerstick/.test(sp))) return undefined;
  if (a === "glucose" && /urine|csf|fluid/.test(sp)) return undefined;
  if ((a === "creatinine" || a === "potassium" || a === "sodium" || a === "bun") && /urine/.test(sp + " " + n)) return undefined;
  if (a === "ph" && /urine/.test(sp + " " + n)) return undefined;
  return a;
}

const UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function normUnit(u: string | undefined): string {
  return (u ?? "").replace(/\s+/g, "").replace(/µ|μ/g, "u").toLowerCase();
}

/** Factor converting the reported unit to the analyte's unit, or undefined if unknown. */
function unitFactor(a: Analyte, unit: string | undefined, value: number): ((v: number) => number) | undefined {
  const u = normUnit(unit);
  const id = (v: number) => v;
  switch (a) {
    case "ph":
      return u === "" || u === "[ph]" || u === "ph" ? id : undefined;
    case "egfr":
      return /^ml\/min(\/1\.73m2|\/\{1\.73_m2\}|\/1\.73m\^2|\/1\.73sqm|\/1\.73m²)?$/.test(u) ? id : undefined;
    case "creatinine":
      if (u === "mg/dl") return id;
      if (u === "umol/l") return (v) => v / 88.42;
      return undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      return u === "mmol/l" || u === "meq/l" ? id : undefined;
    case "bun":
      return u === "mg/dl" ? id : u === "mmol/l" ? (v) => v * 2.801 : undefined;
    case "glucose":
      return u === "mg/dl" ? id : u === "mmol/l" ? (v) => v * 18.016 : undefined;
    case "a1c":
      return u === "%" || u === "%hb" || u === "%{hb}" ? id : u === "mmol/mol" ? (v) => v / 10.929 + 2.15 : undefined;
    case "uacr":
      return u === "mg/g" || u === "mg/g{creat}" || u === "ug/mg" ? id : u === "mg/mmol" ? (v) => v * 8.84 : undefined;
    case "platelets": case "wbc":
      if (["10*3/ul", "k/ul", "10^3/ul", "x10^3/ul", "x10e3/ul", "10*9/l", "10^9/l", "x10^9/l", "thou/ul", "k/mm3", "10*3/mm3"].includes(u)) return id;
      if (u === "/ul" || u === "cells/ul" || u === "/mm3") return (v) => v / 1000;
      return undefined;
    case "hemoglobin":
      return u === "g/dl" ? id : u === "g/l" ? (v) => v / 10 : undefined;
    case "pco2":
      return u === "mmhg" || u === "mm[hg]" ? id : u === "kpa" ? (v) => v * 7.50062 : undefined;
    case "lipase":
      return u === "u/l" || u === "iu/l" ? id : undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return id;
      if (u === "ng/l" || u === "pg/ml") return (v) => v / 1000;
      return undefined;
    case "cholesterol": case "hdl": case "ldl":
      return u === "mg/dl" ? id : u === "mmol/l" ? (v) => v * 38.67 : undefined;
    case "triglycerides":
      return u === "mg/dl" ? id : u === "mmol/l" ? (v) => v * 88.57 : undefined;
  }
  return undefined;
}

function parseValue(text: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof text === "number" && isFinite(text)) return { value: text };
  if (typeof text !== "string") return undefined;
  const m = text.trim().replace(/,/g, "").match(/^(<=|>=|≤|≥|<|>)?\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+))$/);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!isFinite(value)) return undefined;
  const c = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as LabResultRow["comparator"] | undefined);
  return c ? { value, comparator: c } : { value };
}

function round(v: number, digits: number): number {
  const f = Math.pow(10, digits);
  return Math.round(v * f) / f;
}

function egfrEquation(name: string, loinc: string | undefined, collected: string): LabResultRow["egfr_equation"] {
  const n = name.toLowerCase();
  if (/mdrd/.test(n)) return "mdrd";
  if (/ckd[- ]?epi/.test(n) || /2021|2009/.test(n)) {
    if (/2021|race[- ]free|without race/.test(n)) return "ckd-epi-2021";
    if (/2009/.test(n)) return "ckd-epi-2009";
  }
  if (loinc === "98979-8" || loinc === "98980-6") return "ckd-epi-2021";
  if (loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  if (loinc === "33914-3" || loinc === "48642-3" || loinc === "48643-1" || loinc === "50044-7" || loinc === "77147-7") return "mdrd";
  const d = localDate(collected);
  if (d && d >= "2023-01-01") return "ckd-epi-2021"; // Riverside: CKD-EPI 2021 for all results since 2023
  return "unknown";
}

function isRaceVariant(name: string, loinc: string | undefined): boolean {
  if (loinc === "48643-1" || loinc === "88293-6") return true;
  const n = name.toLowerCase();
  if (/non[- ]?(african|black|aa\b)/.test(n)) return false;
  return /african[- ]american|\bblack\b|\baa\b/.test(n);
}

const STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

interface LabCopy {
  doc: Doc;
  docIdx: number;
  entryId: string;
  status: string;
  value: any;
  collected: string;
  specimen: string;
  accession: string;
}

function buildLabs(docs: Doc[]): LabResultRow[] {
  const copies = new Map<string, LabCopy[]>();
  const add = (key: string, c: LabCopy) => {
    const l = copies.get(key) ?? [];
    l.push(c);
    copies.set(key, l);
  };
  docs.forEach((doc, docIdx) => {
    for (const [id, e] of doc.entries) {
      if (e.type === "result" && isObj(e.test)) {
        const acc = str(e.accession) ?? `${doc.item.id}:${id}`;
        add(`${acc}|${e.test.local_code ?? e.test.name}`, {
          doc, docIdx, entryId: id, status: e.status, value: e,
          collected: e.collected, specimen: String(e.specimen ?? ""), accession: acc,
        });
      } else if (e.type === "panel" && Array.isArray(e.components)) {
        const acc = str(e.accession) ?? `${doc.item.id}:${id}`;
        for (const comp of e.components) {
          if (!isObj(comp) || !isObj(comp.test)) continue;
          add(`${acc}|${comp.test.local_code ?? comp.test.name}`, {
            doc, docIdx, entryId: id, status: e.status, value: comp,
            collected: e.collected, specimen: String(e.specimen ?? ""), accession: acc,
          });
        }
      }
    }
  });

  const rows: LabResultRow[] = [];
  for (const list of copies.values()) {
    const best = [...list].sort(
      (a, b) => (STATUS_RANK[b.status] ?? 0) - (STATUS_RANK[a.status] ?? 0) || b.docIdx - a.docIdx,
    )[0];
    if (!best || !(best.status in STATUS_RANK)) continue;
    const test = best.value.test;
    const analyte = analyteFor(test, best.specimen);
    if (!analyte) continue;
    if (!best.collected || isNaN(Date.parse(best.collected))) continue;
    const name = String(test.name ?? "");
    const loinc = str(test.loinc);
    if (analyte === "egfr" && isRaceVariant(name, loinc)) continue;
    const pv = parseValue(best.value.value);
    if (!pv) continue;
    const conv = unitFactor(analyte, str(best.value.unit), pv.value);
    if (!conv) continue;
    let value = conv(pv.value);
    if (conv(1) !== 1) value = round(value, analyte === "glucose" || analyte === "uacr" || analyte === "platelets" || analyte === "wbc" ? 1 : 3);
    if (analyte === "glucose" && conv(1) !== 1) value = Math.round(value);
    const row: LabResultRow = {
      analyte,
      value,
      unit: UNIT[analyte],
      collected: localInstant(best.collected),
      status: best.status === "preliminary" ? "preliminary" : "final",
      evidence: [],
    };
    if (pv.comparator) row.comparator = pv.comparator;
    if (analyte === "egfr") row.egfr_equation = egfrEquation(name, loinc, best.collected);
    if (loinc) row.loinc = loinc;
    const seen = new Set<string>();
    for (const c of [best, ...[...list].sort((a, b) => b.docIdx - a.docIdx)]) {
      const k = `${c.doc.item.id}|${c.entryId}`;
      if (seen.has(k)) continue;
      seen.add(k);
      row.evidence.push({ item_id: c.doc.item.id, entry_id: c.entryId });
    }
    rows.push(sortKeys(row));
  }
  rows.sort((a, b) => Date.parse(a.collected) - Date.parse(b.collected) || a.analyte.localeCompare(b.analyte));
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Vitals
// ─────────────────────────────────────────────────────────────────────────────────────────────────

function num(x: unknown): number | undefined {
  return typeof x === "number" && isFinite(x) ? x : undefined;
}

function buildVitals(docs: Doc[]): VitalRow[] {
  interface V {
    t: number;
    taken: string;
    encId: string;
    sys?: number;
    dia?: number;
    hr?: number;
    wt?: number;
    ev: Evidence;
  }
  const byKey = new Map<string, V>();
  for (const doc of docs) {
    for (const [id, e] of doc.entries) {
      if (e.type !== "vitals") continue;
      const t = ms(e.taken);
      if (isNaN(t)) continue;
      const bp = isObj(e.bp) ? e.bp : undefined;
      const sys = num(bp?.systolic_mmhg);
      const dia = num(bp?.diastolic_mmhg);
      const hr = num(e.heart_rate_bpm);
      const wt = num(e.weight_kg);
      if (sys === undefined && dia === undefined && hr === undefined && wt === undefined) continue;
      const key = `${t}|${sys}|${dia}|${hr}|${wt}`;
      const prev = byKey.get(key);
      if (prev) {
        prev.ev.push({ item_id: doc.item.id, entry_id: id });
        continue;
      }
      byKey.set(key, { t, taken: e.taken, encId: doc.encId, sys, dia, hr, wt, ev: [{ item_id: doc.item.id, entry_id: id }] });
    }
  }
  const sets = Array.from(byKey.values()).sort((a, b) => a.t - b.t);
  const rows: VitalRow[] = [];
  let last: { v: V; row: VitalRow } | undefined;
  for (const v of sets) {
    // A BP repeated within 30 minutes during the same stay is a repeat on the earlier set.
    if (
      last &&
      last.v.encId === v.encId &&
      v.t - last.v.t <= 30 * 60000 &&
      v.t > last.v.t &&
      v.sys !== undefined &&
      last.row.systolic_mmhg !== undefined &&
      last.row.repeat_systolic_mmhg === undefined
    ) {
      last.row.repeat_systolic_mmhg = v.sys;
      if (v.dia !== undefined) last.row.repeat_diastolic_mmhg = v.dia;
      if (last.row.pulse_bpm === undefined && v.hr !== undefined) last.row.pulse_bpm = v.hr;
      if (last.row.weight_kg === undefined && v.wt !== undefined) last.row.weight_kg = round(v.wt, 1);
      last.row.evidence.push(...v.ev);
      continue;
    }
    const lp = localParts(v.taken);
    if (!lp || !lp.time) continue;
    const row: VitalRow = { setting: "hospital", local_time: `${lp.date}T${lp.time}`, evidence: v.ev };
    if (v.sys !== undefined) row.systolic_mmhg = v.sys;
    if (v.dia !== undefined) row.diastolic_mmhg = v.dia;
    if (v.hr !== undefined) row.pulse_bpm = v.hr;
    if (v.wt !== undefined) row.weight_kg = round(v.wt, 1);
    rows.push(row);
    last = { v, row };
  }
  return rows.map(sortKeys);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────

function sortKeys<T extends object>(o: T): T {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(o).sort()) {
    const v = (o as Record<string, unknown>)[k];
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

function safe<T>(f: () => T[]): T[] {
  try {
    return f();
  } catch {
    return [];
  }
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  let docs: Doc[] = [];
  try {
    docs = currentDocs(items, asOf);
  } catch {
    docs = [];
  }
  const adverseRows: AllergyIntoleranceRow[] = [];
  const adverseLinks: AdverseLink[] = [];
  const problems = safe(() => buildProblems(docs, adverseRows, adverseLinks));
  return {
    medications: safe(() => buildMedications(docs, adverseLinks)),
    problems,
    allergies: safe(() => buildAllergies(docs, adverseRows)),
    labs: safe(() => buildLabs(docs)),
    vitals: safe(() => buildVitals(docs)),
  };
}
