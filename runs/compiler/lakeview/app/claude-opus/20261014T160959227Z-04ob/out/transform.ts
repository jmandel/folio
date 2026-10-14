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

// Mapper for Lakeview (lakeview-v1): lab reports (LabReportRow) and nephrology clinic notes (ClinicRow).

const TZ = "America/Chicago";

// ---------------------------------------------------------------------------------------------------------
// Small helpers

function isObj(v: unknown): v is Record<string, any> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}
function num(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && /^\s*-?\d+(\.\d+)?\s*$/.test(v)) return Number(v);
  return undefined;
}
function round(v: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

// ---------------------------------------------------------------------------------------------------------
// Time handling (America/Chicago)

let dtf: Intl.DateTimeFormat | undefined;
function chicagoParts(ms: number): { y: string; mo: string; d: string; h: string; mi: string; s: string } {
  if (!dtf) {
    dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
  }
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(new Date(ms))) p[part.type] = part.value;
  const h = p.hour === "24" ? "00" : p.hour;
  return { y: p.year, mo: p.month, d: p.day, h, mi: p.minute, s: p.second };
}
/** Offset of Chicago from UTC in minutes at the given instant. */
function chicagoOffsetMin(ms: number): number {
  const p = chicagoParts(ms);
  const asUtc = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +p.mi, +p.s);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}
function fmtOffset(min: number): string {
  const sign = min < 0 ? "-" : "+";
  const a = Math.abs(min);
  return `${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

const DT_RE = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/i;

interface LocalDT {
  date: string; // YYYY-MM-DD local
  time?: string; // HH:MM local
  sec?: string;
  ms?: number; // instant, when known
  offset?: string; // Chicago offset for the local wall time
}

/** Parse a source date or date-time into Chicago local wall time. */
function toLocal(v: unknown): LocalDT | undefined {
  const s = str(v)?.trim();
  if (!s) return undefined;
  const m = DT_RE.exec(s);
  if (m) {
    const [, y, mo, d, h, mi, se, z] = m;
    if (z) {
      let ms: number;
      if (/^z$/i.test(z)) ms = Date.UTC(+y, +mo - 1, +d, +h, +mi, +(se ?? 0));
      else {
        const sign = z[0] === "-" ? -1 : 1;
        const digits = z.slice(1).replace(":", "");
        const off = sign * (+digits.slice(0, 2) * 60 + +digits.slice(2, 4));
        ms = Date.UTC(+y, +mo - 1, +d, +h, +mi, +(se ?? 0)) - off * 60000;
      }
      if (!Number.isFinite(ms)) return undefined;
      const p = chicagoParts(ms);
      return {
        date: `${p.y}-${p.mo}-${p.d}`,
        time: `${p.h}:${p.mi}`,
        sec: p.s,
        ms,
        offset: fmtOffset(chicagoOffsetMin(ms)),
      };
    }
    // Floating local time: keep wall clock, find Chicago offset in effect.
    const wall = Date.UTC(+y, +mo - 1, +d, +h, +mi, +(se ?? 0));
    if (!Number.isFinite(wall)) return undefined;
    let off = chicagoOffsetMin(wall + 6 * 3600000);
    let inst = wall - off * 60000;
    const off2 = chicagoOffsetMin(inst);
    if (off2 !== off) {
      off = off2;
      inst = wall - off * 60000;
    }
    return { date: `${y}-${mo}-${d}`, time: `${h}:${mi}`, sec: se ?? "00", ms: inst, offset: fmtOffset(off) };
  }
  const dm = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(s);
  if (dm) return { date: s };
  const t = Date.parse(s);
  if (Number.isFinite(t)) return toLocal(new Date(t).toISOString());
  return undefined;
}

/** Sortable local key "YYYY-MM-DDTHH:MM:SS" (dates sort before times of the same day). */
function sortKey(v: unknown): string {
  const l = toLocal(v);
  if (!l) return "";
  return l.time ? `${l.date}T${l.time}:${l.sec ?? "00"}` : l.date;
}

function precisionOf(d: string): "year" | "month" | "day" {
  return d.length === 4 ? "year" : d.length === 7 ? "month" : "day";
}

// ---------------------------------------------------------------------------------------------------------
// Item selection (as-of, supersession, retraction)

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const recorded = items.filter((it) => {
    if (!isObj(it) || !str(it.id) || !isObj(it.payload)) return false;
    const l = toLocal(it.recorded);
    if (!l) return false;
    return l.date.length === 10 && l.date <= asOf;
  });
  const retracted = new Set<string>();
  for (const it of recorded) for (const r of Array.isArray(it.retracts) ? it.retracts : []) if (typeof r === "string") retracted.add(r);
  const superseded = new Set<string>();
  for (const it of recorded) {
    if (retracted.has(it.id)) continue;
    for (const r of Array.isArray(it.supersedes) ? it.supersedes : []) if (typeof r === "string") superseded.add(r);
  }
  return recorded
    .filter((it) => !retracted.has(it.id) && !superseded.has(it.id))
    .sort((a, b) => cmp(sortKey(a.recorded), sortKey(b.recorded)) || cmp(a.id, b.id));
}

function cmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

interface Entry {
  item: FolioItem;
  key: string; // payload entry id
  e: Record<string, any>;
}

function entriesOf(items: FolioItem[]): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    for (const key of Object.keys(item.payload).sort()) {
      const e = item.payload[key];
      if (isObj(e) && typeof e.type === "string") out.push({ item, key, e });
    }
  }
  return out;
}

function refTexts(item: FolioItem): Map<string, string> {
  const m = new Map<string, string>();
  const n = typeof item.narrative === "string" ? item.narrative : "";
  const re = /<ref\s+id="([^"]+)"\s*>([\s\S]*?)<\/ref>/g;
  let r: RegExpExecArray | null;
  while ((r = re.exec(n))) m.set(r[1], (m.get(r[1]) ? m.get(r[1]) + " " : "") + r[2]);
  return m;
}

function ev(en: Entry): { item_id: string; entry_id: string } {
  return { item_id: en.item.id, entry_id: en.key };
}
function dedupEvidence(e: Evidence): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const x of e) {
    const k = `${x.item_id}|${x.entry_id ?? ""}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------
// Sensitivity

const MH_DRUGS =
  /\b(quetiapine|olanzapine|risperidone|aripiprazole|ziprasidone|lurasidone|clozapine|haloperidol|lithium|lamotrigine|valproate|divalproex|sertraline|fluoxetine|paroxetine|citalopram|escitalopram|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|amitriptyline|nortriptyline|imipramine|buspirone|lorazepam|alprazolam|clonazepam|diazepam|methylphenidate|amphetamine|lisdexamfetamine|atomoxetine)\b/i;
const SUD_DRUGS = /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|varenicline|naloxone)\b/i;
const HIV_DRUGS =
  /\b(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|efavirenz|rilpivirine|darunavir|atazanavir|ritonavir|cobicistat|abacavir|lamivudine|zidovudine|cabotegravir|doravirine|elvitegravir|maraviroc)\b/i;
const SRH_DRUGS =
  /\b(levonorgestrel|norethindrone|ethinyl estradiol|drospirenone|medroxyprogesterone|etonogestrel|norgestimate|desogestrel|ulipristal|sildenafil|tadalafil|vardenafil|clomiphene|letrozole for)\b/i;

function drugSensitivity(name: string): Sensitivity[] | undefined {
  const s: Sensitivity[] = [];
  if (SUD_DRUGS.test(name)) s.push("substance-use");
  else if (MH_DRUGS.test(name)) s.push("mental-health");
  if (HIV_DRUGS.test(name)) s.push("hiv-sti");
  if (SRH_DRUGS.test(name)) s.push("sexual-reproductive-health");
  return s.length ? s : undefined;
}

function dxSensitivity(icd: string | undefined, text: string): Sensitivity[] | undefined {
  const s: Sensitivity[] = [];
  const c = (icd ?? "").toUpperCase().replace(/\s/g, "");
  const t = text.toLowerCase();
  if (/^F1\d/.test(c) || /\b(alcohol|opioid|cocaine|cannabis|stimulant|substance) (use|abuse|dependence)|alcoholism\b/.test(t))
    s.push("substance-use");
  else if (/^F\d/.test(c) || /\b(depress|bipolar|schizo|anxiety|psychos|ptsd|post-traumatic|panic disorder|adhd|attention.deficit|eating disorder|anorexia nervosa|bulimia|obsessive)/.test(t))
    s.push("mental-health");
  if (/^(B2[0-4]|Z21|A5[0-9]|A6[0-4])/.test(c) || /\b(hiv|chlamydia|gonorrh|syphilis|genital herpes|trichomon)/.test(t)) s.push("hiv-sti");
  if (/^(O\d|Z3[0-9]|N97|Z31)/.test(c) || /\b(pregnan|contracept|infertil)/.test(t)) s.push("sexual-reproductive-health");
  if (/^(Q61\.[2-3]|Q87\.81|E75\.21|Q61)/.test(c) || /\b(polycystic kidney|alport|fabry|apol1|genetic|hereditary|inherited)/.test(t)) s.push("genetic");
  return s.length ? s : undefined;
}

// ---------------------------------------------------------------------------------------------------------
// Drug names

const BRANDS: Record<string, string> = {
  kerendia: "finerenone",
  jardiance: "empagliflozin",
  farxiga: "dapagliflozin",
  invokana: "canagliflozin",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  trulicity: "dulaglutide",
  victoza: "liraglutide",
  mounjaro: "tirzepatide",
  lasix: "furosemide",
  bumex: "bumetanide",
  demadex: "torsemide",
  aldactone: "spironolactone",
  inspra: "eplerenone",
  cozaar: "losartan",
  diovan: "valsartan",
  benicar: "olmesartan",
  avapro: "irbesartan",
  micardis: "telmisartan",
  zestril: "lisinopril",
  prinivil: "lisinopril",
  vasotec: "enalapril",
  altace: "ramipril",
  norvasc: "amlodipine",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  zocor: "simvastatin",
  glucophage: "metformin",
  lantus: "insulin glargine",
  basaglar: "insulin glargine",
  toujeo: "insulin glargine",
  levemir: "insulin detemir",
  tresiba: "insulin degludec",
  humalog: "insulin lispro",
  novolog: "insulin aspart",
  lokelma: "sodium zirconium cyclosilicate",
  veltassa: "patiromer",
  kayexalate: "sodium polystyrene sulfonate",
  renvela: "sevelamer",
  renagel: "sevelamer",
  phoslo: "calcium acetate",
  sensipar: "cinacalcet",
  epogen: "epoetin alfa",
  procrit: "epoetin alfa",
  aranesp: "darbepoetin alfa",
  coreg: "carvedilol",
  toprol: "metoprolol",
  lopressor: "metoprolol",
  zyloprim: "allopurinol",
  uloric: "febuxostat",
  synthroid: "levothyroxine",
  eliquis: "apixaban",
  xarelto: "rivaroxaban",
  coumadin: "warfarin",
  plavix: "clopidogrel",
  entresto: "sacubitril / valsartan",
  januvia: "sitagliptin",
  tradjenta: "linagliptin",
  bactrim: "sulfamethoxazole / trimethoprim",
  keflex: "cephalexin",
  augmentin: "amoxicillin / clavulanate",
  neurontin: "gabapentin",
  lyrica: "pregabalin",
};

const SALTS =
  /\b(hydrochloride|hcl|sodium|potassium|calcium|magnesium|sulfate|succinate|tartrate|besylate|maleate|mesylate|citrate|acetate|fumarate|phosphate|carbonate|bicarbonate|monohydrate|dihydrate|trihydrate|hyclate|propionate|bromide|chloride|er|xr|sr|la|dr|xl|cr|ec|odt)\b/gi;
const FORMS =
  /\b(tablets?|tabs?|capsules?|caps?|oral|solution|suspension|injection|injectable|pen|prefilled|syringe|vial|cream|ointment|patch|inhaler|powder|packet|film coated|extended release|delayed release|chewable|kit|subcutaneous|intravenous|drops?|spray|liquid|concentrate)\b/gi;

function ingredientOf(drugName: string): string | undefined {
  let s = drugName.toLowerCase();
  // Cut at the first strength / number.
  const cut = s.search(/\s\d|\(|,|\s-\s/);
  if (cut > 0) s = s.slice(0, cut);
  s = s.replace(FORMS, " ");
  const firstWord = s.trim().split(/\s+/)[0] ?? "";
  if (BRANDS[firstWord]) return BRANDS[firstWord];
  // Keep salt words when they are the drug itself (e.g. "sodium bicarbonate").
  const stripped = s.replace(SALTS, " ").replace(/\s+/g, " ").trim();
  const base = stripped || s.replace(/\s+/g, " ").trim();
  if (!base) return undefined;
  if (BRANDS[base]) return BRANDS[base];
  return base;
}

// ---------------------------------------------------------------------------------------------------------
// Medications

interface MedEvent {
  sk: string;
  status: number;
  hist?: Entry;
  order?: Entry;
  isHist: boolean;
}

function mapStopReason(code: string | undefined, comment: string | undefined): MedicationRow["stop_reason"] {
  const c = (comment ?? "").toLowerCase();
  switch (code) {
    case "ADR":
      return "adverse_reaction";
    case "PT":
      return "patient_choice";
    case "LAB":
    case "PROC":
    case "ERR":
      return "other";
    case "OTH":
      if (/\b(switch|changed to|replaced|transition|instead)\b/.test(c)) return "therapy_changed";
      if (/\b(ineffective|not effective|no (response|benefit|effect)|did not work)\b/.test(c)) return "ineffective";
      if (/\bcourse (complete|completed|finished)\b/.test(c)) return "course_complete";
      return "other";
  }
  return undefined;
}

const MED_STATUS: Record<number, MedicationRow["status"]> = { 1: "active", 2: "stopped", 3: "held" };

function buildMedications(entries: Entry[]): MedicationRow[] {
  const orders = new Map<string, Entry[]>();
  const hists = new Map<string, Entry[]>();
  const histSeen = new Set<string>();
  for (const en of entries) {
    if (en.e.type === "MED_ORDER") {
      const id = str(en.e.RX_ID);
      if (!id) continue;
      if (!orders.has(id)) orders.set(id, []);
      orders.get(id)!.push(en);
    } else if (en.e.type === "MED_STATUS_HIST") {
      const id = str(en.e.RX_ID);
      if (!id) continue;
      const hid = str(en.e.HIST_ID) ?? `${en.item.id}/${en.key}`;
      if (histSeen.has(hid)) continue; // the same history event restated in another item
      histSeen.add(hid);
      if (!hists.has(id)) hists.set(id, []);
      hists.get(id)!.push(en);
    }
  }

  interface Line {
    ingredient?: string;
    latest: string;
    row: MedicationRow;
  }
  const lines: Line[] = [];

  for (const [rxId, copies] of orders) {
    // Latest restatement of the order gives drug, dose, frequency.
    const sortedCopies = [...copies].sort(
      (a, b) => cmp(sortKey(a.item.effective), sortKey(b.item.effective)) || cmp(sortKey(a.item.recorded), sortKey(b.item.recorded)),
    );
    const order = sortedCopies[sortedCopies.length - 1];
    const o = order.e;
    const drugName = str(o.DRUG_NAME);
    if (!drugName) continue;
    if (o.ROUTE === "IV") continue; // given in clinic / hospital, not a home medicine

    const events: MedEvent[] = [];
    for (const c of sortedCopies) {
      const st = num(c.e.MED_STATUS);
      if (st === undefined) continue;
      const sk = sortKey(c.item.effective) || sortKey(c.e.START_DATE) || sortKey(c.item.recorded);
      events.push({ sk, status: st, order: c, isHist: false });
    }
    for (const h of hists.get(rxId) ?? []) {
      const st = num(h.e.NEW_STATUS);
      if (st === undefined) continue;
      const sk = sortKey(h.e.CHANGED_AT) || sortKey(h.item.effective);
      events.push({ sk, status: st, hist: h, isHist: true });
    }
    if (!events.length) continue;
    events.sort((a, b) => cmp(a.sk, b.sk) || (a.isHist === b.isHist ? 0 : a.isHist ? 1 : -1));
    const last = events[events.length - 1];
    if (last.status === 9) continue; // entered in error: never existed
    if (events.some((e) => e.isHist && e.status === 9 && e.hist?.e.REASON_CODE === "ERR" && e === last)) continue;
    const status = MED_STATUS[last.status];
    if (!status) continue;

    // Trailing run of the current status; the earliest history event in it sets status_since.
    let sinceHist: Entry | undefined;
    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i];
      if (e.status !== last.status) break;
      if (e.isHist) sinceHist = e.hist;
    }
    let since: string | undefined;
    if (sinceHist) since = toLocal(sinceHist.e.CHANGED_AT)?.date;
    else if (status === "active") since = toLocal(o.START_DATE)?.date;

    const ingredient = ingredientOf(drugName);
    const row: MedicationRow = {
      drug_name: drugName,
      status,
      patient_reported: false,
      evidence: [],
    };
    if (ingredient) row.ingredient = ingredient;
    if (since) row.status_since = since;

    const qty = num(o.DOSE_QTY);
    const unitMap: Record<string, "mg" | "mcg" | "units" | "mL"> = { mg: "mg", mcg: "mcg", unit: "units", units: "units", mL: "mL", ml: "mL" };
    const unit = typeof o.DOSE_UNIT === "string" ? unitMap[o.DOSE_UNIT] : undefined;
    if (qty !== undefined && qty > 0 && unit) row.dose = { value: qty, unit };

    const freq = str(o.FREQ_CODE);
    if (freq && ["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(freq)) row.frequency = freq as MedicationRow["frequency"];
    else if (freq) row.frequency = "other";

    if (sinceHist) {
      const comment = str(sinceHist.e.COMMENT_TEXT);
      if (comment) row.status_reason_text = comment;
      if (status === "stopped") {
        const r = mapStopReason(str(sinceHist.e.REASON_CODE), comment);
        if (r) row.stop_reason = r;
      }
    }
    const sens = drugSensitivity(`${drugName} ${ingredient ?? ""}`);
    if (sens) row.sensitivity = sens;

    const evidence: Evidence = [ev(order)];
    if (sortedCopies[0] !== order) evidence.unshift(ev(sortedCopies[0]));
    if (sinceHist) evidence.push(ev(sinceHist));
    else if (last.hist) evidence.push(ev(last.hist));
    else if (last.order) evidence.push(ev(last.order));
    row.evidence = dedupEvidence(evidence);

    let latest = events[events.length - 1].sk;
    const sd = sortKey(o.START_DATE);
    if (sd > latest) latest = sd;
    lines.push({ ingredient, latest, row });
  }

  // One row per ingredient: the line whose latest event is latest.
  const byIngredient = new Map<string, Line>();
  for (const l of lines) {
    const k = l.ingredient ?? `name:${l.row.drug_name.toLowerCase()}`;
    const prev = byIngredient.get(k);
    if (!prev || l.latest > prev.latest) byIngredient.set(k, l);
  }
  return [...byIngredient.values()].map((l) => l.row).sort((a, b) => cmp(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name));
}

// ---------------------------------------------------------------------------------------------------------
// Problems and drug-attributed allergies

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

function onsetFromText(t: string): string | undefined {
  const lead = String.raw`(?:since|diagnosed(?:\s+in)?|dx(?:'d)?(?:\s+in)?|onset(?:\s+in)?|first\s+noted(?:\s+in)?)\s+`;
  let m = new RegExp(lead + String.raw`(\d{1,2})/(\d{1,2})/(\d{4})\b`, "i").exec(t);
  if (m) return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  m = new RegExp(lead + String.raw`(\d{4})-(\d{2})-(\d{2})\b`, "i").exec(t);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = new RegExp(lead + String.raw`(\d{4})-(\d{2})\b`, "i").exec(t);
  if (m) return `${m[1]}-${m[2]}`;
  m = new RegExp(lead + String.raw`(\d{1,2})/(\d{4})\b`, "i").exec(t);
  if (m && +m[1] >= 1 && +m[1] <= 12) return `${m[2]}-${m[1].padStart(2, "0")}`;
  m = new RegExp(lead + String.raw`([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})\b`, "i").exec(t);
  if (m && MONTHS[m[1].toLowerCase()]) return `${m[3]}-${MONTHS[m[1].toLowerCase()]}-${m[2].padStart(2, "0")}`;
  m = new RegExp(lead + String.raw`([A-Za-z]{3})[a-z]*\.?\s+(\d{4})\b`, "i").exec(t);
  if (m && MONTHS[m[1].toLowerCase()]) return `${m[2]}-${MONTHS[m[1].toLowerCase()]}`;
  m = new RegExp(lead + String.raw`(\d{4})\b`, "i").exec(t);
  if (m) return m[1];
  return undefined;
}

/** Condition family so that restaged / recoded entries of one condition share a row. */
function conditionKey(icd: string | undefined, text: string): string {
  const c = (icd ?? "").toUpperCase().replace(/\s/g, "");
  if (/^N18/.test(c)) return "ckd";
  if (/^I1[0-3]/.test(c)) return "htn";
  if (/^E11/.test(c)) return "t2dm";
  if (/^E10/.test(c)) return "t1dm";
  if (c) return c.slice(0, 3);
  return "text:" + text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function ckdFromCode(icd: string | undefined): ProblemRow["ckd_stage"] {
  switch ((icd ?? "").toUpperCase()) {
    case "N18.1": return "G1";
    case "N18.2": return "G2";
    case "N18.31": return "G3a";
    case "N18.32": return "G3b";
    case "N18.4": return "G4";
    case "N18.5": return "G5";
    case "N18.6": return "G5";
  }
  return undefined;
}
function ckdFromText(t: string): { g?: ProblemRow["ckd_stage"]; a?: ProblemRow["albuminuria"] } {
  const out: { g?: ProblemRow["ckd_stage"]; a?: ProblemRow["albuminuria"] } = {};
  const g = /\bG(1|2|3a|3b|4|5)\b/i.exec(t);
  if (g) out.g = ("G" + g[1].toLowerCase()) as ProblemRow["ckd_stage"];
  const a = /\bA([123])\b/.exec(t);
  if (a) out.a = ("A" + a[1]) as ProblemRow["albuminuria"];
  return out;
}

const DRUG_CLASSES: { re: RegExp; member: RegExp }[] = [
  { re: /angiotensin[- ]converting[- ]enzyme|ace[- ]?inhibitor/i, member: /pril$/ },
  { re: /angiotensin(?:[- ]ii)? receptor|\barbs?\b/i, member: /sartan$/ },
  { re: /penicillin/i, member: /cillin\b/ },
  { re: /cephalosporin/i, member: /^(cef|ceph)/ },
  { re: /statin|hmg[- ]coa/i, member: /statin$/ },
  { re: /sglt2|sodium[- ]glucose/i, member: /gliflozin$/ },
  { re: /mineralocorticoid|aldosterone antagonist|potassium[- ]sparing/i, member: /^(finerenone|spironolactone|eplerenone|amiloride|triamterene)$/ },
  { re: /loop diuretic/i, member: /^(furosemide|bumetanide|torsemide|ethacrynic acid)$/ },
  { re: /thiazide/i, member: /^(hydrochlorothiazide|chlorthalidone|indapamide|metolazone|chlorothiazide)$/ },
  { re: /nsaid|nonsteroidal anti-?inflammatory/i, member: /^(ibuprofen|naproxen|diclofenac|meloxicam|celecoxib|indomethacin|ketorolac|etodolac|nabumetone)$/ },
  { re: /sulfonamide|sulfa\b/i, member: /^sulfamethoxazole/ },
  { re: /glp-?1/i, member: /(glutide|tirzepatide|exenatide)$/ },
  { re: /beta[- ]?blocker|beta[- ]adrenergic/i, member: /olol$|carvedilol|labetalol/ },
  { re: /calcium[- ]channel/i, member: /dipine$|diltiazem|verapamil/ },
  { re: /fluoroquinolone|quinolone/i, member: /floxacin$/ },
  { re: /macrolide/i, member: /thromycin$/ },
  { re: /sulfonylurea/i, member: /^(glipizide|glyburide|glimepiride)$/ },
];

const DRUG_SUFFIX =
  /(pril|sartan|statin|olol|dipine|gliflozin|glutide|cillin|mycin|floxacin|cycline|azole|prazole|tidine|gliptin|formin|semide|thiazide|renone|lactone|oxacin|parin|xaban|gatran|vir|mab|nib|profen|coxib|triptan|done|pam|lam)$/;

interface DrugAttr {
  substance: string;
  isClass: boolean;
  condition?: string; // the condition part, when there is one
}

/** Detect a diagnosis attributed to a drug. */
function drugAttribution(icd: string | undefined, text: string, knownIngredients: string[]): DrugAttr | undefined {
  const c = (icd ?? "").toUpperCase();
  const clean = text.replace(/,\s*(initial|subsequent) encounter.*$|,\s*sequela.*$/i, "").trim();
  // ICD-10-CM adverse-effect codes (T36-T50, 5th/6th character 5).
  const isAdverseCode = /^T(3[6-9]|4\d|50)\.[0-9X]{1,2}5/.test(c);
  let m = /^adverse effect of (.+)$/i.exec(clean);
  if (m) return { substance: m[1].trim(), isClass: !isSingleDrug(m[1], knownIngredients), condition: undefined };
  const patterns = [
    /^(.+?)\s+(?:due to|caused by|induced by|secondary to|from|attributed to|associated with)\s+(?:use of\s+|therapy with\s+|treatment with\s+)?(.+)$/i,
    /^(.+?)[- ]induced\s+(.+)$/i,
  ];
  m = patterns[0].exec(clean);
  if (m) {
    const sub = m[2].replace(/\b(therapy|treatment|use)\b/gi, "").trim();
    if (looksLikeDrug(sub, knownIngredients)) return { substance: sub, isClass: !isSingleDrug(sub, knownIngredients), condition: m[1].trim() };
  }
  m = patterns[1].exec(clean);
  if (m && looksLikeDrug(m[1], knownIngredients)) return { substance: m[1].trim(), isClass: !isSingleDrug(m[1], knownIngredients), condition: m[2].trim() };
  if (isAdverseCode) {
    // Code says adverse effect but the text did not name it in a recognised way.
    m = /adverse effect of (.+?)(?:,|$)/i.exec(clean);
    if (m) return { substance: m[1].trim(), isClass: !isSingleDrug(m[1], knownIngredients), condition: undefined };
  }
  return undefined;
}

function looksLikeDrug(s: string, known: string[]): boolean {
  const l = s.toLowerCase().trim();
  if (known.some((k) => k && l.includes(k))) return true;
  if (DRUG_CLASSES.some((dc) => dc.re.test(l))) return true;
  if (/\b(drug|medication|medicine|antibiotic|diuretic|inhibitor|antagonist|blocker|agonist|insulin|chemotherapy)\b/.test(l)) return true;
  const w = l.split(/\s+/)[0] ?? "";
  if (BRANDS[w]) return true;
  return DRUG_SUFFIX.test(w) && w.length > 5;
}

function isSingleDrug(s: string, known: string[]): boolean {
  const l = s.toLowerCase().trim();
  if (DRUG_CLASSES.some((dc) => dc.re.test(l))) return false;
  if (/\b(drugs|agents|inhibitors|antagonists|blockers|antibiotics|diuretics|medications|class)\b/.test(l)) return false;
  return l.split(/\s+/).length <= 3;
}

const HYPERSENS = /urticaria|hives|rash|angioedema|swelling|anaphyla|bronchospasm|wheez|pruritus|itch|stevens|toxic epidermal|dress\b|exanthem|hypersensitivity|allergic/i;
const SERIOUS = /hepatitis|liver injury|hepatotox|pancreatitis|rhabdomyolysis|agranulocytosis|neutropenia|aplastic|thrombocytopenia|lactic acidosis|ketoacidosis|acute kidney injury|nephritis|torsade|qt prolong|seizure|hemorrhage|bleed|necrosis|failure/i;
const KNOWN_NONIMMUNE = /cough|hyperkalemia|nausea|vomit|diarrh|upset|dyspepsia|dizz|hypotension|drowsi|sedation|fatigue|constipation|myalgia|muscle|gynecomastia|hypoglyc|genital mycotic|yeast|edema|headache|flushing/i;

function buildProblemsAndAllergies(
  items: FolioItem[],
  entries: Entry[],
  medIngredients: string[],
): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const visitTime = new Map<string, string>();
  const visits: Entry[] = [];
  for (const en of entries) {
    if (en.e.type === "CLINIC_VISIT") {
      visits.push(en);
      const vid = str(en.e.VISIT_ID);
      if (vid) visitTime.set(vid, sortKey(en.e.VISIT_AT) || sortKey(en.item.effective));
    }
  }
  const refs = new Map<string, Map<string, string>>();
  for (const it of items) refs.set(it.id, refTexts(it));

  // Ingredients of medicines ordered per item, for resolving drug classes.
  const itemMeds = new Map<string, string[]>();
  for (const en of entries) {
    if (en.e.type !== "MED_ORDER") continue;
    const name = str(en.e.DRUG_NAME);
    const ing = name ? ingredientOf(name) : undefined;
    if (!ing) continue;
    if (!itemMeds.has(en.item.id)) itemMeds.set(en.item.id, []);
    const l = itemMeds.get(en.item.id)!;
    if (!l.includes(ing)) l.push(ing);
  }

  interface Dx {
    en: Entry;
    sk: string;
    icd?: string;
    text: string;
    status: string;
    refText: string;
  }
  const dxs: Dx[] = [];
  for (const en of entries) {
    if (en.e.type !== "VISIT_DX") continue;
    const text = str(en.e.DX_TEXT) ?? "";
    const icd = str(en.e.ICD10CM)?.trim();
    if (!text && !icd) continue;
    const vid = str(en.e.VISIT_ID);
    const sk = (vid && visitTime.get(vid)) || sortKey(en.item.effective) || sortKey(en.item.recorded);
    dxs.push({ en, sk, icd, text: text || icd!, status: str(en.e.DX_STATUS) ?? "A", refText: refs.get(en.item.id)?.get(en.key) ?? "" });
  }
  dxs.sort((a, b) => cmp(a.sk, b.sk) || cmp(sortKey(a.en.item.recorded), sortKey(b.en.item.recorded)) || cmp(a.en.key, b.en.key));

  const groups = new Map<string, Dx[]>();
  const allergyGroups = new Map<string, { dx: Dx; attr: DrugAttr; all: Dx[] }>();
  for (const d of dxs) {
    const attr = drugAttribution(d.icd, d.text, medIngredients);
    const ruledOut = d.status === "R" && /\brule[sd]?[- ]?out\b|\br\/o\b|\bexcluded\b|\bnot confirmed\b/i.test(d.refText);
    if (attr && d.status !== "P" && !ruledOut) {
      const k = attr.substance.toLowerCase();
      const prev = allergyGroups.get(k);
      allergyGroups.set(k, { dx: d, attr, all: [...(prev?.all ?? []), d] });
    }
    if (attr && !attr.condition) continue; // pure adverse-effect code: allergy row only
    if (isBillingOnly(d.icd)) continue;
    const key = conditionKey(d.icd, d.text);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(d);
  }

  const problems: ProblemRow[] = [];
  for (const [key, list] of groups) {
    const last = list[list.length - 1];
    const ruledOut = last.status === "R" && /\brule[sd]?[- ]?out\b|\br\/o\b|\bexcluded\b|\bnot confirmed\b/i.test(last.refText);
    if (ruledOut) continue;
    if (last.status === "P") continue; // provisional / suspected, not (or no longer) confirmed
    const status: ProblemRow["status"] = last.status === "R" || last.status === "H" ? "resolved" : "active";
    const row: ProblemRow = { condition: cleanDxText(last.text), status, evidence: [] };
    if (last.icd) row.icd10cm = last.icd;
    const evidence: Evidence = [ev(last.en)];

    // Onset: from the narrative wording of an entry (latest mention wins).
    for (let i = list.length - 1; i >= 0; i--) {
      const o = onsetFromText(list[i].refText);
      if (o) {
        row.onset = { value: o, precision: precisionOf(o) };
        evidence.push(ev(list[i].en));
        break;
      }
    }

    if (key === "ckd") {
      let g: ProblemRow["ckd_stage"];
      let a: ProblemRow["albuminuria"];
      let gSk = "";
      let aSk = "";
      for (const d of list) {
        const t = ckdFromText(`${d.text} ${d.refText}`);
        const gc = ckdFromCode(d.icd) ?? t.g;
        if (gc && d.sk >= gSk) { g = gc; gSk = d.sk; }
        if (t.a && d.sk >= aSk) { a = t.a; aSk = d.sk; }
      }
      // Visit-level KDIGO category fields (clinician recorded) of visits carrying a CKD diagnosis.
      const ckdVisits = new Set(list.map((d) => str(d.en.e.VISIT_ID)).filter((x): x is string => !!x));
      for (const v of visits) {
        const vid = str(v.e.VISIT_ID);
        if (!vid || !ckdVisits.has(vid)) continue;
        const sk = visitTime.get(vid) ?? "";
        const vg = str(v.e.CKD_G);
        const va = str(v.e.CKD_A);
        if (vg && ["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(vg) && sk >= gSk) { g = vg as ProblemRow["ckd_stage"]; gSk = sk; }
        if (va && ["A1", "A2", "A3"].includes(va) && sk >= aSk) { a = va as ProblemRow["albuminuria"]; aSk = sk; }
      }
      if (g) row.ckd_stage = g;
      if (a) row.albuminuria = a;
      const lastVisit = visits.find((v) => str(v.e.VISIT_ID) === str(last.en.e.VISIT_ID) && v.item.id === last.en.item.id);
      if (lastVisit && (str(lastVisit.e.CKD_G) || str(lastVisit.e.CKD_A))) evidence.push(ev(lastVisit));
    }
    const sens = dxSensitivity(last.icd, last.text);
    if (sens) row.sensitivity = sens;
    row.evidence = dedupEvidence(evidence);
    problems.push(row);
  }
  problems.sort((a, b) => cmp(a.condition, b.condition));

  const allergies: AllergyIntoleranceRow[] = [];
  const allergySeen = new Set<string>();
  for (const { dx, attr, all } of allergyGroups.values()) {
    let substance = attr.substance.trim();
    if (attr.isClass) {
      const cls = DRUG_CLASSES.find((dc) => dc.re.test(substance));
      const meds = itemMeds.get(dx.en.item.id) ?? [];
      const members = cls ? meds.filter((m) => cls.member.test(m)) : [];
      if (members.length === 1) substance = members[0];
    } else {
      substance = ingredientOf(substance) ?? substance.toLowerCase();
    }
    const key = substance.toLowerCase();
    if (allergySeen.has(key)) {
      const prev = allergies.find((a) => a.substance.toLowerCase() === key);
      if (prev) prev.evidence = dedupEvidence([...prev.evidence, ev(dx.en)]);
      continue;
    }
    allergySeen.add(key);
    const reaction = attr.condition ?? "";
    const rtext = `${reaction} ${dx.text}`;
    let reaction_type: AllergyIntoleranceRow["reaction_type"] = "side_effect";
    if (HYPERSENS.test(rtext)) reaction_type = "hypersensitivity";
    else if (SERIOUS.test(rtext)) reaction_type = "serious_adverse_event";
    let criticality: AllergyIntoleranceRow["criticality"] = "unknown";
    if (/anaphyla|angioedema|stevens|toxic epidermal|dress\b|bronchospasm/i.test(rtext) || reaction_type === "serious_adverse_event") criticality = "high";
    let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
    if (/\b(ige|immune[- ]mediated|positive (skin|patch) test)\b/i.test(rtext) && !/non[- ]?immune/i.test(rtext)) mechanism = "immune";
    else if (reaction_type === "side_effect" && KNOWN_NONIMMUNE.test(rtext)) mechanism = "non_immune";
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type,
      mechanism,
      criticality,
      evidence: dedupEvidence(all.map((d) => ev(d.en)).slice(-1).concat([ev(dx.en)])),
    };
    if (reaction) row.reaction = reaction;
    for (const d of all) {
      const o = onsetFromText(d.refText);
      if (o) { row.onset = { value: o, precision: precisionOf(o) }; break; }
    }
    const sens = drugSensitivity(substance);
    if (sens) row.sensitivity = sens;
    allergies.push(row);
  }
  allergies.sort((a, b) => cmp(a.substance, b.substance));
  return { problems, allergies };
}

function cleanDxText(t: string): string {
  return t.replace(/,\s*(initial|subsequent) encounter\s*$/i, "").trim();
}

/** Encounter-reason codes that describe the visit rather than a condition. */
function isBillingOnly(icd: string | undefined): boolean {
  const c = (icd ?? "").toUpperCase();
  return /^Z(0[0-9]|1[0-3]|71|76)\b|^Z(0[0-9]|1[0-3]|71|76)\./.test(c);
}

// ---------------------------------------------------------------------------------------------------------
// Labs

const TEST_ANALYTE: Record<string, Analyte> = {
  "LK-CREAT": "creatinine",
  "LK-EGFR09N": "egfr",
  "LK-EGFR09A": "egfr",
  "LK-EGFR21": "egfr",
  "LK-NA": "sodium",
  "LK-K": "potassium",
  "LK-GLU": "glucose",
  "LK-A1C": "a1c",
  "LK-UACR": "uacr",
  "LK-WBC": "wbc",
  "LK-HGB": "hemoglobin",
  "LK-PLT": "platelets",
  "LK-CHOL": "cholesterol",
  "LK-TRIG": "triglycerides",
  "LK-HDL": "hdl",
  "LK-LDLC": "ldl",
};

const ANALYTE_UNIT: Record<string, string> = {
  creatinine: "mg/dL",
  egfr: "mL/min/1.73m2",
  potassium: "mmol/L",
  sodium: "mmol/L",
  glucose: "mg/dL",
  a1c: "%",
  uacr: "mg/g",
  platelets: "10*3/uL",
  wbc: "10*3/uL",
  hemoglobin: "g/dL",
  cholesterol: "mg/dL",
  triglycerides: "mg/dL",
  hdl: "mg/dL",
  ldl: "mg/dL",
};

/** Convert a value in a source unit into the analyte's fixed unit; undefined when not convertible. */
function convert(analyte: string, value: number, unit: string | null | undefined): number | undefined {
  const target = ANALYTE_UNIT[analyte];
  const u = (unit ?? "").trim();
  const norm = (x: string) => x.toLowerCase().replace(/\s/g, "").replace("µ", "u").replace("10*3", "k").replace("10^3", "k").replace("x10e3", "k");
  if (!u) return undefined;
  if (norm(u) === norm(target)) return value;
  const nu = norm(u);
  switch (analyte) {
    case "platelets":
    case "wbc":
      if (nu === "k/ul" || nu === "thou/ul" || nu === "10^9/l" || nu === "k/mm3") return value;
      if (nu === "/ul" || nu === "cells/ul") return value / 1000;
      return undefined;
    case "glucose":
      if (nu === "mmol/l") return round(value * 18.016, 1);
      return undefined;
    case "cholesterol":
    case "hdl":
    case "ldl":
      if (nu === "mmol/l") return round(value * 38.67, 1);
      return undefined;
    case "triglycerides":
      if (nu === "mmol/l") return round(value * 88.57, 1);
      return undefined;
    case "creatinine":
      if (nu === "umol/l") return round(value / 88.42, 2);
      if (nu === "mmol/l") return round((value * 1000) / 88.42, 2);
      return undefined;
    case "hemoglobin":
      if (nu === "g/l") return round(value / 10, 1);
      if (nu === "mmol/l") return round(value * 1.611, 1);
      return undefined;
    case "uacr":
      if (nu === "mg/mmol") return round(value * 8.84, 1);
      return undefined;
    case "sodium":
    case "potassium":
      if (nu === "meq/l") return value;
      return undefined;
    case "egfr":
      if (nu === "ml/min/1.73m2" || nu === "ml/min/1.73m^2" || nu === "ml/min/{1.73_m2}") return value;
      return undefined;
  }
  return undefined;
}

const RESULT_RANK: Record<string, number> = { P: 1, F: 2, A: 3, C: 4, X: 4 };

function buildLabs(entries: Entry[]): LabResultRow[] {
  // Orders and requisitions: latest copy by recorded time.
  const orders = new Map<string, Entry>();
  const reqs = new Map<string, Entry>();
  for (const en of entries) {
    if (en.e.type === "LAB_ORDER") {
      const id = str(en.e.ORDER_ID);
      if (id) orders.set(id, en); // entries are in recorded order: later copies win
    } else if (en.e.type === "LAB_REQ") {
      const id = str(en.e.REQ_ID);
      if (id) reqs.set(id, en);
    }
  }

  // Group result copies by RESULT_ID.
  const results = new Map<string, Entry[]>();
  for (const en of entries) {
    if (en.e.type !== "LAB_RESULT") continue;
    const id = str(en.e.RESULT_ID) ?? `${en.item.id}/${en.key}`;
    if (!results.has(id)) results.set(id, []);
    results.get(id)!.push(en);
  }
  const chosen = new Map<string, { best: Entry; copies: Entry[] }>();
  for (const [id, copies] of results) {
    let best = copies[0];
    for (const c of copies) {
      const rb = RESULT_RANK[String(best.e.RESULT_STATUS)] ?? 0;
      const rc = RESULT_RANK[String(c.e.RESULT_STATUS)] ?? 0;
      if (rc > rb) best = c;
      else if (rc === rb) {
        const kb = sortKey(best.e.STATUS_CHANGED_AT ?? best.e.RESULTED_AT) + "|" + sortKey(best.item.recorded);
        const kc = sortKey(c.e.STATUS_CHANGED_AT ?? c.e.RESULTED_AT) + "|" + sortKey(c.item.recorded);
        if (kc >= kb) best = c;
      }
    }
    chosen.set(id, { best, copies });
  }

  const invalid = (r: Record<string, any>): boolean => {
    const st = String(r.RESULT_STATUS);
    if (st !== "P" && st !== "F" && st !== "A") return true;
    if (str(r.REPLACED_BY_RESULT_ID)) return true;
    const o = orders.get(str(r.ORDER_ID) ?? "");
    if (o) {
      const os = num(o.e.ORDER_STATUS);
      if (os === 5 || os === 9) return true; // order cancelled / voided
    }
    return false;
  };

  const out: (LabResultRow & { _key: string })[] = [];
  // Specimens that have a race-free 2009 variant: drop the race-coefficient variant there.
  const hasNonRace = new Set<string>();
  for (const { best } of chosen.values()) {
    if (best.e.TEST_CODE === "LK-EGFR09N" && !invalid(best.e)) {
      hasNonRace.add(str(best.e.DERIVED_FROM_RESULT_ID) ?? str(best.e.ORDER_ID) ?? "");
    }
  }

  for (const [id, { best, copies }] of chosen) {
    const r = best.e;
    const code = str(r.TEST_CODE) ?? "";
    const analyte = TEST_ANALYTE[code];
    if (!analyte) continue;
    if (invalid(r)) continue;
    const parentId = str(r.DERIVED_FROM_RESULT_ID);
    if (parentId) {
      const parent = chosen.get(parentId);
      if (parent && invalid(parent.best.e)) continue; // calculated from a value that no longer stands
    }
    if (code === "LK-EGFR09A") {
      if (hasNonRace.has(parentId ?? str(r.ORDER_ID) ?? "")) continue;
    }

    // Value and comparator
    const vt = typeof r.VALUE_TEXT === "string" ? r.VALUE_TEXT.trim() : "";
    const cm = /^(<=|>=|<|>|≤|≥)\s*(-?\d+(?:\.\d+)?)/.exec(vt);
    let comparator: LabResultRow["comparator"];
    let raw: number | undefined;
    if (cm) {
      comparator = (cm[1] === "≤" ? "<=" : cm[1] === "≥" ? ">=" : cm[1]) as LabResultRow["comparator"];
      raw = num(r.VALUE_NUM) ?? Number(cm[2]);
    } else {
      raw = num(r.VALUE_NUM) ?? num(vt);
    }
    if (raw === undefined) continue;
    const value = convert(analyte, raw, r.UNIT_CODE);
    if (value === undefined) continue;

    // Collection time from the requisition.
    const order = orders.get(str(r.ORDER_ID) ?? "");
    const req = order ? reqs.get(str(order.e.REQ_ID) ?? "") : undefined;
    const collectedSrc = (req && str(req.e.COLLECTED_AT)) || best.item.effective;
    const lc = toLocal(collectedSrc);
    if (!lc) continue;
    const collected = lc.time ? `${lc.date}T${lc.time}:${lc.sec ?? "00"}${lc.offset ?? ""}` : lc.date;

    const row: LabResultRow & { _key: string } = {
      _key: `${collected}|${analyte}|${id}`,
      analyte,
      value,
      unit: ANALYTE_UNIT[analyte],
      collected,
      status: r.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: [],
    };
    if (comparator) row.comparator = comparator;
    if (analyte === "egfr") {
      const comment = String(r.COMMENT_TEXT ?? "") + " " + String(r.TEST_NAME ?? "");
      if (code === "LK-EGFR21") row.egfr_equation = "ckd-epi-2021";
      else if (code === "LK-EGFR09N" || code === "LK-EGFR09A") row.egfr_equation = "ckd-epi-2009";
      else if (/mdrd/i.test(comment)) row.egfr_equation = "mdrd";
      else row.egfr_equation = "unknown";
    }
    const loinc = str(r.LOINC);
    if (loinc) row.loinc = loinc;
    const evidence: Evidence = copies.filter((c) => c !== best).map(ev);
    evidence.push(ev(best));
    row.evidence = dedupEvidence(evidence);
    out.push(row);
  }
  out.sort((a, b) => cmp(a._key, b._key));
  return out.map(({ _key, ...rest }) => rest);
}

// ---------------------------------------------------------------------------------------------------------
// Vitals

function buildVitals(entries: Entry[]): VitalRow[] {
  const byVisit = new Map<string, Entry[]>();
  for (const en of entries) {
    if (en.e.type !== "VITAL") continue;
    const vid = str(en.e.VISIT_ID) ?? `item:${en.item.id}`;
    if (!byVisit.has(vid)) byVisit.set(vid, []);
    byVisit.get(vid)!.push(en);
  }
  const rows: (VitalRow & { _k: string })[] = [];
  for (const list of byVisit.values()) {
    // Same code + reading number restated in several items: keep the latest recorded copy.
    const uniq = new Map<string, Entry>();
    for (const en of list) {
      const k = `${en.e.VITAL_CODE}|${num(en.e.READING_NO) ?? 1}`;
      uniq.set(k, en); // entries are in recorded order
    }
    const meas = [...uniq.values()]
      .filter((en) => num(en.e.VALUE_NUM) !== undefined && toLocal(en.e.TAKEN_AT)?.time)
      .sort((a, b) => (num(a.e.READING_NO) ?? 1) - (num(b.e.READING_NO) ?? 1) || cmp(sortKey(a.e.TAKEN_AT), sortKey(b.e.TAKEN_AT)));
    if (!meas.length) continue;
    const pick = (code: string, idx: number): Entry | undefined => {
      const all = meas.filter((m) => m.e.VITAL_CODE === code);
      return all[idx];
    };
    const row: VitalRow & { _k: string } = { _k: "", setting: "clinic", local_time: "", evidence: [] };
    const sys1 = pick("BPS", 0);
    const dia1 = pick("BPD", 0);
    const sys2 = pick("BPS", 1);
    const dia2 = pick("BPD", 1);
    if (sys1) row.systolic_mmhg = num(sys1.e.VALUE_NUM)!;
    if (dia1) row.diastolic_mmhg = num(dia1.e.VALUE_NUM)!;
    if (sys2) row.repeat_systolic_mmhg = num(sys2.e.VALUE_NUM)!;
    if (dia2) row.repeat_diastolic_mmhg = num(dia2.e.VALUE_NUM)!;
    const hr = pick("HR", 0);
    if (hr) row.pulse_bpm = num(hr.e.VALUE_NUM)!;
    const wt = pick("WT", 0);
    if (wt) {
      const v = num(wt.e.VALUE_NUM)!;
      const u = String(wt.e.UNIT_CODE ?? "kg").toLowerCase();
      const kg = u === "lb" || u === "lbs" || u === "[lb_av]" ? v * 0.45359237 : u === "g" ? v / 1000 : v;
      row.weight_kg = round(kg, 1);
    }
    const anchor = sys1 ?? dia1 ?? [...meas].sort((a, b) => cmp(sortKey(a.e.TAKEN_AT), sortKey(b.e.TAKEN_AT)))[0];
    const lt = toLocal(anchor.e.TAKEN_AT)!;
    row.local_time = `${lt.date}T${lt.time}`;
    row._k = row.local_time;
    const used = [sys1, dia1, sys2, dia2, hr, wt].filter((x): x is Entry => !!x);
    if (!used.length) continue;
    row.evidence = dedupEvidence(used.map(ev));
    rows.push(row);
  }
  rows.sort((a, b) => cmp(a._k, b._k));
  return rows.map(({ _k, ...rest }) => rest);
}

// ---------------------------------------------------------------------------------------------------------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return empty;
  let counted: FolioItem[];
  try {
    counted = countingItems(items, asOf);
  } catch {
    return empty;
  }
  const entries = entriesOf(counted);

  const safe = <T>(f: () => T[]): T[] => {
    try {
      return f();
    } catch {
      return [];
    }
  };
  const medications = safe(() => buildMedications(entries));
  const medIngredients: string[] = [];
  for (const en of entries) {
    if (en.e.type === "MED_ORDER" && str(en.e.DRUG_NAME)) {
      const i = ingredientOf(en.e.DRUG_NAME);
      if (i && !medIngredients.includes(i)) medIngredients.push(i);
    }
  }
  let problems: ProblemRow[] = [];
  let allergies: AllergyIntoleranceRow[] = [];
  try {
    const pa = buildProblemsAndAllergies(counted, entries, medIngredients);
    problems = pa.problems;
    allergies = pa.allergies;
  } catch {
    // skip
  }
  const labs = safe(() => buildLabs(entries));
  const vitals = safe(() => buildVitals(entries));
  return { medications, problems, allergies, labs, vitals };
}
