// HomeLog (patient diary app) -> US Core rows.
//
// HomeLog publishes day pages (home BP / glucose readings, dose logs, diary notes) and My Medicines
// list snapshots. Home meter readings are vitals, not laboratory results, so this source never yields
// lab Observations. MedicationRequests come from the latest current My Medicines snapshot in scope.

import type { FolioItem, UsCoreRows, MedicationRequest, Quantity } from "../in/views/uscore";

type Status = "active" | "held" | "stopped" | "unknown";
type StopReason = "adverse_reaction" | "ineffective" | "therapy_changed" | "course_complete" | "patient_choice" | "other";
type Freq = "QD" | "BID" | "TID" | "QHS" | "QW" | "PRN" | "other";
type DoseUnit = "mg" | "mcg" | "units" | "mL" | "tablet";
type Dose = { value: number; unit: DoseUnit };

// ─── Time scope ───────────────────────────────────────────────────────────────────────────────────

/** UTC instant (ms) of a wall-clock time in America/Chicago, by US DST rules. */
function nthSundayUtcDay(year: number, month: number, n: number): number {
  // month 0-based; n >= 1 for nth Sunday, n = -1 for last Sunday
  if (n > 0) {
    const first = Date.UTC(year, month, 1);
    const dow = new Date(first).getUTCDay();
    const day = 1 + ((7 - dow) % 7) + (n - 1) * 7;
    return day;
  }
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const dow = new Date(Date.UTC(year, month, lastDay)).getUTCDay();
  return lastDay - dow;
}

function chicagoOffsetHoursForLocal(y: number, mo: number, d: number, h: number): number {
  // Returns UTC offset (negative hours) for a local wall time in America/Chicago.
  let startM: number, startD: number, endM: number, endD: number;
  if (y >= 2007) {
    startM = 2; startD = nthSundayUtcDay(y, 2, 2);
    endM = 10; endD = nthSundayUtcDay(y, 10, 1);
  } else {
    startM = 3; startD = nthSundayUtcDay(y, 3, 1);
    endM = 9; endD = nthSundayUtcDay(y, 9, -1);
  }
  const key = (m: number, dd: number, hh: number) => m * 10000 + dd * 100 + hh;
  const k = key(mo, d, h);
  const inDst = k >= key(startM, startD, 2) && k < key(endM, endD, 2);
  return inDst ? -5 : -6;
}

/** End of the local `asOf` day in America/Chicago, as UTC ms. NaN if unreadable. */
function endOfLocalDayUtc(asOf: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(asOf || "");
  if (!m) return NaN;
  const y = +m[1], mo = +m[2] - 1, d = +m[3];
  const next = new Date(Date.UTC(y, mo, d + 1));
  const ny = next.getUTCFullYear(), nmo = next.getUTCMonth(), nd = next.getUTCDate();
  const off = chicagoOffsetHoursForLocal(ny, nmo, nd, 0);
  return Date.UTC(ny, nmo, nd, 0, 0, 0) - off * 3600_000;
}

function parseInstant(s: unknown): number {
  if (typeof s !== "string") return NaN;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    // Bare date: treat as start of that local day.
    const [y, mo, d] = s.split("-").map(Number);
    const off = chicagoOffsetHoursForLocal(y, mo - 1, d, 0);
    return Date.UTC(y, mo - 1, d) - off * 3600_000;
  }
  return Date.parse(s);
}

/** In-scope, current items (FOLIO supersedes/retracts, same issuer, transitive). */
function currentItems(items: FolioItem[], asOf: string): FolioItem[] {
  const cutoff = endOfLocalDayUtc(asOf);
  const inScope = (Array.isArray(items) ? items : []).filter((it) => {
    if (!it || typeof it !== "object" || typeof it.id !== "string") return false;
    const t = parseInstant(it.recorded);
    if (isNaN(t)) return false;
    return isNaN(cutoff) ? true : t <= cutoff;
  });
  const dead = new Set<string>();
  for (const it of inScope) {
    for (const ref of [...(Array.isArray(it.supersedes) ? it.supersedes : []), ...(Array.isArray(it.retracts) ? it.retracts : [])]) {
      if (typeof ref === "string") dead.add(`${it.issuer}\u0000${ref}`);
    }
  }
  return inScope.filter((it) => !dead.has(`${it.issuer}\u0000${it.id}`));
}

// ─── Drug names ───────────────────────────────────────────────────────────────────────────────────

const BRANDS: Record<string, string> = {
  zestril: "lisinopril", prinivil: "lisinopril", qbrelis: "lisinopril",
  norvasc: "amlodipine", katerzia: "amlodipine",
  glucophage: "metformin", "glucophage xr": "metformin", glumetza: "metformin", fortamet: "metformin", riomet: "metformin",
  crestor: "rosuvastatin", lipitor: "atorvastatin", zocor: "simvastatin", pravachol: "pravastatin", livalo: "pitavastatin", mevacor: "lovastatin",
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", euthyrox: "levothyroxine", tirosint: "levothyroxine",
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  januvia: "sitagliptin", tradjenta: "linagliptin", onglyza: "saxagliptin", nesina: "alogliptin",
  ozempic: "semaglutide", wegovy: "semaglutide", rybelsus: "semaglutide", trulicity: "dulaglutide", victoza: "liraglutide",
  saxenda: "liraglutide", byetta: "exenatide", bydureon: "exenatide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", semglee: "insulin glargine", rezvoglar: "insulin glargine",
  levemir: "insulin detemir", tresiba: "insulin degludec",
  humalog: "insulin lispro", admelog: "insulin lispro", lyumjev: "insulin lispro",
  novolog: "insulin aspart", fiasp: "insulin aspart", apidra: "insulin glulisine",
  "humulin n": "insulin isophane", "novolin n": "insulin isophane", "humulin r": "insulin regular", "novolin r": "insulin regular",
  glucotrol: "glipizide", "glucotrol xl": "glipizide", amaryl: "glimepiride", diabeta: "glyburide", micronase: "glyburide", glynase: "glyburide",
  actos: "pioglitazone",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", micardis: "telmisartan", atacand: "candesartan",
  vasotec: "enalapril", altace: "ramipril", lotensin: "benazepril", accupril: "quinapril", mavik: "trandolapril",
  toprol: "metoprolol", "toprol xl": "metoprolol", "toprol-xl": "metoprolol", lopressor: "metoprolol", coreg: "carvedilol", tenormin: "atenolol",
  bystolic: "nebivolol", inderal: "propranolol",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", soaanz: "torsemide", microzide: "hydrochlorothiazide", hctz: "hydrochlorothiazide",
  aldactone: "spironolactone", inspra: "eplerenone", kerendia: "finerenone",
  cardizem: "diltiazem", procardia: "nifedipine", adalat: "nifedipine", catapres: "clonidine", apresoline: "hydralazine",
  entresto: "sacubitril / valsartan",
  hyzaar: "hydrochlorothiazide / losartan", zestoretic: "hydrochlorothiazide / lisinopril", lotrel: "amlodipine / benazepril",
  janumet: "metformin / sitagliptin", synjardy: "empagliflozin / metformin", xigduo: "dapagliflozin / metformin",
  glyxambi: "empagliflozin / linagliptin", jentadueto: "linagliptin / metformin",
  plavix: "clopidogrel", brilinta: "ticagrelor", eliquis: "apixaban", xarelto: "rivaroxaban", coumadin: "warfarin", jantoven: "warfarin",
  pradaxa: "dabigatran",
  zetia: "ezetimibe", vytorin: "ezetimibe / simvastatin", tricor: "fenofibrate", lopid: "gemfibrozil", lovaza: "omega-3-acid ethyl esters",
  aleve: "naproxen", naprosyn: "naproxen", anaprox: "naproxen", advil: "ibuprofen", motrin: "ibuprofen", tylenol: "acetaminophen",
  mobic: "meloxicam", celebrex: "celecoxib", voltaren: "diclofenac",
  bayer: "aspirin", ecotrin: "aspirin", "baby aspirin": "aspirin", asa: "aspirin",
  prilosec: "omeprazole", nexium: "esomeprazole", protonix: "pantoprazole", prevacid: "lansoprazole", pepcid: "famotidine",
  zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram", celexa: "citalopram", paxil: "paroxetine",
  wellbutrin: "bupropion", cymbalta: "duloxetine", effexor: "venlafaxine", desyrel: "trazodone", remeron: "mirtazapine",
  seroquel: "quetiapine", abilify: "aripiprazole", zyprexa: "olanzapine", risperdal: "risperidone", lithobid: "lithium",
  lamictal: "lamotrigine", depakote: "divalproex", buspar: "buspirone",
  xanax: "alprazolam", ativan: "lorazepam", klonopin: "clonazepam", valium: "diazepam", ambien: "zolpidem",
  neurontin: "gabapentin", lyrica: "pregabalin", ultram: "tramadol",
  flomax: "tamsulosin", proscar: "finasteride", zyloprim: "allopurinol", uloric: "febuxostat", colcrys: "colchicine",
  ventolin: "albuterol", proair: "albuterol", proventil: "albuterol", flovent: "fluticasone", singulair: "montelukast",
  claritin: "loratadine", zyrtec: "cetirizine", allegra: "fexofenadine", benadryl: "diphenhydramine", flonase: "fluticasone",
  lanoxin: "digoxin", "k-dur": "potassium chloride", "klor-con": "potassium chloride",
  suboxone: "buprenorphine / naloxone", zubsolv: "buprenorphine / naloxone", subutex: "buprenorphine", sublocade: "buprenorphine",
  vivitrol: "naltrexone", antabuse: "disulfiram", campral: "acamprosate", chantix: "varenicline",
  truvada: "emtricitabine / tenofovir disoproxil", descovy: "emtricitabine / tenofovir alafenamide",
  biktarvy: "bictegravir / emtricitabine / tenofovir alafenamide", tivicay: "dolutegravir",
  viagra: "sildenafil", cialis: "tadalafil",
  medrol: "methylprednisolone", deltasone: "prednisone",
  imodium: "loperamide", zofran: "ondansetron", miralax: "polyethylene glycol 3350", colace: "docusate", senokot: "senna",
};

const GENERIC_SUFFIXES = /(pril|sartan|olol|ilol|statin|gliflozin|gliptin|glutide|dipine|azole|prazole|tidine|zepam|zolam|afil|oxacin|cycline|cillin|mycin|parin|xaban|lukast|triptan|setron|profen|semide|thiazide|tide|mab|nib|formin|zide|ine|one|ide|ate|in|ol)$/;

const KNOWN_GENERICS = new Set<string>();
for (const v of Object.values(BRANDS)) for (const p of v.split(" / ")) KNOWN_GENERICS.add(p);
for (const g of ["aspirin", "acetaminophen", "insulin glargine", "metformin", "prednisone", "allopurinol", "warfarin", "trazodone",
  "hydralazine", "cholecalciferol", "ergocalciferol", "folic acid", "cyanocobalamin", "magnesium oxide", "calcium carbonate",
  "ferrous sulfate", "potassium chloride", "melatonin", "nitroglycerin", "isosorbide mononitrate", "methotrexate", "lithium"]) KNOWN_GENERICS.add(g);

const SALTS = new Set([
  "hydrochloride", "hcl", "potassium", "sodium", "calcium", "magnesium", "besylate", "maleate", "succinate", "tartrate",
  "mesylate", "hyclate", "monohydrate", "dihydrate", "trihydrate", "bromide", "sulfate", "acetate", "citrate", "fumarate",
  "phosphate", "disodium", "dipropionate", "propionate", "furoate", "bitartrate", "hydrobromide", "medoxomil", "cilexetil",
  "anhydrous", "monosodium", "trometamol", "tromethamine", "dimesylate", "malate", "lactate", "gluconate", "xinafoate",
  "valerate", "decanoate", "pamoate", "embonate", "hemihydrate", "olamine",
]);

/** Remove salt words, keeping the base ingredient. Leaves the input alone when stripping would empty it. */
function stripSalts(name: string): string {
  const words = name.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return words.join(" ");
  const kept = words.filter((w, i) => i === 0 || !SALTS.has(w));
  // "potassium chloride", "magnesium oxide": the "salt" word is the drug itself.
  if (kept.length === 0 || (SALTS.has(words[0]) && kept.length === 1 && words.length === 2 && !KNOWN_GENERICS.has(kept[0]))) {
    return words.join(" ");
  }
  return kept.join(" ");
}

function joinIngredients(parts: string[]): string | undefined {
  const clean = parts.map((p) => p.trim()).filter(Boolean);
  if (!clean.length) return undefined;
  return [...new Set(clean)].sort().join(" / ");
}

/** Ingredient(s) from an RxNorm display string ("lisinopril 20 MG Oral Tablet", "3 ML insulin glargine 100 UNT/ML Pen Injector"). */
function ingredientFromRxDisplay(display: string): string | undefined {
  let s = display.replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ").trim();
  s = s.replace(/^(\d+(\.\d+)?\s*(ML|HR|ACTUAT|MG|UNT)\s+)+/i, "");
  const parts = s.split(/\s+\/\s+/).map((p) => {
    const m = /^(.*?)(\s+\d[\d.,]*\s*(MG|MCG|UG|UNT|ML|MEQ|%|G|IU|MG\/ML|UNT\/ML|MG\/ACTUAT|MCG\/ACTUAT)\b.*)?$/i.exec(p.trim());
    let base = (m ? m[1] : p).trim();
    // Drop dose-form words when the display is a bare ingredient + form (no strength).
    base = base.replace(/\s+(oral|topical|injectable|injection|ophthalmic|nasal|inhalant|transdermal|extended release|delayed release|chewable|pen injector|tablet|capsule|solution|suspension|product)\b.*$/i, "");
    return stripSalts(base);
  });
  if (parts.some((p) => !p || /\d/.test(p))) return undefined;
  return joinIngredients(parts);
}

function rxDisplayHasStrength(display: string): boolean {
  return /\d[\d.]*\s*(MG|MCG|UNT|ML|MEQ|%)\b/i.test(display);
}

/** Ingredient from a patient-typed name, or undefined when it does not say which drug it is. */
function ingredientFromName(name: string): string | undefined {
  let s = name.toLowerCase().replace(/\([^)]*\)/g, " ").trim();
  s = s.replace(/\s+/g, " ");
  if (BRANDS[s]) return BRANDS[s];
  // Drop strength and release-form suffixes: "Metformin 500mg ER".
  s = s.replace(/\s*\d[\d.,]*\s*(mg|mcg|ug|g|units?|ml|%)?\b.*$/i, "").trim();
  s = s.replace(/\s+(er|xr|xl|sr|dr|cr|la|ec|odt|hct|tablets?|tabs?|capsules?|caps?|pills?|pen|flexpen|kwikpen|solostar|inhaler)\b.*$/i, "").trim();
  if (!s) return undefined;
  if (BRANDS[s]) return BRANDS[s];
  const first = s.split(" ")[0];
  if (BRANDS[first] && s.split(" ").length <= 2) return BRANDS[first];
  const base = stripSalts(s);
  if (KNOWN_GENERICS.has(base)) return base;
  if (/^insulin [a-z]+$/.test(base)) return base;
  if (/^[a-z][a-z-]{3,}$/.test(base) && GENERIC_SUFFIXES.test(base) && !/^(water|blood|sugar|heart|pain|sleep|vitamin|pill|other)/.test(base)) {
    return base;
  }
  return undefined;
}

// ─── Dose and frequency ───────────────────────────────────────────────────────────────────────────

const NON_TABLET = /\b(insulin|pens?|flexpen|kwikpen|solostar|inhal\w*|puffs?|cream|ointment|gel|drops?|spray|inject\w*|patch|solution|suspension|syrup|liquid|elixir|vial|syringe|units?\/ml|mg\/ml|\/\s*\d*\s*ml|ml|actuat\w*|lotion|suppositor\w*|powder|nebuli\w*)\b/i;

const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, half: 0.5, a: 1, an: 1 };

function roundTo(n: number, places: number): number {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}

function normalizeMass(value: number, unit: string): Dose | undefined {
  const u = unit.toLowerCase();
  let mg: number;
  if (u === "mg") mg = value;
  else if (u === "mcg" || u === "ug" || u === "µg") return { value: roundTo(value, 4), unit: "mcg" };
  else if (u === "g") mg = value * 1000;
  else return undefined;
  if (mg > 0 && mg < 1) return { value: roundTo(mg * 1000, 4), unit: "mcg" };
  return { value: roundTo(mg, 4), unit: "mg" };
}

/** Per-tablet mass strength: from the picked product when it gives one, else from the patient's text. */
function tabletStrength(med: any): Dose | undefined {
  const disp: string | undefined = typeof med?.picked_from_search?.display === "string" ? med.picked_from_search.display : undefined;
  if (disp && !disp.includes(" / ") && !NON_TABLET.test(disp.replace(/oral tablet|oral capsule/gi, ""))) {
    const m = /(\d+(?:\.\d+)?)\s*(MG|MCG)\b(?!\s*\/)/i.exec(disp);
    if (m) return normalizeMass(parseFloat(m[1]), m[2]);
  }
  const st: string | undefined = typeof med?.strength_text === "string" ? med.strength_text : undefined;
  if (st && !NON_TABLET.test(st)) {
    const all = [...st.matchAll(/(\d+(?:\.\d+)?)\s*(mg|mcg|ug|µg|g)\b/gi)];
    if (all.length === 1 && !/[\/-]\s*\d/.test(st)) return normalizeMass(parseFloat(all[0][1]), all[0][2]);
  }
  return undefined;
}

function isNonTablet(med: any): boolean {
  const txt = [med?.name, med?.strength_text, med?.picked_from_search?.display].filter((x) => typeof x === "string").join(" ");
  return NON_TABLET.test(txt) && !/\b(tablet|capsule|pill)s?\b/i.test(txt);
}

function parseDose(med: any, sig: string): Dose | undefined {
  const s = sig.toLowerCase().replace(/½/g, " 1/2 ");
  if (/sliding|scale|depend|varies|vary|per (my )?(sugar|reading|glucose)|as directed|carb/.test(s)) return undefined;
  // Ranges: "1 or 2", "1-2", "one to two", "10-12 units".
  const numTok = "(?:\\d+(?:\\.\\d+)?|one|two|three|four|five|six|half)";
  if (new RegExp(`\\b${numTok}\\s*(?:or|-|–|to)\\s*${numTok}\\b(?!\\s*(?:times|x\\b|hours|hrs|days|weeks|am|pm|:))`).test(s)) return undefined;

  // Explicit amount with unit.
  const um = /(\d+(?:\.\d+)?|\d+\/\d+)\s*(mg|mcg|ug|g|units?|u|iu|ml|tablets?|tabs?|pills?|capsules?|caps?|puffs?)\b/.exec(s);
  if (um) {
    const v = um[1].includes("/") ? Number(um[1].split("/")[0]) / Number(um[1].split("/")[1]) : parseFloat(um[1]);
    const u = um[2];
    if (!isFinite(v) || v <= 0) return undefined;
    if (/^(mg|mcg|ug|g)$/.test(u)) return normalizeMass(v, u);
    if (/^(units?|u|iu)$/.test(u)) return { value: v, unit: "units" };
    if (u === "ml") return { value: v, unit: "mL" };
    if (/^puffs?$/.test(u)) return undefined;
    return tabletsToDose(med, v);
  }
  const wm = /\b(one|two|three|four|five|six|half|an?)\s+(?:a\s+)?(tablets?|tabs?|pills?|capsules?|caps?)\b/.exec(s)
    || /\b(half)\b/.exec(s);
  if (wm) {
    const v = WORD_NUM[wm[1]];
    return tabletsToDose(med, v);
  }
  if (/\b(one|two|three|four|five|six|half)\s+(units?|puffs?|ml)\b/.test(s)) {
    const m = /\b(one|two|three|four|five|six|half)\s+(units?|puffs?|ml)\b/.exec(s)!;
    if (/^units?$/.test(m[2])) return { value: WORD_NUM[m[1]], unit: "units" };
    if (m[2] === "ml") return { value: WORD_NUM[m[1]], unit: "mL" };
    return undefined;
  }
  // Bare count: "1 in the morning", "take 2 at bedtime", "2 daily".
  const bm = /^(?:take\s+)?(\d+(?:\.\d+)?|1\/2|one|two|three|four|half)\b(?!\s*(?:times|x\b|hours|hrs|days|weeks|am|pm|:|\/|%))/.exec(s.trim());
  if (bm) {
    if (isNonTablet(med)) return undefined;
    const v = bm[1] === "1/2" ? 0.5 : WORD_NUM[bm[1]] ?? parseFloat(bm[1]);
    return tabletsToDose(med, v);
  }
  if (/\d/.test(s.replace(/\b\d+\s*(times|x|hours|hrs|days|weeks|am|pm)\b|\d{1,2}:\d{2}/g, ""))) return undefined;
  // A direction naming no count means one tablet or capsule.
  if (isNonTablet(med)) return undefined;
  if (s.trim() === "") return undefined;
  return tabletsToDose(med, 1);
}

function tabletsToDose(med: any, count: number): Dose | undefined {
  if (!isFinite(count) || count <= 0) return undefined;
  const st = tabletStrength(med);
  if (st) return { value: roundTo(st.value * count, 4), unit: st.unit };
  return { value: count, unit: "tablet" };
}

function parseFrequency(sig: string): Freq | undefined {
  const s = sig.toLowerCase();
  if (!s.trim()) return undefined;
  if (/\b(as needed|when needed|if needed|as necessary|when necessary|prn|when i need|if i need|as required|when required)\b/.test(s)) return "PRN";
  if (/\b(once a week|once weekly|weekly|every week|each week|a week|per week|every (mon|tues|wednes|thurs|fri|satur|sun)day|on (mon|tues|wednes|thurs|fri|satur|sun)days?)\b/.test(s)) {
    if (/\b(twice|two times|2 times|three times|3 times)\s+(a|per)\s+week\b/.test(s)) return "other";
    return "QW";
  }
  if (/\b(every other day|every \d+ days|alternate days|most days|some days|sometimes|occasionally|now and then)\b/.test(s)) {
    return /\b(sometimes|occasionally|now and then)\b/.test(s) ? "PRN" : "other";
  }
  if (/\b(three times|3 times|thrice|tid|3x|with (each|every|all) meals?|with meals|every 8 h(ou)?rs?)\b/.test(s)) return "TID";
  if (/\b(four times|4 times|qid|every [46] h(ou)?rs?)\b/.test(s)) return "other";
  if (/\b(twice|two times|2 times|bid|2x|every 12 h(ou)?rs?)\b/.test(s)) return "BID";
  const slots = new Set<string>();
  if (/\b(morning|breakfast|a\.?m\.?|wake|waking|get up)\b/.test(s)) slots.add("am");
  if (/\b(noon|lunch|midday|afternoon)\b/.test(s)) slots.add("mid");
  if (/\b(evening|supper|dinner|tea ?time)\b/.test(s)) slots.add("pm");
  const bed = /\b(bedtime|bed time|before bed|at bed|night|nightly|nighttime|hs|qhs|p\.?m\.?)\b/.test(s);
  if (bed) slots.add("bed");
  if (slots.size === 1 && bed) return "QHS";
  if (slots.size === 1) return "QD";
  if (slots.size === 2) return "BID";
  if (slots.size === 3) return "TID";
  if (slots.size > 3) return "other";
  if (/\b(once a day|once daily|daily|every day|each day|a day|per day|qd|1x)\b/.test(s)) return "QD";
  return undefined;
}

// ─── Status ───────────────────────────────────────────────────────────────────────────────────────

const PARTIAL_DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;
function partialDate(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return PARTIAL_DATE.test(s) ? s : undefined;
}

function noteSaysHeld(note: string): boolean {
  const s = note.toLowerCase();
  const negatedResume = /\b(not|never|no plans? to|won'?t|don'?t|isn'?t|aren'?t)\s+(\w+\s+){0,3}(restart|resum|go(ing)? back|start (it )?again)/.test(s);
  if (/\bfor now\b|\bpaus|\bon hold\b|\bhold(ing)?\b|\btemporar|\bfor the time being\b|\bfor a (while|bit)\b/.test(s)) return true;
  if (/\b(stop|hold|off|skip|paus)\w*\s+(it\s+|taking( it)?\s+)?(for|until|till|before)\b/.test(s) && !/\b(took|taken|used|was on) it (for|until)\b/.test(s)) return true;
  if (!negatedResume && /\b(restart|resum|start (it )?again|go back on|back on it after)/.test(s)) return true;
  return false;
}

function stopReason(note: string): StopReason | undefined {
  const s = note.toLowerCase();
  if (/side.?effect|made me|gave me|caused|allerg|reaction|rash|hives|itch|swell|cough|dizz|nause|vomit|diarrh|stomach|upset|cramp|ache|pain|bleed|bruis|tired|fatigue|headache|yeast|infection|kidney|potassium|sugar (went|got|dropped) (too )?low|lows?\b|hypo|couldn'?t tolerate|not tolerat|intoleran|sick|ketoacidosis|dka|pancreatitis|angioedema|felt (bad|awful|terrible|weird)/.test(s)) return "adverse_reaction";
  if (/didn'?t work|did not work|not working|wasn'?t working|stopped working|didn'?t help|did not help|not help|no help|no effect|didn'?t do anything|ineffective|not enough|wasn'?t enough|not strong enough/.test(s)) return "ineffective";
  if (/switch|changed (me )?to|change to|replaced|instead|swapped|moved (me )?to|put me on|now on|now taking/.test(s)) return "therapy_changed";
  if (/finished|course|done with|completed|ran its course|only for \d|antibiotic/.test(s)) return "course_complete";
  if (/my (own )?choice|decided|didn'?t want|don'?t want|did not want|chose|on my own|cost|expensive|afford|insurance/.test(s)) return "patient_choice";
  if (/\b(because|due to|since|reason)\b/.test(s)) return "other";
  return undefined;
}

// ─── Main ─────────────────────────────────────────────────────────────────────────────────────────

function isMyMed(e: any): boolean {
  return !!e && typeof e === "object" && e.type === "my_med" && typeof e.name === "string" && e.name.trim() !== "";
}

function isMedList(it: FolioItem): boolean {
  const entries = it.payload && typeof it.payload === "object" ? Object.values(it.payload) : [];
  if (entries.some((e: any) => e && e.type === "my_med")) return true;
  return entries.length === 0 && /my medicines/i.test(typeof it.narrative === "string" ? it.narrative : "");
}

function safeId(s: string): string {
  const id = s.replace(/[^A-Za-z0-9.-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return id.length > 64 ? id.slice(0, 64).replace(/-$/, "") : id;
}

function natCmp(a: string, b: string): number {
  return a.localeCompare(b, "en", { numeric: true });
}

type Built = { req: MedicationRequest; key: string; status: Status; latest: string; entryId: string };

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const out: UsCoreRows = { medicationRequests: [], observations: [] };
  let current: FolioItem[];
  try {
    current = currentItems(items, asOf);
  } catch {
    return out;
  }

  // The latest current My Medicines snapshot is the source's list.
  const lists = current.filter((it) => {
    try { return isMedList(it); } catch { return false; }
  });
  lists.sort((a, b) => {
    const ta = parseInstant(a.recorded), tb = parseInstant(b.recorded);
    if (ta !== tb) return tb - ta;
    const ea = String(a.effective ?? ""), eb = String(b.effective ?? "");
    if (ea !== eb) return ea < eb ? 1 : -1;
    return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
  });
  const list = lists[0];
  if (!list) return out;

  const built: Built[] = [];
  const entryIds = Object.keys(list.payload || {}).sort(natCmp);
  for (const entryId of entryIds) {
    try {
      const med = (list.payload as Record<string, any>)[entryId];
      if (!isMyMed(med)) continue;
      const b = buildRequest(list, entryId, med);
      if (b) built.push(b);
    } catch {
      // skip unreadable entry
    }
  }

  // One row per ingredient: keep the line whose own latest event is latest.
  const rank = (b: Built) => (b.status === "stopped" ? 0 : 1);
  const byKey = new Map<string, Built>();
  for (const b of built) {
    const prev = byKey.get(b.key);
    if (!prev) { byKey.set(b.key, b); continue; }
    let better: boolean;
    if (prev.latest && b.latest && prev.latest.slice(0, 4) !== "" && rank(prev) !== rank(b)) {
      // A stopped line whose stop is after the other line's start is the latest event.
      const stopped = rank(prev) === 0 ? prev : b;
      const other = stopped === prev ? b : prev;
      better = (stopped.latest > other.latest ? stopped : other) === b;
    } else if (rank(prev) !== rank(b)) {
      better = rank(b) > rank(prev);
    } else {
      better = (b.latest || "") > (prev.latest || "");
    }
    if (better) byKey.set(b.key, b);
  }
  const kept = new Set(byKey.values());
  const usedIds = new Set<string>();
  for (const b of built) {
    if (!kept.has(b)) continue;
    let id = b.req.id;
    let n = 2;
    while (usedIds.has(id)) id = safeId(`${b.req.id.slice(0, 60)}-${n++}`);
    usedIds.add(id);
    b.req.id = id;
    out.medicationRequests.push(b.req);
  }
  return out;
}

function buildRequest(item: FolioItem, entryId: string, med: any): Built | undefined {
  const name = String(med.name).trim();
  const pick = med.picked_from_search && typeof med.picked_from_search === "object" ? med.picked_from_search : undefined;
  const rxCode = pick && typeof pick.rxnorm === "string" && /^\d+$/.test(pick.rxnorm.trim()) ? pick.rxnorm.trim() : undefined;
  const rxDisplay = pick && typeof pick.display === "string" ? pick.display.trim() : undefined;

  let ingredient: string | undefined;
  if (rxDisplay) ingredient = ingredientFromRxDisplay(rxDisplay);
  if (!ingredient) ingredient = ingredientFromName(name);
  const ingredientLevel = !!(rxCode && rxDisplay && !rxDisplayHasStrength(rxDisplay) && ingredient && !ingredient.includes(" / "));

  // Status.
  const note = typeof med.note === "string" ? med.note.trim() : "";
  let status: Status;
  if (med.status === "taking") status = note && noteSaysHeld(note) ? "held" : "active";
  else if (med.status === "stopped") status = note && noteSaysHeld(note) ? "held" : "stopped";
  else status = "unknown";

  const started = partialDate(med.started);
  const stopped = partialDate(med.stopped);
  let statusSince: string | undefined;
  if (status === "active") statusSince = started;
  else if (status === "stopped" || status === "held") statusSince = med.status === "stopped" ? stopped : undefined;

  const fhirStatus: MedicationRequest["status"] =
    status === "active" ? "active" : status === "held" ? "on-hold" : status === "stopped" ? "stopped" : "unknown";

  const req: MedicationRequest = {
    resourceType: "MedicationRequest",
    id: safeId(`homelog-${item.patient}-${typeof med.homelog_med_id === "string" && med.homelog_med_id ? med.homelog_med_id : entryId}`),
    meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"] },
    status: fhirStatus,
    intent: "plan",
    reportedBoolean: true,
    medicationCodeableConcept: rxCode
      ? {
          coding: [{
            system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            code: rxCode,
            ...(ingredientLevel ? { display: ingredient } : rxDisplay ? { display: rxDisplay } : {}),
          }],
          text: name,
        }
      : { text: ingredient ? `${name} (${ingredient})` : name },
    subject: { reference: `Patient/${item.patient}` },
  };

  if (status === "held" || status === "stopped") {
    const reason = status === "stopped" && note ? stopReason(note) : undefined;
    if (note || reason) {
      req.statusReason = {
        ...(reason ? { coding: [{ system: "urn:folio:stop-reason", code: reason }] } : {}),
        ...(note ? { text: note } : {}),
      };
    }
  }

  const authoredOn = status === "active" ? statusSince ?? started : started;
  if (authoredOn) req.authoredOn = authoredOn;

  const sig = typeof med.how_i_take_it === "string" ? med.how_i_take_it.trim() : "";
  if (sig) {
    const dose = parseDose(med, sig);
    const freq = parseFrequency(sig);
    const di: NonNullable<MedicationRequest["dosageInstruction"]>[number] = { text: sig };
    if (freq) di.timing = { code: { text: freq } };
    if (dose) di.doseAndRate = [{ doseQuantity: toQuantity(dose) }];
    req.dosageInstruction = [di];
  }

  const latest = med.status === "stopped" ? stopped ?? started ?? "" : started ?? "";
  const key = ingredient ? `ing:${ingredient}` : `id:${med.homelog_med_id ?? entryId}`;
  return { req, key, status, latest, entryId };
}

function toQuantity(d: Dose): Quantity {
  const code = d.unit === "mcg" ? "ug" : d.unit === "units" ? "[iU]" : d.unit === "tablet" ? "{tbl}" : d.unit;
  return { value: d.value, unit: d.unit, system: "http://unitsofmeasure.org", code };
}
