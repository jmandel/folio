import type { FolioItem, ViewRows, MedicationRow, VitalRow, Sensitivity } from "../in/views/views";

const TZ = "America/Chicago";

function chicagoDate(iso: string): string | undefined {
  const t = Date.parse(iso);
  if (isNaN(t)) return undefined;
  try {
    const p = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(t));
    const g = (k: string) => p.find((x) => x.type === k)?.value ?? "";
    return `${g("year")}-${g("month")}-${g("day")}`;
  } catch {
    return undefined;
  }
}

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const cand = items.filter((i) => {
    if (!i || typeof i.id !== "string" || typeof i.recorded !== "string") return false;
    const d = chicagoDate(i.recorded);
    return d !== undefined && d <= asOf;
  });
  const retracted = new Set<string>();
  for (const i of cand) for (const r of i.retracts ?? []) retracted.add(r);
  const superseded = new Set<string>();
  for (const i of cand) {
    if (retracted.has(i.id)) continue;
    for (const s of i.supersedes ?? []) superseded.add(s);
  }
  return cand.filter((i) => !retracted.has(i.id) && !superseded.has(i.id));
}

function isNum(x: unknown): x is number {
  return typeof x === "number" && isFinite(x);
}

function minutes(local: string): number {
  const m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(local);
  if (!m) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) / 60000;
}

// ---------- vitals ----------

interface Home {
  row: VitalRow;
  device: boolean;
  kind: "bp" | "glu";
  key: string;
  t: number;
}

function vitals(items: FolioItem[]): VitalRow[] {
  const homes: Home[] = [];
  for (const it of items) {
    const p = it.payload ?? {};
    for (const id of Object.keys(p)) {
      const e = p[id];
      if (!e || typeof e !== "object") continue;
      if (e.type === "bp_reading" && typeof e.measured_at === "string" && isNum(e.systolic_mmhg) && isNum(e.diastolic_mmhg)) {
        const row: VitalRow = {
          setting: "home",
          local_time: e.measured_at.slice(0, 16),
          systolic_mmhg: e.systolic_mmhg,
          diastolic_mmhg: e.diastolic_mmhg,
          evidence: [{ item_id: it.id, entry_id: id }],
        };
        if (isNum(e.pulse_bpm)) row.pulse_bpm = e.pulse_bpm;
        homes.push({ row, device: e.entry_method === "cuff_sync", kind: "bp", key: `${e.systolic_mmhg}/${e.diastolic_mmhg}`, t: minutes(row.local_time) });
      } else if (e.type === "glucose_reading" && typeof e.measured_at === "string" && isNum(e.value)) {
        const mmol = e.unit === "mmol/L";
        const row: VitalRow = {
          setting: "home",
          local_time: e.measured_at.slice(0, 16),
          evidence: [{ item_id: it.id, entry_id: id }],
        };
        if (e.out_of_range === "HI" || e.out_of_range === "LO") {
          row.glucose_out_of_range = e.out_of_range;
          row.glucose_mg_dl = e.out_of_range === "HI" ? 600 : 20;
        } else {
          row.glucose_mg_dl = Math.round(mmol ? e.value * 18.016 : e.value);
        }
        homes.push({ row, device: e.entry_method === "meter_sync", kind: "glu", key: `${row.glucose_mg_dl}${row.glucose_out_of_range ?? ""}`, t: minutes(row.local_time) });
      }
    }
  }
  // drop typed readings duplicating a device reading
  const out: Home[] = [];
  for (const h of homes) {
    if (!h.device) {
      const dup = homes.find((o) => o !== h && o.device && o.kind === h.kind && o.key === h.key && Math.abs(o.t - h.t) <= 3);
      if (dup) {
        dup.row.evidence.push(...h.row.evidence);
        continue;
      }
    }
    out.push(h);
  }
  return out
    .sort((a, b) => (a.row.local_time < b.row.local_time ? -1 : a.row.local_time > b.row.local_time ? 1 : 0))
    .map((h) => h.row);
}

// ---------- medications ----------

const SALTS = new Set([
  "hydrochloride", "hcl", "sodium", "calcium", "potassium", "sulfate", "succinate", "tartrate", "maleate", "besylate",
  "mesylate", "phosphate", "acetate", "citrate", "bromide", "fumarate", "hydrobromide", "magnesium", "dihydrate",
  "monohydrate", "trihydrate", "anhydrous", "medoxomil", "nitrate", "oxalate", "hemihydrate", "disodium",
]);
const FORMS = new Set([
  "tablet", "tablets", "tab", "tabs", "capsule", "capsules", "cap", "caps", "oral", "pen", "inhaler", "injection",
  "solution", "pill", "pills", "er", "xr", "sr", "dr", "hfa", "cream", "ointment", "patch", "drops", "spray", "syrup", "suspension",
]);
const BRANDS: Record<string, string> = {
  synthroid: "levothyroxine", levoxyl: "levothyroxine", unithroid: "levothyroxine", euthyrox: "levothyroxine",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", norvasc: "amlodipine", zestril: "lisinopril",
  prinivil: "lisinopril", glucophage: "metformin", jardiance: "empagliflozin", farxiga: "dapagliflozin",
  januvia: "sitagliptin", ozempic: "semaglutide", wegovy: "semaglutide", victoza: "liraglutide", trulicity: "dulaglutide",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine", levemir: "insulin detemir",
  novolog: "insulin aspart", humalog: "insulin lispro", lasix: "furosemide", coumadin: "warfarin", eliquis: "apixaban",
  xarelto: "rivaroxaban", plavix: "clopidogrel", zoloft: "sertraline", lexapro: "escitalopram", prozac: "fluoxetine",
  seroquel: "quetiapine", abilify: "aripiprazole", tylenol: "acetaminophen", advil: "ibuprofen", motrin: "ibuprofen",
  aleve: "naproxen", nexium: "esomeprazole", prilosec: "omeprazole", zyrtec: "cetirizine", claritin: "loratadine",
  ventolin: "albuterol", proair: "albuterol", cozaar: "losartan", diovan: "valsartan", toprol: "metoprolol",
  lopressor: "metoprolol", tenormin: "atenolol", glucotrol: "glipizide", amaryl: "glimepiride", zetia: "ezetimibe",
  pepcid: "famotidine", suboxone: "buprenorphine", subutex: "buprenorphine", "water pill": "",
  aspirin: "aspirin", "baby aspirin": "aspirin",
};

function ingredientOf(name: string, display?: string): string | undefined {
  const src = display && display.trim() ? display : name;
  const words = src.toLowerCase().replace(/[(),\/]/g, " ").split(/\s+/).filter(Boolean);
  const kept: string[] = [];
  for (const w of words) {
    if (/^\d/.test(w)) break;
    if (SALTS.has(w) || FORMS.has(w) || w === "mg" || w === "mcg") continue;
    kept.push(w);
  }
  let ing = kept.join(" ");
  const first = kept[0] ?? "";
  if (BRANDS[ing] !== undefined) ing = BRANDS[ing];
  else if (BRANDS[first] !== undefined && !(display && display.trim())) ing = BRANDS[first];
  else if (BRANDS[first] !== undefined && kept.length === 1) ing = BRANDS[first];
  ing = ing.trim();
  return ing || undefined;
}

function sensitivityOf(ing: string | undefined): Sensitivity[] | undefined {
  if (!ing) return undefined;
  const s: Sensitivity[] = [];
  if (/quetiapine|sertraline|escitalopram|fluoxetine|citalopram|paroxetine|bupropion|venlafaxine|duloxetine|lithium|aripiprazole|olanzapine|risperidone|lamotrigine|clozapine|haloperidol|mirtazapine|trazodone|buspirone|lurasidone|ziprasidone|amitriptyline|nortriptyline|alprazolam|lorazepam|clonazepam|diazepam|valproate|divalproex|hydroxyzine/.test(ing)) s.push("mental-health");
  if (/buprenorphine|naltrexone|methadone|disulfiram|acamprosate|naloxone|varenicline|nicotine/.test(ing)) s.push("substance-use");
  if (/ethinyl|norethindrone|levonorgestrel|drospirenone|norgestimate|medroxyprogesterone|estradiol|sildenafil|tadalafil|misoprostol|mifepristone|etonogestrel/.test(ing)) s.push("sexual-reproductive-health");
  if (/tenofovir|emtricitabine|dolutegravir|bictegravir|efavirenz|abacavir|lamivudine|raltegravir|darunavir|rilpivirine|doxycycline.*pep|azithromycin|valacyclovir|acyclovir/.test(ing) && !/^(azithromycin|valacyclovir|acyclovir)$/.test(ing)) s.push("hiv-sti");
  return s.length ? s : undefined;
}

const NUMWORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5 };

function parseStrength(s?: string): { value: number; unit: "mg" | "mcg" | "units" | "mL" } | undefined {
  if (!s) return undefined;
  const m = /^\s*(\d+(?:\.\d+)?)\s*(mg|mcg|µg|μg|micrograms?|milligrams?|g|units?|u|iu)\b(?!\s*\/)/i.exec(s);
  if (!m) return undefined;
  let v = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  if (u === "mg" || u.startsWith("milligram")) return { value: v, unit: "mg" };
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u === "mcg" || u === "µg" || u === "μg" || u.startsWith("microgram")) return { value: v, unit: "mcg" };
  return { value: v, unit: "units" };
}

function parseDose(strength?: string, how?: string): MedicationRow["dose"] {
  const h = (how ?? "").toLowerCase();
  if (/\d\s*(-|–|to|or)\s*\d|\b(one|two|three)\s+(or|to)\s+(one|two|three)\b/.test(h)) return undefined;
  // explicit amount with unit in the directions
  const ex = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|μg|units?|iu|ml|cc)\b/.exec(h);
  if (ex) {
    const u = ex[2];
    const unit = u === "mg" ? "mg" : /^(mcg|µg|μg)$/.test(u) ? "mcg" : /^(ml|cc)$/.test(u) ? "mL" : "units";
    return { value: parseFloat(ex[1]), unit };
  }
  const st = parseStrength(strength);
  const cm = /\b(\d+(?:\.\d+)?|one|two|three|four|half)\s*(?:of\s+)?(tablets?|tabs?|pills?|capsules?|caps?)\b/.exec(h);
  let count: number | undefined;
  if (cm) count = NUMWORDS[cm[1]] ?? parseFloat(cm[1]);
  else if (/\btake\s+(\d+(?:\.\d+)?)\b/.test(h)) count = parseFloat(/\btake\s+(\d+(?:\.\d+)?)\b/.exec(h)![1]);
  else if (/\d/.test(h) && !/\b\d+\s*(x|times)\b/.test(h) && /^\s*\d+(?:\.\d+)?\s/.test(h) && !/\b(am|pm|days?|hours?|weeks?)\b/.test(h)) count = parseFloat(h);
  if (count === undefined) {
    if (/\d/.test(h.replace(/\b\d+\s*(x|times)\b/g, "")) ) return undefined;
    count = 1;
  }
  if (st) {
    if (/\/\s*(ml|puff|actuation)/i.test(strength ?? "")) return undefined;
    return { value: Math.round(st.value * count * 1000) / 1000, unit: st.unit };
  }
  if (strength && /\d/.test(strength)) return undefined;
  if (cm) return { value: count, unit: "tablet" };
  return undefined;
}

function frequencyOf(how?: string): MedicationRow["frequency"] | undefined {
  const h = (how ?? "").toLowerCase();
  if (!h) return undefined;
  if (/as needed|\bprn\b|when needed|if needed|when i need|only when|when (my|i)\b/.test(h)) return "PRN";
  if (/every other|alternate|four times|4 times|\b4x\b|every (4|6) hours|monthly|every month|taper/.test(h)) return "other";
  if (/week/.test(h) && !/twice|2 times/.test(h)) return "QW";
  if (/three times|3 times|\btid\b|every 8 hours|\b3x\b/.test(h)) return "TID";
  if (/twice|2 times|\bbid\b|every 12 hours|\b2x\b/.test(h)) return "BID";
  const times = new Set<string>();
  if (/morning|breakfast|\bam\b/.test(h)) times.add("m");
  if (/noon|lunch|midday|afternoon/.test(h)) times.add("n");
  if (/supper|dinner|evening/.test(h)) times.add("e");
  if (/bedtime|at night|nightly|\bnight\b|before bed/.test(h)) times.add("b");
  if (times.size >= 3) return "TID";
  if (times.size === 2) return "BID";
  if (times.has("b")) return "QHS";
  if (times.size === 1 || /daily|once|every day|each day|\bqd\b/.test(h)) return "QD";
  return undefined;
}

function stopReasonOf(note?: string): MedicationRow["stop_reason"] | undefined {
  const n = (note ?? "").toLowerCase();
  if (!n) return undefined;
  if (/side effect|reaction|rash|allerg|nausea|cough|dizz|made me (sick|feel)|upset my stomach|swelling|hives/.test(n)) return "adverse_reaction";
  if (/didn'?t work|not working|no effect|ineffective|wasn'?t helping|did not work/.test(n)) return "ineffective";
  if (/replaced|switched|changed to|instead|new (dose|medicine|prescription)|swapped/.test(n)) return "therapy_changed";
  if (/finished|course|completed|ran out of the course|done with/.test(n)) return "course_complete";
  if (/decided|chose|choice|didn'?t like|on my own|don'?t want|did not want/.test(n)) return "patient_choice";
  return undefined;
}

function partial(s?: string): string | undefined {
  if (typeof s !== "string") return undefined;
  return /^\d{4}(-\d\d(-\d\d)?)?$/.test(s) ? s : undefined;
}

function medications(items: FolioItem[]): MedicationRow[] {
  const lists = items.filter((i) => Object.values(i.payload ?? {}).some((e: any) => e && e.type === "my_med"));
  if (!lists.length) return [];
  lists.sort((a, b) => {
    const ta = Date.parse(a.recorded), tb = Date.parse(b.recorded);
    return ta !== tb ? ta - tb : a.id < b.id ? -1 : 1;
  });
  const latest = lists[lists.length - 1];
  const byIng = new Map<string, { row: MedicationRow; since: string }>();
  const rows: { row: MedicationRow; since: string }[] = [];
  for (const [id, e] of Object.entries(latest.payload ?? {}) as [string, any][]) {
    if (!e || e.type !== "my_med" || typeof e.name !== "string") continue;
    const display: string | undefined = e.picked_from_search?.display;
    const ing = ingredientOf(e.name, display);
    const note: string | undefined = typeof e.note === "string" ? e.note : undefined;
    const how: string | undefined = typeof e.how_i_take_it === "string" ? e.how_i_take_it : undefined;
    const pausedText = `${note ?? ""} ${how ?? ""}`.toLowerCase();
    const paused = /paus|on hold|\bhold(ing)?\b|temporar|resume|restart|for now|for the time being|until|stopped for now|break from/.test(pausedText);
    let status: MedicationRow["status"] = e.status === "stopped" ? "stopped" : "active";
    if (paused && (status === "active" || e.status === "stopped")) status = "held";
    const row: MedicationRow = { drug_name: e.name, status, patient_reported: true, evidence: [{ item_id: latest.id, entry_id: id }] };
    if (ing) row.ingredient = ing;
    if (e.picked_from_search?.rxnorm && display && !/\d|\b(tablet|capsule|pen|inhaler|injection|solution)\b/i.test(display)) {
      row.rxnorm_ingredient = String(e.picked_from_search.rxnorm);
    }
    const since = status === "stopped" ? partial(e.stopped) : status === "active" ? partial(e.started) : undefined;
    if (since) row.status_since = since;
    const dose = parseDose(e.strength_text, how);
    if (dose) row.dose = dose;
    const f = frequencyOf(how);
    if (f) row.frequency = f;
    if (status === "stopped") {
      const r = stopReasonOf(note);
      if (r) row.stop_reason = r;
    }
    if ((status === "stopped" || status === "held") && note) row.status_reason_text = note;
    if (e.kind === "over_the_counter") row.otc = true;
    const sens = sensitivityOf(ing);
    if (sens) row.sensitivity = sens;
    const rank = (status === "active" ? "2" : status === "held" ? "1" : "0") + (partial(e.started) ?? "") ;
    if (ing) {
      const prev = byIng.get(ing);
      if (!prev || rank >= prev.since) byIng.set(ing, { row, since: rank });
    } else rows.push({ row, since: rank });
  }
  return [...byIng.values(), ...rows].map((x) => x.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  let live: FolioItem[] = [];
  try {
    live = countingItems(Array.isArray(items) ? items : [], asOf);
  } catch {
    live = [];
  }
  let v: VitalRow[] = [];
  let m: MedicationRow[] = [];
  try { v = vitals(live); } catch { v = []; }
  try { m = medications(live); } catch { m = []; }
  return { medications: m, problems: [], allergies: [], labs: [], vitals: v };
}
