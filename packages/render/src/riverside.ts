// Source A, Riverside Regional Hospital: one item per signed document. Every document re-lists the
// home medications and allergies with that document's status (T15); lab results are text copies
// inside the documents that reviewed them (T9, T14); payload times are UTC (T10).

import { drug } from "../../truth/src/catalog.ts";
import {
  type Analyte, type Encounter, type EncounterDocument, type LabResult, localDate, ms, type Patient, utcZ, wall,
} from "../../truth/src/model.ts";
import { staff } from "../../truth/src/staff.ts";
import { Ctx, ISSUER, type NoteRequest, type RenderedItem } from "./context.ts";
import { describe, medDoseAt } from "./describe.ts";
import { guards } from "./guards.ts";
import { type Item, schemaRef, ulid } from "./item.ts";

interface LabDef { code: string; loinc?: string; name: string; unit?: string; range: (sex: "F" | "M") => string; dec: number; crit?: { lo?: number; hi?: number } }

const LABS: Record<Analyte, LabDef> = {
  sodium: { code: "NA", loinc: "2951-2", name: "Sodium", unit: "mmol/L", range: () => "136-145", dec: 0, crit: { lo: 120, hi: 160 } },
  potassium: { code: "K", loinc: "2823-3", name: "Potassium", unit: "mmol/L", range: () => "3.5-5.1", dec: 1, crit: { lo: 2.8, hi: 6.2 } },
  chloride: { code: "CL", loinc: "2075-0", name: "Chloride", unit: "mmol/L", range: () => "98-107", dec: 0 },
  bicarbonate: { code: "CO2", loinc: "2028-9", name: "Bicarbonate (total CO2)", unit: "mmol/L", range: () => "22-29", dec: 0, crit: { lo: 12 } },
  "anion-gap": { code: "AGAP", loinc: "33037-3", name: "Anion gap", unit: "mmol/L", range: () => "7-16", dec: 0 },
  bun: { code: "BUN", loinc: "3094-0", name: "Urea nitrogen", unit: "mg/dL", range: () => "8-23", dec: 0 },
  creatinine: { code: "CREAT", loinc: "2160-0", name: "Creatinine", unit: "mg/dL", range: (s) => (s === "F" ? "0.57-1.00" : "0.76-1.27"), dec: 2 },
  egfr: { code: "EGFR", loinc: "98979-8", name: "eGFR (CKD-EPI 2021)", unit: "mL/min/1.73m2", range: () => ">59", dec: 0 },
  glucose: { code: "GLU", loinc: "2345-7", name: "Glucose", unit: "mg/dL", range: () => "70-99", dec: 0, crit: { lo: 50, hi: 400 } },
  ph: { code: "VPH", loinc: "2746-6", name: "pH, venous", range: () => "7.32-7.43", dec: 2, crit: { lo: 7.2, hi: 7.6 } },
  pco2: { code: "VPCO2", loinc: "2021-4", name: "pCO2, venous", unit: "mmHg", range: () => "41-51", dec: 0 },
  bhb: { code: "BHB", name: "Beta-hydroxybutyrate", unit: "mmol/L", range: () => "<0.4", dec: 1, crit: { hi: 3 } },
  troponin: { code: "TROPI", loinc: "10839-9", name: "Troponin I", unit: "ng/mL", range: () => "<0.04", dec: 2 },
  lipase: { code: "LIPASE", loinc: "3040-3", name: "Lipase", unit: "U/L", range: () => "13-60", dec: 0 },
  wbc: { code: "WBC", loinc: "6690-2", name: "White blood cells", unit: "10*3/uL", range: () => "4.0-10.5", dec: 1 },
  hemoglobin: { code: "HGB", loinc: "718-7", name: "Hemoglobin", unit: "g/dL", range: (s) => (s === "F" ? "11.5-15.5" : "13.5-17.5"), dec: 1 },
  platelets: { code: "PLT", loinc: "777-3", name: "Platelets", unit: "10*3/uL", range: () => "150-400", dec: 0 },
  a1c: { code: "A1C", loinc: "4548-4", name: "Hemoglobin A1c", unit: "%", range: () => "4.0-5.6", dec: 1 },
  uacr: { code: "UACR", loinc: "9318-7", name: "Albumin/creatinine ratio", unit: "mg/g", range: () => "<30", dec: 0 },
};

const PANELS: Record<string, { local_code: string; loinc?: string; name: string }> = {
  BMP: { local_code: "BMP", loinc: "51990-0", name: "Basic metabolic panel" },
  VBG: { local_code: "VBG", name: "Venous blood gas" },
  CBC: { local_code: "CBC", loinc: "58410-2", name: "Complete blood count" },
};

const SPECIMEN: Record<LabResult["specimen"], string> = {
  serum: "serum", plasma: "plasma", urine: "urine", "whole-blood": "whole blood", capillary: "capillary blood", "venous-blood": "venous blood",
};

const KIND: Record<string, "ed_note" | "hp" | "progress_note" | "consult" | "discharge_summary"> = {
  "ed-note": "ed_note", "h&p": "hp", progress: "progress_note", consult: "consult", discharge: "discharge_summary",
};

const FILE_SLUG: Record<string, string> = {
  "ed-note": "ed-note", "h&p": "admission-hp", progress: "progress-note", consult: "consult", discharge: "discharge-summary",
};

const SERVICE: Record<string, string> = {
  "Emergency physician": "Emergency Medicine", Hospitalist: "Hospital Medicine", Endocrinologist: "Endocrinology",
  Cardiologist: "Cardiology", Nephrologist: "Nephrology",
};

const CLASS_ORDER = ["biguanide", "sglt2i", "sulfonylurea", "dpp4i", "glp1ra", "basal-insulin", "rapid-insulin", "acei", "arb", "thiazide", "ccb",
  "beta-blocker", "mra", "ns-mra", "loop", "statin", "antiplatelet", "ssri", "thyroid", "nsaid", "other"];

export function labFlag(value: number, comparator: string | undefined, range: string, crit?: { lo?: number; hi?: number }): "H" | "L" | "HH" | "LL" | undefined {
  if (comparator) return undefined;
  if (crit?.lo !== undefined && value < crit.lo) return "LL";
  if (crit?.hi !== undefined && value >= crit.hi) return "HH";
  let m: RegExpMatchArray | null;
  if ((m = range.match(/^([\d.]+)-([\d.]+)$/))) return value < +m[1] ? "L" : value > +m[2] ? "H" : undefined;
  if ((m = range.match(/^<([\d.]+)$/))) return value >= +m[1] ? "H" : undefined;
  if ((m = range.match(/^>([\d.]+)$/))) return value <= +m[1] ? "L" : undefined;
  return undefined;
}

function resultValue(p: Patient, l: LabResult) {
  const d = LABS[l.analyte];
  const range = d.range(p.demographics.sex);
  const flag = labFlag(l.value, l.comparator, range, d.crit);
  return {
    test: { local_code: d.code, ...(d.loinc ? { loinc: d.loinc } : {}), name: d.name },
    value: `${l.comparator ?? ""}${l.value.toFixed(d.dec)}`,
    ...(d.unit ? { unit: d.unit } : {}),
    ref_range: range,
    ...(flag ? { flag } : {}),
  };
}

function rrhSig(p: Patient, medId: string, when: string): { drugName: string; doseText: string; sig: string } {
  const { drug: d, dose, doseText, frequency } = medDoseAt(p, medId, when);
  const freq = { QD: "daily", BID: "BID", TID: "TID", QHS: "nightly", QW: "weekly", PRN: "PRN" }[frequency];
  if (d.form === "pen") {
    const name = d.unit === "units/mL" ? `${d.ingredient} ${d.strength} units/mL pen` : `${d.ingredient} pen`;
    return { drugName: name, doseText, sig: `${doseText} SubQ ${freq}` };
  }
  const tabs = dose ? dose.value / d.strength : 1;
  const tabText = tabs === 0.5 ? "1/2" : String(tabs);
  return {
    drugName: `${d.ingredient} ${d.strength} mg ${d.form}`,
    doseText,
    sig: `${tabText} ${d.form === "capsule" ? "cap" : "tab"} PO ${freq}${d.klass === "biguanide" ? " with meals" : ""}`,
  };
}

function adverseIcd(klass: string): string {
  return ["biguanide", "sglt2i", "sulfonylurea", "dpp4i", "glp1ra", "basal-insulin"].includes(klass) ? "T38.3X5A"
    : ["acei", "arb"].includes(klass) ? "T46.4X5A" : ["mra", "ns-mra", "thiazide", "loop"].includes(klass) ? "T50.1X5A" : "T50.905A";
}

export function renderRiverside(ctx: Ctx): RenderedItem[] {
  const p = ctx.p;
  const out: RenderedItem[] = [];
  for (const enc of p.encounters.filter((e) => e.source === "A")) {
    const docs = [...enc.documents].sort((a, b) => ms(a.signedAt) - ms(b.signedAt));
    const encId = ctx.id("A", "encounter", enc.id, (r) => `RRH-ENC-${r.int(6000000, 6999999)}`);
    const seenKinds = new Map<string, number>();
    for (const doc of docs) {
      const n = (seenKinds.get(doc.kind) ?? 0) + 1;
      seenKinds.set(doc.kind, n);
      out.push(renderDoc(ctx, enc, doc, encId));
    }
  }
  return out;
}

function renderDoc(ctx: Ctx, enc: Encounter, doc: EncounterDocument, encId: string): RenderedItem {
  const p = ctx.p;
  const sex = p.demographics.sex;
  const signed = doc.signedAt;
  const author = staff(doc.author);
  const kind = KIND[doc.kind];
  const itemKey = `A/${enc.id}/${doc.key}`;
  const beganInEd = true;
  const isEdDoc = kind === "ed_note";
  const admitted = enc.admitted && ms(enc.admitted) <= ms(signed) ? enc.admitted : undefined;
  const payload: Record<string, Record<string, unknown>> = {};
  const factKey = new Map<string, string>();       // truth id -> entry key in this document
  const used = new Set<string>();
  const key = (factId: string, dflt: string) => {
    let k = doc.keys?.[factId] ?? ctx.key("A", factId, dflt);
    if (used.has(k)) { let i = 2; while (used.has(`${k}_${i}`)) i++; k = `${k}_${i}`; }
    used.add(k);
    return k;
  };

  payload.enc = {
    type: "encounter", encounter_id: encId, document_kind: kind,
    class: isEdDoc || !enc.admitted ? "emergency" : "inpatient",
    service: SERVICE[author.role] ?? "Hospital Medicine",
    ...(beganInEd ? { arrived: utcZ(enc.start) } : {}),
    ...(!isEdDoc && admitted ? { admitted: utcZ(admitted) } : {}),
    ...(kind === "discharge_summary" && enc.end ? { discharged: utcZ(enc.end) } : {}),
    ...(isEdDoc ? { disposition: enc.admitted ? "admitted" : enc.disposition ?? "home" } : kind === "discharge_summary" ? { disposition: enc.disposition ?? "home" } : {}),
  };
  used.add("enc");

  const condStatus = (cid: string) => {
    const c = p.conditions.find((x) => x.id === cid)!;
    const hs = c.history.filter((h) => h.recordedBy === "A" && ms(h.at.includes("T") ? h.at : h.at + "T00:00:00Z") <= ms(signed));
    const last = hs[hs.length - 1];
    const label = [...hs].reverse().find((h) => h.label)?.label ?? c.name;
    const subtype = [...hs].reverse().find((h) => h.subtype)?.subtype;
    return { c, status: last?.status ?? "active", label, subtype };
  };
  const STATUS = { working: "working", "ruled-out": "ruled_out", active: "active", resolved: "resolved" } as const;

  const addAllergies = () => {
    const algs = p.allergies.filter((a) => a.visibility.A && ms(a.recordedAt.includes("T") ? a.recordedAt : a.recordedAt + "T00:00:00Z") < ms(enc.start));
    if (!algs.length) { payload[key("nkda", "alg_nkda")] = { type: "allergy", substance: "NKDA", severity: "unknown" }; return; }
    for (const a of algs) {
      const k = key(a.id, `alg_${a.substance.display.split(" ")[0]}`);
      factKey.set(a.id, k);
      payload[k] = {
        type: "allergy", substance: a.substance.display, rxnorm_ingredient: a.substance.code, reaction: a.reactions[0].toLowerCase(),
        severity: a.type === "intolerance" ? "mild" : a.criticality === "high" ? "severe" : "moderate",
      };
    }
  };

  const addHomeMeds = () => {
    const home = p.meds.filter((m) => m.setting !== "inpatient" && m.visibility.A && !m.otc).filter((m) => {
      const before = m.history.filter((h) => h.by !== "A" && h.by !== "P" && (!h.at.includes("T") || ms(h.at) < ms(enc.start)));
      const st = before[before.length - 1]?.status;
      return st === "active" || st === "held";
    });
    home.sort((a, b) => CLASS_ORDER.indexOf(drug(a.product).klass) - CLASS_ORDER.indexOf(drug(b.product).klass));
    const isDischarge = kind === "discharge_summary";
    for (const m of home) {
      const d = drug(m.product);
      const k = key(m.id, `med_${d.ingredient.split(" ").slice(-1)[0] === "glargine" ? "glargine" : d.ingredient.split(" ")[0]}`);
      factKey.set(m.id, k);
      const aEntries = m.history.filter((h) => h.by === "A" && ms(h.at) <= ms(signed) && ms(h.at) >= ms(enc.start));
      const last = aEntries[aEntries.length - 1];
      const startedHere = m.history[0].by === "A";
      let status: string;
      if (!last) status = isDischarge ? "continue" : "not_reconciled";
      else if (last.status === "held") status = "held";
      else if (last.status === "stopped") status = "stopped";
      else if (startedHere) status = "new";
      else if (last.dose) status = "changed";
      else status = "continue";
      const s = rrhSig(p, m.id, last?.dose ? signed : enc.start);
      const own = last && last.doc === doc.key;
      payload[k] = {
        type: "home_med", drug_name: s.drugName, rxnorm_ingredient: d.ingredientRx, dose_text: s.doseText, sig: s.sig, status,
        ...(own && last.status === "held" && last.restartAdvice ? { restart_advice: last.restartAdvice } : {}),
        ...(own && last.instructions ? { instructions: last.instructions } : {}),
      };
    }
  };

  const plan = doc.plan ?? [];
  if (!plan.some((x) => x.kind === "allergies")) plan.push({ kind: "allergies" });
  if (!plan.some((x) => x.kind === "home-meds")) plan.push({ kind: "home-meds" });
  let vitalsN = 0;
  for (const it of plan) {
    switch (it.kind) {
      case "vitals": {
        const v = p.vitals.find((x) => x.id === it.vitalId)!;
        const k = key(v.id, vitalsN++ ? `vs_${vitalsN}` : "vs_1");
        factKey.set(v.id, k);
        payload[k] = {
          type: "vitals", taken: utcZ(v.at),
          ...(v.bp ? { bp: { systolic_mmhg: v.bp.systolic, diastolic_mmhg: v.bp.diastolic } } : {}),
          ...(v.pulse !== undefined ? { heart_rate_bpm: v.pulse } : {}),
          ...(v.resp !== undefined ? { resp_rate_per_min: v.resp } : {}),
          ...(v.tempF !== undefined ? { temp_f: v.tempF } : {}),
          ...(v.spo2 !== undefined ? { spo2_pct: v.spo2 } : {}),
          ...(v.weightKg !== undefined ? { weight_kg: v.weightKg } : {}),
        };
        break;
      }
      case "lab": {
        const labs = it.labIds.map((id) => p.labs.find((l) => l.id === id)!);
        const first = labs[0];
        const status = first.finalAt && ms(signed) < ms(first.finalAt) ? "preliminary" : "final";
        const groupCode = it.panel ?? LABS[first.analyte].code;
        const accession = ctx.id("A", "accession", `${first.draw}/${groupCode}`, (r) => {
          const dt = localDate(first.collectedAt, p.demographics.tz);
          const doy = Math.floor((Date.parse(dt) - Date.parse(dt.slice(0, 4) + "-01-01")) / 86400000) + 1;
          return `L${dt.slice(2, 4)}${String(doy).padStart(3, "0")}-${String(r.int(1, 9999)).padStart(4, "0")}`;
        });
        const k = key(it.key ?? first.id, it.key ?? (it.panel ? it.panel.toLowerCase() : first.analyte.replace(/-/g, "_")));
        for (const l of labs) factKey.set(l.id, k);
        if (it.panel) {
          payload[k] = {
            type: "panel", panel: PANELS[it.panel], accession, collected: utcZ(first.collectedAt), specimen: SPECIMEN[first.specimen], status,
            components: labs.map((l) => resultValue(p, l)),
          };
        } else {
          const rv = resultValue(p, first);
          payload[k] = {
            type: "result", test: rv.test, accession, collected: utcZ(first.collectedAt), specimen: SPECIMEN[first.specimen], status,
            value: rv.value, ...(rv.unit ? { unit: rv.unit } : {}), ref_range: rv.ref_range, ...(rv.flag ? { flag: rv.flag } : {}),
          };
        }
        break;
      }
      case "dx": {
        const { c, status, label, subtype } = condStatus(it.conditionId);
        const k = key(c.id, `dx_${c.id.replace(/^c_/, "")}`);
        factKey.set(c.id, k);
        const icd = c.coding.find((x) => x.system === "icd10")!.code;
        payload[k] = {
          type: "diagnosis", label,
          ...(status !== "working" ? { icd10cm: icd } : {}),
          ...(subtype === "sglt2i" ? { riverside_dx: { code: "RRH-DX-4471", name: "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" } } : {}),
          status: STATUS[status],
          ...(it.rank && !isEdDoc ? { rank: it.rank } : {}),
        };
        break;
      }
      case "adverse-dx": {
        const a = p.allergies.find((x) => x.id === it.allergyId)!;
        const k = key(a.id, "dx_adverse");
        factKey.set(a.id, k);
        const st = a.manifestation ? condStatus(a.manifestation).status : "active";
        const prod = p.meds.find((m) => m.rxnorm?.code === a.substance.code)?.product;
        payload[k] = {
          type: "diagnosis", label: `Adverse effect of ${a.substance.display}`, icd10cm: adverseIcd(prod ? drug(prod).klass : "other"),
          status: STATUS[st], ...(it.rank && !isEdDoc ? { rank: it.rank } : {}),
        };
        break;
      }
      case "history": {
        const c = p.conditions.find((x) => x.id === it.conditionId)!;
        const k = key(c.id, `hx_${c.id.replace(/^c_/, "")}`);
        factKey.set(`hx:${c.id}`, k);
        if (!factKey.has(c.id)) factKey.set(c.id, k);
        const bHist = [...c.history].reverse().find((h) => h.recordedBy !== "A" && h.icd10 && ms(h.at.includes("T") ? h.at : h.at + "T12:00:00Z") < ms(enc.start));
        const icd = bHist?.icd10 ?? c.coding.find((x) => x.system === "icd10")!.code;
        payload[k] = {
          type: "history", condition: it.label ?? c.name, ...(it.coded ? { icd10cm: icd } : {}),
          ...(it.onsetText ? { onset_text: it.onsetText } : {}), source: it.source,
        };
        break;
      }
      case "inpatient-med": {
        const m = p.meds.find((x) => x.id === it.medId)!;
        const route = m.route ?? "IV";
        const k = key(m.id, `${route === "IV" ? "iv" : route === "SubQ" ? "sc" : "po"}_${m.id.replace(/^i_/, "")}`);
        factKey.set(m.id, k);
        const started = m.history.find((h) => h.status === "active")!.at;
        const stopped = m.history.find((h) => h.status === "stopped" && ms(h.at) <= ms(signed))?.at;
        payload[k] = {
          type: "inpatient_med", drug_name: m.orderName ?? drug(m.product).ingredient, ...(m.rxnorm ? { rxnorm_ingredient: m.rxnorm.code } : {}),
          route, dose_text: m.doseText, started: utcZ(started), ...(stopped ? { stopped: utcZ(stopped) } : {}),
        };
        break;
      }
      case "follow-up": {
        payload[key(it.key ?? "fu", it.key ?? "fu_1")] = { type: "follow_up", with: it.with, when_text: it.when, purpose: it.purpose };
        break;
      }
      case "allergies": addAllergies(); break;
      case "home-meds": addHomeMeds(); break;
    }
  }

  const effective = kind === "discharge_summary" && admitted ? utcZ(admitted) : utcZ(isEdDoc ? enc.start : doc.at);
  const ex = ctx.example("A", itemKey);
  const recorded = ex?.recorded ?? utcZ(signed);
  const item: Item = {
    folio: "0.1", id: ex?.id ?? ulid(recorded, `A/${p.id}/${itemKey}`), issuer: ISSUER.A, patient: p.sources.A!.localId,
    effective, ...(kind === "discharge_summary" && enc.end ? { effective_end: utcZ(enc.end) } : {}), recorded,
    author: { id: `urn:riverside-regional:staff:${author.npi}`, name: author.name, role: author.role },
    schema: schemaRef("riverside", "RiversideEntry"), narrative: ex?.narrative ?? "", payload,
  };
  const consultSlug = { Endocrinologist: "endocrine-consult", Cardiologist: "cardiology-consult", Nephrologist: "nephrology-consult" }[author.role as string];
  const file = `${localDate(kind === "discharge_summary" ? enc.end ?? doc.at : doc.at, p.demographics.tz)}-${(doc.kind === "consult" && consultSlug) || FILE_SLUG[doc.kind]}.folio.md`;

  // Note request.
  const refs: NoteRequest["refs"] = [];
  const spans: NoteRequest["spans"] = [];
  const mustInclude: NoteRequest["mustInclude"] = [];
  const spanOf: Record<string, string> = {};
  const refSeen = new Set<string>();
  for (const id of doc.factIds) {
    const f = p.narrativeFacts.find((x) => x.id === id);
    if (f) {
      if (f.span?.A) { spans.push({ id: f.span.A, statement: f.statement, evidence: f.evidence }); spanOf[id] = f.span.A; }
      else mustInclude.push({ statement: f.statement, evidence: f.evidence });
      continue;
    }
    const k = factKey.get(id);
    if (k && !refSeen.has(k)) {
      refSeen.add(k);
      refs.push({ id: k, about: describeEntry(payload[k], () => describe(p, id, signed)) });
      spanOf[id] = k;
    } else if (k) spanOf[id] = k;
    else mustInclude.push({ statement: describe(p, id, signed), evidence: [] });
  }
  // Sensitive history lines and home meds in this document need their own spans if the note mentions them.
  const g = guards(p, "A", signed, [...doc.factIds, ...[...factKey.keys()].filter((id) => p.sensitivity.some((s) => s.factIds.includes(id)) && doc.factIds.includes(id))], spanOf);
  const context = Object.entries(payload).filter(([k]) => !refSeen.has(k) && k !== "enc").map(([k, v]) => `${k}: ${describeEntry(v)}`);
  const note: NoteRequest = {
    key: itemKey, source: "A", docKind: DOC_TITLE[doc.kind], when: wall(doc.at, p.demographics.tz).replace("T", " "),
    author: `${author.name} (${author.role})`, mode: "markdown", refs, spans, mustInclude, context,
    forbidden: g.forbidden, sensitive: g.sensitive,
    length: doc.kind === "progress" ? "150-250 words" : doc.kind === "discharge" ? "250-400 words" : "200-350 words",
    style: `riverside:${doc.kind}`,
  };
  const traps = new Set<string>(["T15", "T10", "T14"]);
  for (const id of doc.factIds) for (const t of (p.conditions.find((c) => c.id === id)?.traps ?? [])) traps.add(t);
  return {
    source: "A", dir: "riverside", key: itemKey, file, item,
    narrativeKind: ex ? "fixture" : "prose", note: ex ? undefined : note,
    template: templateNarrative(DOC_TITLE[doc.kind], refs, spans, mustInclude),
    facts: [...factKey.keys(), ...doc.factIds], traps: [...traps] as RenderedItem["traps"], fixture: ex?.file,
  };
}

const DOC_TITLE: Record<string, string> = {
  "ed-note": "ED provider note", "h&p": "Admission history and physical", progress: "Progress note",
  consult: "Consult note", discharge: "Discharge summary", "office-note": "Visit note", "phone-note": "Phone note",
  letter: "Letter", "patient-note": "Diary note",
};

export function describeEntry(e: Record<string, any> | undefined, fallback?: () => string): string {
  if (!e) return fallback?.() ?? "";
  switch (e.type) {
    case "panel": return `${e.panel.name}: ${e.components.map((c: any) => `${c.test.name} ${c.value}${c.unit ? " " + c.unit : ""}${c.flag ? ` (${c.flag})` : ""}`).join(", ")}`;
    case "result": return `${e.test.name} ${e.value}${e.unit ? " " + e.unit : ""} (${e.status})`;
    case "diagnosis": return `diagnosis "${e.label}", status ${e.status}`;
    case "history": return `past history: ${e.condition}`;
    case "home_med": return `home med ${e.drug_name}, ${e.dose_text} ${e.sig}: ${e.status}${e.restart_advice ? ` (${e.restart_advice})` : ""}${e.instructions ? ` "${e.instructions}"` : ""}`;
    case "inpatient_med": return `inpatient order ${e.drug_name} ${e.dose_text}${e.stopped ? " (stopped)" : ""}`;
    case "vitals": return `vitals BP ${e.bp?.systolic_mmhg}/${e.bp?.diastolic_mmhg}, HR ${e.heart_rate_bpm}`;
    case "allergy": return `allergy list: ${e.substance}${e.reaction ? ` (${e.reaction})` : ""}`;
    case "follow_up": return `follow-up with ${e.with} ${e.when_text}: ${e.purpose}`;
    default: return fallback?.() ?? JSON.stringify(e);
  }
}

export function templateNarrative(title: string, refs: NoteRequest["refs"], spans: NoteRequest["spans"], must: NoteRequest["mustInclude"]): string {
  const lines = [`## ${title}`, ""];
  for (const r of refs) lines.push(`- <ref id="${r.id}">${r.about.replace(/[<>]/g, "")}</ref>`);
  for (const s of spans) lines.push(`- <ref id="${s.id}">${s.statement.replace(/[<>]/g, "")}</ref>`);
  for (const m of must) lines.push(`- ${m.statement}`);
  return lines.join("\n");
}
