// Riverside Regional Hospital signed documents (riverside-doc-v1) -> consumer views v2.
import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  ProblemRow,
  AllergyIntoleranceRow,
  LabResultRow,
  VitalRow,
  Evidence,
  Sensitivity,
  Analyte,
} from "../in/views/views";

const TZ = "America/Chicago";

// ───────────────────────────── helpers ─────────────────────────────

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x : undefined;
}
function num(x: unknown): number | undefined {
  return typeof x === "number" && isFinite(x) ? x : undefined;
}

let fmt: Intl.DateTimeFormat | undefined;
function localParts(iso: string): { date: string; time: string } | undefined {
  if (typeof iso !== "string") return undefined;
  const s = iso.trim();
  // Wall-clock time without zone: taken as local, reported as written.
  const noZone = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/.exec(s);
  if (noZone) return { date: noZone[1], time: `${noZone[2]}:${noZone[3]}` };
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(s)) return { date: s, time: "" };
  const ms = Date.parse(s);
  if (isNaN(ms)) return undefined;
  if (!fmt)
    fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(new Date(ms))) p[part.type] = part.value;
  const hour = p.hour === "24" ? "00" : p.hour;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${hour}:${p.minute}` };
}
function localDate(iso: unknown): string | undefined {
  return typeof iso === "string" ? localParts(iso)?.date : undefined;
}
function instant(iso: unknown): number {
  if (typeof iso !== "string") return NaN;
  const s = iso.trim();
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(s)) return Date.parse(s.replace(" ", "T") + "Z"); // approx
  if (/^\d{4}$/.test(s)) return Date.parse(s + "-01-01T00:00:00Z");
  if (/^\d{4}-\d{2}$/.test(s)) return Date.parse(s + "-01T00:00:00Z");
  return Date.parse(s);
}
function precisionOf(d: string): "year" | "month" | "day" {
  return d.length === 4 ? "year" : d.length === 7 ? "month" : "day";
}
function uniqEvidence(ev: Evidence): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const e of ev) {
    const k = e.item_id + "\u0000" + (e.entry_id ?? "");
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(e);
  }
  return out;
}

// ───────────────────────────── documents ─────────────────────────────

interface Doc {
  item: FolioItem;
  enc?: Record<string, any>;
  kind: string;
  encId: string;
  recordedMs: number;
  /** Local date the document's decisions are about. */
  date?: string;
  order: number;
}

function entriesOf(doc: Doc, type: string): [string, Record<string, any>][] {
  const out: [string, Record<string, any>][] = [];
  const p = doc.item.payload;
  if (!isObj(p)) return out;
  for (const k of Object.keys(p)) {
    const e = p[k];
    if (isObj(e) && e.type === type) out.push([k, e]);
  }
  return out;
}

function currentDocs(items: FolioItem[], asOf: string): Doc[] {
  const inScope = (Array.isArray(items) ? items : []).filter((it) => {
    if (!isObj(it) || typeof it.id !== "string") return false;
    const d = localDate(it.recorded);
    return d !== undefined && d.slice(0, 10) <= asOf;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const list of [it.supersedes, it.retracts]) {
      if (!Array.isArray(list)) continue;
      for (const id of list) if (typeof id === "string") dead.add(it.issuer + "\u0000" + id);
    }
  }
  const docs: Doc[] = [];
  for (const it of inScope) {
    if (dead.has(it.issuer + "\u0000" + it.id)) continue;
    const p = isObj(it.payload) ? it.payload : {};
    let enc: Record<string, any> | undefined;
    for (const k of Object.keys(p)) if (isObj(p[k]) && p[k].type === "encounter") { enc = p[k]; break; }
    const kind = str(enc?.document_kind) ?? "unknown";
    const encId = str(enc?.encounter_id) ?? "item:" + it.id;
    let date: string | undefined;
    if (kind === "discharge_summary") date = localDate(enc?.discharged) ?? localDate(it.effective_end);
    if (!date) date = localDate(it.effective) ?? localDate(it.recorded);
    docs.push({ item: it, enc, kind, encId, recordedMs: instant(it.recorded), date, order: 0 });
  }
  // Chronological order: encounters by start, within an encounter the discharge summary last.
  const encStart = new Map<string, number>();
  for (const d of docs) {
    let t = instant(d.enc?.arrived);
    if (isNaN(t)) t = instant(d.enc?.admitted);
    if (isNaN(t)) t = instant(d.item.effective);
    if (isNaN(t)) t = d.recordedMs;
    const prev = encStart.get(d.encId);
    if (!isNaN(t) && (prev === undefined || t < prev)) encStart.set(d.encId, t);
  }
  const n = (x: number | undefined) => (x === undefined || isNaN(x) ? 0 : x);
  docs.sort(
    (a, b) =>
      n(encStart.get(a.encId)) - n(encStart.get(b.encId)) ||
      (a.encId < b.encId ? -1 : a.encId > b.encId ? 1 : 0) ||
      (a.kind === "discharge_summary" ? 1 : 0) - (b.kind === "discharge_summary" ? 1 : 0) ||
      n(a.recordedMs) - n(b.recordedMs) ||
      (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0),
  );
  docs.forEach((d, i) => (d.order = i));
  return docs;
}

// ───────────────────────────── drug vocabulary ─────────────────────────────

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  glucophage: "metformin", lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  semglee: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro",
  novolog: "insulin aspart", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide", januvia: "sitagliptin",
  tradjenta: "linagliptin", glucotrol: "glipizide", amaryl: "glimepiride", lipitor: "atorvastatin",
  crestor: "rosuvastatin", zocor: "simvastatin", pravachol: "pravastatin", zestril: "lisinopril",
  prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril", cozaar: "losartan", diovan: "valsartan",
  benicar: "olmesartan", avapro: "irbesartan", norvasc: "amlodipine", lasix: "furosemide", bumex: "bumetanide",
  microzide: "hydrochlorothiazide", aldactone: "spironolactone", toprol: "metoprolol", lopressor: "metoprolol",
  coreg: "carvedilol", synthroid: "levothyroxine", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", plavix: "clopidogrel", aleve: "naproxen", naprosyn: "naproxen", advil: "ibuprofen",
  motrin: "ibuprofen", tylenol: "acetaminophen", zoloft: "sertraline", lexapro: "escitalopram",
  prozac: "fluoxetine", wellbutrin: "bupropion", entresto: "sacubitril / valsartan", kerendia: "finerenone",
};

const SALTS = new Set([
  "potassium", "sodium", "hydrochloride", "hcl", "succinate", "tartrate", "besylate", "maleate", "mesylate",
  "calcium", "magnesium", "fumarate", "citrate", "acetate", "sulfate", "phosphate", "bromide", "dihydrate",
  "monohydrate", "hyclate", "propionate", "dipropionate", "furoate",
]);
const FORMS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "oral", "solution", "suspension",
  "injection", "injectable", "pen", "pens", "er", "xr", "sr", "dr", "ec", "xl", "la", "cr", "extended-release",
  "delayed-release", "extended", "release", "chewable", "patch", "cream", "ointment", "inhaler", "subq",
  "subcutaneous", "vial", "prefilled", "syringe", "kwikpen", "flexpen", "flextouch", "solostar", "film",
  "coated", "odt", "liquid", "drops", "spray", "po", "iv", "u-100", "u100", "u-200", "u-500",
]);

function ingredientFromName(name: string): string | undefined {
  let s = name.toLowerCase().replace(/[®™]/g, "").trim();
  // cut at the first strength or parenthesis
  const cut = s.search(/(\(|\b\d)/);
  if (cut > 0) s = s.slice(0, cut);
  const parts = s.split(/\s*(?:\/|\+|,|\band\b|-(?=\s))\s*/).filter((x) => x.trim() !== "");
  const out: string[] = [];
  for (const part of parts) {
    let words = part.split(/\s+/).filter((w) => w && !FORMS.has(w));
    if (words.length === 0) continue;
    if (BRANDS[words[0]]) {
      out.push(BRANDS[words[0]]);
      continue;
    }
    words = [words[0], ...words.slice(1).filter((w) => !SALTS.has(w))];
    out.push(words.join(" "));
  }
  if (out.length === 0) return undefined;
  return out.join(" / ");
}

/** Drug classes, for diagnoses that name only a class. */
const CLASSES: { re: RegExp; members: RegExp; name: string }[] = [
  { re: /sglt-?2/i, members: /gliflozin$/, name: "SGLT2 inhibitor" },
  { re: /\bace[- ]?(inhibitor|i)\b|angiotensin[- ]converting/i, members: /pril$/, name: "ACE inhibitor" },
  { re: /\barbs?\b|angiotensin (ii )?receptor/i, members: /sartan$/, name: "ARB" },
  { re: /\bstatins?\b|hmg-?coa/i, members: /statin$/, name: "statin" },
  { re: /\bnsaids?\b|non-?steroidal/i, members: /^(naproxen|ibuprofen|diclofenac|meloxicam|celecoxib|indomethacin|ketorolac|aspirin|nabumetone|etodolac|piroxicam|ketoprofen)$/, name: "NSAID" },
  { re: /\bthiazides?\b/i, members: /^(hydrochlorothiazide|chlorthalidone|indapamide|metolazone|chlorothiazide)$/, name: "thiazide" },
  { re: /loop diuretic/i, members: /^(furosemide|bumetanide|torsemide|ethacrynic acid)$/, name: "loop diuretic" },
  { re: /\bdiuretics?\b/i, members: /^(hydrochlorothiazide|chlorthalidone|indapamide|metolazone|furosemide|bumetanide|torsemide|spironolactone|eplerenone|amiloride|triamterene)$/, name: "diuretic" },
  { re: /beta[- ]?blocker/i, members: /olol$|^carvedilol$|^labetalol$/, name: "beta blocker" },
  { re: /dpp-?4/i, members: /gliptin$/, name: "DPP-4 inhibitor" },
  { re: /glp-?1/i, members: /glutide$|^exenatide$|^tirzepatide$/, name: "GLP-1 receptor agonist" },
  { re: /sulfonylurea/i, members: /^(glipizide|glyburide|glimepiride|gliclazide)$/, name: "sulfonylurea" },
  { re: /\binsulin\b/i, members: /^insulin\b/, name: "insulin" },
  { re: /penicillin/i, members: /cillin$/, name: "penicillin" },
  { re: /fluoroquinolone/i, members: /floxacin$/, name: "fluoroquinolone" },
  { re: /\bopioids?\b/i, members: /^(oxycodone|hydrocodone|morphine|hydromorphone|tramadol|codeine|fentanyl|methadone|tapentadol)$/, name: "opioid" },
  { re: /mineralocorticoid|aldosterone antagonist/i, members: /^(spironolactone|eplerenone|finerenone)$/, name: "mineralocorticoid receptor antagonist" },
];

// ICD-10-CM T-code (adverse effect) categories -> class phrase.
const TCODE_CLASSES: [RegExp, string][] = [
  [/^T383X5/, "insulin and oral hypoglycemic"],
  [/^T464X5/, "ACE inhibitor"],
  [/^T395X5|^T393\d5/, "NSAID"],
  [/^T466X5/, "statin"],
  [/^T360X5/, "penicillin"],
  [/^T501X5/, "loop diuretic"],
  [/^T502X5/, "diuretic"],
  [/^T402X5|^T404\d5/, "opioid"],
];

const DRUG_SUFFIX = /(pril|sartan|statin|gliflozin|gliptin|olol|dipine|thiazide|profen|cillin|mycin|floxacin|xaban|parin|glutide|formin|azole|oxacin|cycline|semide|tidine|prazole)$/;
const KNOWN_DRUGS = /^(naproxen|metformin|lithium|warfarin|digoxin|amiodarone|allopurinol|spironolactone|carvedilol|labetalol|insulin|clopidogrel|aspirin|ibuprofen|diclofenac|celecoxib|tramadol|glipizide|glyburide|glimepiride|chlorthalidone|furosemide|bumetanide|torsemide|vancomycin|trimethoprim|sulfamethoxazole|tirzepatide|exenatide)$/;

function isDrugWord(s: string): boolean {
  const w = s.toLowerCase().trim();
  return DRUG_SUFFIX.test(w) || KNOWN_DRUGS.test(w) || BRANDS[w] !== undefined;
}

// ───────────────────────────── sensitivity ─────────────────────────────

function sensitivityForCode(icd?: string, text?: string): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  const c = (icd ?? "").toUpperCase().replace(".", "");
  const t = (text ?? "").toLowerCase();
  if (/^F1\d/.test(c) || /\b(alcohol use|opioid use|substance use|cannabis use|cocaine|stimulant use|alcoholism|addiction)\b/.test(t)) s.add("substance-use");
  else if (/^F/.test(c) || /\b(depress|anxiety|bipolar|schizo|ptsd|post-traumatic|psychos|adhd|eating disorder|anorexia nervosa|bulimia|panic disorder|ocd|suicid)/.test(t)) s.add("mental-health");
  if (/^(B2[0-4]|Z21|A5\d|A6[0-4]|Z206)/.test(c) || /\b(hiv|syphilis|gonorrh|chlamydia|herpes simplex genital|trichomon)/.test(t)) s.add("hiv-sti");
  if (/^(O\d|Z3[0-9]|Z3A)/.test(c) || /\b(pregnan|contracept|infertil|abortion|miscarriage)/.test(t)) s.add("sexual-reproductive-health");
  if (/^(Q9[0-9]|Z15|Z14)/.test(c) || /\b(genetic|brca|lynch syndrome|hereditary)/.test(t)) s.add("genetic");
  return s.size ? [...s] : undefined;
}

const MH_DRUGS = /^(sertraline|escitalopram|citalopram|fluoxetine|paroxetine|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|quetiapine|olanzapine|risperidone|aripiprazole|ziprasidone|lurasidone|haloperidol|clozapine|lithium|lamotrigine|lorazepam|alprazolam|clonazepam|diazepam|buspirone|methylphenidate|amphetamine|lisdexamfetamine|atomoxetine|vortioxetine|amitriptyline|nortriptyline)$/;
const SU_DRUGS = /^(buprenorphine|naltrexone|methadone|disulfiram|acamprosate|varenicline|buprenorphine \/ naloxone)$/;
const HIV_DRUGS = /^(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|efavirenz|rilpivirine|darunavir|abacavir|lamivudine|zidovudine|cabotegravir)/;
const REPRO_DRUGS = /(estradiol|ethinyl|norethindrone|levonorgestrel|drospirenone|medroxyprogesterone|norgestimate|etonogestrel|desogestrel|progesterone|sildenafil|tadalafil)/;

function sensitivityForDrug(ing?: string): Sensitivity[] | undefined {
  if (!ing) return undefined;
  const s = new Set<Sensitivity>();
  for (const part of ing.split(" / ")) {
    if (SU_DRUGS.test(part)) s.add("substance-use");
    else if (MH_DRUGS.test(part)) s.add("mental-health");
    if (HIV_DRUGS.test(part)) s.add("hiv-sti");
    if (REPRO_DRUGS.test(part)) s.add("sexual-reproductive-health");
  }
  return s.size ? [...s] : undefined;
}

// ───────────────────────────── medications ─────────────────────────────

type MedStatus = MedicationRow["status"];
function mapMedStatus(s: unknown): MedStatus | undefined {
  switch (s) {
    case "not_reconciled": return "unknown";
    case "continue": case "new": case "changed": return "active";
    case "held": return "held";
    case "stopped": return "stopped";
  }
  return undefined;
}

function parseDose(doseText: unknown, drugName: string): MedicationRow["dose"] | undefined {
  if (typeof doseText !== "string") return undefined;
  const m = /^\s*(\d+(?:\.\d+)?|\.\d+)\s*([a-zA-Zµμ\[\]]+(?:\s*[a-zA-Z]+)?)\.?\s*$/.exec(doseText.replace(/,/g, ""));
  if (!m) return undefined;
  const v = parseFloat(m[1]);
  if (!isFinite(v)) return undefined;
  const u = m[2].toLowerCase().replace(/\s+/g, "");
  if (u === "mg" || u === "milligram" || u === "milligrams") return { value: v, unit: "mg" };
  if (u === "g" || u === "gram" || u === "grams") return { value: round(v * 1000, 4), unit: "mg" };
  if (u === "mcg" || u === "ug" || u === "µg" || u === "μg" || u === "microgram" || u === "micrograms") return { value: v, unit: "mcg" };
  if (/^(unit|units|u|iu|\[iu\]|unt|intlunits?)$/.test(u)) return { value: v, unit: "units" };
  if (u === "ml" || u === "cc" || u === "milliliter" || u === "milliliters") return { value: v, unit: "mL" };
  if (/^(tab|tabs|tablet|tablets|cap|caps|capsule|capsules)$/.test(u)) {
    const strengths = [...drugName.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg)\b/gi)];
    if (strengths.length === 1 && !/\//.test(drugName)) {
      const sv = parseFloat(strengths[0][1]);
      return { value: round(sv * v, 4), unit: strengths[0][2].toLowerCase() === "mcg" ? "mcg" : "mg" };
    }
    return { value: v, unit: "tablet" };
  }
  return undefined;
}
function round(x: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(x * f) / f;
}

function parseFrequency(sig: unknown): MedicationRow["frequency"] | undefined {
  if (typeof sig !== "string") return undefined;
  const s = " " + sig.toLowerCase() + " ";
  if (/\bprn\b|as needed|as-needed/.test(s)) return "PRN";
  if (/\b(bid|b\.i\.d\.?|twice (a |per )?day|twice daily|2 times (a |per )?day|2 times daily|q12h|q 12 ?h|every 12 hours)\b/.test(s)) return "BID";
  if (/\b(tid|t\.i\.d\.?|three times (a |per )?day|three times daily|3 times (a |per )?day|3 times daily|q8h|q 8 ?h|every 8 hours)\b/.test(s)) return "TID";
  if (/\b(qhs|q\.h\.s\.?|at bedtime|nightly|every night|at night|hs)\b/.test(s)) return "QHS";
  if (/\b(qid|q\.i\.d\.?|four times|4 times|q\d+h|q \d+ ?h|every \d+ (hours|days|weeks|months)|every other|qod|monthly|every month|three times (a |per )?week|twice (a |per )?week|\d+ times (a |per )?week)\b/.test(s)) return "other";
  if (/\b(weekly|once (a |per )?week|every week|qweek|qwk|q week)\b/.test(s)) return "QW";
  if (/\b(daily|once a day|once per day|qd|q\.d\.?|every day|every morning|each morning|in the morning|qam|q am|q24h|every 24 hours|once daily|with breakfast|every evening|qpm|q pm|in the evening)\b/.test(s)) return "QD";
  return undefined;
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] | undefined {
  if (!text) return undefined;
  const t = text.toLowerCase();
  if (/(adverse|side effect|reaction|intoleran|allerg|cough|angioedema|rash|hives|ketoacidosis|\bdka\b|lactic acidosis|hyperkal|kidney injury|\baki\b|toxicity|bleed|hypoglyc|caused|associated)/.test(t)) return "adverse_reaction";
  if (/(ineffective|not effective|inadequate|not working|no benefit|failed|insufficient)/.test(t)) return "ineffective";
  if (/(switch|replaced|changed to|instead|in place of|transition|substitut)/.test(t)) return "therapy_changed";
  if (/(course complete|completed|finished|end of course)/.test(t)) return "course_complete";
  if (/(patient (declined|prefer|request|chose|wish|refus)|patient's (choice|preference|request))/.test(t)) return "patient_choice";
  return "other";
}

interface MedLine {
  doc: Doc;
  key: string;
  e: Record<string, any>;
  status: MedStatus;
}

function medMatchKey(e: Record<string, any>): string {
  const rx = str(e.rxnorm_ingredient);
  const dose = (str(e.dose_text) ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  const id = rx ? "rx:" + rx : "nm:" + (ingredientFromName(str(e.drug_name) ?? "") ?? (str(e.drug_name) ?? "").toLowerCase());
  return id + "|" + dose;
}
function medIngredientKey(e: Record<string, any>): string {
  const rx = str(e.rxnorm_ingredient);
  if (rx) return "rx:" + rx;
  const ing = ingredientFromName(str(e.drug_name) ?? "");
  return "nm:" + (ing ?? (str(e.drug_name) ?? "").toLowerCase());
}

function buildMedications(docs: Doc[]): MedicationRow[] {
  const snaps = docs.filter((d) => entriesOf(d, "home_med").length > 0);
  if (snaps.length === 0) return [];
  const latest = snaps[snaps.length - 1];
  const linesOf = (d: Doc): MedLine[] =>
    entriesOf(d, "home_med")
      .map(([k, e]) => ({ doc: d, key: k, e, status: mapMedStatus(e.status) as MedStatus }))
      .filter((l) => l.status !== undefined && str(l.e.drug_name) !== undefined);

  // One line per ingredient in the latest snapshot.
  const rank: Record<MedStatus, number> = { active: 4, held: 3, unknown: 2, stopped: 1 };
  const byIng = new Map<string, MedLine>();
  for (const l of linesOf(latest)) {
    const k = medIngredientKey(l.e);
    const prev = byIng.get(k);
    if (!prev || rank[l.status] > rank[prev.status]) byIng.set(k, l);
  }

  const rows: MedicationRow[] = [];
  const latestIdx = snaps.indexOf(latest);
  for (const line of byIng.values()) {
    const e = line.e;
    const drugName = str(e.drug_name)!;
    const mk = medMatchKey(e);
    // Walk back through earlier snapshots for the same line (same ingredient and dose).
    const chain: MedLine[] = [line];
    let before: MedLine | undefined;
    for (let i = latestIdx - 1; i >= 0; i--) {
      const m = linesOf(snaps[i]).find((l) => medMatchKey(l.e) === mk);
      if (!m) break;
      if (m.status !== line.status) { before = m; break; }
      chain.push(m);
    }
    let since: string | undefined;
    let sinceLine: MedLine | undefined;
    if (line.status === "held" || line.status === "stopped") {
      sinceLine = chain[chain.length - 1];
      since = sinceLine.doc.date;
    } else if (line.status === "active") {
      for (let i = chain.length - 1; i >= 0; i--) {
        if (chain[i].e.status === "new" || chain[i].e.status === "changed") { sinceLine = chain[i]; break; }
      }
      if (!sinceLine && before && (before.status === "held" || before.status === "stopped")) sinceLine = chain[chain.length - 1];
      since = sinceLine?.doc.date;
    }
    const ingredient = ingredientFromName(drugName);
    const row: MedicationRow = {
      drug_name: drugName,
      status: line.status,
      patient_reported: false,
      evidence: [],
    };
    if (ingredient) row.ingredient = ingredient;
    const rx = str(e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;
    if (since) row.status_since = since;
    const dose = parseDose(e.dose_text, drugName);
    if (dose) row.dose = dose;
    const freq = parseFrequency(e.sig);
    if (freq) row.frequency = freq;
    const instr = str(e.instructions);
    if ((line.status === "held" || line.status === "stopped") && instr) row.status_reason_text = instr;
    if (line.status === "stopped") {
      const r = stopReason(instr);
      if (r) row.stop_reason = r;
    }
    const sens = sensitivityForDrug(ingredient);
    if (sens) row.sensitivity = sens;
    const ev: Evidence = [{ item_id: line.doc.item.id, entry_id: line.key }];
    if (sinceLine && sinceLine !== line) ev.push({ item_id: sinceLine.doc.item.id, entry_id: sinceLine.key });
    row.evidence = uniqEvidence(ev);
    rows.push(row);
  }
  return rows;
}

// ───────────────────────────── problems ─────────────────────────────

interface ProbEntry {
  doc: Doc;
  key: string;
  e: Record<string, any>;
  kind: "diagnosis" | "history";
  text: string;
  icd?: string;
  rrh?: string;
  /** 'active' | 'resolved' | 'working' | 'ruled_out' */
  status: string;
}

function normLabel(s: string): string {
  let t = s.toLowerCase();
  t = t.replace(/\bmellitus\b/g, "").replace(/\bt2dm\b|\bdm2\b|\bdm ii\b|\btype ii diabetes\b|\bdiabetes,? type 2\b/g, "type 2 diabetes");
  t = t.replace(/\bt1dm\b|\bdm1\b|\btype i diabetes\b|\bdiabetes,? type 1\b/g, "type 1 diabetes");
  t = t.replace(/\bhtn\b/g, "hypertension").replace(/\bessential hypertension\b/g, "hypertension");
  t = t.replace(/\bhld\b/g, "hyperlipidemia").replace(/\baki\b/g, "acute kidney injury");
  t = t.replace(/[^a-z0-9]+/g, " ").trim();
  return t;
}
function isCkd(text: string, icd?: string): boolean {
  if (icd && /^N18/i.test(icd)) return true;
  return /\bckd\b|chronic kidney disease|chronic renal (disease|insufficiency|failure)/i.test(text);
}
function ckdStage(text: string, icd?: string): ProblemRow["ckd_stage"] | undefined {
  const t = text.toLowerCase();
  let m = /\bg\s?(1|2|3a|3b|4|5)\b/i.exec(t);
  if (m) return ("G" + m[1].toLowerCase()) as ProblemRow["ckd_stage"];
  m = /(?:stage|ckd|chronic kidney disease)\s*(?:stage\s*)?(1|2|3a|3b|4|5|iiia|iiib|iv|v|ii|i)\b/i.exec(t);
  if (m) {
    const map: Record<string, ProblemRow["ckd_stage"]> = {
      "1": "G1", i: "G1", "2": "G2", ii: "G2", "3a": "G3a", iiia: "G3a", "3b": "G3b", iiib: "G3b", "4": "G4", iv: "G4", "5": "G5", v: "G5",
    };
    const v = map[m[1].toLowerCase()];
    if (v) return v;
  }
  const c = (icd ?? "").toUpperCase();
  const icdMap: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5" };
  return icdMap[c];
}
function albuminuria(text: string): ProblemRow["albuminuria"] | undefined {
  const m = /\bA([123])\b/.exec(text);
  return m ? (("A" + m[1]) as ProblemRow["albuminuria"]) : undefined;
}
function parseOnset(text: unknown): ProblemRow["onset"] | undefined {
  if (typeof text !== "string") return undefined;
  const s = text.trim();
  let m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(s);
  if (m) {
    const v = m[3] ? `${m[1]}-${m[2]}-${m[3]}` : m[2] ? `${m[1]}-${m[2]}` : m[1];
    return { value: v, precision: precisionOf(v) };
  }
  m = /^(\d{1,2})\/(\d{4})$/.exec(s);
  if (m && +m[1] >= 1 && +m[1] <= 12) {
    const v = `${m[2]}-${m[1].padStart(2, "0")}`;
    return { value: v, precision: "month" };
  }
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (m && +m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31) {
    const v = `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
    return { value: v, precision: "day" };
  }
  m = /^(?:in |since )?(\d{4})$/i.exec(s);
  if (m) return { value: m[1], precision: "year" };
  return undefined;
}
function historyStatus(text: string): "active" | "resolved" {
  return /\b(history of|h\/o|s\/p|status post|resolved|remote|remission|in the past|prior|previous|past)\b/i.test(text) ? "resolved" : "active";
}

interface DrugAttribution {
  /** Specific drug or class phrase. */
  phrase?: string;
  /** Class definition if the phrase is a class. */
  cls?: { members: RegExp; name: string };
  /** The label names only an adverse effect, no condition. */
  effectOnly: boolean;
}

function isAdverseTCode(icd?: string): boolean {
  if (!icd) return false;
  const c = icd.toUpperCase().replace(".", "");
  if (!/^T(3[6-9]|4\d|50)/.test(c)) return false;
  return c.length >= 6 && c[5] === "5";
}

function findClass(phrase: string): { members: RegExp; name: string } | undefined {
  for (const c of CLASSES) if (c.re.test(phrase)) return c;
  return undefined;
}

function drugAttribution(text: string, icd?: string): DrugAttribution | undefined {
  const tcode = isAdverseTCode(icd);
  const effectOnly = /^\s*(adverse (drug )?(effect|reaction)|side effect|drug (reaction|intolerance))\b/i.test(text) && !/\b(with|causing|resulting in)\b/i.test(text);
  // "<drug>-associated / -induced / -related"
  const segs = text.split(/[,;()]/);
  for (const seg of segs) {
    const m = /([A-Za-z0-9][A-Za-z0-9\- ]*?)[- ](associated|induced|related|caused)\b/i.exec(seg);
    if (m) {
      const phrase = m[1].trim();
      const words = phrase.split(/\s+/);
      const cls = findClass(phrase);
      if (cls) return { phrase, cls, effectOnly };
      const last = words[words.length - 1];
      if (isDrugWord(last)) return { phrase: BRANDS[last.toLowerCase()] ?? last.toLowerCase(), effectOnly };
      if (/^drug$/i.test(last) && tcode) break;
    }
  }
  // "due to / secondary to / from / of <drug>"
  const m2 = /\b(?:due to|secondary to|from|caused by|after|of|with)\s+(?:the\s+)?([A-Za-z0-9\-]+(?:\s+[A-Za-z0-9\-]+){0,2})/gi;
  let mm: RegExpExecArray | null;
  while ((mm = m2.exec(text))) {
    const phrase = mm[1].trim();
    const first = phrase.split(/\s+/)[0];
    if (isDrugWord(first)) return { phrase: BRANDS[first.toLowerCase()] ?? first.toLowerCase(), effectOnly };
    const cls = findClass(phrase);
    if (cls && (tcode || /\b(inhibitor|blocker|agonist|statin|nsaid|ace|arb|diuretic|thiazide|insulin|penicillin|opioid|sulfonylurea|sglt)/i.test(phrase))) return { phrase, cls, effectOnly };
  }
  if (tcode) {
    const c = icd!.toUpperCase().replace(".", "");
    for (const [re, name] of TCODE_CLASSES) {
      if (re.test(c)) return { phrase: name, cls: findClass(name), effectOnly: effectOnly || effectOnlyFromTcodeLabel(text) };
    }
    return { effectOnly: effectOnly || effectOnlyFromTcodeLabel(text) };
  }
  return undefined;
}
function effectOnlyFromTcodeLabel(text: string): boolean {
  return /^\s*(adverse|side effect|drug (reaction|intolerance))/i.test(text) || /^\s*adverse effect of\b/i.test(text);
}

function reactionTypeFromText(text: string): AllergyIntoleranceRow["reaction_type"] | undefined {
  const t = text.toLowerCase();
  if (/(anaphyla|angioedema|urticaria|hives|rash|swelling|bronchospasm|wheez|itch|prurit|stevens|sjs|\bten\b|toxic epidermal|dress|exanthem|blister|throat closing|lip swelling|hypersensitivity|allergic)/.test(t)) return "hypersensitivity";
  if (/(ketoacidosis|\bdka\b|lactic acidosis|hyperkal|kidney injury|\baki\b|renal failure|pancreatitis|rhabdo|agranulocyt|neutropenia|hepatotox|liver injury|hepatitis|bleed|hemorrhag|hypoglycemi|qt prolong|arrhythm|seizure|torsade|thrombocytopenia|serotonin syndrome|neuroleptic malignant|hyponatremia|tendon rupture|c\.? ?diff|colitis)/.test(t)) return "serious_adverse_event";
  if (/(cough|nausea|vomit|gi upset|upset stomach|stomach|diarrh|constipat|myalgia|muscle (ache|pain)|headache|dizz|lighthead|fatigue|drows|insomnia|edema|ankle swelling|flushing|dyspepsia|heartburn|bloat|gas|taste|dry mouth|palpitation|tremor|yeast|genital|urinary|frequent urination|hair loss|weight gain|cramp)/.test(t)) return "side_effect";
  return undefined;
}

const ACE_RE = /pril$/;

function buildProblems(docs: Doc[]): { problems: ProblemRow[]; derivedAllergies: AllergyIntoleranceRow[] } {
  const entries: ProbEntry[] = [];
  for (const d of docs) {
    for (const [k, e] of entriesOf(d, "diagnosis")) {
      const text = str(e.label) ?? str(e.riverside_dx?.name);
      if (!text) continue;
      entries.push({
        doc: d, key: k, e, kind: "diagnosis", text,
        icd: str(e.icd10cm)?.trim(), rrh: isObj(e.riverside_dx) ? str(e.riverside_dx.code) : undefined,
        status: str(e.status) ?? "",
      });
    }
    for (const [k, e] of entriesOf(d, "history")) {
      const text = str(e.condition);
      if (!text) continue;
      entries.push({ doc: d, key: k, e, kind: "history", text, icd: str(e.icd10cm)?.trim(), status: historyStatus(text) });
    }
  }

  // Group entries into conditions.
  const groupOf = new Map<ProbEntry, string>();
  const rrhIcds = new Map<string, Set<string>>(); // icd -> rrh codes
  for (const p of entries) {
    if (p.rrh) {
      groupOf.set(p, "rrh:" + p.rrh);
      if (p.icd) {
        if (!rrhIcds.has(p.icd)) rrhIcds.set(p.icd, new Set());
        rrhIcds.get(p.icd)!.add(p.rrh);
      }
    }
  }
  for (const p of entries) {
    if (groupOf.has(p)) continue;
    if (isCkd(p.text, p.icd) && !isAdverseTCode(p.icd)) { groupOf.set(p, "ckd"); continue; }
    if (p.icd) {
      const r = rrhIcds.get(p.icd);
      if (r && r.size === 1) { groupOf.set(p, "rrh:" + [...r][0]); continue; }
      groupOf.set(p, "icd:" + p.icd);
      continue;
    }
  }
  // Label-only entries: join a coded group with the same normalized label, else their own.
  const labelToGroup = new Map<string, string>();
  for (const p of entries) {
    const g = groupOf.get(p);
    if (g) {
      const n = normLabel(p.text);
      if (!labelToGroup.has(n)) labelToGroup.set(n, g);
    }
  }
  for (const p of entries) {
    if (groupOf.has(p)) continue;
    const n = normLabel(p.text);
    groupOf.set(p, labelToGroup.get(n) ?? "label:" + n);
  }

  const groups = new Map<string, ProbEntry[]>();
  for (const p of entries) {
    const g = groupOf.get(p)!;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(p);
  }

  const problems: ProblemRow[] = [];
  const derived: AllergyIntoleranceRow[] = [];
  for (const list of groups.values()) {
    list.sort((a, b) => a.doc.order - b.doc.order);
    const latest = list[list.length - 1];
    let status: "active" | "resolved" | undefined;
    let basis: ProbEntry | undefined;
    if (latest.status === "active" || latest.status === "resolved") { status = latest.status; basis = latest; }
    else if (latest.status === "working") {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].status === "active" || list[i].status === "resolved") { status = list[i].status as "active" | "resolved"; basis = list[i]; break; }
        if (list[i].status === "ruled_out") break;
      }
    }
    if (!status || !basis) continue;
    const confirmed = list.filter((p) => p.status === "active" || p.status === "resolved");

    // Drug attribution: from the most recent confirmed entry that names a drug.
    let attr: DrugAttribution | undefined;
    let attrEntry: ProbEntry | undefined;
    for (let i = confirmed.length - 1; i >= 0 && !attr; i--) {
      const p = confirmed[i];
      const texts = [p.text, str(p.e.riverside_dx?.name)].filter((x): x is string => !!x);
      for (const t of texts) {
        const a = drugAttribution(t, p.icd);
        if (a && (a.phrase || a.cls)) { attr = a; attrEntry = p; break; }
        if (a && !attr && isAdverseTCode(p.icd)) { attr = a; attrEntry = p; }
      }
    }

    const evidence = uniqEvidence(
      [basis, ...list.filter((p) => p !== basis).reverse()].map((p) => ({ item_id: p.doc.item.id, entry_id: p.key })),
    );

    if (attr && attrEntry) {
      const row = derivedAllergy(attr, attrEntry, confirmed, evidence);
      if (row) derived.push(row);
    }
    const effectOnly = !!attr && attr.effectOnly && isAdverseTCode(attrEntry?.icd);
    if (effectOnly) continue;

    // Latest coded entry for codes.
    let icd: string | undefined;
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      if (p.status === "ruled_out" || p.status === "working") continue;
      if (p.icd && !isAdverseTCode(p.icd)) { icd = p.icd; break; }
    }
    const row: ProblemRow = { condition: basis.text, status, evidence };
    if (icd) row.icd10cm = icd;
    // Onset from history lines (latest that states one).
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].kind !== "history") continue;
      const o = parseOnset(list[i].e.onset_text);
      if (o) { row.onset = o; break; }
    }
    if (list.some((p) => isCkd(p.text, p.icd))) {
      for (let i = confirmed.length - 1; i >= 0; i--) {
        const st = ckdStage(confirmed[i].text, confirmed[i].icd);
        if (st) { row.ckd_stage = st; break; }
      }
      for (let i = confirmed.length - 1; i >= 0; i--) {
        const a = albuminuria(confirmed[i].text);
        if (a) { row.albuminuria = a; break; }
      }
    }
    const sens = sensitivityForCode(icd, basis.text);
    if (sens) row.sensitivity = sens;
    problems.push(row);
  }
  return { problems, derivedAllergies: derived };
}

function derivedAllergy(attr: DrugAttribution, p: ProbEntry, confirmed: ProbEntry[], evidence: Evidence): AllergyIntoleranceRow | undefined {
  let substance: string | undefined;
  let rx: string | undefined;
  const medEv: Evidence = [];
  if (attr.cls) {
    // Exactly one drug of that class on the item's medication list.
    const meds = entriesOf(p.doc, "home_med").filter(([, e]) => {
      const ing = ingredientFromName(str(e.drug_name) ?? "");
      return !!ing && ing.split(" / ").some((x) => attr.cls!.members.test(x));
    });
    const byIng = new Map<string, [string, Record<string, any>]>();
    for (const m of meds) byIng.set(ingredientFromName(str(m[1].drug_name) ?? "")!, m);
    if (byIng.size === 1) {
      const [ing, [k, e]] = [...byIng.entries()][0];
      substance = ing;
      rx = str(e.rxnorm_ingredient);
      medEv.push({ item_id: p.doc.item.id, entry_id: k });
    } else {
      substance = attr.phrase ?? attr.cls.name;
    }
  } else if (attr.phrase) {
    substance = attr.phrase.toLowerCase();
    for (const [k, e] of entriesOf(p.doc, "home_med")) {
      if (ingredientFromName(str(e.drug_name) ?? "") === substance) {
        rx = str(e.rxnorm_ingredient);
        medEv.push({ item_id: p.doc.item.id, entry_id: k });
        break;
      }
    }
  }
  if (!substance) return undefined;
  const text = p.text;
  const recognized = reactionTypeFromText(text);
  // A coded diagnosis that names no recognizable reaction ("Adverse effect of ACE inhibitor"): the drug is
  // to be avoided, but what happened is not recorded.
  const reaction_type = recognized ?? (attr.effectOnly ? "side_effect" : "serious_adverse_event");
  let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
  const isAce = ACE_RE.test(substance) || /ace inhibitor/i.test(substance);
  if (isAce && /(angioedema|cough)/i.test(text)) mechanism = "non_immune";
  else if (recognized === "serious_adverse_event" || recognized === "side_effect") mechanism = "non_immune";
  else if (!recognized && !attr.effectOnly) mechanism = "non_immune";
  const criticality: AllergyIntoleranceRow["criticality"] = !recognized && attr.effectOnly
    ? "unknown"
    : reaction_type === "side_effect" ? "low" : "high";
  const row: AllergyIntoleranceRow = {
    substance,
    reaction_type,
    mechanism,
    reaction: text,
    criticality,
    evidence: uniqEvidence([{ item_id: p.doc.item.id, entry_id: p.key }, ...medEv, ...evidence]),
  };
  if (rx) row.rxnorm_ingredient = rx;
  // Onset: start of the earliest stay in which the condition was established.
  const first = confirmed[0];
  const onsetDate =
    localDate(first.doc.enc?.arrived) ?? localDate(first.doc.enc?.admitted) ?? localDate(first.doc.item.effective);
  if (onsetDate) row.onset = { value: onsetDate, precision: precisionOf(onsetDate) };
  return row;
}

// ───────────────────────────── allergies ─────────────────────────────

function buildAllergies(docs: Doc[], derived: AllergyIntoleranceRow[]): AllergyIntoleranceRow[] {
  const snaps = docs.filter((d) => entriesOf(d, "allergy").length > 0);
  // Allergy list snapshot: latest signed document.
  snaps.sort((a, b) => (a.recordedMs || 0) - (b.recordedMs || 0) || a.order - b.order);
  const rows: AllergyIntoleranceRow[] = [];
  const latest = snaps[snaps.length - 1];
  if (latest) {
    for (const [k, e] of entriesOf(latest, "allergy")) {
      const sub = str(e.substance);
      if (!sub) continue;
      if (/^\s*(nkda|nka|no known (drug )?allergies)\s*$/i.test(sub)) continue;
      const rx = str(e.rxnorm_ingredient);
      const substance = rx ? ingredientFromName(sub) ?? sub.toLowerCase() : sub;
      const reaction = str(e.reaction);
      const sev = str(e.severity);
      let reaction_type = reaction ? reactionTypeFromText(reaction) : undefined;
      if (!reaction_type) reaction_type = sev === "mild" && reaction ? "side_effect" : "hypersensitivity";
      if (reaction_type === "serious_adverse_event" && sev === "mild") reaction_type = "side_effect";
      let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
      const isAce = ACE_RE.test(substance.toLowerCase()) || /ace inhibitor/i.test(substance);
      if (isAce && reaction && /(cough|angioedema)/i.test(reaction)) mechanism = "non_immune";
      else if (reaction_type === "side_effect") mechanism = "non_immune";
      else if (reaction_type === "serious_adverse_event" && reaction && /(ketoacidosis|lactic acidosis|hyperkal|kidney injury)/i.test(reaction)) mechanism = "non_immune";
      else if (reaction && /\b(ige|immune-mediated|immunologic|positive (skin|patch) test)\b/i.test(reaction)) mechanism = "immune";
      const criticality: AllergyIntoleranceRow["criticality"] =
        sev === "mild" ? "low" : sev === "severe" ? "high" : "unknown";
      const row: AllergyIntoleranceRow = {
        substance,
        reaction_type,
        mechanism,
        criticality,
        evidence: [{ item_id: latest.item.id, entry_id: k }],
      };
      if (rx) row.rxnorm_ingredient = rx;
      if (reaction) row.reaction = reaction;
      const sens = sensitivityForDrug(substance.toLowerCase());
      if (sens) row.sensitivity = sens;
      rows.push(row);
    }
  }
  for (const d of derived) {
    const same = rows.find(
      (r) =>
        (r.rxnorm_ingredient && d.rxnorm_ingredient && r.rxnorm_ingredient === d.rxnorm_ingredient) ||
        r.substance.toLowerCase() === d.substance.toLowerCase(),
    );
    if (same) {
      // One row per substance: keep the more serious account, combine reactions and evidence.
      const reactions = [same.reaction, d.reaction].filter((x): x is string => !!x);
      const uniq = [...new Set(reactions)];
      if (uniq.length) same.reaction = uniq.join("; ");
      const sev: Record<string, number> = { side_effect: 1, hypersensitivity: 2, serious_adverse_event: 3 };
      if (reactionTypeFromText(d.reaction ?? "") && sev[d.reaction_type] > sev[same.reaction_type]) {
        same.reaction_type = d.reaction_type;
        same.mechanism = d.mechanism;
      }
      if (d.criticality === "high") same.criticality = "high";
      if (!same.onset && d.onset) same.onset = d.onset;
      if (!same.rxnorm_ingredient && d.rxnorm_ingredient) same.rxnorm_ingredient = d.rxnorm_ingredient;
      same.evidence = uniqEvidence([...same.evidence, ...d.evidence]);
    } else {
      rows.push(d);
    }
  }
  return rows;
}

// ───────────────────────────── labs ─────────────────────────────

interface AnalyteDef {
  analyte: Analyte;
  unit: string;
  loinc: string[];
  local: string[];
  name?: RegExp;
  /** source unit (lowercased, spaces removed) -> factor to target unit */
  units: Record<string, number>;
}

const CONC_SAME = { "mmol/l": 1, "meq/l": 1 };
const K_UL = { "10*3/ul": 1, "10^3/ul": 1, "x10^3/ul": 1, "x10e3/ul": 1, "k/ul": 1, "10*9/l": 1, "10^9/l": 1, "x10^9/l": 1, "thou/ul": 1, "/ul": 0.001, "cells/ul": 0.001, "/mm3": 0.001, "10*3/mm3": 1 };
const ANALYTES: AnalyteDef[] = [
  { analyte: "creatinine", unit: "mg/dL", loinc: ["2160-0", "38483-4"], local: ["CREAT", "CR", "CREA"], name: /^creatinine(,? serum| \(serum\))?$/i, units: { "mg/dl": 1, "umol/l": 1 / 88.42, "µmol/l": 1 / 88.42 } },
  { analyte: "egfr", unit: "mL/min/1.73m2", loinc: ["98979-8", "62238-1", "33914-3", "48642-3", "48643-1", "88293-6", "88294-4", "50044-7", "50210-4", "77147-7", "69405-9"], local: ["EGFR", "GFR", "EGFR2021", "EGFRNAA", "EGFRAA"], name: /\begfr\b|glomerular filtration/i, units: { "ml/min/1.73m2": 1, "ml/min/{1.73_m2}": 1, "ml/min/1.73m^2": 1, "ml/min/1.73_m2": 1, "ml/min": 1 } },
  { analyte: "potassium", unit: "mmol/L", loinc: ["2823-3", "6298-4", "32713-0", "39789-3"], local: ["K", "POT"], name: /^potassium\b/i, units: CONC_SAME },
  { analyte: "sodium", unit: "mmol/L", loinc: ["2951-2", "2947-0", "32717-1", "39791-9"], local: ["NA", "SOD"], name: /^sodium\b/i, units: CONC_SAME },
  { analyte: "chloride", unit: "mmol/L", loinc: ["2075-0", "2069-3"], local: ["CL"], name: /^chloride\b/i, units: CONC_SAME },
  { analyte: "bicarbonate", unit: "mmol/L", loinc: ["2028-9", "1963-8", "20565-8"], local: ["CO2", "HCO3", "TCO2"], name: /^(bicarbonate|total co2|co2|carbon dioxide)\b/i, units: CONC_SAME },
  { analyte: "anion_gap", unit: "mmol/L", loinc: ["33037-3", "1863-0", "10466-1", "41276-7"], local: ["AGAP", "AG", "ANGAP"], name: /^anion gap/i, units: CONC_SAME },
  { analyte: "bun", unit: "mg/dL", loinc: ["3094-0", "6299-2", "14937-7"], local: ["BUN", "UREAN"], name: /^(urea nitrogen|bun|blood urea nitrogen)\b/i, units: { "mg/dl": 1 } },
  { analyte: "glucose", unit: "mg/dL", loinc: ["2345-7", "1558-6", "2339-0", "41604-0", "14749-6", "15074-8"], local: ["GLU", "GLUC", "GLUCOSE"], name: /^glucose\b/i, units: { "mg/dl": 1, "mmol/l": 18.016 } },
  { analyte: "a1c", unit: "%", loinc: ["4548-4", "17856-6", "4549-2", "59261-8"], local: ["A1C", "HBA1C", "HGBA1C"], name: /a1c|glycated hemoglobin|glycohemoglobin/i, units: { "%": 1, "%{hb}": 1, "%hb": 1 } },
  { analyte: "uacr", unit: "mg/g", loinc: ["9318-7", "14959-1", "32294-1", "14958-3"], local: ["UACR", "MALBCR", "ACR", "ALBCR"], name: /albumin\s*\/\s*creatinine|albumin-creatinine|microalbumin\s*\/\s*creatinine/i, units: { "mg/g": 1, "mg/g{creat}": 1, "mg/gcreat": 1, "ug/mg": 1, "mcg/mg": 1, "mg/mmol": 8.84, "mg/mmol{creat}": 8.84 } },
  { analyte: "platelets", unit: "10*3/uL", loinc: ["777-3", "26515-7", "49497-1"], local: ["PLT", "PLATELET"], name: /^platelet/i, units: K_UL },
  { analyte: "wbc", unit: "10*3/uL", loinc: ["6690-2", "26464-8", "804-5"], local: ["WBC"], name: /^(wbc|white blood cell|leukocyte)/i, units: K_UL },
  { analyte: "hemoglobin", unit: "g/dL", loinc: ["718-7", "20509-6", "30313-1", "30350-3", "30352-9", "55782-7"], local: ["HGB", "HB"], name: /^(hemoglobin|hgb)$/i, units: { "g/dl": 1, "g/l": 0.1, "mmol/l": 1.611 } },
  { analyte: "bhb", unit: "mmol/L", loinc: ["53060-9", "33903-6", "47906-3"], local: ["BHB", "BOHB", "BHBA"], name: /hydroxybutyr/i, units: { "mmol/l": 1, "mg/dl": 1 / 10.41 } },
  { analyte: "ph", unit: "[pH]", loinc: ["2746-6", "2744-1", "11558-4", "33254-4", "19213-8", "2745-8"], local: ["VPH", "APH", "PH", "BGPH"], name: /^ph\b/i, units: { "": 1, "[ph]": 1, "ph": 1 } },
  { analyte: "pco2", unit: "mmHg", loinc: ["2021-4", "2019-8", "11557-6", "2020-6", "32771-8"], local: ["VPCO2", "APCO2", "PCO2"], name: /^pco2\b/i, units: { "mmhg": 1, "mm[hg]": 1, "kpa": 7.50062 } },
  { analyte: "lipase", unit: "U/L", loinc: ["3040-3", "1989-3"], local: ["LIPASE", "LIP"], name: /^lipase\b/i, units: { "u/l": 1, "iu/l": 1 } },
  { analyte: "troponin", unit: "ng/mL", loinc: ["10839-9", "42757-5", "49563-0", "89579-7", "76399-5", "16255-2"], local: ["TROPI", "TNI", "TROP", "TROPONINI", "HSTNI", "HSTROPI"], name: /troponin i\b/i, units: { "ng/ml": 1, "ug/l": 1, "µg/l": 1, "ng/l": 0.001, "pg/ml": 0.001 } },
  { analyte: "cholesterol", unit: "mg/dL", loinc: ["2093-3", "14647-2"], local: ["CHOL", "TCHOL"], name: /^(total )?cholesterol(,? total)?$/i, units: { "mg/dl": 1, "mmol/l": 38.67 } },
  { analyte: "triglycerides", unit: "mg/dL", loinc: ["2571-8", "14927-8", "3043-7"], local: ["TRIG", "TG"], name: /^triglyceride/i, units: { "mg/dl": 1, "mmol/l": 88.57 } },
  { analyte: "hdl", unit: "mg/dL", loinc: ["2085-9", "14646-4"], local: ["HDL"], name: /^hdl\b|hdl cholesterol/i, units: { "mg/dl": 1, "mmol/l": 38.67 } },
  { analyte: "ldl", unit: "mg/dL", loinc: ["13457-7", "18262-6", "2089-1", "69419-0", "22748-8", "39469-2", "96259-7"], local: ["LDL", "LDLC", "LDLCALC", "LDLDIRECT"], name: /^ldl\b|ldl cholesterol/i, units: { "mg/dl": 1, "mmol/l": 38.67 } },
];

const EXCLUDED_LOINC = new Set(["2161-8", "14682-9", "2350-7", "5792-7", "2756-5", "5803-2", "6598-7", "67151-1", "48425-3", "41653-7", "32016-8", "2514-8", "1959-6", "14627-4"]);

function analyteFor(test: Record<string, any>, specimen: string): AnalyteDef | undefined {
  const loinc = str(test.loinc);
  const local = (str(test.local_code) ?? "").toUpperCase();
  const name = str(test.name) ?? "";
  if (loinc && EXCLUDED_LOINC.has(loinc)) return undefined;
  const spec = specimen.toLowerCase();
  const urine = /urine/.test(spec) || /\burine\b/i.test(name);
  const poc = /capillary|fingerstick|finger stick|meter|point[- ]of[- ]care|\bpoc\b/i.test(spec + " " + name + " " + local);
  let def: AnalyteDef | undefined;
  if (loinc) def = ANALYTES.find((a) => a.loinc.includes(loinc));
  if (!def && local) def = ANALYTES.find((a) => a.local.includes(local));
  if (!def && name) def = ANALYTES.find((a) => a.name && a.name.test(name.trim()));
  if (!def) return undefined;
  if (def.analyte === "uacr") return def;
  if (urine) return undefined;
  if (def.analyte === "glucose" && poc) return undefined;
  if (def.analyte === "troponin" && /troponin t\b/i.test(name)) return undefined;
  return def;
}

function egfrEquation(test: Record<string, any>, collected: string): LabResultRow["egfr_equation"] {
  const name = (str(test.name) ?? "").toLowerCase();
  if (/2021|race[- ]free|race[- ]neutral/.test(name)) return "ckd-epi-2021";
  const raceSpecific = /\b(african|black)\b/.test(name);
  if (/mdrd/.test(name)) return "mdrd";
  if (/ckd[- ]?epi/.test(name) && /2009/.test(name)) return "ckd-epi-2009";
  const loinc = str(test.loinc);
  if (loinc === "98979-8") return "ckd-epi-2021";
  if (loinc === "62238-1" || loinc === "88293-6" || loinc === "88294-4" || loinc === "50210-4") return "ckd-epi-2009";
  if (loinc === "33914-3" || loinc === "48642-3" || loinc === "48643-1" || loinc === "50044-7" || loinc === "69405-9") return "mdrd";
  if (/ckd[- ]?epi/.test(name)) return raceSpecific ? "ckd-epi-2009" : "unknown";
  if (raceSpecific) return "unknown";
  // Riverside: CKD-EPI 2021 for all results since 2023.
  const y = localDate(collected)?.slice(0, 4);
  if (y && y >= "2023") return "ckd-epi-2021";
  return "unknown";
}
function isRaceVariant(test: Record<string, any>): boolean {
  const name = (str(test.name) ?? "").toLowerCase();
  const loinc = str(test.loinc);
  if (loinc === "48643-1" || loinc === "88293-6") return true;
  if (/\bnon[- ]?(african|black|aa)\b/.test(name)) return false;
  return /\b(african[- ]american|black|\baa\b)/.test(name);
}

function parseValue(v: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  if (typeof v === "number" && isFinite(v)) return { value: v };
  if (typeof v !== "string") return undefined;
  const m = /^\s*(<=|>=|≤|≥|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*$/.exec(v.replace(/,(?=\d{3}\b)/g, ""));
  if (!m) return undefined;
  const value = parseFloat(m[2]);
  if (!isFinite(value)) return undefined;
  let comparator: LabResultRow["comparator"] | undefined;
  if (m[1]) comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as LabResultRow["comparator"];
  return comparator ? { value, comparator } : { value };
}

const STATUS_RANK: Record<string, number> = { preliminary: 1, final: 2, corrected: 3 };

interface LabCopy {
  doc: Doc;
  key: string;
  status: string;
  accession: string;
  collected: string;
  specimen: string;
  v: Record<string, any>;
}

function buildLabs(docs: Doc[]): LabResultRow[] {
  const copies = new Map<string, LabCopy[]>();
  const add = (c: LabCopy) => {
    const code = str(c.v.test?.local_code) ?? str(c.v.test?.loinc) ?? str(c.v.test?.name) ?? "";
    const id = c.accession + "\u0000" + code.toUpperCase();
    if (!copies.has(id)) copies.set(id, []);
    copies.get(id)!.push(c);
  };
  for (const d of docs) {
    const p = isObj(d.item.payload) ? d.item.payload : {};
    for (const k of Object.keys(p)) {
      const e = p[k];
      if (!isObj(e)) continue;
      if (e.type === "result" && isObj(e.test)) {
        const acc = str(e.accession), col = str(e.collected);
        if (!acc || !col) continue;
        add({ doc: d, key: k, status: str(e.status) ?? "", accession: acc, collected: col, specimen: str(e.specimen) ?? "", v: e });
      } else if (e.type === "panel" && Array.isArray(e.components)) {
        const acc = str(e.accession), col = str(e.collected);
        if (!acc || !col) continue;
        for (const c of e.components) {
          if (!isObj(c) || !isObj(c.test)) continue;
          add({ doc: d, key: k, status: str(e.status) ?? "", accession: acc, collected: col, specimen: str(e.specimen) ?? "", v: c });
        }
      }
    }
  }
  const rows: LabResultRow[] = [];
  for (const list of copies.values()) {
    const valid = list.filter((c) => STATUS_RANK[c.status] !== undefined);
    if (valid.length === 0) continue;
    valid.sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || a.doc.order - b.doc.order);
    const best = valid[valid.length - 1];
    const test = best.v.test as Record<string, any>;
    const def = analyteFor(test, best.specimen);
    if (!def) continue;
    if (def.analyte === "egfr" && isRaceVariant(test)) continue;
    const pv = parseValue(best.v.value);
    if (!pv) continue;
    const unitRaw = (str(best.v.unit) ?? "").toLowerCase().replace(/\s+/g, "");
    let factor = def.units[unitRaw];
    if (factor === undefined && def.analyte === "a1c" && /mmol\/mol/.test(unitRaw)) {
      // IFCC -> NGSP
      pv.value = round(0.09148 * pv.value + 2.152, 1);
      factor = 1;
    }
    if (factor === undefined) continue;
    const value = factor === 1 ? pv.value : round(pv.value * factor, def.analyte === "ph" ? 3 : 2);
    const row: LabResultRow = {
      analyte: def.analyte,
      value,
      unit: def.unit,
      collected: best.collected,
      status: best.status === "preliminary" ? "preliminary" : "final",
      evidence: uniqEvidence([best, ...valid.filter((c) => c !== best).reverse()].map((c) => ({ item_id: c.doc.item.id, entry_id: c.key }))),
    };
    if (pv.comparator) row.comparator = pv.comparator;
    if (def.analyte === "egfr") row.egfr_equation = egfrEquation(test, best.collected);
    const loinc = str(test.loinc);
    if (loinc) row.loinc = loinc;
    rows.push(row);
  }
  rows.sort((a, b) => instant(a.collected) - instant(b.collected) || (a.analyte < b.analyte ? -1 : a.analyte > b.analyte ? 1 : 0));
  return rows;
}

// ───────────────────────────── vitals ─────────────────────────────

function buildVitals(docs: Doc[]): VitalRow[] {
  interface V { doc: Doc; key: string; e: Record<string, any>; t: number; encId: string }
  const byTaken = new Map<string, V[]>();
  for (const d of docs) {
    for (const [k, e] of entriesOf(d, "vitals")) {
      const taken = str(e.taken);
      if (!taken) continue;
      const t = instant(taken);
      if (isNaN(t)) continue;
      const id = String(t);
      if (!byTaken.has(id)) byTaken.set(id, []);
      byTaken.get(id)!.push({ doc: d, key: k, e, t, encId: d.encId });
    }
  }
  const sets = [...byTaken.values()].sort((a, b) => a[0].t - b[0].t);
  const rows: { row: VitalRow; t: number; encId: string; firstBpT?: number }[] = [];
  for (const copies of sets) {
    copies.sort((a, b) => b.doc.order - a.doc.order); // latest copy first
    const t = copies[0].t;
    const merged: Record<string, any> = {};
    for (const c of copies) {
      for (const f of ["bp", "heart_rate_bpm", "weight_kg"]) if (merged[f] === undefined && c.e[f] !== undefined) merged[f] = c.e[f];
    }
    const sys = num(merged.bp?.systolic_mmhg), dia = num(merged.bp?.diastolic_mmhg);
    const hr = num(merged.heart_rate_bpm), wt = num(merged.weight_kg);
    const hasBp = sys !== undefined && dia !== undefined;
    if (!hasBp && hr === undefined && wt === undefined) continue;
    const lp = localParts(str(copies[0].e.taken)!);
    if (!lp || !lp.time) continue;
    const ev: Evidence = copies.map((c) => ({ item_id: c.doc.item.id, entry_id: c.key }));
    // Same visit, within a few minutes of the previous set: one set (later BP is a repeat).
    const prev = rows[rows.length - 1];
    if (prev && prev.encId === copies[0].encId && t - prev.t <= 10 * 60 * 1000) {
      const r = prev.row;
      if (hasBp) {
        if (r.systolic_mmhg === undefined) {
          r.systolic_mmhg = sys; r.diastolic_mmhg = dia;
          r.local_time = `${lp.date}T${lp.time}`;
        } else if (r.repeat_systolic_mmhg === undefined) {
          r.repeat_systolic_mmhg = sys; r.repeat_diastolic_mmhg = dia;
        }
      }
      if (r.pulse_bpm === undefined && hr !== undefined) r.pulse_bpm = hr;
      if (r.weight_kg === undefined && wt !== undefined) r.weight_kg = round(wt, 1);
      r.evidence = uniqEvidence([...r.evidence, ...ev]);
      continue;
    }
    const row: VitalRow = { setting: "hospital", local_time: `${lp.date}T${lp.time}`, evidence: uniqEvidence(ev) };
    if (hasBp) { row.systolic_mmhg = sys; row.diastolic_mmhg = dia; }
    if (hr !== undefined) row.pulse_bpm = hr;
    if (wt !== undefined) row.weight_kg = round(wt, 1);
    rows.push({ row, t, encId: copies[0].encId });
  }
  return rows.map((r) => r.row);
}

// ───────────────────────────── entry point ─────────────────────────────

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  let docs: Doc[];
  try {
    docs = currentDocs(items, asOf);
  } catch {
    return out;
  }
  const safe = <T>(f: () => T, dflt: T): T => {
    try { return f(); } catch { return dflt; }
  };
  out.medications = safe(() => buildMedications(docs), []);
  const pr = safe(() => buildProblems(docs), { problems: [] as ProblemRow[], derivedAllergies: [] as AllergyIntoleranceRow[] });
  out.problems = pr.problems;
  out.allergies = safe(() => buildAllergies(docs, pr.derivedAllergies), []);
  out.labs = safe(() => buildLabs(docs), []);
  out.vitals = safe(() => buildVitals(docs), []);
  return out;
}
