// Lakeview Labs & Kidney Care (lakeview-v1) -> US Core MedicationRequest / Observation.
import type { FolioItem, UsCoreRows, MedicationRequest, Observation, Coding, Quantity } from "../in/views/uscore";

// ───────────────────────────── helpers ─────────────────────────────

const TZ = "America/Chicago";
let dateFmt: Intl.DateTimeFormat | null = null;

function isObj(v: unknown): v is Record<string, any> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}
function instant(s: unknown): number | undefined {
  if (typeof s !== "string") return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : undefined;
}

/** Local (America/Chicago) calendar date of an RFC 3339 timestamp, or the date itself for a date-only string. */
function localDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const t = instant(s);
  if (t === undefined) return undefined;
  try {
    if (!dateFmt) dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
    const parts = dateFmt.formatToParts(new Date(t));
    const get = (k: string) => parts.find((p) => p.type === k)?.value;
    const y = get("year"), m = get("month"), d = get("day");
    if (y && m && d) return `${y}-${m}-${d}`;
  } catch {
    /* fall through */
  }
  // Fallback: Lakeview timestamps already carry the Chicago offset.
  const m = /^(\d{4}-\d{2}-\d{2})T/.exec(s);
  return m ? m[1] : undefined;
}

function safeId(s: string): string {
  return s.replace(/[^A-Za-z0-9.-]/g, "-").slice(0, 64);
}

// ───────────────────────────── scope & corrections ─────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = (Array.isArray(items) ? items : []).filter((it) => {
    if (!isObj(it) || typeof it.id !== "string" || !isObj(it.payload)) return false;
    const d = localDate(it.recorded);
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const k of ["supersedes", "retracts"] as const) {
      const list = (it as any)[k];
      if (Array.isArray(list)) for (const id of list) if (typeof id === "string") dead.add(`${it.issuer}\u0000${id}`);
    }
  }
  return inScope.filter((it) => !dead.has(`${it.issuer}\u0000${it.id}`));
}

function entries(it: FolioItem, type: string): [string, Record<string, any>][] {
  const out: [string, Record<string, any>][] = [];
  for (const [k, v] of Object.entries(it.payload)) if (isObj(v) && v.type === type) out.push([k, v]);
  return out;
}

// ───────────────────────────── labs ─────────────────────────────

interface AnalyteDef {
  analyte: string;
  lvUnit: string;
  unit: string; // analyte table unit
  ucum: string; // Quantity.code
  loinc: string; // fallback LOINC
}

const ANALYTES: Record<string, AnalyteDef> = {
  "LK-CREAT": { analyte: "creatinine", lvUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "2160-0" },
  "LK-EGFR09N": { analyte: "egfr", lvUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2", ucum: "mL/min/{1.73_m2}", loinc: "48642-3" },
  "LK-EGFR21": { analyte: "egfr", lvUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2", ucum: "mL/min/{1.73_m2}", loinc: "98979-8" },
  "LK-NA": { analyte: "sodium", lvUnit: "mmol/L", unit: "mmol/L", ucum: "mmol/L", loinc: "2951-2" },
  "LK-K": { analyte: "potassium", lvUnit: "mmol/L", unit: "mmol/L", ucum: "mmol/L", loinc: "2823-3" },
  "LK-GLU": { analyte: "glucose", lvUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "2345-7" },
  "LK-A1C": { analyte: "a1c", lvUnit: "%", unit: "%", ucum: "%", loinc: "4548-4" },
  "LK-UACR": { analyte: "uacr", lvUnit: "mg/g", unit: "mg/g", ucum: "mg/g", loinc: "9318-7" },
  "LK-WBC": { analyte: "wbc", lvUnit: "K/uL", unit: "10*3/uL", ucum: "10*3/uL", loinc: "6690-2" },
  "LK-HGB": { analyte: "hemoglobin", lvUnit: "g/dL", unit: "g/dL", ucum: "g/dL", loinc: "718-7" },
  "LK-PLT": { analyte: "platelets", lvUnit: "K/uL", unit: "10*3/uL", ucum: "10*3/uL", loinc: "777-3" },
  "LK-CHOL": { analyte: "cholesterol", lvUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "2093-3" },
  "LK-TRIG": { analyte: "triglycerides", lvUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "2571-8" },
  "LK-HDL": { analyte: "hdl", lvUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "2085-9" },
  "LK-LDLC": { analyte: "ldl", lvUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "13457-7" },
  // LK-EGFR09A (race-coefficient variant) is deliberately absent: the eGFR rule keeps only the race-free variant.
};

type Equation = "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | "unknown";

function egfrEquation(code: string, comment: string | undefined): Equation {
  const c = (comment ?? "").toLowerCase();
  if (/mdrd/.test(c)) return "mdrd";
  if (/ckd[- ]?epi/.test(c)) {
    if (/2021|race[- ]free/.test(c)) return "ckd-epi-2021";
    if (/2009/.test(c)) return "ckd-epi-2009";
  }
  if (code === "LK-EGFR21") return "ckd-epi-2021";
  if (code === "LK-EGFR09N") return "ckd-epi-2009";
  return "unknown";
}

function parseValue(text: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  if (typeof text !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(text);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return undefined;
  return m[1] ? { value, comparator: m[1] as "<" | ">" | "<=" | ">=" } : { value };
}

const RESULT_RANK: Record<string, number> = { P: 1, F: 2, A: 3 };

interface ResultCopy {
  item: FolioItem;
  row: Record<string, any>;
  collected: string;
  orderVoid: boolean;
}

function mapLabs(items: FolioItem[]): Observation[] {
  const byId = new Map<string, ResultCopy[]>();
  for (const it of items) {
    const reqs = entries(it, "LAB_REQ");
    const results = entries(it, "LAB_RESULT");
    if (results.length === 0) continue;
    const collected = str(reqs[0]?.[1]?.COLLECTED_AT) ?? str(it.effective);
    if (!collected || instant(collected) === undefined) continue;
    const orders = new Map<string, Record<string, any>>();
    for (const [, o] of entries(it, "LAB_ORDER")) if (typeof o.ORDER_ID === "string") orders.set(o.ORDER_ID, o);
    for (const [, r] of results) {
      if (typeof r.RESULT_ID !== "string") continue;
      const ord = typeof r.ORDER_ID === "string" ? orders.get(r.ORDER_ID) : undefined;
      // 9 = entered in error (void); 5 = cancelled before testing (should have no results).
      const orderVoid = ord !== undefined && (ord.ORDER_STATUS === 9 || ord.ORDER_STATUS === 5);
      const list = byId.get(r.RESULT_ID) ?? [];
      list.push({ item: it, row: r, collected, orderVoid });
      byId.set(r.RESULT_ID, list);
    }
  }

  const out: { obs: Observation; sortKey: string }[] = [];
  for (const [rid, copies] of byId) {
    // Any copy withdrawn, not performed, or under a voided order: the value does not stand.
    if (copies.some((c) => c.orderVoid || !(c.row.RESULT_STATUS in RESULT_RANK))) continue;
    copies.sort(
      (a, b) =>
        RESULT_RANK[b.row.RESULT_STATUS] - RESULT_RANK[a.row.RESULT_STATUS] ||
        (instant(b.item.recorded) ?? 0) - (instant(a.item.recorded) ?? 0),
    );
    const { item, row, collected } = copies[0];
    const code = String(row.TEST_CODE ?? "");
    const def = ANALYTES[code];
    if (!def) continue;
    if (row.UNIT_CODE !== def.lvUnit) continue;
    const v = parseValue(row.VALUE_TEXT);
    if (!v) continue;

    const loinc = str(row.LOINC) ?? def.loinc;
    const coding: Coding[] = [{ system: "http://loinc.org", code: loinc }];
    const local: Coding = { system: `urn:${item.issuer}:test-code`, code };
    if (str(row.TEST_NAME)) local.display = row.TEST_NAME;
    coding.push(local);

    const q: Quantity = { value: v.value, unit: def.unit, system: "http://unitsofmeasure.org", code: def.ucum };
    if (v.comparator) q.comparator = v.comparator;

    const obs: Observation = {
      resourceType: "Observation",
      id: safeId(`lakeview-${rid}`),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab"] },
      status: row.RESULT_STATUS === "P" ? "preliminary" : "final",
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
      code: { coding, text: def.analyte },
      subject: { reference: `Patient/${item.patient}` },
      effectiveDateTime: collected,
      valueQuantity: q,
    };
    if (def.analyte === "egfr") obs.method = { text: egfrEquation(code, str(row.COMMENT_TEXT)) };
    out.push({ obs, sortKey: `${String(instant(collected) ?? 0).padStart(16, "0")}|${def.analyte}|${rid}` });
  }
  out.sort((a, b) => (a.sortKey < b.sortKey ? -1 : a.sortKey > b.sortKey ? 1 : 0));
  return out.map((o) => o.obs);
}

// ───────────────────────────── medications ─────────────────────────────

const BRANDS: Record<string, string> = {
  kerendia: "finerenone",
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  lokelma: "sodium zirconium cyclosilicate",
  veltassa: "patiromer",
  lasix: "furosemide",
  cozaar: "losartan",
  diovan: "valsartan",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  norvasc: "amlodipine",
  renvela: "sevelamer",
  renagel: "sevelamer",
  sensipar: "cinacalcet",
  rocaltrol: "calcitriol",
  zemplar: "paricalcitol",
  epogen: "epoetin alfa",
  procrit: "epoetin alfa",
  retacrit: "epoetin alfa",
  aranesp: "darbepoetin alfa",
  ozempic: "semaglutide",
  trulicity: "dulaglutide",
  lantus: "insulin glargine",
  zyloprim: "allopurinol",
  uloric: "febuxostat",
};
const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "besylate", "maleate", "tartrate", "succinate",
  "mesylate", "fumarate", "dihydrate", "monohydrate", "calcium", "magnesium",
]);
const FORM_WORDS = new Set([
  "er", "xr", "xl", "sr", "dr", "ec", "cr", "la", "tablet", "tablets", "tab", "capsule", "capsules", "cap",
  "oral", "solution", "injection", "pen", "vial", "suspension", "powder", "packet",
]);

function ingredientOf(drugName: string): string | undefined {
  let s = drugName.toLowerCase().replace(/\([^)]*\)/g, " ");
  const tokens = s.split(/[\s,]+/).filter(Boolean);
  const words: string[] = [];
  for (const t of tokens) {
    if (/^[\d.]/.test(t)) break;
    words.push(t);
  }
  while (words.length > 0 && FORM_WORDS.has(words[words.length - 1])) words.pop();
  while (words.length > 1 && SALTS.has(words[words.length - 1])) words.pop();
  if (words.length === 0) return undefined;
  const brand = BRANDS[words[0]];
  if (brand) return brand;
  return words.join(" ");
}

const STATUS: Record<number, "active" | "on-hold" | "stopped"> = { 1: "active", 2: "stopped", 3: "on-hold" };
const STATUS_RANK: Record<string, number> = { active: 3, "on-hold": 2, stopped: 1 };
const REASON_TEXT: Record<string, string> = {
  LAB: "Abnormal lab result",
  ADR: "Adverse drug reaction",
  PT: "Patient request",
  PROC: "Upcoming procedure",
  OTH: "Other",
};
const STOP_REASON: Record<string, "adverse_reaction" | "patient_choice" | "other"> = {
  ADR: "adverse_reaction",
  PT: "patient_choice",
  LAB: "other",
  PROC: "other",
  OTH: "other",
};
const DOSE_UNITS: Record<string, { unit: string; code: string }> = {
  mg: { unit: "mg", code: "mg" },
  mcg: { unit: "mcg", code: "ug" },
  unit: { unit: "units", code: "[iU]" },
  units: { unit: "units", code: "[iU]" },
  ml: { unit: "mL", code: "mL" },
};
const FREQS = new Set(["QD", "BID", "TID", "QHS", "QW", "PRN"]);

interface Hist {
  row: Record<string, any>;
  at: number;
  recorded: number;
}

function mapMeds(items: FolioItem[]): MedicationRequest[] {
  // Latest copy of each MED_ORDER (by item recorded), and every MED_STATUS_HIST row (deduped by HIST_ID).
  const orders = new Map<string, { item: FolioItem; row: Record<string, any> }>();
  const hists = new Map<string, Hist>();
  for (const it of items) {
    const rec = instant(it.recorded) ?? 0;
    for (const [, o] of entries(it, "MED_ORDER")) {
      if (typeof o.RX_ID !== "string") continue;
      const prev = orders.get(o.RX_ID);
      if (!prev || (instant(prev.item.recorded) ?? 0) <= rec) orders.set(o.RX_ID, { item: it, row: o });
    }
    for (const [key, h] of entries(it, "MED_STATUS_HIST")) {
      if (typeof h.RX_ID !== "string") continue;
      const hid = typeof h.HIST_ID === "string" ? h.HIST_ID : `${it.id}/${key}`;
      const at = instant(h.CHANGED_AT) ?? instant(it.effective) ?? rec;
      const prev = hists.get(hid);
      if (!prev || prev.recorded <= rec) hists.set(hid, { row: h, at, recorded: rec });
    }
  }
  const histByRx = new Map<string, Hist[]>();
  for (const h of hists.values()) {
    const list = histByRx.get(h.row.RX_ID) ?? [];
    list.push(h);
    histByRx.set(h.row.RX_ID, list);
  }

  interface Cand {
    req: MedicationRequest;
    ingredientKey: string;
    lastEventDate: string;
    lastEventAt: number;
    orderRecorded: number;
    rx: string;
  }
  const cands: Cand[] = [];

  for (const [rx, { item, row }] of orders) {
    if (row.ROUTE === "IV") continue; // infusions are not home medications
    const drugName = str(row.DRUG_NAME);
    if (!drugName) continue;

    const hs = (histByRx.get(rx) ?? []).slice().sort(
      (a, b) => a.at - b.at || a.recorded - b.recorded || String(a.row.HIST_ID).localeCompare(String(b.row.HIST_ID)),
    );
    const latest = hs.length ? hs[hs.length - 1] : undefined;
    const code = latest ? latest.row.NEW_STATUS : row.MED_STATUS;
    if (code === 9) continue; // entered in error: never existed
    // A discontinuation coded "entered in error" also means the prescription never existed.
    if (latest && latest.row.REASON_CODE === "ERR" && code === 2) continue;
    const status = STATUS[code as number];
    if (!status) continue;

    const ingredient = ingredientOf(drugName);
    const startDate = /^\d{4}-\d{2}-\d{2}$/.test(String(row.START_DATE)) ? (row.START_DATE as string) : undefined;

    let statusSince: string | undefined;
    if (status === "active") {
      // Resumed from a hold (a genuine change, not an error correction) -> resume date; else the order start.
      const resume = latest && latest.row.NEW_STATUS === 1 && latest.row.OLD_STATUS === 3 && latest.row.REASON_CODE !== "ERR" ? latest : undefined;
      statusSince = resume ? localDate(resume.row.CHANGED_AT) : startDate;
    } else if (latest) {
      statusSince = localDate(latest.row.CHANGED_AT);
    }

    const rxnorm = str(row.RXNORM);
    const medication: MedicationRequest["medicationCodeableConcept"] = rxnorm
      ? { coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: rxnorm, display: drugName }], text: drugName }
      : { text: ingredient ? `${drugName} (${ingredient})` : drugName };

    const req: MedicationRequest = {
      resourceType: "MedicationRequest",
      id: safeId(`lakeview-${rx}`),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
      status,
      intent: "order",
      reportedBoolean: false,
      medicationCodeableConcept: medication,
      subject: { reference: `Patient/${item.patient}` },
    };

    if (status !== "active" && latest) {
      const reasonCode = String(latest.row.REASON_CODE ?? "");
      const text = str(latest.row.COMMENT_TEXT) ?? REASON_TEXT[reasonCode];
      const sr: { coding?: Coding[]; text?: string } = {};
      if (status === "stopped" && STOP_REASON[reasonCode]) sr.coding = [{ system: "urn:folio:stop-reason", code: STOP_REASON[reasonCode] }];
      if (text) sr.text = text;
      if (sr.coding || sr.text) req.statusReason = [sr];
    }

    const authored = status === "active" ? statusSince ?? startDate : startDate;
    if (authored) req.authoredOn = authored;

    const dosage: NonNullable<MedicationRequest["dosageInstruction"]>[number] = {};
    const du = DOSE_UNITS[String(row.DOSE_UNIT ?? "").toLowerCase()];
    if (typeof row.DOSE_QTY === "number" && Number.isFinite(row.DOSE_QTY) && du) {
      dosage.doseAndRate = [{ doseQuantity: { value: row.DOSE_QTY, unit: du.unit, system: "http://unitsofmeasure.org", code: du.code } }];
    }
    if (typeof row.FREQ_CODE === "string") {
      const f = FREQS.has(row.FREQ_CODE) ? (row.FREQ_CODE as "QD") : "other";
      dosage.timing = { code: { text: f } };
    }
    if (dosage.doseAndRate || dosage.timing) req.dosageInstruction = [dosage];

    // The order's own latest event: prescribing visit, start date, or latest status change.
    const events: string[] = [];
    const visitDate = localDate(item.effective);
    if (visitDate) events.push(visitDate);
    if (startDate) events.push(startDate);
    for (const h of hs) {
      const d = localDate(h.row.CHANGED_AT);
      if (d) events.push(d);
    }
    events.sort();
    cands.push({
      req,
      ingredientKey: ingredient ?? `drug:${String(row.LV_DRUG_ID ?? drugName).toLowerCase()}`,
      lastEventDate: events.length ? events[events.length - 1] : "",
      lastEventAt: Math.max(instant(item.effective) ?? 0, ...hs.map((h) => h.at)),
      orderRecorded: instant(item.recorded) ?? 0,
      rx,
    });
  }

  // One row per ingredient: the line whose own latest event is latest. Same-day ties go to the line
  // that is not stopped (a same-day restart), then the later-published prescription.
  const best = new Map<string, Cand>();
  for (const c of cands) {
    const p = best.get(c.ingredientKey);
    if (!p || better(c, p)) best.set(c.ingredientKey, c);
  }
  function better(a: Cand, b: Cand): boolean {
    if (a.lastEventDate !== b.lastEventDate) return a.lastEventDate > b.lastEventDate;
    const ra = STATUS_RANK[a.req.status] ?? 0, rb = STATUS_RANK[b.req.status] ?? 0;
    if (ra !== rb) return ra > rb;
    if (a.orderRecorded !== b.orderRecorded) return a.orderRecorded > b.orderRecorded;
    if (a.lastEventAt !== b.lastEventAt) return a.lastEventAt > b.lastEventAt;
    return a.rx > b.rx;
  }
  return [...best.values()].sort((a, b) => (a.req.id < b.req.id ? -1 : a.req.id > b.req.id ? 1 : 0)).map((c) => c.req);
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const out: UsCoreRows = { medicationRequests: [], observations: [] };
  try {
    const cur = currentItems(items, asOf);
    try {
      out.observations = mapLabs(cur);
    } catch {
      out.observations = [];
    }
    try {
      out.medicationRequests = mapMeds(cur);
    } catch {
      out.medicationRequests = [];
    }
  } catch {
    /* unreadable input: nothing to report */
  }
  return out;
}
