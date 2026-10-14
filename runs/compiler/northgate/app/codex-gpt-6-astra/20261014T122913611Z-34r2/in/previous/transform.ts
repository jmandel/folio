import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow,
  AllergyIntoleranceRow, LabResultRow, VitalRow, Analyte,
} from "../in/views/views";

type ObjectValue = Record<string, unknown>;
type Entry = {
  item: ObjectValue;
  data: ObjectValue;
  issuer: string;
  itemId: string;
  entryId: string;
  effective: number;
  recorded: number;
};

const object = (v: unknown): v is ObjectValue => v !== null && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): string | undefined => typeof v === "string" && v.trim() ? v : undefined;
const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const compareText = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (...parts: unknown[]): string => JSON.stringify(parts);
const evidence = (e: Entry): Evidence => [{ item_id: e.itemId, entry_id: e.entryId }];
const compareEntry = (a: Entry, b: Entry): number =>
  a.effective - b.effective || a.recorded - b.recorded || compareText(a.issuer, b.issuer) ||
  compareText(a.itemId, b.itemId) || compareText(a.entryId, b.entryId);

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function localTime(ms: number): string {
  const p: Record<string, string> = {};
  for (const part of chicago.formatToParts(ms)) p[part.type] = part.value;
  return `${p.year.padStart(4, "0")}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}

function fullDate(v: unknown): v is string {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const ms = Date.parse(`${v}T00:00:00Z`);
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === v;
}

function instant(v: unknown): number | undefined {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(v) || !fullDate(v.slice(0, 10))) return undefined;
  // Reject Date.parse's normalization of 24:00 and impossible wall-clock fields.
  if (+v.slice(11, 13) > 23 || +v.slice(14, 16) > 59 || +v.slice(17, 19) > 59) return undefined;
  const n = Date.parse(v);
  return Number.isFinite(n) ? n : undefined;
}

function partialDate(v: unknown): string | undefined {
  if (typeof v !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(v)) return undefined;
  return fullDate(v.length === 4 ? `${v}-01-01` : v.length === 7 ? `${v}-01` : v) ? v : undefined;
}

function eventDate(v: unknown): string | undefined {
  const p = partialDate(v);
  if (p) return p;
  const ms = instant(v);
  return ms === undefined ? undefined : localTime(ms).slice(0, 10);
}

function effectiveTime(v: unknown): number | undefined {
  const ms = instant(v);
  if (ms !== undefined) return ms;
  const p = partialDate(v);
  if (!p) return undefined;
  // Padding is used only for ordering imprecise events, never for emitted dates.
  const day = p.length === 4 ? `${p}-01-01` : p.length === 7 ? `${p}-01` : p;
  const wall = Date.parse(`${day}T00:00:00Z`);
  let guess = wall;
  for (let i = 0; i < 3; i++) guess += wall - Date.parse(`${localTime(guess)}Z`);
  return guess;
}

function onset(v: unknown): ProblemRow["onset"] {
  if (!object(v) || !fullDate(v.date)) return undefined;
  if (v.precision === "year") return { value: v.date.slice(0, 4), precision: "year" };
  if (v.precision === "month") return { value: v.date.slice(0, 7), precision: "month" };
  if (v.precision === "day") return { value: v.date, precision: "day" };
  return undefined;
}

function currentEntries(items: unknown, asOf: string): Entry[] {
  if (!Array.isArray(items) || !fullDate(asOf)) return [];
  const scoped: { item: ObjectValue; id: string; issuer: string; recorded: number }[] = [];
  for (const item of items) {
    if (!object(item)) continue;
    const id = text(item.id), issuer = text(item.issuer), recorded = instant(item.recorded);
    if (!id || !issuer || recorded === undefined || localTime(recorded).slice(0, 10) > asOf) continue;
    scoped.push({ item, id, issuer, recorded });
  }
  const withdrawn = new Set<string>();
  // Use ALL in-scope links, including links on superseded/withdrawn items. This
  // makes chains transitive and prevents old versions reappearing after a void.
  for (const s of scoped) {
    for (const field of ["supersedes", "retracts"]) {
      const ids = s.item[field];
      if (Array.isArray(ids)) for (const id of ids) if (typeof id === "string") withdrawn.add(key(s.issuer, id));
    }
  }
  const entries: Entry[] = [];
  for (const s of scoped) {
    if (withdrawn.has(key(s.issuer, s.id)) || !object(s.item.payload)) continue;
    const effective = effectiveTime(s.item.effective);
    if (effective === undefined) continue;
    for (const entryId of Object.keys(s.item.payload).sort(compareText)) {
      const data = s.item.payload[entryId];
      if (object(data) && typeof data.type === "string") entries.push({
        item: s.item, data, issuer: s.issuer, itemId: s.id, entryId, effective, recorded: s.recorded,
      });
    }
  }
  return entries.sort(compareEntry);
}

// Name translation is separate from coding: product RxNorm and outside codes
// are never promoted to ingredient RxNorm identifiers.
const brands: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", forxiga: "dapagliflozin",
  invokana: "canagliflozin", steglatro: "ertugliflozin", glucophage: "metformin",
  glumetza: "metformin", fortamet: "metformin", cozaar: "losartan", hyzaar: "losartan / hydrochlorothiazide",
  prinivil: "lisinopril", zestril: "lisinopril", norvasc: "amlodipine", coreg: "carvedilol",
  lopressor: "metoprolol", "toprol xl": "metoprolol", toprol: "metoprolol",
  diovan: "valsartan", benicar: "olmesartan", micardis: "telmisartan",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", aldactone: "spironolactone",
  kerendia: "finerenone", entresto: "sacubitril / valsartan", microzide: "hydrochlorothiazide",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  humalog: "insulin lispro", novolog: "insulin aspart", fiasp: "insulin aspart",
  tresiba: "insulin degludec", levemir: "insulin detemir",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin",
  janumet: "sitagliptin / metformin", synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin",
  glipizide: "glipizide", glucotrol: "glipizide", amaryl: "glimepiride", actos: "pioglitazone",
  plavix: "clopidogrel", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", prilosec: "omeprazole", protonix: "pantoprazole",
  zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine", paxil: "paroxetine",
  wellbutrin: "bupropion", cymbalta: "duloxetine", effexor: "venlafaxine",
  tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen",
  ventolin: "albuterol", proair: "albuterol", zyrtec: "cetirizine", claritin: "loratadine",
};
const brandNames = Object.keys(brands).sort((a, b) => b.length - a.length || compareText(a, b));
const knownIngredients = new Set(Object.values(brands).flatMap(name => name.split(" / ")));

function ingredientName(name: string): string | undefined {
  let s = name.toLowerCase().replace(/[®™]/g, "").trim();
  if (/^(?:unknown|unspecified|unidentified|water pill|blood pressure (?:pill|medicine)|diabetes (?:pill|medicine)|medication|drug)(?:\b|$)/.test(s)) return undefined;
  // A generic name followed by a bracketed brand remains the generic name.
  s = s.replace(/\s*[\[(][^\])]*[\])]/g, "");
  for (const brand of brandNames) {
    if (s === brand || s.startsWith(`${brand} `)) return brands[brand];
  }
  s = s.replace(/\b\d+(?:\.\d+)?(?:\s*[-/]\s*\d+(?:\.\d+)?)*\s*(?:mg|mcg|ug|g|units?|unt|iu|meq|%|ml)(?=\W|$).*$/i, "")
    .replace(/\b(?:oral|subcutaneous|injectable|intramuscular|intravenous|topical|ophthalmic|otic|inhalation|inhaled)\b.*$/, "")
    .replace(/\b(?:tablets?|capsules?|solution|suspension|injection|cream|ointment|patch|pen|vial|powder)\b.*$/, "")
    .replace(/\b(?:extended[ -]release|delayed[ -]release|immediate[ -]release|er|xr|xl|sr|dr)\b/g, "")
    .replace(/\b(?:hydrochloride|hydrobromide|hcl|besylate|besilate|succinate|tartrate|fumarate|maleate|mesylate|mesilate|phosphate|sulfate|sulphate)\b/g, "")
    .replace(/\b(losartan) potassium\b/g, "$1")
    .replace(/\b(atorvastatin|rosuvastatin) calcium\b/g, "$1")
    .replace(/\b(levothyroxine|naproxen|diclofenac) sodium\b/g, "$1")
    .replace(/\b(insulin (?:glargine|lispro|aspart|degludec))-[a-z]{4}\b/g, "$1")
    .replace(/\bhctz\b/g, "hydrochlorothiazide")
    .replace(/\s+/g, " ").replace(/[\s,;/-]+$/, "").trim();
  return s && /[a-z]/.test(s) && !/\d/.test(s) ? s : undefined;
}

function drugIngredients(name: string): string[] {
  // Split before removing strengths, so both ingredients in a combination survive.
  const normalized = name.replace(/\s*\+\s*/g, " / ");
  const pieces = normalized.split(/\s+\/\s+/);
  const names = pieces.map(ingredientName).filter((s): s is string => !!s)
    .flatMap(s => s.split(/\s*\/\s*/)).map(s => s.trim()).filter(Boolean)
    .flatMap(s => {
      const combination = s.split(/\s*-\s*/);
      // A hyphen can be part of an ingredient's name. Split it only when both
      // sides explicitly name recognized ingredients, never as a blanket rule.
      return combination.length > 1 && combination.every(part => knownIngredients.has(part)) ? combination : [s];
    });
  return [...new Set(names)].sort(compareText);
}

type MedState = { latest: Entry; since?: Entry; status: MedicationRow["status"] };

function otherFrequency(sig: unknown): MedicationRow["frequency"] {
  const instructions = text(sig);
  if (!instructions) return "other";
  // OTHER explicitly delegates to the prescription sig. Recognize an
  // unambiguous weekly schedule, but do not choose one phase of a taper,
  // alternative schedule, or conditional instruction as the current frequency.
  if (/\b(?:then|followed by|taper|alternat\w*|or|not|hold|if|as needed|prn|twice|thrice|\d+\s*times)\b/i.test(instructions)) return "other";
  return /\b(?:once\s+(?:weekly|(?:a|per|each)\s+week)|every\s+(?:(?:(?:one|1)\s+)?week|(?:seven|7)\s+days))\b/i.test(instructions)
    ? "QW" : "other";
}

function medicationStates(entries: Entry[]): MedState[] {
  const lines = new Map<string, MedState>();
  for (const e of entries) {
    const d = e.data, id = text(d.med_id);
    if (d.type !== "med_event" || !id) continue;
    const k = key(e.issuer, id), previous = lines.get(k);
    if (d.action === "start" || d.action === "resume") lines.set(k, { latest: e, since: e, status: "active" });
    else if (d.action === "change") lines.set(k, { latest: e, since: previous?.status === "active" ? previous.since : undefined, status: "active" });
    else if (d.action === "hold" || d.action === "stop") lines.set(k, { latest: e, since: e, status: d.action === "hold" ? "held" : "stopped" });
  }
  return [...lines.values()];
}

function medicationRows(states: MedState[]): MedicationRow[] {
  const rows = new Map<string, { row: MedicationRow; event: Entry }>();
  for (const state of states) {
    const e = state.latest, d = e.data, drug = object(d.drug) ? d.drug : undefined, name = text(drug?.name);
    if (!name) continue;
    const ingredients = drugIngredients(name);
    const base: MedicationRow = { drug_name: name, status: state.status, patient_reported: false, evidence: evidence(e) };
    if (state.since) {
      const since = eventDate(state.since.item.effective);
      if (since) {
        base.status_since = since;
        if (state.since !== e) base.evidence.push(...evidence(state.since));
      }
    }
    if (object(d.dose) && finite(d.dose.value)) {
      const units: Record<string, NonNullable<MedicationRow["dose"]>["unit"]> = {
        mg: "mg", mcg: "mcg", ug: "mcg", units: "units", unit: "units", UNT: "units", "[iU]": "units",
        mL: "mL", ml: "mL", tab: "tablet", tabs: "tablet", tablet: "tablet", tablets: "tablet",
      };
      const unit = typeof d.dose.unit === "string" && Object.hasOwn(units, d.dose.unit) ? units[d.dose.unit] : undefined;
      if (unit && (ingredients.length <= 1 || unit === "tablet" || unit === "mL")) base.dose = { value: d.dose.value, unit };
    }
    if (d.frequency === "QD" || d.frequency === "BID" || d.frequency === "TID" || d.frequency === "QHS" || d.frequency === "PRN") base.frequency = d.frequency;
    else if (d.frequency === "OTHER") base.frequency = otherFrequency(d.sig);
    if (state.status === "stopped" && (d.stop_reason === "adverse_reaction" || d.stop_reason === "ineffective" || d.stop_reason === "therapy_changed" || d.stop_reason === "course_complete" || d.stop_reason === "patient_choice" || d.stop_reason === "other")) base.stop_reason = d.stop_reason;
    if ((state.status === "held" || state.status === "stopped") && text(d.reason_text)) base.status_reason_text = d.reason_text as string;
    for (const ingredient of ingredients.length ? ingredients : [undefined]) {
      const k = ingredient ? `ingredient:${ingredient}` : key("unnamed", e.issuer, d.med_id);
      const old = rows.get(k);
      if (!old || compareEntry(old.event, e) < 0) rows.set(k, { row: ingredient ? { ...base, ingredient } : { ...base }, event: e });
    }
  }
  return [...rows.entries()].sort((a, b) => compareText(a[0], b[0])).map(([, v]) => v.row);
}

function latestLines(entries: Entry[], type: string, idField: string, actions: string[]): Entry[] {
  const lines = new Map<string, Entry>();
  for (const e of entries) {
    const id = text(e.data[idField]);
    if (e.data.type === type && id && typeof e.data.action === "string" && actions.includes(e.data.action)) lines.set(key(e.issuer, id), e);
  }
  return [...lines.values()].sort(compareEntry);
}

function ckd(d: ObjectValue): boolean {
  return /^N18(?:\.|$)/i.test(text(d.icd10cm) ?? "") || /\b(?:chronic kidney disease|chronic renal (?:disease|failure|insufficiency)|ckd)\b/i.test(text(d.description) ?? "");
}

function ckdStage(d: ObjectValue): ProblemRow["ckd_stage"] {
  const stages: Record<string, NonNullable<ProblemRow["ckd_stage"]>> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  const code = text(d.icd10cm)?.toUpperCase();
  if (code && stages[code]) return stages[code];
  const description = text(d.description) ?? "";
  const m = /\b(?:stage\s*|g)(3[ab]|[1245])\b/i.exec(description);
  return m ? `G${m[1].toLowerCase()}` as ProblemRow["ckd_stage"] : undefined;
}

function adverseEffect(d: ObjectValue): boolean {
  const code = (text(d.icd10cm) ?? "").toUpperCase().replace(/\./g, "");
  return (/^T(?:3[6-9]|4\d|50)/.test(code) && code[5] === "5") || /\badverse (?:effect|reaction)(?:\s+(?:of|to|from))?\b/i.test(text(d.description) ?? "");
}

function problemRows(lines: Entry[]): ProblemRow[] {
  const candidates: { row: ProblemRow; aliases: string[]; event: Entry }[] = [];
  for (const e of lines) {
    const d = e.data, condition = text(d.description);
    if (d.action === "remove" || !condition || adverseEffect(d)) continue;
    const row: ProblemRow = { condition, status: d.action === "resolve" ? "resolved" : "active", evidence: evidence(e) };
    const code = text(d.icd10cm), snomed = text(d.snomed), began = onset(d.onset);
    if (code) row.icd10cm = code;
    if (snomed) row.snomed = snomed;
    if (began) row.onset = began;
    const aliases = [`name:${condition.toLowerCase().replace(/\s+/g, " ").trim()}`];
    if (code) aliases.push(`icd:${code.toUpperCase()}`);
    if (snomed) aliases.push(`snomed:${snomed}`);
    if (ckd(d)) {
      aliases.push("condition:ckd");
      const stage = ckdStage(d);
      if (stage) row.ckd_stage = stage;
      const albuminuria = /\bA([123])\b/i.exec(condition);
      if (albuminuria) row.albuminuria = `A${albuminuria[1]}` as ProblemRow["albuminuria"];
    }
    candidates.push({ row, aliases, event: e });
  }
  // Equal codes, equal concepts, equal names, or CKD restaging identify the same
  // condition. Connected aliases also handle a code changing between list lines.
  const groups: typeof candidates = [];
  for (const candidate of candidates) {
    const matching = groups.filter(g => g.aliases.some(a => candidate.aliases.includes(a)));
    for (const g of matching) {
      candidate.aliases.push(...g.aliases.filter(a => !candidate.aliases.includes(a)));
      groups.splice(groups.indexOf(g), 1);
    }
    groups.push(candidate);
  }
  return groups.sort((a, b) => compareText(a.row.condition, b.row.condition) || compareEntry(a.event, b.event)).map(g => g.row);
}

function allergyRows(lines: Entry[], problems: Entry[], meds: MedState[]): AllergyIntoleranceRow[] {
  const rows = new Map<string, { row: AllergyIntoleranceRow; event: Entry }>();
  const listed = new Set<string>();
  for (const e of lines) {
    const d = e.data, substance = object(d.substance) ? d.substance : undefined, name = text(substance?.name);
    if (!name) continue;
    const rxnorm = text(substance?.rxnorm);
    const normalized = ingredientName(name);
    // RxNorm here is explicitly ingredient-level; names without a drug code can
    // be foods/environmental allergens and must retain their display spelling.
    const brand = Object.hasOwn(brands, name.toLowerCase()) ? brands[name.toLowerCase()] : undefined;
    const substanceName = rxnorm || (normalized && knownIngredients.has(normalized)) ? normalized ?? name.toLowerCase() : (brand ?? name);
    const k = (normalized ?? name).toLowerCase();
    listed.add(k);
    if (d.action === "inactivate") continue;
    if (d.reaction_type !== "allergy" && d.reaction_type !== "intolerance" && d.reaction_type !== "adverse_reaction") continue;
    const row: AllergyIntoleranceRow = {
      substance: substanceName, type: d.reaction_type,
      criticality: d.severity === "low" || d.severity === "high" ? d.severity : "unknown", evidence: evidence(e),
    };
    if (rxnorm) row.rxnorm_ingredient = rxnorm;
    if (Array.isArray(d.reactions)) {
      const reactions = d.reactions.filter((v): v is string => !!text(v));
      if (reactions.length) row.reaction = reactions.join("; ");
    }
    const began = onset(d.onset);
    if (began) row.onset = began;
    rows.set(k, { row, event: e });
  }
  // Explicit adverse-effect diagnoses belong here, not on the problem list.
  // Do not infer a particular ingredient from a broad ICD drug-class code.
  for (const e of problems) {
    const d = e.data, description = text(d.description);
    if (d.action === "remove" || !description || !adverseEffect(d)) continue;
    const m = /adverse (?:effect|reaction) (?:of|to|from)\s+(.+?)(?:,\s*(?:initial|subsequent) encounter|,?\s*sequela|$)/i.exec(description)
      ?? /^(.+?)\s+adverse (?:effect|reaction)\b/i.exec(description);
    const name = m && ingredientName(m[1]);
    if (!name || /^(?:other|unspecified|unidentified|drug|medication)s?\b/.test(name) || listed.has(name)) continue;
    const row: AllergyIntoleranceRow = { substance: name, type: "adverse_reaction", criticality: "unknown", evidence: evidence(e) };
    const began = onset(d.onset);
    if (began) row.onset = began;
    const old = rows.get(name);
    if (!old || compareEntry(old.event, e) < 0) rows.set(name, { row, event: e });
  }
  // A coded stop can record harm even if no allergy-list event was entered.
  // An explicit allergy-list history (including inactivation) takes precedence.
  for (const state of meds) {
    const e = state.latest, d = e.data;
    if (state.status !== "stopped" || d.stop_reason !== "adverse_reaction" || !object(d.drug)) continue;
    const name = text(d.drug.name);
    if (!name) continue;
    const reaction = text(d.reason_text);
    for (const ingredient of drugIngredients(name)) {
      if (listed.has(ingredient) || rows.has(ingredient)) continue;
      let type: AllergyIntoleranceRow["type"] = "adverse_reaction";
      if (reaction && /\b(?:anaphylaxis|angioedema|hives|urticaria|rash|bronchospasm)\b/i.test(reaction)) type = "allergy";
      else if (reaction && /\b(?:cough|nausea|diarrhea|gi upset|gastrointestinal upset)\b/i.test(reaction)) type = "intolerance";
      const row: AllergyIntoleranceRow = { substance: ingredient, type, criticality: "unknown", evidence: evidence(e) };
      if (reaction) row.reaction = reaction;
      rows.set(ingredient, { row, event: e });
    }
  }
  return [...rows.entries()].sort((a, b) => compareText(a[0], b[0])).map(([, v]) => v.row);
}

const analyteUnits: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const labCodes: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", K: "potassium", POTASSIUM: "potassium",
  NA: "sodium", SODIUM: "sodium", CL: "chloride", CHLORIDE: "chloride", CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate",
  AG: "anion_gap", AGAP: "anion_gap", ANIONGAP: "anion_gap", BUN: "bun", UREANITROGEN: "bun",
  GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", MACR: "uacr", PLT: "platelets", PLTS: "platelets", PLATELETS: "platelets",
  WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin", BHB: "bhb", BOHB: "bhb", PH: "ph", VPH: "ph", APH: "ph",
  PCO2: "pco2", VPCO2: "pco2", APCO2: "pco2", LIP: "lipase", LIPASE: "lipase",
  TNI: "troponin", TROPI: "troponin", TROPONINI: "troponin", CHOL: "cholesterol", TC: "cholesterol",
  CHOLESTEROL: "cholesterol", TG: "triglycerides", TRIG: "triglycerides", TRIGLYCERIDES: "triglycerides",
  HDL: "hdl", HDLC: "hdl", LDL: "ldl", LDLC: "ldl", LDLCALC: "ldl", LDLDIRECT: "ldl",
};

function labAnalyte(d: ObjectValue): Analyte | undefined {
  if (!object(d.test)) return undefined;
  const name = (text(d.test.name) ?? "").toLowerCase();
  // Do not mistake urine constituents, total protein/creatinine, or troponin T
  // for the serum analytes and albumin/creatinine ratio the consumer tracks.
  if (/troponin\s*t\b|protein\s*(?:\/|to|:)\s*creatinine|urine\s+ph|ph,?\s*urine|\bnon[- ]hdl\b|\b(?:ldl|hdl|cholesterol).*\bratio\b/.test(name)) return undefined;
  if (/\b(?:egfr|estimated glomerular filtration|glomerular filtration rate)\b/.test(name)) return "egfr";
  if (/(?:albumin|microalbumin).*creatinine|\buacr\b/.test(name)) return "uacr";
  if (/\b(?:urine|urinary|csf|cerebrospinal|pleural)\b/.test(name) && /\b(?:creatinine|glucose|sodium|potassium|chloride)\b/.test(name)) return undefined;
  const names: [RegExp, Analyte][] = [
    [/\b(?:hba1c|a1c|hemoglobin a1c|glycated hemoglobin)\b/, "a1c"],
    [/\b(?:beta[ -]?hydroxybutyrate|β[ -]?hydroxybutyrate)\b/, "bhb"],
    [/\b(?:pco2|carbon dioxide partial pressure|partial pressure of (?:carbon dioxide|co2))\b/, "pco2"],
    [/\b(?:bicarbonate|total co2|carbon dioxide,? total|co2,? total)\b/, "bicarbonate"],
    [/\banion gap\b/, "anion_gap"], [/\bcreatinine\b/, "creatinine"], [/\bpotassium\b/, "potassium"],
    [/\bsodium\b/, "sodium"], [/\bchloride\b/, "chloride"], [/\b(?:bun|urea nitrogen)\b/, "bun"],
    [/\bglucose\b/, "glucose"], [/\bplatelet(?:s| count)?\b/, "platelets"], [/\b(?:wbc|white blood cell|leukocyte)(?:s| count)?\b/, "wbc"],
    [/\bhemoglobin\b/, "hemoglobin"], [/\blipase\b/, "lipase"], [/\btroponin\s*i\b/, "troponin"],
    [/\b(?:hdl|high[ -]density lipoprotein)\b/, "hdl"], [/\b(?:ldl|low[ -]density lipoprotein)\b/, "ldl"],
    [/\btriglycerides?\b/, "triglycerides"], [/\b(?:total cholesterol|cholesterol,? total)\b|^cholesterol$/, "cholesterol"],
    [/^(?:(?:venous|arterial|blood gas)\s+)?ph(?:\b|$)/, "ph"],
  ];
  for (const [pattern, analyte] of names) if (pattern.test(name)) return analyte;
  const ext = object(d.external_ref) ? d.external_ref : {};
  for (const code of [text(d.test.nfm_code), text(ext.result_code)?.replace(/^LK[-_]/i, "")]) {
    if (!code) continue;
    const normalized = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (normalized.startsWith("EGFR")) return "egfr";
    if (labCodes[normalized]) return labCodes[normalized];
  }
  return undefined;
}

function raceAdjusted(d: ObjectValue): boolean {
  const test = object(d.test) ? d.test : {}, ext = object(d.external_ref) ? d.external_ref : {};
  const codes = `${text(test.nfm_code) ?? ""} ${text(ext.result_code) ?? ""}`.toUpperCase();
  const name = (text(test.name) ?? "").toLowerCase();
  if (/\bnon[- ]?(?:african|black)|\bwithout (?:a )?race|\brace[- ]free|\bnon[- ]?aa\b/.test(name) || /EGFR[-_ ]?(?:NAA|09N|MDRDN|NONAA)\b/.test(codes)) return false;
  return /\bafrican(?:[- ]american)?\b|\bblack\b|\bwith (?:a )?race (?:coefficient|adjustment)|\brace[- ]adjusted/.test(name) || /EGFR[-_ ]?(?:AA|09A|MDRDA)\b/.test(codes);
}

function equationIn(v: string): LabResultRow["egfr_equation"] {
  if (/\bmdrd\b/i.test(v)) return "mdrd";
  if (/ckd[- ]?epi/i.test(v)) {
    if (/2021|race[- ]free/i.test(v)) return "ckd-epi-2021";
    if (/2009/.test(v)) return "ckd-epi-2009";
  }
  return undefined;
}

function egfrEquation(d: ObjectValue): NonNullable<LabResultRow["egfr_equation"]> {
  const comment = text(d.comment) ?? "";
  const note = equationIn(comment);
  if (note) return note;
  if (/schwartz|cockcroft|cystatin|ckd[- ]?epi|\b(?:equation|formula|method)\b/i.test(comment)) return "unknown";
  const test = object(d.test) ? d.test : {}, ext = object(d.external_ref) ? d.external_ref : {};
  const name = equationIn(text(test.name) ?? "");
  if (name) return name;
  const codes = `${text(test.nfm_code) ?? ""} ${text(ext.result_code) ?? ""}`;
  if (/EGFR[-_]?(?:21|2021)\b/i.test(codes)) return "ckd-epi-2021";
  if (/EGFR[-_]?(?:09|2009)[NA]?\b/i.test(codes)) return "ckd-epi-2009";
  if (/MDRD/i.test(codes)) return "mdrd";
  return "unknown";
}

function numeric(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof v !== "string") return undefined;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*$/i.exec(v);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return undefined;
  const comparator = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1];
  return comparator ? { value, comparator: comparator as LabResultRow["comparator"] } : { value };
}

function unitFactor(analyte: Analyte, raw: unknown): number | undefined {
  if (typeof raw !== "string") return undefined;
  const normalize = (s: string): string => s.toLowerCase().replace(/[µμ]/g, "u").replace(/²/g, "2").replace(/³/g, "3").replace(/[\s{}]/g, "").replace(/\*/g, "^");
  const unit = normalize(raw), target = normalize(analyteUnits[analyte]);
  if (unit === target) return 1;
  if (analyte === "platelets" || analyte === "wbc") {
    if (["cells/ul", "cell/ul", "/ul"].includes(unit)) return 0.001;
    if (["k/ul", "thou/ul", "10^9/l", "x10^3/ul"].includes(unit)) return 1;
  }
  if (analyte === "egfr" && ["ml/min/1.73m^2", "ml/min/1.73sqm", "ml/min/1.73m2"].includes(unit)) return 1;
  if (analyte === "ph" && ["", "ph", "1"].includes(unit)) return 1;
  if (target === "mmol/l" && unit === "meq/l" && ["sodium", "potassium", "chloride", "bicarbonate", "anion_gap"].includes(analyte)) return 1;
  if (target === "mg/dl" && unit === "mg/l") return 0.1;
  if (analyte === "hemoglobin" && unit === "g/l") return 0.1;
  if (analyte === "uacr" && unit === "ug/mg") return 1;
  if (analyte === "troponin" && (unit === "ng/l" || unit === "pg/ml")) return 0.001;
  if (analyte === "lipase" && unit === "iu/l") return 1;
  if (analyte === "glucose" && unit === "mmol/l") return 18.016;
  return undefined;
}

function compareResult(a: Entry, b: Entry): number {
  const rank = (e: Entry): number => e.data.result_status === "C" ? 3 : e.data.result_status === "F" ? 2 : 1;
  return rank(a) - rank(b) || (instant(a.data.resulted) ?? a.recorded) - (instant(b.data.resulted) ?? b.recorded) || a.recorded - b.recorded || compareEntry(a, b);
}

function labRows(entries: Entry[]): LabResultRow[] {
  const results = new Map<string, Entry>();
  // Only imported_result identifies an actual specimen/result. A medication's
  // reason_text or a referral's question can cite a lab number, but supplies
  // neither its collection instant nor its validity/status. Do not manufacture
  // a result or overwrite a printed value using those mentions or narrative.
  // Select the authoritative copy BEFORE parsing its value. A corrected-away
  // nonnumeric value must suppress an older numeric copy.
  for (const e of entries) {
    const d = e.data;
    if (d.type !== "imported_result" || (d.result_status !== "P" && d.result_status !== "F" && d.result_status !== "C")) continue;
    const ext = object(d.external_ref) ? d.external_ref : {};
    const accession = text(ext.accession), code = text(ext.result_code);
    const k = accession && code ? key(e.issuer, ext.lab, accession, code) : key(e.issuer, e.itemId, e.entryId);
    const old = results.get(k);
    if (!old || compareResult(old, e) < 0) results.set(k, e);
  }
  const rows: { row: LabResultRow; event: Entry }[] = [];
  for (const e of results.values()) {
    const d = e.data, analyte = labAnalyte(d), value = numeric(d.value), collected = text(d.collected);
    if (!analyte || !value || !collected || instant(collected) === undefined || (analyte === "egfr" && raceAdjusted(d))) continue;
    const factor = unitFactor(analyte, d.unit);
    if (factor === undefined) continue;
    // Dividing by an integer avoids adding rounding noise (7100 / 1000 = 7.1).
    const converted = factor < 1 && Number.isInteger(1 / factor) ? value.value / (1 / factor) : value.value * factor;
    if (!Number.isFinite(converted)) continue;
    const row: LabResultRow = {
      analyte, value: converted, unit: analyteUnits[analyte], collected,
      status: d.result_status === "P" ? "preliminary" : "final", evidence: evidence(e),
    };
    if (value.comparator) row.comparator = value.comparator;
    if (analyte === "egfr") row.egfr_equation = egfrEquation(d);
    const loinc = object(d.test) ? text(d.test.loinc) : undefined;
    if (loinc) row.loinc = loinc;
    rows.push({ row, event: e });
  }
  return rows.sort((a, b) => (instant(a.row.collected)! - instant(b.row.collected)!) || compareText(a.row.analyte, b.row.analyte) || compareEntry(a.event, b.event)).map(v => v.row);
}

function bp(v: unknown): [number, number] | undefined {
  if (typeof v !== "string") return undefined;
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(v);
  return m && Number.isFinite(+m[1]) && Number.isFinite(+m[2]) ? [+m[1], +m[2]] : undefined;
}

function vitalRows(entries: Entry[]): VitalRow[] {
  const rows: VitalRow[] = [];
  const seen = new Set<string>();
  for (const e of entries) {
    const d = e.data, ms = instant(e.item.effective);
    if (d.type !== "vital_set" || ms === undefined) continue;
    const row: VitalRow = { setting: "clinic", local_time: localTime(ms).slice(0, 16), evidence: evidence(e) };
    const first = bp(d.bp), repeat = bp(d.bp_repeat);
    if (first) [row.systolic_mmhg, row.diastolic_mmhg] = first;
    if (repeat) [row.repeat_systolic_mmhg, row.repeat_diastolic_mmhg] = repeat;
    if (finite(d.pulse_bpm)) row.pulse_bpm = d.pulse_bpm;
    if (finite(d.weight_lb)) {
      const kg = Math.round(d.weight_lb * 0.45359237 * 10) / 10;
      if (Number.isFinite(kg)) row.weight_kg = kg;
    }
    if (!first && !repeat && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    const k = key(e.issuer, ms, d.visit_id, d.bp, d.bp_repeat, d.pulse_bpm, d.weight_lb);
    if (!seen.has(k)) { seen.add(k); rows.push(row); }
  }
  return rows;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const entries = currentEntries(items, asOf);
  const meds = medicationStates(entries);
  const problems = latestLines(entries, "problem_event", "problem_id", ["add", "update", "resolve", "remove"]);
  const allergies = latestLines(entries, "allergy_event", "allergy_id", ["add", "update", "inactivate"]);
  // List reviews, billing diagnoses, and referral steps/diagnoses do not edit
  // these lists. Restricted entries supplied to this mapper are already shared;
  // the views specify no additional restriction filtering.
  return {
    medications: medicationRows(meds), problems: problemRows(problems),
    allergies: allergyRows(allergies, problems, meds), labs: labRows(entries), vitals: vitalRows(entries),
  };
}
