// Source P, HomeLog: the patient's own app. One day page per local day with readings, dose logs and
// diary notes (wall-clock times with no offset, T10; glucose in the meter's unit, T6), and one item
// per save of the patient's own medicine list. Edits re-publish the whole page (supersedes, T14).

import { MGDL_PER_MMOL_GLUCOSE } from "../../truth/src/catalog.ts";
import { addDays, type HomeLogPlan, inZone, localDate, ms, type Patient, wall } from "../../truth/src/model.ts";
import { Ctx, ISSUER, personName, type NoteRequest, type RenderedItem } from "./context.ts";
import { describe, evidenceFor } from "./describe.ts";
import { guards } from "./guards.ts";
import { type Item, schemaRef, ulid } from "./item.ts";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function timeLabel(w: string): string {
  const h = +w.slice(11, 13), m = w.slice(14, 16);
  return `${h % 12 === 0 ? 12 : h % 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

export function renderHomeLog(ctx: Ctx): RenderedItem[] {
  const p = ctx.p;
  if (!p.sources.P) return [];
  const tz = p.demographics.tz;
  const plan: HomeLogPlan = p.home ?? { notes: [], doses: [], listSaves: [] };
  const local = p.sources.P.localId;
  const author = { id: `urn:homelog:user:${local}`, name: personName(p), role: "Patient" };
  const out: RenderedItem[] = [];

  // homelog_med_id: order in which medicines first appear on her list.
  const hlId = new Map<string, string>();
  for (const s of plan.listSaves) for (const e of s.entries) if (!hlId.has(e.medId)) hlId.set(e.medId, `med_${hlId.size + 1}`);
  const nameOn = (medId: string, date: string) => {
    const save = [...plan.listSaves].reverse().find((s) => s.at <= date && s.entries.some((e) => e.medId === medId)) ?? plan.listSaves.find((s) => s.entries.some((e) => e.medId === medId));
    return save?.entries.find((e) => e.medId === medId)?.name ?? medId;
  };

  // Day pages.
  const days = new Map<string, { vitals: typeof p.vitals; doses: HomeLogPlan["doses"]; notes: HomeLogPlan["notes"] }>();
  const day = (d: string) => days.get(d) ?? (days.set(d, { vitals: [], doses: [], notes: [] }), days.get(d)!);
  for (const v of p.vitals.filter((x) => x.source === "P")) day(localDate(v.at, tz)).vitals.push(v);
  for (const d of plan.doses) day(localDate(d.at, tz)).doses.push(d);
  for (const n of plan.notes) day(localDate(n.at, tz)).notes.push(n);

  for (const date of [...days.keys()].sort()) {
    const { vitals, doses, notes } = days.get(date)!;
    const edit = plan.edits?.find((e) => e.date === date) ?? (vitals.some((v) => v.typo) ? { date, recordedAt: vitals.find((v) => v.typo)!.typo!.fixedAt } : undefined);
    const versions = edit ? [0, 1] : [0];
    let prev: string | undefined;
    for (const vi of versions) {
      const payload: Item["payload"] = {};
      let n = 0;
      for (const v of vitals.filter((x) => x.kind === "home-glucose").sort((a, b) => ms(a.at) - ms(b.at))) {
        const mmol = v.renderedUnit === "mmol/L";
        const hi = v.glucose! > 600, lo = v.glucose! < 20;
        const value = hi ? (mmol ? 33.3 : 600) : lo ? (mmol ? 1.1 : 20) : mmol ? Math.round((v.glucose! / MGDL_PER_MMOL_GLUCOSE) * 10) / 10 : v.glucose!;
        payload[`glu_${++n}`] = {
          type: "glucose_reading", measured_at: wall(v.at, tz), value, unit: mmol ? "mmol/L" : "mg/dL",
          ...(hi ? { out_of_range: "HI" } : lo ? { out_of_range: "LO" } : {}),
          ...(v.mealMarker ? { meal_marker: v.mealMarker } : {}), entry_method: v.entryMethod === "typed" ? "typed" : "meter_sync",
        };
      }
      n = 0;
      for (const v of vitals.filter((x) => x.kind === "bp").sort((a, b) => ms(a.at) - ms(b.at))) {
        const bp = vi === 0 && v.typo ? { ...v.bp!, ...v.typo } : v.bp!;
        payload[`bp_${++n}`] = {
          type: "bp_reading", measured_at: wall(v.at, tz), systolic_mmhg: bp.systolic, diastolic_mmhg: bp.diastolic,
          ...(v.pulse !== undefined ? { pulse_bpm: v.pulse } : {}), entry_method: v.entryMethod === "typed" ? "typed" : "cuff_sync",
          ...(v.arm ? { arm: v.arm } : {}),
        };
      }
      n = 0;
      for (const d of doses.sort((a, b) => ms(a.at) - ms(b.at))) {
        payload[`dose_${++n}`] = {
          type: "dose_log", at: wall(d.at, tz), homelog_med_id: hlId.get(d.medId) ?? "med_0", med_name: nameOn(d.medId, date), status: "taken",
          amount: d.amount, amount_unit: "units",
        };
      }
      n = 0;
      const sortedNotes = notes.sort((a, b) => ms(a.at) - ms(b.at));
      for (const note of sortedNotes) {
        payload[`note_${++n}`] = {
          type: "diary_note", written_at: wall(note.at, tz), symptom_tags: note.tags,
          ...(note.severity && note.tags.length ? { severity: note.severity } : {}),
        };
      }
      const itemKey = `P/day/${date}/${vi}`;
      const ex = ctx.example("P", itemKey);
      const syncRng = ctx.rng.fork(`sync/${date}`);
      const defaultRec = `${addDays(date, 1)}T0${syncRng.int(5, 7)}:${String(syncRng.int(0, 59)).padStart(2, "0")}:${String(syncRng.int(0, 59)).padStart(2, "0")}Z`;
      const recorded = ex?.recorded ?? (vi === 1 ? edit!.recordedAt : defaultRec);
      const id = ex?.id ?? ctx.hints.itemIds[itemKey] ?? ulid(recorded, `P/${p.id}/${itemKey}`);
      const item: Item = {
        folio: "0.1", id, issuer: ISSUER.P, patient: local, effective: date, recorded, author,
        schema: schemaRef("homelog", "HomeLogEntry"), ...(prev ? { supersedes: [prev] } : {}), narrative: ex?.narrative ?? "", payload,
      };
      prev = id;
      const factIds = sortedNotes.flatMap((x) => x.factIds);
      let note: NoteRequest | undefined;
      if (sortedNotes.length && !ex && vi === 0) {
        const skeleton = sortedNotes.map((x, i) => `**${timeLabel(wall(x.at, tz))}** — <ref id="note_${i + 1}">[words]</ref>`).join("\n\n");
        const g = guards(p, "P", sortedNotes[sortedNotes.length - 1].at, factIds, {});
        note = {
          key: itemKey, source: "P", docKind: "Diary notes typed by the patient into her phone app", when: date, author: `${personName(p)} (the patient)`,
          mode: "markdown", refs: sortedNotes.map((x, i) => ({ id: `note_${i + 1}`, about: `note written ${timeLabel(wall(x.at, tz))}; tags: ${x.tags.join(", ") || "none"}` })),
          spans: [],
          mustInclude: factIds.map((id) => p.narrativeFacts.find((f) => f.id === id)).filter((f) => f && f.visibility.P).map((f) => ({ statement: f!.statement, evidence: f!.evidence })),
          context: [...factIds.filter((id) => !p.narrativeFacts.some((f) => f.id === id)).map((id) => describe(p, id, sortedNotes[0].at)),
            ...vitals.map((v) => `reading that day: ${describe(p, v.id)}`)],
          forbidden: g.forbidden, sensitive: g.sensitive, length: "1-3 sentences per note, in her own voice", style: "homelog:diary",
          skeleton, gist: sortedNotes.map((x, i) => `note_${i + 1}: ${x.gist}`),
        };
      }
      const traps = new Set<string>(["T10"]);
      if (vitals.some((v) => v.renderedUnit === "mmol/L")) traps.add("T6");
      if (vi === 1 || vitals.some((v) => v.duplicateOf)) traps.add("T14");
      if (factIds.some((id) => p.narrativeFacts.find((f) => f.id === id)?.traps?.includes("T13"))) traps.add("T13");
      out.push({
        source: "P", dir: "homelog", key: itemKey, file: `${date}-day${vi ? "-edited" : ""}.folio.md`, item,
        narrativeKind: ex ? "fixture" : sortedNotes.length ? "prose" : "none", note, narrativeFrom: vi === 1 && !ex ? `P/day/${date}/0` : undefined,
        template: sortedNotes.length ? sortedNotes.map((x, i) => `**${timeLabel(wall(x.at, tz))}** — <ref id="note_${i + 1}">${x.gist.replace(/[<>]/g, "")}</ref>`).join("\n\n") : undefined,
        facts: [...vitals.map((v) => v.id), ...doses.map((d) => d.id), ...factIds], traps: [...traps] as RenderedItem["traps"], fixture: ex?.file,
      });
    }
  }

  // My Medicines saves.
  let prevList: string | undefined;
  for (const save of plan.listSaves) {
    const payload: Item["payload"] = {};
    for (const e of save.entries) {
      const m = p.meds.find((x) => x.id === e.medId)!;
      const id = hlId.get(e.medId)!;
      payload[id] = {
        type: "my_med", homelog_med_id: id, name: e.name, ...(e.picked ? { picked_from_search: e.picked } : {}),
        ...(e.strengthText ? { strength_text: e.strengthText } : {}), ...(e.howITakeIt ? { how_i_take_it: e.howITakeIt } : {}),
        status: e.status, ...(e.started ? { started: e.started } : {}), ...(e.stopped ? { stopped: e.stopped } : {}),
        kind: m.otc ? "over_the_counter" : "prescription", ...(e.note ? { note: e.note } : {}),
      };
    }
    const itemKey = `P/meds/${save.at}`;
    const ex = ctx.example("P", itemKey);
    const r = ctx.rng.fork(`list/${save.at}`);
    const recorded = ex?.recorded ?? save.recordedAt ?? `${save.at}T${String(r.int(14, 23)).padStart(2, "0")}:${String(r.int(0, 59)).padStart(2, "0")}:${String(r.int(0, 59)).padStart(2, "0")}Z`;
    const id = ex?.id ?? ctx.hints.itemIds[itemKey] ?? ulid(recorded, `P/${p.id}/${itemKey}`);
    const item: Item = {
      folio: "0.1", id, issuer: ISSUER.P, patient: local, effective: save.at, recorded, author, schema: schemaRef("homelog", "HomeLogEntry"),
      ...(prevList ? { supersedes: [prevList] } : {}),
      narrative: ex?.narrative ?? `My Medicines, saved ${+save.at.slice(8, 10)} ${MONTHS[+save.at.slice(5, 7) - 1]} ${save.at.slice(0, 4)}.`, payload,
    };
    prevList = id;
    const traps = new Set<string>(["T14"]);
    if (save.entries.some((e) => p.meds.find((m) => m.id === e.medId)?.otc)) traps.add("T13");
    if (p.sensitivity.some((s) => save.entries.some((e) => s.factIds.includes(e.medId)))) traps.add("T19");
    out.push({
      source: "P", dir: "homelog", key: itemKey, file: `${save.at}-my-medicines.folio.md`, item, narrativeKind: ex ? "fixture" : "app",
      facts: save.entries.map((e) => e.medId), traps: [...traps] as RenderedItem["traps"], fixture: ex?.file,
    });
  }
  void evidenceFor;
  return out;
}
