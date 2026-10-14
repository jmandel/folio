import type {
  FolioItem, UsCoreRows, MedicationRequest, Observation, Quantity,
} from "../in/views/uscore";
import type { Analyte } from "../in/views/views";

// Riverside publishes signed snapshots, not medication-order or laboratory events.
type Obj = Record<string, unknown>;
type Doc = {
  item: Obj; id: string; issuer: string; patient: string; recorded: number;
  entries: [string, Obj][]; encounter?: Obj;
};
type LabCopy = {
  doc: Doc; entryId: string; value: Obj; test: Obj; accession: string;
  localCode: string; collected: unknown; specimen: unknown; rank: number;
};
type Frequency = "QD" | "BID" | "TID" | "QHS" | "QW" | "PRN" | "other";
type Equation = "ckd-epi-2021" | "ckd-epi-2009" | "mdrd" | "unknown";

const RXNORM = "http://www.nlm.nih.gov/research/umls/rxnorm";
const UCUM = "http://unitsofmeasure.org" as const;
const LAB_SYSTEM = "urn:riverside-regional:lab-test";
const medProfile = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest" as const;
const labProfile = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab" as const;

function obj(x: unknown): Obj | undefined {
  return x !== null && typeof x === "object" && !Array.isArray(x) ? x as Obj : undefined;
}
function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() ? x.trim() : undefined;
}
function cmp(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function key(...parts: string[]): string { return JSON.stringify(parts); }
function normalize(s: string): string { return s.toLowerCase().replace(/\s+/g, " ").trim(); }

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function localWall(ms: number): string {
  const parts = chicago.formatToParts(new Date(ms));
  const p = (type: string) => parts.find(v => v.type === type)?.value ?? "";
  return `${p("year")}-${p("month")}-${p("day")}T${p("hour")}:${p("minute")}:${p("second")}`;
}
function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const n = Date.parse(s + "T00:00:00Z");
  return Number.isFinite(n) && new Date(n).toISOString().slice(0, 10) === s;
}

// Offset-free timestamps are Chicago wall time, never the runtime's local zone.
// In a fall-back overlap choose the first occurrence. A nonexistent spring-forward
// wall time is retained with the pre-transition offset rather than silently lost.
function timestamp(x: unknown): { ms: number; fhir: string; localDate: string } | undefined {
  const s = str(x);
  if (!s) return undefined;
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/i.exec(s);
  if (!m || !validDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] ?? 0) > 59) return undefined;
  const wall = `${m[1]}T${m[2]}:${m[3]}:${m[4] ?? "00"}`;
  const full = wall + (m[5] ?? "");
  if (m[6]) {
    const zone = m[6].toUpperCase();
    if (zone !== "Z" && (+zone.slice(1, 3) > 23 || +zone.slice(4, 6) > 59)) return undefined;
    const ms = Date.parse(full + zone);
    return Number.isFinite(ms) ? { ms, fhir: full + zone, localDate: localWall(ms).slice(0, 10) } : undefined;
  }
  for (const offset of ["-05:00", "-06:00"]) {
    const ms = Date.parse(full + offset);
    if (localWall(ms) === wall) return { ms, fhir: full + offset, localDate: m[1] };
  }
  const ms = Date.parse(full + "-06:00");
  return { ms, fhir: full + "-06:00", localDate: m[1] };
}

function compareDocs(a: Doc, b: Doc): number {
  return a.recorded - b.recorded || cmp(a.issuer, b.issuer) || cmp(a.id, b.id);
}
function currentDocuments(items: unknown[], asOf: string): Doc[] {
  const scoped: Doc[] = [];
  for (const raw of items) {
    const item = obj(raw);
    if (!item) continue;
    const id = str(item.id), issuer = str(item.issuer), time = timestamp(item.recorded);
    if (!id || !issuer || !time || time.localDate > asOf) continue;
    const entries: [string, Obj][] = [];
    for (const [entryId, rawEntry] of Object.entries(obj(item.payload) ?? {}).sort(([a], [b]) => cmp(a, b))) {
      const entry = obj(rawEntry);
      if (entry) entries.push([entryId, entry]);
    }
    scoped.push({ item, id, issuer, patient: str(item.patient) ?? "", recorded: time.ms, entries,
      encounter: entries.find(([, e]) => e.type === "encounter")?.[1] });
  }
  // Process controls on ALL in-scope items, including superseded/retracted ones.
  // Thus A <- B <- C never resurrects A when B is no longer current.
  const removed = new Set<string>();
  for (const doc of scoped) {
    for (const field of ["supersedes", "retracts"]) {
      const ids = doc.item[field];
      if (Array.isArray(ids)) for (const id of ids) {
        if (typeof id === "string") removed.add(key(doc.issuer, id));
      }
    }
  }
  return scoped.filter(d => d.patient && !removed.has(key(d.issuer, d.id))).sort(compareDocs);
}

// IDs use clinical identity rather than an array position or a document's entry key.
// The collision guard also guarantees uniqueness for arbitrary input identifiers.
function idFactory(): (prefix: string, identity: string) => string {
  const used = new Set<string>();
  return (prefix, identity) => {
    let hash = 14695981039346656037n;
    for (let i = 0; i < identity.length; i++) {
      hash = BigInt.asUintN(64, (hash ^ BigInt(identity.charCodeAt(i))) * 1099511628211n);
    }
    const base = prefix + "-" + hash.toString(16).padStart(16, "0");
    let id = base, suffix = 1;
    while (used.has(id)) id = base + "-" + suffix++;
    used.add(id);
    return id;
  };
}

const ingredientCodes: Record<string, string> = {
  "6809": "metformin", "1545653": "empagliflozin", "52175": "losartan",
  "5487": "hydrochlorothiazide", "29046": "lisinopril", "274783": "insulin glargine",
};
const brands: Record<string, string> = {
  jardiance: "empagliflozin", glucophage: "metformin", fortamet: "metformin", glumetza: "metformin",
  cozaar: "losartan", hydrodiuril: "hydrochlorothiazide", microzide: "hydrochlorothiazide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  zestril: "lisinopril", prinivil: "lisinopril", farxiga: "dapagliflozin", invokana: "canagliflozin",
  steglatro: "ertugliflozin", januvia: "sitagliptin", tradjenta: "linagliptin",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  norvasc: "amlodipine", lasix: "furosemide", synthroid: "levothyroxine",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin",
  plavix: "clopidogrel", tylenol: "acetaminophen", advil: "ibuprofen",
};
function ingredient(name: string, rx?: string): string | undefined {
  if (rx && Object.hasOwn(ingredientCodes, rx)) return ingredientCodes[rx];
  let n = normalize(name).replace(/[®™]/g, "");
  const brand = Object.keys(brands).find(b => n === b || n.startsWith(b + " ") || n.startsWith(b + " ("));
  if (brand) return brands[brand];
  if (/\b(unknown|unspecified|unidentified|water pill|blood pressure pill|diabetes pill)\b/.test(n)) return undefined;
  // Strength, formulation and common salts are not the generic ingredient name.
  n = n.replace(/\s+\d.*$/, "")
    .replace(/\s*\((?:human|hcl|hydrochloride)\)/g, "")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|oral|subcutaneous|injectable|injection|tablets?|capsules?|solution|suspension|pen|vial|er|xr|sr|xl)\b/g, " ")
    .replace(/\s+(?:hydrochloride|hcl|succinate|tartrate|besylate|maleate|fumarate|mesylate|sulfate|phosphate|potassium|sodium)\s*$/, "")
    .replace(/\s+/g, " ").trim();
  // Do not remove the anion from explicitly named electrolyte ingredients.
  if (/^(?:potassium|sodium|magnesium|calcium)\b/.test(normalize(name))) {
    n = normalize(name).replace(/\s+\d.*$/, "").replace(/\s+(?:tablets?|capsules?|solution)\b.*$/, "");
  }
  return n || undefined;
}
function rxCode(e: Obj): string | undefined {
  const s = str(e.rxnorm_ingredient);
  return s && /^\d+$/.test(s) ? s : undefined;
}

function frequency(sig: string): Frequency | undefined {
  const s = normalize(sig).replace(/\./g, "");
  if (/\b(prn|as needed|when needed)\b/.test(s)) return "PRN";
  if (/\b(qhs|qpm|at bedtime|nightly|every night|each night)\b/.test(s)) return "QHS";
  if (/\b(qw|qweek|weekly|once (?:a|per) week|every 7 days)\b/.test(s)) return "QW";
  if (/\b(tid|three times (?:a |per )?(?:day|daily)|q8h|every 8 hours)\b/.test(s)) return "TID";
  if (/\b(bid|twice (?:a |per )?(?:day|daily)|two times (?:a |per )?(?:day|daily)|q12h|every 12 hours)\b/.test(s)) return "BID";
  if (/\b(q24h|every 24 hours)\b/.test(s)) return "QD";
  if (/\b(qid|qod|every other day|alternate days|four times|q\d+h|every \d+ hours)\b/.test(s)) return "other";
  if (/\b(qd|daily|once (?:a |per )?day|every day|each day|every morning)\b/.test(s)) return "QD";
  if (/\b(every|once|twice|times|mondays?|tuesdays?|wednesdays?|thursdays?|fridays?|saturdays?|sundays?|with (?:each |all )?meals)\b/.test(s)) return "other";
  return undefined;
}
function amount(s: string): number | undefined {
  const t = s.trim();
  if (t === "½") return 0.5;
  const f = /^(\d+)\/(\d+)$/.exec(t);
  const n = f ? (+f[2] === 0 ? NaN : +f[1] / +f[2]) : Number(t);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
function doseQuantity(dose: string, drug: string): Quantity | undefined {
  // Never truncate a range, sliding scale, or multiple different administrations.
  if (/\b(?:or|to|sliding|scale|titrate|titration|per kg)\b|\d\s*[-–]\s*\d/i.test(dose)) return undefined;
  const match = /^\s*(\d+(?:\.\d+)?|\.\d+|\d+\/\d+|½)\s*(mg|mcg|ug|[µμ]g|g|units?|unt|\[iu\]|iu|ml|tablets?|tabs?|capsules?|caps?)\b(.*)$/i.exec(dose);
  // A word boundary does not follow the closing bracket of [iU].
  const m = match ?? /^\s*(\d+(?:\.\d+)?)\s*(\[iu\])(.*)$/i.exec(dose);
  if (!m) return undefined;
  let value = amount(m[1]);
  if (value === undefined) return undefined;
  const rest = m[3].trim();
  if (rest && !/^(?:(?:po|oral(?:ly)?|subq|sc|sq|subcutaneously|daily|nightly|weekly|qd|bid|tid|qhs|qw|prn|at bedtime|with meals|once daily|twice daily)\s*)+$/i.test(rest)) return undefined;
  let unit: string, code: string;
  switch (m[2].toLowerCase()) {
    case "g": value *= 1000; unit = "mg"; code = "mg"; break;
    case "mg": unit = "mg"; code = "mg"; break;
    case "mcg": case "ug": case "µg": case "μg": unit = "mcg"; code = "ug"; break;
    case "ml": unit = "mL"; code = "mL"; break;
    case "unit": case "units": case "unt": case "[iu]": case "iu": unit = "units"; code = "[iU]"; break;
    default: {
      const strengths = [...drug.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg|ug|[µμ]g|g)\b/gi)];
      if (strengths.length === 1 && !/\b(?:mg|mcg|ug|g)\s*\//i.test(drug)) {
        const strength = doseQuantity(`${strengths[0][1]} ${strengths[0][2]}`, "");
        if (strength) return { ...strength, value: clean(value * strength.value) };
      }
      if (/^cap/i.test(m[2])) return undefined;
      unit = "tablet"; code = "{tbl}";
    }
  }
  return Number.isFinite(value) ? { value: clean(value), unit, system: UCUM, code } : undefined;
}
function stopReason(text: string): string | undefined {
  if (/\b(adverse (?:effect|reaction|event)|side effects?|allerg(?:y|ic)|intoleran\w*|due to (?:cough|rash|angioedema|hypoglycemia|hyperkalemia|ketoacidosis|lactic acidosis))\b/i.test(text)) return "adverse_reaction";
  if (/\b(ineffective|not (?:working|effective)|lack of (?:effect|efficacy)|no benefit)\b/i.test(text)) return "ineffective";
  if (/\b(replaced (?:by|with)|switch(?:ed|ing)? to|changed to|therapy changed)\b/i.test(text)) return "therapy_changed";
  if (/\b(course (?:is )?(?:complete|completed|finished)|completed (?:the )?(?:course|treatment))\b/i.test(text)) return "course_complete";
  if (/\b(patient (?:declined|refused|requested|prefers|choice)|at (?:the )?patient'?s request)\b/i.test(text)) return "patient_choice";
  if (/\b(because|due to|reason:)\b/i.test(text)) return "other";
  return undefined;
}

function medications(docs: Doc[], makeId: ReturnType<typeof idFactory>): MedicationRequest[] {
  const byEncounter = new Map<string, Doc>();
  for (const doc of docs) {
    const enc = doc.encounter, encounterId = enc && str(enc.encounter_id);
    if (!enc || !encounterId || !["ed_note", "hp", "progress_note", "consult", "discharge_summary"].includes(str(enc.document_kind) ?? "")) continue;
    const k = key(doc.issuer, doc.patient, encounterId), previous = byEncounter.get(k);
    const discharge = enc.document_kind === "discharge_summary";
    const previousDischarge = previous?.encounter?.document_kind === "discharge_summary";
    if (!previous || (discharge && !previousDischarge) || (discharge === previousDischarge && compareDocs(doc, previous) > 0)) byEncounter.set(k, doc);
  }
  const doc = [...byEncounter.values()].sort(compareDocs).at(-1);
  if (!doc) return [];
  type Med = { e: Obj; entryId: string; name: string; generic?: string; rx?: string };
  const lines: Med[] = [];
  for (const [entryId, e] of doc.entries) {
    const name = str(e.drug_name);
    if (e.type !== "home_med" || !name || !["not_reconciled", "continue", "held", "stopped", "new", "changed"].includes(str(e.status) ?? "")) continue;
    const rx = rxCode(e);
    lines.push({ e, entryId, name, generic: ingredient(name, rx), rx });
  }
  // Uncoded and coded duplicates can be joined when the recorded names agree.
  const nameCodes = new Map<string, Set<string>>();
  for (const line of lines) if (line.generic && line.rx) {
    const codes = nameCodes.get(line.generic) ?? new Set<string>();
    codes.add(line.rx); nameCodes.set(line.generic, codes);
  }
  const chosen = new Map<string, Med>();
  const priority = (m: Med) => m.e.status === "changed" ? 3 : m.e.status === "new" ? 2 : m.e.status === "not_reconciled" ? 0 : 1;
  for (const line of lines) {
    const codes = line.generic ? nameCodes.get(line.generic) : undefined;
    const identityCode = line.rx ?? (codes?.size === 1 ? [...codes][0] : undefined);
    const k = identityCode ? "rx:" + identityCode : "name:" + (line.generic ?? normalize(line.name));
    const prior = chosen.get(k);
    if (!prior || priority(line) > priority(prior) || (priority(line) === priority(prior) && cmp(line.entryId, prior.entryId) > 0)) chosen.set(k, line);
  }
  const rows: MedicationRequest[] = [];
  for (const [identity, line] of [...chosen.entries()].sort(([a], [b]) => cmp(a, b))) {
    const { e, name, generic, rx } = line;
    const reported = e.status === "not_reconciled";
    const status: MedicationRequest["status"] = e.status === "held" ? "on-hold" : e.status === "stopped" ? "stopped" : reported ? "unknown" : "active";
    const row: MedicationRequest = {
      resourceType: "MedicationRequest", id: makeId("med", key(doc.issuer, doc.patient, identity)),
      meta: { profile: [medProfile] }, status, intent: reported ? "plan" : "order", reportedBoolean: reported,
      medicationCodeableConcept: rx ? {
        text: name, coding: [{ system: RXNORM, code: rx, ...(generic ? { display: generic } : {}) }],
      } : { text: name + (generic ? ` (${generic})` : "") },
      subject: { reference: "Patient/" + doc.patient },
    };
    if (!reported) row.requester = { display: str(obj(doc.item.author)?.name) ?? "Riverside Regional Hospital" };
    // HomeMed has no line start date. Document effective/recorded timestamps are
    // not medication start dates, especially on discharge summaries.
    const instructions = str(e.instructions);
    if (instructions && (status === "on-hold" || status === "stopped")) {
      row.statusReason = { text: instructions };
      const reason = status === "stopped" ? stopReason(instructions) : undefined;
      if (reason) row.statusReason.coding = [{ system: "urn:folio:stop-reason", code: reason }];
    }
    const sig = str(e.sig), dose = str(e.dose_text);
    const quantity = dose ? doseQuantity(dose, name) : undefined;
    const freq = sig ? frequency(sig) : undefined;
    if (sig || quantity || freq) row.dosageInstruction = [{
      ...(sig ? { text: sig } : {}), ...(freq ? { timing: { code: { text: freq } } } : {}),
      ...(quantity ? { doseAndRate: [{ doseQuantity: quantity }] } : {}),
    }];
    rows.push(row);
  }
  return rows;
}

const tests: Record<Analyte, { loinc: string; unit: string }> = {
  creatinine: { loinc: "2160-0", unit: "mg/dL" }, egfr: { loinc: "98979-8", unit: "mL/min/1.73m2" },
  potassium: { loinc: "2823-3", unit: "mmol/L" }, sodium: { loinc: "2951-2", unit: "mmol/L" },
  chloride: { loinc: "2075-0", unit: "mmol/L" }, bicarbonate: { loinc: "2028-9", unit: "mmol/L" },
  anion_gap: { loinc: "33037-3", unit: "mmol/L" }, bun: { loinc: "3094-0", unit: "mg/dL" },
  glucose: { loinc: "2345-7", unit: "mg/dL" }, a1c: { loinc: "4548-4", unit: "%" },
  uacr: { loinc: "9318-7", unit: "mg/g" }, platelets: { loinc: "777-3", unit: "10*3/uL" },
  wbc: { loinc: "6690-2", unit: "10*3/uL" }, hemoglobin: { loinc: "718-7", unit: "g/dL" },
  bhb: { loinc: "53060-9", unit: "mmol/L" }, ph: { loinc: "2746-6", unit: "[pH]" },
  pco2: { loinc: "2021-4", unit: "mmHg" }, lipase: { loinc: "3040-3", unit: "U/L" },
  troponin: { loinc: "10839-9", unit: "ng/mL" }, cholesterol: { loinc: "2093-3", unit: "mg/dL" },
  triglycerides: { loinc: "2571-8", unit: "mg/dL" }, hdl: { loinc: "2085-9", unit: "mg/dL" },
  ldl: { loinc: "13457-7", unit: "mg/dL" },
};
const localTests: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", SCR: "creatinine", CR: "creatinine",
  EGFR: "egfr", NA: "sodium", K: "potassium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap", BUN: "bun", GLU: "glucose", GLUCOSE: "glucose",
  A1C: "a1c", HBA1C: "a1c", UACR: "uacr", MACR: "uacr", PLT: "platelets", PLATELETS: "platelets",
  WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", VPH: "ph", APH: "ph", PH: "ph",
  VPCO2: "pco2", APCO2: "pco2", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase",
  TNI: "troponin", TROPONINI: "troponin", TROP_I: "troponin", CHOL: "cholesterol", TC: "cholesterol",
  TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDLC: "ldl", LDL: "ldl",
};
const loincTests: Record<string, Analyte> = {};
for (const [analyte, spec] of Object.entries(tests)) loincTests[spec.loinc] = analyte as Analyte;
// Alternative codes encountered for the same tracked measurements. Source codes
// are retained verbatim in the output, including older eGFR code systems.
for (const code of ["33914-3", "48642-3", "48643-1", "62238-1", "62239-9", "69405-9"]) loincTests[code] = "egfr";
loincTests["18262-6"] = "ldl";
loincTests["17856-6"] = "a1c";
loincTests["14959-1"] = "uacr";

function analyteOf(copy: LabCopy): Analyte | undefined {
  const name = normalize(str(copy.test.name) ?? "");
  const local = copy.localCode.toUpperCase();
  const loinc = str(copy.test.loinc);
  let analyte = loinc && Object.hasOwn(loincTests, loinc) ? loincTests[loinc] : undefined;
  if (!analyte) {
    if (/\b(?:egfr|estimated glomerular filtration|glomerular filtration rate)\b/.test(name) || /^E?GFR(?:[_-]|$)/.test(local)) analyte = "egfr";
    else if (/(?:albumin|microalbumin).*creatinine.*(?:ratio|\/)|(?:albumin|microalbumin)\s*\/\s*creatinine|\buacr\b/.test(name)) analyte = "uacr";
    else if (/\b(?:hba1c|a1c|hemoglobin a1c|glycated hemoglobin|glycosylated hemoglobin)\b/.test(name)) analyte = "a1c";
    else if (/\b(?:beta[ -]?hydroxybutyrate|3[ -]hydroxybutyrate|bhb)\b/.test(name) || /β[ -]?hydroxybutyrate/.test(name)) analyte = "bhb";
    else if (/\bcreatinine\b/.test(name) && !/clearance|ratio/.test(name)) analyte = "creatinine";
    else if (/\bpotassium\b/.test(name)) analyte = "potassium";
    else if (/\bsodium\b/.test(name)) analyte = "sodium";
    else if (/\bchloride\b/.test(name)) analyte = "chloride";
    else if (/\b(?:bicarbonate|total co2|carbon dioxide.*total)\b/.test(name)) analyte = "bicarbonate";
    else if (/\banion gap\b/.test(name)) analyte = "anion_gap";
    else if (/\b(?:urea nitrogen|bun)\b/.test(name)) analyte = "bun";
    else if (/\bglucose\b/.test(name)) analyte = "glucose";
    else if (/^(?:platelets?|platelet count)(?:$|[,\s])/.test(name) && !/immature|volume|fraction|distribution/.test(name)) analyte = "platelets";
    else if (/^(?:white blood cells?|leukocytes?|wbc)(?:$|[,\s])/.test(name) && !/differential|fraction/.test(name)) analyte = "wbc";
    else if (/^(?:hemoglobin|haemoglobin|hgb)(?:$|,|\s+(?:blood|total|concentration))/.test(name)) analyte = "hemoglobin";
    else if (/^(?:ph|blood gas ph)(?:$|[,\s])/.test(name)) analyte = "ph";
    else if (/\b(?:pco2|carbon dioxide partial pressure)\b/.test(name)) analyte = "pco2";
    else if (/\blipase\b/.test(name)) analyte = "lipase";
    else if (/\btroponin[ -]?i\b/.test(name)) analyte = "troponin";
    else if (/\b(?:hdl|high.density lipoprotein)\b/.test(name) && !/ratio|non.hdl|phospholipid|particle|apolipoprotein/.test(name)) analyte = "hdl";
    else if (/\b(?:ldl|low.density lipoprotein)\b/.test(name) && !/vldl|ratio|phospholipid|particle|apolipoprotein/.test(name)) analyte = "ldl";
    else if (/\btriglycerides?\b/.test(name)) analyte = "triglycerides";
    else if (/\bcholesterol\b/.test(name) && !/ratio|non.hdl|vldl/.test(name)) analyte = "cholesterol";
    else analyte = Object.hasOwn(localTests, local) ? localTests[local] : undefined;
  }
  if (!analyte) return undefined;
  const specimen = normalize(str(copy.specimen) ?? "");
  // Ratios, urine chemistry and non-blood specimens are not serum analytes.
  if (analyte !== "uacr" && /\b(?:urine|urinary|csf|cerebrospinal|pleural|ascitic|peritoneal|stool|saliva)\b/.test(name + " " + specimen)) return undefined;
  if (analyte === "glucose" && /\b(?:whole blood|capillary|fingerstick|meter)\b/.test(name + " " + specimen)) return undefined;
  if (analyte === "bicarbonate" && /\b(?:blood gas|arterial|venous|calculated)\b/.test(name + " " + specimen) && !/total co2|total carbon dioxide|carbon dioxide.*total/.test(name)) return undefined;
  if (analyte === "troponin" && /\btroponin[ -]?t\b/.test(name)) return undefined;
  return analyte;
}
function raceAdjusted(copy: LabCopy): boolean {
  const loinc = str(copy.test.loinc);
  const name = normalize(str(copy.test.name) ?? "");
  const local = copy.localCode.toUpperCase();
  if (/\b(?:non[ -]?(?:african[ -]?american|black)|without (?:the )?race|race[ -]?free|no race)\b/.test(name) || /(?:^|[_-])(?:NAA|NONAA|NON_AA|NONBLACK)(?:$|[_-])/.test(local)) return false;
  return /\b(?:african[ -]?american|black|with (?:the )?race coefficient|race[ -]?adjusted)\b/.test(name)
    || /(?:^|[_-])(?:AA|BLACK)(?:$|[_-])/.test(local) || loinc === "48643-1" || loinc === "62239-9";
}
function egfrEquation(copy: LabCopy, collected: string): Equation {
  const name = str(copy.test.name) ?? "";
  if (/CKD[ -]?EPI.*2021|2021.*CKD[ -]?EPI/i.test(name)) return "ckd-epi-2021";
  if (/CKD[ -]?EPI.*2009|2009.*CKD[ -]?EPI/i.test(name)) return "ckd-epi-2009";
  if (/MDRD/i.test(name)) return "mdrd";
  // The source documentation explicitly identifies all Riverside calculations
  // since 2023 as CKD-EPI 2021; an old code alone must not override that statement.
  if (collected.slice(0, 4) >= "2023") return "ckd-epi-2021";
  const code = str(copy.test.loinc);
  if (code === "98979-8") return "ckd-epi-2021";
  if (code && ["62238-1", "62239-9", "69405-9"].includes(code)) return "ckd-epi-2009";
  if (code && ["33914-3", "48642-3", "48643-1"].includes(code)) return "mdrd";
  return "unknown";
}
function numeric(x: unknown): { value: number; comparator?: Quantity["comparator"] } | undefined {
  const s = str(x);
  if (!s) return undefined;
  const m = /^(<=|>=|<|>|≤|≥)?\s*([+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(s);
  if (!m) return undefined;
  const value = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(value)) return undefined;
  const comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as Quantity["comparator"];
  return { value, ...(comparator ? { comparator } : {}) };
}
function unitKey(s: string): string {
  return s.toLowerCase().replace(/[µμ]/g, "u").replace(/²/g, "2").replace(/³/g, "3")
    .replace(/\s/g, "").replace(/\^/g, "*");
}
function clean(n: number): number { return Number(n.toPrecision(12)); }
function convert(value: number, unit: unknown, analyte: Analyte): number | undefined {
  const source = str(unit), u = unitKey(source ?? ""), target = unitKey(tests[analyte].unit);
  if (u === target) return value;
  if (analyte === "ph" && ["", "1", "ph"].includes(u)) return value;
  if (analyte === "egfr" && ["ml/min/{1.73_m2}", "ml/min/1.73m*2", "ml/min/1.73m2", "ml/min/1.73(m2)"].includes(u)) return value;
  if (analyte === "uacr" && ["ug/mg", "mg/gcreatinine", "mg/g{creat}"].includes(u)) return value;
  if (analyte === "lipase" && u === "iu/l") return value;
  if (analyte === "pco2" && u === "mm[hg]") return value;
  if (analyte === "a1c" && ["percent", "%{ngsp}"].includes(u)) return value;
  if (["sodium", "potassium", "chloride", "bicarbonate", "anion_gap"].includes(analyte) && u === "meq/l") return value;
  if (["platelets", "wbc"].includes(analyte)) {
    if (["10*9/l", "x10*3/ul", "10³/ul", "k/ul", "thousand/ul", "thousands/ul"].includes(u)) return value;
    if (["/ul", "1/ul", "cells/ul", "{cells}/ul"].includes(u)) return clean(value / 1000);
  }
  if (analyte === "creatinine" && u === "umol/l") return clean(value / 88.4);
  if (analyte === "glucose" && u === "mmol/l") return clean(value * 18.016);
  if (analyte === "bun" && u === "mmol/l") return clean(value * 2.801);
  if (["cholesterol", "hdl", "ldl"].includes(analyte) && u === "mmol/l") return clean(value * 38.67);
  if (analyte === "triglycerides" && u === "mmol/l") return clean(value * 88.57);
  if (analyte === "hemoglobin" && u === "g/l") return clean(value / 10);
  if (analyte === "troponin" && ["ng/l", "pg/ml"].includes(u)) return clean(value / 1000);
  if (analyte === "uacr" && u === "mg/mmol") return clean(value * 8.84);
  if (analyte === "pco2" && u === "kpa") return clean(value * 7.500616827);
  if (target === "mg/dl" && u === "mg/l") return clean(value / 10);
  return undefined; // Unknown dimensional meaning is not a numeric result we can safely report.
}

function observations(docs: Doc[], makeId: ReturnType<typeof idFactory>): Observation[] {
  const copies = new Map<string, LabCopy>();
  for (const doc of docs) for (const [entryId, e] of doc.entries) {
    if (e.type !== "result" && e.type !== "panel") continue;
    const accession = str(e.accession);
    const rank = e.status === "corrected" ? 3 : e.status === "final" ? 2 : e.status === "preliminary" ? 1 : 0;
    if (!accession || !rank) continue;
    const components = e.type === "result" ? [e] : Array.isArray(e.components) ? e.components : [];
    for (let index = 0; index < components.length; index++) {
      const value = obj(components[index]), test = value && obj(value.test);
      const localCode = test && str(test.local_code);
      if (!value || !test || !localCode) continue;
      const identity = key(doc.issuer, doc.patient, accession, localCode);
      const copy: LabCopy = { doc, entryId: entryId + ":" + index, value, test, accession, localCode,
        collected: e.collected, specimen: e.specimen, rank };
      const prior = copies.get(identity);
      if (!prior || rank > prior.rank || (rank === prior.rank && (compareDocs(doc, prior.doc) > 0 ||
        (compareDocs(doc, prior.doc) === 0 && cmp(copy.entryId, prior.entryId) > 0)))) copies.set(identity, copy);
    }
  }
  const rows: Observation[] = [];
  for (const [identity, copy] of [...copies.entries()].sort(([a], [b]) => cmp(a, b))) {
    // Selection precedes parsing: a corrected text-only result must suppress an
    // earlier numeric copy, not accidentally bring that old number back.
    const analyte = analyteOf(copy), parsed = numeric(copy.value.value), collected = timestamp(copy.collected);
    if (!analyte || !parsed || !collected || (analyte === "egfr" && raceAdjusted(copy))) continue;
    const value = convert(parsed.value, copy.value.unit, analyte);
    if (value === undefined || !Number.isFinite(value)) continue;
    const spec = tests[analyte], name = str(copy.test.name);
    const row: Observation = {
      resourceType: "Observation", id: makeId("lab", identity), meta: { profile: [labProfile] },
      status: copy.rank >= 2 ? "final" : "preliminary",
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
      code: { text: analyte, coding: [
        { system: "http://loinc.org", code: str(copy.test.loinc) ?? spec.loinc, ...(name ? { display: name } : {}) },
        { system: LAB_SYSTEM, code: copy.localCode, ...(name ? { display: name } : {}) },
      ] },
      subject: { reference: "Patient/" + copy.doc.patient }, effectiveDateTime: collected.fhir,
      valueQuantity: { value, ...(parsed.comparator ? { comparator: parsed.comparator } : {}),
        unit: spec.unit, system: UCUM, code: analyte === "egfr" ? "mL/min/{1.73_m2}" : spec.unit },
    };
    if (analyte === "egfr") row.method = { text: egfrEquation(copy, collected.fhir) };
    rows.push(row);
  }
  return rows;
}

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  if (!Array.isArray(items) || typeof asOf !== "string" || !validDate(asOf)) return { medicationRequests: [], observations: [] };
  const docs = currentDocuments(items, asOf), makeId = idFactory();
  return { medicationRequests: medications(docs, makeId), observations: observations(docs, makeId) };
}
