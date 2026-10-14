// Northgate Family Medicine chart event log (northgate-chart-v1) -> US Core MedicationRequest / lab Observation.
import type { FolioItem, UsCoreRows, MedicationRequest, Observation, Quantity, Coding, CodeableConcept } from "../in/views/uscore";

const TZ = "America/Chicago";
const RXNORM = "http://www.nlm.nih.gov/research/umls/rxnorm";
const LOINC = "http://loinc.org";
const UCUM = "http://unitsofmeasure.org" as const;

// ───────────────────────────── time helpers ─────────────────────────────

const DATE_ONLY = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

let fmt: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number): { date: string; time: string } | null {
  try {
    if (!fmt) {
      fmt = new Intl.DateTimeFormat("en-CA", {
        timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      });
    }
    const p: Record<string, string> = {};
    for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = part.value;
    if (!p.year || !p.month || !p.day) return null;
    return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour ?? "00"}:${p.minute ?? "00"}` };
  } catch {
    return null;
  }
}

/** Local (Chicago) date of a date or date-time string, keeping the precision of a date-only value. */
function localDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  if (DATE_ONLY.test(s)) return s;
  if (!DATE_TIME.test(s)) return undefined;
  const ms = Date.parse(s);
  if (!Number.isFinite(ms)) return undefined;
  return chicagoParts(ms)?.date;
}

function instant(s: unknown): number | undefined {
  if (typeof s !== "string" || !DATE_TIME.test(s)) return undefined;
  const ms = Date.parse(s);
  return Number.isFinite(ms) ? ms : undefined;
}

/** Order two events by effective time (local date first; instant only when both carry a time), then recorded. */
function compareEvents(a: Ev, b: Ev): number {
  const da = localDate(a.item.effective) ?? "";
  const db = localDate(b.item.effective) ?? "";
  if (da !== db) return da < db ? -1 : 1;
  const ia = instant(a.item.effective);
  const ib = instant(b.item.effective);
  if (ia !== undefined && ib !== undefined && ia !== ib) return ia - ib;
  const ra = instant(a.item.recorded) ?? 0;
  const rb = instant(b.item.recorded) ?? 0;
  if (ra !== rb) return ra - rb;
  if (a.item.id !== b.item.id) return a.item.id < b.item.id ? -1 : 1;
  return a.entryId < b.entryId ? -1 : a.entryId > b.entryId ? 1 : 0;
}

// ───────────────────────────── scope and corrections ─────────────────────────────

function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inScope: FolioItem[] = [];
  for (const it of Array.isArray(items) ? items : []) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const rec = instant(it.recorded);
    if (rec === undefined) continue;
    const d = chicagoParts(rec)?.date;
    if (!d || d > asOf) continue;
    inScope.push(it);
  }
  // An item listed in any in-scope item's supersedes/retracts (same issuer) is not current.
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const list of [it.supersedes, it.retracts]) {
      if (!Array.isArray(list)) continue;
      for (const id of list) if (typeof id === "string") dead.add(`${it.issuer}\u0000${id}`);
    }
    // A chart_correction's voided_items always equal the envelope's retracts; honour either.
    for (const e of Object.values(it.payload ?? {})) {
      if (e && e.type === "chart_correction" && Array.isArray(e.voided_items)) {
        for (const id of e.voided_items) if (typeof id === "string") dead.add(`${it.issuer}\u0000${id}`);
      }
    }
  }
  return inScope.filter((it) => !dead.has(`${it.issuer}\u0000${it.id}`));
}

interface Ev { item: FolioItem; entryId: string; e: any }

function entriesOfType(items: FolioItem[], type: string): Ev[] {
  const out: Ev[] = [];
  for (const item of items) {
    const payload = item.payload;
    if (!payload || typeof payload !== "object") continue;
    for (const [entryId, e] of Object.entries(payload)) {
      if (e && typeof e === "object" && e.type === type) out.push({ item, entryId, e });
    }
  }
  return out;
}

function safeId(s: string): string {
  const id = s.replace(/[^A-Za-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "");
  return id.length > 64 ? id.slice(0, 64) : id;
}

function uniqueId(base: string, used: Set<string>): string {
  let id = safeId(base) || "x";
  if (!used.has(id)) { used.add(id); return id; }
  for (let n = 2; ; n++) {
    const suffix = `-${n}`;
    const cand = id.slice(0, 64 - suffix.length) + suffix;
    if (!used.has(cand)) { used.add(cand); return cand; }
  }
}

function patientRef(items: FolioItem[]): string {
  for (const it of items) if (typeof it.patient === "string" && it.patient) return `Patient/${it.patient}`;
  return "Patient/unknown";
}

// ───────────────────────────── medications ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  lyumjev: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  byetta: "exenatide", bydureon: "exenatide", januvia: "sitagliptin", tradjenta: "linagliptin",
  onglyza: "saxagliptin", nesina: "alogliptin", glucophage: "metformin", glumetza: "metformin",
  fortamet: "metformin", glucotrol: "glipizide", amaryl: "glimepiride", micronase: "glyburide",
  diabeta: "glyburide", actos: "pioglitazone", kerendia: "finerenone",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan",
  atacand: "candesartan", zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril",
  altace: "ramipril", lotensin: "benazepril", entresto: "sacubitril / valsartan",
  norvasc: "amlodipine", procardia: "nifedipine", cardizem: "diltiazem", calan: "verapamil",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide",
  aldactone: "spironolactone", inspra: "eplerenone", coreg: "carvedilol", toprol: "metoprolol",
  "toprol-xl": "metoprolol", lopressor: "metoprolol", tenormin: "atenolol", lipitor: "atorvastatin",
  crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin", zetia: "ezetimibe",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", plavix: "clopidogrel", zoloft: "sertraline", lexapro: "escitalopram",
  celexa: "citalopram", prozac: "fluoxetine", paxil: "paroxetine", wellbutrin: "bupropion",
  cymbalta: "duloxetine", effexor: "venlafaxine", buspar: "buspirone", desyrel: "trazodone",
  neurontin: "gabapentin", lyrica: "pregabalin", prilosec: "omeprazole", nexium: "esomeprazole",
  protonix: "pantoprazole", zyloprim: "allopurinol", uloric: "febuxostat", flomax: "tamsulosin",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  "k-dur": "potassium chloride", "klor-con": "potassium chloride", veltassa: "patiromer",
  lokelma: "sodium zirconium cyclosilicate", renvela: "sevelamer",
};

// Salt / ester words that are not part of the ingredient name.
const SALTS = new Set([
  "potassium", "sodium", "calcium", "magnesium", "hydrochloride", "hcl", "dihydrochloride", "besylate",
  "maleate", "succinate", "tartrate", "mesylate", "fumarate", "citrate", "sulfate", "phosphate",
  "acetate", "bromide", "hyclate", "monohydrate", "dihydrate", "trihydrate", "propionate", "medoxomil",
  "cilexetil", "bitartrate", "hydrobromide", "malate", "disodium", "lactate", "gluconate", "xr", "er",
  "sr", "xl", "dr", "cr", "la",
]);

const FORM_WORDS = /\b(oral|tablet|tablets|tab|tabs|capsule|capsules|cap|caps|injection|injectable|solution|suspension|pen|injector|prefilled|syringe|extended|release|delayed|chewable|disintegrating|film|coated|cream|ointment|patch|inhaler|powder|kit|topical|transdermal|ml|mg|mcg|unt|units|unit)\b/;

function ingredientFromName(raw: string): string | undefined {
  let name = raw.trim();
  if (!name) return undefined;
  // "empagliflozin 10 MG Oral Tablet [Jardiance]": generic part precedes the bracket.
  name = name.replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ").trim();
  // Drop everything from the first token that starts with a digit (strength) or a dose-form word.
  const toks = name.split(/\s+/);
  const kept: string[] = [];
  for (const t of toks) {
    const lt = t.toLowerCase();
    if (/^\d/.test(lt) || /^\d*\.?\d+(mg|mcg|ml|units?|%)/.test(lt) || FORM_WORDS.test(lt)) break;
    kept.push(lt.replace(/[(),;]+/g, ""));
  }
  let words = kept.filter((w) => w.length > 0);
  if (words.length === 0) return undefined;
  const joined = words.join(" ");
  const brand = BRANDS[joined] ?? BRANDS[words[0]];
  if (brand !== undefined) return brand || undefined;
  // Strip salt words, but keep a name that is entirely "salt" words (e.g. "potassium chloride").
  const stripped = words.filter((w) => !SALTS.has(w));
  if (stripped.length > 0 && !(stripped.length === 1 && stripped[0] === "chloride")) words = stripped;
  const out = words.join(" ").replace(/\s*\/\s*/g, " / ").trim();
  return out || undefined;
}

const DOSE_UNITS: Record<string, { app: "mg" | "mcg" | "units" | "mL" | "tablet"; ucum: string }> = {
  mg: { app: "mg", ucum: "mg" },
  mcg: { app: "mcg", ucum: "ug" }, ug: { app: "mcg", ucum: "ug" }, "µg": { app: "mcg", ucum: "ug" },
  units: { app: "units", ucum: "[iU]" }, unit: { app: "units", ucum: "[iU]" }, unt: { app: "units", ucum: "[iU]" },
  "[iu]": { app: "units", ucum: "[iU]" }, iu: { app: "units", ucum: "[iU]" }, u: { app: "units", ucum: "[iU]" },
  ml: { app: "mL", ucum: "mL" },
  tab: { app: "tablet", ucum: "{tbl}" }, tabs: { app: "tablet", ucum: "{tbl}" }, tablet: { app: "tablet", ucum: "{tbl}" },
  tablets: { app: "tablet", ucum: "{tbl}" }, "{tbl}": { app: "tablet", ucum: "{tbl}" },
};

const FREQ: Record<string, "QD" | "BID" | "TID" | "QHS" | "PRN" | "other"> = {
  QD: "QD", BID: "BID", TID: "TID", QHS: "QHS", PRN: "PRN", OTHER: "other",
};

const STOP_REASONS = new Set(["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"]);

interface MedLine {
  medId: string;
  events: Ev[];
  last: Ev;
  ingredient?: string;
}

function mapMedications(items: FolioItem[], subject: string): MedicationRequest[] {
  const byLine = new Map<string, Ev[]>();
  for (const ev of entriesOfType(items, "med_event")) {
    const e = ev.e;
    if (typeof e.med_id !== "string" || !e.med_id) continue;
    if (!["start", "change", "hold", "resume", "stop"].includes(e.action)) continue;
    if (!e.drug || typeof e.drug.name !== "string") continue;
    const list = byLine.get(e.med_id) ?? [];
    list.push(ev);
    byLine.set(e.med_id, list);
  }

  const lines: MedLine[] = [];
  for (const [medId, events] of byLine) {
    events.sort(compareEvents);
    const last = events[events.length - 1];
    // The ingredient comes from the latest event's drug name, falling back to earlier events.
    let ingredient: string | undefined;
    for (let i = events.length - 1; i >= 0 && !ingredient; i--) ingredient = ingredientFromName(events[i].e.drug.name);
    lines.push({ medId, events, last, ingredient });
  }

  // One row per ingredient: the line whose own latest event is latest.
  const byIngredient = new Map<string, MedLine>();
  for (const line of lines) {
    const key = line.ingredient ? `ing:${line.ingredient}` : `line:${line.medId}`;
    const prev = byIngredient.get(key);
    if (!prev || compareEvents(prev.last, line.last) < 0) byIngredient.set(key, line);
  }

  const chosen = [...byIngredient.values()].sort((a, b) => (a.medId < b.medId ? -1 : a.medId > b.medId ? 1 : 0));
  const used = new Set<string>();
  const out: MedicationRequest[] = [];
  for (const line of chosen) {
    const { events, last } = line;
    const e = last.e;
    const action: string = e.action;
    const status: MedicationRequest["status"] =
      action === "hold" ? "on-hold" : action === "stop" ? "stopped" : "active";

    // When did the current status begin?
    let since: string | undefined;
    if (status === "active") {
      // The latest start or resume of this line.
      for (let i = events.length - 1; i >= 0; i--) {
        const a = events[i].e.action;
        if (a === "start" || a === "resume") { since = localDate(events[i].item.effective); break; }
      }
    } else if (status === "on-hold") {
      // First hold of the current run of holds (since the last start/resume).
      let idx = events.length - 1;
      for (let i = events.length - 1; i >= 0; i--) {
        const a = events[i].e.action;
        if (a === "hold") idx = i;
        else if (a === "start" || a === "resume") break;
      }
      since = localDate(events[idx].item.effective);
    } else {
      since = localDate(last.item.effective);
    }
    let lineBegan: string | undefined;
    const startEv = events.find((x) => x.e.action === "start");
    if (startEv) lineBegan = localDate(startEv.item.effective);
    const authoredOn = status === "active" ? since ?? lineBegan : lineBegan;

    const drug = e.drug;
    const name: string = drug.name;
    const rxnorm = typeof drug.rxnorm === "string" && drug.rxnorm.trim() ? drug.rxnorm.trim() : undefined;
    const medication: CodeableConcept = rxnorm
      ? { coding: [{ system: RXNORM, code: rxnorm }], text: name }
      : { text: line.ingredient ? `${name} (${line.ingredient})` : name };

    const outside = e.origin === "outside";
    const mr: MedicationRequest = {
      resourceType: "MedicationRequest",
      id: uniqueId(`med-${line.medId}`, used),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
      status,
      intent: outside ? "plan" : "order",
      reportedBoolean: outside,
      medicationCodeableConcept: medication,
      subject: { reference: subject },
    };

    if (status === "on-hold" || status === "stopped") {
      const reasonText = typeof e.reason_text === "string" && e.reason_text.trim() ? e.reason_text.trim() : undefined;
      const code = status === "stopped" && STOP_REASONS.has(e.stop_reason) ? (e.stop_reason as string) : undefined;
      if (reasonText || code) {
        const cc: CodeableConcept = {};
        if (code) cc.coding = [{ system: "urn:folio:stop-reason", code }];
        if (reasonText) cc.text = reasonText;
        mr.statusReason = [cc];
      }
    }
    if (authoredOn) mr.authoredOn = authoredOn;

    const dosage: NonNullable<MedicationRequest["dosageInstruction"]>[number] = {};
    if (typeof e.sig === "string" && e.sig.trim()) dosage.text = e.sig;
    const freq = typeof e.frequency === "string" ? FREQ[e.frequency] : undefined;
    if (freq) dosage.timing = { code: { text: freq } };
    if (e.dose && typeof e.dose.value === "number" && Number.isFinite(e.dose.value) && typeof e.dose.unit === "string") {
      const u = DOSE_UNITS[e.dose.unit.trim().toLowerCase()];
      if (u) dosage.doseAndRate = [{ doseQuantity: { value: e.dose.value, unit: u.app, system: UCUM, code: u.ucum } }];
    }
    if (dosage.text || dosage.timing || dosage.doseAndRate) mr.dosageInstruction = [dosage];

    out.push(mr);
  }
  return out;
}

// ───────────────────────────── labs ─────────────────────────────

type Analyte =
  | "creatinine" | "egfr" | "potassium" | "sodium" | "chloride" | "bicarbonate" | "anion_gap" | "bun"
  | "glucose" | "a1c" | "uacr" | "platelets" | "wbc" | "hemoglobin" | "bhb" | "ph" | "pco2" | "lipase"
  | "troponin" | "cholesterol" | "triglycerides" | "hdl" | "ldl";

const ANALYTE_UNIT: Record<Analyte, { unit: string; ucum: string; loinc: string }> = {
  creatinine: { unit: "mg/dL", ucum: "mg/dL", loinc: "2160-0" },
  egfr: { unit: "mL/min/1.73m2", ucum: "mL/min/{1.73_m2}", loinc: "98979-8" },
  potassium: { unit: "mmol/L", ucum: "mmol/L", loinc: "2823-3" },
  sodium: { unit: "mmol/L", ucum: "mmol/L", loinc: "2951-2" },
  chloride: { unit: "mmol/L", ucum: "mmol/L", loinc: "2075-0" },
  bicarbonate: { unit: "mmol/L", ucum: "mmol/L", loinc: "2028-9" },
  anion_gap: { unit: "mmol/L", ucum: "mmol/L", loinc: "33037-3" },
  bun: { unit: "mg/dL", ucum: "mg/dL", loinc: "3094-0" },
  glucose: { unit: "mg/dL", ucum: "mg/dL", loinc: "2345-7" },
  a1c: { unit: "%", ucum: "%", loinc: "4548-4" },
  uacr: { unit: "mg/g", ucum: "mg/g", loinc: "9318-7" },
  platelets: { unit: "10*3/uL", ucum: "10*3/uL", loinc: "777-3" },
  wbc: { unit: "10*3/uL", ucum: "10*3/uL", loinc: "6690-2" },
  hemoglobin: { unit: "g/dL", ucum: "g/dL", loinc: "718-7" },
  bhb: { unit: "mmol/L", ucum: "mmol/L", loinc: "53060-9" },
  ph: { unit: "[pH]", ucum: "[pH]", loinc: "2746-6" },
  pco2: { unit: "mmHg", ucum: "mm[Hg]", loinc: "2021-4" },
  lipase: { unit: "U/L", ucum: "U/L", loinc: "3040-3" },
  troponin: { unit: "ng/mL", ucum: "ng/mL", loinc: "10839-9" },
  cholesterol: { unit: "mg/dL", ucum: "mg/dL", loinc: "2093-3" },
  triglycerides: { unit: "mg/dL", ucum: "mg/dL", loinc: "2571-8" },
  hdl: { unit: "mg/dL", ucum: "mg/dL", loinc: "2085-9" },
  ldl: { unit: "mg/dL", ucum: "mg/dL", loinc: "13457-7" },
};

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "98979-8": "egfr", "62238-1": "egfr", "88293-6": "egfr", "88294-4": "egfr", "33914-3": "egfr",
  "48642-3": "egfr", "48643-1": "egfr", "50044-7": "egfr", "50210-4": "egfr", "69405-9": "egfr", "77147-7": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2069-3": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate",
  "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin",
  "53060-9": "bhb", "2746-6": "ph", "2744-1": "ph", "11558-4": "ph", "2021-4": "pco2", "2019-8": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

// LOINC codes for race-specific (race coefficient applied) eGFR variants.
const LOINC_EGFR_RACE = new Set(["48643-1", "88293-6"]);

// LOINC codes with an implied eGFR equation.
const LOINC_EGFR_EQ: Record<string, "ckd-epi-2021" | "ckd-epi-2009" | "mdrd"> = {
  "98979-8": "ckd-epi-2021", "62238-1": "ckd-epi-2009", "88293-6": "ckd-epi-2009", "88294-4": "ckd-epi-2009",
  "33914-3": "mdrd", "48642-3": "mdrd", "48643-1": "mdrd",
};

function analyteFromText(code: string, name: string): Analyte | undefined {
  const c = code.toUpperCase();
  const n = name.toLowerCase();
  const urine = /\burine\b|\bur\b|\bu-/.test(n);
  if (/EGFR|GFR/.test(c) || /\begfr\b|glomerular filtration/.test(n)) return "egfr";
  if (/albumin.*creat|alb\/creat|\bacr\b|\buacr\b|microalb/.test(n) || /UACR|MALB|ACR/.test(c)) return "uacr";
  if (/a1c|glycated|glycosylated/.test(n) || /A1C/.test(c)) return "a1c";
  if (/hydroxybut/.test(n) || /BHB/.test(c)) return "bhb";
  if (/anion gap/.test(n) || /^(AG|AGAP|ANION)/.test(c)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(n) || c === "BUN") return "bun";
  if (/creatinine/.test(n) || c === "CREAT" || c === "CR") return urine ? undefined : "creatinine";
  if (/potassium/.test(n) || c === "K") return urine ? undefined : "potassium";
  if (/sodium/.test(n) || c === "NA") return urine ? undefined : "sodium";
  if (/chloride/.test(n) || c === "CL") return urine ? undefined : "chloride";
  if (/bicarbonate|carbon dioxide|\bco2\b|\btco2\b/.test(n) && !/pco2|partial/.test(n)) return "bicarbonate";
  if (c === "CO2" || c === "HCO3" || c === "TCO2") return "bicarbonate";
  if (/pco2|partial pressure.*carbon/.test(n) || c === "PCO2") return "pco2";
  if (/\bph\b/.test(n) || c === "PH") return urine ? undefined : "ph";
  if (/glucose/.test(n) || c === "GLU" || c === "GLUC") {
    if (urine || /meter|point of care|\bpoc\b|fingerstick|capillary/.test(n)) return undefined;
    return "glucose";
  }
  if (/platelet/.test(n) || c === "PLT") return "platelets";
  if (/white blood|leukocyte|\bwbc\b/.test(n) || c === "WBC") return urine ? undefined : "wbc";
  if (/hemoglobin|haemoglobin|\bhgb\b/.test(n) || c === "HGB" || c === "HB") return urine ? undefined : "hemoglobin";
  if (/lipase/.test(n) || c === "LIPASE" || c === "LIP") return "lipase";
  if (/troponin/.test(n) || /TROP|TNI/.test(c)) return /troponin t|TNT/i.test(n + " " + c) ? undefined : "troponin";
  if (/\bhdl\b/.test(n) || c === "HDL") return "hdl";
  if (/\bldl\b/.test(n) || /^LDL/.test(c)) return "ldl";
  if (/triglycer/.test(n) || c === "TRIG" || c === "TG") return "triglycerides";
  if (/cholesterol/.test(n) || c === "CHOL") return "cholesterol";
  return undefined;
}

function normUnit(u: string): string {
  return u.trim().toLowerCase().replace(/\s+/g, "").replace(/µ|μ/g, "u");
}

/** Convert a filed value to the analyte's unit; undefined when the filed unit is not understood. */
function convert(analyte: Analyte, value: number, rawUnit: string): number | undefined {
  const u = normUnit(rawUnit);
  switch (analyte) {
    case "creatinine": case "bun": case "glucose": case "cholesterol": case "triglycerides": case "hdl": case "ldl":
      if (u === "mg/dl") return value;
      return undefined;
    case "egfr":
      if (["ml/min/1.73m2", "ml/min/1.73m^2", "ml/min/1.73", "ml/min/{1.73_m2}", "ml/min/1.73sqm", "ml/min/1.73m²"].includes(u)) return value;
      return undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      if (u === "mmol/l" || u === "meq/l") return value;
      return undefined;
    case "bhb":
      if (u === "mmol/l") return value;
      return undefined;
    case "a1c":
      if (u === "%" || u === "%hba1c" || u === "%ngsp") return value;
      return undefined;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "mg/gcr" || u === "ug/mg" || u === "mcg/mg" || u === "mg/g{creat}") return value;
      return undefined;
    case "platelets": case "wbc":
      if (u === "cells/ul" || u === "/ul" || u === "cells/mm3" || u === "/mm3") return value / 1000;
      if (u === "k/ul" || u === "10*3/ul" || u === "x10e3/ul" || u === "10^3/ul" || u === "x10^3/ul" || u === "thou/ul" || u === "10*9/l" || u === "x10e9/l" || u === "10^9/l") return value;
      return undefined;
    case "hemoglobin":
      if (u === "g/dl") return value;
      if (u === "g/l") return value / 10;
      return undefined;
    case "ph":
      if (u === "" || u === "[ph]" || u === "ph" || u === "units") return value;
      return undefined;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return value;
      return undefined;
    case "lipase":
      if (u === "u/l" || u === "iu/l") return value;
      return undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return value;
      if (u === "ng/l" || u === "pg/ml") return value / 1000;
      return undefined;
  }
  return undefined;
}

function tidy(n: number): number {
  return Number.parseFloat(n.toPrecision(12));
}

function parseValue(v: unknown): { value: number; comparator?: "<" | ">" | "<=" | ">=" } | undefined {
  if (typeof v === "number") return Number.isFinite(v) ? { value: v } : undefined;
  if (typeof v !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+\.?\d*|\.\d+))\s*$/.exec(v);
  if (!m) return undefined;
  const value = Number.parseFloat(m[2]);
  if (!Number.isFinite(value)) return undefined;
  const c = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : (m[1] as "<" | ">" | "<=" | ">=" | undefined);
  return c ? { value, comparator: c } : { value };
}

function egfrEquation(e: any): "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | "unknown" {
  const fromText = (s: unknown): "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | undefined => {
    if (typeof s !== "string") return undefined;
    const t = s.toLowerCase();
    const epi = /ckd[\s-]*epi/.test(t);
    if (epi && /2021/.test(t)) return "ckd-epi-2021";
    if (epi && /2009/.test(t)) return "ckd-epi-2009";
    if (/mdrd/.test(t)) return "mdrd";
    if (epi && /race[\s-]*free/.test(t)) return "ckd-epi-2021";
    return undefined;
  };
  // The lab's method note wins over codes.
  const note = fromText(e.comment);
  if (note) return note;
  const name = fromText(e.test?.name);
  if (name) return name;
  const rc = typeof e.external_ref?.result_code === "string" ? e.external_ref.result_code.toUpperCase() : "";
  if (/EGFR.*21|EGFR.*2021/.test(rc)) return "ckd-epi-2021";
  if (/EGFR.*09|EGFR.*2009/.test(rc)) return "ckd-epi-2009";
  if (/MDRD/.test(rc)) return "mdrd";
  const loinc = typeof e.test?.loinc === "string" ? LOINC_EGFR_EQ[e.test.loinc] : undefined;
  if (loinc) return loinc;
  return "unknown";
}

/** True for the race-coefficient (African American / Black) variant of an eGFR calculation. */
function isRaceVariant(e: any): boolean {
  const loinc = e.test?.loinc;
  if (typeof loinc === "string" && LOINC_EGFR_RACE.has(loinc)) return true;
  const code = `${e.test?.nfm_code ?? ""} ${e.external_ref?.result_code ?? ""}`.toUpperCase();
  // Lakeview-style codes: "LK-EGFR09N" (non-Black) vs "LK-EGFR09A"/"LK-EGFR09B" (Black).
  const rc = typeof e.external_ref?.result_code === "string" ? e.external_ref.result_code.toUpperCase() : "";
  if (/EGFR\d*(A|B|AA|AFAM)$/.test(rc) && !/EGFR\d*N(AA|B)?$/.test(rc)) return true;
  if (/(^|[^A-Z])(N?AA|AFAM|BLK|BLACK)([^A-Z]|$)/.test(code)) {
    // "NAA" (non-African-American) is the variant without the coefficient.
    if (!/(^|[^A-Z])(NAA|NONAA|NBLK|NONBLACK)([^A-Z]|$)/.test(code)) return true;
    return false;
  }
  const text = `${e.test?.name ?? ""} ${e.comment ?? ""}`.toLowerCase();
  const nonRace = /non[\s-]*(african|black)|race[\s-]*free|without race/.test(text);
  if (!nonRace && /african[\s-]*american|\bblack\b/.test(text)) return true;
  return false;
}

const STATUS_RANK: Record<string, number> = { P: 1, F: 2, C: 3 };

function mapLabs(items: FolioItem[], subject: string, issuer: string): Observation[] {
  // One row per (accession, component): the copy with the most advanced status, latest filed on ties.
  const best = new Map<string, Ev>();
  for (const ev of entriesOfType(items, "imported_result")) {
    const e = ev.e;
    if (!e.test || typeof e.test !== "object") continue;
    const acc = typeof e.external_ref?.accession === "string" ? e.external_ref.accession : "";
    const comp = `${e.test.nfm_code ?? ""}|${e.external_ref?.result_code ?? ""}`;
    const key = acc ? `${acc}\u0000${comp}` : `${ev.item.id}\u0000${ev.entryId}`;
    const prev = best.get(key);
    if (!prev) { best.set(key, ev); continue; }
    const ra = STATUS_RANK[prev.e.result_status] ?? 0;
    const rb = STATUS_RANK[e.result_status] ?? 0;
    if (rb > ra || (rb === ra && (instant(ev.item.recorded) ?? 0) >= (instant(prev.item.recorded) ?? 0))) best.set(key, ev);
  }

  const codeSystem = `urn:${issuer.replace(/^did:web:/, "").replace(/[^A-Za-z0-9.-]+/g, "-") || "northgate"}:nfm-code`;
  const used = new Set<string>();
  const rows: { obs: Observation; sort: string }[] = [];
  for (const ev of best.values()) {
    const e = ev.e;
    const status = e.result_status === "P" ? "preliminary" : e.result_status === "F" || e.result_status === "C" ? "final" : undefined;
    if (!status) continue;
    const loinc = typeof e.test.loinc === "string" && e.test.loinc.trim() ? e.test.loinc.trim() : undefined;
    const nfmCode = typeof e.test.nfm_code === "string" ? e.test.nfm_code : "";
    const testName = typeof e.test.name === "string" ? e.test.name : "";
    const analyte = (loinc ? LOINC_ANALYTE[loinc] : undefined) ?? analyteFromText(nfmCode, testName);
    if (!analyte) continue;
    if (analyte === "creatinine" && /urine/i.test(testName)) continue;
    if (analyte === "egfr" && isRaceVariant(e)) continue;

    const parsed = parseValue(e.value);
    if (!parsed) continue; // withdrawn, invalidated or non-numeric
    const value = convert(analyte, parsed.value, typeof e.unit === "string" ? e.unit : "");
    if (value === undefined) continue;

    const collected = typeof e.collected === "string" && DATE_TIME.test(e.collected) ? e.collected
      : typeof ev.item.effective === "string" && DATE_TIME.test(ev.item.effective) ? ev.item.effective : undefined;
    if (!collected) continue;

    const spec = ANALYTE_UNIT[analyte];
    let equation: "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | "unknown" | undefined;
    let loincCode = loinc;
    if (analyte === "egfr") {
      equation = egfrEquation(e);
      if (!loincCode) loincCode = equation === "ckd-epi-2009" ? "62238-1" : equation === "mdrd" ? "33914-3" : spec.loinc;
    }
    if (!loincCode) loincCode = spec.loinc;

    const coding: Coding[] = [{ system: LOINC, code: loincCode }];
    if (nfmCode) coding.push(testName ? { system: codeSystem, code: nfmCode, display: testName } : { system: codeSystem, code: nfmCode });

    const quantity: Quantity = { value: tidy(value), unit: spec.unit, system: UCUM, code: spec.ucum };
    if (parsed.comparator) quantity.comparator = parsed.comparator;

    const acc = typeof e.external_ref?.accession === "string" ? e.external_ref.accession : ev.item.id;
    const obs: Observation = {
      resourceType: "Observation",
      id: uniqueId(`lab-${acc}-${nfmCode || ev.entryId}`, used),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab"] },
      status,
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
      code: { coding, text: analyte },
      subject: { reference: subject },
      effectiveDateTime: collected,
      valueQuantity: quantity,
    };
    if (equation) obs.method = { text: equation };
    rows.push({ obs, sort: `${String(instant(collected) ?? 0).padStart(16, "0")}|${obs.id}` });
  }
  rows.sort((a, b) => (a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0));
  return rows.map((r) => r.obs);
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  try {
    if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return { medicationRequests: [], observations: [] };
    const current = currentItems(items, asOf);
    const subject = patientRef(current.length ? current : Array.isArray(items) ? items : []);
    const issuer = current.find((i) => typeof i.issuer === "string")?.issuer ?? "northgate-fm.example";
    let medicationRequests: MedicationRequest[] = [];
    let observations: Observation[] = [];
    try { medicationRequests = mapMedications(current, subject); } catch { medicationRequests = []; }
    try { observations = mapLabs(current, subject, issuer); } catch { observations = []; }
    return { medicationRequests, observations };
  } catch {
    return { medicationRequests: [], observations: [] };
  }
}
