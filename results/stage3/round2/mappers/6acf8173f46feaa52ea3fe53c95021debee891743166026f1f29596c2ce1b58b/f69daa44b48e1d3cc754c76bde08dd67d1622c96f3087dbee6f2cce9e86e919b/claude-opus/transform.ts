// Northgate Family Medicine chart event log (northgate-chart-v1) -> US Core MedicationRequest / lab Observation.
import type { FolioItem, UsCoreRows, MedicationRequest, Observation, Quantity, Coding } from "../in/views/uscore";

const TZ = "America/Chicago";
const ORG_NAME = "Northgate Family Medicine";

// ───────────────────────────── time helpers ─────────────────────────────

const OFFSET_RE = /(Z|[+-]\d{2}:?\d{2})$/i;
const DATE_ONLY_RE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

let dateFmt: Intl.DateTimeFormat | undefined;
function chicagoDate(ms: number): string | undefined {
  try {
    if (!dateFmt) dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
    const parts = dateFmt.formatToParts(new Date(ms));
    const get = (t: string) => parts.find((p) => p.type === t)?.value;
    const y = get("year"), m = get("month"), d = get("day");
    if (!y || !m || !d) return undefined;
    return `${y}-${m}-${d}`;
  } catch {
    return undefined;
  }
}

/** Local (America/Chicago) date of a timestamp or date string; keeps partial dates as written. */
function localDate(ts: unknown): string | undefined {
  if (typeof ts !== "string") return undefined;
  const s = ts.trim();
  if (DATE_ONLY_RE.test(s)) return s;
  if (OFFSET_RE.test(s)) {
    const ms = Date.parse(s);
    if (isNaN(ms)) return undefined;
    return chicagoDate(ms);
  }
  // No offset: wall-clock Chicago time, report as written.
  const m = /^(\d{4}-\d{2}-\d{2})[T ]/.exec(s);
  return m ? m[1] : undefined;
}

/** Approximate instant for ordering (no-offset and date-only values treated as Chicago standard time). */
function instant(ts: unknown): number | undefined {
  if (typeof ts !== "string") return undefined;
  const s = ts.trim();
  if (DATE_ONLY_RE.test(s)) {
    const full = s.length === 4 ? s + "-01-01" : s.length === 7 ? s + "-01" : s;
    const ms = Date.parse(full + "T00:00:00-06:00");
    return isNaN(ms) ? undefined : ms;
  }
  const ms = Date.parse(OFFSET_RE.test(s) ? s : s + "-06:00");
  return isNaN(ms) ? undefined : ms;
}

function hasTime(ts: unknown): boolean {
  return typeof ts === "string" && /T\d{2}:\d{2}/.test(ts);
}

// ───────────────────────────── scope & corrections ─────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope: FolioItem[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const d = localDate(it.recorded);
    if (!d || d > asOf) continue;
    inScope.push(it);
  }
  const dead = new Set<string>();
  const kill = (issuer: string, id: unknown) => {
    if (typeof id === "string") dead.add(issuer + "\u0000" + id);
  };
  for (const it of inScope) {
    const iss = String(it.issuer ?? "");
    for (const id of Array.isArray(it.supersedes) ? it.supersedes : []) kill(iss, id);
    for (const id of Array.isArray(it.retracts) ? it.retracts : []) kill(iss, id);
    // Northgate's own void entry lists the same ids; honour it too.
    const payload = it.payload && typeof it.payload === "object" ? it.payload : {};
    for (const e of Object.values(payload)) {
      if (e && typeof e === "object" && (e as any).type === "chart_correction" && Array.isArray((e as any).voided_items)) {
        for (const id of (e as any).voided_items) kill(iss, id);
      }
    }
  }
  return inScope.filter((it) => !dead.has(String(it.issuer ?? "") + "\u0000" + it.id));
}

interface Entry {
  item: FolioItem;
  entryId: string;
  e: any;
}

function entriesOf(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    const payload = item.payload && typeof item.payload === "object" ? item.payload : {};
    for (const [entryId, e] of Object.entries(payload)) {
      if (e && typeof e === "object" && (e as any).type === type) out.push({ item, entryId, e });
    }
  }
  return out;
}

function safeId(s: string): string {
  return s.replace(/[^A-Za-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "x";
}

function uniqueId(base: string, used: Set<string>): string {
  let id = safeId(base);
  let n = 2;
  while (used.has(id)) {
    const suffix = "-" + n++;
    id = safeId(base).slice(0, 64 - suffix.length) + suffix;
  }
  used.add(id);
  return id;
}

// ───────────────────────────── medications ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  rezvoglar: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro",
  admelog: "insulin lispro", lyumjev: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart",
  apidra: "insulin glulisine", humulin: "insulin human", novolin: "insulin human",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  byetta: "exenatide", bydureon: "exenatide", januvia: "sitagliptin", tradjenta: "linagliptin",
  onglyza: "saxagliptin", nesina: "alogliptin", glucophage: "metformin", glumetza: "metformin", fortamet: "metformin",
  glucotrol: "glipizide", amaryl: "glimepiride", micronase: "glyburide", diabeta: "glyburide", actos: "pioglitazone",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide",
  aldactone: "spironolactone", inspra: "eplerenone", kerendia: "finerenone", cozaar: "losartan", diovan: "valsartan",
  avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan", atacand: "candesartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril",
  norvasc: "amlodipine", procardia: "nifedipine", adalat: "nifedipine", cardizem: "diltiazem", calan: "verapamil",
  coreg: "carvedilol", toprol: "metoprolol", lopressor: "metoprolol", tenormin: "atenolol", bystolic: "nebivolol",
  catapres: "clonidine", apresoline: "hydralazine", lipitor: "atorvastatin", crestor: "rosuvastatin",
  zocor: "simvastatin", pravachol: "pravastatin", livalo: "pitavastatin", zetia: "ezetimibe", tricor: "fenofibrate",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", zoloft: "sertraline", lexapro: "escitalopram",
  celexa: "citalopram", prozac: "fluoxetine", paxil: "paroxetine", wellbutrin: "bupropion", cymbalta: "duloxetine",
  effexor: "venlafaxine", pristiq: "desvenlafaxine", remeron: "mirtazapine", desyrel: "trazodone",
  buspar: "buspirone", xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam",
  abilify: "aripiprazole", seroquel: "quetiapine", lamictal: "lamotrigine", trintellix: "vortioxetine",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", jantoven: "warfarin", plavix: "clopidogrel",
  zyloprim: "allopurinol", uloric: "febuxostat", colcrys: "colchicine", prilosec: "omeprazole",
  protonix: "pantoprazole", nexium: "esomeprazole", pepcid: "famotidine", neurontin: "gabapentin",
  lyrica: "pregabalin", tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  flomax: "tamsulosin", proscar: "finasteride", singulair: "montelukast", ventolin: "albuterol",
  proair: "albuterol", flonase: "fluticasone", zyrtec: "cetirizine", claritin: "loratadine", "k-dur": "potassium chloride",
  "klor-con": "potassium chloride", veltassa: "patiromer", lokelma: "sodium zirconium cyclosilicate",
  renvela: "sevelamer", phoslo: "calcium acetate", sensipar: "cinacalcet",
};

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "dihydrochloride", "calcium", "magnesium", "besylate", "maleate",
  "mesylate", "succinate", "tartrate", "fumarate", "citrate", "sulfate", "acetate", "bromide", "phosphate",
  "propionate", "hyclate", "monohydrate", "dihydrate", "trihydrate", "anhydrous", "medoxomil", "cilexetil",
  "disoproxil", "bitartrate", "hydrobromide", "erbumine", "valerate", "furoate", "dipropionate", "xinafoate",
  "lactate", "gluconate", "carbonate", "oxalate", "nitrate", "mononitrate", "propylene",
]);

const FORM_WORDS = new Set([
  "er", "xr", "sr", "xl", "dr", "ir", "cr", "la", "ec", "odt", "tab", "tabs", "tablet", "tablets", "cap", "caps",
  "capsule", "capsules", "oral", "solution", "injection", "pen", "injector", "extended", "release", "delayed", "hr",
]);

function ingredientOfPart(part: string): string | undefined {
  let s = part.replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ").trim();
  // Leading pack/volume quantities, e.g. "3 ML insulin glargine", "24 HR metoprolol".
  s = s.replace(/^(\d+(\.\d+)?\s*(ml|hr|actuat|mg|mcg|unt)\s+)+/i, "");
  const words: string[] = [];
  for (const w of s.split(/\s+/)) {
    if (!w) continue;
    if (/^[\d.]/.test(w)) break;
    words.push(w.toLowerCase().replace(/[,;:()]+$/g, ""));
  }
  let ws = words.filter((w) => w && !FORM_WORDS.has(w));
  if (ws.length === 0) return undefined;
  if (BRANDS[ws[0]]) return BRANDS[ws[0]];
  if (ws.length > 1) ws = [ws[0], ...ws.slice(1).filter((w) => !SALTS.has(w))];
  const name = ws.join(" ").trim();
  return name || undefined;
}

function ingredientOf(name: string): string | undefined {
  if (typeof name !== "string" || !name.trim()) return undefined;
  const bracket = /\[([^\]]+)\]/.exec(name);
  const parts = name.replace(/\[[^\]]*\]/g, " ").split(/\s+\/\s+/);
  const ings: string[] = [];
  for (const p of parts) {
    const ing = ingredientOfPart(p);
    if (ing && !ings.includes(ing)) ings.push(ing);
  }
  if (ings.length) return ings.join(" / ");
  if (bracket) {
    const b = bracket[1].trim().toLowerCase();
    if (BRANDS[b]) return BRANDS[b];
  }
  return undefined;
}

/** Per-tablet strength in mg/mcg when the drug name gives exactly one. */
function tabletStrength(name: string): { value: number; unit: "mg" | "mcg" } | undefined {
  if (typeof name !== "string" || /\s\/\s/.test(name)) return undefined;
  const re = /(\d+(?:\.\d+)?)\s*(MG|MCG)(?![\/\w])/gi;
  const hits: { value: number; unit: "mg" | "mcg" }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(name))) hits.push({ value: Number(m[1]), unit: m[2].toLowerCase() === "mcg" ? "mcg" : "mg" });
  if (hits.length !== 1 || !isFinite(hits[0].value)) return undefined;
  return hits[0];
}

type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";

function mapDose(dose: any, drugName: string): { value: number; unit: DoseUnit } | undefined {
  if (!dose || typeof dose !== "object") return undefined;
  const v = typeof dose.value === "number" ? dose.value : Number(dose.value);
  if (!isFinite(v) || v <= 0) return undefined;
  const u = String(dose.unit ?? "").trim().toLowerCase();
  if (u === "mg" || u === "milligram" || u === "milligrams") return { value: v, unit: "mg" };
  if (u === "mcg" || u === "ug" || u === "µg" || u === "microgram" || u === "micrograms") return { value: v, unit: "mcg" };
  if (["units", "unit", "unt", "u", "iu", "[iu]", "[iu]s"].includes(u)) return { value: v, unit: "units" };
  if (u === "ml" || u === "milliliter" || u === "milliliters") return { value: v, unit: "mL" };
  if (["tab", "tabs", "tablet", "tablets", "cap", "caps", "capsule", "capsules"].includes(u)) {
    const st = tabletStrength(drugName);
    if (st) return { value: Math.round(v * st.value * 1e6) / 1e6, unit: st.unit };
    return { value: v, unit: "tablet" };
  }
  return undefined;
}

const DOSE_UCUM: Record<DoseUnit, string> = { mg: "mg", mcg: "ug", units: "[iU]", mL: "mL", tablet: "{tbl}" };

type Freq = "QD" | "BID" | "TID" | "QHS" | "QW" | "PRN" | "other";
function mapFrequency(freq: unknown, sig: unknown): Freq | undefined {
  switch (freq) {
    case "QD": case "BID": case "TID": case "QHS": case "PRN": return freq;
    case "OTHER": {
      if (typeof sig === "string" && /\b(once (a |per )?week|weekly|every week|q ?week|qw)\b/i.test(sig)) return "QW";
      return "other";
    }
    default: return undefined;
  }
}

const STOP_REASONS = new Set(["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"]);
const HOSPITAL_ONLY = /\b(intravenous|infusion|iv piggyback|ivpb|iv bag|iv push|premix)\b/i;

function cmpEvents(a: Entry, b: Entry): number {
  const da = localDate(a.item.effective) ?? "", db = localDate(b.item.effective) ?? "";
  if (da !== db) return da < db ? -1 : 1;
  if (hasTime(a.item.effective) && hasTime(b.item.effective)) {
    const ia = instant(a.item.effective) ?? 0, ib = instant(b.item.effective) ?? 0;
    if (ia !== ib) return ia - ib;
  }
  const ra = instant(a.item.recorded) ?? 0, rb = instant(b.item.recorded) ?? 0;
  if (ra !== rb) return ra - rb;
  return a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : a.entryId < b.entryId ? -1 : a.entryId > b.entryId ? 1 : 0;
}

interface MedLine {
  medId: string;
  events: Entry[];
  latest: Entry;
  ingredient?: string;
}

function buildMedications(items: FolioItem[]): MedicationRequest[] {
  const byLine = new Map<string, Entry[]>();
  for (const en of entriesOf(items, "med_event")) {
    const e = en.e;
    if (typeof e.med_id !== "string" || !e.med_id) continue;
    if (!["start", "change", "hold", "resume", "stop"].includes(e.action)) continue;
    if (!e.drug || typeof e.drug.name !== "string") continue;
    const arr = byLine.get(e.med_id) ?? [];
    arr.push(en);
    byLine.set(e.med_id, arr);
  }

  const lines: MedLine[] = [];
  for (const [medId, events] of byLine) {
    events.sort(cmpEvents);
    const latest = events[events.length - 1];
    if (HOSPITAL_ONLY.test(String(latest.e.drug.name))) continue;
    lines.push({ medId, events, latest, ingredient: ingredientOf(latest.e.drug.name) });
  }

  // One row per ingredient: the line whose own latest event is latest.
  const chosen = new Map<string, MedLine>();
  for (const ln of lines) {
    const key = ln.ingredient ? "ing:" + ln.ingredient : "line:" + ln.medId;
    const prev = chosen.get(key);
    if (!prev || cmpEvents(prev.latest, ln.latest) < 0) chosen.set(key, ln);
  }

  const used = new Set<string>();
  const out: MedicationRequest[] = [];
  const sorted = [...chosen.values()].sort((a, b) => (a.medId < b.medId ? -1 : a.medId > b.medId ? 1 : 0));
  for (const ln of sorted) {
    const e = ln.latest.e;
    const action: string = e.action;
    const status: MedicationRequest["status"] =
      action === "hold" ? "on-hold" : action === "stop" ? "stopped" : "active";

    const startEv = ln.events.find((x) => x.e.action === "start");
    const lineBegan = startEv ? localDate(startEv.item.effective) : undefined;
    let authoredOn: string | undefined;
    if (status === "active") {
      // Current status began at the latest start or resume.
      let since: string | undefined;
      for (const x of ln.events) if (x.e.action === "start" || x.e.action === "resume") since = localDate(x.item.effective);
      authoredOn = since ?? lineBegan;
    } else {
      authoredOn = lineBegan;
    }

    const outside = e.origin === "outside";
    const drugName: string = e.drug.name;
    const rxnorm = typeof e.drug.rxnorm === "string" && e.drug.rxnorm.trim() ? e.drug.rxnorm.trim() : undefined;
    const medicationCodeableConcept: MedicationRequest["medicationCodeableConcept"] = rxnorm
      ? { coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: rxnorm }], text: drugName }
      : { text: ln.ingredient ? `${drugName} (${ln.ingredient})` : drugName };

    const mr: MedicationRequest = {
      resourceType: "MedicationRequest",
      id: uniqueId("med-" + ln.medId, used),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
      status,
      intent: outside ? "plan" : "order",
      reportedBoolean: outside,
      medicationCodeableConcept,
      subject: { reference: "Patient/" + ln.latest.item.patient },
    };

    if (status === "on-hold" || status === "stopped") {
      const text = typeof e.reason_text === "string" && e.reason_text.trim() ? e.reason_text.trim() : undefined;
      const code = status === "stopped" && STOP_REASONS.has(e.stop_reason) ? (e.stop_reason as string) : undefined;
      if (text || code) {
        mr.statusReason = {};
        if (code) mr.statusReason.coding = [{ system: "urn:folio:stop-reason", code }];
        if (text) mr.statusReason.text = text;
      }
    }

    if (!outside) {
      // Prescriber: the clinician who entered the line's current state; fall back to earlier events, then the practice.
      let name: string | undefined;
      for (let i = ln.events.length - 1; i >= 0 && !name; i--) {
        const a = ln.events[i].item.author;
        if (a && typeof a.name === "string" && a.name.trim()) name = a.name.trim();
      }
      mr.requester = { display: name ?? ORG_NAME };
    }

    if (authoredOn) mr.authoredOn = authoredOn;

    const dose = mapDose(e.dose, drugName);
    const freq = mapFrequency(e.frequency, e.sig);
    const sig = typeof e.sig === "string" && e.sig.trim() ? e.sig : undefined;
    if (dose || freq || sig) {
      const di: NonNullable<MedicationRequest["dosageInstruction"]>[number] = {};
      if (sig) di.text = sig;
      if (freq) di.timing = { code: { text: freq } };
      if (dose) {
        di.doseAndRate = [{ doseQuantity: { value: dose.value, unit: dose.unit, system: "http://unitsofmeasure.org", code: DOSE_UCUM[dose.unit] } }];
      }
      mr.dosageInstruction = [di];
    }
    out.push(mr);
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

const NFM_CODES: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", CREA: "creatinine",
  EGFR: "egfr", "EGFR-NAA": "egfr", "EGFR-AA": "egfr", "EGFR-21": "egfr", "EGFR21": "egfr", "EGFR-2021": "egfr",
  "EGFR-09": "egfr", "EGFR-CKDEPI": "egfr", "EGFR-CKD21": "egfr", "EGFR-RF": "egfr", "EGFR-MDRD": "egfr",
  K: "potassium", NA: "sodium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate", TCO2: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", "ANION-GAP": "anion_gap", BUN: "bun", GLU: "glucose", GLUC: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", MALBCR: "uacr", "MALB-CR": "uacr", ACR: "uacr", PLT: "platelets",
  WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", PH: "ph", VPH: "ph", PCO2: "pco2", VPCO2: "pco2",
  LIPASE: "lipase", LIP: "lipase", TROPI: "troponin", "TROP-I": "troponin", TNI: "troponin", TROP: "troponin",
  CHOL: "cholesterol", TCHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl",
  "LDL-C": "ldl", LDLC: "ldl", "LDL-CALC": "ldl", "LDL-D": "ldl",
};

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "50044-7": "egfr",
  "88293-6": "egfr", "88294-4": "egfr", "77147-7": "egfr", "69405-9": "egfr", "50210-4": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride",
  "2069-3": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap", "3094-0": "bun", "6299-2": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "17856-6": "a1c", "9318-7": "uacr", "14959-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin",
  "53060-9": "bhb", "2746-6": "ph", "2744-1": "ph", "11558-4": "ph", "2021-4": "pco2", "2019-8": "pco2",
  "11557-6": "pco2", "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

function analyteByName(name: string): Analyte | undefined {
  const n = name.toLowerCase();
  if (/\burine\b|\bur\b|\bua\b/.test(n) && !/albumin|microalb|uacr|\bacr\b/.test(n)) return undefined;
  if (/\b(poc|meter|fingerstick|point of care)\b/.test(n)) return undefined;
  if (/albumin\s*\/\s*creatinine|albumin.?creatinine|microalb|\buacr\b|\bacr\b/.test(n)) return "uacr";
  if (/egfr|glomerular filtration/.test(n)) return "egfr";
  if (/ratio|clearance/.test(n)) return undefined;
  if (/creatinine/.test(n)) return "creatinine";
  if (/a1c|glycated|glycohemoglobin/.test(n)) return "a1c";
  if (/hydroxybutyrate|\bbhb\b/.test(n)) return "bhb";
  if (/anion gap/.test(n)) return "anion_gap";
  if (/pco2|partial pressure.*carbon dioxide/.test(n)) return "pco2";
  if (/bicarbonate|\bhco3\b|total co2|co2, total|carbon dioxide|\bco2\b/.test(n)) return "bicarbonate";
  if (/potassium/.test(n)) return "potassium";
  if (/sodium/.test(n)) return "sodium";
  if (/chloride/.test(n)) return "chloride";
  if (/urea nitrogen|\bbun\b/.test(n)) return "bun";
  if (/glucose/.test(n)) return "glucose";
  if (/platelet/.test(n)) return "platelets";
  if (/\bwbc\b|white blood cell|leukocyte count|white cell count/.test(n)) return "wbc";
  if (/hemoglobin|\bhgb\b/.test(n)) return "hemoglobin";
  if (/\bph\b/.test(n)) return "ph";
  if (/lipase/.test(n)) return "lipase";
  if (/troponin/.test(n)) return /troponin t\b/.test(n) ? undefined : "troponin";
  if (/non-?hdl/.test(n)) return undefined;
  if (/\bhdl\b|high density/.test(n)) return "hdl";
  if (/\bldl\b|low density/.test(n)) return "ldl";
  if (/triglyceride/.test(n)) return "triglycerides";
  if (/cholesterol/.test(n)) return "cholesterol";
  return undefined;
}

function analyteOf(test: any): Analyte | undefined {
  if (!test || typeof test !== "object") return undefined;
  const code = typeof test.nfm_code === "string" ? test.nfm_code.trim().toUpperCase() : "";
  if (code && NFM_CODES[code]) return NFM_CODES[code];
  if (code.startsWith("EGFR")) return "egfr";
  const loinc = typeof test.loinc === "string" ? test.loinc.trim() : "";
  if (loinc && LOINC_ANALYTE[loinc]) return LOINC_ANALYTE[loinc];
  if (typeof test.name === "string") return analyteByName(test.name);
  return undefined;
}

function normUnit(u: string): string {
  return u.toLowerCase().replace(/\s+/g, "").replace(/µ|μ/g, "u").replace(/meq/g, "mmol");
}

/** Converts a filed value into the analyte's unit; undefined when the unit is not understood. */
function convert(analyte: Analyte, value: number, unitRaw: string): number | undefined {
  const u = normUnit(unitRaw);
  const r = (x: number) => Math.round(x * 1e6) / 1e6;
  switch (analyte) {
    case "creatinine":
      if (u === "mg/dl") return value;
      if (u === "umol/l") return r(value / 88.42);
      return undefined;
    case "egfr":
      if (/^ml\/min(\/1\.73(m2|m\^2|sqm|\{?_?m2\}?|m²)?)?$/.test(u.replace(/[{}_]/g, "")) || /^ml\/min\/\{?1\.73_?m2\}?$/.test(u)) return value;
      return undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      return u === "mmol/l" ? value : undefined;
    case "bun": case "cholesterol": case "triglycerides": case "hdl": case "ldl":
      return u === "mg/dl" ? value : undefined;
    case "glucose":
      if (u === "mg/dl") return value;
      return undefined;
    case "a1c":
      return u === "%" || u === "%hba1c" || u === "%ofhgb" || u === "%{hba1c}" ? value : undefined;
    case "uacr":
      return u === "mg/g" || u === "mg/gcreat" || u === "mg/g{creat}" || u === "ug/mg" || u === "ug/mgcreat" || u === "mg/gcr" ? value : undefined;
    case "platelets": case "wbc":
      if (u === "cells/ul" || u === "/ul" || u === "cells/mm3" || u === "/mm3") return r(value / 1000);
      if (["k/ul", "10*3/ul", "x10e3/ul", "10^3/ul", "x10^3/ul", "thou/ul", "10e3/ul", "x10*3/ul"].includes(u)) return value;
      if (u === "10*9/l" || u === "x10e9/l" || u === "10^9/l" || u === "x10^9/l") return value;
      return undefined;
    case "hemoglobin":
      if (u === "g/dl") return value;
      if (u === "g/l") return r(value / 10);
      return undefined;
    case "ph":
      return u === "" || u === "[ph]" || u === "ph" || u === "units" ? value : undefined;
    case "pco2":
      return u === "mmhg" || u === "mm[hg]" ? value : undefined;
    case "lipase":
      return u === "u/l" || u === "iu/l" ? value : undefined;
    case "troponin":
      if (u === "ng/ml") return value;
      if (u === "ng/l" || u === "pg/ml") return r(value / 1000);
      return undefined;
  }
}

function parseValue(raw: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  if (typeof raw === "number") return isFinite(raw) ? { value: raw } : undefined;
  if (typeof raw !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>)?\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(raw);
  if (!m) return undefined;
  const v = Number(m[2]);
  if (!isFinite(v)) return undefined;
  return m[1] ? { value: v, comparator: m[1] as "<" | ">" | "<=" | ">=" } : { value: v };
}

type Eq = "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | "unknown";

function egfrEquation(e: any): Eq {
  const comment = typeof e.comment === "string" ? e.comment : "";
  const name = typeof e.test?.name === "string" ? e.test.name : "";
  const rc = String(e.external_ref?.result_code ?? "").toUpperCase();
  const code = String(e.test?.nfm_code ?? "").toUpperCase();
  const loinc = String(e.test?.loinc ?? "");
  const fromCode = (): Eq | undefined => {
    if (/EGFR.?(21|2021)/.test(rc) || /EGFR.?(21|2021)/.test(code)) return "ckd-epi-2021";
    if (/EGFR.?(09|2009)/.test(rc) || /EGFR.?(09|2009)/.test(code)) return "ckd-epi-2009";
    if (/MDRD/.test(rc) || /MDRD/.test(code)) return "mdrd";
    return undefined;
  };
  // Method note wins.
  for (const text of [comment, name]) {
    if (/CKD[-\s]?EPI[^.;]*?2021|2021[^.;]*?CKD[-\s]?EPI|race[-\s]?free/i.test(text)) return "ckd-epi-2021";
    if (/CKD[-\s]?EPI[^.;]*?2009|2009[^.;]*?CKD[-\s]?EPI/i.test(text)) return "ckd-epi-2009";
    if (/MDRD|modification of diet/i.test(text)) return "mdrd";
    if (/CKD[-\s]?EPI/i.test(text)) {
      const c = fromCode();
      if (c === "ckd-epi-2021" || c === "ckd-epi-2009") return c;
      if (loinc === "98979-8") return "ckd-epi-2021";
      if (/African|race/i.test(comment + " " + name)) return "ckd-epi-2009";
      return "unknown";
    }
  }
  const c = fromCode();
  if (c) return c;
  if (loinc === "98979-8") return "ckd-epi-2021";
  if (loinc === "88293-6" || loinc === "88294-4") return "ckd-epi-2009";
  if (loinc === "48642-3" || loinc === "48643-1" || loinc === "33914-3") return "mdrd";
  return "unknown";
}

/** True for the race-coefficient ("African American") variant of an eGFR. */
function isRaceVariant(e: any): boolean {
  const name = String(e.test?.name ?? "");
  const code = String(e.test?.nfm_code ?? "").toUpperCase();
  const rc = String(e.external_ref?.result_code ?? "").toUpperCase();
  const loinc = String(e.test?.loinc ?? "");
  if (/non[-\s]?(african|black)/i.test(name) || code === "EGFR-NAA" || /NAA$/.test(code)) return false;
  if (/african|black/i.test(name)) return true;
  if (code === "EGFR-AA" || /-AA$/.test(code)) return true;
  if (/^LK-EGFR\d{2}A$/.test(rc)) return true;
  if (loinc === "48643-1" || loinc === "88294-4") return true;
  return false;
}

const STATUS_RANK: Record<string, number> = { P: 1, F: 2, C: 3 };

function buildObservations(items: FolioItem[]): Observation[] {
  interface Cand { en: Entry; analyte: Analyte; key: string; accession: string }
  const groups = new Map<string, Cand[]>();
  for (const en of entriesOf(items, "imported_result")) {
    const e = en.e;
    const analyte = analyteOf(e.test);
    if (!analyte) continue;
    const accession = String(e.external_ref?.accession ?? "") || "item-" + en.item.id;
    const comp = String(e.external_ref?.result_code ?? "") || String(e.test?.nfm_code ?? "") || en.entryId;
    const key = accession + "\u0000" + comp;
    const arr = groups.get(key) ?? [];
    arr.push({ en, analyte, key, accession });
    groups.set(key, arr);
  }

  // One copy per result: the most advanced status, then the latest filed.
  const best: Cand[] = [];
  for (const arr of groups.values()) {
    arr.sort((a, b) => {
      const sa = STATUS_RANK[a.en.e.result_status] ?? 0, sb = STATUS_RANK[b.en.e.result_status] ?? 0;
      if (sa !== sb) return sa - sb;
      const ra = instant(a.en.item.recorded) ?? 0, rb = instant(b.en.item.recorded) ?? 0;
      if (ra !== rb) return ra - rb;
      return a.en.item.id < b.en.item.id ? -1 : a.en.item.id > b.en.item.id ? 1 : 0;
    });
    best.push(arr[arr.length - 1]);
  }

  interface Row { c: Cand; value: number; comparator?: "<" | ">" | "<=" | ">="; eq?: Eq }
  const rows: Row[] = [];
  for (const c of best) {
    const e = c.en.e;
    if (!(e.result_status in STATUS_RANK)) continue;
    const pv = parseValue(e.value);
    if (!pv) continue; // withdrawn / invalidated / words
    const v = convert(c.analyte, pv.value, typeof e.unit === "string" ? e.unit : "");
    if (v === undefined) continue;
    rows.push({ c, value: v, comparator: pv.comparator, eq: c.analyte === "egfr" ? egfrEquation(e) : undefined });
  }

  // eGFR rule: drop race-coefficient variants when a race-free variant of the same specimen is reported.
  const kept = rows.filter((r) => {
    if (r.c.analyte !== "egfr" || !isRaceVariant(r.c.en.e)) return true;
    const collected = String(r.c.en.e.collected ?? r.c.en.item.effective);
    return !rows.some((o) => o !== r && o.c.analyte === "egfr" && !isRaceVariant(o.c.en.e) &&
      (o.c.accession === r.c.accession || String(o.c.en.e.collected ?? o.c.en.item.effective) === collected) &&
      (o.eq === r.eq || o.eq === "unknown" || r.eq === "unknown"));
  });

  kept.sort((a, b) => {
    const ta = instant(a.c.en.e.collected ?? a.c.en.item.effective) ?? 0, tb = instant(b.c.en.e.collected ?? b.c.en.item.effective) ?? 0;
    if (ta !== tb) return ta - tb;
    return a.c.key < b.c.key ? -1 : a.c.key > b.c.key ? 1 : 0;
  });

  const used = new Set<string>();
  const out: Observation[] = [];
  for (const r of kept) {
    const e = r.c.en.e;
    const item = r.c.en.item;
    const sourceLoinc = typeof e.test?.loinc === "string" && e.test.loinc.trim() ? e.test.loinc.trim() : undefined;
    let loinc = sourceLoinc ?? DEFAULT_LOINC[r.c.analyte];
    if (!sourceLoinc && r.c.analyte === "egfr") {
      if (r.eq === "ckd-epi-2009") loinc = "62238-1";
      else if (r.eq === "mdrd") loinc = "33914-3";
    }
    const codings: Coding[] = [{ system: "http://loinc.org", code: loinc }];
    const nfm = typeof e.test?.nfm_code === "string" ? e.test.nfm_code : undefined;
    if (nfm) {
      const host = String(item.issuer ?? "").replace(/^did:web:/, "") || "northgate-fm.example";
      const local: Coding = { system: `urn:${host}:test-code`, code: nfm };
      if (typeof e.test?.name === "string") local.display = e.test.name;
      codings.push(local);
    }
    const unit = ANALYTE_UNIT[r.c.analyte];
    const q: Quantity = {
      value: r.value,
      unit,
      system: "http://unitsofmeasure.org",
      code: r.c.analyte === "egfr" ? "mL/min/{1.73_m2}" : unit,
    };
    if (r.comparator) q.comparator = r.comparator;
    const obs: Observation = {
      resourceType: "Observation",
      id: uniqueId(`lab-${r.c.accession}-${nfm ?? r.c.en.entryId}`, used),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab"] },
      status: e.result_status === "P" ? "preliminary" : "final",
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
      code: { coding: codings, text: r.c.analyte },
      subject: { reference: "Patient/" + item.patient },
      effectiveDateTime: String(e.collected ?? item.effective),
      valueQuantity: q,
    };
    if (r.eq) obs.method = { text: r.eq };
    out.push(obs);
  }
  return out;
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const result: UsCoreRows = { medicationRequests: [], observations: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return result;
  let current: FolioItem[];
  try {
    current = currentItems(items, asOf);
  } catch {
    return result;
  }
  try {
    result.medicationRequests = buildMedications(current);
  } catch {
    result.medicationRequests = [];
  }
  try {
    result.observations = buildObservations(current);
  } catch {
    result.observations = [];
  }
  return result;
}
