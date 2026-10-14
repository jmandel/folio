// Display helpers: dates, item titles, one-line entry summaries. These are generic readings of
// native payloads for a human browsing the record; they are not mappers and drive no logic.

import type { Envelope, NarrativePart, Payload } from "@folio/core";

export const TZ = "America/Chicago";
const DATE_ONLY = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Milliseconds for sorting. Date-only values sort at local noon of their first day. */
export function sortKey(when: string): number {
  if (DATE_ONLY.test(when)) {
    const [y, m = "01", d = "01"] = when.split("-");
    return Date.parse(`${y}-${m}-${d}T12:00:00-06:00`);
  }
  const t = Date.parse(when);
  return Number.isNaN(t) ? 0 : t;
}

const dtf = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
});

function zoned(when: string) {
  const parts = Object.fromEntries(dtf.formatToParts(new Date(when)).map((p) => [p.type, p.value]));
  return parts as Record<string, string>;
}

/** Local calendar parts (America/Chicago) of an instant or a date. Keeps a partial date's precision. */
export function localDate(when: string): { y: string; m?: string; d?: string; time?: string; zone?: string } {
  if (DATE_ONLY.test(when)) {
    const [y, m, d] = when.split("-");
    return { y, m, d };
  }
  if (!/[zZ]|[+-]\d{2}:\d{2}$/.test(when)) {
    // Zone-less payload time (HomeLog wall clock): show as written.
    const [date, time] = when.split("T");
    const [y, m, d] = date.split("-");
    return { y, m, d, time: time?.slice(0, 5) };
  }
  const p = zoned(when);
  const m = String(MONTHS.indexOf(p.month) + 1).padStart(2, "0");
  return { y: p.year, m, d: p.day.padStart(2, "0"), time: `${p.hour}:${p.minute}`, zone: p.timeZoneName };
}

export function fmtDate(when: string, withTime = false): string {
  const l = localDate(when);
  if (!l.m) return l.y;
  if (!l.d) return `${MONTHS[+l.m - 1]} ${l.y}`;
  const base = `${MONTHS[+l.m - 1]} ${+l.d}, ${l.y}`;
  return withTime && l.time ? `${base}, ${l.time}${l.zone ? ` ${l.zone}` : ""}` : base;
}

export function fmtShortDate(when: string): string {
  const l = localDate(when);
  if (!l.m) return l.y;
  if (!l.d) return MONTHS[+l.m - 1];
  return `${MONTHS[+l.m - 1]} ${+l.d}`;
}

export const yearOf = (when: string) => localDate(when).y;

// ─── entries ────────────────────────────────────────────────────────────────────────────────────

type E = Record<string, any>;
const first = (e: E, keys: string[]) => {
  for (const k of keys) {
    const v = k.includes(".") ? k.split(".").reduce((o: any, p) => o?.[p], e) : e[k];
    if (v !== undefined && v !== null && v !== "" && typeof v !== "object") return String(v);
  }
  return undefined;
};

const NAME_KEYS = [
  "drug.name", "drug_name", "DRUG_NAME", "med_name", "name", "test.name", "TEST_NAME", "ORDER_NAME", "panel",
  "label", "display", "DX_TEXT", "description", "condition", "substance", "question", "document_kind",
  "list", "VITAL_CODE", "with", "reason", "measure",
];
const STATUS_KEYS = ["action", "status", "result_status", "RESULT_STATUS", "MED_STATUS", "NEW_STATUS", "ORDER_STATUS", "DX_STATUS"];

function valueOf(e: E): string | undefined {
  if (e.systolic_mmhg !== undefined) return `${e.systolic_mmhg}/${e.diastolic_mmhg} mmHg`;
  if (e.bp && typeof e.bp === "object" && e.bp.systolic !== undefined) return `BP ${e.bp.systolic}/${e.bp.diastolic}`;
  if (e.bp && typeof e.bp === "object" && e.bp.systolic_mmhg !== undefined) return `BP ${e.bp.systolic_mmhg}/${e.bp.diastolic_mmhg}`;
  if (e.VALUE_TEXT !== undefined) return `${e.VALUE_TEXT}${e.UNIT_CODE ? ` ${e.UNIT_CODE}` : ""}`;
  if (e.VALUE_NUM !== undefined) return `${e.VALUE_NUM}${e.UNIT_CODE ? ` ${e.UNIT_CODE}` : ""}`;
  if (e.value !== undefined && typeof e.value !== "object") return `${e.value}${e.unit ? ` ${e.unit}` : ""}`;
  if (e.dose && typeof e.dose === "object" && e.dose.value !== undefined) return `${e.dose.value} ${e.dose.unit ?? ""}`.trim();
  if (e.DOSE_QTY !== undefined) return `${e.DOSE_QTY} ${e.DOSE_UNIT ?? ""}`.trim();
  if (e.amount !== undefined) return `${e.amount} ${e.amount_unit ?? ""}`.trim();
  return first(e, ["dose_text", "strength_text", "sig"]);
}

export interface EntrySummary {
  type: string;
  name?: string;
  value?: string;
  status?: string;
}

export function summarize(entry: unknown): EntrySummary {
  const e = (entry ?? {}) as E;
  return { type: String(e.type ?? "entry"), name: first(e, NAME_KEYS), value: valueOf(e), status: first(e, STATUS_KEYS) };
}

export function summaryLine(entry: unknown): string {
  const s = summarize(entry);
  return [s.name, s.value].filter(Boolean).join(" ") || s.type;
}

/** Flattens an entry into label/value rows (nested objects as dotted paths; arrays of objects kept as tables). */
export function rows(entry: unknown, prefix = ""): { key: string; value: unknown }[] {
  const out: { key: string; value: unknown }[] = [];
  for (const [k, v] of Object.entries((entry ?? {}) as E)) {
    if (k === "type" && !prefix) continue;
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...rows(v, key));
    else out.push({ key, value: v });
  }
  return out;
}

// ─── item titles ────────────────────────────────────────────────────────────────────────────────

const plural = (n: number, s: string) => `${n} ${s}${n === 1 ? "" : "s"}`;

function headingOf(parts: NarrativePart[]): string | undefined {
  const text = parts.map((p) => (p.kind === "withheld" ? "…" : p.text)).join("");
  const m = /^\s*#{1,6}\s+(.+)$/m.exec(text);
  if (m && text.trimStart().startsWith("#")) return m[1].replace(/[*_`]/g, "").trim();
  return undefined;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");

export function itemTitle(source: string, env: Envelope, parts: NarrativePart[], payload: Payload): string {
  const h = headingOf(parts);
  if (h) return h;
  const entries = Object.values(payload) as E[];
  const types = (t: string) => entries.filter((e) => e.type === t);
  if (!entries.length) {
    if (env.retracts?.length) return "Retraction";
    const text = parts.map((p) => (p.kind === "withheld" ? "…" : p.text)).join("").replace(/<[^>]+>|[*_#`]/g, "").trim();
    return text.split(/(?<=\.)\s/)[0].slice(0, 80) || "Note";
  }
  switch (source) {
    case "homelog": {
      if (types("my_med").length) return "My medicines list";
      const bits: string[] = [];
      const n = (t: string, label: string) => types(t).length && bits.push(plural(types(t).length, label));
      n("bp_reading", "BP reading");
      n("glucose_reading", "glucose reading");
      n("dose_log", "dose");
      n("diary_note", "diary note");
      return `Day page: ${bits.join(", ")}`;
    }
    case "lakeview": {
      const orders = types("LAB_ORDER");
      if (orders.length) return `Lab report: ${[...new Set(orders.map((o) => o.ORDER_NAME))].join(", ")}`;
      const v = types("CLINIC_VISIT")[0];
      if (v) return v.VISIT_TYPE === "TEL" || v.VISIT_TYPE === "PH" ? "Nephrology telephone contact" : "Nephrology visit";
      break;
    }
    case "northgate": {
      const e = entries[0];
      if (e.type === "med_event") return `Medication ${e.action}: ${e.drug?.name ?? ""}`.trim();
      if (e.type === "problem_event") return `Problem ${e.action}: ${e.description ?? ""}`.trim();
      if (e.type === "allergy_event") return `Allergy ${e.action}: ${e.substance?.name ?? e.substance ?? ""}`;
      if (e.type === "imported_result") return `Imported results: ${[...new Set(types("imported_result").map((r) => r.test?.name))].slice(0, 4).join(", ")}${types("imported_result").length > 4 ? ", …" : ""}`;
      if (e.type === "vital_set") return "Vital signs";
      if (e.type === "visit") return `Visit: ${e.reason ?? cap(e.visit_type ?? "")}`;
      if (e.type === "referral_event") return `Referral ${e.action}${e.to ? `: ${typeof e.to === "object" ? [e.to.org, e.to.specialty].filter(Boolean).join(", ") : e.to}` : ""}`;
      if (e.type === "chart_correction") return "Chart correction";
      break;
    }
  }
  const s = summarize(entries[0]);
  return `${cap(s.type.toLowerCase())}${s.name ? `: ${s.name}` : ""}${entries.length > 1 ? ` and ${entries.length - 1} more` : ""}`;
}
