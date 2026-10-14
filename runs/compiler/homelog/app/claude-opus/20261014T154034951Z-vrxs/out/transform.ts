import type { FolioItem, ViewRows, MedicationRow, VitalRow, Sensitivity } from "../in/views/views";

// Mapper for HomeLog (patient-generated diary app, schema homelog-v1).
// HomeLog publishes day pages (BP, glucose, dose logs, diary notes) and My Medicines list snapshots.
// Only medications (from the latest counting list snapshot) and vitals (home readings) have rows.

const TZ = "America/Chicago";

type Rec = Record<string, any>;

function isObj(v: unknown): v is Rec {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}
function num(v: unknown): number | undefined {
  return typeof v === "number" && isFinite(v) ? v : undefined;
}
function round6(x: number): number {
  return Math.round(x * 1e6) / 1e6;
}

// ---------------------------------------------------------------- time

const dtf = (() => {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    });
  } catch {
    return undefined;
  }
})();

function hasOffset(s: string): boolean {
  return /T.*([zZ]|[+-]\d\d(:?\d\d)?)$/.test(s.trim());
}

/** Local (Chicago) `YYYY-MM-DDTHH:MM` of an instant string with offset. */
function chicagoWall(s: string): string | undefined {
  const t = Date.parse(s);
  if (!isFinite(t) || !dtf) return undefined;
  const p: Rec = {};
  for (const part of dtf.formatToParts(new Date(t))) p[part.type] = part.value;
  const hour = p.hour === "24" ? "00" : p.hour;
  return `${p.year}-${p.month}-${p.day}T${hour}:${p.minute}`;
}

/** Local date of an envelope `recorded` value. */
function recordedLocalDate(s: unknown): string | undefined {
  const v = str(s);
  if (!v) return undefined;
  if (hasOffset(v)) return chicagoWall(v)?.slice(0, 10);
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(v.trim());
  return m ? m[1] : undefined;
}

/** Local wall time `YYYY-MM-DDTHH:MM` of a HomeLog LocalDateTime (no offset: as written). */
function localWall(s: unknown): string | undefined {
  const v = str(s);
  if (!v) return undefined;
  const t = v.trim();
  if (hasOffset(t)) return chicagoWall(t);
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{1,2}):(\d{2})/.exec(t);
  if (!m) return undefined;
  return `${m[1]}T${m[2].padStart(2, "0")}:${m[3]}`;
}

function wallMinutes(w: string): number {
  const t = Date.parse(w + ":00Z");
  return isFinite(t) ? t / 60000 : NaN;
}

function partialDate(v: unknown): string | undefined {
  const s = str(v)?.trim();
  if (!s) return undefined;
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(s);
  if (!m) {
    // A full date-time: keep its date.
    const d = /^(\d{4}-\d{2}-\d{2})T/.exec(s);
    return d ? d[1] : undefined;
  }
  return s;
}

// ---------------------------------------------------------------- as-of and supersession

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const all = (Array.isArray(items) ? items : []).filter((i) => isObj(i) && typeof (i as Rec).id === "string");
  const byId = new Map<string, FolioItem>();
  for (const i of all) byId.set(i.id, i);
  const inTime = all.filter((i) => {
    const d = recordedLocalDate(i.recorded);
    return d !== undefined && d <= asOf;
  });
  const ids = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

  const retracted = new Set<string>();
  for (const i of inTime) for (const r of ids(i.retracts)) retracted.add(r);
  const live = inTime.filter((i) => !retracted.has(i.id));

  const superseded = new Set<string>();
  const stack: string[] = [];
  for (const i of live) stack.push(...ids(i.supersedes));
  while (stack.length) {
    const id = stack.pop()!;
    if (superseded.has(id)) continue;
    superseded.add(id);
    const it = byId.get(id);
    if (it) stack.push(...ids(it.supersedes));
  }
  return live.filter((i) => !superseded.has(i.id));
}

function entriesOf(item: FolioItem): [string, Rec][] {
  const p = item.payload;
  if (!isObj(p)) return [];
  const out: [string, Rec][] = [];
  for (const k of Object.keys(p)) if (isObj(p[k])) out.push([k, p[k]]);
  return out;
}

function isMedList(item: FolioItem): boolean {
  const es = entriesOf(item);
  if (es.some(([, e]) => e.type === "my_med")) return true;
  // An emptied list still restates the (empty) list.
  return es.length === 0 && /^\s*My Medicines\b/i.test(typeof item.narrative === "string" ? item.narrative : "");
}

function cmpRecorded(a: FolioItem, b: FolioItem): number {
  const ta = Date.parse(a.recorded), tb = Date.parse(b.recorded);
  if (isFinite(ta) && isFinite(tb) && ta !== tb) return ta - tb;
  const ea = String(a.effective ?? ""), eb = String(b.effective ?? "");
  if (ea !== eb) return ea < eb ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

// ---------------------------------------------------------------- vitals

interface Reading {
  kind: "bp" | "glu";
  time: string;
  device: boolean;
  row: VitalRow;
  key: string; // value signature used for duplicate detection
}

function bpReading(item: FolioItem, id: string, e: Rec): Reading | undefined {
  const time = localWall(e.measured_at);
  const sys = num(e.systolic_mmhg), dia = num(e.diastolic_mmhg);
  if (!time || sys === undefined || dia === undefined) return undefined;
  const row: VitalRow = { setting: "home", local_time: time, systolic_mmhg: sys, diastolic_mmhg: dia, evidence: [{ item_id: item.id, entry_id: id }] };
  const pulse = num(e.pulse_bpm);
  if (pulse !== undefined) row.pulse_bpm = pulse;
  return { kind: "bp", time, device: e.entry_method === "cuff_sync", row, key: `${sys}/${dia}` };
}

const GLU_LIMIT_MG: Record<string, number> = { HI: 600, LO: 20 };

function gluReading(item: FolioItem, id: string, e: Rec): Reading | undefined {
  const time = localWall(e.measured_at);
  if (!time) return undefined;
  const unit = typeof e.unit === "string" ? e.unit.trim().toLowerCase() : "";
  const oor = e.out_of_range === "HI" || e.out_of_range === "LO" ? (e.out_of_range as "HI" | "LO") : undefined;
  let v = num(e.value);
  let mg: number | undefined;
  if (v !== undefined) {
    if (unit === "mg/dl") mg = Math.round(v);
    else if (unit === "mmol/l") mg = Math.round(v * 18.016);
  }
  if (mg === undefined && oor) mg = GLU_LIMIT_MG[oor];
  if (mg === undefined) return undefined;
  const row: VitalRow = { setting: "home", local_time: time, glucose_mg_dl: mg, evidence: [{ item_id: item.id, entry_id: id }] };
  if (oor) row.glucose_out_of_range = oor;
  return { kind: "glu", time, device: e.entry_method === "meter_sync", row, key: `${mg}|${oor ?? ""}` };
}

const DUP_WINDOW_MIN = 5;

function vitals(items: FolioItem[]): VitalRow[] {
  let readings: Reading[] = [];
  for (const item of items) {
    if (isMedList(item)) continue;
    for (const [id, e] of entriesOf(item)) {
      let r: Reading | undefined;
      try {
        if (e.type === "bp_reading") r = bpReading(item, id, e);
        else if (e.type === "glucose_reading") r = gluReading(item, id, e);
      } catch {
        r = undefined;
      }
      if (r) readings.push(r);
    }
  }

  // The same entry published in two counting items (should not happen) is one reading.
  const seen = new Map<string, Reading>();
  const unique: Reading[] = [];
  for (const r of readings) {
    const sig = `${r.kind}|${r.time}|${r.key}|${r.row.pulse_bpm ?? ""}|${r.device}`;
    const prev = seen.get(sig);
    if (prev && prev.row.evidence[0].item_id !== r.row.evidence[0].item_id) {
      prev.row.evidence.push(...r.row.evidence);
      continue;
    }
    seen.set(sig, r);
    unique.push(r);
  }
  readings = unique;

  // A typed reading duplicating a device reading (same values, within a few minutes) is one row: the device copy.
  const dropped = new Set<Reading>();
  for (const t of readings) {
    if (t.device) continue;
    let best: Reading | undefined;
    let bestGap = Infinity;
    for (const d of readings) {
      if (!d.device || d.kind !== t.kind || d.key !== t.key) continue;
      if (t.kind === "bp" && t.row.pulse_bpm !== undefined && d.row.pulse_bpm !== undefined && t.row.pulse_bpm !== d.row.pulse_bpm) continue;
      const gap = Math.abs(wallMinutes(t.time) - wallMinutes(d.time));
      if (gap <= DUP_WINDOW_MIN && gap < bestGap) { best = d; bestGap = gap; }
    }
    if (best) {
      dropped.add(t);
      best.row.evidence.push(...t.row.evidence);
    }
  }
  const rows = readings.filter((r) => !dropped.has(r));
  rows.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : 0));
  return rows.map((r) => r.row);
}

// ---------------------------------------------------------------- medication names

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", norvasc: "amlodipine", glucophage: "metformin",
  "glucophage xr": "metformin", glumetza: "metformin", fortamet: "metformin", crestor: "rosuvastatin",
  lipitor: "atorvastatin", zocor: "simvastatin", pravachol: "pravastatin", livalo: "pitavastatin", mevacor: "lovastatin",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", euthyrox: "levothyroxine", tirosint: "levothyroxine",
  cytomel: "liothyronine", armour: "thyroid",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", nesina: "alogliptin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", victoza: "liraglutide", saxenda: "liraglutide",
  trulicity: "dulaglutide", byetta: "exenatide", bydureon: "exenatide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  glucotrol: "glipizide", "glucotrol xl": "glipizide", amaryl: "glimepiride", diabeta: "glyburide", micronase: "glyburide",
  actos: "pioglitazone", avandia: "rosiglitazone", precose: "acarbose",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec", humalog: "insulin lispro", admelog: "insulin lispro", lyumjev: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  humulin: "insulin isophane", "humulin n": "insulin isophane", "novolin n": "insulin isophane", "humulin r": "insulin regular", "novolin r": "insulin regular",
  aleve: "naproxen", naprosyn: "naproxen", anaprox: "naproxen", advil: "ibuprofen", motrin: "ibuprofen",
  tylenol: "acetaminophen", paracetamol: "acetaminophen", panadol: "acetaminophen",
  bayer: "aspirin", ecotrin: "aspirin", "baby aspirin": "aspirin", "low dose aspirin": "aspirin", asa: "aspirin",
  celebrex: "celecoxib", mobic: "meloxicam", voltaren: "diclofenac",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", microzide: "hydrochlorothiazide", hctz: "hydrochlorothiazide",
  aldactone: "spironolactone", inspra: "eplerenone", lozol: "indapamide",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan",
  atacand: "candesartan", vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", accupril: "quinapril",
  toprol: "metoprolol", "toprol xl": "metoprolol", lopressor: "metoprolol", tenormin: "atenolol", coreg: "carvedilol",
  bystolic: "nebivolol", inderal: "propranolol", cardizem: "diltiazem", procardia: "nifedipine", adalat: "nifedipine",
  calan: "verapamil", catapres: "clonidine", apresoline: "hydralazine", entresto: "sacubitril / valsartan",
  lanoxin: "digoxin", eliquis: "apixaban", xarelto: "rivaroxaban", pradaxa: "dabigatran", coumadin: "warfarin", jantoven: "warfarin",
  plavix: "clopidogrel", brilinta: "ticagrelor", effient: "prasugrel", zetia: "ezetimibe", tricor: "fenofibrate", lopid: "gemfibrozil",
  lovaza: "omega-3-acid ethyl esters", vascepa: "icosapent ethyl", nitrostat: "nitroglycerin", imdur: "isosorbide mononitrate", ranexa: "ranolazine",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", prevacid: "lansoprazole", aciphex: "rabeprazole", dexilant: "dexlansoprazole",
  pepcid: "famotidine", zantac: "ranitidine", tums: "calcium carbonate", "milk of magnesia": "magnesium hydroxide",
  miralax: "polyethylene glycol 3350", colace: "docusate", senokot: "senna", dulcolax: "bisacodyl", imodium: "loperamide", zofran: "ondansetron", reglan: "metoclopramide",
  claritin: "loratadine", zyrtec: "cetirizine", allegra: "fexofenadine", xyzal: "levocetirizine", benadryl: "diphenhydramine",
  flonase: "fluticasone", nasacort: "triamcinolone", singulair: "montelukast", sudafed: "pseudoephedrine", mucinex: "guaifenesin",
  ventolin: "albuterol", "ventolin hfa": "albuterol", proair: "albuterol", "proair hfa": "albuterol", proventil: "albuterol", salbutamol: "albuterol",
  xopenex: "levalbuterol", spiriva: "tiotropium", flovent: "fluticasone", pulmicort: "budesonide", qvar: "beclomethasone",
  advair: "fluticasone / salmeterol", symbicort: "budesonide / formoterol", breo: "fluticasone / vilanterol", trelegy: "fluticasone / umeclidinium / vilanterol", incruse: "umeclidinium",
  zoloft: "sertraline", prozac: "fluoxetine", celexa: "citalopram", lexapro: "escitalopram", paxil: "paroxetine",
  effexor: "venlafaxine", "effexor xr": "venlafaxine", pristiq: "desvenlafaxine", cymbalta: "duloxetine", wellbutrin: "bupropion",
  "wellbutrin xl": "bupropion", zyban: "bupropion", remeron: "mirtazapine", desyrel: "trazodone", trintellix: "vortioxetine",
  seroquel: "quetiapine", abilify: "aripiprazole", zyprexa: "olanzapine", risperdal: "risperidone", geodon: "ziprasidone",
  latuda: "lurasidone", vraylar: "cariprazine", rexulti: "brexpiprazole", clozaril: "clozapine", haldol: "haloperidol",
  lithobid: "lithium", lamictal: "lamotrigine", depakote: "divalproex", buspar: "buspirone",
  xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam", ambien: "zolpidem", lunesta: "eszopiclone",
  adderall: "amphetamine / dextroamphetamine", ritalin: "methylphenidate", concerta: "methylphenidate", vyvanse: "lisdexamfetamine", strattera: "atomoxetine",
  suboxone: "buprenorphine / naloxone", subutex: "buprenorphine", sublocade: "buprenorphine", zubsolv: "buprenorphine / naloxone",
  vivitrol: "naltrexone", revia: "naltrexone", antabuse: "disulfiram", campral: "acamprosate", narcan: "naloxone", chantix: "varenicline",
  neurontin: "gabapentin", lyrica: "pregabalin", keppra: "levetiracetam", dilantin: "phenytoin", tegretol: "carbamazepine", topamax: "topiramate",
  ultram: "tramadol", norco: "hydrocodone / acetaminophen", vicodin: "hydrocodone / acetaminophen", percocet: "oxycodone / acetaminophen",
  oxycontin: "oxycodone", flexeril: "cyclobenzaprine", robaxin: "methocarbamol", zanaflex: "tizanidine",
  zyloprim: "allopurinol", uloric: "febuxostat", colcrys: "colchicine", prednisone: "prednisone", medrol: "methylprednisolone",
  flomax: "tamsulosin", proscar: "finasteride", avodart: "dutasteride", detrol: "tolterodine", ditropan: "oxybutynin", myrbetriq: "mirabegron",
  viagra: "sildenafil", cialis: "tadalafil", levitra: "vardenafil",
  fosamax: "alendronate", boniva: "ibandronate", actonel: "risedronate", premarin: "conjugated estrogens",
  plaquenil: "hydroxychloroquine", trexall: "methotrexate", humira: "adalimumab", enbrel: "etanercept",
  aricept: "donepezil", namenda: "memantine", sinemet: "carbidopa / levodopa", requip: "ropinirole", mirapex: "pramipexole",
  keflex: "cephalexin", augmentin: "amoxicillin / clavulanate", zithromax: "azithromycin", "z-pak": "azithromycin", "z pak": "azithromycin",
  cipro: "ciprofloxacin", levaquin: "levofloxacin", bactrim: "sulfamethoxazole / trimethoprim", macrobid: "nitrofurantoin", doxy: "doxycycline",
  valtrex: "valacyclovir", zovirax: "acyclovir", tamiflu: "oseltamivir", diflucan: "fluconazole",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", truvada: "emtricitabine / tenofovir disoproxil", descovy: "emtricitabine / tenofovir alafenamide",
  genvoya: "elvitegravir / cobicistat / emtricitabine / tenofovir alafenamide", triumeq: "abacavir / dolutegravir / lamivudine", tivicay: "dolutegravir",
  isentress: "raltegravir", prezista: "darunavir", dovato: "dolutegravir / lamivudine", juluca: "dolutegravir / rilpivirine",
  kcl: "potassium chloride", "k-dur": "potassium chloride", klor: "potassium chloride", "klor-con": "potassium chloride",
  "vitamin d3": "cholecalciferol", "vitamin d 3": "cholecalciferol", "vit d3": "cholecalciferol", "vitamin b12": "cyanocobalamin", "b12": "cyanocobalamin",
  "folic acid": "folic acid",
};

/** Name parts that make a typed name a nickname rather than a drug name. */
const NICKNAME = /\b(pills?|meds?|medicines?|medications?|tablets?|shots?|water|blood|sugar|cholesterol|heart|thyroid|pressure|sleeping|sleep|pain|my|the|for|stuff|something|new|old|white|yellow|pink|blue|little|big|supplements?)\b/;

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "potassium", "calcium", "magnesium", "maleate", "besylate", "mesylate", "succinate",
  "tartrate", "fumarate", "sulfate", "acetate", "citrate", "bromide", "hyclate", "monohydrate", "dihydrate", "trihydrate",
  "hydrobromide", "phosphate", "propionate", "furoate", "xinafoate", "dipropionate", "bitartrate", "disodium", "malate",
  "hemifumarate", "medoxomil", "cilexetil", "axetil", "monosodium", "anhydrous", "er", "xr", "sr", "dr", "xl", "cr", "la", "ec", "odt", "hfa",
]);
const KEEP_WHOLE = new Set([
  "potassium chloride", "sodium bicarbonate", "calcium carbonate", "calcium citrate", "magnesium oxide", "magnesium hydroxide",
  "sodium chloride", "ferrous sulfate", "ferrous gluconate", "magnesium citrate", "zinc sulfate", "calcium acetate",
  "potassium citrate", "magnesium sulfate", "sodium fluoride",
]);
const FORM_WORDS = /\b(oral|tablets?|tabs?|capsules?|caps?|pills?|solution|suspension|injection|injector|injectable|pen|pens|prefilled|syringe|cartridge|inhaler|inhalation|aerosol|metered|dose|powder|nasal|spray|cream|ointment|gel|patch|transdermal|topical|ophthalmic|drops?|chewable|disintegrating|delayed|extended|release|sublingual|film|coated|enteric|vial|kwikpen|flexpen|flextouch|solostar|actuat|actuation|hr|liquid|syrup|lozenge|gummy|gummies|softgels?)\b/g;

function cleanDrugText(s: string): string {
  let t = s.toLowerCase();
  t = t.replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ");
  t = t.replace(/^\s*\d+\s*(hr|hour|day)\s+/, "");
  // Cut at the first strength.
  const m = /\s\d|\s\.\d|\d+(\.\d+)?\s*(mg|mcg|µg|ug|g|unt|units?|iu|ml|%)\b/.exec(t);
  if (m && m.index > 0) t = t.slice(0, m.index);
  t = t.replace(/\(.*?\)/g, " ");
  t = t.replace(FORM_WORDS, " ");
  return t.replace(/[,;]+/g, " ").replace(/\s+/g, " ").trim();
}

function stripSalts(name: string): string {
  if (KEEP_WHOLE.has(name)) return name;
  const words = name.split(" ").filter(Boolean);
  if (words.length <= 1) return name;
  const kept = [words[0], ...words.slice(1).filter((w) => !SALTS.has(w))];
  return kept.join(" ");
}

function ingredientFromText(s: string, strict: boolean): string | undefined {
  const cleaned = cleanDrugText(s);
  if (!cleaned) return undefined;
  if (BRANDS[cleaned]) return BRANDS[cleaned];
  const parts = cleaned.split(/\s*(?:\/|\band\b|\+|&)\s*/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    if (BRANDS[p]) { out.push(BRANDS[p]); continue; }
    const first = p.split(" ")[0];
    if (BRANDS[first] && !KEEP_WHOLE.has(p)) { out.push(BRANDS[first]); continue; }
    if (!strict && NICKNAME.test(p)) return undefined;
    const base = stripSalts(p);
    if (!/^[a-z][a-z0-9 .'-]*$/.test(base)) return undefined;
    out.push(base);
  }
  if (!out.length) return undefined;
  return out.join(" / ");
}

function ingredientOf(e: Rec): { ingredient?: string; rxnormIn?: string } {
  const pick = isObj(e.picked_from_search) ? e.picked_from_search : undefined;
  const display = pick ? str(pick.display) : undefined;
  const rx = pick ? str(pick.rxnorm) : undefined;
  if (display) {
    const ing = ingredientFromText(display, true);
    if (ing) {
      // An ingredient-only search result (no strength, no form, no salt) carries an ingredient-level code.
      const bare = display.trim().toLowerCase();
      const ingredientOnly = !/\d/.test(bare) && !/\[/.test(bare) && cleanDrugText(bare) === bare && stripSalts(bare) === bare && !bare.includes("/");
      const res: { ingredient?: string; rxnormIn?: string } = { ingredient: ing };
      if (ingredientOnly && rx && /^\d+$/.test(rx.trim())) res.rxnormIn = rx.trim();
      return res;
    }
  }
  const name = str(e.name);
  if (name) {
    const ing = ingredientFromText(name, false);
    if (ing) return { ingredient: ing };
  }
  return {};
}

// ---------------------------------------------------------------- sensitivity

const MH = /\b(sertraline|fluoxetine|citalopram|escitalopram|paroxetine|fluvoxamine|venlafaxine|desvenlafaxine|duloxetine|bupropion|mirtazapine|vortioxetine|vilazodone|amitriptyline|nortriptyline|imipramine|clomipramine|doxepin|phenelzine|tranylcypromine|quetiapine|aripiprazole|olanzapine|risperidone|paliperidone|ziprasidone|lurasidone|cariprazine|brexpiprazole|clozapine|haloperidol|chlorpromazine|perphenazine|fluphenazine|asenapine|iloperidone|lithium|divalproex|buspirone|alprazolam|lorazepam|clonazepam|diazepam|methylphenidate|amphetamine|dextroamphetamine|lisdexamfetamine|atomoxetine|guanfacine er|esketamine)\b/;
const SU = /\b(buprenorphine|methadone|naltrexone|disulfiram|acamprosate|varenicline|lofexidine)\b/;
const SRH = /\b(levonorgestrel|norethindrone|ethinyl estradiol|drospirenone|desogestrel|norgestimate|etonogestrel|medroxyprogesterone|ulipristal|sildenafil|tadalafil|vardenafil|clomiphene|misoprostol|mifepristone|prenatal)\b/;
const HIV = /\b(emtricitabine|tenofovir|dolutegravir|bictegravir|elvitegravir|raltegravir|cabotegravir|efavirenz|rilpivirine|doravirine|nevirapine|darunavir|atazanavir|lopinavir|ritonavir|cobicistat|abacavir|lamivudine|zidovudine|maraviroc|lenacapavir)\b/;
const MH_TEXT = /\b(depress|anxiety|bipolar|schizo|psychos|ptsd|panic attack|adhd|mood)/;
const SU_TEXT = /\b(opioid use|alcohol use|addiction|sobriety|sober|recovery program|withdrawal)/;
const HIV_TEXT = /\b(hiv|prep\b|herpes|chlamydia|gonorrh|syphilis)/;
const SRH_TEXT = /\b(birth control|contracepti|pregnan|fertility|erectile|ivf\b)/;

function sensitivityOf(ingredient: string | undefined, e: Rec): Sensitivity[] | undefined {
  const name = `${ingredient ?? ""} ${str(e.name) ?? ""} ${isObj(e.picked_from_search) ? str(e.picked_from_search.display) ?? "" : ""}`.toLowerCase();
  const text = `${str(e.note) ?? ""} ${str(e.how_i_take_it) ?? ""}`.toLowerCase();
  const out: Sensitivity[] = [];
  if (MH.test(name) || MH_TEXT.test(text)) out.push("mental-health");
  if (SU.test(name) || SU_TEXT.test(text)) out.push("substance-use");
  if (SRH.test(name) || SRH_TEXT.test(text)) out.push("sexual-reproductive-health");
  if (HIV.test(name) || HIV_TEXT.test(text)) out.push("hiv-sti");
  return out.length ? out : undefined;
}

// ---------------------------------------------------------------- directions

type Freq = NonNullable<MedicationRow["frequency"]>;

const PRN_RE = /\b(as needed|as-needed|prn|when needed|if needed|as required|when necessary|if necessary|when i need|as necessary|when (?:my|i|it|the|needed)\b|if (?:my|i|it)\b)/;
const WEEKDAYS = /\b(mondays?|tuesdays?|wednesdays?|thursdays?|fridays?|saturdays?|sundays?|mon|tue|tues|wed|thu|thur|thurs|fri|sat|sun)\b/g;

function frequencyOf(how: string | undefined): Freq | undefined {
  if (!how) return undefined;
  const t = how.toLowerCase();
  if (PRN_RE.test(t)) return "PRN";
  if (/\btaper/.test(t)) return "other";
  if (/every other day|alternate days|every (2|two|second) days|\bqod\b/.test(t)) return "other";
  if (/four times|\b4 times|\b4x\b|\bqid\b|every [2-6] ?(hours|hrs|h)\b|every (two|three|four|six) hours/.test(t)) return "other";
  if (/month/.test(t)) return "other";
  if (/(twice|two times|2 times|2x|three times|3 times|3x) (a|per|each) week/.test(t)) return "other";
  const days = t.match(WEEKDAYS);
  if (days && new Set(days.map((d) => d.slice(0, 3))).size > 1) return "other";
  if (/\bweekly\b|once (a|per|each) week|every week|\bqw\b|a week\b/.test(t) || (days && days.length === 1)) return "QW";
  if (/most days|some days|sometimes|occasionally|now and then|on and off/.test(t)) return "other";
  if (/three times|\b3 times|\b3x\b|thrice|\btid\b|every 8 ?(hours|hrs|h)\b|every eight hours|with (each|every|all) meals?|with meals/.test(t)) return "TID";
  if (/twice|two times|\b2 times|\b2x\b|\bbid\b|every 12 ?(hours|hrs|h)\b|every twelve hours/.test(t)) return "BID";
  const slots = new Set<string>();
  if (/\b(morning|mornings|breakfast|am|a\.m\.|wake|waking|get up)\b/.test(t)) slots.add("am");
  if (/\b(noon|lunch|midday|afternoon)\b/.test(t)) slots.add("noon");
  if (/\b(evening|evenings|supper|dinner|pm|p\.m\.|tea ?time)\b/.test(t)) slots.add("pm");
  if (/\b(bedtime|bed time|bed|night|nights|nightly|qhs|hs)\b/.test(t)) slots.add("bed");
  if (slots.size >= 4) return "other";
  if (slots.size === 3) return "TID";
  if (slots.size === 2) return "BID";
  if (slots.size === 1) return slots.has("bed") ? "QHS" : "QD";
  if (/once (a|per|each) day|once daily|\bdaily\b|every day|each day|a day\b|per day|\bqd\b|\bonce\b/.test(t)) return "QD";
  return undefined;
}

type DoseUnit = NonNullable<MedicationRow["dose"]>["unit"];

function normUnit(u: string): { unit: DoseUnit; factor: number } | undefined {
  const x = u.toLowerCase().replace(/\.$/, "");
  if (x === "mg" || x === "milligram" || x === "milligrams" || x === "mgs") return { unit: "mg", factor: 1 };
  if (x === "g" || x === "gram" || x === "grams" || x === "gm") return { unit: "mg", factor: 1000 };
  if (x === "mcg" || x === "µg" || x === "ug" || x === "microgram" || x === "micrograms" || x === "mcgs") return { unit: "mcg", factor: 1 };
  if (x === "unit" || x === "units" || x === "u" || x === "iu" || x === "unt") return { unit: "units", factor: 1 };
  if (x === "ml" || x === "cc" || x === "mls") return { unit: "mL", factor: 1 };
  return undefined;
}

const AMOUNT_UNIT = "mg|mgs|milligrams?|mcg|mcgs|µg|ug|micrograms?|g|grams?|gm|units?|iu|u|unt|ml|mls|cc";
const COUNT_NOUN = "tablets?|tabs?|pills?|capsules?|caps?|puffs?|sprays?|inhalations?|actuations?|drops?|patch(?:es)?|lozenges?|gummies|gummy|softgels?";
const NUM_WORDS: Record<string, number> = { one: 1, a: 1, an: 1, two: 2, three: 3, four: 4, five: 5, half: 0.5, "1/2": 0.5, "½": 0.5 };

function parseNum(s: string): number | undefined {
  const k = s.toLowerCase();
  if (k in NUM_WORDS) return NUM_WORDS[k];
  const n = Number(k);
  return isFinite(n) ? n : undefined;
}

interface Strength { value: number; unit: DoseUnit; per?: "count" | { mL: number } }

function parseStrength(s: string | undefined): Strength | undefined | null {
  if (!s) return undefined;
  const t = s.toLowerCase().replace(/,(?=\d{3}\b)/g, "");
  const re = new RegExp(`(\\d+(?:\\.\\d+)?|\\.\\d+)\\s*(${AMOUNT_UNIT})\\b(?:\\s*(?:\\/|per)\\s*(\\d+(?:\\.\\d+)?)?\\s*(ml|cc|${COUNT_NOUN}|actuation|act|dose|inh)\\b)?`, "g");
  const found: Strength[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const u = normUnit(m[2]);
    if (!u) continue;
    let per: Strength["per"];
    if (m[4]) per = /^(ml|cc)$/.test(m[4]) ? { mL: m[3] ? Number(m[3]) : 1 } : "count";
    found.push({ value: round6(Number(m[1]) * u.factor), unit: u.unit, per });
  }
  if (!found.length) return undefined;
  if (found.length > 1) {
    // Combination strengths ("5 mg/325 mg") have no single amount.
    const f0 = found[0];
    if (found.some((f) => f.value !== f0.value || f.unit !== f0.unit)) return null;
  }
  return found[0];
}

function doseOf(strengthText: string | undefined, how: string | undefined, freq: Freq | undefined): MedicationRow["dose"] {
  if (!how) return undefined; // strength with no directions
  const t = how.toLowerCase().replace(/–|—/g, "-");
  if (/sliding|scale|depend|based on|according to|varies|per (my )?(reading|sugar|carb)|carb count|correction/.test(t)) return undefined;
  const numTok = "(?:\\d+(?:\\.\\d+)?|one|two|three|four|five|half)";
  if (new RegExp(`\\b${numTok}\\s*(?:-|to|or)\\s*${numTok}\\b(?!\\s*(?:hours?|hrs?|h\\b|days?|times|x\\b|weeks?|months?|am\\b|pm\\b|:|o'?clock))`).test(t)) return undefined;
  const strength = parseStrength(strengthText);
  if (strength === null) return undefined;

  // Explicit amount with a unit in the directions.
  const amt = new RegExp(`(\\d+(?:\\.\\d+)?|\\.\\d+)\\s*(${AMOUNT_UNIT})\\b`, "g");
  const amounts: { value: number; unit: DoseUnit }[] = [];
  let m: RegExpExecArray | null;
  while ((m = amt.exec(t))) {
    const u = normUnit(m[2]);
    if (u) amounts.push({ value: round6(Number(m[1]) * u.factor), unit: u.unit });
  }
  if (amounts.length) {
    if (amounts.some((a) => a.value !== amounts[0].value || a.unit !== amounts[0].unit)) return undefined;
    const a = amounts[0];
    if (a.unit === "mL" && strength && typeof strength.per === "object" && strength.unit !== "mL") {
      return { value: round6((strength.value * a.value) / strength.per.mL), unit: strength.unit };
    }
    return a;
  }

  // A count of units.
  let count: number | undefined;
  let countNoun: string | undefined;
  const cm = new RegExp(`(\\d+(?:\\.\\d+)?|1\\/2|½|one|two|three|four|five|half|an|a)\\s*(?:a\\s+|of\\s+a\\s+|an?\\s+)?(${COUNT_NOUN})\\b`).exec(t);
  if (cm) {
    count = parseNum(cm[1]);
    countNoun = cm[2];
  } else {
    const bare = /(?:^|\btake\s+|\btaking\s+)(\d+(?:\.\d+)?|one|two|three|four|half)\b(?!\s*(?:am|pm|a\.m|p\.m|:|o'?clock|hours?|hrs?|times|x\b|days?|weeks?|months?|%))/.exec(t);
    if (bare) count = parseNum(bare[1]);
  }
  const counts = t.match(new RegExp(`\\d+(?:\\.\\d+)?\\s*(?:${COUNT_NOUN})\\b`, "g"));
  if (counts && new Set(counts.map((c) => parseFloat(c))).size > 1) return undefined;

  if (count === undefined) {
    // No count: a time or schedule means one unit; a condition means no single amount.
    if (!freq || freq === "PRN") return undefined;
    count = 1;
  }
  if (!(count > 0)) return undefined;

  if (strength) {
    if (typeof strength.per === "object") return undefined; // concentration without a volume
    if (strength.unit === "mL") return undefined;
    return { value: round6(strength.value * count), unit: strength.unit };
  }
  if (!countNoun || /^(tablets?|tabs?|pills?|capsules?|caps?)$/.test(countNoun)) {
    // Strength unknown: count of tablets (only when the directions are tablet-like).
    if (countNoun || cm === null) return countNoun ? { value: count, unit: "tablet" } : undefined;
  }
  return undefined;
}

// ---------------------------------------------------------------- status

const NEG = /\b(not|never|n't|no)\s+$/;

function matchesUnnegated(t: string, re: RegExp): boolean {
  const g = new RegExp(re.source, "g");
  let m: RegExpExecArray | null;
  while ((m = g.exec(t))) {
    const before = t.slice(Math.max(0, m.index - 12), m.index);
    if (!NEG.test(before)) return true;
    if (m[0].length === 0) g.lastIndex++;
  }
  return false;
}

const TEMP_RE = /\b(on hold|holding|hold off|hold it|held|paused?|pausing|for now|for the time being|temporar(?:y|ily)|until (?:after|my|the|i|we|next|further|surgery|dr|doctor|it|labs?|blood|kidney|procedure|colonoscopy|recover|healed|better|back)|till (?:after|my|the|i|next)|(?:will|can|may|to|might|going to|plan to|should|could)\s+(?:re-?start|resume|go back on)|taking a break|break from|for a (?:few|couple)|off (?:it|them) (?:for|until))\b/;
const STOPPED_RE = /\b(stopped|quit|not taking|no longer tak|don'?t take|do not take|haven'?t taken|not on it|off (?:it|of it|them))/;

function stopReasonOf(note: string): MedicationRow["stop_reason"] {
  const t = note.toLowerCase();
  if (/side effect|made me|gave me|caused|rash|hives|itch|swell|cough|dizz|nause|vomit|diarrh|upset (?:my )?stomach|stomach (?:upset|pain|issues|problems)|allerg|reaction|cramp|muscle (?:pain|ache)|bleed|bruis|couldn'?t tolerate|intoleran|low blood sugar|hypo\b|lows\b|yeast infection/.test(t)) return "adverse_reaction";
  if (/didn'?t (?:work|help|do anything)|did not (?:work|help)|not working|wasn'?t (?:working|helping)|stopped working|no (?:effect|help|difference)|ineffective|did nothing|useless/.test(t)) return "ineffective";
  if (/switch|changed (?:me )?(?:to|over)|replaced|instead|swapped|moved (?:me )?to|now (?:on|taking)|put me on|started me on|in place of/.test(t)) return "therapy_changed";
  if (/finished|completed|course (?:is |was )?(?:done|over|finished)|done with (?:the|it)|all done|ran its course|end of (?:the )?course|only for \d+ days/.test(t)) return "course_complete";
  if (/i decided|my (?:own )?(?:choice|decision)|didn'?t (?:want|like)|don'?t (?:want|like)|chose to|on my own|my own|cost|expensive|afford/.test(t)) return "patient_choice";
  return undefined;
}

// ---------------------------------------------------------------- medications

function medicationRow(item: FolioItem, entryId: string, e: Rec): MedicationRow | undefined {
  const name = str(e.name) ?? (isObj(e.picked_from_search) ? str(e.picked_from_search.display) : undefined);
  if (!name) return undefined;
  const { ingredient, rxnormIn } = ingredientOf(e);
  const note = str(e.note);
  const how = str(e.how_i_take_it);
  const annot = `${note ?? ""} ${how ?? ""}`.toLowerCase();

  let status: MedicationRow["status"];
  if (e.status === "stopped") status = matchesUnnegated(annot, TEMP_RE) ? "held" : "stopped";
  else if (e.status === "taking") status = matchesUnnegated(annot, TEMP_RE) || matchesUnnegated(annot, STOPPED_RE) ? "held" : "active";
  else status = "unknown";

  const row: MedicationRow = { drug_name: name, status, patient_reported: true, evidence: [{ item_id: item.id, entry_id: entryId }] };
  if (ingredient) row.ingredient = ingredient;
  if (rxnormIn) row.rxnorm_ingredient = rxnormIn;

  let since: string | undefined;
  if (status === "active") since = partialDate(e.started);
  else if (status === "stopped") since = partialDate(e.stopped);
  else if (status === "held" && e.status === "stopped") since = partialDate(e.stopped);
  if (since) row.status_since = since;

  const freq = frequencyOf(how);
  let dose: MedicationRow["dose"];
  try {
    dose = doseOf(str(e.strength_text), how, freq);
  } catch {
    dose = undefined;
  }
  if (dose) row.dose = dose;
  if (freq) row.frequency = freq;

  if (status === "stopped" && note) {
    const r = stopReasonOf(note);
    if (r) row.stop_reason = r;
  }
  if ((status === "stopped" || status === "held") && note) row.status_reason_text = note;
  if (e.kind === "over_the_counter") row.otc = true;
  const sens = sensitivityOf(ingredient, e);
  if (sens) row.sensitivity = sens;
  return row;
}

const STATUS_RANK: Record<string, number> = { active: 3, held: 2, stopped: 1, unknown: 0 };

function medications(items: FolioItem[]): MedicationRow[] {
  const lists = items.filter(isMedList).sort(cmpRecorded);
  const list = lists[lists.length - 1];
  if (!list) return [];
  const groups = new Map<string, MedicationRow>();
  const order: string[] = [];
  for (const [id, e] of entriesOf(list)) {
    if (e.type !== "my_med") continue;
    let row: MedicationRow | undefined;
    try {
      row = medicationRow(list, id, e);
    } catch {
      row = undefined;
    }
    if (!row) continue;
    const key = row.ingredient ? `i:${row.ingredient}` : `n:${row.drug_name.trim().toLowerCase()}`;
    const prev = groups.get(key);
    if (!prev) {
      groups.set(key, row);
      order.push(key);
      continue;
    }
    // The same drug twice on one list: one row; keep the entry the patient says is in use, merge evidence.
    const keepNew = STATUS_RANK[row.status] > STATUS_RANK[prev.status];
    const winner = keepNew ? row : prev;
    const loser = keepNew ? prev : row;
    winner.evidence = [...winner.evidence, ...loser.evidence];
    groups.set(key, winner);
  }
  return order.map((k) => groups.get(k)!);
}

// ---------------------------------------------------------------- entry point

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return out;
  let counting: FolioItem[];
  try {
    counting = countingItems(items, asOf);
  } catch {
    return out;
  }
  try {
    out.medications = medications(counting);
  } catch {
    out.medications = [];
  }
  try {
    out.vitals = vitals(counting);
  } catch {
    out.vitals = [];
  }
  return out;
}

