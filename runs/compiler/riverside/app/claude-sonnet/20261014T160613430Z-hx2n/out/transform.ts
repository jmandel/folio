import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Analyte, Evidence, Sensitivity, PartialDate,
} from "../in/views/views";

// ---------- time helpers ----------

const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", hourCycle: "h23",
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
});

interface Local { date: string; time: string; offset: string }

function hasZone(s: string): boolean {
  return /(Z|[+-]\d{2}:?\d{2})$/i.test(s) && /T/.test(s);
}

function toLocal(s: string | undefined): Local | undefined {
  if (!s) return undefined;
  if (!hasZone(s)) {
    const m = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2})(?::\d{2})?)?/.exec(s);
    if (!m) return undefined;
    const time = m[2] ?? "00:00";
    return { date: m[1], time, offset: offsetFor(m[1], time) };
  }
  const ms = Date.parse(s);
  if (isNaN(ms)) return undefined;
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  const date = `${p.year}-${p.month}-${p.day}`;
  const time = `${p.hour}:${p.minute}`;
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  const off = Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  const offset = `${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
  return { date, time, offset };
}

function offsetFor(date: string, time: string): string {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  for (const off of [5, 6]) {
    const ms = Date.UTC(y, mo - 1, d, h + off, mi);
    const l = toLocal(new Date(ms).toISOString());
    if (l && l.date === date && l.time === time) return `-0${off}:00`;
  }
  return "-06:00";
}

function localDate(s: string | undefined): string | undefined {
  return toLocal(s)?.date;
}

// ---------- item selection ----------

interface Doc {
  item: FolioItem;
  enc?: any;
  kind: string;
  sortKey: string;
  entries: [string, any][];
}

function sortKeyOf(item: FolioItem): string {
  const ms = Date.parse(hasZone(item.effective) ? item.effective : (item.effective.length <= 10 ? item.effective + "T00:00:00Z" : item.effective + "Z"));
  const r = Date.parse(item.recorded);
  return String(isNaN(r) ? 0 : r).padStart(16, "0") + "|" + String(isNaN(ms) ? 0 : ms).padStart(16, "0") + "|" + item.id;
}

function countingItems(items: FolioItem[], asOf: string): FolioItem[] {
  const counted = items.filter((i) => {
    const d = localDate(i.recorded);
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const i of counted) {
    for (const id of i.supersedes ?? []) dead.add(id);
    for (const id of i.retracts ?? []) dead.add(id);
  }
  return counted.filter((i) => !dead.has(i.id));
}

function toDoc(item: FolioItem): Doc {
  const entries: [string, any][] = [];
  let enc: any;
  const payload = item.payload && typeof item.payload === "object" ? item.payload : {};
  for (const [k, v] of Object.entries(payload)) {
    if (!v || typeof v !== "object") continue;
    entries.push([k, v]);
    if ((v as any).type === "encounter" && !enc) enc = v;
  }
  return { item, enc, kind: enc?.document_kind ?? "", sortKey: sortKeyOf(item), entries };
}

const cmp = (a: Doc, b: Doc) => (a.sortKey < b.sortKey ? -1 : a.sortKey > b.sortKey ? 1 : 0);

// ---------- text helpers ----------

const num = (x: any): number | undefined => (typeof x === "number" && isFinite(x) ? x : undefined);
const str = (x: any): string | undefined => (typeof x === "string" && x.trim() ? x : undefined);

function lc(s: string): string {
  return s.toLowerCase();
}

const SALTS = /\b(hydrochloride|hcl|sodium|potassium|calcium|sulfate|tartrate|succinate|maleate|mesylate|besylate|phosphate|acetate|citrate|bromide|trihydrate|monohydrate|dihydrate|hydrobromide|fumarate|medoxomil|axetil|hyclate)\b/g;

function ingredientOf(drugName: string): string {
  let s = lc(drugName).replace(/\(.*?\)/g, " ");
  const m = /^(.*?)(?=\s\d|\s*\d+(\.\d+)?\s*(mg|mcg|g|units?|iu|ml|%)\b|$)/.exec(s);
  s = (m ? m[1] : s);
  s = s.replace(/\b(tablets?|capsules?|inhaler|injection|solution|oral|er|xr|sr|dr|extended[- ]release|delayed[- ]release|pen|patch|cream|ointment|suspension)\b/g, " ");
  s = s.replace(SALTS, " ").replace(/\s+/g, " ").trim();
  return s || lc(drugName).trim();
}

const UNIT_MAP: Record<string, "mg" | "mcg" | "units" | "mL" | "tablet"> = {
  mg: "mg", milligram: "mg", milligrams: "mg",
  mcg: "mcg", "µg": "mcg", ug: "mcg", "μg": "mcg", microgram: "mcg", micrograms: "mcg",
  u: "units", iu: "units", unit: "units", units: "units",
  ml: "mL", cc: "mL",
  tab: "tablet", tabs: "tablet", tablet: "tablet", tablets: "tablet",
};

function parseDose(doseText: string, drugName: string, sig: string): MedicationRow["dose"] {
  if (/\d\s*(-|–|to)\s*\d/.test(doseText)) return undefined;
  const m = /(\d+(?:\.\d+)?)\s*([a-zA-Zµμ]+)/.exec(doseText);
  if (!m) return undefined;
  const unit = UNIT_MAP[m[2].toLowerCase()];
  if (!unit) return undefined;
  let value = parseFloat(m[1]);
  if (unit === "tablet") {
    const sm = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|μg|units?|iu)\b/i.exec(drugName);
    if (sm) {
      const su = UNIT_MAP[sm[2].toLowerCase()];
      if (su) return { value: Math.round(value * parseFloat(sm[1]) * 1000) / 1000, unit: su };
    }
    return { value, unit: "tablet" };
  }
  if (!isFinite(value)) return undefined;
  void sig;
  return { value, unit };
}

function parseFreq(sig: string): MedicationRow["frequency"] {
  const s = lc(sig);
  if (/\bprn\b|as needed/.test(s)) return "PRN";
  if (/\b(qhs|at bedtime|bedtime|hs)\b/.test(s)) return "QHS";
  if (/\bq?\s*(week|wk)ly\b|\bweekly\b|\bonce a week\b|\bqw\b|\bevery week\b/.test(s)) return "QW";
  if (/\b(bid|twice (a |per )?(day|daily)|2 times (a |per )?day|every 12 h)/.test(s)) return "BID";
  if (/\b(tid|three times|3 times|every 8 h)/.test(s)) return "TID";
  if (/\b(qid|four times|4 times|every 6 h|every 4 h|every other|monthly|taper)/.test(s)) return "other";
  if (/\b(qd|daily|once a day|once daily|every day|every morning|each morning|in the morning|every evening|in the evening|nightly|at night|qam)\b/.test(s)) return "QD";
  return undefined;
}

const SENS_DRUGS: [RegExp, Sensitivity][] = [
  [/quetiapine|olanzapine|risperidone|aripiprazole|lithium|sertraline|fluoxetine|escitalopram|citalopram|paroxetine|venlafaxine|bupropion|mirtazapine|lamotrigine|haloperidol|clozapine|ziprasidone|lurasidone|trazodone|duloxetine|buspirone|alprazolam|lorazepam|clonazepam|diazepam|amitriptyline|nortriptyline|valproate|divalproex/, "mental-health"],
  [/buprenorphine|naloxone|naltrexone|methadone|disulfiram|acamprosate|varenicline/, "substance-use"],
  [/ethinyl|estradiol|norethindrone|levonorgestrel|drospirenone|medroxyprogesterone|etonogestrel|norgestimate|desogestrel|misoprostol|mifepristone|sildenafil|tadalafil/, "sexual-reproductive-health"],
  [/tenofovir|emtricitabine|dolutegravir|bictegravir|efavirenz|darunavir|raltegravir|rilpivirine|abacavir|lamivudine|zidovudine|ritonavir|azithromycin.*chlamydia|doxycycline.*sti/, "hiv-sti"],
];

function sensOfText(s: string): Sensitivity[] | undefined {
  const out: Sensitivity[] = [];
  const t = lc(s);
  for (const [re, c] of SENS_DRUGS) if (re.test(t) && !out.includes(c)) out.push(c);
  if (/bipolar|schizo|depress|anxiety|psychosis|ptsd|adhd|mental/.test(t) && !out.includes("mental-health")) out.push("mental-health");
  if (/alcohol|opioid use|substance|cocaine|opioid dependence|use disorder|withdrawal/.test(t) && !out.includes("substance-use")) out.push("substance-use");
  if (/pregnan|contracept|infertil|gestation|prenatal/.test(t) && !out.includes("sexual-reproductive-health")) out.push("sexual-reproductive-health");
  if (/\bhiv\b|chlamydia|gonorrh|syphilis|\bsti\b|herpes simplex|hepatitis c/.test(t) && !out.includes("hiv-sti")) out.push("hiv-sti");
  if (/brca|genetic|hereditary|lynch|cystic fibrosis|huntington/.test(t) && !out.includes("genetic")) out.push("genetic");
  return out.length ? out : undefined;
}

// ---------- medications ----------

function buildMedications(docs: Doc[]): MedicationRow[] {
  const withMeds = docs.filter((d) => d.entries.some(([, e]) => e.type === "home_med"));
  if (!withMeds.length) return [];
  const encOf = (d: Doc) => d.enc?.encounter_id ?? "";
  const latest = withMeds.slice().sort(cmp)[withMeds.length - 1];
  const sameEnc = withMeds.filter((d) => encOf(d) === encOf(latest)).sort(cmp);
  const dcs = sameEnc.filter((d) => d.kind === "discharge_summary");
  const snap = dcs.length ? dcs[dcs.length - 1] : sameEnc[sameEnc.length - 1];
  const prior = sameEnc.filter((d) => cmp(d, snap) < 0);

  const keyOf = (e: any) => (str(e.rxnorm_ingredient) ?? ingredientOf(str(e.drug_name) ?? "")) + "";
  const mapStatus = (s: string): MedicationRow["status"] =>
    s === "held" ? "held" : s === "stopped" ? "stopped" : s === "not_reconciled" ? "unknown" : "active";

  const byKey = new Map<string, MedicationRow>();
  for (const [id, e] of snap.entries) {
    if (e.type !== "home_med") continue;
    const drugName = str(e.drug_name);
    if (!drugName) continue;
    const status = mapStatus(e.status);
    const ingredient = ingredientOf(drugName);
    const key = keyOf(e);
    const evidence: Evidence = [{ item_id: snap.item.id, entry_id: id }];

    // earlier documents of the stay that show the same drug, for how long the state has held
    const history: { doc: Doc; entry: any; eid: string }[] = [];
    for (const d of prior) {
      for (const [eid, pe] of d.entries) {
        if (pe.type === "home_med" && keyOf(pe) === key) history.push({ doc: d, entry: pe, eid });
      }
    }
    let sinceDoc = snap;
    let sinceDate = localDate(snap.kind === "discharge_summary" ? (snap.enc?.discharged ?? snap.item.effective_end ?? snap.item.effective) : snap.item.effective);
    if (status === "held" || status === "stopped") {
      for (let i = history.length - 1; i >= 0; i--) {
        if (mapStatus(history[i].entry.status) !== status) break;
        sinceDoc = history[i].doc;
        sinceDate = localDate(sinceDoc.item.effective);
        evidence.push({ item_id: sinceDoc.item.id, entry_id: history[i].eid });
      }
    }
    let status_since: PartialDate | undefined;
    if (status === "held" || status === "stopped") status_since = sinceDate;
    else if (status === "active") {
      if (e.status === "new" || e.status === "changed") status_since = localDate(snap.item.effective);
      else if (history.length && history[history.length - 1].entry.status === "held") status_since = sinceDate;
    }

    const row: MedicationRow = {
      ingredient,
      drug_name: drugName,
      status,
      patient_reported: false,
    } as MedicationRow;
    const rx = str(e.rxnorm_ingredient);
    if (rx) row.rxnorm_ingredient = rx;
    if (status_since) row.status_since = status_since;
    const dose = parseDose(str(e.dose_text) ?? "", drugName, str(e.sig) ?? "");
    if (dose) row.dose = dose;
    const freq = parseFreq(str(e.sig) ?? "");
    if (freq) row.frequency = freq;
    const instr = str(e.instructions);
    if (instr && (status === "held" || status === "stopped")) row.status_reason_text = instr;
    if (status === "stopped" && instr) {
      const t = lc(instr);
      if (/adverse|reaction|side effect|rash|cough|allerg|intoleran|angioedema/.test(t)) row.stop_reason = "adverse_reaction";
      else if (/ineffective|not effective|did not work|no benefit/.test(t)) row.stop_reason = "ineffective";
      else if (/replaced|switch|changed to|instead of|substitut/.test(t)) row.stop_reason = "therapy_changed";
      else if (/course (is )?complete|completed/.test(t)) row.stop_reason = "course_complete";
      else if (/patient (choice|request|decline|prefer)/.test(t)) row.stop_reason = "patient_choice";
    }
    if (/\botc\b|over[- ]the[- ]counter/i.test(drugName + " " + (str(e.sig) ?? ""))) row.otc = true;
    const sens = sensOfText(drugName);
    if (sens) row.sensitivity = sens;
    row.evidence = evidence;
    byKey.set(key, row);
  }
  return [...byKey.values()];
}

// ---------- problems and drug-attributed allergies ----------

const CLASS_MAP: [RegExp, string[], string][] = [
  [/sglt-?2|gliflozin/, ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin"], "SGLT2 inhibitors"],
  [/ace inhibitor|ace-inhibitor|angiotensin[- ]converting/, ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "perindopril", "fosinopril"], "ACE inhibitors"],
  [/penicillin/, ["amoxicillin", "ampicillin", "penicillin", "piperacillin", "dicloxacillin", "nafcillin"], "penicillins"],
  [/cephalosporin/, ["cephalexin", "cefazolin", "ceftriaxone", "cefuroxime", "cefdinir", "cefepime", "cefadroxil"], "cephalosporins"],
  [/sulfonamide|sulfa\b/, ["sulfamethoxazole", "sulfasalazine"], "sulfonamide antibiotics"],
  [/statin/, ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin", "pitavastatin"], "statins"],
  [/fluoroquinolone|quinolone/, ["ciprofloxacin", "levofloxacin", "moxifloxacin", "ofloxacin"], "fluoroquinolones"],
  [/nsaid|anti-?inflammatory/, ["ibuprofen", "naproxen", "diclofenac", "meloxicam", "ketorolac", "celecoxib"], "NSAIDs"],
  [/thiazide/, ["hydrochlorothiazide", "chlorthalidone", "indapamide"], "thiazide diuretics"],
  [/macrolide/, ["azithromycin", "erythromycin", "clarithromycin"], "macrolides"],
  [/opioid/, ["morphine", "oxycodone", "hydrocodone", "codeine", "tramadol", "hydromorphone"], "opioids"],
];

interface Attribution { thing: string; condition?: string }

function attributionOf(label: string): Attribution | undefined {
  let m = /^(.*?)\s*[,(-]?\s*\b(?:due to|secondary to|caused by|induced by|related to|associated with|from|adverse (?:effect|reaction) of)\s+(.+?)\)?$/i.exec(label);
  if (m) return { condition: m[1].trim().replace(/[,\s]+$/, ""), thing: m[2].trim() };
  m = /^(.*),\s*(.+?)[- ](?:associated|induced|related|caused)$/i.exec(label);
  if (m) return { condition: m[1].trim().replace(/[,\s]+$/, ""), thing: m[2].trim() };
  return undefined;
}

interface DrugRef { substance: string; rxnorm?: string; evidenceId?: string }

function resolveDrug(thing: string, homeMeds: { eid: string; e: any }[]): DrugRef | undefined {
  const t = lc(thing);
  for (const { e } of homeMeds) {
    const ing = ingredientOf(str(e.drug_name) ?? "");
    if (ing && t.includes(ing)) return { substance: ing, rxnorm: str(e.rxnorm_ingredient) };
  }
  for (const [re, ings, cls] of CLASS_MAP) {
    if (!re.test(t)) continue;
    const cands = homeMeds.filter(({ e }) => ings.includes(ingredientOf(str(e.drug_name) ?? "")));
    const uniq = new Set(cands.map(({ e }) => ingredientOf(str(e.drug_name) ?? "")));
    if (uniq.size === 1) {
      const e = cands[0].e;
      return { substance: ingredientOf(str(e.drug_name) ?? ""), rxnorm: str(e.rxnorm_ingredient) };
    }
    const direct = ings.find((i) => t.includes(i));
    if (direct) return { substance: direct };
    return { substance: cls };
  }
  const direct = /\b(?:[a-z]+(?:cillin|mycin|floxacin|pril|sartan|statin|azole|gliflozin|formin|olol|dipine|oxacin|cycline|prazole|tidine|navir|vir|mab))\b/.exec(t);
  if (direct) return { substance: direct[0] };
  return undefined;
}

function ckdStageOf(text: string, icd?: string): ProblemRow["ckd_stage"] {
  const t = text;
  let m = /\b(?:stage|g)\s*([1-5])\s*([ab])?\b/i.exec(t);
  if (m && /kidney|ckd|renal|\bg[1-5]/i.test(t)) {
    const n = m[1];
    if (n === "3") return m[2] ? (("G3" + m[2].toLowerCase()) as any) : undefined;
    return ("G" + n) as any;
  }
  m = /\bG([1-5])([ab])?\b/.exec(t);
  if (m) return m[1] === "3" ? (m[2] ? (("G3" + m[2]) as any) : undefined) : (("G" + m[1]) as any);
  switch (icd) {
    case "N18.1": return "G1";
    case "N18.2": return "G2";
    case "N18.31": return "G3a";
    case "N18.32": return "G3b";
    case "N18.4": return "G4";
    case "N18.5": return "G5";
  }
  return undefined;
}

function albuminuriaOf(text: string): ProblemRow["albuminuria"] {
  const m = /\bA([1-3])\b/.exec(text);
  return m ? (("A" + m[1]) as any) : undefined;
}

function isCkd(label: string, icd?: string): boolean {
  return /chronic kidney|\bckd\b|chronic renal/i.test(label) || /^N18/.test(icd ?? "");
}

function onsetOf(t: string | undefined): ProblemRow["onset"] {
  if (!t) return undefined;
  const s = t.trim();
  if (/^\d{4}$/.test(s)) return { value: s, precision: "year" };
  if (/^\d{4}-\d{2}$/.test(s)) return { value: s, precision: "month" };
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { value: s, precision: "day" };
  return undefined;
}

interface Mention {
  doc: Doc; eid: string; e: any; kind: "dx" | "hx";
  status: "working" | "ruled_out" | "active" | "resolved";
  text: string; icd?: string;
}

const normLabel = (s: string) => lc(s).replace(/[^a-z0-9]+/g, " ").trim();

function buildProblemsAndAllergies(docs: Doc[]): { problems: ProblemRow[]; derived: AllergyIntoleranceRow[] } {
  const mentions: Mention[] = [];
  for (const d of docs.slice().sort(cmp)) {
    for (const [eid, e] of d.entries) {
      if (e.type === "diagnosis") {
        const text = str(e.label);
        if (!text) continue;
        const st = ["working", "ruled_out", "active", "resolved"].includes(e.status) ? e.status : "working";
        mentions.push({ doc: d, eid, e, kind: "dx", status: st, text, icd: str(e.icd10cm) });
      } else if (e.type === "history") {
        const text = str(e.condition);
        if (!text) continue;
        mentions.push({ doc: d, eid, e, kind: "hx", status: "active", text, icd: str(e.icd10cm) });
      }
    }
  }
  const keyOf = (m: Mention) => {
    const rd = m.e.riverside_dx?.code;
    if (rd) return "rrh:" + rd;
    if (m.icd) return "icd:" + m.icd;
    return "txt:" + normLabel(m.text);
  };
  // group by Riverside code first; mentions without one join the unique coded group sharing their ICD code
  const groups = new Map<string, Mention[]>();
  const rest: Mention[] = [];
  for (const m of mentions) {
    if (m.e.riverside_dx?.code) {
      const k = keyOf(m);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(m);
    } else rest.push(m);
  }
  for (const m of rest) {
    let k = keyOf(m);
    const coded = [...groups.keys()].filter((g) => g.startsWith("rrh:") && m.icd && groups.get(g)!.some((x) => x.icd === m.icd));
    if (coded.length === 1) k = coded[0];
    else if (!groups.has(k)) {
      const alt = [...groups.keys()].find((g) => groups.get(g)!.some((x) => normLabel(x.text) === normLabel(m.text)));
      if (alt) k = alt;
    }
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(m);
  }
  for (const ms of groups.values()) ms.sort((a, b) => cmp(a.doc, b.doc));

  const problems: ProblemRow[] = [];
  const derived: AllergyIntoleranceRow[] = [];
  for (const ms of groups.values()) {
    const last = ms[ms.length - 1];
    let cur: Mention | undefined = last;
    if (last.status === "ruled_out") continue;
    if (last.status === "working") {
      cur = undefined;
      for (let i = ms.length - 1; i >= 0; i--) if (ms[i].status === "active" || ms[i].status === "resolved") { cur = ms[i]; break; }
      if (!cur) continue;
    }
    const established = ms.filter((m) => m.status === "active" || m.status === "resolved");
    const evidence: Evidence = [{ item_id: cur.doc.item.id, entry_id: cur.eid }];

    const homeMeds = cur.doc.entries.filter(([, e]) => e.type === "home_med").map(([eid, e]) => ({ eid, e }));
    const tcode = cur.icd && /^T(3[6-9]|4[0-9]|50)\.[0-9A-Z]5[A-Z]?$/.test(cur.icd);
    const attr = cur.kind === "dx" ? attributionOf(cur.text) : undefined;
    let drug: DrugRef | undefined;
    if (tcode) drug = resolveDrug(cur.text, homeMeds) ?? { substance: lc(cur.text.replace(/^adverse effect of\s+/i, "")) };
    else if (attr) drug = resolveDrug(attr.thing, homeMeds);

    if (drug) {
      const reactionText = tcode ? undefined : attr?.condition || undefined;
      derived.push({
        substance: drug.substance,
        ...(drug.rxnorm ? { rxnorm_ingredient: drug.rxnorm } : {}),
        reaction_type: reactionTypeOf(reactionText ?? "", true),
        mechanism: "unknown",
        ...(reactionText ? { reaction: reactionText } : {}),
        criticality: reactionText && reactionTypeOf(reactionText, true) === "serious_adverse_event" ? "high" : "unknown",
        evidence,
      });
    }
    if (tcode) continue;

    const label = cur.text;
    const icd = cur.icd;
    const row: ProblemRow = {
      condition: label,
      status: cur.status === "resolved" ? "resolved" : "active",
      evidence,
    };
    if (icd) row.icd10cm = icd;
    for (const m of established) {
      if (!evidence.some((x) => x.item_id === m.doc.item.id && x.entry_id === m.eid)) evidence.push({ item_id: m.doc.item.id, entry_id: m.eid });
    }
    const onsetM = [...ms].reverse().find((m) => m.kind === "hx" && onsetOf(str(m.e.onset_text)));
    const onset = onsetM ? onsetOf(str(onsetM.e.onset_text)) : undefined;
    if (onset) row.onset = onset;
    if (isCkd(label, icd)) {
      const ck = [...ms].reverse().filter((m) => m.status !== "ruled_out");
      for (const m of ck) {
        const s = ckdStageOf(m.text, m.icd);
        if (s) { row.ckd_stage = s; break; }
      }
      for (const m of ck) {
        const a = albuminuriaOf(m.text);
        if (a) { row.albuminuria = a; break; }
      }
    }
    const sens = sensOfText(label);
    if (sens) row.sensitivity = sens;
    problems.push(row);
  }
  return { problems, derived };
}

// ---------- allergies ----------

function reactionTypeOf(reaction: string, hasText: boolean): AllergyIntoleranceRow["reaction_type"] {
  const t = lc(reaction);
  if (/hive|urticaria|rash|angioedema|swelling|anaphyla|bronchospasm|wheez|itch|pruritus|stevens|sjs|\bten\b|dyspnea|throat|hypersens|allerg|eczema|dermatitis/.test(t)) return "hypersensitivity";
  if (/liver|hepat|pancreatitis|ketoacidosis|\bdka\b|renal failure|kidney|nephro|agranulocytosis|neutropenia|thrombocytopenia|rhabdo|tendon|arrhythmia|qt |cardiac|bleed|hemorrhage|seizure|lactic|hypoglyc|aplastic|anemia|toxicity|failure|injury|ototox|neuropathy|suicid|psychosis|serotonin/.test(t)) return "serious_adverse_event";
  if (/cough|nausea|vomit|diarrhea|gi upset|stomach|dyspepsia|drows|sedat|dizz|headache|constipation|fatigue|tremor|insomnia|flush|edema|taste|cramp|myalgia|upset|intoleran|tachycardia|palpitation|dry mouth|weight|hypotension|sweat/.test(t)) return "side_effect";
  return hasText && t ? "serious_adverse_event" : "hypersensitivity";
}

function buildAllergies(docs: Doc[], derived: AllergyIntoleranceRow[]): AllergyIntoleranceRow[] {
  const withList = docs.filter((d) => d.entries.some(([, e]) => e.type === "allergy")).sort(cmp);
  const out = new Map<string, AllergyIntoleranceRow>();
  if (withList.length) {
    const snap = withList[withList.length - 1];
    for (const [id, e] of snap.entries) {
      if (e.type !== "allergy") continue;
      const sub = str(e.substance);
      if (!sub || /^nkda$/i.test(sub.trim()) || /^no known/i.test(sub.trim())) continue;
      const reaction = str(e.reaction);
      const rt = reactionTypeOf(reaction ?? "", !!reaction);
      const sev = e.severity;
      const isDrug = !!e.rxnorm_ingredient;
      const row: AllergyIntoleranceRow = {
        substance: isDrug ? ingredientOf(sub) : sub,
        reaction_type: rt,
        mechanism: rt === "side_effect" ? "non_immune" : "unknown",
        criticality: sev === "severe" ? "high" : sev === "mild" ? "low" : "unknown",
        evidence: [{ item_id: snap.item.id, entry_id: id }],
      };
      if (str(e.rxnorm_ingredient)) row.rxnorm_ingredient = e.rxnorm_ingredient;
      if (reaction) row.reaction = reaction;
      const sens = sensOfText(sub);
      if (sens) row.sensitivity = sens;
      out.set(lc(row.substance), row);
    }
  }
  for (const d of derived) {
    const k = lc(d.substance);
    const ex = out.get(k);
    if (ex) {
      for (const ev of d.evidence) if (!ex.evidence.some((x) => x.item_id === ev.item_id && x.entry_id === ev.entry_id)) ex.evidence.push(ev);
    } else out.set(k, d);
  }
  return [...out.values()];
}

// ---------- labs ----------

const CODE_MAP: Record<string, Analyte> = {
  CREAT: "creatinine", CR: "creatinine", CREA: "creatinine",
  EGFR: "egfr", GFR: "egfr",
  K: "potassium", NA: "sodium", CL: "chloride",
  CO2: "bicarbonate", HCO3: "bicarbonate",
  AGAP: "anion_gap", AG: "anion_gap",
  BUN: "bun", GLU: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr",
  PLT: "platelets", WBC: "wbc", HGB: "hemoglobin", HB: "hemoglobin",
  BHB: "bhb", LIPASE: "lipase",
  TROP: "troponin", TNI: "troponin", TROPI: "troponin",
  CHOL: "cholesterol", TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl", LDLC: "ldl", LDLCALC: "ldl",
  PH: "ph", VPH: "ph", ABGPH: "ph", PCO2: "pco2", VPCO2: "pco2", ABGPCO2: "pco2",
};

const LOINC_MAP: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "98979-8": "egfr", "62238-1": "egfr", "77147-7": "egfr", "33914-3": "egfr",
  "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium", "2075-0": "chloride", "2069-3": "chloride",
  "2028-9": "bicarbonate", "1963-8": "bicarbonate", "33037-3": "anion_gap", "1863-0": "anion_gap", "3094-0": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "17856-6": "a1c", "4544-3": "a1c", "9318-7": "uacr", "14959-1": "uacr",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "718-7": "hemoglobin", "20509-6": "hemoglobin",
  "3040-3": "lipase", "10839-9": "troponin", "49563-0": "troponin", "89579-7": "troponin",
  "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl", "13457-7": "ldl", "18262-6": "ldl", "2089-1": "ldl",
  "2744-1": "ph", "2746-6": "ph", "11558-4": "ph", "2019-8": "pco2", "2021-4": "pco2", "11557-6": "pco2",
};

const UNITS: Record<Analyte, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L",
  bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g",
  platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg",
  lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};

function analyteOf(test: any): Analyte | undefined {
  const name = lc(str(test?.name) ?? "");
  const code = (str(test?.local_code) ?? "").toUpperCase();
  if (/ratio/.test(name) && /creat/.test(name) && /album/.test(name)) return "uacr";
  const byCode = CODE_MAP[code];
  if (byCode) return byCode;
  const l = str(test?.loinc);
  if (l && LOINC_MAP[l]) return LOINC_MAP[l];
  if (/egfr|glomerular/.test(name)) return "egfr";
  if (/beta[- ]?hydroxybut/.test(name)) return "bhb";
  return undefined;
}

function convert(an: Analyte, v: number, unitRaw: string | undefined): number | undefined {
  const u = (unitRaw ?? "").trim().toLowerCase().replace(/µ|μ/g, "u").replace(/\s+/g, "");
  const round = (x: number, n = 4) => Math.round(x * 10 ** n) / 10 ** n;
  switch (an) {
    case "creatinine": return u === "umol/l" ? round(v / 88.4) : u === "" || u === "mg/dl" ? v : undefined;
    case "glucose": return u === "mmol/l" ? round(v * 18.016, 1) : u === "" || u === "mg/dl" ? v : undefined;
    case "bun": return u === "mmol/l" ? round(v * 2.801, 1) : u === "" || u === "mg/dl" ? v : undefined;
    case "cholesterol": case "hdl": case "ldl": return u === "mmol/l" ? round(v * 38.67, 1) : u === "" || u === "mg/dl" ? v : undefined;
    case "triglycerides": return u === "mmol/l" ? round(v * 88.57, 1) : u === "" || u === "mg/dl" ? v : undefined;
    case "a1c": return u === "mmol/mol" ? round(v / 10.929 + 2.15, 1) : v;
    case "hemoglobin": return u === "g/l" ? round(v / 10, 2) : v;
    case "platelets": case "wbc":
      if (u === "/ul" || u === "cells/ul" || u === "/mm3" || u === "cells/mm3") return round(v / 1000, 3);
      if (u === "10*9/l" || u === "10^9/l" || u === "g/l" || u === "k/ul" || u === "10*3/ul") return v;
      return v;
    case "uacr": return u === "mg/mmol" ? round(v * 8.84, 1) : v;
    case "troponin": return u === "ng/l" || u === "pg/ml" ? round(v / 1000, 5) : v;
    case "bhb": return u === "mg/dl" ? round(v / 10.4, 2) : v;
    case "pco2": return u === "kpa" ? round(v * 7.50062, 1) : v;
    case "potassium": case "sodium": case "chloride": case "bicarbonate": case "anion_gap":
      return v;
    default: return v;
  }
}

interface LabCopy {
  doc: Doc; eid: string; an: Analyte; test: any; value: string; unit?: string;
  collected: string; status: string;
}

const STATUS_RANK: Record<string, number> = { preliminary: 0, final: 1, corrected: 2 };

function buildLabs(docs: Doc[]): LabResultRow[] {
  const groups = new Map<string, LabCopy[]>();
  const add = (c: LabCopy, accession: string) => {
    const k = `${accession}|${str(c.test?.local_code) ?? c.an}|${c.collected}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(c);
  };
  for (const d of docs.slice().sort(cmp)) {
    for (const [eid, e] of d.entries) {
      if (e.type === "result") {
        const an = analyteOf(e.test);
        if (!an || typeof e.value !== "string") continue;
        add({ doc: d, eid, an, test: e.test, value: e.value, unit: str(e.unit), collected: String(e.collected), status: String(e.status) }, String(e.accession));
      } else if (e.type === "panel" && Array.isArray(e.components)) {
        for (const c of e.components) {
          if (!c || typeof c.value !== "string") continue;
          const an = analyteOf(c.test);
          if (!an) continue;
          add({ doc: d, eid, an, test: c.test, value: c.value, unit: str(c.unit), collected: String(e.collected), status: String(e.status) }, String(e.accession));
        }
      }
    }
  }
  const rows: LabResultRow[] = [];
  for (const copies of groups.values()) {
    let best = copies[0];
    for (const c of copies) if ((STATUS_RANK[c.status] ?? 0) >= (STATUS_RANK[best.status] ?? 0)) best = c;
    const m = /^\s*(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:\.\d+)?)\s*$/.exec(best.value);
    if (!m) continue;
    if (best.an === "egfr" && /\b(with|using)\s+race|black|african|non-?black/i.test(str(best.test?.name) ?? "") && !/race[- ]free|without/i.test(str(best.test?.name) ?? "")) continue;
    const v = convert(best.an, parseFloat(m[2]), best.unit);
    if (v === undefined || !isFinite(v)) continue;
    const loc = toLocal(best.collected);
    if (!loc) continue;
    const row: LabResultRow = {
      analyte: best.an,
      value: v,
      unit: UNITS[best.an],
      collected: `${loc.date}T${loc.time}:00${loc.offset}`,
      status: best.status === "preliminary" ? "preliminary" : "final",
      evidence: [],
    };
    const cmpMap: Record<string, LabResultRow["comparator"]> = { "<": "<", ">": ">", "<=": "<=", ">=": ">=", "≤": "<=", "≥": ">=" };
    if (m[1]) row.comparator = cmpMap[m[1]];
    if (best.an === "egfr") {
      const n = lc(str(best.test?.name) ?? "");
      row.egfr_equation = /2021/.test(n) ? "ckd-epi-2021" : /2009/.test(n) ? "ckd-epi-2009" : /mdrd/.test(n) ? "mdrd" : "unknown";
    }
    const loinc = str(best.test?.loinc);
    if (loinc) row.loinc = loinc;
    const seen = new Set<string>();
    const evs = [best, ...copies.filter((c) => c !== best)];
    for (const c of evs) {
      const k = c.doc.item.id + "|" + c.eid;
      if (seen.has(k)) continue;
      seen.add(k);
      row.evidence.push({ item_id: c.doc.item.id, entry_id: c.eid });
    }
    rows.push(row);
  }
  rows.sort((a, b) => (a.collected < b.collected ? -1 : a.collected > b.collected ? 1 : a.analyte < b.analyte ? -1 : 1));
  return rows;
}

// ---------- vitals ----------

function buildVitals(docs: Doc[]): VitalRow[] {
  interface V { ms: number; taken: string; e: any; refs: Evidence }
  const byTaken = new Map<string, V>();
  for (const d of docs.slice().sort(cmp)) {
    for (const [eid, e] of d.entries) {
      if (e.type !== "vitals" || typeof e.taken !== "string") continue;
      const ms = Date.parse(hasZone(e.taken) ? e.taken : e.taken + "Z");
      if (isNaN(ms)) continue;
      const k = String(ms);
      const ex = byTaken.get(k);
      if (ex) ex.refs.push({ item_id: d.item.id, entry_id: eid });
      else byTaken.set(k, { ms, taken: e.taken, e, refs: [{ item_id: d.item.id, entry_id: eid }] });
    }
  }
  const sorted = [...byTaken.values()].sort((a, b) => a.ms - b.ms);
  const rows: VitalRow[] = [];
  let prev: { row: VitalRow; ms: number; hasBp: boolean } | undefined;
  for (const v of sorted) {
    const e = v.e;
    const loc = toLocal(v.taken);
    if (!loc) continue;
    const sys = num(e.bp?.systolic_mmhg), dia = num(e.bp?.diastolic_mmhg);
    const hr = num(e.heart_rate_bpm);
    const wt = num(e.weight_kg);
    if (sys === undefined && dia === undefined && hr === undefined && wt === undefined) continue;
    // a repeat blood pressure within minutes of the previous set joins that set
    if (prev && v.ms - prev.ms <= 15 * 60000 && prev.hasBp && sys !== undefined && dia !== undefined && prev.row.repeat_systolic_mmhg === undefined) {
      prev.row.repeat_systolic_mmhg = sys;
      prev.row.repeat_diastolic_mmhg = dia;
      if (prev.row.pulse_bpm === undefined && hr !== undefined) prev.row.pulse_bpm = hr;
      if (prev.row.weight_kg === undefined && wt !== undefined) prev.row.weight_kg = Math.round(wt * 10) / 10;
      prev.row.evidence.push(...v.refs);
      continue;
    }
    const row: VitalRow = { setting: "hospital", local_time: `${loc.date}T${loc.time}`, evidence: v.refs };
    if (sys !== undefined) row.systolic_mmhg = sys;
    if (dia !== undefined) row.diastolic_mmhg = dia;
    if (hr !== undefined) row.pulse_bpm = hr;
    if (wt !== undefined) row.weight_kg = Math.round(wt * 10) / 10;
    rows.push(row);
    prev = { row, ms: v.ms, hasBp: sys !== undefined };
  }
  return rows;
}

// ---------- entry point ----------

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const docs = countingItems(Array.isArray(items) ? items : [], asOf).map(toDoc);
    if (!docs.length) return empty;
    const { problems, derived } = buildProblemsAndAllergies(docs);
    return {
      medications: buildMedications(docs),
      problems,
      allergies: buildAllergies(docs, derived),
      labs: buildLabs(docs),
      vitals: buildVitals(docs),
    };
  } catch {
    return empty;
  }
}
