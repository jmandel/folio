import type { FolioItem, UsCoreRows, MedicationRequest, Observation, Quantity, Coding } from "../in/views/uscore";

// ───────────────────────────── time helpers ─────────────────────────────

const TZ = "America/Chicago";
let dateFmt: Intl.DateTimeFormat | null = null;

function hasOffset(s: string): boolean {
  return /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i.test(s);
}

/** Local (America/Chicago) calendar date of a timestamp or date string; null if unreadable. */
function localDate(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  if (!hasOffset(t)) {
    // No zone: already local wall-clock time.
    const m = /^(\d{4}-\d{2}-\d{2})T/.exec(t);
    return m ? m[1] : null;
  }
  const ms = Date.parse(t);
  if (!Number.isFinite(ms)) return null;
  if (!dateFmt) dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  const parts: Record<string, string> = {};
  for (const p of dateFmt.formatToParts(new Date(ms))) parts[p.type] = p.value;
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Instant in ms for ordering; NaN if unreadable. Zone-less times are treated as Chicago (approximate, ordering only). */
function instant(s: unknown): number {
  if (typeof s !== "string") return NaN;
  const t = s.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return Date.parse(`${t}T00:00:00-06:00`);
  if (!hasOffset(t)) return Date.parse(`${t}-06:00`);
  return Date.parse(t);
}

const isStr = (v: unknown): v is string => typeof v === "string" && v.length > 0;

// ───────────────────────────── item scope ─────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope = (Array.isArray(items) ? items : []).filter((it) => {
    if (!it || typeof it !== "object" || !isStr(it.id)) return false;
    const d = localDate(it.recorded);
    return d !== null && d <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const list of [it.supersedes, it.retracts]) {
      if (!Array.isArray(list)) continue;
      for (const id of list) if (isStr(id)) dead.add(`${it.issuer}|${id}`);
    }
  }
  return inScope.filter((it) => !dead.has(`${it.issuer}|${it.id}`));
}

function entries(it: FolioItem): [string, any][] {
  const p = it.payload;
  if (!p || typeof p !== "object") return [];
  return Object.keys(p)
    .sort()
    .map((k) => [k, p[k]] as [string, any])
    .filter(([, e]) => e && typeof e === "object" && isStr(e.type));
}

function safeId(prefix: string, raw: string): string {
  return (prefix + raw.replace(/[^A-Za-z0-9.\-]/g, "-")).slice(0, 64);
}

// ───────────────────────────── medications ─────────────────────────────

const SALT_WORDS = new Set([
  "potassium", "sodium", "calcium", "magnesium", "hydrochloride", "hcl", "hydrobromide", "besylate", "maleate",
  "mesylate", "succinate", "tartrate", "fumarate", "citrate", "acetate", "sulfate", "phosphate", "bicarbonate",
  "carbonate", "medoxomil", "dihydrate", "monohydrate", "trihydrate", "er", "xr", "sr", "dr", "xl", "la",
]);
// Words that are themselves the drug, even though they are also salt words when following another word.
const STANDALONE_DRUGS = new Set(["sodium bicarbonate", "calcium carbonate", "calcium acetate", "potassium chloride", "sodium chloride", "magnesium oxide"]);
const BRANDS: Record<string, string> = {
  kerendia: "finerenone", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", lantus: "insulin glargine", basaglar: "insulin glargine",
  toujeo: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro",
  novolog: "insulin aspart", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", norvasc: "amlodipine", lasix: "furosemide",
  bumex: "bumetanide", aldactone: "spironolactone", inspra: "eplerenone", lokelma: "sodium zirconium cyclosilicate",
  veltassa: "patiromer", renvela: "sevelamer", renagel: "sevelamer", velphoro: "sucroferric oxyhydroxide",
  auryxia: "ferric citrate", sensipar: "cinacalcet", epogen: "epoetin alfa", procrit: "epoetin alfa",
  retacrit: "epoetin alfa", aranesp: "darbepoetin alfa", zemplar: "paricalcitol", hectorol: "doxercalciferol",
  rocaltrol: "calcitriol", glucophage: "metformin", lipitor: "atorvastatin", crestor: "rosuvastatin",
  zocor: "simvastatin", zyloprim: "allopurinol", uloric: "febuxostat",
};

function ingredientOf(drugName: string): string | undefined {
  const lower = drugName.toLowerCase().replace(/[(),]/g, " ").replace(/\s+/g, " ").trim();
  const words: string[] = [];
  for (const w of lower.split(" ")) {
    if (/^[\d.]/.test(w)) break; // strength begins
    words.push(w);
  }
  if (words.length === 0) return undefined;
  const joined = words.join(" ");
  if (STANDALONE_DRUGS.has(joined)) return joined;
  if (BRANDS[joined]) return BRANDS[joined];
  if (BRANDS[words[0]]) return BRANDS[words[0]];
  const kept = words.filter((w, i) => i === 0 || !SALT_WORDS.has(w));
  return kept.join(" ") || undefined;
}

interface RxLine {
  item: FolioItem;
  entryId: string;
  row: any;
  visitAt: number;
  visitId: string;
  hist: { item: FolioItem; entryId: string; row: any; at: number; visitAt: number }[];
}

const REASON_LABEL: Record<string, string> = {
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
const FREQS = new Set(["QD", "BID", "TID", "QHS", "QW", "PRN"]);
const DOSE_UNITS: Record<string, { unit: string; code: string }> = {
  mg: { unit: "mg", code: "mg" },
  mcg: { unit: "mcg", code: "ug" },
  unit: { unit: "units", code: "[iU]" },
  mL: { unit: "mL", code: "mL" },
};

function mapMedications(items: FolioItem[]): MedicationRequest[] {
  const lines = new Map<string, RxLine>();
  const hists: { item: FolioItem; entryId: string; row: any; visitAt: number }[] = [];

  for (const it of items) {
    const es = entries(it);
    const visit = es.find(([, e]) => e.type === "CLINIC_VISIT")?.[1];
    let visitAt = instant(visit?.VISIT_AT);
    if (!Number.isFinite(visitAt)) visitAt = instant(it.effective);
    const visitId = isStr(visit?.VISIT_ID) ? visit.VISIT_ID : it.id;
    for (const [entryId, e] of es) {
      if (e.type === "MED_ORDER" && isStr(e.RX_ID) && isStr(e.DRUG_NAME)) {
        const prev = lines.get(e.RX_ID);
        // RX_IDs are unique; if restated in two current items, keep the later-recorded copy.
        if (prev && instant(prev.item.recorded) > instant(it.recorded)) continue;
        lines.set(e.RX_ID, { item: it, entryId, row: e, visitAt, visitId, hist: [] });
      } else if (e.type === "MED_STATUS_HIST" && isStr(e.RX_ID)) {
        hists.push({ item: it, entryId, row: e, visitAt });
      }
    }
  }
  const seenHist = new Set<string>();
  for (const h of hists) {
    const key = isStr(h.row.HIST_ID) ? h.row.HIST_ID : `${h.item.id}|${h.entryId}`;
    if (seenHist.has(key)) continue;
    seenHist.add(key);
    const line = lines.get(h.row.RX_ID);
    if (!line) continue;
    let at = instant(h.row.CHANGED_AT);
    if (!Number.isFinite(at)) at = h.visitAt;
    line.hist.push({ ...h, at });
  }

  interface Cand {
    line: RxLine;
    status: 1 | 2 | 3;
    last?: RxLine["hist"][number];
    eventKey: number;
    ingredient?: string;
  }
  const cands: Cand[] = [];
  for (const line of lines.values()) {
    const r = line.row;
    if (r.MED_STATUS === 9) continue; // entered in error: never existed
    if (r.ROUTE === "IV") continue; // not a home medication
    line.hist.sort((a, b) => a.at - b.at || a.visitAt - b.visitAt || String(a.row.HIST_ID).localeCompare(String(b.row.HIST_ID)));
    if (line.hist.some((h) => h.row.NEW_STATUS === 9 || h.row.REASON_CODE === "ERR")) continue;
    const last = line.hist.length ? line.hist[line.hist.length - 1] : undefined;
    const status = last ? last.row.NEW_STATUS : r.MED_STATUS;
    if (status !== 1 && status !== 2 && status !== 3) continue;
    let eventKey = Number.isFinite(line.visitAt) ? line.visitAt : -Infinity;
    for (const h of line.hist) {
      const k = Number.isFinite(h.visitAt) ? h.visitAt : h.at;
      if (Number.isFinite(k) && k > eventKey) eventKey = k;
    }
    cands.push({ line, status, last, eventKey, ingredient: ingredientOf(line.row.DRUG_NAME) });
  }

  // One line per ingredient: the one whose latest event (contact) is latest. Within the same contact,
  // prefer the order created at that contact, then a non-stopped one, then the later start.
  const byIngr = new Map<string, Cand>();
  const better = (a: Cand, b: Cand): boolean => {
    if (a.eventKey !== b.eventKey) return a.eventKey > b.eventKey;
    const aNew = a.line.visitAt === a.eventKey ? 1 : 0;
    const bNew = b.line.visitAt === b.eventKey ? 1 : 0;
    if (aNew !== bNew) return aNew > bNew;
    const aAct = a.status === 2 ? 0 : 1;
    const bAct = b.status === 2 ? 0 : 1;
    if (aAct !== bAct) return aAct > bAct;
    const as = String(a.line.row.START_DATE ?? "");
    const bs = String(b.line.row.START_DATE ?? "");
    if (as !== bs) return as > bs;
    return String(a.line.row.RX_ID) > String(b.line.row.RX_ID);
  };
  for (const c of cands) {
    const key = c.ingredient ?? `lvd:${c.line.row.LV_DRUG_ID ?? c.line.row.RX_ID}`;
    const prev = byIngr.get(key);
    if (!prev || better(c, prev)) byIngr.set(key, c);
  }

  const out: MedicationRequest[] = [];
  for (const c of byIngr.values()) {
    const r = c.line.row;
    const it = c.line.item;
    const statusFhir = c.status === 1 ? "active" : c.status === 3 ? "on-hold" : "stopped";
    const startDate = /^\d{4}(-\d{2}(-\d{2})?)?$/.test(String(r.START_DATE ?? "")) ? (r.START_DATE as string) : undefined;

    let statusSince: string | undefined;
    if (c.status === 1) {
      statusSince = c.last && c.last.row.NEW_STATUS === 1 ? localDate(c.last.row.CHANGED_AT) ?? undefined : startDate;
    }

    const mr: MedicationRequest = {
      resourceType: "MedicationRequest",
      id: safeId("mr-", String(r.RX_ID)),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
      status: statusFhir,
      intent: "order",
      reportedBoolean: false,
      medicationCodeableConcept: {},
      subject: { reference: `Patient/${it.patient}` },
    };

    if (c.status !== 1 && c.last) {
      const code = String(c.last.row.REASON_CODE ?? "");
      const text = isStr(c.last.row.COMMENT_TEXT) ? c.last.row.COMMENT_TEXT : REASON_LABEL[code];
      const sr: { coding?: Coding[]; text?: string } = {};
      if (text) sr.text = text;
      if (c.status === 2 && STOP_REASON[code]) sr.coding = [{ system: "urn:folio:stop-reason", code: STOP_REASON[code] }];
      if (sr.text || sr.coding) mr.statusReason = sr;
    }

    if (isStr(r.RXNORM)) {
      mr.medicationCodeableConcept = {
        coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: r.RXNORM, display: r.DRUG_NAME }],
        text: r.DRUG_NAME,
      };
    } else {
      mr.medicationCodeableConcept = { text: c.ingredient ? `${r.DRUG_NAME} (${c.ingredient})` : r.DRUG_NAME };
    }

    if (isStr(r.PRESCRIBER_NPI)) {
      const req: { display?: string; identifier?: { system: string; value: string } } = {
        identifier: { system: "http://hl7.org/fhir/sid/us-npi", value: r.PRESCRIBER_NPI },
      };
      if (it.author && it.author.id === `npi:${r.PRESCRIBER_NPI}` && isStr(it.author.name)) req.display = it.author.name;
      mr.requester = req;
    } else {
      mr.requester = { display: "Lakeview Labs & Kidney Care" };
    }

    const authored = c.status === 1 ? statusSince ?? startDate : startDate;
    if (authored) mr.authoredOn = authored;

    const dosage: NonNullable<MedicationRequest["dosageInstruction"]>[number] = {};
    if (isStr(r.FREQ_CODE)) dosage.timing = { code: { text: FREQS.has(r.FREQ_CODE) ? r.FREQ_CODE : "other" } as any };
    const du = DOSE_UNITS[String(r.DOSE_UNIT)];
    if (du && typeof r.DOSE_QTY === "number" && Number.isFinite(r.DOSE_QTY)) {
      const q: Quantity = { value: r.DOSE_QTY, unit: du.unit, system: "http://unitsofmeasure.org", code: du.code };
      dosage.doseAndRate = [{ doseQuantity: q }];
    }
    if (dosage.timing || dosage.doseAndRate) mr.dosageInstruction = [dosage];

    out.push(mr);
  }
  out.sort((a, b) => a.id.localeCompare(b.id));
  return out;
}

// ───────────────────────────── labs ─────────────────────────────

type Analyte = string;
interface TestDef {
  analyte: Analyte;
  srcUnit: string;
  unit: string;
  ucum: string;
  loinc: string;
  equation?: "ckd-epi-2021" | "ckd-epi-2009";
}
const TESTS: Record<string, TestDef> = {
  "LK-CREAT": { analyte: "creatinine", srcUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "2160-0" },
  "LK-EGFR09N": { analyte: "egfr", srcUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2", ucum: "mL/min/{1.73_m2}", loinc: "48642-3", equation: "ckd-epi-2009" },
  // LK-EGFR09A (race coefficient applied) is deliberately absent: only the race-free variant is reported.
  "LK-EGFR21": { analyte: "egfr", srcUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2", ucum: "mL/min/{1.73_m2}", loinc: "98979-8", equation: "ckd-epi-2021" },
  "LK-NA": { analyte: "sodium", srcUnit: "mmol/L", unit: "mmol/L", ucum: "mmol/L", loinc: "2951-2" },
  "LK-K": { analyte: "potassium", srcUnit: "mmol/L", unit: "mmol/L", ucum: "mmol/L", loinc: "2823-3" },
  "LK-GLU": { analyte: "glucose", srcUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "2345-7" },
  "LK-A1C": { analyte: "a1c", srcUnit: "%", unit: "%", ucum: "%", loinc: "4548-4" },
  "LK-UACR": { analyte: "uacr", srcUnit: "mg/g", unit: "mg/g", ucum: "mg/g", loinc: "9318-7" },
  "LK-WBC": { analyte: "wbc", srcUnit: "K/uL", unit: "10*3/uL", ucum: "10*3/uL", loinc: "6690-2" },
  "LK-HGB": { analyte: "hemoglobin", srcUnit: "g/dL", unit: "g/dL", ucum: "g/dL", loinc: "718-7" },
  "LK-PLT": { analyte: "platelets", srcUnit: "K/uL", unit: "10*3/uL", ucum: "10*3/uL", loinc: "777-3" },
  "LK-CHOL": { analyte: "cholesterol", srcUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "2093-3" },
  "LK-TRIG": { analyte: "triglycerides", srcUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "2571-8" },
  "LK-HDL": { analyte: "hdl", srcUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "2085-9" },
  "LK-LDLC": { analyte: "ldl", srcUnit: "mg/dL", unit: "mg/dL", ucum: "mg/dL", loinc: "13457-7" },
};

const STATUS_RANK: Record<string, number> = { P: 1, F: 2, A: 3, C: 4, X: 4 };

function parseValue(text: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | null {
  if (typeof text !== "string") return null;
  const m = /^\s*(<=|>=|<|>)?\s*(\d+(?:\.\d+)?|\.\d+)\s*$/.exec(text);
  if (!m) return null;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return null;
  return m[1] ? { value, comparator: m[1] as "<" | ">" | "<=" | ">=" } : { value };
}

function equationFromComment(c: unknown): "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | null {
  if (typeof c !== "string") return null;
  const s = c.toUpperCase();
  if (/CKD[- ]?EPI[^.]*2021/.test(s)) return "ckd-epi-2021";
  if (/CKD[- ]?EPI[^.]*2009/.test(s)) return "ckd-epi-2009";
  if (/MDRD/.test(s)) return "mdrd";
  return null;
}

function mapLabs(items: FolioItem[]): Observation[] {
  interface Copy { item: FolioItem; entryId: string; row: any; order: any; collected: string }
  const copies = new Map<string, Copy>();
  const voidOrders = new Set<string>();

  for (const it of items) {
    const es = entries(it);
    const req = es.find(([, e]) => e.type === "LAB_REQ")?.[1];
    const collected = isStr(req?.COLLECTED_AT) ? req.COLLECTED_AT : it.effective;
    const orders = new Map<string, any>();
    for (const [, e] of es) {
      if (e.type !== "LAB_ORDER" || !isStr(e.ORDER_ID)) continue;
      orders.set(e.ORDER_ID, e);
      if (e.ORDER_STATUS === 9 || e.ORDER_STATUS === 5) voidOrders.add(e.ORDER_ID);
    }
    for (const [entryId, e] of es) {
      if (e.type !== "LAB_RESULT" || !isStr(e.RESULT_ID)) continue;
      const rank = STATUS_RANK[String(e.RESULT_STATUS)];
      if (!rank) continue;
      const prev = copies.get(e.RESULT_ID);
      if (prev) {
        const pr = STATUS_RANK[String(prev.row.RESULT_STATUS)];
        if (pr > rank) continue;
        if (pr === rank && instant(prev.item.recorded) >= instant(it.recorded)) continue;
      }
      copies.set(e.RESULT_ID, { item: it, entryId, row: e, order: orders.get(e.ORDER_ID), collected });
    }
  }

  const out: Observation[] = [];
  for (const [resultId, c] of copies) {
    const r = c.row;
    const st = String(r.RESULT_STATUS);
    if (st !== "P" && st !== "F" && st !== "A") continue;
    if (!c.order || voidOrders.has(String(r.ORDER_ID))) continue;
    const def = TESTS[String(r.TEST_CODE)];
    if (!def) continue;
    if (r.UNIT_CODE !== def.srcUnit) continue;
    const v = parseValue(r.VALUE_TEXT);
    if (!v) continue;
    if (!isStr(c.collected) || !hasOffset(c.collected)) continue;

    const loinc = isStr(r.LOINC) ? r.LOINC : def.loinc;
    const coding: Coding[] = [
      { system: "http://loinc.org", code: loinc },
      { system: "urn:lakeview-labs:test-code", code: String(r.TEST_CODE), ...(isStr(r.TEST_NAME) ? { display: r.TEST_NAME } : {}) },
    ];
    const q: Quantity = { value: v.value, unit: def.unit, system: "http://unitsofmeasure.org", code: def.ucum };
    if (v.comparator) q.comparator = v.comparator;

    const obs: Observation = {
      resourceType: "Observation",
      id: safeId("obs-", resultId),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab"] },
      status: st === "P" ? "preliminary" : "final",
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
      code: { coding, text: def.analyte },
      subject: { reference: `Patient/${c.item.patient}` },
      effectiveDateTime: c.collected,
      valueQuantity: q,
    };
    if (def.analyte === "egfr") {
      obs.method = { text: equationFromComment(r.COMMENT_TEXT) ?? def.equation ?? "unknown" };
    }
    out.push(obs);
  }
  out.sort((a, b) => instant(a.effectiveDateTime) - instant(b.effectiveDateTime) || a.id.localeCompare(b.id));
  return out;
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const result: UsCoreRows = { medicationRequests: [], observations: [] };
  try {
    const current = currentItems(items, asOf);
    try {
      result.medicationRequests = mapMedications(current);
    } catch {
      result.medicationRequests = [];
    }
    try {
      result.observations = mapLabs(current);
    } catch {
      result.observations = [];
    }
  } catch {
    // unreadable input: nothing to report
  }
  return result;
}
