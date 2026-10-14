import type { FolioItem, UsCoreRows, MedicationRequest, Quantity } from "../in/views/uscore";

/* HomeLog has self-reported medication snapshots, not prescriptions or laboratory
 * results. In particular, meter glucose, diary notes and dose logs do not produce
 * resources in this view. No information is carried forward from an older list. */
type Obj = Record<string, unknown>;
type Frequency = "QD" | "BID" | "TID" | "QHS" | "QW" | "PRN" | "other";
type StopReason = "adverse_reaction" | "ineffective" | "therapy_changed" |
  "course_complete" | "patient_choice" | "other";
const RXNORM = "http://www.nlm.nih.gov/research/umls/rxnorm";
const UCUM = "http://unitsofmeasure.org";
const PROFILE = "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest";

function object(value: unknown): Obj | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Obj : undefined;
}
function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}
function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}
function compare(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function key(...parts: string[]): string { return JSON.stringify(parts); }

// Validate without padding partial dates or interpreting them in the host zone.
function partialDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) return;
  const [y, m, d] = value.split("-").map(Number);
  if (y < 1 || (m !== undefined && (m < 1 || m > 12))) return;
  const days = [31, y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (d !== undefined && (d < 1 || d > days[m - 1])) return;
  return value;
}
function instant(value: unknown): number | undefined {
  if (typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ||
      !partialDate(value.slice(0, 10))) return;
  if (Number(value.slice(11, 13)) > 23 || Number(value.slice(14, 16)) > 59 ||
      Number(value.slice(17, 19)) > 59) return;
  const n = Date.parse(value);
  return Number.isFinite(n) ? n : undefined;
}
const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
});
function localDate(time: number): string {
  const p = chicago.formatToParts(time);
  return ["year", "month", "day"].map(t => (p.find(v => v.type === t)?.value ?? "")
    .padStart(t === "year" ? 4 : 2, "0")).join("-");
}

interface Item {
  id: string; issuer: string; patient: string; recorded: number; effective: string;
  narrative: string; payload: Obj; supersedes: string[]; retracts: string[];
}
function readItem(raw: unknown, asOf: string): Item | undefined {
  const r = object(raw);
  if (!r) return;
  const id = string(r.id), issuer = string(r.issuer), patient = string(r.patient);
  const recorded = instant(r.recorded);
  if (!id || !issuer || !patient || recorded === undefined || localDate(recorded) > asOf) return;
  return { id, issuer, patient, recorded,
    effective: partialDate(r.effective) ?? localDate(recorded),
    narrative: string(r.narrative) ?? "", payload: object(r.payload) ?? {},
    supersedes: strings(r.supersedes), retracts: strings(r.retracts) };
}
function itemKey(i: Item): string { return key(i.issuer, i.id); }
function compareItems(a: Item, b: Item): number {
  // The save date is the snapshot's clinical date; recorded orders same-day saves.
  return compare(a.effective, b.effective) || a.recorded - b.recorded || compare(a.id, b.id);
}

/* A small explicit synonym vocabulary handles common patient-entered brands.
 * Drug-search displays also carry generic names, so no terminology lookup or
 * product-to-ingredient RxNorm conversion is needed. Unknown nicknames stay intact. */
const drugNames: Record<string, string[]> = {
  lisinopril: ["zestril", "prinivil"], amlodipine: ["norvasc"],
  metformin: ["glucophage", "glumetza", "fortamet", "riomet"],
  glipizide: ["glucotrol"], glyburide: ["diabeta", "glynase", "glibenclamide"],
  glimepiride: ["amaryl"], rosuvastatin: ["crestor"], atorvastatin: ["lipitor"],
  simvastatin: ["zocor"], pravastatin: ["pravachol"], lovastatin: ["mevacor"],
  levothyroxine: ["synthroid", "levoxyl", "unithroid", "tirosint", "euthyrox"],
  dapagliflozin: ["farxiga", "forxiga"], empagliflozin: ["jardiance"],
  canagliflozin: ["invokana"], sitagliptin: ["januvia"], linagliptin: ["tradjenta"],
  saxagliptin: ["onglyza"], pioglitazone: ["actos"],
  semaglutide: ["ozempic", "wegovy", "rybelsus"], dulaglutide: ["trulicity"],
  liraglutide: ["victoza", "saxenda"], tirzepatide: ["mounjaro", "zepbound"],
  "insulin glargine": ["lantus", "basaglar", "toujeo", "semglee"],
  "insulin lispro": ["humalog", "admelog", "lyumjev"],
  "insulin aspart": ["novolog", "novorapid", "fiasp"],
  "insulin detemir": ["levemir"], "insulin degludec": ["tresiba"],
  "insulin regular": ["humulin r", "novolin r", "regular insulin"],
  "insulin isophane": ["humulin n", "novolin n", "nph insulin", "insulin nph"],
  losartan: ["cozaar"], valsartan: ["diovan"], irbesartan: ["avapro"],
  olmesartan: ["benicar"], telmisartan: ["micardis"], candesartan: ["atacand"],
  enalapril: ["vasotec"], ramipril: ["altace"], benazepril: ["lotensin"],
  metoprolol: ["lopressor", "toprol"], carvedilol: ["coreg"], atenolol: ["tenormin"],
  propranolol: ["inderal"], bisoprolol: ["zebeta"], nebivolol: ["bystolic"],
  hydrochlorothiazide: ["hctz", "microzide"], chlorthalidone: ["hygroton", "thalitone"],
  furosemide: ["lasix"], torsemide: ["demadex"], bumetanide: ["bumex"],
  spironolactone: ["aldactone"], eplerenone: ["inspra"],
  diltiazem: ["cardizem", "cartia", "tiazac"], verapamil: ["calan", "verelan"],
  nifedipine: ["procardia", "adalat"], hydralazine: ["apresoline"],
  naproxen: ["aleve", "naprosyn"], ibuprofen: ["advil", "motrin"],
  acetaminophen: ["tylenol", "paracetamol"], aspirin: ["ecotrin"],
  diclofenac: ["voltaren"], celecoxib: ["celebrex"], meloxicam: ["mobic"],
  gabapentin: ["neurontin"], pregabalin: ["lyrica"], tramadol: ["ultram"],
  allopurinol: ["zyloprim"], colchicine: ["colcrys", "mitigare"],
  omeprazole: ["prilosec"], pantoprazole: ["protonix"], esomeprazole: ["nexium"],
  lansoprazole: ["prevacid"], famotidine: ["pepcid"],
  apixaban: ["eliquis"], rivaroxaban: ["xarelto"], warfarin: ["coumadin", "jantoven"],
  dabigatran: ["pradaxa"], clopidogrel: ["plavix"], ticagrelor: ["brilinta"],
  ezetimibe: ["zetia"], fenofibrate: ["tricor"], "fenofibric acid": ["trilipix"],
  sertraline: ["zoloft"], fluoxetine: ["prozac"], escitalopram: ["lexapro"],
  citalopram: ["celexa"], paroxetine: ["paxil"], bupropion: ["wellbutrin", "zyban"],
  duloxetine: ["cymbalta"], venlafaxine: ["effexor"], trazodone: ["desyrel"],
  mirtazapine: ["remeron"], quetiapine: ["seroquel"], aripiprazole: ["abilify"],
  alprazolam: ["xanax"], lorazepam: ["ativan"], clonazepam: ["klonopin"],
  zolpidem: ["ambien"], buspirone: ["buspar"],
  albuterol: ["ventolin", "proair", "proventil", "salbutamol"],
  fluticasone: ["flonase", "flovent"], budesonide: ["pulmicort", "rhinocort"],
  montelukast: ["singulair"], cetirizine: ["zyrtec"], loratadine: ["claritin"],
  fexofenadine: ["allegra"], diphenhydramine: ["benadryl"],
  tamsulosin: ["flomax"], finasteride: ["proscar", "propecia"],
  sildenafil: ["viagra", "revatio"], tadalafil: ["cialis", "adcirca"],
  amoxicillin: ["amoxil"], azithromycin: ["zithromax"], doxycycline: ["vibramycin"],
  prednisone: ["deltasone"], methylprednisolone: ["medrol"],
  ondansetron: ["zofran"], hydroxychloroquine: ["plaquenil"],
  alendronate: ["fosamax"], methotrexate: ["trexall"],
  "potassium chloride": ["klor-con", "k-dur"], "folic acid": [],
  hydroxyzine: ["atarax", "vistaril"], nitrofurantoin: ["macrobid", "macrodantin"],
  buprenorphine: ["subutex"], naltrexone: ["revia", "vivitrol"],
  estradiol: ["estrace"], progesterone: ["prometrium"], norethindrone: ["aygestin"],
  "ferrous sulfate": [], "calcium carbonate": [], "calcium citrate": [], "magnesium oxide": [],
  cholecalciferol: ["vitamin d3"], ergocalciferol: ["vitamin d2"],
  cyanocobalamin: [], methylcobalamin: [], "vitamin b12": ["vitamin b-12"], melatonin: [],
};
function normalized(s: string): string {
  return s.toLowerCase().replace(/[®™]/g, "").replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
}
function escapeRegex(s: string): string { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function stripProduct(s: string): string {
  return normalized(s)
    .replace(/\s*\[[^\]]*\]\s*/g, " ")
    .replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|ug|g|ml|units?|unt|iu)\b.*$/i, "")
    .replace(/\b(?:hydrochloride|hcl|besylate|besilate|succinate|tartrate|maleate|fumarate|mesylate)\b/g, "")
    .replace(/\b(?:oral|tablet|tablets|capsule|capsules|extended release|delayed release|immediate release|er|xr|xl|sr|dr)\b/g, "")
    .replace(/\s+/g, " ").trim();
}
function ingredients(text: string, fromSearch: boolean): string | undefined {
  const s = normalized(text);
  const found: string[] = [];
  for (const [ingredient, aliases] of Object.entries(drugNames)) {
    if ([ingredient, ...aliases].some(a => new RegExp(`(?:^|[^a-z0-9])${escapeRegex(a)}(?=$|[^a-z0-9])`).test(s))) {
      found.push(ingredient);
    }
  }
  // Do not identify a combination as just its one recognized component.
  if (found.length && !/(?:\s\/\s|\s\+\s)/.test(s)) return found.sort(compare).join(" / ");
  const clean = stripProduct(s);
  if (found.length > 1) return found.sort(compare).join(" / ");
  if (fromSearch && /^[a-z][a-z -]*$/.test(clean) &&
      !/\b(?:pill|medicine|unknown|unspecified|solution|injection|cream|inhaler|insulin)\b/.test(clean)) return clean;
  return;
}

function hasCurrentHold(note: string): boolean {
  // Assess clauses in order so "was on hold, but restarted" does not remain held.
  let held = false;
  for (const clause of normalized(note).split(/[.;\n]|\bbut\b|\bhowever\b/)) {
    if (/\b(?:restart(?:ed|ing)?|resum(?:ed|ing)|back (?:on|to taking)|taking (?:it )?again|now taking|no longer (?:on hold|paused))\b/.test(clause) &&
        !/\b(?:will|might|may|can|could|until|before|not|don't|do not|plan to)\b/.test(clause)) {
      held = false;
      continue;
    }
    if (/\b(?:if|unless|when|previously|used to|last year)\b/.test(clause)) continue;
    if (/\b(?:not (?:on hold|paused|holding)|don't (?:hold|stop)|do not (?:hold|stop)|never (?:held|stopped))\b/.test(clause)) continue;
    if (/\b(?:on hold|hold(?:ing)?|held|withheld|withholding|paus(?:e|ed|ing)|temporarily (?:stopped|off|discontinued)|stop(?:ped|ping)? (?:it |this |taking (?:it )?)?(?:for now|until|temporarily)|off (?:it )?for now|not taking (?:it )?(?:for now|until))\b/.test(clause)) held = true;
  }
  return held;
}
function stopReason(note: string): StopReason | undefined {
  const s = normalized(note);
  if (/\b(?:side effects?|adverse|allerg(?:y|ic)|reaction|(?:made me|caused|gave me) (?:a |me )?(?:cough|rash|nausea|dizz\w*|sick|vomit\w*|headaches?|swelling|bleed\w*|cramps?|pain|feel)|because of (?:a )?(?:rash|cough|nausea)|upset (?:my )?stomach|stomach upset|diarrh(?:ea|oea)|angioedema|hives)\b/.test(s)) return "adverse_reaction";
  if (/\b(?:not (?:helping|working)|did(?:n't| not) (?:help|work)|ineffective|no (?:benefit|effect)|wasn't (?:helping|working))\b/.test(s)) return "ineffective";
  if (/\b(?:switch(?:ed)?|replac(?:ed|ement)|changed to|instead)\b/.test(s)) return "therapy_changed";
  if (/\b(?:course (?:complete|completed|finished)|finished (?:the |my )?(?:course|antibiotics)|completed (?:the |my )?course|treatment complete)\b/.test(s)) return "course_complete";
  if (/\b(?:didn't want|do not want|don't want|chose|my choice|declined|refused|decided (?:to stop|not to)|asked to stop)\b/.test(s)) return "patient_choice";
  if (/\b(?:because|due to|cost|expensive|afford|told me to stop|doctor (?:said|stopped)|no longer need|ran out)\b/.test(s)) return "other";
  return;
}

function frequency(sig: string): Frequency | undefined {
  const s = normalized(sig).replace(/\b(?:[abpqt]\.(?:[a-z]\.){1,2})/g, a => a.replace(/\./g, ""));
  if (/\b(?:prn|as needed|when needed|if needed|as required)\b/.test(s)) return "PRN";
  if (/\b(?:every other|alternate|alternating|most days|every \d+ days|four times|4 times|qid|q6h|q4h|every [46] hours|(?:twice|three times|[2-9] times) (?:a |per |each )?week(?:ly)?)\b/.test(s)) return "other";
  if (/\b(?:qw|weekly|once (?:a |per |each )?week|every week|every (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/.test(s)) return "QW";
  if (/\b(?:tid|three times|3 times|3x|q8h|every (?:8|eight) hours)\b/.test(s) ||
      /\b(?:breakfast|morning)\b.*\b(?:lunch|noon|afternoon)\b.*\b(?:dinner|supper|evening|night|bedtime)\b/.test(s)) return "TID";
  if (/\b(?:bid|twice|two times|2 times|2x|q12h|every (?:12|twelve) hours)\b/.test(s) ||
      /\b(?:breakfast|morning|am)\b.*\b(?:dinner|supper|evening|night|bedtime|pm)\b/.test(s)) return "BID";
  if (/\b(?:qhs|bedtime|nightly|at night|every night)\b/.test(s)) return "QHS";
  if (/\b(?:qd|daily|once a day|once per day|each day|every day|morning|breakfast|evening|supper|dinner|q24h|every 24 hours)\b/.test(s)) return "QD";
  if (/\b(?:every|times|days|weekly|weekends|schedule|monthly)\b/.test(s)) return "other";
  return;
}

const NUMBER = "(?:\\d+(?:\\.\\d+)?(?:\\s*\\/\\s*\\d+)?|\\.\\d+)";
const AMOUNT_UNIT = "(?:milligrams?|micrograms?|millilit(?:er|re)s?|mcg|mg|ug|μg|µg|ml|units?|unt|iu|\\[iu\\])";
function numberWords(s: string): string {
  const words: Record<string, string> = { half: "0.5", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10" };
  return normalized(s).replace(/(\d)½/g, "$1.5").replace(/½/g, "0.5").replace(/¼/g, "0.25")
    .replace(/\b(?:one and a half|one and one half)\b/g, "1.5")
    .replace(/\b(?:half|one|two|three|four|five|six|seven|eight|nine|ten)\b/g, w => words[w]);
}
function numeric(s: string): number | undefined {
  const parts = s.split("/").map(v => Number(v.trim()));
  const n = parts.length === 2 ? parts[0] / parts[1] : parts[0];
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
function amountUnit(s: string): { unit: string; code: string } {
  if (/^(?:mcg|ug|μg|µg|microgram)/.test(s)) return { unit: "mcg", code: "ug" };
  if (/^(?:mg|milligram)/.test(s)) return { unit: "mg", code: "mg" };
  if (/^(?:ml|millilit)/.test(s)) return { unit: "mL", code: "mL" };
  return { unit: "units", code: "[iU]" };
}
function quantity(value: number, unit: string, code: string): Quantity | undefined {
  // Remove floating arithmetic noise without changing clinically meaningful precision.
  if (!Number.isFinite(value) || value <= 0) return;
  return { value: Number(value.toPrecision(12)), unit, system: UCUM, code };
}
function tabletStrength(value: string): Quantity | undefined {
  const s = normalized(value);
  // A concentration (including mg/mL or a percent) is not strength per tablet.
  if (/%|\b(?:ml|lit(?:er|re)|patch|cream|ointment|gel|spray|solution|pen|injection)\b|\/\s*(?:\d*\.?\d*\s*)?(?:ml|l)\b/.test(s)) return;
  const matches = Array.from(s.matchAll(new RegExp(`(${NUMBER})\\s*(mg|mcg|ug|μg|µg|micrograms?|milligrams?|g)\\b`, "g")));
  if (matches.length !== 1) return;
  const n = numeric(matches[0][1]);
  if (n === undefined) return;
  if (matches[0][2] === "g") return quantity(n * 1000, "mg", "mg");
  const unit = amountUnit(matches[0][2]);
  return quantity(n, unit.unit, unit.code);
}
function dose(sig: string, strength: string | undefined, product: string, name: string): Quantity | undefined {
  const s = numberWords(sig);
  if (!s || /\b(?:sliding scale|sliding-scale|taper|titrat\w*|vary|varies|variable|alternat\w*|up to|depending|as directed)\b/.test(s) ||
      new RegExp(`${NUMBER}\\s*(?:or|to|[-–—])\\s*${NUMBER}`).test(s)) return;
  // Unsupported administrations must not accidentally become tablets.
  if (/\b(?:puffs?|sprays?|drops?|patch(?:es)?|apply|rub|inhale)\b/.test(s)) return;
  const counts = Array.from(s.matchAll(new RegExp(`(${NUMBER})\\s*(?:tablets?|tabs?|capsules?|caps?)\\b`, "g")));
  let count: number | undefined;
  if (counts.length) {
    const values = counts.map(m => numeric(m[1]));
    if (values.some(v => v === undefined || v !== values[0])) return;
    count = values[0];
  }
  // "Take 2", "2 morning and supper", and fractional tablet counts.
  const bare = new RegExp(`^(?:(?:i )?(?:take|taking)\\s+)?(${NUMBER})(?:\\s+|$)(?!times?\\b|x\\b|${AMOUNT_UNIT}\\b)`).exec(s);
  if (count === undefined && bare) count = numeric(bare[1]);
  const amounts = Array.from(s.matchAll(new RegExp(`(${NUMBER})\\s*(${AMOUNT_UNIT})(?=$|[^a-z])`, "g")));
  const dosingNumbers = Array.from(s.matchAll(new RegExp(`(${NUMBER})\\s*(?:in the |at |each |every )?(?:morning|evening|night|bedtime|breakfast|supper|dinner|am|pm)\\b`, "g")));
  if (amounts.length) {
    const first = amounts[0];
    const n = numeric(first[1]);
    const u = amountUnit(first[2]);
    if (n === undefined || amounts.some(m => numeric(m[1]) !== n || amountUnit(m[2]).code !== u.code)) return;
    if (/\/[\s\d]*(?:ml|l)\b|\bper (?:ml|milliliter|millilitre)\b/.test(s)) return;
    // "2 500 mg tablets" describes tablet strength, not a 500 mg administration.
    const withStrength = new RegExp(`(?:^|\\btake\\s+)(${NUMBER})\\s+(?:of\\s+)?(?:the\\s+)?${NUMBER}\\s*(?:mg|mcg|ug)\\s*(?:tablets?|tabs?|capsules?|caps?)\\b`).exec(s);
    if (withStrength) {
      const tablets = numeric(withStrength[1]);
      return tablets === undefined ? undefined : quantity(tablets * n, u.unit, u.code);
    }
    if (counts.length && /\b(?:each|per tablet|per capsule)\b/.test(s) &&
        (u.code === "mg" || u.code === "ug")) {
      return count === undefined ? undefined : quantity(count * n, u.unit, u.code);
    }
    // A later dose may omit the repeated unit ("10 units AM and 20 PM").
    if (dosingNumbers.some(m => numeric(m[1]) !== n)) return;
    return quantity(n, u.unit, u.code);
  }
  if (dosingNumbers.length) {
    const values = dosingNumbers.map(m => numeric(m[1]));
    if (values.some(v => v === undefined || v !== values[0])) return;
    if (count !== undefined && values[0] !== count) return;
    count = values[0];
  }
  const nonSolid = /\b(?:insulin|injection|injectable|pen|inhaler|solution|suspension|liquid|cream|ointment|gel|patch|spray|drops)\b|\bunits?\s*\/|%/;
  if (count === undefined) {
    if (nonSolid.test(normalized([strength ?? "", product, name, s].join(" ")))) return;
    if (!frequency(sig) && !/\b(?:tablet|capsule|take)\b/.test(s)) return;
    count = 1;
  } else if (!counts.length && nonSolid.test(normalized([strength ?? "", product, name].join(" ")))) return;
  // An unreadable explicit strength does not license replacing it with the
  // drug-search product strength. The patient's own entry is authoritative.
  const perTablet = tabletStrength(strength ?? product) ?? (strength === undefined ? tabletStrength(name) : undefined);
  return perTablet ? quantity(perTablet.value * count, perTablet.unit, perTablet.code)
    : quantity(count, "tablet", "{tbl}");
}

interface Candidate { entry: Obj; entryId: string; item: Item; ingredient?: string; name: string; line: string; event: string; }
function currentStatus(entry: Obj): MedicationRequest["status"] {
  if (hasCurrentHold([string(entry.how_i_take_it) ?? "", string(entry.note) ?? ""].join("; "))) return "on-hold";
  return entry.status === "taking" ? "active" : entry.status === "stopped" ? "stopped" : "unknown";
}
function ownEvent(entry: Obj): string {
  const status = currentStatus(entry);
  if (status === "stopped") return partialDate(entry.stopped) ?? partialDate(entry.started) ?? "";
  if (status === "on-hold") {
    const note = string(entry.note) ?? "";
    const date = /\b(?:since|on|from)\s+(\d{4}(?:-\d{2}(?:-\d{2})?)?)\b/i.exec(note)?.[1];
    return partialDate(date) ?? partialDate(entry.stopped) ?? partialDate(entry.started) ?? "";
  }
  return partialDate(entry.started) ?? "";
}
function candidateTie(c: Candidate): string {
  return key(c.line, c.entryId, c.name, string(c.entry.status) ?? "", string(c.entry.note) ?? "",
    string(c.entry.how_i_take_it) ?? "", string(c.entry.strength_text) ?? "");
}
function compareCandidates(a: Candidate, b: Candidate): number {
  return compare(a.event, b.event) || compareItems(a.item, b.item) || compare(candidateTie(a), candidateTie(b));
}
function hash(s: string): string {
  let n = 2166136261;
  for (let i = 0; i < s.length; i++) n = Math.imul(n ^ s.charCodeAt(i), 16777619);
  return (n >>> 0).toString(36);
}
function request(c: Candidate, id: string): MedicationRequest {
  const e = c.entry, search = object(e.picked_from_search);
  const code = string(search?.rxnorm), display = string(search?.display);
  const med: MedicationRequest["medicationCodeableConcept"] = { text: c.name };
  if (code) {
    // Never derive an ingredient CUI from a product CUI.
    const ingredientDisplay = display && c.ingredient === normalized(display) ? c.ingredient : undefined;
    med.coding = [{ system: RXNORM, code, ...(display ? { display: ingredientDisplay ?? display } : {}) }];
  } else if (c.ingredient) med.text = `${c.name} (${c.ingredient})`;
  const status = currentStatus(e);
  const row: MedicationRequest = {
    resourceType: "MedicationRequest", id, meta: { profile: [PROFILE] }, status,
    intent: "plan", reportedBoolean: true, medicationCodeableConcept: med,
    subject: { reference: `Patient/${c.item.patient}` },
  };
  const started = partialDate(e.started);
  if (started) row.authoredOn = started;
  const note = string(e.note) ?? (status === "on-hold" ? string(e.how_i_take_it) : undefined);
  if (note && (status === "stopped" || status === "on-hold")) {
    row.statusReason = { text: note };
    const reason = status === "stopped" ? stopReason(note) : undefined;
    if (reason) row.statusReason.coding = [{ system: "urn:folio:stop-reason", code: reason }];
  }
  const sig = string(e.how_i_take_it);
  if (sig) {
    const instruction: NonNullable<MedicationRequest["dosageInstruction"]>[number] = { text: sig };
    const f = frequency(sig), d = dose(sig, string(e.strength_text), display ?? "", c.name);
    if (f) instruction.timing = { code: { text: f } };
    if (d) instruction.doseAndRate = [{ doseQuantity: d }];
    row.dosageInstruction = [instruction];
  }
  return row;
}

export function transform(items: FolioItem[], asOf: string): UsCoreRows {
  const result: UsCoreRows = { medicationRequests: [], observations: [] };
  if (!Array.isArray(items) || !partialDate(asOf) || asOf.length !== 10) return result;
  const scoped: Item[] = [];
  for (const raw of items) {
    const item = readItem(raw, asOf);
    if (item) scoped.push(item);
  }
  const removed = new Set<string>();
  const snapshots = new Set<string>();
  for (const item of scoped) {
    // Even a subsequently retracted correction still suppresses its ancestors:
    // marking all in-scope edges makes supersession transitive without resurrection.
    for (const id of [...item.supersedes, ...item.retracts]) {
      if (id !== item.id) removed.add(key(item.issuer, id));
    }
    if (Object.values(item.payload).some(e => object(e)?.type === "my_med") ||
        /^\s*My Medicines\s*,\s*saved\b/i.test(item.narrative)) snapshots.add(itemKey(item));
  }
  // An empty replacement of a medicine list is an empty snapshot. A retraction
  // is not a replacement list. Narrative is used only to identify document kind.
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of scoped) {
      if (!snapshots.has(itemKey(item)) && Object.keys(item.payload).length === 0 &&
          item.supersedes.some(id => snapshots.has(key(item.issuer, id)))) {
        snapshots.add(itemKey(item)); changed = true;
      }
    }
  }
  const latest = new Map<string, Item>();
  for (const item of scoped) {
    if (removed.has(itemKey(item)) || !snapshots.has(itemKey(item))) continue;
    const group = key(item.issuer, item.patient), old = latest.get(group);
    if (!old || compareItems(item, old) > 0) latest.set(group, item);
  }
  const byIngredient = new Map<string, Candidate>();
  for (const item of latest.values()) {
    for (const [entryId, raw] of Object.entries(item.payload)) {
      const entry = object(raw);
      if (!entry || entry.type !== "my_med") continue;
      const name = string(entry.name);
      if (!name) continue;
      const search = object(entry.picked_from_search);
      const display = string(search?.display);
      const ingredient = (display ? ingredients(display, true) : undefined) ?? ingredients(name, false);
      const line = string(entry.homelog_med_id) ?? entryId;
      const c: Candidate = { entry, entryId, item, name, ingredient, line, event: ownEvent(entry) };
      const group = key(item.issuer, item.patient, ingredient ? `ingredient:${ingredient}` : `line:${line}`);
      const old = byIngredient.get(group);
      if (!old || compareCandidates(c, old) > 0) byIngredient.set(group, c);
    }
  }
  const candidates = [...byIngredient.values()].sort((a, b) =>
    compare(key(a.item.issuer, a.item.patient, a.ingredient ?? a.name, a.line, a.entryId),
      key(b.item.issuer, b.item.patient, b.ingredient ?? b.name, b.line, b.entryId)));
  const used = new Set<string>();
  for (const c of candidates) {
    const identity = key(c.item.issuer, c.item.patient, c.line);
    const stem = (c.line.replace(/[^A-Za-z0-9.-]/g, "-").slice(0, 38) || "line");
    const base = `hl-med-${stem}-${hash(identity)}`;
    let id = base, suffix = 1;
    // Guarantee uniqueness even when sanitized identifiers or hashes collide.
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    result.medicationRequests.push(request(c, id));
  }
  return result;
}
