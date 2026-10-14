import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

// The payload keys (not the database foreign keys) identify entries in evidence.
type Obj = Record<string, unknown>;
type Item = { id: string; issuer: string; recorded: number; raw: Obj; entries: Entry[] };
type Entry = { item: Item; id: string; row: Obj };
type Time = { ms: number; local: string; rfc: string };
const obj = (x: unknown): x is Obj => x !== null && typeof x === "object" && !Array.isArray(x);
const str = (x: unknown): string => typeof x === "string" ? x : "";
const num = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const oneOf = <T extends string>(x: unknown, values: readonly T[]): x is T =>
  typeof x === "string" && values.includes(x as T);
const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function localAt(ms: number): string {
  const parts: Record<string, string> = {};
  for (const p of chicago.formatToParts(new Date(ms))) parts[p.type] = p.value;
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

function validDate(s: string): boolean {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const ms = Date.parse(s + "T00:00:00Z");
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === s;
}

function time(value: unknown): Time | undefined {
  const s = str(value).trim();
  const m = /^(\d{4}-\d{2}-\d{2})(?:[Tt ](\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?(Z|z|[+-]\d{2}:\d{2})?)?$/.exec(s);
  if (!m || !validDate(m[1]) || +(m[2] || 0) > 23 || +(m[3] || 0) > 59 || +(m[4] || 0) > 59) return;
  const wall = `${m[1]}T${m[2] || "00"}:${m[3] || "00"}:${m[4] || "00"}`;
  const fraction = m[5] || "";
  if (m[6]) {
    const rfc = wall + fraction + m[6].toUpperCase();
    const ms = Date.parse(rfc);
    if (Number.isFinite(ms)) return { ms, local: localAt(ms), rfc };
    return;
  }
  // For offsetless local times, prefer the earlier occurrence in the autumn fold.
  // In a spring gap preserve the wall clock and use the pre-transition offset.
  for (const offset of ["-05:00", "-06:00"]) {
    const rfc = wall + fraction + offset;
    const ms = Date.parse(rfc);
    if (localAt(ms) === wall) return { ms, local: wall, rfc };
  }
  const rfc = wall + fraction + "-06:00";
  return { ms: Date.parse(rfc), local: wall, rfc };
}

function partialDate(value: unknown): ProblemRow["onset"] {
  const s = str(value);
  if (/^\d{4}$/.test(s)) return { value: s, precision: "year" };
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(s)) return { value: s, precision: "month" };
  if (validDate(s)) return { value: s, precision: "day" };
  return undefined;
}

function evidence(...entries: (Entry | undefined)[]): Evidence {
  const refs = new Map<string, Evidence[number]>();
  for (const e of entries) if (e) refs.set(JSON.stringify([e.item.id, e.id]), { item_id: e.item.id, entry_id: e.id });
  return [...refs.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id || "", b.entry_id || ""));
}

function tie(a: Entry, b: Entry): number {
  return a.item.recorded - b.item.recorded || cmp(a.item.id, b.item.id) || cmp(a.id, b.id);
}

function activeItems(input: unknown, asOf: string): Item[] {
  if (!Array.isArray(input) || !validDate(asOf)) return [];
  const items: Item[] = [];
  for (const raw of input) {
    if (!obj(raw) || !str(raw.id)) continue;
    const recorded = time(raw.recorded);
    if (!recorded || recorded.local.slice(0, 10) > asOf) continue;
    const item: Item = { id: str(raw.id), issuer: str(raw.issuer), recorded: recorded.ms, raw, entries: [] };
    if (obj(raw.payload)) {
      for (const id of Object.keys(raw.payload).sort(cmp)) {
        const row = raw.payload[id];
        if (obj(row) && str(row.type)) item.entries.push({ item, id, row });
      }
    }
    items.push(item);
  }
  const key = (issuer: string, id: string) => JSON.stringify([issuer, id]);
  const removed = new Set<string>();
  // Apply all published replacement edges, including the edges of intermediate
  // versions. Replacing a correction must not resurrect its predecessor.
  for (const item of items) {
    for (const field of ["supersedes", "retracts"]) {
      const refs = item.raw[field];
      if (Array.isArray(refs)) for (const id of refs) if (typeof id === "string") removed.add(key(item.issuer, id));
    }
  }
  return items.filter(i => !removed.has(key(i.issuer, i.id)))
    .sort((a, b) => a.recorded - b.recorded || cmp(a.id, b.id));
}

function group(entries: Entry[], field: string): Map<string, Entry[]> {
  const result = new Map<string, Entry[]>();
  for (const e of entries) {
    const id = str(e.row[field]);
    if (!id) continue;
    const members = result.get(id) || [];
    members.push(e);
    result.set(id, members);
  }
  return result;
}

function sibling(e: Entry, type: string, field: string, id: unknown): Entry | undefined {
  if (!str(id)) return;
  return e.item.entries.find(x => x.row.type === type && x.row[field] === id);
}

function visit(e: Entry): Entry | undefined {
  return e.row.type === "CLINIC_VISIT" ? e : sibling(e, "CLINIC_VISIT", "VISIT_ID", e.row.VISIT_ID);
}

function eventTime(e: Entry): number {
  return time(visit(e)?.row.VISIT_AT)?.ms ?? time(e.item.raw.effective)?.ms ?? e.item.recorded;
}

function chronological(a: Entry, b: Entry): number {
  return eventTime(a) - eventTime(b) || tie(a, b);
}

const labCodes: Record<string, [Analyte, string, string]> = {
  "LK-CREAT": ["creatinine", "mg/dL", "mg/dL"],
  "LK-EGFR09N": ["egfr", "mL/min/1.73m2", "mL/min/1.73m2"],
  "LK-EGFR21": ["egfr", "mL/min/1.73m2", "mL/min/1.73m2"],
  "LK-K": ["potassium", "mmol/L", "mmol/L"],
  "LK-NA": ["sodium", "mmol/L", "mmol/L"],
  "LK-GLU": ["glucose", "mg/dL", "mg/dL"],
  "LK-A1C": ["a1c", "%", "%"],
  "LK-UACR": ["uacr", "mg/g", "mg/g"],
  "LK-PLT": ["platelets", "K/uL", "10*3/uL"],
  "LK-WBC": ["wbc", "K/uL", "10*3/uL"],
  "LK-HGB": ["hemoglobin", "g/dL", "g/dL"],
  "LK-CHOL": ["cholesterol", "mg/dL", "mg/dL"],
  "LK-TRIG": ["triglycerides", "mg/dL", "mg/dL"],
  "LK-HDL": ["hdl", "mg/dL", "mg/dL"],
  "LK-LDLC": ["ldl", "mg/dL", "mg/dL"],
};

function labValue(value: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const m = /^(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/.exec(str(value).trim());
  if (!m || !Number.isFinite(Number(m[2]))) return;
  const result: { value: number; comparator?: LabResultRow["comparator"] } = { value: Number(m[2]) };
  if (m[1]) result.comparator = (m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1]) as LabResultRow["comparator"];
  return result;
}

function equation(e: Entry): LabResultRow["egfr_equation"] {
  const wording = str(e.row.COMMENT_TEXT) + " " + str(e.row.TEST_NAME);
  if (/CKD[ -]?EPI\s*(?:equation\s*)?2021/i.test(wording)) return "ckd-epi-2021";
  if (/CKD[ -]?EPI\s*(?:equation\s*)?2009/i.test(wording)) return "ckd-epi-2009";
  if (/\bMDRD\b/i.test(wording)) return "mdrd";
  // The source code table documents the equation, independently of its erroneous
  // MDRD LOINCs. Never infer an equation from the LOINC column.
  if (e.row.TEST_CODE === "LK-EGFR09N") return "ckd-epi-2009";
  if (e.row.TEST_CODE === "LK-EGFR21") return "ckd-epi-2021";
  return "unknown";
}

function labs(entries: Entry[]): LabResultRow[] {
  const result: { row: LabResultRow; id: string; ms: number }[] = [];
  const ranks: Record<string, number> = { P: 1, F: 2, A: 3, X: 4, C: 5 };
  const orders = group(entries.filter(e => e.row.type === "LAB_ORDER"), "ORDER_ID");
  for (const [id, copies] of group(entries.filter(e => e.row.type === "LAB_RESULT"), "RESULT_ID")) {
    copies.sort((a, b) => (ranks[str(a.row.RESULT_STATUS)] || 0) - (ranks[str(b.row.RESULT_STATUS)] || 0)
      || (time(a.row.STATUS_CHANGED_AT ?? a.row.RESULTED_AT)?.ms ?? a.item.recorded)
        - (time(b.row.STATUS_CHANGED_AT ?? b.row.RESULTED_AT)?.ms ?? b.item.recorded) || tie(a, b));
    const e = copies[copies.length - 1];
    if (!oneOf(e.row.RESULT_STATUS, ["F", "A", "P"])) continue;
    const mapping = Object.hasOwn(labCodes, str(e.row.TEST_CODE)) ? labCodes[str(e.row.TEST_CODE)] : undefined;
    if (!mapping || e.row.UNIT_CODE !== mapping[1]) continue;
    const order = sibling(e, "LAB_ORDER", "ORDER_ID", e.row.ORDER_ID);
    const orderCopies = orders.get(str(e.row.ORDER_ID)) || [];
    const latestOrder = [...orderCopies].sort((a, b) =>
      (time(a.row.STATUS_AT)?.ms ?? a.item.recorded) - (time(b.row.STATUS_AT)?.ms ?? b.item.recorded) || tie(a, b)).pop();
    if (!order || !latestOrder || ![1, 2, 3, 4].includes(latestOrder.row.ORDER_STATUS as number)) continue;
    const req = sibling(e, "LAB_REQ", "REQ_ID", order.row.REQ_ID);
    const collected = time(req?.row.COLLECTED_AT);
    const value = labValue(e.row.VALUE_TEXT);
    if (!collected || !value) continue;
    const row: LabResultRow = {
      analyte: mapping[0], ...value, unit: mapping[2], collected: collected.rfc,
      status: e.row.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: evidence(...copies, order, latestOrder, req),
    };
    if (row.analyte === "egfr") row.egfr_equation = equation(e);
    if (str(e.row.LOINC)) row.loinc = str(e.row.LOINC);
    result.push({ row, id, ms: collected.ms });
  }
  return result.sort((a, b) => a.ms - b.ms || cmp(a.row.analyte, b.row.analyte) || cmp(a.id, b.id)).map(x => x.row);
}

// Name normalization uses only the supplied name, never product-level RxNorm IDs.
const brands: Record<string, string> = {
  kerendia: "finerenone", farxiga: "dapagliflozin", jardiance: "empagliflozin",
  invokana: "canagliflozin", cozaar: "losartan", diovan: "valsartan", benicar: "olmesartan",
  lisinopril: "lisinopril", prinivil: "lisinopril", zestril: "lisinopril", norvasc: "amlodipine",
  lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide", aldactone: "spironolactone",
  inspra: "eplerenone", lopressor: "metoprolol", "toprol xl": "metoprolol", coreg: "carvedilol",
  glucophage: "metformin", ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin",
  lantus: "insulin glargine", basaglar: "insulin glargine", humalog: "insulin lispro",
  novolog: "insulin aspart", renvela: "sevelamer", renagel: "sevelamer", rocaltrol: "calcitriol",
  procrit: "epoetin alfa", epogen: "epoetin alfa", aranesp: "darbepoetin alfa",
  keflex: "cephalexin", amoxil: "amoxicillin", "ventolin hfa": "albuterol", ventolin: "albuterol",
  proair: "albuterol", tylenol: "acetaminophen", advil: "ibuprofen", zyrtec: "cetirizine",
  pepcid: "famotidine", seroquel: "quetiapine", zoloft: "sertraline", prozac: "fluoxetine",
};

function ingredient(name: string): string | undefined {
  let n = name.toLowerCase().trim();
  // A generic name explicitly in parentheses takes precedence over the brand.
  const paren = /\(([^()]+)\)/.exec(n);
  if (paren && !/\d|extended|release|\ber\b|\bxr\b/.test(paren[1])) n = paren[1];
  n = n.replace(/\s+\d.*$/, "").replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:oral|injectable|extended[ -]release|delayed[ -]release|immediate[ -]release|film[ -]coated|tablet[s]?|capsule[s]?|solution|suspension|injection|inhaler|cream|ointment|patch|pen|vial|er|xr|xl|sr|dr)\b/g, " ")
    .replace(/\s+/g, " ").trim();
  // Match both before and after dosage-form normalization (e.g. Toprol XL).
  for (const brand of Object.keys(brands).sort((a, b) => b.length - a.length || cmp(a, b))) {
    if (n === brand || name.toLowerCase().startsWith(brand + " ")) return brands[brand];
  }
  n = n.replace(/\s+(?:hydrochloride|hcl|besylate|besilate|maleate|fumarate|succinate|tartrate|mesylate|mesilate|trihydrate|dihydrate|monohydrate)\b/g, "")
    .replace(/^(losartan|olmesartan|valsartan) potassium$/, "$1")
    .replace(/^(atorvastatin|rosuvastatin) calcium$/, "$1")
    .replace(/^metoprolol (?:succinate|tartrate)$/, "metoprolol").trim();
  if (!n || !/[a-z]/.test(n) || /^(?:unknown|unspecified|medication|drug)$/.test(n)) return;
  return n;
}

function sensitive(text: string, code = ""): Sensitivity[] | undefined {
  const categories: Sensitivity[] = [];
  if (/^F1\d/.test(code) || /\b(?:alcohol|opioid|substance|tobacco) (?:use disorder|dependence|abuse)|\bbuprenorphine\b/i.test(text)) categories.push("substance-use");
  if ((/^F\d/.test(code) && !/^F1\d/.test(code)) || /\b(?:bipolar|schizophren\w*|depressi\w*|anxiety|psychosis|quetiapine|sertraline|fluoxetine|escitalopram|olanzapine)\b/i.test(text)) categories.push("mental-health");
  if (/^(?:O\d|Z3\d|N9[1678])/.test(code) || /\b(?:pregnan\w*|contracepti\w*|infertility|erectile dysfunction)\b/i.test(text)) categories.push("sexual-reproductive-health");
  if (/^(?:A[56]\d|B2[0-4]|Z21)/.test(code) || /\b(?:HIV|AIDS|chlamydia|gonorrh\w*|syphilis|sexually transmitted)\b/i.test(text)) categories.push("hiv-sti");
  if (/\b(?:hereditary|inherited|genetic|BRCA[12]|ADPKD|autosomal|polycystic kidney|Alport)\b/i.test(text)) categories.push("genetic");
  return categories.length ? categories : undefined;
}

function stopReason(hist: Entry): MedicationRow["stop_reason"] {
  const reason = str(hist.row.REASON_CODE);
  if (reason === "ADR") return "adverse_reaction";
  if (reason === "PT") return "patient_choice";
  const text = str(hist.row.COMMENT_TEXT);
  if (/ineffective|not effective|did not (?:work|help)|no (?:benefit|response)/i.test(text)) return "ineffective";
  if (/replaced (?:by|with)|switch(?:ed|ing)? to|therapy chang|regimen chang/i.test(text)) return "therapy_changed";
  if (/course (?:is )?(?:complete|finished)|completed (?:the )?(?:course|therapy)/i.test(text)) return "course_complete";
  if (/side effect|adverse (?:effect|reaction)|due to (?:rash|nausea|angioedema)/i.test(text)) return "adverse_reaction";
  return reason || text ? "other" : undefined;
}

function medications(entries: Entry[]): MedicationRow[] {
  const history = group(entries.filter(e => e.row.type === "MED_STATUS_HIST"), "RX_ID");
  const drugs = new Map<string, { row: MedicationRow; event: number; source: Entry }>();
  for (const [rx, copies] of group(entries.filter(e => e.row.type === "MED_ORDER"), "RX_ID")) {
    const e = copies.sort(tie)[copies.length - 1];
    const hist = (history.get(rx) || []).filter(h => time(h.row.CHANGED_AT))
      .sort((a, b) => time(a.row.CHANGED_AT)!.ms - time(b.row.CHANGED_AT)!.ms || tie(a, b)).pop();
    const status = hist ? hist.row.NEW_STATUS : e.row.MED_STATUS;
    if (e.row.MED_STATUS === 9 || status === 9 || ![1, 2, 3].includes(status as number) || !str(e.row.DRUG_NAME)) continue;
    const ing = ingredient(str(e.row.DRUG_NAME));
    const row: MedicationRow = {
      drug_name: str(e.row.DRUG_NAME), status: status === 1 ? "active" : status === 2 ? "stopped" : "held",
      patient_reported: false, evidence: evidence(e, hist),
    };
    if (ing) row.ingredient = ing;
    const since = hist ? time(hist.row.CHANGED_AT)?.local.slice(0, 10)
      : status === 1 ? partialDate(e.row.START_DATE)?.value : undefined;
    if (since) row.status_since = since;
    if (num(e.row.DOSE_QTY) && oneOf(e.row.DOSE_UNIT, ["mg", "mcg", "unit", "mL"])) {
      row.dose = { value: e.row.DOSE_QTY, unit: e.row.DOSE_UNIT === "unit" ? "units" : e.row.DOSE_UNIT };
    }
    if (oneOf(e.row.FREQ_CODE, ["QD", "BID", "TID", "QHS", "QW", "PRN"])) row.frequency = e.row.FREQ_CODE;
    if (hist && str(hist.row.COMMENT_TEXT)) row.status_reason_text = str(hist.row.COMMENT_TEXT);
    if (hist && row.status === "stopped") {
      const reason = stopReason(hist);
      if (reason) row.stop_reason = reason;
    }
    const sensitivity = sensitive(ing || row.drug_name);
    if (sensitivity) row.sensitivity = sensitivity;
    const event = hist ? time(hist.row.CHANGED_AT)!.ms
      : status === 1 ? time(e.row.START_DATE)?.ms ?? eventTime(e) : eventTime(e);
    const key = ing || str(e.row.LV_DRUG_ID) || row.drug_name.toLowerCase();
    const previous = drugs.get(key);
    if (!previous || event > previous.event || (event === previous.event && tie(hist || e, previous.source) > 0)) {
      drugs.set(key, { row, event, source: hist || e });
    }
  }
  return [...drugs].sort((a, b) => cmp(a[0], b[0])).map(x => x[1].row);
}

function linkedText(e: Entry): string {
  const spans: string[] = [];
  const re = /<ref\b[^>]*\bid\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/ref>/g;
  const narrative = str(e.item.raw.narrative);
  let m: RegExpExecArray | null;
  while ((m = re.exec(narrative))) if (m[2] === e.id) spans.push(m[3].replace(/<[^>]*>/g, ""));
  return spans.join("; ");
}

function onset(e: Entry): ProblemRow["onset"] {
  const text = str(e.row.DX_TEXT) + " " + linkedText(e);
  const tail = /\b(?:since|onset(?: in| on)?|diagnosed(?: in| on)?|dating (?:back )?to)\s+([^;\n]+)/i.exec(text)?.[1];
  if (!tail) return;
  const iso = /^(\d{4}(?:-\d{2}(?:-\d{2})?)?)\b/.exec(tail);
  if (iso) return partialDate(iso[1]);
  const us = /^(\d{1,2})\/(?:(\d{1,2})\/)?(\d{4})\b/.exec(tail);
  if (us) return partialDate(`${us[3]}-${us[1].padStart(2, "0")}${us[2] ? "-" + us[2].padStart(2, "0") : ""}`);
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const named = /^([A-Za-z]+)\.?\s+(?:(\d{1,2}),?\s+)?(\d{4})\b/.exec(tail);
  if (named) {
    const month = months.findIndex(m => m.startsWith(named[1].toLowerCase()));
    if (month >= 0) return partialDate(`${named[3]}-${String(month + 1).padStart(2, "0")}${named[2] ? "-" + named[2].padStart(2, "0") : ""}`);
  }
  return undefined;
}

function problemKey(e: Entry): string {
  const code = str(e.row.ICD10CM).toUpperCase();
  const text = str(e.row.DX_TEXT);
  if (/^N18(?:\.|$)/.test(code) || /^(?:CKD\b|chronic kidney disease\b|end[ -]stage (?:renal|kidney) disease\b)/i.test(text)) return "ckd";
  if (/^E(?:08|09|10|11|13)(?:\.|$)/.test(code)) return "diabetes:" + code.slice(0, 3);
  if (/^I(?:10|11|12|13)(?:\.|$)/.test(code)) return "hypertension";
  return code || text.toLowerCase();
}

const stages = ["G1", "G2", "G3a", "G3b", "G4", "G5"] as const;
const albums = ["A1", "A2", "A3"] as const;

function dxStage(e: Entry): ProblemRow["ckd_stage"] {
  const codeStages: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
  };
  const wording = str(e.row.DX_TEXT) + " " + linkedText(e);
  const match = /\bG(3[ab]|[1245])\b|\bstage\s+(3[ab]|[1245])\b/i.exec(wording);
  if (match) return ("G" + (match[1] || match[2]).toLowerCase()) as ProblemRow["ckd_stage"];
  return Object.hasOwn(codeStages, str(e.row.ICD10CM)) ? codeStages[str(e.row.ICD10CM)] : undefined;
}

function problems(entries: Entry[]): { problems: ProblemRow[]; confirmed: Entry[] } {
  const groups = new Map<string, Entry[]>();
  for (const e of entries) {
    if (e.row.type !== "VISIT_DX" || !str(e.row.DX_TEXT) || !oneOf(e.row.DX_STATUS, ["A", "P", "R", "H"])) continue;
    const key = problemKey(e);
    groups.set(key, [...(groups.get(key) || []), e]);
  }
  const rows: { key: string; row: ProblemRow }[] = [];
  const confirmed: Entry[] = [];
  for (const [key, members] of groups) {
    members.sort(chronological);
    const latest = members[members.length - 1];
    if (latest.row.DX_STATUS === "R") continue;
    // A new working diagnosis alone cannot establish a condition. Nor does a
    // working label erase a previously confirmed diagnosis without a refutation.
    const lastRuledOut = members.map(e => e.row.DX_STATUS).lastIndexOf("R");
    const established = members.slice(lastRuledOut + 1).filter(e => e.row.DX_STATUS === "A" || e.row.DX_STATUS === "H");
    const e = established[established.length - 1];
    if (!e) continue;
    confirmed.push(e);
    // Adverse-effect codes with no named condition describe the drug reaction only.
    if (/^(?:adverse (?:effect|reaction)|allergy) (?:of|to)\b/i.test(str(e.row.DX_TEXT))) continue;
    const row: ProblemRow = { condition: str(e.row.DX_TEXT), status: e.row.DX_STATUS === "H" ? "resolved" : "active", evidence: evidence(e) };
    if (str(e.row.ICD10CM)) row.icd10cm = str(e.row.ICD10CM);
    const onsetEntry = [...established].reverse().find(d => onset(d));
    if (onsetEntry) { row.onset = onset(onsetEntry); row.evidence = evidence(e, onsetEntry); }
    const sensitivity = sensitive(row.condition, row.icd10cm);
    if (sensitivity) row.sensitivity = sensitivity;
    rows.push({ key, row });
  }
  // The category fields are themselves structured clinician assessments. They
  // can support CKD when there is no diagnostic row, but do not overrule an
  // explicit provisional or refuted diagnosis.
  if (!groups.has("ckd")) {
    const assessment = entries.filter(e => e.row.type === "CLINIC_VISIT" && oneOf(e.row.CKD_G, stages)).sort(chronological).pop();
    if (assessment) rows.push({ key: "ckd", row: { condition: "Chronic kidney disease", status: "active", evidence: evidence(assessment) } });
  }
  const ckd = rows.find(x => x.key === "ckd");
  if (ckd) {
    const candidates = entries.filter(e => e.row.type === "CLINIC_VISIT" ||
      (e.row.type === "VISIT_DX" && problemKey(e) === "ckd" && (e.row.DX_STATUS === "A" || e.row.DX_STATUS === "H")))
      .sort((a, b) => chronological(a, b) || 0);
    let stage: { value: NonNullable<ProblemRow["ckd_stage"]>; source: Entry; priority: number } | undefined;
    let album: { value: NonNullable<ProblemRow["albuminuria"]>; source: Entry } | undefined;
    for (const e of candidates) {
      const value = e.row.type === "CLINIC_VISIT" ? (oneOf(e.row.CKD_G, stages) ? e.row.CKD_G : undefined) : dxStage(e);
      const priority = e.row.type === "CLINIC_VISIT" ? 1 : 0;
      if (value && (!stage || eventTime(e) > eventTime(stage.source) ||
        (eventTime(e) === eventTime(stage.source) && (priority > stage.priority || (priority === stage.priority && tie(e, stage.source) > 0))))) stage = { value, source: e, priority };
      const a = e.row.type === "CLINIC_VISIT" ? str(e.row.CKD_A) : /\b(A[123])\b/.exec(str(e.row.DX_TEXT) + " " + linkedText(e))?.[1];
      if (oneOf(a, albums)) album = { value: a, source: e };
    }
    if (stage) ckd.row.ckd_stage = stage.value;
    if (album) ckd.row.albuminuria = album.value;
    ckd.row.evidence = mergeEvidence(ckd.row.evidence, evidence(stage?.source, album?.source));
  }
  return { problems: rows.sort((a, b) => cmp(a.key, b.key)).map(x => x.row), confirmed };
}

function mergeEvidence(...lists: Evidence[]): Evidence {
  const refs = new Map<string, Evidence[number]>();
  for (const list of lists) for (const ref of list) refs.set(JSON.stringify([ref.item_id, ref.entry_id]), ref);
  return [...refs.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id || "", b.entry_id || ""));
}

function allergies(confirmed: Entry[], entries: Entry[]): AllergyIntoleranceRow[] {
  const rows = new Map<string, { row: AllergyIntoleranceRow; source: Entry }>();
  const namedDrugs = new Set([
    ...Object.values(brands), "isoniazid", "valproate", "valproic acid", "erythromycin", "trimethoprim", "sulfamethoxazole",
    ...entries.filter(e => e.row.type === "MED_ORDER" && e.row.MED_STATUS !== 9)
      .map(e => ingredient(str(e.row.DRUG_NAME))).filter((s): s is string => !!s),
  ]);
  for (const e of [...confirmed].sort(chronological)) {
    const text = str(e.row.DX_TEXT) + "; " + linkedText(e);
    const attribution = /(?:\bdue to|\bcaused by|\binduced by|\badverse (?:effect|reaction) (?:of|to)|\ballergy to)\s+([^;,.()]+)/i.exec(text);
    if (!attribution) continue;
    let substance = attribution[1].replace(/\s+(?:initial|subsequent) encounter.*$/i, "").trim();
    if (/^(?:a |the )?(?:drug|medication)s?$/i.test(substance)) continue;
    let supportingDrug: Entry | undefined;
    const classTests: [RegExp, RegExp][] = [
      [/penicillins?/i, /^(?:amoxicillin|ampicillin|penicillin|dicloxacillin|nafcillin|oxacillin)\b/],
      [/ACE inhibitors?|angiotensin.converting enzyme inhibitors?/i, /(?:pril)\b/],
      [/angiotensin.*receptor blockers?|\bARBs?\b/i, /(?:sartan)\b/],
      [/sulfonamide antibiotics?/i, /sulfamethoxazole|sulfadiazine/],
      [/nonsteroidal anti.inflammatory|\bNSAIDs?\b/i, /^(?:ibuprofen|naproxen|diclofenac|meloxicam|celecoxib)\b/],
      [/mineralocorticoid.*antagonists?|aldosterone.*antagonists?/i, /^(?:finerenone|spironolactone|eplerenone)\b/],
      [/loop diuretics?/i, /^(?:furosemide|bumetanide|torsemide|ethacrynic acid)\b/],
      [/thiazide/i, /^(?:hydrochlorothiazide|chlorthalidone|metolazone|indapamide)\b/],
      [/beta[ -]?(?:adrenergic )?blockers?/i, /(?:olol|carvedilol|labetalol)\b/],
      [/statins?|HMG.CoA.*inhibitors?/i, /statin\b/],
    ];
    const drugClass = classTests.find(([re]) => re.test(substance));
    const isClass = !!drugClass || /\b(?:inhibitors|antagonists|agents|antibiotics|diuretics|blockers|corticosteroids|glucocorticoids|analgesics)\b/i.test(substance);
    const normalized = ingredient(substance);
    const adverseDrugCode = /^T(?:3[6-9]|4\d|50)/i.test(str(e.row.ICD10CM));
    // "Due to" also relates diseases to causes such as dehydration or infection.
    // It establishes a drug reaction only when a drug/class is identifiable.
    if (!isClass && !adverseDrugCode && !/adverse (?:effect|reaction) (?:of|to)|allergy to/i.test(attribution[0])
      && (!normalized || !namedDrugs.has(normalized))) continue;
    if (drugClass) {
      const matches = e.item.entries.filter(d => d.row.type === "MED_ORDER" && d.row.MED_STATUS !== 9 && drugClass[1].test(ingredient(str(d.row.DRUG_NAME)) || ""));
      const distinct = new Map(matches.map(d => [ingredient(str(d.row.DRUG_NAME)), d]));
      if (distinct.size === 1) { supportingDrug = [...distinct.values()][0]; substance = ingredient(str(supportingDrug.row.DRUG_NAME))!; }
    } else if (!isClass) substance = normalized || substance;
    const manifestations = text.slice(0, attribution.index) + " " + linkedText(e);
    let reaction_type: AllergyIntoleranceRow["reaction_type"];
    if (/hives|urticaria|rash|angioedema|anaphyla\w*|bronchospasm|(?:lip|face|tongue|facial) swelling/i.test(text)) reaction_type = "hypersensitivity";
    else if (/liver (?:injury|failure)|hepatotoxic|pancreatitis|renal failure|kidney injury|hyperkalemia|agranulocytosis|rhabdomyolysis|serious adverse/i.test(manifestations)) reaction_type = "serious_adverse_event";
    else if (/nausea|vomiting|diarrh\w*|stomach upset|drowsiness|sedation|cough|constipation|dizziness|edema|side.effect/i.test(manifestations)) reaction_type = "side_effect";
    else continue; // A bare ADR code gives no defensible reaction classification.
    const row: AllergyIntoleranceRow = {
      substance, reaction_type,
      mechanism: /non[ -]?immune|not immune/i.test(text) ? "non_immune"
        : /immune[ -]mediated|IgE[ -]mediated/i.test(text) ? "immune"
        : reaction_type === "side_effect" && /nausea|stomach upset|drowsiness|sedation|constipation/i.test(manifestations) ? "non_immune" : "unknown",
      criticality: /severe|life.threatening|anaphyla\w*|angioedema|bronchospasm/i.test(text) || reaction_type === "serious_adverse_event" ? "high" : /\bmild\b/i.test(text) ? "low" : "unknown",
      reaction: str(e.row.DX_TEXT), evidence: evidence(e, supportingDrug),
    };
    const start = onset(e);
    if (start) row.onset = start;
    const sensitivity = sensitive(text, str(e.row.ICD10CM));
    if (sensitivity) row.sensitivity = sensitivity;
    const previous = rows.get(substance.toLowerCase());
    if (previous) row.evidence = mergeEvidence(previous.row.evidence, row.evidence);
    rows.set(substance.toLowerCase(), { row, source: e });
  }
  return [...rows].sort((a, b) => cmp(a[0], b[0])).map(x => x[1].row);
}

function vitals(entries: Entry[]): VitalRow[] {
  const rows: { row: VitalRow; id: string; ms: number }[] = [];
  const candidates = entries.filter(e => e.row.type === "VITAL" && num(e.row.VALUE_NUM) && num(e.row.READING_NO)
    && Number.isInteger(e.row.READING_NO) && e.row.READING_NO > 0 && time(e.row.TAKEN_AT)
    && ((oneOf(e.row.VITAL_CODE, ["BPS", "BPD"]) && e.row.UNIT_CODE === "mmHg")
      || (e.row.VITAL_CODE === "HR" && e.row.UNIT_CODE === "/min") || (e.row.VITAL_CODE === "WT" && e.row.UNIT_CODE === "kg")));
  for (const [id, members] of group(candidates, "VISIT_ID")) {
    const cells = new Map<string, Entry>();
    for (const e of members.sort(tie)) cells.set(`${str(e.row.VITAL_CODE)}:${e.row.READING_NO}`, e);
    const measurements = [...cells.values()].sort((a, b) => (a.row.READING_NO as number) - (b.row.READING_NO as number)
      || time(a.row.TAKEN_AT)!.ms - time(b.row.TAKEN_AT)!.ms || tie(a, b));
    const bp = measurements.filter(e => e.row.VITAL_CODE === "BPS" || e.row.VITAL_CODE === "BPD");
    const numbers = [...new Set(bp.map(e => e.row.READING_NO as number))].sort((a, b) => a - b);
    const first = bp.filter(e => e.row.READING_NO === numbers[0]);
    // The contract has one repeat slot; keep the last repeat when there are several.
    const repeated = numbers.length > 1 ? bp.filter(e => e.row.READING_NO === numbers[numbers.length - 1]) : [];
    const pulse = measurements.find(e => e.row.VITAL_CODE === "HR");
    const weight = measurements.find(e => e.row.VITAL_CODE === "WT");
    const used = [...first, ...repeated, pulse, weight].filter((e): e is Entry => !!e);
    const firstTime = (first.length ? first : used).map(e => time(e.row.TAKEN_AT)!).sort((a, b) => a.ms - b.ms)[0];
    if (!firstTime) continue;
    const row: VitalRow = { setting: "clinic", local_time: firstTime.local.slice(0, 16), evidence: evidence(...used) };
    for (const e of first) {
      if (e.row.VITAL_CODE === "BPS") row.systolic_mmhg = e.row.VALUE_NUM as number;
      else row.diastolic_mmhg = e.row.VALUE_NUM as number;
    }
    for (const e of repeated) {
      if (e.row.VITAL_CODE === "BPS") row.repeat_systolic_mmhg = e.row.VALUE_NUM as number;
      else row.repeat_diastolic_mmhg = e.row.VALUE_NUM as number;
    }
    if (pulse) row.pulse_bpm = pulse.row.VALUE_NUM as number;
    if (weight) {
      const kg = Math.round((weight.row.VALUE_NUM as number) * 10) / 10;
      if (Number.isFinite(kg)) row.weight_kg = kg;
    }
    rows.push({ row, id, ms: firstTime.ms });
  }
  return rows.sort((a, b) => a.ms - b.ms || cmp(a.id, b.id)).map(x => x.row);
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const entries = activeItems(items, asOf).flatMap(i => i.entries);
  const conditions = problems(entries);
  return {
    medications: medications(entries), problems: conditions.problems,
    allergies: allergies(conditions.confirmed, entries), labs: labs(entries), vitals: vitals(entries),
  };
}
