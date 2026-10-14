// HomeLog (patient diary app) → consumer views.
//
// HomeLog publishes two kinds of item: day pages (home BP / glucose readings, dose logs, diary notes) and
// My Medicines list snapshots. Day pages feed `vitals`; the latest counting My Medicines snapshot feeds
// `medications`. HomeLog has no problem list, allergy list or lab results, so those views stay empty
// (home meter glucose is a vital, not a lab; diary symptom tags are not diagnoses).
import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  VitalRow,
  Evidence,
  Sensitivity,
} from "../in/views/views";

const TZ = "America/Chicago";

// ---------------------------------------------------------------------------------------------------
// Time helpers

const dtf = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Offset of America/Chicago from UTC at a UTC instant, in minutes (e.g. -360). */
function tzOffsetMinutes(utcMs: number): number {
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) parts[p.type] = p.value;
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / 60000);
}

/** UTC instant of a Chicago wall-clock time given as fields. */
function localToUtcMs(y: number, mo: number, d: number, h: number, mi: number, s: number, ms: number): number {
  const wall = Date.UTC(y, mo - 1, d, h, mi, s, ms);
  let utc = wall - tzOffsetMinutes(wall) * 60000;
  utc = wall - tzOffsetMinutes(utc) * 60000;
  return utc;
}

/** Instant of an envelope date-time. Values without offset are Chicago wall time; bare dates are local dates. */
function parseInstant(s: unknown): number | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  if (/(Z|[+-]\d{2}:?\d{2})$/i.test(t) && /T/.test(t)) {
    const v = Date.parse(t);
    return Number.isFinite(v) ? v : undefined;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/.exec(t);
  if (!m) return undefined;
  return localToUtcMs(
    +m[1], +m[2], +m[3],
    m[4] ? +m[4] : 0, m[5] ? +m[5] : 0, m[6] ? +m[6] : 0,
    m[7] ? Number(("0." + m[7])) * 1000 : 0,
  );
}

/** End of a local date (23:59:59.999 Chicago) as a UTC instant. */
function endOfLocalDay(asOf: string): number | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(asOf.trim());
  if (!m) return undefined;
  return localToUtcMs(+m[1], +m[2], +m[3], 23, 59, 59, 999);
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * A HomeLog wall-clock time as local `YYYY-MM-DDTHH:MM`. HomeLog times carry no offset and are reported as
 * written; should one ever carry an offset, it is converted to Chicago time.
 */
function localWallTime(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/i.exec(t);
  if (!m) return undefined;
  if (!m[4]) return `${m[1]}T${m[2]}:${m[3]}`;
  const v = Date.parse(t);
  if (!Number.isFinite(v)) return undefined;
  const local = new Date(v + tzOffsetMinutes(v) * 60000);
  return (
    `${local.getUTCFullYear()}-${pad2(local.getUTCMonth() + 1)}-${pad2(local.getUTCDate())}` +
    `T${pad2(local.getUTCHours())}:${pad2(local.getUTCMinutes())}`
  );
}

/** Minutes since epoch of a local `YYYY-MM-DDTHH:MM` treated as a naive clock (for proximity comparison only). */
function naiveMinutes(local: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!m) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) / 60000;
}

function partialDate(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(t);
  if (!m) return undefined;
  if (m[2] && (+m[2] < 1 || +m[2] > 12)) return undefined;
  if (m[3] && (+m[3] < 1 || +m[3] > 31)) return undefined;
  return t;
}

// ---------------------------------------------------------------------------------------------------
// Which items count as of the end of `asOf`

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const cutoff = endOfLocalDay(asOf);
  const eligible: FolioItem[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const rec = parseInstant(it.recorded);
    if (rec === undefined || cutoff === undefined || rec > cutoff) continue;
    eligible.push(it);
  }
  const byId = new Map<string, FolioItem>();
  for (const it of eligible) byId.set(it.id, it);

  const retracted = new Set<string>();
  for (const it of eligible) {
    if (Array.isArray(it.retracts)) for (const r of it.retracts) if (typeof r === "string") retracted.add(r);
  }
  // Supersession is transitive: follow chains from every non-retracted counting item.
  const superseded = new Set<string>();
  const visit = (id: string): void => {
    const it = byId.get(id);
    if (!it || !Array.isArray(it.supersedes)) return;
    for (const s of it.supersedes) {
      if (typeof s !== "string" || superseded.has(s)) continue;
      superseded.add(s);
      visit(s);
    }
  };
  for (const it of eligible) if (!retracted.has(it.id)) visit(it.id);

  return eligible.filter((it) => !retracted.has(it.id) && !superseded.has(it.id));
}

function payloadEntries(it: FolioItem): [string, any][] {
  const p = it.payload;
  if (!p || typeof p !== "object" || Array.isArray(p)) return [];
  return Object.keys(p)
    .sort()
    .map((k) => [k, (p as Record<string, any>)[k]] as [string, any])
    .filter(([, e]) => e && typeof e === "object" && typeof e.type === "string");
}

function isMedList(it: FolioItem): boolean {
  if (payloadEntries(it).some(([, e]) => e.type === "my_med")) return true;
  return typeof it.narrative === "string" && /^\s*My Medicines\b/i.test(it.narrative);
}

// ---------------------------------------------------------------------------------------------------
// Vitals (home BP and glucose readings)

const MMOL_TO_MGDL = 18.016;

interface Reading {
  kind: "bp" | "glu";
  device: boolean;
  minutes: number;
  row: VitalRow;
}

function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function readBp(e: any, ev: Evidence): Reading | undefined {
  const t = localWallTime(e.measured_at);
  if (!t || !isNum(e.systolic_mmhg) || !isNum(e.diastolic_mmhg)) return undefined;
  const row: VitalRow = {
    setting: "home",
    local_time: t,
    systolic_mmhg: e.systolic_mmhg,
    diastolic_mmhg: e.diastolic_mmhg,
    evidence: ev,
  };
  if (isNum(e.pulse_bpm)) row.pulse_bpm = e.pulse_bpm;
  return { kind: "bp", device: e.entry_method === "cuff_sync", minutes: naiveMinutes(t), row };
}

function readGlucose(e: any, ev: Evidence): Reading | undefined {
  const t = localWallTime(e.measured_at);
  if (!t) return undefined;
  const unit = typeof e.unit === "string" ? e.unit.trim().toLowerCase() : "";
  const oor = e.out_of_range === "HI" || e.out_of_range === "LO" ? (e.out_of_range as "HI" | "LO") : undefined;
  let mg: number | undefined;
  if (oor) {
    // `value` is the meter's limit, not a measurement; report the limit in mg/dL.
    if (unit === "mg/dl" && isNum(e.value)) mg = Math.round(e.value);
    else if (unit === "mmol/l" && isNum(e.value)) mg = Math.round(e.value * MMOL_TO_MGDL);
    else mg = oor === "HI" ? 600 : 20;
  } else {
    if (!isNum(e.value)) return undefined;
    if (unit === "mg/dl") mg = Math.round(e.value);
    else if (unit === "mmol/l") mg = Math.round(e.value * MMOL_TO_MGDL);
    else return undefined;
  }
  const row: VitalRow = { setting: "home", local_time: t, glucose_mg_dl: mg, evidence: ev };
  if (oor) row.glucose_out_of_range = oor;
  return { kind: "glu", device: e.entry_method === "meter_sync", minutes: naiveMinutes(t), row };
}

function sameMeasurement(a: Reading, b: Reading): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "bp") {
    if (a.row.systolic_mmhg !== b.row.systolic_mmhg || a.row.diastolic_mmhg !== b.row.diastolic_mmhg) return false;
    if (a.row.pulse_bpm !== undefined && b.row.pulse_bpm !== undefined && a.row.pulse_bpm !== b.row.pulse_bpm)
      return false;
    return true;
  }
  if (a.row.glucose_out_of_range !== b.row.glucose_out_of_range) return false;
  // A typed copy may have been entered in the other unit; allow rounding slack.
  return Math.abs((a.row.glucose_mg_dl ?? NaN) - (b.row.glucose_mg_dl ?? NaN)) <= 1;
}

const DUP_WINDOW_MIN = 5;

function buildVitals(dayPages: FolioItem[]): VitalRow[] {
  const readings: Reading[] = [];
  for (const it of dayPages) {
    for (const [key, e] of payloadEntries(it)) {
      const ev: Evidence = [{ item_id: it.id, entry_id: key }];
      let r: Reading | undefined;
      try {
        if (e.type === "bp_reading") r = readBp(e, ev);
        else if (e.type === "glucose_reading") r = readGlucose(e, ev);
      } catch {
        r = undefined;
      }
      if (r) readings.push(r);
    }
  }
  // Device copies first so that a hand-typed duplicate folds into the device row.
  readings.sort(
    (a, b) =>
      Number(b.device) - Number(a.device) ||
      a.minutes - b.minutes ||
      (a.row.evidence[0].item_id < b.row.evidence[0].item_id ? -1 : a.row.evidence[0].item_id > b.row.evidence[0].item_id ? 1 : 0) ||
      ((a.row.evidence[0].entry_id ?? "") < (b.row.evidence[0].entry_id ?? "") ? -1 : 1),
  );
  const kept: Reading[] = [];
  for (const r of readings) {
    const dup = kept.find((k) => {
      if (!sameMeasurement(k, r)) return false;
      const gap = Math.abs(k.minutes - r.minutes);
      // Typed copy of a device reading: a few minutes apart. Same-method copies: identical time only
      // (e.g. the same day restated on two pages without a supersedes link).
      if (k.device !== r.device) return gap <= DUP_WINDOW_MIN;
      return gap === 0;
    });
    if (dup) {
      if (dup.row.pulse_bpm === undefined && r.row.pulse_bpm !== undefined) dup.row.pulse_bpm = r.row.pulse_bpm;
      dup.row.evidence.push(...r.row.evidence);
    } else {
      kept.push(r);
    }
  }
  const rows = kept.map((k) => k.row);
  rows.sort((a, b) =>
    a.local_time < b.local_time ? -1 : a.local_time > b.local_time ? 1 :
    (a.glucose_mg_dl === undefined ? 0 : 1) - (b.glucose_mg_dl === undefined ? 0 : 1),
  );
  return rows;
}

// ---------------------------------------------------------------------------------------------------
// Medications (latest counting My Medicines snapshot)

/** Brand names, nicknames and common typed variants → generic ingredient(s). */
const BRANDS: Record<string, string[]> = {
  zestril: ["lisinopril"], prinivil: ["lisinopril"], vasotec: ["enalapril"], altace: ["ramipril"],
  lotensin: ["benazepril"], accupril: ["quinapril"],
  norvasc: ["amlodipine"], procardia: ["nifedipine"], adalat: ["nifedipine"], cardizem: ["diltiazem"],
  calan: ["verapamil"],
  cozaar: ["losartan"], diovan: ["valsartan"], benicar: ["olmesartan"], avapro: ["irbesartan"],
  micardis: ["telmisartan"], atacand: ["candesartan"],
  hyzaar: ["losartan", "hydrochlorothiazide"], zestoretic: ["lisinopril", "hydrochlorothiazide"],
  "diovan hct": ["valsartan", "hydrochlorothiazide"], exforge: ["amlodipine", "valsartan"],
  lotrel: ["amlodipine", "benazepril"], entresto: ["sacubitril", "valsartan"],
  toprol: ["metoprolol"], "toprol xl": ["metoprolol"], lopressor: ["metoprolol"], tenormin: ["atenolol"],
  coreg: ["carvedilol"], bystolic: ["nebivolol"], inderal: ["propranolol"],
  lasix: ["furosemide"], bumex: ["bumetanide"], demadex: ["torsemide"], aldactone: ["spironolactone"],
  microzide: ["hydrochlorothiazide"], hctz: ["hydrochlorothiazide"],
  glucophage: ["metformin"], "glucophage xr": ["metformin"], glumetza: ["metformin"], fortamet: ["metformin"],
  glucotrol: ["glipizide"], "glucotrol xl": ["glipizide"], amaryl: ["glimepiride"], micronase: ["glyburide"],
  diabeta: ["glyburide"], januvia: ["sitagliptin"], tradjenta: ["linagliptin"],
  janumet: ["sitagliptin", "metformin"], jardiance: ["empagliflozin"], farxiga: ["dapagliflozin"],
  invokana: ["canagliflozin"], synjardy: ["empagliflozin", "metformin"], xigduo: ["dapagliflozin", "metformin"],
  ozempic: ["semaglutide"], wegovy: ["semaglutide"], rybelsus: ["semaglutide"], victoza: ["liraglutide"],
  trulicity: ["dulaglutide"], mounjaro: ["tirzepatide"], zepbound: ["tirzepatide"], actos: ["pioglitazone"],
  lantus: ["insulin glargine"], basaglar: ["insulin glargine"], toujeo: ["insulin glargine"],
  semglee: ["insulin glargine"], levemir: ["insulin detemir"], tresiba: ["insulin degludec"],
  humalog: ["insulin lispro"], admelog: ["insulin lispro"], novolog: ["insulin aspart"], fiasp: ["insulin aspart"],
  apidra: ["insulin glulisine"],
  crestor: ["rosuvastatin"], lipitor: ["atorvastatin"], zocor: ["simvastatin"], pravachol: ["pravastatin"],
  livalo: ["pitavastatin"], zetia: ["ezetimibe"], tricor: ["fenofibrate"], lopid: ["gemfibrozil"],
  synthroid: ["levothyroxine"], levoxyl: ["levothyroxine"], unithroid: ["levothyroxine"], tirosint: ["levothyroxine"],
  eliquis: ["apixaban"], xarelto: ["rivaroxaban"], coumadin: ["warfarin"], jantoven: ["warfarin"],
  plavix: ["clopidogrel"], brilinta: ["ticagrelor"], pradaxa: ["dabigatran"],
  "baby aspirin": ["aspirin"], bayer: ["aspirin"], ecotrin: ["aspirin"], asa: ["aspirin"],
  aleve: ["naproxen"], naprosyn: ["naproxen"], advil: ["ibuprofen"], motrin: ["ibuprofen"],
  tylenol: ["acetaminophen"], paracetamol: ["acetaminophen"], celebrex: ["celecoxib"], mobic: ["meloxicam"],
  prilosec: ["omeprazole"], nexium: ["esomeprazole"], protonix: ["pantoprazole"], prevacid: ["lansoprazole"],
  pepcid: ["famotidine"], zantac: ["ranitidine"], "zantac 360": ["famotidine"], tums: ["calcium carbonate"],
  zyrtec: ["cetirizine"], claritin: ["loratadine"], allegra: ["fexofenadine"], benadryl: ["diphenhydramine"],
  flonase: ["fluticasone"], singulair: ["montelukast"],
  ventolin: ["albuterol"], "ventolin hfa": ["albuterol"], proair: ["albuterol"], "proair hfa": ["albuterol"],
  proventil: ["albuterol"], salbutamol: ["albuterol"],
  neurontin: ["gabapentin"], lyrica: ["pregabalin"], flomax: ["tamsulosin"], proscar: ["finasteride"],
  lexapro: ["escitalopram"], zoloft: ["sertraline"], prozac: ["fluoxetine"], celexa: ["citalopram"],
  paxil: ["paroxetine"], wellbutrin: ["bupropion"], effexor: ["venlafaxine"], cymbalta: ["duloxetine"],
  desyrel: ["trazodone"], remeron: ["mirtazapine"], seroquel: ["quetiapine"], abilify: ["aripiprazole"],
  zyprexa: ["olanzapine"], risperdal: ["risperidone"], lamictal: ["lamotrigine"], depakote: ["divalproex"],
  xanax: ["alprazolam"], ativan: ["lorazepam"], klonopin: ["clonazepam"], valium: ["diazepam"],
  ambien: ["zolpidem"], suboxone: ["buprenorphine", "naloxone"], subutex: ["buprenorphine"],
  vivitrol: ["naltrexone"], antabuse: ["disulfiram"], chantix: ["varenicline"],
  truvada: ["emtricitabine", "tenofovir"], descovy: ["emtricitabine", "tenofovir"],
  biktarvy: ["bictegravir", "emtricitabine", "tenofovir"], valtrex: ["valacyclovir"],
  viagra: ["sildenafil"], cialis: ["tadalafil"],
  "vitamin d3": ["cholecalciferol"], "vitamin d 3": ["cholecalciferol"], "vitamin b12": ["cyanocobalamin"],
  "fish oil": ["omega-3 fatty acids"], "folic acid": ["folic acid"],
  "potassium chloride": ["potassium chloride"], "klor-con": ["potassium chloride"],
  "k-dur": ["potassium chloride"], miralax: ["polyethylene glycol 3350"], "milk of magnesia": ["magnesium hydroxide"],
  imodium: ["loperamide"], zofran: ["ondansetron"], keflex: ["cephalexin"], augmentin: ["amoxicillin", "clavulanate"],
  "metformin er": ["metformin"], "metformin xr": ["metformin"],
};

/** Salt / ester words dropped from the end of an ingredient name. */
const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "calcium", "potassium", "magnesium", "maleate", "besylate", "succinate",
  "tartrate", "mesylate", "hydrobromide", "citrate", "sulfate", "fumarate", "acetate", "bitartrate",
  "monohydrate", "trihydrate", "dihydrate", "hyclate", "phosphate", "disodium", "dipotassium", "anhydrous",
  "hemihydrate", "medoxomil", "propanediol", "xinafoate", "bromide", "camsylate", "lactate", "gluconate",
]);

const FORM_WORDS = new Set([
  "oral", "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "pill", "pills",
  "extended", "release", "delayed", "er", "xr", "xl", "sr", "dr", "ec", "hfa", "inhaler", "pen", "injector",
  "injection", "solution", "suspension", "cream", "ointment", "patch", "spray", "nasal", "metered", "dose",
  "chewable", "film", "coated", "prefilled", "syringe", "auto-injector", "liquid", "drops", "topical",
]);

/** Words that mark a typed name as a nickname rather than a drug name ("water pill", "sugar shot"). */
const NICKNAME_WORDS = new Set([
  "water", "sugar", "blood", "pressure", "heart", "my", "for", "the", "shot", "cholesterol", "thyroid",
  "pain", "sleep", "sleeping", "stomach", "new", "white", "pink", "blue", "yellow", "little", "big", "allergy",
  "med", "meds", "medicine", "thinner",
]);

function stripSalts(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  while (words.length > 1 && SALTS.has(words[words.length - 1])) words.pop();
  return words.join(" ");
}

/** Ingredients from an RxNorm display ("rosuvastatin calcium 20 MG Oral Tablet"). */
function ingredientsFromDisplay(display: string): string[] {
  let d = display.replace(/\[[^\]]*\]/g, " ").trim();
  const parts = d.split(/\s+\/\s+|\s+and\s+/i);
  const out: string[] = [];
  for (const part of parts) {
    let p = part.toLowerCase();
    const m = /^(.*?)(?:\s+\d|\s+\.\d|$)/.exec(p);
    p = (m ? m[1] : p).trim();
    const words = p.split(/\s+/).filter((w) => w && !FORM_WORDS.has(w));
    p = stripSalts(words.join(" "));
    if (p && /[a-z]/.test(p)) {
      const brand = BRANDS[p];
      out.push(...(brand ?? [p]));
    }
  }
  return out;
}

/** Ingredients from a patient-typed name, or [] when the name does not say which drug it is. */
function ingredientsFromTypedName(name: string): string[] {
  let n = name.toLowerCase().replace(/\([^)]*\)/g, " ").replace(/®|™/g, "").trim();
  if (BRANDS[n]) return BRANDS[n];
  // Drop strengths and dosage-form words.
  n = n.replace(/\d+(?:\.\d+)?\s*(?:mg|mcg|µg|ug|g|units?|iu|ml|%)?(?:\s*\/\s*\d*(?:\.\d+)?\s*[a-z]+)?/g, " ");
  let words = n.split(/[\s,]+/).filter((w) => w && !FORM_WORDS.has(w));
  n = words.join(" ").trim();
  if (!n) return [];
  if (BRANDS[n]) return BRANDS[n];
  if (n.includes("/") || / \+ | & /.test(n)) {
    const parts = n.split(/\s*(?:\/|\+|&)\s*/).filter(Boolean);
    const res: string[] = [];
    for (const p of parts) {
      const r = ingredientsFromTypedName(p);
      if (!r.length) return [];
      res.push(...r);
    }
    return res;
  }
  words = n.split(/\s+/);
  if (BRANDS[words[0]] && words.length <= 2) return BRANDS[words[0]];
  if (words.some((w) => NICKNAME_WORDS.has(w))) return [];
  if (!/^[a-z][a-z0-9 \-]*$/.test(n)) return [];
  return [stripSalts(n)];
}

// --- Sensitivity ---

const SENSITIVE: Record<string, Sensitivity> = {};
function tag(cat: Sensitivity, names: string): void {
  for (const n of names.split(",")) SENSITIVE[n.trim()] = cat;
}
tag(
  "mental-health",
  "sertraline,fluoxetine,paroxetine,citalopram,escitalopram,fluvoxamine,venlafaxine,desvenlafaxine,duloxetine," +
    "levomilnacipran,vilazodone,vortioxetine,bupropion,mirtazapine,trazodone,nefazodone,amitriptyline," +
    "nortriptyline,imipramine,desipramine,clomipramine,doxepin,phenelzine,tranylcypromine,selegiline transdermal," +
    "quetiapine,aripiprazole,olanzapine,risperidone,paliperidone,ziprasidone,lurasidone,cariprazine," +
    "brexpiprazole,haloperidol,clozapine,chlorpromazine,fluphenazine,perphenazine,asenapine,iloperidone," +
    "lumateperone,lithium,lithium carbonate,divalproex,lamotrigine,alprazolam,lorazepam,clonazepam,diazepam," +
    "buspirone,hydroxyzine pamoate,methylphenidate,dexmethylphenidate,amphetamine,dextroamphetamine," +
    "lisdexamfetamine,atomoxetine,guanfacine extended,esketamine,brexanolone,zuranolone",
);
tag(
  "substance-use",
  "buprenorphine,methadone,naltrexone,disulfiram,acamprosate,varenicline,nicotine,lofexidine",
);
tag(
  "hiv-sti",
  "emtricitabine,tenofovir,tenofovir disoproxil,tenofovir alafenamide,bictegravir,dolutegravir,raltegravir," +
    "elvitegravir,cabotegravir,rilpivirine,efavirenz,doravirine,darunavir,atazanavir,ritonavir,cobicistat," +
    "lamivudine,abacavir,zidovudine,nevirapine,lenacapavir,maraviroc",
);
tag(
  "sexual-reproductive-health",
  "levonorgestrel,norethindrone,norgestimate,desogestrel,drospirenone,etonogestrel,ethinyl estradiol," +
    "ulipristal,mifepristone,misoprostol,sildenafil,vardenafil,clomiphene,letrozole for fertility,segesterone",
);

function sensitivityOf(ingredient: string | undefined, name: string): Sensitivity[] | undefined {
  const cats = new Set<Sensitivity>();
  if (ingredient && SENSITIVE[ingredient]) cats.add(SENSITIVE[ingredient]);
  const nm = name.toLowerCase();
  if (/\b(birth control|contracepti|plan b)\b/.test(nm)) cats.add("sexual-reproductive-health");
  if (/\bprep\b/.test(nm)) cats.add("hiv-sti");
  return cats.size ? [...cats].sort() : undefined;
}

// --- Status from the patient's wording ---

/** Patient wording that the medicine is paused or on hold. */
const PAUSE_RE =
  /\b(paus(e|ed|ing)|on hold|holding (it|off|this)|hold(ing)? off|told me to hold|said to hold|hold (it|this) (for|until|till)|taking a break|break from (it|this)|temporarily (stopped|off|not taking))\b/i;

/** Patient wording that a stop is temporary. */
const TEMP_RE = new RegExp(
  [
    "\\bfor now\\b",
    "\\bfor the time being\\b",
    "\\b(stop|stopped|off|not taking)( it| this| taking it)? for (a|one|two|three|a few|a couple( of)?|\\d+) (day|days|week|weeks|month|months)\\b",
    "\\btemporar(y|ily)\\b",
    "\\b(stop|stopped|off|not taking|hold|told|said)\\b[^.;]*\\b(until|till|til) (after|further notice|i see|i get|next|surgery|procedure|my (surgery|procedure|appointment|appt|visit|labs?|follow|next|colonoscopy|dental)|the (surgery|procedure|appointment|appt|labs?|colonoscopy))",
    "\\b(will|to|going to|gonna|can|should|may|might|plan to) (re-?start|resume|go back on|start (it |this )?again|try (it )?again)",
    "\\b(re-?start|resume) (it |this )?(after|when|once|in)\\b",
  ].join("|"),
  "i",
);

/** Patient wording, on an entry still marked taking, that they are not taking it now. */
const NOT_TAKING_RE =
  /\b(stopped (it|this|taking)|quit (it|this|taking)|not taking (it|this)|off (of )?(it|this) (now|since|for)|no longer taking)\b/i;

function heldOrNot(status: "taking" | "stopped", words: string): boolean {
  if (PAUSE_RE.test(words)) return true;
  if (status === "stopped") return TEMP_RE.test(words);
  return NOT_TAKING_RE.test(words);
}

function stopReason(text: string): MedicationRow["stop_reason"] | undefined {
  const t = text.toLowerCase();
  if (
    /\b(side ?effects?|rash|hives|itch|swell|allerg|reaction|made me|gave me|caused|cough|dizz|nause|sick|upset stomach|stomach (upset|ache|pain)|diarrh|vomit|cramps?|muscle (ache|pain)|leg pain|headache|tired|fatigue|bleed|bruis|yeast|infection|kidney|liver|low sugar|hypo|too low|couldn'?t tolerate|intoleran|didn'?t agree)/.test(
      t,
    )
  )
    return "adverse_reaction";
  if (/\b(didn'?t work|did not work|not working|wasn'?t working|stopped working|no (effect|help|difference)|didn'?t help|did not help|ineffective)\b/.test(t))
    return "ineffective";
  if (/\b(switch(ed)? (me )?(to|over)|changed (me )?to|replaced (by|with)|instead|in place of|moved (me )?to|swapped)\b/.test(t))
    return "therapy_changed";
  if (/\b(finished|completed|course (is |was )?(done|over|complete)|done with the course|ran its course|all done)\b/.test(t))
    return "course_complete";
  if (/\b(i decided|my (own )?(choice|decision)|didn'?t want|don'?t want|i chose|on my own|too expensive|cost too much|can'?t afford|couldn'?t afford)\b/.test(t))
    return "patient_choice";
  return undefined;
}

// --- Dose and frequency from the patient's wording ---

type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";

function normUnit(u: string): DoseUnit | "g" | "count" | undefined {
  const s = u.toLowerCase().replace(/\.$/, "");
  if (/^(mg|mgs|milligrams?)$/.test(s)) return "mg";
  if (/^(mcg|mcgs|µg|ug|micrograms?)$/.test(s)) return "mcg";
  if (/^(g|gm|grams?)$/.test(s)) return "g";
  if (/^(u|iu|units?|unt)$/.test(s)) return "units";
  if (/^(ml|cc|milliliters?|millilitres?)$/.test(s)) return "mL";
  if (/^(tablets?|tabs?|pills?|capsules?|caps?|puffs?|actuations?|actuat|inhalations?|sprays?|patch(es)?|drops?|gumm(y|ies)|softgels?|chews?)$/.test(s))
    return "count";
  return undefined;
}

interface Strength {
  value: number;
  unit: "mg" | "mcg" | "units" | "mL";
  /** Per-volume concentration ("100 units/mL"): one "unit" of the product is not a fixed amount. */
  perMl?: number;
}

const UNIT_PAT = "mg|mgs|milligrams?|mcg|µg|ug|micrograms?|g|gm|grams?|units?|unt|iu|u|ml|cc";

function parseStrength(text: string | undefined): Strength | undefined {
  if (!text) return undefined;
  const t = text.toLowerCase();
  const re = new RegExp(
    `(\\d+(?:[.,]\\d+)?|\\.\\d+)\\s*(${UNIT_PAT})\\b(?:\\s*(?:/|per)\\s*(\\d+(?:\\.\\d+)?)?\\s*([a-z]+))?`,
    "g",
  );
  const found: Strength[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    let v = Number(m[1].replace(",", "."));
    let u = normUnit(m[2]);
    if (!isFinite(v) || !u || u === "count" || u === "tablet") continue;
    if (u === "g") {
      v = v * 1000;
      u = "mg";
    }
    const s: Strength = { value: v, unit: u as Strength["unit"] };
    if (m[4]) {
      const den = normUnit(m[4]);
      if (den === "mL") s.perMl = m[3] ? Number(m[3]) : 1;
      else if (den !== "count") return undefined; // e.g. mg/kg, mg/day: not a per-unit strength
    }
    found.push(s);
  }
  if (found.length !== 1) return undefined; // none, or several (combination / ambiguous)
  return found[0];
}

function strengthFromDisplay(display: string | undefined): Strength | undefined {
  if (!display) return undefined;
  const d = display.replace(/\[[^\]]*\]/g, " ");
  if (/\s\/\s/.test(d)) return undefined; // combination product
  const m = /(\d+(?:\.\d+)?|\.\d+)\s*(MG|MCG|UNT|ML)(?:\/(ML|ACTUAT|[A-Z]+))?\b/i.exec(d);
  if (!m) return undefined;
  let v = Number(m[1]);
  let u = normUnit(m[2]);
  if (!u || u === "count" || u === "g" || u === "tablet") return undefined;
  const s: Strength = { value: v, unit: u as Strength["unit"] };
  if (m[3]) {
    const den = normUnit(m[3]);
    if (den === "mL") s.perMl = 1;
    else if (den !== "count") return undefined;
  }
  // RxNorm writes microgram strengths as fractions of a milligram (0.075 MG); patients say 75 mcg.
  if (s.unit === "mg" && s.value < 1 && !s.perMl) {
    s.unit = "mcg";
    s.value = Math.round(s.value * 1000 * 1000) / 1000;
  }
  return s;
}

const NUM_WORDS: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5, "1/2": 0.5, "½": 0.5,
  "one half": 0.5, "a half": 0.5,
};

function roundDose(v: number): number {
  return Math.round(v * 1000) / 1000;
}

function parseDose(how: string | undefined, strength: Strength | undefined): MedicationRow["dose"] | undefined {
  if (!how || !how.trim()) return undefined; // a strength with no directions at all
  const t = " " + how.toLowerCase().replace(/[–—]/g, "-") + " ";
  if (/sliding|scale|depend|according to|based on|per (my )?(sugar|reading|glucose|carb)|if (my )?(sugar|bs|glucose)|carbs?\b|varies|vary|different amounts?/.test(t))
    return undefined;
  const numRe = "(\\d+(?:\\.\\d+)?|\\.\\d+|1/2|½|one half|a half|half|an|a|one|two|three|four|five|six)";
  // Ranges: "1-2 puffs", "1 or 2", "one to two".
  if (new RegExp(`\\b${numRe}\\s*(?:-|to|or)\\s*${numRe}\\b(?!\\s*(?:times|x\\b|hours|hrs|days|weeks|am|pm|:))`).test(t)) {
    // Only treat as a dose range if it is not a time ("8 to 10 pm") or frequency phrase.
    const rr = new RegExp(`\\b${numRe}\\s*(?:-|to|or)\\s*${numRe}\\s*([a-z]*)`).exec(t);
    const after = rr ? rr[3] : "";
    if (!/^(times|x|hours?|hrs?|days?|weeks?|am|pm|o)$/.test(after)) return undefined;
  }
  const amounts: { v: number; u: DoseUnit | "g" | "count" }[] = [];
  const amtRe = new RegExp(`(?:^|[^a-z0-9./])${numRe}\\s*(?:x\\s*)?(${UNIT_PAT}|tablets?|tabs?|pills?|capsules?|caps?|puffs?|inhalations?|sprays?|patch(?:es)?|drops?|softgels?|gumm(?:y|ies)|chews?)\\b`, "g");
  let m: RegExpExecArray | null;
  while ((m = amtRe.exec(t))) {
    const n = NUM_WORDS[m[1]] ?? Number(m[1]);
    const u = normUnit(m[2]);
    if (!isFinite(n) || !u) continue;
    if ((m[1] === "a" || m[1] === "an") && u !== "count") continue;
    amounts.push({ v: n, u });
  }
  // Bare leading count: "2 at night", "take 1 in the morning".
  if (!amounts.length) {
    const bm = new RegExp(`^\\s*(?:take\\s+)?${numRe}\\s+(?!times|x\\b|hours?|hrs?|days?|weeks?|am\\b|pm\\b|a day|per|every|daily)([a-z]+)`).exec(t);
    if (bm && bm[1] !== "a" && bm[1] !== "an") {
      const n = NUM_WORDS[bm[1]] ?? Number(bm[1]);
      if (isFinite(n) && !/^\d+$/.test(bm[2])) amounts.push({ v: n, u: "count" });
    }
  }
  const distinct = new Set(amounts.map((a) => `${a.v}|${a.u}`));
  if (distinct.size > 1) return undefined; // different amounts at different times: no single amount
  if (amounts.length === 1 || distinct.size === 1) {
    const a = amounts[0];
    if (a.u === "count") {
      if (strength && !strength.perMl) return { value: roundDose(strength.value * a.v), unit: strength.unit };
      if (strength) return undefined;
      if (/tablet|tab|pill|capsule|cap/.test(t)) return { value: a.v, unit: "tablet" };
      return undefined;
    }
    if (a.u === "g") return { value: roundDose(a.v * 1000), unit: "mg" };
    if (a.u === "mL" && strength && strength.perMl && strength.unit !== "mL")
      return { value: roundDose((strength.value / strength.perMl) * a.v), unit: strength.unit };
    return { value: roundDose(a.v), unit: a.u as DoseUnit };
  }
  // No amount stated: a time or schedule means one unit of the stated strength.
  if (strength && !strength.perMl && strength.unit !== "mL" && hasScheduleWords(t))
    return { value: roundDose(strength.value), unit: strength.unit };
  return undefined;
}

function hasScheduleWords(t: string): boolean {
  return /\b(morning|am|breakfast|noon|lunch|midday|afternoon|evening|supper|dinner|pm|night|nightly|bedtime|bed|daily|day|once|twice|week|weekly|every|each|with (food|meals?)|as needed|when needed|if needed|prn)\b/.test(
    t,
  );
}

function parseFrequency(how: string | undefined): MedicationRow["frequency"] | undefined {
  if (!how || !how.trim()) return undefined;
  const t = " " + how.toLowerCase().replace(/[–—]/g, "-") + " ";
  if (/\b(as needed|as-needed|when needed|if needed|when i need|prn|as required|when necessary|if necessary)\b/.test(t))
    return "PRN";
  if (/\b(when (my|i|it|the)|if (my|i|it|the)|for (my )?(pain|headaches?|wheez\w*|sleep|anxiety|nausea|heartburn|itch\w*|allergies))\b/.test(t))
    return "PRN";
  if (/\b(every other day|alternate days|every 2 days|every two days|monthly|every month|taper|four times|4 times|4x|qid|every 6 hours|every 4 hours|q6h|q4h|five times|5 times|most days|some days|every 3 days|twice a week|2x a week|three times a week)\b/.test(t))
    return "other";
  if (/\b(once a week|once weekly|weekly|every week|1x a week|every (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|on (mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays))\b/.test(t))
    return "QW";
  if (/\b(three times|3 times|3x|tid|every 8 hours|q8h|with (each|every|all) meals?|with meals)\b/.test(t)) return "TID";
  if (/\b(twice|two times|2 times|2x|bid|every 12 hours|q12h)\b/.test(t)) return "BID";
  // Count distinct times of day.
  const slots = new Set<string>();
  if (/\b(morning|mornings|am|a\.m\.|breakfast|wake|waking|get up|first thing)\b/.test(t)) slots.add("am");
  if (/\b(noon|lunch|midday|afternoon)\b/.test(t)) slots.add("mid");
  if (/\b(evening|evenings|supper|dinner|pm|p\.m\.)\b/.test(t)) slots.add("pm");
  if (/\b(bedtime|bed|night|nightly|nights|sleep)\b/.test(t)) slots.add("hs");
  if (slots.size === 3) return "TID";
  if (slots.size === 2) return "BID";
  if (slots.size >= 4) return "other";
  if (slots.size === 1) return slots.has("hs") ? "QHS" : "QD";
  if (/\b(once a day|once daily|daily|every day|everyday|each day|once|1x a day|qd|a day|per day)\b/.test(t)) return "QD";
  return undefined;
}

// --- Rows ---

interface MedCandidate {
  row: MedicationRow;
  rank: number;
}

function medRows(it: FolioItem, key: string, e: any): MedicationRow[] {
  const name = typeof e.name === "string" ? e.name.trim() : "";
  const pick = e.picked_from_search && typeof e.picked_from_search === "object" ? e.picked_from_search : undefined;
  const pickDisplay = pick && typeof pick.display === "string" ? pick.display.trim() : undefined;
  const pickCode = pick && typeof pick.rxnorm === "string" ? pick.rxnorm.trim() : undefined;
  const drugName = name || pickDisplay || "";
  if (!drugName) return [];

  let ingredients: string[] = [];
  if (pickDisplay) ingredients = ingredientsFromDisplay(pickDisplay);
  if (!ingredients.length && name) ingredients = ingredientsFromTypedName(name);
  // The search code is ingredient-level only when the picked result was a bare ingredient (no strength/form).
  const ingredientLevelCode =
    pickCode && /^\d+$/.test(pickCode) && pickDisplay && !/\d/.test(pickDisplay) && ingredients.length === 1
      ? pickCode
      : undefined;

  const note = typeof e.note === "string" && e.note.trim() ? e.note.trim() : undefined;
  const how = typeof e.how_i_take_it === "string" && e.how_i_take_it.trim() ? e.how_i_take_it.trim() : undefined;
  const statusWords = [note, how].filter(Boolean).join(" ");

  let status: MedicationRow["status"];
  if (e.status === "taking") status = heldOrNot("taking", statusWords) ? "held" : "active";
  else if (e.status === "stopped") status = heldOrNot("stopped", statusWords) ? "held" : "stopped";
  else status = "unknown";

  let since: string | undefined;
  if (status === "active") since = partialDate(e.started);
  else if (status === "stopped" || status === "held") since = partialDate(e.stopped);

  const single = ingredients.length <= 1;
  const strength = single
    ? parseStrength(typeof e.strength_text === "string" ? e.strength_text : undefined) ??
      (typeof e.strength_text === "string" && e.strength_text.trim() ? undefined : strengthFromDisplay(pickDisplay))
    : undefined;
  const dose = single ? parseDose(how, strength) : undefined;
  const frequency = parseFrequency(how);

  const base = (ingredient: string | undefined): MedicationRow => {
    const row: MedicationRow = { drug_name: drugName, status, patient_reported: true, evidence: [{ item_id: it.id, entry_id: key }] };
    if (ingredient) row.ingredient = ingredient;
    if (ingredient && ingredientLevelCode) row.rxnorm_ingredient = ingredientLevelCode;
    if (since) row.status_since = since;
    if (dose) row.dose = dose;
    if (frequency) row.frequency = frequency;
    if (status === "stopped" && note) {
      const r = stopReason(note);
      if (r) row.stop_reason = r;
    }
    if ((status === "stopped" || status === "held") && note) row.status_reason_text = note;
    if (e.kind === "over_the_counter") row.otc = true;
    const sens = sensitivityOf(ingredient, drugName);
    if (sens) row.sensitivity = sens;
    return row;
  };

  if (!ingredients.length) return [base(undefined)];
  return ingredients.map((ing) => base(ing));
}

const STATUS_RANK: Record<MedicationRow["status"], number> = { active: 3, held: 2, stopped: 1, unknown: 0 };

function buildMedications(lists: FolioItem[]): MedicationRow[] {
  if (!lists.length) return [];
  // The latest counting snapshot is the list.
  const sorted = [...lists].sort((a, b) => {
    const ra = parseInstant(a.recorded) ?? 0;
    const rb = parseInstant(b.recorded) ?? 0;
    if (ra !== rb) return rb - ra;
    const ea = String(a.effective ?? "");
    const eb = String(b.effective ?? "");
    if (ea !== eb) return ea < eb ? 1 : -1;
    return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
  });
  const list = sorted[0];

  const byKey = new Map<string, MedCandidate>();
  const order: string[] = [];
  for (const [key, e] of payloadEntries(list)) {
    if (e.type !== "my_med") continue;
    let rows: MedicationRow[] = [];
    try {
      rows = medRows(list, key, e);
    } catch {
      rows = [];
    }
    for (const row of rows) {
      const k = row.ingredient ? "ing:" + row.ingredient : "name:" + row.drug_name.toLowerCase();
      const cand = { row, rank: STATUS_RANK[row.status] };
      const prev = byKey.get(k);
      if (!prev) {
        byKey.set(k, cand);
        order.push(k);
      } else {
        // Same drug listed twice: one row; prefer the entry the patient says they are taking.
        const winner = cand.rank > prev.rank ? cand : prev;
        const loser = winner === cand ? prev : cand;
        winner.row.evidence = [...winner.row.evidence, ...loser.row.evidence];
        byKey.set(k, winner);
      }
    }
  }
  return order.map((k) => byKey.get(k)!.row);
}

// ---------------------------------------------------------------------------------------------------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string") return out;
  let counting: FolioItem[];
  try {
    counting = countingItems(items, asOf);
  } catch {
    return out;
  }
  const lists: FolioItem[] = [];
  const days: FolioItem[] = [];
  for (const it of counting) {
    try {
      if (isMedList(it)) lists.push(it);
      else days.push(it);
    } catch {
      /* skip unreadable item */
    }
  }
  try {
    out.medications = buildMedications(lists);
  } catch {
    out.medications = [];
  }
  try {
    out.vitals = buildVitals(days);
  } catch {
    out.vitals = [];
  }
  return out;
}
