import type {
  FolioItem, UsCoreRows, MedicationRequest, Observation, CodeableConcept, Quantity,
} from "../in/views/uscore";
import type { Analyte } from "../in/views/views";

// Payloads are untrusted at runtime, even though the envelope's public type uses `any`.
type ObjectValue = Record<string, unknown>;
function object(value: unknown): ObjectValue | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as ObjectValue : undefined;
}
function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}
function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
function compare(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function key(...parts: string[]): string { return JSON.stringify(parts); }

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function localParts(ms: number): Record<string, string> {
  const parts: Record<string, string> = {};
  for (const part of chicago.formatToParts(new Date(ms))) parts[part.type] = part.value;
  return parts;
}
function localDate(ms: number): string {
  const p = localParts(ms);
  return `${p.year.padStart(4, "0")}-${p.month}-${p.day}`;
}
function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.slice(0, 4) === "0000") return false;
  const ms = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === value;
}
function instant(value: unknown): number | undefined {
  if (typeof value !== "string") return undefined;
  if (!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(value)
    || !validDate(value.slice(0, 10))) return undefined;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : undefined;
}
type ClinicalTime = { order: number; date: string };
function clinicalTime(value: unknown): ClinicalTime | undefined {
  const ms = instant(value);
  if (ms !== undefined) return { order: ms, date: localDate(ms) };
  if (typeof value !== "string" || !/^\d{4}(?:-\d{2})?(?:-\d{2})?$/.test(value)) return undefined;
  const fullDate = value.length === 4 ? `${value}-01-01` : value.length === 7 ? `${value}-01` : value;
  if (!validDate(fullDate)) return undefined;
  // Use the beginning of a partial date only for ordering, never for authoredOn.
  // Iteration obtains the Chicago midnight offset, including on a DST transition date.
  const utc = Date.parse(`${fullDate}T00:00:00Z`);
  let order = utc;
  for (let i = 0; i < 3; i++) {
    const p = localParts(order);
    const wallClock = Date.parse(`${p.year.padStart(4, "0")}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);
    order += utc - wallClock;
  }
  return { order, date: value };
}

interface Item {
  id: string;
  issuer: string;
  patient: string;
  recorded: number;
  effective?: ClinicalTime;
  payload: ObjectValue;
  supersedes: string[];
  retracts: string[];
}
function references(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v !== "") : [];
}
function currentItems(items: unknown, asOf: string): Item[] {
  if (!Array.isArray(items) || typeof asOf !== "string" || !validDate(asOf)) return [];
  const scoped: Item[] = [];
  for (const raw of items) {
    const row = object(raw);
    if (!row) continue;
    const id = string(row.id), issuer = string(row.issuer), patient = string(row.patient);
    const recorded = instant(row.recorded);
    if (!id || !issuer || !patient || recorded === undefined || localDate(recorded) > asOf) continue;
    scoped.push({ id, issuer, patient, recorded, effective: clinicalTime(row.effective),
      payload: object(row.payload) ?? {}, supersedes: references(row.supersedes), retracts: references(row.retracts) });
  }
  // All in-scope edges count, including those on superseded/retracted items. Thus A -> B -> C
  // removes B and C; retracting A cannot resurrect B or C. References are issuer-local.
  const removed = new Set<string>();
  for (const item of scoped) {
    for (const id of [...item.supersedes, ...item.retracts]) removed.add(key(item.issuer, id));
  }
  return scoped.filter(item => !removed.has(key(item.issuer, item.id)))
    .sort((a, b) => a.recorded - b.recorded || compare(a.issuer, b.issuer) || compare(a.id, b.id));
}

interface Entry { item: Item; entryId: string; value: ObjectValue }
function compareEvents(a: Entry, b: Entry): number {
  return (a.item.effective?.order ?? a.item.recorded) - (b.item.effective?.order ?? b.item.recorded)
    || a.item.recorded - b.item.recorded || compare(a.item.id, b.item.id) || compare(a.entryId, b.entryId);
}

const RXNORM = "http://www.nlm.nih.gov/research/umls/rxnorm";
const UCUM = "http://unitsofmeasure.org";

// Name normalization does not create RxNorm codes. Northgate supplies product CUIs, not
// ingredient CUIs. Outside identifiers are not RxNorm, even if they happen to be numeric.
const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", forxiga: "dapagliflozin",
  invokana: "canagliflozin", steglatro: "ertugliflozin", glucophage: "metformin",
  glumetza: "metformin", fortamet: "metformin", riomet: "metformin", januvia: "sitagliptin",
  tradjenta: "linagliptin", onglyza: "saxagliptin", nesina: "alogliptin",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", saxenda: "liraglutide",
  mounjaro: "tirzepatide", zepbound: "tirzepatide", byetta: "exenatide", bydureon: "exenatide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", rezvoglar: "insulin glargine", tresiba: "insulin degludec",
  levemir: "insulin detemir", humalog: "insulin lispro", lyumjev: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  glucotrol: "glipizide", amaryl: "glimepiride", diabeta: "glyburide", micronase: "glyburide",
  actos: "pioglitazone", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan",
  avapro: "irbesartan", atacand: "candesartan", micardis: "telmisartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  norvasc: "amlodipine", coreg: "carvedilol", lopressor: "metoprolol", toprol: "metoprolol",
  tenormin: "atenolol", zebeta: "bisoprolol", bystolic: "nebivolol", inderal: "propranolol",
  lasix: "furosemide", demadex: "torsemide", bumex: "bumetanide", aldactone: "spironolactone",
  inspra: "eplerenone", kerendia: "finerenone", microzide: "hydrochlorothiazide",
  hygroton: "chlorthalidone", lipitor: "atorvastatin", crestor: "rosuvastatin",
  zocor: "simvastatin", pravachol: "pravastatin", zetia: "ezetimibe",
  tricor: "fenofibrate", lopid: "gemfibrozil", plavix: "clopidogrel", eliquis: "apixaban",
  xarelto: "rivaroxaban", coumadin: "warfarin", synthroid: "levothyroxine",
  levoxyl: "levothyroxine", euthyrox: "levothyroxine", zoloft: "sertraline",
  lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine",
  paxil: "paroxetine", cymbalta: "duloxetine", effexor: "venlafaxine", wellbutrin: "bupropion",
  neurontin: "gabapentin", lyrica: "pregabalin", prilosec: "omeprazole",
  protonix: "pantoprazole", nexium: "esomeprazole", pepcid: "famotidine",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol",
};
function ingredient(name: string): string | undefined {
  let text = name.toLowerCase().replace(/[®™]/g, "").trim();
  if (/^(?:unknown|unspecified|unidentified|water pill|blood pressure (?:pill|medicine|medication)|diabetes (?:pill|medicine|medication)|insulin(?: pen)?$)/.test(text)) return undefined;
  // A bracketed brand is supplemental to a generic product description (RxNorm style).
  text = text.replace(/\[[^\]]*\]/g, " ");
  const brand = Object.keys(BRANDS).find(b => text === b || text.startsWith(`${b} `) || text.startsWith(`${b}-`));
  if (brand) return BRANDS[brand];
  text = text.replace(/\([^)]*\)/g, " ")
    .replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|ug|g|ml|units?|unt)(?:\s*\/\s*(?:\d+(?:\.\d+)?\s*)?(?:ml|l|g))?\b/gi, " ")
    .replace(/\b\d.*$/, " ")
    .replace(/\b(?:hydrochloride|hcl|hydrobromide|hbr|besylate|besilate|succinate|tartrate|fumarate|maleate|mesylate|phosphate|acetate)\b/g, " ")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|sustained[ -]release|modified[ -]release|enteric[ -]coated|oral|tablet|tablets|capsule|capsules|solution|suspension|injection|injectable|pen|prefilled|syringe|vial|cream|ointment|patch|inhaler|chewable|er|xr|xl|sr|dr|ec)\b.*$/, " ")
    .replace(/\b(losartan|diclofenac) potassium\b/g, "$1")
    .replace(/\b(atorvastatin|rosuvastatin) calcium\b/g, "$1")
    .replace(/\b(levothyroxine|pravastatin|naproxen) sodium\b/g, "$1")
    .replace(/\b(insulin (?:glargine|lispro|aspart))-\w+\b/g, "$1")
    .replace(/\s+/g, " ").trim().replace(/[ /,;-]+$/, "");
  return text && /[a-z]/.test(text) ? text : undefined;
}

const MED_ACTIONS = new Set(["start", "change", "hold", "resume", "stop"]);
const STOP_REASONS = new Set(["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"]);
type Dosage = NonNullable<MedicationRequest["dosageInstruction"]>[number];
function dosage(value: ObjectValue): Dosage | undefined {
  const result: Dosage = {};
  const sig = string(value.sig);
  if (sig) result.text = sig;
  switch (value.frequency) {
    case "QD": case "BID": case "TID": case "QHS": case "PRN":
      result.timing = { code: { text: value.frequency } }; break;
    case "OTHER": result.timing = { code: { text: "other" } }; break;
  }
  const dose = object(value.dose);
  if (dose && finite(dose.value) && dose.value >= 0) {
    const units: Record<string, [string, string]> = {
      mg: ["mg", "mg"], mcg: ["mcg", "ug"], ug: ["mcg", "ug"], "µg": ["mcg", "ug"],
      units: ["units", "[iU]"], unit: ["units", "[iU]"], UNT: ["units", "[iU]"], "[iU]": ["units", "[iU]"],
      mL: ["mL", "mL"], tab: ["tablet", "{tbl}"], tablet: ["tablet", "{tbl}"], tablets: ["tablet", "{tbl}"],
    };
    const unit = typeof dose.unit === "string" && Object.prototype.hasOwnProperty.call(units, dose.unit) ? units[dose.unit] : undefined;
    if (unit) result.doseAndRate = [{ doseQuantity: { value: dose.value, unit: unit[0], system: UCUM, code: unit[1] } }];
  }
  return Object.keys(result).length ? result : undefined;
}

interface ResourceCandidate<T> { identity: string; hint: string; resource: T }
function medications(entries: Entry[]): ResourceCandidate<MedicationRequest>[] {
  const lines = new Map<string, Entry[]>();
  for (const entry of entries) {
    const value = entry.value;
    const id = string(value.med_id), action = string(value.action);
    if (value.type !== "med_event" || !id || !action || !MED_ACTIONS.has(action) || !entry.item.effective) continue;
    const lineKey = key(entry.item.issuer, entry.item.patient, id);
    const events = lines.get(lineKey) ?? [];
    events.push(entry);
    lines.set(lineKey, events);
  }
  const newest = new Map<string, { events: Entry[]; latest: Entry; ingredient?: string; lineKey: string }>();
  for (const [lineKey, events] of lines) {
    events.sort(compareEvents);
    const latest = events[events.length - 1];
    const drug = object(latest.value.drug), name = string(drug?.name);
    if (!name || (latest.value.origin !== "northgate" && latest.value.origin !== "outside")) continue;
    const generic = ingredient(name);
    const group = key(latest.item.issuer, latest.item.patient, generic ? `ingredient:${generic}` : `line:${lineKey}`);
    const previous = newest.get(group);
    if (!previous || compareEvents(previous.latest, latest) < 0) newest.set(group, { events, latest, ingredient: generic, lineKey });
  }
  const results: ResourceCandidate<MedicationRequest>[] = [];
  for (const { events, latest, ingredient: generic, lineKey } of newest.values()) {
    const value = latest.value, item = latest.item;
    const drug = object(value.drug)!;
    const name = string(drug.name)!;
    const rxnorm = string(drug.rxnorm);
    const concept: CodeableConcept = { text: rxnorm || !generic ? name : `${name} (${generic})` };
    if (rxnorm) concept.coding = [{ system: RXNORM, code: rxnorm }];
    const status = value.action === "hold" ? "on-hold" : value.action === "stop" ? "stopped" : "active";
    const resource: MedicationRequest = {
      resourceType: "MedicationRequest", id: "",
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
      status, intent: value.origin === "outside" ? "plan" : "order", reportedBoolean: value.origin === "outside",
      medicationCodeableConcept: concept, subject: { reference: `Patient/${item.patient}` },
    };
    // A change restates the order; it does not restart it. A review is not a medication event.
    const began = events.find(e => e.value.action === "start");
    const activeSince = [...events].reverse().find(e => e.value.action === "start" || e.value.action === "resume");
    const authoredOn = (status === "active" ? activeSince ?? began : began)?.item.effective?.date;
    if (authoredOn) resource.authoredOn = authoredOn;
    if (status === "on-hold" || status === "stopped") {
      const reason: CodeableConcept = {};
      const text = string(value.reason_text), code = string(value.stop_reason);
      if (text) reason.text = text;
      if (status === "stopped" && code && STOP_REASONS.has(code)) reason.coding = [{ system: "urn:folio:stop-reason", code }];
      if (reason.text || reason.coding) resource.statusReason = [reason];
    }
    const instructions = dosage(value);
    if (instructions) resource.dosageInstruction = [instructions];
    results.push({ identity: `med:${lineKey}`, hint: `med-${string(value.med_id)!}`, resource });
  }
  return results;
}

const LABS: Record<Analyte, { unit: string; loinc: string; codes: string[] }> = {
  creatinine: { unit: "mg/dL", loinc: "2160-0", codes: ["CREAT", "CREA", "CREATININE", "SCR"] },
  egfr: { unit: "mL/min/1.73m2", loinc: "98979-8", codes: ["EGFR", "EGFRNAA", "EGFRAA", "EGFR09N", "EGFR09A", "EGFR21"] },
  potassium: { unit: "mmol/L", loinc: "2823-3", codes: ["K", "POTASSIUM"] },
  sodium: { unit: "mmol/L", loinc: "2951-2", codes: ["NA", "SODIUM"] },
  chloride: { unit: "mmol/L", loinc: "2075-0", codes: ["CL", "CHLORIDE"] },
  bicarbonate: { unit: "mmol/L", loinc: "2028-9", codes: ["CO2", "TCO2", "HCO3", "BICARB", "BICARBONATE"] },
  anion_gap: { unit: "mmol/L", loinc: "33037-3", codes: ["AG", "AGAP", "ANIONGAP"] },
  bun: { unit: "mg/dL", loinc: "3094-0", codes: ["BUN", "UREAN", "UREANITROGEN"] },
  glucose: { unit: "mg/dL", loinc: "2345-7", codes: ["GLU", "GLUC", "GLUCOSE"] },
  a1c: { unit: "%", loinc: "4548-4", codes: ["A1C", "HBA1C", "HGBA1C"] },
  uacr: { unit: "mg/g", loinc: "9318-7", codes: ["UACR", "ACR", "MALBCR", "UMACR", "MICROALBCR"] },
  platelets: { unit: "10*3/uL", loinc: "777-3", codes: ["PLT", "PLATELET", "PLATELETS"] },
  wbc: { unit: "10*3/uL", loinc: "6690-2", codes: ["WBC"] },
  hemoglobin: { unit: "g/dL", loinc: "718-7", codes: ["HGB", "HB", "HEMOGLOBIN"] },
  bhb: { unit: "mmol/L", loinc: "53060-9", codes: ["BHB", "BOHB", "BETAHYDROXYBUTYRATE"] },
  ph: { unit: "[pH]", loinc: "2746-6", codes: ["PH", "VPH", "PHV", "VBGPH", "ABGPH"] },
  pco2: { unit: "mmHg", loinc: "2021-4", codes: ["PCO2", "VPCO2", "PCO2V", "VBGPCO2", "ABGPCO2"] },
  lipase: { unit: "U/L", loinc: "3040-3", codes: ["LIPASE", "LIP"] },
  troponin: { unit: "ng/mL", loinc: "10839-9", codes: ["TROP", "TROPI", "TROPONIN", "TROPONINI", "TNI"] },
  cholesterol: { unit: "mg/dL", loinc: "2093-3", codes: ["CHOL", "CHOLTOTAL", "CHOLESTEROL", "TC"] },
  triglycerides: { unit: "mg/dL", loinc: "2571-8", codes: ["TG", "TRIG", "TRIGLYCERIDES", "TRIGLYCERIDE"] },
  hdl: { unit: "mg/dL", loinc: "2085-9", codes: ["HDL", "HDLC"] },
  ldl: { unit: "mg/dL", loinc: "13457-7", codes: ["LDL", "LDLC", "LDLCALC", "LDLDIRECT", "DLDL"] },
};
const ANALYTES = Object.keys(LABS) as Analyte[];
function compact(value: string): string { return value.toUpperCase().replace(/[^A-Z0-9]/g, ""); }
function analyte(value: ObjectValue): Analyte | undefined {
  const test = object(value.test);
  if (!test) return undefined;
  const name = (string(test.name) ?? "").toLowerCase();
  // Do not turn a urine analyte, troponin T, or another unrelated component into a serum result
  // merely because its display contains a tracked analyte's name.
  const ratio = /(?:albumin|microalbumin).*(?:creatinine).*(?:ratio)|(?:albumin|microalbumin)\s*[/:]\s*creatinine/.test(name);
  if (/\burine\b|\burinary\b|\bucr\b/.test(name) && !ratio && !/\buacr\b/.test(name)) return undefined;
  if (/troponin\s*[- ]?t\b/.test(name)) return undefined;
  const loinc = string(test.loinc);
  const coded = ANALYTES.find(a => LABS[a].loinc === loinc);
  if (coded) return coded;
  if (loinc && ["33914-3", "48642-3", "48643-1", "62238-1"].includes(loinc)) return "egfr";
  const external = object(value.external_ref);
  for (const raw of [string(test.nfm_code), string(external?.result_code)?.replace(/^LK[-_]/i, "")]) {
    if (!raw) continue;
    const code = compact(raw);
    const match = ANALYTES.find(a => LABS[a].codes.includes(code));
    if (match) return match;
    if (code.startsWith("EGFR")) return "egfr";
  }
  if (ratio || /\buacr\b/.test(name)) return "uacr";
  if (/\begfr\b|estimated glomerular filtration/.test(name)) return "egfr";
  if (/\b(?:hemoglobin|haemoglobin|hgb)\s*a1c\b|\ba1c\b/.test(name)) return "a1c";
  if (/\banion\s+gap\b/.test(name)) return "anion_gap";
  if (/\bbeta[- ]?hydroxybutyr(?:ate|ic acid)\b|β[- ]?hydroxybutyrate/.test(name)) return "bhb";
  if (/\b(?:urea nitrogen|bun)\b/.test(name)) return "bun";
  if (/\bbicarbonate\b|\b(?:total\s+co2|co2(?:,?\s+total)?|carbon dioxide)\b/.test(name) && !/partial pressure|\bpco2\b/.test(name)) return "bicarbonate";
  if (/\b(?:pco2|carbon dioxide partial pressure)\b/.test(name)) return "pco2";
  if (/\bph\b/.test(name)) return "ph";
  if (/\bplatelet(?:s| count)?\b/.test(name)) return "platelets";
  if (/\bwbc\b|\bwhite (?:blood )?cell(?:s| count)?\b|\bleukocyte(?:s| count)?\b/.test(name)) return "wbc";
  if (/\bhdl\b|high[- ]density lipoprotein/.test(name)) return "hdl";
  if (/\bldl\b|low[- ]density lipoprotein/.test(name)) return "ldl";
  const patterns: [Analyte, RegExp][] = [
    ["creatinine", /^creatinine(?:,?\s+serum|,?\s+plasma|,?\s+blood)?$/],
    ["potassium", /^potassium\b/], ["sodium", /^sodium\b/], ["chloride", /^chloride\b/],
    ["glucose", /^(?:glucose|fasting glucose)\b/], ["hemoglobin", /^(?:hemoglobin|haemoglobin|hgb)(?:,?\s+(?:blood|total))?$/],
    ["lipase", /^lipase\b/], ["troponin", /^troponin\s*[- ]?i\b/],
    ["cholesterol", /^(?:total cholesterol|cholesterol(?:,?\s+total)?)$/], ["triglycerides", /^triglycerides?\b/],
  ];
  return patterns.find(([, pattern]) => pattern.test(name.trim()))?.[0];
}

type Equation = NonNullable<Observation["method"]>["text"];
function statedEquation(text: string): Equation | undefined {
  if (/ckd[\s_-]*epi[^.;\n]*\b2021\b|\b2021\b[^.;\n]*ckd[\s_-]*epi/i.test(text)) return "ckd-epi-2021";
  if (/ckd[\s_-]*epi[^.;\n]*\b2009\b|\b2009\b[^.;\n]*ckd[\s_-]*epi/i.test(text)) return "ckd-epi-2009";
  if (/\bmdrd\b|modification of diet in renal disease/i.test(text)) return "mdrd";
  return undefined;
}
function equation(value: ObjectValue): Equation {
  // The source explicitly warns that a method comment can disagree with its LOINC.
  const comment = statedEquation(string(value.comment) ?? "");
  if (comment) return comment;
  const test = object(value.test) ?? {}, external = object(value.external_ref) ?? {};
  const named = statedEquation(string(test.name) ?? "");
  if (named) return named;
  const codes = `${string(test.nfm_code) ?? ""} ${string(external.result_code) ?? ""}`;
  if (/EGFR[-_ ]?(?:2021|21)(?:\b|[^0-9])/i.test(codes)) return "ckd-epi-2021";
  if (/EGFR[-_ ]?(?:2009|09)(?:\b|[^0-9])/i.test(codes)) return "ckd-epi-2009";
  if (/MDRD/i.test(codes)) return "mdrd";
  if (test.loinc === "98979-8") return "ckd-epi-2021";
  if (test.loinc === "62238-1") return "ckd-epi-2009";
  if (["33914-3", "48642-3", "48643-1"].includes(string(test.loinc) ?? "")) return "mdrd";
  return "unknown";
}
function raceAdjusted(value: ObjectValue): boolean {
  const test = object(value.test) ?? {}, external = object(value.external_ref) ?? {};
  const name = (string(test.name) ?? "").toLowerCase();
  const codes = [string(test.nfm_code), string(external.result_code)].filter((v): v is string => !!v)
    .map(v => compact(v.replace(/^LK[-_]/i, "")));
  if (/non[ -]?(?:african|black|aa)\b|without (?:a )?race|race[ -]?(?:free|neutral)|\bcaucasian\b/.test(name)
    || codes.some(c => /EGFR(?:09|2009)?(?:NAA|NONAA|N)$/.test(c))) return false;
  return /\bafrican[ -]?american\b|\bblack\b|\bwith (?:a )?race coefficient\b/.test(name)
    || codes.some(c => /EGFR(?:09|2009)?(?:AA|A)$/.test(c)) || test.loinc === "48643-1";
}
function numeric(value: unknown): { value: number; comparator?: Quantity["comparator"] } | undefined {
  if (typeof value !== "string") return undefined;
  const match = /^\s*(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*$/.exec(value);
  if (!match) return undefined;
  const number = Number(match[2]);
  if (!Number.isFinite(number)) return undefined;
  const comparator = match[1] === "≤" ? "<=" : match[1] === "≥" ? ">=" : match[1];
  return comparator ? { value: number, comparator: comparator as Quantity["comparator"] } : { value: number };
}
function unitFactor(a: Analyte, unit: unknown): number | undefined {
  if (typeof unit !== "string") return undefined;
  const normalize = (s: string): string => s.toLowerCase().replace(/[µμ]/g, "u").replace(/\s/g, "");
  const u = normalize(unit);
  if (u === normalize(LABS[a].unit)) return 1;
  if (a === "platelets" || a === "wbc") {
    if (["cells/ul", "cell/ul", "/ul", "#/ul"].includes(u)) return 0.001;
    if (["k/ul", "10^3/ul", "x10^3/ul", "10*9/l", "10^9/l"].includes(u)) return 1;
  }
  if (a === "egfr" && ["ml/min/1.73m^2", "ml/min/1.73m²", "ml/min/{1.73_m2}"].includes(u)) return 1;
  if (a === "ph" && ["", "ph"].includes(u)) return 1;
  if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") return 1;
  if (a === "lipase" && u === "iu/l") return 1;
  // Do not relabel an unrecognized unit without a known conversion.
  return undefined;
}

function labIdentity(entry: Entry): string {
  const value = entry.value, external = object(value.external_ref);
  const accession = string(external?.accession), code = string(external?.result_code);
  if (accession && code) return key(entry.item.issuer, entry.item.patient, string(external?.lab) ?? "Lakeview Labs", accession, code,
    String(instant(value.collected)));
  return key(entry.item.issuer, entry.item.patient, entry.item.id, entry.entryId);
}
function compareResults(a: Entry, b: Entry): number {
  const rank = (e: Entry): number => e.value.result_status === "C" ? 3 : e.value.result_status === "F" ? 2 : 1;
  return rank(a) - rank(b) || (instant(a.value.resulted) ?? a.item.recorded) - (instant(b.value.resulted) ?? b.item.recorded)
    || a.item.recorded - b.item.recorded || compare(a.item.id, b.item.id) || compare(a.entryId, b.entryId);
}
function observations(entries: Entry[]): ResourceCandidate<Observation>[] {
  const components = new Map<string, Entry>();
  for (const entry of entries) {
    const value = entry.value;
    if (value.type !== "imported_result" || !["P", "F", "C"].includes(string(value.result_status) ?? "") || instant(value.collected) === undefined) continue;
    const identity = labIdentity(entry), previous = components.get(identity);
    // Select the winning version BEFORE parsing its value: a nonnumeric correction is a
    // withdrawal and must not leave an older numeric value behind.
    if (!previous || compareResults(previous, entry) < 0) components.set(identity, entry);
  }
  const results: ResourceCandidate<Observation>[] = [];
  for (const [identity, entry] of components) {
    const value = entry.value, test = object(value.test);
    if (!test) continue;
    const a = analyte(value), parsed = numeric(value.value), localCode = string(test.nfm_code);
    if (!a || !parsed || !localCode || (a === "egfr" && raceAdjusted(value))) continue;
    const factor = unitFactor(a, value.unit);
    if (factor === undefined) continue;
    const converted = parsed.value * factor;
    if (!Number.isFinite(converted)) continue;
    const quantity: Quantity = { value: converted, unit: LABS[a].unit, system: UCUM,
      code: a === "egfr" ? "mL/min/{1.73_m2}" : LABS[a].unit };
    if (parsed.comparator) quantity.comparator = parsed.comparator;
    const resource: Observation = {
      resourceType: "Observation", id: "",
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab"] },
      status: value.result_status === "P" ? "preliminary" : "final",
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
      code: { coding: [{ system: "http://loinc.org", code: string(test.loinc) ?? LABS[a].loinc },
        { system: "urn:northgate-fm:test-code", code: localCode }], text: a },
      subject: { reference: `Patient/${entry.item.patient}` }, effectiveDateTime: value.collected as string,
      valueQuantity: quantity,
    };
    if (a === "egfr") resource.method = { text: equation(value) };
    results.push({ identity: `lab:${identity}`, hint: `lab-${entry.item.id}-${entry.entryId}`, resource });
  }
  return results;
}

function hash(value: string): string {
  let a = 2166136261, b = 5381;
  for (let i = 0; i < value.length; i++) {
    a = Math.imul(a ^ value.charCodeAt(i), 16777619);
    b = Math.imul(b, 33) ^ value.charCodeAt(i);
  }
  return (a >>> 0).toString(16).padStart(8, "0") + (b >>> 0).toString(16).padStart(8, "0");
}
function assignIds<T extends { id: string }>(candidates: ResourceCandidate<T>[], used: Set<string>): T[] {
  candidates.sort((a, b) => compare(a.identity, b.identity));
  for (const candidate of candidates) {
    const base = `${candidate.hint.replace(/[^A-Za-z0-9.-]/g, "-").slice(0, 42)}-${hash(candidate.identity)}`;
    let id = base, suffix = 1;
    while (used.has(id)) {
      const ending = `-${suffix++}`;
      id = base.slice(0, 64 - ending.length) + ending;
    }
    used.add(id);
    candidate.resource.id = id;
  }
  return candidates.map(c => c.resource);
}

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const entries: Entry[] = [];
  for (const item of currentItems(items, asOf)) {
    for (const entryId of Object.keys(item.payload).sort(compare)) {
      const value = object(item.payload[entryId]);
      if (value) entries.push({ item, entryId, value });
    }
  }
  const used = new Set<string>();
  return { medicationRequests: assignIds(medications(entries), used), observations: assignIds(observations(entries), used) };
}
