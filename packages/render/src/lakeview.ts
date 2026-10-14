// Source C, Lakeview Labs & Kidney Care: rows of its tables. One item per requisition (LAB_REQ,
// LAB_ORDER, LAB_RESULT) and one per nephrology contact (CLINIC_VISIT, VISIT_DX, VITAL, MED_ORDER,
// MED_STATUS_HIST). Corrections re-publish the requisition (supersedes); med status changes are
// history rows in later contacts (T1). Values are text plus a numeric copy with a sentinel (T9).

import { drug } from "../../truth/src/catalog.ts";
import {
  type Analyte, addMinutes, EGFR_2021_FROM, type Encounter, inZone, LAKEVIEW_LOINC_K_UACR_FROM, type LabDraw, type LabResult,
  localDate, ms, type Patient,
} from "../../truth/src/model.ts";
import { nameParts, staff } from "../../truth/src/staff.ts";
import { Ctx, factSlug, icdDisplay, ISSUER, type NoteRequest, type RenderedItem } from "./context.ts";
import { describe, evidenceFor, human } from "./describe.ts";
import { guards } from "./guards.ts";
import { type Item, schemaRef, ulid } from "./item.ts";
import { labFlag, templateNarrative } from "./riverside.ts";

type Spec = "SER" | "URN" | "WB";
interface Test { code: string; name: string; loinc?: string; loincFrom?: string; unit: string; range: (s: "F" | "M") => string; dec: number; crit?: { lo?: number; hi?: number } }

const TESTS: Partial<Record<Analyte, Test>> = {
  creatinine: { code: "LK-CREAT", name: "Creatinine, serum", loinc: "2160-0", unit: "mg/dL", range: (s) => (s === "F" ? "0.57-1.00" : "0.76-1.27"), dec: 2 },
  sodium: { code: "LK-NA", name: "Sodium, serum", loinc: "2951-2", unit: "mmol/L", range: () => "134-144", dec: 0, crit: { lo: 120, hi: 160 } },
  potassium: { code: "LK-K", name: "Potassium, serum", loinc: "2823-3", loincFrom: LAKEVIEW_LOINC_K_UACR_FROM, unit: "mmol/L", range: () => "3.5-5.1", dec: 1, crit: { lo: 3.0, hi: 6.0 } },
  glucose: { code: "LK-GLU", name: "Glucose, serum", loinc: "2345-7", unit: "mg/dL", range: () => "70-99", dec: 0, crit: { lo: 50, hi: 400 } },
  a1c: { code: "LK-A1C", name: "Hemoglobin A1c", loinc: "4548-4", unit: "%", range: () => "4.0-5.6", dec: 1 },
  uacr: { code: "LK-UACR", name: "Albumin/Creatinine Ratio, Urine", loinc: "9318-7", loincFrom: LAKEVIEW_LOINC_K_UACR_FROM, unit: "mg/g", range: () => "<30", dec: 0 },
  wbc: { code: "LK-WBC", name: "WBC", loinc: "6690-2", unit: "K/uL", range: () => "3.4-10.8", dec: 1 },
  hemoglobin: { code: "LK-HGB", name: "Hemoglobin", loinc: "718-7", unit: "g/dL", range: (s) => (s === "F" ? "11.1-15.9" : "13.0-17.7"), dec: 1 },
  platelets: { code: "LK-PLT", name: "Platelets", loinc: "777-3", unit: "K/uL", range: () => "150-450", dec: 0 },
  cholesterol: { code: "LK-CHOL", name: "Cholesterol, Total", loinc: "2093-3", unit: "mg/dL", range: () => "100-199", dec: 0 },
  triglycerides: { code: "LK-TRIG", name: "Triglycerides", loinc: "2571-8", unit: "mg/dL", range: () => "0-149", dec: 0 },
  hdl: { code: "LK-HDL", name: "HDL Cholesterol", loinc: "2085-9", unit: "mg/dL", range: () => ">39", dec: 0 },
  ldl: { code: "LK-LDLC", name: "LDL Cholesterol Calc", loinc: "13457-7", unit: "mg/dL", range: () => "0-99", dec: 0 },
};

const ORDER: Record<string, { code: string; name: string; spec: Spec; short: string }> = {
  creatinine: { code: "LK-CREAT", name: "Creatinine with eGFR", spec: "SER", short: "creat" },
  egfr: { code: "LK-CREAT", name: "Creatinine with eGFR", spec: "SER", short: "creat" },
  sodium: { code: "LK-NA", name: "Sodium", spec: "SER", short: "na" },
  potassium: { code: "LK-K", name: "Potassium", spec: "SER", short: "k" },
  glucose: { code: "LK-GLU", name: "Glucose", spec: "SER", short: "glu" },
  uacr: { code: "LK-UACR", name: "Albumin/creatinine ratio, urine", spec: "URN", short: "uacr" },
  a1c: { code: "LK-A1C", name: "Hemoglobin A1c", spec: "WB", short: "a1c" },
  wbc: { code: "LK-CBC", name: "CBC without differential", spec: "WB", short: "cbc" },
  hemoglobin: { code: "LK-CBC", name: "CBC without differential", spec: "WB", short: "cbc" },
  platelets: { code: "LK-CBC", name: "CBC without differential", spec: "WB", short: "cbc" },
  cholesterol: { code: "LK-LIPID", name: "Lipid panel", spec: "SER", short: "lipid" },
  triglycerides: { code: "LK-LIPID", name: "Lipid panel", spec: "SER", short: "lipid" },
  hdl: { code: "LK-LIPID", name: "Lipid panel", spec: "SER", short: "lipid" },
  ldl: { code: "LK-LIPID", name: "Lipid panel", spec: "SER", short: "lipid" },
};
const ORDER_SEQ = ["creat", "na", "k", "glu", "uacr", "a1c", "cbc", "lipid"];
const RES_SHORT: Partial<Record<Analyte, string>> = { creatinine: "creat", sodium: "na", potassium: "k", glucose: "glu", uacr: "uacr", a1c: "a1c", wbc: "wbc", hemoglobin: "hgb", platelets: "plt", egfr: "egfr", cholesterol: "chol", triglycerides: "trig", hdl: "hdl", ldl: "ldl" };

const EGFR09_COMMENT = "Calculated by CKD-EPI 2009. Report the African American value for patients who identify as African American.";
const EGFR21_COMMENT = "Calculated by CKD-EPI 2021 (race-free) equation.";

/** Lakeview formulary ids. Recent additions have no RxNorm mapping (T16). */
const FORMULARY: Record<string, { id: string; rxnorm: boolean }> = {
  "finerenone-10": { id: "LVD-04471", rxnorm: false },
  "spironolactone-25": { id: "LVD-00918", rxnorm: true },
  "losartan-50": { id: "LVD-00342", rxnorm: true },
  "losartan-100": { id: "LVD-00343", rxnorm: true },
  "dapagliflozin-10": { id: "LVD-03880", rxnorm: true },
  "empagliflozin-10": { id: "LVD-03712", rxnorm: true },
  "furosemide-40": { id: "LVD-00511", rxnorm: true },
  "amlodipine-5": { id: "LVD-00127", rxnorm: true },
  "amlodipine-10": { id: "LVD-00128", rxnorm: true },
  "lisinopril-20": { id: "LVD-00301", rxnorm: true },
  "valsartan-160": { id: "LVD-00377", rxnorm: true },
};

const MED_CODE: Record<string, 1 | 2 | 3 | 9> = { active: 1, stopped: 2, held: 3, "entered-in-error": 9 };

const clientOf = (d: LabDraw, ctx: Ctx) => {
  if (d.orderedBy === "B") return { code: "NGFM", name: "Northgate Family Medicine" };
  if (d.orderedBy === "C") return { code: "LVNEPH", name: "Lakeview Kidney Care" };
  return ctx.rng.fork(`client/${ctx.p.id}`).pick([{ code: "SPDC", name: "Springfield Diabetes Center" }, { code: "MSFP", name: "Maple Street Family Practice" }]);
};

function fmtCorrected(instant: string): string {
  const l = inZone(instant);
  return `${l.slice(5, 7)}/${l.slice(8, 10)}/${l.slice(2, 4)} ${l.slice(11, 16)}`;
}

export function renderLakeview(ctx: Ctx): RenderedItem[] {
  const p = ctx.p;
  if (!p.sources.C) return [];
  const out: RenderedItem[] = [];
  for (const d of p.draws.filter((x) => x.performedBy === "C")) out.push(...renderRequisition(ctx, d));
  const contacts = p.encounters.filter((e) => e.source === "C").sort((a, b) => ms(a.start) - ms(b.start));
  contacts.forEach((e, i) => out.push(renderContact(ctx, e, contacts.slice(0, i).some((x) => x.kind !== "phone"))));
  return out;
}

export function orderIdFor(ctx: Ctx, drawId: string, code: string, dup = false): string {
  return ctx.id("C", "order", `${drawId}/${code}${dup ? "/dup" : ""}`, (r) => `OR-${r.int(5000000, 9999999)}`);
}

export function accessionFor(ctx: Ctx, d: LabDraw, spec: Spec): string {
  return ctx.id("C", "accession", `${d.id}/${spec}`, (r) => {
    const dt = localDate(d.collectedAt);
    const doy = Math.floor((Date.parse(dt) - Date.parse(dt.slice(0, 4) + "-01-01")) / 86400000) + 1;
    return `LV${dt.slice(2, 4)}-${String(doy).padStart(3, "0")}-${String(r.int(1, 99999)).padStart(5, "0")}`;
  });
}

function resultIdFor(ctx: Ctx, labId: string): string {
  return ctx.id("C", "result", labId, (r) => `RS-${r.int(60000000, 99999999)}`);
}

function renderRequisition(ctx: Ctx, d: LabDraw): RenderedItem[] {
  const p = ctx.p;
  const sex = p.demographics.sex;
  const labs = p.labs.filter((l) => l.draw === d.id);
  const date = localDate(d.collectedAt);
  const reqId = ctx.id("C", "req", d.id, (r) => `RQ-${date.slice(2, 4)}${date.slice(5, 7)}${date.slice(8, 10)}${r.digits(4)}`);
  const orderer = d.orderingClinician ? staff(d.orderingClinician) : undefined;
  const client = clientOf(d, ctx);
  const received = d.receivedAt ?? addMinutes(d.collectedAt, 35 + ctx.rng.fork(`recv/${d.id}`).int(0, 60));

  // Orders: one per order code; a duplicate (entered-in-error) order is its own row.
  const orders = new Map<string, { code: string; name: string; spec: Spec; short: string; labs: LabResult[]; dup: boolean }>();
  for (const l of labs) {
    const o = ORDER[l.analyte];
    if (!o) throw new Error(`Lakeview cannot perform ${l.analyte}`);
    const dup = !!l.duplicateOf;
    const k = o.short + (dup ? "_dup" : "");
    if (!orders.has(k)) orders.set(k, { ...o, labs: [], dup });
    orders.get(k)!.labs.push(l);
  }
  const ordered = [...orders.entries()].sort(([a], [b]) => ORDER_SEQ.indexOf(a.replace("_dup", "")) - ORDER_SEQ.indexOf(b.replace("_dup", "")) || (a.endsWith("_dup") ? 1 : -1));

  const corrected = labs.filter((l) => l.status === "corrected-away" && l.correctedAt);
  const eie = labs.filter((l) => l.status === "entered-in-error");
  const lastResult = Math.max(...labs.map((l) => ms(l.resultedAt ?? addMinutes(l.collectedAt, 150))));
  const firstPub = Math.max(lastResult, ...eie.map((l) => ms(l.correctedAt ?? l.resultedAt!)));
  const versions: { at: string; correctedIds: Set<string> }[] = [{ at: addMinutes(new Date(firstPub).toISOString(), 6), correctedIds: new Set() }];
  if (corrected.length) {
    const t = Math.max(...corrected.map((l) => ms(l.correctedAt!)));
    versions.push({ at: addMinutes(new Date(t).toISOString(), 3), correctedIds: new Set(corrected.map((l) => l.id)) });
  }

  const items: RenderedItem[] = [];
  let prevId: string | undefined;
  versions.forEach((v, vi) => {
    const payload: Record<string, Record<string, unknown>> = {};
    payload.req = {
      type: "LAB_REQ", REQ_ID: reqId, CLIENT_CODE: client.code, CLIENT_NAME: client.name,
      ...(orderer?.npi ? { ORDERING_NPI: orderer.npi, ORDERING_NAME: `${nameParts(orderer).last}, ${nameParts(orderer).first} ${nameParts(orderer).cred}` } : {}),
      COLLECTED_AT: d.collectedAt, RECEIVED_AT: received, FASTING: d.fasting ?? "U",
    };
    for (const [k, o] of ordered) {
      const orderId = orderIdFor(ctx, d.id, o.code, o.dup);
      const lab0 = o.labs[0];
      const hem = o.labs.some((l) => l.annotations?.includes("hemolyzed"));
      const statusAt = o.dup ? lab0.correctedAt! : new Date(Math.max(...o.labs.map((l) => ms(l.resultedAt!)))).toISOString();
      let repeat: Record<string, string> = {};
      const conf = o.labs.find((l) => l.confirms);
      const replaced = p.labs.find((x) => o.labs.some((l) => x.replacedBy === l.id));
      if (conf) {
        const orig = p.labs.find((x) => x.id === conf.confirms)!;
        repeat = { REPEAT_OF_ORDER_ID: orderIdFor(ctx, orig.draw, ORDER[orig.analyte].code), REPEAT_REASON: "CONF" };
      } else if (replaced) {
        repeat = { REPEAT_OF_ORDER_ID: orderIdFor(ctx, replaced.draw, ORDER[replaced.analyte].code), REPEAT_REASON: replaced.annotations?.includes("hemolyzed") ? "HEM" : "QNS" };
      }
      payload[`ord_${k}`] = {
        type: "LAB_ORDER", ORDER_ID: orderId, REQ_ID: reqId, ORDER_CODE: o.code, ORDER_NAME: o.name, ACCESSION: accessionFor(ctx, d, o.spec),
        SPECIMEN_TYPE: o.spec, SPECIMEN_COND: hem ? "HEM" : "OK", ORDER_STATUS: o.dup ? 9 : 4, STATUS_AT: inZone(statusAt),
        ...(o.dup ? { STATUS_REASON: "Duplicate order" } : {}), ...repeat,
      };
    }
    for (const [k, o] of ordered) {
      const orderId = orderIdFor(ctx, d.id, o.code, o.dup);
      for (const l of o.labs) {
        if (l.analyte === "egfr") {
          const cr = p.labs.find((x) => x.id === l.derivedFrom![0])!;
          const crId = resultIdFor(ctx, cr.id);
          const two = (l.reported ?? []).filter((r) => r.equation !== "ckd-epi-2021");
          const rows = two.length ? two : (l.reported ?? [{ equation: "ckd-epi-2021" as const, value: l.value }]);
          for (const r of rows) {
            const n = r.equation === "ckd-epi-2009-nonaa" ? "n" : r.equation === "ckd-epi-2009-aa" ? "a" : "";
            const text = `${r.comparator ?? ""}${r.value}`;
            const flag = labFlag(r.value, r.comparator, ">59");
            payload[`res_egfr${n ? "_" + n : ""}`] = {
              type: "LAB_RESULT", RESULT_ID: ctx.id("C", "result", n ? `${l.id}/${n}` : l.id, (rr) => `RS-${rr.int(60000000, 99999999)}`), ORDER_ID: orderId,
              TEST_CODE: n === "n" ? "LK-EGFR09N" : n === "a" ? "LK-EGFR09A" : "LK-EGFR21",
              TEST_NAME: n === "n" ? "eGFR (non-African American)" : n === "a" ? "eGFR (African American)" : "eGFR",
              ...(r.loinc ? { LOINC: r.loinc } : {}),
              VALUE_TEXT: text, VALUE_NUM: r.comparator ? 9999999 : r.value, UNIT_CODE: "mL/min/1.73m2", REF_RANGE_TEXT: ">59",
              ABN_FLAG: flag ?? "N", RESULT_STATUS: v.correctedIds.has(cr.id) ? "C" : "F", RESULTED_AT: inZone(l.resultedAt!),
              DERIVED_FROM_RESULT_ID: crId, COMMENT_TEXT: n ? EGFR09_COMMENT : EGFR21_COMMENT,
            };
          }
          continue;
        }
        const t = TESTS[l.analyte]!;
        const range = t.range(sex);
        const text = `${l.comparator ?? ""}${l.value.toFixed(t.dec)}`;
        const flag = labFlag(l.value, l.comparator, range, t.crit);
        const withdrawn = v.correctedIds.has(l.id);
        const resulted = localDate(l.resultedAt!);
        const comment = commentFor(ctx, l, d, withdrawn);
        const short = RES_SHORT[l.analyte]! + (l.duplicateOf ? "_dup" : "");
        payload[`res_${short}`] = {
          type: "LAB_RESULT", RESULT_ID: resultIdFor(ctx, l.id), ORDER_ID: orderId, TEST_CODE: t.code, TEST_NAME: t.name,
          ...(t.loinc && (!t.loincFrom || resulted >= t.loincFrom) ? { LOINC: t.loinc } : {}),
          VALUE_TEXT: text, VALUE_NUM: l.comparator ? 9999999 : Number(text), UNIT_CODE: t.unit, REF_RANGE_TEXT: range,
          ABN_FLAG: flag ?? "N", RESULT_STATUS: withdrawn ? "C" : "F", RESULTED_AT: inZone(l.resultedAt!),
          ...(withdrawn ? { STATUS_CHANGED_AT: inZone(l.correctedAt!), ...(l.replacedBy ? { REPLACED_BY_RESULT_ID: resultIdFor(ctx, l.replacedBy) } : {}) } : {}),
          ...(l.analyte === "ldl" && l.derivedFrom ? { DERIVED_FROM_RESULT_ID: resultIdFor(ctx, l.derivedFrom.find((x) => p.labs.find((y) => y.id === x)?.analyte === "cholesterol") ?? l.derivedFrom[0]) } : {}),
          ...(comment ? { COMMENT_TEXT: comment } : {}),
        };
        void k;
      }
    }
    const itemKey = `C/lab/${d.id}/${vi}`;
    const ex = ctx.example("C", itemKey);
    const recorded = ex?.recorded ?? v.at;
    const id = ex?.id ?? ctx.hints.itemIds[itemKey] ?? ulid(recorded, `C/${p.id}/${itemKey}`);
    const item: Item = {
      folio: "0.1", id, issuer: ISSUER.C, patient: p.sources.C!.localId, effective: d.collectedAt, recorded,
      schema: schemaRef("lakeview", "LabReportRow"), ...(prevId ? { supersedes: [prevId] } : {}), narrative: "", payload,
    };
    prevId = id;
    const traps = new Set<string>(["T14", "T16"]);
    for (const l of labs) for (const t of l.traps ?? []) traps.add(t);
    if (vi > 0) traps.add("T3"), traps.add("T2");
    items.push({
      source: "C", dir: "lakeview", key: itemKey, file: `${localDate(d.collectedAt)}-lab-${reqId.toLowerCase()}${vi ? "-corrected" : ""}.folio.md`,
      item, narrativeKind: "none", facts: labs.map((l) => l.id), traps: [...traps] as RenderedItem["traps"], fixture: ex?.file,
    });
  });
  return items;
}

function commentFor(ctx: Ctx, l: LabResult, d: LabDraw, withdrawn: boolean): string | undefined {
  const p = ctx.p;
  if (l.annotations?.includes("hemolyzed")) {
    const t = TESTS[l.analyte]!;
    const flag = labFlag(l.value, l.comparator, t.range(p.demographics.sex), t.crit);
    let c = `Specimen hemolyzed; ${l.analyte} may be falsely elevated. Recollection requested.`;
    if (flag === "HH") {
      const callee = ctx.id("C", "callee", l.id, (r) => d.orderedBy === "B" ? r.pick(["N. Ortiz RN", "K. Foster RN"]) : `Dr. ${nameParts(staff(d.orderingClinician!)).last}`);
      c += ` Called to ${callee} ${inZone(addMinutes(l.resultedAt!, 6)).slice(11, 16)}.`;
    }
    if (withdrawn) {
      const repl = l.replacedBy ? p.labs.find((x) => x.id === l.replacedBy) : undefined;
      const replDraw = repl ? p.draws.find((x) => x.id === repl.draw) : undefined;
      c += ` CORRECTED ${fmtCorrected(l.correctedAt!)}: result invalidated${replDraw ? `, see recollected specimen ${accessionFor(ctx, replDraw, ORDER[repl!.analyte].spec)}` : ""}.`;
    }
    return c;
  }
  if (l.analyte === "ldl") return "Calculated (Friedewald).";
  if (l.annotations?.includes("not hemolyzed") && p.labs.some((x) => x.confirms === l.id)) {
    const by = d.orderingClinician ? `Dr. ${nameParts(staff(d.orderingClinician)).last}` : "the ordering clinician";
    return `No hemolysis detected. Repeat requested by ${by}.`;
  }
  return undefined;
}

function renderContact(ctx: Ctx, e: Encounter, seenBefore: boolean): RenderedItem {
  const p = ctx.p;
  const doc = e.documents[0];
  const prov = staff(e.clinician ?? doc.author);
  const visitId = ctx.id("C", "visit", e.id, (r) => `NV-${r.int(100000, 119999)}`);
  const date = localDate(e.start);
  const payload: Record<string, Record<string, unknown>> = {};
  const factKey = new Map<string, string>();
  payload.visit = {
    type: "CLINIC_VISIT", VISIT_ID: visitId, VISIT_TYPE: e.kind === "phone" ? "TEL" : seenBefore ? "FU" : "NP", VISIT_AT: e.start,
    PROVIDER_NPI: prov.npi, ...(e.ckdCategory ? { CKD_G: e.ckdCategory.g, ...(e.ckdCategory.a ? { CKD_A: e.ckdCategory.a } : {}) } : {}),
    ...(!seenBefore && e.kind !== "phone" && e.referredBy ? { REFERRED_BY_TEXT: e.referredBy } : {}),
  };
  (e.addressed ?? []).forEach((a, i) => {
    const c = p.conditions.find((x) => x.id === a.conditionId)!;
    const hist = a.status === "history";
    const k = ctx.key("C", c.id, `dx_${factSlug(p, c.id)}`) + (hist ? "_hx" : "");
    factKey.set(c.id, k);
    const icd = a.icd10 ?? [...c.history].reverse().find((h) => h.icd10 && h.at <= e.start)?.icd10 ?? c.coding.find((x) => x.system === "icd10")!.code;
    payload[k] = {
      type: "VISIT_DX", VISIT_ID: visitId, DX_RANK: i + 1, ICD10CM: icd, DX_TEXT: a.label ?? icdDisplay(icd),
      DX_STATUS: hist ? "H" : a.status === "working" ? "P" : a.status === "ruled-out" ? "R" : "A",
    };
  });
  for (const v of p.vitals.filter((x) => x.source === "C" && localDate(x.at) === date)) {
    const rows: [string, "BPS" | "BPD" | "HR" | "WT", number | undefined, string, number, string][] = [
      ["bp_sys", "BPS", v.bp?.systolic, "mmHg", 1, v.at], ["bp_dia", "BPD", v.bp?.diastolic, "mmHg", 1, v.at],
      ["bp_sys_2", "BPS", v.bpRepeat?.systolic, "mmHg", 2, addMinutes(v.at, 5)], ["bp_dia_2", "BPD", v.bpRepeat?.diastolic, "mmHg", 2, addMinutes(v.at, 5)],
      ["hr", "HR", v.pulse, "/min", 1, v.at], ["wt", "WT", v.weightKg, "kg", 1, addMinutes(v.at, -2)],
    ];
    for (const [k, code, val, unit, n, t] of rows) {
      if (val === undefined) continue;
      payload[k] = { type: "VITAL", VISIT_ID: visitId, VITAL_CODE: code, VALUE_NUM: val, UNIT_CODE: unit, READING_NO: n, TAKEN_AT: t };
    }
    factKey.set(v.id, "bp_sys");
  }
  for (const m of p.meds) {
    const cEntries = m.history.filter((h) => h.by === "C");
    cEntries.forEach((h, i) => {
      if (localDate(h.at) !== date) return;
      const d = drug(h.product ?? m.product);
      const short = d.ingredient.split(" ")[0];
      const rxId = ctx.id("C", "rx", m.id, (r) => `RX-${r.int(20000, 39999)}`);
      if (i === 0) {
        const f = FORMULARY[d.key] ?? { id: `LVD-${String(ctx.rng.fork(`lvd/${d.key}`).int(1000, 4999)).padStart(5, "0")}`, rxnorm: true };
        factKey.set(m.id, `rx_${short}`);
        payload[`rx_${short}`] = {
          type: "MED_ORDER", RX_ID: rxId, VISIT_ID: visitId, LV_DRUG_ID: f.id, DRUG_NAME: `${d.ingredient} ${d.strength} mg ${d.form}`,
          ...(f.rxnorm && d.scd ? { RXNORM: d.scd } : {}),
          DOSE_QTY: (h.dose ?? m.dose)!.value, DOSE_UNIT: (h.dose ?? m.dose)!.unit === "units" ? "unit" : (h.dose ?? m.dose)!.unit,
          ROUTE: d.form === "pen" ? "SC" : "PO", FREQ_CODE: m.frequency === "QHS" ? "QHS" : m.frequency,
          MED_STATUS: MED_CODE[h.status], START_DATE: h.status === "active" ? nextDay(date) : date, PRESCRIBER_NPI: prov.npi,
        };
      } else {
        const prev = cEntries[i - 1];
        const verb = h.status === "held" ? "hold" : h.status === "stopped" ? "stop" : h.status === "active" ? "resume" : "void";
        const k = `${verb}_${short}`;
        factKey.set(m.id, k);
        payload[k] = {
          type: "MED_STATUS_HIST", HIST_ID: ctx.id("C", "hist", `${m.id}/${i}`, (r) => `MH-${r.int(5000000, 5999999)}`), VISIT_ID: visitId,
          RX_ID: rxId, OLD_STATUS: MED_CODE[prev.status], NEW_STATUS: MED_CODE[h.status], CHANGED_AT: h.at,
          REASON_CODE: /\bK\b|potassium|eGFR|creatinine|lab/i.test(h.reason ?? "") ? "LAB" : h.stopReason === "adverse_reaction" ? "ADR" : h.stopReason === "patient_choice" ? "PT" : "OTH",
          ...(h.status === "held" && h.reviewOn ? { REVIEW_DATE: h.reviewOn } : {}), ...(h.reason ? { COMMENT_TEXT: h.reason } : {}),
        };
      }
    });
  }

  const itemKey = `C/contact/${e.id}`;
  const ex = ctx.example("C", itemKey);
  const recorded = ex?.recorded ?? doc.signedAt;
  const item: Item = {
    folio: "0.1", id: ex?.id ?? ulid(recorded, `C/${p.id}/${itemKey}`), issuer: ISSUER.C, patient: p.sources.C!.localId, effective: e.start, recorded,
    author: { id: `npi:${prov.npi}`, name: prov.name, role: prov.role }, schema: schemaRef("lakeview", "ClinicRow"),
    narrative: ex?.narrative ?? "", payload,
  };
  // Note request.
  const refs: NoteRequest["refs"] = [];
  const spans: NoteRequest["spans"] = [];
  const mustInclude: NoteRequest["mustInclude"] = [];
  const spanOf: Record<string, string> = {};
  const context: string[] = [];
  for (const id of doc.factIds) {
    const f = p.narrativeFacts.find((x) => x.id === id);
    if (f && !f.span?.C) { mustInclude.push({ statement: f.statement, evidence: f.evidence }); continue; }
    if (f?.span?.C) { spans.push({ id: f.span.C, statement: f.statement, evidence: f.evidence }); spanOf[id] = f.span.C; continue; }
    const k = factKey.get(id);
    if (k && !refs.some((r) => r.id === k)) { refs.push({ id: k, about: describe(p, id, doc.signedAt) }); spanOf[id] = k; continue; }
    if (p.labs.some((l) => l.id === id) || changedOn(p, id, e.start)) mustInclude.push({ statement: p.meds.some((m) => m.id === id) ? describe(p, id, doc.signedAt) : human(p, id, doc.signedAt, "C"), evidence: evidenceFor(p, id) });
    else context.push(p.meds.some((m) => m.id === id) ? describe(p, id, doc.signedAt) : human(p, id, doc.signedAt, "C"));
  }
  const g = guards(p, "C", doc.signedAt, doc.factIds, spanOf);
  const note: NoteRequest = {
    key: itemKey, source: "C", docKind: e.kind === "phone" ? "Nephrology telephone contact note" : seenBefore ? "Nephrology follow-up note" : "Nephrology new-patient note",
    when: inZone(e.start).slice(0, 16).replace("T", " "), author: `${prov.name} (${prov.role})`, mode: "markdown", refs, spans, mustInclude,
    context: [...context, ...(e.addressed ?? []).map((a) => `visit diagnosis: ${a.label ?? icdDisplay(a.icd10 ?? "")} (${a.status ?? "active"})`),
      ...(e.ckdCategory ? [`CKD category ${e.ckdCategory.g}${e.ckdCategory.a ?? ""}`] : [])],
    forbidden: g.forbidden, sensitive: g.sensitive, length: e.kind === "phone" ? "1-3 short lines" : "60-140 words in 3-5 short paragraphs",
    style: e.kind === "phone" ? "lakeview:phone" : "lakeview:visit",
  };
  const traps = new Set<string>();
  if (Object.values(payload).some((x) => x.type === "MED_STATUS_HIST" && x.NEW_STATUS === 3)) traps.add("T1");
  if (e.ckdCategory) traps.add("T5");
  if (spans.length) traps.add("T13");
  if (doc.factIds.some((id) => p.sensitivity.some((s) => s.factIds.includes(id)))) traps.add("T19");
  return {
    source: "C", dir: "lakeview", key: itemKey, file: `${date}-${e.kind === "phone" ? "phone" : seenBefore ? "follow-up-visit" : "new-visit"}.folio.md`,
    item, narrativeKind: ex ? "fixture" : "prose", note: ex ? undefined : note, template: templateNarrative("", refs, spans, mustInclude).replace(/^## \n\n/, ""),
    facts: [...factKey.keys(), ...doc.factIds], traps: [...traps] as RenderedItem["traps"], fixture: ex?.file,
  };
}

function changedOn(p: Patient, id: string, start: string): boolean {
  const m = p.meds.find((x) => x.id === id);
  return !!m && m.history.some((h) => h.at.includes("T") && localDate(h.at) === localDate(start));
}

function nextDay(d: string): string {
  return new Date(Date.parse(d + "T12:00:00Z") + 86400000).toISOString().slice(0, 10);
}

export { EGFR_2021_FROM };
