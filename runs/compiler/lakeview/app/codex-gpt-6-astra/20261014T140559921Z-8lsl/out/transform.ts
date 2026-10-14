import type {
  FolioItem, ViewRows, Evidence, MedicationRow, ProblemRow,
  AllergyIntoleranceRow, LabResultRow, VitalRow, Analyte,
} from "../in/views/views";

type Data = Record<string, unknown>;
type Time = { at: number; day: string; local: string; timestamp: string };
type Item = { id: string; issuer: string; data: Data; recorded: Time };
type Entry = { data: Data; item: Item; id: string };
type ContactEntry = { entry: Entry; visit: Entry; time: Time };

const object = (x: unknown): x is Data => x !== null && typeof x === "object" && !Array.isArray(x);
const str = (x: unknown): string | undefined => typeof x === "string" && x.trim() ? x.trim() : undefined;
const num = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const cmp = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const key = (...parts: string[]): string => JSON.stringify(parts);

const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function wall(at: number): string {
  const parts: Record<string, string> = {};
  for (const p of chicago.formatToParts(new Date(at))) parts[p.type] = p.value;
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

function partialDate(x: unknown): string | undefined {
  const s = str(x);
  if (!s || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(s)) return undefined;
  const y = Number(s.slice(0, 4));
  const m = s.length >= 7 ? Number(s.slice(5, 7)) : 1;
  const d = s.length === 10 ? Number(s.slice(8, 10)) : 1;
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return y > 0 && m >= 1 && m <= 12 && d >= 1 && d <= days[m - 1] ? s : undefined;
}

// Never let the host machine's time zone interpret an offset-free wall clock.
function time(x: unknown): Time | undefined {
  const s = str(x);
  if (!s) return undefined;
  const m = /^(\d{4}-\d{2}-\d{2})[Tt ](\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?([Zz]|[+-]\d{2}:\d{2})?$/.exec(s);
  if (!m || !partialDate(m[1]) || +m[2] > 23 || +m[3] > 59 || +(m[4] ?? 0) > 59) return undefined;
  if (m[6] && m[6].toUpperCase() !== "Z" && (+m[6].slice(1, 3) > 23 || +m[6].slice(4) > 59)) return undefined;
  const local = `${m[1]}T${m[2]}:${m[3]}:${m[4] ?? "00"}`;
  const base = local + (m[5] ?? "");
  let at = Date.parse(base + (m[6]?.toUpperCase() ?? "Z"));
  if (!Number.isFinite(at)) return undefined;
  if (!m[6]) {
    const target = Date.parse(local + "Z");
    // Solve local = UTC + Chicago's offset, including daylight saving time.
    for (let i = 0; i < 3; i++) {
      const delta = target - Date.parse(wall(at) + "Z");
      if (!delta) break;
      at += delta;
    }
  }
  const displayed = m[6] ? wall(at) : local;
  return { at, day: displayed.slice(0, 10), local: displayed.slice(0, 16),
    timestamp: m[6] ? base + m[6].toUpperCase() : new Date(at).toISOString() };
}

function evidence(...entries: (Entry | undefined)[]): Evidence {
  const seen = new Set<string>();
  const result: Evidence = [];
  for (const e of entries) {
    if (!e) continue;
    const k = key(e.item.id, e.id);
    if (!seen.has(k)) { seen.add(k); result.push({ item_id: e.item.id, entry_id: e.id }); }
  }
  return result.sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id ?? "", b.entry_id ?? ""));
}

function entryOrder(a: Entry, b: Entry): number {
  return a.item.recorded.at - b.item.recorded.at || cmp(a.item.issuer, b.item.issuer)
    || cmp(a.item.id, b.item.id) || cmp(a.id, b.id);
}

function contactOrder(a: ContactEntry, b: ContactEntry): number {
  return a.time.at - b.time.at || entryOrder(a.entry, b.entry);
}

function currentItems(input: unknown, asOf: string): Item[] {
  if (!Array.isArray(input)) return [];
  const scope: Item[] = [];
  for (const data of input) {
    if (!object(data)) continue;
    const id = str(data.id), issuer = str(data.issuer), recorded = time(data.recorded);
    if (id && issuer && recorded && recorded.day <= asOf) scope.push({ id, issuer, recorded, data });
  }
  const removed = new Set<string>();
  // Process edges from ALL in-scope items. Retracting a replacement does not
  // resurrect the replaced item; a whole chain remains superseded transitively.
  for (const i of scope) for (const field of ["supersedes", "retracts"]) {
    const ids = i.data[field];
    if (Array.isArray(ids)) for (const id of ids) if (typeof id === "string") removed.add(key(i.issuer, id));
  }
  return scope.filter(i => !removed.has(key(i.issuer, i.id)))
    .sort((a, b) => a.recorded.at - b.recorded.at || cmp(a.issuer, b.issuer) || cmp(a.id, b.id));
}

const LABS: Record<string, [Analyte, string, string]> = {
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

function reportedNumber(x: unknown): { value: number; comparator?: LabResultRow["comparator"] } | undefined {
  const s = str(x);
  const m = s && /^(<=|>=|<|>|≤|≥)?\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/.exec(s);
  if (!m) return undefined;
  const value = Number(m[2]);
  if (!Number.isFinite(value)) return undefined;
  const comparator = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1];
  return comparator ? { value, comparator: comparator as LabResultRow["comparator"] } : { value };
}

function equation(data: Data): LabResultRow["egfr_equation"] {
  const note = str(data.COMMENT_TEXT) ?? "";
  // Method text wins over both the local code and the historically incorrect LOINC.
  const method = /calculated (?:by|using|with)\s+([^.;]+)/i.exec(note)?.[1] ?? note;
  const stated = /\bMDRD\b|\bCKD[\s-]*EPI\b[^.;]*?\b(?:2021|2009)\b|\b(?:2021|2009)\b[^.;]*?\bCKD[\s-]*EPI\b/i.exec(method)?.[0];
  if (stated) return /MDRD/i.test(stated) ? "mdrd" : /2021/.test(stated) ? "ckd-epi-2021" : "ckd-epi-2009";
  if (/\b(?:Schwartz|Cockcroft|BIS[ -]?1|FAS)\b|(?:equation|method) (?:unknown|not stated)/i.test(method)) return "unknown";
  return data.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : "ckd-epi-2009";
}

type LabCopy = { entry: Entry; order: Entry; req: Entry; collected: Time };
function labRank(x: LabCopy): number {
  if (x.order.data.ORDER_STATUS === 9 || x.order.data.ORDER_STATUS === 5) return 6;
  return ({ P: 1, F: 2, A: 3, C: 4, X: 4 } as Record<string, number>)[str(x.entry.data.RESULT_STATUS) ?? ""] ?? 5;
}

function labsFrom(copies: LabCopy[]): LabResultRow[] {
  const latest = new Map<string, LabCopy>();
  for (const c of copies) {
    const id = str(c.entry.data.RESULT_ID);
    if (!id) continue;
    const k = key(c.entry.item.issuer, id), previous = latest.get(k);
    const statusAt = (v: LabCopy) => time(v.entry.data.STATUS_CHANGED_AT)?.at ?? time(v.entry.data.RESULTED_AT)?.at ?? v.entry.item.recorded.at;
    if (!previous || (labRank(c) - labRank(previous) || statusAt(c) - statusAt(previous) || entryOrder(c.entry, previous.entry)) > 0) latest.set(k, c);
  }
  const output: LabResultRow[] = [];
  for (const c of latest.values()) {
    const d = c.entry.data, code = str(d.TEST_CODE);
    const spec = code && Object.hasOwn(LABS, code) ? LABS[code] : undefined;
    const n = reportedNumber(d.VALUE_TEXT);
    if (!spec || !n || d.UNIT_CODE !== spec[1] || ![1, 2, 3, 4].includes(c.order.data.ORDER_STATUS as number)
      || !["P", "F", "A"].includes(d.RESULT_STATUS as string)) continue;
    const row: LabResultRow = { analyte: spec[0], ...n, unit: spec[2], collected: c.collected.timestamp,
      status: d.RESULT_STATUS === "P" ? "preliminary" : "final", evidence: evidence(c.entry, c.order, c.req) };
    if (row.analyte === "egfr") row.egfr_equation = equation(d);
    const loinc = str(d.LOINC);
    if (loinc) row.loinc = loinc;
    output.push(row);
  }
  return output;
}

// These are name translations, never product-CUI to ingredient-CUI guesses.
const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", steglatro: "ertugliflozin",
  kerendia: "finerenone", cozaar: "losartan", diovan: "valsartan", avapro: "irbesartan",
  zestril: "lisinopril", prinivil: "lisinopril", vasotec: "enalapril", altace: "ramipril",
  norvasc: "amlodipine", lasix: "furosemide", bumex: "bumetanide", demadex: "torsemide",
  aldactone: "spironolactone", inspra: "eplerenone", glucophage: "metformin",
  lantus: "insulin glargine", basaglar: "insulin glargine", toujeo: "insulin glargine",
  humalog: "insulin lispro", novolog: "insulin aspart", tresiba: "insulin degludec",
  ozempic: "semaglutide", rybelsus: "semaglutide", wegovy: "semaglutide", trulicity: "dulaglutide",
  victoza: "liraglutide", mounjaro: "tirzepatide", zepbound: "tirzepatide",
  lipitor: "atorvastatin", crestor: "rosuvastatin", zocor: "simvastatin", zetia: "ezetimibe",
  januvia: "sitagliptin", tradjenta: "linagliptin", glipizide: "glipizide",
  lokelma: "sodium zirconium cyclosilicate", veltassa: "patiromer", renvela: "sevelamer",
};

function ingredient(name: string): string | undefined {
  let s = name.toLowerCase().replace(/[®™]/g, "").trim();
  if (/^(?:unknown|unspecified|water pill|medication|medicine|pill)(?:\b|$)/.test(s)) return undefined;
  // Remove the strength and following form, retaining numbers within drug names.
  s = s.replace(/\s+\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?\s*(?:mg|mcg|g|units?|unt|ml|%|meq)\b.*$/i, "");
  s = s.replace(/\s+(?:(?:oral|subcutaneous|extended[ -]release|delayed[ -]release|film[ -]coated)\s+)*(?:tablets?|capsules?|solution|injection|suspension|pen|vial).*$/i, "");
  s = s.replace(/\s+(?:er|xr|sr|xl|dr)$/i, "").trim();
  const parenthetical = /^(.*?)\s*\(([^)]+)\)$/.exec(s);
  if (parenthetical) {
    const a = parenthetical[1].trim(), b = parenthetical[2].trim();
    s = Object.hasOwn(BRANDS, a) ? BRANDS[a] : Object.hasOwn(BRANDS, b) ? BRANDS[b] : a;
  }
  if (Object.hasOwn(BRANDS, s)) return BRANDS[s];
  s = s.replace(/\s+(?:potassium|sodium|calcium|hydrochloride|hcl|besylate|besilate|maleate|fumarate|succinate|tartrate|carbonate|acetate)(?:\s+hydrate)?$/i, "").trim();
  return s || undefined;
}

function ingredients(name: string): (string | undefined)[] {
  const combinations: Record<string, string[]> = {
    hyzaar: ["losartan", "hydrochlorothiazide"], entresto: ["sacubitril", "valsartan"],
    synjardy: ["empagliflozin", "metformin"], xigduo: ["dapagliflozin", "metformin"],
    janumet: ["sitagliptin", "metformin"],
  };
  const simple = ingredient(name);
  if (simple && Object.hasOwn(combinations, simple)) return combinations[simple];
  const parts = name.split(/\s*(?:\+|\band\b|\/(?!\s*(?:m[lL]|[lL]|dose|tablet|actuation)\b)(?=\s*[A-Za-z]))\s*/i);
  return [...new Set(parts.map(ingredient))];
}

function stopReason(reason: unknown, comment: string | undefined): MedicationRow["stop_reason"] {
  if (reason === "ADR") return "adverse_reaction";
  if (reason === "PT") return "patient_choice";
  if (comment) {
    if (/ineffective|not (?:effective|working)|lack of (?:effect|efficacy)/i.test(comment)) return "ineffective";
    if (/replaced (?:by|with)|switch(?:ed|ing)? to|therapy chang/i.test(comment)) return "therapy_changed";
    if (/course (?:is )?(?:complete|finished)|completed (?:the )?(?:course|therapy)/i.test(comment)) return "course_complete";
    if (/patient (?:request|declin|choice)/i.test(comment)) return "patient_choice";
    if (/adverse (?:reaction|effect)|side effect/i.test(comment)) return "adverse_reaction";
  }
  return str(reason) || comment ? "other" : undefined;
}

function medicationsFrom(orders: ContactEntry[], histories: ContactEntry[]): MedicationRow[] {
  const rx = new Map<string, ContactEntry>();
  const hist = new Map<string, ContactEntry>();
  for (const c of orders) {
    const id = str(c.entry.data.RX_ID);
    if (!id) continue;
    const k = key(c.entry.item.issuer, id), prev = rx.get(k);
    if (!prev || entryOrder(c.entry, prev.entry) > 0) rx.set(k, c);
  }
  for (const c of histories) {
    const id = str(c.entry.data.RX_ID);
    if (!id || ![1, 2, 3, 9].includes(c.entry.data.NEW_STATUS as number)) continue;
    const k = key(c.entry.item.issuer, id), prev = hist.get(k);
    if (!prev || contactOrder(c, prev) > 0) hist.set(k, c);
  }
  const byDrug = new Map<string, { row: MedicationRow; event: ContactEntry }>();
  for (const [k, c] of rx) {
    const d = c.entry.data, h = hist.get(k), state = h?.entry.data.NEW_STATUS ?? d.MED_STATUS;
    // A void prescription never participates in choosing the latest ingredient.
    if (d.MED_STATUS === 9 || state === 9 || d.ROUTE === "IV") continue;
    const name = str(d.DRUG_NAME);
    if (!name) continue;
    const components = ingredients(name);
    const row: MedicationRow = { drug_name: name, status: state === 1 ? "active" : state === 2 ? "stopped" : state === 3 ? "held" : "unknown",
      patient_reported: false, evidence: evidence(c.entry, h?.entry) };
    const since = h ? h.time.day : state === 1 ? partialDate(d.START_DATE) : undefined;
    if (since) row.status_since = since;
    if (components.length === 1 && num(d.DOSE_QTY) && d.DOSE_QTY > 0 && ["mg", "mcg", "unit", "mL"].includes(d.DOSE_UNIT as string)) {
      row.dose = { value: d.DOSE_QTY, unit: d.DOSE_UNIT === "unit" ? "units" : d.DOSE_UNIT as "mg" | "mcg" | "mL" };
    }
    const f = str(d.FREQ_CODE);
    if (f) row.frequency = ["QD", "BID", "TID", "QHS", "QW", "PRN"].includes(f) ? f as MedicationRow["frequency"] : "other";
    if (h && (row.status === "held" || row.status === "stopped")) {
      const comment = str(h.entry.data.COMMENT_TEXT);
      if (comment) row.status_reason_text = comment;
      if (row.status === "stopped") {
        const reason = stopReason(h.entry.data.REASON_CODE, comment);
        if (reason) row.stop_reason = reason;
      }
    }
    // The prescription was entered at its contact; later status changes are its
    // own events. REVIEW_DATE is a plan, never an automatic restart.
    const event = h ?? c;
    for (const ing of components) {
      const drugKey = ing ?? str(d.LV_DRUG_ID) ?? name.toLowerCase();
      const prev = byDrug.get(drugKey);
      if (!prev || contactOrder(event, prev.event) > 0) byDrug.set(drugKey, { row: { ...row, ...(ing ? { ingredient: ing } : {}) }, event });
    }
  }
  return [...byDrug.values()].map(x => x.row);
}

const STAGES: Record<string, ProblemRow["ckd_stage"]> = {
  "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5", "N18.6": "G5",
};
const stage = (x: unknown): x is NonNullable<ProblemRow["ckd_stage"]> => ["G1", "G2", "G3a", "G3b", "G4", "G5"].includes(x as string);
const albumin = (x: unknown): x is NonNullable<ProblemRow["albuminuria"]> => ["A1", "A2", "A3"].includes(x as string);

function conditionKey(code: string, name: string): string {
  if (/^N18(?:\.|$)/.test(code)) return "ckd";
  // Do not merge diabetic/hypertensive CKD into the separate N18 stage entry.
  return code || name.toLowerCase().replace(/\s+/g, " ");
}

type Diagnosis = { latest: ContactEntry; assertion: ContactEntry; code: string; name: string; ckd: boolean };
function diagnosesFrom(entries: ContactEntry[]): Diagnosis[] {
  const groups = new Map<string, ContactEntry[]>();
  for (const c of entries) {
    const code = str(c.entry.data.ICD10CM), name = str(c.entry.data.DX_TEXT);
    if (!code || !name || !["A", "P", "R", "H"].includes(c.entry.data.DX_STATUS as string)) continue;
    const k = conditionKey(code, name);
    const list = groups.get(k) ?? []; list.push(c); groups.set(k, list);
  }
  const out: Diagnosis[] = [];
  for (const [k, list] of groups) {
    list.sort(contactOrder);
    const latest = list[list.length - 1];
    if (latest.entry.data.DX_STATUS === "R") continue;
    // A provisional diagnosis alone is insufficient. An earlier confirmed
    // assertion can support it, but a later rule-out cancels that assertion.
    let assertion: ContactEntry | undefined;
    for (let i = list.length - 1; i >= 0; i--) {
      const status = list[i].entry.data.DX_STATUS;
      if (status === "R") break;
      if (status === "A" || status === "H") { assertion = list[i]; break; }
    }
    if (!assertion) continue;
    out.push({ latest, assertion, code: str(latest.entry.data.ICD10CM)!, name: str(latest.entry.data.DX_TEXT)!, ckd: k === "ckd" });
  }
  return out;
}

function diagnosisStage(d: Data): ProblemRow["ckd_stage"] {
  const code = str(d.ICD10CM) ?? "";
  if (Object.hasOwn(STAGES, code)) return STAGES[code];
  const name = str(d.DX_TEXT) ?? "";
  const m = /\bG(3a|3b|[1245])\b|\bstage\s+(3a|3b|[1245])\b/i.exec(name);
  const g = m && `G${(m[1] ?? m[2]).toLowerCase()}`;
  return stage(g) ? g : undefined;
}

function problemsFrom(diagnoses: Diagnosis[], visits: ContactEntry[], sourceDiagnoses: ContactEntry[]): ProblemRow[] {
  const latestCkdCodes = new Map<string, ContactEntry>();
  for (const c of sourceDiagnoses) {
    const code = str(c.entry.data.ICD10CM);
    if (!code || !/^N18(?:\.|$)/.test(code)) continue;
    const prev = latestCkdCodes.get(code);
    if (!prev || contactOrder(c, prev) > 0) latestCkdCodes.set(code, c);
  }
  const out: ProblemRow[] = [];
  for (const dx of diagnoses) {
    // A pure drug adverse-effect T code describes the culprit, not a condition.
    if (/^T(?:3[6-9]|4\d|50)(?:\.|$)/.test(dx.code) && /^adverse effect of\b/i.test(dx.name)
      && !attribution(dx.name)?.reaction) continue;
    const row: ProblemRow = { condition: dx.name, icd10cm: dx.code,
      status: dx.assertion.entry.data.DX_STATUS === "H" ? "resolved" : "active",
      evidence: evidence(dx.latest.entry, dx.assertion.entry) };
    if (dx.ckd) {
      let g: { value: NonNullable<ProblemRow["ckd_stage"]>; c: ContactEntry } | undefined;
      let a: { value: NonNullable<ProblemRow["albuminuria"]>; c: ContactEntry } | undefined;
      for (const c of latestCkdCodes.values()) {
        const value = diagnosisStage(c.entry.data);
        if (value && ["A", "H"].includes(c.entry.data.DX_STATUS as string)
          && (!g || contactOrder(c, g.c) > 0)) g = { value, c };
      }
      for (const v of visits) {
        if (stage(v.entry.data.CKD_G) && (!g || v.time.at >= g.c.time.at)) g = { value: v.entry.data.CKD_G, c: v };
        if (albumin(v.entry.data.CKD_A) && (!a || contactOrder(v, a.c) > 0)) a = { value: v.entry.data.CKD_A, c: v };
      }
      if (g) { row.ckd_stage = g.value; row.evidence.push(...evidence(g.c.entry)); }
      if (a) { row.albuminuria = a.value; row.evidence.push(...evidence(a.c.entry)); }
      row.evidence = uniqueEvidence(row.evidence);
    }
    out.push(row);
  }
  return out;
}

function uniqueEvidence(entries: Evidence): Evidence {
  const m = new Map<string, Evidence[number]>();
  for (const e of entries) m.set(key(e.item_id, e.entry_id ?? ""), e);
  return [...m.values()].sort((a, b) => cmp(a.item_id, b.item_id) || cmp(a.entry_id ?? "", b.entry_id ?? ""));
}

type Attribution = { substance: string; reaction?: string };
function attribution(text: string): Attribution | undefined {
  let m = /^(.+?)[ -](?:associated|induced|related)\s+(.+)$/i.exec(text);
  if (m) return { substance: m[1].trim(), reaction: m[2].trim() };
  m = /^(.+?)\s+(?:due to|caused by|secondary to)\s+(.+)$/i.exec(text);
  if (m) return { substance: m[2].trim(), reaction: m[1].trim() };
  m = /^adverse (?:effect|reaction)s? (?:of|to)\s+(.+?)(?:\s*[:;]\s*|\s+[–—]\s+)(.+)$/i.exec(text);
  if (m) return { substance: m[1].trim(), reaction: m[2].trim() };
  m = /^adverse (?:effect|reaction)s? (?:of|to)\s+(.+)$/i.exec(text);
  if (m) return { substance: m[1].replace(/,\s*(?:initial|subsequent) encounter.*$/i, "").trim() };
  return undefined;
}

function drugClass(name: string): "ace" | "sglt2" | "statin" | undefined {
  if (/\bACE[ -]?inhibitors?\b|angiotensin[ -]converting[ -]enzyme inhibitors?/i.test(name)) return "ace";
  if (/\bSGLT[ -]?2(?:[ -]inhibitors?)?\b|sodium[ -]glucose cotransporter[ -]?2 inhibitors?/i.test(name)) return "sglt2";
  if (/\bstatins?\b|HMG[ -]CoA reductase inhibitors?/i.test(name)) return "statin";
  return undefined;
}

function inClass(ing: string, cls: ReturnType<typeof drugClass>): boolean {
  if (cls === "ace") return ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "fosinopril", "perindopril", "quinapril", "trandolapril", "moexipril"].includes(ing);
  if (cls === "sglt2") return ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "bexagliflozin", "sotagliflozin"].includes(ing);
  if (cls === "statin") return ["atorvastatin", "rosuvastatin", "simvastatin", "pravastatin", "lovastatin", "fluvastatin", "pitavastatin"].includes(ing);
  return false;
}

function reactionDetails(reaction: string, substance: string): Pick<AllergyIntoleranceRow, "reaction_type" | "mechanism" | "criticality"> | undefined {
  let kind: AllergyIntoleranceRow["reaction_type"];
  if (/hives|urticaria|rash|angioedema|anaphyla|bronchospasm/i.test(reaction)) kind = "hypersensitivity";
  else if (/ketoacidosis|lactic acidosis|hyperkal[ae]mia|rhabdomyolysis|acute (?:kidney|renal) (?:injury|failure)|pancreatitis|serious adverse/i.test(reaction)) kind = "serious_adverse_event";
  else if (/cough|nausea|vomiting|diarrh|gastrointestinal|GI upset|myalgia|dizziness|edema|constipation|headache/i.test(reaction)) kind = "side_effect";
  else return undefined; // The target has no category for an unspecified reaction.
  const ace = drugClass(substance) === "ace" || inClass(substance, "ace");
  let mechanism: AllergyIntoleranceRow["mechanism"] = "unknown";
  if (/non[ -]?immune/i.test(reaction) || (ace && /cough|angioedema/i.test(reaction))
    || /ketoacidosis|lactic acidosis|hyperkal[ae]mia|rhabdomyolysis/i.test(reaction) || kind === "side_effect") mechanism = "non_immune";
  else if (/immune[ -]mediated|IgE[ -]mediated|confirmed allergy test/i.test(reaction)) mechanism = "immune";
  const high = /severe|life[ -]threatening|anaphyla|angioedema|bronchospasm/i.test(reaction) || kind === "serious_adverse_event";
  return { reaction_type: kind, mechanism, criticality: high ? "high" : /mild/i.test(reaction) || kind === "side_effect" ? "low" : "unknown" };
}

function allergiesFrom(diagnoses: Diagnosis[], orders: ContactEntry[]): AllergyIntoleranceRow[] {
  const rows = new Map<string, AllergyIntoleranceRow>();
  const namedDrugs = new Set(Object.values(BRANDS));
  for (const o of orders) {
    const name = str(o.entry.data.DRUG_NAME);
    if (name) for (const ing of ingredients(name)) if (ing) namedDrugs.add(ing);
  }
  for (const dx of [...diagnoses].sort((a, b) => contactOrder(a.latest, b.latest))) {
    const a = attribution(dx.name);
    if (!a?.reaction) continue;
    const cls = drugClass(a.substance);
    const isClass = !!cls || /\b(?:inhibitors?|blockers?|agonists?|antibiotics?|NSAIDs?|opioids?)\b/i.test(a.substance);
    let substance = isClass ? a.substance : ingredient(a.substance);
    if (!substance) continue;
    // Causal wording alone also occurs in non-drug diagnoses (for example,
    // kidney injury due to dehydration); it must not create an allergy.
    if (!isClass && !namedDrugs.has(substance) && !inClass(substance, "ace") && !inClass(substance, "sglt2")
      && !inClass(substance, "statin") && !/^T(?:3[6-9]|4\d|50)(?:\.|$)/.test(dx.code)) continue;
    const refs = [dx.latest.entry, dx.assertion.entry];
    if (cls) {
      const matches = new Map<string, Entry>();
      for (const o of orders) {
        if (o.entry.item !== dx.latest.entry.item || o.entry.data.MED_STATUS === 9) continue;
        const name = str(o.entry.data.DRUG_NAME);
        if (name) for (const ing of ingredients(name)) if (ing && inClass(ing, cls)) matches.set(ing, o.entry);
      }
      if (matches.size === 1) {
        const [ing, entry] = [...matches][0]; substance = ing; refs.push(entry);
      }
    }
    const details = reactionDetails(a.reaction, substance);
    if (!details) continue;
    const row: AllergyIntoleranceRow = { substance, ...details, reaction: a.reaction, evidence: evidence(...refs) };
    const k = substance.toLowerCase(), previous = rows.get(k);
    if (previous) {
      row.reaction = [...new Set([...(previous.reaction?.split("; ") ?? []), a.reaction])].join("; ");
      row.evidence = uniqueEvidence([...previous.evidence, ...row.evidence]);
      if (previous.criticality === "high") row.criticality = "high";
      if (previous.reaction_type === "serious_adverse_event" || (previous.reaction_type === "hypersensitivity" && row.reaction_type === "side_effect")) row.reaction_type = previous.reaction_type;
      if (previous.mechanism !== row.mechanism) row.mechanism = "unknown";
    }
    rows.set(k, row);
  }
  return [...rows.values()];
}

function vitalsFrom(entries: ContactEntry[]): VitalRow[] {
  const groups = new Map<string, ContactEntry[]>();
  for (const c of entries) {
    const d = c.entry.data;
    const units: Record<string, string> = { BPS: "mmHg", BPD: "mmHg", HR: "/min", WT: "kg" };
    const code = str(d.VITAL_CODE), no = d.READING_NO;
    if (!code || !Object.hasOwn(units, code) || d.UNIT_CODE !== units[code] || !num(d.VALUE_NUM)
      || !num(no) || no < 1 || !Number.isInteger(no)) continue;
    const k = key(c.entry.item.issuer, str(d.VISIT_ID)!);
    const group = groups.get(k) ?? []; group.push(c); groups.set(k, group);
  }
  const output: VitalRow[] = [];
  for (const list of groups.values()) {
    list.sort((a, b) => (a.entry.data.READING_NO as number) - (b.entry.data.READING_NO as number) || contactOrder(a, b));
    const bp = list.filter(c => c.entry.data.VITAL_CODE === "BPS" || c.entry.data.VITAL_CODE === "BPD");
    const firstNo = bp[0]?.entry.data.READING_NO, lastNo = bp[bp.length - 1]?.entry.data.READING_NO;
    const first = bp.filter(c => c.entry.data.READING_NO === firstNo).sort(contactOrder)[0]
      ?? [...list].sort(contactOrder)[0];
    const row: VitalRow = { setting: "clinic", local_time: first.time.local, evidence: [] };
    const used: Entry[] = [first.visit];
    const pick = (code: string, reading?: unknown): ContactEntry | undefined => list.find(c => c.entry.data.VITAL_CODE === code && (reading === undefined || c.entry.data.READING_NO === reading));
    const add = (c: ContactEntry | undefined, field: "systolic_mmhg" | "diastolic_mmhg" | "repeat_systolic_mmhg" | "repeat_diastolic_mmhg" | "pulse_bpm" | "weight_kg") => {
      if (!c) return;
      const value = c.entry.data.VALUE_NUM as number;
      row[field] = field === "weight_kg" ? Math.round(value * 10) / 10 : value;
      used.push(c.entry);
    };
    add(pick("BPS", firstNo), "systolic_mmhg"); add(pick("BPD", firstNo), "diastolic_mmhg");
    // The target has room for one repeat: retain the last repeat pair, never
    // pair a systolic and diastolic from different READING_NO values.
    if (lastNo !== firstNo) { add(pick("BPS", lastNo), "repeat_systolic_mmhg"); add(pick("BPD", lastNo), "repeat_diastolic_mmhg"); }
    add(pick("HR"), "pulse_bpm"); add(pick("WT"), "weight_kg");
    row.evidence = evidence(...used);
    output.push(row);
  }
  return output;
}

/** Map Lakeview's structured rows; narrative is deliberately not a data source. */
export function transform(items: FolioItem[], asOf: string): ViewRows {
  const out: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  if (!partialDate(asOf) || asOf.length !== 10) return out;
  const labs: LabCopy[] = [], orders: ContactEntry[] = [], histories: ContactEntry[] = [];
  const visits: ContactEntry[] = [], diagnoses: ContactEntry[] = [], vitals: ContactEntry[] = [];
  for (const item of currentItems(items, asOf)) {
    if (!object(item.data.payload)) continue;
    const entries: Entry[] = Object.entries(item.data.payload).sort(([a], [b]) => cmp(a, b))
      .filter(([, d]) => object(d)).map(([id, data]) => ({ id, data: data as Data, item }));
    const reqs = new Map<string, Entry>(), labOrders = new Map<string, Entry>(), contacts = new Map<string, Entry>();
    for (const e of entries) {
      const d = e.data;
      if (d.type === "LAB_REQ" && str(d.REQ_ID)) reqs.set(str(d.REQ_ID)!, e);
      if (d.type === "LAB_ORDER" && str(d.ORDER_ID)) labOrders.set(str(d.ORDER_ID)!, e);
      if (d.type === "CLINIC_VISIT" && str(d.VISIT_ID)) contacts.set(str(d.VISIT_ID)!, e);
    }
    for (const e of entries) {
      const d = e.data;
      if (d.type === "LAB_RESULT") {
        const order = labOrders.get(str(d.ORDER_ID) ?? "");
        const req = order && reqs.get(str(order.data.REQ_ID) ?? "");
        const collected = req && time(req.data.COLLECTED_AT);
        if (order && req && collected) labs.push({ entry: e, order, req, collected });
        continue;
      }
      const visit = contacts.get(str(d.VISIT_ID) ?? ""), visitAt = visit && time(visit.data.VISIT_AT);
      if (!visit || !visitAt) continue;
      const c: ContactEntry = { entry: e, visit, time: visitAt };
      if (d.type === "CLINIC_VISIT") visits.push(c);
      if (d.type === "VISIT_DX") diagnoses.push(c);
      if (d.type === "MED_ORDER") orders.push(c);
      if (d.type === "MED_STATUS_HIST") {
        const changed = time(d.CHANGED_AT);
        if (changed) histories.push({ ...c, time: changed });
      }
      if (d.type === "VITAL") {
        const taken = time(d.TAKEN_AT);
        if (taken) vitals.push({ ...c, time: taken });
      }
    }
  }
  visits.sort(contactOrder);
  const dx = diagnosesFrom(diagnoses);
  out.medications = medicationsFrom(orders, histories);
  out.problems = problemsFrom(dx, visits, diagnoses);
  out.allergies = allergiesFrom(dx, orders);
  out.labs = labsFrom(labs);
  out.vitals = vitalsFrom(vitals);
  // Explicit sort keys make result order independent of input item/entry order.
  const tie = (a: { evidence: Evidence }, b: { evidence: Evidence }) => cmp(JSON.stringify(a.evidence), JSON.stringify(b.evidence));
  out.medications.sort((a, b) => cmp(a.ingredient ?? a.drug_name, b.ingredient ?? b.drug_name) || tie(a, b));
  out.problems.sort((a, b) => cmp(a.icd10cm ?? a.condition, b.icd10cm ?? b.condition) || tie(a, b));
  out.allergies.sort((a, b) => cmp(a.substance, b.substance) || tie(a, b));
  out.labs.sort((a, b) => (time(a.collected)!.at - time(b.collected)!.at) || cmp(a.analyte, b.analyte) || tie(a, b));
  out.vitals.sort((a, b) => cmp(a.local_time, b.local_time) || tie(a, b));
  return out;
}
