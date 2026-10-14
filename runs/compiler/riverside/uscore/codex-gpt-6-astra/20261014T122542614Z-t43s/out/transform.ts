import type {
  FolioItem, UsCoreRows, MedicationRequest, Observation, Quantity, CodeableConcept,
} from "../in/views/uscore";
import type { Analyte, MedicationRow } from "../in/views/views";

type ObjectValue = Record<string, unknown>;
type Entry = { key: string; value: ObjectValue };
type Document = {
  id: string; issuer: string; patient: string; recorded: number;
  raw: ObjectValue; entries: Entry[];
};
type Snapshot = { doc: Document; encounter: ObjectValue };
type LabCopy = {
  doc: Document; key: string; value: ObjectValue; test: ObjectValue;
  collected: unknown; specimen: unknown; rank: number; tie: string;
};

const RXNORM = "http://www.nlm.nih.gov/research/umls/rxnorm";
const UCUM = "http://unitsofmeasure.org";
const LOINC = "http://loinc.org";
const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
});
const object = (v: unknown): v is ObjectValue => v !== null && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown): string | undefined => typeof v === "string" && v.trim() ? v.trim() : undefined;
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const keyOf = (...parts: string[]): string => JSON.stringify(parts);

function dateIsValid(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const n = Date.parse(s + "T00:00:00Z");
  return Number.isFinite(n) && new Date(n).toISOString().slice(0, 10) === s;
}

function instant(v: unknown): number | undefined {
  const s = str(v);
  if (!s || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/i.test(s)
    || !dateIsValid(s.slice(0, 10))) return undefined;
  const n = Date.parse(s);
  return Number.isFinite(n) ? n : undefined;
}

function localDate(n: number): string {
  const parts = chicago.formatToParts(n);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? "";
  return `${get("year").padStart(4, "0")}-${get("month")}-${get("day")}`;
}

function compareDocs(a: Document, b: Document): number {
  return a.recorded - b.recorded || cmp(a.issuer, b.issuer) || cmp(a.id, b.id);
}

function currentDocuments(items: FolioItem[], asOf: string): Document[] {
  const docs: Document[] = [];
  for (const raw of items as unknown[]) {
    if (!object(raw)) continue;
    const id = str(raw.id), issuer = str(raw.issuer), patient = str(raw.patient);
    const recorded = instant(raw.recorded);
    if (!id || !issuer || !patient || recorded === undefined || localDate(recorded) > asOf) continue;
    const entries: Entry[] = [];
    if (object(raw.payload)) {
      for (const key of Object.keys(raw.payload).sort(cmp)) {
        const value: unknown = raw.payload[key];
        if (object(value)) entries.push({ key, value });
      }
    }
    docs.push({ id, issuer, patient, recorded, raw, entries });
  }
  // Even a replaced or subsequently retracted correction continues to suppress its
  // predecessors. Applying every in-scope link also handles chains transitively.
  const removed = new Set<string>();
  for (const doc of docs) {
    for (const field of ["supersedes", "retracts"]) {
      const ids = doc.raw[field];
      if (Array.isArray(ids)) for (const id of ids) {
        if (typeof id === "string") removed.add(keyOf(doc.issuer, id));
      }
    }
  }
  return docs.filter(d => !removed.has(keyOf(d.issuer, d.id))).sort(compareDocs);
}

// Compact stable ids, with collision resolution for uniqueness within this output.
function idFactory(): (prefix: string, key: string) => string {
  const used = new Set<string>();
  return (prefix, key) => {
    let a = 0x811c9dc5, b = 0x9e3779b9;
    for (let i = 0; i < key.length; i++) {
      a = Math.imul(a ^ key.charCodeAt(i), 0x01000193);
      b = Math.imul(b ^ key.charCodeAt(i), 0x85ebca6b);
    }
    const base = `${prefix}-${(a >>> 0).toString(16).padStart(8, "0")}${(b >>> 0).toString(16).padStart(8, "0")}`;
    let id = base, suffix = 0;
    while (used.has(id)) id = `${base}-${++suffix}`;
    used.add(id);
    return id;
  };
}

function medicationSnapshot(docs: Document[]): Snapshot | undefined {
  const encounters = new Map<string, { latest: Snapshot; discharge?: Snapshot }>();
  for (const doc of docs) {
    const contexts = doc.entries.filter(e => e.value.type === "encounter");
    if (contexts.length !== 1) continue;
    const encounter = contexts[0].value;
    const encounterId = str(encounter.encounter_id), kind = str(encounter.document_kind);
    if (!encounterId || !kind || !["ed_note", "hp", "progress_note", "consult", "discharge_summary"].includes(kind)) continue;
    const key = keyOf(doc.issuer, doc.patient, encounterId);
    const state = encounters.get(key) ?? { latest: { doc, encounter } };
    state.latest = { doc, encounter };
    if (kind === "discharge_summary") state.discharge = { doc, encounter };
    encounters.set(key, state);
  }
  let chosen: Snapshot | undefined;
  for (const state of encounters.values()) {
    // A late-signed progress note must not undo that stay's discharge instructions.
    const candidate = state.discharge ?? state.latest;
    if (!chosen || compareDocs(chosen.doc, candidate.doc) < 0) chosen = candidate;
  }
  return chosen;
}

// Codes are used only when supplied as ingredient codes; no product code is derived.
const ingredientByCode: Record<string, string> = {
  "6809": "metformin", "1545653": "empagliflozin", "1488564": "dapagliflozin",
  "29046": "lisinopril", "5487": "hydrochlorothiazide", "4821": "glipizide",
  "274783": "insulin glargine", "83367": "atorvastatin", "253182": "insulin regular",
};
const brands: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  glucophage: "metformin", glumetza: "metformin", fortamet: "metformin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  prinivil: "lisinopril", zestril: "lisinopril", cozaar: "losartan",
  glucotrol: "glipizide", amaryl: "glimepiride", januvia: "sitagliptin",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide",
  lasix: "furosemide", norvasc: "amlodipine", diovan: "valsartan",
  toprol: "metoprolol", lopressor: "metoprolol", coreg: "carvedilol",
  aldactone: "spironolactone", microzide: "hydrochlorothiazide",
  synthroid: "levothyroxine", levoxyl: "levothyroxine",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", plavix: "clopidogrel",
  prilosec: "omeprazole", protonix: "pantoprazole", pepcid: "famotidine",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  neurontin: "gabapentin", lyrica: "pregabalin", zoloft: "sertraline",
  lexapro: "escitalopram", prozac: "fluoxetine", cymbalta: "duloxetine",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol",
  flomax: "tamsulosin", zofran: "ondansetron", augmentin: "amoxicillin / clavulanic acid",
  janumet: "sitagliptin / metformin", synjardy: "empagliflozin / metformin",
  xigduo: "dapagliflozin / metformin", hyzaar: "losartan / hydrochlorothiazide",
};
const own = (map: Record<string, string>, key: string): string | undefined =>
  Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;

function ingredient(name: string, code?: string): string | undefined {
  if (code && own(ingredientByCode, code)) return own(ingredientByCode, code);
  let n = name.toLowerCase().replace(/[®™]/g, "").trim();
  if (/^(?:unknown|unspecified|unidentified|water pill|blood pressure pill|diabetes pill|medication|insulin unknown)(?:\b|$)/.test(n)) return undefined;
  // Match brands as whole words, including labels such as "Jardiance (empagliflozin)".
  const first = n.match(/^[a-z]+/)?.[0];
  if (first && own(brands, first)) return own(brands, first);
  // Remove strengths individually, retaining both names of combination products.
  n = n.replace(/\b\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?\s*(?:mg|mcg|ug|[µμ]g|g|units?|iu|ml|meq)\b(?:\s*\/\s*(?:\d+(?:\.\d+)?\s*)?(?:ml|g|actuation|dose)\b)?/gi, "")
    .replace(/\b\d+(?:\.\d+)?\s*%/g, "")
    .replace(/\s*\((?:human|recombinant|rDNA origin)\)/gi, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|sustained[ -]release|modified[ -]release)\b/g, "")
    .replace(/\b(?:oral|subcutaneous|injectable|injection|solution|suspension|tablets?|capsules?|caplets?|tabs?|caps?|pens?|vials?|cream|ointment|patch|inhaler|powder|chewable|film[ -]coated|er|xr|xl|sr|dr|ec)\b/g, "")
    .replace(/\b(?:hydrochloride|hcl|hydrobromide|succinate|tartrate|besylate|maleate|fumarate|dihydrate|monohydrate)\b/g, "")
    .replace(/\s+(?:potassium|sodium|calcium)\s*$/, "")
    .replace(/\s+/g, " ").replace(/^[\s,;/-]+|[\s,;/-]+$/g, "");
  return n || undefined;
}

const NUMBER = "[+-]?(?:(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?";
function numeric(v: unknown): { value: number; comparator?: Quantity["comparator"] } | undefined {
  if (typeof v !== "string") return undefined;
  const m = v.trim().match(new RegExp(`^(<=|>=|<|>|≤|≥)?\\s*(${NUMBER})$`));
  if (!m) return undefined;
  const value = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(value)) return undefined;
  const comparator = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1];
  return comparator ? { value, comparator: comparator as Quantity["comparator"] } : { value };
}

function dose(v: unknown): Quantity | undefined {
  const s = str(v);
  if (!s) return undefined;
  const m = s.match(new RegExp(`^(${NUMBER}|\\d+\\/\\d+)\\s*(mg|milligrams?|mcg|ug|[µμ]g|micrograms?|g|grams?|units?|unt|iu|\\[iu\\]|ml|millilit(?:er|re)s?|tabs?|tablets?)$`, "i"));
  if (!m) return undefined;
  const amount = m[1].replace(/,/g, "");
  let value = amount.includes("/") ? Number(amount.split("/")[0]) / Number(amount.split("/")[1]) : Number(amount);
  const u = m[2].toLowerCase();
  let unit: string, code: string;
  if (/^(?:mg|milligram)/.test(u)) { unit = code = "mg"; }
  else if (/^(?:g|gram)/.test(u)) { unit = code = "mg"; value *= 1000; }
  else if (/^(?:mcg|ug|[µμ]g|microgram)/.test(u)) { unit = "mcg"; code = "ug"; }
  else if (/^(?:ml|millilit)/.test(u)) { unit = code = "mL"; }
  else if (/^tab/.test(u)) { unit = "tablet"; code = "{tbl}"; }
  else { unit = "units"; code = "[iU]"; }
  return Number.isFinite(value) && value > 0 ? { value, unit, system: UCUM, code } : undefined;
}

function frequency(sig?: string): MedicationRow["frequency"] {
  if (!sig) return undefined;
  const s = sig.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ");
  if (/\b(?:prn|as needed|as required)\b/.test(s)) return "PRN";
  if (/\b(?:every other|alternate|qod|qid|q6h|four times|(?:twice|two times|three times) (?:a |per )?week(?:ly)?|every [2-9] weeks)\b/.test(s)) return "other";
  if (/\b(?:bid|twice (?:a |per )?day|twice daily|two times (?:a |per )?day|q12h|every 12 hours)\b/.test(s)) return "BID";
  if (/\b(?:tid|three times (?:a |per )?day|three times daily|q8h|every 8 hours)\b/.test(s)) return "TID";
  if (/\b(?:qhs|hs|at bedtime|nightly|each night|every night)\b/.test(s)) return "QHS";
  if (/\b(?:qw|qweek|weekly|once (?:a |per )?week|every 7 days)\b/.test(s)) return "QW";
  if (/\b(?:qd|daily|once (?:a |per )?day|every day|each day|q24h|every 24 hours|qam|every morning|each morning|qpm|every evening)\b/.test(s)) return "QD";
  if (/\b(?:every|times|hours?|days?|weeks?|months?|with meals)\b|\bq\d+h\b/.test(s)) return "other";
  return undefined;
}

function stopReason(text: string): MedicationRow["stop_reason"] {
  const s = text.toLowerCase();
  if (/\b(?:adverse (?:reaction|effect)|side effects?|allerg(?:y|ic)|intoleran\w*|drug[- ]induced|caused by|(?:due to|because of|for) (?:cough|rash|angioedema|hypoglycemia|ketoacidosis|lactic acidosis)|associated (?:euglycemic )?(?:dka|ketoacidosis))\b/.test(s)) return "adverse_reaction";
  if (/\b(?:ineffective|inefficacy|not (?:working|effective)|lack of (?:benefit|efficacy)|no benefit)\b/.test(s)) return "ineffective";
  if (/\b(?:replaced (?:by|with)|switch(?:ed|ing)? to|changed to|alternative therapy)\b/.test(s)) return "therapy_changed";
  if (/\b(?:course (?:is |was )?(?:complete|completed|finished)|completed (?:the )?(?:course|therapy)|finished (?:the )?course)\b/.test(s)) return "course_complete";
  if (/\b(?:patient (?:declined|refused|requested|prefers|preference|choice)|at (?:the )?patient'?s request)\b/.test(s)) return "patient_choice";
  if (/\b(?:due to|because|for (?:cost|expense)|no longer (?:needed|indicated))\b/.test(s)) return "other";
  return undefined;
}

function medications(snapshot: Snapshot | undefined, makeId: ReturnType<typeof idFactory>): MedicationRequest[] {
  if (!snapshot) return [];
  const { doc } = snapshot;
  const selected = new Map<string, { entry: ObjectValue; name: string; generic?: string; code?: string; tie: string }>();
  const codesByName = new Map<string, Set<string>>();
  for (const { value: entry } of doc.entries) {
    if (entry.type !== "home_med") continue;
    const name = str(entry.drug_name), code = str(entry.rxnorm_ingredient);
    if (!name || !code) continue;
    const generic = ingredient(name, code);
    if (!generic) continue;
    const codes = codesByName.get(generic) ?? new Set<string>();
    codes.add(code);
    codesByName.set(generic, codes);
  }
  for (const { key, value: entry } of doc.entries) {
    if (entry.type !== "home_med") continue;
    const name = str(entry.drug_name), status = str(entry.status);
    if (!name || !status || !["not_reconciled", "continue", "held", "stopped", "new", "changed"].includes(status)) continue;
    let code = str(entry.rxnorm_ingredient);
    const generic = ingredient(name, code);
    const matchingCodes = generic ? codesByName.get(generic) : undefined;
    // A code omitted on one duplicate line is not a second ingredient. Only join
    // by name when the snapshot gives one unambiguous ingredient-level code.
    if (!code && matchingCodes?.size === 1) code = [...matchingCodes][0];
    const identity = code ? `rx:${code}` : `name:${generic ?? name.toLowerCase()}`;
    // All lines here share a signing time. A changed/new instruction wins an old
    // line for that ingredient; otherwise use content, then entry id, to break ties.
    const priority = status === "changed" ? "2" : status === "new" ? "1" : "0";
    const tie = keyOf(priority, name, str(entry.dose_text) ?? "", str(entry.sig) ?? "", status, key);
    const previous = selected.get(identity);
    if (!previous || cmp(previous.tie, tie) < 0) selected.set(identity, { entry, name, generic, code, tie });
  }
  const rows: MedicationRequest[] = [];
  for (const [identity, { entry, name, generic, code }] of [...selected].sort(([a], [b]) => cmp(a, b))) {
    const status: MedicationRequest["status"] = entry.status === "held" ? "on-hold"
      : entry.status === "stopped" ? "stopped" : entry.status === "not_reconciled" ? "unknown" : "active";
    const medication: CodeableConcept = { text: code || !generic ? name : `${name} (${generic})` };
    if (code) medication.coding = [{ system: RXNORM, code, ...(generic ? { display: generic } : {}) }];
    const reported = entry.status === "not_reconciled";
    const row: MedicationRequest = {
      resourceType: "MedicationRequest", id: makeId("med", keyOf(doc.issuer, doc.patient, identity)),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
      status, intent: reported ? "plan" : "order", reportedBoolean: reported,
      medicationCodeableConcept: medication, subject: { reference: `Patient/${doc.patient}` },
    };
    const instructions = str(entry.instructions);
    if ((status === "on-hold" || status === "stopped") && instructions) {
      const reason: CodeableConcept = { text: instructions };
      const coded = status === "stopped" ? stopReason(instructions) : undefined;
      if (coded) reason.coding = [{ system: "urn:folio:stop-reason", code: coded }];
      row.statusReason = [reason];
    }
    const sig = str(entry.sig), amount = dose(entry.dose_text), freq = frequency(sig);
    if (sig || amount || freq) {
      row.dosageInstruction = [{
        ...(sig ? { text: sig } : {}),
        ...(freq ? { timing: { code: { text: freq } } } : {}),
        ...(amount ? { doseAndRate: [{ doseQuantity: amount }] } : {}),
      }];
    }
    // HomeMed has no start date. In particular, the envelope effective time of a
    // discharge summary is admission, not the start of a home prescription.
    rows.push(row);
  }
  return rows;
}

const analytes: Record<Analyte, { unit: string; loinc: string; aliases: string[] }> = {
  creatinine: { unit: "mg/dL", loinc: "2160-0", aliases: ["CREAT", "CREA", "CREATININE"] },
  egfr: { unit: "mL/min/1.73m2", loinc: "98979-8", aliases: ["EGFR", "GFR"] },
  potassium: { unit: "mmol/L", loinc: "2823-3", aliases: ["K", "POTASSIUM"] },
  sodium: { unit: "mmol/L", loinc: "2951-2", aliases: ["NA", "SODIUM"] },
  chloride: { unit: "mmol/L", loinc: "2075-0", aliases: ["CL", "CHLORIDE"] },
  bicarbonate: { unit: "mmol/L", loinc: "2028-9", aliases: ["CO2", "TCO2", "BICARB", "BICARBONATE", "TOTALCO2", "CARBONDIOXIDE"] },
  anion_gap: { unit: "mmol/L", loinc: "33037-3", aliases: ["AGAP", "AG", "ANIONGAP"] },
  bun: { unit: "mg/dL", loinc: "3094-0", aliases: ["BUN", "UREANITROGEN"] },
  glucose: { unit: "mg/dL", loinc: "2345-7", aliases: ["GLU", "GLUCOSE"] },
  a1c: { unit: "%", loinc: "4548-4", aliases: ["A1C", "HBA1C", "HEMOGLOBINA1C", "GLYCOHEMOGLOBIN"] },
  uacr: { unit: "mg/g", loinc: "9318-7", aliases: ["UACR", "ACR", "MALBCR", "ALBUMINCREATININERATIO", "MICROALBUMINCREATININERATIO"] },
  platelets: { unit: "10*3/uL", loinc: "777-3", aliases: ["PLT", "PLATELET", "PLATELETS", "PLATELETCOUNT"] },
  wbc: { unit: "10*3/uL", loinc: "6690-2", aliases: ["WBC", "WHITEBLOODCELLCOUNT", "WHITECELLS", "LEUKOCYTES"] },
  hemoglobin: { unit: "g/dL", loinc: "718-7", aliases: ["HGB", "HB", "HEMOGLOBIN", "HAEMOGLOBIN"] },
  bhb: { unit: "mmol/L", loinc: "53060-9", aliases: ["BHB", "BOHB", "BHOB", "BETAHYDROXYBUTYRATE", "3HYDROXYBUTYRATE"] },
  ph: { unit: "[pH]", loinc: "2746-6", aliases: ["PH", "VPH", "APH", "PHVENOUS", "PHARTERIAL"] },
  pco2: { unit: "mmHg", loinc: "2021-4", aliases: ["PCO2", "VPCO2", "APCO2", "PCO2VENOUS", "PCO2ARTERIAL"] },
  lipase: { unit: "U/L", loinc: "3040-3", aliases: ["LIPASE", "LIPA", "LIP"] },
  troponin: { unit: "ng/mL", loinc: "10839-9", aliases: ["TNI", "TROPI", "TROPONINI", "HSTNI", "HSTROPI"] },
  cholesterol: { unit: "mg/dL", loinc: "2093-3", aliases: ["CHOL", "TC", "CHOLESTEROL", "TOTALCHOLESTEROL"] },
  triglycerides: { unit: "mg/dL", loinc: "2571-8", aliases: ["TG", "TRIG", "TRIGLYCERIDES"] },
  hdl: { unit: "mg/dL", loinc: "2085-9", aliases: ["HDL", "HDLC", "HDLCHOLESTEROL"] },
  ldl: { unit: "mg/dL", loinc: "13457-7", aliases: ["LDL", "LDLC", "LDLCALC", "LDLDIRECT", "LDLCHOLESTEROL"] },
};
const analyteNames = Object.keys(analytes) as Analyte[];
const token = (s: string): string => s.toUpperCase().replace(/Β/g, "BETA").replace(/[^A-Z0-9]/g, "");

function identify(test: ObjectValue, specimen: unknown): Analyte | undefined {
  const code = str(test.loinc), local = token(str(test.local_code) ?? "");
  const name = (str(test.name) ?? "").toLowerCase().replace(/β/g, "beta");
  const sample = (str(specimen) ?? "").toLowerCase();
  const words = `${name} ${sample}`;
  // Avoid matching the same chemical in an unrequested specimen or a related test.
  if (/\btroponin[- ]?t\b|\b(?:clearance|osmolality)\b/.test(name)) return undefined;
  const urinary = /\b(?:urine|urinary)\b/.test(words);
  const ratio = /(?:albumin|microalbumin).*creatinine.*ratio|(?:albumin|microalbumin)\s*[/:-]\s*creatinine/.test(name);
  if (urinary && !ratio && !analytes.uacr.aliases.includes(local) && code !== analytes.uacr.loinc) return undefined;
  let found = analyteNames.find(a => analytes[a].loinc === code);
  if (!found) {
    if (ratio) found = "uacr";
    else if (/\begfr[a-z0-9-]*\b|estimated.*glomerular filtration|glomerular filtration.*estimat/.test(name) || local.startsWith("EGFR")) found = "egfr";
    else if (/\bhemoglobin a1c\b|\bhaemoglobin a1c\b|\bhba1c\b/.test(name)) found = "a1c";
    else if (/\b(?:beta|3)[ -]?hydroxybutyr(?:ate|ic acid)\b/.test(name)) found = "bhb";
    else if (/\btroponin[- ]?i\b/.test(name)) found = "troponin";
    else if (/\bhdl\b.*cholesterol|cholesterol.*\bhdl\b|high[ -]density lipoprotein.*cholesterol/.test(name)) found = "hdl";
    else if (/\bldl\b.*cholesterol|cholesterol.*\bldl\b|low[ -]density lipoprotein.*cholesterol/.test(name)) found = "ldl";
    else {
      const simplified = token(name.replace(/\([^)]*\)/g, "").replace(/\b(?:serum|plasma|venous|arterial|total|automated|calculated|measured|direct|count)\b/g, ""));
      found = analyteNames.find(a => analytes[a].aliases.includes(local)
        || analytes[a].aliases.includes(token(name)) || analytes[a].aliases.includes(simplified));
    }
  }
  if (found === "glucose" && /\b(?:capillary|whole blood|meter|fingerstick|finger stick|poc|point.of.care)\b/.test(words)) return undefined;
  if (found === "creatinine" && (urinary || /ratio/.test(name))) return undefined;
  if (found === "bicarbonate" && /\b(?:calculated|blood gas)\b/.test(name)) return undefined;
  return found;
}

function normalizedUnit(s: string): string {
  return s.toLowerCase().replace(/[µμ]/g, "u").replace(/10³/g, "10*3").replace(/10⁹/g, "10*9")
    .replace(/²/g, "2").replace(/\^/g, "*").replace(/\s/g, "");
}

function convertedValue(analyte: Analyte, value: number, rawUnit: unknown): number | undefined {
  const unit = str(rawUnit), u = normalizedUnit(unit ?? "");
  if (u === normalizedUnit(analytes[analyte].unit)) return value;
  if (analyte === "ph" && ["", "1", "ph", "unitless"].includes(u)) return value;
  if (analyte === "egfr" && ["ml/min/{1.73_m2}", "ml/min/1.73m*2", "ml/min/1.73m2", "ml/min/1.73m²"].includes(u)) return value;
  if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(analyte) && u === "meq/l") return value;
  let factor: number | undefined, offset = 0;
  if (analyte === "creatinine" && u === "umol/l") factor = 1 / 88.4;
  if (analyte === "bun" && u === "mmol/l") factor = 2.801;
  if (analyte === "glucose" && u === "mmol/l") factor = 18.016;
  if (["cholesterol", "hdl", "ldl"].includes(analyte) && u === "mmol/l") factor = 38.67;
  if (analyte === "triglycerides" && u === "mmol/l") factor = 88.57;
  if (analyte === "a1c" && u === "mmol/mol") { factor = 0.09148; offset = 2.152; }
  if (analyte === "a1c" && ["percent", "%{ngsp}"].includes(u)) factor = 1;
  if (analyte === "uacr" && ["ug/mg", "mg/g{creat}", "mg/gcreatinine"].includes(u)) factor = 1;
  if (analyte === "uacr" && u === "mg/mmol") factor = 8.84;
  if (analyte === "platelets" || analyte === "wbc") {
    if (["10*9/l", "10e3/ul", "k/ul", "thousand/ul", "thousands/ul"].includes(u)) factor = 1;
    if (["/ul", "1/ul", "cells/ul", "{cells}/ul", "cells/mm3", "/mm3"].includes(u)) factor = 0.001;
  }
  if (analyte === "hemoglobin" && u === "g/l") factor = 0.1;
  if (analyte === "pco2" && u === "kpa") factor = 7.500616827;
  if (analyte === "lipase" && ["iu/l", "[iu]/l"].includes(u)) factor = 1;
  if (analyte === "troponin" && ["ng/l", "pg/ml"].includes(u)) factor = 0.001;
  if (analyte === "troponin" && u === "ug/l") factor = 1;
  if (factor === undefined) return undefined; // Do not relabel an unknown unit.
  const result = value * factor + offset;
  return Number.isFinite(result) ? Number(result.toPrecision(12)) : undefined;
}

function raceAdjusted(test: ObjectValue): boolean {
  const name = (str(test.name) ?? "").toLowerCase();
  const local = (str(test.local_code) ?? "").toLowerCase();
  if (/non[ -]?(?:african|black|aa)|without.*(?:race|coefficient)|race[ -]?free|2021/.test(name)
    || /(?:non|no|n)[_-]?aa|non[_-]?black/.test(local)) return false;
  return /african[ -]?american|\bblack\b|with (?:a )?race (?:coefficient|adjustment)|race[ -]adjusted/.test(name)
    || /(?:^|[_-])aa(?:$|[_-])|egfraa$|(?:^|[_-])black(?:$|[_-])/.test(local);
}

function equation(copy: LabCopy, collected: string): NonNullable<Observation["method"]>["text"] {
  const name = (str(copy.test.name) ?? "").toLowerCase();
  // The test display can state the method more specifically than its LOINC.
  if (/ckd[ -]?epi.*2021|2021.*ckd[ -]?epi/.test(name)) return "ckd-epi-2021";
  if (/ckd[ -]?epi.*2009|2009.*ckd[ -]?epi/.test(name)) return "ckd-epi-2009";
  if (/\bmdrd\b/.test(name)) return "mdrd";
  // This is a documented lab-wide method, not an equation inferred from the value.
  const collectedAt = instant(collected);
  if (collectedAt !== undefined && localDate(collectedAt) >= "2023-01-01") return "ckd-epi-2021";
  if (copy.test.loinc === "98979-8") return "ckd-epi-2021";
  return "unknown";
}

function observations(docs: Document[], makeId: ReturnType<typeof idFactory>): Observation[] {
  const copies = new Map<string, LabCopy>();
  for (const doc of docs) for (const { key: entryKey, value: entry } of doc.entries) {
    if (entry.type !== "result" && entry.type !== "panel") continue;
    const accession = str(entry.accession);
    const rank = entry.status === "corrected" ? 3 : entry.status === "final" ? 2 : entry.status === "preliminary" ? 1 : 0;
    if (!accession || rank === 0) continue;
    const values: unknown[] = entry.type === "panel" ? (Array.isArray(entry.components) ? entry.components : []) : [entry];
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (!object(value) || !object(value.test)) continue;
      const test = value.test, local = str(test.local_code);
      if (!local) continue;
      const key = keyOf(doc.issuer, doc.patient, accession, local);
      const candidate: LabCopy = {
        doc, key, value, test, rank, collected: entry.collected, specimen: entry.specimen,
        tie: keyOf(entryKey, String(i).padStart(10, "0")),
      };
      const previous = copies.get(key);
      if (!previous || rank > previous.rank || (rank === previous.rank &&
        (compareDocs(previous.doc, doc) < 0 || (compareDocs(previous.doc, doc) === 0 && cmp(previous.tie, candidate.tie) < 0)))) {
        copies.set(key, candidate);
      }
    }
  }
  const rows: Observation[] = [];
  const sorted = [...copies.values()].sort((a, b) =>
    (instant(a.collected) ?? 0) - (instant(b.collected) ?? 0) || cmp(a.key, b.key));
  for (const copy of sorted) {
    const analyte = identify(copy.test, copy.specimen), parsed = numeric(copy.value.value);
    const collected = str(copy.collected);
    if (!analyte || !parsed || !collected || instant(collected) === undefined) continue;
    if (analyte === "egfr" && raceAdjusted(copy.test)) continue;
    const value = convertedValue(analyte, parsed.value, copy.value.unit);
    if (value === undefined) continue;
    const unit = analytes[analyte].unit;
    const row: Observation = {
      resourceType: "Observation", id: makeId("lab", copy.key),
      meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab"] },
      status: copy.rank === 1 ? "preliminary" : "final",
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
      code: { text: analyte, coding: [
        { system: LOINC, code: str(copy.test.loinc) ?? analytes[analyte].loinc },
        { system: `urn:${copy.doc.issuer}:test-code`, code: str(copy.test.local_code)! },
      ] },
      subject: { reference: `Patient/${copy.doc.patient}` }, effectiveDateTime: collected,
      valueQuantity: {
        value, ...(parsed.comparator ? { comparator: parsed.comparator } : {}),
        unit, system: UCUM, code: analyte === "egfr" ? "mL/min/{1.73_m2}" : unit,
      },
    };
    if (analyte === "egfr") row.method = { text: equation(copy, collected) };
    rows.push(row);
  }
  return rows;
}

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  if (!Array.isArray(items) || typeof asOf !== "string" || !dateIsValid(asOf)) {
    return { medicationRequests: [], observations: [] };
  }
  const docs = currentDocuments(items, asOf), makeId = idFactory();
  return {
    medicationRequests: medications(medicationSnapshot(docs), makeId),
    observations: observations(docs, makeId),
  };
}
