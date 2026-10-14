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

// Mapper for Northgate Family Medicine chart events (northgate-chart-v1).

const TZ = "America/Chicago";

// ---------------------------------------------------------------------------
// Time helpers

const dtf = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function isStr(x: unknown): x is string {
  return typeof x === "string";
}

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

/** Local wall-clock parts of a date-time; `null` if unreadable. Date-only → time undefined. */
function localParts(s: unknown): { date: string; time?: string } | null {
  if (!isStr(s)) return null;
  const t = s.trim();
  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(t)) return { date: t };
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(:\d{2}(\.\d+)?)?(.*)$/.exec(t);
  if (!m) return null;
  if (!HAS_ZONE.test(t)) return { date: m[1], time: m[2] + (m[3] ? m[3].slice(0, 3) : ":00") };
  const ms = Date.parse(t);
  if (isNaN(ms)) return null;
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(new Date(ms))) p[part.type] = part.value;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}:${p.second}` };
}

function localDate(s: unknown): string | undefined {
  return localParts(s)?.date;
}

/** Chicago UTC offset ("-05:00"/"-06:00") in effect at local wall time. */
function chicagoOffset(date: string, time: string): string {
  const guess = Date.parse(`${date}T${time}Z`);
  if (isNaN(guess)) return "-06:00";
  for (const off of [-5, -6]) {
    const ms = guess - off * 3600000;
    const lp = localParts(new Date(ms).toISOString());
    if (lp && lp.date === date && lp.time && lp.time.slice(0, 5) === time.slice(0, 5)) {
      return off === -5 ? "-05:00" : "-06:00";
    }
  }
  return "-06:00";
}

/** RFC 3339 with offset, in Chicago offset when source used Z or no offset. */
function toRfc3339(s: unknown): string | undefined {
  if (!isStr(s)) return undefined;
  const t = s.trim();
  if (/[+-]\d{2}:\d{2}$/.test(t)) return t;
  const lp = localParts(t);
  if (!lp || !lp.time) return undefined;
  const time = lp.time.length === 5 ? lp.time + ":00" : lp.time;
  return `${lp.date}T${time}${chicagoOffset(lp.date, time)}`;
}

/** Sort key comparison of item effective times; ties broken by recorded instant. */
function cmpEffective(a: FolioItem, b: FolioItem): number {
  const pa = localParts(a.effective);
  const pb = localParts(b.effective);
  const da = pa?.date ?? "";
  const db = pb?.date ?? "";
  if (da !== db) return da < db ? -1 : 1;
  if (pa?.time && pb?.time && pa.time !== pb.time) return pa.time < pb.time ? -1 : 1;
  const ra = Date.parse(a.recorded);
  const rb = Date.parse(b.recorded);
  if (!isNaN(ra) && !isNaN(rb) && ra !== rb) return ra - rb;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function fuzzy(fd: any): { value: string; precision: "year" | "month" | "day" } | undefined {
  if (!fd || !isStr(fd.date)) return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(fd.date);
  if (!m) return undefined;
  const prec = fd.precision === "year" || fd.precision === "month" || fd.precision === "day" ? fd.precision : undefined;
  if (prec === "year" || (!m[2] && !prec)) return { value: m[1], precision: "year" };
  if (prec === "month" || !m[3]) {
    if (!m[2]) return { value: m[1], precision: "year" };
    return { value: `${m[1]}-${m[2]}`, precision: "month" };
  }
  return { value: `${m[1]}-${m[2]}-${m[3]}`, precision: "day" };
}

// ---------------------------------------------------------------------------
// Counting items

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const recordedOk = (it: FolioItem): boolean => {
    const d = localDate(it.recorded);
    return !!d && d.length === 10 && d <= asOf;
  };
  const counted = items.filter((it) => it && isStr(it.id) && it.payload && typeof it.payload === "object" && recordedOk(it));
  const retracted = new Set<string>();
  for (const it of counted) {
    if (Array.isArray(it.retracts)) for (const r of it.retracts) if (isStr(r)) retracted.add(r);
    for (const e of Object.values(it.payload)) {
      if (e && e.type === "chart_correction" && Array.isArray(e.voided_items)) {
        for (const r of e.voided_items) if (isStr(r)) retracted.add(r);
      }
    }
  }
  const live = counted.filter((it) => !retracted.has(it.id));
  const superseded = new Set<string>();
  for (const it of live) if (Array.isArray(it.supersedes)) for (const s of it.supersedes) if (isStr(s)) superseded.add(s);
  return live.filter((it) => !superseded.has(it.id));
}

type Entry = { item: FolioItem; key: string; e: any };

function entries(items: FolioItem[], type: string): Entry[] {
  const out: Entry[] = [];
  for (const item of items) {
    for (const [key, e] of Object.entries(item.payload)) {
      if (e && typeof e === "object" && e.type === type) out.push({ item, key, e });
    }
  }
  return out;
}

function ev(list: Entry[]): Evidence {
  const seen = new Set<string>();
  const out: Evidence = [];
  for (const x of list) {
    const k = x.item.id + "#" + x.key;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ item_id: x.item.id, entry_id: x.key });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Drug names

const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", januvia: "sitagliptin", tradjenta: "linagliptin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", glucophage: "metformin", glucotrol: "glipizide",
  amaryl: "glimepiride", actos: "pioglitazone", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide",
  norvasc: "amlodipine", lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  pravachol: "pravastatin", zetia: "ezetimibe", zestril: "lisinopril", prinivil: "lisinopril",
  vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", cozaar: "losartan", diovan: "valsartan",
  benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan", kerendia: "finerenone",
  aldactone: "spironolactone", inspra: "eplerenone", lopressor: "metoprolol", toprol: "metoprolol",
  coreg: "carvedilol", tenormin: "atenolol", microzide: "hydrochlorothiazide", synthroid: "levothyroxine",
  levoxyl: "levothyroxine", prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole",
  pepcid: "famotidine", zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine",
  paxil: "paroxetine", effexor: "venlafaxine", cymbalta: "duloxetine", wellbutrin: "bupropion",
  remeron: "mirtazapine", seroquel: "quetiapine", abilify: "aripiprazole", zyprexa: "olanzapine",
  risperdal: "risperidone", buspar: "buspirone", xanax: "alprazolam", klonopin: "clonazepam", ativan: "lorazepam",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", eliquis: "apixaban", xarelto: "rivaroxaban",
  coumadin: "warfarin", plavix: "clopidogrel", neurontin: "gabapentin", lyrica: "pregabalin", zyloprim: "allopurinol",
  uloric: "febuxostat", keflex: "cephalexin", augmentin: "amoxicillin / clavulanate", tylenol: "acetaminophen",
  advil: "ibuprofen", motrin: "ibuprofen", aleve: "naproxen", zyrtec: "cetirizine", claritin: "loratadine",
  flonase: "fluticasone", suboxone: "buprenorphine / naloxone", subutex: "buprenorphine", vivitrol: "naltrexone",
  narcan: "naloxone", biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", truvada: "emtricitabine / tenofovir disoproxil",
  descovy: "emtricitabine / tenofovir alafenamide", entresto: "sacubitril / valsartan", jardiamet: "empagliflozin / metformin",
};

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "maleate", "besylate", "succinate", "tartrate",
  "mesylate", "citrate", "fumarate", "sulfate", "trihydrate", "monohydrate", "dihydrate", "anhydrous",
  "hyclate", "bromide", "acetate", "phosphate", "magnesium", "propionate", "furoate", "dipropionate",
  "xinafoate", "disodium", "hydrobromide", "malate", "medoxomil", "bisulfate", "sesquihydrate", "monosodium",
]);
const FORM_WORDS = new Set([
  "oral", "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "er", "xr", "xl", "sr", "dr", "ec",
  "extended", "delayed", "release", "pen", "injector", "injection", "injectable", "solution", "suspension",
  "inhaler", "inhalation", "aerosol", "metered", "dose", "topical", "cream", "ointment", "patch", "transdermal",
  "prefilled", "syringe", "auto-injector", "chewable", "disintegrating", "film", "coated", "nasal", "spray",
  "ophthalmic", "drops", "powder", "hfa", "kwikpen", "flexpen", "flextouch", "solostar", "mg", "mcg", "ml",
]);

function ingredientOfPart(part: string): string | undefined {
  let t = part.replace(/\[[^\]]*\]/g, " ").replace(/[(),]/g, " ").trim().toLowerCase();
  // leading quantity such as "3 ML" or "24 HR"
  t = t.replace(/^\d+(\.\d+)?\s*(ml|hr|actuat|unt)?\s+/, "");
  const toks = t.split(/\s+/).filter(Boolean);
  const words: string[] = [];
  for (const w of toks) {
    if (/^\d/.test(w)) break;
    words.push(w);
  }
  let ws = words.filter((w) => !FORM_WORDS.has(w));
  if (ws.length === 0) return undefined;
  if (BRANDS[ws[0]]) return BRANDS[ws[0]];
  const noSalt = ws.filter((w, i) => i === 0 || !SALTS.has(w));
  ws = noSalt.length ? noSalt : ws;
  return ws.join(" ");
}

function ingredientOf(drug: any): string | undefined {
  const name = drug && isStr(drug.name) ? drug.name : "";
  if (!name.trim()) return undefined;
  const bracket = /\[([^\]]+)\]/.exec(name);
  const parts: string[] = name.replace(/\[[^\]]*\]/g, " ").split(/\s+\/\s+|\s+and\s+/i);
  const ings = parts.map((p: string) => ingredientOfPart(p)).filter((x: string | undefined): x is string => !!x);
  if (ings.length === 0) {
    if (bracket) return BRANDS[bracket[1].trim().toLowerCase()] ?? undefined;
    return undefined;
  }
  return ings.join(" / ");
}

/** Single strength in the drug name, e.g. "losartan 50 MG Oral Tablet" → {50, mg}. */
function singleStrength(name: string): { value: number; unit: "mg" | "mcg" } | undefined {
  if (/\s\/\s/.test(name)) return undefined;
  const all = [...name.matchAll(/(\d+(?:\.\d+)?)\s*(MG|MCG|µG|UG)\b(?!\s*\/)/gi)];
  if (all.length !== 1) return undefined;
  if (/\d\s*(MG|MCG)\s*\/\s*(ML|ACTUAT|HR)/i.test(name)) return undefined;
  const u = all[0][2].toLowerCase();
  return { value: Number(all[0][1]), unit: u === "mg" ? "mg" : "mcg" };
}

function round(v: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(v * f) / f;
}

function medDose(e: any): MedicationRow["dose"] {
  const d = e.dose;
  if (!d || typeof d.value !== "number" || !isFinite(d.value) || !isStr(d.unit)) return undefined;
  const u = d.unit.trim().toLowerCase();
  if (u === "mg" || u === "milligrams" || u === "milligram") return { value: d.value, unit: "mg" };
  if (u === "mcg" || u === "µg" || u === "ug" || u === "micrograms" || u === "microgram") return { value: d.value, unit: "mcg" };
  if (u === "units" || u === "unit" || u === "u" || u === "iu") return { value: d.value, unit: "units" };
  if (u === "ml" || u === "cc") return { value: d.value, unit: "mL" };
  if (u === "tab" || u === "tabs" || u === "tablet" || u === "tablets") {
    const s = singleStrength(isStr(e.drug?.name) ? e.drug.name : "");
    if (s) return { value: round(d.value * s.value, 6), unit: s.unit };
    return { value: d.value, unit: "tablet" };
  }
  return undefined;
}

function medFrequency(e: any): MedicationRow["frequency"] {
  const sig = isStr(e.sig) ? e.sig.toLowerCase() : "";
  switch (e.frequency) {
    case "QD": return "QD";
    case "BID": return "BID";
    case "TID": return "TID";
    case "QHS": return "QHS";
    case "PRN": return "PRN";
    case "OTHER":
      if (/\b(once (a |per )?week|weekly|every week|every 7 days)\b/.test(sig)) return "QW";
      return "other";
  }
  return undefined;
}

const MH_DRUGS = /\b(sertraline|fluoxetine|escitalopram|citalopram|paroxetine|fluvoxamine|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|trazodone|vortioxetine|vilazodone|quetiapine|aripiprazole|olanzapine|risperidone|ziprasidone|lurasidone|haloperidol|clozapine|paliperidone|lithium|buspirone|alprazolam|clonazepam|lorazepam|amitriptyline|nortriptyline)\b/;
const SU_DRUGS = /\b(buprenorphine|naltrexone|methadone|disulfiram|acamprosate|naloxone|varenicline)\b/;
const HIV_DRUGS = /\b(bictegravir|dolutegravir|raltegravir|elvitegravir|cabotegravir|efavirenz|rilpivirine|darunavir|atazanavir|lopinavir|ritonavir|emtricitabine|lamivudine|zidovudine|abacavir|tenofovir)\b/;
const SRH_DRUGS = /\b(ethinyl estradiol|norethindrone|levonorgestrel|drospirenone|etonogestrel|norgestimate|desogestrel|ulipristal|medroxyprogesterone acetate 150)\b/;

function drugSensitivity(text: string, restricted: unknown): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  if (restricted === "BH") s.add("mental-health");
  const t = text.toLowerCase();
  if (MH_DRUGS.test(t)) s.add("mental-health");
  if (SU_DRUGS.test(t)) s.add("substance-use");
  if (HIV_DRUGS.test(t)) s.add("hiv-sti");
  if (SRH_DRUGS.test(t)) s.add("sexual-reproductive-health");
  return s.size ? [...s] : undefined;
}

// ---------------------------------------------------------------------------
// Medications

function medications(items: FolioItem[]): MedicationRow[] {
  const byLine = new Map<string, Entry[]>();
  for (const x of entries(items, "med_event")) {
    if (!isStr(x.e.med_id) || !x.e.drug || !isStr(x.e.drug.name)) continue;
    const list = byLine.get(x.e.med_id) ?? [];
    list.push(x);
    byLine.set(x.e.med_id, list);
  }
  const cmp = (a: Entry, b: Entry) => cmpEffective(a.item, b.item);
  const candidates: { row: MedicationRow; latest: Entry; key: string }[] = [];
  for (const list of byLine.values()) {
    list.sort(cmp);
    const latest = list[list.length - 1];
    const e = latest.e;
    let status: MedicationRow["status"];
    switch (e.action) {
      case "start": case "change": case "resume": status = "active"; break;
      case "hold": status = "held"; break;
      case "stop": status = "stopped"; break;
      default: status = "unknown";
    }
    // Event that began the current status.
    let since: Entry | undefined;
    if (status === "active") {
      for (let i = list.length - 1; i >= 0; i--) {
        const a = list[i].e.action;
        if (a === "start" || a === "resume") { since = list[i]; break; }
        if (a === "hold" || a === "stop") break;
      }
    } else if (status === "held") {
      since = latest;
      for (let i = list.length - 2; i >= 0 && list[i].e.action === "hold"; i--) since = list[i];
    } else if (status === "stopped") {
      since = latest;
    }
    const ingredient = ingredientOf(e.drug);
    const row: MedicationRow = {
      drug_name: e.drug.name,
      status,
      patient_reported: false,
      evidence: ev([...list].reverse()),
    };
    if (ingredient) row.ingredient = ingredient;
    const sd = since ? localDate(since.item.effective) : undefined;
    if (sd) row.status_since = sd;
    const dose = medDose(e);
    if (dose) row.dose = dose;
    const freq = medFrequency(e);
    if (freq) row.frequency = freq;
    if (status === "stopped" && isStr(e.stop_reason) &&
      ["adverse_reaction", "ineffective", "therapy_changed", "course_complete", "patient_choice", "other"].includes(e.stop_reason)) {
      row.stop_reason = e.stop_reason;
    }
    const reasonSrc = status === "active" ? since : latest;
    const rt = reasonSrc && isStr(reasonSrc.e.reason_text) && reasonSrc.e.reason_text.trim() ? reasonSrc.e.reason_text : undefined;
    if (rt) row.status_reason_text = rt;
    const restricted = list.some((x) => x.e.restricted === "BH") ? "BH" : undefined;
    const sens = drugSensitivity(`${e.drug.name} ${ingredient ?? ""}`, restricted);
    if (sens) row.sensitivity = sens;
    candidates.push({ row, latest, key: (ingredient ?? e.drug.name).toLowerCase() });
  }
  const best = new Map<string, { row: MedicationRow; latest: Entry }>();
  for (const c of candidates) {
    const cur = best.get(c.key);
    if (!cur || cmp(cur.latest, c.latest) < 0) best.set(c.key, c);
  }
  return [...best.values()].map((c) => c.row);
}

// ---------------------------------------------------------------------------
// Problems

function ckdStage(desc: string, icd: string): ProblemRow["ckd_stage"] {
  const d = desc.toLowerCase();
  const g = /\bg(1|2|3a|3b|4|5)\b/i.exec(desc);
  if (g) return ("G" + g[1].toLowerCase()) as ProblemRow["ckd_stage"];
  const st = /stage\s*(1|2|3a|3b|4|5|iiia|iiib|iv|v|ii|i)\b/i.exec(d);
  if (st) {
    const map: Record<string, ProblemRow["ckd_stage"]> = {
      "1": "G1", i: "G1", "2": "G2", ii: "G2", "3a": "G3a", iiia: "G3a", "3b": "G3b", iiib: "G3b",
      "4": "G4", iv: "G4", "5": "G5", v: "G5",
    };
    const v = map[st[1].toLowerCase()];
    if (v) return v;
  }
  if (/end[- ]stage/.test(d)) return "G5";
  const codeMap: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  return codeMap[icd.toUpperCase()];
}

function albuminuria(desc: string): ProblemRow["albuminuria"] {
  const d = desc.toLowerCase();
  const a = /\ba([123])\b/i.exec(desc);
  if (a) return ("A" + a[1]) as ProblemRow["albuminuria"];
  if (/severely increased albumin|macroalbuminuria|severe albuminuria/.test(d)) return "A3";
  if (/moderately increased albumin|microalbuminuria|moderate albuminuria/.test(d)) return "A2";
  if (/normal to mildly increased albumin/.test(d)) return "A1";
  return undefined;
}

function icdSensitivity(icd: string, restricted: unknown): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  if (restricted === "BH") s.add("mental-health");
  const c = icd.toUpperCase().replace(/\s/g, "");
  const m = /^([A-Z])(\d{2})/.exec(c);
  if (m) {
    const n = Number(m[2]);
    if (m[1] === "F" && n >= 10 && n <= 19) s.add("substance-use");
    else if (m[1] === "F" && n >= 20) s.add("mental-health");
    if ((m[1] === "B" && n === 20) || (m[1] === "Z" && n === 21) || (m[1] === "A" && n >= 50 && n <= 64)) s.add("hiv-sti");
    if (m[1] === "O" || (m[1] === "Z" && n >= 30 && n <= 39)) s.add("sexual-reproductive-health");
    if (m[1] === "Z" && n === 15) s.add("genetic");
  }
  return s.size ? [...s] : undefined;
}

/** "Adverse effect of <drug>" codes: T36–T50 with 5th/6th character 5. */
function isAdverseEffectCode(icd: string): boolean {
  return /^T(3[6-9]|4\d|50)\.[0-9A-Z]{2}5/i.test(icd.trim());
}

/** Drug or class named as cause in a problem description. */
function attributedDrug(desc: string): string | undefined {
  const pats = [
    /\badverse effect of\s+(.+?)(?:,|;|\(|$)/i,
    /\b(?:due to|caused by|induced by|secondary to|associated with|attributed to)\s+(.+?)(?:\s+(?:use|therapy|treatment|exposure))?(?:,|;|\(|$)/i,
    /\b([A-Za-z0-9-]+(?:\s+inhibitor)?)[- ](?:induced|associated|related)\b/i,
  ];
  for (const p of pats) {
    const m = p.exec(desc);
    if (m && m[1]) {
      const cand = m[1].trim().replace(/\.$/, "");
      if (cand && isDrugLike(cand)) return cand;
    }
  }
  return undefined;
}

const DRUG_SUFFIX = /(flozin|gliptin|glutide|pril|sartan|olol|dipine|statin|azole|mycin|cillin|^cef\w+|floxacin|cycline|prazole|tidine|semide|thiazide|thalidone|mab|tinib|parin|xaban|gatran|profen|fenac|oxacin|sulfa\w*|azepam|azolam|barbital|^(metformin|insulin|warfarin|lithium|valproate|valproic|allopurinol|isoniazid|amiodarone|prednisone|prednisolone|dexamethasone|methotrexate|hydralazine|clonidine|carbamazepine|phenytoin|lamotrigine|spironolactone|glipizide|glyburide|glimepiride|nitrofurantoin|trimethoprim|vancomycin|heparin|aspirin|acetaminophen|codeine|morphine|oxycodone|hydrocodone|tramadol|quetiapine|olanzapine|risperidone|haloperidol|sertraline|fluoxetine|citalopram|escitalopram|bupropion|gabapentin|pregabalin|terbinafine|minocycline|colchicine|febuxostat|pioglitazone|tirzepatide|finerenone))$/i;

function isDrugLike(s: string): boolean {
  const t = s.toLowerCase().trim();
  if (/inhibitor|blocker|antagonist|agonist|antibiotic|penicillin|sulfonamide|nsaid|statin|diuretic|opioid|steroid|chemotherapy|medication|drug/.test(t)) return true;
  const first = t.split(/\s+/)[0];
  if (BRANDS[first]) return true;
  return DRUG_SUFFIX.test(first) && !/^(disease|uncontrolled|type|hypertension|diabetes)$/.test(first);
}

function substanceName(raw: string): string {
  const ing = ingredientOfPart(raw);
  const isClass = /inhibitor|blocker|antagonist|agonist|antibiotic|penicillins|sulfonamide|nsaid|statins|diuretic|opioids|class/i.test(raw);
  if (!isClass && ing && raw.trim().split(/\s+/).length <= 3) return ing;
  return raw.trim();
}

function classifyReaction(text: string, fallback: AllergyIntoleranceRow["reaction_type"]): AllergyIntoleranceRow["reaction_type"] {
  const t = text.toLowerCase();
  if (/hive|urticaria|rash|angioedema|swelling|anaphyla|bronchospasm|wheez|pruritus|itch|stevens|sjs|ten\b|toxic epidermal|dress|hypersensitivity|blister/.test(t)) return "hypersensitivity";
  if (/ketoacidosis|pancreatitis|liver|hepat|kidney injury|renal failure|acute kidney|agranulocytosis|neutropenia|thrombocytopenia|rhabdo|myopathy|lactic acidosis|bleed|hemorrhage|hypoglycemi|hyperkalemi|qt prolong|arrhythm|seizure|fournier|gangrene|necrosis|failure|injury/.test(t)) return "serious_adverse_event";
  if (/cough|nausea|vomit|diarrhea|upset|dizz|drows|headache|fatigue|myalgia|muscle|constipation|edema|flushing|insomnia|dyspepsia|gi /.test(t)) return "side_effect";
  return fallback;
}

function problems(items: FolioItem[]): { rows: ProblemRow[]; drugAllergies: AllergyIntoleranceRow[] } {
  const byLine = new Map<string, Entry[]>();
  for (const x of entries(items, "problem_event")) {
    if (!isStr(x.e.problem_id)) continue;
    const list = byLine.get(x.e.problem_id) ?? [];
    list.push(x);
    byLine.set(x.e.problem_id, list);
  }
  const rows: ProblemRow[] = [];
  const drugAllergies: AllergyIntoleranceRow[] = [];
  for (const list of byLine.values()) {
    list.sort((a, b) => cmpEffective(a.item, b.item));
    let status: ProblemRow["status"] | "removed" | undefined;
    for (const x of list) {
      const a = x.e.action;
      if (a === "add") status = "active";
      else if (a === "resolve") status = "resolved";
      else if (a === "remove") status = "removed";
      else if (a === "update" && (status === undefined || status === "removed")) status = "active";
    }
    if (status === undefined || status === "removed") continue;
    // Latest wording/codes: from the latest event that restates them.
    const latest = list[list.length - 1];
    const e = latest.e;
    const desc = isStr(e.description) ? e.description : "";
    const icd = isStr(e.icd10cm) ? e.icd10cm.trim() : "";
    if (!desc && !icd) continue;
    const restricted = list.some((x) => x.e.restricted === "BH") ? "BH" : undefined;
    const sens = icdSensitivity(icd, restricted);
    const evidence = ev([...list].reverse());

    // Drug attribution.
    const adverseCodeOnly = icd && isAdverseEffectCode(icd);
    const drugRaw = attributedDrug(desc);
    if (drugRaw || adverseCodeOnly) {
      const subject = drugRaw ?? (/adverse effect of\s+(.+)/i.exec(desc)?.[1]?.trim() || desc);
      const condText = desc.replace(/\b(due to|caused by|induced by|secondary to|associated with|attributed to)\b.*$/i, "");
      const fallback: AllergyIntoleranceRow["reaction_type"] = "side_effect";
      const ar: AllergyIntoleranceRow = {
        substance: substanceName(subject),
        reaction_type: classifyReaction(condText || desc, fallback),
        mechanism: "unknown",
        criticality: "unknown",
        evidence,
      };
      const cond = condText.trim();
      if (cond && !/^adverse effect/i.test(cond)) ar.reaction = cond;
      const on = fuzzy(e.onset);
      if (on) ar.onset = on;
      if (sens) ar.sensitivity = sens;
      drugAllergies.push(ar);
      // A code naming only the adverse effect (no condition) gives the allergy row alone.
      if (/^adverse effect of/i.test(desc.trim()) || (adverseCodeOnly && !drugRaw && /adverse effect/i.test(desc))) continue;
    }

    const row: ProblemRow = { condition: desc || icd, status, evidence };
    if (icd) row.icd10cm = icd;
    if (isStr(e.snomed) && e.snomed.trim()) row.snomed = e.snomed.trim();
    const on = fuzzy(e.onset);
    if (on) row.onset = on;
    const isCkd = /^N18/i.test(icd) || /chronic kidney disease|\bckd\b/i.test(desc);
    if (isCkd) {
      // Most recently recorded category across the line's events.
      for (let i = list.length - 1; i >= 0; i--) {
        const st = ckdStage(isStr(list[i].e.description) ? list[i].e.description : "", isStr(list[i].e.icd10cm) ? list[i].e.icd10cm : "");
        if (st) { row.ckd_stage = st; break; }
      }
      for (let i = list.length - 1; i >= 0; i--) {
        const al = albuminuria(isStr(list[i].e.description) ? list[i].e.description : "");
        if (al) { row.albuminuria = al; break; }
      }
    }
    if (sens) row.sensitivity = sens;
    rows.push(row);
  }
  return { rows, drugAllergies };
}

// ---------------------------------------------------------------------------
// Allergies

function allergies(items: FolioItem[]): AllergyIntoleranceRow[] {
  const byLine = new Map<string, Entry[]>();
  for (const x of entries(items, "allergy_event")) {
    if (!isStr(x.e.allergy_id)) continue;
    const list = byLine.get(x.e.allergy_id) ?? [];
    list.push(x);
    byLine.set(x.e.allergy_id, list);
  }
  const rows: AllergyIntoleranceRow[] = [];
  for (const list of byLine.values()) {
    list.sort((a, b) => cmpEffective(a.item, b.item));
    const latest = list[list.length - 1];
    const e = latest.e;
    if (e.action === "inactivate") continue;
    const sub = e.substance;
    if (!sub || !isStr(sub.name) || !sub.name.trim()) continue;
    const isDrug = isStr(sub.rxnorm) && sub.rxnorm.trim() !== "";
    let substance = sub.name.trim();
    if (isDrug) {
      const ing = ingredientOf({ name: substance });
      if (ing && !/\s\/\s/.test(ing)) substance = ing;
      else substance = substance.toLowerCase();
    }
    const reactions: string[] = Array.isArray(e.reactions) ? e.reactions.filter(isStr) : [];
    const rtext = reactions.join("; ");
    let reaction_type: AllergyIntoleranceRow["reaction_type"];
    let mechanism: AllergyIntoleranceRow["mechanism"];
    const hyper = classifyReaction(rtext, "side_effect") === "hypersensitivity";
    if (e.reaction_type === "allergy") {
      reaction_type = hyper ? "hypersensitivity" : rtext ? classifyReaction(rtext, "hypersensitivity") : "hypersensitivity";
      mechanism = hyper ? "immune" : "unknown";
    } else if (e.reaction_type === "intolerance") {
      reaction_type = hyper ? "hypersensitivity" : classifyReaction(rtext, "side_effect") === "serious_adverse_event" ? "serious_adverse_event" : "side_effect";
      mechanism = "non_immune";
    } else if (e.reaction_type === "adverse_reaction") {
      reaction_type = hyper ? "hypersensitivity" : "serious_adverse_event";
      mechanism = hyper ? "unknown" : "non_immune";
    } else {
      reaction_type = classifyReaction(rtext, "hypersensitivity");
      mechanism = "unknown";
    }
    const criticality: AllergyIntoleranceRow["criticality"] =
      e.severity === "high" ? "high" : e.severity === "low" ? "low" : "unknown";
    const row: AllergyIntoleranceRow = {
      substance,
      reaction_type,
      mechanism,
      criticality,
      evidence: ev([...list].reverse()),
    };
    if (isDrug && /^\d+$/.test(sub.rxnorm.trim())) row.rxnorm_ingredient = sub.rxnorm.trim();
    if (rtext) row.reaction = rtext;
    const on = fuzzy(e.onset);
    if (on) row.onset = on;
    const sens = drugSensitivity(substance, undefined);
    if (sens) row.sensitivity = sens;
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Labs

const ANALYTE_UNIT: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

const LOINC_ANALYTE: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine",
  "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "62238-1": "egfr", "98979-8": "egfr", "88293-6": "egfr", "88294-4": "egfr", "50044-7": "egfr", "50210-4": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "1959-6": "bicarbonate", "33037-3": "anion_gap", "1863-0": "anion_gap", "10466-1": "anion_gap",
  "3094-0": "bun", "6299-2": "bun", "2345-7": "glucose", "2339-0": "glucose", "1558-6": "glucose",
  "4548-4": "a1c", "17856-6": "a1c", "9318-7": "uacr", "14959-1": "uacr", "32294-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin",
  "53060-9": "bhb", "47571-5": "bhb", "2744-1": "ph", "11558-4": "ph", "2019-8": "pco2", "11557-6": "pco2",
  "3040-3": "lipase", "10839-9": "troponin", "42757-5": "troponin", "49563-0": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
};

function analyteOf(test: any, resultCode: string): Analyte | undefined {
  const code = (isStr(test?.nfm_code) ? test.nfm_code : "").toUpperCase();
  const name = (isStr(test?.name) ? test.name : "").toLowerCase();
  const rc = resultCode.toUpperCase();
  const s = `${code} ${rc} ${name}`;
  // Urine and ratio tests first so "creatinine" in UACR names doesn't misfire.
  if (/UACR|ALB\/CREAT|MALB|ACR\b/.test(code + " " + rc) || /albumin.*creatinine|microalbumin.*ratio|albumin\/creat/.test(name)) return "uacr";
  if (/urine|\bur\b|random urine/.test(name)) return undefined;
  if (/EGFR|GFR/.test(code) || /\begfr\b|glomerular/.test(name)) return "egfr";
  if (/^CREAT/.test(code) || /^creatinine\b/.test(name)) return "creatinine";
  if (/^(K|POT)$/.test(code) || /^potassium\b/.test(name)) return "potassium";
  if (/^(NA|SOD)$/.test(code) || /^sodium\b/.test(name)) return "sodium";
  if (/^(CL|CHLOR)$/.test(code) || /^chloride\b/.test(name)) return "chloride";
  if (/^(CO2|HCO3|BICARB|TCO2)$/.test(code) || /^(bicarbonate|carbon dioxide|co2, total|total co2)/.test(name)) return "bicarbonate";
  if (/^(AGAP|AG|ANION)/.test(code) || /anion gap/.test(name)) return "anion_gap";
  if (/^(BUN|UREA)/.test(code) || /urea nitrogen|^bun\b/.test(name)) return "bun";
  if (/^(A1C|HBA1C|HGBA1C)/.test(code) || /a1c/.test(name)) return "a1c";
  if (/^(GLU|GLUC)/.test(code) || /^glucose\b/.test(name)) {
    if (/meter|poc|fingerstick|capillary/.test(name)) return undefined;
    return "glucose";
  }
  if (/^(PLT|PLAT)/.test(code) || /^platelet/.test(name)) return "platelets";
  if (/^(WBC)/.test(code) || /white blood|^wbc\b|leukocyte/.test(name)) return "wbc";
  if (/^(HGB|HB)$/.test(code) || /^hemoglobin\b(?!\s*a1c)/.test(name)) return "hemoglobin";
  if (/^(BHB)/.test(code) || /hydroxybutyrate/.test(name)) return "bhb";
  if (/^PH$/.test(code) || /^ph\b/.test(name)) return "ph";
  if (/^(PCO2)/.test(code) || /pco2/.test(name)) return "pco2";
  if (/^(LIP|LIPASE)/.test(code) || /^lipase/.test(name)) return "lipase";
  if (/^(TROP|TNI)/.test(code) || /troponin/.test(name)) {
    if (/troponin t\b/.test(name) || /TNT/.test(code)) return undefined;
    return "troponin";
  }
  if (/^(HDL)/.test(code) || /\bhdl\b/.test(name)) return "hdl";
  if (/^(LDL)/.test(code) || /\bldl\b/.test(name)) return "ldl";
  if (/^(TRIG|TG)/.test(code) || /triglyceride/.test(name)) return "triglycerides";
  if (/^(CHOL|TCHOL)/.test(code) || /^cholesterol(, total)?$|total cholesterol/.test(name)) return "cholesterol";
  void s;
  return undefined;
}

function normUnit(u: string): string {
  return u.replace(/\s+/g, "").replace(/µ/g, "u").toLowerCase();
}

/** Converts value from the filed unit to the analyte's unit; undefined when the unit is not understood. */
function convert(analyte: Analyte, v: number, unitRaw: string): number | undefined {
  const u = normUnit(unitRaw);
  switch (analyte) {
    case "creatinine":
      if (u === "mg/dl") return v;
      if (u === "umol/l") return round(v / 88.42, 2);
      return undefined;
    case "egfr":
      if (/^ml\/min(\/1\.73m\^?2|\/1\.73m2|\/1\.73)?$/.test(u)) return v;
      return undefined;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap": case "bhb":
      if (u === "mmol/l" || u === "meq/l") return v;
      return undefined;
    case "bun":
      if (u === "mg/dl") return v;
      return undefined;
    case "glucose":
      if (u === "mg/dl") return v;
      if (u === "mmol/l") return Math.round(v * 18.016);
      return undefined;
    case "a1c":
      if (u === "%" || u === "%hba1c" || u === "%ofhgb" || u === "%oftotalhgb") return v;
      return undefined;
    case "uacr":
      if (u === "mg/g" || u === "mg/gcreat" || u === "mg/gcr" || u === "ug/mgcreat" || u === "ug/mg" || u === "mcg/mgcreat" || u === "mcg/mg") return v;
      if (u === "mg/mmol" || u === "mg/mmolcreat") return round(v * 8.84, 1);
      return undefined;
    case "platelets": case "wbc":
      if (u === "cells/ul" || u === "/ul" || u === "cells/mm3" || u === "/mm3") return round(v / 1000, 3);
      if (u === "k/ul" || u === "10*3/ul" || u === "x10e3/ul" || u === "10^3/ul" || u === "thou/ul" || u === "x10^3/ul" || u === "10*9/l" || u === "x10^9/l" || u === "10^9/l") return v;
      return undefined;
    case "hemoglobin":
      if (u === "g/dl") return v;
      if (u === "g/l") return round(v / 10, 1);
      return undefined;
    case "ph":
      if (u === "" || u === "[ph]" || u === "ph" || u === "units") return v;
      return undefined;
    case "pco2":
      if (u === "mmhg" || u === "mm[hg]") return v;
      return undefined;
    case "lipase":
      if (u === "u/l" || u === "iu/l") return v;
      return undefined;
    case "troponin":
      if (u === "ng/ml" || u === "ug/l") return v;
      if (u === "ng/l" || u === "pg/ml") return round(v / 1000, 4);
      return undefined;
    case "cholesterol": case "triglycerides": case "hdl": case "ldl":
      if (u === "mg/dl") return v;
      return undefined;
  }
  return undefined;
}

function egfrEquation(e: any): LabResultRow["egfr_equation"] {
  const text = `${isStr(e.comment) ? e.comment : ""} ${isStr(e.test?.name) ? e.test.name : ""}`.toLowerCase();
  const rc = isStr(e.external_ref?.result_code) ? e.external_ref.result_code.toUpperCase() : "";
  const code = isStr(e.test?.nfm_code) ? e.test.nfm_code.toUpperCase() : "";
  if (/ckd[- ]?epi\s*\(?2021|2021 ckd[- ]?epi|race[- ]free/.test(text)) return "ckd-epi-2021";
  if (/ckd[- ]?epi\s*\(?2009|2009 ckd[- ]?epi/.test(text)) return "ckd-epi-2009";
  if (/mdrd/.test(text)) return "mdrd";
  if (/EGFR21|EGFR-?2021|EPI21/.test(rc + " " + code)) return "ckd-epi-2021";
  if (/EGFR09|EGFR-?2009|EPI09/.test(rc + " " + code)) return "ckd-epi-2009";
  if (/MDRD/.test(rc + " " + code)) return "mdrd";
  return "unknown";
}

/** eGFR variant that applies a race coefficient (the African American value). */
function isRaceVariant(e: any): boolean {
  const name = isStr(e.test?.name) ? e.test.name.toLowerCase() : "";
  const code = isStr(e.test?.nfm_code) ? e.test.nfm_code.toUpperCase() : "";
  const rc = isStr(e.external_ref?.result_code) ? e.external_ref.result_code.toUpperCase() : "";
  const loinc = isStr(e.test?.loinc) ? e.test.loinc : "";
  if (/non[- ]?african|non[- ]?black|non-aa/.test(name)) return false;
  if (/african american|\bblack\b/.test(name)) return true;
  if (/(^|-)AA$/.test(code) || /EGFR\d*A$/.test(rc)) return true;
  if (loinc === "48643-1" || loinc === "88293-6") return true;
  return false;
}

function labs(items: FolioItem[]): LabResultRow[] {
  type Cand = { x: Entry; analyte: Analyte; value: number; comparator?: LabResultRow["comparator"] };
  const groups = new Map<string, Cand[]>();
  for (const x of entries(items, "imported_result")) {
    const e = x.e;
    if (!e.test || !isStr(e.value)) continue;
    const rc = isStr(e.external_ref?.result_code) ? e.external_ref.result_code : "";
    const analyte = analyteOf(e.test, rc);
    if (!analyte) continue;
    if (analyte === "egfr" && isRaceVariant(e)) continue;
    const m = /^\s*(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?|-?\.\d+)\s*$/.exec(e.value);
    if (!m) continue; // invalidated, hemolyzed, not performed, or other words
    const num = Number(m[2]);
    if (!isFinite(num)) continue;
    const unit = isStr(e.unit) ? e.unit : "";
    const value = convert(analyte, num, unit);
    if (value === undefined) continue;
    const acc = isStr(e.external_ref?.accession) ? e.external_ref.accession : `item:${x.item.id}`;
    const collected = isStr(e.collected) ? e.collected : x.item.effective;
    const key = `${acc}|${rc || (isStr(e.test.nfm_code) ? e.test.nfm_code : "")}|${isStr(e.test.nfm_code) ? e.test.nfm_code : ""}|${collected}`;
    const c: Cand = { x, analyte, value };
    if (m[1]) c.comparator = m[1] as LabResultRow["comparator"];
    const list = groups.get(key) ?? [];
    list.push(c);
    groups.set(key, list);
  }
  const rank = (s: unknown) => (s === "C" ? 2 : s === "F" ? 2 : s === "P" ? 1 : 0);
  const rows: LabResultRow[] = [];
  for (const list of groups.values()) {
    list.sort((a, b) => {
      const r = rank(a.x.e.result_status) - rank(b.x.e.result_status);
      if (r) return r;
      const ra = Date.parse(a.x.item.recorded), rb = Date.parse(b.x.item.recorded);
      if (!isNaN(ra) && !isNaN(rb) && ra !== rb) return ra - rb;
      return a.x.item.id < b.x.item.id ? -1 : 1;
    });
    const best = list[list.length - 1];
    const e = best.x.e;
    const collected = toRfc3339(isStr(e.collected) ? e.collected : best.x.item.effective);
    if (!collected) continue;
    const row: LabResultRow = {
      analyte: best.analyte,
      value: best.value,
      unit: ANALYTE_UNIT[best.analyte],
      collected,
      status: e.result_status === "P" ? "preliminary" : "final",
      evidence: ev([best.x, ...list.slice(0, -1).reverse().map((c) => c.x)]),
    };
    if (best.comparator) row.comparator = best.comparator;
    if (best.analyte === "egfr") row.egfr_equation = egfrEquation(e);
    if (isStr(e.test.loinc) && e.test.loinc.trim()) row.loinc = e.test.loinc.trim();
    rows.push(row);
  }
  rows.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : a.analyte < b.analyte ? -1 : 1));
  return rows;
}

// ---------------------------------------------------------------------------
// Vitals

function parseBp(s: unknown): [number, number] | undefined {
  if (!isStr(s)) return undefined;
  const m = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(s);
  if (!m) return undefined;
  return [Number(m[1]), Number(m[2])];
}

function num(x: unknown): number | undefined {
  return typeof x === "number" && isFinite(x) ? x : undefined;
}

function vitals(items: FolioItem[]): VitalRow[] {
  const rows: VitalRow[] = [];
  for (const x of entries(items, "vital_set")) {
    const e = x.e;
    const lp = localParts(x.item.effective) ?? localParts(x.item.recorded);
    if (!lp) continue;
    const local_time = lp.time ? `${lp.date}T${lp.time.slice(0, 5)}` : undefined;
    if (!local_time) continue;
    const row: VitalRow = { setting: "clinic", local_time, evidence: [{ item_id: x.item.id, entry_id: x.key }] };
    const bp = parseBp(e.bp);
    const rep = parseBp(e.bp_repeat);
    if (bp) {
      row.systolic_mmhg = bp[0];
      row.diastolic_mmhg = bp[1];
      if (rep) {
        row.repeat_systolic_mmhg = rep[0];
        row.repeat_diastolic_mmhg = rep[1];
      }
    } else if (rep) {
      row.systolic_mmhg = rep[0];
      row.diastolic_mmhg = rep[1];
    }
    const pulse = num(e.pulse_bpm);
    if (pulse !== undefined) row.pulse_bpm = pulse;
    const wt = num(e.weight_lb);
    if (wt !== undefined) row.weight_kg = round(wt * 0.45359237, 1);
    if (row.systolic_mmhg === undefined && row.pulse_bpm === undefined && row.weight_kg === undefined) continue;
    rows.push(row);
  }
  rows.sort((a, b) => (a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 : 0));
  return rows;
}

// ---------------------------------------------------------------------------

function safe<T>(f: () => T[]): T[] {
  try {
    return f();
  } catch {
    return [];
  }
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const list = Array.isArray(items) ? items.filter((i) => i && typeof i === "object") : [];
  let counting: FolioItem[] = [];
  try {
    counting = countingItems(list, asOf);
  } catch {
    counting = [];
  }
  let prob: { rows: ProblemRow[]; drugAllergies: AllergyIntoleranceRow[] } = { rows: [], drugAllergies: [] };
  try {
    prob = problems(counting);
  } catch {
    /* skip */
  }
  const allergyRows = safe(() => allergies(counting));
  const have = new Set(allergyRows.map((a) => a.substance.toLowerCase()));
  for (const a of prob.drugAllergies) {
    if (have.has(a.substance.toLowerCase())) continue;
    have.add(a.substance.toLowerCase());
    allergyRows.push(a);
  }
  return {
    medications: safe(() => medications(counting)),
    problems: prob.rows,
    allergies: allergyRows,
    labs: safe(() => labs(counting)),
    vitals: safe(() => vitals(counting)),
  };
}
