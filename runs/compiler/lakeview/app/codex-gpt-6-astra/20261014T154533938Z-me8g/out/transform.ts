import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

type Data = Record<string, unknown>;
type Item = { id: string; issuer: string; recorded: number; data: Data };
type Entry = { item: Item; key: string; data: Data };
type Timed = { entry: Entry; time: number };
const object = (x: unknown): x is Data => typeof x === "object" && x !== null && !Array.isArray(x);
const str = (x: unknown): string => typeof x === "string" ? x : "";
const num = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const strings = (x: unknown): string[] => Array.isArray(x) ? x.filter((v): v is string => typeof v === "string") : [];
const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function wall(epoch: number): string {
  const parts: Record<string, string> = {};
  for (const p of chicago.formatToParts(new Date(epoch))) parts[p.type] = p.value;
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}
function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const t = Date.parse(s + "T00:00:00Z");
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === s;
}
function partial(x: unknown): string | undefined {
  const s = str(x);
  if (/^\d{4}$/.test(s) || /^\d{4}-(0[1-9]|1[0-2])$/.test(s) || validDate(s)) return s;
  return undefined;
}
// Never let the host process's time zone interpret an offset-free timestamp.
function time(x: unknown): { epoch: number; local: string; rfc: string } | undefined {
  const s = str(x).trim();
  const m = /^(\d{4}-\d{2}-\d{2})(?:[Tt ](\d{2}):(\d{2})(?::(\d{2})(\.\d{1,9})?)?(Z|z|[+-]\d{2}:\d{2})?)?$/.exec(s);
  if (!m || !validDate(m[1]) || +(m[2] || 0) > 23 || +(m[3] || 0) > 59 || +(m[4] || 0) > 59) return undefined;
  const local = `${m[1]}T${m[2] || "00"}:${m[3] || "00"}:${m[4] || "00"}${m[5] || ""}`;
  if (m[6]) {
    const rfc = local + m[6].toUpperCase();
    const epoch = Date.parse(rfc);
    return Number.isFinite(epoch) ? { epoch, local: wall(epoch), rfc } : undefined;
  }
  const naive = Date.parse(local + "Z");
  // Choose the first occurrence of an ambiguous autumn wall time. Both have the same local date.
  for (const offset of ["-05:00", "-06:00"]) {
    const epoch = Date.parse(local + offset);
    if (wall(epoch).slice(0, 19) === local.slice(0, 19)) return { epoch, local, rfc: local + offset };
  }
  // Preserve even a nonexistent spring-forward wall time, as the consumer requires.
  const offset = wall(naive + 6 * 3600000).slice(11, 13) === m[2] ? "-06:00" : "-05:00";
  return { epoch: Date.parse(local + offset), local, rfc: local + offset };
}
function dateTime(x: unknown): number | undefined {
  const p = partial(x);
  return time(p?.length === 4 ? p + "-01-01" : p?.length === 7 ? p + "-01" : x)?.epoch;
}
function compareEntry(a: Entry, b: Entry): number {
  return a.item.recorded - b.item.recorded || cmp(a.item.id, b.item.id) || cmp(a.key, b.key);
}
function compareTimed(a: Timed, b: Timed): number {
  return a.time - b.time || compareEntry(a.entry, b.entry);
}
function evidence(...entries: (Entry | undefined)[]): Evidence {
  const found = new Map<string, Evidence[number]>();
  for (const e of entries) if (e) found.set(JSON.stringify([e.item.id, e.key]), { item_id: e.item.id, entry_id: e.key });
  return [...found.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id || "", b.entry_id || ""));
}
function mergeEvidence(...sets: Evidence[]): Evidence {
  const all = new Map<string, Evidence[number]>();
  for (const set of sets) for (const e of set) all.set(JSON.stringify(e), e);
  return [...all.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id || "", b.entry_id || ""));
}
function group<T>(values: T[], key: (v: T) => string): Map<string, T[]> {
  const result = new Map<string, T[]>();
  for (const v of values) { const k = key(v); if (k) result.set(k, [...(result.get(k) || []), v]); }
  return result;
}
function latest(entries: Entry[]): Entry | undefined { return entries.slice().sort(compareEntry).at(-1); }
function countingItems(input: unknown, asOf: string): Item[] {
  if (!Array.isArray(input) || !validDate(asOf)) return [];
  const items: Item[] = [];
  for (const data of input) {
    if (!object(data) || !str(data.id) || !str(data.issuer)) continue;
    const recorded = time(data.recorded);
    if (recorded && recorded.local.slice(0, 10) <= asOf) items.push({ id: str(data.id), issuer: str(data.issuer), recorded: recorded.epoch, data });
  }
  const key = (issuer: string, id: string) => JSON.stringify([issuer, id]);
  const byId = new Map(items.map(i => [key(i.issuer, i.id), i]));
  const removed = new Set<string>();
  // Process all known replacement edges, including those on intermediate superseded items.
  // Retraction of a replacement does not revive its superseded originals.
  for (const item of items) {
    const pending = [...strings(item.data.supersedes), ...strings(item.data.retracts)];
    while (pending.length) {
      const id = key(item.issuer, pending.pop()!);
      if (removed.has(id)) continue;
      removed.add(id);
      const old = byId.get(id);
      if (old) pending.push(...strings(old.data.supersedes));
    }
  }
  return items.filter(i => !removed.has(key(i.issuer, i.id))).sort((a, b) => a.recorded - b.recorded || cmp(a.id, b.id));
}
function entriesOf(items: Item[]): Entry[] {
  const result: Entry[] = [];
  for (const item of items) if (object(item.data.payload)) {
    for (const key of Object.keys(item.data.payload).sort()) {
      const data = item.data.payload[key];
      if (object(data) && str(data.type)) result.push({ item, key, data });
    }
  }
  return result;
}
function within(entries: Entry[], e: Entry, type: string, column: string, id: unknown): Entry | undefined {
  if (!str(id)) return undefined;
  return entries.find(x => x.item === e.item && x.data.type === type && x.data[column] === id);
}
function contact(entries: Entry[], e: Entry): Entry | undefined {
  return within(entries, e, "CLINIC_VISIT", "VISIT_ID", e.data.VISIT_ID);
}
function eventTime(entries: Entry[], e: Entry): number {
  return time(contact(entries, e)?.data.VISIT_AT)?.epoch ?? time(e.item.data.effective)?.epoch ?? e.item.recorded;
}

const labCodes = new Map<string, { analyte: Analyte; sourceUnit: string; unit: string }>([
  ["LK-CREAT", { analyte: "creatinine", sourceUnit: "mg/dL", unit: "mg/dL" }],
  ["LK-EGFR09N", { analyte: "egfr", sourceUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2" }],
  ["LK-EGFR21", { analyte: "egfr", sourceUnit: "mL/min/1.73m2", unit: "mL/min/1.73m2" }],
  ["LK-NA", { analyte: "sodium", sourceUnit: "mmol/L", unit: "mmol/L" }],
  ["LK-K", { analyte: "potassium", sourceUnit: "mmol/L", unit: "mmol/L" }],
  ["LK-GLU", { analyte: "glucose", sourceUnit: "mg/dL", unit: "mg/dL" }],
  ["LK-A1C", { analyte: "a1c", sourceUnit: "%", unit: "%" }],
  ["LK-UACR", { analyte: "uacr", sourceUnit: "mg/g", unit: "mg/g" }],
  ["LK-WBC", { analyte: "wbc", sourceUnit: "K/uL", unit: "10*3/uL" }],
  ["LK-HGB", { analyte: "hemoglobin", sourceUnit: "g/dL", unit: "g/dL" }],
  ["LK-PLT", { analyte: "platelets", sourceUnit: "K/uL", unit: "10*3/uL" }],
  ["LK-CHOL", { analyte: "cholesterol", sourceUnit: "mg/dL", unit: "mg/dL" }],
  ["LK-TRIG", { analyte: "triglycerides", sourceUnit: "mg/dL", unit: "mg/dL" }],
  ["LK-HDL", { analyte: "hdl", sourceUnit: "mg/dL", unit: "mg/dL" }],
  ["LK-LDLC", { analyte: "ldl", sourceUnit: "mg/dL", unit: "mg/dL" }],
]);
function laboratory(entries: Entry[]): LabResultRow[] {
  const result: LabResultRow[] = [];
  const orders = group(entries.filter(e => e.data.type === "LAB_ORDER"), e => str(e.data.ORDER_ID));
  const ranks = new Map<unknown, number>([["P", 1], ["F", 2], ["A", 3], ["C", 4], ["X", 4]]);
  const copies = group(entries.filter(e => e.data.type === "LAB_RESULT"), e => str(e.data.RESULT_ID));
  for (const rows of copies.values()) {
    const ranked = rows.filter(e => ranks.has(e.data.RESULT_STATUS)).sort((a, b) =>
      ranks.get(a.data.RESULT_STATUS)! - ranks.get(b.data.RESULT_STATUS)! ||
      (time(a.data.STATUS_CHANGED_AT)?.epoch ?? time(a.data.RESULTED_AT)?.epoch ?? a.item.recorded) -
      (time(b.data.STATUS_CHANGED_AT)?.epoch ?? time(b.data.RESULTED_AT)?.epoch ?? b.item.recorded) || compareEntry(a, b));
    const e = ranked.at(-1);
    if (!e || !["P", "F", "A"].includes(str(e.data.RESULT_STATUS))) continue;
    const r = e.data;
    const spec = labCodes.get(str(r.TEST_CODE)); // Race-coefficient variant and panel codes are deliberately absent.
    if (!spec || r.UNIT_CODE !== spec.sourceUnit) continue;
    const order = within(entries, e, "LAB_ORDER", "ORDER_ID", r.ORDER_ID);
    const currentOrder = latest(orders.get(str(r.ORDER_ID)) || []);
    if (!order || !num(order.data.ORDER_STATUS) || ![1, 2, 3, 4].includes(order.data.ORDER_STATUS) ||
        currentOrder?.data.ORDER_STATUS === 9 || currentOrder?.data.ORDER_STATUS === 5) continue;
    const req = within(entries, e, "LAB_REQ", "REQ_ID", order.data.REQ_ID);
    const collected = time(req?.data.COLLECTED_AT);
    const parsed = /^(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/.exec(str(r.VALUE_TEXT).trim());
    if (!collected || !parsed || !Number.isFinite(Number(parsed[2]))) continue;
    const row: LabResultRow = {
      analyte: spec.analyte, value: Number(parsed[2]), unit: spec.unit, collected: collected.rfc,
      status: r.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: evidence(...ranked, order, req),
    };
    if (parsed[1]) row.comparator = (parsed[1] === "≤" ? "<=" : parsed[1] === "≥" ? ">=" : parsed[1]) as LabResultRow["comparator"];
    if (str(r.LOINC)) row.loinc = str(r.LOINC);
    if (spec.analyte === "egfr") {
      const comment = str(r.COMMENT_TEXT);
      row.egfr_equation = /CKD[ -]?EPI\s*2021/i.test(comment) ? "ckd-epi-2021" :
        /CKD[ -]?EPI\s*2009/i.test(comment) ? "ckd-epi-2009" : /\bMDRD\b/i.test(comment) ? "mdrd" :
        r.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : "ckd-epi-2009";
    }
    result.push(row);
  }
  return result.sort((a, b) => time(a.collected)!.epoch - time(b.collected)!.epoch || cmp(a.analyte, b.analyte) || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

// Names, never product-level RxNorm CUIs, identify ingredients. Unknown generic names are retained.
const brands = new Map<string, string>(Object.entries({
  kerendia: "finerenone", farxiga: "dapagliflozin", jardiance: "empagliflozin", invokana: "canagliflozin",
  cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan", avapro: "irbesartan", atacand: "candesartan",
  lisinopril: "lisinopril", zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril",
  altace: "ramipril", norvasc: "amlodipine", aldactone: "spironolactone", inspra: "eplerenone",
  lasix: "furosemide", demadex: "torsemide", bumex: "bumetanide", microzide: "hydrochlorothiazide",
  coreg: "carvedilol", lopressor: "metoprolol", "toprol xl": "metoprolol", "toprol-xl": "metoprolol",
  glucophage: "metformin", ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide",
  trulicity: "dulaglutide", victoza: "liraglutide", mounjaro: "tirzepatide", januvia: "sitagliptin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  humalog: "insulin lispro", novolog: "insulin aspart", levemir: "insulin detemir", tresiba: "insulin degludec",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", zetia: "ezetimibe",
  renvela: "sevelamer", renagel: "sevelamer", sensipar: "cinacalcet", rocaltrol: "calcitriol",
  epogen: "epoetin alfa", procrit: "epoetin alfa", aranesp: "darbepoetin alfa", zemplar: "paricalcitol",
  zyloprim: "allopurinol", uloric: "febuxostat",
  lokelma: "sodium zirconium cyclosilicate", veltassa: "patiromer", synthroid: "levothyroxine",
  keflex: "cephalexin", amoxil: "amoxicillin", augmentin: "amoxicillin / clavulanic acid",
  ventolin: "albuterol", "ventolin hfa": "albuterol", proair: "albuterol", zyrtec: "cetirizine",
  seroquel: "quetiapine", zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram",
  hyzaar: "losartan / hydrochlorothiazide", entresto: "sacubitril / valsartan",
}));
function ingredientNames(name: string): string[] {
  let base = name.toLowerCase().trim().replace(/\([^)]*\)/g, " ");
  base = base.replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|units?|iu|%)\b.*$/i, "");
  base = base.replace(/\s+\d.*$/, "").replace(/\b(?:extended.release|delayed.release|sustained.release|oral|solution|suspension|injection|injectable|tablets?|capsules?|inhaler|cream|ointment|patch|er|xr|sr|dr)\b.*$/, "").trim();
  base = brands.get(base) || base;
  return [...new Set(base.split(/\s*\/\s*|\s+and\s+|\s*\+\s*/).map(p => {
    let n = brands.get(p.trim()) || p.trim();
    n = n.replace(/\s+(?:hydrochloride|hcl|hydrobromide|hbr|besylate|besilate|maleate|succinate|tartrate|fumarate|mesylate|trihydrate|dihydrate)\b.*$/, "");
    if (/^(?:losartan|diclofenac|levothyroxine|pravastatin|rosuvastatin|atorvastatin|pantoprazole|omeprazole|metoprolol|amlodipine|sevelamer|patiromer)\s/.test(n)) n = n.split(" ")[0];
    return n.trim();
  }).filter(Boolean))];
}
function sensitive(text: string, code = ""): Sensitivity[] | undefined {
  const tags: Sensitivity[] = [];
  if (/^F(?:1[0-9])/.test(code) || /\b(?:alcohol|opioid|substance|cocaine|cannabis|tobacco|nicotine).{0,20}(?:use disorder|dependence|abuse)|\bbuprenorphine\b/i.test(text)) tags.push("substance-use");
  if ((/^F/.test(code) && !/^F1\d/.test(code)) || /\b(?:bipolar|schizophren|depressi|anxiety|post.traumatic stress|quetiapine|sertraline|fluoxetine|escitalopram|olanzapine|risperidone|aripiprazole)/i.test(text)) tags.push("mental-health");
  if (/^(?:O\d|Z3[0-6]|N(?:46|97))/.test(code) || /\b(?:pregnan|contracepti|infertility|fertility|erectile dysfunction|ethinyl estradiol|levonorgestrel)/i.test(text)) tags.push("sexual-reproductive-health");
  if (/^(?:B2[0-4]|Z21|A(?:5\d|6[0-4]))/.test(code) || /\b(?:HIV|AIDS|chlamydia|gonorrh|syphilis|genital herpes|emtricitabine|dolutegravir|bictegravir|tenofovir)\b/i.test(text)) tags.push("hiv-sti");
  if (/^(?:E84|D6[67]|Q61\.[23])/.test(code) || /\b(?:hereditary|inherited|genetic|BRCA[12]|polycystic kidney|cystic fibrosis|sickle.cell)/i.test(text)) tags.push("genetic");
  return tags.length ? tags : undefined;
}
function stoppedReason(hist: Entry): MedicationRow["stop_reason"] {
  const r = hist.data;
  if (r.REASON_CODE === "ADR") return "adverse_reaction";
  if (r.REASON_CODE === "PT") return "patient_choice";
  const text = str(r.COMMENT_TEXT);
  if (/ineffective|not effective|did not work|no (?:benefit|response)/i.test(text)) return "ineffective";
  if (/replac|switch|therapy chang/i.test(text)) return "therapy_changed";
  if (/course (?:complete|ended|finished)|completed (?:the |a )?(?:course|therapy|treatment)/i.test(text)) return "course_complete";
  if (/side effect|adverse reaction|due to (?:rash|hives|angioedema)/i.test(text)) return "adverse_reaction";
  return str(r.REASON_CODE) || text ? "other" : undefined;
}
function medications(entries: Entry[]): MedicationRow[] {
  const prescriptions = group(entries.filter(e => e.data.type === "MED_ORDER"), e => str(e.data.RX_ID));
  const histories = group(entries.filter(e => e.data.type === "MED_STATUS_HIST" && num(e.data.NEW_STATUS) && [1, 2, 3, 9].includes(e.data.NEW_STATUS) && time(e.data.CHANGED_AT)), e => str(e.data.RX_ID));
  const drugs = new Map<string, { row: MedicationRow; event: Timed }>();
  for (const [rx, copies] of prescriptions) {
    const e = latest(copies)!;
    const r = e.data;
    if (!str(r.DRUG_NAME) || !num(r.MED_STATUS) || ![1, 2, 3].includes(r.MED_STATUS)) continue;
    const changes = (histories.get(rx) || []).map(entry => ({ entry, time: time(entry.data.CHANGED_AT)!.epoch })).sort(compareTimed);
    const change = changes.at(-1);
    const status = change ? change.entry.data.NEW_STATUS : r.MED_STATUS;
    if (status === 9) continue;
    const names = ingredientNames(str(r.DRUG_NAME));
    const row: MedicationRow = {
      drug_name: str(r.DRUG_NAME), status: status === 1 ? "active" : status === 2 ? "stopped" : "held",
      patient_reported: false, evidence: evidence(e, change?.entry),
    };
    const since = change ? time(change.entry.data.CHANGED_AT)?.local.slice(0, 10) : status === 1 ? partial(r.START_DATE) : undefined;
    if (since) row.status_since = since;
    // DOSE_QTY is already the amount administered, not a tablet count. For combinations the schema
    // does not identify which constituent that mass refers to, so do not allocate it speculatively.
    if (num(r.DOSE_QTY) && names.length <= 1 && ["mg", "mcg", "unit", "mL"].includes(str(r.DOSE_UNIT))) {
      row.dose = { value: r.DOSE_QTY, unit: (r.DOSE_UNIT === "unit" ? "units" : r.DOSE_UNIT) as NonNullable<MedicationRow["dose"]>["unit"] };
    }
    if (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(str(r.FREQ_CODE))) row.frequency = r.FREQ_CODE as MedicationRow["frequency"];
    if (change && str(change.entry.data.COMMENT_TEXT)) row.status_reason_text = str(change.entry.data.COMMENT_TEXT);
    if (change && row.status === "stopped") { const reason = stoppedReason(change.entry); if (reason) row.stop_reason = reason; }
    const event: Timed = change || { entry: e, time: (status === 1 ? dateTime(r.START_DATE) : undefined) ?? eventTime(entries, e) };
    for (const name of names.length ? names : [""]) {
      const key = name || str(r.LV_DRUG_ID) || rx;
      const candidate = { ...row };
      if (name) candidate.ingredient = name;
      const tags = sensitive(name);
      if (tags) candidate.sensitivity = tags;
      const old = drugs.get(key);
      if (!old || compareTimed(event, old.event) > 0) drugs.set(key, { row: candidate, event });
    }
  }
  return [...drugs.values()].map(x => x.row).sort((a, b) => cmp(a.ingredient || a.drug_name, b.ingredient || b.drug_name));
}

function conditionKey(e: Entry): string {
  const code = str(e.data.ICD10CM).toUpperCase();
  const name = str(e.data.DX_TEXT);
  if (/^N18(?:\.|$)/.test(code) || /^(?:chronic kidney disease|CKD\b|end.stage (?:renal|kidney) disease)/i.test(name)) return "ckd";
  if (/^E(?:08|09|10|11|13)(?:\.|$)/.test(code)) return code.slice(0, 3); // Restaging the same type of diabetes.
  if (/^I(?:10|11|12|13)(?:\.|$)/.test(code)) return "hypertension";
  return code || name.toLowerCase();
}
const stages = new Map<string, NonNullable<ProblemRow["ckd_stage"]>>([
  ["N18.1", "G1"], ["N18.2", "G2"], ["N18.31", "G3a"], ["N18.32", "G3b"],
  ["N18.4", "G4"], ["N18.5", "G5"], ["N18.6", "G5"],
]);
function dxStage(e: Entry): ProblemRow["ckd_stage"] {
  const code = stages.get(str(e.data.ICD10CM).toUpperCase());
  if (code) return code;
  const m = /\b(?:stage\s*|G)(3[ab]|[1245])\b/i.exec(str(e.data.DX_TEXT));
  return m ? ("G" + m[1].toLowerCase()) as ProblemRow["ckd_stage"] : undefined;
}
function escaped(s: string): string { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function onsetFor(e: Entry): ProblemRow["onset"] {
  // A linked note may clarify the onset of an existing structured diagnosis; it cannot create a row.
  const span = new RegExp('<ref\\s+id=["\x27]' + escaped(e.key) + '["\x27][^>]*>([\\s\\S]*?)<\\/ref>', "gi");
  const narrative = str(e.item.data.narrative);
  let match: RegExpExecArray | null;
  let onset: ProblemRow["onset"];
  while ((match = span.exec(narrative))) {
    const text = match[1].replace(/<[^>]*>/g, " ");
    const iso = /\b(?:since|onset(?:\s+(?:in|on))?|diagnosed(?:\s+(?:in|on))?)\s*:?\s*(\d{4}(?:-\d{2}(?:-\d{2})?)?)(?![\d-])/i.exec(text);
    const us = /\b(?:since|onset(?:\s+(?:in|on))?|diagnosed(?:\s+(?:in|on))?)\s*:?\s*(\d{1,2})\/(\d{1,2}\/)?(\d{4})\b/i.exec(text);
    let value = iso ? partial(iso[1]) : undefined;
    if (us) value = partial(`${us[3]}-${us[1].padStart(2, "0")}${us[2] ? "-" + us[2].slice(0, -1).padStart(2, "0") : ""}`);
    if (value) onset = { value, precision: value.length === 4 ? "year" : value.length === 7 ? "month" : "day" };
  }
  return onset;
}

type Category = { value: string; entry: Entry; time: number; priority: number };
function clinicalCategories(entries: Entry[]): { g?: Category; a?: Category } {
  const g: Category[] = [], a: Category[] = [];
  for (const e of entries) {
    if (e.data.type === "CLINIC_VISIT") {
      const at = time(e.data.VISIT_AT)?.epoch ?? e.item.recorded;
      if (["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(str(e.data.CKD_G))) g.push({ value: str(e.data.CKD_G), entry: e, time: at, priority: 1 });
      if (["A1", "A2", "A3"].includes(str(e.data.CKD_A))) a.push({ value: str(e.data.CKD_A), entry: e, time: at, priority: 1 });
    } else if (e.data.type === "VISIT_DX" && conditionKey(e) === "ckd" && ["A", "H"].includes(str(e.data.DX_STATUS))) {
      const stage = dxStage(e);
      if (stage) g.push({ value: stage, entry: e, time: eventTime(entries, e), priority: 0 });
      const albuminuria = /\bA[123]\b/.exec(str(e.data.DX_TEXT));
      if (albuminuria) a.push({ value: albuminuria[0], entry: e, time: eventTime(entries, e), priority: 0 });
    }
  }
  const order = (x: Category, y: Category) => x.time - y.time || x.priority - y.priority || compareEntry(x.entry, y.entry);
  return { g: g.sort(order).at(-1), a: a.sort(order).at(-1) };
}
function isAdverseCode(code: string): boolean {
  const c = code.replace(/\./g, "");
  return /^T(?:3[6-9]|4\d|50)/.test(c) && c[5] === "5";
}
function drugAllergy(dx: Entry, entries: Entry[]): AllergyIntoleranceRow | undefined {
  const text = str(dx.data.DX_TEXT);
  const pure = isAdverseCode(str(dx.data.ICD10CM)) || /^adverse (?:effect|reaction)\b/i.test(text);
  const match = /(?:adverse (?:effect|reaction) (?:of|to)|(?:due to|caused by|induced by|secondary to)|allergy to)\s+(.+?)(?:,\s*(?:initial|subsequent) encounter|\s*\([^)]*\))?$/i.exec(text);
  if (!match) return undefined;
  const written = match[1].replace(/,\s*(?:initial|subsequent) encounter.*$/i, "").trim();
  const inItem = entries.filter(e => e.item === dx.item && e.data.type === "MED_ORDER" && e.data.MED_STATUS !== 9);
  const localNames = inItem.flatMap(e => ingredientNames(str(e.data.DRUG_NAME)));
  const names = ingredientNames(written);
  const known = new Set([...brands.keys(), ...brands.values(), ...localNames,
    "amoxicillin", "penicillin", "cephalexin", "lisinopril", "enalapril", "spironolactone", "finerenone",
    "losartan", "valsartan", "ibuprofen", "naproxen", "erythromycin", "isoniazid", "valproate", "allopurinol"]);
  const classes: { test: RegExp; members: RegExp }[] = [
    { test: /penicillins?/i, members: /^(?:amoxicillin|ampicillin|penicillin|dicloxacillin|piperacillin)\b/ },
    { test: /ACE inhibitors?/i, members: /pril$/ },
    { test: /angiotensin.*(?:blocker|antagonist)|\bARBs?\b/i, members: /sartan$/ },
    { test: /NSAID|non.?steroidal anti.?inflammator/i, members: /^(?:ibuprofen|naproxen|diclofenac|meloxicam|celecoxib|indomethacin)$/ },
    { test: /sulfonamides?|sulfa antibiotics/i, members: /^(?:sulfamethoxazole|sulfadiazine|sulfasalazine)$/ },
  ];
  const drugClass = classes.find(c => c.test.test(written) && !names.some(n => localNames.includes(n)));
  if (!pure && !drugClass && !names.some(n => known.has(n))) return undefined;
  let substance = names.length === 1 ? names[0] : written;
  let medication: Entry | undefined;
  if (drugClass) {
    const candidates = [...new Set(localNames.filter(n => drugClass.members.test(n)))];
    substance = candidates.length === 1 ? candidates[0] : written;
    if (candidates.length === 1) medication = inItem.find(e => ingredientNames(str(e.data.DRUG_NAME)).includes(substance));
  }
  const hypersensitivity = /hives|urticaria|rash|angioedema|anaphyla|bronchospasm|swelling (?:of )?(?:lips|face|tongue)/i.test(text);
  const serious = /liver (?:injury|failure)|hepatitis|pancreatitis|kidney (?:injury|failure)|renal failure|hyperkalemia|agranulocytosis|aplastic anemia|rhabdomyolysis|stevens.johnson|toxic epidermal/i.test(text);
  const predictable = /nausea|vomiting|diarrh|stomach upset|drowsiness|sedation|cough|hyperkalemia/i.test(text);
  const row: AllergyIntoleranceRow = {
    substance, reaction_type: hypersensitivity ? "hypersensitivity" : serious ? "serious_adverse_event" : "side_effect",
    mechanism: /\bnon[- ]immune\b/i.test(text) ? "non_immune" : /\bimmune[- ]mediated\b/i.test(text) ? "immune" : predictable ? "non_immune" : "unknown",
    criticality: /\bsevere\b|life.threatening|anaphyla|angioedema|stevens.johnson|toxic epidermal/i.test(text) ? "high" : /\bmild\b/i.test(text) ? "low" : "unknown",
    evidence: evidence(dx, medication),
  };
  if (!pure) row.reaction = text;
  const onset = onsetFor(dx); if (onset) row.onset = onset;
  const tags = sensitive(text, str(dx.data.ICD10CM)); if (tags) row.sensitivity = tags;
  return row;
}
function conditions(entries: Entry[]): { problems: ProblemRow[]; allergies: AllergyIntoleranceRow[] } {
  const diagnoses = group(entries.filter(e => e.data.type === "VISIT_DX" && str(e.data.DX_TEXT) && ["A", "P", "R", "H"].includes(str(e.data.DX_STATUS))), conditionKey);
  const problems: ProblemRow[] = [];
  const allergies = new Map<string, { row: AllergyIntoleranceRow; event: Timed }>();
  const categories = clinicalCategories(entries);
  const attachCategories = (row: ProblemRow) => {
    if (categories.g) { row.ckd_stage = categories.g.value as ProblemRow["ckd_stage"]; row.evidence = mergeEvidence(row.evidence, evidence(categories.g.entry)); }
    if (categories.a) { row.albuminuria = categories.a.value as ProblemRow["albuminuria"]; row.evidence = mergeEvidence(row.evidence, evidence(categories.a.entry)); }
  };
  for (const [key, copies] of diagnoses) {
    const events = copies.map(entry => ({ entry, time: eventTime(entries, entry) })).sort(compareTimed);
    const current = events.at(-1)!;
    let confirmed: Entry | undefined;
    for (const { entry } of events) {
      if (entry.data.DX_STATUS === "R") confirmed = undefined;
      else if (entry.data.DX_STATUS === "A" || entry.data.DX_STATUS === "H") confirmed = entry;
    }
    if (!confirmed || current.entry.data.DX_STATUS === "R") continue;
    // A subsequent provisional assessment cannot turn an established condition into a never-confirmed one.
    const e = current.entry;
    const row: ProblemRow = {
      condition: str(e.data.DX_TEXT), status: confirmed.data.DX_STATUS === "H" ? "resolved" : "active",
      evidence: evidence(e, confirmed),
    };
    if (str(e.data.ICD10CM)) row.icd10cm = str(e.data.ICD10CM);
    for (const prior of events) {
      const onset = onsetFor(prior.entry);
      if (onset) { row.onset = onset; row.evidence = mergeEvidence(row.evidence, evidence(prior.entry)); }
    }
    if (key === "ckd") attachCategories(row);
    const tags = sensitive(row.condition, row.icd10cm); if (tags) row.sensitivity = tags;
    const allergy = drugAllergy(e, entries);
    if (allergy) {
      const old = allergies.get(allergy.substance);
      if (!old || compareTimed(current, old.event) > 0) allergies.set(allergy.substance, { row: allergy, event: current });
    }
    if (!isAdverseCode(str(e.data.ICD10CM)) && !/^adverse (?:effect|reaction)\s+(?:of|to)\b/i.test(row.condition)) problems.push(row);
  }
  if (!diagnoses.has("ckd") && (categories.g || categories.a)) {
    const row: ProblemRow = { condition: "Chronic kidney disease", status: "active", evidence: [] };
    attachCategories(row);
    problems.push(row);
  }
  return {
    problems: problems.sort((a, b) => cmp(a.icd10cm || a.condition, b.icd10cm || b.condition)),
    allergies: [...allergies.values()].map(x => x.row).sort((a, b) => cmp(a.substance, b.substance)),
  };
}

function vitalSets(entries: Entry[]): VitalRow[] {
  const values = entries.filter(e => e.data.type === "VITAL" && num(e.data.VALUE_NUM) &&
    num(e.data.READING_NO) && Number.isInteger(e.data.READING_NO) && e.data.READING_NO >= 1 && time(e.data.TAKEN_AT) &&
    ((["BPS", "BPD"].includes(str(e.data.VITAL_CODE)) && e.data.UNIT_CODE === "mmHg") ||
      (e.data.VITAL_CODE === "HR" && e.data.UNIT_CODE === "/min") || (e.data.VITAL_CODE === "WT" && e.data.UNIT_CODE === "kg")));
  const visits = group(values, e => str(e.data.VISIT_ID));
  const rows: VitalRow[] = [];
  for (const readings of visits.values()) {
    // Repeated copies of a reading use the latest counting entry; READING_NO pairs the BP components.
    const unique = [...group(readings, e => JSON.stringify([e.data.VITAL_CODE, e.data.READING_NO])).values()].map(x => latest(x)!);
    const sorted = unique.sort((a, b) => Number(a.data.READING_NO) - Number(b.data.READING_NO) || time(a.data.TAKEN_AT)!.epoch - time(b.data.TAKEN_AT)!.epoch || compareEntry(a, b));
    const bp = sorted.filter(e => e.data.VITAL_CODE === "BPS" || e.data.VITAL_CODE === "BPD");
    const firstNo = bp[0]?.data.READING_NO;
    const repeatNo = bp.at(-1)?.data.READING_NO;
    const first = bp.filter(e => e.data.READING_NO === firstNo);
    // The output has one repeat slot: retain the last repeat if more than two were taken.
    const repeat = firstNo !== repeatNo ? bp.filter(e => e.data.READING_NO === repeatNo) : [];
    const pulse = sorted.find(e => e.data.VITAL_CODE === "HR");
    const weight = sorted.find(e => e.data.VITAL_CODE === "WT");
    const measured = [...first, ...repeat, ...(pulse ? [pulse] : []), ...(weight ? [weight] : [])];
    const anchor = (first.length ? first : measured).slice().sort((a, b) => time(a.data.TAKEN_AT)!.epoch - time(b.data.TAKEN_AT)!.epoch || compareEntry(a, b))[0];
    if (!anchor) continue;
    const row: VitalRow = { setting: "clinic", local_time: time(anchor.data.TAKEN_AT)!.local.slice(0, 16), evidence: evidence(...measured) };
    for (const e of first) {
      if (e.data.VITAL_CODE === "BPS") row.systolic_mmhg = e.data.VALUE_NUM as number;
      else row.diastolic_mmhg = e.data.VALUE_NUM as number;
    }
    for (const e of repeat) {
      if (e.data.VITAL_CODE === "BPS") row.repeat_systolic_mmhg = e.data.VALUE_NUM as number;
      else row.repeat_diastolic_mmhg = e.data.VALUE_NUM as number;
    }
    if (pulse) row.pulse_bpm = pulse.data.VALUE_NUM as number;
    if (weight) row.weight_kg = Math.round((weight.data.VALUE_NUM as number) * 10) / 10;
    rows.push(row);
  }
  return rows.sort((a, b) => cmp(a.local_time, b.local_time) || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const entries = entriesOf(countingItems(items, asOf));
  const { problems, allergies } = conditions(entries);
  return { medications: medications(entries), problems, allergies, labs: laboratory(entries), vitals: vitalSets(entries) };
}
