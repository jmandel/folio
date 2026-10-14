// Riverside Regional Hospital signed clinical documents (riverside-doc-v1) -> US Core rows.
import type { FolioItem, UsCoreRows, MedicationRequest, Observation, Quantity } from "../in/views/uscore";

// ───────────────────────────── time helpers (America/Chicago, computed without ICU) ─────────────────────────────

function parseInstant(s: unknown): number | undefined {
  if (typeof s !== "string") return undefined;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) return undefined;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : undefined;
}

/** UTC instant (ms) of the n-th (1-based; n<0 = last) Sunday of a month, at `hourUtc`. */
function nthSunday(year: number, month0: number, n: number, hourUtc: number): number {
  if (n > 0) {
    const first = new Date(Date.UTC(year, month0, 1)).getUTCDay();
    const day = 1 + ((7 - first) % 7) + (n - 1) * 7;
    return Date.UTC(year, month0, day, hourUtc);
  }
  const lastDay = new Date(Date.UTC(year, month0 + 1, 0));
  const day = lastDay.getUTCDate() - lastDay.getUTCDay();
  return Date.UTC(year, month0, day, hourUtc);
}

/** Offset of America/Chicago from UTC in hours (-5 in daylight time, -6 otherwise). */
function chicagoOffsetHours(t: number): number {
  const year = new Date(t).getUTCFullYear();
  let start: number, end: number;
  // DST starts 02:00 CST (08:00Z) and ends 02:00 CDT (07:00Z).
  if (year >= 2007) {
    start = nthSunday(year, 2, 2, 8);
    end = nthSunday(year, 10, 1, 7);
  } else {
    start = nthSunday(year, 3, 1, 8);
    end = nthSunday(year, 9, -1, 7);
  }
  return t >= start && t < end ? -5 : -6;
}

function localDateTime(t: number): string {
  const d = new Date(t + chicagoOffsetHours(t) * 3600_000);
  return d.toISOString().slice(0, 16);
}

function localDate(t: number): string {
  return localDateTime(t).slice(0, 10);
}

// ───────────────────────────── item scope and corrections ─────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = (Array.isArray(items) ? items : []).filter((it) => {
    if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
    const t = parseInstant(it.recorded);
    return t !== undefined && localDate(t) <= asOf;
  });
  const replaced = new Set<string>();
  for (const it of inScope) {
    for (const list of [it.supersedes, it.retracts]) {
      if (!Array.isArray(list)) continue;
      for (const id of list) {
        if (typeof id !== "string") continue;
        // Only same-issuer corrections count.
        for (const target of inScope) if (target.id === id && target.issuer === it.issuer) replaced.add(id + "\u0000" + it.issuer);
      }
    }
  }
  return inScope.filter((it) => !replaced.has(it.id + "\u0000" + it.issuer));
}

function entries(it: FolioItem): [string, any][] {
  const p = it.payload;
  if (!p || typeof p !== "object") return [];
  return Object.entries(p).filter(([, e]) => e && typeof e === "object" && typeof e.type === "string");
}

function slug(s: string): string {
  return s.replace(/[^A-Za-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "");
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base.slice(0, 64);
  let n = 2;
  while (used.has(id)) {
    const suffix = "-" + n++;
    id = base.slice(0, 64 - suffix.length) + suffix;
  }
  used.add(id);
  return id;
}

// ───────────────────────────── medications ─────────────────────────────

const RXNORM_INGREDIENT_NAMES: Record<string, string> = {
  "6809": "metformin",
  "1488564": "dapagliflozin",
  "1545653": "empagliflozin",
  "1373458": "canagliflozin",
  "29046": "lisinopril",
  "5487": "hydrochlorothiazide",
  "4821": "glipizide",
  "25789": "glimepiride",
  "274783": "insulin glargine",
  "86009": "insulin lispro",
  "51428": "insulin aspart",
  "83367": "atorvastatin",
  "36567": "simvastatin",
  "301542": "rosuvastatin",
  "52175": "losartan",
  "17767": "amlodipine",
  "4603": "furosemide",
  "593411": "sitagliptin",
  "1991302": "semaglutide",
  "475968": "liraglutide",
  "1551291": "dulaglutide",
  "10582": "levothyroxine",
  "1364430": "apixaban",
  "11289": "warfarin",
  "32968": "clopidogrel",
  "6918": "metoprolol",
  "20352": "carvedilol",
  "9997": "spironolactone",
  "1191": "aspirin",
};

const BRAND_NAMES: Record<string, string> = {
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  steglatro: "ertugliflozin",
  glucophage: "metformin",
  glucotrol: "glipizide",
  amaryl: "glimepiride",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  semglee: "insulin glargine",
  humalog: "insulin lispro",
  admelog: "insulin lispro",
  novolog: "insulin aspart",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  lipitor: "atorvastatin",
  zocor: "simvastatin",
  crestor: "rosuvastatin",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  cozaar: "losartan",
  norvasc: "amlodipine",
  lasix: "furosemide",
  januvia: "sitagliptin",
  ozempic: "semaglutide",
  rybelsus: "semaglutide",
  wegovy: "semaglutide",
  victoza: "liraglutide",
  trulicity: "dulaglutide",
  mounjaro: "tirzepatide",
  synthroid: "levothyroxine",
  eliquis: "apixaban",
  xarelto: "rivaroxaban",
  coumadin: "warfarin",
  plavix: "clopidogrel",
  lopressor: "metoprolol",
  toprol: "metoprolol",
  coreg: "carvedilol",
  aldactone: "spironolactone",
  kerendia: "finerenone",
};

const SALT_WORDS = new Set([
  "potassium", "sodium", "calcium", "magnesium", "hydrochloride", "hcl", "besylate", "maleate", "succinate",
  "tartrate", "mesylate", "citrate", "fumarate", "acetate", "sulfate", "phosphate", "bromide", "dihydrate",
  "monohydrate", "trihydrate", "propanediol", "er", "xr", "sr", "dr", "la", "xl",
]);

const FORM_WORDS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "pen", "injection", "solution",
  "suspension", "oral", "po", "vial", "patch", "cream", "ointment", "inhaler", "spray", "syrup", "chewable",
  "extended", "release", "delayed", "film", "coated", "subq", "subcutaneous", "prefilled", "syringe", "kwikpen",
  "flexpen", "solostar", "u-100",
]);

function ingredientName(drugName: string, rx: string | undefined): string | undefined {
  if (rx && RXNORM_INGREDIENT_NAMES[rx]) return RXNORM_INGREDIENT_NAMES[rx];
  const lower = drugName.toLowerCase().trim();
  if (!lower) return undefined;
  // Combination products ("losartan-hydrochlorothiazide", "x / y") have no single ingredient.
  if (/\s\/\s|\band\b|\+/.test(lower)) return undefined;
  const words: string[] = [];
  for (const w of lower.split(/[\s,()]+/)) {
    if (!w) continue;
    if (/^\d/.test(w) || /^[\d.]+(mg|mcg|ml|%|units?)$/.test(w)) break;
    if (FORM_WORDS.has(w)) break;
    words.push(w);
  }
  if (words.length === 0) return undefined;
  for (const w of words) if (BRAND_NAMES[w]) return BRAND_NAMES[w];
  // Strip trailing salt/release words, but never the first word ("potassium chloride").
  while (words.length > 1 && SALT_WORDS.has(words[words.length - 1])) words.pop();
  const joined = words.join(" ");
  // Descriptions that do not say which drug it is.
  if (/^(water pill|blood pressure pill|diabetes pill|unknown|pill|medication)$/.test(joined)) return undefined;
  return joined;
}

type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";
const UCUM_DOSE: Record<DoseUnit, string> = { mg: "mg", mcg: "ug", units: "[iU]", mL: "mL", tablet: "{tbl}" };

function parseDose(text: unknown): { value: number; unit: DoseUnit } | undefined {
  if (typeof text !== "string") return undefined;
  const m = /^\s*(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?|\.\d+)\s*([A-Za-zµ\[\]]+)\.?\s*$/.exec(text);
  if (!m) return undefined;
  const value = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(value) || value <= 0) return undefined;
  const u = m[2].toLowerCase();
  let unit: DoseUnit | undefined;
  if (u === "mg") unit = "mg";
  else if (u === "mcg" || u === "ug" || u === "µg") unit = "mcg";
  else if (["unit", "units", "u", "iu", "unt", "[iu]"].includes(u)) unit = "units";
  else if (u === "ml") unit = "mL";
  else if (["tab", "tabs", "tablet", "tablets"].includes(u)) unit = "tablet";
  return unit ? { value, unit } : undefined;
}

type Freq = "QD" | "BID" | "TID" | "QHS" | "QW" | "PRN" | "other";

function parseFrequency(sig: unknown): Freq | undefined {
  if (typeof sig !== "string") return undefined;
  const s = " " + sig.toLowerCase().replace(/[.,;]/g, " ") + " ";
  if (/\bprn\b|as needed|as-needed/.test(s)) return "PRN";
  if (/\bqid\b|four times|\bq\s?[46]\s?h|every [46] hours|every other day|\bqod\b|monthly|every \d+ (weeks|days|months)|twice (a )?week|\bbiw\b|three times (a )?week|\btiw\b/.test(s)) return "other";
  if (/\btid\b|three times (a )?day|three times daily|\bq\s?8\s?h|every 8 hours/.test(s)) return "TID";
  if (/\bbid\b|twice (a )?day|twice daily|\bq\s?12\s?h|every 12 hours/.test(s)) return "BID";
  if (/\bqhs\b|\bhs\b|nightly|at bedtime|at night|every night|each night|\bqpm\b|every evening|in the evening/.test(s)) return "QHS";
  if (/weekly|once (a|per|every) week|\bqw(ee)?k?\b|every week/.test(s)) return "QW";
  if (/\bdaily\b|once (a )?day|\bqd\b|\bqday\b|every day|every morning|\bqam\b|each morning|in the morning|\bq\s?24\s?h|every 24 hours/.test(s)) return "QD";
  return undefined;
}

function stopReason(text: string | undefined): MedStopReason | undefined {
  if (!text) return undefined;
  const s = text.toLowerCase();
  // "risk of", "contraindicated": a precaution, not a reaction the patient had.
  if (!/\brisk|contraindicat|prevent|precaution/.test(s) && /adverse|side effect|reaction|allerg|intoleran|ketoacidosis|\bdka\b|lactic acidosis|angioedema|hypoglyc/.test(s)) return "adverse_reaction";
  if (/ineffective|not effective|not working|inadequate|insufficient/.test(s)) return "ineffective";
  if (/switch|replaced|changed to|instead|in place of/.test(s)) return "therapy_changed";
  if (/course complete|completed course|course finished|finished course/.test(s)) return "course_complete";
  if (/patient (declined|refused|prefers|preferred|request|chose|wishes)/.test(s)) return "patient_choice";
  return undefined;
}
type MedStopReason = "adverse_reaction" | "ineffective" | "therapy_changed" | "course_complete" | "patient_choice" | "other";

type RowStatus = "active" | "held" | "stopped" | "unknown";
const HOME_STATUS: Record<string, RowStatus> = {
  not_reconciled: "unknown",
  continue: "active",
  new: "active",
  changed: "active",
  held: "held",
  stopped: "stopped",
};
const STATUS_RANK: Record<RowStatus, number> = { active: 3, held: 2, unknown: 1, stopped: 0 };

interface Doc {
  item: FolioItem;
  encounterKey: string;
  kind: string;
  /** When this document's decisions take effect: discharge time for a discharge summary, else `effective`. */
  time: number;
  start: number;
  recorded: number;
  meds: { entryId: string; e: any }[];
}

function lineKey(e: any): string {
  const rx = typeof e.rxnorm_ingredient === "string" && e.rxnorm_ingredient ? "rx:" + e.rxnorm_ingredient : "name:" + String(e.drug_name ?? "").toLowerCase().trim();
  return rx + "|" + String(e.dose_text ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function mapMedications(items: FolioItem[]): MedicationRequest[] {
  const docs: Doc[] = [];
  for (const it of items) {
    try {
      let enc: any;
      const meds: { entryId: string; e: any }[] = [];
      for (const [id, e] of entries(it)) {
        if (e.type === "encounter" && !enc) enc = e;
        else if (e.type === "home_med" && typeof e.drug_name === "string" && typeof e.status === "string" && HOME_STATUS[e.status]) meds.push({ entryId: id, e });
      }
      const effective = parseInstant(it.effective);
      const recorded = parseInstant(it.recorded) ?? 0;
      const kind = enc && typeof enc.document_kind === "string" ? enc.document_kind : "";
      let time = effective ?? recorded;
      if (kind === "discharge_summary") time = parseInstant(enc.discharged) ?? parseInstant(it.effective_end) ?? recorded;
      const starts = [parseInstant(enc?.arrived), parseInstant(enc?.admitted), effective].filter((x): x is number => x !== undefined);
      docs.push({
        item: it,
        encounterKey: enc && typeof enc.encounter_id === "string" ? "enc:" + enc.encounter_id : "item:" + it.id,
        kind,
        time,
        start: starts.length ? Math.min(...starts) : time,
        recorded,
        meds,
      });
    } catch {
      // unreadable item: skip
    }
  }
  // Only documents that carry a home medication list are snapshots. A document listing nothing is not
  // read as "no medications" unless it is a discharge summary (whose list is the discharge instructions).
  const snapshotDocs = docs.filter((d) => d.meds.length > 0 || d.kind === "discharge_summary");
  if (snapshotDocs.length === 0) return [];

  const byEnc = new Map<string, Doc[]>();
  for (const d of snapshotDocs) {
    const list = byEnc.get(d.encounterKey) ?? [];
    list.push(d);
    byEnc.set(d.encounterKey, list);
  }
  const order = (a: Doc, b: Doc) => a.time - b.time || a.recorded - b.recorded || (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0);
  let latestEnc: Doc[] | undefined;
  let latestStart = -Infinity;
  let latestRec = -Infinity;
  for (const list of byEnc.values()) {
    list.sort(order);
    const start = Math.min(...list.map((d) => d.start));
    const rec = Math.max(...list.map((d) => d.recorded));
    if (start > latestStart || (start === latestStart && rec > latestRec)) {
      latestEnc = list;
      latestStart = start;
      latestRec = rec;
    }
  }
  if (!latestEnc) return [];
  // The latest discharge summary of the encounter is the final word; otherwise the latest document.
  const dsDocs = latestEnc.filter((d) => d.kind === "discharge_summary");
  const snapshot = dsDocs.length ? dsDocs[dsDocs.length - 1] : latestEnc[latestEnc.length - 1];
  // Earlier documents of the same encounter, for when the current status began.
  const history = latestEnc.filter((d) => d !== snapshot && order(d, snapshot) < 0);
  history.push(snapshot);

  // One line per ingredient: prefer the line that is being taken.
  const chosen = new Map<string, { entryId: string; e: any; status: RowStatus; ingredient?: string }>();
  for (const m of snapshot.meds) {
    const status = HOME_STATUS[m.e.status];
    const rx = typeof m.e.rxnorm_ingredient === "string" && m.e.rxnorm_ingredient.trim() ? m.e.rxnorm_ingredient.trim() : undefined;
    const ingredient = ingredientName(m.e.drug_name, rx);
    const key = rx ? "rx:" + rx : ingredient ? "ing:" + ingredient : "name:" + m.e.drug_name.toLowerCase().trim();
    const prev = chosen.get(key);
    if (!prev || STATUS_RANK[status] > STATUS_RANK[prev.status]) chosen.set(key, { ...m, status, ingredient });
  }

  const patient = snapshot.item.patient;
  const used = new Set<string>();
  const out: MedicationRequest[] = [];
  for (const [key, m] of chosen) {
    try {
      const e = m.e;
      const lk = lineKey(e);
      // Walk back through the encounter for the run of documents with the same status class.
      const statusesBack: { doc: Doc; raw: string; entryId: string; e: any }[] = [];
      for (let i = history.length - 1; i >= 0; i--) {
        const d = history[i];
        const line = d.meds.find((x) => lineKey(x.e) === lk);
        if (!line) break;
        statusesBack.push({ doc: d, raw: line.e.status, entryId: line.entryId, e: line.e });
      }
      let runEnd = 0;
      while (runEnd + 1 < statusesBack.length && HOME_STATUS[statusesBack[runEnd + 1].raw] === m.status) runEnd++;
      const run = statusesBack.slice(0, runEnd + 1).reverse(); // oldest first
      const predecessor = statusesBack[runEnd + 1];
      let since: string | undefined;
      if (m.status === "held" || m.status === "stopped") {
        since = localDate(run[0].doc.time);
      } else if (m.status === "active") {
        if (predecessor && (HOME_STATUS[predecessor.raw] === "held" || HOME_STATUS[predecessor.raw] === "stopped")) {
          since = localDate(run[0].doc.time);
        } else {
          const firstNew = run.find((r) => r.raw === "new" || r.raw === "changed");
          if (firstNew) since = localDate(firstNew.doc.time);
        }
      }
      const statusMap = { active: "active", held: "on-hold", stopped: "stopped", unknown: "unknown" } as const;
      const reported = e.status === "not_reconciled";
      const rx = typeof e.rxnorm_ingredient === "string" && e.rxnorm_ingredient.trim() ? e.rxnorm_ingredient.trim() : undefined;
      const req: MedicationRequest = {
        resourceType: "MedicationRequest",
        id: uniqueId("med-" + slug(rx ? "rxnorm-" + rx : m.ingredient ?? key), used),
        meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
        status: statusMap[m.status],
        intent: reported ? "plan" : "order",
        reportedBoolean: reported,
        medicationCodeableConcept: rx
          ? {
              coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: rx, ...(m.ingredient ? { display: m.ingredient } : {}) }],
              text: e.drug_name,
            }
          : { text: m.ingredient ? `${e.drug_name} (${m.ingredient})` : e.drug_name },
        subject: { reference: "Patient/" + patient },
      };
      if (m.status === "held" || m.status === "stopped") {
        // A later note often restates a hold without its reason: take the newest reason given in this run of
        // the same status, without carrying an in-stay reason over to discharge instructions.
        const isDs = snapshot.kind === "discharge_summary";
        const withText = run
          .slice()
          .reverse()
          .find((r) => (r.doc.kind === "discharge_summary") === isDs && typeof r.e.instructions === "string" && r.e.instructions.trim());
        const reasonText: string | undefined = withText ? String(withText.e.instructions).trim() : undefined;
        const code = m.status === "stopped" ? stopReason(reasonText) : undefined;
        if (reasonText || code) {
          req.statusReason = [
            {
              ...(code ? { coding: [{ system: "urn:folio:stop-reason", code }] } : {}),
              ...(reasonText ? { text: reasonText } : {}),
            },
          ];
        }
      }
      if (m.status === "active" && since) req.authoredOn = since;
      else {
        const firstNew = statusesBack.slice().reverse().find((r) => r.raw === "new");
        if (firstNew) req.authoredOn = localDate(firstNew.doc.time);
      }
      const dose = parseDose(e.dose_text);
      const freq = parseFrequency(e.sig);
      const sig = typeof e.sig === "string" && e.sig.trim() ? e.sig : undefined;
      if (dose || freq || sig) {
        const q: Quantity | undefined = dose
          ? { value: dose.value, unit: dose.unit, system: "http://unitsofmeasure.org", code: UCUM_DOSE[dose.unit] }
          : undefined;
        req.dosageInstruction = [
          {
            ...(sig ? { text: sig } : {}),
            ...(freq ? { timing: { code: { text: freq } } } : {}),
            ...(q ? { doseAndRate: [{ doseQuantity: q }] } : {}),
          },
        ];
      }
      out.push(req);
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

const ANALYTE_UCUM: Partial<Record<Analyte, string>> = { egfr: "mL/min/{1.73_m2}", uacr: "mg/g" };

const DEFAULT_LOINC: Record<Analyte, string> = {
  creatinine: "2160-0", egfr: "98979-8", potassium: "2823-3", sodium: "2951-2", chloride: "2075-0",
  bicarbonate: "2028-9", anion_gap: "33037-3", bun: "3094-0", glucose: "2345-7", a1c: "4548-4", uacr: "9318-7",
  platelets: "777-3", wbc: "6690-2", hemoglobin: "718-7", bhb: "53060-9", ph: "2746-6", pco2: "2021-4",
  lipase: "3040-3", troponin: "10839-9", cholesterol: "2093-3", triglycerides: "2571-8", hdl: "2085-9", ldl: "13457-7",
};

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr", "33914-3": "egfr",
  "48642-3": "egfr", "48643-1": "egfr", "77147-7": "egfr", "50044-7": "egfr", "50210-4": "egfr",
  "2823-3": "potassium", "6298-4": "potassium",
  "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose",
  "4548-4": "a1c", "17856-6": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets",
  "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin", "20509-6": "hemoglobin",
  "53060-9": "bhb",
  "2746-6": "ph", "2744-1": "ph", "11558-4": "ph",
  "2021-4": "pco2", "2019-8": "pco2", "11557-6": "pco2",
  "3040-3": "lipase",
  "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol",
  "2571-8": "triglycerides",
  "2085-9": "hdl",
  "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

const LOCAL_ANALYTE: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", EGFR: "egfr", K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", HCO3: "bicarbonate", TCO2: "bicarbonate", AGAP: "anion_gap", AG: "anion_gap", BUN: "bun",
  GLU: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin",
  HB: "hemoglobin", BHB: "bhb", VPH: "ph", APH: "ph", PH: "ph", VPCO2: "pco2", APCO2: "pco2", PCO2: "pco2",
  LIPASE: "lipase", TROPI: "troponin", TNI: "troponin", CTNI: "troponin", TROP: "troponin", CHOL: "cholesterol",
  TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl",
};

function analyteByName(name: string): Analyte | undefined {
  const n = name.toLowerCase();
  if (/troponin\s*t|tnt\b/.test(n)) return undefined;
  if (/egfr|glomerular filtration/.test(n)) return "egfr";
  if (/albumin.*creatinine|\buacr\b|\bacr\b/.test(n)) return "uacr";
  if (/creatinine/.test(n)) return "creatinine";
  if (/potassium/.test(n)) return "potassium";
  if (/sodium/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/bicarbonate|total co2|carbon dioxide/.test(n)) return "bicarbonate";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/a1c|glycated h|glycosylated h/.test(n)) return "a1c";
  if (/glucose/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/white blood|\bwbc\b|leukocyte/.test(n)) return "wbc";
  if (/hemoglobin|haemoglobin|\bhgb\b/.test(n)) return "hemoglobin";
  if (/hydroxybutyrate|\bbhb\b/.test(n)) return "bhb";
  if (/^ph\b|\bph,|\bph\b/.test(n)) return "ph";
  if (/pco2/.test(n)) return "pco2";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n)) return "troponin";
  if (/\bhdl\b/.test(n)) return "hdl";
  if (/\bldl\b/.test(n)) return "ldl";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n)) return "cholesterol";
  return undefined;
}

function identifyAnalyte(test: any, specimen: string): Analyte | undefined {
  const loinc = typeof test.loinc === "string" ? test.loinc.trim() : "";
  const local = typeof test.local_code === "string" ? test.local_code.trim().toUpperCase() : "";
  const name = typeof test.name === "string" ? test.name : "";
  let a: Analyte | undefined = loinc ? LOINC_ANALYTE[loinc] : undefined;
  if (!a && local) a = LOCAL_ANALYTE[local];
  if (!a && !loinc && name) a = analyteByName(name);
  if (!a) return undefined;
  const spec = specimen.toLowerCase();
  const text = (name + " " + local).toLowerCase();
  if (a === "uacr") return a;
  if (/urine|csf|fluid|stool/.test(spec) || /\burine\b|urinary|\bur\b/.test(text)) return undefined;
  if (a === "glucose" && (/capillary|fingerstick|finger stick|meter/.test(spec) || /point[- ]of[- ]care|\bpoc|meter|fingerstick|capillary/.test(text))) return undefined;
  if (a === "troponin" && /troponin\s*t\b/.test(text)) return undefined;
  return a;
}

/** Converts a value from the lab's unit to the analyte's unit; undefined if the unit is not recognised. */
function convertUnit(a: Analyte, unit: unknown, v: number): number | undefined {
  const u = typeof unit === "string" ? unit.trim().toLowerCase().replace(/\s+/g, "").replace(/µ|μ/g, "u").replace(/\^/g, "*") : "";
  const round = (x: number) => Number(x.toPrecision(12));
  switch (a) {
    case "ph":
      return u === "" || u === "[ph]" || u === "ph" || u === "{ph}" ? v : undefined;
    case "creatinine": case "bun": case "glucose": case "cholesterol": case "triglycerides": case "hdl": case "ldl":
      return u === "mg/dl" ? v : undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      return u === "mmol/l" || u === "meq/l" ? v : undefined;
    case "bhb":
      return u === "mmol/l" ? v : undefined;
    case "egfr":
      return /^ml\/min\/(\{)?1\.73(_)?m(2|\*2|\^2)(\})?$/.test(u) || u === "ml/min/1.73m2" ? v : undefined;
    case "a1c":
      return u === "%" || u === "%{hb}" || u === "%hba1c" ? v : undefined;
    case "uacr":
      return u === "mg/g" || u === "mg/g{creat}" || u === "mg/gcreat" || u === "ug/mg" || u === "ug/mg{creat}" ? v : undefined;
    case "platelets": case "wbc":
      if (["10*3/ul", "k/ul", "x10*3/ul", "x10e3/ul", "10e3/ul", "thou/ul", "10*9/l", "x10*9/l", "10e9/l", "x10e9/l", "k/mm3", "10*3/mm3"].includes(u)) return v;
      if (u === "/ul" || u === "cells/ul" || u === "/mm3") return round(v / 1000);
      return undefined;
    case "hemoglobin":
      if (u === "g/dl") return v;
      if (u === "g/l") return round(v / 10);
      return undefined;
    case "pco2":
      return u === "mmhg" || u === "mm[hg]" ? v : undefined;
    case "lipase":
      return u === "u/l" || u === "iu/l" ? v : undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return round(v / 1000);
      return undefined;
  }
  return undefined;
}

function parseLabValue(raw: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  if (typeof raw !== "string" && typeof raw !== "number") return undefined;
  const s = String(raw).trim().replace(/≤/g, "<=").replace(/≥/g, ">=");
  const m = /^(<=|>=|<|>)?\s*(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?|\.\d+)$/.exec(s);
  if (!m) return undefined;
  const value = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(value)) return undefined;
  return m[1] ? { value, comparator: m[1] as "<" | ">" | "<=" | ">=" } : { value };
}

type Equation = "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | "unknown";

function egfrEquation(test: any, collected: number): Equation | "race-specific" {
  const name = typeof test.name === "string" ? test.name.toLowerCase() : "";
  const loinc = typeof test.loinc === "string" ? test.loinc : "";
  if (/african|black|non-?afr|non-?black/.test(name)) {
    if (/non-?afr|non-?black|not black|other than black/.test(name)) {
      // the variant without a race coefficient
    } else return "race-specific";
  }
  if (loinc === "48643-1" || loinc === "88293-6") return "race-specific";
  if (/ckd-?epi/.test(name) && /2021|race[- ]free|race[- ]neutral/.test(name)) return "ckd-epi-2021";
  if (/ckd-?epi/.test(name) && /2009/.test(name)) return "ckd-epi-2009";
  if (/mdrd/.test(name)) return "mdrd";
  // Riverside: eGFR is CKD-EPI 2021 (race-free) for all results since 2023.
  if (collected >= Date.UTC(2023, 0, 1, 6)) return "ckd-epi-2021";
  if (loinc === "98979-8") return "ckd-epi-2021";
  if (loinc === "62238-1" || loinc === "88294-4" || loinc === "50044-7") return "ckd-epi-2009";
  if (loinc === "33914-3" || loinc === "48642-3" || loinc === "77147-7") return "mdrd";
  return "unknown";
}

const STATUS_ORDER: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

interface LabCopy {
  item: FolioItem;
  accession: string;
  entryId: string;
  test: any;
  value: any;
  unit: any;
  collected: string;
  specimen: string;
  status: string;
  recorded: number;
}

function mapLabs(items: FolioItem[]): Observation[] {
  const copies = new Map<string, LabCopy[]>();
  const add = (c: LabCopy) => {
    const key = c.accession + "\u0000" + String(c.test.local_code ?? c.test.loinc ?? c.test.name ?? "");
    const list = copies.get(key) ?? [];
    list.push(c);
    copies.set(key, list);
  };
  for (const it of items) {
    const recorded = parseInstant(it.recorded) ?? 0;
    for (const [id, e] of entries(it)) {
      try {
        if (typeof e.accession !== "string" || typeof e.collected !== "string" || !STATUS_ORDER[e.status]) continue;
        const specimen = typeof e.specimen === "string" ? e.specimen : "";
        if (e.type === "result") {
          if (!e.test || typeof e.test !== "object") continue;
          add({ item: it, accession: e.accession, entryId: id, test: e.test, value: e.value, unit: e.unit, collected: e.collected, specimen, status: e.status, recorded });
        } else if (e.type === "panel" && Array.isArray(e.components)) {
          for (const c of e.components) {
            if (!c || typeof c !== "object" || !c.test || typeof c.test !== "object") continue;
            add({ item: it, accession: e.accession, entryId: id, test: c.test, value: c.value, unit: c.unit, collected: e.collected, specimen, status: e.status, recorded });
          }
        }
      } catch {
        // skip
      }
    }
  }

  const issuerSystem = (issuer: string) => {
    const host = issuer.replace(/^did:web:/, "").replace(/[^A-Za-z0-9.-]+/g, "-");
    return `urn:${host || "riverside-regional"}:lab-test-code`;
  };

  const used = new Set<string>();
  const out: { obs: Observation; sort: string }[] = [];
  for (const [, list] of copies) {
    try {
      // Most advanced status wins; among equals, the latest-recorded copy.
      list.sort((a, b) => STATUS_ORDER[b.status] - STATUS_ORDER[a.status] || b.recorded - a.recorded);
      const best = list[0];
      const collectedT = parseInstant(best.collected);
      if (collectedT === undefined) continue;
      const analyte = identifyAnalyte(best.test, best.specimen);
      if (!analyte) continue;
      const parsed = parseLabValue(best.value);
      if (!parsed) continue;
      const value = convertUnit(analyte, best.unit, parsed.value);
      if (value === undefined) continue;
      let method: Equation | undefined;
      if (analyte === "egfr") {
        const eq = egfrEquation(best.test, collectedT);
        if (eq === "race-specific") continue;
        method = eq;
      }
      const srcLoinc = typeof best.test.loinc === "string" && best.test.loinc.trim() ? best.test.loinc.trim() : undefined;
      let loinc = srcLoinc ?? DEFAULT_LOINC[analyte];
      if (!srcLoinc && analyte === "egfr") loinc = method === "mdrd" ? "33914-3" : method === "ckd-epi-2009" ? "62238-1" : "98979-8";
      if (!srcLoinc && analyte === "ph" && /arterial/.test(best.specimen.toLowerCase())) loinc = "2744-1";
      if (!srcLoinc && analyte === "pco2" && /arterial/.test(best.specimen.toLowerCase())) loinc = "2019-8";
      const coding: { system: string; code: string; display?: string }[] = [
        { system: "http://loinc.org", code: loinc, ...(srcLoinc && typeof best.test.name === "string" ? { display: best.test.name } : {}) },
      ];
      const local = typeof best.test.local_code === "string" && best.test.local_code ? best.test.local_code : undefined;
      if (local) coding.push({ system: issuerSystem(best.item.issuer ?? ""), code: local, ...(typeof best.test.name === "string" ? { display: best.test.name } : {}) });
      const unit = ANALYTE_UNIT[analyte];
      const obs: Observation = {
        resourceType: "Observation",
        id: uniqueId("lab-" + slug(best.accession + "-" + (local ?? loinc)), used),
        meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab"] },
        status: best.status === "preliminary" ? "preliminary" : "final",
        category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
        code: { coding, text: analyte },
        subject: { reference: "Patient/" + best.item.patient },
        effectiveDateTime: best.collected,
        valueQuantity: {
          value,
          ...(parsed.comparator ? { comparator: parsed.comparator } : {}),
          unit,
          system: "http://unitsofmeasure.org",
          code: ANALYTE_UCUM[analyte] ?? unit,
        },
      };
      if (method) obs.method = { text: method };
      out.push({ obs, sort: new Date(collectedT).toISOString() + obs.id });
    } catch {
      // skip
    }
  }
  out.sort((a, b) => (a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0));
  return out.map((o) => o.obs);
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  try {
    const current = currentItems(items, typeof asOf === "string" ? asOf : "");
    let medicationRequests: MedicationRequest[] = [];
    let observations: Observation[] = [];
    try {
      medicationRequests = mapMedications(current);
    } catch {
      medicationRequests = [];
    }
    try {
      observations = mapLabs(current);
    } catch {
      observations = [];
    }
    return { medicationRequests, observations };
  } catch {
    return { medicationRequests: [], observations: [] };
  }
}
