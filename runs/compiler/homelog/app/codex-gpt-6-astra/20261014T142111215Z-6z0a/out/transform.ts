import type { FolioItem, ViewRows, MedicationRow, VitalRow, Evidence, Sensitivity } from "../in/views/views";

type Obj = Record<string, unknown>;
type Item = { id: string; issuer: string; recorded: number; data: Obj; entries: [string, Obj][] };
type Dose = NonNullable<MedicationRow["dose"]>;
type Reading = {
  row: VitalRow; issuer: string; kind: "bp" | "glucose"; device: boolean; typed: boolean;
  minute: number; arm?: string; raw?: number; unit?: string;
};

function object(value: unknown): value is Obj {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}
function finite(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }
function cmp(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function ids(value: unknown): string[] { return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []; }
function key(issuer: string, id: string): string { return JSON.stringify([issuer, id]); }
function itemKey(item: Item): string { return key(item.issuer, item.id); }
function itemOrder(a: Item, b: Item): number {
  return a.recorded - b.recorded || cmp(a.issuer, b.issuer) || cmp(a.id, b.id);
}

function partialDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) return;
  const [y, m, d] = value.split("-").map(Number);
  if (y < 1 || (m !== undefined && (m < 1 || m > 12))) return;
  const days = [31, y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (d !== undefined && (d < 1 || d > days[m - 1])) return;
  return value;
}
function wallTime(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return;
  if (!partialDate(value.slice(0, 10)) || +value.slice(11, 13) > 23 || +value.slice(14, 16) > 59) return;
  return value;
}
function recordedTime(value: unknown): number | undefined {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) return;
  if (!wallTime(value.slice(0, 16)) || +value.slice(17, 19) > 59) return;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : undefined;
}
function evidence(item: Item, entry: string): Evidence { return [{ item_id: item.id, entry_id: entry }]; }
function evidenceOrder(a: Evidence[number], b: Evidence[number]): number {
  return cmp(a.item_id, b.item_id) || cmp(a.entry_id ?? "", b.entry_id ?? "");
}

// Explicit spelling/brand equivalences, never a product-CUI-to-ingredient-CUI conversion.
const drugNames: Record<string, string> = Object.create(null) as Record<string, string>;
const drugGroups = [
  ["lisinopril", "zestril", "prinivil", "qbrelis"], ["amlodipine", "norvasc"],
  ["metformin", "glucophage", "glucophage xr", "fortamet", "glumetza", "riomet"],
  ["glipizide", "glucotrol", "glucotrol xl"], ["glyburide", "diabeta", "glynase"], ["glimepiride", "amaryl"],
  ["rosuvastatin", "crestor"], ["atorvastatin", "lipitor"], ["simvastatin", "zocor"],
  ["pravastatin", "pravachol"], ["lovastatin", "mevacor", "altoprev"], ["pitavastatin", "livalo"],
  ["levothyroxine", "synthroid", "levoxyl", "unithroid", "tirosint", "euthyrox"],
  ["dapagliflozin", "farxiga", "forxiga"], ["empagliflozin", "jardiance"], ["canagliflozin", "invokana"],
  ["ertugliflozin", "steglatro"], ["sitagliptin", "januvia"], ["linagliptin", "tradjenta"],
  ["saxagliptin", "onglyza"], ["alogliptin", "nesina"], ["pioglitazone", "actos"],
  ["semaglutide", "ozempic", "wegovy", "rybelsus"], ["dulaglutide", "trulicity"],
  ["liraglutide", "victoza", "saxenda"], ["tirzepatide", "mounjaro", "zepbound"],
  ["insulin glargine", "lantus", "basaglar", "toujeo", "semglee", "rezvoglar"],
  ["insulin lispro", "humalog", "admelog", "lyumjev"], ["insulin aspart", "novolog", "novorapid", "fiasp"],
  ["insulin detemir", "levemir"], ["insulin degludec", "tresiba"], ["insulin glulisine", "apidra"],
  ["insulin human", "regular insulin", "humulin r", "novolin r"],
  ["naproxen", "aleve", "naprosyn", "anaprox"], ["ibuprofen", "advil", "motrin"],
  ["acetaminophen", "tylenol", "paracetamol"], ["aspirin", "acetylsalicylic acid"],
  ["celecoxib", "celebrex"], ["meloxicam", "mobic"], ["diclofenac", "voltaren"],
  ["losartan", "cozaar"], ["valsartan", "diovan"], ["irbesartan", "avapro"],
  ["olmesartan", "benicar"], ["telmisartan", "micardis"], ["candesartan", "atacand"],
  ["enalapril", "vasotec"], ["ramipril", "altace"], ["benazepril", "lotensin"],
  ["hydrochlorothiazide", "hctz", "microzide"], ["chlorthalidone", "hygroton", "thalitone"],
  ["furosemide", "lasix"], ["torsemide", "demadex"], ["bumetanide", "bumex"],
  ["spironolactone", "aldactone"], ["eplerenone", "inspra"], ["finerenone", "kerendia"],
  ["metoprolol", "lopressor", "toprol", "toprol xl"], ["carvedilol", "coreg"],
  ["atenolol", "tenormin"], ["propranolol", "inderal"], ["nebivolol", "bystolic"],
  ["bisoprolol", "zebeta"], ["diltiazem", "cardizem", "cartia", "tiazac"],
  ["verapamil", "calan", "verelan"], ["nifedipine", "procardia", "adalat"],
  ["clonidine", "catapres"], ["hydralazine", "apresoline"], ["doxazosin", "cardura"],
  ["ezetimibe", "zetia"], ["fenofibrate", "tricor"], ["fenofibric acid", "trilipix"], ["gemfibrozil", "lopid"],
  ["apixaban", "eliquis"], ["rivaroxaban", "xarelto"], ["warfarin", "coumadin", "jantoven"],
  ["dabigatran", "pradaxa"], ["clopidogrel", "plavix"], ["ticagrelor", "brilinta"],
  ["omeprazole", "prilosec"], ["pantoprazole", "protonix"], ["esomeprazole", "nexium"],
  ["lansoprazole", "prevacid"], ["famotidine", "pepcid"], ["ondansetron", "zofran"],
  ["albuterol", "salbutamol", "ventolin", "proair", "proventil"], ["levalbuterol", "xopenex"],
  ["budesonide", "pulmicort"], ["fluticasone", "flonase", "flovent"], ["montelukast", "singulair"],
  ["tiotropium", "spiriva"], ["cetirizine", "zyrtec"], ["loratadine", "claritin"],
  ["fexofenadine", "allegra"], ["diphenhydramine", "benadryl"],
  ["sertraline", "zoloft"], ["fluoxetine", "prozac", "sarafem"], ["escitalopram", "lexapro"],
  ["citalopram", "celexa"], ["paroxetine", "paxil"], ["venlafaxine", "effexor", "effexor xr"],
  ["duloxetine", "cymbalta"], ["bupropion", "wellbutrin", "wellbutrin xl", "zyban"],
  ["trazodone", "desyrel"], ["mirtazapine", "remeron"], ["buspirone", "buspar"],
  ["aripiprazole", "abilify"], ["quetiapine", "seroquel"], ["olanzapine", "zyprexa"],
  ["risperidone", "risperdal"], ["lithium", "lithobid"], ["lamotrigine", "lamictal"],
  ["lorazepam", "ativan"], ["alprazolam", "xanax"], ["clonazepam", "klonopin"],
  ["gabapentin", "neurontin"], ["pregabalin", "lyrica"], ["zolpidem", "ambien"],
  ["amitriptyline", "elavil"], ["nortriptyline", "pamelor"],
  ["hydroxyzine", "atarax", "vistaril"], ["desvenlafaxine", "pristiq"], ["vortioxetine", "trintellix"],
  ["levetiracetam", "keppra"], ["topiramate", "topamax"], ["carbamazepine", "tegretol"],
  ["oxcarbazepine", "trileptal"], ["baclofen", "lioresal"], ["cyclobenzaprine", "flexeril"],
  ["tizanidine", "zanaflex"], ["tramadol", "ultram"], ["oxycodone", "oxycontin", "roxicodone"],
  ["morphine", "ms contin"], ["hydromorphone", "dilaudid"], ["fentanyl", "duragesic"],
  ["buprenorphine", "subutex", "butrans"], ["naloxone", "narcan"], ["naltrexone", "revia", "vivitrol"],
  ["methadone", "dolophine"], ["disulfiram", "antabuse"], ["acamprosate", "campral"],
  ["amoxicillin", "amoxil"], ["azithromycin", "zithromax"], ["doxycycline", "vibramycin"],
  ["cephalexin", "keflex"], ["nitrofurantoin", "macrobid", "macrodantin"],
  ["sulfamethoxazole / trimethoprim", "bactrim", "septra"], ["ciprofloxacin", "cipro"],
  ["prednisone", "deltasone"], ["prednisolone", "orapred"], ["methylprednisolone", "medrol"],
  ["allopurinol", "zyloprim"], ["colchicine", "colcrys"], ["tamsulosin", "flomax"],
  ["finasteride", "proscar", "propecia"], ["sildenafil", "viagra", "revatio"], ["tadalafil", "cialis", "adcirca"],
  ["alendronate", "fosamax"], ["hydroxychloroquine", "plaquenil"], ["methotrexate", "trexall"],
  ["potassium chloride", "klor-con", "k-dur"], ["ferrous sulfate"], ["magnesium oxide"],
  ["calcium carbonate", "tums"], ["cholecalciferol", "vitamin d3"], ["ergocalciferol", "vitamin d2"],
  ["cyanocobalamin", "vitamin b12", "vitamin b-12"], ["ascorbic acid", "vitamin c"], ["folic acid"], ["melatonin"],
  ["lisinopril / hydrochlorothiazide", "zestoretic", "prinzide"],
  ["losartan / hydrochlorothiazide", "hyzaar"], ["valsartan / hydrochlorothiazide", "diovan hct"],
  ["amlodipine / benazepril", "lotrel"], ["amlodipine / valsartan", "exforge"],
  ["sacubitril / valsartan", "entresto"], ["sitagliptin / metformin", "janumet", "janumet xr"],
  ["empagliflozin / metformin", "synjardy", "synjardy xr"], ["dapagliflozin / metformin", "xigduo xr"],
  ["amoxicillin / clavulanic acid", "augmentin"], ["buprenorphine / naloxone", "suboxone", "zubsolv"],
];
for (const group of drugGroups) for (const name of group) drugNames[name] = group[0];

function cleanDrug(value: string): string {
  return value.toLowerCase().replace(/[®™]/g, "").replace(/[_]/g, " ").replace(/\s+/g, " ").trim();
}
function ingredientName(value: string): string | undefined {
  let text = cleanDrug(value);
  if (drugNames[text]) return drugNames[text];
  // A generic search display can carry a strength, a salt and a dose form.
  text = text.replace(/\s*\[[^\]]*\]\s*$/, "").replace(/\s*\([^)]*\)\s*$/, "");
  text = text.replace(/\s+\d.*$/, "");
  text = text.replace(/\b(?:oral|injection|injectable|subcutaneous|ophthalmic|otic|topical|transdermal|inhalation|tablet|tablets|capsule|capsules|solution|suspension|cream|ointment|gel|patch|pen|kwikpen|solostar|flexpen|flextouch|hfa)\b.*$/, "").trim();
  if (drugNames[text]) return drugNames[text];
  text = text.replace(/\s+(?:hydrochloride|hcl|hydrobromide|hbr|potassium|sodium|calcium|succinate|tartrate|besylate|maleate|mesylate|fumarate|phosphate|sulfate|sulphate|acetate|citrate|carbonate|dihydrate|monohydrate|hydrate)\b/g, "");
  text = text.replace(/\s+(?:extended release|delayed release|immediate release|er|xr|sr|xl|dr)\b.*$/, "").trim();
  return drugNames[text];
}
function ingredients(entry: Obj): string[] {
  const picked = object(entry.picked_from_search) ? string(entry.picked_from_search.display) : undefined;
  const name = string(entry.name);
  for (const candidate of [picked, name]) {
    if (!candidate) continue;
    const parts = candidate.split(/\s*\+\s*|\s*\/\s*(?=[a-z])/i);
    if (parts.length > 1) {
      const mapped = parts.map(ingredientName);
      if (mapped.every((p): p is string => p !== undefined)) return mapped.flatMap(p => p.split(" / "));
    }
    // Do not truncate a combination product to just its first ingredient.
    const direct = parts.length === 1 || !parts.slice(1).some(p => ingredientName(p)) ? ingredientName(candidate) : undefined;
    if (direct) return direct.split(" / ");
    // A search display is source-supplied identity text, unlike an arbitrary patient nickname.
    if (candidate === picked) {
      const generic = cleanDrug(candidate).split(/\s+\d/)[0]
        .replace(/\s+(?:hydrochloride|sodium|potassium|calcium|succinate|tartrate|besylate|maleate|fumarate)\b/g, "")
        .replace(/\s+(?:oral|tablet|capsule|solution|injection|extended release|delayed release)\b.*$/, "").trim();
      if (/^[a-z]+(?:[ -][a-z]+){0,3}$/.test(generic) && !/\b(?:unknown|pill|medicine|medication|drug)\b/.test(generic)) return [generic];
    }
  }
  return [];
}

const numberWords: Record<string, string> = { one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10", half: "0.5" };
const numberPattern = "(?:\\d+(?:\\.\\d+)?(?:\\/\\d+)?|\\.\\d+)";
function directions(value: string): string {
  return value.toLowerCase().replace(/[–—]/g, "-")
    .replace(/(\d+)\s*½/g, (_, n: string) => String(Number(n) + 0.5))
    .replace(/(\d+)\s*¼/g, (_, n: string) => String(Number(n) + 0.25))
    .replace(/(\d+)\s+(\d+)\/(\d+)/g, (_, a: string, b: string, c: string) => String(Number(a) + Number(b) / Number(c)))
    .replace(/½/g, " 0.5").replace(/¼/g, " 0.25")
    .replace(/\bone and a half\b/g, "1.5").replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|half)\b/g, w => numberWords[w])
    .replace(/\b(?:a |an )?(?:1\/2|0\.5)(?: a| of a)?\b/g, "0.5").replace(/\s+/g, " ").trim();
}
function amount(text: string): number {
  const parts = text.split("/").map(Number);
  return parts.length === 2 ? parts[0] / parts[1] : parts[0];
}
function doseUnit(unit: string): Dose["unit"] | undefined {
  const u = unit.toLowerCase();
  if (/^(mg|milligrams?)$/.test(u)) return "mg";
  if (/^(mcg|ug|μg|µg|micrograms?)$/.test(u)) return "mcg";
  if (/^(units?|unt|iu|u|\[iu\])$/.test(u)) return "units";
  if (/^(ml|millilit(?:er|re)s?)$/.test(u)) return "mL";
  if (/^(tabs?|tablets?|caps?|capsules?)$/.test(u)) return "tablet";
  return undefined;
}
function massStrength(text: string): Dose | undefined {
  // A liquid concentration is not a tablet strength.
  if (/\/(?:\s*\d+(?:\.\d+)?\s*)?(?:ml|l)\b/i.test(text)) return;
  const matches = [...text.matchAll(new RegExp(`(${numberPattern})\\s*(mg|mcg|ug|μg|µg|g|milligrams?|micrograms?)\\b`, "gi"))];
  if (matches.length !== 1) return;
  const value = amount(matches[0][1]);
  const unit = matches[0][2].toLowerCase();
  if (!Number.isFinite(value) || value <= 0) return;
  return unit === "g" ? { value: value * 1000, unit: "mg" } : { value, unit: doseUnit(unit)! };
}
function frequency(text: string): MedicationRow["frequency"] {
  const t = directions(text).replace(/\b([bqt])\.?i\.?d\.?\b/g, "$1id")
    .replace(/\bq\.d\./g, "qd").replace(/\bq\.h\.s\./g, "qhs");
  if (/\b(prn|as needed|when needed|if needed|as required|when required)\b/.test(t)) return "PRN";
  if (/\b(?:every 7 days|q7d)\b/.test(t)) return "QW";
  if (/\b(?:every 1 day|q1d)\b/.test(t)) return "QD";
  if (/\b(every other|alternate|alternating|most days|some days|occasionally|qod|monthly|yearly|every \d+ (?:days|weeks|months))\b/.test(t)
      || /\b(?:twice|[2-9] times)\s+(?:(?:a|per|each)\s+)?(?:week|month|year)(?:ly)?\b/.test(t)) return "other";
  if (/\b(qid|4 times|four times|q6h|every 6 hours)\b/.test(t)) return "other";
  if (/\b(tid|3 times|three times|q8h|every 8 hours)\b/.test(t)) return "TID";
  if (/\b(bid|twice|2 times|q12h|every 12 hours)\b/.test(t)) return "BID";
  if (/\b(qw|qweek|weekly|once a week|once per week|every week|each week|every (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/.test(t)) return "QW";
  const slots = [
    /\b(morning|breakfast|am)\b/.test(t), /\b(noon|midday|lunch|afternoon)\b/.test(t),
    /\b(evening|supper|dinner|pm)\b/.test(t), /\b(bedtime|night|nightly|qhs|at hs)\b/.test(t),
  ];
  if (slots[2] && slots[3] && !/\b(?:evening|supper|dinner|pm)\b.*\band\b.*\b(?:bedtime|night|nightly)\b|\b(?:bedtime|night)\b.*\band\b.*\b(?:evening|supper|dinner|pm)\b/.test(t)) slots[2] = false;
  const count = slots.filter(Boolean).length;
  if (count > 3) return "other";
  if (count === 3) return "TID";
  if (count === 2) return "BID";
  if (slots[3]) return "QHS";
  if (count === 1 || /\b(qd|daily|every day|each day|per day|once a day|once per day|q24h|every 24 hours)\b|\/day\b/.test(t)) return "QD";
  if (/\b(every|with meals|times|days? a week)\b/.test(t)) return "other";
  return undefined;
}

function medicationDose(entry: Obj, allIngredients: string[], ingredientIndex: number): Dose | undefined {
  const raw = string(entry.how_i_take_it);
  if (!raw) return;
  const t = directions(raw);
  if (new RegExp(`${numberPattern}\\s*(?:or|to|-)\\s*${numberPattern}`).test(t)
      || /\b(sliding scale|as directed|variable|varies|titrate|titrating|depending|between|up to)\b/.test(t)) return;
  if (/\b(puffs?|drops?|patch(?:es)?|sprays?|applications?)\b/.test(t)) return;
  const picked = object(entry.picked_from_search) ? string(entry.picked_from_search.display) : undefined;
  const strength = string(entry.strength_text) ?? picked ?? "";
  let mass = massStrength(strength);
  if (allIngredients.length > 1) {
    // Combination strengths must be individually identified, in the source's component order.
    const parts = strength.split(/\s*\/\s*(?!ml\b)/i);
    if (parts.length === allIngredients.length) {
      const trailingUnit = parts[parts.length - 1].match(/\b(mg|mcg|g)\b/i)?.[1];
      mass = massStrength(parts[ingredientIndex] + (/\b(mg|mcg|g)\b/i.test(parts[ingredientIndex]) ? "" : ` ${trailingUnit ?? ""}`));
    } else mass = undefined;
  }
  const unitPattern = "mg|mcg|ug|μg|µg|g|milligrams?|micrograms?|units?|unt|iu|u|\\[iu\\]|ml|millilit(?:er|re)s?|tabs?|tablets?|caps?|capsules?";
  const quantities = [...t.matchAll(new RegExp(`(${numberPattern})\\s*(${unitPattern})(?![a-z])`, "g"))];
  const direct = quantities.filter(m => !/^(tabs?|tablets?|caps?|capsules?)$/.test(m[2]));
  if (direct.length) {
    // Do not mistake the strength in "two 500 mg tablets" for the total dose.
    const productCount = t.match(new RegExp(`(${numberPattern})\\s*(?:x|of the)?\\s+(${numberPattern})\\s*(mg|mcg|g)\\s*(?:tabs?|tablets?|caps?|capsules?)\\b`))
      ?? t.match(new RegExp(`(${numberPattern})\\s*x\\s*(${numberPattern})\\s*(mg|mcg|g)\\b`));
    if (productCount && allIngredients.length <= 1) {
      const per = massStrength(`${productCount[2]} ${productCount[3]}`);
      if (per) {
        const value = amount(productCount[1]) * per.value;
        return finite(value) && value > 0 ? { value, unit: per.unit } : undefined;
      }
    }
    if (allIngredients.length > 1) return;
    const parsed = direct.map(m => ({ value: amount(m[1]) * (m[2] === "g" ? 1000 : 1), unit: m[2] === "g" ? "mg" as const : doseUnit(m[2]) }));
    if (!parsed.every(p => finite(p.value) && p.value > 0 && p.unit === parsed[0].unit && p.value === parsed[0].value) || !parsed[0].unit) return;
    // "100 units/mL" is a concentration, not an administered amount.
    if (direct.some(m => /^\s*\//.test(t.slice((m.index ?? 0) + m[0].length)))) return;
    return { value: parsed[0].value, unit: parsed[0].unit };
  }
  const counts = quantities.map(m => amount(m[1]));
  {
    for (const m of t.matchAll(new RegExp(`(${numberPattern})(?![\\d./])`, "g"))) {
      const after = t.slice((m.index ?? 0) + m[0].length);
      const before = t.slice(0, m.index);
      if (/^\s*(?:times?|x\b|hours?|days?|weeks?|am\b|pm\b|:)/.test(after) || /(?:every|q|at)\s*$/.test(before)) continue;
      if (/^\s*(?:$|in the |in |at |with |before |after |each |every |daily|nightly|morning|evening|bedtime|for |twice|once|three times|bid\b|tid\b|qd\b|qhs\b|as needed)/.test(after)) counts.push(amount(m[1]));
    }
  }
  if (counts.some(n => !finite(n) || n <= 0 || n !== counts[0])) return;
  const count = counts[0] ?? 1;
  if (!counts.length && !frequency(t) && !/\b(?:take|swallow|with food|with water|after food|before food)\b/.test(t)) return;
  const form = `${entry.name ?? ""} ${picked ?? ""} ${strength}`.toLowerCase();
  if (allIngredients.some(i => i.startsWith("insulin "))
      || /\b(insulin|injection|injectable|pen|cream|ointment|patch|inhaler|solution|suspension|ozempic|wegovy|trulicity|mounjaro|zepbound|victoza|saxenda)\b|\/(?:ml|l)\b/i.test(form)
      || (/\b(inject|apply|inhale)\b/.test(t))) return;
  const result = mass ? { value: mass.value * count, unit: mass.unit } : { value: count, unit: "tablet" as const };
  return finite(result.value) ? result : undefined;
}

function holdText(value: string): boolean {
  // Past holds and explicit negation should not override the list's current state.
  const t = value.toLowerCase().replace(/[’]/g, "'");
  if (/\b(?:not|no longer) (?:on hold|paused|holding|stopping)\b|\b(?:restarted|resumed|back on|taking again)\b/.test(t)) return false;
  if (/\b(?:will|plan to|planning to) (?:hold|pause|stop)\b/.test(t)) return false;
  return /^(?:hold)(?:\W|$)/.test(t)
    || /\b(?:on hold|held|holding|hold(?:ing)? (?:it|this|until|for|per|pending)|hold$|paused?|temporarily (?:stopped|off|not taking)|(?:stop|stopped|off) temporarily|taking a break|(?:stop|stopped|off|not taking)(?: it| this)? for now|(?:stop|stopped|off|not taking).*?until|told me to stop for now|resume (?:after|when|once|on))\b/.test(t);
}
function stopReason(note: string): MedicationRow["stop_reason"] {
  const t = note.toLowerCase().replace(/\b(?:no|without|not because of) (?:side effects?|adverse reactions?)\b/g, "");
  if (/\b(?:side effects?|adverse|allerg|rash|hives|cough|nausea|vomit|diarrh|dizz|swelling|angioedema|anaphyl|headache|fatigue|tired|upset stomach|stomach upset|made me (?:sick|feel sick)|muscle (?:pain|ache)|myalgia|hypoglyc|too low)\w*/.test(t)) return "adverse_reaction";
  if (/\b(?:ineffective|not working|no longer working|did(?:n't| not) (?:work|help)|no (?:benefit|effect)|was(?:n't| not) helping)\b/.test(t)) return "ineffective";
  if (/\b(?:switch|switched|switching|replac|changed to|instead|doctor changed)\w*/.test(t)) return "therapy_changed";
  if (/\b(?:finished|completed|course (?:done|complete)|treatment complete)\b/.test(t)) return "course_complete";
  if (/\b(?:my choice|patient choice|declin|prefer|don'?t want|didn'?t want|chose|decided|asked to stop|on my own)\w*/.test(t)) return "patient_choice";
  if (/\b(?:because|due to|cost|expensive|afford|insurance|ran out|no longer need|no longer needed|doctor (?:said|told)|told me|kidney|pregnan|surgery|operation)\w*/.test(t)) return "other";
  return undefined;
}
function statusDateInText(text: string): string | undefined {
  const m = text.match(/\b(?:hold|held|paused?|stopped?|not taking|off)(?: it| this)?(?: for now)?\s+(?:since|on|as of)\s+(\d{4}(?:-\d{2}(?:-\d{2})?)?)(?![\d-])/i);
  return m ? partialDate(m[1]) : undefined;
}
function sensitivities(ingredient: string | undefined): Sensitivity[] | undefined {
  if (!ingredient) return;
  if (/^(sertraline|fluoxetine|escitalopram|citalopram|paroxetine|venlafaxine|mirtazapine|buspirone|aripiprazole|quetiapine|olanzapine|risperidone|lithium)$/.test(ingredient)) return ["mental-health"];
  if (/^(disulfiram|acamprosate)$/.test(ingredient)) return ["substance-use"];
  return undefined;
}
function medicationRows(item: Item): MedicationRow[] {
  const candidates: { row: MedicationRow; medId: string; entryId: string }[] = [];
  for (const [entryId, entry] of item.entries) {
    const name = string(entry.name);
    if (entry.type !== "my_med" || !name) continue;
    const ing = ingredients(entry);
    const note = string(entry.note);
    const how = string(entry.how_i_take_it);
    const temporary = holdText(note ?? "") || holdText(how ?? "");
    const status: MedicationRow["status"] = temporary ? "held" : entry.status === "taking" ? "active" : entry.status === "stopped" ? "stopped" : "unknown";
    const reason = status === "stopped" && note ? stopReason(note) : undefined;
    const since = status === "active" ? partialDate(entry.started)
      : status === "stopped" || status === "held" ? partialDate(entry.stopped) ?? statusDateInText(note ?? "") : undefined;
    for (const [i, ingredient] of (ing.length ? ing : [undefined]).entries()) {
      const row: MedicationRow = { drug_name: name, status, patient_reported: true, evidence: evidence(item, entryId) };
      if (ingredient) row.ingredient = ingredient;
      const picked = object(entry.picked_from_search) ? entry.picked_from_search : undefined;
      // A bare generic display establishes ingredient level. A salt, strength, brand or form does not.
      if (ingredient && ing.length === 1 && picked && typeof picked.display === "string"
          && cleanDrug(picked.display) === ingredient && typeof picked.rxnorm === "string" && /^\d+$/.test(picked.rxnorm)) row.rxnorm_ingredient = picked.rxnorm;
      if (since) row.status_since = since;
      const dose = medicationDose(entry, ing, i);
      if (dose) row.dose = dose;
      const freq = how ? frequency(how) : undefined;
      if (freq) row.frequency = freq;
      if (reason) row.stop_reason = reason;
      if (status === "held") {
        const text = note && (holdText(note) || stopReason(note)) ? note : how && holdText(how) ? how : undefined;
        if (text) row.status_reason_text = text;
      } else if (reason && note) row.status_reason_text = note;
      if (entry.kind === "over_the_counter") row.otc = true;
      const sensitivity = sensitivities(ingredient);
      if (sensitivity) row.sensitivity = sensitivity;
      candidates.push({ row, medId: string(entry.homelog_med_id) ?? entryId, entryId });
    }
  }
  // Dates here describe each line's own event, not the date a whole list was saved.
  candidates.sort((a, b) => cmp(a.row.status_since ?? "", b.row.status_since ?? "") || cmp(a.medId, b.medId) || cmp(a.entryId, b.entryId));
  const latest = new Map<string, MedicationRow>();
  for (const c of candidates) latest.set(c.row.ingredient ? `ingredient:${c.row.ingredient}` : `unidentified:${c.medId}`, c.row);
  return [...latest.values()];
}

function readVital(item: Item, entryId: string, entry: Obj): Reading | undefined {
  if (entry.type !== "bp_reading" && entry.type !== "glucose_reading") return;
  const local = wallTime(entry.measured_at);
  if (!local) return;
  const row: VitalRow = { setting: "home", local_time: local, evidence: evidence(item, entryId) };
  const base = { row, issuer: item.issuer, typed: entry.entry_method === "typed", minute: Date.parse(`${local}:00Z`) / 60000 };
  if (entry.type === "bp_reading") {
    if (!finite(entry.systolic_mmhg) || !finite(entry.diastolic_mmhg)) return;
    row.systolic_mmhg = entry.systolic_mmhg;
    row.diastolic_mmhg = entry.diastolic_mmhg;
    if (finite(entry.pulse_bpm)) row.pulse_bpm = entry.pulse_bpm;
    return { ...base, kind: "bp", device: entry.entry_method === "cuff_sync", arm: string(entry.arm) };
  }
  if (!finite(entry.value) || (entry.unit !== "mg/dL" && entry.unit !== "mmol/L")) return;
  if (entry.out_of_range !== undefined && entry.out_of_range !== "HI" && entry.out_of_range !== "LO") return;
  const value = Math.round(entry.value * (entry.unit === "mmol/L" ? 18.016 : 1));
  if (!finite(value)) return;
  row.glucose_mg_dl = value;
  if (entry.out_of_range === "HI" || entry.out_of_range === "LO") row.glucose_out_of_range = entry.out_of_range;
  return { ...base, kind: "glucose", device: entry.entry_method === "meter_sync", raw: entry.value, unit: entry.unit };
}
function sameMeasurement(a: Reading, b: Reading): boolean {
  if (a.issuer !== b.issuer || a.kind !== b.kind || Math.abs(a.minute - b.minute) > 2) return false;
  if (a.kind === "glucose") return a.row.glucose_out_of_range === b.row.glucose_out_of_range
    && (a.unit === b.unit ? a.raw === b.raw : a.row.glucose_mg_dl === b.row.glucose_mg_dl);
  return a.row.systolic_mmhg === b.row.systolic_mmhg && a.row.diastolic_mmhg === b.row.diastolic_mmhg
    && (a.row.pulse_bpm === undefined || b.row.pulse_bpm === undefined || a.row.pulse_bpm === b.row.pulse_bpm)
    && (!a.arm || !b.arm || a.arm === b.arm);
}
function readingOrder(a: Reading, b: Reading): number {
  return cmp(a.row.local_time, b.row.local_time) || cmp(a.kind, b.kind) || cmp(a.issuer, b.issuer) || evidenceOrder(a.row.evidence[0], b.row.evidence[0]);
}
function deduplicateReadings(readings: Reading[]): VitalRow[] {
  readings.sort(readingOrder);
  const devices = readings.filter(r => r.device);
  const retained: Reading[] = [];
  for (const r of readings) {
    let match: Reading | undefined;
    if (r.typed) {
      let low = 0, high = devices.length;
      while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (devices[mid].minute < r.minute - 2) low = mid + 1;
        else high = mid;
      }
      for (let i = low; i < devices.length && devices[i].minute <= r.minute + 2; i++) {
        const d = devices[i];
        if (sameMeasurement(d, r) && (!match || Math.abs(d.minute - r.minute) < Math.abs(match.minute - r.minute)
            || (Math.abs(d.minute - r.minute) === Math.abs(match.minute - r.minute) && readingOrder(d, match) < 0))) match = d;
      }
    }
    if (match) match.row.evidence.push(...r.row.evidence);
    else retained.push(r);
  }
  for (const r of retained) r.row.evidence.sort(evidenceOrder);
  return retained.map(r => r.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const result: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!Array.isArray(items) || typeof asOf !== "string" || asOf.length !== 10 || !partialDate(asOf)) return result;
  const chicago = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" });
  const scoped: Item[] = [];
  for (const data of items as unknown[]) {
    if (!object(data)) continue;
    const id = string(data.id), issuer = string(data.issuer), recorded = recordedTime(data.recorded);
    if (!id || !issuer || recorded === undefined) continue;
    const parts = chicago.formatToParts(new Date(recorded));
    const date = ["year", "month", "day"].map(p => parts.find(v => v.type === p)?.value ?? "").join("-");
    if (date > asOf) continue;
    const entries: [string, Obj][] = object(data.payload) ? Object.entries(data.payload)
      .filter((e): e is [string, Obj] => object(e[1])).sort((a, b) => cmp(a[0], b[0])) : [];
    scoped.push({ id, issuer, recorded, data, entries });
  }
  scoped.sort(itemOrder);
  const suppressed = new Set<string>();
  const snapshots = new Set<string>();
  for (const item of scoped) {
    // Even a subsequently corrected/retracted item's outgoing links still suppress its ancestors.
    for (const id of [...ids(item.data.supersedes), ...ids(item.data.retracts)]) suppressed.add(key(item.issuer, id));
    if (item.entries.some(([, e]) => e.type === "my_med")
        || (typeof item.data.narrative === "string" && /^My Medicines,\s*saved\b/i.test(item.data.narrative.trim()))) snapshots.add(itemKey(item));
  }
  // An empty replacement can clear a list. Retraction-only notices are not list saves.
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of scoped) {
      if (!snapshots.has(itemKey(item)) && item.entries.length === 0
          && ids(item.data.supersedes).some(id => snapshots.has(key(item.issuer, id)))) {
        snapshots.add(itemKey(item)); changed = true;
      }
    }
  }
  const latestList = new Map<string, Item>();
  const readings: Reading[] = [];
  const seen = new Set<string>();
  for (const item of scoped) {
    if (suppressed.has(itemKey(item)) || seen.has(itemKey(item))) continue;
    seen.add(itemKey(item));
    if (snapshots.has(itemKey(item))) latestList.set(item.issuer, item);
    for (const [entryId, entry] of item.entries) {
      const reading = readVital(item, entryId, entry);
      if (reading) readings.push(reading);
      // Dose logs are administrations, not medication-list states. Diary tags are symptoms,
      // not a diagnosis/problem list or an assertion of a drug allergy. Neither has a target row.
    }
  }
  for (const list of latestList.values()) result.medications.push(...medicationRows(list));
  result.medications.sort((a, b) => cmp(a.ingredient ?? a.drug_name.toLowerCase(), b.ingredient ?? b.drug_name.toLowerCase()) || evidenceOrder(a.evidence[0], b.evidence[0]));
  result.vitals = deduplicateReadings(readings);
  return result;
}
