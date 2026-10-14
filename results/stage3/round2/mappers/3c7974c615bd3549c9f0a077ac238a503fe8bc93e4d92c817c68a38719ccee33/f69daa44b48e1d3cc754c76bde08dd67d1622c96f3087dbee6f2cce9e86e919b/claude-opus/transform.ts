import type { FolioItem, UsCoreRows, MedicationRequest, Observation, Quantity } from "../in/views/uscore";

// Riverside Regional Hospital (riverside-doc-v1) -> US Core MedicationRequest + lab Observation.

const ORG_NAME = "Riverside Regional Hospital";
const RXNORM = "http://www.nlm.nih.gov/research/umls/rxnorm";
const LOINC = "http://loinc.org";
const UCUM = "http://unitsofmeasure.org";

// ───────────────────────────── time helpers ─────────────────────────────

const HAS_ZONE = /(?:[zZ]|[+-]\d\d:?\d\d)$/;

function nthSundayUtc(year: number, month: number, n: number): number {
  // day-of-month of the nth Sunday (n >= 1) or last Sunday (n = -1)
  if (n > 0) {
    const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
    return 1 + ((7 - first) % 7) + (n - 1) * 7;
  }
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  return lastDay.getUTCDate() - lastDay.getUTCDay();
}

/** America/Chicago offset from UTC in hours (-6 or -5) at a UTC instant. */
function chicagoOffset(ms: number): number {
  const y = new Date(ms).getUTCFullYear();
  let start: number, end: number;
  if (y >= 2007) {
    start = Date.UTC(y, 2, nthSundayUtc(y, 2, 2), 8);
    end = Date.UTC(y, 10, nthSundayUtc(y, 10, 1), 7);
  } else {
    start = Date.UTC(y, 3, nthSundayUtc(y, 3, 1), 8);
    end = Date.UTC(y, 9, nthSundayUtc(y, 9, -1), 7);
  }
  return ms >= start && ms < end ? -5 : -6;
}

function parseInstant(s: unknown): number | undefined {
  if (typeof s !== "string" || !HAS_ZONE.test(s.trim())) return undefined;
  const ms = Date.parse(s.trim());
  return isNaN(ms) ? undefined : ms;
}

/** Local (Chicago) date of a timestamp; zone-less strings are already local. */
function localDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  const ms = parseInstant(t);
  if (ms !== undefined) return new Date(ms + chicagoOffset(ms) * 3600e3).toISOString().slice(0, 10);
  const m = /^(\d{4}(?:-\d{2}(?:-\d{2})?)?)/.exec(t);
  return m ? m[1] : undefined;
}

/** Sortable key for a timestamp: UTC ms where possible, else local wall-clock treated as local. */
function timeKey(s: unknown): number {
  if (typeof s !== "string") return -Infinity;
  const ms = parseInstant(s);
  if (ms !== undefined) return ms;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(s.trim());
  if (!m) return -Infinity;
  const naive = Date.UTC(+m[1], m[2] ? +m[2] - 1 : 0, m[3] ? +m[3] : 1, m[4] ? +m[4] : 0, m[5] ? +m[5] : 0, m[6] ? +m[6] : 0);
  return naive - chicagoOffset(naive + 6 * 3600e3) * 3600e3;
}

/** First UTC instant after the end of the local day `asOf`. */
function cutoffFor(asOf: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(asOf || "");
  if (!m) return Infinity;
  const naive = Date.UTC(+m[1], +m[2] - 1, +m[3] + 1);
  return naive - chicagoOffset(naive + 6 * 3600e3) * 3600e3;
}

// ───────────────────────────── item scope ─────────────────────────────

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x.trim() : undefined;
}

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const cutoff = cutoffFor(asOf);
  const inScope = (Array.isArray(items) ? items : []).filter((it) => {
    if (!isObj(it) || typeof it.id !== "string") return false;
    const k = timeKey(it.recorded);
    return k !== -Infinity && k < cutoff;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const ref of [...(Array.isArray(it.supersedes) ? it.supersedes : []), ...(Array.isArray(it.retracts) ? it.retracts : [])]) {
      if (typeof ref === "string") dead.add(it.issuer + "|" + ref);
    }
  }
  return inScope.filter((it) => !dead.has(it.issuer + "|" + it.id));
}

function entries(it: FolioItem): [string, Record<string, any>][] {
  const p = it.payload;
  if (!isObj(p)) return [];
  return Object.keys(p)
    .sort()
    .filter((k) => isObj(p[k]))
    .map((k) => [k, p[k]] as [string, Record<string, any>]);
}

function encounterOf(it: FolioItem): Record<string, any> | undefined {
  const p = it.payload;
  if (!isObj(p)) return undefined;
  if (isObj(p.enc) && p.enc.type === "encounter") return p.enc;
  for (const [, e] of entries(it)) if (e.type === "encounter") return e;
  return undefined;
}

// ───────────────────────────── medications ─────────────────────────────

const RX_NAMES: Record<string, string> = {
  "6809": "metformin", "1545653": "empagliflozin", "1488564": "dapagliflozin", "1373458": "canagliflozin",
  "52175": "losartan", "5487": "hydrochlorothiazide", "29046": "lisinopril", "274783": "insulin glargine",
  "17767": "amlodipine", "83367": "atorvastatin", "36567": "simvastatin", "301542": "rosuvastatin",
  "4603": "furosemide", "6918": "metoprolol", "1202": "atenolol", "7646": "omeprazole", "25480": "gabapentin",
  "11289": "warfarin", "1364430": "apixaban", "4815": "glipizide", "25789": "glimepiride", "593411": "sitagliptin",
  "475968": "liraglutide", "1991302": "semaglutide", "1191": "aspirin", "7258": "naproxen", "5640": "ibuprofen",
  "10582": "levothyroxine", "9997": "spironolactone", "20352": "carvedilol", "161": "acetaminophen",
};

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", cozaar: "losartan", lasix: "furosemide", lantus: "insulin glargine",
  basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine", levemir: "insulin detemir",
  tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart", zestril: "lisinopril",
  prinivil: "lisinopril", norvasc: "amlodipine", lipitor: "atorvastatin", crestor: "rosuvastatin",
  zocor: "simvastatin", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  victoza: "liraglutide", trulicity: "dulaglutide", mounjaro: "tirzepatide", januvia: "sitagliptin",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", synthroid: "levothyroxine",
  toprol: "metoprolol", lopressor: "metoprolol", aleve: "naproxen", advil: "ibuprofen", motrin: "ibuprofen",
  tylenol: "acetaminophen", microzide: "hydrochlorothiazide", glucotrol: "glipizide", amaryl: "glimepiride",
};

const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "er", "xr", "xl", "sr", "dr", "ec",
  "extended-release", "extended", "release", "delayed-release", "oral", "solution", "injection", "pen", "inhaler",
  "suspension", "cream", "patch", "ointment", "po", "subq", "sc", "iv", "vial", "syringe", "prefilled", "chewable",
]);
const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "potassium", "sodium", "succinate", "tartrate", "besylate", "maleate", "mesylate",
  "fumarate", "sulfate", "magnesium", "calcium",
]);

function ingredientFromName(name: string): string | undefined {
  let words = name.toLowerCase().replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  const cut = words.findIndex((w) => /^[\d.]/.test(w));
  if (cut >= 0) words = words.slice(0, cut);
  words = words.filter((w) => !FORM_WORDS.has(w));
  if (words.length > 1) words = [words[0], ...words.slice(1).filter((w) => !SALT_WORDS.has(w))];
  if (words.length === 0) return undefined;
  const joined = words.join(" ");
  if (BRANDS[joined]) return BRANDS[joined];
  if (BRANDS[words[0]]) return BRANDS[words[0]];
  return joined;
}

function ingredientOf(e: Record<string, any>): string | undefined {
  const rx = str(e.rxnorm_ingredient);
  if (rx && RX_NAMES[rx]) return RX_NAMES[rx];
  const n = str(e.drug_name);
  return n ? ingredientFromName(n) : undefined;
}

type MedStatus = "active" | "held" | "stopped" | "unknown";

function mapMedStatus(s: unknown): MedStatus | undefined {
  switch (s) {
    case "not_reconciled": return "unknown";
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
    default: return undefined;
  }
}

function lineKey(e: Record<string, any>): string {
  const id = str(e.rxnorm_ingredient) ?? "name:" + (str(e.drug_name) ?? "").toLowerCase().replace(/\s+/g, " ");
  return id + "|" + (str(e.dose_text) ?? "").toLowerCase().replace(/\s+/g, " ");
}

function groupKey(e: Record<string, any>): string {
  const rx = str(e.rxnorm_ingredient);
  if (rx) return "rx:" + rx;
  return "ing:" + (ingredientOf(e) ?? (str(e.drug_name) ?? "").toLowerCase());
}

function parseDose(doseText: string | undefined, drugName: string | undefined): { value: number; unit: "mg" | "mcg" | "units" | "mL" | "tablet" } | undefined {
  if (!doseText) return undefined;
  const t = doseText.toLowerCase().trim();
  if (/\b(or|to)\b|\d\s*-\s*\d|sliding|scale|per\b|protocol/.test(t)) return undefined;
  const m = /^(\d+(?:\.\d+)?)\s*([a-zµμ]+)/.exec(t);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  const u = m[2];
  if (u === "mg") return { value: n, unit: "mg" };
  if (u === "g" || u === "gm" || u === "gram" || u === "grams") return { value: round(n * 1000), unit: "mg" };
  if (u === "mcg" || u === "ug" || u === "µg" || u === "μg") return { value: n, unit: "mcg" };
  if (u === "unit" || u === "units" || u === "u" || u === "iu" || u === "unt") return { value: n, unit: "units" };
  if (u === "ml") return { value: n, unit: "mL" };
  if (/^(tab|tabs|tablet|tablets|cap|caps|capsule|capsules)$/.test(u)) {
    const s = strengthOf(drugName);
    if (s) return { value: round(n * s.value), unit: s.unit };
    return { value: n, unit: "tablet" };
  }
  return undefined;
}

function strengthOf(name: string | undefined): { value: number; unit: "mg" | "mcg" } | undefined {
  if (!name) return undefined;
  const all = [...name.toLowerCase().matchAll(/(\d+(?:\.\d+)?(?:\s*[-/]\s*\d+(?:\.\d+)?)*)\s*(mg|mcg|ug|g)\b/g)];
  if (all.length !== 1) return undefined;
  const num = all[0][1];
  if (/[-/]/.test(num)) return undefined;
  const v = parseFloat(num);
  const u = all[0][2];
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u === "mg") return { value: v, unit: "mg" };
  return { value: v, unit: "mcg" };
}

function round(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

function parseFrequency(sig: string | undefined): "QD" | "BID" | "TID" | "QHS" | "QW" | "PRN" | "other" | undefined {
  if (!sig) return undefined;
  const s = " " + sig.toLowerCase().replace(/[.,;]/g, " ") + " ";
  if (/\bprn\b|as needed|as-needed/.test(s)) return "PRN";
  if (/\bqid\b|four times|\bq\s?[46]\s?h|every [46] hours|every other day|\bqod\b|twice (a |per )?week|monthly/.test(s)) return "other";
  if (/\bqw\b|\bqwk\b|weekly|once a week|every week|once per week/.test(s)) return "QW";
  if (/\btid\b|three times|\bq\s?8\s?h|every 8 hours/.test(s)) return "TID";
  if (/\bbid\b|twice|two times|\bq\s?12\s?h|every 12 hours/.test(s)) return "BID";
  if (/\bqhs\b|\bhs\b|bedtime|at night|nightly/.test(s)) return "QHS";
  if (/\bqd\b|\bdaily\b|once a day|once daily|every day|every morning|\bqam\b|\bq\s?24\s?h|in the morning|each morning/.test(s)) return "QD";
  return undefined;
}

const CLASS_MEMBERS: [RegExp, RegExp][] = [
  [/sglt2|sglt-2/i, /gliflozin$/],
  [/ace inhibitor|ace-inhibitor|acei\b/i, /pril$/],
  [/\barb\b|angiotensin receptor/i, /sartan$/],
  [/nsaid/i, /^(naproxen|ibuprofen|diclofenac|meloxicam|celecoxib|ketorolac|indomethacin)$/],
  [/statin/i, /statin$/],
];

function diagnosisBlames(dx: Record<string, any>, ingredient: string): boolean {
  const text = [str(dx.label), isObj(dx.riverside_dx) ? str(dx.riverside_dx.name) : undefined].filter(Boolean).join(" ").toLowerCase();
  const code = str(dx.icd10cm) ?? "";
  const drugCaused = /associated|induced|related|due to|adverse|toxicity|caused/.test(text) || /^T(3[6-9]|4\d|50)\./i.test(code);
  if (!drugCaused) return false;
  if (text.includes(ingredient.toLowerCase())) return true;
  return CLASS_MEMBERS.some(([cls, member]) => cls.test(text) && member.test(ingredient));
}

function stopReason(e: Record<string, any>, ingredient: string | undefined, doc: FolioItem): "adverse_reaction" | "ineffective" | "therapy_changed" | "course_complete" | "patient_choice" | undefined {
  const t = (str(e.instructions) ?? "").toLowerCase();
  if (/side effect|adverse|reaction|intoleran|allerg|angioedema|rash|hives|ketoacidosis|lactic acidosis|hyperkalemia|toxicity/.test(t)) return "adverse_reaction";
  if (/ineffective|not effective|not working|inadequate response|no benefit/.test(t)) return "ineffective";
  if (/replaced|switch|changed to|in favor of|instead/.test(t)) return "therapy_changed";
  if (/course complete|completed|course finished|finished course/.test(t)) return "course_complete";
  if (/patient (declined|refused|prefer|request|chose|wish)|per patient/.test(t)) return "patient_choice";
  if (ingredient) {
    for (const [, d] of entries(doc)) {
      if (d.type === "diagnosis" && d.status !== "ruled_out" && d.status !== "working" && diagnosisBlames(d, ingredient)) return "adverse_reaction";
    }
  }
  return undefined;
}

interface Doc {
  item: FolioItem;
  enc?: Record<string, any>;
  kind?: string;
  encId: string;
  /** Clinical time at which this document's medication decisions apply. */
  decisionTime: number;
  recorded: number;
  decisionDate?: string;
}

function toDoc(it: FolioItem): Doc {
  const enc = encounterOf(it);
  const kind = enc ? str(enc.document_kind) : undefined;
  const encId = (enc && str(enc.encounter_id)) || "item:" + it.id;
  let when: unknown = it.effective;
  if (kind === "discharge_summary") when = (enc && str(enc.discharged)) ?? str(it.effective_end) ?? it.recorded;
  return {
    item: it, enc, kind, encId,
    decisionTime: timeKey(when),
    recorded: timeKey(it.recorded),
    decisionDate: localDate(when),
  };
}

function homeMeds(it: FolioItem): [string, Record<string, any>][] {
  return entries(it).filter(([, e]) => e.type === "home_med" && (str(e.drug_name) || str(e.rxnorm_ingredient)));
}

function selectSnapshot(allDocs: Doc[]): { snap: Doc; encDocs: Doc[] } | undefined {
  // Only signed documents (with an encounter context or a medication list) restate the home list.
  const docs = allDocs.filter((d) => d.enc || homeMeds(d.item).length > 0);
  if (docs.length === 0) return undefined;
  const byEnc = new Map<string, Doc[]>();
  for (const d of docs) {
    const l = byEnc.get(d.encId) ?? [];
    l.push(d);
    byEnc.set(d.encId, l);
  }
  let best: { start: number; last: number; docs: Doc[] } | undefined;
  for (const [, ds] of byEnc) {
    let start = Infinity;
    let last = -Infinity;
    for (const d of ds) {
      const sv = [timeKey(d.enc?.arrived), timeKey(d.enc?.admitted), timeKey(d.item.effective)].filter((x) => x !== -Infinity);
      const st = sv.length ? Math.min(...sv) : -Infinity;
      if (st < start) start = st;
      if (d.recorded > last) last = d.recorded;
    }
    if (!best || start > best.start || (start === best.start && last > best.last)) best = { start, last, docs: ds };
  }
  if (!best) return undefined;
  const encDocs = [...best.docs].sort(
    (a, b) => a.decisionTime - b.decisionTime || a.recorded - b.recorded || (a.item.id < b.item.id ? -1 : 1),
  );
  const ds = encDocs.filter((d) => d.kind === "discharge_summary").sort((a, b) => a.recorded - b.recorded || (a.item.id < b.item.id ? -1 : 1));
  const snap = ds.length ? ds[ds.length - 1] : encDocs[encDocs.length - 1];
  // Order the encounter's documents for history walks: in-stay notes, then discharge summaries.
  const ordered = [...encDocs.filter((d) => d.kind !== "discharge_summary"), ...ds];
  return { snap, encDocs: ordered };
}

/** Local date the current 'active' status began (started, resumed or changed), if the documents say. */
function activeSince(key: string, snap: Doc, encDocs: Doc[]): string | undefined {
  const idx = encDocs.indexOf(snap);
  let firstActive: { doc: Doc; status: string } | undefined;
  for (let i = idx; i >= 0; i--) {
    const d = encDocs[i];
    const line = homeMeds(d.item).find(([, e]) => lineKey(e) === key);
    if (!line) break;
    const st = line[1].status;
    if (mapMedStatus(st) !== "active") {
      if (st === "held" || st === "stopped") return firstActive?.doc.decisionDate; // resumed
      break; // after not_reconciled: pre-existing home drug, start unknown
    }
    firstActive = { doc: d, status: st };
  }
  if (firstActive && (firstActive.status === "new" || firstActive.status === "changed")) return firstActive.doc.decisionDate;
  return undefined;
}

/** Latest instruction text within the uninterrupted run of the same status for this line in the stay. */
function reasonFromRun(key: string, status: unknown, snap: Doc, encDocs: Doc[]): string | undefined {
  if (snap.kind === "discharge_summary") return undefined; // after-discharge decisions stand on their own
  for (let i = encDocs.indexOf(snap) - 1; i >= 0; i--) {
    const line = homeMeds(encDocs[i].item).find(([, e]) => lineKey(e) === key);
    if (!line || line[1].status !== status) return undefined;
    const t = str(line[1].instructions);
    if (t) return t;
  }
  return undefined;
}

function sanitizeId(s: string): string {
  return s.replace(/[^A-Za-z0-9.\-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
}

function uniqueId(base: string, used: Set<string>): string {
  let id = sanitizeId(base) || "x";
  if (used.has(id)) {
    let n = 2;
    while (used.has(sanitizeId(id.slice(0, 58) + "-" + n))) n++;
    id = sanitizeId(id.slice(0, 58) + "-" + n);
  }
  used.add(id);
  return id;
}

const STATUS_RANK: Record<MedStatus, number> = { active: 3, held: 2, unknown: 1, stopped: 0 };

function buildMedications(docs: Doc[]): MedicationRequest[] {
  const sel = selectSnapshot(docs);
  if (!sel) return [];
  const { snap, encDocs } = sel;
  const chosen = new Map<string, { entryId: string; e: Record<string, any>; status: MedStatus }>();
  for (const [entryId, e] of homeMeds(snap.item)) {
    const status = mapMedStatus(e.status);
    if (!status) continue;
    const g = groupKey(e);
    const prev = chosen.get(g);
    if (!prev || STATUS_RANK[status] > STATUS_RANK[prev.status]) chosen.set(g, { entryId, e, status });
  }
  const used = new Set<string>();
  const out: MedicationRequest[] = [];
  const patient = snap.item.patient;
  for (const g of [...chosen.keys()].sort()) {
    try {
      const { e, status } = chosen.get(g)!;
      const rx = str(e.rxnorm_ingredient);
      const drugName = str(e.drug_name) ?? (rx && RX_NAMES[rx]) ?? "unknown drug";
      const ingredient = ingredientOf(e);
      const reconciled = status !== "unknown";
      const mr: MedicationRequest = {
        resourceType: "MedicationRequest",
        id: uniqueId("med-" + (rx ? "rx" + rx : ingredient ?? drugName), used),
        meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
        status: status === "held" ? "on-hold" : status,
        intent: reconciled ? "order" : "plan",
        reportedBoolean: !reconciled,
        medicationCodeableConcept: rx
          ? { coding: [{ system: RXNORM, code: rx, ...(ingredient ? { display: ingredient } : {}) }], text: drugName }
          : { text: ingredient && ingredient !== drugName.toLowerCase() ? `${drugName} (${ingredient})` : drugName },
        subject: { reference: "Patient/" + patient },
      };
      if (status === "held" || status === "stopped") {
        const text = str(e.instructions) ?? reasonFromRun(lineKey(e), e.status, snap, encDocs);
        const code = status === "stopped" ? stopReason(e, ingredient, snap.item) : undefined;
        if (text || code) {
          mr.statusReason = {
            ...(code ? { coding: [{ system: "urn:folio:stop-reason", code }] } : {}),
            ...(text ? { text } : {}),
          };
        }
      }
      if (reconciled) {
        const author = snap.item.author;
        mr.requester = { display: (isObj(author) && str(author.name)) || ORG_NAME };
      }
      if (status === "active") {
        const since = activeSince(lineKey(e), snap, encDocs);
        if (since) mr.authoredOn = since;
      }
      const sig = str(e.sig);
      const dose = parseDose(str(e.dose_text), str(e.drug_name));
      const freq = parseFrequency(sig);
      if (sig || dose || freq) {
        const di: NonNullable<MedicationRequest["dosageInstruction"]>[number] = {};
        if (sig) di.text = sig;
        if (freq) di.timing = { code: { text: freq } };
        if (dose) {
          const code = { mg: "mg", mcg: "ug", units: "[iU]", mL: "mL", tablet: "{tbl}" }[dose.unit];
          di.doseAndRate = [{ doseQuantity: { value: dose.value, unit: dose.unit, system: UCUM, code } }];
        }
        mr.dosageInstruction = [di];
      }
      out.push(mr);
    } catch {
      // skip unreadable line
    }
  }
  return out;
}

// ───────────────────────────── labs ─────────────────────────────

type Analyte =
  | "creatinine" | "egfr" | "potassium" | "sodium" | "chloride" | "bicarbonate" | "anion_gap" | "bun"
  | "glucose" | "a1c" | "uacr" | "platelets" | "wbc" | "hemoglobin" | "bhb" | "ph" | "pco2" | "lipase"
  | "troponin" | "cholesterol" | "triglycerides" | "hdl" | "ldl";

const ANALYTE_UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const DEFAULT_LOINC: Record<Analyte, string> = {
  creatinine: "2160-0", egfr: "98979-8", potassium: "2823-3", sodium: "2951-2", chloride: "2075-0",
  bicarbonate: "2028-9", anion_gap: "33037-3", bun: "3094-0", glucose: "2345-7", a1c: "4548-4", uacr: "9318-7",
  platelets: "777-3", wbc: "6690-2", hemoglobin: "718-7", bhb: "53060-9", ph: "2746-6", pco2: "2021-4",
  lipase: "3040-3", troponin: "10839-9", cholesterol: "2093-3", triglycerides: "2571-8", hdl: "2085-9", ldl: "13457-7",
};

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr", "48642-3": "egfr", "48643-1": "egfr",
  "33914-3": "egfr", "69405-9": "egfr", "50044-7": "egfr", "50210-4": "egfr", "77147-7": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "20565-8": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "4548-4": "a1c", "17856-6": "a1c", "9318-7": "uacr", "14959-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "49497-1": "platelets", "6690-2": "wbc", "26464-8": "wbc", "804-5": "wbc",
  "718-7": "hemoglobin", "30313-1": "hemoglobin", "20509-6": "hemoglobin", "53060-9": "bhb",
  "2746-6": "ph", "2744-1": "ph", "11558-4": "ph", "2021-4": "pco2", "2019-8": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

const EGFR_LOINC_EQ: Record<string, "ckd-epi-2021" | "ckd-epi-2009" | "mdrd"> = {
  "98979-8": "ckd-epi-2021", "62238-1": "ckd-epi-2009", "88293-6": "ckd-epi-2009", "88294-4": "ckd-epi-2009",
  "48642-3": "mdrd", "48643-1": "mdrd", "33914-3": "mdrd", "50044-7": "mdrd",
};
const EGFR_EQ_LOINC: Record<string, string> = { "ckd-epi-2021": "98979-8", "ckd-epi-2009": "62238-1", mdrd: "33914-3", unknown: "69405-9" };
const RACE_LOINC = new Set(["88293-6", "48643-1"]);
const NONRACE_LOINC = new Set(["88294-4", "48642-3"]);

function analyteByName(text: string, specimen: string): Analyte | undefined {
  const t = text.toLowerCase();
  const urine = /urine|\bur\b|\bua\b/.test(t) || /urine/.test(specimen);
  if (/albumin.{0,12}creat|\bacr\b|uacr|microalb/.test(t)) return "uacr";
  if (urine) return undefined;
  if (/egfr|glomerular|\bgfr\b/.test(t)) return "egfr";
  if (/poc|point.of.care|meter|fingerstick|capillary|glucometer/.test(t)) return undefined;
  if (/creat/.test(t)) return "creatinine";
  if (/a1c|hba1c|glycated|glycosylated|glycohemoglobin/.test(t)) return "a1c";
  if (/potassium|^k$/.test(t)) return "potassium";
  if (/sodium|^na$/.test(t)) return "sodium";
  if (/chloride|^cl$/.test(t)) return "chloride";
  if (/anion gap|^agap$|^ag$/.test(t)) return "anion_gap";
  if (/bicarb|total co2|^co2$|^tco2$|^hco3$/.test(t)) return "bicarbonate";
  if (/urea nitrogen|^bun$/.test(t)) return "bun";
  if (/hydroxybutyr|^bhb$/.test(t)) return "bhb";
  if (/glucose|^glu$/.test(t)) return "glucose";
  if (/platelet|^plt$/.test(t)) return "platelets";
  if (/white blood|leukocyte|^wbc$/.test(t)) return "wbc";
  if (/hemoglobin|haemoglobin|^hgb$|^hb$/.test(t)) return "hemoglobin";
  if (/pco2/.test(t)) return "pco2";
  if (/\bph\b|^v?ph$|^a?ph$/.test(t)) return "ph";
  if (/lipase/.test(t)) return "lipase";
  if (/troponin\s*i\b|tni|troponin i/.test(t)) return "troponin";
  if (/triglycer/.test(t)) return "triglycerides";
  if (/\bhdl\b/.test(t)) return "hdl";
  if (/\bldl\b/.test(t)) return "ldl";
  if (/cholesterol/.test(t)) return "cholesterol";
  return undefined;
}

function identifyAnalyte(test: Record<string, any>, specimen: string): Analyte | undefined {
  const loinc = str(test.loinc);
  const name = str(test.name) ?? "";
  const local = str(test.local_code) ?? "";
  if (loinc) return LOINC_ANALYTE[loinc]; // a LOINC we do not track is a test we do not report
  return analyteByName(name || local, specimen) ?? (name && !/urine/i.test(name) ? analyteByName(local, specimen) : undefined);
}

/** Convert a value in the lab's unit to the analyte's unit; undefined if the unit is not understood. */
function convert(analyte: Analyte, value: number, unitRaw: string | undefined): number | undefined {
  const u = (unitRaw ?? "").trim().replace(/\s+/g, "").replace(/µ|μ/g, "u");
  const lu = u.toLowerCase();
  switch (analyte) {
    case "ph":
      return u === "" || lu === "[ph]" || lu === "ph" ? value : undefined;
    case "creatinine":
      if (lu === "mg/dl") return value;
      if (lu === "umol/l") return value / 88.42;
      return undefined;
    case "egfr":
      return /^ml\/min\/(1\.73m2|\{1\.73_m2\}|1\.73m\^2|1\.73sqm)$/.test(lu) || lu === "ml/min" ? value : undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      return lu === "mmol/l" || lu === "meq/l" ? value : undefined;
    case "bun":
      if (lu === "mg/dl") return value;
      if (lu === "mmol/l") return value * 2.8;
      return undefined;
    case "glucose":
      if (lu === "mg/dl") return value;
      if (lu === "mmol/l") return value * 18.016;
      return undefined;
    case "a1c":
      if (lu === "%") return value;
      if (lu === "mmol/mol") return value * 0.0915 + 2.15;
      return undefined;
    case "uacr":
      if (lu === "mg/g" || lu === "mg/g{creat}" || lu === "ug/mg") return value;
      if (lu === "mg/mmol") return value * 8.84;
      return undefined;
    case "platelets": case "wbc":
      if (["10*3/ul", "10^3/ul", "k/ul", "x10e3/ul", "10*9/l", "10^9/l", "x10^9/l", "thou/ul", "k/mm3", "10*3/mm3"].includes(lu)) return value;
      if (lu === "/ul" || lu === "cells/ul" || lu === "/mm3") return value / 1000;
      return undefined;
    case "hemoglobin":
      if (lu === "g/dl") return value;
      if (lu === "g/l") return value / 10;
      return undefined;
    case "pco2":
      if (lu === "mmhg" || lu === "mm[hg]") return value;
      if (lu === "kpa") return value * 7.50062;
      return undefined;
    case "lipase":
      return lu === "u/l" || lu === "iu/l" ? value : undefined;
    case "troponin":
      if (lu === "ng/ml" || lu === "ug/l") return value;
      if (lu === "ng/l" || lu === "pg/ml") return value / 1000;
      return undefined;
    case "cholesterol": case "hdl": case "ldl":
      if (lu === "mg/dl") return value;
      if (lu === "mmol/l") return value * 38.67;
      return undefined;
    case "triglycerides":
      if (lu === "mg/dl") return value;
      if (lu === "mmol/l") return value * 88.57;
      return undefined;
  }
}

function parseValue(v: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  if (typeof v === "number" && isFinite(v)) return { value: v };
  if (typeof v !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(v);
  if (!m) return undefined;
  const c = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as "<" | ">" | "<=" | ">=" | undefined);
  return { value: parseFloat(m[2]), ...(c ? { comparator: c } : {}) };
}

const LAB_STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

interface LabCopy {
  key: string;
  specimenKey: string;
  rv: Record<string, any>;
  status: string;
  collected: string;
  specimen: string;
  item: FolioItem;
  recorded: number;
}

function egfrEquation(test: Record<string, any>, collected: string): "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | "unknown" {
  const text = ((str(test.name) ?? "") + " " + (str(test.local_code) ?? "")).toLowerCase();
  if (/mdrd/.test(text)) return "mdrd";
  if (/ckd.?epi/.test(text) && /2009/.test(text)) return "ckd-epi-2009";
  if (/2021|race.?free|race.?neutral/.test(text)) return "ckd-epi-2021";
  if (/2009/.test(text)) return "ckd-epi-2009";
  const loinc = str(test.loinc);
  if (loinc && EGFR_LOINC_EQ[loinc]) return EGFR_LOINC_EQ[loinc];
  // Riverside: eGFR is CKD-EPI 2021 (race-free) for all results since 2023.
  const d = localDate(collected);
  if (d && d >= "2023-01-01") return "ckd-epi-2021";
  return "unknown";
}

function raceVariant(test: Record<string, any>): "race" | "nonrace" | undefined {
  const loinc = str(test.loinc);
  const text = ((str(test.name) ?? "") + " " + (str(test.local_code) ?? "")).toLowerCase();
  if (/non.?(african|black|aa\b)|not (african|black)|other races?/.test(text) || (loinc && NONRACE_LOINC.has(loinc))) return "nonrace";
  if (/african|black|\baa\b/.test(text) || (loinc && RACE_LOINC.has(loinc))) return "race";
  return undefined;
}

function buildObservations(items: FolioItem[]): Observation[] {
  const copies: LabCopy[] = [];
  for (const it of items) {
    for (const [, e] of entries(it)) {
      try {
        const status = str(e.status);
        const collected = str(e.collected);
        const accession = str(e.accession) ?? "";
        if (!status || !(status in LAB_STATUS_RANK) || !collected || parseInstant(collected) === undefined && localDate(collected) === undefined) continue;
        const specimen = str(e.specimen) ?? "";
        const add = (rv: Record<string, any>, panelCode: string) => {
          if (!isObj(rv) || !isObj(rv.test)) return;
          const code = str(rv.test.local_code) ?? str(rv.test.loinc) ?? str(rv.test.name);
          if (!code) return;
          const acc = accession || "noacc:" + collected + ":" + panelCode;
          copies.push({
            key: acc + "|" + code, specimenKey: acc, rv, status, collected, specimen, item: it, recorded: timeKey(it.recorded),
          });
        };
        if (e.type === "result") add(e, "");
        else if (e.type === "panel" && Array.isArray(e.components)) {
          const pc = isObj(e.panel) ? str(e.panel.local_code) ?? "" : "";
          for (const c of e.components) add(c, pc);
        }
      } catch {
        // skip unreadable entry
      }
    }
  }
  // One result per accession + test: the copy with the most advanced status (then the latest copy).
  const best = new Map<string, LabCopy>();
  for (const c of copies) {
    const p = best.get(c.key);
    if (!p) { best.set(c.key, c); continue; }
    const d = LAB_STATUS_RANK[c.status] - LAB_STATUS_RANK[p.status];
    if (d > 0 || (d === 0 && (c.recorded > p.recorded || (c.recorded === p.recorded && c.item.id > p.item.id)))) best.set(c.key, c);
  }
  const chosen = [...best.values()];
  // eGFR race-specific variants: drop the race-coefficient one when a race-free variant exists for the specimen.
  const hasNonRace = new Set<string>();
  for (const c of chosen) if (raceVariant(c.rv.test) === "nonrace") hasNonRace.add(c.specimenKey);

  const used = new Set<string>();
  const out: Observation[] = [];
  chosen.sort((a, b) => timeKey(a.collected) - timeKey(b.collected) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  for (const c of chosen) {
    try {
      const test = c.rv.test as Record<string, any>;
      const analyte = identifyAnalyte(test, c.specimen.toLowerCase());
      if (!analyte) continue;
      if (analyte === "glucose" && /whole blood|capillary/i.test(c.specimen) && !str(test.loinc)) continue;
      if (analyte === "creatinine" && /urine/i.test(c.specimen)) continue;
      if (analyte === "egfr" && raceVariant(test) === "race" && hasNonRace.has(c.specimenKey)) continue;
      const pv = parseValue(c.rv.value);
      if (!pv) continue;
      const conv = convert(analyte, pv.value, str(c.rv.unit));
      if (conv === undefined || !isFinite(conv)) continue;
      const value = Math.round(conv * 1e4) / 1e4;
      const loinc = str(test.loinc);
      let method: Observation["method"];
      let loincCode = loinc ?? DEFAULT_LOINC[analyte];
      if (analyte === "egfr") {
        const eq = egfrEquation(test, c.collected);
        method = { text: eq };
        if (!loinc) loincCode = EGFR_EQ_LOINC[eq];
      }
      const unit = ANALYTE_UNIT[analyte];
      const ucum = analyte === "egfr" ? "mL/min/{1.73_m2}" : unit;
      const q: Quantity = { value, unit, system: UCUM, code: ucum };
      if (pv.comparator) q.comparator = pv.comparator;
      const coding = [{ system: LOINC, code: loincCode, ...(str(test.name) ? { display: str(test.name)! } : {}) }];
      const local = str(test.local_code);
      if (local) coding.push({ system: "urn:riverside-regional:lab-test-code", code: local, ...(str(test.name) ? { display: str(test.name)! } : {}) });
      const obs: Observation = {
        resourceType: "Observation",
        id: uniqueId("lab-" + c.key.replace("|", "-"), used),
        meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab"] },
        status: c.status === "preliminary" ? "preliminary" : "final",
        category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
        code: { coding, text: analyte },
        subject: { reference: "Patient/" + c.item.patient },
        effectiveDateTime: c.collected,
        valueQuantity: q,
      };
      if (method) obs.method = method;
      out.push(obs);
    } catch {
      // skip unreadable result
    }
  }
  return out;
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  let current: FolioItem[] = [];
  try {
    current = currentItems(items, asOf);
  } catch {
    current = [];
  }
  let medicationRequests: MedicationRequest[] = [];
  let observations: Observation[] = [];
  try {
    medicationRequests = buildMedications(current.map(toDoc));
  } catch {
    medicationRequests = [];
  }
  try {
    observations = buildObservations(current);
  } catch {
    observations = [];
  }
  return { medicationRequests, observations };
}
