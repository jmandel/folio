import type { FolioItem, ViewRows, MedicationRow, VitalRow, Evidence, Sensitivity } from "../in/views/views";

const TZ = "America/Chicago";

function chicagoDate(iso: string): string | undefined {
  const t = Date.parse(iso);
  if (isNaN(t)) {
    return /^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10) : undefined;
  }
  try {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(t));
    const g = (k: string) => parts.find((p) => p.type === k)?.value ?? "";
    return `${g("year")}-${g("month")}-${g("day")}`;
  } catch {
    return iso.slice(0, 10);
  }
}

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const counting = items.filter((i) => {
    if (!i || typeof i.id !== "string" || typeof i.recorded !== "string") return false;
    const d = chicagoDate(i.recorded);
    return d !== undefined && d <= asOf;
  });
  const byId = new Map<string, FolioItem>();
  for (const i of items) if (i && typeof i.id === "string") byId.set(i.id, i);
  const dead = new Set<string>();
  const walk = (id: string) => {
    if (dead.has(id)) return;
    dead.add(id);
    const it = byId.get(id);
    for (const s of it?.supersedes ?? []) walk(s);
  };
  for (const c of counting) {
    for (const s of c.supersedes ?? []) walk(s);
    for (const r of c.retracts ?? []) dead.add(r);
  }
  return counting.filter((i) => !dead.has(i.id));
}

// ---------- ingredients ----------

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  glucotrol: "glipizide", crestor: "rosuvastatin", lipitor: "atorvastatin", zocor: "simvastatin",
  pravachol: "pravastatin", synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine",
  farxiga: "dapagliflozin", jardiance: "empagliflozin", invokana: "canagliflozin", januvia: "sitagliptin",
  tradjenta: "linagliptin", ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide",
  victoza: "liraglutide", trulicity: "dulaglutide", mounjaro: "tirzepatide", lantus: "insulin glargine",
  basaglar: "insulin glargine", toujeo: "insulin glargine", levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", novolog: "insulin aspart", humulin: "insulin human", novolin: "insulin human",
  lasix: "furosemide", bumex: "bumetanide", aldactone: "spironolactone", microzide: "hydrochlorothiazide",
  hctz: "hydrochlorothiazide", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan",
  altace: "ramipril", vasotec: "enalapril", lotensin: "benazepril", tenormin: "atenolol", lopressor: "metoprolol",
  toprol: "metoprolol", coreg: "carvedilol", catapres: "clonidine", plavix: "clopidogrel", eliquis: "apixaban",
  xarelto: "rivaroxaban", coumadin: "warfarin", jantoven: "warfarin", zyloprim: "allopurinol",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", pepcid: "famotidine",
  zantac: "ranitidine", zyrtec: "cetirizine", claritin: "loratadine", allegra: "fexofenadine",
  benadryl: "diphenhydramine", tylenol: "acetaminophen", paracetamol: "acetaminophen", advil: "ibuprofen",
  motrin: "ibuprofen", aleve: "naproxen", naprosyn: "naproxen", bayer: "aspirin", ecotrin: "aspirin",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", flovent: "fluticasone", advair: "fluticasone / salmeterol",
  singulair: "montelukast", zoloft: "sertraline", lexapro: "escitalopram", celexa: "citalopram", prozac: "fluoxetine",
  paxil: "paroxetine", wellbutrin: "bupropion", effexor: "venlafaxine", cymbalta: "duloxetine", desyrel: "trazodone",
  seroquel: "quetiapine", zyprexa: "olanzapine", abilify: "aripiprazole", risperdal: "risperidone", lamictal: "lamotrigine",
  depakote: "valproate", lithobid: "lithium", ativan: "lorazepam", xanax: "alprazolam", klonopin: "clonazepam",
  valium: "diazepam", ambien: "zolpidem", neurontin: "gabapentin", lyrica: "pregabalin", ultram: "tramadol",
  norco: "hydrocodone / acetaminophen", percocet: "oxycodone / acetaminophen", oxycontin: "oxycodone",
  suboxone: "buprenorphine / naloxone", subutex: "buprenorphine", zubsolv: "buprenorphine / naloxone",
  vivitrol: "naltrexone", revia: "naltrexone", flexeril: "cyclobenzaprine", deltasone: "prednisone",
  medrol: "methylprednisolone", amoxil: "amoxicillin", augmentin: "amoxicillin / clavulanate", zithromax: "azithromycin",
  cipro: "ciprofloxacin", bactrim: "sulfamethoxazole / trimethoprim", keflex: "cephalexin", flagyl: "metronidazole",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", truvada: "emtricitabine / tenofovir disoproxil",
  descovy: "emtricitabine / tenofovir alafenamide", tivicay: "dolutegravir", viagra: "sildenafil", cialis: "tadalafil",
  fosamax: "alendronate", premarin: "estrogens, conjugated", estrace: "estradiol", provera: "medroxyprogesterone",
  imdur: "isosorbide mononitrate", nitrostat: "nitroglycerin", lanoxin: "digoxin", cordarone: "amiodarone",
  zetia: "ezetimibe", tricor: "fenofibrate", renvela: "sevelamer", sensipar: "cinacalcet", kerendia: "finerenone",
  entresto: "sacubitril / valsartan", cardizem: "diltiazem", calan: "verapamil", procardia: "nifedipine",
  apresoline: "hydralazine", glucotrol_xl: "glipizide", amaryl: "glimepiride", actos: "pioglitazone",
  flomax: "tamsulosin", proscar: "finasteride", detrol: "tolterodine", vitamind: "cholecalciferol",
};

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "calcium", "potassium", "maleate", "besylate", "tartrate", "succinate",
  "sulfate", "mesylate", "phosphate", "acetate", "citrate", "fumarate", "bromide", "trihydrate", "hydrobromide",
  "dihydrate", "monohydrate", "magnesium", "hemihydrate", "bitartrate", "medoxomil", "axetil", "propionate",
]);
const FORMS = new Set([
  "oral", "tablet", "tablets", "capsule", "capsules", "pen", "injection", "inhaler", "solution", "suspension",
  "extended", "release", "delayed", "er", "xr", "sr", "dr", "cream", "ointment", "patch", "mg", "mcg", "unit", "units", "ml",
]);

function cleanName(raw: string): string {
  const toks = raw.toLowerCase().replace(/\(.*?\)/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const t of toks) {
    if (/\d/.test(t)) break;
    if (FORMS.has(t)) break;
    out.push(t);
  }
  const kept = out.filter((t) => !SALTS.has(t));
  return (kept.length ? kept : out).join(" ").trim();
}

function ingredientOf(m: any): { ingredient?: string; rx?: string } {
  const pick = m.picked_from_search;
  if (pick && typeof pick.display === "string") {
    const ing = cleanName(pick.display);
    // ingredient-level when the display carries no strength/form
    const ingLevel = !/\d/.test(pick.display) && !/\b(tablet|capsule|inhal|injection|solution|pen)\b/i.test(pick.display);
    if (ing) return { ingredient: ing, rx: ingLevel && typeof pick.rxnorm === "string" ? pick.rxnorm : undefined };
  }
  const name = typeof m.name === "string" ? m.name : "";
  const first = name.toLowerCase().replace(/[^a-z0-9 \/-]/g, " ").trim().split(/\s+/)[0] ?? "";
  if (BRANDS[first]) return { ingredient: BRANDS[first] };
  const cleaned = cleanName(name);
  if (!cleaned || /\b(pill|pills|medicine|medication|tablet|my|water|blood|sugar|thinner|stuff|thing)\b/.test(cleaned)) return {};
  return { ingredient: cleaned };
}

// ---------- dose / frequency ----------

const NUMW: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5 };

function parseDose(strength: string | undefined, how: string | undefined): MedicationRow["dose"] {
  const h = (how ?? "").toLowerCase();
  if (/\d\s*(or|to|-|–)\s*\d|\b(one|two|three) or (one|two|three)\b/.test(h)) return undefined;
  if (/sliding|depend|per (my )?(sugar|glucose)|based on|as directed|varies/.test(h)) return undefined;
  const normUnit = (u: string): "mg" | "mcg" | "units" | "mL" | undefined => {
    u = u.toLowerCase();
    if (/^(mg|milligrams?)$/.test(u)) return "mg";
    if (/^(mcg|µg|μg|ug|micrograms?)$/.test(u)) return "mcg";
    if (/^(u|iu|units?)$/.test(u)) return "units";
    if (/^(ml|cc)$/.test(u)) return "mL";
    return undefined;
  };
  // explicit amount in directions
  const ex = h.match(/(\d+(?:\.\d+)?)\s*(mg|milligrams?|mcg|µg|μg|ug|micrograms?|units?|iu|ml|cc)\b(?!\s*\/)/);
  if (ex) {
    const u = normUnit(ex[2]);
    if (u) return { value: Number(ex[1]), unit: u };
  }
  let s: { v: number; u: "mg" | "mcg" | "units" | "mL" } | undefined;
  const st = (strength ?? "").toLowerCase();
  const sm = st.match(/(\d+(?:\.\d+)?)\s*(mg|milligrams?|mcg|µg|μg|ug|micrograms?|g|grams?|units?|iu)\b(?!\s*\/)/);
  if (sm && !/\d\s*\/\s*\d/.test(st)) {
    if (/^g/.test(sm[2]) && !/^(mg)/.test(sm[2])) s = { v: Number(sm[1]) * 1000, u: "mg" };
    else {
      const u = normUnit(sm[2]);
      if (u) s = { v: Number(sm[1]), u };
    }
  }
  let count: number | undefined;
  const cm = h.match(/(\d+(?:\.\d+)?|one|two|three|four|half)\s*(?:of\s+)?(?:a\s+)?(tablets?|tabs?|capsules?|caps?|pills?|puffs?|sprays?)\b/);
  if (cm) count = NUMW[cm[1]] ?? Number(cm[1]);
  else if (/\bhalf (a )?(tablet|pill|tab)/.test(h)) count = 0.5;
  if (s) {
    const v = Math.round(s.v * (count ?? 1) * 1000) / 1000;
    return { value: v, unit: s.u };
  }
  if (count !== undefined && cm && /tab|pill|cap/.test(cm[2])) return { value: count, unit: "tablet" };
  return undefined;
}

function parseFreq(how: string | undefined): MedicationRow["frequency"] {
  const h = (how ?? "").toLowerCase();
  if (!h) return undefined;
  if (/as needed|\bprn\b|when needed|if needed|when i need/.test(h)) return "PRN";
  if (/weekly|once a week|every week|per week/.test(h)) return "QW";
  if (/four times|4 times|every 6 hours|every other day|monthly|once a month|taper|every 4 hours|qid/.test(h)) return "other";
  if (/three times|3 times|every 8 hours|\btid\b|morning,? (noon|midday|lunch|afternoon).*(evening|supper|dinner|night|bedtime)/.test(h)) return "TID";
  if (/twice|2 times|two times|every 12 hours|\bbid\b|(morning|breakfast|am).*\band\b.*(supper|dinner|evening|night|bedtime|lunch|noon)|(supper|dinner|evening|night|bedtime|lunch).*\band\b.*(morning|breakfast)/.test(h)) return "BID";
  if (/bedtime|at night|nightly|before bed|\bqhs\b|\bhs\b/.test(h)) return "QHS";
  if (/daily|once|every day|each day|morning|evening|noon|lunch|supper|dinner|breakfast|\bqd\b|afternoon/.test(h)) return "QD";
  return undefined;
}

function stopReason(note: string | undefined): MedicationRow["stop_reason"] {
  const n = (note ?? "").toLowerCase();
  if (!n) return undefined;
  if (/rash|hives|side effect|reaction|allerg|nause|dizz|cough|swell|upset|made me (sick|feel)|bad effect/.test(n)) return "adverse_reaction";
  if (/didn'?t work|not working|ineffective|no effect|wasn'?t helping|did not help|didn'?t help/.test(n)) return "ineffective";
  if (/switched|replaced|changed to|instead|new (dose|medicine|med)|swapped/.test(n)) return "therapy_changed";
  if (/course|finished|completed|done with/.test(n)) return "course_complete";
  if (/i (decided|chose)|my choice|didn'?t want|do not want|don'?t want/.test(n)) return "patient_choice";
  return "other";
}

const SENS: Array<[RegExp, Sensitivity]> = [
  [/quetiapine|olanzapine|aripiprazole|risperidone|lithium|lamotrigine|sertraline|escitalopram|citalopram|fluoxetine|paroxetine|bupropion|venlafaxine|duloxetine|trazodone|lorazepam|alprazolam|clonazepam|diazepam|haloperidol|buspirone|mirtazapine|ziprasidone|lurasidone|clozapine|amitriptyline|nortriptyline|valproate|divalproex|zolpidem/, "mental-health"],
  [/buprenorphine|naltrexone|methadone|disulfiram|acamprosate|nicotine|varenicline/, "substance-use"],
  [/ethinyl|norethindrone|levonorgestrel|drospirenone|medroxyprogesterone|estradiol|misoprostol|mifepristone|sildenafil|tadalafil|norgestimate|etonogestrel|clomiphene|letrozole/, "sexual-reproductive-health"],
  [/emtricitabine|tenofovir|bictegravir|dolutegravir|efavirenz|raltegravir|darunavir|abacavir|lamivudine|rilpivirine|zidovudine|ritonavir|cabotegravir|doxycycline.*pep/, "hiv-sti"],
];

function sensitivityOf(ing: string | undefined, name: string): Sensitivity[] | undefined {
  const s = `${ing ?? ""} ${name.toLowerCase()}`;
  const out: Sensitivity[] = [];
  for (const [re, t] of SENS) if (re.test(s) && !out.includes(t)) out.push(t);
  return out.length ? out : undefined;
}

function dateKey(d: string | undefined): string {
  if (!d) return "";
  const m = d.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!m) return "";
  return `${m[1]}-${m[2] ?? "00"}-${m[3] ?? "00"}`;
}

function validPartial(d: unknown): d is string {
  return typeof d === "string" && /^\d{4}(-\d{2}(-\d{2})?)?$/.test(d);
}

// ---------- medications ----------

function medications(items: FolioItem[]): MedicationRow[] {
  const lists = items
    .filter((i) => i.payload && Object.values(i.payload).some((e: any) => e && e.type === "my_med"))
    .sort((a, b) => (Date.parse(a.recorded) - Date.parse(b.recorded)) || (a.id < b.id ? -1 : 1));
  const latest = lists[lists.length - 1];
  if (!latest) return [];
  const byIng = new Map<string, { row: MedicationRow; key: string; order: number }>();
  let order = 0;
  for (const [eid, e] of Object.entries<any>(latest.payload)) {
    if (!e || e.type !== "my_med" || typeof e.name !== "string") continue;
    const { ingredient, rx } = ingredientOf(e);
    const note: string | undefined = typeof e.note === "string" && e.note.trim() ? e.note : undefined;
    const held = !!note && /\b(paus|on hold|hold|holding|temporar|for now|for the time|resum|break from|until)/i.test(note);
    let status: MedicationRow["status"] = e.status === "stopped" ? "stopped" : "active";
    if (held) status = "held";
    const started = validPartial(e.started) ? e.started : undefined;
    const stopped = validPartial(e.stopped) ? e.stopped : undefined;
    const row: MedicationRow = {
      drug_name: e.name,
      status,
      patient_reported: true,
      evidence: [{ item_id: latest.id, entry_id: eid }],
    };
    if (ingredient) row.ingredient = ingredient;
    if (rx) row.rxnorm_ingredient = rx;
    const since = status === "active" ? started : stopped;
    if (since) row.status_since = since;
    const dose = parseDose(e.strength_text, e.how_i_take_it);
    if (dose) row.dose = dose;
    const fr = parseFreq(e.how_i_take_it);
    if (fr) row.frequency = fr;
    if (status === "stopped") {
      const sr = stopReason(note);
      if (sr) row.stop_reason = sr;
    }
    if (status !== "active" && note) row.status_reason_text = note;
    if (e.kind === "over_the_counter") row.otc = true;
    const sens = sensitivityOf(ingredient, e.name);
    if (sens) row.sensitivity = sens;

    const key = dateKey(status === "active" ? started : stopped) || dateKey(started);
    const k = ingredient ?? `name:${e.name.toLowerCase()}`;
    const prev = byIng.get(k);
    if (!prev) byIng.set(k, { row, key, order: order++ });
    else {
      const better = key > prev.key || (key === prev.key && row.status === "active" && prev.row.status !== "active");
      if (better) byIng.set(k, { row, key, order: prev.order });
    }
  }
  return [...byIng.values()].sort((a, b) => a.order - b.order).map((x) => x.row);
}

// ---------- vitals ----------

function minutes(ldt: string): number | undefined {
  const m = ldt.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return undefined;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) / 60000;
}
const ldt = (s: string) => s.slice(0, 16);

function vitals(items: FolioItem[]): VitalRow[] {
  type Cand = { row: VitalRow; t: number; device: boolean; kind: string; sig: string };
  const cands: Cand[] = [];
  for (const it of items) {
    if (!it.payload) continue;
    for (const [eid, e] of Object.entries<any>(it.payload)) {
      if (!e || typeof e !== "object") continue;
      const ev: Evidence = [{ item_id: it.id, entry_id: eid }];
      if (e.type === "bp_reading" && typeof e.measured_at === "string") {
        const t = minutes(e.measured_at);
        if (t === undefined || typeof e.systolic_mmhg !== "number" || typeof e.diastolic_mmhg !== "number") continue;
        const row: VitalRow = { setting: "home", local_time: ldt(e.measured_at), systolic_mmhg: e.systolic_mmhg, diastolic_mmhg: e.diastolic_mmhg, evidence: ev };
        if (typeof e.pulse_bpm === "number") row.pulse_bpm = e.pulse_bpm;
        cands.push({ row, t, device: e.entry_method === "cuff_sync", kind: "bp", sig: `${e.systolic_mmhg}/${e.diastolic_mmhg}` });
      } else if (e.type === "glucose_reading" && typeof e.measured_at === "string" && typeof e.value === "number") {
        const t = minutes(e.measured_at);
        if (t === undefined) continue;
        const mmol = e.unit === "mmol/L";
        let mg = mmol ? Math.round(e.value * 18.016) : Math.round(e.value);
        const row: VitalRow = { setting: "home", local_time: ldt(e.measured_at), evidence: ev };
        if (e.out_of_range === "HI" || e.out_of_range === "LO") {
          mg = e.out_of_range === "HI" ? 600 : 20;
          row.glucose_out_of_range = e.out_of_range;
        }
        row.glucose_mg_dl = mg;
        cands.push({ row, t, device: e.entry_method === "meter_sync", kind: "glu", sig: `${mg}${e.out_of_range ?? ""}` });
      }
    }
  }
  const drop = new Set<Cand>();
  for (const a of cands) {
    if (a.device) continue;
    for (const b of cands) {
      if (!b.device || b.kind !== a.kind || b.sig !== a.sig) continue;
      if (Math.abs(a.t - b.t) <= 2) { drop.add(a); break; }
    }
  }
  return cands
    .filter((c) => !drop.has(c))
    .sort((a, b) => a.t - b.t || (a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : 0))
    .map((c) => c.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  let live: FolioItem[] = [];
  try { live = countingItems(Array.isArray(items) ? items : [], asOf); } catch { live = []; }
  const safe = <T>(f: () => T[]): T[] => { try { return f(); } catch { return []; } };
  return {
    medications: safe(() => medications(live)),
    problems: [],
    allergies: [],
    labs: [],
    vitals: safe(() => vitals(live)),
  };
}
