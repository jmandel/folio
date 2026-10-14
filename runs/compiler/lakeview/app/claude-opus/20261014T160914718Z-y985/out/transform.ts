import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow, Evidence,
  Analyte, Sensitivity,
} from "../in/views/views";

const TZ = "America/Chicago";

// ---------- time helpers ----------

const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
});

function partsAt(ms: number): { y: string; mo: string; d: string; h: string; mi: string; s: string } {
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  return { y: p.year, mo: p.month, d: p.day, h: p.hour === "24" ? "00" : p.hour, mi: p.minute, s: p.second };
}

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;
const DT_RE = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/i;

interface Local { date: string; time: string; seconds: string; offset: string }

/** Offset (minutes) of America/Chicago at a UTC instant. */
function chicagoOffsetMin(ms: number): number {
  const p = partsAt(ms);
  const asUtc = Date.UTC(+p.y, +p.mo - 1, +p.d, +p.h, +p.mi, +p.s);
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

function fmtOffset(min: number): string {
  const sign = min < 0 ? "-" : "+";
  const a = Math.abs(min);
  return `${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

/** Convert a date-time to Chicago wall-clock. Returns undefined when not a full date-time. */
function toLocal(s: unknown): Local | undefined {
  if (typeof s !== "string") return undefined;
  const m = DT_RE.exec(s.trim());
  if (!m) return undefined;
  const [, y, mo, d, h, mi, sec] = m;
  if (m[7]) {
    const ms = Date.parse(s.trim());
    if (isNaN(ms)) return undefined;
    const p = partsAt(ms);
    return { date: `${p.y}-${p.mo}-${p.d}`, time: `${p.h}:${p.mi}`, seconds: p.s, offset: fmtOffset(chicagoOffsetMin(ms)) };
  }
  // No zone: already local wall-clock. Find the Chicago offset in effect then.
  const wallUtc = Date.UTC(+y, +mo - 1, +d, +h, +mi, +(sec ?? 0));
  let off = chicagoOffsetMin(wallUtc);
  off = chicagoOffsetMin(wallUtc - off * 60000);
  return { date: `${y}-${mo}-${d}`, time: `${h}:${mi}`, seconds: sec ?? "00", offset: fmtOffset(off) };
}

/** Local date (source precision) of a date or date-time. */
function localDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return t;
  return toLocal(t)?.date;
}

/** Sortable key (UTC ms) for ordering events; NaN-safe. */
function instant(s: unknown): number {
  if (typeof s !== "string") return -Infinity;
  const t = s.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const l = toLocal(`${t}T00:00:00`);
    return l ? Date.parse(`${t}T00:00:00${l.offset}`) : -Infinity;
  }
  if (HAS_ZONE.test(t)) { const ms = Date.parse(t); return isNaN(ms) ? -Infinity : ms; }
  const l = toLocal(t);
  if (!l) return -Infinity;
  const ms = Date.parse(`${l.date}T${l.time}:${l.seconds}${l.offset}`);
  return isNaN(ms) ? -Infinity : ms;
}

function isObj(x: unknown): x is Record<string, any> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() !== "" ? x.trim() : undefined;
}
function num(x: unknown): number | undefined {
  return typeof x === "number" && isFinite(x) ? x : undefined;
}

// ---------- as-of selection ----------

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const inTime = items.filter((it) => {
    if (!isObj(it) || typeof it.id !== "string") return false;
    const d = localDate(it.recorded);
    return d !== undefined && d.length === 10 && d <= asOf;
  });
  const retracted = new Set<string>();
  for (const it of inTime) for (const r of Array.isArray(it.retracts) ? it.retracts : []) retracted.add(String(r));
  const replaced = new Set<string>();
  for (const it of inTime) {
    if (retracted.has(it.id)) continue;
    for (const r of Array.isArray(it.supersedes) ? it.supersedes : []) replaced.add(String(r));
  }
  return inTime.filter((it) => !retracted.has(it.id) && !replaced.has(it.id) && isObj(it.payload));
}

interface Entry { item: FolioItem; key: string; e: Record<string, any> }

function entries(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    for (const key of Object.keys(item.payload).sort()) {
      const e = item.payload[key];
      if (isObj(e) && e.type === type) out.push({ item, key, e });
    }
  }
  return out;
}

function ev(x: Entry): { item_id: string; entry_id: string } {
  return { item_id: x.item.id, entry_id: x.key };
}

function dedupeEvidence(e: Evidence): Evidence {
  const seen = new Set<string>();
  return e.filter((x) => {
    const k = `${x.item_id}\u0000${x.entry_id ?? ""}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function byRecorded(a: Entry, b: Entry): number {
  return instant(a.item.recorded) - instant(b.item.recorded) || (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0);
}

// ---------- sensitivity ----------

const MH_DRUGS = /\b(quetiapine|olanzapine|risperidone|aripiprazole|ziprasidone|lurasidone|clozapine|haloperidol|lithium|lamotrigine|sertraline|fluoxetine|paroxetine|citalopram|escitalopram|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|vortioxetine|amitriptyline|nortriptyline)\b/i;
const SU_DRUGS = /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|varenicline)\b/i;
const HIV_DRUGS = /\b(emtricitabine|tenofovir|bictegravir|dolutegravir|raltegravir|efavirenz|rilpivirine|darunavir|atazanavir|lamivudine|abacavir|zidovudine|cabotegravir)\b/i;
const SRH_DRUGS = /\b(levonorgestrel|norethindrone|etonogestrel|medroxyprogesterone|drospirenone|norgestimate|ethinyl estradiol|sildenafil|tadalafil)\b/i;

function drugSensitivity(name: string): Sensitivity[] | undefined {
  const s: Sensitivity[] = [];
  if (MH_DRUGS.test(name)) s.push("mental-health");
  if (SU_DRUGS.test(name)) s.push("substance-use");
  if (HIV_DRUGS.test(name)) s.push("hiv-sti");
  if (SRH_DRUGS.test(name)) s.push("sexual-reproductive-health");
  return s.length ? s : undefined;
}

function dxSensitivity(icd: string | undefined, text: string): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  const c = (icd ?? "").toUpperCase();
  if (/^F1\d/.test(c)) s.add("substance-use");
  else if (/^F/.test(c)) s.add("mental-health");
  if (/^(B2[0-4]|Z21|A5\d|A6[0-4]|Z20\.6)/.test(c)) s.add("hiv-sti");
  if (/^(O|Z3[0-9]|N97)/.test(c)) s.add("sexual-reproductive-health");
  if (/^(Q|Z15|Z14)/.test(c)) s.add("genetic");
  if (/\b(depress|bipolar|schizo|anxiety|psych|ptsd)/i.test(text)) s.add("mental-health");
  if (/\b(alcohol|opioid|substance) (use|abuse|dependence)/i.test(text)) s.add("substance-use");
  if (/\bHIV\b/.test(text)) s.add("hiv-sti");
  return s.size ? [...s] : undefined;
}

// ---------- medications ----------

const BRANDS: Record<string, string> = {
  kerendia: "finerenone", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", januvia: "sitagliptin", tradjenta: "linagliptin",
  glucophage: "metformin", lantus: "insulin glargine", basaglar: "insulin glargine", levemir: "insulin detemir",
  tresiba: "insulin degludec", humalog: "insulin lispro", novolog: "insulin aspart",
  cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan", benicar: "olmesartan", micardis: "telmisartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  norvasc: "amlodipine", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide",
  aldactone: "spironolactone", inspra: "eplerenone", lipitor: "atorvastatin", crestor: "rosuvastatin",
  zocor: "simvastatin", toprol: "metoprolol", lopressor: "metoprolol", coreg: "carvedilol",
  lokelma: "sodium zirconium cyclosilicate", veltassa: "patiromer", renvela: "sevelamer", renagel: "sevelamer",
  phoslo: "calcium acetate", zyloprim: "allopurinol", uloric: "febuxostat", synthroid: "levothyroxine",
  eliquis: "apixaban", xarelto: "rivaroxaban", plavix: "clopidogrel", neurontin: "gabapentin",
  sensipar: "cinacalcet", procrit: "epoetin alfa", epogen: "epoetin alfa", aranesp: "darbepoetin alfa",
  seroquel: "quetiapine", zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine",
};
const MINERALS = new Set(["sodium", "potassium", "calcium", "magnesium", "ferrous", "ferric", "zinc", "lithium"]);
const SALTS = new Set([
  "potassium", "sodium", "calcium", "magnesium", "hydrochloride", "hcl", "hydrobromide", "besylate", "maleate",
  "succinate", "tartrate", "mesylate", "fumarate", "acetate", "sulfate", "carbonate", "citrate", "phosphate",
  "bitartrate", "dihydrate", "monohydrate", "trihydrate", "hyclate", "propionate", "furoate", "bromide",
  "disodium", "dipropionate", "medoxomil", "axetil", "pivoxil",
]);
const FORMS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "oral", "solution", "suspension",
  "injection", "injectable", "pen", "er", "xr", "sr", "xl", "dr", "ec", "cr", "la", "extended", "delayed",
  "release", "film", "coated", "chewable", "powder", "packet", "subcutaneous", "vial", "syringe", "prefilled",
  "inhaler", "cream", "ointment", "patch", "liquid", "odt",
]);

function ingredientOf(name: string): string | undefined {
  const words = name.toLowerCase().replace(/[(),/]/g, " ").split(/\s+/).filter(Boolean);
  const kept: string[] = [];
  for (const w of words) {
    if (/\d/.test(w)) break;
    kept.push(w.replace(/[®™]/g, ""));
  }
  let ws = kept.filter((w) => !FORMS.has(w));
  if (ws.length === 0) return undefined;
  const brand = BRANDS[ws[0]];
  if (brand) return brand;
  if (!MINERALS.has(ws[0])) {
    const stripped = [ws[0], ...ws.slice(1).filter((w) => !SALTS.has(w))];
    ws = stripped;
  }
  return ws.join(" ") || undefined;
}

const MED_STATUS: Record<number, MedicationRow["status"] | "error"> = { 1: "active", 2: "stopped", 3: "held", 9: "error" };
const STOP_REASON: Record<string, MedicationRow["stop_reason"]> = {
  ADR: "adverse_reaction", PT: "patient_choice", LAB: "other", PROC: "other", OTH: "other",
};
const FREQS = new Set(["QD", "BID", "TID", "QHS", "QW", "PRN"]);
const DOSE_UNITS: Record<string, NonNullable<MedicationRow["dose"]>["unit"]> = {
  mg: "mg", mcg: "mcg", unit: "units", units: "units", mL: "mL", ml: "mL",
};

interface MedEvent { at: number; rec: number; status: number; since?: string; entry: Entry; hist?: Record<string, any> }

function medications(items: FolioItem[]): MedicationRow[] {
  const orders = entries(items, "MED_ORDER").filter((x) => str(x.e.RX_ID));
  const hists = entries(items, "MED_STATUS_HIST").filter((x) => str(x.e.RX_ID));
  const lines = new Map<string, { orders: Entry[]; events: MedEvent[] }>();
  const line = (id: string) => {
    let l = lines.get(id);
    if (!l) { l = { orders: [], events: [] }; lines.set(id, l); }
    return l;
  };
  for (const o of orders) {
    const l = line(o.e.RX_ID);
    l.orders.push(o);
    const st = num(o.e.MED_STATUS);
    if (st === undefined) continue;
    const at = instant(o.item.effective);
    l.events.push({
      at: at === -Infinity ? instant(o.item.recorded) : at, rec: instant(o.item.recorded), status: st,
      since: st === 1 ? localDate(o.e.START_DATE) : undefined, entry: o,
    });
  }
  for (const h of hists) {
    const st = num(h.e.NEW_STATUS);
    if (st === undefined) continue;
    line(h.e.RX_ID).events.push({
      at: instant(h.e.CHANGED_AT) === -Infinity ? instant(h.item.effective) : instant(h.e.CHANGED_AT),
      rec: instant(h.item.recorded), status: st, since: localDate(h.e.CHANGED_AT) ?? localDate(h.item.effective),
      entry: h, hist: h.e,
    });
  }

  const best = new Map<string, { row: MedicationRow; at: number; rec: number }>();
  for (const [, l] of lines) {
    if (l.orders.length === 0 || l.events.length === 0) continue;
    l.orders.sort(byRecorded);
    const order = l.orders[l.orders.length - 1];
    l.events.sort((a, b) => a.at - b.at || a.rec - b.rec || (a.hist ? 1 : 0) - (b.hist ? 1 : 0));
    const last = l.events[l.events.length - 1];
    const status = MED_STATUS[last.status];
    if (!status || status === "error") continue;
    const o = order.e;
    if (o.ROUTE === "IV") continue; // given in clinic/hospital, not a home medicine
    const drugName = str(o.DRUG_NAME);
    if (!drugName) continue;
    const row: MedicationRow = { drug_name: drugName, status, patient_reported: false, evidence: [] };
    const ing = ingredientOf(drugName);
    if (ing) row.ingredient = ing;
    if (last.since) row.status_since = last.since;
    else if (status === "active" && str(o.START_DATE)) row.status_since = localDate(o.START_DATE);
    if (row.status_since === undefined) delete row.status_since;
    const qty = num(o.DOSE_QTY);
    const unit = DOSE_UNITS[String(o.DOSE_UNIT)];
    if (qty !== undefined && qty > 0 && unit) row.dose = { value: qty, unit };
    if (typeof o.FREQ_CODE === "string" && FREQS.has(o.FREQ_CODE)) row.frequency = o.FREQ_CODE as MedicationRow["frequency"];
    if (last.hist) {
      if (status === "stopped") {
        const r = STOP_REASON[String(last.hist.REASON_CODE)];
        if (r) row.stop_reason = r;
      }
      const c = str(last.hist.COMMENT_TEXT);
      if (c) row.status_reason_text = c;
    }
    const sens = drugSensitivity(`${drugName} ${ing ?? ""}`);
    if (sens) row.sensitivity = sens;
    const evidence: Evidence = [ev(order)];
    if (last.entry !== order) evidence.push(ev(last.entry));
    row.evidence = dedupeEvidence(evidence);

    const key = row.ingredient ?? drugName.toLowerCase();
    const prev = best.get(key);
    if (!prev || last.at > prev.at || (last.at === prev.at && last.rec > prev.rec)) {
      best.set(key, { row, at: last.at, rec: last.rec });
    }
  }
  return [...best.values()].map((b) => b.row);
}

// ---------- problems & allergies ----------

const ENCOUNTER_Z = /^Z(0[0-9]|1[0-3]|5[1-5]|7[0-6]|79)/;
const DRUG_ADVERSE = /^T(3[6-9]|4[0-9]|50)\.[0-9A-Z]{0,2}5/i;

function ckdStageFromIcd(c: string): { g?: ProblemRow["ckd_stage"] } {
  const m: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  return { g: m[c] };
}

function conditionKey(icd: string | undefined, text: string): string {
  if (icd) {
    const c = icd.toUpperCase();
    if (c.startsWith("N18")) return "ckd";
    return c.slice(0, 3);
  }
  return `text:${text.toLowerCase()}`;
}

function visitTime(item: FolioItem, visits: Map<string, Entry[]>, visitId: unknown): number {
  const v = typeof visitId === "string" ? visits.get(visitId) : undefined;
  const t = v ? instant(v[v.length - 1].e.VISIT_AT) : -Infinity;
  return t !== -Infinity ? t : instant(item.effective);
}

function problemsAndAllergies(items: FolioItem[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const visits = new Map<string, Entry[]>();
  for (const v of entries(items, "CLINIC_VISIT").sort(byRecorded)) {
    const id = str(v.e.VISIT_ID);
    if (!id) continue;
    (visits.get(id) ?? visits.set(id, []).get(id)!).push(v);
  }
  const dxs = entries(items, "VISIT_DX").filter((x) => str(x.e.DX_TEXT) || str(x.e.ICD10CM));
  type D = { x: Entry; at: number; rec: number; icd?: string; text: string; status: string };
  const groups = new Map<string, D[]>();
  const adverse: D[] = [];
  for (const x of dxs) {
    const icd = str(x.e.ICD10CM);
    const text = str(x.e.DX_TEXT) ?? icd!;
    const d: D = {
      x, at: visitTime(x.item, visits, x.e.VISIT_ID), rec: instant(x.item.recorded), icd, text,
      status: String(x.e.DX_STATUS ?? ""),
    };
    if (icd && DRUG_ADVERSE.test(icd)) { adverse.push(d); continue; }
    if (icd && ENCOUNTER_Z.test(icd.toUpperCase())) continue;
    const k = conditionKey(icd, text);
    (groups.get(k) ?? groups.set(k, []).get(k)!).push(d);
  }

  const problems: ProblemRow[] = [];
  for (const [k, list] of groups) {
    list.sort((a, b) => a.at - b.at || a.rec - b.rec);
    const latest = list[list.length - 1];
    const confirmed = list.some((d) => d.status === "A" || d.status === "H");
    let status: ProblemRow["status"];
    if (latest.status === "A") status = "active";
    else if (latest.status === "H") status = "resolved";
    else if (latest.status === "R") {
      // R after only provisional entries reads as ruled out; otherwise resolved.
      if (!confirmed && list.some((d) => d.status === "P")) continue;
      status = "resolved";
    } else if (latest.status === "P") {
      // Provisional now; report only if previously confirmed and use that confirmed state.
      const conf = [...list].reverse().find((d) => d.status === "A" || d.status === "H");
      if (!conf) continue;
      status = conf.status === "A" ? "active" : "resolved";
    } else continue;
    const src = latest.status === "P" ? [...list].reverse().find((d) => d.status === "A" || d.status === "H")! : latest;
    const row: ProblemRow = { condition: src.text, status, evidence: [] };
    if (src.icd) row.icd10cm = src.icd;
    if (k === "ckd") {
      // Most recent clinician-recorded G/A category: visit fields or the N18 code.
      let gAt = -Infinity, aAt = -Infinity;
      for (const d of list) {
        if (d.status === "P" || d.status === "R") continue;
        const g = d.icd ? ckdStageFromIcd(d.icd.toUpperCase()).g : undefined;
        if (g && d.at >= gAt) { row.ckd_stage = g; gAt = d.at; }
      }
      for (const [, vs] of visits) {
        const v = vs[vs.length - 1];
        const at = instant(v.e.VISIT_AT) === -Infinity ? instant(v.item.effective) : instant(v.e.VISIT_AT);
        const G = v.e.CKD_G, A = v.e.CKD_A;
        if (["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(G) && at >= gAt) { row.ckd_stage = G; gAt = at; }
        if (["A1", "A2", "A3"].includes(A) && at >= aAt) { row.albuminuria = A; aAt = at; }
      }
    }
    const sens = dxSensitivity(src.icd, src.text);
    if (sens) row.sensitivity = sens;
    row.evidence = [ev(src.x)];
    problems.push(row);
  }

  // Drug-attributed diagnoses -> allergy rows.
  const allergies = new Map<string, AllergyIntoleranceRow>();
  adverse.sort((a, b) => a.at - b.at || a.rec - b.rec);
  for (const d of adverse) {
    if (d.status === "P" && !adverse.some((o) => o !== d && o.text === d.text && o.status !== "P")) continue;
    let substance = d.text.replace(/^.*?adverse effect of\s+/i, "").replace(/,?\s*(initial|subsequent) encounter.*$/i, "").trim();
    // A class with exactly one drug on the same item's medication list -> that drug.
    const meds = entries([d.x.item], "MED_ORDER").map((m) => ingredientOf(String(m.e.DRUG_NAME ?? ""))).filter((s): s is string => !!s);
    const uniq = [...new Set(meds)];
    if (/s$/i.test(substance) && uniq.length === 1) substance = uniq[0];
    else if (/^[a-z]+$/i.test(substance) && !/s$/i.test(substance)) substance = substance.toLowerCase();
    // Reaction type from conditions coded alongside in the same item.
    const sameItem = dxs.filter((o) => o.item === d.x.item && o !== d.x);
    const hyper = sameItem.some((o) => /^(L50|L27|T78\.3|T88\.6|L51|L53\.9|J45|T78\.4)/i.test(String(o.e.ICD10CM ?? ""))
      || /urticaria|hives|rash|angioedema|anaphyla|swelling/i.test(String(o.e.DX_TEXT ?? "")));
    const serious = sameItem.some((o) => /^(K71|K85|N17|D61|D70|M62\.82)/i.test(String(o.e.ICD10CM ?? "")));
    const reactions = sameItem.filter((o) => !DRUG_ADVERSE.test(String(o.e.ICD10CM ?? ""))
      && !/chronic kidney|diabetes|hypertens/i.test(String(o.e.DX_TEXT ?? "")));
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type: hyper ? "hypersensitivity" : serious ? "serious_adverse_event" : "side_effect",
      mechanism: "unknown",
      criticality: /anaphyla/i.test(sameItem.map((o) => String(o.e.DX_TEXT ?? "")).join(" ")) ? "high" : "unknown",
      evidence: [ev(d.x)],
    };
    const rx = reactions.map((o) => str(o.e.DX_TEXT)).filter((s): s is string => !!s);
    if (rx.length && (hyper || serious)) row.reaction = rx.join("; ");
    allergies.set(substance.toLowerCase(), row);
  }
  return { problems, allergies: [...allergies.values()] };
}

// ---------- labs ----------

const TEST_ANALYTE: Record<string, { a: Analyte; eq?: LabResultRow["egfr_equation"] }> = {
  "LK-CREAT": { a: "creatinine" },
  "LK-EGFR09N": { a: "egfr", eq: "ckd-epi-2009" },
  "LK-EGFR21": { a: "egfr", eq: "ckd-epi-2021" },
  "LK-NA": { a: "sodium" },
  "LK-K": { a: "potassium" },
  "LK-GLU": { a: "glucose" },
  "LK-A1C": { a: "a1c" },
  "LK-UACR": { a: "uacr" },
  "LK-WBC": { a: "wbc" },
  "LK-HGB": { a: "hemoglobin" },
  "LK-PLT": { a: "platelets" },
  "LK-CHOL": { a: "cholesterol" },
  "LK-TRIG": { a: "triglycerides" },
  "LK-HDL": { a: "hdl" },
  "LK-LDLC": { a: "ldl" },
};
const UNIT_OF: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function round(v: number, dp: number): number {
  const f = Math.pow(10, dp);
  return Math.round(v * f) / f;
}

/** Convert a value in a Lakeview unit to the analyte's unit; undefined when not convertible. */
function convert(a: Analyte, v: number, unit: string | null | undefined): number | undefined {
  const target = UNIT_OF[a];
  if (unit === null || unit === undefined || unit === "") return v; // Lakeview reports in its standard unit
  const u = unit.trim();
  if (u === target) return v;
  if (u === "K/uL" && (a === "platelets" || a === "wbc")) return v;
  if (u === "mmol/L" && target === "mg/dL") {
    const f: Partial<Record<Analyte, number>> = {
      glucose: 18.016, cholesterol: 38.67, hdl: 38.67, ldl: 38.67, triglycerides: 88.57, bun: 2.801, creatinine: 11.312,
    };
    const k = f[a];
    if (k === undefined) return undefined;
    return a === "creatinine" ? round(v * k, 2) : Math.round(v * k);
  }
  if (u === "mg/dL" && a === "hemoglobin") return round(v / 1000, 1);
  if (u === "g/dL" && target === "mg/dL") return undefined;
  return undefined;
}

const RES_RANK: Record<string, number> = { P: 1, F: 2, A: 2, C: 3, X: 3 };

function labs(items: FolioItem[]): LabResultRow[] {
  const reqs = new Map<string, Entry>();
  for (const r of entries(items, "LAB_REQ").sort(byRecorded)) if (str(r.e.REQ_ID)) reqs.set(r.e.REQ_ID, r);
  const orders = new Map<string, Entry>();
  for (const o of entries(items, "LAB_ORDER").sort((a, b) => byRecorded(a, b) || instant(a.e.STATUS_AT) - instant(b.e.STATUS_AT))) {
    if (str(o.e.ORDER_ID)) orders.set(o.e.ORDER_ID, o);
  }
  const results = new Map<string, Entry[]>();
  for (const r of entries(items, "LAB_RESULT")) {
    const id = str(r.e.RESULT_ID);
    if (!id) continue;
    (results.get(id) ?? results.set(id, []).get(id)!).push(r);
  }
  const rows: LabResultRow[] = [];
  for (const [, copies] of results) {
    copies.sort((a, b) =>
      (RES_RANK[a.e.RESULT_STATUS] ?? 0) - (RES_RANK[b.e.RESULT_STATUS] ?? 0)
      || instant(a.e.STATUS_CHANGED_AT ?? a.e.RESULTED_AT) - instant(b.e.STATUS_CHANGED_AT ?? b.e.RESULTED_AT)
      || byRecorded(a, b));
    const top = copies[copies.length - 1];
    const r = top.e;
    const st = String(r.RESULT_STATUS);
    if (st !== "P" && st !== "F" && st !== "A") continue; // C = corrected away, X = withdrawn/not performed
    if (copies.some((c) => str(c.e.REPLACED_BY_RESULT_ID))) continue;
    const map = TEST_ANALYTE[String(r.TEST_CODE)];
    if (!map) continue;
    const order = orders.get(String(r.ORDER_ID));
    const ost = order ? num(order.e.ORDER_STATUS) : undefined;
    if (ost === 5 || ost === 9) continue; // cancelled / entered in error
    let value = num(r.VALUE_NUM);
    let comparator: LabResultRow["comparator"];
    const vt = typeof r.VALUE_TEXT === "string" ? r.VALUE_TEXT.trim() : "";
    const m = /^(<=|>=|<|>)\s*(-?\d+(?:\.\d+)?)$/.exec(vt);
    if (m) { comparator = m[1] as LabResultRow["comparator"]; if (value === undefined) value = parseFloat(m[2]); }
    else if (value === undefined && /^-?\d+(?:\.\d+)?$/.test(vt)) value = parseFloat(vt);
    if (value === undefined) continue;
    const conv = convert(map.a, value, r.UNIT_CODE);
    if (conv === undefined) continue;

    const req = order ? reqs.get(String(order.e.REQ_ID)) : undefined;
    const collectedSrc = req ? req.e.COLLECTED_AT : top.item.effective;
    const l = toLocal(collectedSrc) ?? toLocal(top.item.effective);
    if (!l) continue;
    const row: LabResultRow = {
      analyte: map.a, value: conv, unit: UNIT_OF[map.a],
      collected: `${l.date}T${l.time}:${l.seconds}${l.offset}`,
      status: st === "P" ? "preliminary" : "final",
      evidence: [],
    };
    if (comparator) row.comparator = comparator;
    if (map.eq) {
      let eq = map.eq;
      const c = String(r.COMMENT_TEXT ?? "");
      if (/MDRD/i.test(c)) eq = "mdrd";
      row.egfr_equation = eq;
    }
    const loinc = str(r.LOINC);
    if (loinc) row.loinc = loinc;
    row.evidence = dedupeEvidence([ev(top), ...copies.filter((c) => c !== top).map(ev)]);
    rows.push(row);
  }
  rows.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : a.analyte < b.analyte ? -1 : 1));
  return rows;
}

// ---------- vitals ----------

function vitals(items: FolioItem[]): VitalRow[] {
  const visitType = new Map<string, string>();
  for (const v of entries(items, "CLINIC_VISIT").sort(byRecorded)) if (str(v.e.VISIT_ID)) visitType.set(v.e.VISIT_ID, String(v.e.VISIT_TYPE));
  // Latest copy per (visit, code, reading).
  const latest = new Map<string, Entry>();
  for (const x of entries(items, "VITAL").sort(byRecorded)) {
    const vid = str(x.e.VISIT_ID) ?? `item:${x.item.id}`;
    const k = `${vid}|${x.e.VITAL_CODE}|${x.e.READING_NO ?? 1}`;
    latest.set(k, x);
  }
  const sets = new Map<string, Entry[]>();
  for (const x of latest.values()) {
    if (num(x.e.VALUE_NUM) === undefined) continue;
    const vid = str(x.e.VISIT_ID) ?? `item:${x.item.id}`;
    const home = visitType.get(vid) === "TEL";
    const key = home ? `${vid}|${toLocal(x.e.TAKEN_AT)?.date ?? ""}T${toLocal(x.e.TAKEN_AT)?.time ?? ""}` : vid;
    (sets.get(key) ?? sets.set(key, []).get(key)!).push(x);
  }
  const rows: VitalRow[] = [];
  for (const [key, xs] of sets) {
    const vid = key.split("|")[0];
    const home = visitType.get(vid) === "TEL";
    xs.sort((a, b) => instant(a.e.TAKEN_AT) - instant(b.e.TAKEN_AT) || (num(a.e.READING_NO) ?? 1) - (num(b.e.READING_NO) ?? 1));
    const readingNos = [...new Set(xs.filter((x) => x.e.VITAL_CODE === "BPS" || x.e.VITAL_CODE === "BPD")
      .map((x) => num(x.e.READING_NO) ?? 1))].sort((a, b) => a - b);
    const firstNo = readingNos[0], repeatNo = home ? undefined : readingNos[1];
    const pick = (code: string, no: number | undefined) =>
      no === undefined ? undefined : xs.find((x) => x.e.VITAL_CODE === code && (num(x.e.READING_NO) ?? 1) === no);
    const sys = pick("BPS", firstNo), dia = pick("BPD", firstNo);
    const rsys = pick("BPS", repeatNo), rdia = pick("BPD", repeatNo);
    const hrs = xs.filter((x) => x.e.VITAL_CODE === "HR").sort((a, b) => (num(a.e.READING_NO) ?? 1) - (num(b.e.READING_NO) ?? 1));
    const wts = xs.filter((x) => x.e.VITAL_CODE === "WT").sort((a, b) => (num(a.e.READING_NO) ?? 1) - (num(b.e.READING_NO) ?? 1));
    const anchor = sys ?? dia ?? xs[0];
    const l = toLocal(anchor.e.TAKEN_AT) ?? toLocal(anchor.item.effective);
    if (!l) continue;
    const row: VitalRow = { setting: home ? "home" : "clinic", local_time: `${l.date}T${l.time}`, evidence: [] };
    if (sys && String(sys.e.UNIT_CODE ?? "mmHg") === "mmHg") row.systolic_mmhg = sys.e.VALUE_NUM;
    if (dia && String(dia.e.UNIT_CODE ?? "mmHg") === "mmHg") row.diastolic_mmhg = dia.e.VALUE_NUM;
    if (rsys && String(rsys.e.UNIT_CODE ?? "mmHg") === "mmHg") row.repeat_systolic_mmhg = rsys.e.VALUE_NUM;
    if (rdia && String(rdia.e.UNIT_CODE ?? "mmHg") === "mmHg") row.repeat_diastolic_mmhg = rdia.e.VALUE_NUM;
    if (hrs[0]) row.pulse_bpm = hrs[0].e.VALUE_NUM;
    if (wts[0]) {
      const u = String(wts[0].e.UNIT_CODE ?? "kg").toLowerCase();
      const v = wts[0].e.VALUE_NUM as number;
      if (u === "kg") row.weight_kg = round(v, 1);
      else if (u === "lb" || u === "lbs" || u === "[lb_av]") row.weight_kg = round(v * 0.45359237, 1);
    }
    const used = [sys, dia, rsys, rdia, hrs[0], wts[0]].filter((x): x is Entry => !!x);
    if (used.length === 0) continue;
    row.evidence = dedupeEvidence(used.map(ev));
    rows.push(row);
  }
  rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return rows;
}

// ---------- entry point ----------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return empty;
  const counting = countingItems(items, asOf);
  const safe = <T>(f: () => T[]): T[] => { try { return f(); } catch { return []; } };
  const pa = (() => { try { return problemsAndAllergies(counting); } catch { return { problems: [], allergies: [] }; } })();
  return {
    medications: safe(() => medications(counting)),
    problems: pa.problems,
    allergies: pa.allergies,
    labs: safe(() => labs(counting)),
    vitals: safe(() => vitals(counting)),
  };
}
