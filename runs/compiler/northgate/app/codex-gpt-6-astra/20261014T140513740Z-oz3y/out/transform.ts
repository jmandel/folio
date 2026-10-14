import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow,
  AllergyIntoleranceRow, LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// Payloads are deliberately read as unknown: an unfamiliar or malformed entry must
// not turn into a plausible-looking clinical fact.
type Obj = Record<string, unknown>;
const obj = (x: unknown): Obj => x !== null && typeof x === "object" && !Array.isArray(x) ? x as Obj : {};
const str = (x: unknown): string | undefined => typeof x === "string" && x.trim() ? x : undefined;
const num = (x: unknown): number | undefined => typeof x === "number" && Number.isFinite(x) ? x : undefined;
const strings = (x: unknown): string[] => Array.isArray(x) ? x.filter((s): s is string => typeof s === "string") : [];
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (...parts: string[]): string => JSON.stringify(parts);
const norm = (s: string): string => s.toLowerCase().replace(/[‐‑–—]/g, "-").replace(/\s+/g, " ").trim();

const chicago = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function fullDate(s: string): boolean {
  if (typeof s !== "string") return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const y = +m[1], month = +m[2], day = +m[3];
  const days = [31, y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return y > 0 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1];
}

function partialDate(s: string): boolean {
  return /^\d{4}$/.test(s) ? +s > 0 : /^\d{4}-\d{2}$/.test(s) ? fullDate(s + "-01") : fullDate(s);
}

function formatted(t: number): string {
  const parts = chicago.formatToParts(t);
  const get = (type: string): string => parts.find(p => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

function dateTime(s: string): boolean {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/i.exec(s);
  return !!m && fullDate(m[1]) && +m[2] < 24 && +m[3] < 60 && (!m[4] || +m[4] < 60)
    && (!m[5] || m[5].toUpperCase() === "Z" || (+m[5].slice(1, 3) < 24 && +m[5].slice(4) < 60));
}

const hasOffset = (s: string): boolean => /(?:Z|[+-]\d{2}:\d{2})$/i.test(s);

function local(s: unknown): string | undefined {
  if (typeof s !== "string") return;
  if (partialDate(s)) return s;
  if (!dateTime(s)) return;
  if (!hasOffset(s)) return s; // Already Chicago wall time; never use the host's zone.
  const t = Date.parse(s);
  return Number.isFinite(t) ? formatted(t) : undefined;
}

function epoch(s: string): number | undefined {
  if (dateTime(s) && hasOffset(s)) {
    const t = Date.parse(s);
    return Number.isFinite(t) ? t : undefined;
  }
  const wall = local(s);
  if (!wall) return;
  const padded = wall.length === 4 ? wall + "-01-01T00:00:00" : wall.length === 7 ? wall + "-01T00:00:00"
    : wall.length === 10 ? wall + "T00:00:00" : wall;
  const utc = Date.parse(padded + "Z");
  let t = utc + 6 * 3600000;
  // Resolve a local timestamp without consulting the environment's time zone.
  for (let i = 0; i < 3; i++) t = utc + Math.floor(t / 1000) * 1000 - Date.parse(formatted(t) + "Z");
  return Number.isFinite(t) ? t : undefined;
}

function onset(x: unknown): ProblemRow["onset"] {
  const o = obj(x), d = str(o.date);
  if (!d || !fullDate(d)) return;
  if (o.precision === "year") return { value: d.slice(0, 4), precision: "year" };
  if (o.precision === "month") return { value: d.slice(0, 7), precision: "month" };
  if (o.precision === "day") return { value: d, precision: "day" };
}

type Item = { id: string; issuer: string; effective: string; recorded: number; raw: Obj };
type Entry = { item: Item; id: string; data: Obj; time: number };
function compare(a: Entry, b: Entry): number {
  return a.time - b.time || a.item.recorded - b.item.recorded || cmp(a.item.issuer, b.item.issuer)
    || cmp(a.item.id, b.item.id) || cmp(a.id, b.id);
}
const evidence = (e: Entry): Evidence => [{ item_id: e.item.id, entry_id: e.id }];
function combineEvidence(...groups: Evidence[]): Evidence {
  const seen = new Set<string>();
  return groups.flat().filter(e => {
    const k = key(e.item_id, e.entry_id ?? "");
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
}
const sensitivity = (e: Entry): Sensitivity[] | undefined => e.data.restricted === "BH" ? ["mental-health"] : undefined;

function currentEntries(input: FolioItem[], asOf: string): Entry[] {
  if (!Array.isArray(input) || !fullDate(asOf)) return [];
  const scoped: Item[] = [];
  for (const x of input) {
    const raw = obj(x), id = str(raw.id), issuer = str(raw.issuer), recorded = str(raw.recorded);
    if (!id || !issuer || !recorded) continue;
    const day = local(recorded), t = epoch(recorded);
    if (!day || day.length < 10 || day.slice(0, 10) > asOf || t === undefined) continue;
    scoped.push({ id, issuer, effective: str(raw.effective) ?? "", recorded: t, raw });
  }
  const obsolete = new Set<string>();
  // Include edges from superseded items too. A -> B -> C must never resurrect A,
  // even when C retracts B. References are issuer-local and only in-scope edges count.
  for (const i of scoped) {
    for (const id of [...strings(i.raw.supersedes), ...strings(i.raw.retracts)]) obsolete.add(key(i.issuer, id));
  }
  const entries: Entry[] = [];
  for (const item of scoped) {
    if (obsolete.has(key(item.issuer, item.id))) continue;
    const time = epoch(item.effective);
    if (time === undefined) continue;
    for (const id of Object.keys(obj(item.raw.payload)).sort(cmp)) {
      const data = obj(obj(item.raw.payload)[id]);
      if (str(data.type)) entries.push({ item, id, data, time });
    }
  }
  return entries.sort(compare);
}

// This is name normalization, not a product-CUI -> ingredient-CUI crosswalk.
// Northgate medication RxNorm identifiers describe products, never ingredients.
const drugAliases: Record<string, string[]> = {
  "insulin glargine": ["lantus", "basaglar", "toujeo", "semglee"],
  "insulin lispro": ["humalog", "admelog"], "insulin aspart": ["novolog", "fiasp"],
  "insulin degludec": ["tresiba"], "insulin detemir": ["levemir"],
  empagliflozin: ["jardiance"], dapagliflozin: ["farxiga", "forxiga"],
  canagliflozin: ["invokana"], ertugliflozin: ["steglatro"],
  metformin: ["glucophage", "glumetza", "fortamet"], glipizide: ["glucotrol"],
  glimepiride: ["amaryl"], glyburide: ["diabeta", "glynase"],
  semaglutide: ["ozempic", "rybelsus", "wegovy"], dulaglutide: ["trulicity"],
  liraglutide: ["victoza", "saxenda"], tirzepatide: ["mounjaro", "zepbound"],
  sitagliptin: ["januvia"], linagliptin: ["tradjenta"], pioglitazone: ["actos"],
  losartan: ["cozaar"], valsartan: ["diovan"], irbesartan: ["avapro"],
  olmesartan: ["benicar"], candesartan: ["atacand"], telmisartan: ["micardis"],
  lisinopril: ["zestril", "prinivil"], enalapril: ["vasotec"], ramipril: ["altace"],
  benazepril: ["lotensin"], captopril: ["capoten"], perindopril: ["aceon"],
  quinapril: ["accupril"], fosinopril: ["monopril"], trandolapril: ["mavik"],
  amlodipine: ["norvasc"], nifedipine: ["procardia", "adalat"], diltiazem: ["cardizem", "tiazac"],
  hydrochlorothiazide: ["hctz", "microzide"], chlorthalidone: ["hygroton", "thalitone"],
  furosemide: ["lasix"], torsemide: ["demadex"], bumetanide: ["bumex"],
  spironolactone: ["aldactone"], eplerenone: ["inspra"], finerenone: ["kerendia"],
  metoprolol: ["lopressor", "toprol", "toprol-xl"], carvedilol: ["coreg"],
  atenolol: ["tenormin"], labetalol: ["trandate"],
  atorvastatin: ["lipitor"], rosuvastatin: ["crestor"], simvastatin: ["zocor"],
  pravastatin: ["pravachol"], ezetimibe: ["zetia"], fenofibrate: ["tricor"],
  aspirin: ["bayer", "ecotrin"], clopidogrel: ["plavix"], apixaban: ["eliquis"],
  rivaroxaban: ["xarelto"], warfarin: ["coumadin", "jantoven"],
  sertraline: ["zoloft"], fluoxetine: ["prozac"], escitalopram: ["lexapro"],
  citalopram: ["celexa"], paroxetine: ["paxil"], bupropion: ["wellbutrin", "zyban"],
  duloxetine: ["cymbalta"], venlafaxine: ["effexor"], trazodone: ["desyrel"],
  gabapentin: ["neurontin"], pregabalin: ["lyrica"],
  levothyroxine: ["synthroid", "levoxyl"], omeprazole: ["prilosec"], pantoprazole: ["protonix"],
  famotidine: ["pepcid"], albuterol: ["ventolin", "proair", "proventil", "salbutamol"],
  acetaminophen: ["tylenol", "paracetamol"], ibuprofen: ["advil", "motrin"], naproxen: ["aleve", "naprosyn"],
  amoxicillin: ["amoxil"], sulfamethoxazole: [], trimethoprim: [],
  allopurinol: ["zyloprim"], colchicine: ["colcrys"],
};
const combinations: Record<string, string[]> = {
  synjardy: ["empagliflozin", "metformin"], xigduo: ["dapagliflozin", "metformin"],
  janumet: ["sitagliptin", "metformin"], jentadueto: ["linagliptin", "metformin"],
  hyzaar: ["losartan", "hydrochlorothiazide"], prinzide: ["lisinopril", "hydrochlorothiazide"],
  zestoretic: ["lisinopril", "hydrochlorothiazide"], lotrel: ["amlodipine", "benazepril"],
  entresto: ["sacubitril", "valsartan"], bactrim: ["sulfamethoxazole", "trimethoprim"],
};
function wordIn(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z])${escaped}(?=$|[^a-z])`, "i").test(text);
}
function knownIngredients(name: string): string[] {
  const text = norm(name);
  for (const brand of Object.keys(combinations)) if (wordIn(text, brand)) return combinations[brand].slice();
  return Object.keys(drugAliases).filter(g => [g, ...drugAliases[g]].some(n => wordIn(text, n)));
}
function ingredients(name: string): string[] {
  const known = knownIngredients(name);
  if (known.length) return known;
  let text = norm(name).replace(/^\d+(?:\.\d+)?\s*(?:ml|mg|mcg)\s+/, "");
  if (/\b(?:water pill|blood pressure pill|unknown|unspecified|unidentified|medication|medicine|supplement)\b/.test(text)) return [];
  text = text.replace(/\s+\d.*$/, "")
    .replace(/\s+(?:oral|tablet|capsule|solution|suspension|injection|injectable|pen|extended.release|delayed.release|immediate.release|er|xr|sr|xl|hfa)\b.*$/, "")
    .replace(/\s+(?:hydrochloride|hcl|potassium|sodium|besylate|succinate|tartrate|maleate|fumarate|mesylate|calcium|phosphate|hydrobromide)(?:\s.*)?$/, "")
    .replace(/[()[\]]/g, "").trim();
  // Do not strip the active counterion from electrolyte replacements.
  if (/^(?:potassium|sodium|calcium|magnesium)\s/.test(norm(name))) {
    text = norm(name).split(/\s+\d/)[0].replace(/\s+(?:oral|tablet|capsule)\b.*$/, "");
  }
  return /^[a-z][a-z -]*$/.test(text) && text.length > 2 ? [text] : [];
}

function dose(entry: Obj, name: string, ingredient: string | undefined, multiple: boolean): MedicationRow["dose"] {
  const d = obj(entry.dose), v = num(d.value), u = str(d.unit);
  if (v === undefined || v < 0 || !u) return;
  const unit = norm(u);
  if (["tab", "tabs", "tablet", "tablets"].includes(unit)) {
    let strengthText = name;
    if (multiple) {
      // Combination products need an explicitly named strength for this component.
      const pieces = name.split(/\s*[+/]\s*/);
      const piece = pieces.find(p => ingredient && knownIngredients(p).length === 1 && ingredients(p).includes(ingredient));
      if (!piece) return;
      strengthText = piece;
    }
    const strengths = [...strengthText.matchAll(/(\d+(?:\.\d+)?)\s*(mcg|mg|micrograms?|milligrams?)\b(?!\s*\/\s*(?:ml|l)\b)/gi)];
    if (strengths.length === 1) {
      const value = v * +strengths[0][1];
      if (Number.isFinite(value)) return { value, unit: /^(?:mcg|micro)/i.test(strengths[0][2]) ? "mcg" : "mg" };
    }
    return multiple ? undefined : { value: v, unit: "tablet" };
  }
  if (multiple) return;
  if (unit === "mg" || unit === "mcg") return { value: v, unit };
  if (["units", "unit", "unt", "[iu]", "iu"].includes(unit)) return { value: v, unit: "units" };
  if (unit === "ml") return { value: v, unit: "mL" };
}

type MedState = { latest: Entry; since?: Entry; status: MedicationRow["status"] };
function medicationRows(entries: Entry[]): MedicationRow[] {
  const lines = new Map<string, MedState>();
  for (const e of entries) {
    const d = e.data, id = str(d.med_id);
    if (d.type !== "med_event" || !id || !["start", "change", "hold", "resume", "stop"].includes(str(d.action) ?? "")) continue;
    const k = key(e.item.issuer, id), previous = lines.get(k);
    const status = d.action === "hold" ? "held" : d.action === "stop" ? "stopped" : "active";
    const since = d.action === "change" ? previous?.status === "active" ? previous.since : undefined : e;
    lines.set(k, { latest: e, status, since });
  }
  const byDrug = new Map<string, { row: MedicationRow; entry: Entry }>();
  for (const state of lines.values()) {
    const e = state.latest, d = e.data, name = str(obj(d.drug).name);
    if (!name) continue;
    const names = ingredients(name);
    for (const ingredient of names.length ? names : [undefined]) {
      const row: MedicationRow = { drug_name: name, status: state.status, patient_reported: false, evidence: evidence(e) };
      if (ingredient) row.ingredient = ingredient;
      if (state.since) {
        row.status_since = local(state.since.item.effective)?.slice(0, 10);
        row.evidence = combineEvidence(row.evidence, evidence(state.since));
      }
      const amount = dose(d, name, ingredient, names.length > 1);
      if (amount) row.dose = amount;
      const f = d.frequency;
      if (f === "QD" || f === "BID" || f === "TID" || f === "QHS" || f === "PRN") row.frequency = f;
      if (f === "OTHER") row.frequency = "other";
      if (state.status === "stopped" && ["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(str(d.stop_reason) ?? "")) {
        row.stop_reason = d.stop_reason as MedicationRow["stop_reason"];
      }
      if ((state.status === "held" || state.status === "stopped") && str(d.reason_text)) row.status_reason_text = str(d.reason_text);
      if (sensitivity(e)) row.sensitivity = sensitivity(e);
      const k = key(e.item.issuer, ingredient ?? `line:${String(d.med_id)}`), prev = byDrug.get(k);
      if (!prev || compare(prev.entry, e) < 0) byDrug.set(k, { row, entry: e });
    }
  }
  return [...byDrug.values()].sort((a, b) => cmp(a.row.ingredient ?? a.row.drug_name, b.row.ingredient ?? b.row.drug_name) || compare(a.entry, b.entry)).map(x => x.row);
}

function latestLines(entries: Entry[], type: string, idField: string, actions: string[]): Entry[] {
  const lines = new Map<string, Entry>();
  for (const e of entries) {
    const id = str(e.data[idField]);
    if (e.data.type === type && id && actions.includes(str(e.data.action) ?? "")) lines.set(key(e.item.issuer, id), e);
  }
  return [...lines.values()].sort(compare);
}

function isCkd(d: Obj): boolean {
  return /^N18(?:\.|$)/i.test(str(d.icd10cm) ?? "") || /\b(?:chronic kidney disease|chronic renal (?:disease|failure|insufficiency)|ckd)\b/i.test(str(d.description) ?? "");
}
function ckdStage(d: Obj): ProblemRow["ckd_stage"] {
  const text = str(d.description) ?? "";
  const m = /\bG(3[ab]|[1245])\b/i.exec(text) ?? /\bstage\s*(3[ab]|[1245])\b/i.exec(text);
  if (m) return ("G" + m[1].toLowerCase()) as ProblemRow["ckd_stage"];
  const codes: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
  };
  return codes[(str(d.icd10cm) ?? "").toUpperCase()];
}
const unconfirmed = (s: string): boolean => /\b(?:rule[ds]? out|ruled[- ]out|suspected|possible|probable|provisional|unconfirmed|working diagnosis|no evidence of)\b|\br\/?o\b|\?/.test(norm(s));

function conditionKeys(e: Entry): string[] {
  const d = e.data, code = str(d.icd10cm), snomed = str(d.snomed), description = str(d.description);
  if (isCkd(d)) return [key(e.item.issuer, "ckd")];
  return [code && key(e.item.issuer, "icd", code.toUpperCase()), snomed && key(e.item.issuer, "snomed", snomed),
    description && key(e.item.issuer, "name", norm(description))].filter((x): x is string => !!x);
}

type ProblemOutput = { rows: ProblemRow[]; entries: Entry[] };
function problemRows(entries: Entry[]): ProblemOutput {
  const lines = latestLines(entries, "problem_event", "problem_id", ["add", "update", "resolve", "remove"])
    .filter(e => e.data.action !== "remove" && str(e.data.description) && !unconfirmed(String(e.data.description)));
  // Join duplicate condition lines by their recorded identity; a CKD restaging is
  // the same condition. A removed line does not erase an independent valid line.
  const groups: { ids: Set<string>; latest: Entry }[] = [];
  for (const e of lines) {
    const ids = new Set(conditionKeys(e));
    const matches = groups.filter(g => [...ids].some(k => g.ids.has(k)));
    for (const g of matches) for (const k of g.ids) ids.add(k);
    for (const g of matches) groups.splice(groups.indexOf(g), 1);
    groups.push({ ids, latest: e });
  }
  const selected = groups.map(g => g.latest).sort(compare);
  const rows: ProblemRow[] = [];
  for (const e of selected) {
    const d = e.data, description = str(d.description)!;
    // Adverse-effect T codes without a named condition belong only in avoidance.
    if (/^T\d/i.test(str(d.icd10cm) ?? "") && /\badverse (?:effect|reaction)\b/i.test(description) && !reactionKind(description)) continue;
    const row: ProblemRow = { condition: description, status: d.action === "resolve" ? "resolved" : "active", evidence: evidence(e) };
    if (str(d.icd10cm)) row.icd10cm = str(d.icd10cm);
    if (str(d.snomed)) row.snomed = str(d.snomed);
    if (onset(d.onset)) row.onset = onset(d.onset);
    if (isCkd(d)) {
      if (ckdStage(d)) row.ckd_stage = ckdStage(d);
      const a = /\bA[123]\b/i.exec(description);
      if (a) row.albuminuria = a[0].toUpperCase() as ProblemRow["albuminuria"];
    }
    if (sensitivity(e)) row.sensitivity = sensitivity(e);
    rows.push(row);
  }
  rows.sort((a, b) => cmp(a.condition, b.condition));
  return { rows, entries: selected };
}

const aceInhibitors = ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "perindopril", "quinapril", "fosinopril", "trandolapril"];
const drugClasses: { pattern: RegExp; members: string[] }[] = [
  { pattern: /\bSGLT[- ]?2\s*(?:inhibitors?|i)\b/i, members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"] },
  { pattern: /\b(?:ACE[- ]?inhibitors?|angiotensin[- ]converting enzyme inhibitors?)\b/i, members: aceInhibitors },
  { pattern: /\bstatins?\b/i, members: ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin"] },
  { pattern: /\bNSAIDs?\b/i, members: ["ibuprofen", "naproxen", "diclofenac", "meloxicam", "celecoxib"] },
];

function positiveReaction(s: string): string {
  // Only strip explicitly negated clauses. Never search the entire narrative for
  // a reaction (e.g. "cough; no angioedema" must remain a side effect).
  return s.replace(/\b(?:no|not|without|denies|negative for)\s+[^;,.]*(?:[;,.]|$)/gi, " ");
}
function reactionKind(text: string): AllergyIntoleranceRow["reaction_type"] | undefined {
  const s = positiveReaction(text);
  if (/\b(?:hives|urticaria|rash|angioedema|anaphyla\w*|bronchospasm|stevens.johnson|toxic epidermal necrolysis)\b/i.test(s)) return "hypersensitivity";
  if (/\b(?:ketoacidosis|DKA|lactic acidosis|severe hyperkalemia|hyperkala?emia|acute kidney injury|AKI|renal failure|hepatotoxicity|rhabdomyolysis|pancreatitis|agranulocytosis|major bleeding|hypoglyc[ae]mia)\b/i.test(s)) return "serious_adverse_event";
  if (/\b(?:cough|nausea|vomiting|diarrh[oe]+a|gi upset|gastrointestinal upset|myalgia|muscle aches?|constipation|headache|dizziness|edema)\b/i.test(s)) return "side_effect";
}
function mechanism(substance: string, reaction: string, sourceType?: unknown): AllergyIntoleranceRow["mechanism"] {
  const s = norm(substance), r = positiveReaction(reaction);
  if ((aceInhibitors.some(d => wordIn(s, d)) || /ace[- ]?inhibitor|angiotensin.converting enzyme/i.test(s)) && /cough|angioedema/i.test(r)) return "non_immune";
  if (/ketoacidosis|\bDKA\b|lactic acidosis|hyperkala?emia|non[- ]immune|bradykinin/i.test(r)) return "non_immune";
  if (sourceType === "intolerance" || sourceType === "adverse_reaction") return "non_immune";
  if (sourceType === "allergy" || /\b(?:ige|t[- ]cell|immune[- ]mediated|positive allergy test)\b/i.test(r)) return "immune";
  return "unknown";
}

type AllergyCandidate = { entry: Entry; row: AllergyIntoleranceRow; explicit: boolean };
function allergySubstance(d: Obj): string | undefined {
  const substance = obj(d.substance), name = str(substance.name);
  if (!name || /^(?:nkda|nka|no known (?:drug )?allergies)$/i.test(name.trim())) return;
  const known = knownIngredients(name);
  if (known.length === 1) return known[0];
  return str(substance.rxnorm) ? ingredients(name)[0] ?? norm(name) : name;
}

function drugCaused(e: Entry, all: Entry[]): AllergyCandidate | undefined {
  const text = str(e.data.description);
  if (!text || unconfirmed(text)) return;
  const isT = /^T\d/i.test(str(e.data.icd10cm) ?? "");
  const drugT = /^T(?:3[6-9]|4\d|50)(?:\.|$)/i.test(str(e.data.icd10cm) ?? "");
  const attribution = text.replace(/\b(?:not|never)\s+(?:due to|caused by|attributed to|associated with|related to)\b[^;.]*/gi, "")
    .replace(/\bunrelated to\b[^;.]*/gi, "");
  if (!/(?:associated|induced|attributed|due to|caused by|secondary to|adverse (?:effect|reaction)|from|related to)/i.test(attribution)) return;
  let substance: string | undefined;
  let refs = evidence(e);
  const specific = knownIngredients(attribution);
  if (specific.length === 1) substance = specific[0];
  if (!substance) {
    const cls = drugClasses.find(c => c.pattern.test(attribution));
    if (cls) {
      substance = cls.pattern.exec(attribution)![0];
      const sameItem = all.filter(a => a.item === e.item && a.data.type === "med_event");
      const candidates = sameItem.flatMap(a => ingredients(str(obj(a.data.drug).name) ?? "").filter(n => cls.members.includes(n)).map(n => ({ n, a })));
      const unique = [...new Set(candidates.map(c => c.n))];
      if (unique.length === 1) {
        substance = unique[0];
        refs = combineEvidence(refs, ...candidates.filter(c => c.n === substance).map(c => evidence(c.a)));
      }
    }
  }
  if (!substance) {
    const m = /^(.+?)[ -](?:associated|induced)\b/i.exec(attribution)
      ?? /\b(?:due to|caused by|attributed to|secondary to|adverse (?:effect|reaction) (?:of|to))\s+(.+?)(?:[,;.(]|$)/i.exec(attribution);
    if (m) {
      const raw = m[1].trim();
      if (/\b(?:inhibitors?|blockers?|antibiotics?|agents?|drugs?|statins?)\b/i.test(raw)) substance = raw;
      else if (!/\b(?:drug|medication|unspecified|unknown)\b/i.test(raw)) {
        const name = ingredients(raw)[0];
        // "AKI due to dehydration" is not a drug-attributed diagnosis. An
        // unfamiliar name needs a drug adverse-effect code or a structured drug
        // mention; causal grammar alone is insufficient evidence of a drug.
        const mention = all.find(a => a.data.type === "med_event" && ingredients(str(obj(a.data.drug).name) ?? "").includes(name));
        if (name && (drugT || mention)) {
          substance = name;
          if (mention && !drugT) refs = combineEvidence(refs, evidence(mention));
        }
      }
    }
  }
  if (!substance) return;
  const kind = reactionKind(text) ?? (isT ? "serious_adverse_event" : undefined);
  if (!kind) return;
  const row: AllergyIntoleranceRow = {
    substance, reaction_type: kind, mechanism: mechanism(substance, text), reaction: text,
    criticality: kind === "serious_adverse_event" || /anaphyla|angioedema|stevens.johnson|toxic epidermal necrolysis/i.test(text) ? "high" : kind === "side_effect" ? "low" : "unknown",
    evidence: refs,
  };
  // A generic T-code does not establish that the historical reaction was severe.
  if (!reactionKind(text)) row.criticality = "unknown";
  if (onset(e.data.onset)) row.onset = onset(e.data.onset);
  if (sensitivity(e)) row.sensitivity = sensitivity(e);
  return { entry: e, row, explicit: false };
}

function allergyRows(entries: Entry[], problems: Entry[]): AllergyIntoleranceRow[] {
  const candidates: AllergyCandidate[] = [];
  const inactive = new Map<string, Entry>();
  const lines = latestLines(entries, "allergy_event", "allergy_id", ["add", "update", "inactivate"]);
  for (const e of lines) {
    const d = e.data, substance = allergySubstance(d);
    if (!substance) continue;
    const k = key(e.item.issuer, norm(substance));
    if (d.action === "inactivate") { inactive.set(k, e); continue; }
    const reaction = strings(d.reactions).filter(s => s.trim()).join("; ");
    const kind = reactionKind(reaction) ?? (d.reaction_type === "allergy" ? "hypersensitivity" : d.reaction_type === "intolerance" ? "side_effect" : d.reaction_type === "adverse_reaction" ? "serious_adverse_event" : undefined);
    if (!kind) continue;
    const row: AllergyIntoleranceRow = {
      substance, reaction_type: kind, mechanism: mechanism(substance, reaction, d.reaction_type),
      criticality: d.severity === "low" || d.severity === "high" ? d.severity : "unknown", evidence: evidence(e),
    };
    if (reaction) row.reaction = reaction;
    if (str(obj(d.substance).rxnorm)) row.rxnorm_ingredient = str(obj(d.substance).rxnorm);
    if (onset(d.onset)) row.onset = onset(d.onset);
    candidates.push({ entry: e, row, explicit: true });
  }
  for (const e of problems) {
    const derived = drugCaused(e, entries);
    if (!derived) continue;
    const invalidated = inactive.get(key(e.item.issuer, norm(derived.row.substance)));
    if (!invalidated || compare(invalidated, e) < 0) candidates.push(derived);
  }
  const grouped = new Map<string, AllergyCandidate[]>();
  for (const c of candidates) {
    const k = key(c.entry.item.issuer, norm(c.row.substance));
    const group = grouped.get(k) ?? [];
    group.push(c); grouped.set(k, group);
  }
  const rows: AllergyIntoleranceRow[] = [];
  for (const group of grouped.values()) {
    // A curated allergy line supplies criticality/mechanism over a derived diagnosis.
    group.sort((a, b) => Number(a.explicit) - Number(b.explicit) || compare(a.entry, b.entry));
    const chosen = group[group.length - 1];
    const explicit = group.filter(c => c.explicit);
    // Multiple still-current allergy lines may describe different reactions to
    // the same substance. Keep their reactions instead of losing the older one.
    const descriptions = new Map<string, string>();
    for (const c of (explicit.length ? explicit : group)) {
      const recorded = c.explicit ? strings(c.entry.data.reactions) : c.row.reaction ? [c.row.reaction] : [];
      for (const reaction of recorded) if (reaction.trim()) descriptions.set(norm(reaction), reaction);
    }
    if (descriptions.size) chosen.row.reaction = [...descriptions.values()].join("; ");
    const sources = explicit.length ? explicit : group;
    if (sources.length > 1) {
      const kinds = sources.map(c => c.row.reaction_type);
      chosen.row.reaction_type = kinds.includes("hypersensitivity") ? "hypersensitivity"
        : kinds.includes("serious_adverse_event") ? "serious_adverse_event" : "side_effect";
      const criticalities = sources.map(c => c.row.criticality);
      chosen.row.criticality = criticalities.includes("high") ? "high"
        : criticalities.every(c => c === "low") ? "low" : "unknown";
      const mechanisms = new Set(sources.map(c => c.row.mechanism));
      if (mechanisms.size > 1) chosen.row.mechanism = "unknown";
    }
    chosen.row.evidence = combineEvidence(chosen.row.evidence, ...group.map(c => c.row.evidence));
    const sensitive = [...new Set(group.flatMap(c => c.row.sensitivity ?? []))];
    if (sensitive.length) chosen.row.sensitivity = sensitive;
    rows.push(chosen.row);
  }
  return rows.sort((a, b) => cmp(a.substance, b.substance));
}

const labUnits: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L",
  chloride: "mmol/L", bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL",
  a1c: "%", uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L",
  ph: "[pH]", pco2: "mmHg", lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL",
  triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const labCodes: Record<string, Analyte> = {
  CREAT: "creatinine", CREATININE: "creatinine", CR: "creatinine", K: "potassium", POTASSIUM: "potassium",
  NA: "sodium", SODIUM: "sodium", CL: "chloride", CHLORIDE: "chloride", CO2: "bicarbonate", TCO2: "bicarbonate", HCO3: "bicarbonate",
  BICARB: "bicarbonate", BICARBONATE: "bicarbonate", AG: "anion_gap", ANIONGAP: "anion_gap", BUN: "bun", UREANITROGEN: "bun",
  GLU: "glucose", GLUC: "glucose", GLUCOSE: "glucose", A1C: "a1c", HBA1C: "a1c", HGBA1C: "a1c",
  UACR: "uacr", ACR: "uacr", UMICROALBCR: "uacr", PLT: "platelets", PLATELETS: "platelets", WBC: "wbc",
  HGB: "hemoglobin", HB: "hemoglobin", HEMOGLOBIN: "hemoglobin", BHB: "bhb", BOHB: "bhb", PH: "ph", PCO2: "pco2",
  LIP: "lipase", LIPASE: "lipase", TNI: "troponin", TROPONINI: "troponin", TROPONIN: "troponin", TROP: "troponin",
  CHOL: "cholesterol", TC: "cholesterol", CHOLESTEROL: "cholesterol", TG: "triglycerides", TRIG: "triglycerides", TRIGLYCERIDES: "triglycerides",
  HDL: "hdl", HDLC: "hdl", LDL: "ldl", LDLC: "ldl", LDLCALC: "ldl", LDLDIRECT: "ldl",
};
const labLoincs: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "33915-0": "egfr", "62238-1": "egfr", "98979-8": "egfr",
  "2823-3": "potassium", "2951-2": "sodium", "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate",
  "10466-1": "anion_gap", "33037-3": "anion_gap", "3094-0": "bun", "2345-7": "glucose", "4548-4": "a1c", "17856-6": "a1c",
  "9318-7": "uacr", "14959-1": "uacr", "14958-3": "uacr", "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc",
  "718-7": "hemoglobin", "6873-4": "bhb", "53060-3": "bhb", "2744-1": "ph", "2746-6": "ph",
  "2019-8": "pco2", "2021-4": "pco2", "3040-3": "lipase", "10839-9": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl",
};

function analyte(d: Obj): Analyte | undefined {
  const test = obj(d.test), name = norm(str(test.name) ?? ""), external = obj(d.external_ref);
  // Reject specimen/type mismatches before considering an abbreviated local code.
  if (/\burine\b/.test(name) && !/(?:albumin|microalbumin).*creatinine|uacr|albumin.creatinine/.test(name)) return;
  if (/troponin\s*t\b|\b(?:oxygen|po2|saturation)\b/.test(name)) return;
  const code = (str(test.nfm_code) ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const ext = (str(external.result_code) ?? "").toUpperCase().replace(/^LK-/, "").replace(/[^A-Z0-9]/g, "");
  if (/^EGFR/.test(code) || /^EGFR/.test(ext) || /\begfr\b|estimated glomerular filtration/.test(name)) return "egfr";
  const loinc = str(test.loinc);
  if (loinc && Object.hasOwn(labLoincs, loinc)) return labLoincs[loinc];
  if (labCodes[code] || labCodes[ext]) return labCodes[code] ?? labCodes[ext];
  const names: [RegExp, Analyte][] = [
    [/(?:micro)?albumin\s*(?:\/|:|[- ]to[- ])?\s*creatinine.*ratio|urine albumin.creatinine|\buacr\b/, "uacr"],
    [/\bhemoglobin a1c\b|\bha?ba1c\b|\ba1c\b/, "a1c"],
    [/\bcreatinine\b(?!.*(?:clearance|ratio))/, "creatinine"], [/\bpotassium\b/, "potassium"], [/\bsodium\b/, "sodium"],
    [/\bchloride\b/, "chloride"], [/\bpco2\b|carbon dioxide partial pressure/, "pco2"],
    [/\bbicarbonate\b|carbon dioxide|total co2/, "bicarbonate"], [/anion gap/, "anion_gap"],
    [/urea nitrogen|\bbun\b/, "bun"], [/\bglucose\b/, "glucose"], [/platelet/, "platelets"], [/white (?:blood )?cell|\bwbc\b|leukocyte/, "wbc"],
    [/\bhemoglobin\b/, "hemoglobin"], [/beta[- ]hydroxybutyrate|β[- ]hydroxybutyrate|\bbhb\b/, "bhb"],
    [/\bph\b/, "ph"], [/\blipase\b/, "lipase"], [/troponin i\b/, "troponin"],
    [/\bhdl\b|high.density lipoprotein/, "hdl"], [/\bldl\b|low.density lipoprotein/, "ldl"], [/triglyceride/, "triglycerides"], [/\bcholesterol\b/, "cholesterol"],
  ];
  return names.find(([pattern]) => pattern.test(name))?.[1];
}

function numericValue(x: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof x !== "string") return;
  const m = /^\s*(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*$/.exec(x);
  if (!m || !Number.isFinite(+m[2])) return;
  const comparator = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1];
  return comparator ? { value: +m[2], comparator: comparator as LabResultRow["comparator"] } : { value: +m[2] };
}

function labScale(a: Analyte, unit: unknown): number | undefined {
  if (typeof unit !== "string") return;
  const u = unit.trim().replace(/[µμ]/g, "u").replace(/²/g, "2").replace(/\^/g, "").replace(/\s/g, "").toLowerCase();
  const canonical = labUnits[a].toLowerCase();
  if (u === canonical) return 1;
  if ((a === "platelets" || a === "wbc") && (u === "cells/ul" || u === "/ul")) return 0.001;
  if ((a === "platelets" || a === "wbc") && ["k/ul", "103/ul", "10e3/ul", "109/l", "10*9/l"].includes(u)) return 1;
  if (["potassium", "sodium", "chloride", "bicarbonate", "anion_gap"].includes(a) && u === "meq/l") return 1;
  if (a === "egfr" && ["ml/min/1.73m2", "ml/min/1.73m^2"].includes(u)) return 1;
  if (a === "ph" && (u === "" || u === "ph")) return 1;
  if (a === "lipase" && u === "iu/l") return 1;
  if (a === "uacr" && u === "ug/mg") return 1;
  // Unknown units are never silently relabelled as the consumer's units.
}

function equation(d: Obj): NonNullable<LabResultRow["egfr_equation"]> {
  const note = str(d.comment) ?? "";
  const from = (s: string): LabResultRow["egfr_equation"] => {
    const text = s.replace(/\b(?:not|formerly|previously)\b[^.;]*/gi, "");
    const year = /CKD[- ]?EPI\b[^.;]{0,50}?\b(2021|2009)\b/i.exec(text)?.[1]
      ?? /\b(2021|2009)\s*CKD[- ]?EPI/i.exec(text)?.[1];
    if (year === "2021") return "ckd-epi-2021";
    if (year === "2009") return "ckd-epi-2009";
    if (/\bMDRD\b/i.test(text)) return "mdrd";
  };
  const method = from(note);
  if (method) return method;
  // An explicit but unrecognized method note must not be overridden by a code.
  if (/\b(?:equation|method|calculated (?:by|using)|CKD[- ]?EPI)\b/i.test(note)) return "unknown";
  const t = obj(d.test), ext = obj(d.external_ref);
  const text = [str(t.name), str(t.nfm_code), str(ext.result_code)].filter(Boolean).join(" ");
  const named = from(text);
  if (named) return named;
  if (/EGFR[-_ ]?(?:2021|21)(?:\b|[A-Z])/i.test(text)) return "ckd-epi-2021";
  if (/EGFR[-_ ]?(?:2009|09)(?:\b|[AN])/i.test(text)) return "ckd-epi-2009";
  return "unknown";
}

function raceAdjusted(d: Obj): boolean {
  const t = obj(d.test), ext = obj(d.external_ref), name = norm(str(t.name) ?? "");
  const code = (str(t.nfm_code) ?? "").toUpperCase(), external = (str(ext.result_code) ?? "").toUpperCase();
  // The generic method comment can mention both variants; it does not identify
  // this component. Use component name/codes, with negative qualifiers first.
  if (/non[- ]?(?:african|black)|non[- ]?aa|without.*race|race[- ]?free/.test(name) || /(?:NAA|NONAA|09N)$/.test(code) || /09N$/.test(external)) return false;
  if (/african american|\bblack\b|with (?:a )?race coefficient/.test(name) || /(?:^|[-_])AA$|09A$/.test(code) || /09A$/.test(external)) return true;
  return t.loinc === "48643-1" || t.loinc === "33915-0";
}

function labRows(entries: Entry[]): LabResultRow[] {
  const components = new Map<string, Entry>();
  const statusRank = (e: Entry): number => e.data.result_status === "C" ? 3 : e.data.result_status === "F" ? 2 : 1;
  const prefer = (e: Entry, prev: Entry): boolean => statusRank(e) > statusRank(prev)
    || (statusRank(e) === statusRank(prev) && (e.item.recorded > prev.item.recorded
      || (e.item.recorded === prev.item.recorded && compare(prev, e) < 0)));
  for (const e of entries) {
    const d = e.data;
    if (d.type !== "imported_result" || !["P", "F", "C"].includes(str(d.result_status) ?? "")) continue;
    const ext = obj(d.external_ref), t = obj(d.test);
    const accession = str(ext.accession), component = str(ext.result_code) ?? str(t.nfm_code);
    const k = accession && component ? key(e.item.issuer, str(ext.lab) ?? "Lakeview Labs", accession, component)
      : key(e.item.issuer, e.item.id, e.id);
    const prev = components.get(k);
    if (!prev || prefer(e, prev)) components.set(k, e);
  }
  const calculations = new Map<string, Entry>();
  const selected: Entry[] = [];
  for (const e of components.values()) {
    if (analyte(e.data) !== "egfr") { selected.push(e); continue; }
    if (raceAdjusted(e.data)) continue;
    const method = equation(e.data), ext = obj(e.data.external_ref), accession = str(ext.accession);
    const collected = str(e.data.collected), instant = collected ? epoch(collected) : undefined;
    // Aliases for one named calculation on one specimen are copies. Unknown
    // equations cannot safely be assumed to be the same calculation.
    if (method === "unknown" || !accession || instant === undefined) { selected.push(e); continue; }
    const k = key(e.item.issuer, str(ext.lab) ?? "Lakeview Labs", accession, String(instant), method);
    const prev = calculations.get(k);
    if (!prev || prefer(e, prev)) calculations.set(k, e);
  }
  selected.push(...calculations.values());
  const results: { row: LabResultRow; entry: Entry }[] = [];
  // Resolve copies before parsing values: an invalidated corrected component
  // must suppress the earlier numeric result, not let it reappear.
  for (const e of selected) {
    const d = e.data, a = analyte(d), parsed = numericValue(d.value), collected = str(d.collected);
    if (!a || !parsed || !collected || !dateTime(collected) || !hasOffset(collected)) continue;
    if (a === "egfr" && raceAdjusted(d)) continue;
    const scale = labScale(a, d.unit);
    if (scale === undefined || !Number.isFinite(parsed.value * scale)) continue;
    const row: LabResultRow = {
      analyte: a, value: parsed.value * scale, unit: labUnits[a], collected,
      status: d.result_status === "P" ? "preliminary" : "final", evidence: evidence(e),
    };
    if (parsed.comparator) row.comparator = parsed.comparator;
    if (str(obj(d.test).loinc)) row.loinc = str(obj(d.test).loinc);
    if (a === "egfr") row.egfr_equation = equation(d);
    results.push({ row, entry: e });
  }
  return results.sort((a, b) => (epoch(a.row.collected)! - epoch(b.row.collected)!) || cmp(a.row.analyte, b.row.analyte) || compare(a.entry, b.entry)).map(x => x.row);
}

function bp(x: unknown): [number, number] | undefined {
  if (typeof x !== "string") return;
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(x);
  if (!m || !Number.isFinite(+m[1]) || !Number.isFinite(+m[2])) return;
  return [+m[1], +m[2]];
}
function vitalRows(entries: Entry[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const e of entries) {
    if (e.data.type !== "vital_set") continue;
    const time = local(e.item.effective);
    if (!time || time.length < 16) continue; // Do not fabricate a measurement time from a date.
    const d = e.data, first = bp(d.bp), repeat = bp(d.bp_repeat), pulse = num(d.pulse_bpm), weight = num(d.weight_lb);
    const row: VitalRow = { setting: "clinic", local_time: time.slice(0, 16), evidence: evidence(e) };
    if (first) [row.systolic_mmhg, row.diastolic_mmhg] = first;
    if (repeat) [row.repeat_systolic_mmhg, row.repeat_diastolic_mmhg] = repeat;
    if (pulse !== undefined && pulse >= 0) row.pulse_bpm = pulse;
    if (weight !== undefined && weight >= 0 && Number.isFinite(weight * 0.45359237 * 10)) row.weight_kg = Math.round(weight * 0.45359237 * 10) / 10;
    if (first || repeat || row.pulse_bpm !== undefined || row.weight_kg !== undefined) rows.push(row);
  }
  return rows;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const entries = currentEntries(items, asOf), problems = problemRows(entries);
  return {
    medications: medicationRows(entries), problems: problems.rows,
    allergies: allergyRows(entries, problems.entries), labs: labRows(entries), vitals: vitalRows(entries),
  };
}
