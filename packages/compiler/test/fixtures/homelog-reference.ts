// Hand-written reference mapper for HomeLog (harness author, from the schema). Key and scorer check only.
import type { FolioItem, ViewRows, MedicationRow, VitalRow } from "../in/views/views";

const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const localDay = (iso: string) => { const p = Object.fromEntries(fmt.formatToParts(new Date(iso)).map((x) => [x.type, x.value])); return `${p.year}-${p.month}-${p.day}`; };
const BRAND: Record<string, string> = {
  glucophage: "metformin", jardiance: "empagliflozin", farxiga: "dapagliflozin", invokana: "canagliflozin", glucotrol: "glipizide", januvia: "sitagliptin",
  ozempic: "semaglutide", trulicity: "dulaglutide", lantus: "insulin glargine", levemir: "insulin detemir", humalog: "insulin lispro", zestril: "lisinopril",
  vasotec: "enalapril", cozaar: "losartan", diovan: "valsartan", norvasc: "amlodipine", "toprol xl": "metoprolol", coreg: "carvedilol", aldactone: "spironolactone",
  kerendia: "finerenone", lasix: "furosemide", lipitor: "atorvastatin", crestor: "rosuvastatin", zoloft: "sertraline", lexapro: "escitalopram", advil: "ibuprofen",
  aleve: "naproxen", synthroid: "levothyroxine",
};
const KNOWN = ["metformin", "empagliflozin", "dapagliflozin", "canagliflozin", "glipizide", "sitagliptin", "semaglutide", "dulaglutide", "insulin glargine", "insulin detemir", "insulin lispro",
  "lisinopril", "enalapril", "losartan", "valsartan", "chlorthalidone", "hydrochlorothiazide", "amlodipine", "metoprolol", "carvedilol", "spironolactone", "finerenone", "furosemide",
  "atorvastatin", "rosuvastatin", "sertraline", "escitalopram", "ibuprofen", "naproxen", "aspirin", "levothyroxine"];
function ingredientOf(name: string, picked?: string): string | undefined {
  for (const s of [name, picked ?? ""]) {
    const n = s.toLowerCase();
    for (const [b, i] of Object.entries(BRAND)) if (n.includes(b)) return i;
    for (const k of KNOWN) if (n.includes(k)) return k;
    if (n.includes("glargine")) return "insulin glargine";
  }
  return undefined;
}

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const inScope = items.filter((i) => localDay(i.recorded) <= asOf);
  const dead = new Set<string>();
  for (const i of inScope) for (const id of [...(i.supersedes ?? []), ...(i.retracts ?? [])]) dead.add(id);
  const cur = inScope.filter((i) => !dead.has(i.id));

  const lists = cur.filter((i) => Object.values(i.payload ?? {}).some((e: any) => e?.type === "my_med")).sort((a, b) => a.effective.localeCompare(b.effective) || a.recorded.localeCompare(b.recorded));
  const list = lists[lists.length - 1];
  const medications: MedicationRow[] = list ? Object.entries(list.payload).filter(([, e]: any) => e.type === "my_med").map(([k, e]: any) => {
    const ing = ingredientOf(e.name, e.picked_from_search?.display);
    return {
      ...(ing ? { ingredient: ing } : {}), drug_name: e.name, status: e.status === "taking" ? "active" : "stopped",
      ...(e.status === "stopped" && e.stopped ? { status_since: e.stopped } : e.status === "taking" && e.started ? { status_since: e.started } : {}),
      ...(e.picked_from_search?.rxnorm && !ing ? {} : {}), patient_reported: true, ...(e.kind === "over_the_counter" ? { otc: true } : {}),
      ...(e.note ? { status_reason_text: e.note } : {}), evidence: [{ item_id: list.id, entry_id: k }],
    } as MedicationRow;
  }) : [];

  const vitals: VitalRow[] = [];
  for (const it of cur) for (const [k, e] of Object.entries(it.payload ?? {}) as [string, any][]) {
    if (e.type === "bp_reading") vitals.push({ setting: "home", local_time: e.measured_at, systolic_mmhg: e.systolic_mmhg, diastolic_mmhg: e.diastolic_mmhg, ...(e.pulse_bpm !== undefined ? { pulse_bpm: e.pulse_bpm } : {}), evidence: [{ item_id: it.id, entry_id: k }], _typed: e.entry_method === "typed" } as any);
    if (e.type === "glucose_reading") vitals.push({ setting: "home", local_time: e.measured_at, glucose_mg_dl: e.unit === "mmol/L" ? Math.round(e.value * 18.016) : e.value, ...(e.out_of_range ? { glucose_out_of_range: e.out_of_range } : {}), evidence: [{ item_id: it.id, entry_id: k }], _typed: e.entry_method === "typed" } as any);
  }
  // Drop typed duplicates of a device reading within 3 minutes with the same values.
  const mins = (s: string) => Date.parse(s + ":00Z") / 60000;
  const out = vitals.filter((v: any) => !(v._typed && vitals.some((w: any) => w !== v && !w._typed && Math.abs(mins(w.local_time) - mins(v.local_time)) <= 3 && w.systolic_mmhg === v.systolic_mmhg && w.glucose_mg_dl === v.glucose_mg_dl)));
  return { medications, problems: [], allergies: [], labs: [], vitals: out.map(({ _typed, ...v }: any) => v) };
}
