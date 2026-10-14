import type {
  FolioItem,
  ViewRows,
  MedicationRow,
  VitalRow,
  Evidence,
  Sensitivity,
} from "../in/views/views";

// Mapper for HomeLog (did:web:homelog.example), a patient-facing home log app.
// Payload entries: bp_reading, glucose_reading, dose_log, diary_note, my_med.
// - my_med entries form the patient's "My Medicines" list; each saved list is a full snapshot.
// - bp_reading / glucose_reading are home vitals.
// - dose_log and diary_note produce no rows.

const TZ = "America/Chicago";

// ---------------------------------------------------------------- time helpers

let dtf: Intl.DateTimeFormat | null = null;
function chicagoParts(ms: number): { y: string; mo: string; d: string; h: string; mi: string } | null {
  try {
    if (!dtf) {
      dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      });
    }
    const parts: Record<string, string> = {};
    for (const p of dtf.formatToParts(new Date(ms))) parts[p.type] = p.value;
    const h = parts.hour === "24" ? "00" : parts.hour;
    return { y: parts.year, mo: parts.month, d: parts.day, h, mi: parts.minute };
  } catch {
    return null;
  }
}

const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;
const LOCAL_DT = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/;

/** Local wall-clock `YYYY-MM-DDTHH:MM` for a date-time string, or null. */
function localDateTime(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  const m = LOCAL_DT.exec(t);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
  if (/^\d{4}-\d{2}-\d{2}T/.test(t) && HAS_ZONE.test(t)) {
    const ms = Date.parse(t);
    if (!Number.isFinite(ms)) return null;
    const p = chicagoParts(ms);
    if (!p) return null;
    return `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}`;
  }
  return null;
}

/** Local date `YYYY-MM-DD` of a date or date-time string, or null. */
function localDate(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const ldt = localDateTime(t);
  return ldt ? ldt.slice(0, 10) : null;
}

/** Sortable key (UTC ms where possible) for a date-time string. */
function instantKey(s: unknown): number {
  if (typeof s !== "string") return Number.NEGATIVE_INFINITY;
  const t = s.trim();
  if (HAS_ZONE.test(t)) {
    const ms = Date.parse(t);
    if (Number.isFinite(ms)) return ms;
  }
  // Local time without zone: approximate using its wall clock as UTC, plus a typical Chicago offset.
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(t);
  if (m) {
    return Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0)) + 6 * 3600 * 1000;
  }
  return Number.NEGATIVE_INFINITY;
}

/** Minutes since epoch of a local wall-clock `YYYY-MM-DDTHH:MM` (treated as UTC; only differences matter). */
function wallMinutes(ldt: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(ldt);
  if (!m) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) / 60000;
}

const MONTHS: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6,
  jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11,
  november: 11, dec: 12, december: 12,
};
const pad2 = (n: number) => String(n).padStart(2, "0");
function validYMD(y: number, m: number, d?: number): boolean {
  if (!(y >= 1900 && y <= 2100 && m >= 1 && m <= 12)) return false;
  if (d === undefined) return true;
  const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return d >= 1 && d <= dim;
}

/** A patient-entered date, kept at its own precision (YYYY, YYYY-MM, YYYY-MM-DD). */
function partialDate(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim().replace(/\.$/, "");
  if (!t) return null;
  let m: RegExpExecArray | null;
  if ((m = /^(\d{4})$/.exec(t))) return validYMD(+m[1], 1) ? m[1] : null;
  if ((m = /^(\d{4})[-/](\d{1,2})$/.exec(t))) return validYMD(+m[1], +m[2]) ? `${m[1]}-${pad2(+m[2])}` : null;
  if ((m = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(t)))
    return validYMD(+m[1], +m[2], +m[3]) ? `${m[1]}-${pad2(+m[2])}-${pad2(+m[3])}` : null;
  if (/^\d{4}-\d{2}-\d{2}[T ]/.test(t)) return localDate(t);
  if ((m = /^(\d{1,2})\/(\d{4})$/.exec(t))) return validYMD(+m[2], +m[1]) ? `${m[2]}-${pad2(+m[1])}` : null;
  if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t)))
    return validYMD(+m[3], +m[1], +m[2]) ? `${m[3]}-${pad2(+m[1])}-${pad2(+m[2])}` : null;
  if ((m = /^([A-Za-z]+)\.?,?\s+(\d{4})$/.exec(t))) {
    const mo = MONTHS[m[1].toLowerCase()];
    return mo && validYMD(+m[2], mo) ? `${m[2]}-${pad2(mo)}` : null;
  }
  if ((m = /^([A-Za-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/.exec(t))) {
    const mo = MONTHS[m[1].toLowerCase()];
    return mo && validYMD(+m[3], mo, +m[2]) ? `${m[3]}-${pad2(mo)}-${pad2(+m[2])}` : null;
  }
  if ((m = /^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\.?,?\s+(\d{4})$/.exec(t))) {
    const mo = MONTHS[m[2].toLowerCase()];
    return mo && validYMD(+m[3], mo, +m[1]) ? `${m[3]}-${pad2(mo)}-${pad2(+m[1])}` : null;
  }
  return null;
}

// ---------------------------------------------------------------- as-of / supersession

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const eligible = new Map<string, FolioItem>();
  for (const it of items) {
    if (!it || typeof it !== "object" || typeof it.id !== "string") continue;
    const d = localDate(it.recorded);
    if (!d || d > asOf) continue;
    eligible.set(it.id, it);
  }
  const ids = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
  const retracted = new Set<string>();
  for (const it of eligible.values()) for (const r of ids(it.retracts)) retracted.add(r);
  const removed = new Set<string>(retracted);
  for (const it of eligible.values()) {
    if (retracted.has(it.id)) continue;
    const stack = ids(it.supersedes);
    while (stack.length) {
      const s = stack.pop()!;
      if (removed.has(s) && !retracted.has(s)) continue;
      removed.add(s);
      const target = eligible.get(s);
      if (target) stack.push(...ids(target.supersedes));
    }
  }
  return [...eligible.values()].filter((it) => !removed.has(it.id));
}

function naturalCmp(a: string, b: string): number {
  const ra = /^(.*?)(\d+)$/.exec(a), rb = /^(.*?)(\d+)$/.exec(b);
  if (ra && rb && ra[1] === rb[1]) return +ra[2] - +rb[2];
  return a < b ? -1 : a > b ? 1 : 0;
}

function payloadEntries(it: FolioItem): [string, Record<string, any>][] {
  const p = it.payload;
  if (!p || typeof p !== "object") return [];
  const out: [string, Record<string, any>][] = [];
  for (const k of Object.keys(p).sort(naturalCmp)) {
    const e = (p as Record<string, any>)[k];
    if (e && typeof e === "object" && !Array.isArray(e) && typeof e.type === "string") out.push([k, e]);
  }
  return out;
}

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

// ---------------------------------------------------------------- vitals

interface Reading {
  kind: "bp" | "glu";
  time: string;
  device: boolean;
  sys?: number;
  dia?: number;
  pulse?: number;
  glu?: number;
  oor?: "HI" | "LO";
  evidence: Evidence;
  order: number;
}

const MMOL_TO_MGDL = 18.016;

function readings(items: FolioItem[]): Reading[] {
  const out: Reading[] = [];
  let order = 0;
  for (const it of items) {
    for (const [eid, e] of payloadEntries(it)) {
      if (e.type === "bp_reading") {
        const time = localDateTime(e.measured_at);
        const sys = num(e.systolic_mmhg);
        const dia = num(e.diastolic_mmhg);
        const pulse = num(e.pulse_bpm);
        if (!time || (sys === null && dia === null && pulse === null)) continue;
        const r: Reading = { kind: "bp", time, device: e.entry_method === "cuff_sync", evidence: [{ item_id: it.id, entry_id: eid }], order: order++ };
        if (sys !== null) r.sys = sys;
        if (dia !== null) r.dia = dia;
        if (pulse !== null) r.pulse = pulse;
        out.push(r);
      } else if (e.type === "glucose_reading") {
        const time = localDateTime(e.measured_at);
        if (!time) continue;
        const unit = typeof e.unit === "string" ? e.unit.trim().toLowerCase() : "";
        const oor = e.out_of_range === "HI" || e.out_of_range === "LO" ? (e.out_of_range as "HI" | "LO") : undefined;
        let v = num(e.value);
        let mg: number | null = null;
        if (v !== null) {
          if (unit === "mg/dl") mg = Math.round(v);
          else if (unit === "mmol/l") mg = Math.round(v * MMOL_TO_MGDL);
        }
        if (mg === null && oor) mg = oor === "HI" ? 600 : 20; // common meter display limits when no value is given
        if (mg === null) continue;
        const r: Reading = { kind: "glu", time, device: e.entry_method === "meter_sync", glu: mg, evidence: [{ item_id: it.id, entry_id: eid }], order: order++ };
        if (oor) r.oor = oor;
        out.push(r);
      }
    }
  }
  return out;
}

function sameValues(a: Reading, b: Reading): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "bp") {
    if (a.sys !== b.sys || a.dia !== b.dia) return false;
    if (a.pulse !== undefined && b.pulse !== undefined && a.pulse !== b.pulse) return false;
    return true;
  }
  return a.glu === b.glu && a.oor === b.oor;
}

function vitalRows(items: FolioItem[]): VitalRow[] {
  const rs = readings(items);
  // Exact copies (same kind, time, values, method) are one reading.
  const merged: Reading[] = [];
  for (const r of rs) {
    const dup = merged.find((m) => m.time === r.time && m.device === r.device && sameValues(m, r));
    if (dup) {
      dup.evidence.push(...r.evidence);
      if (dup.pulse === undefined && r.pulse !== undefined) dup.pulse = r.pulse;
    } else merged.push(r);
  }
  // A typed reading duplicating a device reading taken shortly before with the same values: keep the device copy.
  const kept: Reading[] = [];
  for (const r of merged) {
    if (!r.device) {
      const tm = wallMinutes(r.time);
      const dev = merged.find((d) => d.device && sameValues(d, r) && Math.abs(tm - wallMinutes(d.time)) <= 5);
      if (dev) {
        dev.evidence.push(...r.evidence);
        if (dev.pulse === undefined && r.pulse !== undefined) dev.pulse = r.pulse;
        continue;
      }
    }
    kept.push(r);
  }
  kept.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : a.order - b.order));
  return kept.map((r) => {
    const row: VitalRow = { setting: "home", local_time: r.time, evidence: r.evidence };
    if (r.kind === "bp") {
      if (r.sys !== undefined) row.systolic_mmhg = r.sys;
      if (r.dia !== undefined) row.diastolic_mmhg = r.dia;
      if (r.pulse !== undefined) row.pulse_bpm = r.pulse;
    } else {
      row.glucose_mg_dl = r.glu;
      if (r.oor) row.glucose_out_of_range = r.oor;
    }
    return row;
  });
}

// ---------------------------------------------------------------- medications: names

// Brand (and common misspelled/short) names → generic ingredient(s).
const BRANDS: Record<string, string[]> = {
  zestril: ["lisinopril"], prinivil: ["lisinopril"], norvasc: ["amlodipine"], glucophage: ["metformin"],
  "glucophage xr": ["metformin"], glumetza: ["metformin"], fortamet: ["metformin"], riomet: ["metformin"],
  glucotrol: ["glipizide"], "glucotrol xl": ["glipizide"], amaryl: ["glimepiride"], diabeta: ["glyburide"], micronase: ["glyburide"],
  crestor: ["rosuvastatin"], lipitor: ["atorvastatin"], zocor: ["simvastatin"], pravachol: ["pravastatin"], livalo: ["pitavastatin"],
  mevacor: ["lovastatin"], zetia: ["ezetimibe"], vytorin: ["ezetimibe", "simvastatin"], tricor: ["fenofibrate"], lopid: ["gemfibrozil"],
  synthroid: ["levothyroxine"], levoxyl: ["levothyroxine"], unithroid: ["levothyroxine"], euthyrox: ["levothyroxine"], tirosint: ["levothyroxine"],
  armour: ["thyroid"], cytomel: ["liothyronine"],
  farxiga: ["dapagliflozin"], jardiance: ["empagliflozin"], invokana: ["canagliflozin"], steglatro: ["ertugliflozin"],
  januvia: ["sitagliptin"], tradjenta: ["linagliptin"], onglyza: ["saxagliptin"], nesina: ["alogliptin"],
  janumet: ["sitagliptin", "metformin"], "janumet xr": ["sitagliptin", "metformin"], jentadueto: ["linagliptin", "metformin"],
  synjardy: ["empagliflozin", "metformin"], xigduo: ["dapagliflozin", "metformin"], "xigduo xr": ["dapagliflozin", "metformin"],
  glyxambi: ["empagliflozin", "linagliptin"], actos: ["pioglitazone"], avandia: ["rosiglitazone"],
  ozempic: ["semaglutide"], wegovy: ["semaglutide"], rybelsus: ["semaglutide"], victoza: ["liraglutide"], saxenda: ["liraglutide"],
  trulicity: ["dulaglutide"], byetta: ["exenatide"], bydureon: ["exenatide"], mounjaro: ["tirzepatide"], zepbound: ["tirzepatide"],
  lantus: ["insulin glargine"], basaglar: ["insulin glargine"], toujeo: ["insulin glargine"], semglee: ["insulin glargine"],
  levemir: ["insulin detemir"], tresiba: ["insulin degludec"], humalog: ["insulin lispro"], admelog: ["insulin lispro"], lyumjev: ["insulin lispro"],
  novolog: ["insulin aspart"], fiasp: ["insulin aspart"], apidra: ["insulin glulisine"],
  "humulin r": ["insulin regular, human"], "novolin r": ["insulin regular, human"],
  "humulin n": ["insulin isophane, human"], "novolin n": ["insulin isophane, human"],
  vasotec: ["enalapril"], altace: ["ramipril"], lotensin: ["benazepril"], accupril: ["quinapril"], monopril: ["fosinopril"],
  cozaar: ["losartan"], diovan: ["valsartan"], benicar: ["olmesartan"], avapro: ["irbesartan"], micardis: ["telmisartan"], atacand: ["candesartan"],
  hyzaar: ["losartan", "hydrochlorothiazide"], "diovan hct": ["valsartan", "hydrochlorothiazide"], "benicar hct": ["olmesartan", "hydrochlorothiazide"],
  zestoretic: ["lisinopril", "hydrochlorothiazide"], lotrel: ["amlodipine", "benazepril"], exforge: ["amlodipine", "valsartan"], azor: ["amlodipine", "olmesartan"],
  entresto: ["sacubitril", "valsartan"],
  toprol: ["metoprolol"], "toprol xl": ["metoprolol"], "toprol-xl": ["metoprolol"], lopressor: ["metoprolol"], tenormin: ["atenolol"], coreg: ["carvedilol"],
  bystolic: ["nebivolol"], inderal: ["propranolol"], zebeta: ["bisoprolol"],
  cardizem: ["diltiazem"], procardia: ["nifedipine"], adalat: ["nifedipine"], calan: ["verapamil"],
  lasix: ["furosemide"], bumex: ["bumetanide"], demadex: ["torsemide"], microzide: ["hydrochlorothiazide"], hctz: ["hydrochlorothiazide"],
  aldactone: ["spironolactone"], inspra: ["eplerenone"], kerendia: ["finerenone"], maxzide: ["triamterene", "hydrochlorothiazide"], dyazide: ["triamterene", "hydrochlorothiazide"],
  catapres: ["clonidine"], apresoline: ["hydralazine"], cardura: ["doxazosin"], minipress: ["prazosin"], hytrin: ["terazosin"],
  lanoxin: ["digoxin"], coumadin: ["warfarin"], jantoven: ["warfarin"], eliquis: ["apixaban"], xarelto: ["rivaroxaban"], pradaxa: ["dabigatran"],
  plavix: ["clopidogrel"], brilinta: ["ticagrelor"], effient: ["prasugrel"], imdur: ["isosorbide mononitrate"], nitrostat: ["nitroglycerin"],
  aspirin: ["aspirin"], bayer: ["aspirin"], ecotrin: ["aspirin"], "baby aspirin": ["aspirin"], asa: ["aspirin"],
  tylenol: ["acetaminophen"], paracetamol: ["acetaminophen"], advil: ["ibuprofen"], motrin: ["ibuprofen"], aleve: ["naproxen"], naprosyn: ["naproxen"],
  anaprox: ["naproxen"], celebrex: ["celecoxib"], mobic: ["meloxicam"], voltaren: ["diclofenac"], excedrin: ["acetaminophen", "aspirin", "caffeine"],
  ultram: ["tramadol"], norco: ["hydrocodone", "acetaminophen"], vicodin: ["hydrocodone", "acetaminophen"], percocet: ["oxycodone", "acetaminophen"],
  oxycontin: ["oxycodone"], neurontin: ["gabapentin"], lyrica: ["pregabalin"], flexeril: ["cyclobenzaprine"],
  prilosec: ["omeprazole"], nexium: ["esomeprazole"], protonix: ["pantoprazole"], prevacid: ["lansoprazole"], aciphex: ["rabeprazole"], dexilant: ["dexlansoprazole"],
  pepcid: ["famotidine"], zantac: ["ranitidine"], tums: ["calcium carbonate"], "milk of magnesia": ["magnesium hydroxide"],
  miralax: ["polyethylene glycol 3350"], colace: ["docusate"], senokot: ["senna"], dulcolax: ["bisacodyl"], imodium: ["loperamide"],
  zofran: ["ondansetron"], reglan: ["metoclopramide"],
  claritin: ["loratadine"], zyrtec: ["cetirizine"], allegra: ["fexofenadine"], xyzal: ["levocetirizine"], benadryl: ["diphenhydramine"],
  flonase: ["fluticasone"], nasonex: ["mometasone"], singulair: ["montelukast"], sudafed: ["pseudoephedrine"], mucinex: ["guaifenesin"],
  ventolin: ["albuterol"], "ventolin hfa": ["albuterol"], proair: ["albuterol"], "proair hfa": ["albuterol"], proventil: ["albuterol"], salbutamol: ["albuterol"],
  flovent: ["fluticasone"], qvar: ["beclomethasone"], pulmicort: ["budesonide"], spiriva: ["tiotropium"],
  advair: ["fluticasone", "salmeterol"], symbicort: ["budesonide", "formoterol"], breo: ["fluticasone", "vilanterol"], "breo ellipta": ["fluticasone", "vilanterol"],
  trelegy: ["fluticasone", "umeclidinium", "vilanterol"], anoro: ["umeclidinium", "vilanterol"],
  zyloprim: ["allopurinol"], uloric: ["febuxostat"], colcrys: ["colchicine"], mitigare: ["colchicine"],
  fosamax: ["alendronate"], boniva: ["ibandronate"], actonel: ["risedronate"], prolia: ["denosumab"],
  flomax: ["tamsulosin"], proscar: ["finasteride"], avodart: ["dutasteride"], detrol: ["tolterodine"], ditropan: ["oxybutynin"], myrbetriq: ["mirabegron"],
  viagra: ["sildenafil"], cialis: ["tadalafil"], levitra: ["vardenafil"],
  prednisone: ["prednisone"], deltasone: ["prednisone"], medrol: ["methylprednisolone"], decadron: ["dexamethasone"],
  amoxil: ["amoxicillin"], augmentin: ["amoxicillin", "clavulanate"], keflex: ["cephalexin"], zithromax: ["azithromycin"], "z-pak": ["azithromycin"], zpak: ["azithromycin"],
  cipro: ["ciprofloxacin"], levaquin: ["levofloxacin"], bactrim: ["sulfamethoxazole", "trimethoprim"], "bactrim ds": ["sulfamethoxazole", "trimethoprim"],
  macrobid: ["nitrofurantoin"], doxy: ["doxycycline"], vibramycin: ["doxycycline"], flagyl: ["metronidazole"], valtrex: ["valacyclovir"], tamiflu: ["oseltamivir"],
  zoloft: ["sertraline"], prozac: ["fluoxetine"], paxil: ["paroxetine"], celexa: ["citalopram"], lexapro: ["escitalopram"], effexor: ["venlafaxine"],
  "effexor xr": ["venlafaxine"], pristiq: ["desvenlafaxine"], cymbalta: ["duloxetine"], wellbutrin: ["bupropion"], "wellbutrin xl": ["bupropion"],
  zyban: ["bupropion"], remeron: ["mirtazapine"], desyrel: ["trazodone"], trintellix: ["vortioxetine"], elavil: ["amitriptyline"], pamelor: ["nortriptyline"],
  seroquel: ["quetiapine"], abilify: ["aripiprazole"], risperdal: ["risperidone"], zyprexa: ["olanzapine"], latuda: ["lurasidone"], geodon: ["ziprasidone"],
  vraylar: ["cariprazine"], rexulti: ["brexpiprazole"], clozaril: ["clozapine"], haldol: ["haloperidol"], lithobid: ["lithium"], lamictal: ["lamotrigine"],
  depakote: ["divalproex"], tegretol: ["carbamazepine"], trileptal: ["oxcarbazepine"], keppra: ["levetiracetam"], topamax: ["topiramate"], dilantin: ["phenytoin"],
  xanax: ["alprazolam"], ativan: ["lorazepam"], klonopin: ["clonazepam"], valium: ["diazepam"], buspar: ["buspirone"], ambien: ["zolpidem"], lunesta: ["eszopiclone"],
  adderall: ["amphetamine", "dextroamphetamine"], ritalin: ["methylphenidate"], concerta: ["methylphenidate"], vyvanse: ["lisdexamfetamine"], strattera: ["atomoxetine"],
  suboxone: ["buprenorphine", "naloxone"], subutex: ["buprenorphine"], zubsolv: ["buprenorphine", "naloxone"], sublocade: ["buprenorphine"],
  vivitrol: ["naltrexone"], revia: ["naltrexone"], antabuse: ["disulfiram"], campral: ["acamprosate"], chantix: ["varenicline"], narcan: ["naloxone"],
  biktarvy: ["bictegravir", "emtricitabine", "tenofovir alafenamide"], truvada: ["emtricitabine", "tenofovir disoproxil"],
  descovy: ["emtricitabine", "tenofovir alafenamide"], genvoya: ["elvitegravir", "cobicistat", "emtricitabine", "tenofovir alafenamide"],
  triumeq: ["abacavir", "dolutegravir", "lamivudine"], tivicay: ["dolutegravir"], isentress: ["raltegravir"], prezista: ["darunavir"],
  dovato: ["dolutegravir", "lamivudine"], juluca: ["dolutegravir", "rilpivirine"], odefsey: ["emtricitabine", "rilpivirine", "tenofovir alafenamide"],
  atripla: ["efavirenz", "emtricitabine", "tenofovir disoproxil"], cabenuva: ["cabotegravir", "rilpivirine"], apretude: ["cabotegravir"],
  "plan b": ["levonorgestrel"], mirena: ["levonorgestrel"], nexplanon: ["etonogestrel"], nuvaring: ["etonogestrel", "ethinyl estradiol"],
  "depo-provera": ["medroxyprogesterone"], yaz: ["drospirenone", "ethinyl estradiol"], yasmin: ["drospirenone", "ethinyl estradiol"],
  "ortho tri-cyclen": ["norgestimate", "ethinyl estradiol"], sprintec: ["norgestimate", "ethinyl estradiol"], "micronor": ["norethindrone"],
  premarin: ["estrogens, conjugated"], estrace: ["estradiol"], prometrium: ["progesterone"], clomid: ["clomiphene"],
  "vitamin d": ["cholecalciferol"], "vitamin d3": ["cholecalciferol"], "vitamin b12": ["cyanocobalamin"], "b12": ["cyanocobalamin"],
  "fish oil": ["omega-3 acid ethyl esters"], "folic acid": ["folic acid"], "iron": ["ferrous sulfate"], "potassium": ["potassium chloride"],
  "k-dur": ["potassium chloride"], "klor-con": ["potassium chloride"],
  plaquenil: ["hydroxychloroquine"], "trexall": ["methotrexate"], humira: ["adalimumab"], enbrel: ["etanercept"],
  aricept: ["donepezil"], namenda: ["memantine"], sinemet: ["carbidopa", "levodopa"], requip: ["ropinirole"], mirapex: ["pramipexole"],
  imitrex: ["sumatriptan"], xalatan: ["latanoprost"], timoptic: ["timolol"],
};

// Ingredient names that are themselves salts/compounds and must not be stripped.
const KEEP_WHOLE = new Set([
  "potassium chloride", "sodium chloride", "sodium bicarbonate", "calcium carbonate", "calcium acetate", "calcium citrate",
  "magnesium oxide", "magnesium hydroxide", "magnesium citrate", "magnesium sulfate", "ferrous sulfate", "ferrous gluconate",
  "ferrous fumarate", "potassium citrate", "zinc sulfate", "zinc oxide", "sodium fluoride", "lithium carbonate", "lithium citrate",
  "isosorbide mononitrate", "isosorbide dinitrate", "polyethylene glycol 3350", "sevelamer carbonate", "lanthanum carbonate",
  "sodium polystyrene sulfonate", "ferric citrate", "aluminum hydroxide",
]);
const KEEP_RENAME: Record<string, string> = { "lithium carbonate": "lithium", "lithium citrate": "lithium" };

const SALT_WORDS = new Set([
  "hydrochloride", "hcl", "dihydrochloride", "sodium", "potassium", "calcium", "magnesium", "maleate", "besylate", "besilate",
  "succinate", "tartrate", "mesylate", "fumarate", "hemifumarate", "sulfate", "citrate", "acetate", "hyclate", "monohydrate", "trihydrate",
  "dihydrate", "bromide", "phosphate", "propionate", "dipropionate", "furoate", "xinafoate", "bitartrate", "hydrobromide",
  "disodium", "anhydrous", "medoxomil", "cilexetil", "axetil", "pivoxil", "monosodium", "chloride", "nitrate", "gluconate",
  "lactate", "valerate", "cypionate", "enanthate", "decanoate", "palmitate", "pamoate", "embonate", "oxalate", "napsylate",
  "hydrate", "dimesylate", "erbumine", "tromethamine", "olamine", "carbonate", "aspartate", "mononitrate",
]);
// Words of dosage form / release that may follow the name when no strength separates them.
const FORM_WORDS = new Set([
  "oral", "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "pill", "pills", "solution", "suspension",
  "injection", "injectable", "inhaler", "inhalation", "hfa", "er", "xr", "xl", "sr", "cr", "dr", "la", "ec", "extended",
  "delayed", "release", "chewable", "pen", "spray", "nasal", "cream", "ointment", "gel", "patch", "drops", "liquid",
  "syrup", "film", "coated", "disintegrating", "odt", "sublingual", "topical", "ophthalmic", "otic", "vial", "kit", "prefilled",
  "syringe", "auto-injector", "autoinjector", "powder", "aerosol", "metered", "dose", "actuat", "lozenge", "gum", "elixir",
]);

function cleanIngredient(raw: string): string | null {
  let s = raw.toLowerCase().replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ").replace(/\([^)]*\)/g, " ");
  s = s.replace(/^\s*\d+(\.\d+)?\s*hr\s+/, ""); // "24 HR metformin ..."
  s = s.replace(/\s+/g, " ").trim();
  // Cut at the first strength-like token.
  const cut = /\s\d|\s\.\d/.exec(" " + s);
  if (cut && cut.index > 0) s = s.slice(0, cut.index - 1).trim();
  else if (cut && cut.index === 0) return null;
  let words = s.split(" ").filter(Boolean);
  while (words.length && FORM_WORDS.has(words[words.length - 1])) words.pop();
  s = words.join(" ");
  if (!s) return null;
  if (KEEP_WHOLE.has(s)) return KEEP_RENAME[s] ?? s;
  for (const k of KEEP_WHOLE) if (s.startsWith(k + " ")) return KEEP_RENAME[k] ?? k;
  words = s.split(" ");
  while (words.length > 1 && SALT_WORDS.has(words[words.length - 1])) words.pop();
  s = words.join(" ");
  if (!/[a-z]/.test(s)) return null;
  return s;
}

/** Ingredient(s) for a free-text name: a brand lookup, else the cleaned name. */
function ingredientsFromName(name: string): string[] | null {
  const lower = name.toLowerCase().replace(/[®™]/g, "").replace(/\s+/g, " ").trim();
  if (!lower) return null;
  const tryBrand = (s: string): string[] | null => (BRANDS[s] ? BRANDS[s] : null);
  let b = tryBrand(lower);
  if (b) return b;
  // Strip trailing strength/form and try again, then progressively shorter prefixes.
  const base = lower.replace(/\s\d.*$/, "").trim();
  const words = base.split(" ").filter((w) => w && !FORM_WORDS.has(w));
  for (let n = words.length; n >= 1; n--) {
    b = tryBrand(words.slice(0, n).join(" "));
    if (b) return b;
  }
  if (/\s(\/|and|\+|&)\s|-/.test(base) && /\//.test(base)) {
    const parts = base.split(/\s*\/\s*/).map((p) => ingredientsFromName(p)?.[0] ?? null);
    if (parts.every((p): p is string => !!p)) return parts as string[];
  }
  const c = cleanIngredient(lower);
  return c ? [c] : null;
}

interface Strength {
  value: number;
  unit: "mg" | "mcg" | "units" | "mL";
  perUnit?: string; // denominator unit, e.g. "puff", "mL", "tablet"
  perAmount?: number; // denominator amount, e.g. 5 for "/5 mL"
}

function normUnit(u: string): "mg" | "mcg" | "units" | "mL" | "g" | null {
  const x = u.toLowerCase().replace(/\.$/, "");
  if (["mg", "mgs", "milligram", "milligrams"].includes(x)) return "mg";
  if (["mcg", "µg", "μg", "ug", "microgram", "micrograms"].includes(x)) return "mcg";
  if (["u", "iu", "unt", "unit", "units"].includes(x)) return "units";
  if (["ml", "cc", "milliliter", "milliliters", "millilitre", "millilitres"].includes(x)) return "mL";
  if (["g", "gm", "gram", "grams"].includes(x)) return "g";
  return null;
}

const UNIT_RE = "(mg|mgs|milligrams?|mcg|µg|μg|ug|micrograms?|u|iu|unt|units?|ml|cc|milliliters?|g|gm|grams?)";

/** Parses strengths such as "20 mg", "0.075 MG", "90 mcg/puff", "250 mg/5 mL", "100 units/mL", "5 mg/325 mg". */
function parseStrengths(text: string): Strength[] {
  const out: Strength[] = [];
  const re = new RegExp(`(\\d+(?:[.,]\\d+)?|\\.\\d+)\\s*${UNIT_RE}\\b(?:\\s*(?:/|per)\\s*(\\d+(?:\\.\\d+)?)?\\s*(actuations?|actuat|puffs?|sprays?|ml|cc|tablets?|tabs?|capsules?|caps?|doses?|inhalations?)\\b)?`, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    let value = parseFloat(m[1].replace(",", "."));
    let u = normUnit(m[2]);
    if (!u || !Number.isFinite(value)) continue;
    if (u === "g") { value = value * 1000; u = "mg"; }
    const s: Strength = { value: round(value), unit: u };
    if (m[4]) {
      s.perUnit = normPerUnit(m[4]);
      s.perAmount = m[3] ? parseFloat(m[3]) : 1;
    }
    out.push(s);
  }
  // "5/325 mg" style
  if (out.length <= 1) {
    const m2 = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*[/-]\\s*(\\d+(?:\\.\\d+)?)(?:\\s*[/-]\\s*(\\d+(?:\\.\\d+)?))?\\s*${UNIT_RE}\\b`, "i").exec(text);
    if (m2) {
      const u = normUnit(m2[4]);
      if (u && u !== "g" && u !== "mL") {
        const vals = [m2[1], m2[2], m2[3]].filter((x): x is string => !!x).map(parseFloat);
        return vals.map((v) => ({ value: v, unit: u }));
      }
    }
  }
  return out;
}

function normPerUnit(u: string): string {
  const x = u.toLowerCase();
  if (/^(actuat|puff|spray|inhalation|dose)/.test(x)) return "puff";
  if (x === "ml" || x === "cc") return "mL";
  if (/^(tab|cap)/.test(x)) return "tablet";
  return x;
}

function round(v: number): number {
  return Math.round(v * 10000) / 10000;
}

// ---------------------------------------------------------------- medications: directions

const WORD_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5, "a half": 0.5, "one half": 0.5, "1/2": 0.5,
  "½": 0.5, "one and a half": 1.5, "1 1/2": 1.5, "1.5": 1.5, an: 1, a: 1,
};

type Freq = MedicationRow["frequency"];

function parseFrequency(how: string): Freq {
  const t = " " + how.toLowerCase().replace(/[^a-z0-9/ ]+/g, " ").replace(/\s+/g, " ") + " ";
  if (/\b(as needed|prn|if needed|when needed|as necessary|when i need|if i need|when necessary)\b/.test(t)) return "PRN";
  if (/\b(taper|tapering|every other day|alternate days|monthly|every month|once a month|every (2|two|3|three|4|four) weeks|every (2|two|3|three) days)\b/.test(t)) return "other";
  if (/\b(four times|4 times|4x|qid|every 6 hours|every 6 hrs|every 4 hours|every 4 hrs|q6h|q4h)\b/.test(t)) return "other";
  if (/\b(three times|3 times|3x|tid|every 8 hours|every 8 hrs|q8h)\b/.test(t)) return "TID";
  if (/\b(twice|two times|2 times|2x|bid|every 12 hours|every 12 hrs|q12h)\b/.test(t)) return "BID";
  if (/\b(once a week|once weekly|weekly|every week|each week|a week|per week|every (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|on (mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays))\b/.test(t)) return "QW";
  if (/\b(most days|some days|a few times|times a week|days a week|sometimes|occasionally)\b/.test(t)) return "other";
  // Count distinct times of day.
  const slots = new Set<string>();
  if (/\b(morning|mornings|breakfast|am|a m|wake|waking|get up)\b/.test(t)) slots.add("am");
  if (/\b(noon|lunch|midday|afternoon)\b/.test(t)) slots.add("noon");
  if (/\b(evening|evenings|supper|dinner|pm|p m)\b/.test(t)) slots.add("pm");
  if (/\b(bedtime|bed|night|nightly|nights|hs|qhs|sleep)\b/.test(t)) slots.add("hs");
  if (slots.size >= 4) return "other";
  if (slots.size === 3) return "TID";
  if (slots.size === 2) return "BID";
  if (/\b(once a day|once daily|daily|every day|each day|a day|per day|qd|once)\b/.test(t)) return "QD";
  if (slots.size === 1) return slots.has("hs") ? "QHS" : "QD";
  return undefined;
}

/** Count of units per administration from directions; null = none stated; "range"/"cond" = no single amount. */
function parseCount(how: string): { count: number; unit: string | null } | null | "nosingle" {
  const t = how.toLowerCase().replace(/\s+/g, " ").trim();
  if (/sliding scale|depend|according to|per scale|based on|if (my )?(sugar|bs|blood sugar|glucose|bp|pressure)|varies|as directed/.test(t)) return "nosingle";
  const numTok = "(\\d+(?:\\.\\d+)?|\\d+\\s*1/2|1/2|½|one and a half|one|two|three|four|five|six|half|a half|one half)";
  // Ranges: "1 or 2", "1-2", "1 to 2", "one or two"
  if (new RegExp(`\\b${numTok}\\s*(?:or|-|–|to)\\s*${numTok}\\b`).test(t)) return "nosingle";
  const unitTok = "(tablets?|tabs?|pills?|capsules?|caps?|puffs?|sprays?|inhalations?|units?|u|iu|ml|cc|mg|mcg|µg|micrograms?|milligrams?|g|grams?|drops?)";
  const m = new RegExp(`(?:^|[^\\w/])${numTok}\\s*(?:of an?\\s+|of\\s+)?${unitTok}\\b`).exec(t);
  if (m) {
    const n = toNum(m[1]);
    if (n !== null) return { count: n, unit: m[2] };
  }
  const half = /\b(half|1\/2|½)\s+(a\s+)?(tablet|tab|pill)\b/.exec(t);
  if (half) return { count: 0.5, unit: "tablet" };
  const bare = new RegExp(`^(take\\s+)?${numTok}\\b(?!\\s*(times|x|hours|hrs|days|weeks|am|pm|:))`).exec(t);
  if (bare) {
    const n = toNum(bare[2]);
    if (n !== null && n <= 10) return { count: n, unit: null };
  }
  return null;
}

function toNum(s: string): number | null {
  const x = s.trim();
  if (x in WORD_NUM) return WORD_NUM[x];
  const mm = /^(\d+)\s*1\/2$/.exec(x);
  if (mm) return +mm[1] + 0.5;
  const v = parseFloat(x);
  return Number.isFinite(v) ? v : null;
}

function computeDose(strength: Strength | null, how: string | undefined): MedicationRow["dose"] {
  if (!how || !how.trim()) return undefined; // strength with no directions
  const c = parseCount(how);
  if (c === "nosingle") return undefined;
  if (c && c.unit) {
    const u = c.unit.toLowerCase();
    const direct = normUnit(u);
    if (direct && direct !== "mL") {
      if (direct === "g") return { value: round(c.count * 1000), unit: "mg" };
      return { value: round(c.count), unit: direct };
    }
    if (direct === "mL") {
      if (strength && strength.perUnit === "mL") {
        return { value: round((strength.value * c.count) / (strength.perAmount || 1)), unit: strength.unit };
      }
      if (strength && strength.unit === "mL") return { value: round(c.count), unit: "mL" };
      if (!strength) return { value: round(c.count), unit: "mL" };
      return undefined;
    }
    if (/^(tab|pill|cap)/.test(u)) {
      if (strength && (!strength.perUnit || strength.perUnit === "tablet")) return { value: round(strength.value * c.count), unit: strength.unit };
      if (!strength) return { value: round(c.count), unit: "tablet" };
      return undefined;
    }
    if (/^(puff|spray|inhal)/.test(u)) {
      if (strength && (strength.perUnit === "puff" || !strength.perUnit) && strength.unit !== "mL") return { value: round(strength.value * c.count), unit: strength.unit };
      return undefined;
    }
    return undefined;
  }
  if (c && !c.unit) {
    if (strength && (!strength.perUnit || strength.perUnit === "tablet" || strength.perUnit === "puff") && strength.unit !== "mL")
      return { value: round(strength.value * c.count), unit: strength.unit };
    if (!strength) return { value: round(c.count), unit: "tablet" };
    return undefined;
  }
  // No count: a time or frequency means one unit.
  if (strength && parseFrequency(how) && !strength.perUnit && strength.unit !== "mL") {
    return { value: strength.value, unit: strength.unit };
  }
  if (strength && parseFrequency(how) && (strength.perUnit === "tablet" || strength.perUnit === "puff")) {
    return { value: strength.value, unit: strength.unit };
  }
  return undefined;
}

// ---------------------------------------------------------------- medications: status

const HOLD_RE = /\b(paus(e|ed|ing)|on hold|holding|hold(ing)? off|put on hold|stopp?(ed|ing)? for (now|a while|the time being|a bit|a few)|off (it|this|them) (for now|until|till|for a while)|not taking (it |this |them )?(for now|right now|at the moment|currently|until|till)|temporarily|for the time being|on a break|taking a break|skip(ping)? (it |this )?(for now|until|till)|until (after|my|the|surgery|i see)|till (after|my|the))\b/i;

function stopReason(text: string): MedicationRow["stop_reason"] {
  const t = text.toLowerCase();
  if (/\b(rash|hives|itch|swell|allerg|reaction|side effects?|made me|gave me|cough|dizz|nause|vomit|upset stomach|stomach|diarr|muscle (pain|ache)|aches|bleed|tired|headache|couldn'?t tolerate|intoleran|sick)/.test(t)) return "adverse_reaction";
  if (/\b(didn'?t work|did not work|not working|wasn'?t working|no help|didn'?t help|did not help|wasn'?t helping|no effect|ineffective|stopped working)/.test(t)) return "ineffective";
  if (/\b(finished|course (done|over|complete)|completed|done with the course|ran the course|course ended)/.test(t)) return "course_complete";
  if (/\b(switch|changed (me )?to|replaced|instead|new (med|medicine)|changed to)/.test(t)) return "therapy_changed";
  if (/\b(decided|my choice|didn'?t want|did not want|chose|on my own|don'?t want|my decision)/.test(t)) return "patient_choice";
  if (/\b(because|due to|reason|expensive|cost|insurance|ran out|doctor (said|told|stopped)|dr\.? (said|told|stopped))/.test(t)) return "other";
  return undefined;
}

// ---------------------------------------------------------------- medications: sensitivity

const SENS_ING: Record<string, Sensitivity> = {};
for (const n of [
  "sertraline", "fluoxetine", "paroxetine", "citalopram", "escitalopram", "venlafaxine", "desvenlafaxine", "duloxetine", "bupropion",
  "mirtazapine", "trazodone", "vortioxetine", "vilazodone", "amitriptyline", "nortriptyline", "imipramine", "clomipramine", "doxepin",
  "phenelzine", "tranylcypromine", "quetiapine", "aripiprazole", "risperidone", "olanzapine", "lurasidone", "ziprasidone", "cariprazine",
  "brexpiprazole", "clozapine", "haloperidol", "paliperidone", "asenapine", "lumateperone", "chlorpromazine", "fluphenazine", "perphenazine",
  "lithium", "buspirone", "methylphenidate", "dexmethylphenidate", "amphetamine", "dextroamphetamine", "lisdexamfetamine", "atomoxetine",
  "guanfacine er", "viloxazine", "alprazolam", "lorazepam", "clonazepam", "diazepam", "hydroxyzine pamoate",
]) SENS_ING[n] = "mental-health";
for (const n of ["buprenorphine", "methadone", "naltrexone", "disulfiram", "acamprosate", "varenicline"]) SENS_ING[n] = "substance-use";
for (const n of [
  "bictegravir", "emtricitabine", "tenofovir alafenamide", "tenofovir disoproxil", "tenofovir", "dolutegravir", "raltegravir",
  "elvitegravir", "cobicistat", "darunavir", "atazanavir", "ritonavir", "lopinavir", "efavirenz", "rilpivirine", "doravirine",
  "nevirapine", "abacavir", "zidovudine", "lamivudine", "cabotegravir", "maraviroc", "lenacapavir", "fostemsavir", "etravirine",
]) SENS_ING[n] = "hiv-sti";
for (const n of [
  "levonorgestrel", "etonogestrel", "norethindrone", "norgestimate", "drospirenone", "desogestrel", "norgestrel", "ethinyl estradiol",
  "medroxyprogesterone", "ulipristal", "clomiphene", "letrozole fertility", "sildenafil viagra", "tadalafil cialis", "vardenafil", "mifepristone", "misoprostol abortion",
]) SENS_ING[n] = "sexual-reproductive-health";

const SENS_TEXT: [RegExp, Sensitivity][] = [
  [/\b(depress|anxiety|bipolar|schizo|psychos|ptsd|ocd|adhd|panic|mood|psychiatr|mental health)/i, "mental-health"],
  [/\b(opioid use|addiction|recovery|alcohol use|withdrawal|quit drinking|stay sober|sobriety|cravings|suboxone|methadone clinic)/i, "substance-use"],
  [/\b(hiv|prep\b|herpes|chlamydia|gonorr|syphilis|\bsti\b|\bstd\b)/i, "hiv-sti"],
  [/\b(birth control|contracept|pregnan|fertility|ivf|erectile)/i, "sexual-reproductive-health"],
];

function sensitivityFor(ing: string | undefined, texts: string[]): Sensitivity[] | undefined {
  const s = new Set<Sensitivity>();
  if (ing && SENS_ING[ing]) s.add(SENS_ING[ing]);
  for (const t of texts) for (const [re, cat] of SENS_TEXT) if (re.test(t)) s.add(cat);
  if (ing && /^(viagra|cialis)$/i.test(ing)) s.add("sexual-reproductive-health");
  return s.size ? [...s].sort() : undefined;
}

// ---------------------------------------------------------------- medications

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function medRowsForEntry(it: FolioItem, eid: string, e: Record<string, any>): MedicationRow[] {
  const name = str(e.name);
  const pick = e.picked_from_search && typeof e.picked_from_search === "object" ? e.picked_from_search : null;
  const display = pick ? str(pick.display) : undefined;
  const drugName = name ?? display;
  if (!drugName) return [];

  // Ingredients: prefer the searched (RxNorm) product's display, else the typed name.
  let ingredients: string[] | null = null;
  let displayStrengths: Strength[] = [];
  if (display) {
    const parts = display.replace(/\[[^\]]*\]/g, "").split(/\s+\/\s+/);
    const ings = parts.map((p) => cleanIngredient(p));
    if (ings.every((x): x is string => !!x)) {
      ingredients = ings as string[];
      displayStrengths = parts.map((p) => parseStrengths(p)[0]).filter((x): x is Strength => !!x);
      if (displayStrengths.length !== ingredients.length) displayStrengths = [];
    }
  }
  if (!ingredients && name) ingredients = ingredientsFromName(name);

  const strengthText = str(e.strength_text);
  let strengths: Strength[] = strengthText ? parseStrengths(strengthText) : [];
  if (!strengths.length && !strengthText && displayStrengths.length) strengths = displayStrengths;
  if (!strengths.length && !strengthText && name) strengths = parseStrengths(name);

  const how = str(e.how_i_take_it);
  const note = str(e.note);
  const frequency = how ? parseFrequency(how) : undefined;

  let status: MedicationRow["status"];
  let since: string | undefined;
  let reasonText: string | undefined;
  let stop: MedicationRow["stop_reason"];
  const holdText = [note, how].filter((x): x is string => !!x).find((x) => HOLD_RE.test(x));
  if (e.status === "taking") {
    if (holdText) {
      status = "held";
      since = partialDate(e.stopped) ?? undefined;
      reasonText = note ?? holdText;
    } else {
      status = "active";
      since = partialDate(e.started) ?? undefined;
    }
  } else if (e.status === "stopped") {
    status = "stopped";
    since = partialDate(e.stopped) ?? undefined;
    if (note) {
      reasonText = note;
      stop = stopReason(note);
    }
  } else {
    status = "unknown";
  }

  const list = ingredients && ingredients.length ? ingredients : [undefined];
  return list.map((ing, i) => {
    let strength: Strength | null = null;
    if (list.length === 1) strength = strengths.length === 1 ? strengths[0] : null;
    else if (strengths.length === list.length) strength = strengths[i];
    else if (displayStrengths.length === list.length) strength = displayStrengths[i];
    const row: MedicationRow = { drug_name: drugName, status, patient_reported: true, evidence: [{ item_id: it.id, entry_id: eid }] };
    if (ing) row.ingredient = ing;
    if (since) row.status_since = since;
    let dose: MedicationRow["dose"];
    if (list.length === 1 || strength) dose = computeDose(strength, how);
    if (dose && list.length > 1 && dose.unit === "tablet") dose = undefined;
    if (dose && dose.value > 0) row.dose = dose;
    if (frequency) row.frequency = frequency;
    if (stop) row.stop_reason = stop;
    if (reasonText) row.status_reason_text = reasonText;
    if (e.kind === "over_the_counter") row.otc = true;
    const sens = sensitivityFor(ing, [note, how].filter((x): x is string => !!x));
    if (sens) row.sensitivity = sens;
    return row;
  });
}

function medicationRows(items: FolioItem[]): MedicationRow[] {
  // The "My Medicines" list is saved as full snapshots: the latest counting snapshot is the list.
  const snapshots = items.filter((it) => payloadEntries(it).some(([, e]) => e.type === "my_med"));
  if (!snapshots.length) return [];
  snapshots.sort((a, b) => {
    const d = instantKey(b.recorded) - instantKey(a.recorded);
    if (d) return d;
    const ea = String(a.effective ?? ""), eb = String(b.effective ?? "");
    if (ea !== eb) return ea < eb ? 1 : -1;
    return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
  });
  const latest = snapshots[0];
  const rows: MedicationRow[] = [];
  const byKey = new Map<string, number>();
  const rank = { active: 3, held: 2, stopped: 1, unknown: 0 } as const;
  for (const [eid, e] of payloadEntries(latest)) {
    if (e.type !== "my_med") continue;
    let produced: MedicationRow[] = [];
    try {
      produced = medRowsForEntry(latest, eid, e);
    } catch {
      produced = [];
    }
    for (const r of produced) {
      const key = r.ingredient ?? "name:" + r.drug_name.toLowerCase();
      const idx = byKey.get(key);
      if (idx === undefined) {
        byKey.set(key, rows.length);
        rows.push(r);
      } else {
        // Same drug twice on the list: one row; keep the one with the more current status.
        const prev = rows[idx];
        if (rank[r.status] > rank[prev.status]) {
          r.evidence = [...r.evidence, ...prev.evidence];
          rows[idx] = r;
        } else prev.evidence.push(...r.evidence);
      }
    }
  }
  return rows;
}

// ---------------------------------------------------------------- entry point

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return empty;
  let counting: FolioItem[] = [];
  try {
    counting = countingItems(items, asOf);
  } catch {
    return empty;
  }
  try {
    empty.medications = medicationRows(counting);
  } catch {
    empty.medications = [];
  }
  try {
    empty.vitals = vitalRows(counting);
  } catch {
    empty.vitals = [];
  }
  return empty;
}
