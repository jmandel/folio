import type {
  FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow,
  Evidence, Analyte, Sensitivity,
} from "../in/views/views";

const TZ = "America/Chicago";

function parts(ms: number): Record<string, string> {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
  const o: Record<string, string> = {};
  for (const p of f.formatToParts(new Date(ms))) o[p.type] = p.value;
  return o;
}
function localDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const ms = Date.parse(iso);
  if (isNaN(ms)) return undefined;
  const p = parts(ms);
  return `${p.year}-${p.month}-${p.day}`;
}
function localMinute(iso: string): string | undefined {
  const ms = Date.parse(iso);
  if (isNaN(ms)) return undefined;
  const p = parts(ms);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
function ms(iso: string | undefined): number {
  const v = iso ? Date.parse(iso) : NaN;
  return isNaN(v) ? 0 : v;
}

interface Doc {
  item: FolioItem;
  enc: any;
  kind: string;
  encId: string;
  time: number; // clinical time used for ordering
  entries: [string, any][];
}

function entriesOf(item: FolioItem): [string, any][] {
  const out: [string, any][] = [];
  const p = item && item.payload;
  if (p && typeof p === "object") for (const k of Object.keys(p)) if (p[k] && typeof p[k] === "object") out.push([k, p[k]]);
  return out;
}

function buildDocs(items: FolioItem[], asOf: string): Doc[] {
  const inScope = items.filter((i) => {
    const d = localDate(i && i.recorded);
    return d !== undefined && d <= asOf;
  });
  const dead = new Set<string>();
  for (const i of inScope) {
    for (const id of i.supersedes ?? []) dead.add(id);
    for (const id of i.retracts ?? []) dead.add(id);
  }
  const docs: Doc[] = [];
  for (const item of inScope) {
    if (dead.has(item.id)) continue;
    const entries = entriesOf(item);
    const enc = entries.map((e) => e[1]).find((e) => e.type === "encounter") ?? {};
    const kind = enc.document_kind ?? "";
    const time = kind === "discharge_summary" ? ms(enc.discharged ?? item.effective_end ?? item.effective) : ms(item.effective);
    docs.push({ item, enc, kind, encId: enc.encounter_id ?? "", time, entries });
  }
  docs.sort((a, b) => a.time - b.time || ms(a.item.recorded) - ms(b.item.recorded) || (a.item.id < b.item.id ? -1 : 1));
  return docs;
}

// ───────────── medications ─────────────

const SALTS = new Set(["potassium", "sodium", "hydrochloride", "hcl", "sulfate", "succinate", "tartrate", "maleate", "besylate",
  "mesylate", "calcium", "phosphate", "acetate", "citrate", "fumarate", "bromide", "magnesium", "hydrobromide", "disoproxil"]);
const FORMS = new Set(["tablet", "tablets", "capsule", "capsules", "oral", "solution", "injection", "pen", "extended", "release",
  "er", "xr", "sr", "dr", "delayed", "chewable", "suspension", "cream", "ointment", "inhaler", "patch", "pack", "syringe", "vial"]);
const BRANDS: Record<string, string> = {
  jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", glucophage: "metformin",
  cozaar: "losartan", zestril: "lisinopril", prinivil: "lisinopril", lantus: "insulin glargine", toujeo: "insulin glargine",
  basaglar: "insulin glargine", levemir: "insulin detemir", novolog: "insulin aspart", humalog: "insulin lispro",
  lasix: "furosemide", norvasc: "amlodipine", lipitor: "atorvastatin", zocor: "simvastatin", crestor: "rosuvastatin",
  tylenol: "acetaminophen", aleve: "naproxen", advil: "ibuprofen", motrin: "ibuprofen", januvia: "sitagliptin",
  ozempic: "semaglutide", victoza: "liraglutide", trulicity: "dulaglutide", coumadin: "warfarin", eliquis: "apixaban",
};

function ingredientName(drug: string): string | undefined {
  const toks = String(drug ?? "").toLowerCase().replace(/[(),]/g, " ").split(/\s+/).filter(Boolean);
  const keep: string[] = [];
  for (const t of toks) {
    if (/^\d/.test(t) || t === "mg" || t === "mcg" || t === "units") break;
    keep.push(t);
  }
  while (keep.length > 1 && (SALTS.has(keep[keep.length - 1]) || FORMS.has(keep[keep.length - 1]))) keep.pop();
  while (keep.length > 1 && FORMS.has(keep[keep.length - 1])) keep.pop();
  if (!keep.length) return undefined;
  const name = keep.join(" ");
  return BRANDS[name] ?? BRANDS[keep[0]] ?? name;
}

function parseDose(text: string, drug: string): MedicationRow["dose"] | undefined {
  const t = String(text ?? "").toLowerCase().trim();
  if (/\bor\b|-|–|to/.test(t.replace(/^[\d.]+\s*[a-z\[\]]+$/, ""))) {
    if (!/^[\d.,]+\s*(mg|mcg|ug|units?|ml|\[iu\]|unt|g)\b/.test(t)) return undefined;
  }
  const m = t.match(/^([\d]+(?:\.\d+)?)\s*(mg|mcg|ug|g|units?|unt|\[iu\]|iu|ml|tablets?|tabs?|capsules?|caps?)\b/);
  if (!m) return undefined;
  const v = parseFloat(m[1]);
  const u = m[2];
  if (u === "mg") return { value: v, unit: "mg" };
  if (u === "mcg" || u === "ug") return { value: v, unit: "mcg" };
  if (u === "g") return { value: v * 1000, unit: "mg" };
  if (u === "ml") return { value: v, unit: "mL" };
  if (/^(unit|units|unt|\[iu\]|iu)$/.test(u)) return { value: v, unit: "units" };
  // tablets / capsules: use strength from drug name if known
  const s = String(drug ?? "").toLowerCase().match(/(\d+(?:\.\d+)?)\s*(mg|mcg)\b/);
  if (s) return { value: v * parseFloat(s[1]), unit: s[2] as "mg" | "mcg" };
  return { value: v, unit: "tablet" };
}

function parseFreq(sig: string): MedicationRow["frequency"] | undefined {
  const s = String(sig ?? "").toLowerCase();
  if (!s) return undefined;
  if (/\bprn\b|as needed/.test(s)) return "PRN";
  if (/\bqhs\b|bedtime|at night|\bhs\b/.test(s)) return "QHS";
  if (/\bbid\b|twice|2 times|two times|b\.i\.d|every 12/.test(s)) return "BID";
  if (/\btid\b|three times|3 times|t\.i\.d|every 8 h/.test(s)) return "TID";
  if (/\bqw\b|weekly|once a week|every week|per week/.test(s)) return "QW";
  if (/\bqd\b|\bdaily\b|once a day|every day|\bqam\b|every morning|each morning|once daily|\bod\b|in the morning/.test(s)) return "QD";
  return "other";
}

function stopReason(text: string | undefined): MedicationRow["stop_reason"] | undefined {
  const s = (text ?? "").toLowerCase();
  if (!s) return undefined;
  if (/cough|side effect|adverse|reaction|angioedema|rash|hives|intoleran|ketoacidosis|hyperkal|toxicity/.test(s)) return "adverse_reaction";
  if (/ineffective|not working|inadequate|no benefit|failure/.test(s)) return "ineffective";
  if (/replaced|switch|changed to|instead of/.test(s)) return "therapy_changed";
  if (/course (complete|finished)|completed/.test(s)) return "course_complete";
  if (/patient (declin|request|choice|prefer)|declined/.test(s)) return "patient_choice";
  return "other";
}

const MH = new Set(["sertraline", "fluoxetine", "citalopram", "escitalopram", "paroxetine", "bupropion", "venlafaxine", "duloxetine",
  "mirtazapine", "trazodone", "quetiapine", "olanzapine", "risperidone", "aripiprazole", "lithium", "lamotrigine", "buspirone",
  "alprazolam", "lorazepam", "clonazepam", "diazepam", "amitriptyline", "nortriptyline", "haloperidol", "lurasidone"]);
const SU = new Set(["buprenorphine", "naltrexone", "methadone", "disulfiram", "acamprosate", "naloxone"]);

function medKey(m: any): string {
  return m.rxnorm_ingredient ? "rx:" + m.rxnorm_ingredient : "nm:" + (ingredientName(m.drug_name) ?? String(m.drug_name).toLowerCase());
}

function buildMeds(docs: Doc[]): MedicationRow[] {
  const withEnc = docs.filter((d) => d.entries.some((e) => e[1].type === "home_med"));
  if (!withEnc.length) return [];
  const latest = withEnc[withEnc.length - 1];
  const sameEnc = withEnc.filter((d) => d.encId === latest.encId);
  const summaries = sameEnc.filter((d) => d.kind === "discharge_summary");
  const chosen = summaries.length ? summaries[summaries.length - 1] : sameEnc[sameEnc.length - 1];
  const prior = sameEnc.filter((d) => d !== chosen && d.time <= chosen.time && d.kind !== "discharge_summary");

  const byKey = new Map<string, [string, any]>();
  for (const [id, e] of chosen.entries) if (e.type === "home_med") byKey.set(medKey(e), [id, e]);

  const rows: MedicationRow[] = [];
  for (const [key, [id, e]] of byKey) {
    const evidence: Evidence = [{ item_id: chosen.item.id, entry_id: id }];
    const st: string = e.status;
    const status: MedicationRow["status"] =
      st === "held" ? "held" : st === "stopped" ? "stopped" : st === "not_reconciled" ? "unknown" : "active";
    const chosenDate = chosen.kind === "discharge_summary"
      ? localDate(chosen.enc.discharged ?? chosen.item.effective_end) : localDate(chosen.item.effective);

    // history of this line within the stay (earlier documents, oldest first)
    const hist: { doc: Doc; id: string; st: string }[] = [];
    for (const d of prior) for (const [pid, pe] of d.entries) if (pe.type === "home_med" && medKey(pe) === key) hist.push({ doc: d, id: pid, st: pe.status });
    let since: string | undefined;
    const docDate = (d: Doc) => localDate(d.item.effective);
    if (status === "held" || status === "stopped") {
      let first: { doc: Doc; id: string } | undefined;
      for (let i = hist.length - 1; i >= 0; i--) {
        if (hist[i].st === st) first = hist[i]; else break;
      }
      if (first) { since = docDate(first.doc); evidence.push({ item_id: first.doc.item.id, entry_id: first.id }); }
      else since = chosenDate;
    } else if (status === "active") {
      const prev = hist.length ? hist[hist.length - 1].st : undefined;
      if (st === "new" || st === "changed") {
        let first: { doc: Doc; id: string } | undefined;
        for (let i = hist.length - 1; i >= 0; i--) {
          if (hist[i].st === st) first = hist[i]; else break;
        }
        if (first) { since = docDate(first.doc); evidence.push({ item_id: first.doc.item.id, entry_id: first.id }); }
        else since = chosenDate;
      } else if (prev === "held" || prev === "stopped") since = chosenDate;
    } else {
      // unknown
    }

    const ingredient = ingredientName(e.drug_name);
    const row: MedicationRow = {
      ...(ingredient ? { ingredient } : {}),
      ...(e.rxnorm_ingredient ? { rxnorm_ingredient: String(e.rxnorm_ingredient) } : {}),
      drug_name: String(e.drug_name),
      status,
      patient_reported: false,
      evidence,
    };
    if (since) row.status_since = since;
    const dose = parseDose(e.dose_text, e.drug_name);
    if (dose) row.dose = dose;
    const fr = parseFreq(e.sig);
    if (fr) row.frequency = fr;
    if (status === "stopped") {
      const sr = stopReason(e.instructions);
      if (sr) row.stop_reason = sr;
    }
    if ((status === "held" || status === "stopped") && e.instructions) row.status_reason_text = String(e.instructions);
    if (ingredient) {
      const s: Sensitivity[] = [];
      if (MH.has(ingredient)) s.push("mental-health");
      if (SU.has(ingredient)) s.push("substance-use");
      if (s.length) row.sensitivity = s;
    }
    rows.push(row);
  }
  return rows;
}

// ───────────── problems & drug-caused diagnoses ─────────────

const CLASSES: { re: RegExp; name: string; members: string[]; nonImmune?: boolean }[] = [
  { re: /sglt-?2/i, name: "SGLT2 inhibitor", members: ["empagliflozin", "dapagliflozin", "canagliflozin", "ertugliflozin", "sotagliflozin"], nonImmune: true },
  { re: /ace[\s-]*inhibitor|angiotensin[- ]converting/i, name: "ACE inhibitor", members: ["lisinopril", "enalapril", "ramipril", "benazepril", "captopril", "quinapril", "fosinopril", "perindopril", "trandolapril"], nonImmune: true },
  { re: /\bstatin/i, name: "statin", members: ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin", "pitavastatin"] },
  { re: /\barb\b|angiotensin receptor/i, name: "angiotensin receptor blocker", members: ["losartan", "valsartan", "irbesartan", "olmesartan", "candesartan", "telmisartan"] },
  { re: /sulfonylurea/i, name: "sulfonylurea", members: ["glipizide", "glyburide", "glimepiride"] },
  { re: /nsaid|anti-?inflammatory/i, name: "NSAID", members: ["ibuprofen", "naproxen", "diclofenac", "meloxicam", "celecoxib"] },
  { re: /thiazide/i, name: "thiazide diuretic", members: ["hydrochlorothiazide", "chlorthalidone"] },
  { re: /beta[- ]?blocker/i, name: "beta blocker", members: ["metoprolol", "atenolol", "carvedilol", "propranolol"] },
  { re: /\bpenicillin/i, name: "penicillin", members: ["amoxicillin", "penicillin"] },
];
const KNOWN_DRUGS = ["empagliflozin", "dapagliflozin", "canagliflozin", "metformin", "lisinopril", "enalapril", "ramipril", "losartan",
  "hydrochlorothiazide", "naproxen", "ibuprofen", "atorvastatin", "simvastatin", "rosuvastatin", "amoxicillin", "penicillin",
  "furosemide", "spironolactone", "insulin glargine", "glipizide", "sitagliptin", "warfarin", "apixaban", "amlodipine"];

function normLabel(s: string): string {
  return String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function isCkd(label: string, icd?: string): boolean {
  return /chronic kidney|\bckd\b/i.test(label) || /^N18\./i.test(icd ?? "");
}
function ckdStageOf(label: string, icd?: string): ProblemRow["ckd_stage"] | undefined {
  const l = label.toLowerCase();
  const m = l.match(/\bg\s?([1-5])\s?(a|b)?\b/) ;
  if (m) { if (m[1] === "3") return m[2] === "b" ? "G3b" : m[2] === "a" ? "G3a" : undefined; return ("G" + m[1]) as ProblemRow["ckd_stage"]; }
  const s = l.match(/stage\s*(1|2|3\s*a|3\s*b|3|4|5|i{1,3}v?|iv|v)\b/);
  if (s) {
    const v = s[1].replace(/\s/g, "");
    if (v === "3a") return "G3a"; if (v === "3b") return "G3b";
    if (v === "1") return "G1"; if (v === "2") return "G2"; if (v === "4") return "G4"; if (v === "5") return "G5";
  }
  const c = (icd ?? "").toUpperCase();
  const map: Record<string, ProblemRow["ckd_stage"]> = { "N18.1": "G1", "N18.2": "G2", "N18.31": "G3a", "N18.32": "G3b", "N18.4": "G4", "N18.5": "G5" };
  return map[c];
}
function albuminuriaOf(label: string): ProblemRow["albuminuria"] | undefined {
  const m = label.match(/\bA([1-3])\b/);
  return m ? (("A" + m[1]) as ProblemRow["albuminuria"]) : undefined;
}
function parseOnset(t: string | undefined): ProblemRow["onset"] | undefined {
  const s = (t ?? "").trim();
  if (/^\d{4}$/.test(s)) return { value: s, precision: "year" };
  if (/^\d{4}-\d{2}$/.test(s)) return { value: s, precision: "month" };
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { value: s, precision: "day" };
  return undefined;
}

interface DxEntry { doc: Doc; id: string; e: any; }

function drugCaused(e: any): { tcode: boolean; text: string } | undefined {
  const label = String(e.label ?? "");
  const icd = String(e.icd10cm ?? "").toUpperCase();
  const t = /^T(3[6-9]|4\d|50)\.[0-9A-Z]*5[A-Z]?$/.test(icd) || /^T(3[6-9]|4\d|50)\.\w*5/.test(icd);
  if (t) return { tcode: !/ketoacidosis|angioedema|hyperkal|acidosis|rash|cough|injury|failure/i.test(label), text: label };
  if (/associated|induced|adverse (effect|reaction) of|due to .*(inhibitor|drug)|caused by/i.test(label) &&
      (CLASSES.some((c) => c.re.test(label)) || KNOWN_DRUGS.some((d) => label.toLowerCase().includes(d)) || /adverse (effect|reaction)/i.test(label)))
    return { tcode: /^adverse (effect|reaction)/i.test(label), text: label };
  return undefined;
}

function buildProblemsAndDxAllergies(docs: Doc[]): { problems: ProblemRow[]; dxAllergies: AllergyIntoleranceRow[] } {
  const groups = new Map<string, { dx: DxEntry[]; hist: DxEntry[] }>();
  const keyFor = (label: string, icd: string | undefined, rdx: any): string => {
    if (isCkd(label, icd)) return "ckd";
    if (rdx && rdx.code) return "rdx:" + rdx.code;
    if (icd) {
      const set = rdxByIcd.get(icd.toUpperCase());
      if (set && set.size === 1) return "rdx:" + [...set][0];
      return "icd:" + icd.toUpperCase();
    }
    return "lbl:" + normLabel(label);
  };
  const rdxByIcd = new Map<string, Set<string>>();
  for (const d of docs) for (const [, e] of d.entries) {
    if (e.type === "diagnosis" && e.icd10cm && e.riverside_dx && e.riverside_dx.code) {
      const k = String(e.icd10cm).toUpperCase();
      const set = rdxByIcd.get(k) ?? new Set<string>();
      set.add(e.riverside_dx.code); rdxByIcd.set(k, set);
    }
  }
  const dxAllergies: AllergyIntoleranceRow[] = [];
  const seenAllergy = new Map<string, AllergyIntoleranceRow>();

  for (const d of docs) {
    for (const [id, e] of d.entries) {
      if (e.type === "diagnosis" && e.label) {
        const k = keyFor(e.label, e.icd10cm, e.riverside_dx);
        const g = groups.get(k) ?? { dx: [], hist: [] };
        g.dx.push({ doc: d, id, e }); groups.set(k, g);
      } else if (e.type === "history" && e.condition) {
        const k = keyFor(e.condition, e.icd10cm, undefined);
        const g = groups.get(k) ?? { dx: [], hist: [] };
        g.hist.push({ doc: d, id, e }); groups.set(k, g);
      }
    }
  }

  const problems: ProblemRow[] = [];
  for (const [k, g] of groups) {
    // status from diagnoses (established ones), else history
    const est = g.dx.filter((x) => x.e.status !== "working");
    let status: "active" | "resolved" | undefined;
    let cur: DxEntry | undefined;
    let label = "";
    let icd: string | undefined;
    if (est.length) {
      cur = est[est.length - 1];
      if (cur.e.status === "ruled_out") continue;
      status = cur.e.status === "resolved" ? "resolved" : "active";
      label = cur.e.label; icd = cur.e.icd10cm;
    } else if (g.hist.length) {
      if (g.dx.length) continue; // only working diagnoses plus history: history line stands? keep it below
    }
    if (!cur) {
      if (!g.hist.length) continue;
      cur = g.hist[g.hist.length - 1];
      status = "active";
      label = cur.e.condition; icd = cur.e.icd10cm;
    }
    // drug-caused? (handled separately, but T-code-only entries yield no problem row)
    const dc = g.dx.length && cur.e.type === "diagnosis" ? drugCaused(cur.e) : undefined;
    if (dc && dc.tcode) continue;

    const all = [...g.dx.filter((x) => x.e.status !== "working" && x.e.status !== "ruled_out"), ...g.hist]
      .sort((a, b) => a.doc.time - b.doc.time);
    // latest icd among entries that carry one
    for (let i = all.length - 1; i >= 0 && !icd; i--) icd = all[i].e.icd10cm;
    const row: ProblemRow = { condition: label, status: status!, evidence: [{ item_id: cur.doc.item.id, entry_id: cur.id }] };
    if (icd) row.icd10cm = icd;
    // onset from the latest history line that states one
    for (let i = g.hist.length - 1; i >= 0; i--) {
      const o = parseOnset(g.hist[i].e.onset_text);
      if (o) { row.onset = o; break; }
    }
    if (k === "ckd") {
      for (let i = all.length - 1; i >= 0; i--) {
        const x = all[i].e;
        const lab = String(x.label ?? x.condition ?? "");
        const st = ckdStageOf(lab, x.icd10cm);
        if (st) { row.ckd_stage = st; break; }
      }
      for (let i = all.length - 1; i >= 0; i--) {
        const x = all[i].e;
        const a = albuminuriaOf(String(x.label ?? x.condition ?? ""));
        if (a) { row.albuminuria = a; break; }
      }
    }
    problems.push(row);
  }

  // drug-caused diagnoses → allergy rows (latest established entry per group)
  for (const [, g] of groups) {
    const est = g.dx.filter((x) => x.e.status === "active" || x.e.status === "resolved");
    if (!est.length) continue;
    const cur = est[est.length - 1];
    const dc = drugCaused(cur.e);
    if (!dc) continue;
    const label: string = cur.e.label;
    const low = label.toLowerCase();
    let substance: string | undefined;
    let rx: string | undefined;
    const drugs = cur.doc.entries.filter((x) => x[1].type === "home_med").map((x) => x[1]);
    const named = KNOWN_DRUGS.find((d) => low.includes(d)) ?? drugs.map((m) => ingredientName(m.drug_name)).find((n) => n && low.includes(n));
    let cls = CLASSES.find((c) => c.re.test(label));
    if (named) {
      substance = named;
      rx = drugs.find((m) => ingredientName(m.drug_name) === named)?.rxnorm_ingredient;
    } else if (cls) {
      const inClass = drugs.filter((m) => cls!.members.includes(ingredientName(m.drug_name) ?? ""));
      const ings = new Set(inClass.map((m) => ingredientName(m.drug_name)));
      if (ings.size === 1) { substance = [...ings][0]; rx = inClass[0].rxnorm_ingredient; }
      else substance = cls.name;
    } else {
      const m = low.match(/adverse (?:effect|reaction) of (.+?)(?:,|$| \()/);
      substance = m ? m[1].trim() : undefined;
    }
    if (!substance) continue;
    let rtype: AllergyIntoleranceRow["reaction_type"] = "serious_adverse_event";
    if (/angioedema|anaphyla|urticaria|hives|rash|bronchospasm|hypersens/.test(low)) rtype = "hypersensitivity";
    else if (/cough|nausea|myalgia|gi upset|diarrhea/.test(low)) rtype = "side_effect";
    const mech: AllergyIntoleranceRow["mechanism"] =
      rtype === "hypersensitivity" ? (cls?.nonImmune ? "non_immune" : "unknown")
      : rtype === "serious_adverse_event" && /ketoacidosis|\bdka\b|acidosis|hyperkal/.test(low) ? "non_immune" : "unknown";
    const row: AllergyIntoleranceRow = {
      substance, reaction_type: rtype, mechanism: mech, reaction: label,
      criticality: rtype === "side_effect" ? "low" : "high",
      evidence: [{ item_id: cur.doc.item.id, entry_id: cur.id }],
    };
    if (rx) row.rxnorm_ingredient = String(rx);
    const prev = seenAllergy.get(substance);
    if (prev) { prev.evidence.push(...row.evidence); continue; }
    seenAllergy.set(substance, row);
    dxAllergies.push(row);
  }
  return { problems, dxAllergies };
}

// ───────────── allergies ─────────────

function buildAllergies(docs: Doc[]): AllergyIntoleranceRow[] {
  const withList = docs.filter((d) => d.entries.some((e) => e[1].type === "allergy"));
  if (!withList.length) return [];
  const doc = withList[withList.length - 1];
  const rows: AllergyIntoleranceRow[] = [];
  for (const [id, e] of doc.entries) {
    if (e.type !== "allergy" || !e.substance) continue;
    const sub = String(e.substance).trim();
    if (/^(nkda|nka|no known (drug )?allergies)$/i.test(sub)) continue;
    const rs = String(e.reaction ?? "").toLowerCase();
    const lowSub = sub.toLowerCase();
    let rtype: AllergyIntoleranceRow["reaction_type"];
    if (/hives|urticaria|rash|angioedema|anaphyla|swelling|wheez|bronchospasm|itch|pruritus|throat|shortness of breath|dyspnea|hypersens|edema/.test(rs)) rtype = "hypersensitivity";
    else if (/ketoacidosis|lactic|hyperkal|liver|hepatotox|renal failure|bleed|rhabdo|pancreatitis|toxicity|acidosis|stevens|seizure/.test(rs)) rtype = "serious_adverse_event";
    else if (rs) rtype = "side_effect";
    else rtype = e.severity === "mild" ? "side_effect" : "hypersensitivity";
    const aceI = CLASSES[1].members.includes(lowSub) || CLASSES[1].re.test(lowSub);
    let mech: AllergyIntoleranceRow["mechanism"] = "unknown";
    if (aceI && /cough|angioedema/.test(rs)) mech = "non_immune";
    else if (rtype === "serious_adverse_event" && /ketoacidosis|acidosis/.test(rs)) mech = "non_immune";
    const row: AllergyIntoleranceRow = {
      substance: lowSub, reaction_type: rtype, mechanism: mech,
      criticality: e.severity === "mild" ? "low" : e.severity === "severe" ? "high" : "unknown",
      evidence: [{ item_id: doc.item.id, entry_id: id }],
    };
    if (e.rxnorm_ingredient) row.rxnorm_ingredient = String(e.rxnorm_ingredient);
    if (e.reaction) row.reaction = String(e.reaction);
    rows.push(row);
  }
  return rows;
}

// ───────────── labs ─────────────

const LOINC: Record<string, Analyte> = {
  "2160-0": "creatinine", "38483-4": "creatinine", "2823-3": "potassium", "6298-4": "potassium", "2951-2": "sodium", "2947-0": "sodium",
  "2075-0": "chloride", "2028-9": "bicarbonate", "1963-8": "bicarbonate", "33037-3": "anion_gap", "3094-0": "bun",
  "2345-7": "glucose", "2339-0": "glucose", "4548-4": "a1c", "17856-6": "a1c", "4544-3": "hemoglobin", "718-7": "hemoglobin",
  "777-3": "platelets", "26515-7": "platelets", "6690-2": "wbc", "26464-8": "wbc", "1751-7": "uacr", "9318-7": "uacr", "14959-1": "uacr",
  "2157-6": "uacr", "6768-6": "lipase", "3040-3": "lipase", "2093-3": "cholesterol", "2571-8": "triglycerides", "2085-9": "hdl",
  "2089-1": "ldl", "13457-7": "ldl", "18262-6": "ldl", "10839-9": "troponin", "89579-7": "troponin", "42757-5": "troponin",
  "11558-4": "ph", "2744-1": "ph", "2019-8": "pco2", "98979-8": "egfr", "62238-1": "egfr", "77147-7": "egfr", "76633-7": "egfr",
  "48642-3": "egfr", "48643-1": "egfr", "33914-3": "egfr", "88293-6": "egfr", "69405-9": "egfr", "50210-4": "egfr", "50044-7": "egfr",
  "35914-3": "egfr",
};
const CODE: Record<string, Analyte> = {
  NA: "sodium", K: "potassium", CL: "chloride", CO2: "bicarbonate", HCO3: "bicarbonate", AGAP: "anion_gap", BUN: "bun", CREAT: "creatinine",
  CR: "creatinine", EGFR: "egfr", GLU: "glucose", A1C: "a1c", HBA1C: "a1c", UACR: "uacr", PLT: "platelets", WBC: "wbc", HGB: "hemoglobin",
  BHB: "bhb", PH: "ph", PCO2: "pco2", LIPASE: "lipase", LIP: "lipase", TROP: "troponin", TNI: "troponin", CHOL: "cholesterol",
  TRIG: "triglycerides", TG: "triglycerides", HDL: "hdl", LDL: "ldl",
};
function analyteOf(t: any): Analyte | undefined {
  if (!t) return undefined;
  const code = String(t.local_code ?? "").toUpperCase();
  const name = String(t.name ?? "").toLowerCase();
  if (/egfr|glomerular filtration|\bgfr\b/.test(name)) return "egfr";
  if (t.loinc && LOINC[t.loinc]) return LOINC[t.loinc];
  if (CODE[code]) return CODE[code];
  if (/beta-?\s?hydroxybutyrate/.test(name)) return "bhb";
  if (/microalbumin|albumin\/creatinine|albumin.creatinine/.test(name)) return "uacr";
  return undefined;
}
function eGfrRaceVariant(t: any): boolean {
  const n = String(t.name ?? "").toLowerCase() + " " + String(t.local_code ?? "").toLowerCase();
  if (/non[- ]?(black|african)|without (race|black)|race[- ]free|no race/.test(n)) return false;
  if (/african|black|\bblack\b|with race|race coef|_aa\b|\baa\b/.test(n)) return true;
  if (t.loinc === "76633-7" || t.loinc === "48643-1") return true;
  return false;
}
function eGfrEq(t: any, collected: string): LabResultRow["egfr_equation"] {
  const n = String(t.name ?? "").toLowerCase();
  if (/2021/.test(n)) return "ckd-epi-2021";
  if (/2009|ckd-epi/.test(n) && !/2021/.test(n) && /2009/.test(n)) return "ckd-epi-2009";
  if (/mdrd/.test(n)) return "mdrd";
  if (t.loinc === "98979-8") return "ckd-epi-2021";
  if (t.loinc === "62238-1" || t.loinc === "77147-7") return "ckd-epi-2009";
  if (t.loinc === "33914-3" || t.loinc === "48642-3") return "mdrd";
  if (/ckd-epi/.test(n)) return "unknown";
  return ms(collected) >= Date.parse("2023-01-01T00:00:00-06:00") ? "ckd-epi-2021" : "unknown";
}
const UNITS: Partial<Record<Analyte, string>> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L", bicarbonate: "mmol/L",
  anion_gap: "mmol/L", bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL",
  hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]", pco2: "mmHg", lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL",
  triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
function convert(a: Analyte, v: number, unitRaw: string | undefined): number | undefined {
  const u = (unitRaw ?? "").trim().toLowerCase().replace(/\s/g, "");
  const target = (UNITS[a] ?? "").toLowerCase();
  if (!u || u === target) return v;
  switch (a) {
    case "creatinine": if (u === "umol/l" || u === "µmol/l") return v / 88.4; break;
    case "glucose": if (u === "mmol/l") return v * 18.016; break;
    case "bun": if (u === "mmol/l") return v * 2.801; break;
    case "cholesterol": case "hdl": case "ldl": if (u === "mmol/l") return v * 38.67; break;
    case "triglycerides": if (u === "mmol/l") return v * 88.57; break;
    case "hemoglobin": if (u === "g/l") return v / 10; if (u === "mmol/l") return v * 1.611; break;
    case "a1c": if (u === "mmol/mol") return v / 10.929 + 2.15; if (u === "%" ) return v; break;
    case "uacr": if (u === "mg/mmol") return v * 8.84; if (u === "mcg/mg" || u === "ug/mg") return v; break;
    case "platelets": case "wbc":
      if (u === "/ul" || u === "/µl" || u === "cells/ul" || u === "/mm3" || u === "cells/mm3") return v / 1000;
      if (u === "10*3/ul" || u === "10^3/ul" || u === "k/ul" || u === "10*9/l" || u === "10^9/l" || u === "x10e3/ul" || u === "10*3/mm3") return v;
      break;
    case "troponin": if (u === "ug/l" || u === "mcg/l") return v; if (u === "pg/ml" || u === "ng/l") return v / 1000; break;
    case "ph": return v;
    case "bicarbonate": case "potassium": case "sodium": case "chloride": case "anion_gap": case "bhb":
      if (u === "meq/l") return v; break;
    case "lipase": if (u === "iu/l" || u === "u/l") return v; break;
    case "pco2": if (u === "kpa") return v * 7.50062; break;
    default: break;
  }
  return undefined;
}
const RANK: Record<string, number> = { preliminary: 0, final: 1, corrected: 2 };

function buildLabs(docs: Doc[]): LabResultRow[] {
  interface Cand { a: Analyte; rv: any; acc: string; coll: string; status: string; doc: Doc; id: string; }
  const best = new Map<string, Cand>();
  const consider = (doc: Doc, id: string, rv: any, acc: any, coll: any, status: any) => {
    if (!rv || !rv.test || typeof rv.value !== "string" || !acc || !coll) return;
    const a = analyteOf(rv.test);
    if (!a) return;
    if (a === "egfr" && eGfrRaceVariant(rv.test)) return;
    if (!(String(status) in RANK)) return;
    const key = `${acc}|${rv.test.local_code}${a === "egfr" ? "|" + (rv.test.loinc ?? rv.test.name) : ""}`;
    const prev = best.get(key);
    const c: Cand = { a, rv, acc, coll, status, doc, id };
    // docs iterate oldest first, so ties go to the later document
    if (!prev || RANK[status] >= RANK[prev.status]) best.set(key, c);
  };
  for (const d of docs) {
    for (const [id, e] of d.entries) {
      if (e.type === "result") consider(d, id, e, e.accession, e.collected, e.status);
      else if (e.type === "panel" && Array.isArray(e.components)) {
        for (const c of e.components) consider(d, id, c, e.accession, e.collected, e.status);
      }
    }
  }
  const rows: LabResultRow[] = [];
  for (const c of best.values()) {
    const m = c.rv.value.trim().match(/^(<=|>=|<|>|≤|≥)?\s*([+-]?\d+(?:\.\d+)?)$/);
    if (!m) continue;
    let v = parseFloat(m[2]);
    const cv = convert(c.a, v, c.rv.unit);
    if (cv === undefined || !isFinite(cv)) continue;
    v = Math.round(cv * 1e6) / 1e6;
    const cmp = m[1] === "≤" ? "<=" : m[1] === "≥" ? ">=" : m[1];
    const row: LabResultRow = {
      analyte: c.a, value: v, unit: UNITS[c.a]!, collected: c.coll,
      status: c.status === "preliminary" ? "preliminary" : "final",
      evidence: [{ item_id: c.doc.item.id, entry_id: c.id }],
    };
    if (cmp) row.comparator = cmp as LabResultRow["comparator"];
    if (c.a === "egfr") row.egfr_equation = eGfrEq(c.rv.test, c.coll);
    if (c.rv.test.loinc) row.loinc = c.rv.test.loinc;
    rows.push(row);
  }
  rows.sort((a, b) => ms(a.collected) - ms(b.collected) || (a.analyte < b.analyte ? -1 : 1));
  return rows;
}

// ───────────── vitals ─────────────

function buildVitals(docs: Doc[]): VitalRow[] {
  interface V { taken: string; t: number; e: any; ev: Evidence[number][]; }
  const uniq = new Map<string, V>();
  for (const d of docs) {
    for (const [id, e] of d.entries) {
      if (e.type !== "vitals" || !e.taken || isNaN(Date.parse(e.taken))) continue;
      const key = `${ms(e.taken)}|${JSON.stringify(e.bp ?? null)}|${e.heart_rate_bpm ?? ""}|${e.weight_kg ?? ""}`;
      const v = uniq.get(key);
      if (v) v.ev.unshift({ item_id: d.item.id, entry_id: id });
      else uniq.set(key, { taken: e.taken, t: ms(e.taken), e, ev: [{ item_id: d.item.id, entry_id: id }] });
    }
  }
  const list = [...uniq.values()].sort((a, b) => a.t - b.t);
  const rows: VitalRow[] = [];
  let cur: VitalRow | undefined;
  let curStart = 0;
  for (const v of list) {
    const e = v.e;
    const hasBp = e.bp && typeof e.bp.systolic_mmhg === "number" && typeof e.bp.diastolic_mmhg === "number";
    const hasAny = hasBp || typeof e.heart_rate_bpm === "number" || typeof e.weight_kg === "number";
    if (!hasAny) continue;
    if (cur && v.t - curStart <= 10 * 60000) {
      // same visit set
      if (hasBp) {
        if (cur.systolic_mmhg === undefined) { cur.systolic_mmhg = e.bp.systolic_mmhg; cur.diastolic_mmhg = e.bp.diastolic_mmhg; }
        else if (cur.repeat_systolic_mmhg === undefined) { cur.repeat_systolic_mmhg = e.bp.systolic_mmhg; cur.repeat_diastolic_mmhg = e.bp.diastolic_mmhg; }
        else { cur = undefined; }
      }
      if (cur) {
        if (cur.pulse_bpm === undefined && typeof e.heart_rate_bpm === "number") cur.pulse_bpm = e.heart_rate_bpm;
        if (cur.weight_kg === undefined && typeof e.weight_kg === "number") cur.weight_kg = Math.round(e.weight_kg * 10) / 10;
        cur.evidence.push(...v.ev);
        continue;
      }
    }
    const lt = localMinute(v.taken);
    if (!lt) continue;
    cur = { setting: "hospital", local_time: lt, evidence: [...v.ev] };
    curStart = v.t;
    if (hasBp) { cur.systolic_mmhg = e.bp.systolic_mmhg; cur.diastolic_mmhg = e.bp.diastolic_mmhg; }
    if (typeof e.heart_rate_bpm === "number") cur.pulse_bpm = e.heart_rate_bpm;
    if (typeof e.weight_kg === "number") cur.weight_kg = Math.round(e.weight_kg * 10) / 10;
    rows.push(cur);
  }
  return rows;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const empty: ViewRows = { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  try {
    const docs = buildDocs(Array.isArray(items) ? items : [], asOf);
    const { problems, dxAllergies } = buildProblemsAndDxAllergies(docs);
    const listed = buildAllergies(docs);
    const allergies = [...listed];
    for (const a of dxAllergies) {
      const same = allergies.find((x) => x.substance === a.substance);
      if (same) {
        // the allergy-list entry stands; add the diagnosis as supporting evidence
        same.evidence.push(...a.evidence);
        if (same.reaction_type === "side_effect" && a.reaction_type === "serious_adverse_event") {
          allergies.push(a);
        }
      } else allergies.push(a);
    }
    return {
      medications: buildMeds(docs),
      problems,
      allergies,
      labs: buildLabs(docs),
      vitals: buildVitals(docs),
    };
  } catch {
    return empty;
  }
}
