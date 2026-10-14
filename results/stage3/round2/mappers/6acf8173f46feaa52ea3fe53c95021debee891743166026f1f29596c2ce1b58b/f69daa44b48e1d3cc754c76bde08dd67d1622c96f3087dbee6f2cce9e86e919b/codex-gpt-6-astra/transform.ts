import type {
  FolioItem, UsCoreRows, MedicationRequest, Observation, Quantity,
} from "../in/views/uscore";
import type { Analyte } from "../in/views/views";

type Obj = Record<string, unknown>;
type Time = { instant: number; date: string; fhir: string };
type Item = {
  id: string; issuer: string; patient: string; recorded: Time;
  effective?: Time; payload: Obj; supersedes: string[]; retracts: string[];
};
type Entry = { item: Item; entryId: string; data: Obj };
type Med = Entry & { action: "start" | "change" | "hold" | "resume" | "stop" };
type Equation = NonNullable<Observation["method"]>["text"];

const UCUM = "http://unitsofmeasure.org";
const RXNORM = "http://www.nlm.nih.gov/research/umls/rxnorm";
const LOINC = "http://loinc.org";
const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function object(x: unknown): Obj | undefined {
  return x !== null && typeof x === "object" && !Array.isArray(x) ? x as Obj : undefined;
}
function string(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x : undefined;
}
function strings(x: unknown): string[] {
  return Array.isArray(x) ? x.filter((v): v is string => typeof v === "string") : [];
}
function number(x: unknown): number | undefined {
  return typeof x === "number" && Number.isFinite(x) ? x : undefined;
}
function key(...parts: string[]): string { return JSON.stringify(parts); }
function cmp(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }

function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || s.slice(0, 4) === "0000") return false;
  const t = Date.parse(s + "T00:00:00Z");
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === s;
}
function wallTime(instant: number): string {
  const parts = chicago.formatToParts(new Date(instant));
  const get = (name: string) => parts.find(p => p.type === name)?.value ?? "";
  return `${get("year").padStart(4, "0")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}
// Convert local wall time without consulting the host's time zone. Offset-bearing times retain
// their original spelling. Partial dates are padded only internally for chronological sorting.
function time(value: unknown): Time | undefined {
  const s = string(value);
  if (!s) return undefined;
  const partial = /^\d{4}(?:-\d{2})?(?:-\d{2})?$/.test(s);
  const padded = partial ? s + (s.length === 4 ? "-01-01" : s.length === 7 ? "-01" : "") : s.slice(0, 10);
  if (!validDate(padded)) return undefined;
  if (!partial && !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?$/.test(s)) return undefined;
  const hasOffset = !partial && /(?:Z|[+-]\d{2}:\d{2})$/.test(s);
  if (hasOffset) {
    const instant = Date.parse(s);
    return Number.isFinite(instant) ? { instant, date: wallTime(instant).slice(0, 10),
      fhir: s.replace(/(T\d{2}:\d{2})(?=Z|[+-])/, "$1:00") } : undefined;
  }
  const wall = partial ? padded + "T00:00:00" : s;
  const naive = Date.parse(wall + "Z");
  if (!Number.isFinite(naive)) return undefined;
  // Northgate's two Chicago offsets; choosing the earlier instant resolves an ambiguous fall-back
  // wall time deterministically. Nonexistent spring-forward wall times are not readable instants.
  for (const hours of [5, 6]) {
    const instant = naive + hours * 3600000;
    if (wallTime(instant).slice(0, 16) === wall.slice(0, 16)) {
      return { instant, date: partial ? s : padded, fhir: partial ? s : `${s.length === 16 ? s + ":00" : s}-0${hours}:00` };
    }
  }
  return undefined;
}

function currentItems(input: unknown, asOf: string): Item[] {
  if (!Array.isArray(input) || !validDate(asOf)) return [];
  const scoped: Item[] = [];
  for (const raw of input) {
    const r = object(raw);
    if (!r) continue;
    const id = string(r.id), issuer = string(r.issuer), patient = string(r.patient);
    const recorded = time(r.recorded);
    if (!id || !issuer || !patient || !recorded || !recorded.fhir.includes("T") || recorded.date > asOf) continue;
    scoped.push({ id, issuer, patient, recorded, effective: time(r.effective),
      payload: object(r.payload) ?? {}, supersedes: strings(r.supersedes), retracts: strings(r.retracts) });
  }
  // Every in-scope link applies, including links on an item that was itself replaced/withdrawn.
  // Taking the union also removes all ancestors of a supersession chain, without resurrecting them.
  const removed = new Set<string>();
  for (const i of scoped) for (const id of [...i.supersedes, ...i.retracts]) removed.add(key(i.issuer, id));
  return scoped.filter(i => !removed.has(key(i.issuer, i.id))).sort((a, b) =>
    a.recorded.instant - b.recorded.instant || cmp(a.issuer, b.issuer) || cmp(a.id, b.id));
}
function compareEntries(a: Entry, b: Entry): number {
  return (a.item.effective?.instant ?? a.item.recorded.instant) - (b.item.effective?.instant ?? b.item.recorded.instant)
    || a.item.recorded.instant - b.item.recorded.instant || cmp(a.item.issuer, b.item.issuer)
    || cmp(a.item.id, b.item.id) || cmp(a.entryId, b.entryId);
}

// These are name aliases, not a product-CUI -> ingredient-CUI crosswalk. Product RxNorm codes
// are carried through verbatim and never presented as ingredient-level codes.
const brands: Record<string, string> = {
  jardiance: "empagliflozin", invokana: "canagliflozin", farxiga: "dapagliflozin",
  steglatro: "ertugliflozin", glucophage: "metformin", fortamet: "metformin", glumetza: "metformin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", saxenda: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  glucotrol: "glipizide", amaryl: "glimepiride", actos: "pioglitazone",
  cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan",
  prinivil: "lisinopril", zestril: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  norvasc: "amlodipine", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide",
  aldactone: "spironolactone", inspra: "eplerenone", kerendia: "finerenone",
  microzide: "hydrochlorothiazide", hygroton: "chlorthalidone",
  lopressor: "metoprolol", toprol: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  zetia: "ezetimibe", tricor: "fenofibrate", synthroid: "levothyroxine", levoxyl: "levothyroxine",
  zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine",
  wellbutrin: "bupropion", cymbalta: "duloxetine", effexor: "venlafaxine", remeron: "mirtazapine",
  eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", plavix: "clopidogrel",
  prilosec: "omeprazole", protonix: "pantoprazole", nexium: "esomeprazole", pepcid: "famotidine",
  neurontin: "gabapentin", lyrica: "pregabalin", ventolin: "albuterol", proair: "albuterol",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  // Combination products remain one medication; do not invent separate prescriptions or doses.
  janumet: "metformin / sitagliptin", synjardy: "empagliflozin / metformin",
  xigduo: "dapagliflozin / metformin", invokamet: "canagliflozin / metformin",
  hyzaar: "hydrochlorothiazide / losartan", entresto: "sacubitril / valsartan",
};
function ingredient(name: string): string | undefined {
  let s = name.toLowerCase().trim();
  if (/\b(?:unknown|unspecified|unidentified|water pill|blood pressure pill|diabetes pill)\b/.test(s)) return undefined;
  // RxNorm names can start with a package volume or release duration.
  s = s.replace(/^\d+(?:\.\d+)?\s*(?:ml|l|hr|hours?)\s+/, "");
  // Prefer an explicit generic name before a bracketed brand.
  s = s.replace(/\[[^\]]*\]/g, "");
  s = s.replace(/\d+(?:\.\d+)?\s*(?:mg|mcg|ug|µg|g|unt|units?|iu|meq|mmol|%)\b(?:\s*\/\s*(?:\d+(?:\.\d+)?\s*)?(?:ml|l|mg|g|actuat(?:ion)?|dose|hr|h)\b)?/g, " ");
  s = s.replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:extended|delayed|immediate|sustained|controlled)[ -]release\b/g, " ")
    .replace(/\b(?:oral|subcutaneous|injectable|injection|pen|injector|prefilled|solution|suspension|tablet[s]?|capsule[s]?|tab[s]?|cap[s]?|er|xr|xl|sr|dr|odt|solostar|kwikpen|flextouch|flexpen)\b/g, " ")
    .replace(/\b(?:hydrochloride|hcl|succinate|tartrate|besylate|besilate|fumarate|maleate|mesylate|monohydrate|dihydrate)\b/g, " ")
    .replace(/\b(losartan) potassium\b/g, "$1")
    .replace(/\b(atorvastatin|rosuvastatin) calcium\b/g, "$1")
    .replace(/\b(levothyroxine|diclofenac|naproxen|pravastatin) sodium\b/g, "$1")
    .replace(/\b(metoprolol) (?:succinate|tartrate)\b/g, "$1")
    .replace(/\s+/g, " ").trim();
  const components = s.replace(/[®™]/g, "").split(/\s*\/\s*|\s+and\s+/).map(v => v.trim()).filter(Boolean);
  // Do not identify combination/modified brands such as "Advil PM" as the plain brand's drug.
  if (components.some(c => Object.keys(brands).some(b => c.startsWith(b + " ")))) return undefined;
  s = components.flatMap(c => (Object.prototype.hasOwnProperty.call(brands, c) ? brands[c] : c).split(" / ")).sort(cmp).join(" / ");
  return s && /[a-z]/.test(s) && !/\d/.test(s) ? s : undefined;
}

function quantity(value: number, unit: string, code = unit): Quantity {
  return { value, unit, system: UCUM, code };
}
function dose(data: Obj, name: string): Quantity | undefined {
  const d = object(data.dose);
  const value = number(d?.value), unit = string(d?.unit)?.trim().toLowerCase();
  if (value === undefined || value < 0 || !unit) return undefined;
  if (["unit", "units", "unt", "iu", "[iu]"].includes(unit)) return quantity(value, "units", "[iU]");
  if (["mcg", "ug", "µg"].includes(unit)) return quantity(value, "mcg", "ug");
  if (unit === "mg") return quantity(value, "mg");
  if (unit === "ml") return quantity(value, "mL");
  if (unit === "g") return Number.isFinite(value * 1000) ? quantity(value * 1000, "mg") : undefined;
  if (!["tab", "tabs", "tablet", "tablets", "{tbl}"].includes(unit)) return undefined;
  const strengths = [...name.matchAll(/(\d+(?:\.\d+)?)\s*(mcg|µg|ug|mg|g)\b/gi)];
  if (strengths.length === 1) {
    const m = strengths[0];
    const tail = name.slice((m.index ?? 0) + m[0].length);
    // A concentration (mg/mL) is not a tablet strength.
    if (!/^\s*\/\s*(?:\d+(?:\.\d+)?\s*)?(?:ml|l|hr|h)\b/i.test(tail)) {
      const strength = Number(m[1]), strengthUnit = m[2].toLowerCase();
      const total = value * strength * (strengthUnit === "g" ? 1000 : 1);
      if (Number.isFinite(total)) return ["mcg", "µg", "ug"].includes(strengthUnit)
        ? quantity(total, "mcg", "ug") : quantity(total, "mg");
    }
  }
  return quantity(value, "tablet", "{tbl}");
}

type MedLine = { latest: Med; began?: string; activeSince?: string; name?: string; ingredient?: string };
function medicationLines(entries: Entry[]): MedLine[] {
  const histories = new Map<string, Med[]>();
  for (const e of entries) {
    const id = string(e.data.med_id), action = e.data.action;
    if (e.data.type !== "med_event" || !id || !e.item.effective ||
      (action !== "start" && action !== "change" && action !== "hold" && action !== "resume" && action !== "stop")) continue;
    const k = key(e.item.issuer, e.item.patient, id);
    const list = histories.get(k) ?? [];
    list.push({ ...e, action }); histories.set(k, list);
  }
  const byIngredient = new Map<string, MedLine>();
  for (const history of histories.values()) {
    history.sort(compareEntries);
    const latest = history[history.length - 1];
    const name = string(object(latest.data.drug)?.name);
    const ing = name ? ingredient(name) : undefined;
    const line: MedLine = { latest, name, ingredient: ing };
    for (const e of history) {
      if (e.action === "start") {
        line.began ??= e.item.effective?.date;
        line.activeSince = e.item.effective?.date;
      } else if (e.action === "resume") line.activeSince = e.item.effective?.date;
      else if (e.action === "hold" || e.action === "stop") line.activeSince = undefined;
    }
    const k = key(latest.item.issuer, latest.item.patient, ing ? "ingredient" : "line", ing ?? String(latest.data.med_id));
    const old = byIngredient.get(k);
    if (!old || compareEntries(old.latest, latest) < 0) byIngredient.set(k, line);
  }
  return [...byIngredient.values()].sort((a, b) => compareEntries(a.latest, b.latest));
}

function medication(line: MedLine, id: string): MedicationRequest | undefined {
  const { latest: e, name, ingredient: ing } = line;
  if (!name || (e.data.origin !== "northgate" && e.data.origin !== "outside")) return undefined;
  const outside = e.data.origin === "outside";
  const status = e.action === "hold" ? "on-hold" : e.action === "stop" ? "stopped" : "active";
  const rxnorm = string(object(e.data.drug)?.rxnorm);
  const row: MedicationRequest = {
    resourceType: "MedicationRequest", id,
    meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
    status, intent: outside ? "plan" : "order", reportedBoolean: outside,
    medicationCodeableConcept: rxnorm
      ? { coding: [{ system: RXNORM, code: rxnorm }], text: name }
      : { text: name + (ing ? ` (${ing})` : "") },
    subject: { reference: `Patient/${e.item.patient}` },
  };
  // The envelope author is the entering user, not a documented prescriber.
  if (!outside) row.requester = { display: "Northgate Family Medicine" };
  const authoredOn = status === "active" ? line.activeSince ?? line.began : line.began;
  if (authoredOn) row.authoredOn = authoredOn;
  if (status === "on-hold" || status === "stopped") {
    const reason = string(e.data.reason_text);
    const stopReason = string(e.data.stop_reason);
    const coded = status === "stopped" && stopReason &&
      ["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(stopReason);
    if (reason || coded) row.statusReason = {
      ...(reason ? { text: reason } : {}),
      ...(coded ? { coding: [{ system: "urn:folio:stop-reason", code: stopReason }] } : {}),
    };
  }
  const instruction: NonNullable<MedicationRequest["dosageInstruction"]>[number] = {};
  const sig = string(e.data.sig);
  if (sig) instruction.text = sig;
  const frequency = e.data.frequency;
  if (frequency === "QD" || frequency === "BID" || frequency === "TID" || frequency === "QHS" || frequency === "PRN") {
    instruction.timing = { code: { text: frequency } };
  } else if (frequency === "OTHER") instruction.timing = { code: { text: "other" } };
  const amount = dose(e.data, name);
  if (amount) instruction.doseAndRate = [{ doseQuantity: amount }];
  if (Object.keys(instruction).length) row.dosageInstruction = [instruction];
  return row;
}

const labSpecs: Record<Analyte, { unit: string; loinc: string }> = {
  creatinine: { unit: "mg/dL", loinc: "2160-0" }, egfr: { unit: "mL/min/1.73m2", loinc: "98979-8" },
  potassium: { unit: "mmol/L", loinc: "2823-3" }, sodium: { unit: "mmol/L", loinc: "2951-2" },
  chloride: { unit: "mmol/L", loinc: "2075-0" }, bicarbonate: { unit: "mmol/L", loinc: "2028-9" },
  anion_gap: { unit: "mmol/L", loinc: "33037-3" }, bun: { unit: "mg/dL", loinc: "3094-0" },
  glucose: { unit: "mg/dL", loinc: "2345-7" }, a1c: { unit: "%", loinc: "4548-4" },
  uacr: { unit: "mg/g", loinc: "9318-7" }, platelets: { unit: "10*3/uL", loinc: "777-3" },
  wbc: { unit: "10*3/uL", loinc: "6690-2" }, hemoglobin: { unit: "g/dL", loinc: "718-7" },
  bhb: { unit: "mmol/L", loinc: "53060-9" }, ph: { unit: "[pH]", loinc: "2746-6" },
  pco2: { unit: "mmHg", loinc: "2021-4" }, lipase: { unit: "U/L", loinc: "3040-3" },
  troponin: { unit: "ng/mL", loinc: "10839-9" }, cholesterol: { unit: "mg/dL", loinc: "2093-3" },
  triglycerides: { unit: "mg/dL", loinc: "2571-8" }, hdl: { unit: "mg/dL", loinc: "2085-9" },
  ldl: { unit: "mg/dL", loinc: "13457-7" },
};
const labCodes: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", CR: "creatinine", SCR: "creatinine",
  K: "potassium", POTASSIUM: "potassium", NA: "sodium", SODIUM: "sodium", CL: "chloride", CHLORIDE: "chloride",
  CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate", BICARB: "bicarbonate", BICARBONATE: "bicarbonate",
  AG: "anion_gap", AGAP: "anion_gap", ANIONGAP: "anion_gap", BUN: "bun", UREANITROGEN: "bun",
  GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", MALBCR: "uacr", MICROALBCREAT: "uacr", ALBCREAT: "uacr",
  PLT: "platelets", PLATELET: "platelets", PLATELETS: "platelets", WBC: "wbc",
  HGB: "hemoglobin", HB: "hemoglobin", HEMOGLOBIN: "hemoglobin", BHB: "bhb", BOHB: "bhb",
  PH: "ph", VPH: "ph", PHVEN: "ph", PHVENOUS: "ph", PHART: "ph", VBGPH: "ph", ABGPH: "ph",
  PCO2: "pco2", VPCO2: "pco2", PCO2VEN: "pco2", PCO2VENOUS: "pco2", PCO2ART: "pco2",
  LIPASE: "lipase", LIP: "lipase", TROP: "troponin", TROPONINI: "troponin", TNI: "troponin", TROPI: "troponin",
  CHOL: "cholesterol", TC: "cholesterol", CHOLESTEROL: "cholesterol", TOTALCHOL: "cholesterol",
  TG: "triglycerides", TRIG: "triglycerides", TRIGLYCERIDES: "triglycerides",
  HDL: "hdl", HDLC: "hdl", LDL: "ldl", LDLC: "ldl", LDLCALC: "ldl", LDLDIRECT: "ldl",
};
function analyte(data: Obj): Analyte | undefined {
  const test = object(data.test), external = object(data.external_ref);
  if (!test) return undefined;
  const name = (string(test.name) ?? "").toLowerCase();
  const loinc = string(test.loinc);
  // Avoid mistaking urine creatinine/glucose, urine pH, or troponin T for the tracked analytes.
  if (/\b(?:urine|urinary)\b/.test(name) && !/(?:albumin|microalb).*creatinine|creatinine.*(?:albumin|microalb)/.test(name)) return undefined;
  if (/\btroponin\s*[- ]?t\b/.test(name)) return undefined;
  if (/\bratio\b/.test(name) && !/(?:albumin|microalb).*creatinine|creatinine.*(?:albumin|microalb)/.test(name)) return undefined;
  if (/non[ -]?hdl|\bvldl\b|very[ -]low[ -]density/.test(name)) return undefined;
  if (/\begfr\b|glomerular filtration|estimated gfr/.test(name)) return "egfr";
  for (const code of [string(test.nfm_code), string(external?.result_code)]) {
    if (!code) continue;
    const normalized = code.toUpperCase().replace(/^(?:LK|NFM)[-_]/, "").replace(/[^A-Z0-9]/g, "");
    if (/^(?:EGFR|GFR)/.test(normalized)) return "egfr";
    if (Object.prototype.hasOwnProperty.call(labCodes, normalized)) return labCodes[normalized];
  }
  for (const a of Object.keys(labSpecs) as Analyte[]) if (loinc === labSpecs[a].loinc) return a;
  if (loinc && ["48642-3", "48643-1", "62238-1", "62239-9"].includes(loinc)) return "egfr";
  if (/\b(?:a1c|hba1c|hgb ?a1c)\b|glycat(?:ed|ion).*hemoglobin/.test(name)) return "a1c";
  if (/(?:albumin|microalb).*creatinine|creatinine.*(?:albumin|microalb)/.test(name)) return "uacr";
  if (/\bcreatinine\b/.test(name) && !/clearance|ratio/.test(name)) return "creatinine";
  if (/\bpotassium\b/.test(name)) return "potassium";
  if (/\bsodium\b/.test(name)) return "sodium";
  if (/\bchloride\b/.test(name)) return "chloride";
  if (/\bpco2\b|carbon dioxide.*partial pressure|partial pressure.*carbon dioxide/.test(name)) return "pco2";
  if (/bicarbonate|carbon dioxide|\b(?:co2|hco3)\b/.test(name)) return "bicarbonate";
  if (/anion[ -]?gap/.test(name)) return "anion_gap";
  if (/urea nitrogen|\bbun\b/.test(name)) return "bun";
  if (/\bglucose\b/.test(name)) return "glucose";
  if (/platelet/.test(name)) return "platelets";
  if (/white (?:blood )?(?:cell|blood count)|\bwbc\b|leukocyte/.test(name)) return "wbc";
  if (/\bhemoglobin\b/.test(name) && !/\b(?:a1|a2|f|s)\b|free|fetal|fraction|electrophoresis/.test(name)) return "hemoglobin";
  if (/(?:beta|β|3)[ -]?hydroxybutyrate|\bbhb\b/.test(name)) return "bhb";
  if (/\bph\b/.test(name)) return "ph";
  if (/\blipase\b/.test(name)) return "lipase";
  if (/\btroponin(?:[ -]+i)?\b/.test(name)) return "troponin";
  if (/\bhdl\b|high[ -]density lipoprotein/.test(name)) return "hdl";
  if (/\bldl\b|low[ -]density lipoprotein/.test(name)) return "ldl";
  if (/triglyceride/.test(name)) return "triglycerides";
  if (/cholesterol/.test(name) && !/ratio|non[ -]?hdl|vldl/.test(name)) return "cholesterol";
  return undefined;
}

function equationFromText(s: string): Equation | undefined {
  if (/ckd[ -]?epi[^.;\n]{0,35}2021|2021[^.;\n]{0,20}ckd[ -]?epi/i.test(s)) return "ckd-epi-2021";
  if (/ckd[ -]?epi[^.;\n]{0,35}2009|2009[^.;\n]{0,20}ckd[ -]?epi/i.test(s)) return "ckd-epi-2009";
  if (/\bmdrd\b/i.test(s)) return "mdrd";
  return undefined;
}
function equation(data: Obj): Equation {
  const test = object(data.test), ref = object(data.external_ref);
  const comment = string(data.comment) ?? "";
  const method = equationFromText(comment);
  if (method) return method;
  const nameMethod = equationFromText(string(test?.name) ?? "");
  if (nameMethod) return nameMethod;
  const codes = [string(test?.nfm_code), string(ref?.result_code)].filter(Boolean).join(" ");
  if (/EGFR[-_ ]?(?:CKD[-_ ]?EPI[-_ ]?)?(?:2021|21)/i.test(codes)) return "ckd-epi-2021";
  if (/EGFR[-_ ]?(?:CKD[-_ ]?EPI[-_ ]?)?(?:2009|09)/i.test(codes)) return "ckd-epi-2009";
  if (/MDRD/i.test(codes)) return "mdrd";
  const loinc = string(test?.loinc);
  if (loinc === "98979-8") return "ckd-epi-2021";
  if (loinc === "48642-3" || loinc === "48643-1") return "mdrd";
  if (loinc === "62238-1" || loinc === "62239-9") return "ckd-epi-2009";
  return "unknown";
}
function raceAdjusted(data: Obj): boolean {
  const test = object(data.test), ref = object(data.external_ref);
  const codes = [string(test?.nfm_code), string(ref?.result_code)].filter(Boolean).join(" ").toUpperCase();
  if (/(?:\bNAA\b|EGFR09N\b|EGFR[-_]?(?:NON|NO)[-_]?(?:AA|BLACK))/.test(codes)) return false;
  if (/(?:[-_]AA\b|EGFR09A\b)/.test(codes)) return true;
  const name = (string(test?.name) ?? "").toLowerCase();
  if (/non[ -]?(?:african|black)|not (?:african|black)|race[ -]?(?:free|neutral)|without.*(?:race|coefficient)/.test(name)) return false;
  if (/african[ -]?american|\bblack\b|with (?:a )?race coefficient/.test(name)) return true;
  return test?.loinc === "48643-1" || test?.loinc === "62239-9";
}

function unitKey(s: string): string {
  return s.replace(/[µμ]/g, "u").replace(/²/g, "2").replace(/\^/g, "*").replace(/[\s{}]/g, "").toLowerCase();
}
function conversion(a: Analyte, raw: unknown): number | undefined {
  if (typeof raw !== "string") return undefined;
  const u = unitKey(raw);
  if (u === unitKey(labSpecs[a].unit)) return 1;
  if (a === "platelets" || a === "wbc") {
    if (["cells/ul", "cell/ul", "/ul", "cells/mm3", "cells/cumm"].includes(u)) return 0.001;
    if (["k/ul", "10*3/ul", "10*9/l", "x10*3/ul", "thou/ul"].includes(u)) return 1;
  }
  if (a === "egfr" && ["ml/min/1.73_m2", "ml/min/1.73m*2", "ml/min/1.73_m*2"].includes(u)) return 1;
  if (a === "ph" && ["", "ph", "[ph]"].includes(u)) return 1;
  if (labSpecs[a].unit === "mmol/L" && a !== "bhb" && u === "meq/l") return 1;
  if (a === "hemoglobin" && u === "g/l") return 0.1;
  if (a === "troponin" && (u === "ng/l" || u === "pg/ml")) return 0.001;
  if (a === "lipase" && u === "iu/l") return 1;
  if (a === "glucose" && u === "mmol/l") return 18.016;
  return undefined;
}
function numericResult(raw: unknown): { value: number; comparator?: Quantity["comparator"] } | undefined {
  if (typeof raw !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*$/.exec(raw);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return undefined;
  const comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as Quantity["comparator"];
  return comparator ? { value, comparator } : { value };
}

type Lab = Entry & { analyte: Analyte; collected: Time; identity: string; rank: number; resulted: number };
function labResults(entries: Entry[]): Lab[] {
  const results = new Map<string, Lab>();
  for (const e of entries) {
    if (e.data.type !== "imported_result") continue;
    const a = analyte(e.data), collected = time(e.data.collected);
    const localCode = string(object(e.data.test)?.nfm_code);
    const status = e.data.result_status;
    if (!a || !collected || !collected.fhir.includes("T") || !localCode || (status !== "P" && status !== "F" && status !== "C")) continue;
    const ref = object(e.data.external_ref), accession = string(ref?.accession), code = string(ref?.result_code);
    const identity = accession && code
      ? key(e.item.issuer, e.item.patient, string(ref?.lab) ?? "Lakeview Labs", accession, code, String(collected.instant))
      : key(e.item.issuer, e.item.patient, e.item.id, e.entryId);
    const candidate: Lab = { ...e, analyte: a, collected, identity,
      rank: status === "C" ? 2 : status === "F" ? 1 : 0,
      resulted: time(e.data.resulted)?.instant ?? e.item.recorded.instant };
    const old = results.get(identity);
    if (!old || candidate.rank > old.rank || (candidate.rank === old.rank &&
      (candidate.resulted > old.resulted || (candidate.resulted === old.resulted && compareEntries(old, candidate) < 0)))) {
      results.set(identity, candidate);
    }
  }
  // Select the latest/most advanced copy BEFORE reading its value: a withdrawn correction must
  // suppress an older numeric result, rather than falling back to that obsolete value.
  return [...results.values()].sort((a, b) => a.collected.instant - b.collected.instant || cmp(a.identity, b.identity));
}
function observation(lab: Lab, id: string): Observation | undefined {
  const { data, analyte: a, item } = lab;
  if (a === "egfr" && raceAdjusted(data)) return undefined;
  const numeric = numericResult(data.value), factor = conversion(a, data.unit);
  if (!numeric || factor === undefined) return undefined;
  // Multiplication by 0.001 needlessly exposes binary floating point tails for blood counts.
  const value = factor === 0.001 ? numeric.value / 1000 : factor === 0.1 ? numeric.value / 10 : numeric.value * factor;
  if (!Number.isFinite(value)) return undefined;
  const spec = labSpecs[a], test = object(data.test)!;
  const valueQuantity = quantity(value, spec.unit, a === "egfr" ? "mL/min/{1.73_m2}" : spec.unit);
  if (numeric.comparator) valueQuantity.comparator = numeric.comparator;
  const row: Observation = {
    resourceType: "Observation", id,
    meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab"] },
    status: data.result_status === "P" ? "preliminary" : "final",
    category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
    code: { coding: [
      { system: LOINC, code: string(test.loinc) ?? spec.loinc },
      { system: "urn:northgate-fm:test-code", code: String(test.nfm_code) },
    ], text: a },
    subject: { reference: `Patient/${item.patient}` }, effectiveDateTime: lab.collected.fhir, valueQuantity,
  };
  if (a === "egfr") row.method = { text: equation(data) };
  return row;
}

function idFactory(): (prefix: string, identity: string) => string {
  const used = new Set<string>();
  return (prefix, identity) => {
    let a = 2166136261, b = 5381;
    for (let i = 0; i < identity.length; i++) {
      const c = identity.charCodeAt(i);
      a = Math.imul(a ^ c, 16777619); b = Math.imul(b, 33) ^ c;
    }
    const base = `${prefix}-${(a >>> 0).toString(36)}-${(b >>> 0).toString(36)}`;
    let id = base, suffix = 1;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id); return id;
  };
}

/** Northgate's append-only chart, projected into the two requested US Core resource types. */
export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const output: UsCoreRows = { medicationRequests: [], observations: [] };
  if (typeof asOf !== "string") return output;
  const entries: Entry[] = [];
  for (const item of currentItems(items, asOf)) {
    for (const entryId of Object.keys(item.payload).sort(cmp)) {
      const data = object(item.payload[entryId]);
      if (data) entries.push({ item, entryId, data });
    }
  }
  const id = idFactory();
  for (const line of medicationLines(entries)) {
    const e = line.latest;
    const row = medication(line, id("med", key(e.item.issuer, e.item.patient, String(e.data.med_id))));
    if (row) output.medicationRequests.push(row);
  }
  for (const lab of labResults(entries)) {
    const row = observation(lab, id("lab", lab.identity));
    if (row) output.observations.push(row);
  }
  return output;
}
