import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow, AllergyIntoleranceRow,
  LabResultRow, VitalRow, Analyte, Sensitivity,
} from "../in/views/views";

type Row = Record<string, unknown>;
type Entry = { item: FolioItem; id: string; row: Row };
type Time = { local: string; date: string; order: number; rfc?: string };
const object = (v: unknown): v is Row => v !== null && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown): string | undefined => typeof v === "string" && v.trim() ? v.trim() : undefined;
const num = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function localAt(ms: number): string {
  const p: Record<string, string> = {};
  for (const part of chicago.formatToParts(new Date(ms))) p[part.type] = part.value;
  return `${p.year.padStart(4, "0")}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}

/** No host time zone is used, including for timestamps without offsets. */
function time(value: unknown): Time | undefined {
  const s = str(value);
  if (!s) return;
  const partial = /^(\d{4})(?:-(\d{2}))?$/.exec(s);
  if (partial) {
    if (partial[2] && (+partial[2] < 1 || +partial[2] > 12)) return;
    return { local: s, date: s, order: Date.parse(`${s}${partial[2] ? "-01" : "-01-01"}T00:00:00Z`) };
  }
  const m = /^(\d{4}-\d{2}-\d{2})(?:[Tt ](\d{2}):(\d{2})(?::(\d{2})(\.\d{1,9})?)?([Zz]|[+-]\d{2}:?\d{2})?)?$/.exec(s);
  if (!m) return;
  const wall = `${m[1]}T${m[2] ?? "00"}:${m[3] ?? "00"}:${m[4] ?? "00"}`;
  const naive = Date.parse(`${wall}Z`);
  if (!Number.isFinite(naive) || new Date(naive).toISOString().slice(0, 19) !== wall) return;
  const fraction = m[5] ?? "";
  const zoned = m[6];
  if (zoned) {
    const zone = zoned.toUpperCase().replace(/^([+-]\d{2})(\d{2})$/, "$1:$2");
    const rfc = `${wall}${fraction}${zone}`;
    const instant = Date.parse(rfc);
    if (!Number.isFinite(instant)) return;
    const local = localAt(instant) + fraction;
    return { local, date: local.slice(0, 10), order: instant, rfc };
  }
  // Try both Chicago offsets. At a fall-back overlap choose the earlier instant.
  // A nonexistent spring-forward wall time is kept as written with the day's offset.
  const candidates = [naive + 5 * 3600000, naive + 6 * 3600000];
  const instant = candidates.find(v => localAt(v) === wall);
  const offsetMinutes = instant !== undefined
    ? (naive - instant) / 60000
    : (Date.parse(`${localAt(naive + 12 * 3600000)}Z`) - (naive + 12 * 3600000)) / 60000;
  const abs = Math.abs(offsetMinutes);
  const offset = `${offsetMinutes < 0 ? "-" : "+"}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
  const rfc = `${wall}${fraction}${offset}`;
  return { local: m[2] ? wall + fraction : m[1], date: m[1], order: Date.parse(rfc), ...(m[2] ? { rfc } : {}) };
}

function evidence(...entries: (Entry | undefined)[]): Evidence {
  const seen = new Set<string>();
  return entries.filter((e): e is Entry => !!e).sort((a, b) => cmp(a.item.id, b.item.id) || cmp(a.id, b.id))
    .filter(e => { const k = JSON.stringify([e.item.id, e.id]); if (seen.has(k)) return false; seen.add(k); return true; })
    .map(e => ({ item_id: e.item.id, entry_id: e.id }));
}

function tie(a: Entry, b: Entry): number {
  return (time(a.item.recorded)?.order ?? 0) - (time(b.item.recorded)?.order ?? 0)
    || cmp(a.item.id, b.item.id) || cmp(a.id, b.id);
}

function activeItems(items: FolioItem[], asOf: string): FolioItem[] {
  if (!Array.isArray(items) || !/^\d{4}-\d{2}-\d{2}$/.test(asOf) || !time(asOf)) return [];
  const eligible = items.filter(i => object(i) && str(i.id) && str(i.issuer)
    && !!time(i.recorded) && time(i.recorded)!.date <= asOf);
  const removed = new Set<string>();
  const key = (issuer: string, id: string) => JSON.stringify([issuer, id]);
  // All eligible replacement edges remain effective, even when the replacing item
  // is itself replaced/retracted. Thus an older version cannot be resurrected.
  for (const i of eligible) {
    for (const refs of [i.supersedes, i.retracts]) {
      if (Array.isArray(refs)) for (const id of refs) if (typeof id === "string") removed.add(key(i.issuer, id));
    }
  }
  return eligible.filter(i => !removed.has(key(i.issuer, i.id)))
    .sort((a, b) => time(a.recorded)!.order - time(b.recorded)!.order || cmp(a.id, b.id));
}

function entriesOf(items: FolioItem[]): Entry[] {
  return items.flatMap(item => object(item.payload)
    ? Object.keys(item.payload).sort(cmp).filter(id => object(item.payload[id]))
      .map(id => ({ item, id, row: item.payload[id] as Row })) : []);
}

function sameItem(entries: Entry[], entry: Entry, type: string, field: string, id: unknown): Entry | undefined {
  if (!str(id)) return;
  return entries.find(e => e.item === entry.item && e.row.type === type && e.row[field] === id);
}

function visitOf(entries: Entry[], entry: Entry): Entry | undefined {
  return sameItem(entries, entry, "CLINIC_VISIT", "VISIT_ID", entry.row.VISIT_ID);
}

function visitTime(entries: Entry[], entry: Entry): number {
  return time(visitOf(entries, entry)?.row.VISIT_AT)?.order ?? time(entry.item.effective)?.order ?? time(entry.item.recorded)?.order ?? 0;
}

const labCodes: Record<string, [Analyte, string, string]> = {
  "LK-CREAT": ["creatinine", "mg/dL", "mg/dL"],
  "LK-EGFR09N": ["egfr", "mL/min/1.73m2", "mL/min/1.73m2"],
  "LK-EGFR21": ["egfr", "mL/min/1.73m2", "mL/min/1.73m2"],
  "LK-NA": ["sodium", "mmol/L", "mmol/L"],
  "LK-K": ["potassium", "mmol/L", "mmol/L"],
  "LK-GLU": ["glucose", "mg/dL", "mg/dL"],
  "LK-A1C": ["a1c", "%", "%"],
  "LK-UACR": ["uacr", "mg/g", "mg/g"],
  "LK-WBC": ["wbc", "K/uL", "10*3/uL"],
  "LK-HGB": ["hemoglobin", "g/dL", "g/dL"],
  "LK-PLT": ["platelets", "K/uL", "10*3/uL"],
  "LK-CHOL": ["cholesterol", "mg/dL", "mg/dL"],
  "LK-TRIG": ["triglycerides", "mg/dL", "mg/dL"],
  "LK-HDL": ["hdl", "mg/dL", "mg/dL"],
  "LK-LDLC": ["ldl", "mg/dL", "mg/dL"],
};

function reportedValue(value: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const s = str(value)?.replace(/≤/g, "<=").replace(/≥/g, ">=");
  const m = s && /^(<=|>=|<|>)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)$/.exec(s);
  if (!m || !Number.isFinite(Number(m[2]))) return;
  return { value: Number(m[2]), ...(m[1] ? { comparator: m[1] as LabResultRow["comparator"] } : {}) };
}

function labs(entries: Entry[]): LabResultRow[] {
  const groups = new Map<string, Entry[]>();
  for (const e of entries) if (e.row.type === "LAB_RESULT" && str(e.row.RESULT_ID)) {
    const id = e.row.RESULT_ID as string;
    groups.set(id, [...(groups.get(id) ?? []), e]);
  }
  const rank: Record<string, number> = { P: 1, F: 2, A: 3, C: 4, X: 4 };
  const rows: LabResultRow[] = [];
  for (const copies of groups.values()) {
    copies.sort((a, b) => (rank[str(a.row.RESULT_STATUS) ?? ""] ?? 0) - (rank[str(b.row.RESULT_STATUS) ?? ""] ?? 0) || tie(a, b));
    const e = copies[copies.length - 1], r = e.row;
    if (!["P", "F", "A"].includes(str(r.RESULT_STATUS) ?? "")) continue;
    const code = str(r.TEST_CODE), definition = code && Object.hasOwn(labCodes, code) ? labCodes[code] : undefined;
    if (!definition || r.UNIT_CODE !== definition[1]) continue;
    const order = sameItem(entries, e, "LAB_ORDER", "ORDER_ID", r.ORDER_ID);
    if (!order || ![1, 2, 3, 4].includes(order.row.ORDER_STATUS as number)) continue;
    if (entries.some(o => o.row.type === "LAB_ORDER" && o.row.ORDER_ID === r.ORDER_ID && o.row.ORDER_STATUS === 9)) continue;
    const req = sameItem(entries, order, "LAB_REQ", "REQ_ID", order.row.REQ_ID);
    const collected = time(req?.row.COLLECTED_AT)?.rfc;
    const parsed = reportedValue(r.VALUE_TEXT);
    if (!req || !collected || !parsed) continue;
    const result: LabResultRow = {
      analyte: definition[0], ...parsed, unit: definition[2], collected,
      status: r.RESULT_STATUS === "P" ? "preliminary" : "final",
      evidence: evidence(...copies, order, req),
    };
    if (str(r.LOINC)) result.loinc = str(r.LOINC);
    if (result.analyte === "egfr") {
      const comment = str(r.COMMENT_TEXT) ?? "";
      result.egfr_equation = /CKD[ -]?EPI\s*2021/i.test(comment) ? "ckd-epi-2021"
        : /CKD[ -]?EPI\s*2009/i.test(comment) ? "ckd-epi-2009"
        : /\bMDRD\b/i.test(comment) ? "mdrd"
        : code === "LK-EGFR21" ? "ckd-epi-2021" : "ckd-epi-2009";
    }
    rows.push(result);
  }
  return rows.sort((a, b) => time(a.collected)!.order - time(b.collected)!.order || cmp(a.analyte, b.analyte)
    || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

// Names only: product-level RxNorm codes are deliberately never promoted to IN codes.
const brands: Record<string, string> = {
  kerendia: "finerenone", farxiga: "dapagliflozin", jardiance: "empagliflozin", invokana: "canagliflozin",
  lisinopril: "lisinopril", zestril: "lisinopril", prinivil: "lisinopril", cozaar: "losartan",
  diovan: "valsartan", benicar: "olmesartan", norvasc: "amlodipine", lasix: "furosemide",
  aldactone: "spironolactone", inspra: "eplerenone", lipitor: "atorvastatin", crestor: "rosuvastatin",
  glucophage: "metformin", ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide",
  trulicity: "dulaglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  "ventolin hfa": "albuterol", ventolin: "albuterol", proair: "albuterol", proventil: "albuterol",
  keflex: "cephalexin", amoxil: "amoxicillin", tylenol: "acetaminophen", advil: "ibuprofen",
  seroquel: "quetiapine", zoloft: "sertraline", prozac: "fluoxetine", lexapro: "escitalopram",
  wellbutrin: "bupropion", subutex: "buprenorphine", suboxone: "buprenorphine / naloxone",
  pepcid: "famotidine", zyrtec: "cetirizine", synthroid: "levothyroxine",
  lantus: "insulin glargine", humalog: "insulin lispro", novolog: "insulin aspart",
};

function ingredient(name: unknown): string | undefined {
  let s = str(name)?.toLowerCase();
  if (!s) return;
  s = s.replace(/\([^)]*\)/g, " ").replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|µg|g|units?|iu|ml|%)(?:\b|(?=\s|$))[\s\S]*$/, "")
    .replace(/\b(?:tablets?|capsules?|solution|suspension|injection|injectable|inhaler|cream|ointment|patch|oral|subcutaneous|intravenous|extended[ -]release|delayed[ -]release|immediate[ -]release|film[ -]coated|er|xr|sr|dr)\b/g, " ")
    .replace(/\b(?:hydrochloride|hcl|hydrobromide|besylate|maleate|tartrate|succinate|fumarate|mesylate|trihydrate|dihydrate|monohydrate)\b/g, " ")
    .replace(/\s+/g, " ").trim();
  // These are salts of a named ingredient; do not strip sodium/potassium from
  // electrolyte medicines such as sodium bicarbonate or potassium chloride.
  s = s.replace(/^(losartan|diclofenac) potassium$/, "$1")
    .replace(/^(levothyroxine|naproxen|diclofenac|pravastatin) sodium$/, "$1")
    .replace(/^(atorvastatin|rosuvastatin) calcium$/, "$1")
    .replace(/^(albuterol|salbutamol|morphine|hydroxychloroquine) sulfate$/, "$1")
    .replace(/^(codeine|sitagliptin|clindamycin) phosphate$/, "$1");
  return (Object.hasOwn(brands, s) ? brands[s] : s) || undefined;
}

function sensitive(text: string, code = ""): Sensitivity[] | undefined {
  const tags: Sensitivity[] = [];
  if (/^F(?:1\d)/i.test(code) || /\b(?:alcohol|opioid|substance|tobacco|cannabis|cocaine) (?:use disorder|dependence|abuse)\b|\bbuprenorphine\b/i.test(text)) tags.push("substance-use");
  if (/^F(?:[2-9]\d|0\d)/i.test(code) || /\b(?:bipolar|schizophren\w*|depress\w*|anxiety|panic disorder|post[- ]traumatic stress|quetiapine|sertraline|fluoxetine|escitalopram|olanzapine|risperidone)\b/i.test(text)) tags.push("mental-health");
  if (/^(?:O\d|Z3[2-9]|Z30|N9[7-8])/i.test(code) || /\b(?:pregnan\w*|contracepti\w*|fertility|infertility|erectile dysfunction|ethinyl estradiol)\b/i.test(text)) tags.push("sexual-reproductive-health");
  if (/^(?:B2[0-4]|A5\d|A6[0-4]|Z21)/i.test(code) || /\b(?:HIV|AIDS|chlamydia|gonorrh\w*|syphilis|genital herpes|antiretroviral|tenofovir|emtricitabine|dolutegravir|bictegravir)\b/i.test(text)) tags.push("hiv-sti");
  if (/\b(?:hereditary|inherited|genetic|BRCA[12]?|polycystic kidney|alport|sickle.cell|cystic fibrosis)\b/i.test(text) || /^Q61[.]?[23]/i.test(code)) tags.push("genetic");
  return tags.length ? tags : undefined;
}

function stopReason(r: Row): MedicationRow["stop_reason"] {
  if (r.REASON_CODE === "ADR") return "adverse_reaction";
  if (r.REASON_CODE === "PT") return "patient_choice";
  const comment = str(r.COMMENT_TEXT) ?? "";
  if (/\b(?:ineffective|not effective|no benefit|did not work)\b/i.test(comment)) return "ineffective";
  if (/\b(?:course (?:complete|completed)|completed (?:the )?(?:course|therapy)|therapy complete)\b/i.test(comment)) return "course_complete";
  if (/\b(?:switch(?:ed|ing)? to|replac(?:ed|ing) (?:by|with)|therapy changed|regimen changed)\b/i.test(comment)) return "therapy_changed";
  if (/\b(?:side effect|adverse (?:effect|reaction)|allergic reaction)\b/i.test(comment)) return "adverse_reaction";
  if (str(r.REASON_CODE) || comment) return "other";
  return;
}

function medications(entries: Entry[]): MedicationRow[] {
  const orders = new Map<string, Entry>();
  const histories = new Map<string, Entry>();
  for (const e of entries) {
    const id = str(e.row.RX_ID);
    if (!id) continue;
    if (e.row.type === "MED_ORDER") {
      const old = orders.get(id);
      if (!old || tie(old, e) < 0) orders.set(id, e);
    } else if (e.row.type === "MED_STATUS_HIST" && time(e.row.CHANGED_AT)) {
      const old = histories.get(id);
      if (!old || time(e.row.CHANGED_AT)!.order - time(old.row.CHANGED_AT)!.order > 0
        || (time(e.row.CHANGED_AT)!.order === time(old.row.CHANGED_AT)!.order && tie(old, e) < 0)) histories.set(id, e);
    }
  }
  const chosen = new Map<string, { row: MedicationRow; at: number; event: Entry }>();
  for (const [id, e] of orders) {
    const r = e.row, h = histories.get(id), status = h ? h.row.NEW_STATUS : r.MED_STATUS;
    if (r.MED_STATUS === 9 || status === 9 || ![1, 2, 3].includes(status as number) || !str(r.DRUG_NAME)) continue;
    const drug = ingredient(r.DRUG_NAME);
    const date = h ? time(h.row.CHANGED_AT)?.date : status === 1 ? time(r.START_DATE)?.date : undefined;
    const row: MedicationRow = {
      drug_name: r.DRUG_NAME as string, status: status === 1 ? "active" : status === 2 ? "stopped" : "held",
      patient_reported: false, evidence: evidence(e, h),
    };
    if (drug) row.ingredient = drug;
    if (date) row.status_since = date;
    if (num(r.DOSE_QTY) && ["mg", "mcg", "unit", "mL"].includes(str(r.DOSE_UNIT) ?? "")) {
      row.dose = { value: r.DOSE_QTY, unit: r.DOSE_UNIT === "unit" ? "units" : r.DOSE_UNIT as "mg" | "mcg" | "mL" };
    }
    if (["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(str(r.FREQ_CODE) ?? "")) row.frequency = r.FREQ_CODE as MedicationRow["frequency"];
    if (h && str(h.row.COMMENT_TEXT)) row.status_reason_text = h.row.COMMENT_TEXT as string;
    if (status === 2 && h) { const reason = stopReason(h.row); if (reason) row.stop_reason = reason; }
    const sensitivity = sensitive(`${drug ?? ""} ${row.drug_name}`);
    if (sensitivity) row.sensitivity = sensitivity;
    const at = h ? time(h.row.CHANGED_AT)!.order : time(r.START_DATE)?.order ?? visitTime(entries, e);
    const key = drug ?? str(r.LV_DRUG_ID) ?? row.drug_name.toLowerCase();
    const old = chosen.get(key), event = h ?? e;
    if (!old || at > old.at || (at === old.at && tie(old.event, event) < 0)) chosen.set(key, { row, at, event });
  }
  return [...chosen.values()].map(c => c.row).sort((a, b) => cmp(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name));
}

function conditionKey(r: Row): string {
  const code = str(r.ICD10CM)?.toUpperCase() ?? "", text = str(r.DX_TEXT) ?? "";
  if (/^N18(?:\.|$)/.test(code) || /^(?:chronic kidney disease|CKD)\b/i.test(text)) return "ckd";
  if (/^E(?:08|09|10|11|13)(?:\.|$)/.test(code)) return code.slice(0, 3); // restaging/recoding diabetes
  if (/^(?:I10|I1[235])(?:\.|$)/.test(code)) return "hypertension";
  if (/^J45(?:\.|$)/.test(code)) return "asthma";
  if (/^N17(?:\.|$)/.test(code)) return "aki";
  return code || text.toLowerCase();
}

function stageFromDiagnosis(r: Row): ProblemRow["ckd_stage"] {
  const stages: Record<string, ProblemRow["ckd_stage"]> = {
    "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5",
  };
  const code = str(r.ICD10CM) ?? "";
  if (Object.hasOwn(stages, code)) return stages[code];
  const match = /\b(?:G|stage\s*)(1|2|3a|3b|4|5)\b/i.exec(str(r.DX_TEXT) ?? "");
  return match ? `G${match[1].toLowerCase()}` as ProblemRow["ckd_stage"] : undefined;
}

const drugClasses: [RegExp, RegExp][] = [
  [/\bpenicillins?\b/i, /^(?:amoxicillin|ampicillin|penicillin|dicloxacillin|nafcillin|oxacillin)\b/i],
  [/\bcephalosporins?\b/i, /^cef|^ceph/i],
  [/\b(?:ACE inhibitors?|angiotensin.converting.enzyme inhibitors?)\b/i, /^(?:lisinopril|enalapril|ramipril|benazepril|captopril|perindopril)\b/i],
  [/\b(?:ARBs?|angiotensin(?: II)? receptor blockers?)\b/i, /^(?:losartan|valsartan|olmesartan|irbesartan|candesartan|telmisartan)\b/i],
  [/\b(?:NSAIDs?|nonsteroidal anti.inflammatory)\b/i, /^(?:ibuprofen|naproxen|diclofenac|meloxicam|celecoxib|indomethacin)\b/i],
];

/** Only an explicit drug-attributed diagnosis creates an intolerance here.
 * A medication hold for an abnormal lab, by itself, does not diagnose a reaction. */
function allergyFromDiagnosis(e: Entry, entries: Entry[]): AllergyIntoleranceRow | undefined {
  const text = str(e.row.DX_TEXT) ?? "";
  const adverseCode = /^T(?:3[6-9]|4\d|50)/i.test(str(e.row.ICD10CM) ?? "") && /adverse effect/i.test(text);
  let match = /(?:adverse (?:effect|reaction) (?:of|to)|allergy to|allergic reaction to)\s+(.+?)(?:,\s*(?:initial|subsequent) encounter|,\s*sequela|$)/i.exec(text);
  if (!match) match = /(?:due to|caused by|secondary to)\s+(.+)$/i.exec(text);
  let substance = match?.[1]?.trim();
  if (!substance) {
    const induced = /^(.+?)[ -]induced\s+(.+)$/i.exec(text);
    if (induced) substance = induced[1].trim();
  }
  if (!substance || /^(?:drug|medication|unspecified|other)(?:\s|$)/i.test(substance)) return;
  const sameMeds = entries.filter(m => m.item === e.item && m.row.type === "MED_ORDER" && m.row.MED_STATUS !== 9);
  const normalized = ingredient(substance);
  const cls = drugClasses.find(([pattern]) => pattern.test(substance!));
  const medication = sameMeds.find(m => ingredient(m.row.DRUG_NAME) === normalized);
  const explicit = adverseCode || /adverse (?:effect|reaction)|allerg(?:y|ic reaction) to/i.test(text);
  const knownDrug = [...Object.keys(brands), ...Object.values(brands), "amoxicillin", "erythromycin", "isoniazid", "valproate", "finerenone", "trimethoprim", "sulfamethoxazole"].includes(normalized ?? "");
  if (!explicit && !cls && !medication && !knownDrug) return;
  let support: Entry | undefined = medication;
  if (cls) {
    const matches = sameMeds.filter(m => cls[1].test(ingredient(m.row.DRUG_NAME) ?? ""));
    const names = new Set(matches.map(m => ingredient(m.row.DRUG_NAME)));
    if (names.size === 1) { substance = ingredient(matches[0].row.DRUG_NAME)!; support = matches[0]; }
  } else if (normalized && !/\b(?:agents|drugs|antibiotics|inhibitors|blockers)\b/i.test(substance)) substance = normalized;
  const hypersensitivity = /\b(?:rash|urticaria|hives|angioedema|anaphylax\w*|bronchospasm|(?:lip|face|facial|tongue) swelling)\b/i.test(text);
  const serious = /\b(?:pancreatitis|liver (?:injury|failure)|hepatitis|renal failure|kidney injury|agranulocytosis|rhabdomyolysis|severe hypoglycemia)\b/i.test(text);
  const predictable = /\b(?:nausea|vomiting|diarrh\w*|stomach upset|drowsiness|sedation|cough|hyperkalemia|hypokalemia)\b/i.test(text);
  const reaction = text.replace(/\s*(?:due to|caused by|secondary to)\s+.*$/i, "");
  const row: AllergyIntoleranceRow = {
    substance, reaction_type: hypersensitivity ? "hypersensitivity" : serious ? "serious_adverse_event" : "side_effect",
    mechanism: /\b(?:non[- ]immune|non[- ]immunologic)\b/i.test(text) ? "non_immune"
      : /\b(?:immune[- ]mediated|IgE[- ]mediated)\b/i.test(text) ? "immune" : predictable ? "non_immune" : "unknown",
    criticality: /\b(?:severe|life[- ]threatening)\b/i.test(text) ? "high" : /\bmild\b/i.test(text) ? "low" : "unknown",
    evidence: evidence(e, support),
  };
  if (!/^adverse (?:effect|reaction)\b/i.test(reaction)) row.reaction = reaction;
  const sensitivity = sensitive(text, str(e.row.ICD10CM));
  if (sensitivity) row.sensitivity = sensitivity;
  return row;
}

function problemsAndAllergies(entries: Entry[]): Pick<ViewRows, "problems" | "allergies"> {
  const groups = new Map<string, Entry[]>();
  const clinicalOrder = (a: Entry, b: Entry) => visitTime(entries, a) - visitTime(entries, b) || tie(a, b);
  for (const e of entries) if (e.row.type === "VISIT_DX" && str(e.row.DX_TEXT) && str(e.row.ICD10CM)) {
    if (!["A", "P", "R", "H"].includes(str(e.row.DX_STATUS) ?? "")) continue;
    const key = conditionKey(e.row);
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  const problems: ProblemRow[] = [], allergies = new Map<string, { row: AllergyIntoleranceRow; entry: Entry }>();
  for (const [key, history] of groups) {
    history.sort(clinicalOrder);
    const latest = history[history.length - 1];
    if (latest.row.DX_STATUS === "R") continue;
    // A provisional entry cannot create a diagnosis. It also cannot turn a
    // previously confirmed diagnosis into a new, unrecorded resolved state.
    const lastRefutation = history.reduce((last, d, index) => d.row.DX_STATUS === "R" ? index : last, -1);
    const confirmed = history.slice(lastRefutation + 1).filter(e => e.row.DX_STATUS === "A" || e.row.DX_STATUS === "H");
    const e = latest.row.DX_STATUS === "P" ? confirmed[confirmed.length - 1] : latest;
    if (!e) continue;
    const r = e.row, code = str(r.ICD10CM)!;
    const allergy = allergyFromDiagnosis(e, entries);
    if (allergy) {
      const old = allergies.get(allergy.substance.toLowerCase());
      if (!old || clinicalOrder(old.entry, e) < 0) allergies.set(allergy.substance.toLowerCase(), { row: allergy, entry: e });
    }
    if (/^T(?:3[6-9]|4\d|50)/.test(code) && /^adverse (?:effect|reaction)\b/i.test(r.DX_TEXT as string)) continue;
    const row: ProblemRow = {
      condition: r.DX_TEXT as string, icd10cm: code, status: r.DX_STATUS === "H" ? "resolved" : "active", evidence: evidence(e),
    };
    if (key === "ckd") {
      type Assessment = { at: number; entry: Entry; stage?: ProblemRow["ckd_stage"]; albumin?: ProblemRow["albuminuria"] };
      const assessments: Assessment[] = [];
      for (const d of confirmed) {
        const albumin = /\b(A[123])\b/i.exec(str(d.row.DX_TEXT) ?? "")?.[1].toUpperCase() as ProblemRow["albuminuria"];
        assessments.push({ at: visitTime(entries, d), entry: d, stage: stageFromDiagnosis(d.row), albumin });
      }
      for (const v of entries) if (v.row.type === "CLINIC_VISIT") {
        const stage = ["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(str(v.row.CKD_G) ?? "") ? v.row.CKD_G as ProblemRow["ckd_stage"] : undefined;
        const albumin = ["A1", "A2", "A3"].includes(str(v.row.CKD_A) ?? "") ? v.row.CKD_A as ProblemRow["albuminuria"] : undefined;
        if (stage || albumin) assessments.push({ at: time(v.row.VISIT_AT)?.order ?? time(v.item.effective)?.order ?? 0, entry: v, stage, albumin });
      }
      assessments.sort((a, b) => a.at - b.at || (a.entry.row.type === b.entry.row.type ? tie(a.entry, b.entry) : a.entry.row.type === "CLINIC_VISIT" ? 1 : -1));
      let stageEvidence: Entry | undefined, albuminEvidence: Entry | undefined;
      for (const a of assessments) {
        if (a.stage) { row.ckd_stage = a.stage; stageEvidence = a.entry; }
        if (a.albumin) { row.albuminuria = a.albumin; albuminEvidence = a.entry; }
      }
      row.evidence = evidence(e, stageEvidence, albuminEvidence);
    }
    const sensitivity = sensitive(row.condition, code);
    if (sensitivity) row.sensitivity = sensitivity;
    problems.push(row);
  }
  return {
    problems: problems.sort((a, b) => cmp(a.icd10cm ?? a.condition, b.icd10cm ?? b.condition)),
    allergies: [...allergies.values()].map(a => a.row).sort((a, b) => cmp(a.substance, b.substance)),
  };
}

function vitals(entries: Entry[]): VitalRow[] {
  const groups = new Map<string, Entry[]>();
  for (const e of entries) {
    const r = e.row;
    if (r.type !== "VITAL" || !str(r.VISIT_ID) || !num(r.VALUE_NUM) || !num(r.READING_NO)
      || !Number.isInteger(r.READING_NO) || r.READING_NO < 1 || !time(r.TAKEN_AT)?.rfc) continue;
    const expected = r.VITAL_CODE === "BPS" || r.VITAL_CODE === "BPD" ? "mmHg" : r.VITAL_CODE === "HR" ? "/min" : r.VITAL_CODE === "WT" ? "kg" : undefined;
    if (!expected || r.UNIT_CODE !== expected) continue;
    groups.set(r.VISIT_ID as string, [...(groups.get(r.VISIT_ID as string) ?? []), e]);
  }
  const rows: VitalRow[] = [];
  for (const measurements of groups.values()) {
    const unique = new Map<string, Entry>();
    for (const e of measurements) {
      const key = `${e.row.VITAL_CODE}:${e.row.READING_NO}`, old = unique.get(key);
      if (!old || tie(old, e) < 0) unique.set(key, e);
    }
    const sorted = [...unique.values()].sort((a, b) => (a.row.READING_NO as number) - (b.row.READING_NO as number)
      || time(a.row.TAKEN_AT)!.order - time(b.row.TAKEN_AT)!.order || tie(a, b));
    const bp = sorted.filter(e => e.row.VITAL_CODE === "BPS" || e.row.VITAL_CODE === "BPD");
    const firstNumber = bp[0]?.row.READING_NO;
    const first = bp.filter(e => e.row.READING_NO === firstNumber);
    // The view has room for one repeat; keep the last repeat if there were several.
    const lastNumber = bp[bp.length - 1]?.row.READING_NO;
    const repeat = lastNumber !== firstNumber ? bp.filter(e => e.row.READING_NO === lastNumber) : [];
    const pulse = sorted.find(e => e.row.VITAL_CODE === "HR"), weight = sorted.find(e => e.row.VITAL_CODE === "WT");
    const anchor = (first.length ? first : sorted).slice().sort((a, b) => time(a.row.TAKEN_AT)!.order - time(b.row.TAKEN_AT)!.order || tie(a, b))[0];
    const row: VitalRow = { setting: "clinic", local_time: time(anchor.row.TAKEN_AT)!.local.slice(0, 16), evidence: evidence(...first, ...repeat, pulse, weight) };
    for (const e of first) if (e.row.VITAL_CODE === "BPS") row.systolic_mmhg = e.row.VALUE_NUM as number; else row.diastolic_mmhg = e.row.VALUE_NUM as number;
    for (const e of repeat) if (e.row.VITAL_CODE === "BPS") row.repeat_systolic_mmhg = e.row.VALUE_NUM as number; else row.repeat_diastolic_mmhg = e.row.VALUE_NUM as number;
    if (pulse) row.pulse_bpm = pulse.row.VALUE_NUM as number;
    if (weight) row.weight_kg = Math.round((weight.row.VALUE_NUM as number) * 10) / 10;
    rows.push(row);
  }
  return rows.sort((a, b) => cmp(a.local_time, b.local_time) || cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence)));
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const entries = entriesOf(activeItems(items, asOf));
  return { medications: medications(entries), ...problemsAndAllergies(entries), labs: labs(entries), vitals: vitals(entries) };
}
