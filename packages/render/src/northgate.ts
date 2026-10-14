// Source B, Northgate Family Medicine: an event log. One item per visit note, vital set, med change,
// problem change, allergy change, list review, imported result report (copies of Lakeview's rows,
// T14), referral step and void. The current lists are replayed per line id; outside lines lag (T1).

import { drug } from "../../truth/src/catalog.ts";
import {
  addMinutes, type Condition, type Encounter, inZone, localDate, type MedHistoryEntry, type Medication, ms, type Patient,
  type SourceKey, sortKey,
} from "../../truth/src/model.ts";
import { nameParts, STAFF, staff } from "../../truth/src/staff.ts";
import { Ctx, icdDisplay, ISSUER, type NoteRequest, type RenderedItem } from "./context.ts";
import { describe, evidenceFor, medDoseAt } from "./describe.ts";
import { guards } from "./guards.ts";
import { type Item, schemaRef, ulid } from "./item.ts";

const NFM: Record<string, { code: string; name: string; key: string }> = {
  "LK-CREAT": { code: "CREAT", name: "Creatinine, serum", key: "creat" },
  "LK-EGFR09N": { code: "EGFR-NAA", name: "eGFR (non-African American)", key: "egfr_naa" },
  "LK-EGFR09A": { code: "EGFR-AA", name: "eGFR (African American)", key: "egfr_aa" },
  "LK-EGFR21": { code: "EGFR", name: "eGFR (CKD-EPI 2021)", key: "egfr" },
  "LK-NA": { code: "NA", name: "Sodium, serum", key: "na" },
  "LK-K": { code: "K", name: "Potassium, serum", key: "k" },
  "LK-GLU": { code: "GLU", name: "Glucose, serum", key: "glu" },
  "LK-A1C": { code: "A1C", name: "Hemoglobin A1c", key: "a1c" },
  "LK-UACR": { code: "UACR", name: "Albumin/creatinine ratio, urine", key: "uacr" },
  "LK-WBC": { code: "WBC", name: "White blood cell count", key: "wbc" },
  "LK-HGB": { code: "HGB", name: "Hemoglobin", key: "hgb" },
  "LK-PLT": { code: "PLT", name: "Platelet count", key: "plt" },
};

const FREQ_SIG: Record<string, string> = { QD: "daily", BID: "twice daily", TID: "three times daily", QHS: "at bedtime", PRN: "as needed", QW: "once weekly" };

function sig(p: Patient, m: Medication, when: string) {
  const { drug: d, dose, frequency } = medDoseAt(p, m.id, when);
  if (d.form === "pen") {
    const amt = dose ? `${dose.value} ${dose.unit}` : "as directed";
    return { name: d.scdName, rxnorm: d.scd, dose: dose ? { value: dose.value, unit: dose.unit === "units" ? "units" : dose.unit } : undefined, frequency: frequency === "QW" ? "OTHER" : frequency, sig: `Inject ${amt} under the skin ${FREQ_SIG[frequency]}` };
  }
  const tabs = dose ? dose.value / d.strength : 1;
  const t = tabs === 0.5 ? "1/2 tablet" : tabs === 1 ? "1 tablet" : `${tabs} tablets`;
  return {
    name: d.scdName, rxnorm: d.scd, dose: dose ? { value: dose.value, unit: dose.unit } : undefined, frequency: frequency === "QW" ? "OTHER" : frequency,
    sig: `Take ${t} by mouth ${FREQ_SIG[frequency]}${d.klass === "biguanide" ? " with meals" : ""}`,
  };
}

export function renderNorthgate(ctx: Ctx, lakeview: RenderedItem[]): RenderedItem[] {
  const p = ctx.p;
  if (!p.sources.B) return [];
  const out: RenderedItem[] = [];
  const encs = p.encounters.filter((e) => e.source === "B").sort((a, b) => ms(a.start) - ms(b.start));
  const pcp = encs[0]?.clinician ?? "ngf:treyes";
  const nurse = ctx.id("B", "nurse", "patient", (r) => r.pick(STAFF.filter((s) => s.source === "B" && s.role === "Registered nurse").map((s) => s.id)));
  const encOn = (when: string) => encs.find((e) => localDate(e.start) === localDate(when) && e.kind !== "phone");
  const visitId = (e: Encounter) => ctx.id("B", "visit", e.id, (r) => `V-${localDate(e.start).slice(0, 4)}-${localDate(e.start).slice(5, 7)}${localDate(e.start).slice(8, 10)}${r.int(1, 9)}${r.int(1, 9)}`);
  const author = (sid: string) => { const s = staff(sid); return { id: `urn:northgate-fm.example:staff:${s.short}`, name: s.name, role: s.role }; };
  const push = (r: Omit<RenderedItem, "source" | "dir">) => out.push({ source: "B", dir: "northgate", ...r });
  const firstEnc = encs[0];

  const mk = (itemKey: string, effective: string, recorded: string, payload: Item["payload"], extra: Partial<Item> = {}, who?: string): Item => {
    const ex = ctx.example("B", itemKey);
    const rec = ex?.recorded ?? recorded;
    return {
      folio: "0.1", id: ex?.id ?? ctx.hints.itemIds[itemKey] ?? ulid(rec, `B/${p.id}/${itemKey}`), issuer: ISSUER.B, patient: p.sources.B!.localId,
      effective, recorded: rec, ...(who ? { author: author(who) } : {}), schema: schemaRef("northgate", "ChartEvent"), ...extra,
      narrative: ex?.narrative ?? "", payload,
    };
  };
  const finish = (it: Item, key: string) => ({ ex: ctx.example("B", key) });

  // Problem lines.
  const problemLine = new Map<string, string>();
  for (const c of p.conditions) {
    const bh = c.history.filter((h) => h.recordedBy === "B");
    bh.forEach((h, i) => {
      const pid = ctx.id("B", "problem", c.id, (r) => `PL-${r.int(9000, 19999)}`);
      problemLine.set(c.id, pid);
      const action = i === 0 ? "add" : h.status === "resolved" ? "resolve" : "update";
      const day = localDate(h.at);
      const enc = encOn(h.at.includes("T") ? h.at : day + "T12:00:00-06:00") ?? encs.find((e) => localDate(e.start) === day);
      const created = localDate(bh[0].at);
      const stage = h.stage ?? [...bh.slice(0, i)].reverse().find((x) => x.stage)?.stage;
      const desc = stage ? `Chronic kidney disease stage ${stage}` : c.name;
      const icd = h.icd10 ?? [...bh.slice(0, i)].reverse().find((x) => x.icd10)?.icd10 ?? c.coding.find((x) => x.system === "icd10")!.code;
      const snomed = created >= "2020-01-01" ? h.snomed ?? c.coding.find((x) => x.system === "snomed")!.code : undefined;
      const onset = c.onset.length === 4 ? { date: `${c.onset}-01-01`, precision: "year" } : c.onset.length === 7 ? { date: `${c.onset}-01`, precision: "month" } : { date: c.onset.slice(0, 10), precision: "day" };
      const itemKey = `B/problem/${c.id}/${i}`;
      const recorded = enc ? addMinutes(enc.start, 32 + i) : inZone(day + "T16:25:10" + inZone(day + "T12:00:00Z").slice(19));
      const payload = {
        prob_1: {
          type: "problem_event", problem_id: pid, action, description: desc, icd10cm: icd, ...(snomed ? { snomed } : {}), onset,
          ...(c.sensitive ? { restricted: "BH" } : {}), ...(enc ? { visit_id: visitId(enc) } : {}),
        },
      };
      const it = mk(itemKey, day, recorded, payload, {}, enc?.clinician ?? pcp);
      const ex = finish(it, itemKey).ex;
      const note = eventNote(ctx, itemKey, "Problem list comment", h.at.includes("T") ? h.at : recorded, [{ id: "prob_1", about: `${action} problem "${desc}" (${icd}), onset ${c.onset}` }], [c.id], enc?.clinician ?? pcp);
      push({
        key: itemKey, file: `${day}-problem-${c.id.replace(/^c_/, "")}-${action}.folio.md`, item: it, narrativeKind: ex ? "fixture" : "prose", note: ex ? undefined : note,
        template: `<ref id="prob_1">${desc}.</ref>`, facts: [c.id], traps: problemTraps(c, i), fixture: ex?.file,
      });
    });
  }

  // Allergy lines.
  for (const a of p.allergies.filter((x) => x.recordedBy === "B")) {
    const aid = ctx.id("B", "allergy", a.id, (r) => `AL-${r.int(2000, 4999)}`);
    const enc = encOn(a.recordedAt);
    const itemKey = `B/allergy/${a.id}/0`;
    const onset = a.onset.length === 4 ? { date: `${a.onset}-01-01`, precision: "year" } : a.onset.length === 7 ? { date: `${a.onset}-01`, precision: "month" } : { date: a.onset, precision: "day" };
    const payload = {
      alg_1: {
        type: "allergy_event", allergy_id: aid, action: "add", substance: { name: a.substance.display, rxnorm: a.substance.code },
        reaction_type: a.type === "adverse-reaction" ? "adverse_reaction" : a.type, reactions: a.reactions, severity: a.criticality,
        onset, ...(enc ? { visit_id: visitId(enc) } : {}),
      },
    };
    const it = mk(itemKey, a.recordedAt, addMinutes(a.recordedAt, 0.3), payload, {}, enc?.clinician ?? pcp);
    const ex = ctx.example("B", itemKey);
    const negs = p.narrativeFacts.filter((f) => f.about?.includes(a.id) && f.visibility.B);
    const note = eventNote(ctx, itemKey, "Allergy list comment", a.recordedAt, [{ id: "alg_1", about: `${a.substance.display}: ${a.reaction} (${a.type})` }], [a.id, ...negs.map((n) => n.id)], enc?.clinician ?? pcp);
    push({
      key: itemKey, file: `${localDate(a.recordedAt)}-allergy-${a.substance.display.split(" ")[0]}.folio.md`, item: it, narrativeKind: ex ? "fixture" : "prose",
      note: ex ? undefined : note, template: `<ref id="alg_1">${a.substance.display}: ${a.reaction}.</ref>${negs.map((n) => " " + n.statement).join("")}`,
      facts: [a.id, ...negs.map((n) => n.id)], traps: (a.traps ?? []) as RenderedItem["traps"], fixture: ex?.file,
    });
  }

  // Medication lines.
  const medLines: { medId: string; lineId: string; start: string; end?: string; outside?: boolean }[] = [];
  for (const m of p.meds.filter((x) => x.setting !== "inpatient")) {
    const bEntries = m.history.filter((h) => h.by === "B");
    let lineId: string | undefined;
    let state: "active" | "held" | undefined;
    let n = 0;
    let lineIdx = 0;
    for (const h of bEntries) {
      let at = h.at;
      if (!at.includes("T")) {
        if (!firstEnc) continue;
        at = addMinutes(firstEnc.start, 15 + p.meds.indexOf(m));
      }
      const enc = encOn(at);
      let action: string | undefined;
      if (h.status === "entered-in-error") {
        // Void the start event of this line.
        const voided = `B/med/${m.id}/${n - 1}`;
        const voidedItem = out.find((x) => x.key === voided);
        const itemKey = `B/void/${m.id}`;
        const it = mk(itemKey, at, at, { void_1: { type: "chart_correction", voided_items: [voidedItem!.item.id], reason: /wrong patient/i.test(h.reason ?? "") ? "wrong_patient" : /duplicate/i.test(h.reason ?? "") ? "duplicate" : "entry_error" } },
          { retracts: [voidedItem!.item.id] }, pcp);
        const ex = ctx.example("B", itemKey);
        const others = p.meds.filter((x) => x !== m && x.rxnorm?.code === m.rxnorm?.code && x.history.some((e) => e.status === "active"));
        const note = eventNote(ctx, itemKey, "Chart correction comment", at, [], [m.id, ...others.map((o) => o.id)], pcp);
        note.mustInclude.push({ statement: `The ${drug(m.product).ingredient} ${m.doseText} start entered ${localDate(voidedItem!.item.effective)} was ${h.reason ?? "entered in error"}`, evidence: [[drug(m.product).ingredient.split(" ")[0]], [/wrong patient/i.test(h.reason ?? "") ? "wrong (chart|patient)|not this patient|another patient" : "error|mistake|wrong"]] });
        push({ key: itemKey, file: `${localDate(at)}-void.folio.md`, item: it, narrativeKind: ex ? "fixture" : "prose", note: ex ? undefined : note,
          template: `${drug(m.product).ingredient} ${m.doseText} entered in error.`, facts: [m.id], traps: ["T4"], fixture: ex?.file });
        if (lineId) medLines.find((l) => l.lineId === lineId)!.end = at;
        lineId = undefined; state = undefined;
        continue;
      }
      if (!lineId) {
        if (h.status !== "active") continue;
        lineId = ctx.id("B", "med", lineIdx ? `${m.id}/${lineIdx}` : m.id, (r) => `ML-${r.int(10000, 49999)}`);
        lineIdx++;
        action = "start";
        state = "active";
        medLines.push({ medId: m.id, lineId, start: at });
      } else if (h.status === "stopped") { action = "stop"; }
      else if (h.status === "held") { action = state === "held" ? undefined : "hold"; state = "held"; }
      else if (h.status === "active" && state === "held") { action = "resume"; state = "active"; }
      else if (h.status === "active" && (h.dose || h.product || h.frequency)) action = "change";
      if (!action) continue;
      const s = sig(p, m, action === "stop" || action === "hold" ? addMinutes(at, -1) : at);
      const itemKey = `B/med/${m.id}/${n++}`;
      const who = enc?.clinician ?? pcp;
      const payload = {
        med_1: {
          type: "med_event", med_id: lineId, action, origin: "northgate", drug: { name: s.name, ...(s.rxnorm ? { rxnorm: s.rxnorm } : {}) },
          ...(s.dose ? { dose: s.dose } : {}), frequency: s.frequency, sig: s.sig,
          ...(action === "stop" ? { stop_reason: h.stopReason ?? "other" } : {}),
          ...(h.reason && !(action === "start" && !h.reason) ? { reason_text: h.reason } : {}),
          ...(action === "hold" && h.reviewOn ? { review_on: h.reviewOn } : {}),
          ...(m.sensitive ? { restricted: "BH" } : {}), ...(enc ? { visit_id: visitId(enc) } : {}),
        },
      };
      const it = mk(itemKey, at, addMinutes(at, 0.7), payload, {}, who);
      const ex = ctx.example("B", itemKey);
      const wantsNote = action !== "start" || !!h.reason;
      const note = eventNote(ctx, itemKey, "Medication event comment", at, [{ id: "med_1", about: `${action} ${s.name}${s.dose ? ` ${s.dose.value} ${s.dose.unit}` : ""} ${s.frequency}${h.reason ? `; reason: ${h.reason}` : ""}` }], [m.id], who);
      push({
        key: itemKey, file: `${localDate(at)}-med-${drug(m.product).ingredient.split(" ").slice(-1)[0]}-${action}.folio.md`, item: it,
        narrativeKind: ex ? "fixture" : wantsNote ? "prose" : "none", note: ex || !wantsNote ? undefined : note,
        template: wantsNote ? `<ref id="med_1">${action} ${drug(m.product).ingredient}${h.reason ? `: ${h.reason}` : ""}.</ref>` : undefined,
        facts: [m.id], traps: medTraps(m, action), fixture: ex?.file,
      });
      if (action === "stop") { medLines.find((l) => l.lineId === lineId)!.end = at; lineId = undefined; state = undefined; }
    }
    // A line copied from another organization's record and never updated (T1).
    for (const lag of m.laggingLines ?? []) {
      if (lag.source !== "B") continue;
      const lineId2 = ctx.id("B", "med", m.id, (r) => `ML-${r.int(10000, 49999)}`);
      medLines.push({ medId: m.id, lineId: lineId2, start: lag.since, outside: true });
      const d = drug(m.product);
      const cStart = m.history.find((h) => h.by === m.prescriber)!;
      const prescriberName = p.encounters.find((e) => e.source === m.prescriber && localDate(e.start) === localDate(cStart.at))?.clinician;
      const itemKey = `B/outside/${m.id}`;
      const dt = localDate(cStart.at);
      const payload = {
        med_1: {
          type: "med_event", med_id: lineId2, action: "start", origin: "outside",
          drug: { name: `${d.ingredient} ${d.strength} mg ${d.form}`, outside_code: { system: "lakeview-drug", code: lakeviewDrugId(ctx, d.key) } },
          ...(m.dose ? { dose: m.dose } : {}), frequency: m.frequency, sig: `Take 1 tablet by mouth ${FREQ_SIG[m.frequency]}`,
          reason_text: `Prescribed by Lakeview nephrology${prescriberName ? ` (Dr. ${nameParts(staff(prescriberName)).last})` : ""} ${+dt.slice(5, 7)}/${+dt.slice(8, 10)}/${dt.slice(0, 4)}`,
        },
      };
      const it = mk(itemKey, lag.since, addMinutes(lag.since, 2.85), payload, {}, nurse);
      const ex = ctx.example("B", itemKey);
      const note = eventNote(ctx, itemKey, "Medication reconciliation comment (phone)", lag.since, [{ id: "med_1", about: `${d.ingredient} ${m.doseText} ${m.frequency} added from the outside (Lakeview) record` }], [m.id], nurse);
      push({ key: itemKey, file: `${localDate(lag.since)}-med-${d.ingredient}-outside.folio.md`, item: it, narrativeKind: ex ? "fixture" : "prose", note: ex ? undefined : note,
        template: `<ref id="med_1">${d.ingredient} ${m.doseText} daily added per outside record.</ref>`, facts: [m.id], traps: ["T1", "T16"], fixture: ex?.file });
    }
  }

  // Visits: note + billing dx, vital sets, list reviews. A vital set belongs to the nearest visit that day.
  const vitalEnc = (v: (typeof p.vitals)[number]) => encs.filter((e) => localDate(e.start) === localDate(v.at)).sort((a, b) => Math.abs(ms(a.start) - ms(v.at)) - Math.abs(ms(b.start) - ms(v.at)))[0];
  for (const e of encs) {
    const vid = visitId(e);
    const doc = e.documents[0];
    const dxs: Record<string, Record<string, unknown>> = {};
    let rank = 0;
    for (const z of e.billingExtra ?? []) dxs[`dx_${++rank}`] = { type: "billing_dx", visit_id: vid, rank, icd10cm: z.icd10, display: z.display };
    for (const a of e.addressed ?? []) {
      const c = p.conditions.find((x) => x.id === a.conditionId)!;
      const icd = a.icd10 ?? billingIcd(p, c, e.start);
      dxs[`dx_${++rank}`] = { type: "billing_dx", visit_id: vid, rank, icd10cm: icd, display: icdDisplay(icd), ...(c.sensitive ? { restricted: "BH" } : {}) };
    }
    if (doc) {
      const itemKey = `B/visit/${e.id}`;
      const it = mk(itemKey, e.start, doc.signedAt, { visit: { type: "visit", visit_id: vid, visit_type: e.kind === "office" ? "office" : e.kind, reason: e.reason }, ...dxs }, {}, doc.author);
      const ex = ctx.example("B", itemKey);
      const dxKeyOf: Record<string, string> = {};
      (e.addressed ?? []).forEach((a, i) => (dxKeyOf[a.conditionId] = `dx_${i + 1 + (e.billingExtra?.length ?? 0)}`));
      const note = visitNote(ctx, itemKey, e, doc.factIds, dxKeyOf);
      push({ key: itemKey, file: `${localDate(e.start)}-visit-note.folio.md`, item: it, narrativeKind: ex ? "fixture" : "prose", note: ex ? undefined : note,
        template: [`${e.reason}.`, ...note.spans.map((s) => `<ref id="${s.id}">${s.statement}</ref>`), ...note.mustInclude.map((m) => m.statement)].join("\n\n"),
        facts: doc.factIds, traps: doc.factIds.some((id) => p.sensitivity.some((s) => s.factIds.includes(id))) ? ["T19"] : [], fixture: ex?.file });
    }
    for (const v of p.vitals.filter((x) => x.source === "B" && vitalEnc(x) === e)) {
      const itemKey = `B/vitals/${v.id}`;
      const payload = {
        vitals: {
          type: "vital_set", visit_id: vid, ...(v.bp ? { bp: `${v.bp.systolic}/${v.bp.diastolic}` } : {}),
          ...(v.bpRepeat ? { bp_repeat: `${v.bpRepeat.systolic}/${v.bpRepeat.diastolic}` } : {}),
          ...(v.pulse !== undefined ? { pulse_bpm: v.pulse } : {}), ...(v.weightKg !== undefined ? { weight_lb: Math.round((v.weightKg / 0.45359237) * 10) / 10 } : {}),
          ...(v.heightIn !== undefined ? { height_in: v.heightIn } : {}), ...(v.tempF !== undefined ? { temp_f: v.tempF } : {}), ...(v.spo2 !== undefined ? { spo2_pct: v.spo2 } : {}),
        },
      };
      push({ key: itemKey, file: `${localDate(v.at)}-vitals.folio.md`, item: mk(itemKey, v.at, addMinutes(v.at, 1.5), payload, {}, e.clinician ?? pcp), narrativeKind: "none", facts: [v.id], traps: ["T9"] });
    }
    for (const list of e.reviewed ?? []) {
      const at = addMinutes(e.start, 40);
      const lines = list === "problems"
        ? p.conditions.filter((c) => c.history.some((h) => h.recordedBy === "B" && sortKey(h.at) <= ms(at)) && problemLine.has(c.id) && !c.history.some((h) => h.recordedBy === "B" && h.status === "resolved" && sortKey(h.at) <= ms(at))).map((c) => problemLine.get(c.id)!)
        : list === "medications" ? medLines.filter((l) => ms(l.start) <= ms(at) && (!l.end || ms(l.end) > ms(at))).map((l) => l.lineId)
        : p.allergies.filter((a) => a.recordedBy === "B" && ms(a.recordedAt) <= ms(at)).map((a) => ctx.id("B", "allergy", a.id, (r) => `AL-${r.int(2000, 4999)}`));
      const itemKey = `B/review/${e.id}/${list}`;
      push({ key: itemKey, file: `${localDate(at)}-${list}-reviewed.folio.md`, item: mk(itemKey, at, addMinutes(at, 0.2), { review: { type: "list_reviewed", list, lines_on_list: lines, visit_id: vid } }, {}, e.clinician ?? pcp),
        narrativeKind: "none", facts: [], traps: list === "problems" && p.conditions.some((c) => c.traps?.includes("T5")) ? ["T5"] : [] });
    }
  }

  // Imported results: Northgate's own copy of each Lakeview report, one item per accession (T14).
  const byAccession = new Map<string, { versions: RenderedItem[] }>();
  for (const li of lakeview.filter((x) => x.key.startsWith("C/lab/"))) {
    const accs = new Set(Object.values(li.item.payload).filter((r) => r.type === "LAB_ORDER" && r.ORDER_STATUS !== 9).map((r) => r.ACCESSION as string));
    for (const a of accs) {
      if (!byAccession.has(a)) byAccession.set(a, { versions: [] });
      byAccession.get(a)!.versions.push(li);
    }
  }
  for (const [acc, { versions }] of byAccession) {
    const drawId = versions[0].key.split("/")[2];
    const draw = p.draws.find((d) => d.id === drawId)!;
    const labsHere = p.labs.filter((l) => l.draw === drawId && l.copies?.includes("B"));
    if (!labsHere.length) continue;
    let prev: string | undefined;
    versions.forEach((li, vi) => {
      const rows = li.item.payload;
      const orders = Object.values(rows).filter((r) => r.type === "LAB_ORDER" && r.ACCESSION === acc && r.ORDER_STATUS !== 9);
      const orderIds = new Set(orders.map((o) => o.ORDER_ID));
      const payload: Item["payload"] = {};
      let lastResulted = 0;
      for (const r of Object.values(rows).filter((x) => x.type === "LAB_RESULT" && orderIds.has(x.ORDER_ID))) {
        const t = NFM[r.TEST_CODE as string];
        const scale = r.TEST_CODE === "LK-PLT" || r.TEST_CODE === "LK-WBC";
        const withdrawn = r.RESULT_STATUS === "C";
        const order = orders.find((o) => o.ORDER_ID === r.ORDER_ID)!;
        const nOrder = draw.orderedBy === "B" ? ctx.id("B", "order", `${drawId}/${order.ORDER_CODE}`, (rr) => `NO-${localDate(draw.collectedAt).slice(0, 4)}-${rr.int(50000, 99999)}`) : undefined;
        const value = withdrawn ? "Result invalidated" : scale ? String(Math.round(Number(r.VALUE_TEXT) * 1000)) : (r.VALUE_TEXT as string);
        const range = scale && r.REF_RANGE_TEXT ? (r.REF_RANGE_TEXT as string).replace(/[\d.]+/g, (x) => String(Math.round(Number(x) * 1000))) : r.REF_RANGE_TEXT;
        const resulted = (withdrawn ? r.STATUS_CHANGED_AT : r.RESULTED_AT) as string;
        lastResulted = Math.max(lastResulted, ms(resulted));
        payload[t.key] = {
          type: "imported_result", test: { nfm_code: t.code, name: t.name, ...(r.LOINC ? { loinc: r.LOINC } : {}) }, value,
          unit: scale ? "cells/uL" : (r.UNIT_CODE as string) ?? "", ...(range ? { reference_range: range } : {}),
          ...(!withdrawn && r.ABN_FLAG && r.ABN_FLAG !== "N" ? { flag: r.ABN_FLAG } : {}),
          result_status: withdrawn ? "C" : r.RESULT_STATUS === "P" ? "P" : "F", collected: draw.collectedAt, resulted,
          ...(r.COMMENT_TEXT ? { comment: r.COMMENT_TEXT } : {}),
          external_ref: { lab: "Lakeview Labs", accession: acc, result_code: r.TEST_CODE }, ...(nOrder ? { order_id: nOrder } : {}),
        };
      }
      if (vi > 0 && !Object.values(payload).some((x) => x.result_status === "C")) return;
      const itemKey = `B/import/${acc}/${vi}`;
      const it = mk(itemKey, draw.collectedAt, addMinutes(new Date(lastResulted).toISOString(), 4 + (vi ? 0 : 7)), payload, prev ? { supersedes: [prev] } : {});
      prev = it.id;
      const ex = ctx.example("B", itemKey);
      const traps = new Set<string>(["T14", "T9"]);
      for (const l of labsHere) for (const t of l.traps ?? []) traps.add(t);
      if (vi) traps.add("T3");
      push({ key: itemKey, file: `${localDate(draw.collectedAt)}-lakeview-${acc.toLowerCase()}${vi ? "-corrected" : ""}.folio.md`, item: it, narrativeKind: "none",
        facts: labsHere.map((l) => l.id), traps: [...traps] as RenderedItem["traps"], fixture: ex?.file });
    });
  }

  // Referrals.
  for (const rf of p.referrals ?? []) {
    if (rf.by !== "B") continue;
    const rid = ctx.id("B", "referral", rf.id, (r) => `RF-${localDate(rf.created).slice(0, 4)}-${String(r.int(100, 1999)).padStart(4, "0")}`);
    const enc = rf.encounter ? encs.find((e) => e.id === rf.encounter) : undefined;
    const steps: [string, string | undefined][] = [["created", rf.created], ["scheduled", rf.scheduled], ["closed", rf.closed]];
    for (const [action, at] of steps) {
      if (!at) continue;
      const dxs: Item["payload"] = {};
      rf.dx.forEach((cid, i) => {
        const c = p.conditions.find((x) => x.id === cid)!;
        const icd = billingIcd(p, c, rf.created);
        dxs[`dx_${i + 1}`] = { type: "referral_dx", referral_id: rid, icd10cm: icd, display: problemDisplay(c, rf.created), ...(c.sensitive ? { restricted: "BH" } : {}) };
      });
      const itemKey = `B/referral/${rf.id}/${action}`;
      const who = action === "created" ? rf.author : nurse;
      const payload = { referral: { type: "referral_event", referral_id: rid, action, to: rf.to, question: rf.question, urgency: rf.urgency, ...(action === "scheduled" && rf.appointmentOn ? { appointment_on: rf.appointmentOn } : {}) }, ...dxs };
      const it = mk(itemKey, at, addMinutes(at, 1.2), payload, {}, who);
      const created = action === "created";
      const note = created ? eventNote(ctx, itemKey, `Referral letter to ${rf.to.org} (${rf.to.specialty})`, at, [{ id: "referral", about: `referral: ${rf.question}` }], rf.factIds, rf.author) : undefined;
      if (note) { note.length = "80-160 words, a short letter"; note.style = "northgate:letter"; }
      push({ key: itemKey, file: `${localDate(at)}-referral-${action}.folio.md`, item: it, narrativeKind: created ? "prose" : "none", note,
        template: created ? `<ref id="referral">Referral to ${rf.to.org}: ${rf.question}</ref>` : undefined, facts: rf.factIds, traps: created ? ["T5"] : [] });
      void enc;
    }
  }
  return out;
}

function lakeviewDrugId(ctx: Ctx, key: string): string {
  return key === "finerenone-10" ? "LVD-04471" : `LVD-${String(ctx.rng.fork(`lvd/${key}`).int(1000, 4999)).padStart(5, "0")}`;
}

function problemDisplay(c: Condition, at: string): string {
  const stage = [...c.history].reverse().find((h) => h.recordedBy === "B" && h.stage && sortKey(h.at) <= sortKey(at))?.stage;
  return stage ? `Chronic kidney disease stage ${stage}` : c.name;
}

/** The ICD-10 code Northgate bills for a condition at a time. */
export function billingIcd(p: Patient, c: Condition, at: string): string {
  const own = [...c.history].reverse().find((h) => h.recordedBy === "B" && h.icd10 && sortKey(h.at) <= sortKey(at))?.icd10;
  if (own) return own;
  const base = c.coding.find((x) => x.system === "icd10")!.code;
  if (base === "E11.9") {
    const ckd = p.conditions.find((x) => x.coding.some((k) => k.code.startsWith("N18")) && x.history.some((h) => h.recordedBy === "B" && sortKey(h.at) <= sortKey(at)));
    if (ckd) return "E11.22";
  }
  return base;
}

function problemTraps(c: Condition, i: number): RenderedItem["traps"] {
  const t = new Set<string>(c.traps ?? []);
  if (c.onset.length < 10) t.add("T17"), t.add("T10");
  if (i === 0 && c.history.some((h) => h.recordedBy !== "B" && h.stage)) t.add("T5");
  return [...t] as RenderedItem["traps"];
}

function medTraps(m: Medication, action: string): RenderedItem["traps"] {
  const t = new Set<string>();
  if (action === "stop" && m.history.some((h) => h.status === "held" && h.by !== "B")) t.add("T1");
  if (action === "hold") t.add("T1");
  if (m.sensitive) t.add("T19");
  if (m.history.some((h) => h.status === "entered-in-error")) t.add("T4");
  return [...t] as RenderedItem["traps"];
}

function eventNote(ctx: Ctx, key: string, docKind: string, at: string, refs: NoteRequest["refs"], factIds: string[], who: string): NoteRequest {
  const p = ctx.p;
  const spanOf: Record<string, string> = {};
  if (refs[0]) for (const id of factIds) if (p.meds.some((m) => m.id === id) || p.conditions.some((c) => c.id === id)) spanOf[id] = refs[0].id;
  const g = guards(p, "B", at, factIds, spanOf);
  const mustInclude = factIds.flatMap((id) => {
    const f = p.narrativeFacts.find((x) => x.id === id);
    return f && !f.span?.B ? [{ statement: f.statement, evidence: f.evidence }] : [];
  });
  return {
    key, source: "B", docKind, when: inZone(at).slice(0, 16).replace("T", " "), author: `${staff(who).name} (${staff(who).role})`, mode: "markdown",
    refs, spans: [], mustInclude, context: factIds.filter((id) => !p.narrativeFacts.some((f) => f.id === id)).map((id) => describe(p, id, at)),
    forbidden: g.forbidden, sensitive: g.sensitive, length: "1-2 short lines", style: "northgate:event",
  };
}

function visitNote(ctx: Ctx, key: string, e: Encounter, factIds: string[], dxKeyOf: Record<string, string>): NoteRequest {
  const p = ctx.p;
  const doc = e.documents[0];
  const refs: NoteRequest["refs"] = [];
  const spans: NoteRequest["spans"] = [];
  const mustInclude: NoteRequest["mustInclude"] = [];
  const context: string[] = [];
  const spanOf: Record<string, string> = {};
  const isSensitive = (id: string) => p.sensitivity.some((s) => s.factIds.includes(id));
  // A sensitive diagnosis is discussed only inside the span of its own (restricted) billing entry;
  // a sensitive medication only inside that same span (spec: span boundaries are disclosure boundaries).
  const bhDx = factIds.find((id) => isSensitive(id) && dxKeyOf[id]);
  for (const id of factIds) {
    const f = p.narrativeFacts.find((x) => x.id === id);
    if (f?.span?.B) { spans.push({ id: f.span.B, statement: f.statement, evidence: f.evidence }); spanOf[id] = f.span.B; }
    else if (f) mustInclude.push({ statement: f.statement, evidence: f.evidence });
    else if (isSensitive(id) && bhDx) {
      spanOf[id] = dxKeyOf[bhDx];
      if (id === bhDx) refs.push({ id: dxKeyOf[bhDx], about: `${describe(p, id, e.start)} (restricted behavioral-health entry: keep every mention of it, and of its medication, inside this one span)` });
      else context.push(`${describe(p, id, e.start)} (mention only inside the ${dxKeyOf[bhDx]} span)`);
    } else if (!isSensitive(id)) mustInclude.push({ statement: describe(p, id, e.start), evidence: evidenceFor(p, id) });
  }
  const g = guards(p, "B", doc.signedAt, factIds, spanOf);
  return {
    key, source: "B", docKind: `Primary care ${e.kind === "phone" ? "phone" : e.kind} visit note (reason: ${e.reason})`, when: inZone(e.start).slice(0, 16).replace("T", " "),
    author: `${staff(doc.author).name} (${staff(doc.author).role})`, mode: "markdown", refs, spans, mustInclude, context,
    forbidden: g.forbidden, sensitive: g.sensitive, length: "3-7 short lines", style: "northgate:visit",
  };
}

export type { SourceKey, MedHistoryEntry };
